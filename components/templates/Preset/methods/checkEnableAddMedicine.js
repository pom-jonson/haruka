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
      this.setState({hideDuplicateModal: false});   
      this.setState({modalType: "Duplicate"}); 
      this.setState({showMedicineContent: "既に存在しますが追加しますか？"});      
    }
      return true;
  }
  