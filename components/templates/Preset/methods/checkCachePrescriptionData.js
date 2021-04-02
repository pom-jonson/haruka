import { Karte_Steps } from "~/helpers/constants";
export default function(presData, type) {
  let validationPassed = true;
  let strMessage = "";
  // let lastPresIndex = this.state.presData.length - 1;
  // let lastMedIndex = this.state.presData[lastPresIndex].medicines.length - 1;
  //薬品
  // 数量がない
  // this.state.presData.map((item, presIndex) => {
  //   item.medicines.map((medicine, medIndex) => {
  //     if (presIndex === lastPresIndex && medIndex === lastMedIndex) {
  //       return;
  //     }
  //     if (medicine.medicineName === "") {
  //       validationPassed = false;
  //     }
  //   });
  // });
  // if (validationPassed === false) {
  //   alert("薬品を入力して下さい。");
  //   return false;
  // }

  // 数量がない
  presData.map(item => {
    item.medicines.map(medicine => {
      if (
        medicine.medicineName !== "" &&
        (medicine.amount === 0 || medicine.amount === undefined)
      ) {
        validationPassed = false;
      }
    });
  });

  if (validationPassed === false) {
    strMessage = "薬品の数量を入力して下さい。";
    this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
    return false;
  }

// 数量がない
  let selMedicines = [];
  let medList = "";
  presData.map(item => {
    item.medicines.map(medicine => {
      if(medicine.period_permission !== undefined && medicine.period_permission < 0) {
        validationPassed = false;
        if(!selMedicines.includes(medicine.medicineId)) {
          selMedicines.push(medicine.medicineId);
          medList += "◆" + medicine.medicineName + "\n";
          if(medicine.gene_name) {
            medList += "(" + medicine.gene_name + ")\n";
          }
        }
      }
    });
  });

  if (validationPassed === false) {
    strMessage = "有効期間外の薬品があります。処方前に削除または別の製品に変更してください。\n" + medList;
    this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
    return false;
  }

  // 用法がない
  presData.map(item => {
    if (
      item.medicines.length >= 1 &&
      item.medicines[0].medicineName !== "" &&
      item.usageName === ""
    ) {
      validationPassed = false;
    }
  });

  if (validationPassed === false) {
    strMessage = "用法方法を入力して下さい。";
    this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
    return false;
  }

  // 日数がない
  presData.map(item => {
    if (item.usage_replace_number === undefined) {
      if (
        item.usageName !== "" &&
        item.days === 0
      ) {
        if (item.usageIndex !== 6 && item.enable_days === 1) {
          validationPassed = false;
        }
      }
    } else {
      if (
        item.usageName !== "" &&
        (item.days === 0 &&
          item.usage_replace_number.length === 0)
      ) {
        if (item.usageIndex !== 6 && item.enable_days === 1) {
          validationPassed = false;
        }
      }
    }
    
  });

  if (validationPassed === false) {
    strMessage = "用法の日数を入力して下さい。";
    this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
    return false;
  }

  return validationPassed;
}
