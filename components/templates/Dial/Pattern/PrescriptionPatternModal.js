import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import $ from "jquery";
import styled from "styled-components";
import { surface } from "../../../_nano/colors";
import Button from "../../../atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "../../../molecules/Checkbox";
import InputWithLabel from "../../../molecules/InputWithLabel";
import InputWithLabelBorder from "../../../molecules/InputWithLabelBorder";
import {
  formatDateLine,
  formatDateSlash,
  formatTime,
  formatTimePicker,
  formatNowTime,
  formatJapan,
} from "~/helpers/date";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import PrescriptMedicineSelectModal from "../modals/PrescriptMedicineSelectModal";
import SelectUsageModal from "../modals/SelectUsageModal";
import { Row, Col } from "react-bootstrap";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as methods from "../DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios";
registerLocale("ja", ja);
import InputBoxTag from "~/components/molecules/InputBoxTag";
import CalcDial from "~/components/molecules/CalcDial";
import { patternValidate } from '~/helpers/validate'
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal'
import {
  addRedBorder,
  removeRequiredBg,
  removeRedBorder,
  toHalfWidthOnlyNumber
} from '~/helpers/dialConstants'
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 1rem;
  margin-right: 0.3rem;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  height: calc(90vh - 5rem);
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
  .bodywrap {
    display: flex;
    height: calc(100vh - 15.5rem);
    overflow-y: auto;
    width: 100%;
  }
  .footer {
    margin-top: 1rem;
    text-align: center;
  }
  background-color: ${surface};
  button {
    margin-bottom: 0.625rem;
    margin-left: 0.625rem;
  }
`;

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  height: calc(100vh - 16rem);
  float: left;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .flex {
    display: flex;
    flex-wrap: wrap;
    label {
      font-size: 1rem;
    }
  }
  .padding {
    float: right;
    margin-top: -1.5rem;
  }
  .main-area {
    width: calc(100% - 6.875rem);
    height: 100%;
  }
  .button-area {
    width: 6.25rem;
    margin-right: 0.625rem;
    .radio-btn {
      margin-top: 0.3rem;
    }
    .radio-btn label {
      font-size: 1rem;
      width: 6.25rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      padding: 0.25rem 0.3rem;
      text-align: center;
      margin: 0 0.3rem;
      margin-bottom: 0.3rem;
    }
    .periodic-btn {
      height: 20vh;
      padding-top: 0.625rem;
    }
  }
  .dial-list {
    width: calc(100% - 10rem);
    margin-top: 0.625rem;
    border: solid 1px rgb(206, 212, 218);
    padding: 0.625rem;
    overflow-y: hidden;
    overflow-x: hidden;
    color: #5db35d;
    display: flex;
    font-size: 1rem;
    flex-wrap: wrap;
    .row {
      width: 100%;
    }
    .row:hover {
      background-color: rgb(246, 252, 253);
      cursor: pointer;
    }
    .dial-period {
      width: 20%;
    }
    .col-md-1 {
      max-width: 6%;
    }
    .col-md-2 {
      max-width: 12%;
    }
    .col-md-3 {
      max-width: 16%;
    }
  }
  .dial-body {
    width: 100%;
    margin-top: 0.625rem;
    height: 21.875rem;
    overflow-y: auto;
    border: solid 1px rgb(206, 212, 218);
    padding: 0.625rem;
    .selected-rp {
      background: #eee;
    }
    .rp-comment {
      label {
        margin-top: 0;
        width: 6.875rem;
        text-align: right;
      }
      input {
        margin-top: -8px;
      }
    }
    td {
      padding: 0;
      button {
        text-align: center;
        background: #ddd;
        border: solid 1px #aaa;
        margin: 0px;
      }
      line-height: 2.2rem;
    }
    .set-title {
      td {
        background-color: blue;
        color: white;
      }
    }
    .btn-area {
      line-height: 1rem;
      width: 3rem !important;
      background-color: white !important;
      button {
        min-width: 3rem;
      }
    }
    .amount-item {
      text-align: center;
    }
  }
  .dial-oper {
    .row {
      margin: 0px;
    }
    .row .col-md-3 label {
      width: 5.625rem;
      font-size: 1rem;
      text-align: right;
      margin-right: 0.5rem;
    }
    input {
      font-size: 1rem;
    }
  }

  .react-datepicker-wrapper {
    width: 100%;
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
  .period {
    display: flex;
    label {
      width: 3rem;
      font-size: 1rem;
      margin-left: 2px;
    }
  }
  .input-time {
    display: flex;
    label {
      width: 5rem;
      padding-top: 0.625rem;
      font-size: 0.75rem;
    }
  }
  .from-padding {
    padding-left: 1.25rem;
  }
  .radio-group-btn label {
    width: 1.5rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 0.25rem;
    margin: 0 0.3rem;
    padding: 0.25rem 0.3rem;
  }
  .gender {
    font-size: 0.75rem;
    margin-top: 0.625rem;
    margin-left: 1rem;
    margin-bottom: 0.625rem;
    .gender-label {
      width: 5rem;
      text-align: right;
      padding-right: 0.625rem;
      float: left;
      font-size: 1rem;
      margin-top: 0.3rem;
      margin-bottom: 0;
    }
  }
  .period {
    label {
      width: 0;
    }
    display: flex;
    .pd-15 {
      padding: 1rem 0 0 0.5rem;
    }
    .react-datepicker-wrapper {
      width: 12.5rem;
    }
  }
  .period div:first-child {
    .label-title {
      width: 6.25rem;
      text-align: right;
      padding-right: 1rem;
      margin-right: 0;
      font-size: 1rem;
      margin-top: 0.3rem;
      margin-bottom: 0;
    }
  }

  .input-data-area {
    width: calc((100% - 36.5rem) / 2);
    .react-datepicker-wrapper {
      width: calc(100% - 3.75rem);
    }
    flex: none;
    label {
      text-align: right;
      font-size: 1rem;
      width: 4.7rem;
      margin-top: 6px;
      padding-top: 0;
    }
    input {
      width: calc(100% - 3.75rem);
      height: 2.5rem;
    }
    .input-time {
      margin-top: 0.625rem;
      display: flex;
      label {
        margin-right: 0.5rem;
      }
    }
  }
  .selet-day-check {
    label {
      width: 100%;
      padding: 0.625rem 0 0 1.25rem;
      font-size: 1rem;
      input {
        top: 1px;
      }
    }
  }
  .radio-btn {
    margin-top: 0.3rem;
  }
  .coment-area {
    div {
      width: 100%;
      .label-title {
        text-align: right;
        font-size: 1rem;
        width: 6.25rem;
        margin-right: 0;
        padding-right: 0.625rem;
        margin-top: 6px;
        margin-bottom: 0;
      }
      input {
        width: calc(100% - 6.25rem);
        height: 2.5rem
      }
    }
  }
  .area1 {
    width: 35rem;
    .gender .radio-group-btn label {
      font-size: 1rem;
      width: 1.875rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin: 0 0.3rem;
      padding: 0.25rem 0.3rem;
    }
  }
  .no-dial-day {
    width: 2.2rem;
    display: inline-block;
  }
  .final-info {
    padding-left: 6.875rem;
    padding-top: 0.3rem;
    font-size: 1rem;
  }
`;

const DialDataBox = styled.div`
  width: 100%;
  height: 5rem;
  overflow-y: auto;
  .row {
    padding-bottom: 0.3rem;
    text-align: center;
    margin: 0;
  }
  .row.selected {
    background: lightblue;
  }
  .row.selected: hover {
    background: lightblue;
  }

  .pattern-index {
    width: 1.25rem;
    text-align: center;
  }
  .pattern-area {
    width: calc(100% - 11.25rem);
  }
  .pattern-week-day {
    width: 5%;
    text-align: center;
  }
  .pattern-time_zone {
    width: 5%;
    text-align: center;
  }
  .pattern-bed_no {
    width: 5%;
    text-align: center;
  }
  .pattern-console {
    width: 25%;
    text-align: center;
  }
  .pattern-dial_method {
    width: 35%;
    text-align: center;
  }
  .pattern-group {
    width: 25%;
    text-align: center;
  }
  .pattern-time_limit_from {
    text-align: center;
    width: 5rem;
  }
  .pattern-time_limit_to {
    text-align: center;
    width: 5rem;
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 75rem;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 5rem;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: normal;
    max-width:20rem;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
    .blue-text {
      color: blue;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
`;

