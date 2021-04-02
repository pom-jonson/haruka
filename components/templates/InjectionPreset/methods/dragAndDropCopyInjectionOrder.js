export default function(order_number, is_preset = false) {
  let order = undefined;
  if (is_preset) {
    let numbers = order_number.split(":");
    this.state.injectionSetData.map(item => {
      if (item.preset_number === parseInt(numbers[0])) {
        order = item.order_data.order_data[parseInt(numbers[1])];
      }
    })
  } else {
    this.state.injectionHistory.map(injection => {
      injection.order_data.order_data.map(item => {
        if (item.order_number === order_number) {
          order = item;
        }
      });
    });  
  }
  if (order !== undefined) {
    if (this.copyInjectionOrder(order)) {
      return true;
    } else {
      alert("このRpは薬品が重複されているので追加できません。");
    }
  }
  return false;
}
