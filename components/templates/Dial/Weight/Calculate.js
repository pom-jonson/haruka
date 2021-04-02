import React, { Component } from "react";
import styled from "styled-components";
import DialSideBar from "../DialSideBar1";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {pad} from "~/helpers/dialConstants"
import axios from "axios";
import BodyWeightResultModal from "./BodyWeightResultModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import {formatDateLine, formatJapanDate} from "~/helpers/date";
import { TIMEZONE, CACHE_SESSIONNAMES} from "~/helpers/constants";
import { formatJapanDateNoYear} from "~/helpers/date";
import Button from "~/components/atoms/Button";
import { KEY_CODES } from "~/helpers/constants";
import InputWeight from "./InputWeight";
import * as sessApi from "~/helpers/cacheSession-utils";
import $ from "jquery";

const Card = styled.div`
    position: fixed;
    top: 0px;
    width: calc(100% - 390px);
    overflow-y: auto;
    left: 200px;
    margin: 0px;
    height: 100vh;
    float: left;
    background-size: cover;
    padding: 1.25rem;
    background-color: white;
    .card-body {
        padding: 0;
        display: flex;
        width: 100%;
        justify-content: center;
        margin: 0px;
    }
    .title {
        font-size: 2rem;
        padding-left: 0.5rem;
    }
    .hAoqul{
        width:100%;
        margin-left:0px;
    }
`;
const Wrapper = styled.div`
  width: 66rem;
  height: 100%;
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  float: left;
  .div-recount-buttons{

    margin-left: 2rem;
    button{
        background: rgb(221, 221, 221);
        border: 1px solid #aaa;
        margin-right: 0.625rem;
        span{
            color: #2c2b2b;
            font-size: 1.25rem;
        }
    }

  }
  .disable-select{
    display: inline-block;
    .pullbox-select{
      background: #ccc;
      pointer-events: none;
    }
  }
  .not-show{
    display: none !important;
  }

  .flex {
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
  }

  .flex-just-center{
    justify-content: center;
  }

  .div-count{
    display: flex;
    align-items: center;
    .wheelchair-exist{
        float: left;
        padding: 0.625rem;
    }
  }

  .count-buttons{
    width: 30%;
    button{
        padding: 1rem 0px;
        margin-left: 1rem;
        text-align: center;
        background: rgb(221, 221, 221);
        border-width: 1px;
        border-style: solid;
        border-color: rgb(170, 170, 170);
        span{
            font-size: 1rem;
            color: black;
        }
    }
  }

  .active_weight{
    border: 2px solid #0f42e8 !important;
  }
  .cur_date {
    margin-top: 1.25rem;
    width: 100%;
    label{
      width: 7rem !important;
    }
    .up-area {
      border: 1px solid rgb(141, 143, 144);
      width: calc(100% - 12.75rem);
      text-align: center;
      font-size: 1.8rem;
      height: 3.125rem;
      padding-top: 0.1rem;
    }
    .treat-date-area{
      label{
        width: 5rem !important;
        text-align: left;
        font-size: 1.25rem;        
        margin-top: 0.625rem;
        margin-right: 0.5rem;
        text-align: left;
      }
    }
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
  .tl {
      text-align: left;
  }
  .tr {
      text-align: right;
  }
  .tc {
      text-align: center;
  }

  .div-edit-wheelchair{
    input{
        width: 100%;
        padding: 0.5rem;
        text-align: right;
    }
  }

  .box-detail {
    height: 3rem;
    margin: 1%;
    width: 46%;
    border-width: 1px;
    border-style: solid;
    border-color: #8d8f90;
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    font-size: 1.25rem;
    letter-spacing: 0.1em;
    span {
        padding-right:1.875rem;
    }
  }
  .non-border{
    border: none;
  }
  .border-weight-prev {
    height: 6.25rem;
    margin: 1%;
    width: 46%;
    border-width: 2px;
    border-color: #8d8f90;
    border-style: solid;
    display: flex;
    flex-wrap: wrap;
    letter-spacing: 0.1em;
    p{
        font-size: 1rem;
    }
  }
  .border-weight-next {
    height: 6.25rem;
    margin: 1%;
    width: 46%;
    border-width: 2px;
    border-color: #8d8f90;
    border-style: solid;
    display: flex;
    flex-wrap: wrap;
    letter-spacing: 0.1em;
    p{
        font-size: 1rem;
    }
  }

  .h100{
    height: 6.25rem;
    .padding-15{
        padding: 1rem !important;
    }
  }

  .w50 {
    width: 50%;
  }
  .w60 {
    width: 60%;
  }
  .w40 {
    width: 40%;
  }
  .description {
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-size: 1.875rem;
  }
  .padding {
    padding: 0.625rem;
  }
  .w94 {
    width: 94%;
  }
  .top-label {
        font-size: 2.2rem;
        font-weight: bold;
        width: 50%;
        padding: 1rem;
  }
  .f50{
    font-size: 2rem !important;
    padding: 1rem !important;
  }

  .common_code{
    width: 46%;
    display: flex;
    justify-content: space-between;
    .pullbox{
        // width: auto !important;
        width: 23rem !important;
        height: 3rem;
        display: flex;
    }
    .wheelchair-exist{
        float: left;
        padding: 0.625rem;
    }
    .pullbox-label{
        width: calc(100% - 8rem);
        border: none;
        height: 3rem;
    }
    .pullbox-title{      
        padding-left: 0.625rem;  
        width: 8rem;
        font-size: 1.25rem;
        line-height: 3rem;
        color: #212529;
    }
    .pullbox-select{
        width: 100%;
        border:none;
        height: 2.85rem;
        font-size: 1.25rem;
        // padding-right:2rem;
        padding-top: 0.2rem;
        color: #212529;
    }
    .div-wheelchair{
        padding: 0.625rem;
        float: right;
    }
  }

  .reserve-btn{
    display: flex;
    justify-content: center;
    margin-top: 20px;
    button{
        background: rgb(105, 200, 225);
        border: none;
        span{
            color: white;
            font-size: 1.25rem;
        }
    }
    button:hover {
      background: rgb(38, 159, 191);
    }
  }
 `;

const WeightMenuUl = styled.ul`
  .weight-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
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
    width: 11.25rem;
  }
  .weight-menu li {
    font-size: 1rem;
    line-height: 1.875rem;
    clear: both;
    color: black;
    cursor: pointer;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    border-bottom: solid 1px #888;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .weight-menu li:hover {
    background-color: #3c3c87;
    color: white;
  }

 
`;

