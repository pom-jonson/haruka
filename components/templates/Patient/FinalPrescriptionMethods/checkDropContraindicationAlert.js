export default function(selected_medicine) {
    let arr_alert = [];
    let arr_ret = [];
    let status = 0;
    this.state.presData.forEach(rece => {
      rece.medicines.forEach(medicine => {                  
        status = this.getAlertReject(medicine, selected_medicine);
        if( (status & 1) > 0) {
          if(!arr_alert.includes(medicine.medicineId)){
            arr_alert.push(medicine.medicineId);
            arr_ret.push(medicine);
          }
        }
        status = this.getAlertReject(selected_medicine, medicine);
        if( (status & 1) > 0) {
          if(!arr_alert.includes(medicine.medicineId)){
            arr_alert.push(medicine.medicineId);
            arr_ret.push(medicine);
          }
        }          
      });
    });
    return arr_ret;
  }
  