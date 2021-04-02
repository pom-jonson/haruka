export default function(e) {
  const original = this.state.injectData;
  const index =
    this.modal_obj.indexOfEditPres == -1
      ? original.length - 1
      : this.modal_obj.indexOfEditPres;
  // 保存 last presData order index for usage
  this.modal_obj.lastOrderIndex = index;  

  original[index].injectUsageName = e.target.getAttribute("label");
  original[index].injectUsage = e.target.id;

  this.modal_obj.injectUsageName = e.target.getAttribute("label");  
  this.modal_obj.injectUsageOpen = false;

  let data = {};
  data['injectData'] = original;

  this.setState(
    {
      lengthId: this.state.presData.length - 1,
      calcNum: this.state.presData.length - 1,
      rp: this.state.rp + 1,
      selectedUsageTabIndex: e.target.getAttribute("usageType")
    },
    function() {
      this.storeInjectionDataInCache(data);
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );
}
