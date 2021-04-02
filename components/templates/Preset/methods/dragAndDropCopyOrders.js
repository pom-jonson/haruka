export default async function(number, is_preset = false) {
  let prescription = undefined;
  if (is_preset) {
    this.state.medicineSetData.map(item => {
      if (item.preset_number === parseInt(number)) {
        prescription = item;
      }
    })
  } else {
    this.state.medicineHistory.map(medicine => {
      if (medicine.number === parseInt(number)) {
        prescription = medicine;
      }
    });

    // SOAP画面からDrag&Drop時、実行
    if(prescription == undefined && this.state.medicineSoap != undefined) {
      Object.keys(this.state.medicineSoap).map(medicine => {
        if (parseInt(medicine) === parseInt(number)) {          
          prescription = this.state.medicineSoap[medicine];
        }
      });
    }        
  }
  if (prescription !== undefined) {
    if(is_preset) {
      this.copyOrders(prescription);
      return true;
    } else {
      let checkDisease = await this.checkDiseasePrescription(prescription);
      if (!checkDisease) {            
        if (!this.checkPeriodMedicine(prescription, false)) {
          this.copyOrders(prescription);
          return true;
        }
      }
    }
  }
  return false;
}