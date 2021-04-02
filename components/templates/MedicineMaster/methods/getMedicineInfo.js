import axios from "axios";

export default async function() {
  try {
    const { data } = await axios.get(
      "/app/api/v2/management/medicine_master/detail",
      {
        params: {
          haruka_code: this.props.match.params.id
        }
      }
    );
    return data;
  } catch (e) {
    return ;
  }
}

