import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { WEEKDAYS, getVisitPlaceNameForModal } from "~/helpers/constants";
import {
  surface,
  secondary200,
  midEmphasis,
  disable
} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import {formatJapanDateSlash} from "~/helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import Checkbox from "~/components/molecules/Checkbox";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CytologyExamOrderData from "../Patient/Modals/Examination/CytologyExamOrderData";
import {CACHE_SESSIONNAMES, EXAM_DONE_STATUS, EXAM_STATUS_OPTIONS} from "~/helpers/constants";
import {getAutoReloadInfo} from "../../../helpers/constants";
import renderHTML from 'react-render-html';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import {setDateColorClassName} from "~/helpers/dialConstants";
import DatePicker from "react-datepicker";

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;
const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  .content{
    height: 100%;
    font-size: 1rem;
  }
  .selected {
    background: lightblue;
  }
  .input-area {
    width:40%;
    padding-top:15px;
    padding-left:1rem;
    .shoot-condition-area{
      max-height:21.5rem;
      overflow-y : auto;
      .row-title{
        text-align:left;
        padding-left:5px;
        padding-top: 5px;
      }
    }
    .sub-title{
      text-align:left;            
    }
    .one-row{
      margin-top:0.5rem;
    }
    .title-label{
      width:40px;
      text-align:left;
    }
    .blog{
      margin-top:1rem
    }
    .clear-button {    
      min-width: 30px !important;
      height: 30px !important;
      width: 30px !important;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      padding: 0 !important;
      margin-left:0.5rem;
      span{
        color:black;     
        font-size: 16px !important;   
      }
    }
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
  .done-checkbox{
    label{
      font-size:0.75rem;
    }
    input{
      height:1rem!important;
      width:1rem!important;
    }
  }
 `;


const Col = styled.div`
  width: 100%;
  height: 100%;
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
    font-size: 1rem;
    padding-right: 8px;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 1rem;
    padding-right: 8px;
  }
  .order{
    display: block !important;
  }
  .data-list{
    background-color: ${surface};
    height: calc(100% - 2.5rem);
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
  .comment-area {
    textarea{
      min-height: 10rem;
    }
  }
`;


const MedicineListWrapper = styled.div`
  font-size:${props=>(props.font_props != undefined?1 * props.font_props + 'rem':'1rem')};
  height: calc(100% - 6rem);  
  .history-item {
    height: 100%;
    overflow-y: auto;
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
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 8.5rem;
    }    

    .text-left{
      .table-item{
        width: 7.375rem;
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
    border-right: 1px solid ${disable};
    border-left: 1px solid ${disable};
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
    width: calc(100% - 35px);
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
const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
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
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;


const ContextMenu = ({ visible, x, y, parent,}) => {
  if (visible) {
    let back_state_options = parent.state.back_state_options;
    if (back_state_options.length == 0 ) return  null;
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {back_state_options.map(item=>{
            return (
              <li key={item} onClick={() => parent.contextMenuAction("state_change", item)}><div>{item.menu_title}</div></li>
            )
          })}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class ExaminationDoneModal extends Component {
  constructor(props) {
    super(props);
    let department_data = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.departmentOptions = [];
    if(department_data.length > 0){
      department_data.map(department=>{
        this.departmentOptions[department['id']] = department['value'];
      })
    }
    let order_data = undefined;
    let back_state_options = [];
    if(this.props.from_page == "soap"){
      order_data = JSON.parse(JSON.stringify(this.props.modal_data.data.order_data.order_data));
      // back_state_options = this.getBackStates(this.props.modal_data.data.done_order);
    } else {
      order_data = JSON.parse(JSON.stringify(this.props.modal_data.order_data.order_data));
      // back_state_options = this.getBackStates(this.props.modal_data.done_order);
    }
    this.mark_color = "";
    this.urgent_color = "";
    if (this.props.last_url != "") {
      let auto_reload_page = "examination_" + this.props.last_url;
      let auto_reload_data = getAutoReloadInfo(auto_reload_page);
      this.mark_color = auto_reload_data.mark_color != undefined ? auto_reload_data.mark_color : "";
      this.urgent_color = auto_reload_data.urgent_color != undefined ? auto_reload_data.urgent_color : "";
    }
    this.done_numbers = null;
    let show_done_modal = true;
    if (this.props.from_page === "soap" && order_data.administrate_period !== undefined && order_data.administrate_period.done_numbers !== undefined) {
      this.done_numbers = order_data.administrate_period.done_numbers;
      show_done_modal = false;
    }
    this.state = {
      modal_data: JSON.parse(JSON.stringify(this.props.modal_data)),
      order_data,
      confirm_message: "",
      alert_message:'',
      alert_title:'',
      waring_message:'',
      back_state_options,
      show_done_modal,
    };
    this.change_flag = 0;

    // YJ482 検体検査の注目マークの文字に何を使うかは動的にする
    let examination_attention_mark = "";
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.examination_attention_mark !== undefined && initState.conf_data.examination_attention_mark != ""){
        examination_attention_mark = initState.conf_data.examination_attention_mark;
      }
      if(this.props.from_page == "soap"){
        this.mark_color = initState.conf_data.examination_mark_color != undefined ? initState.conf_data.examination_mark_color : "";
        this.urgent_color = initState.conf_data.examination_urgent_color != undefined ? initState.conf_data.examination_urgent_color : "";
      }
    }
    this.examination_attention_mark = examination_attention_mark;
    this.can_done = true;
  }

  async componentDidMount() {
    this.can_done = this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.DONE_OREDER);
    await this.getDoctorsList();
    let back_state_options = [];
    if(this.props.from_page == "soap"){
      back_state_options = this.getBackStates(this.props.modal_data.data.done_order);
    } else {
      back_state_options = this.getBackStates(this.props.modal_data.done_order);
    }
    this.setState({back_state_options})
  }
  
  getBackStates = (done_order) => {
    let back_state_options = [];
    if (done_order == EXAM_DONE_STATUS.COLLECTION_WAIT) {
      if (this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.EDIT_ORDER_STATE)) {
        back_state_options.push({
          action: "not_reception",
          to_done_order: EXAM_DONE_STATUS.NOT_RECEPTION,
          menu_title: "未受付に戻す",
          confirm_message: "このオーダーを採取未受付に戻しますか？",
          alert_message: "採取未受付に変更しました。",
        });
      }
    } else if (done_order == EXAM_DONE_STATUS.COLLECTION_DONE) {
      if (this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.EDIT_ORDER_STATE)) {
        back_state_options.push({
          action:"not_reception",
          to_done_order: EXAM_DONE_STATUS.NOT_RECEPTION,
          menu_title:"未受付に戻す",
          confirm_message: "このオーダーを採取未受付に戻しますか？",
          waring_message: "※ 不実施指定や採取実施コメントも消去されます。",
          alert_message: "採取未受付に変更しました。"
        });
        back_state_options.push({
          action:"collection_wait",
          to_done_order: EXAM_DONE_STATUS.COLLECTION_WAIT,
          menu_title:"採取待ちに戻す",
          confirm_message: "このオーダーを採取待ちに戻しますか？",
          waring_message: "※ 不実施指定や採取実施コメントも消去されます。",
          alert_message: "採取待ちに変更しました。"
        });
      }
    } else if (done_order == EXAM_DONE_STATUS.RECEPTION_DONE) {
      if (this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.EDIT_ORDER_STATE)) {
        back_state_options.push({
          action: "not_reception",
          to_done_order: EXAM_DONE_STATUS.NOT_RECEPTION,
          menu_title: "採取未受付に戻す",
          confirm_message: "このオーダーを採取未受付に戻しますか？",
          waring_message: "※ 不実施指定や採取実施コメントも消去されます。",
          alert_message: "採取未受付に変更しました。"
        });
        back_state_options.push({
          action: "collection_wait",
          to_done_order: EXAM_DONE_STATUS.COLLECTION_WAIT,
          menu_title: "採取待ちに戻す",
          confirm_message: "このオーダーを採取待ちに戻しますか？",
          waring_message: "※ 不実施指定や採取実施コメントも消去されます。",
          alert_message: "採取待ちに変更しました。"
        });
        back_state_options.push({
          action: "collect_done",
          to_done_order: EXAM_DONE_STATUS.COLLECTION_DONE,
          menu_title: "検査未受付に戻す",
          confirm_message: "このオーダーを採取済み(検査未受付)に戻しますか？",
          alert_message: "採取済みに変更しました。"
        });
      }
      if (this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.DONE_OREDER)) {
        back_state_options.push({
          action: "complete_done",
          to_done_order: EXAM_DONE_STATUS.COMPLETE_DONE,
          menu_title: "検査済みにする",
          confirm_message: "このオーダーを検査済みにしますか？",
          alert_message: "検査済みにしました。"
        });
      }
    } else if (done_order == EXAM_DONE_STATUS.COMPLETE_DONE) {
      if (this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.EDIT_ORDER_STATE)) {
        back_state_options.push({
          action: "not_reception",
          to_done_order: EXAM_DONE_STATUS.NOT_RECEPTION,
          menu_title: "採取未受付に戻す",
          confirm_message: "このオーダーを採取未受付に戻しますか？",
          waring_message: "※ 不実施指定や採取実施コメントも消去されます。",
          alert_message: "採取未受付に変更しました。"
        });
        back_state_options.push({
          action: "collection_wait",
          to_done_order: EXAM_DONE_STATUS.COLLECTION_WAIT,
          menu_title: "採取待ちに戻す",
          confirm_message: "このオーダーを採取待ちに戻しますか？",
          waring_message: "※ 不実施指定や採取実施コメントも消去されます。",
          alert_message: "採取待ちに変更しました。"
        });
        back_state_options.push({
          action: "collect_done",
          to_done_order: EXAM_DONE_STATUS.COLLECTION_DONE,
          menu_title: "検査未受付に戻す",
          confirm_message: "このオーダーを採取済み(検査未受付)に戻しますか？",
          alert_message: "採取済みに変更しました。"
        });
        back_state_options.push({
          action: "reception_done",
          menu_title: "検査受付済みに戻す",
          to_done_order: EXAM_DONE_STATUS.RECEPTION_DONE,
          confirm_message: "このオーダーを検査受付済み(検査未実施)に戻しますか？",
          alert_message: "検査受付済みに戻しました。"
        });
      }
    }
    return back_state_options;
  }

  doneData = async() => {
    let path = "/app/api/v2/order/orderComplete";
    let post_data = {
      type:"examination",
      number:this.props.from_page == "soap" ? this.props.modal_data.data.order_data.order_data.number : this.props.modal_data.order_data.order_data.number,
      done_status: this.props.done_status,
      order_data:this.state.order_data,
    };
    if (this.state.select_date_time !== undefined && this.state.select_date_time !== "") {
      post_data.date_time = this.state.select_date_time;
    }
    if (this.props.from_page !== "soap" && this.state.order_data.administrate_period !== undefined && this.state.order_data.administrate_period.done_numbers !== undefined && this.props.modal_data.cnt_index !== undefined) {
      post_data.cnt_index = this.props.modal_data.cnt_index;
      let date = this.props.modal_data.schedule_date;
      let time = this.state.order_data.administrate_period.done_numbers[date] !== undefined ? this.state.order_data.administrate_period.done_numbers[date][this.props.modal_data.cnt_index].time:"";
      post_data.date_time = date + " " + time;
    }
    if (this.state.confirm_done_time !== undefined) post_data.confirm_done_time = this.state.confirm_done_time;
    if (!(post_data.number > 0)) {
      post_data.number = this.props.modal_data.number;
    }
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          if (this.props.from_page == "soap" || this.props.from_page == "not_done_list") {
            this.setState({
              alert_message: "実施しました。",
              alert_action: "close",
              changed_done_order: res.done_order
            });
          } else {
            let alert_message = this.props.done_status != 'collect_done' ?'受け付けました。' : '実施しました。';
            let alert_title = this.props.done_status != 'collect_done' ?"受付完了" : "実施完了";
            this.setState({
              alert_message: alert_message,
              alert_title,
              alert_action: "close"
            });
          }
        }
      })
      .catch(() => {
      });
    // this.closeModal('change');
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
      strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 8)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      }else{
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 8)}`;
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

  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_title: "",
      confirm_action: "",
    });
  }

  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_action == "done")
      this.doneData();
    else if (this.state.confirm_action == "close")
      this.props.closeModal();
    else {
      this.changeState();
    }
  };

  openConfirm = () => {
    let order_data = this.state.order_data;
    let {modal_data} = this.props;
    let disable_status = false;
    let done_order;
    if (this.state.done_time_show && this.state.confirm_done_time === undefined) {
      this.setState({alert_message: "実施時間を設定を選択してください。"});
      return;
    }
    if(this.props.from_page == "soap"){
      // order_data = modal_data.data.order_data.order_data;
      done_order = modal_data.data.done_order;
    } else {
      // order_data = modal_data.order_data.order_data;
      order_data.doctor_name = modal_data.order_data.doctor_name;
      order_data.department_code = modal_data.order_data.department_code;
      done_order = modal_data.done_order;
    }
    if (this.props.from_page != 'soap') {
      if (this.props.done_status == 'collect_reception') {
        if (done_order > 0) disable_status = true;
      }
      else if (this.props.done_status == 'collect_done') {
        if (done_order == 3 || done_order == 1) disable_status = true;
      }
      else {
        if (done_order == 1) disable_status = true;
      }
    }
    if (disable_status) return;
    if (!this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.DONE_OREDER)){
      return;
    }
    var check_not_done_flag = false;
    if (order_data.examinations != undefined && order_data.examinations != null && order_data.examinations.length > 0){
      order_data.examinations.map(item => {
        if (item.not_done_flag == true) check_not_done_flag = true;
      })
    }
    if (order_data.free_instruction != undefined && order_data.free_instruction != null && order_data.free_instruction.length > 0){
      order_data.free_instruction.map(item => {
        if (item.not_done_flag == true) check_not_done_flag = true;
      })
    }
    if(check_not_done_flag == true && (order_data.done_comment == undefined || order_data.done_comment == null || order_data.done_comment == '')){
      this.setState({
        alert_message:'採取実施コメントに不実施理由を記入してください',
        alert_title:'エラー',
      })
      return;
    }
    let confirm_message = this.props.done_status != 'collect_done' ? '受け付けますか？' : "実施しますか？";
    let confirm_title = this.props.done_status != 'collect_done' ? '受付確認' : '実施確認';
    if (this.props.from_page == "soap" || this.props.from_page == "not_done_list") {
      confirm_message = "実施しますか？";
      confirm_title = '実施確認';
    }
    this.setState({
      confirm_message,
      confirm_title,
      confirm_action: "done"
    });
  };

  closeAlert = () => {
    if (this.state.alert_action == "close") {
      if(this.props.from_page == "soap") {
        this.props.doneInspection(this.props.modal_data.number, "exam-order", null, this.state.changed_done_order);
        this.props.closeModal();
      } else if (this.props.from_page == "not_done_list") {
        this.props.doneInspection();
      } else {
        this.props.closeModal("change");
      }
    } else if (this.state.alert_action === "change") {
      if (this.props.from_page == "soap") {
        this.props.doneInspection(this.props.modal_data.number, "exam-order", {done_order: this.state.select_back_state.to_done_order});
      } else if (this.props.from_page == "not_done_list") {
        this.props.doneInspection();
      } else {
        this.props.closeModal("change");
      }
    }
    this.setState({
        alert_message:'',
        alert_title:'',
        alert_action:'',
    });
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
      if (doctor.doctor_code === parseInt(id)) {
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

  getDoctorsList = async () => {
    let data = sessApi.getDoctorList();
    this.setState({ doctors: data });
  };

  getOrderTitleClassName = (done_order, karte_status_name) => {
    if (done_order == 0) {
      return karte_status_name =='入院・'? "_color_not_implemented_hospital" : "_color_not_implemented";
    }
    if (done_order == 1 || done_order == 4) {
      return karte_status_name =='入院・'? "_color_implemented_hospital" : "_color_implemented";
      
    }
    if (done_order == 2 || done_order == 3) {
      return karte_status_name =='入院・'? "_color_received_hospital" : "_color_received";      
    }
  }


  getInsuranceName = (_insuranceName) => {
    let result = "既定";

    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;

    return _insuranceName
  }

  selectCheckbox = (index, name, value) => {
    var order_data = this.state.order_data;    
    if (name == 'check_status'){
      order_data.examinations[index].not_done_flag = value;
      this.setState({order_data})
      this.change_flag = 1;
    }
  }
  
  selectfreeCheckbox = (index, name, value) => {
    var order_data = this.state.order_data;
    if (name == 'free_check_status'){
      order_data.free_instruction[index].not_done_flag = value;
      this.setState({order_data});
      this.change_flag = 1;
    }
  }

  getInputText = (name, e) => {
    this.done_comment_length = 200;
    if (e.target.value.length > this.done_comment_length){
      this.setState({alert_message:this.done_comment_overflow_message})
      return;
    }
    var order_data = this.state.order_data;
    order_data[name] = e.target.value;
    this.setState({order_data});
    this.change_flag = 1;
  }
  
  closeModal = (state = '') => {
    if (this.change_flag == 1) {
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_action:"close",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.props.closeModal(state);
  }
  
  handleClick = e => {
    if (!(this.state.back_state_options.length > 0)) return;
    if (e.type === "contextmenu") {
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
        .getElementById("done-order-modal")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("done-order-modal")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("done-order-modal").offsetLeft,
          y: e.clientY - document.getElementById("done-order-modal").offsetTop - 80,
        }
      });
    }
  }
  
  contextMenuAction = (act, item) => {
    if (act == "state_change") {
      this.setState({
        select_back_state: item,
        confirm_title: item.action == "complete_done" ? "登録確認" : "状態変更確認",
        confirm_message: item.confirm_message,
        confirm_action:act,
        waring_message: item.waring_message
      });
    }
  };
  
  changeState = async () => {
    let path = "/app/api/v2/order/examination/change_state";
    if (this.state.select_back_state === undefined) return ;
    let post_data = {
      type:"examination",
      number:this.props.from_page == "soap" ? this.props.modal_data.data.order_data.order_data.number : this.props.modal_data.order_data.order_data.number,
      done_status: this.props.done_status,
      order_data:this.state.order_data,
      to_done_order:this.state.select_back_state.to_done_order
    };
    if (this.props.modal_data.cnt_index !== undefined) post_data.cnt_index = this.props.modal_data.cnt_index;
    if (this.props.modal_data.schedule_date !== undefined) post_data.schedule_date = this.props.modal_data.schedule_date;
    
    if (!(post_data.number > 0)) {
      post_data.number = this.props.modal_data.number;
    }
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          if (this.props.from_page == "soap" || this.props.from_page == "not_done_list") {
            this.setState({alert_message: this.state.select_back_state.alert_message, alert_action: "change"});
          } else {
            let alert_message = this.state.select_back_state.alert_message;
            let alert_title = this.state.select_back_state.action == "complete_done" ? "登録完了" : "状態変更完了";
            this.setState({
              alert_message: alert_message,
              alert_title,
              alert_action: "close"
            });
          }
        }
      })
      .catch(() => {
      });
  }
  
  selectDoneTime = (value) => {
    this.setState({
      select_date_time: value,
      done_time_show: value !== "" && value.length < 12
    });
  }
  
  openDoneModal = () => {
    if (this.state.select_date_time === undefined) {
      this.setState({alert_message:"実施対象を選択してください。"});
      return;
    }
    this.setState({show_done_modal: true});
  }
  
  getDoneTime = (value) => {
    this.setState({confirm_done_time: value});
  }
  getEndDate = (value) => {
    this.setState({end_date: value});
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
    let { modal_data} = this.props;
    var order_data = this.state.order_data;
    let history = "";
    let exist_result = "";
    let done_order;
    if(this.props.from_page == "soap"){
      // order_data = modal_data.data.order_data.order_data;
      done_order = modal_data.data.done_order;
      history = modal_data.data.history;
    } else {
      // order_data = modal_data.order_data.order_data;
      order_data.doctor_name = modal_data.order_data.doctor_name;
      order_data.department_code = modal_data.order_data.department_code;
      done_order = modal_data.done_order;
      history = modal_data.history;
    }
    let karte_status_name = "外来・";
    if (order_data != undefined && order_data.karte_status != undefined) {
      karte_status_name = order_data.karte_status == 1 ? "外来・" : order_data.karte_status == 2 ? "訪問診療・" : order_data.karte_status == 3 ? "入院・" : "";
    }
    let button_title = '実施';
  
    let status_title = EXAM_STATUS_OPTIONS.NOT_RECEPTION;
    if (done_order == EXAM_DONE_STATUS.COLLECTION_WAIT) {
      status_title = EXAM_STATUS_OPTIONS.COLLECTION_WAIT;
    } else if (done_order == EXAM_DONE_STATUS.COLLECTION_DONE) {
      status_title = EXAM_STATUS_OPTIONS.COLLECTION_DONE;
    } else if (done_order == EXAM_DONE_STATUS.RECEPTION_DONE) {
      status_title = EXAM_STATUS_OPTIONS.RECEPTION_DONE;
    } else if (done_order == EXAM_DONE_STATUS.COMPLETE_DONE) {
      status_title = EXAM_STATUS_OPTIONS.COMPLETE_DONE;
    }
    if (exist_result == 1) status_title = EXAM_STATUS_OPTIONS.RESULT_DONE;
  
    if (order_data.in_out_state == 0) status_title = EXAM_STATUS_OPTIONS.OUT_RESULT_DONE;
    if (order_data.in_out_state == 1) status_title = EXAM_STATUS_OPTIONS.IN_RESULT_DONE;
    if (order_data.in_out_state == 2) status_title = EXAM_STATUS_OPTIONS.INOUT_RESULT_DONE;
    
    let disable_status = false;
    if (this.props.from_page != 'soap' && this.props.from_page != 'not_done_list') {
      if (this.props.done_status == 'collect_reception') {
        button_title = '採取受付';
        if (done_order > 0) disable_status = true;
      }
      else if (this.props.done_status == 'collect_done') {
        button_title = '採取完了';
        if (done_order == 3 || done_order == 1) disable_status = true;
      }
      else {
        button_title = '依頼受付';
        if (done_order == 1) disable_status = true;
      }
    }
    if(!this.can_done) disable_status = false;
    
    var can_done_flag = false;
    if (order_data != undefined && order_data.examination_type == 1 && this.props.page_title !== undefined && this.props.page_title != "" && this.props.page_title.includes('検体採取実施')  && done_order != 1 ) can_done_flag = true;
    return  (
      <Modal show={true} id="done-order-modal"  className={`custom-modal-sm exam-done-modal first-view-modal haruka-done-modal ${can_done_flag == true? "haruka-done-radiation-modal exam-done-big-modal":""}`}>
        <Modal.Header>
          <Modal.Title>{!this.state.show_done_modal ? "実施対象選択" : (this.props.only_close_btn != undefined ? '検体検査' : '検体検査実施')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!this.state.show_done_modal ? (
            <Wrapper>
              <div className="w-100 h-100" style={{padding: "2rem"}}>
                <div className="border w-100 h-100 p-2" style={{overflowY:"auto"}}>
                  {Object.keys(this.done_numbers).map(date_key=>{
                    let item = this.done_numbers[date_key];
                    return(
                      <>
                        {item.map((sub_item)=>{
                          if (sub_item.completed_at == "") {
                            let date_time = date_key + " " + sub_item.time;
                            return (
                              <div key={sub_item} className={this.state.select_date_time == date_time ? "selected w-100 text-left": "w-100 text-left"} style={{cursor: "pointer"}} onClick={this.selectDoneTime.bind(this, date_time)}>
                                {date_key}　{sub_item.time}
                              </div>
                            )
                          }
                        })}
                      </>
                    )
                  })}
                </div>
              </div>
            </Wrapper>
          ):(
            <Wrapper>
              <Col id="soap_list_wrapper">
                <Bar>
                  <div className='flex' style={{height:'100%'}}>
                    <div className="content" style={{width: can_done_flag == true?'60%':'100%'}}>
                      <div className="w-100 d-flex">
                        <div className="w-50 mb-2 time-area d-flex">
                          {this.state.done_time_show == true && (
                            <>
                              <div className="mr-2" style={{lineHeight: "2rem", width:"5rem", textAlign:"left"}}>実施時間</div>
                              <DatePickerBox>
                                <DatePicker
                                  selected={this.state.confirm_done_time}
                                  onChange={this.getDoneTime.bind(this)}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={5}
                                  dateFormat="HH:mm"
                                  timeFormat="HH:mm"
                                  timeCaption="時間"
                                />
                              </DatePickerBox>
                            </>
                          )}
                          {this.state.end_date !== undefined && (
                            <>
                              <div className="mr-2" style={{lineHeight: "2rem", width:"5rem", textAlign:"left"}}>終了日</div>
                              <DatePicker
                                selected={this.state.end_date}
                                onChange={this.getEndDate.bind(this)}
                                locale="ja"
                                dateFormat="yyyy/MM/dd"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dayClassName = {date => setDateColorClassName(date)}
                              />
                            </>
                          )}
                        </div>
                        <div className={'w-75 patient-info'}>
                          {modal_data.patient_number} : {modal_data.patient_name}
                        </div>
                      </div>
                      <div className="data-list" onContextMenu={(e)=>this.handleClick(e)}>
                        <div className={`data-title ${this.getOrderTitleClassName(done_order, karte_status_name)}`}>
                          <div className={'data-item'}>
                            <div className="flex justify-content">
                              <div className="note">【{karte_status_name}{order_data.modalName != undefined ? order_data.modalName : "検体検査"}】 {status_title}</div>
                              <div className="department text-right">{this.departmentOptions[order_data.department_code]}</div>
                            </div>
                            <div className="date">
                              {modal_data.treatment_datetime !== "" && modal_data.treatment_datetime !== undefined ? (
                                <>
                                  {modal_data.treatment_datetime.substr(0, 4)}/
                                  {modal_data.treatment_datetime.substr(5, 2)}/
                                  {modal_data.treatment_datetime.substr(8, 2)}
                                  ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                  {' '}{modal_data.treatment_datetime.substr(11, 8)}
                                </>
                              ) : (
                                <>
                                  {modal_data.created_at.substr(0, 4)}/
                                  {modal_data.created_at.substr(5, 2)}/
                                  {modal_data.created_at.substr(8, 2)}
                                  ({this.getWeekDay(modal_data.created_at.substr(0,10))})
                                  {' '}{modal_data.created_at.substr(11, 8)}
                                </>
                              )}
                            </div>
                          </div>
                          {history !== undefined && history !== null && history !== "" ? (
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(history.split(",").length-1, order_data.substitute_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                            </div>
                          ):(
                            <>
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, order_data.substitute_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                              </div>
                            </>
                          )}
                          <div className="doctor-name text-right low-title">
                            {this.getDoctorName(modal_data.is_doctor_consented, order_data.doctor_name)}
                          </div>
                          {order_data != undefined && order_data.visit_place_id != undefined && order_data.visit_place_id > 0 && (
                            <div className="doctor-name text-right low-title facility-border">
                              {getVisitPlaceNameForModal(order_data.visit_place_id)}
                            </div>
                          )}
                        </div>
                        <MedicineListWrapper>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">{order_data.administrate_period !== undefined && order_data.administrate_period != null ? "採取(予定)日時":"採取日時"}</div>
                                </div>
                                <div className="text-right">
                                  {order_data.administrate_period !== undefined && order_data.administrate_period != null ? (
                                    <div className="table-item remarks-comment">
                                      {order_data.administrate_period.done_days.length > 0 && order_data.administrate_period.done_days.map(item=>{
                                        return (
                                          <li key ={item}>{item}　{this.getExamDoneState(order_data.administrate_period.done_numbers, item)}</li>
                                        )
                                      })}
                                    </div>
                                  ):(
                                    <div className="table-item remarks-comment">{order_data.collected_date === "" ? "次回診察日" : order_data.collected_time === "" ? formatJapanDateSlash(order_data.collected_date) : formatJapanDateSlash(order_data.collected_date)+"  "+order_data.collected_time.substr(0,order_data.collected_time.length-3)}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{this.getInsuranceName(order_data.insurance_name)}</div>
                                </div>
                              </div>
                              {order_data.subject != undefined && order_data.subject != null && order_data.subject != '' && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">概要</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{order_data.subject}</div>
                                    </div>
                                  </div>
                                </>
                              )}
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">検査項目</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {order_data.examinations.map((item, index)=>{
                                      return (
                                        <>
                                          <div className='flex' style={this.mark_color != undefined && this.mark_color != "" && item.is_attention == 1 ? {backgroundColor:this.mark_color} : {margin:0}}>
                                            <div style={{margin:0, width:can_done_flag == true? '80%':'100%' }}>
                                              {item.is_attention != undefined && item.is_attention == 1? this.examination_attention_mark: ""}
                                              {can_done_flag != true && item.not_done_flag == true?'【不実施】':''}
                                              {item.urgent != undefined && item.urgent == 1? renderHTML("<span style='color:" + this.urgent_color + "'>【至急】</span>"): ""}
                                              {item.name}
                                            </div>
                                            {can_done_flag == true && (
                                              <>
                                                <div className='done-checkbox'>
                                                  <Checkbox
                                                    label="不実施"
                                                    getRadio={this.selectCheckbox.bind(this, index)}
                                                    value={item.not_done_flag}
                                                    name="check_status"
                                                  />
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                              {order_data.free_instruction != undefined && order_data.free_instruction.length > 0 && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">自由入力オーダー</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {order_data.free_instruction.map((item, index)=> {
                                          return (
                                            <>
                                              <div className='flex' style={this.mark_color != undefined && this.mark_color != "" && item.is_attention == 1 ? {backgroundColor:this.mark_color} : {}}>
                                                <div style={{margin:0, width:can_done_flag == true? '80%':'100%' }}>
                                                  {item.is_attention != undefined && item.is_attention == 1? this.examination_attention_mark: ""}
                                                  {can_done_flag != true && item.not_done_flag == true?'【不実施】':''}
                                                  {item.urgent != undefined && item.urgent == 1? renderHTML("<span style='color:" + this.urgent_color + "'>【至急】</span>"): ""}
                                                  {item.text}
                                                </div>
                                                {can_done_flag == true && (
                                                  <>
                                                    <div className='done-checkbox'>
                                                      <Checkbox
                                                        label="不実施"
                                                        getRadio={this.selectfreeCheckbox.bind(this, index)}
                                                        value={item.not_done_flag}
                                                        name="free_check_status"
                                                      />
                                                    </div>
                                                  </>
                                                )}
                                              </div>
                                            </>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              <CytologyExamOrderData cache_data={order_data} from_source="detail-modal"/>
                              {order_data.todayResult === 1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">当日結果説明</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">あり</div>
                                  </div>
                                </div>
                              )}
                              {order_data.order_comment !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">依頼コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {order_data.order_comment_urgent != undefined && order_data.order_comment_urgent == 1?renderHTML("<span style='color:" + this.urgent_color + "'>【至急】</span>"):""}
                                      {order_data.fax_report != undefined && order_data.fax_report == 1?"【FAX報告】":""}
                                      {order_data.order_comment}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {order_data.free_comment !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">フリーコメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{order_data.free_comment}</div>
                                  </div>
                                </div>
                              )}
                              {order_data.additions != undefined && Object.keys(order_data.additions).length > 0 && (
                                <>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">追加指示等</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {Object.keys(order_data.additions).map(addition=>{
                                          return (
                                            <>
                                              <p style={{padding:0}}>{order_data.additions[addition].name}</p>
                                            </>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {can_done_flag != true && order_data.done_comment !== undefined && order_data.done_comment !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">採取実施コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{order_data.done_comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </MedicineListWrapper>
                      </div>
                    </div>
                    {can_done_flag== true && (
                      <div className='input-area'>
                        <div className='blog comment-area'>
                          <div className='sub-title'>採取実施コメント</div>
                          <textarea disabled = {can_done_flag == true?false:true} value={order_data.done_comment} onChange={this.getInputText.bind(this, 'done_comment')}></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                </Bar>
              </Col>
            </Wrapper>
          )}
          
        </Modal.Body>
        <Modal.Footer>
          <div                 
            onClick={this.closeModal}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>{this.props.from_page == "outhospital_delete" ? "閉じる" : "キャンセル"}</span>
          </div>
          {!this.state.show_done_modal ? (
            <div onClick={this.openDoneModal.bind(this)} className="custom-modal-btn red-btn" style={{cursor:"pointer"}}>
              <span>確定</span>
            </div>
          ):(
            <>
              {order_data.is_done != 1 && this.props.only_close_btn != true && (
                <>
                  {this.can_done ? (
                    <div onClick={this.openConfirm.bind(this)} className={`${disable_status ? "custom-modal-btn disable-btn " : "custom-modal-btn red-btn"}`} style={{cursor:"pointer"}}>
                      <span>{button_title}</span>
                    </div>
                  ):(
                    <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                      <div className="disable-btn"><span>{button_title}</span></div>
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
            title = {this.state.confirm_title}
            waring_message = {this.state.waring_message}
          />
        )}
        {this.state.alert_message != '' && (
          <SystemAlertModal
            hideModal= {this.closeAlert}
            handleOk= {this.closeAlert}
            title = {this.state.alert_title}
            showTitle = {true}
            showMedicineContent= {this.state.alert_message}
          />
        )}
        {this.state.doctors != undefined && this.context.needSelectDoctor === true ? (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.state.doctors}
          />
        ) : (
          ""
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
      </Modal>
    );
  }
}

ExaminationDoneModal.contextType = Context;

ExaminationDoneModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  from_page: PropTypes.string,
  done_status: PropTypes.string,
  patientId: PropTypes.number,
  doneInspection: PropTypes.func,
  only_close_btn: PropTypes.string,
  page_title: PropTypes.string,
  last_url: PropTypes.string,
};

export default ExaminationDoneModal;