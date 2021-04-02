import * as apiClient from "~/api/apiClient";

export default function(_params) {
      // let karte_status = 1;
      // if (this.context.karte_status.name === "訪問診療") {
      //   karte_status = 2;
      // } else if(this.context.karte_status.name === "入院") {
      //   karte_status = 3;
      // }
      
      let postData = {        
      };

      postData.type = _params.type;  
      // 1.stopPeriodAllRp 全未実施中止[Rp単位]          
      if (_params.type == "stopPeriodAllRp") {
        postData.order_number = _params.order_number;
        postData.rp_number = _params.rp_number;
      } else if(_params.type == "stopPeriodAllOrder") {
        postData.order_number = _params.order_number;
      } else if(_params.type == "stopPeriodDoingAllRp") {
        postData.order_number = _params.order_number;
        postData.rp_number = _params.rp_number;
      } else if(_params.type == "stopPeriodDoingAllOrder") {
        postData.order_number = _params.order_number;
      } else if(_params.type == "stopPeriodDoneAllRp") {
        postData.order_number = _params.order_number;
        postData.rp_number = _params.rp_number;
      } else if(_params.type == "stopPeriodDoneAllOrder") {
        postData.order_number = _params.order_number;      
      } else if(_params.type == "SomeDoingCompletedCancel") {
        postData.order_number = _params.order_number;
        postData.rp_number = _params.rp_number;
        postData.complete_cancel_data = _params.complete_cancel_data;
      } else if(_params.type == "SomeDoneCompletedCancel") {
        postData.order_number = _params.order_number;
        postData.rp_number = _params.rp_number;
        postData.complete_cancel_data = _params.complete_cancel_data;      
      } else if(_params.type == "SomeDoingNotDoneStop") {
        postData.order_number = _params.order_number;
        postData.rp_number = _params.rp_number;
        postData.complete_cancel_data = _params.complete_cancel_data;
      }

      // if (type == "stopPeriodRpInjection") {
      //   postData.order_number = params.order_number;
      //   postData.rp_number = params.rp_number;
      // } else if(type == "stopPeriodOrderInjection") {
      //   postData.order_number = params.order_number;
      // }

      // doctor code
      // if (params.depart_id != null && params.depart_label != null) {                        
      //       postData.doctor_code = params.depart_id;
      //       postData.doctor_name = params.depart_label;
      // }      


      // if (this.state.staff_category !== 1 && (postData.doctor_name == undefined || postData.doctor_name == null)) {
      //   postData.doctor_name = this.context.selectedDoctor.name;
      //   postData.doctor_code = this.context.selectedDoctor.code;
      // }
      
      let path = "/app/api/v2/order/injection/period/deleteMenuCategory";

      apiClient
        .post(path, {
          params: postData
        })
        .then((res) => {
            if (res.result == "fail") {
              window.sessionStorage.setItem("alert_messages", "操作に失敗しました。");
            } else {
              let msg = "";
              if (res.alert_messages && res.alert_messages != "") {
                msg = res.alert_messages;
              }
              if (msg != "") {                
                window.sessionStorage.setItem("alert_messages", msg);
                this.refreshNotConsented();
              }
            }
            // if (res.result == "fail") {
            //       window.sessionStorage.setItem("alert_messages", "操作に失敗しました。");
            // } else {
            //       let msg = "";
            //       if (res.result == "stopPeriodOrderInjection" || res.result == "stopPeriodRpInjection") {
            //             msg = "中止を完了しました。";
            //       }
            //       if (msg != "") {                  
            //             window.sessionStorage.setItem("alert_messages", msg);
            //             this.refreshNotConsented();
            //       } else {
            //             window.sessionStorage.setItem("alert_messages", "操作に失敗しました。");
            //       }                                    
            // }
          
        })
        .catch(() => {
          window.sessionStorage.removeItem("isCallingAPI");          
        });     
}

