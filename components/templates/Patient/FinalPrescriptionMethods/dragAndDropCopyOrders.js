export default async function(number, is_preset = false, from=null) {
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
    // YS132 単位がなくなっている場合の対策
    // 「主単位以外の単位が登録されていて、該当薬剤の単位の候補に存在しない単位名」の薬剤がある場合は、下記のようにアラートを出して、そのRPを追加しないようにしてください。
    if(this.checkHasNoUnitPrescription(prescription) == false){
      return;
    }
    if(is_preset) {
      await this.copyOrders(prescription);
      return true;
    } else {
      let checkDisease = await this.checkDiseasePrescription(prescription);
      if (!checkDisease) {
        if (!this.checkPeriodMedicine(prescription, false)) {
          await this.copyOrders(prescription, from);
          return true;
        }
      }
    }
  }
  return false;
}