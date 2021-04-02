export default function(injection) {
  if (this.checkInjectCanEdit(0) === false) {
    this.setState({
      tempItems: injection.order_data.order_data
    });
    return false;
  }
    
  // 全RPコピー
  let flag = false;
  injection.order_data.order_data.forEach(order => {
    if (this.copyInjectionOrder(order)) {
      flag = true;
    }
  });
  if (!flag) {
    alert("この注射は薬品が重複されているので追加できません。");
  }
  return flag;
}
