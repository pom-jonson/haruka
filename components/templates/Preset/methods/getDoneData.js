import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
export default async function(doneDatas) {
  var medicineHistory = this.state.medicineHistory;
  let done_medicineHistory = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
  // create deleted medicineHistory from medicineHistory
  if (done_medicineHistory === undefined || done_medicineHistory == null) {
    done_medicineHistory = [];
  }
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
        let del_index = done_medicineHistory.findIndex(x=>x.number===medicine.number);
        if (del_index >= 0){                               // if exist equal item replace else push
          done_medicineHistory[del_index] = medicine;
        } else {
          done_medicineHistory.push(medicine);
        }
      }
      return medicine;
    });
  });

  this.setState({ medicineHistory });
  window.localStorage.setItem("haruka_cache_medicineHistory", JSON.stringify(medicineHistory));
  karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY, JSON.stringify(done_medicineHistory));
}