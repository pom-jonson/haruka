import axios from "axios";

export default async function(set_flag=true) {
  const { data } = await axios.post(
    "/app/api/v2/dial/master/facility_search",
    {
      params: {        
      }
    }
  );
  if(set_flag){
    this.setState({facilityInfo: data});
  }
  return data;
}
