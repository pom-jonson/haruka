export default function() {
  let originalNumber = this.state.injectData;

  if (this.state.isForUpdate === false) {
    if (originalNumber[originalNumber.length - 1].medicines.length >= 2) {
      originalNumber[originalNumber.length - 1].medicines.pop();
      originalNumber[originalNumber.length - 1].medicines.push(
        this.getEmptyInject()
      );
    } else {
      originalNumber.pop();
      originalNumber[originalNumber.length] = this.getEmptyInjection();
    }

    this.setState({ injectData: originalNumber }, function() {
      this.storeInjectionDataInCache();
    });
  }

  this.setState({
    isAmountOpen: false,
    showedPresData: {
      medicineName: ""
    },
  });
}
