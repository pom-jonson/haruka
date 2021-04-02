/**
 * 編集対象の処方データを入力欄に表示する。
 */
import * as apiClient from "~/api/apiClient";
import {formatDateFull,getAge} from "~/helpers/date";
import $ from "jquery";
import {CACHE_LOCALNAMES, getDoctorName} from "../../../../helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default async function(prescription, is_done = false) {
  // ■YJ401 Doや編集が展開できていないように見える問題の修正
  if(this.prescribeTableRef.current != undefined){
    await this.prescribeTableRef.current.setPrescribeTableLoad(false);
  }
  // 編集がキャンセルされているときに、実施だけ動いてしまうような不具合  2019/10/02
  if (this.modal_obj.isEdintingIndex != -1) {
    //実施キャッシュから削除
    let cache_done_history = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
    let cache_done = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
    if (cache_done_history != null && cache_done_history.length > 0) {
      cache_done_history = cache_done_history.filter(x=>x.number!=prescription.number);
    }
    if (cache_done != null && cache_done.length > 0) {
      cache_done = cache_done.map(medicine=>{
        if(medicine.number == prescription.number){
          let pres_history_obj = $(".pres-medicine-"+prescription.number);
          pres_history_obj.removeClass("line-done");
        } else {
          return medicine;
        }
      })
    }
    if (cache_done_history != null && cache_done_history.length > 0) {
      karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY, JSON.stringify(cache_done_history));
      karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE, JSON.stringify(cache_done));
    } else {
      karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
      karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
    }
  }
  
  let oplog = window.localStorage.getItem("operation_log");
  let operation_log = [];
  if (oplog !== null) {
    operation_log = JSON.parse(window.localStorage.getItem("operation_log") || "");
  }
  let time = new Date();
  let category = "edit";
  let detail = is_done ? "編集して実施" : "処方箋(編集中)";
  let log = {
    time: formatDateFull(time, "-"),
    category: category,
    detail: detail
  };
  
  operation_log.push(log);
  window.localStorage.setItem("operation_log", JSON.stringify(operation_log));
  
  var path = window.location.href.split("/");
  var presetPath = path[path.length - 2] + "/" + path[path.length - 1];
  
  // YS132 単位がなくなっている場合の対策
  // 「主単位以外の単位が登録されていて、該当薬剤の単位の候補に存在しない単位名」の薬剤がある場合は、下記のようにアラートを出して、そのRPを追加しないようにしてください。
  
  if(this.checkHasNoUnitPrescription(prescription) == false){
    // ■YJ401 Doや編集が展開できていないように見える問題の修正
    if(this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != undefined){
      this.prescribeTableRef.current.setPrescribeTableLoad(true);
    }
    return;
  }
  
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
  
  // セット処方の処理
  let diagnosisPrescriptionData = {};
  let newPresData = prescription.order_data.order_data.map((order, rpIdx) => {
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
          // unit: medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit,
          // real_unit: medicine.real_unit !== undefined && medicine.real_unit !== "" ? medicine.real_unit : "",
          unit: medicine.unit !== undefined && medicine.unit !== "" ? medicine.unit : "",
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
      body_part: order.body_part === undefined ? "" : order.body_part,
      administrate_period: order.administrate_period == undefined || order.administrate_period == null ? null : order.administrate_period
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
  
  newPresData.push(this.getEmptyPrescription());
  
  let editingIndex = -1;
  
  this.state.medicineHistory.map((item, index) => {
    if (item.number === prescription.number) {
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
  
  if (this.context.department.code != prescription.order_data.department_code) {
    this.context.$updateDepartment(
      prescription.order_data.department_code,
      prescription.order_data.department
    );
  }
  
  let cache_karte_status = parseInt(prescription.karte_status);
  let cache_karte_status_code = cache_karte_status == 1 ? 0 : cache_karte_status == 3 ? 1 : 2;
  let cache_karte_status_name = cache_karte_status == 1 ? "外来" : cache_karte_status == 3 ? "入院" : "訪問診療";
  if (this.context.karte_status.code != cache_karte_status_code) {
    this.context.$updateKarteStatus(cache_karte_status_code, cache_karte_status_name, null, "no_patient_karte_status");
  }
  
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
  this.modal_obj.free_comment = prescription.order_data.free_comment ? prescription.order_data.free_comment : "";
  this.modal_obj.psychotropic_drugs_much_reason = prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "";
  this.modal_obj.med_consult = prescription.order_data.med_consult ? prescription.order_data.med_consult : 0;
  this.modal_obj.supply_med_info = prescription.order_data.supply_med_info ? prescription.order_data.supply_med_info : 0;
  this.modal_obj.poultice_many_reason = prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "";
  this.modal_obj.potion = prescription.order_data.potion ? prescription.order_data.potion : "";
  if(prescription.order_data.doctor_code != null){
    this.modal_obj.last_doctor_code = prescription.order_data.doctor_code;
    if(prescription.order_data.doctor_name != null){
      this.modal_obj.last_doctor_name = prescription.order_data.doctor_name;
    } else {
      this.modal_obj.last_doctor_name = getDoctorName(prescription.order_data.doctor_code);
    }
  }
  
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
    potion: prescription.order_data.potion ? prescription.order_data.potion : 0,
    poultice_many_reason: prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "",
  };
  this.remarkRef.current.testRemarkRender(remark_status);
  
  this.setState({
      is_internal_prescription: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
      isForUpdate: true,
      additions,
      item_details,
      show_item_detail,
    },
    async function() {
      //Y1 編集時の禁忌薬判定の修正 => 「編集」で右エリアに展開するときは、判定処理は行ったうえで、確認ダイアログは出さずに許可済み状態で追加するように。
      if (Object.keys(diagnosisPrescriptionData).length > 0) {
        // check and show dialogue.(old code)
        /*this.modal_obj.diagnosisOrderModal = true;
        this.modal_obj.diagnosisOrderData = diagnosisPrescriptionData;
        this.modal_obj.presData = newPresData;*/
        Object.keys(diagnosisPrescriptionData).map(rpIdx=>{
          diagnosisPrescriptionData[rpIdx].map(medIdx=>{
            newPresData[rpIdx].medicines[medIdx].diagnosis_permission = 1;
          });
        });
      }
      let addition_info = {};
      addition_info.additions_check = additions_check;
      addition_info.additions_send_flag_check = additions_send_flag_check;
      addition_info['presData'] = newPresData;
      addition_info['from'] = "edit_order";
      addition_info.isUpdate = 1;
      // ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
      if (prescription.order_data != undefined && prescription.order_data != null && prescription.order_data.visit_place_id != undefined && prescription.order_data.visit_place_id != null && prescription.order_data.visit_place_id > 0) {
        addition_info['visit_place_id'] = prescription.order_data.visit_place_id;
      }
      await this.storeDataInCache(addition_info, "medicine_check");
      this.setDoCopyStatus(0, false, true);
      let history_list_obj = $("#div-history");
      let obj_item = $(".pres-title", history_list_obj);
      if(obj_item.hasClass("edit")){
        obj_item.removeClass("edit");
      }
      let pres_title_obj = $(".pres-title-"+prescription.number);
      pres_title_obj.addClass("edit");
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      this.confirmButtonRef.current.setInitialData();
      
      // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
      let modalObjState = {};
      modalObjState.med_consult = this.modal_obj.med_consult;
      modalObjState.supply_med_info = this.modal_obj.supply_med_info;
      modalObjState.in_out = this.modal_obj.inOut;
      modalObjState.presData = newPresData;
      this.prescribeTableRef.current.testModalObjRender(modalObjState);
      
      // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
      // let inOutState = {};
      // if (this.modal_obj.inOut == 3) inOutState.existAdministratePeriod = true;
      // this.inOutRef.current.testInOutRender(inOutState);
      
      // 処方箋 title update
      this.titleRef.current.testTitleRender(this.getOrderTitle());
    }
  );
}