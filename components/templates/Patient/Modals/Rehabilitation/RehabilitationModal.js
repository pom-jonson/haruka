import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/RemComponents/SelectorWithLabel";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import InputWithLabel from "~/components/molecules/RemComponents/InputWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import HarukaSelectMasterModal from "~/components/molecules/HarukaSelectMasterModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {formatDateTimeIE, formatDateLine, formatDateSlash} from "~/helpers/date";
import SetDetailViewModal from "~/components/templates/Patient/Modals/Common/SetDetailViewModal";
import RehabilyItemMasterModal from "~/components/templates/Patient/Modals/Common/RehabilyItemMasterModal";
import {CACHE_LOCALNAMES, THERAPHY, FUNCTION_ID_CATEGORY, KARTEMODE} from "~/helpers/constants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ItemTableBody from "~/components/templates/Patient/Modals/Guidance/ItemTableBody";
import SelectMedicineModal from "~/components/templates/Patient/Modals/Common/SelectMedicineModal";
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";
import SelectDoctorModal from "../../../../molecules/SelectDoctorModal";
import {REHABILY_DISEASE} from "~/helpers/constants";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import * as sessApi from "~/helpers/cacheSession-utils";
import $ from 'jquery';
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {secondary} from "~/components/_nano/colors";
import {setDateColorClassName} from '~/helpers/dialConstants';
registerLocale("ja", ja);
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
 width: 100%;
 height: 100%;
 font-size: 0.875rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
.selected, .selected:hover{
  background:lightblue!important;
}

.disease-r{
  font-size: 1rem;
  height: 1.875rem;
  width: 1.875rem;
  margin-left: 1.875rem;
  min-width: 1.875rem;
  padding: 0.35rem 0.5rem 0.3rem 0.5rem;
  margin-top:1px;
}

.disease-name{
  width: calc(100% - 40px) !important;
  float: left;
}
.disease-add-btn{
  width: 1.875rem !important;
  float: left;
  padding-top:0px;
  margin-top:0px;
  button{
      font-size:0.7rem;
      border-radius:4px;
      border:none;
      height:1.65rem!important;
      width:1.65rem!important;
      min-width:1.3rem!important;
      padding:0rem!important;
      color:white;
      background-color: ${secondary};
  }
}
.table-menu{
    background: rgb(160, 235, 255);
}

