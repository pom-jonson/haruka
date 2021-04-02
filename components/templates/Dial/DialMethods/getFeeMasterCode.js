import axios from "axios";
import {makeList_number, makeList_data, extract_enabled} from "~/helpers/dialConstants";

export default async function(category) {
  if (category == "") return [];
  const { data } = await axios.post(
    "/app/api/v2/dial/master/getFeeMasterCode",
    {
      params: {
        category: category,
        order:'name_kana'
      }
    }
  );
  this.setState({
      feeMasterData:data,  
      feeMasterCodeData: makeList_number(data),
      feeMasterCode_option_list:makeList_data(extract_enabled(data))
  });
  return data;
}
