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

    let presData_arr = this.state.presData;
    let result_arr = [];

    presData_arr.map(ele=>{
        result_arr.push(ele);
    });

    // ------------- mediines contraindication for double prescriptio start-----------//
    let cacheState = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);    
    if (cacheState != undefined || cacheState != null) {
        if (Object.keys(cacheState).length > 0) {
            let arr = [];
            result_arr = [];
            Object.keys(cacheState).forEach(function(key){
                arr.push(key);
            });            
            for (let i = 0; i < arr.length; i ++) {
                let presData = cacheState[arr[i]][0].presData; 
                presData.map(item=>{
                    result_arr.push(item);
                })

            }
        }
        
    }

    // ------------- mediines contraindication for double prescriptio end-----------//

    result_arr.forEach(rece => {      
      rece.medicines.forEach(medicine => {
        status = this.getAlertReject(medicine, selected_medicine);
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
    

    result_arr.forEach(order => {      
      order.medicines.forEach(item => {
        status = this.getAlertReject(selected_medicine, item);
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
  
// function get_alert_reject(s_item, d_item) {
//     if(s_item.tagret_contraindication == undefined || s_item.tagret_contraindication == null ) return 0;
//     if(d_item.yj_code == undefined || d_item.yj_code == null ) return 0;
//     if(s_item.tagret_contraindication.length == 0 ) return 0;
//     let ret = 0;
//     for (let item of s_item.tagret_contraindication) {
//       if(item.target_yj_code_head_9 == d_item.yj_code.substring(0,9)) {
//         ret =ret | ((item.interaction_category<=1) ? 2 : 1);
//       }
//     }
//     return ret;
// }