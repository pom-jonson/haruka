import $ from "jquery";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, getDoctorName} from "~/helpers/constants";

export default async function(prescription, is_done = false) {
  // ■YJ401 Doや編集が展開できていないように見える問題の修正
  if(this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != undefined){
    await this.prescribeTableRef.current.setPrescribeTableLoad(false);
  }
  // 編集がキャンセルされているときに、実施だけ動いてしまうような不具合  2019/10/02
  if(this.modal_obj.isEdintingIndex !== -1){
    //実施キャッシュから削除
    let cache_done_history = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
    let cache_done = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE);
    if (cache_done_history != null && cache_done_history.length > 0) {
      cache_done_history = cache_done_history.filter(x=>x.number!=prescription.number);
    }
    if (cache_done != null && cache_done.length > 0) {
      cache_done = cache_done.map(medicine=>{
        if(medicine.number == prescription.number){
          let pres_history_obj = $(".inject-medicine-"+prescription.number);
          pres_history_obj.removeClass("line-done");
        } else {
          return medicine;
        }
      })
    }
    if (cache_done_history != null && cache_done_history.length > 0) {
      karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY, JSON.stringify(cache_done_history));
      karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE, JSON.stringify(cache_done));
    } else {
      karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
      karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE);
    }
  }
  
  // YS132 単位がなくなっている場合の対策
  // 「主単位以外の単位が登録されていて、該当薬剤の単位の候補に存在しない単位名」の薬剤がある場合は、下記のようにアラートを出して、そのRPを追加しないようにしてください。
  
  if (this.checkHasNoUnitInjectionPrescription(prescription) == false) {
    // ■YJ401 Doや編集が展開できていないように見える問題の修正
    if(this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != undefined){
      this.prescribeTableRef.current.setPrescribeTableLoad(true);
    }
    return;
  }
  
  let newPresData = prescription.order_data.order_data.map(order => {
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
          free_comment: free_comment,
          usage_comment: medicine.usage_comment,
          uneven_values: medicine.uneven_values,
          units_list: medicine.units_list,
          contraindication_alert: medicine.contraindication_alert,
          contraindication_reject: medicine.contraindication_reject,
          tagret_contraindication: medicine.tagret_contraindication,
          yj_code: medicine.yj_code
        };
      }),
      units: [],
      usage: order.usage,
      usageName: order.usage_name,
      days: order.days,
      days_suffix: order.days_suffix,
      injectUsageName: order.injectUsageName,
      injectUsage: order.injectUsage,
      year: "",
      month: "",
      date: "",
      order_number: order.order_number,
      order_number_serial: order.order_number_serial,
      medical_business_diagnosing_type: 32,
      insurance_type:
        order.insurance_type === undefined ? 0 : order.insurance_type,
      usage_remarks_comment: usageRemarksList,
      start_date: order.start_date,
      usage_replace_number: order.usage_replace_number,
      body_part: order.body_part === undefined ? "" : order.body_part,
      receipt_key_if_precision: order.receipt_key_if_precision === undefined ? undefined : order.receipt_key_if_precision,
      is_precision: order.is_precision === undefined ? undefined : order.is_precision,
      administrate_period: order.administrate_period == undefined || order.administrate_period == null ? null : order.administrate_period
    };
  });
  newPresData.push(this.getEmptyInjection());
  
  let editingIndex = -1;
  this.state.injectionHistory.map((item, index) => {
    if (item.number === prescription.number) {
      editingIndex = index;
    }
  });
  
  if (this.context.department.code != prescription.order_data.department_code) {
    this.context.$updateDepartment(prescription.order_data.department_code,prescription.order_data.department);
  }
  
  let cache_karte_status = parseInt(prescription.karte_status);
  let cache_karte_status_code = cache_karte_status == 1 ? 0 : cache_karte_status == 3 ? 1 : 2;
  let cache_karte_status_name = cache_karte_status == 1 ? "外来" : cache_karte_status == 3 ? "入院" : "訪問診療";
  if (this.context.karte_status.code != cache_karte_status_code) {
    this.context.$updateKarteStatus(cache_karte_status_code, cache_karte_status_name, null, "no_patient_karte_status");
  }
  
  window.sessionStorage.removeItem("prescribe-container-scroll");
  for (var key in window.localStorage) {
    if (key.includes("inject_keyword")) {
      window.localStorage.removeItem(key);
    }
  }
  window.sessionStorage.setItem("isForInjectionUpdate", true);
  const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  
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
    })
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
  this.modal_obj.location_id = prescription.order_data.location_id ? prescription.order_data.location_id : 0;
  this.modal_obj.location_name = prescription.order_data.location_name ? prescription.order_data.location_name : 0;
  this.modal_obj.drip_rate = prescription.order_data.drip_rate ? prescription.order_data.drip_rate : 0;
  this.modal_obj.water_bubble = prescription.order_data.water_bubble ? prescription.order_data.water_bubble : 0;
  this.modal_obj.exchange_cycle = prescription.order_data.exchange_cycle ? prescription.order_data.exchange_cycle : 0;
  this.modal_obj.free_comment = prescription.order_data.free_comment ? prescription.order_data.free_comment : "";
  this.modal_obj.require_time = prescription.order_data.require_time ? prescription.order_data.require_time : 0;
  this.modal_obj.schedule_date = prescription.order_data.schedule_date ? new Date(prescription.order_data.schedule_date) : new Date();
  this.modal_obj.is_done = is_done;
  this.modal_obj.inOut = prescription.order_data.is_completed  ? prescription.order_data.is_completed : 0;
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
  if (this.itemPrescriptionRef.current != undefined && this.itemPrescriptionRef.current != null) {
    this.itemPrescriptionRef.current.testPrescriptionNameRender({item_details:item_details});
  }
  
  let remark_status = {
    location_id: this.modal_obj.location_id,
    drip_rate: this.modal_obj.drip_rate,
    water_bubble: this.modal_obj.water_bubble,
    exchange_cycle: this.modal_obj.exchange_cycle,
    require_time: this.modal_obj.require_time,
    free_comment: this.modal_obj.free_comment,
  };
  
  let reset_state = {
    id: this.modal_obj.inOut,
    schedule_date: this.modal_obj.schedule_date
  };
  
  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
  this.remarkRef.current.testRemarkRender(remark_status);
  this.injectionInOutRef.current.testInOutRender(reset_state);
  setTimeout(()=>{
    this.setState({
      orderNumber: prescription.number ? prescription.number : 0,
      department: prescription.order_data.department ? prescription.order_data.department : authInfo.medical_department_name || "",
      departmentId: prescription.order_data.department_code ? prescription.order_data.department_code : authInfo.department,
      isForUpdate: true,
      isEdintingIndex: editingIndex,
      additions,
      item_details,
      show_item_detail,
    },async function() {
      let addition_info = {};
      addition_info.additions_check = additions_check;
      addition_info.additions_send_flag_check = additions_send_flag_check;
      addition_info['injectData'] = newPresData;
      addition_info.isUpdate = 1;
      // ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
      if (prescription.order_data != undefined && prescription.order_data != null && prescription.order_data.visit_place_id != undefined && prescription.order_data.visit_place_id != null && prescription.order_data.visit_place_id > 0) {
        addition_info['visit_place_id'] = prescription.order_data.visit_place_id;
      }
      await this.storeInjectionDataInCache(addition_info);
      this.setInjectDoCopyStatus(0, false, true);
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      await this.confirmButtonRef.current.setInitialData();
      // 処方箋 title update
      this.titleRef.current.testTitleRender(this.getInjectionOrderTitle());
      this.setInjectDoCopyStatus(0, false, true);
      let history_list_obj = $("#injection_history_wrapper");
      let obj_item = $(".inject-title", history_list_obj);
      if(obj_item.hasClass("edit")){
        obj_item.removeClass("edit");
      }
      let inject_title_obj = $(".inject-title-"+prescription.number);
      inject_title_obj.addClass("edit");
    });
  }, 1000);
  
}
