export default function(medicineId, needConfirm) {
    let flag = true;
    this.state.presData.map(rece => {
      rece.medicines.map(medicine => {
        if (flag && medicine.medicineId === medicineId) {
          flag = false;
        }
      });
    });
    if (!flag && needConfirm) {
      this.modal_obj.hideDuplicateModal = false;
      this.modal_obj.modalType = "Duplicate";
      this.modal_obj.showMedicineContent = "既に存在しますが追加しますか？";

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      // this.setState({hideDuplicateModal: false});   
      // this.setState({modalType: "Duplicate"}); 
      // this.setState({showMedicineContent: "既に存在しますが追加しますか？"});      
    }
      return true;
  }
  