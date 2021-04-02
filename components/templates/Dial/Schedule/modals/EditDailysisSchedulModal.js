import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as methods from "~/components/templates/Dial/DialMethods";
import {
  formatDateLine,
  formatJapanDate,
  formatTime,
  formatTimePicker,
  formatTimeIE,
  formatDateSlash,
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import {
  makeList_code,
  makeList_data,
  makeList_codeName,
  extract_enabled,
  sortTimingCodeMaster,
  sortByTiming,
  toHalfWidthOnlyNumber
} from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import NumericInputWithUnitLabel from "../../../../molecules/NumericInputWithUnitLabel";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg, setDateColorClassName} from "~/helpers/dialConstants"; 
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  float: left;
  .no-result {
    padding: 200px;
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .dailysis_condition {
    display: block;
    height: calc(100% - 370px);
    overflow-y: auto;
    width:100%;
  }
  .datepicker {
    margin-top: 10px;
    label {
      margin-right: 8px;
      width: 6.25rem;
      font-size: 1.125rem;
      margin-top: 6px;
      margin-bottom: 0;
    }
    .react-datepicker-wrapper {
      width: calc(100% - 7rem);
    }
    input {
      font-size: 14px;
    }
  }
  .left {
    text-align: left;
  }
  .center {
    text-align: center;
  }
  .right {
    text-align: right;
  }
  .flex {
    display: flex;
  }
  .one_third {
    width: 33.33%;
  }
  .one_fourth {
    width: 25%;
    .inline_input, .pullbox{
      width:100%;
    }
  }
  label {
    text-align: right;
    width: 12.5rem;
    font-size: 1rem;
  }
  input {
    width: calc(100% - 7rem);
    font-size: 14px;
  }
  .done_or_not {
    font-size: 1.125rem;
    width: 2rem;
    background: darkgray;
    text-align: center;
  }
  .done_or_not.done {
    background-color: rgb(105, 200, 225);
  }
  .medicine_name {
    margin-left: 1.25rem;
  }
  .width-60 {
    width: 60%;
  }
  .fixed_right {
    width: 30%;
    text-align: right;
  }
  .modal_header {
    padding-left: 30px;
    margin-bottom: 5px;
    span {
      font-size: 28px;
    }
    .done_flag {
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 3px;
      padding-bottom: 3px;
      border-radius: 50%;
      border: 1px solid;
      color: white;
    }
    .done_schedule {
      background-color: lightblue;
    }
    .no_done_schedule {
      background-color: lightcoral;
    }
    .patient_id {
      margin-left: 6.25rem;
    }
    .schedule_date {
      float: right;
      margin-right: 13px;
    }
  }
  .inline_input {
    display: flex;
    span {
      padding-top: 17px;
      padding-left: 5px;
    }
    label {
      width: 10rem;
      font-size: 1rem;
      margin-top: 8px;
      margin-bottom: 0px;
    }
    input {
      width: calc(100% - 11.25rem);
    }
    .label-unit {
      width: auto;
      white-space: nowrap;
    }
  }
  .other_conditions {
    display: flex;
    margin-top: 10px;
    .title {
      padding-left: 9px;
      font-size: 1.25rem;
      height: 30px;
      background-color: #36a7ad;
      color: white;
    }
    .content {
      border: 1px solid lightgray;
      overflow-y: scroll;
    }
    .prescription_content {
      height: 290px;
    }
    .inspection_content {
      height: 160px;
    }
    .dailysis_prescription_content {
      height: 100px;
    }
    .dialyser_content {
      height: 70px;
    }
    .anti_hard_content {
      height: 110px;
    }
    .injection_content {
      height: 50px;
    }
    .manage_content {
      height: 75px;
    }
  }
  .react-datepicker-wrapper {
    width: 100%;
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
  .dailysis_condition {
    .pullbox {
      margin-top: 8px;
    }
    .pullbox-title {
      width: 10.5rem;
      text-align: right;
      margin-right: 8px;
      font-size: 1rem;
      margin-top: 0px;
      margin-bottom: 0px;
    }
    .pullbox-label,
    .pullbox-select {
      width: calc(100% - 11.25rem);
      margin-bottom: 0px;
      select {
        width: 100%;
      }
    }
    .first_edit_area {
      float:left;
      .reservation_time {
        .pullbox {
          width: 100%;
        }
      }
      width: 17%;
      .inline_input, .pullbox{
        width:100%;
      }
      .datepicker {
        label {
          width: 6.25rem;
        }
        .react-datepicker-wrapper {
          width: calc(100% - 7rem);
          input {
            width: 100%;
            font-size: 14px;
          }
        }
      }
      .real_hours{
        div{
          width:100%;
          margin-top:0px;
        }
      }
      label {
        width: 100px;
        font-size: 1rem;
        margin-top: 8px;
        margin-bottom: 0;
      }
      input {
        width: calc(100% - 7rem);
      }
      .pullbox-title {
        width: 6.25rem;
        font-size: 1rem;
        margin-top: 8px;
        margin-bottom: 0px;
      }
      .pullbox-label {
        width: calc(100% - 7rem);
        margin-top:10px;
        select {
          width: 100%;
        }
      }
      .mtop4{
        .pullbox{
          margin-top:1px;
        }
      }
    }
    .second_edit_area {
      float:left;
      width: 22%;
      .inline_input, .pullbox{
        width:100%;
      }
      .temperature-div{
        .label-title {
          margin-right: 0.5rem;
          width: 5.6rem;
        }
      }
      .pullbox-title{
        width: 5.5rem !important;
      }
      .pullbox-label{
        width: calc(100% - 6.25rem) !important;
      }
    }
    .last_edit_area {
      float:left;
      width: 36%;
      .inline_input, .pullbox{
        width:100%;
      }
      .inline_input .label-title {
        width: 6rem !important;
      }
      .inline_input input {
        width: 8rem !important;
      }
      .pullbox-title {
        width: 6rem;
      }
      .pullbox-label,
      .pullbox-select {
        width: 12.5rem;
      }
    }
    .third_edit_area{
      float:left;
    }
  }
  .direct_man {
    label {
      width: 6.25rem;
    }
  }
  .temperature-div {
    span {
      padding: 0;
    }
  }
  .final-name {
    padding-left: 58px;
  }
  .final-date {
    padding-left: 10px;
  }
  input:disabled {
    color: black !important;
    background: #cccccc;
  }
  .react-numeric-input {
    input {
      text-align: right;
      padding-right: 1.5rem !important;
    }
    b {
      right: 4px !important;
    }
  }
  .fixed-tape-disinfection-liquid{
    .pullbox-title{
      width: 6rem;
    }
    label{
      width: calc(100% - 7.25rem) !important;
    }
    .pullbox-select{
      width: 100% !important;
    }
    select{
      font-size: 0.9rem !important;
    }
  }
`;

const dilution_timings = [
  { id: 0, value: "" },
  { id: 1, value: "前補液" },
  { id: 2, value: "後補液" },
];
const periodics = ["【臨時処方】", "【定期処方1】", "【定期処方2】", "【定期処方3】"];

const SpinnerWrapper = styled.div`
  padding: 0;
`;

class EditDailysisSchedulModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let dial_common_config = JSON.parse(
      window.sessionStorage.getItem("init_status")
    ).dial_common_config;
    this.pattern_unit = null;
    this.decimal_info = null;
    if (
      dial_common_config !== undefined &&
      dial_common_config != null
    ) {
      if (dial_common_config["単位名：透析スケジュール編集"] !== undefined) this.pattern_unit = dial_common_config["単位名：透析スケジュール編集"];
      if (dial_common_config["小数点以下桁数：透析スケジュール"] !== undefined) this.decimal_info = dial_common_config["小数点以下桁数：透析スケジュール"];
    }
    var schedule_date = this.props.schedule_date;
    var system_patient_id = this.props.system_patient_id;
    if (this.props.add_flag != true)
      this.getScheduleItem(system_patient_id, schedule_date);
    let default_array = this.getTelegramDefaultValue();
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    let third_obj_width = "25%";
    let forth_obj_width = "36%";
    if (parseInt(width) < 1367) {
      third_obj_width="25%";
      forth_obj_width="36%";          
    }
    else if (parseInt(width) > 1600) {
      third_obj_width="21%";
      forth_obj_width="40%";
    }
    this.state = {
      load_status: false,
      schedule_date,
      system_patient_id,
      isShowDoctorList: false,
      directer_name: "",
      entry_name:authInfo != undefined && authInfo != null ? authInfo.name : "",
      instruction_doctor_number:authInfo != undefined && authInfo != null ? authInfo.doctor_number : 0,
      entry_date: '',
      entry_time: '',
      default_array,
      isUpdateConfirmModal: false,
      dialysates: [{ id: 0, value: "" }],
      disinfection_liquid: [{ id: 0, value: "" }],
      fixed_tape: [{ id: 0, value: "" }],
      confirm_alert_title:"",
      check_message:"",
      before_start_confirm_title: "",
      third_obj_width,
      forth_obj_width,
    };
    this.change_flag = 0;

  }
  
  async componentDidMount () {
    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function() {
      $(window).resize(function() {
        let html_obj = document.getElementsByTagName("html")[0];
        let third_obj_width = "25%";
        let forth_obj_width = "36%";
        let width = html_obj.offsetWidth;
        if (parseInt(width) < 1367) {
          third_obj_width="25%";
          forth_obj_width="36%";          
        }
        else if (parseInt(width) > 1600) {
          third_obj_width="21%";
          forth_obj_width="40%";
        }
        that.setState({
          third_obj_width: third_obj_width,
          forth_obj_width: forth_obj_width
        });
      });
    });
    let server_time = await getServerTime();
    this.setState({
      entry_date:new Date(server_time),
      entry_time:new Date(server_time)
    });
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    if(this.state.entry_date == "" || this.state.entry_date == null){
      addRequiredBg("entry_date_id");
    } else {
      removeRequiredBg("entry_date_id");
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
    if(this.state.instruction_doctor_number == 0){
      addRequiredBg("instruction_doctor_number_id");
    } else {
      removeRequiredBg("instruction_doctor_number_id");
    }
    if(this.state.schedule_item !== undefined){
      let item = this.state.schedule_item.dial_pattern
      if(item.reservation_time === undefined || item.reservation_time == ""){
        addRequiredBg("reservation_time_id");
      } else {
        removeRequiredBg("reservation_time_id");
      }
      if(item.bed_no === undefined || item.bed_no == 0){
        addRequiredBg("bed_no_id");
      } else {
        removeRequiredBg("bed_no_id");
      }
      if(item.console === undefined || item.console == 0){
        addRequiredBg("console_id");
      } else {
        removeRequiredBg("console_id");
      }
      if(item.group === undefined || item.group == 0){
        addRequiredBg("group_id");
      } else {
        removeRequiredBg("group_id");
      }
      if(item.dial_method === undefined || item.dial_method == 0){
        addRequiredBg("dial_method_id");
      } else {
        removeRequiredBg("dial_method_id");
      }
    }
  }

  async UNSAFE_componentWillMount() {
    let bed_master = sessApi.getObjectValue("dial_common_master", "bed_master");
    let console_master = sessApi.getObjectValue(
      "dial_common_master",
      "console_master"
    );
    let dial_method_master = sessApi.getObjectValue(
      "dial_common_master",
      "dial_method_master"
    );
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    let material_master = sessApi.getObjectValue(
      "dial_common_master",
      "material_master"
    );
    let time_zones = getTimeZoneList();
    let examinationCodeData = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "examination_master"
    );
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    this.setState({
      time_zones: time_zones != undefined ? time_zones : [],
      bed_master,
      bed_master_number_list: makeList_data(extract_enabled(bed_master)),
      console_master,
      console_master_code_list: makeList_codeName(console_master, 1),
      dial_method_master,
      dial_method_master_code_list: makeList_codeName(dial_method_master, 1),
      timingCodeData,
      timing_codes: makeList_code(timingCodeData),
      timing_codes_options: makeList_codeName(timingCodeData, 1),
      examination_codes: makeList_code(examinationCodeData),
      dial_group_codes: makeList_codeName(code_master["グループ"], 1),
      dial_group_codes2: makeList_codeName(code_master["グループ2"], 1),
      puncture_needle_a: makeList_code(material_master["穿刺針"], 1),
      puncture_needle_a_options: makeList_codeName(material_master["穿刺針"], 1),
      puncture_needle_v: makeList_code(material_master["穿刺針"], 1),
      puncture_needle_v_options: makeList_codeName(material_master["穿刺針"], 1),
      dialysates: makeList_codeName(material_master["透析液"], 1),
      disinfection_liquid: makeList_codeName(material_master["消毒薬"], 1),
      fixed_tape: makeList_codeName(material_master["固定テープ"], 1),
      examinationCodeData,
    });
    this.setReservationRange();
    await this.getPrescriptionInfo(); //処方
    await this.getDialPresInfo();
    await this.getInjectionInfo();
    await this.getFeeMasterCode();
    await this.getFeeInfo();
    await this.getInspectionInfo();
    await this.getDialyzerCode();
    await this.setDoctors();
    await this.getStaffs();
    await this.getAllMasterAnti();

    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }

    if (this.props.add_flag) {
      this.setState({
        number: 0,
        schedule_item: {
          system_patient_id: this.props.system_patient_id,
          schedule_date: this.props.schedule_date,
          patient_id: this.props.patient_info.patient_number,
          is_temporary: 1,
          dial_pattern: {
            time_zone: 1,
          },
        },
        load_status: true,
      });
    } else {
      this.setState({ load_status: true });
    }
  }

  getPrescriptionInfo = async () => {
    let path = "/app/api/v2/dial/schedule/prescription_search";
    let post_data = {
      params: {
        schedule_date: this.state.schedule_date,
        patient_id: this.state.system_patient_id,
      },
    };

    await apiClient.post(path, post_data).then((res) => {
      var temporaray_prescription_schedule = res.filter((item) => {
        if (item.is_temporary == 1) {
          return item;
        }
      });
      this.setState({
        done_prescription: res,
        temporaray_prescription_schedule,
      });
    });
  };

  async getScheduleItem(system_patient_id, schedule_date) {
    let path = "/app/api/v2/dial/schedule/dial_schedule_item";
    let post_data = {
      params: {
        schedule_date: schedule_date,
        system_patient_id: system_patient_id,
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      let default_array = this.state.default_array;
      if (res.dial_pattern != undefined)
        default_array = this.getTelegramDefaultValue(
          res.dial_pattern.dial_method
        );
      this.setState(
        {
          schedule_item: res,
          number: res.number,
          default_array,
        },
        () => {
          this.setDefaultValue(res.dial_pattern.dial_method, 0);
        }
      );
    });
  }

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
      before_start_confirm_title: "",
    });
    this.modalBlackBack();
  }

  getValue = (key, e) => {
    var temp = this.state.schedule_item;
    switch (key) {
      case "reservation_time":
        if (
          temp.dial_pattern.fluid_speed != undefined &&
          temp.dial_pattern.fluid_speed !== "" &&
          e.target.value !== ""
        ) {
          let time = e.target.value.split(":");
          if (!isNaN(parseFloat(temp.dial_pattern.fluid_speed))) {
            temp.dial_pattern.fluid_amount = (
              (parseInt(time[0]) + parseInt(time[1]) / 60) *
              parseFloat(temp.dial_pattern.fluid_speed)
            ).toFixed(1);
          }
          if (
            temp.dial_pattern.scheduled_start_time != undefined &&
            temp.dial_pattern.scheduled_start_time !== ""
          ) {
            let start_time = temp.dial_pattern.scheduled_start_time;
            start_time = start_time.split(":");
            let finish_data = "";
            let finish_minutes = parseInt(start_time[1]) + parseInt(time[1]);
            let add_hour = false;
            if (finish_minutes % 10 === 5) {
              finish_minutes += 5;
            }
            if (finish_minutes >= 60) {
              add_hour = true;
              finish_minutes -= 60;
            }
            let finish_hour = parseInt(start_time[0]) + parseInt(time[0]);
            if (add_hour) {
              finish_hour += 1;
            }
            if (finish_hour >= 24) {
              finish_hour -= 24;
            }
            if (finish_hour < 10) {
              if (finish_minutes < 10) {
                finish_data = "0" + finish_hour + ":" + "0" + finish_minutes;
              } else {
                finish_data = "0" + finish_hour + ":" + finish_minutes;
              }
            } else {
              if (finish_minutes < 10) {
                finish_data = finish_hour + ":" + "0" + finish_minutes;
              } else {
                finish_data = finish_hour + ":" + finish_minutes;
              }
            }
            temp.dial_pattern.scheduled_end_time = finish_data;
          }
        }
        temp.dial_pattern.reservation_time = e.target.value;
        break;
      case "scheduled_start_time":
        if (
          temp.dial_pattern.reservation_time != undefined &&
          temp.dial_pattern.reservation_time !== ""
        ) {
          let start_time = formatTime(e);
          if (start_time !== "") {
            start_time = start_time.split(":");
            let time = temp.dial_pattern.reservation_time;
            time = time.split(":");
            let finish_data = "";
            let finish_minutes = parseInt(start_time[1]) + parseInt(time[1]);
            let add_hour = false;
            if (finish_minutes % 10 === 5) {
              finish_minutes += 5;
            }
            if (finish_minutes >= 60) {
              add_hour = true;
              finish_minutes -= 60;
            }
            let finish_hour = parseInt(start_time[0]) + parseInt(time[0]);
            if (add_hour) {
              finish_hour += 1;
            }
            if (finish_hour >= 24) {
              finish_hour -= 24;
            }
            if (finish_hour < 10) {
              if (finish_minutes < 10) {
                finish_data = "0" + finish_hour + ":" + "0" + finish_minutes;
              } else {
                finish_data = "0" + finish_hour + ":" + finish_minutes;
              }
            } else {
              if (finish_minutes < 10) {
                finish_data = finish_hour + ":" + "0" + finish_minutes;
              } else {
                finish_data = finish_hour + ":" + finish_minutes;
              }
            }
            temp.dial_pattern.scheduled_end_time = finish_data;
          }
        }
        temp.dial_pattern.scheduled_start_time = formatTime(e);
        break;
      case "scheduled_end_time":
        temp.dial_pattern.scheduled_end_time = formatTime(e);
        break;
      case "real_hours":
        temp.real_hours = e;
        break;
      case "time_zone":
        temp.dial_pattern.time_zone = e.target.id;
        break;
      case "bed_no":
        temp.dial_pattern.bed_no = parseInt(e.target.id);
        if (parseInt(e.target.id) !== 0) {
          let cur_console = this.state.bed_master.find(
            (x) => x.number === parseInt(e.target.id)
          ).default_console_code;
          if (cur_console != null && cur_console !== "") {
            temp.dial_pattern.console = this.state.console_master.find(
              (x) => x.code === cur_console
            ).code;
          }
        }
        break;
      case "console":
        temp.dial_pattern.console = parseInt(e.target.id);
        break;
      case "group":
        temp.dial_pattern.group = e.target.id;
        break;
      case "group2":
        temp.dial_pattern.group2 = e.target.id;
        break;
      case "dial_method":
        temp.dial_pattern.dial_method = e.target.id;
        this.setDefaultValue(e.target.id, 1);
        break;
      case "dilution_timing":
        if (e.target.id === 0) {
          temp.dial_pattern.dilution_timing = null;
        } else {
          temp.dial_pattern.dilution_timing = e.target.id - 1;
        }
        break;
      case "fluid_speed":
        if (
          temp.dial_pattern.reservation_time != undefined &&
          temp.dial_pattern.reservation_time !== ""
        ) {
          let time = temp.dial_pattern.reservation_time.split(":");
          if (!isNaN(parseFloat(e))) {
            temp.dial_pattern.fluid_amount = (
              (parseInt(time[0]) + parseInt(time[1]) / 60) *
              parseFloat(e)
            ).toFixed(1);
          }
        }
        temp.dial_pattern.fluid_speed = e;
        break;
      case "hdf_init_time":
        temp.dial_pattern.hdf_init_time = e;
        break;
      case "hdf_init_amount":
        temp.dial_pattern.hdf_init_amount = e;
        break;
      case "hdf_step":
        temp.dial_pattern.hdf_step = e;
        break;
      case "hdf_speed":
        temp.dial_pattern.hdf_speed = e;
        break;
      case "fluid_temperature":
        temp.dial_pattern.fluid_temperature = e;
        break;
      case "fluid_amount":
        temp.dial_pattern.fluid_amount = e;
        break;
      case "dialysates":
        temp.dial_pattern.dial_liquid = e.target.id;
        break;
      case "dialysate_amount":
        temp.dial_pattern.dialysate_amount = e;
        break;
      case "degree":
        temp.dial_pattern.degree = e;
        break;
      case "dw":
        temp.dial_pattern.dw = e;
        break;
      case "max_drainage_amount":
        temp.dial_pattern.max_drainage_amount = e;
        break;
      case "max_drainage_speed":
        temp.dial_pattern.max_drainage_speed = e;
        break;
      case "blood_flow":
        temp.dial_pattern.blood_flow = e;
        break;
      case "fluid":
        temp.dial_pattern.fluid = e;
        break;
      case "supplementary_food":
        temp.dial_pattern.supplementary_food = e;
        break;
      case "puncture_needle_a":
        temp.dial_pattern.puncture_needle_a = e.target.id;
        break;
      case "puncture_needle_v":
        temp.dial_pattern.puncture_needle_v = e.target.id;
        break;
      case "fixed_tape":
        temp.dial_pattern.fixed_tape = e.target.id;
        break;
      case "disinfection_liquid":
        temp.dial_pattern.disinfection_liquid = e.target.id;
        break;
      case "windbag_1":
        temp.dial_pattern.windbag_1 = e;
        break;
      case "windbag_2":
        temp.dial_pattern.windbag_2 = e;
        break;
      case "windbag_3":
        temp.dial_pattern.windbag_3 = e;
        break;
      case "list_note":
        temp.dial_pattern.list_note = e.target.value;
        break;
      case "directer_name":
        temp.dial_pattern.directer_name = e.target.value;
        break;
    }
    this.change_flag = 1;
    this.setState({
      schedule_item: temp,
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
      this.change_flag = true;
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
      this.change_flag = true;
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
    this.change_flag = true;
  }

  getInputdate = (value) => {
    this.change_flag = 1;
    this.setState({ entry_date: value });
  };

  getDialPresInfo = async () => {
    let path = "/app/api/v2/dial/schedule/dial_prescription_search";
    let post_data = {
      params: {
        schedule_date: this.state.schedule_date,
        patient_id: this.state.system_patient_id,
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      this.setState({
        dial_pres: sortByTiming(res, this.state.timingCodeData),
      });
    });
  };

  getFeeInfo = async () => {
    let path = "/app/api/v2/dial/schedule/fee_schedule_search";
    let post_data = {
      params: {
        schedule_date: this.state.schedule_date,
        patient_id: this.state.system_patient_id,
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      this.setState({ manage_fee: res });
    });
  };

  getInjectionInfo = async () => {
    let path = "/app/api/v2/dial/schedule/injection_schedule_search";
    let post_data = {
      params: {
        schedule_date: this.state.schedule_date,
        patient_id: this.state.system_patient_id,
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      this.setState({
        injection: sortByTiming(res, this.state.timingCodeData),
      });
    });
  };

  getInspectionInfo = async () => {
    let path = "/app/api/v2/dial/schedule/inspection_search";
    let post_data = {
      params: {
        schedule_date: this.state.schedule_date,
        patient_id: this.state.system_patient_id,
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      this.setState({
        inspection: sortByTiming(res, this.state.timingCodeData),
      });
    });
  };

  getCheckValue = (name, value) => {
    var temp = { ...this.state.schedule_item };
    if (name === "temporary_setting") {
      temp.is_temporary = value;
    }
    this.change_flag = 1;
    this.setState({
      schedule_item: temp,
    });
  };

  checkValidation = () => {        
    let error_str_arr = [];
    let error_arr = [];
    removeRedBorder("entry_date_id");
    removeRedBorder("entry_time_id");
    removeRedBorder("reservation_time_id");
    removeRedBorder("bed_no_id");
    removeRedBorder("console_id");
    removeRedBorder("group_id");
    removeRedBorder("dial_method_id");
    removeRedBorder("dilution_timing_id");

    if (this.state.schedule_item.dial_pattern.reservation_time == undefined ||
      this.state.schedule_item.dial_pattern.reservation_time === ""
    ) {
      error_str_arr.push("透析時間を選択してください。");
      error_arr.push({
        tag_id:'reservation_time_id'
      });
      addRedBorder("reservation_time_id");
    }
    if (this.state.schedule_item.dial_pattern.bed_no == undefined ||
      this.state.schedule_item.dial_pattern.bed_no === 0
    ) {
      error_str_arr.push("ベッドNoを選択してください。");
      error_arr.push({
        tag_id:'bed_no_id'
      });
      addRedBorder("bed_no_id");
    }
    if (
      this.state.schedule_item.dial_pattern.console == undefined ||
      this.state.schedule_item.dial_pattern.console === 0
    ) {
      error_str_arr.push("コンソールを選択してください。");
      error_arr.push({
        tag_id:'console_id'
      });
      addRedBorder("console_id");
    }
    if (
      this.state.schedule_item.dial_pattern.group == undefined ||
      this.state.schedule_item.dial_pattern.group === 0
    ) {
      error_str_arr.push("グループを選択してください。");
      error_arr.push({
        tag_id:'group_id'
      });
      addRedBorder("group_id");
    }
    if (
      this.state.schedule_item.dial_pattern.dial_method == undefined ||
      this.state.schedule_item.dial_pattern.dial_method === 0
    ) {
      error_str_arr.push("治療法を選択してください。");
      error_arr.push({
        tag_id:'dial_method_id'
      });
      addRedBorder("dial_method_id");
    } else {
      let dial_method = this.state.schedule_item.dial_pattern.dial_method;
      let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
      Object.keys(telegramDefaultData).map(telegram_item=>{
        if(telegramDefaultData[telegram_item]['is_required'] == 1 && this.state.schedule_item.dial_pattern[telegram_item] == ""){
          error_str_arr.push(telegramDefaultData[telegram_item]['title']+"を"+(telegram_item == "dilution_timing" ? "選択" : "入力")+"してください。");
          error_arr.push({
            tag_id:telegram_item+'_id'
          });
        }
      })
    }
    if(this.state.entry_date == "" || this.state.entry_date == null){
      error_str_arr.push("入力日を選択してください。");
      error_arr.push({
        tag_id:'entry_date_id'
      });
      addRedBorder("entry_date_id");
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      error_str_arr.push("入力時間を選択してください。");
      error_arr.push({
        tag_id:'entry_time_id'
      });
      addRedBorder("entry_time_id");
    }
    this.setState({error_arr});
    return error_str_arr;
  }

  saveEditedSchedule = () => {
    if(this.change_flag == 0){
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
    var temp = this.state.schedule_item;
    
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
        this.setState({check_message:error_str_array.join('\n')});
        return;
    }

    
    if (this.state.instruction_doctor_number === 0) {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.fluid_temperature != null &&
      this.state.schedule_item.dial_pattern.fluid_temperature !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.fluid_temperature))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "補液温度を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.fluid_speed != null &&
      this.state.schedule_item.dial_pattern.fluid_speed !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.fluid_speed))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "補液速度を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.hdf_init_time != null &&
      this.state.schedule_item.dial_pattern.hdf_init_time !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.hdf_init_time))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "I-HDF 補液開始時間を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.hdf_init_amount != null &&
      this.state.schedule_item.dial_pattern.hdf_init_amount !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.hdf_init_amount))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "I-HDF 1回補液量を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.hdf_step != null &&
      this.state.schedule_item.dial_pattern.hdf_step !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.hdf_step))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "I-HDF 補液間隔を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.hdf_speed != null &&
      this.state.schedule_item.dial_pattern.hdf_speed !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.hdf_speed))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "I-HDF 1回補液速度を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.dialysate_amount != null &&
      this.state.schedule_item.dial_pattern.dialysate_amount !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.dialysate_amount))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "血流量を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.degree != null &&
      this.state.schedule_item.dial_pattern.degree !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.degree))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "透析液温度を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.dw != null &&
      this.state.schedule_item.dial_pattern.dw !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.dw))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "DWを数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.max_drainage_amount != null &&
      this.state.schedule_item.dial_pattern.max_drainage_amount !== "" &&
      isNaN(
        parseFloat(this.state.schedule_item.dial_pattern.max_drainage_amount)
      )
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "最大除水量を数字で入力してください。"
      );
      return;
    }
    if (
      this.state.schedule_item.dial_pattern.max_drainage_speed != undefined &&
      this.state.schedule_item.dial_pattern.max_drainage_speed !== "" &&
      isNaN(
        parseFloat(this.state.schedule_item.dial_pattern.max_drainage_speed)
      )
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "最大除水速度を数字で入力してください。"
      );
      return;
    }
    if (
      this.state.schedule_item.dial_pattern.blood_flow != null &&
      this.state.schedule_item.dial_pattern.blood_flow !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.blood_flow))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "血液ポンプ速度を数字で入力してください。"
      );
      return;
    }
    if (
      this.state.schedule_item.dial_pattern.fluid != null &&
      this.state.schedule_item.dial_pattern.fluid !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.fluid))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "補液を数字で入力してください。"
      );
      return;
    }
    if (
      this.state.schedule_item.dial_pattern.supplementary_food != null &&
      this.state.schedule_item.dial_pattern.supplementary_food !== "" &&
      isNaN(
        parseFloat(this.state.schedule_item.dial_pattern.supplementary_food)
      )
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "補食を数字で入力してください。"
      );
      return;
    }

    if (
      this.state.schedule_item.dial_pattern.windbag_1 != null &&
      this.state.schedule_item.dial_pattern.windbag_1 !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.windbag_1))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "風袋1を数字で入力してください。"
      );
      return;
    }
    if (
      this.state.schedule_item.dial_pattern.windbag_2 != null &&
      this.state.schedule_item.dial_pattern.windbag_2 !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.windbag_2))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "風袋2を数字で入力してください。"
      );
      return;
    }
    if (
      this.state.schedule_item.dial_pattern.windbag_3 != null &&
      this.state.schedule_item.dial_pattern.windbag_3 !== "" &&
      isNaN(parseFloat(this.state.schedule_item.dial_pattern.windbag_3))
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "風袋3を数字で入力してください。"
      );
      return;
    }

    temp.is_updated = 1;
    // if (this.state.console_master_code_list.find((x) => x.id === temp.dial_pattern.console) === undefined) {
    //   temp.dial_pattern.console = 0;
    // }

    if (
      this.state.dialysates.filter(
        (x) => x.code == temp.dial_pattern.dial_liquid
      ) == []
    ) {
      // if((temp.dial_pattern.dial_liquid in this.state.dialysates) === false ){
      temp.dial_pattern.dial_liquid = 0;
    }

    if (
      temp.dial_pattern.puncture_needle_a in this.state.puncture_needle_a ===
      false
    ) {
      temp.dial_pattern.puncture_needle_a = 0;
    }

    if (
      temp.dial_pattern.puncture_needle_v in this.state.puncture_needle_v ===
      false
    ) {
      temp.dial_pattern.puncture_needle_v = 0;
    }

    if (
      this.state.fixed_tape.filter(
        (x) => x.code == temp.dial_pattern.fixed_tape
      ) == []
    ) {
      // if((temp.dial_pattern.fixed_tape in this.state.fixed_tape) === false ){
      temp.dial_pattern.fixed_tape = 0;
    }

    if (
      this.state.disinfection_liquid.filter(
        (x) => x.code == temp.dial_pattern.disinfection_liquid
      ) == []
    ) {
      // if((temp.dial_pattern.disinfection_liquid in this.state.disinfection_liquid) === false ){
      temp.dial_pattern.disinfection_liquid = 0;
    }
    temp.instruction_doctor_number = this.state.instruction_doctor_number;
    temp.updated_at =
      formatDateLine(this.state.entry_date) +
      " " +
      formatTime(this.state.entry_time);

    temp.pgroup = temp.dial_pattern.group;
    if (
      temp.pre_start_confirm_at != undefined &&
      temp.pre_start_confirm_at != null &&
      temp.pre_start_confirm_at !== ""
    ) {
      if (temp.start_date != null || temp.console_start_date != null){
        window.sessionStorage.setItem("alert_messages", "開始済みエラー##" + '透析を開始したスケジュールは、ベッドサイド支援から変更してください');
        return;
      }
      this.setState({
        before_start_confirm_title: "変更確認",
        confirm_message: "このスケジュールは開始前確認が完了していますが、変更しますか？\n（開始前確認は未了に戻ります）",
        before_confirm_schedule_item: temp,
      });
      this.modalBlack();
      return;
    }
    this.setState({
      schedule_item: temp,
      isUpdateConfirmModal: true,
      confirm_message: this.props.add_flag
        ? "スケジュール情報を登録しますか?"
        : "スケジュール情報を変更しますか?",
    });
    this.modalBlack();
    // this.setState({
    //   schedule_item:temp}, ()=>{
    //     this.updateSchedule();
    //   });
  };
  confirmOkBefore = () => {
    this.updateSchedule();
  }

  async updateSchedule() {
    this.confirmCancel();
    let path = "/app/api/v2/dial/schedule/dial_schedule_update";
    // let state_data = this.state;
    let state_data = { schedule_item: this.state.schedule_item };
    state_data.schedule_item.pre_start_confirm_at = null;
    state_data.schedule_item.pre_start_confirm_by = null;
    const post_data = {
      params: state_data,
    };
    apiClient
      .post(path, post_data)
      .then((res) => {
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        this.props.handleOk(this.state.schedule_item);
      })
      .catch(() => {});
  }

  selectDoctor = (doctor) => {
    this.change_flag = 1;
    this.setState(
      {
        instruction_doctor_number: doctor.number,
      },
      () => {
        this.context.$updateDoctor(doctor.number, doctor.name);

        this.closeDoctorSelectModal();
      }
    );
  };

  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_number > 0) {
      this.setState({
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

  getDiffMinutes(first_dt, second_dt) {
    if (
      first_dt == undefined ||
      second_dt == undefined ||
      first_dt == null ||
      first_dt === "" ||
      second_dt == null ||
      second_dt === ""
    )
      return "-- : --";
    let first_time = formatTimeIE(first_dt).split(":");
    let first_minute = parseInt(first_time[0]) * 60 + parseInt(first_time[1]);
    let second_time = formatTimeIE(second_dt).split(":");
    let second_minute =
      parseInt(second_time[0]) * 60 + parseInt(second_time[1]);
    let result = [];
    result[0] = parseInt((first_minute - second_minute) / 60);
    result[1] = parseInt(first_minute - second_minute) % 60;
    if (result[0] < 0 || result[1] < 0) return;
    var temp = "";
    if (isNaN(result[0]) || isNaN(result[1])) return;
    if (parseInt(result[0]) < 10) {
      temp = parseInt(result[0]);
      result[0] = "0" + temp.toString();
    }
    if (parseInt(result[1]) < 10) {
      temp = parseInt(result[1]);
      result[1] = "0" + temp.toString();
    }
    return result.join(":");
  }

  setReservationRange() {
    let dial_tiems = [
      { id: 0, value: "" },
      { id: 1, value: "3:00" },
      { id: 2, value: "3:30" },
      { id: 3, value: "4:00" },
      { id: 4, value: "4:30" },
      { id: 5, value: "4:45" },
      { id: 6, value: "5:00" },
      { id: 7, value: "6:00" },
      { id: 8, value: "6:30" },
      { id: 9, value: "7:00" },
      { id: 10, value: "" },
    ];
    let index = 11;
    for (let hour = 1; hour < 8; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 5) {
        let dial_tiem = "";
        if (minutes < 10) {
          dial_tiem = { id: index, value: hour + ":" + "0" + minutes };
        } else {
          dial_tiem = { id: index, value: hour + ":" + minutes };
        }
        dial_tiems[index] = dial_tiem;
        index++;
      }
    }
    dial_tiems[index] = { id: index, value: "8:00" };
    this.setState({ dial_tiems });
  }

  setDefaultValue = (dial_method = 0, change_flag = 0) => {
    let default_array = this.getTelegramDefaultValue(dial_method);
    let temp = this.state.schedule_item;
    if (
      default_array != undefined &&
      default_array != null &&
      Object.keys(default_array).length !== 0
    ) {
      Object.keys(default_array).map((index) => {
        let item = default_array[index];
        if (item.is_usable === 0) {
          if (
            index == "weight_before" ||
            index == "target_water_removal_amount"
          ) {
            temp[index] = "";
          } else if (
            index == "syringe_stop_time" ||
            index == "syringe_speed" ||
            index == "syringe_amount"
          ) {
            temp.dial_anti[index] = "";
          } else {
            temp.dial_pattern[index] = "";
          }
        }
      });
      let dial_pattern = temp.dial_pattern;
      if (this.props.add_flag) {
        if (default_array.dw.is_usable === 1) {
          if (
            (dial_pattern["dw"] === undefined || dial_pattern["dw"] === "") &&
            default_array.dw.default_value !== "" &&
            default_array.dw.default_value != null &&
            default_array.dw.default_value !== "0"
          ) {
            temp.dial_pattern["dw"] = parseFloat(
              default_array.dw.default_value
            ).toFixed(1);
          }
        } else {
          temp.dial_pattern["dw"] = "";
        }
        if (default_array.fluid_amount.is_usable === 1) {
          if (
            (dial_pattern["fluid_amount"] === undefined ||
              dial_pattern["fluid_amount"] === "") &&
            default_array.fluid_amount.default_value !== "" &&
            default_array.fluid_amount.default_value != null &&
            default_array.fluid_amount.default_value !== "0"
          ) {
            temp.dial_pattern["fluid_amount"] =
              default_array.fluid_amount.default_value;
          }
        } else {
          temp.dial_pattern["fluid_amount"] = "";
        }
        if (default_array.fluid_speed.is_usable === 1) {
          if (
            (dial_pattern["fluid_speed"] === undefined ||
              dial_pattern["fluid_speed"] === "") &&
            default_array.fluid_speed.default_value !== "" &&
            default_array.fluid_speed.default_value != null &&
            default_array.fluid_speed.default_value !== "0"
          ) {
            temp.dial_pattern["fluid_speed"] =
              default_array.fluid_speed.default_value;
          }
        } else {
          temp.dial_pattern["fluid_speed"] = "";
        }

        if (default_array.blood_flow.is_usable === 1) {
          if (
            (dial_pattern["blood_flow"] === undefined ||
              dial_pattern["blood_flow"] === "") &&
            default_array.blood_flow.default_value !== "" &&
            default_array.blood_flow.default_value != null &&
            default_array.blood_flow.default_value !== "0"
          ) {
            temp.dial_pattern["blood_flow"] =
              default_array.blood_flow.default_value;
          }
        } else {
          temp.dial_pattern["blood_flow"] = "";
        }
        if (default_array.degree.is_usable === 1) {
          if (
            (dial_pattern["degree"] === undefined ||
              dial_pattern["degree"] === "") &&
            default_array.degree.default_value !== "" &&
            default_array.degree.default_value != null &&
            default_array.degree.default_value !== "0"
          ) {
            temp.dial_pattern["degree"] = default_array.degree.default_value;
          }
        } else {
          temp.dial_pattern["degree"] = "";
        }
        if (default_array.fluid_temperature.is_usable === 1) {
          if (
            (dial_pattern["fluid_temperature"] === undefined ||
              dial_pattern["fluid_temperature"] === "") &&
            default_array.fluid_temperature.default_value !== "" &&
            default_array.fluid_temperature.default_value != null &&
            default_array.fluid_temperature.default_value !== "0"
          ) {
            temp.dial_pattern["fluid_temperature"] =
              default_array.fluid_temperature.default_value;
          }
        } else {
          temp.dial_pattern["fluid_temperature"] = "";
        }
        if (default_array.dialysate_amount.is_usable === 1) {
          if (
            (dial_pattern["dialysate_amount"] === undefined ||
              dial_pattern["dialysate_amount"] === "") &&
            default_array.dialysate_amount.default_value !== "" &&
            default_array.dialysate_amount.default_value != null &&
            default_array.dialysate_amount.default_value !== "0"
          ) {
            temp.dial_pattern["dialysate_amount"] =
              default_array.dialysate_amount.default_value;
          }
        } else {
          temp.dial_pattern["dialysate_amount"] = "";
        }
        if (default_array.hdf_init_time.is_usable === 1) {
          if (
            (dial_pattern["hdf_init_time"] === undefined ||
              dial_pattern["hdf_init_time"] === "") &&
            default_array.hdf_init_time.default_value !== "" &&
            default_array.hdf_init_time.default_value != null &&
            default_array.hdf_init_time.default_value !== "0"
          ) {
            temp.dial_pattern["hdf_init_time"] =
              default_array.hdf_init_time.default_value;
          }
        } else {
          temp.dial_pattern["hdf_init_time"] = "";
        }
        if (default_array.hdf_init_amount.is_usable === 1) {
          if (
            (dial_pattern["hdf_init_amount"] === undefined ||
              dial_pattern["hdf_init_amount"] === "") &&
            default_array.hdf_init_amount.default_value !== "" &&
            default_array.hdf_init_amount.default_value != null &&
            default_array.hdf_init_amount.default_value !== "0"
          ) {
            temp.dial_pattern["hdf_init_amount"] =
              default_array.hdf_init_amount.default_value;
          }
        } else {
          temp.dial_pattern["hdf_init_amount"] = "";
        }
        if (default_array.hdf_step.is_usable === 1) {
          if (
            (dial_pattern["hdf_step"] === undefined ||
              dial_pattern["hdf_step"] === "") &&
            default_array.hdf_step.default_value !== "" &&
            default_array.hdf_step.default_value != null &&
            default_array.hdf_step.default_value !== "0"
          ) {
            temp.dial_pattern["hdf_step"] =
              default_array.hdf_step.default_value;
          }
        } else {
          temp.dial_pattern["hdf_step"] = "";
        }
        if (default_array.hdf_speed.is_usable === 1) {
          if (
            (dial_pattern["hdf_speed"] === undefined ||
              dial_pattern["hdf_speed"] === "") &&
            default_array.hdf_speed.default_value !== "" &&
            default_array.hdf_speed.default_value != null &&
            default_array.hdf_speed.default_value !== "0"
          ) {
            temp.dial_pattern["hdf_speed"] =
              default_array.hdf_speed.default_value;
          }
        } else {
          temp.dial_pattern["hdf_speed"] = "";
        }
        if (default_array.dilution_timing.is_usable === 1) {
          if (
            (dial_pattern["dilution_timing"] === undefined ||
              dial_pattern["dilution_timing"] === "") &&
            default_array.dilution_timing.default_value !== "" &&
            default_array.dilution_timing.default_value != null
          ) {
            temp.dial_pattern["dilution_timing"] =
              parseInt(default_array.dilution_timing.default_value) + 1;
          }
        } else {
          temp.dial_pattern["dilution_timing"] = 0;
        }
      }
    }
    if (change_flag != 0)
      this.change_flag = 1;
    this.setState({
      schedule_item: temp,
      default_array,
    });
  };

  onHide = () => {};

  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message : "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type : "close",
        confirm_alert_title:'入力中'
      })
      this.modalBlack();
    } else {
      this.props.closeModal();
    }
  }

  closeAlertModal = () => {
    this.setState({check_message: ''});
    if(this.state.error_arr.length > 0){
      let first_obj = this.state.error_arr[0];
      $("#" + first_obj.tag_id).focus();
    }
  }
  modalBlack() {
    var base_modal = document.getElementsByClassName("dailysis-schedule-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("dailysis-schedule-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }

  convertDecimal = (_val, _digits) => {
        if (isNaN(parseFloat(_val))) return "";
        return parseFloat(_val).toFixed(_digits);
    } 

  render() {    
    let {
      dial_group_codes,
      dial_group_codes2,
      dialysates,
      puncture_needle_a,
      puncture_needle_a_options,
      puncture_needle_v,
      puncture_needle_v_options,
      fixed_tape,
      disinfection_liquid,
      default_array,
      done_prescription,
    } = this.state;
    let dialyser = [];
    let dial_anti = {};
    let real_hours = "";
    if (this.state.schedule_item != undefined) {
      dialyser = this.state.schedule_item.dial_dialyzer;
      dial_anti = this.state.schedule_item.dial_anti;
      let start_time =
        this.state.schedule_item.start_date != null
          ? this.state.schedule_item.start_date
          : this.state.schedule_item.console_start_date;
      // let end_time = this.state.schedule_item.end_date != null? this.state.schedule_item.end_date : this.state.schedule_item.console_end_date;
      let end_time = this.state.schedule_item.end_date;
      real_hours = this.getDiffMinutes(end_time, start_time);
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal dailysis-schedule-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            透析スケジュール{this.props.add_flag ? "登録" : "編集"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>          
            <Wrapper>
              {this.state.load_status === false ? (
                <div className="spinner_area no-result">
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              ) : (
                <>
                  {this.state.schedule_item !== undefined && (
                    <>
                      <div className="modal_header">
                        {this.state.schedule_item.done_status === 1 && (
                          <span className="done_schedule done_flag">実施済</span>
                        )}
                        {this.state.schedule_item.done_status === 0 && (
                          <span className="no_done_schedule done_flag">
                            未実施
                          </span>
                        )}

                        {this.props.add_flag && (
                          <>
                            <span className="patient_id">
                              {this.props.patient_info.patient_number} :{" "}
                            </span>
                            <span className="patient_name">
                              {this.props.patient_info.patient_name}
                            </span>
                            <span className="schedule_date">
                              {formatJapanDate(new Date(this.props.schedule_date))}
                            </span>
                          </>
                        )}
                        {this.props.add_flag === false && (
                          <>
                            <span className="patient_id">
                              {this.state.schedule_item.patient_number} :{" "}
                            </span>
                            <span className="patient_name">
                              {this.state.schedule_item.patient_name}
                            </span>
                            <span className="schedule_date">
                              {formatJapanDate(new Date(this.state.schedule_item.schedule_date))}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="dailysis_condition">
                        <div className="first_edit_area">
                          <div className="inline_input reservation_time" style={{marginTop:"-8px"}}>
                            <SelectorWithLabel
                              title="透析時間"
                              id='reservation_time_id'
                              options={
                                this.state.dial_tiems != undefined &&
                                this.state.dial_tiems != null &&
                                this.state.dial_tiems
                              }
                              getSelect={this.getValue.bind(
                                this,
                                "reservation_time"
                              )}
                              value={
                                Object.keys(default_array).length !== 0 &&
                                default_array.diagonosis_time.is_usable === 0
                                  ? ""
                                  : this.state.schedule_item.dial_pattern
                                      .reservation_time
                              }
                              isDisabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.diagonosis_time.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input datepicker flex">
                            <label>開始予定時刻</label>
                            <DatePicker
                              selected={formatTimePicker(
                                this.state.schedule_item.dial_pattern
                                  .scheduled_start_time
                              )}
                              onChange={this.getValue.bind(
                                this,
                                "scheduled_start_time"
                              )}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={10}
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              timeCaption="時間"
                            />
                          </div>
                          <div className="inline_input datepicker flex">
                            <label>終了予定時刻</label>
                            <DatePicker
                              selected={formatTimePicker(
                                this.state.schedule_item.dial_pattern
                                  .scheduled_end_time
                              )}
                              onChange={this.getValue.bind(
                                this,
                                "scheduled_end_time"
                              )}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={10}
                              dateFormat="HH:mm"
                              timeCaption="時間"
                              timeFormat="HH:mm"
                            />
                          </div>
                          <div className="inline_input datepicker flex real_hours">
                            <InputBoxTag
                              label="実績時間"
                              placeholder=""
                              className="left"
                              // getInputText={this.getValue.bind(this, 'fluid_speed')}
                              value={real_hours}
                            />
                            {/*<label>実績時間</label>*/}
                            {/*<DatePicker*/}
                            {/*selected={this.state.schedule_item.real_hours === null ?(this.getDiffMinutes(this.state.schedule_item.end_date, this.state.schedule_item.start_date)) : this.state.schedule_item.real_hours}*/}
                            {/*onChange={this.getValue.bind(this,'real_hours')}*/}
                            {/*showTimeSelect*/}
                            {/*showTimeSelectOnly*/}
                            {/*timeIntervals={10}*/}
                            {/*dateFormat="HH:mm"*/}
                            {/*timeFormat="HH:mm"*/}
                            {/*/>*/}
                          </div>
                          <div className='mtop4'>
                            <SelectorWithLabel                          
                              options={this.state.time_zones}
                              title="時間帯"
                              getSelect={this.getValue.bind(this, "time_zone")}
                              departmentEditCode={
                                this.state.schedule_item.dial_pattern.time_zone
                              }
                              // value={this.state.displayOrder}
                            />
                          </div>
                          <div className='mtop4'>
                            <SelectorWithLabel                          
                              options={this.state.bed_master_number_list}
                              title="ベッドNo"
                              id='bed_no_id'
                              getSelect={this.getValue.bind(this, "bed_no")}
                              departmentEditCode={
                                this.state.schedule_item.dial_pattern.bed_no
                              }
                            />
                          </div>
                          <div className='mtop4'>
                            <SelectorWithLabel                            
                              options={this.state.console_master_code_list}
                              title="コンソール"
                              id='console_id'
                              getSelect={this.getValue.bind(this, "console")}
                              departmentEditCode={
                                this.state.schedule_item.dial_pattern.console
                              }
                            />
                          </div>
                          <div className='mtop4'>
                            <SelectorWithLabel                            
                              options={dial_group_codes}
                              title="グループ"
                              id='group_id'
                              getSelect={this.getValue.bind(this, "group")}
                              departmentEditCode={
                                this.state.schedule_item.dial_pattern.group
                              }
                            />
                          </div>
                          
                        </div>
                        <div className="second_edit_area">
                          <SelectorWithLabel
                            options={dial_group_codes2}
                            title="グループ2"
                            getSelect={this.getValue.bind(this, "group2")}
                            departmentEditCode={
                              this.state.schedule_item.dial_pattern.group2
                            }
                          />
                          <SelectorWithLabel
                            options={this.state.dial_method_master_code_list}
                            title="治療法"
                            id='dial_method_id'
                            getSelect={this.getValue.bind(this, "dial_method")}
                            departmentEditCode={
                              this.state.schedule_item.dial_pattern.dial_method
                            }
                          />
                          <SelectorWithLabel
                            options={dialysates}
                            title="透析液"
                            getSelect={this.getValue.bind(this, "dialysates")}
                            departmentEditCode={this.state.schedule_item.dial_pattern.dial_liquid}
                          />
                          <SelectorWithLabel
                            options={puncture_needle_a_options}
                            title="穿刺針A"
                            getSelect={this.getValue.bind(
                              this,
                              "puncture_needle_a"
                            )}
                            departmentEditCode={
                              puncture_needle_a != undefined &&
                              puncture_needle_a[
                                this.state.schedule_item.dial_pattern
                                  .puncture_needle_a
                              ] != undefined
                                ? this.state.schedule_item.dial_pattern
                                    .puncture_needle_a
                                : 0
                            }
                          />
                          <SelectorWithLabel
                            options={puncture_needle_v_options}
                            title="穿刺針V"
                            getSelect={this.getValue.bind(
                              this,
                              "puncture_needle_v"
                            )}
                            departmentEditCode={
                              puncture_needle_v != undefined &&
                              puncture_needle_v[
                                this.state.schedule_item.dial_pattern
                                  .puncture_needle_v
                              ] != undefined
                                ? this.state.schedule_item.dial_pattern
                                    .puncture_needle_v
                                : 0
                            }
                          />
                          <SelectorWithLabel
                            options={dilution_timings}
                            title="前後補液"
                            id="dilution_timing_id"
                            getSelect={this.getValue.bind(
                              this,
                              "dilution_timing"
                            )}
                            departmentEditCode={
                              this.state.schedule_item.dial_pattern
                                .dilution_timing == null ||
                              this.state.schedule_item.dial_pattern
                                .dilution_timing === ""
                                ? 0
                                : this.state.schedule_item.dial_pattern
                                    .dilution_timing
                            }
                            isDisabled={
                              Object.keys(default_array).length !== 0 &&
                              default_array.dilution_timing.is_usable !==
                                undefined &&
                              default_array.dilution_timing.is_usable === 0
                            }
                          />
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="補液温度"
                              id='fluid_temperature_id'
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["fluid_temperature"] !==
                                  undefined
                                  ? this.pattern_unit["fluid_temperature"][
                                      "value"
                                    ]
                                  : ""
                              }
                              className="form-control"
                              value={
                                this.state.schedule_item.dial_pattern
                                  .fluid_temperature
                              }
                              getInputText={this.getValue.bind(
                                this,
                                "fluid_temperature"
                              )}
                              min={34}
                              max={41}
                              step={0.1}
                              precision={1}
                              size={5}
                              inputmode="numeric"
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.fluid_temperature.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="補液速度"
                              id='fluid_speed_id'
                              type="number"
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["fluid_speed"] !== undefined
                                  ? this.pattern_unit["fluid_speed"]["value"]
                                  : ""
                              }
                              placeholder=""
                              step={0.1}
                              getInputText={this.getValue.bind(
                                this,
                                "fluid_speed"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern.fluid_speed
                              }
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.fluid_speed.is_usable === 0
                              }
                              precision={this.decimal_info!=null && this.decimal_info['fluid_speed'] !=undefined? this.decimal_info['fluid_speed']['value']: 1}
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="補液量"
                              id='fluid_amount_id'
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["fluid_amount"] !== undefined
                                  ? this.pattern_unit["fluid_amount"]["value"]
                                  : ""
                              }
                              placeholder=""
                              step={0.1}
                              getInputText={this.getValue.bind(
                                this,
                                "fluid_amount"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern.fluid_amount
                              }
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.fluid_amount.is_usable === 0
                              }
                              precision={this.decimal_info!=null && this.decimal_info['fluid_amount'] !=undefined? this.decimal_info['fluid_amount']['value']: 1}
                            />
                          </div>
                        </div>
                        <div className="one_fourth third_edit_area" style={{width: this.state.third_obj_width}}>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="I-HDF 補液開始時間"
                              id='hdf_init_time_id'
                              type="number"
                              placeholder=""
                              step={1}
                              getInputText={this.getValue.bind(
                                this,
                                "hdf_init_time"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern
                                  .hdf_init_time
                              }
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["hdf_init_time"] !== undefined
                                  ? this.pattern_unit["hdf_init_time"]["value"]
                                  : ""
                              }
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.hdf_init_time.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="I-HDF 1回補液量"
                              type="number"
                              id='hdf_init_amount_id'
                              placeholder=""
                              step={0.1}
                              getInputText={this.getValue.bind(
                                this,
                                "hdf_init_amount"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern
                                  .hdf_init_amount
                              }
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["hdf_init_amount"] !== undefined
                                  ? this.pattern_unit["hdf_init_amount"]["value"]
                                  : ""
                              }
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.hdf_init_amount.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="I-HDF 補液間隔"
                              type="text"
                              id='hdf_step_id'
                              placeholder=""
                              step={1}
                              getInputText={this.getValue.bind(this, "hdf_step")}
                              value={
                                this.state.schedule_item.dial_pattern.hdf_step
                              }
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["hdf_step"] !== undefined
                                  ? this.pattern_unit["hdf_step"]["value"]
                                  : ""
                              }
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.hdf_step.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="I-HDF 1回補液速度"
                              type="number"
                              id='hdf_speed_id'
                              placeholder=""
                              step={0.1}
                              getInputText={this.getValue.bind(this, "hdf_speed")}
                              value={
                                this.state.schedule_item.dial_pattern.hdf_speed
                              }
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["hdf_speed"] !== undefined
                                  ? this.pattern_unit["hdf_speed"]["value"]
                                  : ""
                              }
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.hdf_speed.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="透析液流量"
                              type="number"
                              id='dialysate_amount_id'
                              placeholder=""
                              step={10}
                              getInputText={this.getValue.bind(
                                this,
                                "dialysate_amount"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern
                                  .dialysate_amount
                              }
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["dialysate_amount"] !==
                                  undefined
                                  ? this.pattern_unit["dialysate_amount"]["value"]
                                  : ""
                              }
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.dialysate_amount.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="透析液温度"
                              id='degree_id'
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["degree"] !== undefined
                                  ? this.pattern_unit["degree"]["value"]
                                  : ""
                              }
                              className="form-control"
                              value={this.state.schedule_item.dial_pattern.degree}
                              getInputText={this.getValue.bind(this, "degree")}
                              min={34}
                              max={41}
                              step={0.1}
                              precision={1}
                              size={5}
                              inputmode="numeric"
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.degree.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="DW"
                              id='dw_id'
                              type="number"
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["dw"] !== undefined
                                  ? this.pattern_unit["dw"]["value"]
                                  : ""
                              }
                              placeholder=""
                              step={0.1}
                              precision={this.decimal_info!=null && this.decimal_info['dw'] !=undefined? this.decimal_info['dw']['value']: 1}
                              getInputText={this.getValue.bind(this, "dw")}                            
                              value={this.state.schedule_item.dial_pattern.dw > 0 ? parseFloat(this.state.schedule_item.dial_pattern.dw).toFixed(1) : ""}
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.dw.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="最大除水量"
                              id='max_drainage_amount_id'
                              type="number"
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["max_drainage_amount"] !==
                                  undefined
                                  ? this.pattern_unit["max_drainage_amount"][
                                      "value"
                                    ]
                                  : ""
                              }
                              placeholder=""
                              step={0.1}
                              getInputText={this.getValue.bind(
                                this,
                                "max_drainage_amount"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern
                                  .max_drainage_amount
                              }
                              precision={this.decimal_info!=null && this.decimal_info['max_drainage_amount'] !=undefined? this.decimal_info['max_drainage_amount']['value']: 1}
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="最大除水速度"
                              id='max_drainage_speed_id'
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["max_drainage_speed"] !==
                                  undefined
                                  ? this.pattern_unit["max_drainage_speed"][
                                      "value"
                                    ]
                                  : ""
                              }
                              type="number"
                              placeholder=""
                              step={0.1}
                              getInputText={this.getValue.bind(
                                this,
                                "max_drainage_speed"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern
                                  .max_drainage_speed
                              }
                              precision={this.decimal_info!=null && this.decimal_info['max_drainage_speed'] !=undefined? this.decimal_info['max_drainage_speed']['value']: 1}
                            />
                          </div>
                        </div>
                        <div className="last_edit_area" style={{width:this.state.forth_obj_width}}>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="血流量"
                              id='blood_flow_id'
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["blood_flow"] !== undefined
                                  ? this.pattern_unit["blood_flow"]["value"]
                                  : ""
                              }
                              type="number"
                              placeholder=""
                              step={10}
                              getInputText={this.getValue.bind(
                                this,
                                "blood_flow"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern.blood_flow
                              }
                              disabled={
                                Object.keys(default_array).length !== 0 &&
                                default_array.blood_flow.is_usable === 0
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="補液"
                              id='fluid_id'
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["fluid"] !== undefined
                                  ? this.pattern_unit["fluid"]["value"]
                                  : ""
                              }
                              type="number"
                              placeholder=""
                              step={0.1}
                              getInputText={this.getValue.bind(this, "fluid")}
                              value={this.state.schedule_item.dial_pattern.fluid}
                              precision={this.decimal_info!=null && this.decimal_info['fluid'] !=undefined? this.decimal_info['fluid']['value']: 1}
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="補食"
                              type="number"
                              id='supplementary_food_id'
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["supplementary_food"] !==
                                  undefined
                                  ? this.pattern_unit["supplementary_food"][
                                      "value"
                                    ]
                                  : ""
                              }
                              placeholder=""
                              step={0.1}                            
                              getInputText={this.getValue.bind(
                                this,
                                "supplementary_food"
                              )}
                              value={
                                this.state.schedule_item.dial_pattern
                                  .supplementary_food
                              }
                              precision={this.decimal_info!=null && this.decimal_info['supplementary_food'] !=undefined? this.decimal_info['supplementary_food']['value']: 2}
                            />
                          </div>
                          <div className="fixed-tape-disinfection-liquid">
                            <SelectorWithLabel
                              options={fixed_tape}
                              title="固定テープ"
                              getSelect={this.getValue.bind(this, "fixed_tape")}
                              departmentEditCode={
                                this.state.schedule_item.dial_pattern.fixed_tape
                              }
                            />
                            <SelectorWithLabel
                              options={disinfection_liquid}
                              title="消毒液"
                              getSelect={this.getValue.bind(
                                this,
                                "disinfection_liquid"
                              )}
                              departmentEditCode={
                                this.state.schedule_item.dial_pattern
                                  .disinfection_liquid
                              }
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="風袋1"
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["windbag_1"] !== undefined
                                  ? this.pattern_unit["windbag_1"]["value"]
                                  : ""
                              }
                              type="number"
                              placeholder=""
                              step={0.1}
                              getInputText={this.getValue.bind(this, "windbag_1")}
                              value={
                                this.state.schedule_item.dial_pattern.windbag_1
                              }
                              precision={this.decimal_info!=null && this.decimal_info['windbag_1'] !=undefined? this.decimal_info['windbag_1']['value']: 1}
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="風袋2"
                              type="number"
                              placeholder=""
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["windbag_2"] !== undefined
                                  ? this.pattern_unit["windbag_2"]["value"]
                                  : ""
                              }
                              step={0.1}
                              getInputText={this.getValue.bind(this, "windbag_2")}
                              value={
                                this.state.schedule_item.dial_pattern.windbag_2
                              }
                              precision={this.decimal_info!=null && this.decimal_info['windbag_2'] !=undefined? this.decimal_info['windbag_2']['value']: 1}
                            />
                          </div>
                          <div className="inline_input temperature-div">
                            <NumericInputWithUnitLabel
                              label="風袋3"
                              type="number"
                              placeholder=""
                              unit={
                                this.pattern_unit != null &&
                                this.pattern_unit["windbag_3"] !== undefined
                                  ? this.pattern_unit["windbag_3"]["value"]
                                  : ""
                              }
                              step={0.1}
                              getInputText={this.getValue.bind(this, "windbag_3")}
                              value={
                                this.state.schedule_item.dial_pattern.windbag_3
                              }
                              precision={this.decimal_info!=null && this.decimal_info['windbag_3'] !=undefined? this.decimal_info['windbag_3']['value']: 1}
                            />
                          </div>
                          <div className="inline_input">
                            <InputBoxTag
                              label="備考"
                              type="text"
                              placeholder=""
                              getInputText={this.getValue.bind(this, "list_note")}
                              value={
                                this.state.schedule_item.dial_pattern.list_note
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="other_conditions">
                        <div className="one_fourth">
                          <div className="prescription">
                            <div className="title">処方</div>
                            <div className="content prescription_content">
                            {done_prescription != undefined && done_prescription != null && done_prescription.length>0 && (
                                  done_prescription.map((item) => {
                                      return(
                                          <>
                                              <div className="one-prescript-header one-header">{item.regular_prescription_number != null && periodics[item.regular_prescription_number]}</div>                                                
                                              {item.data_json.length > 0 && item.data_json.map((rp_item, index)=>{
                                                  return(
                                                      <>
                                                          <span>{index+1})</span>
                                                          {rp_item.medicines.length > 0 && rp_item.medicines.map((medi_item)=>{
                                                              return (
                                                                  <>
                                                                      <span>{medi_item.item_name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                                      <span>{medi_item.amount}{medi_item.unit != undefined && medi_item.unit != "" ? medi_item.unit+ "　" : "　"}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}</span>
                                                                  </>
                                                                  
                                                              )
                                                          })}
                                                          <div className="one-prescript-usage">
                                                              <span>{rp_item.usage_name}</span>
                                                              <span>
                                                                  {rp_item.days !== undefined && rp_item.days !== null && rp_item.disable_days_dosing == 0? "("+rp_item.days+(rp_item.prescription_category == "頓服"? "回分)" : "日分)") : ""}
                                                              </span>
                                                          </div>                                                                
                                                      </>
                                                  )
                                              })
                                              }
                                          </>
                                      )
                                  })
                              )} 
                            </div>
                          </div>
                        </div>
                        <div className="one_fourth">
                          <div className="inspection">
                            <div className="title">検査</div>
                            <div className="content inspection_content">
                              {this.state.inspection !== undefined &&
                                this.state.inspection !== null &&
                                this.state.inspection.length > 0 &&
                                this.state.timing_codes !== undefined &&
                                this.state.examination_codes !== undefined &&
                                this.state.inspection.map((item) => {
                                  return (
                                    <>
                                      <div className="flex">
                                        <div
                                          className={
                                            item.is_completed == 1
                                              ? "done done_or_not"
                                              : "done_or_not"
                                          }
                                        >
                                          {item.is_completed == 1 ? "済" : "未"}
                                        </div>
                                        <div className="width-60">
                                          {
                                            this.state.examination_codes[
                                              item.examination_code
                                            ]
                                          }
                                        </div>
                                        <div className="fixed_right">
                                          {
                                            this.state.timing_codes[
                                              item.timing_code
                                            ]
                                          }
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                          <div className="dailysis_prescription">
                            <div className="title">透析中処方</div>
                            <div className="content dailysis_prescription_content">
                              {this.state.dial_pres !== undefined &&
                                this.state.dial_pres !== null &&
                                this.state.dial_pres.length > 0 &&
                                this.state.dial_pres.map((item) => {
                                  return (
                                    <>
                                      <div className="flex">
                                        <div
                                          className={
                                            item.is_completed == 1
                                              ? "done done_or_not"
                                              : "done_or_not"
                                          }
                                        >
                                          {item.is_completed == 1 ? "済" : "未"}
                                        </div>
                                        <div className="width-60">
                                          {item.medicine_name}
                                        </div>
                                        <div className="fixed_right">
                                          {item.timing_name}
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                        <div className="one_fourth">
                          <div className="dialyser">
                            <div className="title">ダイアライザ</div>
                            <div className="content dialyser_content">
                              {dialyser !== undefined &&
                                dialyser !== null &&
                                dialyser.length > 0 &&
                                this.state.dialyzerCodeData !== undefined &&
                                this.state.timing_codes !== undefined &&
                                dialyser.map((item) => {
                                  return (
                                    <>
                                      <div className="flex">
                                        <div
                                          className={
                                            item.is_completed == 1
                                              ? "done done_or_not"
                                              : "done_or_not"
                                          }
                                        >
                                          {item.is_completed == 1 ? "済" : "未"}
                                        </div>
                                        <div className="width-60">
                                          {
                                            this.state.dialyzerCodeData[
                                              item.dialyzer_code
                                            ]
                                          }
                                        </div>
                                        <div className="fixed_right">
                                          {
                                            this.state.timing_codes[
                                              item.timing_code
                                            ]
                                          }
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                          <div className="daily_prescription">
                            <div className="title">抗凝固法</div>
                            <div className="content anti_hard_content">
                              {dial_anti !== undefined &&
                                dial_anti !== null &&
                                this.state.all_anti_items_list != undefined && (
                                  <div className="one_dial_method">
                                    <div className="flex">
                                      <div className="done_or_not"></div>
                                      <div>{dial_anti.title}</div>
                                    </div>
                                    {dial_anti.anti_items.map((item) => {
                                      return (
                                        <>
                                          <div className="flex">
                                            <div className="medicine_name width-60">
                                              {
                                                this.state.all_anti_items_list[
                                                  item.item_code
                                                ]
                                              }
                                            </div>
                                            <div className="fixed_right">
                                              {item.amount}
                                              {item.unit}
                                            </div>
                                          </div>
                                        </>
                                      );
                                    })}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="injection">
                            <div className="title">注射</div>
                            <div className="content injection_content">
                              {this.state.injection !== undefined &&
                                this.state.injection !== null &&
                                this.state.injection.length > 0 &&
                                this.state.timing_codes !== undefined &&
                                this.state.injection.map((item) => {
                                  return (
                                    <>
                                      {Object.keys(item.data_json).map((key) => {
                                        if (item.data_json[key].item_name != "") {
                                          return (
                                            <div className="flex" key={key}>
                                              <div
                                                className={
                                                  item.is_completed == 1
                                                    ? "done done_or_not"
                                                    : "done_or_not"
                                                }
                                              >
                                                {item.is_completed == 1
                                                  ? "済"
                                                  : "未"}
                                              </div>
                                              <div
                                                className="width-60"
                                                title={
                                                  item.data_json[key].item_name
                                                }
                                              >
                                                {item.data_json[
                                                  key
                                                ].item_name.substring(0, 12)}
                                              </div>
                                              <div
                                                className="fixed_right"
                                                title={
                                                  this.state.timing_codes[
                                                    item.timing_code
                                                  ]
                                                }
                                              >
                                                {this.state.timing_codes[
                                                  item.timing_code
                                                  ] != undefined ? this.state.timing_codes[
                                                  item.timing_code
                                                ].substring(0, 5): ""}
                                              </div>
                                            </div>
                                          );
                                        }
                                      })}
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                        <div className="one_fourth">
                          <div className="manage">
                            <div className="title">管理料/指導料</div>
                            <div className="content manage_content">
                              {this.state.manage_fee !== undefined &&
                                this.state.manage_fee !== null &&
                                this.state.manage_fee.length > 0 &&
                                this.state.feeMasterCodeData !== undefined &&
                                this.state.manage_fee.map((item, index) => {
                                  return (
                                    <div className="flex" key={index}>
                                      <div
                                        className={
                                          item.completed_by != null
                                            ? "done done_or_not"
                                            : "done_or_not"
                                        }
                                      >
                                        {item.completed_by != null ? "済" : "未"}
                                      </div>
                                      <div className="width-60">
                                        {
                                          this.state.feeMasterCodeData[
                                            item.fee_management_master_number
                                          ]
                                        }
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                          {this.props.add_flag == false &&
                            this.state.schedule_item != undefined &&
                            this.state.schedule_item != null &&
                            this.state.staff_list_by_number != undefined &&
                            this.state.doctor_list_by_number != undefined && (
                              <>
                                <div className={"flex final-date"}>
                                  {"最終入力日時：" +
                                    formatDateSlash(
                                      this.state.schedule_item.updated_at.split(
                                        " "
                                      )[0]
                                    ) +
                                    " " +
                                    formatTime(
                                      formatTimePicker(
                                        this.state.schedule_item.updated_at.split(
                                          " "
                                        )[1]
                                      )
                                    )}
                                </div>
                                <div className={"flex final-name"}>
                                  {"入力者：" +
                                    (this.state.schedule_item.updated_by !== 0
                                      ? this.state.staff_list_by_number[
                                          this.state.schedule_item.updated_by
                                        ]
                                      : "")}
                                </div>
                                <div className={"flex final-name"}>
                                  {"指示者：" +
                                    (this.state.schedule_item
                                      .instruction_doctor_number != null &&
                                    this.state.schedule_item
                                      .instruction_doctor_number !== 0 &&
                                    this.state.doctor_list_by_number[
                                      this.state.schedule_item
                                        .instruction_doctor_number
                                    ] != undefined
                                      ? this.state.doctor_list_by_number[
                                          this.state.schedule_item
                                            .instruction_doctor_number
                                        ]
                                      : "")}
                                </div>
                              </>
                            )}
                          <div className="register_info">
                            <div className="datepicker flex">
                              <label style={{cursor:"text"}}>入力日</label>
                              <DatePickerBox>
                              <DatePicker
                                locale="ja"
                                selected={this.state.entry_date}
                                onChange={this.getInputdate}
                                dateFormat="yyyy/MM/dd"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                id='entry_date_id'
                                dayClassName = {date => setDateColorClassName(date)}
                              />
                              </DatePickerBox>
                            </div>
                            <div className="datepicker flex">
                              <label style={{cursor:"text"}}>入力時間</label>
                              <DatePicker
                                locale="ja"
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
                            { authInfo != undefined &&
                              authInfo != null &&
                              authInfo.doctor_number > 0 ? (
                              <div
                                className="direct_man remove-x-input"
                                onClick={(e)=>this.showDoctorList(e).bind(this)}
                              >
                                <InputWithLabelBorder
                                  label="指示者"
                                  type="text"
                                  id='instruction_doctor_number_id'
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
                                ) : (
                              <div
                                className="direct_man remove-x-input cursor-input"
                                onClick={(e)=>this.showDoctorList(e).bind(this)}
                              >
                                <InputWithLabelBorder
                                  label="指示者"
                                  type="text"
                                  id='instruction_doctor_number_id'
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
                              
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </Wrapper>
        </Modal.Body>
        <Modal.Footer>
            <div className="checkbox_area" style={{position:"absolute",left:"1rem"}}>
              {this.state.load_status &&
                this.state.schedule_item !== undefined && (
                  <Checkbox
                    label="臨時透析"
                    getRadio={this.getCheckValue.bind(this)}
                    value={this.state.schedule_item.is_temporary}
                    name="temporary_setting"
                  />
                )}
            </div>
            <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
              <Button className={this.change_flag == 0 ? 'disable-btn' : 'red-btn'} onClick={this.saveEditedSchedule}>
                {this.props.add_flag ? "登録" : "変更"}
              </Button>
        </Modal.Footer>
        {this.state.isShowDoctorList && (
          <DialSelectMasterModal
            selectMaster={this.selectDoctor}
            closeModal={this.closeDoctorSelectModal}
            MasterCodeData={this.state.doctors}
            MasterName="医師"
          />
        )}
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.updateSchedule.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.confirm_alert_title !== "" && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.props.closeModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.before_start_confirm_title !== "" && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOkBefore.bind(this)}
            confirmTitle={this.state.confirm_message}
            title = {this.state.before_start_confirm_title}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </Modal>
    );
  }
}

EditDailysisSchedulModal.contextType = Context;

EditDailysisSchedulModal.propTypes = {
  handleOk: PropTypes.func,
  closeModal: PropTypes.func,
  system_patient_id: PropTypes.number,
  schedule_date: PropTypes.string,
  add_flag: PropTypes.bool,
  patient_info: PropTypes.object,
  history: PropTypes.object,
};

export default EditDailysisSchedulModal;
