import axios from "axios";
import * as localApi from "~/helpers/cacheLocal-utils";

export default async function() {
  const { data } = await axios.get(
    "/app/api/v2/disease_name/search_in_patient",
    {
      params: {
        systemPatientId: this.props.match.params.id
      }
    }
  );
  localApi.setObject("current_patient_disease_list", data);
  return data;
}
