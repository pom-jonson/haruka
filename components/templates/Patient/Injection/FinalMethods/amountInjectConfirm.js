
export default async function(
  number,
  unit,
  splitNumbers,
  usageName,
  usageComment,
  item
) {
  //量を入力時
  let originalNumber = this.state.injectData;
  // right menu from prescribetable's 数量の変更
  this.amountCancelFromMenu = "";

  const { changeNumber } = this.state;
  if (changeNumber.indexPres != -1) {
    originalNumber[changeNumber.indexPres].medicines[
      changeNumber.indexMed
    ].amount = number;

    originalNumber[changeNumber.indexPres].medicines[
      changeNumber.indexMed
    ].unit = unit;

    var partUssageFlag = true;
    if (item.usageName === "" || item.days === null) {
      partUssageFlag = false;
    }

    if (partUssageFlag === false && splitNumbers.length > 0) {
      originalNumber[changeNumber.indexPres].medicines[
        changeNumber.indexMed
      ].uneven_values = splitNumbers;
    } else {
      originalNumber[changeNumber.indexPres].medicines[
        changeNumber.indexMed
      ].uneven_values = [];
    }

  } else {
    var usage_remarks_comment = usageComment == "" ? "" : usageComment + "  ";

    if (usage_remarks_comment !== "") usage_remarks_comment += unit;
    var pres, index;
    if (this.state.indexOfInsertPres != -1) {
      pres = originalNumber[this.state.indexOfInsertPres];
      index = this.state.indexOfInsertMed;
      pres.medicines[index].can_generic_name = this.modal_obj.bulk.can_generic_name;
      pres.medicines[index].is_not_generic = this.modal_obj.bulk.is_not_generic;
      pres.medicines[index].milling = this.modal_obj.bulk.milling;
    } else if (this.state.indexOfEditPres != -1) {

      pres = originalNumber[this.modal_obj.indexOfEditPres];
      index = pres.medicines.length - 1;
    } else {

      pres = originalNumber[this.state.calcNum];
      index = pres.medicines.length - 1;
    }
    pres.medicines[index].unit = unit;

    if (this.modal_obj.indexOfEditPres == -1) {
      pres.medicines[index].amount = number;
      pres.medicines[index].unit = unit;
    }

    partUssageFlag = true;
    // let otherPartUssageFlag = true;
    if (item.usageName === "" || item.days === null) {
      partUssageFlag = false;
    }

    if (this.state.indexOfInsertPres !== -1) {
      partUssageFlag = false;
    }

    if (partUssageFlag === false && splitNumbers.length > 0) {
      pres.medicines[index].uneven_values = splitNumbers;
      pres.medicines[index].amount = number;
      pres.medicines[index].unit = unit;
    } else {
      pres.medicines[index].uneven_values = [];
    }

    if (partUssageFlag) {
      pres.medicines[index].poultice_times_one_day =
        item.poultice_times_one_day;
      pres.medicines[index].usage_optional_num = item.usage_optional_num;
    }
// console.log("0000000000000")
//     console.log("partUssageFlag")
//     console.log(partUssageFlag)
    if (partUssageFlag) {
     /* pres.body_part = item.usageComment;
      pres.days = splitNumbers.length;
      pres.usageName = usageName;

      if (partUssageFlag) {
        pres.usageName = item.usageName;
        pres.days = item.days;
        pres.body_part = item.usageComment;
        pres.usageName = pres.usageName
          .replace("ＸＸ", item.poultice_times_one_day)
          .replace("ＸＸ", item.usage_optional_num);
        pres.usage = item.usageIndex;
      }*/
      originalNumber[originalNumber.length] = this.getEmptyInjection();      
      pres.medicines.push(this.getEmptyInject());

    } else {
      // console.log("11111111111111111")
      if (this.state.indexOfInsertPres == -1) {
        // console.log("22222222222222222222222")
        // console.log("pres.medicines")
        // console.log(pres.medicines)
        pres.medicines.push(this.getEmptyInject());
        originalNumber[originalNumber.length] = this.getEmptyInjection();
      } else {
        if (originalNumber[this.state.indexOfInsertPres] != undefined && 
          originalNumber[this.state.indexOfInsertPres]['medicines'] != undefined && 
          (originalNumber[this.state.indexOfInsertPres]['medicines'].length - 1) == this.state.indexOfInsertMed) {
          pres.medicines.push(this.getEmptyInject());
        }

        if (this.state.indexOfInsertPres == (originalNumber.length - 1)) {
          originalNumber[originalNumber.length] = this.getEmptyInjection();
        }
      }
    }
  }

  window.localStorage.setItem("inject_keyword", "");
  for (var key in window.localStorage) {
    if (key.includes("inject_keyword_")) {
      window.localStorage.removeItem(key);
    }
  }

  window.sessionStorage.setItem("prescribe-auto-focus", 1);

  this.modal_obj.isAmountOpen = false;
  this.modal_obj.showedPresData = {
    medicineName: ""
  };
  this.modal_obj.amountTyped = true;


  let data = {"is_reload_state": false};
  data['injectData'] = originalNumber;

  // prevent page refresh
  this.modal_obj.amount_confirm_option = 1;

  this.setState(
    {
      // injectData: originalNumber,
      // isAmountOpen: false,
      // amountTyped: true,
      changeNumber: {
        indexPres: -1,
        indexMed: -1
      },
      keyword: "",
      // showedPresData: {
      //   medicineName: ""
      // }
    },
    function() {
      this.storeInjectionDataInCache(data);
      this.prescribeTableRef.current.testRender(originalNumber);

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );


  
}
