import axios from "axios";

export default async function(params) {

  let { data } = await axios.get("/app/api/v2/order/injection/find", {
    params: {
      patient_id: params.id,
      limit: 10,
      offset: this.state.injectionDBHistory.length,
    }
  });

  let injectionHistory = [];
 
  if (data) {
    
    injectionHistory = data.map((item, index) => {
      if (index < 3) {
        item.order_data.class_name = "open";
      } else {
        item.order_data.class_name = "";
      }
      return item;
    });
  }

  window.localStorage.setItem("haruka_cache_injectionHistory", JSON.stringify(injectionHistory));
  this.setState({ injectionHistory, injectionDBHistory: data });

  return data;
}
