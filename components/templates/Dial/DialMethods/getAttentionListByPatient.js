import axios from "axios";

export default async function(patient_number = "") {
    if (patient_number == "") return;
    const { data } = await axios.post(
    "/app/api/v2/dial/patient/getAttentionList",
      {
        params: {
          patient_number: patient_number
        }
      }
    );
  this.setState({
      attentionList: data
  });
  return data;
}
