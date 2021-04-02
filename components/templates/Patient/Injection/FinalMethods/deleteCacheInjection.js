import axios from "axios";
import { persistedState } from "~/helpers/cache";
// import * as apiClient from "../../../../api/apiClient";
import { Karte_Steps, Karte_Types } from "~/helpers/constants";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default function(patient_id) {
  let { cacheDelInjectState } = persistedState(patient_id);
  let deleted = false;
  if (cacheDelInjectState) {
    // const cacheInjectionHistory = JSON.parse(
      // window.localStorage.getItem("haruka_cache_injectionHistory")
    // );
    let cacheInjectionHistory = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    let injectionHistory = [];
    if (cacheInjectionHistory != undefined && cacheInjectionHistory != null && cacheInjectionHistory.length>0) {
      cacheInjectionHistory.map(item => {
        injectionHistory.push({...item});
      });
    }
    let deletedHistory = [];
    let soap_deletedHistory = [];

    cacheDelInjectState.map(delData => {
      if (delData.delete_type !== undefined && delData.delete_type != null && delData.delete_type == "soap") {
        soap_deletedHistory.push(delData);
      }
      else {
        injectionHistory.map(med => {
          let inject = {...med};
          if (inject.number == delData.number) {
            if (delData.order_data !== undefined) {
              let order_data = [];
              inject.order_data.order_data.map(med_order_data => {
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
                inject.is_enabled = 4; // RP delete
                inject.order_data.order_data = order_data;
              } else {
                inject.is_enabled = 3; // all delete
              }
            }
          }
          if (inject.is_enabled >= 3) {
            deletedHistory.push(inject);
          }
        });
      }
    });

    deletedHistory.map(inject => {
      let presData = [];
      presData.push(inject);
      inject.order_data.order_data = inject.order_data.order_data.map(
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
        number: inject.number,
        system_patient_id: inject.patient_id,       
        department_code: inject.order_data.department_code,
        order_data: inject.order_data.order_data,
        department: inject.order_data.department,
        free_comment: inject.order_data.free_comment != undefined ? inject.order_data.free_comment : [],
        is_completed: inject.order_data.is_completed,
        doctor_name: this.context.selectedDoctor.name,
        doctor_code: this.context.selectedDoctor.code,
        substitute_name: this.state.currentUserName
      };

      if (inject.is_enabled === 3) {
        postData.is_enabled = 2;
      }

      let path = "/app/api/v2/order/injection/register";
      axios
        .post(path, {
          params: postData
        })
        .then(() => {
          // this.closeModal();
        })
        .catch(() => {
          // this.closeModal();
        });
    });

    soap_deletedHistory.map(item=>{
      let path = "/app/api/v2/order/injection/delete_from_soap";
      axios
          .post(path, {
            params: item
          })
          .then(() => {
          })
          .catch(() => {
          });
    });

    deleted = true;
    this.addMessageSendKarte(Karte_Steps.Injection, Karte_Types.Delete, "", 0);

    // window.localStorage.removeItem("haruka_delete_inject_cache");
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE);
  }

  return deleted;
}
