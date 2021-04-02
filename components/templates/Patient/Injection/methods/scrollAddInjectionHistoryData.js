// import axios from "axios";

export default function(params) {

  let injectionDBHistory = this.state.injectionDBHistory;
  const { $canDoAction, FEATURES, AUTHS } = this.context;
  if (params.offset + params.limit >= this.state.injectionDBHistory.length) {
    // this.context.$updateStopGetHistory(true);
    this.modal_obj.stopGetHistory = true;

    if (this.medicineSelectionRef.current != undefined && this.medicineSelectionRef.current != null) {
      this.medicineSelectionRef.current.testStopGetHistoryRender(true);
    }
  }

  // if (params.offset + params.limit + 10 > this.state.injectionDBHistory.length) {
  //   if (
  //     !(
  //       window.sessionStorage.getItem("isGettingMore") !== undefined &&
  //       window.sessionStorage.getItem("isGettingMore") !== null &&
  //       parseInt(window.sessionStorage.getItem("isGettingMore")) === 1
  //     )
  //   ) {
  //     window.sessionStorage.setItem("isGettingMore", 1);
  //     const { data } = await axios.get(
  //       "/app/api/v2/order/prescription/patient",
  //       {
  //         params: {
  //           patient_id: params.id,
  //           limit: 50,
  //           offset: this.state.injectionDBHistory.length
  //         }
  //       }
  //     );

  //     if (data) {
  //       if (data.length === 0) {
  //         this.context.$updateStopGetHistory(true);
  //       }
  //       data.map(item => {
  //         item.order_data.class_name = "";
  //         injectionDBHistory.push(item);
  //       });
  //     } else {
  //       this.context.$updateStopGetHistory(true);
  //     }

  //     this.setState({ injectionDBHistory }, () => {
  //       window.sessionStorage.removeItem("isGettingMore");
  //     });
  //   }
  // }

  let addCount = 0;
  let startIndex = 0;
  if (this.state.injectionHistory.length > 0) {
    injectionDBHistory.map((item, index) => {
      if (
        item.number ===
        this.state.injectionHistory[this.state.injectionHistory.length - 1].number
      ) {
        startIndex = index;
      }
    });
  }

  return injectionDBHistory.filter((item, index) => {
    if (
      $canDoAction(FEATURES.PRESCRIPTION, AUTHS.SHOW_DELETE) ||
      item.is_enabled === 1
    ) {
      if (index > startIndex) {
        addCount++;
        return addCount <= params.limit;
      }
    }
    return false;
  });
}
