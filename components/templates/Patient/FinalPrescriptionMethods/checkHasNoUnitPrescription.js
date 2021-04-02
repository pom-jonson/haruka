// YS132 単位がなくなっている場合の対策
// 「主単位以外の単位が登録されていて、該当薬剤の単位の候補に存在しない単位名」の薬剤がある場合は、下記のようにアラートを出して、そのRPを追加しないようにしてください。
// let notHasUnitRpNumber = -1;
export default function(prescription, reload=true) {
  let _state = {};
  if (prescription != undefined) {
    prescription.order_data.order_data.map((item, index)=>{
      let med_arr = [];
      if (item.med != undefined && item.med.length > 0) {
        item.med.map(medicine=>{
          if (medicine.item_name != "") {
            let unit_list = [];
            if (medicine.units_list !== undefined) {
              unit_list = medicine.units_list;
            } else if (medicine.units !== undefined) {
              unit_list = medicine.units;
            }
            let existNotHasUnit = 0;
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
            }
            if (existNotHasUnit == 0) {
              med_arr.push(medicine.item_name);
            }
          }
        });
      }
      if (med_arr.length > 0) {
        _state[index+1] = med_arr;
      }
    });
  }

  if (Object.keys(_state).length > 0) {
    if (reload == true) {
      this.modal_obj.notHasUnitModal = true;      
      this.modal_obj.notHasUnitMed = _state;
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
    return false;
  }
  return true;
}
