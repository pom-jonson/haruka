export default function(number, is_preset = false) {

  let injection = undefined;
  if (is_preset) {
    this.state.injectionSetData.map(item => {
      if (item.preset_number === parseInt(number)) {
        injection = item;
      }
    })
  } else {
    this.state.injectionHistory.map(medicine => {
      if (medicine.number === parseInt(number)) {
        injection = medicine;
      }
    });
  }
  
  if (injection !== undefined) {
    return this.copyInjectionOrders(injection);
  }
  return false;
}
