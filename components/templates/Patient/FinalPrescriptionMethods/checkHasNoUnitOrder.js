// import { CACHE_SESSIONNAMES} from "~/helpers/constants";
// import * as sessApi from "~/helpers/cacheSession-utils";

// YS132 単位がなくなっている場合の対策
// 「主単位以外の単位が登録されていて、該当薬剤の単位の候補に存在しない単位名」の薬剤がある場合は、下記のようにアラートを出して、そのRPを追加しないようにしてください。
// let notHasUnitRpNumber = -1; 

export default function(order, rp_number=-1) {
  
  let med_arr = [];
  if (order != undefined) {
    order.med.map((medicine)=>{
      let unit_list = [];
      if (medicine.units_list !== undefined) {
        unit_list = medicine.units_list;
      } else if (medicine.units !== undefined) {
        unit_list = medicine.units;
      }
      let existNotHasUnit = 0;

      // if(unit_list.length == 0 && (medicine.real_unit == null || medicine.real_unit == undefined || medicine.real_unit == "")){
      if(unit_list.length == 0){
        existNotHasUnit = 1;
      } else {        
        if (unit_list.length > 0) {
          unit_list.map((val) => {
            if (val.name != "" && val.name == medicine.unit) {
              existNotHasUnit = 1;
            }              
          });
        }
        // else if(medicine.real_unit != undefined && medicine.real_unit != null && medicine.real_unit != "" && medicine.real_unit == medicine.unit){
        //   existNotHasUnit = 1;
        // }
      }
      if (existNotHasUnit == 0) {
        // if(noUnitObj[0] != undefined)  noUnitObj[0] = [];
        med_arr.push(medicine.item_name);          
      }             
    });
  }

  if (med_arr.length > 0) {
    this.modal_obj.notHasUnitModal = true;
    // let _state = {rp_number:med_arr};
    let _state = {};
    _state[rp_number+1] = med_arr;
    this.modal_obj.notHasUnitMed = _state;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    return false;
  }
  
  return true;
}
