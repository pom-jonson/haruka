import { persistedState } from "~/helpers/cache";
import {CACHE_LOCALNAMES, openPacs} from "~/helpers/constants";
// import * as patientCacheApi from "~/helpers/cachePatient-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import endKarteMode from "~/components/templates/Patient/PrescriptionMethods/endKarteMode";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as patientApi from "~/helpers/cachePatient-utils";

export default function(patient_id) {
  let { cacheDelState, cacheState, cacheSoapState, cacheInjectState, cacheDelInjectState,
    cacheDelSoapState, cacheDoneState, cacheDoneInjectState, cacheExamState, cacheDoneExamOrderState, cacheInspectionState,
    cacheTreatState, cacheAllergyState, cacheDelInspectionState, cacheDelTreatState, cacheDelExamState, cacheGuidanceState,
    cacheDelGuidanceState, cacheHomeState, cacheDelHomeState, cacheSpiritState, cacheDelSpiritState, cacheRadiationState,
    cacheDelRadiationState ,cacheDelRehabilyState, cacheRihabilyState, cacheDelAllergyState, cacheReservationState, cacheVisitState,
    cacheDischargePermitState, cacheChangeResponsibilityState, cacheInHospitalState, cacheMealEditState, cacheStopPrescription,
    cacheInHospitalOutState, cacheInHospitalReturnState, cacheMedcineGuidanceState, cacheDelMedcineGuidanceState, cacheNutritionGuidance,
    cacheBacillusState, cacheMedicalExaminationRecord, cacheMealGroupEditState,
    cacheCytologyExamState, cacheDelCytologyExamState, cacheDoneCytologyExamOrderState,
    cachePathologyExamState, cacheDelPathologyExamState, cacheDonePathologyExamOrderState,
    cacheBacterialExamState, cacheDelBacterialExamState, cacheDoneBacterialExamOrderState
  } = persistedState(patient_id);

  let first_karte_data = localApi.getObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA);
  if(first_karte_data != null && first_karte_data !== undefined && first_karte_data[patient_id] !== undefined){
      delete first_karte_data[patient_id];
      localApi.setObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA, first_karte_data);
  }
  // check soap edit data is empty!
  let soap_data = cacheSoapState;
  if(soap_data != null && soap_data != undefined){
    if(soap_data.data != null && soap_data.data != undefined){
      if(soap_data.data.number != undefined && soap_data.data.number != null && soap_data.data.number > 0){
        // edit
        let s_txt = soap_data.data.s_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        let o_txt = soap_data.data.o_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        let a_txt = soap_data.data.a_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        let p_txt = soap_data.data.p_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        let sharp_txt = soap_data.data.sharp_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        if (s_txt == "" &&
        o_txt == "" &&
        a_txt == "" &&
        p_txt == "" &&
        sharp_txt == "") {
          window.sessionStorage.setItem("alert_messages", "プログレスノートは空の状態で保存できません。");
          return;
        }
      } else {
        // insert
        let s_txt = soap_data.data.s_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        let o_txt = soap_data.data.o_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        let a_txt = soap_data.data.a_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        let p_txt = soap_data.data.p_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        let sharp_txt = soap_data.data.sharp_text.replace(/ /g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/g,"").replace(/<p><\/p>/g,"");
        if (s_txt == "" &&
        o_txt == "" &&
        a_txt == "" &&
        p_txt == "" &&
        sharp_txt == "") {
          cacheSoapState = null;
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
        }
      }
    }
  }

  // var isEmpty = true;
  let nFlagOfCacheState = true;
  // cacheState = patientCacheApi.getVal("local", patient_id, CACHE_LOCALNAMES.PATIENT_PRESCRIPTION_EDIT);
  if(cacheState == null || cacheState == undefined || Object.keys(cacheState).length == 0){
    nFlagOfCacheState = false;
  }
  if(!karteApi.existVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT)){
    nFlagOfCacheState = false;
  }

  const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  let params = {
    staff_number: authInfo.user_number,
    patient_id: patient_id
  };
  // if (nFlagOfCacheState == true) {
  //   cacheState[0].presData.map(presData => {
  //     presData.medicines.map(med => {
  //       if (med.medicineName != "") {
  //         isEmpty = false;
  //       }
  //     });
  //   });
  // }

  let nFlagAccepted = false;
  // const cacheAcceptedData = JSON.parse(
  //   window.localStorage.getItem("haruka_acceptedData")
  // );
  const cacheAcceptedData = karteApi.getVal(patient_id, CACHE_LOCALNAMES.ACCEPT_DATA);

  // get current_insurance_type
  /*let patientInfo = karteApi.getPatient(patient_id);
  let current_insurance_type = patientInfo != undefined && patientInfo != null && patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0;
  let current_insurance_type_obj = {
    insurance_type: current_insurance_type
  };*/


  if(cacheAcceptedData == null) {
    nFlagAccepted = false;
  } else if(cacheAcceptedData.accepted_date != "" && cacheAcceptedData.accepted_number > 0
    && (cacheAcceptedData.status > 0 && cacheAcceptedData.status < 3 ) ) {
    nFlagAccepted = true;
  }

  if (
    nFlagAccepted == false &&
    // isEmpty &&
    cacheState == null &&
    cacheDelState == null &&
    cacheDoneState == null &&
    cacheDelInjectState == null &&
    cacheDoneInjectState == null &&
    cacheDoneExamOrderState == null &&
    cacheDoneCytologyExamOrderState == null &&
    cacheDonePathologyExamOrderState == null &&
    cacheDoneBacterialExamOrderState == null &&
    cacheDelSoapState == null &&
    cacheDelInspectionState == null &&
    cacheDelExamState == null &&
    cacheDelCytologyExamState == null &&
    cacheDelPathologyExamState == null &&
    cacheDelBacterialExamState == null &&
    cacheDelTreatState == null &&
    cacheTreatState == null &&
    cacheGuidanceState == null &&
    cacheDelGuidanceState == null &&
    cacheHomeState == null &&
    cacheDelHomeState == null &&
    cacheSpiritState == null &&
    cacheDelSpiritState == null &&
    cacheRihabilyState == null &&
    cacheDelRehabilyState == null &&
    cacheRadiationState == null &&
    cacheDelRadiationState == null &&
    cacheAllergyState == null &&
      cacheDelAllergyState == null &&
    cacheExamState == null &&
    cacheCytologyExamState == null &&
    cachePathologyExamState == null &&
    cacheBacterialExamState == null &&
    (cacheInspectionState == null || (cacheInspectionState != null && cacheInspectionState.length == 0)) &&
    (cacheState == null || Object.keys(cacheState).length == 0) &&
    (cacheSoapState == null || cacheSoapState.isForSave == false) &&
    cacheInjectState == null &&
    cacheReservationState == null &&
    cacheVisitState == null &&
    cacheDischargePermitState == null &&
    cacheChangeResponsibilityState == null &&
    cacheNutritionGuidance == null &&
    cacheInHospitalOutState == null &&
    cacheInHospitalReturnState == null &&
    cacheInHospitalState == null &&
    cacheMealEditState == null &&
    cacheMealGroupEditState == null &&
    cacheStopPrescription == null &&
    cacheMedcineGuidanceState == null &&
    cacheDelMedcineGuidanceState == null &&
    cacheMedicalExaminationRecord == null &&
    cacheBacillusState ==null
  ) {
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.ALLERGY_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.RADIATION_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.TAG_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_DELETE);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACILLUS_EDIT);

    //check pac on 
    let pac_status = patientApi.getVal(patient_id, CACHE_LOCALNAMES.PAC_STATUS);    
    if (pac_status != undefined && pac_status != null && pac_status == "on") {
      openPacs( patient_id, "close");
      patientApi.delVal(patient_id, CACHE_LOCALNAMES.PAC_STATUS);
    }
    localApi.remove("current_system_patient_id");

    // del karte mode api
    endKarteMode(params);
    let system_before_page = localApi.getValue('system_before_page');
    let before_menu_item =  localApi.getObject("select_menu_info");
    if (system_before_page != null && system_before_page != undefined && system_before_page != "") {
      this.props.history.push(system_before_page);
    } else {
      this.props.history.push("/patients");
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

  if (nFlagOfCacheState == true) {
    if (
      nFlagAccepted == false &&
      // cacheState[0].presData.length == 1 &&
      // cacheState[0].presData[0].medicines.length == 1 &&
        cacheState == null &&
      cacheDelState == null &&
      cacheDoneState == null &&
      cacheDelInjectState == null &&
      cacheDoneInjectState == null &&
      cacheDoneExamOrderState == null &&
      cacheDoneCytologyExamOrderState == null &&
      cacheDonePathologyExamOrderState == null &&
      cacheDoneBacterialExamOrderState == null &&
      cacheDelSoapState == null &&
      cacheTreatState == null &&
      cacheDelTreatState == null &&
      cacheGuidanceState == null &&
      cacheDelGuidanceState == null &&
      cacheHomeState == null &&
      cacheDelHomeState == null &&
      cacheSpiritState == null &&
      cacheDelSpiritState == null &&
      cacheRihabilyState == null &&
      cacheDelRehabilyState == null &&
      cacheRadiationState == null &&
      cacheDelRadiationState ==  null &&
      cacheDelInspectionState == null &&
      cacheDelExamState == null &&
      cacheDelCytologyExamState == null &&
      cacheDelPathologyExamState == null &&
      cacheDelBacterialExamState == null &&
      cacheAllergyState == null &&
        cacheDelAllergyState == null &&
      cacheExamState == null &&
      cacheCytologyExamState == null &&
      cachePathologyExamState == null &&
      cacheBacterialExamState == null &&
      (cacheInspectionState == null || (cacheInspectionState != null && cacheInspectionState.length == 0)) &&
      (cacheSoapState == null || cacheSoapState.isForSave == false) &&
      cacheInjectState == null &&
      cacheReservationState == null &&
      cacheVisitState == null &&
      cacheDischargePermitState == null &&
      cacheChangeResponsibilityState == null &&
      cacheNutritionGuidance == null &&
      cacheInHospitalOutState == null &&
      cacheInHospitalReturnState == null &&
      cacheInHospitalState == null &&
      cacheMealEditState == null &&
      cacheMealGroupEditState == null &&
      cacheStopPrescription == null &&
      cacheMedcineGuidanceState == null &&
      cacheDelMedcineGuidanceState == null &&
      cacheMedicalExaminationRecord == null &&
      cacheBacillusState ==null
    ) {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.ALLERGY_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.RADIATION_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.TAG_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_DELETE);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACILLUS_EDIT);

      //check pac on 
      let pac_status = patientApi.getVal(patient_id, CACHE_LOCALNAMES.PAC_STATUS);    
      if (pac_status != undefined && pac_status != null && pac_status == "on") {
        openPacs( patient_id, "close");
        patientApi.delVal(patient_id, CACHE_LOCALNAMES.PAC_STATUS);
      }
      localApi.remove("current_system_patient_id");


      // del karte mode api
      endKarteMode(params);
      let system_before_page = localApi.getValue('system_before_page');
      let before_menu_item =  localApi.getObject("select_menu_info");
      if (system_before_page != null && system_before_page != undefined && system_before_page != "") {
        this.props.history.push(system_before_page);
      } else {
        this.props.history.push("/patients");
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

    } else {
      this.setState({
        modalVisible: true
      });
      // karteApi.setObjectToCache(patient_id, current_insurance_type_obj);
    }
  }else{
    if (
    nFlagAccepted == false &&
      cacheDelState == null &&
      cacheDoneState == null &&
      cacheDoneInjectState == null &&
      cacheDoneExamOrderState == null &&
      cacheDoneCytologyExamOrderState == null &&
      cacheDonePathologyExamOrderState == null &&
      cacheDoneBacterialExamOrderState == null &&
      cacheDelInjectState == null &&
      cacheDelSoapState == null &&
      cacheTreatState == null &&
      cacheDelTreatState == null &&
      cacheGuidanceState == null &&
      cacheDelGuidanceState == null &&
      cacheHomeState == null &&
      cacheDelHomeState == null &&
      cacheSpiritState == null &&
      cacheDelSpiritState == null &&
      cacheRihabilyState == null &&
      cacheDelRehabilyState == null &&
      cacheDelInspectionState == null &&
      cacheDelExamState == null &&
      cacheDelCytologyExamState == null &&
      cacheDelPathologyExamState == null &&
      cacheDelBacterialExamState == null &&
      cacheAllergyState == null &&
        cacheDelAllergyState == null &&
      cacheRadiationState == null &&
      cacheBacillusState == null &&
      cacheDelRadiationState == null &&
      cacheExamState == null &&
      cacheCytologyExamState == null &&
      cachePathologyExamState == null &&
      cacheBacterialExamState == null &&
      (cacheInspectionState == null || (cacheInspectionState != null && (cacheInspectionState).length == 0)) &&
      (cacheSoapState == null || cacheSoapState.isForSave == false) &&
        cacheInjectState == null &&
        cacheReservationState == null &&
        cacheVisitState == null &&
        cacheDischargePermitState == null &&
        cacheChangeResponsibilityState == null &&
        cacheNutritionGuidance == null &&
        cacheInHospitalOutState == null &&
        cacheInHospitalReturnState == null &&
        cacheInHospitalState == null &&
        cacheMealEditState == null &&
        cacheMealGroupEditState == null &&
        cacheDelMedcineGuidanceState == null &&
        cacheMedcineGuidanceState == null &&
        cacheMedicalExaminationRecord == null &&
        cacheStopPrescription == null
    ) {
  
      localApi.remove("current_system_patient_id");
      initCacheData(patient_id);
      let before_menu_item =  localApi.getObject("select_menu_info");
      let system_before_page = localApi.getValue('system_before_page');
      if (system_before_page != null && system_before_page != undefined && system_before_page != "") {
        this.props.history.push(system_before_page);
      } else {
        this.props.history.push("/patients");
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

    } else {
      if (karteApi.existVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT) ||
      karteApi.existVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT) ||
      (cacheExamState != null) ||
      (cacheCytologyExamState != null) ||
      (cachePathologyExamState != null) ||
      (cacheBacterialExamState != null) ||
      (cacheTreatState != null) ||
      (cacheDelTreatState != null)||
      (cacheGuidanceState != null) ||
      (cacheDelGuidanceState != null)||
      (cacheHomeState != null) ||
      (cacheDelHomeState != null)||
      (cacheSpiritState != null) ||
      (cacheDelSpiritState != null)||
      (cacheRihabilyState != null) ||
      (cacheDelRehabilyState != null)||
      (cacheAllergyState != null) ||
      (cacheDelAllergyState != null) ||
      (cacheInspectionState != null) ||
      (cacheDoneState != null) ||
      (cacheDoneExamOrderState != null) ||
      (cacheDoneCytologyExamOrderState != null) ||
      (cacheDonePathologyExamOrderState != null) ||
      (cacheDoneBacterialExamOrderState != null) ||
      (cacheDelState != null) ||
      (cacheDelInjectState != null) ||
      (cacheDoneInjectState != null)||
      (cacheDelSoapState != null)||
      (cacheDelInspectionState != null)||
      (cacheDelExamState != null) ||
      (cacheDelCytologyExamState != null) ||
      (cacheDelPathologyExamState != null) ||
      (cacheDelBacterialExamState != null) ||
      (cacheRadiationState != null) ||
      (cacheDelRadiationState != null) ||
      (cacheReservationState != null) ||
      (cacheVisitState != null) ||
      (cacheDischargePermitState != null) ||
      (cacheChangeResponsibilityState != null) ||
      (cacheNutritionGuidance != null) ||
      (cacheInHospitalOutState != null) ||
      (cacheInHospitalReturnState != null) ||
      (cacheInHospitalState != null) ||
      (cacheMealEditState != null) ||
      (cacheMealGroupEditState != null) ||
      (cacheMedcineGuidanceState != null) ||
      (cacheDelMedcineGuidanceState != null) ||
      (cacheStopPrescription != null) ||
      (cacheMedicalExaminationRecord != null) ||
      (cacheBacillusState != null)
      )  {
        this.setState({
          modalVisible: true
        });
        // karteApi.setObjectToCache(patient_id, current_insurance_type_obj);
      }else{
        localApi.remove("current_system_patient_id");
        initCacheData(patient_id);
        // del karte mode api
        endKarteMode(params);
        let before_menu_item =  localApi.getObject("select_menu_info");
        let system_before_page = localApi.getValue('system_before_page');
        if (system_before_page != null && system_before_page != undefined && system_before_page != "") {
          this.props.history.push(system_before_page);
        } else {
          this.props.history.push("/patients");
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
    }
  }
}

