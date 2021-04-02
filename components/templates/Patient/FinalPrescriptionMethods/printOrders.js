import * as apiClient from "~/api/apiClient";
export default function(prescription) {

  let path = "/app/api/v2/order/prescription/print";
  apiClient
    .post(path, {
      number: prescription.number
    })
    .then((res) => {
        if(res.alert_message) {
            window.sessionStorage.setItem("alert_messages", res.alert_message);
        }          
    })
    .catch(() => {
    });    
  return true;    
}

