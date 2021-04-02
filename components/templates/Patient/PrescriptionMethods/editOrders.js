/**
 * 編集対象の処方データを入力欄に表示する。
 */
import * as apiClient from "~/api/apiClient";
import {
  formatDateFull,
  getAge
} from "~/helpers/date";
// import { CACHE_LOCALNAMES } from "~/helpers/constants";
// import * as karteApi from "~/helpers/cacheKarte-utils";

export default async function(prescription, is_done = false) {
  // if (this.checkCanEdit(1) === false) {
  //   let orders = [];
  //   orders.push(prescription);
  //   this.setState({
  //     tempItems: orders
  //   });
  //   return;
  // }
  let medicine_history = this.state.medicineHistory;
  
  // 編集がキャンセルされているときに、実施だけ動いてしまうような不具合  2019/10/02
  if (this.modal_obj.isEdintingIndex !== -1) {
    let medicineHistory = this.state.medicineHistory;
    let donePrescription = medicineHistory[this.modal_obj.isEdintingIndex];
    donePrescription.done_order = 0;
    let pre_order_data = donePrescription.order_data.order_data.map(medicine => {
      medicine.done_order = 0;
      return medicine;
    });
    donePrescription.order_data.order_data = pre_order_data;
    medicineHistory[this.modal_obj.isEdintingIndex] = donePrescription;
    this.medicineSelectionRef.current.testMedRender(medicineHistory);    
    // this.setState({
    //   medicineHistory
    // });
    window.localStorage.setItem("haruka_cache_medicineHistory", JSON.stringify(medicineHistory));
    //実施キャッシュから削除
    let cacheDoneState = JSON.parse(window.localStorage.getItem("haruka_done_cache"));
    // let cacheDoneState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
    if (cacheDoneState) {
      cacheDoneState = cacheDoneState.filter((data, index) => {

        return index != this.modal_obj.isEdintingIndex;
      });
      if (cacheDoneState.length < 1)
        window.localStorage.removeItem("haruka_done_cache");
      else
        window.localStorage.setItem("haruka_done_cache", JSON.stringify(cacheDoneState));
    }
  }

  let oplog = window.localStorage.getItem("operation_log");
  let operation_log = [];
  if (oplog !== null) {
    operation_log = JSON.parse(window.localStorage.getItem("operation_log") || "");
  }
  let time = new Date();
  let category = "edit"
  let detail = is_done ? "編集して実施" : "処方箋(編集中)"
  let log = {
    time: formatDateFull(time, "-"),
    category: category,
    detail: detail
  };

  operation_log.push(log);
  window.localStorage.setItem("operation_log", JSON.stringify(operation_log));

  var path = window.location.href.split("/");
  var presetPath = path[path.length - 2] + "/" + path[path.length - 1];

  let arrMedCodes = [];
  prescription.order_data.order_data.map(order => {

    order.med.map(medicine => {
      arrMedCodes.push(JSON.parse(JSON.stringify(medicine)).item_number);
    });
  });
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
  newPresData = prescription.order_data.order_data.map((order, rpIdx) => {    
    let usageRemarksList = [];
    if (Array.isArray(order.usage_remarks_comment)) {
      usageRemarksList = order.usage_remarks_comment;
    } else {
      usageRemarksList.push(order.usage_remarks_comment);
    }

    let usageData = this.getUsageInfo(order.usage);
    let usageType = usageData.diagnosis_division != undefined ? usageData.diagnosis_division : "";

    let _state = {
      medicines: order.med.map((medicine, medIdx) => {
        let free_comment = [];
        if (Array.isArray(medicine.free_comment)) {
          free_comment = medicine.free_comment.slice(0);
        } else {
          free_comment.push(medicine.free_comment);
        }
        if (usageType == "21" || usageType == "22") {
          let age_type = '';
          if(this.state.detailedPatientInfo !== undefined) {
          let age = getAge(this.state.detailedPatientInfo['patient'][0]['real_birthday']);          
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
            let mainUnit = medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit;
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


        return {
          medicineId: medicine.item_number,
          medicineName: medicine.item_name,
          amount: medicine.amount,
          unit: medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit,
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
          start_date : medicine.start_date !== undefined ? medicine.start_date : "",
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
      start_date: order.start_date,
      usage_replace_number: order.usage_replace_number,
      body_part: order.body_part === undefined ? "" : order.body_part
    };

    // 中止処方
    if (order.stop_flag) {
      _state.stop_flag = order.stop_flag;
    }
    if (order.stop_date) {
      _state.stop_date = order.stop_date;
    }

    return _state;
  });
  /*
  if(presetPath === "preset/prescription" ){
    newPresData = prescription.order_data.order_data.map(order => {
      let usageRemarksList = [];
      if (Array.isArray(order.usage_remarks_comment)) {
        usageRemarksList = order.usage_remarks_comment;
      } else {
        usageRemarksList.push(order.usage_remarks_comment);
      }
      return {
        medicines: order.med.map(medicine => {
          let free_comment = [];
          if (Array.isArray(medicine.free_comment)) {
            free_comment = medicine.free_comment.slice(0);
          } else {
            free_comment.push(medicine.free_comment);
          }
          return {
            medicineId: medicine.item_number,
            medicineName: medicine.item_name,
            amount: medicine.amount,
            diagnosis_division: medicine.diagnosis_division,
            unit: medicine.unit,
            main_unit_flag: medicine.main_unit_flag,
            is_not_generic: medicine.is_not_generic,
            can_generic_name: medicine.can_generic_name,
            milling: medicine.milling,
            separate_packaging: medicine.separate_packaging,
            free_comment: free_comment,
            usage_comment: medicine.usage_comment,
            usage_optional_num: medicine.usage_optional_num,
            poultice_times_one_day: medicine.poultice_times_one_day,
            poultice_one_day: medicine.poultice_one_day,
            poultice_days: medicine.poultice_days,
            uneven_values: medicine.uneven_values,
            units_list: medicine.units_list
          };
        }),
        units: [],
        usage: order.usage,
        usageName: order.usage_name,
        days: order.days,
        days_suffix: order.days_suffix,
        year: "",
        month: "",
        date: "",
        order_number: order.order_number === undefined ? 1: order.order_number,
        order_number_serial: order.order_number_serial,
        supply_med_info: order.supply_med_info,
        med_consult: order.med_consult,
        temporary_medication: order.temporary_medication,
        one_dose_package: order.one_dose_package,
        mixture: order.mixture === undefined ? 0 : order.mixture,
        medical_business_diagnosing_type: order.medical_business_diagnosing_type,
          insurance_type: order.insurance_type === undefined ? 0 : order.insurance_type,
        usage_remarks_comment: usageRemarksList,
        start_date: order.start_date,
        usage_replace_number: order.usage_replace_number,
        body_part: order.body_part === undefined ? "" : order.body_part
      };
    });
    } else {
      newPresData = prescription.order_data.order_data.map(order => {
        let usageRemarksList = [];
        if (Array.isArray(order.usage_remarks_comment)) {
          usageRemarksList = order.usage_remarks_comment;
        } else {
          usageRemarksList.push(order.usage_remarks_comment);
  }
        return {
          medicines: order.med.map(medicine => {
            let free_comment = [];
            if (Array.isArray(medicine.free_comment)) {
              free_comment = medicine.free_comment.slice(0);
            } else {
              free_comment.push(medicine.free_comment);
            }
            return {
              medicineId: medicine.item_number,
              medicineName: medicine.item_name,
              amount: medicine.amount,
              unit: medicine.unit,
              main_unit_flag: medicine.main_unit_flag,
              diagnosis_division: medicine.diagnosis_division,
              is_not_generic: medicine.is_not_generic,
              can_generic_name: medicine.can_generic_name,
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
            };
          }),
          units: [],
          usage: order.usage,
          usageName: order.usage_name,
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
          start_date: order.start_date,
          usage_replace_number: order.usage_replace_number,
          body_part: order.body_part === undefined ? "" : order.body_part
        };
      });
    }
  */
  newPresData.push(this.getEmptyPrescription());

  let editingIndex = -1;

  // this.state.medicineHistory.map((item, index) => {
  medicine_history.map((item, index) => {
    if (
      item.order_data.order_data[0].order_number === newPresData[0].order_number
    ) {
      editingIndex = index;
    }
  });

  // 備考、その他欄のstate生成
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
  newPresData.forEach(pres => {
    if (pres.order_number) {
      pres.medicines.forEach(med => {
        if (med.milling == 0) newBulk.milling = 0;
        if (med.is_not_generic == 0) newBulk.is_not_generic = 0;
        if (med.can_generic_name == 0) newBulk.can_generic_name = 0;
        if (med.separate_packaging == 0) newBulk.separate_packaging = 0;
      });
      // if (pres.supply_med_info == 0) newBulk.supply_med_info = 0;
      // if (pres.med_consult == 0) newBulk.med_consult = 0;
      if (pres.temporary_medication == 0) newBulk.temporary_medication = 0;
      if (pres.one_dose_package == 0) newBulk.one_dose_package = 0;
    }
  });

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

  this.context.$updateDepartment(
    prescription.order_data.department_code,
    prescription.order_data.department
  );

  window.sessionStorage.removeItem("prescribe-container-scroll");
  for (var key in window.localStorage) {
    if (key.includes("medicine_keyword")) {
      window.localStorage.removeItem(key);
    }
  }

  const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  window.sessionStorage.setItem("isForPrescriptionUpdate", 1);
  if (presetPath === "preset/prescription") {
    window.sessionStorage.removeItem("isForPrescriptionUpdate");
  }

  //加算項目-----------------------------------------------
  let additions_check = {};
  let additions_send_flag_check = {};
  let additions = [];
  if (this.state.additions !== undefined && this.state.additions!= null && this.state.additions.length > 0){
      additions = this.state.additions;
      additions.map(addition=> {
          if (prescription.order_data != null &&  prescription.order_data.additions !== undefined && prescription.order_data.additions[addition.addition_id] !== undefined){
              additions_check[addition.addition_id] = true;
              let sending_flag = prescription.order_data.additions[addition.addition_id]['sending_flag'];
              if(sending_flag !== undefined && sending_flag !== null && sending_flag === 1){
                  additions_send_flag_check[addition.addition_id] = true;
              } else {
                  additions_send_flag_check[addition.addition_id] = false;
              }
          } else {
              additions_check[addition.addition_id] = false;
              additions_send_flag_check[addition.addition_id] = false;
          }
      });
  }

  // 品名情報反映
  var item_details = [];
  if (prescription.order_data.item_details != undefined && prescription.order_data.item_details!= null && prescription.order_data.item_details.length > 0){
      let item_details_array = prescription.order_data.item_details;
      Object.keys(item_details_array).map(item=> {
          item_details.push(item_details_array[item]);
      })
  }

  // 品名情報初期データ
  let show_item_detail = false;
  if (item_details.length == 0) {
    let init_detail = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
    item_details.push(init_detail);
  } else {
      // show_item_detail = true;
      // 品名 open flag
      this.m_show_detail_flag = 1;
      this.showItemDetailArea(1);
  }


  // 編集時、時間保存
  newPresData.created_at = prescription.created_at;

  this.modal_obj.isEdintingIndex = editingIndex;
  this.modal_obj.is_done = is_done;  

  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

  this.modal_obj.bulk = newBulk;
  this.modal_obj.orderNumber = prescription.number ? prescription.number : 0;
  this.modal_obj.department = prescription.order_data.department ? prescription.order_data.department : authInfo.medical_department_name || "";
  this.modal_obj.departmentId = prescription.order_data.department_code ? prescription.order_data.department_code : authInfo.department;
  this.modal_obj.inOut = prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0;
  // if (prescription.order_data.karte_status == 3) this.modal_obj.inOut = 1;
  this.modal_obj.free_comment = prescription.order_data.free_comment ? prescription.order_data.free_comment : "";
  this.modal_obj.psychotropic_drugs_much_reason = prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "";
  this.modal_obj.med_consult = prescription.order_data.med_consult ? prescription.order_data.med_consult : 0;
  this.modal_obj.supply_med_info = prescription.order_data.supply_med_info ? prescription.order_data.supply_med_info : 0;
  this.modal_obj.poultice_many_reason = prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "";  

  // 品名
  this.modal_obj.item_details = item_details;
  if (this.prescriptionNameRef.current != undefined && this.prescriptionNameRef.current != null) {
      this.prescriptionNameRef.current.testPrescriptionNameRender({item_details:item_details});
  }

  let remark_status = {
    presData: newPresData,      
    bulk: newBulk,    
    department: prescription.order_data.department ? prescription.order_data.department : authInfo.medical_department_name || "",
    departmentId: prescription.order_data.department_code ? prescription.order_data.department_code : authInfo.department,
    inOut: this.modal_obj.inOut,
    free_comment: prescription.order_data.free_comment ? prescription.order_data.free_comment : "",
    psychotropic_drugs_much_reason: prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "",
    med_consult: prescription.order_data.med_consult ? prescription.order_data.med_consult : 0,
    supply_med_info: prescription.order_data.supply_med_info ? prescription.order_data.supply_med_info : 0,
    poultice_many_reason: prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "",      
  };
  this.remarkRef.current.testRemarkRender(remark_status);        

  this.setState({
      // presData: newPresData,
      // orderNumber: prescription.number ? prescription.number : 0,
      // department: prescription.order_data.department ? prescription.order_data.department : authInfo.medical_department_name || "",
      // departmentId: prescription.order_data.department_code ? prescription.order_data.department_code : authInfo.department,
      // inOut: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
      is_internal_prescription: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
      // free_comment: prescription.order_data.free_comment ? prescription.order_data.free_comment : "",
      // psychotropic_drugs_much_reason: prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "",
      // poultice_many_reason: prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "",
      // bulk: newBulk,
      isForUpdate: true,
      // isEdintingIndex: editingIndex,
      // medicineHistory: this.setDoCopyStatus(0, false, true),
      // is_done: is_done,
      additions,
      item_details,
      show_item_detail,
    },
    function() {
      let addition_info = {};
      addition_info.additions_check = additions_check;
      addition_info.additions_send_flag_check = additions_send_flag_check;
      addition_info['presData'] = newPresData;
      addition_info.isUpdate = 1;
      this.storeDataInCache(addition_info);
      if (Object.keys(diagnosisPrescriptionData).length > 0) {
        this.modal_obj.diagnosisOrderModal = true;
        this.modal_obj.diagnosisOrderData = diagnosisPrescriptionData;
        this.modal_obj.presData = newPresData;
      }

      this.medicineSelectionRef.current.testMedRender(this.setDoCopyStatus(0, false, true), editingIndex);
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      // 処方箋 title update
      this.titleRef.current.testTitleRender(this.getOrderTitle());

    }
  );
}