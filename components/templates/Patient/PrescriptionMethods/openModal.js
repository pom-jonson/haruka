import { persistedState } from "~/helpers/cache";
import {CACHE_LOCALNAMES, openPacs} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import endKarteMode from "~/components/templates/Patient/PrescriptionMethods/endKarteMode";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as patientApi from "~/helpers/cachePatient-utils";

export default async function(patient_id) {
  let { cacheDelState, cacheState, cacheSoapState, cacheInjectState, cacheDelInjectState,
    cacheDelSoapState, cacheDoneState, cacheDoneInjectState, cacheExamState, cacheDoneExamOrderState, cacheInspectionState,
    cacheTreatState, cacheAllergyState, cacheDelInspectionState, cacheDelTreatState, cacheDelExamState, cacheGuidanceState,
    cacheDelGuidanceState, cacheHomeState, cacheDelHomeState, cacheSpiritState, cacheDelSpiritState, cacheRadiationState,
    cacheDelRadiationState ,cacheDelRehabilyState, cacheRihabilyState, cacheDelAllergyState, cacheReservationState, cacheVisitState,
    cacheDischargePermitState, cacheChangeResponsibilityState, cacheInHospitalState, cacheMealEditState, cacheStopPrescription,
    cacheInHospitalOutState, cacheInHospitalReturnState, cacheMedcineGuidanceState, cacheDelMedcineGuidanceState, cacheNutritionGuidance,
    cacheBacillusState, cacheMedicalExaminationRecord, cacheDischargeDoneState, cacheDischargeDecisionState, cacheHospitalDoneState, cacheMealGroupEditState,
    cacheDocumentCreateState, cacheDelDocumentState, cacheDischargeGuidanceReportState, cacheWardMoveDeleteState, cacheChangeResponsibilityDeleteState,
    cacheInHospitalDeleteState, cacheHospitalDone, cacheDischargeDelete, cacheHospitalGoingDelete, cacheDeathRegister, cacheDeathRegisterDelete,
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
          /*@cc_on _win = window; eval ( 'var window = _win') @*/
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
  if(cacheState == null || cacheState == undefined || Object.keys(cacheState).length == 0){
    nFlagOfCacheState = false;
  }
  if(!karteApi.existVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT)){
    nFlagOfCacheState = false;
  }
  
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
  const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  let params = {
    staff_number: authInfo.user_number,
    patient_id: patient_id
  };

  let nFlagAccepted = false;
  const cacheAcceptedData = karteApi.getVal(patient_id, CACHE_LOCALNAMES.ACCEPT_DATA);

  // get current_insurance_type
  let patientInfo = karteApi.getPatient(patient_id);
  let current_insurance_type = patientInfo != undefined && patientInfo != null && patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0;
  let current_insurance_type_obj = {
    insurance_type: current_insurance_type
  };


  if(cacheAcceptedData == null) {
    nFlagAccepted = false;
  } else if (cacheAcceptedData.accepted_date != "" && cacheAcceptedData.accepted_number > 0 && (cacheAcceptedData.status > 0 && cacheAcceptedData.status < 3 )) {
    nFlagAccepted = true;
  }

  if (
    nFlagAccepted == false &&
    nFlagOfCacheState == false &&
    cacheState == null &&
    cacheDelState == null &&
    cacheDoneState == null &&
    cacheDelInjectState == null &&
    cacheDoneInjectState == null &&
    cacheDoneExamOrderState == null &&
    cacheDoneCytologyExamOrderState == null &&
    cacheDonePathologyExamOrderState == null &&
    cacheDoneBacterialExamOrderState == null &&
    cacheCytologyExamState == null &&
    cachePathologyExamState == null &&
    cacheBacterialExamState == null &&
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
    cacheMealGroupEditState == null &&
    cacheStopPrescription == null &&
    cacheMedcineGuidanceState == null &&
    cacheDelMedcineGuidanceState == null &&
    cacheMedicalExaminationRecord == null &&
    cacheDischargeDoneState == null &&
    cacheDischargeDecisionState == null &&
    cacheHospitalDoneState == null &&
    cacheDocumentCreateState == null && cacheDelDocumentState == null &&
    cacheDischargeGuidanceReportState == null &&
    cacheWardMoveDeleteState == null &&
    cacheChangeResponsibilityDeleteState == null &&
    cacheInHospitalDeleteState == null &&
    cacheHospitalDone == null &&
    cacheDischargeDelete == null &&
    cacheHospitalGoingDelete == null &&
    cacheDeathRegister == null &&
    cacheDeathRegisterDelete == null &&
    cacheBacillusState == null
  ) {
    //check pac on
    let pac_status = patientApi.getVal(patient_id, CACHE_LOCALNAMES.PAC_STATUS);
    if (pac_status !== undefined && pac_status != null && pac_status == "on") {
      openPacs( patient_id, "close");
      patientApi.delVal(patient_id, CACHE_LOCALNAMES.PAC_STATUS);
    }
    // del karte mode api
    await endKarteMode(params);
    let before_menu_item =  localApi.getObject("select_menu_info");
    let system_before_page = karteApi.getPatientBeforePage(patient_id);
    if (system_before_page != null) {
      this.props.history.push(system_before_page);
    } else {
      this.props.history.push("/patients");
    }
    karteApi.delPatient(patient_id);
    localApi.remove("current_system_patient_id");
    if (before_menu_item != null && before_menu_item != undefined && before_menu_item.from != null && before_menu_item.from != undefined && before_menu_item.from == "sidebar") {
      // from sidebar menu: don't show navigation menu
      this.context.$selectMenuModal(false);
    }
  } else {
    this.no_refresh = 1;
    this.setState({
      modalVisible: true
    });
    karteApi.setObjectToCache(patient_id, current_insurance_type_obj);
  }
}
