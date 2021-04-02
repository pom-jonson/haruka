import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {formatDateLine, formatTimeIE} from "~/helpers/date";

export default function (done_flag = 0, cache_save = true) {
  let detail_data = [];
  this.state.detail_json_array.map(item=>{
    if(item != null){
      detail_data.push(item);
    }
  });
  if(detail_data == null || detail_data.length < 1){
    return "内容を選択してください。";
  }
  if(this.state.insurance_id == undefined || this.state.insurance_id == null)
    return "保険を選択してください。";
  if(this.state.patient_id == undefined || this.state.patient_id == null)
    return "患者様を選択してください。";
  let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  let header = {};
  header['number'] = this.state.number;
  header['isForUpdate'] = this.state.isForUpdate;
  header['state'] = this.state.state;
  if(done_flag === 1 && !this.state.isPeriodTreatment){
    header['state'] = done_flag;
  }
  if (!cache_save) header['state'] = 0;
  header['system_patient_id'] = this.state.patient_id;
  header['date'] = formatDateLine(this.state.collected_date);
  header['location_id'] = this.state.location_id != undefined ? this.state.location_id : 0;
  header['location_name'] = this.state.location_name != undefined ? this.state.location_name : "";
  header['start_time'] = this.state.start_time !== "" ? formatTimeIE(this.state.start_time) : "";
  header['insurance_id'] = this.state.insurance_id;
  let patientInfo = karteApi.getPatient(this.state.patient_id);
  if (this.props.from_source === "progress_chart") patientInfo = this.props.patientInfo;
  header['insurance_name'] = patientInfo.insurance_type_list.find((x) => x.code == this.state.insurance_id) != undefined ?
    patientInfo.insurance_type_list.find((x) => x.code == this.state.insurance_id).name : "";
  header['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
  header['display_department_id'] = this.state.display_department_id;
  header['department_name'] = this.state.department_name;
  header['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
  header['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
  if (this.state.isPeriodTreatment == true) {
    header['isPeriodTreatment'] = 1;
    header['date'] = formatDateLine(new Date());
    this.state.detail_json_array.map(item=> {
      if (item.timely_done == 1) {
        header['timely_done'] = 1;
        header['start_date'] = item.start_date;
      }
    });
  }
  let additions = {};
  //加算項目------------------------------
  if(this.state.additions !== undefined && this.state.additions != null && Object.keys(this.state.additions_check).length > 0){
    Object.keys(this.state.additions_check).map(key => {
      if (this.state.additions_check[key]){
        let addition_row = '';
        this.state.additions.map(addition => {
          if (addition.addition_id == key){
            addition['sending_flag'] = 2;
            if(addition.sending_category === 1){
              addition['sending_flag'] = 1;
            }
            if(addition.sending_category === 3 && this.state.additions_send_flag_check[key]){
              addition['sending_flag'] = 1;
            }
            addition_row = addition;
          }
        });
        additions[key] = addition_row;
      }
    })
  }
  let value =  {general_id: 1, karte_status: 1, header:header, detail:detail_data, additions};
  if(this.props.is_hospital == 1) {
    value.general_id = 3;
    value.karte_status = 3;
  }
  value.karte_status = this.state.karte_status ? this.state.karte_status : value.karte_status;
  value.created_at = this.state.created_at;
  if(this.state.done_comment !== undefined && this.state.done_comment !== ""){
    value.done_comment = this.state.done_comment;
  }
  if (authInfo.staff_category !== 1){
    header['substitute_name'] = authInfo.name;
  }
  if(this.state.isForUpdate === 1 && this.props.cache_index != null){
    let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, this.props.cache_index);
    if(cache_data !== undefined && cache_data != null && cache_data.last_doctor_code !== undefined){
      value.last_doctor_code = cache_data.last_doctor_code;
      value.last_doctor_name = cache_data.last_doctor_name;
    }
    if (this.props.cache_data !== undefined && this.props.cache_data != null){
      cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
      value.last_doctor_code = cache_data.header.doctor_code;
      value.last_doctor_name = cache_data.header.doctor_name;
    }
  }
  if (this.props.from_source !== "progress_chart") {
    if (cache_save) {
      if(this.props.cache_index != null){
        karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT, this.props.cache_index, JSON.stringify(value), 'insert');
      } else {
        karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT, new Date().getTime(), JSON.stringify(value), 'insert');
      }
    }
  } else {
    return value;
  }
  if (!cache_save) return value;
  return "success";
}
