import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "../../../../atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import RadioButton from "~/components/molecules/RadioInlineButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import InputWithLabelBorder from "../../../../molecules/InputWithLabelBorder";
import { Row } from "react-bootstrap";
import {
  formatJapanDate,
  formatTimePicker,
  formatDateSlash,
  formatTime,
  formatJapan,
  formatDateLine,
  formatTimeIE,
} from "~/helpers/date";
import PresetPrescription from "../../Master/PresetPrescription";
import MakePrescriptByHistory from "./MakePrescriptByHistory";
import PrescriptMedicineSelectModal from "../../modals/PrescriptMedicineSelectModal";
import SelectUsageModal from "../../modals/SelectUsageModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import * as apiClient from "~/api/apiClient";
import * as methods from "~/components/templates/Dial/DialMethods";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import Checkbox from "../../../../molecules/Checkbox";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import AmountInputModal from "../../modals/AmountInputModal";
import axios from "axios";
import PrescriptionPreviewModalDom from "~/components/templates/Dial/modals/PrescriptionPreviewModalDom";
import PrescriptionPatternConfirmModal from "../../modals/PrescriptionPatternConfirmModal";
import CalcDial from "~/components/molecules/CalcDial";
import { patternValidate } from '~/helpers/validate';
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';
import $ from 'jquery';
import {
  addRedBorder,
  removeRequiredBg,
  removeRedBorder,
  toHalfWidthOnlyNumber,
  setDateColorClassName
} from '~/helpers/dialConstants';
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import PrescriptionScheduleDeployModal from "../../Schedule/modals/PrescriptionScheduleDeployModal";
import Spinner from "react-bootstrap/Spinner";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 15px;
  margin-right: 5px;
`;
const DoubleModal = styled.div`
  font-family: NotoSansJP;
  line-height: 1.33;
  letter-spacing: 0.4px;
  padding: 4px 4px 4px 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 72vh;
  overflow-y: auto;
  float: left;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .left-area {
    .react-datepicker {
      width: 98%;
    }
  }
  .disable-item {
    label{
      background: #ddd;
      cursor: default;
    }
  }
  .react-datepicker-wrapper {
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 14px;
        width: 100%;
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

  .react-datepicker {
    .react-datepicker__day--highlighted-custom-1 {
      border-radius: 0.3rem;
      background-color: blue;
      color: #fff;
    }
    .react-datepicker__day--highlighted-custom-2 {
      color: black;
      border-radius: 0.3rem;
      background: pink;
    }
    .react-datepicker__day--highlighted-custom-3 {
      color: black;
      border-radius: 0.3rem;
      background: green;
    }
    .react-datepicker__day--selected {
      background: #899cac;
    }
  }

  .radio-btn label {
    font-size: 16px;
    width: 75px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    padding: 4px 5px;
    text-align: center;
    margin: 0 5px;
    margin-bottom: 5px;
  }
  .left-area {
    width: 30%;
    .cur_month {
      text-align: center;
      font-size: 16px;
    }
    .show-box {
      width: 15px;
      margin: 3px 0 3px 0;
      border: 1px solid black;
    }
    .w60 {
      width: 60%;
      div {
        padding-left: 5px;
      }
    }
    .w40 {
      width: 40%;
      div {
        padding-left: 5px;
      }
    }
    .pink {
      background-color: pink;
    }
    .blue {
      background-color: blue;
    }
    .green {
      background-color: green;
    }
    .yellow {
      background-color: yellow;
    }
    .sortation-btn {
      margin-top: 5px;
      .radio-btn label {
        width: calc(100% - 15px);
        padding: 0;
      }
    }
    .history-btn {
      margin-top: 5px;
      button {
        width: 45%;
        margin-left: 2.5%;
      }
    }
  }
  .right-area {
    width: 70%;
    .patient_info {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 10px;
    }
    .no-tag {
      width: 100px;
    }
    .no-tag-area {
      width: calc(100% - 320px);
      .radio-btn label {
        width: auto;
        padding: 5px 10px;
      }
    }
    .input-info-area {
      width: 320px;
    }
    .periodic-btn {
      .radio-btn label {
        padding: 0;
        margin: 0;
        margin-right: 5px;
      }
    }
    .edit-btn {
      button {
        margin-left: 5px;
      }
      .div-button{
        color: gray;
      }
    }
    .dial-body {
      width: 100%;
      margin-top: 5px;
      height: 60vh;
      overflow-y: auto;
      border: solid 1px rgb(206, 212, 218);
      padding: 10px;
      .react-grid-Canvas {
        height: 300px !important;
      }
      td {
        padding: 0 5px 0 5px;
        button {
          min-width: 50px;
          text-align: center;
          background: #ddd;
          border: solid 1px #aaa;
          margin: 0px;
        }
        line-height: 35px;
      }
      .set-title {
        td {
          background-color: blue;
          color: white;
        }
      }
      .btn-area {
        line-height: 15px;
        width: 50px;
        background-color: white !important;
        padding: 0;
      }
    }
    .dial-oper {
      .row {
        margin: 0px;
      }
      .input-data-area1 {
        .react-datepicker-wrapper {
          width: 250px;
        }
        flex: none;
        label {
          text-align: right;
          width: 100px;
          font-size: 16px;
        }
        .input-time {
          margin-top: 10px;
          display: flex;
          label {
            padding-top: 10px;
            margin-right: 8px;
          }
        }
      }
      .input-data-area2 {
        flex: none;
        label {
          text-align: right;
          width: 100px;
          font-size: 16px;
          cursor: text !important;
        }
        input {
          width: 250px;
        }
      }
      .coment-area {
        .label-title {
          width: 66px;
          text-align: right;
          font-size:16px;
        }
        input {
          width:calc(100% - 70px);
        }
      }
    }
  }
  .gender {
    display:flex;
    font-size: 12px;
    .gender-label {
      width: 60px;
      margin-right: 8px;
      text-align: right;
      font-size: 18px;
      height:38px;
      line-height:38px;
      margin-bottom: auto;
      margin-top: auto;

    }
  }
  .period {
    label {
      width: 0;
    }
    display: flex;
    .pd-15 {
      padding: 15px 0 0 7px;
    }
    .w55 {
      width: 55px;
    }
  }
  .radio-group-btn label {
    width: 2rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin: 0;
    padding: 0;
    height:38px;
    line-height:38px;
    margin-right:0.5rem;
  }
  .radio-group-btn:last-child {
    label {
      margin-right:0;
    }
  }
  .period {
    display: flex;
    .state-date {
      .label-title {
        width: 60px;
        text-align: right;
        margin-right: 8px;
        font-size: 18px;
        margin-top: 5px;
        margin-bottom: 0;
      }
      input {width:7.2rem;}
    }
    .end-date {
      .label-title {
        width:0;
      }
      input {width:7.2rem;}
    }
  }
  .selet-day-check {
    label {
      width: 100%;
      padding: 10px 0 0 20px;
      font-size: 16px;
      input {
        top: 1px;
      }
    }
  }
  .no-dial-day {
    width: 2rem;
    margin-right:0.5rem;
    display: inline-block;
  }

  .selected-rp {
    background: #eee;
  }
  .rp-comment {
    label {
      margin-top: 0;
      width: 110px;
      text-align: right;
    }
    input {
      margin-top: -8px;
    }
    .div-rp-comment{
    }
  }
`;
const ContextMenuUl = styled.ul`
  margin-bottom: 0;
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
    white-space: normal;
    -webkit-transition: all 0.3s;
    .blue-text {
      color: blue;
    }
    max-width:230px;
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
`;

const TooltipTitleMenuUl = styled.ul`
  margin-bottom: 0px !important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 15px;
    position: absolute;
    text-align: left;
    overflow-y: auto;
    max-height: 35rem;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 34rem;
    border: 2px solid #807f7f;
    border-radius: 12px;
    margin-bottom: 0px !important;
  }
  font-size: 1rem;
