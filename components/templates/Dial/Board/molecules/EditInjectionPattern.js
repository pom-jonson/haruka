import React, { Component, useContext } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import * as methods from "../../DialMethods";
import styled from "styled-components";
import { surface } from "../../../../_nano/colors";
import Button from "../../../../atoms/Button";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import InputWithLabelBorder from "../../../../molecules/InputWithLabelBorder";
import { Row, Col } from "react-bootstrap";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Checkbox from "../../../../molecules/Checkbox";
import {
  formatDateLine,
  formatDateSlash,
  formatJapan,
  formatTime,
  formatTimePicker,
  formatDateTimeIE
} from "~/helpers/date";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/pro-light-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
// import InputBoxTag from "~/components/molecules/InputBoxTag";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import {
  makeList_code,
  makeList_data,
  sortTimingCodeMaster,
  makeList_codeName,
} from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import InjectionSetModal from "../../modals/InjectionSetModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import CalcDial from "~/components/molecules/CalcDial";
import { patternValidate } from '~/helpers/validate'
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal'
import $ from 'jquery'
import {
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder, 
  displayInjectionName
} from '~/helpers/dialConstants'
import {getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import renderHTML from "react-render-html";

const Icon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-right: 4px;
`;

const SpinnerWrapper = styled.div`
    margin: auto;
    height:200px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Card = styled.div`
  top: 0px;
  width: 100%;
  margin: 0px;
  height: 100%;
  float: left;
  overflow: auto;
  min-height:600px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .bodywrap {
    display: flex;
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 1.25rem;
      font-weight: 100;
    }
  }
  background-color: ${surface};
  button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
  .disabled {
    background: lightgrey;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;  
  float: left;
  width: 100%;    
  height: 100%;
  overflow-y: auto;
  font-size:1rem;  
  .dial-list{
      width: 100%;
      height: 5rem;
      border: solid 1px rgb(206, 212,218);
      padding: 10px;
      overflow-y: auto;
      overflow-x: hidden;
  }
  .dial-oper {
    label, .pullbox-title {
      font-size:1rem !important;
      height:2.3rem !important;
      line-height:2.3rem !important;
      margin-top:0 !important;
      margin-bottom:0 !important;
    }
    select {
      height:2.3rem !important;
    }
    input {
      height:2.3rem !important;
    }
    .row {
        margin: 0;
    }
    .last-history label {
        float: right;
        width: 9rem;
        input {
          height: 15px !important;
        }
    }
    .col-md-6 {
        padding-left: 0;
    }
    .col-md-2 {
        padding-left: 0;
        max-width: 12%;
    }
    .pullbox {
        width: 100%;
        .label-title {    
            width: 120px;
            text-align: right;
            padding-right: 10px;
        }
        label {    
            width: calc(50% - 100px);
            select {
                width: 100%;
            }
        }
    }
    .radio-group-btn label {
        font-size: 1rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin-left: 5px;
        text-align:center!important;
    }
    .medicine-area {
      .name-area {
        width: calc(40% - 100px);
        padding-left:9px;
        .inject-name{
          height:2.3rem;
          display:flex;
          align-items:center;
          width: calc(100% - 2.6rem);
          border: 1px solid #7e7e7e;
        }
        .label-title {
            width: 0;
            margin-bottom: 0;
            margin-top: 0;
        }        
        .clickable {
          margin-bottom:0.5rem;
          input {
            height: 2.3rem;
          }
          .label-title {
              width: 0;
              margin:0;
          }
        }
        .delete-button{
          margin-top:0.2rem;
          button{
            margin-bottom:0;
          }
        }
      }
      .amount-area {
        width: 25%;
        div {
          margin-top:0;
          margin-bottom:0;
        }
        .label-title {
          margin: 0;
          height: 38px;
          margin-right: 0.5rem;
          line-height: 38px;
        }
        .label-unit{
          text-align:left!important;
          margin-bottom:0px!important;
        }
      }
      .unit-area {
          width: 10%;
          text-align: left;
          .flex {    
              margin-top: 8px;
              padding-left: 5px;
              line-height: 38px;
              height: 38px;
          }
      }
      .pattern-export {
          width: 30%;
      }
    }
    .medicine-label {
        width: 110px;
        margin-right: 2px;
        label {
            width: 100%;
            text-align: right;
        }
    }
    .flex {
        display: flex;
        flex-wrap: wrap;
        label {
            font-size: 1rem;
            width: 50px;
            margin-top: 4px;
            text-align: right;
        }
        input {
            width: calc(100% - 60px);
        }
        .padding {
            padding: 20px 0 0 5px;
        }
    }
    .border-medicine {
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        height: 38px;
        margin-top: 8px;
        padding: 10px 0 0 5px;
    }
    .gender {
      margin-bottom:0.5rem;
      .gender-label {
        text-align: right;
        width: 120px;
        font-size: 1rem;
        margin:0;
        line-height:38px;
        height:38px;
        padding-right:10px;
        margin-top:auto;
        margin-bottom:auto;
      }
    }
    .form-control {
        margin-bottom: 0.5rem;
    }
    .react-datepicker-wrapper {
        .react-datepicker__input-container {
            input {
                font-size: 1rem;
                width: 8rem;
                height: 38px;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
            }
        } 
    }
    .period {
        display: flex;
        div {margin-top:0;}
        label {
            width: 0;
        }
        .from-to {
          padding-left: 8px;
          line-height: 2.3rem;
        }
        .w55 {
            width: 55px;
        }
        .react-datepicker-wrapper {
            width: 100%;
        }
        .start-date {
          div {margin-top:0;}
          input {
            width: 8rem;
          }
        }
        .end-date {
          .label-title {
            width:0 !important;
            margin:0;
          }
        }
      }
    .period div:first-child {
        .label-title {
            width: 120px;
            text-align: right;
            padding-right: 10px;
            margin: 0;
            font-size: 1rem;
            line-height:38px;
            height:38px;
        }
      }
    .delete-date {
        label {
            font-size: 1rem;
            text-align: right;
            width: 120px;
            padding-right: 10px;
            margin: 0px;
            line-height:38px;
        }
        .react-datepicker-wrapper {
            width: calc(100% - 120px);
        }
        .reopening {
            label {
                width: 5.5rem!important;
            }
        }
    }
    .input-data-area {
        .react-datepicker-wrapper {
            width: 7.2rem;
        }
        label {
          text-align: right;
          width: 120px;
          font-size: 1rem;
          margin:0;
          padding-right: 10px;
          line-height:38px;
        }
        input {
          width: calc(100% - 120px);
        }
        .input-time {
          margin-top: 8px;
          display: flex;
          label {
            margin:0;
            line-height:38px;
          }
        }
        .direct_man {
          width: 50%;
        }
    }
    .select-day-btn {
      cursor: pointer;
      padding-left: 0.3rem;
      padding-right: 0.3rem;
      border: 1px solid rgb(206, 212, 218);
      height: 2.3rem;
      line-height: 2.3rem;
      margin-left: 10px;
    }
    .selet-day-check label {
      width: 100%;
      input {
        height:15px !important;
      }
      margin-top:4px!important;
    }
    .check-schedule {
        padding: 10px 0 0 65px;
    }
    .radio-btn {
        margin-top: 5px;
    }
    .radio-btn label{
        width: 5.5rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        text-align:center;
        margin:0;
        margin-right:5px;
        height:38px;
        line-height:38px;
    }
    .radio-btn:last-child {
      label {
        margin-right:0;
      }
    }
    .kind{
      margin-bottom:0.5rem;
      .label-div {
        width: 120px;
        padding-right: 10px;
        text-align: right;
        margin:0;
        height: calc(2.3rem + 6px) !important;
        line-height: calc(2.3rem + 6px) !important;
      }
    }
     
    .implementation_interval {
      margin-bottom:0.5rem;
        .implementation_interval-label {
            text-align: right;
            width: 115px;
            padding-right: 5px;
            font-size: 1rem;
            margin: 0;
            line-height:38px;
        }
        .radio-group-btn label{
            width: 70px;
            padding: 0;
        }
    }
    .implementation_month {
        display: flex;
        width: 100%;
        margin-bottom: 0.5rem;
        .implementation_month-label {
            text-align: right;
            width: 115px;
            padding-right: 5px;
            float: left;
            font-size: 1rem;
            margin: 0;
            line-height:38px;
        }
        .radio-group-btn label{
            width: 50px;
            padding: 0;
        }
    }
    .history-list {
        height: 50%;
        .history-head {    
            border-bottom: 1px dotted;
            margin-bottom: 5px;
            font-size: 14px;
        }
        .history-title {
            font-size: 14px;
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
        height: 6rem;
        overflow-y: auto;
        p {
            margin: 0;
            text-align: left;
            cursor: pointer;
        }
        .select-area .radio-group-btn label {
            text-align: left;
            padding-left: 10px;
            border-radius: 4px;
        } 
    }
    .area1 {
        .gender {
          .radio-group-btn label{
            width: 2rem;
            padding: 0;
            margin: 0;
            margin-right: 0.5rem;
            height:38px;
            line-height:38px;
          }
          .radio-group-btn:last-child {
            label {
              margin-right:0;
            }
          }
        }
    }
    .final-info {
        font-size: 1rem;
        padding-left: 120px;
    }

    .history-temp-area{
        width: 100%;
        .board{
            display: flex;
        }
        .history-item{
            width: 250px;
            float: left;
            margin-bottom: 10px;
        }
        .history-item1{
            width: 250px;
        }  
        .register_info{
            width: 100%;
            display:flex;
        }
        .input-time{
            float: left;
        }
        .time_label{
            width:100px;
        }
    }
    .no-dial-day {
      width: 2rem;
      margin-right:0.5rem;
      display: inline-block;
    }
    .row {
        margin:0;
    }
    .left-area {
        width: calc(100% - 330px);
    }
    .register_info{
      .input-time {
          display: flex;
          margin-top: 8px
      }
      label{
          text-align: right;
          width: 120px;
      }
    }
    
    .selected{
      background: lightblue;
    }
    .remove-x-input{
      .direct_man {
        div: {
          margin:0;
        }
      }
      div input {
        width:15rem;
      }
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
`;

const MethodBox = styled.div`
  width: 100%;
  .row {
    width: 100%;
  }
  .row:hover {
    background-color: rgb(246, 252, 253);
    cursor: pointer;
  }
  .row.selected {
    background: lightblue;
  }
  .row.selected: hover {
    background: lightblue;
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

class EditInjectionPattern extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    let injection_pattern = [];
    this.state = {
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
      checkalldays: {0: false,1: false,2: false,3: false,4: false,5: false,6: false,},
      check_enable_months: {0: true,1: false,2: false,3: false,4: false,5: false,6: false,7: false,8: false,9: false,10: false,11: false,12: false,},
      check_enable_weeks: {0: true,1: false,2: false,3: false,4: false,5: false,},
      checkdialdays: {0: false,1: false,2: false,3: false,4: false,5: false,6: false,},
      dialdays: "",
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isMakeScheduleModal: false,
      confirm_message: "",
      confirm_type: "",
      confirm_clear_type:'',
      pattern_table_id: "",
      patientInfo: [],
      isShowDoctorList: false,
      entry_name:authInfo != undefined && authInfo != null ? authInfo.name : "",
      instruction_doctor_number: "",
      stop_date: "",
      reopening_date: "",
      isConfirmComplete: false,
      timingCodeData,
      timing_codes: makeList_code(timingCodeData),
      timing_options: makeList_codeName(timingCodeData, 1),
      isOpenInjectionSet: false,
      isCloseConfirmModal: false,
      isClearConfirmModal: false,
      isAddPatternConfirmModal: false,
      selected_set_number:0,
      confirm_alert_title:'',
      alert_message: '',
      injectionSetData: null,

      is_loaded:false
    };
    this.change_flag = 0;
  }

  async componentDidMount() {
    await this.getInjectionMaster();
    await this.getStaffs();
    await this.setDoctors();
    await this.getInjectionSet();
    await this.getInjectionPatternInfo();
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    state_data['is_loaded'] = true;
    this.setState(state_data);
  }

  getInjectionSet = async () => {    
    let post_data = { table_kind: 11 , order:'sort_number'};
    let path = "/app/api/v2/dial/master/material_search";
    let category_data = await apiClient.post(path, {
      params: post_data,
    });
    let set_data = await apiClient.post(
      "/app/api/v2/dial/pattern/searchInjectionSet",
      { params: {order:'sort_number'} }
    );
    this.setState({
      injection_set_category: makeList_data(category_data),
      category_data,
      set_data,
    });
  };

  clearConfirm=()=>{
    if(this.change_flag == 0){
      return;
    }
    this.setState({
      isClearConfirmModal: true,
      confirm_message: "入力中の内容を消去しますか？",
    });
  }

  clearPattern=async()=>{
    let server_time = await getServerTime();
    this.change_flag = 0;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      isClearConfirmModal:false,
      pattern_table_id: "",
      selected_row: "",
      patient_id: this.props.system_patient_id,
      time_limit_from: formatDateSlash(new Date(this.props.schedule_date)),
      time_limit_to: "",
      set_number: 0,
      week_days: "",
      entry_date: new Date(server_time),
      entry_time: new Date(server_time),
      directer_name:this.context.selectedDoctor.code > 0 ? this.context.selectedDoctor.name : "",
      checkAnotherDay: false,
      checkalldays: {0: false,1: false,2: false,3: false,4: false,5: false,6: false,},
      check_enable_months: {0: true,1: false,2: false,3: false,4: false,5: false,6: false,7: false,8: false,9: false,10: false,11: false,12: false,},
      check_enable_weeks: {0: true,1: false,2: false,3: false,4: false,5: false,},
      checkdialdays: {0: false,1: false,2: false,3: false,4: false,5: false,6: false,},
      dialdays: "",
      final_week_days: 0,
      timing_code: 0,
      week_interval: 1,
      monthly_enable_week_number: 1,
      injection_category: "",
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
      entry_name:authInfo != undefined && authInfo != null ? authInfo.name : "",
      instruction_doctor_number:
        this.context.selectedDoctor.code > 0
          ? this.context.selectedDoctor.code
          : "",
      isShowDoctorList: false,
      stop_date: "",
      reopening_date: "",
      selected_set_number:0,
      treat_count:''
    });
    await this.getDialDays(this.props.system_patient_id);
    if (this.props.edit_number !== 0) {
      this.setState({edit_pattern_index: 0}, ()=>{
        this.editPattern();
      })
    }
    this.setDoctors();
  }

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
          let checkdialdays = {0: false,1: false,2: false,3: false,4: false,5: false,6: false};
          let dialdays = {0: false,1: false,2: false,3: false,4: false,5: false,6: false};
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

  async getInjectionPatternInfo() {
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/pattern/getInjectionPattern";
    const post_data = {
      patient_id: this.props.system_patient_id,
      is_temporary: this.props.is_temporary,
      schedule_date: this.props.schedule_date,
      schedule_number: this.props.edit_number,
    };
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
        }
      })
      .catch(() => {});
    await this.clearPattern();
  }

  getSetnumber = (e) => {
    this.change_flag = 1;
    this.setState({ set_number: parseInt(e.target.id) });
  };

  getAnticoagulationMethod1 = (e) => {
    let { set_data } = this.state;
    let category_code = this.state.category_data.find(
      (x) => x.number == e.target.id
    ).code;
    let filter_data = set_data.filter((x) => x.category_code == category_code);
    this.setState({
      anticoagulation_method1: parseInt(e.target.id),
      injection_set_data: filter_data,
    });
  };

  getinjectionAmount1 = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.change_flag = 1;
    this.setState({ injectionAmount1: parseFloat(e) });
  };
  getinjectionAmount2 = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.change_flag = 1;
    this.setState({ injectionAmount2: parseFloat(e) });
  };

  getinjectionAmount3 = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.change_flag = 1;
    this.setState({ injectionAmount3: parseFloat(e) });
  };

  getinjectionAmount4 = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.change_flag = 1;
    this.setState({ injectionAmount4: parseFloat(e) });
  };

  getinjectionAmount5 = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.change_flag = 1;
    this.setState({ injectionAmount5: parseFloat(e) });
  };

  getCheckAnotherDay = (name, value) => {
    if (name === "schedule") {
      this.change_flag = 1;
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
      this.change_flag = 1;
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
      Object.keys(this.state.dialdays).map((index) => {
        if (this.state.dialdays[index] === true) {
          checkalldays[index] = true;
          var pval = Math.pow(2, index);
          final_week_days = final_week_days + pval;
        }
      });
      this.setState({ final_week_days, checkalldays}, () => {
        this.calcEndDate();
      });
    }
  };

  getShowHistory =async(name, value) => {
    if (name === "schedule") {
      this.change_flag = 1;
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
  getEnddate = (value) => {
    this.change_flag = 1;
    this.setState({ time_limit_to: value});
  };
  getInputTime = (value) => {
    this.change_flag = 1;
    this.setState({ entry_time: value });
  };

  getInputdate = (value) => {
    this.change_flag = 1;
    this.setState({ entry_date: value });
  };

  getInputMan = (e) => {
    this.change_flag = 1;
    this.setState({ entry_name: e.target.value });
  };

  getDirectMan = (e) => {
    this.change_flag = 1;
    this.setState({ directer_name: e.target.value });
  };

  getDeleteStartdate = (value) => {
    this.change_flag = 1;
    this.setState({ stop_date: value}, () => {
      this.calcEndDate();
    });
  };

  getDeleteEnddate = (value) => {
    this.change_flag = 1;
    this.setState({ reopening_date: value}, () => {
      this.calcEndDate();
    });
  };

  SetImplementationMonth = (value) => {
    this.change_flag = 1;
    let check_enable_months = this.state.check_enable_months;
    var monthly_enable_week_number = parseInt(
      this.state.monthly_enable_week_number
    );
    if (value !== 0 && check_enable_months[0] === true) {
      check_enable_months[0] = false;
      monthly_enable_week_number--;
    }
    if (value === 0) {
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
      var pval = Math.pow(2, value);
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
    this.change_flag = 1;
    let check_enable_weeks = this.state.check_enable_weeks;
    var week_interval = parseInt(this.state.week_interval);
    if (value !== 0 && check_enable_weeks[0] === true) {
      check_enable_weeks[0] = false;
      week_interval--;
    }
    if (value === 0) {
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

  getTimingList = (e) => {
    this.change_flag = 1;
    this.setState({ timing_code: e.target.id });
  };

  changeMedicineKind = (value) => {
    this.change_flag = 1;
    this.setState({ injection_category: sortations[value] });
  };

  confirmAddPattern = () => {
    if(this.change_flag == 0){
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.REGISTER
      ) === false
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "登録権限がありません。"
      );  
      return;    
    }
    if (this.state.instruction_doctor_number === "") {
      this.showDoctorList();
      return;
    }
    let error_str_array = this.checkValidation();
    
    if (this.props.is_temporary){
      let weekday_str = error_str_array.indexOf('曜日を選択してください。');
      if (weekday_str > -1) {
        error_str_array.splice(weekday_str,1)
      }
    }
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: this.props.is_temporary
        ? "臨時注射情報を変更しますか?"
        : "パターン情報を変更しますか?",
    });
    this.setState({
      isAddPatternConfirmModal:true,
      confirm_message: this.props.is_temporary ? "臨時注射情報を登録しますか?" : "パターン情報を登録しますか?",
    })
  };

  addPattern=async()=>{
    this.confirmCancel();    
    let new_pattern = {
      patient_id: this.props.system_patient_id,
      is_temporary: this.props.is_temporary,
      from_source:this.props.from_source,
      confirm: this.state.confirm_type,
      time_limit_from: this.props.schedule_date,
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
    this.openConfirmCompleteModal("保存中");
    let path = "/app/api/v2/dial/pattern/registerInjectionPattern";

    apiClient
      ._post(path, {
        params: new_pattern,
      })
      .then((res) => {        
        if (res.alert_message != undefined && res.alert_message != null) {          
          if (this.props.modal_type !== 2) {
            // this.saveBody();
          }
          if (res.pattern_number > 0 && res.detail_number > 0){
            this.makeInjectionSchedule(res.pattern_number, res.detail_number, new_pattern,0);            
          } else {
            this.setState({isConfirmComplete: false,});
            if (this.props.add_flag != true) {
              this.props.handleOk();
            }
            if (this.props.add_flag === true) {
              this.props.handleOk(this.props.schedule_date);
            }
          }
        } else {
          this.setState({
            isConfirmComplete: false,
          });
        }
        if (res.no_date != undefined && res.no_date != null) {
          this.setState({
            isMakeScheduleModal: true,
            confirm_message:
              formatJapan(this.props.schedule_date) +
              "が\n" +
              "対象外となっております。\n" +
              "保存して良いですか？",
            confirm_type: "add",
          });
        }
      })
      .catch(() => {});
  }

  makeInjectionSchedule(pattern_number, detail_number, post_data, edit_flag) {
    post_data.pattern_number = pattern_number;
    post_data.detail_number = detail_number;
    post_data.edit_flag = edit_flag;
    let path = "/app/api/v2/dial/pattern/makeInjectionSchedule";
    apiClient.post(path, {
      params: post_data,
    }).
    then(() => {
      this.setState({
        isConfirmComplete: false,
      });
      if (this.props.add_flag != true) {
        this.props.handleOk();
      }
      if (this.props.add_flag === true) {
        this.props.handleOk(this.props.schedule_date);
      }
    });
  }

  saveBody = async () => {
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/board/Soap/register";
    let post_data = {
      instruction_doctor_number: this.state.instruction_doctor_number,
      system_patient_id: this.props.system_patient_id,
      write_date: formatTime(this.state.entry_time),
      schedule_date:(this.props.schedule_date != undefined && this.props.schedule_date != null) ? this.props.schedule_date : new Date(server_time),
      category_1: this.props.is_temporary === 0 ? "定期注射" : "臨時注射",
      category_2: this.props.is_temporary === 0 ? "定期" : "臨時",
      body:this.props.is_temporary === 0 ? "（提示）定期注射変更あり" : "（臨注) " + this.state.injectionName1,
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then(() => {
        this.props.handleOk();
      })
      .catch(() => {});
  };

  editpatternConfirm = (index) => {
    if (this.change_flag === 1) {
      this.setState({
        isCloseConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_clear_type: "edit_pattern",
        edit_pattern_index: index,
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({
        edit_pattern_index: index
      }, ()=> {
        this.editPattern();
      })
    }
  }
  editPattern = () => {
    let value = this.state.edit_pattern_index;
    this.change_flag = 0;
    let pattern_data = this.state.injection_pattern[value];    
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
        checkdialdays: {0: true,1: true,2: true,3: true,4: true,5: true,6: true,},
      });
    } else {
      this.getDialDays(this.state.patient_id);
    }
    var monthly_enable_week_number = pattern_data.monthly_enable_week_number;
    let check_enable_months = {0: false,1: false,2: false,3: false,4: false,5: false,6: false,7: false,8: false,9: false,10: false,11: false,12: false,};
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
    this.setState({
      selected_row: pattern_data.injection_number,
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
      time_limit_from:this.props.schedule_date,
      time_limit_to:pattern_data.time_limit_to == null ? null : new Date(pattern_data.time_limit_to),
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
      directer_name:
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
    });
  };

  updatePattern = () => {
    if (this.state.pattern_table_id !== "") {
      let update_pattern = {
        number: this.state.pattern_table_id,
        patient_id: this.props.system_patient_id,
        is_temporary: this.props.is_temporary,
        from_source:this.props.from_source,
        confirm: this.state.confirm_type,
        time_limit_from: this.props.schedule_date,
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

      let path = "/app/api/v2/dial/pattern/updateInjectionPattern";
      this.openConfirmCompleteModal("保存中");
      apiClient
        ._post(path, {
          params: update_pattern,
        })
        .then((res) => {          
          if (res.alert_message != undefined && res.alert_message != null) {            
            this.confirmCancel();
            if (res.pattern_number > 0 && res.detail_number > 0) {
              this.makeInjectionSchedule(res.pattern_number, res.detail_number, update_pattern,1);
            } else {
              this.setState({isConfirmComplete: false,});
              if (this.props.add_flag != true) {
                this.props.handleOk();
              }
              if (this.props.add_flag === true) {
                this.props.handleOk(this.props.schedule_date);
              }
            }
            if (this.props.modal_type !== 2) {
              // this.saveBody();
            }
          } else {
            this.setState({
              isConfirmComplete: false,
            });
          }
          if (res.no_date != undefined && res.no_date != null) {
            this.setState({
              isMakeScheduleModal: true,
              confirm_message:
                formatJapan(this.props.schedule_date) +
                "が\n" +
                "対象外となっております。\n" +
                "保存して良いですか？",
              confirm_type: "update",
            });
          }
        });
    }
  };

  deletePattern = () => {
    if (this.state.pattern_table_id !== "") {
      let delete_pattern = {
        number: this.state.pattern_table_id,
        system_patient_id: this.props.system_patient_id,
        all_remove: 1,
        is_temporary:this.props.is_temporary,
      };
      this.deleteDialPatternFromPost(delete_pattern);
      this.props.closeModal();
    }
    this.confirmCancel();
  };

  makeSchedule = () => {
    this.confirmCancel();
    if (this.state.confirm_type === "add") {
      this.addPattern();
    } else {
      this.updatePattern();
    }
  };

  async deleteDialPatternFromPost(data) {
    let path = "/app/api/v2/dial/pattern/deleteInjectionPattern";

    await apiClient.post(path, {
      params: data,
    });
  }

  addDay = (value) => {
    this.change_flag = 1;
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = checkalldays[value] ? false : true;
    var final_week_days = parseInt(this.state.final_week_days);
    var pval = Math.pow(2, value);
    final_week_days =
      (final_week_days & pval) > 0
        ? final_week_days - pval
        : final_week_days + pval;
    this.setState({ final_week_days, checkalldays}, () => {
      this.calcEndDate();
    });
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isMakeScheduleModal: false,
      isCloseConfirmModal: false,
      isClearConfirmModal: false,
      isAddPatternConfirmModal: false,
      confirm_message: "",      
      confirm_alert_title:'',
      confirm_clear_type:'',
    });
  }

  update = () => {
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.EDIT
      ) === false
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "変更権限がありません。"
      );
      return;
    }
    if (this.state.pattern_table_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "変更する対象を選択してください。"
      );
      return;
    }
    let error_str_array = this.checkValidation();    
    if (this.props.is_temporary){
      let weekday_str = error_str_array.indexOf('曜日を選択してください。');
      if (weekday_str > -1) {
        error_str_array.splice(weekday_str,1)
      }
    }
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: this.props.is_temporary
        ? "臨時注射情報を変更しますか?"
        : "パターン情報を変更しますか?",
    });
  };

  delete = () => {
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
      ) === false
    ) {
      window.sessionStorage.setItem("alert_messages", "削除権限がありません。");
      return;
    }
    this.setState({
      isDeleteConfirmModal: true,
      confirm_message: this.props.is_temporary
        ? "臨時注射情報を削除しますか?"
        : "パターン情報を削除しますか?",
    });
  };

  selectDoctor = (doctor) => {
    this.setState({
      directer_name: doctor.name,
      instruction_doctor_number: doctor.number,
    });
    this.context.$updateDoctor(doctor.number, doctor.name);

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

  openInjectionSelectModal = (val) => {
    if (this.state['injectionCode' + (val - 1)] < 1){
      return;
    }
    this.change_flag = 1;
    this.setState({
      isOpenInjectionSelectModal: true,
      select_injection_tag: val,
    });
  };

  selectInjectionCode = (item) => {
    this.change_flag = 1;
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
    }
    this.closeModal();
  };

  closeModal = () => {
    this.setState({
      isOpenInjectionSelectModal: false,
      isOpenInjectionSet: false,
    });
  };

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
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
    this.change_flag = 1;
  };

  onHide = () => {};

  openInjectionSet = () => {
    if (this.state.anticoagulation_method1 == "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "大分類を選択してください。"
      );
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
          x:
            e.clientX -
            document.getElementById("edit-injection-modal").offsetLeft,
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
    this.change_flag = 1;
    this.setState({
      injectionSetData: data,
      selected_set_number: data.number,
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
    let _state = {
      calcInit: val != undefined && val != null && val > 0 ? val : 0,
      calcValType: type,
      isOpenCalcModal: true,
      calcUnit:unit,
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
    this.change_flag = 1;
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
    this.setState(_state);
  };

  ConfirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中'
      });
    } else {
      this.props.closeModal();
    }
  }

  moveClose = () => {
    this.confirmCancel();
    this.change_flag = 0;
    if (this.state.confirm_clear_type == "edit_pattern") {
      this.editPattern();
      return;
    }
    this.props.closeModal();
  }

  checkValidation = () => {
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
    if (validate_data.first_tag_id != '') {
      this.setState({ first_tag_id: validate_data.first_tag_id })
    }
    if (validate_data.error_str_arr.length > 0) {
      validate_data.error_str_arr.map((item, index) => {
        if ((this.state.injection_category == undefined || this.state.injection_category == null || this.state.injection_category =='') && index == 0){
          error_str_arr.unshift(item);
        } else {
          error_str_arr.push(item);  
        }
      })
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
            error_str_arr.push('中止日は終了日以降の日付を選択してください。');
            addRedBorder('stop_date_id');
          }
        }
        if (
          this.state.reopening_date != undefined &&
          this.state.reopening_date != null &&
          this.state.reopening_date != ''
        ) {
          if (this.checkDate(this.state.time_limit_to, this.state.reopening_date)) {
            error_str_arr.push('再開日は終了日以降の日付を選択してください。');
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
        error_str_arr.push('再開日を選択してください');
        addRedBorder('reopening_date_id');
      }
    }
    return error_str_arr;
  }
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
  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }

  resetDatePicker = (e) => {
    if (e.target.id == this.state.first_tag_id){
      addRedBorder(e.target.id);
    }
    this.forceUpdate();
  }

  getTreatCount = (e) => {
    this.change_flag = 1;
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
    if (typeof time_limit_from == 'string') time_limit_from = formatDateTimeIE(time_limit_from);
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

  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let timing_codes = this.state.timing_codes;
    let message;
    let injection_pattern = [];
    let { injection_set_category, injection_set_data } = this.state;
    if (this.state.injection_pattern.length) {
      injection_pattern = this.state.injection_pattern.map((item, index) => {
        let weekday = "";
        for (let i = 0; i < 7; i++) {
          weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
        }

        return (
          <>
            <Row
              className={
                this.state.selected_row == item.injection_number
                  ? "selected"
                  : ""
              }
              onClick={this.editpatternConfirm.bind(this, index)}
            >
              <Col md="1">
                {item.set_number === 0 ? "未設定" : item.set_number}
              </Col>
              <Col md="1">{item.injection_category}</Col>
              <Col md="3">{renderHTML(displayInjectionName(item.data_json[0]["item_code"], item.data_json[0]["item_name"]))}</Col>
              <Col md="1">
                {timing_codes != undefined &&
                timing_codes != null &&
                timing_codes[item.timing_code] != undefined
                  ? timing_codes[item.timing_code]
                  : ""}
              </Col>
              <Col md="2">{weekday}</Col>
              <Col md="2">{this.props.is_temporary == 1? formatDateSlash(this.props.schedule_date) : formatDateSlash(item.time_limit_from)}</Col>
              <Col md="2">
                {this.props.is_temporary == 1? formatDateSlash(this.props.schedule_date) : (item.time_limit_to == null? "～ 無期限": formatDateSlash(item.time_limit_to))}
              </Col>
            </Row>
          </>
        );
      });
    } else {
      if (this.props.is_temporary === 1) {
        message = (
          <div className="no-result">
            <span>登録された臨時注射はありません。</span>
          </div>
        );
      } else {
        message = (
          <div className="no-result">
            <span>登録された注射パターンがありません。</span>
          </div>
        );
      }
    }
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal edit-injection-modal first-view-modal"
        id="edit-injection-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {this.props.edit_number === 0 ? (
              <>
                {this.props.is_temporary === 1 ? (
                  <>臨時注射追加</>
                ) : (
                  <>定期注射パターン追加</>
                )}
              </>
            ) : (
              <>
                {this.props.is_temporary === 1 ? (
                  <>臨時注射編集</>
                ) : (
                  <>定期注射パターン編集</>
                )}
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <div className="bodywrap">
              {this.state.is_loaded != true && (
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
              {this.state.is_loaded && (
                <Wrapper>
                <div className="dial-list">
                  <MethodBox>
                    {injection_pattern}
                    {message}
                  </MethodBox>
                </div>
                <div className="dial-oper">
                  <div className="last-history">
                    <Checkbox
                      label="期限切れも表示"
                      getRadio={this.getShowHistory.bind(this)}
                      value={this.state.showHistory}
                      name="schedule"
                    />
                  </div>
                  <br />
                  <Row style={{marginBottom:"0.5rem"}}>
                    <SelectorWithLabel
                      options={set_numbers}
                      title="セット"
                      getSelect={this.getSetnumber}
                      departmentEditCode={this.state.set_number}
                    />
                  </Row>
                  <Row>
                    <div className="flex kind" style={{width: "48rem"}}>
                      <label className="label-div" style={{cursor:"text"}}>区分</label>
                      <div id='injection_category_id' className='transparent-border'>
                        {sortations.map((item, key) => {
                          return (
                            <>
                              <RadioButton
                                id={`sortation${key}`}
                                value={key}
                                label={item}
                                name="sortation"
                                getUsage={this.changeMedicineKind.bind(
                                  this,
                                  key
                                )}
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
                  </Row>
                  <Row className="medicine-area">
                    <div className="medicine-label">
                      <label style={{cursor:"text"}}>注射名</label>
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
                      <div className="flex">
                        <NumericInputWithUnitLabel
                          label="数量"
                          value={this.state.injectionAmount1}
                          getInputText={this.getinjectionAmount1.bind(this)}
                          inputmode="numeric"
                          min={0}
                          onClickEvent={() =>
                            this.openCalc("amount1",this.state.injectionAmount1, this.state.injectionUnit1)
                          }
                          unit={this.state.injectionUnit1}
                        id = 'injectionAmount1_id'
                        disabled={this.grayOut('injectionAmount', 1)}
                        />
                      </div>
                      <div className="flex">
                        <NumericInputWithUnitLabel
                          label=""
                          value={this.state.injectionAmount2}
                          getInputText={this.getinjectionAmount2.bind(this)}
                          inputmode="numeric"
                          min={0}
                          onClickEvent={() =>
                            this.openCalc("amount2",this.state.injectionAmount2, this.state.injectionUnit2)
                          }
                          unit={this.state.injectionUnit2}
                          
                        id = 'injectionAmount2_id'
                        disabled={this.grayOut('injectionAmount', 2)}
                        />
                      </div>
                      <div className="flex">
                        <NumericInputWithUnitLabel
                          label=""
                          value={this.state.injectionAmount3}
                          getInputText={this.getinjectionAmount3.bind(this)}
                          inputmode="numeric"
                          onClickEvent={() =>
                            this.openCalc("amount3",this.state.injectionAmount3, this.state.injectionUnit3)
                          }
                          min={0}
                          unit={this.state.injectionUnit3}
                          id = 'injectionAmount3_id'
                          disabled={this.grayOut('injectionAmount', 3)}
                        />
                      </div>
                      <div className="flex">
                        <NumericInputWithUnitLabel
                          label=""
                          value={this.state.injectionAmount4}
                          getInputText={this.getinjectionAmount4.bind(this)}
                          inputmode="numeric"
                          onClickEvent={() =>
                            this.openCalc("amount4",this.state.injectionAmount4, this.state.injectionUnit4)
                          }
                          min={0}
                          unit={this.state.injectionUnit4}
                          id = 'injectionAmount4_id'
                          disabled={this.grayOut('injectionAmount', 4)}
                        />
                      </div>
                      <div className="flex">
                        <NumericInputWithUnitLabel
                          label=""
                          value={this.state.injectionAmount5}
                          getInputText={this.getinjectionAmount5.bind(this)}
                          inputmode="numeric"
                          onClickEvent={() =>
                            this.openCalc("amount5",this.state.injectionAmount5, this.state.injectionUnit5)
                          }
                          min={0}
                          unit={this.state.injectionUnit5}
                          id = 'injectionAmount5_id'
                          disabled={this.grayOut('injectionAmount', 5)}
                        />
                      </div>
                    </div>
                    <div className={"pattern-export"}>
                      <div className="history-list">
                        <div className="text-left history-head">
                          パターンから呼び出し
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
                          departmentEditCode={
                            this.state.anticoagulation_method1
                          }
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
                  </Row>
                  <Row style={{marginBottom:"0.5rem"}}>
                    <SelectorWithLabel
                      options={this.state.timing_options}
                      title="タイミング"
                      getSelect={this.getTimingList.bind(this)}
                      departmentEditCode={this.state.timing_code}
                      id = 'timing_code_id'
                    />
                  </Row>
                  {this.props.is_temporary === 0 ||
                  this.props.is_temporary === 2 ? (
                    <>
                      <Row>
                        <div className="implementation_month">
                          <label className="implementation_month-label" style={{cursor:"text"}}>
                            実施月
                          </label>
                          <>
                            {implementation_months.map((item, key) => {
                              return (
                                <>
                                  <RadioGroupButton
                                    id={`implementation_month${key}`}
                                    value={key}
                                    label={item}
                                    name="implementation_month"
                                    getUsage={this.SetImplementationMonth.bind(
                                      this,
                                      key
                                    )}
                                    checked={
                                      this.state.check_enable_months[key]
                                    }
                                  />
                                </>
                              );
                            })}
                          </>
                        </div>
                        <div className="implementation_interval">
                          <label className="implementation_interval-label" style={{cursor:"text"}}>
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
                                    getUsage={this.SetWeekInterval.bind(
                                      this,
                                      key
                                    )}
                                    checked={this.state.check_enable_weeks[key]}
                                  />
                                </>
                              );
                            })}
                          </>
                        </div>
                      </Row>
                      <div className="area1">
                        <div className="gender flex">                          
                            <label className="gender-label" style={{cursor:"text"}}>曜日</label>
                            <div id="final_week_days_id" className='flex transparent-border'>
                              {week_days.map((item, key) => {
                                if (this.state.checkdialdays[key] === true) {
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
                              <div className="select-day-btn" onClick={this.selectDialDays}>
                                透析曜日を選択
                              </div>
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
                            <InputWithLabel
                              label="期限"
                              type="text"
                              // getInputText={this.getStartdate}
                              diseaseEditData={this.state.time_limit_from}
                              isDisabled={true}
                              className="disabled"                              
                            />
                          </div>
                          <div className="from-to">～</div>
                          <div className={'end-date'}>
                            <InputWithLabelBorder
                              label=""
                              type="date"
                              getInputText={this.getEnddate}
                              diseaseEditData={this.state.time_limit_to}
                              id="time_limit_to_id"
                              onBlur = {e => this.resetDatePicker(e)}
                            />
                          </div>
                          

                          <div className="delete-date flex">
                            <InputWithLabelBorder
                              label="中止日"
                              type="date"
                              getInputText={this.getDeleteStartdate.bind(this)}
                              diseaseEditData={this.state.stop_date}
                              id='stop_date_id'
                              onBlur = {e => this.resetDatePicker(e)}
                            />
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
                      {this.props.edit_number > 0 &&
                        this.state.injection_pattern != null &&
                        this.state.injection_pattern != undefined &&
                        this.state.injection_pattern.length > 0 && (
                          <div className={"final-info"}>
                            {"最終入力日時：" +
                              formatDateSlash(
                                this.state.injection_pattern[0].updated_at.split(
                                  " "
                                )[0]
                              ) +
                              " " +
                              formatTime(
                                formatTimePicker(
                                  this.state.injection_pattern[0].updated_at.split(
                                    " "
                                  )[1]
                                )
                              ) +
                              "　"}
                            {"　入力者：" +
                              (this.state.injection_pattern[0].updated_by !== 0
                                ? this.state.staff_list_by_number[
                                    this.state.injection_pattern[0].updated_by
                                  ]
                                : "") +
                              "　"}
                            {"　指示者：" +
                              (this.state.injection_pattern[0]
                                .instruction_doctor_number != null &&
                              this.state.injection_pattern[0]
                                .instruction_doctor_number !== 0
                                ? this.state.doctor_list_by_number[
                                    this.state.injection_pattern[0]
                                      .instruction_doctor_number
                                  ]
                                : "")}
                          </div>
                        )}
                      <div className="input-data-area flex">
                        <InputWithLabel
                          label="入力日"
                          type="date"
                          getInputText={this.getInputdate}
                          diseaseEditData={this.state.entry_date}                          
                        />
                        <div className="input-time">
                          <label style={{cursor:"text"}}>入力時間</label>
                          <DatePicker
                            selected={this.state.entry_time}
                            onChange={this.getInputTime}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            timeCaption="時間"
                          />
                        </div>
                        <div className="remove-x-input d-flex w-50">
                          <InputWithLabel
                            label="入力者"
                            type="text"
                            isDisabled={true}
                            getInputText={this.getInputMan.bind(this)}
                            diseaseEditData={authInfo.name}
                          />
                          <div
                            className={authInfo !== undefined && authInfo != null && authInfo.doctor_number > 0 ? 'direct_man':'direct_man cursor-input'}
                            onClick={(e)=>this.showDoctorList(e).bind(this)}
                          >
                            <InputWithLabel
                              label="指示者"
                              type="text"
                              getInputText={this.getDirectMan.bind(this)}
                              isDisabled={true}
                              diseaseEditData={
                                this.state.doctor_list_by_number != undefined &&
                                this.state.instruction_doctor_number !== 0
                                  ? this.state.doctor_list_by_number[
                                      this.state.instruction_doctor_number
                                    ]
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Row>
                        <div className="history-temp-area">
                          {this.props.edit_number > 0 &&
                            this.state.injection_pattern != null &&
                            this.state.injection_pattern != undefined &&
                            this.state.injection_pattern.length > 0 && (
                              <div className="board d-flex w-100" style={{paddingLeft:'120px'}}>
                                <div className="history-item w-25">
                                  {"最終入力日時：" +
                                    formatDateSlash(
                                      this.state.injection_pattern[0].updated_at.split(
                                        " "
                                      )[0]
                                    ) +
                                    " " +
                                    formatTime(
                                      formatTimePicker(
                                        this.state.injection_pattern[0].updated_at.split(
                                          " "
                                        )[1]
                                      )
                                    )}
                                </div>
                                <div className="history-item w-25">
                                  {"入力者：" +
                                    (this.state.injection_pattern[0]
                                      .updated_by !== 0
                                      ? this.state.staff_list_by_number[
                                          this.state.injection_pattern[0]
                                            .updated_by
                                        ]
                                      : "")}
                                </div>
                                <div className="history-item1 w-25">
                                  {"指示者：" +
                                    (this.state.injection_pattern[0]
                                      .instruction_doctor_number != null &&
                                    this.state.injection_pattern[0]
                                      .instruction_doctor_number !== 0 &&
                                    this.state.doctor_list_by_number[
                                      this.state.injection_pattern[0]
                                        .instruction_doctor_number
                                    ] != undefined
                                      ? this.state.doctor_list_by_number[
                                          this.state.injection_pattern[0]
                                            .instruction_doctor_number
                                        ]
                                      : "")}
                                </div>
                              </div>
                            )}
                          <div className="register_info input-data-area">
                            <InputWithLabel
                              className="entry_date"
                              label="入力日"
                              type="date"
                              getInputText={this.getInputdate}
                              diseaseEditData={this.state.entry_date}
                            />
                            <div className="input-time">
                              <label className="time_label">入力時間</label>
                              <DatePicker
                                selected={this.state.entry_time}
                                onChange={this.getInputTime.bind(this)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時間"
                              />
                            </div>
                            <div className="remove-x-input d-flex w-50">
                              <InputWithLabel
                                label="入力者"
                                type="text"
                                isDisabled={true}
                                placeholder=""
                                diseaseEditData={this.state.entry_name}
                              />
                              { authInfo != undefined &&
                              authInfo != null &&
                              authInfo.doctor_number > 0 ? (
                                <div
                                  className="direct_man"
                                  onClick={(e)=>this.showDoctorList(e).bind(this)}
                                >
                                  <InputWithLabel
                                    label="指示者"
                                    type="text"
                                    getInputText={this.getDirectMan.bind(this)}
                                    isDisabled={true}
                                    diseaseEditData={
                                      this.state.doctor_list_by_number !=
                                      undefined &&
                                      this.state.instruction_doctor_number !== 0
                                        ? this.state.doctor_list_by_number[
                                          this.state.instruction_doctor_number
                                          ]
                                        : ""
                                    }
                                  />
                                </div>
                              ):(
                                <div
                                  className="direct_man cursor-input"
                                  onClick={(e)=>this.showDoctorList(e).bind(this)}
                                >
                                  <InputWithLabel
                                    label="指示者"
                                    type="text"
                                    getInputText={this.getDirectMan.bind(this)}
                                    isDisabled={true}
                                    diseaseEditData={
                                      this.state.doctor_list_by_number !=
                                        undefined &&
                                      this.state.instruction_doctor_number !== 0
                                        ? this.state.doctor_list_by_number[
                                            this.state.instruction_doctor_number
                                          ]
                                        : ""
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Row>
                    </>
                  )}
                </div>
                <ContextMenu
                  {...this.state.contextMenu}
                  parent={this}
                  row_index={this.state.row_index}
                />
              </Wrapper>
              )}
            </div>
            {this.state.isUpdateConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.updatePattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isDeleteConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.deletePattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isMakeScheduleModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.makeSchedule.bind(this)}
                confirmTitle={this.state.confirm_message}
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
            {this.state.isOpenInjectionSelectModal && (
              <SelectPannelModal
                selectMaster={this.selectInjectionCode}
                closeModal={this.closeModal}
                MasterName={"注射"}
              />
            )}
            {this.state.isConfirmComplete !== false && (
              <CompleteStatusModal message={this.state.complete_message} />
            )}
            {this.state.isOpenInjectionSet && (
              <InjectionSetModal
                closeModal={this.closeModal}
                handleOk={this.saveSetData}
                injectionSetData={this.state.injectionSetData}
                category={this.state.set_category}
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
            {this.state.isCloseConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.moveClose}
                confirmTitle={this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}
            {this.state.isClearConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.clearPattern}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isAddPatternConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.addPattern}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          </Card>
        </Modal.Body>
        <Modal.Footer>
          {this.props.edit_number !== 0 && (
              <Button className="delete-btn" onClick={this.delete.bind(this)}>削除</Button>
          )}
          <Button className={this.change_flag == 0 ? 'disable-btn' : "cancel-btn"} onClick={this.clearConfirm.bind(this)}>クリア</Button>
          <Button className="cancel-btn" onClick={this.ConfirmClose}>キャンセル</Button>
            {this.props.edit_number !== 0 ? (
              <Button className="red-btn" onClick={this.update.bind(this)}>変更</Button>
            ) : (
              <Button className={this.change_flag == 0 ? 'disable-btn' : "red-btn"} onClick={this.confirmAddPattern.bind(this)}>追加</Button>
            )}
        </Modal.Footer>
      </Modal>
    );
  }
}

EditInjectionPattern.contextType = Context;

EditInjectionPattern.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  system_patient_id: PropTypes.number,
  schedule_date: PropTypes.string,
  is_temporary: PropTypes.number,
  modal_type: PropTypes.number,
  edit_number: PropTypes.number,
  add_flag: PropTypes.bool,
  history: PropTypes.object,
  from_source: PropTypes.string,
};

export default EditInjectionPattern;
