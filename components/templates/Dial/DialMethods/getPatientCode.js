import axios from "axios";

export default async function(category) {
    if (category == "") return [];
    const { data } = await axios.post(
    "/app/api/v2/dial/patient/getPatientCode",
    {
      params: {
        category: category
      }
    }
  );
  this.setState({
      patientCodeData: data
  });
  return data;
}
