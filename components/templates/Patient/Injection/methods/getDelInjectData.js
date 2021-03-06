import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
export default async function(delDatas, mode="del") {
  var injectionHistory = this.state.injectionHistory;
  let stop_order;
  let delete_injectionHistory = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
  if (delete_injectionHistory === undefined || delete_injectionHistory == null) {
    delete_injectionHistory = [];
  }
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
        // if exist equal item replace else push
        let del_index = delete_injectionHistory.findIndex(x=>x.number===inject.number);
        if (del_index >= 0){                               
          delete_injectionHistory[del_index] = inject;
        } else {
          delete_injectionHistory.push(inject);
        }

      }
      return inject;
    });
  });
  this.setState({ injectionHistory });
  // if deleted injection, enable confirm button.
  // [Rp単位]の削除 or [処方箋]の削除  => prescripton
  if (mode == "rp_delete" || mode == "order_delete") {
    this.modal_obj.canConfirm = 1;
  }
  if (this.confirmButtonRef.current != null && this.confirmButtonRef.current != undefined) {
    this.confirmButtonRef.current.testConfirmRender(1);
  }
  window.localStorage.setItem("haruka_cache_injectionHistory", JSON.stringify(injectionHistory));
  karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY, JSON.stringify(delete_injectionHistory));

}