.work-list{
    height: 5.3rem;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
    .area-1 {
      height: 100%;
      margin-right: 3px;
      .title{
        text-align: center;
        font-size: 0.875rem;
        font-weight: bold;
        background-color: #a0ebff;
        border: solid 1px lightgray;
        border-bottom: none;
      }
      .content{
        height: 90%;
        border:1px solid lightgray;
        p {
          margin: 0;
          cursor: pointer;
          padding-left: 0.25rem;
        }
        p:hover {
          background-color: rgb(246, 252, 253);
        }
        overflow-y:auto;
        .label-title {
            width: 0;
            margin: 0;
        }
        .input-box-tag {
            width: 6rem;
            height: 2.5rem;
            margin-left: 0.25rem;
        }
        label {
            line-height: 2.5rem;
            margin-top: 0.5rem;
            margin-left: 0.2rem;
        }
      }
      .halfinput {
        ime-mode: inactive;
        input{
            ime-mode: inactive;
          }
      }
    }
}
.right-area{
    table {
        thead{
        display:table;
        width:100%;
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: 3rem;
            width:100%;
        }
        tr{
            display: table;
            width: 100%;
        }
    }
}
  .menu-select{
    width: 35px;
    height: 1.875rem;
    button{
      width: 100%;
      min-width: 1.875rem;
      height: 1.875rem;
      background-color: #ddd;
      border: 1px solid #aaa;
      line-height: 0px;
      span{
        color:black;
        margin-left: -4px;
      }
    }
  }
  .date-select {
    border: solid 1px #999;
    text-align: center;
    height: 1.875rem;
    margin: 0;
  }
  }
  .select-box{
    select{
      width: 300px;
      height: 1.875rem;
    }
    label{
        margin: 0;
        height: 25px;
        margin-top: 2px;
    }
    .pullbox-title{
      font-size: 0.875rem;
      width: 6rem;
      text-align: right;
      line-height: 2rem;
      margin-right: 0.5rem;
    }
  }
  .set-done{
    margin-top: 10px;
    .state-name {
        .input-with-lable {
            margin:0;
        }
        .label-title {
            margin-bottom: 0;
            width: 6rem;
            font-size: 0.875rem;
            text-align: right;
        }
        input {
            height: 2rem;
            width: 5rem;
        }
    }
  }
  .mt5{
    button{
    padding:0.25rem;
    margin-left:0.25rem;
    min-width:2rem;
    }
  }
  .mt5{margin-top:0.25rem;}
  .header-second{
    display: flex;
    margin-bottom:0.25rem;
    label{
      margin-top:-0.25rem;
      margin-left: 0.25rem;
      margin-right:15px;
      margin-bottom:0.25rem;
    }
  }
  .left-third{
    table {
        margin-bottom: 0.1rem;
        thead{
            display:table;
            width:100%;
            .td-disease-date {
              width: 91px;
            }
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: 2.5rem;
            width:100%;
            
          .td-disease-date {
            width: 74px;
          }
          td{
            vertical-align: middle;
            label{
                margin-bottom:0;
            }
          }
        }
        tr{
            display: table;
            width: 100%;
        }
        .td-disease-type-date{
            width: 16rem;
            .pullbox-label, .pullbox-select {
              width: 9rem;
              height: 1.5rem;
            }
            .react-datepicker-wrapper {
              margin-left: 0.25rem;
            }
            .pullbox-label, .pullbox-select {
              width: 9rem;
              height: 1.5rem;
              font-size:0.9rem;
            }
        }
        .td-disease-date, .td-disease-name, .td-disease-type-date{
            line-height: 1.5rem;
        }
        .td-disease-name-label {
            width: calc(100% - 2rem);
            text-align:left;
        }
    }
    .earily-rehabilitation {
      .pullbox-title {
        width: 0;
      }
      .spec-check{
          label{
            padding-top:0.35rem;
          }
      }
      .pullbox-label, .pullbox-select {
        width: 8rem;
        height: 2rem;
        padding-top:0px!important;
      }
      .react-datepicker-wrapper {
          margin-left:0.5rem;
      }
    }
  }
  .left-second {
      .no-border{
    border: none !important;
    input{
      border: solid 1px lightgray;
      height: 2rem;
      border-radius: 4px;
      padding: 4px;
      width: 100% !important;
    }
  }
  }
    .react-datepicker-popper{
        button {
            padding: 0;
        }
    }
  .header-first{
    .state-name{
        .input-with-label{
            margin-top: 1px;
        }
        input{
            width: 150px;
            height: 2rem;
        }
        .label-title {
            width: 6rem;
            text-align: right;
            margin-top: 0;
            margin-bottom: 0;
            line-height: 2rem;
        }
    }
    .datepicker {
        label {
            margin-top: 6px;
            margin-bottom: 0;
        }
        .react-datepicker-wrapper {
            margin-top: 3px;
        }
    }
    .radio-area{
      display: flex;
      margin-bottom:0.25rem;
      label{
        margin-top: -0.25rem;
        margin-right:15px;
      }
    }
    .treat-date {
        margin-top: 6px;
        width: 6rem;
        text-align: right;
        
    }
    .date-select {
      width: auto;
      border: solid 1px #999;
      margin-top: 2px;
      margin-left: 3px;
    }
    .select-box{
      .label-title {
        margin-top: 2px;
        margin-bottom: 0px;
      }
      select{
        width: 6.25rem;
        height: 1.875rem;
      }
      label{
      margin-top: 2px;
      height: 25px;
      }
      .pullbox-label{
        height: 1.875rem;
      }
      .pullbox-title{
        font-size: 0.875rem;
        width: 6rem;
        text-align: right;
        line-height: 2rem;
        margin-right: 0.5rem;
      }
    }
  }
  .clear-button {
      width: 100%;
      min-width: 1.875rem;
      height: 1.875rem;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      border-radius: 4px;
      padding:0;
      line-height: 0px;
      span{
        color:black;
      }
  }
  .clear-button:hover{
    border: solid 2px #7e7e7e;
  }
  .search-item-btn:hover{
    border: solid 2px #7e7e7e;
  }
  .table {
    .pullbox-title{width:0;}
    tr{height: 1.875rem;}
    td{padding:0;}
    th{padding:3px;}
    .ixnvCM {margin-right:0;}
  }

  .td-start-date{
    padding: 4px !important;
  }

  }
  .ml100{margin-left: 6.25rem;}
  .ml10{margin-left: 6.25rem;}
  .no-border{
    border: none !important;
    input{
      border: solid 1px lightgray;
      height: 2rem;
      border-radius: 4px;
      padding: 4px;
      width: 150px !important;
    }
  }
  .last-part{
    button{
      margin-right: 0.25rem;
      margin-left: 0.25rem;
      span{
        font-size: 1rem;
        font-weight: 100;
      }
    }
  }
  .inline-radio{
    label {
      font-size: 1rem;
      margin-right: 0.25rem;
      border-radius: 4px;
      border: solid 1px #ddd;
    }
    div{
      margin-right: 0.25rem;
    }
  }
  .search-type{
    label {
      font-size: 0.875rem;
    }
  }
  .set-detail-area {
    width: 100%;
    position:relative;
    table {
        margin-bottom: 0.1rem;
        thead{
            display:table;
            width:100%;
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: 7rem;
            width:100%;
        }
        tr{
            display: table;
            width: 100%;
        }
        td{
            word-break:break-all;
        }
        .react-numeric-input b {
          right: 0.25rem;
        }
        .value-area{
          padding-top: 0.25rem;
          .input-value {
            width: auto !important;
          }
          b {
            right:5px !important;
          }
          .react-datepicker-wrapper{
              line-height: normal;
          }
          .pullbox-select, .pullbox-label {
              height: 2.375rem;
          }
          .react-numeric-input {
            input {
              height: 2.375rem;
              margin-top: -0.5rem;
              margin-left: 0.25rem;
            }
          }
        }
    }
    .react-datepicker{
        button{
          min-width : 0;
          background : none;
          padding: 0px;
          margin-right: 0px;
          width:0;
          height:0;
        }
        .react-datepicker__navigation--previous{
          border: 0.45rem solid transparent;
          border-right-color: #ccc;
          border-radius: 0px;
        }
        .react-datepicker__navigation--next{
          border: 0.45rem solid transparent;
          border-left-color: #ccc;
          border-radius: 0px;
        }
    }
    .react-datepicker-popper{
        left:-2rem!important;
        top:1rem!important;
    }
    .table-menu {
      background-color: rgb(160, 235, 255);
      text-align: center;
    }
    .td-no {
      background-color: #e2caff;
    }
    td {
      vertical-align: middle;
    }
    .item-no{
        width: 2rem;
    }
    .code-number{
        width: 5rem;
    }
    .name {
        width: 15rem;
    }
    .table-check{
        width: 13rem;
        .pullbox-select{
          font-size:0.8rem;
        }
    }
    .pullbox-label {
      width: 100%;
      margin: 0;
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
      select{width:100%;}
      .pullbox-select {
          height: 2.5rem;
      }
    }
    .select-unit {
      select{width:100%;}
    }
    .input-lot {
        input {
            ime-mode: inactive;
        }
    }
    button {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 2.375rem;
    }
    .input-with-label input{
        width: 105px;
    }
    .detail-comment input{
        width: 150px;
    }
    .birthday_area{
      font-size:1rem;
      span{
        line-height:38px;
        margin-right: 0.25rem;
        margin-left: 0.25rem;
        font-size:1rem;
      }
      .pullbox-select{
          width:100%;
          font-size:1rem;
      }
      .pullbox-label{
        width:5.7rem;
      }
      .month_day{
        .pullbox-select{
            font-size:1rem;
            width:3rem;
        }
        .label-title{
            display:none;
        }
        .pullbox-label {
            width: 3.5rem;
        }
      }
      .calendar_icon {
        left: 6.25rem;
      }
      .react-datepicker-wrapper {
        width: 2.5rem;
        svg {
            left: 10px;
            top: 0px;
        }
      }
    }
    .react-datepicker-wrapper {
        width: 100%;
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 18px;
                width: 100%;
                height: 38px;
                padding: 0px 0.5rem;
            }
        }
    }
    .calendar_icon{
        font-size:20px;
        position: absolute;
        top: 17px;
        left: 66px;
        color: #6a676a;
    }
  }
  .set-table{
    width: 100%;
    margin-top: 0.5rem;
    table {
        margin-bottom: 0.1rem;
        thead{
            display:table;
            width:100%;
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: 5rem;
            width:100%;
        }
        tr{
            display: table;
            width: 100%;
        }
        .td-check {
            width: 2.5rem;
            text-align: center;
            label {
               margin-right: 0;
            }
        }
        .td-content{
            width:14rem;
        }
        .td-part {
            width: 8rem;
        }
    }
    .table-menu {
      background-color: rgb(160, 235, 255);;
      td {
        text-align: center;
      }
    }
    td {
      vertical-align: middle;
    }
    button {
      margin: 0;
      padding: 0;
      width: 100%;
    }
  }
  .data-content{
    height: 2rem;
    max-height: 6.25rem;
    overflow-y: auto;
    border: solid 1px lightgray;
    margin-left: 0.25rem;
  }
  .panel-menu {
    width: 100%;
    margin-bottom: 10px;
    font-weight: bold;
    .menu-btn {
        width:6.25rem;
        text-align: center;
        border-bottom: 1px solid lightgray;
        padding: 0.25rem 0;
        cursor: pointer;
    }
    .active-menu {
        width:6.25rem;
        text-align: center;
        border-top: 1px solid lightgray;
        border-right: 1px solid lightgray;
        border-left: 1px solid lightgray;
        padding: 0.25rem 0;
    }
    .no-menu {
        width: calc(100% - 300px);
        border-bottom: 1px solid lightgray;
    }
  }
  .clear-button {
      width: 1.875rem !important;
      margin-top: 0 !important;
      min-width: 1.875rem !important;
      height: 1.875rem !important;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      line-height: 0px;
      span{
        color:black;
      }
    }
    button{
        padding:0.25rem;
        span{
            font-size: 0.875rem;
            font-weight: normal:
        }
    }
  .block-area {
    border: 1px solid #aaa;
    margin-top: 12px;
    padding: 0.5rem;
    position: relative;
    label {
      font-size: 0.875rem;
      width: auto;
    }
  }
  .block-title {
    position: absolute;
    top: -12px;
    left: 10px;
    font-size: 1rem;
    background-color: white;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  .early-rehabilitation{
    margin-bottom: 0.25rem;
  }
  .date-type{
    .react-datepicker-wrapper{
      input{
        width: 85px !important;
        font-size:0.9rem;
        padding-top:0rem;
      }
    }
  }
  .bottom-area{
      table {
        margin-bottom: 0.1rem;
        thead{
        display:table;
        width:100%;
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: 2rem;
            width:100%;
        }
        tr{
            display: table;
            width: 100%;
        }
        .react-numeric-input b {
          right: 0.25rem;
        }
    }
    .exam-table {
        .table-menu{
            background: rgb(160, 235, 255);
        }
        .table-menu td{
            line-height: 1.8rem;
            font-weight: border;
        }
    }
  }
  #disease-list-table{
    position:relative;
    .react-datepicker-popper{
      top:2rem!important;
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0px!important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 1050;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.25rem 12px;
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

const ContextMenu = ({visible,x,y,parent, index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.contextMenuAction('delete', index)}>削除</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class RehabilitationModal extends Component {
  constructor(props) {
    super(props);
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;
    this.is_enabled_rehabily_developed_date_type = conf_data.is_enabled_rehabily_developed_date_type;
    this.amount_max_length = 10;
    this.integer_length = 8;
    this.decimal_length = 4;
    let haruka_validate = JSON.parse(window.sessionStorage.getItem("haruka_validate"));
    if (haruka_validate !== undefined && haruka_validate != null) {
      let validate_data = haruka_validate['karte']['rehability'];
      if (validate_data !== undefined && validate_data != null) {
        let amount_validate = validate_data.therapy_item2_amount;
        if (amount_validate !== undefined) {
          this.amount_max_length = amount_validate.max_length !== undefined ? amount_validate.max_length : 10;
          this.integer_length = amount_validate.integer_length !== undefined ? amount_validate.integer_length : 8;
          this.decimal_length = amount_validate.decimal_length !== undefined ? amount_validate.decimal_length : 4;
        }
      }
      
    }
    
    let japan_year_list = [];
    var i =0;
    var japan_year_name ='';
    var current_year = new Date().getFullYear();
    for (i=1900;i <= current_year; i++){
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
    }
    japan_year_list.reverse();
    let infection_state = karteApi.getSubVal(this.props.patientId, 'patient_state', 'infection');
    this.state = {
      type: props.type,
      tab_id: 1,
      patient_id: props.patientId,
      is_loaded: false,
      all_data:null,
      therapy_item1_id:'',
      collected_date: "",
      is_exist_time: 2,
      start_time: "",
      detail_json:{},
      detail_json_array:{1:[],2:[],3:[]},
      disease_list:[],
      selected_disease_idx: 0,
      department_state: 0,
      exist_time:{1:"時間あり", 2:"時間なし"},
      search_type_array:{1:"全て", 2:"処置のみ", 3:"検査のみ"},
      status_type_array:{1:"開始", 2:"変更", 3:"中止", 4:"終了"},
      disease_type_array:{1:"急性", 2:"慢性"},
      start_place_array:{1:"ベッドサイドより", 2:"リハ医療室にて", 3:"院内にて", 4:"院外にて"},
      exist_array:{1:"有", 0:"無"},
      status_type: 1,
      disease_type: 1,
      start_place: 1,
      infection_exist: infection_state == 'infection_status_positive' ? 1 : infection_state == 'infection_status_negative' ? 0 : '',
      early_rehabilitation: 0,
      set_master:[],
      item_count:[0,1,2,3],
      isShowStaffList: false,
      treat_user_id:0,
      treat_user_name:'',
      isPracticeSelectModal:false,
      isOpenSelectDiseaseModal:false,
      isOpenRegisterDiseaseModal:false,
      isSetDetailModal:false,
      set_detail:[
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
      ],
      enable_position1: 1,
      enable_position2: 1,
      item_categories:[{ id: 0, value: ""},],
      request_doctor_number:0,
      request_doctor_name:0,
      prescription_date: new Date(),
      prescription_doctor_number:0,
      done_want_date: new Date(),
      free_comment:"",
      calculation_start_date: "",
      display_department_id:1,
      department_name:"",
      special_comment: "",
      request_date: new Date(),
      tabs:[
        {tab_id:1, tab_name:"理学療法"},
        {tab_id:2, tab_name:"作業療法"},
        {tab_id:3, tab_name:"言語療法"},
      ],
      therapy:THERAPHY,
      position1_id:0,
      position1_name:"",
      position2_id:0,
      position2_name:"",
      therapy_item1_name: "",
      therapy_item2_master:[],
      therapy_item2_id: 0,
      therapy_item2_name: '',
      isDeleteConfirmModal: false,
      confirm_message: "",
      fault_name_array: null,                     // 障害名
      basic_policy_array: null,                   // 基本方針
      social_goal_array: null,                    // 社会的ゴール
      item_details:[
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ],
      acute_date: "",
      abandoned_syndrome_date:"",
      acute_disease_start_date: "",
      calculation_category: "",                 // 算定区分
      japan_year_list,
      isAddDiseaseNameModal:false,
      number:0,
      isForUpdate:0,
      done_order:0,
      created_at:'',
      isUpdateConfirmModal: false,
      isClearConfirmModal: false,
      disease_start_day: 0,
      developed_date_for_add: new Date(),
      early_rehabilitation_date_type: 0,
      item2_disable: true,
      alert_message: '',
      needSelectDoctor: false,
      alert_messages: '',
      karte_status: 0,
    };
    this.disease_start_day_select = [
      {id:"0", value: "開始日"},
      {id:"1", value: "発症日"},
      {id:"2", value: "手術日"},
      {id:"3", value: "急性増悪日"},
      {id:"4", value: "治療開始日"},
      {id:"5", value: "診断日"},
      {id:"8", value: "新たな治療開始日"},
      {id:"9", value: "新たな発症日"},
    ];
    this.early_rehbily_day_select = [
      {id:"0", value: "開始日"},
      {id:"1", value: "発症日"},
      {id:"2", value: "手術日"},
      {id:"3", value: "急性増悪日"},
    ];
  }
  
  async componentDidMount() {
    var base_modal = document.getElementsByClassName("outpatient-modal")[0];
    base_modal.style['z-index'] = 1040;
    await apiClient.get("/app/api/v2/secure/staff/search?")
      .then((res) => {
        let staff_list_by_number = {};
        if (res != undefined){
          Object.keys(res).map((key) => {
            staff_list_by_number[res[key].number] = res[key].name;
          });
        }
        this.setState({
          staffs: res,
          staff_list_by_number
        });
      });
    await apiClient.post("/app/api/v2/order/guidance/searchItem", {params: {function_id:5,item_category_id:0}}).then(res=>{
      if (res) {
        this.setState({
          detail_item_master: res
        })
      }
    });
    let path = "/app/api/v2/master/rehabilitation";
    let post_data = {
      system_patient_id: this.props.patientId
    };
    
    await apiClient._post(path,
      {params: post_data})
      .then((res) => {
        if (res) {
          this.setState({
            all_data: res,
            therapy_item1_master:res.therapy_item1_master,
            position_master:res.position_master,
            exam_result: res.exam_result,
            addition_master:res.addition_master,
            is_loaded:true,
            additions:res.additions,
            additions_check:{},
            additions_send_flag_check:{},
          });
        }
      })
      .catch(() => {
      });
    this.setTab(1);
    if(this.props.cache_index !== undefined && this.props.cache_index != null)
      this.loadFromCache(this.props.cache_index);
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    
    let _state = {
      doctors: data
    };
    
    if (this.props.cache_index == undefined || this.props.cache_index) {
      _state.karte_status = this.context.karte_status.code == 0 ? 1 : this.context.karte_status.code == 1 ? 3 : 2;
    }
    
    this.setState(_state);
    
    var disease_tbody = document.getElementsByClassName('disease_tbody')[0];
    var work_list = document.getElementsByClassName('work-list')[0];
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      disease_tbody.style['height'] = '2.5rem';
      work_list.style['height'] = '5.5rem';
    } else if(parseInt(width) < 1441){
      work_list.style['height'] = '7rem';
      disease_tbody.style['height'] = '3.5rem';
    } else if(parseInt(width) < 1601){
      work_list.style['height'] = '8rem';
      disease_tbody.style['height'] = '5.8rem';
    } else if(parseInt(width) < 1681){
      disease_tbody.style['height'] = '7.5rem';
      work_list.style['height'] = '10rem';
    } else if(parseInt(width) > 1919){
      disease_tbody.style['height'] = '10rem';
      work_list.style['height'] = '14rem';
    }
    
    $(document).ready(function(){
      $(window).resize(function(){
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        if(parseInt(width) < 1367){
          disease_tbody.style['height'] = '2.5rem';
          work_list.style['height'] = '5.5rem';
        } else if(parseInt(width) < 1441){
          work_list.style['height'] = '7rem';
          disease_tbody.style['height'] = '3.5rem';
        } else if(parseInt(width) < 1601){
          work_list.style['height'] = '8rem';
          disease_tbody.style['height'] = '5.8rem';
        } else if(parseInt(width) < 1681){
          disease_tbody.style['height'] = '7.5rem';
          work_list.style['height'] = '10rem';
        } else if(parseInt(width) > 1919){
          disease_tbody.style['height'] = '10rem';
          work_list.style['height'] = '14rem';
        }
      });
    });
  }
  
  //療法項目１選択
  selectTherapyItemFirst = (id,name,receipt_key) => {
    this.searchAddition(receipt_key,"first");
    let master_data = this.state.all_data;
    let therapy_item2_master = master_data.therapy_item2_master;
    let filteredArray = therapy_item2_master.filter(item => {
      if (item.therapy_item1_id === id) return item;
    });
    let {item_details} = this.state;
    this.setState({
      therapy_item1_id: id,
      therapy_item1_name: name,
      therapy_item2_master:filteredArray,
      therapy_item2_id: 0,
      therapy_item2_name: '',
      enable_position1:1,
      enable_position2:1,
      position1_id:0,
      position1_name:"",
      position2_id:0,
      position2_name:"",
      item_details,
      item2_disable: true,
      therapy_item2_unit: ''
    })
  };
  // 療法項目2選択
  selectTherapyItemSecond = (item2_master) => {
    this.searchAddition(item2_master.receipt_key,"second");
    let {item_details} = this.state;
    this.setState({
      therapy_item2_id: item2_master.therapy_item2_id,
      therapy_item2_name: item2_master.therapy_item2_name,
      enable_position1: item2_master.enable_position1,
      enable_position2: item2_master.enable_position2,
      position1_id:0,
      position1_name:"",
      position2_id:0,
      position2_name:"",
      item_details,
      item2_disable:item2_master.quantity_is_enabled != 1,
      therapy_item2_unit:item2_master.unit,
    })
  };
  // 部位1選択
  selectFirstPosition = (id,name,receipt_key) => {
    this.searchAddition(receipt_key,"third");
    let {item_details} = this.state;
    this.setState({
      position1_id:id,
      position1_name:name,
      item_details
    })
  };
  // 部位2選択
  selectSecondPosition = (id,name,receipt_key) => {
    this.searchAddition(receipt_key,"forth");
    let {item_details} = this.state;
    this.setState({
      position2_id:id,
      position2_name:name,
      item_details
    })
  };
  // 表示対象科
  getDepartment = e => {
    this.setState({
      display_department_id:e.target.id,
      department_name: e.target.value
    })
  };
  // 急性憎悪日, 廃用症候群憎悪日, 急性期疾患起算日
  getDate = (type, value) => {
    this.setState({
      [type]: value,
    });
  };
  // 依頼日
  getRequestDate = value => {
    this.setState({
      request_date: value,
    });
  };
  // 処方日
  getPrescriptionDate = value => {
    this.setState({
      prescription_date: value,
    });
  };
  // 起算日
  getCalculationDate = value => {
    this.setState({
      calculation_start_date: value,
    });
  };
  // 実施希望日
  getDoneDate = value => {
    this.setState({done_want_date: value});
  };
  // 発症日
  getOccurDate = (value, idx) => {
    let disease_list = this.state.disease_list;
    if (disease_list[idx] != null && disease_list[idx] != undefined) {
      disease_list[idx].occur_date = formatDateLine(value);
      disease_list[idx].treat_start_date = "";
    }
    this.setState({
      disease_list
    });
    
  };
  // 治療開始
  getTreatDate = (value, idx) => {
    let disease_list = this.state.disease_list;
    if (disease_list[idx] != null && disease_list[idx] != undefined) {
      disease_list[idx].treat_start_date = formatDateLine(value);
      disease_list[idx].occur_date = "";
    }
    this.setState({
      disease_list
    });
  };
  
  // 発症日・治療開始 radio box
  getDateType = (value, idx) => {
    let disease_list = this.state.disease_list;
    if (disease_list[idx] != null && disease_list[idx] != undefined) {
      disease_list[idx].date_type = parseInt(value);
    }
    this.setState({
      disease_list
    });
  };
  // 療法項目2の数量
  getItem2Value = (e) => {
    let val = e.target.value;
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(val)) {
      return;
    }
    if (!this.numberValidate(val)) return;
    this.setState({
      therapy_item2_amount: val
    })
  }
  save = (done_flag=0) =>{
    if (!(this.state.number > 0) && !this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.REGISTER_PROXY)) return;
    if (!this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.EDIT_PROXY)) return;
    let detail_data = this.state.detail_json_array;
    let error_flag = 1;
    Object.keys(detail_data).map(key=>{
      if(detail_data[key].length > 0){
        error_flag = 0;
      }
    });
    if(error_flag === 1){
      window.sessionStorage.setItem("alert_messages", "内容を選択してください。");
      return;
    }
    if(this.state.request_date === undefined || this.state.request_date == null || this.state.request_date === ""){
      window.sessionStorage.setItem("alert_messages", "依頼日を選択してください。");
      return;
    }
    if(this.state.prescription_date === undefined || this.state.prescription_date == null || this.state.prescription_date === ""){
      window.sessionStorage.setItem("alert_messages", "処方日を選択してください。");
      return;
    }
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'登録しますか？',
      done_flag,
    });
  }
  
  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('karte', 'rehability', 'rehabily', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  
  saveData = () =>{
    this.confirmCancel();
    let result = this.saveCache(this.state.done_flag);
    if(result !== "success"){
      window.sessionStorage.setItem("alert_messages", result);
      return;
    }
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  };
  
  // 経過・RISK・合併症等(フリー入力)
  getComment = e => {
    // var word = this.lineBreak(e.target.value);
    var word = e.target.value;
    this.setState({free_comment: word})
  };
  
  lineBreak = (cur_word, word_length=25) => {
    var lines = cur_word.split("\n");
    var lines_code = [];
    lines.map((item)=>{
      if(item.length >word_length) {
        var parts = item;
        do {
          let res = parts.slice(0,word_length);
          parts = parts.slice(word_length);
          lines_code.push(res);
        } while(parts.length >= word_length);
        if(parts != "") lines_code.push(parts);
        
      } else {
        lines_code.push(item);
      }
    });
    return lines_code.join("\n");
  };
  
  clearComment = () => {
    if (this.state.free_comment == undefined || this.state.free_comment == '' || this.state.free_comment == null) return;
    this.setState({
      isClearConfirmModal:true,
      confirm_message:'経過・RISK・合併症等(フリー入力)を削除しますか？',
      clear_type:'free_comment',
    })
    
  };
  clearSpecialNote = () => {
    if (this.state.special_comment == undefined || this.state.special_comment == '' || this.state.special_comment == null) return;
    this.setState({
      isClearConfirmModal:true,
      confirm_message:'特記事項を削除しますか？',
      clear_type:'special_comment',
    })
  };
  clearConfirm = (type) => {
    this.confirmCancel();
    switch(type){
      case 'free_comment':
        this.setState({free_comment: ""})
        break;
      case 'special_comment':
        this.setState({special_comment: ""})
        break;
    }
  }
  
  getSpecialNote = e => {
    // var word = this.lineBreak(e.target.value);
    var word = e.target.value;
    this.setState({special_comment: word})
  };
  setSearchType = (e) =>{
    this.setState({status_type:e.target.value})
  };
  setDateType = (idx, e) =>{
    let disease_list = this.state.disease_list;
    if (disease_list[idx] !== undefined && disease_list[idx] != null) {
      disease_list[idx].date_type = parseInt(e.target.id);
      disease_list[idx].date_type_name = e.target.value;
    }
    this.setState({
      disease_list
    });
  };
  setEarlyDateType = (e) =>{
    this.setState({
      early_rehabilitation_date_type: parseInt(e.target.id),
      early_rehabilitation_date_type_name: e.target.value,
    });
  };
  setDiseaseType = (e) =>{
    this.setState({disease_type:e.target.value})
  };
  setStartPlace = (e) =>{
    this.setState({start_place:e.target.value})
  };
  setInfectionExist = (e) =>{
    this.setState({infection_exist:e.target.value})
  };
  getRadio = (name, index) => {
    if (name === "check") {
      let set_detail = this.state.set_detail;
      if(set_detail[index]['check']){
        set_detail[index]['check'] = 0;
      } else {
        set_detail[index]['check'] = 1;
      }
      this.setState({set_detail});
    } else if (name == "early-rehabilitation") {
      this.setState({
        early_rehabilitation: (this.state.early_rehabilitation + 1) % 2
      });
    }
  };
  
  openSetDetailModal = value => {
    if (value == undefined || value == null) return;
    this.setState({
      isSetDetailModal: true,
      modal_type:"rehabily",
      setDetailData: value,
    });
  };
  selectRequestDoctor = () => {
    this.setState({
      isShowStaffList: true,
      request_doctor: true,
      prescription_doctor: false,
    });
  };
  selectPrescriptionDoctor = () => {
    this.setState({
      isShowStaffList: true,
      request_doctor: false,
      prescription_doctor: true,
    });
  };
  selectStaff = (staff) => {
    if (this.state.request_doctor){
      this.setState({
        request_doctor_number:staff.number,
        request_doctor_name:staff.name,
      });
    }
    if (this.state.prescription_doctor){
      this.setState({
        prescription_doctor_number:staff.number,
        prescription_doctor_name:staff.name,
      });
    }
    this.closeDoctorSelectModal();
  };
  
  closeDoctorSelectModal = () => {
    this.setState({
      isShowStaffList:false
    });
  };
  
  closeModal = () => {
    this.setState({
      isPracticeSelectModal:false,
      isOpenSelectDiseaseModal:false,
      isOpenRegisterDiseaseModal:false,
      isItemSelectModal: false,
      isSetDetailModal: false,
      openItemMaterModal: false,
      isAddDiseaseNameModal: false,
      alert_messages: ''
    });
  };
  
  setTab = ( val ) => {
    let therapy_item1_master = this.state.all_data.therapy_item1_master;
    let filteredArray = therapy_item1_master.filter(item=>{
      if(item.therapy_id == val) return item;
    });
    this.setState({
      tab_id:parseInt(val),
      therapy_item1_master: filteredArray,
      position1_id:0,
      position1_name:"",
      position2_id:0,
      position2_name:"",
      therapy_item1_id: 0,
      therapy_item1_name: "",
      therapy_item2_master:[],
      therapy_item2_id: 0,
      therapy_item2_name: '',
      therapy_item2_amount: '',
      therapy_item2_unit: '',
      item2_disable: true
    });
  };
  
  loadFromCache = (index) => {
    let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT, index);
    if (this.props.cache_data != undefined && this.props.cache_data != null) cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
    if (cache_data === undefined || cache_data == null) return;
    let detail_data = cache_data.detail;
    //加算項目-----------------------------------------------
    let additions_check = {};
    let additions_send_flag_check = {};
    let additions = [];
    if (this.state.additions != undefined && this.state.additions!= null){
      additions = this.state.additions;
      additions.map(addition=> {
        if (cache_data != null && cache_data.additions != undefined && cache_data.additions[addition.addition_id] != undefined){
          additions_check[addition.addition_id] = true;
          let sending_flag = cache_data.additions[addition.addition_id]['sending_flag'];
          if(sending_flag !== undefined && sending_flag !== null && sending_flag === 1){
            additions_send_flag_check[addition.addition_id] = true;
          } else {
            additions_send_flag_check[addition.addition_id] = false;
          }
        } else {
          additions_check[addition.addition_id] = false;
          additions_send_flag_check[addition.addition_id] = false;
        }
      })
    }
    this.setState({
      detail_json_array: detail_data,
      karte_status: cache_data['karte_status'],
      display_department_id: parseInt(cache_data.display_department_id),
      department_name: cache_data.department_name,
      request_doctor_number:cache_data.request_doctor_number,
      request_doctor_name:cache_data.request_doctor_name,
      prescription_date:formatDateTimeIE(cache_data.prescription_date),
      prescription_doctor_number:cache_data.prescription_doctor_number,
      prescription_doctor_name:cache_data.prescription_doctor_name,
      status_type:parseInt(cache_data.status_type),
      done_want_date:formatDateTimeIE(cache_data.done_want_date),
      free_comment:cache_data.free_comment,
      calculation_start_date: formatDateTimeIE(cache_data.calculation_start_date),
      special_comment: cache_data.special_comment,
      request_date:formatDateTimeIE(cache_data.request_date),
      acute_date:formatDateTimeIE(cache_data.acute_date),
      abandoned_syndrome_date:formatDateTimeIE(cache_data.abandoned_syndrome_date),
      acute_disease_start_date:formatDateTimeIE(cache_data.acute_disease_start_date),
      disease_type:cache_data.disease_type,
      start_place:cache_data.start_place,
      social_goal_array: cache_data.social_goal_array !== undefined ? cache_data.social_goal_array : null,
      basic_policy_array:cache_data.basic_policy_array !== undefined ? cache_data.basic_policy_array : null,
      fault_name_array:cache_data.fault_name_array !== undefined ? cache_data.fault_name_array : null,
      disease_list:cache_data.disease_list !== undefined && cache_data.disease_list != null ? cache_data.disease_list : [],
      calculation_category: cache_data.calculation_category !== undefined ? cache_data.calculation_category : "",
      infection_exist: cache_data.infection_exist !== undefined ? cache_data.infection_exist: this.state.infection_exist,
      number: cache_data.number !== undefined ? cache_data.number : 0,
      isForUpdate: cache_data.isForUpdate !== undefined && cache_data.number > 0 ? 1 : 0,
      done_order: cache_data.done_order !== undefined ? cache_data.done_order : 0,
      created_at: cache_data.created_at !== undefined ? cache_data.created_at : '',
      early_rehabilitation: cache_data.early_rehabilitation !== undefined ? cache_data.early_rehabilitation : 0,
      early_rehabilitation_date_type: cache_data.early_rehabilitation_date_type !== undefined ? cache_data.early_rehabilitation_date_type : 0,
      developed_date_for_add: cache_data.developed_date_for_add !== undefined && cache_data.developed_date_for_add !== null ? formatDateTimeIE(cache_data.developed_date_for_add) : new Date(),
      additions_check,
      additions_send_flag_check,
    })
  };
  
  saveCache = (done_flag) => {
    let detail_data = this.state.detail_json_array;
    let error_flag = 1;
    Object.keys(detail_data).map(key=>{
      if(detail_data[key].length > 0){
        error_flag = 0;
      }
    });
    if(error_flag === 1){
      return "内容を選択してください。";
    }
    if(this.state.patient_id === undefined || this.state.patient_id == null)
      return "患者様を選択してください。";
    if(this.state.request_date === undefined || this.state.request_date == null || this.state.request_date === "")
      return "依頼日を選択してください。";
    if(this.state.prescription_date === undefined || this.state.prescription_date == null || this.state.prescription_date === "")
      return "処方日を選択してください。";
    if(this.state.early_rehabilitation == 1 && (this.state.developed_date_for_add == undefined || this.state.developed_date_for_add == null || this.state.developed_date_for_add == "")) {
      return "早期リハビリテーションの" + REHABILY_DISEASE[this.state.early_rehabilitation_date_type] + "が入力されていません";
    }
    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    
    let value = {
      number: this.state.number,
      isForUpdate: this.state.isForUpdate,
      karte_status: this.state.karte_status,
      system_patient_id: this.state.patient_id,
      request_date: (this.state.request_date != null && this.state.request_date != "") ? formatDateLine(this.state.request_date) : "",
      prescription_date: (this.state.prescription_date != null && this.state.prescription_date != "") ? formatDateLine(this.state.prescription_date) : "",
      done_want_date: (this.state.done_want_date != null && this.state.done_want_date != "") ? formatDateLine(this.state.done_want_date) : "",
      calculation_start_date: formatDateLine(this.state.calculation_start_date),
      request_doctor_number: authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      request_doctor_name: authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      prescription_doctor_number:authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      prescription_doctor_name:authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      free_comment:this.state.free_comment,
      special_comment: this.state.special_comment,
      department_id: this.context.department.code == 0 ? 1 : this.context.department.code,
      display_department_id: this.state.display_department_id,
      department_name: this.state.department_name,
      doctor_code: authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      doctor_name: authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      status_type:this.state.status_type,
      treat_date:(this.state.done_want_date != null && this.state.done_want_date != "") ? formatDateLine(this.state.done_want_date) : null,
      done_order: done_flag == 1 ? done_flag : this.state.done_order,
      detail:detail_data,
      acute_date:formatDateLine(this.state.acute_date),
      abandoned_syndrome_date: formatDateLine(this.state.abandoned_syndrome_date),
      acute_disease_start_date: formatDateLine(this.state.acute_disease_start_date),
      disease_type:this.state.disease_type,
      start_place: this.state.start_place,
      basic_policy_array: this.state.basic_policy_array,
      fault_name_array: this.state.fault_name_array,
      social_goal_array: this.state.social_goal_array,
      disease_list: this.state.disease_list,
      calculation_category: this.state.calculation_category,           // 算定区分
      infection_exist: this.state.infection_exist,                     // 感染症有無
      early_rehabilitation: this.state.early_rehabilitation,           // 早期リハビリテーション
      early_rehabilitation_date_type: this.state.early_rehabilitation_date_type,
      developed_date_for_add: this.state.early_rehabilitation == 1 ? formatDateLine(this.state.developed_date_for_add) : '',
      created_at: this.state.created_at,
    };
    if(this.state.isForUpdate === 1 && this.props.cache_index != null){
      let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT, this.props.cache_index);
      if(cache_data !== undefined && cache_data != null && cache_data.last_doctor_code !== undefined){
        value.last_doctor_code = cache_data.last_doctor_code;
        value.last_doctor_name = cache_data.last_doctor_name;
      }
      if (this.props.cache_data !== undefined && this.props.cache_data != null){
        cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
        value.last_doctor_code = cache_data.doctor_code;
        value.last_doctor_name = cache_data.doctor_name;
      }
    }
    
    let additions = {};
    //加算項目------------------------------
    if(this.state.additions !== undefined && this.state.additions != null && Object.keys(this.state.additions_check).length > 0){
      Object.keys(this.state.additions_check).map(key => {
        if (this.state.additions_check[key]){
          let addition_row = '';
          this.state.additions.map(addition => {
            if (addition.addition_id == key){
              addition['sending_flag'] = 2;
              if(addition.sending_category === 1){
                addition['sending_flag'] = 1;
              }
              if(addition.sending_category === 3 && this.state.additions_send_flag_check[key]){
                addition['sending_flag'] = 1;
              }
              addition_row = addition;
            }
          });
          additions[key] = addition_row;
        }
      })
    }
    value.additions = additions;
    if (authInfo.staff_category !== 1){
      value.substitute_name = authInfo.name;
    }
    if(this.props.cache_index != null){
      karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT, this.props.cache_index, JSON.stringify(value), 'insert');
    } else {
      karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.RIHABILY_EDIT, new Date().getTime(), JSON.stringify(value), 'insert');
    }
    return "success";
  };
  
  validateDetail = () => {
    if (this.state.therapy_item1_name === undefined || this.state.therapy_item1_name === "") {
      return '療法項目１を選択してください。';
    }
    if (this.state.therapy_item2_name === undefined || this.state.therapy_item2_name === "") {
      return '療法項目2を選択してください。';
    }
    if (this.state.enable_position1 !== 0){
      if (this.state.position1_name === undefined || this.state.position1_name === "") {
        return '部位1を選択してください。';
      }
    }
    if (this.state.enable_position2 !== 0){
      if (this.state.position2_name === undefined || this.state.position2_name === "") {
        return '部位2を選択してください。';
      }
    }
    let error_str = '';
    Object.keys(this.state.item_details).map((index) => {
      if(this.state.item_details[index]['item_id'] !== 0 && ((this.state.item_details[index]['value1'] === undefined || this.state.item_details[index]['value1'] == null || this.state.item_details[index]['value1'] === ""))){
        if (this.state.item_details[index]['attribute1'] === 2){ // 属性が数字なら
          error_str = '数値が入力されていません';
        } else {
          if (this.state.item_details[index]['attribute1'] != null && this.state.item_details[index]['attribute1'] != 0){
            error_str = '内容が入力されていません';
          }
        }
      }
    });
    if (error_str != '') {
      return error_str;
    }
    return '';
  };
  
  addDetail = () => {
    let detail_array = this.state.detail_json_array;
    let error_str = this.validateDetail();
    if (error_str != '') {
      this.setState({alert_messages: error_str});
      return;
    }
    let item_details = [];
    Object.keys(this.state.item_details).map((index) => {
      if(this.state.item_details[index]['item_id'] !== 0){
        let detail_row = {};
        Object.keys(this.state.item_details[index]).map(idx=>{
          detail_row[idx] = this.state.item_details[index][idx];
        });
        item_details.push(detail_row);
      }
    });
    let detail_json = {
      number: 0,
      detail_id: detail_array.length + 1,
      therapy_id: parseInt(this.state.tab_id),
      therapy_item1_id:this.state.therapy_item1_id,
      therapy_item1_name:this.state.therapy_item1_name,
      therapy_item2_id:this.state.therapy_item2_id,
      therapy_item2_name:this.state.therapy_item2_name,
      position1_id:this.state.position1_id,
      position1_name:this.state.position1_name,
      position2_id:this.state.position2_id,
      position2_name:this.state.position2_name,
      item_details,
      therapy_item2_amount: this.state.therapy_item2_amount,
      therapy_item2_unit: this.state.therapy_item2_unit,
      order_number:0,
    };
    detail_array[this.state.tab_id].push(detail_json);
    this.setState({
      detail_json_array:detail_array,
      item_details:[
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ],
    });
    this.setTab(this.state.tab_id);
  };
  
  handleClick = (e, index) => {
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
        .getElementById("list-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("list-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -80,
          y: e.clientY + window.pageYOffset-5
        },
        index: index,
        delete_item: "detail",
      });
    }
  };
  
  contextMenuAction = (type, index ) => {
    if (type === "delete"){
      this.setState({
        isDeleteConfirmModal : true,
        confirm_message: "削除しますか？",
        delete_id: index,
      });
    }
  };
  
  diseaseHandleClick = (e, index) => {
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
        .getElementById("disease-list-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("disease-list-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -80,
          y: e.clientY + window.pageYOffset-5
        },
        index: index,
        delete_item: "disease",
      });
    }
  };
  
  contextMenuAction = (type, index ) => {
    if (type === "delete"){
      this.setState({
        isDeleteConfirmModal : true,
        confirm_message: "削除しますか？",
        delete_id: index,
      });
    }
  };
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isUpdateConfirmModal: false,
      isClearConfirmModal: false,
      confirm_message: "",
    });
  }
  
  deleteData = async () => {
    this.confirmCancel();
    if (this.state.delete_item !== undefined && this.state.delete_item === "disease") {  // 対象疾患削除
      let diseae_array = this.state.disease_list;
      diseae_array.splice(this.state.delete_id,1);
      this.setState({
        disease_list:diseae_array,
      });
    } else {
      let detail_array = this.state.detail_json_array;
      detail_array[this.state.tab_id].splice(this.state.delete_id,1);
      this.setState({
        detail_json_array:detail_array,
      });
    }
  };
  
  addFaultName = () => {
    this.setState({
      openItemMaterModal: true,
      item_mater_title: "障害名",
      modal_data: this.state.fault_name_array,
    });
  };
  
  addBasicPolicy = () => {
    this.setState({
      openItemMaterModal: true,
      item_mater_title: "基本方針",
      modal_data: this.state.basic_policy_array,
    });
  };
  
  addSocialGoal = () => {
    this.setState({
      openItemMaterModal: true,
      item_mater_title: "社会的ゴール",
      modal_data: this.state.social_goal_array,
    });
  };
  
  openRehabilyItemModal = () => {
    this.setState({
      openItemMaterModal: true,
      item_mater_title: "算定区分",
      modal_data: this.state.calculation_category
    })
  };
  
  setTherapyItem = (data) => {
    if (data === undefined || data == null || data.length === 0) return;
    if (this.state.item_mater_title === "基本方針") {
      this.setState({basic_policy_array:data})
    } else if (this.state.item_mater_title === "社会的ゴール") {
      this.setState({social_goal_array:data});
    } else if (this.state.item_mater_title === "障害名") {
      this.setState({fault_name_array:data});
    } else if (this.state.item_mater_title === "算定区分") {
      this.setState({calculation_category:data});
    }
    this.setState({
      openItemMaterModal: false,
    });
  };
  
  setItemDetails =(data)=>{
    this.setState({item_details:data});
  };
  
  selectDetail = (index) => {
    let detail_json = this.state.detail_json_array[this.state.tab_id][index];
    if (detail_json == null) return;
    let master_data = this.state.all_data;
    let therapy_item2_master = master_data.therapy_item2_master;
    let filteredArray = therapy_item2_master.filter(item => {
      if (detail_json.therapy_item1_id !== undefined && item.therapy_item1_id === detail_json.therapy_item1_id) return item;
    });
    let therapy_item2 = null;
    if (filteredArray != null && detail_json.therapy_item2_id !== undefined) {
      therapy_item2 = filteredArray.find(x=>x.therapy_item2_id == detail_json.therapy_item2_id);
    }
    this.setState({
      selected_detail_index:index,
      therapy_item2_master: filteredArray,
      therapy_item1_id:detail_json.therapy_item1_id !== undefined ? detail_json.therapy_item1_id : 0,
      therapy_item1_name:detail_json.therapy_item1_name !== undefined ? detail_json.therapy_item1_name : "",
      therapy_item2_id:detail_json.therapy_item2_id !== undefined ? detail_json.therapy_item2_id : 0,
      therapy_item2_name:detail_json.therapy_item2_name !== undefined ? detail_json.therapy_item2_name : "",
      position1_id:detail_json.position1_id !== undefined ? detail_json.position1_id : 0,
      enable_position1: therapy_item2 != null ? therapy_item2.enable_position1 :1,
      enable_position2: therapy_item2 != null ? therapy_item2.enable_position2 :1,
      position1_name:detail_json.position1_name !== undefined ? detail_json.position1_name : "",
      position2_id:detail_json.position2_id !== undefined ? detail_json.position2_id : 0,
      position2_name:detail_json.position2_name !== undefined ? detail_json.position2_name : "",
      item_details:detail_json.item_details !== undefined && detail_json.item_details != null && detail_json.item_details.length >0 ? detail_json.item_details : this.state.item_details,
      therapy_item2_amount:detail_json.therapy_item2_amount != undefined ? detail_json.therapy_item2_amount: '',
      therapy_item2_unit: therapy_item2.unit,
      item2_disable:therapy_item2.quantity_is_enabled != 1,
      order_number: detail_json.order_number != undefined ? detail_json.order_number : 0,
    })
  };
  
  changeDetailItem = () => {
    if (this.state.selected_detail_index == undefined) return;
    let detail_array = this.state.detail_json_array;
    let error_str = this.validateDetail();
    if (error_str != '') {
      this.setState({alert_messages: error_str});
      return;
    }
    let item_details = [];
    Object.keys(this.state.item_details).map((index) => {
      if(this.state.item_details[index]['item_id'] !== 0){
        if (this.state.item_details[index]['attribute1'] === 2 ){ // 属性が数字なら
          if ((this.state.item_details[index]['value1'] !== "" && this.state.item_details[index]['value1'] != null) || (this.state.item_details[index]['value2'] !== "" && this.state.item_details[index]['value2'] != null)) {
            let detail_row = {};
            Object.keys(this.state.item_details[index]).map(idx=>{
              detail_row[idx] = this.state.item_details[index][idx];
            });
            item_details.push(detail_row);
          }
        } else {
          let detail_row = {};
          Object.keys(this.state.item_details[index]).map(idx=>{
            detail_row[idx] = this.state.item_details[index][idx];
          });
          item_details.push(detail_row);
        }
      }
    });
    let detail_json = {
      number: 0,
      detail_id: detail_array.length + 1,
      therapy_id: parseInt(this.state.tab_id),
      therapy_item1_id:this.state.therapy_item1_id,
      therapy_item1_name:this.state.therapy_item1_name,
      therapy_item2_id:this.state.therapy_item2_id,
      therapy_item2_name:this.state.therapy_item2_name,
      position1_id:this.state.position1_id,
      position1_name:this.state.position1_name,
      position2_id:this.state.position2_id,
      position2_name:this.state.position2_name,
      item_details,
      therapy_item2_amount: this.state.therapy_item2_amount,
      therapy_item2_unit: this.state.therapy_item2_unit,
      order_number: this.state.order_number
    };
    detail_array[this.state.tab_id][this.state.selected_detail_index] = detail_json;
    this.setState({
      detail_json_array:detail_array,
      item_details:[
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ],
    });
    this.setTab(this.state.tab_id);
  };
  
  stopChange = () =>{
    if (this.state.selected_detail_index == undefined) return;
    this.setTab(this.state.tab_id);
    this.setState({
      item_details:[
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ],
    })
  };
  
  insertDiseaseR = () => {
    this.setState({
      isOpenSelectDiseaseModal: true,
      selected_disease_idx: null
    });
  };
  
  insertDiseaseNew = () => {
    this.setState({
      isAddDiseaseNameModal:true,
      selected_disease_idx: null
    });
  };
  
  setDiseaseName =  (idx) => {
    this.setState({
      isOpenRegisterDiseaseModal: true,
      selected_disease_idx: idx
    });
  };
  
  isExistDisease = (number) => {
    if (number == null || number === undefined) return false;
    let disease_list = this.state.disease_list;
    let result = false;
    if (disease_list != null && disease_list !== undefined && disease_list.length > 0 ) {
      disease_list.map(item=>{
        if (item.number === number) {
          result = true;
        }
      });
    }
    return result;
  };
  
  selectDiseaseName = (disease_name, disease_item) => {
    if(disease_item === undefined || disease_item == null || disease_name == "") return;
    if (this.isExistDisease(disease_item.number)) {
      window.sessionStorage.setItem("alert_messages", disease_name + "は既に存在します。");
      return;
    }
    let disease_list = this.state.disease_list;
    if (disease_list.length > 0 && this.state.selected_disease_idx != null && disease_list[this.state.selected_disease_idx] !== undefined && disease_list[this.state.selected_disease_idx] != null) {
      disease_list[this.state.selected_disease_idx].number = disease_item.number;
      disease_list[this.state.selected_disease_idx].disease_name = disease_item.disease_name;
      disease_list[this.state.selected_disease_idx].start_date = disease_item.start_date;
      if (this.state.selected_disease_idx == 0) {
        disease_list[this.state.selected_disease_idx].r_flag = 1;
      }
    } else {
      let insert_item = {
        number: disease_item.number,
        disease_name: disease_item.disease_name,
        occur_date: "",
        treat_start_date: "",
        date_type: 0,
        start_date: disease_item.start_date
      };
      if (this.state.selected_disease_idx == 0) {
        insert_item.r_flag = 1;
      }
      disease_list.push(insert_item);
    }
    
    this.setState({
      isOpenSelectDiseaseModal: false,
      isOpenRegisterDiseaseModal: false,
    });
  };
  
  searchAddition (receipt_key,step) {
    let receipt_key_array = [];
    if (step==="first"){
      if (receipt_key != null && receipt_key !== ""){
        receipt_key_array.push(receipt_key.split(","));
      }
    } else if  (step==="second") {
      let item1 = this.state.therapy_item1_master.find(x=>x.therapy_item1_id === this.state.therapy_item1_id);
      if (item1 !== undefined && item1.receipt_key != null && item1.receipt_key !== "") {
        receipt_key_array.push(item1.receipt_key.split(","));
      }
      if (receipt_key != null && receipt_key !== ""){
        receipt_key_array.push(receipt_key.split(","));
      }
    } else if  (step==="third") {
      let item1 = this.state.therapy_item1_master.find(x=>x.therapy_item1_id === this.state.therapy_item1_id);
      if (item1 !== undefined && item1.receipt_key != null && item1.receipt_key !== "") {
        receipt_key_array.push(item1.receipt_key.split(","));
      }
      let item2 = this.state.therapy_item2_master.find(x=>x.therapy_item2_id === this.state.therapy_item2_id);
      if (item2 !== undefined && item2.receipt_key != null && item2.receipt_key !== "") {
        receipt_key_array.push(item2.receipt_key.split(","));
      }
      let item3 = this.state.position_master.find(x=>x.position_id === this.state.position2_id);
      if (item3 !== undefined && item3.receipt_key != null && item3.receipt_key !== "") {
        receipt_key_array.push(item3.receipt_key.split(","));
      }
      if (receipt_key != null && receipt_key !== ""){
        receipt_key_array.push(receipt_key.split(","));
      }
    } else if  (step==="forth") {
      let item1 = this.state.therapy_item1_master.find(x=>x.therapy_item1_id === this.state.therapy_item1_id);
      if (item1 !== undefined && item1.receipt_key != null && item1.receipt_key !== "") {
        receipt_key_array.push(item1.receipt_key.split(","));
      }
      let item2 = this.state.therapy_item2_master.find(x=>x.therapy_item2_id === this.state.therapy_item2_id);
      if (item2 !== undefined && item2.receipt_key != null && item2.receipt_key !== "") {
        receipt_key_array.push(item2.receipt_key.split(","));
      }
      let item3 = this.state.position_master.find(x=>x.position_id === this.state.position1_id);
      if (item3 !== undefined && item3.receipt_key != null && item3.receipt_key !== "") {
        receipt_key_array.push(item3.receipt_key.split(","));
      }
      if (receipt_key != null && receipt_key !== ""){
        receipt_key_array.push(receipt_key.split(","));
      }
    }
    if (receipt_key_array.length === 0) {
      this.setState({
        item_details: [
          {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
        ]
      })
    }
    let {addition_master, detail_item_master} = this.state;
    let addition_item_array = [];
    receipt_key_array.map(sub_item => {
      sub_item.map(item=>{
        addition_master.map(add_item=>{
          if (add_item.receipt_key !== undefined && add_item.receipt_key != null && add_item.item_id != null && add_item.receipt_key !== "" && add_item.receipt_key.split(",").includes(item)){
            let add_detail_item = detail_item_master.find(x=>x.item_id == add_item.item_id);
            addition_item_array.push(add_detail_item)
          }
        })
      });
    });
    this.changeDetailFormat(addition_item_array)
  }
  
  changeDetailFormat(addition_item_array) {
    let new_item_details = [];
    if (addition_item_array.length > 0){
      addition_item_array.map(item=>{
        let detail = {};
        detail['classfic'] = item.item_category_id;
        detail['classfic_name'] = (item.item_category_id === 0) ? '' : this.state.item_categories[item.item_category_id];
        detail['item_id'] = item.item_id;
        detail['item_name'] = item.name;
        detail['delete'] = false;
        if(item.input_item1_flag === 1){
          detail['attribute1'] = item.input_item1_attribute;
          detail['format1'] = item.input_item1_format;
          detail['unit_name1'] = item.input_item1_unit;
          detail['max_length1'] = item.input_item1_max_length;
          if(detail['attribute1'] === 4){
            detail['value1'] = formatDateLine(new Date());
            let cur_date = new Date(detail['value1']);
            let cur_year = cur_date.getFullYear();
            let cur_month = cur_date.getMonth() + 1;
            let cur_day = cur_date.getDate();
            detail['value1_format'] = this.state.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
          }
        }
        if(item.input_item2_flag === 1){
          detail['attribute2'] = item.input_item2_attribute;
          detail['format2'] = item.input_item2_format;
          detail['unit_name2'] = item.input_item2_unit;
          detail['max_length2'] = item.input_item2_max_length;
          if(detail['attribute2'] === 4){
            detail['value2'] = formatDateLine(new Date());
            let cur_date = new Date(detail['value2']);
            let cur_year = cur_date.getFullYear();
            let cur_month = cur_date.getMonth() + 1;
            let cur_day = cur_date.getDate();
            detail['value2_format'] = this.state.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
          }
        }
        new_item_details.push(detail);
      });
      let end_row = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
      new_item_details.push(end_row);
    } else {
      new_item_details = [
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ];
    }
    this.setState({
      item_details:new_item_details,
    })
  }
  
  getAdditions = (name, number) => {
    let check_status = {};
    if (name == 'additions') {
      check_status = this.state.additions_check;
      check_status[number] = !check_status[number];
      this.setState({additions_check:check_status});
    }
  };
  
  getAdditionsSendFlag = (name, number) => {
    let check_status = {};
    if (name == 'additions_sending_flag') {
      check_status = this.state.additions_send_flag_check;
      check_status[number] = !check_status[number];
      this.setState({additions_send_flag_check:check_status});
    }
  }
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
    // this.getSetData(e.target.id, this.context.department.code, 0, 0);
  };
  
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
    this.setState({
      needSelectDoctor: false,
      request_doctor_number:id,
      request_doctor_name:name,
      prescription_doctor_number:id,
      prescription_doctor_name:name,
    })
  };
  
  closeDoctor = () => {
    this.setState({
      needSelectDoctor: false,
      canEdit: this.state.staff_category === 1,
      isCopyOrder: false,
      isEditOrder: false,
      tempItems: []
    });
  };
  
  chooseDoctor = () =>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_number > 0) return;
    // this.context.$selectDoctor(true);
    this.setState({needSelectDoctor: true});
    return;
  };
  closeValidateAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  confirmDeleteCache=()=>{
    this.props.closeModal();
  };
  
  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.confirmDeleteCache();
    }
  };
  
  numberValidate = (value) => {
    if (value == "") return true;
    value = value.toString();
    if (value.length > this.amount_max_length) return false;
    let split_val = value.split(".");
    if (split_val[0].length > this.integer_length) return false;
    if (split_val.length > 1) {
      if (split_val[1].length > this.decimal_length) return false;
    }
    return true;
  }
  saveCheck = () => {
    let result = "";
    if (!(this.state.number > 0) && !this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.REGISTER_PROXY)) result = "登録権限がありません。";
    if (!this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.EDIT_PROXY)) result = "編集権限がありません。";
    return result;
  }
  
  render() {
    let {therapy_item1_master,therapy_item2_master, position_master, detail_json_array,basic_policy_array, social_goal_array,fault_name_array, exam_result} = this.state;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let save_tooltip=this.saveCheck();
    const {
      selectedDoctor
    } = this.context;
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal outpatient-modal home-treatment-modal"
        >
          <Modal.Header>
            <Modal.Title>リハビリ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
            {this.state.is_loaded ? (
              <Wrapper>
                <div className="up-area d-flex">
                  <div className="left-area" style={{width:"40%"}}>
                    <div className="header-first border  p-1">
                      <div style={{fontWeight:"bold"}}>依頼情報</div>
                      <div className="d-flex" style={{marginTop:"-0.8rem"}}>
                        <div className="w-50 d-flex">
                          <div className="treat-date ml-1 mt-1">依頼日</div>
                          <div className="date-select no-border" style={{marginTop:0}}>
                            <DatePicker
                              locale="ja"
                              selected={this.state.request_date}
                              onChange={this.getRequestDate.bind(this)}
                              dateFormat="yyyy/MM/dd"
                              placeholderText="年/月/日"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              className={this.state.datefocus ? "readline" : ""}
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                          </div>
                        </div>
                        <div className="w-50 d-flex">
                          <div className="treat-date mt-1 mr-1">処方日</div>
                          <div className="date-select no-border" style={{marginTop:0}}>
                            <DatePicker
                              locale="ja"
                              selected={this.state.prescription_date}
                              onChange={this.getPrescriptionDate.bind(this)}
                              dateFormat="yyyy/MM/dd"
                              placeholderText="年/月/日"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              className={this.state.datefocus ? "readline" : ""}
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className='state-name w-50 remove-x-input' onClick={this.chooseDoctor.bind(this)}>
                          <InputWithLabel
                            label="依頼医"
                            type="text"
                            placeholder={'クリックで選択'}
                            isDisabled={true}
                            diseaseEditData={authInfo.doctor_number > 0 ? authInfo.name : selectedDoctor.name}
                          />
                        </div>
                        <div className='state-name w-50 remove-x-input' onClick={this.chooseDoctor.bind(this)}>
                          <InputWithLabel
                            label="処方医"
                            type="text"
                            isDisabled={true}
                            placeholder={'クリックで選択'}
                            diseaseEditData={authInfo.doctor_number > 0 ? authInfo.name : selectedDoctor.name}
                          />
                        </div>
                      </div>
                      <div className="select-box">
                        <SelectorWithLabel
                          title="表示対象科"
                          options={this.departmentOptions}
                          getSelect={this.getDepartment}
                          value={this.state.department_name}
                          departmentEditCode={this.state.display_department_id}
                        />
                      </div>
                    </div>
                    <div className="left-second border  mt-1 pl-1 pr-1 pb-1">
                      <div className={'d-flex'}>
                        <div className="search-type mb-1" style={{width:"60%"}}>
                          {Object.keys(this.state.status_type_array).map((index)=>{
                            return (
                              <>
                                <Radiobox
                                  label={this.state.status_type_array[index]}
                                  value={index}
                                  getUsage={this.setSearchType.bind(this)}
                                  checked={this.state.status_type == index ? true : false}
                                  name={`status_type`}
                                />
                              </>
                            );
                          })}
                        </div>
                        <div className="d-flex" style={{width:"40%"}}>
                          <div className="treat-date mt-1 ml-1" style={{width:"5rem"}}>実施希望日</div>
                          <div className="date-select no-border w-50">
                            <DatePicker
                              locale="ja"
                              selected={this.state.done_want_date}
                              onChange={this.getDoneDate.bind(this)}
                              dateFormat="yyyy/MM/dd"
                              placeholderText="年/月/日"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              className={this.state.datefocus ? "readline" : ""}
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="d-flex" style={{width:"60%"}}>
                          <Button onClick={this.openRehabilyItemModal}>算定区分</Button>
                          <div className="border p-1  w-100 ml-1 mr-1">{this.state.calculation_category}</div>
                        </div>
                        <div className="d-flex" style={{width:"40%"}}>
                          <div className="treat-date mt-1 ml-1" style={{width:"5rem"}}>起算日</div>
                          <div className="date-select no-border w-50">
                            <DatePicker
                              locale="ja"
                              selected={this.state.calculation_start_date}
                              onChange={this.getCalculationDate.bind(this)}
                              dateFormat="yyyy/MM/dd"
                              placeholderText="年/月/日"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              className={this.state.datefocus ? "readline" : ""}
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="left-third border  mt-1 p-1">
                      <div style={{fontWeight:"bold"}}>リハビリ対象疾患</div>
                      <div className="table-area">
                        <div className="d-flex">
                          <Button className="disease-r" onClick={this.insertDiseaseR}>▼</Button>
                          <Button className="ml-2" style={{fontSize:16, height:"1.875rem"}}  onClick={()=>this.insertDiseaseNew()}>病名新規登録</Button>
                          <div className="ml-2 mt-1">
                            先頭行「R」マークがリハビリ主病名となります。
                          </div>
                        </div>
                        <div id="disease-list-table">
                          <table className="table-scroll table table-bordered table-disease-list mt5">
                            <thead>
                            <tr className={'table-menu'}>
                              <th style={{width:"1.875rem"}}/>
                              <th className="text-center td-disease-name">病名</th>
                              <th className="text-center td-disease-type-date">発症日・治療開始</th>
                              <th className="text-center td-disease-date">病名登録日</th>
                            </tr>
                            </thead>
                            <tbody className='disease_tbody'>
                            {this.state.disease_list.length > 0 ? (
                              <>
                                {this.state.disease_list.map((item,index)=>{
                                  return (
                                    <tr key={index} onContextMenu={e => this.diseaseHandleClick(e, index)}>
                                      <td className="text-center td-no" style={{width:"1.875rem"}}>{index == 0 ? "R" : ""}</td>
                                      <td className="text-center td-disease-name">
                                        <div style={{minHeight:'1.5rem'}} className="w-100">
                                          <label className="td-disease-name-label" style={{fontSize:'0.8rem', paddingTop:'0.2rem'}}>{item.disease_name}</label>
                                          <span className="w-100 disease-add-btn">
                                                                            <button className="disease-r" onClick={()=>this.setDiseaseName(index)}>▼</button>
                                                                            </span>
                                        </div>
                                      </td>
                                      <td className="text-center date-type td-disease-type-date">
                                        <div className="d-flex" style={{minHeight:'1.5rem', paddingTop:'0.1rem'}}>
                                          {/* <Radiobox
                                                                          label={'発症日'}
                                                                          value={0}
                                                                          getUsage={(e)=>this.setDateType(e, index)}
                                                                          checked={item.date_type === 0}
                                                                          name={`date_type_${index}`}
                                                                        />
                                                                        <Radiobox
                                                                          label={'治療開始'}
                                                                          value={1}
                                                                          getUsage={(e)=>this.setDateType(e, index)}
                                                                          checked={item.date_type === 1}
                                                                          name={`date_type_${index}`}
                                                                        /> */}
                                          {this.is_enabled_rehabily_developed_date_type == "ON" ? (
                                            <>
                                              <SelectorWithLabel
                                                title=""
                                                options={this.disease_start_day_select}
                                                getSelect={this.setDateType.bind(this, index)}
                                                value={item.date_type_name}
                                                departmentEditCode={item.date_type}
                                              />
                                              <DatePicker
                                                locale="ja"
                                                selected={item.treat_start_date != "" ? formatDateTimeIE(item.treat_start_date) : ""}
                                                onChange={(val)=>this.getTreatDate(val, index)}
                                                dateFormat="yyyy/MM/dd"
                                                placeholderText="年/月/日"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                dayClassName = {date => setDateColorClassName(date)}
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <label className='label-title' style={{paddingTop:'1px'}}>開始日</label>
                                              <div className='no-border'>
                                                <DatePicker
                                                  locale="ja"
                                                  selected={item.treat_start_date != "" ? formatDateTimeIE(item.treat_start_date) : ""}
                                                  onChange={(val)=>this.getTreatDate(val, index)}
                                                  dateFormat="yyyy/MM/dd"
                                                  placeholderText="年/月/日"
                                                  showMonthDropdown
                                                  showYearDropdown
                                                  dropdownMode="select"
                                                  dayClassName = {date => setDateColorClassName(date)}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </td>
                                      <td className="td-disease-date">
                                        {formatDateSlash(item.start_date)}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </>
                            ) : (
                              <tr>
                                <td className="text-center td-no" style={{width:"1.875rem"}}>R</td>
                                <td className="td-disease-name">&nbsp;</td>
                                <td className="td-disease-type-date">&nbsp;</td>
                                <td className="td-disease-date">&nbsp;</td>
                              </tr>
                            )}
                            </tbody>
                          </table>
                        </div>
                        <div className={'d-flex earily-rehabilitation'}>
                          <div>
                            <div className={'d-flex'}>
                              <div className="mr-2" style={{paddingTop:'0.35rem'}}>早期リハビリテーション</div>
                              <div className="d-flex spec-check">
                                <Checkbox
                                  label=""
                                  getRadio={this.getRadio.bind(this)}
                                  value={this.state.early_rehabilitation}
                                  name="early-rehabilitation"
                                />
                                {this.is_enabled_rehabily_developed_date_type == "ON" ? (
                                  <>
                                    <SelectorWithLabel
                                      title=""
                                      options={this.early_rehbily_day_select}
                                      getSelect={this.setEarlyDateType.bind(this)}
                                      value={this.state.early_rehabilitation_date_type_name}
                                      departmentEditCode={this.state.early_rehabilitation_date_type}
                                    />
                                    <div className="no-border">
                                      <DatePicker
                                        locale="ja"
                                        selected={this.state.developed_date_for_add}
                                        onChange={this.getDate.bind(this, "developed_date_for_add")}
                                        dateFormat="yyyy/MM/dd"
                                        placeholderText="年/月/日"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        dayClassName = {date => setDateColorClassName(date)}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <label className='label-title' style={{paddingTop:'5px'}}>開始日</label>
                                    <div className="no-border">
                                      <DatePicker
                                        locale="ja"
                                        selected={this.state.developed_date_for_add}
                                        onChange={this.getDate.bind(this, "developed_date_for_add")}
                                        dateFormat="yyyy/MM/dd"
                                        placeholderText="年/月/日"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        dayClassName = {date => setDateColorClassName(date)}
                                      />
                                    </div>
                                  </>
                                )}
                              
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={'d-flex'}>
                          <div style={{width: "60%"}}>
                            <div className="d-flex">
                              <div className="treat-date w-50">リハビリ直告病患</div>
                              <div className="w-50 search-type">
                                {Object.keys(this.state.disease_type_array).map((index)=>{
                                  return (
                                    <>
                                      <Radiobox
                                        label={this.state.disease_type_array[index]}
                                        value={index}
                                        getUsage={this.setDiseaseType.bind(this)}
                                        checked={this.state.disease_type == index ? true : false}
                                        name={`disease_type`}
                                      />
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="d-flex mt-1">
                              <div className="treat-date" style={{width:"7rem",lineHeight:"1.7rem"}}>急性憎悪日</div>
                              <div className="date-select no-border w-50">
                                <DatePicker
                                  locale="ja"
                                  selected={this.state.acute_date}
                                  onChange={this.getDate.bind(this, "acute_date")}
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="年/月/日"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dayClassName = {date => setDateColorClassName(date)}
                                />
                              </div>
                            </div>
                            <div className="d-flex">
                              <div className="treat-date" style={{width:"7rem",lineHeight:"1.7rem"}}>廃用症候群憎悪日</div>
                              <div className="date-select no-border w-50">
                                <DatePicker
                                  locale="ja"
                                  selected={this.state.abandoned_syndrome_date}
                                  onChange={this.getDate.bind(this, "abandoned_syndrome_date")}
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="年/月/日"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  className={this.state.datefocus ? "readline" : ""}
                                  dayClassName = {date => setDateColorClassName(date)}
                                />
                              </div>
                            </div>
                            <div className="d-flex">
                              <div className="treat-date" style={{width:"7rem",lineHeight:"1.7rem"}}>急性期疾患起算日</div>
                              <div className="date-select no-border w-50">
                                <DatePicker
                                  locale="ja"
                                  selected={this.state.acute_disease_start_date}
                                  onChange={this.getDate.bind(this,"acute_disease_start_date")}
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="年/月/日"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  className={this.state.datefocus ? "readline" : ""}
                                  dayClassName = {date => setDateColorClassName(date)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'p-1'} style={{width:"40%"}}>
                            リハビリ先行病患、急性憎悪日は主病名（廃用症候群理はの場合は先行する病患名）2行目)に対して入力してください。
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="left-forth border  mt-1 p-1">
                      <div className="flex">
                        <div style={{width:60, paddingTop:"0.3rem"}}>障害名</div>
                        <Button className="ml-1 disease-r" onClick={this.addFaultName.bind(this)}>▼</Button>
                        <div className="data-content" style={{width:"85%"}}>
                          {fault_name_array != null && fault_name_array.length > 0 && fault_name_array.map(item=>{
                            return (
                              <div key={item}>{item}</div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="left-fifth border  mt-1 p-1">
                      <div>開始希望場所</div>
                      <div className="search-type">
                        {Object.keys(this.state.start_place_array).map((index)=>{
                          return (
                            <>
                              <Radiobox
                                label={this.state.start_place_array[index]}
                                value={index}
                                getUsage={this.setStartPlace.bind(this)}
                                checked={this.state.start_place == index ? true : false}
                                name={`start_place`}
                              />
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={`right-area border  p-1 ml-2 h-50`} style={{width:"60%"}} >
                    <div className="panel-menu flex">
                      {this.state.therapy != null && this.state.therapy.length > 0 && this.state.therapy.map(tab_item=>{
                        return(
                          <div key={tab_item.id} className={this.state.tab_id === tab_item.id ? 'active-menu' : 'menu-btn'} onClick={this.setTab.bind(this,tab_item.id)}>{tab_item.value}</div>
                        )
                      })}
                      <div className="no-menu"></div>
                    </div>
                    
                    <div className="flex work-list mt5">
                      <div className="area-1" style={{width:"25%"}}>
                        <div className="title">療法項目１</div>
                        <div className="content">
                          {therapy_item1_master !== undefined && therapy_item1_master.length>0 && (
                            therapy_item1_master.map(item => {
                              return (
                                <p className={item.therapy_item1_id===this.state.therapy_item1_id?"selected":""}
                                   onClick = {this.selectTherapyItemFirst.bind(this, item.therapy_item1_id,item.therapy_item1_name,item.receipt_key)}
                                   key = {item.number}>{item.therapy_item1_name}</p>
                              )
                            })
                          )}
                        </div>
                      </div>
                      <div className="area-1" style={{width:"35%"}}>
                        <div className="title">療法項目２</div>
                        <div className="content">
                          {therapy_item2_master !== undefined && therapy_item2_master.length>0 && (
                            therapy_item2_master.map(item => {
                              return (
                                <p className={item.therapy_item2_id===this.state.therapy_item2_id?"selected":""}
                                   onClick = {this.selectTherapyItemSecond.bind(this, item)} key = {item.number}
                                >{item.therapy_item2_name}</p>
                              )
                            })
                          )}
                        </div>
                      </div>
                      {/*{this.state.enable_position1 != 0 ?*/}
                      {/*    <>*/}
                      <div className="area-1 w5" style={{width:"10%"}}>
                        <div className="title">部位1</div>
                        <div className="content">
                          {position_master !== undefined && position_master.length>0 && (
                            position_master.map(item => {
                              return (
                                <>
                                  {item.position_category == 1 && (
                                    <p className={item.position_id===this.state.position1_id?"selected":""}
                                       onClick = {this.selectFirstPosition.bind(this, item.position_id, item.position_name,item.receipt_key)} key = {item.number}
                                    >{item.position_name}</p>
                                  )}
                                </>
                              )
                            })
                          )}
                        </div>
                      </div>
                      {/*</> : <>*/}
                      {/*    <div style={{width:"20%"}}></div>*/}
                      {/*</>}*/}
                      {/*{this.state.enable_position2 != 0 ?*/}
                      {/*<>*/}
                      <div className="area-1 w5" style={{width:"10%"}}>
                        <div className="title">部位2</div>
                        <div className="content">
                          {position_master !== undefined && position_master.length>0 && (
                            position_master.map(item => {
                              return (
                                <>
                                  {item.position_category == 2 && (
                                    <p className={item.position_id===this.state.position2_id?"selected":""}
                                       onClick = {this.selectSecondPosition.bind(this, item.position_id, item.position_name,item.receipt_key)} key = {item.number}
                                    >{item.position_name}</p>
                                  )}
                                </>
                              )
                            })
                          )}
                        </div>
                      </div>
                      {/*</> : <>*/}
                      {/*    <div style={{width:"20%"}}></div>*/}
                      {/*</>}*/}
                      <div className="area-1 w5" style={{width:"20%"}}>
                        <div className="title">療法項目２の数量</div>
                        <div className="content flex halfinput">
                          <InputBoxTag
                            label=""
                            type="text"
                            placeholder=""
                            getInputText={this.getItem2Value.bind(this)}
                            value={this.state.therapy_item2_amount}
                            isDisabled={this.state.item2_disable}
                            className="input-box-tag"
                          />
                          <label>{this.state.therapy_item2_unit}</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className={'set-detail-area'}>
                      <ItemTableBody
                        function_id={FUNCTION_ID_CATEGORY.RIHABILY}
                        item_details={this.state.item_details}
                        setItemDetails={this.setItemDetails.bind(this)}
                      />
                    </div>
                    
                    <div className="mt5 last-part">
                      <Button onClick={this.addDetail} className="ml-5 w-25">↓ 追加</Button>
                      <Button className="ml-2" onClick={this.changeDetailItem} style={this.state.selected_detail_index == undefined ? {opacity:"0.5"}:{}}>変更確定</Button>
                      <Button className="ml-2" onClick={this.stopChange} style={this.state.selected_detail_index == undefined ? {opacity:"0.5"}:{}}>変更中止</Button>
                    </div>
                    
                    <div className="set-table">
                      <table className="table-scroll table table-bordered" id="list-table">
                        <thead>
                        <tr className={'table-menu'}>
                          <td className="text-center td-check">依</td>
                          <td className="text-center td-check">処</td>
                          <td className="td-content">療法項目１</td>
                          <td className="td-content">療法項目2</td>
                          <td className="td-part">部位１</td>
                          <td className="td-part">部位2</td>
                          <td>個別</td>
                        </tr>
                        </thead>
                        <tbody>
                        {detail_json_array[this.state.tab_id] != null && detail_json_array[this.state.tab_id].length >0 &&
                        detail_json_array[this.state.tab_id].map((item, index)=>{
                          return (
                            <>
                              <tr onContextMenu={e => this.handleClick(e, index)} className={this.state.selected_detail_index === index ? "selected" : ""} style={{cursor:"pointer"}}>
                                <td className="td-check text-center">
                                  <Checkbox
                                    label=""
                                    number={index}
                                    getRadio={this.getRadio.bind(this)}
                                    // value={this.state.set_detail[index]['check']}
                                    name="check"
                                  />
                                </td>
                                <td className="td-check text-center">
                                  <Checkbox
                                    label=""
                                    number={index}
                                    getRadio={this.getRadio.bind(this)}
                                    // value={this.state.set_detail[index]['check']}
                                    name="check"
                                  />
                                </td>
                                <td className="p1-1 td-content" onClick={this.selectDetail.bind(this,index)}>{item.therapy_item1_name}</td>
                                <td className="p1-1 td-content" onClick={this.selectDetail.bind(this,index)}>{item.therapy_item2_name}
                                  {item.therapy_item2_amount != undefined && item.therapy_item2_amount != '' ? " " + item.therapy_item2_amount :""}
                                  {item.therapy_item2_amount != undefined && item.therapy_item2_amount != '' && item.therapy_item2_unit != undefined && item.therapy_item2_unit != '' ? " " + item.therapy_item2_unit :""}</td>
                                <td className="p1-1 td-part" onClick={this.selectDetail.bind(this,index)}>{item.position1_name != undefined ? item.position1_name:""}</td>
                                <td className="p1-1 td-part" onClick={this.selectDetail.bind(this,index)}>{item.position2_name != undefined ? item.position2_name:""}</td>
                                <td>
                                  {(item.item_details !== undefined && item.item_details.length > 0) && (
                                    <div className="w-100">
                                      <button onClick={this.openSetDetailModal.bind(this, item.item_details)}>個別</button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            </>
                          )
                        })}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt5">
                      <div className="d-flex">
                        <div style={{lineHeight:"1.875rem"}}>経過・RISK・合併症等(フリー入力)</div>
                        {/* <div className="w-75">25文字で改行されます</div> */}
                        <div className="ml-2">
                          <button className="clear-button" onClick={this.clearComment.bind(this)}>C</button>
                        </div>
                      </div>
                      <textarea
                        className="w-100 mytext-area"
                        onChange={this.getComment.bind(this)}
                        value={this.state.free_comment}
                        id='free_comment_id'
                      />
                    </div>
                  </div>
                </div>
                <div className="bottom-area mt-1 w-100 d-flex">
                  <div className="left-area" style={{width:"60%"}}>
                    <div className="d-flex border  p-1">
                      <div className="w-50 d-flex">
                        <div style={{width:70, paddingTop:"0.3rem"}}>基本方針</div>
                        <Button className="ml-1 disease-r" onClick={this.addBasicPolicy.bind(this)}>▼</Button>
                        <div className="data-content p-1" style={{width:"80%"}}>
                          {basic_policy_array != null && basic_policy_array.length > 0 && basic_policy_array.map(item=>{
                            return (
                              <div key={item}>{item}</div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="w-50 d-flex ml-1">
                        <div style={{width:100, paddingTop:"0.3rem"}}>社会的ゴール</div>
                        <Button className="ml-1 disease-r" onClick={this.addSocialGoal.bind(this)}>▼</Button>
                        <div className="data-content p-1" style={{width:"70%"}}>
                          {social_goal_array != null && social_goal_array.length > 0 && social_goal_array.map(item=>{
                            return (
                              <div key={item}>{item}</div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex border  pl-1 pr-1 pt-1 mt-1">
                      <div className="w-25 border  h-50">
                        <div>感染症</div>
                        <div className="search-type">
                          {Object.keys(this.state.exist_array).map((index)=>{
                            return (
                              <>
                                <Radiobox
                                  label={this.state.exist_array[index]}
                                  value={index}
                                  getUsage={this.setInfectionExist.bind(this)}
                                  checked={this.state.infection_exist === index}
                                  name={`infection_exist`}
                                />
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div className="w-75 ml-1 exam-table" style={{marginTop: "-0.25rem"}}>
                        <table className="table-scroll table table-bordered mt5">
                          <thead>
                          <tr className={'table-menu'}>
                            <td className="text-center name">検査名称</td>
                            <td className="text-center result" style={{width:"105px"}}>結果</td>
                            <td className="text-center" style={{width:"105px"}}>検査日</td>
                          </tr>
                          </thead>
                          <tbody>
                          {exam_result !== undefined && exam_result != null && exam_result.length>0 ? exam_result.map(item=>{
                              return (
                                <tr key={item}>
                                  <td className="p-1">{item.name.trim()}
                                  </td>
                                  <td className="p-1" style={{width:"105px"}}>{item.value}
                                  </td>
                                  <td className="p-1" style={{width:"88px"}}>{item.examination_date}
                                  </td>
                                </tr>
                              )
                            }) :
                            this.state.item_count.map(index=>{
                              return (
                                <tr key={index}>
                                  <td className="text-center">
                                  </td>
                                  <td className="text-center" style={{width:"105px"}}>
                                  </td>
                                  <td style={{width:"88px"}}>
                                  </td>
                                </tr>
                              )
                            })
                          }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="right-area border  ml-2 pl-1 pr-1 pt-1" style={{width:"40%"}}>
                    <div className="d-flex">
                      <div style={{lineHeight:"1.875rem"}}>特記事項</div>
                      {/* <div className="w-75">25文字で改行されます</div> */}
                      <div className="ml-2">
                        <button className="clear-button" onClick={this.clearSpecialNote.bind(this)}>C</button>
                      </div>
                    </div>
                    <textarea
                      className="w-100"
                      onChange={this.getSpecialNote.bind(this)}
                      value={this.state.special_comment}
                      id='special_comment_id'
                    />
                  </div>
                </div>
                
                {this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 && (
                  <>
                    <div className={'flex'}>
                      <div className={'block-area'} style={{width:"100%"}}>
                        <div className={'block-title'}>追加指示・指導・処置等選択</div>
                        {this.state.additions.map(addition => {
                          return (
                            <>
                              <div className={'flex'}>
                                <Checkbox
                                  label={addition.name}
                                  getRadio={this.getAdditions.bind(this)}
                                  number={addition.addition_id}
                                  value={this.state.additions_check[addition.addition_id]}
                                  name={`additions`}
                                />
                                {addition.sending_category === 3 && (
                                  <>
                                    <Checkbox
                                      label={'送信する'}
                                      getRadio={this.getAdditionsSendFlag.bind(this)}
                                      number={addition.addition_id}
                                      value={this.state.additions_send_flag_check[addition.addition_id]}
                                      name={`additions_sending_flag`}
                                    />
                                    <div style={{fontSize:"0.875rem"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                  </>
                                )}
                              </div>
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </Wrapper>
            ) : (
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmCloseModal.bind(this)}>キャンセル</Button>
            {this.context.$getKarteMode(this.props.patientId) == KARTEMODE.EXECUTE ? (
              <>
                {(this.state.number > 0 && this.state.done_order !== 1)  ? (
                  <Button className={save_tooltip !== "" ? "disable-btn" : "red-btn"} tooltip={save_tooltip} onClick = {this.save.bind(this)}>確定(指示)</Button>
                ):(
                  <Button className="disable-btn">確定(指示)</Button>
                )}
                <Button className="red-btn" onClick = {this.save.bind(this, 1)}>確定(指示& 実施)</Button>
              </>
            ):(
              <>
                {(this.state.number > 0 && this.state.done_order === 1)  ? (
                  <>
                    <Button className="disable-btn">確定(指示)</Button>
                    <Button className="red-btn" onClick = {this.save.bind(this, 1)}>確定(指示& 実施)</Button>
                  </>
                ):(
                  <>
                    <Button className={save_tooltip !== "" ? "disable-btn" : "red-btn"} tooltip={save_tooltip} onClick = {this.save.bind(this)}>確定(指示)</Button>
                    <Button className="disable-btn">確定(指示& 実施)</Button>
                  </>
                )}
              </>
            )}
          </Modal.Footer>
          {this.state.isShowStaffList && (
            <HarukaSelectMasterModal
              selectMaster = {this.selectStaff}
              closeModal = {this.closeDoctorSelectModal}
              MasterCodeData = {this.state.staffs}
              MasterName = '医師'
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
            index={this.state.index}
          />
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.deleteData.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
        </Modal>
        {this.state.openItemMaterModal && (
          <RehabilyItemMasterModal
            closeModal= {this.closeModal}
            handleOk={this.setTherapyItem}
            modal_title={this.state.item_mater_title}
            master_data={this.state.all_data}
            modal_data={this.state.modal_data}
          />
        )}
        {this.state.isSetDetailModal && (
          <SetDetailViewModal
            closeModal= {this.closeModal}
            setDetailData={this.state.setDetailData}
            modal_type="rehabily"
          />
        )}
        {(this.state.isOpenSelectDiseaseModal == true || this.state.isOpenRegisterDiseaseModal == true) && (
          <SelectMedicineModal
            closeModal = {this.closeModal}
            system_patient_id={this.props.patientId}
            selectDiseaseName={this.selectDiseaseName}
          />
        )}
        {this.state.isAddDiseaseNameModal && (
          <DiseaseNameModal
            closeModal = {this.closeModal}
            patientId={this.props.patientId}
          />
        )}
        {this.state.needSelectDoctor && (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
          />
        )}
        {this.state.isUpdateConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.saveData.bind(this, this.state.done_flag)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isClearConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.clearConfirm.bind(this, this.state.clear_type)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeValidateAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </>
    );
  }
}

RehabilitationModal.contextType = Context;
RehabilitationModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  type: PropTypes.string,
  cache_data:PropTypes.object,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,
};

export default RehabilitationModal;