import axios from "axios";

export default async function(doctor_code = 0, department_code = 0, disable_common = 0, editable_only = 0) {
  try {
    const { data } = await axios.get(
      `/app/api/v2/order/injection/preset`,{
        params: {doctor_code: doctor_code, department_code:department_code,  disable_common:disable_common, editable_only:editable_only}
      }
    );
    if (data) {
      let injectionSetData = data.map((item, index) => {
        if (index <= 2) {
          item.class_name = "open";
        } else {
          item.class_name = "";
        }
        return item;
      })
      this.setState(
      {
        injectionSetData : injectionSetData, 
        isLoaded: true,
        stop_prescribe_table_load:false
      });
    }
    
    return data;
  } catch (e) {
    return null;
  }
}
