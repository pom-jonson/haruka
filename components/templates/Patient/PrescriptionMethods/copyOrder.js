/**
 * 処方歴から選択した情報を元に新規の処方情報を追加する
 */
import * as apiClient from "~/api/apiClient";
import {
  getAge
} from "~/helpers/date";
export default async function(order) {

  // if (this.checkCanEdit(0) === false) {
  //   let orders = [];
  //   orders.push(order);
  //   this.setState({
  //     tempItems: orders
  //   });
  //   return true;
  // }

  let originalNumber = this.state.presData;

  // 編集モードの時は末尾に、それ以外は末尾の１つ前（入力用の空の処方の前）に挿入
  let idx = originalNumber[originalNumber.length - 1].order_number ?
    originalNumber.length :
    originalNumber.length - 1;

  let usageRemarksList = [];
  if (Array.isArray(order.usage_remarks_comment)) {
    usageRemarksList = order.usage_remarks_comment;
  } else {
    usageRemarksList.push(order.usage_remarks_comment);
  }
  let today = new Date();
  let newDate = new Date();
  let department_code = this.context.department.code;
  const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  let offset_date = 0;
  for (let [key, value] of Object.entries(authInfo.default_prescription_start_date_offset)) {
    if (department_code == key) {
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

  let newMedicines = [];
  let arrMedCodes = [];
  order.med.map(medicine => {
    // if (this.checkCanAddMedicine(medicine.item_number, false)) {
    newMedicines.push(JSON.parse(JSON.stringify(medicine)));
    arrMedCodes.push(JSON.parse(JSON.stringify(medicine)).item_number);
    // }
  });

  let params = {
    type: "haruka",
    codes: arrMedCodes.join(",")
  };
  let medDetail = await apiClient.get("/app/api/v2/reference/medicines", {
    params: params
  });
  let usageData = this.getUsageInfo(order.usage);

  newMedicines = newMedicines.map(medicine => {

    let free_comment = [];
    if (Array.isArray(medicine.free_comment)) {
      free_comment = medicine.free_comment.slice(0);
    } else {
      free_comment.push(medicine.free_comment);
    }

    medicine.can_generic_name = medicine.can_generic_name === undefined ? this.modal_obj.bulk.can_generic_name : medicine.can_generic_name;
    // this.modal_obj.bulk.can_generic_name === 1
    //   ? this.modal_obj.bulk.can_generic_name
    //   : medicine.can_generic_name;

    medicine.is_not_generic = medicine.is_not_generic === undefined ? this.modal_obj.bulk.is_not_generic : medicine.is_not_generic;
    // this.modal_obj.bulk.is_not_generic === 1
    //   ? this.modal_obj.bulk.is_not_generic
    //   : medicine.is_not_generic;
    medicine.milling = medicine.milling === undefined ? this.modal_obj.bulk.milling : medicine.milling;
    // this.modal_obj.bulk.milling === 1
    //   ? this.modal_obj.bulk.milling
    //   : medicine.milling;



    let usageType = usageData.diagnosis_division != undefined ? usageData.diagnosis_division : "";
    if (usageType == "21" || usageType == "22") {
      let age_type = '';
      if(this.state.detailedPatientInfo !== undefined) {
      let age = getAge(this.state.detailedPatientInfo['patient'][0]['real_birthday']);  
        age_type = age >= 15 ? '成人' : '小児';
        
      }    
      let med_detail = medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : [];
      medicine.usage_alert_content = "";
      if (med_detail.usages === undefined || med_detail.usages === null) {
        medicine.usage_permission = 0;
      } else {
        let amount = -1;
        let strUsage = "";
        let strItemUsage = "";
        let mainUnit = medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit;
        let multi = 1;
        let unit_list = [];
        if (medicine.units_list !== undefined) {
          unit_list = medicine.units_list;
        } else if (medicine.units !== undefined) {
          unit_list = medicine.units;
        }

        unit_list.map((val) => {
          if (val.main_unit_flag == 1) {
            mainUnit = val.name;
          }
          if (val.name == medicine.unit) {
            multi = val.multiplier;
          }
        });
        med_detail.usages
          .filter((item) => {
            if (item.age_category == "") {
              return true;
            }            
            return item.age_category == age_type;
          })
          .map((item) => {
            let items = [];
            amount = -1;
            strItemUsage = "";
            if (usageType == "21") {
              if (mainUnit === item.c029 && item.c028 !== "") {
                items = item.c028.split("～");

                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c029;
                }
              }

              if (mainUnit === item.c058 && item.c057 !== "") {
                items = item.c057.split("～");
                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c058;
                }
              }

              if (mainUnit === item.c087 && item.c086 !== "") {
                items = item.c086.split("～");
                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + ":" + item.target + "1 日最大量:" + amount + item.c087;
                }

              }
              if (amount !== -1 && (medicine.amount * multi) > amount) {
                strUsage = strUsage + strItemUsage + "\n";
              }
            } else if (usageType == "22") {
              if (mainUnit === item.c029 && item.c027 !== "") {
                items = item.c027.split("～");

                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c029;
                }
              }

              if (mainUnit === item.c058 && item.c056 !== "") {
                items = item.c056.split("～");
                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c058;
                }
              }

              if (mainUnit === item.c087 && item.c085 !== "") {
                items = item.c085.split("～");
                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + ":" + item.target + "1 回最大量:" + amount + item.c087;
                }
              }
              if (amount !== -1 && (medicine.amount * multi) > amount) {
                strUsage = strUsage + strItemUsage + "\n";
              }
            }
          });
          
        if (strUsage !== "") {
          medicine.usage_permission = -1;
          medicine.usage_alert_content = medicine.item_name + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage;
        } else {
          medicine.usage_permission = 0;
          medicine.usage_alert_content = "";
        }

      }

    }


    let mtime = newDate.getTime();
    let period_permission = this.checkPeriodmedicineUnit(medicine, mtime);    
    // let stime = 0;
    // let period_permission = 0;
    // if (medicine.start_month !== undefined && medicine.start_month != "") {
    //   stime = new Date(medicine.start_month).getTime();
    //   if (stime > mtime) {
    //     period_permission = -1;
    //   }
    // }
    // if (medicine.end_month !== undefined && medicine.end_month != "") {
    //   let date_split = medicine.end_month.split("-");
    //   let day = new Date(date_split[0], date_split[1], 0).getDate();
    //   stime = new Date(medicine.end_month.substring(0, 4), medicine.end_month.substring(5, 7), day).getTime();
    //   if (stime < mtime) {
    //     period_permission = -1;
    //   }
    // }

    let diagnosis_permission = 0;
    let diagnosis_content = "";
    if (medicine.diagnosis_division && usageData.allowed_diagnosis_division != undefined) {
      if (!usageData.allowed_diagnosis_division.includes(medicine.diagnosis_division.toString())) {
        diagnosis_permission = -1;
        diagnosis_content = "Rp" + (idx + 1) + " の用法の区分は" + usageData.category_name + "ですが、\n" + medicine.item_name + "を処方してもよろしいですか？";
      }
    }

    let bgMedicine = "";

    let result = this.checkMedicineContraindication(medicine);

    if (result == 1) {
      bgMedicine = "medicine_alert";
    }    

    if (!this.checkCanAddMedicine(medicine.item_number)) {
      bgMedicine += " medicine_duplicate";
    }    

    return {
      medicineId: medicine.item_number,
      medicineName: medicine.item_name,
      amount: medicine.amount,
      unit: medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit,
      main_unit_flag: medicine.main_unit_flag,
      diagnosis_division: medicine.diagnosis_division,
      is_not_generic: medicine.is_not_generic,
      can_generic_name: medicine.can_generic_name,
      milling: medicine.milling,
      separate_packaging: medicine.separate_packaging,
      free_comment: free_comment,
      usage_comment: medicine.usage_comment,
      usage_optional_num: medicine.usage_optional_num,
      poultice_times_one_day: medicine.poultice_times_one_day,
      poultice_one_day: medicine.poultice_one_day,
      poultice_days: medicine.poultice_days,
      uneven_values: medicine.uneven_values,
      units_list: medicine.units_list,
      if_duplicate: medicine.if_duplicate,
      contraindication_reject: medicine.contraindication_reject,
      contraindication_alert: medicine.contraindication_alert,
      exists_detail_information: medicine.exists_detail_information,
      medDetail: medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : {},
      usage_permission: medicine.usage_permission,
      usage_alert_content: medicine.usage_alert_content,
      bgMedicine: bgMedicine,
      period_permission: period_permission,
      start_month: medicine.start_month !== undefined ? medicine.start_month : "",
      end_month: medicine.end_month !== undefined ? medicine.end_month : "",
      start_date : medicine.start_date !== undefined ? medicine.start_date : "",
      end_date : medicine.end_date !== undefined ? medicine.end_date : "",

      gene_name: medicine.gene_name !== undefined ? medicine.gene_name : "",
      diagnosis_permission: diagnosis_permission,
      diagnosis_content: diagnosis_content,
      tagret_contraindication: medicine.tagret_contraindication,
      yj_code: medicine.yj_code
    };
  });

  if (newMedicines === undefined || newMedicines.length === 0) return false;

  let diagnosisOrderData = {};
  if (usageData.allowed_diagnosis_division != undefined && usageData.allowed_diagnosis_division.length > 0) {

    newMedicines.map((medicine, index) => {
      if (medicine.diagnosis_permission == -1) {
        if (diagnosisOrderData[idx] == undefined) {
          diagnosisOrderData[idx] = [];
        }
        diagnosisOrderData[idx].push(index);
      }
    });

  }

  originalNumber.splice(idx, 0, {
    medicines: newMedicines,
    units: [],
    allowed_diagnosis_division: (usageData.allowed_diagnosis_division != undefined) ? usageData.allowed_diagnosis_division : [],
    usage_category_name: (usageData.category_name != undefined) ? usageData.category_name : "",
    usage: order.usage,
    usageName: order.usage_name,
    days: order.days,
    days_suffix: order.days_suffix,
    start_date: formatted_date,
    year: "",
    month: "",
    date: "",
    order_number: order.order_number,
    // supply_med_info: order.supply_med_info,
    // med_consult: order.med_consult,
    temporary_medication: order.temporary_medication === undefined ? this.modal_obj.bulk.temporary_medication : order.temporary_medication,
    // this.modal_obj.bulk.temporary_medication === 1
    //   ? this.modal_obj.bulk.temporary_medication
    //   : order.temporary_medication,
    one_dose_package: order.one_dose_package === undefined ? this.modal_obj.bulk.one_dose_package : order.one_dose_package,
    mixture: order.mixture === undefined ? 0 : order.mixture,
    // this.modal_obj.bulk.one_dose_package === 1
    //   ? this.modal_obj.bulk.one_dose_package
    //   : order.one_dose_package,
    medical_business_diagnosing_type: order.medical_business_diagnosing_type,
    insurance_type: order.insurance_type === undefined ? 0 : order.insurance_type,
    usage_remarks_comment: usageRemarksList,
    modalVisible: false,
    usage_replace_number: order.usage_replace_number,
    body_part: order.body_part === undefined ? "" : order.body_part
  });

  if (this.state.titleTab == 0) {
    this.medicineSelectionRef.current.testMedRender(this.setDoCopyStatus(order.order_number, true));
  }

  let remark_status = {     
    presData: originalNumber,    
  };
  
  this.remarkRef.current.testRemarkRender(remark_status); 

  let data = {};
  data['presData'] = originalNumber;
  this.storeDataInCache(data, "medicine_check");
  if (Object.keys(diagnosisOrderData).length > 0) {
    this.modal_obj.diagnosisOrderModal = true;
    this.modal_obj.diagnosisOrderData = diagnosisOrderData;
    this.modal_obj.do_order = order;

    this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);        
    // this.setState({
    //   diagnosisOrderModal: true,
    //   diagnosisOrderData: diagnosisOrderData
    // });
  }

    // this.setState({
    //   medicineHistory: this.setDoCopyStatus(order.order_number, true)
    // }, ()=>{
    //   let data = {};
    //   data['presData'] = originalNumber;
    //   this.storeDataInCache(data);
    //   if (Object.keys(diagnosisOrderData).length > 0) {
    //     this.setState({
    //       diagnosisOrderModal: true,
    //       diagnosisOrderData: diagnosisOrderData
    //     });
    //   }
    // });

  
  return true;
}