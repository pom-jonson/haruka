import { getCurrentDate } from "../../../../../helpers/date";

export default function(number, unit, splitNumbers, usageName, keypressed) {
  //日数を入力時
  let originalNumber = this.state.injectData;
  let requireBodyParts = 0;
  let indexOfBodyPart = -1;
  const { changeNumber } = this.state;
  if (changeNumber.indexPres != -1) {
    originalNumber[changeNumber.indexPres].days = number;
    // originalNumber[
    //   changeNumber.indexPres
    // ].one_dose_package = this.state.bulk.one_dose_package;
    // originalNumber[
    //   changeNumber.indexPres
    // ].temporary_medication = this.state.bulk.temporary_medication;
    requireBodyParts = originalNumber[changeNumber.indexPres].require_body_parts;
    indexOfBodyPart = changeNumber.indexPres;
  } else {
    if (this.modal_obj.indexOfEditPres != -1) {
      // if (
      //   originalNumber[this.state.indexOfEditPres].usageName.includes("ＸＸ")
      // ) {
      //   originalNumber[this.state.indexOfEditPres].days = 0;
      //   let usage_replace_number =
      //     originalNumber[this.state.indexOfEditPres].usage_replace_number ===
      //     undefined
      //       ? []
      //       : originalNumber[this.state.indexOfEditPres].usage_replace_number;
      //   usage_replace_number.push(number);
      //   originalNumber[
      //     this.state.indexOfEditPres
      //   ].usage_replace_number = usage_replace_number;
      // } else {
      //   originalNumber[this.state.indexOfEditPres].days = number;
      // }
      originalNumber[this.modal_obj.indexOfEditPres].days = number;
      requireBodyParts = originalNumber[this.modal_obj.indexOfEditPres].require_body_parts;
      indexOfBodyPart = this.modal_obj.indexOfEditPres;

      originalNumber[this.modal_obj.indexOfEditPres].usageName = originalNumber[
        this.modal_obj.indexOfEditPres
      ].usageName.replace("ＸＸ", number);

      // originalNumber[
      //   this.state.indexOfEditPres
      // ].one_dose_package = this.state.bulk.one_dose_package;
      // originalNumber[
      //   this.state.indexOfEditPres
      // ].temporary_medication = this.state.bulk.temporary_medication;

      if (
        originalNumber[this.modal_obj.indexOfEditPres].usageName.includes("ＸＸ")
      ) {
        
        this.modal_obj.daysInitial = 0;
        this.modal_obj.daysLabel = originalNumber[this.modal_obj.indexOfEditPres].usageName;

        this.setState({
          // daysInitial: 0,
          // daysLabel: originalNumber[this.modal_obj.indexOfEditPres].usageName,
          injectData: originalNumber
        });
        return;
      }
    } else {
      // if (originalNumber[this.state.calcNum].usageName.includes("ＸＸ")) {
      //   originalNumber[this.state.calcNum].days = 0;

      //   let usage_replace_number =
      //     originalNumber[this.state.calcNum].usage_replace_number === undefined
      //       ? []
      //       : originalNumber[this.state.calcNum].usage_replace_number;
      //   usage_replace_number.push(number);
      //   originalNumber[
      //     this.state.calcNum
      //   ].usage_replace_number = usage_replace_number;
      // } else {
      //   originalNumber[this.state.calcNum].days = number;
      // }
      originalNumber[this.state.calcNum].days = number;
      requireBodyParts = originalNumber[this.state.calcNum].require_body_parts;
      indexOfBodyPart = this.state.calcNum;

      originalNumber[this.state.calcNum].usageName = originalNumber[
        this.state.calcNum
      ].usageName.replace("ＸＸ", number);

      // originalNumber[
      //   this.state.calcNum
      // ].one_dose_package = this.state.bulk.one_dose_package;
      // originalNumber[
      //   this.state.calcNum
      // ].temporary_medication = this.state.bulk.temporary_medication;
      if (originalNumber[this.state.calcNum].usageName.includes("ＸＸ")) {
        this.modal_obj.daysInitial = 0;
        this.modal_obj.daysLabel = originalNumber[this.state.calcNum].usageName;

        this.setState({
          // daysInitial: 0,
          // daysLabel: originalNumber[this.state.calcNum].usageName,
          injectData: originalNumber
        });
        return;
      }

      //末尾（空のフォーム）を削除
      originalNumber[this.state.calcNum].medicines.pop();

      originalNumber[originalNumber.length] = {
        medicines: [
          {
            medicineId: 0,
            medicineName: "",
            amount: 0,
            unit: "",
            free_comment: [],
          }
        ],
        days: 0,
        days_suffix: "",
        usage: 0,
        usageName: "",
        usageIndex: 0,
        year: "",
        month: "",
        date: "",
        body_part: "",
        usage_remarks_comment: [],      
        start_date: getCurrentDate()
      };
    }
  }
  window.sessionStorage.setItem("prescribe-auto-focus", 1);
  
  this.modal_obj.isDaysOpen = false;
  this.modal_obj.isBodyPartOpen = (requireBodyParts === 1);
  this.modal_obj.usageOpen = false;
  this.modal_obj.amountTyped = keypressed;
  this.modal_obj.daysInitial = 0;
  this.modal_obj.daysLabel = "";
  this.modal_obj.indexOfEditPres = (requireBodyParts === 1) ? indexOfBodyPart : -1;

  let data = {};
  data['injectData'] = originalNumber;

  this.setState(
    {
      // injectData: originalNumber,
      // isDaysOpen: false,
      // isBodyPartOpen: (requireBodyParts === 1),
      usageModal: true,
      // usageOpen: false,
      // daysInitial: 0,
      // daysLabel: "",
      // indexOfEditPres: (requireBodyParts === 1) ? indexOfBodyPart : -1,
      amountTyped: keypressed,
      changeNumber: {
        indexPres: -1,
        indexMed: -1
      }
    },
    function() {
      this.storeInjectionDataInCache(data);

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );
}
