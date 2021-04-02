import { getCurrentDate } from "../../../../../helpers/date";
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
        free_comment: []        
      }
    ],
    days: 0,
    days_suffix: "",
    usage: 0,
    usageName: "",
    insurance_type: 0,
    usageIndex: 0,
    year: "",
    month: "",
    date: "",        
    body_part: "",  
    usage_remarks_comment: [],      
    start_date: getCurrentDate()
  };

  if (presDataState) {
    if (this.state.titleTab == 0) {
      this.setInjectDoCopyStatus(order_number, false);
    }
    // 処方箋 title update
    this.titleRef.current.testTitleRender(this.getInjectionOrderTitle());
    this.modal_obj.rp_delete = 1;
    let data = {};
    data['injectData'] = presDataState;
    this.storeInjectionDataInCache(data);
  } else {
    // ■YJ658 注射画面で、薬剤検索をキャンセルした後で、新規入力時に検索キーワードが残っている不具合
    for (var key in window.localStorage) {
      if (key.includes("inject_keyword_")) {
        window.localStorage.removeItem(key);
      }
    }
    
    // 処方箋 title update
    this.titleRef.current.testTitleRender(this.getInjectionOrderTitle());
    if (this.state.titleTab == 0) {
      this.setInjectDoCopyStatus(order_number, false);
    }
    this.modal_obj.isEdintingIndex = -1;
    this.prescribeTableRef.current.testRender([initData]);

    // prescription confirm button init style
    this.confirmButtonRef.current.testConfirmRender(0);

    this.setState({
      injectData: [initData],
      indexOfInsertMed: -1,
    },function() {
        karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
    });
  }
}
