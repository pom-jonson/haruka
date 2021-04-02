import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";

export default function(delDatas, mode="del", init=false) {
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
      medicine.last_doctor_code = delData.last_doctor_code;
      medicine.last_doctor_name = delData.last_doctor_name;
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

  // if deleted prescription, enable confirm button.
  // [Rp単位]の削除 or [処方箋]の削除  => prescripton
  // if (mode == "rp_delete" || mode == "order_delete") {
  //   this.modal_obj.canConfirm = 1;
  // }

  // check exist del cache
  let delete_cache_array = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
  let _exist = 0;
  if(delete_cache_array != undefined && delete_cache_array != null && delete_cache_array.length > 0) {    
    delete_cache_array.map(ele=>{
      if (ele.cacheSerialNumber == this.m_cacheSerialNumber) {
        _exist = 1;
      }
    });      
  }

  if (this.confirmButtonRef.current != null && this.confirmButtonRef.current != undefined) {    
    this.confirmButtonRef.current.testConfirmRender(null, _exist);
  }


  window.localStorage.setItem("haruka_cache_medicineHistory", JSON.stringify(medicineHistory));
  karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY, JSON.stringify(delete_medicineHistory));
  if(init){
    return medicineHistory;
  } else {
    this.setState({medicineHistory});
  }
}
