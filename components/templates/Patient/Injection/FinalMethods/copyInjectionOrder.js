/**
 * 処方歴から選択した情報を元に新規の処方情報を追加する
 */
export default async function(order, multiple_order_flag=0, _from_orders=false) {
  let originalNumber = this.state.injectData;

  // ■YJ401 Doや編集が展開できていないように見える問題の修正
  if(this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != undefined){
    await this.prescribeTableRef.current.setPrescribeTableLoad(false);  
  }

  // 編集モードの時は末尾に、それ以外は末尾の１つ前（入力用の空の処方の前）に挿入
  let idx = originalNumber[originalNumber.length - 1].order_number ? originalNumber.length : originalNumber.length - 1;
  let newMedicines = [];
  let arrMedCodes = [];
  order.med.map(medicine => {
    let new_medicine = JSON.parse(JSON.stringify(medicine));
    newMedicines.push(new_medicine);
    arrMedCodes.push(new_medicine.item_number);
  });
  
  let today =  new Date();
  let newDate = new Date();
  let department_code = this.context.department.code;
  const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  let offset_date = 0;
  for (let [key, value] of Object.entries(authInfo.default_prescription_start_date_offset)) {
    if(department_code == key){
      offset_date = value;
      break;
    }
  }
  newDate.setDate(today.getDate() + offset_date);
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let formatted_date = `${year}${month < 10 ? `0${month}` : `${month}`}${date < 10 ? `0${date}` : `${date}`}`;
  newMedicines = newMedicines.map(medicine => {
    let free_comment = [];
    if (Array.isArray(medicine.free_comment)) {
      free_comment = medicine.free_comment.slice(0);
    } else {
      free_comment.push(medicine.free_comment);
    }
    let mtime = newDate.getTime();
    let period_permission = this.checkPeriodmedicineUnit(medicine, mtime);
    return {
      medicineId: medicine.item_number,
      medicineName: medicine.item_name,
      amount: medicine.amount,
      unit: medicine.unit,
      if_duplicate: medicine.if_duplicate,
      contraindication_reject: medicine.contraindication_reject,
      contraindication_alert: medicine.contraindication_alert,
      free_comment: free_comment,
      gene_name: medicine.gene_name !== undefined ? medicine.gene_name : "",
      period_permission: period_permission,
      start_month: medicine.start_month !== undefined ? medicine.start_month : "",
      end_month: medicine.end_month !== undefined ? medicine.end_month : "",
      start_date : medicine.start_date !== undefined ? medicine.start_date : "",
      end_date : medicine.end_date !== undefined ? medicine.end_date : "",
      tagret_contraindication: medicine.tagret_contraindication,
      yj_code: medicine.yj_code
    };
  });

  // ●YJ698 注射に、薬剤なし登録できる手技を作れるように
  // if (newMedicines === undefined || newMedicines.length === 0) return false;
  
  let add_order_info = {
    medicines: newMedicines,
    units: [],
    usage: order.usage,
    usageName: order.usage_name,
    days: order.days,
    days_suffix: order.days_suffix,
    start_date: formatted_date,
    year: "",
    month: "",
    date: "",
    insurance_type: order.insurance_type,
    usage_remarks_comment: order.usage_remarks_comment,
    order_number: order.order_number,
    injectUsage: order.injectUsage,
    injectUsageName: order.injectUsageName,
    body_part: order.body_part === undefined ? "" : order.body_part,
    receipt_key_if_precision: order.receipt_key_if_precision === undefined ? undefined : order.receipt_key_if_precision,
    is_precision: order.is_precision === undefined ? undefined : order.is_precision,
  };

  // if there is no injectData
  if (_from_orders == true && this.context.karte_status.code == 1) {
    add_order_info.administrate_period = order.administrate_period == undefined || order.administrate_period == null ? null : order.administrate_period;
  }
  originalNumber.splice(idx, 0, add_order_info);
  
  setTimeout(()=>{
    if (this.state.titleTab == 0 && multiple_order_flag == 0) {
      this.setInjectDoCopyStatus(order.order_number, true);
    }
    let data = {};
    data['injectData'] = JSON.parse(JSON.stringify(originalNumber));    
    this.storeInjectionDataInCache(data);
  }, 1000);
  return true;
}
