import React, { Component, useContext } from "react";
import * as methods from "../DialMethods";
import styled from "styled-components";
import { surface } from "../../../_nano/colors";
import Button from "../../../atoms/Button";
import InputWithLabel from "../../../molecules/InputWithLabel";
import InputWithLabelBorder from "../../../molecules/InputWithLabelBorder";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Checkbox from "../../../molecules/Checkbox";
import {
  formatDateLine,
  formatDateSlash,
  formatTime,
  formatTimePicker,
  formatJapan,
} from "~/helpers/date";
import DialSideBar from "../DialSideBar";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/pro-light-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialPatientNav from "../DialPatientNav";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
// import InputBoxTag from "~/components/molecules/InputBoxTag";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {
  makeList_code,
  makeList_data,
  sortTimingCodeMaster,
  makeList_codeName,
  extract_enabled,
  toHalfWidthOnlyNumber,
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  displayInjectionName
} from "~/helpers/dialConstants";
import InjectionSetModal from "../modals/InjectionSetModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import PatternDeleteConfirmModal from "~/components/templates/Dial/modals/PatternDeleteConfirmModal";
import PatternUpdateConfirmModal from "~/components/templates/Dial/modals/PatternUpdateConfirmModal";
import CalcDial from "~/components/molecules/CalcDial";
import { patternValidate } from '~/helpers/validate'
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal'
import $ from 'jquery'
import {getServerTime} from "~/helpers/constants";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import renderHTML from "react-render-html";

const Icon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.65);
  font-size: 1rem;
  margin-right: 0.25rem;
`;

const Card = styled.div`
  padding: 1.25rem;
  position: fixed;
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: calc(100vh - 70px);
  float: left;
  .flex {
    display: flex;
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
    width: 16.25rem;
  }
  .other-pattern {
    position: absolute;
    right: 1.25rem;
    button {
      margin-left: 0.2rem;
      margin-bottom: 0px;
      margin-top: 0.3rem;
      padding: 8px 10px;
      min-width: 5rem;
    }
    span {
      font-size: 1rem;
    }
    .disable-button {
      background: rgb(101, 114, 117);
      cursor: auto;
    }
    .schedule-button {
      margin-right: 0.5rem;
    }
  }
  .bodywrap {
    height: calc(100% - 6rem);
    display: flex;
  }
  background-color: ${surface};
  button {
    margin-bottom: 0.625rem;
    margin-left: 0.625rem;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  float: left;
  width: 100%;    
  height: 100%;
  overflow-y: auto;
  .top-table {
    display: flex;
    height: 9.5rem;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .dial-list{
    width: calc(100% - 10rem);
    height: calc(100% - 1rem);
    margin-top: 0.625rem;
    border: solid 1px rgb(206, 212,218);
    overflow-y: hidden;
    overflow-x: hidden;
    .table-header {
      display: flex;
      width: calc(100% - 17px);
      margin-top: -1px;
      .bt-1p {
        border-top: 1px solid #aaa;
      }
      .br-1p {
        border-right: 1px solid #aaa;
      }
      .bb-1p {
        border-bottom: 1px solid #aaa;
      }
      .bl-1p {
        border-left: 1px solid #aaa;
      }
      .injection-name {
        width: calc(100% - 39.75rem);
        // padding-left: 0.1rem;
        text-align:center;
      }
        .pattern-index {
        width: 5rem;
        text-align: center;
      }
      .pattern-category {
        width: 6rem;
        text-align: center;
      }
      .pattern-time {
        width: 14rem;
        text-align: center;
      }
      .pattern-week-day {
        width: 9rem;
        text-align: center;
      }
      .pattern-time_limit_from {
        text-align: center;
        width: 12.5rem;
      }
      .pattern-time_limit_to {
        text-align: center;
        width: 6.25rem;
      }
    }
  }
  .last-history{
      overflow: hidden;
      margin-top: -2rem;
      padding-left: 0.625rem;
      label {
          margin: 0;
          float: right;
          width: 9rem;
          font-size: 1rem;
      }
  }
  .dial-oper {
    margin-top: 0.625rem;
    .pullbox-select {
      font-size: 1rem;
      height: 2.3rem;
    }
    .pullbox-title {
      line-height: 2.3rem;
    }
    .radio-group-btn label {
        font-size: 1rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin-left: 0.3rem;
        text-align:center!important;
    }
    .kind {
      .label-div {
        width: 6.5rem;
        text-align: right;
        line-height: 2.3rem;
        height: 2.3rem;
        margin: 0;
        padding-right: 0.625rem;
        margin-bottom: auto;
        margin-top: auto;
      }
      .select-category {
        height:2.3rem;
      }
    } 
    .radio-btn {
      margin: 0;
      label {
        height: 100%;
        line-height: 2.3rem;
        padding:0 !important;
        margin:0;
        margin-right: 0.5rem;
      }
    }
    .radio-btn:last-child {
      label {
        margin-right:0;
      }
    }
    .pullbox {
        width: 100%;
        .label-title {    
            font-size: 1rem;
            width: 6.5rem;
            text-align: right;
            padding-right: 0.625rem;
            line-height: 2.3rem;
        }
        label {    
            width: 32rem;
            select {
                width: 100%;
            }
        }
    }
    .medicine-area {
      display: flex;
      .medicine-label {
        margin-top: 0.5rem;
        width: 6.5rem;
        padding-right: 0.625rem;
        line-height: 2.3rem;
        label {
            width: 100%;
            text-align: right;
        }
      }
      .name-area {
        width: 32rem;
        .inject-name{
          height:2.3rem;
          display:flex;
          align-items:center;
          width: calc(100% - 2.5rem);
          border: 1px solid #7e7e7e;
        }
        input {
            font-size: 1rem;
        }        
        .clickable {
          margin-top: 0.5rem;
          input {
            height: 2.3rem;
          }
          .label-title {
              width: 0;
              margin:0;
          }
        }
        .delete-button{
          margin-top:0.7rem;
          button{
            margin-bottom:0;
          }
        }
      }
      .amount-area {
        .amount-input {
          margin-top: 0.5rem;
          div {
            margin:0;
          }
          line-height: 2.3rem;
          font-size: 1rem;
          .label-title {
            width: 3rem;
            margin: 0;
            line-height: 2.3rem;
            font-size: 1rem;
            padding-left: 0.5rem;
          }
          span {
            input {
              margin: 0;
              line-height: 2.3rem;
            }
          }
          .label-unit {
            padding-top: 0.3rem;
            margin-top: 0;
            line-height: 1.5rem;            
            margin-right: 0.3rem;
            margin-left: 0.3rem;
            width: 3rem;
          }
        }
          input {
              font-size: 1rem;
              width:5rem!important
          }
      }
        .unit-area {
            width: 10%;
            text-align: left;
            .flex {    
                margin-top: 0.5rem;
                padding-left: 0.3rem;
                line-height: 2.3rem;
                height: 2.3rem;
            }
        }
        .pattern-export {
          width: calc(100% - 52rem);
        }
    }
    .flex {
        display: flex;
        flex-wrap: wrap;
    }
    .border-medicine {
        border-radius: 0.25rem;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        height: 2.3rem;
        margin-top: 0.5rem;
        padding: 0.625rem 0 0 0.3rem;
    }
    .gender {
      font-size: 0.75rem;
      margin-top: 0.5rem;
      .gender-label {
        width: 6.5rem;
        text-align: right;
        padding-right: 0.625rem;
        font-size: 1rem;
        margin: 0;
        line-height: 2.3rem;
        height: 2.3rem;
        margin-bottom: auto;
        margin-top: auto;
      }
    }
    .form-control {
        margin-bottom: 0.5rem;
        height: 2.3rem;
    }
    .react-datepicker-wrapper {
        width: auto;
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 1rem;
                width: 6.7rem;
                height: 2.3rem;
                border-radius: 0.25rem;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 0.5rem;
            }
        } 
    }
    .period {
      display: flex;
      label {
          width: 0;
      }
      .from-to {
          line-height: 2.3rem;
          padding: 0 0.3rem;
          margin-top: 8px;
      }
      .w55 {
          width: 3.5rem;
      }
      .start-date {
        .label-title {
          margin: 0;
          line-height: 2.3rem;
        }
        .react-datepicker-wrapper {
          width: calc(100% - 6.5rem);
        }
      }
      .label-title {
        margin:0;
      }
      .reopening {
          .label-title {
            width: 5.5rem !important;
          }
      }
    }
    .period div:first-child {
        .label-title {
            width: 6.5rem;
            text-align: right;
            padding-right: 0.625rem;
            font-size: 1rem;
            margin: 0rem;
        }
    }
    .delete-date {
        label {
            font-size: 1rem;
            margin-top: 0.3rem;
            text-align: right;
            width: 6.5rem;
            padding-right: 0.625rem;
            margin-right: 0px;
        }
        .react-datepicker-wrapper {
            width: calc(100% - 6.5rem);
        }
        .reopening {
            .label-title {
              width: 5.5rem !important;
            }
        }
    }
    .input-data-area {
        label {
          text-align: right;
          width: 5rem;
          font-size: 1rem;
          padding-right: 0.625rem;
          margin: 0;
          line-height: 2.3rem;
        }
        input {
            font-size: 1rem;
        }
        .input-time {            
            margin-top: 8px;
            display: flex;
        }
        .react-datepicker-wrapper {
          width: 6.7rem;
          input {
            width: 100%;
          }
        }
        .react-datepicker-popper {
          left: -60px !important;
          .react-datepicker__triangle {
            left: 90px !important;
          }
        }
    }
    .remove-x-input {
      input {
          width: calc(100% - 5rem);
          height: 2.3rem;
      }
    }
    .select-day-btn {
        font-size: 1rem;
        cursor: pointer;
        border: 1px solid rgb(206, 212, 218);
        margin: 0;
        line-height: 2.3rem;
        height: 2.3rem;
        padding: 0 0.3rem;
    }
    .selet-day-check {
      margin-top: 0;
      line-height: 2.3rem;
      label {
          width: 100%;
          padding-left: 0.625rem;
          margin: 0;
          margin-top:4px;
          font-size: 1rem;          
      }
    }
    .check-schedule {
        padding: 0.625rem 0 0 4rem;
    }
    .radio-btn label{
        font-size: 1rem;
        width: 5rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        padding: 0;
        text-align:center;
        margin: 0;
        margin-right:0.5rem;
    }
    .implementation_interval {
        display: flex;
        width: 100%;
        margin-top: 0.5rem;
        .implementation_interval-label {
            text-align: right;
            width: 6.5rem;
            padding-right: 0.625rem;
            font-size: 1rem;
            margin: 0;
            line-height: 2.3rem;
        }
        .radio-group-btn label{
            width: 4.375rem;
            padding: 0;
            line-height: 2.3rem;
            margin: 0;
            margin-right: 0.3rem;
        }
    }
    .implementation_month {
        display: flex;
        width: 100%;
        margin-top: 0.5rem;
        .implementation_month-label {
            text-align: right;
            width: 6.5rem;
            padding-right: 0.625rem;
            font-size: 1rem;
            margin: 0;
            line-height: 2.3rem;
        }
        .radio-group-btn label{
            width: 3rem;
            padding: 0;
            margin: 0 0.3rem 0 0;
            line-height: 2.3rem;
        }
    }
    .history-list {
        .history-head {    
            border-bottom: 1px dotted;
            margin-bottom: 0.3rem;
            font-size: 1rem;
        }
        .history-title {
            font-size: 1rem;
        }
        .flex div {
            width: 50%;
        }
        .history-delete {
            cursor: pointer;
        }
        .label-title {
            width: 0;
            padding: 0;
        }
        label {
            width: 100%;
        }
    }
    .box-border {
        border: 1px solid black;
        height: 7rem;
        overflow-y: auto;
        p {
            margin: 0;
            text-align: left;
            cursor: pointer;
        }
    }
    .period-input {
      .label-title {
        line-height: 2.3rem;
      }
      .gender .radio-group-btn label{
        width: 1.875rem;
        padding: 0;
        margin: 0;
        margin-right: 0.3rem;
        line-height: 2.3rem;
        height: 2.3rem;
      }
    }
    .no-dial-day {
        width: 1.875rem;
        margin-right: 0.3rem;
        display: inline-block;
    }
    .final-info {
        padding-left: 6.5rem;
        padding-top: 0.3rem;
        font-size: 1rem;
    }
        .selected{
      background: lightblue;
    }
  }
  .left-area{
    .pullbox-label{
      width: 32rem;
      margin: 0;
    }
  }
  .right-area {
  }
  .final-input{
      padding-left:2rem;      
      padding-top: 0.5rem;
  }
  .calc-end-date{
    margin:0;
    height: 2rem;
    margin-top: 0.4rem;
  }
  .treat_count_group{
    div{
      margin-top:0.1rem;
    }
  }
  .end-date{
    .label-title{
      width:0!important;
    }
  }
