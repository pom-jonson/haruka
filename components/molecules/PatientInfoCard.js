import React, { Component } from "react";
import PropTypes from "prop-types";
import PatientCardWrapper from "../atoms/PatientCardWrapper";
import LargeUserIcon from "../atoms/LargeUserIcon";
import DetailedPatient from "./DetailedPatient";
import ConcurrentuserModal from "./ConcurrentuserModal";
import SelectExaminationModal from "../templates/Patient/components/SelectExaminationModal";
import PhysiologicalModal from "~/components/templates/Patient/Modals/Physiological/PhysiologicalModal";
import OutPatientModal from "~/components/templates/Patient/Modals/OutPatient/OutPatientModal";
import InstructionBookModal from "~/components/templates/Patient/Modals/InstructionBook/InstructionBookModal";
import OutHospitalGroupDeleteModal from "~/components/templates/Patient/Modals/OutHospital/OutHospitalGroupDeleteModal";
import InstructionBookListModal from "~/components/templates/Patient/Modals/InstructionBook/InstructionBookListModal";
import StopPrescriptionModal from "~/components/templates/Patient/Modals/StopPrescription/StopPrescriptionModal";
import RehabilitationModal from "~/components/templates/Patient/Modals/Rehabilitation/RehabilitationModal";
import GuidanceModal from "~/components/templates/Patient/Modals/Guidance/GuidanceModal";
import AccountOrder from "~/components/templates/Patient/Modals/Account/AccountOrder";
import NutritionGuidance from "~/components/templates/Patient/Modals/Guidance/NutritionGuidance";
import MedicinGuidance from "~/components/templates/Patient/Modals/Guidance/MedicinGuidance";
import HomeTreatmentModal from "~/components/templates/Patient/Modals/HomeTreatment/HomeTreatmentModal";
import SetCreateModal from "~/components/templates/Patient/Modals/Set/SetCreateModal";
import SetRegisterModal from "~/components/templates/Patient/Modals/Set/SetRegisterModal";
import SetDeploymentModal from "~/components/templates/Patient/Modals/Set/SetDeploymentModal";
import AllergyModal from "~/components/templates/Patient/Modals/Allergy/AllergyModal";
import MedicalInfoModal from "~/components/templates/Patient/Modals/Print/MedicalInfoModal";
import KartePrintModal from "~/components/templates/Patient/Modals/Print/KartePrintModal";
import SelectDoctorModal from "../templates/Patient/components/SelectDoctorModal";
import RadiationModal from "~/components/templates/Patient/Modals/Radiation/RadiationModal";
import BacillusInspection from "~/components/templates/Patient/Modals/Bacillus/BacillusInspection";
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";
import SymptomDetailModal from "~/components/templates/Patient/Modals/Symptom/SymptomDetailModal";
import ImportanceOrderListModal from "~/components/templates/Patient/Modals/ImportanceOrderListModal";
import PeriodOrderListModal from "~/components/templates/Patient/Modals/Soap/PeriodOrderListModal";
import GuidanceFeeMasterModal from "~/components/templates/MasterMaintenance/Guidance/GuidanceFeeMasterModal";
import HospitalApplicationOrder from "~/components/templates/Patient/Modals/Hospital/HospitalApplicationOrder";
import DischargePermitOrder from "~/components/templates/Patient/Modals/Hospital/DischargePermitOrder";
import KarteDischargeHospital from "~/components/templates/Patient/Modals/Hospital/KarteDischargeHospital";
import HospitalDisease from "~/components/templates/Patient/Modals/Hospital/HospitalDisease";
import NurseProblemListModal from "~/components/templates/Nurse/NurseProblemListModal";
import NursePlanReferenceModal from "~/components/templates/Nurse/NursePlanReferenceModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import AfflictionIcon from "../atoms/AfflictionIcon";
import Context from "~/helpers/configureStore";
import disabled_status_no from "../_demo/Patients_panel_icon/disabled_status_no.png";
import disabled_status_yes from "../_demo/Patients_panel_icon/disabled_status_yes.png";
import drugalergy_status_no from "../_demo/Patients_panel_icon/drugalergy_status_no.png";
import drugalergy_status_yes from "../_demo/Patients_panel_icon/drugalergy_status_yes.png";
import foodalergy_status_no from "../_demo/Patients_panel_icon/foodalergy_status_no.png";
import foodalergy_status_yes from "../_demo/Patients_panel_icon/foodalergy_status_yes.png";
import staff_status_no from "../_demo/Patients_panel_icon/staff_status_no.png";
import staff_status_yes from "../_demo/Patients_panel_icon/staff_status_yes.png";
import ADL_status_no from "../_demo/Patients_panel_icon/ADL_status_no.png";
import ADL_status_yes from "../_demo/Patients_panel_icon/ADL_status_yes.png";
import vaccine_status_no from "../_demo/Patients_panel_icon/vaccine_status_no.png";
import vaccine_status_yes from "../_demo/Patients_panel_icon/vaccine_status_yes.png";
import infection_status_positive from "../_demo/Patients_panel_icon/infection_status_positive.png";
import infection_status_no from "../_demo/Patients_panel_icon/infection_status_no.png";
import infection_status_unknown from "../_demo/Patients_panel_icon/infection_status_unknown.png";
import infection_status_negative from "../_demo/Patients_panel_icon/infection_status_negative.png";
import alergy_status_positive from "../_demo/Patients_panel_icon/alergy_status_positive.png";
import alergy_status_no from "../_demo/Patients_panel_icon/alergy_status_no.png";
import alergy_status_unknown from "../_demo/Patients_panel_icon/alergy_status_unknown.png";
import alergy_status_negative from "../_demo/Patients_panel_icon/alergy_status_negative.png";
import navigation_status from "../_demo/Patients_panel_icon/navigation_status.png";
import introduction_status from "../_demo/Patients_panel_icon/introduction_status.png";
import { patientModalEvent } from "../../events/PatientModalEvent";
import { Wrapper, Flex, PatientName, Kana, PatientId, PatientIdOne } from "../styles/PatientInfoCardCss";
import SelectorWithLabel from "./SelectorWithLabel";
import Button from "../atoms/Button";
import * as methods from "~/components/methods/StoreMethods";
import auth from "~/api/auth";
import BasicInfoModal from "../organisms/BasicInfoModal";
import HistoryInfoModal from "../organisms/HistoryInfoModal";
import axios from "axios";
import NotConsentedModal from "../organisms/NotConsentedModal";
import AllergyListModal from "../templates/Patient/Modals/Allergy/AllergyListModal";
import PatientStaffListModal from "../templates/Patient/Modals/PatientStaff/PatientStaffListModal";
import IntroductionListModal from "../templates/Patient/Modals/Introduction/IntroductionListModal";
import PrescriptionConfirmModal from "~/components/molecules/PrescriptionConfirmModal";
import WorkSheetModal from "~/components/templates/Ward/worksheet/WorkSheetModal";
import NurseCourseSeatModal from "~/components/templates/Ward/worksheet/NurseCourseSeatModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {
  KARTE_STATUS_TYPE,
  CACHE_SESSIONNAMES,
  CACHE_LOCALNAMES,
  ALLERGY_STATUS_ARRAY,
  ALLERGY_TYPE_ARRAY,
  Karte_Types,
  KARTEMODE,
  hankaku2Zenkaku, zenkana2Hankana, getInspectionMasterInfo
} from "~/helpers/constants";
import * as apiClient from "~/api/apiClient";
import {displayLineBreak} from "~/helpers/dialConstants";
import styled from "styled-components";
import * as sessApi from "~/helpers/cacheSession-utils";
import SimpleOrder from "~/components/templates/Patient/Modals/SimpleOrder/SimpleOrder";
import PotionReportModal from "~/components/templates/Patient/Modals/PotionReport/PotionReportModal";
import HospitalPrescriptionModal from "../templates/Patient/Modals/PotionReport/HospitalPrescriptionModal";
import AccountHospitalOrderModal from "../templates/Patient/Modals/AccountOrder/AccountHospitalOrderModal";
import MoveMealCalendar from "~/components/templates/Meal/MoveMealCalendar";
import ChangeMealModal from "~/components/templates/Meal/ChangeMealModal";
import FoodGroupModal from "~/components/templates/Meal/FoodGroupModal";
import OutReturnHospitalModal from "~/components/templates/Meal/OutReturnHospitalModal";
import ChangeResponsibilityModal from "../templates/Meal/ChangeResponsibilityModal";
import BatchDoPrescriptionList from "~/components/templates/Patient/Modals/BatchDoPrescriptionList/BatchDoPrescriptionList";
import NurseInstruction from "~/components/templates/Nurse/NurseInstruction";
import NurseProfileModal from "~/components/templates/Nurse/NurseProfileModal";
import VisitNurseSummaryModal from "~/components/templates/Nurse/VisitNurseSummaryModal";
import NurseProfileDatabaseModal from "~/components/templates/Nurse/NurseProfileDatabaseModal";
import NurseAnamuneModal from "~/components/templates/Nurse/NurseAnamuneModal";
import AdministrationDiaryMenuModal from "~/components/templates/Nurse/AdministrationDiaryMenuModal";
import SelectShowModeModal from "~/components/templates/Ward/incharge/SelectShowModeModal";
import $ from "jquery";
import SoapFocus from "../templates/Nurse/soap_focus/SoapFocus";
import {formatJapan, getCurrentDate} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import KarteDischargeHospitalDecision from "~/components/templates/Ward/KarteDischargeHospitalDecision";
import KarteDoHospitalization from "~/components/templates/Ward/KarteDoHospitalization";
import BarcodeMountPrint from "~/components/templates/Patient/Modals/Print/BarcodeMountPrint";
import LeaveHospitalGuidanceReport from "~/components/templates/Patient/Medication/LeaveHospitalGuidanceReport";
import DocumentEdit from "~/components/templates/Patient/Modals/Document/DocumentEdit";
import InstructionbookCalendar from "~/components/templates/Patient/Modals/InstructionBook/InstructionbookCalendar";
import DeathRegister from "~/components/templates/Patient/DeathRegister";
import PassingTimeRecord from "~/components/templates/Nurse/soap_focus/PassingTimeRecord";
import LoadingModal from "~/components/molecules/LoadingModal";
import BulkInstructionModal from "../templates/Nurse/BulkInstructionModal";

var RightButtons = styled.div`  
  span{
    font-size:${props=>(props.font_props != undefined?0.85*props.font_props + 'rem':'0.85rem')}!important;
  }  
  .bottom-line-button{
    min-width:5rem!important;
    width:6.3rem!important;
    padding:0.4rem!important;
    padding-left:0.2rem!important;
    padding-right:0.2rem!important;
  }
  .bottom-period-order-button{
    min-width:2rem!important;
    width:2rem!important;
    padding:0.4rem!important;
    padding-left:0.2rem!important;
    padding-right:0.2rem!important;
  }
  .read-btn{
    box-shadow: rgb(105, 200, 225) 0px 1px 4px;
  }
  .write-btn{
    background-color: rgb(241, 86, 124);
    box-shadow: rgb(241, 86, 124) 0px 1px 4px;
  }
  .execute-btn{
    background-color: rgb(241, 136, 86);
    box-shadow: rgb(241, 136, 86) 0px 1px 4px;
    
  }
  .disabled-button{
    opacity:0.6;
  }
  .no-cursor{
    cursor: auto;
  }
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #FFFFCC;
    border-radius: 4px;
    border: solid 2px #FFCC9A;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    max-width: 396px;
    max-height: 350px;
    overflow-y: auto;
  }
  
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;

    div {
      padding: 5px 12px;
    }
  }
  .tooltip-title {
    border-bottom: solid 1px #FFCC9A;
    margin: 0 9px;
    padding: 3px;
  }

`;

