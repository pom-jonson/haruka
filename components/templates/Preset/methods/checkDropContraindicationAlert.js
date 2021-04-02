export default function(selected_medicine) {
    // let medicineId = selected_medicine.item_number;
    let arr_alert = [];
    let arr_ret = [];
    let status = 0;
    // this.state.presData.map(rece => {
    //   rece.medicines.map(medicine => {                  
    //       if(medicine.contraindication_alert){
    //         if(medicine.contraindication_alert.includes(medicineId.toString())){
    //           if(!arr_alert.includes(medicine.medicineId)){
    //               arr_alert.push(medicine.medicineId);
    //               arr_ret.push(medicine);
    //           }
    //         }
    //       }
    //   });
    // }); 

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
    
    // this.state.presData.map(function(order) {
    //   order.medicines.map(function(item) {        
    //     if (selected_medicine.contraindication_alert !== undefined) {
    //       if(selected_medicine.contraindication_alert.includes(item.medicineId.toString())){
    //         if(!arr_alert.includes(item.medicineId)){
    //           arr_alert.push(item.medicineId);
    //           arr_ret.push(item);
    //         }
    //       }
    //     }
    //   });
    // }); 
    return arr_ret;
  }
  