import { persistedState } from "../../../../helpers/cache";

export default function(patient_id) {
  const { persistState, cacheInjectState } = persistedState(patient_id);

  if (!persistState) return;
  if (!cacheInjectState) return;

  let data = cacheInjectState.filter(item => {
    if (item.user_number === persistState.user_number) return item;
  });

  if (data && data.length > 0) {
    data = data[0];
    this.context.$updateDepartment(data.department_code, data.department);
    this.context.$updateDepartmentName(
      data.medical_department_name,
      data.duties_department_name
    );

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

    if (this.state.staff_category === 2) {
      this.context.$updateDoctor(data.doctor_code, data.doctor_name);
      this.setState({
        injectData: data.injectData,
        orderNumber: data.number === undefined ? 0 : data.number,
        isForUpdate: data.number === undefined ? false : true,
        insurance_type: data.insurance_type,
        body_part: data.body_part,
        psychotropic_drugs_much_reason: data.psychotropic_drugs_much_reason,
        poultice_many_reason: data.poultice_many_reason,
        free_comment: data.free_comment,
        inOut: data.is_internal_prescription,
        currentUserName: data.substitute_name,
        // bulk: data.bulk,
        unusedDrugSearch: data.unusedDrugSearch,
        profesSearch: data.profesSearch,
        normalNameSearch: data.normalNameSearch,
        isEdintingIndex: editingIndex,
        injectionHistory: injectionHistory
      });
    } else {
      this.setState({
        injectData: data.injectData,
        orderNumber: data.number === undefined ? 0 : data.number,
        isForUpdate: data.number === undefined ? false : true,
        insurance_type: data.insurance_type,
        body_part: data.body_part,
        psychotropic_drugs_much_reason: data.psychotropic_drugs_much_reason,
        poultice_many_reason: data.poultice_many_reason,
        free_comment: data.free_comment,
        inOut: data.is_internal_prescription,
        // bulk: data.bulk,
        unusedDrugSearch: data.unusedDrugSearch,
        profesSearch: data.profesSearch,
        normalNameSearch: data.normalNameSearch,
        isEdintingIndex: editingIndex,
        injectionHistory: injectionHistory
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
