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
  // 1188-150
  this.modal_obj.indexOfEditPres = -1;

  // prevent page refresh
  this.modal_obj.get_injection_Usage_option = 1;

  let data = {};
  data['injectData'] = original;
  data.is_reload_state = false;

  this.setState(
    {
      lengthId: this.state.presData.length - 1,
      calcNum: this.state.presData.length - 1,
      rp: this.state.rp + 1,
      selectedUsageTabIndex: e.target.getAttribute("usageType"),
      // 1188-150
      // changeNumber: {
      //   indexPres: -1,
      //   indexMed: -1
      // },
    },
    function() {
      this.storeInjectionDataInCache(data);
      this.prescribeTableRef.current.testRender(original);
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );
}
