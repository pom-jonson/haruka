import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
export default async function(delDatas) {
  var injectionHistory = this.state.injectionHistory;
  let done_injectionHistory = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
  if (done_injectionHistory === undefined || done_injectionHistory == null) {
    done_injectionHistory = [];
  }
  
  delDatas.map(delData => {
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
        let del_index = done_injectionHistory.findIndex(x=>x.number===inject.number);
        if (del_index >= 0){
          done_injectionHistory[del_index] = inject;
        } else {
          done_injectionHistory.push(inject);
        }

      }
      return inject;
    });
  });

  this.setState({ injectionHistory });
  window.localStorage.setItem("haruka_cache_injectionHistory", JSON.stringify(injectionHistory));
  karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY, JSON.stringify(done_injectionHistory));
}
