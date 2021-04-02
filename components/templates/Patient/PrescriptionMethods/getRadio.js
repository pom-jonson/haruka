export default function(name, value, isGroup) {
  
  /*============
  全て一般名処方(in medicine info): can_generic_name
  全て後発不可(in medicine info): is_not_generic
  全て粉砕(in medicine info): milling
  
  全て一包化: one_dose_package
  全て臨時処方: temporary_medication
  ==============*/
  if (window.localStorage.getItem("prev_focus_key") !== undefined &&
  window.localStorage.getItem("prev_focus_key") !== null){
    if (document.getElementById(window.localStorage.getItem("prev_focus_key")) !== null){
      document.getElementById(window.localStorage.getItem("prev_focus_key")).focus();
    } else {
      if (document.getElementById("medicine_keyword") != undefined && document.getElementById("medicine_keyword") != null) {
        document.getElementById("medicine_keyword").focus();
      }
    }
  }
  let data_pres ={"is_reload_state": false};
  if (name === "unusedDrugSearch") {
    this.setState({ unusedDrugSearch: value }, function() {
      this.storeDataInCache(data_pres);
    });
  } else if (name === "profesSearch") {
    this.setState({ profesSearch: value }, function() {
      this.storeDataInCache(data_pres);
    });
  } else if (name === "normalNameSearch") {
    this.setState({ normalNameSearch: value }, function() {
      this.storeDataInCache(data_pres);
    });
  } else if (name !== "notConsentedDataSelect") {
    const original = this.state.presData;
    original.map((data, i) => {
      if (isGroup) {
        if (name == "one_dose_package") {
          if (data.allowed_diagnosis_division != undefined) {
            // 「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように
            if (data.allowed_diagnosis_division.includes("21")) {
              original[i][name] = value;
            } else {
              original[i][name] = 0;
            }
          } else {            
            original[i][name] = 0;
          }
        } else {          
          original[i][name] = value;
        }           
      } else {
        if (name == "milling") {
          if (data.allowed_diagnosis_division != undefined) {
            // 「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように
            if (data.allowed_diagnosis_division.includes("21")) {
              data.medicines.map((medicine, j) => {
                original[i].medicines[j][name] = value;
              });    
            } else {
              data.medicines.map((medicine, j) => {
                original[i].medicines[j][name] = 0;
              });    
            }
          } else {
            data.medicines.map((medicine, j) => {
              original[i].medicines[j][name] = 0;
            });
          }
        } else {          
          data.medicines.map((medicine, j) => {
            original[i].medicines[j][name] = value;
          });
        }
      }
    });

    const newBulk = this.modal_obj.bulk;
    // check can edit radio option
    if(canEditRadio(original, name) == 2 || canEditRadio(original, name) == 1) {      
      newBulk[name] = value;
    }

    this.modal_obj.bulk = newBulk;
    let remark_status = {      
      presData: original,
      bulk: newBulk      
    };
    this.remarkRef.current.testRemarkRender(remark_status);        
    this.prescribeTableRef.current.testRender(original);        

    // 備考・そのチェックボックス
    this.modal_obj.bulk_options = 1;
    let data = {};
    data['presData'] = original;
    this.storeDataInCache(data);
    // this.setState(
    //   {
    //     presData: original,
    //     bulk: newBulk
    //   },
    //   function() {
    //     this.storeDataInCache(data);
    //   }
    // );
  }
}

/*
  func: if there is a medicine with name, return true
*/
function canEditRadio(original, name = null){
  if (name == null) return 0;

  let name_array = ["can_generic_name", "is_not_generic", "one_dose_package", "temporary_medication", "milling"];
  if (!name_array.includes(name)) return 2;

  let result = 0;
  // let prescription_data = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);    
  let prescription_data = original;    
  if (prescription_data != undefined && 
    prescription_data != null &&     
    prescription_data.length > 0) {
    let med_info = prescription_data[0];
    med_info.medicines.map(item=>{
      if (item.medicineName != "") result = 1;
    });
  }    

  return result;
}
