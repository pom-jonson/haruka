import axios from "axios";

export default async function(params) {  
  let { data } = await axios.post(
      "/app/api/v2/connection/start_karte_mode",
      {
      params: params
  });
  return data;
}
