import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, Karte_Steps, Karte_Urls} from "~/helpers/constants";
import * as apiClient from "~/api/apiClient";
import endKarteMode from "~/components/templates/Patient/PrescriptionMethods/endKarteMode";
import * as localApi from "~/helpers/cacheLocal-utils";
export default async function(url) {
  let patient_id  = this.props.match.params.id;
  let path = window.location.href.split("/");
  path = path[path.length - 1];
  if(url == Karte_Urls[Karte_Steps.Patients]) {
    let system_next_page = localApi.getValue('system_next_page');
    if(system_next_page == "karte") {
      this.props.history.replace("/patients/" + patient_id + "/soap");
    } else {
      // end karte mode api
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let params = {
        staff_number: authInfo.user_number,
        patient_id: patient_id
      };
      await endKarteMode(params);
      //update reservation status api
      let diagnosis_comment = {};
      let reservation_info = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RESERVATION_INFO);
      if(reservation_info != null && reservation_info != undefined && reservation_info.schedule_number != undefined){
          let path = "/app/api/v2/reservation/register_schedule";
          let post_data = {
              state: reservation_info.stop ? 10 : 3,
              number:reservation_info.schedule_number,
              doctor_number:authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
          };
          await apiClient
              .post(path, {
                  params: post_data
              })
              .then(() => {
              })
              .catch(() => {

              });
          if(!reservation_info.stop){
              if(reservation_info.diagnosis_comment !== ""){
                  diagnosis_comment = {
                      visit_type: reservation_info.visit_type,
                      diagnosis_type: reservation_info.diagnosis_type,
                      diagnosis_comment: reservation_info.diagnosis_comment,
                      reservation_schedule_number: reservation_info.schedule_number,
                  };
              }
          }

      }
      let visit_info = karteApi.getVal(patient_id, CACHE_LOCALNAMES.VISIT_INFO);
      if(visit_info != null && visit_info != undefined && visit_info.schedule_number != undefined){
          let path = "/app/api/v2/visit/schedule/add_patient";
          let post_data = {
              state: 2,
              number:visit_info.schedule_number,
              doctor_number:authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
          };
          await apiClient
              .post(path, {
                  params: post_data
              })
              .then(() => {
              })
              .catch(() => {

              });
          if(visit_info.diagnosis_comment !== ""){
              diagnosis_comment = {
                  visit_type: visit_info.visit_type,
                  diagnosis_type: visit_info.diagnosis_type,
                  diagnosis_comment: visit_info.diagnosis_comment,
                  visit_treatment_schedule_number: visit_info.schedule_number,
              };
          }

      }
      if(Object.keys(diagnosis_comment).length > 0){
          diagnosis_comment.system_patient_id = patient_id;
          diagnosis_comment.department_code = this.context.department.code == 0 ? 1 : this.context.department.code;
          diagnosis_comment.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
          let path = "/app/api/v2/reservation/register_diagnosis_comment";
          await apiClient
              .post(path, {
                  params: diagnosis_comment
              })
              .then(() => {
              })
              .catch(() => {

              });
      }

      karteApi.delVal(patient_id, CACHE_LOCALNAMES.RESERVATION_INFO);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.VISIT_INFO);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      localApi.remove("current_system_patient_id");
      let system_before_page = localApi.getValue('system_before_page');
      let before_menu_item =  localApi.getObject("select_menu_info");
      if (system_before_page != null && system_before_page != undefined && system_before_page != "") {
        this.props.history.replace(system_before_page);
      } else {
        this.props.history.replace("/patients");
      }
      if (before_menu_item != null && before_menu_item != undefined && before_menu_item.id != null && before_menu_item != undefined ) {
        if (before_menu_item != null && before_menu_item != undefined && before_menu_item.from != null && before_menu_item.from != undefined && before_menu_item.from == "sidebar") {
          // from sidebar menu: don't show navigation menu
          this.context.$selectMenuModal(false);      
        } 
        // else {
        //   // from navigation menu: show navigation menu
        //   this.context.$selectMenuModal(true);
        // }    
      }
    }
  } else if(path != url) {
    this.props.history.replace("/patients/" + patient_id + "/" + url);
  }
}
