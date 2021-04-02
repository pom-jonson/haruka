export default async function(delDatas, mode="del") {
  var medicineHistory = JSON.parse(
      window.localStorage.getItem("haruka_cache_medicineHistory")
    );
  delDatas.map(delData => {
    medicineHistory = medicineHistory.filter(medicine => {
      if (medicine.number == delData.number) {
        if (delData.order_data !== undefined) {
          let order_data = [];
          medicine.order_data.order_data.map(med_order_data => {
            let deleted = false;
            delData.order_data.map(item => {
              if (item.order_number === med_order_data.order_number) {
                deleted = true;
              }
            });
            if (deleted) {
              med_order_data.is_enabled = 2;
            }

            if(mode != "del" && med_order_data.is_enabled != undefined && !deleted) {
              delete med_order_data.is_enabled;
            }

            order_data.push(med_order_data);
          });
          medicine.order_data.order_data = order_data;
        } else {
          medicine.is_enabled = 3;
        }
      }
      return medicine;
    });
  });
  window.localStorage.setItem("haruka_cache_medicineHistory", JSON.stringify(medicineHistory));
}
