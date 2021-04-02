import * as apiClient from "../../../../api/apiClient";

export default async function() {
  let data = await apiClient.get("/app/api/v2/master/injection/usages");   

	this.setState({
		usageInjectData: data
	});

  window.localStorage.setItem("haruka_cache_usageInjectData", JSON.stringify(data));
  return data;
}
