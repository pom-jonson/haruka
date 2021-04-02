import React, { Component, useContext } from "react";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import PropTypes from "prop-types";
import {surface,onSurface,secondary200,midEmphasis,disable} from "~/components/_nano/colors";
registerLocale("ja", ja);
import {formatDate4API, getCurrentDate, formatJapanDateSlash, formatDate, formatDateLine, formatTimeIE, getWeekNamesBySymbol, formatJapanSlashDateTime} from "~/helpers/date";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SystemConfirmModal from "../../../../molecules/SystemConfirmModal";
import Context from "~/helpers/configureStore";
import renderHTML from 'react-render-html';
import {
  CACHE_SESSIONNAMES,
  CACHE_LOCALNAMES,
  CATEGORY_TYPE,
  OPERATION_TYPE,
  WEEKDAYS,
  ALLERGY_STATUS_ARRAY,
  KARTEMODE,
  HOSPITALIZE_PRESCRIPTION_TYPE,
  EXAMINATION_TYPE,
  getStrLength,
  getInspectionName,
  getStaffName,
  getInspectionMasterInfo,
  getInsuranceName,
  getMultiReservationInfo
} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import RehabilyOrderData from "~/components/templates/Patient/Modals/Rehabilitation/RehabilyOrderData";
import RoutineInputPanel from "~/components/templates/Patient/Modals/Guidance/RoutineInputPanel";
import {displayLineBreak} from "~/helpers/dialConstants"
import $ from "jquery";
import RadioButton from "~/components/molecules/RadioInlineButton";
import DepartmentModal from "~/components/organisms/DepartmentModal";
import KarteStatusModal from "~/components/organisms/KarteStatusModal";
import ContentEditable from 'react-contenteditable'
import reactCSS from 'reactcss'
import RegisterSetModal from "~/components/organisms/RegisterSetModal";
import * as pres_methods from "~/components/templates/Patient/PrescriptionMethods";
import * as localApi from "~/helpers/cacheLocal-utils";
import MedicineGuidanceOrderData from "~/components/templates/Patient/Modals/Guidance/MedicineGuidanceOrderData";
import SameOptionsNew from "~/components/molecules/SameOptionsNew";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import axios from "axios";
import SelectMedicineModal from "~/components/templates/Patient/Modals/Common/SelectMedicineModal";
import AlergyList from "./AlergyList";
import CytologyExamOrderData from "../../Modals/Examination/CytologyExamOrderData";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemConfirmWithBtnModal from "~/components/molecules/SystemConfirmWithBtnModal";
import RadiationData from "~/components/templates/Patient/components/RadiationData";
import * as methods from "~/components/templates/Patient/SOAP/methods";
import {clipboardNutritionGuidance} from "~/components/templates/Patient/Clipboard/clipboardNutritionGuidance";
import {
  clipboardDeathRegister, clipboardPatientDescriptionInfo, clipboardInspection, clipboardDocument, clipboardApplyDecision, clipboardChangeResponsibility,
  clipboardHospitalDone, clipboardHospitalInOut, clipboardDischarge, clipboardHospitalMove, clipboardGuidance, clipboardMeal, clipboardRadiation, clipboardRehabily,
  clipboardBacillusInspection, clipboardMedicalExaminationRecord, clipboardHospitalDischargeGuidanceReport, clipboardTreatment, clipboardExamination, clipboardMedicineGuidance
} from "~/components/templates/Patient/Clipboard/createOrderClipboard";
import EndoscopeReservationModal from "~/components/templates/Patient/Modals/Common/EndoscopeReservationModal";

const Wrapper = styled.div`
  width: 100%;
  display:block;
  font-size:${props=>(props.font_props !== undefined ? 0.875 * props.font_props + 'rem':'0.875rem')};
  height: calc(100vh - 182px);
  overflow: hidden;
  .hidden {visibility: hidden;}
  .data-list{
    .table-row:nth-child(2n) {
      background: #f7f7f7 !important;
    }
  }
  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 70%;
      float: left;
      padding: 5px;
      word-break: break-all;
      border-right: 1px solid #ddd;
    }
    .function-region-value{
      width: 30%;
      float: left;
      word-break: break-all;
      padding: 5px;
    }
    label{
      word-break:break-all;
      padding-left:4px;
    }
  }
  textarea {
    width: 100%;
    resize: none;
    height: 50px;
  }
  .order{display: block !important;}
  .data-title{
    border: 1px solid rgb(213,213,213);
    background: linear-gradient(#d0cfcf, #e6e6e7);
    cursor: pointer;
    label{margin-left: 10px;}
    .department{margin-left: auto;}
  }
  .data-item{
    .flex{justify-content: flex-start;}
  }
  .line-done {color: #0000ff;}
  .order-area {
    width:100%;
    overflow-x:hidden;
    overflow-y:scroll;
    height:calc(100% - 41px);
    font-family: MS Gothic,monospace;
  }
  .order-data-area {width:100%;}
  .control-btn-area {
    align-items: flex-start;
    justify-content: space-between;
  }
  .importance-btn{
    font-size:${props=>(props.font_props !== undefined ? 0.875 * props.font_props + 'rem':'0.875rem')};
    margin-left: 0.3rem;
    margin-top: 7px;
    width: 12rem;
    .radio-btn label{
      width: 3rem;
      border: solid 1px black;
      border-radius: 0;
      margin-bottom: 5px;
      font-family: "Noto Sans JP",sans-serif;
    }
    .standard label { color: black !important; border-right:none;}
    .important label { color: red !important; border-right:none;}
    .question label { color: blue !important; border-right:none;}
    .notice label { color: green !important;}
     input:checked + label {
      background: lightgrey;
     }
  }
  .content_editable_icon {
    button {
      margin-top: 8px;
      margin-left: 0.3rem;
      width: 2.4rem;
      font-weight: bold;
      height:27px;
      line-height: 25px;
    }
    .color-icon {
      text-align: center;
      padding: 0;
    }
    .set-font-color {
      margin-bottom: 0;
      width: 100%;
      border-bottom: 2px solid;
      cursor: pointer;
      height: 100%;
      line-height: 25px;
    }
    .color_picker_area {
      .color-block-area {
        background-color: white;
        border: 1px solid #aaa;
        .flex {justify-content: start;}
      }
      .color-block {
        width: 1rem;
        margin: 0.4rem;
        height: 1rem;
        cursor: pointer;
      }
    }
    .font_select_area {
      left: 8.4rem !important;
      border: 1px solid #aaa;
      width: 2.4rem;
      text-align:center;
      border-top: none;
      .font-block-area {background-color: white;}
      .font-block {
        cursor: pointer;
        border-top: 1px solid #aaa;
        text-align: center;
      }
    }
  }
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

const InsertSoapArea = styled.div`
  width:100%;
  font-size:${props=>(props.font_props != undefined?0.875 * props.font_props + 'rem':'0.875rem')};
  display:block;
  .flex {display:flex;}
  .soap-data{
    tr:nth-child(2n) {
      background: #f7f7f7;
    }
    td{
      padding: 0px !important;
      width: calc(100% - 3.125rem);
    }
  }
  .hospitalize th{
    width: 95px !important;
    min-width: 95px !important;
    max-width: 95px !important;
    text-align: left !important;
    font-weight: normal !important;
  }
  .soap-read-mode textarea{
    background-color: #dddddd;
    pointer-events: none;
  }
  .content_editable_area {
    min-height: 40px;
    width:100%;
    word-break: break-all;
    font-family: MS Gothic,monospace;
  }
  em, i {font-family:"ＭＳ Ｐゴシック";}
  .data-input {
    width:100%;
    display:block;
    table {
      th {
        width:50px;
        min-width:50px;
        max-width:50px;
      }
      td {width: calc(100% - 54px);}
    }
  }
`;

const textAlignRight = {
  textAlign: "right"
};

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

const MedicineListWrapper = styled.div`
  font-size:${props=>(props.font_props != undefined?0.75 * props.font_props + 'rem':'0.75rem')};
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .soap-data-item.open {
    display:block !important;
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
      left: 50px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 75px;
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
      left: 12rem;
    }
    .text-left .table-item{
      width: 9.375rem;
      float: left;
      text-align: right;
    }
    .text-right .table-item{text-align: left;}
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .align-left{text-align: left;}
  .w100{width: 100%;}
  .line-through {color: #ff0000;}
  .flex {
    display: flex;
    margin-bottom: 0;
    &.between {
      justify-content: space-between;
      div {margin-right: 0;}
    }
    div {margin-right: 8px;}
    .date {
      margin-left: auto;
      margin-right: 24px;
    }
    .number {
      margin-right: 8px;
      width: 70px;
    }
  }
  .patient-name {margin-left: 16px;}
  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .number {
    margin-right: 8px;
    width: 70px;
  }
  .number .rp{text-decoration-line: underline;}
  .unit{text-align: right;}
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
  .w80 {
    text-align: right;
    width: 5rem;
    margin-left: 8px;
  }
  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .options{float: right;}
  .text-right {width: calc(100% - 88px);}
  .inject-usage{width: calc(100% - 158px);}
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 6rem);
    word-wrap: break-word;
    word-break: break-all;
  }
  .treatment-period{
    width: calc(100% - 4rem);
    margin-left: 4rem;    
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
  .hidden {display: none;}
  p {
    margin-bottom: 0;
    word-break: break-all;
  }
  .doing {
    background: #ccc !important;
    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
  .prescription-body-part{
    width: 100%;
    padding-left: 5rem;
  }
  .tb-soap{
    width: 100%;
    th{background: #f6fcfd;}
    textarea{
      background: white;
      color: black;
      height: 25px;
    }
  }
  .hospitalize th{
    width: 6rem !important;
    text-align: left !important;
    font-weight: normal !important;
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background:black;
    opacity:1;
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
    div {padding: 0.25rem 0.5rem;}
  }
  .context-menu li:hover {background-color: #2b2b2b;}
  .context-menu li > i {margin-right: 8px;}
  .blue-text {color: lightblue;}
`;

const ContextMenu = ({
    visible,
    x,
    y,
    preset_menu_array,
    preset_do_deployment_array,
    parent,
    categoryType,
    categoryOperation,
    stampKey,
    seal_print,
    content_key,
    content_type,
    create_at,
    current_date
  }) => {
  if(visible) {
    const { $canDoAction, FEATURES, AUTHS} = useContext(Context);
    let is_checked = null;
    if(categoryType != -1){
      let order_type = "";
      if(categoryType == CATEGORY_TYPE.IN_HOSPITAL_APP){
        order_type = "hospital_application";
      } else if(categoryType == CATEGORY_TYPE.IN_HOSPITAL_DEC){
        order_type = "hospital_decision";
      } else if(categoryType == CATEGORY_TYPE.DOCUMENT_CREATE){
        order_type = "document";
      } else if(categoryType == CATEGORY_TYPE.NUTRITION_GUIDANCE){
        order_type = "guidance_nutrition_order";
      } else {
        order_type = parent.getCategoryType(categoryType);
      }
      if(stampKey == null) {
        if (seal_print[order_type] !== undefined && seal_print[order_type] != null){
          is_checked = seal_print[order_type];
        }
      } else {
        if(seal_print != undefined && seal_print != null && seal_print[order_type] != undefined && seal_print[order_type][stampKey] != undefined && seal_print[order_type][stampKey] != null){
          is_checked = seal_print[order_type][stampKey];
        }
      }
    }
    let canEdit = false;
    let feature_type = '';
    switch(categoryType){
      case CATEGORY_TYPE.EXAMINATION:
      case CATEGORY_TYPE.BACILLUS:
      case CATEGORY_TYPE.INSPECTION:
        feature_type = FEATURES.EXAMORDER;
        break;
      case CATEGORY_TYPE.ENDOSCOPE:
        feature_type = FEATURES.ENDOSCOPEORDER;
        break;
      case CATEGORY_TYPE.TREATMENT:
      case CATEGORY_TYPE.HOMETREATMENT:
      case CATEGORY_TYPE.HOSPITALTREATMENT:
        feature_type = FEATURES.TREATORDER;
        break;
      case CATEGORY_TYPE.GUIDANCE:
      case CATEGORY_TYPE.NUTRITION_GUIDANCE:
      case CATEGORY_TYPE.MEDICINE_GUIDANCE:
        feature_type = FEATURES.GUIDANCEORDER;
        break;
      case CATEGORY_TYPE.RADIATION:
        feature_type = FEATURES.RADIATION;
        break;
      case CATEGORY_TYPE.REHABILY:
        feature_type = FEATURES.REHABILY;
        break;
      case CATEGORY_TYPE.INJECTION:
      case CATEGORY_TYPE.PRESCRIPTION:
        feature_type = FEATURES.PRESCRIPTION;
        break;
      case CATEGORY_TYPE.DOCUMENT_CREATE:
        feature_type = FEATURES.DOCUMENT_CREATE;
        break;
      default:
        canEdit = true;
    }
    if(categoryOperation == OPERATION_TYPE.EDIT) {
      if(feature_type !== '' && ($canDoAction(feature_type, AUTHS.EDIT) || $canDoAction(feature_type, AUTHS.EDIT_PROXY) || $canDoAction(feature_type, AUTHS.EDIT_OLD) || $canDoAction(feature_type, AUTHS.EDIT_PROXY_OLD))){
        canEdit = true;
      } else {
        canEdit = false;
      }
    } else {
      canEdit = true;
    }
    switch(content_type){
      case "soap":
        feature_type = FEATURES.SOAP;
        break;
      case "examination":
      case "bacillus":
      case "inspection":
        feature_type = FEATURES.EXAMORDER;
        break;
      case "endoscope":
        feature_type = FEATURES.ENDOSCOPEORDER;
        break;
      case "treatment":
        feature_type = FEATURES.TREATORDER;
        break;
      case "guidance":
      case "medicine_guidance":
        feature_type = FEATURES.GUIDANCEORDER;
        break;
      case "radiation":
        feature_type = FEATURES.RADIATION;
        break;
      case "rehabily":
        feature_type = FEATURES.REHABILY;
        break;
      case "prescription":
        feature_type = FEATURES.PRESCRIPTION;
        break;
      case "injection":
        feature_type = FEATURES.PRESCRIPTION;
        break;
    }
    // can 診療科修正
    // ●YJ94 保存済みレコードの入外区変更と診療科変更は権限で制限する 2020/11/10 p
    // 「診療科修正(当日)」、「診療科修正(過去)」
    let start_date = new Date(current_date);
    if (create_at !== undefined && create_at != null && create_at !== "" && create_at.length >= 10) {
      start_date = new Date(create_at.substring(0,10));
    }
    let curDate = new Date(current_date);
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
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {categoryOperation != null && (
            <li><div onClick={() => parent.contextMenuAction("doDeleteArea", categoryType, categoryOperation)} onMouseOver={e => parent.outHover(e)}>
              {categoryOperation == OPERATION_TYPE.REGIST ? "入力を破棄" :
                  (categoryOperation == OPERATION_TYPE.EDIT ? "編集取りやめ" : (categoryOperation == OPERATION_TYPE.DONE ? "実施を取りやめ" :
                    (categoryOperation == OPERATION_TYPE.DELETE ? "削除を取りやめ" : "中止を取りやめ")))}
              </div>
            </li>
          )}
          {(categoryType != null) &&
          (categoryType == CATEGORY_TYPE.INSPECTION || categoryType == CATEGORY_TYPE.ENDOSCOPE ||
            categoryType == CATEGORY_TYPE.TREATMENT || categoryType == CATEGORY_TYPE.ALLERGY ||
            categoryType == CATEGORY_TYPE.GUIDANCE || categoryType == CATEGORY_TYPE.REHABILY ||
            categoryType == CATEGORY_TYPE.RADIATION || categoryType == CATEGORY_TYPE.HOMETREATMENT ||
            categoryType == CATEGORY_TYPE.HOSPITALTREATMENT || categoryType == CATEGORY_TYPE.DISCHARGE_PERMIT ||
            categoryType == CATEGORY_TYPE.CHANGE_RESPONSIBILITY || categoryType == CATEGORY_TYPE.NUTRITION_GUIDANCE ||
            categoryType == CATEGORY_TYPE.HOSPITAL_OUT || categoryType == CATEGORY_TYPE.HOSPITAL_RETURN ||
            categoryType == CATEGORY_TYPE.IN_HOSPITAL_APP || categoryType == CATEGORY_TYPE.IN_HOSPITAL_DEC ||
            categoryType == CATEGORY_TYPE.MEAL || categoryType == CATEGORY_TYPE.MEAL_GROUP ||
            categoryType == CATEGORY_TYPE.BACILLUS || categoryType == CATEGORY_TYPE.MEDICINE_GUIDANCE ||
            categoryType == CATEGORY_TYPE.STOP_PRESCRIPTION || categoryType == CATEGORY_TYPE.EXAMINATION ||
            categoryType == CATEGORY_TYPE.CYTOLOGY || categoryType == CATEGORY_TYPE.PATHOLOGY ||
            categoryType == CATEGORY_TYPE.BACTERIAL || categoryType == CATEGORY_TYPE.PRESCRIPTION ||
            categoryType == CATEGORY_TYPE.INJECTION || categoryType == CATEGORY_TYPE.DISCHARGE_DONE ||
            categoryType == CATEGORY_TYPE.HOSPITAL_DONE || categoryType == CATEGORY_TYPE.DISCHARGE_DECISION ||
            categoryType == CATEGORY_TYPE.DOCUMENT_CREATE || categoryType == CATEGORY_TYPE.DEATH_REGISTER ||
            categoryType == CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT
          ) && (
            <>
              {(categoryType == CATEGORY_TYPE.PRESCRIPTION || categoryType == CATEGORY_TYPE.INJECTION) ? (
                <>
                  {categoryOperation != OPERATION_TYPE.DELETE && canEdit == true && (
                    <li><div onClick={()=>parent.contextMenuAction("doEditArea", categoryType, categoryOperation, stampKey)} onMouseOver={e => parent.outHover(e)}>編集</div></li>
                  )}
                </>
              ):(
                <>
                  {categoryOperation != OPERATION_TYPE.DELETE && categoryOperation != OPERATION_TYPE.STOP && canEdit == true && (
                    <li><div onClick={()=>parent.contextMenuAction("doEditArea", categoryType, categoryOperation)} onMouseOver={e => parent.outHover(e)}>編集</div></li>
                  )}
                </>
              )}
            </>
          )}
          {categoryType != null && categoryType != CATEGORY_TYPE.SOAP && (
            <li><div onClick={()=>parent.handleClipboard(categoryType, categoryOperation, stampKey)} onMouseOver={e => parent.outHover(e)}>コピー</div></li>
          )}
          {categoryType != null && is_checked != null &&
          categoryType != CATEGORY_TYPE.HOSPITAL_OUT && categoryType != CATEGORY_TYPE.HOSPITAL_RETURN &&
          categoryType != CATEGORY_TYPE.MEAL_GROUP && categoryType != CATEGORY_TYPE.STOP_PRESCRIPTION &&
          categoryType != CATEGORY_TYPE.MEDICINE_GUIDANCE && categoryType != CATEGORY_TYPE.MEDICAL_EXAMINATION_RECORD &&
          categoryType != CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT && categoryOperation != OPERATION_TYPE.DELETE &&
          categoryOperation != OPERATION_TYPE.STOP && (
            <li>
              <div className={is_checked ? "blue-text" : ""} onClick={()=>parent.contextMenuAction("seal_print", categoryType, categoryOperation,stampKey)} onMouseOver={e=>parent.outHover(e)}>
                登録時にシール印刷
              </div>
            </li>
          )}
          {categoryType != null && categoryType != CATEGORY_TYPE.DISCHARGE_PERMIT &&
          categoryType != CATEGORY_TYPE.CHANGE_RESPONSIBILITY && categoryType != CATEGORY_TYPE.HOSPITAL_OUT &&
          categoryType != CATEGORY_TYPE.HOSPITAL_RETURN && categoryType != CATEGORY_TYPE.MEAL &&
          categoryType != CATEGORY_TYPE.MEAL_GROUP && categoryType != CATEGORY_TYPE.IN_HOSPITAL_APP &&
          categoryType != CATEGORY_TYPE.IN_HOSPITAL_DEC && categoryType != CATEGORY_TYPE.STOP_PRESCRIPTION &&
          categoryType != CATEGORY_TYPE.NUTRITION_GUIDANCE && categoryType != CATEGORY_TYPE.MEDICINE_GUIDANCE &&
          categoryType != CATEGORY_TYPE.MEDICAL_EXAMINATION_RECORD && categoryType != CATEGORY_TYPE.DISCHARGE_DONE &&
          categoryType != CATEGORY_TYPE.HOSPITAL_DONE && categoryType != CATEGORY_TYPE.DISCHARGE_DECISION &&
          categoryType != CATEGORY_TYPE.DOCUMENT_CREATE && categoryType != CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT &&
          categoryType != CATEGORY_TYPE.DEATH_REGISTER && categoryOperation != OPERATION_TYPE.DELETE &&
          (
            <li className={'set-hover-menu'}><div onMouseOver={e=>parent.setHover(e)}>セット</div></li>
          )}
          {categoryType == CATEGORY_TYPE.SOAP && preset_do_deployment_array !== undefined && preset_do_deployment_array != null && preset_do_deployment_array.length > 0 && preset_do_deployment_array.map((item,index)=>{//処方Do展開
            return (
              <>
                <li key={index}><div onClick={() =>parent.contextMenuAction("prescription_do_deployment",index)} onMouseOver={e => parent.outHover(e)}>{item}</div></li>
              </>
            )
          })}
            
          {content_key === "space-area" ? (
            <>
              <li><div onClick={()=>parent.contextMenuAction("last_prescription")}>前回処方</div></li>
              {preset_do_deployment_array !== undefined && preset_do_deployment_array != null && preset_do_deployment_array.length > 0 && preset_do_deployment_array.map((item,index)=>{
                return (
                  <>
                    <li key={index}><div onClick={() =>parent.contextMenuAction("prescription_do_deployment",index)}>{item}</div></li>
                  </>
                )
              })}
            </>
          ):(
            <>
              {(content_type !== undefined) && (content_type !== "delete_treatment") && (content_type !== "delete_guidance") &&
              (content_type !== "delete_examination") && (content_type !== "delete_radiation") && (content_type !== "delete_rehabily") &&
              (content_type !== "delete_allergy") && (content_type !== "delete_soap") && (content_type !== "delete_ward_move") &&
              (content_type !== "delete_change_responsibility") && (content_type !== "delete_in_hospital") && (content_type !== "delete_hospital_done") &&
              (content_type !== "delete_discharge") && (content_type !== "delete_hospital_going") && (content_type !== "delete_death_delete") &&
              (content_type !== "delete_document") && (content_type !== "delete_inspection") && (
                <>
                  {canChangeDepartment && (
                    <li><div onClick={()=>parent.contextContentMenuAction("changeDepartment_soap", content_key, stampKey, content_type)}>診療科修正</div></li>
                  )}
                  {canChangeKarteStatus && (
                    <li><div onClick={()=>parent.contextContentMenuAction("changeKarteStatus_soap", content_key, stampKey, content_type)}>入外区分修正</div></li>
                  )}
                </>
              )}
              <li><div onClick={()=>parent.contextMenuAction("last_prescription")}>前回処方</div></li>
              {$canDoAction(FEATURES.PRESET_PATIENT_PRESCRIPTION, AUTHS.REGISTER) && content_type === "prescription" && (
                <li><div onClick={() =>parent.contextMenuAction("patient_set_prescription")}>患者別セットとして登録</div></li>
              )}
              {preset_menu_array !== undefined && preset_menu_array != null && preset_menu_array.length > 0 && preset_menu_array.map((item, index)=>{
                return (
                  <>
                    <li><div onClick={()=>parent.contextMenuAction("prescription_do_set",index)}>{item}</div></li>
                  </>
                )
              })}
              {preset_do_deployment_array !== undefined && preset_do_deployment_array != null && preset_do_deployment_array.length > 0 && preset_do_deployment_array.map((item,index)=>{
                return (
                  <>
                    <li key={index}><div onClick={() =>parent.contextMenuAction("prescription_do_deployment",index)}>{item}</div></li>
                  </>
                )
              })}
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_soap = ({visible, x,  y, parent, soap_kind}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {soap_kind !== 'sharp_text' && (
            <li><div onMouseOver = {e => parent.outSoapHover(e)} onClick={() => parent.contextMenuSoapAction(soap_kind)}>SOAP入力({soap_kind})</div></li>
          )}
          <li><div onMouseOver = {e => parent.outSoapHover(e)} onClick={() => parent.handleClipboardPaste(soap_kind)}>貼り付け</div></li>
          <li className={'vital-hover-menu'}><div onMouseOver={e => parent.setSoapHover(e, soap_kind, 'vital')}>最新のバイタルを貼り付け</div></li>
          <li><div onMouseOver = {e => parent.outSoapHover(e)} onClick={() => parent.openSelectDiseaseModal(soap_kind)}>病名引用</div></li>
          <li className={'quote-hover-menu'}><div onMouseOver = {e => parent.setSoapHover(e, soap_kind, 'quote')} >引用入力</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_hospital = ({visible, x,  y, parent, soap_kind}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onMouseOver = {e => parent.outSoapHover(e)} onClick={() => parent.handleClipboardPaste(soap_kind)}>貼り付け</div></li>
          <li className={'vital-hover-menu'}><div onMouseOver={e => parent.setSoapHover(e, soap_kind, 'vital')}>最新のバイタルを貼り付け</div></li>
          <li><div onMouseOver = {e => parent.outSoapHover(e)} onClick={() => parent.openSelectDiseaseModal(soap_kind)}>病名引用</div></li>
          <li className={'quote-hover-menu'}><div onMouseOver = {e => parent.setSoapHover(e, soap_kind, 'quote')}>引用入力</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverMenu = ({visible,x,y,parent,}) => {
  if(visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={()=>parent.contextMenuAction("set_register")}>セット登録</div></li>
          <li><div onClick={()=>parent.contextMenuAction("set_deployment")}>セット展開</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverSoapMenu = ({visible,x,y,parent,soap_kind, soap_hover_type}) => {
  if(visible) {
    if(soap_hover_type === 'vital'){
      return (
        <ContextMenuUl>
          <ul className="context-menu hover-soap-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            <li><div onClick={()=>parent.pasteVitalData("temperature", soap_kind)}>体温</div></li>
            <li><div onClick={()=>parent.pasteVitalData("max_blood", soap_kind)}>最高血圧</div></li>
            <li><div onClick={()=>parent.pasteVitalData("min_blood", soap_kind)}>最低血圧</div></li>
            <li><div onClick={()=>parent.pasteVitalData("pluse", soap_kind)}>脈拍</div></li>
            <li><div onClick={()=>parent.pasteVitalData("height", soap_kind)}>身長</div></li>
            <li><div onClick={()=>parent.pasteVitalData("weight", soap_kind)}>体重</div></li>
          </ul>
        </ContextMenuUl>
      );
    } else if (soap_hover_type === 'quote'){
      return (
        <ContextMenuUl>
          <ul className="context-menu hover-soap-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            <li><div onClick={()=>parent.pasteQuote("medicine", soap_kind)}>薬剤アレルギー</div></li>
            <li><div onClick={()=>parent.pasteQuote("food", soap_kind)}>食物アレルギー</div></li>
          </ul>
        </ContextMenuUl>
      );
    }
  } else {
    return null;
  }
};

class RightBox extends Component {
  constructor(props) {
    super(props);    
    // define clipboard functions
    this.clipboardPrescription = methods.clipboardPrescription.bind(this);
    this.clipboardInjection = methods.clipboardInjection.bind(this);
    Object.entries(pres_methods).forEach(([name, fn]) =>{
      if(name === "registerNewSet" ||name === "createCacheOrderData" || name === "getPresetDoPrescription") {
        this[name] = fn.bind(this);
      }
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let soapData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT);
    soapData = soapData != null ? soapData : null;
    let sharp_text = "";
    if(soapData != null && soapData.isForSave == true){
      sharp_text = this.changeSpaceChar(soapData.data.sharp_text);
    }
    let s_text = "";
    if(soapData != null && soapData.isForSave == true){
      s_text = this.changeSpaceChar(soapData.data.s_text);
    }
    let o_text = "";
    if(soapData != null && soapData.isForSave == true){
      o_text = this.changeSpaceChar(soapData.data.o_text);
    }
    let a_text = "";
    if(soapData != null && soapData.isForSave == true){
      a_text = this.changeSpaceChar(soapData.data.a_text);
    }
    let p_text = "";
    if(soapData != null && soapData.isForSave == true){
      p_text = this.changeSpaceChar(soapData.data.p_text);
    }
    this.state = {
      presData: {
        soap_start_at: soapData != null && soapData.isForSave == true?soapData.data.soap_start_at:getCurrentDate("-"),
        sharp_text,
        s_text,
        o_text,
        a_text,
        p_text,
        updateDate: soapData != null && soapData.isForSave == true?soapData.data.updateDate:'',
        created_at: soapData != null && soapData.isForSave == true?soapData.data.created_at:'',
        importance: soapData != null && soapData.isForSave == true?soapData.data.importance:1,
      },
      updateFlag: true,
      isForSave: soapData != null && soapData.isForSave == true?true:false,
      prescriptionDelData: [],
      prescriptionDelRpData: [],
      injectionDelData: [],
      injectionDelRpData: [],
      donePrescription: [],
      doneInjection: [],
      doneExamOrder: [],
      stopPrescription: [],
      stopInjection: [],
      create_at: "",
      isPrescriptionDone: 0,
      isInjectionDone: 0,
      isExamOrderDone: 0,
      confirm_type: "",
      confirm_alert_title: "",
      confirm_message: "",
      confirm_value: null,
      confirm_value2: null,
      categoryType: -1,
      categoryOperation: -1,
      stampKey: -1,
      delNumber: -1,
      seal_print:{},
      changeDepartmentModal: false,
      isOpenInspectionImageModal: false,
      isOpenSelectDiseaseModal:false,
      isOpenAlergyModal:false,
      content_key: "",
      content_subkey: "",
      content_type: "",
      ckeditor_type: "",
      italic_btn:false,
      bold_btn:false,
      registerSetModal:false,
      registerPatientSetModal:false,
      allOptions: [
        "milling",
        "can_generic_name",
        "is_not_generic",
        "one_dose_package",
        "temprary_dedicine",
        "insurance_type",
        "separate_packaging"
      ],
      rightboxRefresh:false,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
      },
      contextMenu_hospital:{visible: false},
      contextMenu_soap:{visible:false},
      hoverMenu:{visible:false},
      hoverSoapMenu:{visible:false},
      isOpenEndoscopeReservationModal: false,
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
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.seal_print_mode = {
      "soap_edit": 0,
      "prescription_edit": 0,
      "injection_edit": 0,
      "examination_edit": 0,
      "inspection_edit": 0,
      "treatment_edit": 0,
      "guidance_edit": 0,
      "rihabily_edit": 0,
      "radiation_edit": 0,
      "medicine_guidance_edit": 0,
      "hospital_application": 0,
      "hospital_decision": 0,
      "hospital_done": 0,
      "change_responsibility": 0,
      "discharge_permit": 0,
      "discharge_decision": 0,
      "discharge_done": 0,
      "document": 0,
      "guidance_nutrition_order": 0,
      "death_register": 0,
    };
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    if(conf_data !== undefined && conf_data != null && conf_data.sticker_print_mode !== undefined && conf_data.sticker_print_mode != null){
      this.seal_print_mode = conf_data.sticker_print_mode;
    }
    this.soap_font_color = "#000000";
    this.middle_soapList = JSON.parse(JSON.stringify(this.props.soapList));
    // prescription and injection delete position
    this.pos_idx = "";
    this.pos_type = "";
    // ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
    this.visitPlaceMaster = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "visit_place_master");
    this.patientInfo = karteApi.getPatient(this.props.patientId);
  }
  
  componentDidMount() {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    // prescription delete
    const cacheDelState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    
    // injection delete
    const cacheDelInjectState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    
    // 実施
    const cacheDonePrescriptionState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
    
    const cacheDoneInjectionState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE);
    
    const cacheDoneExamOrderState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
    
    // 実施時にシール印刷 seal_print
    const cacheSealPrintState = karteApi.getSealAllVal(this.props.patientId);
    
    let deletedRpHistory = [];
    let deletedHistory = [];
    let deletedInjectHistory = [];
    let deletedInjectRpHistory = [];
    let tmpDonePrescription = [];
    let tmpDoneInjection = [];
    let tmpDoneExamOrder = [];
    let tmpStopPrescription = [];
    let tmpStopInjection = [];
    let sealPrint = {};
    
    // Prescription
    let delete_medicineHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    if (cacheDelState !== undefined && cacheDelState !== null && cacheDelState.length > 0 && delete_medicineHistory!== undefined && delete_medicineHistory != null && delete_medicineHistory.length > 0) {
      cacheDelState.map(delData => {
        delete_medicineHistory.map(med => {
          let medicine = { ...med };
          if (medicine.number == delData.number) {
            if (delData.order_data !== undefined) {
              let order_data = [];
              let deleted_order = [];
              medicine.order_data.order_data.map(med_order_data => {
                let deleted = false;
                delData.order_data.map(item => {
                  if (item.order_number === med_order_data.order_number) {
                    deleted = true;
                    deleted_order.push(med_order_data);
                  }
                });
                if (deleted === false) {
                  order_data.push(med_order_data);
                }
              });
              
              if (order_data.length > 0) {
                medicine.is_enabled = 4; // RP delete
                medicine.order_data.order_data = deleted_order;
              } else {
                medicine.is_enabled = 3; // all delete
              }
            }
          }
          // 中止
          if (medicine.number == delData.number && medicine.stop_order !== undefined && medicine.stop_order !== null && medicine.stop_order === 1) {
            medicine.openTag = 1;
            tmpStopPrescription.push(medicine);
          } else {
            // 削除
            if (medicine.is_enabled == 3) {
              medicine.openTag = 1;
              deletedHistory.push(medicine);
            }else if(medicine.is_enabled == 4){
              medicine.openTag = 1;
              deletedRpHistory.push(medicine);
            }
          }
        });
      });
    }
    
    // Inject
    let delete_injectionHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    if (cacheDelInjectState !== undefined && cacheDelInjectState !== null && cacheDelInjectState.length > 0 && delete_injectionHistory !== undefined && delete_injectionHistory != null && delete_injectionHistory.length > 0) {
      cacheDelInjectState.map(delData => {
        delete_injectionHistory.map(med => {
          let medicine = { ...med };
          if (medicine.number == delData.number) {
            if (delData.order_data !== undefined) {
              let order_data = [];
              let deleted_order = [];
              medicine.order_data.order_data.map(med_order_data => {
                let deleted = false;
                delData.order_data.map(item => {
                  if (item.order_number === med_order_data.order_number) {
                    deleted = true;
                    deleted_order.push(med_order_data);
                  }
                });
                if (deleted === false) {
                  order_data.push(med_order_data);
                }
              });
              
              if (order_data.length > 0) {
                medicine.is_enabled = 4; // RP delete
                medicine.order_data.order_data = deleted_order;
              } else {
                medicine.is_enabled = 3; // all delete
              }
            }
          }
          // 中止
          if (medicine.number == delData.number && medicine.stop_order !== undefined && medicine.stop_order !== null && medicine.stop_order === 1) {
            medicine.openTag = 1;
            tmpStopInjection.push(medicine);
          } else {
            // 削除
            if (medicine.is_enabled == 3) {
              medicine.openTag = 1;
              deletedInjectHistory.push(medicine);
            }else if(medicine.is_enabled == 4){
              medicine.openTag = 1;
              deletedInjectRpHistory.push(medicine);
            }
          }
        });
      });
    }
    
    // 実施
    let nFlagPrescriptionDone = 0;
    // prescription
    let done_medicineHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
    if (cacheDonePrescriptionState !== undefined && cacheDonePrescriptionState !== null && cacheDonePrescriptionState.length > 0 && done_medicineHistory !== undefined && done_medicineHistory !== null && done_medicineHistory.length > 0) {
      cacheDonePrescriptionState.map(item=>{
        if (item.is_done == 1) {
          nFlagPrescriptionDone = 1;
        }
      });
      cacheDonePrescriptionState.map(delData => {
        done_medicineHistory.map(med => {
          let medicine = { ...med };
          if (medicine.number == delData.number) {
            if (delData.order_data !== undefined) {
              let order_data = [];
              let deleted_order = [];
              medicine.order_data.order_data.map(med_order_data => {
                let deleted = false;
                if (delData.order_data !== undefined && delData.order_data != null && delData.order_data.length > 0){
                  delData.order_data.map(item => {
                    if (item.order_number === med_order_data.order_number) {
                      deleted = true;
                      deleted_order.push(med_order_data);
                    }
                  });
                }
                if (deleted === false) {
                  order_data.push(med_order_data);
                }
              });
              if (order_data.length > 0) {
                medicine.is_enabled = 4; // RP delete
                medicine.order_data.order_data = deleted_order;
              } else {
                medicine.is_enabled = 3; // all delete
              }
            }
            if (delData.is_done != 1) {
              medicine.openTag = 1;
              tmpDonePrescription.push(medicine);
            }
          }
        });
      });
    }
    
    let nFlagInjectionDone = 0;
    // injection
    let done_injectionHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
    if (cacheDoneInjectionState !== undefined && cacheDoneInjectionState !== null && cacheDoneInjectionState.length > 0 && done_injectionHistory !== undefined && done_injectionHistory != null && done_injectionHistory.length > 0) {
      cacheDoneInjectionState.map(item=>{
        if (item.is_done == 1) {
          nFlagInjectionDone = 1;
        }
      });
      cacheDoneInjectionState.map(delData => {
        done_injectionHistory.map(med => {
          let medicine = { ...med };
          if (medicine.number == delData.number) {
            if (delData.order_data !== undefined) {
              let order_data = [];
              let deleted_order = [];
              medicine.order_data.order_data.map(med_order_data => {
                let deleted = false;
                delData.order_data.map(item => {
                  if (item.order_number === med_order_data.order_number) {
                    deleted = true;
                    deleted_order.push(med_order_data);
                  }
                });
                if (deleted === false) {
                  order_data.push(med_order_data);
                }
              });
              if (order_data.length > 0) {
                medicine.is_enabled = 4; // RP delete
                medicine.order_data.order_data = deleted_order;
              } else {
                medicine.is_enabled = 3; // all delete
              }
            }
            if (delData.is_done != 1) {
              medicine.openTag = 1;
              tmpDoneInjection.push(medicine);
            }
          }
        });
      });
    }
    
    let nFlagExamOrderDone = 0;
    // exam order
    if (cacheDoneExamOrderState !== undefined && cacheDoneExamOrderState !== null && cacheDoneExamOrderState.length > 0) {
      cacheDoneExamOrderState.map(item=>{
        if (item.is_done == 1) {
          nFlagExamOrderDone = 1;
        }
      });
    }
    if (nFlagExamOrderDone == 1) {
      tmpDoneExamOrder = cacheDoneExamOrderState;
    }
    
    // 「実施時にシール印刷」
    if (cacheSealPrintState !== undefined && cacheSealPrintState !== null) {
      sealPrint = cacheSealPrintState;
    }
    
    //ckeditor keydown event
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("keydown", () => {
      if (event.key == 'Tab'){
        switch(this.state.ckeditor_type){
          case "sharp_text":
            this.setState({ckeditor_type:"s_text"});
            break;
          case "s_text":
            this.setState({ckeditor_type:"o_text"});
            break;
          case "o_text":
            this.setState({ckeditor_type:"a_text"});
            break;
          case "a_text":
            this.setState({ckeditor_type:"p_text"});
            break;
          case 'p_text':
            this.setState({ckeditor_type:"sharp_text"});
            break;
        }
      }
    })
    this.setState({
      prescriptionDelData: deletedHistory,
      prescriptionDelRpData: deletedRpHistory,
      injectionDelData: deletedInjectHistory,
      injectionDelRpData: deletedInjectRpHistory,
      donePrescription: tmpDonePrescription,
      doneInjection: tmpDoneInjection,
      doneExamOrder: tmpDoneExamOrder,
      isPrescriptionDone: nFlagPrescriptionDone,
      isInjectionDone: nFlagInjectionDone,
      isExamOrderDone: nFlagExamOrderDone,
      stopPrescription: tmpStopPrescription,
      stopInjection: tmpStopInjection,
      seal_print: sealPrint,
    });
    let elements = document.getElementsByClassName("content_editable_area");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', this.getSeleteTag, false);
    }
    
    this.setSpaceAreaHeight();
  }
  
  componentDidUpdate () {
    this.setSpaceAreaHeight();
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
  
  setSpaceAreaHeight=()=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    //1004-1  右カラムの空白のエリアの右クリックメニューに「処方Do展開」と「前回処方」を追加してください
    let space_area = document.getElementsByClassName("space-area")[0];
    if(space_area !== undefined && space_area != null){
      let order_area_obj = document.getElementsByClassName("order-area")[0];
      if(order_area_obj !== undefined && order_area_obj != null){
        let order_area_obj_height = $(order_area_obj).height();
        let order_data_area_obj = document.getElementsByClassName("order-data-area")[0];
        let order_data_area_obj_height = $(order_data_area_obj).height();
        if(order_area_obj_height > order_data_area_obj_height){
          space_area.style['height'] = (order_area_obj_height - order_data_area_obj_height - 25)+"px";
        } else {
          space_area.style['height'] = "0px";
        }
      }
    }
  }
  
  getSeleteTag=()=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let parentNode_name = window.getSelection().anchorNode.parentNode.tagName;
    let bold_btn = document.getElementsByClassName("bold-btn")[0];
    let italic_btn = document.getElementsByClassName("italic-btn")[0];
    let font_color_btn = document.getElementsByClassName("set-font-color")[0];
    if(bold_btn !== undefined && bold_btn != null){
      if(parentNode_name == "STRONG" || parentNode_name == "B"){
        bold_btn.style['background-color'] = "#aaa";
      } else {
        bold_btn.style['background-color'] = "";
      }
    }
    if(italic_btn !== undefined && italic_btn != null){
      if(parentNode_name == "EM" || parentNode_name == "I"){
        italic_btn.style['background-color'] = "#aaa";
      } else {
        italic_btn.style['background-color'] = "";
      }
    }
    if(font_color_btn !== undefined && font_color_btn != null){
      if(parentNode_name == "FONT"){
        let font_color =  window.getSelection().anchorNode.parentNode.color;
        if(font_color !== undefined && font_color != null && font_color != ""){
          this.changeBtnColor(font_color);
        }
      } else {
        this.changeBtnColor("#000000");
      }
    }
    // document.execCommand("ForeColor", false, this.soap_font_color);
  }
  
  shouldComponentUpdate(nextprops, nextstate) {
    this.changeState = JSON.stringify(this.state) != JSON.stringify(nextstate);
    this.changeProps = JSON.stringify(this.props) != JSON.stringify(nextprops);
    // importance refresh
    if (this.refresh_importance_option == 1) {
      this.refresh_importance_option = null
      return true;
    }
    if((this.changeState == false) && (this.changeProps == false)){
      return false;
    } else {
      // if(this.changeState){
      //   let state_data = this.state;
      //   let nextstate_data = nextstate;
      //   Object.keys(state_data).map(key=>{
      //     if(nextstate_data[key] !== undefined){
      //       if(state_data[key] != nextstate_data[key]){
      //       }
      //     } else {
      //     }
      //   });
      //   Object.keys(nextstate_data).map(key=>{
      //     if(state_data[key] !== undefined){
      //       if(state_data[key] != nextstate_data[key]){
      //       }
      //     } else {
      //     }
      //   });
      // }
      // if(this.changeProps){
      // }
      return true;
    }
  }
  
  getCategoryTypeLabel(nCategoryType) {
    if (nCategoryType == CATEGORY_TYPE.SOAP) {
      let SoapCategory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY);
      return SoapCategory == "hospital_note" ? "初診・入院時ノート" : "プログレスノート";
    } else if (nCategoryType == CATEGORY_TYPE.PRESCRIPTION) {
      return "処方";
    } else if (nCategoryType == CATEGORY_TYPE.INJECTION) {
      return "注射";
    } else if (nCategoryType == CATEGORY_TYPE.EXAMINATION) {
      return "検体検査";
    } else if (nCategoryType == CATEGORY_TYPE.CYTOLOGY) {
      return "細胞診検査";
    } else if (nCategoryType == CATEGORY_TYPE.PATHOLOGY) {
      return "病理検査";
    } else if (nCategoryType == CATEGORY_TYPE.BACTERIAL) {
      return "細菌検査";
    } else if (nCategoryType == CATEGORY_TYPE.INSPECTION || nCategoryType == CATEGORY_TYPE.ENDOSCOPE) {
      return "この検査";
    } else if (nCategoryType == CATEGORY_TYPE.TREATMENT) {
      return "外来処置";
    } else if (nCategoryType == CATEGORY_TYPE.HOMETREATMENT) {
      return "在宅処置";
    } else if (nCategoryType == CATEGORY_TYPE.HOSPITALTREATMENT) {
      return "入院処置";
    } else if (nCategoryType == CATEGORY_TYPE.ALLERGY) {
      return "この項目";
    } else if (nCategoryType == CATEGORY_TYPE.GUIDANCE) {
      return "汎用オーダー";
    } else if (nCategoryType == CATEGORY_TYPE.HOME) {
      return "在宅";
    } else if (nCategoryType == CATEGORY_TYPE.SPIRIT) {
      return "精神";
    } else if (nCategoryType == CATEGORY_TYPE.REHABILY) {
      return "リハビリ";
    } else if (nCategoryType == CATEGORY_TYPE.RADIATION) {
      return "放射線 ";
    } else if (nCategoryType == CATEGORY_TYPE.DISCHARGE_PERMIT) {
      return "退院許可";
    } else if (nCategoryType == CATEGORY_TYPE.CHANGE_RESPONSIBILITY) {
      return "担当変更";
    } else if (nCategoryType == CATEGORY_TYPE.MEAL) {
      return "食事オーダー";
    } else if (nCategoryType == CATEGORY_TYPE.MEAL_GROUP) {
      return "食事一括指示";
    } else if (nCategoryType == CATEGORY_TYPE.IN_HOSPITAL_APP) {
      return "入院申込オーダー";
    } else if (nCategoryType == CATEGORY_TYPE.IN_HOSPITAL_DEC) {
      return "入院決定オーダー";
    } else if (nCategoryType == CATEGORY_TYPE.STOP_PRESCRIPTION) {
      return "中止処方";
    } else if (nCategoryType == CATEGORY_TYPE.HOSPITAL_OUT) {
      return "外泊実施";
    } else if (nCategoryType == CATEGORY_TYPE.HOSPITAL_RETURN) {
      return "帰院実施";
    } else if (nCategoryType == CATEGORY_TYPE.NUTRITION_GUIDANCE) {
      return "栄養指導依頼";
    } else if (nCategoryType == CATEGORY_TYPE.BACILLUS) {
      return "細菌検査";
    } else if (nCategoryType == CATEGORY_TYPE.MEDICINE_GUIDANCE) {
      return "服薬指導依頼";
    } else if (nCategoryType == CATEGORY_TYPE.MEDICAL_EXAMINATION_RECORD) {
      return "診察済記録オーダー";
    } else if (nCategoryType == CATEGORY_TYPE.DISCHARGE_DONE) {
      return "退院実施";
    } else if (nCategoryType == CATEGORY_TYPE.DISCHARGE_DECISION) {
      return "退院決定";
    } else if (nCategoryType == CATEGORY_TYPE.HOSPITAL_DONE) {
      return "入院実施";
    } else if (nCategoryType == CATEGORY_TYPE.DOCUMENT_CREATE) {
      return "文書作成";
    } else if (nCategoryType == CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT) {
      return "退院時指導レポート";
    } else if (nCategoryType == CATEGORY_TYPE.WARD_MOVE) {
      return "転棟・転室実施";
    } else if (nCategoryType == CATEGORY_TYPE.DEATH_REGISTER) {
      return "死亡登録";
    }
  }
  
  getCategoryOperationMsg(nCategoryOperation) {
    if (nCategoryOperation == OPERATION_TYPE.REGIST) {
      return "の入力内容を破棄しますか？";
    } else if (nCategoryOperation == OPERATION_TYPE.EDIT) {
      return "の編集を取りやめますか？";
    } else if (nCategoryOperation == OPERATION_TYPE.DELETE) {
      return "の削除を取りやめますか？";
    } else if (nCategoryOperation == OPERATION_TYPE.DONE) {
      return "の実施を取りやめますか？";
    } else if (nCategoryOperation == OPERATION_TYPE.STOP) {
      return "の中止を取りやめますか？";
    }
  }
  
  outHover = (e) => {
    if(e){
      this.setState({
        hoverMenu: {
          visible: false,
        }
      });
    }
  }
  
  outSoapHover = (e) => {
    if(e){
      this.setState({
        hoverSoapMenu: {
          visible: false,
        }
      });
    }
  }
  
  pasteAlergy = (alergy) => {
    var soap_key = '';
    switch(this.state.soap_kind){
      case 'S':
        soap_key = 's_text';
        break;
      case 'O':
        soap_key = 'o_text';
        break;
      case 'A':
        soap_key = 'a_text';
        break;
      case 'P':
        soap_key = 'p_text';
        break;
      case 'sharp_text':
        soap_key = 'sharp_text';
        break;
      default:
        soap_key = 's_text';
        break;
    }
    var presData = this.state.presData;
    var temp = presData[soap_key];
    temp += alergy.split(" ").join('&nbsp;');
    presData[soap_key] = temp;
    this.setState({presData});
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let presDataStr = JSON.stringify({
      user_number: userInfo.user_number,
      system_patient_id: this.props.patientId,
      data: presData,
      isForUpdate: this.props.isForUpdate,
      updateIndex: this.props.updateIndex,
      isForSave: true
    });
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
  }
  
  pasteDiseaseName = (disease_name) => {
    var soap_key = '';
    switch(this.state.soap_kind){
      case 'S':
        soap_key = 's_text';
        break;
      case 'O':
        soap_key = 'o_text';
        break;
      case 'A':
        soap_key = 'a_text';
        break;
      case 'P':
        soap_key = 'p_text';
        break;
      case 'sharp_text':
        soap_key = 'sharp_text';
        break;
      default:
        soap_key = 's_text';
        break;
    }
    var presData = this.state.presData;
    var temp = presData[soap_key];
    temp += disease_name.split(" ").join('&nbsp;');
    presData[soap_key] = temp;
    this.setState({presData});
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let presDataStr = JSON.stringify({
      user_number: userInfo.user_number,
      system_patient_id: this.props.patientId,
      data: presData,
      isForUpdate: this.props.isForUpdate,
      updateIndex: this.props.updateIndex,
      isForSave: true
    });
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
  }
  
  pasteQuote = (type, soap_kind) => {
    this.setState({
      soap_kind,
      allergy_type:type,
      isOpenAlergyModal:true,
    });
  }
  
  pasteVitalData = (vital_type, soap_kind) => {
    var patient_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    var soap_key = '';
    switch(soap_kind){
      case 'S':
        soap_key = 's_text';
        break;
      case 'O':
        soap_key = 'o_text';
        break;
      case 'A':
        soap_key = 'a_text';
        break;
      case 'P':
        soap_key = 'p_text';
        break;
      case 'sharp_text':
        soap_key = 'sharp_text';
        break;
      default:
        soap_key = 's_text';
        break;
    }
    var presData = this.state.presData;
    var temp = presData[soap_key];
    var vital_amount = patient_data[vital_type];
    switch(vital_type){
      case 'height':
        if (parseInt(vital_amount) >= 0) {
          temp += '身長 ' + vital_amount + 'cm';
        }
        break;
      case 'max_blood':
        if (parseInt(vital_amount) >= 0) {
          temp += '最高血圧 ' + vital_amount + 'mmgh';
        }
        break;
      case 'min_blood':
        if (parseInt(vital_amount) >= 0) {
          temp += '最低血圧 ' + vital_amount + 'mmgh';
        }
        break;
      case 'pluse':
        if (parseInt(vital_amount) >= 0) {
          temp += '脈拍 ' + vital_amount + 'bpm';
        }
        break;
      case 'temperature':
        if (parseInt(vital_amount) >= 0) {
          temp += '体温 ' + vital_amount + '℃';
        }
        break;
      case 'weight':
        if (parseInt(vital_amount) >= 0) {
          temp += '体重 ' + vital_amount + 'kg';
        }
        break;
    }
    presData[soap_key] = temp;
    this.setState({presData});
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let presDataStr = JSON.stringify({
      user_number: userInfo.user_number,
      system_patient_id: this.props.patientId,
      data: presData,
      isForUpdate: this.props.isForUpdate,
      updateIndex: this.props.updateIndex,
      isForSave: true
    });
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
  }

  handleClipboard=(categoryType, categoryOperation, sub_key) =>{
    let cache_data = null;
    switch(categoryType){
      case CATEGORY_TYPE.PRESCRIPTION: // ●YJ868 SOAP画面で、処方をクリップボードにコピーできるようにする
        if (this.pos_type == "order_delete") {
          if (this.state.prescriptionDelData.length > 0 && this.pos_idx !== "") {            
            cache_data = this.state.prescriptionDelData[this.pos_idx];
            this.clipboardPrescription(cache_data, "right_del");
          }
        } else if(this.pos_type == "rp_delete") {
          if (this.state.prescriptionDelRpData.length > 0 && this.pos_idx !== "") {            
            cache_data = this.state.prescriptionDelRpData[this.pos_idx];
            this.clipboardPrescription(cache_data, "right_rp_del");
          }
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.state.stampKey);
          this.clipboardPrescription(cache_data[0], "right");
        }
        break;
      case CATEGORY_TYPE.INJECTION: // ●YJ939 中央カラムの項目は一通りクリップボードにコピー可能にする
        if (this.pos_type == "order_delete") {          
          if (this.state.injectionDelData.length > 0 && this.pos_idx !== "") {            
            cache_data = this.state.injectionDelData[this.pos_idx];
            this.clipboardInjection(cache_data, "right_del");
          }          
        } else if(this.pos_type == "rp_delete") {
          if (this.state.injectionDelRpData.length > 0 && this.pos_idx !== "") {            
            cache_data = this.state.injectionDelRpData[this.pos_idx];
            this.clipboardInjection(cache_data, "right_rp_del");
          }
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.state.stampKey);
          this.clipboardInjection(cache_data[0], "right");
        }              
        break;
      case CATEGORY_TYPE.EXAMINATION:
        cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT);
        clipboardExamination(cache_data, "right");
        break;
      case CATEGORY_TYPE.CYTOLOGY:
        cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
        clipboardExamination(cache_data, "right");
        break;
      case CATEGORY_TYPE.PATHOLOGY:
        cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
        clipboardExamination(cache_data, "right");
        break;
      case CATEGORY_TYPE.BACTERIAL:
        cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
        clipboardExamination(cache_data, "right");
        break;
      case CATEGORY_TYPE.NUTRITION_GUIDANCE:
        cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.NUTRITION_GUIDANCE);
        clipboardNutritionGuidance(cache_data);
        break;
      case CATEGORY_TYPE.ALLERGY:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_DELETE, sub_key);
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, sub_key);
        }
        clipboardPatientDescriptionInfo(cache_data);
        break;
      case CATEGORY_TYPE.DEATH_REGISTER:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE, sub_key);
        } else {
          cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER);
        }
        clipboardDeathRegister(cache_data);
        break;
      case CATEGORY_TYPE.ENDOSCOPE:
      case CATEGORY_TYPE.INSPECTION:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_DELETE, sub_key);
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, sub_key);
        }
        clipboardInspection(cache_data);
        break;
      case CATEGORY_TYPE.DOCUMENT_CREATE:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_DELETE, sub_key);
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_CREATE, sub_key);
        }
        clipboardDocument(cache_data);
        break;
      case CATEGORY_TYPE.IN_HOSPITAL_APP:
      case CATEGORY_TYPE.IN_HOSPITAL_DEC:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE, sub_key);
        } else {
          cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
        }
        clipboardApplyDecision(cache_data);
        break;
      case CATEGORY_TYPE.CHANGE_RESPONSIBILITY:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE, sub_key);
        } else {
          cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY);
        }
        clipboardChangeResponsibility(cache_data);
        break;
      case CATEGORY_TYPE.HOSPITAL_DONE:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE, sub_key);
        } else {
          cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE);
        }
        clipboardHospitalDone(cache_data, "right_box");
        break;
      case CATEGORY_TYPE.HOSPITAL_OUT:
      case CATEGORY_TYPE.HOSPITAL_RETURN:
        cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE, sub_key);
        clipboardHospitalInOut(cache_data);
        break;
      case CATEGORY_TYPE.DISCHARGE_PERMIT:
      case CATEGORY_TYPE.DISCHARGE_DECISION:
      case CATEGORY_TYPE.DISCHARGE_DONE:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DELETE, sub_key);
        } else {
          cache_data = karteApi.getVal(this.props.patientId, (categoryType == CATEGORY_TYPE.DISCHARGE_PERMIT) ? CACHE_LOCALNAMES.DISCHARGE_PERMIT : ((categoryType == CATEGORY_TYPE.DISCHARGE_DECISION) ? CACHE_LOCALNAMES.DISCHARGE_DECISION : CACHE_LOCALNAMES.DISCHARGE_DONE));
        }
        clipboardDischarge(cache_data, (categoryType == CATEGORY_TYPE.DISCHARGE_PERMIT) ? "permit" : ((categoryType == CATEGORY_TYPE.DISCHARGE_DECISION) ? "decision" : "done"));
        break;
      case CATEGORY_TYPE.WARD_MOVE:
        cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.WARD_MOVE_DELETE, sub_key);
        clipboardHospitalMove(cache_data);
        break;
      case CATEGORY_TYPE.GUIDANCE:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_DELETE, sub_key);
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_EDIT, sub_key);
        }
        clipboardGuidance(cache_data);
        break;
      case CATEGORY_TYPE.MEAL:
        cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_EDIT, sub_key);        
        clipboardMeal(cache_data);
        break;
      case CATEGORY_TYPE.MEAL_GROUP:
        cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT, sub_key);
        clipboardMeal(cache_data);
        break;        
      case CATEGORY_TYPE.RADIATION:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_DELETE, sub_key);
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, sub_key);
        }        
        clipboardRadiation(cache_data);
        break;                
      case CATEGORY_TYPE.REHABILY:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_DELETE, sub_key);
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT, sub_key);
        }        
        clipboardRehabily(cache_data);
        break;                
      case CATEGORY_TYPE.BACILLUS:
        cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.BACILLUS_EDIT, sub_key);
        clipboardBacillusInspection(cache_data, "rightbox");
        break;
      case CATEGORY_TYPE.MEDICAL_EXAMINATION_RECORD:
        clipboardMedicalExaminationRecord();
        break;
      case CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT:
        cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT);
        clipboardHospitalDischargeGuidanceReport(cache_data);
        break;
      case CATEGORY_TYPE.TREATMENT:
      case CATEGORY_TYPE.HOMETREATMENT:
      case CATEGORY_TYPE.HOSPITALTREATMENT:
        if(categoryOperation === OPERATION_TYPE.DELETE){
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_DELETE, sub_key);
        } else {
          cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, sub_key);
        }
        clipboardTreatment(cache_data);
        break;
      case CATEGORY_TYPE.MEDICINE_GUIDANCE:        
        cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, sub_key);                
        clipboardMedicineGuidance(cache_data, "rightbox");
        break;     
    }
  }
  
  contextMenuAction = (act, nCategoryType, nCategoryOperation,sub_key=null) => {
    if (act === "doDeleteArea") {
      this.setState({
        confirm_message: this.getCategoryTypeLabel(nCategoryType)+this.getCategoryOperationMsg(nCategoryOperation),
        confirm_type: `${nCategoryType}${nCategoryOperation}`,
      });
    }
    if (act === "doEditArea") {
      this.setState({
        confirm_message: this.getCategoryTypeLabel(nCategoryType)+"を編集しますか?",
        confirm_type: `${nCategoryType}_edit`,
      });
    }
    
    if (act === "last_prescription") { //前回処方
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      if (this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.props.saveConfirmMessage("last_prescription");
        return;
      }
      let systemPatientId = this.props.patientId;
      let props = this.props;
      let department_code = this.context.department.code == 0 ? 1 : this.context.department.code;
      let karte_status_code = 1;
      if(this.context.karte_status.code == 1){
        karte_status_code = 3;
      }
      if(this.context.karte_status.code == 2){
        karte_status_code = 2;
      }
      this.props.getLastPrescription(systemPatientId, department_code, karte_status_code, null, null, "from_soap").then(function(value){
        if(value == true) {
          props.goToDropPage(`/patients/${systemPatientId}/soap`);
        } else if(value.res == "ok"){
          /*@cc_on _win = window; eval ( 'var window = _win') @*/
          window.localStorage.setItem("soap_insert_drop_number", value.prescription.target_number);
          props.goToDropPage(`/patients/${systemPatientId}/prescription`);
        }
      });
    }
    if (act === "patient_set_prescription") { //患者別処方セット
      this.setState({
        registerPatientSetModal: true
      });
    }
    if (act === "set_register") {
      this.setState({
        confirm_message: "セットを登録しますか？",
        confirm_type: "set_register",
      });
    }
    if (act === "set_deployment") {
      this.setState({
        confirm_message: "セットを展開しますか？",
        confirm_type: "set_deployment",
      });
    }
    if (act === "prescription_do_set") {
      let preset_do_count = nCategoryType;
      let preset_do_data = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION);
      let cur_preset_do_count = 0;
      if(preset_do_data !== undefined && preset_do_data != null){
        cur_preset_do_count = preset_do_data.length;
      }
      let confirm_message = "";
      if((parseInt(preset_do_count) + 1) > cur_preset_do_count){
        let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
        let patient_do_max_number = initState.patient_do_max_number;
        if(patient_do_max_number >1 && cur_preset_do_count > 0){
          confirm_message = "処方Do（"+(parseInt(preset_do_count) + 1)+"）を登録しますか？";
        } else {
          confirm_message = "処方Doを登録しますか？";
        }
      } else {
        confirm_message = "処方Doを新しい内容で上書きしますか？";
      }
      this.setState({
        confirm_message,
        preset_do_count,
        confirm_type: "prescription_do_set",
      });
    }
    if (act === "prescription_do_deployment") {
      localApi.setValue("preset_do_deploy_index", nCategoryType);
      this.props.goToDropPage(`/patients/${this.props.patientId}/prescription`);
    }
    if (act === "seal_print") {
      let seal_print = this.state.seal_print;
      let order_type = "";
      if(nCategoryType == CATEGORY_TYPE.IN_HOSPITAL_APP){
        order_type = "hospital_application";
      } else if(nCategoryType == CATEGORY_TYPE.IN_HOSPITAL_DEC){
        order_type = "hospital_decision";
      } else if(nCategoryType == CATEGORY_TYPE.DOCUMENT_CREATE){
        order_type = "document";
      } else if(nCategoryType == CATEGORY_TYPE.NUTRITION_GUIDANCE){
        order_type = "guidance_nutrition_order";
      } else {
        order_type = this.getCategoryType(nCategoryType);
      }
      if(sub_key == null) {
        if (seal_print[order_type] != undefined && seal_print[order_type] == 1){
          seal_print[order_type] = 0;
        } else {
          seal_print[order_type] = 1;
        }
      } else {
        if(seal_print[order_type] === undefined) {
          seal_print[order_type] = {};
        }
        seal_print[order_type][sub_key] = seal_print[order_type][sub_key] == 0 ? 1 : 0;
      }
      this.setState({seal_print}, ()=>{
        this.setSealInCache();
      });
    }
  };
  
  getCategoryType(nCategoryType) {
    if (nCategoryType == CATEGORY_TYPE.SOAP) {
      return CACHE_LOCALNAMES.SOAP_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.PRESCRIPTION) {
      return CACHE_LOCALNAMES.PRESCRIPTION_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.INJECTION) {
      return CACHE_LOCALNAMES.INJECTION_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.EXAMINATION) {
      return CACHE_LOCALNAMES.EXAM_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.CYTOLOGY) {
      return CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.PATHOLOGY) {
      return CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.BACTERIAL) {
      return CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.INSPECTION || nCategoryType == CATEGORY_TYPE.ENDOSCOPE) {
      return CACHE_LOCALNAMES.INSPECTION_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.TREATMENT) {
      return CACHE_LOCALNAMES.TREATMENT_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.HOMETREATMENT) {
      return CACHE_LOCALNAMES.TREATMENT_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.ALLERGY) {
      return CACHE_LOCALNAMES.ALLERGY_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.GUIDANCE) {
      return CACHE_LOCALNAMES.GUIDANCE_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.REHABILY) {
      return CACHE_LOCALNAMES.RIHABILY_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.RADIATION) {
      return CACHE_LOCALNAMES.RADIATION_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.DISCHARGE_PERMIT) {
      return CACHE_LOCALNAMES.DISCHARGE_PERMIT;
    } else if (nCategoryType == CATEGORY_TYPE.CHANGE_RESPONSIBILITY) {
      return CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY;
    } else if (nCategoryType == CATEGORY_TYPE.MEAL) {
      return CACHE_LOCALNAMES.MEAL_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.MEAL_GROUP) {
      return CACHE_LOCALNAMES.MEAL_GROUP_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.IN_HOSPITAL_APP || nCategoryType == CATEGORY_TYPE.IN_HOSPITAL_DEC) {
      return CACHE_LOCALNAMES.IN_HOSPITAL_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.STOP_PRESCRIPTION) {
      return CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.HOSPITAL_OUT) {
      return CACHE_LOCALNAMES.HOSPITAL_OUT;
    } else if (nCategoryType == CATEGORY_TYPE.HOSPITAL_RETURN) {
      return CACHE_LOCALNAMES.HOSPITAL_RETURN;
    } else if (nCategoryType == CATEGORY_TYPE.BACILLUS) {
      return CACHE_LOCALNAMES.BACILLUS_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.MEDICINE_GUIDANCE) {
      return CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT;
    } else if (nCategoryType == CATEGORY_TYPE.NUTRITION_GUIDANCE) {
      return CACHE_LOCALNAMES.NUTRITION_GUIDANCE;
    } else if (nCategoryType == CATEGORY_TYPE.MEDICAL_EXAMINATION_RECORD) {
      return CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD;
    } else if (nCategoryType == CATEGORY_TYPE.DISCHARGE_DONE) {
      return CACHE_LOCALNAMES.DISCHARGE_DONE;
    } else if (nCategoryType == CATEGORY_TYPE.DISCHARGE_DECISION) {
      return CACHE_LOCALNAMES.DISCHARGE_DECISION;
    } else if (nCategoryType == CATEGORY_TYPE.HOSPITAL_DONE) {
      return CACHE_LOCALNAMES.HOSPITAL_DONE;
    } else if (nCategoryType == CATEGORY_TYPE.DOCUMENT_CREATE) {
      return CACHE_LOCALNAMES.DOCUMENT_CREATE;
    } else if (nCategoryType == CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT) {
      return CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT;
    } else if (nCategoryType == CATEGORY_TYPE.DEATH_REGISTER) {
      return CACHE_LOCALNAMES.DEATH_REGISTER;
    }
  }
  
  contextContentMenuAction = (act, key, subkey, type) => {
    if (act == "changeDepartment_soap") {
      this.setState({
        changeDepartmentModal: true,
        soapType: type,
        departmentDate: "",
        departmentNumber: 0,
        departmentCode: 0,
        departmentName: ""
      });
    } else if(act == "changeKarteStatus_soap") {
      this.setState({
        changeKarteStatusModal: true,
        soapType: type,
        karteStatusCode: 0,
      });
    }
  }
  
  contextMenuSoapAction(soap_kind){
    this.setState({isSoapModal:true, soap_kind:soap_kind})
  }
  
  openSelectDiseaseModal (soap_kind){
    this.setState({isOpenSelectDiseaseModal:true, soap_kind:soap_kind})
  }
  
  getRows = string => {
    return (string.match(/\n/g) || []).length + 1;
  }
  
  stripHtml=(html)=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  
  onChangeCKEditArea = (evt,key) => {
    if (this.context.$getKarteMode(this.props.patientId) === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    let strip_data = this.stripHtml(evt.target.value);
    // if (evt.target.value =='<br>') return;
    let presData = this.state.presData;
    if (strip_data ==''){
      presData[key] = "";
    } else {
      presData[key] = evt.target.value;
    }
    let isForSave = true;
    if(presData.sharp_text === "" && presData.s_text === "" && presData.o_text === "" && presData.a_text === "" && presData.p_text === ""){
      isForSave = false;
    }
    if(isForSave){
      let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
      let presDataStr = JSON.stringify({
        user_number: userInfo.user_number,
        system_patient_id: this.props.patientId,
        data: presData,
        isForUpdate: this.props.isForUpdate,
        updateIndex: this.props.updateIndex,
        isForSave: isForSave
      });
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
    } else {
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT);
    }
    this.setState({presData}, ()=>{
      this.setSpaceAreaHeight();
    });
  }
  
  closeModal = () => {
    this.setState({
      isSoapModal:false,
      isOpenInspectionImageModal: false,
      isOpenSelectDiseaseModal:false,
      isOpenAlergyModal:false,
      isOpenEndoscopeReservationModal:false,
    })
  }
  
  setValue = (body_soap) => {
    if (body_soap == undefined || body_soap == null) return false;
    let presData = this.state.presData;
    Object.keys(body_soap).map(kind => {
      presData[kind.toLowerCase() + '_text'] = body_soap[kind];
    });
    this.setState({presData});
    let isForSave = true;
    if(presData.sharp_text === "" && presData.s_text === "" && presData.o_text === "" && presData.a_text === ""){
      isForSave = false;
    }
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    const presDataStr = JSON.stringify({
      user_number: userInfo.user_number,
      system_patient_id: this.props.patientId,
      data: presData,
      isForUpdate: this.props.isForUpdate,
      updateIndex: this.props.updateIndex,
      isForSave: isForSave
    });
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
    this.closeModal();
  }
  
  handleClick_hospital = (e, soap_kind) => {
    if (this.context.$getKarteMode(this.props.patientId) === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (e.type === "contextmenu") {
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu_hospital: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_hospital: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("soap-data")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_hospital: { visible: false }
          });
          document
            .getElementById("soap-data")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let clientX = e.clientX;
      let clientY = e.clientY;
      let insert_part_left = $('#insert_part').offset().left;
      this.props.closeRightClickMenu('right');
      this.setState({
        contextMenu_hospital: {
          visible: true,
          x: clientX - insert_part_left,
          y: clientY + window.pageYOffset - 120,
          soap_kind
        },
        contextMenu:{visible:false},
        hoverMenu:{visible:false},
        hoverSoapMenu:{visible:false},
      }, () => {
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight - 182;
        let insert_part_width = document.getElementsByClassName("insert_part")[0].offsetWidth;
        if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > (insert_part_width + insert_part_left))) {
          this.setState({
            contextMenu_hospital: {
              visible: true,
              x: clientX - menu_width - insert_part_left,
              y: clientY - menu_height + window.pageYOffset - 120,
              soap_kind
            },
          })
        } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < (insert_part_width + insert_part_left))) {
          this.setState({
            contextMenu_hospital: {
              visible: true,
              x: clientX - insert_part_left,
              y: clientY - menu_height + window.pageYOffset - 120,
              soap_kind
            },
          })
        } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > (insert_part_width + insert_part_left))) {
          this.setState({
            contextMenu_hospital: {
              visible: true,
              x: clientX-menu_width - insert_part_left,
              y: clientY + window.pageYOffset - 120,
              soap_kind
            },
          })
        }
      });
    }
  }
  
  handleClick = (e, soap_kind) => {
    if (this.context.$getKarteMode(this.props.patientId) === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (e.type === "contextmenu") {
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu_soap: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_soap: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("soap-data")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_soap: { visible: false }
          });
          document
            .getElementById("soap-data")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let clientX = e.clientX;
      let clientY = e.clientY;
      this.props.closeRightClickMenu('right');
      let insert_part_left = $('#insert_part').offset().left;
      this.setState({
        contextMenu_soap: {
          visible: true,
          x: clientX - insert_part_left,
          y: clientY + window.pageYOffset - 120,
          soap_kind
        },
        contextMenu:{visible:false},
        hoverMenu:{visible:false},
        hoverSoapMenu:{visible:false},
      }, ()=>{
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight - 182;
        let insert_part_width = document.getElementsByClassName("insert_part")[0].offsetWidth;
        if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > (insert_part_left + insert_part_width))) {
          this.setState({
            contextMenu_soap: {
              visible: true,
              x: clientX - menu_width - insert_part_left,
              y: clientY - menu_height + window.pageYOffset - 120,
              soap_kind
            },
          })
        } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < (insert_part_left + insert_part_width))) {
          this.setState({
            contextMenu_soap: {
              visible: true,
              x: clientX - insert_part_left,
              y: clientY - menu_height + window.pageYOffset - 120,
              soap_kind
            },
          })
        } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > (insert_part_left + insert_part_width))) {
          this.setState({
            contextMenu_soap: {
              visible: true,
              x: clientX-menu_width - insert_part_left,
              y: clientY + window.pageYOffset - 120,
              soap_kind
            },
          })
        }
      });
    }
  }
  
  orderHandleClick=(e, nCategoryType, nOperationType, nStampKey=0, key, type, create_at, pos_idx="", pos_type="")=>{
    this.pos_idx = pos_idx;
    this.pos_type = pos_type;
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // e.target.click();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({contextMenu:{visible: false}});
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({contextMenu:{visible: false}});
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let order_area_obj = document.getElementById("order-area");
    if(order_area_obj !== undefined && order_area_obj !== null) {
      document
        .getElementById("order-area")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({contextMenu:{visible: false}});
          document
            .getElementById("order-area")
            .removeEventListener(`scroll`, onScrollOutside);
        });
    }
    let order_type = "";
    if(nCategoryType == CATEGORY_TYPE.IN_HOSPITAL_APP){
      order_type = "hospital_application";
    } else if(nCategoryType == CATEGORY_TYPE.IN_HOSPITAL_DEC){
      order_type = "hospital_decision";
    } else if(nCategoryType == CATEGORY_TYPE.DOCUMENT_CREATE){
      order_type = "document";
    } else if(nCategoryType == CATEGORY_TYPE.NUTRITION_GUIDANCE){
      order_type = "guidance_nutrition_order";
    } else {
      order_type = this.getCategoryType(nCategoryType);
    }
    let seal_print_mode = this.seal_print_mode[order_type];
    let seal_print = karteApi.getSealAllVal(this.props.patientId);
    if(seal_print == null){seal_print = {};}
    if(seal_print_mode != 0){
      if(nStampKey == null){
        if(seal_print[order_type] === undefined || seal_print[order_type] == null){
          seal_print[order_type] = seal_print_mode == 1 ? 0: 1;
        }
      } else {
        if(seal_print[order_type] === undefined) {
          seal_print[order_type] = {};
          if (seal_print[order_type][nStampKey] == null || seal_print[order_type][nStampKey] === undefined){
            seal_print[order_type][nStampKey] = seal_print_mode == 1 ? 0: 1;
          }
        }
      }
    }
    //処方Do展開
    let preset_do_deployment_array = [];
    let preset_do_deployment_count = 0;
    let preset_do_deployment_cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESET_DO_DEPLOYMENT);
    let preset_do_deployment;
    if (preset_do_deployment_cache !== undefined && preset_do_deployment_cache != null){
      let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
      let patient_do_get_mode = initState.patient_do_get_mode;
      if(patient_do_get_mode == 0 || this.authInfo.staff_category === 1){
        preset_do_deployment = preset_do_deployment_cache;
      } else {
        if(this.context.selectedDoctor.code > 0 && preset_do_deployment_cache[this.context.selectedDoctor.code] !== undefined){
          preset_do_deployment = preset_do_deployment_cache[this.context.selectedDoctor.code];
        } else {
          preset_do_deployment = null;
        }
      }
    }
    if (preset_do_deployment !== undefined && preset_do_deployment != null){
      preset_do_deployment_count = preset_do_deployment.length;
    }
    if (preset_do_deployment_count !== 0) {
      if(preset_do_deployment_count === 1) {
        preset_do_deployment_array.push("処方Do展開");
      }
      if(preset_do_deployment_count > 1) {
        for (let i=1; i<=preset_do_deployment_count; i++) {
          let menu_str = "処方Do" + "(" + i +")" + "展開";
          preset_do_deployment_array.push(menu_str);
        }
      }
    }
    let preset_menu_array = [];
    if (type == "prescription" && this.context.$canDoAction(this.context.FEATURES.PRESET_DO_PRESCRIPTION,this.context.AUTHS.REGISTER)) { // 処方Do登録 menu
      let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
      let patient_do_max_number = initState.patient_do_max_number;
      let preset_do_data = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION);
      let preset_do_count = 0;
      if (preset_do_data == undefined || preset_do_data == null || preset_do_data.length == 0){
        preset_do_count = 1;
      } else {
        preset_do_count = preset_do_data.length >= patient_do_max_number ? patient_do_max_number: preset_do_data.length + 1;
      }
      if (preset_do_count == 1) {
        preset_menu_array.push("処方Do登録");
      } else {
        for (var i=1; i<=preset_do_count; i++) {
          let menu_str = "処方Do" + "(" + i +")" + "登録";
          preset_menu_array.push(menu_str);
        }
      }
    }
    let clientX = e.clientX;
    let clientY = e.clientY;
    this.props.closeRightClickMenu('right');
    let insert_part_left = $('#insert_part').offset().left;
    let state_data = {};
    state_data.contextMenu = {
      visible: true,
      x: clientX - insert_part_left,
      y: clientY + window.pageYOffset - 120,
      preset_menu_array,
      preset_do_deployment_array
    };
    state_data.categoryType = nCategoryType;
    state_data.categoryOperation = nOperationType;
    state_data.stampKey = nStampKey;
    state_data.seal_print = seal_print;
    state_data.content_key = key;
    state_data.content_type = type;
    state_data.create_at = create_at;
    state_data.contextMenu_soap = {visible:false};
    state_data.hoverMenu = {visible:false};
    state_data.hoverSoapMenu = {visible:false};
    this.setState(state_data, ()=>{
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
      let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
      let window_height = window.innerHeight - 182;
      let insert_part_width = document.getElementsByClassName("insert_part")[0].offsetWidth;
      if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > (insert_part_left + insert_part_width))) {
        state_data.contextMenu.x = clientX - menu_width - insert_part_left;
        state_data.contextMenu.y = clientY - menu_height + window.pageYOffset - 120;
        state_data.refreshRightBox = !this.state.refreshRightBox;
        this.setState(state_data);
      } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < (insert_part_left + insert_part_width))) {
        state_data.contextMenu.y = clientY - menu_height + window.pageYOffset - 120;
        state_data.refreshRightBox = !this.state.refreshRightBox;
        this.setState(state_data);
      } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > (insert_part_left + insert_part_width))) {
        state_data.contextMenu.x = clientX - menu_width - insert_part_left;
        state_data.refreshRightBox = !this.state.refreshRightBox;
        this.setState(state_data);
      }
    });
  }
  
  orderTitleClick=(e, nCategoryType, sort_index=null)=>{
    if (this.context.$getKarteMode(this.props.patientId) === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    let obj = $(e.target);
    while(!obj.hasClass("data-title") && obj.get(0).nodeName.toLowerCase() !== "body"){
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
    let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    if(nCategoryType === CATEGORY_TYPE.SOAP){
      if(sort_data != null && sort_data !== undefined && sort_data[0] !== undefined){
        sort_data[0] = {};
        sort_data[0]['open'] = !sort_data[0]['open'];
      } else {
        if(sort_data == null || sort_data === undefined){
          sort_data = {};
          sort_data[0] = {};
          sort_data[0]['open'] = false;
        } else {
          sort_data[0] = {};
          sort_data[0]['open'] = false;
        }
      }
    } else {
      if(sort_index == null) {return;}
      sort_data[sort_index]['open'] = !sort_data[sort_index]['open'];
    }
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT, JSON.stringify(sort_data));
    this.setSpaceAreaHeight();
  }
  
  onDoneClicked = (e, type, data, nCategoryType, nStampKey = 0) => {
    if(e.button == 2) { // if 右クリック
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      e.preventDefault();
      // e.target.click();
      if (nCategoryType != CATEGORY_TYPE.EXAMINATION) return;
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: {visible: false}});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let order_area_obj = document.getElementById("order-area");
      if (order_area_obj !== undefined && order_area_obj !== null) {
        document
          .getElementById("order-area")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({contextMenu: {visible: false}});
            document
              .getElementById("order-area")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      }
      let clientX = e.clientX;
      let clientY = e.clientY;
      this.props.closeRightClickMenu('right');
      let insert_part_left = $('#insert_part').offset().left;
      let state_data = {};
      state_data.contextMenu = {
        visible: true,
        x: clientX - insert_part_left,
        y: clientY + window.pageYOffset - 120,
        preset_menu_array:[],
        preset_do_deployment_array:[],
      };
      state_data.categoryType = nCategoryType;
      state_data.categoryOperation = OPERATION_TYPE.DONE;
      state_data.delNumber = data.number;
      state_data.stampKey = nStampKey;
      state_data.contextMenu_soap = {visible:false};
      state_data.hoverMenu = {visible:false};
      state_data.hoverSoapMenu = {visible:false};
      this.setState(state_data, ()=>{
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight - 182;
        let insert_part_width = document.getElementsByClassName("insert_part")[0].offsetWidth;
        if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > (insert_part_left + insert_part_width))) {
          state_data.contextMenu.x = clientX - menu_width - insert_part_left;
          state_data.contextMenu.y = clientY - menu_height + window.pageYOffset - 120;
          state_data.refreshRightBox = !this.state.refreshRightBox;
          this.setState(state_data);
        } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < (insert_part_left + insert_part_width))) {
          state_data.contextMenu.y = clientY - menu_height + window.pageYOffset - 120;
          state_data.refreshRightBox = !this.state.refreshRightBox;
          this.setState(state_data);
        } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > (insert_part_left + insert_part_width))) {
          state_data.contextMenu.x = clientX - menu_width - insert_part_left;
          state_data.refreshRightBox = !this.state.refreshRightBox;
          this.setState(state_data);
        }
      });
    } else { // if 左クリック
      let obj = $(e.target);
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
    }
  }
  
  onDeletedMedClicked = (e, type, data, nCategoryType) => {
    if(e.button == 2) { // if 右クリック
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: {visible: false}});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let order_area_obj = document.getElementById("order-area");
      if (order_area_obj !== undefined && order_area_obj !== null) {
        document
          .getElementById("order-area")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({contextMenu: {visible: false}});
            document
              .getElementById("order-area")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      }
      let clientX = e.clientX;
      let clientY = e.clientY;
      this.props.closeRightClickMenu('right');
      let insert_part_left = $('#insert_part').offset().left;
      let state_data = {};
      state_data.contextMenu = {
        visible: true,
        x: clientX - insert_part_left,
        y: clientY + window.pageYOffset - 120,
        preset_menu_array:[],
        preset_do_deployment_array:[],
      };
      state_data.categoryType = nCategoryType;
      state_data.categoryOperation = OPERATION_TYPE.DELETE;
      state_data.delNumber = data.number;
      state_data.contextMenu_soap = {visible:false};
      state_data.hoverMenu = {visible:false};
      state_data.hoverSoapMenu = {visible:false};
      this.setState(state_data, ()=>{
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight - 182;
        let insert_part_width = document.getElementsByClassName("insert_part")[0].offsetWidth;
        if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > (insert_part_left + insert_part_width))) {
          state_data.contextMenu.x = clientX - menu_width - insert_part_left;
          state_data.contextMenu.y = clientY - menu_height + window.pageYOffset - 120;
          state_data.refreshRightBox = !this.state.refreshRightBox;
          this.setState(state_data);
        } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < (insert_part_left + insert_part_width))) {
          state_data.contextMenu.y = clientY - menu_height + window.pageYOffset - 120;
          state_data.refreshRightBox = !this.state.refreshRightBox;
          this.setState(state_data);
        } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > (insert_part_left + insert_part_width))) {
          state_data.contextMenu.x = clientX - menu_width - insert_part_left;
          state_data.refreshRightBox = !this.state.refreshRightBox;
          this.setState(state_data);
        }
      });
    } else { // if 左クリック
      let obj = $(e.target);
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
    }
  }
  
  setHover=(e) => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let order_area_obj = document.getElementById("order-area");
    if(order_area_obj !== undefined && order_area_obj !== null) {
      document
        .getElementById("order-area")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({contextMenu:{visible: false}});
          document
            .getElementById("order-area")
            .removeEventListener(`scroll`, onScrollOutside);
        });
    }
    let insert_part_width = document.getElementsByClassName("insert_part")[0].offsetWidth;
    let context_menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
    let context_menu_left = document.getElementsByClassName('context-menu')[0].offsetLeft;
    let context_menu_top = document.getElementsByClassName('context-menu')[0].offsetTop;
    let menu_top = document.getElementsByClassName('set-hover-menu')[0].offsetTop;
    this.props.closeRightClickMenu('right');
    let state_data = {};
    state_data.hoverMenu = {
      visible: true,
      x: context_menu_left + context_menu_width,
      y: context_menu_top + menu_top,
    };
    this.setState(state_data, ()=>{
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      let menu_height = document.getElementsByClassName("hover-menu")[0].offsetHeight;
      let menu_width = document.getElementsByClassName("hover-menu")[0].offsetWidth;
      let window_height = window.innerHeight - 182;
      if (((context_menu_top + menu_top + menu_height) > window_height) && ((context_menu_left + context_menu_width + menu_width) > insert_part_width)) {
        state_data.hoverMenu.x = context_menu_left - menu_width;
        if(context_menu_left < menu_width){state_data.hoverMenu.x = 0;}
        state_data.hoverMenu.y = context_menu_top + menu_top - menu_height;
        state_data.refreshRightBox = !this.state.refreshRightBox;
        this.setState(state_data);
      } else if (((context_menu_top + menu_top + menu_height) > window_height) && ((context_menu_left + context_menu_width + menu_width) < insert_part_width)) {
        state_data.hoverMenu.y = context_menu_top + menu_top - menu_height;
        state_data.refreshRightBox = !this.state.refreshRightBox;
        this.setState(state_data);
      } else if (((context_menu_top + menu_top + menu_height) < window_height) && ((context_menu_left + context_menu_width + menu_width) > insert_part_width)) {
        state_data.hoverMenu.x = context_menu_left - menu_width;
        if(context_menu_left < menu_width){state_data.hoverMenu.x = 0;}
        state_data.refreshRightBox = !this.state.refreshRightBox;
        this.setState(state_data);
      }
    });
  }
  
  setSoapHover = (e, soap_kind, type=null) => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverSoapMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverSoapMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let insert_part_width = document.getElementsByClassName("insert_part")[0].offsetWidth;
    let context_menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
    let context_menu_left = document.getElementsByClassName('context-menu')[0].offsetLeft;
    let context_menu_top = document.getElementsByClassName('context-menu')[0].offsetTop;
    let menu_top = document.getElementsByClassName(type+'-hover-menu')[0].offsetTop;
    let state_data = {};
    this.props.closeRightClickMenu('right');
    state_data.hoverSoapMenu = {
      visible: true,
      x: context_menu_left + context_menu_width,
      y: context_menu_top + menu_top,
      soap_kind,
      soap_hover_type:type,
    };
    this.setState(state_data, ()=>{
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      let menu_width = document.getElementsByClassName("hover-soap-menu")[0].offsetWidth;
      if ((context_menu_left + context_menu_width + menu_width) > insert_part_width) {
        state_data.hoverSoapMenu.x = context_menu_left - menu_width;
        if(context_menu_left < menu_width){state_data.hoverSoapMenu.x = 0;}
        state_data.rightboxRefresh = !this.state.rightboxRefresh;
        this.setState(state_data);
      }
    });
  }
  
  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo && this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }
    return insurance;
  };
  
  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }
  
  onStopClicked = (e) => {
    if(e.button == 2) { // if 右クリック
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      e.preventDefault();
    } else { // if 左クリック
      let obj = $(e.target);
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
    }
  }
  
  confirmCancel=()=> {
    this.setState({
      confirm_message: "",
      confirm_type: "",
      confirm_alert_title: "",
      confirm_value: null,
      confirm_value2: null,
    });
  }
  
  prescriptionCacheDelete = () => {
    let cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.state.stampKey);
    if (cacheData !=  undefined && cacheData[0] != undefined) {
      let cache_number = cacheData[0].number;
      karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.state.stampKey);
      let cache_done_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
      let cache_done = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
      if (cache_done_history != null && cache_done_history.length > 0) {
        cache_done_history = cache_done_history.filter(x=>x.number!=cache_number);
      }
      if (cache_done != null && cache_done.length > 0) {
        cache_done = cache_done.map(medicine=>{
          if(medicine.number != cache_number){
            return medicine;
          }
        });
      }
      if (cache_done_history != null && cache_done_history.length > 0) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY, JSON.stringify(cache_done_history));
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE, JSON.stringify(cache_done));
      } else {
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
      }
    }
  }
  injectionCacheDelete = () => {
    let cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.state.stampKey);
    if (cacheData !=  undefined && cacheData[0] != undefined) {
      let cache_number = cacheData[0].number;
      karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.state.stampKey);
      let cache_done_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
      let cache_done = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE);
      if (cache_done_history != null && cache_done_history.length > 0) {
        cache_done_history = cache_done_history.filter(x=>x.number!=cache_number);
      }
      if (cache_done != null && cache_done.length > 0) {
        cache_done = cache_done.map(medicine=>{
          if(medicine.number != cache_number){
            return medicine;
          }
        });
      }
      if (cache_done_history != null && cache_done_history.length > 0) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY, JSON.stringify(cache_done_history));
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE, JSON.stringify(cache_done));
      } else {
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE);
      }
    }
  }
  
  confirmOk=async(btn_num=null)=>{
    let prescription_increase_obj = "";
    let injection_increase_obj = "";
    let cache_data = null;
    let state_data = {};
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    switch(this.state.confirm_type){
      case "11":  // 処方の編集取りやめ
        this.prescriptionCacheDelete();
        break;
      case "21":  // 注射の編集取りやめ
        this.injectionCacheDelete();
        break;
      case "00": // SOAP新規
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT);
        state_data.presData = {
          ...this.state.presData,
          a_text: "",
          o_text: "",
          p_text: "",
          s_text: "",
          sharp_text: "",
          updateDate: ""
        };
        break;
      case "01": // SOAP編集
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT);
        state_data.presData = {
          ...this.state.presData,
          a_text: "",
          o_text: "",
          p_text: "",
          s_text: "",
          sharp_text: "",
          updateDate: ""
        };
        this.props.setForUpdate();
        break;
      case "02": // SOAP削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.SOAP_DELETE, this.state.stampKey);
        break;
      case "10": // 処方新規
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.state.stampKey);
        state_data.prescriptionData = {
          type: "",
          data: []
        };
        break;
      case "1_edit": // 処方編集
        prescription_increase_obj = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.state.stampKey)[0];
        if (prescription_increase_obj.increasePeriod != undefined && prescription_increase_obj.increasePeriod == 1) {
          this.props.openPrescriptionIncreasePeriodModal(prescription_increase_obj.modal_data);
        } else {
          window.sessionStorage.setItem('prescription_before', JSON.stringify(karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.state.stampKey)));
          window.localStorage.setItem('prescription_origin_data', JSON.stringify(karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.state.stampKey)[0]));
          this.doubleClickEdit("prescription", this.state.stampKey);
        }
        break;
      case "12": // 処方削除
        this.cancelDelData();
        break;
      case "20": // 注射新規
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.state.stampKey);
        state_data.injectionData = {
          type: "",
          data: []
        };
        break;
      case "2_edit": // 注射編集
        injection_increase_obj = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.state.stampKey)[0];
        if (injection_increase_obj.increasePeriod != undefined && injection_increase_obj.increasePeriod == 1) {
          this.props.openPrescriptionIncreasePeriodModal(injection_increase_obj.modal_data);
        } else {
          window.sessionStorage.setItem('injection_before', JSON.stringify(karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.state.stampKey)));
          window.localStorage.setItem('prescription_origin_data', JSON.stringify(karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.state.stampKey)[0]));
          this.doubleClickEdit("injection", this.state.stampKey);
        }        
        break;
      case "22": // 注射削除
        this.cancelInjectDelData();
        break;
      case "30": // 検体検査
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT);
        state_data.examinationOrder = [];
        break;
      case "31": // 検体検査 編集
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT);
        state_data.examinationOrder = [];
        break;
      case "33": // 検体検査 実施
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_ORDER_DONE, this.state.stampKey);
        break;
      case "32": // 検体検査 の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.EXAM_DELETE, this.state.stampKey);
        break;
      case "3_edit": // 検体検査 の編集
        this.examinationShowModal(EXAMINATION_TYPE.EXAMINATION, this.state.stampKey);
        break;
      case "40": // 生理 の削除
      case "340": // 内視鏡 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, this.state.stampKey);
        break;
      case "41": // 生理編集 の削除
      case "341": // 内視鏡 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, this.state.stampKey);
        break;
      case "4_edit": // 生理 編集
      case "34_edit": // 内視鏡 編集
        cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, this.state.stampKey);
        if(cache_data.add_reserve == 1){
          state_data.isOpenEndoscopeReservationModal = true;
          state_data.reservation_info = cache_data;
          state_data.reserve_type = 'inspection_right';
        } else {
          this.props.showModal("edit_modal", "clickOpenPhysiologicalPopup", this.state.stampKey);
        }
        break;
      case "42": // 生理 の削除
      case "342": // 内視鏡 の削除
      case "344": // 内視鏡 の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_DELETE, this.state.stampKey);
        break;
      case "50": // 外来処置 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, this.state.stampKey);
        break;
      case "51": // 外来処置編集 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, this.state.stampKey);
        break;
      case "52": // 外来処置編集 の削除
      case "122": // 在宅処置編集 の削除
      case "252": // 入院処置編集 の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_DELETE, this.state.stampKey);
        break;
      case "5_edit": // 外来処置 編集
        this.props.showModal("edit_modal", "clickOpenOutpatientPopup", this.state.stampKey);
        // show edit modal
        break;
      case "60": // アレルギーの削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, this.state.stampKey);
        break;
      case "61": // アレルギー編集 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, this.state.stampKey);
        break;
      case "62": // アレルギーの削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_DELETE, this.state.stampKey);
        break;
      case "6_edit": // アレルギー編集
        this.props.showModal("edit_modal", "clickOpenAllergyPopup", this.state.stampKey);
        // show edit modal
        break;
      case "70": // 汎用オーダー の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_EDIT, this.state.stampKey);
        break;
      case "71": // 汎用オーダー編集 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_EDIT, this.state.stampKey);
        break;
      case "7_edit": // 汎用オーダー 編集
        this.props.showModal("edit_modal", "clickOpenGuidancePopup", this.state.stampKey);
        break;
      case "72": // 汎用オーダー の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_DELETE, this.state.stampKey);
        break;
      case "120": // 在宅処置 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, this.state.stampKey);
        break;
      case "121": // 在宅処置編集 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, this.state.stampKey);
        break;
      case "12_edit": // 在宅処置 編集
        this.props.showModal("edit_modal", "clickOpenHomeTreatmentPopup", this.state.stampKey);
        break;
      case CATEGORY_TYPE.HOSPITALTREATMENT + "0": // 入院処置 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, this.state.stampKey);
        break;
      case CATEGORY_TYPE.HOSPITALTREATMENT + "1": // 入院処置編集 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, this.state.stampKey);
        break;
      case CATEGORY_TYPE.HOSPITALTREATMENT + "2": // 入院処置編集 の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_DELETE, this.state.stampKey);
        break;
      case CATEGORY_TYPE.HOSPITALTREATMENT + "_edit": // 入院処置 編集
        this.props.showModal("edit_modal", "clickOpenHospitalTreatmentPopup", this.state.stampKey);
        break;
      case CATEGORY_TYPE.REHABILY + "0": // リハビリ の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT, this.state.stampKey);
        break;
      case CATEGORY_TYPE.REHABILY + "1": // リハビリ編集 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT, this.state.stampKey);
        break;
      case CATEGORY_TYPE.REHABILY + "2": // リハビリ編集 の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_DELETE, this.state.stampKey);
        break;
      case CATEGORY_TYPE.REHABILY + "_edit": // リハビリ 編集
        this.props.showModal("edit_modal", "clickOpenRehabilyPopup", this.state.stampKey);
        break;
      case CATEGORY_TYPE.MEDICINE_GUIDANCE + "0": // 服薬指導の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, this.state.stampKey);
        break;
      case CATEGORY_TYPE.MEDICINE_GUIDANCE + "1": // 服薬指導編集 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, this.state.stampKey);
        break;
      case CATEGORY_TYPE.MEDICINE_GUIDANCE + "_edit": // 服薬指導編集
        this.props.showModal("edit_modal", "clickOpenMedicineGuidance", this.state.stampKey);
        break;
      case CATEGORY_TYPE.RADIATION +'_edit':    //放射線 編集
        this.props.showModal("edit_modal", "clickOpenRadiationPopup", this.state.stampKey);
        break;
      case CATEGORY_TYPE.RADIATION.toString() + OPERATION_TYPE.REGIST.toString():   //放射線 削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, this.state.stampKey);
        break;
      case CATEGORY_TYPE.RADIATION.toString() + OPERATION_TYPE.EDIT.toString():   //放射線 編集の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, this.state.stampKey);
        break;
      case CATEGORY_TYPE.RADIATION.toString() + OPERATION_TYPE.DELETE.toString():   //放射線 削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.RADIATION_DELETE, this.state.stampKey);
        break;
      case CATEGORY_TYPE.BACILLUS +'_edit':    //細菌検査 編集
        this.props.showModal("edit_modal", "clickBacillusInspection", this.state.stampKey);
        break;
      case CATEGORY_TYPE.BACILLUS.toString() + OPERATION_TYPE.REGIST.toString():   //細菌検査 削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.BACILLUS_EDIT, this.state.stampKey);
        break;
      case "set_register":    //セット登録
        this.props.showModal("edit_modal", "clickOpenSetRegisterPopup");
        break;
      case "set_deployment":    //セット展開
        this.props.showModal("edit_modal", "clickOpenSetDeploymentPopup");
        break;
      case "prescription_do_set":    //処方Do登録
        this.m_cacheSerialNumber = this.state.content_subkey;
        this.registerNewSet("prescription_do_" + this.props.patientId.toString() + "_" + this.authInfo.name + "_" + (this.state.preset_do_count+1).toString(), 'soap', this.state.preset_do_count);
        break;
      case "130":    //退院許可の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
        break;
      case "131":    //退院許可の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
        break;
      case "13_edit":    //退院許可の編集
        this.props.showModal("edit_modal", "clickOpenDischargePermitOrder", this.state.stampKey);
        break;
      case "140": // 担当変更の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY, this.state.stampKey);
        break;
      case "141": // 担当変更編集 の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY, this.state.stampKey);
        break;
      case "14_edit": //担当変更編集
        this.props.showModal("edit_modal", "clickOpenChangeResponsibilityPopup", this.state.stampKey);
        break;
      case "142": // 担当変更削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE, this.state.stampKey);
        break;
      case "150": // 食事変更 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_EDIT, this.state.stampKey);
        break;
      case "15_edit": // 食事変更 編集
        this.props.showModal("edit_modal", "clickOpenChangeMealPopup", this.state.stampKey);
        break;
      case "160": // 入院申込オーダ の削除
      case "161": // 入院申込オーダ の削除
      case "170": // 入院決定オーダ の削除
      case "171": // 入院決定オーダ の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT, this.state.stampKey);
        break;
      case "16_edit": // 入院申込オーダ 編集
        this.props.showModal("edit_modal", "clickOpenHospitalApplicationOrder", this.state.stampKey);
        break;
      case "17_edit": // 入院決定オーダ 編集
        this.props.showModal("edit_modal", "clickOpenHospitalDecisionOrder", this.state.stampKey);
        break;
      case "162": // 担当変更削除
      case "172": // 担当変更削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_DELETE, this.state.stampKey);
        break;
      case "180": // 中止処方
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT);
        break;
      case "18_edit": // 中止処方 編集
        this.props.showModal("edit_modal", "clickOpenStopPrescriptionPopup", this.state.stampKey);
        break;
      case "190": // 外泊・外出 の削除
      case "200": // 帰院 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE, this.state.stampKey);
        break;
      case "19_edit": // 外泊・外出 編集
      case "20_edit": // 帰院 編集
        this.props.showModal("edit_modal", "clickOpenOutReturnHospitalPopup", this.state.stampKey);
        break;
      case "192": // 外泊実施
      case "202": // 帰院実施
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE, this.state.stampKey);
        break;
      case "23_edit": // 栄養指導依頼 編集
        this.props.showModal("edit_modal", "clickOpenNutritionGuidance", this.state.stampKey);
        break;
      case "230": // 栄養指導依頼 の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.NUTRITION_GUIDANCE, this.state.stampKey);
        break;
      case "231": // 栄養指導依頼 の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.NUTRITION_GUIDANCE, this.state.stampKey);
        break;
      case "240": // 診察済記録オーダ の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD, this.state.stampKey);
        break;
      case "260": // 退院実施の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DONE, this.state.stampKey);
        break;
      case "261": // 退院実施編集 の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DONE, this.state.stampKey);
        break;
      case "26_edit": //退院実施編集
        this.props.showModal("edit_modal", "clickOpenDischargeDoneOrder", this.state.stampKey);
        break;
      case "270": // 退院決定の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DECISION, this.state.stampKey);
        break;
      case "271": // 退院決定編集 の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DECISION, this.state.stampKey);
        break;
      case "27_edit": //退院決定編集
        this.props.showModal("edit_modal", "clickOpenDischargeDecisionOrder", this.state.stampKey);
        break;
      case "132": // 退院許可取り消し
      case "262": // 退院実施取り消し
      case "272": // 退院決定取り消し
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DELETE, this.state.stampKey);
        break;
      case "280": // 入院実施の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE, this.state.stampKey);
        break;
      case "281": // 入院実施編集 の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE, this.state.stampKey);
        break;
      case "28_edit": //入院実施編集
        this.props.showModal("edit_modal", "clickOpenHospitalDoneOrder", this.state.stampKey);
        break;
      case "282": // 転棟転室取り消し
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE, this.state.stampKey);
        break;
      case "290": // 食事一括指示 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT, this.state.stampKey);
        break;
      case "29_edit": // 食事一括指示 編集
        this.props.showModal("edit_modal", "clickOpenChangeMealGroupPopup", this.state.stampKey);
        break;
      case "300": // 文書作成の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_CREATE, this.state.stampKey);
        break;
      case "301": // 文書作成編集 の削除
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_CREATE, this.state.stampKey);
        break;
      case "30_edit": // 文書作成編集 の削除
        this.props.showModal("edit_modal", "clickOpenDocumentEdit", this.state.stampKey);
        break;
      case "302": // 文書作成の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_DELETE, this.state.stampKey);
        break;
      case "310": // 退院決定の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT, this.state.stampKey);
        break;
      case "311": // 退院決定編集 の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT, this.state.stampKey);
        break;
      case "31_edit": //退院決定編集
        this.props.showModal("edit_modal", "clickOpenDischargeGuidanceReport", this.state.stampKey);
        break;
      case "322": // 転棟転室取り消し
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.WARD_MOVE_DELETE, this.state.stampKey);
        break;
      case "330": //死亡登録 の削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER, this.state.stampKey);
        break;
      case "33_edit": // 死亡登録 編集
        this.props.showModal("edit_modal", "clickOpenDeathRegister", this.state.stampKey);
        break;
      case "332": // 死亡取り消し
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER_DELETE, this.state.stampKey);
        break;
      case "350": // 細胞診検査
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
        this.setState({
          examinationOrder: []
        });
        break;
      case "351": // 細胞診検査 削除
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
        state_data.examinationOrder = [];
        break;
      case "353": // 細胞診検査 実施
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DONE, this.state.stampKey);
        break;
      case "352": // 細胞診検査 の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE, this.state.stampKey);
        break;
      case "35_edit": // 細胞診検査 の編集
        this.examinationShowModal(EXAMINATION_TYPE.CYTOLOGY, this.state.stampKey);
        break;
      case "360": // 病理検査
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
        state_data.examinationOrder = [];
        break;
      case "361": // 病理検査 編集
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
        state_data.examinationOrder = [];
        break;
      case "363": // 病理検査 実施
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DONE, this.state.stampKey);
        break;
      case "362": // 病理検査 の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE, this.state.stampKey);
        break;
      case "36_edit": // 病理検査 の編集
        this.examinationShowModal(EXAMINATION_TYPE.PATHOLOGY, this.state.stampKey);
        break;
      case "370": // 細菌検査
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
        state_data.examinationOrder = [];
        break;
      case "371": // 細菌検査 編集
        karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
        state_data.examinationOrder = [];
        break;
      case "373": // 細菌検査 実施
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DONE, this.state.stampKey);
        break;
      case "372": // 細菌検査 の削除
        this.props.middleboxCancelDelData(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE, this.state.stampKey);
        break;
      case "37_edit": // 細菌検査 の編集
        this.examinationShowModal(EXAMINATION_TYPE.BACTERIAL, this.state.stampKey);
        break;
      case "soap_destruction": //soap破棄して展開
        this.dropSoapEvent(this.state.confirm_value, this.state.confirm_value2, btn_num == 2 ? 'add' : null); //btn_num == 2追記
        break;
    }
    // 実施時にシール印刷の入力を破棄反映
    let seal_print = karteApi.getSealAllVal(this.props.patientId);
    state_data.seal_print = seal_print;
    state_data.rightboxRefresh = !this.state.rightboxRefresh;
    state_data.confirm_alert_title = "";
    state_data.confirm_message = "";
    state_data.confirm_type = "";
    this.setState(state_data);
  }
  
  examinationShowModal = (examination_type, stampKey) => {
    let modalName = "検体検査";
    if (examination_type == 2) modalName = '細胞診検査';
    else if (examination_type == 3) modalName = '細菌・抗酸菌検査';
    else if (examination_type == 4) modalName = '病理組織検査';
    var menu_item = {
      examination_type: examination_type,
      modalName: modalName,
      stampKey,
    }
    this.props.showModal("edit_modal", "clickOpenExaminationPopup", menu_item);
  }
  
  setSealInCache() {
    karteApi.setSealAllVal(this.props.patientId, this.state.seal_print);
  }
  
  selectImportance = (e) => {
    if (this.context.$getKarteMode(this.props.patientId) === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    let presData = this.state.presData;
    presData['importance'] = e.target.value;
    this.setState({presData});
    // force refresh
    this.refresh_importance_option = 1;
    if (presData['a_text'] == "" && presData['o_text'] == "" && presData['s_text'] == "" && presData['p_text'] == "" && presData['sharp_text'] == "") return;
    
    let isForSave = true;
    if(presData.sharp_text === "" && presData.s_text === "" && presData.o_text === "" && presData.a_text === "" && presData.p_text === ""){
      isForSave = false;
    }
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    const presDataStr = JSON.stringify({
      user_number: userInfo.user_number,
      system_patient_id: this.props.patientId,
      data: presData,
      isForUpdate: this.props.isForUpdate,
      updateIndex: this.props.updateIndex,
      isForSave: isForSave
    });
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
  };
  
  colorPickerHover = (e) => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let color_picker_area = document.getElementsByClassName("color_picker_area")[0];
    let font_select_area = document.getElementsByClassName("font_select_area")[0];
    // eslint-disable-next-line consistent-this
    // const that = this;
    e.preventDefault();
    document.addEventListener(`click`, function onClickOutside(e) {
      var obj = e.target;
      do {
        if( obj.id !== undefined && obj.id != null && obj.id == "color_sel_icon") return;
        obj = obj.parentElement;
      } while(obj.tagName.toLowerCase() !== "body");
      color_picker_area.style['display'] = "none";
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      color_picker_area.style['display'] = "none";
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    color_picker_area.style['display'] = "block";
    font_select_area.style['display'] = "none";
    
  };
  
  fontPickerHover = (e) => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let font_select_area = document.getElementsByClassName("font_select_area")[0];
    let color_picker_area = document.getElementsByClassName("color_picker_area")[0];
    // eslint-disable-next-line consistent-this
    // const that = this;
    e.preventDefault();
    document.addEventListener(`click`, function onClickOutside(e) {
      var obj = e.target;
      do {
        if( obj.id != null && obj.id == "font_sel_icon") return;
        obj = obj.parentElement;
      } while(obj.tagName.toLowerCase() !== "body");
      font_select_area.style['display'] = "none";
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      font_select_area.style['display'] = "none";
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    font_select_area.style['display'] = "block";
    color_picker_area.style['display'] = "none";
    
  };
  
  boldBtnClicked =()=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let bold_btn = document.getElementsByClassName("bold-btn")[0];
    if(bold_btn.style['background-color'] == "rgb(170, 170, 170)"){
      bold_btn.style['background-color'] = "";
    } else {
      bold_btn.style['background-color'] = "#aaa";
    }
  }
  
  italicBtnClicked = ()=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let italic_btn = document.getElementsByClassName("italic-btn")[0];
    if(italic_btn.style['background-color'] == "rgb(170, 170, 170)"){
      italic_btn.style['background-color'] = "";
    } else {
      italic_btn.style['background-color'] = "#aaa";
    }
  }
  
  soapColorChange = (text, color) => {
    if(text == null) return "";
    text = text.split("\"").join("'");
    return text.replace(/color='#[0-9a-f]+'/gi, "color='" + color + "'");
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
  
  getInsertEditArea=()=>{
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    let patientInfo = karteApi.getPatient(this.props.patientId);
    //保険
    let patient_insurance_name = "";
    if(patientInfo != undefined && patientInfo != null){
      let patient_insurance_type = patientInfo.insurance_type != undefined ? parseInt(patientInfo.insurance_type) : 0;
      if(patientInfo.insurance_type_list != undefined && patientInfo.insurance_type_list != null && patientInfo.insurance_type_list.length > 0){
        patient_insurance_name = patientInfo.insurance_type_list.find((x) => x.code == patient_insurance_type) != undefined ? patientInfo.insurance_type_list.find((x) => x.code == patient_insurance_type).name : "";
      }
    }

    // ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
    // get 施設 info
    let visit_place_id = 0;
    let visit_place_name = "";  
    let cur_karte_status_code = this.context.karte_status.code;
    if (patientInfo != undefined && patientInfo != null && patientInfo.visit_info != undefined && patientInfo.visit_info != null) {      
      if (patientInfo.visit_info.visit_place_id != undefined && patientInfo.visit_info.visit_place_id != null && patientInfo.visit_info.visit_place_id > 0 && cur_karte_status_code == 2) {
        visit_place_id = patientInfo.visit_info.visit_place_id;
        visit_place_name = patientInfo.visit_info.place_name;
      }
    }
       
    //soap
    let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    let insert_data = null;
    if(sort_data !== undefined && sort_data != null && Object.keys(sort_data).length > 0){
      insert_data = Object.keys(sort_data).map(sort_index=>{
        if(sort_data[sort_index]['order_key'] !== undefined){
          let key = sort_data[sort_index]['order_key'].split(':')[0];
          let subkey = sort_data[sort_index]['order_key'].split(':')[1];
          if(subkey !== undefined){
            let cache_data = karteApi.getSubVal(this.props.patientId, key, subkey);
            if(cache_data === undefined || cache_data == null) return <></>;
            department_name = this.getDepartmentName(cache_data, key);            
            if(key == CACHE_LOCALNAMES.INSPECTION_EDIT){
              return (
                <>
                  <div className={"data-list"} key={subkey}>
                    <div
                      className="data-title"
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.inspection_id == 17 ? CATEGORY_TYPE.ENDOSCOPE : CATEGORY_TYPE.INSPECTION),
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        (cache_data.inspection_id == 17 ? "endoscope" : "inspection"),
                        cache_data.created_at
                      )}
                      onClick={(e)=>this.orderTitleClick(e, (cache_data.inspection_id == 17 ? CATEGORY_TYPE.ENDOSCOPE : CATEGORY_TYPE.INSPECTION), sort_index)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">
                            【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・
                            {getInspectionName(cache_data.inspection_id)}】 { cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate == 1 ? (
                          <>
                            <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at) : ""}</div>
                            {cache_data.last_doctor_code !== undefined && (
                              <div style={{textAlign:"left"}}>
                                {this.authInfo.staff_category === 1 ? (
                                  <>
                                    {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                    )}
                                  </>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code <= 0 ? (
                                      <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                    ):(
                                      <>
                                        {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                          <div>医師：{cache_data.last_doctor_name}</div>
                                        ):(
                                          <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                              <div style={{textAlign:"left"}}>
                                <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                              </div>
                            )}
                          </>
                        ):(
                          <>
                            {visit_place_id > 0 && visit_place_name != "" && (
                              <div style={{textAlign:"left"}}>
                                <div>施設名：{visit_place_name}</div>                            
                              </div>
                            )}
                          </> 
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.inspection_id == 17 ? CATEGORY_TYPE.ENDOSCOPE : CATEGORY_TYPE.INSPECTION),
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        (cache_data.inspection_id == 17 ? "endoscope" : "inspection"),
                        cache_data.created_at
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenPhysiologicalPopup", subkey)}
                      style={{color:cache_data.isForUpdate == 1 ? "rgb(0, 0, 255)" : "", display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open' + (cache_data.isForUpdate == 1?' line-done':'')}>
                          <div className="history-item">
                            <div className="phy-box w70p">
                              {cache_data.multi_reserve_flag != 1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査日</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.inspection_DATETIME === "日未定" ? "[日未定]" : (formatJapanDateSlash(cache_data.inspection_DATETIME)
                                        + ((cache_data.reserve_time !== undefined && cache_data.reserve_time !== "") ? " "+cache_data.reserve_time : "")
                                      )}
                                      {cache_data.is_emergency == 1 && renderHTML("<span className='note-red'>[当日緊急]</span>")}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment cache-insurance-name">{getInsuranceName(patient_insurance_name)}</div>
                                </div>
                              </div>
                              {cache_data.classification1_name !== undefined && cache_data.classification1_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査種別</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.classification1_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.classification2_name !== undefined && cache_data.classification2_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査詳細</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.classification2_name}</div>
                                  </div>
                                </div>
                              )}
                              {/* ---------- start 内視鏡------------- */}
                              {cache_data.inspection_type_name !== undefined && cache_data.inspection_type_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査種別</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.inspection_type_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.inspection_item_name !== undefined && cache_data.inspection_item_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査項目</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.inspection_item_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.endoscope_purpose_name !== undefined && cache_data.endoscope_purpose_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査目的</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.endoscope_purpose_name}</div>
                                  </div>
                                </div>
                              )}
                              {/* ----------- end ------------ */}
                              {cache_data.inspection_purpose !== undefined && cache_data.inspection_purpose != null && cache_data.inspection_purpose.length > 0 && (
                                <>
                                  {cache_data.inspection_purpose.map((item, index) =>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">検査目的</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_symptom !== undefined && cache_data.inspection_symptom != null && cache_data.inspection_symptom.length > 0 && (
                                <>
                                  {cache_data.inspection_symptom.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">現症</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_risk !== undefined && cache_data.inspection_risk != null && cache_data.inspection_risk.length > 0 && (
                                <>
                                  {cache_data.inspection_risk.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_sick !== undefined && cache_data.inspection_sick != null && cache_data.inspection_sick.length > 0 && (
                                <>
                                  {cache_data.inspection_sick.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_request !== undefined && cache_data.inspection_request != null && cache_data.inspection_request.length > 0 && (
                                <>
                                  {cache_data.inspection_request.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.is_anesthesia !== undefined && cache_data.is_anesthesia != null && cache_data.is_anesthesia.length > 0 && (
                                <>
                                  {cache_data.is_anesthesia.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.is_sedation !== undefined && cache_data.is_sedation != null && cache_data.is_sedation.length > 0 && (
                                <>
                                  {cache_data.is_sedation.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_movement !== undefined && cache_data.inspection_movement != null && cache_data.inspection_movement.length > 0 && (
                                <>
                                  {cache_data.inspection_movement.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">患者移動形態</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {(cache_data.done_height !== undefined || (cache_data.height !== undefined && cache_data.height != null && cache_data.height !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">身長</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.done_height != undefined ? cache_data.done_height : cache_data.height}cm</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.done_weight !== undefined || (cache_data.weight !== undefined && cache_data.weight != null && cache_data.weight !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">体重</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.done_weight !== undefined ? cache_data.done_weight : cache_data.weight}kg</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.done_surface_area !== undefined || (cache_data.surface_area !== undefined && cache_data.surface_area != null && cache_data.surface_area != "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">体表面積</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.done_surface_area !== undefined ? cache_data.done_surface_area : cache_data.surface_area}㎡</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.connection_date_title !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{cache_data.connection_date_title}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.calculation_start_date)}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.sick_name !== undefined && cache_data.sick_name != null && cache_data.sick_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">臨床診断、病名</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.sick_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.etc_comment !== undefined && cache_data.etc_comment != null && cache_data.etc_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">
                                      <p>主訴、臨床経過</p>
                                      <p>検査目的、コメント</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.etc_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.special_presentation !== undefined && cache_data.special_presentation !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">特殊指示</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.special_presentation}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.count !== undefined && cache_data.count !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{cache_data.count_label !=='' ? cache_data.count_label : ''}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.count}{cache_data.count_suffix !== '' ? cache_data.count_suffix : ''}</div>
                                  </div>
                                </div>
                              )}
                              {((cache_data.done_body_part !== undefined && cache_data.done_body_part !== "") || (cache_data.done_body_part === undefined && cache_data.body_part !== undefined && cache_data.body_part !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">部位指定コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className={'table-item remarks-comment'}>
                                      {cache_data.done_body_part !== undefined ? cache_data.done_body_part : cache_data.body_part}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.state == 2 && (
                                <>
                                  {cache_data.done_result !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">結果</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{displayLineBreak(cache_data.done_result) + " " + cache_data.result_suffix}</div>
                                      </div>
                                    </div>
                                  )}
                                  {cache_data.done_comment !== undefined && cache_data.done_comment != null && cache_data.done_comment !== "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">実施コメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{displayLineBreak(cache_data.done_comment)}</div>
                                      </div>
                                    </div>
                                  )}
                                  {cache_data.details !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item"> </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {cache_data.details.map(detail=>{
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
                              {cache_data.imgBase64 !== undefined && cache_data.imgBase64 != null && cache_data.imgBase64 !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      <a
                                        className="soap-image-title"
                                        onClick={() => this.openInspectionImageModal(cache_data.imgBase64)}
                                        style={imageButtonStyle}
                                      >
                                        画像を見る
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.additions !== undefined && Object.keys(cache_data.additions).length > 0 && (
                                <MedicineListWrapper font_props = {this.props.font_props}>
                                  <div className="open order">
                                    <div className="history-item">
                                      <div className="phy-box w70p" draggable="true">
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">追加指示等</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {Object.keys(cache_data.additions).map(addition=>{
                                                return(
                                                  <>
                                                    <span>{cache_data.additions[addition].name}</span><br />
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </MedicineListWrapper>
                              )}
                              {cache_data.multi_reserve_flag == 1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">実施/予定情報</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{getMultiReservationInfo(cache_data.reserve_data)}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.start_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">開始日時</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {formatJapanDateSlash(cache_data.start_date) + " " + formatTimeIE(new Date(cache_data.start_date.split('-').join('/')))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.continue_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{getInspectionMasterInfo(cache_data.inspection_id, 'performed_multiple_times_type') == 1 ? "実施情報" : "継続登録"}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {this.getContinueDate(cache_data.continue_date)}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.end_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">終了日時</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {formatJapanDateSlash(cache_data.start_date) + " " + formatTimeIE(new Date(cache_data.start_date.split('-').join('/')))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.RADIATION_EDIT){
              let radiation_karte_status_name = cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : "";
              return (
                <>
                  <div className={"data-list"} key={subkey}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.RADIATION, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.RADIATION,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "radiation",
                        cache_data.created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">{'【'+ radiation_karte_status_name + '・' + '放射線 ' + cache_data.radiation_name + '】'}&nbsp;&nbsp;{ cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate == 1 ? (
                          <>
                            <div className="date">
                              {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                            </div>
                            {cache_data.last_doctor_code !== undefined && (
                              <div style={{textAlign:"left"}}>
                                {this.authInfo.staff_category === 1 ? (
                                  <>
                                    {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                    )}
                                  </>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code <= 0 ? (
                                      <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                    ):(
                                      <>
                                        {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                          <div>医師：{cache_data.last_doctor_name}</div>
                                        ):(
                                          <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                              <div style={{textAlign:"left"}}>
                                <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                              </div>
                            )}
                          </>
                        ):(
                          <>
                            {visit_place_id > 0 && visit_place_name != "" && (
                              <div style={{textAlign:"left"}}>
                                <div>施設名：{visit_place_name}</div>                            
                              </div>
                            )}
                          </> 
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.RADIATION,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "radiation",
                        cache_data.created_at
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenRadiationPopup", subkey)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={"history-item soap-data-item open order" + (cache_data.isForUpdate == 1?' line-done':'')}>
                          <RadiationData
                            data = {cache_data}
                            patientId = {this.props.patientId}
                          />
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.TREATMENT_EDIT){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, (cache_data.general_id === 2 ? CATEGORY_TYPE.HOMETREATMENT : cache_data.general_id === 3 ? CATEGORY_TYPE.HOSPITALTREATMENT : CATEGORY_TYPE.TREATMENT), sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.general_id === 2 ? CATEGORY_TYPE.HOMETREATMENT : cache_data.general_id === 3 ? CATEGORY_TYPE.HOSPITALTREATMENT : CATEGORY_TYPE.TREATMENT),
                        (cache_data.header.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "treatment",
                        cache_data.created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・{cache_data.general_id === 2 ? "在宅処置" : cache_data.general_id === 3 ? "入院処置" : "外来処置"}】 { cache_data.header.isForUpdate == 1 && " ＜編集＞"}{cache_data.increasePeriod == 1 ? "(継続登録)":""}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.header.isForUpdate == 1 ? (
                          <>
                            <div className="date">
                              {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                            </div>
                            {cache_data.last_doctor_code !== undefined && (
                              <div style={{textAlign:"left"}}>
                                {this.authInfo.staff_category === 1 ? (
                                  <>
                                    {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                    )}
                                  </>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code <= 0 ? (
                                      <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                    ):(
                                      <>
                                        {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                          <div>医師：{cache_data.last_doctor_name}</div>
                                        ):(
                                          <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                              <div style={{textAlign:"left"}}>
                                <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                              </div>
                            )}
                          </>
                        ):(
                          <>
                            {visit_place_id > 0 && visit_place_name != "" && (
                              <div style={{textAlign:"left"}}>
                                <div>施設名：{visit_place_name}</div>                            
                              </div>
                            )}
                          </> 
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.general_id === 2 ? CATEGORY_TYPE.HOMETREATMENT : cache_data.general_id === 3 ? CATEGORY_TYPE.HOSPITALTREATMENT : CATEGORY_TYPE.TREATMENT),
                        (cache_data.header.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "treatment",
                        cache_data.created_at
                      )}
                      onDoubleClick={()=>this.doubleClickEdit(cache_data.general_id === 2 ? "clickOpenHomeTreatmentPopup" : cache_data.general_id === 3 ? "clickOpenHospitalTreatmentPopup" :"clickOpenOutpatientPopup", subkey)}
                      style={{color: cache_data.header.isForUpdate == 1 ? "rgb(255, 0, 0)" : "",display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item" + (cache_data.header.isForUpdate == 1?' line-done':'')}>
                            <div className="phy-box w70p" draggable="true">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">処置日</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {cache_data.header.date === "" ? ""
                                      : ((cache_data.header.start_time === "" || cache_data.header.start_time === null) ?
                                        formatJapanDateSlash(cache_data.header.date)
                                        : formatJapanDateSlash(cache_data.header.date)+"  "+cache_data.header.start_time)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment cache-insurance-name">
                                    {getInsuranceName(cache_data.header.insurance_name)}
                                  </div>
                                </div>
                              </div>
                              {cache_data.detail.map(item=>{
                                return (
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
                                                <label style={{width: "2.5rem"}}>{sub_item.x_value}cm</label>
                                                <label className="ml-1 mr-1">×</label>
                                                <label style={{width: "2.5rem"}}>{sub_item.y_value}cm</label>
                                                <label className="ml-1 mr-1">=</label>
                                                <label style={{width: "3rem"}}>{sub_item.total_x_y}㎠</label>
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
                                    {(item.treat_done_info !== undefined && item.treat_done_info.length > 0) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
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
                                    {item.done_comment !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{displayLineBreak(item.done_comment)}</div>
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
                                  </>
                                )
                              })}
                              {cache_data.item_details !== undefined && cache_data.item_details.length>0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"> </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.item_details.map(detail=>{
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
                              {cache_data.additions !== undefined && Object.keys(cache_data.additions).length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">追加指示等</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {Object.keys(cache_data.additions).map(addition=>{
                                        return(
                                          <>
                                            <span>{cache_data.additions[addition].name}</span><br />
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
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.ALLERGY_EDIT){
              let body1_title = "";
              let body2_title = "";
              let alergy_title = "";
              switch (cache_data.type) {
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
                  body1_title = "入院時身体所見";
                  body2_title = "入院時検査所見";
                  alergy_title = "入院時現症";
                  break;
              }
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.ALLERGY, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.ALLERGY, (cache_data.isForUpdate ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), subkey)}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・{alergy_title}】 { cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate === 1 && cache_data.last_doctor_code !== undefined && (
                          <>
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                          {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                            <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                            </div>
                          )}
                          </>
                        )}
                        {cache_data.isForUpdate != 1 && visit_place_id > 0 && visit_place_name != "" && (
                          <div style={{textAlign:"left"}}>
                            <div>施設名：{visit_place_name}</div>                            
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown}/>
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.ALLERGY, (cache_data.isForUpdate ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), subkey)}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenAllergyPopup", subkey)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item" + (cache_data.isForUpdate == 1?' line-done':'')}>
                            <div className="phy-box w70p" draggable="true">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">{body1_title}</div>
                                </div>
                                <div className="text-right">
                                  <div
                                    className="table-item remarks-comment">{displayLineBreak(cache_data.body_1)}</div>
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
                                        {cache_data.type == "current_symptoms_on_admission" && (
                                          <>
                                            {cache_data.optional_json != undefined && cache_data.optional_json['tpha'] != 0 && (
                                              <span className="mr-2">TPHA：{cache_data.optional_json['tpha'] == 1 ? "(+)": cache_data.optional_json['tpha'] == 2 ? "(-)" : "(±)"}</span>
                                            )}
                                            {cache_data.optional_json != undefined && cache_data.optional_json['hbs_ag'] != 0 && (
                                              <span className="mr-2">HBs-Ag：{cache_data.optional_json['hbs_ag'] == 1 ? "(+)": cache_data.optional_json['hbs_ag'] == 2 ? "(-)" : "(±)"}</span>
                                            )}
                                            {cache_data.optional_json != undefined && cache_data.optional_json['hcv_Ab'] != 0 && (
                                              <span className="mr-2">HCV-Ab：{cache_data.optional_json['hcv_Ab'] == 1 ? "(+)": cache_data.optional_json['hcv_Ab'] == 2 ? "(-)" : "(±)"}</span>
                                            )}
                                            {cache_data.optional_json != undefined && cache_data.optional_json['hiv'] != 0 && (
                                              <span className="mr-2">HIV：{cache_data.optional_json['hiv'] == 1 ? "(+)": cache_data.optional_json['hiv'] == 2 ? "(-)" : "(±)"}</span>
                                            )}
                                            {(cache_data.optional_json != undefined && cache_data.optional_json['tpha'] != 0) ||
                                            (cache_data.optional_json != undefined && cache_data.optional_json['hbs_ag'] != 0) ||
                                            (cache_data.optional_json != undefined && cache_data.optional_json['hcv_Ab'] != 0) ||
                                            (cache_data.optional_json != undefined && cache_data.optional_json['hiv'] != 0) ? (
                                              <br />
                                            ):(<></>)
                                            }
                                          </>
                                        )}
                                        {(cache_data.type === "infection" || cache_data.type === "alergy") ? ALLERGY_STATUS_ARRAY[parseInt(cache_data.body_2)] : displayLineBreak(cache_data.body_2)}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.GUIDANCE_EDIT){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.GUIDANCE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.GUIDANCE,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "guidance",
                        cache_data.created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・汎用オーダー】{cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate == 1 ? (
                          <>
                            <div className="date">
                              {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                            </div>
                            {cache_data.last_doctor_code !== undefined && (
                              <div style={{textAlign:"left"}}>
                                {this.authInfo.staff_category === 1 ? (
                                  <>
                                    {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                    )}
                                  </>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code <= 0 ? (
                                      <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                    ):(
                                      <>
                                        {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                          <div>医師：{cache_data.last_doctor_name}</div>
                                        ):(
                                          <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                              <div style={{textAlign:"left"}}>
                                <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                              </div>
                            )}
                          </>
                        ):(
                          <>
                            {visit_place_id > 0 && visit_place_name != "" && (
                              <div style={{textAlign:"left"}}>
                                <div>施設名：{visit_place_name}</div>                            
                              </div>
                            )}
                          </> 
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.GUIDANCE,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "guidance",
                        cache_data.created_at
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenGuidancePopup", subkey)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item" + (cache_data.isForUpdate == 1?' line-done':'')}>
                            <div className="phy-box w70p" draggable="true">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">日付</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {cache_data.treat_date === "" ? "" : formatJapanDateSlash(cache_data.treat_date)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment cache-insurance-name">{getInsuranceName(patient_insurance_name)}</div>
                                </div>
                              </div>
                              {(cache_data.karte_description_name != undefined && cache_data.karte_description_name != null && cache_data.karte_description_name != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">カルテ記述名称</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.karte_description_name}</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.additions != undefined && cache_data.additions != null && Object.keys(cache_data.additions).length > 0) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">追加指示等</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {Object.keys(cache_data.additions).map(addition=>{
                                        return(
                                          <>
                                            <span>{cache_data.additions[addition].name}</span><br />
                                          </>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.karte_text_data != undefined && cache_data.karte_text_data != null && cache_data.karte_text_data.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">カルテ記述内容</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.karte_text_data.map(karte_text=>{
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
                              {(cache_data.comment !== undefined && cache_data.comment != null && cache_data.comment != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.details !== undefined && cache_data.details != null && cache_data.details.length>0 && cache_data.details.findIndex(x=>x.is_enabled==1) > -1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"> </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.details.map(detail=>{
                                        if(detail.is_enabled === undefined || (detail.is_enabled !== undefined && detail.is_enabled == 1)){
                                          return(
                                            <>
                                              <div><label>・{detail.item_name}
                                                {((detail.value1 != undefined && detail.value1 != null && detail.value1 !== "") || (detail.value2 != undefined && detail.value2 != null && detail.value2 !== ""))? "：": ""}</label>
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
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.RIHABILY_EDIT){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.REHABILY, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.REHABILY,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "rehabily",
                        cache_data.created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・リハビリ】  { cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate == 1 ? (
                          <>
                            <div className="date">
                              {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                            </div>
                            {cache_data.last_doctor_code !== undefined && (
                              <div style={{textAlign:"left"}}>
                                {this.authInfo.staff_category === 1 ? (
                                  <>
                                    {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                    )}
                                  </>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code <= 0 ? (
                                      <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                    ):(
                                      <>
                                        {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                          <div>医師：{cache_data.last_doctor_name}</div>
                                        ):(
                                          <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                              <div style={{textAlign:"left"}}>
                                <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                              </div>
                            )}
                          </>
                        ):(
                          <>
                            {visit_place_id > 0 && visit_place_name != "" && (
                              <div style={{textAlign:"left"}}>
                                <div>施設名：{visit_place_name}</div>                            
                              </div>
                            )}
                          </> 
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      className={cache_data.isForUpdate == 1 ? 'line-done' : ''}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.REHABILY,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "rehabily",
                        cache_data.created_at
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenRehabilyPopup", subkey)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <RehabilyOrderData
                        rehabily_data={cache_data}
                        edit_flag={true}
                        patient_insurance_name={patient_insurance_name}
                      />
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.MEDICINE_GUIDANCE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.MEDICINE_GUIDANCE,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "medicine_guidance",
                        cache_data.created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【入院・服薬指導】  { cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate == 1 ? (
                          <div className="date">
                            <>
                              {cache_data.created_at !== undefined && cache_data.created_at != null && cache_data.created_at !== "" ?
                                formatJapanSlashDateTime(cache_data.created_at):""}
                              {cache_data.last_doctor_code !== undefined && (
                                <div style={{textAlign:"left"}}>
                                  {this.authInfo.staff_category === 1 ? (
                                    <>
                                      {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                        <div>医師：{cache_data.last_doctor_name}</div>
                                      ):(
                                        <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                      )}
                                    </>
                                  ):(
                                    <>
                                      {this.context.selectedDoctor.code <= 0 ? (
                                        <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                      ):(
                                        <>
                                          {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                            <div>医師：{cache_data.last_doctor_name}</div>
                                          ):(
                                            <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                              {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                                <div style={{textAlign:"left"}}>
                                  <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                                </div>
                              )}
                            </>
                          </div>
                        ):(
                          <>
                            {visit_place_id > 0 && visit_place_name != "" && (
                              <div style={{textAlign:"left"}}>
                                <div>施設名：{visit_place_name}</div>                            
                              </div>
                            )}
                          </> 
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.MEDICINE_GUIDANCE,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "medicine_guidance",
                        cache_data.created_at
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenMedicineGuidance", subkey)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineGuidanceOrderData
                        cache_data={cache_data}
                      />
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.PRESCRIPTION_EDIT){
              let prescription_category = cache_data[0].is_internal_prescription == 0?"院外" : "院内";
              if(parseInt(cache_data[0].karte_status_code) == 1) prescription_category = HOSPITALIZE_PRESCRIPTION_TYPE[cache_data[0].is_internal_prescription].value;
              if(cache_data[0].isUpdate == 1 && cache_data[0].temp_saved != undefined && cache_data[0].temp_saved == 1){
                return (
                  <>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.PRESCRIPTION, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.PRESCRIPTION,
                        OPERATION_TYPE.EDIT,
                        subkey,
                        key,
                        "prescription",
                        cache_data[0].created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data[0].karte_status_name}・{prescription_category}処方】 {this.state.isPrescriptionDone == 0 ?'＜編集＞':'＜編集して実施＞'}{cache_data[0].increasePeriod != undefined && cache_data[0].increasePeriod == 1 ? "(継続登録)":""}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <div className="date" style={{textAlign:"left"}}>
                          {cache_data[0].created_at !== undefined && cache_data[0].created_at !== "" ?
                            formatJapanSlashDateTime(cache_data[0].created_at):
                            (cache_data[0].time !== undefined && cache_data[0].time !== "" ? formatJapanSlashDateTime(cache_data[0].time):"")}
                        </div>
                        {cache_data[0].last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data[0].last_doctor_code ? (
                                  <div>医師：{cache_data[0].last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data[0].last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data[0].last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data[0].last_doctor_code ? (
                                      <div>医師：{cache_data[0].last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data[0].last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )} 
                        {cache_data[0].visit_place_id != undefined && cache_data[0].visit_place_id != null && cache_data[0].visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data[0].visit_place_id)}</div>                            
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.PRESCRIPTION,
                        OPERATION_TYPE.EDIT,
                        subkey,
                        key,
                        "prescription",
                        cache_data[0].created_at
                      )}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                      onDoubleClick={cache_data[0].increasePeriod != 1 ? ()=>this.doubleClickEdit("prescription", subkey): ""}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={`history-item soap-data-item open order line-done`}>
                          {cache_data[0].presData.filter(item => {
                            return item.medicines.length > 0 && item.medicines[0].medicineId > 0;
                          }).map((item, key)=>{
                            let keyName = {                              
                              one_dose_package: "一包化",
                              temporary_medication: "臨時処方",
                              mixture:"混合"
                            };
                            
                            let sameKeys = this.getCheckSameOptions(item);
                            let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptions(item, sameKeys) : "";
                            let sameOptionsView;                            
                            if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {                              
                              sameOptionsView = (
                                <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
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
                            
                            return (
                              <div className="history-item" key={key}>
                                <div className="box w70p" draggable="true">
                                  {item.medicines.length > 0 && item.medicines.filter(medicine_item => {
                                    return medicine_item.medicineId > 0;
                                  }).map((medicine_item, medicine_key)=>{
                                    return (
                                      <>
                                        <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                          <div className="flex between">
                                            <div className="flex full-width table-item text-right">
                                              <div className="number align-left" style={underLine}>
                                                {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                              </div>
                                              
                                              <div className="ml-3 full-width w100 align-left">
                                                {medicine_item.medicineName}
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
                                                      <p className='text-right' key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                                  <div className="flex between drug-item table-row">
                                    <div className="text-right">
                                      <div className="table-item">
                                        {item.usageName && (
                                          <>
                                            <label>用法: </label>
                                            <label>{item.usageName}</label>
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
                                  {sameOptionsView}
                                  {item.start_date !== undefined && item.start_date !== "" && (item.administrate_period == undefined || item.administrate_period == null) && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        <label>処方開始日: </label>
                                        <label>{formatJapanDateSlash(formatDate(item.start_date))}</label>
                                      </div>
                                    </div>
                                  )}
                                  {item.administrate_period != undefined && item.administrate_period != null && (
                                    <div className={'flex between drug-item table-row'}>
                                      <div className="text-right" style={{paddingLeft:"3rem"}}>
                                        {item.administrate_period.increase_period_end_date != undefined ? (
                                          <>
                                            投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.increase_period_end_date)}
                                          </>
                                        ):(
                                          <>
                                            投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                          </>
                                        )}
                                        <br />
                                        {item.administrate_period.period_type == 0 && item.administrate_period.period_category != null && (
                                          <>
                                            間隔 : {item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月"}
                                          </>
                                        )}
                                        {item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0 && (
                                          <>
                                            曜日 : {getWeekNamesBySymbol(item.administrate_period.period_week_days)}
                                          </>
                                        )}
                                      </div>
                                      <div className="w80 table-item">
                                        {item.administrate_period.increase_days != undefined && item.administrate_period.increase_days > 0 ? item.administrate_period.increase_days+"日分":item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}                                        
                                      </div>
                                    </div>
                                  )}
                                  {item.insurance_type !== undefined && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        <label>保険: </label>
                                        <label className="cache-insurance-name">{this.getInsurance(item.insurance_type)}</label>
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
                                        <label>中止期間の最後日:</label>
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
                                  {item.med_consult !== undefined &&
                                  item.med_consult == 1 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        【お薬相談希望あり】
                                      </div>
                                    </div>
                                  )}
                                  {item.supply_med_info !== undefined &&
                                  item.supply_med_info == 1 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        【薬剤情報提供あり】
                                      </div>
                                    </div>
                                  )}
                                  {cache_data[0].potion !== undefined &&
                                  (cache_data[0].potion == 0 || cache_data[0].potion == 1) && cache_data[0].is_internal_prescription == 5 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {cache_data[0].potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          
                          {cache_data[0] != null && cache_data[0].psychotropic_drugs_much_reason != null && cache_data[0].psychotropic_drugs_much_reason !== undefined && cache_data[0].psychotropic_drugs_much_reason !== "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft: 50}}>
                                    <label>向精神薬多剤投与理由:</label>
                                    <label>{cache_data[0].psychotropic_drugs_much_reason}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0] != null && cache_data[0].poultice_many_reason != null && cache_data[0].poultice_many_reason !== undefined && cache_data[0].poultice_many_reason !== "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft: 50}}>
                                    <label>湿布薬超過投与理由:</label>
                                    <label>{cache_data[0].poultice_many_reason}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0] != null &&
                          cache_data[0].free_comment != null &&
                          cache_data[0].free_comment !== undefined &&
                          cache_data[0].free_comment.length > 0 &&
                          cache_data[0].free_comment[0] != null &&
                          cache_data[0].free_comment[0] != undefined &&
                          cache_data[0].free_comment[0] != "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft:"50px"}}>
                                    <label>備考:</label>
                                    <label>{cache_data[0].free_comment[0]}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            {cache_data[0].item_details != null && cache_data[0].item_details != undefined && cache_data[0].item_details.length > 0 && cache_data[0].item_details.map(ele=>{
                              return(
                                <>
                                  {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                                    <div className="function-region">
                                      <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                                      {ele.format1 != null && ele.format1 != undefined && ele.format1.includes("年") && ele.format1.includes("月") ? (
                                        <label>
                                          {ele.value1 != null && ele.value1 != undefined && (
                                            <label>{(ele.value1_format !== undefined) ? ele.value1_format : ele.value1}</label>
                                          )}
                                          {ele.value2 != null && ele.value2 != undefined && (
                                            <> ~ <label>{(ele.value2_format !== undefined) ? ele.value2_format : ele.value2}</label></>
                                          )}
                                        </label>
                                      ):(
                                        <label>
                                          {ele.value1 != null && ele.value1 != undefined && (
                                            <label>{ele.value1}</label>
                                          )}
                                          {ele.value2 != null && ele.value2 != undefined && (
                                            <label>{ele.value2}</label>
                                          )}
                                        </label>
                                      )}
                                    </div>
                                  )}
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </>
                );
              } else if(cache_data[0].temp_saved != undefined && cache_data[0].temp_saved == 1) {
                return (
                  <>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.PRESCRIPTION, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.PRESCRIPTION,
                        OPERATION_TYPE.REGIST,
                        subkey,
                        key,
                        "prescription",
                        cache_data[0].created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data[0].karte_status_name}・{prescription_category}処方】</div>
                          <div>
                          </div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data[0].last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data[0].last_doctor_code ? (
                                  <div>医師：{cache_data[0].last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data[0].last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data[0].last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data[0].last_doctor_code ? (
                                      <div>医師：{cache_data[0].last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data[0].last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}                                    
                        {visit_place_id > 0 && visit_place_name != "" && (
                          <div style={{textAlign:"left"}}>
                            <div>施設名：{visit_place_name}</div>                            
                          </div>
                        )}                          
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.PRESCRIPTION,
                        OPERATION_TYPE.REGIST,
                        subkey,
                        key,
                        "prescription",
                        cache_data[0].created_at
                      )}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                      onDoubleClick={()=>this.doubleClickEdit("prescription", subkey)}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={`history-item soap-data-item open order`}>
                          {cache_data[0].presData.filter(item => {
                            return item.medicines.length > 0 && item.medicines[0].medicineId > 0;
                          }).map((item, key)=>{
                            let keyName = {                              
                              one_dose_package: "一包化",
                              temporary_medication: "臨時処方",
                              mixture:"混合"
                            };
                            let sameKeys = this.getCheckSameOptions(item);
                            let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptions(item, sameKeys) : "";
                            let sameOptionsView;                            
                            if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {                                   
                              sameOptionsView = (
                                <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
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
                            
                            return (
                              <div className="history-item" key={key}>
                                <div className="box w70p" draggable="true">
                                  {item.medicines.length > 0 && item.medicines.filter(medicine_item => {return medicine_item.medicineId > 0;}).map((medicine_item, medicine_key)=>{
                                    return (
                                      <>
                                        <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                          <div className="flex between">
                                            <div className="flex full-width table-item text-right">
                                              <div className="number align-left" style={underLine}>
                                                {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                              </div>
                                              
                                              <div className="ml-3 full-width w100 align-left">
                                                {medicine_item.medicineName}
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
                                                      <p key={comment.id} style={{textAlign:"right", letterSpacing:"-1px"}}>
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
                                  <div className="flex between drug-item table-row">
                                    <div className="text-right">
                                      <div className="table-item">
                                        {item.usageName && (
                                          <>
                                            <label>用法: </label>
                                            <label>{item.usageName}</label>
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
                                  {sameOptionsView}
                                  {item.start_date !== undefined && item.start_date !== "" && (item.administrate_period == undefined || item.administrate_period == null) && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        <label>処方開始日: </label>
                                        <label>{formatJapanDateSlash(formatDate(item.start_date))}</label>
                                      </div>
                                    </div>
                                  )}
                                  {item.administrate_period != undefined && item.administrate_period != null && (
                                    <div className={'flex between drug-item table-row'}>
                                      <div className="text-right" style={{paddingLeft:"3rem"}}>
                                        投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                        <br />
                                        {item.administrate_period.period_type == 0 && item.administrate_period.period_category != null && (
                                          <>
                                            間隔 : {item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月"}
                                          </>
                                        )}
                                        {item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0 && (
                                          <>
                                            曜日 : {getWeekNamesBySymbol(item.administrate_period.period_week_days)}
                                          </>
                                        )}
                                      </div>
                                      <div className="w80 table-item">
                                        {item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}
                                      </div>
                                    </div>
                                  )}   
                                  {item.insurance_type !== undefined && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        <label>保険: </label>
                                        <label className="cache-insurance-name">{this.getInsurance(item.insurance_type)}</label>
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
                                        <label>中止期間の最後日:</label>
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
                                  {item.med_consult !== undefined &&
                                  item.med_consult == 1 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        【お薬相談希望あり】
                                      </div>
                                    </div>
                                  )}
                                  {item.supply_med_info !== undefined &&
                                  item.supply_med_info == 1 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        【薬剤情報提供あり】
                                      </div>
                                    </div>
                                  )}
                                  {cache_data[0].potion !== undefined &&
                                  (cache_data[0].potion == 0 || cache_data[0].potion == 1) && cache_data[0].is_internal_prescription == 5 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {cache_data[0].potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}
                                      </div>
                                    </div>
                                  )}
                                
                                </div>
                              </div>
                            )
                          })}
                          {cache_data[0] != null && cache_data[0].psychotropic_drugs_much_reason != null && cache_data[0].psychotropic_drugs_much_reason !== undefined && cache_data[0].psychotropic_drugs_much_reason !== "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft: 50}}>
                                    <label>向精神薬多剤投与理由:</label>
                                    <label>{cache_data[0].psychotropic_drugs_much_reason}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0] != null && cache_data[0].poultice_many_reason != null && cache_data[0].poultice_many_reason !== undefined && cache_data[0].poultice_many_reason !== "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft: 50}}>
                                    <label>湿布薬超過投与理由:</label>
                                    <label>{cache_data[0].poultice_many_reason}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0] != null &&
                          cache_data[0].free_comment != null &&
                          cache_data[0].free_comment !== undefined &&
                          cache_data[0].free_comment.length > 0 &&
                          cache_data[0].free_comment[0] != null &&
                          cache_data[0].free_comment[0] != undefined &&
                          cache_data[0].free_comment[0] != "" &&  (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft:"50px"}}>
                                    <label>備考:</label>
                                    <label>{cache_data[0].free_comment[0]}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            {cache_data[0].item_details != null && cache_data[0].item_details != undefined && cache_data[0].item_details.length > 0 && cache_data[0].item_details.map(ele=>{
                              return(
                                <>
                                  {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                                    <div className="function-region">
                                      <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                                      {ele.format1 != null && ele.format1 != undefined && ele.format1.includes("年") && ele.format1.includes("月") ? (
                                        <label>
                                          {ele.value1 != null && ele.value1 != undefined && (
                                            <label>{(ele.value1_format !== undefined) ? ele.value1_format : ele.value1}</label>
                                          )}
                                          {ele.value2 != null && ele.value2 != undefined && (
                                            <> ~ <label>{(ele.value2_format !== undefined) ? ele.value2_format : ele.value2}</label></>
                                          )}
                                        </label>
                                      ):(
                                        <label>
                                          {ele.value1 != null && ele.value1 != undefined && (
                                            <label>{ele.value1}</label>
                                          )}
                                          {ele.value2 != null && ele.value2 != undefined && (
                                            <label>{ele.value2}</label>
                                          )}
                                        </label>
                                      )}
                                    </div>
                                  )}
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </>
                );
              }
            }
            if(key == CACHE_LOCALNAMES.INJECTION_EDIT){                          
              let injection_category = "注射";
              if(parseInt(cache_data[0].karte_status_code) == 1 && cache_data[0].is_completed == 4) {injection_category = "定期注射";}
              // ●YJ287 注射の実施予定日がRPごとに表示される不具合
              // ・確認モーダル、SOAP右カラム、実施モーダルで発生
              // ・投与期間入力を使用したRPが1つも無い時は、中央カラムと同様に、注射オーダー1つに対して1回だけ表示してください。
              let hasAdministrate = false;
              if (cache_data[0].injectData.length > 0) {
                cache_data[0].injectData.filter(item=>{
                  if (item.usageName.includes("ＸＸ")) {
                    return false;
                  }
                  if (
                    item.usage > 0 &&
                    item.enable_days !== undefined &&
                    item.enable_days === 0
                  ) {
                    return true;
                  }
                  return (
                    item.usage != "" && item.usage != 0
                  );
                }).map(item=>{
                  if (item.administrate_period != undefined && item.administrate_period != null) {
                    hasAdministrate = true;
                  }
                });
              }
              if(cache_data[0].isUpdate == 1 && cache_data[0].temp_saved != undefined && cache_data[0].temp_saved == 1){
                return (
                  <>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.INJECTION, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.INJECTION,
                        OPERATION_TYPE.EDIT,
                        subkey,
                        key,
                        "injection",
                        cache_data[0].created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data[0].karte_status_name}・{injection_category}】 {this.state.isInjectionDone == 0 ?'＜編集＞':'＜編集して実施＞'}{cache_data[0].increasePeriod != undefined && cache_data[0].increasePeriod == 1 ? "(継続登録)":""}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <div className="date" style={{textAlign:"left"}}>
                          {cache_data[0].created_at !== undefined && cache_data[0].created_at !== "" ?
                            formatJapanSlashDateTime(cache_data[0].created_at):
                            (cache_data[0].time != undefined && cache_data[0].time != "" ? formatJapanSlashDateTime(cache_data[0].time) : "")}
                        </div>
                        {cache_data[0].last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data[0].last_doctor_code ? (
                                  <div>医師：{cache_data[0].last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data[0].last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data[0].last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data[0].last_doctor_code ? (
                                      <div>医師：{cache_data[0].last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data[0].last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {cache_data[0].visit_place_id != undefined && cache_data[0].visit_place_id != null && cache_data[0].visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data[0].visit_place_id)}</div>                            
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.INJECTION,
                        OPERATION_TYPE.EDIT,
                        subkey,
                        key,
                        "injection",
                        cache_data[0].created_at
                      )}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}                      
                      onDoubleClick={cache_data[0].increasePeriod != 1 ? ()=>this.doubleClickEdit("injection", subkey): ""}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={`history-item soap-data-item open order line-done`}>
                          {cache_data[0].injectData.filter(item => {
                            if (item.usageName.includes("ＸＸ")) {
                              return false;
                            }
                            if (
                              item.usage > 0 &&
                              item.enable_days !== undefined &&
                              item.enable_days === 0
                            ) {
                              return true;
                            }
                            return (
                              item.usage != "" && item.usage != 0
                            );
                          }).map((item, key)=>{
                            return (
                              <div className="history-item" key={key}>
                                <div className="box w70p" draggable="true">
                                  <div className="flex between drug-item table-row">
                                    <div className="number" style={underLine}>
                                      {" Rp" + parseInt(key + 1)}
                                    </div>
                                    <div className="text-right inject-usage">
                                      <div className="table-item">
                                        {item.usageName && (
                                          <>
                                            <label>手技: </label>
                                            <label>{item.usageName}</label>
                                          </>
                                        )}
                                      </div>
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
                                  {item.medicines.length > 0 && item.medicines.filter(medicine_item => {return medicine_item.medicineId > 0;}).map((medicine_item, medicine_key)=>{
                                    return (
                                      <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                        <div className="flex between">
                                          <div className="flex full-width table-item text-right">
                                            <div className="number">
                                            </div>
                                            <div className="ml-3 full-width w100 align-left">
                                              {medicine_item.medicineName}
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
                                                    <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                                  {item.insurance_type !== undefined && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        <label>保険: </label>
                                        <label className="cache-insurance-name">{this.getInsurance(item.insurance_type)}</label>
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
                                        <label>中止期間の最後日:</label>
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
                                  {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-right">
                                        <div className="table-item">
                                          {item.injectUsageName && (
                                            <>
                                              <label>用法: </label>
                                              <label>{item.injectUsageName}</label>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <div className="w80 table-item">
                                      </div>
                                    </div>
                                  )}
                                  {item.usage_remarks_comment && item.usage_remarks_comment.length > 0 && (
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
                                  )}
                                  {hasAdministrate == true && cache_data[0].is_completed !== null && cache_data[0].is_completed !== undefined && cache_data[0].is_completed != 1 && (item.administrate_period == undefined || item.administrate_period == null) && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item">
                                            <label>実施予定日: </label>
                                            <label>{formatJapanDateSlash(formatDateLine(cache_data[0].schedule_date))}</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {item.administrate_period != undefined && item.administrate_period != null && (
                                    <div className={'flex between drug-item table-row prescription-body-part'}>
                                      <div className="text-right">
                                        <div>
                                          1日{item.administrate_period.done_count}回 : {this.getDoneTimes(item.administrate_period.done_times)}
                                        </div>
                                        {item.administrate_period.increase_period_end_date != undefined ? (
                                          <>
                                            投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.increase_period_end_date)}
                                          </>
                                        ):(
                                          <>
                                            投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                          </>
                                        )}
                                        <div>                                          
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
                                        {item.administrate_period.increase_days != undefined && item.administrate_period.increase_days > 0 ? item.administrate_period.increase_days+"日分":item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}                                        
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          {cache_data[0].is_completed !== null && cache_data[0].is_completed !== undefined && cache_data[0].is_completed != 1 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>実施予定日: </label>
                                    <label>{formatJapanDateSlash(formatDateLine(cache_data[0].schedule_date))}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].location_name !== null && cache_data[0].location_name !== undefined && cache_data[0].location_name != "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>実施場所: </label>
                                    <label>{cache_data[0].location_name}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].drip_rate !== null && cache_data[0].drip_rate !== undefined && cache_data[0].drip_rate !== "" &&
                          cache_data[0].drip_rate !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>点滴速度: </label>
                                    <label>{cache_data[0].drip_rate}ml/h</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].water_bubble !== null && cache_data[0].water_bubble !== undefined && cache_data[0].water_bubble !== "" &&
                          cache_data[0].water_bubble !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>1分あたり: </label>
                                    <label>{cache_data[0].water_bubble}滴</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].exchange_cycle !== null && cache_data[0].exchange_cycle !== undefined && cache_data[0].exchange_cycle !== "" &&
                          cache_data[0].exchange_cycle !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>交換サイクル: </label>
                                    <label>{cache_data[0].exchange_cycle}時間</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].require_time !== null && cache_data[0].require_time !== undefined && cache_data[0].require_time !== "" &&
                          cache_data[0].require_time !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>所要時間: </label>
                                    <label>{cache_data[0].require_time}時間</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0] != null &&
                          cache_data[0].free_comment != null &&
                          cache_data[0].free_comment !== undefined &&
                          cache_data[0].free_comment.length > 0 &&
                          cache_data[0].free_comment[0] != null &&
                          cache_data[0].free_comment[0] != undefined &&
                          cache_data[0].free_comment[0] != "" &&  (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft:"50px"}}>
                                    <label>備考: </label>
                                    <label>{cache_data[0].free_comment[0]}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            {cache_data[0].item_details != null && cache_data[0].item_details != undefined && cache_data[0].item_details.length > 0 && cache_data[0].item_details.map(ele=>{
                              return(
                                <>
                                  {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                                    <div className="function-region">
                                      <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                                      {ele.format1 != null && ele.format1 != undefined && ele.format1.includes("年") && ele.format1.includes("月") ? (
                                        <label>
                                          {ele.value1 != null && ele.value1 != undefined && (
                                            <label>{(ele.value1_format !== undefined) ? ele.value1_format : ele.value1}</label>
                                          )}
                                          {ele.value2 != null && ele.value2 != undefined && (
                                            <> ~ <label>{(ele.value2_format !== undefined) ? ele.value2_format : ele.value2}</label></>
                                          )}
                                        </label>
                                      ):(
                                        <label>
                                          {ele.value1 != null && ele.value1 != undefined && (
                                            <label>{ele.value1}</label>
                                          )}
                                          {ele.value2 != null && ele.value2 != undefined && (
                                            <label>{ele.value2}</label>
                                          )}
                                        </label>
                                      )}
                                    </div>
                                  )}
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </>
                );
              } else if(cache_data[0].temp_saved !== undefined && cache_data[0].temp_saved == 1) {                
                return (
                  <>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.INJECTION, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.INJECTION,
                        OPERATION_TYPE.REGIST,
                        subkey,
                        key,
                        "injection",
                        cache_data[0].created_at
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data[0].karte_status_name}・{injection_category}】</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data[0].last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data[0].last_doctor_code ? (
                                  <div>医師：{cache_data[0].last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data[0].last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data[0].last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data[0].last_doctor_code ? (
                                      <div>医師：{cache_data[0].last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data[0].last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {visit_place_id > 0 && visit_place_name != "" && (
                          <div style={{textAlign:"left"}}>
                            <div>施設名：{visit_place_name}</div>                            
                          </div>
                        )}                          
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.INJECTION,
                        OPERATION_TYPE.REGIST,
                        subkey,
                        key,
                        "injection",
                        cache_data[0].created_at
                      )}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                      onDoubleClick={()=>this.doubleClickEdit("injection", subkey)}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={`history-item soap-data-item open order`}>
                          {cache_data[0].injectData.filter(item => {
                            if (item.usageName.includes("ＸＸ")) {
                              return false;
                            }
                            if (
                              item.usage > 0 &&
                              item.enable_days !== undefined &&
                              item.enable_days === 0
                            ) {
                              return true;
                            }
                            return (
                              item.usage != "" && item.usage != 0
                            );
                          }).map((item, key)=>{
                            return (
                              <div className="history-item" key={key}>
                                <div className="box w70p" draggable="true">
                                  <div className="flex between drug-item table-row">
                                    <div className="number" style={underLine}>
                                      {" Rp" + parseInt(key + 1)}
                                    </div>
                                    <div className="text-right inject-usage">
                                      <div className="table-item">
                                        {!item.usageName ? "" : `手技: ${item.usageName}`}
                                      </div>
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
                                  {item.medicines.length > 0 && item.medicines.filter(medicine_item => {return medicine_item.medicineId > 0;}).map((medicine_item, medicine_key)=>{
                                    return (
                                      <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                        <div className="flex between">
                                          <div className="flex full-width table-item text-right">
                                            <div className="number">
                                            </div>
                                            
                                            <div className="ml-3 full-width w100 align-left">
                                              {medicine_item.medicineName}
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
                                                    <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                                  {item.insurance_type !== undefined && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        <label>保険: </label>
                                        <label className="cache-insurance-name">{this.getInsurance(item.insurance_type)}</label>
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
                                        <label>中止期間の最後日:</label>
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
                                  {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-right">
                                        <div className="table-item">
                                          {item.injectUsageName && (
                                            <>
                                              <label>用法: </label>
                                              <label>{item.injectUsageName}</label>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <div className="w80 table-item">
                                      </div>
                                    </div>
                                  )}
                                  {item.usage_remarks_comment && item.usage_remarks_comment.length > 0 && (
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
                                  )}
                                  {hasAdministrate == true && cache_data[0].is_completed !== null && cache_data[0].is_completed !== undefined && cache_data[0].is_completed != 1 && (item.administrate_period == undefined || item.administrate_period == null) && (
                                    <div className="history-item">
                                      <div className="box">
                                        <div className="flex between option table-row">
                                          <div className="text-right table-item">
                                            <label>実施予定日: </label>
                                            <label>{formatJapanDateSlash(formatDateLine(cache_data[0].schedule_date))}</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {item.administrate_period != undefined && item.administrate_period != null && (
                                    <div className={'flex between drug-item table-row prescription-body-part'}>
                                      <div className="text-right">
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
                                      <div className="w80 table-item">
                                        {item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          {hasAdministrate != true && cache_data[0].is_completed !== null && cache_data[0].is_completed !== undefined && cache_data[0].is_completed != 1 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>実施予定日: </label>
                                    <label>{formatJapanDateSlash(formatDateLine(cache_data[0].schedule_date))}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].location_name !== null && cache_data[0].location_name !== undefined && cache_data[0].location_name !== "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>実施場所: </label>
                                    <label>{cache_data[0].location_name}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].drip_rate !== null && cache_data[0].drip_rate !== undefined && cache_data[0].drip_rate !== "" &&
                          cache_data[0].drip_rate !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>点滴速度: </label>
                                    <label>{cache_data[0].drip_rate}ml/h</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].water_bubble !== null && cache_data[0].water_bubble !== undefined && cache_data[0].water_bubble !== "" &&
                          cache_data[0].water_bubble !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>1分あたり: </label>
                                    <label>{cache_data[0].water_bubble}滴</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].exchange_cycle !== null && cache_data[0].exchange_cycle !== undefined && cache_data[0].exchange_cycle !== "" &&
                          cache_data[0].exchange_cycle !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>交換サイクル: </label>
                                    <label>{cache_data[0].exchange_cycle}時間</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0].require_time !== null && cache_data[0].require_time !== undefined && cache_data[0].require_time !== "" &&
                          cache_data[0].require_time !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>所要時間: </label>
                                    <label>{cache_data[0].require_time}時間</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {cache_data[0] != null &&
                          cache_data[0].free_comment != null &&
                          cache_data[0].free_comment !== undefined &&
                          cache_data[0].free_comment.length > 0 &&
                          cache_data[0].free_comment[0] != null &&
                          cache_data[0].free_comment[0] != undefined &&
                          cache_data[0].free_comment[0] != "" &&  (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft:"50px"}}>
                                    <label>備考: </label>
                                    <label>{cache_data[0].free_comment[0]}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            {cache_data[0].item_details != null && cache_data[0].item_details != undefined && cache_data[0].item_details.length > 0 && cache_data[0].item_details.map(ele=>{
                              return(
                                <>
                                  {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                                    <div className="function-region">
                                      <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                                      {ele.format1 != null && ele.format1 != undefined && ele.format1.includes("年") && ele.format1.includes("月") ? (
                                        <label>
                                          {ele.value1 != null && ele.value1 != undefined && (
                                            <label>{(ele.value1_format !== undefined) ? ele.value1_format : ele.value1}</label>
                                          )}
                                          {ele.value2 != null && ele.value2 != undefined && (
                                            <> ~ <label>{(ele.value2_format !== undefined) ? ele.value2_format : ele.value2}</label></>
                                          )}
                                        </label>
                                      ):(
                                        <label>
                                          {ele.value1 != null && ele.value1 != undefined && (
                                            <label>{ele.value1}</label>
                                          )}
                                          {ele.value2 != null && ele.value2 != undefined && (
                                            <label>{ele.value2}</label>
                                          )}
                                        </label>
                                      )}
                                    </div>
                                  )}
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </>
                );
              }
            }
            if(key == CACHE_LOCALNAMES.MEAL_EDIT){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.MEAL, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.MEAL,
                        OPERATION_TYPE.REGIST,
                        subkey,
                        key,
                        "meal"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{this.context.karte_status.name}・食事オーダー】</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.MEAL,
                        OPERATION_TYPE.REGIST,
                        subkey,
                        key,
                        "meal"
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenChangeMealPopup", subkey)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">変更開始</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {formatJapanDateSlash(cache_data.start_date)+ cache_data.start_time_name +"より"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">食種</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.food_type_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">特別食加算</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.special_food_addition !== undefined ? cache_data.special_food_addition : "なし"}</div>
                                </div>
                              </div>
                              {cache_data.staple_food_id_morning_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">主食（朝）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_id_morning_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_morning_free_comment != undefined && cache_data.staple_food_morning_free_comment != null && cache_data.staple_food_morning_free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">朝のフリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_morning_free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_id_noon_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">主食（昼）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_id_noon_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_noon_free_comment != undefined && cache_data.staple_food_noon_free_comment != null && cache_data.staple_food_noon_free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">昼のフリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_noon_free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_id_evening_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">主食（夕）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_id_evening_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_evening_free_comment != undefined && cache_data.staple_food_evening_free_comment != null && cache_data.staple_food_evening_free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">夕のフリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_evening_free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.drink_id_morning_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">飲み物（朝）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.drink_id_morning_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.drink_id_noon_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">飲み物（昼）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.drink_id_noon_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.drink_id_evening_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">飲み物（夕）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.drink_id_evening_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.side_food_name != undefined && cache_data.side_food_name != null && cache_data.side_food_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">副食</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.side_food_name}</div>
                                  </div>
                                </div>
                              )}
                              {/*{cache_data.breakfast_name != undefined && cache_data.breakfast_name != null && cache_data.breakfast_name != "" && (*/}
                                {/*<div className="flex between drug-item table-row">*/}
                                  {/*<div className="text-left">*/}
                                    {/*<div className="table-item">朝食</div>*/}
                                  {/*</div>*/}
                                  {/*<div className="text-right">*/}
                                    {/*<div className="table-item remarks-comment">{cache_data.breakfast_name}</div>*/}
                                  {/*</div>*/}
                                {/*</div>*/}
                              {/*)}*/}
                              {cache_data.thick_liquid_food_name !== undefined && cache_data.thick_liquid_food_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">流動食</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.thick_liquid_food_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.ingestion_method_name !== undefined && cache_data.ingestion_method_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">摂取方法</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.ingestion_method_name}</div>
                                  </div>
                                </div>
                              )}
                              {((cache_data.thick_liquid_food_number_id_morning != undefined && cache_data.thick_liquid_food_number_id_morning != null && cache_data.thick_liquid_food_number_id_morning != "") || 
                              (cache_data.thick_liquid_food_number_id_noon != undefined && cache_data.thick_liquid_food_number_id_noon != null && cache_data.thick_liquid_food_number_id_noon != "") || 
                              (cache_data.thick_liquid_food_number_id_evening != undefined && cache_data.thick_liquid_food_number_id_evening != null && cache_data.thick_liquid_food_number_id_evening != "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"></div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{this.getMealCountLabel(cache_data.thick_liquid_food_number_name_morning, cache_data.thick_liquid_food_number_name_noon, cache_data.thick_liquid_food_number_name_evening)}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.milk_name !== undefined && cache_data.milk_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">ミルク食</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.milk_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.serving_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">配膳先</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.serving_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.meal_comment.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.meal_comment.map(comment=>{
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
                              {cache_data.free_comment != null && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.MEAL_GROUP_EDIT){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.MEAL_GROUP, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.MEAL_GROUP,
                        OPERATION_TYPE.REGIST,
                        subkey,
                        key,
                        "meal_group"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{this.context.karte_status.name}・食事一括指示】</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.MEAL_GROUP,
                        OPERATION_TYPE.REGIST,
                        subkey,
                        key,
                        "meal_group"
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenChangeMealPopup", subkey)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">変更開始</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {formatJapanDateSlash(cache_data.start_date)+ cache_data.start_time_name +"より"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">変更終了</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {formatJapanDateSlash(cache_data.start_date_to)+ cache_data.start_time_name_to +"まで"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">食種</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.food_type_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">特別食加算</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.special_food_addition !== undefined ? cache_data.special_food_addition : "なし"}</div>
                                </div>
                              </div>
                              {cache_data.staple_food_id_morning_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">主食（朝）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_id_morning_name}</div>
                                  </div>
                                </div>
                              )}                              
                              {cache_data.staple_food_morning_free_comment != undefined && cache_data.staple_food_morning_free_comment != null && cache_data.staple_food_morning_free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">朝のフリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_morning_free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_id_noon_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">主食（昼）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_id_noon_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_noon_free_comment != undefined && cache_data.staple_food_noon_free_comment != null && cache_data.staple_food_noon_free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">昼のフリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_noon_free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_id_evening_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">主食（夕）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_id_evening_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.staple_food_evening_free_comment != undefined && cache_data.staple_food_evening_free_comment != null && cache_data.staple_food_evening_free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">夕のフリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.staple_food_evening_free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.drink_id_morning_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">飲み物（朝）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.drink_id_morning_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.drink_id_noon_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">飲み物（昼）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.drink_id_noon_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.drink_id_evening_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">飲み物（夕）</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.drink_id_evening_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.side_food_name != undefined && cache_data.side_food_name != null && cache_data.side_food_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">副食</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.side_food_name}</div>
                                  </div>
                                </div>
                              )}
                              {/*{cache_data.breakfast_name != undefined && cache_data.breakfast_name != null && cache_data.breakfast_name != "" && (*/}
                                {/*<div className="flex between drug-item table-row">*/}
                                  {/*<div className="text-left">*/}
                                    {/*<div className="table-item">朝食</div>*/}
                                  {/*</div>*/}
                                  {/*<div className="text-right">*/}
                                    {/*<div className="table-item remarks-comment">{cache_data.breakfast_name}</div>*/}
                                  {/*</div>*/}
                                {/*</div>*/}
                              {/*)}*/}
                              {cache_data.thick_liquid_food_name !== undefined && cache_data.thick_liquid_food_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">流動食</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.thick_liquid_food_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.ingestion_method_name !== undefined && cache_data.ingestion_method_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">摂取方法</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.ingestion_method_name}</div>
                                  </div>
                                </div>
                              )}
                              {((cache_data.thick_liquid_food_number_id_morning !== undefined && cache_data.thick_liquid_food_number_id_morning !== null && cache_data.thick_liquid_food_number_id_morning !== "") || 
                              (cache_data.thick_liquid_food_number_id_noon !== undefined && cache_data.thick_liquid_food_number_id_noon !== null && cache_data.thick_liquid_food_number_id_noon !== "") || 
                              (cache_data.thick_liquid_food_number_id_evening !== undefined && cache_data.thick_liquid_food_number_id_evening !== null && cache_data.thick_liquid_food_number_id_evening !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"></div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{this.getMealCountLabel(cache_data.thick_liquid_food_number_name_morning, cache_data.thick_liquid_food_number_name_noon, cache_data.thick_liquid_food_number_name_evening)}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.milk_name !== undefined && cache_data.milk_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">ミルク食</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.milk_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.serving_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">配膳先</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.serving_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.meal_comment.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.meal_comment.map(comment=>{
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
                              {cache_data.free_comment != null && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.TREATMENT_DELETE) {
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, (cache_data.general_id === 2 ? CATEGORY_TYPE.HOMETREATMENT : cache_data.general_id === 3 ? CATEGORY_TYPE.HOSPITALTREATMENT : CATEGORY_TYPE.TREATMENT), sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.general_id === 2 ? CATEGORY_TYPE.HOMETREATMENT : cache_data.general_id === 3 ? CATEGORY_TYPE.HOSPITALTREATMENT : CATEGORY_TYPE.TREATMENT),
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_treatment"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・{cache_data.general_id === 2 ? "在宅処置" : cache_data.general_id === 3 ? "入院処置" : "外来処置"}】＜削除＞</div>
                          <div className="department text-right">{this.getDepartmentName(cache_data, CACHE_LOCALNAMES.TREATMENT_EDIT)}</div>
                        </div>
                        {cache_data.header.isForUpdate == 1 && (
                          <div className="date">
                            {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                          </div>
                        )}
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown}/>
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.general_id === 2 ? CATEGORY_TYPE.HOMETREATMENT : cache_data.general_id === 3 ? CATEGORY_TYPE.HOSPITALTREATMENT : CATEGORY_TYPE.TREATMENT),
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_treatment"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props={this.props.font_props}>
                        <div className="open order">
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">処置日</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {cache_data.header.date === "" ? ""
                                      : ((cache_data.header.start_time === "" || cache_data.header.start_time === null) ? formatJapanDateSlash(cache_data.header.date)
                                        : formatJapanDateSlash(cache_data.header.date) + "  " + cache_data.header.start_time)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {getInsuranceName(cache_data.header.insurance_name)}
                                  </div>
                                </div>
                              </div>
                              {cache_data.detail.map(item => {
                                return (
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
                                                <label style={{width: "2.5rem"}}>{sub_item.x_value}cm</label>
                                                <label className="ml-1 mr-1">×</label>
                                                <label style={{width: "2.5rem"}}>{sub_item.y_value}cm</label>
                                                <label className="ml-1 mr-1">=</label>
                                                <label style={{width: "3rem"}}>{sub_item.total_x_y}㎠</label>
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
                                            {item.treat_detail_item.map(detail => {
                                              let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                JSON.parse(detail['oxygen_data']) : null;
                                              return (
                                                <>
                                                  <div>
                                                    <label>・{detail.item_name}：</label>
                                                    <label>{detail.count}</label>
                                                    {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                      <>
                                                        <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                      </>
                                                    )}
                                                    <br/>
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
                                                        <label>ロット:{detail.lot}</label><br/>
                                                      </>
                                                    )}
                                                    {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                      <>
                                                        <label>フリーコメント:{detail.comment}</label><br/>
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
                                    {(item.treat_done_info !== undefined && item.treat_done_info.length > 0) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {item.treat_done_info.map(detail => {
                                              let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                JSON.parse(detail['oxygen_data']) : null;
                                              return (
                                                <>
                                                  <div>
                                                    <label>・{detail.item_name}：</label>
                                                    <label>{detail.count}</label>
                                                    {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                      <>
                                                        <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                      </>
                                                    )}
                                                    <br/>
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
                                                        <label>ロット:{detail.lot}</label><br/>
                                                      </>
                                                    )}
                                                    {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                      <>
                                                        <label>フリーコメント:{detail.comment}</label><br/>
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
                                    {item.done_comment !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{displayLineBreak(item.done_comment)}</div>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )
                              })}
                              {cache_data.item_details !== undefined && cache_data.item_details.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"></div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.item_details.map(detail => {
                                        return (
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
                              {cache_data.additions !== undefined && Object.keys(cache_data.additions).length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">追加指示等</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {Object.keys(cache_data.additions).map(addition => {
                                        return (
                                          <>
                                            <span>{cache_data.additions[addition].name}</span><br/>
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
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.GUIDANCE_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, cache_data.GUIDANCE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.GUIDANCE,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_guidance"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・汎用オーダー】＜削除＞</div>
                          <div className="department text-right">{this.getDepartmentName(cache_data, CACHE_LOCALNAMES.GUIDANCE_EDIT)}</div>
                        </div>
                        {cache_data.isForUpdate == 1 && (
                          <div className="date">
                            {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                          </div>
                        )}
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.GUIDANCE,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_guidance"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item"}>
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">日付</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {cache_data.treat_date === "" ? "" : formatJapanDateSlash(cache_data.treat_date)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{getInsuranceName(cache_data.insurance_name)}</div>
                                </div>
                              </div>
                              {(cache_data.karte_description_name != undefined && cache_data.karte_description_name != null && cache_data.karte_description_name != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">カルテ記述名称</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.karte_description_name}</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.additions != undefined && cache_data.additions != null && Object.keys(cache_data.additions).length > 0) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">追加指示等</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {Object.keys(cache_data.additions).map(addition=>{
                                        return(
                                          <>
                                            <span>{cache_data.additions[addition].name}</span><br />
                                          </>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.karte_text_data != undefined && cache_data.karte_text_data != null && cache_data.karte_text_data.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">カルテ記述内容</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.karte_text_data.map(karte_text=>{
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
                              {(cache_data.comment !== undefined && cache_data.comment != null && cache_data.comment != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.details !== undefined && cache_data.details != null && cache_data.details.length>0 && cache_data.details.findIndex(x=>x.is_enabled==1) > -1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"> </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.details.map(detail=>{
                                        if(detail.is_enabled === undefined || (detail.is_enabled !== undefined && detail.is_enabled == 1)){
                                          return(
                                            <>
                                              <div><label>・{detail.item_name}
                                                {((detail.value1 != undefined && detail.value1 != null && detail.value1 !== "") || (detail.value2 != undefined && detail.value2 != null && detail.value2 !== ""))? "：": ""}</label>
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
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.INSPECTION_DELETE){
              return (
                <>
                  <div className={"data-list"} key={subkey}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, (cache_data.inspection_id == 17 ? CATEGORY_TYPE.ENDOSCOPE : CATEGORY_TYPE.INSPECTION), sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.inspection_id == 17 ? CATEGORY_TYPE.ENDOSCOPE : CATEGORY_TYPE.INSPECTION),
                        (cache_data.cache_type == "stop" ? OPERATION_TYPE.STOP : OPERATION_TYPE.DELETE),
                        subkey,
                        key,
                        "delete_inspection"
                      )}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">
                            【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}
                            ・{getInspectionName(cache_data.inspection_id)}】{cache_data.cache_type == "stop" ? "＜中止＞" : "＜削除＞"}
                          </div>
                          <div className="department text-right">{this.getDepartmentName(cache_data, CACHE_LOCALNAMES.INSPECTION_EDIT)}</div>
                        </div>
                        {cache_data.isForUpdate == 1 && (
                          <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                        )}
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.inspection_id == 17 ? CATEGORY_TYPE.ENDOSCOPE : CATEGORY_TYPE.INSPECTION),
                        (cache_data.cache_type == "stop" ? OPERATION_TYPE.STOP : OPERATION_TYPE.DELETE),
                        subkey,
                        key,
                        "delete_inspection"
                      )}
                      style={{color: "rgb(255, 0, 0)", display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              {cache_data.multi_reserve_flag != 1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査日</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.inspection_DATETIME === "日未定" ? "[日未定]" : (formatJapanDateSlash(cache_data.inspection_DATETIME)
                                        + ((cache_data.reserve_time !== undefined && cache_data.reserve_time !== "") ? " "+cache_data.reserve_time : "")
                                      )}
                                      {cache_data.is_emergency == 1 && renderHTML("<span className='note-red'>[当日緊急]</span>")}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment cache-insurance-name">{getInsuranceName(patient_insurance_name)}</div>
                                </div>
                              </div>
                              {cache_data.classification1_name !== undefined && cache_data.classification1_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査種別</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.classification1_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.classification2_name !== undefined && cache_data.classification2_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査詳細</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.classification2_name}</div>
                                  </div>
                                </div>
                              )}
                              {/* ---------- start 内視鏡------------- */}
                              {cache_data.inspection_type_name !== undefined && cache_data.inspection_type_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査種別</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.inspection_type_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.inspection_item_name !== undefined && cache_data.inspection_item_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査項目</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.inspection_item_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.endoscope_purpose_name !== undefined && cache_data.endoscope_purpose_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査目的</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.endoscope_purpose_name}</div>
                                  </div>
                                </div>
                              )}
                              {/* ----------- end ------------ */}
                              {cache_data.inspection_purpose !== undefined && cache_data.inspection_purpose != null && cache_data.inspection_purpose.length > 0 && (
                                <>
                                  {cache_data.inspection_purpose.map((item, index) =>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">検査目的</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_symptom !== undefined && cache_data.inspection_symptom != null && cache_data.inspection_symptom.length > 0 && (
                                <>
                                  {cache_data.inspection_symptom.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">現症</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_risk !== undefined && cache_data.inspection_risk != null && cache_data.inspection_risk.length > 0 && (
                                <>
                                  {cache_data.inspection_risk.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_sick !== undefined && cache_data.inspection_sick != null && cache_data.inspection_sick.length > 0 && (
                                <>
                                  {cache_data.inspection_sick.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_request !== undefined && cache_data.inspection_request != null && cache_data.inspection_request.length > 0 && (
                                <>
                                  {cache_data.inspection_request.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.is_anesthesia !== undefined && cache_data.is_anesthesia != null && cache_data.is_anesthesia.length > 0 && (
                                <>
                                  {cache_data.is_anesthesia.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.is_sedation !== undefined && cache_data.is_sedation != null && cache_data.is_sedation.length > 0 && (
                                <>
                                  {cache_data.is_sedation.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">{item.title}</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {cache_data.inspection_movement !== undefined && cache_data.inspection_movement != null && cache_data.inspection_movement.length > 0 && (
                                <>
                                  {cache_data.inspection_movement.map((item, index)=>{
                                    return (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            {index ==0 && (
                                              <div className="table-item">患者移動形態</div>
                                            )}
                                            {index !=0 && (
                                              <div className="table-item"></div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{item.name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                              {(cache_data.done_height !== undefined || (cache_data.height !== undefined && cache_data.height != null && cache_data.height !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">身長</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.done_height != undefined ? cache_data.done_height : cache_data.height}cm</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.done_weight !== undefined || (cache_data.weight !== undefined && cache_data.weight != null && cache_data.weight !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">体重</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.done_weight !== undefined ? cache_data.done_weight : cache_data.weight}kg</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.done_surface_area !== undefined || (cache_data.surface_area !== undefined && cache_data.surface_area != null && cache_data.surface_area != "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">体表面積</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.done_surface_area !== undefined ? cache_data.done_surface_area : cache_data.surface_area}㎡</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.connection_date_title !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{cache_data.connection_date_title}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.calculation_start_date)}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.sick_name !== undefined && cache_data.sick_name != null && cache_data.sick_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">臨床診断、病名</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.sick_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.etc_comment !== undefined && cache_data.etc_comment != null && cache_data.etc_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">
                                      <p>主訴、臨床経過</p>
                                      <p>検査目的、コメント</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.etc_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.special_presentation !== undefined && cache_data.special_presentation !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">特殊指示</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.special_presentation}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.count !== undefined && cache_data.count !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{cache_data.count_label !=='' ? cache_data.count_label : ''}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.count}{cache_data.count_suffix !== '' ? cache_data.count_suffix : ''}</div>
                                  </div>
                                </div>
                              )}
                              {((cache_data.done_body_part !== undefined && cache_data.done_body_part !== "") || (cache_data.done_body_part === undefined && cache_data.body_part !== undefined && cache_data.body_part !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">部位指定コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className={'table-item remarks-comment'}>
                                      {cache_data.done_body_part !== undefined ? cache_data.done_body_part : cache_data.body_part}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.state == 2 && (
                                <>
                                  {cache_data.done_result !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">結果</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{displayLineBreak(cache_data.done_result) + " " + cache_data.result_suffix}</div>
                                      </div>
                                    </div>
                                  )}
                                  {cache_data.done_comment !== undefined && cache_data.done_comment != null && cache_data.done_comment !== "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">実施コメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{displayLineBreak(cache_data.done_comment)}</div>
                                      </div>
                                    </div>
                                  )}
                                  {cache_data.details !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item"> </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {cache_data.details.map(detail=>{
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
                              {cache_data.imgBase64 !== undefined && cache_data.imgBase64 != null && cache_data.imgBase64 !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      <a
                                        className="soap-image-title"
                                        onClick={() => this.openInspectionImageModal(cache_data.imgBase64)}
                                        style={imageButtonStyle}
                                      >
                                        画像を見る
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.additions !== undefined && Object.keys(cache_data.additions).length > 0 && (
                                <MedicineListWrapper font_props = {this.props.font_props}>
                                  <div className="open order">
                                    <div className="history-item">
                                      <div className="phy-box w70p" draggable="true">
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">追加指示等</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {Object.keys(cache_data.additions).map(addition=>{
                                                return(
                                                  <>
                                                    <span>{cache_data.additions[addition].name}</span><br />
                                                  </>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </MedicineListWrapper>
                              )}
                              {cache_data.multi_reserve_flag == 1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">実施/予定情報</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{getMultiReservationInfo(cache_data.reserve_data, cache_data.done_numbers)}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.start_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">開始日時</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {formatJapanDateSlash(cache_data.start_date) + " " + formatTimeIE(new Date(cache_data.start_date.split('-').join('/')))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.continue_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{getInspectionMasterInfo(cache_data.inspection_id, 'performed_multiple_times_type') == 1 ? "実施情報" : "継続登録"}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {this.getContinueDate(cache_data.continue_date)}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.end_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">終了日時</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {formatJapanDateSlash(cache_data.start_date) + " " + formatTimeIE(new Date(cache_data.start_date.split('-').join('/')))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.RADIATION_DELETE){
              let radiation_karte_status_name = cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : "";
              return (
                <>
                  <div className={"data-list"} key={subkey}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, cache_data.RADIATION, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.RADIATION,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_radiation"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">{'【'+ radiation_karte_status_name + '・' + '放射線 ' + cache_data.radiation_name + '】'} &nbsp;&nbsp;＜削除＞</div>
                          <div className="department text-right">{this.getDepartmentName(cache_data, CACHE_LOCALNAMES.RADIATION_EDIT)}</div>
                        </div>
                        {cache_data.isForUpdate == 1 && (
                          <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                        )}
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.RADIATION,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_radiation"
                      )}
                      style={{color: "rgb(255, 0, 0)", display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={"history-item soap-data-item open order"}>
                          <RadiationData
                            data = {cache_data}
                            patientId = {this.props.patientId}
                          />
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.EXAM_DELETE || key == CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE || key == CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE || key == CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE){
              let category_type = CATEGORY_TYPE.EXAMINATION;
              if (key == CACHE_LOCALNAMES.CYTOLOGY_EXAM_DELETE) category_type = CATEGORY_TYPE.CYTOLOGY;
              else if (key == CACHE_LOCALNAMES.PATHOLOGY_EXAM_DELETE) category_type = CATEGORY_TYPE.PATHOLOGY;
              else if (key == CACHE_LOCALNAMES.BACTERIAL_EXAM_DELETE) category_type = CATEGORY_TYPE.BACTERIAL;
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, category_type, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        category_type,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_examination"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{this.context.karte_status.name}・{cache_data.modalName != undefined ? cache_data.modalName: "検体検査"}】＜削除＞</div>
                          <div className="department text-right">{this.getDepartmentName(cache_data, CACHE_LOCALNAMES.EXAM_EDIT)}</div>
                        </div>
                        {cache_data.isForUpdate !== undefined && cache_data.isForUpdate === 1 && cache_data.created_at != undefined && cache_data != "" && (
                          <div className="date">
                            {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                          </div>
                        )}
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        category_type,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_examination"
                      )}
                      style={{color: "rgb(255, 0, 0)", display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={`history-item soap-data-item open order`}>
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">{cache_data.administrate_period !== undefined && cache_data.administrate_period != null ? "採取(予定)日時":"採取日時"}</div>
                                </div>
                                <div className="text-right">
                                  {cache_data.administrate_period !== undefined && cache_data.administrate_period != null ? (
                                    <div className="table-item remarks-comment">
                                      {cache_data.administrate_period.done_days.length > 0 && cache_data.administrate_period.done_days.map(item=>{
                                        return (
                                          <li key ={item}>{item}</li>
                                        )
                                      })}
                                    </div>
                                  ):(
                                    <div className="table-item remarks-comment">{cache_data.collected_date === "" ? "次回診察日" : cache_data.collected_time === "" ? formatJapanDateSlash(cache_data.collected_date) : formatJapanDateSlash(cache_data.collected_date)+"  "+cache_data.collected_time.substr(0,cache_data.collected_time.length-3)}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{getInsuranceName(cache_data.insurance_name)}</div>
                                </div>
                              </div>
                              {cache_data.subject != undefined && cache_data.subject != null && cache_data.subject != '' && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">概要</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{cache_data.subject}</div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {cache_data.examinations != undefined && cache_data.examinations != null && cache_data.examinations.length > 0 && (
                                <>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査項目</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.examinations.map((item, index)=>{
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
                              {cache_data.free_instruction != undefined && cache_data.free_instruction.length > 0 && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">自由入力オーダー</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {cache_data.free_instruction.map((item, key)=> {
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
                                cache_data={cache_data}
                                from_source={"detail-modal"}
                              />
                              {cache_data.todayResult === 1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">当日結果説明</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">あり</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.order_comment !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{cache_data.order_comment_urgent != undefined && cache_data.order_comment_urgent == 1?"【至急】":""}
                                      {cache_data.fax_report != undefined && cache_data.fax_report == 1?"【FAX報告】":""}
                                      依頼コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.order_comment}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.free_comment !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}

                              {cache_data.additions != undefined && Object.keys(cache_data.additions).length > 0 && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">追加指示等</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {Object.keys(cache_data.additions).map(addition=>{
                                        return (
                                          <div key={addition}>{cache_data.additions[addition].name}</div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </>
                              )}
                              {cache_data.imgBase64 !== undefined && cache_data.imgBase64 != null && cache_data.imgBase64 !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      <a
                                        className="soap-image-title"
                                        onClick={() => this.openInspectionImageModal(cache_data.imgBase64)}
                                        style={imageButtonStyle}
                                      >
                                        画像を見る
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.RIHABILY_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.REHABILY, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.REHABILY,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_rehabily"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・リハビリ】 ＜削除＞</div>
                          <div className="department text-right">{this.getDepartmentName(cache_data, CACHE_LOCALNAMES.RIHABILY_EDIT)}</div>
                        </div>
                        {cache_data.isForUpdate == 1 && (
                          <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                        )}
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.REHABILY,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_rehabily"
                      )}
                      style={{color: "rgb(255, 0, 0)", display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <RehabilyOrderData rehabily_data={cache_data} />
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.ALLERGY_DELETE){
              let body1_title = "";
              let body2_title = "";
              let alergy_title = "";
              switch (cache_data.type) {
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
                  body1_title = "入院時身体所見";
                  body2_title = "入院時検査所見";
                  alergy_title = "入院時現症";
                  break;
              }
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.ALLERGY, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.ALLERGY,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_allergy"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{this.context.karte_status.name}・{alergy_title}】 ＜削除＞</div>
                          <div className="department text-right">{this.getDepartmentName(cache_data, CACHE_LOCALNAMES.ALLERGY_EDIT)}</div>
                        </div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown}/>
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.ALLERGY,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_allergy"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item"}>
                            <div className="phy-box w70p" draggable="true">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">{body1_title}</div>
                                </div>
                                <div className="text-right">
                                  <div
                                    className="table-item remarks-comment">{displayLineBreak(cache_data.body_1)}</div>
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
                                        {(cache_data.type === "infection" || cache_data.type === "alergy") ? ALLERGY_STATUS_ARRAY[parseInt(cache_data.body_2)] : displayLineBreak(cache_data.body_2)}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.SOAP_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.SOAP, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.SOAP,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_soap"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">{this.context.karte_status.name}・{cache_data.sub_category == "初診・入院時ノート" ? "【初診・入院時ノート】" : "【プログレスノート】"}＜削除＞</div>
                          <div className="department text-right">{cache_data.medical_department_name}</div>
                        </div>
                        {cache_data.isForUpdate == 1 && (
                          <>
                          <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                          {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                            <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                            </div>
                          )}
                          </>
                        )}
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.SOAP,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_soap"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={"soap-data-item history-item"} style={{display:"block"}}>
                          {cache_data.sub_category == "初診・入院時ノート" ? (
                            <table className="tb-soap hospitalize">
                              <tr>
                                <th>主訴</th>
                                <td><div>{renderHTML(this.soapColorChange(cache_data.data.s_text, "red"))}</div></td>
                              </tr>
                              <tr>
                                <th>現病歴</th>
                                <td><div>{renderHTML(this.soapColorChange(cache_data.data.sharp_text, "red"))}</div></td>
                              </tr>
                              <tr>
                                <th>所見</th>
                                <td>
                                  <div>{renderHTML(this.soapColorChange(cache_data.data.o_text, "red"))}</div>
                                </td>
                              </tr>
                              <tr>
                                <th>アセスメント</th>
                                <td>
                                  <div>{renderHTML(this.soapColorChange(cache_data.data.a_text, "red"))}</div>
                                </td>
                              </tr>
                              <tr>
                                <th>プラン</th>
                                <td>
                                  <div>{renderHTML(this.soapColorChange(cache_data.data.p_text, "red"))}</div>
                                </td>
                              </tr>
                            </table>
                          ) : (
                            <table className="tb-soap">
                              <tr>
                                <th>#</th>
                                <td><div>{renderHTML(this.soapColorChange(cache_data.data.sharp_text, "red"))}</div></td>
                              </tr>
                              <tr>
                                <th>(S)</th>
                                <td><div>{renderHTML(this.soapColorChange(cache_data.data.s_text, "red"))}</div></td>
                              </tr>
                              <tr>
                                <th>(O)</th>
                                <td><div>{renderHTML(this.soapColorChange(cache_data.data.o_text, "red"))}</div></td>
                              </tr>
                              <tr>
                                <th>(A)</th>
                                <td><div>{renderHTML(this.soapColorChange(cache_data.data.a_text, "red"))}</div></td>
                              </tr>
                              <tr>
                                <th>(P)</th>
                                <td><div>{renderHTML(this.soapColorChange(cache_data.data.p_text, "red"))}</div></td>
                              </tr>
                            </table>
                          )}
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.DOCUMENT_CREATE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.DOCUMENT_CREATE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.DOCUMENT_CREATE,
                        (cache_data.isForUpdate == 1 ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "document_create"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{this.context.karte_status.name}・文書】{cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate == 1 && (
                          <>
                            <div className="date">
                              {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                            </div>
                            {cache_data.last_doctor_code !== undefined && (
                              <div style={{textAlign:"left"}}>
                                {this.authInfo.staff_category === 1 ? (
                                  <>
                                    {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                    )}
                                  </>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code <= 0 ? (
                                      <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                    ):(
                                      <>
                                        {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                          <div>医師：{cache_data.last_doctor_name}</div>
                                        ):(
                                          <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                              <div style={{textAlign:"left"}}>
                                <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                              </div>
                            )}
                          </>
                        )}
                        {visit_place_id > 0 && visit_place_name != "" && (
                          <div style={{textAlign:"left"}}>
                            <div>施設名：{visit_place_name}</div>
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.DOCUMENT_CREATE,
                        (cache_data.isForUpdate == 1 ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "document_create"
                      )}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item" + (cache_data.isForUpdate == 1 ? ' line-done':'')}>
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">文書伝票</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.slip_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">文書タイトル</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">ファイルパス</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.file_path}</div>
                                </div>
                              </div>
                              {cache_data.free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.DOCUMENT_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.DOCUMENT_CREATE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.DOCUMENT_CREATE,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_document"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・文書】＜削除＞</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.DOCUMENT_CREATE,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_document"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item"}>
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">文書伝票</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.slip_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">文書タイトル</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">ファイルパス</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.file_path}</div>
                                </div>
                              </div>
                              {cache_data.free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.WARD_MOVE_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.WARD_MOVE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.WARD_MOVE,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_ward_move"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【入院・転棟・転室実施】＜削除＞</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.WARD_MOVE,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_ward_move"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item"}>
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">実施日時</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {formatJapanDateSlash(cache_data.treat_date.split(" ")[0])+" "+cache_data.treat_date.split(" ")[1]}
                                  </div>
                                </div>
                              </div>
                              {cache_data.department_name !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">診療科</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.department_name}</div>
                                  </div>
                                </div>
                              )}
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">病棟</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.ward_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">病室</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.room_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">ベッド</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.bed_name}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.CHANGE_RESPONSIBILITY, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.CHANGE_RESPONSIBILITY,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_change_responsibility"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【入院・担当変更オーダー】＜削除＞</div>
                          <div className="department text-right">{cache_data.department_name}</div>
                        </div>
                        <div className="date">
                          {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                        </div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.CHANGE_RESPONSIBILITY,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_change_responsibility"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className={"history-item"}>
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">変更日</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {(cache_data.moving_day != undefined && cache_data.moving_day != "") ? formatJapanDateSlash(cache_data.moving_day): ""}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">診療科</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {(cache_data.prev_department_id !== undefined && cache_data.prev_department_id !== cache_data.department_id)
                                      ? (cache_data.prev_department_name + " → ") : ""}{cache_data.department_name}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">主担当</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {(cache_data.prev_main_doctor !== undefined && cache_data.prev_main_doctor !== cache_data.mainDoctor)
                                      ? (cache_data.prev_main_doctor_name + " → ") : ""}{cache_data.mainDoctor_name}
                                  </div>
                                </div>
                              </div>
                              {cache_data.doctors_name.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">担当医</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.doctors_name.map(name=>{
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
                              {cache_data.nurse_id_in_charge_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">担当看護師</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.nurse_id_in_charge_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.deputy_nurse_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">副担当看護師</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.deputy_nurse_name}</div>
                                  </div>
                                </div>
                              )}
                              {/* <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">チーム</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                </div>
                              </div> */}
                              {cache_data.comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.IN_HOSPITAL_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, (cache_data.hospital_type == "in_apply" ? CATEGORY_TYPE.IN_HOSPITAL_APP : CATEGORY_TYPE.IN_HOSPITAL_DEC), sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.hospital_type == "in_apply" ? CATEGORY_TYPE.IN_HOSPITAL_APP : CATEGORY_TYPE.IN_HOSPITAL_DEC),
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_in_hospital"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【入院・{cache_data.hospital_type == "in_apply" ? "入院申込オーダー" : "入院決定オーダー"}】＜削除＞</div>
                          <div className="department text-right">{cache_data.department_name}</div>
                        </div>
                        <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.hospital_type == "in_apply" ? CATEGORY_TYPE.IN_HOSPITAL_APP : CATEGORY_TYPE.IN_HOSPITAL_DEC),
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_in_hospital"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">{cache_data.hospital_type == "in_apply" ? "入院予定日時" : "入院日時"}</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {cache_data.hospital_type == "in_apply" ?
                                      formatJapanDateSlash(cache_data.desired_hospitalization_date) +
                                      (cache_data.desired_hospitalization_date.split(' ')[1] == undefined || cache_data.desired_hospitalization_date.split(' ')[1] == null || cache_data.desired_hospitalization_date.split(' ')[1] == ''? "" : ' '
                                        +(cache_data.desired_hospitalization_date.split(' ')[1]).split(':')[0]
                                        +':'
                                        +(cache_data.desired_hospitalization_date.split(' ')[1]).split(':')[1]):
                                      formatJapanDateSlash(cache_data.date_and_time_of_hospitalization)
                                      +' '
                                      +(cache_data.date_and_time_of_hospitalization.split(' ')[1]).split(':')[0]
                                      +':'
                                      +(cache_data.date_and_time_of_hospitalization.split(' ')[1]).split(':')[1]
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">入院病名</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.disease_name}</div>
                                </div>
                              </div>
                              {(cache_data.purpose_array_names != undefined && cache_data.purpose_array_names.length > 0) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">入院目的</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.purpose_array_names.map(name=>{
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
                              {(cache_data.hospitalization_purpose_comment != undefined && cache_data.hospitalization_purpose_comment != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">入院目的フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.hospitalization_purpose_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.hospital_type == "in_apply" ? (
                                <>
                                  {(cache_data.treatment_plan_name != undefined && cache_data.treatment_plan_name != "") && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">治療計画</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.treatment_plan_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {(cache_data.treatment_plan_comments != undefined && cache_data.treatment_plan_comments != "") && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">治療計画フリーコメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.treatment_plan_comments}</div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ):(
                                <>
                                  {(cache_data.discharge_plan_name != undefined && cache_data.discharge_plan_name != "") && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">退院計画</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.discharge_plan_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {(cache_data.discharge_plan_comment != undefined && cache_data.discharge_plan_comment != "") && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">退院計画フリーコメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.discharge_plan_comment}</div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                              {(cache_data.path_name != undefined && cache_data.path_name != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">パス</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.path_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.surgery_day != null && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">手術日</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.surgery_day)}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.surgery_name != null && cache_data.surgery_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">手術名</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.surgery_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.treatment_day != null && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">治療日</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.treatment_day)}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.treatment_name != null && cache_data.treatment_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">治療名</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.treatment_name}</div>
                                  </div>
                                </div>
                              )}{cache_data.inspection_date != null && (
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">検査日</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.inspection_date)}</div>
                                </div>
                              </div>
                            )}
                              {cache_data.inspection_name != null && cache_data.inspection_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査名</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.inspection_name}</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.estimated_hospitalization_period_name != undefined && cache_data.estimated_hospitalization_period_name != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">推定入院期間</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.estimated_hospitalization_period_name}</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.urgency_name != undefined && cache_data.urgency_name != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">緊急度</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.urgency_name}</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.rest_name != undefined && cache_data.rest_name != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">安静度</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.rest_name}</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.desired_room_type_name != undefined && cache_data.desired_room_type_name != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">希望部屋種</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.desired_room_type_name}</div>
                                  </div>
                                </div>
                              )}
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">診療科</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.department_name}</div>
                                </div>
                              </div>
                              {cache_data.hospital_type == "in_decision" ? (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">病棟</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{cache_data.ward_name}</div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">病室</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{cache_data.room_name}</div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">病床</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{cache_data.hospital_bed_id == null ? "未指定" : cache_data.bed_name}</div>
                                    </div>
                                  </div>
                                  {(cache_data.emergency_admission_comments != undefined && cache_data.emergency_admission_comments != "") && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">緊急入院時コメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.emergency_admission_comments}</div>
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
                                      <div className="table-item remarks-comment">{cache_data.ward_name}</div>
                                    </div>
                                  </div>
                                  {(cache_data.second_ward_name != undefined && cache_data.second_ward_name != "") && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">第2病棟</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.second_ward_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {(cache_data.free_comment != undefined && cache_data.free_comment != "") && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">フリーコメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                              {(cache_data.bulletin_board_reference_flag == 1) && (
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
                                  <div className="table-item remarks-comment">{cache_data.main_doctor_name}</div>
                                </div>
                              </div>
                              {cache_data.doctor_list_names != undefined && cache_data.doctor_list_names.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">担当医</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.doctor_list_names.map(doctor_name=>{
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
                              {cache_data.nurse_id_in_charge_name != undefined && cache_data.nurse_id_in_charge_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">担当看護師</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.nurse_id_in_charge_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.deputy_nurse_name != undefined && cache_data.deputy_nurse_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">副担当看護師</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.deputy_nurse_name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.hospital_type != "in_apply" && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">入院経路</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{cache_data.route_name}</div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">入院識別</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{cache_data.identification_name}</div>
                                    </div>
                                  </div>
                                </>
                              )}
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">食事開始日</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.start_date)
                                  + (cache_data.start_time_classification_name != undefined ? ("("+ cache_data.start_time_classification_name +") から開始") : "")}
                                  </div>
                                </div>
                              </div>
                              {cache_data.food_type_name != undefined && cache_data.food_type_name != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">食事</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.food_type_name}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.HOSPITAL_DONE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.HOSPITAL_DONE,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_hospital_done"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【入院・入院実施】＜削除＞</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.HOSPITAL_DONE,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_hospital_done"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">実施日時</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {formatJapanDateSlash(cache_data.treat_date.split(" ")[0])+ " " +cache_data.treat_date.split(" ")[1]}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">病棟</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.ward_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">病室</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.room_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">ベッド</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.bed_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">配膳開始</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {formatJapanDateSlash(cache_data.start_date)
                                    +"（"+cache_data.start_time_name+"） "}より開始
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.DISCHARGE_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, (cache_data.discharge_type === "discharge-permit" ? CATEGORY_TYPE.DISCHARGE_PERMIT : (cache_data.discharge_type === "discharge-decision" ? CATEGORY_TYPE.DISCHARGE_DECISION : CATEGORY_TYPE.DISCHARGE_DONE)), sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.discharge_type === "discharge-permit" ? CATEGORY_TYPE.DISCHARGE_PERMIT : (cache_data.discharge_type === "discharge-decision" ? CATEGORY_TYPE.DISCHARGE_DECISION : CATEGORY_TYPE.DISCHARGE_DONE)),
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_discharge"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【入院・{cache_data.discharge_type == "discharge-permit" ? "退院許可" :
                            (cache_data.discharge_type == "discharge-decision" ? "退院決定" : "退院実施")}】＜削除＞</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <div className="date">{cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}</div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.discharge_type === "discharge-permit" ? CATEGORY_TYPE.DISCHARGE_PERMIT : (cache_data.discharge_type === "discharge-decision" ? CATEGORY_TYPE.DISCHARGE_DECISION : CATEGORY_TYPE.DISCHARGE_DONE)),
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_discharge"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">
                                    {cache_data.discharge_type === 'discharge-done' ? "実施日時" : (cache_data.discharge_type === 'discharge-decision' ? "退院日時" : "退院日")}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {cache_data.discharge_type === "discharge-permit" ? (cache_data.discharge_date != "" && formatJapanDateSlash(cache_data.discharge_date))
                                      :(formatJapanDateSlash(cache_data.treat_date.split(" ")[0])+" "+cache_data.treat_date.split(" ")[1])}
                                  </div>
                                </div>
                              </div>
                              {cache_data.discharge_type != "discharge-permit" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">配膳停止</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {formatJapanDateSlash(cache_data.start_date) +" （"+cache_data.start_time_name+"）"}より停止
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">転帰理由</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.outcome_reason_name}</div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">退院経路</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{cache_data.discharge_route_name}</div>
                                </div>
                              </div>
                              {(cache_data.discharge_type != "discharge-permit" && cache_data.discharge_free_comment != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.discharge_free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {(cache_data.discharge_type === "discharge-permit" && cache_data.free_comment != undefined
                                && cache_data.free_comment != null && cache_data.free_comment !="") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.HOSPITAL_GOING_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, (cache_data.going_type === "going-out" ? CATEGORY_TYPE.HOSPITAL_OUT : CATEGORY_TYPE.HOSPITAL_RETURN), sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.going_type === "going-out" ? CATEGORY_TYPE.HOSPITAL_OUT : CATEGORY_TYPE.HOSPITAL_RETURN),
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_hospital_going"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【入院・{cache_data.going_type == "going-out" ? "外泊実施" : "帰院実施"}】＜削除＞</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <div className="date">
                          {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                        </div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        (cache_data.going_type === "going-out" ? CATEGORY_TYPE.HOSPITAL_OUT : CATEGORY_TYPE.HOSPITAL_RETURN),
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_hospital_going"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">実施日時</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {formatJapanDateSlash(cache_data.treat_date.split(" ")[0])+" "+cache_data.treat_date.split(" ")[1]}
                                  </div>
                                </div>
                              </div>
                              {cache_data.going_type == "going-out" && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">外出泊理由</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{cache_data.going_out_name}</div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">配膳停止</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {formatJapanDateSlash(cache_data.stop_serving_date) +" （"+cache_data.stop_serving_time_name+"）"}より停止
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
                                  <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.start_date)+" （"+cache_data.start_time_name+"）"}より開始</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.DEATH_REGISTER_DELETE){
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.DEATH_REGISTER, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.DEATH_REGISTER,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_death_delete"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・死亡登録】＜削除＞</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <div className="date">
                          {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.DEATH_REGISTER,
                        OPERATION_TYPE.DELETE,
                        subkey,
                        key,
                        "delete_death_delete"
                      )}
                      style={{color: "rgb(255, 0, 0)", display: sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className="open order">
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">死亡日付</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.death_date)}</div>
                                </div>
                              </div>
                              {cache_data.free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.BACILLUS_EDIT){
              return (
                <>
                  <div className={"data-list"} key={subkey}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.BACILLUS, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.BACILLUS,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "bacillus"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">【{this.context.karte_status.name}・細菌検査】 &nbsp;&nbsp; {cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate == 1 ? (
                          <>
                          <div className="date">
                            {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                          </div>
                          {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                            <div style={{textAlign:"left"}}>
                              <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                            </div>
                          )}
                          </>
                        ):(
                          <>
                            {visit_place_id > 0 && visit_place_name != "" && (
                              <div style={{textAlign:"left"}}>
                                <div>施設名：{visit_place_name}</div>                            
                              </div>
                            )}
                          </>
                        )}                        
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        CATEGORY_TYPE.BACILLUS,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "bacillus"
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickBacillusInspection", subkey)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={"history-item soap-data-item open order" + (cache_data.isForUpdate == 1?' line-done':'')}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">採取日付</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {cache_data.collected_date == "" ? "" : formatJapanDateSlash(cache_data.collected_date)}{cache_data.collected_time == "" ? "" : cache_data.collected_time}
                                  </div>
                                </div>
                              </div>
                              {cache_data.gather_part != undefined && cache_data.gather_part != null && cache_data.gather_part != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">採取部位</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.gather_part.name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.material != undefined && cache_data.material != null && cache_data.material != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">材料</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.material.name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.detail_part != undefined && cache_data.detail_part != null && cache_data.detail_part != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">詳細部位情報</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.detail_part.name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.inspection_target != undefined && cache_data.inspection_target != null && cache_data.inspection_target != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査目的</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.inspection_target.name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.free_comment != undefined && cache_data.free_comment != null && cache_data.free_comment != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.inspection_item != undefined && cache_data.inspection_item != null && cache_data.inspection_item.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査項目</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.inspection_item.map(item=> {
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
                              {cache_data.basic_disease != undefined && cache_data.basic_disease != null && cache_data.basic_disease != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">基礎疾患</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.basic_disease.name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.travel_history != undefined && cache_data.travel_history != null && cache_data.travel_history != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">渡航履歴</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.travel_history.name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.infectious != undefined && cache_data.infectious != null && cache_data.infectious != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">推定感染症</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.infectious.name}</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.anti_data != undefined && cache_data.anti_data != null && cache_data.anti_data != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">使用中抗菌剤</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.anti_data.map(item=> {
                                        return(
                                          <><div>{item.name}</div></>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.target_bacillus != undefined && cache_data.target_bacillus != null && cache_data.target_bacillus != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">目的菌</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.target_bacillus.name}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
          } else {
            let cache_data = karteApi.getVal(this.props.patientId, key);
            department_name = this.getDepartmentName(cache_data, key);
            if(cache_data === undefined || cache_data == null) return <></>;
            if(key == CACHE_LOCALNAMES.EXAM_EDIT || key == CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT || key == CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT || key == CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT){
              let category_type = CATEGORY_TYPE.EXAMINATION;
              if (key == CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT) category_type = CATEGORY_TYPE.CYTOLOGY;
              else if (key == CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT) category_type = CATEGORY_TYPE.PATHOLOGY;
              else if (key == CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT) category_type = CATEGORY_TYPE.BACTERIAL;
              return (
                <>
                  <div className="data-list">
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, category_type, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e,
                        category_type,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "examination"
                      )}
                    >
                      <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                        <div className="flex">
                          <div className="note">
                            【{cache_data.karte_status == 1 ? "外来":cache_data.karte_status == 2 ? "訪問診療": cache_data.karte_status == 3 ? "入院" : ""}・{cache_data.modalName != undefined ? cache_data.modalName: "検体検査"}】{cache_data.isForUpdate !== undefined && cache_data.isForUpdate === 1 && cache_data.is_done_edit !== null && cache_data.is_done_edit !== 1 ? " ＜編集＞" : cache_data.isForUpdate !== undefined && cache_data.isForUpdate === 1 && cache_data.is_done_edit !== null && cache_data.is_done_edit === 1 ? " ＜編集して実施＞":""}{cache_data.increasePeriod == 1 ? "(予定日付追加)":""}
                          </div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate !== undefined && cache_data.isForUpdate === 1 && cache_data.created_at != undefined && cache_data != "" && (
                          <>
                          <div className="date">
                            <>
                              {cache_data.created_at !== "" ? formatJapanSlashDateTime(cache_data.created_at):""}
                              {cache_data.last_doctor_code !== undefined && (
                                <div style={{textAlign:"left"}}>
                                  {this.authInfo.staff_category === 1 ? (
                                    <>
                                      {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                        <div>医師：{cache_data.last_doctor_name}</div>
                                      ):(
                                        <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                      )}
                                    </>
                                  ):(
                                    <>
                                      {this.context.selectedDoctor.code <= 0 ? (
                                        <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                      ):(
                                        <>
                                          {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                            <div>医師：{cache_data.last_doctor_name}</div>
                                          ):(
                                            <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </>
                          </div>
                          {cache_data.visit_place_id != undefined && cache_data.visit_place_id != null && cache_data.visit_place_id > 0 && (
                            <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(cache_data.visit_place_id)}</div>
                            </div>
                          )}
                          </>
                        )}    
                        {cache_data.isForUpdate != 1 && visit_place_id > 0 && visit_place_name != "" && (
                          <div style={{textAlign:"left"}}>
                            <div>施設名：{visit_place_name}</div>                            
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div
                      onContextMenu={e=>this.orderHandleClick(e,
                        category_type,
                        (cache_data.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST),
                        subkey,
                        key,
                        "examination"
                      )}
                      onDoubleClick={()=>this.doubleClickEdit("clickOpenExaminationPopup", 0)}
                      style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    >
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={`history-item soap-data-item open order ${cache_data.is_done_order == 1 ? "line-done" : ""} ${cache_data.isForUpdate == 1 ? 'line-done' : ""}`}>
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">{cache_data.administrate_period !== undefined && cache_data.administrate_period != null ? "採取(予定)日時":"採取日時"}</div>
                                </div>
                                <div className="text-right">
                                  {cache_data.administrate_period !== undefined && cache_data.administrate_period != null ? (
                                    <div className="table-item remarks-comment">
                                      {cache_data.administrate_period.done_days.length > 0 && cache_data.administrate_period.done_days.map(item=>{
                                        return (
                                          <li key ={item}>{item}</li>
                                        )
                                      })}
                                    </div>
                                  ):(
                                    <div className="table-item remarks-comment">{cache_data.collected_date === "" ? "次回診察日" : cache_data.collected_time === "" ? formatJapanDateSlash(cache_data.collected_date) : formatJapanDateSlash(cache_data.collected_date)+"  "+cache_data.collected_time.substr(0,cache_data.collected_time.length-3)}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{getInsuranceName(cache_data.insurance_name)}</div>
                                </div>
                              </div>
                              {cache_data.subject != undefined && cache_data.subject != null && cache_data.subject != '' && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">概要</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{cache_data.subject}</div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {cache_data.examinations != undefined && cache_data.examinations != null && cache_data.examinations.length > 0 && (
                                <>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査項目</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.examinations.map((item, index)=>{
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
                              {cache_data.free_instruction != undefined && cache_data.free_instruction.length > 0 && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">自由入力オーダー</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {cache_data.free_instruction.map((item, key)=> {
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
                                cache_data={cache_data}
                                from_source={"detail-modal"}
                              />
                              {cache_data.todayResult === 1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">当日結果説明</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">あり</div>
                                  </div>
                                </div>
                              )}
                              {cache_data.order_comment !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{cache_data.order_comment_urgent != undefined && cache_data.order_comment_urgent == 1?"【至急】":""}
                                      {cache_data.fax_report != undefined && cache_data.fax_report == 1?"【FAX報告】":""}
                                      依頼コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cache_data.order_comment}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cache_data.free_comment !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              )}

                              {cache_data.additions != undefined && Object.keys(cache_data.additions).length > 0 && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">追加指示等</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {Object.keys(cache_data.additions).map(addition=>{
                                        return (
                                          <div key={addition}>{cache_data.additions[addition].name}</div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </>
                              )}
                              {cache_data.imgBase64 !== undefined && cache_data.imgBase64 != null && cache_data.imgBase64 !== "" && cache_data.number == 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      <a
                                        className="soap-image-title"
                                        onClick={() => this.openInspectionImageModal(cache_data.imgBase64)}
                                        style={imageButtonStyle}
                                      >
                                        画像を見る
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.DISCHARGE_PERMIT || key == CACHE_LOCALNAMES.DISCHARGE_DONE || key == CACHE_LOCALNAMES.DISCHARGE_DECISION){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, (key == CACHE_LOCALNAMES.DISCHARGE_DONE ? CATEGORY_TYPE.DISCHARGE_DONE : (key == CACHE_LOCALNAMES.DISCHARGE_DECISION ? CATEGORY_TYPE.DISCHARGE_DECISION : CATEGORY_TYPE.DISCHARGE_PERMIT)), sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, (key == CACHE_LOCALNAMES.DISCHARGE_DONE ? CATEGORY_TYPE.DISCHARGE_DONE : (key == CACHE_LOCALNAMES.DISCHARGE_DECISION ? CATEGORY_TYPE.DISCHARGE_DECISION : CATEGORY_TYPE.DISCHARGE_PERMIT)), ((cache_data.isForUpdate == 1) ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">
                            【入院・{key == CACHE_LOCALNAMES.DISCHARGE_DONE ? "退院実施" : (key == CACHE_LOCALNAMES.DISCHARGE_DECISION ? "退院決定" : "退院許可")}】
                            {cache_data.isForUpdate !== undefined && cache_data.isForUpdate == 1 ? " ＜編集＞" : ""}
                          </div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate !== undefined && cache_data.isForUpdate == 1 && cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, (key == CACHE_LOCALNAMES.DISCHARGE_DONE ? CATEGORY_TYPE.DISCHARGE_DONE : (key == CACHE_LOCALNAMES.DISCHARGE_DECISION ? CATEGORY_TYPE.DISCHARGE_DECISION : CATEGORY_TYPE.DISCHARGE_PERMIT)), ((cache_data.isForUpdate == 1) ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">
                                          {key == CACHE_LOCALNAMES.DISCHARGE_DONE ? "実施日時" : (key == CACHE_LOCALNAMES.DISCHARGE_DECISION ? "退院日時" : "退院日")}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {key == CACHE_LOCALNAMES.DISCHARGE_PERMIT ? formatJapanDateSlash(cache_data.discharge_date)
                                            : formatJapanDateSlash(cache_data.moving_day.split(" ")[0])+ " " +cache_data.moving_day.split(" ")[1]}
                                        </div>
                                      </div>
                                    </div>
                                    {key != CACHE_LOCALNAMES.DISCHARGE_PERMIT && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">配膳停止</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {formatJapanDateSlash(cache_data.start_date)+"（"+cache_data.start_time_name+"） "}より停止
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">転帰理由</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.outcome_reason_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">退院経路</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.discharge_route_name}</div>
                                      </div>
                                    </div>
                                    {(key != CACHE_LOCALNAMES.DISCHARGE_PERMIT && cache_data.discharge_free_comment != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.discharge_free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                    {(key == CACHE_LOCALNAMES.DISCHARGE_PERMIT && cache_data.free_comment != undefined && cache_data.free_comment != null && cache_data.free_comment != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.CHANGE_RESPONSIBILITY, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.CHANGE_RESPONSIBILITY, OPERATION_TYPE.REGIST, 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【入院・担当変更オーダー】</div>
                          <div className="department text-right">{cache_data.department_name}</div>
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.CHANGE_RESPONSIBILITY, OPERATION_TYPE.REGIST, 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">変更日</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {(cache_data.moving_day != undefined && cache_data.moving_day != "") ? formatJapanDateSlash(cache_data.moving_day) :""}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">診療科</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {(cache_data.prev_department_id !== undefined && cache_data.prev_department_id !== cache_data.department_id)
                                            ? (cache_data.prev_department_name + " → ") : ""}{cache_data.department_name}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">主担当</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {(cache_data.prev_main_doctor !== undefined && cache_data.prev_main_doctor !== cache_data.mainDoctor)
                                            ? (cache_data.prev_main_doctor_name + " → ") : ""}{cache_data.mainDoctor_name}
                                        </div>
                                      </div>
                                    </div>
                                    {cache_data.doctors_name.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">担当医</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.doctors_name.map(name=>{
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
                                    {cache_data.nurse_id_in_charge_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">担当看護師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.nurse_id_in_charge_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.deputy_nurse_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">副担当看護師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.deputy_nurse_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {/* <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">チーム</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.team_name !== undefined ? cache_data.team_name : ""}</div>
                                      </div>
                                    </div> */}
                                    {cache_data.comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.HOSPITAL_DONE){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.HOSPITAL_DONE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.HOSPITAL_DONE, OPERATION_TYPE.REGIST, 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【入院・入院実施】</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.HOSPITAL_DONE, OPERATION_TYPE.REGIST, 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p">
                                    {cache_data.bed_error != undefined && cache_data.bed_error == 1 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item"></div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment" style={{color:"red"}}>病床重複</div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">実施日時</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(cache_data.date_and_time_of_hospitalization.split(" ")[0])+ " " +cache_data.date_and_time_of_hospitalization.split(" ")[1]}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">病棟</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.ward_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">病室</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.room_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">ベッド</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.bed_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">配膳開始</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(cache_data.start_date)+"（"+cache_data.start_time_name+"） "}より開始
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.IN_HOSPITAL_EDIT){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, (cache_data.hospital_type === "in_apply" ? CATEGORY_TYPE.IN_HOSPITAL_APP : CATEGORY_TYPE.IN_HOSPITAL_DEC), sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, (cache_data.hospital_type === "in_apply" ? CATEGORY_TYPE.IN_HOSPITAL_APP : CATEGORY_TYPE.IN_HOSPITAL_DEC), (cache_data.isForUpdate == 1 ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【入院・{cache_data.hospital_type == "in_apply" ? "入院申込オーダー" : "入院決定オーダー"}】{cache_data.isForUpdate == 1 && " ＜編集＞"}</div>
                          <div className="department text-right">{cache_data.department_name}</div>
                        </div>
                        {cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, (cache_data.hospital_type === "in_apply" ? CATEGORY_TYPE.IN_HOSPITAL_APP : CATEGORY_TYPE.IN_HOSPITAL_DEC), (cache_data.isForUpdate == 1 ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className={"history-item" + (cache_data.isForUpdate == 1 ?' line-done':'')}>
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">{cache_data.hospital_type == "in_apply" ? "入院予定日時" : "入院日時"}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {cache_data.hospital_type == "in_apply" ?
                                            formatJapanDateSlash(cache_data.desired_hospitalization_date) +
                                            (cache_data.desired_hospitalization_date.split(' ')[1] == undefined || cache_data.desired_hospitalization_date.split(' ')[1] == null || cache_data.desired_hospitalization_date.split(' ')[1] == ''? "" : ' '
                                              +(cache_data.desired_hospitalization_date.split(' ')[1]).split(':')[0]
                                              +':'
                                              +(cache_data.desired_hospitalization_date.split(' ')[1]).split(':')[1]):
                                            formatJapanDateSlash(cache_data.date_and_time_of_hospitalization)
                                            +' '
                                            +(cache_data.date_and_time_of_hospitalization.split(' ')[1]).split(':')[0]
                                            +':'
                                            +(cache_data.date_and_time_of_hospitalization.split(' ')[1]).split(':')[1]
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">入院病名</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.disease_name}</div>
                                      </div>
                                    </div>
                                    {(cache_data.purpose_array_names != undefined && cache_data.purpose_array_names.length > 0) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">入院目的</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.purpose_array_names.map(name=>{
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
                                    {(cache_data.hospitalization_purpose_comment != undefined && cache_data.hospitalization_purpose_comment != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">入院目的フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.hospitalization_purpose_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.hospital_type == "in_apply" ? (
                                      <>
                                        {(cache_data.treatment_plan_name != undefined && cache_data.treatment_plan_name != "") && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">治療計画</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{cache_data.treatment_plan_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {(cache_data.treatment_plan_comments != undefined && cache_data.treatment_plan_comments != "") && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">治療計画フリーコメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{cache_data.treatment_plan_comments}</div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    ):(
                                      <>
                                        {(cache_data.discharge_plan_name != undefined && cache_data.discharge_plan_name != "") && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">退院計画</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{cache_data.discharge_plan_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {(cache_data.discharge_plan_comment != undefined && cache_data.discharge_plan_comment != "") && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">退院計画フリーコメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{cache_data.discharge_plan_comment}</div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    {(cache_data.path_name != undefined && cache_data.path_name != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">パス</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.path_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.surgery_day != null && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">手術日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.surgery_day)}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.surgery_name != null && cache_data.surgery_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">手術名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.surgery_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.treatment_day != null && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">治療日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.treatment_day)}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.treatment_name != null && cache_data.treatment_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">治療名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.treatment_name}</div>
                                        </div>
                                      </div>
                                    )}{cache_data.inspection_date != null && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">検査日</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.inspection_date)}</div>
                                      </div>
                                    </div>
                                  )}
                                    {cache_data.inspection_name != null && cache_data.inspection_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.inspection_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {(cache_data.estimated_hospitalization_period_name != undefined && cache_data.estimated_hospitalization_period_name != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">推定入院期間</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.estimated_hospitalization_period_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {(cache_data.urgency_name != undefined && cache_data.urgency_name != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">緊急度</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.urgency_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {(cache_data.rest_name != undefined && cache_data.rest_name != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">安静度</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.rest_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {(cache_data.desired_room_type_name != undefined && cache_data.desired_room_type_name != "") && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">希望部屋種</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.desired_room_type_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">診療科</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.department_name}</div>
                                      </div>
                                    </div>
                                    {cache_data.hospital_type == "in_decision" ? (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">病棟</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{cache_data.ward_name}</div>
                                          </div>
                                        </div>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">病室</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{cache_data.room_name}</div>
                                          </div>
                                        </div>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">病床</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{cache_data.hospital_bed_id == null ? "未指定" : cache_data.bed_name}</div>
                                          </div>
                                        </div>
                                        {(cache_data.emergency_admission_comments != undefined && cache_data.emergency_admission_comments != "") && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">緊急入院時コメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{cache_data.emergency_admission_comments}</div>
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
                                            <div className="table-item remarks-comment">{cache_data.ward_name}</div>
                                          </div>
                                        </div>
                                        {(cache_data.second_ward_name != undefined && cache_data.second_ward_name != "") && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">第2病棟</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{cache_data.second_ward_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {(cache_data.free_comment != undefined && cache_data.free_comment != "") && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">フリーコメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    {(cache_data.bulletin_board_reference_flag == 1) && (
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
                                        <div className="table-item remarks-comment">{cache_data.main_doctor_name}</div>
                                      </div>
                                    </div>
                                    {cache_data.doctor_list_names != undefined && cache_data.doctor_list_names.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">担当医</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.doctor_list_names.map(doctor_name=>{
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
                                    {cache_data.nurse_id_in_charge_name != undefined && cache_data.nurse_id_in_charge_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">担当看護師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.nurse_id_in_charge_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.deputy_nurse_name != undefined && cache_data.deputy_nurse_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">副担当看護師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.deputy_nurse_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.hospital_type != "in_apply" && (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">入院経路</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{cache_data.route_name}</div>
                                          </div>
                                        </div>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">入院識別</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{cache_data.identification_name}</div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">食事開始日</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.start_date)
                                        + (cache_data.start_time_classification_name != undefined ? ("("+ cache_data.start_time_classification_name +") から開始") : "")}
                                        </div>
                                      </div>
                                    </div>
                                    {cache_data.food_type_name != undefined && cache_data.food_type_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">食事</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.food_type_name}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT){
              return (
                <>
                  <div
                    className="data-title"
                    onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.STOP_PRESCRIPTION, sort_index)}
                    onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.STOP_PRESCRIPTION, OPERATION_TYPE.REGIST, 0)}
                  >
                    <div className={`data-item ${sort_data[sort_index]['open'] == true ? 'open' : ''}`}>
                      <div className="flex">
                        <div className="note">【{this.context.karte_status.name}・中止処方】</div>
                        <div className="department text-right">{department_name}</div>
                      </div>
                      {cache_data[0].last_doctor_code !== undefined && (
                        <div style={{textAlign:"left"}}>
                          {this.authInfo.staff_category === 1 ? (
                            <>
                              {this.authInfo.doctor_code === cache_data[0].last_doctor_code ? (
                                <div>医師：{cache_data[0].last_doctor_name}</div>
                              ):(
                                <div>医師：{cache_data[0].last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                              )}
                            </>
                          ):(
                            <>
                              {this.context.selectedDoctor.code <= 0 ? (
                                <div>医師：{cache_data[0].last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                              ):(
                                <>
                                  {this.context.selectedDoctor.code == cache_data[0].last_doctor_code ? (
                                    <div>医師：{cache_data[0].last_doctor_name}</div>
                                  ):(
                                    <div>医師：{cache_data[0].last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      <Angle className="angle" icon={faAngleDown} />
                    </div>
                  </div>
                  <div
                    onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.STOP_PRESCRIPTION, OPERATION_TYPE.REGIST, 0)}
                    style={{display:sort_data[sort_index]['open'] == true ? 'block' : 'none'}}
                    onDoubleClick={()=>this.doubleClickEdit("stop_prescription", subkey)}
                  >
                    <MedicineListWrapper font_props = {this.props.font_props}>
                      <div className={`history-item soap-data-item open order line-done`}>
                        {cache_data.stopped_rps.map((item, key)=>{
                          return (
                            <div className="history-item" key={key}>
                              <div className="box w70p" draggable="true">
                                {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                  return (
                                    <div className="drug-item table-row" key={medicine_key}>
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
                                                  <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                                <div className="drug-item table-row">
                                  <div className="flex between">
                                    <div className="flex full-width table-item">
                                      <div className="number" style={underLine}>
                                      </div>
                                      
                                      <div className="ml-3 full-width mr-2">
                                        {item.stop_flag?'服薬中止日　('+formatJapanDateSlash(formatDateLine(item.stop_date)) + ')　':formatJapanDateSlash(formatDateLine(item.stop_date))}
                                      </div>
                                    </div>
                                    <div className="w80 table-item" style={textAlignRight}>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {cache_data.free_comment !== undefined && cache_data.free_comment !== null && cache_data.free_comment !== "" && (
                          <div className="phy-box w70p" draggable="true">
                            <div className="open order">
                              <div className="history-item">
                                <div className="phy-box w70p" draggable="true"></div>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </MedicineListWrapper>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.HOSPITAL_OUT){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.HOSPITAL_OUT, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.HOSPITAL_OUT, OPERATION_TYPE.REGIST, 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【入院・外泊・外出】</div>
                          <div className="department text-right">{cache_data.department_name}</div>
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.HOSPITAL_OUT, OPERATION_TYPE.REGIST, 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">配膳停止日</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(cache_data.stop_serving_date)+" ("+cache_data.stop_serving_time_class_name+")"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">外出泊理由</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.going_out_name}</div>
                                      </div>
                                    </div>
                                    {cache_data.stop_serving_comment != null && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.stop_serving_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.HOSPITAL_RETURN){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.HOSPITAL_RETURN, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.HOSPITAL_RETURN, OPERATION_TYPE.REGIST, 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【入院・帰院】</div>
                          <div className="department text-right">{cache_data.department_name}</div>
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.HOSPITAL_RETURN, OPERATION_TYPE.REGIST, 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">配膳開始日</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(cache_data.start_date)+" ("+cache_data.start_time_classification_name+")"}
                                        </div>
                                      </div>
                                    </div>
                                    {cache_data.start_comment != null && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.start_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.NUTRITION_GUIDANCE){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.NUTRITION_GUIDANCE, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.NUTRITION_GUIDANCE, (cache_data.isForUpdate === 1 ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【入院・栄養指導依頼】{cache_data.isForUpdate === 1 ? " ＜編集＞" : ""}</div>
                          <div className="department text-right">{cache_data.department_name}</div>
                        </div>
                        {cache_data.isForUpdate === 1 && cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.NUTRITION_GUIDANCE, (cache_data.isForUpdate === 1 ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open '+ (cache_data.isForUpdate == 1 ? 'line-done' : "")}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">予約日時</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(cache_data.reserve_datetime.split(' ')[0])+" "+cache_data.reserve_datetime.split(' ')[1]}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">身長</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.height}cm</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">体重</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.weight}㎏</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">BMI</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.bmi}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">病名</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {cache_data.request_disease_names.map(disease_name=>{
                                            return (
                                              <>
                                                <p style={{margin:0}}>{disease_name}</p>
                                              </>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">指示食種</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.food_type_name}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">エネルギー</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.calorie}kcal</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">塩分</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.salt_id}g</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">蛋白質</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.protein}g</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">リン</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.phosphorus_flag == 1 ? "制限あり" : "制限なし"}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">脂質</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.lipid}g</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">カリウム</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.potassium_flag == 1 ? "制限あり" : "制限なし"}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">糖質</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.sugar}g</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">水分</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.moisture}㎖</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">PFC比</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.pfc_ratio}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">P/S比</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.ps_ratio}</div>
                                      </div>
                                    </div>
                                    {cache_data.request_content_names.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">指示内容</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.request_content_names.map(content_name=>{
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
                                    {cache_data.guidance_content_other != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">指示内容のその他</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.guidance_content_other}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.importance_message_names.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">重点伝達事項</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.importance_message_names.map(message_name=>{
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
                                    {cache_data.content_other != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">重点伝達事項のその他</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.content_other}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.free_comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT, (cache_data.isForUpdate === 1 ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【入院・退院時指導レポート】{cache_data.isForUpdate === 1 ? " ＜編集＞" : ""}</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        {cache_data.isForUpdate === 1 && cache_data.last_doctor_code !== undefined && (
                          <div style={{textAlign:"left"}}>
                            {this.authInfo.staff_category === 1 ? (
                              <>
                                {this.authInfo.doctor_code === cache_data.last_doctor_code ? (
                                  <div>医師：{cache_data.last_doctor_name}</div>
                                ):(
                                  <div>医師：{cache_data.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                )}
                              </>
                            ):(
                              <>
                                {this.context.selectedDoctor.code <= 0 ? (
                                  <div>医師：{cache_data.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                ):(
                                  <>
                                    {this.context.selectedDoctor.code == cache_data.last_doctor_code ? (
                                      <div>医師：{cache_data.last_doctor_name}</div>
                                    ):(
                                      <div>医師：{cache_data.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.DISCHARGE_GUIDANCE_REPORT, (cache_data.isForUpdate === 1 ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST), 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open '+ (cache_data.isForUpdate == 1 ? 'line-done' : "")}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">日時</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {formatJapanDateSlash(cache_data.start_date)+" "+cache_data.start_time+'~'+cache_data.end_time}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">記載者</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.write_staff_name}</div>
                                      </div>
                                    </div>
                                    {cache_data.hospital_doctor_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院内】医師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.hospital_doctor_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.nurse_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院内】看護師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.nurse_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.discharge_support_nurse_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院内】退院支援看護師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.discharge_support_nurse_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.msw_text != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院内】ＭＳＷ</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.msw_text}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.hospital_other_text != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院内】その他</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.hospital_other_text}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.instructed_nurse_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院外】在宅医or指示を受けた看護師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.instructed_nurse_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.visit_nurse_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院外】訪問看護師</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.visit_nurse_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.care_manager_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院外】ケアマネージャー</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.care_manager_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.outside_hospital_other_text != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【院外】その他</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.outside_hospital_other_text}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.recheck != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">病状・病期の説明と患者・家族の理解の再確認</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.recheck}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.check_inject_names != undefined && cache_data.check_inject_names.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【薬・注射】</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.check_inject_names.map((name, index)=>{
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
                                    {cache_data.check_equipment_names != undefined && cache_data.check_equipment_names.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【医療機器】</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.check_equipment_names.map((name, index)=>{
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
                                    {((cache_data.check_treat_names != undefined && cache_data.check_treat_names.length > 0) || cache_data.treat_check_other_text != undefined) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【医療処置】</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.check_treat_names != undefined && cache_data.check_treat_names.length > 0 && (
                                              cache_data.check_treat_names.map((name, index)=> {
                                                return (
                                                  <>
                                                    <span>{index == 0 ? name : ("、"+name)}</span>
                                                  </>
                                                )
                                              })
                                            )}
                                            {cache_data.treat_check_other_text != undefined && (
                                              <span>
                                                {(cache_data.check_treat_names != undefined && cache_data.check_treat_names.length > 0) ? "、" : ""}
                                                {cache_data.treat_check_other_text}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.medicine_detail != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">詳細</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.medicine_detail}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.need_medicine != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">必要な医薬物品（製品名）・調達先</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.need_medicine}</div>
                                        </div>
                                      </div>
                                    )}
                                    {((cache_data.check_body_assistance_names != undefined && cache_data.check_body_assistance_names.length > 0) || cache_data.body_assistance_check_other_text != undefined) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">身体援助</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.check_body_assistance_names != undefined && cache_data.check_body_assistance_names.length > 0 && (
                                              cache_data.check_body_assistance_names.map((name, index)=> {
                                                return (
                                                  <>
                                                    <span>{index == 0 ? name : ("、"+name)}</span>
                                                  </>
                                                )
                                              })
                                            )}
                                            {cache_data.body_assistance_check_other_text != undefined && (
                                              <span>
                                                {(cache_data.check_body_assistance_names != undefined && cache_data.check_body_assistance_names.length > 0) ? "、" : ""}
                                                {cache_data.body_assistance_check_other_text}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.future_treatment_issue != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">今後の治療課題・生活課題</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.future_treatment_issue}</div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">【退院後(一ヶ月以内）病院看護師の訪問指導】</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.nurse_visit_guidance == 1 ? "有" : "無"}</div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">【退院直後・特別指示書での訪問看護の必要性】</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{cache_data.visit_nurse_need == 1 ? "有" : "無"}</div>
                                      </div>
                                    </div>
                                    {cache_data.discharge_date != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">退院予定日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {formatJapanDateSlash(cache_data.discharge_date)}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.move_tool != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">移送手段</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.move_tool}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.nurse_taxi_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">介護タクシー</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.nurse_taxi_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.discharge_after_doctor_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">退院後の主治医</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.discharge_after_doctor_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.home_doctor_name != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">在宅医</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.home_doctor_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.visit_nurse_period_first != undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【訪問看護指示書】</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.visit_nurse_period_first+"~"+cache_data.visit_nurse_period_second}ヶ月
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {(cache_data.general_hospital_check == 1 || cache_data.body_assistance_check_other_text != undefined) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">【緊急時対応】</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {cache_data.general_hospital_check == 1 ? "県立総合病院" : ""}
                                            {cache_data.body_assistance_check_other_text != undefined ?
                                              (cache_data.general_hospital_check == 1 ? "、"+cache_data.body_assistance_check_other_text : cache_data.body_assistance_check_other_text)
                                              : ""}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {cache_data.send_information == 1 && (
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.MEDICAL_EXAMINATION_RECORD, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.MEDICAL_EXAMINATION_RECORD, OPERATION_TYPE.REGIST, 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【{this.context.karte_status.name}・診察済記録オーダー】</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.MEDICAL_EXAMINATION_RECORD, OPERATION_TYPE.REGIST, 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
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
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
            if(key == CACHE_LOCALNAMES.DEATH_REGISTER){
              return (
                <>
                  <div className={"data-list"}>
                    <div
                      className="data-title"
                      onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.DEATH_REGISTER, sort_index)}
                      onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.DEATH_REGISTER, OPERATION_TYPE.REGIST, 0)}
                    >
                      <div className={sort_data[sort_index]['open'] == true ? 'data-item open' : 'data-item'}>
                        <div className="flex">
                          <div className="note">【{this.context.karte_status.name}・死亡登録】</div>
                          <div className="department text-right">{department_name}</div>
                        </div>
                        <Angle className="angle" icon={faAngleDown} />
                      </div>
                    </div>
                    <div onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.DEATH_REGISTER, OPERATION_TYPE.REGIST, 0)}>
                      <MedicineListWrapper font_props = {this.props.font_props}>
                        <div className={'history-item soap-data-item open'}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">死亡日付</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{formatJapanDateSlash(cache_data.death_date)}</div>
                                      </div>
                                    </div>
                                    {cache_data.free_comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{cache_data.free_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </>
              );
            }
          }
        }
      })
    }
    if(insert_data == null){
      insert_data = <></>;
    }
    return(
      <>
        {insert_data}
      </>
    );
  }
  
  getDepartmentName = (cache_data, key, _code=null) => {
    let code = "";
    if (key == CACHE_LOCALNAMES.INSPECTION_EDIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.RADIATION_EDIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.TREATMENT_EDIT) {
      code = cache_data.header.department_id;
    } else if(key == CACHE_LOCALNAMES.ALLERGY_EDIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.GUIDANCE_EDIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.MEAL_EDIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.MEAL_GROUP_EDIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.RIHABILY_EDIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.EXAM_EDIT) {
      code = cache_data.department_code;
    } else if(key == CACHE_LOCALNAMES.PRESCRIPTION_EDIT) {
      code = cache_data[0].department_code;
    } else if(key == CACHE_LOCALNAMES.INJECTION_EDIT) {
      code = cache_data[0].department_code;
    } else if(key == CACHE_LOCALNAMES.DISCHARGE_DONE || key == CACHE_LOCALNAMES.DISCHARGE_DECISION || key == CACHE_LOCALNAMES.DISCHARGE_PERMIT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.HOSPITAL_DONE || key == CACHE_LOCALNAMES.HOSPITAL_DONE_DELETE) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.DOCUMENT_CREATE || key == CACHE_LOCALNAMES.DOCUMENT_DELETE) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT) {
      code = cache_data.department_id;
    } else if(key == CACHE_LOCALNAMES.WARD_MOVE_DELETE) {
      code = cache_data.department_id;
    }
    if(_code != null) code = _code;
    let name = "";
    this.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
    return name;
  }
  
  getDepartmentIdFromDelCache = (_number=null, _type="prescription") => {
    if (_number == null) return null;
    let del_history = [];
    if(_type == "prescription"){
      del_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    } else if(_type == "injection"){
      del_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    }
    let result = null;
    if (del_history != undefined && del_history != null && del_history.length > 0) {
      del_history.map(ele=>{
        if (_number == ele.number) {
          result = ele.department_code;
        }
      });
    }
    return result;
  }
  
  getDeleteArea(){
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    //prescription
    const tmpPresData = this.state.prescriptionDelData;
    if(tmpPresData == undefined || tmpPresData == null || tmpPresData.length == 0){
      return (<></>);
    }
    //prescription
    const prescriptionData = tmpPresData.map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title" onMouseDown={(e) => this.onDeletedMedClicked(e, "all", element, CATEGORY_TYPE.PRESCRIPTION)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">【{this.getKarteStatusName(element)}・{this.getPrescriptionType(element)}処方】 ＜削除＞</div>
                <div className="department text-right">{this.getDepartmentName(null, null, this.getDepartmentIdFromDelCache(element.number))}</div>
                {/* <div className="department text-right">{department_name}</div> */}
              </div>
              <div className="date">
                {element.order_data.executed_date_time !== "" && (
                  <>
                    {element.order_data.executed_date_time.substr(0, 4)}/
                    {element.order_data.executed_date_time.substr(5, 2)}/
                    {element.order_data.executed_date_time.substr(8, 2)}
                    ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                    {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                    {element.order_data.executed_date_time.substr(14, 2)}分
                  </>
                )}
              </div>
              {element.last_doctor_code !== undefined && (
                <div style={{textAlign:"left"}}>
                  {this.authInfo.staff_category === 1 ? (
                    <>
                      {this.authInfo.doctor_code === element.last_doctor_code ? (
                        <div>医師：{element.last_doctor_name}</div>
                      ):(
                        <div>医師：{element.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                      )}
                    </>
                  ):(
                    <>
                      {this.context.selectedDoctor.code <= 0 ? (
                        <div>医師：{element.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                      ):(
                        <>
                          {this.context.selectedDoctor.code == element.last_doctor_code ? (
                            <div>医師：{element.last_doctor_name}</div>
                          ):(
                            <div>医師：{element.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {element.order_data.visit_place_id != undefined && element.order_data.visit_place_id != null && element.order_data.visit_place_id > 0 && (
                <div style={{textAlign:"left"}}>
                  <div>{this.getVisitPlaceName(element.order_data.visit_place_id)}</div>                            
                </div>
              )}
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <div
            onContextMenu={e=>this.orderHandleClick(e,
              CATEGORY_TYPE.PRESCRIPTION,
              OPERATION_TYPE.DELETE,
              "",              
              "",
              "prescription",
              element.created_at,
              index,
              "order_delete"
            )}            
          >
            <MedicineListWrapper font_props = {this.props.font_props}>
              <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
                {element.order_data.order_data.filter(item => {
                  // if (item.usage_name.includes("ＸＸ")) {
                  //     return false;
                  // }
                  // if (
                  //     parseInt(item.usage) > 0 &&
                  //     item.enable_days !== undefined &&
                  //     item.enable_days === 0
                  // ) {
                  //     return true;
                  // }
                  return ( item.usage_name != "" );
                }).map((item, key)=>{
                  let keyName = {                  
                    one_dose_package: "一包化",
                    temporary_medication: "臨時処方",
                    mixture:"混合"
                  };
                  let sameKeys = this.getCheckSameOptionsMiddle(item);
                  let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptionsMiddle(item, sameKeys) : "";
                  let sameOptionsView;                
                  if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {                  
                    sameOptionsView = (
                      <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
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
                  return (
                    <div className="history-item" key={key}>
                      <div className="box w70p" draggable="true">
                        {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
                          return (
                            <>
                              <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                <div className="flex between">
                                  <div className="flex full-width table-item text-right">
                                    <div className="number align-left" style={underLine}>
                                      {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                    </div>
                                    
                                    <div className="ml-3 full-width w100 align-left">
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
                                            <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                        <div className="flex between drug-item table-row">
                          <div className="text-right">
                            <div className="table-item">
                              {!item.usage_name ? "" : `用法: ${item.usage_name}`}
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
                        {sameOptionsView}
                        {item.start_date !== undefined && item.start_date !== "" && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
                            </div>
                          </div>
                        )}
                        {item.insurance_type !== undefined && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`保険: ${this.getInsurance(item.insurance_type)}`}
                            </div>
                          </div>
                        )}
                        {item.body_part !== undefined && item.body_part !== "" && (
                          <div className="flex between option table-row prescription-body-part">
                            <div className="text-right table-item">
                              {`部位/補足: ${item.body_part}`}
                            </div>
                          </div>
                        )}
                        {item.discontinuation_start_date !== undefined &&
                        item.discontinuation_start_date !== "" && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`中止期間の最初日: ${formatDate(
                                item.discontinuation_start_date
                              )}`}
                            </div>
                          </div>
                        )}
                        {item.discontinuation_end_date !== undefined &&
                        item.discontinuation_end_date !== "" && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`中止期間の最後日: ${formatDate(
                                item.discontinuation_end_date
                              )}`}
                            </div>
                          </div>
                        )}
                        {item.discontinuation_comment !== undefined &&
                        item.discontinuation_comment !== "" && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`中止コメント: ${item.discontinuation_comment}`}
                            </div>
                          </div>
                        )}                                            
                        {item.med_consult !== undefined &&
                        item.med_consult == 1 && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              【お薬相談希望あり】
                            </div>
                          </div>
                        )}
                        {item.supply_med_info !== undefined &&
                        item.supply_med_info == 1 && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              【薬剤情報提供あり】
                            </div>
                          </div>
                        )}
                        {element.order_data.potion !== undefined &&
                        (element.order_data.potion == 0 || element.order_data.potion == 1) && element.order_data.is_internal_prescription == 5 && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {element.order_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                {element.order_data != null && element.order_data.psychotropic_drugs_much_reason != null && element.order_data.psychotropic_drugs_much_reason !== undefined && element.order_data.psychotropic_drugs_much_reason !== "" && (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item" style={{paddingLeft: 50}}>
                          <label>向精神薬多剤投与理由:</label>
                          <label>{element.order_data.psychotropic_drugs_much_reason}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {element.order_data != null && element.order_data.poultice_many_reason != null && element.order_data.poultice_many_reason !== undefined && element.order_data.poultice_many_reason !== "" && (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item" style={{paddingLeft: 50}}>
                          <label>湿布薬超過投与理由:</label>
                          <label>{element.order_data.poultice_many_reason}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {element.order_data != null &&
                element.order_data.free_comment != null &&
                element.order_data.free_comment !== undefined &&
                element.order_data.free_comment.length > 0 &&
                element.order_data.free_comment[0] != null &&
                element.order_data.free_comment[0] != undefined &&
                element.order_data.free_comment[0] != "" && (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item" style={{paddingLeft:"50px"}}>
                          <label>備考:</label>
                          <label>{element.order_data.free_comment[0]}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  {element.order_data.item_details != null && element.order_data.item_details != undefined && element.order_data.item_details.length > 0 && element.order_data.item_details.map(ele=>{
                    return(
                      <>
                        {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                          <div className="function-region">
                            <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                            <label>
                              {ele.value1 != null && ele.value1 != undefined && (
                                <>{ele.value1}<br/></>
                              )}
                              {ele.value2 != null && ele.value2 != undefined && (
                                <>{ele.value2}</>
                              )}
                            </label>
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
            </MedicineListWrapper>
          </div>
        </div>
      )
    });
    return(
      <>
        {prescriptionData}
      </>
    );
  }
  
  getDeleteInjectionArea(){
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    //injection
    const tmpInjectionData = this.state.injectionDelData;
    if(tmpInjectionData == undefined || tmpInjectionData == null || tmpInjectionData.length == 0){
      return (<></>);
    }
    //injection
    const injectionData = tmpInjectionData.map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title" onMouseDown={(e) => this.onDeletedMedClicked(e, "all", element, CATEGORY_TYPE.INJECTION)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">【{this.getKarteStatusName(element)}・注射】 ＜削除＞</div>
                <div className="department text-right">{this.getDepartmentName(null, null, this.getDepartmentIdFromDelCache(element.number, "injection"))}</div>
              </div>
              <div className="date">
                {element.order_data.executed_date_time !== "" && (
                  <>
                    {element.order_data.executed_date_time.substr(0, 4)}/
                    {element.order_data.executed_date_time.substr(5, 2)}/
                    {element.order_data.executed_date_time.substr(8, 2)}
                    ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                    {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                    {element.order_data.executed_date_time.substr(14, 2)}分
                  </>
                )}
              </div>
              {element.last_doctor_code !== undefined && (
                <div style={{textAlign:"left"}}>
                  {this.authInfo.staff_category === 1 ? (
                    <>
                      {this.authInfo.doctor_code === element.last_doctor_code ? (
                        <div>医師：{element.last_doctor_name}</div>
                      ):(
                        <div>医師：{element.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                      )}
                    </>
                  ):(
                    <>
                      {this.context.selectedDoctor.code <= 0 ? (
                        <div>医師：{element.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                      ):(
                        <>
                          {this.context.selectedDoctor.code == element.last_doctor_code ? (
                            <div>医師：{element.last_doctor_name}</div>
                          ):(
                            <div>医師：{element.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {element.order_data.visit_place_id != undefined && element.order_data.visit_place_id != null && element.order_data.visit_place_id > 0 && (
                <div style={{textAlign:"left"}}>
                  <div>{this.getVisitPlaceName(element.order_data.visit_place_id)}</div>                            
                </div>
              )}
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <div
            onContextMenu={e=>this.orderHandleClick(e,
              CATEGORY_TYPE.INJECTION,
              OPERATION_TYPE.DELETE,
              "",              
              "",
              "injection",
              element.created_at,
              index,
              "order_delete"
            )}            
          >
            <MedicineListWrapper font_props = {this.props.font_props}>
              <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
                {element.order_data.order_data.map((item, key) => {
                  if(item.usage_name != ""){
                    return (
                      <div className="history-item" key={key}>
                        <div className="box w70p" draggable="true">
                          <div className="flex between drug-item table-row">
                            <div className="number" style={underLine}>
                              {" Rp" + parseInt(key + 1)}
                            </div>
                            <div className="text-right">
                              <div className="table-item">
                                {item.usage_name && (
                                  <>
                                    <label>手技: </label>
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
                          {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
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
                                            <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                          {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                            <div className="flex between drug-item table-row">
                              <div className="text-right">
                                <div className="table-item">
                                  {item.injectUsageName && (
                                    <>
                                      <label>用法: </label>
                                      <label>{item.injectUsageName}</label>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="w80 table-item">
                              </div>
                            </div>
                          )}
                          {item.usageName != undefined && item.usageName != null && item.usageName != "" && (
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
                          )}
                        </div>
                      </div>
                    )
                  }
                })}
                <div className="flex between drug-item table-row">
                  <div className="text-right">
                    {element.order_data.schedule_date != undefined && element.order_data.schedule_date != null && element.order_data.schedule_date != "" && (
                      <div className="table-item">
                        <label>実施予定日: </label>
                        <label>{formatJapanDateSlash(element.order_data.schedule_date)}</label>
                      </div>
                    )}
                    {element.done_order == 1 && (
                      <div className="table-item">
                        <label>実施日時: </label>
                        <label>{formatJapanDateSlash(element.order_data.executed_date_time) + " " + element.order_data.executed_date_time.substr(11, 2) + "時" + element.order_data.executed_date_time.substr(14, 2) + "分"}</label>
                      </div>
                    )}
                  </div>
                  <div className="w80 table-item"></div>
                </div>
                {element.order_data.location_name !== null && element.order_data.location_name !== undefined && element.order_data.location_name != "" && (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item">
                          <label>実施場所: </label>
                          <label>{element.order_data.location_name}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {element.order_data.drip_rate !== null && element.order_data.drip_rate !== undefined && element.order_data.drip_rate !== "" &&
                element.order_data.drip_rate !== 0 && (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item">
                          <label>点滴速度: </label>
                          <label>{element.order_data.drip_rate}ml/h</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {element.order_data.water_bubble !== null && element.order_data.water_bubble !== undefined && element.order_data.water_bubble !== "" &&
                element.order_data.water_bubble !== 0 && (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item">
                          <label>1分あたり: </label>
                          <label>{element.order_data.water_bubble}滴</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {element.order_data.exchange_cycle !== null && element.order_data.exchange_cycle !== undefined && element.order_data.exchange_cycle !== "" &&
                element.order_data.exchange_cycle !== 0 && (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item">
                          <label>交換サイクル: </label>
                          <label>{element.order_data.exchange_cycle}時間</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {element.order_data.require_time !== null && element.order_data.require_time !== undefined && element.order_data.require_time !== "" &&
                element.order_data.require_time !== 0 && (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item">
                          <label>所要時間: </label>
                          <label>{element.order_data.require_time}時間</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {element.order_data != null &&
                element.order_data.free_comment != null &&
                element.order_data.free_comment !== undefined &&
                element.order_data.free_comment.length > 0 &&
                element.order_data.free_comment[0] != null &&
                element.order_data.free_comment[0] != undefined &&
                element.order_data.free_comment[0] != "" &&  (
                  <div className="history-item">
                    <div className="box">
                      <div className="flex between option table-row">
                        <div className="text-right table-item" style={{paddingLeft:"50px"}}>
                          <label>備考: </label>
                          <label>{element.order_data.free_comment[0]}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  {element.order_data.item_details != null && element.order_data.item_details != undefined && element.order_data.item_details.length > 0 && element.order_data.item_details.map(ele=>{
                    return(
                      <>
                        {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                          <div className="function-region">
                            <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                            {ele.format1 != null && ele.format1 != undefined && ele.format1.includes("年") && ele.format1.includes("月") ? (
                              <label>
                                {ele.value1 != null && ele.value1 != undefined && (
                                  <label>{(ele.value1_format !== undefined) ? ele.value1_format : ele.value1}</label>
                                )}
                                {ele.value2 != null && ele.value2 != undefined && (
                                  <> ~ <label>{(ele.value2_format !== undefined) ? ele.value2_format : ele.value2}</label></>
                                )}
                              </label>
                            ):(
                              <label>
                                {ele.value1 != null && ele.value1 != undefined && (
                                  <label>{ele.value1}</label>
                                )}
                                {ele.value2 != null && ele.value2 != undefined && (
                                  <label>{ele.value2}</label>
                                )}
                              </label>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
            </MedicineListWrapper>
          </div>
        </div>
      )
    });
    
    return(
      <>
        {injectionData}
      </>
    );
  }
  
  getDeleteRpArea(){
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    //prescription
    const tmpPresData = this.state.prescriptionDelRpData;
    if(tmpPresData == undefined || tmpPresData == null || tmpPresData.length == 0){
      return (<></>);
    }
    //prescription
    const prescriptionData = tmpPresData.map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title"  onMouseDown={(e) => this.onDeletedMedClicked(e, "rp", element, CATEGORY_TYPE.PRESCRIPTION)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">【{this.getKarteStatusName(element)}・{this.getPrescriptionType(element)}処方】 ＜一部削除＞</div>
                <div className="department text-right">{this.getDepartmentName(null, null, this.getDepartmentIdFromDelCache(element.number))}</div>
              </div>
              <div className="date">
                {element.order_data.executed_date_time !== "" && (
                  <>
                    {element.order_data.executed_date_time.substr(0, 4)}/
                    {element.order_data.executed_date_time.substr(5, 2)}/
                    {element.order_data.executed_date_time.substr(8, 2)}
                    ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                    {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                    {element.order_data.executed_date_time.substr(14, 2)}分
                  </>
                )}
              </div>
              {element.last_doctor_code !== undefined && (
                <div style={{textAlign:"left"}}>
                  {this.authInfo.staff_category === 1 ? (
                    <>
                      {this.authInfo.doctor_code === element.last_doctor_code ? (
                        <div>医師：{element.last_doctor_name}</div>
                      ):(
                        <div>医師：{element.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                      )}
                    </>
                  ):(
                    <>
                      {this.context.selectedDoctor.code <= 0 ? (
                        <div>医師：{element.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                      ):(
                        <>
                          {this.context.selectedDoctor.code == element.last_doctor_code ? (
                            <div>医師：{element.last_doctor_name}</div>
                          ):(
                            <div>医師：{element.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {element.order_data.visit_place_id != undefined && element.order_data.visit_place_id != null && element.order_data.visit_place_id > 0 && (
                <div style={{textAlign:"left"}}>
                  <div>{this.getVisitPlaceName(element.order_data.visit_place_id)}</div>                            
                </div>
              )}
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <div
            onContextMenu={e=>this.orderHandleClick(e,
              CATEGORY_TYPE.PRESCRIPTION,
              OPERATION_TYPE.DELETE,
              "",              
              "",
              "prescription",
              element.created_at,
              index,
              "rp_delete"
            )}            
          >
            <MedicineListWrapper font_props = {this.props.font_props}>
              <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
                {element.order_data.order_data.filter(item => {
                  return (item.usage_name != "");
                }).map((item, key)=>{
                  let keyName = {                  
                    one_dose_package: "一包化",
                    temporary_medication: "臨時処方",
                    mixture:"混合"
                  };
                  let sameKeys = this.getCheckSameOptionsMiddle(item);
                  let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptionsMiddle(item, sameKeys) : "";
                  let sameOptionsView;                
                  if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {
                    sameOptionsView = (
                      <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
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
                  return (
                    <div className="history-item" key={key}>
                      <div className="box w70p" draggable="true">
                        {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
                          return (
                            <>
                              <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                <div className="flex between">
                                  <div className="flex full-width table-item text-right">
                                    <div className="number align-left" style={underLine}>
                                      {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                    </div>
                                    
                                    <div className="ml-3 full-width w100 align-left">
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
                                            <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                        <div className="flex between drug-item table-row">
                          <div className="text-right">
                            <div className="table-item">
                              {item.usage_name && (
                                <>
                                  <label>用法: </label>
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
                        {sameOptionsView}
                        {item.start_date !== undefined && item.start_date !== "" && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              <label>処方開始日: </label>
                              <label>{formatJapanDateSlash(formatDate(item.start_date))}</label>
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
                        {item.med_consult !== undefined &&
                        item.med_consult == 1 && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              【お薬相談希望あり】
                            </div>
                          </div>
                        )}
                        {item.supply_med_info !== undefined &&
                        item.supply_med_info == 1 && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              【薬剤情報提供あり】
                            </div>
                          </div>
                        )}
                        {element.order_data.potion !== undefined &&
                        (element.order_data.potion == 0 || element.order_data.potion == 1) && element.order_data.is_internal_prescription == 5 && (
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {element.order_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}                
              </div>
            </MedicineListWrapper>
          </div>
        </div>
      )
    });
    
    return(
      <>
        {prescriptionData}
      </>
    );
  }
  
  getDeleteInjectionRpArea(){
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    // injection
    const tmpInjectData = this.state.injectionDelRpData;
    if(tmpInjectData == undefined || tmpInjectData == null || tmpInjectData.length == 0){
      return (<></>);
    }
    // injection
    const injectionData = tmpInjectData.map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title"  onMouseDown={(e) => this.onDeletedMedClicked(e, "rp", element, CATEGORY_TYPE.INJECTION)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">【{this.getKarteStatusName(element)}・注射】 ＜一部削除＞</div>
                <div className="department text-right">{this.getDepartmentName(null, null, this.getDepartmentIdFromDelCache(element.number, "injection"))}</div>
              </div>
              <div className="date">
                {element.order_data.executed_date_time !== "" && (
                  <>
                    {element.order_data.executed_date_time.substr(0, 4)}/
                    {element.order_data.executed_date_time.substr(5, 2)}/
                    {element.order_data.executed_date_time.substr(8, 2)}
                    ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                    {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                    {element.order_data.executed_date_time.substr(14, 2)}分
                  </>
                )}
              </div>
              {element.last_doctor_code !== undefined && (
                <div style={{textAlign:"left"}}>
                  {this.authInfo.staff_category === 1 ? (
                    <>
                      {this.authInfo.doctor_code === element.last_doctor_code ? (
                        <div>医師：{element.last_doctor_name}</div>
                      ):(
                        <div>医師：{element.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                      )}
                    </>
                  ):(
                    <>
                      {this.context.selectedDoctor.code <= 0 ? (
                        <div>医師：{element.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                      ):(
                        <>
                          {this.context.selectedDoctor.code == element.last_doctor_code ? (
                            <div>医師：{element.last_doctor_name}</div>
                          ):(
                            <div>医師：{element.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {element.order_data.visit_place_id != undefined && element.order_data.visit_place_id != null && element.order_data.visit_place_id > 0 && (
                <div style={{textAlign:"left"}}>
                  <div>{this.getVisitPlaceName(element.order_data.visit_place_id)}</div>                            
                </div>
              )}
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <div
            onContextMenu={e=>this.orderHandleClick(e,
              CATEGORY_TYPE.INJECTION,
              OPERATION_TYPE.DELETE,
              "",              
              "",
              "injection",
              element.created_at,
              index,
              "rp_delete"
            )}            
          >
            <MedicineListWrapper font_props = {this.props.font_props}>
              <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
                {element.order_data.order_data.filter(item => {
                  // if (item.usage_name.includes("ＸＸ")) {
                  //     return false;
                  // }
                  // if (
                  //     parseInt(item.usage) > 0
                  // ) {
                  //     return true;
                  // }
                  // return (
                  //     item.usage > 0 &&
                  //     (item.days > 0 ||
                  //         (item.usage_replace_number !== undefined &&
                  //             item.usage_replace_number.length > 0))
                  // );
                  return ( item.usage_name != "" );
                }).map((item, key)=>{
                  return (
                    <div className="history-item" key={key}>
                      <div className="box w70p" draggable="true">
                        <div className="flex between drug-item table-row">
                          <div className="number" style={underLine}>
                            {" Rp" + parseInt(key + 1)}
                          </div>
                          <div className="text-right">
                            <div className="table-item">
                              {!item.usage_name ? "" : `手技: ${item.usage_name}`}
                            </div>
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
                        {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
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
                                          <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                        {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                          <div className="flex between drug-item table-row">
                            <div className="text-right">
                              <div className="table-item">
                                {item.injectUsageName && (
                                  <>
                                    <label>用法: </label>
                                    <label>{item.injectUsageName}</label>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="w80 table-item">
                            </div>
                          </div>
                        )}
                        {item.usageName != undefined && item.usageName != null && item.usageName != "" && (
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
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </MedicineListWrapper>
          </div>
        </div>
      )
    });
    return(
      <>
        {injectionData}
      </>
    );
  }
  
  getDonePrescriptionPart = () => {
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    const tmpPresData = this.state.donePrescription;
    //prescription
    const prescriptionData = tmpPresData.map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title" onMouseDown={(e) => this.onDoneClicked(e, "prescription", element, CATEGORY_TYPE.PRESCRIPTION, index)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">【{this.context.karte_status.name}・{element.order_data.is_internal_prescription == 0?"院外" : "院内"}処方】 ＜実施＞</div>
                <div className="department text-right">{department_name}</div>
              </div>
              <div className="date">
                {element.order_data.executed_date_time !== "" && (
                  <>
                    {element.order_data.executed_date_time.substr(0, 4)}/
                    {element.order_data.executed_date_time.substr(5, 2)}/
                    {element.order_data.executed_date_time.substr(8, 2)}
                    ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                    {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                    {element.order_data.executed_date_time.substr(14, 2)}分
                  </>
                )}
              </div>
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <MedicineListWrapper font_props = {this.props.font_props}>
            <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-done' : ''}`}>
              {element.order_data.order_data.filter(item => {
                if (item.usage_name.includes("ＸＸ")) {
                  return false;
                }
                if (
                  parseInt(item.usage) > 0 &&
                  item.enable_days !== undefined &&
                  item.enable_days === 0
                ) {
                  return true;
                }
                return (
                  item.usage > 0 &&
                  (item.days > 0 ||
                    (item.usage_replace_number !== undefined &&
                      item.usage_replace_number.length > 0))
                );
              }).map((item, key)=>{
                let keyName = {                  
                  one_dose_package: "一包化",
                  temporary_medication: "臨時処方",
                  mixture:"混合"
                };
                let sameKeys = this.getCheckSameOptionsMiddle(item);
                let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptionsMiddle(item, sameKeys) : "";
                let sameOptionsView;                
                if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {                  
                  sameOptionsView = (
                    <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
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
                return (
                  <div className="history-item" key={key}>
                    <div className="box w70p" draggable="true">
                      {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
                        return (
                          <>
                            <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                              <div className="flex between">
                                <div className="flex full-width table-item text-right">
                                  <div className="number align-left" style={underLine}>
                                    {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                  </div>
                                  
                                  <div className="ml-3 full-width w100 align-left">
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
                                          <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                      <div className="flex between drug-item table-row">
                        <div className="text-right">
                          <div className="table-item">
                            {item.usage_name && (
                              <>
                                <label>用法: </label>
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
                      {sameOptionsView}
                      {item.start_date !== undefined && item.start_date !== "" && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            <label>処方開始日: </label>
                            <label>{formatJapanDateSlash(formatDate(item.start_date))}</label>
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
                      {item.med_consult !== undefined &&
                      item.med_consult == 1 && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            【お薬相談希望あり】
                          </div>
                        </div>
                      )}
                      {item.supply_med_info !== undefined &&
                      item.supply_med_info == 1 && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            【薬剤情報提供あり】
                          </div>
                        </div>
                      )}
                      {element.order_data.potion !== undefined &&
                      (element.order_data.potion == 0 || element.order_data.potion == 1) && element.order_data.is_internal_prescription == 5 && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            {element.order_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {element.order_data != null && element.order_data.psychotropic_drugs_much_reason != null && element.order_data.psychotropic_drugs_much_reason !== undefined && element.order_data.psychotropic_drugs_much_reason !== "" && (
                <div className="history-item">
                  <div className="box">
                    <div className="flex between option table-row">
                      <div className="text-right table-item" style={{paddingLeft: 50}}>
                        <label>向精神薬多剤投与理由:</label>
                        <label>{element.order_data.psychotropic_drugs_much_reason}</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {element.order_data != null && element.order_data.poultice_many_reason != null && element.order_data.poultice_many_reason !== undefined && element.order_data.poultice_many_reason !== "" && (
                <div className="history-item">
                  <div className="box">
                    <div className="flex between option table-row">
                      <div className="text-right table-item" style={{paddingLeft: 50}}>
                        <label>湿布薬超過投与理由:</label>
                        <label>{element.order_data.poultice_many_reason}</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {element.order_data != null &&
              element.order_data.free_comment != null &&
              element.order_data.free_comment !== undefined &&
              element.order_data.free_comment.length > 0 &&
              element.order_data.free_comment[0] != null &&
              element.order_data.free_comment[0] != undefined &&
              element.order_data.free_comment[0] != "" && (
                <div className="history-item">
                  <div className="box">
                    <div className="flex between option table-row">
                      <div className="text-right table-item" style={{paddingLeft:"50px"}}>
                        <label>備考:</label>
                        <label>{element.order_data.free_comment[0]}</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div>
                {element.order_data.item_details != null && element.order_data.item_details != undefined && element.order_data.item_details.length > 0 && element.order_data.item_details.map(ele=>{
                  return(
                    <>
                      {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                        <div className="function-region">
                          <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                          <label>
                            {ele.value1 != null && ele.value1 != undefined && (
                              <>{ele.value1}<br/></>
                            )}
                            {ele.value2 != null && ele.value2 != undefined && (
                              <>{ele.value2}</>
                            )}
                          </label>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          </MedicineListWrapper>
        </div>
      )
    });
    return(
      <>
        {prescriptionData}
      </>
    );
  }
  
  getDoneInjectionPart = () => {
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    const tmpInjectData = this.state.doneInjection;
    
    // injection
    const injectionData = tmpInjectData.map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title"  onMouseDown={(e) => this.onDoneClicked(e, "injection", element, CATEGORY_TYPE.INJECTION, index)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">【{this.context.karte_status.name}・注射】 ＜実施＞</div>
                <div className="department text-right">{department_name}</div>
              </div>
              <div className="date">
                {element.order_data.executed_date_time !== "" && (
                  <>
                    {element.order_data.executed_date_time.substr(0, 4)}/
                    {element.order_data.executed_date_time.substr(5, 2)}/
                    {element.order_data.executed_date_time.substr(8, 2)}
                    ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                    {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                    {element.order_data.executed_date_time.substr(14, 2)}分
                  </>
                )}
              </div>
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <MedicineListWrapper font_props = {this.props.font_props}>
            <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-done' : ''}`}>
              {element.order_data.order_data.filter(item => {
                if (item.usage_name.includes("ＸＸ")) {
                  return false;
                }
                if (
                  parseInt(item.usage) > 0
                ) {
                  return true;
                }
                return (
                  item.usage > 0 &&
                  (item.days > 0 ||
                    (item.usage_replace_number !== undefined &&
                      item.usage_replace_number.length > 0))
                );
              }).map((item, key)=>{
                return (
                  <div className="history-item" key={key}>
                    <div className="box w70p" draggable="true">
                      <div className="flex between drug-item table-row">
                        <div className="number" style={underLine}>
                          {" Rp" + parseInt(key + 1)}
                        </div>
                        <div className="text-right">
                          <div className="table-item">
                            {item.usage_name && (
                              <>
                                <label>手技: </label>
                                <label>{item.usage_name}</label>
                              </>
                            )}
                          </div>
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
                      {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
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
                                        <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                      {item.is_precision !== undefined && item.is_precision == 1 && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            【精密持続点滴】
                          </div>
                        </div>
                      )}
                      {item.start_date !== undefined && item.start_date !== "" && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            <label>処方開始日: </label>
                            <label>{formatJapanDateSlash(formatDate(item.start_date))}</label>
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
                      {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-right">
                            <div className="table-item">
                              {item.injectUsageName && (
                                <>
                                  <label>用法: </label>
                                  <label>{item.injectUsageName}</label>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="w80 table-item">
                          </div>
                        </div>
                      )}
                      {item.usageName != undefined && item.usageName != null && item.usageName != "" && (
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
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </MedicineListWrapper>
        </div>
      )
    });
    return(
      <>
        {injectionData}
      </>
    );
  }
  
  getDoneExamOrderPart = () => {
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    let tmpExamOrderData =  karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_ORDER_DONE);
    if (tmpExamOrderData == undefined) tmpExamOrderData= [];
    
    // injection
    const injectionData = tmpExamOrderData.filter(item=>{
      if (item.is_done !== undefined && item.is_done !== null && item.is_done === 1) {
        return true;
      }
      return false;
    }).map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title" onMouseDown={(e) => this.onDoneClicked(e, "examOrder", element, CATEGORY_TYPE.EXAMINATION, index)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">{this.context.karte_status.name}・{element.modalName != undefined ? element.modalName: "検体検査"} ＜実施＞</div>
                <div className="department text-right">{department_name}</div>
              </div>
              <div className="date">
                {(element.created_at != undefined && element.created_at != null && element.created_at !== "") ? formatJapanSlashDateTime(element.created_at):""}
              </div>
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <MedicineListWrapper font_props = {this.props.font_props}>
            <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-done' : ''}`}>
              <div className="history-item">
                <div className="box w70p" draggable="true">
                  <div className="flex between drug-item table-row">
                    <div className="text-right">
                      <div className="table-item">検査日時: {element.collected_date === "" ? "次回診察日" : element.collected_time === "" ? element.collected_date.split("-").join("/") : element.collected_date.split("-").join("/")+"  "+element.collected_time.substr(0,element.collected_time.length-3)}</div>
                      <div className="table-item remarks-comment"></div>
                    </div>
                  </div>
                  <div className="flex between drug-item table-row">
                    <div className="text-right">
                      <div className="table-item">検査項目</div>
                      <div className="table-item remarks-comment"></div>
                    </div>
                  </div>
                  {element.examinations.map((item, key)=> {
                    return (
                      <div className="flex between drug-item table-row" key={key}>
                        <div className="text-left exam-order">
                          <div className="table-item">{item.name}</div>
                        </div>
                      </div>
                    )
                  })}
                  {element.order_comment !== "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-right">
                        <div className="table-item">依頼コメント: {element.order_comment}</div>
                        <div className="table-item remarks-comment"></div>
                      </div>
                    </div>
                  )}
                  
                  {element.free_comment !== "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-right">
                        <div className="table-item">フリーコメント: {element.free_comment}</div>
                        <div className="table-item remarks-comment"></div>
                      </div>
                    </div>
                  )}
                
                </div>
              </div>
            </div>
          </MedicineListWrapper>
        </div>
      )
    });
    return(
      <>
        {injectionData}
      </>
    );
  }
  
  getStopPrescriptionArea = () => {
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    const tmpPresData = this.state.stopPrescription;
    //prescription
    const prescriptionData = tmpPresData.map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title" onMouseDown={(e) => this.onStopClicked(e, "prescription", element, CATEGORY_TYPE.PRESCRIPTION)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">【{this.context.karte_status.name}・{element.order_data.is_internal_prescription == 0?"院外" : "院内"}処方】 ＜中止＞</div>
                <div className="department text-right">{department_name}</div>
              </div>
              <div className="date">
                {element.order_data.executed_date_time !== "" && (
                  <>
                    {element.order_data.executed_date_time.substr(0, 4)}/
                    {element.order_data.executed_date_time.substr(5, 2)}/
                    {element.order_data.executed_date_time.substr(8, 2)}
                    ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                    {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                    {element.order_data.executed_date_time.substr(14, 2)}分
                  </>
                )}
              </div>
              {element.last_doctor_code !== undefined && (
                <div style={{textAlign:"left"}}>
                  {this.authInfo.staff_category === 1 ? (
                    <>
                      {this.authInfo.doctor_code === element.last_doctor_code ? (
                        <div>医師：{element.last_doctor_name}</div>
                      ):(
                        <div>医師：{element.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                      )}
                    </>
                  ):(
                    <>
                      {this.context.selectedDoctor.code <= 0 ? (
                        <div>医師：{element.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                      ):(
                        <>
                          {this.context.selectedDoctor.code == element.last_doctor_code ? (
                            <div>医師：{element.last_doctor_name}</div>
                          ):(
                            <div>医師：{element.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {element.order_data.visit_place_id != undefined && element.order_data.visit_place_id != null && element.order_data.visit_place_id > 0 && (
                <div style={{textAlign:"left"}}>
                  <div>{this.getVisitPlaceName(element.order_data.visit_place_id)}</div>                            
                </div>
              )}
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <MedicineListWrapper font_props = {this.props.font_props}>
            <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
              {element.order_data.order_data.filter(item => {
                if (item.usage_name.includes("ＸＸ")) {
                  return false;
                }
                if (
                  parseInt(item.usage) > 0 &&
                  item.enable_days !== undefined &&
                  item.enable_days === 0
                ) {
                  return true;
                }
                return (
                  item.usage > 0 &&
                  (item.days > 0 ||
                    (item.usage_replace_number !== undefined &&
                      item.usage_replace_number.length > 0))
                );
              }).map((item, key)=>{
                return (
                  <div className="history-item" key={key}>
                    <div className="box w70p" draggable="true">
                      {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
                        return (
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
                                        <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                      <div className="flex between drug-item table-row">
                        <div className="text-right">
                          <div className="table-item">
                            {item.usage_name && (
                              <>
                                <label>用法: </label>
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
                      {item.is_precision !== undefined && item.is_precision == 1 && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            【精密持続点滴】
                          </div>
                        </div>
                      )}
                      {item.start_date !== undefined && item.start_date !== "" && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            <label>処方開始日: </label>
                            <label>{formatJapanDateSlash(formatDate(item.start_date))}</label>
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
                      {(item.temporary_medication !== undefined && item.temporary_medication === 1) ||
                      (item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1) ||
                      (item.med[0].milling !== undefined && item.med[0].milling === 1) ||
                      (item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1) ||
                      (item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1) ||
                      (item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1) && (
                        <div className="option flex table-item table-row dcVhIR">
                          <div className={'text-right table-item'}>
                            {item.temporary_medication !== undefined && item.temporary_medication === 1 && (
                              <p className="gCXasu">【臨時処方】&nbsp;</p>
                            )}
                            {item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1 && (
                              <p className="gCXasu">【一包化】&nbsp;</p>
                            )}
                            {item.med[0].milling !== undefined && item.med[0].milling === 1 && (
                              <p className="gCXasu">【粉砕】&nbsp;</p>
                            )}
                            {item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1 && (
                              <p className="gCXasu">【後発不可】&nbsp;</p>
                            )}
                            {item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1 && (
                              <p className="gCXasu">【別包】&nbsp;</p>
                            )}
                            {item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1 && (
                              <p className="gCXasu">【一般名処方】&nbsp;</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </MedicineListWrapper>
        </div>
      )
    });
    return(
      <>
        {prescriptionData}
      </>
    );
  }
  
  getStopInjectionArea = () => {
    let department_name = this.context.department.name;
    if (department_name == "") department_name = "内科";
    const tmpInjectData = this.state.stopInjection;
    
    // injection
    const injectionData = tmpInjectData.map((element, index) => {
      return (
        <div className="data-list" key={index}>
          <div className="data-title"  onMouseDown={(e) => this.onStopClicked(e, "injection", element, CATEGORY_TYPE.INJECTION)}>
            <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
              <div className="flex">
                <div className="note">【{this.context.karte_status.name}・注射】 ＜中止＞</div>
                <div className="department text-right">{department_name}</div>
              </div>
              <div className="date">
                {element.order_data.executed_date_time !== "" && (
                  <>
                    {element.order_data.executed_date_time.substr(0, 4)}/
                    {element.order_data.executed_date_time.substr(5, 2)}/
                    {element.order_data.executed_date_time.substr(8, 2)}
                    ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                    {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                    {element.order_data.executed_date_time.substr(14, 2)}分
                  </>
                )}
              </div>
              {element.last_doctor_code !== undefined && (
                <div style={{textAlign:"left"}}>
                  {this.authInfo.staff_category === 1 ? (
                    <>
                      {this.authInfo.doctor_code === element.last_doctor_code ? (
                        <div>医師：{element.last_doctor_name}</div>
                      ):(
                        <div>医師：{element.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                      )}
                    </>
                  ):(
                    <>
                      {this.context.selectedDoctor.code <= 0 ? (
                        <div>医師：{element.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                      ):(
                        <>
                          {this.context.selectedDoctor.code == element.last_doctor_code ? (
                            <div>医師：{element.last_doctor_name}</div>
                          ):(
                            <div>医師：{element.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {element.order_data.visit_place_id != undefined && element.order_data.visit_place_id != null && element.order_data.visit_place_id > 0 && (
                <div style={{textAlign:"left"}}>
                  <div>{this.getVisitPlaceName(element.order_data.visit_place_id)}</div>                            
                </div>
              )}
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
          <MedicineListWrapper font_props = {this.props.font_props}>
            <div className={`history-item soap-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
              {element.order_data.order_data.filter(item => {
                if (item.usage_name.includes("ＸＸ")) {
                  return false;
                }
                if (
                  parseInt(item.usage) > 0
                ) {
                  return true;
                }
                return (
                  item.usage > 0 &&
                  (item.days > 0 ||
                    (item.usage_replace_number !== undefined &&
                      item.usage_replace_number.length > 0))
                );
              }).map((item, key)=>{
                return (
                  <div className="history-item" key={key}>
                    <div className="box w70p" draggable="true">
                      <div className="flex between drug-item table-row">
                        <div className="number" style={underLine}>
                          {" Rp" + parseInt(key + 1)}
                        </div>
                        <div className="text-right">
                          <div className="table-item">
                            {item.usage_name && (
                              <>
                                <label>手技: </label>
                                <label>{item.usage_name}</label>
                              </>
                            )}
                          </div>
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
                      {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
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
                                        <p key={comment.id} style={{textAlign:'right', letterSpacing:"-1px"}}>
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
                      {item.is_precision !== undefined && item.is_precision == 1 && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            【精密持続点滴】
                          </div>
                        </div>
                      )}
                      {item.start_date !== undefined && item.start_date !== "" && (
                        <div className="flex between option table-row">
                          <div className="text-right table-item">
                            <label>処方開始日: </label>
                            <label>{formatJapanDateSlash(formatDate(item.start_date))}</label>
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
                      {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-right">
                            <div className="table-item">
                              {item.injectUsageName && (
                                <>
                                  <label>用法: </label>
                                  <label>{item.injectUsageName}</label>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="w80 table-item">
                          </div>
                        </div>
                      )}
                      {item.usageName != undefined && item.usageName != null && item.usageName != "" && (
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
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </MedicineListWrapper>
        </div>
      )
    });
    return(
      <>
        {injectionData}
      </>
    );
  }
  
  cancelDelData = () => {
    let cacheDelState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    let cacheDelHistoryState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    if (!cacheDelState)  return;
    if (!cacheDelHistoryState)  return;
    let prescription = null;
    cacheDelState = cacheDelState.filter(data => {
      if(data.number == this.state.delNumber) {
        prescription = data;
      }
      return data.number !== this.state.delNumber;
    });
    
    if(prescription == null) return;
    prescription.order_data = [];
    if (cacheDelState.length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, JSON.stringify(cacheDelState));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    }
    
    // delete PRESCRIPTION_DELETE_HISTORY
    cacheDelHistoryState = cacheDelHistoryState.filter(data => {
      return data.number !== this.state.delNumber;
    });
    
    if (cacheDelHistoryState.length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY, JSON.stringify(cacheDelHistoryState));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    }
    
    // RP Delete Update
    let stateDelRpHistory = this.state.prescriptionDelRpData;
    stateDelRpHistory = stateDelRpHistory.filter(data=>{
      return data.number !== this.state.delNumber;
    });
    
    // All Delete Update
    let stateDelAllHistory = this.state.prescriptionDelData;
    stateDelAllHistory = stateDelAllHistory.filter(data=>{
      return data.number !== this.state.delNumber;
    });
    this.setState({
      prescriptionDelRpData: stateDelRpHistory,
      prescriptionDelData: stateDelAllHistory
    });
    
    // refresh
    this.context.$setExaminationOrderFlag(1);
    
    this.props.getSoapPrescriptionDelData([prescription], "recovery");
  };
  
  cancelInjectDelData = () => {
    let cacheDelInjectState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    let cacheDelInjectHistoryState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    
    if (!cacheDelInjectState)  return;
    if (!cacheDelInjectHistoryState)  return;
    let injection = null;
    cacheDelInjectState = cacheDelInjectState.filter(data => {
      if(data.number == this.state.delNumber) {
        injection = data;
      }
      return data.number !== this.state.delNumber;
    });
    
    if(injection == null) return;
    injection.order_data = [];
    if (cacheDelInjectState.length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, JSON.stringify(cacheDelInjectState));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    }
    
    // delete INJECTION_DELETE_HISTORY
    cacheDelInjectHistoryState = cacheDelInjectHistoryState.filter(data => {
      return data.number !== this.state.delNumber;
    });
    
    if (cacheDelInjectHistoryState.length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY, JSON.stringify(cacheDelInjectHistoryState));
    }else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    }
    
    
    // RP Delete Update
    let stateDelRpHistory = this.state.injectionDelRpData;
    stateDelRpHistory = stateDelRpHistory.filter(data=>{
      return data.number !== this.state.delNumber;
    });
    
    // All Delete Update
    let stateDelAllHistory = this.state.injectionDelData;
    stateDelAllHistory = stateDelAllHistory.filter(data=>{
      return data.number !== this.state.delNumber;
    });
    this.setState({
      injectionDelRpData: stateDelRpHistory,
      injectionDelData: stateDelAllHistory
    });
    
    // refresh
    this.context.$setExaminationOrderFlag(1);
    
    this.props.getSoapInjectionDelData([injection], "recovery");
  };
  
  onDropSoapEvent = async (e) => {
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) {
      e.stopPropagation();
      return;
    }
    let soap_index = e.dataTransfer.getData("text");
    if (soap_index == "") return;
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    if (this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.props.saveConfirmMessage("", soap_index, "middlebox_do");
      return;
    }
    this.dropSoapEvent(soap_index);
  }
  
  onDropSoapElement = async (e) => {
    e.preventDefault();
  }
  
  dropSoapEvent = async (soap_info = "", other_value=null, act=null) => { //other_value ex)soapの#/S/O/A/P, act exe)act==2 追記
    if(soap_info.split(":")[1] != undefined && soap_info.split(":")[1] != ""){
      other_value = soap_info.split(":")[1];
    }
    let soap_index = soap_info.split(":")[0];
    if (soap_index == "") return;
    let soap_data = this.middle_soapList[soap_index];
    let type = "";
    let inspection_shema = null;
    if (soap_data.target_table == "inspection_order" &&
      soap_data.data != undefined &&
      soap_data.data != null &&
      soap_data.data.image_path != undefined &&
      soap_data.data.image_path != null &&
      soap_data.data.image_path != "") {
      const { data } = await axios.post("/app/api/v2/order/inspection/getImage", {
        params: {
          number: soap_data.target_number
        }
      });
      inspection_shema = data;
    }
    let radiation_shema = null;
    if (soap_data.target_table == "order" &&
      soap_data.data != undefined &&
      soap_data.data != null &&
      soap_data.category =='放射線' &&
      soap_data.data.order_data.order_data.image_path != undefined &&
      soap_data.data.order_data.order_data.image_path != null &&
      soap_data.data.order_data.order_data.image_path != "") {
      const { data } = await axios.post("/app/api/v2/order/radiation/getImage", {
        params: {
          number: soap_data.target_number
        }
      });
      radiation_shema = data;
    }
    let examination_shema = null;
    if (soap_data.target_table == "order" &&
      soap_data.data != undefined &&
      soap_data.data != null &&
      soap_data.sub_category =='細胞診検査' &&
      soap_data.data.order_data.order_data.image_path != undefined &&
      soap_data.data.order_data.order_data.image_path != null &&
      soap_data.data.order_data.order_data.image_path != "") {
      const { data } = await axios.post("/app/api/v2/order/examination/getImage", {
        params: {
          number: soap_data.target_number
        }
      });
      examination_shema = data;
    }
    if(soap_data.target_table == "soap" && this.state.confirm_value != soap_index){
      let soap_edit_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT);
      if(soap_edit_data != undefined && soap_edit_data != null && soap_edit_data.data != undefined){
        if(other_value == null && (soap_edit_data.data.s_text != "" || soap_edit_data.data.sharp_text != "" || soap_edit_data.data.o_text != "" || soap_edit_data.data.a_text != ""
          || soap_edit_data.data.p_text != ""))
        {
          this.setState({
            confirm_type: "soap_destruction",
            confirm_alert_title:'記入あり確認',
            confirm_message:"記入中の内容があります。破棄して展開しますか？",
            confirm_value:soap_index,
          });
          return;
        }
        if(other_value != null && soap_edit_data.data[other_value] != null && soap_edit_data.data[other_value] !== ""){
          let soap_title = "";
          let SoapCategory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY);
          SoapCategory = (SoapCategory != undefined && SoapCategory != null) ? SoapCategory : "soap";
          switch (other_value){
            case "s_text":
              soap_title = SoapCategory == "soap" ? "(S)" : "主訴";
              break;
            case "sharp_text":
              soap_title = SoapCategory == "soap" ? "#" : "現病歴";
              break;
            case "o_text":
              soap_title = SoapCategory == "soap" ? "(O)" : "所見";
              break;
            case "a_text":
              soap_title = SoapCategory == "soap" ? "(A)" : "アセスメント";
              break;
            case "p_text":
              soap_title = SoapCategory == "soap" ? "(P)" : "プラン";
              break;
          }
          this.setState({
            confirm_type: "soap_destruction",
            confirm_alert_title:'記入あり確認',
            confirm_message:soap_title+"は既に記入されています。反映方法を選択してください。",
            confirm_value:soap_index,
            confirm_value2:other_value,
          });
          return;
        }
      }
    }
    switch(soap_data.target_table){
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      case "soap":
        type = CACHE_LOCALNAMES.SOAP_EDIT;
        break;
      case "inspection_order":
        type = CACHE_LOCALNAMES.INSPECTION_EDIT;
        if (inspection_shema != null) soap_data.data.order_data.order_data.imgBase64 = inspection_shema;
        break;
      case "treat_order_header":
        type = CACHE_LOCALNAMES.TREATMENT_EDIT;
        break;
      case "hospital_description":
        type = CACHE_LOCALNAMES.ALLERGY_EDIT;
        break;
      case "order":
        if(soap_data.category ==='放射線'){
          if (radiation_shema != null) soap_data.data.order_data.order_data.imgBase64 = radiation_shema;
          type = CACHE_LOCALNAMES.RADIATION_EDIT;
        }
        if(soap_data.category ==='リハビリ'){
          type = CACHE_LOCALNAMES.RIHABILY_EDIT;
        }
        if(soap_data.category ==='汎用オーダー' || soap_data.category ==='管理・指導'){
          type = soap_data.sub_category === '服薬指導' ? CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT : CACHE_LOCALNAMES.GUIDANCE_EDIT;
        }
        if(soap_data.category === '検査'){
          if(soap_data.sub_category === 'オーダー'){
            type = CACHE_LOCALNAMES.EXAM_EDIT;
            if(soap_data.sub_category === '細胞診検査' && examination_shema != null){
              soap_data.data.order_data.order_data.imgBase64 = examination_shema;
            }
          }
          if(soap_data.sub_category === '細胞診検査'){
            type = CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT;
            if(examination_shema != null){
              soap_data.data.order_data.order_data.imgBase64 = examination_shema;
            }
          }
          if(soap_data.sub_category === '病理検査'){
            type = CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT;
          }
          if(soap_data.sub_category === '細菌検査'){
            type = CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT;
          }
        }
        if (soap_data.category === '処方') {
          window.localStorage.setItem("soap_insert_drop_number", soap_data["data"]["number"]);
          this.props.goToDropPage(`/patients/${this.props.patientId}/prescription`);
          type = CACHE_LOCALNAMES.PRESCRIPTION_EDIT;
        }
        if (soap_data.category === '注射') {
          window.localStorage.setItem("soap_insert_drop_number", soap_data["data"]["number"]);
          this.props.goToDropPage(`/patients/${this.props.patientId}/injection`);
          type = CACHE_LOCALNAMES.PRESCRIPTION_EDIT;
        }
        break;
    }
    this.setCacheSoapData(type, soap_data, other_value, act);
  }
  
  setCacheSoapData = (type = "", soap_data, other_value=null, act=null) => { //other_value ex)soapの#/S/O/A/P, act exe)act==2 追記
    if (type == "") return;
    let karte_status_code = this.getKarteStatusCodeForCache();
    let order_data = soap_data["data"];
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    if (type === CACHE_LOCALNAMES.INSPECTION_EDIT) {
      let new_order_data = order_data['order_data']['order_data'];
      new_order_data['state'] = 0;
      new_order_data['isForUpdate'] = 0;
      new_order_data['number'] = 0;
      new_order_data['karte_status'] = karte_status_code;
      new_order_data['order_id'] = 0;
      new_order_data['inspection_DATETIME'] = formatDateLine(new Date());
      new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      if(new_order_data['reserve_time'] !== undefined){delete new_order_data['reserve_time'];}
      if(new_order_data['reserve_data'] !== undefined){delete new_order_data['reserve_data'];}
      if(new_order_data['multi_reserve_flag'] !== undefined){delete new_order_data['multi_reserve_flag'];}
      if(new_order_data['done_numbers'] !== undefined){delete new_order_data['done_numbers'];}
      if(new_order_data.start_date !== undefined){delete new_order_data.start_date;}
      if(new_order_data.continue_date !== undefined){delete new_order_data.continue_date;}
      if(new_order_data.end_date !== undefined){delete new_order_data.end_date;}
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
    }
    if(type === CACHE_LOCALNAMES.TREATMENT_EDIT){
      let new_order_data = {...order_data['order_data']['order_data']};
      new_order_data['header']['state'] = 0;
      new_order_data['header']['isForUpdate'] = 0;
      new_order_data['header']['number'] = 0;
      new_order_data['header']['date'] = formatDateLine(new Date());
      new_order_data['header']['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['header']['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['header']['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      // ●YJ110 SOAPの中央カラムからDoしたときに、新規発行する入外区分は現在の区分に合わせるように      
      new_order_data['karte_status'] = karte_status_code;
      new_order_data['general_id'] = karte_status_code;
      let cache_karte_status_code = null;
      cache_karte_status_code = order_data.karte_status;
      // ・在宅処置を他の区分で出した場合は、「在宅」部分の追加品名は無視
      if (cache_karte_status_code == 2 && karte_status_code != 2 && new_order_data['item_details'] != undefined && new_order_data['item_details'] != null) {
        delete new_order_data['item_details'];
      }
      // YJ1069 SOAP画面のDoで、外来患者に放射線など尾のオーダーを入院で発行できてしまう
      if (this.context.karte_status.code != 1 && new_order_data['header']['isPeriodTreatment'] != undefined) {
        delete new_order_data['header']['isPeriodTreatment'];
      }
      new_order_data.detail.map((detail, detail_index)=>{
        if (this.context.karte_status.code != 1 && detail.administrate_period != undefined ) {
          delete detail.administrate_period;
        }
        if(detail.treat_done_info !== undefined){
          delete new_order_data.detail[detail_index]['treat_done_info'];
        }
        if(detail.done_comment !== undefined){
          delete new_order_data.detail[detail_index]['done_comment'];
        }
      });
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
    }
    if(type === CACHE_LOCALNAMES.ALLERGY_EDIT){
      let new_order_data = order_data['order_data']['order_data'];
      new_order_data['number'] = 0;
      new_order_data['karte_status'] = karte_status_code;
      new_order_data['isForUpdate'] = 0;
      new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
    }
    if(type === CACHE_LOCALNAMES.RADIATION_EDIT){
      let new_order_data = order_data['order_data']['order_data'];
      new_order_data['number'] = 0;
      new_order_data['karte_status'] = karte_status_code;
      new_order_data['done_order'] = 0;
      new_order_data['isForUpdate'] = 0;
      new_order_data['treat_date'] = formatDateLine(new Date());
      if(new_order_data['reserve_time'] !== undefined){
        delete new_order_data['reserve_time'];
        if(new_order_data['reserve_data'] !== undefined){
          delete new_order_data['reserve_data'];
        }
      }
      new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
    }
    if(type === CACHE_LOCALNAMES.RIHABILY_EDIT){
      let new_order_data = order_data['order_data']['order_data'];
      new_order_data['number'] = 0;
      new_order_data['karte_status'] = karte_status_code;
      new_order_data['done_order'] = 0;
      new_order_data['isForUpdate'] = 0;
      new_order_data['treat_date'] = formatDateLine(new Date());
      new_order_data['prescription_date'] = formatDateLine(new Date());
      new_order_data['request_date'] = formatDateLine(new Date());
      new_order_data['request_doctor_number'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['request_doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['prescription_doctor_number'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['prescription_doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
    }
    if(type === CACHE_LOCALNAMES.GUIDANCE_EDIT){
      let new_order_data = order_data['order_data']['order_data'];
      new_order_data['number'] = 0;
      new_order_data['karte_status'] = karte_status_code;
      new_order_data['done_order'] = 0;
      new_order_data['isForUpdate'] = 0;
      new_order_data['treat_date'] = formatDateLine(new Date());
      new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
    }
    if(type === CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT){
      let new_order_data = order_data['order_data']['order_data'];
      new_order_data['number'] = 0;
      new_order_data['done_order'] = 0;
      new_order_data['isForUpdate'] = 0;
      new_order_data['treat_date'] = formatDateLine(new Date());
      new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
    }
    if(type === CACHE_LOCALNAMES.EXAM_EDIT || type === CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT || type === CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT || type === CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT){
      let new_order_data = order_data['order_data']['order_data'];
      new_order_data['number'] = 0;
      new_order_data['karte_status'] = karte_status_code;
      new_order_data['done_order'] = 0;
      new_order_data['is_done'] = 0;
      new_order_data['is_completed'] = 0;
      new_order_data['isForUpdate'] = 0;
      new_order_data['collected_date'] = formatDateLine(new Date());
      new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      new_order_data['department_code'] = this.context.department.code == 0 ? 1 : this.context.department.code;
      karteApi.setVal(this.props.patientId, type, JSON.stringify(new_order_data), 'insert');
    }
    if(type === CACHE_LOCALNAMES.SOAP_EDIT){
      let presData = {};
      if(other_value == null){
        let new_soap_data = {};
        new_soap_data['data'] = order_data;
        new_soap_data['user_number'] = this.authInfo.user_number;
        new_soap_data['system_patient_id'] = this.props.patientId;
        new_soap_data['isForUpdate'] = false;
        new_soap_data['isForSave'] = true;
        new_soap_data['data']['soap_start_at'] = formatDate4API(new Date());
        let sub_category = soap_data.sub_category != undefined && soap_data.sub_category != null && soap_data.sub_category != '' ? soap_data.sub_category : "プログレスノート";
        if(sub_category != 'プログレスノート') {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("hospital_note"));
        } else {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("soap"));
        }
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, JSON.stringify(new_soap_data), 'insert');
        presData = {
          soap_start_at: new_soap_data['data']['soap_start_at'],
          sharp_text: order_data['sharp_text'],
          s_text: order_data['s_text'],
          o_text: order_data['o_text'],
          a_text: order_data['a_text'],
          p_text: order_data['p_text'],
          updateDate: '',
          created_at: '',
          importance: 1,
        };
        this.props.refreshMiddleBox();
      } else {
        presData = this.state.presData;
        if(act == null){
          presData[other_value] = order_data[other_value];
        } else {
          presData[other_value] = presData[other_value] + order_data[other_value];
        }
        let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
        let presDataStr = JSON.stringify({
          user_number: userInfo.user_number,
          system_patient_id: this.props.patientId,
          data: presData,
          isForUpdate: this.props.isForUpdate,
          updateIndex: this.props.updateIndex,
          isForSave: true
        });
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
      }
      this.setState({
        rightboxRefresh: !this.state.rightboxRefresh,
        presData,
        confirm_value:null,
        confirm_value2:null,
      });
    } else {
      this.setState({
        rightboxRefresh: !this.state.rightboxRefresh,
      });
    }
  };
  
  onDragOver = e => {
    e.preventDefault();
  };
  
  doubleClickEdit = (type, key) => {
    if (type === "prescription" || type === "injection") {
      // set active serial key
      if (type == "prescription") {
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription", key);
      } else {
        karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "injection", key);
      }
      this.props.goToDropPage(`/patients/${this.props.patientId}/${type}`);
    } else {
      this.props.showModal("edit_modal", type, key);
    }
  }
  
  handleClose = () => {
    this.setState({
      changeDepartmentModal: false,
      changeKarteStatusModal: false,
      registerSetModal: false,
      registerPatientSetModal: false,
    });
  }
  
  handleChangeDeparment = (code) => {
    let cache_data = karteApi.getVal(this.props.patientId, this.state.content_key);
    let name = "";
    this.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
    switch (this.state.content_key){
      case CACHE_LOCALNAMES.INSPECTION_EDIT:
        cache_data[this.state.content_subkey].department_id = code;
        break;
      case CACHE_LOCALNAMES.TREATMENT_EDIT:
        cache_data[this.state.content_subkey].header.department_id = code;
        break;
      case CACHE_LOCALNAMES.RADIATION_EDIT:
        cache_data[this.state.content_subkey].department_id = code;
        cache_data[this.state.content_subkey].department_code = code;
        break;
      case CACHE_LOCALNAMES.RIHABILY_EDIT:
        cache_data[this.state.content_subkey].department_id = code;
        break;
      case CACHE_LOCALNAMES.GUIDANCE_EDIT:
        cache_data[this.state.content_subkey].department_id = code;
        cache_data[this.state.content_subkey].department_code = code;
        break;
      case CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT:
        cache_data[this.state.content_subkey].department_id = code;
        cache_data[this.state.content_subkey].department_code = code;
        break;
      case CACHE_LOCALNAMES.MEAL_EDIT:
        cache_data[this.state.content_subkey].department_id = code;
        cache_data[this.state.content_subkey].department_code = code;
        break;
      case CACHE_LOCALNAMES.MEAL_GROUP_EDIT:
        cache_data[this.state.content_subkey].department_id = code;
        cache_data[this.state.content_subkey].department_code = code;
        break;
      case CACHE_LOCALNAMES.ALLERGY_EDIT:
        cache_data[this.state.content_subkey].department_id = code;
        break;
      case CACHE_LOCALNAMES.PRESCRIPTION_EDIT:
        cache_data[this.state.content_subkey][0].department_code = code;
        cache_data[this.state.content_subkey][0].department = name;
        break;
      case CACHE_LOCALNAMES.INJECTION_EDIT:
        cache_data[this.state.content_subkey][0].department_code = code;
        cache_data[this.state.content_subkey][0].department = name;
        break;
      case CACHE_LOCALNAMES.EXAM_EDIT:
      case CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT:
      case CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT:
      case CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT:
        cache_data.department_code = code;
        break;
      case CACHE_LOCALNAMES.SOAP_EDIT:
        cache_data.department_code = code;
        cache_data.department_name = name;
        break;
    }
    karteApi.setVal(this.props.patientId, this.state.content_key, JSON.stringify(cache_data));
    
    this.setState({
      changeDepartmentModal:false,
      newDepartmentCode: code
    });
  };
  
  handleChangeKarteStatus = (code) => {
    let cache_data = karteApi.getVal(this.props.patientId, this.state.content_key);
    switch (this.state.content_key){
      case CACHE_LOCALNAMES.INSPECTION_EDIT:
        cache_data[this.state.content_subkey].karte_status = code;
        break;
      case CACHE_LOCALNAMES.TREATMENT_EDIT:
        cache_data[this.state.content_subkey].karte_status = code;
        break;
      case CACHE_LOCALNAMES.RADIATION_EDIT:
        cache_data[this.state.content_subkey].karte_status = code;
        break;
      case CACHE_LOCALNAMES.RIHABILY_EDIT:
        cache_data[this.state.content_subkey].karte_status = code;
        break;
      case CACHE_LOCALNAMES.GUIDANCE_EDIT:
        cache_data[this.state.content_subkey].karte_status = code;
        break;
      case CACHE_LOCALNAMES.PRESCRIPTION_EDIT:
        cache_data[this.state.content_subkey][0].karte_status_code = code == 1 ? 0 : code == 3 ? 1 : 2;
        cache_data[this.state.content_subkey][0].karte_status_name = code == 1 ? "外来" : code == 3 ? "入院" : "在宅";
        break;
      case CACHE_LOCALNAMES.INJECTION_EDIT:
        cache_data[this.state.content_subkey][0].karte_status_code = code == 1 ? 0 : code == 3 ? 1 : 2;
        cache_data[this.state.content_subkey][0].karte_status_name = code == 1 ? "外来" : code == 3 ? "入院" : "在宅";
        break;
      case CACHE_LOCALNAMES.EXAM_EDIT:
      case CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT:
      case CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT:
      case CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT:
        cache_data.karte_status = code;
        break;
      case CACHE_LOCALNAMES.SOAP_EDIT:
        cache_data.karte_status = code;
        break;
    }
    karteApi.setVal(this.props.patientId, this.state.content_key, JSON.stringify(cache_data));
    
    this.setState({
      changeKarteStatusModal:false,
      newKarteStatusCode: code
    });
  };
  
  setAllKarteData=(soapList)=>{
    this.middle_soapList = JSON.parse(JSON.stringify(soapList));
  }
  
  handleRegisterSet = (strName) => {
    this.m_cacheSerialNumber = this.state.content_subkey;
    this.registerNewSet(strName, 'soap', this.state.preset_do_count);
    this.setState({
      registerSetModal:false,
    });
  }
  
  handleRegisterPatientSet = (strName) => {
    this.m_cacheSerialNumber = this.state.content_subkey;
    this.registerNewSet(strName, "soap_patient");
    this.setState({
      registerPatientSetModal:false,
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
  
  // 確認モーダル・SOAPで、一般名処方オプションが薬剤とRP末尾の2か所表示される
  getCheckSameOptions = (ele_order) => {
    if (ele_order == null ||
      ele_order == undefined ||
      ele_order.medicines == undefined ||
      ele_order.medicines == null ||
      ele_order.medicines.length < 1) {
      return;
    }
    let med = ele_order.medicines[0];
    let keys = Object.keys(med);
    let equalKeys = [];
    const allEqual = arr => arr.every(v => v === arr[0]);
    keys.map(key => {
      let value = [];
      ele_order.medicines.map(medi => {
        value.push(medi[key]);
      });
      if (allEqual(value)) {
        equalKeys.push(key);
      }
    });
    return equalKeys;
  };
  
  getCheckSameOptionsMiddle = (ele_order) => {
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
  
  // 確認モーダル・SOAPで、一般名処方オプションが薬剤とRP末尾の2か所表示される
  getSameOptions = (ele_order, aa) => {
    let values = [];
    if (aa !== undefined) {
      aa.map(key => {
        let value = {};
        
        value[key] = ele_order.medicines[0][key];
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
  
  getSameOptionsMiddle = (ele_order, aa) => {
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
  
  changeBtnColor=(color)=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let set_font_color_obj = document.getElementsByClassName("set-font-color")[0];
    if(set_font_color_obj !== undefined && set_font_color_obj != null){
      set_font_color_obj.style['border-color'] = color;
      this.soap_font_color = color;
    }
  }
  
  setContentEditData=()=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let SoapCategory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY);
    let presData = this.state.presData;
    let content_editable_obj = document.getElementsByClassName("content_editable_area");
    if(SoapCategory != undefined && SoapCategory != null && SoapCategory == "hospital_note"){
      if(content_editable_obj[0] !== undefined && content_editable_obj[0] != null){
        presData['s_text'] = content_editable_obj[0].innerHTML; //主訴
      }
      if(content_editable_obj[1] !== undefined && content_editable_obj[1] != null){
        presData['sharp_text'] = content_editable_obj[1].innerHTML; //現病歴
      }
      if(content_editable_obj[2] !== undefined && content_editable_obj[2] != null){
        presData['o_text'] = content_editable_obj[2].innerHTML; //所見
      }
      if(content_editable_obj[3] !== undefined && content_editable_obj[3] != null){
        presData['a_text'] = content_editable_obj[3].innerHTML; //アセスメント
      }
      if(content_editable_obj[4] !== undefined && content_editable_obj[4] != null){
        presData['p_text'] = content_editable_obj[4].innerHTML; //プラン
      }
    } else {
      if(content_editable_obj[0] !== undefined && content_editable_obj[0] != null){
        presData['sharp_text'] = content_editable_obj[0].innerHTML; //#
      }
      if(content_editable_obj[1] !== undefined && content_editable_obj[1] != null){
        presData['s_text'] = content_editable_obj[1].innerHTML; //(S)
      }
      if(content_editable_obj[2] !== undefined && content_editable_obj[2] != null){
        presData['o_text'] = content_editable_obj[2].innerHTML; //(O)
      }
      if(content_editable_obj[3] !== undefined && content_editable_obj[3] != null){
        presData['a_text'] = content_editable_obj[3].innerHTML; //(A)
      }
      if(content_editable_obj[4] !== undefined && content_editable_obj[4] != null){
        presData['p_text'] = content_editable_obj[4].innerHTML; //(P)
      }
    }
    let isForSave = true;
    if(presData.sharp_text === "" && presData.s_text === "" && presData.o_text === "" && presData.a_text === "" && presData.p_text === ""){
      isForSave = false;
    }
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let presDataStr = JSON.stringify({
      user_number: userInfo.user_number,
      system_patient_id: this.props.patientId,
      data: presData,
      isForUpdate: this.props.isForUpdate,
      updateIndex: this.props.updateIndex,
      isForSave: isForSave
    });
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
    this.setState({presData});
  }
  
  testDeleteRender = () => {
    // prescription delete
    const cacheDelState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    
    // injection delete
    const cacheDelInjectState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    
    let deletedRpHistory = [];
    let deletedHistory = [];
    let deletedInjectHistory = [];
    let deletedInjectRpHistory = [];
    let tmpStopInjection = [];
    let tmpStopPrescription = [];
    
    // Prescription
    let delete_medicineHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    if (cacheDelState !== undefined && cacheDelState !== null && cacheDelState.length > 0 && delete_medicineHistory!== undefined && delete_medicineHistory != null && delete_medicineHistory.length > 0) {
      cacheDelState.map(delData => {
        delete_medicineHistory.map(med => {
          let medicine = { ...med };
          if (medicine.number == delData.number) {
            if (delData.order_data !== undefined) {
              let order_data = [];
              let deleted_order = [];
              medicine.order_data.order_data.map(med_order_data => {
                let deleted = false;
                delData.order_data.map(item => {
                  if (item.order_number === med_order_data.order_number) {
                    deleted = true;
                    deleted_order.push(med_order_data);
                  }
                });
                if (deleted === false) {
                  order_data.push(med_order_data);
                }
              });
              
              if (order_data.length > 0) {
                medicine.is_enabled = 4; // RP delete
                medicine.order_data.order_data = deleted_order;
              } else {
                medicine.is_enabled = 3; // all delete
              }
            }
          }
          // 中止
          if (medicine.number == delData.number && medicine.stop_order !== undefined && medicine.stop_order !== null && medicine.stop_order === 1) {
            medicine.openTag = 1;
            tmpStopPrescription.push(medicine);
          } else {
            // 削除
            if (medicine.is_enabled == 3) {
              medicine.openTag = 1;
              deletedHistory.push(medicine);
            }else if(medicine.is_enabled == 4){
              medicine.openTag = 1;
              deletedRpHistory.push(medicine);
            }
          }
        });
      });
    }
    
    // Inject
    let delete_injectionHistory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    if (cacheDelInjectState !== undefined && cacheDelInjectState !== null && cacheDelInjectState.length > 0 && delete_injectionHistory !== undefined && delete_injectionHistory != null && delete_injectionHistory.length > 0) {
      cacheDelInjectState.map(delData => {
        delete_injectionHistory.map(med => {
          let medicine = { ...med };
          if (medicine.number == delData.number) {
            if (delData.order_data !== undefined) {
              let order_data = [];
              let deleted_order = [];
              medicine.order_data.order_data.map(med_order_data => {
                let deleted = false;
                delData.order_data.map(item => {
                  if (item.order_number === med_order_data.order_number) {
                    deleted = true;
                    deleted_order.push(med_order_data);
                  }
                });
                if (deleted === false) {
                  order_data.push(med_order_data);
                }
              });
              
              if (order_data.length > 0) {
                medicine.is_enabled = 4; // RP delete
                medicine.order_data.order_data = deleted_order;
              } else {
                medicine.is_enabled = 3; // all delete
              }
            }
          }
          // 中止
          if (medicine.number == delData.number && medicine.stop_order !== undefined && medicine.stop_order !== null && medicine.stop_order === 1) {
            medicine.openTag = 1;
            tmpStopInjection.push(medicine);
          } else {
            // 削除
            if (medicine.is_enabled == 3) {
              medicine.openTag = 1;
              deletedInjectHistory.push(medicine);
            }else if(medicine.is_enabled == 4){
              medicine.openTag = 1;
              deletedInjectRpHistory.push(medicine);
            }
          }
        });
      });
    }
    
    this.setState({
      prescriptionDelData: deletedHistory,
      prescriptionDelRpData: deletedRpHistory,
      injectionDelData: deletedInjectHistory,
      injectionDelRpData: deletedInjectRpHistory,
      stopInjection: tmpStopInjection,
      stopPrescription: tmpStopPrescription,
    });
  }
  
  rightboxRefresh=()=>{
    this.setState({rightboxRefresh: !this.state.rightboxRefresh});
  }
  
  // open shema(内視鏡)
  openInspectionImageModal = (data) => {
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }
  
  openInspectionImageModalFromNumber = async (number, type=null) => {
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
  
  cancelAlertModal = () => {
    this.setState({alertMessage: ""});
  }
  
  getKarteStatusName = (_modalData) => {
    let result = "外来";
    if(_modalData == undefined || _modalData == null) return result;
    if (_modalData.karte_status == undefined || _modalData.karte_status == null){
      if (_modalData.data != undefined &&
        _modalData.data.karte_status > 0) {
        result = _modalData.data.karte_status == 1 ? "外来" : _modalData.data.karte_status == 3 ? "入院" : "在宅";
      }
    } else {
      result = _modalData.karte_status == 1 ? "外来" : _modalData.karte_status == 3 ? "入院" : "在宅";
    }
    
    return result;
  }
  
  getPrescriptionType = (_modalData) => {
    let result = "";
    if(_modalData == undefined || _modalData == null) return result;
    
    let karte_status = 1;
    let internal_prescription = 0;
    if (_modalData.karte_status != undefined && _modalData.karte_status != null && _modalData.karte_status > 0) {
      karte_status = _modalData.karte_status;
    } else if(_modalData.data != undefined && _modalData.data.order_data != undefined && _modalData.data.order_data.karte_status != undefined && _modalData.data.order_data.karte_status > 0) {
      karte_status = _modalData.data.order_data.karte_status;
    }
    
    if(_modalData.data != undefined && _modalData.data.order_data != undefined && _modalData.data.order_data.is_internal_prescription != undefined) {
      internal_prescription = _modalData.data.order_data.is_internal_prescription;
    }
    
    if (karte_status == 3) {
      result = HOSPITALIZE_PRESCRIPTION_TYPE[internal_prescription].value;
    } else {
      result = internal_prescription == 0?"院外" : "院内";
    }
    
    return result;
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
    _prescriptionData.presData.map((rp_item, rp_index)=>{      
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
      if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {
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

      if (rp_item.medicines.length > 0 && rp_item.medicines[0].medicineName != "") {
        rp_item.medicines.map((med_item, med_index)=>{
          if(med_item.medicineName != "") {
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
              clipboard_text += med_item.medicineName + this.getOneSpaces(3) + med_item.amount + med_item.unit + "\n";
            } else {
              clipboard_text += this.getOneSpaces(2) + med_item.medicineName + this.getOneSpaces(3) + med_item.amount + med_item.unit + "\n";
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
          }

        });
        // 用法
        if (rp_item.usageName != undefined && rp_item.usageName != undefined != "") {        
          clipboard_text += this.getOneSpaces(2) + "用法：" + rp_item.usageName;
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
      }
      
    });

    // 備考のオプション
    if (_prescriptionData != null && _prescriptionData.med_consult != null && _prescriptionData.med_consult !== undefined && _prescriptionData.med_consult == 1) {      
      clipboard_text += "【お薬相談希望あり】" + "\n";
    }
    if (_prescriptionData != null && _prescriptionData.supply_med_info != null && _prescriptionData.supply_med_info !== undefined && _prescriptionData.supply_med_info == 1) {      
      clipboard_text += "【薬剤情報提供あり】" + "\n";
    }

    // 持参薬種別
    if (_prescriptionData != null && _prescriptionData.potion != null && _prescriptionData.potion !== undefined && (_prescriptionData.potion == 0 || _prescriptionData.potion == 1) && _prescriptionData.is_internal_prescription == 5) {
      clipboard_text += _prescriptionData.potion == 0 ? "持参薬（自院）" : "持参薬（他院）";
      clipboard_text += "\n";
    }

    // 該当のチェックボックス
    if (_prescriptionData != null && _prescriptionData.hospital_opportunity_disease != null && _prescriptionData.hospital_opportunity_disease !== undefined && _prescriptionData.hospital_opportunity_disease == 1) {
      clipboard_text += "入院契機傷病の治療に係るもの" + "\n";
    }

    // 向精神薬多剤投与理由
    if (_prescriptionData != null && _prescriptionData.psychotropic_drugs_much_reason != null && _prescriptionData.psychotropic_drugs_much_reason !== undefined && _prescriptionData.psychotropic_drugs_much_reason !== "") {      
      clipboard_text += "●向精神薬多剤投与理由：" + _prescriptionData.psychotropic_drugs_much_reason + "\n";
    }

    // 湿布薬超過投与理由
    if (_prescriptionData != null && _prescriptionData.poultice_many_reason != null && _prescriptionData.poultice_many_reason !== undefined && _prescriptionData.poultice_many_reason !== "") {      
      clipboard_text += "●湿布薬超過投与理由：" + _prescriptionData.poultice_many_reason + "\n";
    }

    // 備考
    if (_prescriptionData != null && _prescriptionData.free_comment != null && _prescriptionData.free_comment !== undefined && _prescriptionData.free_comment.length > 0 &&  _prescriptionData.free_comment[0] != null) {
      clipboard_text += "●備考：" + _prescriptionData.free_comment[0] + "\n";
    }

    if (window.clipboardData) {
      window.clipboardData.setData ("Text", clipboard_text);
    }
  }

  handleClipboardPaste = (soap_kind) => {
    // get clipboard content
    let clipboard_data = "";
    if (window.clipboardData) {      
      clipboard_data = window.clipboardData.getData("Text");
    }
    
    if (clipboard_data == "") return;
      

    // let el = document.getElementById("sharp_text_id");
    // let caret_position = this.getCaretCharacterOffsetWithin(el);
    // console.log("caret_position getCaretCharacterOffsetWithin :", caret_position);
    // caret_position = this.getCaretPosition();
    // console.log("caret_position getCaretPosition :", caret_position);
    
    let soap_key = '';
    switch(soap_kind){
      case 'S':
        soap_key = 's_text';
        break;
      case 'O':
        soap_key = 'o_text';
        break;
      case 'A':
        soap_key = 'a_text';
        break;
      case 'P':
        soap_key = 'p_text';
        break;
      case 'sharp_text':
        soap_key = 'sharp_text';
        break;
      default:
        soap_key = 's_text';
        break;
    }

    let presData = this.state.presData;
    let temp = presData[soap_key];
    temp += this.convertBR(clipboard_data);
    presData[soap_key] = temp;
    this.setState({presData});
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let presDataStr = JSON.stringify({
      user_number: userInfo.user_number,
      system_patient_id: this.props.patientId,
      data: presData,
      isForUpdate: this.props.isForUpdate,
      updateIndex: this.props.updateIndex,
      isForSave: true
    });
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
  }

  convertBR = (clipboard_data) => {
    clipboard_data = clipboard_data.split(" ").join("<span>&nbsp;</span>");
    let clipboard_data_arr = clipboard_data.split("\n");
    let result = "";
    if (clipboard_data_arr.length > 0) {
      clipboard_data_arr.map((ele, idx)=>{
        if (idx != clipboard_data_arr.length - 1) {
          result += ele + "<br>";
        } else {
          result += ele;
        }
      });
    }
    return result;
  }

  /*getCaretPosition = () => {
    console.log("getCaretPosition ---------");
    if (window.getSelection && window.getSelection().getRangeAt) {
      var range = window.getSelection().getRangeAt(0);
      var selectedObj = window.getSelection();
      var rangeCount = 0;
      var childNodes = selectedObj.anchorNode.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == selectedObj.anchorNode) {
          break;
        }
        if (childNodes[i].outerHTML)
          rangeCount += childNodes[i].outerHTML.length;
        else if (childNodes[i].nodeType == 3) {
          rangeCount += childNodes[i].textContent.length;
        }
      }
      console.log("range.startOffset + rangeCount", range.startOffset + rangeCount);
      return range.startOffset + rangeCount;
    }
    return -1;
  }
  
  getCaretCharacterOffsetWithin = (element) => {
    console.log("getCaretCharacterOffsetWithin ---------");
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    console.log("caretOffset", caretOffset);
    return caretOffset;
  }*/
  
  closeRightClickMenu=()=>{
    if(this.state.contextMenu_hospital.visible || this.state.contextMenu.visible || this.state.contextMenu_soap.visible || this.state.hoverMenu.visible
      || this.state.hoverSoapMenu.visible){
      this.setState({
        contextMenu_hospital:{visible: false},
        contextMenu:{visible:false},
        contextMenu_soap:{visible:false},
        hoverMenu:{visible:false},
        hoverSoapMenu:{visible:false},
      });
    }
  }
  
  getKarteStatusCodeForCache = () => {
    let karte_status_code = 1;
    if(this.context.karte_status.code == 1){
      karte_status_code = 3;
    }
    if(this.context.karte_status.code == 2){
      karte_status_code = 2;
    }
    return  karte_status_code;
  }

  render() {
    if(this.props.isForUpdate && this.state.updateFlag){
      this.setState({
        presData:this.props.presData,
        updateFlag : false
      });
    }
    //insert data
    const InsertPart = this.getInsertEditArea();
    //prescription delete data
    const DeletePart = this.getDeleteArea();
    //prescription delete Rp data
    const DeleteRpPart = this.getDeleteRpArea();
    //injection delete data
    const DeleteInjectionPart = this.getDeleteInjectionArea();
    //injection delete Rp data
    const DeleteInjectionRpPart = this.getDeleteInjectionRpArea();
    //処方: 実施
    const DonePrescriptionPart = this.getDonePrescriptionPart();
    //注射: 実施
    const DoneInjectionPart = this.getDoneInjectionPart();
    //検体検査: 実施
    const DoneExamOrderPart = this.getDoneExamOrderPart();
    //処方: 中止
    const StopPrescriptionPart = this.getStopPrescriptionArea();
    //注射: 中止
    const StopInjectionPart = this.getStopInjectionArea();
    let soap_edit_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT);
    let color_styles = reactCSS({
      'default': {
        popover: {
          position: 'absolute',
          zIndex: '2',
          top:'35px',
          display: 'none',
          left: '-3.8rem',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    let soap_sort_data = null;
    if(sort_data !== undefined && sort_data != null && sort_data[0] !== undefined){
      soap_sort_data = sort_data[0];
    }
    let department_name = this.context.department.name;
    if (department_name === "") department_name = "内科";
    let SoapCategory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY);
    let minus_width = (SoapCategory !== undefined && SoapCategory != null && SoapCategory === "hospital_note") ? 99 : 54;
    //プログレスノート width
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let panelWrapper = document.getElementsByClassName("panelWrapper")[2];
    if(panelWrapper !== undefined && panelWrapper != null){
      let panelWrapper_width = $(panelWrapper).width();
      let content_editable_obj = document.getElementsByClassName("content_editable_area");
      for(let index=0; index < content_editable_obj.length; index++){
        if(content_editable_obj[index] !== undefined && content_editable_obj[index] != null){
          content_editable_obj[index]['style']['width'] = (panelWrapper_width - minus_width - 17)+"px";
        }
      }
    }
    let karte_mode = this.context.$getKarteMode(this.props.patientId);

    // ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
    // get 施設 info
    let visit_place_id = 0;
    let visit_place_name = "";  
    let cur_karte_status_code = this.context.karte_status.code;
    if (this.patientInfo != undefined && this.patientInfo != null && this.patientInfo.visit_info != undefined && this.patientInfo.visit_info != null) {      
      if (this.patientInfo.visit_info.visit_place_id != undefined && this.patientInfo.visit_info.visit_place_id != null && this.patientInfo.visit_info.visit_place_id > 0 && cur_karte_status_code == 2) {
        visit_place_id = this.patientInfo.visit_info.visit_place_id;
        visit_place_name = this.patientInfo.visit_info.place_name;
      }
    }

    return (
      <Wrapper font_props={this.props.font_props} onDrop={e => this.onDropSoapEvent(e)} onDragOver={e => this.onDragOver(e)}>
        <div id="insert_part" style={{backgroundColor: surface, width:"100%", height:"100%"}} className={'insert_part'}>
          <div className={`flex noselect control-btn-area`}>
            <div className={`importance-btn flex`}>
              <div className="standard">
                <RadioButton
                  id="standard"
                  value={1}
                  label="標準"
                  name="soap_importance"
                  getUsage={this.selectImportance}
                  checked={this.state.presData.importance == 1}
                />
              </div>
              <div className="important">
                <RadioButton
                  id="important"
                  value={2}
                  label="重要"
                  name="soap_importance"
                  getUsage={this.selectImportance}
                  checked={this.state.presData.importance == 2}
                />
              </div>
              <div className="question">
                <RadioButton
                  id="question"
                  value={3}
                  label="問題"
                  name="soap_importance"
                  getUsage={this.selectImportance}
                  checked={this.state.presData.importance == 3}
                />
              </div>
              <div className="notice">
                <RadioButton
                  id="notice"
                  value={4}
                  label="注意"
                  name="soap_importance"
                  getUsage={this.selectImportance}
                  checked={this.state.presData.importance == 4}
                />
              </div>
            </div>
            <div className={'content_editable_icon flex'} style={{position:"relative"}}>
              <button
                className={'bold-btn'}
                style={{backgroundColor:""}}
                onMouseDown={evt => {
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  evt.preventDefault(); // Avoids loosing focus from the editable area
                  document.execCommand("bold", false, ""); // Send the command to the browser
                  this.boldBtnClicked(evt)
                }}
              >B</button>
              <button
                className={'italic-btn'}
                style={{fontStyle:"italic", backgroundColor:""}}
                onMouseDown={evt => {
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  evt.preventDefault(); // Avoids loosing focus from the editable area
                  document.execCommand("italic", false, ""); // Send the command to the browser
                  this.italicBtnClicked(evt)
                }}
              >I</button>
              <button
                className="color-icon" id={'color_sel_icon'}
                onClick={(e) => {this.colorPickerHover(e)}}
              >
                <label className="set-font-color" style={{borderColor:this.soap_font_color}}>A<sup>▾</sup></label>
              </button>
              <div style={ color_styles.popover } className={'color_picker_area'} id={'color_picker_area'}>
                <div className={'color-block-area'}>
                  <div className={'flex'}>
                    <div className={'color-block'} style={{backgroundColor:"#d0021b"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#d0021b");
                      this.changeBtnColor("#d0021b");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#f5a623"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#f5a623");
                      this.changeBtnColor("#f5a623");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#f8e71c"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#f8e71c");
                      this.changeBtnColor("#f8e71c");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#8b572a"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#8b572a");
                      this.changeBtnColor("#8b572a");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#7ed321"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#7ed321");
                      this.changeBtnColor("#7ed321");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#417505"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#417505");
                      this.changeBtnColor("#417505");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#bd10e0"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#bd10e0");
                      this.changeBtnColor("#bd10e0");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#9013fe"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#9013fe");
                      this.changeBtnColor("#9013fe");
                      this.setContentEditData();
                    }}> </div>
                  </div>
                  <div className={'flex'}>
                    <div className={'color-block'} style={{backgroundColor:"#4a90e2"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#4a90e2");
                      this.changeBtnColor("#4a90e2");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#50e3c2"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#50e3c2");
                      this.changeBtnColor("#50e3c2");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#b8e986"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#b8e986");
                      this.changeBtnColor("#b8e986");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#000000"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#000000");
                      this.changeBtnColor("#000000");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#4a4a4a"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#4a4a4a");
                      this.changeBtnColor("#4a4a4a");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#9b9b9b"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#9b9b9b");
                      this.changeBtnColor("#9b9b9b");
                      this.setContentEditData();
                    }}> </div>
                    <div className={'color-block'} style={{backgroundColor:"#FFFFFF"}} onMouseDown={e=>{
                      /*@cc_on _d = document; eval ( 'var document = _d') @*/
                      e.preventDefault();
                      document.execCommand("ForeColor", false, "#FFFFFF");
                      this.changeBtnColor("#FFFFFF");
                      this.setContentEditData();
                    }}> </div>
                  </div>
                </div>
              </div>
              <button
                id={'font_sel_icon'}
                style={{position:"relative", padding:"0"}}
                onClick={(e) => {
                  this.fontPickerHover(e)
                }}
              >
                <span style={{position:"absolute", left:"5px", top:"0px"}}>A</span>
                <span style={{position:"absolute", left:"14px", top:"5px"}}>▾</span>
                <span style={{position:"absolute", left:"14px", top:"-5px"}}>▴</span>
              </button>
              <div style={ color_styles.popover  } className={'font_select_area'}>
                <div className={'font-block-area'}>
                  <div className={'font-block'} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("fontSize", false, 1);
                    this.setContentEditData();
                  }}>10</div>
                  <div className={'font-block'} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("fontSize", false, 2);
                    this.setContentEditData();
                  }}>14</div>
                  <div className={'font-block'} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("fontSize", false, 3);
                    this.setContentEditData();
                  }}>16</div>
                  <div className={'font-block'} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("fontSize", false, 4);
                    this.setContentEditData();
                  }}>18</div>
                  <div className={'font-block'} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("fontSize", false, 5);
                    this.setContentEditData();
                  }}>24</div>
                  <div className={'font-block'} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("fontSize", false, 6);
                    this.setContentEditData();
                  }}>32</div>
                  <div className={'font-block'} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("fontSize", false, 7);
                    this.setContentEditData();
                  }}>48</div>
                </div>
              </div>
            </div>
          </div>
          <div className={'order-area'} id={'order-area'}>
            <div className={'order-data-area'}>
              <InsertSoapArea font_props = {this.props.font_props} className={'soap-area'}>
                <div
                  className="data-title"
                  onClick={(e)=>this.orderTitleClick(e, CATEGORY_TYPE.SOAP)}
                  onContextMenu={e=>this.orderHandleClick(e, CATEGORY_TYPE.SOAP, (this.props.isForUpdate ? OPERATION_TYPE.EDIT:OPERATION_TYPE.REGIST), 0)}
                >
                  <div className={`data-item progress-item ${(soap_sort_data == null ||(soap_sort_data != null && soap_sort_data['open'] == true)) ? 'open' : ''}`}>
                    <div className="flex">
                      <div className="note">{(SoapCategory != undefined && SoapCategory != null && SoapCategory == "hospital_note") ? "【初診・入院時ノート】" : "【プログレスノート】 "}{this.props.isForUpdate?'＜編集＞':''}</div>
                      <div className="department text-right">{(soap_edit_data !== undefined && soap_edit_data != null && soap_edit_data.department_name !== undefined) ? soap_edit_data.department_name : department_name}</div>
                    </div>
                    {this.props.isForUpdate && this.state.presData.created_at !== undefined && (
                      <div className="date">
                        <>
                          {this.state.presData.created_at !== "" ? formatJapanSlashDateTime(this.state.presData.created_at):""}
                          {this.state.presData.last_doctor_code !== undefined && (
                            <div style={{textAlign:"left"}}>
                              {this.authInfo.staff_category === 1 ? (
                                <>
                                  {this.authInfo.doctor_code === this.state.presData.last_doctor_code ? (
                                    <div>医師：{this.state.presData.last_doctor_name}</div>
                                  ):(
                                    <div>医師：{this.state.presData.last_doctor_name} → <span className={'blue-text'}>{this.authInfo.name}</span></div>
                                  )}
                                </>
                              ):(
                                <>
                                  {this.context.selectedDoctor.code <= 0 ? (
                                    <div>医師：{this.state.presData.last_doctor_name}→<span className={'note-red'}>依頼医未選択</span></div>
                                  ):(
                                    <>
                                      {this.context.selectedDoctor.code == this.state.presData.last_doctor_code ? (
                                        <div>医師：{this.state.presData.last_doctor_name}</div>
                                      ):(
                                        <div>医師：{this.state.presData.last_doctor_name} → <span className={'line-done'}>{this.context.selectedDoctor.name}</span></div>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </>
                      </div>
                    )}
                    {this.props.isForUpdate ? (
                      <>
                        {this.state.presData.visit_place_id != undefined && this.state.presData.visit_place_id != null && this.state.presData.visit_place_id > 0 && (
                          <div style={{textAlign:"left"}}>
                            <div>{this.getVisitPlaceName(this.state.presData.visit_place_id)}</div>
                          </div>
                        )}                        
                      </>
                    ) : (
                      <>
                        {visit_place_id > 0 && visit_place_name != "" && (
                          <div style={{textAlign:"left"}}>
                            <div>施設名：{visit_place_name}</div>                            
                          </div>
                        )}
                      </>
                    )}                    
                    <Angle className="angle" icon={faAngleDown} />
                  </div>
                </div>
                <div style={{display:(soap_sort_data == null || (soap_sort_data != null && soap_sort_data['open'] == true)) ? 'block' : 'none'}}>
                  <div className={`data-input open`}>
                    {(SoapCategory !== undefined && SoapCategory != null && SoapCategory === "hospital_note") ? (
                      <table className={`soap-data hospitalize ${karte_mode == KARTEMODE.READ ? "soap-read-mode" : ""}`} id = "soap-data">
                        <tr onContextMenu={e => this.handleClick_hospital(e, 'S')}>
                          <th>主訴</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.s_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "s_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                        <tr onContextMenu={e => this.handleClick_hospital(e, 'sharp_text')}>
                          <th>現病歴</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.sharp_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "sharp_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                        <tr onContextMenu={e => this.handleClick_hospital(e, 'O')}>
                          <th>所見</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.o_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "o_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                        <tr onContextMenu={e => this.handleClick_hospital(e, 'A')}>
                          <th>アセスメント</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.a_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "a_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                        <tr onContextMenu={e => this.handleClick_hospital(e, 'P')}>
                          <th>プラン</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.p_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "p_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                      </table>
                    ):(
                      <table className={`soap-data ${karte_mode == KARTEMODE.READ ? "soap-read-mode" : ""}`} id = "soap-data">
                        <tr onContextMenu={e => this.handleClick(e, 'sharp_text')}>
                          <th>#</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"                              
                              html={this.state.presData.sharp_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "sharp_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                        <tr onContextMenu={e => this.handleClick(e, 'S')}>
                          <th>(S)</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.s_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "s_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                        <tr onContextMenu={e => this.handleClick(e,'O')}>
                          <th>(O)</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.o_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "o_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                        <tr onContextMenu={e => this.handleClick(e, 'A')}>
                          <th>(A)</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.a_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "a_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                        <tr onContextMenu={e => this.handleClick(e, 'P')}>
                          <th>(P)</th>
                          <td className={'text-left'} onDrop={e => this.onDropSoapElement(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.presData.p_text}
                              disabled={karte_mode === KARTEMODE.READ}
                              onChange={e=>this.onChangeCKEditArea(e, "p_text")} // handle innerHTML chang
                              tagName='article'
                            />
                          </td>
                        </tr>
                      </table>
                    )}
                  </div>
                </div>
              </InsertSoapArea>
              {InsertPart}
              {DeletePart}
              {DeleteRpPart}
              {DeleteInjectionPart}
              {DeleteInjectionRpPart}
              {DonePrescriptionPart}
              {DoneInjectionPart}
              {DoneExamOrderPart}
              {StopPrescriptionPart}
              {StopInjectionPart}
            </div>
            <div className={'space-area'} style={{height:"0px"}} onContextMenu={e =>this.orderHandleClick(e, null, null, 0, null, "space-area")}> </div>
          </div>
        </div>
        {this.state.confirm_message !== "" && this.state.confirm_type !== "" && this.state.confirm_alert_title == "" && (
          <SystemConfirmModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.confirm_alert_title !== "" && (
          <>
            {this.state.confirm_value2 == null ? (
              <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk.bind(this)}
                confirmTitle= {this.state.confirm_message}
                title= {this.state.confirm_alert_title}
              />
            ):(
              <SystemConfirmWithBtnModal
                title= {this.state.confirm_alert_title}
                confirmTitle= {this.state.confirm_message}
                firstMethod={this.confirmOk.bind(this, 1)}
                first_btn_name={'上書き'}
                secondMethod= {this.confirmOk.bind(this, 2)}
                second_btn_name={'追記'}
                second_btn_class={'red-btn'}
                thirdMethod= {this.confirmCancel.bind(this)}
                third_btn_name={'キャンセル'}
                third_btn_class={'cancel-btn'}
              />
            )}
          </>
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          categoryType={this.state.categoryType}
          categoryOperation={this.state.categoryOperation}
          stampKey={this.state.stampKey}
          seal_print={this.state.seal_print}
          content_key={this.state.content_key}
          content_type={this.state.content_type}
          create_at={this.state.create_at}
          current_date={getCurrentDate('-')}
        />
        <ContextMenu_soap
          {...this.state.contextMenu_soap}
          parent={this}
        />
        <ContextMenu_hospital
          {...this.state.contextMenu_hospital}
          parent={this}
        />
        <HoverMenu
          {...this.state.hoverMenu}
          parent={this}
        />
        <HoverSoapMenu
          {...this.state.hoverSoapMenu}
          parent={this}
        />
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
            karteStatusCode={this.state.karte_status_code}
          />
        )}
        {this.state.isSoapModal && (
          <RoutineInputPanel
            closeModal = {this.closeModal}
            kind = {this.state.soap_kind}
            title = "soap"
            setValue = {this.setValue}
            presData = {this.state.presData}
          />
        )}
        {this.state.isOpenSelectDiseaseModal && (
          <SelectMedicineModal
            system_patient_id = {this.props.patientId}
            closeModal = {this.closeModal}
            selectDiseaseName = {this.pasteDiseaseName.bind(this)}
          />
        )}
        {this.state.isOpenAlergyModal && (
          <AlergyList
            system_patient_id = {this.props.patientId}
            closeModal = {this.closeModal}
            type = {this.state.allergy_type}
            selectAlergy = {this.pasteAlergy.bind(this)}
          />
        )}
        {this.state.registerSetModal && (
          <RegisterSetModal
            hideModal={this.handleClose}
            handleCancel={this.handleClose}
            handleOk={this.handleRegisterSet}
            preset_do_count={this.state.preset_do_count}
            patientId={this.props.patientId}
          />
        )}
        {this.state.registerPatientSetModal && (
          <RegisterSetModal
            hideModal={this.handleClose}
            handleCancel={this.handleClose}
            handleOk={this.handleRegisterPatientSet}
            patientId={this.props.patientId}
          />
        )}
        {this.state.alertMessage === "death" && (
          <AlertNoFocusModal
            hideModal= {this.cancelAlertModal.bind(this)}
            handleOk= {this.cancelAlertModal.bind(this)}
            showMedicineContent= {"死亡した患者です。"}
          />
        )}
        {this.state.isOpenInspectionImageModal && (
          <EndoscopeImageModal
            closeModal={this.closeModal}
            imgBase64={this.state.endoscope_image}
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
RightBox.contextType = Context;
RightBox.propTypes = {
  isLoaded: PropTypes.bool,
  isForUpdate: PropTypes.bool,
  soapList: PropTypes.array,
  patientId: PropTypes.number,
  patientInfo: PropTypes.array,
  updateIndex: PropTypes.number,
  presData: PropTypes.object,
  showModal: PropTypes.func,
  getSoapPrescriptionDelData: PropTypes.func,
  getSoapInjectionDelData: PropTypes.func,
  openPrescriptionIncreasePeriodModal: PropTypes.func,
  setForUpdate: PropTypes.func,
  goToDropPage: PropTypes.func,
  saveConfirmMessage: PropTypes.func,
  getLastPrescription: PropTypes.func,
  history: PropTypes.object,
  font_props: PropTypes.number,
  middleboxCancelDelData: PropTypes.func,
  refreshMiddleBox: PropTypes.func,
  closeRightClickMenu: PropTypes.func,
}
export default RightBox;
