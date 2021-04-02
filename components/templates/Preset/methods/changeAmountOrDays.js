import { CACHE_LOCALNAMES } from "~/helpers/constants";

export default function(isAmount, indexPres, indexMed) {

  window.localStorage.removeItem(CACHE_LOCALNAMES.CALC );
  this.setState({
    isAmountOpen: isAmount,
    isDaysOpen: !isAmount,
    usageOpen: false,
    daysInitial: isAmount ? this.state.presData[indexPres].medicines[indexMed].amount : this.state.presData[indexPres].days,
    daysLabel: isAmount ? "" : this.state.presData[indexPres].usageName,
    daysSuffix: isAmount ? "" : (this.state.presData[indexPres].days_suffix === "" ? "日分" : this.state.presData[indexPres].days_suffix),
    changeNumber: {
      indexPres: indexPres,
      indexMed: indexMed
    },
    indexOfInsertPres: indexPres,
    indexOfInsertMed: indexMed,
    showedPresData: {
      medicineName: isAmount
        ? this.state.presData[indexPres].medicines[indexMed].medicineName
        : "",
      usage: isAmount
        ? this.state.presData[indexPres].medicines[indexMed]
        : undefined
    }
  });
}
