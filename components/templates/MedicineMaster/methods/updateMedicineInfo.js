import * as apiClient from "~/api/apiClient";

export default async function() {
  let result = this.state.unit_conversion_array.filter( item => {
    return !(item.name === "" && item.value === "");
  });
  let params = {
          haruka_code: this.state.haruka.haruka_code,
          is_enabled: this.state.haruka.is_enabled,
          start_date: this.state.start_date,
          end_date: this.state.end_date,
          is_round_up: this.state.is_round_up
        }
  if(result.length > 0) {
    params.unit_conversion_array = result;
  }
    await apiClient._post(
      "/app/api/v2/management/medicine_master/update",
      {
        params: params
      }
    )
    .then((res) => {
      window.sessionStorage.setItem("alert_messages", res.alert_message);
    }).catch((err) => {
     let error_msg = "通信に失敗しました.";
      if (err.response.data) {
        const { error_messages } = err.response.data;
        error_msg = error_messages;
      }              
      window.sessionStorage.setItem("alert_messages", error_msg);
      return false;
    });
}

