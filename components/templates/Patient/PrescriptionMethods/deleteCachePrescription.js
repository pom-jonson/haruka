import axios from "axios";
import { persistedState } from "../../../../helpers/cache";
// import * as apiClient from "../../../../api/apiClient";
import { Karte_Steps, Karte_Types } from "~/helpers/constants";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default async function(patient_id) {
  let { cacheDelState } = persistedState(patient_id);
  let deleted = false;
  if (cacheDelState) {
    // const cacheMedicineHistory = JSON.parse(
    //   window.localStorage.getItem("haruka_cache_medicineHistory")
    // );
    let cacheMedicineHistory = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    let medicineHistory = [];
    if (cacheMedicineHistory != undefined && cacheMedicineHistory != null && cacheMedicineHistory.length>0){
      cacheMedicineHistory.map(item => {
        medicineHistory.push({ ...item });
      });
    }
    let deletedHistory = [];
    let soap_deletedHistory = [];

    cacheDelState.map(delData => {
      if (delData.delete_type !== undefined && delData.delete_type != null && delData.delete_type == "soap") {
        soap_deletedHistory.push(delData);
      }
      else{
        medicineHistory.map(med => {
          let medicine = {...med};
          if (medicine.number == delData.number) {
            if (delData.order_data != undefined && delData.order_data != null) {
              let order_data = [];
              medicine.order_data.order_data.map(med_order_data => {
                let deleted = false;
                delData.order_data.map(item => {
                  if (item.order_number === med_order_data.order_number) {
                    deleted = true;
                  }
                });
                if (deleted === false) {
                  order_data.push(med_order_data);
                }
              });
              if (order_data.length > 0) {
                medicine.is_enabled = 4; // RP delete
                medicine.order_data.order_data = order_data;
              } else {
                medicine.is_enabled = 3; // all delete
              }
            }
          }
          if (medicine.is_enabled >= 3) {
            deletedHistory.push(medicine);
          }
        });
      }
    });

    let del_arr_api = [];
    deletedHistory.map(medicine => {
      let presData = [];
      presData.push(medicine);
      medicine.order_data.order_data = medicine.order_data.order_data.map(
        item => {
          item.update_mode = "update";
          item.med.map(ele=>{

            if(ele.contraindication_alert != undefined)
              delete ele.contraindication_alert;
            
            if(ele.contraindication_reject != undefined)
              delete ele.contraindication_reject;

            return ele;
          });
          return item;
        }
      );
      let postData = {
        number: medicine.number,
        system_patient_id: medicine.patient_id,
        insurance_type: medicine.order_data.insurance_type,
        body_part: medicine.order_data.body_part,
        order_data: medicine.order_data.order_data,
        psychotropic_drugs_much_reason:
          medicine.order_data.psychotropic_drugs_much_reason,
        poultice_many_reason: medicine.order_data.poultice_many_reason,
        free_comment: medicine.order_data.free_comment,
        department_code: medicine.order_data.department_code,
        department: medicine.order_data.department,
        is_internal_prescription: medicine.order_data.is_internal_prescription,
        doctor_name: this.context.selectedDoctor.name,
        doctor_code: this.context.selectedDoctor.code,
        substitute_name: this.state.currentUserName
      };

      if (medicine.is_enabled === 3) {
        postData.is_enabled = 2;
      }
      del_arr_api.push(postData);
    });
    for (let i = 0; i < del_arr_api.length; i ++) {
      let postData = del_arr_api[i];
      let path = "/app/api/v2/order/prescription/update";
      await axios
          .post(path, {
            params: postData
          })
          .then(() => {
            // this.closeModal();
          })
          .catch(() => {
            // this.closeModal();
          });
    }

    let path_from_soap = "/app/api/v2/order/prescription/delete_from_soap";
    for (let i = 0; i < soap_deletedHistory.length; i ++) {
      let postData = soap_deletedHistory[i];
      postData.doctor_name = this.context.selectedDoctor.name;
      postData.doctor_code = this.context.selectedDoctor.code;
      await axios.post(path_from_soap, {
        params: postData
      })
          .then(() => {
            // this.closeModal();
          })
          .catch(() => {
            // this.closeModal();
          });
    }

    this.addMessageSendKarte(Karte_Steps.Prescription, Karte_Types.Delete, "", 0);
    deleted = true;
    // window.localStorage.removeItem("haruka_delete_cache");
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
  }

  return deleted;
}
