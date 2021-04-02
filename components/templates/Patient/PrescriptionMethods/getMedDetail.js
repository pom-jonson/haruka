import * as apiClient from "~/api/apiClient";

export default async function(params) {
	await apiClient.get("/app/api/v2/reference/medicines", {
		params: params
	}).then((res) => {
		return res;	  
	});  
}
