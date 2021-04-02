import axios from "axios";

export default async function() {
  try {
    let params = {
      patient_id: this.props.match.params.id,
      get_consent_pending: 1
    };
    const { data } = await axios.get("/app/api/v2/order/prescription/patient", {
      params: params
    });
    return data.length;
  } catch ({ err }) {
    return 0;
  }
}
