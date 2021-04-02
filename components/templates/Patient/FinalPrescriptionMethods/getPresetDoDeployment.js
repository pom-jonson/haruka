import axios from "axios";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default async function(patient_id, patient_do_get_mode) {
  try {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let path = "/app/api/v2/order/prescription/preset_do_deployment";
    let post_data = {
      system_patient_id:patient_id,
    };
    if(patient_do_get_mode == 1){ //医師別
        post_data.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    }
    let { data } = await axios.post(path, {params: post_data});
    if (data) {
        karteApi.setVal(patient_id, CACHE_LOCALNAMES.PRESET_DO_DEPLOYMENT, JSON.stringify(data));
    }
    return data;
  } catch (e) {
    return null;
  }
}
