const axios = require("axios");

export default async function(number, department_code) {    

  let path = "/app/api/v2/order/set_department";
  let postData = {
    number: number,
    department_code: department_code
  };
  let new_number = 0;
  await axios.post(path, postData)
  .then((response) => {  
      if(response.data.alert_message) {
        window.sessionStorage.setItem("alert_messages", response.data.alert_message + "\n");
          // alert(response.data.alert_message + "\n");
      }
      if(response.data.new_number) {
        new_number = response.data.new_number;
      }
  }).catch(() => {
      //  console.log(error);
  });
  return [new_number, department_code];  
}
