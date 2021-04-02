import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import RadioButton from "~/components/molecules/RadioInlineButton";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import MoveList from "~/components/molecules/MoveList";
import AttentionModal from "~/components/templates/Dial/modals/AttentionModal";
import {formatDateLine} from "~/helpers/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import SamePatientAlertModal from "~/components/molecules/SamePatientAlertModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code, makeList_codeName,makeList_data, textareaBreakStr, getJapanYearFromDate, JapanDateBorder, getJapanYearNameFromDate, JapanYearBorder,JapnaYearMax} from "~/helpers/dialConstants";
import Context from "~/helpers/configureStore";
import $ from "jquery";
import PropTypes from "prop-types";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import DialSideBar from "~/components/templates/Dial/DialSideBar";
import { getPatientValidate } from "~/components/templates/Dial/DialMethods";
import NumberFormat from 'react-number-format';
import {getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  cursor: pointer;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100vw - 390px);
  left: 200px;
  margin: 0px;
  height: 100%;
  float: left;
  overflow: auto;
  .title {
    margin-left: 0.625rem;
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .half_letter{
    ime-mode: active;
  }
  .disabled{
      opacity:0.5;
      cursor:unset;
      svg{
        cursor:unset;
      }
  }
  .others {
    position:absolute;
    right:1.25rem;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        margin-top: 0.3rem;
    }
    span {
        font-size: 1rem;
    }
  }
  .hankaku-eng-num-input {
      ime-mode: inactive;
      input{
        ime-mode: inactive;
      }
  }
  .input-readonly{
    pointer-events: none;
  }
  .plus_icon{
    font-size:0.9rem;
   }
 .calendar_icon{
    font-size:1.25rem;
    position: absolute;
    top: 1rem;
    left: 4.125rem;
    color: #6a676a;
}
  }
  .bodywrap {
      display: flex;
      height: calc(98vh - 8rem);
      overflow-y: auto;
  }
  .red_border{
    border:3px solid red;
    // border-color: red;
  }
  .footer {
      text-align: center;
      position: relative;
      display: flex;
      left: 0px;
      justify-content: flex-end;
      margin-top: 20px;
      margin-right: 1.85rem;
      button {
        text-align: center;
        border-radius: 0.25rem;
        background: rgb(105, 200, 225);
        border: none;
        margin-right: 0.25rem;
      }
      
      span {
        color: white;
        font-size: 1.25rem;
        font-weight: 100;
      }
  }
  .footer-buttons{
    margin-right: 1rem;
  }
  background-color: ${surface};
    button {
        margin-bottom: 0.625rem;
        margin-left: 0.625rem;
    }
    .id_input{
        display: flex;
        justify-content: center;
        label{
            text-align:right;
            font-size: 2rem;
            margin-top: 7px;
            line-height: 46px;
        }
        input{
          // width: 270px;
          width:20rem;
          font-size: 2rem;
          height: 58px;
        }
        button {
          text-align: center;
          background: rgb(105, 200, 225);
          border: none;
          height: 58px;
          margin-top: 8px;
          margin-right: 0px;
          span{
            color: white;
            font-size: 2rem;
            font-weight: 100;
            line-height: 42px;
          }
        }
        button:last-child{
          margin-left: 5px;
        }

        button:hover {
          background: rgb(38, 159, 191);
        }
    }
    .first-input-step{
        margin-top: 34vh;
        height: 15vh;
        text-align: center;
        width: 100%;
        margin-left: 0px;
        p{
          font-size: 1.5rem;
        }
    }
    label {
        font-size: 1rem;
    }

    .address-01{
      display: flex;
      justify-content: space-between;
      input{
        width: 9rem;
        margin-right:0.5rem;
        line-height: 2.5rem;
        height: 2.5rem;
      }
      button{
        width: 8rem;
        margin: 0px;
        padding: 4px 8px;
        height: 2.5rem;
        margin-top: 8px;
        span{
          font-size: 0.85rem;
        }
      }
      .label-title{
        margin-right: 0.425rem;
        padding-right: 3px;
      }
    }
    .disable-button {
      background: rgb(101, 114, 117);
		  cursor: auto;
    }
    .required_field {
      background-color: #eeffee;
    }
  .half_letter{
      ime-mode: active;
    }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: calc(33vw - 130px);
  height: 100%;
  padding: 1.25rem 0.825rem;
  float: left;
  
  label {
      text-align: right;
  }
  textarea {
      width: 100%;
  }
  .half_letter{
    ime-mode: active;
  }
  .flex{
      display:flex;
  }
  .div-group-1{
    width: 75%;
    float: left
    display: flex;
  }
  .div-group-2{
    width: 25%;
    display: flex;
    .pullbox{
      width: 100%;
    }
    .pullbox-title{
      width: 0px !important;
    }
    .pullbox-label{
      width: 100% !important;
    }
  }
  .icon-datepicker{
      width:0px;
      height: 2.5rem;
      line-height: 2.5rem;
      svg{
        position: relative;
        top: 0px;
      }
  }
  .add_area{
      cursor:pointer;
  }
  .gender, .select_calendar {
    font-size: 1rem;
      margin-top: 0.3rem;
      .gender-label {
          width: 7.5rem;
          float: left;
      }
      .radio-btn label{
            width: 3.7rem;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 0.25rem;
            margin-left: 0.3rem;
            font-size:0.75rem;
        }
    }
    .edit_disabled{
        background-color: lightgray;
    }
  .blood {
      margin-top: 0.3rem;
      font-size: 1rem;
      .gender-label {
          width: 7.5rem;
      }
      .radio-btn label{
            width: 2.5rem;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 0.25rem;
            margin-left: 0.3rem;
            font-size:0.75rem;
        }
    }
    .react-datepicker-wrapper {
        width: auto;
       .react-datepicker__input-container {
           width: 100%;
           input {
                font-size: 1rem;
                width: 100%;
                height: 2.5rem;
                border-radius: 0.25rem;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 0.5rem;
           }
       }
    }
  }

  .datepicker-style{
    .react-datepicker-wrapper {
      width: calc(100% - 7.5rem) !important;
    }
  }

  .checkbox-label{
    width: 6rem;
    margin-right: 1rem;
  }
  .move-list {
      width: 100%;
      height: auto;
      .move-period {
          width: 50%;
      }
      .move-note {
          width: 30%;
      }
      .attention .attention-note{
        text-align: left;
      }
      .attention-note {
          width: calc(100% - 6.25rem);
      }
      .move-times {
          width: 20%;
      }
      .attention-times {
          width: 6.25rem;
      }
      .move-list-title {
        display: flex;
        text-align: center;
      }
      .move-log {
        display: flex;
        width: 100%;
        text-align: center;
      }
      thead{
        display: table;
        width:100%;
        margin-bottom: 0;
        border:none;
        tr{
          width:calc(100% - 17px);
        }
      }
    .attention-area{
      width:calc(100% - 17px);
      display: flex;
    }
    tbody{
      height: calc(20vh - 35px);
      overflow-y:scroll;
      display:block;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;
    }
    td {
        padding: 0.25rem;
        text-align: left;
        word-break: break-all;
        text-align: center;
        border:none;
    }
    th {
        text-align: center;
        padding: 0.3rem;
        border:none;
    }
  }
  textarea{
      width: 100%;
      height: 18%;
  }
  .tall {
    margin-left: 0.3rem;
    margin-top: 1rem;
  }
  .tall-input {
      display: flex;
      input{
        ime-mode: inactive;
      }
      margin-top:8px;
  }
  .tall-div-input{
    input{
      width: 7rem !important;
    }
  }
  .number-input-area {
    .tall-title {
      width: 7.5rem;
      margin-right: 0.625rem;
      line-height: 2.5rem;
    }
    .value-area {
      width:calc(100% - 7.5rem);
    }
    .dial_count-title {
      width: 7.5rem;
      margin-right: 0.625rem;
      line-height: 2.5rem;
    }
    input {
      font-size: 14px;
      width: 8rem;
      height: 2.5rem;
      border-radius: 4px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      padding: 0px 8px;
      text-align:right;
    }
    .tall {
      margin-top: 0;
      line-height: 2.5rem;
    }
  }
  .wheel{
    .checkbox-label{
      width: 7.5rem;
      margin-right: 0.625rem;
    }
    input{
      top: 2px;
    }
  }
  .dm-checkbox{
    .checkbox-label{
      width: 7.5rem;
      margin-right: 0.625rem;
    }
    input{
      top: 2px;
    }
  }
  .comment {
    display: inline-block;
    width: 100%;
    margin-bottom: 1.25rem;
    textarea {
        height: 20vh;
    }
  }
  .birthday_area{
    width: 28rem;
      .react-datepicker-wrapper{
        display: none !important;
      }
      height: 2.5rem;
      span{
        margin-right: 0.3rem;
        margin-left: 0.3rem;
      }
      .label-title{
        text-align: right;
        width: 7.5rem;
        margin-right: 0.425rem;
      }
      .pullbox-select{
          width:4.375rem;
      }
      .month_day{
        .pullbox-select{
            width:100%;
        }
        .label-title{
            display:none;
        }
          label {
            width: 3.7rem;
          }
      }
      label {
        width: 5rem;
      }
      .calendar_icon {
        left: 6.25rem;
      }
      .left-label-height{
        margin-top: 0px !important;
        height: 2.5rem;
      }
      .red_border select{
        height: 2.1rem;
      }
      input{
        width: 4rem;
      }
      label{
        width: 0px;
      }
      .pullbox{
        margin-top: 0px;
        margin-right: 0.425rem;
        height: 2.5rem;
        .label-title {
          width:0;
          margin:0;
        }
        .pullbox-label {
          margin: 0;
          width: 6rem;
        }
      }
      .input-year {
        display:flex;
        div {margin:0;}
        .label-title {
          width:0;
          margin:0;
        }
        .short-year-input{
          width:3rem!important;
        }
      }
      .input-month {
        display:flex;
        div {margin:0;}
        .label-title {width:0;}
        input {
          width: 3rem;
          // padding-left:0.1rem;
          // padding-right:0.1rem;
        }
      }
      .input-date {
        display:flex;
        div {margin:0;}
        .label-title {width:0;}
        input {
          width: 3rem;
        }
      }
  }
  .pullbox{
      margin-top:8px;
        .pullbox-title{
            font-size:1rem;
        }
  }
  .label-title{
    text-align: right;
    width: 7.5rem;
    margin-right: 0.625rem;
  }
  .pullbox-label {
    width: calc(100% - 7.5rem);
    .pullbox-select{
        width:100%;
    }
    }
  .select_calendar{
      margin-left:0;
      .radio-btn{
          width:30%;
          label{
              width:100%;
              margin-left:0.3rem;
          }
          font-size:1rem;
      }
      .label-title{
          display:none!important;
      }
  }
  .birth-label{
      width:7.5rem;
  }
  .pullbox{
      .label-title{
          width:7.5rem;
      }
      .pullbox-label{
        margin-bottom: 0px;
      }
  }
  .input_tag {
    width: calc(100% - 7.5rem);
  }

  .attention-content{
    border-left: 1px solid #ddd;
    width: calc(100% - 100px);
    float: left;
    white-space: pre;
    overflow-x: auto;
    overflow-y: auto;
    padding: 3px;
  }
  .attention-table{
    table{
      display: block;
    }
    .tr-div{
      border-bottom: 1px solid #ddd;
      display: flex;
    }
  }

  .label-title{
    text-align: right;
    width: 7.5rem;
    margin-right: 0.625rem;
    line-height: 2.5rem;
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 1rem;
    height: 2.5rem;
  }
  .ele-group{
    width: calc(100% - 7.5rem);
    height: 2.5rem;
    display: flex;
    label{
      height: 2.1rem;
      margin-left: 0px;
      margin-bottom: 3px;
      margin-top: 3px;
      line-height: 2.1rem;
      margin-left: 0.3rem;
    }
    .radio-btn:first-child label{
      margin-left: 0px;
    }

  }
  .outer-group{
    margin-top: 8px;
    display: flex;
    margin-bottom: 0px;
  }

  .left-label{
    text-align: right;
    width: 7.5rem;
    margin-right: 0.625rem;
    line-height: 2.5rem;
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 1rem;
    padding-top: 0px;
    height: 2.5rem;
  }
  .left-label-height{
    line-height: 2.5rem;
    margin-top: 8px;
  }
  .left-label-height-style{
    line-height: 2.5rem;
  }
  .right-field{
    width: calc(100% - 7.5rem);
  }

  //----------- scroll ----------
  .input-box-style-div, .area_patient_name_id, .area_kana_name_id, .mail-address, .datepicker-style, .input-year, .input-month, .input-date{
    label{
      height: 2.5rem !important;
      line-height: 2.5rem !important;
    }
    input{
      height: 2.5rem !important;
      line-height: 2.5rem;
    }
  }
  .pullbox{
    .label-title{
      height: 2.5rem;
      line-height: 2.5rem;
    }
    select{
      height: 2.5rem;
      line-height: 2.5rem;
    }
  }
  .outer-group{
    .left-label{
      height: 2.5rem;
      line-height: 2.5rem;
    }
  }
  .ele-group{
    height: 2.5rem;
    label{
      height: 2.1rem;
      line-height: 2.1rem;
    }
  }
  .first-area {
    .input_tag, .ele-group, .value-area {
      width: calc(100% - 5rem);
    }
    .label-title, .gender-label, .left-label, .tall-title{
      width: 5rem;
    }
  }
 `;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0 1.25rem;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
          <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_facility = ({ visible, x,  y,  parent,  kind}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.openSelectOtherFacility(kind)}>他施設マスタから引用</div></li>          
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const dial_master_patient_validate = getPatientValidate().dial_master_patient;
class PatientInfoEditBody extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.sidebarRef = React.createRef();
    this.state = {
      patient_number: "",
      patient_name: "",
      patient_kana_name: "",
      gender: 0,
      birthday: '',
      zip_code: "",
      address:'',
      building_name: "",
      tel_number: "",
      mobile_number: "",
      mail_address: "",
      blood_type: 4,
      RH: 2,
      tall: "",
      dial_start_date: "",
      hospital_start_date: "",
      moveflag: 0,
      move_date: "",
      move_reason: "",
      move_destination: "",
      primary_disease: 0,
      DM: 0,
      death_cause: 0,
      notice: "",
      hospitial_flag: 1,
      comment: "",
      dial_count_number:0,
      group: 0,
      group2: 0,
      wheel_chair:0,
      movelist: [],
      modal_data: {},
      attentionList: [],
      isMoveListModal: false,
      isAttentionModal: false,
      showConfirmDeleteMOdal:false,
      isDeleteConfirmModal: false,
      isOpenReplaceConfirmModal: false,
      isOpenNewPatientRegisterConfirm: false,
      isOpenRegisterConfirmModal: false,
      isSamePatientNameOpen: false,
      isOpenSelectPannelModal:false,
      data_list: [],
      calendar:1,
      delete_id: "",
      edit_flag:0,
      show_flag:0,
      search_patient_id:'',
      facility_id:0,
      facility_name:'',
      hos_facility:0,
      hospital_relocation_facility_name:'',
      prefecture:'',
      city:'',
      firstAddress: '',
      isConfirmComplete: false,
      occupation:0,
      isOpenMoveOtherPageConfirm:false,
      isClosePatientConfirm:false,
      alert_message: '',
      confirm_alert_title:'',
      japan_calendar_type:0,
      is_loaded:false,
    };
    this.registering_flag = false;
    this.disabled_year_id = null;
    this.name_typing_start = false;
    this.ex_kana_name = '';
    this.ctrl_flag = false;
    this.setChangeFlag(0);
    this.japan_calendar_list = [
      {id:0, value:''},
      {id:1,value:"令和"},
      {id:2,value:"平成"},
      {id:3,value:"昭和"},
      {id:4,value:"大正"},
      {id:5,value:"明治"},
    ];
    
    let path = window.location.href.split("/");
    path = path[path.length - 1];
    if (path == 'dial_new_patient') {
      this.new_register_page = true;
    } else {
      this.new_register_page = false;
    }
  }
  
  async componentDidMount(){
    await this.getOtherFacilitiesInfo();
    await this.handleRemoveClass("patient_name_id");
    await this.handleRemoveClass("kana_name_id");
    await this.handleRemoveClass('birth-type');
    await this.handleRemoveClass('birth-year');
    await this.handleRemoveClass('birth-month');
    await this.handleRemoveClass('birth-day');
    let server_time = await getServerTime();
    let japan_year_list = [];
    let standard_year_list = [];
    let month_list = [{id:0, value:''}];
    let day_list = [{id:0, value:''}];
    let i =0;
    let japan_year_name ='';
    for (i=1;i<=12;i++){
      month_list.push({id:i,value:i});
    }
    for (i =1;i<=31;i++){
      day_list.push({id:i,value:i});
    }
    let current_year = new Date(server_time).getFullYear();
    for (i=1867;i <= current_year; i++){
      standard_year_list.push({id:i,value:i});
      if (i <= 1912) {
        japan_year_name = "明治" + (i-1867).toString();
      } else if (i>1912 && i<1927){
        japan_year_name = "大正" + (i-1911).toString();
      } else if (i >=1927 && i<1990){
        japan_year_name = "昭和" + (i-1925).toString();
      } else if (i >= 1990 && i<=2019){
        japan_year_name = "平成" + (i-1988).toString();
      } else {
        japan_year_name = "令和" + (i-2018).toString();
      }
      japan_year_list.push({id:i, value:japan_year_name});
      switch(i){
        case 1912:
          japan_year_name = '大正元';
          japan_year_list.push({id:1912.5, value:japan_year_name});
          break;
        case 1926:
          japan_year_name = '昭和元';
          japan_year_list.push({id:1926.5, value:japan_year_name});
          break;
        case 1989:
          japan_year_name = '平成元';
          japan_year_list.push({id:1989.5, value:japan_year_name});
          break;
        case 2019:
          japan_year_name = '令和元';
          japan_year_list.push({id:2019.5, value:japan_year_name});
          break;
      }
    }
    standard_year_list.reverse();
    standard_year_list.unshift({id:0, value:''});
    japan_year_list.reverse();
    japan_year_list.unshift({id:0, value:''});
    let birth_year = this.state.birth_year;
    let year_birth_id = this.state.year_birth_id;
    let birth_month = this.state.birth_month;
    let birth_day = this.state.birth_day;
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    
    this.setState({
      day_list,
      month_list,
      standard_year_list,
      japan_year_list,
      birth_year,
      year_birth_id,
      birth_month,
      birth_day,
      primary_disease_codes: makeList_code(code_master['原疾患'], 1),
      primary_disease_codes_options: makeList_codeName(code_master['原疾患'], 1),
      death_cause_codes: makeList_code(code_master['死亡原因'], 1),
      death_cause_codes_options: makeList_codeName(code_master['死亡原因'], 1),
      occupation_codes: makeList_code(code_master['職業'], 1),
      occupation_codes_options: makeList_codeName(code_master['職業'], 1),
      dial_group_codes: makeList_code(code_master['グループ'], 1),
      dial_group_codes_options: makeList_codeName(code_master['グループ'], 1),
      dial_group_codes2: makeList_code(code_master['グループ2'], 1),
      dial_group_codes2_options: makeList_codeName(code_master['グループ2'], 1),
      isSearchAddress: false,
      is_loaded: (this.props.patientInfo == undefined || this.props.patientInfo == null) ? true : false,
    });
    $(".birth-label .alert-span").remove();
    var id_input_box = document.getElementsByClassName('patient-id-input');    
    if (id_input_box != undefined && id_input_box[0] != undefined && id_input_box[0] != null){
      id_input_box[0].focus();
    }
    this.changeBackground();
    if(this.props.patientInfo != undefined && this.props.patientInfo != null){      
      await this.selectPatient(this.props.patientInfo);
    }
  }
  
  reset = () => {
    let birth_year = '';
    let year_birth_id = 0;
    let birth_month = '';
    let birth_day = '';
    this.setState({
      patient_number: "",
      patient_name: "",
      patient_kana_name: "",
      gender: 0,
      birthday: '',
      zip_code: "",
      address:'',
      building_name: "",
      tel_number: "",
      mobile_number: "",
      mail_address: "",
      firstAddress: "",
      blood_type: 4,
      RH: 2,
      tall: "",
      dial_start_date: "",
      hospital_start_date: "",
      moveflag: 0,
      move_date: "",
      move_reason: "",
      move_destination: "",
      primary_disease: 0,
      DM: 0,
      death_cause: 0,
      notice: "",
      hospitial_flag: 1,
      comment: "",
      dial_count_number:0,
      group: 0,
      group2: 0,
      wheel_chair:0,
      movelist: [],
      attentionList: [],
      isMoveListModal: false,
      isAttentionModal: false,
      edit_flag:0,
      show_flag:0,
      search_patient_id:'',
      facility_id:0,
      facility_name:'',
      hos_facility:0,
      hospital_relocation_facility_name:'',
      prefecture:'',
      city:'',
      birth_year:birth_year,
      year_birth_id,
      birth_month:birth_month,
      birth_day:birth_day,
      calendar:1,
      occupation:0,
      isSearchAddress: false, // true => 郵便番号:住所1 check confirm replace
      japan_calendar_type:0,
    }, () => {
      $('#patient_number_id').focus();
    });
  }
  
  getOtherFacilitiesInfo = async()=> {
    let path = "/app/api/v2/dial/master/getOtherFacilitiesOrder";
    await apiClient._post(path, {params:{
          order:'sort_number'
        }})
      .then(res => {
        if (res != null && res.length > 0){
          this.setState({
            otherfacilities:res,
            otherfacilities_options:makeList_data(res),
          })
        } else{
          this.setState({
            otherfacilities:undefined,
            otherfacilities_options:undefined,
          })
        }
      })
      .catch(()=> {
        this.setState({
          otherfacilities:undefined,
          otherfacilities_options:undefined,
        })
      })
  }
  
  async getAddressFromPost(zip_code){
    let path = "/app/api/v2/dial/patient/getAddress";
    const post_data = {
      post_number:zip_code
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          let last_address = "";
          let all_address = "";
          if (res.address != undefined && res.address != null) {
            last_address = (res.address != undefined && res.address != null) ? res.address : "";
            all_address = res.prefecture + " " + res.city + " " + last_address;
          }
          if (all_address != "") {
            if (this.state.isSearchAddress == true && this.state.firstAddress != "" && this.state.firstAddress != all_address) {
              let new_address = "住所1を「" + all_address + "」で上書きして良いですか？";
              this.setState({
                isOpenReplaceConfirmModal : true,
                confirm_message: new_address,
                prefecture : res.prefecture,
                city : res.city,
                address : last_address,
                isSearchAddress: false
              });
            } else {
              this.setState({
                prefecture : res.prefecture,
                city : res.city,
                address : last_address,
                firstAddress: all_address,
                isSearchAddress: false
              });
              $('#address_2_id').focus();
            }
          } else {
            if (this.state.isSearchAddress == true) {
              this.setCursorPositionByClass('post_number_id', this.state.zip_code.length);
              window.sessionStorage.setItem("alert_messages", "郵便番号に合う住所が見つかりませんでした");
              // $('.address-01 input').focus();
            }
            
            this.setState({
              isSearchAddress: false
            });
          }
        } else{
          this.setState({
            isSearchAddress: false
          });
        }
        
      })
      .catch(() => {
      
      });
  }
  
  setCursorPositionByClass =(elemId, caretPos)=> {
    var elem = document.getElementById(elemId)
    var range;
    if(elem != null) {
      if(elem.createTextRange) {
        range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        elem.focus();
        if(elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  }
  
  getAddress = e =>{
    this.getAddressFromPost(e.target.value);
  }
  
  zenkakuToHankaku = (mae) => {
    let zen = new Array(
      'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ'
      ,'サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト'
      ,'ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ'
      ,'マ','ミ','ム','メ','モ','ヤ','ヰ','ユ','ヱ','ヨ'
      ,'ラ','リ','ル','レ','ロ','ワ','ヲ','ン'
      ,'ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ'
      ,'ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ'
      ,'パ','ピ','プ','ペ','ポ'
      ,'ァ','ィ','ゥ','ェ','ォ','ャ','ュ','ョ','ッ'
      ,'゛','°','、','。','「','」','ー','・',
    );
    let hirakana = new Array(
      'あ','い','う','え','お','か','き','く','け','こ'
      ,'さ','し','す','せ','そ','た','ち','つ','て','と'
      ,'な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ'
      ,'ま','み','む','め','も','や','い','ゆ','え','よ'
      ,'ら','り','る','れ','ろ','わ','を','ん'
      ,'が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ'
      ,'だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ'
      ,'ぱ','ぴ','ぷ','ぺ','ぽ'
      ,'ぁ','ぃ','ぅ','ぇ','ぉ','ゃ','ゅ','ょ','っ'
      ,'゛','°','、','。','「','」','ー','・',
    );
    
    let han = new Array(
      'ｱ','ｲ','ｳ','ｴ','ｵ','ｶ','ｷ','ｸ','ｹ','ｺ'
      ,'ｻ','ｼ','ｽ','ｾ','ｿ','ﾀ','ﾁ','ﾂ','ﾃ','ﾄ'
      ,'ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ'
      ,'ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ﾔ','ｲ','ﾕ','ｴ','ﾖ'
      ,'ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ｦ','ﾝ'
      ,'ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ','ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ'
      ,'ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ','ﾊﾞ','ﾋﾞ','ﾌﾞ','ﾍﾞ','ﾎﾞ'
      ,'ﾊﾟ','ﾋﾟ','ﾌﾟ','ﾍﾟ','ﾎﾟ'
      ,'ｧ','ｨ','ｩ','ｪ','ｫ','ｬ','ｭ','ｮ','ｯ'
      ,'ﾞ','ﾟ','､','｡','｢','｣','ｰ','･'
    );
    
    let ato = "";
    
    for (let i=0;i<mae.length;i++){
      let maechar = mae.charAt(i);
      let zenindex = zen.indexOf(maechar);
      let hindex = hirakana.indexOf(maechar);
      if(zenindex >= 0){
        maechar = han[zenindex];
      } else if(hindex >= 0) {
        maechar = han[hindex];
      }
      ato += maechar;
    }
    
    ato = ato.replace('　', ' ');
    
    return ato;
  }
  
  toHalfWidth = (strVal) => {
    // 半角変換
    var halfVal = strVal.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    
    return halfVal;
  }
  
  toHalfWidthOnlyNumber = (strVal) => {
    // 半角変換
    var halfVal = strVal.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    halfVal = halfVal.replace('ー','-');
    halfVal = halfVal.replace('。', '.');
    return halfVal;
  }
  
  getPatinetNumber = e => {
    if (e.target.value.length > 12) return;
    if (this.state.edit_flag == 1) return;
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    // this.setState({search_patient_id: this.toHalfWidthOnlyNumber(input_value)});
    let patient_number = input_value;
    var code = e.keyCode;
    if (code ===13 ) {
      e.preventDefault();
      if (patient_number == "") {
        if (this.new_register_page){
          window.sessionStorage.setItem("alert_messages", '登録する患者様の番号を入力してください。');
        } else {
          window.sessionStorage.setItem("alert_messages", '検索する患者様の番号を入力してください。');
        }
        return;
      }
      var converted_value = this.toHalfWidthOnlyNumber(patient_number);
      let nLength = converted_value.length;
      let strVal = "0000000";
      patient_number = strVal.substring(0, 7 - nLength) + converted_value;
      
      // let lastPatientRegisterFlag = sessApi.getObjectValue("dial_patient_master_method","register_patient");
      // if (lastPatientRegisterFlag == null || lastPatientRegisterFlag == undefined) {
      if (this.new_register_page){
        this.setState({
          search_patient_id: patient_number,
          patient_number: patient_number
        }, ()=>{
          this.handleRegisterPatient(patient_number);
        })
      } else {
        this.setState({
          search_patient_id: patient_number,
          patient_number: patient_number
        }, () => {
          this.searchPatientId(patient_number);
        })
      }
      
      // var converted_value = this.toHalfWidthOnlyNumber(patient_number);
      // let nLength = converted_value.length;
      // let strVal = "0000000";
      // patient_number = strVal.substring(0, 7 - nLength) + converted_value;
      // this.getPatientInfo(patient_number);
      // this.setState({search_patient_id: patient_number, patient_number});
    } else {
      this.setState({
        search_patient_id: this.toHalfWidthOnlyNumber(input_value),
        patient_number: this.toHalfWidthOnlyNumber(input_value)
      })
    }
  };
  
  getOccupation = e => {
    this.setChangeFlag(1);
    this.setState({occupation:e.target.id});
  };
  
  getGroup = e => {
    this.setChangeFlag(1);
    this.setState({group:e.target.id});
  };
  
  getGroup2 = e => {
    this.setChangeFlag(1);
    this.setState({group2:e.target.id});
  };
  
  selectFacility = e => {
    this.setChangeFlag(1);
    this.setState({facility_id:e.target.id});
  };

  selectFacilityFromModal = (data) => {
    this.closeModal();
    if (this.state.selected_facility_kind == 'facility'){
      this.setState({facility_name:data.name});
      $('#facility_name_id').focus();
    } 
    if (this.state.selected_facility_kind == 'hospital'){
      this.setState({hospital_relocation_facility_name:data.name});
      $('#hospital_relocation_facility_name_id').focus();
    }
  }
  
  getHosFacility = e => {
    this.setChangeFlag(1);
    this.setState({hos_facility:e.target.id});
  };
  
  getPatinetName = e => {
    if (this.name_typing_start == false){
      this.ex_kana_name = this.state.patient_kana_name;
    }
    if(e.keyCode == 17) this.ctrl_flag = true;
    this.setState({
      patient_name : e.target.value,
    },()=>{
      if(this.state.patient_name == '') {
        this.handleAddClass_bg('patient_name_id')
      } else {
        this.handleRemoveClass_bg('patient_name_id')
      }
    });
    this.name_typing_start = true;
    this.setChangeFlag(1);
  };
  
  onKeyUpEvent = (e) => {
    if (this.ex_kana_name != undefined && this.ex_kana_name != null && this.ex_kana_name != '') {
      this.ctrl_flag = false;
      return;
    }
    var patient_kana_name = this.state.patient_kana_name;
    var input_value = e.target.value;
    input_value = input_value.split('　');
    var word_len = input_value.length;
    input_value = input_value[word_len-1];
    if (!(this.ctrl_flag) && e.keyCode != 32 && e.keyCode != 13){
      if (patient_kana_name == undefined || patient_kana_name == null || patient_kana_name == '') patient_kana_name = '';
      if (word_len == 1){
        if (this.checkExistSameLetter(this.zenkakuToHankaku(input_value), input_value) == false || input_value == '') patient_kana_name = this.zenkakuToHankaku(input_value);
      } else if (word_len > 1) {
        if (patient_kana_name != ''){
          patient_kana_name = patient_kana_name.split(' ');
          if(this.checkExistSameLetter(this.zenkakuToHankaku(input_value), input_value) == false || input_value == '') {
            patient_kana_name[word_len - 1] = this.zenkakuToHankaku(input_value);
          }
          patient_kana_name = patient_kana_name.join(' ');
        }
      }
      this.setState({
        patient_name:e.target.value,
        patient_kana_name,
      })
    }
    this.ctrl_flag = false;
  }
  
  checkExistSameLetter (first, second){
    if (first == undefined || first == null || first == '') return false;
    if (second == undefined || second == null || second == '') return false;
    if (first.length != second.length) return false;
    
    for (var i = 0; i < first.length; i++) {
      if (first[i] == second[i]) return true;
    }
    return false;
  }
  
  convertNametoKana = () => {
    this.name_typing_start = false;
    this.ex_kana_name = '';
    var patient_kana_name = this.state.patient_kana_name;
    this.setState({patient_kana_name:patient_kana_name.trim()})
  }
  
  getPatinetKanaName = e => {
    this.setChangeFlag(1);
    this.setState({patient_kana_name: e.target.value});
    
    var code = e.keyCode;
    if (code ===13 ) {
      var converted_kana_name = this.zenkakuToHankaku(e.target.value);
      this.setState({patient_kana_name: converted_kana_name}, ()=>{
        if(this.state.patient_kana_name == '') {
          this.handleAddClass_bg('kana_name_id')
        } else {
          this.handleRemoveClass_bg('kana_name_id')
        }
      });
    }
  };
  
  getHalfKana = e => {
    var converted_kana_name = this.zenkakuToHankaku(e.target.value);
    this.setState({patient_kana_name: converted_kana_name});
  }
  
  getMobilenumber = e => {
    let regx = /^[-ー]*[0-9０-９][-ー0-9０-９]*$/;
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    if (e.target.value.length > dial_master_patient_validate.mobile_number.length) return;
    this.setState({mobile_number: this.toHalfWidthOnlyNumber(e.target.value)})
    this.setChangeFlag(1);
  };
  
  insertStrZipCodeStyle=(input)=>{
    return input.slice(0, 3) + '-' + input.slice(3,input.length);
  }
  
  getPostNumber = e => {
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    input_value = this.toHalfWidthOnlyNumber(input_value);
    if(input_value.length >= 3 ){
      input_value = this.insertStrZipCodeStyle(input_value);
    }
    
    if (e.keyCode ===13 && input_value !=''){
      this.setFirstAddress(input_value);
    }
    
    if (input_value.length > dial_master_patient_validate.zip_code.length) return;
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 4){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 3){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }
    
    this.setState({zip_code: input_value}, () => {
      var obj = document.getElementById('post_number_id');
      if (key_code == 8){
        if (start_pos == end_pos && start_pos == 4 && input_value.length == 4){
          obj.setSelectionRange(start_pos - 1 , start_pos - 1);
        }
      }
      if (key_code == 46){
        if (start_pos == end_pos && start_pos == 3 && input_value.length == 4){
          obj.setSelectionRange(start_pos + 1 , start_pos + 1);
        }
      }
      if (key_code == undefined && start_pos == end_pos){
        if (start_pos != 3 && start_pos != 4){
          obj.setSelectionRange(start_pos, start_pos);
        } else{
          if (start_pos == 3){
            obj.setSelectionRange(start_pos+1, start_pos+1);
          } else {    //start_pos == 4
            if (input_value.length == 4){
              obj.setSelectionRange(start_pos, start_pos);
            } else {
              obj.setSelectionRange(start_pos-1, start_pos-1);
            }
          }
        }
      }
    })
    
    this.setChangeFlag(1);
  };
  
  validateEmail = () => {
    let regx = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
    if (this.state.mail_address != "" && !regx.test(this.state.mail_address)) {
      return false;
    }
    return true;
  }
  
  getMailAddress = e => {
    this.setState({mail_address: e.target.value})
    this.setChangeFlag(1);
  };
  
  getAdress = e => {
    this.setState({address: e.target.value})
  };
  
  getMunicipalities = e => {
    this.setState({municipalities: e.target.value})
  };
  
  getBuilding = e => {
    this.setChangeFlag(1);
    this.setState({building_name: e.target.value})
  };
  
  getTelPhone = e => {
    // let regx = /^[- +()]*[0-9][- +()0-9]*$/;
    let regx = /^[-ー]*[0-9０-９][-ー0-9０-９]*$/;
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    if (e.target.value.length > dial_master_patient_validate.tel_number.length) return;
    
    this.setState({tel_number: this.toHalfWidthOnlyNumber(e.target.value)})
    this.setChangeFlag(1);
  };
  
  getTall = (value) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (value.value != "" && !RegExp.test(value.value)) {
      let cur_tall = this.state.tall;
      this.setState({tall: cur_tall}, ()=>{
        // this.setCaretPosition("tall_id", cur_tall.toString().length);
      });
      return;
    }
    if (value.value.length > dial_master_patient_validate.tall.length) {
      let cur_tall = this.state.tall;
      this.setState({tall: cur_tall}, ()=>{
        // this.setCaretPosition("tall_id", cur_tall.toString().length);
      });
      return;
    }
    var input_value = value.value;
    if (input_value != "") {
      input_value = (this.toHalfWidthOnlyNumber(input_value));
      if (input_value - Math.round(input_value) > 0) input_value = Math.round(input_value * 100) / 100;
    }
    this.setState({tall: input_value}, ()=>{
      // this.setCaretPosition("tall_id", input_value.toString().length);
    });
    this.setChangeFlag(1);
  };
  
  getNotice = e => {
    this.setChangeFlag(1);
    this.setState({notice: e.target.value})
  };
  
  getMoveDate = value => {
    this.setChangeFlag(1);
    this.setState({move_date: value})
  };
  
  getMoveDestination = e => {
    this.setChangeFlag(1);
    this.setState({move_destination: e.target.value})
  };
  
  getDeathCause = e => {
    this.setChangeFlag(1);
    this.setState({death_cause:e.target.id});
  };
  
  getMoveReason = e => {
    this.setChangeFlag(1);
    this.setState({move_reason: e.target.value})
  };
  
  getPrimaryDisease = e => {
    this.setChangeFlag(1);
    this.setState({primary_disease:e.target.id});
  };
  
  getDialStartDate = value => {
    this.setChangeFlag(1);
    this.setState({dial_start_date: value})
  };
  
  getHosStartDate = value => {
    this.setChangeFlag(1);
    this.setState({hospital_start_date: value})
  };
  
  getRadio = (name, value) => {
    this.setChangeFlag(1);
    if (name === "dm")
      this.setState({DM: value});
    if (name == 'wheel')
      this.setState({wheel_chair:value});
  };
  
  selectGender = (e) => {
    this.setChangeFlag(1);
    this.setState({ gender: parseInt(e.target.value)});
  };
  
  selectCalendar = (e) => {
    if (e.target.value == this.state.calendar) return;
    var birth_year = this.state.birth_year;
    var japan_calendar_type = this.state.japan_calendar_type;
    if (e.target.value == 1){
      if (birth_year > 0){
        if (this.state.japan_calendar_type > 0){
          birth_year = JapanYearBorder[japan_calendar_type] + birth_year -1;
        } else {
          birth_year = '';
        }
      } else {
        birth_year = '';
      }
    } else {
      if (birth_year>1867 && birth_year < 2200){
        var month =parseInt(this.state.birth_month)>0?parseInt(this.state.birth_month):1;
        var day = parseInt(this.state.birth_day) > 0 ? parseInt(this.state.birth_day):1;
        var date = new Date(birth_year.toString() + '-' +  this.formatMonthDate(month) + '-' + this.formatMonthDate(day));
        japan_calendar_type = getJapanYearNameFromDate(date);
        if (japan_calendar_type > 0){
          birth_year = birth_year - JapanYearBorder[japan_calendar_type] + 1;
        } else {
          birth_year = '';
        }
      } else {
        birth_year = '';
        japan_calendar_type = 0;
      }
    }
    this.setState({
      calendar: parseInt(e.target.value),
      birth_year,
      japan_calendar_type,
    }, () => {
      if (this.state.calendar == 0){
        $("#birth-year").addClass('short-year-input');
      } else {
        $("#birth-year").removeClass('short-year-input');
      }
      if ($("#birth-year").hasClass("red_border")) {
        this.handleAddClass('birth-type');
      } else {
        this.handleRemoveClass('birth-type');
      }
    });
  };
  
  selectMoveFlag = (e) => {
    this.setChangeFlag(1);
    this.setState({ moveflag: parseInt(e.target.value)});
  };
  
  selectBlood = (e) => {
    this.setChangeFlag(1);
    this.setState({ blood_type: parseInt(e.target.value)});
  };
  
  selectHospital = (e) => {
    this.setChangeFlag(1);
    this.setState({ hospitial_flag: parseInt(e.target.value)});
  };
  
  selectRh = (e) => {
    this.setChangeFlag(1);
    this.setState({ RH: parseInt(e.target.value)});
  };
  addMOveList = () => {
    if (this.state.edit_flag == 0 && this.state.show_flag) return;
    this.setState({isMoveListModal: true});
  };
  addAttention = () => {
    if (this.state.edit_flag == 0 && this.state.show_flag) return;
    this.setState({
      isAttentionModal: true,
      modal_data:{}
    });
  };
  formatMonthDate = value => {
    value = parseInt(value);
    if (value < 10) return "0" + value.toString();
    else return value.toString();
  }
  getBirthYear = e => {
    this.setChangeFlag(1);
    var birthday = '';
    var year_birth_id = e.target.id;
    if (e.target.id>0 && parseInt(this.state.birth_month) > 0 && this.state.birth_day){
      birthday = new Date(parseInt(e.target.id).toString() + '-' +  this.formatMonthDate(parseInt(this.state.birth_month)) + '-' + this.formatMonthDate(parseInt(this.state.birth_day)));
    }
    
    if (e.target.id> 0 && parseInt(this.state.birth_month) > 0){
      var year = parseInt(e.target.id);
      var month = parseInt(this.state.birth_month);
      var day = parseInt(this.state.birth_day) > 0?parseInt(this.state.birth_day):1;
      var date = new Date(year.toString() + '-' +  this.formatMonthDate(month) + '-' + this.formatMonthDate(day));
      
      year_birth_id = getJapanYearFromDate(date);
    }
    this.setState({
      birth_year:parseInt(e.target.id),
      year_birth_id,
      birthday,
    });
  }
  getBirthMonth = e => {
    this.setChangeFlag(1);
    var birthday = '';
    var year_birth_id = this.state.year_birth_id;
    if (this.state.birth_year>0 && e.target.id>0 && parseInt(this.state.birth_day)>0){
      birthday = new Date(this.state.birth_year.toString() + '-' +  this.formatMonthDate(e.target.id) + '-' + this.formatMonthDate(parseInt(this.state.birth_day)));
    }
    if (this.state.birth_year > 0 && e.target.id > 0){
      var day = parseInt(this.state.birth_day)>0?parseInt(this.state.birth_day):1;
      var date = new Date(this.state.birth_year.toString() + '-' +  this.formatMonthDate(e.target.id) + '-' + this.formatMonthDate(day));
      year_birth_id = getJapanYearFromDate(date);
    }
    this.setState({
      birth_month:e.target.id,
      birthday,
      year_birth_id,
    });
  }
  getBirth_day = e => {
    this.setChangeFlag(1);
    var birthday = '';
    var year_birth_id = this.state.year_birth_id;
    if (this.state.birth_year > 0 && parseInt(this.state.birth_month)>0 && e.target.id> 0){
      birthday = new Date(this.state.birth_year.toString() + '-' +  this.formatMonthDate(parseInt(this.state.birth_month)) + '-' + this.formatMonthDate(e.target.id));
    }
    if (this.state.birth_year > 0 && e.target.id > 0){
      var month = parseInt(this.state.birth_month)>0?parseInt(this.state.birth_month):1;
      var date = new Date(this.state.birth_year.toString() + '-' +  this.formatMonthDate(month) + '-' + this.formatMonthDate(e.target.id));
      year_birth_id = getJapanYearFromDate(date);
    }
    this.setState({
      birth_day:e.target.id,
      birthday,
      year_birth_id
    });
  }
  
  getBirthDate = value => {
    var birthday = new Date(value);
    this.setState({
      birthday:birthday,
      birth_year:birthday.getFullYear(),
      year_birth_id:getJapanYearFromDate(birthday),
      birth_month:birthday.getMonth() + 1,
      birth_day:birthday.getDate(),
    });
    this.setChangeFlag(1);
  }
  
  getDialCount = (value) => {
    let input_value = value.value.replace(/[^0-9０-９]/g, '');
    if (input_value != '' &&  input_value.length > dial_master_patient_validate.dial_count_number.length){
      let cur_dial_count_number = this.state.dial_count_number;
      this.setState({dial_count_number: cur_dial_count_number}, ()=>{
        // this.setCaretPosition("dial_count_number_id", cur_dial_count_number.toString().length);
      });
      return;
    }
    if (input_value != "") {
      input_value = parseInt(this.toHalfWidthOnlyNumber(input_value));
    }
    this.setState({dial_count_number: input_value}, ()=>{
      // this.setCaretPosition("dial_count_number_id", input_value.toString().length);
    });
    this.setChangeFlag(1);
  }
  
  getComment = e => {
    this.setChangeFlag(1);
    this.setState({ comment: e.target.value});
  }
  ConfirmDelete = () => {
    this.setState({ showConfirmDeleteMOdal:true});
  }
  closeModal = () => {
    this.setState({
      isMoveListModal:false,
      isAttentionModal:false,
      showConfirmDeleteMOdal:false,
      isDeleteConfirmModal: false,
      isOpenReplaceConfirmModal: false,
      isOpenRegisterConfirmModal: false,
      isOpenSelectPannelModal:false,
      modal_data:null,
    });
  };
  
  handleOk = async (data) => {
    this.setState({
      movelist: data,
      isMoveListModal: false,
      modal_data:null,
    });
  };
  
  handleAddAttention = async (post_data) => {
    // let tmp = this.state.attentionList;
    if(this.registering_flag){
      return;
    }
    post_data.patient_id = this.state.patient_number;
    
    this.registering_flag = true;
    let path = "/app/api/v2/dial/patient/registerAttention";
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          // tmp.push(post_data);
          this.setState({
            // movelist: tmp,
            isAttentionModal: false
          });
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          this.getAttentionListByPatient(this.state.patient_number);
        }
      })
      .catch((res) => {
        window.sessionStorage.setItem("alert_messages", res.error_alert_message);
      }).finally(()=>{
        this.registering_flag = false;
      });
    
  };
  formatDateBySlash = dateStr => {
    if (!dateStr || dateStr.length < 8) return "";
    dateStr = "" + dateStr;
    return dateStr.substring(0,4) + "/" + dateStr.substring(5,7) + "/" +dateStr.substring(8,10);
  };
  
  handleRemoveClass = (id) => {
    if ($("#" + id).hasClass("red_border")) {
      $("#" + id).removeClass("red_border");
      // if (id != 'birth-year' && id != 'birth-month' && id != 'birth-day'){
      //     $(".area_" + id + " label span").remove();
      // } else {
      //     if (this.state.birthday !=''){
      //         $(".birth-label .alert-span").remove();
      //     }
      // }
    }
  }
  
  handleAddClass = (id) => {
    if (!$("#" + id).hasClass("red_border")) {
      $("#" + id).addClass("red_border");
      // var obj = null;
      // if (id != 'birth-year' && id != 'birth-month' && id != 'birth-day'){
      //     obj = $(".area_" + id + " label");
      // } else {
      //     obj = $(".birth-label");
      // }
      // if (obj != undefined && obj != null && obj.length>0 && !(obj.find('.alert-span').length>0)){
      //     obj.prepend("<span class='alert-span' style='color:red;'>＊</span>");
      // }
    }
    // $("#" + id).focus();
  }
  
  handleAddClass_bg = (id) => {
    if (!$("#" + id).hasClass("required_field")) {
      // if (id != 'birth-year' && id != 'birth-month' && id != 'birth-day'){
      if (id != 'birth-type'){
        $("#" + id).addClass("required_field");
      } else {
        $("#" + id + " select" ).addClass("required_field");
      }
    }
  };
  handleRemoveClass_bg = (id) => {
    // if (id != 'birth-year' && id != 'birth-month' && id != 'birth-day'){
    if (id != 'birth-type'){
      if ($("#" + id).hasClass("required_field")) {
        $("#" + id).removeClass("required_field");
      }
    } else {
      if ($("#" + id + " select").hasClass("required_field")) {
        $("#" + id + " select" ).removeClass("required_field");
      }
    }
  };
  
  componentDidUpdate () {
    this.changeBackground();
    
    // eslint-disable-next-line consistent-this
    const that = this;
    let tall_id_obj = document.getElementById("tall_id");
    if(tall_id_obj !== undefined && tall_id_obj != null){
      tall_id_obj.addEventListener('focus', function(){
        that.setCaretPosition('tall_id',tall_id_obj.value);
      });
    }
    let dial_count_number_id_obj = document.getElementById("dial_count_number_id");
    if(dial_count_number_id_obj !== undefined && dial_count_number_id_obj != null){
      dial_count_number_id_obj.addEventListener('focus', function(){
        that.setCaretPosition('dial_count_number_id',dial_count_number_id_obj.value);
      });
    }
  }
  
  checkValidation =async() => {
    let server_time = await getServerTime();
    let error_str_arr = [];
    let error_arr = [];
    this.handleRemoveClass("patient_name_id");
    this.handleRemoveClass("kana_name_id");
    this.handleRemoveClass('birth-type');
    this.handleRemoveClass('birth-year');
    this.handleRemoveClass('birth-month');
    this.handleRemoveClass('birth-day');
    $(".birth-label .alert-span").remove();
    if (this.state.patient_name == null || this.state.patient_name === "" ) {
      error_str_arr.push(dial_master_patient_validate.patient_name.requierd_message);
      error_arr.push({
        state_key: 'patient_name',
        error_msg: dial_master_patient_validate.patient_name.requierd_message,
        error_type: 'blank',
        tag_id:'patient_name_id'
      });
      this.handleAddClass("patient_name_id");
    }
    if (this.state.patient_name != "" && this.state.patient_name.length > dial_master_patient_validate.patient_name.length) {
      error_str_arr.push(dial_master_patient_validate.patient_name.overflow_message);      
      error_arr.push({
        state_key: 'patient_name',
        error_msg: dial_master_patient_validate.patient_name.overflow_message,
        error_type: 'length',
        tag_id:'patient_name_id'
      });
      this.handleAddClass("patient_name_id");
    }
    if (this.state.patient_kana_name == null || this.state.patient_kana_name === "") {
      error_str_arr.push(dial_master_patient_validate.patient_kana_name.requierd_message);
      error_arr.push({
        state_key: 'patient_name',
        error_msg: dial_master_patient_validate.patient_kana_name.requierd_message,
        error_type: 'blank',
        tag_id:'kana_name_id'
      });
      this.handleAddClass("kana_name_id");
    }
    if (this.state.patient_kana_name != "" && this.state.patient_kana_name.length > dial_master_patient_validate.patient_kana_name.length) {
      error_str_arr.push(dial_master_patient_validate.patient_kana_name.overflow_message);
      error_arr.push({
        state_key: 'patient_name',
        error_msg: dial_master_patient_validate.patient_kana_name.overflow_message,
        error_type: 'length',
        tag_id:'kana_name_id'
      });
      this.handleAddClass("kana_name_id");
    }
    
    var birth_check_flag = true;
    if (this.state.japan_calendar_type == 0 && this.state.calendar == 0) {
      this.handleAddClass("birth-type");
      birth_check_flag = false;
    } else {
      this.handleRemoveClass('birth-type');
    }
    if (this.state.birth_year == 0) {
      this.handleAddClass("birth-year");
      birth_check_flag = false;
    } else {
      this.handleRemoveClass('birth-year');
    }
    
    if (this.state.birth_month == 0) {
      this.handleAddClass("birth-month");
      birth_check_flag = false;
    } else {
      this.handleRemoveClass('birth-month');
    }
    
    if (this.state.birth_day == 0) {
      this.handleAddClass("birth-day");
      birth_check_flag = false;
    } else {
      this.handleRemoveClass('birth-day');
    }
    if (birth_check_flag == false) {
      error_str_arr.push(dial_master_patient_validate.birthday.requierd_message);
      error_arr.push({
        state_key: 'birthday',
        error_msg: dial_master_patient_validate.birthday.requierd_message,
        tag_id:'birth-year'
      });
    }
    if (this.state.birthday !='' && (new Date(this.state.birthday).getTime() > new Date(server_time).getTime() || new Date(this.state.birthday).getTime() < new Date('1900-01-01'))){
      error_str_arr.push('生年月日を正しく入力してください。');
      error_arr.push({
        state_key: 'birthday',
        error_msg: '生年月日を正しく入力してください。',
        tag_id:'birth-year'
      });
      this.handleAddClass("birth-year");
      this.handleAddClass("birth-month");
      this.handleAddClass("birth-day");
    }
    if (this.state.firstAddress != "" && this.state.firstAddress.length > dial_master_patient_validate.firstAddress.length) {
      error_str_arr.push(dial_master_patient_validate.firstAddress.overflow_message);
      error_arr.push({
        state_key: 'firstAddress',
        error_msg: dial_master_patient_validate.firstAddress.overflow_message,
        error_type: 'length',
        tag_id:'address_1_id'
      });
      this.handleAddClass("address_1_id");
    } else {
      this.handleRemoveClass("address_1_id");
    }
    if (this.state.building_name != "" && this.state.building_name.length > dial_master_patient_validate.building_name.length) {
      error_str_arr.push(dial_master_patient_validate.building_name.overflow_message);
      error_arr.push({
        state_key: 'building_name',
        error_msg: dial_master_patient_validate.building_name.overflow_message,
        error_type: 'length',
        tag_id:'address_2_id'
      });
      this.handleAddClass("address_2_id");
    } else {
      this.handleRemoveClass("address_2_id");
    }
    if (this.state.mail_address != "" && this.state.mail_address.length > dial_master_patient_validate.mail_address.length) {
      error_str_arr.push(dial_master_patient_validate.mail_address.overflow_message);
      error_arr.push({
        state_key: 'mail_address',
        error_msg: dial_master_patient_validate.mail_address.overflow_message,
        error_type: 'length',
        tag_id:'mail_id'
        
      });
      this.handleAddClass("mail_id");
    } else if(this.state.mail_address != "" && !this.validateEmail()){
      error_str_arr.push("Eメール形式で入力してください。");
      error_arr.push({
        tag_id:'mail_id'
      });
      this.handleAddClass("mail_id");
    } else {
      this.handleRemoveClass("mail_id");
    }
    if (this.state.facility_name != undefined && this.state.facility_name != null && this.state.facility_name != "" && this.state.facility_name.length > dial_master_patient_validate.facility_name.length) {
      error_str_arr.push(dial_master_patient_validate.facility_name.overflow_message);
      error_arr.push({
        state_key: 'facility_name',
        error_msg: dial_master_patient_validate.facility_name.overflow_message,
        error_type: 'length',
        tag_id:'facility_name_id'
      });
      this.handleAddClass("facility_name_id");
    } else {
      this.handleRemoveClass("facility_name_id");
    }
    if (this.state.hospital_relocation_facility_name != undefined && this.state.hospital_relocation_facility_name != null && this.state.hospital_relocation_facility_name != "" && this.state.hospital_relocation_facility_name.length > dial_master_patient_validate.hospital_relocation_facility_name.length) {
      error_str_arr.push(dial_master_patient_validate.hospital_relocation_facility_name.overflow_message);
      error_arr.push({
        state_key: 'hospital_relocation_facility_name',
        error_msg: dial_master_patient_validate.hospital_relocation_facility_name.overflow_message,
        error_type: 'length',
        tag_id:'hospital_relocation_facility_name_id'
      });
      this.handleAddClass("hospital_relocation_facility_name_id");
    } else {
      this.handleRemoveClass("hospital_relocation_facility_name_id");
    }
    if (this.state.move_reason != "" && this.state.move_reason.length > dial_master_patient_validate.move_reason.length) {
      error_str_arr.push(dial_master_patient_validate.move_reason.overflow_message);
      error_arr.push({
        state_key: 'move_reason',
        error_msg: dial_master_patient_validate.move_reason.overflow_message,
        error_type: 'length',
        tag_id:'move_reason_id'
      });
      this.handleAddClass("move_reason_id");
    } else {
      this.handleRemoveClass("move_reason_id");
    }
    if (this.state.move_destination != "" && this.state.move_destination.length > dial_master_patient_validate.move_destination.length) {
      error_str_arr.push(dial_master_patient_validate.move_destination.overflow_message);
      error_arr.push({
        state_key: 'move_destination',
        error_msg: dial_master_patient_validate.move_destination.overflow_message,
        error_type: 'length',
        tag_id:'move_destination_id'
      });
      this.handleAddClass("move_destination_id");
    } else {
      this.handleRemoveClass("move_destination_id");
    }
    if (this.state.notice != "" && this.state.notice.length > dial_master_patient_validate.notice.length) {
      error_str_arr.push(dial_master_patient_validate.notice.overflow_message);
      error_arr.push({
        state_key: 'notice',
        error_msg: dial_master_patient_validate.notice.overflow_message,
        error_type: 'length',
        tag_id:'notice_id'
        
      });
      this.handleAddClass("notice_id");
    } else {
      this.handleRemoveClass("notice_id");
    }
    if (this.state.comment != "" && this.state.comment.length > dial_master_patient_validate.comment.length) {
      error_str_arr.push(dial_master_patient_validate.comment.overflow_message);
      error_arr.push({
        state_key: 'comment',
        error_msg: dial_master_patient_validate.comment.overflow_message,
        error_type: 'length',
        tag_id:'comment_id'
      });
      this.handleAddClass("comment_id");
    } else {
      this.handleRemoveClass("comment_id");
    }
    this.setState({error_arr});    
    return error_str_arr;
  }
  
  registerPatient = async () => {
    let error_str_array = await this.checkValidation();    
    if (error_str_array.length > 0 ) {
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }
    let _state = {};
    let hasSameName = await this.checkPatientNameExist();
    if (this.state.edit_flag === 0 && hasSameName != null) {
      _state.confirm_alert_title = "同名登録確認";
      _state.confirm_message = "同名の患者様が見つかりました。このまま新患登録を行いますか？";
      _state.isSamePatientNameOpen = true;
    } else {
      _state.isOpenRegisterConfirmModal = true;
      _state.confirm_message = this.state.edit_flag === 0 ? "登録しますか?" : "変更しますか?";
    }
    this.setState(_state);
  }
  
  closeAlertModal = () => {
    this.setState({alert_message: ''});
    if(this.state.error_arr.length > 0){
      let first_obj = this.state.error_arr[0];
      $("#" + first_obj.tag_id).focus();
    }
  }
  
  handleRegister = async () => {
    this.setChangeFlag(0);
    this.setState({
      isOpenRegisterConfirmModal: false,
      isSamePatientNameOpen: false,
      data_list: [],
      confirm_alert_title: "",
      title: "",
      confirm_message: "",
    });
    let path = "/app/api/v2/dial/patient/register";
    const post_data = {
      patient_number: this.state.patient_number,
      system_patient_id:this.state.system_patient_id,
      patient_name:this.state.patient_name,
      kana_name:this.state.patient_kana_name,
      gender:this.state.gender,
      birthday:this.state.birthday !=""?formatDateLine(this.state.birthday):"",
      zip_code:this.state.zip_code,
      address:this.state.firstAddress,
      building_name:this.state.building_name,
      tel_number:this.state.tel_number,
      mobile_number:this.state.mobile_number,
      mail_address:this.state.mail_address,
      blood_type:this.state.blood_type,
      RH: this.state.RH,
      tall:this.state.tall,
      dial_start_date:this.state.dial_start_date != "" ?formatDateLine(this.state.dial_start_date) : "",
      hospital_start_date:this.state.hospital_start_date != "" ?formatDateLine(this.state.hospital_start_date) : "",
      facility_id:this.state.facility_id,
      facility_name:this.state.facility_name,
      hospital_relocation_facility:this.state.hos_facility,
      hospital_relocation_facility_name:this.state.hospital_relocation_facility_name,
      move_flag:this.state.moveflag,
      move_date:this.state.move_date != "" ?formatDateLine(this.state.move_date) : "",
      move_reason:this.state.move_reason,
      move_destination:this.state.move_destination,
      primary_disease:this.state.primary_disease,
      DM:this.state.DM,
      death_cause:this.state.death_cause,
      notice:this.state.notice,
      hospitial_flag:this.state.hospitial_flag,
      occupation: this.state.occupation,
      dial_group:this.state.group,
      dial_group2:this.state.group2,
      wheel_chair:this.state.wheel_chair,
      dial_count_number:this.state.dial_count_number,
      comment:this.state.comment,
    };
    
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          if (this.state.edit_flag == 0) {
            window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          } else {
            window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          }
          if (this.props.type == "modal"){
            this.props.closeModal("refresh");
          } else {
            // this.reset();
            sessApi.setObjectValue("dial_setting","patient", res.patient_info);
            sessApi.setObjectValue("dial_setting","patientById", res.patient_info.system_patient_id);
            sessApi.setObjectValue("dial_setting","change_patient_flag", 1);
            setTimeout(()=>{
              this.sidebarRef.current.getPatientList();
            }, 100);
            if (this.new_register_page){
              this.props.history.replace("/dial/dial_patient");
            }
          }
        }
      })
      .catch(() => {
      });
  }
  
  deletePatient = async() => {
    this.setChangeFlag(0);
    this.setState({
      showConfirmDeleteMOdal: false
    });
    let path = "/app/api/v2/dial/patient/deletePatientInfo";
    const post_data = {
      patient_number: this.state.patient_number
    }
    this.openConfirmCompleteModal('削除中');
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages","削除完了##" +  "透析患者情報を削除しました。");
          this.closeModal();
          this.reset();
          sessApi.delObjectValue("dial_setting","patient");
          this.setChangeFlag(0);
          this.sidebarRef.current.getPatientList();
          this.setState({
            show_flag:0,
            edit_flag:0,
          })
        } else{
          window.sessionStorage.setItem("alert_messages", "削除に失敗しました。");
        }
      })
      .catch(() => {
      }).finally(()=>{
        this.setState({
          isConfirmComplete:false,
        });
      });
  }
  openConfirmCompleteModal =(message)=>{
    this.setState({
      isConfirmComplete:true,
      complete_message: message,
    });
  };
  updatePatient = async () => {
    let path = "/app/api/v2/dial/patient/updatePatientInfo";
    const post_data = {
      patient_number: this.state.patient_number,
      patient_name:this.state.patient_name,
      kana_name:this.state.patient_kana_name,
      gender:this.state.gender,
      birthday:this.state.birthday !=""?formatDateLine(this.state.birthday):"",
      zip_code:this.state.zip_code,
      address:this.state.firstAddress,
      building_name:this.state.building_name,
      tel_number:this.state.tel_number,
      mobile_number:this.state.mobile_number,
      mail_address:this.state.mail_address,
      blood_type:this.state.blood_type,
      RH: this.state.RH,
      tall:this.state.tall,
      dial_start_date:this.state.dial_start_date != "" ?formatDateLine(this.state.dial_start_date) : "",
      hospital_start_date:this.state.hospital_start_date != "" ?formatDateLine(this.state.hospital_start_date) : "",
      facility_id:this.state.facility_id,
      facility_name:this.state.facility_name,
      hospital_relocation_facility:this.state.hos_facility,
      hospital_relocation_facility_name:this.state.hospital_relocation_facility_name,
      move_flag:this.state.moveflag,
      move_date:this.state.move_date != "" ?formatDateLine(this.state.move_date) : "",
      move_reason:this.state.move_reason,
      move_destination:this.state.move_destination,
      primary_disease:this.state.primary_disease,
      DM:this.state.DM,
      death_cause:this.state.death_cause,
      notice:this.state.notice,
      hospitial_flag:this.state.hospitial_flag,
      occupation: this.state.occupation,
      dial_group2:this.state.group2,
      wheel_chair:this.state.wheel_chair,
      // comment:this.state.comment,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages","変更完了##" +  "透析患者情報を変更しました。");
          if (this.props.type == "modal"){
            this.props.closeModal();
            
          } else {
            this.reset();
            sessApi.delObjectValue("dial_setting","patient");
            this.sidebarRef.current.getPatientList();
          }
        }
        // else{
        //     window.sessionStorage.setItem("alert_messages", "項目を正確に入力してください。");
        // }
      })
      .catch(() => {
      });
  }
  
  moveOtherPage=()=>{
    this.setChangeFlag(0);
    let confirm_type = this.state.confirm_type;
    let go_url = this.state.go_url;
    this.setState({
      isOpenMoveOtherPageConfirm:false,
      confirm_message: "",
      confirm_type:"",
      confirm_alert_title:'入力中'
    },()=>{
      if(confirm_type === "other_tab"){
        this.goOtherPage(go_url);
      }
    });
  }
  
  selectPatient =async(patient_info) => {       
    if (!(patient_info.system_patient_id > 0)) return;
    if(this.state.is_loaded){
      this.setState({is_loaded:false});
    }
    this.handleRemoveClass("patient_name_id");
    this.handleRemoveClass("kana_name_id");
    this.handleRemoveClass('birth-type');
    this.handleRemoveClass('birth-year');
    this.handleRemoveClass('birth-month');
    this.handleRemoveClass('birth-day');
    $(".birth-label .alert-span").remove();
    let patient_birthday = (patient_info.birthday != null && patient_info.birthday != '0000-00-00') ? new Date(patient_info.birthday) :'';    
    let dial_start_date = ((patient_info.dial_start_date !='0000-00-00' && patient_info.dial_start_date !=null)?new Date(patient_info.dial_start_date):'');
    let hospital_start_date = ((patient_info.hospital_start_date !='0000-00-00' && patient_info.hospital_start_date !=null)?new Date(patient_info.hospital_start_date):'');
    let move_date = ((patient_info.move_date !='0000-00-00' && patient_info.move_date !=null)?new Date(patient_info.move_date):'');
    await this.getMoveList(patient_info.patient_number);
    await this.getAttentionListByPatient(patient_info.patient_number);
    this.setState({
      prefecture: '',
      city: '',
      address: '',
      calendar:1,
      firstAddress: patient_info.address != null ? patient_info.address : '',
      patient_number: patient_info.patient_number,
      system_patient_id: patient_info.system_patient_id,
      patient_name: patient_info.patient_name,
      patient_kana_name: patient_info.kana_name,
      gender: patient_info.gender,
      birthday: patient_birthday,
      birth_year:patient_birthday!=''?patient_birthday.getFullYear():'',
      year_birth_id:getJapanYearFromDate(patient_birthday),
      birth_month: patient_birthday!=''?this.formatMonthDate(patient_birthday.getMonth() + 1):'',
      birth_day:patient_birthday!=''?this.formatMonthDate(patient_birthday.getDate()):'',
      zip_code: patient_info.zip_code,
      building_name: patient_info.building_name!=null?patient_info.building_name:'',
      tel_number: patient_info.tel_number!=null?patient_info.tel_number:'',
      mobile_number: patient_info.mobile_number!=null?patient_info.mobile_number:'',
      mail_address: patient_info.mail_address!=null?patient_info.mail_address:'',
      blood_type: patient_info.blood_type,
      RH: patient_info.RH,
      tall: patient_info.tall!=null?patient_info.tall:'',
      dial_start_date: dial_start_date,
      hospital_start_date: hospital_start_date,
      moveflag: patient_info.move_flag,
      move_date: move_date,
      move_reason: patient_info.move_reason!=null?patient_info.move_reason:'',
      move_destination: patient_info.move_destination!=null?patient_info.move_destination:'',
      primary_disease: patient_info.primary_disease!=null?patient_info.primary_disease:0,
      DM: patient_info.DM,
      death_cause: patient_info.death_cause!=null?patient_info.death_cause:0,
      facility_id:patient_info.facility_id,
      facility_name:patient_info.facility_name,
      hos_facility:patient_info.hospital_relocation_facility,
      hospital_relocation_facility_name:patient_info.hospital_relocation_facility_name,
      hospitial_flag:patient_info.hospitial_flag,
      group:patient_info.dial_group!=null?patient_info.dial_group:0,
      group2:patient_info.dial_group2!=null?patient_info.dial_group2:0,
      wheel_chair:patient_info.wheel_chair!=null?patient_info.wheel_chair:0,
      occupation:patient_info.occupation!=null?patient_info.occupation:0,
      dial_count_number:patient_info.dial_count_number!=null?patient_info.dial_count_number:0,
      comment:patient_info.comment!=null?patient_info.comment:'',
      edit_flag: 1,
      show_flag: 1,
      japan_calendar_type:0,
      is_loaded: true,
    });
    this.setChangeFlag(0);
    $('#patient_name_id').focus();
    $('#patient_name_id').trigger('click');
  }
  
  getPatientInfo = async (patient_id) => {
    let path = "/app/api/v2/dial/patient/getPatientInfo";
    const post_data = {
      patient_number: patient_id,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          let patient_info = res;
          this.sidebarRef.current.setState({
            selected_id: patient_info != undefined && patient_info != null?patient_info.system_patient_id:0
          });
          sessApi.setObjectValue("dial_setting", "patient", patient_info);
          if (patient_info.patient_number == patient_id) {            
            this.selectPatient(patient_info);
          } else {
            this.setChangeFlag(1);
            this.setState({
              patient_number:this.state.search_patient_id,
              show_flag: 1
            }, () => {
              $('#patient_name_id').focus();
            });
          }
        } else {
          this.setChangeFlag(1);
          this.sidebarRef.current.setState({
            selected_id: 0
          }, () => {
            $('#patient_name_id').focus();
          });
        }
      })
      .catch(() => {
        this.setChangeFlag(1);
        this.sidebarRef.current.setState({
          selected_id: 0
        });
        this.setState({
          patient_number:this.state.search_patient_id,
          show_flag: 1
        }, () => {
          $('#patient_name_id').focus();
        });
      });
  }
  getMoveList = async(patient_id) => {
    let path = "/app/api/v2/dial/patient/getMoveList";
    const post_data = {
      patient_id: patient_id,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({movelist:res});
      })
      .catch(() => {
        this.setState({movelist:[]});
      });
  }

  handleOtherClick = (e,  kind, id) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu_facility: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_facility: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById(id)
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_facility: { visible: false }
          });
          document
            .getElementById(id)
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      this.setState({
        contextMenu_facility: {
          visible: true,
          x: this.props.type != undefined && this.props.type == "page" ? e.clientX : e.clientX - $('#patient-info-edit-modal').offset().left,
          y: this.props.type != undefined && this.props.type == "page" ? e.clientY : e.clientY - $('#patient-info-edit-modal').offset().top - 70
        },
        selected_facility_kind:kind,
      });
    }
  }
  
  handleClick = (e, index, id) => {
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
        .getElementById(id)
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById(id)
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      this.setState({
        contextMenu: {
          visible: true,
          x: this.props.type != undefined && this.props.type == "page" ? e.clientX : e.clientX - $('#patient-info-edit-modal').offset().left,
          y: this.props.type != undefined && this.props.type == "page" ? e.clientY : e.clientY - $('#patient-info-edit-modal').offset().top - 70
        },
        favouriteMenuType: index,
        edit_type:id,
      });
    }
  };
  
  contextMenuAction = (index, type) => {
    if (type === "edit"){
      this.editData(index);
    }
    if (type === "delete"){
      if(this.state.edit_type === "move-history"){
        this.setState({
          isDeleteConfirmModal : true,
          confirm_message: "移動履歴を削除しますか?",
          delete_id: this.state.movelist[index].number,
        });
      } else {
        this.setState({
          isDeleteConfirmModal : true,
          confirm_message: "注意点を削除しますか?",
          delete_id: this.state.attentionList[index].number,
        });
      }
    }
  };
  
  editData = (index) => {
    if(this.state.edit_type === "move-history"){
      let modal_data = this.state.movelist[index];
      this.setState({
        modal_data,
        isMoveListModal: true
      });
    } else {
      let modal_data = this.state.attentionList[index];
      this.setState({
        modal_data,
        isAttentionModal: true
      });
    }
  };
  
  deleteData = async () => {
    if(this.state.delete_id !== ''){
      
      let path = "";
      if(this.state.edit_type === "move-history"){
        path = "/app/api/v2/dial/patient/delMoveHistory";
      } else {
        path = "/app/api/v2/dial/patient/delAttention";
      }
      let post_data = {
        number: this.state.delete_id
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then((res) => {
          if (res){
            window.sessionStorage.setItem("alert_messages","削除完了##" +  res.alert_message);
          }
        })
        .catch(() => {
        }).finally(()=>{
        });
      if(this.state.edit_type === "move-history"){
        this.getMoveList(this.state.patient_number);
      } else {
        this.getAttentionListByPatient(this.state.patient_number);
      }
    }
    this.setState({
      isDeleteConfirmModal: false,
    });
  };
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isOpenReplaceConfirmModal: false,
      isOpenRegisterConfirmModal: false,
      showConfirmDeleteMOdal: false,
      confirm_message: "",
      isSearchAddress: false,
      isOpenMoveOtherPageConfirm:false,
      isOpenNewPatientRegisterConfirm:false,
      isClosePatientConfirm:false,
      isSamePatientNameOpen:false,
      data_list:[],
      confirm_alert_title:''
    });
  }
  
  setFirstAddress = () => {
    if (this.state.zip_code == null || this.state.zip_code == undefined || this.state.zip_code == ""){
      window.sessionStorage.setItem("alert_messages", "郵便番号を入力してください。");
      $('.address-01 input').focus();
      return;
    }
    let zip_code = this.state.zip_code;
    var search_zip_code = zip_code.split("-").join("");
    this.setState({
      isSearchAddress: true,
    }, ()=>{
      this.getAddressFromPost(search_zip_code);
    });
  }
  
  handleFirstAddress = () => {
    this.setState({
      isOpenReplaceConfirmModal: false,
      isSearchAddress: false,
      firstAddress: this.state.prefecture + " " + this.state.city + " " + this.state.address
    });
    $('#address_2_id').focus();
  }
  
  close = () => {
    if(this.change_flag){
      this.setState({
        isClosePatientConfirm:true,
        confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中'
      });
    } else {
      this.closePatient();
    }
  }
  
  closePatient =() => {
    this.confirmCancel();
    this.setChangeFlag(0);
    if (this.props.type == "page"){
      this.reset();
      sessApi.setObjectValue("dial_setting", "patient", null);
      sessApi.setObjectValue("dial_setting", "patientById", null);
      this.sidebarRef.current.setState({
        selected_id: 0
      });
    } else {
      this.props.closeModal();
    }
  }
  
  getFirstAddress = e => {
    this.setChangeFlag(1);
    this.setState({
      firstAddress: e.target.value,
    })
  };
  
  goOtherPage = (url) => {
    if (this.state.edit_flag ==0 && this.state.show_flag) return;
    if(this.change_flag){
      this.setState({
        isOpenMoveOtherPageConfirm:true,
        confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"other_tab",
        go_url:url,
        confirm_alert_title:'入力中'
      });
      return;
    }
    if (this.props.type != undefined && this.props.type == "page"){
      this.props.history.replace(url);
    } else {
      this.props.goOtherPage(url);
    }
  }
  
  setChangeFlag=(change_flag = 0)=>{
    this.change_flag = change_flag;
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'dial_patient_master', 1);
    } else {
      sessApi.remove('dial_change_flag');
    }
  }
  
  searchPatientId = (patient_id = null) => {    
    // sessApi.setObjectValue("dial_patient_master_method","register_patient", "search");
    let patient_num = this.state.search_patient_id;
    if (patient_num == "" && (patient_id == null || patient_id == "")) {
      window.sessionStorage.setItem("alert_messages", '検索する患者様の番号を入力してください。');
      return;
    }
    var converted_value = this.toHalfWidthOnlyNumber(this.state.search_patient_id);
    let nLength = converted_value.length;
    let strVal = "0000000";
    patient_num = strVal.substring(0, 7 - nLength) + converted_value;
    
    if (patient_id != null) {
      patient_num = patient_id;
    }
    
    if (this.existPatientId(patient_num) == 1) {
      this.getPatientInfo(patient_num);
      this.setState({search_patient_id: patient_num, patient_number: patient_num});
    } else {
      this.setState({search_patient_id: patient_num, patient_number: patient_num});
      window.sessionStorage.setItem("alert_messages", 'ID' + patient_num + 'の患者様は見つかりませんでした。');
    }
  }
  
  existPatientId = (patient_num) => {
    let existPatient = 0;
    if (this.sidebarRef.current.state.patientList.length > 0) {
      this.sidebarRef.current.state.patientList.map(item=>{
        if (item.patient_number == patient_num.toString()) {
          existPatient = 1;
        }
      });
    }
    return existPatient;
  }
  
  checkPatientNameExist = async () => {
    let path = "/app/api/v2/dial/patient/check_same_patient_name";
    
    var post_data = {
      patient_info: {
        patient_name: this.state.patient_name,
        kana_name: this.state.patient_kana_name
      }
    }
    const { data } = await axios.post(path, {param:post_data});
    if (data != undefined && data != null && data.length > 0) {
      this.setState({
        data_list: data
      });
      return 1;
    } else {
      return null;
    }
    
  }
  
  handleRegisterPatient = (patient_id = null) => {
    // sessApi.setObjectValue("dial_patient_master_method","register_patient", "register");
    let patient_num = this.state.search_patient_id;
    if (patient_num == "" && (patient_id == null || patient_id == "")) {
      window.sessionStorage.setItem("alert_messages", '登録する患者様の番号を入力してください。');
      return;
    }
    var converted_value = this.toHalfWidthOnlyNumber(this.state.search_patient_id);
    let nLength = converted_value.length;
    let strVal = "0000000";
    patient_num = strVal.substring(0, 7 - nLength) + converted_value;
    
    if (patient_id != null) {
      patient_num = patient_id;
    }
    
    if (this.existPatientId(patient_num) == 1) {
      window.sessionStorage.setItem("alert_messages", 'ID' + patient_num + 'は既に使われています。');
      this.setState({search_patient_id: patient_num, patient_number: patient_num});
    } else {
      this.setState({
        isOpenNewPatientRegisterConfirm: true,
        tmpPatientNum: patient_num,
        confirm_message: patient_num + "は登録されていません。"+"\n"+"新患登録を行いますか？"
      });
    }
  }
  
  getDisabledJapanYear=async(month, day)=>{
    if (!(month > 0) || !(day > 0)) return null;
    let server_time = await getServerTime();
    let disabled_year_id = '';
    let date = new Date(server_time);
    date.setMonth(month);
    date.setDate(day);
    date.setFullYear(1912);
    if (date.getTime() <= JapanDateBorder.MEIJI.getTime()){
      disabled_year_id += '1912.5';
    } else {
      disabled_year_id += '1912';
    }
    disabled_year_id += ':';
    
    date.setFullYear(1926);
    if (date.getTime() <= JapanDateBorder.TAISHYO.getTime()){
      disabled_year_id += '1926.5';
    } else {
      disabled_year_id += '1926';
    }
    disabled_year_id += ':';
    
    date.setFullYear(1989);
    if (date.getTime() <= JapanDateBorder.SHYOWA.getTime()){
      disabled_year_id += '1989.5';
    } else {
      disabled_year_id += '1989';
    }
    disabled_year_id += ':';
    
    date.setFullYear(2019);
    if (date.getTime() <= JapanDateBorder.HEISEI.getTime()){
      disabled_year_id += '2019.5';
    } else {
      disabled_year_id += '2019';
    }
    return disabled_year_id;
  }
  
  changeBackground = () => {
    if (this.state.patient_name == "") {
      this.handleAddClass_bg("patient_name_id");
    } else {
      this.handleRemoveClass_bg("patient_name_id");
    }
    if (this.state.patient_kana_name == "") {
      this.handleAddClass_bg("kana_name_id");
    } else {
      this.handleRemoveClass_bg("kana_name_id");
    }
    if (this.state.japan_calendar_type == 0 && this.state.calendar == 0) {
      this.handleAddClass_bg("birth-type");
    } else {
      this.handleRemoveClass_bg("birth-type");
    }
    if (this.state.birth_year == 0) {
      this.handleAddClass_bg("birth-year");
    } else {
      this.handleRemoveClass_bg("birth-year");
    }
    if (this.state.birth_month == 0) {
      this.handleAddClass_bg("birth-month");
    } else {
      this.handleRemoveClass_bg("birth-month");
    }
    if (this.state.birth_day == 0) {
      this.handleAddClass_bg("birth-day");
    } else {
      this.handleRemoveClass_bg("birth-day");
    }
  }
  
  openNewPatientRegister = () => {
    this.setState({
      isOpenNewPatientRegisterConfirm: false,
      confirm_message: "",
    },()=>{
      this.getPatientInfo(this.state.tmpPatientNum);
      this.setState({search_patient_id: this.state.tmpPatientNum, patient_number: this.state.tmpPatientNum});
      $('#patient_name_id').focus();
      $('#patient_name_id').trigger('click');
    });
  }
  
  setCaretPosition =(elemId, value)=> {
    let caretPos = value.toString().length;
    var elem = document.getElementById(elemId);
    var range;
    if(elem != null) {
      if(elem.createTextRange) {
        range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        elem.focus();
        if(elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  }
  
  getJapanCalendarType = (e) => {
    if (this.state.calendar == 0 && !(e.target.id > 0)) return;
    this.setState({
      japan_calendar_type: e.target.id,
      birth_year:''
    });
  }
  
  
  getBirthdayYearEdit = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    if (input_value != "") {
      input_value = parseInt(this.toHalfWidthOnlyNumber(input_value));
    }
    let max_length;
    var japan_calendar_type = this.state.japan_calendar_type>0?this.state.japan_calendar_type:0;
    if (this.state.calendar){
      max_length = 9999;
    } else {
      if (japan_calendar_type > 0){
        
        max_length = JapnaYearMax[japan_calendar_type];
      } else {
        max_length = 99;
      }
    }
    
    if(parseInt(input_value) > max_length) return;
    var birthday = '';
    var year = 0;
    var month = parseInt(this.state.birth_month) > 0?parseInt(this.state.birth_month):1;
    var day = parseInt(this.state.birth_day) > 0?parseInt(this.state.birth_day):1;
    if (this.state.calendar){
      if (input_value>1867 && input_value<2200 && parseInt(this.state.birth_month) > 0 && parseInt(this.state.birth_day) > 0){
        birthday = new Date(input_value.toString() + '-' +  this.formatMonthDate(parseInt(this.state.birth_month)) + '-' + this.formatMonthDate(parseInt(this.state.birth_day)));
      }
      
      if (input_value>1867 && input_value<2200){
        year = input_value;
        var date = new Date(year.toString() + '-' +  this.formatMonthDate(month) + '-' + this.formatMonthDate(day));
        japan_calendar_type = getJapanYearNameFromDate(date);
      }
      this.setState({
        birth_year:input_value,
        birthday,
        japan_calendar_type,
      });
    } else {
      if (japan_calendar_type>0 && parseInt(this.state.birth_month) > 0 && parseInt(this.state.birth_day)>0){
        if (input_value > 0){
          year = JapanYearBorder[japan_calendar_type] + input_value -1;
        } else {
          year = JapanYearBorder[japan_calendar_type];
        }
        birthday = new Date(parseInt(year).toString() + '-' +  this.formatMonthDate(parseInt(this.state.birth_month)) + '-' + this.formatMonthDate(parseInt(this.state.birth_day)));
      }
      
      this.setState({
        birth_year:input_value,
        birthday,
      })
    }
    if (e.keyCode == 13){
      $('#birth-month').focus();
    }
    if (e.keyCode == undefined && this.state.calendar && input_value.toString().length == 4 ){
      $('#birth-month').focus();
    }
    if (e.keyCode == undefined && this.state.calendar==0 && input_value.toString().length == 2 ){
      $('#birth-month').focus();
    }
    this.setChangeFlag(1);
  }
  
  getBirthdayMonthEdit = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    if (input_value != "") {
      input_value = (this.toHalfWidthOnlyNumber(input_value));
    }
    if (input_value.length == 1 && parseInt(input_value) > 1) return;
    if(input_value.length > 2) return;
    if(parseInt(input_value) > 12) return;
    
    var birthday = '';
    var japan_calendar_type = this.state.japan_calendar_type;
    if (this.state.birth_year>0 && input_value>0 && parseInt(this.state.birth_day)>0){
      birthday = new Date(this.state.birth_year.toString() + '-' +  this.formatMonthDate(parseInt(input_value)) + '-' + this.formatMonthDate(parseInt(this.state.birth_day)));
    }
    if (this.state.calendar == 1){
      if (this.state.birth_year > 1867 && this.state.birth_year < 2200){
        var month = parseInt(input_value) > 0?parseInt(input_value):1;
        var day = parseInt(this.state.birth_day)>0?parseInt(this.state.birth_day):1;
        var date = new Date(this.state.birth_year.toString() + '-' +  this.formatMonthDate(month) + '-' + this.formatMonthDate(day));
        japan_calendar_type = getJapanYearNameFromDate(date);
      }
    }
    
    this.setState({
      birth_month:input_value,
      birthday,
      japan_calendar_type,
    });
    // if (e.keyCode == 13){
    //   $('#birth-day').focus();
    // }
    if (e.keyCode == undefined && input_value.length == 2) $('#birth-day').focus();
    this.setChangeFlag(1);
  }
  
  setFormatMonth = (e) => {
    this.setState({
      birth_month:parseInt(e.target.value)>0 ? this.formatMonthDate(parseInt(e.target.value)):''
    })
  }
  
  setFormatDay = (e) => {
    this.setState({
      birth_day:parseInt(e.target.value)>0 ? this.formatMonthDate(parseInt(e.target.value)):''
    })
  }
  
  getBirthdayDayEdit = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    if (input_value != "") {
      input_value = (this.toHalfWidthOnlyNumber(input_value));
    }
    
    if(parseInt(input_value) > 31) return;
    
    var birthday = '';
    var japan_calendar_type = this.state.japan_calendar_type;
    if (this.state.birth_year > 0 && parseInt(this.state.birth_month)>0 && parseInt(input_value)> 0){
      birthday = new Date(this.state.birth_year.toString() + '-' +  this.formatMonthDate(parseInt(this.state.birth_month)) + '-' + this.formatMonthDate(parseInt(input_value)));
    }
    if (this.state.calendar == 1 ){
      if (this.state.birth_year > 1867 && this.state.birth_year < 2200){
        var month = parseInt(this.state.birth_month)>0?parseInt(this.state.birth_month):1;
        var day = parseInt(input_value) > 0?parseInt(input_value):1;
        var date = new Date(this.state.birth_year.toString() + '-' +  this.formatMonthDate(month) + '-' + this.formatMonthDate(day));
        japan_calendar_type = getJapanYearNameFromDate(date);
      }
    }
    
    this.setState({
      birth_day:input_value,
      birthday,
      japan_calendar_type
    });
    this.setChangeFlag(1);
  }

  getInputText = (name, e) => {
    this.setState({[name]:e.target.value});
  }

  openSelectOtherFacility = () => {
    this.setState({
      isOpenSelectPannelModal:true,
    })
  }

  
  render() {
    let {type} = this.props;
    let { primary_disease_codes_options, death_cause_codes_options, occupation_codes_options, dial_group_codes_options, dial_group_codes2_options} = this.state;
    this.disabled_year_id = this.getDisabledJapanYear(this.state.birth_month, this.state.birth_day);
    this.disabled_year_id = this.disabled_year_id!=null?this.disabled_year_id.toString():null;    
    this.changeBackground();
    return (
      <>
        {type != undefined && type == "page" && (
          <DialSideBar
            ref = {this.sidebarRef}
            onGoto={this.selectPatient}
            history = {this.props.history}
          />
        )}
        <Card className={type=="modal"?"modal_card":""}>
          <div className='flex' style={{marginTop: type=="page"?'2vh':0}}>
            <div className="title">透析患者マスタ{this.new_register_page?'（新規登録）':''}</div>
            <div className='others'>
              <Button className="disable-button">透析患者マスタ</Button>
              <Button className={this.new_register_page?'disable-button':''} onClick={this.goOtherPage.bind(this,"/dial/dial_insurance")}>保険情報</Button>
              <Button className={this.new_register_page?'disable-button':''} onClick={this.goOtherPage.bind(this,"/dial/dial_emergency")}>緊急連絡先</Button>
              <Button className={this.new_register_page?'disable-button':''} onClick={this.goOtherPage.bind(this,"/dial/dial_family")}>家族歴</Button>
            </div>
          </div>
          {type == "page" && this.state.show_flag ===0 ? (
            <div className="first-input-step">
              <div><p>{this.new_register_page?'登録する患者様の番号を入力してください。':'検索する患者様の番号を入力してください。'}</p></div>
              <div className = "id_input">
                <InputBoxTag
                  label="患者番号"
                  type="text"
                  placeholder="患者番号入力"
                  className = "patient-id-input half_letter input_tag"
                  getInputText={this.getPatinetNumber.bind(this)}
                  value={this.state.search_patient_id}
                  id = 'patient_number_id'
                />
                {this.new_register_page == false && (
                  <Button onClick={()=>this.searchPatientId()}>検索</Button>
                )}
                {this.new_register_page && (
                  <Button onClick={()=>this.handleRegisterPatient()}>新規登録</Button>
                )}
              </div>
            </div>
          ):(
            <>
              <div className="bodywrap w-100">
                {this.state.is_loaded ? (
                  <>
                    <Wrapper className={type=="modal"?"modal_wrapper":""}>
                      <div className="first-area">
                        <div className="input-box-style-div">
                          <InputBoxTag
                            label="患者番号"
                            type="text"
                            placeholder="患者番号入力"
                            className = "hankaku-eng-num-input input-readonly input_tag"
                            getInputText={this.getPatinetNumber.bind(this)}
                            isDisabled = {true}
                            value={this.state.patient_number}
                          />
                        </div>
                        <div className="area_patient_name_id">
                          <InputBoxTag
                            label="患者氏名"
                            type="text"
                            placeholder="患者氏名入力"
                            getInputText={this.getPatinetName.bind(this)}
                            onBlur = {this.convertNametoKana.bind(this)}
                            onKeyUp = {this.onKeyUpEvent.bind(this)}
                            id="patient_name_id"
                            value={this.state.patient_name}
                            className = "half_letter input_tag"
                          />
                        </div>
                        <div className="area_kana_name_id">
                          <InputBoxTag
                            label="カナ氏名"
                            type="text"
                            placeholder="カナ氏名入力"
                            className = "half_letter input_tag"
                            onBlur={this.getHalfKana.bind(this)}
                            getInputText={this.getPatinetKanaName.bind(this)}
                            id="kana_name_id"
                            value={this.state.patient_kana_name}
                          />
                        </div>
                        <div className="gender outer-group">
                          <label className="gender-label left-label">性別</label>
                          <div className="ele-group">
                            <RadioButton
                              id="male"
                              value={1}
                              label="男性"
                              name="gender"
                              getUsage={this.selectGender}
                              checked={this.state.gender === 1}
                            />
                            <RadioButton
                              id="femaie"
                              value={2}
                              label="女性"
                              name="gender"
                              getUsage={this.selectGender}
                              checked={this.state.gender === 2}
                            />
                            <RadioButton
                              id="gender-noset"
                              value={0}
                              label="未設定"
                              name="gender"
                              getUsage={this.selectGender}
                              checked={this.state.gender === 0}
                            />
                          </div>
                        </div>
      
                        <div className="select_calendar outer-group">
                          <label className="birth-label left-label">生年月日</label>
                          <div className="ele-group">
                            <RadioButton
                              id="standard"
                              value={1}
                              label="西暦"
                              name="select_calendar"
                              getUsage={this.selectCalendar}
                              checked={this.state.calendar === 1}
                            />
                            <RadioButton
                              id="japan"
                              value={0}
                              label="和暦"
                              name="select_calendar"
                              getUsage={this.selectCalendar}
                              checked={this.state.calendar === 0}
                            />
                          </div>
                        </div>
                        <div className="birthday_area outer-group">                          
                          <div className={'label-title'}> </div>
                          {this.state.calendar == 0 && (
                            <SelectorWithLabel
                              options={this.japan_calendar_list}
                              title=""
                              getSelect={this.getJapanCalendarType.bind(this)}
                              departmentEditCode={this.state.japan_calendar_type}
                              disabledValue = {0}
                              id = {'birth-type'}
                            />
                          )}
                          <div className={'input-year'}>
                            <InputBoxTag
                              label=""
                              type="text"
                              placeholder=""
                              getInputText={this.getBirthdayYearEdit.bind(this)}
                              className={"hankaku-eng-num-input"}
                              value = {this.state.birth_year}
                              id ='birth-year'
                            />
                            <span className="left-label-height">年</span>
                          </div>
                          <div className={'input-month'}>
                            <InputBoxTag
                              label=""
                              type="text"
                              placeholder=""
                              getInputText={this.getBirthdayMonthEdit.bind(this)}
                              onBlur = {this.setFormatMonth.bind(this)}
                              className="hankaku-eng-num-input"
                              value = {this.state.birth_month}
                              id ='birth-month'
                            />
                            <span className="left-label-height">月</span>
                          </div>
                          <div className={'input-date'}>
                            <InputBoxTag
                              label=""
                              type="text"
                              placeholder=""
                              getInputText={this.getBirthdayDayEdit.bind(this)}
                              onBlur = {this.setFormatDay.bind(this)}
                              className="hankaku-eng-num-input"
                              value = {this.state.birth_day}
                              id ='birth-day'
                            />
                            <span className="left-label-height">日</span>
                          </div>
                          {/*<NumberFormat
                                    id = 'birth-year'
                                    className="hankaku-eng-num-input"
                                    thousandSeparator={true}
                                    value={this.state.birth_year}
                                    onValueChange={this.getBirthdayYearEdit.bind(this)}
                                  />
                                  <span className="left-label-height">年</span>
                                  <NumberFormat
                                    id = 'birth-month'
                                    className="hankaku-eng-num-input"
                                    thousandSeparator={true}
                                    value={this.state.birth_month}
                                    onValueChange={this.getBirthdayMonthEdit.bind(this)}
                                  />
                                  <span className="left-label-height">月</span>
                                  <NumberFormat
                                    id = 'birth-day'
                                    className="hankaku-eng-num-input"
                                    thousandSeparator={true}
                                    value={this.state.birth_day}
                                    onValueChange={this.getBirthdayDayEdit.bind(this)}
                                  />
                                  <span className="left-label-height">日</span>
                                  */}
                          {/*<SelectorWithLabel
                                    options={this.state.calendar==1?standard_year_list:japan_year_list}
                                    title=""
                                    getSelect={this.getBirthYear.bind(this)}
                                    departmentEditCode={this.state.calendar==1?this.state.birth_year:this.state.year_birth_id}
                                    disabledValue = {this.state.calendar==1?null:this.disabled_year_id}
                                    id = {'birth-year'}
                                  />
                                  <span className="left-label-height">年</span>
                                  <div className="month_day flex">
                                    <SelectorWithLabel
                                      options={month_list}
                                      title=""
                                      getSelect={this.getBirthMonth.bind(this)}
                                      departmentEditCode={this.state.birth_month}
                                      id = {'birth-month'}
                                    />
                                    <span className="left-label-height">月</span>
                                    <SelectorWithLabel
                                      options={day_list}
                                      title=""
                                      getSelect={this.getBirth_day.bind(this)}
                                      departmentEditCode={this.state.birth_day}
                                      id = {'birth-day'}
                                    />
                                    <span className="left-label-height">日</span>
                                  </div>*/}
                        </div>
                        <div className="blood outer-group" style={{width:"120%"}}>
                          <label className="gender-label left-label">血液型</label>
                          <div className="ele-group">
                            <RadioButton
                              value={0}
                              id="blood-A"
                              label="A"
                              name="blood"
                              getUsage={this.selectBlood}
                              checked={this.state.blood_type === 0}
                            />
                            <RadioButton
                              value={1}
                              id="blood-B"
                              label="B"
                              name="blood"
                              getUsage={this.selectBlood}
                              checked={this.state.blood_type === 1}
                            />
                            <RadioButton
                              value={2}
                              id="blood-O"
                              label="O"
                              name="blood"
                              getUsage={this.selectBlood}
                              checked={this.state.blood_type === 2}
                            />
                            <RadioButton
                              value={3}
                              id="blood-AB"
                              label="AB"
                              name="blood"
                              getUsage={this.selectBlood}
                              checked={this.state.blood_type === 3}
                            />
                            <RadioButton
                              id="blood-noset"
                              value={4}
                              label="未設定"
                              name="blood"
                              getUsage={this.selectBlood}
                              checked={this.state.blood_type === 4}
                            />
                          </div>
                        </div>
                        <div className="blood outer-group">
                          <label className="gender-label left-label">RH</label>
                          <div className="ele-group">
                            <RadioButton
                              id="rh+"
                              value={0}
                              label="+"
                              name="rh"
                              getUsage={this.selectRh}
                              checked={this.state.RH === 0}
                            />
                            <RadioButton
                              id="rh-"
                              value={1}
                              label="-"
                              name="rh"
                              getUsage={this.selectRh}
                              checked={this.state.RH === 1}
                            />
                            <RadioButton
                              id="rh-noset"
                              value={2}
                              label="未設定"
                              name="rh"
                              getUsage={this.selectRh}
                              checked={this.state.RH === 2}
                            />
                          </div>
                        </div>
                        <div className="flex">
                          <div className="tall-input number-input-area hankaku-eng-num-input">
                            <div className={'tall-title'} style={{textAlign:"right"}}>身長</div>
                            <div className={'flex value-area tall-div-input'}>
                              <NumberFormat
                                id = 'tall_id'
                                className="hankaku-eng-num-input"
                                thousandSeparator={true}
                                value={this.state.tall}
                                onValueChange={this.getTall.bind(this)}
                              />
                              <span className="tall">cm</span>
                            </div>
                          </div>
                          <div className="wheel outer-group">
                            <label className="checkbox-label left-label" style={{width: "4rem"}}>車椅子</label>
                            <div className="left-label-height-style right-field">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this)}
                                value={this.state.wheel_chair}
                                name="wheel"
                              />
                            </div>
                          </div>
                        </div>
                        {/*<div className="tall-input">
                                  <InputBoxTag
                                      label="身長"
                                      type="text"
                                      className="hankaku-eng-num-input"
                                      placeholder=""
                                      getInputText={this.getTall.bind(this)}
                                      value={this.state.tall}
                                      id = 'tall_id'
                                  />
                                  <span className="tall">cm</span>
                              </div>
                              <div className="wheel outer-group">
                                  <label className="checkbox-label left-label">車椅子</label>
                                  <div className="left-label-height-style right-field">
                                    <Checkbox
                                        label=""
                                        getRadio={this.getRadio.bind(this)}
                                        value={this.state.wheel_chair}
                                        name="wheel"
                                    />
                                  </div>
                              </div>*/}
                        <div className="address-01">
                          <InputBoxTag
                            label="郵便番号"
                            type="text"
                            id="post_number_id"
                            placeholder="郵便番号入力"
                            getInputText={this.getPostNumber.bind(this)}
                            className={'hankaku-eng-num-input'}
                            value={this.state.zip_code}
                          />
                          <Button onClick={this.setFirstAddress} type="mono">郵便番号検索</Button>
                        </div>
                        <div className="input-box-style-div">
                          <InputBoxTag
                            label="住所1"
                            type="text"
                            placeholder=""
                            // isDisabled = "true"
                            getInputText={this.getFirstAddress.bind(this)}
                            value={this.state.firstAddress}
                            id = 'address_1_id'
                            className="half_letter input_tag"
                          />
                        </div>
                        {/*<InputBoxTag
                                  label="市町村"
                                  type="text"
                                  placeholder=""
                                  isDisabled = "true"
                                  className = "edit_disabled"
                                  // getInputText={this.getMunicipalities.bind(this)}
                                  value={this.state.city}
                              />
                              <InputBoxTag
                                  label="番地"
                                  type="text"
                                  placeholder=""
                                  className = "edit_disabled"
                                  isDisabled = "true"
                                  getInputText={this.getAdress.bind(this)}
                                  value={this.state.address}
                              />*/}
                        <div className="input-box-style-div">
                          <InputBoxTag
                            label="住所2"
                            type="text"
                            placeholder=""
                            getInputText={this.getBuilding.bind(this)}
                            value={this.state.building_name}
                            className="half_letter input_tag"
                            id = 'address_2_id'
                          />
                        </div>
                        <div className="input-box-style-div">
                          <InputBoxTag
                            label="電話番号"
                            type="text"
                            placeholder="電話番号入力"
                            getInputText={this.getTelPhone.bind(this)}
                            className={'hankaku-eng-num-input input_tag'}
                            value={this.state.tel_number}
                            id = 'phone_id'
                          />
                        </div>
                        <div className="input-box-style-div">
                          <InputBoxTag
                            label="携帯番号"
                            type="text"
                            placeholder="携帯番号入力"
                            getInputText={this.getMobilenumber.bind(this)}
                            className={'hankaku-eng-num-input input_tag'}
                            value={this.state.mobile_number}
                            id = 'mobile_id'
                          />
                        </div>
                        <div className="mail-address">
                          <InputBoxTag
                            label="Eメール"
                            type="text"
                            placeholder="Eメール入力"
                            getInputText={this.getMailAddress.bind(this)}
                            value={this.state.mail_address}
                            id = 'mail_id'
                            className={'hankaku-eng-num-input input_tag'}
                          />
                        </div>
                      </div>
                    </Wrapper>
                    <Wrapper>
                      <div className="datepicker-style">
                        <InputBoxTag
                          label="透析導入日"
                          type="date"
                          placeholder="透析導入日入力"
                          getInputText={this.getDialStartDate.bind(this)}
                          value={this.state.dial_start_date}
                          noTodayButton={true}
                          className={'hankaku-eng-num-input'}
                        />
                      </div>
                      <div className="datepicker-style">
                        <InputBoxTag
                          label="当院開始日"
                          type="date"
                          placeholder="当院開始日入力"
                          getInputText={this.getHosStartDate.bind(this)}
                          value={this.state.hospital_start_date}
                          noTodayButton={true}
                          className={'hankaku-eng-num-input'}
                        />
                      </div>
                      {/* <SelectorWithLabel
                        options={otherfacilities_options}
                        title="導入施設"
                        getSelect={this.selectFacility.bind(this)}
                        departmentEditCode={this.state.facility_id}
                      /> */}
                      <div className="input-box-style-div" onContextMenu={e => this.handleOtherClick(e, 'facility', 'facility_name_id')}>
                        <InputBoxTag
                          label="導入施設"
                          type="text"
                          placeholder="導入施設"
                          getInputText={this.getInputText.bind(this, 'facility_name')}
                          value={this.state.facility_name}
                          id = 'facility_name_id'
                          className={'input_tag'}
                        />
                      </div>

                      {/* <SelectorWithLabel
                        options={otherfacilities_options}
                        title="転院先施設"
                        getSelect={this.getHosFacility.bind(this)}
                        departmentEditCode={this.state.hos_facility}
                      /> */}
                      <div className="input-box-style-div" onContextMenu={e => this.handleOtherClick(e, 'hospital', 'hospital_relocation_facility_name_id')}>
                        <InputBoxTag
                          label="転院先施設"
                          type="text"
                          placeholder="転院先施設"
                          getInputText={this.getInputText.bind(this, 'hospital_relocation_facility_name')}
                          value={this.state.hospital_relocation_facility_name}
                          id = 'hospital_relocation_facility_name_id'
                          className={'input_tag'}
                        />
                      </div>
                      
                      <div className="gender outer-group">
                        <label className="gender-label left-label">移動フラグ</label>
                        <div className="ele-group">
                          <RadioButton
                            value={0}
                            id="flag0"
                            label="透析中"
                            name="flag"
                            getUsage={this.selectMoveFlag}
                            checked={this.state.moveflag === 0}
                          />
                          <RadioButton
                            value={1}
                            id="flag1"
                            label="転院"
                            name="flag"
                            getUsage={this.selectMoveFlag}
                            checked={this.state.moveflag === 1}
                          />
                          <RadioButton
                            value={2}
                            id="flag2"
                            label="治癒"
                            name="flag"
                            getUsage={this.selectMoveFlag}
                            checked={this.state.moveflag === 2}
                          />
                          <RadioButton
                            value={6}
                            id="flag6"
                            label="CAPD"
                            name="flag"
                            getUsage={this.selectMoveFlag}
                            checked={this.state.moveflag === 6}
                          />
                        </div>
                      </div>
                      <div className="gender outer-group">
                        <label className="gender-label left-label"/>
                        <div className="ele-group">
                          <RadioButton
                            value={3}
                            id="flag3"
                            label="一時転出"
                            name="flag"
                            getUsage={this.selectMoveFlag}
                            checked={this.state.moveflag === 3}
                          />
                          <RadioButton
                            value={4}
                            id="flag4"
                            label="離脱"
                            name="flag"
                            getUsage={this.selectMoveFlag}
                            checked={this.state.moveflag === 4}
                          />
                          <RadioButton
                            value={5}
                            id="flag5"
                            label="死亡"
                            name="flag"
                            getUsage={this.selectMoveFlag}
                            checked={this.state.moveflag === 5}
                          />
                          <RadioButton
                            value={7}
                            id="flag7"
                            label="CAPD併用"
                            name="flag"
                            getUsage={this.selectMoveFlag}
                            checked={this.state.moveflag === 7}
                          />
                        </div>
                      </div>
                      <div className="datepicker-style">
                        <InputBoxTag
                          label="移動日"
                          type="date"
                          placeholder="移動日入力"
                          getInputText={this.getMoveDate.bind(this)}
                          value={this.state.move_date}
                          noTodayButton={true}
                          className={'hankaku-eng-num-input'}
                        />
                      </div>
                      <div className="input-box-style-div">
                        <InputBoxTag
                          label="移動理由"
                          type="text"
                          placeholder="移動理由入力"
                          getInputText={this.getMoveReason.bind(this)}
                          value={this.state.move_reason}
                          id = 'move_reason_id'
                          className={'half_letter input_tag'}
                        />
                      </div>
                      <div className="input-box-style-div">
                        <InputBoxTag
                          label="移動先"
                          type="text"
                          placeholder="移動先入力"
                          getInputText={this.getMoveDestination.bind(this)}
                          value={this.state.move_destination}
                          id = 'move_destination_id'
                          className={'half_letter input_tag'}
                        />
                      </div>
                      <SelectorWithLabel
                        options={primary_disease_codes_options}
                        title="原疾患"
                        getSelect={this.getPrimaryDisease.bind(this)}
                        departmentEditCode={this.state.primary_disease}
                      />
                      <SelectorWithLabel
                        options={death_cause_codes_options}
                        title="死亡原因"
                        getSelect={this.getDeathCause.bind(this)}
                        departmentEditCode={this.state.death_cause}
                      />
                      <div className="input-box-style-div">
                        <InputBoxTag
                          label="備考"
                          type="text"
                          placeholder="備考入力"
                          getInputText={this.getNotice.bind(this)}
                          value={this.state.notice}
                          id = 'notice_id'
                          className={'half_letter input_tag'}
                        />
                      </div>
                      <div className="gender outer-group">
                        <div className="flex">
                          <label className="gender-label left-label">入院</label>
                          <div className="ele-group">
                            <RadioButton
                              id={0}
                              value={0}
                              label="入院"
                              name="hospital"
                              getUsage={this.selectHospital.bind(this)}
                              checked={this.state.hospitial_flag === 0}
                            />
                            <RadioButton
                              id={1}
                              value={1}
                              label="外来"
                              name="hospital"
                              getUsage={this.selectHospital.bind(this)}
                              checked={this.state.hospitial_flag === 1}
                            />
                          </div>
                        </div>
                        <div className="flex">
                          <label className="checkbox-label left-label" style={{width:"3.5rem"}}>DM</label>
                          <div className="left-label-height-style right-field">
                            <Checkbox
                              label=""
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.DM}
                              name="dm"
                            />
                          </div>
                        </div>
                      </div>
                      <SelectorWithLabel
                        options={occupation_codes_options}
                        title="職業"
                        getSelect={this.getOccupation.bind(this)}
                        departmentEditCode={this.state.occupation}
                      />
                      <div className="flex">
                        <div className="div-group-1">
                          <SelectorWithLabel
                            options={dial_group_codes_options}
                            title="グループ"
                            getSelect={this.getGroup.bind(this)}
                            departmentEditCode={this.state.group}
                          />
                        </div>
                        <div className="div-group-2">
                          <SelectorWithLabel
                            options={dial_group_codes2_options}
                            title=""
                            getSelect={this.getGroup2.bind(this)}
                            departmentEditCode={this.state.group2}
                          />
                        </div>
                      </div>
                    </Wrapper>
                    <Wrapper>
                      <div className="d-flex" style={{marginTop:"3px"}}>
                        <div className="w-50">
                          移動履歴一覧
                        </div>
                        <div className={this.state.edit_flag==0?'w-50 text-right add_area disabled':'w-50 text-right add_area'} onClick={this.addMOveList}>
                          <Icon icon={faPlus} className = "plus_icon"/>移動履歴を追加
                        </div>
                      </div>
                      <div className="move-list">
                        <table className="table-scroll table table-bordered" id={'move-history'}>
                          <thead>
                          <tr>
                            <th style={{width:"7rem", borderRight:"1px solid #ddd"}}>移動期間</th>
                            <th style={{borderRight:"1px solid #ddd"}}>備考</th>
                            <th style={{textAlign:"right",width:"3.5rem"}}>回数</th>
                          </tr>
                          </thead>
                          <tbody>
                          {this.state.movelist !== null && this.state.movelist.length > 0 && this.state.movelist.map((item, index)=>{
                            return (<>
                              <tr onContextMenu={e => this.handleClick(e, index, "move-history")}>
                                <td style={{width:"7rem", borderRight:"1px solid #ddd"}}>
                                  {item.moving_period_start_date != null && item.moving_period_start_date != undefined && item.moving_period_start_date != "" && (
                                    <>
                                      {this.formatDateBySlash(item.moving_period_start_date)} ~ {this.formatDateBySlash(item.moving_period_end_date)}
                                    </>
                                  )}
                                </td>
                                <td style={{borderRight:"1px solid #ddd"}} id={index}>{item.remarks}</td>
                                <td style={{textAlign:"right",width:"3.5rem"}}>{item.number_of_dialysis}</td>
                              </tr>
                            </>)
                          })}
                          </tbody>
                        </table>
                      </div>
                      <div className="tall-input number-input-area">
                        <div className={'dial_count-title'}>現在透析回数</div>
                        <div className={'flex value-area'}>
                          <NumberFormat
                            id = 'dial_count_number_id'
                            className="hankaku-eng-num-input"
                            thousandSeparator={true}
                            value={this.state.dial_count_number}
                            onValueChange={this.getDialCount.bind(this)}
                          />
                          <span className="tall">回</span>
                        </div>
                        {/*<InputBoxTag
                                      label="現在透析回数"
                                      type="text"
                                      placeholder="現在透析回数を入力"
                                      getInputText={this.getDialCount.bind(this)}
                                      className="hankaku-eng-num-input"
                                      value = {this.state.dial_count_number}
                                      id ='dial_count_number_id'
                                  />*/}
                      </div>
                      <div className="comment">
                        <div>コメント</div>
                        <textarea
                          onChange={this.getComment.bind(this)}
                          value={this.state.comment}
                          id ='comment_id'
                          className={'half_letter'}
                        />
                      </div>
                      <div className="d-flex w-100">
                        <div style={{width:"60%"}}>
                          体重測定における注意点
                        </div>
                        <div className={this.state.edit_flag==0?'text-right add_area disabled':'text-right add_area'} style={{width:"40%"}} onClick={this.addAttention}>
                          <Icon icon={faPlus} className = "plus_icon"/>注意点を追加
                        </div>
                      </div>
                      <div className="move-list attention-table">
                        <table className="table-scroll table table-bordered" id={'div-attention'}>
                          <thead>
                          <div className="attention-area" style={{borderBottom:"1px solid #ddd"}}>
                            <div style={{width:"100px", textAlign:"center"}}>日付</div>
                            <div style={{paddingLeft:"16.5px", textAlign:"center", borderLeft:"1px solid #ddd", width:"calc(100% - 100px)"}}>注意点</div>
                          </div>
                          </thead>
                          <tbody>
                          {this.state.attentionList !== null && this.state.attentionList !== undefined && this.state.attentionList.length > 0 &&
                          this.state.attentionList.map((item, index)=>{
                            return (<>
                              <div className="tr-div" onContextMenu={e => this.handleClick(e, index, "div-attention")}>
                                <div style={{width:"100px", float:"left", padding:"3px"}}>{this.formatDateBySlash(item.regist_date)}</div>
                                {/*<td>{displayLineBreak(item.attention)}</td>*/}
                                {/*<td style={{textAlign:"left"}}>*/}
                                <div className="attention-content">{textareaBreakStr(item.attention)}</div>
                                {/*</td>*/}
                              </div>
                            </>)
                          })}
                          </tbody>
                        </table>
                      </div>
                    </Wrapper>
                  </>
                  ):(
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                )}
              </div>
              <div className="footer-buttons">
                {this.context.$canDoAction(this.context.FEATURES.PATIENT_MANAGE,this.context.AUTHS.DELETE) && (
                  <>
                    {type == "page" && this.state.edit_flag ===1 && this.state.show_flag ===1 && (
                      <Button onClick={this.ConfirmDelete} className={`delete-btn ${this.state.curFocus === 1?"focus": ""}`}>削除</Button>
                    )}
                  </>
                )}
                <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
                {this.state.edit_flag ===1 && this.state.show_flag ===1 && (
                  <Button onClick={this.registerPatient} className={`red-btn ${this.state.curFocus === 1?"focus": ""}`}>変更</Button>
                )}
                {type == "page" && this.state.edit_flag ===0 && this.state.show_flag ===1 && (
                  <Button onClick={this.registerPatient} className={`red-btn ${this.state.curFocus === 1?"focus": ""}`}>登録</Button>
                )}
              </div>
            </>
          )}
        </Card>
        {this.state.isMoveListModal && (
          <MoveList
            modal_data={this.state.modal_data}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            patient_id={this.state.patient_number}
          />
        )}
        {this.state.isAttentionModal && (
          <AttentionModal
            modal_data={this.state.modal_data}
            handleOk={this.handleAddAttention}
            closeModal={this.closeModal}
          />
        )}
        {this.state.isClosePatientConfirm && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.closePatient}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.showConfirmDeleteMOdal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deletePatient}
            confirmTitle= {"患者情報を削除しますか？"}
          />
        )}
        {this.state.isDeleteConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deleteData.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isOpenReplaceConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.handleFirstAddress.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isOpenRegisterConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.handleRegister.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title={this.state.confirm_alert_title}
          />
        )}
        {this.state.isOpenMoveOtherPageConfirm && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.moveOtherPage.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isOpenNewPatientRegisterConfirm && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.openNewPatientRegister.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {"新患登録確認"}
          />
        )}
        {this.state.isConfirmComplete && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.isSamePatientNameOpen && (
          <SamePatientAlertModal
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.handleRegister.bind(this)}
            title = {this.state.confirm_alert_title}
            confirmTitle={this.state.confirm_message}
            data_list={this.state.data_list}
          />
        )}
        {this.state.isOpenSelectPannelModal && (
          <SelectPannelModal
            closeModal = {this.closeModal}
            selectMaster = {this.selectFacilityFromModal}
            MasterName = '他施設'
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
        />
        <ContextMenu_facility
          {...this.state.contextMenu_facility}
          parent={this}
          selected_facility_kind={this.state.selected_facility_kind}
        />
        
      </>
    )
  }
}

PatientInfoEditBody.contextType = Context;

PatientInfoEditBody.propTypes = {
  patientInfo: PropTypes.array,
  type: PropTypes.string,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  goOtherPage: PropTypes.func,
  history: PropTypes.object
};
export default PatientInfoEditBody
