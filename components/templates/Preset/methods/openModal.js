import { persistedState } from "~/helpers/cache";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
// import * as patientCacheApi from "~/helpers/cachePatient-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import endKarteMode from "~/components/templates/Patient/PrescriptionMethods/endKarteMode";
import * as localApi from "~/helpers/cacheLocal-utils";

export default function(patient_id) {
  let { cacheDelState, cacheState, cacheSoapState, cacheInjectState, cacheDelInjectState,
    cacheDelSoapState, cacheDoneState, cacheDoneInjectState, cacheExamState, cacheDoneExamOrderState, cacheInspectionState,
    cacheTreatState, cacheAllergyState, cacheDelInspectionState, cacheDelTreatState, cacheDelExamState, cacheGuidanceState,
    cacheDelGuidanceState, cacheHomeState, cacheDelHomeState, cacheSpiritState, cacheDelSpiritState, cacheRadiationState,
    cacheDelRadiationState ,cacheDelRehabilyState, cacheRihabilyState, cacheDelAllergyState, cacheReservationState, cacheVisitState } = persistedState(patient_id);

  // var isEmpty = true;
  let nFlagOfCacheState = true;
  // cacheState = patientCacheApi.getVal("local", patient_id, CACHE_LOCALNAMES.PATIENT_PRESCRIPTION_EDIT);
  if(cacheState == null || undefined == cacheState[0]){
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
    cacheDelSoapState == null &&
    cacheDelInspectionState == null &&
    cacheDelExamState == null &&
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
    (cacheExamState == null || (cacheExamState != null && cacheExamState.examinations.length == 0)) &&
    (cacheInspectionState == null || (cacheInspectionState != null && cacheInspectionState.length == 0)) &&
    (cacheState == null || undefined == cacheState[0] || undefined == cacheState[0].number) &&
    (cacheSoapState == null || cacheSoapState.isForSave == false) &&
    cacheInjectState == null &&
    cacheReservationState == null &&
    cacheVisitState == null
  ) {
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
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
    localApi.remove("current_system_patient_id");

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
      cacheAllergyState == null &&
        cacheDelAllergyState == null &&
      (cacheExamState == null || (cacheExamState != null && cacheExamState.examinations.length == 0)) &&
      (cacheInspectionState == null || (cacheInspectionState != null && cacheInspectionState.length == 0)) &&
      (cacheSoapState == null || cacheSoapState.isForSave == false) &&
      cacheInjectState == null &&
      cacheReservationState == null &&
      cacheVisitState == null
    ) {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
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
      localApi.remove("current_system_patient_id");
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

    } else {
      this.setState({
        modalVisible: true
      });
    }
  }else{
    if (
    nFlagAccepted == false &&
      cacheDelState == null &&
      cacheDoneState == null &&
      cacheDoneInjectState == null &&
      cacheDoneExamOrderState == null &&
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
      cacheAllergyState == null &&
        cacheDelAllergyState == null &&
      cacheRadiationState == null &&
      cacheDelRadiationState == null &&
      (cacheExamState == null || (cacheExamState != null && cacheExamState.examinations.length == 0)) &&
      (cacheInspectionState == null || (cacheInspectionState != null && (cacheInspectionState).length == 0)) &&
      (cacheSoapState == null || cacheSoapState.isForSave == false) &&
        cacheInjectState == null &&
        cacheReservationState == null &&
        cacheVisitState == null
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
      (cacheExamState != null && cacheExamState.examinations.length > 0) ||
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
      (cacheDelState != null) ||
      (cacheDelInjectState != null) ||
      (cacheDoneInjectState != null)||
      (cacheDelSoapState != null)||
      (cacheDelInspectionState != null)||
      (cacheDelExamState != null) ||
      (cacheRadiationState != null) ||
      (cacheDelRadiationState != null) ||
      (cacheReservationState != null) ||
      (cacheVisitState != null)

      )  {
        this.setState({
          modalVisible: true
        });
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
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
  window.localStorage.removeItem(CACHE_LOCALNAMES.INJECTION_DONE_ORDER);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INSPECTION_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.TREATMENT_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_DELETE);
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
  window.sessionStorage.removeItem("isForPrescriptionUpdate");
  window.sessionStorage.removeItem("isForInjectionUpdate");
  karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
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
}
