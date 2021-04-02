import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import DialSideBar from "../DialSideBar1";
import PropTypes from "prop-types";
import Checkbox from "~/components/molecules/Checkbox";
import Context from "~/helpers/configureStore";
import { formatJapanDate } from "~/helpers/date";
import { pad, toHalfWidthOnlyNumber } from "~/helpers/dialConstants";
import { formatDateLine } from "~/helpers/date";
import axios from "axios";
import InputWithLabel from "../../../molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {
  removeRedBorder, 
  moveCaretPosition
} from '~/helpers/dialConstants';
import { scheduleValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 390px);
  left: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .card-body {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0;
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.25rem;
  width: 66rem;
  margin-right: 0;
  margin-top: 3%;
  height: 100%;
  float: left;
  .flex {
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
  }

  .hankaku-eng-num-input {
      ime-mode: inactive;
      input{
        ime-mode: inactive;
      }
      input:focus {
        background: #EEFFEE;
      }
  }

  .new-input-style{
    width: 23rem !important;
  }

  .wheelchair-today {
    width: 50%;
    margin-left: 11.5rem;
    label {
      width: 16.875rem;
      margin-top: 1.25rem;
      text-align: left;
    }
    input {
      height: 1.25rem !important;
    }
  }
  .cur_date {
    margin-top: 1.25rem;
    width: 100%;
    label{
      width: 7rem !important;
    }
    .treat-date-area{
      label{
        width: 5rem !important;
        text-align: left;
      }
    }
  }
  label {
    font-size: 1.25rem;
    text-align: right;
    width: 12.5rem;
    margin-top: 0.625rem;
    margin-right: 0.5rem;
  }
  input {
    width: 21.875rem;
  }

  .patient_info {
    padding-top: 1rem;
    .patient_name {
      padding-left: 4rem;
      font-size: 2.2rem;
      font-weight: bold;
      letter-spacing: 0.3em;
      height: 3.5rem;
      line-height: 3.5rem;
    }
    .patient_number {
      // padding-left: 6.875rem;
      // padding-top: 1rem;
      font-size: 1.5rem;
      height: 3.5rem;
      line-height: 3.5rem;
    }
    .unit {
      font-size: 1.5rem;
      padding-left: 1rem;
      // padding-top: 1.875rem;
      height: 3.5rem;
      line-height: 3.5rem;
    }
  }
  .react-datepicker-wrapper {
    width: 100%;
    .react-datepicker__input-container {
      width: 100%;
      input {
        height: 2.4rem;
        border-radius: 0.25rem;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 0.5rem;
      }
    }
  }
  .up-area {
    border: 1px solid rgb(141, 143, 144);
    width: calc(100% - 12.75rem);
    text-align: center;
    font-size: 1.8rem;
    height: 3.125rem;
    padding-top: 0.1rem;
  }
  .weight-area {
    padding-top: 0.3rem;
    width: 100%;
    .flex {
      width: 50%;
      div {
        width: 5%;
        input {
          width: 10rem;
        }
      }
    }
    .flex div:first-child {
      width: 95%;
    }
    input {
      text-align: right;
    }
  }
  .chair {
    .hvMNwk {
      width: calc(100% - 1.5rem);
      input {
        width: calc(100% - 6.25rem);
      }
    }
  }
  .footer {
    display: flex;
    margin-top: 1.25rem !important;
    margin-left: 40%;
    text-align: center;
    .add-button {
      text-align: center;
      button {
        text-align: center;
        border-radius: 0.25rem;
        background: rgb(105, 200, 225);
        border: none;
        margin-right: 1.875rem;
        span {
          color: white;
          font-weight: 100;
          font-size: 1.25rem;
        }
      }
    }
  }

  .flex {
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
    input {
      width: 15.625rem;
      border-color: rgb(141, 143, 144);
      border-radius: 0.25rem;
      padding: 0.625rem 0.625rem 0.625rem 0.625rem;
      font-size: 1.25rem;
      height: 3.125rem;
    }
  }
  .padding {
    padding: 1.25rem 0 0 0.9rem;
  }
  .dZZuAe .label-title {
    font-size: 1.25rem;
    width: 12.5rem;
    margin-top: 0.625rem;
    margin-right: 0.5rem;
  }
  .dZZuAe {
    b {
      display: none;
    }
  }
  .cqhJKX {
    span {
      width: 10rem;
    }
    input {
      width: 10rem !important;
      padding: 0.1ex 1ex !important;
      font-size: 1.25rem !important;
    }
  }
  .label-unit {
    display: none;
  }
`;

class InputWeight extends Component {
  static propTypes = {
    history: PropTypes.object,
  };
  constructor(props) {
    super(props);
    let weightDay = formatJapanDate(new Date());
    this.state = {
      weightDay,
      id: "",
      list_id: "",
      system_patient_id: 0,
      name: "",
      weight_before_raw: "",
      weight_before_raw_display: "",
      weight_after_raw: "",
      weight_after_raw_display: "",
      dw: "",
      dw_display: "",
      windbag_1: "",
      windbag_1_display: "",
      windbag_2: "",
      windbag_2_display: "",
      windbag_3: "",
      windbag_3_display: "",
      increase_amount: "",
      increase_amount_display: "",
      wheelchair_before: 0,
      wheelchair_before_display: 0,
      wheelchair_after: 0,
      wheelchair_after_display: 0,
      supplementary_food: "",
      supplementary_food_display: "",
      fluid: "",
      fluid_display: "",
      target_amount: 0,
      target_amount_display: 0,
      target_weight: 0,
      target_weight_display: 0,
      real_amount: "",
      real_amount_display: "",
      wheelchair_today: 0,
      isRegistConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      alert_message: "",
    };
    this.today_minus_amount = "";
    this.temp = "";
    let dial_common_config = JSON.parse(
      window.sessionStorage.getItem("init_status")
    ).dial_common_config; 
    this.pattern_fixed = {};
    if (
      dial_common_config !== undefined &&
      dial_common_config != null &&
      dial_common_config["小数点以下桁数：体重手入力"] !== undefined
    ) {
      this.pattern_fixed = dial_common_config["小数点以下桁数：体重手入力"];
    }
    this.pattern_fixed['dw'] =this.pattern_fixed != null &&  this.pattern_fixed['dw'] != undefined ? this.pattern_fixed['dw']['value'] : 1;
    this.pattern_fixed['weight_before_raw'] =this.pattern_fixed != null &&  this.pattern_fixed['weight_before_raw'] != undefined ? this.pattern_fixed['weight_before_raw']['value'] : 1;
    this.pattern_fixed['increase_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['increase_amount'] != undefined ? this.pattern_fixed['increase_amount']['value'] : 1;
    this.pattern_fixed['weight_after_raw'] =this.pattern_fixed != null &&  this.pattern_fixed['weight_after_raw'] != undefined ? this.pattern_fixed['weight_after_raw']['value'] : 1;
    this.pattern_fixed['target_weight'] =this.pattern_fixed != null &&  this.pattern_fixed['target_weight'] != undefined ? this.pattern_fixed['target_weight']['value'] : 1;
    this.pattern_fixed['fluid'] =this.pattern_fixed != null &&  this.pattern_fixed['fluid'] != undefined ? this.pattern_fixed['fluid']['value'] : 1;
    this.pattern_fixed['wheelchair_before'] =this.pattern_fixed != null &&  this.pattern_fixed['wheelchair_before'] != undefined ? this.pattern_fixed['wheelchair_before']['value'] : 1;
    this.pattern_fixed['wheelchair_after'] =this.pattern_fixed != null &&  this.pattern_fixed['wheelchair_after'] != undefined ? this.pattern_fixed['wheelchair_after']['value'] : 1;
    this.pattern_fixed['windbag_1'] =this.pattern_fixed != null &&  this.pattern_fixed['windbag_1'] != undefined ? this.pattern_fixed['windbag_1']['value'] : 1;
    this.pattern_fixed['windbag_2'] =this.pattern_fixed != null &&  this.pattern_fixed['windbag_2'] != undefined ? this.pattern_fixed['windbag_2']['value'] : 1;
    this.pattern_fixed['windbag_3'] =this.pattern_fixed != null &&  this.pattern_fixed['windbag_3'] != undefined ? this.pattern_fixed['windbag_3']['value'] : 1;

    this.pattern_fixed['today_minus_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['today_minus_amount'] != undefined ? this.pattern_fixed['today_minus_amount']['value'] : 2;
    this.pattern_fixed['target_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['target_amount'] != undefined ? this.pattern_fixed['target_amount']['value'] : 2;
    this.pattern_fixed['supplementary_food'] =this.pattern_fixed != null &&  this.pattern_fixed['supplementary_food'] != undefined ? this.pattern_fixed['supplementary_food']['value'] : 2;
    
    this.fixed_params = [];
    Object.keys(this.pattern_fixed).map(index=>{
      this.fixed_params.push(index);
    });
  }

  componentDidMount() {
    this.setChangeFlag(0);
    let patientInfo = this.context.reserved_patient;
    this.context.$updatePreserveDate(formatDateLine(patientInfo.schedule_date));
    var weight_before_raw =
      patientInfo !== undefined && patientInfo !== null && patientInfo.weight_before_raw != null && patientInfo.weight_before_raw > 0 
        ? this.convertDecimal(patientInfo.weight_before_raw, 2)
        : "";
    var weight_after_raw =
      patientInfo !== undefined && patientInfo !== null && patientInfo.weight_after_raw != null && patientInfo.weight_after_raw > 0 
        ? this.convertDecimal(patientInfo.weight_after_raw, 2)
        : "";
    var wheelchair_before =
      patientInfo !== undefined &&
      patientInfo !== null &&
      patientInfo.wheelchair_before != null &&
      patientInfo.wheelchair_before > 0
        ? this.convertDecimal(patientInfo.wheelchair_before, 2)
        : this.convertDecimal(0, 1);
    var wheelchair_after =
      patientInfo !== undefined &&
      patientInfo !== null &&
      patientInfo.wheelchair_after != null &&
      patientInfo.wheelchair_after > 0
        ? this.convertDecimal(patientInfo.wheelchair_after, 2)
        : this.convertDecimal(0, 1);
    if (weight_before_raw > 0 && weight_after_raw > 0) {
      this.today_minus_amount =
        weight_before_raw -
        wheelchair_before -
        (weight_after_raw - wheelchair_after);
      this.today_minus_amount = parseFloat(this.today_minus_amount).toFixed(2);
      this.temp = this.today_minus_amount;
    }
    // 目標体重が未設定の場合は、DWと同じ値を仮の目標体重として目標体重欄に反映する。
    let target_weight =
      patientInfo !== undefined && patientInfo !== null ? patientInfo.dw : "";
    if (
      patientInfo !== undefined &&
      patientInfo !== null &&
      patientInfo.target_weight != undefined &&
      patientInfo.target_weight != null &&
      patientInfo.target_weight != "" &&
      parseFloat(patientInfo.target_weight) != 0
    ) {
      target_weight = this.convertDecimal(patientInfo.target_weight, 2);
    }
    //除水量設定 = 前体重 - 目標体重
    let target_amount = "";
    let wheelchair_today =
      patientInfo !== undefined && patientInfo !== null
        ? patientInfo.wheelchair_today
        : 0;
    target_amount =
      wheelchair_today == 1
        ? weight_before_raw - target_weight
        : weight_before_raw - wheelchair_before - target_weight;
    target_amount = parseFloat(target_amount).toFixed(2);
    if (
      patientInfo !== undefined &&
      patientInfo !== null &&
      patientInfo.supplementary_food != ""
    ) {
      target_amount =
        parseFloat(target_amount) + parseFloat(patientInfo.supplementary_food);
      target_amount = parseFloat(target_amount).toFixed(2);
    }
    if (
      patientInfo !== undefined &&
      patientInfo !== null &&
      patientInfo.fluid != ""
    ) {
      target_amount += patientInfo.fluid;
      target_amount = parseFloat(target_amount) + parseFloat(patientInfo.fluid);
      target_amount = parseFloat(target_amount).toFixed(2);
    }
    this.setState({
      id:
        patientInfo !== undefined && patientInfo !== null ? patientInfo.id : "",
      list_id:
        patientInfo !== undefined && patientInfo !== null
          ? patientInfo.list_id
          : "",
      system_patient_id:
        patientInfo !== undefined && patientInfo !== null
          ? patientInfo.system_patient_id
          : 0,
      name:
        patientInfo !== undefined && patientInfo !== null
          ? patientInfo.name
          : "",
      weight_before_raw,
      weight_after_raw,
      dw:
        patientInfo !== undefined && patientInfo !== null ? patientInfo.dw : "",
      target_weight,
      windbag_1:
        patientInfo !== undefined && patientInfo !== null
          ? this.convertDecimal(patientInfo.windbag_1, 2)
          : "",
      windbag_2:
        patientInfo !== undefined && patientInfo !== null
          ? this.convertDecimal(patientInfo.windbag_2, 2)
          : "",
      windbag_3:
        patientInfo !== undefined && patientInfo !== null
          ? this.convertDecimal(patientInfo.windbag_3, 2)
          : "",
      wheelchair_before,
      wheelchair_after,
      supplementary_food:
        patientInfo !== undefined && patientInfo !== null
          ? this.convertDecimal(patientInfo.supplementary_food, 2)
          : "",
      fluid:
        patientInfo !== undefined && patientInfo !== null
          ? this.convertDecimal(patientInfo.fluid, 2)
          : "",
      // target_amount: patientInfo !== undefined && patientInfo !== null ? patientInfo.target_drainage: 0,
      target_amount: weight_before_raw > 0 ? target_amount : "",
      real_amount:
        patientInfo !== undefined && patientInfo !== null
          ? this.convertDecimal(patientInfo.max_drainage_amount, 2)
          : "",
      wheelchair_today:
        patientInfo !== undefined && patientInfo !== null
          ? patientInfo.wheelchair_today
          : 0,
      patientInfo,
    }, ()=>{
      this.setDisplayParm();
      this.getTargetDrainge();
      this.getIncreaeAmount();
      if (patientInfo.selectedWeightType === "before_weight") {
        let amount_obj = document.getElementById("weight_before_raw_id");
        if(amount_obj !== undefined && amount_obj != null){
          amount_obj.focus()
          moveCaretPosition("weight_before_raw_id");
        }
      } else if (patientInfo.selectedWeightType === "after_weight") {
        let amount_obj = document.getElementById("weight_after_raw_id");
        if(amount_obj !== undefined && amount_obj != null){
          amount_obj.focus()
          moveCaretPosition("weight_after_raw_id");
        }
      } else if (patientInfo.selectedWeightType === "weight_clothes_1") {
        let amount_obj = document.getElementById("clothesWeight1_id");
        if(amount_obj !== undefined && amount_obj != null){
          amount_obj.focus()
          moveCaretPosition("clothesWeight1_id");
        }
      } else if (patientInfo.selectedWeightType === "weight_clothes_2") {
        let amount_obj = document.getElementById("clothesWeight2_id");
        if(amount_obj !== undefined && amount_obj != null){
          amount_obj.focus()
          moveCaretPosition("clothesWeight2_id");
        }
      } else if (patientInfo.selectedWeightType === "weight_clothes_3") {
        let amount_obj = document.getElementById("clothesWeight3_id");
        if(amount_obj !== undefined && amount_obj != null){
          amount_obj.focus()
          moveCaretPosition("weight_clothes_3");
        }
      }
    });
  }
  setDisplayParm = () => {
    this.fixed_params.map(item=>{
      let display_param = item + "_display";
      this.setState({
        [display_param]: this.state[item] != null && this.state[item] != "" && !isNaN(this.state[item]) ? parseFloat(this.state[item]).toFixed(this.pattern_fixed[item]): ''
      });
    })
  };
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');
  }
  
  getDw = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ dw: toHalfWidthOnlyNumber(e.target.value), dw_display:toHalfWidthOnlyNumber(e.target.value)});
  };
  getPrevWeight = (e) => {   
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    if (e.target.value == "" || e.target.value == null) {
      this.setState({
        weight_before_raw: "",
        weight_before_raw_display: "",
        increase_amount: "",
      });
      return;
    } else {
      this.setState({ weight_before_raw: toHalfWidthOnlyNumber(e.target.value), weight_before_raw_display: toHalfWidthOnlyNumber(e.target.value) }, () => {
        this.getIncreaeAmount();
        this.getTargetDrainge();
        
      });
    }
  };
  getIncreaeAmount = () => {
    // 前回からの増加量は、結果画面と同様に、車椅子・風袋①～③引いた「実際の前体重」をもとに計算する
    let increase_amount = '';
    if (this.state.patientInfo.last_weight_after != null && this.state.patientInfo.last_weight_after != "" && this.state.weight_before_raw != "") {
      let wheelchair_before = !isNaN(this.state.wheelchair_before) && this.state.wheelchair_before != "" ? parseFloat(this.state.wheelchair_before) : 0;
      if (this.state.wheelchair_today == 1) wheelchair_before = 0;
      let windbag_1 = this.state.windbag_1 != undefined && this.state.windbag_1 != null && this.state.windbag_1 != "" ? parseFloat(this.state.windbag_1) : 0;
      let windbag_2 = this.state.windbag_2 != undefined && this.state.windbag_2 != null && this.state.windbag_2 != "" ? parseFloat(this.state.windbag_2) : 0;
      let windbag_3 = this.state.windbag_3 != undefined && this.state.windbag_3 != null && this.state.windbag_3 != "" ? parseFloat(this.state.windbag_3) : 0;
      let real_weight_before = this.state.weight_before_raw - wheelchair_before - windbag_1 - windbag_2 - windbag_3;
      increase_amount = parseFloat(real_weight_before - this.state.patientInfo.last_weight_after).toFixed(2);
    }
    this.setState({increase_amount, increase_amount_display:this.convertDecimal(increase_amount, this.pattern_fixed['increase_amount'])});
  }
  getNextWeight = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ weight_after_raw:toHalfWidthOnlyNumber(e.target.value), weight_after_raw_display:toHalfWidthOnlyNumber(e.target.value)});
  };
  getClothesWeight1 = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ windbag_1: toHalfWidthOnlyNumber(e.target.value), windbag_1_display:toHalfWidthOnlyNumber(e.target.value) }, ()=>{
      this.getTargetDrainge();
      this.getIncreaeAmount();
    });
  };
  getClothesWeight2 = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ windbag_2: toHalfWidthOnlyNumber(e.target.value), windbag_2_display:toHalfWidthOnlyNumber(e.target.value) }, ()=>{
      this.getTargetDrainge();
      this.getIncreaeAmount();
    });
  };
  getClothesWeight3 = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ windbag_3: toHalfWidthOnlyNumber(e.target.value),windbag_3_display:toHalfWidthOnlyNumber(e.target.value) }, ()=>{
      this.getTargetDrainge();
      this.getIncreaeAmount();
    });
  };
  getBeforeChair = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ wheelchair_before: toHalfWidthOnlyNumber(e.target.value), wheelchair_before_display: toHalfWidthOnlyNumber(e.target.value) }, () => {
        this.getTargetDrainge();
        this.getIncreaeAmount();
    });
  };
  getAfterChair = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ wheelchair_after: toHalfWidthOnlyNumber(e.target.value), wheelchair_after_display: toHalfWidthOnlyNumber(e.target.value)});
  };
  getSupplement = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ supplementary_food: toHalfWidthOnlyNumber(e.target.value), supplementary_food_display:toHalfWidthOnlyNumber(e.target.value) }, ()=>{
      this.getTargetDrainge();
    });
  };
  getTargetDrainge = () => {
    if (this.state.weight_before_raw == null || this.state.weight_before_raw == "") return;
    // 体重手入力画面で、目標体重が空欄・0の時は、除水量設定を計算しないように 2020-08-10
    if (this.state.target_weight == undefined || this.state.target_weight == null || this.state.target_weight == "") {
      this.setState({target_amount: '', target_amount_display: ''});
      return;
    }
    // 前体重 - 車椅子 - 風袋① - 風袋③ - 風袋③ = 実際の前体重  2020-08-10
    let wheelchair_before = this.state.wheelchair_before != "" ? parseFloat(this.state.wheelchair_before) : 0;
    if (this.state.wheelchair_today == 1) wheelchair_before = 0;
    let windbag_1 = this.state.windbag_1 != undefined && this.state.windbag_1 != null && this.state.windbag_1 != "" ? parseFloat(this.state.windbag_1) : 0;
    let windbag_2 = this.state.windbag_2 != undefined && this.state.windbag_2 != null && this.state.windbag_2 != "" ? parseFloat(this.state.windbag_2) : 0;
    let windbag_3 = this.state.windbag_3 != undefined && this.state.windbag_3 != null && this.state.windbag_3 != "" ? parseFloat(this.state.windbag_3) : 0;
    let real_weight_before = this.state.weight_before_raw - wheelchair_before - windbag_1 - windbag_2 - windbag_3;
    //実際の前体重+補食+補液 - 目標体重 = 除水量設定  2020-08-10
    real_weight_before = parseFloat(real_weight_before);
    let target_weight = this.state.target_weight != undefined && this.state.target_weight != null && this.state.target_weight != "" ? parseFloat(this.state.target_weight) : 0;
    let target_amount = real_weight_before - target_weight;
    target_amount = isNaN(target_amount) ? "" : parseFloat(target_amount).toFixed(2);
    this.setState({target_amount, target_amount_display: this.convertDecimal(target_amount, this.pattern_fixed['target_amount'])});
  };
  getTargetWeightCalculate = () => {
    if (this.state.weight_before_raw == null || this.state.weight_before_raw == "") return;
    if (this.state.target_amount == undefined || this.state.target_amount == null || this.state.target_amount == "") {
      this.setState({target_weight: '', target_weight_display: ''});
      return;
    }
    // 前体重 - 車椅子 - 風袋① - 風袋③ - 風袋③ = 実際の前体重  2020-08-10
    let wheelchair_before = this.state.wheelchair_before != "" ? parseFloat(this.state.wheelchair_before) : 0;
    if (this.state.wheelchair_today == 1) wheelchair_before = 0;
    let windbag_1 = this.state.windbag_1 != undefined && this.state.windbag_1 != null && this.state.windbag_1 != "" ? parseFloat(this.state.windbag_1) : 0;
    let windbag_2 = this.state.windbag_2 != undefined && this.state.windbag_2 != null && this.state.windbag_2 != "" ? parseFloat(this.state.windbag_2) : 0;
    let windbag_3 = this.state.windbag_3 != undefined && this.state.windbag_3 != null && this.state.windbag_3 != "" ? parseFloat(this.state.windbag_3) : 0;
    let real_weight_before = this.state.weight_before_raw - wheelchair_before - windbag_1 - windbag_2 - windbag_3;
    //実際の前体重+補食+補液 - 目標体重 = 除水量設定  2020-08-10
    real_weight_before = parseFloat(real_weight_before);
    let target_amount = this.state.target_amount != undefined && this.state.target_amount != null && this.state.target_amount != "" ? parseFloat(this.state.target_amount) : 0;
    let target_weight = real_weight_before - target_amount;
    target_weight = parseFloat(target_weight).toFixed(2);
    this.setState({target_weight, target_weight_display: this.convertDecimal(target_weight, this.pattern_fixed['target_weight'])});
  };
  getLiquid = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ fluid: toHalfWidthOnlyNumber(e.target.value), fluid_display: toHalfWidthOnlyNumber(e.target.value) }, ()=>{
      this.getTargetDrainge();
    });
  };
  getTargetAmount = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ target_amount: toHalfWidthOnlyNumber(e.target.value), target_amount_display: toHalfWidthOnlyNumber(e.target.value) }, () => {
      // 前体重が確定できる状態（体重計測結果に、計算後の前体重がある状態と同じ状態）で、「除水量設定」か「本日目標体重」を変更したら、反対側を再計算する。
      this.getTargetWeightCalculate();
    });
  };
  getTargetWeight = (e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.setChangeFlag(1);
    this.setState({ target_weight: toHalfWidthOnlyNumber(e.target.value), target_weight_display: toHalfWidthOnlyNumber(e.target.value) }, () => {
      // 前体重が確定できる状態（体重計測結果に、計算後の前体重がある状態と同じ状態）で、「除水量設定」か「本日目標体重」を変更したら、反対側を再計算する。
      this.getTargetDrainge();
    });
  };
  saveInfo = () => {
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
        this.setState({alert_message:error_str_array.join('\n')});
        return;
    }
    this.setState({
      isRegistConfirmModal: true,
      confirm_message: "登録しますか？"
    });    
  };

  getWindbagValue = (val1, val2) => {
    if (val2 != null && val2 != undefined && parseFloat(val2) > 0) {
      return val1 - parseFloat(val2);
    }
    return val1;
  };

  async registerWeight(info) {
    let exist_change = 0;
    let context_state = this.context.reserved_patient;
    if (context_state.weight_before_raw != this.state.weight_before_raw)
      exist_change = 1;
    context_state.weight_before_raw = this.state.weight_before_raw;
    if (context_state.weight_after_raw != this.state.weight_after_raw)
      exist_change = 1;
    context_state.weight_after_raw = this.state.weight_after_raw;
    if (context_state.dw != this.state.dw) exist_change = 1;
    context_state.dw = this.state.dw;
    if (context_state.windbag_1 != this.state.windbag_1) exist_change = 1;
    context_state.windbag_1 = this.state.windbag_1;
    if (context_state.windbag_2 != this.state.windbag_2) exist_change = 1;
    context_state.windbag_2 = this.state.windbag_2;
    if (context_state.windbag_3 != this.state.windbag_3) exist_change = 1;
    context_state.windbag_3 = this.state.windbag_3;
    if (context_state.wheelchair_before != this.state.wheelchair_before)
      exist_change = 1;
    context_state.wheelchair_before = this.state.wheelchair_before;
    if (context_state.wheelchair_after != this.state.wheelchair_after)
      exist_change = 1;
    context_state.wheelchair_after = this.state.wheelchair_after;
    if (context_state.supplementary_food != this.state.supplementary_food)
      exist_change = 1;
    context_state.supplementary_food = this.state.supplementary_food;
    if (context_state.target_weight != this.state.target_weight)
      exist_change = 1;
    context_state.target_weight = this.state.target_weight;
    if (context_state.fluid != this.state.fluid) exist_change = 1;
    context_state.fluid = this.state.fluid;
    context_state.target_drainage = this.state.target_amount;
    // if (context_state.max_drainage_amount != this.state.real_mount) exist_change = 1;
    context_state.max_drainage_amount = this.state.real_mount;
    if (context_state.wheelchair_today != this.state.wheelchair_today)
      exist_change = 1;
    context_state.wheelchair_today = this.state.wheelchair_today;
    context_state.no_calc_weight = 1;
    if (exist_change == 0) {
      // no changed data
      this.cancel();
      return;
    }

    let path = "/app/api/v2/dial/patient/registerWeight";
    await axios
      .post(path, {
        params: info,
      })
      .then(() => {
        if (
          this.state.weight_before_raw != null &&
          this.state.weight_before_raw != undefined &&
          parseFloat(this.state.weight_before_raw) > 0
        ) {
          if (this.state.wheelchair_today == 1) {
            // 本日車椅子無し
            context_state.before_weight = parseFloat(
              this.state.weight_before_raw
            );
            context_state.before_weight = this.getWindbagValue(
              context_state.before_weight,
              this.state.windbag_1
            );
            context_state.before_weight = this.getWindbagValue(
              context_state.before_weight,
              this.state.windbag_2
            );
            context_state.before_weight = this.getWindbagValue(
              context_state.before_weight,
              this.state.windbag_3
            );
            context_state.before_weight = context_state.before_weight.toFixed(
              2
            );
          } else {
            if (parseFloat(this.state.wheelchair_before) > 0) {
              context_state.before_weight =
                parseFloat(this.state.weight_before_raw) -
                parseFloat(this.state.wheelchair_before);
              context_state.before_weight = this.getWindbagValue(
                context_state.before_weight,
                this.state.windbag_1
              );
              context_state.before_weight = this.getWindbagValue(
                context_state.before_weight,
                this.state.windbag_2
              );
              context_state.before_weight = this.getWindbagValue(
                context_state.before_weight,
                this.state.windbag_3
              );
              context_state.before_weight = context_state.before_weight.toFixed(
                2
              );
            } else {
              if (context_state.wheel_chair == 1) {
                context_state.before_weight = null;
              } else {
                context_state.before_weight = parseFloat(
                  this.state.weight_before_raw
                );
                context_state.before_weight = this.getWindbagValue(
                  context_state.before_weight,
                  this.state.windbag_1
                );
                context_state.before_weight = this.getWindbagValue(
                  context_state.before_weight,
                  this.state.windbag_2
                );
                context_state.before_weight = this.getWindbagValue(
                  context_state.before_weight,
                  this.state.windbag_3
                );
                context_state.before_weight = context_state.before_weight.toFixed(
                  2
                );
              }
            }
          }
        }
        if (this.state.weight_before_raw == '') {
          context_state.before_weight = null;
        }
        if (
          this.state.weight_after_raw != null &&
          this.state.weight_after_raw != undefined &&
          parseFloat(this.state.weight_after_raw) > 0
        ) {
          if (this.state.wheelchair_today == 1) {
            // 本日車椅子無し
            context_state.after_weight = parseFloat(
              this.state.weight_after_raw
            );
            context_state.after_weight = this.getWindbagValue(
              context_state.after_weight,
              this.state.windbag_1
            );
            context_state.after_weight = this.getWindbagValue(
              context_state.after_weight,
              this.state.windbag_2
            );
            context_state.after_weight = this.getWindbagValue(
              context_state.after_weight,
              this.state.windbag_3
            );
            context_state.after_weight = context_state.after_weight.toFixed(2);
          } else {
            if (parseFloat(this.state.wheelchair_after) > 0) {
              context_state.after_weight =
                parseFloat(this.state.weight_after_raw) -
                parseFloat(this.state.wheelchair_after);
              context_state.after_weight = this.getWindbagValue(
                context_state.after_weight,
                this.state.windbag_1
              );
              context_state.after_weight = this.getWindbagValue(
                context_state.after_weight,
                this.state.windbag_2
              );
              context_state.after_weight = this.getWindbagValue(
                context_state.after_weight,
                this.state.windbag_3
              );
              context_state.after_weight = context_state.after_weight.toFixed(
                2
              );
            } else {
              if (context_state.wheel_chair == 1) {
                context_state.after_weight = null;
              } else {
                context_state.after_weight = parseFloat(
                  this.state.weight_after_raw
                );
                context_state.after_weight = this.getWindbagValue(
                  context_state.after_weight,
                  this.state.windbag_1
                );
                context_state.after_weight = this.getWindbagValue(
                  context_state.after_weight,
                  this.state.windbag_2
                );
                context_state.after_weight = this.getWindbagValue(
                  context_state.after_weight,
                  this.state.windbag_3
                );
                context_state.after_weight = context_state.after_weight.toFixed(
                  2
                );
              }
            }
          }
        }
        if (this.state.weight_after_raw == '') {
          context_state.after_weight = null;
        }
        if (
          this.state.target_weight != null &&
          this.state.target_weight != undefined &&
          this.state.target_weight != ""
        ) {
          context_state.target_weight = this.state.target_weight;
        }
        this.context.$updateReservedPatient(context_state);
        this.props.history.replace("/dial/weight/calculate");
      })
      .catch(() => {
        // window.sessionStorage.setItem("alert_messages", "通信に失敗しました。");
      });
  }

  cancel = () => {
    let nFlag = sessApi.getObjectValue('dial_change_flag', 'wheel_chair');
    if (nFlag == 1) {      
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。変更内容を破棄して閉じますか？', 
      })
    } else {
      this.confirmCloseOk();      
    }
    // this.props.closeModal();    
  };

  confirmCloseOk = () => {
    this.setState({
      isCloseConfirmModal: false,
      confirm_message: ""
    },()=>{
      let context_state = this.context.reserved_patient;
      context_state.no_calc_weight = 1;
      this.props.history.replace("/dial/weight/calculate");
    });
  }

  getWheelchairToday = async (name, value) => {
    this.setChangeFlag(1);
    if (name === "wheelchair_today")
      if (value == 1) {
        this.setState({
          wheelchair_today: value,
          wheelchair_before: "",
          wheelchair_after: "",
        }, () => {
          this.getTargetDrainge();
          this.getIncreaeAmount();
        });
      } else {
        this.setState({
          wheelchair_today: value,
        }, ()=>{
          this.getTargetDrainge();
          this.getIncreaeAmount();
        });
      }
  };

  confirmCancel = () => {
    this.setState({
      isRegistConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: ""
    });
  }

  confirmOk = () => {
    this.setState({
      isRegistConfirmModal: false,
      confirm_message: "",
    },()=>{
      this.registerWeight(this.state);
    });
  }

  setChangeFlag=(change_flag)=>{
        this.change_flag = change_flag;
        this.setState({change_flag});
        if (change_flag){
            sessApi.setObjectValue('dial_change_flag', 'wheel_chair', 1)
        } else {
            sessApi.remove('dial_change_flag');
        }
    };

  clearRedBorder = () => {
    removeRedBorder('weight_before_raw_id');
    removeRedBorder('weight_after_raw_id');
    removeRedBorder('dw_id');    
    removeRedBorder('target_weight_id');
    removeRedBorder('wheelchair_before_id');
    removeRedBorder('wheelchair_after_id');
    removeRedBorder('clothesWeight1_id');
    removeRedBorder('supplement_id');
    removeRedBorder('clothesWeight2_id');
    removeRedBorder('liquid_id');
    removeRedBorder('clothesWeight3_id');
    removeRedBorder('target_amount_id');
    removeRedBorder('final_week_days_id');
  }

  checkValidation = () => {
    this.clearRedBorder();
    this.fixed_params.map(item=>{
      this.setState({
        [item]: this.convertDecimal(this.state[item], 2)
      });
    });
    let error_str_arr = [];
    let validate_data = scheduleValidate('dial_input_weight', this.state);  
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != '') {
      this.setState({first_tag_id: validate_data.first_tag_id});
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

  convertDecimal = (_val, _digits) => {
    if (isNaN(parseFloat(_val))) return "";
    return parseFloat(_val).toFixed(_digits);
  }

  getBlurValue = (key) => {
    let state_key = key + "_display";
    this.setState({
      [state_key]:this.state[state_key] != null && this.state[state_key] != '' && !isNaN(this.state[state_key]) ? parseFloat(this.state[state_key]).toFixed(this.pattern_fixed[key]): ""
    });
  }

  render() {
    return (
      <>
        <DialSideBar
          schedule_date={
            this.context.reserved_patient.schedule_date
              ? formatDateLine(this.context.reserved_patient.schedule_date)
              : ""
          }          
        />
        <Card>
          <div className="title">体重データ手入力</div>
          <div className="card-body">
            <Wrapper>
              <div className="flex cur_date">
                <div className="treat-date-area">
                  <label>測定日</label>
                </div>
                <div className="up-area">{this.state.weightDay}</div>
              </div>
              <div className="patient_info flex">
                <div className="patient_number">ID：{pad(this.state.id, 5)}</div>
                <div className="patient_name flex"><div style={{fontSize:"1.5rem",fontWeight:"normal"}}>患者名：</div><div>{this.state.name}</div></div>
                <div className="unit">様</div>
              </div>
              <div className="weight-area flex">
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="weight_before_raw_id"                      
                      label="前体重"
                      type="text"                  
                      getInputText={this.getPrevWeight.bind(this)}
                      onBlur={this.getBlurValue.bind(this, "weight_before_raw")}
                      diseaseEditData={this.state.weight_before_raw_display}
                      tabIndex={1}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
                <div className="flex">
                <div className="new-input-style hankaku-eng-num-input">                  
                  <InputWithLabelBorder
                      id="weight_after_raw_id"
                      label="後体重"
                      type="text"                  
                      getInputText={this.getNextWeight.bind(this)}
                      onBlur={this.getBlurValue.bind(this, "weight_after_raw")}
                      diseaseEditData={this.state.weight_after_raw_display}
                      tabIndex={6}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
              </div>
              <div className="weight-area flex">
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="dw_id"
                      label="DW"
                      type="text"       
                      onBlur={()=>this.getBlurValue("dw")}             
                      getInputText={this.getDw.bind(this)}                      
                      diseaseEditData={this.state.dw_display}
                      readonly
                      isDisabled={true}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="target_weight_id"
                      label="本日目標体重"
                      type="text"
                      onBlur={()=>this.getBlurValue("target_weight")} 
                      getInputText={this.getTargetWeight.bind(this)}                      
                      diseaseEditData={this.state.target_weight_display}
                      isDisabled={true}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
              </div>
              <div className="weight-area flex">
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">                    
                    <InputWithLabel
                      label="前回からの増加量"
                      type="text"                      
                      isDisabled={true}
                      diseaseEditData={this.convertDecimal(this.state.increase_amount, this.pattern_fixed['increase_amount'])}                      
                      readonly
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">                    
                    <InputWithLabel
                      label="本日の減少量"
                      type="text"
                      isDisabled={true}     
                      onBlur={()=>this.getBlurValue("today_minus_amount")}                 
                      diseaseEditData={this.today_minus_amount != "" && !isNaN(this.today_minus_amount) ? parseFloat(this.today_minus_amount).toFixed(this.pattern_fixed['today_minus_amount']) : ""}                      
                      readonly
                    />
                  </div>
                  <div className="padding">L</div>
                </div>
              </div>
              <div className="weight-area flex">
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="wheelchair_before_id"
                      label="車椅子(前)"
                      type="text"
                      getInputText={this.getBeforeChair.bind(this)}
                      onBlur={this.getBlurValue.bind(this, "wheelchair_before")}
                      diseaseEditData={this.state.wheelchair_before_display}
                      isDisabled={this.state.wheelchair_today ? true : false}
                      tabIndex={2}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="wheelchair_after_id"
                      label="車椅子(後)"
                      type="text"
                      getInputText={this.getAfterChair.bind(this)}
                      onBlur={this.getBlurValue.bind(this, "wheelchair_after")}
                      diseaseEditData={this.state.wheelchair_after_display}
                      isDisabled={this.state.wheelchair_today ? true : false}
                      tabIndex={7}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
              </div>
              <div className="weight-area flex chair">
                <div className="flex"></div>
                <div className="flex"></div>
              </div>
              <div className="weight-area flex">
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="clothesWeight1_id"
                      label="風袋①"
                      type="text"
                      onBlur={()=>this.getBlurValue("windbag_1")}
                      getInputText={this.getClothesWeight1.bind(this)}                      
                      diseaseEditData={this.state.windbag_1_display}
                      tabIndex={3}
                    />                    
                  </div>
                  <div className="padding">㎏</div>
                </div>
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="liquid_id"
                      label="補液"
                      type="text"
                      onBlur={()=>this.getBlurValue("fluid")}
                      getInputText={this.getLiquid.bind(this)}
                      diseaseEditData={this.state.fluid_display}
                      isDisabled={true}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
              </div>
              <div className="weight-area flex">
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="clothesWeight2_id"
                      label="風袋②"
                      type="text"
                      onBlur={()=>this.getBlurValue("windbag_2")}
                      getInputText={this.getClothesWeight2.bind(this)}                      
                      diseaseEditData={this.state.windbag_2_display}
                      tabIndex={4}
                    />                    
                  </div>
                  <div className="padding">㎏</div>
                </div>
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="supplement_id"
                      label="補食"
                      type="text"
                      onBlur={()=>this.getBlurValue("supplementary_food")}
                      getInputText={this.getSupplement.bind(this)}
                      diseaseEditData={this.state.supplementary_food_display}
                      isDisabled={true}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
              </div>
              <div className="weight-area flex">
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="clothesWeight3_id"
                      label="風袋③"
                      type="text"
                      onBlur={()=>this.getBlurValue("windbag_3")}
                      getInputText={this.getClothesWeight3.bind(this)}                      
                      diseaseEditData={this.state.windbag_3_display}
                      tabIndex={5}
                    />
                  </div>
                  <div className="padding">㎏</div>
                </div>
                <div className="flex">
                  <div className="new-input-style hankaku-eng-num-input">
                    <InputWithLabelBorder
                      id="target_amount_id"
                      label="目標除水量"
                      type="text"
                      onBlur={()=>this.getBlurValue("target_amount")}
                      getInputText={this.getTargetAmount.bind(this)}                      
                      diseaseEditData={this.state.target_amount_display}
                      isDisabled={true}
                    />
                  </div>
                  <div className="padding">L</div>
                </div>
              </div>
              <div className="weight-area flex">
                <div className="flex">
                  <div className="wheelchair-today">
                    <Checkbox
                      label="本日車椅子無し"
                      getRadio={this.getWheelchairToday.bind(this)}
                      value={this.state.wheelchair_today}
                      name="wheelchair_today"
                    />
                  </div>
                </div>
              </div>
              <div className="footer-buttons mt-5">
                  <Button className="cancel-btn" onClick={this.cancel}>キャンセル</Button>
                  <Button className="red-btn" onClick={this.saveInfo}>登録</Button>
              </div>
            </Wrapper>
          </div>
          {this.state.isRegistConfirmModal !== false &&  (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk}
                  confirmTitle= {this.state.confirm_message}
              />
          )}
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.isCloseConfirmModal !== false &&  (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmCloseOk}
                  confirmTitle= {this.state.confirm_message}
              />
          )}
        </Card>
      </>
    );
  }
}
InputWeight.contextType = Context;

InputWeight.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string,  
};
export default InputWeight;