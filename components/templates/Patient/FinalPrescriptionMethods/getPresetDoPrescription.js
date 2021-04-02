import axios from "axios";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as sessApi from "~/helpers/cacheSession-utils";

export default async function(patient_id, doctor_code = 0) {
  try {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let patient_do_get_mode = initState.patient_do_get_mode;
    const { data } = await axios.get(
      `/app/api/v2/order/prescription/preset_do`,{
        params: {doctor_code: authInfo.staff_category === 1 ? authInfo.doctor_code : doctor_code, system_patient_id: patient_id, patient_do_get_mode:patient_do_get_mode}
      }
    );
    if (data) {
        karteApi.setVal(patient_id, CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION, JSON.stringify(data.do_data));
        karteApi.setVal(patient_id, CACHE_LOCALNAMES.PRESET_DO_DEPLOYMENT, JSON.stringify(data.deploy_data));
    }
    return data;
  } catch (e) {
    return null;
  }
}
