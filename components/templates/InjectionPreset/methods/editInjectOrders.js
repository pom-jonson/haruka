/**
 * 編集対象の注射データを入力欄に表示する。
 */

// import { formatDateFull } from "../../../../../helpers/date";

export default function(prescription) {
  if (this.checkInjectCanEdit(1) === false) {
    let orders = [];
    orders.push(prescription);
    this.setState({
      tempItems: orders
    });
    return;
  }

  let newPresData = prescription.order_data.order_data.map(order => {
    let usageRemarksList = [];
    if (Array.isArray(order.usage_remarks_comment)) {
      usageRemarksList = order.usage_remarks_comment;
    } else {
      usageRemarksList.push(order.usage_remarks_comment);
    }
    return {
      medicines: order.med.map(medicine => {
        let free_comment = [];
        if (Array.isArray(medicine.free_comment)) {
          free_comment = medicine.free_comment.slice(0);
        } else {
          free_comment.push(medicine.free_comment);
        }
        return {
          medicineId: medicine.item_number,
          medicineName: medicine.item_name,
          amount: medicine.amount,
          unit: medicine.unit,
          free_comment: free_comment,
          usage_comment: medicine.usage_comment,
          uneven_values: medicine.uneven_values,
          units_list: medicine.units_list,
          contraindication_alert: medicine.contraindication_alert,
          contraindication_reject: medicine.contraindication_reject,
          tagret_contraindication: medicine.tagret_contraindication,
          yj_code: medicine.yj_code
        };
      }),
      units: [],
      usage: order.usage,
      usageName: order.usage_name,
      days: order.days,
      days_suffix: order.days_suffix,
      year: "",
      month: "",
      date: "",
      order_number: order.order_number,
      order_number_serial: order.order_number_serial,
      medical_business_diagnosing_type: 32,
      insurance_type:
        order.insurance_type === undefined ? 0 : order.insurance_type,
      usage_remarks_comment: usageRemarksList,
      start_date: order.start_date,
      usage_replace_number: order.usage_replace_number,
      body_part: order.body_part === undefined ? "" : order.body_part
    };
  });  

  newPresData.push(this.getEmptyInjection());

  let editingIndex = -1;
  this.state.injectionHistory.map((item, index) => {
    if (
      item.order_data.order_data[0].order_number === newPresData[0].order_number
    ) {
      editingIndex = index;
    }
  });  

  this.context.$updateDepartment(
    prescription.order_data.department_code,
    prescription.order_data.department
  );

  window.sessionStorage.removeItem("prescribe-container-scroll");
  for (var key in window.localStorage) {
    if (key.includes("inject_keyword")) {
      window.localStorage.removeItem(key);
    }
  }
  window.sessionStorage.setItem("isForInjectionUpdate", true);
  const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));  
  this.setState(
    {
      injectData: newPresData,
      orderNumber: prescription.number ? prescription.number : 0,
      department: prescription.order_data.department ? prescription.order_data.department : authInfo.medical_department_name || "",
      departmentId: prescription.order_data.department_code ? prescription.order_data.department_code : authInfo.department,
      // inOut: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
      free_comment: prescription.order_data.free_comment ? prescription.order_data.free_comment : "",
      isForUpdate: true,
      isEdintingIndex: editingIndex,
      // injectionHistory: this.setDoCopyStatus(0, false, true)
    },
    function() {
      this.storeInjectionDataInCache();
    }
  );
}
