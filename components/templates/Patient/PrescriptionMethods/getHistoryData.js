import axios from "axios";
import { persistedState } from "~/helpers/cache";

export default async function(params) {
  const { $canDoAction, FEATURES, AUTHS } = this.context;
  let { data } = await axios.get("/app/api/v2/order/prescription/patient", {
    params: {
      patient_id: params.id,
      limit: 10,
      // offset: this.state.medicineDBHistory.length,
      offset: params.offset,
      search_date: params.search_date != undefined && params.search_date != "" ? params.search_date : null,
      karte_status: params.karte_status != undefined && params.karte_status != null && params.karte_status != "" ? params.karte_status : 0,
      department: params.department,
      latest_flag: params.latest_flag
    }
  });

  let medicineHistory = [];
  let {cacheDelState, cacheDoneState} = persistedState(params.id);
  if (data) {
    let addCount = 0;
    medicineHistory = data
      .filter(item => {
        if (
          $canDoAction(FEATURES.PRESCRIPTION, AUTHS.SHOW_DELETE) ||
          item.is_enabled === 1
        ) {
          addCount++;
          return addCount <= params.limit;
        }
        return false;
      })
      .map((item, index) => {
        if (index < 3) {
          item.order_data.class_name = "open";
        } else {
          item.order_data.class_name = "";
        }
        return item;
      });
  }
    if (cacheDelState !== undefined && cacheDelState != null && cacheDelState.length > 0) {
    del_cache_process(medicineHistory,cacheDelState);
    }
    if (cacheDoneState !== undefined && cacheDoneState != null && cacheDoneState.length > 0){
    done_cache_process(medicineHistory, cacheDoneState);
    }
  window.localStorage.setItem("haruka_cache_medicineHistory", JSON.stringify(medicineHistory));
  this.setState({ 
    medicineHistory, 
    medicineDBHistory: data,
    isLoaded: true,
  },async()=>{
    await this.getHistoryMoreData(params);
  });
  return data;
}
// delete state red color show
function del_cache_process(state_medicineHistory, delDatas, mode="del") {
  var medicineHistory = state_medicineHistory;
  let stop_order;
  delDatas.filter(ele=>{
    if (ele.delete_type != "soap") {
      return true;
    } else {
      return false;
    }
  }).map(delData => {
    stop_order= (delData.stop_order !== undefined && delData.stop_order == 1 && mode=="del") ? 1 : 0;
    medicineHistory = medicineHistory.filter(medicine => {
      if (medicine.number == delData.number) {

        if (delData.order_data !== undefined) {
          let order_data = [];
          medicine.order_data.order_data.map(med_order_data => {
            let deleted = false;
            delData.order_data.map(item => {
              if (item.order_number === med_order_data.order_number) {
                deleted = true;
              }
            });
            if (deleted || stop_order) {
              med_order_data.is_enabled = 2;
            }
            if(mode != "del" && med_order_data.is_enabled != undefined && !deleted) {
              // medicine.stop_order = 0;
              delete med_order_data.is_enabled;
            }
            order_data.push(med_order_data);
          });
          medicine.order_data.order_data = order_data;
        } else {
          medicine.is_enabled = 3;
        }
        medicine.stop_order = stop_order;
      }
      return medicine;
    });
  });
  return medicineHistory;
}
// done state blue color show
function done_cache_process( state_medicineHistory, doneDatas) {
  var medicineHistory = state_medicineHistory;
  doneDatas.map(doneData => {
    medicineHistory = medicineHistory.filter(medicine => {
      if (medicine.number == doneData.number) {
        if (doneData.order_data !== undefined) {
          let order_data = [];
          medicine.order_data.order_data.map(med_order_data => {
            order_data.push(med_order_data);
            med_order_data.done_order = 2;
          });
          medicine.order_data.order_data = order_data;
        }
        medicine.done_order = 2;
      }
      return medicine;
    });
  });
  return medicineHistory;
}
