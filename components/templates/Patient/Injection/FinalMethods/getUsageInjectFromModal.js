import { getInjectionUsageInfo } from "~/helpers/constants";

export default function(id, name, usageType, days_suffix = "", enableDays = 1, requireBodyParts = 0) {
  const original = this.state.injectData;
  const index =
    this.modal_obj.indexOfEditPres == -1
      ? original.length - 1
      : this.modal_obj.indexOfEditPres;
  original[index].usageName = name;
  original[index].usage = id;
  original[index].usageIndex = usageType;
  original[index].days_suffix = days_suffix;
  original[index].enable_days = enableDays;
  original[index].require_body_parts = requireBodyParts;

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
  // let needChange = name.includes("ＸＸ");
  // let usageName = "";
  // if (needChange) {
  //   usageName = name;
  // }
  // let usageName = name;

    this.modal_obj.usageName = name;
    this.modal_obj.usage = parseInt(id);
    this.modal_obj.usageOpen = false;
    this.modal_obj.daysInitial = 0;
    this.modal_obj.daysLabel = name;
    this.modal_obj.daysSuffix = days_suffix;
    this.modal_obj.indexOfEditPres = (original[index].require_body_parts === 1) ? indexOfBodyPart : -1;
    this.modal_obj.isBodyPartOpen = body_part_flag;

    // ●YJ698 注射に、薬剤なし登録できる手技を作れるように
    this.modal_obj.rpNewCreate = 0;
    let usage_allow_no_medicine = null;
    usage_allow_no_medicine = getInjectionUsageInfo(parseInt(id), "allow_registration_of_no_medicine");
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

    this.setState(
        {
            // usageName: name,
            // usage: id,
            // injectData: original,
            // isDaysOpen: true,
            // isBodyPartOpen: (original[index].require_body_parts === 1),
            // indexOfEditPres: (original[index].require_body_parts === 1) ? indexOfBodyPart : -1,
            // daysInitial: 0,
            // daysLabel: name,
            // daysSuffix:days_suffix,
            // usageOpen: false,
            lengthId: this.state.injectData.length - 1,
            calcNum: this.state.injectData.length - 1,
            rp: this.state.rp + 1,
        },
        function() {
            // this.storeInjectionDataInCache();
            // if (enableDays === 0) {
            //   this.daysInjectConfirm(0, "", [], "", false);
            // }
            // this.injectionUsageConfirm();
            // this.daysInjectConfirm(0, "", [], original[index].usageName, false);

            this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
    );
}
