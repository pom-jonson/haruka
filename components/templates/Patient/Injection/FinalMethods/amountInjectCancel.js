export default function() {
  let originalNumber = JSON.parse(JSON.stringify(this.state.injectData));
  if (this.amountCancelFromMenu == "amount_cancel_from_menu") {
    this.amountCancelFromMenu = "";
    return;
  }


  let order_pos = -1;
  let med_pos = -1;
  if (this.state.indexOfInsertPres == -1 || this.state.indexOfInsertMed == -1) {
    order_pos = originalNumber.length - 1;    
    // med_pos = 0;
  } else {    
    order_pos = this.state.indexOfInsertPres;
    // med_pos = this.state.indexOfInsertMed > 0 ? this.state.indexOfInsertMed : 0;
    med_pos = this.state.indexOfInsertMed;
  }


  // if (this.state.isForUpdate === false) {
    if (order_pos != -1 && originalNumber[order_pos].medicines.length >= 2) {
      if (med_pos != -1) {
        originalNumber[order_pos].medicines[med_pos] = this.getEmptyInject();        
      } else {        
        originalNumber[order_pos].medicines.pop();
        originalNumber[order_pos].medicines.push(
          this.getEmptyInject()
        );
      }
    } else {
      let _usage = originalNumber[originalNumber.length - 1].usage;
      let _usageName = originalNumber[originalNumber.length - 1].usageName;
      originalNumber.pop();
      let _getEmptyInjection = this.getEmptyInjection();
      if (_usage != "" || _usageName != "") {        
        _getEmptyInjection.usage = _usage;
        _getEmptyInjection.usageName = _usageName;
      }
      originalNumber[originalNumber.length] = _getEmptyInjection;
    }   

    // ■1211-3 処方薬品登録
    /*if (this.modal_obj.med_diagnosis_ok == true) {
      originalNumber[this.state.indexOfInsertPres].medicines.splice(
        [this.state.indexOfInsertMed],
        1
      );
    }
    this.modal_obj.med_diagnosis_ok  = null;*/

    let data = {};
    data['injectData'] = originalNumber;
    this.storeInjectionDataInCache(data);
    // this.setState({ injectData: originalNumber }, function() {
    //   this.storeInjectionDataInCache();
    // });
  // }

  // this.setState({
  //   isAmountOpen: false,
  //   showedPresData: {
  //     medicineName: ""
  //   },
  // });
}
