export default async function(number, is_preset = false, from=null) {
  
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
    // YS132 単位がなくなっている場合の対策
    // 「主単位以外の単位が登録されていて、該当薬剤の単位の候補に存在しない単位名」の薬剤がある場合は、下記のようにアラートを出して、そのRPを追加しないようにしてください。
    if (this.checkHasNoUnitInjectionPrescription(injection) == false) {
      return;
    }
    let checkDisease = await this.checkDiseaseInjection(injection, false);
    if (!checkDisease){
      if (!this.checkPeriodMedicineInjection(injection, false)) {
        await this.copyInjectionOrders(injection, from);
        return true;
      }
    }
  }
  return false;
}
