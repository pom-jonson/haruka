import * as apiClient from "../../../../api/apiClient";

export default async function() {
  let data = await apiClient.get("/app/api/v2/master/point/usage/index"); 
  this.setState({
    usageData: data
  });
  window.localStorage.setItem("haruka_cache_usageData", JSON.stringify(data));
  return data;
}
