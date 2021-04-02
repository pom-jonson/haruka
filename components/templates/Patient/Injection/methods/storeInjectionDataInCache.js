import { persistedState } from "~/helpers/cache";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
// import * as localApi from "~/helpers/cacheLocal-utils";
// import * as patientApi from "~/helpers/cachePatient-utils";

export default async function(data=null) {
  let { persistState, cacheInjectState } = persistedState(this.props.match.params.id);
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let hour = newDate.getHours();
  let minute = newDate.getMinutes();
  let second = newDate.getSeconds();

  let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${
    date < 10 ? `0${date}` : `${date}`
  } ${hour < 10 ? `0${hour}` : `${hour}`}:${
    minute < 10 ? `0${minute}` : `${minute}`
  }:${second < 10 ? `0${second}` : `${second}`}`;

  let newFlg = true;
  if (cacheInjectState) {
    Object.keys(cacheInjectState).map(key=>{
      if (key == this.m_cacheSerialNumber) {
        newFlg = false;
      }
    })
    cacheInjectState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);    
  } else {
    cacheInjectState = [];
  }

  if (cacheInjectState == undefined || cacheInjectState == null) cacheInjectState = [];

  // --------------- 禁忌 -------------------
  // let injectData = this.state.injectData;
  let injectData = data != null && data != undefined && data.injectData != undefined ? data.injectData : this.state.injectData;
  // let diseaseData = this.state.patientDiseaseData;
  // let diseaseData = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_DATA)); // 病名禁忌
  // let diseaseData = patientApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE); // 病名禁忌
  let diseaseData = await this.getContraindicationsToDiseaseApi(this.props.match.params.id); // 病名禁忌
  let selDiseaseData = {};

    let temp_array = [];
    injectData.map((order, rpIdx) => {
      order.medicines.map((medicine, medIdx) => {
        var array = {
          rpIdx: rpIdx,
          medIdx: medIdx,
          medicine: medicine
        };
        temp_array.push(array);
      });
    });

    let duplciate_permission = 0;
    let alert_permission = 0;

    // ------------- alert permission for double injection start-----------//

    let cacheStateForAlertPermission = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_EDIT);   
    // get other presData, not own presData
    let _all_temp_array = [];      

    if (cacheStateForAlertPermission != undefined || cacheStateForAlertPermission != null) {
      if (Object.keys(cacheStateForAlertPermission).length > 0) {
        let arr = [];
        Object.keys(cacheStateForAlertPermission).forEach(function(key){
            arr.push(key);
        });            
        for (let p = 0; p < arr.length; p ++) {
          let _injectData = cacheStateForAlertPermission[arr[p]][0].injectData; 
          _injectData.map((_order, _rpIdx) => {
            _order.medicines.map((_medicine, _medIdx) => {
              var _array = {
                rpIdx: _rpIdx,
                medIdx: _medIdx,
                medicine: _medicine
              };
              _all_temp_array.push(_array);
            });
          });
        }
      }        
    } 
    // let alert_permission_array = getAlertPermissionInfor(temp_array, cacheStateForAlertPermission);    

    // ------------- alert permission for double injection end-----------//

    for (var i = 0; i < temp_array.length - 1; i++) {
      duplciate_permission = 0;
      alert_permission = 0;
      for (var j = 0; j < temp_array.length - 1; j++) {
        if (i == j) continue;
        // 重複禁忌
        if (temp_array[i].medicine.medicineId == temp_array[j].medicine.medicineId) {
          duplciate_permission = 1;
        }
        // 併用禁忌       
        let status = 0;
        status = this.getAlertReject(temp_array[i].medicine, temp_array[j].medicine);
        if( (status & 1) > 0) {
            alert_permission = 1;
        }
       
        status = this.getAlertReject(temp_array[j].medicine, temp_array[i].medicine);
        if( (status & 1) > 0) {
            alert_permission = 1;
        }
      }
      // 病名禁忌    
      if (this.props.match.params.id !== undefined && this.props.match.params.id !== null) {
        selDiseaseData = getDiseasePermissions(diseaseData, temp_array[i].medicine);
      }

      injectData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].duplciate_permission = duplciate_permission;
      injectData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].alert_permission = alert_permission;
      injectData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].disease_permission = (Object.keys(selDiseaseData).length == 0) ? 0 : 1;
      injectData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].disease_alert_content = selDiseaseData;
    }

    for (var m = 0; m < temp_array.length - 1; m++) {
      alert_permission = 0;
      for (var n = 0; n < _all_temp_array.length - 1; n++) {
        // if (m == n) continue;        
        // 併用禁忌        
        let status = 0;
        status = this.getAlertReject(temp_array[m].medicine, _all_temp_array[n].medicine);
        if( (status & 1) > 0) {
            alert_permission = 1;
        }        
        
        status = this.getAlertReject(_all_temp_array[n].medicine, temp_array[m].medicine);
        if( (status & 1) > 0) {
            alert_permission = 1;
        }
      }      
      injectData[temp_array[m].rpIdx].medicines[temp_array[m].medIdx].alert_permission |= alert_permission;
    }

    //加算項目------------------------------
    let additions = {};
    if(data != null && data.additions_check !== undefined && data.additions_send_flag_check !== undefined && Object.keys(data.additions_check).length > 0){
        let additions_check = data.additions_check;
        let additions_send_flag_check = data.additions_send_flag_check;
        if(this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0){
            Object.keys(additions_check).map(key => {
                if (additions_check[key]){
                    let addition_row = '';
                    this.state.additions.map(addition => {
                        if (addition.addition_id == key){
                            addition['sending_flag'] = 2;
                            if(addition.sending_category === 1){
                                addition['sending_flag'] = 1;
                            }
                            if(addition.sending_category === 3 && additions_send_flag_check[key]){
                                addition['sending_flag'] = 1;
                            }
                            addition_row = addition;
                        }
                    });
                    additions[key] = addition_row;
                }
            })
        }
    } else {
        let cache_data_addition = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
        if(cache_data_addition !== undefined && cache_data_addition != null && cache_data_addition[0]['additions'] !== undefined && Object.keys(cache_data_addition[0]['additions']).length > 0){
            additions = cache_data_addition[0]['additions'];
        }
    }

  let item_details = [];
  Object.keys(this.state.item_details).map((index) => {
    if(this.state.item_details[index] != null && this.state.item_details[index] != undefined && this.state.item_details[index]['item_id'] != null && this.state.item_details[index]['item_id'] !== 0){    
      let detail_row = {};
      Object.keys(this.state.item_details[index]).map(idx=>{
        detail_row[idx] = this.state.item_details[index][idx];
      });
      item_details.push(detail_row);
    }
  });
  if (newFlg) {
    cacheInjectState.push({
      user_number: persistState.user_number,
      system_patient_id: parseInt(this.props.match.params.id),
      time: now,
      created_at: injectData.created_at,
      schedule_date: this.modal_obj.schedule_date,
      injectData: injectData,
      number: this.state.isForUpdate ? this.state.orderNumber : undefined,
      insurance_type: 0, //保険情報現状固定
      free_comment: Array.isArray(this.state.free_comment)
        ? this.state.free_comment
        : [this.state.free_comment], //備考
      department_code: this.context.department.code, //this.state.departmentId,
      department: this.context.department.name, //this.state.department,
      karte_status_code: this.context.karte_status.code,
      karte_status_name: this.context.karte_status.name,
      is_completed : this.modal_obj.inOut,
      patient_name: this.state.patientInfo.name,
      medical_department_name: this.context.medical_department_name,
      duties_department_name: this.context.duties_department_name,
      unusedDrugSearch: this.state.unusedDrugSearch,
      profesSearch: this.state.profesSearch,
      normalNameSearch: this.state.normalNameSearch,
      isForInjectionUpdate: false,
      additions: additions,
      item_details:item_details.length > 0 ? item_details: this.state.item_details,
      location_id:this.modal_obj.location_id,
      drip_rate:this.modal_obj.drip_rate,
      water_bubble:this.modal_obj.water_bubble,
      exchange_cycle:this.modal_obj.exchange_cycle,
      require_time:this.modal_obj.require_time,
    });

    if (this.state.staff_category === 2) {
      cacheInjectState[0].doctor_name = this.context.selectedDoctor.name;
      cacheInjectState[0].doctor_code = this.context.selectedDoctor.code;
      cacheInjectState[0].substitute_name = this.state.currentUserName;
    }
  } else {
    cacheInjectState.map(item => {
      if (item.user_number === persistState.user_number) {
        item.injectData = injectData;
        item.system_patient_id = parseInt(this.props.match.params.id);
        item.time = now;
        item.created_at = injectData.created_at;
        item.schedule_date = this.modal_obj.schedule_date;
        item.number = this.state.isForUpdate
          ? this.state.orderNumber
          : undefined;
        item.insurance_type = 0;
        item.free_comment = Array.isArray(this.state.free_comment)
          ? this.state.free_comment
          : [this.state.free_comment];
        item.department_code = this.context.department.code;
        item.department = this.context.department.name;
        item.karte_status_code = this.context.karte_status.code;
        item.karte_status_name = this.context.karte_status.name;
        item.is_completed = this.modal_obj.inOut;
        item.patient_name = this.state.patientInfo.name;
        item.unusedDrugSearch = this.state.unusedDrugSearch;
        item.profesSearch = this.state.profesSearch;
        item.normalNameSearch = this.state.normalNameSearch;
        item.isForInjectionUpdate = true;        
        item.additions = additions;
        item.item_details = item_details.length > 0? item_details: this.state.item_details;
        item.location_id =this.modal_obj.location_id;
        item.drip_rate =this.modal_obj.drip_rate;
        item.water_bubble =this.modal_obj.water_bubble;
        item.exchange_cycle =this.modal_obj.exchange_cycle;
        item.require_time =this.modal_obj.require_time;

        if (this.state.staff_category === 2) {
          item.doctor_name = this.context.selectedDoctor.name;
          item.doctor_code = this.context.selectedDoctor.code;
          item.substitute_name = this.state.currentUserName;
        }
      }
    });
  }
    let canConfirm = cacheInjectState[0].canConfirm != undefined && cacheInjectState[0].canConfirm != null ? cacheInjectState[0].canConfirm : 0;
    if(injectData.length === 1 && item_details.length === 0){
        karteApi.delSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
        canConfirm = 0;
        this.confirmButtonRef.current.testConfirmRender(0);
    } else {
        if(data != null && data.isUpdate != undefined && data.isUpdate != null  && data.isUpdate == 1){         
          cacheInjectState[0]['isUpdate'] = 1;
        }
        if(data != null && data.temp_saved != undefined && data.temp_saved != null  && data.temp_saved == 1){
          cacheInjectState[0]['temp_saved'] = 1;
          cacheInjectState[0].canConfirm = 2; // or 2
          canConfirm = 2;
        } else {
          cacheInjectState[0]['temp_saved'] = 0;
          // エラーcheck
          if(data != null && data.canConfirm != undefined && data.canConfirm != null  && data.canConfirm == 0){          
            cacheInjectState[0].canConfirm = 0; // or 2
            canConfirm = 0;
          } else {        
            cacheInjectState[0].canConfirm = 1; // or 2
            canConfirm = 1;
            // if (hasPermissionError(injectData) == false) {          
            //   canConfirm = 1;
            //   cacheInjectState[0].canConfirm = 1; 
            // } else {
            //   canConfirm = 0;
            //   cacheInjectState[0].canConfirm = 0;            
            // }
          }
        }

        this.modal_obj.canConfirm = canConfirm;
        this.confirmButtonRef.current.testConfirmRender(canConfirm);

        const newStateStr = JSON.stringify(cacheInjectState);
        // window.localStorage.setItem("haruka_inject_edit_cache", newStateStr);
        karteApi.setSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber, newStateStr, 'insert');
    }

    if(this.additions_action){
        this.additions_action = false;
    } else {
        if (data != null && data.is_reload_state != undefined && data.is_reload_state == false) {
          // if (data.canConfirm != undefined && data.canConfirm != null) {
          //   this.setState({
          //     canConfirm: data.canConfirm
          //   });
          // } else {
          //   this.setState({
          //     canConfirm
          //   });
          // }
          return;
        }
        this.setState({
            injectData,
            // canConfirm
        });
    }
}

function getDiseasePermissions(diseaseDataResult, medicine) {
    let selDiseaseData = {};
    let m_code = parseInt(medicine.medicineId);
    let diseaseDetail = diseaseDataResult.details;
    let diseaseData = diseaseDataResult.result;
    if(diseaseData !== undefined && diseaseData != null && diseaseData.length > 0){
        diseaseData.map((item) => {
            let keyword = item.keyword;
            let disease_documents_list = item.disease_documents_list;
            if(disease_documents_list !== undefined && disease_documents_list != null && Object.keys(disease_documents_list).length > 0){
                Object.keys(disease_documents_list).map((idx) => {
                    let yj_code_list = disease_documents_list[idx].y;
                    let documents = disease_documents_list[idx].d;
                    if (yj_code_list.includes(medicine.yj_code)) {
                        Object.keys(documents).map((id) => {
                            let detail = diseaseDetail[documents[id]];
                            if (detail.y == medicine.yj_code) {
                                let obj = {};
                                if (selDiseaseData[m_code] === undefined) {
                                    obj.medicineName = medicine.medicineName;
                                    obj.disease = {};
                                    selDiseaseData[m_code] = obj;
                                }
                                if (selDiseaseData[m_code].disease[keyword] === undefined) {
                                    selDiseaseData[m_code].disease[keyword] = [];
                                }
                                selDiseaseData[m_code].disease[keyword].push([diseaseDataResult.strkeys.i[detail.i], diseaseDataResult.strkeys.c[detail.c]]);
                            }
                        });
                    }

                });
            }
        });
    }
    return selDiseaseData;
}

// function getDiseasePermissions(diseaseData, medicine) {
//   let selDiseaseData = {};
//   let m_code = parseInt(medicine.medicineId);
//   diseaseData.map((item) => {
//     let keyword = item.keyword;
//     let disease_documents_list = item.disease_documents_list;
//     Object.keys(disease_documents_list).map((idx) => {
//       let yj_code_list = disease_documents_list[idx].yj_code_list;
//       let documents = disease_documents_list[idx].documents;
//       if (yj_code_list.includes(medicine.yj_code)) {
//         Object.keys(documents).map((id) => {
//           let detail = documents[id];
//           if (detail.yj_code == medicine.yj_code) {
//             let obj = {};
//             if (selDiseaseData[m_code] === undefined) {
//               obj.medicineName = medicine.medicineName;
//               obj.disease = {};
//               selDiseaseData[m_code] = obj;
//             }
//             if (selDiseaseData[m_code].disease[keyword] === undefined) {
//               selDiseaseData[m_code].disease[keyword] = [];
//             }
//             selDiseaseData[m_code].disease[keyword].push([detail.information, detail.contraindication_category]);
//           }
//         });
//       }

//     });
//   });
//   return selDiseaseData;
// }

// function hasPermissionError(presData) {
//   let hasError = false;
//   presData.map(item=>{
    
//     // check usage
//     if (
//       item.medicines.length >= 1 &&
//       item.medicines[0].medicineName !== "" &&
//       item.usageName === ""
//     ) {
//       hasError = true;
//     } 

//     item.medicines.map(med=>{
      
//       // UsagePermission
//       if(med.usage_permission !== undefined && med.usage_permission < 0) {
//         hasError = true;          
//       }
      
//       // no medicine amount
//       if (
//         med.medicineName !== "" &&
//         (med.amount === 0 || med.amount === undefined)
//       ) {
//         hasError = true;          
//       }
      
//       // periodPermission
//       if(med.period_permission !== undefined && med.period_permission < 0) {
//         hasError = true;         
//       }
//     })
//   });

//   return hasError;
// }