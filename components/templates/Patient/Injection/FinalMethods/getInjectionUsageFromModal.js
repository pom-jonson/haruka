// export default function(id, name, usageType, days_suffix = "", enableDays = 1, requireBodyParts = 0) {
export default function(id, name) {
  const original = this.state.injectData;
  const index =
    this.modal_obj.indexOfEditPres == -1
      ? original.length - 1
      : this.modal_obj.indexOfEditPres;
  original[index].injectUsageName = name;
  original[index].injectUsage = id;

  this.modal_obj.injectUsageName = name;
  this.modal_obj.injectUsage = parseInt(id);

  let data = {};
  data['inject'] = original;
  this.setState(
    {
      lengthId: this.state.presData.length - 1,
      calcNum: this.state.presData.length - 1,
      rp: this.state.rp + 1,
    },
    function() {
      this.storeInjectionDataInCache(data);
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );
}
