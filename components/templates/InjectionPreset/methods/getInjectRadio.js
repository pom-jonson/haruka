export default function(name, value, isGroup) {
  if (name === "unusedDrugSearch") {
    this.setState({ unusedDrugSearch: value }, function() {
      this.storeInjectionDataInCache();
    });
  } else if (name === "profesSearch") {
    this.setState({ profesSearch: value }, function() {
      this.storeInjectionDataInCache();
    });
  } else if (name === "normalNameSearch") {
    this.setState({ normalNameSearch: value }, function() {
      this.storeInjectionDataInCache();
    });
  } else if (name !== "notConsentedDataSelect") {
    const original = this.state.injectData;

    original.map((data, i) => {
      if (isGroup) {
        original[i][name] = value;
      } else {
        data.medicines.map((medicine, j) => {
          original[i].medicines[j][name] = value;
        });
      }
    });

    this.setState(
      {
        injectData: original,
      },
      function() {
        this.storeInjectionDataInCache();
      }
    );
  }
}
