import axios from "axios";
// import {makeList_number} from "~/helpers/dialConstants";

export default async function(category) {
  if (category == "") return [];
  const { data } = await axios.post(
    "/app/api/v2/dial/master/getOtherFacilities",
    {
      params: {
        category: category,        
        // order:'name_kana'
      }
    }
  );
  this.setState({
    otherFacilitiesData:data,
    // otherFacilitiesData: makeList_number(data)
  });
  return data;
}
