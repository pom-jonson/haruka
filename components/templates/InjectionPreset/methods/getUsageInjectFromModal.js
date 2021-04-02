export default function(id, name, usageType, days_suffix = "", enableDays = 1, requireBodyParts = 0) {
  const original = this.state.injectData;
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

  let usageName = name;

  this.setState(
    {
      usageName: name,
      usage: parseInt(id),
      injectData: original,
      usageOpen: false,
      // isDaysOpen: enableDays === 1 || needChange,
      isDaysOpen: true,
      daysInitial: 0,
      daysLabel: usageName,
      daysSuffix: days_suffix,
      lengthId: this.state.injectData.length - 1,
      calcNum: this.state.injectData.length - 1,
      rp: this.state.rp + 1,
      selectedUsageTabIndex: usageType
    },
    function() {
      this.storeInjectionDataInCache();
      // this.daysInjectConfirm(0, "", [], original[index].usageName, false);
    }
  );
}
