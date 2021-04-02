import { CACHE_LOCALNAMES } from "~/helpers/constants";

export default function(e) {
  const original = this.state.injectData;
  let enableDays = parseInt(e.target.getAttribute("enableDays"));
  const index =
    this.modal_obj.indexOfEditPres == -1
      ? original.length - 1
      : this.modal_obj.indexOfEditPres;
  original[index].usageName = e.target.getAttribute("showName");
  original[index].usage = e.target.id;
  original[index].usageIndex = e.target.getAttribute("usageType");
  original[index].usage_replace_number = [];
  original[index].days = 0;
  original[index].days_suffix = e.target.getAttribute("suffix");
  original[index].enable_days = enableDays;
  original[index].require_body_parts = parseInt(e.target.getAttribute('requireBodyParts'));
  original[index].receipt_key_if_precision = e.target.getAttribute('receipt_key_if_precision');

  let indexOfBodyPart = -1;
  const { changeNumber } = this.state;
  indexOfBodyPart = changeNumber.indexPres;
  if (changeNumber.indexPres != -1) {
    indexOfBodyPart = changeNumber.indexPres;
  } else {
    if (this.modal_obj.indexOfEditPres != -1) {
      indexOfBodyPart = this.modal_obj.indexOfEditPres;
    } else {
      // indexOfBodyPart = this.state.calcNum;
      indexOfBodyPart = this.state.injectData.length - 1;
    }
  }
  let body_part_flag = (original[index].require_body_parts === 1);

  this.modal_obj.usageName = e.target.getAttribute("usageName");  
  this.modal_obj.usage = parseInt(e.target.id);  
  this.modal_obj.usageOpen = false;  
  this.modal_obj.daysInitial = 0;
  this.modal_obj.daysLabel = e.target.getAttribute("label");
  this.modal_obj.daysSuffix = e.target.getAttribute("suffix");
  this.modal_obj.indexOfEditPres = (original[index].require_body_parts === 1) ? indexOfBodyPart : -1;
  this.modal_obj.isBodyPartOpen = body_part_flag;

  let data = {};
  data['injectData'] = original;

  this.setState(
    {
      // usageName: e.target.getAttribute("label"),
      // usage: parseInt(e.target.id),
      receipt_key_if_precision:e.target.getAttribute('receipt_key_if_precision'),
      // injectData: original,
      // isDaysOpen: true,    
      // isBodyPartOpen: body_part_flag,
      // indexOfEditPres: (original[index].require_body_parts === 1) ? indexOfBodyPart : -1,  
      // daysInitial: 0,      
      // daysLabel: e.target.getAttribute("label"),
      // daysSuffix: e.target.getAttribute("suffix"),
      // usageOpen: false,
      lengthId: this.state.injectData.length - 1,
      calcNum: this.state.injectData.length - 1,
      rp: this.state.rp + 1,
    },()=>{
        this.storeInjectionDataInCache(data);
      // 部位選択後  
      if (!body_part_flag) {        
        // 注射データドラッグ&ドロップ操作
        let drop_inject_data = window.localStorage.getItem(CACHE_LOCALNAMES.DROP_INJECTION_DATA);
        if (drop_inject_data != null && drop_inject_data != undefined && drop_inject_data != "") {
          this.onDropEvent(drop_inject_data);
          window.localStorage.removeItem(CACHE_LOCALNAMES.DROP_INJECTION_DATA);
        }
      }

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }    
  );
}
