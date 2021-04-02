import * as apiClient from "~/api/apiClient";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";

 export default async function(strName, type=null, preset_do_count=null, system_patient_id=null) {
     if(type == null || type == "patient"){
         let registerData = this.modal_obj.registerSetData;
         let postData = {
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
             is_internal_prescription: this.modal_obj.inOut,
             system_patient_id: type == null ? 0 : this.props.match.params.id,
         };

         if (this.state.staff_category !== 1) {
             postData.doctor_name = this.context.selectedDoctor.name;
             postData.doctor_code = this.context.selectedDoctor.code;
             postData.substitute_name = this.state.currentUserName;
         }
         // 処方Do登録
         if(registerData.order_data.preset_do_count != undefined && registerData.order_data.preset_do_count != null) {
             postData.patient_do_id = registerData.order_data.preset_do_count;
         }

         let path = "/app/api/v2/order/prescription/preset/registration";

         await apiClient
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
         if(registerData.order_data.preset_do_count != undefined && registerData.order_data.preset_do_count != null) {
             this.getPresetDoPrescription(this.props.match.params.id, this.context.selectedDoctor.code)
         }
     }
     if(type === "soap") {
         let patientId = system_patient_id != null ? system_patient_id : this.props.patientId;
         let cache_data = karteApi.getSubVal(patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
         let order_data = this.createCacheOrderData(cache_data[0]['presData']);
         let postData = {
             preset_name: strName,
             order_data,
             psychotropic_drugs_much_reason: cache_data[0]['psychotropic_drugs_much_reason'] !== undefined ? cache_data[0]['psychotropic_drugs_much_reason'] : "", //向精神薬多剤投与理由
             poultice_many_reason: cache_data[0]['poultice_many_reason'] !== undefined ? cache_data[0]['poultice_many_reason'] : "", //湿布薬多剤投与理由
             free_comment: Array.isArray(cache_data[0]['free_comment']) ? cache_data[0]['free_comment']: [], //備考
             department_code: this.context.department.code, //this.state.departmentId,
             department: this.context.department.name, //this.state.department,
             is_internal_prescription: cache_data[0]['is_internal_prescription'] !== undefined ? cache_data[0]['is_internal_prescription'] : 0,
             system_patient_id: patientId,
         };

         if (this.state.staff_category !== 1) {
             postData.doctor_name = this.context.selectedDoctor.name;
             postData.doctor_code = this.context.selectedDoctor.code;
             postData.substitute_name = this.state.currentUserName;
         }
         postData.patient_do_id = preset_do_count;

         let path = "/app/api/v2/order/prescription/preset/registration";

         await apiClient
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
         this.getPresetDoPrescription(patientId, this.context.selectedDoctor.code)
     }
     if(type === "soap_patient") {
         let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
         let order_data = this.createCacheOrderData(cache_data[0]['presData']);
         let postData = {
             preset_name: strName,
             order_data,
             psychotropic_drugs_much_reason: cache_data[0]['psychotropic_drugs_much_reason'] !== undefined ? cache_data[0]['psychotropic_drugs_much_reason'] : "", //向精神薬多剤投与理由
             poultice_many_reason: cache_data[0]['poultice_many_reason'] !== undefined ? cache_data[0]['poultice_many_reason'] : "", //湿布薬多剤投与理由
             free_comment: Array.isArray(cache_data[0]['free_comment']) ? cache_data[0]['free_comment']: [], //備考
             department_code: this.context.department.code, //this.state.departmentId,
             department: this.context.department.name, //this.state.department,
             is_internal_prescription: cache_data[0]['is_internal_prescription'] !== undefined ? cache_data[0]['is_internal_prescription'] : 0,
             system_patient_id: this.props.patientId,
         };

         if (this.state.staff_category !== 1) {
             postData.doctor_name = this.context.selectedDoctor.name;
             postData.doctor_code = this.context.selectedDoctor.code;
             postData.substitute_name = this.state.currentUserName;
         }         

         let path = "/app/api/v2/order/prescription/preset/registration";

         await apiClient
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
}

