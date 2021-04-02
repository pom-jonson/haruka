import { persistedState } from "~/helpers/cache";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";

export default function(patient_id) {
  let { persistState, cacheInjectState, cacheDoneInjectState} = persistedState(patient_id);
  if (!persistState) return;
  if (!cacheInjectState) return;
  // if (!cacheDoneInjectState) return;

  if (cacheDoneInjectState) {
    cacheDoneInjectState.map(item=>{
      if (item.is_done == 1) {
        this.setState({
          is_done: true
        });
      }
    });
  }

  // check active prescription key
  let existCacheState = false;
  if (cacheInjectState) {
    Object.keys(cacheInjectState).map(key=>{
      if (key == this.m_cacheSerialNumber) {
        existCacheState = true;
      }
    })
  }

  let data = [];
  // get active prescription
  if (existCacheState) {    
    cacheInjectState = karteApi.getSubVal(parseInt(patient_id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    data = cacheInjectState.filter(item => {
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
      this.state.injectionHistory.map((item, index) => {
        if (
          item.number === data.number
        ) {
          editingIndex = index;
        }
      });
    }

    let isDoing = false;
    let injectionHistory = this.state.injectionHistory.map(item => {
      if (data.number !== undefined && item.number === data.number) return item;
      
      item.order_data.order_data = item.order_data.order_data.map(medicine => {
        isDoing = false;
        data.injectData.map(order => {
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
      this.modal_obj.location_id = data.location_id;
      this.modal_obj.schedule_date = data.schedule_date ? new Date(data.schedule_date) : new Date();
      this.modal_obj.drip_rate = data.drip_rate;
      this.modal_obj.water_bubble = data.water_bubble;
      this.modal_obj.exchange_cycle = data.exchange_cycle;
      this.modal_obj.require_time = data.require_time;
      this.modal_obj.inOut = data.is_completed;
      let remark_status = {
        location_id: data.location_id,
        drip_rate: data.drip_rate,
        water_bubble: data.water_bubble,
        exchange_cycle: data.exchange_cycle,
        require_time: data.require_time,
      };
      this.remarkRef.current.testRemarkRender(remark_status);  
      let reset_state = {
        id: this.modal_obj.inOut,
        schedule_date: this.modal_obj.schedule_date
      };
      this.injectionInOutRef.current.testInOutRender(reset_state);

      this.setState({
        // canConfirm,
        injectData: data.injectData,
        orderNumber: data.number === undefined ? 0 : data.number,
        isForUpdate: data.number === undefined ? false : true,
        insurance_type: data.insurance_type,
        body_part: data.body_part,
        psychotropic_drugs_much_reason: data.psychotropic_drugs_much_reason,
        poultice_many_reason: data.poultice_many_reason,
        free_comment: data.free_comment,
        // inOut: data.is_completed,
        currentUserName: data.substitute_name,
        // bulk: data.bulk,
        unusedDrugSearch: data.unusedDrugSearch,
        profesSearch: data.profesSearch,
        normalNameSearch: data.normalNameSearch,
        // isEdintingIndex: editingIndex,
        injectionHistory: injectionHistory,
        additions,
        additions_check,
        item_details:data.item_details,
      });
    } else {
      this.modal_obj.isEdintingIndex = editingIndex;
      this.modal_obj.location_id = data.location_id;
      this.modal_obj.schedule_date = data.schedule_date ? new Date(data.schedule_date) : new Date();
      this.modal_obj.drip_rate = data.drip_rate;
      this.modal_obj.water_bubble = data.water_bubble;
      this.modal_obj.exchange_cycle = data.exchange_cycle;
      this.modal_obj.require_time = data.require_time;
      this.modal_obj.inOut = data.is_completed;

      let remark_status = {
        location_id: data.location_id,
        drip_rate: data.drip_rate,
        water_bubble: data.water_bubble,
        exchange_cycle: data.exchange_cycle,
        require_time: data.require_time,
      };
      this.remarkRef.current.testRemarkRender(remark_status);      

      let reset_state = {
        id: this.modal_obj.inOut,
        schedule_date: this.modal_obj.schedule_date
      };
      this.injectionInOutRef.current.testInOutRender(reset_state);  
      
      this.setState({
        // canConfirm,
        injectData: data.injectData,
        orderNumber: data.number === undefined ? 0 : data.number,
        isForUpdate: data.number === undefined ? false : true,
        insurance_type: data.insurance_type,
        body_part: data.body_part,
        psychotropic_drugs_much_reason: data.psychotropic_drugs_much_reason,
        poultice_many_reason: data.poultice_many_reason,
        free_comment: data.free_comment,
        // inOut: data.is_completed,
        unusedDrugSearch: data.unusedDrugSearch,
        profesSearch: data.profesSearch,
        normalNameSearch: data.normalNameSearch,
        // isEdintingIndex: editingIndex,
        injectionHistory: injectionHistory,
        additions,
        additions_check,
        item_details:data.item_details,
      });
    }
  } else {
    const injectData = this.state.injectData;
    if (injectData.length > 1) {
      let newinjectData = [];
      newinjectData.push(injectData[injectData.length - 1]);
      this.setState({
        injectData: newinjectData,
        isForUpdate: false
      });
    }
  }
}
