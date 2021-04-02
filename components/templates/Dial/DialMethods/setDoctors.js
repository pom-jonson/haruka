import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";

export default async function() {
  let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  if (authInfo == undefined || authInfo == null){
    return;
  }
  let state_data = {};
  if (authInfo.doctor_number > 0){
    state_data.directer_name = authInfo.name;
    state_data.instruction_doctor_number = authInfo.doctor_number;
  }
  let init_status = sessApi.getObject("init_status");
  if (init_status !== undefined) {
    let doctors_list = init_status.doctors_list;
    let doctor_list_by_number = {};
    if (doctors_list !== undefined){
      Object.keys(doctors_list).map((key) => {
        doctor_list_by_number[doctors_list[key].number] = doctors_list[key].name;
      });
      state_data.doctors = doctors_list;
      state_data.doctor_list_by_number = doctor_list_by_number;
      this.setState(state_data);
      return doctors_list;
    }
  }
  
  await apiClient.get("/app/api/v2/secure/dial_doctor/search?order=name_kana")
    .then((res) => {
      let doctor_list_by_number = {};
      if (res != undefined){
        Object.keys(res).map((key) => {
          doctor_list_by_number[res[key].number] = res[key].name;
        });
      }
      state_data.doctors = res;
      state_data.doctor_list_by_number = doctor_list_by_number;
      this.setState(state_data);
      return res;
    });
}
