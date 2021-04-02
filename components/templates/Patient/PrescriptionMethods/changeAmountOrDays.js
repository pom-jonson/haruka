import { CACHE_LOCALNAMES } from "~/helpers/constants";

export default function(isAmount, indexPres, indexMed) {

  window.localStorage.removeItem(CACHE_LOCALNAMES.CALC );
  this.modal_obj.isAmountOpen = isAmount;
  // for indexOfInsertPres state in prescription.js's shouldComponentUpdate
  this.modal_obj.getHistoryEnd = -1;
  this.modal_obj.isDaysOpen = !isAmount;
  this.modal_obj.usageOpen = false;
  this.modal_obj.daysInitial = isAmount ? this.state.presData[indexPres].medicines[indexMed].amount : this.state.presData[indexPres].days;
  this.modal_obj.daysLabel = isAmount ? "" : this.state.presData[indexPres].usageName;
  this.modal_obj.daysSuffix = isAmount ? "" : (this.state.presData[indexPres].days_suffix === "" ? "日分" : this.state.presData[indexPres].days_suffix);
  this.modal_obj.showedPresData = {
    medicineName: isAmount
      ? this.state.presData[indexPres].medicines[indexMed].medicineName
      : "",
    usage: isAmount
      ? this.state.presData[indexPres].medicines[indexMed]
      : undefined
  };

  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

  this.setState({
    // isAmountOpen: isAmount,
    // isDaysOpen: !isAmount,
    // usageOpen: false,
    // daysInitial: isAmount ? this.state.presData[indexPres].medicines[indexMed].amount : this.state.presData[indexPres].days,
    // daysLabel: isAmount ? "" : this.state.presData[indexPres].usageName,
    // daysSuffix: isAmount ? "" : (this.state.presData[indexPres].days_suffix === "" ? "日分" : this.state.presData[indexPres].days_suffix),
    changeNumber: {
      indexPres: indexPres,
      indexMed: indexMed
    },
    indexOfInsertPres: indexPres,
    indexOfInsertMed: indexMed,
    // showedPresData: {
    //   medicineName: isAmount
    //     ? this.state.presData[indexPres].medicines[indexMed].medicineName
    //     : "",
    //   usage: isAmount
    //     ? this.state.presData[indexPres].medicines[indexMed]
    //     : undefined
    // }
  });
}
