import { getCurrentDate } from "../../../../helpers/date";

export default function() {
  return {
    medicines: [this.getEmptyMedicine()],
    units: [],
    usage: 0,
    usageName: "",
    days: 0,
    start_date: getCurrentDate(),
    usageIndex: 0,
    year: "",
    month: "",
    date: "",
    supply_med_info: 0,
    med_consult: 0,
    temporary_medication: 0,
    one_dose_package: 0,
    medical_business_diagnosing_type: 0,
    insurance_type: 0,
    usage_remarks_comment: [],
    body_part: ""
  };
}
