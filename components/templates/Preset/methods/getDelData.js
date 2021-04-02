import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";

export default async function(delDatas, mode="del") {
  var medicineHistory = this.state.medicineHistory;
  let stop_order;
  let delete_medicineHistory = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
  if (delete_medicineHistory === undefined || delete_medicineHistory == null) {
    delete_medicineHistory = [];
  }
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

        // create deleted medicineHistory from medicineHistory

        let del_index = delete_medicineHistory.findIndex(x=>x.number===medicine.number);
        if (del_index >= 0){                               // if exist equal item replace else push
          delete_medicineHistory[del_index] = medicine;
        } else {
          delete_medicineHistory.push(medicine);
        }



      }
      return medicine;
    });
  });
  this.setState({ medicineHistory });
  window.localStorage.setItem("haruka_cache_medicineHistory", JSON.stringify(medicineHistory));
  karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY, JSON.stringify(delete_medicineHistory));
}
