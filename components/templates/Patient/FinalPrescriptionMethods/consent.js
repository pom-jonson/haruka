import axios from "axios";

export default async function(postData) {
  let _success = false;
  await axios
    .post("/app/api/v2/order/prescription/doctor_consent", {
      params: postData
    })
    .then(() => {
      _success = true;
    })
    .catch(res => {
      if (res.status == 400 || res.status == 500) {
        if (res.error != undefined && res.error_alert_message != "") {
          window.sessionStorage.setItem("alert_messages", res.error_alert_message + "\n");          
        } else {
          window.sessionStorage.setItem("alert_messages", "送信しました。");          
        }
      } else {
        window.sessionStorage.setItem("alert_messages", "送信しました。");        
      }
    });

    if (_success) {      
      let medicineHistory = this.state.medicineHistory.map(item=>{
        if (postData.order.includes(item.number)) {
          item.is_doctor_consented = 1;
        }
        return item;
      });
      this.setState({
        medicineHistory
      });
    }
  // const medicineHistory = await this.getHistoryData({
  //   id: this.props.match.params.id
  // });
  // if (medicineHistory) {
  //   medicineHistory.map((item, index) => {
  //     if (index < 3) {
  //       item.order_data.class_name = "open";
  //     } else {
  //       item.order_data.class_name = "";
  //     }
  //   });
  // }

  // const notConsentedHistoryData = await this.getNotConsentedHistoryData({
  //   id: this.props.match.params.id
  // });
  // if (notConsentedHistoryData) {
  //   notConsentedHistoryData.map((item, index) => {
  //     if (index < 3) {
  //       item.order_data.class_name = "open";
  //     } else {
  //       item.order_data.class_name = "";
  //     }
  //   });
  // }

  // this.setState({
  //   medicineHistory: medicineHistory,
  //   notConsentedHistoryData: notConsentedHistoryData
  // });
}
