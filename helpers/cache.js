import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export const persistedState = (patient_id) => {
  const persistState = JSON.parse(
    window.sessionStorage.getItem("haruka") ||
      window.localStorage.getItem("haruka")
  );
  //SOAP
  const cacheSoapState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.SOAP_EDIT);
  const cacheDelSoapState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.SOAP_DELETE);
  //PRESCRIPTION
  const cacheState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
  const cacheDelState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
  const cacheDoneState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
  //INJECTION
  const cacheInjectState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INJECTION_EDIT);
  const cacheDelInjectState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INJECTION_DELETE);
  const cacheDoneInjectState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INJECTION_DONE);
  //EXAM 検体検査
  const cacheExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.EXAM_EDIT);
  const cacheDelExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.EXAM_DELETE);
  const cacheDoneExamOrderState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
  //INSPECTION 生理,内視鏡
  const cacheInspectionState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT);
  const cacheDelInspectionState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.INSPECTION_DELETE);
  //TREATMENT 処置
  const cacheTreatState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.TREATMENT_EDIT);
  const cacheDelTreatState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.TREATMENT_DELETE);
  //HOSPITAL
  const cacheAllergyState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.ALLERGY_EDIT);
  const cacheDelAllergyState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.ALLERGY_DELETE);
  //GUIDANCE 管理・指導
  const cacheGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT);
  const cacheDelGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.GUIDANCE_DELETE);
  //Rihabily リハビリ
  const cacheRihabilyState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT);
  const cacheDelRehabilyState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RIHABILY_DELETE);

  //放射線
  const cacheRadiationState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RADIATION_EDIT);
  const cacheDelRadiationState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RADIATION_DELETE);

  //細菌検査
  const cacheBacillusState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACILLUS_EDIT);
  // const cacheDelRadiationState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACILLUS_DELETE);

  //予約受付
  const cacheReservationState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.RESERVATION_INFO);

  //訪問診療受付
  const cacheVisitState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.VISIT_INFO);

  //退院許可
  const cacheDischargePermitState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_PERMIT);

  //担当変更オーダ
  const cacheChangeResponsibilityState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY);

  //食事オーダ
  const cacheMealEditState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEAL_EDIT);

  //食事一括指示
  const cacheMealGroupEditState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);

  // 入院決定オーダ, 入院申込オーダ
  const cacheInHospitalState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);

  // 中止処方
  const cacheStopPrescription = karteApi.getVal(patient_id, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT);

  //外泊・外出
  const cacheInHospitalOutState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_OUT);

  //帰院
  const cacheInHospitalReturnState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_RETURN);

  //栄養指導依頼
  const cacheNutritionGuidance = karteApi.getVal(patient_id, CACHE_LOCALNAMES.NUTRITION_GUIDANCE);

  //服薬指導
  const cacheMedcineGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT);
  const cacheDelMedcineGuidanceState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_DELETE);

  //栄養指導依頼
  const cacheMedicalExaminationRecord = karteApi.getVal(patient_id, CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD);

  //退院実施
  const cacheDischargeDoneState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DONE);

  //退院決定
  const cacheDischargeDecisionState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DECISION);

  //入院実施
  const cacheHospitalDoneState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE);

  //文書作成
  const cacheDocumentCreateState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DOCUMENT_CREATE);
  const cacheDelDocumentState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DOCUMENT_DELETE);

  //退院時指導レポート
  const cacheDischargeGuidanceReportState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT);

  //転棟転室取り消し
  const cacheWardMoveDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.WARD_MOVE_DELETE);

  //担当変更取り消し
  const cacheChangeResponsibilityDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE);

  //入院申込,入院決定取り消し
  const cacheInHospitalDeleteState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE);

  //入院実施取り消し
  const cacheHospitalDone = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE);

  //退院許可,退院決定,退院実施取り消し
  const cacheDischargeDelete = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DISCHARGE_DELETE);

  //外泊,帰院取り消し
  const cacheHospitalGoingDelete = karteApi.getVal(patient_id, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE);

  //死亡登録
  const cacheDeathRegister = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DEATH_REGISTER);

  //死亡登録 取り消し
  const cacheDeathRegisterDelete = karteApi.getVal(patient_id, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE);
  
  //細胞診検査
  const cacheCytologyExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
  const cacheDelCytologyExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE);
  const cacheDoneCytologyExamOrderState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE);
  //病理検査
  const cachePathologyExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
  const cacheDelPathologyExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE);
  const cacheDonePathologyExamOrderState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE);
  //細菌検査
  const cacheBacterialExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
  const cacheDelBacterialExamState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE);
  const cacheDoneBacterialExamOrderState = karteApi.getVal(patient_id, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE);

  return { persistState, cacheState, cacheInjectState, cacheDelState, cacheSoapState, cacheDelInjectState,
    cacheDelSoapState, cacheDoneState, cacheDoneInjectState, cacheExamState, cacheDoneExamOrderState, cacheInspectionState,
    cacheTreatState, cacheAllergyState, cacheDelInspectionState, cacheDelTreatState, cacheDelExamState, cacheGuidanceState, cacheDelGuidanceState,
    cacheRihabilyState, cacheDelRehabilyState, cacheRadiationState, cacheDelRadiationState, cacheDelAllergyState, cacheReservationState,
    cacheVisitState, cacheDischargePermitState, cacheChangeResponsibilityState, cacheInHospitalState, cacheMealEditState,
    cacheStopPrescription, cacheInHospitalOutState, cacheInHospitalReturnState, cacheMedcineGuidanceState, cacheDelMedcineGuidanceState, cacheNutritionGuidance,
    cacheBacillusState, cacheMedicalExaminationRecord, cacheDischargeDoneState, cacheDischargeDecisionState, cacheHospitalDoneState, cacheMealGroupEditState,
    cacheDocumentCreateState, cacheDelDocumentState, cacheDischargeGuidanceReportState, cacheWardMoveDeleteState, cacheChangeResponsibilityDeleteState,
    cacheInHospitalDeleteState, cacheHospitalDone, cacheDischargeDelete, cacheHospitalGoingDelete, cacheDeathRegister, cacheDeathRegisterDelete,
    cacheCytologyExamState, cacheDelCytologyExamState, cacheDoneCytologyExamOrderState,
    cachePathologyExamState, cacheDelPathologyExamState, cacheDonePathologyExamOrderState,
    cacheBacterialExamState, cacheDelBacterialExamState, cacheDoneBacterialExamOrderState
  };
};
