import {CACHE_LOCALNAMES} from "~/helpers/constants";
// import * as localApi from "~/helpers/cacheLocal-utils";
import * as patientApi from "~/helpers/cachePatient-utils";
import axios from "axios";

export default async function(patient_id) {
  
  let need_api_call = patientApi.getVal(patient_id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_API);
  if (need_api_call != 1 && this.contraindications_to_disease != undefined && this.contraindications_to_disease != null && this.contraindications_to_disease.length > 0) { // no need call api
    return this.contraindications_to_disease;
  }
  
  const { data } = await axios.get(
    "/app/api/v2/karte/contraindications_to_disease",
    {
      params: {
        patient_id: patient_id
      }
    }
  );

  this.contraindications_to_disease = data;
  patientApi.setVal(patient_id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_API, 0);
  // 病名禁忌
  return data;
}
