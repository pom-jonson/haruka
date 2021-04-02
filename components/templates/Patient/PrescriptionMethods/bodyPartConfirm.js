export default function(value) {
    let originalNumber = this.state.presData;
  
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

    // this.setState({
    //     indexOfEditPres: -1,
    // },
    // function() {
    //   this.storeDataInCache(data);

    //   this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    // }
    // );
}
  