`;
const periodics1 = [
  "【臨時処方】",
  "【定期処方1】",
  "【定期処方2】",
  "【定期処方3】",
];
const TooltipTitle = ({ visible, x, y, title }) => {
  if (visible) {
    let regular_prescription_schedule = title;
    return (
      <TooltipTitleMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {regular_prescription_schedule !== undefined &&
            regular_prescription_schedule != null &&
            Object.keys(regular_prescription_schedule).length > 0 &&
            Object.keys(regular_prescription_schedule).map((idx) => {
              var pres_item = regular_prescription_schedule[idx];
              return (
                <>
                  {pres_item != null && pres_item.data_json.length > 0 && (
                    <>
                      <div>
                        {pres_item.regular_prescription_number != null &&
                          periodics1[pres_item.regular_prescription_number]}
                      </div>
                      {pres_item.data_json.map((rp_item) => {
                        return (
                          <div key={rp_item} className="pres-area">
                            {rp_item.medicines.length > 0 &&
                              rp_item.medicines.map((medi_item, medi_key) => {
                                return (
                                  <>
                                    {medi_key < rp_item.medicines.length - 1 ? (
                                      <div style={{ fontSize: "0.9rem" }}>
                                        {medi_item.item_name} {medi_item.amount}{" "}
                                        {medi_item.unit} {medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}&nbsp;{" "}
                                      </div>
                                    ) : (
                                      <span>
                                        {medi_item.item_name} {medi_item.amount}{" "}
                                        {medi_item.unit}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}
                                      </span>
                                    )}
                                  </>
                                );
                              })}
                            <span>
                              {rp_item.usage_name !== undefined
                                ? " " + rp_item.usage_name
                                : " "}
                              {rp_item.days !== undefined &&
                              rp_item.days !== null &&
                              rp_item.disable_days_dosing == 0
                                ? "(" +
                                  rp_item.days +
                                  (rp_item.prescription_category == "頓服"
                                    ? "回分)"
                                    : "日分)")
                                : ""}
                            </span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              );
            })}
        </ul>
      </TooltipTitleMenuUl>
    );
  } else {
    return null;
  }
};
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
                <div onClick={() => parent.contextMenuAction(rp_index, medi_index, "med_change")} onMouseOver = {e => parent.outMainHover(e)}>
                  薬剤変更
                </div>
              </li>
              <li>
                <div onMouseOver = {e => parent.outMainHover(e)} onClick={() =>parent.contextMenuAction(rp_index,medi_index,"amount_change")}>
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
          <li>
            <div onClick={() => parent.contextMenuAction(rp_index, medi_index, "usage_change")} onMouseOver = {e => parent.outMainHover(e)}>
              用法・日数/回数変更
            </div>
          </li>
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

const periodics = ["臨時", "定期1", "定期2", "定期3"];

const sortations = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];

class EditPrescript extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let prescription_item =
      this.props.schedule_item !== undefined && this.props.schedule_item != null
        ? this.props.schedule_item
        : null;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      regular_prescription_number: this.props.editPrescriptType != undefined && this.props.editPrescriptType == 1 ? 0 : 1,
      can_delete: this.props.schedule_item !== undefined && this.props.schedule_item != null && this.props.schedule_item.length > 0 ? 1 : 0,
      directer_name: "",
      medicine_kind: "",
      take_comment: "",
      prescription_set: "",
      schedule_date:this.props.schedule_date != undefined ? new Date(this.props.schedule_date): new Date(), //日付表示
      isOpenSetPrescriptListModal: false,
      isOpenMakePrescriptByHistoryModal: false,
      isPatternSetModal: false,
      isBackConfirmModal: false,
      confirm_alert_title:'',
      isOpenMedicineModal: false,
      isOpenUsageModal: false,
      is_doctor_consented: 0,
      checkSchedule: 0,
      data_json: [],
      rp_number: 0,
      prescription_category: "内服",
      usage_code: "",
      dialdays: "",
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
      isShowDoctorList: false,
      prescription_item,
      patient_name:
        this.props.patientInfo !== undefined && this.props.patientInfo !== null
          ? this.props.patientInfo.patient_name
          : "",
      patient_number:
        this.props.patientInfo !== undefined && this.props.patientInfo !== null
          ? this.props.patientInfo.patient_number
          : "",
      system_patient_id:
        this.props.patientInfo !== undefined && this.props.patientInfo !== null
          ? this.props.patientInfo.system_patient_id
          : 0,
      entry_name:
        authInfo != undefined && authInfo != null ? authInfo.name : "",
      entry_date: new Date(),
      entry_time: new Date(),
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      instruction_doctor_number: 0,
      is_pattern: 0,
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
      time_limit_from:this.props.schedule_date != undefined ? new Date(this.props.schedule_date): new Date(),
      is_weekly: false,
      final_week_days: 0,
      isMakeScheduleModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_type: "",
      complete_message: "",
      rp_index: "",
      medi_index: "",
      modal_data: null,
      isOpenAmountModal: false,
      openEditMultisetModal: false,
      selected_rp: "",
      input_comment: false,
      isShowPresetList: false,
      isOpenAllClearConfirm: false,
      preset_data: null,
      isPreviewModal: false,
      isConfirmComplete: false,
      from_karte: props.from_karte != undefined ? props.from_karte : 0,
      highlightWithRanges: [
        { "react-datepicker__day--highlighted-custom-1": [] },
        { "react-datepicker__day--highlighted-custom-2": [] },
        { "react-datepicker__day--highlighted-custom-3": [] },
      ],
      isPatternConfirmModal: false,
      time_limit_to: this.props.time_limit_to,
      isOpenCalcModal: false,
      isMinusConfirmModal: false,
      calcUnit: "",
      calcTitle: "",
      alert_message: '',
      alert_messages: '',
      confirm_deploy_message: '',
      is_loaded: false,
    };
    this.origin_pres_item = null;
    let dial_pattern_validate = sessApi.getObject("init_status").dial_pattern_validate;
    this.free_comment_max = 30;
    this.free_comment_err_msg = "RPのコメントは30文字以下で入力してください。";
    if (dial_pattern_validate !== undefined && dial_pattern_validate.dial_prescription_pattern !== undefined &&
      dial_pattern_validate.dial_prescription_pattern.free_comment !== undefined ) {
      this.free_comment_max = dial_pattern_validate.dial_prescription_pattern.free_comment.length;
      this.free_comment_err_msg = dial_pattern_validate.dial_prescription_pattern.free_comment.overflow_message != "" ?
        dial_pattern_validate.dial_prescription_pattern.free_comment.overflow_message : this.free_comment_err_msg;
    }
    // flat if has tooltip
    this.hasTooltip = 0;
    this.change_flag = 0;
    this.bulk_deployment = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").prescription_schedule_bulk_deployment_by_select_the_day_of_the_week;
    this.bulk_deployment_day = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").prescription_schedule_bulk_deployment_one_day;
    let prescription_inspection_doctor_mode = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").prescription_inspection_doctor_mode;
    this.prescription_inspection_doctor_mode = prescription_inspection_doctor_mode != undefined && prescription_inspection_doctor_mode != '' ? prescription_inspection_doctor_mode : 0;
  }

  async componentDidMount() {
    await this.getWordInfo();
    await this.setDoctors();
    await this.getStaffs();
    let preset_data = await this.getPresetMaster();
    let schedule_dates = await this.getScheduleDates();
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    if(this.props.schedule_date == undefined){
      state_data['schedule_date'] = new Date(server_time);
      state_data['time_limit_from'] = new Date(server_time);
    }
    let { highlightWithRanges } = this.state;
    highlightWithRanges = [
      {
        "react-datepicker__day--highlighted-custom-1":
          schedule_dates.regular_days,
      },
      {
        "react-datepicker__day--highlighted-custom-2":
          schedule_dates.temporary_days,
      },
      {
        "react-datepicker__day--highlighted-custom-3":
          schedule_dates.regular_temporary_days,
      },
    ];
    state_data['preset_data'] = preset_data;
    state_data['highlightWithRanges'] = highlightWithRanges;
    state_data['over_data'] = schedule_dates.all_data;
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
    if (this.state.system_patient_id > 0) {
      await this.getPrescriptionInfo(this.state.system_patient_id,this.props.schedule_date);
      await this.getDialDays(this.state.system_patient_id);
    }
    this.setState({is_loaded: true});
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

  getScheduleDates = async () => {
    let path = "/app/api/v2/dial/schedule/prescription_date_search";
    let { data } = await axios.post(path, {
      params: { system_patient_id: this.state.system_patient_id },
    });
    let regular_days = data.regular_days;
    let temporary_days = data.temporary_days;
    let regular_temporary_days = data.regular_temporary_days;
    let all_data = data.all_data;
    regular_days = regular_days.map((item) => {
      return new Date(item);
    });
    temporary_days = temporary_days.map((item) => {
      return new Date(item);
    });
    regular_temporary_days = regular_temporary_days.map((item) => {
      return new Date(item);
    });
    return { regular_days, temporary_days, regular_temporary_days, all_data };
  };

  getPresetMaster = async () => {
    let path = "/app/api/v2/dial/master/prescriptionSet_search";
    let { data } = await axios.post(path, { params: { is_enabled: 1, order:"sort_number" } });
    return data;
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

  async getPrescriptionInfo(patient_id, schedule_date) {
    if (this.state.from_karte === 1 && this.state.prescription_item != undefined && this.state.prescription_item != null) {
      this.setPrescription(this.state.prescription_item[0]);
      return;
    } // if open from karte data_json set to empty  2020-04-03 added
    if (this.state.from_karte == 1 && this.state.change_regular_number) {
      this.setState({prescription_item: this.props.schedule_item});
      return;
    }
    let path = "/app/api/v2/dial/schedule/prescription_search";
    const post_data = {
      patient_id: patient_id,
      schedule_date,
    };
    if (this.props.editPrescriptType != undefined && this.props.editPrescriptType == 1) {
      post_data.is_temporary = 1;
    } else if (this.props.editPrescriptType == 0) {
      post_data.is_temporary = 0;
    }
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res.length > 0) {
          this.setState({ prescription_item: res, can_delete: 1 });
          this.setPrescription(res[res.length - 1]);
          this.origin_pres_item = this.prescriptionCopy(res);
        } else {
          this.setPrescription(null);
        }
        if (this.props.editPrescriptType) {
          let return_value = res.filter((item) => {
            if (item.regular_prescription_number === 0) {
              return item;
            }
          });
          this.setState({
              is_temporary: 1,
              regular_prescription_number: 0,
              can_delete: return_value != null && return_value.length > 0 ? 1 : 0
            }, () => {
              this.setPrescription(return_value[0]);
            }
          );
          return;
        }
      })
      .catch(() => {});
  }

  changePeriodic = (value) => {
    if (this.state.from_karte == 1 && this.props.change_regular_number != true) return;
    if (this.props.editPrescriptType == 1 && value != 0) return;
    else if (this.props.editPrescriptType == 0 && value == 0) return;
    if (this.state.prescription_item !== undefined && this.state.prescription_item != null && this.state.prescription_item.length > 0 && this.props.change_regular_number) {
      let regular_numers = [];
      this.state.prescription_item.map(item=>{
        regular_numers.push(item.regular_prescription_number);
      });
      if (regular_numers.indexOf(value) == -1) return;
    }
    if(this.props.change_regular_number && (this.state.prescription_item === undefined || this.state.prescription_item == null || this.state.prescription_item.length === 0)) return;
    this.setState({
      regular_prescription_number: value,
      is_temporary: value == 0 ? 1 : 0
    }, () => {
      let { prescription_item } = this.state;
      if (prescription_item === undefined || prescription_item === null) return;
      if (Array.isArray(prescription_item)) {
        let return_value = prescription_item.filter((item) => {
          if (item.regular_prescription_number === value) {
            return item;
          }
        });
        this.setPrescription(return_value[0]);
      } else {
        if (prescription_item.regular_prescription_number !== value) {
          this.setPrescription(null);
        } else {
          this.setPrescription(prescription_item);
        }
      }
    });
  };

  makeSchedule = () => {
    this.updatePattern();
    this.confirmCancel();
  };

  confirmCancel() {
    this.setState({
      isMakeScheduleModal: false,
      isUpdateConfirmModal: false,
      isOpenAllClearConfirm: false,
      isPatternSetModal: false,
      isBackConfirmModal: false,
      isMinusConfirmModal: false,
      confirm_message: "",
      confirm_type: "",
      confirm_deploy_message: "",
      confirm_alert_title:''
    });
    this.modalBlackBack();
  }

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
    this.modalBlackBack();
  };

  openAllClearItem = () => {
    this.setState({
      isOpenAllClearConfirm: true,
      confirm_message: "入力中の処方をクリアしますか？",
    });
    this.modalBlack();
  };

  clearAllItem = () => {
    this.change_flag = 1;
    this.confirmCancel();
    if (this.props.from_karte == 1) {
      let data_json = this.state.data_json;
      data_json.map((rp_item, rp_index)=>{
        data_json[rp_index].is_deleted = 1;
        let medicines = rp_item.medicines;
        medicines.map((med_item, medi_index)=>{
          if (med_item.is_original == 1) {
            med_item.is_deleted = 1;
          } else {
            medicines.splice(medi_index, 1);
          }
        });
        if (medicines.length > 0)
          data_json[rp_index].medicines = medicines;
      });
      this.setState({data_json});
      return;
    }
    this.setState({
      data_json: [],
      rp_number: 0,
      is_open_usage: 0,
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
      regular_prescription_number:
        this.props.editPrescriptType === 1
          ? 0
          : this.state.regular_prescription_number,
    });
  };

  setPrescription(sch_data) {
    if (sch_data === undefined || sch_data === null) {
      this.setState({
        data_json: [],
        rp_number: 0,
        is_open_usage: 0,
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
        regular_prescription_number:
          this.props.editPrescriptType === 1
            ? 0
            : this.state.regular_prescription_number,
      });
      return;
    }
    let another_day = false;
    let final_week_days = {};
    var weekday = parseInt(sch_data.weekday);
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
    this.setState({
      data_json: sch_data !== undefined ? sch_data.data_json : {},
      comment: sch_data.comment,
      regular_prescription_number: sch_data.regular_prescription_number,
      number: sch_data.schedule_number,
      schedule_date:
        sch_data.schedule_date !== undefined && sch_data.schedule_date != null
          ? new Date(sch_data.schedule_date)
          : this.state.schedule_date,
      time_limit_from:
        sch_data.schedule_date !== undefined && sch_data.schedule_date != null
          ? new Date(sch_data.schedule_date)
          : this.state.schedule_date,
      is_temporary: sch_data.is_temporary,
      is_updated: sch_data.is_updated,
      is_completed: sch_data.is_completed,
      completed_by: sch_data.completed_by,
      completed_at: sch_data.completed_at,
      system_patient_id: sch_data.system_patient_id,
      final_entry_date:
        sch_data.updated_at != undefined && sch_data.updated_at !== null
          ? formatDateSlash(new Date(sch_data.updated_at.split(" ")[0]))
          : "",
      final_entry_time:
        sch_data.updated_at != undefined && sch_data.updated_at !== null
          ? formatTime(formatTimePicker(sch_data.updated_at.split(" ")[1]))
          : "",
      final_entry_name:
        this.state.staff_list_by_number != undefined &&
        this.state.staff_list_by_number != null &&
        sch_data.updated_by !== 0
          ? this.state.staff_list_by_number[sch_data.updated_by]
          : "",
      final_doctor_name:
        sch_data.instruction_doctor_number != null &&
        this.state.doctor_list_by_number != undefined
          ? this.state.doctor_list_by_number[sch_data.instruction_doctor_number]
          : "",
      current_pattern_number: sch_data.pattern_number,
      detail_number: sch_data.detail_number,
      is_deleted: sch_data.is_deleted !== undefined ? sch_data.is_deleted : 0,
      final_week_days: weekday,
      checkalldays: final_week_days,
    });
  }
  
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
    this.change_flag = 1;
    if (e == undefined){
      this.setState({
        entry_time:value,
        input_time_value:formatTime(value)
      })
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
  }

  getInputdate = (value) => {
    this.setState({ entry_date: value });
    this.change_flag = 1;
  };

  getInputMan = (e) => {
    this.setState({ entry_name: e.target.value });
    this.change_flag = 1;
  };

  getComent = (e) => {
    this.setState({ comment: e.target.value });
    this.change_flag = 1;
  };

  getDirectMan = (e) => {
    this.setState({ directer_name: e.target.value });
    this.change_flag = 1;
  };

  changeMedicineKind = (value) => {
    this.setState({ medicine_kind: value });
  };

  changeTakeComment = (value) => {
    this.setState({ take_comment: value });
    this.change_flag = 1;
  };

  getDate = (value) => {
    this.setState({ schedule_date: value });
  };

  OpenSetPrescriptListModal = () => {
    if (
      this.state.preset_data === undefined ||
      this.state.preset_data == null ||
      this.state.preset_data.length < 1
    )
      return;
    this.setState({ isShowPresetList: true });
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  };

  OpenMakePrescriptByHistoryModal = () => {
    this.setState({ isOpenMakePrescriptByHistoryModal: true });
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  };

  closeModal = () => {
    this.setState({
      isOpenSetPrescriptListModal: false,
      isOpenMakePrescriptByHistoryModal: false,
      isOpenAmountModal: false,
      isShowPresetList: false,
      isPreviewModal: false,
      isPatternConfirmModal: false,
      openEditMultisetModal: false,
      temp_data_json: undefined,
      temp_current_pattern_number: undefined,
      alert_messages: ""
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
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  };

  closeMedicineModal = () => {
    this.setState({ 
      isOpenMedicineModal: false,
      change_med_index: null,
      selected_medicine: null,
  });
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  };

  closeUsageModal = () => {
    this.setState({ isOpenUsageModal: false });
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  };

  changeMedicineKind = (value) => {
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
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  };

  addMedicine = (value, prescription_category) => {
    this.setState({
      rp_number: value,
      prescription_category,
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
    this.change_flag = 1;
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  };

  handleOk = (medicine_data, rp_number, is_open_usage) => {
    if (is_open_usage === 1) {
      let data_json_item = { ...this.state.data_json_item };
      let medicine = { ...medicine_data };
      data_json_item.medicines.push(medicine);
      this.setState({
        data_json_item,
        isOpenMedicineModal: false,
        isOpenUsageModal: true,
      });
      this.change_flag = 1;
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
        if (medicines !== undefined) {
          // medicines = [];
        medicines.push(medicine_data);
        }
      }
      data_json_item.medicines = medicines;
      data_json[rp_number] = data_json_item;
      this.setState({
        data_json,
        isOpenMedicineModal: false,
      });
      this.change_flag = 1;
      var base_modal = document.getElementsByClassName(
        "edit-prescript-modal"
      )[0];
      if (base_modal !== undefined && base_modal != null)
        base_modal.style["z-index"] = 1050;
    }
  };

  handleUsageOk = (usage_data) => {
    this.change_flag = 1;
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
      data_json_item.prescription_category = this.state.prescription_category;
      // data_json_item.rp_comment = this.state.data_json[this.state.rp_index].rp_comment;
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
            free_comment: this.state.data_json[this.state.rp_index].free_comment,
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
        if (data_json == undefined) data_json = [];
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
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  };

  deleteMedicine = (rp_index, medi_index) => {
    this.setState({
      sel_del_rp: rp_index,
      sel_del_med: medi_index,
      isMinusConfirmModal: true,
      confirm_message: "削除しますか？",
    });
    this.modalBlack();
  };

  addRp = (value) => {
    this.setState({
      isOpenMedicineModal: true,
      is_open_usage: 1,
      medicine_kind: sortations.indexOf(value),
      prescription_category: value,
    });
    this.modalBlack();
  };

  modalBlack() {
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }

  deleteRp = (rp_index) => {
    this.setState({
      sel_del_rp: rp_index,
      isMinusConfirmModal: true,
      confirm_message: "削除しますか？",
    });
    this.modalBlack();
  };

  confirmDeleteRp = (rp_index, medi_index) => {
    this.confirmCancel();
    this.change_flag = 1;
    let data_json = this.state.data_json;
    if (medi_index == null) {
      if (this.props.from_karte == 1 && this.state.can_delete == 1) {
        if(data_json[rp_index].is_original == 1) {
          data_json[rp_index].is_deleted = 1;
          data_json[rp_index].medicines.map((med_item, med_index)=>{
            med_item.is_deleted = 1;
            data_json[rp_index].medicines[med_index] = med_item;
          })
        } else {
          data_json.splice(rp_index, 1);
        }
      } else {
        data_json.splice(rp_index, 1);
      }
      this.setState({
        data_json,
        sel_del_rp: null,
      });
      return;
    }
    let data_json_item = { ...this.state.data_json[rp_index] };
    let medicines = data_json_item.medicines;
    if (medicines.length == 0) {
      if (this.props.from_karte == 1 && this.state.can_delete == 1) {
        if(data_json[rp_index].is_original == 1) data_json[rp_index].is_deleted = 1;
        else data_json.splice(rp_index, 1);
      } else {
        data_json.splice(rp_index, 1);
      }
      this.setState({
        data_json,
        sel_del_med: null,
        sel_del_rp: null,
      });
      return;
    }
    if(data_json_item !== undefined && data_json_item.medicines !== undefined && data_json_item.medicines[medi_index] !== undefined) {
      if (data_json_item.medicines[medi_index].is_original == 1) data_json_item.medicines[medi_index].is_deleted = 1;
      else data_json_item.medicines.splice(medi_index, 1);
    }
    data_json[rp_index] = data_json_item;
    this.setState({
      data_json,
      sel_del_med: null,
      sel_del_rp: null,
    });
  };

  registerSchedule = () => {
    this.setState({
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });

    if (
      this.state.regular_prescription_number !== 0 &&
      this.state.is_pattern === 1
    ) {
      this.updatePattern();
    } else {
      this.updateSchedule().then(() => {
        if (this.state.from_karte === 1) return;
        if (this.props.add_flag === true) {
          this.props.handleOk(this.props.schedule_date);
        } else {
          if (
            this.props.schedule_item != null &&
            this.props.schedule_item.schedule_date != undefined
          ) {
            this.props.handleOk(
              this.props.schedule_item.schedule_date,
              this.state
            );
          } else {
            this.props.handleOk(this.state.data_json, this.state);
          }
        }
      });
    }
  };

  confirmRegister = () => {
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('final_week_days_id');
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.EDIT
      ) === false
    ) {
      this.setState({alert_messages: "変更権限がありません。"});
      return;
    }
    let error_str_arr = [];
    if (this.state.instruction_doctor_number === 0) {
      this.showDoctorList();
      return;
    }
      if (this.state.is_pattern != 0 || this.state.can_delete != 1) {
        if (this.state.data_json == undefined || this.state.data_json == null || this.state.data_json.length === 0) {
          error_str_arr.push("薬剤を選択してください。");
        }
      }
    if (
      this.state.regular_prescription_number !== 0 &&
      this.state.is_pattern === 1
    ) {
      if (!(this.state.final_week_days > 0)) {
        error_str_arr.push("曜日を選択してください。");
        addRedBorder('final_week_days_id')
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
    }
    if (error_str_arr.length > 0) {
      this.modalBlack();
      this.setState({ alert_message: error_str_arr.join('\n') });
      return;
    }
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
    if (this.state.is_pattern == 0 && this.state.can_delete == 1) {
      if (this.state.data_json == undefined || this.state.data_json == null || this.state.data_json.length === 0) {
        this.setState({
          isUpdateConfirmModal: true,
          confirm_message: "薬剤が1件も登録されていません。このスケジュールを削除しますか？",
          confirm_alert_title: "削除確認"
        });
        if (base_modal !== undefined && base_modal != null)
          base_modal.style["z-index"] = 1040;
        return;
      }
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message:
        this.state.from_karte == 1
          ? "情報を変更しますか?"
          : "情報を登録しますか?",
    });
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  };

  updatePattern = () => {
    let new_pattern = {
      // number: this.state.number,
      patient_id: this.state.system_patient_id,
      system_patient_id: this.state.system_patient_id,
      time_limit_from: this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "",
      time_limit_to: this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "",
      checkSchedule: this.state.checkSchedule,
      regular_prescription_number: this.state.regular_prescription_number,
      weekday: this.state.final_week_days,
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
      is_pattern: this.state.is_pattern,
      pattern_number: this.state.current_pattern_number,
    };
    if (this.state.from_karte === 1 && this.props.change_regular_number != true) {
      new_pattern.schedule_date = formatDateLine(this.state.schedule_date);
      this.props.handleOk(new_pattern);
      
    } else {
      this.openConfirmCompleteModal("保存中");
      this.modalBlack();
      if (this.state.patient_id !== "") {
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
              // this.setState({alert_messages: "登録しました。"});
              this.props.handleOk(
                this.props.schedule_item != undefined &&
                  this.props.schedule_item != null &&
                  this.props.schedule_item.schedule_date != undefined
                  ? this.props.schedule_item.schedule_date
                  : this.state.time_limit_from,
                this.state
              );
            }
            if (res.no_date != undefined && res.no_date != null) {
              this.setState({
                isMakeScheduleModal: true,
                confirm_message:
                  formatJapan(
                    this.props.schedule_item != undefined &&
                      this.props.schedule_item != null &&
                      this.props.schedule_item.schedule_date != undefined
                      ? this.props.schedule_item.schedule_date
                      : this.state.time_limit_from
                  ) +
                  "が\n" +
                  "対象外となっております。\n" +
                  "保存して良いですか？",
                confirm_type: "update",
              });
              this.modalBlack();
            }
            if (res.no_sch_date != undefined && res.no_sch_date != null) {
              this.setState({
                isMakeScheduleModal: true,
                confirm_message: res.no_sch_date,
                confirm_type: "sch_date_multi_check",
              });
              this.modalBlack();
            }
          });
      } else {
        this.setState({alert_messages: "患者様を選択してください."});
      }
    }
  };

  async updateSchedule() {
    let update_data = {
      number: this.state.number,
      regular_prescription_number: this.state.regular_prescription_number,
      directer_name: this.state.directer_name,
      take_comment: this.state.take_comment,
      schedule_date: this.state.schedule_date,
      is_doctor_consented: this.state.is_doctor_consented,
      checkSchedule: 0,
      data_json: this.state.data_json,
      comment: this.state.comment,
      system_patient_id: this.state.system_patient_id,
      patient_id: this.state.system_patient_id,
      entry_date: formatDateLine(this.state.entry_date),
      entry_time: formatTimeIE(this.state.entry_time),
      instruction_doctor_number: this.state.instruction_doctor_number,
      is_temporary: this.state.is_temporary,
      is_pattern: this.state.is_pattern,
      pattern_number: this.state.current_pattern_number,
      detail_number: this.state.detail_number,
      from_source: this.props.from_source
    };
    if (this.state.from_karte === 1) {
      // open from karte  2020 04-03 added
      update_data.schedule_date = formatDateLine(update_data.schedule_date);
      if (this.props.change_regular_number) this.props.handleOk(this.state.prescription_item);
      else this.props.handleOk([update_data]);
      return;
    } else {
      // open normal style
      if (this.state.is_pattern == 2) {
        this.openConfirmCompleteModal("保存中");
        this.modalBlack();
      }
      let path = "/app/api/v2/dial/schedule/prescription_update";
      const post_data = {
        params: update_data,
      };
      await apiClient.post(path, post_data).then((res)=>{
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
      });
      this.setState({ isConfirmComplete: false });
    }
  }

  selectDoctor = (doctor) => {
    if (this.state.close_action === "open_print_modal") {
      this.setState({
        print_doctor_name: doctor.name,
        isShowDoctorList: false,
        close_action: undefined,
        isPreviewModal: true,
      });
      this.modalBlack();
      return;
    }
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
      var base_modal = document.getElementsByClassName(
        "edit-prescript-modal"
      )[0];
      if (base_modal !== undefined && base_modal != null)
        base_modal.style["z-index"] = 1040;
    }
  };

  closeDoctorSelectModal = () => {
    this.setState({
      isShowDoctorList: false,
      isShowStaffList: false,
    });
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
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
    this.change_flag = 1;
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
    if (name === "schedule1") this.setState({ is_weekly: value });
    this.change_flag = 1;
  };

  gettime_limit_to = (value) => {
    this.setState({ time_limit_to: value });
    this.change_flag = 1;
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
        .getElementById("wrapper-body")
        .addEventListener("scroll", function onScrollOutside() {          
          that.setState({ 
            contextMenu: { visible: false },
            hoverPatternMenu:{visible:false},
            hoverWordMenu:{visible:false},
            pattern_menu_reserved_flag:false,  
           });
          document
            .getElementById("wrapper-body")
            .removeEventListener(`scroll`, onScrollOutside);
        });

      let clientY = e.clientY;
      let clientX = e.clientX;
      var modal = document.getElementById('select-usage-modal');
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
        comment_index: comment_index
      },()=>{
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
    var modal = document.getElementById('select-usage-modal');
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
    var modal = document.getElementById('select-usage-modal');
    this.setState({
      hoverPatternMenu: {
        visible: true,
        x: hover_pattern_x,
        y: hover_pattern_y,
        rp_index,
        comment_index,        
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
    this.change_flag = 1;
    if (type === "amount_change") {
      if (this.state.data_json[rp_index].medicines == undefined) return;
      this.setState({
        // isOpenAmountModal: true,
        isOpenCalcModal: true,
        calcInit: this.state.data_json[rp_index].medicines[medi_index].amount,
        calcValType: "",
        calcTitle: this.state.data_json[rp_index].medicines[medi_index]
          .item_name,
        calcUnit: this.state.data_json[rp_index].medicines[medi_index].unit,
        medi_data: this.state.data_json[rp_index].medicines[medi_index],
      });
      this.modalBlack();
    } else if (type === "usage_change") {
      this.setState({
        isOpenUsageModal: true,
        medicine_kind: sortations.indexOf(
          this.state.data_json[rp_index].prescription_category
        ),
        modal_data: this.state.data_json[rp_index],
        usage_only: true
      });
      this.modalBlack();
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
      this.modalBlack();
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
    this.change_flag = 1;
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
        // isOpenAmountModal: false,
        isOpenCalcModal: false,
        calcValType: "",
        calcTitle: "",
        calcUnit: "",
        calcInit: 0,
      });
      var base_modal = document.getElementsByClassName(
        "edit-prescript-modal"
      )[0];
      if (base_modal !== undefined && base_modal != null)
        base_modal.style["z-index"] = 1050;
    }
  };

  selectRp = (rp_index) => {
    this.setState({
      selected_rp: rp_index,
      input_comment: false,
    });
  };

  inputUsage = () => {
    this.setState({
      isOpenUsageModal: true,
      medicine_kind: sortations.indexOf(
        this.state.data_json[this.state.selected_rp].prescription_category
      ),
      modal_data: this.state.data_json[this.state.selected_rp],
      rp_index: this.state.selected_rp,
    });
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  };

  enableInputRpComment = () => {
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
    this.setState({ data_json, free_comment: e.target.value });
    this.change_flag = 1;
  };
  
  blueRpComment = () => {
    let data_json = this.state.data_json;
    let data_json_item = { ...this.state.data_json[this.state.selected_rp] };
    let free_comment = data_json_item.free_comment;
    if (free_comment.length > 0) {
      if (free_comment[this.state.selected_comment_index].length > this.free_comment_max) {
        this.setState({alert_messages: this.free_comment_err_msg});
        return;
      }
      free_comment = free_comment.filter(x=> x!= "");
    }
    data_json[this.state.selected_rp].free_comment = free_comment;
    this.setState({selected_comment_index: -1, data_json});
    this.change_flag = 1;
  }

  selectPreset = (preset) => {
    let data_json = this.state.data_json;
    if (data_json == undefined || data_json == null) data_json = [];
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
    this.change_flag = 1;
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  };

  openPreviewModal = () => {
    var base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    let print_doctor_name = '';
    if (this.prescription_inspection_doctor_mode == 2) { //印刷時の依頼医設定
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.doctor_number > 0) {
        print_doctor_name = authInfo.name;
      } else {
        this.setState({
          isShowDoctorList: true,
          close_action: "open_print_modal"
        });
        if (base_modal !== undefined && base_modal != null)
          base_modal.style["z-index"] = 1040;
        return;
      }
    } else if (this.prescription_inspection_doctor_mode == 1) {
      print_doctor_name = this.state.final_doctor_name;
    }
    this.setState({
      isPreviewModal: true,
      print_doctor_name,
    });
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  };
  // この日の処方を処方ﾊﾟﾀｰﾝへ 2020-03-31
  prescriptionSetTo = () => {
    if (this.state.prescription_item == undefined || this.state.prescription_item == null || this.state.prescription_item.length == 0)
      return;
    let pattern_exist = false;
    this.state.prescription_item.map(item=> {
      if (item.pattern_number !== undefined && item.pattern_number > 0) {
        pattern_exist = true;
      }
    });
    if (!pattern_exist) return;
    this.setState({
      isPatternSetModal: true,
      confirm_message: "この日の処方を処方ﾊﾟﾀｰﾝへセットしますか？",
    });
    this.modalBlack();
  };

  patternSet = async () => {
    this.confirmCancel();
    this.modalBlackBack();
    let path = "/app/api/v2/dial/pattern/prescription_update";
    // let post_data = this.prescriptionMerge(this.origin_pres_item,this.state.prescription_item)
    let post_data = this.state.prescription_item;
    post_data.map((item) => {
      item.time_limit_from = formatDateLine(this.state.schedule_date);
    });

    this.openConfirmCompleteModal("セット中");
    this.modalBlack();
    await apiClient
      .post(path, { params: post_data })
      .then((res) => {
        this.setState({ isConfirmComplete: false });
        this.setState({alert_messages: res.alert_message});
        this.modalBlack();
        this.change_flag = 0;
      })
      .catch(() => {
        this.setState({ isConfirmComplete: false });
        // window.sessionStorage.setItem("alert_messages", err);
      });
  }
  // パターンの処方をこの日にセット 2020-04-01 added
  getFromPattern = async () => {
    if (this.state.regular_prescription_number == 0) return;
    let path = "/app/api/v2/dial/pattern/get_prescription_from_pattern";
    const params = {
      system_patient_id: this.state.system_patient_id,
      schedule_date: formatDateLine(this.state.schedule_date),
      regular_prescription_number: this.state.regular_prescription_number,
    };
    await apiClient
      .post(path, { params })
      .then((res) => {
        if (res.data_json != undefined) {
          this.setState({
            temp_data_json: res.data_json,
            temp_current_pattern_number: res.number,
            openEditMultisetModal: true
          });
          this.modalBlack();
          this.change_flag = 1;
        } else {
          this.setState({alert_messages: "登録された処方パターンがありません。"});
          this.modalBlack();
        }
      })
      .catch(() => {
        this.setState({alert_messages: "登録された処方パターンがありません。"});
        this.modalBlack();
      });
  };

  onHide = () => {};

  openPatternConfirmModal = () => {
    if (
      this.state.regular_prescription_number === undefined ||
      this.state.regular_prescription_number == null ||
      this.state.regular_prescription_number == 0
    )
      return;
    this.setState({ isPatternConfirmModal: true });
    this.modalBlack();
  };

  prescriptionCopy(prescription) {
    let new_presc_schedule = [];
    if (prescription != null && prescription.length > 0) {
      prescription.map((pres_item) => {
        let row = {};
        Object.keys(pres_item).map((idx) => {
          if (idx !== "data_json") {
            row[idx] = pres_item[idx];
          } else {
            let row_json = [];
            pres_item.data_json.map((rp_item) => {
              let rp_row = {};
              Object.keys(rp_item).map((rp_idx) => {
                rp_row[rp_idx] = rp_item[rp_idx];
                let medicines = [];
                if (rp_idx === "medicines") {
                  rp_item.medicines.map((medi_item) => {
                    let medi_row = {};
                    Object.keys(medi_item).map((medi_idx) => {
                      medi_row[medi_idx] = medi_item[medi_idx];
                    });
                    medicines.push(medi_row);
                  });
                  rp_row["medicines"] = medicines;
                }
              });
              row_json.push(rp_row);
              row["data_json"] = row_json;
            });
          }
        });
        new_presc_schedule.push(row);
      });
    }
    return new_presc_schedule;
  }

  prescriptionMerge(first_pres, second_pres) {
    let merge_schedule = [].concat(first_pres);
    if (second_pres != null) {
      second_pres.map((pres_item, pres_key) => {
        if (pres_item.data_json != null) {
          pres_item.data_json.map((rp_item) => {
            let find_rp_idx = first_pres[pres_key].data_json.findIndex(
              (x) => JSON.stringify(x) == JSON.stringify(rp_item)
            );
            if (find_rp_idx == -1)
              merge_schedule[pres_key].data_json.push(rp_item);
          });
        }
      });
    }
    return merge_schedule;
  }

  setFromHistory = (rp_item, rp = 1) => {
    this.closeModal();
    let { data_json } = this.state;
    if (rp == 1) {
      let find_rp_idx = data_json.findIndex(
        (x) => JSON.stringify(x) == JSON.stringify(rp_item)
      );
      if (find_rp_idx == -1) {
        data_json.push(rp_item);
      }
    } else {
      rp_item.map((sub_item) => {
        let find_rp_idx = data_json.findIndex(
          (x) => JSON.stringify(x) == JSON.stringify(sub_item)
        );
        if (find_rp_idx == -1) {
          data_json.push(sub_item);
        }
      });
    }
    this.setState({ data_json });
    this.change_flag = 1;
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

  hideTooltip = () => {
    this.setState({
      tooltipTitle: { visible: false },
    });
  };

  componentDidUpdate() {
    this.changeBackground();
    document.onmouseover = (e) => {
      if(e.target.className != undefined && e.target.className != null && typeof e.target.className == "string" ) {
        if (
          e.target.className.includes(
            "react-datepicker__day--highlighted-custom-1"
          ) ||
          e.target.className.includes(
            "react-datepicker__day--highlighted-custom-2"
          ) ||
          e.target.className.includes(
            "react-datepicker__day--highlighted-custom-3"
          )
        ) {
          // has tooltip flag
          this.hasTooltip = 1;
          let { over_data } = this.state;
          let month_obj = document.getElementsByClassName(
            "react-datepicker__current-month"
          )[0];
          let year_month = month_obj.innerHTML;
          if (year_month == undefined) return;
          let day = e.target.innerHTML;
          if (parseInt(day) < 10) {
            day = "0" + parseInt(day).toString();
          }
          let year = year_month.split(" ")[1];
          let month = year_month.split(" ")[0];
          month = month.substring(0, month.length - 1);
          if (
            e.target.className.includes("react-datepicker__day--outside-month")
          ) {
            if (parseInt(day) > 15) {
              // before month
              if (month == 1) {
                year = parseInt(year) - 1;
                month = 12;
              } else {
                month = parseInt(month) - 1;
              }
            } else {
              if (month == 12) {
                year = parseInt(year) + 1;
                month = 1;
              } else {
                month = parseInt(month) + 1;
              }
            }
          }
          if (parseInt(month) < 10) {
            month = "0" + parseInt(month).toString();
          }
          let date = year + "-" + month + "-" + day;
          let sch_data = over_data[date];
          if (sch_data === undefined && sch_data == null) return;
  
          this.setState({
            tooltipTitle: {
              visible: true,
              x:
                e.clientX -
                document.getElementById("select-usage-modal").offsetLeft,
              y:
                e.clientY +
                window.pageYOffset -
                document.getElementById("select-usage-modal").offsetTop,
              title: sch_data,
            },
          });
        } else {
          if (this.hasTooltip == 1) {
            // if has tooltip
            this.hasTooltip = 0;
            // hide tooltip
            this.hideTooltip();
          }
        }
      }
    };
  }

  closeConfirmModal = () => {
    this.confirmCancel();
    this.modalBlackBack();
    this.props.closeModal();
  };

  backModal = () => {
    if (this.change_flag) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中'
      });
      this.modalBlack();
    } else {
      this.props.closeModal(true);
    }
  };

  changeBackground = () => {
    patternValidate('dial_prescription_pattern',this.state, 'background');
    removeRequiredBg("final_week_days_id");
  }
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    this.modalBlackBack();
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus();
    }
  };

  checkValidation = () => {
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('final_week_days_id');
    let error_str_arr = [];

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
  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }
  
  handleDeployOk = (usage_weeks) => {
    this.closeModal();
    if (this.state.temp_data_json !== undefined) {
      let data_json = this.state.data_json;
      if (this.state.temp_data_json.length > 0) {
        this.state.temp_data_json.map(rp_item=> {
          if (rp_item.disable_days_dosing == 0 && rp_item.days > 0) {
            rp_item.days = rp_item.days * usage_weeks;
          } else if (rp_item.disable_days_dosing == 1) {
            let new_medicines = [];
            rp_item.medicines.map(med_item=> {
              med_item.amount = med_item.amount * usage_weeks;
              new_medicines.push(med_item);
            });
            rp_item.medicines = new_medicines;
          }
          data_json.push(rp_item)
        })
      }
      this.setState({
        usage_weeks,
        data_json,
        temp_data_json: undefined,
        temp_current_pattern_number: undefined,
        current_pattern_number: this.state.temp_current_pattern_number
      });
      
    }
  }
  
  handleSaveEditedSchedule = async (delete_flag = 0) => {
    this.openConfirmCompleteModal("保存中");
    this.modalBlack();
    let path = "/app/api/v2/dial/schedule/dial_prescription_change_kind_multi";
    const post_data = {
      params: {
        patients: [{patient_id:this.state.system_patient_id}],
        new_pres_kind: this.state.regular_prescription_number,
        schedule_date: this.state.schedule_date,
        usage_weeks: this.state.usage_weeks,
        deploy_kind: 0,
        delete_flag,
      },
    };
    await apiClient
      .post(path, post_data)
      .then(() => {
        this.props.closeModal();
        this.setState({ isConfirmComplete: false });
        if (this.state.from_karte === 1) return;
        if (this.props.add_flag === true) {
          this.props.handleOk(this.props.schedule_date);
        } else {
          if (
            this.props.schedule_item != null &&
            this.props.schedule_item.schedule_date != undefined
          ) {
            this.props.handleOk(
              this.props.schedule_item.schedule_date,
              this.state
            );
          } else {
            this.props.handleOk(this.state.data_json, this.state);
          }
        }
      })
      .catch(() => {
        this.setState({ isConfirmComplete: false });
        window.sessionStorage.setItem("alert_messages", "失敗しました");
      });
  };

  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let { data_json, highlightWithRanges} = this.state;
    let patient_number = "";
    let patient_name = "";
    let set_btn_enabled = false;
    let regular_numbers = [];
    if (this.state.prescription_item !== undefined && this.state.prescription_item != null && this.state.prescription_item.length > 0) {
      this.state.prescription_item.map(item=> {
        regular_numbers.push(item.regular_prescription_number);
        if (item.pattern_number !== undefined && item.pattern_number > 0) {
          set_btn_enabled = true;
        }
      });
    }
    if (this.state.regular_prescription_number == 0) set_btn_enabled = false;
    
    const week_days = ["日", "月", "火", "水", "木", "金", "土"];
    if (this.state.patient_number != null && this.state.patient_number != "") {
      patient_name = this.state.patient_name;
      patient_number = this.state.patient_number;
    } else if (
      this.props.schedule_item != undefined &&
      this.props.schedule_item != null
    ) {
      patient_name = this.props.schedule_item.patient_name;
      patient_number = this.props.schedule_item.patient_number;
    }

    let register_tooltip = "";
    let number = 0;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <>
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal edit-prescript-modal"
        id="select-usage-modal"
      >
        <Modal.Header>
          <Modal.Title>処方{this.props.add_flag ? "登録" : "編集"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>   
        <DatePickerBox>
          <Wrapper id = 'wrapper-body'>
              <div className={"flex"}>
                <div className={"left-area"}>
                  {this.state.from_karte != 1 && (
                    <div className="calendar-area">
                      <DatePicker
                        showPopperArrow={false}
                        locale="ja"
                        selected={this.state.schedule_date}
                        onChange={this.getDate.bind(this)}
                        highlightDates={highlightWithRanges}
                        dateFormat="yyyy/MM/dd"
                        inline
                        dayClassName = {date => setDateColorClassName(date)}
                        customInput={<ExampleCustomInput />}
                      />
                      <div className={"flex"}>
                        <div className={"flex w40"}>
                          <div className={"show-box pink"}></div>
                          <div> 臨時処方 </div>
                        </div>
                        <div className={"flex w60"}>
                          <div className={"show-box blue"}></div>
                          <div> 定期処方 </div>
                        </div>
                      </div>
                      <div className={"flex"}>
                        <div className={"flex w40"}>
                          <div className={"show-box green"}></div>
                          <div> 両方 </div>
                        </div>
                        <div className={"flex w60"}>
                          <div className={"show-box yellow"}></div>
                          <div> 定期処方更新あり </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                            checked={
                              this.state.medicine_kind === key ? true : false
                            }
                          />
                        </>
                      );
                    })}
                  </div>
                  <div className="sortation-btn take_comment-btn">
                    <RadioButton
                      id="take_btn"
                      label="服用"
                      value={0}
                      name="take_comment"
                      getUsage={this.inputUsage.bind(this)}
                      checked={this.state.take_comment === 0 ? true : false}
                    />
                    <RadioButton
                      id="comment_btn"
                      label="コメント"
                      value={1}
                      name="take_comment"
                      getUsage={this.enableInputRpComment.bind(this)}
                      checked={this.state.take_comment === 1 ? true : false}
                    />
                  </div>
                  <div className={this.state.regular_prescription_number == 0 ? "disable-item sortation-btn prescription-set-btn" : "sortation-btn prescription-set-btn"}>
                    <RadioButton
                      id="prescription_set"
                      label="パターンの処方をこの日にセット"
                      name="prescription_set"
                      getUsage={this.getFromPattern.bind(this)}
                      checked={this.state.prescription_set === 1 ? true : false}
                    />
                  </div>
                  <div className="history-btn">
                    <button onClick={this.OpenSetPrescriptListModal}>
                      処方セット
                    </button>
                    <button onClick={this.OpenMakePrescriptByHistoryModal}>
                      履歴から
                    </button>
                  </div>
                </div>
                <div className={"right-area"}>
                  <div className="flex">
                    <div className={"cur_date"} style={{ fontSize: 18 }}>
                      {formatJapanDate(this.state.schedule_date)}
                    </div>
                    <div className={"patient_info"}>
                      {" "}
                      {patient_number} : {patient_name}
                    </div>
                  </div>
                  <div className={"flex"}>
                    <div className="periodic-btn w-50 d-flex">
                      {periodics.map((item, key) => {
                        let disable_state = false;
                        if (this.props.from_source != "schedule_page" && ((this.props.editPrescriptType == 1 && key != 0) || (this.props.editPrescriptType != 1 && key == 0))) {
                          disable_state = true;
                        }
                        if (this.props.from_karte == 1 && this.props.editPrescriptType == 0 && this.props.change_regular_number == false && key != this.state.regular_prescription_number) disable_state = true;
                        if (regular_numbers.indexOf(key) == -1 && this.props.change_regular_number) disable_state = true;
                        return (
                          <div className={disable_state ? "disable-item" : ""} key={key}>
                            <RadioButton
                              id={`periodic_${key}`}
                              value={key}
                              label={item}
                              name="periodic"
                              getUsage={this.changePeriodic.bind(this, key)}
                              checked={this.state.regular_prescription_number === key}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className={"edit-btn text-right w-50"}>
                      {this.state.regular_prescription_number == 0 ? (
                        <button className="div-button">
                          パターン確認
                        </button>
                      ):(
                      <button onClick={this.openPatternConfirmModal}>
                        パターン確認
                        </button>
                        )}
                      <button onClick={this.openAllClearItem}>クリア</button>
                    </div>
                  </div>
                  <div className="dial-body">
                    {this.state.is_loaded ? (
                      <table className="table-scroll table table-bordered" id="code-table">
                        <tbody>
                        {data_json != undefined &&
                        data_json !== null &&
                        data_json.map((item, rp_index) => {
                          if (item.is_deleted !== undefined && item.is_deleted == 1) number++;
                          if (item.is_deleted !== undefined && item.is_deleted == 1)
                            return <></>;
                          else
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
                                    {rp_index + 1 - number}
                                  </td>
                                  <td className="text-left" colSpan={3}>
                                    {item.prescription_category}処方
                                  </td>
                                </tr>
                                {item.medicines !== undefined &&
                                item.medicines != null &&
                                item.medicines.length > 0 &&
                                item.medicines.map(
                                  (medi_item, medi_index) => {
                                    return (
                                      <>
                                        {(medi_item.is_deleted !==
                                          undefined &&
                                          medi_item.is_deleted == 1) ||
                                        (medi_item.is_schedule !==
                                          undefined &&
                                          medi_item.is_schedule == 0) ? (
                                          <></>
                                        ) : (
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
                                              this.state.selected_rp ===
                                              rp_index
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
                                            <td />
                                            <td
                                              className="text-left"
                                              style={{ width: "45%" }}
                                            >
                                              {medi_item.item_name}
                                            </td>
                                            <td
                                              className="text-center"
                                              style={{ width: "50px" }}
                                            >
                                              {medi_item.amount}
                                            </td>
                                            <td className="text-left">
                                              <div className="ml-1">
                                                {medi_item.unit}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                                <tr
                                  onContextMenu={(e) =>
                                    this.handleClick(e, rp_index)
                                  }
                                  onClick={this.selectRp.bind(this, rp_index)}
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
                                      (item.prescription_category === "頓服"
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
                                              <div className="div-rp-comment" style={{ marginLeft: "110px" }}>
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
                    ):(
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    )}
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
                    {this.state.prescription_item != null &&
                      this.props.from_karte != 1 && (
                        <div className={"text-right"}>
                          {"最終入力日時：" +
                            this.state.final_entry_date +
                            " " +
                            this.state.final_entry_time +
                            "　" +
                            "　入力者：" +
                            this.state.final_entry_name +
                            "　" +
                            " " +
                            "　指示者：" +
                            (this.state.final_doctor_name != undefined
                              ? this.state.final_doctor_name
                              : "")}
                        </div>
                      )}
                    <Row className={"flex"}>
                      <div className={"no-tag-area"}>
                        {this.state.regular_prescription_number !== 0 && (
                          <>
                            {/*<div className="flex mt-1">*/}
                            {/*  {is_pattern.map((item, key) => {*/}
                            {/*    return (*/}
                            {/*      <>*/}
                            {/*        <RadioButton*/}
                            {/*          id={`is_pattern_${key}`}*/}
                            {/*          value={key}*/}
                            {/*          label={item}*/}
                            {/*          name="is_pattern"*/}
                            {/*          getUsage={this.changePatternState.bind(*/}
                            {/*            this,*/}
                            {/*            key*/}
                            {/*          )}*/}
                            {/*          checked={this.state.is_pattern === key}*/}
                            {/*        />*/}
                            {/*      </>*/}
                            {/*    );*/}
                            {/*  })}*/}
                            {/*</div>*/}
                            {this.state.is_pattern === 1 && (
                              <div className="area1 mt-2">
                                <div className="gender">
                                    <label className="gender-label">曜日</label>
                                    <div id='final_week_days_id' className="d-flex">
                                    <>
                                      {week_days.map((item, key) => {
                                        if (
                                          this.state.checkdialdays[key] === true
                                        ) {
                                          return (
                                            <>
                                              <RadioGroupButton
                                                id={`week_day_${key}`}
                                                value={key}
                                                label={item}
                                                name="week_day"
                                                getUsage={this.addDay.bind(
                                                  this,
                                                  key
                                                )}
                                                checked={
                                                  this.state.checkalldays[key]
                                                }
                                              />
                                            </>
                                          );
                                        } else {
                                          return (
                                            <div className={"no-dial-day"}></div>
                                          );
                                        }
                                      })}
                                    </>
                                  </div>
                                  <div className="selet-day-check">
                                    <Checkbox
                                      label="透析曜日以外も表示"
                                      getRadio={this.getCheckAnotherDay.bind(
                                        this
                                      )}
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
                                </div>
                                <div className="period">
                                  <div className="state-date">
                                    <InputWithLabelBorder
                                      label="期限"
                                      type="text"
                                      // getInputText={this.gettime_limit_from}
                                      diseaseEditData={formatDateSlash(
                                        new Date(this.state.time_limit_from)
                                      )}
                                      id='time_limit_from_id'
                                    />
                                  </div>
                                  <div className="pd-15">～</div>
                                  <div className={'end-date'}>
                                    <InputWithLabelBorder
                                      label=""
                                      type="date"
                                      getInputText={this.gettime_limit_to}
                                      diseaseEditData={this.state.time_limit_to}
                                      id='time_limit_to_id'
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className={"input-info-area"}>
                        <div className="input-data-area1">
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
                              onKeyDown = {this.timeKeyEvent}
                              onBlur = {this.setTime}
                              value = {this.state.input_time_value}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={10}
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              timeCaption="時間"
                              id="entry_time_id"
                            />
                          </div>
                        </div>
                        <div className="input-data-area2 remove-x-input">
                          <InputBoxTag
                            label="入力者"
                            type="text"
                            isDisabled={true}
                            value={this.state.entry_name}
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
                                  type="text"
                                  isDisabled={true}
                                  diseaseEditData={this.state.directer_name}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </Row>
                  </div>
                </div>
              </div>
              {this.state.isOpenSetPrescriptListModal && (
                <PresetPrescription
                  handleOk={this.handleOk}
                  closeModal={this.closeModal}
                />
              )}
              {this.state.isOpenMakePrescriptByHistoryModal && (
                <MakePrescriptByHistory
                  handleOk={this.setFromHistory}
                  system_patient_id={this.state.system_patient_id}
                  schedule_date={formatDateLine(this.state.schedule_date)}
                  closeModal={this.closeModal}
                />
              )}
              {this.state.isOpenMedicineModal && (
                <PrescriptMedicineSelectModal
                  handleOk={this.handleOk}
                  closeModal={this.closeMedicineModal}
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
                  closeModal={this.closeUsageModal}
                  medicine_kind={this.state.medicine_kind}
                  modal_data={this.state.modal_data}
                  usage_only={this.state.usage_only}
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
              {this.state.isUpdateConfirmModal !== false && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.confirmCancel.bind(this)}
                  confirmOk={this.registerSchedule.bind(this)}
                  confirmTitle={this.state.confirm_message}
                  title = {this.state.confirm_alert_title}
                />
              )}
              {this.state.isOpenAllClearConfirm !== false && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.confirmCancel.bind(this)}
                  confirmOk={this.clearAllItem.bind(this)}
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
              {this.state.isConfirmComplete !== false && (
                <CompleteStatusModal message={this.state.complete_message} />
              )}
              {this.state.isOpenAmountModal && (
                <AmountInputModal
                  closeModal={this.closeModal}
                  handleModal={this.amountChange}
                  medicine={this.state.medi_data}
                />
              )}
              {this.state.isPreviewModal && (
                <PrescriptionPreviewModalDom
                  closeModal={this.closeModal}
                  system_patient_id={this.state.system_patient_id}
                  schedule_date={formatDateLine(this.state.schedule_date)}
                  pres_data={this.state.data_json}
                  directer_name={this.state.print_doctor_name}
                  regular_prescription_number={this.state.regular_prescription_number}
                  patient_number={patient_number}
                  comment={this.state.comment}
                />
              )}
              {this.state.isPatternConfirmModal && (
                <PrescriptionPatternConfirmModal
                  closeModal={this.closeModal}
                  system_patient_id={this.state.system_patient_id}
                  schedule_date={formatDateLine(this.state.schedule_date)}
                  regular_prescription_number={
                    this.state.regular_prescription_number
                  }
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
              {this.state.isBackConfirmModal !== false && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.confirmCancel.bind(this)}
                  confirmOk={this.closeConfirmModal}
                  confirmTitle={this.state.confirm_message}
                  title = {this.state.confirm_alert_title}
                />
              )}
              {this.state.isPatternSetModal !== false && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.confirmCancel.bind(this)}
                  confirmOk={this.patternSet}
                  confirmTitle={this.state.confirm_message}
                />
              )}
              {this.state.alert_message != "" && (
                <ValidateAlertModal
                  handleOk={this.closeAlertModal}
                  alert_meassage={this.state.alert_message}
                />
              )}
              {this.state.openEditMultisetModal && (
                <PrescriptionScheduleDeployModal
                  handleOk={this.handleDeployOk}
                  closeModal={this.closeModal}
                  schedule_date = {this.state.schedule_date}
                  regular_prescription_number = {this.state.regular_prescription_number}
                />
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
              {this.state.alert_messages !== "" && (
                <AlertNoFocusModal
                  hideModal= {this.closeModal.bind(this)}
                  handleOk= {this.closeModal.bind(this)}
                  showMedicineContent= {this.state.alert_messages}
                />
              )}
            </Wrapper>
        </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          {this.state.from_karte != 1 ? (
            <>
              <Button className="cancel-btn" onClick={this.backModal}>キャンセル</Button>
              {this.state.from_karte != 1 && (
                <Button
                  onClick={this.prescriptionSetTo}
                  className={!set_btn_enabled ? "disable-btn" : "red-btn"}
                >
                  この日の処方を処方ﾊﾟﾀｰﾝへ
                </Button>
              )}
              {this.state.from_karte != 1 && (
                <Button className="red-btn" onClick={this.openPreviewModal.bind(this)}>
                  院外処方箋プレビュー
                </Button>
              )}
              <Button
                onClick={this.confirmRegister.bind(this)}
                className={register_tooltip != "" ? "disable-btn" : "red-btn"}
                tooltip={register_tooltip}
              >
                {this.state.from_karte == 1 ? "変更" : "登録"}
              </Button>
            </>
          ) : (
            <>
              <Button className="cancel-btn" onClick={this.backModal}>キャンセル</Button>
                <Button
                  onClick={this.confirmRegister.bind(this)}
                  className={register_tooltip != "" ? "disable-btn" : "red-btn"}
                  tooltip={register_tooltip}
                >
                  {this.state.from_karte == 1 ? "変更" : "登録"}
                </Button>
            </>
          )}
        </Modal.Footer>        
        <TooltipTitle {...this.state.tooltipTitle} parent={this} />
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          rp_index={this.state.rp_index}
          medi_index={this.state.medi_index}
          comment_index={this.state.comment_index}
        />
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
      </Modal>
      {this.state.confirm_deploy_message !== "" && (
        <Modal show={true} className='system-confirm master-modal'>
          <Modal.Header><Modal.Title>&nbsp;&nbsp;</Modal.Title></Modal.Header>
          <Modal.Body>
            <DoubleModal>
              <div>
                {this.state.confirm_deploy_message}
              </div>
            </DoubleModal>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmCancel.bind(this)}>キャンセル</Button>
              <Button className="red-btn" onClick={this.handleSaveEditedSchedule.bind(this,1)}>はい</Button>
          </Modal.Footer>
        </Modal>
      )}
      </>
    );
  }
}
EditPrescript.contextType = Context;

EditPrescript.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  schedule_item: PropTypes.object,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  schedule_date: PropTypes.string,
  editPrescriptType: PropTypes.bool, // 定期:0 臨時:1
  only_pattern: PropTypes.number, // pattern edit: 1 schedule edit: 0
  from_karte: PropTypes.number, // open from karte : 1 else 0
  system_patient_id: PropTypes.number,
  add_flag: PropTypes.bool,
  time_limit_to: PropTypes.time_limit_to,
  from_source: PropTypes.string,
  change_regular_number: PropTypes.bool,
};

export default EditPrescript;