const initCacheData = (patient_id) => {
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
  window.localStorage.removeItem("haruka_cache_usageData");
  window.localStorage.removeItem("haruka_cache_medicineHistory");
  window.localStorage.removeItem("haruka_cache_injectionHistory");
  // soap insert drop index
  window.localStorage.removeItem("soap_insert_drop_number");
   // soap edit drop index
  window.localStorage.removeItem("soap_edit_drop_number");
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
  window.localStorage.removeItem(CACHE_LOCALNAMES.INJECTION_DONE_ORDER);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INSPECTION_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.TREATMENT_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
  window.sessionStorage.removeItem("isForPrescriptionUpdate");
  window.sessionStorage.removeItem("isForInjectionUpdate");
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.RIHABILY_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.ALLERGY_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.ALLERGY_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.RADIATION_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.RADIATION_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_OUT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_RETURN);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.NUTRITION_GUIDANCE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEAL_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACILLUS_EDIT);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD);

  //check pac on 
  let pac_status = patientApi.getVal(patient_id, CACHE_LOCALNAMES.PAC_STATUS);    
  if (pac_status != undefined && pac_status != null && pac_status == "on") {
    openPacs( patient_id, "close");
  }
  patientApi.delVal(patient_id, CACHE_LOCALNAMES.PAC_STATUS);
}
