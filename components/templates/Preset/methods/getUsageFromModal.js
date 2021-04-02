export default function(id, name, usageType, days_suffix = "", enableDays = 1, requireBodyParts = 0) {

  const usageData = this.getUsageInfo(id);
  // console.log(id, usageData);
  const original = this.state.presData;
  const index =
    this.state.indexOfEditPres == -1
      ? original.length - 1
      : this.state.indexOfEditPres;
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

  this.setState(
    {
      usageName: name,
      usage: parseInt(id),
      presData: original,
      usageOpen: false,
      isDaysOpen: enableDays === 1 || needChange,
      daysInitial: 0,
      daysLabel: usageName,
      daysSuffix: days_suffix,
      lengthId: this.state.presData.length - 1,
      calcNum: this.state.presData.length - 1,
      rp: this.state.rp + 1,
      selectedUsageTabIndex: usageType
    },
    function() {
      this.storeDataInCache();
      if (enableDays === 0 && needChange === false) {
        this.daysConfirm(0, "", [], "", false);
      }
    }
  );
}