`;

const MethodBox = styled.div`
  height: calc(100% - 1.5rem);
  overflow-y: scroll;
  .selected {
    background: lightblue;
  }
  .pattern-list:hover {
    background-color: rgb(246, 252, 253);
    cursor: pointer;
  }
  .selected: hover {
    background: lightblue;
  }
  .pattern-list {
    display: flex;
    width: 100%;
    margin-top: -1px;
    .bt-1p {
      border-top: 1px solid #aaa;
    }
    .br-1p {
      border-right: 1px solid #aaa;
    }
    .bb-1p {
      border-bottom: 1px solid #aaa;
    }
    .bl-1p {
      border-left: 1px solid #aaa;
    }
    .injection-name {
      width: calc(100% - 39.75rem);
      padding-left: 0.1rem;
      text-align:left;
    }
    .pattern-index {
      width: 5rem;
      text-align: right;
      padding-right: 0.3rem;
    }
    .pattern-category {
      width: 6rem;
      padding-left: 0.3rem;
    }
    .pattern-time {
      padding-left: 0.3rem;
      width: 14rem;
    }
    .pattern-week-day {
      padding-left: 0.3rem;
      width: 9rem;
    }
    .pattern-time_limit_from {
      padding-left: 0.3rem;
      width: 6.25rem;
    }
    .pattern-time_limit_to {
      padding-left: 0.3rem;
      width: 6.25rem;
    }
  }
`;

const ContextMenuUl = styled.ul`
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
    font-size: 16px;
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

const ContextMenu = ({ visible, x, y, parent, row_index }) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
        {$canDoAction(FEATURES.DIAL_INJECTION_SET_MASTER, AUTHS.EDIT, 0) && (
          <li>
            <div onClick={() => parent.contextMenuAction(row_index, "edit")}>
              編集
            </div>
          </li>
        )}
          {/*<li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>*/}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const set_numbers = [
  { id: 0, value: "未設定" },
  { id: 1, value: 1 },
  { id: 2, value: 2 },
  { id: 3, value: 3 },
  { id: 4, value: 4 },
  { id: 5, value: 5 },
  { id: 6, value: 6 },
  { id: 7, value: 7 },
  { id: 8, value: 8 },
  { id: 9, value: 9 },
  { id: 10, value: 10 },
];

const week_days = ["日", "月", "火", "水", "木", "金", "土"];

const sortations = ["静注", "筋注", "点滴", "処置薬剤", "麻酔", "処置行為"];

const implementation_interval_types = [
  "毎週",
  "第1曜日",
  "第2曜日",
  "第3曜日",
  "第4曜日",
  "第5曜日",
];

