import axios from "axios";

export default async function(params, first=true, first_load=null) {
  let ret_state = {};
  if (first_load == null) {
    // 処方のツリー情報取得のAPI通信データ制限処理
    if(first){
      this.modal_obj.getHistoryEnd = 1;
    }
    this.modal_obj.loadedEnd = first;
    ret_state.isLoaded = first;
    ret_state.stop_prescribe_table_load = false;
    return ret_state;
  }
  let { data } = await axios.get("/app/api/v2/order/prescription/patient", {
    params: {
      patient_id: params.id,
      limit: 1000,
      offset: this.state.medicineHistory.length,
      search_date: params.search_date != undefined && params.search_date != "" ? params.search_date : null,
      karte_status: params.karte_status != undefined && params.karte_status != null && params.karte_status != "" ? params.karte_status : 0,
      department: params.department,
      latest_flag: params.latest_flag
    }
  });
  if (data !== undefined && data != null && data.length > 0) {
    let medicineDBHistory = [];
    data.map(item => {
      medicineDBHistory.push(item);
    });
    if(first){
      this.modal_obj.getHistoryEnd = 1;
    }
    this.modal_obj.loadedEnd = first;
    ret_state.medicineDBHistory = medicineDBHistory;
    ret_state.isLoaded = first;
    ret_state.stop_prescribe_table_load = false;
  } else {
    if(first){
      this.modal_obj.getHistoryEnd = 1;
    }
    ret_state.medicineDBHistory = [];
    this.modal_obj.loadedEnd = first;
    ret_state.isLoaded = first;
    ret_state.stop_prescribe_table_load = false;
  }
  return ret_state;
}
