import axios from "axios";

export default async function(params) {  
  await axios.post(
    "/app/api/v2/connection/end_karte_mode",
    {
    params: params
  });
}
