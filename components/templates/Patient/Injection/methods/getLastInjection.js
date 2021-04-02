import * as apiClient from "~/api/apiClient";
import {CACHE_LOCALNAMES, getDoctorName} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {formatDateFull, getCurrentDate} from "~/helpers/date";

export default async function getLastInjection(patient_id, department_code, department_name=null, target_number=null, order_data=null, karte_status=null) {
  if(patient_id > 0){
    let path = "/app/api/v2/order/get/last_injection";
    let post_data = {};
    let injection = null;
    if(target_number !== 0){
      if(target_number != null){
        post_data.number = target_number;
      } else {
        post_data.department_code = department_code;
        post_data.patient_id = patient_id;
      }
      await apiClient._post(
        path,
        {params: post_data})
        .then((res) => {
          injection = res;
        })
        .catch(() => {
        });
    } else {
      injection = order_data;
    }
    
    if (injection != null) {
      let newPresData = injection.order_data.order_data.map(order => {
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
      newPresData.push(getEmptyInjection());
      let cacheInjectState = [];
      let persistState = JSON.parse(window.sessionStorage.getItem("haruka") ||window.localStorage.getItem("haruka"));
      
      let new_department_code = department_code;
      let karte_status_code = this.context.karte_status.code;
      let karte_status_name = this.context.karte_status.name;
      if (karte_status != null && karte_status > 0) {
        karte_status_code = karte_status == 1 ? 0 : karte_status == 3 ? 1 : 2;
        karte_status_name = karte_status == 1 ? "外来" : karte_status == 3 ? "入院" : "在宅";
        new_department_code = injection.order_data.department_code;
      }
      
      cacheInjectState.push({
        user_number: persistState.user_number,
        system_patient_id: patient_id,
        time: formatDateFull(new Date(), "-"),
        created_at: (department_name != null && injection.treatment_datetime !== undefined) ? injection.treatment_datetime : "",
        injectData: newPresData,
        number : department_name != null ? target_number : undefined,
        insurance_type: 0, //保険情報現状固定
        free_comment: Array.isArray(injection.order_data.free_comment) ? injection.order_data.free_comment : [], //備考
        department_code: new_department_code,
        department: department_name != null ? department_name : this.context.department.name,
        karte_status_code: karte_status_code,
        karte_status_name: karte_status_name,
        is_completed : injection.order_data.is_completed  ? injection.order_data.is_completed : 0,
        patient_name: injection.patient_name,
        medical_department_name: this.context.medical_department_name,
        duties_department_name: this.context.duties_department_name,
        unusedDrugSearch: 0,
        profesSearch: 0,
        normalNameSearch: 0,
        isForInjectionUpdate: false,
        additions : injection.order_data.additions,
        item_details:injection.order_data.item_details,
        location_id:injection.order_data.location_id,
        location_name:injection.order_data.location_name,
        drip_rate:injection.order_data.drip_rate,
        water_bubble:injection.order_data.water_bubble,
        exchange_cycle:injection.order_data.exchange_cycle,
        require_time:injection.order_data.require_time,
      });
      
      if (persistState.staff_category === 2) {
        cacheInjectState[0].doctor_name = this.context.selectedDoctor.name;
        cacheInjectState[0].doctor_code = this.context.selectedDoctor.code;
        cacheInjectState[0].substitute_name = this.state.currentUserName;
      }
      
      cacheInjectState[0].isUpdate = (target_number != null && target_number !== 0) ? 1 : 0;
      cacheInjectState[0].temp_saved = 1; // 仮登録
      if(cacheInjectState[0].isUpdate == 1 && injection.order_data.doctor_code != null){
        cacheInjectState[0].last_doctor_code = injection.order_data.doctor_code;
        if(injection.order_data.doctor_name != null){
          cacheInjectState[0].last_doctor_name = injection.order_data.doctor_name;
        } else {
          cacheInjectState[0].last_doctor_name = getDoctorName(injection.order_data.doctor_code);
        }
      }
      let serial_key = this.m_cacheSerialNumber;
      karteApi.setSubVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT, serial_key, JSON.stringify(cacheInjectState), 'insert');
    }
  }
  return true;
}

function getEmptyInjection() {
  return {
    medicines: [getEmptyInject()],
    days: 0,
    days_suffix: "",
    usage: 0,
    usageName: "",
    usageIndex: 0,
    year: "",
    month: "",
    date: "",
    body_part: "",
    usage_remarks_comment: [],
    start_date: getCurrentDate()
  };
}

function getEmptyInject() {
  return {
    medicineId: 0,
    medicineName: "",
    amount: 0,
    unit: "",
    free_comment: [],
  };
}