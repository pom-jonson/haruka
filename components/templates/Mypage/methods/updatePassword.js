import * as apiClient from "~/api/apiClient";

export default function(postData) {

  let path = "/app/api/v2/user/config/update";  
  apiClient
    .post(path, {
      params: postData
    })
    .then((res) => {
      if(res.alert_message)  {
        this.setState({
          error_msg : "設定を更新しました",
          old_password: "",
          password: "",
          password_confirm:"",
          return_type:"success"
        });
        // this.setState({return_type : "success"});
      }
      
    })
    .catch(() => {
      this.setState({
          error_msg : "パスワードが違います",
          return_type : "fail"
      });
      // this.setState({return_type : "fail"});
    });
      
  return false;  
}

