import { getCurrentDate } from "../../../../helpers/date";

export default function(medicine) {
  const item = {
    rp: this.getdoubleDigestNumer(this.state.rp),
    medicineId: medicine.medicineId,
    medicineName: medicine.medicineName,
    amount: 0,
    main_unit: medicine.main_unit,
    units: medicine.units === undefined ? [] : medicine.units,
    main_unit_flag: 0,
    usage: 0,
    usageName: "",
    days: 0,
    days_suffix: "",
    start_date: getCurrentDate(),
    usageIndex: 0,
    year: 0,
    month: 0,
    date: 0,
    is_not_generic: 0,
    temporary_medication: 0,
    can_generic_name: 0,
    milling: 0,
    separate_packaging: 0,
    one_dose_package: 0,
    medical_business_diagnosing_type: 1,
    usage_comment: "",
    usage_optional_num: 0,
    poultice_times_one_day: 0,
    poultice_one_day: 0,
    poultice_days: 0,
    insurance_type: [],
    body_part: "",
    usage_remarks_comment: [],
    uneven_values: []
  };
  this.state.presData.push(item);
  // this.setState(
  //   {
  //     presData: this.state.presData,
  //     isAmountOpen: true,
  //     calcNum: this.state.presData.length - 1,
  //     usageOpen: false,
  //     showedPresData: {
  //       medicineName: medicine.medicineName
  //     }
  //   },
  //   function() {
  //     this.storeDataInCache();
  //   }
  // );
  this.modal_obj.isAmountOpen = true;
  this.modal_obj.calcNum = this.state.presData.length - 1;
  this.modal_obj.usageOpen = false;
  this.modal_obj.showedPresData = {
    medicineName: medicine.medicineName
  };

  let data = {};
  data['presData'] = this.state.presData;

  this.storeDataInCache(data);   

  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);       
}
