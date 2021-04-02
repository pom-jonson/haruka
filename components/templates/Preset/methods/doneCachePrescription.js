import axios from "axios";
import { persistedState } from "~/helpers/cache";
// import * as cacheApi from  "~/helpers/cacheLocal-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import { Karte_Steps, Karte_Types } from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default function(patient_id) {
  let { cacheDoneState } = persistedState(patient_id);
  let doned = false;
  if (cacheDoneState) {

    // const cacheMedicineHistory = JSON.parse(
      // window.localStorage.getItem("haruka_cache_medicineHistory")
    // );
    let cacheMedicineHistory = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);

    let medicineHistory = [];
    cacheMedicineHistory.map(item => {
      medicineHistory.push({ ...item });
    });
    
    let doneHistory = [];
    cacheDoneState.map(doneData => {
      medicineHistory.map(med => {
        let medicine = { ...med };
        if (medicine.number == doneData.number) {
          doneHistory.push(medicine);
        }
      });
    });
    doneHistory.map(medicine => {
      // let presData = [];
      // presData.push(medicine);
      // medicine.order_data.order_data = medicine.order_data.order_data.map(
      //   item => {
      //     item.update_mode = "update";
      //     item.med.map(ele=>{

      //       if(ele.contraindication_alert != undefined)
      //         delete ele.contraindication_alert;
            
      //       if(ele.contraindication_reject != undefined)
      //         delete ele.contraindication_reject;

      //       return ele;
      //     });
      //     return item;
      //   }
      // );
      let postData = {
        number: medicine.number,
        system_patient_id: medicine.patient_id,
        // insurance_type: medicine.order_data.insurance_type,
        // body_part: medicine.order_data.body_part,
        // order_data: medicine.order_data.order_data,
        // psychotropic_drugs_much_reason:
        //   medicine.order_data.psychotropic_drugs_much_reason,
        // poultice_many_reason: medicine.order_data.poultice_many_reason,
        // free_comment: medicine.order_data.free_comment,
        // department_code: medicine.order_data.department_code,
        // department: medicine.order_data.department,
        // is_internal_prescription: medicine.order_data.is_internal_prescription,
        // doctor_name: this.context.selectedDoctor.name,
        // doctor_code: this.context.selectedDoctor.code,
        // substitute_name: this.state.currentUserName
      };

      if (medicine.done_order === 2) {
        postData.done_order = 1;
      }
      let path = "/app/api/v2/order/prescription/execute";
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

    this.addMessageSendKarte(Karte_Steps.Prescription, Karte_Types.Delete, "処方の実施を完了しました", 0);
    doned = true;
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
  }

  return doned;
}
