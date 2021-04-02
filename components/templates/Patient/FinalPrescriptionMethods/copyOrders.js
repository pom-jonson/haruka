import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as apiClient from "~/api/apiClient";
import {getAge} from "~/helpers/date";
import * as localApi from "~/helpers/cacheLocal-utils";

export default async function(prescription, from=null) {
  /*@cc_on 
  var w = window;
  eval('var window = w');
  @*/
  // ■YJ401 Doや編集が展開できていないように見える問題の修正
  if(this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != null){
    await this.prescribeTableRef.current.setPrescribeTableLoad(false);  
  }
  // YS132 単位がなくなっている場合の対策
    // 「主単位以外の単位が登録されていて、該当薬剤の単位の候補に存在しない単位名」の薬剤がある場合は、下記のようにアラートを出して、そのRPを追加しないようにしてください。
  if(this.checkHasNoUnitPrescription(prescription) == false){
    return;
  }
  let originalNumber = JSON.parse(JSON.stringify(this.state.presData));  
  // 空の状態か判定しておく
  let idx = this.state.presData[this.state.presData.length - 1].order_number ? this.state.presData.length : this.state.presData.length - 1;
  // 全RPコピー
  let flag = false;
  let arrMedCodes = [];
  // 1218-19 Rp2が消える
  let serial_key = new Date().getTime();
  prescription.order_data.order_data.map((order) => {
    order.serial_key = serial_key;
    order.med.map(medicine => {
      arrMedCodes.push(JSON.parse(JSON.stringify(medicine)).item_number);
    });
  });
  let params = {
    type: "haruka",
    codes: arrMedCodes.join(",")
  };
  let medDetail = await apiClient.get("/app/api/v2/reference/medicines", {params: params});
  let diagnosisPrescriptionData = {};
  let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  let order_numbers = [];
  prescription.order_data.order_data.map((order, index)=>{
    let result = 0;
    if (order.stop_flag == 1) {// 中止処方 check
      let now_date_time = new Date().getTime();
      let stop_date_time = 0;
      if (order.stop_date != "") {
        stop_date_time = new Date(order.stop_date.split("-").join("/")).getTime();
      }
      if (now_date_time > stop_date_time){
        result = 1;
      }
    }
    if(result == 0){
      let usageRemarksList = [];
      if (Array.isArray(order.usage_remarks_comment)) {
        usageRemarksList = order.usage_remarks_comment;
      } else {
        usageRemarksList.push(order.usage_remarks_comment);
      }
      let today = new Date();
      let newDate = new Date();
      let department_code = this.context.department.code;
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
      let formatted_date = `${year}${month < 10 ? `0${month}` : `${month}`}${date < 10 ? `0${date}` : `${date}`}`;
      let newMedicines = [];
      let arrMedCodes = [];
      order.med.map(medicine => {
        let newMedicine = JSON.parse(JSON.stringify(medicine));
        newMedicines.push(newMedicine);
        arrMedCodes.push(newMedicine.item_number);
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
        medicine.is_not_generic = medicine.is_not_generic === undefined ? this.modal_obj.bulk.is_not_generic : medicine.is_not_generic;
        medicine.milling = medicine.milling === undefined ? this.modal_obj.bulk.milling : medicine.milling;
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
            med_detail.usages.map(item=>{
              if(item.age_category == "" || item.age_category == age_type){
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
        let diagnosis_permission = 0;
        let diagnosis_content = "";
        if (medicine.diagnosis_division && usageData.allowed_diagnosis_division != undefined) {
          if (!usageData.allowed_diagnosis_division.includes(medicine.diagnosis_division.toString())) {
            diagnosis_permission = -1;
          }
        }
        let bgMedicine = "";
        let Contraindication_result = this.checkMedicineContraindication(medicine);
        if (Contraindication_result == 1) {
          bgMedicine = "medicine_alert";
        }
        if (!this.checkCanAddMedicine(medicine.item_number)) {
          bgMedicine += " medicine_duplicate";
        }
        return {
          medicineId: medicine.item_number,
          medicineName: medicine.item_name,
          amount: medicine.amount,
          unit: medicine.unit !== undefined && medicine.unit !== "" ? medicine.unit : "",
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
      if (newMedicines === undefined || newMedicines.length === 0) return;
      if (usageData.allowed_diagnosis_division != undefined && usageData.allowed_diagnosis_division.length > 0) {
        newMedicines.map((medicine, midx) => {
          if (medicine.diagnosis_permission == -1) {
            if (diagnosisPrescriptionData[idx + index] == undefined) {
              diagnosisPrescriptionData[idx + index] = [];
            }
            diagnosisPrescriptionData[idx + index].push(midx);
          }
        });
      }

      let add_order_info = {
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
        supply_med_info: order.supply_med_info,
        med_consult: order.med_consult,
        temporary_medication: order.temporary_medication === undefined ? this.modal_obj.bulk.temporary_medication : order.temporary_medication,
        one_dose_package: order.one_dose_package === undefined ? this.modal_obj.bulk.one_dose_package : order.one_dose_package,
        mixture: order.mixture === undefined ? 0 : order.mixture,
        medical_business_diagnosing_type: order.medical_business_diagnosing_type,
        insurance_type: order.insurance_type === undefined ? 0 : order.insurance_type,
        usage_remarks_comment: usageRemarksList,
        modalVisible: false,
        usage_replace_number: order.usage_replace_number,
        body_part: order.body_part === undefined ? "" : order.body_part,
        // administrate_period: order.administrate_period == undefined || order.administrate_period == null ? null : order.administrate_period,
        serial_key: serial_key
      };

      // YJ1069 SOAP画面のDoで、外来患者に放射線など尾のオーダーを入院で発行できてしまう
      if (idx == 0 && this.context.karte_status.code == 1) {
        add_order_info.administrate_period = order.administrate_period == undefined || order.administrate_period == null ? null : order.administrate_period;
      }
      originalNumber.splice(idx + index, 0, add_order_info);
      order_numbers.push(order.order_number);
      flag = true;
    }
  });
  if(order_numbers.length > 0 && this.state.titleTab == 0){
    // this.medicineSelectionRef.current.testMedRender(this.setDoCopyStatus(order_numbers, true, false, 1));
    this.setDoCopyStatus(order_numbers, true, false, 1);
  }
  if (idx === 0) {
    // 備考、その他欄のstate生成
    let newBulk = {
      milling: 1,
      supply_med_info: 1,
      med_consult: 1,
      is_not_generic: 1,
      can_generic_name: 1,
      separate_packaging: 1,
      temporary_medication: 1,
      one_dose_package: 1
    };
    //全データのフラグが立っていたら画面用(bulk)のフラグON
    prescription.order_data.order_data.map(pres => {
      if (pres.med.length > 0) {
        pres.med.map(med => {
          if (med.milling === 0 || med.milling === undefined) newBulk.milling = 0;
          if (med.is_not_generic === 0 || med.is_not_generic === undefined) newBulk.is_not_generic = 0;
          if (med.can_generic_name === 0 || med.can_generic_name === undefined) newBulk.can_generic_name = 0;
          if (med.separate_packaging === 0 || med.separate_packaging === undefined) newBulk.separate_packaging = 0;
        });
        if (pres.supply_med_info === 0 || pres.supply_med_info === undefined) newBulk.supply_med_info = 0;
        if (pres.med_consult === 0 || pres.med_consult === undefined) newBulk.med_consult = 0;
        if (pres.temporary_medication === 0 || pres.temporary_medication === undefined) newBulk.temporary_medication = 0;
        if (pres.one_dose_package === 0 || pres.one_dose_package === undefined) newBulk.one_dose_package = 0;
      }
    });
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.modal_obj.bulk = newBulk;
    this.modal_obj.orderNumber = prescription.number ? prescription.number : 0;
    this.modal_obj.department = prescription.order_data.department ? prescription.order_data.department : authInfo.medical_department_name || "";
    this.modal_obj.departmentId = prescription.order_data.department_code ? prescription.order_data.department_code : authInfo.department;
    // ●YJ110 SOAPの中央カラムからDoしたときに、新規発行する入外区分は現在の区分に合わせるように
    if (this.modal_obj.inOut_fromSoap_flag == true && from == "_fromSoap") {
      this.modal_obj.inOut = this.modal_obj.inOut;      
    } else {
      this.modal_obj.inOut = prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0;      
    }
    if (from == "_fromSoap") {
      this.modal_obj.potion = prescription.order_data.potion ? prescription.order_data.potion : parseInt(prescription.order_data.is_internal_prescription) == 5? 0 : 2;
    }
    this.modal_obj.free_comment = prescription.order_data.free_comment ? prescription.order_data.free_comment : "";
    this.modal_obj.psychotropic_drugs_much_reason = prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "";
    this.modal_obj.poultice_many_reason = prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "";
    let remark_status = {     
      presData: originalNumber,
      bulk: newBulk,
      department: prescription.order_data.department ? prescription.order_data.department : authInfo.medical_department_name || "",
      departmentId: prescription.order_data.department_code ? prescription.order_data.department_code : authInfo.department,
      inOut: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
      free_comment: prescription.order_data.free_comment ? prescription.order_data.free_comment : "",
      potion: this.modal_obj.potion,
      psychotropic_drugs_much_reason: prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "",
      poultice_many_reason: prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "",      
      med_consult: prescription.order_data.med_consult,
      supply_med_info: prescription.order_data.supply_med_info
    };

    this.remarkRef.current.testRemarkRender(remark_status);

    // 1209-34 処方箋に【お薬相談希望あり】、【薬剤情報あり】が出ない不具合
    this.modal_obj.med_consult = prescription.order_data.med_consult;
    this.modal_obj.supply_med_info = prescription.order_data.supply_med_info;
    let medConsultAndSupplyMedInfoState = {};
    medConsultAndSupplyMedInfoState.med_consult = this.modal_obj.med_consult;
    medConsultAndSupplyMedInfoState.supply_med_info = this.modal_obj.supply_med_info;
    medConsultAndSupplyMedInfoState.in_out = this.modal_obj.inOut;
    this.prescribeTableRef.current.testModalObjRender(medConsultAndSupplyMedInfoState);
    let inOut_state = {
      id: this.modal_obj.inOut,
      unusedDrugSearch: this.state.unusedDrugSearch,
      profesSearch: this.state.profesSearch,
      normalNameSearch: this.state.normalNameSearch
    };
    this.inOutRef.current.testInOutRender(inOut_state);
  }

  // get current cache item_details
  let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);

  let item_details = [];
  if (prescription.order_data.item_details != undefined && prescription.order_data.item_details != null && prescription.order_data.item_details.length > 0) {
    item_details = prescription.order_data.item_details.map(item=>{
      return {
        classfic: item.classfic,
        classfic_name: item.classfic_name,
        item_id: item.item_id,
        item_name: item.item_name,
        attribute1: item.attribute1,
        format1: item.format1,
        unit_name1: item.unit_name1,
        max_length1: item.max_length1,
        value1: item.value1,
        attribute2: item.attribute2,
        format2: item.format2,
        unit_name2: item.unit_name2,
        max_length2: item.max_length2,
        value2: item.value2,
      }
    });
  }  

  if (item_details !== undefined && item_details.length > 0) {    
    // ■YS5 処方箋単位でDoしたときに、区分跨ぎエラーの警告でキャンセルすると、品名の反映がキャンセルされない
    this.modal_obj.do_item_details = item_details;
    this.modal_obj.item_details = item_details;
    this.m_show_detail_flag = 1;
    this.showItemDetailArea(1);
  }

  if (cacheState != undefined && cacheState != null && cacheState[0] != undefined) {
    if (cacheState[0].item_details != null && cacheState[0].item_details != undefined && cacheState[0].item_details.length > 0) {
      let cache_item_dettails = cacheState[0].item_details;
      if (item_details.length > 0) {
        item_details.map(item=>{
          cache_item_dettails.push(item);
        });
      }            
      let blank_insert = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
      cache_item_dettails = cache_item_dettails.filter(x=>x.item_id !== 0);
      cache_item_dettails.push(blank_insert);
      item_details = cache_item_dettails;
    }
  }

  // save all item_details 
  this.modal_obj.all_item_details = item_details;

  let data = {};
  data['presData'] = originalNumber;
  if (from == "_fromSoap") {
    data['from'] = from;
  }  
  data.is_reload_state = false;
  this.storeDataInCache(data, "medicine_check");
  if (Object.keys(diagnosisPrescriptionData).length > 0) {
    this.modal_obj.diagnosisOrderModal = true;
    this.modal_obj.diagnosisOrderModal_from_copyOrders = true;
    this.modal_obj.diagnosisOrderData = diagnosisPrescriptionData;
    this.modal_obj.presData = originalNumber;
    // 1218-19 Rp2が消える
    this.modal_obj.do_prescription = prescription;
  }

  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
  localApi.remove('preset_do_deploy_index');
  this.prescribeTableRef.current.testRender(originalNumber);
  // 品名  2020-08-29
  // 処方箋・オーダー単位のDo（見出しのドラッグも）では、追加品名も右カラムに追加し、履歴側はグレーにするように。
  if (this.prescriptionNameRef.current != undefined && this.prescriptionNameRef.current != null) {
    this.prescriptionNameRef.current.testPrescriptionNameRender({item_details:item_details});
  }
  flag = true;
  return flag;
}