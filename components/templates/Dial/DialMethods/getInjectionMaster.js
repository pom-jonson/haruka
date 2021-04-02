import axios from "axios";
import {makeList_code} from "~/helpers/dialConstants";

export default async function(category) {
  if (category == "") return [];
  const { data } = await axios.post(
    "/app/api/v2/dial/master/getInjectionMaster",
    {
      params: {
        category: category
      }
    }
  );
  this.setState({
      injectionMasterData: data,
      injection_codes:makeList_code(data),
  });
  return data;
}
