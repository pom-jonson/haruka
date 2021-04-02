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
      let postData = {
        number: medicine.number,
        system_patient_id: medicine.patient_id,
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
