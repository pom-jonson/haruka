export default function(isAmount, indexPres, indexMed) {
  window.localStorage.removeItem("haruka_calc_formula");
  this.setState({
    isAmountOpen: isAmount,
    isDaysOpen: !isAmount,
    usageOpen: false,
    daysInitial: isAmount ? this.state.injectData[indexPres].medicines[indexMed].amount : this.state.injectData[indexPres].days,
    daysLabel: isAmount ? "" : this.state.injectData[indexPres].usageName,
    daysSuffix: isAmount ? "" : (this.state.injectData[indexPres].days_suffix === "" ? "日分" : this.state.injectData[indexPres].days_suffix),
    changeNumber: {
      indexPres: indexPres,
      indexMed: indexMed
    },
    indexOfInsertPres: indexPres,
    indexOfInsertMed: indexMed,
    showedPresData: {
      medicineName: isAmount
        ? this.state.injectData[indexPres].medicines[indexMed].medicineName
        : "",
      usage: isAmount
        ? this.state.injectData[indexPres].medicines[indexMed]
        : undefined
    }
  });
}
