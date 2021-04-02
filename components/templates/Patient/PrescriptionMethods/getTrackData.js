import axios from "axios";

export default async function(number) {
  let hasAlready = false;
  this.context.$getMedicineChangeHistory().map(item => {
    if (item.number === number) {
      hasAlready = true;
    }
  });
  if (hasAlready) return;

  return new Promise(resolve => {
    axios
      .get("/app/api/v2/order/prescription/find/changelog", {
        params: { num: number }
      })
      .then(res => {
        let medicineChangeHistory = this.context.$getMedicineChangeHistory();
        medicineChangeHistory.push({
          number: number,
          value: res.data
        });
        this.context.$updateMedicineChangeHistory(medicineChangeHistory);
        resolve(res.data);
      });
  });
}
