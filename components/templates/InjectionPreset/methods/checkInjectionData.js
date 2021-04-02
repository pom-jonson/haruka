export default function() {
  let validationPassed = true;

  // 数量がない
  this.state.presData.map(item => {
    item.medicines.map(medicine => {
      if (
        medicine.medicineName !== "" &&
        (medicine.amount === 0 || medicine.amount === undefined)
      ) {
        validationPassed = false;
      }
    });
  });

  if (validationPassed === false) {
    alert("薬品の数量を入力して下さい。");
    return false;
  }

  // 用法がない
  this.state.presData.map(item => {
    if (
      item.medicines.length >= 1 &&
      item.medicines[0].medicineName !== "" &&
      item.usageName === ""
    ) {
      validationPassed = false;
    }
  });

  if (validationPassed === false) {
    alert("手法方法を入力して下さい。");
    return false;
  }

  // 日数がない
  this.state.presData.map(item => {
    if (item.usage_replace_number === undefined) {
      if (
        item.usageName !== "" &&
        item.days === 0
      ) {
        if (item.usageIndex !== 6 && item.enable_days === 1) {
          validationPassed = false;
        }
      }
    } else {
      if (
        item.usageName !== "" &&
        (item.days === 0 &&
          item.usage_replace_number.length === 0)
      ) {
        if (item.usageIndex !== 6 && item.enable_days === 1) {
          validationPassed = false;
        }
      }
    }
    
  });

  if (validationPassed === false) {
    alert("手法の日数を入力して下さい。");
    return false;
  }

  return validationPassed;
}