const Tooltip = ({visible,x,y,tooltip_content, tooltip_patientInfo}) => {
  if (visible) {
    var height_decimal_place = 1;
    var weight_decimal_place = 2;
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    if (conf_data.basic_data != undefined && conf_data.basic_data.height != undefined && conf_data.basic_data.height.decimal_place >= 0) {
      height_decimal_place = conf_data.basic_data.height.decimal_place;
    }
    if (conf_data.basic_data != undefined && conf_data.basic_data.weight != undefined && conf_data.basic_data.weight.decimal_place >= 0) {
      weight_decimal_place = conf_data.basic_data.weight.decimal_place;
    }
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {tooltip_patientInfo != null ? ( // 身長・体重
            <li>
              <div className={'tooltip-content'}>身長 : {tooltip_patientInfo.height > 0? parseFloat(tooltip_patientInfo.height).toFixed(height_decimal_place) + 'cm':''}</div>
              <div className={'tooltip-content'}>体重 : {tooltip_patientInfo.weight > 0? parseFloat(tooltip_patientInfo.weight).toFixed(weight_decimal_place) + 'kg':''}</div>
              {tooltip_patientInfo.height > 0 && tooltip_patientInfo.weight > 0 && (
                <div className={'tooltip-content'}>BMI  : {parseFloat((tooltip_patientInfo.weight * 10000)/(tooltip_patientInfo.height * tooltip_patientInfo.height)).toFixed(2)}</div>
              )}
            </li>
          ):(// tooltip
            <li>
              <div className={'tooltip-title'}>{tooltip_content['title']}</div>
              <div className={'tooltip-content'}>{displayLineBreak(tooltip_content['body_1'])}</div>
              {tooltip_content['start_date'] != undefined && tooltip_content['start_date'] != null && (
                <div className={'tooltip-content'}>{tooltip_content['start_date']}</div>
              )}
              {tooltip_content['body_2'] != null && (
                <div className={'tooltip-content'}>{displayLineBreak(tooltip_content['body_2'])}</div>
              )}
            </li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class PatientInfoCard extends Component {
  sendLog = methods.sendLog.bind(this);
  constructor(props) {
    super(props);
    let patientInfo = karteApi.getPatient(this.props.patientId);
    patientInfo = patientInfo != undefined && patientInfo != null ? patientInfo : {};
    this.patient_check_timer = undefined;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.nurse_profile_simple = 1;
    this.view_soap_focus_menu = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
     if(initState.conf_data.nurse_profile_simple !== undefined){
       this.nurse_profile_simple = initState.conf_data.nurse_profile_simple;
     }
     if(initState.conf_data.view_soap_focus_menu !== undefined){
       this.view_soap_focus_menu = initState.conf_data.view_soap_focus_menu;
     }
    }
    this.state = {
      re_draw:false,
      isPopupOpen: false,
      isConcurrentPopupOpen: false,
      tabIndex: "1",
      disabled: false,
      drugalergy: false,
      foodalergy: false,
      staff: false,
      ADL: false,
      vaccine: false,
      infection_positive: false,
      infection_no: false,
      infection_unknown: false,
      infection_negative: false,
      alergy_positive: false,
      alergy_no: false,
      alergy_unknown: false,
      alergy_negative: false,
      isOpenBasicInfo: false,
      openDoctorModal: false,
      isopenPatientStaffModal: false,
      isopenIntroductionModal: false,
      isOpenHistoryInfoModal:false,
      isOpenPeriodOrderListModal:false,
      isPotionReportPopupOpen:false,
      isHospitalPrescriptionPopupOpen:false,
      first_modal:false,
      alert_messages:"",
      confirm_alert_title:"",
      confirm_message:"",
      patientInfo,
      work_sheet_master:[],
      current_insurance_type: patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0
    };

    // ●YJ1051 カルテ画面の入外切替や診療科切り替えでフリーズする
    this.LoadingModalRef = React.createRef();

    patientModalEvent.addListener(
      "clickOpenDetailedPatientPopup",
      this.handleClickOpenDetailedPatientPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenPatientDiseaseNamePopup",
      this.handleClickOpenPatientDiseaseNamePopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenExaminationPopup",
      this.handleClickOpenExaminationPopup.bind(this)
    );
    // 生理
    patientModalEvent.addListener(
      "clickOpenPhysiologicalPopup",
      this.handleClickOpenPhysiologicalPopup.bind(this)
    );
    // 外来処置 id: 224
    patientModalEvent.addListener(
      "clickOpenOutpatientPopup",
      this.handleClickOpenOutpatientPopup.bind(this)
    );
    // 指示簿 id: 241
    patientModalEvent.addListener(
      "clickOpenInstructionBookPopup",
      this.handleClickOpenInstructionBookPopup.bind(this)
    );
    // 指示簿一覧 id: 242
    patientModalEvent.addListener(
      "clickOpenInstructionBookListPopup",
      this.handleClickOpenInstructionBookListPopup.bind(this)
    );
    // 中止処方 id: 235
    patientModalEvent.addListener(
      "clickOpenStopPrescriptionPopup",
      this.handleClickOpenStopPrescriptionPopup.bind(this)
    );
    // 中止処方 id: 243
    patientModalEvent.addListener(
      "clickOpenOutHospitalGroupDeletePopup",
      this.handleClickOpenOutHospitalGroupDeletePopup.bind(this)
    );
    // 移動食事カレンダー id: 244
    patientModalEvent.addListener(
      "clickOpenMoveMealCalendarPopup",
      this.handleClickOpenMoveMealCalendarPopup.bind(this)
    );
    // 一括Do処方一覧 id: 236
    patientModalEvent.addListener(
      "clickOpenBatchDoPrescriptionListPopup",
      this.handleClickOpenBatchDoPrescriptionListPopup.bind(this)
    );
    // 看護計画 id: 302
    patientModalEvent.addListener(
      "clickOpenNursePlanPopup",
      this.handleClickOpenNursePlanPopup.bind(this)
    );
    // 看護計画参照 id: 306
    patientModalEvent.addListener(
      "clickOpenNursePlanReferencePopup",
      this.handleClickOpenNursePlanReferencePopup.bind(this)
    );
    // 個人ワークシート id: 317
    patientModalEvent.addListener(
      "clickOpenIndividualWorkSheetPopup",
      this.handleClickOpenIndividualWorkSheetPopup.bind(this)
    );
    // 看護指示 id: 303
    patientModalEvent.addListener(
      "clickNurseInstructionPopup",
      this.handleClickNurseInstructionPopup.bind(this)
    );
    // 看護指示 id: 323
    patientModalEvent.addListener(
      "clickHospitalInstructionPopup",
      this.handleClickHospitalInstructionPopup.bind(this)
    );
    // 看護プロファイル id: 305
    patientModalEvent.addListener(
      "clickNurseProfilePopup",
      this.handleClickNurseProfilePopup.bind(this)
    );
    // 看護プロファイル id: 322
    patientModalEvent.addListener(
      "clickNurseAnamunePopup",
      this.handleClickNurseAnamunePopup.bind(this)
    );
    // 看護プロファイル id: 320
    patientModalEvent.addListener(
      "clickVisitNurseSummaryPopup",
      this.handleClickVisitNurseSummaryPopup.bind(this)
    );
    //インチャージシート id:312
    patientModalEvent.addListener(
      "clickInchargeSheetPopup",
      this.handleClickInchargeSheetPopup.bind(this)
    );
    // 管理日誌メニュー	 id: 309
    patientModalEvent.addListener(
      "clickAdministrationDiaryPopup",
      this.handleClickAdministrationDiaryPopup.bind(this)
    );
    //経過表 	 id: 310
    patientModalEvent.addListener(
      "clickProgressChartPopup",
      this.handleClickProgressChartPopup.bind(this)
    );
    // 食事変更
    patientModalEvent.addListener(
      "clickOpenChangeMealPopup",
      this.handleClickOpenChangeMealPopup.bind(this)
    );
    // 食事一括指示
    patientModalEvent.addListener(
      "clickOpenChangeMealGroupPopup",
      this.handleClickOpenChangeMealGroupPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenAllergyPopup",
      this.handleClickOpenAllergyPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenAccountHospitalOrderPopup",
      this.handleClickOpenAccountHospitalOrderPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenMedicalInfoPopup",
      this.handleClickOpenMedicalInfoPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenKartePrintPopup",
      this.handleclickOpenKartePrintPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenBarcodeMountPrint",
      this.handleclickOpenBarcodeMountPrintPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenGuidancePopup",
      this.handleClickOpenGuidancePopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenChangeResponsibilityPopup",
      this.handleClickOpenChangeResponsibilityPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenHospitalApplicationOrder",
      this.handleclickOpenHospitalApplicationOrderPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenHospitalDecisionOrder",
      this.handleclickOpenHospitalDecisionOrderPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenSimpleOrderPopup",
      this.handleClickOpenSimpleOrderPopup.bind(this)
    );

    // リハビリ id: 224
    patientModalEvent.addListener(
      "clickOpenRadiationPopup",
      this.handleClickOpenRadiationPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenRehabilyPopup",
      this.handleClickOpenRehabilyPopup.bind(this)
    );

    patientModalEvent.addListener(
      "edit_modal",
      this.handleClickEditModalPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenHomeTreatmentPopup",
      this.handleClickOpenHomeTreatmentPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenHospitalTreatmentPopup",
      this.handleClickOpenHospitalTreatmentPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenSetCreatePopup",
      this.handleClickOpenSetCreatePopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenSetRegisterPopup",
      this.handleClickOpenSetRegisterPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenSetDeploymentPopup",
      this.handleClickOpenSetDeploymentPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenImportanceOrderListPopup",
      this.handleClickOpenImportanceOrderListPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenPeriodOrderListPopup",
      this.handleClickOpenPeriodOrderListPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenSymptomDetail",
      this.handleClickOpenSymptomDetailPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenGuidanceFeeMaster",
      this.handleClickOpenGuidanceFeeMasterPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenDischargePermitOrder",
      this.handleclickOpenDischargePermitOrderPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenDischargeDecisionOrder",
      this.handleclickOpenDischargeDecisionOrderPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenDeathRegister",
      this.handleclickOpenDeathRegisterPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenDischargeDoneOrder",
      this.handleclickOpenDischargeDoneOrderPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenHospitalDoneOrder",
      this.handleclickOpenHospitalDoneOrderPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenInstructionBookCalendar",
      this.handleclickOpenInstructionBookCalendarPopup.bind(this)
    );
    patientModalEvent.addListener(
      "clickOpenHospitalDisease",
      this.handleclickOpenHospitalDiseasePopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenMedicineGuidance",
      this.handleclickOpenMedicineGuidancePopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenNutritionGuidance",
      this.handleclickOpenNutritionGuidancePopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenSoapFocus",
      this.handleclickOpenSoapFocusPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickBacillusInspection",
      this.handleclickBacillusInspectionPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenPotionReportPopup",
      this.handleclickPotionReportPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenHospitalPrescriptionPopup",
      this.handleclickHospitalPrescriptionPopup.bind(this)
    );

    patientModalEvent.addListener(
      "clickOpenAccountOrderPopup",
      this.handleClickOpenAccountOrderPopup.bind(this)
    );

    // from 看護問題リスト ワープロ登録

    patientModalEvent.addListener(
      "clickOpenPatientDiseaseFromNursePopup",
      this.handleClickOpenPatientDiseaseFromNursePopup.bind(this)
    );

    // from 看護問題リスト 過去歴参照

    patientModalEvent.addListener(
      "clickOpenPatientDiseaseFromNursePastPopup",
      this.handleClickOpenPatientDiseaseFromNursePastPopup.bind(this)
    );
    this.openModalTime = null;
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;    
    
  }

  async componentDidMount() {
    setTimeout(async() => {
      await auth.checkPatientReadingState(this.props.patientId);
      await this.getPatientState();
      await this.getDoctorsList();
    }, 3000);

    if(this.context.$getKarteMode(this.props.patientId) != KARTEMODE.READ){
      this.edit_karte_flag = setInterval(async()=>{
        this.checkEditKarteData();
        this.checkEditKarteDepartment();
      }, 1*1000)
    }
    this.patient_check_timer = setInterval(() => {
      auth.checkPatientReadingState(this.props.patientId);
      setTimeout(() => {
        this.setState({re_draw:!this.state.re_draw});
      }, 500);
    }, 60 * 1000);
  }

  async getDoctorsList() {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    this.setState({ doctors: data });
  }

  getConditionByAdditions = async () => {
    let { data } = await axios.post(
      "/app/api/v2/order/prescription/getConditionByAdditions",
      {system_patient_id:parseInt(this.props.patientId)}
    );
    this.context.$updateAdditionCondition(data);
  };

  getPatientState = async () => {
    let data = await apiClient._post(
      "/app/api/v2/order/hospital/getPatientState",
      {system_patient_id:parseInt(this.props.patientId)}
    );
    Object.keys(data).map((key)=>{
      let item = data[key];
      if (key === "patient_data") {
        this.setState({patient_data: item});
      } else {
        this.getSelected(item);
      }
    });
  };

  patientInfoRefresh = async () => {
    let data = await apiClient._post(
      "/app/api/v2/order/hospital/getPatientState",
      {system_patient_id:parseInt(this.props.patientId)}
    );

    Object.keys(data).map((key)=>{
      let item = data[key];
      if (key === "patient_data") this.setState({patient_data: item});
      else this.getSelected(item)
    });
  }
  
  componentWillUnmount() {
    patientModalEvent.removeAllListeners();
    clearInterval(this.edit_karte_flag);
    clearInterval(this.patient_check_timer);
  }

  handleClickOpenDetailedPatientPopup(tabIndex) {
    this.setState({ isPopupOpen: true, tabIndex: tabIndex });
  }

  handleClickOpenPatientDiseaseNamePopup() {
    this.setState({ isDiseaseNameOpen: true });
  }

  handleClickOpenPatientDiseaseFromNursePopup() {
    this.setState({
      isDiseaseNameOpen: true,
      diseaseInitTab: 'フリー入力'
    });
  }

  handleClickOpenPatientDiseaseFromNursePastPopup() {
    this.setState({
      isDiseaseNameOpen: true,
      diseaseInitTab: '過去病名参照'
    });
  }

  handleClickOpenExaminationPopup(tabIndex, from_mode) {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({
        openDoctorModal: true,
        toOpenModal:"isExaminationPopupOpen",
        tabIndex: tabIndex,
        examination_type: tabIndex.ele != undefined ? tabIndex.ele.examination_type : null,
        modalName: tabIndex.name != undefined ? tabIndex.name : null,
        from_mode
      });
    } else {
      // this.getExamination();
      // this.getExaminationPreset();
      this.setState({
        isExaminationPopupOpen: true,
        tabIndex: tabIndex,
        from_mode: from_mode,
        examination_type: tabIndex.ele != undefined ? tabIndex.ele.examination_type : null,
        modalName: tabIndex.name != undefined ? tabIndex.name : null
      });
    }
  }
  handleClickOpenPhysiologicalPopup(menu_item) {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({
        openDoctorModal: true,
        toOpenModal:"isPhysiologicalPopupOpen",
        inspectionId: menu_item.ele.inspectionId,
        modalName: menu_item.name
      });

    } else {
      this.setState({
        cache_index: null,
        isPhysiologicalPopupOpen: true,
        inspectionId: menu_item.ele.inspectionId,
        modalName: menu_item.name
      });
    }
  }
  handleClickOpenOutpatientPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {

      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOutpatientPopupOpen"});

    } else {

      this.setState({
        cache_index: null,
        isOutpatientPopupOpen: true,
      });
    }
  }
  handleClickOpenInstructionBookPopup() {

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {

      this.setState({openDoctorModal: true, toOpenModal:"isInstructionBookPopupOpen"});

    } else {

      this.setState({
        cache_index: null,
        isInstructionBookPopupOpen: true,
      });
    }
  }
  handleClickOpenInstructionBookListPopup() {

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {

      this.setState({openDoctorModal: true, toOpenModal:"isInstructionBookListPopupOpen"});

    } else {

      this.setState({
        cache_index: null,
        isInstructionBookListPopupOpen: true,
      });
    }
  }
  handleClickOpenStopPrescriptionPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isStopPrescriptionPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isStopPrescriptionPopupOpen: true,
      });
    }
  }
  handleClickOpenOutHospitalGroupDeletePopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isOutHospitalGroupDeletePopup"});
    } else {
      this.setState({
        cache_index: null,
        isOutHospitalGroupDeletePopup: true,
      });
    }
  }

  handleClickOpenMoveMealCalendarPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isMoveMealCalendarPopup"});
    } else {
      this.setState({
        cache_index: null,
        isMoveMealCalendarPopup: true,
      });
    }
  }

  handleClickOpenBatchDoPrescriptionListPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isBatchDoPrescriptionListPopup"});
    } else {
      this.setState({
        cache_index: null,
        isBatchDoPrescriptionListPopup: true,
      });
    }
  }

  handleClickOpenNursePlanPopup() {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
    //   this.setState({openDoctorModal: true, toOpenModal:"isNursePlanPopup"});
    // } else {
      this.setState({
        cache_index: null,
        isNursePlanPopup: true,
      });
    // }
  }

  handleClickOpenNursePlanReferencePopup() {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
    //   this.setState({openDoctorModal: true, toOpenModal:"isNursePlanReferencePopup"});
    // } else {
      this.setState({
        cache_index: null,
        isNursePlanReferencePopup: true,
      });
    // }
  }

  getWorkSheetMaster = async() => {
    let path = "/app/api/v2/ward/get_work_sheet_master";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let work_sheet_master = this.state.work_sheet_master;
        if(res.work_sheet_master.length > 0){
          work_sheet_master = res.work_sheet_master;
        }
        this.setState({
          work_sheet_master,
        });
      })
      .catch(() => {
      
      });
  };

  async handleClickOpenIndividualWorkSheetPopup() {

    // K142 ワークシート 種類選択無しモードの追加
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let nursing_worksheet_mode_selectable = "ON";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
     if(initState.conf_data.nursing_worksheet_mode_selectable !== undefined){
       nursing_worksheet_mode_selectable = initState.conf_data.nursing_worksheet_mode_selectable;
     }     
    }

    if (nursing_worksheet_mode_selectable == "on") {
      await this.getWorkSheetMaster();
    }

    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
    //   this.setState({openDoctorModal: true, toOpenModal:"isIndividualWorkSheetPopup"});
    // } else {
      this.setState({
        cache_index: null,
        isIndividualWorkSheetPopup: true,
        nursing_worksheet_mode_selectable: nursing_worksheet_mode_selectable
      });
    // }
  }

  handleClickNurseInstructionPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isNurseInstructionPopup"});
    } else {
      this.setState({
        cache_index: null,
        isNurseInstructionPopup: true,
      });
    }
  }
  handleClickHospitalInstructionPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isHospitalInstructionPopup"});
    } else {
      this.setState({
        cache_index: null,
        isHospitalInstructionPopup: true,
      });
    }
  }
  handleClickProgressChartPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isProgressChartPopup"});
    } else {
      this.setState({
        cache_index: null,
        isProgressChartPopup: true,
      });
    }
  }

  handleClickNurseProfilePopup() {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
    //   this.setState({openDoctorModal: true, toOpenModal:"isNurseProfilePopup"});
    // } else {
      this.setState({
        cache_index: null,
        isNurseProfilePopup: true,
      });
    // }
  }

  handleClickNurseAnamunePopup() {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
    //   this.setState({openDoctorModal: true, toOpenModal:"isNurseAnamunePopup"});
    // } else {
      this.setState({
        cache_index: null,
        isNurseAnamunePopup: true,
      });
    // }
  }

  handleClickVisitNurseSummaryPopup() {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
    //   this.setState({openDoctorModal: true, toOpenModal:"isVisitNurseSummaryPopup"});
    // } else {
      this.setState({
        cache_index: null,
        isVisitNurseSummaryPopup: true,
      });
    // }
  }

  handleClickInchargeSheetPopup() {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
    //   this.setState({openDoctorModal: true, toOpenModal:"isInchargeSheetPopup"});
    // } else {
      this.setState({
        cache_index: null,
        isInchargeSheetPopup: true,
      });
    // }
  }

  handleClickAdministrationDiaryPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isAdministrationDiaryPopup"});
    } else {
      this.setState({
        cache_index: null,
        isAdministrationDiaryPopup: true,
      });
    }
  }

  handleClickNurseSummaryPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isNurseSummaryPopup"});
    } else {
      this.setState({
        cache_index: null,
        isNurseSummaryPopup: true,
      });
    }
  }

  handleClickOpenChangeMealPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isChangeMealPopup"});
    } else {
      this.setState({
        cache_index: null,
        isChangeMealPopup: true,
      });
    }
  }

  handleClickOpenChangeMealGroupPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isChangeMealGroupPopup"});
    } else {
      this.setState({
        cache_index: null,
        isChangeMealGroupPopup: true,
      });
    }
  }

  handleClickOpenAllergyPopup(menu_item) {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let value = menu_item.ele.allergy_type;
    if (value == "foodalergy" || value == "drugalergy") {
      let allergy_tab = 401;
      if (value == 'foodalergy') allergy_tab = 402;
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.setState({
          openDoctorModal: true,
          toOpenModal:"isPopupOpen",
          tabIndex:allergy_tab,
        });
      } else {
        this.setState({
          isPopupOpen: true,
          tabIndex:allergy_tab,
        });
      }
      return;
    }
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({
        openDoctorModal: true,
        toOpenModal:"isAllergyPopupOpen",
        allergy_type: menu_item.ele.allergy_type,
        modalName: menu_item.name
      });
    } else {
      this.setState({
        cache_index: null,
        isAllergyPopupOpen: true,
        allergy_type: menu_item.ele.allergy_type,
        modalName: menu_item.name
      });
    }
  }
  handleClickOpenAccountHospitalOrderPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isAccountHospitalOrderPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isAccountHospitalOrderPopupOpen: true,
      });
    }
  }

  handleClickOpenMedicalInfoPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isMedicalInfoPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isMedicalInfoPopupOpen: true,
      });
    }
  }
  handleclickOpenKartePrintPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isKartePrintPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isKartePrintPopupOpen: true,
      });
    }
  }

  handleClickOpenRehabilyPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isRehabilyPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isRehabilyPopupOpen: true,
      });
    }
  }

  handleClickOpenGuidancePopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context != null && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isGuidancePopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isGuidancePopupOpen: true,
      });
    }
  }

  handleClickOpenChangeResponsibilityPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context != null && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isChangeResponsibilityPopupOpen"});
    } else {
      this.setState({
        isChangeResponsibilityPopupOpen: true,
      });
    }
  }

  handleclickOpenHospitalApplicationOrderPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isOpenHospitalApplicationOrder"});
    } else {
      this.setState({
        isOpenHospitalApplicationOrder: true,
      });
    }
  }

  handleclickOpenHospitalDecisionOrderPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isOpenHospitalDecisionOrder"});
    } else {
      this.setState({
        isOpenHospitalDecisionOrder: true,
      });
    }
  }

  handleClickOpenAccountOrderPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isAccountOrderPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isAccountOrderPopupOpen: true,
      });
    }
  }

  handleClickOpenSimpleOrderPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isSimpleOrderPopupOpen"});
    } else {
      this.setState({
        isSimpleOrderPopupOpen: true,
      });
    }
  }

  handleClickOpenRadiationPopup(menu_item) {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({
        openDoctorModal: true,
        toOpenModal:"isRadiationPopupOpen",
        radiation_id : menu_item.ele.radiation_id
      });
    } else {
      this.setState({
        cache_index: null,
        isRadiationPopupOpen: true,
        radiation_id : menu_item.ele.radiation_id,
      });
    }
  }

  handleClickOpenHomeTreatmentPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isHomeTreatmentPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isHomeTreatmentPopupOpen: true,
      });
    }
  }
  handleClickOpenHospitalTreatmentPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isHospitalTreatmentPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isHospitalTreatmentPopupOpen: true,
      });
    }
  }

  handleClickOpenSetCreatePopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isSetCreatePopupOpen"});
    } else {
      this.setState({
        isSetCreatePopupOpen: true,
      });
    }
  }

  handleClickOpenSetRegisterPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isSetRegisterPopupOpen"});
    } else {
      this.setState({
        isSetRegisterPopupOpen: true,
      });
    }
  }

  handleClickOpenSetDeploymentPopup() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isSetDeploymentPopupOpen"});
    } else {
      this.setState({
        isSetDeploymentPopupOpen: true,
      });
    }
  }

  handleClickOpenImportanceOrderListPopup() {
    this.setState({
      isImportanceOrderListPopupOpen: true,
    });
  }

  handleClickOpenPeriodOrderListPopup() {
    this.setState({
      isPeriodOrderListPopupOpen: true,
    });
  }

  handleClickOpenSymptomDetailPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isSymptomDetailPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isSymptomDetailPopupOpen: true,
      });
    }
  }

  handleClickOpenGuidanceFeeMasterPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenGuidanceFeeMaster"});
    } else {
      this.setState({
        cache_index: null,
        isOpenGuidanceFeeMaster: true,
      });
    }
  }

  handleclickOpenDischargePermitOrderPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenDischargePermitOrder"});
    } else {
      this.setState({
        cache_index: this.state.cache_index,
        isOpenDischargePermitOrder: true,
      });
    }
  }
  handleclickOpenDischargeDecisionOrderPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenDischargeDecisionOrder"});
    } else {
      this.setState({
        isOpenDischargeDecisionOrder: true,
      });
    }
  }

  handleclickOpenBarcodeMountPrintPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenBarcodeMountPrint"});
    } else {
      this.setState({
        isOpenBarcodeMountPrint: true,
      });
    }
  }

  handleclickOpenDischargeDoneOrderPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenDischargeDoneOrder"});
    } else {
      this.setState({
        cache_index: this.state.cache_index,
        isOpenDischargeDoneOrder: true,
      });
    }
  }

  handleclickOpenDeathRegisterPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isOpenDeathRegister"});
    } else {
      this.setState({
        cache_index: this.state.cache_index,
        isOpenDeathRegister: true,
      });
    }
  }

  handleclickOpenHospitalDoneOrderPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenHospitalDoneOrder"});
    } else {
      this.setState({
        cache_index: null,
        isOpenHospitalDoneOrder: true,
      });
    }
  }

  handleclickOpenInstructionBookCalendarPopup=()=>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenInstructionBookCalendar"});
    } else {
      this.setState({
        isOpenInstructionBookCalendar: true,
      });
    }
  }

  handleclickOpenHospitalDiseasePopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenHospitalDisease"});
    } else {
      this.setState({
        cache_index: null,
        isOpenHospitalDisease: true,
      });
    }
  }

  handleclickOpenMedicineGuidancePopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenMedicineGuidance"});
    } else {
      this.setState({
        cache_index: null,
        isOpenMedicineGuidance: true,
      });
    }
  }

  handleclickOpenNutritionGuidancePopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context != undefined && this.context.selectedDoctor.code <= 0) {
      this.setState({openDoctorModal: true, toOpenModal:"isOpenNutritionGuidance"});
    } else {
      this.setState({
        cache_index: null,
        isOpenNutritionGuidance: true,
      });
    }
  }

  handleclickOpenSoapFocusPopup(){
    this.setState({isOpenSoapFocus: true,});
  }

  handleclickBacillusInspectionPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isOpenBacillusInspection"});
    } else {
      this.setState({
        cache_index: null,
        isOpenBacillusInspection: true,
      });
    }
  }
  handleclickPotionReportPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isPotionReportPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isPotionReportPopupOpen: true,
      });
    }
  }
  handleclickHospitalPrescriptionPopup(){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context != undefined && this.context.selectedDoctor.code <= 0) {
      // this.context.$selectDoctor(true);
      this.setState({openDoctorModal: true, toOpenModal:"isHospitalPrescriptionPopupOpen"});
    } else {
      this.setState({
        cache_index: null,
        isHospitalPrescriptionPopupOpen: true,
      });
    }
  }

  getModalFlag(key){
    switch(key){
      case "clickOpenPhysiologicalPopup":
        return 'isPhysiologicalPopupOpen';
      case "clickOpenOutpatientPopup":
        return 'isOutpatientPopupOpen';
      case "clickOpenInstructionBookPopup":
        return 'isInstructionBookPopupOpen';
      case "clickOpenInstructionBookListPopup":
        return 'isInstructionBookListPopupOpen';
      case "clickOpenStopPrescriptionPopup":
        return 'isStopPrescriptionPopupOpen';
      case "clickOpenOutHospitalGroupDeletePopup":
        return 'isOutHospitalGroupDeletePopup';
      case "clickOpenMoveMealCalendarPopup":
        return 'isMoveMealCalendarPopup';
      case "clickOpenChangeMealPopup":
        return 'isChangeMealPopup';
      case "clickOpenChangeMealGroupPopup":
        return 'isChangeMealGroupPopup';
      case "clickOpenOutReturnHospitalPopup":
        return 'isOutReturnHospitalPopup';
      case "clickOpenAllergyPopup":
        return 'isAllergyPopupOpen';
      case "clickOpenGuidancePopup":
        return 'isGuidancePopupOpen';
      case "clickOpenDocumentEdit":
        return 'isDocumentEditPopupOpen';
      case "clickOpenChangeResponsibilityPopup":
        return 'isChangeResponsibilityPopupOpen';
      case "clickOpenSimpleOrderPopup":
        return 'isSimpleOrderPopupOpen';
      case "clickOpenMedicalInfoPopup":
        return 'isMedicalInfoPopupOpen';
      case "clickOpenAccountHospitalOrderPopup":
        return 'isAccountHospitalOrderPopupOpen';
      case "clickOpenKartePrintPopup":
        return 'isKartePrintPopupOpen';
      case "clickOpenRehabilyPopup":
        return 'isRehabilyPopupOpen';
      case "clickOpenRadiationPopup":
        return 'isRadiationPopupOpen';
      case "clickNurseProfilePopup":
        return 'isNurseProfilePopup';
      case 'clickNurseAnamunePopup':
        return 'isNurseAnamunePopup';
      case 'clickVisitNurseSummaryPopup':
        return 'isVisitNurseSummaryPopup';
      case "clickInchargeSheetPopup":
        return 'isInchargeSheetPopup';
      case "clickAdministrationDiaryPopup":
        return 'isAdministrationDiaryPopup';
      case "clickNurseSummaryPopup":
        return "isNurseSummaryPopup";
      case "clickBacillusInspection":
        return 'isOpenBacillusInspection';
      case "clickOpenHomeTreatmentPopup":
        return 'isHomeTreatmentPopupOpen';
      case "clickOpenHospitalTreatmentPopup":
        return 'isHospitalTreatmentPopupOpen';
      case "clickOpenSetCreatePopup":
        return 'isSetCreatePopupOpen';
      case "clickOpenSetRegisterPopup":
        return 'isSetRegisterPopupOpen';
      case "clickOpenSetDeploymentPopup":
        return 'isSetDeploymentPopupOpen';
      case "clickOpenPotionReportPopup":
        return 'isPotionReportPopupOpen';
      case "clickOpenHospitalPrescriptionPopup":
        return 'isHospitalPrescriptionPopupOpen';
      case "clickOpenAccountOrderPopup":
        return 'isAccountOrderPopupOpen';
      case "clickOpenDischargePermitOrder":
        return 'isOpenDischargePermitOrder';
      case "clickOpenDischargeDecisionOrder":
        return 'isOpenDischargeDecisionOrder';
      case "clickOpenDischargeDoneOrder":
        return 'isOpenDischargeDoneOrder';
      case "clickOpenHospitalDoneOrder":
        return 'isOpenHospitalDoneOrder';
      case "clickOpenInstructionBookCalendar":
        return 'isOpenInstructionBookCalendar';
      case "clickOpenNutritionGuidance":
        return 'isOpenNutritionGuidance';
      case "clickOpenExaminationPopup":
        return 'isExaminationPopupOpen';
      case "clickOpenBarcodeMountPrint":
        return 'isOpenBarcodeMountPrint';
      case "clickOpenDischargeGuidanceReport":
        return 'isOpenDischargeGuidanceReport';
    }
  }

  handleClickEditModalPopup(item) {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (item.key !== "clickOpenDeathRegister" && authInfo.staff_category !== 1 && this.context !== undefined && this.context.selectedDoctor.code <= 0) {
      let _state = {openDoctorModal: true, toOpenModal:this.getModalFlag(item.key)};
      if (item.stampKey != undefined && item.stampKey != null) {
        _state.cache_index = item.stampKey;
      }
      this.setState(_state);
    } else {
      switch(item.key){
        case "clickOpenPhysiologicalPopup":
          this.setState({
            cache_index: item.stampKey,
            isPhysiologicalPopupOpen: true,
            inspectionId: null,
            modalName: null,
            from_mode:item.from_mode
          });
          break;
        case "clickOpenOutpatientPopup":
          this.setState({
            cache_index: item.stampKey,
            isOutpatientPopupOpen: true,
            from_mode:item.from_mode
          });
          break;
        case "clickOpenInstructionBookPopup":
          this.setState({
            cache_index: item.stampKey,
            isInstructionBookPopupOpen: true,
          });
          break;
        case "clickOpenInstructionBookListPopup":
          this.setState({
            cache_index: item.stampKey,
            isInstructionBookListPopupOpen: true,
          });
          break;
        case "clickOpenStopPrescriptionPopup":
          this.setState({
            cache_index: item.stampKey,
            isStopPrescriptionPopupOpen: true,
          });
          break;
        case "clickOpenOutHospitalGroupDeletePopup":
          this.setState({
            cache_index: item.stampKey,
            isOutHospitalGroupDeletePopup: true,
          });
          break;
        case "clickOpenMoveMealCalendarPopup":
          this.setState({
            cache_index: item.stampKey,
            isMoveMealCalendarPopup: true,
          });
          break;
        case "clickOpenBatchDoPrescriptionListPopup":
          this.setState({
            cache_index: item.stampKey,
            isBatchDoPrescriptionListPopup: true,
          });
          break;
        case "clickOpenNursePlanPopup":
          this.setState({
            cache_index: item.stampKey,
            isNursePlanPopup: true,
          });
          break;
        case "clickOpenNursePlanReferencePopup":
          this.setState({
            cache_index: item.stampKey,
            isNursePlanReferencePopup: true,
          });
          break;
        case "clickOpenIndividualWorkSheetPopup":
          this.setState({
            cache_index: item.stampKey,
            isIndividualWorkSheetPopup: true,
          });
          break;
        case "clickNurseInstructionPopup":
          this.setState({
            cache_index: item.stampKey,
            isNurseInstructionPopup: true,
          });
          break;
        case "clickHospitalInstructionPopup":
          this.setState({
            cache_index: item.stampKey,
            isHospitalInstructionPopup: true,
          });
          break;
        case "clickProgressChartPopup":
          this.setState({
            cache_index: item.stampKey,
            isProgressChartPopup: true,
          });
          break;
        case "clickNurseProfilePopup":
          this.setState({
            cache_index: item.stampKey,
            isNurseProfilePopup: true,
          });
          break;
        case 'clickNurseAnamunePopup':
          this.setState({
            cache_index: item.stampKey,
            isNurseAnamunePopup:true,
          });
          break;
        case "clickVisitNurseSummaryPopup":
          this.setState({
            cache_index: item.stampKey,
            isVisitNurseSummaryPopup: true,
          });
          break;          
        case "clickInchargeSheetPopup":
          this.setState({
            cache_index:item.stampKey,
            isInchargeSheetPopup: true,
          });
          return;
        case 'clickAdministrationDiaryPopup':
          this.setState({
            cache_index: item.stampKey,
            isAdministrationDiaryPopup: true,
          });
          break;
        case "clickNurseSummaryPopup":
          this.setState({
            cache_index: item.stampKey,
            isNurseSummaryPopup: true,
          });
          break;
        case "clickOpenChangeMealPopup":
          this.setState({
            cache_index: item.stampKey,
            isChangeMealPopup: true,
          });
          break;
        case "clickOpenChangeMealGroupPopup":
          this.setState({
            cache_index: item.stampKey,
            isChangeMealGroupPopup: true,
          });
          break;
        case "clickOpenOutReturnHospitalPopup":
          this.setState({
            cache_index: item.stampKey,
            isOutReturnHospitalPopup: true,
          });
          break;
        case "clickOpenAllergyPopup":
          this.setState({
            cache_index: item.stampKey,
            isExistCache: item.isExistCache,
            from_mode:item.from_mode,
            isAllergyPopupOpen: true,
            allergy_type: null,
            modalName: null
          });
          break;
        case "clickOpenGuidancePopup":
          this.setState({
            cache_index: item.stampKey,
            isGuidancePopupOpen: true,
            from_mode:item.from_mode
          });
          break;
        case "clickOpenChangeResponsibilityPopup":
          this.setState({
            isChangeResponsibilityPopupOpen: true,
          });
          break;
        case "clickOpenHospitalApplicationOrder":
          this.handleclickOpenHospitalApplicationOrderPopup();
          break;
        case "clickOpenHospitalDecisionOrder":
          this.handleclickOpenHospitalDecisionOrderPopup();
          break;
        case "clickOpenSimpleOrderPopup":
          this.setState({
            isSimpleOrderPopupOpen: true,
          });
          break;
        case "clickOpenMedicalInfoPopup":
          this.setState({
            cache_index: item.stampKey,
            isMedicalInfoPopupOpen: true,
          });
          break;
        case "clickOpenAccountHospitalOrderPopup":
          this.setState({
            cache_index: item.stampKey,
            isAccountHospitalOrderPopupOpen: true,
          });
          break;
        case "clickOpenKartePrintPopup":
          this.setState({
            cache_index:item.stampKey,
            isKartePrintPopupOpen:true,
          })
          break;
        case "clickOpenRehabilyPopup":
          this.setState({
            cache_index: item.stampKey,
            isRehabilyPopupOpen: true,
            from_mode:item.from_mode
          });
          break;
        case "clickOpenRadiationPopup":
          this.setState({
            cache_index: item.stampKey,
            isRadiationPopupOpen: true,
            from_mode:item.from_mode
          });
          break;
        case "clickBacillusInspection":
          this.setState({
            cache_index: item.stampKey,
            isOpenBacillusInspection: true,
          });
          break;
        case "clickOpenExaminationPopup":
          this.setState({
            cache_index: item.stampKey.stampKey != undefined ? item.stampKey.stampKey : null,
            isExaminationPopupOpen: true,
            from_mode:item.from_mode,
            examination_type: item.stampKey.examination_type != undefined ? item.stampKey.examination_type : null,
            modalName: item.stampKey.modalName != undefined ? item.stampKey.modalName : null
          });
          break;
        case "clickOpenHomeTreatmentPopup":
          this.setState({
            cache_index: item.stampKey,
            isHomeTreatmentPopupOpen: true,
            from_mode:item.from_mode
          });
          break;
        case "clickOpenHospitalTreatmentPopup":
          this.setState({
            cache_index: item.stampKey,
            isHospitalTreatmentPopupOpen: true,
            from_mode:item.from_mode
          });
          break;
        case "clickOpenSetCreatePopup":
          this.setState({
            isSetCreatePopupOpen: true,
          });
          break;
        case "clickOpenSetRegisterPopup":
          this.setState({
            isSetRegisterPopupOpen: true,
          });
          break;
        case "clickOpenSetDeploymentPopup":
          this.setState({
            isSetDeploymentPopupOpen: true,
          });
          break;
        case "clickOpenPotionReportPopup":
          this.setState({
            isPotionReportPopupOpen: true,
          });
          break;
        case "clickOpenHospitalPrescriptionPopup":
          this.setState({
            isHospitalPrescriptionPopupOpen: true,
          });
          break;
        case "clickOpenAccountOrderPopup":
          this.setState({
            isAccountOrderPopupOpen: true,
          });
          break;
        case "clickOpenDischargePermitOrder":
          this.setState({
            cache_index: item.stampKey,
            isOpenDischargePermitOrder: true,
          });
          break;
        case "clickOpenDischargeDecisionOrder":
          this.setState({
            cache_index: item.stampKey,
            isOpenDischargeDecisionOrder: true,
          });
          break;
        case "clickOpenDischargeDoneOrder":
          this.setState({
            cache_index: item.stampKey,
            isOpenDischargeDoneOrder: true,
          });
          break;
        case "clickOpenDeathRegister":
          this.setState({
            cache_index: item.stampKey,
            isOpenDeathRegister: true,
          });
          break;
        case "clickOpenBarcodeMountPrint":
          this.setState({
            isOpenBarcodeMountPrint: true,
          });
          break;
        case "clickOpenHospitalDoneOrder":
          this.setState({
            cache_index: item.stampKey,
            isOpenHospitalDoneOrder: true,
          });
          break;
        case "clickOpenInstructionBookCalendar":
          this.setState({
            cache_index: item.stampKey,
            isOpenInstructionBookCalendar: true,
          });
          break;
        case "clickOpenMedicineGuidance":
          this.setState({
            cache_index: item.stampKey,
            isOpenMedicineGuidance: true,
            from_mode:item.from_mode
          });
          break;
        case "clickOpenNutritionGuidance":
          this.setState({
            isOpenNutritionGuidance: true,
            from_mode:item.from_mode
          });
          break;
        case "clickOpenDischargeGuidanceReport":
          this.setState({
            cache_index: item.stampKey,
            isOpenDischargeGuidanceReport: true,
          });
          break;
        case "clickOpenDocumentEdit":
          this.setState({
            cache_index: item.stampKey,
            isDocumentEditPopupOpen: true,
            from_mode:item.from_mode
          });
          break;
        case "isPopupOpen":
          this.setState({isPopupOpen: true});
          break;
      }
    }
  }
  
  openPopup = (tabIndex) => {
    this.setState({ isPopupOpen: true, tabIndex: tabIndex });
  };

  openDiseaseNameModal = () => {
    this.setState({ isDiseaseNameOpen: true });
  };

  openInvitorPopup = (login_status) => {
    if (!(login_status == 1)) return;
    this.sendLog();
    this.setState({ isConcurrentPopupOpen: true });
  };

  closeModal = () => {
    if(this.state.confirm_type == "change_department"){
      this.context.$updateDepartment(this.state.cur_department_code, this.state.cur_department_name);
    }
    let state_data = {
      isPopupOpen: false,
      isOpenBasicInfo: false,
      isopenPatientStaffModal: false,
      isopenIntroductionModal: false,
      isOpenHistoryInfoModal: false,
      isOpenPeriodOrderListModal: false,
      isPotionReportPopupOpen: false,
      isHospitalPrescriptionPopupOpen: false,
      confirm_alert_title: "",
      confirm_message: "",
      confirm_type: "",
      first_modal: false,
    };
    this.setState(state_data);
  };
  closeConcurrentModal = () => {
    this.setState({ isConcurrentPopupOpen: false });
  };
  closeExamination = () => {
    this.setState({
      isExaminationPopupOpen: false,
      isPhysiologicalPopupOpen: false,
      isOutpatientPopupOpen: false,
      isMedicalInfoPopupOpen: false,
      isKartePrintPopupOpen : false,
      isRehabilyPopupOpen: false,
      isAllergyPopupOpen: false,
      isAccountHospitalOrderPopupOpen: false,
      isRadiationPopupOpen:false,
      isGuidancePopupOpen: false,
      isDocumentEditPopupOpen: false,
      isChangeResponsibilityPopupOpen: false,
      isOpenHospitalApplicationOrder:false,
      isOpenHospitalDecisionOrder:false,
      isSimpleOrderPopupOpen: false,
      isHomeTreatmentPopupOpen: false,
      isHospitalTreatmentPopupOpen: false,
      isSetCreatePopupOpen: false,
      isSetRegisterPopupOpen: false,
      isSetDeploymentPopupOpen: false,
      isImportanceOrderListPopupOpen: false,
      isPeriodOrderListPopupOpen: false,
      openAllergyListModal: false,
      isSymptomDetailPopupOpen:false,
      isOpenGuidanceFeeMaster:false,
      isOpenDischargePermitOrder:false,
      isOpenDischargeDecisionOrder:false,
      isOpenDischargeGuidanceReport:false,
      isOpenBarcodeMountPrint:false,
      isOpenDischargeDoneOrder:false,
      isOpenDeathRegister:false,
      isOpenHospitalDoneOrder:false,
      isOpenInstructionBookCalendar:false,
      isOpenHospitalDisease:false,
      isOpenMedicineGuidance:false,
      isOpenNutritionGuidance:false,
      isOpenSoapFocus:false,
      isOpenBacillusInspection:false,
      isInstructionBookPopupOpen:false,
      isInstructionBookListPopupOpen:false,
      isStopPrescriptionPopupOpen:false,
      isOutHospitalGroupDeletePopup:false,
      isMoveMealCalendarPopup:false,
      isBatchDoPrescriptionListPopup:false,
      isNursePlanPopup:false,
      isNursePlanReferencePopup:false,
      isIndividualWorkSheetPopup:false,
      isNurseInstructionPopup:false,
      isHospitalInstructionPopup:false,
      isProgressChartPopup:false,
      isNurseProfilePopup:false,
      isNurseAnamunePopup:false,
      isVisitNurseSummaryPopup:false,
      isInchargeSheetPopup:false,
      isAdministrationDiaryPopup:false,
      isNurseSummaryPopup:false,
      isChangeMealPopup:false,
      isChangeMealGroupPopup:false,
      isOutReturnHospitalPopup:false,
      isAccountOrderPopupOpen:false,
    });
  };

  closeDiseaseNameModal = () => {
    this.setState({isDiseaseNameOpen: false}, ()=>{
      let cur_url = window.location.href.split("/");
      if(cur_url[cur_url.length - 1] === 'prescription'){
        this.getConditionByAdditions();
      }
    });
  };

  getSelected = icon_various => {
    switch (icon_various) {
      case "disabled_status_no":
        return this.setState({ disabled: false });
      case "disabled_status_yes":
        return this.setState({ disabled: true });
      case "drugalergy_status_no":
        return this.setState({ drugalergy: false });
      case "drugalergy_status_yes":
        return this.setState({ drugalergy: true });
      case "foodalergy_status_no":
        return this.setState({ foodalergy: false });
      case "foodalergy_status_yes":
        return this.setState({ foodalergy: true });
      case "staff_status_no":
        return this.setState({ staff: false });
      case "staff_status_yes":
        return this.setState({ staff: true });
      case "ADL_status_no":
        return this.setState({ ADL: false });
      case "ADL_status_yes":
        return this.setState({ ADL: true });
      case "vaccine_status_no":
        return this.setState({ vaccine: false });
      case "vaccine_status_yes":
        return this.setState({ vaccine: true });
      case "infection_status_init":
        return this.setState({
          infection_positive: false,
          infection_no: false,
          infection_unknown: false,
          infection_negative: false
        });
      case "infection_status_positive":
        return this.setState({
          infection_positive: true,
          infection_no: false,
          infection_unknown: false,
          infection_negative: false
        });
      case "infection_status_no":
        return this.setState({
          infection_positive: false,
          infection_no: true,
          infection_unknown: false,
          infection_negative: false
        });
      case "infection_status_unknown":
        return this.setState({
          infection_positive: false,
          infection_no: false,
          infection_unknown: true,
          infection_negative: false
        });
      case "infection_status_negative":
        return this.setState({
          infection_positive: false,
          infection_no: false,
          infection_unknown: false,
          infection_negative: true
        });
      case "alergy_status_init":
        return this.setState({
          alergy_positive: false,
          alergy_no: false,
          alergy_unknown: false,
          alergy_negative: false
        });
      case "alergy_status_positive":
        return this.setState({
          alergy_positive: true,
          alergy_no: false,
          alergy_unknown: false,
          alergy_negative: false
        });
      case "alergy_status_no":
        return this.setState({
          alergy_positive: false,
          alergy_no: true,
          alergy_unknown: false,
          alergy_negative: false
        });
      case "alergy_status_unknown":
        return this.setState({
          alergy_positive: false,
          alergy_no: false,
          alergy_unknown: true,
          alergy_negative: false
        });
      case "alergy_status_negative":
        return this.setState({
          alergy_positive: false,
          alergy_no: false,
          alergy_unknown: false,
          alergy_negative: true
        });
    }
  };


  // getExamination = async () => {
  //   await apiClient.get("/app/api/v2/master/examination_order").then((res) => {
  //     this.setState({
  //       examinations: res
  //     });
  //   });
  // }
  // getExaminationPreset = async () => {
  //   await apiClient.get("/app/api/v2/order/examination/preset").then((res) => {
  //     this.setState({
  //       preset: res
  //     });
  //   });
  // }

  confirm = () => {
    this.setState({
      isExaminationPopupOpen: false
    });
  }

  getDepartment = e => {
    let edit_order_count = 0;
    let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    if(sort_data !== undefined && sort_data != null && Object.keys(sort_data).length > 0) {
      Object.keys(sort_data).map(sort_index=>{
        if(sort_data[sort_index]['order_key'] !== undefined){
          let key = sort_data[sort_index]['order_key'].split(':')[0];
          switch (key){
            case CACHE_LOCALNAMES.PRESCRIPTION_EDIT:
            case CACHE_LOCALNAMES.INJECTION_EDIT:
            case CACHE_LOCALNAMES.SOAP_EDIT:
            case CACHE_LOCALNAMES.EXAM_EDIT:
            case CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT:
            case CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT:
            case CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT:
            case CACHE_LOCALNAMES.INSPECTION_EDIT:
            case CACHE_LOCALNAMES.TREATMENT_EDIT:
            case CACHE_LOCALNAMES.ALLERGY_EDIT:
            case CACHE_LOCALNAMES.GUIDANCE_EDIT:
            case CACHE_LOCALNAMES.RIHABILY_EDIT:
            case CACHE_LOCALNAMES.RADIATION_EDIT:
              edit_order_count++;
              break;
          }
        }
      });
    }
    if(edit_order_count == 0){
      this.context.$updateDepartment(e.target.id, e.target.value);
    } else {
      let confirm_message = "発行準備中の内容があります。発行内容も" + e.target.value + "に変更しますか？";
      let hospital_cache_exist = false;
      let cacheInHospital = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
      if(cacheInHospital !== undefined && cacheInHospital != null){
        hospital_cache_exist = true;
      }
      let cacheHospitalDone = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE);
      if(cacheHospitalDone !== undefined && cacheHospitalDone != null){
        hospital_cache_exist = true;
      }
      let cacheChangeResponsibilityState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY);
      if(cacheChangeResponsibilityState !== undefined && cacheChangeResponsibilityState != null){
        hospital_cache_exist = true;
      }
      if(hospital_cache_exist){
        confirm_message = confirm_message + '\n' + "※ 入院・転科先は一括変更されません。指示を右クリックして指示内容を変更してください。";
      }
      this.setState({
        confirm_type:"change_department",
        confirm_alert_title:"診療科変更確認",
        first_modal: true,
        confirm_message,
        cur_department_code:e.target.id,
        cur_department_name:e.target.value,
      });
    }
  };

  setDepartmentInCache=()=>{
    let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    // let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    // let active_key_inject = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
    
    // YJ94 保存済みレコードの入外区変更と診療科変更は権限で制限する
    // ・左上で変えたときに、右カラムのものを変更するのは新規登録予定のデータだけにして過去データ編集削除の分は変えない

    let department_code = this.state.cur_department_code;
    let department_name = this.state.cur_department_name;
    Object.keys(sort_data).map(sort_index=>{
      if(sort_data[sort_index]['order_key'] !== undefined){
        let key = sort_data[sort_index]['order_key'].split(':')[0];
        let subkey = sort_data[sort_index]['order_key'].split(':')[1];
        let cache_data = karteApi.getVal(this.props.patientId, key);
        if(cache_data !== undefined && cache_data != null){
          switch (key){
            case CACHE_LOCALNAMES.INSPECTION_EDIT:
              if (cache_data[subkey].isForUpdate != 1) { // YJ94
                cache_data[subkey].department_id = department_code;
              }
              break;
            case CACHE_LOCALNAMES.RADIATION_EDIT:
              if (cache_data[subkey].isForUpdate != 1) { // YJ94                
                cache_data[subkey].department_id = department_code;
                cache_data[subkey].department_code = department_code;
              }
              break;
            case CACHE_LOCALNAMES.TREATMENT_EDIT:
              if (cache_data[subkey].header.isForUpdate != 1) { // YJ94                                
                cache_data[subkey].header.department_id = department_code;
              }
              break;
            case CACHE_LOCALNAMES.ALLERGY_EDIT:
              cache_data[subkey].department_id = department_code;
              break;
            case CACHE_LOCALNAMES.GUIDANCE_EDIT:
              if (cache_data[subkey].isForUpdate != 1) { // YJ94                                
                cache_data[subkey].department_id = department_code;
                cache_data[subkey].department_code = department_code;
              }
              break;
            case CACHE_LOCALNAMES.RIHABILY_EDIT:
              if (cache_data[subkey].isForUpdate != 1) { // YJ94                                
                cache_data[subkey].department_id = department_code;
              }
              break;
            case CACHE_LOCALNAMES.PRESCRIPTION_EDIT:              
              if (cache_data[subkey][0].isUpdate != 1) { // YJ94                                                
                cache_data[subkey][0].department_code = department_code;
                cache_data[subkey][0].department = department_name;
              }
              break;
            case CACHE_LOCALNAMES.INJECTION_EDIT:
              if (cache_data[subkey][0].isUpdate != 1) { // YJ94                                                                
                cache_data[subkey][0].department_code = department_code;
                cache_data[subkey][0].department = department_name;
              }
              break;
            case CACHE_LOCALNAMES.EXAM_EDIT:
            case CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT:
            case CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT:
            case CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT:
              if (!(cache_data.isForUpdate !== undefined && cache_data.isForUpdate === 1 && cache_data.is_done_edit !== null && cache_data.is_done_edit !== 1)) {
                cache_data.department_code = department_code;
              }
              break;
            case CACHE_LOCALNAMES.SOAP_EDIT:
              cache_data.department_code = department_code;
              cache_data.department_name = department_name;
              break;
          }
          karteApi.setVal(this.props.patientId, key, JSON.stringify(cache_data));
        }
      }
    });
    this.setState({
      confirm_alert_title:"",
      confirm_message:"",
      confirm_type:"",
      first_modal: false,
    }, ()=>{
      this.context.$updateDepartment(department_code, department_name);
      this.LoadingModalRef.current.callVisible(false);
    });
  }

  confirmOk=()=>{
    if(this.state.confirm_type == "change_department"){
      this.LoadingModalRef.current.callVisible(true);
      setTimeout(async() => {        
        this.setDepartmentInCache();
      }, 500);
    }
    if(this.state.confirm_type == "change_karte_status"){
      this.LoadingModalRef.current.callVisible(true);
      setTimeout(async() => {       
        this.setState({
          confirm_alert_title:"",
          confirm_message:"",
          confirm_type:"",
          first_modal: false,
        }, ()=>{
          this.changePrescriptionInjectionKarteStatus(this.state.cur_karte_status_code, this.state.cur_karte_status_name);
          this.context.$updateKarteStatus(this.state.cur_karte_status_code, this.state.cur_karte_status_name);
          this.LoadingModalRef.current.callVisible(false);
        })
      }, 500);
    }
  }

  getKarteStatus = e => {
    let patientInfo = karteApi.getPatient(this.props.patientId);
    if(patientInfo.is_hospital == 1 && (this.context.karte_status.code == 1) && e.target.id != 1){//入院中の患者
      this.setState({
        confirm_type:"change_karte_status",
        first_modal: true,
        confirm_alert_title:"区分変更確認",
        confirm_message:"入院中の患者ですが、入力の区分を切り替えますか？",
        cur_karte_status_code:e.target.id,
        cur_karte_status_name:e.target.value,
      });
    } else {
      this.changePrescriptionInjectionKarteStatus(e.target.id, e.target.value);
      this.context.$updateKarteStatus(e.target.id, e.target.value);
    }
  };

  changePrescriptionInjectionKarteStatus=(karte_status_code, karte_status_name)=>{
    let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    // 処方:karte_status保存
    let cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
    if (cacheState && cacheState.length > 0) {
      if (cacheState[0].karte_status_code != karte_status_code) {
        // 入院処方から外来/訪問に切り替えたときの初期状態処理
        if (parseInt(cacheState[0].karte_status_code) == 1) {
          cacheState[0].is_internal_prescription = 1; 
        } else if((parseInt(cacheState[0].karte_status_code) == 0 || parseInt(cacheState[0].karte_status_code) == 2) && karte_status_code == 1){
        // 外来・訪問から入院に切り替えたときの初期状態は「臨時」にしてください。
          cacheState[0].is_internal_prescription = 0; 
        }
        cacheState[0].karte_status_code = karte_status_code;
        cacheState[0].karte_status_name = karte_status_name;
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key, JSON.stringify(cacheState));
      }
    }
    active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
    // 注射:karte_status保存
    let cacheInjectState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
    if (cacheInjectState && cacheInjectState.length > 0) {
      if (cacheInjectState[0].karte_status_code != karte_status_code) {
        cacheInjectState[0].karte_status_code = karte_status_code;
        cacheInjectState[0].karte_status_name = karte_status_name;
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, active_key, JSON.stringify(cacheInjectState));
      }
    }
    // YJ94 保存済みレコードの入外区変更と診療科変更は権限で制限する
    // ・左上で変えたときに、右カラムのものを変更するのは新規登録予定のデータだけにして過去データ編集削除の分は変えない
    let edit_order_count = 0;
    let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    if(sort_data !== undefined && sort_data != null && Object.keys(sort_data).length > 0) {
      Object.keys(sort_data).map(sort_index=>{
        if(sort_data[sort_index]['order_key'] !== undefined){
          let key = sort_data[sort_index]['order_key'].split(':')[0];
          switch (key){
            case CACHE_LOCALNAMES.PRESCRIPTION_EDIT:
            case CACHE_LOCALNAMES.INJECTION_EDIT:
            case CACHE_LOCALNAMES.SOAP_EDIT:
            case CACHE_LOCALNAMES.EXAM_EDIT:
            case CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT:
            case CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT:
            case CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT:
            case CACHE_LOCALNAMES.INSPECTION_EDIT:
            case CACHE_LOCALNAMES.TREATMENT_EDIT:
            case CACHE_LOCALNAMES.ALLERGY_EDIT:
            case CACHE_LOCALNAMES.GUIDANCE_EDIT:
            case CACHE_LOCALNAMES.RIHABILY_EDIT:
            case CACHE_LOCALNAMES.RADIATION_EDIT:
              edit_order_count++;
              break;
          }
        }
      });
    }
    if (edit_order_count ==  0) return;
    let convert_kart_status = karte_status_code == 0 ? 1 : karte_status_code == 1 ? 3 : 2;
    Object.keys(sort_data).map(sort_index=>{
      if(sort_data[sort_index]['order_key'] !== undefined){
        let key = sort_data[sort_index]['order_key'].split(':')[0];
        let subkey = sort_data[sort_index]['order_key'].split(':')[1];
        let cache_data = karteApi.getVal(this.props.patientId, key);
        if(cache_data !== undefined && cache_data != null){
          if(key == CACHE_LOCALNAMES.INSPECTION_EDIT && cache_data[subkey].isForUpdate != 1){
            let inspection_info = getInspectionMasterInfo(cache_data[subkey].inspection_id);
            if(inspection_info.end_until_continue_type != 2){
              cache_data[subkey].karte_status = convert_kart_status;
            }
          } else {
            switch (key){
              case CACHE_LOCALNAMES.RADIATION_EDIT:
                if (cache_data[subkey].isForUpdate != 1) { // YJ94
                  cache_data[subkey].karte_status = convert_kart_status;
                }
                break;
              case CACHE_LOCALNAMES.TREATMENT_EDIT:
                if (cache_data[subkey].header.isForUpdate != 1) { // YJ94
                  cache_data[subkey].header.karte_status = convert_kart_status;
                }
                break;
              case CACHE_LOCALNAMES.ALLERGY_EDIT:
                cache_data[subkey].karte_status = convert_kart_status;
                break;
              case CACHE_LOCALNAMES.GUIDANCE_EDIT:
                if (cache_data[subkey].isForUpdate != 1) { // YJ94
                  cache_data[subkey].karte_status = convert_kart_status;
                }
                break;
              case CACHE_LOCALNAMES.RIHABILY_EDIT:
                if (cache_data[subkey].isForUpdate != 1) { // YJ94
                  cache_data[subkey].karte_status = convert_kart_status;
                }
                break;
              case CACHE_LOCALNAMES.PRESCRIPTION_EDIT:
                if (cache_data[subkey][0].isUpdate != 1) { // YJ94
                  cache_data[subkey][0].karte_status_code = karte_status_code;
                  cache_data[subkey][0].karte_status_name = karte_status_name;
                }
                break;
              case CACHE_LOCALNAMES.INJECTION_EDIT:
                if (cache_data[subkey][0].isUpdate != 1) { // YJ94
                  cache_data[subkey][0].karte_status_code = karte_status_code;
                  cache_data[subkey][0].karte_status_name = karte_status_name;
                }
                break;
              case CACHE_LOCALNAMES.EXAM_EDIT:
              case CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT:
              case CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT:
              case CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT:
                if (!(cache_data.isForUpdate !== undefined && cache_data.isForUpdate === 1 && cache_data.is_done_edit !== null && cache_data.is_done_edit !== 1)) {
                  cache_data.department_code = convert_kart_status;
                }
                break;
              case CACHE_LOCALNAMES.SOAP_EDIT:
                cache_data.department_code = convert_kart_status;
                break;
            }
          }
          karteApi.setVal(this.props.patientId, key, JSON.stringify(cache_data));
        }
      }
    });
  }

  closeAlertModal = () => {
    this.setState({
      alert_messages: ""
    });
  }

  closeKarte = () => {
    if (this.openModalTime != null && new Date().getTime() - this.openModalTime < 500) return;
    this.openModalTime = new Date().getTime();
    // カルテを閉じるは、常にSOAPに戻った場合押せるように。
    var path = window.location.href.split("/");
    if (path[path.length - 1] != "soap") return;
    this.props.openModal(this.props.patientId);
  }

  confirmPrescriptionCancel = () => {
    let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    if (this.state.canConfirm == 1) {
      if (this.props.patientId > 0) {
        if (this.state.cur_url == "prescription") {
          karteApi.delSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
        } else {
          active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
          karteApi.delSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
        }
      }
    }

    this.setState({
      prescription_confirm_message: "",
      okTitle: "",
      cancelTitle: ""
    });

    // call karte close
    this.props.openModal(this.props.patientId);
  }

  confirmPrescriptionOk = () => {
    let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    if (this.state.cur_url == "injection") active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
    if (this.state.canConfirm == 1) {

      if (this.props.patientId > 0) {
        let cache_prescription = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
        if (this.state.cur_url == "injection") cache_prescription = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
        let type = cache_prescription[0].isUpdate == 1 ? Karte_Types.Update : Karte_Types.Register;
        if (cache_prescription != undefined && cache_prescription != null && cache_prescription.length > 0) {

          // check error of prescription or injection data
          if (this.state.cur_url == "prescription" && this.checkPresDataFromPrescription(cache_prescription[0].presData, type) != true) {
            this.setState({
              prescription_confirm_message: "",
              okTitle: "",
              cancelTitle: ""
            });
            return;
          } else if(this.state.cur_url == "injection" && this.checkInjectDataFromInjection(cache_prescription[0].injectData, type) != true) {
            this.setState({
              prescription_confirm_message: "",
              okTitle: "",
              cancelTitle: ""
            });
            return;
          }

          cache_prescription[0].temp_saved = 1;
          cache_prescription[0].canConfirm = 2;
          let newStateStr = JSON.stringify(cache_prescription);
          if (this.state.cur_url == "prescription") {
            karteApi.setSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key, newStateStr, 'insert');
          } else {
            karteApi.setSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key, newStateStr, 'insert');
          }
        }
      }
    } else {

      if (this.props.patientId > 0) {
        if (this.state.cur_url == "prescription") {
          karteApi.delSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
        } else {
          karteApi.delSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
        }
      }
    }

    this.setState({
      prescription_confirm_message: "",
      okTitle: "",
      cancelTitle: ""
    });

    // call karte close
    this.props.openModal(this.props.patientId);
  }

  openBasicInfo = () => {
    this.setState({
      isOpenBasicInfo: true,
    });
  };

  openConsentedModal = () => {
    this.setState({
      hasNotConsentedData: true
    });

  };

  closeNotConsentedModal = () => {
    this.setState({ hasNotConsentedData: false });
  };

  openHospitalListModal = (value) => {
    if (value == "foodalergy" || value == "drugalergy") {
      let allergy_tab = 401;
      if (value == 'foodalergy') allergy_tab = 402;
      this.setState({
        isPopupOpen: true,
        tabIndex:allergy_tab,
      });
    } else {
      this.setState({
        openAllergyListModal: true,
        allergy_type: value
      });
    }
  };


  getDoctor = e => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(e.target.id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(e.target.id, e.target.getAttribute("label"), department_name);
    this.context.$selectDoctor(false);

    if (this.state.toOpenModal != undefined && this.state.toOpenModal != "") {
      this.setState({[this.state.toOpenModal]:true, openDoctorModal: false});
    }
  }

  closeDoctor = () => {
    this.setState({openDoctorModal:false});
    this.context.$selectDoctor(false);
  };

  openPatientStaffModal = () => {
    this.setState({isopenPatientStaffModal: true});
  };

  openIntroductionModal = () => {
    this.setState({isopenIntroductionModal: true});
  };

  openHistoryModal = () => {
    this.setState({isOpenHistoryInfoModal : true});
  };

  openPeriodOrderListModal = () => {
    this.setState({isOpenPeriodOrderListModal : true});
  };

  editTooltip = async(e, tooltip_type, patientInfo=null) => {
    let {patient_data} = this.state;
    // tallAndWeight => 身長・体重
    if ((patient_data[tooltip_type] === undefined || patient_data[tooltip_type] == null) && tooltip_type != "tallAndWeight") return;
    let content = null;
    if (tooltip_type != "tallAndWeight") {
      content = this.makeTooltipContent(patient_data[tooltip_type],tooltip_type);
    }
    this.setState({
      tooltip: {
        visible: true,
        x: e.clientX,
        y: e.clientY+window.pageYOffset + 20,
      },
      tooltip_content:content,
      tooltip_type,
      toolPatientInfo: patientInfo
    });
  };

  hideTooltip = () => {
    this.setState({ tooltip: { visible: false} });
  };

  makeTooltipContent = (data, tooltip_type) => {
    let result = [];
    if (tooltip_type == "staff") {
      result['title'] = "担当職員";
    } else if (tooltip_type == "introduction") {
      result['title'] = "紹介情報";
    } else if (tooltip_type == "foodalergy") {
      result['title'] = "食物アレルギー";
    } else if (tooltip_type == "drugalergy") {
      result['title'] = "薬剤アレルギー";
    } else {
      result['title'] = ALLERGY_TYPE_ARRAY[data.type];
    }
    if (tooltip_type == 'foodalergy' || tooltip_type == 'drugalergy') {
      result['body_1'] = data.allergen_name;
      result['body_2'] = "症状: " + data.symptom;
      if (data.start_date != null && data.start_date != '')
        result['start_date'] = "開始日: " + formatJapan(data.start_date);
    } else {
      if (data.body_2 !== undefined) {
        result['body_1'] = data.body_1;
        if (data.type == "infection" || data.type == "alergy") {
          result['body_2'] = "状態:" + ALLERGY_STATUS_ARRAY[data.body_2];
        } else {
          result["body_2"] = data.body_2;
        }
      } else {
        result['body_1'] = data;
      }

    }
    return result;
  };

  // 処方以外のページをクリックした場合警告表示処理
  checkPresDataFromPrescription = (presData) => {
    let validationPassed = true;
    let strMessage = "";

    // 用法用量の確認
    let arrNotAllow = [];
    presData.map(item => {
      item.medicines.map(med=>{
        if(med.usage_permission !== undefined && med.usage_permission < 0) {
          validationPassed = false;
          arrNotAllow.push("・" + med.medicineName);
        }
      })
    });

    if (validationPassed == false) {
      strMessage = "用法用量の確認が必要な薬剤があります。処方箋からクリックして確認してください\n対象：\n" + arrNotAllow.join("\n");

      this.setState({alert_messages: strMessage});
      return false;
    }


    // 数量がない
    presData.map(item => {
      item.medicines.map(medicine => {
        if (
          medicine.medicineName !== "" &&
          medicine.amount === undefined
        ) {
          validationPassed = false;
        }
      });
    });

    if (validationPassed === false) {
      strMessage = "薬品の数量を入力して下さい。";

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    // 数量がない
    let selMedicines = [];
    let medList = "";
    presData.map(item => {
      item.medicines.map(medicine => {
        if(medicine.period_permission !== undefined && medicine.period_permission < 0) {
          validationPassed = false;
          if(!selMedicines.includes(medicine.medicineId)) {
            selMedicines.push(medicine.medicineId);
            medList += "◆" + medicine.medicineName + "\n";
            if(medicine.gene_name) {
              medList += "(" + medicine.gene_name + ")\n";
            }
          }
        }
      });
    });

    if (validationPassed === false) {
      strMessage = "有効期間外の薬品があります。処方前に削除または別の製品に変更してください。\n" + medList;

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    // 用法がない
    presData.map(item => {
      if (
        item.medicines.length >= 1 &&
        item.medicines[0].medicineName !== "" &&
        item.usageName === ""
      ) {
        validationPassed = false;
      }
    });

    if (validationPassed === false) {
      strMessage = "用法方法を入力して下さい。";

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    // 日数がない
    presData.map(item => {
      if (item.usage_replace_number === undefined) {
        if (
          item.usageName !== "" &&
          item.days === 0
        ) {
          if (item.usageIndex !== 6 && item.enable_days === 1) {
            validationPassed = false;
          }
        }
      } else {
        if (
          item.usageName !== "" &&
          (item.days === 0 &&
            item.usage_replace_number.length === 0)
        ) {
          if (item.usageIndex !== 6 && item.enable_days === 1) {
            validationPassed = false;
          }
        }
      }

    });

    if (validationPassed === false) {
      strMessage = "用法の日数を入力して下さい。";

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    // 用法 is_enabled
    presData.map(item => {
      if (this.hasPrescriptionUnenabledUsage(item.usage) == true) {
        validationPassed = false;
      }

    });

    if (validationPassed === false) {
      strMessage = "使用できない用法が選択されています。登録する場合は用法を変更してください";

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    return validationPassed;
  }

  hasPrescriptionUnenabledUsage = (usage_number) => {
    // let usageData = JSON.parse(window.localStorage.getItem("haruka_cache_usageData"));
    let usageData = {};
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.prescription_usage != undefined && init_status.prescription_usage != null) {
      usageData = init_status.prescription_usage;
    }
    // let usageNumberArray = [];
    if (usage_number == null || usage_number == undefined) {
      return false;
    }

    let nHasUnenabledUsage = 0;
    if (usageData != null && usageData != undefined) {
      usageData.external.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.injection.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      if (usageData.internal != null && usageData.internal.internal_other != null){
        usageData.internal.internal_other.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_1.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_2.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_3.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.when_necessary.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
    }
    return false;
  }

  // 注射以外のページをクリックした場合警告表示処理
  checkInjectDataFromInjection = (presData) => {
    let validationPassed = true;
    let strMessage = "";

    // 数量がない
    presData.map(item => {
      item.medicines.map(medicine => {
        if (
          medicine.medicineName !== "" &&
          (medicine.amount === undefined)
        ) {
          validationPassed = false;
        }
      });
    });

    if (validationPassed === false) {
      strMessage = "注射の数量を入力して下さい。";

      this.setState({alert_messages: strMessage});
      return false;
    }

    // 数量がない
    let selMedicines = [];
    let medList = "";
    presData.map(item => {
      item.medicines.map(medicine => {
        if(medicine.period_permission !== undefined && medicine.period_permission < 0) {
          validationPassed = false;
          if(!selMedicines.includes(medicine.medicineId)) {
            selMedicines.push(medicine.medicineId);
            medList += "◆" + medicine.medicineName + "\n";
            if(medicine.gene_name) {
              medList += "(" + medicine.gene_name + ")\n";
            }
          }
        }
      });
    });

    if (validationPassed === false) {
      strMessage = "有効期間外の薬品があります。削除または別の製品に変更してください。\n" + medList;

      this.setState({alert_messages: strMessage});
      return false;
    }


    // 用法がない
    // presData.map(item => {
    //   if (
    //     item.medicines.length >= 1 &&
    //     item.medicines[0].medicineName !== "" &&
    //     (item.usageName === "" || item.usageName === undefined)
    //   ) {
    //     validationPassed = false;
    //   }
    // });
    presData.map(item => {
      if (
        item.medicines.length >= 1 &&
        item.medicines[0].medicineName !== "" &&
        (item.usageName === "" || item.usageName === undefined)
      ) {
        validationPassed = false;
      }
    });

    if (validationPassed === false) {
      strMessage = "手技方法を入力して下さい。";

      this.setState({alert_messages: strMessage});
      return false;
      // alert("手技方法を入力して下さい。");
      // return false;
    }

    // 用法 is_enabled
    presData.map(item => {
      if (this.hasInjectionUnenabledUsage(item.usage) == true) {
        validationPassed = false;
      }

    });

    if (validationPassed === false) {
      strMessage = "使用できない手技が選択されています。登録する場合は手技を変更してください";

      this.setState({alert_messages: strMessage});
      return false;
    }

    return validationPassed;
  }

  hasInjectionUnenabledUsage = (usage_number) =>{
    // let usageData = JSON.parse(window.localStorage.getItem("haruka_cache_usageInjectData"));
    let usageData = {};
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.injection_usage != undefined && init_status.injection_usage != null) {
      usageData = init_status.injection_usage;
    }
    // let usageNumberArray = [];
    if (usage_number == null || usage_number == undefined) {
      return false;
    }

    let nHasUnenabledUsage = 0;
    if (usageData != null && usageData != undefined && usageData.length > 0) {
      usageData.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) {
        return true;
      }
    }
    return false;
  }

  handleInsuranceTypeChange = e => {
    this.setState({current_insurance_type: e.target.value});
    let patientInfo = karteApi.getPatient(this.props.patientId);
    patientInfo.insurance_type = e.target.value;
    let insurance_type = parseInt(e.target.value);
    let insurance_name = patientInfo.insurance_type_list.find((x) => x.code == insurance_type) != undefined ?
      patientInfo.insurance_type_list.find((x) => x.code == insurance_type).name : "";

    var path = window.location.href.split("/");
    karteApi.setPatient(this.props.patientId, JSON.stringify(patientInfo));
    let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    if(sort_data !== undefined && sort_data != null && Object.keys(sort_data).length > 0){
      Object.keys(sort_data).map(sort_index=>{
        if(sort_data[sort_index]['order_key'] !== undefined){
          let key = sort_data[sort_index]['order_key'].split(':')[0];
          let subkey = sort_data[sort_index]['order_key'].split(':')[1];
          if(subkey !== undefined){
            let cache_data = karteApi.getSubVal(this.props.patientId, key, subkey);
            if(key == CACHE_LOCALNAMES.TREATMENT_EDIT){
              cache_data.header.insurance_id = insurance_type;
              cache_data.header.insurance_name = insurance_name;
              karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, subkey, JSON.stringify(cache_data), 'insert');
            } else if(key == CACHE_LOCALNAMES.PRESCRIPTION_EDIT && path[path.length - 1] == "soap"){
              if (cache_data[0] != undefined && cache_data[0].presData != undefined && cache_data[0].presData.length > 0) {
                cache_data[0].presData.map(item=>{
                  item.insurance_type = insurance_type;
                  item.insurance_name = insurance_name;
                });
                karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, subkey, JSON.stringify(cache_data), 'insert');
              }
            } else if(key == CACHE_LOCALNAMES.INJECTION_EDIT && path[path.length - 1] == "soap"){
              if (cache_data[0] != undefined && cache_data[0].injectData != undefined && cache_data[0].injectData.length > 0) {
                cache_data[0].injectData.map(item=>{
                  item.insurance_type = insurance_type;
                  item.insurance_name = insurance_name;
                });
                karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, subkey, JSON.stringify(cache_data), 'insert');
              }
            }
          } else {
            let cache_data = karteApi.getVal(this.props.patientId, key);
            if(key == CACHE_LOCALNAMES.EXAM_EDIT || key == CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT || key == CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT || key == CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT){
              cache_data.insurance_type = insurance_type;
              cache_data.insurance_name = insurance_name;
              karteApi.setVal(this.props.patientId, key, JSON.stringify(cache_data), 'insert');
            }
          }
        }
      });
      $(".cache-insurance-name").html(insurance_name);
    }

    //cache-insurance-name
  };

  hasSameUser = (concurrentInfo) => {
    let result = 0;
    if (concurrentInfo !== null && concurrentInfo !== undefined && concurrentInfo.length > 1) {
      result = 1;
    }
    return result;
  }

  getEntranceId = () =>{
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let karte_in_out_enable_hospitalization = 0;
    let karte_in_out_enable_visiting = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.karte_in_out_enable_hospitalization !== undefined && initState.conf_data.karte_in_out_enable_hospitalization == "ON"){
        karte_in_out_enable_hospitalization = 1;
      }
      if(initState.conf_data.karte_in_out_enable_visiting !== undefined && initState.conf_data.karte_in_out_enable_visiting == "ON"){
        karte_in_out_enable_visiting = 1;
      }
    }
    let disabledValue = null;
    let patientInfo = karteApi.getPatient(this.props.patientId);
    let hospital_patient_flag = false;
    let visit_patient_flag = false;
    if(patientInfo != undefined && patientInfo != null){
      if(patientInfo.is_hospital == 1){
        hospital_patient_flag = true;
      }
      if(patientInfo.visit_info != undefined && patientInfo.visit_info != null && patientInfo.visit_info.is_visit == 1){
        visit_patient_flag = true;
      }
    }
    KARTE_STATUS_TYPE.map((item)=>{
      if (item.value == "入院" && (karte_in_out_enable_hospitalization == 0 || (hospital_patient_flag == false))){//config 設定, 入院中でない患者
        disabledValue = item.id;
      }
      if (item.value == "訪問診療" && (karte_in_out_enable_visiting == 0 || (visit_patient_flag == false))) {//config 設定, 訪問診療の施設やグループに所属していない患者
        disabledValue = disabledValue == null ? item.id : disabledValue+":"+item.id;
      }
    })
    return disabledValue;
  }

  getToolTip = () => {
    var path = window.location.href.split("/");
    if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection"){
      // let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
      // let cacheData = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
      // if (path[path.length - 1] == "injection") {
      //   active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
      //   cacheData = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
      // }
      // check edit prescription
      // if (cacheData != undefined && cacheData != null ) {
      // if (cacheData[0].temp_saved != undefined && cacheData[0].temp_saved != 1) {
      this.setState({tooltip_msg : "確認かキャンセルを押してください。"});
      // }
      // }
    }
  }

  checkEditKarteData=()=>{
    // カルテを閉じるは、常にSOAPに戻った場合押せるように。
    let result = false;
    var path = window.location.href.split("/");
    if (path[path.length - 1] == "soap"){
      let order_sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
      if (order_sort_data != undefined && order_sort_data != null && Object.keys(order_sort_data).length > 0) {
        result = true;
      }

      // check exit deleted data
      let existDelCacheData = karteApi.hasDeletedDataFromCache(this.props.patientId);
      if (existDelCacheData == true) {
        result = true;
      }
    }
    if(result){
      $(".btn-karte").addClass("has-save-data");
    } else {
      $(".btn-karte").removeClass("has-save-data");
    }
  }

  checkEditKarteDepartment = () => {
    // get current url
    var path = window.location.href.split("/");

    let permission_karte_department = {
      karte: true,
      department:true
    };

    if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
      permission_karte_department = this.canChangeKarteAndDepartment(path[path.length - 1]);
    }

    let isPrescriptionInjectionPage = path[path.length - 1] == "prescription" || path[path.length - 1] == "injection" ? true: false;
    
    if (isPrescriptionInjectionPage) {      

      if ( permission_karte_department.department != true) {
        $('.disable-department-status select').attr('disabled', true);
      } else {
        $('.disable-department-status select').attr('disabled', false);
      }

      if ( permission_karte_department.karte != true) {
        $('.disable-karte-status select').attr('disabled', true);
      } else {
        $('.disable-karte-status select').attr('disabled', false);
      }
    } else {
      $('.disable-department-status select').attr('disabled', false);
      $('.disable-karte-status select').attr('disabled', false);
    }   
    
  }

  getModeClassName = () => {
    switch(this.context.$getKarteMode(this.props.patientId)){
      case KARTEMODE.READ:
        return 'read-btn';
      case KARTEMODE.WRITE:
        return 'write-btn';
      case KARTEMODE.EXECUTE:
        return 'execute-btn';
    }
  }

  getModeName = () => {
    switch(this.context.$getKarteMode(this.props.patientId)){
      case KARTEMODE.READ:
        return '閲覧のみ';
      case KARTEMODE.WRITE:
        return '記載';
      case KARTEMODE.EXECUTE:
        return '事後';
    }
  }

  closeAllergy = (is_openList = 0, allergy_type) => {
    if (is_openList == 1) {
      this.setState({isAllergyPopupOpen: false, openAllergyListModal: true, allergy_type});
    } else {
      this.setState({isAllergyPopupOpen: false});
    }
  }

  getPatientName=(name)=>{
    if(name == undefined || name == null){
      return "";
    }
    let changed_name = hankaku2Zenkaku(name);
    changed_name = zenkana2Hankana(changed_name);
    return changed_name;
  }

  // ●YJ94 保存済みレコードの入外区変更と診療科変更は権限で制限する by p
  canChangeKarteAndDepartment = (_page) => {   
    let result = {
      karte: false,
      department: true
    };

    if (!(_page == "prescription" || _page == "injection")) return result;    

    let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, _page);
    
    let cacheState = null;
    let feature_type = this.context.FEATURES.PRESCRIPTION;
    if (_page == "prescription") {
      cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
    } else if(_page == "injection") {
      cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
    }    

    if (cacheState == undefined || cacheState == null || cacheState[0] == undefined || cacheState[0] == null) return result;

    if (cacheState[0].isUpdate == undefined || cacheState[0].isUpdate != 1) return result;

    if (cacheState[0].created_at == undefined || cacheState[0].created_at == "") return result;

    let curDate = new Date(getCurrentDate('-'));
    let start_date = new Date(cacheState[0].created_at.substring(0,10));
    
    // 「診療科修正(当日)」、「診療科修正(過去)」
    let canChangeDepartment = false;
    
    if (curDate.getTime() == start_date.getTime()) { // 「診療科修正(当日)」
      if (this.context.$canDoAction(feature_type, this.context.AUTHS.RECEIPT_CURRENT)){
        canChangeDepartment = true;
      }  
    } else if(start_date.getTime() < curDate.getTime()) { // 「診療科修正(過去)」
      if (this.context.$canDoAction(feature_type, this.context.AUTHS.RECEIPT)){
        canChangeDepartment = true;
      }
    }
    
    // 「入外区分修正(当日)」、「入外区分修正(過去)」
    let canChangeKarteStatus = false;
    if (curDate.getTime() == start_date.getTime()) { // 「入外区分修正(当日)」
      if (this.context.$canDoAction(feature_type, this.context.AUTHS.KARTE_STATUS_CURRENT)){
        canChangeKarteStatus = true;
      }  
    } else if(start_date.getTime() < curDate.getTime()) { // 「入外区分修正(過去)」
      if (this.context.$canDoAction(feature_type, this.context.AUTHS.KARTE_STATUS_PAST)){
        canChangeKarteStatus = true;
      }
    }
    result.karte = canChangeKarteStatus;
    result.department = canChangeDepartment;
    // ・定期処方を別の区分に変更するのは無しです。定期処方の編集時は権限があってもグレーアウトさせてください。
    if (_page == "prescription") {      
      // check ・定期処方
      if (cacheState[0].karte_status_code != undefined && parseInt(cacheState[0].karte_status_code) == 1 && cacheState[0].is_internal_prescription == 3) {
        result.karte = false;
      }
    } else if(_page == "injection") {
      // 定期注射 
      if (cacheState[0] != undefined && cacheState[0] != null && cacheState[0].injectData.length > 0) {
        let administrate_period_exist = 0;
        cacheState[0].injectData.map(item=>{
          if (item.administrate_period != undefined && item.administrate_period != null) {
            administrate_period_exist = 1;
          }
        });
        if (cacheState[0].karte_status_code != undefined && parseInt(cacheState[0].karte_status_code) == 1 && administrate_period_exist == 1) {
          result.karte = false;
        }
      }
    }
    return result;
  }

  render() {
    const {patientInfo, isPopupOpen, isConcurrentPopupOpen, isExaminationPopupOpen, isPhysiologicalPopupOpen, isOutpatientPopupOpen,
      isAllergyPopupOpen, isGuidancePopupOpen, isSimpleOrderPopupOpen, isMedicalInfoPopupOpen, isKartePrintPopupOpen,
      isRehabilyPopupOpen, isRadiationPopupOpen, isDiseaseNameOpen, isHomeTreatmentPopupOpen, isSymptomDetailPopupOpen,
      isImportanceOrderListPopupOpen, isPeriodOrderListPopupOpen, isSetCreatePopupOpen, isSetRegisterPopupOpen, isSetDeploymentPopupOpen,
      isOpenGuidanceFeeMaster, isOpenHospitalApplicationOrder, isOpenHospitalDecisionOrder, isOpenDischargePermitOrder,
      isOpenHospitalDisease, isOpenMedicineGuidance, isOpenNutritionGuidance,isOpenBacillusInspection,
      isInstructionBookPopupOpen, isInstructionBookListPopupOpen, isStopPrescriptionPopupOpen, isOutHospitalGroupDeletePopup,
      isPotionReportPopupOpen, isHospitalPrescriptionPopupOpen, isAccountHospitalOrderPopupOpen, isMoveMealCalendarPopup, isBatchDoPrescriptionListPopup,
      isAccountOrderPopupOpen, isChangeResponsibilityPopupOpen, isChangeMealPopup, isOutReturnHospitalPopup, isNurseInstructionPopup, isNurseProfilePopup,
      isNursePlanPopup, isNursePlanReferencePopup, isIndividualWorkSheetPopup, isOpenSoapFocus,isAdministrationDiaryPopup,isInchargeSheetPopup, isHospitalTreatmentPopupOpen,
      isOpenDischargeDecisionOrder, isOpenDischargeDoneOrder,isOpenHospitalDoneOrder, isChangeMealGroupPopup, isOpenBarcodeMountPrint, isOpenDischargeGuidanceReport,
      isDocumentEditPopupOpen, isOpenInstructionBookCalendar, isOpenDeathRegister, isVisitNurseSummaryPopup, isNurseAnamunePopup, isHospitalInstructionPopup
    } = this.state;
    const { patientId} = this.props;
    const { department, karte_status } = this.context;
    if(window.sessionStorage.getItem("concurrent_access_users") !== undefined){
      var concurrentInfo = JSON.parse(window.sessionStorage.getItem("concurrent_access_users"));
    }
    let disabledValue = this.getEntranceId();
    let {tooltip_msg} = this.state;
    // for worksheet
    // let workSheetPatientInfo = patientInfo;
    // workSheetPatientInfo.patient_id = patientId;    
    this.font_props = this.context.font_props;    

    return (
      <>
        <PatientCardWrapper id="patient-head-info" >
          <Wrapper>
            <Flex>
              <div className="div-left-side" style={{fontSize:this.font_props+'rem'}}>
                <div className={`disable-karte-status ${karte_status.name == '入院'?'patient-karte-status pink' : karte_status.name == '訪問診療'?'patient-karte-status green':'patient-karte-status'}`}>
                  <SelectorWithLabel
                    title=""
                    options={KARTE_STATUS_TYPE}
                    getSelect={this.getKarteStatus}
                    value={karte_status.name}
                    departmentEditCode={karte_status.code}
                    disabledValue={disabledValue}
                  />
                </div>
                <div className={`disable-department-status`}>
                  <SelectorWithLabel
                    title=""
                    options={this.departmentOptions}
                    getSelect={this.getDepartment}
                    value={department.name}
                    departmentEditCode={department.code}
                  />
                </div>
              </div>
              <div className="ml-2 div-patient-name">
                {patientInfo !== undefined && patientInfo != null && (
                  <Flex>
                    <div className="div-patient-info mr-2" style={{width:"8rem", marginTop:"3px"}}>
                      <PatientId style={{fontSize:1.1*this.font_props+'rem'}}>患者番号</PatientId>
                      <div className="sex-icon" style={{width:'auto', overflow:"hidden",fontSize:2*this.font_props+'rem'}}>
                        {patientInfo.sex === 1 ? (
                          <LargeUserIcon size="5x" color="#9eaeda" />
                        ) : (
                          <LargeUserIcon size="5x" color="#f0baed" />
                        )}
                      </div>
                      <div className="div-insurance" style={{fontSize:1*this.font_props+'rem'}}>
                        保険:
                        <select
                          value={this.state.current_insurance_type}
                          onChange={this.handleInsuranceTypeChange}
                          onKeyPress={this.handleInsuranceTypeChange}
                        >
                          {patientInfo.insurance_type_list != undefined && patientInfo.insurance_type_list != null && patientInfo.insurance_type_list.map(
                            (item, index) => {
                              return (
                                <option value={item.code} key={index}>{item.name}</option>
                              );
                            }
                          )}
                        </select>
                      </div>
                    </div>
                    <div
                      style={{width:'18.5rem'}}
                      className="name-area float-left"
                      onClick={this.openPopup.bind(this, 1)}
                      data-toggle="modal"
                      data-target="#modal-sample"
                    >
                      <PatientIdOne style={{fontSize:1.5*this.font_props+'rem'}}>{patientInfo.receId}</PatientIdOne>
                      <Kana style={{fontSize:1.1*this.font_props+'rem'}}>{patientInfo.kana}</Kana>
                      <PatientName style={{fontSize:1.4*this.font_props+'rem'}}>{this.getPatientName(patientInfo.name)}</PatientName>
                    </div>
                    <div className="patient-info float-left" style={{fontSize:0.875*this.font_props+'rem'}}>
                      <Flex>
                        <div>
                          <div className="title-style-1" style={{fontSize:1.1*this.font_props+'rem'}}>{patientInfo.birthDate}</div>
                          <div className="title-style-2" style={{fontSize:1.1*this.font_props+'rem'}}>
                            {patientInfo.age}歳 {patientInfo.age_month}ヶ月{patientInfo.is_death === 1 ? '*' : ''}
                          </div>
                          {patientInfo.ward_info !== undefined && (
                            <div className="title-style-3" style={{fontSize:1.1*this.font_props+'rem'}}>{patientInfo.ward_info}</div>
                          )}
                        </div>
                      </Flex>
                    </div>
                    <div className="float-left" id = "header-icon-groups">
                      <div className="icon-area d-flex">
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openConsentedModal} style={{cursor:"pointer"}}>
                          <AfflictionIcon image={navigation_status} />
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"infection")} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"infection")} onMouseOut={this.hideTooltip}>
                          {this.state.infection_positive ? (
                            <AfflictionIcon image={infection_status_positive} />
                          ) : (
                            ""
                          )}
                          {this.state.infection_no ? (
                            <AfflictionIcon image={infection_status_no} />
                          ) : (
                            ""
                          )}
                          {this.state.infection_unknown ? (
                            <AfflictionIcon image={infection_status_unknown} />
                          ) : (
                            ""
                          )}
                          {this.state.infection_negative ? (
                            <AfflictionIcon image={infection_status_negative} />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"disabled")} style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"disabled")} onMouseOut={this.hideTooltip}>
                          {this.state.disabled ? (
                            <AfflictionIcon image={disabled_status_yes} />
                          ) : (
                            <AfflictionIcon image={disabled_status_no} />
                          )}
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"alergy")} style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"alergy")} onMouseOut={this.hideTooltip}>
                          {this.state.alergy_positive ? (
                            <AfflictionIcon image={alergy_status_positive} />
                          ) : (
                            ""
                          )}
                          {this.state.alergy_no ? (
                            <AfflictionIcon image={alergy_status_no} />
                          ) : (
                            ""
                          )}
                          {this.state.alergy_unknown ? (
                            <AfflictionIcon image={alergy_status_unknown} />
                          ) : (
                            ""
                          )}
                          {this.state.alergy_negative ? (
                            <AfflictionIcon image={alergy_status_negative} />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"drugalergy")} style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"drugalergy")} onMouseOut={this.hideTooltip}>
                          {this.state.drugalergy ? (
                            <AfflictionIcon image={drugalergy_status_yes} />
                          ) : (
                            <AfflictionIcon image={drugalergy_status_no} />
                          )}
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"foodalergy")} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"foodalergy")} onMouseOut={this.hideTooltip}>
                          {this.state.foodalergy ? (
                            <AfflictionIcon image={foodalergy_status_yes} />
                          ) : (
                            <AfflictionIcon image={foodalergy_status_no} />
                          )}
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openPatientStaffModal.bind(this)} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"staff")} onMouseOut={this.hideTooltip}>
                          {this.state.staff ? (
                            <AfflictionIcon image={staff_status_yes} />
                          ) : (
                            <AfflictionIcon image={staff_status_no} />
                          )}
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"adl")} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"adl")} onMouseOut={this.hideTooltip}>
                          {this.state.ADL ? (
                            <AfflictionIcon image={ADL_status_yes} />
                          ) : (
                            <AfflictionIcon image={ADL_status_no} />
                          )}
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"vaccine")} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"vaccine")} onMouseOut={this.hideTooltip}>
                          {this.state.vaccine ? (
                            <AfflictionIcon image={vaccine_status_yes} />
                          ) : (
                            <AfflictionIcon image={vaccine_status_no} />
                          )}
                        </div>
                        <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openIntroductionModal.bind(this)} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"introduction")} onMouseOut={this.hideTooltip}>
                          <AfflictionIcon image={introduction_status} />
                        </div>
                      </div>
                      <div className="btn-area" style={{clear:'both', marginTop:'4px'}}>
                        <RightButtons font_props = {this.font_props}>
                          <Button className={this.getModeClassName() + ' bottom-line-button no-cursor'}>{this.getModeName()}</Button>
                          <Button onClick={this.openInvitorPopup.bind(this, this.hasSameUser(concurrentInfo))} className={this.hasSameUser(concurrentInfo)?'bottom-line-button grey-btn':'bottom-line-button grey-btn disabled-button'}>
                            閲覧中:{this.hasSameUser(concurrentInfo) == 1?concurrentInfo.length:1}
                          </Button>
                          <Button className={this.hasSameUser(concurrentInfo) == 1 ? "bottom-line-button grey-btn grey-btn-new" : "grey-btn bottom-line-button"} onClick={this.openBasicInfo.bind(this)}>基礎データ</Button>
                          <Button className={this.hasSameUser(concurrentInfo) == 1 ? "bottom-line-button grey-btn grey-btn-new" : "grey-btn bottom-line-button"} onClick={this.openHistoryModal.bind(this)}>受診歴</Button>
                          <Button className={this.hasSameUser(concurrentInfo) == 1 ? "bottom-period-order-button grey-btn grey-btn-new" : "grey-btn bottom-period-order-button"} style={{width:"2rem !important", minWidth:"2rem !important"}} onClick={this.openPeriodOrderListModal.bind(this)}>定</Button>
                        </RightButtons>
                        {/* {this.hasSameUser(concurrentInfo) == 1 && (
                          <div className="invitor_number float-left"
                               onClick={this.openInvitorPopup}>
                            同時閲覧ユーザー：{concurrentInfo.length}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </Flex>
                )}
              </div>
              <RightButtons font_props = {this.font_props}>
                <div className="div-right-side float-right">
                  <div className="right-btn-style-01">
                    <Button className="btn-prof1" onClick={this.openPopup.bind(this, 1)}>Prof</Button>
                    <Button className="btn-prof2" onClick={this.openDiseaseNameModal}>病名</Button>
                  </div>
                  <div className="right-btn-style-02">
                    <Button
                      className={'btn-karte'}
                      onClick={this.closeKarte.bind(this)} tooltip={tooltip_msg}
                      tooltip_position="bottom"
                      onMouseOver={this.getToolTip.bind(this)}
                    >
                      カルテ<br/>閉じる
                    </Button>
                  </div>
                </div>
              </RightButtons>
            </Flex>
          </Wrapper>
        </PatientCardWrapper>
        {this.context.autoLogoutModalShow === false && isPopupOpen && (
          <DetailedPatient
            id="modal-sample"
            tabIndex={this.state.tabIndex}
            closeModal={this.closeModal}
            patientId={patientId}
            getSelected={this.getSelected}
            detailedPatientInfo={this.props.detailedPatientInfo}
            patientInfoRefresh={this.patientInfoRefresh}
          />
        )}
        {this.context.autoLogoutModalShow === false && isDiseaseNameOpen && (
          <DiseaseNameModal
            patientId={patientId}
            closeModal={this.closeDiseaseNameModal}
            detailedPatientInfo={this.props.detailedPatientInfo}
            initTab={this.state.diseaseInitTab != undefined && this.state.diseaseInitTab != null ? this.state.diseaseInitTab : null}
          />
        )}
        {this.context.autoLogoutModalShow === false && isExaminationPopupOpen && (
          <SelectExaminationModal
            closeExamination={this.closeExamination}
            patientInfo={patientInfo}
            patientId={patientId}
            selectExaminationFromModal={this.selectExaminationFromModal}
            examinations={this.state.examinations}
            preset={this.state.preset}
            handleOk={this.confirm}
            cache_data={this.state.from_mode}
            examination_type={this.state.examination_type}
            modalName={this.state.modalName}
          />
        )}
        {this.context.autoLogoutModalShow === false && isPhysiologicalPopupOpen && (
          <PhysiologicalModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            inspectionId={this.state.inspectionId}
            modalName={this.state.modalName}
            patientId={patientId}
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            cache_data={this.state.from_mode}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOutpatientPopupOpen && (
          <OutPatientModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            cache_data={this.state.from_mode}
          />
        )}
        {this.context.autoLogoutModalShow === false && isInstructionBookPopupOpen && (
          <InstructionBookModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isInstructionBookListPopupOpen && (
          <InstructionBookListModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isStopPrescriptionPopupOpen && (
          <StopPrescriptionModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOutHospitalGroupDeletePopup && (
          <OutHospitalGroupDeleteModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isMoveMealCalendarPopup && (
          <MoveMealCalendar
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isBatchDoPrescriptionListPopup && (
          <BatchDoPrescriptionList
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isNursePlanPopup && (
          <NurseProblemListModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isNursePlanReferencePopup && (
          <NursePlanReferenceModal
            closeModal={this.closeExamination}
            patientId={patientId}
            patientInfo={patientInfo}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isIndividualWorkSheetPopup && this.state.nursing_worksheet_mode_selectable == "ON" && (
          <NurseCourseSeatModal
            closeModal = {this.closeExamination}
            selectedPatients={patientInfo}
            type={'individual'}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isIndividualWorkSheetPopup && this.state.nursing_worksheet_mode_selectable == "OFF" && (
          <WorkSheetModal
            closeModal = {this.closeExamination}
            selectedPatients={patientInfo}
            type={'individual'}
            patientId={patientId}
            course_date = {new Date()}                        
            worksheetInfo={null}            
          />
        )}
        {this.context.autoLogoutModalShow === false && isNurseInstructionPopup && (
          <NurseInstruction
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isHospitalInstructionPopup && (
          <BulkInstructionModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isNurseAnamunePopup && (
          <NurseAnamuneModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isNurseProfilePopup && this.nurse_profile_simple == 1 && (
          <NurseProfileDatabaseModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}        
        {this.context.autoLogoutModalShow === false && isNurseProfilePopup && this.nurse_profile_simple == 0 && (
          <NurseProfileModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isVisitNurseSummaryPopup && (
          <VisitNurseSummaryModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isInchargeSheetPopup && (
          <SelectShowModeModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isAdministrationDiaryPopup && (
          <AdministrationDiaryMenuModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isChangeMealPopup && (
          <ChangeMealModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isChangeMealGroupPopup && (
          <FoodGroupModal
            closeModal={this.closeExamination}
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientId={patientId}
            handleOk={this.closeExamination}
            patientInfo={patientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOutReturnHospitalPopup && (
          <OutReturnHospitalModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isAllergyPopupOpen && (
          <AllergyModal
            cache_index={this.state.cache_index !== undefined && this.state.cache_index != null && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            allergy_type={this.state.allergy_type}
            modalName={this.state.modalName}
            patientId={patientId}
            closeModal={this.closeAllergy}
            isExistCache = {this.state.isExistCache}
            cache_data={this.state.from_mode}
          />
        )}
        {this.context.autoLogoutModalShow === false && isAccountHospitalOrderPopupOpen && (
          <AccountHospitalOrderModal
            cache_index={this.state.cache_index !== undefined && this.state.cache_index != null && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            patientId={patientId}
            closeModal={this.closeExamination}
          />
        )}
        {this.state.openAllergyListModal && (
          <AllergyListModal
            allergy_type={this.state.allergy_type}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isRadiationPopupOpen && (
          <RadiationModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            patientId={patientId}
            radiation_id = {this.state.radiation_id}
            closeModal={this.closeExamination}
            cache_data={this.state.from_mode}
          />
        )}
        {this.context.autoLogoutModalShow === false && isGuidancePopupOpen && (
          <GuidanceModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            cache_data={this.state.from_mode}
          />
        )}
        {this.context.autoLogoutModalShow === false && isDocumentEditPopupOpen && (
          <DocumentEdit
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            cache_data={this.state.from_mode}
          />
        )}
        {this.context.autoLogoutModalShow === false && isChangeResponsibilityPopupOpen && (
          <ChangeResponsibilityModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isAccountOrderPopupOpen && (
          <AccountOrder
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isSimpleOrderPopupOpen && (
          <SimpleOrder
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isMedicalInfoPopupOpen && (
          <MedicalInfoModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            patientId={patientId}
            closeModal={this.closeExamination}
          />
        )}

        {this.context.autoLogoutModalShow === false && isKartePrintPopupOpen && (
          <KartePrintModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            patientId={patientId}
            closeModal={this.closeExamination}
          />
        )}
        {this.context.autoLogoutModalShow === false && isRehabilyPopupOpen && (
          <RehabilitationModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            patientId={patientId}
            closeModal={this.closeExamination}
            cache_data={this.state.from_mode}
          />
        )}
        {this.context.autoLogoutModalShow === false && isHomeTreatmentPopupOpen && (
          <HomeTreatmentModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            cache_data={this.state.from_mode}
          />
        )}
        {this.context.autoLogoutModalShow === false && isHospitalTreatmentPopupOpen && (
          <OutPatientModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            cache_data={this.state.from_mode}
            is_hospital={1}
          />
        )}
        {this.context.autoLogoutModalShow === false && isSetCreatePopupOpen && (
          <SetCreateModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isSetRegisterPopupOpen && (
          <SetRegisterModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isSetDeploymentPopupOpen && (
          <SetDeploymentModal
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isImportanceOrderListPopupOpen && (
          <ImportanceOrderListModal
            closeModal={this.closeExamination}
            patientId={patientId}
            patientInfo={patientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isPeriodOrderListPopupOpen && (
          <PeriodOrderListModal
            closeModal={this.closeExamination}
            patientId={patientId}
            patientInfo={patientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isSymptomDetailPopupOpen && (
          <SymptomDetailModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}

        {this.context.autoLogoutModalShow === false && isOpenGuidanceFeeMaster && (
          <GuidanceFeeMasterModal
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}

        {this.context.autoLogoutModalShow === false && isOpenHospitalApplicationOrder && (
          <HospitalApplicationOrder
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenHospitalDecisionOrder && (
          <HospitalApplicationOrder
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            type ={'decision'}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenDischargePermitOrder && (
          <DischargePermitOrder
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenDischargeDecisionOrder && (
          <KarteDischargeHospitalDecision
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenDischargeGuidanceReport && (
          <LeaveHospitalGuidanceReport
            closeModal={this.closeExamination}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenDischargeDoneOrder && (
          <KarteDischargeHospital
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenDeathRegister && (
          <DeathRegister
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenBarcodeMountPrint && (
          <BarcodeMountPrint
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenHospitalDoneOrder && (
          <KarteDoHospitalization
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenInstructionBookCalendar && (
          <InstructionbookCalendar
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
        {this.context.autoLogoutModalShow === false && isOpenHospitalDisease && (
          <HospitalDisease
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}

        {this.context.autoLogoutModalShow === false && isOpenMedicineGuidance && (
          <MedicinGuidance
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
            cache_data={this.state.from_mode}
          />
        )}

        {this.context.autoLogoutModalShow === false && isOpenNutritionGuidance && (
          <NutritionGuidance
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
            cache_data={this.state.from_mode}
          />
        )}

        {this.context.autoLogoutModalShow === false && isOpenSoapFocus && (
          <>
            {this.view_soap_focus_menu == 1 ? (
              <SoapFocus
                patientInfo={patientInfo}
                closeModal={this.closeExamination}
                patientId={patientId}
                detailedPatientInfo={this.props.detailedPatientInfo}
              />
            ):(
              <PassingTimeRecord
                patientInfo={patientInfo}
                closeModal={this.closeExamination}
                patientId={patientId}
              />
            )}
          </>
        )}

        {this.context.autoLogoutModalShow === false && isOpenBacillusInspection && (
          <BacillusInspection
            cache_index={this.state.cache_index != null && this.state.cache_index != undefined && this.state.cache_index > 0 ? this.state.cache_index : null }
            patientInfo={patientInfo}
            closeModal={this.closeExamination}
            patientId={patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}


        {this.context.autoLogoutModalShow === false && this.state.openDoctorModal === true && (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.state.doctors}
          />
        )}

        {this.context.autoLogoutModalShow === false && isConcurrentPopupOpen && (
          <ConcurrentuserModal
            id="modal-sample-1"
            tabIndex={this.state.tabIndex}
            closeConcurrentModal={this.closeConcurrentModal}
            patientId={patientId}
            getSelected={this.getSelected}
            concurrentInfo={concurrentInfo}
          />
        )}
        {this.state.isOpenBasicInfo && (
          <BasicInfoModal
            closeModal={this.closeModal}
            patientInfo={patientInfo}
            patientId={patientId}
          />
        )}
        {this.state.isopenPatientStaffModal && (
          <PatientStaffListModal
            closeModal={this.closeModal}
            patientInfo={patientInfo}
            patientId={patientId}
            patientInfoRefresh={this.patientInfoRefresh}
          />
        )}
        {this.state.isopenIntroductionModal && (
          <IntroductionListModal
            closeModal={this.closeModal}
            patientInfo={patientInfo}
            patientId={patientId}
            patientInfoRefresh={this.patientInfoRefresh}
          />
        )}
        {this.state.isOpenHistoryInfoModal && (
          <HistoryInfoModal
            closeModal={this.closeModal}
            patientInfo={patientInfo}
            patientId={patientId}
          />
        )}
        {this.state.isOpenPeriodOrderListModal && (
          <PeriodOrderListModal
            closeModal={this.closeModal}
            patientInfo={patientInfo}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isPotionReportPopupOpen && (
          <PotionReportModal
            patientInfo={patientInfo}
            closeModal={this.closeModal}
            patientId={patientId}
          />
        )}
        {this.context.autoLogoutModalShow === false && isHospitalPrescriptionPopupOpen && (
          <HospitalPrescriptionModal
            patientInfo={patientInfo}
            closeModal={this.closeModal}
            patientId={patientId}
          />
        )}
        {this.state.hasNotConsentedData && (
          <NotConsentedModal
            patientId={patientId}
            fromPatient={true}
            closeNotConsentedModal={this.closeNotConsentedModal}
          />
        )}
        {this.state.alert_messages != undefined && this.state.alert_messages != null && this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeAlertModal.bind(this)}
            handleOk= {this.closeAlertModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.prescription_confirm_message != undefined && this.state.prescription_confirm_message != null && this.state.prescription_confirm_message !== "" && (
          <PrescriptionConfirmModal
            hideConfirm= {this.confirmPrescriptionCancel.bind(this)}
            confirmCancel= {this.confirmPrescriptionCancel.bind(this)}
            confirmOk= {this.confirmPrescriptionOk.bind(this)}
            confirmTitle= {this.state.prescription_confirm_message}
            okTitle= {this.state.okTitle}
            cancelTitle= {this.state.cancelTitle}
          />
        )}
        <Tooltip
          {...this.state.tooltip}
          parent={this}
          tooltip_content={this.state.tooltip_content}
          tooltip_type={this.state.tooltip_type}
          tooltip_patientInfo={this.state.toolPatientInfo}
        />
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
            firstModal={this.state.first_modal}
          />
        )}
        <LoadingModal 
          ref={this.LoadingModalRef}
          message={'処理中...'}           
        />
      </>
    );
  }
}
PatientInfoCard.contextType = Context;

PatientInfoCard.propTypes = {
  openModal: PropTypes.func,
  patientId: PropTypes.number,
  detailedPatientInfo: PropTypes.object,
  patientModalState: PropTypes.object
};

export default PatientInfoCard;
