import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { formatDateLine, formatJapanDateSlash } from "~/helpers/date";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import DiseaseHistoryPrintPreviewModal from "./DiseaseHistoryPrintPreviewModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { medicalInformationValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import {getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;

  .content {
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 6.25rem);
    margin-top:0.625rem;
  }
  .bed-side-content {
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 3rem - 20px) !important;
  }
  .disease-content {
    height: calc(100% - 6.25rem);
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .clickable {
    cursor: pointer;
    input {
      cursor: pointer;
    }
  }
  .div-style1 {
    display: block;
    overflow: hidden;
    .label-type1 {
      float: left;
      font-size: 1.25rem;
    }
    .label-type2 {
      font-size: 1.25rem;
      float: right;
      cursor: pointer;
    }
  }

  .delete_icon {
    margin-left: 0.625rem;
    cursor: pointer;
  }
  .left-area {
    width: 70%;
    height: 100%;
    .label-cur-date {
      text-align: left;
      width: 3.75rem;
      font-size: 1rem;
      margin-top: 0.9rem;
    }
    .cur-date {
      width: 64%;
      height: 2.25rem;
      border-radius: 0.25rem;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      margin-top: 0.5rem;
      padding: 0px 0.5rem;
      line-height: 2.25rem;
    }
    .main-info .disease-name {
      height: 6.25rem;
      overflow-y: auto;
      border: 1px solid #ddd;
      p {
        margin: 0;
        text-align: center;
        font-size: 1.25rem;
      }
    }
    .disease-name {
      height: 80%;
      border: 1px solid #ddd;
      .history-title {
        font-size: 1.25rem;
      }
      .flex div {
        width: 50%;
      }
      .history-delete {
        cursor: pointer;
      }
    }
    .disease-history {
      font-size: 1.25rem;
      textarea {
        width: 100%;
        height: 11rem;
        overflow-y: auto;
      }
    }
    .box-border {
      overflow: hidden;
      overflow-y: auto;
      border: 1px solid black;
      height: 85%;
      p {
        margin: 0;
        text-align: center;
      }
      .select-area .radio-group-btn label {
        text-align: left;
        padding-left: 0.625rem;
        border-radius: 0.25rem;
      }
    }
  }
  .right-area {
    width: 30%;
    height: 100%;
    padding-left: 1.25rem;
    .area-name {
      font-size: 1.25rem;
      width: calc(100% - 11rem);
    }
    .delete-history {
      width: 11rem;
      line-height: 30px;
    }
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 1rem;
    border: 1px solid #a0a0a0;
  }
  .prev-session {
    width: 65%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 1.25rem;
  }
  .pt-10 {
    padding-top: 0.625rem;
  }
  .pt-12 {
    padding-top: 12px;
  }
  .padding-top-5 {
    padding-top: 5px;
  }
  .wp-30 {
    width: 30%;
  }
  .wp-35 {
    width: 35%;
  }
  .wp-40 {
    width: 40%;
  }
  .wp-45 {
    width: 45%;
    cursor: pointer;
  }
  .wp-55 {
    width: 55%;
  }
  .wp-60 {
    width: 60%;
  }
  .wp-70 {
    width: 70%;
  }
  .hp-100 {
    height: 100%;
  }
  .footer {
    margin-top: -3rem;
    margin-right: 30%;
    text-align: right;
    button {
      margin-left: 0.3rem;
      span {
        font-size: 1.25rem;
      }
    }
    .disable-btn {
      background: lightgray;
      span {
        color: rgb(84, 84, 84);
      }
    }
    .disable-btn:hover {
      background: lightgray !important;
    }
  }
  .selected {
    background: lightblue;
  }
  .table-view {
    border: 1px solid #ddd;
    height: calc(100% - 30px);
    overflow-y: auto;
    width: 100%;
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
  }

  .history-item {
    padding: 5px;
    font-size: 1rem;
  }

  .history-header {
    overflow: hidden;
    display: flex;
    margin-bottom: 1.25rem;
  }

  .header-item {
    width: 17rem;
    label {
      text-align: left;
      width: 3.75rem;
      font-size: 1rem;
      margin-top: 5px;
      margin-bottom: 0;
    }
    input {
      width: 12rem;
      height: 2.25rem;
      border-radius: 0.25rem;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      padding: 0px 0.5rem;
    }
    .flex label {
      display: none;
    }
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
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;

    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
`;

const ContextMenu = ({visible,x,y,parent,selected_history_number}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                  <li><div onClick={() =>parent.editMedicalHistory(selected_history_number)}>変更</div></li>
              </ul>
          </ContextMenuUl>
      );
  } else { return null; }
};

class MedicalHistoryBody extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      past_history: "",
      disease_history: "",
      isShowDoctorList: false,
      isShowDiseaseList: false,
      instruction_doctor_number:authInfo.staff_category === 1 ? authInfo.doctor_number : '',
      directer_name:authInfo.staff_category === 1 ? authInfo.name : "",
      disease_codes: null,
      write_date: '',
      selected_history_number: 0,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isOpenPrintPreview: false,
      isChangeHistoryConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      change_flag: 0, // data changed flag
      check_message:"",
      alert_messages: "",
      save_action: '',
      is_loaded: false,
    };
    this.double_click = false;
    this.openModalTime = null;
  }

  async UNSAFE_componentWillMount() {
    await this.getDoctors();
    await this.getDiseases();
    await this.setDoctors();
    if (this.props.patientInfo != undefined && this.props.patientInfo != null) {
      await this.initializeInfo(this.props.patientInfo.system_patient_id);
    } else {
      let server_time = await getServerTime();
      this.setState({
        write_date:new Date(server_time),
        is_loaded: true
      });
    }
  }

  componentDidMount() {
    this.setChangeFlag(0);
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }
    this.changeBackground();
  }

  componentDidUpdate () {
    this.changeBackground();
  }
  
  componentWillUnmount() {
    sessApi.remove("dial_change_flag");
  }

  changeBackground = () => {
    if(this.props.from_source == 'bedside') return;
    medicalInformationValidate("medical_history_body", this.state, "background");
  }

  UNSAFE_componentWillReceiveProps=async(nextProps)=> {
    if (nextProps.patientInfo != undefined && nextProps.patientInfo != null) {
      if (this.props.patientInfo != undefined && this.props.patientInfo != null) {
        if (this.props.patientInfo.system_patient_id !== nextProps.patientInfo.system_patient_id) {
          await this.initializeInfo(nextProps.patientInfo.system_patient_id);
        }
      } else {
        await this.initializeInfo(nextProps.patientInfo.system_patient_id);
      }
    }
  }

  handleClick = (e, number) => {
    if (this.props.from_source == "bedside") return;
    if (e.type === "contextmenu"){        
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
          .getElementById("medical-history")
          .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                  contextMenu: { visible: false }
              });
              document
                  .getElementById("medical-history")
                  .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
          contextMenu: {
              visible: true,
              x: e.clientX - 200,
              y: e.clientY - 70,
              selected_history_number:number,
          },
      });
    }
  };

  deleteHistory = async () => {
    let path = "/app/api/v2/dial/medicine_information/deleteDiseaseHistory";
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
        window.sessionStorage.setItem("alert_messages", "削除完了##" + res.alert_message);
        await this.initializeInfo(this.props.patientInfo.system_patient_id);
      })
      .catch(() => {})
      .finally(() => {
        this.double_click = false;
      });
    this.setState({ isDeleteConfirmModal: false });
  };

  setPastHistory = (e) => {
    this.setChangeFlag(1);
    this.setState({ past_history: e.target.value });
  };

  setDiseaseHistory = (e) => {
    this.setChangeFlag(1);
    this.setState({ disease_history: e.target.value });
  };

  initializeInfo =async(patient_id) => {
    if (patient_id !== 0) {
      let server_time = await getServerTime();
      this.setState({
        selected_history_number: 0,
        past_history: "",
        disease_history: "",
        disease_codes: null,
        disease_history_data: null,
        write_date: new Date(server_time),
        change_flag: 0,
        save_action: ''
      }, async ()=>{
        await this.getDiseaseHistoryInfo(patient_id);
      });
    }
    this.setChangeFlag(0);
    if (this.props.showTitle != undefined && this.props.showTitle != null)
      this.props.showTitle('');
  };

  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;
    
    if (this.props.from_source == 'bedside') return;
    this.setState({
      isShowDoctorList: true,
    });
  };

  showDiseaseModal = () => {
    if (this.props.from_source == 'bedside') return;
    this.setState({
      isShowDiseaseList: true,
    });
  };

  selectDoctor = (doctor) => {
    if (this.props.from_source == 'bedside') return;
    this.setChangeFlag(1);
    this.setState({
      instruction_doctor_number: doctor.number,
      directer_name: doctor.name,
      isShowDoctorList: false,
    });
  };

  selectDisease = (disease) => {
    this.setChangeFlag(1);
    let temp = this.state.disease_codes;
    if (temp == null || (temp != null && temp.indexOf(disease.code) == -1)) {
      temp = temp == null ? [] : temp;
      temp.push(disease.code);
      this.setState({
        disease_codes: temp,
        isShowDiseaseList: false,
      });
    } else {
      window.sessionStorage.setItem(
        "alert_messages",
        "すでに追加した病名です。"
      );
      this.closeModal();
    }
  };

  selectHistory = (number) => {
    if (number == this.state.selected_history_number) return;
    if (this.state.change_flag == 1) {
      // if data changed
      this.setState({
        selected_history_number: number,
        isChangeHistoryConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して閉じますか？",
      });
      return;
    }
    this.setState({
      selected_history_number: number,
      save_action:'register'
    },async() => {
      await this.handleSelectHistory(number);
      if (this.props.showTitle != undefined && this.props.showTitle != null){
        this.props.showTitle('');
      }
    });
  };

  editMedicalHistory = (number) => {
    if (this.state.change_flag == 1) {
      // if data changed
      this.setState({
        selected_history_number: number,
        isChangeHistoryConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して閉じますか？",
      });
      return;
    }
    this.setState({
      selected_history_number:number,
      save_action:'edit'
    },async() => {
      await this.handleSelectHistory(number);
      if (this.props.showTitle != undefined && this.props.showTitle != null){
        this.props.showTitle('(編集中)');
      }
    })
  }

  handleSelectHistory =async(number) => {
    let disease_history_data = this.state.disease_history_data;
    let disease_codes_list = this.state.disease_codes_list;
    if (this.props.from_source == "bedside") {
      this.setState({
        change_flag: 0,
        instruction_doctor_number: disease_history_data[number]["doctor_number"],
        directer_name: this.state.doctor_list_by_number[disease_history_data[number]["doctor_number"]],
        past_history: disease_history_data[number][0].past_history,
        disease_history: disease_history_data[number][0].disease_history,
        write_date: disease_history_data[number]["date"],
        disease_codes: disease_codes_list[number],
        is_loaded: true
      });
    } else {
      let state_data = {
        change_flag: 0,
        instruction_doctor_number: disease_history_data[number]["doctor_number"],
        directer_name: this.state.doctor_list_by_number[disease_history_data[number]["doctor_number"]],
        past_history: disease_history_data[number][0].past_history,
        disease_history: disease_history_data[number][0].disease_history,
        write_date: disease_history_data[number]["date"],
        disease_codes: disease_codes_list[number],
        is_loaded: true
      };
      if (this.state.save_action == "register") {
        let server_time = await getServerTime();
        state_data.write_date = new Date(server_time);
        state_data.instruction_doctor_number='';
        state_data.directer_name = '';
        if (this.context.selectedDoctor.code > 0) {
          state_data.instruction_doctor_number= parseInt(this.context.selectedDoctor.code);
          state_data.directer_name = this.context.selectedDoctor.name;
        }
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        if (authInfo.staff_category === 1 ) {
          state_data.instruction_doctor_number = authInfo.doctor_number;
          state_data.directer_name = authInfo.name;
        }
      }
      this.setState(state_data);
    }
  };

  confirmChangeHistory = () => {
    this.setState({
      isChangeHistoryConfirmModal: false,
      confirm_message: "",
    },async() => {
        await this.handleSelectHistory(this.state.selected_history_number);
    });
  };

  closeModal = () => {
    this.setState({
      isShowDoctorList: false,
      isShowDiseaseList: false,
      isOpenPrintPreview: false,
    });
  };

  handleCloseModal = () => {
    if (this.state.change_flag == 1) {
      // if data changed
      this.setState({
        isCloseConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して閉じますか？",
      });
      return;
    }
    this.props.closeModal();
  };

  async getDiseaseHistoryInfo(patient_id) {
    let path = "/app/api/v2/dial/medicine_information/getDiseaseHistory";
    const post_data = {
      patient_id: patient_id,
    };
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        if (Object.keys(res).length > 0) {
          var first_number = 0;
          var disease_history_data = res[Object.keys(res)[Object.keys(res).length-1]];
          var disease_codes_list = {};
          
          Object.keys(disease_history_data).map((key, index) => {
            var temp = disease_history_data[key];
            if (index == Object.keys(disease_history_data).length - 1) {
             first_number = temp[0].number;
            }
            var one_codes_list_array = [];
            temp.map((item) => {
              one_codes_list_array.push(item.disease_name_code);
            });
            disease_codes_list[key] = one_codes_list_array;
            disease_history_data[key]["date"] =
              // temp[Object.keys(temp)[Object.keys(temp).length-1]]["write_date"];
            temp[Object.keys(temp)[0]]["write_date"];
            disease_history_data[key]["doctor_number"] =
              // temp[Object.keys(temp)[Object.keys(temp).length-1]]["doctor_number"];
            temp[Object.keys(temp)[0]]["doctor_number"];
          });

          this.setState({
            disease_history_data,
            disease_codes_list,
          },async() => {
            if (first_number > 0){
              await this.selectHistory(first_number);
            } else {
              this.setState({is_loaded: true});
            }
          });
        } else {
          this.setState({is_loaded: true});
        }
      })
      .catch(() => {});
  }

  handleInsert = async () => {
    let flag = true;
    if (this.openModalTime != null && new Date().getTime() - this.openModalTime < 1000){
      return;
    }
    if (this.props.patientInfo == undefined || this.props.patientInfo == null) {
      flag = false;
      return;
    }
    if (this.state.instruction_doctor_number === "") {
      flag = false;
      return;
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (
      authInfo.doctor_number > 0 &&
      this.state.directer_name !== authInfo.name
    ) {
      flag = false;
      return;
    }
    if (this.state.disease_codes != null && this.state.disease_codes.length === 0) {
      flag = false;
      return;
    }
    if (this.state.change_flag == 0) {
      flag = false;
      return;
    }

    if (flag) {
      let path = "/app/api/v2/dial/medicine_information/registerDiseaseHistory";
      let input_data = {
        number: this.state.selected_history_number,
        patient_id: this.props.patientInfo.system_patient_id,
        doctor_number: this.state.instruction_doctor_number,
        past_history: this.state.past_history,
        disease_history: this.state.disease_history,
        write_date: formatDateLine(this.state.write_date),
        disease_codes: this.state.disease_codes,
      };
      if (this.state.save_action == 'register') {
        input_data.number = '';
      }

      if (this.double_click == true) return;
      this.double_click = true;
      await apiClient
        .post(path, {
          params: input_data,
        })
        .then(async(res) => {
          await this.initializeInfo(this.props.patientInfo.system_patient_id);
          if (this.props.type === "modal") {
            this.props.handleOk();
          }
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        })
        .catch(() => {})
        .finally(() => {
          this.double_click = false;
        });
    }
    this.openModalTime = new Date().getTime();
    this.double_click = false;
    this.setState({ isUpdateConfirmModal: false });
    this.setChangeFlag(0);
  };

  getDate = (value) => {
    this.setState(
      {
        write_date: value,
      },
      () => {
        this.setChangeFlag(1);
      }
    );
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isChangeHistoryConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
    });
  }

  update = () => {
    let flag = true;
    if (this.openModalTime != null && new Date().getTime() - this.openModalTime < 1000){
      return;
    }
    if (this.props.patientInfo == undefined || this.props.patientInfo == null) {
      flag = false;
      return;
    }
    if (this.state.change_flag == 0) {
      flag = false;
      return;
    }
    let validate_data = medicalInformationValidate("medical_history_body", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
        this.setState({
          check_message:validate_data['error_str_arr'].join('\n'),
          first_tag_id:validate_data['first_tag_id']
        });
        return;
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (
      authInfo.doctor_number > 0 &&
      this.state.directer_name !== authInfo.name
    ) {
      flag = false;
      return;
    }
    if (flag){
      let confirm_message =
        this.state.selected_history_number !== 0 && this.state.save_action == "edit"
          ? "病歴情報を変更しますか?"
          : "病歴情報を登録しますか?";
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message,
      });
    }
  };

  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }

  delete = () => {
    if (this.state.selected_history_number !== 0) {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: "履歴情報を削除しますか?",
      });
    }
  };

  deleteItem = (code) => {
    var temp = this.state.disease_codes;
    var index = temp.indexOf(code);
    temp.splice(index, 1);
    this.setState({ disease_codes: temp });
  };

  openPrintPreview = () => {
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      return;
    }
    if (!(this.state.selected_history_number>0)) return;
    this.setState({
      isOpenPrintPreview: true,
    });
  };

  setChangeFlag = (change_flag) => {
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "medical_history", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };

  confirmCloseModal = () => {
    this.setState(
      {
        isCloseConfirmModal: false,
        confirm_message: "",
      },
      () => {
        this.props.closeModal();
      }
    );
  };

  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let preview_tooltip = "";
    if (this.props.patientInfo == undefined && this.props.patientInfo == null) {
      preview_tooltip = "患者様を選択してください。";
    } else if (this.state.change_flag){
      preview_tooltip = "データを保存してください。";
    } else if (!(this.state.selected_history_number>0)) {
      preview_tooltip = "履歴を選択してください。";
    }
    let register_tooltip = "";
    if (this.props.patientInfo == undefined || this.props.patientInfo == null) {
      register_tooltip = "患者様を選択してください。";
    } else if (this.state.instruction_doctor_number === '') {
      register_tooltip = "医師名を選択してください。";
    } else if (
      authInfo.doctor_number > 0 &&
      this.state.directer_name !== authInfo.name
    ) {
      register_tooltip = "医師名を正確に選択してください。";
    } else if (this.state.disease_codes == null || (this.state.disease_codes != null && this.state.disease_codes.length === 0)) {
      register_tooltip = "病名を入力してください。";
    } else if (this.state.change_flag == 0) {
      register_tooltip = "変更した内容がありません。";
    }
    let { disease_codes, disease_history_data } = this.state;
    return (
      <>
        <Wrapper>
          {this.state.is_loaded ? (
            <div className={"flex " + (this.props.from_source === 'bedside' ? "bed-side-content" : "content")}>
              <div className="left-area">
                <div className="history-header">
                  {authInfo !== undefined && authInfo != null && authInfo.doctor_number > 0 && this.state.selected_history_number === 0 ? (
                    <div className={"header-item " + (this.props.from_source === 'bedside' ? '' : 'clickable')} style={{marginLeft: 10}}>
                      <InputWithLabelBorder
                        label="医師名"
                        type="text"
                        id='directer_name_id'
                        diseaseEditData={this.state.directer_name}
                        isDisabled = {this.props.from_source == 'bedside' ? true: false}
                      />
                    </div>
                  ) : (
                    <div className={"header-item " + (this.props.from_source === 'bedside' ? '' : 'clickable')} onClick={(e)=>this.showDoctorList(e).bind(this)} style={{marginLeft: 10}}>
                      <InputWithLabelBorder
                        label="医師名"
                        type="text"
                        id='directer_name_id'
                        diseaseEditData={this.state.directer_name}
                        isDisabled = {this.props.from_source == 'bedside' ? true: false}
                      />
                    </div>
                  )}
                  <div className="header-item">
                    <div className={"flex"}>
                      <div className={"label-cur-date"}>作成日</div>
                      <InputWithLabelBorder
                        type="date"
                        id='write_date_id'
                        getInputText={this.getDate.bind(this)}
                        diseaseEditData={this.state.write_date != '' ? new Date(this.state.write_date) : ''}
                        isDisabled = {this.props.from_source == 'bedside' ? true: false}
                      />
                    </div>
                  </div>
                </div>
                <div className="main-info">
                  <div className="div-style1">
                    <div className="label-type1">病名</div>
                    {this.props.from_source != 'bedside' && (
                      <>
                      <div className="label-type2" onClick={this.showDiseaseModal.bind(this)}>
                        <Icon icon={faPlus} />
                        病名を追加
                      </div>
                      </>
                    )}
                  </div>
                  <div className="disease-name" id='disease_codes_id'>
                    {disease_codes !== undefined &&
                      disease_codes != null &&
                      disease_codes.length > 0 &&
                      disease_codes.map((code) => {
                        return (
                          <div key={code} className="disease">
                            {this.props.from_source != 'bedside' && (
                              <span className="delete_icon" onClick={this.deleteItem.bind(this, code)}>
                                <Icon icon={faMinusCircle} />
                              </span>
                            )}
                            {this.state.disease_list != undefined && this.state.disease_list[code] != undefined ? this.state.disease_list[code] : ""}
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="div-style1">
                  <div className="label-type1">既往歴</div>
                </div>
                <div className="disease-history">
                  <textarea
                    readOnly={this.props.from_source == 'bedside' ? true: false}
                    onChange={this.setPastHistory.bind(this)}
                    value={this.state.past_history}
                    id='past_history_id'
                  />
                </div>
                <div className="div-style1">
                  <div className="label-type1">現病歴</div>
                </div>
                <div className="disease-history">
                  <textarea
                    readOnly={this.props.from_source == 'bedside' ? true: false}
                    onChange={this.setDiseaseHistory.bind(this)}
                    value={this.state.disease_history}
                    id='disease_history_id'
                  />
                </div>
              </div>
              <div className="right-area">
                <div className={"flex"}>
                  <div className="area-name">履歴一覧</div>
                  {this.props.from_source != 'bedside' && (
                    <>
                    <div className="delete-history clickable" onClick={this.delete}>
                      <Icon icon={faTrash} />
                      選択した履歴を削除
                    </div>
                    </>
                  )}
                </div>
                <div className="table-view">
                  <table className="table-scroll table table-bordered table-hover" id='medical-history'>
                    <tbody>
                      {disease_history_data !== undefined &&
                        disease_history_data !== null &&
                        Object.keys(disease_history_data).map((key) => {
                          return (
                            <>
                              <tr
                                className={
                                  this.state.selected_history_number ===
                                  disease_history_data[key][0].number
                                    ? "history-item clickable selected"
                                    : "history-item clickable"
                                }
                                onClick={this.selectHistory.bind(
                                  this,
                                  disease_history_data[key][0].number
                                )}
                                onContextMenu={e => this.handleClick(e,disease_history_data[key][0].number)}
                              >
                                <td>
                                  {formatJapanDateSlash(
                                    disease_history_data[key].date
                                  )}
                                  {this.state.doctor_list_by_number !=
                                    undefined &&
                                  this.state.doctor_list_by_number != null
                                    ? this.state.doctor_list_by_number[
                                        disease_history_data[key].doctor_number
                                      ]
                                    : ""}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ):(
            <div className={(this.props.from_source === 'bedside' ? "bed-side-content" : "content")}>
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            </div>
          )}
          {this.props.type !== undefined && this.props.type != null && this.props.type === "modal" ? (
            <div className="footer-buttons modal-footer">
              <div onClick={this.handleCloseModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
                <span>{this.props.from_source == 'bedside'?'閉じる':'キャンセル'}</span>
              </div>
              {/* <Button className="cancel-btn" onClick={this.handleCloseModal}>閉じる</Button> */}
              {this.props.from_source !== 'bedside' && (
                <>
                  <Button onClick={this.openPrintPreview.bind(this)} className={preview_tooltip != "" ? "disable-btn" : "red-btn"} tooltip={preview_tooltip}>帳票プレビュー</Button>
                  <Button onClick={this.update} tooltip={register_tooltip} className={register_tooltip != '' ? "disable-btn" : "red-btn"}>{this.state.selected_history_number > 0 ? "変更" : "登録"}</Button>
                </>
              )}
            </div>
          ) : (
            <div className="footer footer-buttons">
              <Button
                onClick={this.openPrintPreview.bind(this)}
                className={preview_tooltip != "" ? "disable-btn" : "red-btn"}
                tooltip={preview_tooltip}
              >
                帳票プレビュー
              </Button>
              <Button
                onClick={this.update}
                tooltip={register_tooltip}
                className={register_tooltip != '' ? "disable-btn" : "red-btn"}
              >
                {this.state.selected_history_number > 0 && this.state.save_action == "edit" ? "変更" : "登録"}
              </Button>
            </div>
          )}
        </Wrapper>
        <ContextMenu
            {...this.state.contextMenu}
            parent={this}
        />
        {this.state.isShowDoctorList && (
          <DialSelectMasterModal
            selectMaster={this.selectDoctor}
            closeModal={this.closeModal}
            MasterCodeData={this.state.doctors}
            MasterName="医師"
          />
        )}
        {this.state.isShowDiseaseList && (
          <DialSelectMasterModal
            selectMaster={this.selectDisease}
            closeModal={this.closeModal}
            MasterCodeData={this.state.diseaseData}
            MasterName="病名"
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
        {this.state.isChangeHistoryConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmChangeHistory}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isCloseConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmCloseModal}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenPrintPreview == true && (
          <DiseaseHistoryPrintPreviewModal
            closeModal={this.closeModal}
            patientInfo={this.props.patientInfo}
            doctor_name={this.state.directer_name}
            past_history={this.state.past_history}
            disease_history={this.state.disease_history}
            write_date={formatDateLine(this.state.write_date)}
            disease_codes={this.state.disease_codes}
            disease_list={this.state.disease_list}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </>
    );
  }
}

MedicalHistoryBody.contextType = Context;

MedicalHistoryBody.propTypes = {
  patientInfo: PropTypes.array,
  type: PropTypes.string,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  from_source:PropTypes.string,
  showTitle:PropTypes.func
};

export default MedicalHistoryBody;
