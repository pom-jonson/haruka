import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {
  WEEKDAYS,
  getInspectionName,
  CACHE_LOCALNAMES,
  FUNCTION_ID_CATEGORY,
  getStrLength,
  CACHE_SESSIONNAMES,
  checkSMPByUnicode,
  getInspectionMasterInfo,
  getStaffName,
  getVisitPlaceNameForModal,
  getMultiReservationInfo
} from "~/helpers/constants";
import axios from "axios";
import {surface, secondary200, midEmphasis, disable} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import {formatJapanDateSlash, formatJapanSlashDateTime} from "../../../helpers/date";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import renderHTML from 'react-render-html';
import * as sessApi from "~/helpers/cacheSession-utils";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import {displayLineBreak, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import $ from "jquery";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import ItemTableBody from "~/components/templates/Patient/Modals/Guidance/ItemTableBody";
import Spinner from "react-bootstrap/Spinner";
import BodyPartsPanel from "~/components/templates/Patient/Modals/Physiological/BodyPartsPanel";
import {formatTimeIE} from "~/helpers/date";
import Tooltip from "react-bootstrap/Tooltip";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {haruka_validate_state_to_config} from "~/helpers/haruka_validate_state_to_config";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";

const imageButtonStyle = {
  textAlign: "center",
  color: "blue",
  cursor: "pointer",
  float: "right"
};

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`  
  display: block;
  font-size: 1rem;
  width: 100%;
  display: flex;
  text-align: center;
  #soap_list_wrapper{
    height: 60vh;
  }
  .content{
    height: 100%;
    overflow-y: hidden;
  }
  .patient-info {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .input-area {
    width:55%;
    height:100%;
    overflow-y:auto;
    padding-top:15px;
    padding-left:1rem;
    position:relative;
    .shoot-condition-area{
      .row-title{
        text-align:left;
        padding-left:5px;
        padding-top: 5px;
      }
      .directions{
        text-align:left;
        padding-left:20px;
        .count-area{
          margin-top:5px;
          font-size:1rem;
          .label-title{
            width:2%!important;
          }
          div{
            margin-top:0px!important;
          }
          .label-unit{
            font-size:1rem;
            padding-top:0.4rem;
          }
          input{
            height:2rem;
            margin-top:3px;
            width:121px!important;
          }
        }
      }
    }
    .sub-title{
      text-align:left;
    }
    .one-row{
      margin-top:0.5rem;
    }
    .title-label{
      width:6rem;
      min-width:3.5rem;
      text-align:left;
      margin-right:0.5rem;
    }
    .numeric-input{
      width:6rem;
    }
    .unit-label{
      width:auto;
      margin-left:0.5rem;
    }
    .blog{
      margin-top:1rem
    }
    .top-area{
      overflow-y:auto;
      max-height:15rem;
    }
    .uses-area{
      max-height: 8rem;
      overflow-y: auto;
    }
    .comment-area{
      textarea{
        height:4rem;
      }
    }
    .set-detail-area {
      width: 100%;
      max-height: calc(60vh - 10rem);
      min-height: 6rem;
      overflow-y: auto;
      table {
        margin-bottom: 0;
      }
      .table-menu {
        background-color: #a0ebff;
        th{
          font-size:1rem;
          padding:0;
        }
        .code-number{
          width:3.5rem;
        }
      }
      td {
        vertical-align: middle;
        font-size:0.75rem;
        padding:0.2rem;
        .label-title{display:none;}
        input{
          height:1.5rem;
          font-size:0.9rem;
        }
      }
      .pullbox-label {
        width: 100%!important;
        margin: 0;
      }
      .value-area{
        div{
          line-height: normal!important;
          margin-top:0;
        }
        .react-numeric-input {
          input {
            width: 100% !important;
            font-size: 0.75rem;
          }
        }
      }
      .label-title {
        width: 0;
        margin: 0;
      }
      .label-unit {
        width: 0;
        margin: 0;
      }
      .select-class {
        select{
          width:100%;
          height:2rem;
          font-size:0.75rem;
        }
      }
      .search-item-btn {
        margin: 0;
        padding: 0;
        width: 100%;
        height: auto!important;
        font-size:0.8rem;
      }
      .birthday_area{
        span{
          line-height:38px;
          margin-right: 5px;
          margin-left: 5px;
        }
        .pullbox-select{
          width:75px;
        }
        .month_day{
          .pullbox-select{
              width:50px;
          }
          .label-title{
              display:none;
          }
          label {
            width: 50px;
          }
        }
        label {
          width: 80px;
        }
        .calendar_icon {
          left: 100px;
        }
        .react-datepicker-wrapper {
          width: 35px;
          padding-top:0.3rem;
          svg {
            left: 10px;
            top: 0px;
          }
          .react-datepicker__input-container{
            width: 35px;
          }
        }
      }
    }
 `;

const Col = styled.div`
  width: 100%;  
  height: 100%;
  overflow-y: hidden;  
  textarea {
    width: 100%;
    resize: none;
  }
  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 70%;
      float: left;
      padding: 5px;      
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
    font-size: 1rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold;
    text-align: left;
    padding-left: 0.5rem;
  }
  .doctor-name{
    font-size: 12px;
    padding-right: 8px;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 12px;
    padding-right: 8px;
  }
  .order{
    display: block !important;
  }
  .data-list{
    background-color: ${surface};
    overflow: hidden;
    margin-top: 0.5rem;
    .data-item{ 
      padding: 0.5rem 0.5rem 0 0.5rem;
    }
  }
  .soap-history-title{
    font-size: 0.75rem;
  }
  .low-title,
  .middle-title{
    background: rgb(230, 230, 231);
  }
  .facility-border{
    border-top: 1px solid rgb(213, 213, 213);
  }
  .tb-soap{
    width: 100%;
    th{
      background: #f6fcfd; 
    }
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
  .basic-area{
    div {margin-top:0;}
    .label-title{
      width:4.5rem;
      text-align:left;
      font-size: 1rem;
      line-height:2rem;
      margin:0;
    }
    .label-unit{
      margin:0;
      font-size: 1rem;
      line-height:2rem;
      margin-left:0.3rem;
      width:1.5rem;
    }
    input{
      width:6rem;
      height: 2rem;
      font-size: 1rem;
    }
  }
  .formula_area {
    .label-title{
      line-height:2rem;
      font-size: 1rem;
      text-align: left;
    }
    .pullbox-label {
      margin:0;
      .pullbox-select {
        width:10rem;
        height:2rem;
        font-size: 1rem;
      }
    }
  }
  .block-area {
    border: 1px solid #aaa;
    margin-top: 20px;
    padding: 10px;
    position: relative;
    label {
      font-size: 0.9rem;
      width: 45%;
    }
  }
  .block-title {
    position: absolute;
    top: -16px;
    left: 10px;
    font-size: 1.2rem;
    background-color: white;
    padding-left: 5px;
    padding-right: 5px;
  }
  .ime-active input {
    ime-mode: active;
  }
  .ime-inactive input {
    ime-mode: inactive;
  }
`;

const MedicineListWrapper = styled.div`
  font-size:${props=>(props.font_props != undefined?0.75 * props.font_props + 'rem':'0.75rem')};
  height:calc( 60vh - 10rem);
  .history-item {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 1px;
  }
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
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 195px;
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
  .note-red {
    color:rgb(255, 0, 0);
  }
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    svg {
      width: 2.2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;


const ContextMenu = ({visible, x, y, state, can_revert_accept, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {state == 1 && (
            <li><div onClick={() => parent.contextMenuAction("revert_not_accept", state)}>未受付に戻す</div></li>
          )}
          {state == 2 && (
            <>
              <li><div onClick={() => parent.contextMenuAction("revert_not_accept", state)}>未受付に戻す</div></li>
              {can_revert_accept && (
                <li><div onClick={() => parent.contextMenuAction("revert_accept")}>受付済みに戻す</div></li>
              )}
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {return null;}
};

class InspectionDoneModal extends Component {
  constructor(props) {
    super(props);
    let order_data = (props.from_page === "soap") ? this.props.modal_data.data.order_data.order_data : this.props.modal_data.order_data.order_data;
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    this.departmentOptions = [];
    this.surface_formulas = null;
    if(init_status !== undefined && init_status != null){
      let department_data = init_status.diagnosis_treatment_department;
      if(department_data.length > 0){
        department_data.map(department=>{
          this.departmentOptions[department['id']] = department['value'];
        })
      }
      this.surface_formulas = init_status.surface_formulas;
    }
    let inspection_info = getInspectionMasterInfo(order_data.inspection_id);
    let formula_id = order_data.done_formula_id != undefined
      ? parseInt(order_data.done_formula_id) : ((order_data.formula_id != undefined && order_data.formula_id != null) ? parseInt(order_data.formula_id) : 0);
    let formula = null;
    this.formula_list = [{id:0, value:''}];
    if (this.surface_formulas !== undefined && this.surface_formulas != null && this.surface_formulas !== ''){
      Object.keys(this.surface_formulas).map((formula_name, index) => {
        if((index + 1) == formula_id){
          formula = formula_name;
        }
        this.formula_list.push({id:index + 1, value:formula_name, formula:this.surface_formulas[formula_name]})
      })
    }
    this.init_item_details = [
      {classfic: 20, classfic_name:'内視鏡造影', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:"",
        item_category_id:9, name:'', input_item1_attribute:"0", input_item1_format:"", input_item1_unit:"", input_item1_max_length:"", input_item2_attribute:'0', input_item2_format:'', input_item2_unit:'', input_item2_max_length:''},
    ];
    this.state = {
      inspection_info,
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data: this.props.modal_data,
      isOpenInspectionImageModal: false,
      confirm_message: "",
      confirm_title: "",
      confirm_type: "",
      waring_message: "",
      alert_messages: "",
      alert_title: "",
      order_data,
      height:order_data.done_height != undefined ? order_data.done_height : order_data.height,
      weight:order_data.done_weight != undefined ? order_data.done_weight : order_data.weight,
      surface_area:order_data.done_surface_area != undefined ? order_data.done_surface_area : order_data.surface_area,
      formula_id,
      formula,
      done_comment:(order_data.done_comment != undefined && order_data.done_comment != null) ? order_data.done_comment : "",
      item_details:(order_data.details != undefined && order_data.details.length > 0) ? order_data.details : this.init_item_details,
      done_body_part:(order_data.body_part !== undefined && order_data.body_part != null) ? order_data.body_part : "",
      isBodyPartOpen:false,
      body_part_json:null,
      load_flag:false,
      require_body_parts:0,
      done_result:"",
      first_tag_id:"",
      check_message: "",
    };
    this.can_done = false;
    let reception_disable, done_disable = false;
    if (this.props.modal_data !== undefined && this.props.modal_data.state !== undefined
      && (this.props.modal_data.state === 1 || this.props.modal_data.state === 2) && this.props.reception_or_done === "reception"){
      reception_disable = true;
    }
    if (this.props.modal_data !== undefined && this.props.modal_data.state !== undefined && this.props.modal_data.state === 2 && this.props.reception_or_done === "done"){
      done_disable = true;
    }
    this.reception_disable = reception_disable;
    this.done_disable = done_disable;
  }

  async componentDidMount() {
    if(this.props.reception_or_done === "done" && this.state.inspection_info.enable_body_part_comment === 1){
      await this.getInspectionDoneInfo();
    }
    if(this.props.reception_or_done === "done"){
      if(this.state.modal_type === "endoscope"){ //内視鏡検査実施権限
        this.can_done = this.context.$canDoAction(this.context.FEATURES.ENDOSCOPEORDER, this.context.AUTHS.DONE_OREDER);
      } else { //生理検査実施権限
        this.can_done = this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.DONE_OREDER);
      }
    } else {
      this.can_done = true;
    }
    await this.getDoctorsList();
  }
  
  getInspectionDoneInfo=async()=>{
    let path = "/app/api/v2/order/inspection/get/done_info";
    let post_data = {
      inspection_id:this.state.order_data.inspection_id,
    };
    if(this.state.order_data.classification1_id !== undefined){
      post_data.classification1_id = this.state.order_data.classification1_id;
    }
    if(this.state.order_data.classification2_id !== undefined){
      post_data.classification2_id = this.state.order_data.classification2_id;
    }
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        this.setState({
          body_part_json: res.body_part_json,
          require_body_parts: res.require_body_parts,
        });
      })
      .catch(() => {
      });
  }
  
  getDoctorsList = async () => {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    this.setState({
      doctors: data,
      load_flag:true,
    });
  };

  doneData = async() => {
    let path = "/app/api/v2/order/orderComplete";
    let number = this.props.from_page === "soap" ? this.props.modal_data.data.order_data.order_data.number : this.props.modal_data.order_data.order_data.number;
    let order_data = JSON.parse(JSON.stringify(this.state.order_data));
    order_data.state = this.props.reception_or_done === "reception" ? 1 : 2;
    if(this.props.reception_or_done === "done"){
      order_data.done_height = this.state.height;
      order_data.done_weight = this.state.weight;
      order_data.done_surface_area = this.state.surface_area;
      order_data.done_formula_id = this.state.formula_id;
      order_data.done_comment = this.state.done_comment;
      if(this.state.inspection_info.enable_body_part_comment === 1){
        order_data.done_body_part = this.state.done_body_part;
      }
      if(this.state.done_result !== ""){
        order_data.done_result = this.state.done_result;
        order_data.result_suffix = this.state.inspection_info.result_suffix;
      }
      if(this.state.modal_type === "endoscope"){
        let details = [];
        if(this.state.item_details.length > 0){
          this.state.item_details.map((item)=>{
            if(item.item_id != 0 && item.item_name != ""){
              details.push(item);
            }
          });
        }
        order_data.details = details.length > 0 ? details : undefined;
      }
    }
    let post_data = {
      type:this.props.modal_type,
      number,
      reception_or_done: this.props.reception_or_done,
      order_data,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          this.setState({
            confirm_type:"done_complete",
            alert_messages:res.alert_message,
            confirm_message:"",
            confirm_value:order_data,
          });
        }
      })
      .catch(() => {
      });
  };

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }
  
  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1) => {
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
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
  }

  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    if (nDoctorConsented == 4) {
      return `（過去データ取り込み）${strDoctorName}`;
    }
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else{
      if (nDoctorConsented == 1) {
        return `[承認済み] 依頼医: ${strDoctorName}`;
      } else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }

  confirmCancel=()=> {
    this.setState({
      confirm_message: "",
      confirm_title: "",
      confirm_type: "",
      waring_message: "",
      alert_messages: "",
      alert_title: "",
      isBodyPartOpen: false,
    });
  }

  openConfirm=()=> {
    if(this.done_disable || this.reception_disable){return;}
    if(this.state.modal_type == "endoscope" && this.props.reception_or_done == "done"){
      var details_check_flag = false;      
      if(this.state.item_details.length > 0){
        this.state.item_details.map((item)=>{
          if(item.item_id != 0 && item.item_name != ""){
            if (item.tele_type != 2 && (item.value1 == undefined || item.value1 == '') && (item.value2 == undefined || item.value2 == null || item.value2 == '')){
              details_check_flag = true;
              this.setState({
                confirm_type:'detail_type',
                alert_messages:'品名の数量を入力してください。',
              })
            } else {
              if (checkSMPByUnicode(item.value1) || checkSMPByUnicode(item.value2)){
                details_check_flag = true;
                this.setState({
                  alert_messages:'品名に印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください',
                  confirm_type:'detail_type'
                })
              }
            }
          }
        });
      }
      if(details_check_flag){return;}
    }
    let validate_result = this.checkValidate();
    if(validate_result.error_str_arr.length > 0) {
      this.setState({
        first_tag_id:validate_result.first_tag_id,
        check_message: validate_result.error_str_arr.join('\n'),
      });
      return;
    }
    if (checkSMPByUnicode(this.state.done_comment)) {
      this.setState({
        alert_messages:'実施コメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。',
        confirm_type:'comment_type'
      });
      return;
    }
    if(this.props.reception_or_done === "done" && this.state.require_body_parts === 1 && this.state.done_body_part === ""){
      this.setState({
        alert_messages:'部位指定コメントを入力してください。',
        confirm_type:'done_body_part'
      });
      return;
    }
    this.setState({
      confirm_type:"reception_done",
      confirm_message: this.props.reception_or_done == "done" ? "実施しますか？":"受け付けますか？",
    });
  };
  
  componentDidUpdate () {
    this.checkValidate('background');
  }
  
  checkValidate=(view_type="border")=>{
    let ret_data = {
      error_str_arr:[],
      first_tag_id:'',
    };
    if(this.props.reception_or_done !== "done"){return ret_data;}
    if(this.props.modal_data.state === 2){return ret_data;}
    if(this.state.inspection_info.enable_height_weight_surface_area !== 1){return ret_data;}
    let check_data = {};
    check_data.height = this.state.height;
    check_data.weight = this.state.weight;
    check_data.surface_area = this.state.surface_area;
    if(view_type === "background"){
      haruka_validate_state_to_config('karte', 'physiological', 'lung', check_data, 'background');
    } else {
      return haruka_validate_state_to_config('karte', 'physiological', 'lung', check_data);
    }
  }
  
  closeAlertModal=()=> {
    this.setState({check_message: ''});
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id !== undefined && first_tag_id != null){
      $('#' + first_tag_id).focus();
    }
  }

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  closeDoctor = () => {
    this.context.$selectDoctor(false);
  }

  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if(doctor.doctor_code === parseInt(id)){
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.context.$selectDoctor(false);
    if (this.doctor_modal_flag == 0) return;
    this.setState({
      isVisitTreatmentPatientModal: true
    });
    this.doctor_modal_flag = 0;
  };

  getOrderTitleClassName = (param_obj) => {
    if(param_obj.state == 0 || param_obj.state == 5 || param_obj.state == 6) {
      return param_obj.karte_status != 3 ? "_color_not_implemented" : "_color_not_implemented_hospital";
    }
    if(param_obj.state == 1) {
      return param_obj.karte_status != 3 ? "_color_received" : "_color_received_hospital";
    }
    if( param_obj.state == 2) {
      return param_obj.karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
    }
    return "";
  }

  openInspectionImageModal = async (number) => {
    const { data } = await axios.post("/app/api/v2/order/inspection/getImage", {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  closeInspectionModal = () => {
    this.setState({
      isOpenInspectionImageModal: false,
    });
  }

  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    return _insuranceName
  }

  getInputText = (name, e) => {
    this.setState({[name]:e.target.value});
  }
  
  getInspectionStatus=(modal_data)=>{
    let order_data = modal_data.order_data.order_data;
    let state = order_data.state;
    let is_enabled = 0;
    let inspection_id = modal_data.inspection_id !== undefined ? modal_data.inspection_id : order_data.inspection_id;
    let status = state == 0 ? "未受付" : (state == 1 ? "受付済み" : (state == 5 ? "受付中" : (state == 6 ? "実施中" : "")));
    let inspection_info = getInspectionMasterInfo(inspection_id);
    if(inspection_info.end_until_continue_type !== undefined && (inspection_info.end_until_continue_type == 1 || (inspection_info.end_until_continue_type == 2 && order_data.karte_status == 3))){
      status = "未実施";
      if(order_data.start_date !== undefined){status = "実施中";}
      if(order_data.end_date !== undefined){status = "";}
    }
    if(modal_data.is_enabled !== undefined){
      if(is_enabled == 2){status = "（削除済み）";}
      if(is_enabled == 4){status = "（中止済み）";}
    }
    return status;
  }

  getInputBasicNumber = (name, e) => {
    let input_value = e.target.value.replace(/[^0-9/\\.。０-９]/g, "");
    if (input_value != '') input_value = toHalfWidthOnlyNumber(input_value);
    this.setState({[name]:input_value}, () => {
      if (name =='height' || name == 'weight'){
        this.calculateSurface(this.state.formula);
      }
    })
  }
  
  getFormula = e => {
    this.setState({
      formula_id:parseInt(e.target.id),
      formula:e.target.value
    }, () => {
      this.calculateSurface(this.state.formula);
    })
  }

  calculateSurface(formula_name){    
    if (formula_name == undefined || formula_name ==null || formula_name == '') {      
      this.setState({surface_area:''});
      return false;
    }    
    let height = parseFloat(this.state.height);
    let weight = parseFloat(this.state.weight);
    if (!(height >= 0 && weight >=0)){
      this.setState({surface_area:''});
      return false;
    }

    let formula = this.surface_formulas[formula_name];
    formula = formula.replace('height', height);
    formula = formula.replace('weight', weight);
    var surface_area = eval(formula);
    surface_area = parseFloat(surface_area).toFixed(4);    
    this.setState({surface_area});
  }
  
  handleClick=(e, modal_data)=>{
    if(this.props.from_page === "soap" || this.props.only_close_btn){return;}
    let state = modal_data.state != undefined ? modal_data.state : modal_data.order_data.order_data.state;
    if(state == 0) return;
    if(this.state.modal_type == "endoscope"){
      if (!this.context.$canDoAction(this.context.FEATURES.ENDOSCOPEORDER,this.context.AUTHS.EDIT_ORDER_STATE)) return;
    } else {
      if (!this.context.$canDoAction(this.context.FEATURES.EXAMORDER,this.context.AUTHS.EDIT_ORDER_STATE)) return;
    }
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let can_revert_accept = state == 1 ? true : false;
      if(state == 2 && modal_data.accepted_date != null){
        can_revert_accept = true;
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - $('#soap_list_wrapper').offset().left,
          y: e.clientY - $('#soap_list_wrapper').offset().top + window.pageYOffset + 70,
          state,
          can_revert_accept
        }
      });
    }
  };
  
  contextMenuAction=(act, state)=>{
    let confirm_message = "";
    let waring_message = "";
    if(act == "revert_not_accept"){
      confirm_message = "このオーダーを未受付に戻しますか？";
      if(state == 2){
        waring_message = "※ 実施の追加情報も消去されます。";
      }
    } else if(act == "revert_accept"){
      confirm_message = "このオーダーを受付済み(未実施)に戻しますか？";
      waring_message = "※ 実施の追加情報も消去されます。";
    }
    this.setState({
      confirm_message,
      confirm_title: "状態変更確認",
      waring_message,
      confirm_type: act,
    });
  }
  
  confirmOk = () => {
    if(this.state.confirm_type === "delete_obtain_tech"){
      this.setState({
        obtain_tech:'',
        obtain_tech_id:0,
        confirm_message:"",
        confirm_title:"",
        confirm_type:""
      })
    } else if(this.state.confirm_type === "reception_done"){
      this.doneData();
    } else if(this.state.confirm_type === "revert_not_accept" || this.state.confirm_type === "revert_accept"){
      this.revertStatus();
    }
  };
  
  revertStatus=async()=>{
    let path = "/app/api/v2/order/inspection/revert";
    let number = this.props.from_page === "soap" ? this.props.modal_data.data.order_data.order_data.number : this.props.modal_data.order_data.order_data.number;
    let post_data = {
      number,
      type: this.state.confirm_type,
    };
    if(this.props.from_page !== "soap" && this.props.modal_data.order_data.order_data.multi_reserve_flag == 1){
      post_data.multi_reserve_flag = 1;
      post_data.inspection_DATETIME = this.props.modal_data.order_data.order_data.inspection_DATETIME;
      post_data.reserve_time = this.props.modal_data.order_data.order_data.reserve_time;
    }
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          this.setState({
            confirm_type:"revert_order",
            confirm_message:"",
            alert_messages:res.alert_message,
            alert_title:"状態変更完了",
          });
        }
      })
      .catch(() => {
      });
  }
  
  confirmAlertCancel=()=>{
    if(this.state.confirm_type === "done_complete"){
      if(this.props.from_page === "soap"){
        this.props.doneInspection(this.props.modal_data.number, "inspection", this.state.confirm_value);
      }
      if(this.props.handleNotDoneOk !== undefined && this.props.handleNotDoneOk != null){
        this.props.handleNotDoneOk();
      } else {
        this.props.closeModal('change');
      }
    }
    if(this.state.confirm_type === "check_auth" || this.state.confirm_type === "comment_length" || this.state.confirm_type === 'comment_type'
      || this.state.confirm_type === 'detail_type'|| this.state.confirm_type === 'done_body_part'){
      this.confirmCancel();
    }
    if(this.state.confirm_type == "revert_order"){
      if (this.props.handleNotDoneOk != undefined && this.props.handleNotDoneOk != null){
        this.props.handleNotDoneOk();
      } else {
        this.props.closeModal('change');
      }
    }
  }
  
  setItemDetails =(data)=>{
    this.setState({item_details:data});
  }
  
  openBodyPart = () => {
    this.setState({isBodyPartOpen: true});
  };
  
  setBodyPart=(value)=> {
    this.setState({
      isBodyPartOpen: false,
      done_body_part: value
    })
  };
  
  setDoneResult = (e) => {
    let value = e.target.value;
    if(this.state.inspection_info.result_type === 0){
      let RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
      if ((value !== '' && !RegExp.test(value)) || (value.length > this.state.inspection_info.result_input_length)){
        this.setState({done_result: this.state.done_result});
      } else {
        this.setState({done_result: toHalfWidthOnlyNumber(value)});
      }
    } else {
      if (value.length > this.state.inspection_info.result_input_length){
        this.setState({done_result: this.state.done_result});
      } else {
        this.setState({done_result: value});
      }
    }
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
  
  confirmModalClose=()=>{
    if(this.props.from_page === "important_order_list"){
      this.props.closeModal("noRefresh");
    } else {
      this.props.closeModal();
    }
  }

  render() {
    let {modal_data, modal_title, from_page} = this.props;
    if(from_page === "soap"){
      let tmp_modal_data = modal_data;
      modal_data = modal_data.data;
      modal_data['treatment_datetime'] = tmp_modal_data.treatment_datetime;
      modal_data['treatment_date'] = tmp_modal_data.treatment_date;
      modal_data['target_table'] = tmp_modal_data.target_table;
      modal_data['doctor_name'] = tmp_modal_data.doctor_name;
      modal_data['input_staff_name'] = tmp_modal_data.input_staff_name;
      let patient_info = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      modal_data['patient_number'] = patient_info.receId;
      modal_data['patient_name'] = patient_info.name;
    }
    let karte_status_name = "外来・";
    if (modal_data.order_data !== undefined && modal_data.order_data.order_data.karte_status !== undefined) {
      karte_status_name = modal_data.order_data.order_data.karte_status == 1 ? "外来・" : (modal_data.order_data.order_data.karte_status == 2 ? "訪問診療・" : (modal_data.order_data.order_data.karte_status == 3 ? "入院・" : ""));
    }
    let added_info_flag = false;
    if(this.props.reception_or_done === 'done'){added_info_flag = true;}
    return  (
      <Modal
        show={true}
        className={`custom-modal-sm first-view-modal haruka-done-modal ${(added_info_flag && this.props.modal_data.is_enabled == 1)? "haruka-done-radiation-modal":""}`}
      >
        <Modal.Header>
          <Modal.Title>{modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.load_flag ? (
              <>
                {modal_data.order_data !== undefined && (
                  <Col id="soap_list_wrapper">
                    <Bar>
                      <div className='flex' style={{height:'100%'}}>
                        <div
                          className="content"
                          style={{width:(added_info_flag && this.props.modal_data.is_enabled == 1) ? '60%':'100%'}}
                          onContextMenu={e => this.handleClick(e, modal_data)}
                        >
                          <div className={'patient-info'}>{modal_data.patient_number} : {modal_data.patient_name}</div>
                          <div className="data-list">
                            <div className={`data-title ${this.getOrderTitleClassName({state:modal_data.order_data.order_data.state, karte_status:modal_data.order_data.order_data.karte_status})}`}>
                              <div className={'data-item'}>
                                <div className="flex justify-content">
                                  <div className="note">
                                    【{karte_status_name}
                                    {modal_data.order_data.order_data.inspection_id != null && modal_data.order_data.order_data.inspection_id !== undefined ? getInspectionName(modal_data.order_data.order_data.inspection_id) : "生理"}】
                                    {this.getInspectionStatus(modal_data)}
                                  </div>
                                  <div className="department text-right">{this.departmentOptions[modal_data.order_data.order_data.department_id]}</div>
                                </div>
                                <div className="date">
                                  {modal_data.treatment_datetime !== "" && modal_data.treatment_datetime !== undefined ?
                                    formatJapanSlashDateTime(modal_data.treatment_datetime):formatJapanDateSlash(modal_data.treatment_date)}
                                </div>
                              </div>
                              {modal_data.history !== "" && modal_data.history !== null ? (
                                <div className="history-region text-right middle-title">
                                  {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                </div>
                              ):(
                                <>
                                  <div className="history-region text-right middle-title">
                                    {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                  </div>
                                </>
                              )}
                              <div className="doctor-name text-right low-title">
                                {this.getDoctorName(modal_data.is_doctor_consented, modal_data.order_data.order_data.doctor_name)}
                              </div>
                              {modal_data.order_data.order_data != undefined && modal_data.order_data.order_data.visit_place_id != undefined && modal_data.order_data.order_data.visit_place_id > 0 && (
                                <div className="doctor-name text-right low-title facility-border">
                                  {getVisitPlaceNameForModal(modal_data.order_data.order_data.visit_place_id)}
                                </div>
                              )}
                            </div>
                            <MedicineListWrapper>
                              <div className={'history-item soap-data-item'}>
                                <div className="history-item">
                                  <div className="phy-box w70p">
                                    {this.props.from_page !== "period_order_list" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={'table-item remarks-comment'}>
                                            {modal_data.order_data.order_data.inspection_DATETIME == "日未定" ? "[日未定]" :
                                              (formatJapanDateSlash(modal_data.order_data.order_data.inspection_DATETIME)
                                                + ((modal_data.order_data.order_data.reserve_time !== undefined && modal_data.order_data.order_data.reserve_time !== "") ?
                                                  " "+modal_data.order_data.order_data.reserve_time : ""))}
                                            {modal_data.order_data.order_data.is_emergency == 1 && renderHTML("<span className='note-red'>[当日緊急]</span>")}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">保険</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{this.getInsuranceName(modal_data.order_data.order_data.insurance_name)}</div>
                                      </div>
                                    </div>
                                    {modal_data.order_data.order_data.classification1_name !== undefined && modal_data.order_data.order_data.classification1_name != null && modal_data.order_data.order_data.classification1_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査種別</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.classification1_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.classification2_name !== undefined && modal_data.order_data.order_data.classification2_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査詳細</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.classification2_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {/* ---------- start 内視鏡------------- */}
                                    {modal_data.order_data.order_data.inspection_type_name !== undefined && modal_data.order_data.order_data.inspection_type_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査種別</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.inspection_type_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.inspection_item_name !== undefined && modal_data.order_data.order_data.inspection_item_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査項目</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.inspection_item_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.endoscope_purpose_name !== undefined && modal_data.order_data.order_data.endoscope_purpose_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査目的</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.endoscope_purpose_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {/* ----------- end ------------ */}
                                    {modal_data.order_data.order_data.inspection_purpose !== undefined && modal_data.order_data.order_data.inspection_purpose != null && modal_data.order_data.order_data.inspection_purpose.length > 0 && (
                                      modal_data.order_data.order_data.inspection_purpose.map((item, index)=>{
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
                                    {modal_data.order_data.order_data.inspection_symptom !== undefined && modal_data.order_data.order_data.inspection_symptom != null && modal_data.order_data.order_data.inspection_symptom.length > 0 && (
                                      modal_data.order_data.order_data.inspection_symptom.map((item, index)=>{
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
                                    {modal_data.order_data.order_data.inspection_risk !== undefined && modal_data.order_data.order_data.inspection_risk != null && modal_data.order_data.order_data.inspection_risk.length > 0 && (
                                      modal_data.order_data.order_data.inspection_risk.map((item, index)=>{
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
                                    {modal_data.order_data.order_data.inspection_sick !== undefined && modal_data.order_data.order_data.inspection_sick != null && modal_data.order_data.order_data.inspection_sick.length > 0 && (
                                      modal_data.order_data.order_data.inspection_sick.map((item, index)=>{
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
                                    {modal_data.order_data.order_data.inspection_request !== undefined && modal_data.order_data.order_data.inspection_request != null && modal_data.order_data.order_data.inspection_request.length > 0 && (
                                      modal_data.order_data.order_data.inspection_request.map((item, index)=>{
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
                                    {modal_data.order_data.order_data.is_anesthesia !== undefined && modal_data.order_data.order_data.is_anesthesia != null && modal_data.order_data.order_data.is_anesthesia.length > 0 && (
                                      modal_data.order_data.order_data.is_anesthesia.map((item, index)=>{
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
                                    {modal_data.order_data.order_data.is_sedation !== undefined && modal_data.order_data.order_data.is_sedation != null && modal_data.order_data.order_data.is_sedation.length > 0 && (
                                      modal_data.order_data.order_data.is_sedation.map((item, index)=>{
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
                                    {modal_data.order_data.order_data.inspection_movement !== undefined && modal_data.order_data.order_data.inspection_movement != null && modal_data.order_data.order_data.inspection_movement.length > 0 && (
                                      modal_data.order_data.order_data.inspection_movement.map((item, index)=>{
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
                                    {(modal_data.order_data.order_data.done_height !== undefined
                                      || (modal_data.order_data.order_data.height !== undefined && modal_data.order_data.order_data.height != null && modal_data.order_data.order_data.height != "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">身長</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {modal_data.order_data.order_data.done_height !== undefined
                                              ? modal_data.order_data.order_data.done_height : modal_data.order_data.order_data.height}cm
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {(modal_data.order_data.order_data.done_weight !== undefined
                                      || (modal_data.order_data.order_data.weight !== undefined && modal_data.order_data.order_data.weight != null && modal_data.order_data.order_data.weight != "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">体重</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {modal_data.order_data.order_data.done_weight !== undefined
                                              ? modal_data.order_data.order_data.done_weight : modal_data.order_data.order_data.weight}kg</div>
                                        </div>
                                      </div>
                                    )}
                                    {(modal_data.order_data.order_data.done_surface_area !== undefined
                                      || (modal_data.order_data.order_data.surface_area !== undefined && modal_data.order_data.order_data.surface_area != null && modal_data.order_data.order_data.surface_area != "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">体表面積</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {modal_data.order_data.order_data.done_surface_area !== undefined
                                              ? modal_data.order_data.order_data.done_surface_area : modal_data.order_data.order_data.surface_area}㎡
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.connection_date_title !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{modal_data.order_data.order_data.connection_date_title}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{formatJapanDateSlash(modal_data.order_data.order_data.calculation_start_date)}</div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.sick_name !== undefined && modal_data.order_data.order_data.sick_name != null && modal_data.order_data.order_data.sick_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">臨床診断、病名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.sick_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data !== undefined && modal_data.order_data.order_data.etc_comment !== undefined && modal_data.order_data.order_data.etc_comment != null && modal_data.order_data.order_data.etc_comment != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item"><div>主訴、臨床経過</div>
                                            <div>検査目的、コメント</div></div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.etc_comment}</div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data !== undefined && modal_data.order_data.order_data.special_presentation !== undefined && modal_data.order_data.order_data.special_presentation != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">特殊指示</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.special_presentation}</div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.count !== undefined && modal_data.order_data.order_data.count !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{modal_data.order_data.order_data.count_label !=''?modal_data.order_data.order_data.count_label:''}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.count}{modal_data.order_data.order_data.count_suffix!=''?modal_data.order_data.order_data.count_suffix:''}</div>
                                        </div>
                                      </div>
                                    )}
                                    {((modal_data.order_data.order_data.done_body_part !== undefined && modal_data.order_data.order_data.done_body_part !== "")
                                      || (modal_data.order_data.order_data.done_body_part === undefined && modal_data.order_data.order_data.body_part !== undefined && modal_data.order_data.order_data.body_part !== "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">部位指定コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={'table-item remarks-comment'}>
                                            {modal_data.order_data.order_data.done_body_part !== undefined ? modal_data.order_data.order_data.done_body_part : modal_data.order_data.order_data.body_part}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.image_path !== undefined && modal_data.order_data.order_data.image_path != null && modal_data.order_data.order_data.image_path != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            <a
                                              className="soap-image-title"
                                              onClick={() => this.openInspectionImageModal(modal_data.order_data.order_data.number)}
                                              style={imageButtonStyle}
                                            >
                                              画像を見る
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.additions !== undefined && Object.keys(modal_data.order_data.order_data.additions).length > 0 && (
                                      <div className={`history-item soap-data-item`}>
                                        <div className="phy-box w70p">
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">追加指示等</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {Object.keys(modal_data.order_data.order_data.additions).map(addition=>{
                                                  return(
                                                    <>
                                                      <span>{modal_data.order_data.order_data.additions[addition].name}</span><br />
                                                    </>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {this.props.from_page === "period_order_list" && modal_data.order_data.order_data.multi_reserve_flag == 1 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施/予定情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {getMultiReservationInfo(modal_data.order_data.order_data.reserve_data, modal_data.order_data.order_data.done_numbers)}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.start_date !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">開始日時</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {formatJapanDateSlash(modal_data.order_data.order_data.start_date) + " " + formatTimeIE(new Date((modal_data.order_data.order_data.start_date).split('-').join('/')))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.continue_date !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{this.state.inspection_info.performed_multiple_times_type === 1 ? "実施情報" : "継続登録"}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {this.getContinueDate(modal_data.order_data.order_data.continue_date)}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {modal_data.order_data.order_data.end_date !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">終了日時</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {formatJapanDateSlash(modal_data.order_data.order_data.end_date) + " " + formatTimeIE(new Date((modal_data.order_data.order_data.end_date).split('-').join('/')))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {this.state.order_data.state == 2 && (
                                      <>
                                        {this.state.order_data.done_result !== undefined && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">結果</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{displayLineBreak(this.state.order_data.done_result) + " " + this.state.order_data.result_suffix}</div>
                                            </div>
                                          </div>
                                        )}
                                        {this.state.order_data.done_comment !== undefined && this.state.order_data.done_comment != null && this.state.order_data.done_comment != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">実施コメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{displayLineBreak(this.state.order_data.done_comment)}</div>
                                            </div>
                                          </div>
                                        )}
                                        {this.state.order_data.details !== undefined && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item"> </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {this.state.order_data.details.map(detail=>{
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
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          </div>
                        </div>
                        {(this.props.reception_or_done === "done" && this.props.modal_data.is_enabled == 1) && (
                          <div className='input-area'>
                            {this.state.inspection_info.enable_height_weight_surface_area === 1 && (
                              <div onContextMenu={e => this.handleClick(e, modal_data)}>
                                <div className='blog basic-area'>
                                  <div className='flex'>
                                    <InputWithLabelBorder
                                      label="身長"
                                      type="text"
                                      id={'height_id'}
                                      getInputText={this.getInputBasicNumber.bind(this, 'height')}
                                      isDisabled = {modal_data.state === 2}
                                      diseaseEditData={this.state.height}
                                    />
                                    <label className='label-unit'>cm</label>
                                  </div>
                                  <div className='flex' style={{marginTop:"0.3rem"}}>
                                    <InputWithLabelBorder
                                      label="体重"
                                      id={'weight_id'}
                                      type="text"
                                      getInputText={this.getInputBasicNumber.bind(this, 'weight')}
                                      isDisabled = {modal_data.state === 2}
                                      diseaseEditData={this.state.weight}
                                    />
                                    <label className='label-unit'>kg</label>
                                  </div>
                                  <div className='flex' style={{marginTop:"0.3rem"}}>
                                    <InputWithLabelBorder
                                      label="体表面積"
                                      type="text"
                                      id={'surface_area_id'}
                                      getInputText={this.getInputBasicNumber.bind(this, 'surface_area')}
                                      isDisabled = {modal_data.state === 2}
                                      diseaseEditData={this.state.surface_area}
                                    />
                                    <label className='label-unit'>㎡</label>
                                    <div className ="formula_area">
                                      <SelectorWithLabel
                                        options={this.formula_list}
                                        title={'（計算式'}
                                        getSelect={this.getFormula.bind(this)}
                                        departmentEditCode={this.state.formula_id}
                                        isDisabled = {modal_data.state === 2}
                                      />
                                    </div>
                                    <div style={{lineHeight:"2rem", marginLeft:"0.3rem"}}>）</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {this.state.inspection_info.enable_body_part_comment === 1 && modal_data.state != 2 && (
                              <div className={'block-area'}>
                                <div className={'block-title'}>{'部位'}</div>
                                <div className={'flex'}>
                                  <input type="text" readOnly={true} value={this.state.done_body_part} style={{width:"70%",marginTop:10}}/>
                                  <button onClick={this.openBodyPart.bind(this)} style={{width:"30%", height:"30px",marginTop:10}}>部位編集</button>
                                </div>
                              </div>
                            )}
                            {this.state.modal_type === "endoscope" && modal_data.state != 2 && (
                              <div className={'set-detail-area'}>
                                <ItemTableBody
                                  function_id={FUNCTION_ID_CATEGORY.ENDOSCOPE}
                                  item_details={this.state.item_details}
                                  setItemDetails={this.setItemDetails.bind(this)}
                                />
                              </div>
                            )}
                            {modal_data.state !== 2 && this.state.inspection_info.enable_result === 1 && (
                              <div className={'input-result'}>
                                {this.state.inspection_info.result_type === 0 && (
                                  <div className='flex basic-area ime-inactive'>
                                    <InputWithLabelBorder
                                      label="結果"
                                      type="text"
                                      getInputText={this.setDoneResult.bind(this)}
                                      diseaseEditData={this.state.done_result}
                                    />
                                    <div className='label-unit'>{this.state.inspection_info.result_suffix}</div>
                                  </div>
                                )}
                                {this.state.inspection_info.result_type === 1 && (
                                  <div className='flex basic-area ime-active'>
                                    <InputWithLabelBorder
                                      label="結果"
                                      type="text"
                                      getInputText={this.setDoneResult.bind(this)}
                                      diseaseEditData={this.state.done_result}
                                    />
                                    <div className='label-unit'>{this.state.inspection_info.result_suffix}</div>
                                  </div>
                                )}
                                {this.state.inspection_info.result_type === 2 && (
                                  <>
                                    <div className='sub-title'>結果</div>
                                    <textarea value={this.state.done_result} onChange={this.setDoneResult.bind(this)} style={{width:"100%", height:"4rem"}}/>
                                    <div className='sub-title'>{this.state.inspection_info.result_suffix}</div>
                                  </>
                                )}
                              </div>
                            )}
                            <div className='blog comment-area' onContextMenu={e => this.handleClick(e, modal_data)}>
                              <div className='sub-title'>実施コメント</div>
                              <textarea disabled={modal_data.state === 2} value={this.state.done_comment} onChange={this.getInputText.bind(this, 'done_comment')}></textarea>
                            </div>
                          </div>
                        )}
                      </div>
                    </Bar>
                  </Col>
                )}
              </>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary"/>
              </SpinnerWrapper>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div
            onClick={this.confirmModalClose}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>{this.props.from_page == "outhospital_delete" ? "閉じる" : "キャンセル"}</span>
          </div>
          {(this.props.only_close_btn != true && this.props.modal_data.is_enabled == 1) && (
            <>
              {((modal_data.order_data.order_data.state !== 2) && (!(this.reception_disable || this.done_disable))) && (
                <>
                  {this.can_done ? (
                    <div id="system_confirm_Ok" className={"custom-modal-btn red-btn"} onClick={this.openConfirm} style={{cursor:"pointer"}}>
                      <span>{this.props.reception_or_done == "done" ? "実施":"受付"}</span>
                    </div>
                  ):(
                    <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                      <div id="system_confirm_Ok" className={"custom-modal-btn disable-btn"} style={{cursor:"pointer"}}>
                        <span>{this.props.reception_or_done == "done" ? "実施":"受付"}</span>
                      </div>
                    </OverlayTrigger>
                  )}
                </>
              )}
            </>
          )}
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title= {this.state.confirm_title}
            waring_message= {this.state.waring_message}
          />
        )}
        {this.state.doctors !== undefined && this.context.needSelectDoctor && (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.state.doctors}
          />
        )}
        {this.state.isOpenInspectionImageModal && (
          <EndoscopeImageModal
            closeModal={this.closeInspectionModal}
            imgBase64={this.state.endoscope_image}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmAlertCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title= {this.state.alert_title}
          />
        )}
        {this.state.isBodyPartOpen && (
          <BodyPartsPanel
            bodyPartData={this.state.body_part_json}
            closeBodyParts={this.confirmCancel}
            usageName={(modal_data.order_data.order_data.inspection_id != null && modal_data.order_data.order_data.inspection_id !== undefined) ? getInspectionName(modal_data.order_data.order_data.inspection_id) : "生理"}
            body_part={this.state.done_body_part}
            bodyPartConfirm={this.setBodyPart}
          />
        )}
        {this.state.check_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </Modal>
    );
  }
}

InspectionDoneModal.contextType = Context;
InspectionDoneModal.propTypes = {
  closeModal: PropTypes.func,
  modal_type: PropTypes.string,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  only_close_btn: PropTypes.bool,
  reception_or_done: PropTypes.string,
  from_page: PropTypes.string,
  patientId: PropTypes.number,
  doneInspection: PropTypes.func,
  handleNotDoneOk:PropTypes.func,
};
export default InspectionDoneModal;
