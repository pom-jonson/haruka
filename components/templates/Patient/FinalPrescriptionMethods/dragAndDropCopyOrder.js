export default async function(order_number, is_preset = false) {
  let order = undefined;
  let order_idx = -1;
  if (is_preset) {
    let numbers = order_number.split(":");
    this.state.medicineSetData.map(item => {
      if (item.preset_number === parseInt(numbers[0])) {
        order = item.order_data.order_data[parseInt(numbers[1])];
      }
    })
  } else {
    this.state.medicineHistory.map(medicine => {
      medicine.order_data.order_data.map((item, idx) => {
        if (item.order_number === order_number) {
          order = item;
          order_idx = idx;
        }
      });
    });
  }


  if (order !== undefined) {

    // YS132 単位がなくなっている場合の対策
    // 「主単位以外の単位が登録されていて、該当薬剤の単位の候補に存在しない単位名」の薬剤がある場合は、下記のようにアラートを出して、そのRPを追加しないようにしてください。
    // let notHasUnitRpNumber = -1;    

    if (this.checkHasNoUnitOrder(order, order_idx) == false) {
      return;
    }
    

    /*let med_arr = [];
    if (order != undefined) {
      order.med.map((medicine)=>{
        let unit_list = [];
        if (medicine.units_list !== undefined) {
          unit_list = medicine.units_list;
        } else if (medicine.units !== undefined) {
          unit_list = medicine.units;
        }
        let existNotHasUnit = 0;
        if (unit_list.length > 0) {
          unit_list.map((val) => {
            if (val.name != "" && val.name == medicine.unit) {
              existNotHasUnit = 1;
            }              
          });
        }
        if(medicine.real_unit != "" && medicine.real_unit == medicine.unit){
          existNotHasUnit = 1;
        }
        if (existNotHasUnit == 0) {
          // if(noUnitObj[0] != undefined)  noUnitObj[0] = [];
          med_arr.push(medicine.item_name);          
        }             
      });
    }

    if (med_arr.length > 0) {
      this.modal_obj.notHasUnitModal = true;
      // let _state = {order_idx:med_arr};
      let _state = {};
      _state[order_idx+1] = med_arr;
      this.modal_obj.notHasUnitMed = _state;
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    } */

    if(is_preset) {
      this.copyOrder(order);
        return true;
      } else {
      let checkDisease = await this.checkDiseaseOrder(order);
      if (!checkDisease) {
        if (!this.checkPeriodMedicine(order)) {
          this.copyOrder(order);
            return true;
          // if (this.copyOrder(order)) {
          //   return true;
          // } else {
          //   alert("このRpは薬品が重複されているので追加できません。");
          // }
        }
      }

    }

  }
  return false;
}