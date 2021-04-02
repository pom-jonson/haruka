/**
 * 注射歴から選択した情報を元に新規の注射情報を追加する
 */
export default async function(order) {  
  if (this.checkInjectCanEdit(0) === false) {
    let orders = [];
    orders.push(order);
    this.setState({
      tempItems: orders
    });
    return false;
  }
  let originalNumber = this.state.injectData;
  // 編集モードの時は末尾に、それ以外は末尾の１つ前（入力用の空の注射の前）に挿入
  let idx = originalNumber[originalNumber.length - 1].order_number
    ? originalNumber.length
    : originalNumber.length - 1;
  
  let newMedicines = [];
  let arrMedCodes = [];
  order.med.map(medicine => {
    // if (this.checkCanAddMedicine(medicine.item_number, false)) {
      newMedicines.push(JSON.parse(JSON.stringify(medicine)));
      arrMedCodes.push(JSON.parse(JSON.stringify(medicine)).item_number);
    // }
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

  let formatted_date = `${year}${month < 10 ? `0${month}` : `${month}`}${
    date < 10 ? `0${date}` : `${date}`
  }`;  

  newMedicines = newMedicines.map(medicine => { 
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
      contraindication_reject: medicine.contraindication_reject,
      contraindication_alert: medicine.contraindication_alert,
      tagret_contraindication: medicine.tagret_contraindication,
      yj_code: medicine.yj_code
    };
  });

  if (newMedicines === undefined || newMedicines.length === 0) return false;

  originalNumber.splice(idx, 0, {
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
    // order_number: order.order_number,
    // order_number_serial: order.order_number_serial,
    body_part: order.body_part === undefined ? "" : order.body_part
  });

  this.setState(
    {
      injectData: originalNumber
    },
    function() {
      this.storeInjectionDataInCache();
    }
  );
  return true;
}
