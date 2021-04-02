import { getCurrentDate } from "../../../../helpers/date";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
// import * as patientCacheApi from "~/helpers/cachePatient-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default function(order_number = undefined, presDataState = null, patient_id) {
  const initData = {
    medicines: [
      {
        medicineId: 0,
        medicineName: "",
        amount: 0,
        unit: "",
        main_unit_flag: 1,
        is_not_generic: 0,
        can_generic_name: 0,
        milling: 0,
        separate_packaging: 0,
        usage_comment: "",
        usage_optional_num: 0,
        poultice_times_one_day: 0,
        poultice_one_day: 0,
        poultice_days: 0,
        free_comment: [],
        uneven_values: []
      }
    ],
    units: [],
    days: 0,
    days_suffix: "",
    usage: 0,
    usageName: "",
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
    body_part: "",
    usage_remarks_comment: [],
    start_date: getCurrentDate()
  };
  if (presDataState) {
    this.setState({ 
      presData: presDataState,
      medicineHistory: order_number ? this.setDoCopyStatus(order_number, false) : this.state.medicineHistory
    },
    function() {
      this.storeDataInCache();
    });

  } else {
    this.setState(
      {
        presData: [initData],
        indexOfInsertMed: -1,
        medicineHistory: order_number ? this.setDoCopyStatus(order_number, false) : this.state.medicineHistory,
        bulk: {
          milling: 0,
          supply_med_info: 0,
          med_consult: 0,
          is_not_generic: 0,
          can_generic_name: 1,
          separate_packaging: 0,
          temporary_medication: 0,
          one_dose_package: 0
        },
        isEdintingIndex: -1
      },
      function() {
        // window.localStorage.removeItem("haruka_edit_cache");
        // patientCacheApi.removeByPatientId("local", patient_id, CACHE_LOCALNAMES.PATIENT_PRESCRIPTION_EDIT);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
      }
    );
  }
}
