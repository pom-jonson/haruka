import { Karte_Steps } from "~/helpers/constants";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
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
        this.addMessageSendKarte(Karte_Steps.Injection, type, strMessage, 1);
        return false;
    }


    // 用法がない
  // presData.map(item => {
  //   if (
  //     item.medicines.length >= 1 &&
  //     item.medicines[0].medicineName !== "" &&
  //     (item.usageName === "" || item.usageName === undefined)
  //   ) {
  //     validationPassed = false;
  //   }
  // });
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
    // alert("手技方法を入力して下さい。");
    // return false;
  }

  // 日数がない
  // presData.map(item => {
  //   if (item.usage_replace_number === undefined) {
  //     if (
  //       item.usageName !== "" &&
  //       item.days === 0
  //     ) {
  //         validationPassed = false;
  //     }
  //   } else {
  //     if (
  //       item.usageName !== "" &&
  //       (item.days === 0 &&
  //         item.usage_replace_number.length === 0)
  //     ) {
  //         validationPassed = false;
  //     }
  //   }
    
  // });

  // if (validationPassed === false) {
  //   alert("手技の日数を入力して下さい。");
  //   return false;
  // }

  // 用法 is_enabled  
  presData.map(item => {
    if (hasUnenabledUsage(item.usage) == true) {
      validationPassed = false;
    }    
    
  });

  if (validationPassed === false) {
    strMessage = "使使用できない手技が選択されています。登録する場合は手技を変更してください";
    this.addMessageSendKarte(Karte_Steps.Injection, type, strMessage, 1);
    return false;
  }

  return validationPassed;
}

function hasUnenabledUsage(usage_number){   
  // let usageData = JSON.parse(window.localStorage.getItem("haruka_cache_usageInjectData"));  
  let usageData = {};
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  if (init_status != null && init_status != undefined && init_status.injection_usage != undefined && init_status.injection_usage != null) {
    usageData = init_status.injection_usage;    
  }
  // let usageNumberArray = [];
  if (usage_number == null || usage_number == undefined) {
    return false;
  }
  
  let nHasUnenabledUsage = 0;
  if (usageData != null && usageData != undefined && usageData.length > 0) {
    usageData.map(ele=>{
      if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
        nHasUnenabledUsage = 1;
      }
    });
    if (nHasUnenabledUsage == 1) {
      return true;
    }
  }    
  return false;
}
