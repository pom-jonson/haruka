export default function(value) {
    let originalNumber = this.state.presData;
    window.localStorage.removeItem("prescription_current_usage_cache");
    originalNumber[this.modal_obj.indexOfEditPres].body_part = value;
  
    // this.setState({
    //     isBodyPartOpen: false,
    //     indexOfEditPres: -1,
    //     presData: originalNumber
    // },
    // function() {
    //   this.storeDataInCache();
    // }
    // );
    this.modal_obj.isBodyPartOpen = false;
    this.modal_obj.indexOfEditPres = -1;
    let data = {};
    data['presData'] = originalNumber;
    this.storeDataInCache(data);

    this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

    // check 用法の区分と異なる薬剤が登録されているRpがあります
    //YS4 部位指定がある用法で区分エラーが部位指定と同時に出る(09/06)
    if (this.modal_obj.after_bodyPart_diagnosisOrderModal == true) {
        this.modal_obj.diagnosisOrderModal = true;
    }
    // this.setState({
    //     indexOfEditPres: -1,
    // },
    // function() {
    //   this.storeDataInCache(data);

    //   this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    // }
    // );
}
  