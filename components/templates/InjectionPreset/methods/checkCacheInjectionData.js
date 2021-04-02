import { Karte_Steps } from "~/helpers/constants";
export default function(presData, type) {
  let validationPassed = true;
  let strMessage = "";

  // 数量がない
  presData.map(item => {
    item.medicines.map(medicine => {
      if (
        medicine.medicineName !== "" &&
        (medicine.amount === undefined)
      ) {
        validationPassed = false;
      }
    });
  });

  if (validationPassed === false) {
    strMessage = "注射の数量を入力して下さい。";
    this.addMessageSendKarte(Karte_Steps.Injection, type, strMessage, 1);
    return false;
  }

  presData.map(item => {
    if (
      item.medicines.length >= 1 &&
      item.medicines[0].medicineName !== "" &&
      (item.usageName === "" || item.usageName === undefined)
    ) {
      validationPassed = false;
    }
  });

  if (validationPassed === false) {
    strMessage = "手技方法を入力して下さい。";
    this.addMessageSendKarte(Karte_Steps.Injection, type, strMessage, 1);
    return false;
  }

  return validationPassed;
}
