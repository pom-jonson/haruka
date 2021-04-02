import axios from "axios";

export default async function(params, first=true, first_load=null) {
  let ret_state = {};
  if (first_load == "first_load") {
    // 処方のツリー情報取得のAPI通信データ制限処理
    this.modal_obj.getHistoryEnd = 1;
    this.modal_obj.loadedEnd = first;
    ret_state = {
      // injectionDBHistory,
      isLoaded: first,
    };
    return ret_state;
  }
  let { data } = await axios.get("/app/api/v2/order/injection/find", {
      params: {
        patient_id: params.id,
        limit: 1000,
        offset: this.state.injectionDBHistory.length,
        search_date: params.search_date != undefined && params.search_date != "" ? params.search_date : null,
        karte_status: params.karte_status != undefined && params.karte_status != null && params.karte_status != "" ? params.karte_status : 0,
        department: params.department,
        latest_flag: params.latest_flag
      }
  });
  if (data !== undefined && data != null && data.length > 0) {
      // let injectionDBHistory = this.state.injectionDBHistory;
      // data.map(item => {
      //   injectionDBHistory.push(item);
      //   if (item.history != "") {
      //     this.getTrackData(item.number);
      //   }
      // })
      let injectionDBHistory = [];
      data.map(item => {
        injectionDBHistory.push(item);          
      })      
      this.modal_obj.getHistoryEnd = 1;
      this.modal_obj.loadedEnd = first;
      ret_state = {
        injectionDBHistory,
        isLoaded: first,
      };
  } else {
    this.modal_obj.getHistoryEnd = 1;
    this.modal_obj.loadedEnd = first;
    ret_state = {
      isLoaded: first,
    };
  }
  return ret_state;
}
  