const WeightMenu = ({visible,x,y,parent,}) => {
  if (visible) {
    return (
      <WeightMenuUl>
        <ul className="weight-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() =>parent.menuAction("select_patient")}>測定者選択</div>
          </li>
          <li>
            <div onClick={() => parent.menuAction("windbag_discount")}>風袋差し引き</div>
          </li>
          <li>
            <div onClick={() => parent.menuAction("prev_next")}>前後切替</div>
          </li>
          <li>
            <div onClick={() => parent.menuAction("card_discharge")}>カード排出</div>
          </li>
          <li>
            <div onClick={() => parent.menuAction("card_cleaning")}>カードクリーニング</div>
          </li>
          <li>
            <div onClick={() => parent.menuAction("hand_input")}>データ手入力</div>
          </li>
        </ul>
      </WeightMenuUl>
    );
  } else { return null; }
};

class Calculate extends Component {
  static propTypes = {
    history: PropTypes.object,
    activeLink: PropTypes.string,
    gotoPage: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      weightMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      weightDay: formatJapanDate(new Date()),
      isOpenBodyWeightModal: false,
      isLoaded: false,
      confirm_message: "",
      weight: "",
      originWeight: "",
      wheelchairWeight: "",
      start:1,
      timerFlag:0,
      weight_before: 0,
      weight_before_raw: 0,
      weight_after: 0,
      weight_after_raw: 0,
      wheelchair_before: 0,
      wheelchair_after: 0,
      windbag_1: 0,
      windbag_2: 0,
      windbag_3: 0,
      typeUrl: "",
      selectedWeightType: "",
      target_drainage: 0,
      target_weight: 0,
      today_target_drainage: 0,
      list_array: [],
      curCommonCode: 0,
      count_wheelchair: 0,
      wheel_status: "",
      calcTypeOwn:"",
      edit_status: 0,
      patientInfo: [],
      timer: undefined,
      canTimeCount: true, // 60秒以上操作がなかった場合は予約患者一覧のページに自動で移動させてください。
      commonData:[{
        id: 0,
        value: "",
        weight: ""
      }]
      
    }
    this.countIndex = 0;
    this.openModalTime=null;
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onInputKeyPressed = this.onInputKeyPressed.bind(this);
    this._m_digits = 1;
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
    
  }
  
  componentDidMount () {
    
    this.setState({
      timer60: setInterval(() => {
        this.countDown();
      }, 1000),
    });
    this.countIndex = 0;
    document.addEventListener("keydown", () => {
      this.countIndex = 0;
    });
    
    document.addEventListener("mousemove", () => {
      this.countIndex = 0;
    });
    document.addEventListener("mousedown", () => {
      this.countIndex = 0;
    });
    
    
    let patientInfo = this.context.reserved_patient;
    this.context.$updatePreserveDate(formatDateLine(patientInfo.schedule_date));
    if (this.props.patientInfo != null && this.props.patientInfo != undefined) {
      patientInfo = this.props.patientInfo;
    }
    let target_weight = 0;
    if(patientInfo != null && patientInfo != undefined){
      if (patientInfo.target_weight != null && !isNaN(patientInfo.target_weight) && parseFloat(patientInfo.target_weight) > 0) {
        target_weight = parseFloat(patientInfo.target_weight);
      }else if (patientInfo.dw != null && patientInfo.dw != undefined && parseFloat(patientInfo.dw) > 0 ) {
        target_weight = parseFloat(patientInfo.dw);
      }
    }
    
    // DN176 車椅子プルダウンを有効にしているときの動作の実装
    if ((patientInfo.wheelchair_today != undefined && patientInfo.wheelchair_today != null && patientInfo.wheelchair_today == 1) || (patientInfo.wheel_chair != undefined && patientInfo.wheel_chair != null && patientInfo.wheel_chair == 0)) {
      $('.common_code select').attr('disabled', true);
    } else {
      $('.common_code select').attr('disabled', false);
    }
    this.setState({
      weight_before: parseFloat(patientInfo.before_weight) > 0 ? parseFloat(patientInfo.before_weight): 0,
      weight_before_raw: parseFloat(patientInfo.weight_before_raw) > 0 ? parseFloat(patientInfo.weight_before_raw): 0,
      weight_after: parseFloat(patientInfo.after_weight) > 0 ? parseFloat(patientInfo.after_weight): 0,
      weight_after_raw: parseFloat(patientInfo.weight_after_raw) > 0 ? parseFloat(patientInfo.weight_after_raw): 0,
      wheelchair_before: parseFloat(patientInfo.wheelchair_before) > 0 ? parseFloat(patientInfo.wheelchair_before): 0,
      wheelchair_after: parseFloat(patientInfo.wheelchair_after) > 0 ? parseFloat(patientInfo.wheelchair_after): 0,
      target_weight: target_weight,
      patientInfo: patientInfo
    });
    
    let strCalcTypeOwn = patientInfo.calcType;
    // status : 0 =>
    // status : 1 => 前体重入力完了
    // status : 2 => 透析開始
    // status : 3 => 透析完了
    // status : 4 => 後体重入力完了
    this.changeWeightType = this.changeWeightType.bind(this);
    let status = patientInfo.status;
    if (status == 0 || status == 1) {
      
      if (strCalcTypeOwn == "wheelchair_only") {
        strCalcTypeOwn = "count";
        this.setState({
          calcTypeOwn: strCalcTypeOwn,
          wheel_status: "count",
          windbag_1: patientInfo.windbag_1 != null && patientInfo.windbag_1 != undefined && parseFloat(patientInfo.windbag_1) > 0 ? parseFloat(patientInfo.windbag_1) : 0,
          windbag_2: patientInfo.windbag_2 != null && patientInfo.windbag_2 != undefined && parseFloat(patientInfo.windbag_2) > 0 ? parseFloat(patientInfo.windbag_2) : 0,
          windbag_3: patientInfo.windbag_3 != null && patientInfo.windbag_3 != undefined && parseFloat(patientInfo.windbag_3) > 0 ? parseFloat(patientInfo.windbag_3) : 0
        },() => {
          if(patientInfo.no_calc_weight == null || patientInfo.no_calc_weight == undefined){
            this.startGetBodyWeight();
          }
        });
      } else {
        if (strCalcTypeOwn == "wheelchair") {
          strCalcTypeOwn = "wheelchair_before";
        }
        this.setState({
          selectedWeightType:"before_weight",
          calcTypeOwn: strCalcTypeOwn,
          windbag_1: patientInfo.windbag_1 != null && patientInfo.windbag_1 != undefined && parseFloat(patientInfo.windbag_1) > 0 ? parseFloat(patientInfo.windbag_1) : 0,
          windbag_2: patientInfo.windbag_2 != null && patientInfo.windbag_2 != undefined && parseFloat(patientInfo.windbag_2) > 0 ? parseFloat(patientInfo.windbag_2) : 0,
          windbag_3: patientInfo.windbag_3 != null && patientInfo.windbag_3 != undefined && parseFloat(patientInfo.windbag_3) > 0 ? parseFloat(patientInfo.windbag_3) : 0
        },() => {
          if(patientInfo.no_calc_weight == null || patientInfo.no_calc_weight == undefined){
            this.startGetBodyWeight();
          }
        });
      }
    }
    if (status == 3 || status == 4) {
      if (strCalcTypeOwn == "wheelchair_only") {
        strCalcTypeOwn = "count";
        this.setState({
          calcTypeOwn: strCalcTypeOwn,
          wheel_status: "count",
        },() => {
          if(patientInfo.no_calc_weight == null || patientInfo.no_calc_weight == undefined){
            this.startGetBodyWeight();
          }
        });
      } else {
        if (strCalcTypeOwn == "wheelchair") {
          strCalcTypeOwn = "wheelchair_after";
          this.setState({
            selectedWeightType:"after_weight",
            calcTypeOwn: strCalcTypeOwn,
            wheel_status: "count",
            windbag_1: patientInfo.windbag_1 != null && patientInfo.windbag_1 != undefined && parseFloat(patientInfo.windbag_1) > 0 ? parseFloat(patientInfo.windbag_1) : 0,
            windbag_2: patientInfo.windbag_2 != null && patientInfo.windbag_2 != undefined && parseFloat(patientInfo.windbag_2) > 0 ? parseFloat(patientInfo.windbag_2) : 0,
            windbag_3: patientInfo.windbag_3 != null && patientInfo.windbag_3 != undefined && parseFloat(patientInfo.windbag_3) > 0 ? parseFloat(patientInfo.windbag_3) : 0
          },() => {
            if(patientInfo.no_calc_weight == null || patientInfo.no_calc_weight == undefined){
              this.startGetBodyWeight();
            }
          });
        } else {
          this.setState({
            selectedWeightType:"after_weight",
            calcTypeOwn: strCalcTypeOwn,
            wheel_status: "",
            windbag_1: patientInfo.windbag_1 != null && patientInfo.windbag_1 != undefined && parseFloat(patientInfo.windbag_1) > 0 ? parseFloat(patientInfo.windbag_1) : 0,
            windbag_2: patientInfo.windbag_2 != null && patientInfo.windbag_2 != undefined && parseFloat(patientInfo.windbag_2) > 0 ? parseFloat(patientInfo.windbag_2) : 0,
            windbag_3: patientInfo.windbag_3 != null && patientInfo.windbag_3 != undefined && parseFloat(patientInfo.windbag_3) > 0 ? parseFloat(patientInfo.windbag_3) : 0
          },() => {
            if(patientInfo.no_calc_weight == null || patientInfo.no_calc_weight == undefined){
              this.startGetBodyWeight();
            }
          });
        }
      }
    }
    
    this.getAllCategory();
  }
  
  countDown() {
    if (this.state.canTimeCount === true) {
      if (this.countIndex == 60) {
        this.props.history.replace("/dial/weight/patientList");
        this.countIndex = 0;
      }
      this.countIndex += 1;
    }
  }
  
  componentWillUnmount () {
    clearInterval(this.state.timer60);
    clearInterval(this.state.timer);
    document.removeEventListener("keydown",()=>{
    
    });
    document.removeEventListener("mousemove",()=>{
    
    });
    document.removeEventListener("mousedown",()=>{
    
    });
  }
  
  getCurrentWeightType = () => {
    
    // let status = this.props.patientInfo.status;
    let status = this.state.patientInfo.status;
    if (status == 0 || status == 1) {
      return "before_weight";
    }
    if (status == 3 || status == 4) {
      return "after_weight";
    }
  }
  
  getAllCategory = async () => {
    let path = "/app/api/v2/dial/master/get_common_by_wheelchair";
    let post_data = {
    };
    let { data } = await axios.post(path, {params: post_data});
    var temp = [...this.state.list_array, ...data];
    
    // DN176 車椅子プルダウンを有効にしているときの動作の実装
    let commonData = [{
      id: 0,
      value: "",
      weight: ""
    }];
    if (temp.length> 0) {
      temp.map(item=>{
        let name = item.name;        
        // if(name == "なし") name = "車椅子 なし";
        if (!(item.value == undefined || item.value == null || item.value == "" || isNaN(parseFloat(item.value)))) {
          let ele = {
            id: item.number,
            value: name
          }
          commonData.push(ele);
        }
      });
      
    }
    
    this.setState({
      list_array:temp,
      commonData
    });
  };
  
  startGetBodyWeight = () => {
    // let status = this.props.patientInfo.status;
    let status = this.state.patientInfo.status;
    if (status == 1 || status == 4) {
      this.setState({
        isLoaded: false,
        start: 1,
        timerFlag: 0,
        canTimeCount: false,
        confirm_message: "結果は上書きされますが、再度測定しますか？",
        // isOpenBodyWeightModal: true
      });
    } else if(status == 0 || status == 3) {
      if (this.state.calcTypeOwn == "wheelchair_after") {
        this.getBodyWeight("count");
      } else {
        if (this.state.calcTypeOwn == "count") {
          this.getBodyWeight("count");
        }else{
          this.getBodyWeight();
        }
      }
      this.setState({
        isLoaded: false,
        start: 1,
        timerFlag: 0,
        isOpenBodyWeightModal: true
      });
    }
  }
  
  getBodyWeight = async (type) => {
    let weightType = this.props.weightType;
    if (weightType == undefined || weightType == null || weightType == "") {
      weightType = this.state.selectedWeightType;
    }
    if (weightType == undefined || weightType == null || weightType == "") {
      weightType = this.getCurrentWeightType();
    }
    if (type == "count") {
      weightType = "count";
    }
    let postData = {
      patient_number: this.state.patientInfo.id,
      dial_schedule_number: this.state.patientInfo.schedule_number,
      measurement_target: this.state.patientInfo.status,
      is_start: this.state.start,
      system_patient_id: this.state.patientInfo.system_patient_id,
      weight_type: weightType,
    };
    if (type == "count") {
      postData.wheel_chair = "count";
    }
    const { data } = await axios.post(
      "/app/api/v2/dial/getBodyWeight",
      {
        params: postData
      }
    );
    if (data.weight !== null && data.weight !== undefined && data.weight !== "") {
      if (type != "count") {
        if (weightType == "before_weight") {
          this.setState({
            weight: data.weight,
            weight_before_raw: parseFloat(data.weight).toFixed(2),
            isLoaded: true,
            start: 0,
          });
        } else if(weightType == "after_weight") {
          this.setState({
            weight: data.weight,
            weight_after_raw: parseFloat(data.weight).toFixed(2),
            isLoaded: true,
            start: 0,
          });
        } else {
          this.setState({
            weight: data.weight,
            originWeight: data.weight, // 前体重(車椅子)
            isLoaded: true,
            start: 0,
          });
        }
      } else { // count
        let weightType = this.getCurrentWeightType();
        if (weightType == "after_weight") {
          this.setState({
            weight: data.weight,
            wheelchairWeight: data.weight,
            wheelchair_after: parseFloat(data.weight),
            isLoaded: true,
            start: 0,
          });
        }else if(weightType == "before_weight"){
          this.setState({
            weight: data.weight,
            wheelchairWeight: data.weight,
            wheelchair_before: parseFloat(data.weight),
            isLoaded: true,
            start: 0,
          });
        }
        this.setState({
          weight: data.weight,
          wheelchairWeight: data.weight,
          isLoaded: true,
          start: 0,
        });
      }
      clearInterval(this.state.timer);
    } else {
      if (this.state.timerFlag == 0) {
        this.setState({
          isLoaded: false,
          start: 0,
          timerFlag: 1,
          timer:setInterval(() => {
            this.getBodyWeight(type);
          }, 3000)
        });
      } else {
        this.setState({
          isLoaded: false,
          start: 0,
          timerFlag: 1
          
        });
      }
    }
  }
  
  showMenu = (e) => {
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    this.setState({
      weightMenu: {
        visible: true,
        x: 37,
        y: 70
      },
    });
    document.addEventListener(`click`, function onClickOutside() {
      
      that.setState({ weightMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
  };
  
  menuAction = act => {
    if (act === "select_patient") {
      this.props.history.replace("/dial/weight/patientList");
    }
    if (act === "windbag_discount") {
      // this.props.history.replace("/dial/weight/calculateminusclothes");
    }
    if (act === "prev_next") {
      // this.props.history.replace("/dial/weight/patientList");
    }
    if (act === "card_discharge") {
      // this.props.history.replace("/dial/weight/patientList");
    }
    if (act === "card_cleaning") {
      // this.props.history.replace("/dial/weight/patientList");
    }
    if (act === "hand_input") {
      this.props.history.replace("/dial/weight/inputweight");
    }
  };
  
  closeModal = () => {
    this.initState();
  }
  
  confirmCancel() {
    this.initState();
  }
  
  confirmOk() {
    this.setState({
      isOpenBodyWeightModal: true,
      confirm_message: "",
      canTimeCount: false,
    });
    if (this.state.calcTypeOwn == "count") {
      this.getBodyWeight("count");
    } else {
      this.getBodyWeight();
    }
  }
  
  handleOk = async (weight, type, process_status) => {
    // status < 終了済 : type = before_weight
    if (type == "after_weight" && this.state.patientInfo.status < 3) {
      type = "before_weight";
    }
    let postData = {
      dial_schedule_number: this.state.patientInfo.schedule_number,
      weight: weight,
      type: type,
      status: this.state.patientInfo.status,
    }
    if (weight != undefined && weight != null && process_status == "ok") {
      this.registerWeight(postData).then(()=>{
        this.setState({selectedWeightType: type});
      });
    }
    this.initState();
  }
  
  registerWeight = async (postData) => {
    if (postData.type == "count") {
      let weightType = this.props.weightType != "" && this.props.weightType != undefined ? this.props.weightType : this.state.selectedWeightType != "" ? this.state.selectedWeightType : this.getCurrentWeightType();
      postData.type = weightType;
      postData.count = "ok";
      // postData.realWeight = this.state.weight_before;
      postData.rawWeight = this.state.weight_before_raw;
      if (weightType == "after_weight") {
        postData.rawWeight = this.state.weight_after_raw;
      }
      // DN176 車椅子プルダウンを有効にしているときの動作の実装
      if (postData.from == undefined || postData.from == null || postData.from != "select_wheelchair") {
        this.setState({
          curCommonCode: 0
        });
      }
    }
    postData.weight_before_raw = this.state.weight_before_raw;
    postData.patient_number = this.state.patientInfo.id;
    postData.wheelchair_before = this.state.wheelchair_before;
    postData.wheelchair_after = this.state.wheelchair_after;
    let data = await axios.post("/app/api/v2/dial/registerWeight", {params:postData});
    if (data != undefined && data != null && data.status == 200) {
      let weight_val = parseFloat(postData.weight).toFixed(2);
      if (postData.type == "weight_clothes_1"){
        this.setState({
          weight_before : this.countWeight(parseFloat(weight_val), "weight_clothes_1"),
          windbag_1 : weight_val
        });
      } else if (postData.type == "weight_clothes_2") {
        this.setState({
          weight_before : this.countWeight(parseFloat(weight_val), "weight_clothes_2"),
          windbag_2 : weight_val
        });
      } else if (postData.type == "weight_clothes_3") {
        this.setState({
          weight_before : this.countWeight(parseFloat(weight_val), "weight_clothes_3"),
          windbag_3 : weight_val
        });
      } else if(postData.type == "before_weight" && postData.count != "ok"){
        this.setState({
          weight_before : this.countWeight(parseFloat(weight_val), "before_weight"),
          weight_before_raw : parseFloat(weight_val)
        });
      } else if(postData.type == "after_weight" && postData.count != "ok"){
        this.setState({
          weight_after : this.countWeight(parseFloat(weight_val), "after_weight"),
          weight_after_raw : parseFloat(weight_val)
        });
      } else if(postData.type == "before_weight" && postData.count == "ok"){
        this.setState({
          weight_before : this.countWeight(parseFloat(weight_val), "count", this.state.weight_before_raw, parseFloat(weight_val)),
          wheelchairWeight: weight_val
          
        });
      } else if(postData.type == "after_weight" && postData.count == "ok"){
        this.setState({
          weight_after : this.countWeight(parseFloat(weight_val), "count", this.state.weight_after_raw, parseFloat(weight_val)),
          wheelchairWeight: weight_val
        });
      }
    }
  }
  
  countWeight = (weight, nType, rawWeight, _wheelchair) => {
    if (nType == "count") {
      weight = rawWeight - _wheelchair - parseFloat(this.state.windbag_1)- parseFloat(this.state.windbag_2)- parseFloat(this.state.windbag_3);
    } else {
      if (nType == "weight_clothes_1" || nType == "weight_clothes_2" || nType == "weight_clothes_3") {
        let weight_clothes_1_val = this.state.windbag_1;
        let weight_clothes_2_val = this.state.windbag_2;
        let weight_clothes_3_val = this.state.windbag_3;
        if (nType == "weight_clothes_1") {
          weight_clothes_1_val = weight;
        } else if(nType == "weight_clothes_2") {
          weight_clothes_2_val = weight;
        } else if(nType == "weight_clothes_3") {
          weight_clothes_3_val = weight;
        }
        let wheelchair = this.state.wheelchair_before != undefined && parseFloat(this.state.wheelchair_before) > 0 ? parseFloat(this.state.wheelchair_before) : 0;
        weight = parseFloat(this.state.weight_before_raw) - wheelchair - parseFloat(weight_clothes_1_val)- parseFloat(weight_clothes_2_val)- parseFloat(weight_clothes_3_val);
      } else {
        let wheelchair_val = 0;
        if (nType == "before_weight") {
          wheelchair_val = this.state.wheelchair_before;
        } else if(nType == "after_weight"){
          wheelchair_val = this.state.wheelchair_after;
        }
        let wheelchair = wheelchair_val != undefined && parseFloat(wheelchair_val) > 0 ? parseFloat(wheelchair_val) : 0;
        wheelchair = parseFloat(wheelchair);
        weight = parseFloat(weight) - wheelchair - parseFloat(this.state.windbag_1)- parseFloat(this.state.windbag_2)- parseFloat(this.state.windbag_3);
      }
    }
    if (weight > 0) {
      return weight;
    }
    return 0;
  }
  
  initState = () => {
    this.setState({
      isOpenBodyWeightModal:false,
      isLoaded: false,
      confirm_message: "",
      weight: "",
      originWeight: "",
      // wheelchairWeight: "",
      start:1,
      timerFlag:0,
      typeUrl: "",
      selectedWeightType: "",
      // curCommonCode: 0,
      // count_wheelchair: 0,
      wheel_status: "",
      calcTypeOwn:"",
      canTimeCount: true,
    });
    this.countIndex = 0;
  }
  
  changeWeightType = (type) => {
    this.setState({typeUrl: type});
  }
  
  getCommonCodeSelect = e => {
    if (e.target.value == "車椅子 なし") {
      this.setState({
        curCommonCode: parseInt(e.target.id),
        count_wheelchair: 0
      });
    }else{
      this.setState({ curCommonCode: parseInt(e.target.id)},()=>{
        this.handleSelectWheelchair();
      });
      
    }
  };
  
  handleSelectWheelchair = () => {
    if (this.state.curCommonCode == 0) return;
    let wheelchair_val = "";
    if (this.state.list_array != undefined && this.state.list_array != null && this.state.curCommonCode > 0) {
      this.state.list_array.map(item=> {
        if (this.state.curCommonCode == item.number) {
          wheelchair_val = item.value;
        }
      });
    }
    if (wheelchair_val == "") wheelchair_val = 0;
    let postData = {
      dial_schedule_number: this.state.patientInfo.schedule_number,
      status: this.state.patientInfo.status,
      // type: this.getCurrentWeightType(),
      type: "count",
      weight: wheelchair_val,
      from: "select_wheelchair"
    }
    
    let weightType = this.props.weightType != "" && this.props.weightType != undefined ? this.props.weightType : this.state.selectedWeightType != "" ? this.state.selectedWeightType : this.getCurrentWeightType();
    let _state = {
    };
    if (weightType == "before_weight") {
      _state.wheelchair_before = parseFloat(wheelchair_val);
    } else if(weightType == "after_weight") {
      _state.wheelchair_after = parseFloat(wheelchair_val);
      
    }
    
    this.setState(_state,()=>{
      this.registerWeight(postData);
    });
  }
  
  handleWheelChair = async (type) => {
    if (this.state.list_array[this.state.curCommonCode] != undefined && this.state.list_array[this.state.curCommonCode].name == "なし") {
      return;
    }
    if (type == "count") {
      this.setState({
        wheel_status: "count",
        isOpenBodyWeightModal: true,
        canTimeCount: false
      });
      this.getBodyWeight("count");
    } else if(type == "recount" && this.state.count_wheelchair > 0){
      
      this.setState({
        wheel_status: "recount",
        isOpenBodyWeightModal: true,
        canTimeCount: false
      });
    }
  }
  
  initWheeChair = () => {
    this.setState({
      wheel_status: ""
    });
  }
  
  actionCalc = (nStatus, nType = "") => {
    // nStatus: 1 => 計測取消
    // nStatus: 0 => 再計測
    
    // this.setState({
    //     isLoaded: true
    // });
    if (nStatus == 1) {
      clearInterval(this.state.timer);
    } else {
      if (nType == "count") { // 車椅子
        this.setState({
          isLoaded: false,
          start: 0,
          timerFlag: 1,
          timer:setInterval(() => {
            this.getBodyWeight(nType);
          }, 3000)
        });
      } else { //
        this.setState({
          isLoaded: false,
          start: 0,
          timerFlag: 1,
          timer:setInterval(() => {
            this.getBodyWeight();
          }, 3000)
        });
      }
    }
  }
  
  calcWheelchair = () => {
    // 風袋差し引き: x, 前後切替: x
    this.setState({
      selectedWeightType: ""
    });
    // 車椅子を再計測する return if status: 開始済
    if (this.state.patientInfo.status == 2) {
      window.sessionStorage.setItem("alert_messages", "車椅子計測ができません。");
      return;
    }
    if (this.state.patientInfo.wheelchair_today == 1) {
      window.sessionStorage.setItem("alert_messages", "本日車椅子計測ができません。");
      return;
    }
    // set wheel_chair flag 1
    let postData = {
      patient_number: this.state.patientInfo.id,
      system_patient_id: this.state.patientInfo.system_patient_id,
    };
    axios.post("/app/api/v2/dial/setWheelchairFlag", {params:postData});
    if (this.state.calcTypeOwn == "wheelchair_after") { // 後体重の車椅子計測
      this.setState({
        wheel_status: "",
        start: 1,
        timerFlag: 0,
        isOpenBodyWeightModal: true,
        canTimeCount: false,
      },() => {
        this.getBodyWeight();
      });
    } else { // 前体重の車椅子計測
      this.setState({
        wheel_status: "count",
        start: 1,
        timerFlag: 0,
        isOpenBodyWeightModal: true,
        canTimeCount: false
      },() => {
        this.getBodyWeight("count");
      });
    }
    
  }
  
  calcWeight = () => { // 体重を再計測する
    // 体重を再計測する return if status: 開始済
    if (this.state.patientInfo.status == 2) {
      window.sessionStorage.setItem("alert_messages", "体重計測ができません。");
      return;
    }
    
    // let weight_type = this.props.weightType != "" ? this.props.weightType : this.state.selectedWeightType != "" ? this.state.selectedWeightType : this.getCurrentWeightType();
    let weight_type = this.state.selectedWeightType != "" ? this.state.selectedWeightType : this.props.weightType != "" && this.props.weightType != undefined ? this.props.weightType : this.getCurrentWeightType();
    if (weight_type == "after_weight" && this.state.patientInfo.status < 3) {
      window.sessionStorage.setItem("alert_messages", "後体重計測ができません。");
      return;
    }
    this.setState({
      wheel_status: "",
      start: 1,
      timerFlag: 0,
      isOpenBodyWeightModal: true,
      canTimeCount: false
    },() => {
      this.getBodyWeight();
    });
  }
  onKeyPressed(e) {
    if (e.target === e.currentTarget) {
      if (e.keyCode === KEY_CODES.enter) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.value == "") return;
        if (!/^\d*\.?\d*$/.test(e.target.value)){
          window.sessionStorage.setItem("alert_messages", "数値を正確に入力してください。");
          return;
        }
        let postData = {
          dial_schedule_number: this.state.patientInfo.schedule_number,
          status: this.state.patientInfo.status,
        }
        if (this.state.edit_status == 1) {
          postData.weight = e.target.value;
          postData.type = "weight_clothes_1"
        } else if(this.state.edit_status == 2) {
          postData.weight = e.target.value;
          postData.type = "weight_clothes_2"
        } else if(this.state.edit_status == 3) {
          postData.weight = e.target.value;
          postData.type = "weight_clothes_3"
        }
        this.registerWeight(postData);
        this.setState({
          edit_status: 0
        });
      }
    }
  }
  
  onInputKeyPressed(e) {
    this.onKeyPressed(e);
  }
  
  editWheelchair = (nType) => {
    if (nType == 1) {
      document.getElementById("weight_clothes_1").value = this.state.windbag_1;
    } else if(nType == 2){
      document.getElementById("weight_clothes_2").value = this.state.windbag_2;
    } else if(nType == 3){
      document.getElementById("weight_clothes_3").value = this.state.windbag_3;
    }
    this.setState({
      edit_status: nType
    });
  }
  
  getIncreaseWeight = () => {
    if (this.state.patientInfo.last_weight_after == "" || this.state.patientInfo.last_weight_after == null) return "";
    if (this.state.weight_before > 0) {
      let ret = parseFloat(this.state.weight_before - this.state.patientInfo.last_weight_after).toFixed(2);
      return ret;
    }
    return "";
  }
  
  closeInputWeight = () => {
    this.setState({isInputWeight: false});
  };
  
  calcInputWeight = () => {
    let sendData = this.state.patientInfo;
    sendData.before_weight = this.state.weight_before;
    sendData.weight_before_raw = this.state.weight_before_raw;
    sendData.after_weight = this.state.weight_after;
    sendData.weight_after_raw = this.state.weight_after_raw;
    sendData.wheelchair_before = this.state.wheelchair_before;
    sendData.wheelchair_after = this.state.wheelchair_after;
    sendData.windbag_1 = this.state.windbag_1;
    sendData.windbag_2 = this.state.windbag_2;
    sendData.windbag_3 = this.state.windbag_3;
    sendData.target_drainage = this.state.target_drainage;
    sendData.target_weight = this.state.target_weight;
    sendData.before_weight = this.state.weight_before;
    sendData.selectedWeightType = this.state.selectedWeightType;
    this.context.$updateReservedPatient(sendData);
    this.props.history.replace("/dial/weight/" + this.state.patientInfo.system_patient_id + "/inputweight");
    // this.props.history.replace("/dial/weight/inputweight");
  };
  
  InputWeightOk = (info) => {
    let status = 0;
    if( info.before_weight > 0) {
      status = 1;
    }
    if (info.after_weight > 0) {
      status = 4;
    }
    info.status= status;
    this.registerWeightByHand(info);
    this.setState({
      isInputWeight: false
    });
  };
  
  async registerWeightByHand(info)  {
    let status = 0;
    if( parseFloat(info.before_weight) > 0) {
      status = 1;
    }
    if ( parseFloat(info.after_weight) > 0) {
      status = 4;
    }
    info.status= status;
    let path = "/app/api/v2/dial/patient/registerWeight";
    await axios
      .post(path, {
        params: info
      })
      .then(() => {
        this.setState({
          weight_before: info.before_weight > 0 ? info.before_weight : "",
          weight_after: info.after_weight > 0 ? info.after_weight : ""
        });
      })
      .catch(() => {
        // window.sessionStorage.setItem("alert_messages", "通信に失敗しました。");
      });
  }
  
  calcMinusclothes = () => {
    // 風袋差し引き
    // this.props.selectWeight("calculateminusclothes");
    if(this.openModalTime != null && ((new Date().getTime() - this.openModalTime) < 500)) return;
    
    let weightType = this.state.selectedWeightType;
    if (weightType == "weight_clothes_1") {
      this.setState({selectedWeightType: "weight_clothes_2"});
    } else if(weightType == "weight_clothes_2"){
      this.setState({selectedWeightType: "weight_clothes_3"});
    } else {
      this.setState({selectedWeightType: "weight_clothes_1"});
    }
    this.openModalTime=new Date().getTime();
  }
  
  calcExchangeBodyWeight = () => {
    // 前後切替
    // this.props.selectWeight("recalculate");
    if(this.openModalTime != null && ((new Date().getTime() - this.openModalTime) < 500)) return;
    let weightType = this.state.selectedWeightType;
    if (weightType != "before_weight" && weightType != "after_weight") {
      weightType = this.getCurrentWeightType();
    }
    if (weightType == "before_weight") {
      this.setState({selectedWeightType: "after_weight", curCommonCode: 0});
    } else{
      this.setState({selectedWeightType: "before_weight", curCommonCode: 0});
    }
    this.openModalTime=new Date().getTime();
  }
  
  onFocusOutEvent = () => {
    this.setState({
      edit_status: 0
    });
  }
  
  goReservedPatientList = () => {
    this.props.history.replace("/dial/weight/patientList");
  }
  
  convertDecimal = (_val, _digits) => {
    if (isNaN(parseFloat(_val))) return "";
    return parseFloat(_val).toFixed(_digits);
  }
  
  canSelectWheelchair = () => {
    let wheelchair_select_available = null;
    var init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != undefined && init_status != null && init_status.weight_calc_wheelchair_select_available != undefined) {
      wheelchair_select_available =
        init_status.weight_calc_wheelchair_select_available != undefined
          ? init_status.weight_calc_wheelchair_select_available
          : null;
    }
    return wheelchair_select_available != "ON" ? false : true;
  }
  
  render() {
    //目標除水量
    let target_drainage = this.state.weight_before > 0 ? this.state.weight_before : this.state.patientInfo.before_weight;
    target_drainage = parseFloat(target_drainage) - parseFloat(this.state.target_weight> 0 ? this.state.target_weight:0);
    target_drainage = parseFloat(target_drainage).toFixed(2);
    let div_wheelchair_before = "㎏";
    let div_wheelchair_after = "㎏";
    if(this.state.wheelchair_before > 0) {
      div_wheelchair_before = this.convertDecimal(this.state.wheelchair_before, 1) + "㎏";
    }
    if(this.state.wheelchair_after > 0) {
      div_wheelchair_after = this.convertDecimal(this.state.wheelchair_after, 1) + "㎏";
    }   
    let editStatus = this.state.edit_status;
    
    // DN140 体重計測結果画面の車いすプルダウンは、使用するかどうか決められるように
    let wheelchair_select_available = this.canSelectWheelchair();
    let wheelchair_select_label = "";
    if (wheelchair_select_available != true) {
      if (this.state.patientInfo.wheel_chair != 1) { // 車いすフラグオフの患者
        // 基本は「なし」、オフの患者でも車いす重量が登録されている場合だけ「あり」
        wheelchair_select_label = "なし";
        if ((this.state.patientInfo.wheelchair_before != undefined && this.state.patientInfo.wheelchair_before != null && this.state.patientInfo.wheelchair_before != "" && parseFloat(this.state.patientInfo.wheelchair_before) > 0) || (this.state.patientInfo.wheelchair_after != undefined && this.state.patientInfo.wheelchair_after != null && this.state.patientInfo.wheelchair_after != "" && parseFloat(this.state.patientInfo.wheelchair_after) > 0) ) {
          wheelchair_select_label = "あり";
        }
      } else { // 車いすフラグオンの患者
        wheelchair_select_label = "あり";
        if (this.state.patientInfo.wheelchair_today == 1) {
          wheelchair_select_label = "なし";
        }
      }
      
      if (wheelchair_select_label == "なし") {
        div_wheelchair_before = "㎏";
        div_wheelchair_after = "㎏";
      }
    }

    let weight_type = this.state.selectedWeightType != "" ? this.state.selectedWeightType : this.props.weightType != "" && this.props.weightType != undefined ? this.props.weightType : this.getCurrentWeightType();
    let patientInfo = this.state.patientInfo;
    return (
      <>
        <DialSideBar
          selectWeight={this.changeWeightType}
          schedule_date={this.context.reserved_patient.schedule_date ? formatDateLine(this.context.reserved_patient.schedule_date) : ""}
        />
        <Card>
          {/*<div className="title"><span id="weight-menu"><Icon icon={faBars} onClick={this.showMenu}/></span>体重測定方法</div>*/}
          <div className="title"></div>
          <div className="card-body">
            <Wrapper>
              <div className="flex cur_date">
                <div className="treat-date-area">
                  <label>測定日</label>
                </div>
                <div className="up-area">{this.state.weightDay}</div>
              </div>
              <div className="patient_info flex">
                <div className="patient_number">ID：{patientInfo !== undefined && patientInfo !== null && pad(patientInfo.id, 5)}</div>
                <div className="patient_name flex"><div style={{fontSize:"1.5rem",fontWeight:"normal"}}>患者名：</div>{patientInfo !== undefined && patientInfo !== null && patientInfo.name}</div>
                <div className="unit">様</div>
              </div>
              <div className="tc description">{patientInfo.status < 2 ? "ベッドNo:"+patientInfo.bedNumber+"に誘導してください。" : patientInfo.next_date == "no" ? "お疲れ様でした。" :"お疲れ様でした。次回は"+ formatJapanDateNoYear(patientInfo.next_date)+ TIMEZONE[patientInfo.timezone]+"です。"}</div>
              <div className="flex div-recount-buttons">
                <Button onClick={this.calcWeight}>体重を再計測する</Button>
                <Button onClick={this.calcWheelchair}>{this.state.wheelchairWeight > 0 ? "車椅子を再計測する" : "車椅子を計測する"}</Button>
                <Button onClick={this.calcInputWeight}>手入力</Button>
              </div>
              <div className="flex flex-just-center">
                <div className={`border-weight-prev ${this.state.weight_before_raw != this.state.weight_before && this.state.weight_before_raw > 0 ? 'h100' : ''} ${this.state.selectedWeightType == "before_weight" ? "active_weight":""}`}>
                  <div className="tl top-label padding-15">
                    前体重
                    {this.state.weight_before_raw != this.state.weight_before && this.state.weight_before_raw > 0 && (
                      <p>（{this.convertDecimal(this.state.weight_before_raw, this.pattern_fixed['weight_before_raw'])}㎏）</p>
                    )}
                  </div>
                  <div className="tr top-label f50">
                    {this.state.weight_before != 0 ? this.convertDecimal(this.state.weight_before, this._m_digits): patientInfo !== undefined && patientInfo !== null && this.convertDecimal(patientInfo.before_weight, this.pattern_fixed['weight_before_raw'])}㎏
                  </div>
                </div>
                <div className={`border-weight-next ${this.state.weight_after_raw != this.state.weight_after && this.state.weight_after_raw > 0 ? 'h100' : ''} ${this.state.selectedWeightType == "after_weight" ? "active_weight":""}`}>
                  <div className="tl top-label padding-15">
                    後体重
                    {this.state.weight_after_raw != this.state.weight_after && this.state.weight_after_raw > 0 && (
                      <p>（{this.convertDecimal(this.state.weight_after_raw, this.pattern_fixed['weight_after_raw'])}㎏）</p>
                    )}
                  </div>
                  <div className="tr top-label f50">
                    {this.state.weight_after > 0 ? this.convertDecimal(this.state.weight_after, this._m_digits): patientInfo !== undefined && patientInfo !== null && patientInfo.after_weight > 0 ? this.convertDecimal(patientInfo.after_weight, this.pattern_fixed['weight_after_raw']):""}㎏
                  </div>
                </div>
              </div>
              <div className="flex flex-just-center">
                <div className="box-detail">
                  <div className="tl w50 padding">DW</div>
                  <div className="tr w50 padding">{patientInfo !== undefined && patientInfo !== null && this.convertDecimal(patientInfo.dw, this.pattern_fixed['dw'])}㎏</div>
                </div>
                <div className="box-detail">
                  <div className="tl w60 padding">本日目標体重</div>
                  <div className="tr w40 padding">{this.state.target_weight > 0 ? this.convertDecimal(this.state.target_weight, this.pattern_fixed['target_weight']) : ""}㎏</div>
                </div>
              </div>
              <div className="flex flex-just-center">
                <div className="box-detail">
                  <div className="tl w60 padding">前回からの増加量</div>
                  <div className="tr w40 padding">{this.convertDecimal(this.getIncreaseWeight(), this.pattern_fixed['increase_amount'])}㎏</div>
                </div>
                <div className="box-detail">
                  <div className="tl w60 padding">本日の減少量</div>
                  {/* <div className="tr w40 padding">{this.state.weight_before > 0 && this.state.target_weight > 0 ? (this.state.weight_before - this.state.target_weight).toFixed(2) : ""}㎏</div> */}
                  <div className="tr w40 padding">{this.state.weight_before > 0 && this.state.weight_after > 0 ? parseFloat(this.state.weight_before - this.state.weight_after).toFixed(this.pattern_fixed['today_minus_amount']) : ""}L</div>
                </div>
              </div>
              <div className="flex flex-just-center">
                <div className="box-detail common_code">
                  {wheelchair_select_label != "" ? (
                    <>
                      <div className="wheelchair-exist">{"車椅子(前) " + wheelchair_select_label}</div>
                    </>
                  ) :(
                    <>
                      {weight_type == "before_weight" ? (
                        <>
                          <SelectorWithLabel
                            options={this.state.commonData}
                            title="車椅子(前) "
                            getSelect={this.getCommonCodeSelect}
                            departmentEditCode={this.state.curCommonCode}
                          />                          
                        </>  
                      ):(
                        <>
                          <div className="disable-select">
                            <SelectorWithLabel
                              title="車椅子(前) "
                              isDisabled={true}
                            />
                          </div>
                        </>
                      )}                      
                    </>
                  )}                  
                  <div className="div-wheelchair">{div_wheelchair_before}</div>
                </div>
                <div className="box-detail common_code">
                  {wheelchair_select_label != "" ? (
                    <>
                      <div className="wheelchair-exist">{"車椅子(後) " + wheelchair_select_label}</div>
                    </>
                  ) :(
                    <>
                      {weight_type == "after_weight" ? (
                        <>
                          <SelectorWithLabel
                            options={this.state.commonData}
                            title="車椅子(後) "
                            getSelect={this.getCommonCodeSelect}
                            departmentEditCode={this.state.curCommonCode}
                          />                          
                        </>  
                      ):(
                        <>
                          <div className="disable-select">
                            <SelectorWithLabel
                              title="車椅子(後) "
                              isDisabled={true}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}                
                  <div className="div-wheelchair">{div_wheelchair_after}</div>
                </div>
              </div>
              <div className="flex flex-just-center">
                <div className={`box-detail ${this.state.selectedWeightType == "weight_clothes_1" ? "active_weight":""}`}>
                  <div className="tl w50 padding">風袋①</div>
                  <div className={editStatus == 1 ? "not-show" : "tr w50 padding"} >{this.state.windbag_1 != undefined && this.state.windbag_1 != "" ? this.convertDecimal(this.state.windbag_1, this.pattern_fixed['windbag_1']): patientInfo !== undefined && patientInfo !== null && this.convertDecimal(patientInfo.windbag_1, this.pattern_fixed['windbag_1'])}㎏</div>
                  <div className={editStatus == 1 ? "tr w50 div-edit-wheelchair" : "not-show"}>
                    <input
                      id="weight_clothes_1"
                      type="text"
                      onKeyDown={this.onInputKeyPressed}
                      onBlur={this.onFocusOutEvent}
                    />
                  </div>
                </div>
                <div className="box-detail">
                  <div className="tl w50 padding">補液</div>
                  <div className="tr w50 padding">{patientInfo !== undefined && patientInfo !== null && this.convertDecimal(patientInfo.fluid, this.pattern_fixed['fluid'])}㎏</div>
                </div>
              </div>
              <div className="flex flex-just-center">
                <div className={`box-detail ${this.state.selectedWeightType == "weight_clothes_2" ? "active_weight":""}`}>
                  <div className="tl w50 padding">風袋②</div>
                  <div className={editStatus == 2 ? "not-show" : "tr w50 padding"}>{this.state.windbag_2 != undefined && this.state.windbag_2 != "" ? this.convertDecimal(this.state.windbag_2, this.pattern_fixed['windbag_2']): patientInfo !== undefined && patientInfo !== null && this.convertDecimal(patientInfo.windbag_2, this.pattern_fixed['windbag_2'])}㎏</div>
                  <div className={editStatus == 2 ? "tr w50 div-edit-wheelchair" : "not-show"}>
                    <input
                      id="weight_clothes_2"
                      type="text"
                      onKeyDown={this.onInputKeyPressed}
                      onBlur={this.onFocusOutEvent}
                    />
                  </div>
                </div>
                <div className="box-detail">
                  <div className="tl w50 padding">補食</div>
                  <div className="tr w50 padding">{patientInfo !== undefined && patientInfo !== null && this.convertDecimal(patientInfo.supplementary_food, this.pattern_fixed['supplementary_food'])}㎏</div>
                </div>
              </div>
              <div className="flex flex-just-center">
                <div className={`box-detail ${this.state.selectedWeightType == "weight_clothes_3" ? "active_weight":""}`}>
                  <div className="tl w50 padding">風袋③</div>
                  <div className={editStatus == 3 ? "not-show" : "tr w50 padding"}>{this.state.windbag_3 != undefined && this.state.windbag_3 != "" ? this.convertDecimal(this.state.windbag_3, this.pattern_fixed['windbag_3']): patientInfo !== undefined && patientInfo !== null && this.convertDecimal(patientInfo.windbag_3, this.pattern_fixed['windbag_3'])}㎏</div>
                  <div className={editStatus == 3 ? "tr w50 div-edit-wheelchair" : "not-show"}>
                    <input
                      id="weight_clothes_3"
                      type="text"
                      onKeyDown={this.onInputKeyPressed}
                      onBlur={this.onFocusOutEvent}
                    />
                  </div>
                </div>
                <div className="box-detail">
                  <div className="tl w50 padding">目標除水量</div>
                  <div className="tr w50 padding">
                    <div>{!isNaN(target_drainage)? this.convertDecimal(target_drainage, this.pattern_fixed['target_amount']) : ""}L</div>
                  </div>
                </div>
              </div>
              <div className="flex div-recount-buttons">
                <Button onClick={this.calcMinusclothes}>風袋差し引き</Button>
                <Button onClick={this.calcExchangeBodyWeight}>前後切替</Button>
              </div>
              <div className="footer-buttons" style={{marginRight:"2rem"}}>
                <Button className="red-btn" onClick={this.goReservedPatientList}>確定</Button>
              </div>
            </Wrapper>
          </div>
          <WeightMenu
            {...this.state.weightMenu}
            parent={this}
          />
          {this.state.isOpenBodyWeightModal == true && (
            <BodyWeightResultModal
              isLoaded={this.state.isLoaded}
              closeModal={this.closeModal}
              weight={this.state.weight}
              originWeight={this.state.originWeight}
              wheelchairWeight={this.state.wheelchairWeight}
              handleOk={this.handleOk}
              weightType={this.props.weightType != "" && this.props.weightType != undefined ? this.props.weightType : this.state.selectedWeightType != "" ? this.state.selectedWeightType : this.getCurrentWeightType()}
              patientInfo={this.state.patientInfo}
              wheel_status={this.state.wheel_status}
              initWheeChair={this.initWheeChair}
              actionCalc={this.actionCalc}
              calcWheelchair={this.calcWheelchair}
              calcWeight={this.calcWeight}
              calcType={this.state.calcTypeOwn}
              schedule_date={formatDateLine(this.context.reserved_patient.schedule_date)}
            />
          )}
          {this.state.confirm_message != "" && (
            <SystemConfirmModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isInputWeight && (
            <InputWeight
              handleOk={this.InputWeightOk}
              closeModal={this.closeInputWeight}
              patientInfo={this.state.patientInfo}
              schedule_date={this.props.schedule_date}
            />
          )}
        </Card>
      </>
    )
  }
}

Calculate.contextType = Context;

Calculate.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string,
  calcType: PropTypes.string,
  weightType: PropTypes.string,
  selectWeight: PropTypes.func,
};
export default Calculate