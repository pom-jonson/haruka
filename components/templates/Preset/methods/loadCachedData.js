import { persistedState } from "../../../../helpers/cache";
import * as localApi from "~/helpers/cacheLocal-utils";

export default function(patient_id) {
  const { persistState, cacheState, cacheDoneState } = persistedState(patient_id);


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
  let current_system_patient_id = localApi.getValue("current_system_patient_id");
  current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
  let data = cacheState.filter(item => {
    if (item.user_number === persistState.user_number && item.system_patient_id == current_system_patient_id) return item;
  });

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
      this.setState({
        presData: data.presData,
        orderNumber: data.number === undefined ? 0 : data.number,
        isForUpdate: data.number === undefined ? false : true,
        insurance_type: data.insurance_type,
        body_part: data.body_part,
        psychotropic_drugs_much_reason: data.psychotropic_drugs_much_reason,
        poultice_many_reason: data.poultice_many_reason,
        free_comment: data.free_comment,
        inOut: data.karte_status_code == 1 ? 1 : data.is_internal_prescription,
        currentUserName: data.substitute_name,
        bulk: data.bulk,
        unusedDrugSearch: data.unusedDrugSearch,
        profesSearch: data.profesSearch,
        normalNameSearch: data.normalNameSearch,
        isEdintingIndex: editingIndex,
        medicineHistory: medicineHistory,
        additions,
        additions_check,
        item_details:data.item_details,
      });
    } else {
      this.setState({
        presData: data.presData,
        orderNumber: data.number === undefined ? 0 : data.number,
        isForUpdate: data.number === undefined ? false : true,
        insurance_type: data.insurance_type,
        body_part: data.body_part,
        psychotropic_drugs_much_reason: data.psychotropic_drugs_much_reason,
        poultice_many_reason: data.poultice_many_reason,
        free_comment: data.free_comment,
        inOut: data.karte_status_code == 1 ? 1 : data.is_internal_prescription,
        bulk: data.bulk,
        unusedDrugSearch: data.unusedDrugSearch,
        profesSearch: data.profesSearch,
        normalNameSearch: data.normalNameSearch,
        isEdintingIndex: editingIndex,
        medicineHistory: medicineHistory,
        additions,
        additions_check,
        item_details:data.item_details,
      });
    }
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
