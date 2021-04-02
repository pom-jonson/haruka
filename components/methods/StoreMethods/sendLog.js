import * as apiClient from "~/api/apiClient";
import auth from "~/api/auth";

export default function(_page) {
  if(!auth.isAuthenticated()) return;
  // let page = window.localStorage.getItem("page");
  if(_page == "" || _page == undefined || _page == null ) return;
  let page = _page;
  let operation_log = window.localStorage.getItem("operation_log");
  let postData = {
    page: page,
    operation_log: operation_log
  };
  let path = "/app/api/v2/connection/report";  

  setTimeout(()=>{    
    if(!auth.isAuthenticated()) return;
    apiClient
      .post(path, {
        params: postData
      })
      .then((res) => {
        if(res.alert_message)  {
          alert(res.alert_message + "\n");
        }   
        window.localStorage.removeItem("operation_log");     
      })
      .catch(() => {
        window.sessionStorage.removeItem("isCallingAPI");
      });
        
  }, 10000);

  return false;  
}

