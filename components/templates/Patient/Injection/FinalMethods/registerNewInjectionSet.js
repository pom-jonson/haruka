import * as apiClient from "~/api/apiClient";

export default function(strName) {
 

      let registerData = this.modal_obj.registerSetData;
      const postData = {
        preset_name: strName,      
        order_data: registerData.order_data.order_data,
        psychotropic_drugs_much_reason: this.modal_obj
          .psychotropic_drugs_much_reason, //向精神薬多剤投与理由
        poultice_many_reason: this.modal_obj.poultice_many_reason, //湿布薬多剤投与理由
        free_comment: Array.isArray(this.modal_obj.free_comment)
          ? this.modal_obj.free_comment
          : [this.modal_obj.free_comment], //備考
        department_code: this.context.department.code, //this.state.departmentId,
        department: this.context.department.name, //this.state.department,
        is_internal_prescription: this.state.inOut,        
      };      

      if (this.state.staff_category !== 1) {
        postData.doctor_name = this.context.selectedDoctor.name;
        postData.doctor_code = this.context.selectedDoctor.code;
        postData.substitute_name = this.state.currentUserName;
      }
      let path = "/app/api/v2/order/injection/preset/registration";

      apiClient
        .post(path, {
          params: postData
        })
        .then((res) => {
          if(res.alert_message)  {
            window.sessionStorage.setItem("alert_messages", res.alert_message);
          }                   
          this.closeModal();
        })
        .catch(() => {
          window.sessionStorage.removeItem("isCallingAPI");
          this.closeModal();
        });     
}

