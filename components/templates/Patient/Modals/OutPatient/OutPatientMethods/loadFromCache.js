import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {formatDateTimeIE, formatTimePicker} from "~/helpers/date";

export default function (index) {
  let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, index);
  if (this.props.cache_data != undefined && this.props.cache_data != null) cache_data =JSON.parse(JSON.stringify(this.props.cache_data));
  if (cache_data === undefined || cache_data == null) return;
  let header_data = cache_data.header;
  let detail_data = cache_data.detail;
  //加算項目-----------------------------------------------
  let additions_check = {};
  let additions_send_flag_check = {};
  let additions = [];
  if (this.state.additions != undefined && this.state.additions!= null){
    additions = this.state.additions;
    additions.map(addition=> {
      if (cache_data != null && cache_data.additions != undefined && cache_data.additions[addition.addition_id] != undefined){
        additions_check[addition.addition_id] = true;
        let sending_flag = cache_data.additions[addition.addition_id]['sending_flag'];
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
  this.setState({
    detail_json_array: detail_data,
    karte_status: cache_data.karte_status,
    collected_date: formatDateTimeIE(header_data.date),
    start_time: header_data.start_time != "" ? formatTimePicker(header_data.start_time) : "",
    is_exist_time: header_data.start_time != "" ? 1 : 2 ,
    location_id: parseInt(header_data.location_id),
    location_name: header_data.location_name,
    insurance_id: parseInt(header_data.insurance_id),
    insurance_name: header_data.insurance_name,
    display_department_id: header_data.display_department_id !== undefined && header_data.display_department_id != null ? parseInt(header_data.display_department_id) : 1,
    department_name: header_data.department_name,
    number:header_data.number,
    isForUpdate:header_data.isForUpdate,
    state:header_data.state,
    created_at:cache_data.created_at,
    additions,
    additions_check,
    additions_send_flag_check,
    done_comment:cache_data.done_comment !== undefined ? cache_data.done_comment : "",
    isPeriodTreatment: header_data.isPeriodTreatment != undefined && header_data.isPeriodTreatment != null && header_data.isPeriodTreatment == 1 ? true : false
  })
}