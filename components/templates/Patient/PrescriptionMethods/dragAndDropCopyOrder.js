export default async function(order_number, is_preset = false) {
  let order = undefined;
  if (is_preset) {
    let numbers = order_number.split(":");
    this.state.medicineSetData.map(item => {
      if (item.preset_number === parseInt(numbers[0])) {
        order = item.order_data.order_data[parseInt(numbers[1])];
      }
    })
  } else {
    this.state.medicineHistory.map(medicine => {
      medicine.order_data.order_data.map(item => {
        if (item.order_number === order_number) {
          order = item;
        }
      });
    });
  }


  if (order !== undefined) {
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