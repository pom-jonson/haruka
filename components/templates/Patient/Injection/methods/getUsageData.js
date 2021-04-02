import * as apiClient from "~/api/apiClient";

export default async function() {
  let data = await apiClient.get("/app/api/v2/master/point/injection_usage/index"); 
  this.setState({
    usageData: data
  });
  this.modal_obj.injectUsageData = data;
  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
  window.localStorage.setItem("haruka_cache_usageData", JSON.stringify(data));
  return data;
}
