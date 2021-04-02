import * as apiClient from "../../../../api/apiClient";

export default async function() {
if (this.state.doctors !== undefined && this.state.doctors == null && this.state.doctors.length > 0 ) return; 
  let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
  this.setState({ doctors: data });
  return data;
}
