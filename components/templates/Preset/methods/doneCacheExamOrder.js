import axios from "axios";
import { persistedState } from "~/helpers/cache";
// import * as cacheApi from  "~/helpers/cacheLocal-utils";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import { Karte_Steps, Karte_Types } from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

export default function() {
  let { cacheDoneExamOrderState } = persistedState();
  let doned = false;
  if (cacheDoneExamOrderState) {

    // const cacheMedicineHistory = sessApi.getObject(CACHE_SESSIONNAMES.EXAMORDER_DONE_ORDER);
    
    cacheDoneExamOrderState.map(medicine => {  
      let postData = {
        number: medicine.number,
        system_patient_id: this.props.match.params.id,      
      };      
      postData.done_order = 1;

      let path = "/app/api/v2/order/prescription/execute";
      axios
        .post(path, {
          params: postData
        })
        .then(() => {
        })
        .catch(() => { 
        });
    });

    this.addMessageSendKarte(Karte_Steps.Examination, Karte_Types.Delete, "", 0);
    doned = true;
    sessApi.remove(CACHE_SESSIONNAMES.EXAMORDER_DONE_ORDER);
  }

  return doned;
}
