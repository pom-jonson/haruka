import * as apiClient from "~/api/apiClient";
import {CACHE_LOCALNAMES, getDoctorName} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatDateFull, formatDateLine, getAge, getCurrentDate} from "~/helpers/date";
import * as localApi from "~/helpers/cacheLocal-utils";
import axios from "axios/index";

export default async function getLastPrescription(patient_id, department_code, karte_status_code=null, department_name=null, target_number=null, param_data=null, _karte_status=null) {
  if(patient_id > 0){
    let path = "/app/api/v2/order/get/last_prescription";
    let post_data = {};
    let prescription = null;
    if(target_number !== 0){
      if(target_number != null){
        post_data.number = target_number;
        post_data.patient_id = patient_id;
      } else {
        post_data.department_code = department_code;
        post_data.patient_id = patient_id;
        post_data.karte_status = karte_status_code;
      }
      await apiClient._post(
        path,
        {params: post_data})
        .then((res) => {
          prescription = res;
        })
        .catch(() => {
        });
    } else {
      prescription = param_data;
    }
    
    // YS134 変換単位を使った処方のDoなどの動作の修正
    if(param_data === "prescription_page"){
      if(this.checkHasNoUnitPrescription(prescription) == false){
        return;
      }
    } else if(param_data === "from_soap"){
      if(this.checkHasNoUnitSoapPrescription(prescription) == false){
        return {res:"ok", prescription: prescription};
      }
    }
    
    if (prescription != null) {
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let arrMedCodes = [];
      let order_data = prescription.order_data.order_data;
      if(order_data !== undefined && order_data != null && order_data.length > 0){
        order_data.map(order => {
          order.med.map(medicine => {
            arrMedCodes.push(JSON.parse(JSON.stringify(medicine)).item_number);
          });
        });
      }
      let params = {
        type: "haruka",
        codes: arrMedCodes.join(",")
      };
      let medDetail = await apiClient.get("/app/api/v2/reference/medicines", {
        params: params
      });
      let newPresData;
      // セット処方の処理
      let diagnosisPrescriptionData = {};
      
      // let cacheUsageData = JSON.parse(
      //     window.localStorage.getItem("haruka_cache_usageData")
      // );
      let cacheUsageData = {};
      let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
      if (init_status != null && init_status != undefined && init_status.prescription_usage != undefined && init_status.prescription_usage != null) {
        cacheUsageData = init_status.prescription_usage;
      }
      
      //haruka_cache_usageData
      let patientInfoResponse = await axios.get("/app/api/v2/karte/patient_datailed", {
        params: { systemPatientId: patient_id}
      });
      
      let detailedPatientInfo = null;
      if(patientInfoResponse.data != undefined && patientInfoResponse.data !=null) {
        detailedPatientInfo =patientInfoResponse.data;
      }
      
      if(order_data !== undefined && order_data != null && order_data.length > 0){
        newPresData = order_data.map((order, rpIdx) => {
          let usageRemarksList = [];
          if (Array.isArray(order.usage_remarks_comment)) {
            usageRemarksList = order.usage_remarks_comment;
          } else {
            usageRemarksList.push(order.usage_remarks_comment);
          }
          
          let usageData = getUsageInfo(cacheUsageData, order.usage);
          
          let usageType = usageData.diagnosis_division != undefined ? usageData.diagnosis_division : "";
          return {
            medicines: order.med.map((medicine, medIdx) => {
              let free_comment = [];
              if (Array.isArray(medicine.free_comment)) {
                free_comment = medicine.free_comment.slice(0);
              } else {
                free_comment.push(medicine.free_comment);
              }
              if (usageType == "21" || usageType == "22") {
                let age_type = '';
                if(detailedPatientInfo !== undefined && detailedPatientInfo != null ) {
                  let age = getAge(detailedPatientInfo['patient'][0]['real_birthday']);
                  age_type = age >= 15 ? '成人' : '小児';
                  
                }
                let med_detail = medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : [];
                medicine.usage_alert_content = "";
                if (med_detail.usages === undefined || med_detail.usages === null) {
                  medicine.usage_permission = 0;
                } else {
                  let amount = -1;
                  let strUsage = "";
                  let strItemUsage = "";
                  // let mainUnit = medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit;
                  let mainUnit = medicine.unit !== undefined && medicine.unit != "" ? medicine.unit : medicine.real_unit;
                  let multi = 1;
                  let unit_list = [];
                  if (medicine.units_list !== undefined) {
                    unit_list = medicine.units_list;
                  } else if (medicine.units !== undefined) {
                    unit_list = medicine.units;
                  }
                  
                  unit_list.map((val) => {
                    if (val.main_unit_flag == 1) {
                      mainUnit = val.name;
                    }
                    if (val.name == medicine.unit) {
                      multi = val.multiplier;
                    }
                  });
                  med_detail.usages
                    .filter((item) => {
                      if (item.age_category == "") {
                        return true;
                      }
                      return item.age_category == age_type;
                    })
                    .map((item) => {
                      let items = [];
                      amount = -1;
                      strItemUsage = "";
                      if (usageType == "21") {
                        if (mainUnit === item.c029 && item.c028 !== "") {
                          items = item.c028.split("～");
                          
                          if (amount > parseFloat(items[0]) || amount === -1) {
                            amount = parseFloat(items[0]);
                            strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c029;
                          }
                        }
                        
                        if (mainUnit === item.c058 && item.c057 !== "") {
                          items = item.c057.split("～");
                          if (amount > parseFloat(items[0]) || amount === -1) {
                            amount = parseFloat(items[0]);
                            strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c058;
                          }
                        }
                        
                        if (mainUnit === item.c087 && item.c086 !== "") {
                          items = item.c086.split("～");
                          if (amount > parseFloat(items[0]) || amount === -1) {
                            amount = parseFloat(items[0]);
                            strItemUsage = "・" + item.age_category + ":" + item.target + "1 日最大量:" + amount + item.c087;
                          }
                          
                        }
                        if (amount !== -1 && (medicine.amount * multi) > amount) {
                          strUsage = strUsage + strItemUsage + "\n";
                        }
                      } else if (usageType == "22") {
                        if (mainUnit === item.c029 && item.c027 !== "") {
                          items = item.c027.split("～");
                          
                          if (amount > parseFloat(items[0]) || amount === -1) {
                            amount = parseFloat(items[0]);
                            strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c029;
                          }
                        }
                        
                        if (mainUnit === item.c058 && item.c056 !== "") {
                          items = item.c056.split("～");
                          if (amount > parseFloat(items[0]) || amount === -1) {
                            amount = parseFloat(items[0]);
                            strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c058;
                          }
                        }
                        
                        if (mainUnit === item.c087 && item.c085 !== "") {
                          items = item.c085.split("～");
                          if (amount > parseFloat(items[0]) || amount === -1) {
                            amount = parseFloat(items[0]);
                            strItemUsage = "・" + item.age_category + ":" + item.target + "1 回最大量:" + amount + item.c087;
                          }
                        }
                        if (amount !== -1 && (medicine.amount * multi) > amount) {
                          strUsage = strUsage + strItemUsage + "\n";
                        }
                      }
                    });
                  
                  if (strUsage !== "") {
                    medicine.usage_permission = -1;
                    medicine.usage_alert_content = medicine.item_name + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage;
                  } else {
                    medicine.usage_permission = 0;
                    medicine.usage_alert_content = "";
                  }
                }
              }
              let diagnosis_permission = 0;
              let diagnosis_content = "";
              if (medicine.diagnosis_division && usageData.allowed_diagnosis_division != undefined) {
                if (!usageData.allowed_diagnosis_division.includes(medicine.diagnosis_division.toString())) {
                  diagnosis_permission = -1;
                  if (diagnosisPrescriptionData[rpIdx] == undefined) {
                    diagnosisPrescriptionData[rpIdx] = [];
                  }
                  diagnosisPrescriptionData[rpIdx].push(medIdx);
                }
              }
              let cur_date = formatDateLine(new Date());
              let cur_date_str = cur_date.split('-')[0]+cur_date.split('-')[1]+cur_date.split('-')[2];
              return {
                medicineId: medicine.item_number,
                medicineName: medicine.item_name,
                amount: medicine.amount,
                // unit: medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit,
                unit: medicine.unit !== undefined && medicine.unit !== "" ? medicine.unit : medicine.real_unit,
                main_unit_flag: medicine.main_unit_flag,
                diagnosis_division: medicine.diagnosis_division,
                is_not_generic: medicine.is_not_generic,
                can_generic_name: medicine.can_generic_name,
                contraindication_alert: medicine.contraindication_alert,
                contraindication_reject: medicine.contraindication_reject,
                milling: medicine.milling,
                separate_packaging: medicine.separate_packaging,
                free_comment: free_comment,
                usage_comment: medicine.usage_comment,
                usage_optional_num: medicine.usage_optional_num,
                poultice_times_one_day: medicine.poultice_times_one_day,
                poultice_one_day: medicine.poultice_one_day,
                poultice_days: medicine.poultice_days,
                uneven_values: medicine.uneven_values,
                units_list: medicine.units_list,
                medDetail: medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : [],
                exists_detail_information: medicine.exists_detail_information,
                usage_permission: medicine.usage_permission,
                usage_alert_content: medicine.usage_alert_content,
                period_permission: 0,
                start_month: medicine.start_month !== undefined ? medicine.start_month : "",
                end_month: medicine.end_month !== undefined ? medicine.end_month : "",
                // start_date : target_number > 0 ? medicine.start_date : cur_date_str,
                start_date : cur_date_str,
                end_date : medicine.end_date !== undefined ? medicine.end_date : "",
                gene_name: medicine.gene_name !== undefined ? medicine.gene_name : "",
                diagnosis_permission: diagnosis_permission,
                diagnosis_content: diagnosis_content,
                tagret_contraindication: medicine.tagret_contraindication,
                yj_code: medicine.yj_code
              };
            }),
            units: [],
            usage: order.usage,
            usageName: order.usage_name,
            allowed_diagnosis_division: (usageData.allowed_diagnosis_division != undefined) ? usageData.allowed_diagnosis_division : [],
            usage_category_name: (usageData.category_name != undefined) ? usageData.category_name : "",
            days: order.days,
            days_suffix: order.days_suffix,
            year: "",
            month: "",
            date: "",
            order_number: order.order_number,
            order_number_serial: order.order_number_serial,
            supply_med_info: order.supply_med_info,
            med_consult: order.med_consult,
            temporary_medication: order.temporary_medication,
            one_dose_package: order.one_dose_package,
            mixture: order.mixture === undefined ? 0 : order.mixture,
            medical_business_diagnosing_type: order.medical_business_diagnosing_type,
            insurance_type: order.insurance_type === undefined ? 0 : order.insurance_type,
            usage_remarks_comment: usageRemarksList,
            // start_date: order.start_date,
            start_date: getCurrentDate(),
            usage_replace_number: order.usage_replace_number,
            body_part: order.body_part === undefined ? "" : order.body_part
          };
        });
      }
      let newBulk = {
        milling: 1,
        supply_med_info: 1,
        med_consult: 1,
        is_not_generic: 1,
        can_generic_name: 1,
        separate_packaging: 1,
        temporary_medication: 1,
        one_dose_package: 1
      };
      //全データのフラグが立っていたら画面用(bulk)のフラグON
      if(newPresData !== undefined && newPresData != null){
        newPresData.forEach(pres => {
          if (pres.order_number) {
            pres.medicines.forEach(med => {
              if (med.milling == 0) newBulk.milling = 0;
              if (med.is_not_generic == 0) newBulk.is_not_generic = 0;
              if (med.can_generic_name == 0) newBulk.can_generic_name = 0;
              if (med.separate_packaging == 0) newBulk.separate_packaging = 0;
            });
            if (pres.temporary_medication == 0) newBulk.temporary_medication = 0;
            if (pres.one_dose_package == 0) newBulk.one_dose_package = 0;
          }
        });
      }
      
      if (prescription['order_data']['med_consult'] == 1) {
        newBulk.med_consult = 1;
      } else {
        newBulk.med_consult = 0;
      }
      
      if (prescription['order_data']['supply_med_info'] == 1) {
        newBulk.supply_med_info = 1;
      } else {
        newBulk.supply_med_info = 0;
      }
      
      let presData = newPresData;
      presData.push(getEmptyPrescription());
      // let diseaseData = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_DATA)); // 病名禁忌
      // let diseaseData = patientApi.getVal(patient_id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE); // 病名禁忌
      let diseaseData = await this.getContraindicationsToDiseaseApi(patient_id); // 病名禁忌
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
          if (temp_array[i].medicine.contraindication_alert !== undefined &&
            temp_array[i].medicine.contraindication_alert.length > 0 &&
            temp_array[j].medicine.medicineId !== undefined &&
            temp_array[i].medicine.contraindication_alert.includes(temp_array[j].medicine.medicineId.toString())) {
            alert_permission = 1;
          }
          
          if (temp_array[j].medicine.contraindication_alert !== undefined &&
            temp_array[j].medicine.contraindication_alert.length > 0 &&
            temp_array[i].medicine.medicineId !== undefined &&
            temp_array[j].medicine.contraindication_alert.includes(temp_array[i].medicine.medicineId.toString())) {
            alert_permission = 1;
          }
        }
        // 病名禁忌
        selDiseaseData = getDiseasePermissions(diseaseData, temp_array[i].medicine);
        
        presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].duplciate_permission = duplciate_permission;
        presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].alert_permission = alert_permission;
        presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].disease_permission = (Object.keys(selDiseaseData).length == 0) ? 0 : 1;
        presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].disease_alert_content = selDiseaseData;
      }
      
      let new_department_code = department_code;
      let _karte_status_code = this.context.karte_status.code;
      let _karte_status_name = this.context.karte_status.name;
      if (_karte_status != null && _karte_status > 0) {
        _karte_status_code = _karte_status == 1 ? 0 : _karte_status == 3 ? 1 : 2;
        _karte_status_name = _karte_status == 1 ? "外来" : _karte_status == 3 ? "入院" : "在宅";
        new_department_code = prescription.order_data.department_code;
      }
      
      let newPrescription = {
        user_number :authInfo.user_number,
        system_patient_id : patient_id,
        time: formatDateFull(new Date(), "-"),
        created_at: (department_name != null && prescription.treatment_datetime !== undefined) ? prescription.treatment_datetime : "",
        presData: presData,
        number : department_name != null ? target_number : undefined,
        insurance_type: 0, //保険情報現状固定
        psychotropic_drugs_much_reason: prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "",
        poultice_many_reason: prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "",
        free_comment: Array.isArray(prescription.order_data.free_comment) ? prescription.order_data.free_comment : [], //備考
        department_code: new_department_code,
        department: department_name != null ? department_name : this.context.department.name, //this.state.department,
        karte_status_code: _karte_status_code,
        karte_status_name: _karte_status_name,
        is_internal_prescription: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
        patient_name: prescription.patient_name,
        medical_department_name: this.context.medical_department_name,
        duties_department_name: this.context.duties_department_name,
        bulk: newBulk,
        unusedDrugSearch: 0,
        profesSearch: 0,
        normalNameSearch: 0,
        additions : prescription.order_data.additions,
        item_details:prescription.order_data.item_details,
      };
      let cacheState = [];
      cacheState.push(newPrescription);
      if (authInfo.staff_category === 2) {
        cacheState[0].doctor_name = this.context.selectedDoctor.name;
        cacheState[0].doctor_code = this.context.selectedDoctor.code;
        cacheState[0].substitute_name = authInfo.name;
      }
      cacheState[0].isUpdate = (target_number != null && target_number !== 0) ? 1 : 0;
      cacheState[0].temp_saved = 1; // 仮登録
      if(cacheState[0].isUpdate == 1 && prescription.order_data.doctor_code != null){
        cacheState[0].last_doctor_code = prescription.order_data.doctor_code;
        if(prescription.order_data.doctor_name != null){
          cacheState[0].last_doctor_name = prescription.order_data.doctor_name;
        } else {
          cacheState[0].last_doctor_name = getDoctorName(prescription.order_data.doctor_code);
        }
      }
      let serial_key = this.m_cacheSerialNumber;
      if (serial_key == undefined || serial_key == null) serial_key = new Date().getTime();
      karteApi.setSubVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, serial_key, JSON.stringify(cacheState), 'insert');
      if(param_data === "prescription_page"){
        this.setState({presData});
      }
      let set_deplyment = localApi.getValue('set_deplyment');
      if(set_deplyment !== undefined && set_deplyment!= null && set_deplyment == 1){
        localApi.remove('set_deplyment');
        this.context.$setExaminationOrderFlag(1);
      }
      
      if(karte_status_code != null && target_number ==null){
        if(karte_status_code == 1 && this.context.karte_status.code != 0){
          this.context.$updateKarteStatus(0,"外来");
        }
        if(karte_status_code == 2 && this.context.karte_status.code != 2){
          this.context.$updateKarteStatus(2, "訪問診療");
        }
        if(karte_status_code == 3 && this.context.karte_status.code != 1){
          this.context.$updateKarteStatus(1, "入院");
        }
      }
    }
  }
  return true;
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
//     let selDiseaseData = {};
//     let m_code = parseInt(medicine.medicineId);
//     if(diseaseData !== undefined && diseaseData != null && diseaseData.length > 0){
//         diseaseData.map((item) => {
//             let keyword = item.keyword;
//             let disease_documents_list = item.disease_documents_list;
//             if(disease_documents_list !== undefined && disease_documents_list != null && Object.keys(disease_documents_list).length > 0){
//                 Object.keys(disease_documents_list).map((idx) => {
//                     let yj_code_list = disease_documents_list[idx].yj_code_list;
//                     let documents = disease_documents_list[idx].documents;
//                     if (yj_code_list.includes(medicine.yj_code)) {
//                         Object.keys(documents).map((id) => {
//                             let detail = documents[id];
//                             if (detail.yj_code == medicine.yj_code) {
//                                 let obj = {};
//                                 if (selDiseaseData[m_code] === undefined) {
//                                     obj.medicineName = medicine.medicineName;
//                                     obj.disease = {};
//                                     selDiseaseData[m_code] = obj;
//                                 }
//                                 if (selDiseaseData[m_code].disease[keyword] === undefined) {
//                                     selDiseaseData[m_code].disease[keyword] = [];
//                                 }
//                                 selDiseaseData[m_code].disease[keyword].push([detail.information, detail.contraindication_category]);
//                             }
//                         });
//                     }

