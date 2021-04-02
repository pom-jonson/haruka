export default function(id, name, usageType, days_suffix = "", enableDays = 1, requireBodyParts = 0) {
  const usageData = this.getUsageInfo(id);
  // console.log(id, usageData);
  const original = this.state.presData;
  const index =
    this.modal_obj.indexOfEditPres == -1
      ? original.length - 1
      : this.modal_obj.indexOfEditPres;

  // 保存 last presData order index for usage
  this.modal_obj.lastOrderIndex = index;  
  let _cache_usage = {};
  _cache_usage.index = index;
  _cache_usage.usage = original;
  window.localStorage.setItem("prescription_current_usage_cache", JSON.stringify(_cache_usage));
  
  original[index].usageName = name;
  original[index].usage = id;
  original[index].usageIndex = usageType;
  original[index].days_suffix = days_suffix;
  original[index].enable_days = enableDays;
  original[index].require_body_parts = requireBodyParts;
  original[index].allowed_diagnosis_division = usageData.allowed_diagnosis_division != undefined ? usageData.allowed_diagnosis_division : [];

  let needChange = name.includes("ＸＸ");
  // let usageName = "";
  // if (needChange) {
  //   usageName = name;
  // }
  let usageName = name;


  this.modal_obj.usageName = name;
  this.modal_obj.usage = parseInt(id);
  this.modal_obj.usageOpen = false;
  this.modal_obj.isDaysOpen = enableDays === 1 || needChange;
  this.modal_obj.daysInitial = 0;
  this.modal_obj.daysLabel = usageName;
  this.modal_obj.daysSuffix = days_suffix;

  // if 用法 => 頓服（発熱時・ＸＸ℃以上）, init daysSuffix
  // if (usageType == "4" && this.modal_obj.usageName.includes("ＸＸ")) {
  if (enableDays === 1 && this.modal_obj.usageName.includes("ＸＸ")) {
    this.modal_obj.daysSuffix = "";
    this.modal_obj.daysAfterSuffix = days_suffix;
  }

  let data = {};
  data['presData'] = original;
  this.setState(
    {
      // usageName: name,
      // usage: parseInt(id),
      // presData: original,
      // usageOpen: false,
      // isDaysOpen: enableDays === 1 || needChange,
      // daysInitial: 0,
      // daysLabel: usageName,
      // daysSuffix: days_suffix,
      lengthId: this.state.presData.length - 1,
      calcNum: this.state.presData.length - 1,
      rp: this.state.rp + 1,
      selectedUsageTabIndex: usageType
    },
    function() {
      this.storeDataInCache(data);
      if (enableDays === 0 && needChange === false) {
        this.modal_obj.no_enableDays = 1;
        this.daysConfirm(0, "", [], "", false);
      }

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );
}
