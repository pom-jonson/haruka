import axios from "axios";

export default async function(params) {  
  let { data } = await axios.post(
      "/app/api/v2/connection/start_karte_mode",
      {
      params: params
  });
  
  // if (data) {
  //   console.log("api - data", data);
  // }

  return data;
}
