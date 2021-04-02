import {
  getCurrentDate,
  getAge
} from "~/helpers/date";

export default function(number, unit, splitNumbers, usageName, keypressed) {
  // console.log("daysconfirm ==============");
  // console.log("number, unit, splitNumbers, usageName, keypressed", number, unit, splitNumbers, usageName, keypressed);
  // console.log("this.state.calcNum", this.state.calcNum);
  //日数を入力時
  let originalNumber = this.state.presData;  
  let requireBodyParts = 0;
  let indexOfBodyPart = -1;
  let medRpIdx = -1;  
  const {
    changeNumber
  } = this.state;
  // console.log("00-------------");
  if (changeNumber.indexPres != -1) {
    // console.log("01-------------");
    originalNumber[changeNumber.indexPres].days = number;
    originalNumber[
      changeNumber.indexPres
    ].one_dose_package = this.modal_obj.bulk.one_dose_package;
    originalNumber[
      changeNumber.indexPres
    ].temporary_medication = this.modal_obj.bulk.temporary_medication;
    requireBodyParts = originalNumber[changeNumber.indexPres].require_body_parts;
    indexOfBodyPart = changeNumber.indexPres;
    medRpIdx = changeNumber.indexPres;
  } else {
    // console.log("02-------------");
    if (this.modal_obj.indexOfEditPres != -1) {
      // console.log("03-------------");
      medRpIdx = this.modal_obj.indexOfEditPres;

      // Y3 頓服のXX用法の場合に、回数入力が出ない不具合(09/05) example: 用法 => 頓服（発熱時・ＸＸ℃以上）
      // 頓服's XX check flag
      let existUsage4XX = 0;

      if (
        originalNumber[this.modal_obj.indexOfEditPres].usageName.includes("ＸＸ")
      ) {
        // console.log("04-------------");

        // 頓服's XX check
        if (originalNumber[this.modal_obj.indexOfEditPres].usageIndex != undefined && 
          originalNumber[this.modal_obj.indexOfEditPres].usageIndex != null) {
          // (originalNumber[this.modal_obj.indexOfEditPres].usageIndex == "4" || parseInt(originalNumber[this.modal_obj.indexOfEditPres].usageIndex) <= 2)) {
          existUsage4XX = 1;
        }

        originalNumber[this.modal_obj.indexOfEditPres].days = 0;
        let usage_replace_number =
          originalNumber[this.modal_obj.indexOfEditPres].usage_replace_number ===
          undefined ?
          [] :
          originalNumber[this.modal_obj.indexOfEditPres].usage_replace_number;
        usage_replace_number.push(number);
        originalNumber[
          this.modal_obj.indexOfEditPres
        ].usage_replace_number = usage_replace_number;
      } else {
        originalNumber[this.modal_obj.indexOfEditPres].days = number;
      }

      // console.log("05-------------");

      requireBodyParts = originalNumber[this.modal_obj.indexOfEditPres].require_body_parts;
      indexOfBodyPart = this.modal_obj.indexOfEditPres;

      originalNumber[this.modal_obj.indexOfEditPres].usageName = originalNumber[
        this.modal_obj.indexOfEditPres
      ].usageName.replace("ＸＸ", number);

      originalNumber[
        this.modal_obj.indexOfEditPres
      ].one_dose_package = this.modal_obj.bulk.one_dose_package;
      originalNumber[
        this.modal_obj.indexOfEditPres
      ].temporary_medication = this.modal_obj.bulk.temporary_medication;
      // console.log("06-------------");

      if (
        originalNumber[this.modal_obj.indexOfEditPres].usageName.includes("ＸＸ")
      ) {
        // console.log("07-------------");
        // this.setState({
        //   daysInitial: 0,
        //   daysLabel: originalNumber[this.modal_obj.indexOfEditPres].usageName,
        //   presData: originalNumber
        // });
        this.modal_obj.daysInitial = 0;
        this.modal_obj.daysLabel = originalNumber[this.modal_obj.indexOfEditPres].usageName;
        this.modal_obj.daysXXConfirm = 1; // refresh
        this.setState({
          presData: originalNumber
        });
        return;
      }

      // 頓服's XX check and set 回分
      if (existUsage4XX == 1 && originalNumber[this.modal_obj.indexOfEditPres].enable_days != undefined && originalNumber[this.modal_obj.indexOfEditPres].enable_days == 1) {  
        existUsage4XX = 0;
        this.modal_obj.daysInitial = 0;
        this.modal_obj.daysLabel = originalNumber[this.modal_obj.indexOfEditPres].usageName;
        this.modal_obj.isDaysOpen = true;

        this.modal_obj.daysXXConfirm = 1; // refresh

        // if 用法 => 頓服（発熱時・ＸＸ℃以上）, set daysSuffix
        if (this.modal_obj.daysAfterSuffix != undefined && this.modal_obj.daysAfterSuffix != null) {

          this.modal_obj.daysSuffix = this.modal_obj.daysAfterSuffix;
          originalNumber[this.modal_obj.indexOfEditPres].days_suffix = this.modal_obj.daysAfterSuffix;
          
          this.modal_obj.daysAfterSuffix = null;
        }        
        this.setState({
          presData: originalNumber
        });
        return; 
      }
    } else {
      medRpIdx = this.state.calcNum;

      // console.log("==00");
      // Y3 頓服のXX用法の場合に、回数入力が出ない不具合(09/05) example: 用法 => 頓服（発熱時・ＸＸ℃以上）
      // 頓服's XX check flag
      let existUsage4XX = 0;

      // ●YJ593 内服のXX用法で日数が使えない不具合
      // ・enable_daysが1の場合は日数/回数を使用するように
      // ・頓服の「頓服（発熱時・ＸＸ℃以上）」で回数が使えるのと同じ動きです

      if (originalNumber[this.state.calcNum].usageName.includes("ＸＸ")) {

        // console.log("==01");
        // 頓服's XX check
        if (originalNumber[this.state.calcNum].usageIndex != undefined && 
          originalNumber[this.state.calcNum].usageIndex != null) {
          // (originalNumber[this.state.calcNum].usageIndex == "4" || parseInt(originalNumber[this.state.calcNum].usageIndex) <= 2) ) {
          //parseInt(originalNumber[this.state.calcNum].usageIndex) <= 2 : 内服       
          existUsage4XX = 1;
        }

        originalNumber[this.state.calcNum].days = 0;

        let usage_replace_number =
          originalNumber[this.state.calcNum].usage_replace_number === undefined ?
          [] :
          originalNumber[this.state.calcNum].usage_replace_number;
        usage_replace_number.push(number);
        originalNumber[
          this.state.calcNum
        ].usage_replace_number = usage_replace_number;
      } else {
        originalNumber[this.state.calcNum].days = number;
      }

      requireBodyParts = originalNumber[this.state.calcNum].require_body_parts;
      indexOfBodyPart = this.state.calcNum;

      originalNumber[this.state.calcNum].usageName = originalNumber[
        this.state.calcNum
      ].usageName.replace("ＸＸ", number);

      originalNumber[
        this.state.calcNum
      ].one_dose_package = this.modal_obj.bulk.one_dose_package;
      originalNumber[
        this.state.calcNum
      ].temporary_medication = this.modal_obj.bulk.temporary_medication;
      // console.log("==02");
      if (originalNumber[this.state.calcNum].usageName.includes("ＸＸ")) {
        // console.log("==03");
        // this.setState({
        //   daysInitial: 0,
        //   daysLabel: originalNumber[this.state.calcNum].usageName,
        //   presData: originalNumber
        // });
        this.modal_obj.daysInitial = 0;
        this.modal_obj.daysLabel = originalNumber[this.state.calcNum].usageName;
        this.modal_obj.daysXXConfirm = 1; // refresh
        this.setState({
          presData: originalNumber
        });
        return;
      }

      // 頓服's XX check and set 回分
      if (existUsage4XX == 1 && originalNumber[this.state.calcNum].enable_days != undefined && originalNumber[this.state.calcNum].enable_days == 1) {     
        existUsage4XX = 0;
        this.modal_obj.daysInitial = 0;
        this.modal_obj.daysLabel = originalNumber[this.state.calcNum].usageName;
        this.modal_obj.isDaysOpen = true;

        this.modal_obj.daysXXConfirm = 1; // refresh

        // if 用法 => 頓服（発熱時・ＸＸ℃以上）, set daysSuffix
        if (this.modal_obj.daysAfterSuffix != undefined && this.modal_obj.daysAfterSuffix != null) {

          this.modal_obj.daysSuffix = this.modal_obj.daysAfterSuffix;
          originalNumber[this.state.calcNum].days_suffix = this.modal_obj.daysAfterSuffix;
          
          this.modal_obj.daysAfterSuffix = null;
        }        
        this.setState({
          presData: originalNumber
        });
        return; 
      }

      //末尾（空のフォーム）を削除
      originalNumber[this.state.calcNum].medicines.pop();

      originalNumber[originalNumber.length] = {
        medicines: [{
          medicineId: 0,
          medicineName: "",
          amount: 0,
          unit: "",
          units: [],
          main_unit_flag: 1,
          is_not_generic: 0,
          can_generic_name: 0,
          milling: 0,
          separate_packaging: 0,
          free_comment: [],
          usage_comment: "",
          usage_optional_num: 0,
          poultice_times_one_day: 0,
          poultice_one_day: 0,
          poultice_days: 0,
          uneven_values: []
        }],
        units: [],
        usage: 0,
        usageName: "",
        days: 0,
        days_suffix: "",
        start_date: getCurrentDate(),
        year: "",
        month: "",
        date: "",
        temporary_medication: 0,
        one_dose_package: 0,
        medical_business_diagnosing_type: 0,
        insurance_type: 0,
        body_part: "",
        usage_remarks_comment: []
      };
    }
  }
  let block = originalNumber[medRpIdx];
  let usageType = this.getUsageType(block.usage);

  let arrNotAllow = [];
  let isUsagePermission = false;
  let usageData = this.getUsageInfo(block.usage);  
  if (block.allowed_diagnosis_division != undefined && !block.allowed_diagnosis_division.includes(usageType)) {
    // 「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように
    if (usageType.toString() != "21") {
      block.one_dose_package = 0;
    }
    // 「混合」は用法が外用のRPだけ設定できるように
    if (usageType.toString() != "23") {
      block.mixture = 0;
    }
  }
  block.allowed_diagnosis_division = [];
  if (usageData.allowed_diagnosis_division != undefined) {
    block.allowed_diagnosis_division = usageData.allowed_diagnosis_division;
  }

  if (usageData.category_name != undefined) {
    block.usage_category_name = usageData.category_name;
  }

  if (usageType === "21" || usageType === "22") {
    let age_type = '';
    if(this.state.detailedPatientInfo !== undefined) {
    let age = getAge(this.state.detailedPatientInfo['patient'][0]['real_birthday']);
      age_type = age >= 15 ? '成人' : '小児';
      
    }
    block.medicines.map(medicine => {
      let med_detail = medicine.medDetail !== undefined ? medicine.medDetail : [];
      medicine.usage_alert_content = "";
      if (med_detail.usages === undefined || med_detail.usages === null) {
        medicine.usage_permission = 0;
      } else {
        let amount = -1;
        let strUsage = "";
        let strItemUsage = "";
        let mainUnit = "";
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
                  strItemUsage = "・" + item.age_category + "/ " + item.target + " 1 日最大量（通常量・維持量）：" + amount + item.c029;
                }
              }

              if (mainUnit === item.c058 && item.c057 !== "") {
                items = item.c057.split("～");
                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + "/ " + item.target + " 1 日最大量（初期量）：" + amount + item.c058;
                }
              }

              if (mainUnit === item.c087 && item.c086 !== "") {
                items = item.c086.split("～");
                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + "/ " + item.target + " 1 日最大量（追加量）：" + amount + item.c087;
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
                  strItemUsage = "・" + item.age_category + "/ " + item.target + " 1 回最大量（通常量・維持量）：" + amount + item.c029;
                }
              }

              if (mainUnit === item.c058 && item.c056 !== "") {
                items = item.c056.split("～");
                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + "/ " + item.target + " 1 回最大量（初期量）：" + amount + item.c058;
                }
              }

              if (mainUnit === item.c087 && item.c085 !== "") {
                items = item.c085.split("～");
                if (amount > parseFloat(items[0]) || amount === -1) {
                  amount = parseFloat(items[0]);
                  strItemUsage = "・" + item.age_category + "/ " + item.target + " 1 回最大量（追加量）：" + amount + item.c087;
                }

              }
              if (amount !== -1 && (medicine.amount * multi) > amount) {
                strUsage = strUsage + strItemUsage + "\n";
              }
            }
          });

        if (strUsage !== "" /* && medicine.usage_permission != 1*/ ) {
          medicine.usage_permission = -1;
          medicine.usage_alert_content = medicine.medicineName + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage;
        } else {
          medicine.usage_permission = 0;
          medicine.usage_alert_content = "";
        }
      }

      return medicine;
    });




    block.medicines.map((med, index) => {
      if (med.usage_permission !== undefined && med.usage_permission < 0) {
        isUsagePermission = true;
        arrNotAllow.push([medRpIdx, index]);
      }
    });

    originalNumber[medRpIdx] = block;

  }
  let diagnosisOrderData = {};
  block = originalNumber[medRpIdx];
  if (usageData.allowed_diagnosis_division != undefined) {  
    block.medicines.map((medicine, medIdx) => {
      if (medicine.diagnosis_division != undefined && medicine.diagnosis_division != null && !usageData.allowed_diagnosis_division.includes(medicine.diagnosis_division.toString())) {
        originalNumber[medRpIdx].medicines[medIdx].diagnosis_permission = -1;
        if (diagnosisOrderData[medRpIdx] == undefined) {
          diagnosisOrderData[medRpIdx] = [];
        }
        diagnosisOrderData[medRpIdx].push(medIdx);
      } else {
        originalNumber[medRpIdx].medicines[medIdx].diagnosis_permission = 0;
      }
    });
  }

  window.sessionStorage.setItem("prescribe-auto-focus", 1);
  this.modal_obj.isDaysOpen = false;
  this.modal_obj.isBodyPartOpen = (requireBodyParts === 1);
  this.modal_obj.usageOpen = false;
  this.modal_obj.amountTyped = keypressed;
  this.modal_obj.daysInitial = 0;
  this.modal_obj.daysLabel = "";
  this.modal_obj.indexOfEditPres = (requireBodyParts === 1) ? indexOfBodyPart : -1;

  // check 用法の区分と異なる薬剤が登録されているRpがあります
  if (Object.keys(diagnosisOrderData).length > 0) {
    this.modal_obj.after_bodyPart_diagnosisOrderModal = true;
    this.modal_obj.diagnosisOrderData = diagnosisOrderData;
    this.modal_obj.do_order = block;
  }

  // if no exist next open modal(amount, days, bodyParts input), remove cache  
  if (!this.modal_obj.isBodyPartOpen) {
    window.localStorage.removeItem("prescription_current_usage_cache");
  }


  // prevent page refresh
  this.modal_obj.days_confirm_option = 1;

  let data = {};
  data['presData'] = originalNumber;
  data.is_reload_state = false;
  this.setState({
      // presData: originalNumber,
      // isDaysOpen: false,
      // isBodyPartOpen: (requireBodyParts === 1),
      // usageModal: true,
      // usageOpen: false,
      // daysInitial: 0,
      // daysLabel: "",
      // indexOfEditPres: (requireBodyParts === 1) ? indexOfBodyPart : -1,
      amountTyped: keypressed,
      changeNumber: {
        indexPres: -1,
        indexMed: -1
      },
    },
    function() {
      this.storeDataInCache(data);
      if (isUsagePermission) {
        this.modal_obj.usageOverModal = isUsagePermission;
        this.modal_obj.usageOverItem = arrNotAllow;
        // this.setState({
        //   usageOverModal: isUsagePermission,
        //   usageOverItem: arrNotAllow,
        // });
      } else {        
        //YS4 部位指定がある用法で区分エラーが部位指定と同時に出る(09/06)
        if (Object.keys(diagnosisOrderData).length > 0 && !this.modal_obj.isBodyPartOpen) {
          this.modal_obj.diagnosisOrderModal = true;
          this.modal_obj.diagnosisOrderData = diagnosisOrderData;
          this.modal_obj.do_order = block;
          
          // this.setState({
          //   diagnosisOrderModal: true,
          //   diagnosisOrderData: diagnosisOrderData
          // });
        }
      }

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );
}