const HoverPatternMenu = ({ visible, x, y, rp_index, comment_index, parent, word_pattern_list}) => {  
  if (visible){
    return (
      <ContextMenuUl>
        <ul className="hover-pattern-menu context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {word_pattern_list != undefined && word_pattern_list != null && word_pattern_list.length > 0 && 
            word_pattern_list.map(pattern => {
              return (
                <>
                  <li style={{padding:'5px 12px'}} onMouseOver = {e => parent.setPatternHover(e, rp_index,  comment_index, pattern.number)}>{pattern.name}</li>
                </>
              )
            })
          }
        </ul>
      </ContextMenuUl>
    )
  } else {
    return null;
  }
}

const HoverWordMenu = ({ visible, x, y, rp_index, comment_index, parent, selected_word_list}) => {
  if (visible){
    return (
      <ContextMenuUl>
        <ul className="hover-word-menu context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {selected_word_list != undefined && selected_word_list != null && selected_word_list.length > 0 && 
            selected_word_list.map(item => {
              return(
                <>
                <li><div onClick = {e => parent.selectRpWord(e, rp_index, comment_index, item.word)}>{item.word}</div></li>
                </>
              )
            })
          }
        </ul>
      </ContextMenuUl>
    )
  } else {
    return null;
  }
}

const ContextMenu = ({ visible, x, y, parent, rp_index, medi_index, comment_index }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu main-context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {medi_index != undefined && (
            <>
              <li>
                <div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "med_change")}>
                  薬剤変更
                </div>
              </li>
              <li>
                <div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index,medi_index,"amount_change")}>
                  数量変更
                </div>
              </li>
              <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction( rp_index, medi_index, "is_not_generic" )}>後発品への変更不可</div></li>
            </>
          )}
          {comment_index !== undefined && comment_index >= 0 && (
            <>
              <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "change_free_comment", comment_index)}>RPコメント編集</div></li>
              <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "delete_free_comment", comment_index)}>RPコメント削除</div></li>
            </>
          )}
          <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "usage_change")}>用法・日数/回数変更</div></li>
          {!(medi_index >= 0) && (
            <>
              <li id = "regular-comment-li"><div onMouseOver = {e => parent.setMainHover(e, rp_index, comment_index)}>RPコメント行追加（定型文）</div></li>
              <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "add_free_comment", comment_index)}>RPコメント行追加（フリー）</div></li>
            </>
          )}          
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const week_days = ["日", "月", "火", "水", "木", "金", "土"];

const periodics = ["定期1", "定期2", "定期3"];

const sortations = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];

