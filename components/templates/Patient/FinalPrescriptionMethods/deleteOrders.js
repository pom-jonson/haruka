import * as apiClient from "~/api/apiClient";

export default async function(preset_number) { 

const postData = {
  preset_number,
}; 
let path = "/app/api/v2/order/prescription/preset/delete";

apiClient
  .post(path, postData)
  .then((res) => {
    if(res.alert_message)  {
      window.sessionStorage.setItem("alert_messages", res.alert_message + "\n");
    }         
    this.props.history.replace("/preset/prescription");
    this.closeModal();
  })
  .catch(() => {
    // window.sessionStorage.removeItem("isCallingAPI");
    // this.props.history.replace("/preset/prescription");
    this.closeModal();
  });  
}
