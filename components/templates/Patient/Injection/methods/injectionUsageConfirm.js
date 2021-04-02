import { getCurrentDate } from "../../../../../helpers/date";

export default function() {
  let originalNumber = this.state.injectData;
  let requireBodyParts = 0;
  let indexOfBodyPart = -1;
  const { changeNumber } = this.state;
  if (changeNumber.indexPres != -1) {
    requireBodyParts = originalNumber[changeNumber.indexPres].require_body_parts;
    indexOfBodyPart = changeNumber.indexPres;
  } else {
    if (this.state.indexOfEditPres != -1) {
      requireBodyParts = originalNumber[this.state.indexOfEditPres].require_body_parts;
      indexOfBodyPart = this.state.indexOfEditPres;
    } else {
      requireBodyParts = originalNumber[this.state.calcNum].require_body_parts;

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
        insurance_type: 0,
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
  this.setState(
    {
      injectData: originalNumber,
      isDaysOpen: false,
      isBodyPartOpen: (requireBodyParts === 1),
      usageModal: true,
      usageOpen: false,
      daysInitial: 0,
      daysLabel: "",
      indexOfEditPres: (requireBodyParts === 1) ? indexOfBodyPart : -1,
      // amountTyped: keypressed,
      changeNumber: {
        indexPres: -1,
        indexMed: -1
      }
    },
    function() {
      this.storeInjectionDataInCache();
    }
  );

}