import axios from "axios";
import {makeList_code, makeList_codeName} from "~/helpers/dialConstants";

export default async function(category) {
  if (category == "") return [];
  const { data } = await axios.post(
    "/app/api/v2/dial/master/getdialyzerCode",
    {
      params: {
        category: category,
        order:'sort_number'
      }
    }
  );
  this.setState({
      dialyzerList:data, 
      dialyzerCodeData: makeList_code(data),
      dialyzer_options_list:makeList_codeName(data, 1),
  });
  return data;
}
