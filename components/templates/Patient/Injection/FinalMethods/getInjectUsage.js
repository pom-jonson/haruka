import { CACHE_LOCALNAMES, getInjectionUsageInfo } from "~/helpers/constants";

export default function(e) {
  const original = this.state.injectData;
  let enableDays = parseInt(e.target.getAttribute("enableDays"));
  const index =
    this.modal_obj.indexOfEditPres == -1
      ? original.length - 1
      : this.modal_obj.indexOfEditPres;

  // 保存 last presData order index for usage
  this.modal_obj.lastOrderIndex = index;  
  let _cache_usage = {};
  _cache_usage.index = index;
  _cache_usage.usage = original;
  window.localStorage.setItem("injection_current_usage_cache", JSON.stringify(_cache_usage));

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

  // prevent page refresh
  this.modal_obj.get_injection_Usage_option = 1;


  // ●YJ698 注射に、薬剤なし登録できる手技を作れるように
  this.modal_obj.rpNewCreate = 0;
  let usage_allow_no_medicine = null;
  usage_allow_no_medicine = getInjectionUsageInfo(e.target.id, "allow_registration_of_no_medicine");
  if (usage_allow_no_medicine == 1) {
    if (body_part_flag != true) {      
      // create new rp record
      // check last rp
      if (index == original.length - 1) {        
        // if yes
        original[original.length] = this.getEmptyInjection();            
      }
    } else {
      this.modal_obj.rpNewCreate = 1;
    }
  }

  let data = {};
  data['injectData'] = original;
  data.is_reload_state = false;

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
        this.prescribeTableRef.current.testRender(original);
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
