import {
  persistedState
} from "../../../../helpers/cache";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import { getCurrentDate } from "~/helpers/date";

export default async function(data=null, _cond = null) {
  let {persistState,cacheState} = persistedState(this.props.match.params.id);
  if (this.props.match.params.id == null || this.props.match.params.id == undefined || this.props.match.params.id < 1) {
    return;
  }

  /*@cc_on 
  var w = window;
  eval('var window = w');
  @*/
  
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
    Object.keys(cacheState).map(key=>{
      if (key == this.m_cacheSerialNumber) {
        newFlg = false;
      }
    })
    cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
  } else {
    cacheState = [];
  }
  if (cacheState == undefined || cacheState == null) cacheState = [];
  let presData = data != null && data != undefined && data.presData != undefined ? data.presData : this.state.presData;
  if (_cond == "medicine_check") {
    let diseaseData = await this.getContraindicationsToDiseaseApi(this.props.match.params.id); // 病名禁忌
    let duplciate_permission = 0;
    let alert_permission = 0;
    let selDiseaseData = {};
    let temp_array = [];
    presData.map((order, rpIdx) => {
      order.medicines.map((medicine, medIdx) => {
        if(medicine.medicineName != ""){
          let array = {
            rpIdx: rpIdx,
            medIdx: medIdx,
            medicine: medicine
          };
          temp_array.push(array);
        }
      });
    });
  
    // ------------- alert permission for double prescriptio start-----------//
    let cacheStateForAlertPermission = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
    // get other presData, not own presData
    let _all_temp_array = [];
    if (cacheStateForAlertPermission != undefined || cacheStateForAlertPermission != null) {
      if (Object.keys(cacheStateForAlertPermission).length > 0) {
        Object.keys(cacheStateForAlertPermission).map(sort_key=>{
          let _presData = cacheStateForAlertPermission[sort_key][0].presData;
          _presData.map((_order, _rpIdx) => {
            _order.medicines.map((_medicine, _medIdx) => {
              if(_medicine.medicineName != ""){
                let _array = {
                  rpIdx: _rpIdx,
                  medIdx: _medIdx,
                  medicine: _medicine
                };
                _all_temp_array.push(_array);
              }
            });
          });
        });
      }
    }
    // ------------- alert permission for double prescriptio end-----------//
    for (var i = 0; i < temp_array.length; i++) {
      duplciate_permission = 0;
      alert_permission = 0;
      for (var j = 0; j < temp_array.length; j++) {
        if (i == j) continue;
        // 重複禁忌
        if (temp_array[i].medicine.medicineId == temp_array[j].medicine.medicineId) {
          duplciate_permission = 1;
        }
        // 併用禁忌
        let status = 0;
        status = this.getAlertReject(temp_array[i].medicine, temp_array[j].medicine);
        if((status & 1) > 0) {
          alert_permission = 1;
        }
        status = this.getAlertReject(temp_array[j].medicine, temp_array[i].medicine);
        if((status & 1) > 0) {
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
    
    for (var m = 0; m < temp_array.length; m++) {
      alert_permission = 0;
      for (var n = 0; n < _all_temp_array.length; n++) {
        // if (m == n) continue;
        // 併用禁忌
        let status = 0;
        status = this.getAlertReject(temp_array[m].medicine, _all_temp_array[n].medicine);
        if((status & 1) > 0) {
          alert_permission = 1;
        }
        
        status = this.getAlertReject(_all_temp_array[n].medicine, temp_array[m].medicine);
        if((status & 1) > 0) {
          alert_permission = 1;
        }
      }
      presData[temp_array[m].rpIdx].medicines[temp_array[m].medIdx].alert_permission |= alert_permission;
    }
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
    let cache_data_addition = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    if(cache_data_addition !== undefined && cache_data_addition != null && cache_data_addition[0]['additions'] !== undefined && Object.keys(cache_data_addition[0]['additions']).length > 0){
      additions = cache_data_addition[0]['additions'];
    }
  }
  
  let item_details = [];
  if (this.modal_obj.item_details != undefined && this.modal_obj.item_details.length > 0) {
    this.modal_obj.item_details.map((item) => {
      if(item != null && item != undefined && item['item_id'] != null && item['item_id'] !== 0){
        let detail_row = {};
        Object.keys(item).map(idx=>{
          detail_row[idx] = item[idx];
        });
        item_details.push(detail_row);
      }
    });
  }
  if (newFlg) {
    cacheState.push({
      user_number: persistState.user_number,
      system_patient_id: parseInt(this.props.match.params.id),
      time: now,
      created_at: presData.created_at,
      presData: presData,
      number: this.state.isForUpdate ? this.modal_obj.orderNumber : undefined,
      insurance_type: 0, //保険情報現状固定
      med_consult: this.modal_obj.med_consult, //お薬相談希望あり
      supply_med_info: this.modal_obj.supply_med_info, //薬剤情報提供あり
      psychotropic_drugs_much_reason: this.modal_obj.psychotropic_drugs_much_reason, //向精神薬多剤投与理由
      poultice_many_reason: this.modal_obj.poultice_many_reason, //湿布薬多剤投与理由
      free_comment: Array.isArray(this.modal_obj.free_comment) ?
        this.modal_obj.free_comment :
        [this.modal_obj.free_comment], //備考
      department_code: this.context.department.code, //this.state.departmentId,
      department: this.context.department.name, //this.state.department,
      karte_status_code: this.context.karte_status.code,
      karte_status_name: this.context.karte_status.name,
      is_internal_prescription: this.modal_obj.inOut,
      patient_name: this.state.patientInfo.name,
      medical_department_name: this.context.medical_department_name,
      duties_department_name: this.context.duties_department_name,
      bulk: this.modal_obj.bulk,
      unusedDrugSearch: this.state.unusedDrugSearch,
      profesSearch: this.state.profesSearch,
      normalNameSearch: this.state.normalNameSearch,
      additions : additions,
      item_details:item_details.length > 0? item_details: this.modal_obj.item_details,
      potion: this.modal_obj.potion != undefined ? this.modal_obj.potion : 0,
      hospital_opportunity_disease: this.modal_obj.hospital_opportunity_disease != undefined ? this.modal_obj.hospital_opportunity_disease : 0,
    });
    
    if (this.state.staff_category === 2) {
      cacheState[0].doctor_name = this.context.selectedDoctor.name;
      cacheState[0].doctor_code = this.context.selectedDoctor.code;
      cacheState[0].substitute_name = this.state.currentUserName;
    }
    if(this.state.isForUpdate && this.modal_obj.last_doctor_code !== undefined){
      cacheState[0].last_doctor_code = this.modal_obj.last_doctor_code;
      cacheState[0].last_doctor_name = this.modal_obj.last_doctor_name;
    }
  } else {
    cacheState.map(item => {
      if (item.user_number === persistState.user_number) {
        item.presData = presData;
        item.system_patient_id = parseInt(this.props.match.params.id);
        item.time = now;
        item.created_at = presData.created_at;
        item.number = this.state.isForUpdate ?
          this.modal_obj.orderNumber :
          undefined;
        item.insurance_type = 0;
        item.psychotropic_drugs_much_reason = this.modal_obj.psychotropic_drugs_much_reason;
        item.poultice_many_reason = this.modal_obj.poultice_many_reason;
        item.med_consult = this.modal_obj.med_consult;
        item.supply_med_info = this.modal_obj.supply_med_info;
        item.free_comment = Array.isArray(this.modal_obj.free_comment) ?
          this.modal_obj.free_comment :
          [this.modal_obj.free_comment];
        item.department_code = this.context.department.code;
        item.department = this.context.department.name;
        item.karte_status_code = this.context.karte_status.code;
        item.karte_status_name = this.context.karte_status.name;
        item.is_internal_prescription = this.modal_obj.inOut;
        item.patient_name = this.state.patientInfo.name;
        item.medical_department_name = this.context.medical_department_name;
        item.duties_department_name = this.context.duties_department_name;
        item.bulk = this.modal_obj.bulk;
        item.unusedDrugSearch = this.state.unusedDrugSearch;
        item.profesSearch = this.state.profesSearch;
        item.normalNameSearch = this.state.normalNameSearch;
        item.additions = additions;
        item.item_details = item_details.length > 0? item_details: this.modal_obj.item_details;
        item.potion = this.modal_obj.potion != undefined ? this.modal_obj.potion : 0;
        item.hospital_opportunity_disease = this.modal_obj.hospital_opportunity_disease != undefined ? this.modal_obj.hospital_opportunity_disease : 0;
        
        if (this.state.staff_category === 2) {
          item.doctor_name = this.context.selectedDoctor.name;
          item.doctor_code = this.context.selectedDoctor.code;
          item.substitute_name = this.state.currentUserName;
        }
      }
    });
  }
  let canConfirm = cacheState[0].canConfirm != undefined && cacheState[0].canConfirm != null ? cacheState[0].canConfirm : 0;
  let exitRemark = this.modal_obj.poultice_many_reason != '' || this.modal_obj.psychotropic_drugs_much_reason != '' ||
  (this.modal_obj.free_comment != undefined && this.modal_obj.free_comment.length > 0 && this.modal_obj.free_comment[0] != null && this.modal_obj.free_comment[0] != '') ? 1 : 0;
  if(presData.length === 1 && (presData[0]['medicines'][0]['medicineId'] === '' || presData[0]['medicines'][0]['medicineName'] === '') && item_details.length === 0 && exitRemark == 0){
    karteApi.delSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    canConfirm = 0;
    this.confirmButtonRef.current.testConfirmRender(0);
  } else {
    // 処方編集時
    if(data != null && data.isUpdate != undefined && data.isUpdate != null  && data.isUpdate == 1){
      cacheState[0]['isUpdate'] = 1;
      cacheState[0].canConfirm = 0
      canConfirm = 0;
      if (data.visit_place_id != undefined && data.visit_place_id > 0) {        
        cacheState[0]['visit_place_id'] = data.visit_place_id;
      }
    } else {
      // 確認済み
      if(data != null && data.temp_saved != undefined && data.temp_saved != null  && data.temp_saved == 1){
        cacheState[0]['temp_saved'] = 1;
        cacheState[0].canConfirm = 2; // or 2
        canConfirm = 2;
      } else {
        cacheState[0]['temp_saved'] = 0;
        // エラーcheck
        if(data != null && data.canConfirm != undefined && data.canConfirm != null  && data.canConfirm == 0){
          cacheState[0].canConfirm = 0; // or 2
          canConfirm = 0;
        } else {
          cacheState[0].canConfirm = 1;
          canConfirm = 1;
        }
      }
    }
    
    // check one rp exist (1195-22 空の状態からDoするときに、禁忌・区分などエラーが出てキャンセルした場合も、入力中状態扱いになる)
    let existMedicine = 0;
    presData.map(item=>{
      if (item.medicines[0] != undefined && item.medicines[0].medicineName != "") {
        existMedicine = 1;
      }
    });
    let exitItem = item_details.length > 0 ? 1 : 0;
    if (existMedicine == 0 && exitRemark == 0 && exitItem == 0) canConfirm = 0;
    this.modal_obj.canConfirm = canConfirm;
    this.confirmButtonRef.current.testConfirmRender(canConfirm);
    
    const newStateStr = JSON.stringify(cacheState);
    karteApi.setSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber, newStateStr, 'insert');
  }
  
  let inOutState = {};
  if (data != null && (data.from == "_fromSoap" || data.from == "edit_order")) {
    inOutState.id = this.modal_obj.inOut;
    this.inOutRef.current.testInOutRender(inOutState);
  }
  
  // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
  // if (presData.length > 0) {
  //   let hasAdministratePeriod = false;
  //   presData.map(item=>{
  //     if (item.administrate_period != undefined) {
  //       hasAdministratePeriod = true;
  //     }
  //   });
  //   if (this.modal_obj.inOut == 3 && hasAdministratePeriod == true) inOutState.existAdministratePeriod = true;
  // }
  
  // 1209-34 処方箋に【お薬相談希望あり】、【薬剤情報あり】が出ない不具合
  let medConsultAndSupplyMedInfoState = {};
  medConsultAndSupplyMedInfoState.med_consult = this.modal_obj.med_consult;
  medConsultAndSupplyMedInfoState.supply_med_info = this.modal_obj.supply_med_info;
  medConsultAndSupplyMedInfoState.in_out = this.modal_obj.inOut;
  if(this.additions_action){
    this.additions_action = false;
  }
  if(this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != null){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    medConsultAndSupplyMedInfoState['medShow'] = false;
    medConsultAndSupplyMedInfoState['canEdit'] = (authInfo.staff_category || 2) === 1;
    medConsultAndSupplyMedInfoState['isLoaded'] = false;
    medConsultAndSupplyMedInfoState['medicineData'] = [];
    medConsultAndSupplyMedInfoState['presData'] = presData;
    medConsultAndSupplyMedInfoState['isSelfLoad'] = true;
    this.prescribeTableRef.current.testModalObjRender(medConsultAndSupplyMedInfoState);
  }
  if (presData.length == 0) {
    let initData = {
      medicines: [
        {
          medicineId: 0,
          medicineName: "",
          amount: 0,
          unit: "",
          main_unit_flag: 1,
          is_not_generic: 0,
          can_generic_name: 0,
          milling: 0,
          separate_packaging: 0,
          usage_comment: "",
          usage_optional_num: 0,
          poultice_times_one_day: 0,
          poultice_one_day: 0,
          poultice_days: 0,
          free_comment: [],
          uneven_values: []
        }
      ],
      units: [],
      days: 0,
      days_suffix: "",
      usage: 0,
      usageName: "",
      usageIndex: 0,
      year: "",
      month: "",
      date: "",
      supply_med_info: 0,
      med_consult: 0,
      temporary_medication: 0,
      one_dose_package: 0,
      medical_business_diagnosing_type: 0,
      insurance_type: 0,
      body_part: "",
      usage_remarks_comment: [],
      start_date: getCurrentDate()
    };
    presData = [initData];
  }
  this.modal_obj.store_no_fresh = 1;
  this.setState({presData});
  this.confirmButtonRef.current.testRender();
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
//             if (selDiseaseData[m_code] === undefined) {
//               let obj = {};
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