import { persistedState } from "../../../../helpers/cache";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import { getCurrentDate } from "~/helpers/date";

export default function(patient_id) {
  let ret_state = {};
  let { persistState, cacheState, cacheDoneState } = persistedState(patient_id);
  if (!persistState || !cacheState){
    return ret_state;
  }
  if (cacheDoneState) {
    cacheDoneState.map(item=>{
      if (item.is_done == 1) {
        ret_state.is_done = true;
      }
    });
  }

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

  // check active prescription key
  let existCacheState = false;
  if (cacheState) {
    Object.keys(cacheState).map(key=>{
      if (key == this.m_cacheSerialNumber) {
        existCacheState = true;
      }
    })
  }

  let data = [];
  // get active prescription
  if (existCacheState) {    
    cacheState = karteApi.getSubVal(parseInt(patient_id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    data = cacheState.filter(item => {
      if (item.user_number === persistState.user_number && item.system_patient_id == current_system_patient_id) return item;
    });
  }  

  if (data && data.length > 0) {
    data = data[0];

    // YJ604:NG 21/1/11
    if (data.temp_saved != undefined && data.temp_saved == 0) {
      let before_usage = window.localStorage.getItem("prescription_current_usage_cache");
      if (before_usage != null && before_usage != undefined) {      
        window.localStorage.removeItem("prescription_current_usage_cache");      
        before_usage = JSON.parse(before_usage);      
        if (before_usage.usage != undefined) {
          data.presData = before_usage.usage;

          // save to cache
          let storeData = {};
          storeData.is_reload_state = false;
          storeData.presData = data.presData;
          this.storeDataInCache(storeData);
        }

        // initialize before presData cache
      } else { // if no exist amount of medicine
        if (data.presData.length > 0) {
          let presData_length = data.presData.length;
          let init_presData = 0;
          let data_presData = data.presData.map(item=>{
            if (item.medicines != undefined && item.medicines.length > 0) {
              let medicines_length = item.medicines.length;
              let init_medicines = 0;
              let splice_idx = null;
              let item_medicines = item.medicines.map((ele, idx)=>{
                // input only medicine name without amount
                if (ele.amount == undefined) {
                  if (presData_length == 1 && medicines_length == 1) {
                    init_presData = 1;
                  } 

                  if (medicines_length == 1) {
                    init_medicines = 1;
                  } else {
                    splice_idx = idx;                    
                  }
                }

                return ele;
              });

              if (init_medicines == 1) {
                item = JSON.parse(JSON.stringify(initData));
              } else {
                if (splice_idx != null) {
                  // item_medicines.splice( splice_idx, 1);
                  item_medicines[splice_idx] = {
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
                  };
                }
                item.medicines = item_medicines;
              }
              return item;
            }
          });

          if (init_presData == 1) { 
            data.presData = [JSON.parse(JSON.stringify(initData))];
          } else {
            data.presData = data_presData;
          }

          let storeData = {};
          storeData.is_reload_state = false;
          storeData.presData = data.presData;
          this.storeDataInCache(storeData);
        }
      }
    }

    this.context.$updateDepartment(data.department_code, data.department);
    this.context.$updateDepartmentName(
      data.medical_department_name,
      data.duties_department_name
    );
    
    this.context.$updateKarteStatus(data.karte_status_code, data.karte_status_name);

    let editingIndex = -1;
    if (data.number !== undefined) {
      this.state.medicineHistory.map((item, index) => {
        if (
          item.number === data.number
        ) {
          editingIndex = index;
        }
      });
    }

    let isDoing = false;
    let medicineHistory = this.state.medicineHistory.map(item => {
      if (data.number !== undefined && item.number === data.number) return item;
      
      item.order_data.order_data = item.order_data.order_data.map(medicine => {
        isDoing = false;
        data.presData.map(order => {
          if (medicine.order_number === order.order_number) {
            isDoing = true;
          }
        })
        medicine.isDoing = isDoing;
        return medicine;
      })

      return item;
    })    

    // 確認状態の反映
    let canConfirm = data.canConfirm != undefined && data.canConfirm != null ? data.canConfirm : 0;
    this.modal_obj.canConfirm = canConfirm;
    this.confirmButtonRef.current.testConfirmRender(canConfirm);        


    //加算項目-----------------------------------------------
    let additions_check = {};
    var additions = [];
    if (this.state.additions != undefined && this.state.additions!= null){
        additions = this.state.additions;
        Object.keys(additions).map(addition_id=> {
            if (data != null &&  data.additions != undefined && data.additions[addition_id] != undefined){
                additions_check[addition_id] = true;
            } else {
                additions_check[addition_id] = false;
            }
        })
    }
    if (this.state.staff_category === 2) {
      this.context.$updateDoctor(data.doctor_code, data.doctor_name);
      this.modal_obj.isEdintingIndex = editingIndex;
      this.modal_obj.orderNumber = data.number === undefined ? 0 : data.number;
      this.modal_obj.body_part = data.body_part;
      this.modal_obj.psychotropic_drugs_much_reason = data.psychotropic_drugs_much_reason;
      this.modal_obj.med_consult = data.med_consult;
      this.modal_obj.supply_med_info = data.supply_med_info;
      this.modal_obj.poultice_many_reason = data.poultice_many_reason;
      this.modal_obj.free_comment = data.free_comment;
      this.modal_obj.inOut = data.is_internal_prescription ? data.is_internal_prescription: parseInt(data.karte_status_code) == 1 ? 1 : 0;
      this.modal_obj.bulk = data.bulk;
      this.modal_obj.potion = data.potion ? data.potion : parseInt(data.is_internal_prescription) == 5? 0 : 2;
      this.modal_obj.hospital_opportunity_disease = data.hospital_opportunity_disease ? data.hospital_opportunity_disease : 0;
      this.modal_obj.item_details = data.item_details;
      ret_state.presData = data.presData;
      ret_state.isForUpdate = data.number === undefined ? false : true;
      ret_state.insurance_type = data.insurance_type;
      ret_state.body_part = data.body_part;
      ret_state.currentUserName = data.substitute_name;
      ret_state.unusedDrugSearch = data.unusedDrugSearch;
      ret_state.profesSearch = data.profesSearch;
      ret_state.normalNameSearch = data.normalNameSearch;
      ret_state.medicineHistory = medicineHistory;
      ret_state.additions = additions;
      ret_state.additions_check = additions_check;
      ret_state.item_details = data.item_details;
    } else {
      this.modal_obj.isEdintingIndex = editingIndex;      
      this.modal_obj.orderNumber = data.number === undefined ? 0 : data.number;
      this.modal_obj.psychotropic_drugs_much_reason = data.psychotropic_drugs_much_reason;
      this.modal_obj.med_consult = data.med_consult;
      this.modal_obj.supply_med_info = data.supply_med_info;
      this.modal_obj.poultice_many_reason = data.poultice_many_reason;
      this.modal_obj.free_comment = data.free_comment;
      this.modal_obj.inOut = data.is_internal_prescription ? data.is_internal_prescription: parseInt(data.karte_status_code) == 1 ? 1 : 0;
      this.modal_obj.bulk = data.bulk;
      this.modal_obj.potion = data.potion ? data.potion : parseInt(data.is_internal_prescription) == 5? 0 : 2;
      this.modal_obj.hospital_opportunity_disease = data.hospital_opportunity_disease ? data.hospital_opportunity_disease : 0;
      this.modal_obj.item_details = data.item_details;
      ret_state.presData = data.presData;
      ret_state.isForUpdate = data.number === undefined ? false : true;
      ret_state.insurance_type = data.insurance_type;
      ret_state.body_part = data.body_part;
      ret_state.unusedDrugSearch = data.unusedDrugSearch;
      ret_state.profesSearch = data.profesSearch;
      ret_state.normalNameSearch = data.normalNameSearch;
      ret_state.medicineHistory = medicineHistory;
      ret_state.additions = additions;
      ret_state.additions_check = additions_check;
      ret_state.item_details = data.item_details;
    }

    // 1209-34 処方箋に【お薬相談希望あり】、【薬剤情報あり】が出ない不具合
    let medConsultAndSupplyMedInfoState = {};
    medConsultAndSupplyMedInfoState.med_consult = this.modal_obj.med_consult;
    medConsultAndSupplyMedInfoState.supply_med_info = this.modal_obj.supply_med_info;
    // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
    medConsultAndSupplyMedInfoState.in_out = this.modal_obj.inOut;

    // apply state
    // if (this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != null) {
    //   this.prescribeTableRef.current.testRender(data.presData);
    // }
    if (this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != null) {
      medConsultAndSupplyMedInfoState.presData = data.presData;
      this.prescribeTableRef.current.testModalObjRender(medConsultAndSupplyMedInfoState);
    }

    let remark_status = {
      free_comment: this.modal_obj.free_comment,
      psychotropic_drugs_much_reason: this.modal_obj.psychotropic_drugs_much_reason,
      med_consult: this.modal_obj.med_consult,
      supply_med_info: this.modal_obj.supply_med_info,
      poultice_many_reason: this.modal_obj.poultice_many_reason,
      inOut: this.modal_obj.inOut,
      bulk: this.modal_obj.bulk,
      potion: this.modal_obj.potion,
      hospital_opportunity_disease: this.modal_obj.hospital_opportunity_disease,     
    };
    if (this.remarkRef.current != undefined && this.remarkRef.current != null) {
      this.remarkRef.current.testRemarkRender(remark_status);   
    }

    // let hasAdministratePeriod = false;
    // if (data.presData.length > 0) {
    //   data.presData.map(item=>{
    //     if (item.administrate_period != undefined) {
    //       hasAdministratePeriod = true;
    //     }
    //   });
    // }    

    let inOut_state = {
      id: this.modal_obj.inOut,
      unusedDrugSearch: ret_state.unusedDrugSearch,
      profesSearch: ret_state.profesSearch,
      normalNameSearch: ret_state.normalNameSearch,
      // existAdministratePeriod: hasAdministratePeriod
    }; 
    if (this.inOutRef.current != undefined && this.inOutRef.current != null) {
      this.inOutRef.current.testInOutRender(inOut_state); 
    }
    if (this.prescriptionNameRef.current != undefined && this.prescriptionNameRef.current != null) {
      this.prescriptionNameRef.current.testRender(data.item_details); 
    }
  } else {
    const presData = this.state.presData;
    if (presData.length > 1) {
      let newPresData = [];
      newPresData.push(presData[presData.length - 1]);
      ret_state.presData =  newPresData;
      ret_state.isForUpdate = false;
    }
  }
  return ret_state;
}