class Prescription extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      prescription_pattern: [],
      time_limit_from: "",
      time_limit_to: "",
      checkPeriod: false,
      entry_date: new Date(),
      entry_time: formatNowTime(),
      coment: "",
      directer_name: "",
      rows: this.rows,
      dial_pattern_list: [],
      dial_pattern: [],
      weightMenu: {
        visible: false,
      },
      patient_id: "",
      number: "",
      not_yet: false,
      is_weekly: false,
      periodic: "",
      checkalldays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
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
      patient_name: "",
      system_patient_id: "",
      final_week_days: 0,
      isOpenMedicineModal: false,
      regular_prescription_number: 0,
      is_doctor_consented: 0,
      checkSchedule: 0,
      data_json: [],
      rp_number: 0,
      prescription_category: "内服",
      usage_code: "",
      comment: "",
      data_json_item: {
        rp_number: 0,
        prescription_category: "内服",
        usage_code: "",
        usage_name: "",
        days: 0,
        disable_days_dosing: 0,
        free_comment: [],
        medicines: [],
      },
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isMakeScheduleModal: false,
      confirm_message: "",
      patientInfo: [],
      selected_pattern_data: "",
      isShowDoctorList: false,
      entry_name:
        authInfo != undefined && authInfo != null ? authInfo.name : "",
      instruction_doctor_number: "",
      medicine_kind: "",
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      checkLastPeriod: 1,
      confirm_type: "add",
      complete_message: "",
      isConfirmComplete: false,
      rp_index: "",
      medi_index: "",
      modal_data: null,
      isOpenAmountModal: false,
      confirm_action: "",
      selected_rp: "",
      input_comment: false,
      isShowPresetList: false,
      preset_data: null,
      disable_auto_schedule: false,
      isReScheduleConfirm: false,
      isBackConfirmModal: false,
      isClearConfirmModal: false,
      isAddConfirmModal: false,
      change_flag: 0,
      confirm_alert_title:'',
      alert_message: '',
      alert_messages: '',
    };
    this.ex_weekday = 0;
    this.ex_time_limit_from = null;
    this.change_flag = 0;
    this.ex_time_limit_to = null;
    let dial_pattern_validate = sessApi.getObject("init_status").dial_pattern_validate;
    this.free_comment_max = 30;
    this.free_comment_err_msg = "RPのコメントは30文字以下で入力してください。";
    if (dial_pattern_validate !== undefined && dial_pattern_validate.dial_prescription_pattern !== undefined &&
      dial_pattern_validate.dial_prescription_pattern.free_comment !== undefined ) {
      this.free_comment_max = dial_pattern_validate.dial_prescription_pattern.free_comment.length;
      this.free_comment_err_msg = dial_pattern_validate.dial_prescription_pattern.free_comment.overflow_message != "" ?
        dial_pattern_validate.dial_prescription_pattern.free_comment.overflow_message : this.free_comment_err_msg;
    }
  }

  async UNSAFE_componentWillMount() {
    await this.setDoctors();
    await this.getStaffs();
    await this.getWordInfo();
  }

  getWordInfo = async() => {
    let path = "/app/api/v2/dial/board/searchPatternAndWords";
    await apiClient
      ._post(path, {
        params: {
          is_enabled: 1,
          usable_page: '処方/RPコメント',
          order: 'name_kana',
        },
      })
      .then((res) => {
        this.setState({
          word_pattern_list: res.pattern,
          word_list:res.word
        });
      })
      .catch(() => {});
  }

  componentDidMount() {    
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }
    this.getPresetMaster();
    if (
      this.props.patientInfo !== undefined &&
      this.props.patientInfo != null &&
      this.props.patientInfo.system_patient_id != undefined
    )
      this.selectPatient(this.props.patientInfo);
  }

  getPresetMaster = async () => {
    let path = "/app/api/v2/dial/master/prescriptionSet_search";
    let { data } = await axios.post(path, { params: { is_enabled: 1, order:"sort_number" } });
    this.setState({ preset_data: data });
  };

  async getPrescriptionPatternInfo(patient_id) {
    let path = "/app/api/v2/dial/pattern/getPrescriptionPattern";
    const post_data = {
      patient_id: patient_id,
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res)
          this.setState({
            prescription_pattern: res,
          });
        if (res) {
          let tmp = res;

          if (this.state.checkLastPeriod == 0) {
            let today = new Date();
            tmp = this.getPatternListByDateCondition(
              res,
              formatDateLine(today),
              "time_limit_from",
              "time_limit_to"
            );
          }

          this.setState({
            prescription_pattern: tmp,
            origin_pattern_list: res,
          });
        }
      })
      .catch(() => {});
  }

  gettime_limit_from = (value) => {
    this.setChangeFlag(1);

    this.setState({ time_limit_from: value });
  };
  gettime_limit_to = (value) => {
    this.setChangeFlag(1);
    this.setState({ time_limit_to: value });
  };
  getCheckedDm = (name, value) => {
    if (name === "period") this.setState({ checkPeriod: value });
  };
  getCheckedLast = (name, value) => {
    if (name === "last") {
      if (value == 0) {
        let tmp = [];
        let today = new Date();
        tmp = this.getPatternListByDateCondition(
          this.state.prescription_pattern,
          formatDateLine(today),
          "time_limit_from",
          "time_limit_to"
        );
        this.setState({
          checkLastPeriod: value,
          prescription_pattern: tmp,
        });
      } else {
        this.setState({
          checkLastPeriod: value,
          prescription_pattern: this.state.origin_pattern_list,
        });
      }
    }
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

  getComent = (e) => {
    this.setChangeFlag(1);
    this.setState({ comment: e.target.value });
  };

  clear = () => {
    if (this.state.data_json == null || this.state.data_json == [] || this.state.data_json.length == 0) return;
    this.setState({
      isClearConfirmModal: true,
      confirm_message: "入力中の内容を消去しますか？",
    });
  };

  clearPattern = () => {
    this.confirmCancel();
    if (this.state.patient_id !== "") {
      this.setChangeFlag(0);
      this.selectPatient(this.state.patient);
    }
  };

  addDay = (value) => {
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = checkalldays[value] ? false : true;
    var final_week_days = parseInt(this.state.final_week_days);
    var pval = Math.pow(2, value);
    final_week_days =
      (final_week_days & pval) > 0
        ? final_week_days - pval
        : final_week_days + pval;
    this.setState({ final_week_days, checkalldays });
    this.setChangeFlag(1);
  };

  getCheckAnotherDay = (name, value) => {
    if (name === "schedule") {
      if (value === 0) {
        this.getDialDays(this.state.system_patient_id);
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

  getCheckAllDay = (name, value) => {
    this.setChangeFlag(1);
    if (name === "schedule1") this.setState({ is_weekly: value });
  };
  disableSchedule = (name, value) => {
    if (name === "disable_schedule")
      this.setState({ disable_auto_schedule: value });
    this.setChangeFlag(1);
  };

  changePeriodic = (value) => {
    this.setState({ regular_prescription_number: value });
    this.setChangeFlag(1);
  };

  selectPatient = (patient) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      number: "",
      selected_row: "",
      patient: patient,
      patient_name: patient.patient_name,
      patient_id: patient.patient_number,
      system_patient_id: patient.system_patient_id,
      rows: this.rows,
      time_limit_from: "",
      time_limit_to: "",
      checkPeriod: false,
      entry_date: new Date(),
      entry_time: formatNowTime(),
      medicine_kind: "",
      take_comment: "",
      prescription_set: "",
      data_json: [],
      comment: "",
      patientInfo: patient,
      entry_name:
        authInfo != undefined && authInfo != null ? authInfo.name : "",
      checkalldays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      directer_name:
        this.context.selectedDoctor.code > 0
          ? this.context.selectedDoctor.name
          : "",
      instruction_doctor_number:
        this.context.selectedDoctor.code > 0
          ? parseInt(this.context.selectedDoctor.code)
          : "",
      isShowDoctorList: false,
      final_week_days: 0,
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      modal_data: null,
      selected_rp: "",
      input_comment: false,
      isMinusConfirmModal: false,
    });
    this.getDialDays(patient.system_patient_id);
    this.getPrescriptionPatternInfo(patient.system_patient_id);
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

  changeMedicineKind = (value) => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      prescription_category: sortations[value],
      isOpenMedicineModal: true,
      medicine_kind: value,
      is_open_usage: 1,
      data_json_item: {
        rp_number: 0,
        prescription_category: "内服",
        usage_code: "",
        usage_name: "",
        days: 0,
        disable_days_dosing: 0,
        free_comment: [],
        medicines: [],
      },
    });
    this.setChangeFlag(1);
  };

  addMedicine = (value, prescription_category) => {
    this.setState({
      prescription_category,
      rp_number: value,
      is_open_usage: 0,
      medicine_kind: sortations.indexOf(prescription_category),
      data_json_item: {
        rp_number: value,
        prescription_category,
        usage_code: "",
        usage_name: "",
        days: 0,
        disable_days_dosing: 0,
        free_comment: [],
        medicines: [],
      },
      isOpenMedicineModal: true,
    });
  };

  changeTakeComment = (value) => {
    this.setState({ take_comment: value });
    this.setChangeFlag(1);
  };

  add = () => {
    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.REGISTER
      ) === false
    ) {
      window.sessionStorage.setItem("alert_messages","登録権限がありません。");
      return;
    }
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }

    this.setState({
      isAddConfirmModal: true,
      confirm_message: "パターンを追加しますか？",
    });
  };
  checkValidation = () => {
    this.initRedBorder();
    let error_str_arr = []
    let validate_data = patternValidate(
      'dial_prescription_pattern',
      this.state
    )
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr
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
    }

    if (validate_data.first_tag_id != '') {
      this.setState({ first_tag_id: validate_data.first_tag_id })
    }
    return error_str_arr
  }

  addPattern = () => {
    this.confirmCancel();
    let new_pattern = {
      patient_id: this.state.system_patient_id,
      time_limit_from: this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "",
      time_limit_to: this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "",
      checkSchedule: this.state.checkSchedule,
      regular_prescription_number: this.state.regular_prescription_number + 1,
      weekday: this.state.final_week_days,
      is_weekly: this.state.is_weekly,
      data_json: this.state.data_json,
      instruction_doctor_number: this.state.instruction_doctor_number,
      is_doctor_consented: this.state.is_doctor_consented,
      entry_date: this.state.entry_date
        ? formatDateLine(this.state.entry_date)
        : "",
      entry_time: this.state.entry_time
        ? formatTime(this.state.entry_time)
        : "",
      entry_name: this.state.entry_name,
      directer_name: this.state.directer_name,
      comment: this.state.comment,
      confirm: this.state.confirm_type,
      confirm_action: this.state.confirm_action,
      disable_auto_schedule: this.state.disable_auto_schedule,
    };
    this.openConfirmCompleteModal("保存中");
    let path = "/app/api/v2/dial/pattern/registerPrescriptionPattern";

    apiClient
      .post(path, {
        params: new_pattern,
      })
      .then((res) => {
        this.setState({
          isConfirmComplete: false,
        });
        if (res.alert_message != undefined && res.alert_message != null) {
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          this.selectPatient(this.state.patient);
        }
        if (res.no_sch_date != undefined && res.no_sch_date != null) {
          this.setState({
            isMakeScheduleModal: true,
            confirm_message: res.no_sch_date,
            confirm_type: "sch_date_multi_check",
            confirm_action: "add_pattern",
          });
        }
      })
      .catch(() => {
        this.setState({
          isConfirmComplete: false,
        });
      });
      this.setChangeFlag(0);
  };
  updatePattern = (re_schedule = true) => {
    this.confirmCancel();
    if (this.state.patient_id !== "") {
      var time_limit_from, time_limit_to, weekday;
      if (re_schedule) {
        time_limit_from = this.state.time_limit_from
          ? formatDateLine(this.state.time_limit_from)
          : "";
        time_limit_to = this.state.time_limit_to
          ? formatDateLine(this.state.time_limit_to)
          : "";
        weekday = this.state.final_week_days;
      } else {
        time_limit_from = formatDateLine(this.ex_time_limit_from);
        time_limit_to = formatDateLine(this.ex_time_limit_to);
        weekday = this.ex_weekday;
      }
      let new_pattern = {
        number: this.state.number,
        patient_id: this.state.system_patient_id,
        time_limit_from,
        time_limit_to,
        checkSchedule: this.state.checkSchedule,
        regular_prescription_number: this.state.regular_prescription_number + 1,
        weekday,
        is_weekly: this.state.is_weekly,
        data_json: this.state.data_json,
        is_doctor_consented: this.state.is_doctor_consented,
        entry_date: this.state.entry_date
          ? formatDateLine(this.state.entry_date)
          : "",
        entry_time: this.state.entry_time
          ? formatTime(this.state.entry_time)
          : "",
        comment: this.state.comment,
        instruction_doctor_number: this.state.instruction_doctor_number,
        confirm: this.state.confirm_type,
        confirm_action: this.state.confirm_action,
        disable_auto_schedule: this.state.disable_auto_schedule,
      };
      this.openConfirmCompleteModal("保存中");
      let path = "/app/api/v2/dial/pattern/registerPrescriptionPattern";

      apiClient
        .post(path, {
          params: new_pattern,
        })
        .then((res) => {
          this.setState({
            isConfirmComplete: false,
          });
          if (res.alert_message != undefined && res.alert_message != null) {
            var title = '';
            var message = res.alert_message;
            if (message.indexOf('変更') > -1) title = "変更完了##";
            if (message.indexOf('登録') > -1) title = "登録完了##";
            window.sessionStorage.setItem("alert_messages", title + res.alert_message);
            this.selectPatient(this.state.patient);
          }
          if (res.no_sch_date != undefined && res.no_sch_date != null) {
            this.setState({
              isMakeScheduleModal: true,
              confirm_message: res.no_sch_date,
              confirm_type: "sch_date_multi_check",
              confirm_action: "update_pattern",
            });
          }
        })
        .catch(() => {
          this.setState({
            isConfirmComplete: false,
          });
        });
    } else {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください."
      );
    }
    this.setChangeFlag(0);
  };

  deletePattern = async () => {
    this.confirmCancel();
    let delete_pattern = {
      number: this.state.number,
      system_patient_id: this.state.system_patient_id,
    };
    let path = "/app/api/v2/dial/pattern/deletePrescriptionPattern";

    await apiClient
      .post(path, {
        params: delete_pattern,
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", "削除完了##" +  res.alert_message);
      })
      .catch(() => {});
    this.selectPatient(this.state.patient);
    this.setChangeFlag(0);
  };

  closeModal = () => {
    this.setState({
      isOpenMedicineModal: false,
      isOpenUsageModal: false,
      isOpenAmountModal: false,
      isShowPresetList: false,
      change_med_index: null,
      selected_medicine: null,
      alert_messages: ""
    }, () => {
      if (document.getElementById("input_comment") != null) {
        let data_json = this.state.data_json;
        let comment_length =
          data_json[this.state.selected_rp].free_comment !== undefined &&
          data_json[this.state.selected_rp].free_comment != null &&
          data_json[this.state.selected_rp].free_comment.length > 0 &&
          data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
            ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
            : 0;
        this.setCaretPosition(document.getElementById("input_comment"),comment_length);
      }
    });
  };
  editpatternConfirm = (index) => {
    if (this.change_flag === 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
        confirm_type: 'edit_pattern',
        edit_pattern_index: index,
      });
      this.modalBlack();
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
    this.setChangeFlag(0);
    this.initRedBorder();
    let pattern =
      this.state.prescription_pattern !== undefined &&
      this.state.prescription_pattern[value];
    if (pattern === undefined) return;
    let another_day = false;
    let final_week_days = {};
    var weekday = parseInt(pattern.weekday);
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
      this.getDialDays(this.state.system_patient_id);
    }
    let create_at = pattern.updated_at;
    let input_day = create_at.split(" ");
    this.setState({
      selected_row: value,
      number:
        pattern.prescription_number !== undefined &&
        pattern.prescription_number,
      final_week_days: weekday,
      checkalldays: final_week_days,
      time_limit_from: new Date(pattern.time_limit_from),
      time_limit_to:
        pattern.time_limit_to != null ? new Date(pattern.time_limit_to) : "",
      regular_prescription_number: pattern.regular_prescription_number - 1,
      is_weekly: pattern.is_weekly,
      data_json: pattern.data_json,
      comment: pattern.comment,
      final_entry_date: formatDateSlash(new Date(input_day[0])),
      final_entry_time: formatTime(formatTimePicker(input_day[1])),
      final_entry_name:
        this.state.staff_list_by_number != undefined &&
        this.state.staff_list_by_number != null
          ? pattern.updated_by !== 0
            ? this.state.staff_list_by_number[pattern.updated_by]
            : ""
          : "",
      final_doctor_name:
        pattern.instruction_doctor_number != null &&
        this.state.doctor_list_by_number != undefined
          ? this.state.doctor_list_by_number[pattern.instruction_doctor_number]
          : "",
    });
    this.ex_time_limit_from = new Date(pattern.time_limit_from);
    this.ex_time_limit_to =
      pattern.time_limit_to != null ? new Date(pattern.time_limit_to) : null;
    this.ex_weekday = weekday;
  };

  handleOk = (medicine_data, rp_number, is_open_usage) => {
    this.setChangeFlag(1);

    if (is_open_usage === 1) {
      let data_json_item = { ...this.state.data_json_item };
      let medicine = { ...medicine_data };
      data_json_item.medicines.push(medicine);
      this.setState({
        data_json_item,
        isOpenMedicineModal: false,
        isOpenUsageModal: true,
      });
      return;
    } else {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[rp_number] };
      let medicines = data_json_item.medicines;
      if (
        this.state.selected_medicine !== undefined &&
        this.state.selected_medicine != null &&
        this.state.change_med_index !== undefined &&
        this.state.change_med_index != null
      ) {
        medicines[this.state.change_med_index] = medicine_data;
        this.setState({
          change_med_index: null,
          selected_medicine: null,
        });
      } else {
        medicines.push(medicine_data);
      }
      data_json_item.medicines = medicines;
      data_json[rp_number] = data_json_item;
      this.setState({
        data_json,
        isOpenMedicineModal: false,
      });
    }
  };
  handleUsageOk = (usage_data) => {
    this.setChangeFlag(1);

    if (this.state.rp_index !== "") {
      // 服用編集
      let data_json_item = { ...this.state.data_json_item };
      data_json_item.rp_number = this.state.rp_number + 1;
      data_json_item.usage_code = usage_data.usage_code;
      data_json_item.usage_name = usage_data.usage_name;
      data_json_item.days = usage_data.days;
      data_json_item.medicines = this.state.data_json[
        this.state.rp_index
      ].medicines;
      data_json_item.disable_days_dosing = usage_data.disable_days_dosing;
      data_json_item.prescription_category = usage_data.prescription_category;
      data_json_item.free_comment = this.state.data_json[
        this.state.rp_index
      ].free_comment;
      this.setState((state) => {
        let data_json = state.data_json;
        data_json[this.state.rp_index] = data_json_item;
        return {
          data_json,
          modal_data: null,
          isOpenUsageModal: false,
          rp_index: "",
          data_json_item: {
            rp_number: data_json_item.rp_number,
            prescription_category: "内服",
            usage_code: "",
            usage_name: "",
            days: 0,
            disable_days_dosing: 0,
            free_comment: data_json_item.free_comment,
            medicines: [],
          },
        };
      });
    } else {
      let data_json_item = { ...this.state.data_json_item };
      data_json_item.rp_number = this.state.rp_number + 1;
      data_json_item.usage_code = usage_data.usage_code;
      data_json_item.usage_name = usage_data.usage_name;
      data_json_item.days = usage_data.days;
      data_json_item.disable_days_dosing = usage_data.disable_days_dosing;
      data_json_item.prescription_category = this.state.prescription_category;
      this.setState((state) => {
        let data_json = state.data_json;
        data_json.push(data_json_item);
        return {
          data_json,
          modal_data: null,
          isOpenUsageModal: false,
          rp_index: "",
          selected_rp: data_json.length - 1, // RP追加時は、そのRPが選択される状態
          data_json_item: {
            rp_number: data_json_item.rp_number,
            prescription_category: "内服",
            usage_code: "",
            usage_name: "",
            days: 0,
            disable_days_dosing: 0,
            free_comment: [],
            medicines: [],
          },
        };
      });
    }
  };

  deleteMedicine = (rp_index, medi_index) => {
    this.setState({
      sel_del_rp: rp_index,
      sel_del_med: medi_index,
      isMinusConfirmModal: true,
      confirm_message: "削除しますか？",
    });
  };

  addRp = (value) => {
    this.setState({
      isOpenMedicineModal: true,
      is_open_usage: 1,
      medicine_kind: sortations.indexOf(value),
      prescription_category: value,
    });
  };

  deleteRp = (rp_index) => {
    this.setState({
      sel_del_rp: rp_index,
      isMinusConfirmModal: true,
      confirm_message: "削除しますか？",
    });
  };

  confirmDeleteRp = (rp_index, medi_index) => {
    this.setChangeFlag(1);

    this.confirmCancel();
    let data_json = this.state.data_json;
    if (medi_index == null) {
      data_json.splice(rp_index, 1);
      this.setState({
        data_json,
        sel_del_rp: null,
      });
      return;
    }
    let data_json_item = { ...this.state.data_json[rp_index] };
    let medicines = data_json_item.medicines;
    if (medicines.length == 1) {
      data_json.splice(rp_index, 1);
      this.setState({
        data_json,
        sel_del_med: null,
        sel_del_rp: null,
      });
      return;
    }
    data_json_item.medicines.splice(medi_index, 1);
    data_json[rp_index] = data_json_item;
    this.setState({
      data_json,
      sel_del_med: null,
      sel_del_rp: null,
    });
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isAddConfirmModal: false,
      isMakeScheduleModal: false,
      isDeleteConfirmModal: false,
      isReScheduleConfirm: false,
      isMinusConfirmModal: false,
      isClearConfirmModal: false,
      isBackConfirmModal: false,
      isOpenMoveOtherPageConfirm: false,
      confirm_message: "",
      confirm_type: "",
      confirm_alert_title:'',
    });
    this.modalBlack();
  }

  update = () => {
    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (this.state.number === "") {
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
    let flag = true;
    if (this.state.patient_id === "") {
      flag = false;
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
    } else if (this.state.number === "") {
      flag = false;
      window.sessionStorage.setItem(
        "alert_messages",
        "削除するパターンを選択してください。"
      );
    } else if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.DELETE
      ) === false
    ) {
      flag = false;
      window.sessionStorage.setItem("alert_messages", "削除権限がありません。");
    }
    if (flag) {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: "パターン情報を削除しますか?",
      });
    }
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

  goOtherPattern = (url) => {
    this.props.history.replace(url);
  };

  makeSchedule = () => {
    this.updatePattern();
    this.confirmCancel();
  };

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };

  handleClick = (e, rp_index, medi_index, comment_index) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ 
          contextMenu: { visible: false },
          hoverPatternMenu:{visible:false},
          hoverWordMenu:{visible:false},
          pattern_menu_reserved_flag:false,  
         });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({ 
          contextMenu: { visible: false },
          hoverPatternMenu:{visible:false},
          hoverWordMenu:{visible:false},
          pattern_menu_reserved_flag:false,  
         });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({ 
            contextMenu: { visible: false },
            hoverPatternMenu:{visible:false},
            hoverWordMenu:{visible:false},
            pattern_menu_reserved_flag:false,  
           });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      document
        .getElementById("dial-body")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({ 
            contextMenu: { visible: false },
            hoverPatternMenu:{visible:false},
            hoverWordMenu:{visible:false},
            pattern_menu_reserved_flag:false,  
           });
          document
            .getElementById("dial-body")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      let clientY = e.clientY;
      let clientX = e.clientX;
      var modal = document.getElementById('prescript-pattern-modal');
      
      this.setState({
        hoverPatternMenu:{visible:false},
        hoverWordMenu:{visible:false},
        pattern_menu_reserved_flag:false,
        contextMenu: {
          visible: true,
          x: e.clientX - modal.offsetLeft,
          y: e.clientY + window.pageYOffset - modal.offsetTop,
        },
        rp_index: rp_index,
        medi_index: medi_index,
        comment_index: comment_index,
      }, ()=>{        
        let main_menu_width = 208;
        var main_menu_height = 130;
        if (medi_index !== undefined) {
          main_menu_width = 156;
          main_menu_height = 78;
        }
        if (clientX - modal.offsetLeft + main_menu_width > modal.offsetWidth && clientY - modal.offsetTop + main_menu_height <= modal.offsetHeight) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - modal.offsetLeft - main_menu_width,
              y: clientY - modal.offsetTop,
            },
          })
        }
        if (clientX - modal.offsetLeft + main_menu_width > modal.offsetWidth && clientY - modal.offsetTop + main_menu_height > modal.offsetHeight) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - modal.offsetLeft - main_menu_width,
              y: clientY - modal.offsetTop - main_menu_height,
            },
          })
        }
        if (clientX - modal.offsetLeft + main_menu_width <= modal.offsetWidth && clientY - modal.offsetTop + main_menu_height > modal.offsetHeight) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - modal.offsetLeft,
              y: clientY - modal.offsetTop - main_menu_height,
            },
          })
        }
      });
    }
  };

  selectRpWord = (e,  rp_index, comment_index, word) => {
    let data_json = this.state.data_json;
    let data_json_item = { ...this.state.data_json[rp_index] };
    let free_comment = data_json_item.free_comment;
    if (free_comment === undefined) free_comment = [];
    let com_index = '';
    if (comment_index == undefined){
      com_index = free_comment.length;
    } else {
      com_index = comment_index + 1;
    }

    if(free_comment.length == 0 || comment_index == undefined) {
      free_comment.push(word);
      com_index = free_comment.length -1;
    } else {
      free_comment.splice(comment_index + 1, 0, word);
    }

    data_json_item.free_comment = free_comment;
    data_json[rp_index] = data_json_item;
    this.setState({
      data_json,
      selected_comment_index: com_index,
      selected_rp: rp_index,
    }, () => {      
      if (document.getElementById("input_comment") != null) {        
        let data_json = this.state.data_json;
        let comment_length =
          data_json[this.state.selected_rp].free_comment !== undefined &&
          data_json[this.state.selected_rp].free_comment != null &&
          data_json[this.state.selected_rp].free_comment.length > 0 &&
          data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
            ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
            : 0;            
        this.setCaretPosition(document.getElementById("input_comment"),comment_length);
      }
    })    
  }

  setPatternHover = (e,  rp_index, comment_index, pattern_number) => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverWordMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverWordMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });    
    var word_list = this.state.word_list;
    var selected_word_list = [];
    if (word_list != undefined && word_list != null && word_list.length != 0){
      selected_word_list = word_list[pattern_number];
    }
    var modal = document.getElementById('prescript-pattern-modal');
    var hover_pattern_menu = document.getElementsByClassName('hover-pattern-menu')[0];    
    var clientX = hover_pattern_menu.offsetLeft + hover_pattern_menu.offsetWidth;
    var clientY = hover_pattern_menu.offsetTop + e.target.offsetTop;
    this.setState({
      selected_pattern_number:pattern_number,
      selected_word_list,
      hoverWordMenu: {
        visible: true,
        x: clientX,
        y: clientY,
        rp_index,
        comment_index,
      },
    }, () => {
      let word_menu = document.getElementsByClassName("hover-word-menu")[0];      
      if(clientY + word_menu.offsetHeight > modal.offsetHeight){
        if (this.state.pattern_menu_reserved_flag != true){
          this.setState({
            hoverWordMenu: {
              visible: true,
              x: clientX,
              y: clientY - word_menu.offsetHeight + 30,
              rp_index,
              comment_index,
            }
          })
        } else {
          this.setState({
            hoverWordMenu: {
              visible: true,
              x: hover_pattern_menu.offsetLeft - word_menu.offsetWidth,
              y: clientY - word_menu.offsetHeight + 30,
              rp_index,
              comment_index,
            }
          })
        }
      } else {
        if (this.state.pattern_menu_reserved_flag == true){
          this.setState({
            hoverWordMenu: {
              visible: true,
              x: hover_pattern_menu.offsetLeft - word_menu.offsetWidth,
              y: clientY,
              rp_index,
              comment_index,
            }
          })
        }
      }
    });
  }

  outMainHover = () => {
    this.setState({ 
      hoverPatternMenu: { visible: false },
      hoverWordMenu: { visible: false },
    });
  }

  setMainHover = (e,  rp_index,  comment_index) => {    
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverPatternMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverPatternMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });    
    var main_menu = document.getElementsByClassName('main-context-menu')[0];
    var regular_comment_li = document.getElementById('regular-comment-li');
    var hover_pattern_y = main_menu.offsetTop + regular_comment_li.offsetTop;
    var hover_pattern_x = main_menu.offsetLeft + main_menu.offsetWidth;
    var modal = document.getElementById('prescript-pattern-modal');
    this.setState({
      hoverPatternMenu: {
        visible: true,
        x: hover_pattern_x,
        y: hover_pattern_y,
        rp_index,
        comment_index
      },
      pattern_menu_reserved_flag:false,
    }, () => {
      var pattern_menu = document.getElementsByClassName('hover-pattern-menu')[0];
      if (hover_pattern_x + pattern_menu.offsetWidth + 230 > modal.offsetWidth && hover_pattern_y + pattern_menu.offsetHeight <= modal.offsetHeight){
        this.setState({
          hoverPatternMenu: {
            visible: true,
            x: main_menu.offsetLeft - pattern_menu.offsetWidth,
            y: hover_pattern_y,
            rp_index,
            comment_index
          },
          pattern_menu_reserved_flag:true,
        }, () => {
          this.setState({
            hoverPatternMenu: {
              visible: true,
              x: main_menu.offsetLeft - pattern_menu.offsetWidth,
              y: hover_pattern_y,
              rp_index,
              comment_index
            },
          })          
        })
      }
      if (hover_pattern_x + pattern_menu.offsetWidth + 230> modal.offsetWidth && hover_pattern_y + pattern_menu.offsetHeight > modal.offsetHeight){
        this.setState({
          hoverPatternMenu: {
            visible: true,
            x: main_menu.offsetLeft - pattern_menu.offsetWidth,
            y: hover_pattern_y - pattern_menu.offsetHeight + 30,
            rp_index,
            comment_index,            
          },
          pattern_menu_reserved_flag:true,
        }, () => {
          this.setState({
            hoverPatternMenu: {
              visible: true,
              x: main_menu.offsetLeft - pattern_menu.offsetWidth,
              y: hover_pattern_y - pattern_menu.offsetHeight + 30,
              rp_index,
              comment_index
            },
          })          
        })
      }
      if (hover_pattern_x + pattern_menu.offsetWidth + 230 <= modal.offsetWidth && hover_pattern_y + pattern_menu.offsetHeight > modal.offsetHeight){
        this.setState({
          hoverPatternMenu: {
            visible: true,
            x: hover_pattern_x,
            y: hover_pattern_y - pattern_menu.offsetHeight + 30,
            rp_index,
            comment_index,            
          },
          pattern_menu_reserved_flag:false,
        })
      }
    });
  }

  contextMenuAction = (rp_index, medi_index, type, comment_index) => {
    if (type === "amount_change") {
      if (this.state.data_json[rp_index].medicines == undefined) return;
      this.setState({
        isOpenAmountModal: true,
        medi_data: this.state.data_json[rp_index].medicines[medi_index],
      });
    } else if (type === "usage_change") {
      this.setState({
        isOpenUsageModal: true,
        medicine_kind: sortations.indexOf(
          this.state.data_json[rp_index].prescription_category
        ),
        modal_data: this.state.data_json[rp_index],
        usage_only: true
      });
    } else if (type === "med_change") {
      this.setState({
        isOpenMedicineModal: true,
        only_med: true,
        medicine_kind: sortations.indexOf(
          this.state.data_json[rp_index].prescription_category
        ),
        selected_medicine: this.state.data_json[rp_index].medicines[medi_index],
        rp_number: rp_index,
        change_med_index: medi_index,
      });
    } else if (type === "is_not_generic") {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[rp_index] };
      let medicines = data_json_item.medicines;
      medicines[medi_index].is_not_generic = medicines[medi_index].is_not_generic == 0 ? 1 : 0;
      data_json_item.medicines = medicines;
      data_json[rp_index] = data_json_item;
      this.setState({
        data_json,
      });
    } else if (type === "add_free_comment") {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[rp_index] };
      let free_comment = data_json_item.free_comment;
      if (free_comment === undefined) free_comment = [];
      let com_index = comment_index + 1;
      if(free_comment.length == 0 || comment_index === undefined) {
        free_comment.push("");
        com_index = free_comment.length - 1;
      }
      else free_comment.splice(comment_index + 1, 0, "");
      data_json_item.free_comment = free_comment;
      data_json[rp_index] = data_json_item;
      this.setState({
        data_json,
        selected_comment_index: com_index,
        selected_rp: rp_index,
      }, ()=>{
        if (document.getElementById("input_comment") != null) {
          let data_json = this.state.data_json;
          let comment_length =
            data_json[this.state.selected_rp].free_comment !== undefined &&
            data_json[this.state.selected_rp].free_comment != null &&
            data_json[this.state.selected_rp].free_comment.length > 0 &&
            data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
              ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
              : 0;
          this.setCaretPosition(document.getElementById("input_comment"),comment_length);
        }
      });
    } else if (type === "change_free_comment") {
      this.setState({
        selected_comment_index: comment_index,
        selected_rp: rp_index,
      }, ()=> {
        if (document.getElementById("input_comment") != null) {
          let data_json = this.state.data_json;
          let comment_length =
            data_json[this.state.selected_rp].free_comment !== undefined &&
            data_json[this.state.selected_rp].free_comment != null &&
            data_json[this.state.selected_rp].free_comment.length > 0 &&
            data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
              ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
              : 0;
          this.setCaretPosition(document.getElementById("input_comment"),comment_length);
        }
      });
    } else if (type === "delete_free_comment") {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[rp_index] };
      let free_comment = data_json_item.free_comment;
      free_comment.splice(comment_index, 1);
      data_json_item.free_comment = free_comment;
      data_json[rp_index] = data_json_item;
      this.setState({
        data_json,
        selected_rp: rp_index,
      });
    }
  };

  amountChange = (amount) => {
    if (this.state.medi_index !== "" && this.state.rp_index !== "") {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[this.state.rp_index] };
      let medicines = data_json_item.medicines;
      medicines[this.state.medi_index].amount = amount;
      data_json_item.medicines = medicines;
      data_json[this.state.rp_index] = data_json_item;
      this.setState({
        data_json,
        rp_index: "",
        medi_index: "",
        isOpenAmountModal: false,
      });
      this.setChangeFlag(1);
    }
  };

  lastPatternDelete() {
    this.setState(
      {
        confirm_message: "",
        isMakeScheduleModal: false,
        // confirm_type: "",
      },
      () => {
        if (this.state.confirm_action === "add_pattern") {
          this.addPattern();
        } else {
          this.updatePattern();
        }
      }
    );
  }

  selectRp = (rp_index) => {
    this.setState({
      selected_rp: rp_index,
      input_comment: false,
    });
  };

  inputUsage = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      isOpenUsageModal: true,
      medicine_kind: sortations.indexOf(
        this.state.data_json[this.state.selected_rp].prescription_category
      ),
      modal_data: this.state.data_json[this.state.selected_rp],
      rp_index: this.state.selected_rp,
    });
  };

  enableInputRpComment = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    let data_json = this.state.data_json;
    let data_json_item = { ...this.state.data_json[this.state.selected_rp] };
    let free_comment = data_json_item.free_comment;
    if (free_comment === undefined) free_comment = [];
    free_comment.push("");
    data_json_item.free_comment = free_comment;
    data_json[this.state.selected_rp] = data_json_item;
    this.setState({
      data_json,
      selected_comment_index: free_comment.length - 1,
      input_comment: true,
    }, () => {
      if (document.getElementById("input_comment") != null) {
        let data_json = this.state.data_json;
        let comment_length =
          data_json[this.state.selected_rp].free_comment !== undefined &&
          data_json[this.state.selected_rp].free_comment != null &&
          data_json[this.state.selected_rp].free_comment.length > 0 &&
          data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
            ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
            : 0;
        this.setCaretPosition(document.getElementById("input_comment"),comment_length);
      }
    });
  };

  setCaretPosition = (elem, caretPos) => {
    var range;
    if (elem != null) {
      if (elem.createTextRange) {
        range = elem.createTextRange();
        range.move("character", caretPos);
        range.select();
      } else {
        elem.focus();
        if (elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  };
  
  setRpComment = (index, e) => {
    let data_json = this.state.data_json;
    let value = e.target.value;
    data_json[this.state.selected_rp].free_comment[index] = value;
    this.setState({ data_json});
    this.setChangeFlag(1);
  };
  
  blueRpComment = () => {
    let data_json = this.state.data_json;
    let data_json_item = { ...this.state.data_json[this.state.selected_rp] };
    let free_comment = data_json_item.free_comment;
    if (free_comment.length > 0)
      free_comment = free_comment.filter(x=> x!= "");
    data_json[this.state.selected_rp].free_comment = free_comment;
    this.setState({selected_comment_index: -1, data_json});
    this.setChangeFlag(1);
  }

  selectPreset = (preset) => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    let data_json = this.state.data_json;
    if (preset.data_json === undefined || preset.data_json == null) return;
    let preset_data_json = preset.data_json;
    preset_data_json.map((item) => {
      let temp = {};
      Object.keys(item).map((index) => {
        temp[index] = item[index];
      });
      data_json.push(temp);
    });
    this.setState({
      data_json,
      isShowPresetList: false,
    });
    this.setChangeFlag(1);
  };

  OpenSetPrescriptListModal = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (
      this.state.preset_data === undefined ||
      this.state.preset_data == null ||
      this.state.preset_data.length < 1
    )
      return;
    this.setState({ isShowPresetList: true });
  };

  confirmReSchedule = () => {
    this.confirmCancel();
    var start_date = formatJapan(this.state.time_limit_from);
    var end_date = this.state.time_limit_to
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
        start_date +
        " ～ " +
        end_date +
        "\n  （" +
        weekday +
        "）",
    });
    this.modalBlack();
  };

  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
  };

  moveOtherPage = () => {
    this.setChangeFlag(0);
    this.confirmCancel();
    this.props.closeModal();
  };
  modalClose = () => {
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
      this.modalBlack();
    } else {
      this.props.closeModal();
    }
  };
  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }
  componentDidUpdate () {
    this.changeBackground();
  }
  initRedBorder = () => {
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('final_week_days_id');
  }
  changeBackground = () => {
    patternValidate('dial_prescription_pattern',this.state, 'background');
    removeRequiredBg("final_week_days_id");
  }
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    this.modalBlackBack();
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }

  closeConfirmModal = () => {
    this.confirmCancel();
    this.modalBlackBack();
    if (this.state.confirm_type == "edit_pattern") {
      this.editPattern();
      return;
    }
    this.props.closeModal();
  };
  modalBlack() {
    var base_modal = document.getElementsByClassName("prescript-pattern-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("prescript-pattern-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }

  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let { data_json } = this.state;
    let prescription_pattern = [];
    let message;
    if (this.state.prescription_pattern.length) {
      prescription_pattern = this.state.prescription_pattern.map(
        (item, index) => {
          let weekday = "";
          for (let i = 0; i < 7; i++) {
            weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
          }

          return (
            <>
              <Row
                className={this.state.selected_row === index ? "selected" : ""}
                onClick={this.editpatternConfirm.bind(this, index)}
              >
                <Col md="2">
                  {periodics[item.regular_prescription_number - 1]}
                </Col>
                <Col md="4">{weekday}</Col>
                <Col md="3">{formatDateSlash(item.time_limit_from)}</Col>
                <Col md="3">
                  {item.time_limit_to == null
                    ? "～ 無期限"
                    : formatDateSlash(item.time_limit_to)}
                </Col>
              </Row>
            </>
          );
        }
      );
    } else {
      message = (
        <div className="no-result">
          <span>登録された処方パターンがありません。</span>
        </div>
      );
    }
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal prescript-pattern-modal first-view-modal"
        id="prescript-pattern-modal"
      >
        <Modal.Header>
          <Modal.Title>処方パターン</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <div className="bodywrap" id = 'wrapper-body'>
              <Wrapper>
                <div className="button-area">
                  <div className="periodic-btn">
                    {periodics.map((item, key) => {
                      return (
                        <>
                          <RadioButton
                            id={`periodics_${key}`}
                            value={key}
                            label={item}
                            name="periodicises"
                            getUsage={this.changePeriodic.bind(this, key)}
                            checked={
                              this.state.regular_prescription_number === key
                            }
                          />
                        </>
                      );
                    })}
                  </div>

                  <div className="sortation-btn">
                    {sortations.map((item, key) => {
                      return (
                        <>
                          <RadioButton
                            id={`sortation_${key}`}
                            value={key}
                            label={item}
                            name="sortation"
                            getUsage={this.changeMedicineKind.bind(this, key)}
                            checked={this.state.medicine_kind === key}
                          />
                        </>
                      );
                    })}
                  </div>
                  <div className="take_comment-btn">
                    <RadioButton
                      id="take_btn"
                      label="服用"
                      value={0}
                      name="take_comment"
                      getUsage={this.inputUsage.bind(this)}
                      checked={this.state.take_comment === 0}
                    />
                    <RadioButton
                      id="comment_btn"
                      label="コメント"
                      value={1}
                      name="take_comment"
                      getUsage={this.enableInputRpComment.bind(this)}
                      checked={this.state.take_comment === 1}
                    />
                  </div>

                  <div className="prescription-set-btn">
                    <RadioButton
                      id="prescription_set"
                      label="処方セット"
                      name="prescription_set"
                      getUsage={this.OpenSetPrescriptListModal.bind(this)}
                      checked={this.state.prescription_set === 1}
                    />
                  </div>
                </div>
                <div className="main-area">
                  <div className="dial-list">
                    <DialDataBox>
                      {prescription_pattern}
                      {message}
                    </DialDataBox>
                  </div>
                  <div className="padding">
                    <Checkbox
                      label="期限切れも表示"
                      getRadio={this.getCheckedLast.bind(this)}
                      value={this.state.checkLastPeriod}
                      name="last"
                    />
                  </div>
                  <div className="dial-body" id = 'dial-body'>
                    <table
                      className="table-scroll table table-bordered"
                      id="code-table"
                    >
                      <tbody>
                        {data_json != undefined &&
                          data_json !== null &&
                          data_json.map((item, rp_index) => {
                            return (
                              <>
                                <tr
                                  className="set-title"
                                  key={rp_index + 1}
                                  onClick={this.selectRp.bind(this, rp_index)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="btn-area">
                                    <Button
                                      onClick={this.addMedicine.bind(
                                        this,
                                        rp_index,
                                        item.prescription_category
                                      )}
                                    >
                                      <Icon icon={faPlus} />
                                    </Button>
                                  </td>
                                  <td className="btn-area">
                                    <Button
                                      onClick={this.deleteRp.bind(
                                        this,
                                        rp_index
                                      )}
                                    >
                                      <Icon icon={faMinus} />
                                    </Button>
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ width: "5%" }}
                                  >
                                    {rp_index + 1}
                                  </td>
                                  <td className="text-left" colSpan={3}>
                                    {item.prescription_category}処方
                                  </td>
                                </tr>
                                {item.medicines.length > 0 &&
                                  item.medicines.map(
                                    (medi_item, medi_index) => {
                                      return (
                                        <tr
                                          key={medi_index}
                                          onContextMenu={(e) =>
                                            this.handleClick(
                                              e,
                                              rp_index,
                                              medi_index
                                            )
                                          }
                                          onClick={this.selectRp.bind(
                                            this,
                                            rp_index
                                          )}
                                          className={
                                            this.state.selected_rp === rp_index
                                              ? "selected-rp"
                                              : ""
                                          }
                                          style={{ cursor: "pointer" }}
                                        >
                                          <td className="btn-area" />
                                          <td className="btn-area">
                                            <Button
                                              onClick={this.deleteMedicine.bind(
                                                this,
                                                rp_index,
                                                medi_index
                                              )}
                                            >
                                              <Icon icon={faMinus} />
                                            </Button>
                                          </td>
                                          <td style={{ width: "5%" }} />
                                          <td
                                            className="text-left"
                                            style={{ width: "35%" }}
                                          >
                                            {medi_item.item_name}
                                          </td>
                                          <td
                                            className="text-center amount-item"
                                            style={{ width: "3rem" }}
                                          >
                                            {medi_item.amount}
                                          </td>
                                          <td className="text-left">
                                            <div className="ml-1">
                                              {medi_item.unit}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                <tr
                                  onContextMenu={(e) =>
                                    this.handleClick(e, rp_index)
                                  }
                                  className={
                                    this.state.selected_rp === rp_index
                                      ? "selected-rp"
                                      : ""
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="btn-area" colSpan={2} />
                                  <td />
                                  <td className="text-left" colSpan={4}>
                                    {item.usage_name}
                                    {item.days !== undefined &&
                                    item.days !== null &&
                                    item.disable_days_dosing == 0
                                      ? "(" +
                                        item.days +
                                        (item.prescription_category == "頓服"
                                          ? "回分)"
                                          : "日分)")
                                      : ""}
                                  </td>
                                </tr>
                                {item.free_comment !== undefined && item.free_comment.length > 0 && item.free_comment.map((comment_item, comment_index)=>{
                                  return (
                                    <>
                                      <tr onContextMenu={(e) =>this.handleClick(e, rp_index, undefined, comment_index)} key={comment_index}>
                                        <td colSpan={6} className="rp-comment">
                                          {this.state.selected_rp === rp_index && this.state.selected_comment_index == comment_index ? (
                                            <InputBoxTag
                                              label=""
                                              id={"input_comment"}
                                              type="text"
                                              getInputText={this.setRpComment.bind(this, comment_index)}
                                              value={comment_item}
                                              onBlur={this.blueRpComment}
                                              autofocus={true}
                                            />
                                          ):(
                                            <>
                                              <div style={{ marginLeft: "6.875rem" }}>
                                                {comment_item}
                                              </div>
                                            </>
                                          )}
                                        </td>
                                      </tr>
                                    </>
                                  )
                                })}
                              </>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="dial-oper">
                    <Row className="coment-area">
                      <InputWithLabelBorder
                        label="コメント"
                        type="text"
                        id="comment_id"
                        getInputText={this.getComent.bind(this)}
                        diseaseEditData={this.state.comment}
                      />
                    </Row>
                    <Row>
                      <div className="area1">
                        <div className="gender">
                          <div>
                            <label className="gender-label" style={{cursor:"text"}}>曜日</label>
                            <div id="final_week_days_id" className='d-flex transparent-border' style={{width:'18rem'}}>
                            <>
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
                            </>
                          </div>
                          </div>
                          <div className="flex">
                            <div className="selet-day-check">
                              <Checkbox
                                label="透析曜日以外も表示"
                                getRadio={this.getCheckAnotherDay.bind(this)}
                                value={this.state.checkAnotherDay}
                                name="schedule"
                              />
                            </div>
                            {/*<div className="selet-day-check">*/}
                            {/*<Checkbox*/}
                            {/*label="毎週の処方か"*/}
                            {/*getRadio={this.getCheckAllDay.bind(this)}*/}
                            {/*value={this.state.is_weekly}*/}
                            {/*name="schedule1"*/}
                            {/*/>*/}
                            {/*</div>*/}
                            <div className="selet-day-check">
                              <Checkbox
                                label="自動スケジュールを展開"
                                getRadio={this.disableSchedule.bind(this)}
                                value={this.state.disable_auto_schedule}
                                name="disable_schedule"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="period">
                          <div className="state-date">
                            <InputWithLabelBorder
                              label="期限"
                              type="date"
                              getInputText={this.gettime_limit_from}
                              diseaseEditData={this.state.time_limit_from}
                              id='time_limit_from_id'
                            />
                          </div>
                          <div className="pd-15">～</div>
                          <InputWithLabelBorder
                            label=""
                            type="date"
                            getInputText={this.gettime_limit_to}
                            diseaseEditData={this.state.time_limit_to}
                            id='time_limit_to_id'
                          />
                        </div>
                      </div>
                      <div className="input-data-area">
                        <InputWithLabel
                          label="入力日"
                          type="date"
                          getInputText={this.getInputdate}
                          diseaseEditData={this.state.entry_date}
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
                            id="entry_time_id"
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
                        authInfo.doctor_number > 0 ? (
                          <InputWithLabel
                            label="指示者"
                            type="text"
                            isDisabled={true}
                            diseaseEditData={this.state.directer_name}
                          />
                        ) : (
                          <>
                            <div
                              className="direct_man cursor-input"
                              onClick={(e)=>this.showDoctorList(e).bind(this)}
                            >
                              <InputWithLabel
                                label="指示者"
                                isDisabled={true}
                                type="text"
                                diseaseEditData={this.state.directer_name}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </Row>
                    {this.state.final_entry_date !== "" && (
                      <div className={"flex final-info"}>
                        {"最終入力日時：" +
                          this.state.final_entry_date +
                          " " +
                          this.state.final_entry_time +
                          "　" +
                          "　入力者：" +
                          this.state.final_entry_name +
                          "　" +
                          "　指示者：" +
                          (this.state.final_doctor_name != undefined
                            ? this.state.final_doctor_name
                            : "")}
                      </div>
                    )}
                  </div>
                </div>
              </Wrapper>
            </div>
            <div className="footer footer-buttons">
              <Button className="delete-btn" onClick={this.delete}>削除</Button>
              <Button
                className={
                  (this.state.data_json == null ||
                  this.state.data_json == [] ||
                  this.state.data_json.length == 0 ? "disable-btn" : "cancel-btn")
                }
                onClick={this.clear}
              >
                クリア
              </Button>
              <Button className="cancel-btn" onClick={this.modalClose}>キャンセル</Button>
                <Button className="red-btn" onClick={this.update}>変更</Button>
                <Button className="red-btn" onClick={this.add.bind(this)}>追加</Button>
            </div>
          </Card>
          {this.state.isOpenMedicineModal && (
          <PrescriptMedicineSelectModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            medicine_type_name={""}
            modal_data={[]}
            rp_number={this.state.rp_number}
            is_open_usage={this.state.is_open_usage}
            medicine_kind={sortations[this.state.medicine_kind]}
            selected_medicine={this.state.selected_medicine}
          />
        )}
        {this.state.isOpenUsageModal && (
          <SelectUsageModal
            handleOk={this.handleUsageOk}
            closeModal={this.closeModal}
            medicine_kind={this.state.medicine_kind}
            modal_data={this.state.modal_data}
            usage_only={this.state.usage_only}
          />
        )}

        {this.state.isClearConfirmModal !== false &&
          this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.clearPattern.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
        {this.state.isMinusConfirmModal !== false &&
          this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmDeleteRp.bind(
                this,
                this.state.sel_del_rp,
                this.state.sel_del_med
              )}
              confirmTitle={this.state.confirm_message}
            />
          )}
        {this.state.isAddConfirmModal !== false &&
          this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.addPattern.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}

        {this.state.isUpdateConfirmModal !== false &&
          this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmReSchedule.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
        {this.state.isMakeScheduleModal !== false &&
          this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.lastPatternDelete.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
        {this.state.isReScheduleConfirm !== false &&
          this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.updatePattern.bind(this, false)}
              confirmOk={this.updatePattern.bind(this, true)}
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
        {this.state.isShowPresetList !== false && (
          <DialSelectMasterModal
            selectMaster={this.selectPreset}
            closeModal={this.closeModal}
            MasterCodeData={this.state.preset_data}
            MasterName="処方セット"
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
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.isConfirmComplete !== false && (
          <CompleteStatusModal message={this.state.complete_message} />
        )}
        {this.state.isOpenCalcModal ? (
          <CalcDial
            calcConfirm={this.amountChange}
            units={this.state.calcUnit}
            calcCancel={this.calcCancel}
            daysSelect={false}
            daysInitial={this.state.calcInit}
            daysLabel=""
            daysSuffix=""
            maxAmount={100000}
            calcTitle={this.state.calcTitle}
            calcInitData={this.state.calcInit}
          />
        ) : (
          ""
        )}
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isDeleteConfirmModal !== false &&
          this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.deletePattern.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}          
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}           
        </Modal.Body>
        <HoverPatternMenu
          {...this.state.hoverPatternMenu}          
          parent={this}
          word_pattern_list = {this.state.word_pattern_list}
        />
        <HoverWordMenu
          {...this.state.hoverWordMenu}
          parent={this}
          selected_word_list = {this.state.selected_word_list}
        />
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          rp_index={this.state.rp_index}
          medi_index={this.state.medi_index}
          comment_index={this.state.comment_index}
        />
      </Modal>
    );
  }
}
Prescription.contextType = Context;

Prescription.propTypes = {
  history: PropTypes.object,
  system_patient_id: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
};

export default Prescription;
