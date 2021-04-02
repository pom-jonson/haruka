export default function(name, value, isGroup) {
  let data ={"is_reload_state": false};
  if (name === "unusedDrugSearch") {
    this.setState({ unusedDrugSearch: value }, function() {
      this.storeInjectionDataInCache(data);
    });
  } else if (name === "profesSearch") {
    this.setState({ profesSearch: value }, function() {
      this.storeInjectionDataInCache(data);
    });
  } else if (name === "normalNameSearch") {
    this.setState({ normalNameSearch: value }, function() {
      this.storeInjectionDataInCache(data);
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

    let data = {};
    data['injectData'] = original;
    this.storeInjectionDataInCache(data);

    // this.setState(
    //   {
    //     injectData: original,
    //   },
    //   function() {
    //     this.storeInjectionDataInCache();
    //   }
    // );
  }
}
