
export const checkAmount = (usageType, age, medicine, medDetail) => {

  let age_type = age >= 15 ? '成人' : '小児';
  let med_detail = medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : [];
  medicine.usage_alert_content = "";
  if (med_detail.usages === undefined || med_detail.usages === null) {
    medicine.usage_permission = 0;
  } else {

    let amount = -1;
    let strUsage = "";
    let strItemUsage = "";
    let mainUnit = "";
    let multi = 1;
    let unit_list = [];
    if (medicine.units_list !== undefined) {
      unit_list = medicine.units_list;
    } else if (medicine.units !== undefined) {
      unit_list = medicine.units;
    }

    unit_list.map((val) => {
      if (val.main_unit_flag == 1) {
        mainUnit = val.name;
      }
      if (val.name == medicine.unit) {
        multi = val.multiplier;
      }
    });
    med_detail.usages
      .filter((item) => {
        if (item.age_category == "") {
          return true;
        }
        return item.age_category == age_type;
      })
      .map((item) => {
        let items = [];
        amount = -1;
        strItemUsage = "";
        if (usageType == "21") {
          if (mainUnit === item.c029 && item.c028 !== "") {
            items = item.c028.split("～");

            if (amount > parseFloat(items[0]) || amount === -1) {
              amount = parseFloat(items[0]);
              strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c029;
            }
          }

          if (mainUnit === item.c058 && item.c057 !== "") {
            items = item.c057.split("～");
            if (amount > parseFloat(items[0]) || amount === -1) {
              amount = parseFloat(items[0]);
              strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c058;
            }
          }

          if (mainUnit === item.c087 && item.c086 !== "") {
            items = item.c086.split("～");
            if (amount > parseFloat(items[0]) || amount === -1) {
              amount = parseFloat(items[0]);
              strItemUsage = "・" + item.age_category + ":" + item.target + "1 日最大量:" + amount + item.c087;
            }

          }
          if (amount !== -1 && (medicine.amount * multi) > amount) {
            strUsage = strUsage + strItemUsage + "\n";
          }
        } else if (usageType == "22") {
          if (mainUnit === item.c029 && item.c027 !== "") {
            items = item.c027.split("～");

            if (amount > parseFloat(items[0]) || amount === -1) {
              amount = parseFloat(items[0]);
              strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c029;
            }
          }

          if (mainUnit === item.c058 && item.c056 !== "") {
            items = item.c056.split("～");
            if (amount > parseFloat(items[0]) || amount === -1) {
              amount = parseFloat(items[0]);
              strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c058;
            }
          }

          if (mainUnit === item.c087 && item.c085 !== "") {
            items = item.c085.split("～");
            if (amount > parseFloat(items[0]) || amount === -1) {
              amount = parseFloat(items[0]);
              strItemUsage = "・" + item.age_category + ":" + item.target + "1 回最大量:" + amount + item.c087;
            }
          }
          if (amount !== -1 && (medicine.amount * multi) > amount) {
            strUsage = strUsage + strItemUsage + "\n";
          }
        }
      });

    if (strUsage !== "") {
      medicine.usage_permission = -1;
      medicine.usage_alert_content = medicine.item_name + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage;
    } else {
      medicine.usage_permission = 0;
      medicine.usage_alert_content = "";
    }

  }
}
