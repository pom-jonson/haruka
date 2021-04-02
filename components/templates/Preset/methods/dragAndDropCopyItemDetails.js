export default function(number) {
  let prescription = undefined;  
  this.state.medicineHistory.map(medicine => {
    if (medicine.number === parseInt(number)) {
      prescription = medicine;
    }
  });
  
  if (prescription !== undefined) {    
    // if (!this.checkDiseasePrescription(prescription)) {
    //   if (!this.checkPeriodMedicine(prescription, false)) {
    //     this.copyOrders(prescription);
    //     return true;
    //   }
    // }    
    if (prescription.order_data != null && prescription.order_data != undefined) {
      if (prescription.order_data.item_details != null && prescription.order_data.item_details != undefined && prescription.order_data.item_details.length > 0) {
        let item_details_array = this.state.item_details;
        // prescription.order_data.item_details.map(item=>{
        //   let isExist = false;
        //   item_details.map(ele=>{
        //     if (item.item_name == ele.item_name) {
        //       console.log("****************");
        //       isExist = true;
        //     }
        //   });
        //   if (!isExist) {
        //     item_details_array.push(item);
        //   }
        // });
        prescription.order_data.item_details.map(item=>{          
          item_details_array.push(item);          
        });
        this.setState({
          item_details: item_details_array
        }, ()=>{
          this.storeDataInCache();
          // 品名 open flag
          this.m_show_detail_flag = 1;
          this.showItemDetailArea(1);
        });
      }
    }
  }
  return false;
}