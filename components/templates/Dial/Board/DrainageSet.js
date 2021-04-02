import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "../../../molecules/InputWithLabel";
import InputWithLabelBorder from "../../../molecules/InputWithLabelBorder";
import RadioButton from "~/components/molecules/RadioInlineButton";
import PropTypes from "prop-types";
import SendConsoleModal from "~/components/organisms/SendConsoleModal";
import { formatTime, getDifferentTime, formatDateTimeIE } from "../../../../helpers/date";
import { CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import NumericInputWithUnitLabel from "../../../molecules/NumericInputWithUnitLabel";
import {
  Dial_tab_index,
  makeList_number,
  makeList_code,
} from "~/helpers/dialConstants";
import * as methods from "../DialMethods";
import SelectorWithLabel from "../../../molecules/SelectorWithLabel";
import TimeInputModal from "./molecules/TimeInputModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import DewaterHistoryModal from "./DewaterHistoryModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { secondary600 } from "~/components/_nano/colors";
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';
import $ from 'jquery';
import {addRedBorder, removeRedBorder} from '~/helpers/dialConstants';
import ChangeBedConsoleModal from "../modals/ChangeBedConsoleModal";

const Wrapper = styled.div`
  width: 100%;
  height: calc( 100vh - 8.75rem);
  padding: 0.3rem;
  font-size: 1rem;
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .dial-title-tab{
    width: 100%;
    ul {
        opacity: 0;
    }
  }
  label {
    margin-bottom:0 !important;
    cursor: text !important;
  }
  input{
    font-size: 1.2rem !important;
    text-align: right;
  }
  .flex {
    display: flex;
  }
  .flex.bold input{
    width: 7rem;
    border:1px solid;
  }
  .left-area {
    width: 49.5%;
    height: calc(100vh - 21.875rem);
    overflow-y: auto;
    overflow-x: auto;
    border: 3px dotted red;
    .label-title {
      line-height:2.5rem;
      font-size:0.9rem;
      width: 9rem !important;
      text-align: right;
      margin:0;
      margin-right: 0.3rem !important;
    }
    input {
      height:2.5rem;
    }
    .pullbox-select {
      font-size: 1.2rem;
      width: 7rem;
      height:2.5rem;
    }
    .dial-degree {
      line-height:2.5rem;
      font-size: 0.85rem;
      width:3.6rem;
      margin-left:0.3rem !important;
      text-align: left;
    }
    .radio-btn label {
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 1rem;
      margin:0 !important;
    }
    .label-unit {
      margin:0;
      line-height: 2.5rem;
      margin-left:0.3rem;
      text-align: left;
      width:3.6rem;
      font-size: 0.85rem;
    }
    .value-box {
      border-radius: 4px;
      border: solid 1px #ced4da;
      width: calc(100% - 9.3rem) !important;
      font-size: 1.2rem;
      text-align: left;
      padding: 0 8px;
      height: 2.5rem;
      line-height: 2.5rem;
      cursor:pointer;
    }
    .sub-div {
      width: calc((100% - 8.2rem) / 2);
      div {
        width: 100%;
        .pullbox-label {
          width: calc(100% - 9.3rem);
          .pullbox-select {width:100%;}
        }
        input {width: calc(100% - 9.3rem);}
      }
    }
    .num-sub-div {
      width:50%;
      div {
        width:100%;
        div {
          width: calc(100% - 13.4rem);
          input {
            width: 100% !important;
            padding: 0 !important;
            padding-right: 1.5rem !important;
          }
        }
      }
    }
    .mb-div {
      margin-bottom:0.5rem;
    }

    .block-area {
        border-bottom: 0.25rem dotted red;
        input{
          width: calc(100% - 10rem) !important;
          font-size:1.2rem!important;
        }
    }
    .anticogulation{
      input{
        font-size:1rem!important;
        cursor: default;
        background: white !important;
      }
      .label-exist {
        label {
          text-align: left !important;
          padding-left: 0.7rem;
          width: 4.5rem !important;
        }
        input {
          width:calc(100% - 5.5rem) !important;
        }
      }
    }
    .block-area1 {
        .dial_method{
          margin-top:0.5rem;
        }
        border-bottom: 0.25rem dotted red;
        .trio{
            padding-left:0;
        }
    }
    
    .has-unit {
      div{margin-top:0;}
        .hdf-amount {
            padding-top: 1rem;
        }
    }
    .first-label{
      div {margin:0;}
      .pullbox-label {
        margin:0;
      }
    }
    .second-label{
      div {margin:0;}
      .pullbox-label {
        margin:0;
      }
    }
  }
  .right-area {
    width: 49.5%;
    height: calc(100vh - 21.875rem);
    border: 3px dotted blue;
    overflow-y: auto;
    .sub-div {
      div {margin-top:0;}
    }
    .label-title {
      line-height:2.5rem;
      font-size:0.9rem;
      width: 7.5rem;
      text-align: right;
      margin:0;
      margin-right: 0.3rem !important;
    }
    input {
      height:2.5rem;
    }
    .pullbox-select {
      font-size: 1.4rem;
      width: 7rem;
      height:2.5rem;
    }
    .dial-degree {
      line-height:2.5rem;
      font-size: 0.9rem;
      width:2.5rem;
      margin-left:0.3rem !important;
      text-align: left;
    }
    .left-input {
      width: 49.5%;
      height: 100%;
      .sub-div {
        .datepickerbox {
          width: calc(100% - 2.6rem);
          .label-title {width: 9rem;}
          input {width: calc(100% - 9.3rem);}
        }
        .dial-degree {width:2.3rem;}
      }
    }
    .right-input {
        border-left: 0.25rem dotted blue;
        width: 49.5%;
        height: 100%;
        .sub-div {
          .datepickerbox {
            width: calc(100% - 3.8rem);
            .label-title {width: 7rem;}
            input {width: calc(100% - 7.3rem);}
          }
          .dial-degree {width:3.5rem;}
        }
    }
    .mt-div {
      margin-top:0.5rem;
    }
    .red-div{
        input {border-color: red;}
        color: red;
    }
    .pink-div{
        input {border-color: #ff41d1;}
        color: #ff41d1;
    }
  }
    .group-area {
        div {
            margin-top: -1px;
        }
    }
    button {
        span {
            font-size: 1rem;
            font-weight: 100;
        }
    }
    .update-drainge {
        display: flex;
        margin-top: 0.625rem;
        button {
            width: 12.5rem;
            padding: 0;
            margin-left: 0.625rem;
            height: 2.3rem;
        }
        label{
            font-size: 1rem;
            text-align: right;
            width: auto;
            margin: 0;
            line-height: 2.3rem;
            margin-right: 0.3rem;
            width: 4rem;
        }
        .input-div{
            text-align:left;
            width:14rem;
            font-size:1.1rem!important;
            border: solid 1px grey;
            border-radius 0.4rem;
            padding: 0 0.2rem;
            height: 2.3rem;
            line-height: 2.3rem;
            cursor: default;
        }
        .disable-button {
          background: lightgray;
          span {
            color: rgb(84, 84, 84);
          }
        }
        .disable-button:hover {
          background: lightgray !important;
        }
    }
  .footer {
    width: 100%;
    margin-top: 0.625rem;
    .disable-button {
      background: lightgray;
      span {
        color: rgb(84, 84, 84);
      }
    }
    .disable-button:hover {
      background: lightgray !important;
    }
    button {
      span {
        font-size: 1.25rem;
        font-weight: bold;
      }
    }
    button:hover {
      background-color: ${secondary600};
    }
  }
  .gender {
    font-size: 0.75rem;
    display: flex;
    margin-top: 0.5rem;
    .radio-btn label{
        width: 9.375rem;
        text-align: center;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0;
    }
  }
  .disable{
    .radio-btn{
        label {
            background: #cccccc !important;
            color: black !important;
            cursor: default !important;
        }
      }
  }
  .text-part{
    input{
        text-align: left;
    }
  }
  input:disabled{
    color: black !important;
    background:#CCCCCC;
  }
  .fluid-time {
    select {font-size: 1.4rem;}
  }
 `;

class DrainageSet extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) => {
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this));
    });
    let bed_master = sessApi.getObjectValue("dial_common_master","bed_master");
    let console_master = sessApi.getObjectValue("dial_common_master","console_master");
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let bed_master_code_list = makeList_number(bed_master, 1);
    let console_master_code_list = makeList_code(console_master, 1);
    let default_array = this.getTelegramDefaultValue();
    let dial_common_config = JSON.parse(window.sessionStorage.getItem("init_status")).dial_common_config;
    this.pattern_unit = null;
    if (
      dial_common_config !== undefined &&
      dial_common_config != null &&
      dial_common_config["単位名：除水設定"] !== undefined
    ) {
      this.pattern_unit = dial_common_config["単位名：除水設定"];
    }
    this.pattern_fixed = {};
    if (
      dial_common_config !== undefined &&
      dial_common_config != null &&
      dial_common_config["小数点以下桁数：除水設定画面"] !== undefined
    ) {
      this.pattern_fixed = dial_common_config["小数点以下桁数：除水設定画面"];
    }
    this.pattern_fixed['prevTimeWeight'] =this.pattern_fixed != null && this.pattern_fixed['prevTimeWeight'] != undefined ? this.pattern_fixed['prevTimeWeight']['value'] : 1;
    this.pattern_fixed['dw'] =this.pattern_fixed != null &&  this.pattern_fixed['dw'] != undefined ? this.pattern_fixed['dw']['value'] : 1;
    this.pattern_fixed['weight_before'] =this.pattern_fixed != null &&  this.pattern_fixed['weight_before'] != undefined ? this.pattern_fixed['weight_before']['value'] : 1;
    this.pattern_fixed['increase_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['increase_amount'] != undefined ? this.pattern_fixed['increase_amount']['value'] : 1;
    this.pattern_fixed['weight_after'] =this.pattern_fixed != null &&  this.pattern_fixed['weight_after'] != undefined ? this.pattern_fixed['weight_after']['value'] : 1;
    this.pattern_fixed['target_weight'] =this.pattern_fixed != null &&  this.pattern_fixed['target_weight'] != undefined ? this.pattern_fixed['target_weight']['value'] : 1;
    this.pattern_fixed['fluid'] =this.pattern_fixed != null &&  this.pattern_fixed['fluid'] != undefined ? this.pattern_fixed['fluid']['value'] : 1;
    this.pattern_fixed['fluid_speed'] =this.pattern_fixed != null &&  this.pattern_fixed['fluid_speed'] != undefined ? this.pattern_fixed['fluid_speed']['value'] : 2;
    this.pattern_fixed['fluid_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['fluid_amount'] != undefined ? this.pattern_fixed['fluid_amount']['value'] : 2;
    this.pattern_fixed['max_drainage_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['max_drainage_amount'] != undefined ? this.pattern_fixed['max_drainage_amount']['value'] : 2;
    this.pattern_fixed['max_drainage_speed'] =this.pattern_fixed != null &&  this.pattern_fixed['max_drainage_speed'] != undefined ? this.pattern_fixed['max_drainage_speed']['value'] : 2;
    this.pattern_fixed['supplementary_food'] =this.pattern_fixed != null &&  this.pattern_fixed['supplementary_food'] != undefined ? this.pattern_fixed['supplementary_food']['value'] : 2;
    this.pattern_fixed['actualDrainage'] =this.pattern_fixed != null &&  this.pattern_fixed['actualDrainage'] != undefined ? this.pattern_fixed['actualDrainage']['value'] : 2;
    this.pattern_fixed['today_water_removal_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['today_water_removal_amount'] != undefined ? this.pattern_fixed['today_water_removal_amount']['value'] : 2;
    this.pattern_fixed['target_water_removal_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['target_water_removal_amount'] != undefined ? this.pattern_fixed['target_water_removal_amount']['value'] : 2;
    this.pattern_fixed['drainage_speed'] =this.pattern_fixed != null &&  this.pattern_fixed['drainage_speed'] != undefined ? this.pattern_fixed['drainage_speed']['value'] : 2;
    this.fixed_params = [];
    this.start_date_time = null;
    Object.keys(this.pattern_fixed).map(index=>{
      this.fixed_params.push(index);
    });
    this.state = {
      schedule_data: null,
      dial_method: "",
      bed_no: 0,
      console: 0,
      schedule_date: "",
      time_zone: 0,
      dilution_timing: 0,
      nextCheckDate: "",
      diagonosis_time: "",
      drainage_speed: "",
      drainage_time: "",
      anticoagulationMethod: "",
      dial_antis: null,
      degree: "",
      fluid_amount: "",
      fluid_speed: "",
      weight_before: "",
      prevTimeWeight: "",
      dw: "",
      target_weight: "",
      fluid: "",
      supplementary_food: "",
      target_water_removal_amount: "",
      today_water_removal_amount: "",
      max_drainage_amount: "",
      max_drainage_speed: "",
      weight_after: "",
      actualDrainage: "",
      syringe_speed: "",
      syringe_stop_time: "",
      fluid_temperature: "",
      dialysate_amount: "",
      blood_flow: "",
      hdf_init_time: "",
      hdf_init_amount: "",
      hdf_step: "",
      hdf_speed: "",
      blood_pressure_step: "",
      fluid_time: "",
      syringe_amount: "",
      is_started:this.props.is_started !== undefined ? this.props.is_started : 0,
      is_ended: this.props.is_ended !== undefined ? this.props.is_ended : 0,
      ms_start_time:this.props.ms_start_time !== undefined ? formatTime(this.props.ms_start_time) : "",
      ms_end_time:this.props.ms_end_time !== undefined ? formatTime(this.props.ms_end_time) : "",
      is_overweight: 0,
      bed_master_code_list,
      console_master_code_list,
      isTimeModal: false,
      isTimeConfirmModal: false,
      default_array,
      start_time: null,
      end_time: null,
      entry_name:authInfo != undefined && authInfo != null ? authInfo.name : "",
      isShowDoctorList: false,
      instruction_doctor_number: 0,
      directer_name: "",
      schedule_id: 0,
      isopenHistoryModal: false,
      confirm_message: "",
      alert_message: '',
      is_sended: false,
      openChangeBedConsolemodal:false,
      dial_tiems:this.setReservationRange(),
      change_flag:0,
    };
    sessApi.remove('dial_change_flag');
  }
  
  async componentDidMount() {
    let tmp_state = JSON.parse(window.sessionStorage.getItem("temp_draingeSet"));
    if (tmp_state != undefined && tmp_state != null) {
      this.setState(tmp_state);
      return;
    }
    await this.setDoctors();
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number:parseInt(this.context.selectedDoctor.code),
        directer_name:this.context.selectedDoctor.name
      });
    }
    let schedule_data = this.props.schedule_data;
    this.draingSetState(schedule_data, this.props.ms_cur_drainage);
    // this.setState({
    //   is_started:this.props.is_started !== undefined ? this.props.is_started : 0,
    //   is_ended: this.props.is_ended !== undefined ? this.props.is_ended : 0,
    //   ms_start_time:this.props.ms_start_time !== undefined ? formatTime(this.props.ms_start_time): "",
    //   ms_end_time:this.props.ms_end_time !== undefined ? formatTime(this.props.ms_end_time) : "",
    //   is_overweight: 0,
    // });
  }
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');

    this.pattern_unit = null;
    this.pattern_fixed = null;
    this.fixed_params = null;
    this.start_date_time = null;

    var html_obj = document.getElementsByClassName("drainage-set")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }    
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.schedule_data != null && nextProps.schedule_data.number != undefined &&
      this.state.schedule_data.number === nextProps.schedule_data.number && nextProps.weight_before != null && nextProps.weight_before != ""
      && this.state.weight_before == "" && this.state.weight_before != nextProps.weight_before) {
      this.setState({
        weight_before: nextProps.weight_before,
      });
      window.sessionStorage.setItem("alert_messages", "前体重が登録されました。");
    }
    if (this.state.schedule_data != null && nextProps.schedule_data.number != undefined && this.state.schedule_data.number === nextProps.schedule_data.number &&
      nextProps.ms_cur_drainage != null && nextProps.ms_cur_drainage != "" && this.state.ms_cur_drainage != nextProps.ms_cur_drainage) {
      var actualDrainage = nextProps.ms_cur_drainage;
      if (nextProps.schedule_data.weight_before != null && nextProps.schedule_data.weight_after != null) {
        actualDrainage =
          nextProps.schedule_data.weight_before +
          nextProps.schedule_data.dial_pattern.supplementary_food +
          nextProps.schedule_data.dial_pattern.fluid -
          nextProps.schedule_data.weight_after;
        actualDrainage = isNaN(parseFloat(actualDrainage))
          ? ""
          : parseFloat(actualDrainage).toFixed(2);
      }
      this.setState({
        ms_cur_drainage: nextProps.ms_cur_drainage,
        actualDrainage: actualDrainage,
      });
    }
    // added 2020-04-08--------------------------------------------------------------
    // 各種入力を変更しコンソール通信をクリックし「指示者を登録してください」等のアラートが表示された場合、変更前の内容に戻ってしまう。
    if (JSON.stringify(this.state.schedule_data) == JSON.stringify(nextProps.schedule_data)) {
      return;
    }
    this.setChangeFlag(0);
    //------------------------------------------------------------------------------
    let schedule_data =
      nextProps.schedule_data == undefined || nextProps.schedule_data == null
        ? null
        : nextProps.schedule_data;
    this.draingSetState(
      schedule_data,
      nextProps.ms_cur_drainage,
      nextProps.weight_after
    );
    this.setState({
      is_started: nextProps.is_started !== undefined ? nextProps.is_started : 0,
      is_ended: nextProps.is_ended !== undefined ? nextProps.is_ended : 0,
      ms_start_time:
        nextProps.ms_start_time !== undefined
          ? formatTime(nextProps.ms_start_time)
          : "",
      ms_end_time:
        nextProps.ms_end_time !== undefined
          ? formatTime(nextProps.ms_end_time)
          : "",
    });
  }
  
  draingSetState = (schedule_data, ms_cur_drainage, weight_after) => {
    let drainage_speed = "";
    let drainage_time = "";
    let target_weight = "";
    let cur_waterRemovalAmount = "";
    let today_water_removal_amount = "";
    let fluid_amount = "";
    let actualDrainage = ms_cur_drainage;
    actualDrainage = ""; // 215-2 実除水が、前体重 - 後体重になっていない
    let default_array = {};
    let syringe_amount, syringe_speed, syringe_stop_time = "";
    if(schedule_data != undefined && schedule_data !== null){
      if (schedule_data.dial_pattern !== undefined) {
        let dial_pattern = schedule_data.dial_pattern;
        default_array = this.getTelegramDefaultValue(dial_pattern.dial_method);
        if (dial_pattern.fluid_time != null && dial_pattern.fluid_time !== "" && dial_pattern.reservation_time != null && dial_pattern.reservation_time !== ""){
          fluid_amount = this.getFluidAmount(dial_pattern.fluid_speed, this.getReservationTime(dial_pattern.fluid_time));
        } else {
          fluid_amount = this.getFluidAmount(dial_pattern.fluid_speed, this.getReservationTime(dial_pattern.reservation_time));
        }
        if (schedule_data.weight_before != null && schedule_data.weight_before != "" && schedule_data.weight_after != null && schedule_data.weight_after != "") {
          // actualDrainage = schedule_data.weight_before+schedule_data.dial_pattern.supplementary_food+schedule_data.dial_pattern.fluid-schedule_data.weight_after;
          actualDrainage = schedule_data.weight_before - schedule_data.weight_after;
          actualDrainage = isNaN(parseFloat(actualDrainage)) ? "" : parseFloat(actualDrainage).toFixed(2);
        }
        // ---------------- 除水量    除水速度------------------------
        // (A) 除水時間の設定
        if (dial_pattern.drainage_time != null && dial_pattern.drainage_time !== "") {
          // 除水時間が保存されていれば、除水時間欄に反映する
          drainage_time = dial_pattern.drainage_time;
        } else {
          // 除水時間が未設定であれば、透析時間と同じ値を反映する
          drainage_time = dial_pattern.reservation_time;
        }
        if (drainage_time != null && drainage_time !== "") {
          // 目標体重が保存されていれば目標体重欄に反映する。
          // 目標体重が未設定の場合は、DWと同じ値を仮の目標体重として目標体重欄に反映する。
          target_weight = schedule_data.target_weight != null && schedule_data.target_weight !== "" ? schedule_data.target_weight : dial_pattern.dw;
          target_weight = parseFloat(target_weight);
          // 前体重 - 目標体重 = 本日目標除水量
          if (schedule_data.weight_before != null && schedule_data.weight_before != "") {
            today_water_removal_amount = isNaN(target_weight) ? schedule_data.weight_before : schedule_data.weight_before - target_weight;
            today_water_removal_amount = !isNaN(parseFloat(today_water_removal_amount)) ? parseFloat(today_water_removal_amount).toFixed(2) : 0;
            //-------------- 除水量 -------------------------
            // 本日目標除水量 + 補液 + 補食 = 除水量設定
            cur_waterRemovalAmount = this.getTTargetWaterRemovalAmount(schedule_data.weight_before, dial_pattern.fluid, dial_pattern.supplementary_food, target_weight);
            // 281-3 透析中状態にしてdial_operation_logテーブルに操作履歴データを登録した際に
            // if (schedule_data != undefined && schedule_data.dial_pattern != undefined &&
            // schedule_data.dial_pattern.target_drainage != null && schedule_data.dial_pattern.target_drainage != "" ) {
            //     today_water_removal_amount = schedule_data.dial_pattern.target_drainage;
            //     target_weight = schedule_data.weight_before - today_water_removal_amount;
            //     cur_waterRemovalAmount = this.getTTargetWaterRemovalAmount(schedule_data.weight_before, schedule_data.dial_pattern.fluid, schedule_data.dial_pattern.supplementary_food, target_weight);
            // }
          }
          // cur_waterRemovalAmount = (schedule_data.target_water_removal_amount != null && schedule_data.target_water_removal_amount !== '') ? schedule_data.target_water_removal_amount : cur_waterRemovalAmount;
          // -------------- 除水速度------------------------
          // 除水速度 = 除水量/除水時間
          drainage_speed = (parseFloat(cur_waterRemovalAmount) / parseFloat(this.getReservationTime(drainage_time))).toFixed(2);
          drainage_speed = isNaN(drainage_speed) ? "" : drainage_speed;
        }
      }
      // IPワンショット量, IP速度, IP自動切り時間
      if (schedule_data.dial_anti != undefined && schedule_data.dial_anti.anti_items != undefined && schedule_data.dial_anti.anti_items != null && schedule_data.dial_anti.anti_items.length > 0) {
        schedule_data.dial_anti.anti_items.map((item) => {
          if (item.category === "初回量") {
            syringe_amount = item.amount;
          } else if (item.category === "持続量") {
            syringe_speed = item.amount;
          } else if (item.category === "事前停止") {
            syringe_stop_time = item.amount;
          }
        });
      }
    }
    this.setState({
      ms_cur_drainage: ms_cur_drainage,
      bed_no:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.bed_no
          : "",
      console:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.console
          : "",
      schedule_date:
        schedule_data !== undefined ?
          schedule_data.schedule_date
          : "",
      time_zone:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.time_zone
          : "",
      dial_method:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined &&
        schedule_data.method_data !== undefined
          ? schedule_data.method_data[schedule_data.dial_pattern.dial_method]
          : "",
      dilution_timing:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined && schedule_data.dial_pattern.dilution_timing != null
          ? schedule_data.dial_pattern.dilution_timing
          : 0,
      nextCheckDate: "",
      diagonosis_time:
        schedule_data != undefined && schedule_data.dial_pattern != undefined
          ? schedule_data.dial_pattern.diagonosis_time != null &&
          schedule_data.dial_pattern.diagonosis_time !== ""
          ? schedule_data.dial_pattern.diagonosis_time
          : schedule_data.dial_pattern.reservation_time
          : "",
      drainage_speed: drainage_speed,
      drainage_time,
      today_water_removal_amount: today_water_removal_amount,
      anticoagulationMethod:
        schedule_data !== undefined &&
        schedule_data.dial_anti !== undefined &&
        schedule_data.dial_anti !== null
          ? schedule_data.dial_anti.title
          : "",
      dial_antis:
        schedule_data !== undefined &&
        schedule_data.dial_anti !== undefined &&
        schedule_data.dial_anti !== null &&
        schedule_data.dial_anti.anti_items != undefined
          ? schedule_data.dial_anti.anti_items
          : null,
      degree:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.degree
          : "",
      fluid_amount: isNaN(fluid_amount) ? "" : parseFloat(fluid_amount).toFixed(2),
      fluid_speed:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined &&
        !isNaN(schedule_data.dial_pattern.fluid_speed)
          ? parseFloat(schedule_data.dial_pattern.fluid_speed).toFixed(2)
          : "",
      weight_before:
        schedule_data !== undefined &&
        schedule_data.weight_before != null &&
        schedule_data.weight_before !== ""
          ? parseFloat(schedule_data.weight_before).toFixed(2)
          : "",
      prevTimeWeight:
        schedule_data !== undefined && schedule_data != null
        && schedule_data.prev_weight_after>0?parseFloat(schedule_data.prev_weight_after).toFixed(2)
          : "",
      dw:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
        && schedule_data.dial_pattern.dw>0 ? parseFloat(schedule_data.dial_pattern.dw).toFixed(2)
          : "",
      target_weight:target_weight>0?parseFloat(target_weight).toFixed(2): "",
      fluid:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined &&
        schedule_data.dial_pattern.fluid !== ""
          ? parseFloat(schedule_data.dial_pattern.fluid).toFixed(this.pattern_fixed['fluid'])
          : "",
      supplementary_food:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined &&
        schedule_data.dial_pattern.supplementary_food !== ""
          ? parseFloat(schedule_data.dial_pattern.supplementary_food).toFixed(this.pattern_fixed['supplementary_food'])
          : "",
      target_water_removal_amount: isNaN(cur_waterRemovalAmount)? "" : parseFloat(cur_waterRemovalAmount).toFixed(2),
      max_drainage_amount:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined &&
        !isNaN(schedule_data.dial_pattern.max_drainage_amount)
          ? parseFloat(schedule_data.dial_pattern.max_drainage_amount).toFixed(2)
          : "",
      max_drainage_speed:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined &&
        !isNaN(schedule_data.dial_pattern.max_drainage_speed)
          ? parseFloat(schedule_data.dial_pattern.max_drainage_speed).toFixed(2)
          : "",
      weight_after:
        weight_after != null && weight_after != ""
          ? weight_after
          : schedule_data !== undefined
          && schedule_data.weight_after>0?parseFloat(schedule_data.weight_after).toFixed(2)
          : "",
      // actualDrainage: (weight_after == null || weight_after == "") && ms_cur_drainage != undefined && ms_cur_drainage != null ? ms_cur_drainage : actualDrainage,
      actualDrainage,
      syringe_speed,
      syringe_stop_time,
      fluid_temperature:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.fluid_temperature
          : "",
      dialysate_amount:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.dialysate_amount
          : "",
      blood_flow:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.blood_flow
          : "",
      hdf_init_time:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.hdf_init_time
          : "",
      hdf_init_amount:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.hdf_init_amount
          : "",
      hdf_step:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.hdf_step
          : "",
      hdf_speed:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.hdf_speed
          : "",
      fluid_time:
        schedule_data !== undefined &&
        schedule_data.dial_pattern !== undefined
          ? schedule_data.dial_pattern.fluid_time !== null &&
          schedule_data.dial_pattern.fluid_time !== ""
          ? schedule_data.dial_pattern.fluid_time
          : schedule_data.dial_pattern.reservation_time
          : "",
      syringe_amount,
      start_time:
        schedule_data.start_date != null
          ? schedule_data.start_date
          : schedule_data.console_start_date,
      // end_time: schedule_data.end_date != null ? schedule_data.end_date : schedule_data.console_end_date,
      end_time: schedule_data.end_date,
      schedule_data,
      schedule_id: schedule_data != undefined ? schedule_data.number : 0,
      default_array,
      directer_name: "",
      is_sended: false,
    },() => {
      this.setDoctors();
      if (this.context.selectedDoctor.code > 0) {
        this.setState({
          instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
          directer_name: this.context.selectedDoctor.name,
        });
      }
      if (default_array != undefined && default_array != null && Object.keys(default_array).length !== 0) {
        this.setState({
          weight_before:
            default_array.weight_before.is_usable === 0
              ? ""
              : this.state.weight_before,
          dw: default_array.dw.is_usable === 0 ? "" : this.state.dw,
          diagonosis_time:
            default_array.diagonosis_time.is_usable === 0
              ? ""
              : this.state.diagonosis_time,
          drainage_time:
            default_array.drainage_time.is_usable === 0
              ? ""
              : this.state.drainage_time,
          target_water_removal_amount:
            default_array.target_water_removal_amount.is_usable === 0
              ? ""
              : this.state.target_water_removal_amount,
          drainage_speed:
            default_array.drainage_speed.is_usable === 0
              ? ""
              : this.state.drainage_speed,
          fluid_time:
            default_array.fluid_time.is_usable === 0
              ? ""
              : this.state.fluid_time,
          fluid_amount:
            default_array.fluid_amount.is_usable === 0
              ? ""
              : this.state.fluid_amount,
          fluid_speed:
            default_array.fluid_speed.is_usable === 0
              ? ""
              : this.state.fluid_speed,
          syringe_amount:
            default_array.syringe_amount.is_usable === 0
              ? ""
              : this.state.syringe_amount,
          syringe_speed:
            default_array.syringe_speed.is_usable === 0
              ? ""
              : this.state.syringe_speed,
          syringe_stop_time:
            default_array.syringe_stop_time.is_usable === 0
              ? ""
              : this.state.syringe_stop_time,
          blood_flow:
            default_array.blood_flow.is_usable === 0
              ? ""
              : this.state.blood_flow,
          degree:
            default_array.degree.is_usable === 0 ? "" : this.state.degree,
          fluid_temperature:
            default_array.fluid_temperature.is_usable === 0
              ? ""
              : this.state.fluid_temperature,
          dialysate_amount:
            default_array.dialysate_amount.is_usable === 0
              ? ""
              : this.state.dialysate_amount,
          hdf_init_time:
            default_array.hdf_init_time.is_usable === 0
              ? ""
              : this.state.hdf_init_time,
          hdf_init_amount:
            default_array.hdf_init_amount.is_usable === 0
              ? ""
              : this.state.hdf_init_amount,
          hdf_step:
            default_array.hdf_step.is_usable === 0
              ? ""
              : this.state.hdf_step,
          hdf_speed:
            default_array.hdf_speed.is_usable === 0
              ? ""
              : this.state.hdf_speed,
          dilution_timing:
            default_array.dilution_timing.is_usable === 0
              ? ""
              : this.state.dilution_timing,
        },() => {
          let state_data = {};
          state_data.cur_state = this.state;
          this.fixed_params.map(item=>{
            let display_param = item + "_display";
            state_data[display_param] = this.state[item] != null && this.state[item] != "" && !isNaN(this.state[item]) ? parseFloat(this.state[item]).toFixed(this.pattern_fixed[item]): '';
          });
          this.setState(state_data);
          // this.setDisplayParm();
        });
      } else {
        this.setState({ cur_state: this.state });
      }
    });
    if (Object.keys(default_array).length > 0) {
      Object.keys(default_array).map(index=>{
        removeRedBorder(index + "_id");
      });
    }
  };
  
  setDisplayParm = () => {
    this.fixed_params.map(item=>{
      let display_param = item + "_display";
      this.setState({
        [display_param]: this.state[item] != null && this.state[item] != "" && !isNaN(this.state[item]) ? parseFloat(this.state[item]).toFixed(this.pattern_fixed[item]): ''
      });
    })
  };
  
  getTTargetWaterRemovalAmount = (
    weight_before,
    fluid,
    supplementary_food,
    target_weight
  ) => {
    let new_target_water_removal_amount = 0;
    if (weight_before == undefined && weight_before == null) return "";
    
    new_target_water_removal_amount += parseFloat(weight_before);
    
    if (
      fluid !== undefined &&
      fluid !== null &&
      isNaN(parseFloat(fluid)) === false
    ) {
      new_target_water_removal_amount += parseFloat(fluid);
    }
    
    if (
      supplementary_food !== undefined &&
      supplementary_food !== null &&
      isNaN(parseFloat(supplementary_food)) === false
    ) {
      new_target_water_removal_amount += parseFloat(supplementary_food);
    }
    if (
      target_weight !== undefined &&
      target_weight !== null &&
      isNaN(parseFloat(target_weight)) === false
    ) {
      new_target_water_removal_amount -= parseFloat(target_weight);
    }
    
    if (isNaN(new_target_water_removal_amount)) return "";
    return parseFloat(new_target_water_removal_amount).toFixed(2);
  };
  
  getFluidAmount(speed, time) {
    let amount = "";
    if (speed != null && time != null && speed !== "" && time !== "") {
      amount = parseFloat(speed) * parseFloat(time).toFixed(2);
      if (isNaN(amount)) return "";
      return amount.toFixed(2);
    } else return amount;
  }
  
  setChangeFlag=(change_flag)=>{
    this.setState({change_flag});
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'drainage_set', 1)
    } else {
      sessApi.remove('dial_change_flag');
    }
  };
  
  getdegree = (e) => {
    this.setChangeFlag(1);
    this.setState({ degree: e });
  };
  
  getGoalAmount = (e) => {
    if (this.state.weight_before == null || this.state.weight_before == "")
      return;
    this.setChangeFlag(1);
    //本日目標除水量再計算
    let weight_before = parseFloat(this.state.weight_before);
    let fluid = !isNaN(parseFloat(this.state.fluid))
      ? parseFloat(this.state.fluid)
      : 0;
    let supplementary_food = !isNaN(parseFloat(this.state.supplementary_food))
      ? parseFloat(this.state.supplementary_food)
      : 0;
    let today_water_removal_amount = isNaN(parseFloat(e.target.value))
      ? weight_before
      : weight_before - parseFloat(e.target.value);
    //除水量設定再計算
    let target_water_removal_amount =
      today_water_removal_amount + fluid + supplementary_food;
    //除水速度再計算
    let drainage_speed = 0;
    if (
      target_water_removal_amount == undefined ||
      target_water_removal_amount == null
    )
      drainage_speed = "";
    if (isNaN(parseFloat(target_water_removal_amount))) drainage_speed = "";
    
    if (
      drainage_speed !== "" &&
      isNaN(parseFloat(this.getReservationTime(this.state.drainage_time))) ===
      false
    ) {
      drainage_speed = (
        parseFloat(target_water_removal_amount) /
        parseFloat(this.getReservationTime(this.state.drainage_time))
      ).toFixed(2);
    }
    this.setState({
      target_weight: e.target.value,
      target_weight_display: e.target.value,
      today_water_removal_amount: this.convertDecimal(today_water_removal_amount, 2),
      today_water_removal_amount_display: this.convertDecimal(today_water_removal_amount, this.pattern_fixed['today_water_removal_amount']),
      target_water_removal_amount: this.convertDecimal(target_water_removal_amount, 2),
      target_water_removal_amount_display: this.convertDecimal(target_water_removal_amount, this.pattern_fixed['target_water_removal_amount']),
      drainage_speed: drainage_speed,
      drainage_speed_display: this.convertDecimal(drainage_speed, this.pattern_fixed['drainage_speed']),
    });
  };
  getCurrentTargetAmount = (e) => {
    if (this.state.weight_before == null || this.state.weight_before == "")
      return;
    this.setChangeFlag(1);
    //本日目標体重再計算
    let weight_before = parseFloat(this.state.weight_before);
    let target_weight = isNaN(parseFloat(e.target.value))
      ? weight_before
      : weight_before - parseFloat(e.target.value);
    let fluid = !isNaN(parseFloat(this.state.fluid))
      ? parseFloat(this.state.fluid)
      : 0;
    let supplementary_food = !isNaN(parseFloat(this.state.supplementary_food))
      ? parseFloat(this.state.supplementary_food)
      : 0;
    //除水量設定再計算
    // let target_water_removal_amount = parseFloat(e.target.value) + fluid + supplementary_food;
    let target_water_removal_amount = "";
    if (isNaN(parseFloat(e.target.value)))
      target_water_removal_amount = fluid + supplementary_food;
    else
      target_water_removal_amount =
        parseFloat(e.target.value) + fluid + supplementary_food;
    
    //除水速度再計算
    let drainage_speed = 0;
    if (
      target_water_removal_amount == undefined ||
      target_water_removal_amount == null
    )
      drainage_speed = "";
    if (isNaN(parseFloat(target_water_removal_amount))) drainage_speed = "";
    
    if (
      drainage_speed !== "" &&
      isNaN(parseFloat(this.getReservationTime(this.state.drainage_time))) ===
      false
    ) {
      drainage_speed = (
        parseFloat(target_water_removal_amount) /
        parseFloat(this.getReservationTime(this.state.drainage_time))
      ).toFixed(2);
    }
    this.setState({
      target_weight: this.convertDecimal(target_weight, 2),
      target_weight_display: this.convertDecimal(target_weight, this.pattern_fixed['target_weight']),
      today_water_removal_amount: parseFloat(e.target.value),
      today_water_removal_amount_display: e.target.value,
      target_water_removal_amount: this.convertDecimal(target_water_removal_amount, 2),
      target_water_removal_amount_display: this.convertDecimal(target_water_removal_amount, this.pattern_fixed['target_water_removal_amount']),
      drainage_speed: drainage_speed,
      drainage_speed_display: this.convertDecimal(drainage_speed, this.pattern_fixed['drainage_speed']),
    });
  };
  convertDecimal = (_val, _digits) => {
    if (isNaN(parseFloat(_val))) return "";
    return parseFloat(_val).toFixed(_digits);
  }
  
  getfluid = (e) => {
    if (this.state.weight_before == null || this.state.weight_before == "")
      return;
    this.setChangeFlag(1);
    //除水量設定再計算
    let supplementary_food = !isNaN(parseFloat(this.state.supplementary_food))
      ? parseFloat(this.state.supplementary_food)
      : 0;
    // let target_water_removal_amount = parseFloat(this.state.today_water_removal_amount) + parseFloat(e.target.value) + supplementary_food;
    let target_water_removal_amount = "";
    if (isNaN(parseFloat(e.target.value)))
      target_water_removal_amount =
        parseFloat(this.state.today_water_removal_amount) + supplementary_food;
    else
      target_water_removal_amount =
        parseFloat(this.state.today_water_removal_amount) +
        supplementary_food +
        parseFloat(e.target.value);
    //除水速度再計算
    let drainage_speed = 0;
    if (
      target_water_removal_amount == undefined ||
      target_water_removal_amount == null
    )
      drainage_speed = "";
    if (isNaN(parseFloat(target_water_removal_amount))) drainage_speed = "";
    
    if (
      drainage_speed !== "" &&
      isNaN(parseFloat(this.getReservationTime(this.state.drainage_time))) ===
      false
    ) {
      drainage_speed = (
        parseFloat(target_water_removal_amount) /
        parseFloat(this.getReservationTime(this.state.drainage_time))
      ).toFixed(2);
    }
    this.setState({
      fluid: e.target.value,
      fluid_display: e.target.value,
      target_water_removal_amount: this.convertDecimal(target_water_removal_amount, 2),
      target_water_removal_amount_display: this.convertDecimal(target_water_removal_amount, this.pattern_fixed['target_water_removal_amount']),
      drainage_speed: drainage_speed,
      drainage_speed_display: this.convertDecimal(drainage_speed, this.pattern_fixed['drainage_speed']),
    });
  };
  
  getsupplementary_food = (e) => {
    if (this.state.weight_before == null || this.state.weight_before == "")
      return;
    this.setChangeFlag(1);
    let fluid = !isNaN(parseFloat(this.state.fluid))
      ? parseFloat(this.state.fluid)
      : 0;
    //除水量設定再計算
    let target_water_removal_amount = "";
    if (isNaN(parseFloat(e.target.value)))
      target_water_removal_amount =
        parseFloat(this.state.today_water_removal_amount) + fluid;
    else
      target_water_removal_amount =
        parseFloat(this.state.today_water_removal_amount) +
        fluid +
        parseFloat(e.target.value);
    //除水速度再計算
    let drainage_speed = 0;
    if (
      target_water_removal_amount == undefined ||
      target_water_removal_amount == null
    )
      drainage_speed = "";
    if (isNaN(parseFloat(target_water_removal_amount))) drainage_speed = "";
    
    if (
      drainage_speed !== "" &&
      isNaN(parseFloat(this.getReservationTime(this.state.drainage_time))) ===
      false
    ) {
      drainage_speed = (
        parseFloat(target_water_removal_amount) /
        parseFloat(this.getReservationTime(this.state.drainage_time))
      ).toFixed(2);
    }
    this.setState({
      supplementary_food: e.target.value,
      supplementary_food_display: e.target.value,
      target_water_removal_amount: this.convertDecimal(target_water_removal_amount, 2),
      target_water_removal_amount_display: this.convertDecimal(target_water_removal_amount, this.pattern_fixed['target_water_removal_amount']),
      drainage_speed: drainage_speed,
      drainage_speed_display: this.convertDecimal(drainage_speed, this.pattern_fixed['drainage_speed']),
    });
  };
  
  getValue = (key, e) => {
    this.setChangeFlag(1);
    if (key === "fluid_time") {
      let fluid_amount = "";
      if (
        isNaN(parseFloat(this.getReservationTime(e.target.value))) === false &&
        isNaN(parseFloat(this.state.fluid_speed)) === false
      ) {
        fluid_amount = (
          parseFloat(this.state.fluid_speed) *
          parseFloat(this.getReservationTime(e.target.value))
        ).toFixed(2);
      }
      this.setState({
        fluid_time: e.target.value,
        fluid_amount,
        fluid_amount_display: this.convertDecimal(fluid_amount, this.pattern_fixed['fluid_amount']),
      });
    } else if (key === "fluid_speed") {
      let fluid_amount = "";
      fluid_amount = this.getFluidAmount(
        e.target.value,
        this.getReservationTime(this.state.fluid_time)
      );
      this.setState({
        fluid_speed: e.target.value,
        fluid_amount,
        fluid_amount_display: this.convertDecimal(fluid_amount, this.pattern_fixed['fluid_amount']),
      });
    } else if (key === "syringe_amount")
      this.setState({ syringe_amount: e.target.value });
    else if (key === "syringe_speed")
      this.setState({ syringe_speed: e.target.value });
    else if (key === "syringe_stop_time")
      this.setState({ syringe_stop_time: e.target.value });
    else if (key === "degree") this.setState({ degree: e.target.value });
    else if (key === "fluid_temperature")
      this.setState({ fluid_temperature: e });
    else if (key === "dialysate_amount")
      this.setState({ dialysate_amount: e.target.value });
    else if (key === "blood_flow")
      this.setState({ blood_flow: e.target.value });
    else if (key === "hdf_init_time")
      this.setState({ hdf_init_time: e.target.value });
    else if (key === "hdf_init_amount")
      this.setState({ hdf_init_amount: e.target.value });
    else if (key === "hdf_step") this.setState({ hdf_step: e.target.value });
    else if (key === "hdf_speed") this.setState({ hdf_speed: e.target.value });
    else if (key === "diagonosis_time") {
      this.setState({
        tmp_diagonosis_time: e.target.value,
        diagonosis_time: e.target.value,
        confirm_message: "除水時間と補液時間も変更します。よろしいですか？",
      });
    } else if (key === "drainage_time") {
      let drainage_speed = 0;
      if (this.state.target_water_removal_amount == undefined || this.state.target_water_removal_amount == null)
        drainage_speed = "";
      if (isNaN(parseFloat(this.state.target_water_removal_amount)))
        drainage_speed = "";
      if (drainage_speed !== "" && isNaN(parseFloat(this.getReservationTime(e.target.value))) === false) {
        drainage_speed = (parseFloat(this.state.target_water_removal_amount) /parseFloat(this.getReservationTime(e.target.value))).toFixed(2);
      }
      this.setState({
        drainage_time: e.target.value,
        drainage_speed: drainage_speed,
        drainage_speed_display: this.convertDecimal(drainage_speed, this.pattern_fixed['drainage_speed'])
        // is_overweight,
      });
    } else if (key === "max_drainage_speed")
      this.setState({ max_drainage_speed: e.target.value });
    else if (key === "max_drainage_amount")
      this.setState({ max_drainage_amount: e.target.value });
    if (this.fixed_params.indexOf(key)>-1) {
      let display_key = key + '_display';
      this.setState({[display_key]:e.target.value});
    }
  };
  
  send = () => {
    let default_array = this.state.default_array;
    let send_data = this.state.schedule_data;
    if (!(send_data !== undefined && send_data.dial_pattern !== undefined)) {
      window.sessionStorage.setItem(
        "alert_messages",
        "スケジュールを選択してください。"
      );
      return;
    }
    send_data.dial_pattern.bed_no = this.state.bed_no;
    send_data.dial_pattern.console = this.state.console;
    send_data.dial_pattern.dilution_timing = this.state.dilution_timing;
    send_data.dial_pattern.degree = this.state.degree;
    send_data.dial_pattern.dw = this.state.dw;
    send_data.dial_pattern.fluid_speed = this.state.fluid_speed;
    send_data.dial_pattern.fluid = this.state.fluid;
    send_data.dial_pattern.max_drainage_amount = this.state.max_drainage_amount;
    send_data.dial_pattern.max_drainage_speed = this.state.max_drainage_speed;
    send_data.dial_pattern.fluid_amount = this.state.fluid_amount;
    send_data.dial_pattern.blood_flow = this.state.blood_flow;
    send_data.dial_pattern.drainage_speed = this.state.drainage_speed;
    send_data.dial_pattern.diagonosis_time = this.state.diagonosis_time;
    send_data.dial_pattern.drainage_time = this.state.drainage_time;
    send_data.target_water_removal_amount = this.state.target_water_removal_amount;
    send_data.target_weight = this.state.target_weight;
    send_data.dial_pattern.hdf_speed = this.state.hdf_speed;
    send_data.dial_pattern.hdf_step = this.state.hdf_step;
    send_data.dial_pattern.hdf_init_time = this.state.hdf_init_time;
    send_data.dial_pattern.dialysate_amount = this.state.dialysate_amount;
    send_data.dial_pattern.fluid_temperature = this.state.fluid_temperature;
    send_data.dial_anti.syringe_stop_time = this.state.syringe_stop_time;
    send_data.dial_anti.syringe_speed = this.state.syringe_speed;
    send_data.dial_anti.syringe_amount = this.state.syringe_amount;
    send_data.dial_pattern.fluid_time = this.state.fluid_time;
    send_data.dial_pattern.hdf_init_amount = this.state.hdf_init_amount;
    send_data.dial_pattern.supplementary_food = this.state.supplementary_food;
    send_data.weight_after = this.state.weight_after;
    send_data.weight_before = this.state.weight_before;
    send_data.instruction_doctor_number = this.state.instruction_doctor_number;
    
    // 除水設定のキュー登録時に、不使用の項目は、 default_if_unusable が存在すれば空文字列の代わりにdefault_if_unusable の値をセットしてください。
    if (
      this.state.is_save_only !== 1 &&
      default_array != undefined &&
      default_array != null &&
      Object.keys(default_array).length !== 0
    ) {
      Object.keys(default_array).map((index) => {
        let item = default_array[index];
        if (item.is_usable === 0 && item.default_if_unusable != null) {
          if (
            index == "weight_before" ||
            index == "target_water_removal_amount"
          ) {
            send_data[index] = item.default_if_unusable;
          } else if (
            index == "syringe_stop_time" ||
            index == "syringe_speed" ||
            index == "syringe_amount"
          ) {
            send_data.dial_anti[index] = item.default_if_unusable;
          } else {
            send_data.dial_pattern[index] = item.default_if_unusable;
          }
        }
      });
    }
    this.setState({is_sended: true});
    this.props.sendConsole(send_data);
  };
  
  gotoMonitor = (is_started) => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "patient");
    if (patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined) {
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_data");
    if (schedule_data == undefined || schedule_data == null || schedule_data.number == undefined) {
      window.sessionStorage.setItem("alert_messages", "スケジュールを登録してください。");
      return;
    }
    if (this.state.weight_before == null || this.state.weight_before === "") {
      window.sessionStorage.setItem("alert_messages", "この患者様の前体重測定値が空欄です。");
      return;
    }
    if (this.state.schedule_data.end_date != null) {
      window.sessionStorage.setItem("alert_messages", "治療が終了されました。");
      return;
    }
    if (is_started != 1 && (this.state.schedule_data.is_sended == 0 && this.state.schedule_data.condition_sended_at == null)) {
      this.setState({
        confirm_message: "設定内容はまだ送信されていません。\n開始後は条件をコンソールに送信できませんが、開始時刻設定に進みますか？",
        confirm_action: "send_console",
        confirm_alert_title:'注意',
        is_started,
      });
      return;
    }
    this.setState({
      isTimeModal: true,
      time_title: is_started === 1 ? "透析終了時刻設定" : "透析開始時刻設定",
    });
    
    if (is_started == undefined || is_started == 0) {
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_started", 1);
    }
    if (
      sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_started") ==
      1 ||
      is_started == 1
    ) {
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_started", 2); //終了済みの場合
    }
  };
  getReservationTime(dt) {
    var datas = dt.split(":");
    if (parseInt(datas[1]) == 0) return parseInt(datas[0]);
    let result = parseInt(datas[0]) + parseInt(datas[1]) / 60;
    return result.toFixed(2);
  }
  
  validateTime = (validate_time) => {
    if (validate_time.length > 5) {
      return false;
    }
    let time = validate_time.split(":");
    if (time[1] == undefined) {
      return false;
    } else {
      if (
        isNaN(parseInt(time[0])) === true ||
        isNaN(parseInt(time[1])) === true
      ) {
        return false;
      }
      if (parseInt(time[0]) > 23 || parseInt(time[1]) > 59) {
        return false;
      }
    }
    return true;
  };
  
  checkValidation = () => {
    removeRedBorder('time_limit_from_id');
    let error_str_arr = [];
    
    if (
      this.state.schedule_data.dial_pattern === undefined &&
      this.state.schedule_data.dial_pattern.bed_no === 100
    ) {
      error_str_arr.push("ベッドNoを設定してください。");
    }
    if (
      this.state.schedule_data.dial_pattern === undefined &&
      this.state.schedule_data.dial_pattern.console === 100
    ) {
      error_str_arr.push("コンソールNoを設定してください。");
    }
    if (
      this.state.fluid_time !== "" &&
      !this.validateTime(this.state.fluid_time)
    ) {
      error_str_arr.push("補液時間はHHMM形式で正しい値を入力してください。");
      addRedBorder('diagonosis_time_id');
    }
    let validate_data = this.telegramValidate(this.state.schedule_data.dial_pattern.dial_method);
    
    if (validate_data.first_tag_id != '') {
      this.setState({ first_tag_id: validate_data.first_tag_id })
    }
    if (validate_data.error_str_arr.length > 0) {
      validate_data.error_str_arr.map(item => {
        error_str_arr.push(item);
      })
    }
    return error_str_arr;
  }
  
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  
  openSendModal = () => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    let schedule_data = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "schedule_data"
    );
    if (
      schedule_data == undefined ||
      schedule_data == null ||
      schedule_data.number == undefined
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "スケジュールを登録してください。"
      );
      return;
    }
    if (this.state.instruction_doctor_number === 0) {
      this.showDoctorList();
      return;
    }
    if (
      this.state.weight_before === undefined ||
      this.state.weight_before == null ||
      this.state.weight_before === ""
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "この患者様の前体重測定値が空欄です。"
      );
      return;
    }
    if (
      sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check") !== 1
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "開始前確認をチェックしてください"
      );
      return;
    }
    if (this.state.schedule_data.end_date != null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "治療が終了されました。"
      );
      return;
    }
    if (
      this.state.schedule_data.console_start_date != null ||
      this.state.schedule_data.start_date != null
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "治療が開始されました。"
      );
      return;
    }
    let error_str_array = this.checkValidation();
    
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return
    }
    
    
    if (this.state.is_started == 0) {
      this.setState({ isSendConsole: true });
    }
  };
  
  closeModal = () => {
    this.setState({
      isSendConsole: false,
      isopenHistoryModal: false,
      openChangeBedConsolemodal: false,
    });
  };
  
  saveData = () => {
    this.setState({isSendConsole: false}, () => {
        this.setChange();
      }
    );
  };
  
  sendConsole = () => {
    this.setState({isSendConsole: false},() => {
        this.send();
      }
    );
  };
  
  getDilution = (e) => {
    let default_array = this.state.default_array;
    if (
      Object.keys(default_array).length !== 0 &&
      default_array.dilution_timing.is_usable !== 0
    ){
      this.setChangeFlag(1);
      this.setState({ dilution_timing: parseInt(e.target.value) });
    }
  };
  
  getTargetDrainage = (e) => {
    if (this.state.weight_before == null || this.state.weight_before == "")
      return;
    this.setChangeFlag(1);
    let fluid = this.state.fluid == "" ? 0 : parseFloat(this.state.fluid);
    let supplementary_food =
      this.state.supplementary_food == ""
        ? 0
        : parseFloat(this.state.supplementary_food);
    //本日目標除水量を再計算
    let today_water_removal_amount = isNaN(parseFloat(e.target.value))
      ? 0 - fluid - supplementary_food
      : parseFloat(e.target.value) - fluid - supplementary_food;
    //目標体重を再計算
    let target_weight =
      parseFloat(this.state.weight_before) - today_water_removal_amount;
    let drainage_speed = 0;
    if (e.target.value !== "" && !isNaN(parseFloat(e.target.value))) {
      drainage_speed = (
        parseFloat(e.target.value) /
        parseFloat(this.getReservationTime(this.state.drainage_time))
      ).toFixed(2);
    }
    this.setState({
      target_water_removal_amount: e.target.value,
      target_water_removal_amount_display: e.target.value,
      today_water_removal_amount: this.convertDecimal(today_water_removal_amount, 2),
      today_water_removal_amount_display: this.convertDecimal(today_water_removal_amount, this.pattern_fixed['today_water_removal_amount']),
      target_weight: this.convertDecimal(target_weight, 2),
      target_weight_display: this.convertDecimal(target_weight, this.pattern_fixed['target_weight']),
      drainage_speed,
      drainage_speed_display: this.convertDecimal(drainage_speed,this.pattern_fixed['drainage_speed'])
    });
  };
  
  getDrainageSpeed = (e) => {
    this.setChangeFlag(1);
    let target_water_removal_amount = "";
    if (e.target.value !== "" && !isNaN(parseFloat(e.target.value))) {
      target_water_removal_amount = (
        parseFloat(e.target.value) *
        parseFloat(this.getReservationTime(this.state.drainage_time))
      ).toFixed(2);
    } else {
      target_water_removal_amount = 0;
    }
    //本日目標除水量を再計算
    let today_water_removal_amount = 0;
    let fluid = this.state.fluid == "" ? 0 : parseFloat(this.state.fluid);
    let supplementary_food =
      this.state.supplementary_food == ""
        ? 0
        : parseFloat(this.state.supplementary_food);
    if (
      target_water_removal_amount != "" &&
      !isNaN(target_water_removal_amount)
    ) {
      today_water_removal_amount =
        target_water_removal_amount - fluid - supplementary_food;
    } else {
      today_water_removal_amount = 0 - fluid - supplementary_food;
    }
    //目標体重を再計算
    let target_weight =
      parseFloat(this.state.weight_before) - today_water_removal_amount;
    this.setState({
      target_water_removal_amount: this.convertDecimal(target_water_removal_amount, 2),
      target_water_removal_amount_display: this.convertDecimal(target_water_removal_amount, this.pattern_fixed['target_water_removal_amount']),
      today_water_removal_amount: this.convertDecimal(today_water_removal_amount, 2),
      today_water_removal_amount_display: this.convertDecimal(today_water_removal_amount, this.pattern_fixed['today_water_removal_amount']),
      target_weight: this.convertDecimal(target_weight, 2),
      target_weight_display: this.convertDecimal(target_weight, this.pattern_fixed['target_weight']),
      drainage_speed: e.target.value,
      drainage_speed_display: e.target.value,
    });
  };
  tabChange = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        confirm_message:
          "コンソールへ送信せずに移動すると変更前の入力内容に戻りますがよろしいですか？",
        goto_tabindex: Dial_tab_index.Sending,
      });
      return;
    }
    this.props.tabChange(Dial_tab_index.Sending);
  };
  
  getIncreaseWeight = () => {
    if (this.state.prevTimeWeight == "" || this.state.prevTimeWeight == null)
      return "";
    if (
      parseFloat(this.state.weight_before) > 0 &&
      parseFloat(this.state.prevTimeWeight) > 0
    ) {
      let ret = parseFloat(
        parseFloat(this.state.weight_before) -
        parseFloat(this.state.prevTimeWeight)
      ).toFixed(1);
      return ret;
    }
    return "";
  };
  
  getDwIncreaseWeight = () => {
    if (this.state.dw > 0 && parseFloat(this.state.weight_before) > 0) {
      let ret = parseFloat(parseFloat(this.state.weight_before) - parseFloat(this.state.dw)).toFixed(1);
      return ret;
    }
    return "";
  };
  
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
    return dial_tiems;
  }
  
  updateEndTime = async() => {
    let is_ended = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"is_ended");
    if (is_ended === undefined || is_ended == 0) {
      let server_time = await getServerTime();
      this.props.updateScheduleTime(new Date(server_time), 1);
      // this.setState({
      //     isTimeModal: true,
      //     time_title: '透析終了時刻設定'
      // });
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_ended", 1);
    }
  };
  
  closeTimeModal = () => {
    this.setState({ isTimeModal: false });
  };
  
  handleTimeModal = (value, is_start, puncture_staff_number, start_staff_number) => {
    this.setState({ isTimeModal: false });
    var in_today_flag = true;
    if (is_start == false){
      if (this.start_date_time != null){
        var start_time_object = new Date(formatDateTimeIE(this.start_date_time));
        var end_time_object = new Date(formatDateTimeIE(this.start_date_time));
        var base_time_object = new Date(formatDateTimeIE(this.start_date_time));
        var end_hour = value.split(':')[0];
        var end_mins = value.split(':')[1];
        
        let dial_timezone = JSON.parse(window.sessionStorage.getItem("init_status")).dial_timezone['timezone'];
        let base_value = dial_timezone != undefined && dial_timezone != null && dial_timezone[1]!= undefined && dial_timezone['1'] !=null &&
        dial_timezone[1]['start'] != null && dial_timezone[1]['start'] != "" ? dial_timezone[1]['start']:"09:40";
        
        var base_hour = base_value.split(':')[0];
        var base_mins = base_value.split(':')[1];
        end_time_object.setHours(parseInt(end_hour));
        end_time_object.setMinutes(parseInt(end_mins));
        
        base_time_object.setHours(parseInt(base_hour));
        base_time_object.setMinutes(parseInt(base_mins));
        if (start_time_object.getTime() >= end_time_object.getTime()){
          in_today_flag = false;
        }
      }
    }
    let is_started = is_start ? 0 : 1;
    this.props.updateScheduleTime(value, is_started, puncture_staff_number, start_staff_number, in_today_flag);
    this.props.tabChange(Dial_tab_index.DialMonitor);
  };
  
  setConfirm = () => {
    let error_str_array = [];
    let validate_data = this.telegramValidate(this.state.schedule_data.dial_pattern.dial_method);
    
    if (validate_data.first_tag_id != '') {
      this.setState({ first_tag_id: validate_data.first_tag_id })
    }
    if (validate_data.error_str_arr.length > 0) {
      validate_data.error_str_arr.map(item => {
        error_str_array.push(item);
      })
    }
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    this.setState({
      confirm_message: "設定を変更しますか？",
    });
  };
  
  setChange = async() => {
    this.confirmCancel();
    let patientInfo = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "patient"
    );
    if (
      patientInfo === undefined ||
      patientInfo == null ||
      patientInfo.system_patient_id === undefined
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    let schedule_data = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "schedule_data"
    );
    if (
      schedule_data === undefined ||
      schedule_data == null ||
      schedule_data.number === undefined
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "スケジュールを登録してください。"
      );
      return;
    }
    var init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    let default_diff_hour =
      init_status.dial_drainage_set_hour !== undefined
        ? init_status.dial_drainage_set_hour
        : null;
    let diff_hour = "";
    if (this.state.end_time != null && this.state.end_time != "") {
      let server_time = await getServerTime();
      diff_hour = getDifferentTime(new Date(server_time), this.state.end_time);
    }
    if (
      (this.state.start_time != null && this.state.start_time != "") ||
      (default_diff_hour != null &&
        diff_hour != "" &&
        diff_hour < default_diff_hour * 60 * 60 * 1000)
    ) {
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
    }
    if (
      default_diff_hour != null &&
      diff_hour != "" &&
      diff_hour > default_diff_hour * 60 * 60 * 1000
    ) {
      if (
        this.context.$canDoAction(
          this.context.FEATURES.DIAL_SYSTEM,
          this.context.AUTHS.EDIT_OLD
        ) === false
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "変更権限がありません。"
        );
        return;
      }
    }
    
    if (this.state.instruction_doctor_number === 0) {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    let post_data = {
      schedule_id: schedule_data.number,
      instruction_doctor_number: this.state.instruction_doctor_number,
      diagonosis_time: this.state.diagonosis_time, //透析時間
      drainage_time: this.state.drainage_time, //除水時間
      blood_flow: this.state.blood_flow, //血液流量
      dialysate_amount: this.state.dialysate_amount, //透析液流量
      degree: this.state.degree, //透析液温度
      dilution_timing: this.state.dilution_timing, //前補液/後補液の選択
      fluid_amount: this.state.fluid_amount, //補液量
      fluid_speed: this.state.fluid_speed, //補液速度
      fluid_time: this.state.fluid_time, //補液時間
      fluid_temperature: this.state.fluid_temperature, //補液温度
      hdf_init_time: this.state.hdf_init_time, //I-HDF 補液開始時間
      hdf_init_amount: this.state.hdf_init_amount, //I-HDF 1回補液量
      hdf_step: this.state.hdf_step, //I-HDF 補液間隔
      hdf_speed: this.state.hdf_speed, //I-HDF 1回補液速度
      target_weight: this.state.target_weight, //本日目標体重
      fluid: this.state.fluid, //補液
      supplementary_food: this.state.supplementary_food, //補食
      target_water_removal_amount: this.state.target_water_removal_amount, //総除水量設定
      drainage_speed: this.state.drainage_speed, //除水速度
      max_drainage_amount: this.state.max_drainage_amount, //最大除水量
      max_drainage_speed: this.state.max_drainage_speed, //最大除水速度,
      bed_no: this.state.bed_no,
      console: this.state.console
    };
    if (this.getChange() == false) {
      window.sessionStorage.setItem(
        "alert_messages",
        "変更された内容がありません。"
      );
      return;
    }
    this.props.setChange(post_data);
  };
  selectDoctor = (doctor) => {
    this.setChangeFlag(1);
    this.setState({
      directer_name: doctor.name,
      instruction_doctor_number: doctor.number,
      isShowDoctorList: false,
    });
    this.context.$updateDoctor(doctor.number, doctor.name);
  };
  closeDoctorSelectModal = () => {
    this.setState({
      isShowDoctorList: false,
    });
  };
  showDoctorList = () => {
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
  
  getChange = () => {
    let patientInfo = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "patient"
    );
    if (patientInfo == undefined || !(patientInfo.system_patient_id > 0))
      return false;
    
    let cur_state = this.state.cur_state;
    let post_data = {
      diagonosis_time: this.state.diagonosis_time, //透析時間
      drainage_time: this.state.drainage_time, //除水時間
      blood_flow: this.state.blood_flow, //血液流量
      dialysate_amount: this.state.dialysate_amount, //透析液流量
      degree: this.state.degree, //透析液温度
      dilution_timing: this.state.dilution_timing, //前補液/後補液の選択
      fluid_amount: this.state.fluid_amount, //補液量
      fluid_speed: this.state.fluid_speed, //補液速度
      fluid_time: this.state.fluid_time, //補液時間
      fluid_temperature: this.state.fluid_temperature, //補液温度
      hdf_init_time: this.state.hdf_init_time, //I-HDF 補液開始時間
      hdf_init_amount: this.state.hdf_init_amount, //I-HDF 1回補液量
      hdf_step: this.state.hdf_step, //I-HDF 補液間隔
      hdf_speed: this.state.hdf_speed, //I-HDF 1回補液速度
      target_weight: this.state.target_weight, //本日目標体重
      fluid: this.state.fluid, //補液
      supplementary_food: this.state.supplementary_food, //補食
      target_water_removal_amount: this.state.target_water_removal_amount, //総除水量設定
      drainage_speed: this.state.drainage_speed, //除水速度
      max_drainage_amount: this.state.max_drainage_amount, //最大除水量
      max_drainage_speed: this.state.max_drainage_speed, //最大除水速度
    };
    let return_value = false;
    Object.keys(post_data).map((index) => {
      if (post_data[index] != cur_state[index]) {
        return_value = true;
      }
    });
    return return_value;
  };
  
  openHistoryModal = () => {
    let patientInfo = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "patient"
    );
    if (
      patientInfo == undefined ||
      patientInfo == null ||
      patientInfo.system_patient_id == undefined
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    let schedule_data = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "schedule_data"
    );
    if (
      schedule_data == undefined ||
      schedule_data == null ||
      schedule_data.number == undefined
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "スケジュールを登録してください。"
      );
      return;
    }
    this.setState({
      isopenHistoryModal: true,
      system_patient_id: patientInfo.system_patient_id,
      schedule_number: schedule_data.number,
    });
  };
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
    });
  }
  
  confirmOk() {
    if (this.state.confirm_action == "send_console") {
      let {is_started} = this.state;
      this.setState({
        isTimeModal: true,
        confirm_message: '',
        confirm_action: '',
        time_title: is_started === 1 ? "透析終了時刻設定" : "透析開始時刻設定",
      });
      
      if (is_started == undefined || is_started == 0) {
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_started", 1);
      }
      if (sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_started") == 1 || is_started == 1) {
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_started", 2); //終了済みの場合
      }
      return;
    }
    if (this.state.confirm_message == "設定を変更しますか？") {
      this.setChange();
      return;
    } else if (
      this.state.confirm_message !=
      "コンソールへ送信せずに移動すると変更前の入力内容に戻りますがよろしいですか？"
    ) {
      let drainage_speed = 0;
      let { tmp_diagonosis_time } = this.state;
      if (
        this.state.target_water_removal_amount == undefined ||
        this.state.target_water_removal_amount == null
      )
        drainage_speed = "";
      if (isNaN(parseFloat(this.state.target_water_removal_amount)))
        drainage_speed = "";
      if (
        drainage_speed !== "" &&
        isNaN(parseFloat(this.getReservationTime(tmp_diagonosis_time))) ===
        false
      ) {
        drainage_speed = (
          parseFloat(this.state.target_water_removal_amount) /
          parseFloat(this.getReservationTime(tmp_diagonosis_time))
        ).toFixed(2);
      }
      
      let fluid_amount = "";
      if (
        isNaN(parseFloat(this.getReservationTime(tmp_diagonosis_time))) ===
        false &&
        isNaN(parseFloat(this.state.fluid_speed)) === false
      ) {
        fluid_amount = (
          parseFloat(this.state.fluid_speed) *
          parseFloat(this.getReservationTime(tmp_diagonosis_time))
        ).toFixed(2);
      }
      this.setState({
        fluid_time: tmp_diagonosis_time,
      });
      
      this.setState({
        confirm_message: "",
        diagonosis_time: this.state.tmp_diagonosis_time,
        drainage_time: tmp_diagonosis_time,
        drainage_speed: drainage_speed,
        drainage_speed_display: this.convertDecimal(drainage_speed, this.pattern_fixed['drainage_speed']),
        fluid_amount,
        fluid_amount_display: this.convertDecimal(fluid_amount, this.pattern_fixed['fluid_amount']),
      });
    } else {
      if (
        this.state.goto_tabindex != undefined &&
        this.state.goto_tabindex != null
      )
        this.props.tabChange(this.state.goto_tabindex);
    }
  }
  selectTitleTab = (tab_id) => {
    if (tab_id == Dial_tab_index.DrainageSet) return;
    if (this.state.change_flag == 1) {
      this.setState({
        confirm_message:
          "コンソールへ送信せずに移動すると変更前の入力内容に戻りますがよろしいですか？",
        goto_tabindex: tab_id,
      });
      return;
    }
    this.props.tabChange(tab_id);
  };
  
  openChangeBedConsolemodal=(type)=>{
    if(this.state.schedule_date === undefined || this.state.schedule_date == null || this.state.schedule_date == ""){
      return;
    }
    this.setState({
      openChangeBedConsolemodal:true,
      modal_kind:type
    });
  }
  
  setBedConsole=(key, value, default_console=null)=>{
    if(default_console != null && key == "bed_no"){
      this.setState({
        bed_no:value,
        console:default_console,
      }, ()=>{
        this.closeModal();
      });
    } else {
      this.setState({[key]:value}, ()=>{
        this.closeModal();
      });
    }
  }
  
  getBlurValue = (key) => {
    let state_key = key + "_display";
    this.setState({
      [state_key]:this.state[state_key] != null && this.state[state_key] != '' && !isNaN(this.state[state_key]) ? parseFloat(this.state[state_key]).toFixed(this.pattern_fixed[key]): ""
    });
  }
  
  render() {
    let {schedule_data} = this.props;
    if (schedule_data !== undefined){
      if (schedule_data.start_date != undefined && schedule_data.start_date != null && schedule_data.start_date != ''){
        this.start_date_time = schedule_data.start_date;
      } else {
        if (schedule_data.console_start_date != undefined && schedule_data.console_start_date != null && schedule_data.console_start_date != ''){
          this.start_date_time = schedule_data.console_start_date;
        }
      }
    }
    if (this.start_date_time == null){
      if (this.state.start_time !== undefined && this.state.start_time !== "") this.start_date_time = this.state.start_time;
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let default_array = this.state.default_array;
    let is_overweight = 0;
    let is_overspeed = 0;
    let is_started = 0;
    let is_ended = 0;
    if (
      this.props.schedule_data.console_start_date != null ||
      this.props.schedule_data.start_date != null
    ) {
      is_started = 1;
    }
    // if (this.props.schedule_data.console_end_date != null) {
    //   is_ended = 1;
    // }
    let end_state = 0;
    if (this.props.schedule_data.end_date != null) {
      end_state = 1;
    }
    
    if (
      this.state.target_water_removal_amount != null &&
      this.state.target_water_removal_amount !== "" &&
      this.state.max_drainage_amount != null &&
      this.state.max_drainage_amount != "" &&
      this.state.max_drainage_amount != 0
    ) {
      if (
        parseFloat(this.state.target_water_removal_amount) >
        parseFloat(this.state.max_drainage_amount)
      ) {
        is_overweight = 1;
      }
    }
    if (
      this.state.drainage_speed != null &&
      this.state.drainage_speed !== "" &&
      this.state.max_drainage_speed != null &&
      this.state.max_drainage_speed != "" &&
      this.state.max_drainage_speed != 0
    ) {
      if (
        parseFloat(this.state.drainage_speed) >
        parseFloat(this.state.max_drainage_speed)
      ) {
        is_overspeed = 1;
      }
    }
    let disabled =
      this.state.weight_before == null || this.state.weight_before == "";
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let console_bed_number_change_flag = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined &&
      initState.conf_data.dewatering_setting_console_bed_number_change !== undefined && initState.conf_data.dewatering_setting_console_bed_number_change == "ON"){
      console_bed_number_change_flag = 1;
    }
    return (
      <>
        <Wrapper className="drainage-set">
          <div className={'justify-content flex'}>
            <div className="left-area">
              <div className={"block-area1"}>
                <div className="text-part text-left dial_method first-label flex sub-div mb-div">
                  <InputWithLabel
                    label="治療法"
                    type="text"
                    diseaseEditData={this.state.dial_method}
                    isDisabled={true}
                  />
                </div>
                <div className="flex has-unit multi reservation_time mb-div">
                  <div className={'first-label sub-div'}>
                    <SelectorWithLabel
                      title="透析時間"
                      options={this.state.dial_tiems}
                      getSelect={this.getValue.bind(this, "diagonosis_time")}
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.diagonosis_time.is_usable === 0
                      }
                      value={this.state.diagonosis_time}
                      id='diagonosis_time_id'
                    />
                  </div>
                  <div className={'dial-degree'}></div>
                  <div className={'second-label sub-div'}>
                    <SelectorWithLabel
                      title="除水時間"
                      options={this.state.dial_tiems}
                      getSelect={this.getValue.bind(this, "drainage_time")}
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.drainage_time.is_usable === 0
                      }
                      value={this.state.drainage_time}
                      id='drainage_time_id'
                    />
                  </div>
                </div>
                {console_bed_number_change_flag && (
                  <div className="flex has-unit multi reservation_time mb-div">
                    <div className={'first-label flex sub-div'} style={{marginBottom:0}}>
                      <div className={'label-title'}>ベッドNo</div>
                      {is_started ? (
                        <div className={'value-box'} style={{background:"rgb(204, 204, 204)", cursor:"auto"}}>
                          {this.state.bed_no != 0 ? this.state.bed_master_code_list[this.state.bed_no] : ""}
                        </div>
                      ):(
                        <div className={'value-box'} onClick={this.openChangeBedConsolemodal.bind(this, "bed_no")}>
                          {this.state.bed_no != 0 ? this.state.bed_master_code_list[this.state.bed_no] : ""}
                        </div>
                      )}
                    </div>
                    <div className={'dial-degree'}></div>
                    <div className={'second-label flex sub-div'} style={{marginBottom:0, width:"calc((100% - 8.2rem) / 2 + 2.5rem)"}}>
                      <div className={'label-title'}>コンソールNo</div>
                      {is_started ? (
                        <div className={'value-box'} style={{background:"rgb(204, 204, 204)", cursor:"auto", minWidth:"4rem"}}>
                          {this.state.console != 0 ? this.state.console_master_code_list[this.state.console] : ""}
                        </div>
                      ):(
                        <div className={'value-box'} onClick={this.openChangeBedConsolemodal.bind(this, "console")} style={{minWidth:"4rem"}}>
                          {this.state.console != 0 ? this.state.console_master_code_list[this.state.console] : ""}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex one-row mb-div">
                  <div className={'first-label sub-div'}>
                    <InputWithLabelBorder
                      label="血流量"
                      type="number"
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.blood_flow.is_usable === 0
                      }
                      getInputText={this.getValue.bind(this, "blood_flow")}
                      diseaseEditData={this.state.blood_flow}
                      id='blood_flow_id'
                    />
                  </div>
                  <div className="dial-degree unit">
                    {this.pattern_unit != null &&
                    this.pattern_unit["blood_flow"] !== undefined
                      ? this.pattern_unit["blood_flow"]["value"]
                      : ""}
                  </div>
                  <div className={'second-label sub-div'}>
                    <InputWithLabelBorder
                      label="透析液流量"
                      type="number"
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.dialysate_amount.is_usable === 0
                      }
                      getInputText={this.getValue.bind(this, "dialysate_amount")}
                      diseaseEditData={this.state.dialysate_amount}
                      id="dialysate_amount_id"
                    />
                  </div>
                  <div className="dial-degree unit">
                    {this.pattern_unit != null &&
                    this.pattern_unit["dialysate_amount"] !== undefined
                      ? this.pattern_unit["dialysate_amount"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex has-unit trio mb-div">
                  <div className={'first-label num-sub-div'}>
                    <NumericInputWithUnitLabel
                      label="透析液温度"
                      unit={
                        this.pattern_unit != null &&
                        this.pattern_unit["degree"] !== undefined
                          ? this.pattern_unit["degree"]["value"]
                          : ""
                      }
                      className="form-control"
                      value={this.state.degree}
                      getInputText={this.getdegree.bind(this)}
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
                      id='degree_id'
                    />
                  </div>
                </div>
              </div>
              <div className={"block-area text-part text-left anticogulation remove-x-input"}>
                <div className="label-exist">
                  <InputWithLabel
                    label="抗凝固剤"
                    type="text"
                    isDisabled={true}
                    diseaseEditData={this.state.anticoagulationMethod}
                  />
                </div>
                <div className="group-area mb-2">
                  {this.state.dial_antis != null &&
                    this.state.dial_antis.map((item, index) => {
                      return (
                        <div className="label-exist" key={index}>
                          <InputWithLabel
                            label=""
                            type="text"
                            isDisabled={true}
                            diseaseEditData={
                              item.name + " " + item.amount + item.unit
                            }
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
              <div>
                <div
                  className={"mb-div flex "+(
                    Object.keys(default_array).length !== 0 &&
                    default_array.dilution_timing.is_usable !== 0
                      ? "gender"
                      : "gender disable")
                  }
                >
                  <div className={'label-title'}>前補液/後補液の選択</div>
                  <div style={{marginRight:"0.3rem"}}>
                    <RadioButton
                      id="male"
                      value={0}
                      label="前補液(前希釈)"
                      name="gender"
                      getUsage={this.getDilution}
                      checked={this.state.dilution_timing === 0}
                    />
                  </div>
                  <RadioButton
                    id="femaie"
                    value={1}
                    label="後補液(後希釈)"
                    name="gender"
                    getUsage={this.getDilution}
                    checked={this.state.dilution_timing === 1}
                  />
                </div>
                <div className="flex one-row mb-div">
                  <div className="flex has-unit sub-div" style={{marginBottom:0}}>
                    <InputWithLabelBorder
                      label="補液量"
                      type="text"
                      diseaseEditData={this.state.fluid_amount_display}
                      getInputText={this.getValue.bind(this, "fluid_amount")}
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.fluid_amount.is_usable === 0
                      }
                      onBlur={this.getBlurValue.bind(this,'fluid_amount')}
                      id='fluid_amount_id'
                    />
                  </div>
                  <div className="dial-degree unit">
                    {this.pattern_unit != null &&
                    this.pattern_unit["fluid_amount"] !== undefined
                      ? this.pattern_unit["fluid_amount"]["value"]
                      : ""}
                  </div>
                  <div className="flex has-unit sub-div" style={{marginBottom:0}}>
                    <InputWithLabelBorder
                      label="補液速度"
                      type="number"
                      getInputText={this.getValue.bind(this, "fluid_speed")}
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.fluid_speed.is_usable === 0
                      }
                      diseaseEditData={this.state.fluid_speed_display}
                      onBlur={this.getBlurValue.bind(this,"fluid_speed")}
                      id="fluid_speed_id"
                    />
                  </div>
                  <div className="dial-degree unit">
                    {this.pattern_unit != null &&
                    this.pattern_unit["fluid_speed"] !== undefined
                      ? this.pattern_unit["fluid_speed"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex one-row mb-div">
                  <div className="flex has-unit trio fluid-time sub-div" style={{marginBottom:0}}>
                    <SelectorWithLabel
                      title="補液時間"
                      options={this.state.dial_tiems}
                      getSelect={this.getValue.bind(this, "fluid_time")}
                      value={this.state.fluid_time}
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.fluid_time.is_usable === 0
                      }
                      id='fluid_time_id'
                    />
                  </div>
                  <div className={'dial-degree'}></div>
                  <div className="flex has-unit trio fluid_temperature num-sub-div" style={{marginBottom:0}}>
                    <NumericInputWithUnitLabel
                      label="補液温度"
                      unit={
                        this.pattern_unit != null &&
                        this.pattern_unit["fluid_temperature"] !== undefined
                          ? this.pattern_unit["fluid_temperature"]["value"]
                          : ""
                      }
                      className="form-control fluid-temperature"
                      value={this.state.fluid_temperature}
                      getInputText={this.getValue.bind(this, "fluid_temperature")}
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
                      id='fluid_temperature_id'
                    />
                  </div>
                </div>
                <div className="flex one-row mb-div">
                  <div className="flex has-unit multi sub-div" style={{marginBottom:0}}>
                    <InputWithLabelBorder
                      label="I-HDF 補液開始時間"
                      type="number"
                      getInputText={this.getValue.bind(this, "hdf_init_time")}
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.hdf_init_time.is_usable === 0
                      }
                      diseaseEditData={this.state.hdf_init_time}
                      id='hdf_init_time_id'
                    />
                  </div>
                  <div className="hdf-speed unit dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["hdf_init_time"] !== undefined
                      ? this.pattern_unit["hdf_init_time"]["value"]
                      : ""}
                  </div>
                  <div className="flex has-unit multi sub-div" style={{marginBottom:0}}>
                    <InputWithLabelBorder
                      label="I-HDF 1回補液量"
                      type="number"
                      getInputText={this.getValue.bind(this, "hdf_init_amount")}
                      diseaseEditData={this.state.hdf_init_amount}
                      id='hdf_init_amount_id'
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.hdf_init_amount.is_usable === 0
                      }
                    />
                  </div>
                  <div className="hdf-speed unit dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["hdf_init_amount"] !== undefined
                      ? this.pattern_unit["hdf_init_amount"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex one-row">
                  <div className="flex has-unit multi sub-div" style={{marginBottom:0}}>
                    <InputWithLabelBorder
                      label="I-HDF 補液間隔"
                      type="number"
                      getInputText={this.getValue.bind(this, "hdf_step")}
                      diseaseEditData={this.state.hdf_step}
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.hdf_step.is_usable === 0
                      }
                      id='hdf_step_id'
                    />
                  </div>
                  <div className="hdf-speed unit dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["hdf_step"] !== undefined
                      ? this.pattern_unit["hdf_step"]["value"]
                      : ""}
                  </div>
                  <div className="flex has-unit multi sub-div" style={{marginBottom:0}}>
                    <InputWithLabelBorder
                      label="I-HDF 1回補液速度"
                      type="number"
                      getInputText={this.getValue.bind(this, "hdf_speed")}
                      diseaseEditData={this.state.hdf_speed}
                      id='hdf_speed_id'
                      isDisabled={
                        Object.keys(default_array).length !== 0 &&
                        default_array.hdf_speed.is_usable === 0
                      }
                    />
                  </div>
                  <div className="hdf-speed unit dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["hdf_speed"] !== undefined
                      ? this.pattern_unit["hdf_speed"]["value"]
                      : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="right-area flex justify-content">
              <div className="left-input">
                <div className="flex sub-div" style={{marginTop:"0.5rem"}}>
                  <InputWithLabel
                    label="前回後体重"
                    type="text"
                    diseaseEditData={
                      this.state.prevTimeWeight !== undefined &&
                      this.state.prevTimeWeight != null
                      && this.state.prevTimeWeight>0?parseFloat(this.state.prevTimeWeight).toFixed(this.pattern_fixed['prevTimeWeight'])
                        : ""
                    }
                    isDisabled={true}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["prevTimeWeight"] !== undefined
                      ? this.pattern_unit["prevTimeWeight"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex bold sub-div mt-div">
                  <InputWithLabel
                    label="DW"
                    type="text"
                    diseaseEditData={this.state.dw>0? parseFloat(this.state.dw).toFixed(this.pattern_fixed["dw"]):""}
                    isDisabled={true}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["dw"] !== undefined
                      ? this.pattern_unit["dw"]["value"]
                      : ""}
                  </div>
                </div>
                <div className={"sub-div flex mt-div" + (disabled ? " pink-div" : " bold")}>
                  <InputWithLabel
                    label="前体重"
                    type="text"
                    diseaseEditData={this.state.weight_before>0? parseFloat(this.state.weight_before).toFixed(this.pattern_fixed["weight_before"]):""}
                    isDisabled={true}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["weight_before"] !== undefined
                      ? this.pattern_unit["weight_before"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex group-area sub-div mt-div">
                  <InputWithLabel
                    label="前回からの増加量"
                    type="text"
                    diseaseEditData={this.getIncreaseWeight()}
                    isDisabled={true}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["weight_before"] !== undefined
                      ? this.pattern_unit["weight_before"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex group-area sub-div mt-div">
                  <InputWithLabel
                    label="DWからの増加量"
                    type="text"
                    diseaseEditData={this.getDwIncreaseWeight()}
                    isDisabled={true}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["weight_before"] !== undefined
                      ? this.pattern_unit["weight_before"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="blank-area" style={{height: 30}} />
                <div className="flex sub-div mt-div">
                  <InputWithLabel
                    label="後体重"
                    type="number"
                    diseaseEditData={this.state.weight_after>0? parseFloat(this.state.weight_after).toFixed(this.pattern_fixed["weight_after"]):""}
                    isDisabled={true}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["weight_after"] !== undefined
                      ? this.pattern_unit["weight_after"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex group-area sub-div mt-div">
                  <InputWithLabel
                    label="本日の減少量"
                    type="number"
                    diseaseEditData={this.state.actualDrainage_display}
                    onBlur={this.getBlurValue.bind(this,"actualDrainage")}
                    isDisabled={true}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["actualDrainage"] !== undefined
                      ? this.pattern_unit["actualDrainage"]["value"]
                      : ""}
                  </div>
                </div>
              </div>
              <div className="right-input">
                <div className="flex sub-div" style={{marginTop:"0.5rem"}}>
                  <InputWithLabelBorder
                    label="本日目標体重"
                    type="number"
                    isDisabled={disabled}
                    getInputText={this.getGoalAmount.bind(this)}
                    diseaseEditData={this.state.target_weight_display}
                    onBlur={this.getBlurValue.bind(this, "target_weight")}
                    id='target_weight'
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["target_weight"] !== undefined
                      ? this.pattern_unit["target_weight"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex sub-div mt-div">
                  <InputWithLabel
                    label="本日目標除水量"
                    type="number"
                    isDisabled={disabled}
                    getInputText={this.getCurrentTargetAmount.bind(this)}
                    diseaseEditData={this.state.today_water_removal_amount_display}
                    onBlur={this.getBlurValue.bind(this, "today_water_removal_amount")}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["today_water_removal_amount"] !== undefined
                      ? this.pattern_unit["today_water_removal_amount"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex sub-div mt-div">
                  <InputWithLabel
                    label="補液"
                    type="number"
                    isDisabled={disabled}
                    getInputText={this.getfluid.bind(this)}
                    diseaseEditData={this.state.fluid_display}
                    onBlur={this.getBlurValue.bind(this, "fluid")}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["fluid"] !== undefined
                      ? this.pattern_unit["fluid"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex group-area sub-div mt-div">
                  <InputWithLabel
                    label="補食"
                    type="number"
                    isDisabled={disabled}
                    getInputText={this.getsupplementary_food.bind(this)}
                    diseaseEditData={this.state.supplementary_food_display}
                    onBlur={this.getBlurValue.bind(this, "supplementary_food")}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["supplementary_food"] !== undefined
                      ? this.pattern_unit["supplementary_food"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="blank-area" style={{ height: 30 }} />
                <div className={"sub-div flex bold mt-div" + (is_overweight ? " red-div" : "")}>
                  <InputWithLabelBorder
                    label="除水量設定"
                    type="number"
                    isDisabled={disabled}
                    getInputText={this.getTargetDrainage.bind(this)}
                    diseaseEditData={this.state.target_water_removal_amount_display}
                    onBlur={this.getBlurValue.bind(this, "target_water_removal_amount")}
                    id='target_water_removal_amount_id'
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["target_water_removal_amount"] !== undefined
                      ? this.pattern_unit["target_water_removal_amount"]["value"]
                      : ""}
                  </div>
                </div>
                <div className={"sub-div flex bold mt-div" + (is_overspeed ? " red-div" : "")}>
                  <InputWithLabel
                    label="除水速度"
                    type="number"
                    isDisabled={disabled}
                    getInputText={this.getDrainageSpeed.bind(this)}
                    onBlur={this.getBlurValue.bind(this, "drainage_speed")}
                    diseaseEditData={this.state.drainage_speed_display}
                    id='drainage_speed_id'
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["drainage_speed"] !== undefined
                      ? this.pattern_unit["drainage_speed"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex sub-div mt-div">
                  <InputWithLabel
                    label="最大除水量"
                    type="number"
                    isDisabled={disabled}
                    onBlur={this.getBlurValue.bind(this, "max_drainage_amount")}
                    getInputText={this.getValue.bind(this, "max_drainage_amount")}
                    diseaseEditData={this.state.max_drainage_amount_display}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["max_drainage_amount"] !== undefined
                      ? this.pattern_unit["max_drainage_amount"]["value"]
                      : ""}
                  </div>
                </div>
                <div className="flex sub-div mt-div">
                  <InputWithLabel
                    label="最大除水速度"
                    type="number"
                    isDisabled={disabled}
                    diseaseEditData={this.state.max_drainage_speed_display}
                    onBlur={this.getBlurValue.bind(this, "max_drainage_speed")}
                    getInputText={this.getValue.bind(this, "max_drainage_speed")}
                  />
                  <div className="dial-degree">
                    {this.pattern_unit != null &&
                    this.pattern_unit["max_drainage_speed"] !== undefined
                      ? this.pattern_unit["max_drainage_speed"]["value"]
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"update-drainge"}>
            <label>入力者</label>
            <div className="input-div">{this.state.entry_name}</div>
            {authInfo !== undefined &&
            authInfo != null &&
            authInfo.doctor_number > 0 ? (
              <>
                <label>指示者</label>
                <div className="input-div">{this.state.directer_name}</div>
              </>
            ) : (
              <>
                <div
                  className="direct_man d-flex"                  
                >
                  <label>指示者</label>
                  <div style={{cursor: "pointer"}} type="text" className="input-div" onClick={this.showDoctorList.bind(this)}>{this.state.directer_name}</div>
                </div>
              </>
            )}
            {this.state.start_time != null && this.state.start_time != "" && (
              <Button type="mono" onClick={this.state.change_flag == 1 && this.setConfirm.bind(this)} className={this.state.change_flag == 0 && "disable-button"}>
                設定変更
              </Button>
            )}
            <Button type="mono" onClick={this.openHistoryModal.bind(this)}>
              履歴
            </Button>
          </div>
          <div className="footer">
            <Button onClick={this.tabChange.bind(this)}>申し送りを確認</Button>
            <Button
              onClick={
                !(is_started === 1 || is_ended === 1) && this.openSendModal
              }
              className={
                (is_started === 1 || is_ended === 1) && "disable-button"
              }
            >
              コンソールへ送信
            </Button>
            {is_ended ? (
              <Button
                onClick={this.updateEndTime.bind(this)}
                className="disable-button"
                style={{ background: "#ff6a6a" }}
              >
                終了確認
              </Button>
            ) : (
              <Button
                onClick={
                  end_state !== 1 && this.gotoMonitor.bind(this, is_started)
                }
                className={end_state === 1 && "disable-button"}
              >
                {is_started !== 1 ? "透析開始" : "透析終了"}
              </Button>
            )}
          </div>
        </Wrapper>
        {this.state.isSendConsole && (
          <SendConsoleModal
            visible={true}
            sendConsole={this.sendConsole}
            saveData={this.saveData}
            closeModal={this.closeModal}
          />
        )}
        {this.state.isTimeModal && (
          <TimeInputModal
            title={this.state.time_title}
            closeModal={this.closeTimeModal}
            handleModal={this.handleTimeModal}
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
        
        {this.state.isopenHistoryModal && (
          <DewaterHistoryModal
            closeModal={this.closeModal}
            system_patient_id={this.state.system_patient_id}
            schedule_number={this.state.schedule_number}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOk.bind(this)}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.alert_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.openChangeBedConsolemodal  && (
          <ChangeBedConsoleModal
            closeModal={this.closeModal}
            setValue={this.setBedConsole}
            modal_kind={this.state.modal_kind}
            schedule_date={this.state.schedule_date}
            time_zone={this.state.time_zone}
          />
        )}
      </>
    );
  }
}

DrainageSet.contextType = Context;

DrainageSet.propTypes = {
  schedule_data: PropTypes.object,
  tabChange: PropTypes.func,
  sendConsole: PropTypes.func,
  is_started: PropTypes.number,
  is_ended: PropTypes.number,
  ms_start_time: PropTypes.string,
  ms_end_time: PropTypes.string,
  updateScheduleTime: PropTypes.func,
  weight_before: PropTypes.string,
  weight_after: PropTypes.string,
  ms_cur_drainage: PropTypes.string,
  setChange: PropTypes.func,
};

export default DrainageSet;
