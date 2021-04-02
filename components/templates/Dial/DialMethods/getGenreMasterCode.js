import axios from "axios";

export default async function(category) {
  if (category == "") return [];
  const { data } = await axios.post(
    "/app/api/v2/dial/master/getGenreMasterCode",
    {
      params: {
        category: category, 
        order:'name_kana'
      }
    }
  );
  this.setState({
      genreMasterCode: data
  });
  return data;
}