//                 });
//             }
//         });
//     }
//     return selDiseaseData;
// }

function getUsageInfo(s_usageData, usageId) {
  let ret = {};
  if(usageId === "" || usageId === undefined) return ret;
  let usageData;
  usageId = parseInt(usageId);
  if(s_usageData !== undefined && s_usageData != null && Object.keys(s_usageData).length > 0){
    Object.keys(s_usageData).map((kind)=>{
      usageData = s_usageData[kind];
      Object.keys(usageData).map((idx)=>{
        usageData[idx].map((item)=>{
          if(item.code === usageId){
            ret = item;
          }
        })
      });
    })
  }
  return ret;
}

function getEmptyPrescription() {
  return {
    medicines: [getEmptyMedicine()],
    units: [],
    usage: 0,
    usageName: "",
    days: 0,
    start_date: getCurrentDate(),
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
    usage_remarks_comment: [],
    body_part: ""
  };
}

function getEmptyMedicine() {
  return {
    medicineId: 0,
    medicineName: "",
    amount: 0,
    unit: "",
    main_unit_flag: 1,
    is_not_generic: 0,
    can_generic_name: 0,
    milling: 0,
    separate_packaging: 0,
    free_comment: [],
    usage_comment: "",
    usage_optional_num: 0,
    poultice_times_one_day: 0,
    poultice_one_day: 0,
    poultice_days: 0,
    uneven_values: []
  };
}
