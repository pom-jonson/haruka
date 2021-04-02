import {CACHE_LOCALNAMES} from "~/helpers/constants";
// import * as localApi from "~/helpers/cacheLocal-utils";
import * as patientApi from "~/helpers/cachePatient-utils";
import axios from "axios";

export default async function() {

  let cache_data = patientApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE);
  if (cache_data != undefined && cache_data != null) return cache_data;

  const { data } = await axios.get(
    "/app/api/v2/karte/contraindications_to_disease",
    {
      params: {
        patient_id: this.props.match.params.id
      }
    }
  );
  patientApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE, JSON.stringify(data));// 病名禁忌
  return data;
}