const implementation_months = [
  "毎月",
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

class Injection extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.injectionMasterData = sessApi.getObjectValue("dial_common_master","injection_master");
    this.injection_codes = makeList_code(this.injectionMasterData);
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    let injection_pattern = [];
    this.state = {
      alert_messages:'',
      confirm_alert_title:'',
      injection_pattern,
      final_week_days: 0,
      set_number: 0,
      anticoagulation_method1: "",
      injectionCode1: "",
      injectionCode2: "",
      injectionCode3: "",
      injectionCode4: "",
      injectionCode5: "",
      injectionName1: "",
      injectionName2: "",
      injectionName3: "",
      injectionName4: "",
      injectionName5: "",
      injectionAmount1: "",
      injectionAmount2: "",
      injectionAmount3: "",
      injectionAmount4: "",
      injectionAmount5: "",
      injectionUnit1: "",
      injectionUnit2: "",
      injectionUnit3: "",
      injectionUnit4: "",
      injectionUnit5: "",
      checkAnotherDay: false,
      time_limit_from: "",
      time_limit_to: "",
      entry_date: '',
      entry_time: '',
      directer_name: "",
      showHistory: 1,
      patient_id: "",
      injection_category: "",
      timing_code: 0,
      week_interval: 1,
      monthly_enable_week_number: 1,
      checkalldays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      check_enable_months: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      },
      check_enable_weeks: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      },
      checkdialdays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      dialdays: "",
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      pattern_table_id: "",
      patientInfo: [],
      selected_pattern_data: "",
      isShowDoctorList: false,
      entry_name:
        authInfo != undefined && authInfo != null ? authInfo.name : "",
      instruction_doctor_number: "",
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      stop_date: "",
      reopening_date: "",
      isUpdateScheduleConfirmModal: false,
      isOpenMoveOtherPageConfirm: false,      

      isReScheduleConfirm: false,
      isConfirmComplete: false,
      isAddConfirmModal: false,
      select_dial_days: false,

      timingCodeData,
      timing_codes: makeList_code(timingCodeData),
      timing_options: makeList_codeName(timingCodeData, 1),
      isOpenInjectionSet: false,
      isOpenCalcModal: false,
      isSetDataConfirm: false,
      isClearConfirmModal: false,
      calcUnit: "",
      calcTitle: "",
      alert_message: '',
      injectionSetData: null,
    };
    this.double_click = false;
    this.can_open_calc = false;

    // let html_obj = document.getElementsByTagName("html")[0];
    // let width = html_obj.offsetWidth;
    // if (parseInt(width) < 1367) {
    //   html_obj.style.fontSize = 11 + "px";
    // } else if (parseInt(width) < 1441) {
    //   html_obj.style.fontSize = 13 + "px";
    // } else if (parseInt(width) < 1601) {
    //   html_obj.style.fontSize = 14 + "px";
    // } else if (parseInt(width) > 1600) {
    //   html_obj.style.fontSize = 16 + "px";
    // }
  }

  async UNSAFE_componentWillMount() {
    await this.getInjectionMaster();
    await this.setDoctors();
    await this.getStaffs();
    await this.getInjectionSet();
  }

  async componentDidMount () {
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
  }

  getInjectionSet = async () => {
    let post_data = { table_kind: 11, order: "sort_number" };
    let path = "/app/api/v2/dial/master/material_search";
    let category_data = await apiClient.post(path, {
      params: post_data,
    });
    let set_data = await apiClient.post(
      "/app/api/v2/dial/pattern/searchInjectionSet",
      { params: { order: "sort_number" } }
    );
    this.setState({
      injection_set_category: makeList_data(extract_enabled(category_data)),
      category_data,
      set_data,
    });
  };

  getSetnumber = (e) => {
    this.setChangeFlag(1);
    this.setState({ set_number: parseInt(e.target.id) });
  };

  getAnticoagulationMethod1 = (e) => {
    let { set_data } = this.state;
    let category_code = this.state.category_data.find((x) => x.number == e.target.id) !== undefined ? this.state.category_data.find(
      (x) => x.number == e.target.id
    ).code : 0;
    this.setChangeFlag(1);
    let filter_data = set_data.filter((x) => x.category_code == category_code);
    this.setState({
      anticoagulation_method1: parseInt(e.target.id),
      injection_set_data: filter_data,
    });
  };

  getTreatCount = (e) => {
    this.setChangeFlag(1);
    var value = parseInt(e) < 0 ? 0 : parseInt(e);
    this.setState({ treat_count: value });
  }

  keydownCount = (e) => {    
    if (e.keyCode == 8 
      || e.keyCode == 13
      || e.keyCode == 46
      || (e.keyCode >= 35 && e.keyCode <=40)
      || (e.keyCode >= 48 && e.keyCode <=57)
      || (e.keyCode >= 96 && e.keyCode <=105)
    ){
      if (e.keyCode == 13){
        this.calcEndDate();
      }
    } else {
      e.preventDefault();
      return;
    }
  }

  calcEndDate = () => {
    if (this.checkEnableCalcEndDate() == false) return;
    
    var treat_count = this.state.treat_count;
    var time_limit_from = this.state.time_limit_from;
    var monthly_enable_week_number = this.state.monthly_enable_week_number;
    var week_interval = this.state.week_interval;
    var final_week_days = this.state.final_week_days;
    var time_limit_to = new Date();
    time_limit_to.setFullYear(time_limit_from.getFullYear());
    time_limit_to.setMonth(time_limit_from.getMonth());
    time_limit_to.setDate(time_limit_from.getDate());
    var stop_date = this.state.stop_date;
    var reopening_date = this.state.reopening_date;
    var count_index = 0;    
    
    do{      
      if (stop_date != '' && reopening_date != '') {
        if (stop_date <= time_limit_to.getTime() && time_limit_to.getTime() <= reopening_date.getTime()) {
          time_limit_to.setDate(time_limit_to.getDate() + 1);
          continue; 
        }
      }
      //実施月----------------------------------------
      if (monthly_enable_week_number != 0 && monthly_enable_week_number != 1){
        var cur_month = time_limit_to.getMonth() + 1;
        var pmonth = Math.pow(2, cur_month);
        if (!((monthly_enable_week_number & pmonth) > 0)) {
          time_limit_to.setDate(time_limit_to.getDate() + 1);
          continue;
        }
      }
      //------------------------------------------------------
      //実施間隔------------------------------------------------------
      if(week_interval != 0 && week_interval != 1){
        var cur_week_num = this.getWeekNum(time_limit_to);        
        if (cur_week_num == 0) {
          time_limit_to.setDate(time_limit_to.getDate() + 1);
          continue;
        }
        var pweeknum = Math.pow(2, cur_week_num);
        if (!((pweeknum & week_interval) > 0)) {
          time_limit_to.setDate(time_limit_to.getDate() + 1);
          continue;
        }
      }
      //------------------------------------------------------
      //曜日------------------------------------------------------
      var cur_weekday = time_limit_to.getDay();      
      var pweekday = Math.pow(2, cur_weekday);
      if (!((pweekday & final_week_days) > 0)) {        
        time_limit_to.setDate(time_limit_to.getDate() + 1);
        continue;
      }      
      count_index++;      
      if (count_index < treat_count) {
        time_limit_to.setDate(time_limit_to.getDate() + 1);
      }
      //------------------------------------------------------
    } while(count_index < treat_count)
    this.setState({time_limit_to})
  }

  getWeekNum = (date) => {    
    // var firstofMonth = new Date();
    // firstofMonth.setFullYear(date.getFullYear());
    // firstofMonth.setMonth(date.getMonth());
    // firstofMonth.setDate(1);
    // var first_weekday_of_month = firstofMonth.getDay();
    // if (first_weekday_of_month != 1){
    //   var plus_days = first_weekday_of_month == 0 ? 1 : (7 - first_weekday_of_month + 1);
    //   firstofMonth.setDate(firstofMonth.getDate() + plus_days);
    // }
    // var cur_date = date.getDate();
    // var first_monday_date = firstofMonth.getDate();
    // if (first_monday_date > cur_date) return 0;
    // return parseInt((cur_date - first_monday_date)/7) + 1;
    var cur_date = date.getDate();
    if (cur_date % 7 == 0) return cur_date/7; else return parseInt(cur_date/7) + 1;
  }

  checkEnableCalcEndDate = () => {
    var res = true;
    if (!(this.state.treat_count > 0)) return false;
    if (this.state.time_limit_from == undefined || this.state.time_limit_from == null || this.state.time_limit_from == '') return false;
    if (this.state.final_week_days == 0) return false;
    if (this.state.stop_date != '' && this.state.time_limit_from.getTime() > this.state.stop_date.getTime()) return false;
    if (this.state.stop_date != '' && this.state.reopening_date != '' && this.state.stop_date.getTime() > this.state.reopening_date.getTime()) return false;    
    return res;
  }

  getinjectionAmount1 = (e) => {
    this.setChangeFlag(1);
    var value = parseFloat(e) < 0 ? 0 : parseFloat(e);
    this.setState({ injectionAmount1: value });
  };

  getinjectionAmount2 = (e) => {
    this.setChangeFlag(1);
    var value = parseFloat(e) < 0 ? 0 : parseFloat(e);
    this.setState({ injectionAmount2: value });
  };

  getinjectionAmount3 = (e) => {
    this.setChangeFlag(1);
    var value = parseFloat(e) < 0 ? 0 : parseFloat(e);
    this.setState({ injectionAmount3: value });
  };

  getinjectionAmount4 = (e) => {
    this.setChangeFlag(1);
    var value = parseFloat(e) < 0 ? 0 : parseFloat(e);
    this.setState({ injectionAmount4: value });
  };

  getinjectionAmount5 = (e) => {
    this.setChangeFlag(1);
    var value = parseFloat(e) < 0 ? 0 : parseFloat(e);
    this.setState({ injectionAmount5: value });
  };

  getCheckAnotherDay = (name, value) => {
    if (name === "schedule") {
      if (value === 0) {
        this.getDialDays(this.state.patient_id);
      } else {
        this.setState({
          checkAnotherDay: value,
          checkdialdays: {
            0: true,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
          },
        });
      }
    }
  };

  selectDialDays = () => {
    if (this.state.dialdays !== "") {
      let checkalldays = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      };
      var final_week_days = 0;
      this.setState({ select_dial_days: !this.state.select_dial_days }, () => {
        if (this.state.select_dial_days) {
          Object.keys(this.state.dialdays).map((index) => {
            if (this.state.dialdays[index]) {
              checkalldays[index] = true;
              var pval = Math.pow(2, index);
              final_week_days = final_week_days + pval;
            }
          });
          this.setState({ final_week_days, checkalldays}, () => {
            this.calcEndDate();
          });
        } else {
          this.setState({
            final_week_days: 0,
            checkalldays,            
          }, () => {
            this.calcEndDate();
          });
        }
      });
    }
  };

  getShowHistory = async(name, value) => {
    if (name === "schedule") {
      if (value == 0) {
        let server_time = await getServerTime();
        let tmp = [];
        let today = formatDateLine(new Date(server_time));
        tmp = this.getPatternListByDateCondition(this.state.injection_pattern,today,"time_limit_from","time_limit_to");
        this.setState({
          showHistory: value,
          injection_pattern: tmp,
        });
      } else {
        this.setState({
          showHistory: value,
          injection_pattern: this.state.origin_pattern_list,
        });
      }
    }
  };

  getStartdate = (value) => {
    this.setChangeFlag(1);
    this.setState({ time_limit_from: value}, () => {
      this.calcEndDate();
    });
  };

  getEnddate = (value) => {
    this.setChangeFlag(1);
    this.setState({ time_limit_to: value, treat_count:'' });
  };

  getDeleteStartdate = (value) => {
    this.setChangeFlag(1);
    this.setState({ stop_date: value}, () => {
      this.calcEndDate();
    });
  };

  getDeleteEnddate = (value) => {
    this.setChangeFlag(1);
    this.setState({ reopening_date: value}, () => {
      this.calcEndDate();
    });
  };

  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  timeKeyEvent = (e) => {    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;
    this.key_code = key_code;
    this.start_pos = start_pos;
    var obj = document.getElementById('entry_time_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (key_code == 9) {
      this.setTime(e);
      return;
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({input_time_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            input_time_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            input_time_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        input_time_value:input_value,
      })
    }
  }

  getInputTime = (value, e) => {
    if (e == undefined){
      this.setState({
        entry_time:value,
        input_time_value:formatTime(value)
      })
      this.setChangeFlag(1);
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    
    if (input_value.length == 5) this.setTime(e);
    
    this.setState({
      input_time_value:input_value
    }, () => {
      var obj = document.getElementById('entry_time_id');
      if (this.key_code == 46){        
        obj.setSelectionRange(this.start_pos, this.start_pos);
      }
      if (this.key_code == 8){        
        obj.setSelectionRange(this.start_pos - 1, this.start_pos - 1);
      }
    })
  };

  setTime = (e) => {        
    if (e.target.value.length != 5) {      
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })
      this.setChangeFlag(1);
      return;
    }    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })      
      return;
    }    
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    this.setState({entry_time:now})
    this.setChangeFlag(1);
  }

  getInputdate = (value) => {
    this.setChangeFlag(1);
    this.setState({ entry_date: value });
  };

  getInputMan = (e) => {
    this.setChangeFlag(1);
    this.setState({ entry_name: e.target.value });
  };

  getDirectMan = (e) => {
    this.setChangeFlag(1);
    this.setState({ directer_name: e.target.value });
  };

  selectPatient =async(patientInfo) => {
    this.initRedBorder();
    await this.initializeInfo(patientInfo.system_patient_id);
    this.setState({
      patientInfo: patientInfo,
    });
  };

  initializeInfo = async(patient_id) => {
    let server_time = await getServerTime();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      pattern_table_id: "",
      selected_number: "",
      patient_id: patient_id,
      time_limit_from: new Date(server_time),
      time_limit_to: "",
      set_number: 0,
      week_days: "",
      entry_date: new Date(server_time),
      entry_time: new Date(server_time),
      checkAnotherDay: false,
      checkalldays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      check_enable_weeks: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      },
      final_week_days: 0,
      timing_code: 0,
      week_interval: 1,
      monthly_enable_week_number: 1,
      check_enable_months: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      },
      injection_category: '',
      injectionCode1: "",
      injectionCode2: "",
      injectionCode3: "",
      injectionCode4: "",
      injectionCode5: "",
      injectionName1: "",
      injectionName2: "",
      injectionName3: "",
      injectionName4: "",
      injectionName5: "",
      injectionAmount1: "",
      injectionAmount2: "",
      injectionAmount3: "",
      injectionAmount4: "",
      injectionAmount5: "",
      injectionUnit1: "",
      injectionUnit2: "",
      injectionUnit3: "",
      injectionUnit4: "",
      injectionUnit5: "",
      entry_name:
        authInfo != undefined && authInfo != null ? authInfo.name : "",
      directer_name:
        this.context.selectedDoctor.code > 0
          ? this.context.selectedDoctor.name
          : "",
      instruction_doctor_number:
        this.context.selectedDoctor.code > 0
          ? parseInt(this.context.selectedDoctor.code)
          : "",
      isShowDoctorList: false,
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      stop_date: "",
      reopening_date: "",
      select_dial_days: false,
      isSetDataConfirm: false,
      change_flag: false,

      treat_count:''
    });
    this.setChangeFlag(0);
    this.getDialDays(patient_id);
    await this.getInjectionPatternInfo(patient_id);
    this.setDoctors();
  };

  async getDialDays(patient_id) {
    if (patient_id !== "") {
      let path = "/app/api/v2/dial/pattern/getDialDays";
      const post_data = {
        system_patient_id: patient_id,
      };
      await apiClient
        ._post(path, {
          params: post_data,
        })
        .then((res) => {
          let checkdialdays = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
          };
          let dialdays = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
          };
          if (res.length > 0) {
            res.map((item) => {
              checkdialdays[item.day] = true;
              dialdays[item.day] = true;
            });
          }
          this.setState({
            checkAnotherDay: 0,
            checkdialdays,
            dialdays,
          });
        })
        .catch(() => {});
    }
  }

  async getInjectionPatternInfo(patient_id) {
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/pattern/getInjectionPattern";
    const post_data = {
      patient_id: patient_id,
      schedule_number: 0,
      is_temporary:0,
    };
    this.can_open_calc = false;
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res) {
          let tmp = res;
          if (this.state.showHistory == 0) {
            let today = formatDateLine(new Date(server_time));
            tmp = this.getPatternListByDateCondition(res,today,"time_limit_from","time_limit_to");
          }
          this.setState({
            injection_pattern: tmp,
            origin_pattern_list: res,
          });
          this.can_open_calc = true;
        }
      })
      .catch(() => {});
  }

  getTimingList = (e) => {
    this.setChangeFlag(1);
    this.setState({ timing_code: e.target.id });
  };

  changeMedicineKind = (value) => {
    this.setChangeFlag(1);
    this.setState({ injection_category: sortations[value] });
  };

  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }

  add = () => {
    if (this.state.patient_id === "") {
      this.setState({alert_messages:"患者様を選択してください。"})
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.REGISTER
      ) === false
    ) {
      this.setState({alert_messages:"登録権限がありません。"})      
      return;
    }

    if (this.state.instruction_doctor_number === '') {
      this.showDoctorList()
      return
    }

    let error_str_array = this.checkValidation();
    
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return
    }

    this.setState({
      isAddConfirmModal: true,
      confirm_message: "パターンを追加しますか？",
    });
  };

  initRedBorder() {
    removeRedBorder('time_limit_from_id');
    removeRedBorder('injectionAmount1_id');
    removeRedBorder('injectionAmount2_id');
    removeRedBorder('injectionAmount3_id');
    removeRedBorder('injectionAmount4_id');
    removeRedBorder('injectionAmount5_id');
    removeRedBorder('injectionCode1_id');
    removeRedBorder('injectionCode2_id');
    removeRedBorder('injectionCode3_id');
    removeRedBorder('injectionCode4_id');
    removeRedBorder('injectionCode5_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('stop_date_id');
    removeRedBorder('reopening_date_id');
    removeRedBorder('timing_code_id');
    removeRedBorder('injection_category_id');
    removeRedBorder('final_week_days_id');
    removeRedBorder("entry_time_id");
  }

  checkValidation = () => {
    this.initRedBorder();
    let error_str_arr = [];
    if (
      this.state.injectionCode1 < 1 &&
      this.state.injectionCode2 < 1 &&
      this.state.injectionCode3 < 1 &&
      this.state.injectionCode4 < 1 &&
      this.state.injectionCode5 < 1
    ) {
      error_str_arr.push("注射を選択してください。");
      addRedBorder('injectionCode1_id');
      if (!(this.state.injectionAmount1 > 0)) {
        error_str_arr.push("数量を入力してください。");
        addRedBorder('injectionAmount1_id');
      }
    }
    if (this.state.injectionCode1 > 0 && !(this.state.injectionAmount1 > 0)) {
      error_str_arr.push(this.state.injectionName1 + 'の数量を入力してください。');
      addRedBorder('injectionAmount1_id');
    }
    if (this.state.injectionCode2 > 0 && !(this.state.injectionAmount2 > 0)) {
      error_str_arr.push(this.state.injectionName2 + 'の数量を入力してください。')
      addRedBorder('injectionAmount2_id')
    }
    if (this.state.injectionCode3 > 0 && !(this.state.injectionAmount3 > 0)) {
      error_str_arr.push(this.state.injectionName3 + 'の数量を入力してください。')
      addRedBorder('injectionAmount3_id')
    }
    if (this.state.injectionCode4 > 0 && !(this.state.injectionAmount4 > 0)) {
      error_str_arr.push(this.state.injectionName4 + 'の数量を入力してください。')
      addRedBorder('injectionAmount4_id')
    }
    if (this.state.injectionCode5 > 0 && !(this.state.injectionAmount5 > 0)) {
      error_str_arr.push(this.state.injectionName5 + 'の数量を入力してください。')
      addRedBorder('injectionAmount5_id')
    }

    let validate_data = patternValidate(
      'dial_injection_pattern',
      this.state
    );
    
    if (validate_data.error_str_arr.length > 0) {
      validate_data.error_str_arr.map((item, index) => {
        if ((this.state.injection_category == undefined || this.state.injection_category == null || this.state.injection_category =='') && index == 0){
          error_str_arr.unshift(item);
        } else {
          error_str_arr.push(item);  
        }
      })
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){      
      error_str_arr.push("入力時間を選択してください。");
      if (validate_data.first_tag_id == undefined || validate_data.first_tag_id == '') {
        validate_data.first_tag_id = 'entry_time_id';
      } 
      addRedBorder("entry_time_id");
    }
    if (validate_data.first_tag_id != '') {
      this.setState({ first_tag_id: validate_data.first_tag_id })
    }
    if (
      this.state.time_limit_to != undefined &&
      this.state.time_limit_to != null &&
      this.state.time_limit_to != ''
    ) {
      if (!this.checkDate(this.state.time_limit_from, this.state.time_limit_to)) {
        error_str_arr.push('終了日は開始日以降の日付を選択してください。');
        addRedBorder('time_limit_to_id');
      }
      if (
        this.state.stop_date != undefined &&
        this.state.stop_date != null &&
        this.state.stop_date != ''
      ) {
        if (this.checkDate(this.state.time_limit_to, this.state.stop_date)) {
          error_str_arr.push('中止日は終了日以前の日付を選択してください。');
          addRedBorder('stop_date_id');
        }
      }
      if (
        this.state.reopening_date != undefined &&
        this.state.reopening_date != null &&
        this.state.reopening_date != ''
      ) {
        if (this.checkDate(this.state.time_limit_to, this.state.reopening_date)) {
          error_str_arr.push('再開日は終了日以前の日付を選択してください。');
          addRedBorder('reopening_date_id');
        }
      }
    }
    if (
      this.state.stop_date != undefined &&
      this.state.stop_date != null &&
      this.state.stop_date != ''
    ) {
      if (!this.checkDate(this.state.time_limit_from, this.state.stop_date)) {
        error_str_arr.push('中止日は開始日以降の日付を選択してください。');
        addRedBorder('stop_date_id');
      }
    }
    if (
      this.state.reopening_date != undefined &&
      this.state.reopening_date != null &&
      this.state.reopening_date != ''
    ) {
      if (!this.checkDate(this.state.time_limit_from, this.state.reopening_date)) {
        error_str_arr.push('再開日は開始日以降の日付を選択してください。');
        addRedBorder('reopening_date_id');
      }
    }
    if (
      this.state.reopening_date != undefined &&
      this.state.reopening_date != null &&
      this.state.reopening_date != ''
    ) {
      if (!this.checkDate(this.state.stop_date, this.state.reopening_date) || this.state.stop_date == undefined || this.state.stop_date == null || this.state.stop_date == '') {
        error_str_arr.push('再開日は中止日以降の日付を選択してください。');
        addRedBorder('reopening_date_id');
      }
    }
    if (
      this.state.stop_date != undefined &&
      this.state.stop_date != null &&
      this.state.stop_date != ''
    ) {
      if ( this.state.reopening_date == undefined || this.state.reopening_date == null || this.state.reopening_date == '') {
        error_str_arr.push('再開日を選択してください。');
        addRedBorder('reopening_date_id');
      }
    }
    return error_str_arr;
  }


  addPattern = async () => {
    this.confirmCancel();
    this.openConfirmCompleteModal("保存中");
    let new_pattern = {
      patient_id: this.state.patient_id,
      time_limit_from: this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "",
      time_limit_to: this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "",
      set_number: this.state.set_number,
      injection_category: this.state.injection_category,
      data_json: [
        {
          item_code: this.state.injectionCode1,
          item_name: this.state.injectionName1,
          amount: this.state.injectionAmount1,
        },
        {
          item_code: this.state.injectionCode2,
          item_name: this.state.injectionName2,
          amount: this.state.injectionAmount2,
        },
        {
          item_code: this.state.injectionCode3,
          item_name: this.state.injectionName3,
          amount: this.state.injectionAmount3,
        },
        {
          item_code: this.state.injectionCode4,
          item_name: this.state.injectionName4,
          amount: this.state.injectionAmount4,
        },
        {
          item_code: this.state.injectionCode5,
          item_name: this.state.injectionName5,
          amount: this.state.injectionAmount5,
        },
      ],
      timing_code: this.state.timing_code,
      weekday: this.state.final_week_days,
      week_interval: this.state.week_interval,
      monthly_enable_week_number: this.state.monthly_enable_week_number,
      entry_date: this.state.entry_date
        ? formatDateLine(this.state.entry_date)
        : "",
      entry_time: this.state.entry_time
        ? formatTime(this.state.entry_time)
        : "",
      instruction_doctor_number: this.state.instruction_doctor_number,
      stop_date: this.state.stop_date
        ? formatDateLine(this.state.stop_date)
        : "",
      reopening_date: this.state.reopening_date
        ? formatDateLine(this.state.reopening_date)
        : "",
    };

    let path = "/app/api/v2/dial/pattern/registerInjectionPattern";
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, {
        params: new_pattern,
      })
      .then(async(res) => {
        this.confirmCancel();
        var title = '';
        var message = res.alert_message;
        if (message != null){
          if (message.indexOf('変更') > -1) title = "変更完了";
          if (message.indexOf('登録') > -1) title = "登録完了";
          this.setState({
            alert_messages:message,
            confirm_alert_title:title,
          })
        }
        await this.initializeInfo(this.state.patient_id);
        if (res.pattern_number > 0 && res.detail_number > 0) await this.makeSchedule(res.pattern_number,res.detail_number,new_pattern,0);
      })
      .catch(() => {
        this.confirmCancel();
      })
      .finally(() => {
        this.double_click = false;
      });    
  };

  editpatternConfirm = (item) => {
    if (this.change_flag === 1) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "edit_pattern",        
        selected_pattern_data:item,
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({        
        selected_pattern_data:item,
      }, ()=> {
        this.editPattern();
      })
    }
  }
  editPattern = () => {    
    this.initRedBorder();
    let pattern_data = this.state.selected_pattern_data;
    let create_at = pattern_data.updated_at;
    let input_day = create_at.split(" ");
    let final_week_days = {};
    let another_day = false;
    var weekday = parseInt(pattern_data.weekday);
    for (var i = 0; i < 7; i++) {
      var pval = Math.pow(2, i);
      if ((weekday & pval) > 0) {
        final_week_days[i] = true;
        if (this.state.dialdays[i] === false) {
          another_day = true;
        }
      } else {
        final_week_days[i] = false;
      }
    }
    if (another_day === true) {
      this.setState({
        checkAnotherDay: 1,
        checkdialdays: {
          0: true,
          1: true,
          2: true,
          3: true,
          4: true,
          5: true,
          6: true,
        },
      });
    } else {
      this.getDialDays(this.state.patient_id);
    }
    var monthly_enable_week_number = pattern_data.monthly_enable_week_number;
    let check_enable_months = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    };
    if (monthly_enable_week_number === 1 || monthly_enable_week_number === 0) {
      check_enable_months[0] = true;
    } else {
      for (i = 1; i < 13; i++) {
        pval = Math.pow(2, i);
        if ((monthly_enable_week_number & pval) > 0) {
          check_enable_months[i] = true;
        } else {
          check_enable_months[i] = false;
        }
      }
    }
    var week_interval = pattern_data.week_interval;
    let check_enable_weeks = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    };
    if (week_interval === 1 || week_interval === 0) {
      check_enable_weeks[0] = true;
    } else {
      for (i = 1; i < 13; i++) {
        pval = Math.pow(2, i);
        if ((week_interval & pval) > 0) {
          check_enable_weeks[i] = true;
        } else {
          check_enable_weeks[i] = false;
        }
      }
    }

    let _state = {
      selected_number: pattern_data.injection_number,
      pattern_table_id: pattern_data.injection_number,
      set_number: pattern_data.set_number,
      injection_category: pattern_data.injection_category,
      week_interval,
      monthly_enable_week_number,
      final_week_days: weekday,
      checkalldays: final_week_days,
      check_enable_months,
      check_enable_weeks,
      timing_code: pattern_data.timing_code,
      time_limit_from: new Date(pattern_data.time_limit_from),
      time_limit_to:
        pattern_data.time_limit_to == null
          ? null
          : new Date(pattern_data.time_limit_to),
      injectionCode1: pattern_data.data_json[0].item_code,
      injectionCode2: pattern_data.data_json[1].item_code,
      injectionCode3: pattern_data.data_json[2].item_code,
      injectionCode4: pattern_data.data_json[3].item_code,
      injectionCode5: pattern_data.data_json[4].item_code,
      injectionName1: pattern_data.data_json[0].item_name,
      injectionName2: pattern_data.data_json[1].item_name,
      injectionName3: pattern_data.data_json[2].item_name,
      injectionName4: pattern_data.data_json[3].item_name,
      injectionName5: pattern_data.data_json[4].item_name,
      injectionAmount1: pattern_data.data_json[0].amount,
      injectionAmount2: pattern_data.data_json[1].amount,
      injectionAmount3: pattern_data.data_json[2].amount,
      injectionAmount4: pattern_data.data_json[3].amount,
      injectionAmount5: pattern_data.data_json[4].amount,
      injectionUnit1:
        pattern_data.data_json[0].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === pattern_data.data_json[0].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === pattern_data.data_json[0].item_code
            ).unit
          : "",
      injectionUnit2:
        pattern_data.data_json[1].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === pattern_data.data_json[1].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === pattern_data.data_json[1].item_code
            ).unit
          : "",
      injectionUnit3:
        pattern_data.data_json[2].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === pattern_data.data_json[2].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === pattern_data.data_json[2].item_code
            ).unit
          : "",
      injectionUnit4:
        pattern_data.data_json[3].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === pattern_data.data_json[3].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === pattern_data.data_json[3].item_code
            ).unit
          : "",
      injectionUnit5:
        pattern_data.data_json[4].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === pattern_data.data_json[4].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === pattern_data.data_json[4].item_code
            ).unit
          : "",
      final_entry_date: formatDateSlash(new Date(input_day[0])),
      final_entry_time: formatTime(formatTimePicker(input_day[1])),
      final_entry_name:
        this.state.staff_list_by_number != undefined &&
        this.state.staff_list_by_number != null
          ? pattern_data.updated_by !== 0
            ? this.state.staff_list_by_number[pattern_data.updated_by]
            : ""
          : "",
      final_doctor_name:
        pattern_data.instruction_doctor_number != null &&
        this.state.doctor_list_by_number != undefined
          ? this.state.doctor_list_by_number[
              pattern_data.instruction_doctor_number
            ]
          : "",
      stop_date:
        pattern_data.stop_date != undefined
          ? new Date(pattern_data.stop_date)
          : "",
      reopening_date:
        pattern_data.reopening_date != undefined
          ? new Date(pattern_data.reopening_date)
          : "",
    };

    let isAllCheckedOfDialDays = this.checkAllChekedOfDialDays(final_week_days);
    if (isAllCheckedOfDialDays) {
      _state.select_dial_days = true;
    } else {
      _state.select_dial_days = false;
    }

    this.setState(_state);
    this.ex_startdate = new Date(pattern_data.time_limit_from);
    this.ex_enddate =
      pattern_data.time_limit_to == null
        ? null
        : new Date(pattern_data.time_limit_to);
    this.ex_stop_date =
      pattern_data.stop_date != undefined
        ? new Date(pattern_data.stop_date)
        : "";
    this.ex_reopening_date =
      pattern_data.reopening_date != undefined
        ? new Date(pattern_data.reopening_date)
        : "";
    this.ex_weekday = weekday;
    this.ex_monthly_enable_week_number = monthly_enable_week_number;
    this.ex_week_interval = week_interval;

    this.ex_pattern = {
      patient_id: this.state.patient_id,
      time_limit_from: pattern_data.time_limit_from,
      time_limit_to:
        pattern_data.time_limit_to == null ? "" : pattern_data.time_limit_to,
      set_number: pattern_data.set_number,
      injection_category: pattern_data.injection_category,
      data_json: [
        {
          item_code: pattern_data.data_json[0].item_code,
          item_name: pattern_data.data_json[0].item_name,
          amount: pattern_data.data_json[0].amount,
        },
        {
          item_code: pattern_data.data_json[1].item_code,
          item_name: pattern_data.data_json[1].item_name,
          amount: pattern_data.data_json[1].amount,
        },
        {
          item_code: pattern_data.data_json[2].item_code,
          item_name: pattern_data.data_json[2].item_name,
          amount: pattern_data.data_json[2].amount,
        },
        {
          item_code: pattern_data.data_json[3].item_code,
          item_name: pattern_data.data_json[3].item_name,
          amount: pattern_data.data_json[3].amount,
        },
        {
          item_code: pattern_data.data_json[4].item_code,
          item_name: pattern_data.data_json[4].item_name,
          amount: pattern_data.data_json[4].amount,
        },
      ],
      timing_code: pattern_data.timing_code,
      weekday: weekday,
      week_interval: week_interval,
      monthly_enable_week_number: monthly_enable_week_number,
      stop_date:
        pattern_data.stop_date != undefined ? pattern_data.stop_date : "",
      reopening_date:
        pattern_data.reopening_date != undefined
          ? pattern_data.reopening_date
          : "",
    };
    this.setChangeFlag(0);
  };

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };

  checkEqual(data1, data2) {
    if (JSON.stringify(data1) == JSON.stringify(data2)) return true;
    return false;
  }

  updatePattern = async (re_schedule = true) => {
    if (this.state.pattern_table_id !== "") {
      var time_limit_from,
        time_limit_to,
        stop_date,
        reopening_date,
        week_interval,
        monthly_enable_week_number,
        weekday;
      if (re_schedule) {
        time_limit_from = this.state.time_limit_from
          ? formatDateLine(this.state.time_limit_from)
          : "";
        (time_limit_to = this.state.time_limit_to
          ? formatDateLine(this.state.time_limit_to)
          : ""),
          (stop_date = this.state.stop_date
            ? formatDateLine(this.state.stop_date)
            : "");
        reopening_date = this.state.reopening_date
          ? formatDateLine(this.state.reopening_date)
          : "";
        week_interval = this.state.week_interval;
        monthly_enable_week_number = this.state.monthly_enable_week_number;
        weekday = this.state.final_week_days;
      } else {
        time_limit_from = formatDateLine(this.ex_startdate);
        time_limit_to = formatDateLine(this.ex_enddate);
        stop_date = formatDateLine(this.ex_stop_date);
        reopening_date = formatDateLine(this.ex_reopening_date);
        week_interval = this.ex_week_interval;
        monthly_enable_week_number = this.ex_monthly_enable_week_number;
        weekday = this.ex_weekday;
      }

      let update_pattern = {
        number: this.state.pattern_table_id,
        patient_id: this.state.patient_id,
        time_limit_from: time_limit_from,
        time_limit_to: time_limit_to,
        set_number: this.state.set_number,
        injection_category: this.state.injection_category,
        data_json: [
          {
            item_code: this.state.injectionCode1,
            item_name: this.state.injectionName1,
            amount: this.state.injectionAmount1,
          },
          {
            item_code: this.state.injectionCode2,
            item_name: this.state.injectionName2,
            amount: this.state.injectionAmount2,
          },
          {
            item_code: this.state.injectionCode3,
            item_name: this.state.injectionName3,
            amount: this.state.injectionAmount3,
          },
          {
            item_code: this.state.injectionCode4,
            item_name: this.state.injectionName4,
            amount: this.state.injectionAmount4,
          },
          {
            item_code: this.state.injectionCode5,
            item_name: this.state.injectionName5,
            amount: this.state.injectionAmount5,
          },
        ],
        timing_code: this.state.timing_code,
        weekday: weekday,
        week_interval: week_interval,
        monthly_enable_week_number: monthly_enable_week_number,
        entry_date: this.state.entry_date
          ? formatDateLine(this.state.entry_date)
          : "",
        entry_time: this.state.entry_time
          ? formatTime(this.state.entry_time)
          : "",
        instruction_doctor_number: this.state.instruction_doctor_number,
        stop_date: stop_date,
        sch_all_remove: 1,
        reopening_date: reopening_date,
      };

      var new_pattern = {
        patient_id: this.state.patient_id,
        time_limit_from: time_limit_from,
        time_limit_to: time_limit_to,
        set_number: this.state.set_number,
        injection_category: this.state.injection_category,
        data_json: [
          {
            item_code: this.state.injectionCode1,
            item_name: this.state.injectionName1,
            amount: this.state.injectionAmount1,
            unit: this.state.injectionUnit1,
          },
          {
            item_code: this.state.injectionCode2,
            item_name: this.state.injectionName2,
            amount: this.state.injectionAmount2,
            unit: this.state.injectionUnit2,
          },
          {
            item_code: this.state.injectionCode3,
            item_name: this.state.injectionName3,
            amount: this.state.injectionAmount3,
            unit: this.state.injectionUnit3,
          },
          {
            item_code: this.state.injectionCode4,
            item_name: this.state.injectionName4,
            amount: this.state.injectionAmount4,
            unit: this.state.injectionUnit4,
          },
          {
            item_code: this.state.injectionCode5,
            item_name: this.state.injectionName5,
            amount: this.state.injectionAmount5,
            unit: this.state.injectionUnit5,
          },
        ],
        timing_code: this.state.timing_code,
        weekday: weekday,
        week_interval: week_interval,
        monthly_enable_week_number: monthly_enable_week_number,
        stop_date: stop_date,
        reopening_date: reopening_date,
      };

      if (this.checkEqual(this.ex_pattern, new_pattern)) {
        this.confirmCancel();
        this.setState({
          alert_messages:"変更されたデータがありません。"
        })        
        return;
      }
      this.openConfirmCompleteModal("保存中");

      let path = "/app/api/v2/dial/pattern/updateInjectionPattern";

      await apiClient
        .post(path, {
          params: update_pattern,
        })
        .then(async(res) => {
          this.confirmCancel();
          var title = '';
          var message = res.alert_message;
          if (message != null){
            if (message.indexOf('変更') > -1) title = "変更完了";
            if (message.indexOf('登録') > -1) title = "登録完了";
            this.setState({
              alert_messages:message,
              confirm_alert_title:title,
            })
          }
          await this.initializeInfo(this.state.patient_id);
          if (res.pattern_number > 0 && res.detail_number > 0) await this.makeSchedule(res.pattern_number,res.detail_number,update_pattern,1);
        })
        .catch(() => {
          this.confirmCancel();
        })
        .finally(() => {
          this.double_click = false;
        });
    }    
  };

  makeSchedule(pattern_number, detail_number, post_data, edit_flag, message = null) {
    post_data.pattern_number = pattern_number;
    post_data.detail_number = detail_number;
    post_data.edit_flag = edit_flag;
    let path = "/app/api/v2/dial/pattern/makeInjectionSchedule";
    apiClient.post(path, {params: post_data,})
    .then(async() => {      
      var title = '';
      if (message != null){
        if (message.indexOf('変更') > -1) title = "変更完了";
        if (message.indexOf('登録') > -1) title = "登録完了";
        this.setState({
          alert_messages:message,
          confirm_alert_title:title,
        })
      }
      // await this.initializeInfo(this.state.patient_id);
    });
  }

  deletePattern = async (type) => {
    if (this.state.pattern_table_id !== "") {
      this.openConfirmCompleteModal("削除中");
      let delete_pattern = {
        number: this.state.pattern_table_id,
        system_patient_id: this.state.patient_id,
        all_remove: type == true ? 1 : 0,
      };
      await this.deleteDialPatternFromPost(delete_pattern);
      await this.initializeInfo(this.state.patient_id);
    }
    this.confirmCancel();
  };

  async deleteDialPatternFromPost(data) {
    let path = "/app/api/v2/dial/pattern/deleteInjectionPattern";

    await apiClient
      .post(path, {
        params: data,
      })
      .then((res) => {
        this.setState({
          alert_messages:res.alert_message,
          confirm_alert_title:'削除完了'
        })        
      })
      .catch(() => {});
  }

  addDay = (value) => {
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = checkalldays[value] ? false : true;
    var final_week_days = parseInt(this.state.final_week_days);
    var pval = Math.pow(2, value);
    final_week_days =
      (final_week_days & pval) > 0
        ? final_week_days - pval
        : final_week_days + pval;
    this.setChangeFlag(1);

    let isAllCheckedOfDialDays = this.checkAllChekedOfDialDays(checkalldays);
    if (isAllCheckedOfDialDays) {
      this.setState({
        final_week_days,
        checkalldays,
        select_dial_days: true,
      });
    } else {
      this.setState({ final_week_days, checkalldays}, () => {
        this.calcEndDate();
      });
    }
  };

  checkAllChekedOfDialDays = (checkalldays) => {
    let result = 0;
    Object.keys(this.state.dialdays).map((item) => {
      if (this.state.dialdays[item] == checkalldays[item]) {
        result += 1;
      }
    });

    if (result == 7) return true;
    else return false;
  };

  SetImplementationMonth = (value) => {
    this.setChangeFlag(1);
    let check_enable_months = this.state.check_enable_months;
    let monthly_enable_week_number = parseInt(
      this.state.monthly_enable_week_number
    );
    if (value !== 0 && check_enable_months[0] == true) {
      check_enable_months[0] = false;
      monthly_enable_week_number--;
    }
    if (value == 0) {
      monthly_enable_week_number = 1;
      check_enable_months = {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      };
    } else {
      check_enable_months[value] = check_enable_months[value] ? false : true;
      let pval = Math.pow(2, value);
      monthly_enable_week_number =
        (monthly_enable_week_number & pval) > 0
          ? monthly_enable_week_number - pval
          : monthly_enable_week_number + pval;
    }
    this.setState({ monthly_enable_week_number, check_enable_months}, () => {
      this.calcEndDate();
    });
  };

  SetWeekInterval = (value) => {
    let check_enable_weeks = this.state.check_enable_weeks;
    let week_interval = parseInt(this.state.week_interval);
    this.setChangeFlag(1);

    if (value !== 0 && check_enable_weeks[0] == true) {
      check_enable_weeks[0] = false;
      week_interval--;
    }
    if (value == 0) {
      week_interval = 1;
      check_enable_weeks = {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      };
    } else {
      check_enable_weeks[value] = check_enable_weeks[value] ? false : true;
      var pval = Math.pow(2, value);
      week_interval =
        (week_interval & pval) > 0
          ? week_interval - pval
          : week_interval + pval;
    }
    this.setState({ week_interval, check_enable_weeks}, () => {
      this.calcEndDate();
    });
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isReScheduleConfirm: false,
      isUpdateScheduleConfirmModal: false,
      isConfirmComplete: false,
      isAddConfirmModal: false,
      isSetDataConfirm: false,
      isOpenMoveOtherPageConfirm: false,
      isClearConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  openScheduleConfirmModal = () => {
    this.setState({ isUpdateScheduleConfirmModal: true });
  };

  updatePatternSchedule = (type) => {
    this.updatePattern(true, type);
  };
  confirmReSchedule = () => {
    var time_limit_from = formatJapan(this.state.time_limit_from);
    var time_limit_to = this.state.time_limit_to
      ? formatJapan(this.state.time_limit_to)
      : "無期限";
    let weekday = "";
    for (let i = 0; i < 7; i++) {
      weekday +=
        this.state.final_week_days & Math.pow(2, i) ? week_days[i] : "";
    }
    this.setState({
      isReScheduleConfirm: true,
      confirm_message:
        "対象日全てに変更を反映しますか" +
        "\n" +
        "期限 " +
        time_limit_from +
        " ～ " +
        time_limit_to +
        "\n  （" +
        weekday +
        "）",
    });
  };

  reScheduleCancel = () => {
    this.confirmCancel();
    this.updatePattern(false);
  };

  update = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (this.state.pattern_table_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "変更するパターンを選択してください。"
      );
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.EDIT
      ) === false
    ) {
      window.sessionStorage.setItem("alert_messages", "変更権限がありません。");
      return;
    }
    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    
    let error_str_array = this.checkValidation()
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return
    }

    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "パターン情報を変更しますか?",
    });
  };

  delete = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (this.state.pattern_table_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "削除するパターンを選択してください。"
      );
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.DELETE
      ) == false
    ) {
      window.sessionStorage.setItem("alert_messages", "削除権限がありません。");
      return;
    }
    this.setState({
      isDeleteConfirmModal: true,
      // confirm_message: "パターン情報を削除しますか?",
    });
  };

  selectDoctor = (doctor) => {
    this.setState({
      directer_name: doctor.name,
      instruction_doctor_number: doctor.number,
    });
    this.context.$updateDoctor(doctor.number, doctor.name);
    this.setChangeFlag(1);
    this.closeDoctorSelectModal();
  };

  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;
    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_number > 0) {
      this.setState({
        directer_name: authInfo.name,
        instruction_doctor_number: authInfo.doctor_number,
      });
    } else {
      this.setState({
        isShowDoctorList: true,
      });
    }
  };

  closeDoctorSelectModal = () => {
    this.setState({
      isShowDoctorList: false,
    });
  };

  goOtherPattern = (url) => {
    if (this.change_flag === 1) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "other_tab",
        go_url: url,
        confirm_alert_title:'入力中',
      });
      return;
    }
    if (url == "/dial/schedule/Schedule")
      sessApi.setObjectValue("dial_schedule_table", "open_tab", "injection");
    this.props.history.replace(url);
  };

  clear = () => {
    if (!this.change_flag) return;
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      isClearConfirmModal: true,
      confirm_message: "入力中の内容を消去しますか？",
    });
  };

  clearPattern =async() => {
    this.confirmCancel();
    if (this.state.patient_id !== "") {
      await this.initializeInfo(this.state.patient_id);
    }
  };

  openInjectionSelectModal = (val) => {
    if (this.state['injectionCode' + (val - 1)] < 1){
      return;
    }
    this.setState({
      isOpenInjectionSelectModal: true,
      select_injection_tag: val,
    });
  };

  selectInjectionCode = (item) => {
    let name = "";
    let unit = "";
    if (this.state.injectionMasterData != undefined) {
      name = this.state.injectionMasterData.find((x) => x.code === item.code)
        .name;
      unit = this.state.injectionMasterData.find((x) => x.code === item.code)
        .unit;
      switch (this.state.select_injection_tag) {
        case 1:
          this.setState({
            injectionCode1: item.code,
            injectionName1: name ? name : "",
            injectionUnit1: unit ? unit : "",
          });
          break;
        case 2:
          this.setState({
            injectionCode2: item.code,
            injectionName2: name ? name : "",
            injectionUnit2: unit ? unit : "",
          });
          break;
        case 3:
          this.setState({
            injectionCode3: item.code,
            injectionName3: name ? name : "",
            injectionUnit3: unit ? unit : "",
          });
          break;
        case 4:
          this.setState({
            injectionCode4: item.code,
            injectionName4: name ? name : "",
            injectionUnit4: unit ? unit : "",
          });
          break;
        case 5:
          this.setState({
            injectionCode5: item.code,
            injectionName5: name ? name : "",
            injectionUnit5: unit ? unit : "",
          });
          break;
      }
      this.setChangeFlag(1);
    }
    this.closeModal();
  };

  closeModal = () => {
    this.setState({
      isOpenInjectionSelectModal: false,
      isOpenInjectionSet: false,
      alert_messages:'',
      confirm_alert_title:'',
    });
  };

  deleteInjectName = (index) => {    
    switch (index) {
      case 1:
        this.setState({ injectionCode1: "", injectionName1: "", injectionUnit1:'', injectionAmount1:'' });
        break;
      case 2:
        this.setState({ injectionCode2: "", injectionName2: "", injectionUnit2:'', injectionAmount2:''  });
        break;
      case 3:
        this.setState({ injectionCode3: "", injectionName3: "", injectionUnit3:'', injectionAmount3:''  });
        break;
      case 4:
        this.setState({ injectionCode4: "", injectionName4: "", injectionUnit4:'', injectionAmount4:''  });
        break;
      case 5:
        this.setState({ injectionCode5: "", injectionName5: "", injectionUnit5:'', injectionAmount5:''  });
        break;
    }
    this.setChangeFlag(1);
  };

  openInjectionSet = () => {
    if (this.state.anticoagulation_method1 == "") {
      this.setState({alert_messages:"大分類を選択してください。"})      
      return;
    }
    let set_category = this.state.category_data.find(
      (x) => x.number == this.state.anticoagulation_method1
    );
    this.setState({
      isOpenInjectionSet: true,
      set_category,
    });
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
          contextMenu: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 200,
          y: e.clientY + window.pageYOffset - 70,
        },
        row_index: index,
      });
    }
  };

  contextMenuAction = (index, type) => {
    if (type === "edit") {
      this.editSetData(index);
    }
  };

  editSetData(index) {
    let set_category = this.state.category_data.find(
      (x) => x.number == this.state.anticoagulation_method1
    );
    this.setState({
      injectionSetData: this.state.injection_set_data[index],
      isOpenInjectionSet: true,
      set_category,
    });
  }
  saveSetData = async () => {
    let set_data = await apiClient.post(
      "/app/api/v2/dial/pattern/searchInjectionSet",
      { params: {order:'sort_number'} }
    );
    let category_code = this.state.category_data.find(
      (x) => x.number == this.state.anticoagulation_method1
    ).code;
    let filter_data = set_data.filter((x) => x.category_code == category_code);
    this.setState({
      set_data,
      isOpenInjectionSet: false,
      injection_set_data: filter_data,
    });
  };

  setDataJson = (data) => {
    if (data === undefined || data == null) return;
    if (this.state.timing_code === 0) {
      this.setConfirmDataJson(data);
    } else {
      this.setState({
        isSetDataConfirm: true,
        set_json_data: data,
        injectionSetData: data,
        confirm_message: "上書きして良いですか？",
      });
    }
  };
  setConfirmDataJson = (data) => {
    this.confirmCancel();
    if (data === undefined || data == null) return;
    this.setState({
      selected_set_number: data.number,
      injectionSetData: data,
      injection_category: data.injection_category,
      injectionCode1: data.data_json[0].item_code,
      injectionCode2: data.data_json[1].item_code,
      injectionCode3: data.data_json[2].item_code,
      injectionCode4: data.data_json[3].item_code,
      injectionCode5: data.data_json[4].item_code,
      injectionName1: data.data_json[0].item_name,
      injectionName2: data.data_json[1].item_name,
      injectionName3: data.data_json[2].item_name,
      injectionName4: data.data_json[3].item_name,
      injectionName5: data.data_json[4].item_name,
      injectionAmount1: data.data_json[0].amount,
      injectionAmount2: data.data_json[1].amount,
      injectionAmount3: data.data_json[2].amount,
      injectionAmount4: data.data_json[3].amount,
      injectionAmount5: data.data_json[4].amount,
      injectionUnit1:
        data.data_json[0].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === data.data_json[0].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === data.data_json[0].item_code
            ).unit
          : "",
      injectionUnit2:
        data.data_json[1].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === data.data_json[1].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === data.data_json[1].item_code
            ).unit
          : "",
      injectionUnit3:
        data.data_json[2].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === data.data_json[2].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === data.data_json[2].item_code
            ).unit
          : "",
      injectionUnit4:
        data.data_json[3].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === data.data_json[3].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === data.data_json[3].item_code
            ).unit
          : "",
      injectionUnit5:
        data.data_json[4].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === data.data_json[4].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === data.data_json[4].item_code
            ).unit
          : "",
    });
  };

  openCalc = (type, val, unit) => {
    if (!this.can_open_calc) return;
    let _state = {
      calcInit: val != undefined && val != null && val > 0 ? val : 0,
      calcValType: type,
      isOpenCalcModal: true,
      calcUnit:unit
    };
    if (
      this.state.injection_codes != undefined &&
      this.state.injection_codes != null
    ) {
      if (type == "amount1") {
        if (this.state.injectionCode1 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode1
          ];
        }
      } else if (type == "amount2") {
        if (this.state.injectionCode2 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode2
          ];
        }
      } else if (type == "amount3") {
        if (this.state.injectionCode3 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode3
          ];
        }
      } else if (type == "amount4") {
        if (this.state.injectionCode4 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode4
          ];
        }
      } else if (type == "amount5") {
        if (this.state.injectionCode5 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode5
          ];
        }
      }
    }

    this.setState(_state);
  };

  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcTitle: "",
      calcUnit: "",
      calcInit: 0,
    });
  };

  calcConfirm = (val) => {
    let _state = { isOpenCalcModal: false };
    if (this.state.calcValType == "amount1") {
      _state.injectionAmount1 = val;
    } else if (this.state.calcValType == "amount2") {
      _state.injectionAmount2 = val;
    } else if (this.state.calcValType == "amount3") {
      _state.injectionAmount3 = val;
    } else if (this.state.calcValType == "amount4") {
      _state.injectionAmount4 = val;
    } else if (this.state.calcValType == "amount5") {
      _state.injectionAmount5 = val;
    }
    _state.calcValType = "";
    _state.calcTitle = "";
    _state.calcUnit = "";
    _state.calcInit = 0;
    this.setChangeFlag(1);
    this.setState(_state);
  };
  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "injection", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };

  moveOtherPage = () => {
    this.setChangeFlag(0);
    let confirm_type = this.state.confirm_type;
    let go_url = this.state.go_url;
    this.setState(
      {
        isOpenMoveOtherPageConfirm: false,
        confirm_message: "",
        confirm_type: "",
        confirm_alert_title:'',
      },
      () => {
        if (confirm_type === "other_tab") {
          this.goOtherPattern(go_url);
        } else if (confirm_type == "edit_pattern") {
          this.editPattern();
        }
      }
    );
  };
  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    patternValidate('dial_injection_pattern',this.state, 'background');
    if (this.state.injectionCode1 < 1) {
      addRequiredBg('injectionCode1_id')
    } else {
      removeRequiredBg("injectionCode1_id");
    }
    if (!(this.state.injectionAmount1 > 0)) {
      addRequiredBg('injectionAmount1_id')
    } else {
      removeRequiredBg("injectionAmount1_id");
    }

    removeRequiredBg("final_week_days_id");
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  /**
  ・E②a. 2つめ以降の注射名欄は、その欄未設定で一つ上の注射名欄が未設定ならグレーアウトさせる。
    (新規は上から順にしか追加できない・複数入れてから途中のものを無くしたときは無効化しない）
  ・E②b. 2つ目以降の数量欄は、対応する左の注射名欄が設定されていないときはグレーアウトさせる。
  **/
  grayOut = (type, index) => {
    let ret_val = false;
    if (index > 1) {
      if (type == "injectionCode") {
        if (this.state[type + (index - 1)] < 1){
          ret_val = true;
          // this.setState({[type + (index - 1)]: ''});
        }
      } else if (type == "injectionAmount") {
        if (this.state['injectionCode' + index] < 1){
          ret_val = true;
          // this.setState({[type + index]: ''});
        }
      }
    }
    return ret_val;
  }

  resetDatePicker = (e) => {
    if (e.target.id == this.state.first_tag_id){
      addRedBorder(e.target.id);
    }
    this.forceUpdate();
  }

  render() {    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let timing_codes = this.state.timing_codes;
    let message;
    let injection_pattern = [];
    let { injection_set_category, injection_set_data } = this.state;
    let can_delete = this.state.pattern_table_id != "";
    let del_tooltip = "";
    if (this.state.patient_id === "") {
      del_tooltip = "患者様を選択してください。";
    }
    if (this.state.pattern_table_id === "") {
      del_tooltip = "削除するパターンを選択してください。";
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.DELETE
      ) === false
    ) {
      del_tooltip = "削除権限がありません。";
    }
    let clear_tooltip = this.state.change_flag
      ? ""
      : "変更した内容がありません";
    if (this.state.injection_pattern.length) {
      injection_pattern = this.state.injection_pattern.map((item) => {
        let weekday = "";
        for (let i = 0; i < 7; i++) {
          weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
        }
        return (
          <>
            <div className={"pattern-list " + (this.state.selected_number === item.injection_number? "selected": "")} onClick={this.editpatternConfirm.bind(this, item)}>
              <div className={"pattern-index bl-1p bt-1p bb-1p"}>
                {item.set_number === 0 ? "未設定" : item.set_number}
              </div>
              <div className={"pattern-category bl-1p bt-1p bb-1p"}>
                {item.injection_category}
              </div>
              <div className={"injection-name bl-1p bt-1p bb-1p"}>
                {/* {item.data_json[0]["item_name"]} */}
                {renderHTML(displayInjectionName(item.data_json[0]["item_code"], item.data_json[0]["item_name"]))}
              </div>
              <div className={"pattern-time bl-1p bt-1p bb-1p"}>
                {timing_codes != undefined &&
                timing_codes != null &&
                timing_codes[item.timing_code] != undefined
                  ? timing_codes[item.timing_code]
                  : ""}
              </div>
              <div className={"pattern-week-day bl-1p bt-1p bb-1p"}>
                {weekday}
              </div>
              <div className={"pattern-time_limit_from bl-1p bt-1p bb-1p"}>
                {formatDateSlash(item.time_limit_from)}
              </div>
              <div className={"pattern-time_limit_to bl-1p bt-1p bb-1p br-1p"}>
                {item.time_limit_to == null
                  ? "～ 無期限"
                  : formatDateSlash(item.time_limit_to)}
              </div>
            </div>
          </>
        );
      });
    } else {
      message = (
        <div className="no-result">
          <span>登録された注射パターンがありません。</span>
        </div>
      );
    }
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          ref={(ref) => (this.sideBarRef = ref)}
          history = {this.props.history}
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo}
          history = {this.props.history}
        />
        <Card>
          <div className={"flex"}>
            <div className="title">注射パターン</div>
            <div className={"other-pattern"}>
              <Button className="schedule-button" onClick={this.goOtherPattern.bind(this,"/dial/schedule/Schedule")}>スケジュール</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/dialPattern")}>透析</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/anticoagulation")}>抗凝固法</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/Dializer")}>ダイアライザ</Button>
              <Button className="disable-button">注射</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/prescription")}>処方</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/inspection")}>検査</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/dialPrescript")}>透析中処方</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/administrativefee")}>管理料</Button>
            </div>
          </div>
          <div className="bodywrap">
            <Wrapper>
              <div className="top-table">
                <div className="dial-list">
                  <div className="table-header">
                    <div className={"pattern-index bl-1p bt-1p bb-1p"}>セット</div>
                    <div className={"pattern-category bl-1p bt-1p bb-1p"}>区分</div>
                    <div className={"injection-name bl-1p bt-1p bb-1p text-center"}>注射名</div>
                    <div className={"pattern-time bl-1p bt-1p bb-1p"}>タイミング</div>
                    <div className={"pattern-week-day bl-1p bt-1p bb-1p"}>曜日</div>
                    <div className={"pattern-time_limit_from bl-1p bt-1p bb-1p br-1p"}>期限</div>
                  </div>
                  <MethodBox>
                    {injection_pattern}
                    {message}
                  </MethodBox>
                </div>
              </div>
              <div className="last-history">
                <Checkbox
                  label="期限切れも表示"
                  getRadio={this.getShowHistory.bind(this)}
                  value={this.state.showHistory}
                  isDisabled = {this.state.patient_id > 0? false: true}
                  name="schedule"
                />
              </div>
              <div className="dial-oper">
                <div>
                  <SelectorWithLabel
                    options={set_numbers}
                    title="セット"
                    getSelect={this.getSetnumber}
                    departmentEditCode={this.state.set_number}
                  />
                </div>
                <div>
                  <div className="flex kind"  style={{width: "41rem"}}>
                    <label className="label-div label-title" style={{cursor:"text"}}>区分</label>
                    <div id='injection_category_id' className={'select-category'}>
                      {sortations.map((item, key) => {
                        return (
                          <>
                            <RadioButton
                              id={`sortation${key}`}
                              value={key}
                              label={item}
                              name="sortation"
                              getUsage={this.changeMedicineKind.bind(this, key)}
                              checked={
                                this.state.injection_category === item
                                  ? true
                                  : false
                              }
                            />
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="medicine-area">
                  <div className="medicine-label">
                    <label className="label-title" style={{cursor:"text"}}>注射名</label>
                  </div>
                  <div className={"name-area"}>
                    <div className='flex'>
                      <div id="injectionCode1_id" className="clickable flex inject-name" onClick={this.openInjectionSelectModal.bind(this, 1)}>
                        {renderHTML(displayInjectionName(this.state.injectionCode1, this.state.injectionName1, true))}
                      </div>
                      <div className='delete-button'>
                        <Button className={this.state.injectionName1==''?'disable-btn':''} isDisabled={this.state.injectionName1==''} type="common" onClick={this.deleteInjectName.bind(this, 1)}>C</Button>
                      </div>                      
                    </div>
                    <div className='flex'>
                      <div id="injectionCode2_id" className={"clickable flex inject-name " + (this.grayOut('injectionCode', 2)?'disabled-general':'')} onClick={this.openInjectionSelectModal.bind(this, 2)}>
                        {renderHTML(displayInjectionName(this.state.injectionCode2, this.state.injectionName2, true))}
                      </div>
                      <div className='delete-button'>
                        <Button className={this.state.injectionName2==''?'disable-btn':''} isDisabled={this.state.injectionName2==''} type="common" onClick={this.deleteInjectName.bind(this, 2)}>C</Button>
                      </div>                      
                    </div>
                    <div className='flex'>
                      <div id="injectionCode3_id" className={"clickable flex inject-name " + (this.grayOut('injectionCode', 3)?'disabled-general':'')} onClick={this.openInjectionSelectModal.bind(this, 3)}>
                        {renderHTML(displayInjectionName(this.state.injectionCode3, this.state.injectionName3, true))}
                      </div>
                      <div className='delete-button'>
                        <Button className={this.state.injectionName3==''?'disable-btn':''} isDisabled={this.state.injectionName3==''} type="common" onClick={this.deleteInjectName.bind(this, 3)}>C</Button>
                      </div>
                    </div>
                    <div className='flex'>
                      <div id="injectionCode4_id" className={"clickable flex inject-name " + (this.grayOut('injectionCode', 4)?'disabled-general':'')} onClick={this.openInjectionSelectModal.bind(this, 4)}>
                        {renderHTML(displayInjectionName(this.state.injectionCode4, this.state.injectionName4, true))}
                      </div>
                      <div className='delete-button'>
                        <Button className={this.state.injectionName4==''?'disable-btn':''} isDisabled={this.state.injectionName4==''} type="common" onClick={this.deleteInjectName.bind(this, 4)}>C</Button>
                      </div>
                    </div>
                    <div className='flex'>
                      <div id="injectionCode5_id" className={"clickable flex inject-name " + (this.grayOut('injectionCode', 5)?'disabled-general':'')} onClick={this.openInjectionSelectModal.bind(this, 5)}>
                        {renderHTML(displayInjectionName(this.state.injectionCode5, this.state.injectionName5, true))}
                      </div>
                      <div className='delete-button'>
                        <Button className={this.state.injectionName5==''?'disable-btn':''} isDisabled={this.state.injectionName5==''} type="common" onClick={this.deleteInjectName.bind(this, 5)}>C</Button>
                      </div>
                    </div>
                  </div>
                  <div className={"amount-area"}>
                    <div className="amount-input">
                      <NumericInputWithUnitLabel
                        label="数量"
                        value={this.state.injectionAmount1}
                        getInputText={this.getinjectionAmount1.bind(this)}
                        inputmode="numeric"
                        unit={this.state.injectionUnit1}
                        onClickEvent={() =>
                          this.openCalc("amount1", this.state.injectionAmount1, this.state.injectionUnit1)
                        }
                        min={0}
                        id="injectionAmount1_id"
                        disabled={this.grayOut('injectionAmount', 1)}
                      />
                    </div>
                    <div className="amount-input">
                      <NumericInputWithUnitLabel
                        label=""
                        value={this.state.injectionAmount2}
                        getInputText={this.getinjectionAmount2.bind(this)}
                        inputmode="numeric"
                        unit={this.state.injectionUnit2}
                        onClickEvent={() =>
                          this.openCalc("amount2", this.state.injectionAmount2, this.state.injectionUnit2)
                        }
                        min={0}
                        id = 'injectionAmount2_id'
                        disabled={this.grayOut('injectionAmount', 2)}
                      />
                    </div>
                    <div className="amount-input">
                      <NumericInputWithUnitLabel
                        label=""
                        value={this.state.injectionAmount3}
                        getInputText={this.getinjectionAmount3.bind(this)}
                        inputmode="numeric"
                        unit={this.state.injectionUnit3}
                        onClickEvent={() =>
                          this.openCalc("amount3", this.state.injectionAmount3, this.state.injectionUnit3)
                        }
                        min={0}
                        id = 'injectionAmount3_id'
                        disabled={this.grayOut('injectionAmount', 3)}

                      />
                    </div>
                    <div className="amount-input">
                      <NumericInputWithUnitLabel
                        label=""
                        value={this.state.injectionAmount4}
                        getInputText={this.getinjectionAmount4.bind(this)}
                        inputmode="numeric"
                        unit={this.state.injectionUnit4}
                        onClickEvent={() =>
                          this.openCalc("amount4", this.state.injectionAmount4, this.state.injectionUnit4)
                        }
                        min={0}
                        id = 'injectionAmount4_id'
                        disabled={this.grayOut('injectionAmount', 4)}
                      />
                    </div>
                    <div className="amount-input">
                      <NumericInputWithUnitLabel
                        label=""
                        value={this.state.injectionAmount5}
                        getInputText={this.getinjectionAmount5.bind(this)}
                        inputmode="numeric"
                        unit={this.state.injectionUnit5}
                        onClickEvent={() =>
                          this.openCalc("amount5", this.state.injectionAmount5, this.state.injectionUnit5)
                        }
                        min={0}
                        id = 'injectionAmount5_id'
                        disabled={this.grayOut('injectionAmount', 5)}
                      />
                    </div>
                  </div>
                  <div className={"pattern-export"}>
                    <div className="history-list">
                      <div className="text-left history-head">
                        セットから呼び出し
                      </div>
                      <div className="flex">
                        <div className="text-left history-title">大分類</div>
                        {this.context.$canDoAction(this.context.FEATURES.DIAL_INJECTION_SET_MASTER, this.context.AUTHS.EDIT, 0) && (
                          <>
                            <div
                              className="text-right history-delete pt-10"
                              onClick={this.openInjectionSet}
                            >
                              <Icon icon={faPen} />
                              セット登録/編集
                            </div>
                          </>
                        )}
                      </div>
                      <SelectorWithLabel
                        options={injection_set_category}
                        title=""
                        getSelect={this.getAnticoagulationMethod1}
                        departmentEditCode={this.state.anticoagulation_method1}
                      />
                      <div className="text-left history-title">
                        注射セット名
                      </div>
                      <div className="box-border">
                        <div className="dummy_2 select-area pl-1">
                          {injection_set_data !== undefined &&
                            injection_set_data != null &&
                            injection_set_data.length > 0 &&
                            injection_set_data.map((item, index) => {
                              return (
                                <p
                                  key={item}
                                  className={
                                    this.state.selected_set_number ==
                                    item.number
                                      ? "selected"
                                      : ""
                                  }
                                  onContextMenu={(e) =>
                                    this.handleClick(e, index)
                                  }
                                  onClick={this.setDataJson.bind(this, item)}
                                >
                                  {item.name}
                                </p>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-content">
                  <div className="left-area">
                    <SelectorWithLabel
                      options={this.state.timing_options}
                      title="タイミング"
                      getSelect={this.getTimingList.bind(this)}
                      departmentEditCode={this.state.timing_code}
                      id = 'timing_code_id'
                    />
                    <div className="implementation_month">
                      <label className="implementation_month-label label-title" style={{cursor:"text"}}>実施月</label>
                      <>
                        {implementation_months.map((item, key) => {
                          return (
                            <>
                              <RadioGroupButton
                                id={`implementation_month${key}`}
                                value={key}
                                label={item}
                                name="implementation_month"
                                getUsage={this.SetImplementationMonth.bind(this,key)}
                                checked={this.state.check_enable_months[key]}
                              />
                            </>
                          );
                        })}
                      </>
                    </div>
                    <div className="implementation_interval">
                      <label className="implementation_interval-label label-title" style={{cursor:"text"}}>
                        実施間隔
                      </label>
                      <>
                        {implementation_interval_types.map((item, key) => {
                          return (
                            <>
                              <RadioGroupButton
                                id={`implementation_interval_type${key}`}
                                value={key}
                                label={item}
                                name="implementation_interval_type"
                                getUsage={this.SetWeekInterval.bind(this, key)}
                                checked={this.state.check_enable_weeks[key]}
                              />
                            </>
                          );
                        })}
                      </>
                    </div>
                    
                <div className="period-input">
                  <div className="gender flex">                    
                      <label className="gender-label label-title" style={{cursor:"text"}}>曜日</label>
                      <div id="final_week_days_id" className='flex transparent-border'>
                        {week_days.map((item, key) => {
                          if (this.state.checkdialdays[key]) {
                            return (
                              <>
                                <RadioGroupButton
                                  id={`week_day_${key}`}
                                  value={key}
                                  label={item}
                                  name="week_day"
                                  getUsage={this.addDay.bind(this, key)}
                                  checked={this.state.checkalldays[key]}
                                />
                              </>
                            );
                          } else {
                            return <div className={"no-dial-day"}></div>;
                          }
                        })}
                        <div className="select-day-btn" onClick={this.selectDialDays}>透析曜日を選択</div>
                      </div>
                    <div className="area2 flex">
                      <div className="selet-day-check">
                        <Checkbox
                          label="透析曜日以外も表示"
                          getRadio={this.getCheckAnotherDay.bind(this)}
                          value={this.state.checkAnotherDay}
                          name="schedule"
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex treat_count_group period'>
                      <NumericInputWithUnitLabel
                        label="回数"
                        value={this.state.treat_count}
                        getInputText={this.getTreatCount.bind(this)}
                        handleKeyPress = {this.keydownCount.bind(this)}
                        inputmode="numeric"
                        min= {0}
                        max ={99}
                        precision={0}
                        step = {1}
                        id="treat_count_id"                      
                      />
                      <button className='calc-end-date' onClick ={this.calcEndDate.bind(this)} disabled = {!this.checkEnableCalcEndDate()}>終了日計算</button>
                  </div>
                  <div className="period flex">
                    <div className="start-date">
                      <InputWithLabelBorder
                        label="期限"
                        type="date"
                        getInputText={this.getStartdate.bind(this)}
                        diseaseEditData={this.state.time_limit_from}
                        id="time_limit_from_id"
                        onBlur = {e => this.resetDatePicker(e)}
                      />
                    </div>
                    <div className="from-to">～</div>
                    <div className='end-date'>
                      <InputWithLabelBorder
                        label=""
                        type="date"
                        getInputText={this.getEnddate}
                        diseaseEditData={this.state.time_limit_to}
                        id="time_limit_to_id"
                        onBlur = {e => this.resetDatePicker(e)}
                      />
                    </div>                    
                    <div className="stoping">
                      <InputWithLabelBorder
                        label="中止日"
                        type="date"
                        getInputText={this.getDeleteStartdate.bind(this)}
                        diseaseEditData={this.state.stop_date}
                        id="stop_date_id"
                        onBlur = {e => this.resetDatePicker(e)}
                      />
                    </div>
                    <div className={"reopening"}>
                      <InputWithLabelBorder
                        className=""
                        label="～ 再開日"
                        type="date"
                        getInputText={this.getDeleteEnddate.bind(this)}
                        diseaseEditData={this.state.reopening_date}
                        id="reopening_date_id"
                        onBlur = {e => this.resetDatePicker(e)}
                      />
                    </div>
                  </div>
                </div>
                  </div>
                  <div className="right-area" style={{width:"23.4rem", marginLeft:"auto"}}>
                    {this.state.final_entry_date !== "" && (
                      <div className={"final-input"}>
                        <div>最終入力日時：{this.state.final_entry_date}</div>
                        <div>入力者：{this.state.final_entry_name}</div>
                        <div>
                          指示者：
                          {this.state.final_doctor_name != undefined
                            ? this.state.final_doctor_name
                            : ""}
                        </div>
                      </div>
                    )}
                    <div className="input-data-area flex">
                      <InputWithLabel
                        label="入力日"
                        type="date"
                        getInputText={this.getInputdate}
                        diseaseEditData={this.state.entry_date}
                        onBlur = {e => this.resetDatePicker(e)}
                      />
                      <div
                        className="input-time">
                        <label style={{cursor:"text"}}>入力時間</label>
                        <DatePicker
                          selected={this.state.entry_time}
                          onChange={this.getInputTime}
                          onKeyDown = {this.timeKeyEvent}
                          onBlur = {this.setTime}
                          value = {this.state.input_time_value}
                          id='entry_time_id'
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={10}
                          dateFormat="HH:mm"
                          timeFormat="HH:mm"
                          timeCaption="時間"
                        />
                      </div>
                    </div>
                    <div className="input-data-area remove-x-input">
                      <InputWithLabel
                        label="入力者"
                        type="text"
                        isDisabled={true}
                        placeholder=""
                        diseaseEditData={this.state.entry_name}
                      />
                      {authInfo != undefined &&
                      authInfo != null &&
                      authInfo.doctor_number > 0 &&
                      this.state.pattern_table_id === "" ? (
                        <InputWithLabel
                          label="指示者"
                          type="text"
                          isDisabled={true}
                          diseaseEditData={this.state.directer_name}
                        />
                      ) : (
                        <>
                          <div
                            className=" cursor-input"
                            onClick={(e)=>this.showDoctorList(e).bind(this)}
                          >
                            <InputWithLabel
                              label="指示者"
                              type="text"
                              isDisabled={true}
                              diseaseEditData={this.state.directer_name}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Wrapper>
          </div>
          <div className="footer-buttons">
              <Button
                className={can_delete ? "delete-btn" : "disable-btn"}
                onClick={this.delete.bind(this)}
                tooltip={del_tooltip}
              >
                削除
              </Button>
            <Button
              className={this.state.change_flag ? "cancel-btn" : "disable-btn"}
              onClick={this.clear}
              tooltip={clear_tooltip}
            >
              クリア
            </Button>
              <Button className="change-btn" onClick={this.update.bind(this)}>
                変更
              </Button>
              <Button className="add-btn" onClick={this.add.bind(this)}>
                追加
              </Button>
          </div>
          {this.state.isClearConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.clearPattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}

          {this.state.isAddConfirmModal && !this.state.isConfirmComplete && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.addPattern.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}

          {this.state.isUpdateConfirmModal && !this.state.isConfirmComplete && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmReSchedule.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}

          {this.state.isReScheduleConfirm && !this.state.isConfirmComplete && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.reScheduleCancel.bind(this)}
              confirmOk={this.updatePattern.bind(this, true)}
              confirmTitle={this.state.confirm_message}
            />
          )}

          {this.state.isSetDataConfirm !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.setConfirmDataJson.bind(
                this,
                this.state.set_json_data
              )}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isDeleteConfirmModal && !this.state.isConfirmComplete && (
            <PatternDeleteConfirmModal
              title={"注射"}
              closeModal={this.confirmCancel.bind(this)}
              confirmOk={this.deletePattern.bind(this)}
            />
          )}
          {this.state.isUpdateScheduleConfirmModal &&
            !this.state.isConfirmComplete && (
              <PatternUpdateConfirmModal
                title={"注射"}
                closeModal={this.confirmCancel.bind(this)}
                confirmOk={this.updatePatternSchedule.bind(this)}
              />
            )}
          {this.state.isShowDoctorList !== false && (
            <DialSelectMasterModal
              selectMaster={this.selectDoctor}
              closeModal={this.closeDoctorSelectModal}
              MasterCodeData={this.state.doctors}
              MasterName="医師"
            />
          )}
          {this.state.isConfirmComplete !== false && (
            <CompleteStatusModal message={this.state.complete_message} />
          )}
          {this.state.isOpenInjectionSelectModal && (
            <SelectPannelModal
              selectMaster={this.selectInjectionCode}
              closeModal={this.closeModal}
              MasterName={"注射"}
            />
          )}
          {this.state.isOpenInjectionSet && (
            <InjectionSetModal
              closeModal={this.closeModal}
              handleOk={this.saveSetData}
              injectionSetData={this.state.injectionSetData}
              category={this.state.set_category}
            />
          )}
          {this.state.isOpenMoveOtherPageConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.moveOtherPage.bind(this)}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.isOpenCalcModal ? (
            <CalcDial
              calcConfirm={this.calcConfirm}
              units={this.state.calcUnit}
              calcCancel={this.calcCancel}
              daysSelect={false}
              daysInitial={0}
              daysLabel=""
              daysSuffix=""
              maxAmount={100000}
              calcTitle={this.state.calcTitle}
              calcInitData={this.state.calcInit}
            />
          ) : (
            ""
          )}
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title={this.state.confirm_alert_title}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
          />
        </Card>
      </>
    );
  }
}
Injection.contextType = Context;

Injection.propTypes = {
  history: PropTypes.object,
};

export default Injection;
