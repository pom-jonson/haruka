import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

export default function(selected_medicine) {
    // let medicineId = selected_medicine.item_number;
    let arr_reject = [];
    let arr_ret = [];
    let status = 0;
    // this.state.injectData.map(rece => {
    //   rece.medicines.map(medicine => {              
    //       if(medicine.contraindication_reject){
    //         if(medicine.contraindication_reject.includes(medicineId.toString())){
    //           if(!arr_reject.includes(medicine.medicineId)){
    //               arr_reject.push(medicine.medicineId);
    //               arr_ret.push(medicine);
    //           }
    //         }
    //       }
    //   });
    // }); 

    this.state.injectData.forEach(rece => {
      rece.medicines.forEach(medicine => {   
        status = getAlertReject(medicine, selected_medicine);
        if( (status & 2) > 0) {
          if(!arr_reject.includes(medicine.medicineId)){
            arr_reject.push(medicine.medicineId);
            arr_ret.push(medicine);
          }
        }
        status = getAlertReject(selected_medicine, medicine);
        if( (status & 2) > 0) {
          if(!arr_reject.includes(medicine.medicineId)){
            arr_reject.push(medicine.medicineId);
            arr_ret.push(medicine);
          }
        }          
      });
    }); 

    // this.state.injectData.map(function(order) {
    //   order.medicines.map(function(item) {        
    //     if (selected_medicine.contraindication_reject !== undefined) {
    //       if(selected_medicine.contraindication_reject.includes(item.medicineId.toString())){
    //         if(!arr_reject.includes(item.medicineId)){
    //           arr_reject.push(item.medicineId);
    //           arr_ret.push(item);
    //         }
    //       }
    //     }
    //   });
    // }); 
    return arr_ret;
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
  