export default function(medicineId) {
  let flag = true;
  this.state.presData.map(rece => {
    rece.medicines.map(medicine => {
      if (flag && medicine.medicineId === medicineId) {
        flag = false;
      }
    });
  });
  
  return flag;
}
