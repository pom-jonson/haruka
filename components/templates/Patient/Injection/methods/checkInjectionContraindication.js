import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";

export default function(selected_medicine) {
    let alert = 0;    
    let reject = 0;
    let alert_medicines = "";
    let reject_medicines = "";
    let medicineId = selected_medicine.code;
    if(medicineId == undefined){
      medicineId = selected_medicine.item_number;
      if (selected_medicine.item_number == undefined || selected_medicine.item_number == "") {
        medicineId = selected_medicine.medicineId;
      }
    }
    let arr_alert = [];
    let arr_reject = [];
    let status = 0;  

    let injectData_arr = this.state.injectData;
    let result_arr = [];

    injectData_arr.map(ele=>{
        result_arr.push(ele);
    });  

    // ------------- mediines contraindication for double prescriptio start-----------//
    let cacheState = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_EDIT);    
    if (cacheState != undefined || cacheState != null) {
        if (Object.keys(cacheState).length > 0) {
            let arr = [];
            result_arr = [];
            Object.keys(cacheState).forEach(function(key){
                arr.push(key);
            });            
            for (let i = 0; i < arr.length; i ++) {
                let injectData = cacheState[arr[i]][0].injectData; 
                injectData.map(item=>{
                    result_arr.push(item);
                })

            }
        }
        
    }

    // ------------- mediines contraindication for double prescriptio end-----------//

    result_arr.forEach(rece => {
      rece.medicines.forEach(medicine => {    
        status = getAlertReject(medicine, selected_medicine);
        if( (status & 1) > 0) {
          alert = 1;
          if(!arr_alert.includes(medicine.medicineId)){
            arr_alert.push(medicine.medicineId);
          }
        } 
        if( (status & 2) > 0) {
          reject = 1;
          if(!arr_reject.includes(medicine.medicineId)){
            arr_reject.push(medicine.medicineId);
          }
        }       
      });
    });     

    result_arr.forEach(function(order) {
      order.medicines.forEach(function(item) {
        status = getAlertReject(selected_medicine, item);
        if( (status & 1) > 0) {
          alert = 1;
          if(!arr_alert.includes(item.medicineId)){
            arr_alert.push(item.medicineId);
          }
        } 
        if( (status & 2) > 0) {
          reject = 1;
          if(!arr_reject.includes(item.medicineId)){
            arr_reject.push(item.medicineId);
          }
        }        
      });
    });

    result_arr.map(function(order) {
      order.medicines.map(function(item) {
        if (arr_alert.includes(item.medicineId) && item.medicineName !== "") {
          alert_medicines = `${alert_medicines}・${item.medicineName}#` ;
        }
        if (arr_reject.includes(item.medicineId) && item.medicineName !== "") {
          reject_medicines = `${reject_medicines}・${item.medicineName}#` ;
        }        
      });
    }); 

    if(reject == 1){
      // this.setState({showMedicineOrigin: reject_medicines});
      this.modal_obj.showMedicineOrigin = reject_medicines;
      return 2;
    }
    
    if(alert == 1){
      // this.setState({showMedicineOrigin: alert_medicines});
      this.modal_obj.showMedicineOrigin = alert_medicines;
      return 1;
    }    

    return 0;
  }

  function getAlertReject(s_item, d_item) {
  
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");        
    let japic_alert_reject = conf_data.japic_alert_reject != null && conf_data.japic_alert_reject != undefined && conf_data.japic_alert_reject != "" ? conf_data.japic_alert_reject : 1;    

    if(s_item.tagret_contraindication == undefined || s_item.tagret_contraindication == null ) return 0;
    if(d_item.yj_code == undefined || d_item.yj_code == null ) return 0;
    if(s_item.tagret_contraindication.length == 0 ) return 0;
    
    let ret = 0;
    let set = parseInt(japic_alert_reject);
    for (let item of s_item.tagret_contraindication) {
      if(item.t_9 == d_item.yj_code.substring(0,9)) {
        if(item.i_c > 1) ret = ret | 1;
        else {
          if(set == 1) ret = ret | 2;
          else ret = ret | 1;
        }
        // ret =ret | ((item.interaction_category<=1) ? 2 : 1);
      }
    }
    
    return ret;
}
  