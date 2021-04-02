export default function(e) {
  const original = this.state.injectData;
  let enableDays = parseInt(e.target.getAttribute("enableDays"));
  const index =
    this.state.indexOfEditPres == -1
      ? original.length - 1
      : this.state.indexOfEditPres;

  original[index].usageName = e.target.getAttribute("label");
  original[index].usage = e.target.id;
  original[index].usageIndex = e.target.getAttribute("usageType");
  original[index].usage_replace_number = [];
  original[index].days = 0;
  original[index].days_suffix = e.target.getAttribute("suffix");
  original[index].enable_days = enableDays;
  original[index].require_body_parts = parseInt(e.target.getAttribute('requireBodyParts'));

  let indexOfBodyPart = -1;
  const { changeNumber } = this.state;
  indexOfBodyPart = changeNumber.indexPres;
  if (changeNumber.indexPres != -1) {
    indexOfBodyPart = changeNumber.indexPres;
  } else {
    if (this.state.indexOfEditPres != -1) {
      indexOfBodyPart = this.state.indexOfEditPres;
    } else {
      // indexOfBodyPart = this.state.calcNum;
      indexOfBodyPart = this.state.injectData.length - 1;
    }
  }

  this.setState(
    {
      usageName: e.target.getAttribute("label"),
      usage: parseInt(e.target.id),
      injectData: original,
      // isDaysOpen: true,
      isBodyPartOpen: (original[index].require_body_parts === 1),
      indexOfEditPres: (original[index].require_body_parts === 1) ? indexOfBodyPart : -1,
      daysInitial: 0,      
      daysLabel: e.target.getAttribute("label"),
      daysSuffix: e.target.getAttribute("suffix"),
      usageOpen: false,
      lengthId: this.state.injectData.length - 1,
      calcNum: this.state.injectData.length - 1,
      rp: this.state.rp + 1,
    },
    function() {
      // this.storeInjectionDataInCache();   
      // this.daysInjectConfirm(0, "", [], original[index].usageName, false);
    }
  );
}
