import {
  persistedState
} from "../../../../helpers/cache";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
// import * as localApi from "~/helpers/cacheLocal-utils";
// import * as patientApi from "~/helpers/cachePatient-utils";

export default async function(data=null) {
  let {
    persistState,
    cacheState
  } = persistedState(this.props.match.params.id);
  if (this.props.match.params.id == null || this.props.match.params.id == undefined || this.props.match.params.id < 1) {
    // if preset: return;
    return;
  }
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
  if (cacheState) {
    cacheState.map(item => {
      if (item.user_number === persistState.user_number) {
        newFlg = false;
      }
    });
  } else {
    cacheState = [];
  }

  let presData = data != null && data != undefined && data.presData != undefined ? data.presData : this.state.presData;
  // let diseaseData = this.state.patientDiseaseData;
  // let diseaseData = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_DATA)); // 病名禁忌
  // let diseaseData = patientApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE); // 病名禁忌
  let diseaseData = await this.getContraindicationsToDiseaseApi(this.props.match.params.id); // 病名禁忌
  let selDiseaseData = {};

    let temp_array = [];
    presData.map((order, rpIdx) => {
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
        // if (temp_array[i].medicine.contraindication_alert !== undefined &&
        //    temp_array[i].medicine.contraindication_alert.length > 0 &&
        //    temp_array[j].medicine.medicineId !== undefined &&
        //    temp_array[i].medicine.contraindication_alert.includes(temp_array[j].medicine.medicineId.toString())) {        
        //   alert_permission = 1;
        // }

        let status = 0;
        status = this.getAlertReject(temp_array[i].medicine, temp_array[j].medicine);
        if( (status & 1) > 0) {
            alert_permission = 1;
        } 

        // if (temp_array[j].medicine.contraindication_alert !== undefined &&
        //   temp_array[j].medicine.contraindication_alert.length > 0 &&
        //   temp_array[i].medicine.medicineId !== undefined &&
        //   temp_array[j].medicine.contraindication_alert.includes(temp_array[i].medicine.medicineId.toString())) {
        //   alert_permission = 1;
        // }

        status = this.getAlertReject(temp_array[j].medicine, temp_array[i].medicine);
        if( (status & 1) > 0) {
            alert_permission = 1;
        }
      }
      // 病名禁忌    
      if (this.props.match.params.id !== undefined && this.props.match.params.id !== null) {
        selDiseaseData = getDiseasePermissions(diseaseData, temp_array[i].medicine);
      }


      presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].duplciate_permission = duplciate_permission;
      presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].alert_permission = alert_permission;
      presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].disease_permission = (Object.keys(selDiseaseData).length == 0) ? 0 : 1;
      presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].disease_alert_content = selDiseaseData;
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
        let cache_data_addition = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
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
    cacheState.push({
      user_number: persistState.user_number,
      system_patient_id: parseInt(this.props.match.params.id),
      time: now,
      created_at: presData.created_at,
      presData: presData,
      number: this.state.isForUpdate ? this.state.orderNumber : undefined,
      insurance_type: 0, //保険情報現状固定
      psychotropic_drugs_much_reason: this.state.psychotropic_drugs_much_reason, //向精神薬多剤投与理由
      poultice_many_reason: this.state.poultice_many_reason, //湿布薬多剤投与理由
      free_comment: Array.isArray(this.state.free_comment) ?
        this.state.free_comment :
        [this.state.free_comment], //備考
      department_code: this.context.department.code, //this.state.departmentId,
      department: this.context.department.name, //this.state.department,
      karte_status_code: this.context.karte_status.code,
      karte_status_name: this.context.karte_status.name,
      is_internal_prescription: this.state.inOut,
      patient_name: this.state.patientInfo.name,
      medical_department_name: this.context.medical_department_name,
      duties_department_name: this.context.duties_department_name,
      bulk: this.state.bulk,
      unusedDrugSearch: this.state.unusedDrugSearch,
      profesSearch: this.state.profesSearch,
      normalNameSearch: this.state.normalNameSearch,
      additions : additions,
      item_details:item_details.length > 0? item_details: this.state.item_details,
    });

    if (this.state.staff_category === 2) {
      cacheState[0].doctor_name = this.context.selectedDoctor.name;
      cacheState[0].doctor_code = this.context.selectedDoctor.code;
      cacheState[0].substitute_name = this.state.currentUserName;
    }
  } else {
    cacheState.map(item => {
      if (item.user_number === persistState.user_number) {
        item.presData = presData;
        item.system_patient_id = parseInt(this.props.match.params.id);
        item.time = now;
        item.created_at = presData.created_at;
        item.number = this.state.isForUpdate ?
          this.state.orderNumber :
          undefined;
        item.insurance_type = 0;
        item.psychotropic_drugs_much_reason = this.state.psychotropic_drugs_much_reason;
        item.poultice_many_reason = this.state.poultice_many_reason;
        item.free_comment = Array.isArray(this.state.free_comment) ?
          this.state.free_comment :
          [this.state.free_comment];
        item.department_code = this.context.department.code;
        item.department = this.context.department.name;
        item.karte_status_code = this.context.karte_status.code;
        item.karte_status_name = this.context.karte_status.name;
        item.is_internal_prescription = this.state.inOut;
        item.patient_name = this.state.patientInfo.name;
        item.medical_department_name = this.context.medical_department_name;
        item.duties_department_name = this.context.duties_department_name;
        item.bulk = this.state.bulk;
        item.unusedDrugSearch = this.state.unusedDrugSearch;
        item.profesSearch = this.state.profesSearch;
        item.normalNameSearch = this.state.normalNameSearch;     
        item.additions = additions;
        item.item_details = item_details.length > 0? item_details: this.state.item_details;

        if (this.state.staff_category === 2) {
          item.doctor_name = this.context.selectedDoctor.name;
          item.doctor_code = this.context.selectedDoctor.code;
          item.substitute_name = this.state.currentUserName;
        }
      }
    });
  }

  if(presData.length === 1 && presData[0]['medicines'][0]['medicineId'] === '' && item_details.length === 0){
      karteApi.delVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
  } else {
      const newStateStr = JSON.stringify(cacheState);
      karteApi.setVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, newStateStr, 'insert');
  } 

  if(this.additions_action){
      this.additions_action = false;
  } else {
      if (data != null && data.is_reload_state != undefined && data.is_reload_state == false) return;
      this.setState({
          presData
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
//       if(yj_code_list.includes(medicine.yj_code)) {
//         Object.keys(documents).map((id) => {
//           let detail = documents[id];
//           if(detail.yj_code == medicine.yj_code) {
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
