
export default function(indexOfEditPres) {
  this.modal_obj.usageOpen = true;
  this.modal_obj.usageModal = true;
  this.modal_obj.amountTyped = false;
  this.modal_obj.indexOfEditPres = indexOfEditPres;
  
  let presData = this.state.presData;
  let index =
    this.modal_obj.indexOfEditPres == -1
      ? presData.length - 1
      : this.modal_obj.indexOfEditPres;

  // 保存 last presData order for usage
  // this.modal_obj.lastOrderData = presData[index]; 
  // 用法を変更して区分エラーになった場合 
  window.localStorage.setItem("last_order_pres_data", JSON.stringify(presData[index]));

  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

  // this.setState({
  //   amountTyped: false,
  //   usageOpen: true,
  //   usageModal: true,
  //   indexOfEditPres: indexOfEditPres
  // });
}
