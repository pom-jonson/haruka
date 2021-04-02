import axios from "axios";

export default async function(params) {
  // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  const { data } = await axios.get("/app/api/v2/soap/find", {
    params: {
      patient_id: params.id,
      limit: 1000,
      offset: 0,
      numbers: params.arrNumbers,      
    }
  });  
  var result = Object.keys(data).map(i=>data[i]);  
  this.setState({
    soapHistoryData: result
    });
  return true;
}
