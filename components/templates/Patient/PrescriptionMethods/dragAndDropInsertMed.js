export default function(number) {
  let medicine = undefined;
  this.state.medicineRankData.map(item => {
    if (item.code === number) {
      medicine = item;
    }
  });

  if (medicine !== undefined) {
    let original = this.state.presData;
    medicine.amount = 0;
    return this.insertMed(
      medicine,
      original.length - 1,
      original[original.length - 1].medicines.length - 1
    );
  }
  return false;
}
