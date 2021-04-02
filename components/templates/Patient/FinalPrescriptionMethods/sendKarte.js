import * as apiClient from "~/api/apiClient";
import {Karte_Steps, Karte_Types, CACHE_LOCALNAMES} from "~/helpers/constants";
import * as cacheApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {formatDateLine} from "~/helpers/date";

export default async function(patient_id, next_page = "") {
  let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  let existPrescriptionChangedData = true;
  let error = false;
  let patientInfo = karteApi.getPatient(patient_id);
  let patient_insurance_type = patientInfo.insurance_type != undefined ? parseInt(patientInfo.insurance_type) : 0;
  let patient_insurance_name = patientInfo.insurance_type_list.find((x) => x.code == patient_insurance_type) != undefined ?
    patientInfo.insurance_type_list.find((x) => x.code == patient_insurance_type).name : "";
  
  // get prescription cache
  const cacheState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
  let existCacheState = true;
  if(cacheState == null || Object.keys(cacheState) == 0){
    existCacheState = false;
  }
  let _state_presData = [];
  
  // get soap cache
  const cacheSoapState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
  let existCacheSoapState = true;
  if(cacheSoapState == null || cacheSoapState.isForSave == false){
    existCacheSoapState = false;
  }
  
  //get inspection cache
  const cacheInspectionState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT);
  let existCacheInspectionState = true;
  if (cacheInspectionState == null || (cacheInspectionState != null && cacheInspectionState.length == 0)) {
    existCacheInspectionState = false;
  }
  
  //get Treatment cache
  const cacheTreatState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT);
  let existcacheTreatState = true;
  if (cacheTreatState == null ) {
    existcacheTreatState = false;
  }
  
  //get Guidance cache
  const cacheGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT);
  let existcacheGuidanceState = true;
  if (cacheGuidanceState == null ) {
    existcacheGuidanceState = false;
  }
  
  //get DOCUMENT_CREATE cache
  const cacheDocumentCreateState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DOCUMENT_CREATE);
  let existcacheDocumentCreateState = true;
  if (cacheDocumentCreateState == null ) {
    existcacheDocumentCreateState = false;
  }
  // 服薬指導
  const cacheMedicineGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT);
  let existcacheMedicneGuidanceState = true;
  if (cacheMedicineGuidanceState == null ) {
    existcacheMedicneGuidanceState = false;
  }
  
  const cacheDelMedicineGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_DELETE);
  let existDeleteMedicineGuidanceState = true;
  if(cacheDelMedicineGuidanceState == null || undefined == cacheDelMedicineGuidanceState[0]){
    existDeleteMedicineGuidanceState = false;
  }
  
  //get Allergy cache
  const cacheAllergyState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.ALLERGY_EDIT);
  let existcacheAllergyState = true;
  if (cacheAllergyState == null ) {
    existcacheAllergyState = false;
  }
  
  const cacheRadiationState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RADIATION_EDIT);
  let existcacheRadiationState = true;
  if (cacheRadiationState == null ) {
    existcacheRadiationState = false;
  }
  
  // get inject cache
  const cacheInjectState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
  let existCacheInjectState = true;
  if(cacheInjectState == null){
    existCacheInjectState = false;
  }
  if (cacheInjectState != null && cacheInjectState.length == 0) {
    existCacheInjectState = false;
  }
  //get Rihabily cache
  const cacheRehabilyState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT);
  let existcacheRehabilyState = true;
  if (cacheRehabilyState == null ) {
    existcacheRehabilyState = false;
  }
  
  //get DischargePermit cache
  const cacheDischargePermitState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
  let existcacheDischargePermitState = true;
  if (cacheDischargePermitState == null ) {
    existcacheDischargePermitState = false;
  }
  
  //get CHANGE_RESPONSIBILITY cache
  const cacheChangeResponsibilityState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY);
  let existcacheChangeResponsibilityState = true;
  if (cacheChangeResponsibilityState == null ) {
    existcacheChangeResponsibilityState = false;
  }
  
  //get DischargeDoneState cache
  const cacheDischargeDoneState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DONE);
  let existcacheDischargeDoneState = true;
  if (cacheDischargeDoneState == null ) {
    existcacheDischargeDoneState = false;
  }
  
  //get HospitalDoneState cache
  const cacheHospitalDoneState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE);
  let existcacheHospitalDoneState = true;
  if (cacheHospitalDoneState == null ) {
    existcacheHospitalDoneState = false;
  }
  
  //get WardMoveDeleteState cache
  const cacheWardMoveDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.WARD_MOVE_DELETE);
  let existcacheWardMoveDeleteState = false;
  if(cacheWardMoveDeleteState != undefined && cacheWardMoveDeleteState != null && Object.keys(cacheWardMoveDeleteState).length > 0){
    existcacheWardMoveDeleteState = true;
  }
  
  //get HospitalDoneDeleteState cache
  const cacheHospitalDoneDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE);
  let existcacheHospitalDoneDeleteState = false;
  if(cacheHospitalDoneDeleteState != undefined && cacheHospitalDoneDeleteState != null && Object.keys(cacheHospitalDoneDeleteState).length > 0){
    existcacheHospitalDoneDeleteState = true;
  }
  
  //get DischargeDeleteState cache
  const cacheDischargeDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DELETE);
  let existcacheDischargeDeleteState = false;
  if(cacheDischargeDeleteState != undefined && cacheDischargeDeleteState != null && Object.keys(cacheDischargeDeleteState).length > 0){
    existcacheDischargeDeleteState = true;
  }
  
  //get HospitalGoingDeleteState cache
  const cacheHospitalGoingDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE);
  let existcacheHospitalGoingDeleteState = false;
  if(cacheHospitalGoingDeleteState != undefined && cacheHospitalGoingDeleteState != null && Object.keys(cacheHospitalGoingDeleteState).length > 0){
    existcacheHospitalGoingDeleteState = true;
  }
  
  //get WardMoveDeleteState cache
  const cacheChangeResponsibilityDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE);
  let existcacheChangeResponsibilityDeleteState = false;
  if(cacheChangeResponsibilityDeleteState != undefined && cacheChangeResponsibilityDeleteState != null && Object.keys(cacheChangeResponsibilityDeleteState).length > 0){
    existcacheChangeResponsibilityDeleteState = true;
  }
  
  //get InHospitalDeleteState cache
  const cacheInHospitalDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE);
  let existcacheInHospitalDeleteState = false;
  if(cacheInHospitalDeleteState != undefined && cacheInHospitalDeleteState != null && Object.keys(cacheInHospitalDeleteState).length > 0){
    existcacheInHospitalDeleteState = true;
  }
  
  //get DischargeDoneState cache
  const cacheDischargeDecisionState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DECISION);
  let existcacheDischargeDecisionState = true;
  if (cacheDischargeDecisionState == null ) {
    existcacheDischargeDecisionState = false;
  }
  
  //get 退院時指導レポート
  const cacheDischargeGuidanceReportState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT);
  let existcacheDischargeGuidanceReportState = true;
  if (cacheDischargeGuidanceReportState == null ) {
    existcacheDischargeGuidanceReportState = false;
  }
  
  //get NUTRITION_GUIDANCE cache
  const cacheNutritionGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.NUTRITION_GUIDANCE);
  let existcacheNutritionGuidanceState = true;
  if (cacheNutritionGuidanceState == null ) {
    existcacheNutritionGuidanceState = false;
  }
  
  //get MEDICAL_EXAMINATION_RECORD cache
  const cacheMedicalExaminationRecordState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD);
  let existcacheMedicalExaminationRecordState = true;
  if (cacheMedicalExaminationRecordState == null ) {
    existcacheMedicalExaminationRecordState = false;
  }
  
  //get HOSPITAL_OUT cache
  const cacheHospitalOutState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_OUT);
  let existcacheHospitalOutState = true;
  if (cacheHospitalOutState == null ) {
    existcacheHospitalOutState = false;
  }
  
  //get HOSPITAL_OUT cache
  const cacheHospitalReturnState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_RETURN);
  let existcacheHospitalReturnState = true;
  if (cacheHospitalReturnState == null ) {
    existcacheHospitalReturnState = false;
  }
  
  //get IN_HOSPITAL_EDIT cache
  const cacheInHospitalState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
  let existcacheInHospitalState = true;
  if (cacheInHospitalState == null ) {
    existcacheInHospitalState = false;
  }
  
  //get MEAL_EDIT cache
  const cacheMealEditState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEAL_EDIT);
  let existcacheMealEditState = true;
  if (cacheMealEditState == null ) {
    existcacheMealEditState = false;
  }
  
  //get MEAL_GROUP_EDIT cache
  const cacheMealGroupEditState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);
  let existcacheMealGroupEditState = true;
  if (cacheMealGroupEditState == null ) {
    existcacheMealGroupEditState = false;
  }
  
  
  // get medicine history
  const cacheMedicineHistory = JSON.parse(
    window.localStorage.getItem("haruka_cache_medicineHistory")
  );
  
  // ------ prescription delete cache ------------
  const cacheDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
  
  let existDeleteState = true;
  if(cacheDeleteState == null || undefined == cacheDeleteState[0]){
    existDeleteState = false;
  }
  
  // ------ prescription done cache ------------
  const cacheDoneState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
  
  let existDoneState = true;
  if(cacheDoneState == null || undefined == cacheDoneState[0]){
    existDoneState = false;
  }
  
  const cacheDoneInjectState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE);
  
  let existDoneInjectState = true;
  if(cacheDoneInjectState == null || undefined == cacheDoneInjectState[0]){
    existDoneInjectState = false;
  }
  
  // get soap delete
  const cacheDelSoapState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.SOAP_DELETE);
  let existDeleteSoapState = false;
  if(cacheDelSoapState != undefined && cacheDelSoapState != null && Object.keys(cacheDelSoapState).length > 0){
    existDeleteSoapState = true;
  }
  
  // get exam delete
  const cacheDelExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.EXAM_DELETE);
  let existDeleteExamState = false;
  if(cacheDelExamState != undefined && cacheDelExamState != null && Object.keys(cacheDelExamState).length > 0){
    existDeleteExamState = true;
  }
  
  // get inspection delete
  const cacheDelInspectionState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INSPECTION_DELETE);
  let existDeleteInspectionState = false;
  if(cacheDelInspectionState != undefined && cacheDelInspectionState != null && Object.keys(cacheDelInspectionState).length > 0){
    existDeleteInspectionState = true;
  }
  
  // get treat delete
  const cacheDelTreateState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.TREATMENT_DELETE);
  let existDeleteTreatState = false;
  if(cacheDelTreateState != undefined && cacheDelTreateState != null && Object.keys(cacheDelTreateState).length > 0){
    existDeleteTreatState = true;
  }
  
  // get guidance delete
  const cacheDelGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_DELETE);
  let existDeleteGuidanceState = false;
  if(cacheDelGuidanceState != undefined && cacheDelGuidanceState != null && Object.keys(cacheDelGuidanceState).length > 0){
    existDeleteGuidanceState = true;
  }
  
  // get Rehabily delete
  const cacheDelRehabilyState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RIHABILY_DELETE);
  let existDeleteRehabilyState = false;
  if(cacheDelRehabilyState != undefined && cacheDelRehabilyState != null && Object.keys(cacheDelRehabilyState).length > 0){
    existDeleteRehabilyState = true;
  }
  
  // get Radiation delete
  const cacheDelRadiationState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RADIATION_DELETE);
  let existDeleteRadiationState = false;
  if(cacheDelRadiationState != undefined && cacheDelRadiationState != null && Object.keys(cacheDelRadiationState).length > 0){
    existDeleteRadiationState = true;
  }
  
  // get Allergy delete
  const cacheDelAllergyState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.ALLERGY_DELETE);
  let existDeleteAllergyState = false;
  if(cacheDelAllergyState != undefined && cacheDelAllergyState != null && Object.keys(cacheDelAllergyState).length > 0){
    existDeleteAllergyState = true;
  }
  
  //get bacillus cache
  const cacheBacillusState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACILLUS_EDIT);
  let existcacheBacillusState = true;
  if (cacheBacillusState == null ) {
    existcacheBacillusState = false;
  }
  
  // const cacheExamState = sessApi.getObject(CACHE_SESSIONNAMES.PATIENT_EXAM);
  const cacheExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
  let existExamState = true;
  if(cacheExamState == null ){
    existExamState = false;
  }
  
  // ------ examination done cache ------------
  const cacheDoneExamOrderState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
  
  // 中止処方
  const cacheStopPrescriptionState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT);
  let existStopPrescriptionState = true;
  if(cacheStopPrescriptionState == null ){
    existStopPrescriptionState = false;
  } else if (cacheStopPrescriptionState.length == 0) {
    existStopPrescriptionState = false;
  }
  
  let existExamDoneState = true;
  if(cacheDoneExamOrderState == null || undefined == cacheDoneExamOrderState[0]){
    existExamDoneState = false;
  }
  const cacheDelCytologyExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE);
  let existDeleteCytologyExamState = false;
  if(cacheDelCytologyExamState != undefined && cacheDelCytologyExamState != null && Object.keys(cacheDelCytologyExamState).length > 0){
    existDeleteCytologyExamState = true;
  }
  const cacheDelPathologyExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE);
  let existDeletePathologyExamState = false;
  if(cacheDelPathologyExamState != undefined && cacheDelPathologyExamState != null && Object.keys(cacheDelPathologyExamState).length > 0){
    existDeletePathologyExamState = true;
  }
  const cacheDelBacterialExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE);
  let existDeleteBacterialExamState = false;
  if(cacheDelBacterialExamState != undefined && cacheDelBacterialExamState != null && Object.keys(cacheDelBacterialExamState).length > 0){
    existDeleteBacterialExamState = true;
  }
  const cacheCytologyExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
  let existCytologyExamState = true;
  if(cacheCytologyExamState == null ){
    existCytologyExamState = false;
  } else if (cacheCytologyExamState.examinations.length == 0) {
    existCytologyExamState = false;
  }
  const cachePathologyExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
  let existPathologyExamState = true;
  if(cachePathologyExamState == null ){
    existPathologyExamState = false;
  } else if (cachePathologyExamState.examinations.length == 0) {
    existPathologyExamState = false;
  }
  const cacheBacterialExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
  let existBacterialExamState = true;
  if(cacheBacterialExamState == null ){
    existBacterialExamState = false;
  } else if (cacheBacterialExamState.examinations.length == 0) {
    existBacterialExamState = false;
  }
  const cacheDoneCytologyExamOrderState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE);
  let existCytologyExamDoneState = true;
  if(cacheDoneCytologyExamOrderState == null || undefined == cacheDoneCytologyExamOrderState[0]){
    existCytologyExamDoneState = false;
  }
  const cacheDonePathologyExamOrderState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE);
  let existPathologyExamDoneState = true;
  if(cacheDonePathologyExamOrderState == null || undefined == cacheDonePathologyExamOrderState[0]){
    existPathologyExamDoneState = false;
  }
  const cacheDoneBacterialExamOrderState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE);
  let existBacterialExamDoneState = true;
  if(cacheDoneBacterialExamOrderState == null || undefined == cacheDoneBacterialExamOrderState[0]){
    existBacterialExamDoneState = false;
  }
  
  // is_seal_print // 各オーダー別にシール印刷可能なのかのフラグ‘
  let is_seal_print = null;
  
  // 1.check prescription exist
  
  //  [YES] prescription exists
  let step = 0;
  let type = 0;
  let strMessage = "";
  let error_msg = "";
  
  let nFlagAccepted = false;
  const cacheAcceptedData = karteApi.getVal(patient_id, CACHE_LOCALNAMES.ACCEPT_DATA);
  if(cacheAcceptedData != null && cacheAcceptedData.accepted_date != "" && cacheAcceptedData.accepted_number > 0
    && (cacheAcceptedData.status > 0 && cacheAcceptedData.status < 3 ) ) {
    nFlagAccepted = true;
  }
  
  // HospitalDone save
  if (error == false && existcacheHospitalDoneState == true) {
    let path = "/app/api/v2/ward/do/hospitalization";
    cacheHospitalDoneState.karte_status = 3; //入院
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE, 0);
    cacheHospitalDoneState.is_seal_print = is_seal_print == null ? 0: is_seal_print;
    let bed_data = {};
    bed_data[cacheHospitalDoneState.hospital_bed_id] = cacheHospitalDoneState;
    let room_data = {};
    room_data[cacheHospitalDoneState['hospital_room_id']] = bed_data;
    let word_data = {};
    word_data[cacheHospitalDoneState['ward_id']] = room_data;
    let params = {};
    params['data'] = word_data;
    let hospital_done_save_error = false;
    await apiClient
      ._post(path, {
        params: params
      })
      .then((res) => {
        if(res.error_message != undefined){
          let cache_data = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE);
          cache_data['bed_error'] = 1;
          karteApi.setVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE, JSON.stringify(cache_data), 'insert');
          strMessage = "入院先の病床が既に使用されています。別の病床を選択してください。";
          this.addMessageSendKarte(Karte_Steps.Hospital_Bed, Karte_Types.Register, strMessage, 1);//病床重複
          hospital_done_save_error = true;
        } else {
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE);
        }
      })
      .catch(() => {
      });
    if(hospital_done_save_error){
      return false;
    }
  }
  // #3143
  if( nFlagAccepted && next_page != "karte") {
    let path = "/app/api/v2/karte/medical_exam/finish";
    step = Karte_Steps.Patients;
    const post_data = {
      system_patient_id : this.props.match.params.id,
      accepted_date : cacheAcceptedData.accepted_date,
      accepted_department_code : cacheAcceptedData.accepted_department_code,
      accepted_number : cacheAcceptedData.accepted_number
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.ACCEPT_DATA);
        this.addMessageSendKarte(step, type, res.alert_message, 0);
      })
      .catch((err) => {
        error_msg = "通信に失敗しました。";
        error = true;
        if (err.response.data) {
          const { error_messages } = err.response.data;
          error_msg = error_messages;
        }
        this.addMessageSendKarte(step, type, error_msg, 1);
        return false;
      });
  }
  if(error)
    return false;
  if (existCacheState == true) {
    
    if (error == false && this.state.staff_category === 2) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    
    let deleted = await this.deleteCachePrescription(patient_id);
    
    await this.doneCachePrescription();
    
    let arr = [];
    Object.keys(cacheState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let cur_cache_data = cacheState[arr[i]];
      let isForPrescriptionUpdate = cur_cache_data[0].isUpdate != undefined && cur_cache_data[0].isUpdate != null ? cur_cache_data[0].isUpdate : 0;
      step = Karte_Steps.Prescription;
      type = isForPrescriptionUpdate == 1 ? Karte_Types.Update : Karte_Types.Register;
      _state_presData = cur_cache_data[0].presData;
      
      _state_presData.isForPrescriptionUpdate = isForPrescriptionUpdate;
      let orderData = this.createCacheOrderData(_state_presData);
      if(orderData.length === 0){
        strMessage = "RPを入力してください。";
        this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
      
      if (orderData[0] !== undefined && orderData[0].med.length != 0) {
        let isUsageCommentError = false;
        orderData.map(med => {
          if (med.usage_name.toString() === "" && med.med.length != 0) {
            isUsageCommentError = true;
          }
        });
        let karte_status = 1;
        if (cur_cache_data[0].karte_status_name === "訪問診療" || cur_cache_data[0].karte_status_name === "在宅") {
          karte_status = 2;
        } else if(cur_cache_data[0].karte_status_name === "入院") {
          karte_status = 3;
        }
        
        let item_details = cur_cache_data[0].item_details;
        if(item_details != undefined && item_details != null && item_details.length > 0){
          let empty_number = 0;
          item_details.map(item=>{
            if (item.item_id == 0) {
              empty_number ++;
            }
          });
          if (item_details.length == empty_number) {
            item_details = undefined;
          }
        }
        if (item_details !== undefined && item_details.length === 1 && item_details[0].item_id === 0){
          item_details = undefined;
        }
        
        if (!isUsageCommentError) {
          is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, arr[i]);
          const postData = {
            number: isForPrescriptionUpdate == 1 ? cur_cache_data[0].number : undefined,
            system_patient_id: this.props.match.params.id, //HARUKA患者番号
            insurance_type: cur_cache_data[0].insurance_type, //保険情報現状固定
            order_data: orderData,
            psychotropic_drugs_much_reason: cur_cache_data[0]
              .psychotropic_drugs_much_reason, //向精神薬多剤投与理由
            poultice_many_reason: cur_cache_data[0].poultice_many_reason, //湿布薬多剤投与理由
            free_comment: Array.isArray(cur_cache_data[0].free_comment)
              ? cur_cache_data[0].free_comment
              : [cur_cache_data[0].free_comment], //備考
            // department_code: parseInt(this.context.department.code), //this.state.departmentId,
            department_code: parseInt(cur_cache_data[0].department_code), //this.state.departmentId,
            // department: this.context.department.name, //this.state.department,
            department: cur_cache_data[0].department, //this.state.department,
            is_internal_prescription: cur_cache_data[0].is_internal_prescription,
            med_consult: cur_cache_data[0].bulk.med_consult,
            supply_med_info: cur_cache_data[0].bulk.supply_med_info,
            diagnosis_valid: cacheApi.getValue(CACHE_LOCALNAMES.DIAGNOSIS) == null ? 0 : 1,
            additions:cur_cache_data[0].additions,
            item_details,
            karte_status,
            potion: karte_status == 3 ? cur_cache_data[0].potion : undefined,
            hospital_opportunity_disease: karte_status == 3 ? cur_cache_data[0].hospital_opportunity_disease : undefined,
            is_seal_print:  is_seal_print == null ? 0: is_seal_print,
          };
          
          if (this.state.staff_category === 2 || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY)) {
            postData.doctor_name = this.context.selectedDoctor.name;
            postData.doctor_code = this.context.selectedDoctor.code;
            postData.substitute_name = cur_cache_data[0].substitute_name;
          }
          postData.karte_mode = this.context.$getKarteMode(patient_id);
          if (isForPrescriptionUpdate == 1) {
            let editingIndex = -1;
            if (cacheMedicineHistory != null && cacheMedicineHistory != undefined) {
              cacheMedicineHistory.map((item, index) => {
                if (
                  item.order_data.order_data[0].order_number ===
                  postData.order_data[0].order_number
                ) {
                  editingIndex = index;
                }
              });
            }
            let hasChangedData =
              editingIndex === -1
                ? true
                : this.hasChangedData(
                cacheMedicineHistory[editingIndex].order_data,
                postData
                );
            if (hasChangedData === false) {
              
              if (this.state.pacsOn) {
                window.open("http://TFS-C054/01Link/minimizeDV.aspx", "_blank");
                this.PACSOff();
              }
              
              // remove patient id's prescription cache
              karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, arr[i]);
              karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
              karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
              
              existPrescriptionChangedData = false;
            }
          }
          if(existPrescriptionChangedData == true){
            
            let path = isForPrescriptionUpdate == 1
              ? "/app/api/v2/order/prescription/update"
              : "/app/api/v2/order/prescription/register";
            
            await apiClient
              ._post(path, {
                params: postData
              })
              .then(() => {
                this.addMessageSendKarte(step, type, "", 0);
                // this.props.history.replace("/patients");
                // this.closeModal();
                
                // window.localStorage.removeItem("haruka_edit_cache");
                // patientCacheApi.removeByPatientId("local", patient_id, CACHE_LOCALNAMES.PATIENT_PRESCRIPTION_EDIT);
                window.localStorage.removeItem("haruka_cache_usageData");
                window.localStorage.removeItem("haruka_cache_medicineHistory");
                // window.localStorage.removeItem("haruka_delete_cache");
                // window.localStorage.removeItem(CACHE_LOCALNAMES.DONE_ORDER);
                // window.localStorage.removeItem(CACHE_LOCALNAMES.INJECTION_DONE_ORDER);
                // window.localStorage.removeItem("haruka_done_cache");
                window.sessionStorage.removeItem("isForPrescriptionUpdate");
                cacheApi.remove(CACHE_LOCALNAMES.DIAGNOSIS);
                
                karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, arr[i]);
                karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
                karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
              })
              .catch((err) => {
                error_msg = "通信に失敗しました.";
                error = true;
                if (err.response.data) {
                  const { error_messages } = err.response.data;
                  error_msg = error_messages;
                }
                this.addMessageSendKarte(step, type, error_msg, 1);
                // window.sessionStorage.removeItem("isCallingAPI");
                //alert("送信に失敗しました。");
                // this.closeModal();
                
                return false;
              });
            
            // this.resetCacheData();
            // return true;
          }
        } else {
          strMessage = "用法方法を入力して下さい。";
          this.addMessageSendKarte(step, type, strMessage, 1);
          // window.sessionStorage.removeItem("isCallingAPI");
          // alert("用法方法を入力して下さい。");
          // if(path != "prescription"){
          //   this.props.history.replace("/patients/"+this.props.match.params.id+"/prescription");
          // }
          // this.closeModal();
          return false;
        }
      } else {
        if (
          _state_presData.length == 1 &&
          _state_presData[0].medicines.length == 1 &&
          deleted
        ) {
          // 何も入力せず削除した場合はアラートなし
          // this.props.history.replace("/patients");
          // this.closeModal();
          // return true;
        }else{
          strMessage = "用法方法を入力して下さい。";
          this.addMessageSendKarte(step, type, strMessage, 1);
          
          // window.sessionStorage.removeItem("isCallingAPI");
          // alert("用法方法を入力して下さい。");
          // if(path != "prescription"){
          //   this.props.history.replace("/patients/"+this.props.match.params.id+"/prescription");
          // }
          // this.closeModal();
          return false;
        }
      }
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
    
    
    
    // let isForPrescriptionUpdate = cacheState[0].isUpdate != undefined && cacheState[0].isUpdate != null ? cacheState[0].isUpdate : 0;
    // step = Karte_Steps.Prescription;
    // type = isForPrescriptionUpdate == 1 ? Karte_Types.Update : Karte_Types.Register;
    // _state_presData = cacheState[0].presData;
    
    // if (error == false && this.state.staff_category === 2) {
    //     if (this.context.selectedDoctor.code === 0) {
    //         strMessage = "依頼医を選択してください";
    //         this.addMessageSendKarte(step, type, strMessage, 1);
    //         return false;
    //     }
    // }
    
    // _state_presData.isForPrescriptionUpdate = isForPrescriptionUpdate;
    // let orderData = this.createCacheOrderData(_state_presData);
    // if(orderData.length === 0){
    //     strMessage = "RPを入力してください。";
    //     this.addMessageSendKarte(step, type, strMessage, 1);
    //     return false;
    // }
    
    // if (orderData[0] !== undefined && orderData[0].med.length != 0) {
    //     let isUsageCommentError = false;
    //     orderData.map(med => {
    //         if (med.usage_name.toString() === "" && med.med.length != 0) {
    //             isUsageCommentError = true;
    //         }
    //     });
    //     let karte_status = 1;
    //     if (this.context.karte_status.name === "訪問診療") {
    //         karte_status = 2;
    //     } else if(this.context.karte_status.name === "入院") {
    //         karte_status = 3;
    //     }
    
    //     let item_details = cacheState[0].item_details;
    //     if(item_details.length > 0){
    //         let empty_number = 0;
    //         item_details.map(item=>{
    //             if (item.item_id == 0) {
    //                 empty_number ++;
    //             }
    //         });
    //         if (item_details.length == empty_number) {
    //             item_details = undefined;
    //         }
    //     }
    //     if (item_details !== undefined && item_details.length === 1 && item_details[0].item_id === 0){
    //         item_details = undefined;
    //     }
    
    //     if (!isUsageCommentError) {
    //         is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
    //         const postData = {
    //             number: isForPrescriptionUpdate == 1 ? cacheState[0].number : undefined,
    //             system_patient_id: this.props.match.params.id, //HARUKA患者番号
    //             insurance_type: 0, //保険情報現状固定
    //             order_data: orderData,
    //             psychotropic_drugs_much_reason: cacheState[0]
    //                 .psychotropic_drugs_much_reason, //向精神薬多剤投与理由
    //             poultice_many_reason: cacheState[0].poultice_many_reason, //湿布薬多剤投与理由
    //             free_comment: Array.isArray(cacheState[0].free_comment)
    //                 ? cacheState[0].free_comment
    //                 : [cacheState[0].free_comment], //備考
    //             // department_code: parseInt(this.context.department.code), //this.state.departmentId,
    //             department_code: parseInt(cacheState[0].department_code), //this.state.departmentId,
    //             // department: this.context.department.name, //this.state.department,
    //             department: cacheState[0].department, //this.state.department,
    //             is_internal_prescription: cacheState[0].is_internal_prescription,
    //             med_consult: cacheState[0].bulk.med_consult,
    //             supply_med_info: cacheState[0].bulk.supply_med_info,
    //             diagnosis_valid: cacheApi.getValue(CACHE_LOCALNAMES.DIAGNOSIS) == null ? 0 : 1,
    //             additions:cacheState[0].additions,
    //             item_details,
    //             karte_status,
    //             potion: karte_status == 3 ? cacheState[0].potion : undefined,
    //             hospital_opportunity_disease: karte_status == 3 ? cacheState[0].hospital_opportunity_disease : undefined,
    //             is_seal_print:  is_seal_print == null ? 0: is_seal_print,
    //         };
    
    //         if (this.state.staff_category === 2 || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY)) {
    //             postData.doctor_name = this.context.selectedDoctor.name;
    //             postData.doctor_code = this.context.selectedDoctor.code;
    //             postData.substitute_name = cacheState[0].substitute_name;
    //         }
    
    //         if (isForPrescriptionUpdate == 1) {
    //             let editingIndex = -1;
    //             if (cacheMedicineHistory != null && cacheMedicineHistory != undefined) {
    //                 cacheMedicineHistory.map((item, index) => {
    //                     if (
    //                         item.order_data.order_data[0].order_number ===
    //                         postData.order_data[0].order_number
    //                     ) {
    //                         editingIndex = index;
    //                     }
    //                 });
    //             }
    //             let hasChangedData =
    //                 editingIndex === -1
    //                     ? true
    //                     : this.hasChangedData(
    //                     cacheMedicineHistory[editingIndex].order_data,
    //                     postData
    //                     );
    //             if (hasChangedData === false) {
    
    //                 if (this.state.pacsOn) {
    //                     window.open("http://TFS-C054/01Link/minimizeDV.aspx", "_blank");
    //                     this.PACSOff();
    //                 }
    
    //                 // remove patient id's prescription cache
    //                 karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
    //                 karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    //                 karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
    
    //                 existPrescriptionChangedData = false;
    //             }
    //         }
    //         if(existPrescriptionChangedData == true){
    
    //             let path = isForPrescriptionUpdate == 1
    //                 ? "/app/api/v2/order/prescription/update"
    //                 : "/app/api/v2/order/prescription/register";
    
    //             await apiClient
    //                 ._post(path, {
    //                     params: postData
    //                 })
    //                 .then(() => {
    //                     this.addMessageSendKarte(step, type, "", 0);
    //                     // this.props.history.replace("/patients");
    //                     // this.closeModal();
    
    //                     // window.localStorage.removeItem("haruka_edit_cache");
    //                     // patientCacheApi.removeByPatientId("local", patient_id, CACHE_LOCALNAMES.PATIENT_PRESCRIPTION_EDIT);
    //                     window.localStorage.removeItem("haruka_cache_usageData");
    //                     window.localStorage.removeItem("haruka_cache_medicineHistory");
    //                     // window.localStorage.removeItem("haruka_delete_cache");
    //                     // window.localStorage.removeItem(CACHE_LOCALNAMES.DONE_ORDER);
    //                     // window.localStorage.removeItem(CACHE_LOCALNAMES.INJECTION_DONE_ORDER);
    //                     // window.localStorage.removeItem("haruka_done_cache");
    //                     window.sessionStorage.removeItem("isForPrescriptionUpdate");
    //                     cacheApi.remove(CACHE_LOCALNAMES.DIAGNOSIS);
    
    //                     karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
    //                     karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    //                     karteApi.delVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
    //                 })
    //                 .catch((err) => {
    //                     error_msg = "通信に失敗しました.";
    //                     error = true;
    //                     if (err.response.data) {
    //                         const { error_messages } = err.response.data;
    //                         error_msg = error_messages;
    //                     }
    //                     this.addMessageSendKarte(step, type, error_msg, 1);
    //                     // window.sessionStorage.removeItem("isCallingAPI");
    //                     //alert("送信に失敗しました。");
    //                     // this.closeModal();
    
    //                     return false;
    //                 });
    
    //             // this.resetCacheData();
    //             // return true;
    //         }
    //     } else {
    //         strMessage = "用法方法を入力して下さい。";
    //         this.addMessageSendKarte(step, type, strMessage, 1);
    //         // window.sessionStorage.removeItem("isCallingAPI");
    //         // alert("用法方法を入力して下さい。");
    //         // if(path != "prescription"){
    //         //   this.props.history.replace("/patients/"+this.props.match.params.id+"/prescription");
    //         // }
    //         // this.closeModal();
    //         return false;
    //     }
    // } else {
    //     if (
    //         _state_presData.length == 1 &&
    //         _state_presData[0].medicines.length == 1 &&
    //         deleted
    //     ) {
    //         // 何も入力せず削除した場合はアラートなし
    //         // this.props.history.replace("/patients");
    //         // this.closeModal();
    //         // return true;
    //     }else{
    //         strMessage = "用法方法を入力して下さい。";
    //         this.addMessageSendKarte(step, type, strMessage, 1);
    
    //         // window.sessionStorage.removeItem("isCallingAPI");
    //         // alert("用法方法を入力して下さい。");
    //         // if(path != "prescription"){
    //         //   this.props.history.replace("/patients/"+this.props.match.params.id+"/prescription");
    //         // }
    //         // this.closeModal();
    //         return false;
    //     }
    // }
  } else {
    if (existDeleteState){
      await this.deleteCachePrescription(patient_id);
    }
    if(existDoneState)
      await this.doneCachePrescription(patient_id);
  }
  if(error) return false;
  if (error == false && existCacheInjectState == true) {
    error = false;
    
    if (error == false && this.state.staff_category === 2) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
        
        // error = true;
        // alert("依頼医を選択してください");
        // return;
      }
    }
    
    // delete injection
    await this.deleteCacheInjection(patient_id);
    await this.doneCacheInjection(patient_id);
    
    let arr = [];
    Object.keys(cacheInjectState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let cur_cache_data = cacheInjectState[arr[i]];
      step = Karte_Steps.Injection;
      let isForInjectionUpdate = cur_cache_data[0].isUpdate != undefined && cur_cache_data[0].isUpdate != null ? cur_cache_data[0].isUpdate : 0;
      type = isForInjectionUpdate == 1 ? Karte_Types.Update : Karte_Types.Register;
      
      // if (error == false && this.checkCacheInjectionData(cur_cache_data[0].injectData, type) === false) {
      //     // error = true;
      //     return false;
      // }
      
      let item_details = cur_cache_data[0].item_details;
      
      if(item_details.length > 0){
        let empty_number = 0;
        item_details.map(item=>{
          if (item.item_id == 0) {
            empty_number ++;
          }
        });
        if (item_details.length == empty_number) {
          item_details = undefined;
        }
      }
      if (item_details !== undefined && item_details.length === 1 && item_details[0].item_id === 0){
        item_details = undefined;
      } else if(item_details != undefined && item_details.length > 0) {
        let errMessage = "";
        item_details.map(item=>{
          if (item['item_id'] !== 0 && ((item['value1'] === "" || item['value1'] == null))){
            if (item['attribute1'] != null && item['attribute1'] != 0)
              errMessage = item['item_name'] + "を入力してください。";
          }
        });
        if (errMessage !== ""){
          this.addMessageSendKarte(step, type, errMessage, 1);
          return false;
        }
      }
      let _state_injectData = cur_cache_data[0].injectData;
      _state_injectData.isForInjectionUpdate = isForInjectionUpdate;
      const orderData = this.createInjectCacheOrderData(_state_injectData);
      if(orderData.length === 0){
        strMessage = "RPを入力してください。";
        this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
      let karte_status = 1;
      if (cur_cache_data[0].karte_status_name === "訪問診療" || cur_cache_data[0].karte_status_name === "在宅") {
        karte_status = 2;
      } else if(cur_cache_data[0].karte_status_name === "入院") {
        karte_status = 3;
      }
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
      const postData = {
        number: isForInjectionUpdate == 1 ? cur_cache_data[0].number : undefined,
        system_patient_id: this.props.match.params.id, //HARUKA患者番号
        insurance_type: cur_cache_data[0].insurance_type, //保険情報現状固定
        order_data: orderData,
        free_comment: Array.isArray(cur_cache_data[0].free_comment)
          ? cur_cache_data[0].free_comment
          : [cur_cache_data[0].free_comment], //備考
        department_code: parseInt(cur_cache_data[0].department_code), //this.state.departmentId,
        // department: this.context.department.name, //this.state.department,
        department: cur_cache_data[0].department, //this.state.department,
        is_completed: cur_cache_data[0].is_completed,
        additions:cur_cache_data[0].additions,
        item_details,
        karte_status,
        is_seal_print:  is_seal_print == null ? 0: is_seal_print,
        location_id: cur_cache_data[0].location_id,
        location_name: cur_cache_data[0].location_name,
        drip_rate: cur_cache_data[0].drip_rate,
        water_bubble: cur_cache_data[0].water_bubble,
        exchange_cycle: cur_cache_data[0].exchange_cycle,
        require_time: cur_cache_data[0].require_time,
        schedule_date: cur_cache_data[0].is_completed == 1 ? null : formatDateLine(cur_cache_data[0].schedule_date),
      };
      // if (this.state.staff_category === 2 || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY)) {
      if (this.state.staff_category === 2 || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY)) {
        postData.doctor_name = this.context.selectedDoctor.name;
        postData.doctor_code = this.context.selectedDoctor.code;
        // postData.substitute_name = cacheState[0].substitute_name;
      }
      let path = "/app/api/v2/order/injection/register";
      await apiClient
        ._post(path, {
          params: postData
        })
        .then(() => {
          this.addMessageSendKarte(step, type, "", 0);
          // window.localStorage.removeItem("haruka_inject_edit_cache");
          // patientCacheApi.removeByPatientId("local", patient_id, CACHE_LOCALNAMES.PATIENT_INJECTION_EDIT);
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT, arr[i]);
          // window.localStorage.removeItem("haruka_delete_inject_cache");
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE);
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE);
          window.localStorage.removeItem("haruka_cache_injectionHistory");
          window.sessionStorage.removeItem("isForInjectionUpdate");
        })
        .catch(() => {
          error_msg = "通信に失敗しました.";
          error = true;
          // if (err.response.data) {
          //     const { error_messages } = err.response.data;
          //     error_msg = error_messages;
          // }
          this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
          
          // window.sessionStorage.removeItem("isCallingAPI");
          // this.closeModal();
          // return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
    
  } else {
    await this.deleteCacheInjection(patient_id);
    if(existDoneInjectState){
      await this.doneCacheInjection(patient_id);
    }
  }
  if(error) return false;
  //  [NO] prescription does not exist
  // 2.check soap exist
  if(error == false && existCacheSoapState == true){
    error = false;
    step = Karte_Steps.Soap;
    type = cacheSoapState.isForUpdate == false ? Karte_Types.Register : Karte_Types.Update;
    
    let karte_status = 1;
    if (this.context.karte_status.name === "訪問診療") {
      karte_status = 2;
    } else if(this.context.karte_status.name === "入院") {
      karte_status = 3;
    }
    
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    let soap = cacheSoapState.data;
    if(cacheSoapState.isForUpdate == false){
      soap.isNew = true;
      soap.system_patient_id = this.props.match.params.id;
    }else{
      soap.isUpdated = true;
      soap.patient_id = this.props.match.params.id;
    }
    if(cacheSoapState.department_code === undefined || cacheSoapState.department_code == null){
      soap.department_code = this.context.department.code;
    } else {
      soap.department_code = cacheSoapState.department_code;
    }
    
    soap.doctor_code = authInfo.doctor_code;
    soap.instruction_doctor_name = authInfo.name;
    if (authInfo.doctor_code === 0) {
      soap.doctor_code = this.context.selectedDoctor.code;
      soap.instruction_doctor_name = this.context.selectedDoctor.name;
      soap.is_doctor_consented = 0;
    } else {
      soap.is_doctor_consented = 2;
    }
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
    soap.is_seal_print = is_seal_print == null ? 0: is_seal_print;
    soap.karte_status = karte_status;
    let SoapCategory = karteApi.getVal(patient_id, CACHE_LOCALNAMES.SOAP_CATEGORY);
    soap.soap_category = (SoapCategory != undefined && SoapCategory != null && SoapCategory == "hospital_note") ? "hospital_note" : "soap";
    let path = "/app/api/v2/soap/register";
    
    await apiClient
      ._post(path, {
        params: soap
      })
      .then(() => {
        this.addMessageSendKarte(step, type, "", 0);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_CATEGORY);
        this.setState({ isForUpdate: false });
      })
      .catch((err) => {
        error_msg = "通信に失敗しました.";
        error = true;
        if (err.response.data) {
          const { error_messages } = err.response.data;
          error_msg = error_messages;
        }
        this.addMessageSendKarte(step, type, error_msg, 1);
        return false;
      });
    
    // delete
    // if(existDeleteSoapState){
    //   cacheDelSoapState.map( async (soap) => {
    //     soap.number = soap.target_number;
    //     soap.patient_id = this.props.match.params.id;
    //     let path = "/app/api/v2/soap/register";
    
    //     await apiClient
    //       ._post(path, {
    //         params: soap
    //       })
    //       .then(() => {
    //         this.addMessageSendKarte(step, type, "", 0);
    //         // window.localStorage.removeItem("haruka_delete_soap_cache");
    //         karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_DELETE);
    //       })
    //       .catch(() => {
    //         let error_msg = "通信に失敗しました.";
    //         this.addMessageSendKarte(step, type, error_msg, 1);
    //         return false;
    //       });
    
    //   });
    // }
    
    // this.setState({ isForUpdate: false });
    // this.resetCacheData();
  }
  
  if(existDeleteSoapState) {
    let arr = [];
    Object.keys(cacheDelSoapState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/soap/register";
      let soap = cacheDelSoapState[arr[i]];
      soap.number = soap.target_number;
      soap.patient_id = patient_id;
      soap.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
      soap.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
      await apiClient
        ._post(path, {
          params: soap
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.SOAP_DELETE, arr[i]);
        })
        .catch(() => {
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.SOAP_DELETE);
  }
  
  if(error) return false;
  
  if (existExamState) {
    let path = "/app/api/v2/order/examination/register";
    if (cacheExamState.is_done_edit !== undefined) {
      delete cacheExamState.is_done_edit;
    }
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
    let patientInfo = karteApi.getPatient(patient_id);
    cacheExamState.is_seal_print= is_seal_print == null ? 0: is_seal_print;
    let karte_status = 1;
    if (cacheExamState.karte_status != undefined && cacheExamState.karte_status != null) {
      karte_status = cacheExamState.karte_status;
    }
    cacheExamState.karte_status = karte_status;
    cacheExamState.patientInfo= patientInfo;
    // // get current_insurance_type
    // let patientInfo = karteApi.getPatient(patient_id);
    // let current_insurance_type = patientInfo != undefined && patientInfo != null && patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0;
    // cacheExamState.insurance_type = current_insurance_type;
    
    await apiClient
      ._post(path, {
        params: cacheExamState
      })
      .then(() => {
        this.addMessageSendKarte(step, type, "", 0);
        // sessApi.remove(CACHE_SESSIONNAMES.PATIENT_EXAM);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
      })
      .catch(() => {
        let error_msg = "通信に失敗しました.";
        this.addMessageSendKarte(step, type, error_msg, 1);
        return false;
      });
    
  }
  if (existCytologyExamState) {
    let path = "/app/api/v2/order/examination/register";
    if (cacheCytologyExamState.is_done_edit !== undefined) {
      delete cacheCytologyExamState.is_done_edit;
    }
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
    cacheCytologyExamState.is_seal_print= is_seal_print == null ? 0: is_seal_print;
    let karte_status = 1;
    if (cacheCytologyExamState.karte_status != undefined && cacheCytologyExamState.karte_status != null) {
      karte_status = cacheCytologyExamState.karte_status;
    }
    cacheCytologyExamState.karte_status = karte_status;
    cacheCytologyExamState.patientInfo= patientInfo;
    
    await apiClient
      ._post(path, {
        params: cacheCytologyExamState
      })
      .then(() => {
        this.addMessageSendKarte(step, type, "", 0);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
      })
      .catch(() => {
        let error_msg = "通信に失敗しました.";
        this.addMessageSendKarte(step, type, error_msg, 1);
        return false;
      });
  }
  if (existPathologyExamState) {
    let path = "/app/api/v2/order/examination/register";
    if (cachePathologyExamState.is_done_edit !== undefined) {
      delete cachePathologyExamState.is_done_edit;
    }
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
    cachePathologyExamState.is_seal_print= is_seal_print == null ? 0: is_seal_print;
    let karte_status = 1;
    if (cachePathologyExamState.karte_status != undefined && cachePathologyExamState.karte_status != null) {
      karte_status = cachePathologyExamState.karte_status;
    }
    cachePathologyExamState.karte_status = karte_status;
    cachePathologyExamState.patientInfo= patientInfo;
    
    await apiClient
      ._post(path, {
        params: cachePathologyExamState
      })
      .then(() => {
        this.addMessageSendKarte(step, type, "", 0);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
      })
      .catch(() => {
        let error_msg = "通信に失敗しました.";
        this.addMessageSendKarte(step, type, error_msg, 1);
        return false;
      });
  }
  if (existBacterialExamState) {
    let path = "/app/api/v2/order/examination/register";
    if (cacheBacterialExamState.is_done_edit !== undefined) {
      delete cacheBacterialExamState.is_done_edit;
    }
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
    cacheBacterialExamState.is_seal_print= is_seal_print == null ? 0: is_seal_print;
    let karte_status = 1;
    if (cacheBacterialExamState.karte_status != undefined && cacheBacterialExamState.karte_status != null) {
      karte_status = cacheBacterialExamState.karte_status;
    }
    cacheBacterialExamState.karte_status = karte_status;
    cacheBacterialExamState.patientInfo= patientInfo;
    
    await apiClient
      ._post(path, {
        params: cacheBacterialExamState
      })
      .then(() => {
        this.addMessageSendKarte(step, type, "", 0);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
      })
      .catch(() => {
        let error_msg = "通信に失敗しました.";
        this.addMessageSendKarte(step, type, error_msg, 1);
        return false;
      });
  }
  
  //exam delete
  if(existDeleteExamState) {
    let arr = [];
    Object.keys(cacheDelExamState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/examination/delete";
      let exam = cacheDelExamState[arr[i]];
      let post_data = {
        number:exam['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.EXAM_DELETE, arr[i]);
        })
        .catch(() => {
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_DELETE);
  }
  
  if(existDeleteCytologyExamState) {
    let arr = [];
    Object.keys(cacheDelCytologyExamState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/examination/delete";
      let exam = cacheDelCytologyExamState[arr[i]];
      let post_data = {
        number:exam['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE, arr[i]);
        })
        .catch(() => {
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE);
  }
  if(existDeletePathologyExamState) {
    let arr = [];
    Object.keys(cacheDelPathologyExamState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/examination/delete";
      let exam = cacheDelPathologyExamState[arr[i]];
      let post_data = {
        number:exam['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE, arr[i]);
        })
        .catch(() => {
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE);
  }
  if(existDeleteBacterialExamState) {
    let arr = [];
    Object.keys(cacheDelBacterialExamState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/examination/delete";
      let exam = cacheDelBacterialExamState[arr[i]];
      let post_data = {
        number:exam['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE, arr[i]);
        })
        .catch(() => {
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE);
  }
  
  //検体検査 実施
  if (existExamDoneState) {
    cacheDoneExamOrderState.map( async (exam) => {
      let path = "/app/api/v2/order/orderComplete";
      let post_data = {
        type:"examination",
        number:exam.number,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          this.addMessageSendKarte(step, type, "", 0);
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
        })
        .catch(() => {
          let error_msg = "通信に失敗しました.";
          this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
      
    });
  }
  
  if (existCytologyExamDoneState) {
    cacheDoneCytologyExamOrderState.map( async (exam) => {
      let path = "/app/api/v2/order/orderComplete";
      let post_data = {
        type:"examination",
        number:exam.number,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          this.addMessageSendKarte(step, type, "", 0);
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE);
        })
        .catch(() => {
          let error_msg = "通信に失敗しました.";
          this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
      
    });
  }
  if (existPathologyExamDoneState) {
    cacheDonePathologyExamOrderState.map( async (exam) => {
      let path = "/app/api/v2/order/orderComplete";
      let post_data = {
        type:"examination",
        number:exam.number,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          this.addMessageSendKarte(step, type, "", 0);
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE);
        })
        .catch(() => {
          let error_msg = "通信に失敗しました.";
          this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
      
    });
  }
  if (existBacterialExamDoneState) {
    cacheDoneBacterialExamOrderState.map( async (exam) => {
      let path = "/app/api/v2/order/orderComplete";
      let post_data = {
        type:"examination",
        number:exam.number,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          this.addMessageSendKarte(step, type, "", 0);
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE);
        })
        .catch(() => {
          let error_msg = "通信に失敗しました.";
          this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
      
    });
  }
  
  // inspection save
  if (error == false && existCacheInspectionState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        // this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    let arr = [];
    Object.keys(cacheInspectionState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/order/inspection/register";
      let cur_cache_data = cacheInspectionState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      let karte_status = 1;
      // if (this.context.karte_status.name === "訪問診療") {
      if (cur_cache_data.karte_status != undefined && cur_cache_data.karte_status != null) {
        karte_status = cur_cache_data.karte_status;
      }
      cur_cache_data.karte_status= karte_status;
      cur_cache_data.insurance_type= patient_insurance_type;
      cur_cache_data.insurance_name= patient_insurance_name;
      
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT, arr[i]);
          return true;
        })
        .catch((err) => {
          // error_msg = "通信に失敗しました.";
          // error = true;
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    // sessApi.remove(CACHE_SESSIONNAMES.PATIENT_INSPECTION);
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT);
  }
  
  //inspection delete
  if(existDeleteInspectionState) {
    let arr = [];
    Object.keys(cacheDelInspectionState).forEach(function(key){
      arr.push(key);
    });
    let delete_error = false;
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/inspection/delete";
      let inspection = cacheDelInspectionState[arr[i]];
      let post_data = {
        number:inspection['number'],
        karte_number:inspection['karte_number'],
        type:inspection['cache_type'] == "stop" ? 'stop' : 'delete',
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then((res) => {
          if(res.error_message != undefined){
            delete_error = true;
            this.addMessageSendKarte(Karte_Steps.Inspection_Stop, Karte_Types.Delete, res.error_message, 1);
          } else {
            karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.INSPECTION_DELETE, arr[i]);
          }
        })
        .catch(() => {
          return false;
        });
    }
    if(delete_error){
      return false;
    } else {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.INSPECTION_DELETE);
    }
  }
  
  // treatment save
  if (error == false && existcacheTreatState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        // this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    
    let arr = [];
    Object.keys(cacheTreatState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/order/treat/register";
      let cur_cache_data = cacheTreatState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      let karte_status = 1;
      if (cur_cache_data.karte_status != undefined && cur_cache_data.karte_status != null) {
        karte_status = cur_cache_data.karte_status;
      }
      cur_cache_data.karte_status= karte_status;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then((res) => {
          if(res.error_message){
            window.sessionStorage.setItem("alert_messages",res.error_message);
          } else
            karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT, arr[i]);
          // this.addMessageSendKarte(step, type, "", 0);
          // sessApi.remove(CACHE_SESSIONNAMES.PATIENT_INSPECTION);
          return true;
        })
        .catch((err) => {
          // error_msg = "通信に失敗しました.";
          // error = true;
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    // karteApi.delVal(patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT);
  }
  
  //treat delete
  if(existDeleteTreatState) {
    let arr = [];
    Object.keys(cacheDelTreateState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/treat/delete";
      let treat = cacheDelTreateState[arr[i]];
      let post_data = {
        number:treat['header']['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          // this.addMessageSendKarte(step, type, "", 0);
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.TREATMENT_DELETE, arr[i]);
        })
        .catch(() => {
          // let error_msg = "通信に失敗しました.";
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.TREATMENT_DELETE);
  }
  
  // guidance save
  if (error == false && existcacheGuidanceState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        // this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    
    let arr = [];
    Object.keys(cacheGuidanceState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/order/guidance/register";
      let cur_cache_data = cacheGuidanceState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      let karte_status = 1;
      if (cur_cache_data.karte_status != undefined && cur_cache_data.karte_status != null) {
        karte_status = cur_cache_data.karte_status;
      }
      cur_cache_data.karte_status= karte_status;
      cur_cache_data.insurance_type= patient_insurance_type;
      cur_cache_data.insurance_name= patient_insurance_name;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT, arr[i]);
          // this.addMessageSendKarte(step, type, "", 0);
          return true;
        })
        .catch((err) => {
          // error_msg = "通信に失敗しました.";
          // error = true;
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT);
  }
  
  //guidance delete
  if(existDeleteGuidanceState) {
    let arr = [];
    Object.keys(cacheDelGuidanceState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/guidance/delete";
      let guidance = cacheDelGuidanceState[arr[i]];
      let post_data = {
        number:guidance['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          // this.addMessageSendKarte(step, type, "", 0);
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_DELETE, arr[i]);
        })
        .catch(() => {
          // let error_msg = "通信に失敗しました.";
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_DELETE);
  }
  
  // medicine guidance save 服薬指導
  if (error == false && existcacheMedicneGuidanceState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        return false;
      }
    }
    
    let arr = [];
    Object.keys(cacheMedicineGuidanceState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/order/medicine_guidance/register";
      let cur_cache_data = cacheMedicineGuidanceState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      let karte_status = 3;
      cur_cache_data.karte_status= karte_status;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, arr[i]);
          return true;
        })
        .catch((err) => {
          if (err.response.data) {
            // error_msg = error_messages;
          }
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT);
  }
  //guidance delete
  if(existDeleteMedicineGuidanceState) {
    cacheDelMedicineGuidanceState.map( async (guidance) => {
      let path = "/app/api/v2/order/medicine_guidance/delete";
      let post_data = {
        number:guidance.target_number,
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_DELETE);
        })
        .catch(() => {
          return false;
        });
      
    });
  }
  
  // Rehabily save
  if (error == false && existcacheRehabilyState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        // this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    
    let arr = [];
    Object.keys(cacheRehabilyState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/order/rehabily/register";
      let cur_cache_data = cacheRehabilyState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      let karte_status = 1;
      if (cur_cache_data.karte_status != undefined && cur_cache_data.karte_status != null) {
        karte_status = cur_cache_data.karte_status;
      }
      cur_cache_data.karte_status= karte_status;
      cur_cache_data.insurance_type= patient_insurance_type;
      cur_cache_data.insurance_name= patient_insurance_name;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT, arr[i]);
          return true;
        })
        .catch((err) => {
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT);
  }
  
  // Rehabily delete
  if(existDeleteRehabilyState) {
    let arr = [];
    Object.keys(cacheDelRehabilyState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/rehabily/delete";
      let rehabily = cacheDelRehabilyState[arr[i]];
      let post_data = {
        number:rehabily['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          // this.addMessageSendKarte(step, type, "", 0);
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.RIHABILY_DELETE, arr[i]);
        })
        .catch(() => {
          // let error_msg = "通信に失敗しました.";
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.RIHABILY_DELETE);
  }
  
  // allergy save
  if (error == false && existcacheAllergyState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        // this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    
    let arr = [];
    Object.keys(cacheAllergyState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let cur_cache_data = cacheAllergyState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.ALLERGY_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      let karte_status = 1;
      if (cur_cache_data.karte_status != undefined && cur_cache_data.karte_status != null) {
        karte_status = cur_cache_data.karte_status;
      }
      cur_cache_data.karte_status= karte_status;
      let path = "/app/api/v2/order/hospital/allergy/register";
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.ALLERGY_EDIT, arr[i]);
          return true;
        })
        .catch((err) => {
          if (err.response.data) {
            //
          }
          return false;
        });
      
    }
    // karteApi.delVal(patient_id, CACHE_LOCALNAMES.ALLERGY_EDIT);
  }
  
  // allergy delete
  if(existDeleteAllergyState) {
    let arr = [];
    Object.keys(cacheDelAllergyState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/hospital/allergy/delete";
      let allergy = cacheDelAllergyState[arr[i]];
      let post_data = {
        number:allergy['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.ALLERGY_DELETE, arr[i]);
        })
        .catch(() => {
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.ALLERGY_DELETE);
  }
  
  // radiation save
  if (error == false && existcacheRadiationState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        return false;
      }
    }
    let arr = [];
    Object.keys(cacheRadiationState).forEach(function(key){
      arr.push(key);
    });
    let patientInfo = karteApi.getPatient(patient_id);
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/order/radiation/registerOrder";
      let cur_cache_data = cacheRadiationState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.RADIATION_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      let karte_status = 1;
      if (cur_cache_data.karte_status != undefined && cur_cache_data.karte_status != null) {
        karte_status = cur_cache_data.karte_status;
      }
      cur_cache_data.karte_status= karte_status;
      cur_cache_data.patientInfo= patientInfo;
      cur_cache_data.insurance_type= patient_insurance_type;
      cur_cache_data.insurance_name= patient_insurance_name;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.RADIATION_EDIT, arr[i]);
          return true;
        })
        .catch((err) => {
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.RADIATION_EDIT);
  }
  
  //radiation delete
  if(existDeleteRadiationState) {
    let arr = [];
    Object.keys(cacheDelRadiationState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i++) {
      let path = "/app/api/v2/order/radiation/deleteOrder";
      let type = 'order';
      let radiation = cacheDelRadiationState[arr[i]];
      let post_data = {
        type,
        number:radiation['number'],
        doctor_code : authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        doctor_name : authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then(() => {
          // this.addMessageSendKarte(step, type, "", 0);
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.RADIATION_DELETE, arr[i]);
        })
        .catch(() => {
          // let error_msg = "通信に失敗しました.";
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.RADIATION_DELETE);
  }
  
  // DischargePermit save
  if (error == false && existcacheDischargePermitState == true) {
    let path = "/app/api/v2/in_out_hospital/add_out_hospital_date/register";
    cacheDischargePermitState.karte_status = 3; //入院
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_PERMIT, 0);
    cacheDischargePermitState.is_seal_print = is_seal_print == null ? 0: is_seal_print;
    let discharge_permit_error = false;
    await apiClient
      ._post(path, {
        params: cacheDischargePermitState
      })
      .then((res) => {
        if(res.error_message != undefined){
          this.addMessageSendKarte(Karte_Steps.Discharge_Permit, Karte_Types.Register, res.error_message, 1);
          discharge_permit_error = true;
        } else {
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
        }
      })
      .catch(() => {
        return false;
      });
    if(discharge_permit_error){
      return false;
    }
  }
  
  // CHANGE_RESPONSIBILITY save
  if (error == false && existcacheChangeResponsibilityState == true) {
    let path = "/app/api/v2/ward/save/change_responsibility_info";
    cacheChangeResponsibilityState.karte_status = 3; //入院
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY, 0);
    cacheChangeResponsibilityState.is_seal_print = is_seal_print == null ? 0: is_seal_print;
    
    await apiClient
      ._post(path, {
        params: cacheChangeResponsibilityState
      })
      .then(() => {
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY);
      })
      .catch(() => {
        return false;
      });
  }
  
  // HOSPITAL_OUT HOSPITAL_RETURN save
  if (error == false && (existcacheHospitalOutState == true || existcacheHospitalReturnState == true)) {
    let path = "/app/api/v2/ward/save/out_return_hospital_info";
    let params = {};
    if(cacheHospitalOutState != null){
      cacheHospitalOutState.karte_status = 3; //入院
      params.hospital_out = cacheHospitalOutState;
    }
    if(cacheHospitalReturnState != null){
      cacheHospitalReturnState.karte_status = 3; //入院
      params.hospital_return = cacheHospitalReturnState;
    }
    await apiClient
      ._post(path, {
        params
      })
      .then(() => {
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_OUT);
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_RETURN);
      })
      .catch(() => {
        return false;
      });
  }
  
  // Meal_Edit save
  if (error == false && existcacheMealEditState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        // this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    let arr = [];
    Object.keys(cacheMealEditState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/meal/save/meal_info";
      let cur_cache_data = cacheMealEditState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.MEAL_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      cur_cache_data.karte_status= 3;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.MEAL_EDIT, arr[i]);
          return true;
        })
        .catch((err) => {
          // error_msg = "通信に失敗しました.";
          // error = true;
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEAL_EDIT);
  }
  
  // Meal_Group_Edit save
  if (error == false && existcacheMealGroupEditState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        // this.addMessageSendKarte(step, type, strMessage, 1);
        return false;
      }
    }
    let arr = [];
    Object.keys(cacheMealGroupEditState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/meal/save/meal_info_second";
      let cur_cache_data = cacheMealGroupEditState[arr[i]];
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.MEAL_GROUP_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      cur_cache_data.karte_status= 3;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.MEAL_GROUP_EDIT, arr[i]);
          return true;
        })
        .catch((err) => {
          // error_msg = "通信に失敗しました.";
          // error = true;
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          // this.addMessageSendKarte(step, type, error_msg, 1);
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);
  }
  
  // IN_HOSPITAL_EDIT save
  if (error == false && existcacheInHospitalState == true) {
    let path = "/app/api/v2/hospitalization/register";
    cacheInHospitalState.karte_status = 3; //入院
    is_seal_print = karteApi.getSealSubVal(patient_id, cacheInHospitalState.hospital_type == "in_decision" ? "hospital_decision" : "hospital_application", 0);
    cacheInHospitalState.is_seal_print= is_seal_print == null ? 0: is_seal_print;
    
    let in_hospital_error = false;
    await apiClient
      ._post(path, {
        params: cacheInHospitalState
      })
      .then((res) => {
        if(res.error_message == undefined){
          if(cacheInHospitalState.hospital_type == "in_decision"){
            let patientInfo = karteApi.getPatient(patient_id);
            patientInfo.is_hospital = 1;
            karteApi.setPatient(patient_id, JSON.stringify(patientInfo));
            this.context.$updateKarteStatus(1, "入院", patient_id);
          }
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
        } else {
          this.addMessageSendKarte(Karte_Steps.Hospital_In, Karte_Types.Register, res.error_message, 1); //入院申込・入院決定
          in_hospital_error = true;
        }
      })
      .catch(() => {
        return false;
      });
    if(in_hospital_error){
      return false;
    }
  }
  
  // 中止処方
  if (existStopPrescriptionState) {
    
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // this.confirmCancel();
    // var stopped_rps = this.state.stopped_rps;
    // stopped_rps = stopped_rps.filter(x=>x.stop_flag ==1);
    // var stopped_params = [];
    // stopped_rps.map(item => {
    //   stopped_params.push(
    //     {order_number:item.order_number, stop_date:item.stop_date, stop_flag:item.stop_flag}
    //   )
    // })
    // await apiClient.post("/app/api/v2/order/prescription/registerStoppedRp", {
    //   params: {
    //     stopped_params:stopped_params,
    //     stop_comment:this.state.stop_comment,
    //     doctor_code:authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
    //   }
    // }).then(() => {
    //   window.sessionStorage.setItem("alert_messages","中止処方オーダを登録しました。");
    //   this.props.closeModal();
    // });
    
    let path = "/app/api/v2/order/prescription/registerStoppedRp";
    
    let post_params = {
      stopped_params:cacheStopPrescriptionState.stopped_params,
      stop_comment:cacheStopPrescriptionState.free_comment,
      doctor_code:cacheStopPrescriptionState.doctor_code,
    };
    
    await apiClient
      ._post(path, {
        params: post_params
      })
      .then(() => {
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT);
      })
      .catch(() => {
        return false;
      });
    
  }
  
  // NUTRITION_GUIDANCE save
  if (error == false && existcacheNutritionGuidanceState == true) {
    let path = "/app/api/v2/nutrition_guidance/save_request_data";
    cacheNutritionGuidanceState.karte_status = 3; //入院
    is_seal_print = karteApi.getSealSubVal(patient_id, "guidance_nutrition_order", 0);
    cacheNutritionGuidanceState.is_seal_print = is_seal_print == null ? 0: is_seal_print;
    
    await apiClient
      ._post(path, {
        params: cacheNutritionGuidanceState
      })
      .then(() => {
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.NUTRITION_GUIDANCE);
      })
      .catch(() => {
        return false;
      });
  }
  
  // medical_examination_record save
  if (error == false && existcacheMedicalExaminationRecordState == true) {
    let path = "/app/api/v2/secure/order/medical_examination_record/register";
    let karte_status = 1;
    if (this.context.karte_status.name === "訪問診療") {
      karte_status = 2;
    } else if(this.context.karte_status.name === "入院") {
      karte_status = 3;
    }
    cacheMedicalExaminationRecordState.karte_status = karte_status;
    
    await apiClient
      ._post(path, {
        params: cacheMedicalExaminationRecordState
      })
      .then(() => {
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD);
      })
      .catch(() => {
        return false;
      });
  }
  
  // 選択中の患者削除
  /*let patientsList = this.context.patientsList;
  let arrPatientsList = patientsList.filter(item=>{
      if (item.system_patient_id != patient_id) {
          return item;
      }
  });
  this.context.$updatePatientsList(arrPatientsList);*/
  
  // this.props.history.replace("/patients");
  // window.sessionStorage.removeItem("isCallingAPI");
  // this.closeModal();
  
  // bacillus save
  if (error == false && existcacheBacillusState == true ){
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        return false;
      }
    }
    let arr = [];
    Object.keys(cacheBacillusState).forEach(function(key){
      arr.push(key);
    });
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/order/bacillus/registerOrder";
      let cur_cache_data = cacheBacillusState[arr[i]];
      cur_cache_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.BACILLUS_EDIT, arr[i]);
      cur_cache_data.is_seal_print= is_seal_print == null ? 0: is_seal_print;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.BACILLUS_EDIT, arr[i]);
          return true;
        })
        .catch((err) => {
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          return false;
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.BACILLUS_EDIT);
  }
  
  // DischargeDone save
  if (error == false && existcacheDischargeDoneState == true) {
    let path = "/app/api/v2/ward/do/discharge";
    cacheDischargeDoneState.karte_status = 3; //入院
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DONE, 0);
    cacheDischargeDoneState.is_seal_print = is_seal_print == null ? 0: is_seal_print;
    let discharge_ddone_error = false; //退院実施
    await apiClient
      ._post(path, {
        params: cacheDischargeDoneState
      })
      .then((res) => {
        if(res.error_message != undefined){
          this.addMessageSendKarte(Karte_Steps.Discharge_Done, Karte_Types.Register, res.error_message, 1);
          discharge_ddone_error = true;
        } else {
          let patientInfo = karteApi.getPatient(patient_id);
          if (res.is_death != undefined && res.is_death == 1) { //死亡
            patientInfo.is_death = 1;
          }
          patientInfo.is_hospital = 0;
          karteApi.setPatient(patient_id, JSON.stringify(patientInfo));
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DONE);
          this.context.$updateKarteStatus(0, "外来", patient_id);
        }
      })
      .catch(() => {
        return false;
      });
    if(discharge_ddone_error){ return false;}
  }
  
  if (error == false && existcacheDischargeDecisionState == true) {
    let path = "/app/api/v2/ward/discharge_decision/hospital";
    cacheDischargeDecisionState.karte_status = 3; //入院
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DECISION, 0);
    cacheDischargeDecisionState.is_seal_print = is_seal_print == null ? 0: is_seal_print;
    let discharge_decision_error = false;
    await apiClient
      ._post(path, {
        params: cacheDischargeDecisionState
      })
      .then((res) => {
        if(res.error_message != undefined){
          this.addMessageSendKarte(Karte_Steps.Discharge_Decision, Karte_Types.Register, res.error_message, 1);
          discharge_decision_error = true;
        } else {
          karteApi.delVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DECISION);
        }
      })
      .catch(() => {
        return false;
      });
    if(discharge_decision_error){ return false;}
  }
  
  // DocumentCreate save
  if (error == false && existcacheDocumentCreateState == true ){
    if (authInfo.doctor_code === 0) {
      if (this.context.selectedDoctor.code === 0) {
        strMessage = "依頼医を選択してください";
        return false;
      }
    }
    
    let arr = [];
    Object.keys(cacheDocumentCreateState).forEach(function(key){
      arr.push(key);
    });
    let karte_status = 1;
    if (this.context.karte_status.name === "訪問診療") {
      karte_status = 2;
    } else if(this.context.karte_status.name === "入院") {
      karte_status = 3;
    }
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/document/save_file_info";
      let cur_cache_data = cacheDocumentCreateState[arr[i]];
      cur_cache_data.karte_status= karte_status;
      is_seal_print = karteApi.getSealSubVal(patient_id, "document", arr[i]);
      cur_cache_data.is_seal_print = is_seal_print == null ? 0: is_seal_print;
      await apiClient
        ._post(path, {
          params: cur_cache_data
        })
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.DOCUMENT_CREATE, arr[i]);
          return true;
        })
        .catch(() => {
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.DOCUMENT_CREATE);
  }
  
  if (error == false && existcacheDischargeGuidanceReportState == true) {
    let path = "/app/api/v2/secure/medicine_guidance_request/register_discharge_guidance_report";
    cacheDischargeGuidanceReportState.karte_status = 3; //入院
    let discharge_decision_error = false;
    await apiClient
      ._post(path, {
        params: cacheDischargeGuidanceReportState
      })
      .then(() => {
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT);
      })
      .catch(() => {
        return false;
      });
    if(discharge_decision_error){ return false;}
  }
  
  // WardMove delete
  if (error == false && existcacheWardMoveDeleteState == true) {
    if (authInfo.staff_category != 1 && this.context.selectedDoctor.code === 0) {
      strMessage = "依頼医を選択してください";
      return false;
    }
    let arr = [];
    Object.keys(cacheWardMoveDeleteState).forEach(function(key){
      arr.push(key);
    });
    let params = {};
    params.type = "cancel_move";
    params.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    params.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    let cancel_move_error = false;
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/ward/cancel_do";
      let cur_cache_data = cacheWardMoveDeleteState[arr[i]];
      params.hos_number = cur_cache_data.hos_number;
      params.hos_detail_id = cur_cache_data.hos_detail_number;
      await apiClient
        ._post(path, {params})
        .then((res) => {
          if(res.error_message != undefined){
            this.addMessageSendKarte(Karte_Steps.Ward_Move_Cancel, Karte_Types.Delete, res.error_message, 1);
            cancel_move_error = true;
          } else {
            karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.WARD_MOVE_DELETE, arr[i]);
          }
          return true;
        })
        .catch(() => {
        });
      if(cancel_move_error){
        break;
      }
    }
    if(cancel_move_error){
      return false;
    } else {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.WARD_MOVE_DELETE);
    }
  }
  
  // change_responsibility_delete
  if (error == false && existcacheChangeResponsibilityDeleteState == true) {
    if (authInfo.staff_category != 1 && this.context.selectedDoctor.code === 0) {
      strMessage = "依頼医を選択してください";
      return false;
    }
    let arr = [];
    Object.keys(cacheChangeResponsibilityDeleteState).forEach(function(key){
      arr.push(key);
    });
    let params = {};
    params.type = "cancel_change_responsibility";
    params.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    params.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    let delete_error = false;
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/ward/cancel_do";
      let cur_cache_data = cacheChangeResponsibilityDeleteState[arr[i]];
      params.hos_number = cur_cache_data.hos_number;
      params.hos_detail_id = cur_cache_data.hos_detail_number;
      params.order_number = cur_cache_data.number;
      await apiClient
        ._post(path, {params})
        .then((res) => {
          if(res.error_message != undefined){
            this.addMessageSendKarte(Karte_Steps.Change_Responsibility_Cancel, Karte_Types.Delete, res.error_message, 1);
            delete_error = true;
          } else {
            karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE, arr[i]);
          }
          return true;
        })
        .catch(() => {
        });
      if(delete_error){
        break;
      }
    }
    if(delete_error){
      return false;
    } else {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE);
    }
  }
  
  // in_hospital_delete
  if (error == false && existcacheInHospitalDeleteState == true) {
    if (authInfo.staff_category != 1 && this.context.selectedDoctor.code === 0) {
      strMessage = "依頼医を選択してください";
      return false;
    }
    let arr = [];
    Object.keys(cacheInHospitalDeleteState).forEach(function(key){
      arr.push(key);
    });
    let path = "/app/api/v2/ward/cancel/hospital";
    let params = {};
    params.patient_id = patient_id;
    params.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    params.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    let delete_error = false;
    for (let i = 0; i < arr.length; i ++) {
      let cur_cache_data = cacheInHospitalDeleteState[arr[i]];
      params.action = cur_cache_data.hospital_type == "in_apply" ? "application" : "decision";
      params.hos_number = cur_cache_data.hos_number;
      params.detail_id = cur_cache_data.hos_detail_number;
      await apiClient
        ._post(path, {params})
        .then((res) => {
          if(res.error_message != undefined){
            this.addMessageSendKarte(Karte_Steps.Hospital_In, Karte_Types.Delete, res.error_message, 1);
            delete_error = true;
          } else {
            karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE, arr[i]);
            let patientInfo = karteApi.getPatient(patient_id);
            patientInfo.is_hospital = 0;
            karteApi.setPatient(patient_id, JSON.stringify(patientInfo));
            this.context.$updateKarteStatus(0, "外来", patient_id);
          }
          return true;
        })
        .catch(() => {
        });
      if(delete_error){
        break;
      }
    }
    if(delete_error){
      return false;
    } else {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE);
    }
  }
  
  // Hospital Done delete
  if (error == false && existcacheHospitalDoneDeleteState == true) {
    if (authInfo.staff_category != 1 && this.context.selectedDoctor.code === 0) {
      strMessage = "依頼医を選択してください";
      return false;
    }
    let arr = [];
    Object.keys(cacheHospitalDoneDeleteState).forEach(function(key){
      arr.push(key);
    });
    let params = {};
    params.type = "cancel_hospital";
    params.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    params.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    let cancel_move_error = false;
    for (let i = 0; i < arr.length; i ++) {
      let path = "/app/api/v2/ward/cancel_do";
      let cur_cache_data = cacheHospitalDoneDeleteState[arr[i]];
      params.hos_number = cur_cache_data.hos_number;
      params.hos_detail_id = cur_cache_data.hos_detail_number;
      await apiClient
        ._post(path, {params})
        .then((res) => {
          if(res.error_message != undefined){
            this.addMessageSendKarte(Karte_Steps.Hospital_Done_Cancel, Karte_Types.Delete, res.error_message, 1);
            cancel_move_error = true;
          } else {
            karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE, arr[i]);
          }
          return true;
        })
        .catch(() => {
        });
      if(cancel_move_error){
        break;
      }
    }
    if(cancel_move_error){
      return false;
    } else {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE);
    }
  }
  
  // Discharge delete
  if (error == false && existcacheDischargeDeleteState == true) {
    if (authInfo.staff_category != 1 && this.context.selectedDoctor.code === 0) {
      strMessage = "依頼医を選択してください";
      return false;
    }
    let arr = [];
    Object.keys(cacheDischargeDeleteState).forEach(function(key){
      arr.push(key);
    });
    let params = {};
    params.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    params.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    let cancel_move_error = false;
    for (let i = 0; i < arr.length; i ++) {
      let cur_cache_data = cacheDischargeDeleteState[arr[i]];
      let path = cur_cache_data.discharge_type == "discharge-done" ? "/app/api/v2/ward/cancel_do" : "/app/api/v2/ward/cancel/hospital";
      if(cur_cache_data.discharge_type == "discharge-done"){
        params.type = "cancel_discharge";
        params.hos_detail_id = cur_cache_data.hos_detail_number;
      } else {
        params.action = cur_cache_data.discharge_type;
        params.detail_id = cur_cache_data.discharge_type == "discharge-permit" ? cur_cache_data.hos_detail_id : cur_cache_data.hos_detail_number;
      }
      params.hos_number = cur_cache_data.hos_number;
      params.patient_id = patient_id;
      await apiClient
        ._post(path, {params})
        .then((res) => {
          if(res.error_message != undefined){
            this.addMessageSendKarte(Karte_Steps.Discharge_Cancel, Karte_Types.Delete, res.error_message, 1);
            cancel_move_error = true;
          } else {
            karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DELETE, arr[i]);
          }
          return true;
        })
        .catch(() => {
        });
      if(cancel_move_error){
        break;
      }
    }
    if(cancel_move_error){
      return false;
    } else {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DELETE);
    }
  }
  
  // Discharge delete
  if (error == false && existcacheHospitalGoingDeleteState == true) {
    if (authInfo.staff_category != 1 && this.context.selectedDoctor.code === 0) {
      strMessage = "依頼医を選択してください";
      return false;
    }
    let arr = [];
    Object.keys(cacheHospitalGoingDeleteState).forEach(function(key){
      arr.push(key);
    });
    let params = {};
    let path = "/app/api/v2/ward/cancel_do";
    params.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    params.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    let cancel_move_error = false;
    for (let i = 0; i < arr.length; i ++) {
      let cur_cache_data = cacheHospitalGoingDeleteState[arr[i]];
      params.type = cur_cache_data.going_type;
      params.hos_number = cur_cache_data.hos_number;
      params.hos_detail_id = cur_cache_data.hos_detail_number;
      await apiClient
        ._post(path, {params})
        .then((res) => {
          if(res.error_message != undefined){
            this.addMessageSendKarte(Karte_Steps.Hospital_Going_Cancel, Karte_Types.Delete, res.error_message, 1);
            cancel_move_error = true;
          } else {
            karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE, arr[i]);
          }
          return true;
        })
        .catch(() => {
        });
      if(cancel_move_error){
        break;
      }
    }
    if(cancel_move_error){
      return false;
    } else {
      karteApi.delVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE);
    }
  }
  
  //get DEATH_REGISTER cache
  const cacheDeathRegisterState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DEATH_REGISTER);
  let existcacheDeathRegisterState = true;
  if (cacheDeathRegisterState == null ) {
    existcacheDeathRegisterState = false;
  }
  // DEATH_REGISTER
  if (error == false && existcacheDeathRegisterState == true) {
    let path = "/app/api/v2/ward/register/death_info";
    let karte_status = 1;
    if (this.context.karte_status.name === "訪問診療") {
      karte_status = 2;
    } else if(this.context.karte_status.name === "入院") {
      karte_status = 3;
    }
    cacheDeathRegisterState.karte_status = karte_status;
    cacheDeathRegisterState.department_id = this.context.department.code == 0 ? 1 : this.context.department.code;
    cacheDeathRegisterState.department_name = this.context.department.name;
    is_seal_print = karteApi.getSealSubVal(patient_id, CACHE_LOCALNAMES.DEATH_REGISTER, 0);
    cacheDeathRegisterState.is_seal_print = is_seal_print == null ? 0: is_seal_print;
    await apiClient
      ._post(path, {
        params: cacheDeathRegisterState
      })
      .then(() => {
        karteApi.delVal(patient_id, CACHE_LOCALNAMES.DEATH_REGISTER);
        let patientInfo = karteApi.getPatient(patient_id);
        patientInfo.is_death = 1;//死亡
        karteApi.setPatient(patient_id, JSON.stringify(patientInfo));
      })
      .catch(() => {
        return false;
      });
  }
  
  //get DeathRegisterState cache
  const cacheDeathRegisterDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE);
  let existcacheDeathRegisterDeleteState = false;
  if(cacheDeathRegisterDeleteState != undefined && cacheDeathRegisterDeleteState != null && Object.keys(cacheDeathRegisterDeleteState).length > 0){
    existcacheDeathRegisterDeleteState = true;
  }
  // Discharge delete
  if (error == false && existcacheDeathRegisterDeleteState == true) {
    if (authInfo.staff_category != 1 && this.context.selectedDoctor.code === 0) {
      strMessage = "依頼医を選択してください";
      return false;
    }
    let arr = [];
    Object.keys(cacheDeathRegisterDeleteState).forEach(function(key){
      arr.push(key);
    });
    let params = {};
    let path = "/app/api/v2/ward/delete/death_info";
    for (let i = 0; i < arr.length; i ++) {
      let cur_cache_data = cacheDeathRegisterDeleteState[arr[i]];
      params.order_number = cur_cache_data.number;
      params.patient_id = cur_cache_data.system_patient_id;
      await apiClient
        ._post(path, {params})
        .then(() => {
          karteApi.delSubVal(patient_id, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE, arr[i]);
          let patientInfo = karteApi.getPatient(patient_id);
          patientInfo.is_death = 0;//死亡取り消し
          karteApi.setPatient(patient_id, JSON.stringify(patientInfo));
        })
        .catch(() => {
        });
    }
    karteApi.delVal(patient_id, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE);
  }
  
  return true;
}
