export default function(e) {
  const original = this.state.presData;
  let enableDays = parseInt(e.target.getAttribute("enableDays"));
  const index =
    this.modal_obj.indexOfEditPres == -1
      ? original.length - 1
      : this.modal_obj.indexOfEditPres;
  const usageData = this.getUsageInfo(e.target.id);

  // 保存 last presData order index for usage
  this.modal_obj.lastOrderIndex = index;  

  original[index].usageName = e.target.getAttribute("usageName");
  original[index].usage = e.target.id;
  original[index].usageIndex = e.target.getAttribute("usageType");
  original[index].usage_replace_number = [];
  original[index].days = 0;
  original[index].days_suffix = e.target.getAttribute("suffix");
  original[index].enable_days = enableDays;
  original[index].require_body_parts = parseInt(e.target.getAttribute('requireBodyParts'));

  let needChange = original[index].usageName.includes("ＸＸ");
  // let usageName = "";
  // if (needChange) {
  //   usageName = original[index].usageName;
  // }
  if(needChange)
    original[index].days_suffix = "";
  let usageName = original[index].usageName;

  // 用法選択の際、数字入力が必要ない場合。
  // 用法
  let diagnosisOrderData = {};
  if( !(enableDays === 1 || needChange) ) {
    original[index].allowed_diagnosis_division = usageData.allowed_diagnosis_division != undefined ? usageData.allowed_diagnosis_division : [];
    if (!original[index].allowed_diagnosis_division.includes("21")) {
      original[index].one_dose_package = 0;
    }
    if (!original[index].allowed_diagnosis_division.includes("23")) {
      original[index].mixture = 0;
    }
    original[index].usage_category_name = usageData.category_name != undefined ?  usageData.category_name : ""
    if(usageData.allowed_diagnosis_division != undefined) {
      original[index].medicines.map((medicine, medIdx)=>{
        if (medicine.medicineName !== "") {
          if(!usageData.allowed_diagnosis_division.includes(medicine.diagnosis_division.toString())) {
            if(diagnosisOrderData[index] == undefined) {
              diagnosisOrderData[index] = [];
            }
            diagnosisOrderData[index].push(medIdx);
            original[index].medicines[medIdx].diagnosis_permission = -1;
          } else {
            original[index].medicines[medIdx].diagnosis_permission = 0;
          }
        }
      });
    }
  }

  this.modal_obj.usageName = e.target.getAttribute("usageName");  
  this.modal_obj.usage = parseInt(e.target.id);  
  this.modal_obj.usageOpen = false;
  this.modal_obj.isDaysOpen = enableDays === 1 || needChange;
  this.modal_obj.daysInitial = 0;
  this.modal_obj.daysLabel = usageName;
  this.modal_obj.daysSuffix = e.target.getAttribute("suffix");

  let data = {};
  data['presData'] = original;

  this.setState(
    {
      // usageName: e.target.getAttribute("usageName"),
      // usage: parseInt(e.target.id),
      // presData: original,
      // usageOpen: false,
      // isDaysOpen: enableDays === 1 || needChange,
      // daysInitial: 0,
      // daysLabel: usageName,
      // daysSuffix: e.target.getAttribute("suffix"),
      lengthId: this.state.presData.length - 1,
      calcNum: this.state.presData.length - 1,
      rp: this.state.rp + 1,
      selectedUsageTabIndex: e.target.getAttribute("usageType")
    },
    function() {
      this.storeDataInCache(data);
      if(Object.keys(diagnosisOrderData).length > 0) {
        this.modal_obj.diagnosisOrderModal = true;
        this.modal_obj.diagnosisOrderData = diagnosisOrderData;
        this.modal_obj.do_order = original[index];

          // this.setState({
          //   diagnosisOrderModal: true,
          //   diagnosisOrderData: diagnosisOrderData
          // });
      }
      else if (enableDays === 0 && needChange === false) {
        this.daysConfirm(0, "", [], "", false);
      }

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );
}
