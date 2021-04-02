import axios from "axios";

export default async function(postData) {
  await axios
    .post("/app/api/v2/order/prescription/doctor_consent", {
      params: postData
    })
    .then(() => {})
    .catch(res => {
      if (res.status == 400 || res.status == 500) {
        if (res.error != undefined && res.error_alert_message != "") {
          alert(res.error_alert_message + "\n");
        } else {
          alert("送信しました");
        }
      } else {
        alert("送信しました");
      }
    });

  const medicineHistory = await this.getHistoryData({
    id: this.props.match.params.id
  });
  if (medicineHistory) {
    medicineHistory.map((item, index) => {
      if (index < 3) {
        item.order_data.class_name = "open";
      } else {
        item.order_data.class_name = "";
      }
    });
  }
  const notConsentedHistoryData = await this.getNotConsentedHistoryData({
    id: this.props.match.params.id
  });
  if (notConsentedHistoryData) {
    notConsentedHistoryData.map((item, index) => {
      if (index < 3) {
        item.order_data.class_name = "open";
      } else {
        item.order_data.class_name = "";
      }
    });
  }

  this.setState({
    medicineHistory: medicineHistory,
    notConsentedHistoryData: notConsentedHistoryData
  });
}
