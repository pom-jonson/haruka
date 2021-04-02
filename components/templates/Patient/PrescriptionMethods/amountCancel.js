export default function() {
  let originalNumber = this.state.presData;

  if (this.state.isForUpdate === false) {
    if (originalNumber[originalNumber.length - 1].medicines.length >= 2) {
      originalNumber[originalNumber.length - 1].medicines.pop();
      originalNumber[originalNumber.length - 1].medicines.push(
        this.getEmptyMedicine()
      );
    } else {
      originalNumber.pop();
      originalNumber[originalNumber.length] = this.getEmptyPrescription();
    }

    // this.setState({ presData: originalNumber }, function() {
    //   this.storeDataInCache();
    // });
    let data = {};
    data['presData'] = originalNumber;
    this.storeDataInCache(data);
  }

  // this.setState({
  //   isAmountOpen: false,
  //   showedPresData: {
  //     medicineName: ""
  //   },
  //   insertStep: 0
  // });  
}
