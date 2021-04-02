import { CACHE_LOCALNAMES } from "~/helpers/constants";
export default function(isAmount, indexPres, indexMed) {
  window.localStorage.removeItem(CACHE_LOCALNAMES.CALC );

  this.amountCancelFromMenu = "amount_cancel_from_menu";
  this.modal_obj.isAmountOpen = isAmount;
  this.modal_obj.getHistoryEnd = -1;
  this.modal_obj.isDaysOpen = !isAmount;
  this.modal_obj.usageOpen = false;
  this.modal_obj.daysInitial = isAmount ? this.state.injectData[indexPres].medicines[indexMed].amount : this.state.injectData[indexPres].days;
  this.modal_obj.daysLabel = isAmount ? "" : this.state.injectData[indexPres].usageName;
  this.modal_obj.daysSuffix = isAmount ? "" : (this.state.injectData[indexPres].days_suffix === "" ? "日分" : this.state.injectData[indexPres].days_suffix);
  this.modal_obj.showedPresData = {
    medicineName: isAmount
      ? this.state.injectData[indexPres].medicines[indexMed].medicineName
      : "",
    usage: isAmount
      ? this.state.injectData[indexPres].medicines[indexMed]
      : undefined
  };

  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

  // 08/28 change amount refresh option
  this.modal_obj.change_amount_option = 1;
  this.modal_obj.indexOfInsertPres = indexPres;
  this.modal_obj.indexOfInsertMed = indexMed;

  this.setState({
    // isAmountOpen: isAmount,
    // isDaysOpen: !isAmount,
    // usageOpen: false,
    // daysInitial: isAmount ? this.state.injectData[indexPres].medicines[indexMed].amount : this.state.injectData[indexPres].days,
    // daysLabel: isAmount ? "" : this.state.injectData[indexPres].usageName,
    // daysSuffix: isAmount ? "" : (this.state.injectData[indexPres].days_suffix === "" ? "日分" : this.state.injectData[indexPres].days_suffix),
    changeNumber: {
      indexPres: indexPres,
      indexMed: indexMed
    },
    indexOfInsertPres: indexPres,
    indexOfInsertMed: indexMed,
    // showedPresData: {
    //   medicineName: isAmount
    //     ? this.state.injectData[indexPres].medicines[indexMed].medicineName
    //     : "",
    //   usage: isAmount
    //     ? this.state.injectData[indexPres].medicines[indexMed]
    //     : undefined
    // }
  });
}
