export default async function(number, is_preset = false) {

  let injection = undefined;
  if (is_preset) {
    this.state.injectionSetData.map(item => {
      if (item.preset_number === parseInt(number)) {
        injection = item;
      }
    })
  } else {
    this.state.injectionHistory.map(medicine => {
      if (medicine.number === parseInt(number)) {
        injection = medicine;
      }
    });

    // SOAP画面からDrag&Drop時、実行
    if(injection == undefined && this.state.medicineSoap != undefined) {
      Object.keys(this.state.medicineSoap).map(medicine => {
        if (parseInt(medicine) === parseInt(number)) {          
          injection = this.state.medicineSoap[medicine];
        }
      });
    } 
  }
  
  if (injection !== undefined) {
    // if(is_preset) {
    //   this.copyOrders(prescription);
    //   return true;
    // } else {
      let checkDisease = await this.checkDiseaseInjection(injection, false);
      if (!checkDisease){      
          if (!this.checkPeriodMedicineInjection(injection, false)) {
              this.copyInjectionOrders(injection);
              return true;
          }
      }
    // }    
  }
  return false;
}
