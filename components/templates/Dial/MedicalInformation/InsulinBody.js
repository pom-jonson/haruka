import React, { Component } from "react";
import styled from "styled-components";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import TitleTabs from "~/components/organisms/TitleTabs";
import Button from "~/components/atoms/Button";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as methods from "~/components/templates/Dial/DialMethods";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { formatDateLine } from "../../../../helpers/date";
import { formatJapanDateSlash } from "~/helpers/date";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import axios from "axios";
import * as sessApi from "~/helpers/cacheSession-utils";
import { medicalInformationValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import {makeList_code, addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg, moveCaretPosition} from '~/helpers/dialConstants'
import {getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  margin-left: 1.25rem;
`;

const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  margin-right: 2%;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  .table-row {
    cursor: pointer;
    font-size: 1rem;
  }
  table {
    margin-bottom: 0;
    width: 100%;
  }
  td {
    padding: 0;
    text-align: left;
    padding: 0.2rem;
    width: 100%;
  }
  .selected {
    background: lightblue !important;
  }
  .wp-33 {
    width: 33%;
  }
  margin-bottom: 10px;
`;

const Wrapper = styled.div`
  display: block;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  height: calc(100vh - 15.875rem);
  float: left;
  margin-bottom: 0.625rem;
  overflow-x: hidden;
  label {
    text-align: right;
  }
  .date_area {
    margin-bottom: 0.625rem;
    .label-title {
      width: 5.625rem;
      font-size: 1rem;
      text-align: left;
      margin: 0;
      line-height: 2rem;
    }
    .react-datepicker-wrapper {
      width: 9.375rem;
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
    span {
      padding-left: 0.625rem;
      padding-top: 1rem;
    }
  }
  .nav-tabs .nav-link {
    background-color: lightgray !important;
    h2 {
      font-size: 1.25rem;
    }
  }
  .nav-tabs .nav-link.active {
    background-color: white !important;
    h2 {
      font-size: 1.25rem;
    }
  }
  textarea {
    width: 95%;
  }
  .buttons_area {
    .button-title {
      width: 18.75rem;
      margin-right: 1.875rem;
      padding-top: 0.5rem;
    }
    .row-button {
      margin-bottom: 0.3rem;
      margin-top: 0.3rem;
      label {
        font-size: 1rem;
        width: 20rem;
      }
    }
  }
  .click-area {
    cursor: pointer;
    width: 18.75rem;
    label {
      width: 0;
    }
  }
  .input_area {
    label {
      width: 0;
    }
    .wp-25 {
      width: 20%;
    }
    span {
      font-size: 1rem;
      width: 3.125rem;
      padding-top: 1rem;
      padding-left: 0.3rem;
      padding-right: 0.3rem;
    }
    input {
      height: 2rem;
    }
  }
  .eWZCMA {
    height: 2rem;
  }
  .jyZLTd {
    height: 2rem;
  }
  .date_area
    .react-datepicker-wrapper
    .react-datepicker__input-container
    input {
    height: 2rem;
  }
  .label-title {
    margin-top: 0.35rem;
  }
  .hankaku-eng-num-input {
      ime-mode: inactive;
      input{
        ime-mode: inactive;
      }
  }
  .numeric-input {
    input {text-align:right;}
  }

  input:disabled {
    color: black !important;
    background: white;
  }
  select:disabled {
    color: black !important;
    background: white;
    opacity:1;
  }
  textarea:disabled {
    color: black !important;
    background: white;
  }
  .remove-x-input{
    float:right;
    input{
      width: 270px;
      height:25px;
    }
    .label-title{
      margin-top:3px;
      width:5rem;
      text-align:right;
      margin-right:5px;
    }
  }
`;

const tabs = [
  {
    id: 0,
    title: "毎日",
  },
  {
    id: 1,
    title: "透析日",
  },
  {
    id: 2,
    title: "非透析日",
  },
];

class InsulinBody extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let insulin_data = [
      [
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
      ],
      [
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
      ],
      [
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
      ],
    ];
    this.state = {
      list_array: [],
      start_date: '',
      tabIndex: 0,
      tabs: tabs,
      isShowInsulinList: false,
      insulin_data,
      tab_item_number: "",
      comment: "",
      blood_glucose_sensor: "",
      blood_glucose_measuring_needle: "",
      Insulin_injection_needle: "",
      selected_history_number: 0,
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      isDeleteConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
      system_patient_id: 0,
      tmpItem: null,
      change_flag: 0,
      check_message:"",
      is_loaded: false,
      isShowDoctorList: false,
      alert_messages:'',
      alert_title:''
    };
    this.double_click = false;
    this.openModalTime = null;
    this.unt_err_message = [];
    this.first_tag_id = "";
  }
  
  async componentDidMount() {
    await this.getInsulinList();
    let system_patient_id = this.props.patientInfo != undefined && this.props.patientInfo != null ? this.props.patientInfo.system_patient_id : 0;
    await this.setChangeFlag(0);
    await this.initializeInfo(system_patient_id);
    await this.changeBackground();
    if (this.props.from_source == 'dr_karte' && this.props.special != true){
      await this.setDoctors();
      if (this.context.selectedDoctor.code > 0) {
        this.setState({
          instruction_doctor_number: parseInt(this.context.selectedDoctor.code),              
        });
      }
    }
    this.setState({is_loaded: true});
  }

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
      this.modalBlack();
    }
  };

  selectDoctor = (doctor) => {
    this.setState(
      {
        instruction_doctor_number: doctor.number,
      },
      () => {
        this.context.$updateDoctor(doctor.number, doctor.name);

        this.closeModal();
      }
    );
  };
  
  componentDidUpdate () {
    this.changeBackground();
    // eslint-disable-next-line consistent-this
    const that = this;
    let amount_obj = document.getElementById(that.state.tabIndex+"_amount_1_1_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_1_1_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_1_2_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_1_2_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_1_3_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_1_3_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_1_4_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_1_4_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_2_1_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_2_1_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_2_2_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_2_2_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_2_3_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_2_3_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_2_4_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_2_4_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_3_1_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_3_1_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_3_2_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_3_2_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_3_3_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_3_3_id");
      });
    }
    amount_obj = document.getElementById(that.state.tabIndex+"_amount_3_4_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition(that.state.tabIndex+"_amount_3_4_id");
      });
    }
  }
  
  changeBackground = () => {
    if(this.props.from_source == 'bedside') return;
    medicalInformationValidate("insulin_body", this.state, "background");
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.type == "modal") return;
    if (nextProps.patientInfo != undefined && nextProps.patientInfo != null) {
      if (
        this.state.system_patient_id != nextProps.patientInfo.system_patient_id
      ) {
        this.setState({
          system_patient_id: nextProps.patientInfo.system_patient_id,
        }, async()=>{
          await this.initializeInfo(this.state.system_patient_id);
        });
        
      }
    }
  }
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');
  }
  
  getInsulinList = async () => {
    let path = "/app/api/v2/dial/master/medicine_search";
    let post_data = {
      category: "インスリン",
      order:'name_kana'
    };
    await axios
      .post(path, { params: post_data })
      .then((res) => {
        this.setState({
          insulin_injectionData: res.data,
          insulin_injection_list: makeList_code(res.data), //variables for SelectBox List
        });
        return res.data;
      })
      .catch(() => {
        return false;
      });
  };
  
  initializeInfo =async(patient_id) => {
    if (patient_id !== 0) {
      let server_time = await getServerTime();
      let insulin_data = [
        [
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
        ],
        [
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
        ],
        [
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
          {
            insulin: 0,
            amount_1: "",
            amount_2: "",
            amount_3: "",
            amount_4: "",
          },
        ],
      ];
      this.setState({
        list_array: [],
        start_date: new Date(server_time),
        tabIndex: 0,
        isShowInsulinList: false,
        tab_item_number: "",
        selected_history_number: 0,
        insulin_data,
        comment: "",
        blood_glucose_sensor: "",
        blood_glucose_measuring_needle: "",
        Insulin_injection_needle: "",
        isUpdateConfirmModal: false,
        isDeleteConfirmModal: false,
        isCloseConfirmModal: false,
        confirm_message: "",
        change_flag: 0,
      });
      await this.getInsulinHistoryInfo(patient_id);
      if (this.props.selected_item != undefined && this.props.selected_item != null) {
        this.selectHistory(this.props.selected_item);
      }
    }
  };
  
  async getInsulinHistoryInfo(patient_id) {
    let path = "/app/api/v2/dial/medicine_information/insulin/get";
    const post_data = {
      patient_id: patient_id,
    };
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        this.setState({
          list_array: res,
        }, () => {
          if (res.length > 0 && this.props.from_source == 'bedside'){
            this.handleSelectHistory(res[0]);
          }
        });
      })
      .catch(() => {});
  }
  
  selectTitleTab = (e) => {
    this.setState({ tabIndex: parseInt(e.target.id) },()=>{
      let check_data = this.getCheckData();
      if (this.state.change_flag == 0) return
      medicalInformationValidate("insulin_body", check_data);
    });
  };
  
  getDate = (value) => {
    this.setState({
      start_date: value,
    });
  };
  
  toHalfWidthOnlyNumber = (strVal) => {
    // 半角変換
    var halfVal = strVal.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    halfVal = halfVal.replace('ー','-');
    halfVal = halfVal.replace('。', '.');
    return halfVal;
  }
  
  getValue = (key, tab_item_number, e) => {
    let RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != "" && !RegExp.test(e.target.value)) {
      return;
    }
    if (e.target.value.length > 10) return;
    let input_value = e.target.value;
    if (input_value != "") {
      input_value = this.toHalfWidthOnlyNumber(input_value);
      if (input_value - Math.round(input_value) > 0) input_value = Math.round(input_value * 100) / 100;
    }
    this.setChangeFlag(1);
    let insulin_data = this.state.insulin_data;
    switch (key) {
      case "amount_1":
        insulin_data[this.state.tabIndex][tab_item_number]["amount_1"] = input_value;
        break;
      case "amount_2":
        insulin_data[this.state.tabIndex][tab_item_number]["amount_2"] = input_value;
        break;
      case "amount_3":
        insulin_data[this.state.tabIndex][tab_item_number]["amount_3"] = input_value;
        break;
      case "amount_4":
        insulin_data[this.state.tabIndex][tab_item_number]["amount_4"] = input_value;
        break;
    }
    this.setState({
      insulin_data,
    });
  };
  
  getComment = (e) => {
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({ comment: e.target.value });
    this.setChangeFlag(1);
  };
  
  getSensor = (e) => {
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({ blood_glucose_sensor: e.target.value });
    this.setChangeFlag(1);
  };
  
  getNeedle = (e) => {
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({ blood_glucose_measuring_needle: e.target.value });
    this.setChangeFlag(1);
  };
  
  getInjectionNeedle = (e) => {
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({ Insulin_injection_needle: e.target.value });
    this.setChangeFlag(1);
  };
  
  selectInsulin = (insulin) => {
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    let insulin_data = this.state.insulin_data;
    insulin_data[this.state.tabIndex][this.state.tab_item_number]["insulin"] =
      insulin.code;
    this.setState({
      insulin_data,
    });
    this.setChangeFlag(1);
    this.closeModal();
  };
  
  getInputText = (index, e) => {
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (e.target.value != "") return;
    let insulin_data = this.state.insulin_data;
    insulin_data[this.state.tabIndex][index]["insulin"] = 0;
    this.setState({
      tab_item_number: index,
      insulin_data,
    });
    this.setChangeFlag(1);
  };
  
  clearInsulin = () => {
    let insulin_data = this.state.insulin_data;
    insulin_data[this.state.tabIndex][this.state.tab_item_number][
      "insulin"
      ] = 0;
    this.setState({
      insulin_data,
    });
    this.closeModal();
  };
  
  showInsulinList = (index) => {
    if (this.props.from_source == 'bedside') return;
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.modalBlack();
    this.setState({
      tab_item_number: index,
      isShowInsulinList: true,
    });
  };
  modalBlack = () => {
    let insulin_modal = document.getElementsByClassName("insulin-manage-modal")[0];
    if (insulin_modal !== undefined && insulin_modal != null) {
      insulin_modal.style["z-index"] = 1040;
    }
  }
  modalBlackBack = () => {
    let insulin_modal = document.getElementsByClassName("insulin-manage-modal")[0];
    if (insulin_modal !== undefined && insulin_modal != null) {
      insulin_modal.style["z-index"] = 1050;
    }
  }
  
  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "injection", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };
  
  closeModal = () => {
    this.modalBlackBack();
    this.setState({
      isShowInsulinList: false,
      isShowDoctorList:false,
      alert_messages:'',
      alert_title:''
    });
  };
  
  getCheckData=()=>{
    this.first_tag_id = "";
    for(let index = 1; index < 4; index++){
      for(let u_idx = 1; u_idx < 5; u_idx++){
        removeRequiredBg(this.state.tabIndex+'_amount_'+index+'_'+u_idx+'_id');
        removeRedBorder(this.state.tabIndex+'_amount_'+index+'_'+u_idx+'_id');
      }
    }
    let state_data = this.state;
    let insulin_data = this.state.insulin_data;
    let insulin_flag = false;
    let unt_err_message = [];
    insulin_data.map((insulin_box, tabIndex) => {
      insulin_box.map((insulin, index) => {
        if (insulin["insulin"] !== 0) {
          insulin_flag = true;
          if (insulin["amount_1"] === "" &&insulin["amount_2"] === "" &&insulin["amount_3"] === "" &&insulin["amount_4"] === "") {
            for(let u_idx = 1; u_idx < 5; u_idx++){
              if(this.first_tag_id == ""){
                this.first_tag_id = tabIndex+'_amount_'+(index+1)+'_'+u_idx+'_id';
              }
              addRequiredBg(tabIndex+'_amount_'+(index+1)+'_'+u_idx+'_id');
              addRedBorder(tabIndex+'_amount_'+(index+1)+'_'+u_idx+'_id');
            }
            let insulin_name = this.state.insulin_injection_list[insulin["insulin"]];
            unt_err_message.push(tabs[tabIndex]['title']+'タブの'+insulin_name+'の数量を入力してください。')
          }
        }
      });
    });
    this.unt_err_message = unt_err_message;
    if (!insulin_flag) {
      state_data.insulin1 = null;
    } else {
      state_data.insulin1 = 1;
    }
    return state_data;
  }
  
  update = () => {
    if (this.state.change_flag == 0) return;
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      this.modalBlack();
      return;
    }
    let check_data = this.getCheckData();
    let check_message = [];
    if(this.unt_err_message.length > 0){
      check_message = this.unt_err_message;
    }
    let validate_data = medicalInformationValidate("insulin_body", check_data);
    if (validate_data['error_str_arr'].length > 0 ) {
      validate_data['error_str_arr'].map(error=>{
        check_message.push(error);
      })
      if(this.first_tag_id == ""){
        this.first_tag_id = validate_data['first_tag_id'];
      }
    }
    if(check_message.length > 0){
      this.setState({
        check_message:check_message.join('\n'),
      });
      this.modalBlack();
      return;
    }
    if (this.props.from_source === "dr_karte") {
      if (!(this.state.instruction_doctor_number > 0) && this.props.special != true) {
        this.showDoctorList();
        this.modalBlack();
        return;
      }
      this.handleInsert();
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message:
        this.state.selected_history_number !== 0
          ? "インスリン情報を変更しますか?"
          : "インスリン情報を登録しますか?",
    });
    this.modalBlack();
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isOpenConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
    });
    this.modalBlackBack();
  }
  
  handleInsert = async () => {
    if (this.openModalTime != null && new Date().getTime() - this.openModalTime < 1000){
      return;
    }
    let insulin_data = this.state.insulin_data;
    let input_data = {
      number: this.state.selected_history_number,
      patient_id: this.props.patientInfo.system_patient_id,
      start_date: formatDateLine(this.state.start_date),
      comment: this.state.comment,
      blood_glucose_sensor: this.state.blood_glucose_sensor,
      blood_glucose_measuring_needle: this.state.blood_glucose_measuring_needle,
      Insulin_injection_needle: this.state.Insulin_injection_needle,
      insulin_data,
      insulin_injection_list: this.state.insulin_injection_list,
      source: this.props.from_source,
      instruction_doctor_number:this.state.instruction_doctor_number,
    };
    if (this.props.special !== true) {
      let path = "/app/api/v2/dial/medicine_information/insulin/register";
      await apiClient
        .post(path, {
          params: input_data,
        })
        .then(async(res) => {
          if (this.props.type === "modal") {
            this.props.handleOk(input_data, this.props.is_edit);
          }
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          await this.initializeInfo(this.props.patientInfo.system_patient_id);
        })
        .catch(() => {})
        .finally(() => {
          this.double_click = false;
        });
    } else {
      this.props.handleOk(input_data, this.props.is_edit);
    }
    
    this.openModalTime = new Date().getTime();
    this.setState({ isUpdateConfirmModal: false });
    this.setChangeFlag(0);
  };
  
  deleteHistory = async () => {
    let path = "/app/api/v2/dial/medicine_information/insulin/delete";
    const post_data = {
      number: this.state.selected_history_number,
    };
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then(async(res) => {        
        await this.initializeInfo(this.props.patientInfo.system_patient_id);
        this.setState({
          alert_messages:res.alert_message,
          alert_title:'削除完了'
        })
        this.modalBlack();
      })
      .catch(() => {
        this.modalBlackBack();
      })
      .finally(() => {
        this.double_click=false;
      });
    this.setState({ isDeleteConfirmModal: false });
    
  };
  
  handleSelectHistory = (item) => {
    if (item.number == this.state.selected_history_number) return;
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        tmpItem: item,
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
      this.modalBlack();
      return;
    }
    this.selectHistory(item);
  }
  
  selectHistory = (item) => {
    let insulin_data = [
      [
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
      ],
      [
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
      ],
      [
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
        { insulin: 0, amount_1: "", amount_2: "", amount_3: "", amount_4: "" },
      ],
    ];
    
    item.insulin_data.map((insulin_box, tab_index) => {
      if (insulin_box.length > 0){
        insulin_box.map((insulin, item_index) => {
          insulin_data[tab_index][item_index]["insulin"] = insulin["insulin"];
          insulin_data[tab_index][item_index]["amount_1"] = insulin["amount_1"];
          insulin_data[tab_index][item_index]["amount_2"] = insulin["amount_2"];
          insulin_data[tab_index][item_index]["amount_3"] = insulin["amount_3"];
          insulin_data[tab_index][item_index]["amount_4"] = insulin["amount_4"];
        });
      } else {
        Object.keys(insulin_box).map((key, item_index) => {
          var insulin = insulin_box[key];
          insulin_data[tab_index][item_index]["insulin"] = insulin["insulin"];
          insulin_data[tab_index][item_index]["amount_1"] = insulin["amount_1"];
          insulin_data[tab_index][item_index]["amount_2"] = insulin["amount_2"];
          insulin_data[tab_index][item_index]["amount_3"] = insulin["amount_3"];
          insulin_data[tab_index][item_index]["amount_4"] = insulin["amount_4"];
        })
      }
    });
    this.setChangeFlag(0);
    this.setState({
      selected_history_number: item.number,
      start_date: new Date(item.start_date),
      tabIndex: 0,
      tmpItem: null,
      isShowInsulinList: false,
      insulin_data,
      tab_item_number: "",
      comment: item.comment,
      blood_glucose_sensor: item.blood_glucose_sensor,
      blood_glucose_measuring_needle: item.blood_glucose_measuring_needle,
      Insulin_injection_needle: item.Insulin_injection_needle,
    });
  };
  
  delete = () => {
    if (this.state.selected_history_number !== 0) {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: "インスリン情報を削除しますか?",
      });
      this.modalBlack();
    }
  };
  
  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    },()=>{
      this.selectHistory(this.state.tmpItem);
    });
  }
  
  handleCloseModal = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isCloseConfirmModal: true,
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？",
      });
      this.modalBlack();
      return;
    }
    this.props.closeModal();
  }
  
  confirmCloseModalOk = () => {
    this.setState({
      isCloseConfirmModal: false,
      confirm_message: ""
    },()=>{
      this.props.closeModal();
    });
  }
  
  closeAlertModal = () => {
    this.setState({check_message: ''});
    if(this.first_tag_id != ""){
      $("#" + this.first_tag_id).focus();
    }
  }
  
  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let {
      insulin_data,
      insulin_injectionData,
      insulin_injection_list,
    } = this.state;
    let is_modal =
      this.props.type != undefined &&
      this.props.type != null &&
      this.props.type === "modal";
    return (
          <>
            <Col md="8" className="left">
              {this.state.is_loaded != true && (
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
              {this.state.is_loaded == true && (
                <>
                  <Wrapper>
                    <div className="flex date_area">
                      <InputWithLabelBorder
                        label="指示開始日"
                        type="date"
                        id='start_date_id'
                        getInputText={this.getDate.bind(this)}
                        diseaseEditData={this.state.start_date}
                        isDisabled ={this.props.from_source == 'bedside' ? true : false}
                      />
                      <span> ～</span>
                    </div>
                    {this.props.special !== true && (
                      <TitleTabs
                        tabs={this.state.tabs}
                        selectTitleTab={this.selectTitleTab}
                        id={this.state.tabIndex}
                      />
                    )}
                    <div>
                      <div className="click-area" onClick={this.showInsulinList.bind(this, 0)}>
                        <InputWithLabelBorder
                          label=""
                          type="text"
                          id='insulin1_id'
                          getInputText={this.getInputText.bind(this, 0)}
                          diseaseEditData={
                            insulin_injection_list != undefined &&
                            insulin_data[this.state.tabIndex][0]["insulin"] !== 0
                              ? insulin_injection_list[
                                insulin_data[this.state.tabIndex][0]["insulin"]
                                ]
                              : "クリックしてコードを選択"
                          }
                          isDisabled ={this.props.from_source == 'bedside' ? true : false}
                        />
                      </div>
                      <div className="flex input_area">
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_1_1_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_1", 0)}
                            value={insulin_data[this.state.tabIndex][0]["amount_1"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_1_2_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_2", 0)}
                            value={insulin_data[this.state.tabIndex][0]["amount_2"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_1_3_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_3", 0)}
                            value={insulin_data[this.state.tabIndex][0]["amount_3"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_1_4_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_4", 0)}
                            value={insulin_data[this.state.tabIndex][0]["amount_4"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                      </div>
                    </div>
                    <div>
                      <div
                        className="click-area"
                        onClick={this.showInsulinList.bind(this, 1)}
                      >
                        <InputWithLabel
                          label=""
                          type="text"
                          getInputText={this.getInputText.bind(this, 1)}
                          diseaseEditData={
                            insulin_injection_list != undefined &&
                            insulin_data[this.state.tabIndex][1]["insulin"] !== 0
                              ? insulin_injection_list[
                                insulin_data[this.state.tabIndex][1]["insulin"]
                                ]
                              : "クリックしてコードを選択"
                          }
                          isDisabled ={this.props.from_source == 'bedside' ? true : false}
                        />
                      </div>
                      <div className="flex input_area">
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_2_1_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_1", 1)}
                            value={insulin_data[this.state.tabIndex][1]["amount_1"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_2_2_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_2", 1)}
                            value={insulin_data[this.state.tabIndex][1]["amount_2"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_2_3_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_3", 1)}
                            value={insulin_data[this.state.tabIndex][1]["amount_3"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_2_4_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_4", 1)}
                            value={insulin_data[this.state.tabIndex][1]["amount_4"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                      </div>
                    </div>
                    <div>
                      <div
                        className="click-area"
                        onClick={this.showInsulinList.bind(this, 2)}
                      >
                        <InputWithLabel
                          label=""
                          type="text"
                          getInputText={this.getInputText.bind(this, 2)}
                          diseaseEditData={
                            insulin_injection_list != undefined &&
                            insulin_data[this.state.tabIndex][2]["insulin"] !== 0
                              ? insulin_injection_list[
                                insulin_data[this.state.tabIndex][2]["insulin"]
                                ]
                              : "クリックしてコードを選択"
                          }
                          isDisabled ={this.props.from_source == 'bedside' ? true : false}
                        />
                      </div>
                      <div className="flex input_area">
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_3_1_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_1", 2)}
                            value={insulin_data[this.state.tabIndex][2]["amount_1"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_3_2_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_2", 2)}
                            value={insulin_data[this.state.tabIndex][2]["amount_2"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_3_3_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_3", 2)}
                            value={insulin_data[this.state.tabIndex][2]["amount_3"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                        <div className={"wp-25 numeric-input"}>
                          <InputBoxTag
                            label=""
                            type="text"
                            id={this.state.tabIndex+'_amount_3_4_id'}
                            className="hankaku-eng-num-input"
                            getInputText={this.getValue.bind(this, "amount_4", 2)}
                            value={insulin_data[this.state.tabIndex][2]["amount_4"]}
                            isDisabled ={this.props.from_source == 'bedside' ? true : false}
                          />
                        </div>
                        <span>単位</span>
                      </div>
                    </div>
          
                    <div className="comment_area">
                      <div className="sub_title pt-3">コメント</div>
                      <textarea
                        onChange={this.getComment.bind(this)}
                        value={this.state.comment}
                        id='comment_id'
                        disabled ={this.props.from_source == 'bedside' ? true : false}
                      />
                    </div>
                    <div className="buttons_area">
                      <div className="row-button flex">
                        <InputBoxTag
                          label="血糖測定用センサー"
                          type="text"
                          id='blood_glucose_sensor_id'
                          getInputText={this.getSensor.bind(this)}
                          value={this.state.blood_glucose_sensor}
                          isDisabled ={this.props.from_source == 'bedside' ? true : false}
                        />
                      </div>
                      <div className="row-button flex">
                        <InputBoxTag
                          label="血糖測定用針"
                          type="text"
                          id='blood_glucose_measuring_needle_id'
                          getInputText={this.getNeedle.bind(this)}
                          value={this.state.blood_glucose_measuring_needle}
                          isDisabled ={this.props.from_source == 'bedside' ? true : false}
                        />
                      </div>
                      <div className="row-button flex">
                        <InputBoxTag
                          label="インスリン注射用針"
                          type="text"
                          id='Insulin_injection_needle_id'
                          getInputText={this.getInjectionNeedle.bind(this)}
                          value={this.state.Insulin_injection_needle}
                          isDisabled ={this.props.from_source == 'bedside' ? true : false}
                        />
                      </div>
                    </div>
                    {this.props.from_source == 'dr_karte' && this.props.special != true && (
                      <div onClick={(e)=>this.showDoctorList(e)} className={authInfo !== undefined && authInfo != null && authInfo.doctor_number === 0 ? "remove-x-input  cursor-input": "remove-x-input display-none"}>
                        <InputWithLabel
                          label="指示者"
                          type="text"
                          isDisabled={true}
                          diseaseEditData={this.state.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined ? this.state.doctor_list_by_number[this.state.instruction_doctor_number]: ""}
                        />
                      </div>
                    )}
                  </Wrapper>
                </>
              )}
            </Col>
            <Col md="4" className="right">
              <div className="sub_title flex pt-3">
                <div>履歴一覧</div>
                <div className="right_area" onClick={this.delete}>
                  {this.props.special !== true && this.props.from_source != 'bedside' && (
                    <>
                      <Icon icon={faTrash} className="delete_icon"></Icon>
                      選択した履歴を削除
                    </>
                  )}
                </div>
              </div>
              <List className="history">
                <table className="table-scroll table table-bordered">
                  <tbody>
                  {this.state.is_loaded ? (
                    <>
                      {this.state.list_array !== undefined &&
                      this.state.list_array !== null &&
                      this.state.list_array.length > 0 &&
                      this.state.list_array.map((item) => {
                        return (
                          <>
                            <tr
                              className={
                                this.state.selected_history_number === item.number
                                  ? "table-row selected"
                                  : "table-row"
                              }
                              onClick={
                                this.props.special !== true
                                  ? this.handleSelectHistory.bind(this, item)
                                  : ""
                              }
                            >
                              <td>{formatJapanDateSlash(item.start_date)}～</td>
                            </tr>
                          </>
                        );
                      })}
                    </>
                  ):(
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  )}
                  </tbody>
                </table>
              </List>
              <div className="sub_title flex pt-3">
                <div>内容</div>
              </div>
              <List className="context">
                <div>{tabs[0]["title"]}</div>
                {this.state.insulin_data[0] !== undefined &&
                this.state.insulin_data[0] !== null &&
                this.state.insulin_data[0].length > 0 &&
                this.state.insulin_data[0].map((item) => {
                  if (item["insulin"] !== 0) {
                    return (
                      <>
                        <div>
                          {insulin_injection_list != undefined
                            ? insulin_injection_list[item["insulin"]]
                            : ""}
                        </div>
                        <div>
                          {item["amount_1"] +
                          "-" +
                          item["amount_2"] +
                          "-" +
                          item["amount_3"] +
                          "-" +
                          item["amount_4"]}
                        </div>
                      </>
                    );
                  }
                })}
                <br />
                <div>{tabs[1]["title"]}</div>
                {this.state.insulin_data[1] !== undefined &&
                this.state.insulin_data[1] !== null &&
                this.state.insulin_data[1].length > 0 &&
                this.state.insulin_data[1].map((item) => {
                  if (item["insulin"] !== 0) {
                    return (
                      <>
                        <div>
                          {insulin_injection_list != undefined
                            ? insulin_injection_list[item["insulin"]]
                            : ""}
                        </div>
                        <div>
                          {item["amount_1"] +
                          "-" +
                          item["amount_2"] +
                          "-" +
                          item["amount_3"] +
                          "-" +
                          item["amount_4"]}
                        </div>
                      </>
                    );
                  }
                })}
                <br />
                <div>{tabs[2]["title"]}</div>
                {this.state.insulin_data[2] !== undefined &&
                this.state.insulin_data[2] !== null &&
                this.state.insulin_data[2].length > 0 &&
                this.state.insulin_data[2].map((item) => {
                  if (item["insulin"] !== 0) {
                    return (
                      <>
                        <div>
                          {insulin_injection_list != undefined
                            ? insulin_injection_list[item["insulin"]]
                            : ""}
                        </div>
                        <div>
                          {item["amount_1"] +
                          "-" +
                          item["amount_2"] +
                          "-" +
                          item["amount_3"] +
                          "-" +
                          item["amount_4"]}
                        </div>
                      </>
                    );
                  }
                })}
              </List>
            </Col>
        <div className={is_modal ? "footer-buttons" : "footer-buttons"}>
          {/* <Button >帳票プレビュー</Button> */}
          {this.props.type != undefined &&
          this.props.type != null &&
          this.props.type === "modal" && (
            <Button className="cancel-btn" onClick={this.handleCloseModal}>{this.props.from_source == 'bedside'?'閉じる':'キャンセル'}</Button>
          )}
          {this.props.from_source != 'bedside' && (
            <>
              <Button className={this.state.change_flag == 0?"disable-btn":"red-btn"} onClick={this.update}>
                {this.state.selected_history_number > 0 ? "変更" : "登録"}
              </Button>
            </>
          )}
        </div>
        {this.state.isShowInsulinList_ && (
          <DialSelectMasterModal
            selectMaster={this.selectInsulin}
            closeModal={this.closeModal}
            MasterCodeData={insulin_injectionData}
            MasterName="インスリン"
            clearItem={this.clearInsulin}
          />
        )}
        {this.state.isShowDoctorList && (
          <DialSelectMasterModal
            selectMaster={this.selectDoctor}
            closeModal={this.closeModal}
            MasterCodeData={this.state.doctors}
            MasterName="医師"
          />
        )}
        {this.state.isShowInsulinList && (
          <SelectPannelModal
            selectMaster={this.selectInsulin}
            closeModal={this.closeModal}
            MasterName={"薬剤"}
            master_category={"インスリン"}
          />
        )}
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.handleInsert.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.deleteHistory.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenConfirmModal !== false &&  (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmCloseOk}
            confirmTitle= {this.state.confirm_message}
            title={'入力中'}
          />
        )}
        {this.state.isCloseConfirmModal !== false &&  (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmCloseModalOk}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title = {this.state.alert_title}
          />
        )}
      </>
    );
  }
}

InsulinBody.contextType = Context;

InsulinBody.propTypes = {
  patientInfo: PropTypes.array,
  type: PropTypes.string,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  selected_item: PropTypes.object,
  is_edit: PropTypes.bool,
  source: PropTypes.string,
  special: PropTypes.bool,
  from_source : PropTypes.string,
};

export default InsulinBody;
