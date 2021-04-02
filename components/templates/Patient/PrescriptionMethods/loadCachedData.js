import { persistedState } from "../../../../helpers/cache";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";

export default function(patient_id) {
  let { persistState, cacheState, cacheDoneState } = persistedState(patient_id);


  if (!persistState) return;
  if (!cacheState) return;
  // if (!cacheDoneState) return;  
  
  if (cacheDoneState) {
    cacheDoneState.map(item=>{
      if (item.is_done == 1) {
        this.setState({
          is_done: true
        });
      }
    });
  }

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
      this.modal_obj.poultice_many_reason = data.poultice_many_reason;
      this.modal_obj.free_comment = data.free_comment;
      // this.modal_obj.inOut = data.karte_status_code == 1 ? 1 : data.is_internal_prescription;
      this.modal_obj.inOut = data.is_internal_prescription ? data.is_internal_prescription: parseInt(data.karte_status_code) == 1 ? 1 : 0;
      this.modal_obj.bulk = data.bulk;
      this.modal_obj.potion = data.potion ? data.potion : parseInt(data.is_internal_prescription) == 5? 0 : 2;
      this.modal_obj.hospital_opportunity_disease = data.hospital_opportunity_disease ? data.hospital_opportunity_disease : 0;
      this.modal_obj.item_details = data.item_details;
      this.setState({
        presData: data.presData,
        // canConfirm,
        // orderNumber: data.number === undefined ? 0 : data.number,
        isForUpdate: data.number === undefined ? false : true,
        insurance_type: data.insurance_type,
        body_part: data.body_part,
        // psychotropic_drugs_much_reason: data.psychotropic_drugs_much_reason,
        // poultice_many_reason: data.poultice_many_reason,
        // free_comment: data.free_comment,
        // inOut: data.karte_status_code == 1 ? 1 : data.is_internal_prescription,
        currentUserName: data.substitute_name,
        // bulk: data.bulk,
        unusedDrugSearch: data.unusedDrugSearch,
        profesSearch: data.profesSearch,
        normalNameSearch: data.normalNameSearch,
        // isEdintingIndex: editingIndex,
        medicineHistory: medicineHistory,
        additions,
        additions_check,
        // item_details:data.item_details,
      });
    } else {
      this.modal_obj.isEdintingIndex = editingIndex;      
      this.modal_obj.orderNumber = data.number === undefined ? 0 : data.number;
      this.modal_obj.psychotropic_drugs_much_reason = data.psychotropic_drugs_much_reason;
      this.modal_obj.poultice_many_reason = data.poultice_many_reason;
      this.modal_obj.free_comment = data.free_comment;
      // this.modal_obj.inOut = data.karte_status_code == 1 ? 1 : data.is_internal_prescription;
      this.modal_obj.inOut = data.is_internal_prescription ? data.is_internal_prescription: parseInt(data.karte_status_code) == 1 ? 1 : 0;
      this.modal_obj.bulk = data.bulk;
      this.modal_obj.potion = data.potion ? data.potion : parseInt(data.is_internal_prescription) == 5? 0 : 2;
      this.modal_obj.hospital_opportunity_disease = data.hospital_opportunity_disease ? data.hospital_opportunity_disease : 0;
      this.modal_obj.item_details = data.item_details;
      
      this.setState({
        presData: data.presData,
        // canConfirm,
        // orderNumber: data.number === undefined ? 0 : data.number,
        isForUpdate: data.number === undefined ? false : true,
        insurance_type: data.insurance_type,
        body_part: data.body_part,
        // psychotropic_drugs_much_reason: data.psychotropic_drugs_much_reason,
        // poultice_many_reason: data.poultice_many_reason,
        // free_comment: data.free_comment,
        // inOut: data.karte_status_code == 1 ? 1 : data.is_internal_prescription,
        // bulk: data.bulk,
        unusedDrugSearch: data.unusedDrugSearch,
        profesSearch: data.profesSearch,
        normalNameSearch: data.normalNameSearch,
        // isEdintingIndex: editingIndex,
        medicineHistory: medicineHistory,
        additions,
        additions_check,
        item_details:data.item_details,
      });
    }

    this.remarkRef.current.testRemarkRender({inOut:this.modal_obj.inOut}); 
    this.inOutRef.current.testInOutRender({id: this.modal_obj.inOut});  
  } else {
    const presData = this.state.presData;
    if (presData.length > 1) {
      let newPresData = [];
      newPresData.push(presData[presData.length - 1]);
      this.setState({
        presData: newPresData,
        isForUpdate: false
      });
    }
  }
}
