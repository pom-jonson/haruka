import axios from "axios";

export default async function(category) {
  if (category == "") return [];
  const { data } = await axios.post(
    "/app/api/v2/dial/master/getDoctorCode",
    {
      params: {
        category: category
      }
    }
  );
  this.setState({
      doctorCodeData: data
  });
  return data;
}
