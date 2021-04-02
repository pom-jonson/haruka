import * as apiClient from "~/api/apiClient";
import {
  getAge
} from "~/helpers/date";

export default async function(
  number,
  unit,
  splitNumbers,
  usageName,
  usageComment,
  item
) {
  //量を入力時
  let originalNumber = this.state.presData;

  const {
    changeNumber
  } = this.state;

  let usageId = "";
  let medCode = -1;
  let medName = "";
  let medRpIdx = -1;
  let medRpOrderIdx = -1;
  let medicine = [];
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

    usageId = originalNumber[changeNumber.indexPres].usage;
    medCode = originalNumber[changeNumber.indexPres].medicines[changeNumber.indexMed].medicineId;
    medName = originalNumber[changeNumber.indexPres].medicines[changeNumber.indexMed].medicineName;
    medRpIdx = changeNumber.indexPres;
    medRpOrderIdx = changeNumber.indexMed;
    medicine = originalNumber[changeNumber.indexPres].medicines[changeNumber.indexMed];
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
      medRpIdx = this.state.indexOfInsertPres;
      medRpOrderIdx = index;
    } else if (this.modal_obj.indexOfEditPres != -1) {
      pres = originalNumber[this.modal_obj.indexOfEditPres];
      index = pres.medicines.length - 1;
      medRpIdx = this.modal_obj.indexOfEditPres;
      medRpOrderIdx = index;
    } else {
      pres = originalNumber[this.state.calcNum];
      index = pres.medicines.length - 1;
      medRpIdx = this.state.calcNum;
      medRpOrderIdx = index;
    }
    usageId = pres.usage;
    medCode = pres.medicines[index].medicineId;
    medName = pres.medicines[index].medicineName;
    pres.medicines[index].unit = unit;
    medicine = pres.medicines[index];
    if (this.modal_obj.indexOfEditPres == -1) {
      pres.medicines[index].amount = number;
      pres.medicines[index].unit = unit;
    }

    partUssageFlag = true;
    if (item.usageName === "" || item.days === null) {
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

    if (partUssageFlag) {
      pres.body_part = item.usageComment;
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
      }

      originalNumber[originalNumber.length] = this.getEmptyPrescription();
    } else {
      if (this.state.indexOfInsertPres == -1) {
        pres.medicines.push(this.getEmptyMedicine());
      }
    }
  }

  let usageType = this.getUsageType(usageId);
  if (usageType === "21" || usageType === "22") {
    let age_type = '';
    if(this.state.detailedPatientInfo !== undefined) {
    let age = getAge(this.state.detailedPatientInfo['patient'][0]['real_birthday']);
      age_type = age >= 15 ? '成人' : '小児';
      
    }
    let params = {
      type: "haruka",
      codes: parseInt(medCode)
    };
    // let medDetail = this.getMedDetail(params);

    let medDetail = await apiClient.get("/app/api/v2/reference/medicines", {
      params: params
    });

    let amount = -1;

    let strUsage = "";
    let strItemUsage = "";
    let mainUnit = medicine.unit;
    let multi = 1;
    let unitlist = [];
    if (medicine.units !== undefined) {
      unitlist = medicine.units;
    } else {
      unitlist = medicine.units_list;
    }
    unitlist.map((val) => {
      if (val.main_unit_flag == 1) {
        mainUnit = val.name;
      }
      if (val.name == unit) {
        multi = val.multiplier;
      }
    });

    Object.keys(medDetail).map((idx) => {
      if (medDetail[idx].usages === undefined || medDetail[idx].usages === null) return;
      medDetail[idx].usages
        .filter((item) => {
          if (item.age_category == "") {
            return true;
          }
          return item.age_category == age_type;
        })
        .map((item) => {
          let items = [];
          amount = -1;
          strItemUsage = "";
          if (usageType == "21") {
            if (mainUnit === item.c029 && item.c028 !== "") {
              items = item.c028.split("～");
              if (amount > parseFloat(items[0]) || amount === -1) {
                amount = parseFloat(items[0]);
                strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c029;
              }
            }

            if (mainUnit === item.c058 && item.c057 !== "") {
              items = item.c057.split("～");
              if (amount > parseFloat(items[0]) || amount === -1) {
                amount = parseFloat(items[0]);
                strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c058;
              }
            }

            if (mainUnit === item.c087 && item.c086 !== "") {
              items = item.c086.split("～");
              if (amount > parseFloat(items[0]) || amount === -1) {
                amount = parseFloat(items[0]);
                strItemUsage = "・" + item.age_category + ":" + item.target + "1 日最大量:" + amount + item.c087;
              }

            }
            if (amount !== -1 && (number * multi) > amount) {
              strUsage = strUsage + strItemUsage + "\n";
            }
          } else if (usageType == "22") {
            if (mainUnit === item.c029 && item.c027 !== "") {
              items = item.c027.split("～");
              if (amount > parseFloat(items[0]) || amount === -1) {
                amount = parseFloat(items[0]);
                strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c029;
              }
            }

            if (mainUnit === item.c058 && item.c056 !== "") {
              items = item.c056.split("～");
              if (amount > parseFloat(items[0]) || amount === -1) {
                amount = parseFloat(items[0]);
                strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c058;
              }
            }

            if (mainUnit === item.c087 && item.c085 !== "") {
              items = item.c085.split("～");
              if (amount > parseFloat(items[0]) || amount === -1) {
                amount = parseFloat(items[0]);
                strItemUsage = "・" + item.age_category + ":" + item.target + "1 回最大量:" + amount + item.c087;
              }

            }
            if (amount !== -1 && (number * multi) > amount) {
              strUsage = strUsage + strItemUsage + "\n";
            }

          }

        });
      if (strUsage !== "") {
        originalNumber[medRpIdx].medicines[medRpOrderIdx].usage_permission = -1;
        originalNumber[medRpIdx].medicines[medRpOrderIdx].usage_alert_content = medName + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage;
        this.modal_obj.usageAlertModal = true;
        this.modal_obj.usageAlertContent = medName + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage;
        this.modal_obj.usageRpIdx = medRpIdx;
        this.modal_obj.usageRpOrderIdx = medRpOrderIdx;

        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);  
        // this.setState({
        //   usageRpIdx: medRpIdx,
        //   usageRpOrderIdx: medRpOrderIdx,
        //   usageAlertModal: true,
        //   usageAlertContent: medName + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage
        // });

      } else {
        originalNumber[medRpIdx].medicines[medRpOrderIdx].usage_permission = 0;
        originalNumber[medRpIdx].medicines[medRpOrderIdx].usage_alert_content = "";
      }

    });

  }

  window.localStorage.setItem("medicine_keyword", "");

  this.modal_obj.isAmountOpen = false;
  this.modal_obj.showedPresData = {
    medicineName: ""
  };
  this.modal_obj.amountTyped = true;

  let data = {"is_reload_state": false};
  data['presData'] = originalNumber;
  window.sessionStorage.setItem("prescribe-auto-focus", 1);

  this.modal_obj.amount_confirm_option = 1;

  this.setState({
      // presData: originalNumber,
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
      this.storeDataInCache(data);
      this.prescribeTableRef.current.testRender(originalNumber);

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );



}