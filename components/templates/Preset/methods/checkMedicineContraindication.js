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

    this.state.presData.forEach(rece => {      
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

    // this.state.presData.map(rece => {
    //   rece.medicines.map(medicine => {    
    //       if(medicine.contraindication_alert){
    //         if(medicine.contraindication_alert.includes(medicineId.toString())){
    //             alert = 1;
    //             if(!arr_alert.includes(medicine.medicineId)){
    //                 arr_alert.push(medicine.medicineId);
    //             }
    //             // alert_medicines = alert_medicines + "・" + medicine.medicineName ;
    //         }
    //       }
    //       if(medicine.contraindication_reject){
    //         if(medicine.contraindication_reject.includes(medicineId.toString())){
    //             reject = 1;
    //             if(!arr_reject.includes(medicine.medicineId)){
    //                 arr_reject.push(medicine.medicineId);
    //             }
    //             // reject_medicines = reject_medicines + "・" + medicine.medicineName;
    //         }
    //       }
    //   });
    // }); 

    this.state.presData.forEach(order => {      
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

    // this.state.presData.map(function(order) {
    //   order.medicines.map(function(item) {
    //     if (selected_medicine.contraindication_alert !== undefined) {
    //       if(selected_medicine.contraindication_alert.includes(item.medicineId.toString())){
    //         alert = 1;
    //         if(!arr_alert.includes(item.medicineId)){
    //           arr_alert.push(item.medicineId);
    //         }
    //       }
    //     }
    //     if (selected_medicine.contraindication_reject !== undefined) {
    //       if(selected_medicine.contraindication_reject.includes(item.medicineId.toString())){
    //         reject = 1;
    //         if(!arr_reject.includes(item.medicineId)){
    //           arr_reject.push(item.medicineId);
    //         }
    //       }
    //     }
    //   });
    // }); 
    this.state.presData.map(function(order) {
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
      this.setState({showMedicineOrigin: reject_medicines});
      return 2;
    }
    
    if(alert == 1){
      this.setState({showMedicineOrigin: alert_medicines});
      return 1;
    }    

    return 0;
  }
  