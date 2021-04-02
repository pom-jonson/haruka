import React, { Component, useContext } from "react";
import styled from "styled-components";
import {surface, onSurface, secondary200, midEmphasis, disable, SOAP_IMPORTANCE_COLOR} from "../../../../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import $ from "jquery";
import axios from "axios";
import InspectionResultModal from "../../../../organisms/InspectionResultModal";
import DoneModal from "~/components/organisms/DoneModal";
import OrderDoneRaidationModal from "~/components/templates/OrderList/OrderDoneRaidationModal";
import PrescriptionDoneModal from "~/components/organisms/PrescriptionDoneModal";
import PrescriptionIncreasePeriodModal from "~/components/organisms/PrescriptionIncreasePeriodModal";
import InjectionIncreasePeriodModal from "~/components/organisms/InjectionIncreasePeriodModal";
import {formatDate,getCurrentDate,formatJapanDateSlash,getWeekNamesBySymbol,formatJapanSlashDateTime,formatTimeIE} from "~/helpers/date";
import renderHTML from 'react-render-html';
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import InputExamOrderModal from "~/components/templates/Patient/Modals/Examination/InputExamOrderModal";
import ExamOrderListModal from "~/components/templates/Patient/Modals/Examination/ExamOrderListModal";
import ChangeLogModal from "../../../../organisms/ChangeLogModal";
import ChangeSoapLogModal from "../../../../organisms/ChangeSoapLogModal";
import ChangeInspectionLogModal from "../../../../organisms/ChangeInspectionLogModal";
import ChangeTreatmentLogModal from "../../../../organisms/ChangeTreatmentLogModal";
import ChangeGuidanceLogModal from "../../../../organisms/ChangeGuidanceLogModal";
import ChangeExaminationLogModal from "../../../../organisms/ChangeExaminationLogModal";
import ChangeRadiationLogModal from "../../../../organisms/ChangeRadiationLogModal";
import ChangeRehabilyLogModal from "../../../../organisms/ChangeRehabilyLogModal";
import ChangeAllergyLogModal from "../../../../organisms/ChangeAllergyLogModal";
import {
  WEEKDAYS,
  KARTEMODE,
  HOSPITALIZE_PRESCRIPTION_TYPE,
  openPacs,
  SOAP_TREE_CATEGORY,
  CACHE_SESSIONNAMES,
  EXAMINATION_TYPE,
  EXAM_DONE_STATUS,
  EXAM_STATUS_OPTIONS,
  getInsuranceName,
  CACHE_LOCALNAMES,
  ALLERGY_STATUS_ARRAY,
  SOAP_IMPORTANCE,
  getStrLength,
  getPeriodInjectionRpDoneStatus,
  getInspectionName,
  getInspectionMasterInfo,
  getStaffName,
  getDoctorName,
  getMultiReservationInfo
} from "~/helpers/constants";
import SystemConfirmModal from "../../../../molecules/SystemConfirmModal";
import SystemConfirmJapanModal from "../../../../molecules/SystemConfirmJapanModal";
import { persistedState } from "../../../../../helpers/cache";
import Spinner from "react-bootstrap/Spinner";
import { patientModalEvent } from "~/events/PatientModalEvent";
import * as karteApi from "~/helpers/cacheKarte-utils";
import RehabilyOrderData from "~/components/templates/Patient/Modals/Rehabilitation/RehabilyOrderData";
import {displayLineBreak} from "~/helpers/dialConstants"
import AddTagModal from "~/components/organisms/AddTagModal";
import * as apiClient from "~/api/apiClient";
import TagListModal from "~/components/organisms/TagListModal";
import TagDetailModal from "~/components/organisms/TagDetailModal";
import DepartmentModal from "~/components/organisms/DepartmentModal";
import KarteStatusModal from "~/components/organisms/KarteStatusModal";
import KarteCalendar from "~/components/templates/Patient/SOAP/components/KarteCalendar";
import MedicineGuidanceOrderData from "~/components/templates/Patient/Modals/Guidance/MedicineGuidanceOrderData";
import NutritionGuidanceLogModal from "../../Modals/Guidance/NutritionGuidanceLogModal";
import SameOptionsNew from "~/components/molecules/SameOptionsNew";
import InspectionDoneModal from "../../../OrderList/InspectionDoneModal";
import ExaminationDoneModal from "../../../OrderList/ExaminationDoneModal";
import RehabilyOrderDoneModal from "../../../OrderList/RehabilyOrderDoneModal";
import GuidanceNutritionRequestDoneModal from "~/components/templates/OrderList/GuidanceNutritionRequestDoneModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as patientApi from "~/helpers/cachePatient-utils";
import DocumentLogModal from "~/components/templates/Patient/Modals/Document/DocumentLogModal";
import HospitalMoveHistoryModal from "~/components/templates/Ward/HospitalMoveHistoryModal";
import ChangeResponsibilityHistoryModal from "~/components/templates/Meal/ChangeResponsibilityHistoryModal";
import InHospitalHistoryModal from "~/components/templates/Patient/Modals/Hospital/InHospitalHistoryModal";
import HospitalDoneHistoryModal from "~/components/templates/Ward/HospitalDoneHistoryModal";
import DischargeHistoryModal from "~/components/templates/Ward/DischargeHistoryModal";
import HospitalGoingHistoryModal from "~/components/templates/Ward/HospitalGoingHistoryModal";
import CytologyExamOrderData from "../../Modals/Examination/CytologyExamOrderData";
import RadiationData from "~/components/templates/Patient/components/RadiationData";
import * as localApi from "~/helpers/cacheLocal-utils";
import StopInjectionModal from "~/components/templates/Patient/Modals/StopInjection/StopInjectionModal";
import TreatDoneModal from "~/components/templates/OrderList/TreatDoneModal";
import TreatmentIncreasePeriodModal from "~/components/templates/OrderList/TreatmentIncreasePeriodModal";
import * as methods from "~/components/templates/Patient/SOAP/methods";
import {clipboardNutritionGuidance} from "~/components/templates/Patient/Clipboard/clipboardNutritionGuidance";
import {
  clipboardDeathRegister, clipboardDiagnosisComment, clipboardPatientDescriptionInfo, clipboardInspection, clipboardDocument, clipboardApplyDecision,
  clipboardChangeResponsibility, clipboardHospitalDone, clipboardHospitalInOut, clipboardDischarge, clipboardHospitalMove, clipboardRehabily,
  clipboardGuidance, clipboardMeal, clipboardRadiation, clipboardBacillusInspection, clipboardMedicalExaminationRecord, clipboardHospitalDischargeGuidanceReport,
  clipboardTreatment, clipboardExamination, clipboardMedicineGuidance
} from "~/components/templates/Patient/Clipboard/createOrderClipboard";
import DeathRegisterHistoryModal from "~/components/templates/Patient/DeathRegisterHistoryModal";
import {DischargeGuidanceReportHistory} from "~/components/templates/Patient/Medication/DischargeGuidanceReportHistory";
import InspectionStartEndDateTimeRegister from "~/components/templates/Patient/Modals/Physiological/InspectionStartEndDateTimeRegister";
import EndoscopeReservationModal from "~/components/templates/Patient/Modals/Common/EndoscopeReservationModal";
import AdministratePeriodInputExaminationModal from "~/components/molecules/AdministratePeriodInputExaminationModal";

const Wrapper = styled.div`
  flex-grow: 2;
  background: white;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-height: calc(100vh - 182px);
  .all-order-open {
      border: 1px solid #aaa;
      padding-left: 5px;
      padding-right: 5px;
      text-align: center;
      width: 8rem;
      margin-bottom: 5px;
      margin-top: 5px;
      margin-right: 5px;
      font-size:${props=>(props.font_props !== undefined ? props.font_props + 'rem':'1rem')};
      position: relative;
      label {
        cursor: pointer;
        margin-bottom: 0px;
      }
      svg {
          right: 0;
          left: -5px;
          position: relative;
          top: 3px;
      }
  }
  .all-order-close {
      border: 1px solid #aaa;
      padding-left: 5px;
      padding-right: 5px;
      margin-bottom: 5px;
      margin-top: 5px;
      font-size:${props=>(props.font_props !== undefined ? props.font_props + 'rem':'1rem')};
      position: relative;
      text-align: center;
      width: 9.5rem;
      label {
        cursor: pointer;
        margin-bottom: 0px;
      }
      svg {
          right: 0;
          left: -5px;
          position: relative;
          top: 3px;
          transform: rotate(180deg);
      }
  }
  .list-condition, next-reservation-visit-date {
    padding-top:5px;
    font-size:1.25rem;
  }
`;

const Col = styled.div`
  width: 100%;
  height: calc(100vh - 295px);
  overflow-y: scroll;
  -ms-overflow-style: auto;
  font-family: MS Gothic,monospace;
  textarea {
    width: 100%;
    resize: none;
  }
  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 100%;
      float: left;
      padding: 5px;
      text-align:left;
    }
    .function-region-value{
      width: 30%;
      float: left;
      padding: 5px;
      border-left: 1px solid #ddd;
    }
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    background: linear-gradient(#d0cfcf, #e6e6e7);
  }
  .data-header{
    background: rgb(105, 200, 225);
    color: white;
    padding: 4px 8px;
  }  
  .bottom-line{
    border-bottom: 1px solid rgb(213, 213, 213);
  }  
  .data-title{
    border: 1px solid rgb(213,213,213);
    cursor: pointer;
  }
  ._color_alerted{
    .history-region{
      background: #ffe5c7;
    }
    .doctor-name{
      background: #ffe5c7;
    }
    .data-item{
      background: linear-gradient(#e8d2ac, #ffe6b8, #ffe6b8);
    }
  }
  ._color_received{
    .history-region{
      background: #dbffff;
    }
    .doctor-name{
      background: #dbffff; 
    }
    .data-item{
      background: linear-gradient(#bfefef, #c7f8f8, #c7f8f8);
    }
  }
  ._color_implemented{
    .history-region{
      background: #e5ffdb;
    }
    .doctor-name{
      background: #e5ffdb; 
    }
    .data-item{
      background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
    }
  }
  ._color_not_implemented{
    .history-region{
      background: #ffe5ef;
    }
    .doctor-name{
      background: #ffe5ef; 
    }
    .data-item{
      background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
    }
  }
  .department{
    font-size:${props=>(props.font_props != undefined?0.875*props.font_props + 'rem':'0.875rem')};
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold
  }
  .doctor-name{
    font-size:${props=>(props.font_props != undefined?0.8125 * props.font_props + 'rem':'0.8125rem')};
    padding-right: 8px;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size:${props=>(props.font_props != undefined?0.8125 * props.font_props + 'rem':'0.8125rem')};
    padding-right: 8px;
  }
  .order{
    display: block !important;
  }
  .data-list{
    background-color: ${surface};
    overflow: hidden;
  }
  .soap-history-title{
    font-size:${props=>(props.font_props != undefined?0.75 * props.font_props + 'rem':'0.75rem')};
  }
  .low-title,
  .middle-title{
    background: rgb(230, 230, 231);
  }
  .facility-border{
    border-top: 1px solid rgb(213, 213, 213);
  }
  em, i {
    font-family:"ＭＳ Ｐゴシック";
  }
  .tb-soap{
    width: 100%;
    th{background: #f6fcfd;}
    td{font-family: MS Gothic,monospace;}
    textarea{
      background: white;
      color: black;
      height: 25px;
    }
  }
  .hospitalize{
    th{
      width: 6rem !important;
      text-align: left !important;
      font-weight: normal !important;
    }
  }
  .flex {
    display:flex;
  }
  .importance-level {
    padding-top: 5px;
    margin-right:0;
  }
  .tag-block-area {
    display:block;
    width:calc(100% - 150px);
    padding: 5px 5px 0 5px;
    .tag-block {
        cursor:pointer;
        width: auto;
        padding: 0px 10px;
        margin-right: 5px;
        float: left;
        margin-bottom: 5px;
        min-width: 40px;
        text-align: center;
        height: 21px;
    }
  }
  .version-span {
    color: red;
  }
`;

const LoadingCol = styled.div`
  width: 100%;  
  height: calc(100vh - 182px);
  max-height: calc(100vh - 182px);
  overflow-y: auto;
  -ms-overflow-style: auto;
`;


const underLine = {
  textDecorationLine: "underline"
};

const imageButtonStyle = {
  textAlign: "center",
  color: "blue",
  cursor: "pointer",
  float: "right"
};

const textAlignRight = {
  textAlign: "right"
};

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 1.5rem;
  position: absolute;
  top: 0px;
  right: 8px;
  bottom: 0px;
  margin: auto;
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background:black;
    opacity: 1;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color:white;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 1.25rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.25rem 0.5rem;
    }
  }
  .context-menu li:hover {
    background-color: #2b2b2b;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const MedicineListWrapper = styled.div`
  font-size:${props=>(props.font_props !== undefined ?0.75 * props.font_props + 'rem':'0.75rem')};
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .item-detail-div{
    width: 100%;
    word-break: break-all;
  }
  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 80px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .phy-box{
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 13rem;
    }    
    .text-left{
      .table-item{
        width: 9.375rem;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .line-through {
    color: #ff0000;
  }
  .flex {
    display: flex;
    margin-bottom: 0;
    &.between {
      justify-content: space-between;
      div {
        margin-right: 0;
      }
    }
    div {
      margin-right: 8px;
    }
    .date {
      margin-left: auto;
      margin-right: 24px;
    }    
  }
  .rp-number {
    margin-right: 4px;
    width: 75px;
  }
  .unit {
    margin-left: auto;
    text-align: right;
    width: 80px;
  }
  .full-text {
    width: 100%;
    text-align: right;
    margin-right: 11px;
  }
  .patient-name {
    margin-left: 16px;
  }
  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .number {
    margin-right: 8px;
    width: 80px;
  }
  .number .rp{
    text-decoration-line: underline;
  }
  .unit{
    text-align: right;
  }
  .w80 {
    text-align: right;
    width: 5rem;
    margin-left: 8px;
  }
  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .options {
    float: right;
  }
  .text-right {
    width: calc(100% - 88px);
  }
  .inject-usage{
    width: calc(100% - 110px - 5rem);
  }
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
    .treat-done-info, .treat-surface {
      label{
        margin-bottom: 0;
      }
    }
  }
  .treatment-period{
    width: calc(100% - 4rem);
    margin-left: 3rem;    
  }
  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }
  .hidden {
    display: none;
  }
  p {
    margin-bottom: 0;
  }
  .doing {
    background: #ccc !important;
    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
  .stop-rp {
    background: rgb(229, 229, 229) !important;
    color: red;
    .table-row {
      &:nth-child(2n) {
        background-color: rgb(229, 229, 229) !important;
      }
    }
  }
  .full-width {
    width: calc(100% - 5rem - 15px);
  }
  .prescription-body-part {
    width: 100%;
    padding-left: 6.5rem;
  }
`;

const ContextMenu = ({
     visible,
     x,
     y,
     index,
     menuType,
     isDeleted,
     isStopped,
     other_value,
     radiation_pacs_flag,
     parent,
     current_date,
     soapList,
     karte_mode
   }) => {
  if (visible) {
    const { $canDoAction, FEATURES, AUTHS} = useContext(Context);
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    let currentPatient = (current_system_patient_id !== undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let menu_item = soapList[index];
    if(menu_item === undefined || menu_item == null){return null;}
    let done_order = menu_item.data.done_order;
    let diagnosing_date = menu_item.created_at;
    let is_doctor_consented = menu_item.is_doctor_consented;
    let curDate = new Date(current_date);
    let start_date = new Date(diagnosing_date.substring(0,10));
    let feature_type = FEATURES.SOAP;
    let order_editing_flag = false;
    let {cacheState, cacheDoneExamOrderState, cacheExamState,cacheDelExamState} =persistedState(parseInt(currentPatient));
    let inspection_master = null;
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.inspection_master != undefined && init_status.inspection_master != null) {
      inspection_master = init_status.inspection_master;
    }
    // ■1230-41 一部の生理検査も、実施済みの場合にPACSリンクを表示できるように
    let can_inspection_pac = false;
    if (inspection_master != null && inspection_master.length > 0 && menu_item.data != undefined && menu_item.data.inspection_id != undefined) {
      inspection_master.map(ele=>{
        if (ele.inspection_id == menu_item.data.inspection_id && ele.can_use_pacs == 1) {
          can_inspection_pac = true;
        }
      });
    }
    let can_inspection_done = true;
    if(menuType === "inspection-order"){
      let inspection_info = getInspectionMasterInfo(other_value);
      if(inspection_info.end_until_continue_type !== undefined){
        if(inspection_info.end_until_continue_type == 1){
          can_inspection_done = false;
        }
        if(inspection_info.end_until_continue_type == 2 && menu_item.karte_status == 3){
          can_inspection_done = false;
        }
      }
    }
    switch(menuType){
      case "soap":
        feature_type = FEATURES.SOAP;
        break;
      case "exam-order":
        feature_type = FEATURES.EXAMORDER;
        break;
      case "inspection-order":
        if(other_value == 17){
          feature_type = FEATURES.ENDOSCOPEORDER;
        } else {
          feature_type = FEATURES.EXAMORDER;
        }
        break;
      case "treatment-order":
        feature_type = FEATURES.TREATORDER;
        break;
      case "guidance-order":
        feature_type = FEATURES.GUIDANCEORDER;
        break;
      case "home-order":
        feature_type = FEATURES.GUIDANCEORDER;
        break;
      case "radiation-order":
        feature_type = FEATURES.RADIATION;
        break;
      case "rehabily-order":
        feature_type = FEATURES.REHABILY;
        break;
      case "prescription":
        feature_type = FEATURES.PRESCRIPTION;
        if(cacheState != null && cacheState != undefined && Object.keys(cacheState).length > 0){
          Object.keys(cacheState).map(sort_key=>{
            if(cacheState[sort_key][0]['number'] == menu_item.data.number){
              order_editing_flag = true;
            }
          });
        }
        break;
      case "injection":
        feature_type = FEATURES.PRESCRIPTION;
        break;
      case "medicine-guidance-order":
        feature_type = FEATURES.MEDICINE_GUIDANCE;
        break;
      case "change-responsibility":
        feature_type = FEATURES.CHANGE_RESPONSIBILITY;
        break;
      case "hospital-move-bed":
        feature_type = FEATURES.MOVE_WARD;
        break;
      case "document-create":
        feature_type = FEATURES.DOCUMENT_CREATE;
        break;
      case "hospital-apply":
        feature_type = FEATURES.HOSPITAL_APPLY;
        break;
      case "hospital-decision":
        feature_type = FEATURES.HOSPITAL_DECISION;
        break;
      case "hospital-done":
        feature_type = FEATURES.HOSPITAL_DONE;
        break;
      case "discharge-permit":
        feature_type = FEATURES.DISCHARGE_PERMISSION;
        break;
      case "discharge-decision":
        feature_type = FEATURES.DISCHARGE_DECISION;
        break;
      case "discharge-done":
        feature_type = FEATURES.DISCHARGE_DONE;
        break;
      case "hospital-going-out":
      case "hospital-going-in":
        feature_type = FEATURES.OUT_RETURN;
        break;
      case "death-register":
        feature_type = FEATURES.HOSPITAL_DONE;
        break;
    }
    // check edit
    let canEdit = false;
    if (start_date >= curDate) {
      if (($canDoAction(feature_type, AUTHS.EDIT) || $canDoAction(feature_type, AUTHS.EDIT_PROXY)) && is_doctor_consented !== 4) {
        canEdit = true;
      }
    } else {
      if (($canDoAction(feature_type, AUTHS.EDIT_OLD) || $canDoAction(feature_type, AUTHS.EDIT_PROXY_OLD)) && is_doctor_consented !== 4) {
        canEdit = true;
      }
    }
    // check delete
    let canDelete = false;
    if (start_date >= curDate) {
      if (($canDoAction(feature_type, AUTHS.DELETE) || $canDoAction(feature_type, AUTHS.DELETE_PROXY)) && is_doctor_consented !== 4) {
        canDelete = true;
      }
    } else {
      if (($canDoAction(feature_type, AUTHS.DELETE_OLD) || $canDoAction(feature_type, AUTHS.DELETE_PROXY_OLD)) && is_doctor_consented !== 4) {
        canDelete = true;
      }
    }
    // ①「当日未受付の削除」「当日未受付の削除（代理）」
    // オーダー登録日が現在日付で、実施や受付の状態が進んでいないものを削除可能
    // 処方, 注射, 放射線, 管理指導, リハビリ, 検体検査, 放射線, 管理指導, リハビリ
    let treat_date = null;
    switch(menuType){
      case "prescription":
        canDelete = false;
        // ①「当日未受付の削除」「当日未受付の削除（代理）」
        if (start_date.getTime() == curDate.getTime() && done_order == 0 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
        // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
        if (start_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
        treat_date = null;
        if(done_order == 1 && menu_item.data.treat_date != null) treat_date = new Date(menu_item.data.treat_date.substring(0,10));

        if (start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
        if (start_date.getTime() < curDate.getTime() && ($canDoAction(feature_type, AUTHS.DELETE_PAST_DONE) || $canDoAction(feature_type, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        break;
      case "injection":
        canDelete = false;
        // ①「当日未受付の削除」「当日未受付の削除（代理）」
        if (start_date.getTime() == curDate.getTime() && done_order == 0 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
        // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
        if (start_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
        treat_date = null;
        if(done_order == 1 && menu_item.data.treat_date != null) treat_date = new Date(menu_item.data.treat_date.substring(0,10));

        if (start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
        if (start_date.getTime() < curDate.getTime() && ($canDoAction(feature_type, AUTHS.DELETE_PAST_DONE) || $canDoAction(feature_type, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        break;
      case "exam-order":
        canDelete = false;
        // ①「当日未受付の削除」「当日未受付の削除（代理）」
        if (start_date.getTime() == curDate.getTime() && done_order != 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
        // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
        if (start_date.getTime() == curDate.getTime() && (done_order == 2 || done_order == 1) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
        treat_date = null;
        if(menu_item.data != undefined && (done_order == 2 || done_order == 1) && menu_item.data.treat_date != null) treat_date = new Date(menu_item.data.treat_date.substring(0,10));

        if (start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && (done_order == 2 || done_order == 1) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
        if (start_date.getTime() < curDate.getTime() && ($canDoAction(feature_type, AUTHS.DELETE_PAST_DONE) || $canDoAction(feature_type, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        break;
      case "radiation-order":
        canDelete = false;
        // ①「当日未受付の削除」「当日未受付の削除（代理）」
        if (start_date.getTime() == curDate.getTime() && done_order == 0 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
        // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
        if (start_date.getTime() == curDate.getTime() && (done_order == 2 || done_order == 1) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
        treat_date = null;
        if((done_order == 2 || done_order == 1) && menu_item.data.order_data.order_data.treat_date != null) treat_date = new Date(menu_item.data.order_data.order_data.treat_date.substring(0,10));

        if (start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && (done_order == 2 || done_order == 1) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
        if (start_date.getTime() < curDate.getTime() && ($canDoAction(feature_type, AUTHS.DELETE_PAST_DONE) || $canDoAction(feature_type, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        break;
      case "rehabily-order":
        canDelete = false;
        // ①「当日未受付の削除」「当日未受付の削除（代理）」
        if (start_date.getTime() == curDate.getTime() && done_order == 0 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
        // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
        if (start_date.getTime() == curDate.getTime() && (done_order == 2 || done_order == 1) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
        treat_date = null;
        if((done_order == 2 || done_order == 1) && menu_item.data.order_data.order_data.treat_date != null) treat_date = new Date(menu_item.data.order_data.order_data.treat_date.substring(0,10));

        if (start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && (done_order == 2 || done_order == 1) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
        if (start_date.getTime() < curDate.getTime() && ($canDoAction(feature_type, AUTHS.DELETE_PAST_DONE) || $canDoAction(feature_type, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        break;
      case "guidance-order":
        canDelete = false;
        // ①「当日未受付の削除」「当日未受付の削除（代理）」
        if (start_date.getTime() == curDate.getTime() && done_order == 0 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
        // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
        if (start_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
        treat_date = null;
        if(done_order == 1 && menu_item.data.order_data.order_data.treat_date != null) treat_date = new Date(menu_item.data.order_data.order_data.treat_date.substring(0,10));

        if (start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
        if (start_date.getTime() < curDate.getTime() && ($canDoAction(feature_type, AUTHS.DELETE_PAST_DONE) || $canDoAction(feature_type, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        break;
      case "inspection-order":
        canDelete = false;
        // ①「当日未受付の削除」「当日未受付の削除（代理）」
        if(start_date.getTime() == curDate.getTime() && (menu_item.data.state == 0 || menu_item.data.state == 5 || menu_item.data.state == 6) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
        // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
        if(start_date.getTime() == curDate.getTime() && (menu_item.data.state == 2 || menu_item.data.state == 1) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
        treat_date = null;
        if((menu_item.data.state == 2 || menu_item.data.state == 1) && menu_item.data.completed_at != null) treat_date = new Date(menu_item.data.completed_at.substring(0,10));

        if(start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && (menu_item.data.state == 2 || menu_item.data.state == 1) && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
        if (start_date.getTime() < curDate.getTime() && ($canDoAction(feature_type, AUTHS.DELETE_PAST_DONE) || $canDoAction(feature_type, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        break;
      case "treatment-order":
        canDelete = false;
        // ①「当日未受付の削除」「当日未受付の削除（代理）」
        if(start_date.getTime() == curDate.getTime() && menu_item.data.state == 0 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
        // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
        if(start_date.getTime() == curDate.getTime() && menu_item.data.state == 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
        treat_date = null;
        if(menu_item.data.state == 1 && menu_item.data.completed_at != null) treat_date = new Date(menu_item.data.completed_at.substring(0,10));

        if(start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && menu_item.data.state == 1 && ($canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE) || $canDoAction(feature_type, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
        if(start_date.getTime() < curDate.getTime() && ($canDoAction(feature_type, AUTHS.DELETE_PAST_DONE) || $canDoAction(feature_type, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
          canDelete = true;
        }
        break;
    }

    // check completed
    let canCheckCompleted = false;
    if ($canDoAction(feature_type, AUTHS.DONE_OREDER) && is_doctor_consented !== 4 && done_order != 1 ) {
      canCheckCompleted = true;
    }

    // check prescription period if can increase
    // ●YJ1153 期間が終了していない定期処方を延長できるようにする
    let canIncreasePeriod = false;

    if (canEdit && 
    (menuType == "prescription" || menuType == "injection") &&
    menu_item.data != undefined && 
    menu_item.data.order_data != undefined && 
    menu_item.data.order_data.order_data != undefined && 
    menu_item.data.order_data.order_data.length > 0) {
      menu_item.data.order_data.order_data.map(ele=>{
        if (ele.administrate_period != undefined &&
          ele.administrate_period != null &&
          ele.administrate_period.period_end_date != undefined &&
          ele.administrate_period.period_end_date != null &&
          ele.administrate_period.period_end_date != "") {
            let period_end_date = new Date(ele.administrate_period.period_end_date);
            if (period_end_date >= curDate) {
              canIncreasePeriod = true;
            }
        }
      });
    }
    if (canEdit &&
    (menuType == "exam-order") &&
    menu_item.data !== undefined &&
    menu_item.data.order_data !== undefined &&
    menu_item.data.order_data.order_data !== undefined ) {
      if (menu_item.data.order_data.order_data.administrate_period !== undefined &&
        menu_item.data.order_data.order_data.administrate_period != null &&
        menu_item.data.order_data.order_data.administrate_period.period_end_date !== undefined &&
        menu_item.data.order_data.order_data.administrate_period.period_end_date != null &&
        menu_item.data.order_data.order_data.administrate_period.period_end_date !== "") {
          let period_end_date = new Date(menu_item.data.order_data.order_data.administrate_period.period_end_date);
          if (period_end_date >= curDate) {
            canIncreasePeriod = true;
          }
      }
    }
    if (canEdit &&
    (menuType == "treatment-order") &&
    menu_item.data != undefined &&
    menu_item.data.order_data != undefined &&
    menu_item.data.order_data.order_data != undefined &&
    menu_item.data.order_data.order_data.detail !== undefined &&
    menu_item.data.order_data.order_data.detail.length > 0) {
      menu_item.data.order_data.order_data.detail.map(ele=>{
        if (ele.administrate_period != undefined &&
          ele.administrate_period != null &&
          ele.administrate_period.period_end_date != undefined &&
          ele.administrate_period.period_end_date != null &&
          ele.administrate_period.period_end_date != "") {
            let period_end_date = new Date(ele.administrate_period.period_end_date);
            if (period_end_date >= curDate) {
              canIncreasePeriod = true;
            }
        }
      });
    }
    
    // can exam delete edit done check about same record
    let can_exam = true;
    if(cacheDoneExamOrderState != null && cacheDoneExamOrderState.findIndex(x=>x.number==menu_item.target_number) > -1){
      can_exam = false;
    }
    if(cacheDelExamState != null){
      Object.keys(cacheDelExamState).map((del_key)=>{
        if(cacheDelExamState[del_key]['karte_number'] == menu_item['number']){
          can_exam = false;
        }
      })
    }
    if(cacheExamState != null && cacheExamState.number == menu_item.target_number){
      can_exam = false;
    }

    // can 診療科修正
    // ●YJ94 保存済みレコードの入外区変更と診療科変更は権限で制限する 2020/11/10 p
    // 「診療科修正(当日)」、「診療科修正(過去)」
    let canChangeDepartment = false;
    
    if (curDate.getTime() == start_date.getTime()) { // 「診療科修正(当日)」
      if ($canDoAction(feature_type, AUTHS.RECEIPT_CURRENT)){
        canChangeDepartment = true;
      }  
    } else if(start_date.getTime() < curDate.getTime()) { // 「診療科修正(過去)」
      if ($canDoAction(feature_type, AUTHS.RECEIPT)){
        canChangeDepartment = true;
      }
    }
    
    // 「入外区分修正(当日)」、「入外区分修正(過去)」
    let canChangeKarteStatus = false;
    
    if (curDate.getTime() == start_date.getTime()) { // 「入外区分修正(当日)」
      if ($canDoAction(feature_type, AUTHS.KARTE_STATUS_CURRENT)){
        canChangeKarteStatus = true;
      }  
    } else if(start_date.getTime() < curDate.getTime()) { // 「入外区分修正(過去)」
      if ($canDoAction(feature_type, AUTHS.KARTE_STATUS_PAST)){
        canChangeKarteStatus = true;
      }
    }
    let completedFlag = false;
    if (done_order == 1) completedFlag = true;
    if (menuType == "exam-order" && (done_order == 4 || done_order == 5)) completedFlag = true;
    let isWrite = (karte_mode == KARTEMODE.READ) ?  false: true;
    let SoapCategory = null;
    if(menuType == "soap"){
      SoapCategory = karteApi.getVal(menu_item['system_patient_id'], CACHE_LOCALNAMES.SOAP_CATEGORY);
    }

    // if 定期注射, don't show 実施 menu
    let cur_order = soapList[index];
    let inject_done_menu_disable = 0;
    if (menuType == "injection" && 
      cur_order.data != undefined && 
      cur_order.data != null && 
      cur_order.data.order_data != undefined && 
      cur_order.data.order_data.is_completed == 4) {
      if (parent.injection_stop_register_cancel_menu == 1) {
        inject_done_menu_disable = 1;
      } else if(parent.injection_stop_register_cancel_menu == 2) {
        inject_done_menu_disable = 2;
      }
    }
    return (
      <>
        {menuType == "soap" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              {isWrite && (
                <>
                  {isDeleted ? (
                    <li><div onClick={() => parent.contextMenuAction("doCancelDelete", index)}>削除を取りやめ</div></li>
                  ):(
                    <>
                      {canEdit && (
                        <li><div onClick={() => parent.contextMenuAction("doUpdate", index)}>編集</div></li>
                      )}
                      {canDelete && (
                        <li><div onClick={() => parent.contextMenuAction("doRemove", index)}>削除</div></li>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("copyInspection", index)}>新規記述にコピー</div></li>
                      {other_value != null && (
                        <>
                          {menu_item.sub_category == "初診・入院時ノート" && SoapCategory == "hospital_note" && (
                            <>
                              {other_value=="s_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>主訴を新規記述にコピー</div></li>
                              )}
                              {other_value=="sharp_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>現病歴を新規記述にコピー</div></li>
                              )}
                              {other_value=="o_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>所見を新規記述にコピー</div></li>
                              )}
                              {other_value=="a_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>アセスメントを新規記述にコピー</div></li>
                              )}
                              {other_value=="p_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>プランを新規記述にコピー</div></li>
                              )}
                            </>
                          )}
                          {menu_item.sub_category == "" && SoapCategory != "hospital_note" && (
                            <>
                              {other_value=="sharp_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>#を新規記述にコピー</div></li>
                              )}
                              {other_value=="s_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>(S)を新規記述にコピー</div></li>
                              )}
                              {other_value=="o_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>(O)を新規記述にコピー</div></li>
                              )}
                              {other_value=="a_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>(A)を新規記述にコピー</div></li>
                              )}
                              {other_value=="p_text" && (
                                <li><div onClick={() => parent.contextMenuAction("copyInspection", index, other_value)}>(P)を新規記述にコピー</div></li>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {is_doctor_consented != 4 && canChangeDepartment && (
                        <li><div onClick={() => parent.contextMenuAction("changeDepartment_soap", index)}>診療科修正</div></li>
                      )}
                      {is_doctor_consented != 4 && canChangeKarteStatus && (
                        <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_soap", index)}>入外区分修正</div></li>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                    </>
                  )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "exam-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              {isWrite ? (
                <>
                  {isDeleted ? (
                    <li><div onClick={() => parent.contextMenuAction("deleteCancelIExamOrder", index)}>削除を取りやめ</div></li>
                  ):(
                    <>
                      <li><div onClick={() => parent.handleClipboard(index, "exam_order")}>コピー</div></li>
                      {canIncreasePeriod && can_exam && (
                        <li><div onClick={() => parent.contextMenuAction("increase_examination", index)}>予定日付追加</div></li>
                      )}
                      {canEdit && can_exam && (
                        <li><div onClick={() => parent.contextMenuAction("editExamOrder", index)}>編集</div></li>
                      )}
                      {canDelete && can_exam && (
                        <li><div onClick={() => parent.contextMenuAction("deleteExamOrder", index)}>削除</div></li>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("copyInspection", index)}>Do</div></li>
                      {is_doctor_consented != 4 && canChangeDepartment == true && (
                        <li><div onClick={() => parent.contextMenuAction("changeDepartment_examination", index)}>診療科修正</div></li>
                      )}
                      {is_doctor_consented != 4 && canChangeKarteStatus && (
                        <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_examination", index)}>入外区分修正</div></li>
                      )}
                      {completedFlag && (
                        <>
                          <li><div onClick={() => parent.contextMenuAction("inputExamOrderResult", index)}>検査結果入力</div></li>
                          {menu_item.data.order_data.order_data.exist_result == 1 &&
                          !(menu_item.data.order_data.order_data.out_hospital_header_number > 0) && !(menu_item.data.order_data.order_data.in_hospital_header_number > 0) && (
                            <li><div onClick={() => parent.contextMenuAction("showExamOrderResult", index)}>検査結果閲覧</div></li>
                          )}
                        </>
                      )}
                      {menu_item.data.order_data.order_data.out_hospital_header_number != undefined && menu_item.data.order_data.order_data.out_hospital_header_number != "" && (
                        <li><div onClick={() => parent.contextMenuAction("showOutHospitalExamOrderResult", menu_item.data.order_data.order_data.out_hospital_header_number)}>院外検査結果閲覧</div></li>
                      )}
                      {menu_item.data.order_data.order_data.in_hospital_header_number != undefined && menu_item.data.order_data.order_data.in_hospital_header_number != "" && (
                        <li><div onClick={() => parent.contextMenuAction("showInHospitalExamOrderResult", menu_item.data.order_data.order_data.in_hospital_header_number)}>院内検査結果閲覧</div></li>
                      )}
                      { canCheckCompleted && can_exam && (
                        <>
                          <li><div onClick={() => parent.contextMenuAction("doneOrder", index)}>実施</div></li>
                          <li><div onClick={() => parent.contextMenuAction("doneAndEditOrder", index)}>実施入力</div></li>
                        </>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                    </>
                  )}
                </>
              ):(
                <>
                  {completedFlag && menu_item.data.order_data.order_data.exist_result == 1 &&
                  !(menu_item.data.order_data.order_data.out_hospital_header_number > 0) && !(menu_item.data.order_data.order_data.in_hospital_header_number > 0) && (
                    <li><div onClick={() => parent.contextMenuAction("showExamOrderResult", index)}>検査結果閲覧</div></li>
                  )}
                  {menu_item.data.order_data.order_data.out_hospital_header_number != undefined && menu_item.data.order_data.order_data.out_hospital_header_number != "" && (
                    <li><div onClick={() => parent.contextMenuAction("showOutHospitalExamOrderResult", menu_item.data.order_data.order_data.out_hospital_header_number)}>院外検査結果閲覧</div></li>
                  )}
                  {menu_item.data.order_data.order_data.in_hospital_header_number != undefined && menu_item.data.order_data.order_data.in_hospital_header_number != "" && (
                    <li><div onClick={() => parent.contextMenuAction("showInHospitalExamOrderResult", menu_item.data.order_data.order_data.in_hospital_header_number)}>院内検査結果閲覧</div></li>
                  )}
                </>
                )}
              
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "inspection-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                  {isDeleted && (
                    <li><div onClick={() => parent.contextMenuAction("deleteCancelInspectionOrder", index)}>削除を取りやめ</div></li>
                  )}
                  {isStopped && (
                    <li><div onClick={() => parent.contextMenuAction("stopCancelInspectionOrder", index)}>中止を取りやめ</div></li>
                  )}
                  {(!isDeleted && !isStopped) && (
                    <>
                      {canEdit && (
                        <>
                          <li><div onClick={() => parent.contextMenuAction("editInspectionOrder", index, other_value)}>編集</div></li>
                          {menu_item.data.order_data.order_data.multi_reserve_flag == 1 && menu_item.data.end_date != null
                            && (new Date().getTime() <= new Date(menu_item.data.end_date.split(' ')[0].split('-').join('/') + " 23:59:59").getTime()) && (
                            <li><div onClick={() => parent.contextMenuAction("addReservationInspectionOrder", index, other_value)}>追加予約</div></li>
                          )}
                        </>
                      )}
                      {canDelete && (
                        <li><div onClick={() => parent.contextMenuAction("deleteInspectionOrder", index, other_value)}>削除</div></li>
                      )}
                      {$canDoAction(feature_type, AUTHS.STOP) && is_doctor_consented !== 4  && menu_item.data.state !== 2 && other_value == 17 && (
                        <li><div onClick={() => parent.contextMenuAction("stopInspectionOrder", index, other_value)}>中止</div></li>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("copyInspection", index)}>Do</div></li>
                      {is_doctor_consented != 4 && canChangeDepartment && (
                        <li><div onClick={() => parent.contextMenuAction("changeDepartment_inspection", index)}>診療科修正</div></li>
                      )}
                      {is_doctor_consented != 4 && canChangeKarteStatus && (
                        <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_inspection", index)}>入外区分修正</div></li>
                      )}
                      {($canDoAction(feature_type, AUTHS.DONE_OREDER) && menu_item.data.order_data.order_data.multi_reserve_flag != 1) && (
                        <>
                          {(can_inspection_done && is_doctor_consented !== 4  && menu_item.data.state !== 2) && (
                            <li><div onClick={() => parent.contextMenuAction("inspectionDoneOrder", index, other_value)}>実施</div></li>
                          )}
                          {!can_inspection_done && menu_item.data.start_date != null && menu_item.data.end_date == null && (
                            <>
                              <li><div onClick={() => parent.contextMenuAction("inspection_continue_date_register_done", index, other_value)}>実施日時登録</div></li>
                              <li><div onClick={() => parent.contextMenuAction("inspection_end_date_register", index, other_value)}>終了日時登録</div></li>
                            </>
                          )}
                        </>
                      )}
                      {menu_item.data.state == 2 && can_inspection_pac == true && (
                        <li><div onClick={() => parent.handleOpenPacs()}>PACS</div></li>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                    </>
                  )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "guidance-nutrition-request" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                  {canEdit && (
                    <li><div onClick={() => parent.contextMenuAction("editGuidanceNutritionRequest", index)}>編集</div></li>
                  )}
                  {$canDoAction(FEATURES.NUTRITION_GUIDANCE, AUTHS.DONE_OREDER) && done_order != 1 && (
                    <li><div onClick={() => parent.contextMenuAction("guidanceNutritionRequestDone", index)}>実施</div></li>
                  )}
                  <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                  <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                  <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "examination-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              {isWrite && (
                <>
                  {canCheckCompleted && (
                    <li><div onClick={() => parent.contextMenuAction("examResultDoneOrder", index)}>実施</div></li>
                  )}
                  {done_order !== undefined && done_order === 1 &&
                  menu_item.report_flag !== undefined && menu_item.report_flag !== 1 && (
                    <li><div onClick={() => parent.contextMenuAction("examResultReport", index)}>患者様に結果報告済み</div></li>
                  )}
                  <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                  <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                  <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                </>
              )}
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "treatment-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, "treatment-order")}>コピー</div></li>
              {isWrite && menu_item.is_enabled == 1 && (
                <>
                {isDeleted ? (
                  <>
                    {isWrite && (
                      <li><div onClick={() => parent.contextMenuAction("deleteCancelTreatmentOrder", index)}>削除を取りやめ</div></li>
                    )}
                  </>
                ):(
                  <>
                    {canIncreasePeriod && (
                      <li><div onClick={() => parent.contextMenuAction("increase_treatment", index)}>定期処置継続登録</div></li>
                    )}
                    {canEdit && (
                      <li><div onClick={() => parent.contextMenuAction("editTreatmentOrder", index)}>編集</div></li>
                    )}
                    {canDelete && (
                      <li><div onClick={() => parent.contextMenuAction("deleteTreatmentOrder", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("copyInspection", index)}>Do</div></li>
                    {is_doctor_consented != 4 && canChangeDepartment== true && (
                      <li><div onClick={() => parent.contextMenuAction("changeDepartment_treatment", index)}>診療科修正</div></li>
                    )}
                    {is_doctor_consented != 4 && canChangeKarteStatus && (
                      <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_treatment", index)}>入外区分修正</div></li>
                    )}
                    { $canDoAction(feature_type, AUTHS.DONE_OREDER) && is_doctor_consented !== 4 && menu_item.data.state != 1 && menu_item.data.end_date == null && (
                      <li><div onClick={() => parent.contextMenuAction("treatmentDoneOrder", index)}>実施</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "hospital" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, "patient-description-info")}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelHospital", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {canEdit && (
                      <li><div onClick={() => parent.contextMenuAction("editHospitalOrder", index)}>編集</div></li>
                    )}
                    {canDelete && (
                      <li><div onClick={() => parent.contextMenuAction("deleteHospitalOrder", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("copyInspection", index)}>Do</div></li>
                    {is_doctor_consented != 4 && canChangeDepartment== true && (
                      <li><div onClick={() => parent.contextMenuAction("changeDepartment_hospital", index)}>診療科修正</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "radiation-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, "radiation")}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelRadiationOrder", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {canEdit && (
                      <li><div onClick={() => parent.contextMenuAction("editRadiationOrder", index)}>編集</div></li>
                    )}
                    { canDelete && (
                      <li><div onClick={() => parent.contextMenuAction("deleteRadiationOrder", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("copyInspection", index)}>Do</div></li>
                    {is_doctor_consented != 4 && canChangeDepartment== true && (
                      <li><div onClick={() => parent.contextMenuAction("changeDepartment_radiation", index)}>診療科修正</div></li>
                    )}
                    {is_doctor_consented != 4 && canChangeKarteStatus && (
                      <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_radiation", index)}>入外区分修正</div></li>
                    )}
                    {canCheckCompleted ? (
                      <li><div onClick={() => parent.contextMenuAction("radiationDoneOrder", index)}>実施</div></li>
                    ):(
                      <>
                        {radiation_pacs_flag == 'ON' && (
                          <li><div onClick={() => parent.handleOpenPacs()}>PACS</div></li>
                        )}
                      </>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "prescription" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              {isWrite && (
                <>
                  <li><div onClick={() => parent.contextMenuAction("do_prescription", index)}>Do処方</div></li>
                </>
              )}
              <li><div onClick={() => parent.handleClipboard(index, "prescription")}>コピー</div></li>
              {menu_item.is_enabled != 2 && isWrite && (
                <>
                  {isDeleted ? (
                    <>
                      {($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE) ||
                        $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_OLD) ||
                        $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PROXY) ||
                        $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PROXY_OLD)) && (
                        <li><div onClick={() => parent.contextMenuAction("cancelAllRecovery_prescription", index)}>削除取りやめ</div></li>
                      )}
                    </>
                  ):(
                    <>
                      {!order_editing_flag && (
                        <>
                          {canIncreasePeriod && (
                            <li><div onClick={() => parent.contextMenuAction("increase_prescription", index)}>定期処方継続登録</div></li>
                          )}
                          {canEdit && (
                            <li><div onClick={() => parent.contextMenuAction("edit_prescription", index)}>編集</div></li>
                          )}
                          {canDelete && (
                            <li><div onClick={() => parent.contextMenuAction("cancelAll_prescription", index)}>削除</div></li>
                          )}
                          {canCheckCompleted && (
                            <li><div onClick={() => parent.contextMenuAction("prescriptionDoneOrder", index)}>実施</div></li>
                          )}
                          {is_doctor_consented != 4 && canChangeDepartment== true && (
                            <li><div onClick={() => parent.contextMenuAction("changeDepartment_prescription", index)}>診療科修正</div></li>
                          )}
                          {is_doctor_consented != 4 && canChangeKarteStatus && (
                            <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_prescription", index)}>入外区分修正</div></li>
                          )}
                        </>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                    </>
                  )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "injection" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              {isWrite && (
                <>
                  <li><div onClick={() => parent.contextMenuAction("do_injection", index)}>Do</div></li>
                </>
              )}
              <li><div onClick={() => parent.handleClipboard(index, "injection")}>コピー</div></li>
              {menu_item.is_enabled != 2 && isWrite && (
                <>
                  {isDeleted && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE) ||
                    $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_OLD) ||
                    $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PROXY) ||
                    $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PROXY_OLD)) && (
                    <>
                      <li><div onClick={() => parent.contextMenuAction("cancelAllRecovery_injection", index)}>削除取りやめ</div></li>
                    </>
                  )}
                  {!isDeleted && (
                    <>
                      {canIncreasePeriod && (
                        <li><div onClick={() => parent.contextMenuAction("increase_injection", index)}>定期注射継続登録</div></li>
                      )}
                      { canEdit && (
                        <li><div onClick={() => parent.contextMenuAction("edit_injection", index)}>編集</div></li>
                      )}
                      {canDelete && (
                        <li><div onClick={() => parent.contextMenuAction("cancelAll_injection", index)}>削除</div></li>
                      )}
                      {canCheckCompleted && (inject_done_menu_disable != 1 || inject_done_menu_disable != 2) && (
                        <li><div onClick={() => parent.contextMenuAction("injectionDoneOrder", index)}>実施</div></li>
                      )}
                      {/*{canCheckCompleted && inject_done_menu_disable == 1 && (
                        <li><div onClick={() => parent.contextMenuAction("injectionStopOrder", index, parent.state.rp_index)}>中止登録</div></li>
                      )}
                      {canCheckCompleted && inject_done_menu_disable == 2 && (
                        <li><div onClick={() => parent.contextMenuAction("injectionStopCancelOrder", index, parent.state.rp_index)}>中止取消</div></li>
                      )}*/}
                      {is_doctor_consented != 4 && canChangeDepartment== true && (
                        <li><div onClick={() => parent.contextMenuAction("changeDepartment_injection", index)}>診療科修正</div></li>
                      )}
                      {is_doctor_consented != 4 && canChangeKarteStatus && (
                        <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_injection", index)}>入外区分修正</div></li>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                    </>
                  )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "guidance-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, "guidance")}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelGuidanceOrder", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {canEdit && (
                      <li><div onClick={() => parent.contextMenuAction("editGuidanceOrder", index)}>編集</div></li>
                    )}
                    { canDelete && (
                      <li><div onClick={() => parent.contextMenuAction("deleteGuidanceOrder", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("copyInspection", index)}>Do</div></li>
                    {is_doctor_consented != 4 && canChangeDepartment== true && (
                      <li><div onClick={() => parent.contextMenuAction("changeDepartment_guidance", index)}>診療科修正</div></li>
                    )}
                    {is_doctor_consented != 4 && canChangeKarteStatus && (
                      <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_guidance", index)}>入外区分修正</div></li>
                    )}
                    {canCheckCompleted && (
                      <li><div onClick={() => parent.contextMenuAction("guidanceDoneOrder", index)}>実施</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "rehabily-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, "rehabily")}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelRehabilyOrder", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    { canEdit && (
                      <li><div onClick={() => parent.contextMenuAction("editRehabilyOrder", index)}>編集</div></li>
                    )}
                    { canDelete && (
                      <li><div onClick={() => parent.contextMenuAction("deleteRehabilyOrder", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("copyInspection", index)}>Do</div></li>
                    {is_doctor_consented != 4 && canChangeDepartment== true && (
                      <li><div onClick={() => parent.contextMenuAction("changeDepartment_rehabily", index)}>診療科修正</div></li>
                    )}
                    {is_doctor_consented != 4 && canChangeKarteStatus && (
                      <li><div onClick={() => parent.contextMenuAction("changeKarteStatus_rehabily", index)}>入外区分修正</div></li>
                    )}
                    { canCheckCompleted && (
                      <li><div onClick={() => parent.contextMenuAction("rehabilyDoneOrder", index)}>実施</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "medicine-guidance-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                  {canEdit && (
                    <li><div onClick={() => parent.contextMenuAction("editMedicineGuidanceOrder", index)}>編集</div></li>
                  )}
                  <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                  <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                  <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                </>
              )}
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "meal-order" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, "meal")}>コピー</div></li>
              {isWrite && (
                <>
                  <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                  <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                  <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
                </>
              )}
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "change-responsibility" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelChangeResponsibility", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {($canDoAction(feature_type, AUTHS.DELETE) || $canDoAction(feature_type, AUTHS.DELETE_PROXY)) && (
                      <li><div onClick={() => parent.contextMenuAction("deleteChangeResponsibility", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "hospital-move-bed" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, "hospital-move-bed")}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelHospitalMoveBed", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {($canDoAction(feature_type, AUTHS.DELETE) || $canDoAction(feature_type, AUTHS.DELETE_PROXY)) && (
                      <li><div onClick={() => parent.contextMenuAction("deleteHospitalMoveBed", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {(menuType == "hospital-apply" || menuType == "hospital-decision") && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelHospitalIn", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    <li><div onClick={() => parent.contextMenuAction("eidtHospitalIn", index, menuType)}>編集</div></li>
                    {($canDoAction(feature_type, AUTHS.DELETE) || $canDoAction(feature_type, AUTHS.DELETE_PROXY)) && (
                      <li><div onClick={() => parent.contextMenuAction("deleteHospitalIn", index, menuType)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "hospital-done" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, "hospital-done")}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelHospitalDone", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {($canDoAction(feature_type, AUTHS.DELETE) || $canDoAction(feature_type, AUTHS.DELETE_PROXY)) && (
                      <li><div onClick={() => parent.contextMenuAction("deleteHospitalDone", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {(menuType == "discharge-permit" || menuType == "discharge-decision" || menuType == "discharge-done") && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelDischarge", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {($canDoAction(feature_type, AUTHS.DELETE) || $canDoAction(feature_type, AUTHS.DELETE_PROXY)) && (
                      <li><div onClick={() => parent.contextMenuAction(
                        menuType == "discharge-permit" ? "deleteDischargePermit" : (menuType == "discharge-done" ? "deleteDischargeDone" : "deleteDischargeDecision"), index)}
                      >削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {(menuType == "hospital-going-out" || menuType == "hospital-going-in") && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelHospitalGoing", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {($canDoAction(feature_type, AUTHS.DELETE) || $canDoAction(feature_type, AUTHS.DELETE_PROXY)) && (
                      <>
                        <li><div onClick={() => parent.contextMenuAction(menuType == "hospital-going-out" ? "deleteHospitalGoingOut" : "deleteHospitalGoingIn", index)}>削除</div></li>
                      </>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "document-create" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                  {isDeleted ? (
                    <li><div onClick={() => parent.contextMenuAction("deleteCancelDocument", index)}>削除を取りやめ</div></li>
                  ):(
                    <>
                      {canEdit && (
                        <>
                          <li><div onClick={() => parent.contextMenuAction("editDocument", index)}>編集</div></li>
                        </>
                      )}
                      {canDelete && (
                        <>
                          <li><div onClick={() => parent.contextMenuAction("deleteDocument", index)}>削除</div></li>
                        </>
                      )}
                      <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                      <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                    </>
                  )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("seal_print", index)}>印刷</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "medical-examination-record" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                  <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                </>
              )}
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "death-register" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                {isDeleted ? (
                  <li><div onClick={() => parent.contextMenuAction("deleteCancelDeathRegister", index)}>削除を取りやめ</div></li>
                ):(
                  <>
                    {canDelete && (
                      <li><div onClick={() => parent.contextMenuAction("deleteDeathRegister", index)}>削除</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
                    <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
                  </>
                )}
                </>
              )}
              {menu_item.data.history !== "" && menu_item.data.history !== null && (
                <li><div onClick={() => parent.contextMenuAction("history_show", index)}>履歴表示</div></li>
              )}
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "hospital-discharge-guidacne-report" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
              <li><div onClick={() => parent.contextMenuAction("importance_level_high", index)}>重要度：高</div></li>
              <li><div onClick={() => parent.contextMenuAction("importance_level", index)}>重要度：標準</div></li>
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "diagnosis-comment" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>
              {isWrite && (
                <>
                  <li><div onClick={() => parent.contextMenuAction("addTag", index)}>付箋を追加</div></li>
                </>
              )}
            </ul>
          </ContextMenuUl>
        )}
        {menuType == "bacillus_inspection" && (
          <ContextMenuUl>
            <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
              <li><div onClick={() => parent.handleClipboard(index, menuType)}>コピー</div></li>              
            </ul>
          </ContextMenuUl>
        )}
      </>
    );
  } else {
    return null;
  }
};

const StickyMenu = ({visible,x,y,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.stickyMenuAction('tag_edit')}>付箋を編集</div></li>
          <li><div onClick={() => parent.stickyMenuAction('tag_delete')}>付箋を削除</div></li>
          <li><div onClick={() => parent.stickyMenuAction('view_tag_list')}>同じ種類の付箋が付いた項目を検索</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextKarteDateMenu = ({visible,x,y,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.stickyMenuAction('register_soap')}>カルテ追記</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class MiddleBox extends Component {
  constructor(props) {
    super(props);   
    // define clipboard functions
    this.clipboardPrescription = methods.clipboardPrescription.bind(this);
    this.clipboardInjection = methods.clipboardInjection.bind(this); 
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.radiation_pacs_flag = "ON";
    var radiation_pacs_flag = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"radiation_pacs_flag");
    if (radiation_pacs_flag != undefined && radiation_pacs_flag != null) this.radiation_pacs_flag = radiation_pacs_flag;    
    this.state = {
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        index: 0,
        menuType: "",
        isDeleted: false
      },
      stickyMenu:{visible:false},
      contextKarteDateMenu:{visible:false},
      inspectionModal: false,
      inspectionModalContents: [],
      sticky_note_data: [],
      isOpenDoneModal: false,
      isOpenTreatDoneModal: false,
      isOpenStopModal: false,
      isOpenRadiationModal:false,
      isOpenPrescriptionDoneModal: false,
      isOpenPrescriptionIncreasePeriodModal: false,
      isOpenInjectionIncreasePeriodModal: false,
      isOpenTreatmentIncreasePeriodModal: false,
      isOpenExaminationIncreasePeriodModal: false,
      isOpenInspectionDoneModal: false,
      isOpenRehabilyDoneModal: false,
      isOpenGuidanceNutritionRequestDoneModal: false,
      isOpenexaminDoneModal: false,
      isOpenAddTagModal: false,
      istagListModal: false,
      isTagDetailModal: false,
      isOpenInspectionImageModal: false,
      allOptions: [
        "milling",
        "can_generic_name",
        "is_not_generic",
        "one_dose_package",
        "temprary_dedicine",
        "insurance_type",
        "separate_packaging",
        "mixture"
      ],
      historyModal: false,
      historySoapModal: false,
      historyGuidanceNutritionRequestModal: false,
      historyDocumentModal: false,
      historyDeathRegisterModal: false,
      historyHospitalMoveModal: false,
      historyChangeResponsibilityModal: false,
      historyInHospitalModal: false,
      isOpenDischargeGuidanceReportHistory:false,
      historyHospitalDoneModal: false,
      historyDischargeModal: false,
      historyHospitalGoingModal: false,
      historyInspectionModal: false,
      historyTreatmentModal: false,
      historyExaminationModal: false,
      historyRehabilyModal: false,
      historyAllergyModal: false,
      openInputExamOrder: false,
      openExamOrderList:false,
      selectedOrderNumber: 0,
      historySoapList: [],
      confirm_message: "",
      confirm_type: "",
      modaly_type: "",
      endoscope_image:"",
      soapIndex: 0,
      alert_title:'',
      alert_messages:'',
      changeDepartmentModal: false,
      changeKarteStatusModal: false,
      soap_page_number:0,
      soapTrees:props.soapTrees,
      allDateList:props.allDateList,
      allTags:props.allTags,
      soapList:props.soapList,
      show_list_condition:props.show_list_condition,
      middleboxRefresh:false,
      isOpenInspectionStartEndDateTimeRegister: false,
      isOpenEndoscopeReservationModal: false,
    };
    let { cacheDelSoapState, cacheDelState, cacheDelInjectState, cacheDelExamState, cacheDelInspectionState, cacheDelTreatState } = persistedState(this.props.patientId);
    if (this.state.soapList != null && this.state.soapList != undefined && Object.keys(this.state.soapList).length > 0) {
      Object.keys(this.state.soapList).map(key=>{
        let item = this.state.soapList[key];
        if (cacheDelSoapState && cacheDelSoapState.length > 0 && item.category == "SOAP") {
          cacheDelSoapState.map(ele=>{
            if (item.data != null && item.data != undefined && ele.number == item.number && ele.system_patient_id == item.system_patient_id) {
              item.isDeleted = true;
            }
          });
        }
        if (item.category == "注射") item.isDeleted = false;
        if (cacheDelInjectState && cacheDelInjectState.length > 0 && item.category == "注射") {
          cacheDelInjectState.map(ele=>{
            if (item.data != null && item.data != undefined && ele.number == item.data.number) {
              item.isDeleted = true;
            }
          });
        }
        if (item.category == "処方") item.isDeleted = false;
        if (cacheDelState && cacheDelState.length > 0 && item.category == "処方") {
          cacheDelState.map(ele=>{
            if (item.data != null && item.data != undefined && ele.number == item.data.number) {
              item.isDeleted = true;
            }
          });
        }
        if (cacheDelExamState && cacheDelExamState.length > 0 && item.category == "検査") {
          cacheDelExamState.map(ele=>{
            if (item.data != null && item.data != undefined && ele.number == item.number && ele.system_patient_id == item.system_patient_id) {
              item.isDeleted = true;
            }
          });
        }
        if (cacheDelInspectionState && cacheDelInspectionState.length > 0 && item.category == "生理検査") {
          cacheDelInspectionState.map(ele=>{
            if (item.data != null && item.data != undefined && ele.number == item.number && ele.system_patient_id == item.system_patient_id) {
              item.isDeleted = true;
            }
          });
        }
        if (cacheDelTreatState && cacheDelTreatState.length > 0 && item.category == "処置") {
          cacheDelTreatState.map(ele=>{
            if (item.data != null && item.data != undefined && ele.number == item.number && ele.system_patient_id == item.system_patient_id && ele.isDeleted == true) {
              item.isDeleted = true;
            }
            ele.data.order_data.order_data.detail.map((detail, detail_idx)=>{
              if (ele.number == item.number && ele.system_patient_id == item.system_patient_id && detail.isDeleted == true) {
                item.data.order_data.order_data.detail[detail_idx].isDeleted = true;
              }
            });
          });
        }
      });
    }

    // YJ482 検体検査の注目マークの文字に何を使うかは動的にする
    let examination_attention_mark = "";
    let treat_order_part_position_mode = 0;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.examination_attention_mark !== undefined && initState.conf_data.examination_attention_mark != ""){
        examination_attention_mark = initState.conf_data.examination_attention_mark;
      }
      if(initState.conf_data.treat_order_part_position_mode !== undefined && initState.conf_data.treat_order_part_position_mode != ""){
        treat_order_part_position_mode = initState.conf_data.treat_order_part_position_mode;
      }
    }
    this.examination_attention_mark = examination_attention_mark;
    this.treat_order_part_position_mode = treat_order_part_position_mode;
    this.changeState = false;
    this.changeProps = false;
    this.stopGetHistory = false;

    // 定期注射で中止登録, 中止取消メニュー flag
    this.injection_stop_register_cancel_menu = 0; // 0: none, 1: register menu, 2: cancel menu    
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));    

    // ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
    this.visitPlaceMaster = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "visit_place_master");
  }

  componentDidMount = () => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    document
      .getElementById("soap_list_wrapper")
      .addEventListener("scroll", this.handleScroll);
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    const soapScrollTop = window.sessionStorage.getItem('soap_scroll_top') !== undefined ? parseInt(window.sessionStorage.getItem('soap_scroll_top')) : 0;
    $("#soap_list_wrapper").scrollTop(!isNaN(soapScrollTop) ? soapScrollTop : 0);
  }

  handleScroll = () => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.sessionStorage.setItem('soap_scroll_top', $("#soap_list_wrapper").scrollTop());
    let page = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER);
    if(page === undefined || page == null){
      page = this.state.soap_page_number;
    }
    let stopGetHistory = this.stopGetHistory;
    if (!stopGetHistory && (($("#soap_list_wrapper").scrollTop() + $("#soap_list_wrapper").height()) >= ($("#soap_content_wrapper").height() - 100))){
      let soapList = this.state.soapList;
      if (soapList != null && soapList != undefined && Object.keys(soapList).length > 0) {
        if ((page+1)*15>=Object.keys(soapList).length) {
          this.stopGetHistory = true;
        }
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, page + 1);
        this.setState({soap_page_number: page + 1});
      }
    }
  }

  handleClipboard = (_index, type) =>{
    if(this.state.soapList[_index] === undefined || this.state.soapList[_index] == null) {return;}
    let soapData = this.state.soapList[_index];
    switch(type){
      case "prescription": // ●YJ868 SOAP画面で、処方をクリップボードにコピーできるようにする
        this.clipboardPrescription(soapData, "middle");
        break;
      case "injection": // ●YJ939 中央カラムの項目は一通りクリップボードにコピー可能にする
        this.clipboardInjection(soapData, "middle");
        break;
      case "meal":
        clipboardMeal(soapData.data.order_data.order_data);
        break;
      case "exam_order":
        clipboardExamination(soapData);
        break;
      case "guidance":
        clipboardGuidance(soapData.data.order_data.order_data);
        break;
      case "rehabily":
        clipboardRehabily(soapData.data.order_data.order_data);
        break;
      case "discharge-permit":
      case "discharge-decision":
      case "discharge-done":
        clipboardDischarge(soapData.data.order_data.order_data, (type === "discharge-permit") ? "permit" : (type === "discharge-decision" ? "decision" : "done"));
        break;
      case "radiation":
        clipboardRadiation(soapData.data.order_data.order_data);
        break;
      case "hospital-done":
        clipboardHospitalDone(soapData.data.order_data.order_data);
        break;
      case "hospital-move-bed":
        clipboardHospitalMove(soapData.data.order_data.order_data);
        break;
      case "hospital-going-out":
      case "hospital-going-in":
        clipboardHospitalInOut(soapData.data.order_data.order_data);
        break;
      case "change-responsibility":
        clipboardChangeResponsibility(soapData.data.order_data.order_data);
        break;
      case "hospital-apply":
      case "hospital-decision":
        clipboardApplyDecision(soapData.data.order_data.order_data);
        break;
      case "inspection-order":
        clipboardInspection(soapData.data.order_data.order_data);
        break;
      case "document-create":
        clipboardDocument(soapData.data.order_data.order_data);
        break;
      case "medical-examination-record":
        clipboardMedicalExaminationRecord();
        break;
      case "hospital-discharge-guidacne-report":
        clipboardHospitalDischargeGuidanceReport(soapData.data.order_data.order_data);
        break;
      case "guidance-nutrition-request":
        clipboardNutritionGuidance(soapData.data.order_data.order_data);
        break;
      case "treatment-order":
        clipboardTreatment(soapData.data.order_data.order_data);
        break;
      case "patient-description-info":
        clipboardPatientDescriptionInfo(soapData.data.order_data.order_data);
        break;
      case "death-register":
        clipboardDeathRegister(soapData.data.order_data.order_data);
        break;
      case "diagnosis-comment":
        clipboardDiagnosisComment(soapData.data.diagnosis_comment);
        break;
      case "medicine-guidance-order":
        clipboardMedicineGuidance(soapData.data.order_data.order_data);
        break;
      case "bacillus_inspection":
        clipboardBacillusInspection(soapData);
        break;
    }
  }

  contextMenuAction = (act, index, other_value) => {
    window.sessionStorage.setItem('soap_scroll_top', $("#soap_list_wrapper").scrollTop());
    if(act === "doneOrder"){
      this.onDoneExamintion(index);
      return;
    }
    if(act === "inspectionDoneOrder"){
      this.onDoneInspection(index, other_value);
      return;
    }
    if(act === "inspection_end_date_register" || act === "inspection_continue_date_register_done"){
      let cur_soap = this.state.soapList[index];
      let inspection_info = {};
      inspection_info.treatment_datetime = cur_soap.treatment_datetime;
      inspection_info.history = cur_soap.data.history;
      inspection_info.input_staff_name = cur_soap.input_staff_name;
      inspection_info.updated_at = cur_soap.updated_at;
      inspection_info.is_doctor_consented = cur_soap.is_doctor_consented;
      inspection_info.order_data = cur_soap.data.order_data.order_data;
      if(inspection_info.order_data.patientInfo === undefined){
        inspection_info.order_data.patientInfo = {};
        inspection_info.order_data.patientInfo.receId = this.props.patientInfo.receId;
        inspection_info.order_data.patientInfo.name = this.props.patientInfo.name;
      }
      this.setState({
        soapIndex: index,
        isOpenInspectionStartEndDateTimeRegister:true,
        inspection_info,
        modal_type:act === "inspection_end_date_register" ? "end_date" : "done_continue_date",
      });
      return;
    }
    if(act === "guidanceNutritionRequestDone"){
      this.onDoneGuidanceNutritionRequest(index);
      return;
    }
    if(act === "treatmentDoneOrder"){
      this.onDoneTreatment(index);
      return;
    }    
    if(act === "prescriptionDoneOrder"){
      this.onDonePrescription(index);
      return;
    }
    if(act === "injectionDoneOrder"){
      this.onDoneInjection(index);
      return;
    }
    if(act === "injectionStopOrder"){
      this.onStopInjection(index, other_value);
      return;
    }
    if(act === "radiationDoneOrder"){
      this.onDoneRadiation(index);
      return;
    }
    if(act === "guidanceDoneOrder"){
      this.onDoneGuidance(index);
      return;
    }
    if(act === "rehabilyDoneOrder"){
      this.onDoneRehabily(index);
      return;
    }
    if(act === "addTag"){
      this.addTag(index);
      return;
    }
    if (act === "history_show") {
      let category = this.state.soapList[index].category;
      let target_table = this.state.soapList[index].target_table;
      if (target_table == "inspection_order") {
        this.openInspectionHistoryModal(this.state.soapList[index].number, this.state.soapList[index].data.history);
      } else if (target_table == "treat_order_header") {
        this.openTreatmentHistoryModal(this.state.soapList[index].number, this.state.soapList[index].data.history);
      } else if (target_table == "hospital_description") {
        this.open4gyHistoryModal(this.state.soapList[index].number, this.state.soapList[index].data.history);
      } else if (target_table === "soap") {
        this.openSoapHistoryModal(this.state.soapList[index].number, this.state.soapList[index].data.history, this.state.soapList[index].sub_category);
      } else if (target_table === "guidance_medication_request") {
        this.openGuidanceNutritionRequestHistoryModal(this.state.soapList[index].number, this.state.soapList[index].data.history);
      } else if (target_table == "order") {
        if (category == "処方" || category == "注射"){
          this.openModal(this.state.soapList[index].target_number, this.state.soapList[index].category);
        } else {
          this.openHistoryModal(this.state.soapList[index].number, this.state.soapList[index].data.history, this.state.soapList[index].category, this.state.soapList[index].sub_category);
        }
      } else if (target_table === "guidance_nutrition_request") {
        this.openGuidanceNutritionRequestHistoryModal(this.state.soapList[index].number, this.state.soapList[index].data.history);
      }
      return;
    }
    let select_doctor = true;
    if(act === "importance_level" || act === "importance_level_high" || act === "seal_print" || act === "showExamOrderResult"
      || act === "showOutHospitalExamOrderResult" || act === "showInHospitalExamOrderResult"){
      select_doctor = false;
    }
    if (select_doctor && this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.props.saveConfirmMessage(act, index, "middlebox_right_click", other_value);
      return;
    }
    if(act.includes("changeDepartment_")){
      this.changeDepartment(act, index);
      return;
    }
    if(act.includes("changeKarteStatus_")){
      this.changeKarteStatus(act, index);
      return;
    }
    if(act === "copyInspection"){
      this.props.copyInspectionAction(index, other_value);
      return;
    }
    if(act === "deleteChangeResponsibility"){
      this.checkEnableHospitalRecord(index,"_deleteChangeResponsibility");
      return;
    }
    if(act === "deleteHospitalMoveBed"){
      this.checkEnableHospitalRecord(index, "_deleteHospitalMoveBed");
      return;
    }
    if(act === "deleteCancelHospitalMoveBed"){
      this.checkEnableHospitalRecord(index, "_deleteCancelHospitalMoveBed");
      return;
    }
    if(act === "deleteHospitalIn"){
      this.checkEnableHospitalRecord(index, "_deleteHospitalIn", other_value);
      return;
    }
    if(act === "deleteHospitalDone"){
      this.checkEnableHospitalRecord(index, "_deleteHospitalDone");
      return;
    }
    if(act === "deleteDischargePermit"){
      this.checkEnableHospitalRecord(index, "_deleteDischargePermit");
      return;
    }
    if(act === "deleteDischargeDone"){
      this.checkEnableHospitalRecord(index,"_deleteDischargeDone");
      return;
    }
    if(act === "deleteDischargeDecision"){
      this.checkEnableHospitalRecord(index, "_deleteDischargeDecision");
      return;
    }
    if(act === "deleteHospitalGoingOut"){
      this.checkEnableHospitalRecord(index, "_deleteHospitalGoingOut");
      return;
    }
    if(act === "deleteHospitalGoingIn"){
      this.checkEnableHospitalRecord(index, "_deleteHospitalGoingIn");
      return;
    }
    let state_data = {};
    let sub_category = null;
    let examination_type = 1;
    state_data.soapIndex = index;
    switch (act){
      case "doUpdate":
        sub_category = this.state.soapList[index].sub_category !== '' ? this.state.soapList[index].sub_category : "プログレスノート";
        state_data.confirm_message = sub_category + "を編集しますか？";
        state_data.confirm_type = "_edit";
        state_data.soap_sub_category = sub_category;
        break;
      case "doRemove":
        state_data.confirm_message = "削除しますか？";
        state_data.confirm_type = "_del";
        break;
      case "doCancelDelete":
        sub_category = this.state.soapList[index].sub_category !== ''  ? this.state.soapList[index].sub_category : "プログレスノート";
        state_data.confirm_message = sub_category + "の削除を取りやめますか？";
        state_data.confirm_type = "_cancelDel";
        state_data.soapIndex = index;
        break;
      case "editExamOrder":
        sub_category = this.state.soapList[index].sub_category;
        if (sub_category === "細胞診検査"){examination_type = 2;}
        if (sub_category === "細菌検査"){examination_type = 3;}
        if (sub_category === "病理検査"){examination_type = 4;}
        state_data.confirm_message = (sub_category === 'オーダー' ? '検体検査' : sub_category) + "オーダーを編集しますか？";
        state_data.confirm_type = "_examEdit";
        state_data.examination_type = examination_type;
        break;
      case "inputExamOrderResult":
        state_data.openInputExamOrder = true;
        break;
      case "showExamOrderResult":
        state_data.openExamOrderList = true;
        break;
      case "showOutHospitalExamOrderResult":
        state_data.out_hospital_header_number = index;
        state_data.inspectionModal = true;
        break;
      case "showInHospitalExamOrderResult":
        state_data.in_hospital_header_number = index;
        state_data.inspectionModal = true;
        break;
      case "doneAndEditOrder":
        state_data.confirm_message = "実施入力しますか？";
        state_data.confirm_type = "_doneAndOrderEdit";
        break;
      case "deleteCancelIExamOrder":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_cancelDelExam";
        break;
      case "deleteExamOrder":
        sub_category = this.state.soapList[index].sub_category;
        state_data.confirm_message = (sub_category === 'オーダー' ? '検体検査' : sub_category) + "オーダーを削除しますか？";
        state_data.confirm_type = "_deleteExam";
        break;
      case "addReservationInspectionOrder":
        state_data.isOpenEndoscopeReservationModal = true;
        state_data.reservation_info = this.state.soapList[index].data.order_data.order_data;
        state_data.reservation_info.created_at = this.state.soapList[index].data.created_at;
        state_data.reserve_type = 'inspection_middle';
        break;
      case "editInspectionOrder":
        state_data.confirm_message = (other_value == 17 ? "内視鏡":"生理")+"検査オーダーを編集しますか？";
        state_data.confirm_type = "_editInspection";
        break;
      case "editGuidanceNutritionRequest":
        state_data.confirm_message = "栄養指導依頼オーダーを編集しますか？";
        state_data.confirm_type = "_editGuidanceNutritionRequest";
        break;
      case "deleteInspectionOrder":
        state_data.confirm_message = (other_value == 17 ? "内視鏡":"生理")+"検査オーダーを削除しますか？";
        state_data.confirm_type = "_deleteInspection";
        break;
      case "deleteCancelInspectionOrder":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_cancelDelInspection";
        break;
      case "stopInspectionOrder":
        state_data.confirm_message = (other_value == 17 ? "内視鏡":"生理")+"検査オーダーを中止しますか？";
        state_data.confirm_type = "_stopInspectionOrder";
        break;
      case "stopCancelInspectionOrder":
        state_data.confirm_message = "中止を取りやめますか？";
        state_data.confirm_type = "_cancelStopInspection";
        break;
      case "deleteTreatmentOrder":
        state_data.confirm_message = "処置オーダーを削除しますか？";
        state_data.confirm_type = "_deleteTreatment";
        break;
      case "deleteTreatmentPractice":
        state_data.confirm_message = "処置行為を削除しますか？";
        state_data.confirm_type = "_deleteTreatmentPractice";
        break;
      case "deleteCancelTreatmentOrder":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_cancelDelTreatment";
        break;
      case "deleteCancelTreatmentPractice":
        state_data.confirm_message = "行為削除を取りやめますか？";
        state_data.confirm_type = "_cancelDelTreatmentPractice";
        break;
      case "editTreatmentOrder":
        state_data.confirm_message = "処置オーダーを編集しますか？";
        state_data.confirm_type = "_editTreatment";
        break;
      case "injectionStopCancelOrder":
        state_data.confirm_message = "中止取消しますか？";
        state_data.confirm_type = "_injectionStopCancel";
        break;
      case "editHospitalOrder":
        state_data.confirm_message = this.state.soapList[index].sub_category + "を編集しますか？";
        state_data.confirm_type = "_editHospital";
        break;
      case "deleteHospitalOrder":
        state_data.confirm_message = this.state.soapList[index].sub_category + "を削除しますか？";
        state_data.confirm_type = "_deleteHospital";
        break;
      case "do_prescription":
        state_data.confirm_message = "DO処方を行いますか？";
        state_data.confirm_type = "_doPrescription";
        break;
      case "do_injection":
        state_data.confirm_message = "DO注射を行いますか？";
        state_data.confirm_type = "_doInjection";
        break;
      case "edit_prescription":
        state_data.confirm_message = "処方歴を編集しますか？";
        state_data.confirm_type = "_editPrescription";
        break;
      case "increase_prescription":
        state_data.confirm_message = "定期処方期間を編集しますか？";
        state_data.confirm_title = "編集確認";
        state_data.confirm_type = "_increasePrescription";
        break;
      case "increase_injection":
        state_data.confirm_message = "定期注射期間を編集しますか？";
        state_data.confirm_title = "編集確認";
        state_data.confirm_type = "_increaseInjection";
        break;
      case "edit_injection":
        state_data.confirm_message = "注射履歴を編集しますか？";
        state_data.confirm_type = "_editInjection";
        break;
      case "deleteCancelHospital":
        state_data.confirm_message = this.state.soapList[index].sub_category + "の削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelHospital";
        break;
      case "editRadiationOrder":
        state_data.confirm_message = "放射線オーダーを編集しますか？";
        state_data.confirm_type = "_editRadiationOrder";
        break;
      case "deleteRadiationOrder":
        state_data.confirm_message = "放射線オーダーを削除しますか？";
        state_data.confirm_type = "_deleteRadiationOrder";
        break;
      case "deleteCancelRadiationOrder":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelRadiationOrder";
        break;
      case "cancelRecovery_prescription":
        state_data.confirm_message = "処方[Rp単位]の削除を取りやめますか？";
        state_data.confirm_type = "_recoveryRp_prescription";
        break;
      case "cancelAllRecovery_prescription":
        state_data.confirm_message = "処方削除を取りやめますか？";
        state_data.confirm_type = "_recoveryAll_prescription";
        break;
      case "cancelAllRecovery_injection":
        state_data.confirm_message = "注射削除を取りやめますか？";
        state_data.confirm_type = "_recoveryAll_prescription";
        break;
      case "cancel_prescription":
        state_data.confirm_message = "削除しますか？";
        state_data.confirm_type = "_delRp_prescription";
        break;
      case "cancelAll_prescription":
        state_data.confirm_message = "処方を削除しますか？";
        state_data.confirm_type = "_delAll_prescription";
        break;
      case "cancelAll_injection":
        state_data.confirm_message = "注射を削除しますか？";
        state_data.confirm_type = "_delAll_prescription";
        break;
      case "deleteGuidanceOrder":
        state_data.confirm_message = "汎用オーダーを削除しますか？";
        state_data.confirm_type = "_deleteGuidance";
        break;
      case "deleteCancelGuidanceOrder":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_cancelDelGuidance";
        break;
      case "editGuidanceOrder":
        state_data.confirm_message = "汎用オーダーを編集しますか？";
        state_data.confirm_type = "_editGuidance";
        break;
      case "deleteRehabilyOrder":
        state_data.confirm_message = "リハビリオーダーを削除しますか？";
        state_data.confirm_type = "_deleteRehabily";
        break;
      case "deleteCancelRehabilyOrder":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_cancelDelRehabily";
        break;
      case "editRehabilyOrder":
        state_data.confirm_message = "リハビリオーダーを編集しますか？";
        state_data.confirm_type = "_editRehabily";
        break;
      case "editMedicineGuidanceOrder":
        state_data.confirm_message = "服薬指導依頼を編集しますか？";
        state_data.confirm_type = "_editMedicineGuidance";
        break;
      case "seal_print":
        state_data.confirm_message = "印刷してよろしいですか？";
        state_data.confirm_type = "_seal_print";
        break;
      case "importance_level_high":
        state_data.confirm_message = "重要度を「高」に設定しますか？";
        state_data.confirm_type = "_importance_level";
        state_data.importance_level = 100;
        break;
      case "importance_level":
        state_data.confirm_message = "重要度を「標準」に設定しますか？";
        state_data.confirm_type = "_importance_level";
        state_data.importance_level = 0;
        break;
      case "examResultDoneOrder":
        state_data.confirm_message = "検査結果を実施しますか？";
        state_data.confirm_type = "_doneExamResult";
        break;
      case "examResultReport":
        state_data.confirm_message = "状態を「患者様に結果報告済み」に変更しますか？";
        state_data.confirm_type = "_reportExamResult";
        break;
      case "deleteCancelChangeResponsibility":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelChangeResponsibility";
        break;
      case "editDocument":
        state_data.confirm_message = "文書を編集しますか？";
        state_data.confirm_type = "_editDocument";
        break;
      case "deleteDocument":
        state_data.confirm_message = "文書を削除しますか？";
        state_data.confirm_type = "_deleteDocument";
        break;
      case "deleteCancelDocument":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelDocument";
        break;
      case "eidtHospitalIn":
        state_data.confirm_message = (other_value == "hospital-apply" ? "入院申込オーダー" : "入院決定オーダー") + "を編集しますか？";
        state_data.confirm_type = "_eidtHospitalIn";
        break;
      case "deleteCancelHospitalIn":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelHospitalIn";
        break;
      case "deleteCancelHospitalDone":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelHospitalDone";
        break;
      case "deleteCancelDischarge":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelDischarge";
        break;
      case "deleteCancelHospitalGoing":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelHospitalGoing";
        break;
      case "deleteDeathRegister":
        state_data.confirm_message = "死亡登録を取り消しますか？";
        state_data.confirm_type = "_deleteDeathRegister";
        break;
      case "deleteCancelDeathRegister":
        state_data.confirm_message = "削除を取りやめますか？";
        state_data.confirm_type = "_deleteCancelDeathRegister";
        break;
      case "increase_treatment":
        state_data.confirm_message = "定期処置期間を編集しますか？";
        state_data.confirm_title = "編集確認";
        state_data.confirm_type = "_increaseTreatment";
        break;
      case "increase_examination":
        state_data.confirm_message = "予定日付を追加しますか？";
        state_data.confirm_type = "_increaseExamination";
        break;
    }
    this.setState(state_data);
  };

  getRows = string => {
    return (string.match(/\n/g) || []).length + 1;
  }

  onEditSoap(type='', department_code=null) {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let presData = undefined;
    let cur_soap = this.state.soapList[this.state.soapIndex];
    let updateDate = new Date(cur_soap.updated_at);
    let updateYear = updateDate.getFullYear();
    let updateMonth = updateDate.getMonth() + 1;
    let updateDay = updateDate.getDate();
    updateDate = new Date(updateYear, updateMonth, updateDay);
    var curDate = new Date();
    let curYear = curDate.getFullYear();
    let curMonth = curDate.getMonth() + 1;
    let curDay = curDate.getDate();
    // ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
    let visit_place_id = cur_soap.visit_place_id;
    curDate = new Date(curYear, curMonth, curDay);
    if (updateDate < curDate) {
      let actionFlag = false;
      if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.EDIT) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.EDIT_OLD) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.EDIT_PROXY_OLD)){
        actionFlag = true;
      }
      if(!actionFlag){
        window.sessionStorage.setItem("alert_messages", "権限がありません。");
        return;
      }
    }
    presData = {
      soap_start_at: cur_soap.data.soap_start_at !== undefined && cur_soap.data.soap_start_at.substr(0, 10),
      sharp_text: cur_soap.data.sharp_text,
      s_text: cur_soap.data.s_text,
      o_text: cur_soap.data.o_text,
      a_text: cur_soap.data.a_text,
      p_text: cur_soap.data.p_text,
      importance: cur_soap.data.importance,
      number: cur_soap.target_number,
      updateDate: cur_soap.updated_at,
      created_at: cur_soap.created_at,
      last_doctor_name: cur_soap.doctor_name,
      last_doctor_code: cur_soap.instruction_doctor_code,
      visit_place_id: visit_place_id,
    };
    let sub_category = cur_soap.sub_category !== '' ? cur_soap.sub_category : "プログレスノート";
    if(sub_category !== 'プログレスノート'){
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("hospital_note"));
    } else{
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("soap"));
    }
    if(type === 'change_department'){
      this.props.updateSoap(presData, this.state.soapIndex, department_code, this.getDepartment(department_code));
    } else if(type === 'change_karteStatus'){
      this.props.updateSoap(presData, this.state.soapIndex, "change_karteStatus", department_code);
    } else {
      this.props.updateSoap(presData, this.state.soapIndex);
    }
  }

  onEditInspection = async (type="", department_id) => {
    let presData = this.state.soapList[this.state.soapIndex];
    let inspection = presData.data.order_data.order_data;
    inspection.created_at = presData.created_at;
    inspection.state = presData.data.state;
    inspection.image_path = presData.data.image_path;
    inspection.imgBase64 = "";
    inspection.isForUpdate = 1;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT);
    let isExist = false;
    let stampKey = new Date().getTime();
    if (cache_data != null && cache_data != undefined) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index].number == presData.data.number) {
          isExist = true;
          stampKey = index;
        }
      });
    }
    if(type === 'change_department'){
      inspection.department_id = department_id;
    }
    if(type === 'change_karteStatus'){
      inspection.karte_status = department_id;
    }
    if (isExist == false) {
      if (presData.data.image_path != null && presData.data.image_path != undefined && presData.data.image_path != "") {
        const { data } = await axios.post("/app/api/v2/order/inspection/getImage", {
          params: {
            number: presData.data.number
          }
        });
        inspection.imgBase64 = data;
      }
      if (type =='change_department' || type =='change_karteStatus'){
        inspection.last_doctor_code = inspection.doctor_code;
        inspection.last_doctor_name = inspection.doctor_name;
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, stampKey, JSON.stringify(inspection), 'insert');
      }
      this.context.$setExaminationOrderFlag(1);
    }
    if(!(type == 'change_department' || type == 'change_karteStatus')){
      this.props.showModal("edit_modal", "clickOpenPhysiologicalPopup", stampKey,true, inspection);
    }
  }

  onEditGuidanceNutritionRequest = async () => {
    let presData = this.state.soapList[this.state.soapIndex];
    let nutrition_request = presData.data.order_data.order_data;
    nutrition_request.created_at = presData.created_at;
    nutrition_request.done_order = presData.data.done_order;
    nutrition_request.isForUpdate = 1;
    this.props.showModal("edit_modal", "clickOpenNutritionGuidance", 0, true, nutrition_request);
  }

  onDeleteInspection = (type) => {
    let cur_inspection = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        if(type == 'delete'){
          cur_soapList[ind].isDeleted = true;
        } else {
          cur_soapList[ind].isStopped = true;
        }
        cur_soapList[ind].doctor_code = this.state.soapList[ind].instruction_doctor_code;
        cur_inspection = this.state.soapList[ind];
      }
      return cur_soapList[ind];
    });

    let inspection = cur_inspection.data.order_data.order_data;
    inspection.created_at = cur_inspection.created_at;
    inspection.state = cur_inspection.data.state;
    inspection.karte_number = cur_inspection.number;
    inspection.cache_type = type;
    inspection.last_doctor_code = inspection.doctor_code;
    inspection.last_doctor_name = inspection.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_DELETE, new Date().getTime(), JSON.stringify(inspection), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  cancelDelInspection = (type) => {
    let nCacheNumber = -1;
    let cur_soapList =  this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        if(type == "delete"){
          cur_soapList[ind].isDeleted = false;
        } else {
          cur_soapList[ind].isStopped = false;
        }
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });

    let { cacheDelInspectionState } = persistedState(this.props.patientId);
    if (!cacheDelInspectionState) {
      cacheDelInspectionState = [];
    }
    let delInspectionData = {};
    Object.keys(cacheDelInspectionState).map(key=>{
      if(cacheDelInspectionState[key]['karte_number'] != nCacheNumber){
        delInspectionData[key] = cacheDelInspectionState[key];
      }
    });

    if (Object.keys(delInspectionData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_DELETE, JSON.stringify(delInspectionData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onEditTreatment = (type="", department_id=null) => {
    let presData = this.state.soapList[this.state.soapIndex];
    let treatment = presData.data.order_data.order_data;
    treatment.created_at = presData.created_at;
    treatment.state = presData.data.state;
    treatment.header.isForUpdate = 1;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT);
    let isExist = false;
    let stampKey = new Date().getTime();
    if (cache_data != null && cache_data != undefined) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index]['header'].number == presData.data.number) {
          isExist = true;
          stampKey = index;
        }
      });
    }
    if(type === 'change_department'){
      treatment.header.department_id = department_id;
    }
    if(type === 'change_karteStatus'){
      treatment.header.karte_status = department_id;
    }

    if(isExist == false) {
      if(type === 'change_department' || type === "change_karteStatus"){
        treatment.last_doctor_code = treatment.header.doctor_code;
        treatment.last_doctor_name = treatment.header.doctor_name;
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, stampKey, JSON.stringify(treatment), 'insert');
      }
      this.context.$setExaminationOrderFlag(1);
    }
    if(!(type === 'change_department' || type === 'change_karteStatus')){
      if(treatment.general_id === 2){
        this.props.showModal("edit_modal", "clickOpenHomeTreatmentPopup", stampKey, true, treatment);
      } else if(treatment.general_id === 3){
        this.props.showModal("edit_modal", "clickOpenHospitalTreatmentPopup", stampKey, true, treatment);
      } else {
        this.props.showModal("edit_modal", "clickOpenOutpatientPopup", stampKey, true, treatment);
      }
    }
  }

  onDeleteTreatment = () => {
    let cur_treatment = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_treatment = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let treatment = cur_treatment.data.order_data.order_data;
    treatment.created_at = cur_treatment.created_at;
    treatment.state = cur_treatment.data.state;
    treatment.karte_number = cur_treatment.number;
    treatment.last_doctor_code = treatment.header.doctor_code;
    treatment.last_doctor_name = treatment.header.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_DELETE, new Date().getTime(), JSON.stringify(treatment), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onDeleteTreatmentPractice = () => {
    let soapList = this.state.soapList;
    soapList[this.state.soapIndex].data.order_data.order_data.detail.map((detail, idx) => {
      if(idx === this.state.soapDetailIndex){
        detail.isDeleted = true;
      }
    });
    let cur_treatment = soapList[this.state.soapIndex];
    let { cacheDelTreatState } = persistedState(this.props.patientId);
    if (!cacheDelTreatState) {
      cacheDelTreatState = [];
    }
    cacheDelTreatState = cacheDelTreatState.filter(data => {
      return data.number !== cur_treatment.number;
    });
    let deleted_count = 0;
    cur_treatment.data.order_data.order_data.detail.map((detail) => {
      if((detail.is_enabled == undefined) && (detail.isDeleted == undefined || detail.isDeleted == false)){
        deleted_count ++;
      }
    })
    if(deleted_count == 0){
      cur_treatment.isDeleted = true;
      cur_treatment.doctor_code = cur_treatment.instruction_doctor_code;
    }
    cacheDelTreatState.push(cur_treatment);
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_DELETE, JSON.stringify(cacheDelTreatState));
    this.props.updateSoapList(soapList);
  }

  cancelDelTreatment = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
        cur_soapList[ind].data.order_data.order_data.detail.map((detail) => {
          detail.isDeleted = false;
        })
      }
      return cur_soapList[ind];
    });

    let { cacheDelTreatState } = persistedState(this.props.patientId);
    if (!cacheDelTreatState) {
      cacheDelTreatState = [];
    }

    let delTreatData = {};
    Object.keys(cacheDelTreatState).map(key=>{
      if(cacheDelTreatState[key]['karte_number'] != nCacheNumber){
        delTreatData[key] = cacheDelTreatState[key];
      }
    })
    // cacheDelTreatState = cacheDelTreatState.filter(data => {
    // return data.number !== nCacheNumber;
    // });

    if (Object.keys(delTreatData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_DELETE, JSON.stringify(delTreatData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  cancelDelTreatmentPractice = () => {
    let nCacheNumber = -1;
    let cur_treat = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].data.order_data.order_data.detail.map((detail, idx) => {
          if(idx === this.state.soapDetailIndex){
            detail.isDeleted = false;
            cur_soapList[ind].isDeleted = false;
          }
        })
        nCacheNumber = cur_soapList[ind].number;
        cur_treat = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });

    let { cacheDelTreatState } = persistedState(this.props.patientId);
    if (!cacheDelTreatState) {
      cacheDelTreatState = [];
    }

    cacheDelTreatState = cacheDelTreatState.filter(data => {
      return data.number !== nCacheNumber;
    });
    let deleted_count = 0;
    cur_treat.data.order_data.order_data.detail.map((detail) => {
      if(detail.isDeleted === true){
        deleted_count ++;
      }
    })
    if(deleted_count){
      cacheDelTreatState.push(cur_treat);
    }

    if (cacheDelTreatState.length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_DELETE, JSON.stringify(cacheDelTreatState));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_DELETE);
    }

    this.props.updateSoapList(soapList);
  }
//---------------------------------------------------------------------------

  onEditHospital = (type="", department_id) => {
    let soapData = this.state.soapList[this.state.soapIndex];
    let hospital_data = soapData.data.order_data.order_data;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT);
    let isExist = false;
    let stampKey = new Date().getTime();
    if (cache_data !== undefined && cache_data != null) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index].number == soapData.data.number) {
          isExist = true;
          stampKey = index;
        }
      });
    }
    if (isExist === false) {
      if(type === 'change_department'){
        hospital_data.department_id = department_id;
        hospital_data.isForUpdate = 1;
        hospital_data.last_doctor_code = hospital_data.doctor_code;
        hospital_data.last_doctor_name = hospital_data.doctor_name;
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, stampKey, JSON.stringify(hospital_data), 'insert');
      }
      this.context.$setExaminationOrderFlag(1);
    }
    if(type !== 'change_department'){
      this.props.showModal("edit_modal", "clickOpenAllergyPopup", stampKey, true, hospital_data);
    }
  };
  
  onDeleteHospital = () => {
    let cur_hospital = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_hospital = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let hospital = cur_hospital.data.order_data.order_data;
    hospital.created_at = cur_hospital.created_at;
    hospital.karte_number = cur_hospital.number;
    hospital.last_doctor_code = hospital.doctor_code;
    hospital.last_doctor_name = hospital.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_DELETE, new Date().getTime(), JSON.stringify(hospital), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  };
  
  cancelDelHospital = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheDelAllergyState } = persistedState(this.props.patientId);
    if (!cacheDelAllergyState) {
      cacheDelAllergyState = [];
    }
    let delAllergyData = {};
    Object.keys(cacheDelAllergyState).map(key=>{
      if(cacheDelAllergyState[key]['karte_number'] != nCacheNumber){
        delAllergyData[key] = cacheDelAllergyState[key];
      }
    });
    if (Object.keys(delAllergyData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_DELETE, JSON.stringify(delAllergyData));
    } else {
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  };

  onDoPrescription = () => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let soapData = this.state.soapList[this.state.soapIndex];
    window.localStorage.setItem("soap_insert_drop_number", soapData["data"]["number"]);
    this.props.goToDropPage(`/patients/${this.props.patientId}/prescription`);

  };

  onDoInjection = () => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let soapData = this.state.soapList[this.state.soapIndex];
    window.localStorage.setItem("soap_insert_drop_number", soapData["data"]["number"]);
    this.props.goToDropPage(`/patients/${this.props.patientId}/injection`);

  };

  onEditPrescription = (type="", department_code=null) => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let soapData = this.state.soapList[this.state.soapIndex];
    if(type==='change_department'){
      let systemPatientId = this.props.patientId;
      let goToDropPage = this.props.goToDropPage;
      this.props.getLastPrescription(systemPatientId, department_code, null, this.getDepartment(department_code), soapData["data"]["number"]).then(function(value){
        if(value) {
          goToDropPage(`/patients/${systemPatientId}/soap`);
        }
      });
    } else if(type==='change_karteStatus') {
      let systemPatientId = this.props.patientId;
      let goToDropPage = this.props.goToDropPage;
      this.props.getLastPrescription(systemPatientId, department_code, null, this.getDepartment(department_code), soapData["data"]["number"], null, department_code).then(function(value){
        if(value) {
          goToDropPage(`/patients/${systemPatientId}/soap`);
        }
      });
    } else {
      window.localStorage.setItem("soap_edit_drop_number", soapData["data"]["number"]);
      this.props.goToDropPage(`/patients/${this.props.patientId}/prescription`);
    }
  };

  onEditInjection = (type="", department_code=null) => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let soapData = this.state.soapList[this.state.soapIndex];
    if(type==='change_department'){
      let systemPatientId = this.props.patientId;
      let goToDropPage = this.props.goToDropPage;
      this.props.getLastInjection(systemPatientId, department_code, this.getDepartment(department_code), soapData["data"]["number"]).then(function(value){
        if(value) {
          goToDropPage(`/patients/${systemPatientId}/soap`);
        }
      });
    } else if(type==='change_karteStatus') {
      let systemPatientId = this.props.patientId;
      let goToDropPage = this.props.goToDropPage;
      this.props.getLastInjection(systemPatientId, department_code, this.getDepartment(department_code), soapData["data"]["number"], null, department_code).then(function(value){
        if(value) {
          goToDropPage(`/patients/${systemPatientId}/soap`);
        }
      });
    } else {
      window.localStorage.setItem("soap_edit_drop_number", soapData["data"]["number"]);
      this.props.goToDropPage(`/patients/${this.props.patientId}/injection`);
    }
  };

  onEditRadiation = async (type="", department_id) => {
    let soapData = this.state.soapList[this.state.soapIndex];
    let radiation = soapData.data.order_data.order_data;
    radiation.created_at = soapData.created_at;
    radiation.state = soapData.data.state;
    radiation.isForUpdate = 1;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT);
    let isExist = false;
    let stampKey = new Date().getTime();
    if (cache_data != null && cache_data != undefined) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index].number == soapData.data.number) {
          isExist = true;
          stampKey = index;
        }
      });
    }
    if(type === 'change_department'){
      radiation.department_id = department_id;
      radiation.department_code = department_id;
    }
    if(type === 'change_karteStatus'){
      radiation.karte_status = department_id;      
    }
    if (isExist == false) {
      // get shema image
      if (radiation.image_path != null && radiation.image_path != undefined && radiation.image_path != "") {
        const { data } = await axios.post("/app/api/v2/order/radiation/getImage", {
          params: {
            number: soapData['target_number']
          }
        });
        radiation.imgBase64 = data;
      }
      if(type === 'change_department' || type === 'change_karteStatus'){
        radiation.last_doctor_code = radiation.doctor_code;
        radiation.last_doctor_name = radiation.doctor_name;
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, stampKey, JSON.stringify(radiation), 'insert');
      }
      this.context.$setExaminationOrderFlag(1);
    }
    if(!(type == 'change_department' || type == 'change_karteStatus')){
      this.props.showModal("edit_modal", "clickOpenRadiationPopup", stampKey,true,radiation);
    }
  }

  onDeleteRadiation = () => {
    let cur_radiation = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_radiation = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });

    let radiation = cur_radiation.data.order_data.order_data;
    radiation.last_doctor_code = radiation.doctor_code;
    radiation.last_doctor_name = radiation.doctor_name;
    radiation.created_at = cur_radiation.created_at;
    radiation.done_order = cur_radiation.data.done_order;
    radiation.karte_number = cur_radiation.number;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_DELETE, new Date().getTime(), JSON.stringify(radiation), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  cancelDelRadiation = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });

    let { cacheDelRadiationState } = persistedState(this.props.patientId);
    if (!cacheDelRadiationState) {
      cacheDelRadiationState = [];
    }
    let delRadiationData = {};
    Object.keys(cacheDelRadiationState).map(key=>{
      if(cacheDelRadiationState[key]['karte_number'] != nCacheNumber){
        delRadiationData[key] = cacheDelRadiationState[key];
      }
    });

    if (Object.keys(delRadiationData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_DELETE, JSON.stringify(delRadiationData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_DELETE);
    }

    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onDoneInspection = (index, other_value) => {
    let modal_data = this.state.soapList[index];
    this.setState({
      soapIndex: index,
      done_modal_title: other_value == 17 ? "内視鏡実施" : "生理実施",
      done_modal_type: other_value == 17 ? "endoscope" : "inspection",
      done_modal_data: modal_data,
      isOpenInspectionDoneModal: true
    });
  }

  onDoneGuidanceNutritionRequest = (index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_number = this.props.patientInfo.receId;
    modal_data.patient_name = this.props.patientInfo.name;
    this.setState({
      soapIndex: index,
      done_modal_data: modal_data,
      isOpenGuidanceNutritionRequestDoneModal: true
    });
  }

  onDoneExamintion = (index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_number = this.props.patientInfo.receId;
    modal_data.patient_name = this.props.patientInfo.name;
    this.setState({
      soapIndex: index,
      done_modal_data: modal_data,
      isOpenexaminDoneModal: true
    });
  }

  onIncreasePrescription = (index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_id = modal_data.system_patient_id;
    this.setState({
      soapIndex: index,
      done_modal_title: "処方",
      done_modal_type: "prescription_increase",
      done_modal_data: modal_data,
      isOpenPrescriptionIncreasePeriodModal: true
    });
  }

  onIncreaseInjection = (index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_id = modal_data.system_patient_id;
    this.setState({
      soapIndex: index,
      done_modal_title: "注射",
      done_modal_type: "injection_increase",
      done_modal_data: modal_data,
      isOpenInjectionIncreasePeriodModal: true
    });
  }
  
  onIncreaseTreatment = (index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_id = modal_data.system_patient_id;
    this.setState({
      soapIndex: index,
      done_modal_title: "処置",
      done_modal_type: "treatment_increase",
      done_modal_data: modal_data,
      isOpenTreatmentIncreasePeriodModal: true
    });
  }
  onIncreaseExamination = (index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_id = modal_data.system_patient_id;
    this.setState({
      soapIndex: index,
      done_modal_title: "検査",
      done_modal_type: "examination_increase",
      done_modal_data: modal_data,
      isOpenExaminationIncreasePeriodModal: true
    });
  }

  onDonePrescription = (index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_id = modal_data.system_patient_id;
    this.setState({
      soapIndex: index,
      done_modal_title: "処方",
      done_modal_type: "prescription",
      done_modal_data: modal_data,
      isOpenPrescriptionDoneModal: true
    });
    
    // let modal_data = this.getCurrentSoap(index);
    // let cur_soapList = this.state.soapList;
    // let soapList = Object.keys(cur_soapList).map((ind) => {
    //   if (ind === index) {
    //     cur_soapList[ind].is_done = 1;
    //     cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
    //   }
    //   return cur_soapList[ind];
    // });

    // const postData = [
    //   {
    //     number: modal_data.data.number,
    //     system_patient_id: this.props.patientId, //HARUKA患者番号
    //     insurance_type: 0, //保険情報現状固定
    //     body_part: "",
    //     order_data: modal_data.data.order_data,
    //     med_consult: 1, //お薬相談希望ありフラグ
    //     supply_med_info: 1, //薬剤情報提供ありフラグ
    //     psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
    //     poultice_many_reason: "", //向精神薬多剤投与理由
    //     free_comment: [], //備考
    //     department_code: 1,
    //     is_done : 1
    //   }
    // ];

    // let { cacheDoneState } = persistedState(this.props.patientId);
    // if (!cacheDoneState) {
    //   cacheDoneState = [];
    // }
    // cacheDoneState = cacheDoneState.filter(data => {
    //   return data.number !== modal_data.data.number;
    // });
    // cacheDoneState.push(postData[0]);

    // karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE, JSON.stringify(cacheDoneState));
    // let done_medicineHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
    //   if (done_medicineHistory === undefined || done_medicineHistory == null) {
    //       done_medicineHistory = [];
    //   }
    //   if (done_medicineHistory.findIndex(x=>x.number == postData[0].number) === -1)
    //     done_medicineHistory.push(postData[0]);
    //   karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY, JSON.stringify(done_medicineHistory));
    //   this.props.updateSoapList(soapList);
  };

  onDoneInjection = (index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_id = modal_data.system_patient_id;
    this.setState({
      soapIndex: index,
      done_modal_title: "注射",
      done_modal_type: "injection",
      done_modal_data: modal_data,
      isOpenDoneModal: true
    });
  };

  onStopInjection = (index, _rp_index) => {
    let modal_data = this.state.soapList[index];
    modal_data.patient_id = modal_data.system_patient_id;
    this.setState({
      soapIndex: index,
      done_modal_title: "注射",
      done_modal_type: "injection",
      done_modal_data: modal_data,
      isOpenStopModal: true,
      rp_index: _rp_index
    });
  };

  onStopInjectionCancel = async () => {
    let modal_data = this.state.soapList[this.state.soapIndex];
    let path = "/app/api/v2/order/injection/stopInjectionCancel";
    let post_data = {
        number: modal_data.data.number,
        system_patient_id: this.props.patientId,
        rp_index: this.state.rp_index,        
    };
    let result = "";
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          result = res;
          this.setState({alert_messages: "中止取消を完了しました。"});
        }
      })
      .catch(() => {
        this.closeModal("中止取消に失敗しました。");
      });

    if (result != "") {
      this.changeDoneState(modal_data.number, "injection_stop", result);
    }
  };

  onDoneTreatment = (index) => {
    let modal_data = this.state.soapList[index];
    this.setState({
      soapIndex: index,
      done_modal_data: JSON.parse(JSON.stringify(modal_data)),
      isOpenTreatDoneModal: true
    });
  }

  onEditExamOrder = (nIdx, nType="", department_code=null) => {
    let tmp = this.state.soapList[nIdx].data.order_data.order_data;
    tmp.isForUpdate = 1;
    tmp.created_at = this.state.soapList[nIdx].created_at;
    tmp.number = this.state.soapList[nIdx].data.number;
    let examination_type = tmp.examination_type;
    if (nType == "order_input") {
      tmp.is_done = 1;
      tmp.is_done_edit = 1;
      let tmpCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
      if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
        tmpCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE);
      } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
        tmpCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE);
      } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
        tmpCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE);
      }
      if (tmpCacheData != null) {
        tmpCacheData = tmpCacheData.filter(x=>x.number != tmp.number);
        if (examination_type == EXAMINATION_TYPE.EXAMINATION) {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_ORDER_DONE, JSON.stringify(tmpCacheData));
        } else if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE, JSON.stringify(tmpCacheData));
        } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE, JSON.stringify(tmpCacheData));
        } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE, JSON.stringify(tmpCacheData));
        }
      } else {
        if (examination_type == EXAMINATION_TYPE.EXAMINATION) {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT, JSON.stringify(tmp), 'insert');
        } else if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT, JSON.stringify(tmp), 'insert');
        } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT, JSON.stringify(tmp), 'insert');
        } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT, JSON.stringify(tmp), 'insert');
        }
      }
    } else {
      if (nType == 'change_department') {
        tmp.department_code = department_code;
      } else if(nType == 'change_karteStatus') {
        tmp.karte_status = department_code;
      }
      tmp.last_doctor_code = tmp.doctor_code;
      tmp.last_doctor_name = tmp.doctor_name;
      if (examination_type == EXAMINATION_TYPE.EXAMINATION) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT, JSON.stringify(tmp), 'insert');
      } else if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT, JSON.stringify(tmp), 'insert');
      } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT, JSON.stringify(tmp), 'insert');
      } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT, JSON.stringify(tmp), 'insert');
      }
    }
    if(!(nType == 'change_department' || nType == 'change_karteStatus')){
      let modalName = "検体検査";
      if (examination_type == 2) modalName = '細胞診検査';
      else if (examination_type == 3) modalName = '細菌・抗酸菌検査';
      else if (examination_type == 4) modalName = '病理組織検査';
      let menu_item = {
        ele:{examination_type: examination_type},
        name: modalName,
      };
      patientModalEvent.emit("clickOpenExaminationPopup", menu_item, tmp);
    }

    // for update (design)
    this.context.$setExaminationOrderFlag(1);
  };
  
  onDeleteExam = () => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let del_data = this.state.soapList[this.state.soapIndex];
    let doneCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
    if (del_data.sub_category == '細胞診検査') {
      doneCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE);
    } else if (del_data.sub_category == '病理検査') {
      doneCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE);
    } else if (del_data.sub_category == '細菌検査') {
      doneCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE);
    }
    if(doneCacheData != null) {
      let del_findIndex = doneCacheData.findIndex(x=>x.number == del_data.target_number);
      if (del_findIndex > -1) {
        window.sessionStorage.setItem("alert_messages", "実施中のデータなので削除できません。");
        return;
      }
    }
    let editCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT);
    if (del_data.sub_category == '細胞診検査') {
      editCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
    } else if (del_data.sub_category == '病理検査') {
      editCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
    } else if (del_data.sub_category == '細菌検査') {
      editCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
    }
    if (editCacheData != undefined && editCacheData != null && (editCacheData.number == del_data.target_number)) {
      window.sessionStorage.setItem("alert_messages", "編集中のデータなので削除できません。");
      return;
    }
    let cur_exam = {};
    let cur_soaplist = this.state.soapList;
    let soapList = Object.keys(cur_soaplist).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soaplist[ind].isDeleted = true;
        cur_soaplist[ind].doctor_code = cur_soaplist[ind].instruction_doctor_code;
        cur_exam = cur_soaplist[ind];
      }
      return cur_soaplist[ind];
    });
    let exam = cur_exam.data.order_data.order_data;
    exam.created_at = cur_exam.created_at;
    exam.state = cur_exam.data.state;
    exam.karte_number = cur_exam.number;
    exam.last_doctor_code = exam.doctor_code;
    exam.last_doctor_name = exam.doctor_name;
    if (del_data.sub_category == 'オーダー') {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_DELETE, new Date().getTime(), JSON.stringify(exam), "insert");
    } else if (del_data.sub_category == '細胞診検査') {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE, new Date().getTime(), JSON.stringify(exam), "insert");
    } else if (del_data.sub_category == '病理検査') {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE, new Date().getTime(), JSON.stringify(exam), "insert");
    } else if (del_data.sub_category == '細菌検査') {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE, new Date().getTime(), JSON.stringify(exam), "insert");
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }
  
  cancelDelExam = () => {
    let nCacheNumber = -1;
    let cur_soaplist = this.state.soapList;
    let soapList = Object.keys(cur_soaplist).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soaplist[ind].isDeleted = false;
        nCacheNumber = cur_soaplist[ind].number;
      }
      return cur_soaplist[ind];
    });
    let del_data = this.state.soapList[this.state.soapIndex];
    
    let cacheDelExamState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_DELETE);
    if (del_data.sub_category == '細胞診検査') {
      cacheDelExamState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE);
    } else if (del_data.sub_category == '病理検査') {
      cacheDelExamState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE);
    } else if (del_data.sub_category == '細菌検査') {
      cacheDelExamState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE);
    }
    if (!cacheDelExamState) {
      cacheDelExamState = [];
    }
    
    let delExamData = {};
    Object.keys(cacheDelExamState).map(key=>{
      if(cacheDelExamState[key]['karte_number'] != nCacheNumber){
        delExamData[key] = cacheDelExamState[key];
      }
    });
    
    if (Object.keys(delExamData).length > 0) {
      if (del_data.sub_category == 'オーダー') {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_DELETE, JSON.stringify(delExamData));
      } else if (del_data.sub_category == '細胞診検査') {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE, JSON.stringify(delExamData));
      } else if (del_data.sub_category == '病理検査') {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE, JSON.stringify(delExamData));
      } else if (del_data.sub_category == '細菌検査') {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE, JSON.stringify(delExamData));
      }
    }else{
      if (del_data.sub_category == 'オーダー') {
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_DELETE);
      } else if (del_data.sub_category == '細胞診検査') {
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE);
      } else if (del_data.sub_category == '病理検査') {
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE);
      } else if (del_data.sub_category == '細菌検査') {
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE);
      }
    }
    
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }
  
  onEditGuidance = (type="", department_id=null) => {
    let presData = this.state.soapList[this.state.soapIndex];
    let guidance = presData.data.order_data.order_data;
    guidance.created_at = presData.created_at;
    guidance.state = presData.data.state;
    guidance.isForUpdate = 1;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_EDIT);
    let isExist = false;
    let stampKey = new Date().getTime();
    if (cache_data != null && cache_data != undefined) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index].number == presData.data.number) {
          isExist = true;
          stampKey = index;
        }
      });
    }
    if(type === 'change_department'){
      guidance.department_id = department_id;
      guidance.department_code = department_id;
    }
    if(type === 'change_karteStatus'){
      guidance.karte_status = department_id;
    }
    if(isExist == false) {
      if(type === 'change_department' || type === 'change_karteStatus'){
        guidance.last_doctor_code = guidance.doctor_code;
        guidance.last_doctor_name = guidance.doctor_name;
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_EDIT, stampKey, JSON.stringify(guidance), 'insert');
      }
      this.context.$setExaminationOrderFlag(1);
    }
    if(!(type === 'change_department' || type === 'change_karteStatus')){
      this.props.showModal("edit_modal", "clickOpenGuidancePopup", stampKey, true, guidance);
    }
  }

  onDeleteGuidance = () => {
    let cur_guidance = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_guidance = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let guidance = cur_guidance.data.order_data.order_data;
    guidance.created_at = cur_guidance.created_at;
    guidance.state = cur_guidance.data.state;
    guidance.karte_number = cur_guidance.number;
    guidance.last_doctor_code = guidance.doctor_code;
    guidance.last_doctor_name = guidance.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_DELETE, new Date().getTime(), JSON.stringify(guidance), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  cancelDelGuidance = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });

    let { cacheDelGuidanceState } = persistedState(this.props.patientId);
    if (!cacheDelGuidanceState) {
      cacheDelGuidanceState = [];
    }
    let delGuidanceData = {};
    Object.keys(cacheDelGuidanceState).map(key=>{
      if(cacheDelGuidanceState[key]['karte_number'] != nCacheNumber){
        delGuidanceData[key] = cacheDelGuidanceState[key];
      }
    });

    if (Object.keys(delGuidanceData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_DELETE, JSON.stringify(delGuidanceData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onEditDocument = () => {
    let cur_document = this.state.soapList[this.state.soapIndex];
    let docuemnt_data = cur_document.data.order_data.order_data;
    docuemnt_data.created_at = cur_document.created_at;
    docuemnt_data.isForUpdate = 1;
    docuemnt_data.last_doctor_code = docuemnt_data.doctor_code;
    docuemnt_data.last_doctor_name = docuemnt_data.doctor_name;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_CREATE);
    let stampKey = new Date().getTime();
    if (cache_data != null && cache_data != undefined) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index].number == cur_document.data.number) {
          stampKey = index;
        }
      });
    }
    this.props.showModal("edit_modal", "clickOpenDocumentEdit", stampKey,true, JSON.parse(JSON.stringify(docuemnt_data)));
  }
  
  onDeleteDocument = () => {
    let cur_document = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_document = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    
    let document = cur_document.data.order_data.order_data;
    document.created_at = cur_document.created_at;
    document.state = cur_document.data.state;
    document.karte_number = cur_document.number;
    document.last_doctor_code = document.doctor_code;
    document.last_doctor_name = document.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_DELETE, new Date().getTime(), JSON.stringify(document), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }
  
  cancelDelDocument = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    
    let { cacheDelDocumentState } = persistedState(this.props.patientId);
    if (!cacheDelDocumentState) {
      cacheDelDocumentState = [];
    }
    let delDocumentData = {};
    Object.keys(cacheDelDocumentState).map(key=>{
      if(cacheDelDocumentState[key]['karte_number'] != nCacheNumber){
        delDocumentData[key] = cacheDelDocumentState[key];
      }
    });
    if (Object.keys(delDocumentData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_DELETE, JSON.stringify(delDocumentData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onDoneGuidance = (index) => {
    let modal_data = this.state.soapList[index];
    this.setState({
      soapIndex: index,
      done_modal_title: "汎用オーダー",
      done_modal_type: "guidance",
      done_modal_data: modal_data,
      isOpenDoneModal: true
    });
  }

  onEditRehabily = (type="", department_id=null) => {
    let presData = this.state.soapList[this.state.soapIndex];
    let rehabily = presData.data.order_data.order_data;
    rehabily.created_at = presData.created_at;
    rehabily.state = presData.data.state;
    rehabily.isForUpdate = 1;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT);
    let isExist = false;
    let stampKey = new Date().getTime();
    if (cache_data != null && cache_data != undefined) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index].number == presData.data.number) {
          isExist = true;
          stampKey = index;
        }
      });
    }
    if(type === 'change_department'){
      rehabily.department_id = department_id;
    }
    if(type==='change_karteStatus'){
      rehabily.karte_status = department_id;
    }

    if(isExist == false) {
      if(type === 'change_department' || type === 'change_karteStatus'){
        rehabily.last_doctor_code = rehabily.doctor_code;
        rehabily.last_doctor_name = rehabily.doctor_name;
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT, stampKey, JSON.stringify(rehabily), 'insert');
      }
      this.context.$setExaminationOrderFlag(1);
    }
    if(!(type === 'change_department' || type === 'change_karteStatus')){
      this.props.showModal("edit_modal", "clickOpenRehabilyPopup", stampKey, true,rehabily);
    }
  };
  
  // Rehabily
  onDeleteRehabily = () => {
    let cur_rehabily = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_rehabily = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let rehabily = cur_rehabily.data.order_data.order_data;
    rehabily.created_at = cur_rehabily.created_at;
    rehabily.done_order = cur_rehabily.data.done_order;
    rehabily.karte_number = cur_rehabily.number;
    rehabily.last_doctor_code = rehabily.doctor_code;
    rehabily.last_doctor_name = rehabily.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_DELETE, new Date().getTime(), JSON.stringify(rehabily), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  };
  
  cancelDelRehabily = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheDelRehabilyState } = persistedState(this.props.patientId);
    if (!cacheDelRehabilyState) {
      cacheDelRehabilyState = [];
    }
    let delRehabilyData = {};
    Object.keys(cacheDelRehabilyState).map(key=>{
      if(cacheDelRehabilyState[key]['karte_number'] != nCacheNumber){
        delRehabilyData[key] = cacheDelRehabilyState[key];
      }
    });
    if (Object.keys(delRehabilyData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_DELETE, JSON.stringify(delRehabilyData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  };

  onDoneRehabily = (index) => {
    let modal_data = this.state.soapList[index];
    this.setState({
      soapIndex: index,
      done_modal_title: "リハビリ",
      done_modal_type: "rehabily",
      done_modal_data: modal_data,
      isOpenRehabilyDoneModal: true
    });
  };

  onDoneRadiation = (index) =>{
    let modal_data = this.state.soapList[index];
    this.setState({
      soapIndex: index,
      done_modal_title: "放射線",
      done_modal_type: "radiation",
      done_modal_data: modal_data,
      isOpenRadiationModal: true
    });
  }

  addTag = (index) => {
    let modal_data = this.state.soapList[index];
    this.setState({
      isOpenAddTagModal: true,
      karte_tree_number: modal_data.number,
      sticky_data:null,
      sub_key:null,
    });
  };

  stopSoap() {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let cur_soap = {};
    let cur_soaplist = this.state.soapList;
    let soapList = Object.keys(cur_soaplist).map((ind) => {
      if (ind === this.state.soapIndex) {
        let actionFlag = false;
        if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.DELETE) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.DELETE_PROXY)){
          actionFlag = true;
        }
        if(!actionFlag){
          window.sessionStorage.setItem("alert_messages", "権限がありません。");
          return;
        }
        cur_soaplist[ind]['isDeleted'] = true;
        // cur_soaplist[ind]['doctor_name'] = this.context.selectedDoctor.name;
        // cur_soaplist[ind]['doctor_code'] = this.context.selectedDoctor.code;
        cur_soap = cur_soaplist[ind];
      }
      return cur_soaplist[ind];
    });

    let soap = cur_soap;
    soap.karte_number = cur_soap.number;
    soap.isDeleted = true;
    soap.last_doctor_name = cur_soap.doctor_name;
    soap.last_doctor_code = cur_soap.instruction_doctor_code;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_DELETE, new Date().getTime(), JSON.stringify(soap), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  applyCachePrescriptionOrder = (delDatas, mode="del", _history) => {
    var medicineHistory = _history;
    let stop_order;
    let delete_medicineHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    if (delete_medicineHistory === undefined || delete_medicineHistory == null) {
      delete_medicineHistory = [];
    }
    delDatas.map(delData => {
      stop_order= (delData.stop_order !== undefined && delData.stop_order == 1 && mode=="del") ? 1 : 0;
      let medicine = medicineHistory.data;
      medicine.karte_status = medicineHistory.karte_status;
      if(mode === "order_delete"){
        medicine.last_doctor_code = delData.last_doctor_code;
        medicine.last_doctor_name = delData.last_doctor_name;
      }
      if (medicine.number == delData.number) {
        if (delData.order_data !== undefined) {
          let order_data = [];
          medicine.order_data.order_data.map(med_order_data => {
            let deleted = false;
            delData.order_data.map(item => {
              if (item.order_number === med_order_data.order_number) {
                deleted = true;
              }
            });
            if (deleted || stop_order) {
              med_order_data.is_enabled = 2;
            }

            if(mode != "del" && med_order_data.is_enabled != undefined && !deleted) {
              delete med_order_data.is_enabled;
            }
            order_data.push(med_order_data);
          });
          medicine.order_data.order_data = order_data;
        } else {
          medicine.is_enabled = 3;
        }
        medicine.stop_order = stop_order;
        let del_index = delete_medicineHistory.findIndex(x=>x.number===medicine.number);
        if (del_index >= 0){                               // if exist equal item replace else push
          delete_medicineHistory[del_index] = medicine;
        } else {
          delete_medicineHistory.push(medicine);
        }
      }
    });    
    
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY, JSON.stringify(delete_medicineHistory));
    this.props.applyRightDeleteData();
  }

  applyCacheInjectionOrder = (delDatas, mode="del", _history) => {
    var injectionHistory = _history;
    let stop_order;
    let delete_injectionHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    if (delete_injectionHistory === undefined || delete_injectionHistory == null) {
      delete_injectionHistory = [];
    }
    delDatas.map(delData => {
      stop_order= (delData.stop_order !== undefined && delData.stop_order == 1 && mode=="del") ? 1 : 0;
      let inject = injectionHistory.data;
      inject.karte_status = injectionHistory.karte_status;
      if(mode === "order_delete"){
        inject.last_doctor_code = delData.last_doctor_code;
        inject.last_doctor_name = delData.last_doctor_name;
      }
      if (inject.number == delData.number) {
        if (delData.order_data !== undefined) {
          let order_data = [];
          inject.order_data.order_data.map(inject_order_data => {
            let deleted = false;
            delData.order_data.map(item => {
              if (item.order_number === inject_order_data.order_number) {
                deleted = true;
              }
            });
            if (deleted || stop_order) {
              inject_order_data.is_enabled = 2;
            }
            if(mode != "del" && inject_order_data.is_enabled != undefined && !deleted) {
              delete inject_order_data.is_enabled;
            }

            order_data.push(inject_order_data);
          });
          inject.order_data.order_data = order_data;
        } else {
          inject.is_enabled = 3;
        }
        inject.stop_order = stop_order;
        // if exist equal item replace else push
        let del_index = delete_injectionHistory.findIndex(x=>x.number===inject.number);
        if (del_index >= 0){
          delete_injectionHistory[del_index] = inject;
        } else {
          delete_injectionHistory.push(inject);
        }
      }
    });    
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY, JSON.stringify(delete_injectionHistory));
    this.props.applyRightDeleteData();
  }

  deletePrescriptionOrder = (prescription_data) => {
    let order_datas = prescription_data.data.order_data.order_data.map(data => {
      return {
        order_number: data.order_number, // ※該当する区切りのオーダー番号
        order_number_serial: data.order_number_serial
      };
    });
    const postData = [
      {
        number: prescription_data.target_number,
        delete_type: "soap",
        system_patient_id: this.props.patientId, //HARUKA患者番号
        insurance_type: 0, //保険情報現状固定
        body_part: "",
        order_data: order_datas,
        med_consult: 1, //お薬相談希望ありフラグ
        supply_med_info: 1, //薬剤情報提供ありフラグ
        psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
        poultice_many_reason: "", //向精神薬多剤投与理由
        free_comment: [], //備考
        department_code: 1,
        karte_status: prescription_data.karte_status
      }
    ];
    let { cacheDelState } = persistedState(this.props.patientId);
    if (!cacheDelState) {
      cacheDelState = [];
    }
    if (cacheDelState.length > 0) {
      cacheDelState = cacheDelState.filter(data => {
        return data.number !== prescription_data.target_number;
      });
    }
    cacheDelState.push(postData[0]);
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, JSON.stringify(cacheDelState));
    if(prescription_data.data.order_data.doctor_code != null){
      postData[0].last_doctor_code = prescription_data.data.order_data.doctor_code;
      if(prescription_data.data.order_data.doctor_name != null){
        postData[0].last_doctor_name = prescription_data.data.order_data.doctor_name;
      } else {
        postData[0].last_doctor_name = getDoctorName(prescription_data.data.order_data.doctor_code);
      }
    }
    this.applyCachePrescriptionOrder(postData, "order_delete", prescription_data);
  }

  deleteInjectionOrder = (prescription_data) => {
    let order_datas = prescription_data.data.order_data.order_data.map(data => {
      return {
        order_number: data.order_number, // ※該当する区切りのオーダー番号
        order_number_serial: data.order_number_serial
      };
    });
    const postData = [
      {
        number: prescription_data.target_number,
        delete_type: "soap",
        system_patient_id: this.props.patientId, //HARUKA患者番号
        order_data: order_datas,
        department_code: 1
      }
    ];
    let { cacheDelInjectState } = persistedState(this.props.patientId);
    if (!cacheDelInjectState) {
      cacheDelInjectState = [];
    }
    if (cacheDelInjectState.length > 0) {
      cacheDelInjectState = cacheDelInjectState.filter(data => {
        return data.number !== prescription_data.target_number;
      });
    }
    cacheDelInjectState.push(postData[0]);
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, JSON.stringify(cacheDelInjectState));
    if(prescription_data.data.order_data.doctor_code != null){
      postData[0].last_doctor_code = prescription_data.data.order_data.doctor_code;
      if(prescription_data.data.order_data.doctor_name != null){
        postData[0].last_doctor_name = prescription_data.data.order_data.doctor_name;
      } else {
        postData[0].last_doctor_name = getDoctorName(prescription_data.data.order_data.doctor_code);
      }
    }
    this.applyCacheInjectionOrder(postData, "order_delete", prescription_data);
  }

  stopOrders = () => {
    let cur_soaplist = this.state.soapList;
    let prescription_data = cur_soaplist[this.state.soapIndex];
    let soapList = Object.keys(cur_soaplist).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soaplist[ind].isDeleted = true;
        cur_soaplist[ind].doctor_code = cur_soaplist[ind].instruction_doctor_code;
      }
      return cur_soaplist[ind];
    });
    if (prescription_data.category === "処方") {
      this.deletePrescriptionOrder(prescription_data);
    } else if (prescription_data.category === "注射") {
      this.deleteInjectionOrder(prescription_data);
    }
    this.props.updateSoapList(soapList);
  };

  recoveryOrders = () => {
    let cur_soaplist = this.state.soapList;
    let prescription = cur_soaplist[this.state.soapIndex];
    let soapList = Object.keys(cur_soaplist).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soaplist[ind].isDeleted = false;
        cur_soaplist[ind].doctor_code = cur_soaplist[ind].instruction_doctor_code;
      }
      return cur_soaplist[ind];
    });
    if (prescription.category === "注射") {
      let {cacheDelInjectState} = persistedState(this.props.patientId);
      let cacheDelInjectHistoryState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
      if (!cacheDelInjectState) return;
      if (!cacheDelInjectHistoryState) return;
      cacheDelInjectState = cacheDelInjectState.filter(data => {
        // if (data.number != prescription.data.number && data.type != "soap" && data.system_patient_id != this.props.patientId) {
        if (data.number != prescription.data.number) {
          return data;
        }
      });
      if (cacheDelInjectState.length > 0) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, JSON.stringify(cacheDelInjectState));
      } else {
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
      }

      // delete INJECTION_DELETE_HISTORY
      cacheDelInjectHistoryState = cacheDelInjectHistoryState.filter(data => {
        return data.number !== prescription.data.number;
      });

      if (cacheDelInjectHistoryState.length > 0) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY, JSON.stringify(cacheDelInjectHistoryState));
      }else{
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
      }

      // update カルテ閉じる status
      this.context.$setExaminationOrderFlag(1);

    } else if (prescription.category === "処方") {
      let {cacheDelState} = persistedState(this.props.patientId);
      let cacheDelHistoryState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
      if (!cacheDelState) return;
      if (!cacheDelHistoryState) return;
      cacheDelState = cacheDelState.filter(data => {
        // if (data.number != prescription.data.number && data.type != "soap" && data.system_patient_id != this.props.patientId) {
        if (data.number != prescription.data.number) {
          return data;
        }
      });
      if (cacheDelState.length > 0) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, JSON.stringify(cacheDelState));
      } else {
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
      }

      // delete PRESCRIPTION_DELETE_HISTORY
      cacheDelHistoryState = cacheDelHistoryState.filter(data => {
        return data.number !== prescription.data.number;
      });

      if (cacheDelHistoryState.length > 0) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY, JSON.stringify(cacheDelHistoryState));
      }else{
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
      }

      // update カルテ閉じる status
      this.context.$setExaminationOrderFlag(1);
    }
    this.props.updateSoapList(soapList);
  };

  doneOrder = (nIndex) => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let cur_soaplist = this.state.soapList;
    let tmp = cur_soaplist[nIndex].data.order_data.order_data;
    tmp.is_completed = 1;
    tmp.is_done = 1;
    tmp.is_done_order = 1;
    tmp.openTag = 1;
    tmp.number = cur_soaplist[nIndex].data.number;
    tmp.created_at = cur_soaplist[nIndex].created_at;
    let examination_type = tmp.examination_type;
    
    let tmpCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
    if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
      tmpCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE);
    } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
      tmpCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE);
    } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
      tmpCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE);
    }
    if (tmpCacheData == null) {
      tmpCacheData = [];
    } else {
      // 実施同じレコードがあれば
      let findIndex = tmpCacheData.findIndex(x=>x.number == tmp.number);
      if (findIndex > -1) {
        window.sessionStorage.setItem("alert_messages", "既に");
        return;
      }
    }
    // 実施入力に同じレコードがあれば
    let editCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT);
    if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
      editCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
    } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
      editCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
    } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
      editCacheData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
    }
    if (editCacheData != undefined && editCacheData != null && editCacheData.number == tmp.number){
      window.sessionStorage.setItem("alert_messages", "編集中のデータなので実施できません。");
      return;
    }

    tmpCacheData.push(tmp);
    if (examination_type == EXAMINATION_TYPE.EXAMINATION) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_ORDER_DONE, JSON.stringify(tmpCacheData));
    } else if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE, JSON.stringify(tmpCacheData));
    } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE, JSON.stringify(tmpCacheData));
    } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE, JSON.stringify(tmpCacheData));
    }
    this.context.$setExaminationOrderFlag(1);
  };

  cancelDelSoap = (nSoapIndex) => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let nSoapNumber = -1;
    let cur_soaplist = this.state.soapList;
    let soapList = Object.keys(cur_soaplist).map((ind) => {
      if (ind === nSoapIndex) {
        let actionFlag = false;
        if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.DELETE) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.DELETE_PROXY)){
          actionFlag = true;
        }
        if(!actionFlag){
          window.sessionStorage.setItem("alert_messages", "権限がありません。");
          return;
        }
        cur_soaplist[ind].isDeleted = false;
        nSoapNumber = cur_soaplist[ind].number;
      }
      return cur_soaplist[ind];
    });

    let { cacheDelSoapState } = persistedState(this.props.patientId);
    if (!cacheDelSoapState) {
      cacheDelSoapState = [];
    }

    let delSoapData = {};
    Object.keys(cacheDelSoapState).map(key=>{
      if(cacheDelSoapState[key]['karte_number'] != nSoapNumber){
        delSoapData[key] = cacheDelSoapState[key];
      }
    });

    if (Object.keys(delSoapData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_DELETE, JSON.stringify(delSoapData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_DELETE);
    }

    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onEditMedicineGuidance = (type="", department_id=null) => {
    let presData = this.state.soapList[this.state.soapIndex];
    let guidance = presData.data.order_data.order_data;
    guidance.created_at = presData.created_at;
    guidance.state = presData.data.state;
    guidance.isForUpdate = 1;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT);
    let isExist = false;
    let stampKey = new Date().getTime();
    if (cache_data != null && cache_data != undefined) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index].number == presData.data.number) {
          isExist = true;
          stampKey = index;
        }
      });
    }
    if(type === 'change_department'){
      guidance.department_id = department_id;
      guidance.department_code = department_id;
    }

    if (isExist == false) {
      if (type == 'change_department')
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, stampKey, JSON.stringify(guidance), 'insert');
      this.context.$setExaminationOrderFlag(1);
    }
    if(type !== 'change_department'){
      this.props.showModal("edit_modal", "clickOpenMedicineGuidance", stampKey, true,guidance);
    }
  }

  handleClick(e, index, nType, isDeleted = false, is_enabled = 1, isStopped=false, other_value=null, rp_index=null, stop_injection_menu=0) {  //other_value:   ex)  inspection_id
    if(nType != "prescription" && nType != "injection" && nType != "treatment-order" && (is_enabled === 2 || is_enabled === 4)){
      return;
    }
    if(nType === "document-create" && isStopped === 1){return;}
    if (e.type === "contextmenu") {      
      this.injection_stop_register_cancel_menu = stop_injection_menu;
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("soap_list_wrapper")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("soap_list_wrapper")
            .removeEventListener(`scroll`, onScrollOutside);
        });

      let clientX = e.clientX;
      let clientY = e.clientY;
      this.props.closeRightClickMenu('middle');
      let soap_list_left = $('#soap_list_wrapper').offset().left;
      this.setState({
        contextMenu: {
          visible: true,
          x: clientX - soap_list_left,
          y: clientY + window.pageYOffset - 120,
          index: index,
          menuType: nType,
          isDeleted: isDeleted,
          isStopped,
          other_value,
          radiation_pacs_flag: this.radiation_pacs_flag
        },
        rp_index,
        stickyMenu:{visible:false},
        contextKarteDateMenu:{visible:false},
      }, ()=>{
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let soap_list_width = document.getElementsByClassName("soap_list_wrapper")[0].offsetWidth;
        let window_height = window.innerHeight - 182;
        if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > (soap_list_left + soap_list_width))) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - menu_width - soap_list_left,
              y: clientY - menu_height + window.pageYOffset - 120,
              index: index,
              menuType: nType,
              isDeleted: isDeleted,
              isStopped,
              other_value,
              radiation_pacs_flag: this.radiation_pacs_flag
            },
            rp_index,
          })
        } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < (soap_list_left + soap_list_width))) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - soap_list_left,
              y: clientY - menu_height + window.pageYOffset - 120,
              index: index,
              menuType: nType,
              isDeleted: isDeleted,
              isStopped,
              other_value,
              radiation_pacs_flag: this.radiation_pacs_flag
            },
            rp_index,
          })
        } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > (soap_list_left + soap_list_width))) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - menu_width - soap_list_left,
              y: clientY + window.pageYOffset - 120,
              index: index,
              menuType: nType,
              isDeleted: isDeleted,
              isStopped,
              other_value,
              radiation_pacs_flag: this.radiation_pacs_flag
            },
            rp_index,
          })
        }
      });
    }
  }

  formatDate = str => {
    return str.substr(0, 4) + "/" + str.substr(5, 2) + "/" + str.substr(8, 2);
  }

  getDepartment = id => {
    let departmentStr = "";
    this.departmentOptions.map(item => {
      if (parseInt(item.id) === parseInt(id)) {
        departmentStr = item.value;
      }
    });
    return departmentStr;
  }

  onInspectionClicked = data => {
    this.setState({
      inspectionModalContents : data,
      inspectionModal: true
    });
  }

  closeModal = () => {
    this.setState({
      inspectionModal: false,
      historyModal: false,
      historyGuidanceModal: false,
      historySoapModal: false,
      historyGuidanceNutritionRequestModal: false,
      historyDocumentModal: false,
      historyDeathRegisterModal: false,
      historyHospitalMoveModal: false,
      historyChangeResponsibilityModal: false,
      historyInHospitalModal: false,
      isOpenDischargeGuidanceReportHistory: false,
      historyHospitalDoneModal: false,
      historyDischargeModal: false,
      historyHospitalGoingModal: false,
      historyInspectionModal: false,
      historyAllergyModal: false,
      historyTreatmentModal: false,
      historyExaminationModal: false,
      historyRehabilyModal: false,
      isOpenDoneModal: false,
      isOpenTreatDoneModal: false,
      isOpenStopModal: false,
      isOpenPrescriptionDoneModal: false,
      isOpenPrescriptionIncreasePeriodModal: false,
      isOpenInjectionIncreasePeriodModal: false,
      isOpenTreatmentIncreasePeriodModal: false,
      isOpenExaminationIncreasePeriodModal: false,
      isOpenInspectionDoneModal: false,
      isOpenRehabilyDoneModal: false,
      isOpenGuidanceNutritionRequestDoneModal: false,
      isOpenexaminDoneModal: false,
      isOpenAddTagModal: false,
      isOpenInspectionImageModal: false,
      isOpenRadiationModal:false,
      openInputExamOrder: false,
      openExamOrderList:false,
      historyRadiationModal:false,
      istagListModal:false,
      isTagDetailModal:false,
      selectedOrderNumber: 0,
      alert_title: '',
      alert_messages: '',
      in_hospital_header_number: undefined,
      out_hospital_header_number: undefined,
      isOpenInspectionStartEndDateTimeRegister:false,
      isOpenEndoscopeReservationModal:false,
    });
  }

  closeMessageModal = (_msg='') => {
    this.closeModal();
    // prescription done
    if(_msg == "prescription_done") {
      this.setState({alert_messages: "実施しました。"});
    } else if(_msg == "stop_injection") {
      this.setState({alert_messages: "中止完了しました。"});
    }
  }

  onAngleClicked = (e, index) => {
    let obj = $(e.target);
    // 見出しの「nn版」の文字をクリックしたときに、内容の開閉が一緒に動いてしまう
    // →履歴を開く部分は、内容開閉操作のクリック判定が動かないように   2020-08-19
    if (obj.hasClass("version-span")) return;
    while(!obj.hasClass("data-title") && obj.get(0).nodeName.toLowerCase() != "body"){
      obj=obj.parent();
    }
    let next_obj = obj.next();
    let obj_item = $("div.data-item", obj);
    if(obj_item.hasClass("open")){
      obj_item.removeClass("open");
      next_obj.hide();
    } else {
      next_obj.show();
      obj_item.addClass("open");
    }
    let open_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MIDDLE_ORDER_OPEN);
    if(open_data != null && open_data !== undefined){
      if(open_data[index] !== undefined){
        open_data[index] = !open_data[index];
      } else {
        open_data[index] = false;
      }
    } else {
      open_data = {};
      open_data[index] = false;
    }
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.MIDDLE_ORDER_OPEN, JSON.stringify(open_data));
  }

  confirmOk() {
    switch(this.state.confirm_type){
      case "_edit":
        this.onEditSoap();
        break;
      case "_del":
        this.stopSoap();
        break;
      case "_cancelDel":
        this.cancelDelSoap(this.state.soapIndex);
        break;
      case "_examEdit":
        this.onEditExamOrder(this.state.soapIndex);
        break;
      case "_deleteExam":
        this.onDeleteExam();
        break;
      case "_cancelDelExam":
        this.cancelDelExam();
        break;
      case "_doneOrder":
        this.doneOrder(this.state.soapIndex);
        break;
      case "_doneAndOrderEdit":
        this.onEditExamOrder(this.state.soapIndex, "order_input");
        break;
      case "_editInspection":
        this.onEditInspection();
        break;
      case "_editGuidanceNutritionRequest":
        this.onEditGuidanceNutritionRequest();
        break;
      case "_deleteInspection":
        this.onDeleteInspection('delete');
        break;
      case "_cancelDelInspection":
        this.cancelDelInspection('delete');
        break;
      case "_stopInspectionOrder":
        this.onDeleteInspection('stop');
        break;
      case "_cancelStopInspection":
        this.cancelDelInspection('stop');
        break;
      case "_deleteTreatment":
        this.onDeleteTreatment();
        break;
      case "_deleteTreatmentPractice":
        this.onDeleteTreatmentPractice();
        break;
      case "_cancelDelTreatment":
        this.cancelDelTreatment();
        break;
      case "_cancelDelTreatmentPractice":
        this.cancelDelTreatmentPractice();
        break;
      case "_editTreatment":
        this.onEditTreatment();
        break;
      case "_doneInspectionOrder":
        this.onDoneInspection();
        break;
      case "_doneTreatmentOrder":
        this.onDoneTreatment();
        break;
      case "_editHospital":
        this.onEditHospital();
        break;
      case "_doPrescription":
        this.onDoPrescription();
        break;
      case "_doInjection":
        this.onDoInjection();
        break;
      case "_editPrescription":
        this.onEditPrescription();
        break;
      case "_increasePrescription":
        this.onIncreasePrescription(this.state.soapIndex);
        break;
      case "_increaseInjection":
        this.onIncreaseInjection(this.state.soapIndex);
        break;
      case "_editInjection":
        this.onEditInjection();
        break;
      case "_deleteHospital":
        this.onDeleteHospital();
        break;
      case "_deleteCancelHospital":
        this.cancelDelHospital();
        break;
      case "_editRadiationOrder":
        this.onEditRadiation();
        break;
      case "_deleteRadiationOrder":
        this.onDeleteRadiation();
        break;
      case "_deleteCancelRadiationOrder":
        this.cancelDelRadiation();
        break;
      case "_doneRadiationOrder":
        this.onDoneRadiation();
        break;
      case "_recoveryRp_prescription":
        this.onEditHospital();
        break;
      case "_recoveryAll_prescription":
        this.recoveryOrders();
        break;
      case "_delRp_prescription":
        this.onEditHospital();
        break;
      case "_delAll_prescription":
        this.stopOrders();
        break;
      case "_deleteGuidance":
        this.onDeleteGuidance();
        break;
      case "_cancelDelGuidance":
        this.cancelDelGuidance();
        break;
      case "_editGuidance":
        this.onEditGuidance();
        break;
      case "_doneGuidanceOrder":
        this.onDoneGuidance();
        break;
      case "_editRehabily":
        this.onEditRehabily();
        break;
      case "_deleteRehabily":
        this.onDeleteRehabily();
        break;
      case "_cancelDelRehabily":
        this.cancelDelRehabily();
        break;
      case "_doneRehabilyOrder":
        this.onDoneRehabily();
        break;
      case "_editStickyData":
        this.editStickyData();
        break;
      case "_deleteStickyData":
        this.deleteStickyData();
        break;
      case "_seal_print":
        this.sealPrinter();
        break;
      case "_importance_level":
        this.setImportanceLevel(this.state.soapIndex);
        break;
      case "_doneExamResult":
        this.doneExamResult(this.state.soapIndex);
        break;
      case "_reportExamResult":
        this.reportExamResult(this.state.soapIndex);
        break;
      case "_deleteChangeResponsibility":
        this.onDeleteChangeResponsibility();
        break;
      case "_deleteCancelChangeResponsibility":
        this.deleteCancelChangeResponsibility();
        break;
      case "_deleteHospitalMoveBed":
        this.onDeleteHospitalMoveBed();
        break;
      case "_deleteCancelHospitalMoveBed":
        this.deleteCancelHospitalMoveBed();
        break;
      case "_editMedicineGuidance":
        this.onEditMedicineGuidance();
        break;
      case "_editDocument":
        this.onEditDocument();
        break;
      case "_deleteDocument":
        this.onDeleteDocument();
        break;
      case "_deleteCancelDocument":
        this.cancelDelDocument();
        break;
      case "_eidtHospitalIn":
        this.onEditHospitalIn();
        break;
      case "_deleteHospitalIn":
        this.onDeleteHospitalIn();
        break;
      case "_deleteCancelHospitalIn":
        this.deleteCancelHospitalIn();
        break;
      case "_deleteHospitalDone":
        this.onDeleteHospitalDone();
        break;
      case "_deleteCancelHospitalDone":
        this.deleteCancelHospitalDone();
        break;
      case "_deleteDischargePermit":
        this.onDeleteDischargeOrder('discharge-permit');
        break;
      case "_deleteDischargeDecision":
        this.onDeleteDischargeOrder('discharge-decision');
        break;
      case "_deleteDischargeDone":
        this.onDeleteDischargeOrder('discharge-done');
        break;
      case "_deleteCancelDischarge":
        this.deleteCancelDischargeOrder();
        break;
      case "_deleteHospitalGoingOut":
        this.onDeleteHospitalGoing('going-out');
        break;
      case "_deleteHospitalGoingIn":
        this.onDeleteHospitalGoing('going-in');
        break;
      case "_deleteCancelHospitalGoing":
        this.deleteCancelHospitalGoing();
        break;
      case "_deleteDeathRegister":
        this.onDeleteDeathRegister();
        break;
      case "_deleteCancelDeathRegister":
        this.deleteCancelDeathRegister();
        break;
      case "_injectionStopCancel":
        this.onStopInjectionCancel();
        break;
      case "_increaseTreatment":
        this.onIncreaseTreatment(this.state.soapIndex);
        break;
      case "_increaseExamination":
        this.onIncreaseExamination(this.state.soapIndex);
        break;
    }
    this.confirmCancel();
  }

  confirmCancel=()=> {
    this.setState({
      confirm_message: "",
      confirm_type: "",
      confirm_title: "",
      soapIndex: 0,
    });
  }

  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };

  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo && this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }

    if (insurance == undefined || insurance == null || insurance == "") {
      insurance = "既定";
    }

    return insurance;
  };

  // getCheckSameOptions = (med, order_meds, option) => {
  //   let keys = Object.keys(med);
  //   let equalKeys = [];
  //   const allEqual = arr => arr.every(v => v === arr[0]);
  //   keys.map(key => {
  //     let value = [];
  //     order_meds.map(medi => {
  //       value.push(medi[key]);
  //     });
  //     if (allEqual(value)) {
  //       equalKeys.push(key);
  //     }
  //   });
  //   return equalKeys.indexOf(option);
  // };

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }

  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1, soap_category=null) => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }
    if (nDoctorConsented == 4) {
      return "";
    }
    if (nDoctorConsented == 2) {
      strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)}`;
      // ●YJ1100 カルテ(SOAP)中央カラムと処方歴・注射履歴も、記載と最終変更日時のフォーマットは秒までにする
      if (soap_category === '注射' || soap_category === '処方') {
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)}(${this.getWeekDay(strDateTime.substr(0,10))}) ${strDateTime.substr(11, 8)}`;        
      }
      return strHistory;
    }else{
      if(nDoctorConsented == -1){return nHistoryLength+'版';}
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      }else{
        strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)} 入力者 : ${strStuffName}`;
        // ●YJ1100 カルテ(SOAP)中央カラムと処方歴・注射履歴も、記載と最終変更日時のフォーマットは秒までにする
        if (soap_category === '注射' || soap_category === '処方') {
          strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)} 入力者 : ${strStuffName}`;
        }
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
  }

  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    if(nDoctorConsented == -1){return '';}
    if (nDoctorConsented == 4) {
      return `（過去データ取り込み）${strDoctorName}`;
    }
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else{
      if (nDoctorConsented == 1) {
        return `[承認済み] 依頼医: ${strDoctorName}`;
      }else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }

  // ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
  getVisitPlaceName = (place_id) => {
    if (this.visitPlaceMaster == undefined || this.visitPlaceMaster == null || this.visitPlaceMaster.length == 0) {
      result = "※削除済施設(ID:" + place_id + ")";
      return;
    }
    let place_item = this.visitPlaceMaster.find(x=>x.visit_place_id == place_id);
    let result = "";
    if (place_item == undefined || place_item == null || place_item.name == "") {
      result = "※削除済施設(ID:" + place_id + ")";
    } else {
      result = "施設名：" + place_item.name;
    }
    return result;
  }

  openInspectionImageModal = async (number, type=null) => {
    let path = "/app/api/v2/order/inspection/getImage";

    if (type == "radiation") {
      path = "/app/api/v2/order/radiation/getImage";
    } else if (type == "examination") {
      path = "/app/api/v2/order/examination/getImage";
    }

    const { data } = await axios.post(path, {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  openModal = (number, category) => {
    this.setState({
      historyModal: true,
      soap_category: category,
      selectedOrderNumber: number
    });
  };

  openHistoryModal = (number, arrHistoryNumber, category, sub_category) => {
    switch(category){
      case '汎用オーダー':
        this.openGuidanceModal(number, arrHistoryNumber);
        return;
      case '管理・指導':
        this.openGuidanceModal(number, arrHistoryNumber);
        return;
      case 'リハビリ':
        this.openRehabilyHistoryModal(number, arrHistoryNumber);
        return;
      case '放射線':
        this.openRadiationHistoryModal(number, arrHistoryNumber);
        return;
      case '文書':
        this.openDocumentHistoryModal(number, arrHistoryNumber);
        return;
    }
    switch(sub_category){
      case 'オーダー':
      case '細胞診検査':
      case '病理検査':
      case '細菌検査':
        this.openExaminationHistoryModal(number, arrHistoryNumber);
        return;
      case '転棟・転室実施':
        this.openHospitalMoveHistoryModal(number, arrHistoryNumber);
        return;
      case '担当変更オーダ':
        this.openChangeResponsibilityHistoryModal(number, arrHistoryNumber);
        return;
      case '入院申込オーダ':
      case '入院決定オーダ':
        this.openInHospitalHistoryModal(number, arrHistoryNumber);
        return;
      case '入院実施':
        this.openHospitalDoneHistoryModal(number, arrHistoryNumber);
        return;
      case '退院許可':
      case '退院決定':
      case '退院実施':
        this.openDischargeHistoryModal(number, arrHistoryNumber, sub_category);
        return;
      case '外泊実施':
      case '帰院実施':
        this.openHospitalGoingHistoryModal(number, arrHistoryNumber, sub_category);
        return;
      case '退院時指導レポート':
        this.openDischargeGuidanceReportHistoryModal(number, arrHistoryNumber);
        return;
    }
  }

  openGuidanceModal = (number, arrHistoryNumber) => {
    this.getHistoryGuidance({
      number: number,
      id: this.props.patientId,
      arrNumbers: arrHistoryNumber
    });
  };

  openTreatmentHistoryModal(number, arrHistoryNumber){
    this.getHistoryTreatment({
      number: number,
      id: this.props.patientId,
      arrNumbers: arrHistoryNumber
    });
  }

  getHistoryTreatment = async (params) => {
    const { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        patient_id: params.id,
        type: "treatment",
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyTreatmentModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };

  getHistoryGuidance = async (params) => {
    const { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        patient_id: params.id,
        type: "guidance",
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyGuidanceModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };

  openExaminationHistoryModal(number, arrHistoryNumber){
    this.getHistoryExamination({
      number: number,
      id: this.props.patientId,
      arrNumbers: arrHistoryNumber
    });
  }

  getHistoryExamination = async (params) => {
    const { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        patient_id: params.id,
        type: "examination",
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyExaminationModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };

  openRehabilyHistoryModal(number, arrHistoryNumber){
    this.getHistoryRehabily({
      number: number,
      id: this.props.patientId,
      arrNumbers: arrHistoryNumber
    });
  }

  getHistoryRehabily = async (params) => {
    const { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        patient_id: params.id,
        type: "rehabily",
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var nLength = resultData.length - 1;
    var result = [];
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyRehabilyModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };

  openRadiationHistoryModal(number, arrHistoryNumber){
    this.getHistoryRadiation({
      number: number,
      id: this.props.patientId,
      arrNumbers: arrHistoryNumber
    });
  }

  getHistoryRadiation = async(params) =>{
    const { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        patient_id: params.id,
        type: "radiation",
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyRadiationModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  }

  openInspectionHistoryModal(number, arrHistoryNumber){
    this.getHistoryInspection({
      number: number,
      id: this.props.patientId,
      arrNumbers: arrHistoryNumber
    });
  }

  getHistoryInspection = async (params) => {
    const { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        patient_id: params.id,
        limit: 1000,
        offset: 0,
        type: "inspection",
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyInspectionModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };

  openGuidanceNutritionRequestHistoryModal(number, arrHistoryNumber){
    this.getHistoryGuidanceNutritionRequest({
      number: number,
      id: this.props.patientId,
      arrNumbers: arrHistoryNumber
    });
  }

  openDocumentHistoryModal=async(number, arrHistoryNumber)=>{
    let { data } = await axios.post("/app/api/v2/document/find_history", {
      params: {
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyDocumentModal: true,
      selectedOrderNumber: number,
      historySoapList: result
    });
  }

  openHospitalMoveHistoryModal=async(number, arrHistoryNumber)=>{
    let { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        type:'hospital',
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyHospitalMoveModal: true,
      selectedOrderNumber: number,
      historySoapList: result
    });
  }

  openDeathRegisterHistoryModal=async(number, arrHistoryNumber)=>{
    let { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        type:'death_register',
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyDeathRegisterModal: true,
      selectedOrderNumber: number,
      historySoapList: result
    });
  }

  openChangeResponsibilityHistoryModal=async(number, arrHistoryNumber)=>{
    let { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        type:'hospital',
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyChangeResponsibilityModal: true,
      selectedOrderNumber: number,
      historySoapList: result
    });
  }

  openInHospitalHistoryModal=async(number, arrHistoryNumber)=>{
    let { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        type:'hospital',
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyInHospitalModal: true,
      selectedOrderNumber: number,
      historySoapList: result
    });
  }
  
  openDischargeGuidanceReportHistoryModal=async(number, arrHistoryNumber)=>{
    let { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        type:'hospital',
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      isOpenDischargeGuidanceReportHistory: true,
      selectedOrderNumber: number,
      historySoapList: result
    });
  }

  openHospitalDoneHistoryModal=async(number, arrHistoryNumber)=>{
    let { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        type:'hospital',
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyHospitalDoneModal: true,
      selectedOrderNumber: number,
      historySoapList: result
    });
  }

  openDischargeHistoryModal=async(number, arrHistoryNumber, sub_category)=>{
    let { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        type:'hospital',
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyDischargeModal: true,
      selectedOrderNumber: number,
      historySoapList: result,
      modal_title:sub_category
    });
  }

  openHospitalGoingHistoryModal=async(number, arrHistoryNumber, sub_category)=>{
    let { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        type:'hospital',
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0,
        numbers: arrHistoryNumber,
      }
    });
    let resultData = Object.keys(data).map(i=>data[i]);
    let result = [];
    let nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyHospitalGoingModal: true,
      selectedOrderNumber: number,
      historySoapList: result,
      modal_title:sub_category
    });
  }

  getHistoryGuidanceNutritionRequest = async (params) => {
    const { data } = await axios.post("/app/api/v2/nutrition_guidance/find_history", {
      params: {
        patient_id: params.id,
        limit: 1000,
        offset: 0,
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyGuidanceNutritionRequestModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };

  openSoapHistoryModal(number, arrHistoryNumber, sub_category){
    this.getHistorySoap({
      number: number,
      id: this.props.patientId,
      sub_category,
      arrNumbers: arrHistoryNumber
    });
  }

  getHistorySoap = async (params) => {
    const { data } = await axios.get("/app/api/v2/soap/find", {
      params: {
        patient_id: params.id,
        limit: 1000,
        offset: 0,
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      soap_sub_category:params.sub_category,
      historySoapModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };

  openAllergyHistoryModal(number, arrHistoryNumber){
    this.getHistoryAllergy({
      number: number,
      id: this.props.patientId,
      arrNumbers: arrHistoryNumber
    });
  }

  getHistoryAllergy = async (params) => {
    const { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        patient_id: params.id,
        limit: 1000,
        offset: 0,
        type: "allergy",
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyAllergyModal: true,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };

  getPresAndInjectClassFromCache = (currentSoap) => {
    let { cacheDelSoapState, cacheDelState, cacheDelInjectState } = persistedState(this.props.patientId);
    let nExist = false;
    if (cacheDelSoapState && cacheDelSoapState.length > 0) {
      cacheDelSoapState.map(item=>{
        if (item.number == currentSoap.data.number) {
          nExist = true;
        }
      });
    }
    if (cacheDelState && cacheDelState.length > 0) {
      cacheDelState.map(item=>{
        if (item.number == currentSoap.data.number) {
          nExist = true;
        }
      });
    }
    if (cacheDelInjectState && cacheDelInjectState.length > 0) {
      cacheDelInjectState.map(item=>{
        if (item.number == currentSoap.data.number) {
          nExist = true;
        }
      });
    }
    if (nExist == true) {
      return "deleted";
    } else {
      return "";
    }
  }

  stickyMenuAction =(act)=>{
    if (act === "tag_edit") {
      this.setState({
        confirm_message: "付箋を編集しますか？",
        confirm_type: "_editStickyData",
      });
    } else if (act === "tag_delete") {
      this.setState({
        confirm_message: "付箋を削除しますか？",
        confirm_type: "_deleteStickyData",
      });
    } else if (act === "view_tag_list") {
      this.getStickyNoteType();
    } else if (act === "register_soap") {
      let soap_list_length = Object.keys(this.state.soapList).length;
      let created_at = this.state.soapList[Object.keys(this.state.soapList)[soap_list_length - 1]]['treatment_datetime'];
      let presData = {
        soap_start_at:created_at.split(' ')[0],
        sharp_text: '',
        s_text: '',
        o_text: '',
        a_text: '',
        p_text: '',
        importance: 1,
        number: -1,
        updateDate:created_at,
        created_at,
      };
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("soap"));
      this.props.updateSoap(presData, null);
    }
  }

  getStickyNoteType =async()=>{
    let path = "/app/api/v2/master/tag";
    let post_data = {
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          this.setState({
            istagListModal: true,
            sticky_note_types: res.sticky_note_type,
          });
        }
      })
      .catch(() => {
      });
  }

  editStickyData =()=>{
    this.setState({
      isOpenAddTagModal: true,
      karte_tree_number: this.state.soap_number,
      sticky_data:this.state.allTags[this.state.soap_number][this.state.sub_key],
      sub_key:this.state.sub_key,
    });
  }

  deleteStickyData =async()=>{
    let path = "/app/api/v2/order/tag/delete";
    let post_data = {
      number:this.state.sub_key,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then(() => {
        this.props.setTagData('delete', this.state.soap_number, this.state.sub_key);
      })
      .catch(() => {

      });
  }

  sealPrinter =async()=>{
    let printData = this.state.soapList[this.state.soapIndex];
    let path = "/app/api/v2/print_haruka/seal_printer";
    if(printData['category'] === '処方' || printData['category'] === '注射'){
      path = "/app/api/v2/order/prescription/print";
    }
    apiClient
      .post(path, {
        karte_number:printData.number,
        number: printData.target_number,
        target_table: printData.target_table,
        karte_status: printData.karte_status,
      })
      .then((res) => {
        this.setState({alert_messages: res.alert_message});
      })
      .catch(() => {
      });
  }

  openTagDetailModal = (soap_number, key) => {
    let allTags_array = this.state.allTags;
    if (allTags_array !== undefined && allTags_array != null && allTags_array[soap_number] !== undefined && allTags_array[soap_number] != null ){
      if (allTags_array[soap_number][key] !== undefined && allTags_array[soap_number] != null) {
        this.setState({
          isTagDetailModal: true,
          sticky_note_data: allTags_array[soap_number][key]
        });
      }
    }
  }

  editStickyMenu = async(e, soap_number, sub_key) => {
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (e.type === "contextmenu") {
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ stickyMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          stickyMenu: {
            visible: false,
          }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("soap_list_wrapper")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            stickyMenu: {
              visible: false,
            }
          });
          document
            .getElementById("soap_list_wrapper")
            .removeEventListener(`scroll`, onScrollOutside);
        });

      let clientX = e.clientX;
      let clientY = e.clientY;
      this.props.closeRightClickMenu('middle');
      let soap_list_left = $('#soap_list_wrapper').offset().left;
      this.setState({
        stickyMenu: {
          visible: true,
          x: clientX - soap_list_left,
          y: clientY + window.pageYOffset - 120,
        },
        soap_number,
        sub_key,
        contextMenu:{visible:false},
        contextKarteDateMenu:{visible:false},
      }, ()=>{
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight - 182;
        let soap_list_width = document.getElementsByClassName("soap_list_wrapper")[0].offsetWidth;
        if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > (soap_list_width + soap_list_left))) {
          this.setState({
            stickyMenu: {
              visible: true,
              x: clientX - menu_width -soap_list_left,
              y: clientY - menu_height + window.pageYOffset - 120,
            },
          })
        } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < (soap_list_width + soap_list_left))) {
          this.setState({
            stickyMenu: {
              visible: true,
              x: clientX - soap_list_left,
              y: clientY - menu_height + window.pageYOffset - 120,
            },
          })
        } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > (soap_list_width + soap_list_left))) {
          this.setState({
            stickyMenu: {
              visible: true,
              x: clientX - menu_width - soap_list_left,
              y: clientY + window.pageYOffset - 120,
            },
          })
        }
      });
    }
  };

  setTagData =(karte_tree_number, data, sub_key)=>{
    this.closeModal();
    this.props.setTagData('add', karte_tree_number, data, sub_key);
  }

  setImportanceLevel =async(soapIndex)=>{
    let data = this.state.soapList[soapIndex];
    let path = "/app/api/v2/karte/importance_level/set";
    apiClient
      .post(path, {
        number: data.number,
        importance_level: this.state.importance_level,
        patient_name: this.props.patientInfo.name,
      })
      .then(() => {
        this.props.setImportance(soapIndex, this.state.importance_level);
      })
      .catch(() => {
      });
  }

  onDragStartSoapEvent = (e, soap_index, other_value="") => { //other_value exe)#/S/O/A/P
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ || soap_index == null) {
      e.stopPropagation();
      return;
    }
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    // get clipboard data
    let before_data = "";
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    }
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({alertMessage: "death"});
      return;
    }
    e.dataTransfer.setData("text", soap_index.toString()+":"+other_value);
    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    }
    e.stopPropagation();
  }

  getStatusShowDelete=(order_type, is_enabled)=>{
    if(is_enabled !== 2){return true;}
    let feature_type = '';
    switch(order_type){
      case "soap":
        feature_type = this.context.FEATURES.SOAP;
        break;
      case "exam-order":
      case "inspection-order":
        feature_type = this.context.FEATURES.EXAMORDER;
        break;
      case "endoscope-order":
        feature_type = this.context.FEATURES.ENDOSCOPEORDER;
        break;
      case "treatment-order":
        feature_type = this.context.FEATURES.TREATORDER;
        break;
      case "guidance-order":
        feature_type = this.context.FEATURES.GUIDANCEORDER;
        break;
      case "radiation-order":
        feature_type = this.context.FEATURES.RADIATION;
        break;
      case "rehabily-order":
        feature_type = this.context.FEATURES.REHABILY;
        break;
      case "prescription":
      case "injection":
        feature_type = this.context.FEATURES.PRESCRIPTION;
        break;
    }
    return this.context.$canDoAction(feature_type, this.context.AUTHS.SHOW_DELETE);
  }

  allSoapDataOpen=(value)=>{
    let middle_obj = $("#soap_content_wrapper");
    $(".data-title", middle_obj).each(function(){
      let obj = $(this);
      let next_obj = obj.next();
      let obj_item = $("div.data-item", obj);
      if(value){
        next_obj.show();
        obj_item.addClass("open");
      } else {
        obj_item.removeClass("open");
        next_obj.hide();
      }
    });

    let soapList = this.state.soapList;
    let open_data = {};
    Object.keys(soapList).map(ind=>{
      open_data[ind] = value;
    });
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.MIDDLE_ORDER_OPEN, JSON.stringify(open_data));
  }

  doubleClick(e, index, nType, isDeleted = false, is_enabled = 1) {
    if(is_enabled === 2 || isDeleted){
      return;
    }
    const { $canDoAction, FEATURES, AUTHS, karteMode } = this.context;
    if (karteMode == KARTEMODE.READ) return false;
    let feature_type = FEATURES.SOAP;

    let diagnosing_date = "";
    let {soapList} = this.props;
    Object.keys(soapList).map((ind)=>{
      if (ind == index) {
        diagnosing_date = soapList[ind].updated_at;
        return;
      }
    });
    let curDate = new Date(getCurrentDate('-'));
    let start_date = new Date(diagnosing_date.substring(0,10));

    switch(nType){
      case "soap":
        feature_type = FEATURES.SOAP;
        break;
      case "exam-order":
      case "inspection-order":
        feature_type = FEATURES.EXAMORDER;
        break;
      case "endoscope-order":
        feature_type = FEATURES.ENDOSCOPEORDER;
        break;
      case "treatment-order":
        feature_type = FEATURES.TREATORDER;
        break;
      case "guidance-order":
        feature_type = FEATURES.GUIDANCEORDER;
        break;
      case "home-order":
        feature_type = FEATURES.GUIDANCEORDER;
        break;
      case "spirit-order":
        feature_type = FEATURES.SPIRITORDER;
        break;
      case "radiation-order":
        feature_type = FEATURES.RADIATION;
        break;
      case "rehabily-order":
        feature_type = FEATURES.REHABILY;
        break;
      case "prescription":
        feature_type = FEATURES.PRESCRIPTION;
        break;
      case "injection":
        feature_type = FEATURES.PRESCRIPTION;
        break;
    }

    // check edit
    let canEdit = false;
    if (start_date >= curDate) {
      if ($canDoAction(feature_type, AUTHS.EDIT) || $canDoAction(feature_type, AUTHS.EDIT_PROXY)) {
        canEdit = true;
      }
    } else {
      if ($canDoAction(feature_type, AUTHS.EDIT_OLD) || $canDoAction(feature_type, AUTHS.EDIT_PROXY_OLD)) {
        canEdit = true;
      }
    }
    if(nType == "hospital") canEdit = true;
    if (canEdit === false) return;
    switch(nType){
      case "soap":
        this.contextMenuAction("doUpdate", index);
        break;
      case "exam-order":
        this.contextMenuAction("editExamOrder", index);
        break;
      case "inspection-order":
        this.contextMenuAction("editInspectionOrder", index);
        break;
      case "treatment-order":
        this.contextMenuAction("editTreatmentOrder", index);
        break;
      case "guidance-order":
        this.contextMenuAction("editGuidanceOrder", index);
        break;
      case "radiation-order":
        this.contextMenuAction("editRadiationOrder", index);
        break;
      case "rehabily-order":
        this.contextMenuAction("editRehabilyOrder", index);
        break;
      case "prescription":
        this.contextMenuAction("edit_prescription", index);
        break;
      case "injection":
        this.contextMenuAction("edit_injection", index);
        break;
      case "hospital":
        this.contextMenuAction("editHospitalOrder", index);
        break;
      case "medicine-guidance-order":
        this.contextMenuAction("editMedicineGuidanceOrder", index);
        break;
    }
  }

  changeDepartment = (act, index) => {
    let types = act.split("_");
    let key = types[1];
    let soap_data = this.state.soapList[index];
    this.setState({
      changeDepartmentModal: true,
      soapIndex: index,
      soapType: key,
      departmentDate: soap_data.updated_at,
      departmentNumber: soap_data.number,
      departmentCode: soap_data.medical_department_code,
      departmentName: soap_data.medical_department_name
    });
  }

  changeKarteStatus = (act, index) => {
    let types = act.split("_");
    let key = types[1];
    let soap_data = this.state.soapList[index];
    this.setState({
      changeKarteStatusModal: true,
      soapIndex: index,
      soapType: key,
      // departmentDate: soap_data.updated_at,
      // departmentNumber: soap_data.number,
      karteStatusCode: soap_data.karte_status,
      // karteStatusName: soap_data.karte_status_name,      
    });
  }

  handleClose = () => {
    this.setState({
      changeDepartmentModal: false,
      changeKarteStatusModal: false
    });
  }

  handleChangeDeparment = (code) => {
    switch(this.state.soapType){
      case "examination":
        this.onEditExamOrder(this.state.soapIndex, 'change_department', code);
        break;
      case "inspection":
        this.onEditInspection('change_department', code);
        break;
      case "treatment":
        this.onEditTreatment('change_department', code);
        break;
      case "hospital":
        this.onEditHospital('change_department', code);
        break;
      case "radiation":
        this.onEditRadiation('change_department', code);
        break;
      case "guidance":
        this.onEditGuidance('change_department', code);
        break;
      case "rehabily":
        this.onEditRehabily('change_department', code);
        break;
      case "soap":
        this.onEditSoap('change_department', code);
        break;
      case "prescription":
        this.onEditPrescription('change_department', code);
        break;
      case "injection":
        this.onEditInjection('change_department', code);
        break;
    }
    this.handleClose();
  };

  handleChangeKarteStatus = (code) => {
    switch(this.state.soapType){
      case "examination":
        this.onEditExamOrder(this.state.soapIndex, 'change_karteStatus', code);
        break;
      case "inspection":
        this.onEditInspection('change_karteStatus', code);
        break;
      case "treatment":
        this.onEditTreatment('change_karteStatus', code);
        break;
      case "hospital":
        this.onEditHospital('change_karteStatus', code);
        break;
      case "radiation":
        this.onEditRadiation('change_karteStatus', code);
        break;
      case "guidance":
        this.onEditGuidance('change_karteStatus', code);
        break;
      case "rehabily":
        this.onEditRehabily('change_karteStatus', code);
        break;
      case "soap":
        this.onEditSoap('change_karteStatus', code);
        break;
      case "prescription":
        this.onEditPrescription('change_karteStatus', code);
        break;
      case "injection":
        this.onEditInjection('change_karteStatus', code);
        break;
    }
    this.handleClose();
  };

  getStatusCanRegister=(order_type, deleted, other_value=null)=>{
    if(deleted){ //Doできるようにする
      // return false;
    }
    if(this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) return false;
    if(order_type=="hospital") return true;
    if(order_type == "soap" && other_value != null){
      let SoapCategory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY);
      SoapCategory = (SoapCategory != undefined && SoapCategory != null) ? SoapCategory : 'soap';
      if(SoapCategory != other_value){
        return false;
      }
    }
    let feature_type = '';
    switch(order_type){
      case "soap":
        feature_type = this.context.FEATURES.SOAP;
        break;
      case "exam-order":
      case "inspection-order":
        feature_type = this.context.FEATURES.EXAMORDER;
        break;
      case "endoscope-order":
        feature_type = this.context.FEATURES.ENDOSCOPEORDER;
        break;
      case "treatment-order":
        feature_type = this.context.FEATURES.TREATORDER;
        break;
      case "guidance-order":
        feature_type = this.context.FEATURES.GUIDANCEORDER;
        break;
      case "radiation-order":
        feature_type = this.context.FEATURES.RADIATION;
        break;
      case "rehabily-order":
        feature_type = this.context.FEATURES.REHABILY;
        break;
      case "prescription":
      case "injection":
        feature_type = this.context.FEATURES.PRESCRIPTION;
        break;
    }
    return (this.context.$canDoAction(feature_type, this.context.AUTHS.REGISTER) || this.context.$canDoAction(feature_type, this.context.AUTHS.REGISTER_PROXY));
  }

  setAllKarteData=(soapTrees, allDateList, allTags, soapList)=>{
    this.setState({
      soapTrees,
      allDateList,
      allTags,
      soapList,
    });
    this.stopGetHistory = false;
  }

  setChangeSoapData=(selYear, selMonth, selDay, soapTrees, soapList, allDateList, categoryType, show_list_condition)=>{
    this.setState({
      selYear,
      selMonth,
      selDay,
      soapTrees,
      soapList,
      allDateList,
      categoryType,
      show_list_condition
    });
    this.stopGetHistory = false;
  }

  setSoapListData=(soapList)=>{
    this.setState({soapList});
  }

  setAllTagsData=(allTags)=>{
    this.setState({allTags});
  }

  doneExamResult =async(soapIndex)=>{
    let data = this.state.soapList[soapIndex];
    let path = "/app/api/v2/karte/inspection/results/done_order";
    let post_data = {number: data.number, system_patient_id: this.props.patientId};
    apiClient.post(path, post_data).then(() => {
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      window.sessionStorage.setItem("alert_messages", "実施しました。");
      // let cur_soapList = this.state.soapList;
      // let soapList = Object.keys(cur_soapList).map((ind) => {
      //     if (ind === this.state.soapIndex) {
      //         cur_soapList[ind].data.done_order = 1;
      //     }
      //     return cur_soapList[ind];
      // });
      // this.props.updateSoapList(soapList);
      this.props.goToDropPage(`/patients/${this.props.patientId}/soap`);

    });
  };

  reportExamResult =async(soapIndex)=>{
    let data = this.state.soapList[soapIndex];
    let path = "/app/api/v2/karte/inspection/results/report";
    let post_data = {number: data.number, system_patient_id: this.props.patientId};
    apiClient.post(path, post_data).then(() => {
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      window.sessionStorage.setItem("alert_messages", "報告済みしました。");
      // let cur_soapList = this.state.soapList;
      // let soapList = Object.keys(cur_soapList).map((ind) => {
      //     if (ind === this.state.soapIndex) {
      //         cur_soapList[ind].report_flag = 1;
      //     }
      //     return cur_soapList[ind];
      // });
      // this.props.updateSoapList(soapList);
      this.props.goToDropPage(`/patients/${this.props.patientId}/soap`);
    });
  };

  getOrderTitleClassName = (param_obj) => {
    if(param_obj.target_table === "order") {
      if(param_obj.category === '文書'){
        return param_obj.karte_status != 3 ? "color_document" : "color_document_hospital";
      }
      if(param_obj.sub_category === '食事オーダ'){
        return 'color_meal';
      }
      if(param_obj.sub_category === "入院申込オーダ" || param_obj.sub_category === "退院許可" || param_obj.sub_category === "退院時指導レポート"){
        return param_obj.done_order == 1 ? "_color_implemented_hospital" : "_color_not_implemented_hospital";
      }
      if(param_obj.sub_category === 'オーダー' || param_obj.sub_category === '細胞診検査' || param_obj.sub_category === '病理検査' || param_obj.sub_category === '細菌検査'){
        if(param_obj.is_doctor_consented != 4 && param_obj.done_order == 0) {
          return param_obj.karte_status != 3 ? "_color_not_implemented" : "_color_not_implemented_hospital";
        }
        if(param_obj.done_order == 1 || param_obj.done_order == 4) {
          return param_obj.karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
        }
        if(param_obj.done_order == 2 || param_obj.done_order == 3) {
          return param_obj.karte_status != 3 ? "_color_received" : "_color_received_hospital";
        }
      }
      if(param_obj.is_doctor_consented != 4 && (param_obj.done_order == 0 || param_obj.done_order == 3)) {
        return param_obj.karte_status != 3 ? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
      }

      if (param_obj.done_order == 2) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";
      }
    } else if(param_obj.target_table === "inspection_order") {
      if(param_obj.state == 0 || param_obj.state == 5 || param_obj.state == 6){
        return param_obj.karte_status != 3 ? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if(param_obj.state == 1){
        return param_obj.karte_status != 3 ? "_color_received" : "_color_received_hospital";
      }
      if(param_obj.state == 2) {
        return param_obj.karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
      }
    } else if(param_obj.target_table === "treat_order_header") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3 ? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.state == 1) {
        return param_obj.karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
      }
    } else if(param_obj.target_table == "guidance_nutrition_request") {
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
      } else {
        return param_obj.karte_status != 3 ? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
    } else if (param_obj.target_table == "guidance_medication_request") {
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
      } else {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
    }
    if(param_obj.sub_category == "入院実施" || param_obj.sub_category == "入院決定オーダ" ||
      param_obj.sub_category == "転棟・転室実施" || param_obj.sub_category == "担当変更オーダ" ||
      param_obj.sub_category == "退院決定" || param_obj.sub_category == "退院実施" ||
      param_obj.sub_category == "外泊実施" || param_obj.sub_category == "帰院実施"){
      return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";
    }
    return "";
  }

  isStopOrder = (stop_flag, stop_date) => {
    let result = 0;
    if (stop_flag == 1) {
      let now_date_time = new Date().getTime();
      let stop_date_time = 0;
      if (stop_date != "") {
        stop_date_time = new Date(stop_date.split("-").join("/")).getTime();
      }
      if (now_date_time > stop_date_time) result = 1;
    }
    return result;
  }

  onDeleteHospitalMoveBed=async()=>{
    let cur_move_ward = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_move_ward = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let move_ward = cur_move_ward.data.order_data.order_data;
    move_ward.created_at = cur_move_ward.created_at;
    move_ward.karte_number = cur_move_ward.number;
    move_ward.last_doctor_code = move_ward.doctor_code;
    move_ward.last_doctor_name = move_ward.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.WARD_MOVE_DELETE, new Date().getTime(), JSON.stringify(move_ward), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  deleteCancelHospitalMoveBed = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheWardMoveDeleteState } = persistedState(this.props.patientId);
    if (!cacheWardMoveDeleteState) {
      cacheWardMoveDeleteState = [];
    }
    let delWardMoveData = {};
    Object.keys(cacheWardMoveDeleteState).map(key=>{
      if(cacheWardMoveDeleteState[key]['karte_number'] != nCacheNumber){
        delWardMoveData[key] = cacheWardMoveDeleteState[key];
      }
    });
    if (Object.keys(delWardMoveData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.WARD_MOVE_DELETE, JSON.stringify(delWardMoveData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.WARD_MOVE_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }
  
  onEditHospitalIn=()=>{
    let cur_hospital_in = this.state.soapList[this.state.soapIndex];
    let hospital_in = cur_hospital_in.data.order_data.order_data;
    // hospital_in.created_at = cur_hospital_in.created_at;
    // hospital_in.isForUpdate = 1;
    // this.props.showModal("edit_modal", "clickOpenHospitalApplicationOrder", JSON.parse(JSON.stringify(hospital_in)));
    let modal_event = hospital_in.hospital_type == "in_apply" ? 'clickOpenHospitalApplicationOrder' : 'clickOpenHospitalDecisionOrder';
    this.props.showModal("edit_modal", modal_event);
  }

  onDeleteHospitalIn=()=>{
    let cur_in_hospital = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_in_hospital = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });

    let in_hospital = cur_in_hospital.data.order_data.order_data;
    in_hospital.created_at = cur_in_hospital.created_at;
    in_hospital.karte_number = cur_in_hospital.number;
    in_hospital.last_doctor_code = in_hospital.doctor_code;
    in_hospital.last_doctor_name = in_hospital.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE, new Date().getTime(), JSON.stringify(in_hospital), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  deleteCancelHospitalIn = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheInHospitalDeleteState } = persistedState(this.props.patientId);
    if (!cacheInHospitalDeleteState) {
      cacheInHospitalDeleteState = [];
    }
    let delInHospitalData = {};
    Object.keys(cacheInHospitalDeleteState).map(key=>{
      if(cacheInHospitalDeleteState[key]['karte_number'] != nCacheNumber){
        delInHospitalData[key] = cacheInHospitalDeleteState[key];
      }
    });
    if(Object.keys(delInHospitalData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE, JSON.stringify(delInHospitalData));
    } else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onDeleteHospitalDone=async()=>{
    let cur_hospital_done = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_hospital_done = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let hospital_done = cur_hospital_done.data.order_data.order_data;
    hospital_done.created_at = cur_hospital_done.created_at;
    hospital_done.karte_number = cur_hospital_done.number;
    hospital_done.last_doctor_code = hospital_done.doctor_code;
    hospital_done.last_doctor_name = hospital_done.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE, new Date().getTime(), JSON.stringify(hospital_done), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  deleteCancelHospitalDone = () => {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheInHospitalDone } = persistedState(this.props.patientId);
    if (!cacheInHospitalDone) {
      cacheInHospitalDone = [];
    }
    let delHospitalDone = {};
    Object.keys(cacheInHospitalDone).map(key=>{
      if(cacheInHospitalDone[key]['karte_number'] != nCacheNumber){
        delHospitalDone[key] = cacheInHospitalDone[key];
      }
    });
    if (Object.keys(delHospitalDone).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE, JSON.stringify(delHospitalDone));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onDeleteDischargeOrder=async(type)=>{
    let cur_discharge = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_discharge = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });

    let discharge = cur_discharge.data.order_data.order_data;
    discharge.created_at = cur_discharge.created_at;
    discharge.karte_number = cur_discharge.number;
    discharge.last_doctor_code = discharge.doctor_code;
    discharge.last_doctor_name = discharge.doctor_name;
    discharge.discharge_type = type;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DELETE, new Date().getTime(), JSON.stringify(discharge), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  deleteCancelDischargeOrder=()=> {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheDischargeDelete } = persistedState(this.props.patientId);
    if (!cacheDischargeDelete) {
      cacheDischargeDelete = [];
    }
    let delDischargeDelete = {};
    Object.keys(cacheDischargeDelete).map(key=>{
      if(cacheDischargeDelete[key]['karte_number'] != nCacheNumber){
        delDischargeDelete[key] = cacheDischargeDelete[key];
      }
    });
    if (Object.keys(delDischargeDelete).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DELETE, JSON.stringify(delDischargeDelete));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onDeleteHospitalGoing=async(type)=>{
    let cur_going = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_going = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let going = cur_going.data.order_data.order_data;
    going.created_at = cur_going.created_at;
    going.karte_number = cur_going.number;
    going.last_doctor_code = going.doctor_code;
    going.last_doctor_name = going.doctor_name;
    going.going_type = type;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE, new Date().getTime(), JSON.stringify(going), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  deleteCancelHospitalGoing=()=> {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheHospitalGoingDelete } = persistedState(this.props.patientId);
    if (!cacheHospitalGoingDelete) {
      cacheHospitalGoingDelete = [];
    }
    let delHospitalGoingDelete = {};
    Object.keys(cacheHospitalGoingDelete).map(key=>{
      if(cacheHospitalGoingDelete[key]['karte_number'] != nCacheNumber){
        delHospitalGoingDelete[key] = cacheHospitalGoingDelete[key];
      }
    });
    if (Object.keys(delHospitalGoingDelete).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE, JSON.stringify(delHospitalGoingDelete));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onDeleteDeathRegister=async()=>{
    let cur_delete_register = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_delete_register = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let delete_register = cur_delete_register.data.order_data.order_data;
    delete_register.created_at = cur_delete_register.created_at;
    delete_register.karte_number = cur_delete_register.number;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE, new Date().getTime(), JSON.stringify(delete_register), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  deleteCancelDeathRegister=()=> {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if (ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheDeathRegisterDelete } = persistedState(this.props.patientId);
    if (!cacheDeathRegisterDelete) {
      cacheDeathRegisterDelete = [];
    }
    let delDeathRegister= {};
    Object.keys(cacheDeathRegisterDelete).map(key=>{
      if(cacheDeathRegisterDelete[key]['karte_number'] != nCacheNumber){
        delDeathRegister[key] = cacheDeathRegisterDelete[key];
      }
    });
    if (Object.keys(delDeathRegister).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE, JSON.stringify(delDeathRegister));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  onDeleteChangeResponsibility=()=>{
    let cur_change_responsibility = {};
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if(ind === this.state.soapIndex){
        cur_soapList[ind].isDeleted = true;
        cur_soapList[ind].doctor_code = cur_soapList[ind].instruction_doctor_code;
        cur_change_responsibility = cur_soapList[ind];
      }
      return cur_soapList[ind];
    });
    let change_responsibility_delete = cur_change_responsibility.data.order_data.order_data;
    change_responsibility_delete.created_at = cur_change_responsibility.created_at;
    change_responsibility_delete.karte_number = cur_change_responsibility.number;
    change_responsibility_delete.last_doctor_code = cur_change_responsibility.doctor_code;
    change_responsibility_delete.last_doctor_name = cur_change_responsibility.doctor_name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE, new Date().getTime(), JSON.stringify(change_responsibility_delete), "insert");
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  deleteCancelChangeResponsibility=()=> {
    let nCacheNumber = -1;
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind)=>{
      if(ind === this.state.soapIndex) {
        cur_soapList[ind].isDeleted = false;
        nCacheNumber = cur_soapList[ind].number;
      }
      return cur_soapList[ind];
    });
    let { cacheChangeResponsibilityDeleteState } = persistedState(this.props.patientId);
    if (!cacheChangeResponsibilityDeleteState) {
      cacheChangeResponsibilityDeleteState = [];
    }
    let delChangeResponsibilityData = {};
    Object.keys(cacheChangeResponsibilityDeleteState).map(key=>{
      if(cacheChangeResponsibilityDeleteState[key]['karte_number'] != nCacheNumber){
        delChangeResponsibilityData[key] = cacheChangeResponsibilityDeleteState[key];
      }
    });
    if (Object.keys(delChangeResponsibilityData).length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE, JSON.stringify(delChangeResponsibilityData));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  getCheckSameOptions = (ele_order) => {
    if (ele_order == null ||
      ele_order == undefined ||
      ele_order.med == undefined ||
      ele_order.med == null ||
      ele_order.med.length < 1) {
      return;
    }
    let med = ele_order.med[0];
    let keys = Object.keys(med);
    let equalKeys = [];
    const allEqual = arr => arr.every(v => v === arr[0]);    
    keys.map(key => {
      let value = [];
      ele_order.med.map(medi => {
        value.push(medi[key]);
      });
      if (allEqual(value)) {
        equalKeys.push(key);
      }
    });
    return equalKeys;
  };

  getSameOptions = (ele_order, aa) => {
    let values = [];
    if (aa !== undefined) {
      aa.map(key => {
        let value = {};

        value[key] = ele_order.med[0][key];
        values.push(value);
      });
    }
    let value = {};
    value["one_dose_package"] = ele_order["one_dose_package"];
    values.push(value);
    value = {};
    value["temporary_medication"] = ele_order["temporary_medication"];
    values.push(value);
    value = {};
    value["mixture"] = ele_order["mixture"];
    values.push(value);
    return values;
  };

  handleIncreasePrescription = () => {
    this.closeModal();
    this.props.refreshRightBox();
  }

  changeDoneState = (karte_number, order_type, new_order_data = null, done_order = null) => {
    let {soapList} = this.state;
    Object.keys(soapList).map(index=>{
      let item = soapList[index];
      if (item.number == karte_number) {
        switch(order_type){
          case "prescription":
            item.data.done_order = 1;
            break;
          case "inspection":
            item.data.state = 2;
            item.data.order_data.order_data = new_order_data;
            break;
          case "guidance-nutrition-request":
            item.data.done_order = 1;
            item.data.order_data.order_data.done_order = 1;
            break;
          case "injection_stop":            
            item.data.order_data = new_order_data;
            break;
          case "exam-order":
            if (item.data.order_data.order_data.administrate_period !== undefined && item.data.order_data.order_data.administrate_period.done_numbers !== undefined && done_order > 0) {
              item.data.done_order = done_order;
              item.data.order_data.order_data.done_order = done_order;
            } else {
              item.data.done_order = 1;
              item.data.order_data.order_data.done_order = 1;
            }
            break;
          case "rehabily":
            if (new_order_data != null){
              item.data.done_order = new_order_data.done_order;
              item.data.order_data.order_data.done_order = new_order_data.done_order;
            } else {
              item.data.done_order = 1;
              item.data.order_data.order_data.done_order = 1;
            }
            break;
          case "radiation":
            if (new_order_data != null){
              item.data.done_order = new_order_data.done_order;
              item.data.order_data.order_data.done_order = new_order_data.done_order;
              item.data.order_data.order_data = new_order_data;
            }
            break;
          case "treatment_done":
            item.data.state = 1;
            item.data.order_data.order_data.header.state = 1;
            item.data.order_data.order_data.detail = new_order_data.detail;
            if (new_order_data.detail.length > 0) {
              let completed_count = 0;
              new_order_data.detail.map(item=>{
                if (item.completed_at != undefined && item.completed_at != "") {
                  completed_count ++;
                }
              });
              if (completed_count < new_order_data.detail.length) {
                item.data.state = 2;
                item.data.order_data.order_data.header.state = 2;
              }
            }            
            break;
        }
      }
    });
    this.setSoapListData(soapList);
  }

  closeExamOrderList=()=>{
    this.setState({openExamOrderList:false}, ()=>{
      this.changeReadState();
    });
  }
  
  changeReadState =async() => {
    let karte_numbers = [];
    let exam_data = this.state.soapList[this.state.soapIndex];
    karte_numbers.push(exam_data.number);
    let allDateList = this.state.allDateList;
    let year = exam_data.treatment_date.substr(0, 4);
    let month = exam_data.treatment_date.substr(5, 2);
    let day = exam_data.treatment_date.substr(8, 2);
    let order_data = allDateList[year +'-'+ month +'-'+ day][exam_data.target_table];
    order_data.map((item, index)=>{
      if(item.number == exam_data.number){
        allDateList[year +'-'+ month +'-'+ day][exam_data.target_table][index]['read_flag'] = 1;
      }
    });
    this.props.changeAllDateList(allDateList);
    let path = "/app/api/v2/karte/tree/changeReadStatus";
    apiClient._post(
      path,
      {karte_numbers,})
      .then(() => {
      })
      .catch(() => {
      });
  }

  middleboxCancelDelData=(karte_number, cache_name, subkey)=>{
    let cur_soapList = this.state.soapList;
    let soapList = Object.keys(cur_soapList).map((ind) => {
      if(cur_soapList[ind]['number'] == karte_number){
        cur_soapList[ind].isDeleted = false;
        cur_soapList[ind].isStopped = false;
        if(cache_name == CACHE_LOCALNAMES.TREATMENT_DELETE){
          cur_soapList[ind].data.order_data.order_data.detail.map((detail) => {
            detail.isDeleted = false;
          });
        }
      }
      return cur_soapList[ind];
    });
    if(subkey == null){
      karteApi.delVal(this.props.patientId, cache_name);
    } else {
      karteApi.delSubVal(this.props.patientId, cache_name, subkey);
    }
    this.props.updateSoapList(soapList);
    this.props.refreshRightBox();
  }

  // 実施済みの放射線検査にPACSリンクを追加する
  handleOpenPacs = () => {
    // YJ34 PACS機能の修正
    patientApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PAC_STATUS, JSON.stringify("on"));
    let patientInfo = karteApi.getPatient(this.props.patientId);
    if(patientInfo == undefined || patientInfo == null) return;
    openPacs(patientInfo.receId, "open");
  }

  soapColorChange = (text, color) => {
    if(text == null) return "";
    text = text.split("\"").join("'");
    return text.replace(/color='#[0-9a-f]+'/gi, "color='" + color + "'");
  }

  changeExamOrderStatus = () => {
    this.setState({openInputExamOrder: false});
    let {soapList} = this.state;
    if (soapList[this.state.soapIndex].data.order_data.order_data == null) return;
    soapList[this.state.soapIndex].data.order_data.order_data.exist_result = 1;
  }

  getEnablePac = (_state, _id) => {
    let inspection_master = null;
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.inspection_master != undefined && init_status.inspection_master != null) {
      inspection_master = init_status.inspection_master;
    }

    // ■1230-41 一部の生理検査も、実施済みの場合にPACSリンクを表示できるように
    let can_inspection_pac = false;

    if (inspection_master != null && inspection_master.length > 0 && _state == 2) {
      inspection_master.map(ele=>{
        if (ele.inspection_id == _id && ele.can_use_pacs == 1) {
          can_inspection_pac = true;
        }
      });
    }
    return can_inspection_pac;
  }

  cancelAlertModal = () => {
    this.setState({
      alertMessage: ""
    });
  }
  
  middleboxRefresh=()=>{
    this.setState({middleboxRefresh: !this.state.middleboxRefresh});
  }

  // ・SOAP右・中央カラムとシールは、流動食名の下に摂取方法、その下に「朝1、夕1」のように本数を表示するように
  getMealCountLabel = (_morning, _noon, _evening) => {
    let result = [];
    if (_morning != undefined && _morning != null && _morning != "") {
      result.push("朝" + _morning);
    }
    if (_noon != undefined && _noon != null && _noon != "") {
      result.push("昼" + _noon);
    }
    if (_evening != undefined && _evening != null && _evening != "") {
      result.push("夕" + _evening);
    }
    return result.join("、");
  }
  
  changeSpaceChar=(text)=>{
    if(text == null || text == ""){return '';}
    text = text.split('');
    let text_length = text.length;
    for(let index = 0; index < text_length; index++){
      if(text[index] == " "){
        if(index == 0){
          text[index] = "&nbsp;";
        } else {
          let change_flag = false;
          for(let prev_index = index - 1; prev_index >= 0; prev_index--){
            if(text[prev_index] == "<"){
              change_flag = true;
              break;
            }
            if(text[prev_index] == ">"){
              text[index] = "&nbsp;";
              change_flag = true;
              break;
            }
          }
          if(!change_flag){
            text[index] = "&nbsp;";
          }
        }
      }
    }
    return text.join('');
  }

  getDoneTimes = (_done_times=null) => {
    if (_done_times == null || _done_times.length < 1) return "";

    let result = _done_times.map((item, index)=>{
      return(
        <>
          <span> {index+1}回目 {item != "" ? item : "未定"}{index == (_done_times.length - 1) ? "":"、"}</span>
        </>
      );
    });
    return result;   
  }
  
  checkEnableHospitalRecord=async(soapIndex, confirm_type, other_value=null)=>{
    let selected_order = this.state.soapList[soapIndex];
    let path = "/app/api/v2/ward/check/enable_record";
    let post_data = {
      patient_id:this.props.patientId,
      hos_detail_number:confirm_type === "_deleteDischargePermit" ? selected_order.data.order_data.order_data.hos_detail_id : selected_order.data.order_data.order_data.hos_detail_number
    };
    let edit_flag = 0;
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        edit_flag = res.edit_flag;
      })
      .catch(() => {
      });
    if(edit_flag){
      let confirm_message = "";
      if(confirm_type === "_deleteHospitalIn"){
        confirm_message = (other_value === "hospital-apply" ? "入院申込" : "入院決定") + "を取り消しますか？";
      }
      if(confirm_type === "_deleteChangeResponsibility"){
        confirm_message = "担当変更を取り消しますか？";
      }
      if(confirm_type === "_deleteHospitalMoveBed"){
        confirm_message = "転棟・転室実施を取り消しますか？";
      }
      if(confirm_type === "_deleteDischargeDone"){
        confirm_message = "退院実施を取り消しますか？";
      }
      if(confirm_type === "_deleteCancelHospitalMoveBed"){
        confirm_message = "転棟・転室実施を取り消しますか？";
      }
      if(confirm_type === "_deleteDischargePermit"){
        confirm_message = "退院許可を取り消しますか？";
      }
      if(confirm_type === "_deleteDischargeDecision"){
        confirm_message = "退院決定を取り消しますか？";
      }
      if(confirm_type === "_deleteHospitalGoingOut"){
        confirm_message = "外泊実施を取り消しますか？";
      }
      if(confirm_type === "_deleteHospitalGoingIn"){
        confirm_message = "帰院実施を取り消しますか？";
      }
      if(confirm_type === "_deleteHospitalDone"){
        confirm_message = "入院実施を取り消しますか？";
      }
      this.setState({
        confirm_message,
        confirm_type,
        soapIndex
      });
    } else {
      this.setState({
        alert_title: "移動エラー",
        alert_messages: "この患者の最後の移動内容ではないため、取り消しできません。",
      });
    }
  }
  
  getInspectionStatus=(inspection_id, state, is_enabled, order_data)=>{
    let status = state == 0 ? "未受付" : (state == 1 ? "受付済み" : (state == 5 ? "受付中" : (state == 6 ? "実施中" : "")));
    let inspection_info = getInspectionMasterInfo(inspection_id);
    if(inspection_info.end_until_continue_type !== undefined && (inspection_info.end_until_continue_type == 1 || (inspection_info.end_until_continue_type == 2 && order_data.karte_status == 3))){
      status = "未実施";
      if(order_data.start_date !== undefined){status = "実施中";}
      if(order_data.end_date !== undefined){status = "";}
    }
    if(is_enabled == 2){status = "（削除済み）";}
    if(is_enabled == 4){status = "（中止済み）";}
    return status;
  }
  
  getContinueDate=(continue_date)=>{
    let date_arr = [];
    continue_date.map(item=>{
      let date = item.date.split(" ")[0];
      if(date_arr[date] === undefined){
        date_arr[date] = [];
      }
      date_arr[date].push(item);
    });
    let date_html = [];
    Object.keys(date_arr).map(date=>{
      date_html.push(<p style={{margin:0}}>{formatJapanDateSlash(date)}</p>);
      date_arr[date].map(item=>{
        date_html.push(
          <p style={{margin:0}}>
            ・{(item.date.split(" ")[1] !== undefined ? formatTimeIE(item.date) : "")}
            {item.done_result !== undefined ? (" 結果: " + displayLineBreak(item.done_result) + item.result_suffix) : ""}
            {"　" + getStaffName(item.user_number)}
          </p>
        );
        if(item.done_comment !== undefined){
          date_html.push(
            <p style={{margin:0}}>{"　コメント:" + displayLineBreak(item.done_comment)}</p>
          );
        }
      });
    });
    return date_html;
  }

  getOneSpaces = (_n) => {
    let result = "";
    let one_space = "　";
    for (var i = _n - 1; i >= 0; i--) {
      result += one_space;
    }
    return result;
  }

  // ●YJ868 SOAP画面で、処方をクリップボードにコピーできるようにする
  copyPrescriptionToClipboard = (_prescriptionData) => {
    let clipboard_text = "";    
    _prescriptionData.data.order_data.order_data.map((rp_item, rp_index)=>{      
      let _keyName = {
        // can_generic_name: "一般名処方",
        // is_not_generic: "後発不可",
        // milling: "粉砕",
        // free_comment: "備考",
        // separate_packaging: "別包",
        one_dose_package: "一包化",
        temporary_medication: "臨時処方",
        mixture:"混合"
      };
      let sameKeys = this.getCheckSameOptions(rp_item);
      let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptions(rp_item, sameKeys) : "";      
      let existSameOptions = 0;
      let sameOptionsView = [];
      if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "" && _prescriptionData.category === "処方") {
        existSameOptions = 1;        
        Object.keys(_keyName).map(_key=>{
          if(sameOptions != undefined && sameOptions != null && sameOptions != "" && sameOptions.length > 0){
            sameOptions.map(_option=>{
              if(_option != undefined  && _option[_key] == 1) {                
                sameOptionsView.push("【" + _keyName[_key] + "】");
              }
            });            
          }
        });
      }

      if (rp_item.med.length > 0) {
        rp_item.med.map((med_item, med_index)=>{
          if (med_index == 0) {
            if (rp_index < 9) {
              if (rp_index == 0) {
                clipboard_text += " " + (rp_index + 1) + ") ";
              } else {
                clipboard_text += " " + (rp_index + 1) + ") ";
              }
            } else {
              clipboard_text += (rp_index + 1) + ") ";              
            }
            clipboard_text += med_item.item_name + this.getOneSpaces(3) + med_item.amount + med_item.unit + "\n";
          } else {
            clipboard_text += this.getOneSpaces(2) + med_item.item_name + this.getOneSpaces(3) + med_item.amount + med_item.unit + "\n";
          }
          
          // 薬剤オプション
          if (existSameOptions == 1) {
            let tmp_clipboard_text = this.getOneSpaces(3);
            let _exist_options = 0;           

            if (med_item["can_generic_name"] != undefined && med_item["can_generic_name"] == 1) {
              tmp_clipboard_text += "【一般名処方】";
              _exist_options = 1;
            }
            if (med_item["is_not_generic"] != undefined && med_item["is_not_generic"] == 1) {
              tmp_clipboard_text += "【後発不可】";
              _exist_options = 1;
            }
            if (med_item["milling"] != undefined && med_item["milling"] == 1) {
              tmp_clipboard_text += "【粉砕】";
              _exist_options = 1;
            }
            if (med_item["separate_packaging"] != undefined && med_item["separate_packaging"] == 1) {
              tmp_clipboard_text += "【別包】";
              _exist_options = 1;
            }

            if (_exist_options == 1) {              

              tmp_clipboard_text += "\n";
              clipboard_text += tmp_clipboard_text;
            }
          }

          // 薬剤コメント
          if (med_item.free_comment && med_item.free_comment.length > 0) {
            med_item.free_comment.map(comment => {
              clipboard_text += this.getOneSpaces(3) + comment + "\n";              
            })
          }

        });
      }
      // 用法
      if (rp_item.usage_name != undefined && rp_item.usage_name != undefined != "") {        
        clipboard_text += this.getOneSpaces(2) + "用法：" + rp_item.usage_name;
        if (rp_item.days !== 0 && rp_item.days !== undefined) {
          clipboard_text += this.getOneSpaces(1) + "(" + rp_item.days;
          if (rp_item.days_suffix !== undefined && rp_item.days_suffix !== "") {
            clipboard_text += rp_item.days_suffix + ")" + "\n";
          } else {
            clipboard_text += "日分" + ")" + "\n";
          }
        } else {
          clipboard_text += "\n";
        }
      }      

      // 追加用法コメント
      if (rp_item.usage_remarks_comment) {
        rp_item.usage_remarks_comment.map(comment => {          
          clipboard_text += this.getOneSpaces(3) + comment + "\n";
        })
      }

      // RPオプション
      if(sameOptionsView.length > 0){
        clipboard_text += this.getOneSpaces(3);
        sameOptionsView.map(_option=>{
          clipboard_text += _option;
        })
        clipboard_text += "\n";
      }

      // 部位/補足
      if (rp_item.body_part != undefined && rp_item.body_part != "") {        
        clipboard_text += this.getOneSpaces(3) + "部位/補足：" + rp_item.body_part + "\n";
      }

      // 処方開始日
      if (rp_item.start_date !== undefined && rp_item.start_date !== "" && (rp_item.administrate_period == undefined || rp_item.administrate_period == null)) {
        clipboard_text += this.getOneSpaces(3) + "処方開始日：" + formatJapanDateSlash(formatDate(rp_item.start_date)) + "\n";
      }

      // 投与期間
      if (rp_item.administrate_period != undefined && rp_item.administrate_period != null) {
        clipboard_text += this.getOneSpaces(3) + "投与期間：" + formatJapanDateSlash(rp_item.administrate_period.period_start_date) + "～" + formatJapanDateSlash(rp_item.administrate_period.period_end_date) + "\n";
        if (rp_item.administrate_period.period_type == 0 && rp_item.administrate_period.period_category != null) {
          clipboard_text += this.getOneSpaces(3) + "間隔：";
          clipboard_text += rp_item.administrate_period.period_category == 0 ? "日":rp_item.administrate_period.period_category == 1 ? "週" : "月";
          clipboard_text += "\n";
        }
        if (rp_item.administrate_period.period_type == 1 && rp_item.administrate_period.period_week_days.length > 0) {
          clipboard_text += this.getOneSpaces(3) + "曜日：" + getWeekNamesBySymbol(rp_item.administrate_period.period_week_days) + "\n";
        }
      }

      // 保険
      if (rp_item.insurance_type != undefined) {
        clipboard_text += this.getOneSpaces(3) + "保険：" + this.getInsurance(rp_item.insurance_type) + "\n";
      }

      // RPオプション
      // if(sameOptionsView.length > 0){
      //   clipboard_text += this.getOneSpaces(3);
      //   sameOptionsView.map(_option=>{
      //     clipboard_text += _option;
      //   })
      //   clipboard_text += "\n";
      // }
      
    });

    // 備考のオプション
    if (_prescriptionData.data.order_data != null && _prescriptionData.data.order_data.med_consult != null && _prescriptionData.data.order_data.med_consult !== undefined && _prescriptionData.data.order_data.med_consult == 1) {      
      clipboard_text += "【お薬相談希望あり】" + "\n";
    }
    if (_prescriptionData.data.order_data != null && _prescriptionData.data.order_data.supply_med_info != null && _prescriptionData.data.order_data.supply_med_info !== undefined && _prescriptionData.data.order_data.supply_med_info == 1) {      
      clipboard_text += "【薬剤情報提供あり】" + "\n";
    }

    // 持参薬種別
    if (_prescriptionData.data.order_data != null && _prescriptionData.data.order_data.potion != null && _prescriptionData.data.order_data.potion !== undefined && (_prescriptionData.data.order_data.potion == 0 || _prescriptionData.data.order_data.potion == 1) && _prescriptionData.data.order_data.is_internal_prescription == 5) {
      clipboard_text += _prescriptionData.data.order_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）";
      clipboard_text += "\n";
    }

    // 該当のチェックボックス
    if (_prescriptionData.data.order_data != null && _prescriptionData.data.order_data.hospital_opportunity_disease != null && _prescriptionData.data.order_data.hospital_opportunity_disease !== undefined && _prescriptionData.data.order_data.hospital_opportunity_disease == 1) {
      clipboard_text += "入院契機傷病の治療に係るもの" + "\n";
    }

    // 向精神薬多剤投与理由
    if (_prescriptionData.data.order_data != null && _prescriptionData.data.order_data.psychotropic_drugs_much_reason != null && _prescriptionData.data.order_data.psychotropic_drugs_much_reason !== undefined && _prescriptionData.data.order_data.psychotropic_drugs_much_reason !== "") {      
      clipboard_text += "●向精神薬多剤投与理由：" + _prescriptionData.data.order_data.psychotropic_drugs_much_reason + "\n";
    }

    // 湿布薬超過投与理由
    if (_prescriptionData.data.order_data != null && _prescriptionData.data.order_data.poultice_many_reason != null && _prescriptionData.data.order_data.poultice_many_reason !== undefined && _prescriptionData.data.order_data.poultice_many_reason !== "") {      
      clipboard_text += "●湿布薬超過投与理由：" + _prescriptionData.data.order_data.poultice_many_reason + "\n";
    }

    // 備考
    if (_prescriptionData.data.order_data != null && _prescriptionData.data.order_data.free_comment != null && _prescriptionData.data.order_data.free_comment !== undefined && _prescriptionData.data.order_data.free_comment.length > 0 &&  _prescriptionData.data.order_data.free_comment[0] != null) {
      clipboard_text += "●備考：" + _prescriptionData.data.order_data.free_comment[0] + "\n";
    }

    if (window.clipboardData) {
      window.clipboardData.setData ("Text", clipboard_text);
    }
  }
  
  closeRightClickMenu=()=>{
    if(this.state.contextMenu.visible || this.state.stickyMenu.visible || this.state.contextKarteDateMenu.visible){
      this.setState({
        contextMenu:{visible:false},
        stickyMenu:{visible:false},
        contextKarteDateMenu:{visible:false}
      });
    }
  }
  
  registerSoap=(e) => {
    if(this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if(!(this.state.categoryType === undefined || this.state.categoryType === SOAP_TREE_CATEGORY.CURRENT_SOAP || this.state.categoryType === SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST)){return;}
    if(this.state.show_list_condition === undefined || this.state.show_list_condition.date === ''){return;}
    if (!this.context.$canDoAction(this.context.FEATURES.SOAP,this.context.AUTHS.REGISTER_OLD) && !this.context.$canDoAction(this.context.FEATURES.SOAP,this.context.AUTHS.REGISTER_PROXY_OLD)) {return;}
    let exit_soap = false;
    if(Object.keys(this.state.soapList).length > 0){
      Object.keys(this.state.soapList).map(index=>{
        if(this.state.soapList[index]['target_table'] === "soap"){
          exit_soap = true;
        }
      });
    }
    if(exit_soap){return;}
    if (e.type === "contextmenu") {
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextKarteDateMenu: { visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextKarteDateMenu: {
            visible: false,
          }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("soap_list_wrapper")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextKarteDateMenu: {
              visible: false,
            }
          });
          document
            .getElementById("soap_list_wrapper")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      let clientX = e.clientX;
      let clientY = e.clientY;
      this.props.closeRightClickMenu('middle');
      let soap_list_left = $('#soap_list_wrapper').offset().left;
      let state_data = {};
      state_data.contextKarteDateMenu = {
        visible: true,
        x: clientX - soap_list_left,
        y: clientY + window.pageYOffset - 120,
      };
      state_data.contextMenu = {visible:false};
      state_data.stickyMenu = {visible:false};
      this.setState(state_data, ()=>{
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let soap_list_width = document.getElementsByClassName("soap_list_wrapper")[0].offsetWidth;
        if ((clientX + menu_width) > (soap_list_width + soap_list_left)) {
          state_data.contextKarteDateMenu.x = clientX - menu_width -soap_list_left;
          this.setState(state_data);
        }
      });
    }
  };
  
  setInspectionDateDoneInfo=(order_data)=>{
    let soapList = this.state.soapList;
    soapList[this.state.soapIndex].data.order_data.order_data = order_data;
    if(order_data.end_date !== undefined){
      soapList[this.state.soapIndex].data.end_date = order_data.end_date;
    }
    this.setState({
      soapList,
      isOpenInspectionStartEndDateTimeRegister:false,
    });
  }

  renderPrescriptionIncreasePeriodModal = (modal_data) => {
    let _state = {
      done_modal_title: modal_data.category,
      done_modal_data: modal_data,
    };
    if (modal_data.category == "処方") {
      _state.done_modal_type = "prescription_increase";
      _state.isOpenPrescriptionIncreasePeriodModal = true;
    } else if(modal_data.category == "注射") {
      _state.done_modal_type = "injection_increase";
      _state.isOpenInjectionIncreasePeriodModal = true;
    } else if(modal_data.category == "処置") {
      _state.done_modal_type = "treatment_increase";
      _state.isOpenTreatmentIncreasePeriodModal = true;
    } else if(modal_data.category == "検査") {
      _state.done_modal_type = "examination_increase";
      _state.isOpenExaminationIncreasePeriodModal = true;
    }
    this.setState(_state);
  }
  
  getExamDoneState = (done_numbers, date) => {
    if (done_numbers === undefined || done_numbers == null) return "";
    if (done_numbers[date] === undefined || done_numbers[date].length === 0) return "";
    let done_data = done_numbers[date];
    let result = "";
    let done_exe = 0;
    let done_all = 0;
    let collect_reception_exe = 0;
    let collect_reception_all = 0;
    let collect_done_exe = 0;
    let collect_done_all = 0;
    
    done_data.map(item=>{
      done_all++;
      collect_reception_all++;
      collect_done_all++;
      if (item.collect_reception_at !== undefined && item.collect_reception_at !== "") collect_reception_exe++;
      if (item.collect_done_at !== undefined && item.collect_done_at !== "") collect_done_exe++;
      if (item.completed_at !== undefined && item.completed_at !== "") done_exe++;
    });
  
    if(done_exe > 0 ) {
      result = done_exe == done_all ? "検査受付済み": "検査受付済み中";
    }
    if(collect_reception_exe > 0 ) {
      result = collect_reception_exe == collect_reception_all ? "採取待ち": "採取待ち中";
    }
    if(collect_done_exe > 0 ) {
      result = collect_done_exe == collect_done_all ? "採取済み": "採取済み中";
    }
    return result;
  }

  render() {
    const { soapList, allTags, allDateList} = this.state;
    let page = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER);
    if(page === undefined || page == null){
      page = this.state.soap_page_number;
    }
    if(this.state.soap_page_number != 0 && this.state.soap_page_number != page){
      page = this.state.soap_page_number;
    }
    const keyName = {
      can_generic_name: "一般名処方",
      is_not_generic: "後発不可",
      milling: "粉砕",
      // free_comment: "備考",
      separate_packaging: "別包",
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture: "混合"
    };
    // rp options
    let keyName_rp = {      
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture: "混合"
    };
    let show_order_count = 0;
    let sort_soapList = [];
    if(soapList !== undefined && soapList != null && Object.keys(soapList).length > 0){
      Object.keys(soapList).sort().reverse().forEach(key => {
        if (show_order_count < (page+1)*15) {
          show_order_count++;
          sort_soapList.push( {
            'key':key,
            'order_data':soapList[key]
          })
        }
      });
    }
    let order_open_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MIDDLE_ORDER_OPEN);
    if(order_open_data === undefined ) order_open_data = null;
    let show_list_condition = this.state.show_list_condition; //一覧表示の上部に、表示している一覧の条件を表記する
    if(show_list_condition === undefined){show_list_condition = {condition:'', date:''};}
    if(show_list_condition.condition === ''){
      show_list_condition.condition = '自科カルテ('+(this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15日';
    }
    let patientInfo = karteApi.getPatient(this.props.patientId);
    if (!this.props.isLoaded) {
      return (
        <LoadingCol id="soap_list_wrapper">
          <SpinnerWrapper>
            <Spinner animation="border" variant="secondary" />
          </SpinnerWrapper>
        </LoadingCol>
      );
    } else {
      return (
        <Wrapper font_props = {this.props.font_props}>
          <KarteCalendar
            soapList={soapList}
            allDateList={allDateList}
            all_soap_data={this.state.soapTrees.all_soap}
            changeSoapList={this.props.changeSoapList}
            font_props = {this.props.font_props}
          />
          {this.props.next_reservation_visit_date !== undefined && (
            <div className={'next-reservation-visit-date'}>{this.props.next_reservation_visit_date}</div>
          )}
          <div className={'list-condition'} onContextMenu={e => this.registerSoap(e)}>{show_list_condition.condition}</div>
          <div style={{display:"flex"}} className={'all-close-open'}>
            <div className={'all-order-open'} onClick={this.allSoapDataOpen.bind(this, true)}>
              <Angle className="angle" icon={faAngleDown} />
              <label>すべて展開</label>
            </div>
            <div className={'all-order-close'} onClick={this.allSoapDataOpen.bind(this, false)}>
              <Angle className="angle" icon={faAngleDown} />
              <label>すべてたたむ</label>
            </div>
          </div>
          <Col id="soap_list_wrapper" font_props = {this.props.font_props} className={'soap_list_wrapper'}>
            <div id="soap_content_wrapper">
              {sort_soapList.length > 0 && (
                sort_soapList.map((list_item) => {
                  let soap = list_item.order_data;
                  let index = list_item.key;
                  let karte_status_name = "外来・";
                  if (soap.karte_status !== undefined && soap.karte_status != null) {
                    karte_status_name = soap.karte_status == 1 ? "外来・" : soap.karte_status == 2 ? "訪問診療・" : soap.karte_status == 3 ? "入院・" : "";
                  }
                  if (soap.target_table === "soap" && this.getStatusShowDelete('soap', soap.is_enabled)) {
                    return (
                      <>
                        <div className="data-list" key={index}>
                          <div
                            className={`data-title ${soap.karte_status != 3 ? "_color_implemented":"_color_implemented_hospital"}`}
                            onClick={(e)=> this.onAngleClicked(e,index)}
                            draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2))}
                            onDragStart={e => this.onDragStartSoapEvent(e, index)}
                          >
                            <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'} ${(soap.isNew || soap.isUpdate || soap.isDeleted) ? ' changed ' : ''} ${index === this.props.updateIndex ? ' updating ' : ''}`}>
                              <div className="flex">
                                <div className="note">
                                  {soap.data.importance != undefined && soap.data.importance != null && soap.data.importance != 1 && (
                                    <span style={{color:SOAP_IMPORTANCE_COLOR[soap.data.importance]}}>{SOAP_IMPORTANCE[soap.data.importance]}</span>
                                  )}{soap.sub_category == "初診・入院時ノート" ? "【初診・入院時ノート】" : "【プログレスノート】"}{soap.is_enabled === 2 && "（削除済み）"}</div>
                                <div className="department text-right">{soap.medical_department_name}</div>
                              </div>
                              <div className="date">
                                {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                  formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                              </div>
                              <Angle className="angle" icon={faAngleDown} />
                            </div>
                            {soap.data != undefined && soap.data != null && soap.data.history !== "" && soap.data.history !== null ? (
                              <div className="history-region text-right middle-title">
                                <span onClick={() => this.openSoapHistoryModal(soap.number, soap.data.history, soap.sub_category)} className="version-span">
                                  {this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[0]}版
                                </span>
                                <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[1]}</span>
                              </div>
                            ) : (
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented)}
                              </div>
                            )}
                            <div className="doctor-name text-right low-title">{soap.doctor_name}</div>
                            {soap != undefined && soap != null && soap.visit_place_id != undefined && soap.visit_place_id > 0 && (
                              <div className="doctor-name text-right low-title facility-border">{this.getVisitPlaceName(soap.visit_place_id)}</div>
                            )}
                          </div>
                          <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                            <div className={`soap-data-item open ${(soap.isNew || soap.isUpdate || soap.isDeleted) ? ' changed ' : ''} ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''} ${this.getPresAndInjectClassFromCache(soap)}`}>
                              <div onDoubleClick={e => this.doubleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                {soap.sub_category === "初診・入院時ノート" ? (
                                  <table className="tb-soap hospitalize">
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.s_text != null && soap.data.s_text != "") ? "s_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.s_text != null && soap.data.s_text != "") ? "s_text" : null)}
                                    >
                                      <th>主訴</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.s_text), "red"))
                                            : renderHTML(this.changeSpaceChar(soap.data.s_text))}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.sharp_text != null && soap.data.sharp_text != "") ? "sharp_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.sharp_text != null && soap.data.sharp_text != "") ? "sharp_text" : null)}
                                    >
                                      <th>現病歴</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.sharp_text), "red"))
                                            : renderHTML(this.changeSpaceChar(soap.data.sharp_text))}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.o_text != null && soap.data.o_text != "") ? "o_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.o_text != null && soap.data.o_text != "") ? "o_text" : null)}
                                    >
                                      <th>所見</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.o_text), "red"))
                                            : renderHTML(this.changeSpaceChar(soap.data.o_text))}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.a_text != null && soap.data.a_text != "") ? "a_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.a_text != null && soap.data.a_text != "") ? "a_text" : null)}
                                    >
                                      <th>アセスメント</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.a_text)))
                                            : renderHTML(this.changeSpaceChar(soap.data.a_text))}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.p_text != null && soap.data.p_text != "") ? "p_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'hospital_note')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.p_text != null && soap.data.p_text != "") ? "p_text" : null)}
                                    >
                                      <th>プラン</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.p_text)), "red")
                                            : renderHTML(this.changeSpaceChar(soap.data.p_text))}
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                ) : (
                                  <table className="tb-soap">
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.sharp_text != null && soap.data.sharp_text != "") ? "sharp_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.sharp_text != null && soap.data.sharp_text != "") ? "sharp_text" : null)}
                                    >
                                      <th>#</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.sharp_text), "red"))
                                            : renderHTML(this.changeSpaceChar(soap.data.sharp_text))}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.s_text != null && soap.data.s_text != "") ? "s_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.s_text != null && soap.data.s_text != "") ? "s_text" : null)}
                                    >
                                      <th>(S)</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.s_text), "red"))
                                            : renderHTML(this.changeSpaceChar(soap.data.s_text))}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.o_text != null && soap.data.o_text != "") ? "o_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.o_text != null && soap.data.o_text != "") ? "o_text" : null)}
                                    >
                                      <th>(O)</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.o_text), "red"))
                                            : renderHTML(this.changeSpaceChar(soap.data.o_text))}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.a_text != null && soap.data.a_text != "") ? "a_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.a_text != null && soap.data.a_text != "") ? "a_text" : null)}
                                    >
                                      <th>(A)</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.a_text), "red"))
                                            : renderHTML(this.changeSpaceChar(soap.data.a_text))}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      onContextMenu={e => this.handleClick(e, index, "soap", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled,
                                        false, (soap.data.p_text != null && soap.data.p_text != "") ? "p_text" : null)}
                                      className={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap') == false ? 'noselect' : ''}
                                      draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2), 'soap')}
                                      onDragStart={e => this.onDragStartSoapEvent(e, index, (soap.data.p_text != null && soap.data.p_text != "") ? "p_text" : null)}
                                    >
                                      <th>(P)</th>
                                      <td>
                                        <div>
                                          {(soap.isDeleted || soap.is_enabled === 2) ? renderHTML(this.soapColorChange(this.changeSpaceChar(soap.data.p_text), "red"))
                                            : renderHTML(this.changeSpaceChar(soap.data.p_text))}
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                )}
                              </div>
                              <div
                                className={'flex'}
                                draggable={this.getStatusCanRegister("soap", (soap.isDeleted || soap.is_enabled === 2))}
                                onDragStart={e => this.onDragStartSoapEvent(e, index)}
                              >
                                {soap.importance_level === 100 && (
                                  <div className={'importance-level'}>【重要】</div>
                                )}
                                <div className={'tag-block-area'}>
                                  {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                    Object.keys(allTags[soap.number]).map((key)=>{
                                      if(allTags[soap.number][key]['is_enabled'] === 1){
                                        if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                          return (
                                            <>
                                              <div
                                                className={'tag-block'}
                                                style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                onClick={() => this.openTagDetailModal(soap.number, key)}
                                                onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                              >
                                                {allTags[soap.number][key]['title']}
                                              </div>
                                            </>
                                          );
                                        }
                                      }
                                    })
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  }
                  else if (soap.target_table === "order" && soap.data != null){
                    let category_title = '';
                    let draggable = false;
                    if(soap.category === '注射'){                                            
                      category_title = karte_status_name + "注射";
                      if (soap.data.order_data.is_completed == 4) {
                        category_title = karte_status_name + "定期注射";
                      }
                      draggable = this.getStatusCanRegister("injection", (soap.isDeleted || soap.is_enabled === 2));
                    }
                    else if(soap.category === '処方'){                      
                      category_title = karte_status_name + (soap.karte_status == 3 ? HOSPITALIZE_PRESCRIPTION_TYPE[soap.data.order_data.is_internal_prescription].value
                        : (soap.data.order_data.is_internal_prescription == 0 ? "院外" : "院内"))+'処方';
                      draggable = this.getStatusCanRegister("prescription", (soap.isDeleted || soap.is_enabled === 2));
                    }
                    else if(soap.category === '検査' && (soap.sub_category === 'オーダー' || soap.sub_category === '細胞診検査' || soap.sub_category === '病理検査' || soap.sub_category === '細菌検査')){
                      let title = '検体検査';
                      if (soap.sub_category == "細胞診検査") title = "細胞診検査";
                      else if (soap.sub_category == "病理検査") title = "病理組織検査";
                      else if (soap.sub_category == "細菌検査") title = "細菌・抗酸菌検査";
                      category_title = karte_status_name + title;
                      draggable = this.getStatusCanRegister("exam-order", (soap.isDeleted || soap.is_enabled === 2));
                    }
                    else if(soap.category === '汎用オーダー' || soap.category === '在宅' || soap.category === '精神'){
                      category_title = karte_status_name + soap.category;
                      draggable = this.getStatusCanRegister("guidance-order", (soap.isDeleted || soap.is_enabled === 2));
                    } else if(soap.category === '管理・指導'){
                      category_title = karte_status_name + '汎用オーダー';
                      draggable = this.getStatusCanRegister("guidance-order", (soap.isDeleted || soap.is_enabled === 2));
                    } else if(soap.category === 'リハビリ'){
                      category_title = karte_status_name + soap.category;
                      draggable = this.getStatusCanRegister("rehabily-order", (soap.isDeleted || soap.is_enabled === 2));
                    } else if(soap.category =='放射線'){
                      category_title = karte_status_name + '放射線 '+ ' ' + soap.sub_category;
                      draggable = this.getStatusCanRegister("radiation-order", (soap.isDeleted || soap.is_enabled === 2));
                    } else if(soap.category =='入院' && soap.sub_category == '退院許可'){
                      category_title = '入院・退院許可';
                    } else if(soap.category =='入院' && soap.sub_category == '担当変更オーダ'){
                      category_title = '入院・担当変更オーダー';
                    } else if(soap.category =='入院' && soap.sub_category == '食事オーダ'){
                      category_title = '入院・食事オーダー';
                    } else if(soap.category =='入院' && soap.sub_category == '入院申込オーダ'){
                      category_title = '入院・申込オーダー';
                    } else if(soap.category =='入院' && soap.sub_category == '入院決定オーダ'){
                      category_title = '入院・決定オーダー';
                    } else if(soap.category =='入院' && soap.sub_category == '外泊実施'){
                      category_title = '入院・外泊実施';
                    } else if(soap.category =='入院' && soap.sub_category == '帰院実施'){
                      category_title = '入院・帰院実施';
                    } else if(soap.category =='入院' && soap.sub_category == '退院決定'){
                      category_title = '入院・退院決定';
                    } else if(soap.category =='入院' && soap.sub_category == '退院実施'){
                      category_title = '入院・退院実施';
                    } else if(soap.category =='入院' && soap.sub_category == '入院実施'){
                      category_title = '入院・入院実施';
                    } else if(soap.category =='入院' && soap.sub_category == '転棟・転室実施'){
                      category_title = '入院・転棟・転室実施';
                    } else if(soap.category =='入院' && soap.sub_category == '外泊・外出'){
                      category_title = '入院・外泊・外出';
                    } else if(soap.category =='入院' && soap.sub_category == '帰院'){
                      category_title = '入院・帰院';
                    } else if(soap.category =='入院' && soap.sub_category == '退院時指導レポート'){
                      category_title = '入院・退院時指導レポート';
                    } else if(soap.category =='診察済記録オーダ'){
                      category_title = karte_status_name + '診察済記録オーダー';
                    } else if(soap.category =='文書'){
                      category_title = karte_status_name + '文書';
                    }                    
                    return (
                      <div
                        className={"data-list " + (draggable ? "" : "noselect")} draggable={draggable}
                        onDragStart={e => this.onDragStartSoapEvent(e, draggable ? index : null)}
                      >
                        <div
                          className={`data-title 
                            ${this.getOrderTitleClassName({
                              target_table:soap.target_table,
                              is_doctor_consented:soap.is_doctor_consented, 
                              done_order:soap.data.done_order, 
                              is_enabled:soap.is_enabled,
                              sub_category:soap.sub_category, 
                              category:soap.category,
                              karte_status:soap.karte_status
                            })}`}
                          onClick={(e)=> this.onAngleClicked(e,index)}
                        >
                          <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                            <div className="flex">
                              <div className="note">【{category_title}】
                                {(soap.sub_category != "オーダー" && soap.sub_category != "細胞診検査" && soap.sub_category != "病理検査" && soap.sub_category != "細菌検査") ? (
                                  <>
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && (soap.data.done_order === 0 || soap.data.done_order === 3) && (
                                      <span>{(soap.category== '注射' || soap.category== '処方' || soap.category === '汎用オーダー' || soap.category === '管理・指導') ? '未実施' : '未受付'}</span>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && (soap.data.done_order === 2) && (
                                      <span>{soap.category== '注射' ? "実施中":"受付済み"}</span>
                                    )}
                                  </>
                                ):(
                                  <>
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.done_order === EXAM_DONE_STATUS.NOT_RECEPTION && (
                                      <span>{EXAM_STATUS_OPTIONS.NOT_RECEPTION}</span>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.done_order === EXAM_DONE_STATUS.COLLECTION_WAIT && (
                                      <span>{EXAM_STATUS_OPTIONS.COLLECTION_WAIT}</span>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.done_order === EXAM_DONE_STATUS.COLLECTION_DONE && (
                                      <span>{EXAM_STATUS_OPTIONS.COLLECTION_DONE}</span>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.done_order === EXAM_DONE_STATUS.RECEPTION_DONE && soap.data.order_data.order_data.exist_result != 1 && (
                                      <span>{EXAM_STATUS_OPTIONS.RECEPTION_DONE}</span>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.done_order === EXAM_DONE_STATUS.COMPLETE_DONE && soap.data.order_data.order_data.exist_result != 1 && (
                                      <span>{EXAM_STATUS_OPTIONS.COMPLETE_DONE}</span>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.order_data.order_data.exist_result == 1 && (
                                      <>
                                        {soap.data.order_data.order_data.in_out_state == 1 && (
                                          <span>{EXAM_STATUS_OPTIONS.IN_RESULT_DONE}</span>
                                        )}
                                        {soap.data.order_data.order_data.in_out_state == 0 && (
                                          <span>{EXAM_STATUS_OPTIONS.OUT_RESULT_DONE}</span>
                                        )}
                                        {soap.data.order_data.order_data.in_out_state == 2 && (
                                          <span>{EXAM_STATUS_OPTIONS.INOUT_RESULT_DONE}</span>
                                        )}
                                      </>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.done_order === 5 && (
                                      <span>検査受付済み中</span>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.done_order === 6 && (
                                      <span>採取待ち中</span>
                                    )}
                                    {soap.is_doctor_consented !== 4 && soap.data != undefined && soap.data != null && soap.data.done_order === 7 && (
                                      <span>採取済み中</span>
                                    )}
                                  </>
                                )}
                                {soap.is_enabled === 2 && "（削除済み）"}
                              </div>
                              <div className="department text-right">{soap.medical_department_name}</div>
                            </div>
                            <div className="date">
                              {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                            </div>
                            <Angle className="angle" icon={faAngleDown} />
                          </div>
                          {soap.data != undefined && soap.data != null && soap.data.history !== "" && soap.data.history != null ? (
                            <div className="history-region text-right middle-title">
                              {/* 第N版の文字の左クリックでも履歴モーダルを開けるように */}
                              {(soap.category === '注射' || soap.category === '処方') ? (
                                  <>
                                    <span onClick={() => this.openModal(soap.target_number, soap.category)} className="version-span">{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented, soap.category).split('版')[0]}版</span>
                                    <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented, soap.category).split('版')[1]}</span>
                                  </>
                              ):(
                                <>
                                  <span onClick= {this.openHistoryModal.bind(this, soap.number, soap.data.history, soap.category, soap.sub_category)} className="version-span">
                                    {this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented, soap.category).split('版')[0]}版
                                  </span>
                                  <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented, soap.category).split('版')[1]}</span>
                                </>
                              )}
                            </div>
                          ):(
                            <div className="history-region text-right middle-title">{this.getHistoryInfo(0, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented, soap.category)}</div>
                          )}
                          <div className="doctor-name text-right low-title">{this.getDoctorName(soap.is_doctor_consented, soap.doctor_name)}</div>
                          {soap != undefined && soap != null && soap.visit_place_id != undefined && soap.visit_place_id > 0 && (
                            <div className="doctor-name text-right low-title facility-border">{this.getVisitPlaceName(soap.visit_place_id)}</div>
                          )}                        
                        </div>
                        <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                          {(soap.sub_category === 'オーダー' || soap.sub_category === '細胞診検査' || soap.sub_category === '病理検査' || soap.sub_category === '細菌検査') && this.getStatusShowDelete('exam-order', soap.is_enabled) && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`} >
                                <div onContextMenu={e => this.handleClick(e, index, "exam-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled )}  className="history-item" onDoubleClick={e => this.doubleClick(e, index, "exam-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">{soap.data.order_data.order_data.administrate_period !== undefined && soap.data.order_data.order_data.administrate_period != null ? "採取(予定)日時":"採取日時"}</div>
                                      </div>
                                      <div className="text-right">
                                        {soap.data.order_data.order_data.administrate_period !== undefined && soap.data.order_data.order_data.administrate_period != null ? (
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.administrate_period.done_days.length > 0 && soap.data.order_data.order_data.administrate_period.done_days.map(item=>{
                                              return (
                                                <li key ={item}>{item}　{this.getExamDoneState(soap.data.order_data.order_data.administrate_period.done_numbers, item)}</li>
                                              )
                                            })}
                                          </div>
                                        ):(
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.collected_date === "" ? "次回診察日" : soap.data.order_data.order_data.collected_time === "" ? formatJapanDateSlash(soap.data.order_data.order_data.collected_date) : formatJapanDateSlash(soap.data.order_data.order_data.collected_date)+"  "+soap.data.order_data.order_data.collected_time.substr(0,soap.data.order_data.order_data.collected_time.length-3)}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">保険</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{getInsuranceName(soap.data.order_data.order_data.insurance_name)}</div>
                                      </div>
                                    </div>
                                    {soap.data.order_data.order_data.subject != undefined && soap.data.order_data.order_data.subject != null && soap.data.order_data.order_data.subject != '' && (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">概要</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.subject}</div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {soap.data.order_data.order_data.examinations != undefined && soap.data.order_data.order_data.examinations != null && soap.data.order_data.order_data.examinations.length > 0 && (
                                      <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査項目</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.examinations.map((item, index)=>{
                                              return (
                                                <>
                                                <div className='flex' key={index} style={this.mark_color != undefined && this.mark_color != "" && item.is_attention == 1 ? {backgroundColor:this.mark_color} : {margin:0}}>
                                                  <div>
                                                    {item.is_attention != undefined && item.is_attention == 1 && this.examination_attention_mark}
                                                    {item.not_done_flag == true?'【不実施】':''}
                                                    {item.urgent != undefined && item.urgent == 1? "【至急】": ""}
                                                    {item.name}
                                                  </div>                                  
                                                </div>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      </>
                                    )}
                                    {soap.data.order_data.order_data.free_instruction != undefined && soap.data.order_data.order_data.free_instruction.length > 0 && (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">自由入力オーダー</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.free_instruction.map((item, key)=> {
                                                return (
                                                  <div key={key}>{item.is_attention != undefined && item.is_attention == 1 && this.examination_attention_mark}{item.not_done_flag == true?'【不実施】':''}{item.urgent != undefined && item.urgent == 1? "【至急】": ""}{item.text}</div> 
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    <CytologyExamOrderData
                                      cache_data={soap.data.order_data.order_data}
                                      from_source={"detail-modal"}
                                    />
                                    {soap.data.order_data.order_data.todayResult === 1 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">当日結果説明</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">あり</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.order_comment !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{soap.data.order_data.order_data.order_comment_urgent != undefined && soap.data.order_data.order_data.order_comment_urgent == 1?"【至急】":""}
                                            {soap.data.order_data.order_data.fax_report != undefined && soap.data.order_data.order_data.fax_report == 1?"【FAX報告】":""}
                                            依頼コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.order_comment}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.free_comment !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.free_comment}</div>
                                        </div>
                                      </div>
                                    )}

                                    {soap.data.order_data.order_data.additions != undefined && Object.keys(soap.data.order_data.order_data.additions).length > 0 && (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">追加指示等</div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {Object.keys(soap.data.order_data.order_data.additions).map(addition=>{
                                              return (
                                                <div key={addition}>{soap.data.order_data.order_data.additions[addition].name}</div>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {(soap.data.done_order == 3 || soap.data.done_order == 1) && soap.data.order_data.order_data.done_comment != undefined && soap.data.order_data.order_data.done_comment != "" && (
                                      <div className="flex between drug-item table-row">                                    
                                        <div className="text-left">
                                          <div className="table-item">採取実施コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.done_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.category === '注射' || soap.category === '処方') && this.getStatusShowDelete('prescription', soap.is_enabled) && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.is_done || soap.is_enabled === 2) ? ' doned ' : ''} ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}  ${this.getPresAndInjectClassFromCache(soap)}`}>
                                <div                                  
                                  onDoubleClick={e => this.doubleClick(e, index, soap.category === "処方" ? "prescription" : "injection", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                                >
                                  {soap.data.order_data.order_data.length > 0 && soap.data.order_data.order_data.map((item, key)=>{                                    
                                    let sameKeys = soap.category === "処方" ? this.getCheckSameOptions(item) : "";
                                    let sameOptions = soap.category === "処方" && sameKeys != undefined && sameKeys != "" ? this.getSameOptions(item, sameKeys) : "";                                    
                                    let sameOptionsView;                                    
                                    if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "" && soap.category === "処方") {                                         
                                      sameOptionsView = (
                                        <SameOptionsNew sameOptions={sameOptions} keyNames={keyName_rp} />
                                      );               
                                      let noExistRpOptions = 0;
                                      sameOptions.map(option=>{        
                                        let key = Object.keys(option)[0];        
                                        if (key == "one_dose_package") {          
                                          if (option['one_dose_package'] == undefined || option['one_dose_package'] == null || option['one_dose_package'] == 0) {
                                            noExistRpOptions ++;
                                          }
                                        }
                                        if (key == "temporary_medication") {          
                                          if (option['temporary_medication'] == undefined || option['temporary_medication'] == null || option['temporary_medication'] == 0) {
                                            noExistRpOptions ++;
                                          }
                                        }
                                        if (key == "mixture") {          
                                          if (option['mixture'] == undefined || option['mixture'] == null || option['mixture'] == 0) {
                                            noExistRpOptions ++;
                                          }
                                        }
                                      })
                                      if (noExistRpOptions == 3) sameOptionsView = (<></>);                   
                                    }

                                    // 定期注射で中止登録, 中止取消メニュー flag                                    
                                    let injection_stop_register_cancel_menu = 0;
                                    if (soap.data.order_data.is_completed == 4) {
                                      if (item.stop_date != undefined && item.stop_date != null && item.stop_date != "") {
                                        injection_stop_register_cancel_menu = 2;
                                      } else {
                                        injection_stop_register_cancel_menu = 1;
                                      }
                                    }    

                                    // check 中止
                                    let stoped_injection = 0;
                                    if (soap.category == "注射" && item.stop_at != undefined && item.stop_at != "") {
                                      stoped_injection = 1;
                                    }
                                    return (
                                      <div 
                                      onContextMenu={e => this.handleClick(e, index, soap.category === "処方" ? "prescription" : "injection", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled, false, null, key, injection_stop_register_cancel_menu)}
                                      className={`history-item order-rp-object ${this.isStopOrder(item.stop_flag, item.stop_date) == 1 || stoped_injection == 1 ? "stop-rp":""}`} 
                                      key={key}
                                      >
                                        <div className="box w70p">
                                          {soap.category == '処方' && item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                            return (
                                              <>
                                                <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                  <div className="flex between">
                                                    <div className="flex full-width table-item">
                                                      <div className="number" style={underLine}>
                                                        {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                                      </div>

                                                      <div className="ml-3 full-width mr-2">
                                                        {medicine_item.item_name}
                                                        {medicine_item.amount > 0 &&
                                                        medicine_item.uneven_values !== undefined &&
                                                        medicine_item.uneven_values.length > 0 && (
                                                          <p style={textAlignRight}>
                                                            {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                          </p>
                                                        )}
                                                        {medicine_item.free_comment
                                                          ? medicine_item.free_comment.map(comment => {
                                                            return (
                                                              <p key={comment.id} style={textAlignRight}>
                                                                {comment}
                                                              </p>
                                                            );
                                                          })
                                                          : ""}                                                        
                                                      </div>
                                                    </div>
                                                    <div className="w80 table-item" style={textAlignRight}>
                                                      {" "}
                                                      {medicine_item.amount}
                                                      {medicine_item.unit}
                                                    </div>
                                                  </div>
                                                </div>
                                                {(medicine_item.can_generic_name === 1 || medicine_item.is_not_generic === 1 || (medicine_item.milling != undefined && medicine_item.milling === 1) || medicine_item.separate_packaging === 1) && (                                                  
                                                  <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                      {medicine_item.can_generic_name === 1 && (
                                                        <>&nbsp;<span style={underLine}>【一般名処方】</span></>
                                                      )}
                                                      {medicine_item.is_not_generic === 1 && (
                                                        <>&nbsp;<span style={underLine}>【後発不可】</span></>
                                                      )}
                                                      {(medicine_item.milling !== undefined && medicine_item.milling === 1) && (
                                                        <>&nbsp;<span style={underLine}>【粉砕】</span></>
                                                      )}
                                                      {medicine_item.separate_packaging === 1 && (
                                                        <>&nbsp;<span style={underLine}>【別包】</span></>
                                                      )}
                                                    </div>
                                                  </div>
                                                )}                                                      
                                              </>
                                            )
                                          })}
                                          {soap.category == '処方' && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-right">
                                                <div className="table-item">
                                                  {item.usage_name && (
                                                    <>
                                                      <label>{soap.category === '注射'? '手技:': '用法:'}</label>
                                                      <label>{item.usage_name}</label>
                                                    </>
                                                  )}
                                                </div>
                                                {item.usage_remarks_comment && soap.category != "注射" ? (
                                                  <div className="table-item remarks-comment">
                                                    {item.usage_remarks_comment.map((comment, ci) => {
                                                      return <p key={ci}>{comment}</p>;
                                                    })}
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                              <div className="w80 table-item">
                                                {item.days !== 0 && item.days !== undefined
                                                  ? item.days +
                                                  (item.days_suffix !== undefined && item.days_suffix !== ""
                                                    ? item.days_suffix
                                                    : "日分")
                                                  : ""}
                                              </div>
                                            </div>
                                          )}
                                          {soap.category == '注射' && (
                                            <div className="flex between drug-item table-row">
                                              <div className="number" style={underLine}>
                                                {" Rp" + parseInt(key + 1)}
                                              </div>
                                              <div className="text-right inject-usage">
                                                <div className="table-item">
                                                  {item.usage_name && (
                                                    <>
                                                      <label>{soap.category === '注射'? '手技:': '用法:'}</label>
                                                      <label>{item.usage_name}</label>
                                                    </>
                                                  )}
                                                </div>
                                                {item.usage_remarks_comment ? (
                                                  <div className="table-item remarks-comment">
                                                    {item.usage_remarks_comment.map((comment, ci) => {
                                                      return <p key={ci}>{comment}</p>;
                                                    })}
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                              <div className="w80 table-item">
                                                {item.days !== 0 && item.days !== undefined
                                                  ? item.days +
                                                  (item.days_suffix !== undefined && item.days_suffix !== ""
                                                    ? item.days_suffix
                                                    : "日分")
                                                  : ""}
                                              </div>
                                            </div>
                                          )}
                                          {soap.category == '処方' && sameOptionsView}
                                          {soap.category == '注射' && item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                            return (
                                              <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                <div className="flex between">
                                                  <div className="flex full-width table-item">
                                                    <div className="number">
                                                    </div>

                                                    <div className="ml-3 full-width mr-2">
                                                      {medicine_item.item_name}
                                                      {medicine_item.amount > 0 &&
                                                      medicine_item.uneven_values !== undefined &&
                                                      medicine_item.uneven_values.length > 0 && (
                                                        <p style={textAlignRight}>
                                                          {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                        </p>
                                                      )}
                                                      {medicine_item.free_comment
                                                        ? medicine_item.free_comment.map(comment => {
                                                          return (
                                                            <p key={comment.id} style={textAlignRight}>
                                                              {comment}
                                                            </p>
                                                          );
                                                        })
                                                        : ""}
                                                    </div>
                                                  </div>
                                                  <div className="w80 table-item" style={textAlignRight}>
                                                    {" "}
                                                    {medicine_item.amount}
                                                    {medicine_item.unit}
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          })}
                                          {item.is_precision !== undefined &&
                                          item.is_precision == 1 && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                【精密持続点滴】
                                              </div>
                                            </div>
                                          )}
                                          {soap.category != '注射' && item.start_date !== undefined && item.start_date !== "" && (item.administrate_period == undefined || item.administrate_period == null) && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                <label>処方開始日: </label>
                                                <label>{formatJapanDateSlash(formatDate(item.start_date))}</label>
                                              </div>
                                            </div>
                                          )}
                                          {item.administrate_period != undefined && item.administrate_period != null && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item" style={{paddingLeft:"6.5rem"}}>
                                                {soap.category == '注射' && (
                                                  <div>
                                                    1日{item.administrate_period.done_count}回 : {this.getDoneTimes(item.administrate_period.done_times)}
                                                  </div>
                                                )}
                                                <div>
                                                  投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                                </div>
                                                {item.administrate_period.period_type == 0 && item.administrate_period.period_category != null && (
                                                  <div>
                                                    間隔 : {item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月"}
                                                  </div>
                                                )}
                                                {item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0 && (
                                                  <div>
                                                    曜日 : {getWeekNamesBySymbol(item.administrate_period.period_week_days)}
                                                  </div>
                                                )}   
                                                {item.administrate_period.start_count != undefined && item.administrate_period.done_days != undefined && ( item.administrate_period.start_count != 1 || item.administrate_period.end_count != item.administrate_period.done_count) && (
                                                  <>
                                                    <div>
                                                      初回 {formatJapanDateSlash(item.administrate_period.done_days[0])}の{item.administrate_period.start_count}回目から
                                                    </div>
                                                    <div>
                                                      最終 {formatJapanDateSlash(item.administrate_period.done_days[item.administrate_period.done_days.length - 1])}の{item.administrate_period.end_count}回目まで
                                                    </div>
                                                  </>
                                                )}                                             
                                              </div>
                                              <div className="w80 table-item">
                                                {item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}
                                              </div>
                                            </div>                                                    
                                          )}
                                          {item.stop_date != undefined && item.stop_date != null && item.stop_date != "" && soap.data.order_data.is_completed == 4 && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                <span>中止日: {formatJapanDateSlash(item.stop_date)}</span>
                                                <br />
                                                <span>中止回数目: {item.stop_count}</span>                                                
                                              </div>
                                            </div>
                                          )}
                                          {item.insurance_type !== undefined && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                <label>保険: </label>
                                                <label>{this.getInsurance(item.insurance_type)}</label>
                                              </div>
                                            </div>
                                          )}
                                          {item.body_part !== undefined && item.body_part !== "" && (
                                            <div className="flex between option table-row prescription-body-part">
                                              <div className="text-right table-item">
                                                <label>部位/補足: </label>
                                                <label>{item.body_part}</label>
                                              </div>
                                            </div>
                                          )}
                                          {item.discontinuation_start_date !== undefined &&
                                          item.discontinuation_start_date !== "" && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                <label>中止期間の最初日: </label>
                                                <label>{formatDate(item.discontinuation_start_date)}</label>
                                              </div>
                                            </div>
                                          )}
                                          {item.discontinuation_end_date !== undefined &&
                                          item.discontinuation_end_date !== "" && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                <label>中止期間の最後日: </label>
                                                <label>{formatDate(item.discontinuation_end_date)}</label>
                                              </div>
                                            </div>
                                          )}
                                          {item.discontinuation_comment !== undefined &&
                                          item.discontinuation_comment !== "" && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                <label>中止コメント: </label>
                                                <label>{item.discontinuation_comment}</label>
                                              </div>
                                            </div>
                                          )}                                                                                    
                                          {soap.category === '注射' && item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-right">
                                                <div className="table-item">
                                                  {item.injectUsageName && (
                                                    <>
                                                      <label>用法:</label>
                                                      <label>{item.injectUsageName}</label>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="w80 table-item">
                                              </div>
                                            </div>
                                          )}
                                          {soap.category === '注射' && item.done_numbers != undefined && item.done_numbers != null && (item.done_numbers.length > 0 || Object.keys(item.done_numbers).length > 0) && (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-right">
                                                  <div className="table-item">
                                                    <label>実施状態:</label>
                                                    <label>{getPeriodInjectionRpDoneStatus(item.done_numbers) == 1 ? "実施済" : getPeriodInjectionRpDoneStatus(item.done_numbers) == 2 ? "実施中" : "未実施"}</label>                                                  
                                                  </div>
                                                </div>
                                                <div className="w80 table-item">
                                                </div>
                                              </div>
                                              <div className="flex between drug-item table-row prescription-body-part">
                                                <div className="text-left">
                                                  <div className="table-item">
                                                    <div>実施情報:</div>
                                                      {item.done_numbers !== undefined && Object.keys(item.done_numbers).length > 0 && Object.keys(item.done_numbers).map(done_index=>{
                                                        let done_item = item.done_numbers[done_index];
                                                        return (
                                                          <>
                                                            <div style={{paddingLeft:"1rem"}}>{formatJapanDateSlash(done_index)}</div>
                                                            {done_item.map(sub_item=>{
                                                              if (sub_item.completed_at !== undefined && sub_item.completed_at != "")
                                                              return (
                                                                <div style={{paddingLeft:"1rem"}} key={sub_item}>
                                                                  ・{sub_item.completed_at !== undefined && sub_item.completed_at !== "" ? sub_item.completed_at.substr(11, 5) : ""}&nbsp;
                                                                  {sub_item.completed_by !== undefined && sub_item.completed_by != "" && getStaffName(sub_item.completed_by) !== "" ? getStaffName(sub_item.completed_by):""}&nbsp;
                                                                  {sub_item.done_comment !== undefined ? sub_item.done_comment : ""}
                                                                </div>
                                                              )
                                                            })}
                                                          </>
                                                        )
                                                      })}
                                                  </div>
                                                </div>
                                                <div className="w80 table-item">
                                                </div>
                                              </div> 
                                            </>
                                          )}                                          
                                          {/*{soap.category === '注射' && item.usage_name != undefined && item.usage_name != null && item.usage_name != "" && (
                                            <div className="flex between drug-item table-row">
                                                <div className="text-right">
                                                    {item.usage_remarks_comment ? (
                                                        <div className="table-item remarks-comment">
                                                            {item.usage_remarks_comment.map((comment, ci) => {
                                                                return <p key={ci}>{comment}</p>;
                                                            })}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div className="w80 table-item">
                                                </div>
                                            </div>
                                          )}*/}
                                        </div>
                                      </div>
                                    )
                                  })}

                                  {soap.category === '注射' && soap.data.order_data.is_completed != 4 && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-right">
                                        {soap.data.order_data.schedule_date != undefined && soap.data.order_data.schedule_date != null && soap.data.order_data.schedule_date != "" && (
                                          <div className="table-item">
                                            <label>実施予定日: </label>
                                            <label>{formatJapanDateSlash(soap.data.order_data.schedule_date)}</label>
                                          </div>
                                        )}
                                        {soap.data != undefined && soap.data != null && soap.data.done_order == 1 && (
                                          <div className="table-item">
                                            <label>実施日時: </label>
                                            <label>{formatJapanDateSlash(soap.data.order_data.executed_date_time) + " " + soap.data.order_data.executed_date_time.substr(11, 2) + "時" + soap.data.order_data.executed_date_time.substr(14, 2) + "分"}</label>
                                          </div>
                                        )}
                                      </div>
                                      <div className="w80 table-item">
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data.location_name !== null && soap.data.order_data.location_name !== undefined && soap.data.order_data.location_name != "" && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item">
                                            <label>実施場所: </label>
                                            <label>{soap.data.order_data.location_name}</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data.drip_rate !== null && soap.data.order_data.drip_rate !== undefined && soap.data.order_data.drip_rate !== "" &&
                                  soap.data.order_data.drip_rate !== 0 && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item">
                                            <label>点滴速度: </label>
                                            <label>{soap.data.order_data.drip_rate}ml/h</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data.water_bubble !== null && soap.data.order_data.water_bubble !== undefined && soap.data.order_data.water_bubble !== "" &&
                                  soap.data.order_data.water_bubble !== 0 && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item">
                                            <label>1分あたり: </label>
                                            <label>{soap.data.order_data.water_bubble}滴</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data.exchange_cycle !== null && soap.data.order_data.exchange_cycle !== undefined && soap.data.order_data.exchange_cycle !== "" &&
                                  soap.data.order_data.exchange_cycle !== 0 && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item">
                                            <label>交換サイクル: </label>
                                            <label>{soap.data.order_data.exchange_cycle}時間</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data.require_time !== null && soap.data.order_data.require_time !== undefined && soap.data.order_data.require_time !== "" &&
                                  soap.data.order_data.require_time !== 0 && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item">
                                            <label>所要時間: </label>
                                            <label>{soap.data.order_data.require_time}時間</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data != null && soap.data.order_data.med_consult != null && soap.data.order_data.med_consult !== undefined && soap.data.order_data.med_consult == 1 && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                            <label>【お薬相談希望あり】</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data != null && soap.data.order_data.supply_med_info != null && soap.data.order_data.supply_med_info !== undefined && soap.data.order_data.supply_med_info == 1 && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                            <label>【薬剤情報提供あり】</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data != null && soap.data.order_data.potion != null && soap.data.order_data.potion !== undefined && (soap.data.order_data.potion == 0 || soap.data.order_data.potion == 1) && soap.data.order_data.is_internal_prescription == 5 && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                            <label>{soap.data.order_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data != null && soap.data.order_data.psychotropic_drugs_much_reason != null && soap.data.order_data.psychotropic_drugs_much_reason !== undefined && soap.data.order_data.psychotropic_drugs_much_reason !== "" && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                            <label>向精神薬多剤投与理由: </label>
                                            <label>{soap.data.order_data.psychotropic_drugs_much_reason}</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data != null && soap.data.order_data.poultice_many_reason != null && soap.data.order_data.poultice_many_reason !== undefined && soap.data.order_data.poultice_many_reason !== "" && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                            <label>湿布薬超過投与理由: </label>
                                            <label>{soap.data.order_data.poultice_many_reason}</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data != null && soap.data.order_data.free_comment != null && soap.data.order_data.free_comment !== undefined && soap.data.order_data.free_comment.length > 0 &&  soap.data.order_data.free_comment[0] != null && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                            <label>備考: </label>
                                            <label>{soap.data.order_data.free_comment[0]}</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}                                  
                                  {soap.data.order_data.item_details != null && soap.data.order_data.item_details.length > 0 && (
                                    <>
                                    <div className = 'function-region'>
                                    {soap.data.order_data.item_details.map(detail=>{
                                        if(detail != null){
                                          return(
                                            <>
                                              <div className='function-region-name'><label>{detail.item_name}
                                                {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                {detail.format1 != null && detail.format1 != undefined && detail.format1.includes("年") && detail.format1.includes("月") ? (
                                                  <>
                                                    {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                      <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label></>
                                                    )}
                                                    {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                      <> ~ <label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label></>
                                                    )}
                                                  </>
                                                ):(
                                                  <>
                                                    {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                      <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br /></>
                                                    )}
                                                    {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                      <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br /></>
                                                    )}
                                                  </>
                                                )}
                                              </div>
                                            </>
                                          )
                                        }
                                      })}
                                    </div>
                                    </>
                                  )}                                  
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {((soap.category === "汎用オーダー" || soap.category === '管理・指導') && this.getStatusShowDelete('guidance-order', soap.is_enabled)) && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                <div
                                  onContextMenu={e => this.handleClick(e, index, "guidance-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                                  onDoubleClick={e => this.doubleClick(e, index, "guidance-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                                >
                                  <div className="history-item">
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">日付</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.treat_date === "" ? "" : formatJapanDateSlash(soap.data.order_data.order_data.treat_date)}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">保険</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment cache-insurance-name">{getInsuranceName(soap.data.order_data.order_data.insurance_name)}</div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.karte_description_name !== undefined && soap.data.order_data.order_data.karte_description_name != null && soap.data.order_data.order_data.karte_description_name !="" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">カルテ記述名称</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.karte_description_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.additions !== undefined && soap.data.order_data.order_data.additions != null && Object.keys(soap.data.order_data.order_data.additions).length > 0 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">追加指示等</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {Object.keys(soap.data.order_data.order_data.additions).map(addition=>{
                                                return(
                                                  <>
                                                    <span>{soap.data.order_data.order_data.additions[addition].name}</span><br />
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.karte_text_data !== undefined && soap.data.order_data.order_data.karte_text_data != null && soap.data.order_data.order_data.karte_text_data.length > 0 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">カルテ記述内容</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.karte_text_data.map(karte_text=>{
                                                return(
                                                  <>
                                                    <span>{karte_text.karte_text}</span><br />
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {(soap.data.order_data.order_data.comment !== undefined && soap.data.order_data.order_data.comment != null && soap.data.order_data.order_data.comment != "") && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">コメント</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.comment}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.details !== undefined && soap.data.order_data.order_data.details != null && soap.data.order_data.order_data.details.length>0 &&
                                      soap.data.order_data.order_data.details.findIndex(x=>x.is_enabled==1||x.is_enabled==undefined) > -1 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item"> </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.details.map(detail=>{
                                                if(detail.is_enabled === undefined || (detail.is_enabled !== undefined && detail.is_enabled == 1)){
                                                  return(
                                                    <>
                                                      <div><label>・{detail.item_name}
                                                        {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                        {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                          <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br /></>
                                                        )}
                                                        {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                          <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br /></>
                                                        )}
                                                      </div>
                                                    </>
                                                  )
                                                }
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.category === "リハビリ" && this.getStatusShowDelete('rehabily-order', soap.is_enabled)) && (
                            <>
                              <MedicineListWrapper font_props = {this.props.font_props}>
                                <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                  <div
                                    onContextMenu={e => this.handleClick(e, index, "rehabily-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                                    onDoubleClick={e => this.doubleClick(e, index, "rehabily-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                                  >
                                    <RehabilyOrderData rehabily_data={soap.data.order_data.order_data} font_props = {this.font_props}/>
                                  </div>
                                  <div className={'flex'}>
                                    {soap.importance_level === 100 && (
                                      <div className={'importance-level'}>【重要】</div>
                                    )}
                                    <div className={'tag-block-area'}>
                                      {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                        Object.keys(allTags[soap.number]).map((key)=>{
                                          if(allTags[soap.number][key]['is_enabled'] === 1){
                                            if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                              return (
                                                <>
                                                  <div className={'tag-block'}
                                                       style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                       onClick={() => this.openTagDetailModal(soap.number, key)}
                                                       onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                  >
                                                    {allTags[soap.number][key]['title']}
                                                  </div>
                                                </>
                                              );
                                            }
                                          }
                                        })
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </MedicineListWrapper>
                            </>
                          )}
                          {(soap.category === '放射線' && this.getStatusShowDelete('radiation-order', soap.is_enabled)) && (
                            <>
                              <MedicineListWrapper font_props = {this.props.font_props}>
                                <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                  <div
                                    onContextMenu={e => this.handleClick(e, index, "radiation-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                                    onDoubleClick={e => this.doubleClick(e, index, "radiation-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                                  >
                                    <RadiationData
                                      data = {soap.data.order_data.order_data}
                                      patientId = {this.props.patientId}
                                    />
                                  </div>
                                  <div className={'flex'}>
                                    {soap.importance_level === 100 && (
                                      <div className={'importance-level'}>【重要】</div>
                                    )}
                                    <div className={'tag-block-area'}>
                                      {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                        Object.keys(allTags[soap.number]).map((key)=>{
                                          if(allTags[soap.number][key]['is_enabled'] === 1){
                                            if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                              return (
                                                <>
                                                  <div className={'tag-block'}
                                                       style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                       onClick={() => this.openTagDetailModal(soap.number, key)}
                                                       onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                  >
                                                    {allTags[soap.number][key]['title']}
                                                  </div>
                                                </>
                                              );
                                            }
                                          }
                                        })
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </MedicineListWrapper>
                            </>
                          )}
                          {(soap.sub_category === '担当変更オーダ') && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                <div onContextMenu={e => this.handleClick(e, index, "change-responsibility", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                  <div className="history-item">
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">変更日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {(soap.data.order_data.order_data.moving_day != undefined && soap.data.order_data.order_data.moving_day != "") ?
                                              formatJapanDateSlash(soap.data.order_data.order_data.moving_day)
                                              : ""}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">診療科</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {(soap.data.order_data.order_data.prev_department_id !== undefined && soap.data.order_data.order_data.prev_department_id != soap.data.order_data.order_data.department_id)
                                              ? (soap.data.order_data.order_data.prev_department_name + " → ") : ""}{soap.data.order_data.order_data.department_name}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">主担当</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {(soap.data.order_data.order_data.prev_main_doctor !== undefined && soap.data.order_data.order_data.prev_main_doctor != soap.data.order_data.order_data.mainDoctor)
                                              ? (soap.data.order_data.order_data.prev_main_doctor_name + " → ") : ""}{soap.data.order_data.order_data.mainDoctor_name}
                                          </div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.doctors_name.length > 0 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">担当医</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.doctors_name.map(name=>{
                                                return (
                                                  <>
                                                    <p style={{margin:0}}>{name}</p>
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.nurse_id_in_charge_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">担当看護師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.nurse_id_in_charge_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.deputy_nurse_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">副担当看護師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.deputy_nurse_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {/* <div className="flex between drug-item table-row">
                                                                          <div className="text-left">
                                                                            <div className="table-item">チーム</div>
                                                                          </div>
                                                                          <div className="text-right">
                                                                            <div className="table-item remarks-comment">
                                                                              {soap.data.order_data.order_data.team_name !== undefined ? soap.data.order_data.order_data.team_name : ""}</div>
                                                                          </div>
                                                                        </div> */}
                                      {soap.data.order_data.order_data.comment != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">フリーコメント</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.comment}</div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.sub_category === '入院決定オーダ' || soap.sub_category === '入院申込オーダ') && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                <div onContextMenu={e => this.handleClick(e, index, soap.sub_category === '入院決定オーダ' ? "hospital-decision" : "hospital-apply", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                  <div className="history-item">
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{soap.data.order_data.order_data.hospital_type == "in_apply" ? "入院予定日時" : "入院日時"}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.hospital_type == "in_apply" ?
                                              (formatJapanDateSlash(soap.data.order_data.order_data.desired_hospitalization_date) + (
                                                (soap.data.order_data.order_data.desired_hospitalization_date.split(' ')[1] == undefined) ? "" :
                                                  (" " + formatTimeIE(soap.data.order_data.order_data.desired_hospitalization_date.split('-').join('/')))
                                              )) : (
                                                formatJapanDateSlash(soap.data.order_data.order_data.date_and_time_of_hospitalization)
                                                + " " + formatTimeIE(soap.data.order_data.order_data.date_and_time_of_hospitalization.split('-').join('/'))
                                              )
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">入院病名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.disease_name}</div>
                                        </div>
                                      </div>
                                      {(soap.data.order_data.order_data.purpose_array_names != undefined && soap.data.order_data.order_data.purpose_array_names.length > 0) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">入院目的</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.purpose_array_names.map(name=>{
                                                return (
                                                  <>
                                                    <p style={{margin:0}}>{name}</p>
                                                  </>
                                                )}
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {(soap.data.order_data.order_data.hospitalization_purpose_comment != undefined && soap.data.order_data.order_data.hospitalization_purpose_comment != "") && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">入院目的フリーコメント</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.hospitalization_purpose_comment}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.hospital_type == "in_apply" ? (
                                        <>
                                          {(soap.data.order_data.order_data.treatment_plan_name != undefined && soap.data.order_data.order_data.treatment_plan_name != "") && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">治療計画</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.treatment_plan_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {(soap.data.order_data.order_data.treatment_plan_comments != undefined && soap.data.order_data.order_data.treatment_plan_comments != "") && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">治療計画フリーコメント</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.treatment_plan_comments}</div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      ):(
                                        <>
                                          {(soap.data.order_data.order_data.discharge_plan_name != undefined && soap.data.order_data.order_data.discharge_plan_name != "") && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">退院計画</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.discharge_plan_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {(soap.data.order_data.order_data.discharge_plan_comment != undefined && soap.data.order_data.order_data.discharge_plan_comment != "") && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">退院計画フリーコメント</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.discharge_plan_comment}</div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      {(soap.data.order_data.order_data.path_name != undefined && soap.data.order_data.order_data.path_name != "") && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">パス</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.path_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.surgery_day != null && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">手術日</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{formatJapanDateSlash(soap.data.order_data.order_data.surgery_day)}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.surgery_name != null && soap.data.order_data.order_data.surgery_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">手術名</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.surgery_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.treatment_day != null && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">治療日</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{formatJapanDateSlash(soap.data.order_data.order_data.treatment_day)}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.treatment_name != null && soap.data.order_data.order_data.treatment_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">治療名</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.treatment_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.inspection_date != null && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">検査日</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{formatJapanDateSlash(soap.data.order_data.order_data.inspection_date)}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.inspection_name != null &&soap.data.order_data.order_data.inspection_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">検査名</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.inspection_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {(soap.data.order_data.order_data.estimated_hospitalization_period_name != undefined && soap.data.order_data.order_data.estimated_hospitalization_period_name != "") && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">推定入院期間</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.estimated_hospitalization_period_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {(soap.data.order_data.order_data.urgency_name != undefined && soap.data.order_data.order_data.urgency_name != "") && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">緊急度</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.urgency_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {(soap.data.order_data.order_data.rest_name != undefined && soap.data.order_data.order_data.rest_name != "") && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">安静度</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.rest_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {(soap.data.order_data.order_data.desired_room_type_name != undefined && soap.data.order_data.order_data.desired_room_type_name != "") && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">希望部屋種</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.desired_room_type_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">診療科</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.department_name}</div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.hospital_type == "in_decision" ? (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">病棟</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{soap.data.order_data.order_data.ward_name}</div>
                                            </div>
                                          </div>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">病室</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{soap.data.order_data.order_data.room_name}</div>
                                            </div>
                                          </div>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">病床</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{soap.data.order_data.order_data.hospital_bed_id == null ? "未指定" : soap.data.order_data.order_data.bed_name}</div>
                                            </div>
                                          </div>
                                          {(soap.data.order_data.order_data.emergency_admission_comments != undefined && soap.data.order_data.order_data.emergency_admission_comments != "") && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">緊急入院時コメント</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.emergency_admission_comments}</div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      ):(
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">第1病棟</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{soap.data.order_data.order_data.ward_name}</div>
                                            </div>
                                          </div>
                                          {(soap.data.order_data.order_data.second_ward_name != undefined && soap.data.order_data.order_data.second_ward_name != "") && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">第2病棟</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.second_ward_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {(soap.data.order_data.order_data.free_comment != undefined && soap.data.order_data.order_data.free_comment != "") && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">フリーコメント</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.free_comment}</div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      {(soap.data.order_data.order_data.bulletin_board_reference_flag == 1) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">掲示板参照</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">あり</div>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">主担当医</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.main_doctor_name}</div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.doctor_list_names != undefined && soap.data.order_data.order_data.doctor_list_names.length > 0 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">担当医</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.doctor_list_names.map(doctor_name=>{
                                                return (
                                                  <>
                                                    <p style={{margin:0}}>{doctor_name}</p>
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.nurse_id_in_charge_name != undefined && soap.data.order_data.order_data.nurse_id_in_charge_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">担当看護師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.nurse_id_in_charge_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.deputy_nurse_name != undefined && soap.data.order_data.order_data.deputy_nurse_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">副担当看護師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.deputy_nurse_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.hospital_type != "in_apply" && (
                                        <>
                                          {soap.data.order_data.order_data.route_name != undefined && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">入院経路</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.route_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {soap.data.order_data.order_data.identification_name != undefined && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">入院識別</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{soap.data.order_data.order_data.identification_name}</div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">食事開始日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{formatJapanDateSlash(soap.data.order_data.order_data.start_date)
                                          + (soap.data.order_data.order_data.start_time_classification_name != undefined ? (" ("+ soap.data.order_data.order_data.start_time_classification_name +") から開始") : "")}
                                          </div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.food_type_name != undefined && soap.data.order_data.order_data.food_type_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">食事</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.food_type_name}</div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.sub_category === '食事オーダ') && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order`}>
                                <div className="history-item" onContextMenu={e => this.handleClick(e, index, "meal-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled )}>
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">変更開始</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(soap.data.order_data.order_data.start_date) + " " +
                                          (soap.data.order_data.order_data.start_time_name != undefined ? (soap.data.order_data.order_data.start_time_name + "より") : "")}
                                        </div>
                                      </div>
                                    </div>
                                    {soap.data.order_data.order_data.start_date_to != undefined && soap.data.order_data.order_data.start_date_to != null && soap.data.order_data.order_data.start_date_to != "" && (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">変更終了</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {formatJapanDateSlash(soap.data.order_data.order_data.start_date_to) + " " +
                                                (soap.data.order_data.order_data.start_time_name_to != undefined ? (soap.data.order_data.order_data.start_time_name_to + "まで") : "")}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">食種</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.food_type_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">特別食加算</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.special_food_addition !== undefined ? soap.data.order_data.order_data.special_food_addition : "なし"}</div>
                                      </div>
                                    </div>
                                    {soap.data.order_data.order_data.staple_food_id_morning_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">主食（朝）</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.staple_food_id_morning_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.staple_food_morning_free_comment != undefined && soap.data.order_data.order_data.staple_food_morning_free_comment != null && soap.data.order_data.order_data.staple_food_morning_free_comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">朝のフリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.staple_food_morning_free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.staple_food_id_noon_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">主食（昼）</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.staple_food_id_noon_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.staple_food_noon_free_comment != undefined && soap.data.order_data.order_data.staple_food_noon_free_comment != null && soap.data.order_data.order_data.staple_food_noon_free_comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">昼のフリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.staple_food_noon_free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.staple_food_id_evening_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">主食（夕）</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.staple_food_id_evening_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.staple_food_evening_free_comment != undefined && soap.data.order_data.order_data.staple_food_evening_free_comment != null && soap.data.order_data.order_data.staple_food_evening_free_comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">夕のフリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.staple_food_evening_free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.drink_id_morning_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">飲み物（朝）</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.drink_id_morning_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.drink_id_noon_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">飲み物（昼）</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.drink_id_noon_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.drink_id_evening_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">飲み物（夕）</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.drink_id_evening_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.side_food_name != undefined && soap.data.order_data.order_data.side_food_name != null && soap.data.order_data.order_data.side_food_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">副食</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.side_food_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {/*{soap.data.order_data.order_data.breakfast_name != undefined && soap.data.order_data.order_data.breakfast_name != null && soap.data.order_data.order_data.breakfast_name != "" && (*/}
                                      {/*<div className="flex between drug-item table-row">*/}
                                        {/*<div className="text-left">*/}
                                          {/*<div className="table-item">朝食</div>*/}
                                        {/*</div>*/}
                                        {/*<div className="text-right">*/}
                                          {/*<div className="table-item remarks-comment">{soap.data.order_data.order_data.breakfast_name}</div>*/}
                                        {/*</div>*/}
                                      {/*</div>*/}
                                    {/*)}*/}
                                    {soap.data.order_data.order_data.thick_liquid_food_name !== undefined && soap.data.order_data.order_data.thick_liquid_food_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">流動食</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.thick_liquid_food_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.ingestion_method_name !== undefined && soap.data.order_data.order_data.ingestion_method_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">摂取方法</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.ingestion_method_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {((soap.data.order_data.order_data.thick_liquid_food_number_id_morning !== undefined && soap.data.order_data.order_data.thick_liquid_food_number_id_morning !== null && soap.data.order_data.order_data.thick_liquid_food_number_id_morning !== "") || 
                                    (soap.data.order_data.order_data.thick_liquid_food_number_id_noon !== undefined && soap.data.order_data.order_data.thick_liquid_food_number_id_noon !== null && soap.data.order_data.order_data.thick_liquid_food_number_id_noon !== "") || 
                                    (soap.data.order_data.order_data.thick_liquid_food_number_id_evening !== undefined && soap.data.order_data.order_data.thick_liquid_food_number_id_evening !== null && soap.data.order_data.order_data.thick_liquid_food_number_id_evening !== "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item"></div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{this.getMealCountLabel(soap.data.order_data.order_data.thick_liquid_food_number_name_morning, soap.data.order_data.order_data.thick_liquid_food_number_name_noon, soap.data.order_data.order_data.thick_liquid_food_number_name_evening)}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.milk_name !== undefined && soap.data.order_data.order_data.milk_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">ミルク食</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.milk_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.serving_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">配膳先</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.serving_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.meal_comment.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.meal_comment.map(comment=>{
                                              return (
                                                <>
                                                  <p style={{margin:0}}>{comment.name}</p>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.free_comment != null && soap.data.order_data.order_data.free_comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.sub_category === '外泊・外出') && (
                            <>
                              <MedicineListWrapper font_props = {this.props.font_props}>
                                <div className={`history-item soap-data-item open order`}>
                                  <div onContextMenu={e => this.handleClick(e, index, "change-responsibility", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                    <div className="history-item">
                                      <div className="phy-box w70p">
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">配膳停止日</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {formatJapanDateSlash(soap.data.order_data.order_data.stop_serving_date)+
                                              " ("+soap.data.order_data.order_data.stop_serving_time_class_name+")"}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">外出泊理由</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.going_out_name}</div>
                                          </div>
                                        </div>
                                        {soap.data.order_data.order_data.stop_serving_comment != null && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">フリーコメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{soap.data.order_data.order_data.stop_serving_comment}</div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={'flex'}>
                                    {soap.importance_level === 100 && (
                                      <div className={'importance-level'}>【重要】</div>
                                    )}
                                    <div className={'tag-block-area'}>
                                      {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                        Object.keys(allTags[soap.number]).map((key)=>{
                                          if(allTags[soap.number][key]['is_enabled'] === 1){
                                            if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                              return (
                                                <>
                                                  <div className={'tag-block'}
                                                       style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                       onClick={() => this.openTagDetailModal(soap.number, key)}
                                                       onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                  >
                                                    {allTags[soap.number][key]['title']}
                                                  </div>
                                                </>
                                              );
                                            }
                                          }
                                        })
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </MedicineListWrapper>
                            </>
                          )}
                          {(soap.sub_category === '外泊実施' || soap.sub_category === '帰院実施') && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                <div className="history-item" onContextMenu={e => this.handleClick(e, index,
                                  soap.sub_category === '外泊実施' ? "hospital-going-out" : "hospital-going-in", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">実施日時</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(soap.data.order_data.order_data.treat_date.split(" ")[0])+" "+soap.data.order_data.order_data.treat_date.split(" ")[1]}
                                        </div>
                                      </div>
                                    </div>
                                    {soap.sub_category === '外泊実施' && (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">外出泊理由</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.going_out_name}</div>
                                          </div>
                                        </div>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">配膳停止</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {formatJapanDateSlash(soap.data.order_data.order_data.stop_serving_date)
                                              +" （"+soap.data.order_data.order_data.stop_serving_time_name+"）"}より停止
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">配膳開始</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(soap.data.order_data.order_data.start_date)+" （"+soap.data.order_data.order_data.start_time_name+"）"}より開始
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.sub_category === '退院実施' || soap.sub_category === '退院決定' || soap.sub_category === '退院許可') && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                <div
                                  className="history-item"
                                  onContextMenu={e => this.handleClick(e, index,
                                    soap.sub_category === '退院実施' ? "discharge-done" : (soap.sub_category === '退院決定' ? "discharge-decision" : "discharge-permit"),
                                    soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                                >
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">{soap.sub_category === '退院実施' ? "実施日時" : (soap.sub_category === '退院決定' ? "退院日時" : "退院日")}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {soap.sub_category === "退院許可" ?
                                            (soap.data.order_data.order_data.discharge_date !== "" ? formatJapanDateSlash(soap.data.order_data.order_data.discharge_date) : "")
                                            :(formatJapanDateSlash(soap.data.order_data.order_data.treat_date.split(" ")[0])+" "+soap.data.order_data.order_data.treat_date.split(" ")[1])}
                                        </div>
                                      </div>
                                    </div>
                                    {soap.sub_category !== "退院許可" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">配膳停止</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {formatJapanDateSlash(soap.data.order_data.order_data.start_date)
                                            +" （"+soap.data.order_data.order_data.start_time_name+"）"}より停止
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">転帰理由</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.outcome_reason_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">退院経路</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.discharge_route_name}</div>
                                      </div>
                                    </div>
                                    {(soap.sub_category != "退院許可" && soap.data.order_data.order_data.discharge_free_comment != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.discharge_free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                    {(soap.sub_category == "退院許可" && soap.data.order_data.order_data.free_comment != undefined && soap.data.order_data.order_data.free_comment != null &&
                                      soap.data.order_data.order_data.free_comment !="") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.sub_category === '入院実施') && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                <div className="history-item" onContextMenu={e => this.handleClick(e, index, "hospital-done", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">実施日時</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(soap.data.order_data.order_data.treat_date.split(" ")[0])+" "+soap.data.order_data.order_data.treat_date.split(" ")[1]}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">病棟</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.ward_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">病室</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.room_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">ベッド</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.bed_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">配膳開始</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(soap.data.order_data.order_data.start_date)
                                          +" （"+soap.data.order_data.order_data.start_time_name+"）"}より開始
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div
                                                  className={'tag-block'}
                                                  style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                  onClick={() => this.openTagDetailModal(soap.number, key)}
                                                  onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.sub_category === '転棟・転室実施') && (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                <div className="history-item" onContextMenu={e => this.handleClick(e, index, "hospital-move-bed", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">実施日時</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(soap.data.order_data.order_data.treat_date.split(" ")[0])+" "+soap.data.order_data.order_data.treat_date.split(" ")[1]}
                                        </div>
                                      </div>
                                    </div>
                                    {soap.data.order_data.order_data.department_name !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">診療科</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.department_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">病棟</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.ward_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">病室</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.room_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">ベッド</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.bed_name}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div
                                                  className={'tag-block'}
                                                  style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                  onClick={() => this.openTagDetailModal(soap.number, key)}
                                                  onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          )}
                          {(soap.sub_category === '帰院') && (
                            <>
                              <MedicineListWrapper font_props = {this.props.font_props}>
                                <div className={`history-item soap-data-item open order`}>
                                  <div onContextMenu={e => this.handleClick(e, index, "change-responsibility", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                    <div className="history-item">
                                      <div className="phy-box w70p">
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">配膳開始日</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {formatJapanDateSlash(soap.data.order_data.order_data.start_date)+
                                              " ("+soap.data.order_data.order_data.start_time_classification_name+")"}
                                            </div>
                                          </div>
                                        </div>
                                        {soap.data.order_data.order_data.start_comment != null && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">フリーコメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{soap.data.order_data.order_data.start_comment}</div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={'flex'}>
                                    {soap.importance_level === 100 && (
                                      <div className={'importance-level'}>【重要】</div>
                                    )}
                                    <div className={'tag-block-area'}>
                                      {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                        Object.keys(allTags[soap.number]).map((key)=>{
                                          if(allTags[soap.number][key]['is_enabled'] === 1){
                                            if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                              return (
                                                <>
                                                  <div className={'tag-block'}
                                                       style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                       onClick={() => this.openTagDetailModal(soap.number, key)}
                                                       onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                  >
                                                    {allTags[soap.number][key]['title']}
                                                  </div>
                                                </>
                                              );
                                            }
                                          }
                                        })
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </MedicineListWrapper>
                            </>
                          )}
                          {(soap.sub_category === '診察済記録オーダ') && (
                            <>
                              <MedicineListWrapper font_props = {this.props.font_props}>
                                <div className={`history-item soap-data-item open order`}>
                                  <div className="history-item" onContextMenu={e => this.handleClick(e, index, "medical-examination-record", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">診療コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">会計あり</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </MedicineListWrapper>
                            </>
                          )}
                          {(soap.sub_category === '文書') && (
                            <>
                              <MedicineListWrapper font_props = {this.props.font_props}>
                                <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                  <div className="history-item" onContextMenu={e => this.handleClick(e, index, "document-create", (soap.is_enabled === 2 || soap.isDeleted), soap.is_enabled, soap.data.order_data.order_data.import_file)}>
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">文書伝票</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.slip_name !== undefined ? soap.data.order_data.order_data.slip_name : "未分類"}</div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.name !== undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">書類名</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.scanner_title !== undefined && soap.data.order_data.order_data.scanner_title != null && soap.data.order_data.order_data.scanner_title.trim() != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">タイトル</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.scanner_title}</div>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">ファイルパス</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.file_path}</div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.free_comment !== undefined && soap.data.order_data.order_data.free_comment !== "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">フリーコメント</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.free_comment}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className={'flex'}>
                                    {soap.importance_level === 100 && (
                                      <div className={'importance-level'}>【重要】</div>
                                    )}
                                    <div className={'tag-block-area'}>
                                      {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                        Object.keys(allTags[soap.number]).map((key)=>{
                                          if(allTags[soap.number][key]['is_enabled'] === 1){
                                            if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                              return (
                                                <>
                                                  <div
                                                    className={'tag-block'}
                                                    style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                    onClick={() => this.openTagDetailModal(soap.number, key)}
                                                    onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                  >
                                                    {allTags[soap.number][key]['title']}
                                                  </div>
                                                </>
                                              );
                                            }
                                          }
                                        })
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </MedicineListWrapper>
                            </>
                          )}
                          {(soap.sub_category === '退院時指導レポート') && (
                            <>
                              <MedicineListWrapper font_props = {this.props.font_props}>
                                <div className={`history-item soap-data-item open order`}>
                                  <div className="history-item" onContextMenu={e => this.handleClick(e, index, "hospital-discharge-guidacne-report", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">日時</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {formatJapanDateSlash(soap.data.order_data.order_data.start_date)+" "+soap.data.order_data.order_data.start_time+'～'+soap.data.order_data.order_data.end_time}
                                          </div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.write_staff_name !== undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">記載者</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.write_staff_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.hospital_doctor_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院内】医師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.hospital_doctor_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.nurse_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院内】看護師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.nurse_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.discharge_support_nurse_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院内】退院支援看護師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.discharge_support_nurse_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.msw_text != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院内】ＭＳＷ</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.msw_text}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.hospital_other_text != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院内】その他</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.hospital_other_text}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.instructed_nurse_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院外】在宅医or指示を受けた看護師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.instructed_nurse_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.visit_nurse_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院外】訪問看護師</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.visit_nurse_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.care_manager_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院外】ケアマネージャー</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.care_manager_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.outside_hospital_other_text != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【院外】その他</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.outside_hospital_other_text}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.recheck != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">病状・病期の説明と患者・家族の理解の再確認</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.recheck}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.check_inject_names != undefined && soap.data.order_data.order_data.check_inject_names.length > 0 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【薬・注射】</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.check_inject_names.map((name, index)=>{
                                                return (
                                                  <>
                                                    <span>{index == 0 ? name : ("、"+name)}</span>
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.check_equipment_names != undefined && soap.data.order_data.order_data.check_equipment_names.length > 0 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【医療機器】</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.check_equipment_names.map((name, index)=>{
                                                return (
                                                  <>
                                                    <span>{index == 0 ? name : ("、"+name)}</span>
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {((soap.data.order_data.order_data.check_treat_names != undefined && soap.data.order_data.order_data.check_treat_names.length > 0)
                                        || soap.data.order_data.order_data.treat_check_other_text != undefined) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【医療処置】</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.check_treat_names != undefined && soap.data.order_data.order_data.check_treat_names.length > 0 && (
                                                soap.data.order_data.order_data.check_treat_names.map((name, index)=> {
                                                  return (
                                                    <>
                                                      <span>{index == 0 ? name : ("、"+name)}</span>
                                                    </>
                                                  )
                                                })
                                              )}
                                              {soap.data.order_data.order_data.treat_check_other_text != undefined && (
                                                <span>
                                                {(soap.data.order_data.order_data.check_treat_names != undefined && soap.data.order_data.order_data.check_treat_names.length > 0) ? "、" : ""}
                                                  {soap.data.order_data.order_data.treat_check_other_text}
                                              </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.medicine_detail != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">詳細</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.medicine_detail}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.need_medicine != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">必要な医薬物品（製品名）・調達先</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.need_medicine}</div>
                                          </div>
                                        </div>
                                      )}
                                      {((soap.data.order_data.order_data.check_body_assistance_names != undefined && soap.data.order_data.order_data.check_body_assistance_names.length > 0)
                                        || soap.data.order_data.order_data.body_assistance_check_other_text != undefined) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">身体援助</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.check_body_assistance_names != undefined && soap.data.order_data.order_data.check_body_assistance_names.length > 0 && (
                                                soap.data.order_data.order_data.check_body_assistance_names.map((name, index)=> {
                                                  return (
                                                    <>
                                                      <span>{index == 0 ? name : ("、"+name)}</span>
                                                    </>
                                                  )
                                                })
                                              )}
                                              {soap.data.order_data.order_data.body_assistance_check_other_text != undefined && (
                                                <span>
                                                {(soap.data.order_data.order_data.check_body_assistance_names != undefined && soap.data.order_data.order_data.check_body_assistance_names.length > 0) ? "、" : ""}
                                                  {soap.data.order_data.order_data.body_assistance_check_other_text}
                                              </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.future_treatment_issue != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">今後の治療課題・生活課題</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.future_treatment_issue}</div>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【退院後(一ヶ月以内）病院看護師の訪問指導】</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.nurse_visit_guidance == 1 ? "有" : "無"}</div>
                                        </div>
                                      </div>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【退院直後・特別指示書での訪問看護の必要性】</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.visit_nurse_need == 1 ? "有" : "無"}</div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.discharge_date != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">退院予定日</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {formatJapanDateSlash(soap.data.order_data.order_data.discharge_date)}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.move_tool != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">移送手段</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.move_tool}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.nurse_taxi_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">介護タクシー</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.nurse_taxi_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.discharge_after_doctor_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">退院後の主治医</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.discharge_after_doctor_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.home_doctor_name != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">在宅医</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.home_doctor_name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.visit_nurse_period_first != undefined && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【訪問看護指示書】</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.visit_nurse_period_first+"～"+soap.data.order_data.order_data.visit_nurse_period_second}ヶ月
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {(soap.data.order_data.order_data.general_hospital_check == 1 || soap.data.order_data.order_data.body_assistance_check_other_text != undefined) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">【緊急時対応】</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.order_data.general_hospital_check == 1 ? "県立総合病院" : ""}
                                              {soap.data.order_data.order_data.body_assistance_check_other_text != undefined ?
                                                (soap.data.order_data.order_data.general_hospital_check == 1 ? "、"+soap.data.order_data.order_data.body_assistance_check_other_text
                                                  : soap.data.order_data.order_data.body_assistance_check_other_text)
                                                : ""}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.order_data.send_information == 1 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">病院⇔ステーション</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">１週間～１ヶ月の間に、別紙にて情報の送信をお願いいたします</div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className={'flex'}>
                                    {soap.importance_level === 100 && (
                                      <div className={'importance-level'}>【重要】</div>
                                    )}
                                    <div className={'tag-block-area'}>
                                      {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                        Object.keys(allTags[soap.number]).map((key)=>{
                                          if(allTags[soap.number][key]['is_enabled'] === 1){
                                            if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                              return (
                                                <>
                                                  <div className={'tag-block'}
                                                       style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                       onClick={() => this.openTagDetailModal(soap.number, key)}
                                                       onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                  >
                                                    {allTags[soap.number][key]['title']}
                                                  </div>
                                                </>
                                              );
                                            }
                                          }
                                        })
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </MedicineListWrapper>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  }
                  else if (soap.target_table === "examination"){
                    return (
                      <div className="data-list"
                         onContextMenu={e => this.handleClick(e, index, "examination-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled )}
                         onDoubleClick={e => this.doubleClick(e, index, "examination-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                      >
                        <div className="data-title" onClick={() => this.onInspectionClicked(soap.data)}>
                          <div className={`data-item`}>
                            <div className="flex">
                              <div className="note">
                                【{karte_status_name}{soap.sub_category == "院外" && "院外"}{soap.sub_category == "院内" && "院内"}検査】
                                {' '}{formatJapanDateSlash(soap.treatment_date)}
                                {soap.is_enabled === 2 && "（削除済み）"}
                                {soap.report_flag !== undefined && soap.report_flag === 1 && " 報告済み"}
                              </div>
                            </div>
                          </div>
                          <div className={'flex'}>
                            {soap.importance_level === 100 && (
                              <div className={'importance-level'}>【重要】</div>
                            )}
                            <div className={'tag-block-area'} style={{width:soap.importance_level === 100 ? "calc(100% - 210px)" : "calc(100% - 150px)"}}>
                              {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                Object.keys(allTags[soap.number]).map((key)=>{
                                  if(allTags[soap.number][key]['is_enabled'] === 1){
                                    if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                      return (
                                        <>
                                          <div
                                            className={'tag-block'}
                                            style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                            onClick={() => this.openTagDetailModal(soap.number, key)}
                                            onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                          >
                                            {allTags[soap.number][key]['title']}
                                          </div>
                                        </>
                                      );
                                    }
                                  }
                                })
                              )}
                            </div>
                            <div style={{paddingTop:"5px", paddingBottom:"5px"}}>
                              {soap.is_doctor_consented == 4 ? '(取り込みデータ)' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  else if(soap.target_table === "inspection_order" && soap.data != null && this.getStatusShowDelete(soap.data.inspection_id == 17 ? 'endoscope-order' : 'inspection-order', soap.is_enabled)){
                    return (
                      <div className={`data-list`}
                        draggable={this.getStatusCanRegister(soap.data.inspection_id == 17 ? 'endoscope-order' : 'inspection-order', (soap.isDeleted || soap.is_enabled === 2))}
                        onDragStart={e => this.onDragStartSoapEvent(e, index)}
                      >
                        <div className={`data-title ${this.getOrderTitleClassName({target_table:soap.target_table,is_doctor_consented:soap.is_doctor_consented, state:soap.data.state, is_enabled:soap.is_enabled, karte_status:soap.karte_status})}`} onClick={(e)=> this.onAngleClicked(e,index)}>
                          <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                            <div className="flex">
                              <div className="note">
                                【{karte_status_name}{soap.data != null && soap.data.inspection_id != null && soap.data.inspection_id != undefined ? getInspectionName(soap.data.inspection_id) : "生理"}】
                                <span>{this.getInspectionStatus(soap.data.inspection_id, soap.data.state, soap.is_enabled, soap.data.order_data.order_data)}</span>
                              </div>
                              <div className="department text-right">{soap.medical_department_name}</div>
                            </div>
                            <div className="date">
                              {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                            </div>
                            <Angle className="angle" icon={faAngleDown} />
                          </div>
                          {soap.data !== undefined && soap.data != null && soap.data.history !== "" && soap.data.history !== null ? (
                            <div className="history-region text-right middle-title">
                              <span onClick={() => this.openInspectionHistoryModal(soap.number, soap.data.history)} className="version-span">{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[0]}版</span>
                              <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[1]}</span>
                            </div>
                          ):(
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(0, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented)}
                            </div>
                          )}
                          <div className="doctor-name text-right low-title">
                            {this.getDoctorName(soap.is_doctor_consented, soap.doctor_name)}
                          </div>
                          {soap != undefined && soap != null && soap.visit_place_id != undefined && soap.visit_place_id > 0 && (
                            <div className="doctor-name text-right low-title facility-border">{this.getVisitPlaceName(soap.visit_place_id)}</div>
                          )}
                        </div>
                        <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                          <MedicineListWrapper font_props = {this.props.font_props}>
                            <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2 || soap.isStopped || soap.is_enabled === 4) ? ' deleted ' : ''}`}>
                              <div
                                onContextMenu={e => this.handleClick(e, index, "inspection-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled, soap.isStopped, soap.data.inspection_id)}
                                onDoubleClick={e => this.doubleClick(e, index, soap.data.inspection_id == 17 ? 'endoscope-order' : 'inspection-order', (soap.is_enabled === 2 || soap.isDeleted || soap.isStopped), soap.is_enabled)}
                              >
                                <div className="history-item">
                                  <div className="phy-box w70p">
                                    {soap.data.order_data.order_data.multi_reserve_flag != 1 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.inspection_DATETIME === "日未定" ? "[日未定]" : (formatJapanDateSlash(soap.data.order_data.order_data.inspection_DATETIME)
                                              + ((soap.data.order_data.order_data.reserve_time !== undefined && soap.data.order_data.order_data.reserve_time !== "") ? " " + soap.data.order_data.order_data.reserve_time : "")
                                            )}
                                            {soap.data.order_data.order_data.is_emergency == 1 && renderHTML("<span className='note-red'>[当日緊急]</span>")}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">保険</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{getInsuranceName(soap.data.order_data.order_data.insurance_name)}</div>
                                      </div>
                                    </div>
                                    {soap.data.order_data.order_data.classification1_name !== undefined && soap.data.order_data.order_data.classification1_name != null && soap.data.order_data.order_data.classification1_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査種別</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.classification1_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.classification2_name != undefined && soap.data.order_data.order_data.classification2_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査詳細</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.classification2_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {/* ---------- start 内視鏡------------- */}
                                    {soap.data.order_data.order_data.inspection_type_name != undefined && soap.data.order_data.order_data.inspection_type_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査種別</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.inspection_type_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.inspection_item_name != undefined && soap.data.order_data.order_data.inspection_item_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査項目</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.inspection_item_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.endoscope_purpose_name != undefined && soap.data.order_data.order_data.endoscope_purpose_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査目的</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.endoscope_purpose_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {/* ----------- end ------------ */}
                                    {soap.data.order_data.order_data.inspection_purpose !== undefined && soap.data.order_data.order_data.inspection_purpose != null && soap.data.order_data.order_data.inspection_purpose.length > 0 && (
                                      soap.data.order_data.order_data.inspection_purpose.map((item, index)=>{
                                        return (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{index == 0 ? "検査目的" : ""}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{item.name}</div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      })
                                    )}
                                    {soap.data.order_data.order_data.inspection_symptom !== undefined && soap.data.order_data.order_data.inspection_symptom != null && soap.data.order_data.order_data.inspection_symptom.length > 0 && (
                                      soap.data.order_data.order_data.inspection_symptom.map((item, index)=>{
                                        return (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{index == 0 ? "現症" : ""}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{item.name}</div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      })
                                    )}
                                    {soap.data.order_data.order_data.inspection_risk != undefined && soap.data.order_data.order_data.inspection_risk != null && soap.data.order_data.order_data.inspection_risk.length > 0 && (
                                      soap.data.order_data.order_data.inspection_risk.map((item, index)=>{
                                        return (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{index == 0 ? "冠危険因子" : ""}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{item.name}</div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      })
                                    )}
                                    {soap.data.order_data.order_data.inspection_sick !== undefined && soap.data.order_data.order_data.inspection_sick != null && soap.data.order_data.order_data.inspection_sick.length > 0 && (
                                      soap.data.order_data.order_data.inspection_sick.map((item, index)=>{
                                        return (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{index == 0 ? item.title : ""}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{item.name}</div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      })
                                    )}
                                    {soap.data.order_data.order_data.inspection_request !== undefined && soap.data.order_data.order_data.inspection_request != null && soap.data.order_data.order_data.inspection_request.length > 0 && (
                                      soap.data.order_data.order_data.inspection_request.map((item, index)=>{
                                        return (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{index == 0 ? item.title : ""}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{item.name}</div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      })
                                    )}
                                    {soap.data.order_data.order_data.is_anesthesia !== undefined && soap.data.order_data.order_data.is_anesthesia != null && soap.data.order_data.order_data.is_anesthesia.length > 0 && (
                                      soap.data.order_data.order_data.is_anesthesia.map((item, index)=>{
                                        return (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{index == 0 ? item.title : ""}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{item.name}</div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      })
                                    )}
                                    {soap.data.order_data.order_data.is_sedation !== undefined && soap.data.order_data.order_data.is_sedation != null && soap.data.order_data.order_data.is_sedation.length > 0 && (
                                      soap.data.order_data.order_data.is_sedation.map((item, index)=>{
                                        return (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{index == 0 ? item.title : ""}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{item.name}</div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      })
                                    )}
                                    {/* --------------------- end --------------- */}
                                    {soap.data.order_data.order_data.inspection_movement !== undefined && soap.data.order_data.order_data.inspection_movement != null && soap.data.order_data.order_data.inspection_movement.length > 0 && (
                                      soap.data.order_data.order_data.inspection_movement.map((item, index)=>{
                                        return (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{index == 0 ? "患者移動形態" : ""}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{item.name}</div>
                                              </div>
                                            </div>
                                          </>
                                        )
                                      })
                                    )}
                                    {(soap.data.order_data.order_data.done_height !== undefined
                                      || (soap.data.order_data.order_data.height !== undefined && soap.data.order_data.order_data.height != null && soap.data.order_data.order_data.height != "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">身長</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.done_height !== undefined
                                              ? soap.data.order_data.order_data.done_height :soap.data.order_data.order_data.height}cm
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {(soap.data.order_data.order_data.done_weight !== undefined
                                      || (soap.data.order_data.order_data.weight !== undefined && soap.data.order_data.order_data.weight != null && soap.data.order_data.order_data.weight != "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">体重</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.done_weight !== undefined
                                              ? soap.data.order_data.order_data.done_weight : soap.data.order_data.order_data.weight}kg
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {(soap.data.order_data.order_data.done_surface_area !== undefined
                                      || (soap.data.order_data.order_data.surface_area !== undefined && soap.data.order_data.order_data.surface_area != null && soap.data.order_data.order_data.surface_area != "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">体表面積</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.done_surface_area !== undefined
                                              ? soap.data.order_data.order_data.done_surface_area : soap.data.order_data.order_data.surface_area}㎡
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.connection_date_title !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{soap.data.order_data.order_data.connection_date_title}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{formatJapanDateSlash(soap.data.order_data.order_data.calculation_start_date)}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.sick_name != undefined && soap.data.order_data.order_data.sick_name != null && soap.data.order_data.order_data.sick_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">臨床診断、病名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.sick_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.etc_comment != undefined && soap.data.order_data.order_data.etc_comment != null && soap.data.order_data.order_data.etc_comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">
                                            <p>主訴、臨床経過</p>
                                            <p>検査目的、コメント</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.etc_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.special_presentation != undefined && soap.data.order_data.order_data.special_presentation != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">特殊指示</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.special_presentation}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.count != undefined && soap.data.order_data.order_data.count != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{soap.data.order_data.order_data.count_label !=''?soap.data.order_data.order_data.count_label:''}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.count}{soap.data.order_data.order_data.count_suffix!=''?soap.data.order_data.order_data.count_suffix:''}</div>
                                        </div>
                                      </div>
                                    )}
                                    {((soap.data.order_data.order_data.done_body_part !== undefined && soap.data.order_data.order_data.done_body_part !== "")
                                      || (soap.data.order_data.order_data.done_body_part === undefined && soap.data.order_data.order_data.body_part !== undefined && soap.data.order_data.order_data.body_part !== "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">部位指定コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={'table-item remarks-comment'}>
                                            {soap.data.order_data.order_data.done_body_part !== undefined ? soap.data.order_data.order_data.done_body_part : soap.data.order_data.order_data.body_part}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.state == 2 && (
                                      <>
                                        {soap.data.order_data.order_data.done_result !== undefined && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">結果</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {displayLineBreak(soap.data.order_data.order_data.done_result) + " " + soap.data.order_data.order_data.result_suffix}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {soap.data.order_data.order_data.done_comment !== undefined && soap.data.order_data.order_data.done_comment != null && soap.data.order_data.order_data.done_comment != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">実施コメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{displayLineBreak(soap.data.order_data.order_data.done_comment)}</div>
                                            </div>
                                          </div>
                                        )}
                                        {soap.data.order_data.order_data.details !== undefined && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item"> </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {soap.data.order_data.order_data.details.map(detail=>{
                                                  if (detail.item_id > 0){
                                                    return(
                                                      <>
                                                        <div><label>・{detail.name}
                                                          {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                          {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                            <>
                                                              {getStrLength(detail.value1) > 32 && (<br />)}
                                                              <span>{detail.value1}{detail.input_item1_unit}</span><br />
                                                            </>
                                                          )}
                                                          {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                            <>
                                                              {getStrLength(detail.value2) > 32 && (<br />)}
                                                              <span>{detail.value2}{detail.input_item2_unit}</span><br />
                                                            </>
                                                          )}
                                                        </div>
                                                      </>
                                                    )
                                                  }
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    {soap.data.image_path != null && soap.data.image_path != undefined && soap.data.image_path != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left"> </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            <a
                                              className="soap-image-title"
                                              onClick={() => this.openInspectionImageModal(soap.data.number)}
                                              style={imageButtonStyle}
                                            >
                                              画像を見る
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.additions != undefined && Object.keys(soap.data.order_data.order_data.additions).length > 0 && (
                                      <div className={`history-item soap-data-item ${soap.openTag == 1 && soap.class_name.includes('open') ? `${soap.class_name} order` : ''} ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                        <div className="phy-box w70p">
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">追加指示等</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {Object.keys(soap.data.order_data.order_data.additions).map(addition=>{
                                                  return(
                                                    <>
                                                      <span>{soap.data.order_data.order_data.additions[addition].name}</span><br />
                                                    </>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.multi_reserve_flag == 1 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施/予定情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {getMultiReservationInfo(soap.data.order_data.order_data.reserve_data, soap.data.order_data.order_data.done_numbers)}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.start_date !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">開始日時</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {formatJapanDateSlash(soap.data.order_data.order_data.start_date)
                                            + " " + formatTimeIE(new Date((soap.data.order_data.order_data.start_date).split('-').join('/')))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.continue_date !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{getInspectionMasterInfo(soap.data.inspection_id, 'performed_multiple_times_type') == 1 ? "実施情報" : "継続登録"}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {this.getContinueDate(soap.data.order_data.order_data.continue_date)}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.end_date !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">終了日時</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {formatJapanDateSlash(soap.data.order_data.order_data.end_date)
                                            + " " + formatTimeIE(new Date((soap.data.order_data.order_data.end_date).split('-').join('/')))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className={'flex'}>
                                {soap.importance_level === 100 && (
                                  <div className={'importance-level'}>【重要】</div>
                                )}
                                <div className={'tag-block-area'}>
                                  {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                    Object.keys(allTags[soap.number]).map((key)=>{
                                      if(allTags[soap.number][key]['is_enabled'] === 1){
                                        if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                          return (
                                            <>
                                              <div
                                                className={'tag-block'}
                                                style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                onClick={() => this.openTagDetailModal(soap.number, key)}
                                                onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                              >
                                                {allTags[soap.number][key]['title']}
                                              </div>
                                            </>
                                          );
                                        }
                                      }
                                    })
                                  )}
                                </div>
                              </div>
                              {this.getEnablePac(soap.data.state, soap.data.inspection_id) == true && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left"></div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      <a className="soap-image-title" onClick={()=>this.handleOpenPacs()} style={imageButtonStyle}>PACS</a>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </MedicineListWrapper>
                        </div>
                      </div>
                    )
                  }
                  else if (soap.target_table === "treat_order_header" && soap.data != null && this.getStatusShowDelete('treatment-order', soap.is_enabled)){
                    return (
                      <div className="data-list" draggable={this.getStatusCanRegister("treatment-order", (soap.isDeleted || soap.is_enabled === 2))} onDragStart={e => this.onDragStartSoapEvent(e, index)}>
                        <div className={`data-title ${this.getOrderTitleClassName({target_table:soap.target_table,is_doctor_consented:soap.is_doctor_consented, state:(soap.data.state == 1 ? 1 : 0), is_enabled:soap.is_enabled, karte_status:soap.karte_status})}`} onClick={(e)=> this.onAngleClicked(e,index)}>
                          <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                            <div className="flex">
                              <div className="note">【{soap.karte_status == 3 ? (soap.data.order_data.order_data.header.isPeriodTreatment == 1 ? "定期処置" : "入院処置") : (soap.karte_status === 2 ? "在宅処置" : "外来処置")}】
                                {soap.is_doctor_consented !== 4 && soap.data.state == 0 && (
                                  <span>未実施</span>
                                )}
                                {soap.is_doctor_consented !== 4 && soap.data.state == 2 && (
                                  <span>実施中</span>
                                )}
                                {soap.is_enabled === 2 && "（削除済み）"}
                              </div>
                              <div className="department text-right">{soap.medical_department_name}</div>
                            </div>
                            <div className="date">
                              {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                            </div>
                            <Angle className="angle" icon={faAngleDown} />
                          </div>
                          {soap.data != undefined && soap.data != null && soap.data.history !== "" && soap.data.history != undefined && soap.data.history !== null ? (
                            <div className="history-region text-right middle-title">
                              <span onClick={() => this.openTreatmentHistoryModal(soap.number, soap.data.history)} className="version-span">{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[0]}版</span>
                              <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[1]}</span>
                            </div>
                          ):(
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(0, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented)}
                            </div>
                          )}
                          <div className="doctor-name text-right low-title">
                            {this.getDoctorName(soap.is_doctor_consented, soap.doctor_name)}
                          </div>
                          {soap != undefined && soap != null && soap.visit_place_id != undefined && soap.visit_place_id > 0 && (
                            <div className="doctor-name text-right low-title facility-border">{this.getVisitPlaceName(soap.visit_place_id)}</div>
                          )}
                        </div>
                        <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                          <MedicineListWrapper font_props = {this.props.font_props}>
                          <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                            <div onContextMenu={e => this.handleClick(e, index, "treatment-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled )} onDoubleClick={e => this.doubleClick(e, index, "treatment-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                              <div className="history-item">
                                <div className="phy-box w70p">
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">処置日</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {soap.data.order_data.order_data.header.date == undefined || soap.data.order_data.order_data.header.date == null || soap.data.order_data.order_data.header.date == "" ? ""
                                          : ((soap.data.order_data.order_data.header.start_time === "" || soap.data.order_data.order_data.header.start_time === null) ? formatJapanDateSlash(soap.data.order_data.order_data.header.date)
                                            : formatJapanDateSlash(soap.data.order_data.order_data.header.date)+"  "+soap.data.order_data.order_data.header.start_time)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">保険</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {getInsuranceName(soap.data.order_data.order_data.header.insurance_name)}
                                      </div>
                                    </div>
                                  </div>
                                  {soap.data.order_data.order_data.detail.map((item)=>{
                                    return(
                                      <>
                                        {item.classification_name != undefined && item.classification_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">分類</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.classification_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {item.practice_name != undefined && item.practice_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">行為名</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment d-flex" style={{justifyContent:"space-between"}}>
                                                <span>{item.practice_name}</span>
                                                {item.quantity_is_enabled == 1 && item.quantity !== undefined && item.quantity !== "" && (
                                                  <span className="d-flex">
                                                    （<span>{item.quantity}</span>
                                                    {item.unit != null && item.unit !== "" && (
                                                      <span>{item.unit}</span>
                                                    )}）
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {item.request_name != undefined && item.request_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">請求情報</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.request_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {this.treat_order_part_position_mode != 0 && item.part_name !== undefined && item.part_name !== "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">部位</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.part_name}　{item.position_name !== undefined && item.position_name !== "" ? item.position_name : "" }</div>
                                            </div>
                                          </div>
                                        )}
                                        {item.side_name != undefined && item.side_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">左右</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.side_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {item.barcode != undefined && item.barcode != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">バーコード</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.barcode}</div>
                                            </div>
                                          </div>
                                        )}
                                        {item.surface_data != undefined && item.surface_data.length > 0 && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">面積</div>
                                            </div>
                                            <div className="text-right">
                                                {item.surface_data.length > 0 && item.surface_data.map(sub_item=> {
                                                  return (
                                                    <div key={sub_item}>
                                                      <label>{sub_item.body_part != "" ? sub_item.body_part + "：" : ""}</label>
                                                      <label style={{width: "2.5rem", fontFamily:"MS Gothic,monospace"}}>{sub_item.x_value}cm</label>
                                                      <label className="ml-1 mr-1">×</label>
                                                      <label style={{width: "2.5rem", fontFamily:"MS Gothic,monospace"}}>{sub_item.y_value}cm</label>
                                                      <label className="ml-1 mr-1">=</label>
                                                      <label style={{width: "3rem", fontFamily:"MS Gothic,monospace"}}>{sub_item.total_x_y}㎠</label>
                                                    </div>
                                                  )
                                                })}
                                                {item.surface_data.length > 1 && (
                                                  <div>合計：{item.total_surface}㎠</div>
                                                )}
                                            </div>
                                          </div>
                                        )}
                                        {(item.treat_detail_item !== undefined && item.treat_detail_item.length > 0) && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">個別指示</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {item.treat_detail_item.map(detail=>{
                                                  let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                    JSON.parse(detail['oxygen_data']) : null;
                                                  return(
                                                    <>
                                                      <div>
                                                        <label>・{detail.item_name}：</label>
                                                        <label>{detail.count}</label>
                                                        {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                          <>
                                                            <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                          </>
                                                        )}
                                                        <br />
                                                          {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                            let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                            if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                            return (
                                                              <div key={oxygen_item}>
                                                                <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                                {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                                  <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                                )}
                                                                {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                                  <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                                )}
                                                              </div>
                                                            )
                                                          })}
                                                        {detail.lot !== undefined && detail.lot != null && detail.lot !== '' && (
                                                          <>
                                                            <label>ロット:{detail.lot}</label><br />
                                                          </>
                                                        )}
                                                        {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                          <>
                                                            <label>フリーコメント:{detail.comment}</label><br />
                                                          </>
                                                        )}
                                                      </div>
                                                    </>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {item.start_date !== undefined && item.start_date !== "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">開始日</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{formatJapanDateSlash(item.start_date)}</div>
                                            </div>
                                          </div>
                                        )}
                                        {item.end_date !== undefined && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">終了日</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {formatJapanDateSlash(item.end_date)}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {item.comment !== undefined && item.comment !== "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">コメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{displayLineBreak(item.comment)}</div>
                                            </div>
                                          </div>
                                        )}
                                        {item.administrate_period != undefined && item.administrate_period != null && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">処置期間</div>
                                            </div>
                                            <div className="text-right treatment-period">
                                              <div>
                                                {item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}
                                              </div>
                                              <div>
                                                1日{item.administrate_period.done_count}回 : {this.getDoneTimes(item.administrate_period.done_times)}
                                              </div>
                                              <div>
                                                投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                              </div>
                                              {item.administrate_period.period_type == 0 && item.administrate_period.period_category != null && (
                                                <div>
                                                  間隔 : {item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月"}
                                                </div>
                                              )}
                                              {item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0 && (
                                                <div>
                                                  曜日 : {getWeekNamesBySymbol(item.administrate_period.period_week_days)}
                                                </div>
                                              )}  
                                              {item.administrate_period.start_count != undefined && item.administrate_period.done_days != undefined && ( item.administrate_period.start_count != 1 || item.administrate_period.end_count != item.administrate_period.done_count) && (
                                                <>
                                                  <div>
                                                    初回 {formatJapanDateSlash(item.administrate_period.done_days[0])}の{item.administrate_period.start_count}回目から
                                                  </div>
                                                  <div>
                                                    最終 {formatJapanDateSlash(item.administrate_period.done_days[item.administrate_period.done_days.length - 1])}の{item.administrate_period.end_count}回目まで
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </div>                                      
                                        )}
                                        {((item.treat_done_info !== undefined && item.treat_done_info.length > 0) || item.completed_at !== undefined) && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">実施情報</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                <>
                                                  {item.completed_at !== undefined && item.completed_at != null && (
                                                    <span>{item.completed_at.split("-").join("/")}　{getStaffName(item.completed_by)}</span>
                                                  )}
                                                  {item.treat_done_info !== undefined && item.treat_done_info.length > 0 && (
                                                    <>
                                                      {item.treat_done_info.map(detail=>{
                                                        let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                          JSON.parse(detail['oxygen_data']) : null;
                                                        return(
                                                          <>
                                                            <div>
                                                              <label>・{detail.item_name}：</label>
                                                              <label>{detail.count}</label>
                                                              {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                                <>
                                                                  <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                                </>
                                                              )}
                                                              <br />
                                                              {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                                let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                                if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                                return (
                                                                  <div key={oxygen_item}>
                                                                    <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                                    {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                                      <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                                    )}
                                                                    {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                                      <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                                    )}
                                                                  </div>
                                                                )
                                                              })}
                                                              {detail.lot !== undefined && detail.lot != null && detail.lot !== '' && (
                                                                <>
                                                                  <label>ロット:{detail.lot}</label><br />
                                                                </>
                                                              )}
                                                              {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                                <>
                                                                  <label>フリーコメント:{detail.comment}</label><br />
                                                                </>
                                                              )}
                                                            </div>
                                                          </>
                                                        )
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {item.done_comment !== undefined && item.done_comment !== "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">実施コメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{displayLineBreak(item.done_comment)}</div>
                                            </div>
                                          </div>
                                        )}
                                        {item.done_numbers !== undefined && Object.keys(item.done_numbers).length > 0 && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">実施情報</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                <>
                                                  {item.done_numbers !== undefined && Object.keys(item.done_numbers).length > 0 && Object.keys(item.done_numbers).map(done_index=>{
                                                    let done_item = item.done_numbers[done_index];
                                                    return (
                                                      <>
                                                        <div>{formatJapanDateSlash(done_index)}</div>
                                                        {done_item.map(sub_item=>{
                                                          if (sub_item.completed_at !== undefined && sub_item.completed_at != "")
                                                            return (
                                                              <div key={sub_item}>
                                                                ・{sub_item.completed_at !== undefined && sub_item.completed_at !== "" ? sub_item.completed_at.substr(11, 5) : ""}&nbsp;
                                                                {sub_item.done_info !== undefined && sub_item.done_info.request_name !== undefined ? sub_item.done_info.request_name: ""}&nbsp;
                                                                {sub_item.done_info !== undefined && sub_item.done_info.part_name !== undefined ? sub_item.done_info.part_name: ""}&nbsp;
                                                                {sub_item.done_info !== undefined && sub_item.done_info.position_name !== undefined ? sub_item.done_info.position_name: ""}&nbsp;
                                                                {sub_item.done_info !== undefined && sub_item.done_info.side_name !== undefined ? sub_item.done_info.side_name: ""}&nbsp;
                                                                {sub_item.done_info !== undefined && sub_item.done_info.surface_data != undefined && sub_item.done_info.surface_data.length > 0 && (
                                                                  <div className="treat-surface ml-3">
                                                                    {sub_item.done_info.surface_data.length > 0 && sub_item.done_info.surface_data.map(surface_item=> {
                                                                      return (
                                                                        <div key={surface_item}>
                                                                          <label>{surface_item.body_part != "" ? surface_item.body_part + "：" : ""}</label>
                                                                          <label style={{width: "2.5rem", fontFamily:"MS Gothic,monospace"}}>{surface_item.x_value}cm</label>
                                                                          <label className="ml-1 mr-1">×</label>
                                                                          <label style={{width: "2.5rem", fontFamily:"MS Gothic,monospace"}}>{surface_item.y_value}cm</label>
                                                                          <label className="ml-1 mr-1">=</label>
                                                                          <label style={{width: "3rem", fontFamily:"MS Gothic,monospace"}}>{surface_item.total_x_y}㎠</label>
                                                                        </div>
                                                                      )
                                                                    })}
                                                                    {sub_item.done_info.surface_data.length > 1 && (
                                                                      <div>合計：{sub_item.done_info.total_surface}㎠</div>
                                                                    )}
                                                                  </div>
                                                                )}
                                                                {sub_item.done_info !== undefined && sub_item.done_info.treat_done_info !== undefined && sub_item.done_info.treat_done_info.length > 0 && (
                                                                  <div className={"treat-done-info ml-3"}>
                                                                    {sub_item.done_info.treat_done_info.map(detail=>{
                                                                      let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                                        JSON.parse(detail['oxygen_data']) : null;
                                                                      return(
                                                                        <>
                                                                          <div>
                                                                            <label>・{detail.item_name}：</label>
                                                                            <label>{detail.count}</label>
                                                                            {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                                              <>
                                                                                <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                                              </>
                                                                            )}
                                                                            <br />
                                                                            {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                                              let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                                              if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                                              return (
                                                                                <div key={oxygen_item}>
                                                                                  <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                                                  {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                                                    <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                                                  )}
                                                                                  {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                                                    <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                                                  )}
                                                                                </div>
                                                                              )
                                                                            })}
                                                                            {detail.lot !== undefined && detail.lot != null && detail.lot !== '' && (
                                                                              <>
                                                                                <label>ロット:{detail.lot}</label><br />
                                                                              </>
                                                                            )}
                                                                            {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                                              <>
                                                                                <label>フリーコメント:{detail.comment}</label><br />
                                                                              </>
                                                                            )}
                                                                          </div>
                                                                        </>
                                                                      )
                                                                    })}
                                                                  </div>
                                                                )}
                                                                {sub_item.done_info !== undefined && sub_item.done_info.done_comment !== undefined && sub_item.done_info.done_comment !== "" && (
                                                                  <span className="ml-3">{sub_item.done_info.done_comment}</span>
                                                                )}
                                                                <span className="ml-3">{sub_item.completed_by !== undefined && sub_item.completed_by != "" && getStaffName(sub_item.completed_by) !== "" ? getStaffName(sub_item.completed_by):""}</span>
                                                              </div>
                                                            )
                                                        })}
                                                      </>
                                                    )
                                                  })}
                                                </>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )
                                  })}
                                  {soap.data.order_data.order_data.item_details !== undefined && soap.data.order_data.order_data.item_details.length>0 && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item"> </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {soap.data.order_data.order_data.item_details.map(detail=>{
                                            return(
                                              <>
                                                <div><label>{detail.item_name}
                                                  {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                  {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                    <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}{detail.unit_name1 != undefined ? detail.unit_name1 : ""}</label><br /></>
                                                  )}
                                                  {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                    <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}{detail.unit_name2 != undefined ? detail.unit_name2 : ""}</label><br /></>
                                                  )}
                                                </div>
                                              </>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {soap.data.order_data.order_data.additions != undefined && Object.keys(soap.data.order_data.order_data.additions).length > 0 && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">追加指示等</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {Object.keys(soap.data.order_data.order_data.additions).map(addition=>{
                                            return(
                                              <>
                                                <span>{soap.data.order_data.order_data.additions[addition].name}</span><br />
                                              </>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className={'flex'}>
                              {soap.importance_level === 100 && (
                                <div className={'importance-level'}>【重要】</div>
                              )}
                              <div className={'tag-block-area'}>
                                {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                  Object.keys(allTags[soap.number]).map((key)=>{
                                    if(allTags[soap.number][key]['is_enabled'] === 1){
                                      if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                        return (
                                          <>
                                            <div
                                              className={'tag-block'}
                                              style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                              onClick={() => this.openTagDetailModal(soap.number, key)}
                                              onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                            >
                                              {allTags[soap.number][key]['title']}
                                            </div>
                                          </>
                                        );
                                      }
                                    }
                                  })
                                )}
                              </div>
                            </div>
                          </div>
                        </MedicineListWrapper>
                        </div>
                      </div>
                    )
                  }
                  else if (soap.target_table === "hospital_description" && soap.data != null){
                    if(soap.data.type === "death"){ //死亡登録
                      return (
                        <div className="data-list">
                          <div
                            className={`data-title ${karte_status_name == '入院・' ? "color_hospital_description" : 'color_hospital_description_out'}`}
                            onClick={(e)=> this.onAngleClicked(e,index)}
                          >
                            <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                              <div className="flex">
                                <div className="note">【{karte_status_name}死亡登録】{soap.is_enabled === 2 && "（削除済み）"}</div>
                                <div className="department text-right">{soap.medical_department_name}</div>
                              </div>
                              <div className="date">
                                {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                  formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                              </div>
                              <Angle className="angle" icon={faAngleDown} />
                            </div>
                            {soap.data !== undefined && soap.data != null && soap.data.history !== undefined && soap.data.history !== null && soap.data.history !== "" ? (
                              <div className="history-region text-right middle-title">
                                <span className="version-span" onClick={() => this.openDeathRegisterHistoryModal(soap.number, soap.data.history)} >
                                  {this.getHistoryInfo(soap.data.history.split(",").length-1, soap.data.order_data.order_data.staff_name, soap.updated_at, 0).split('版')[0]}版
                                </span>
                                <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.data.order_data.order_data.staff_name, soap.updated_at, 0).split('版')[1]}</span>
                              </div>
                            ):(
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, soap.data.order_data.order_data.staff_name, soap.updated_at, 0)}
                              </div>
                            )}
                          </div>
                          <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order`}>
                                <div onContextMenu={e => this.handleClick(e, index, "death-register", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled )}>
                                  <div className={`history-item soap-data-item ${soap.openTag == 1 && soap.class_name.includes('open') ? `${soap.class_name} order` : ''} ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">死亡日付</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{formatJapanDateSlash(soap.data.order_data.order_data.death_date)}</div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.order_data.free_comment !== "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">フリーコメント</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.order_data.free_comment}</div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          </div>
                        </div>
                      )
                    }
                    else {
                      let body1_title = "";
                      let body2_title = "";
                      let alergy_title = "";
                      switch (soap.data.type) {
                        case "past":
                          body1_title = "既往歴";
                          body2_title = "アレルギー";
                          alergy_title = "既往歴・アレルギー";
                          break;
                        case "foodalergy":
                          body1_title = "食物アレルギー";
                          alergy_title = "食物アレルギー";
                          break;
                        case "drugalergy":
                          body1_title = "薬剤アレルギー";
                          alergy_title = "薬剤アレルギー";
                          break;
                        case "disabled":
                          body1_title = "障害情報";
                          alergy_title = "障害情報";
                          break;
                        case "vaccine":
                          body1_title = "患者ワクチン情報";
                          alergy_title = "患者ワクチン情報";
                          break;
                        case "adl":
                          body1_title = "ADL情報";
                          alergy_title = "ADL情報";
                          break;
                        case "infection":
                          body1_title = "感染症";
                          body2_title = "状態";
                          alergy_title = "感染症";
                          break;
                        case "alergy":
                          body1_title = "一般アレルギー";
                          body2_title = "状態";
                          alergy_title = "一般アレルギー";
                          break;
                        case "contraindication":
                          body1_title = "禁忌";
                          alergy_title = "禁忌";
                          break;
                        case "process_hospital":
                          body1_title = "主訴";
                          body2_title = "現病歴";
                          alergy_title = "入院までの経過";
                          break;
                        case "inter_summary":
                          body1_title = "臨床経過";
                          alergy_title = "中間サマリー";
                          body2_title = "治療方針";
                          break;
                        case "current_symptoms_on_admission":
                          alergy_title = "入院時現症";
                          body1_title = "入院時身体所見";
                          body2_title = "入院時検査所見";
                          break;
                        case "death":
                          alergy_title = "死亡情報";
                          break;
                      }
                      return (
                        <div className="data-list" draggable={this.getStatusCanRegister("hospital", (soap.isDeleted || soap.is_enabled === 2))} onDragStart={e => this.onDragStartSoapEvent(e, index)} onDoubleClick={e => this.doubleClick(e, index, "hospital", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                          <div className={`data-title ${karte_status_name == '入院・'?"color_hospital_description":'color_hospital_description_out'}`} onClick={(e)=> this.onAngleClicked(e,index)}>
                            <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                              <div className="flex">
                                <div className="note">【{karte_status_name}{alergy_title}】{soap.is_enabled === 2 && "（削除済み）"}</div>
                                <div className="department text-right">{soap.medical_department_name}</div>
                              </div>
                              <div className="date">
                                {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                  formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                              </div>
                              <Angle className="angle" icon={faAngleDown} />
                            </div>
                            {soap.data != undefined && soap.data != null && soap.data.history !== "" && soap.data.history != undefined && soap.data.history !== null ? (
                              <div className="history-region text-right middle-title">
                                <span onClick={() => this.openAllergyHistoryModal(soap.number, soap.data.history)} className="version-span">{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[0]}版</span>
                                <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[1]}</span>
                              </div>
                            ):(
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented)}
                              </div>
                            )}
                            <div className="doctor-name text-right low-title">
                              {this.getDoctorName(soap.is_doctor_consented, soap.doctor_name)}
                            </div>
                            {soap != undefined && soap != null && soap.visit_place_id != undefined && soap.visit_place_id > 0 && (
                              <div className="doctor-name text-right low-title facility-border">{this.getVisitPlaceName(soap.visit_place_id)}</div>
                            )}
                          </div>
                          <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div className={`history-item soap-data-item open order`}>
                                <div onContextMenu={e => this.handleClick(e, index, "hospital", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled )}>
                                  <div className={`history-item soap-data-item ${soap.openTag == 1 && soap.class_name.includes('open') ? `${soap.class_name} order` : ''} ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{body1_title}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{displayLineBreak(soap.data.body_1)}</div>
                                        </div>
                                      </div>
                                      {body2_title !== "" && (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">{body2_title}</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {soap.data.type === "current_symptoms_on_admission" && soap.data.order_data.order_data.optional_json !== undefined && (
                                                  <>
                                                    {soap.data.order_data.order_data.optional_json['tpha'] != 0 && (
                                                      <span className="mr-2">TPHA：{soap.data.order_data.order_data.optional_json['tpha'] == 1 ? "(+)": soap.data.order_data.order_data.optional_json['tpha'] == 2 ? "(-)" : "(±)"}</span>
                                                    )}
                                                    {soap.data.order_data.order_data.optional_json['hbs_ag'] != 0 && (
                                                      <span className="mr-2">HBs-Ag：{soap.data.order_data.order_data.optional_json['hbs_ag'] == 1 ? "(+)": soap.data.order_data.order_data.optional_json['hbs_ag'] == 2 ? "(-)" : "(±)"}</span>
                                                    )}
                                                    {soap.data.order_data.order_data.optional_json['hcv_Ab'] != 0 && (
                                                      <span className="mr-2">HCV-Ab：{soap.data.order_data.order_data.optional_json['hcv_Ab'] == 1 ? "(+)": soap.data.order_data.order_data.optional_json['hcv_Ab'] == 2 ? "(-)" : "(±)"}</span>
                                                    )}
                                                    {soap.data.order_data.order_data.optional_json['hiv'] != 0 && (
                                                      <span className="mr-2">HIV：{soap.data.order_data.order_data.optional_json['hiv'] == 1 ? "(+)": soap.data.order_data.order_data.optional_json['hiv'] == 2 ? "(-)" : "(±)"}</span>
                                                    )}
                                                    {(soap.data.order_data.order_data.optional_json['tpha'] != 0) ||
                                                    (soap.data.order_data.order_data.optional_json['hbs_ag'] != 0) ||
                                                    (soap.data.order_data.order_data.optional_json['hcv_Ab'] != 0) ||
                                                    (soap.data.order_data.order_data.optional_json['hiv'] != 0) ? (
                                                      <br />
                                                    ):(<></>)
                                                    }
                                                  </>
                                                )}
                                                {(soap.data.type === "infection" || soap.data.type === "alergy") ?
                                                  ALLERGY_STATUS_ARRAY[parseInt(soap.data.body_2)] :
                                                  displayLineBreak(soap.data.body_2)}
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          </div>
                        </div>
                      )
                    }
                  }
                  else if (soap.target_table === "diagnosis_comment" && soap.data != null){
                    return (
                      <div className="data-list" >
                        <div className="data-title" onClick={(e)=> this.onAngleClicked(e,index)}>
                          <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                            <div className="flex">
                              <div className="note">【診察コメント】{soap.is_enabled === 2 && "（削除済み）"}</div>
                              <div className="department text-right">{soap.medical_department_name}</div>
                            </div>
                            <div className="date">
                              {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                            </div>
                            <Angle className="angle" icon={faAngleDown} />
                          </div>
                          <div className="doctor-name text-right low-title">
                            {this.getDoctorName(soap.is_doctor_consented, soap.doctor_name)}
                          </div>
                        </div>
                        <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                          <MedicineListWrapper font_props = {this.props.font_props}>
                            <div className={`history-item soap-data-item open order`}>
                              <div onContextMenu={e => this.handleClick(e, index, "diagnosis-comment", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled )}>
                                <div className={`history-item soap-data-item ${soap.openTag == 1 && soap.class_name.includes('open') ? `${soap.class_name} order` : ''}`}>
                                  <div style={{paddingLeft:"5px"}}>{soap.data.diagnosis_comment}</div>
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        </div>
                      </div>
                    )
                  }
                  else if (soap.target_table === "guidance_medication_request" && soap.data != null){
                    return (
                      <div className={`data-list`} draggable={this.getStatusCanRegister("medicine-guidance-order", (soap.isDeleted || soap.is_enabled === 2))} onDragStart={e => this.onDragStartSoapEvent(e, index)}>
                        <div className={`data-title ${this.getOrderTitleClassName({target_table:soap.target_table,is_doctor_consented:soap.is_doctor_consented, done_order:soap.data.done_order, is_enabled:soap.is_enabled, karte_status:soap.karte_status})}`}
                        onClick={(e)=> this.onAngleClicked(e,index)}>
                          <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                            <div className="flex">
                              <div className="note">【{karte_status_name}服薬指導】{soap.is_enabled === 2 && "（削除済み）"}</div>
                              <div className="department text-right">{soap.medical_department_name}</div>
                            </div>
                            <div className="date">
                              {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                            </div>
                            <Angle className="angle" icon={faAngleDown} />
                          </div>
                          {soap.data != undefined && soap.data != null && soap.data.history !== "" && soap.data.history != undefined &&
                          soap.data.history !== null ? (
                            <div className="history-region text-right middle-title">
                              <span className="version-span">{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[0]}版</span>
                              <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[1]}</span>
                            </div>
                          ):(
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(0, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented)}
                            </div>
                          )}
                          <div className="doctor-name text-right low-title">
                            {this.getDoctorName(soap.is_doctor_consented, soap.doctor_name)}
                          </div>
                          {soap != undefined && soap != null && soap.visit_place_id != undefined && soap.visit_place_id > 0 && (
                            <div className="doctor-name text-right low-title facility-border">{this.getVisitPlaceName(soap.visit_place_id)}</div>
                          )}
                        </div>
                        <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                          <MedicineListWrapper font_props = {this.props.font_props}>
                            <div className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                              <div onContextMenu={e => this.handleClick(e, index, "medicine-guidance-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)} onDoubleClick={e => this.doubleClick(e, index, "medicine-guidance-order", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}>
                                <MedicineGuidanceOrderData cache_data={soap.data.order_data.order_data} />
                              </div>
                              <div className={'flex'}>
                                {soap.importance_level === 100 && (
                                  <div className={'importance-level'}>【重要】</div>
                                )}
                                <div className={'tag-block-area'}>
                                  {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                    Object.keys(allTags[soap.number]).map((key)=>{
                                      if(allTags[soap.number][key]['is_enabled'] === 1){
                                        if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                          return (
                                            <>
                                              <div className={'tag-block'}
                                                   style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                   onClick={() => this.openTagDetailModal(soap.number, key)}
                                                   onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                              >
                                                {allTags[soap.number][key]['title']}
                                              </div>
                                            </>
                                          );
                                        }
                                      }
                                    })
                                  )}
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        </div>
                      </div>
                    )
                  }
                  else if (soap.target_table === "guidance_nutrition_request" && soap.data != null){
                    return (
                      <div className={`data-list`}>
                        <div
                          className={`data-title ${this.getOrderTitleClassName({target_table:soap.target_table,is_doctor_consented:soap.is_doctor_consented, done_order:soap.data.done_order, is_enabled:soap.is_enabled, karte_status:soap.karte_status})}`}
                          onClick={(e)=> this.onAngleClicked(e,index)}>
                          <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                            <div className="flex">
                              <div className="note">【{karte_status_name}栄養指導依頼】
                                {soap.is_doctor_consented !== 4 && soap.data.done_order != 1 && (
                                  <span>未実施</span>
                                )}
                                {soap.is_enabled === 2 && "（削除済み）"}
                              </div>
                              <div className="department text-right">{soap.medical_department_name}</div>
                            </div>
                            <div className="date">
                              {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                            </div>
                            <Angle className="angle" icon={faAngleDown} />
                          </div>
                          {soap.data != undefined && soap.data != null && soap.data.history !== "" && soap.data.history !== null ? (
                            <div className="history-region text-right middle-title">
                              <span onClick={this.openGuidanceNutritionRequestHistoryModal.bind(this, soap.number, soap.data.history)} className="version-span">{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[0]}版</span>
                              <span>{this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented).split('版')[1]}</span>
                            </div>
                          ):(
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(0, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented)}
                            </div>
                          )}
                          <div className="doctor-name text-right low-title">
                            {this.getDoctorName(soap.is_doctor_consented, soap.doctor_name)}
                          </div>
                        </div>
                        <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                          <MedicineListWrapper font_props = {this.props.font_props}>
                            <div
                              className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}
                              onContextMenu={e => this.handleClick(e, index, "guidance-nutrition-request", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)}
                            >
                              <div>
                                <div className="history-item">
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">予約日時</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(soap.data.order_data.order_data.reserve_datetime.split(' ')[0])+" "+soap.data.order_data.order_data.reserve_datetime.split(' ')[1]}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">身長</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.height}cm</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">体重</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.weight}㎏</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">BMI</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.bmi}</div>
                                      </div>
                                    </div>
                                    {soap.data.order_data.order_data.request_disease_names !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">病名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.request_disease_names.map(disease_name=>{
                                              return (
                                                <>
                                                  <p style={{margin:0}}>{disease_name}</p>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">指示食種</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.food_type_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">エネルギー</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.calorie}kcal</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">塩分</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.salt_id}g</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">蛋白質</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.protein}g</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">リン</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.phosphorus_flag == 1 ? "制限あり" : "制限なし"}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">脂質</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.lipid}g</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">カリウム</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.potassium_flag == 1 ? "制限あり" : "制限なし"}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">糖質</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.sugar}g</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">水分</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.moisture}㎖</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">PFC比</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.pfc_ratio}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">P/S比</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{soap.data.order_data.order_data.ps_ratio}</div>
                                      </div>
                                    </div>
                                    {soap.data.order_data.order_data.request_content_names !== undefined && soap.data.order_data.order_data.request_content_names.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">指示内容</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.request_content_names.map(content_name=>{
                                              return (
                                                <>
                                                  <p style={{margin:0}}>{content_name}</p>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.guidance_content_other !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">指示内容のその他</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.guidance_content_other}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.importance_message_names != undefined && soap.data.order_data.order_data.importance_message_names.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">重点伝達事項</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.order_data.order_data.importance_message_names.map(message_name=>{
                                              return (
                                                <>
                                                  <p style={{margin:0}}>{message_name}</p>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.content_other !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">重点伝達事項のその他</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.content_other}</div>
                                        </div>
                                      </div>
                                    )}
                                    {soap.data.order_data.order_data.free_comment !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{soap.data.order_data.order_data.free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className={'flex'}>
                                {soap.importance_level === 100 && (
                                  <div className={'importance-level'}>【重要】</div>
                                )}
                                <div className={'tag-block-area'}>
                                  {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                    Object.keys(allTags[soap.number]).map((key)=>{
                                      if(allTags[soap.number][key]['is_enabled'] === 1){
                                        if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                          return (
                                            <>
                                              <div className={'tag-block'}
                                                   style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                   onClick={() => this.openTagDetailModal(soap.number, key)}
                                                   onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                              >
                                                {allTags[soap.number][key]['title']}
                                              </div>
                                            </>
                                          );
                                        }
                                      }
                                    })
                                  )}
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        </div>
                      </div>
                    )
                  }
                  else if(soap.target_table == 'bacillus_inspection' && soap.data != null){
                    return(
                      <div className={`data-list`}>
                        <div className={`data-title ${this.getOrderTitleClassName({target_table:soap.target_table,is_doctor_consented:soap.is_doctor_consented, state:soap.data.state, is_enabled:soap.is_enabled, karte_status:soap.karte_status})}`} onClick={(e)=> this.onAngleClicked(e,index)}>
                          <div className={`data-item ${order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? '' : 'open'}`}>
                            <div className="flex">
                              <div className="note">【細菌検査】
                                {/* {soap.is_doctor_consented !== 4 && soap.data.state == 0 && (
                                  <span>未実施</span>
                                )}
                                {soap.is_enabled === 2 && "（削除済み）"} */}
                              </div>
                              <div className="department text-right">{soap.medical_department_name}</div>
                            </div>
                            <div className="date">
                              {soap.treatment_datetime !== undefined && soap.treatment_datetime != null  && soap.treatment_datetime !== "" ?
                                formatJapanSlashDateTime(soap.treatment_datetime):formatJapanDateSlash(soap.treatment_date)}
                            </div>
                            <Angle className="angle" icon={faAngleDown} />
                          </div>
                          {soap.data != undefined && soap.data != null && soap.data.history !== "" && soap.data.history !== null ? (
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(soap.data.history.split(",").length-1, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented)}
                            </div>
                          ):(
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(0, soap.input_staff_name, soap.updated_at, soap.is_doctor_consented)}
                            </div>
                          )}
                          <div className="doctor-name text-right low-title">
                            {this.getDoctorName(soap.is_doctor_consented, soap.doctor_name)}
                          </div>
                          {soap != undefined && soap != null && soap.visit_place_id != undefined && soap.visit_place_id > 0 && (
                            <div className="doctor-name text-right low-title facility-border">{this.getVisitPlaceName(soap.visit_place_id)}</div>
                          )}
                        </div>
                        <div style={{display:order_open_data !== undefined && order_open_data != null && order_open_data[index] !== undefined && order_open_data[index] == false ? 'none' : 'block'}}>
                          {soap.sub_category != "" ? (
                            <MedicineListWrapper font_props = {this.props.font_props}>
                              <div onContextMenu={e => this.handleClick(e, index, "bacillus_inspection", soap.is_enabled === 2 || soap.isDeleted, soap.is_enabled)} className={`history-item soap-data-item open order ${(soap.isDeleted || soap.is_enabled === 2) ? ' deleted ' : ''}`}>
                                <div>
                                  <div className="history-item">
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">採取日付</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {soap.data.collected_date == "" ? "" : formatJapanDateSlash(soap.data.collected_date)}{soap.data.collected_time == "" ? "" : soap.data.collected_time}
                                          </div>
                                        </div>
                                      </div>
                                      {soap.data.order_data.gatehr_part != undefined && soap.data.order_data.gatehr_part != null && soap.data.order_data.gatehr_part != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">採取部位</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.gatehr_part.name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.material != undefined && soap.data.order_data.material != null && soap.data.order_data.material != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">材料</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.material.name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.detail_part != undefined && soap.data.order_data.detail_part != null && soap.data.order_data.detail_part != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">詳細部位情報</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.detail_part.name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.inspection_target != undefined && soap.data.order_data.inspection_target != null && soap.data.order_data.inspection_target != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">検査目的</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.inspection_target.name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.free_comment != undefined && soap.data.order_data.free_comment != null && soap.data.order_data.free_comment != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">フリーコメント</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.free_comment}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.inspection_item != undefined && soap.data.order_data.inspection_item != null && soap.data.order_data.inspection_item.length > 0 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">検査項目</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.inspection_item.map(item=> {
                                                return(
                                                  <>
                                                    <div>{item.name}</div>
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.basic_disease != undefined && soap.data.order_data.basic_disease != null && soap.data.order_data.basic_disease != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">基礎疾患</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.basic_disease.name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.travel_history != undefined && soap.data.order_data.travel_history != null && soap.data.order_data.travel_history != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">渡航履歴</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.travel_history.name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.infectious != undefined && soap.data.order_data.infectious != null && soap.data.order_data.infectious != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">推定感染症</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.infectious.name}</div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.anti_data != undefined && soap.data.order_data.anti_data != null && soap.data.order_data.anti_data != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">使用中抗菌剤</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {soap.data.order_data.anti_data.map(item=> {
                                                return(
                                                  <><div>{item.name}</div></>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {soap.data.order_data.target_bacillus != undefined && soap.data.order_data.target_bacillus != null && soap.data.order_data.target_bacillus != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">目的菌</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{soap.data.order_data.target_bacillus.name}</div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className={'flex'}>
                                  {soap.importance_level === 100 && (
                                    <div className={'importance-level'}>【重要】</div>
                                  )}
                                  <div className={'tag-block-area'}>
                                    {allTags !== undefined && allTags != null && allTags[soap.number] !== undefined && allTags[soap.number] != null && (
                                      Object.keys(allTags[soap.number]).map((key)=>{
                                        if(allTags[soap.number][key]['is_enabled'] === 1){
                                          if(allTags[soap.number][key]['public_range'] === 0 || (allTags[soap.number][key]['public_range'] === 1 && this.authInfo.user_number === allTags[soap.number][key]['updated_by'])){
                                            return (
                                              <>
                                                <div className={'tag-block'}
                                                     style={{backgroundColor:allTags[soap.number][key]['color'], color:allTags[soap.number][key]['font_color']}}
                                                     onClick={() => this.openTagDetailModal(soap.number, key)}
                                                     onContextMenu={e => this.editStickyMenu(e, soap.number, key)}
                                                >
                                                  {allTags[soap.number][key]['title']}
                                                </div>
                                              </>
                                            );
                                          }
                                        }
                                      })
                                    )}
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          ):(
                            <></>
                          )}
                        </div>
                      </div>
                    )
                  }
                })
              )}
            </div>
          </Col>
          {this.state.inspectionModal === true && (
            <InspectionResultModal
              closeModal = {this.closeModal.bind(this)}
              inspectionList = {this.state.inspectionModalContents}
              patientId={this.props.patientId}
              patient_name_kana={this.props.patientInfo.kana}
              in_hospital_header_number={this.state.in_hospital_header_number}
              out_hospital_header_number={this.state.out_hospital_header_number}
            />
          )}
          {this.state.historyModal && (
            <ChangeLogModal
              closeModal={this.closeModal}
              keyName={keyName}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              size="lg"
              category={this.state.soap_category}
            />
          )}
          {this.state.historyGuidanceModal && (
            <ChangeGuidanceLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (this.state.confirm_type != "_increasePrescription" && this.state.confirm_type != "_increaseInjection") && (
            <SystemConfirmModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_title !== "" && (this.state.confirm_type == "_increasePrescription" || this.state.confirm_type == "_increaseInjection") && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_title}
            />
          )}
          {this.state.historySoapModal && (
            <ChangeSoapLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              soap_sub_category={this.state.soap_sub_category}
              size="lg"
            />
          )}
          {this.state.historyInspectionModal && (
            <ChangeInspectionLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.historyGuidanceNutritionRequestModal && (
            <NutritionGuidanceLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.historyDocumentModal && (
            <DocumentLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.historyHospitalMoveModal && (
            <HospitalMoveHistoryModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              getDepartmentName={this.getDepartment}
            />
          )}
          {this.state.historyDeathRegisterModal && (
            <DeathRegisterHistoryModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              getDepartmentName={this.getDepartment}
            />
          )}
          {this.state.historyChangeResponsibilityModal && (
            <ChangeResponsibilityHistoryModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              getDepartmentName={this.getDepartment}
            />
          )}
          {this.state.historyInHospitalModal && (
            <InHospitalHistoryModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              getDepartmentName={this.getDepartment}
            />
          )}
          {this.state.isOpenDischargeGuidanceReportHistory && (
            <DischargeGuidanceReportHistory
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              getDepartmentName={this.getDepartment}
            />
          )}
          {this.state.historyHospitalDoneModal && (
            <HospitalDoneHistoryModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              getDepartmentName={this.getDepartment}
            />
          )}
          {this.state.historyDischargeModal && (
            <DischargeHistoryModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              getDepartmentName={this.getDepartment}
              modal_title={this.state.modal_title}
            />
          )}
          {this.state.historyHospitalGoingModal && (
            <HospitalGoingHistoryModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              getDepartmentName={this.getDepartment}
              modal_title={this.state.modal_title}
            />
          )}
          {this.state.historyTreatmentModal && (
            <ChangeTreatmentLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.historyExaminationModal && (
            <ChangeExaminationLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.historyRehabilyModal && (
            <ChangeRehabilyLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.historyRadiationModal && (
            <ChangeRadiationLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.historyAllergyModal && (
            <ChangeAllergyLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historySoapList}
              orderNumber={this.state.selectedOrderNumber}
              insuranceTypeList={this.props.patientInfo.insurance_type_list}
              getDepartmentName={this.getDepartment}
              size="lg"
            />
          )}
          {this.state.isOpenInspectionDoneModal && (
            <InspectionDoneModal
              patientId={this.props.patientId}
              closeModal={this.closeModal}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
              reception_or_done={"done"}
              from_page={'soap'}
              doneInspection={this.changeDoneState}
            />
          )}
          {this.state.isOpenRehabilyDoneModal && (
            <RehabilyOrderDoneModal
              patientId={this.props.patientId}
              closeModal={this.closeModal}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
              reception_or_done={"done"}
              from_page={'soap'}
              doneInspection={this.changeDoneState}
            />
          )}
          {this.state.isOpenGuidanceNutritionRequestDoneModal && (
            <GuidanceNutritionRequestDoneModal
              closeModal={this.closeModal}
              modal_data={this.state.done_modal_data}
              doneInspection={this.changeDoneState}
              from_page={'soap'}
            />
          )}
          {this.state.isOpenexaminDoneModal && (
            <ExaminationDoneModal
              patientId={this.props.patientId}
              closeModal={this.closeModal}
              modal_data={this.state.done_modal_data}
              from_page={'soap'}
              doneInspection={this.changeDoneState}
              done_status={'done'}
            />
          )}
          {this.state.isOpenDoneModal && (
            <DoneModal
              patientId={this.props.patientId}
              closeModal={this.closeModal}
              closeModalAndRefresh={this.closeModal}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
              patientInfo={patientInfo}
            />
          )}
          {this.state.isOpenTreatDoneModal && (
            <TreatDoneModal
              patientId={this.props.patientId}
              closeModal={this.closeModal}
              from_page={'soap'}
              modal_data={this.state.done_modal_data}
              doneInspection={this.changeDoneState}
            />
          )}
          {this.state.isOpenStopModal && (
            <StopInjectionModal
              patientId={this.props.patientId}
              closeModal={this.closeModal}
              saveAdministratePeriod={this.closeMessageModal}
              middleboxRefresh={this.changeDoneState}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
              patientInfo={patientInfo}
              rp_index={this.state.rp_index}
            />
          )}
          {this.state.isOpenRadiationModal && (
            <OrderDoneRaidationModal
              patientId={this.props.patientId}
              closeModal={this.closeModal}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
              patientInfo={patientInfo}
              reception_or_done = {'done'}
              changeDoneState = {this.changeDoneState}
            />
          )}
          {this.state.isOpenPrescriptionDoneModal && (
            <PrescriptionDoneModal
              patientId={this.props.patientId}
              patientInfo = {this.props.patientInfo}
              closeModal={this.closeMessageModal}
              donePrescription={this.changeDoneState}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
            />
          )}
          {this.state.isOpenPrescriptionIncreasePeriodModal && (
            <PrescriptionIncreasePeriodModal
              patientId={this.props.patientId}
              patientInfo = {this.props.patientInfo}
              closeModal={this.closeMessageModal}
              donePrescription={this.handleIncreasePrescription}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
            />
          )}
          {this.state.isOpenInjectionIncreasePeriodModal && (
            <InjectionIncreasePeriodModal
              patientId={this.props.patientId}
              patientInfo = {this.props.patientInfo}
              closeModal={this.closeMessageModal}
              doneInjection={this.handleIncreasePrescription}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
            />
          )}
          {this.state.isOpenTreatmentIncreasePeriodModal && (
            <TreatmentIncreasePeriodModal
              patientId={this.props.patientId}
              patientInfo = {this.props.patientInfo}
              closeModal={this.closeMessageModal}
              handleOk={this.handleIncreasePrescription}
              modal_data={this.state.done_modal_data}
            />
          )}
          {this.state.isOpenExaminationIncreasePeriodModal && (
            <AdministratePeriodInputExaminationModal
              patientId={this.props.patientId}
              patientInfo = {this.props.patientInfo}
              closeModal={this.closeMessageModal}
              handleOk={this.handleIncreasePrescription}
              modal_data={this.state.done_modal_data}
            />
          )}
          {this.state.isOpenAddTagModal && (
            <AddTagModal
              patientId={this.props.patientId}
              closeModal={this.closeModal}
              karte_tree_number={this.state.karte_tree_number}
              sub_key={this.state.sub_key}
              sticky_data={this.state.sticky_data}
              setTagData={this.setTagData}
            />
          )}
          {this.state.isOpenInspectionImageModal && (
            <EndoscopeImageModal
              closeModal={this.closeModal}
              imgBase64={this.state.endoscope_image}
            />
          )}
          {this.state.openInputExamOrder && (
            <InputExamOrderModal
              closeModal = {this.closeModal}
              handleOk={this.changeExamOrderStatus}
              exam_data = {this.state.soapList[this.state.soapIndex].data.order_data.order_data}
            />
          )}
          {this.state.openExamOrderList && (
            <ExamOrderListModal
              exam_data = {this.state.soapList[this.state.soapIndex].data.order_data.order_data}
              readExamination={this.closeExamOrderList}
            />
          )}
          {this.state.istagListModal && (
            <TagListModal
              closeModal={this.closeModal}
              sticky_note_type_id={this.state.allTags[this.state.soap_number][this.state.sub_key]['sticky_note_type_id']}
              sticky_note_types={this.state.sticky_note_types}
              system_patient_id={this.props.patientId}
            />
          )}
          {this.state.isTagDetailModal && (
            <TagDetailModal
              modal_data={this.state.sticky_note_data}
              closeModal={this.closeModal}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title={this.state.alert_title}
            />
          )}
          {this.state.alertMessage == "death" && (
            <AlertNoFocusModal
              hideModal= {this.cancelAlertModal.bind(this)}
              handleOk= {this.cancelAlertModal.bind(this)}
              showMedicineContent= {"死亡した患者です。"}
            />
          )}
          {this.state.changeDepartmentModal && (
            <DepartmentModal
              hideModal={this.handleClose}
              handleCancel={this.handleClose}
              handleChangeDeparment={this.handleChangeDeparment}
              departmentList={this.departmentOptions}
              departmentName={this.state.departmentName}
              departmentCode={this.state.departmentCode}
              departmentDate={this.state.departmentDate}
            />
          )}
          {this.state.changeKarteStatusModal && (
            <KarteStatusModal
              hideModal={this.handleClose}
              handleCancel={this.handleClose}
              handleChangeKarteStatus={this.handleChangeKarteStatus}
              karteStatusName={this.state.karteStatusName}
              karteStatusCode={this.state.karteStatusCode}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            current_date={getCurrentDate('-')}
            soapList={this.state.soapList}
            karte_mode={this.context.$getKarteMode(this.props.patientId)}
          />
          <StickyMenu
            {...this.state.stickyMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
            soap_number={this.state.soap_number}
            sub_key={this.state.sub_key}
          />
          <ContextKarteDateMenu
            {...this.state.contextKarteDateMenu}
            parent={this}
          />
          {this.state.isOpenInspectionStartEndDateTimeRegister && (
            <InspectionStartEndDateTimeRegister
              closeModal={this.closeModal}
              modal_data={this.state.inspection_info}
              modal_type={this.state.modal_type}
              from_mode={'soap'}
              setDoneInfo={this.setInspectionDateDoneInfo}
            />
          )}
          {this.state.isOpenEndoscopeReservationModal && (
            <EndoscopeReservationModal
              closeModal={this.closeModal}
              system_patient_id={this.props.patientId}
              patient_name={this.props.patientInfo.name}
              reservation_info={this.state.reservation_info}
              reserve_type={this.state.reserve_type}
              enable_multi_reserve={true}
            />
          )}
        </Wrapper>
      );
    }
  }
}
MiddleBox.contextType = Context;

MiddleBox.propTypes = {
  isLoaded: PropTypes.bool,
  soapTrees: PropTypes.array,
  soapList: PropTypes.array,
  allTags: PropTypes.array,
  updateSoapList: PropTypes.func,
  changeSoapList: PropTypes.func,
  updateSoap: PropTypes.func,
  saveConfirmMessage: PropTypes.func,
  showModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.array,
  applyRightDeleteData: PropTypes.array,
  updateIndex: PropTypes.number,
  categoryType: PropTypes.number,
  selYear: PropTypes.number,
  selMonth: PropTypes.number,
  selDay: PropTypes.number,
  setTagData:PropTypes.func,
  setImportance:PropTypes.func,
  goToDropPage: PropTypes.func,
  copyInspectionAction: PropTypes.func,
  show_list_condition: PropTypes.string,
  allDateList: PropTypes.array,
  getLastPrescription: PropTypes.func,
  getLastInjection: PropTypes.func,
  next_reservation_visit_date: PropTypes.string,
  font_props: PropTypes.number,
  refreshRightBox: PropTypes.func,
  changeAllDateList: PropTypes.func,
  closeRightClickMenu: PropTypes.func,
};

export default MiddleBox;