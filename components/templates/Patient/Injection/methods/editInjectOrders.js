/**
 * 編集対象の処方データを入力欄に表示する。
 */

// import { formatDateFull } from "../../../../../helpers/date";

export default function(prescription, is_done = false) {
  // if (this.checkInjectCanEdit(1) === false) {
  //   let orders = [];
  //   orders.push(prescription);
  //   this.setState({
  //     tempItems: orders
  //   });
  //   return;
  // }
  // 編集がキャンセルされているときに、実施だけ動いてしまうような不具合  2019/10/02
  if(this.modal_obj.isEdintingIndex !== -1){
    let injectionHistory = this.state.injectionHistory;
    let donePrescription = injectionHistory[this.modal_obj.isEdintingIndex];
    donePrescription.done_order = 0;
    let pre_order_data = donePrescription.order_data.order_data.map(medicine => {
      medicine.done_order = 0;
      return medicine;
    });
    donePrescription.order_data.order_data = pre_order_data;
    injectionHistory[this.modal_obj.isEdintingIndex] = donePrescription;

    this.medicineSelectionRef.current.testMedRender(injectionHistory);
    // this.setState({injectionHistory});
    window.localStorage.setItem("haruka_cache_injectionHistory", JSON.stringify(injectionHistory));
    //実施キャッシュから削除
    let cacheDoneState = JSON.parse(window.localStorage.getItem("haruka_inject_done_cache"));
    if(cacheDoneState){
      cacheDoneState = cacheDoneState.filter((data, index) => {
        return index != this.modal_obj.isEdintingIndex;
      });
      if (cacheDoneState.length < 1)
        window.localStorage.removeItem("haruka_inject_done_cache");
      else
        window.localStorage.setItem("haruka_inject_done_cache", JSON.stringify(cacheDoneState));
    }
  }

  // let oplog = window.localStorage.getItem("operation_log");
  // let operation_log = [];
  // if(oplog !== null) {
  //   operation_log = JSON.parse(window.localStorage.getItem("operation_log") || "");
  // }
  // let time = new Date();
  // let category = "edit"
  // let detail = "処方箋(編集中)"
  // let log = {
  //   time: formatDateFull(time, "-"),
  //   category: category,
  //   detail: detail
  // };
  // operation_log.push(log);
  // window.localStorage.setItem("operation_log", JSON.stringify(operation_log));

  // var path = window.location.href.split("/");
  // var presetPath = path[path.length-2] + "/" + path[path.length-1];

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
    };
  });  
  newPresData.push(this.getEmptyInjection());

  let editingIndex = -1;
  this.state.injectionHistory.map((item, index) => {
    if (
      item.order_data.order_data[0].order_number === newPresData[0].order_number
    ) {
      editingIndex = index;
    }
  });  

  this.context.$updateDepartment(
    prescription.order_data.department_code,
    prescription.order_data.department
  );

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
  this.modal_obj.drip_rate = prescription.order_data.drip_rate ? prescription.order_data.drip_rate : 0;
  this.modal_obj.water_bubble = prescription.order_data.water_bubble ? prescription.order_data.water_bubble : 0;
  this.modal_obj.exchange_cycle = prescription.order_data.exchange_cycle ? prescription.order_data.exchange_cycle : 0;
  this.modal_obj.require_time = prescription.order_data.require_time ? prescription.order_data.require_time : 0;
  this.modal_obj.schedule_date = prescription.order_data.schedule_date ? new Date(prescription.order_data.schedule_date) : new Date();
  this.modal_obj.is_done = is_done;  
  this.modal_obj.inOut = prescription.order_data.is_completed  ? prescription.order_data.is_completed : 0;  

  let remark_status = {
    location_id: this.modal_obj.location_id,
    drip_rate: this.modal_obj.drip_rate,
    water_bubble: this.modal_obj.water_bubble,
    exchange_cycle: this.modal_obj.exchange_cycle,
    require_time: this.modal_obj.require_time,
  };

  // let in_out = prescription.order_data.is_completed;
  let reset_state = {
    id: this.modal_obj.inOut,
    schedule_date: this.modal_obj.schedule_date
  };

  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
  this.remarkRef.current.testRemarkRender(remark_status);        
  this.injectionInOutRef.current.testInOutRender(reset_state);

  // this.modal_obj.bulk = newBulk;

  // this.remarkRef.current.testRemarkRender(newBulk); 
  
  this.setState(
    {
      // injectData: newPresData,
      orderNumber: prescription.number ? prescription.number : 0,
      department: prescription.order_data.department ? prescription.order_data.department : authInfo.medical_department_name || "",
      departmentId: prescription.order_data.department_code ? prescription.order_data.department_code : authInfo.department,
      // inOut: prescription.order_data.is_completed  ? prescription.order_data.is_completed : 0,
      free_comment: prescription.order_data.free_comment ? prescription.order_data.free_comment : "",
      isForUpdate: true,
      isEdintingIndex: editingIndex,
      // is_done: is_done,
      injectionHistory: this.setInjectDoCopyStatus(0, false, true),
      additions,
      item_details,
      show_item_detail,
    },
    function() {
        let addition_info = {};
        addition_info.additions_check = additions_check;
        addition_info.additions_send_flag_check = additions_send_flag_check;
        addition_info['injectData'] = newPresData;
        addition_info.isUpdate = 1;        
        this.storeInjectionDataInCache(addition_info);

        this.medicineSelectionRef.current.testMedRender(this.setInjectDoCopyStatus(0, false, true), editingIndex);
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        // 処方箋 title update
        this.titleRef.current.testTitleRender(this.getInjectionOrderTitle());
    }
  );
}
