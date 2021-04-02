export default function(name, value, isGroup) {
  if (window.localStorage.getItem("prev_focus_key") !== undefined &&
  window.localStorage.getItem("prev_focus_key") !== null){
    if (document.getElementById(window.localStorage.getItem("prev_focus_key")) !== null){
      document.getElementById(window.localStorage.getItem("prev_focus_key")).focus();
    } else {
      document.getElementById("medicine_keyword").focus();
    }
  }
  let data ={"is_reload_state": false};
  if (name === "unusedDrugSearch") {
    this.setState({ unusedDrugSearch: value }, function() {
      this.storeDataInCache(data);
    });
  } else if (name === "profesSearch") {
    this.setState({ profesSearch: value }, function() {
      this.storeDataInCache(data);
    });
  } else if (name === "normalNameSearch") {
    this.setState({ normalNameSearch: value }, function() {
      this.storeDataInCache(data);
    });
  } else if (name !== "notConsentedDataSelect") {
    const original = this.state.presData;
    original.map((data, i) => {
      if (isGroup) {
        // if (name == "one_dose_package" && data.allowed_diagnosis_division != undefined) {
        //   // 「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように
        //   if (data.allowed_diagnosis_division.includes("21")) {
        //     original[i][name] = value;
        //   } else {
        //     original[i][name] = 0;
        //   }
        // } else {          
        //   original[i][name] = value;
        // }   
        original[i][name] = value;             
      } else {
        if (name == "one_dose_package" && data.allowed_diagnosis_division != undefined) {
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
            original[i].medicines[j][name] = value;
          });
        }
      }
    });

    const newBulk = this.state.bulk;
    newBulk[name] = value;
    this.setState(
      {
        presData: original,
        bulk: newBulk
      },
      function() {
        this.storeDataInCache(data);
      }
    );
  }
}
