import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";

export default async function() {
  let staff_list = sessApi.getObject("staff_list");
  if (staff_list !== undefined && staff_list != null && staff_list.length > 0) {
    let staff_list_by_number = {};
    Object.keys(staff_list).map((key) => {
      staff_list_by_number[staff_list[key].number] = staff_list[key].name;
    });
    this.setState({
      staffs: staff_list,
      staff_list_by_number
    });
    return staff_list;
  } else {
    await apiClient.post("/app/api/v2/dial/staff/search", {params:{order:"name_kana"}})
      .then((res) => {
        let staff_list_by_number = {};
        if (res != undefined){
            Object.keys(res).map((key) => {
              staff_list_by_number[res[key].number] = res[key].name;
            });
        }
        this.setState({
          staffs: res,
          staff_list_by_number
        });
        sessApi.setObject("staff_list", res)
        return res;
      });
    
  }
}
