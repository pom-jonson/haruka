export default function(number) {
  let prescription = undefined;  
  this.state.medicineHistory.map(medicine => {
    if (medicine.number === parseInt(number)) {
      prescription = medicine;
    }
  });
  
  if (prescription !== undefined) {    
    if (prescription.order_data != null && prescription.order_data != undefined) {
      if (prescription.order_data.item_details != null && prescription.order_data.item_details != undefined && prescription.order_data.item_details.length > 0) {
        let item_details_array = this.state.item_details;
        let blank_insert = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
        prescription.order_data.item_details.map(item=>{          
          item_details_array.push(item);          
        });
        item_details_array = item_details_array.filter(x=>x.item_id !== 0);
        item_details_array.push(blank_insert);
        this.modal_obj.item_details = item_details_array;
        if (this.prescriptionNameRef.current != undefined && this.prescriptionNameRef.current != null) {      
          this.prescriptionNameRef.current.testPrescriptionNameRender({item_details:item_details_array});
        }
        let storeData ={"is_reload_state": false};
        this.storeDataInCache(storeData);
        // 品名 open flag
        this.m_show_detail_flag = 1;
        this.showItemDetailArea(1);
        // this.setState({
        //   item_details: item_details_array
        // }, ()=>{
        //   console.log("03");    
        //   this.storeDataInCache();
        //   // 品名 open flag
        //   this.m_show_detail_flag = 1;
        //   this.showItemDetailArea(1);
        // });
      }
    }
  }
  return false;
}