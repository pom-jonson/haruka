import axios from "axios";
import { CACHE_LOCALNAMES, KARTEMODE} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default async function() {
  try {
    let patient_data = "";
    if (!karteApi.existPatient(this.props.match.params.id)) { 
      const { data } = await axios.get(
        `/app/api/v2/karte/initial_patient?patientId=${
          this.props.match.params.id
        }`
      );    
      data.karte_mode = KARTEMODE.READ;
      karteApi.setPatient(this.props.match.params.id, JSON.stringify(data));
      localApi.setObject(CACHE_LOCALNAMES.CUR_PATIENT, data);  
      patient_data = data;
    } else {
      patient_data = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      if(patient_data == undefined) {
        patient_data.karte_mode = KARTEMODE.READ;
        karteApi.setPatient(this.props.match.params.id, JSON.stringify(patient_data));
        localApi.setObject(CACHE_LOCALNAMES.CUR_PATIENT, patient_data);  
      }
    }
    localApi.setValue("current_system_patient_id", this.props.match.params.id);
    this.setState({ patientInfo: patient_data });
    return patient_data;
  } catch (e) {
    return null;
  }
}
