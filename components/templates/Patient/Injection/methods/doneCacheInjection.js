import axios from "axios";
import { persistedState } from "~/helpers/cache";
import { Karte_Steps, Karte_Types, CACHE_LOCALNAMES } from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default function(patient_id) {
    let { cacheDoneInjectState } = persistedState(patient_id);
    let doned = false;
    if (cacheDoneInjectState) {
        const cacheInjectionHistory = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);

        let injectionHistory = [];
        cacheInjectionHistory.map(item => {
            injectionHistory.push({ ...item });
        });
        let doneHistory = [];

        cacheDoneInjectState.map(doneData => {
            injectionHistory.map(med => {
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
            let path = "/app/api/v2/order/injection/execute";
            axios.post(path, {params: postData});
        });
        this.addMessageSendKarte(Karte_Steps.Injection, Karte_Types.Delete, "", 0);
        doned = true;
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE);
    }
    return doned;
}
