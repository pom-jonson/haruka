import * as apiClient from "../../../../api/apiClient";

export default async function() {
  let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
  this.setState({ doctors: data });
  return data;
}
