import axios from "axios";
import { persistedState } from "~/helpers/cache";

export default async function(params, first_load=null) {
  const { $canDoAction, FEATURES, AUTHS } = this.context;
  let { data } = await axios.get("/app/api/v2/order/injection/find", {
    params: {
      patient_id: params.id,
      limit: 10,
      offset: params.offset,
      search_date: params.search_date != undefined && params.search_date != "" ? params.search_date : null,
      karte_status: params.karte_status != undefined && params.karte_status != null && params.karte_status != "" ? params.karte_status : 0,
      department: params.department,
      latest_flag: params.latest_flag
    }
  });

  let injectionHistory = [];
  let {cacheDelInjectState, cacheDoneInjectState} = persistedState(params.id);
  if (data) {
    let addCount = 0;
    injectionHistory = data
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
    if (cacheDelInjectState !== undefined && cacheDelInjectState != null && cacheDelInjectState.length > 0) {
      del_cache_process(injectionHistory,cacheDelInjectState)
    }
    if (cacheDoneInjectState !== undefined && cacheDoneInjectState != null && cacheDoneInjectState.length > 0){
      done_cache_process(injectionHistory, cacheDoneInjectState);
    }
  window.localStorage.setItem("haruka_cache_injectionHistory", JSON.stringify(injectionHistory));
  let ret_state = {
    injectionHistory, 
    injectionDBHistory: data,
  };
  await this.getInjectionHistoryMoreData(params, true, first_load).then(function(data){
    if(Object.keys(data).length > 0){
      Object.keys(data).map(key=>{
        ret_state[key] = data[key];
      })
    }
  });
  return ret_state;
}

function del_cache_process(state_injectionHistory, delDatas, mode="del") {
  var injectionHistory = state_injectionHistory;
  let stop_order;
  delDatas.filter(ele=>{
    if (ele.delete_type != "soap") {
      return true;
    } else {
      return false;
    }
  }).map(delData => {
    stop_order= (delData.stop_order !== undefined && delData.stop_order == 1 && mode=="del") ? 1 : 0;
    injectionHistory = injectionHistory.filter(inject => {
      if (inject.number == delData.number) {
        if (delData.order_data !== undefined) {
          let order_data = [];
          inject.order_data.order_data.map(inject_order_data => {
            let deleted = false;
            delData.order_data.map(item => {
              if (item.order_number === inject_order_data.order_number) {
                deleted = true;
              }
            });
            if (deleted || stop_order) {
              inject_order_data.is_enabled = 2;
            }
            if(mode != "del" && inject_order_data.is_enabled != undefined && !deleted) {
              delete inject_order_data.is_enabled;
            }
            order_data.push(inject_order_data);
          });
          inject.order_data.order_data = order_data;
        } else {
          inject.is_enabled = 3;
        }
        inject.stop_order = stop_order;
      }
      return inject;
  });
  });
  return injectionHistory;
}

function done_cache_process(state_injectionHistory, doneDatas) {
  var injectionHistory = state_injectionHistory;
  doneDatas.map(delData => {
    injectionHistory = injectionHistory.filter(inject => {
      if (inject.number == delData.number) {
        if (delData.order_data !== undefined) {
          let order_data = [];
          inject.order_data.order_data.map(inject_order_data => {
            inject_order_data.done_order = 2;
            order_data.push(inject_order_data);
          });
          inject.order_data.order_data = order_data;
        }
        inject.done_order = 2;
      }
      return inject;
    });
  });
  return injectionHistory;
}
