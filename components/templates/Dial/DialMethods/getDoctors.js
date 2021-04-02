import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";

export default async function() {
  let doctors = sessApi.getObjectValue("init_status","doctors_list");
  if (doctors != undefined && doctors.length > 0) {
    let doctor_list_by_number = {};
      Object.keys(doctors).map((key) => {
        doctor_list_by_number[doctors[key].number] = doctors[key].name;
      });
    this.setState({
      doctors: doctors,
      doctor_list_by_number
    });
    return doctors;
  } else {
    await apiClient.post("/app/api/v2/master/dial_doctor/search?order=name_kana")
      .then((res) => {
        let doctor_list_by_number = {};
        if (res != undefined){
            Object.keys(res).map((key) => {
              doctor_list_by_number[res[key].number] = res[key].name;
            });
        }
        this.setState({
          doctors: res,
          doctor_list_by_number
        });
        return res;
      });
  }
}
