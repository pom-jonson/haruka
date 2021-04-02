import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";

export default async function() {
  let data = sessApi.getDoctorList();
  if(data == null) {
    data = await apiClient.get("/app/api/v2/secure/doctor/search?");
  }
  this.modal_obj.doctors = data;
  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
  this.setState({ doctors: data });
  return data;
}
