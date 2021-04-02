export default function(item) {
  if (item.indexNum == 0 || item.indexNum) {
    let original = this.state.presData;
    original[item.indexNum] = item;
    this.setState(
      {
        presData: original,
        isAmountOpen: false,
        isDaysOpen: false,
        daysInitial: 0,
        daysLabel: "",
        daysSuffix: ""
      },
      function() {
        this.storeDataInCache();
      }
    );
  } else {
    this.state.presData.push(item);
    this.setState(
      {
        presData: this.state.presData,
        isAmountOpen: false,
        isDaysOpen: false,
        daysInitial: 0,
        daysLabel: "",
        daysSuffix: "",
        showedPresData: {
          medicineName: ""
        }
      },
      function() {
        this.storeDataInCache();
      }
    );
  }
}
