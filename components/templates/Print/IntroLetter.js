import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import { formatDateLine, formatJapanDateSlash } from "~/helpers/date";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DialSideBar from "../Dial/DialSideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import DialPatientNav from "../Dial/DialPatientNav";
import IntroLetterPreviewModal from "./IntroLetterPreviewModal";
import axios from "axios/index";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SetRegularTextModal from "~/components/templates/Print/SetRegularTextModal";
import Context from "~/helpers/configureStore";
import * as sessApi from "~/helpers/cacheSession-utils";
import {addRequiredBg,removeRequiredBg,removeRedBorder} from '~/helpers/dialConstants';
import { printValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import TextareaAutosize from 'react-textarea-autosize';
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";
import ChangeMedicalInfoDocLogModal from "~/components/templates/Dial/modals/ChangeMedicalInfoDocLogModal";
import Checkbox from "~/components/molecules/Checkbox";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;


const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 5px;
`;

const Card = styled.div`
  position: relative;  
  margin: 0px;
  top: 70px;
  float: left;
  width: calc(100% - 390px);
  left: 200px;
  height: 100%;
  position: fixed;
  background-color: ${surface};
  padding: 20px;
  .footer {
    margin-top: 20px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    span {
      color: white;
      font-size: 24px;
      font-weight: 100;
    }
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const Wrapper = styled.div`
  width: 100%;  
  height: calc(100% - 13rem);
  font-size: 1rem;
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }

  .justify-content-style{
    justify-content: flex-end;
    label{
      font-size: 1rem;
    }
  }
  .content {
    margin-top: 10px;
    overflow: hidden;
    overflow-y: scroll;
    height: 100%;
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
    width: 6rem;
    margin-right: 0.5rem;
    .label-type1 {
      font-size: 1rem;
      text-align: right;
      width: 100%;
      float: left;
    }
    .label-type2 {
      font-size: 1rem;
      float: right;
      cursor: pointer;
    }
  }
  .div-style2 {
    display: block;
    overflow-y: auto;
    width: 11rem;
    margin-right: 0px;
    padding: 0;
    margin-top: 0px;
    button {
      margin-left: 0.5rem;
      margin-bottom: 0.5rem;
      min-width: 7rem;
    }
  }

  .left-area {
    width: 70%!important;
    float: left;
    height: 100%;
    .main-info {
      display: flex;
      margin-bottom: 0.5rem;
    }
    .label-cur-date {
      text-align: left;
      width: 60px;
      font-size: 1rem;
      margin-top: 14px;
    }
    .cur-date {
      width: 64%;
      height: 35px;
      border-radius: 4px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      margin-top: 8px;
      padding: 0px 8px;
      line-height: 35px;
    }
    .main-info .disease-name {
      height: 80%;
      overflow: hidden;
      border: 1px solid #ddd;
      p {
        margin: 0;
        text-align: center;
        font-size: 1rem;
      }
    }
    .disease-name {
      height: 80%;
      border: 1px solid #ddd;
      .history-title {
        font-size: 1rem;
      }
      .flex div {
        width: 50%;
      }
      .history-delete {
        cursor: pointer;
      }
    }
    .disease-history {
      width: calc(100% - 18rem) !important;
      font-size: 1rem;
      textarea {
        width: 100%;
        overflow: hidden;
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
        padding-left: 10px;
        border-radius: 4px;
      }
    }
  }
  .right-area {
    width: 28%;
    float:right;
    min-width:20rem;
    padding-left: 1rem;
    padding-right: 0.5rem;
    .area-name {
      font-size: 1rem;
      width: 6rem;;
    }
    .delete-history {
      width: calc(100% - 6rem);
      font-size:1rem;
      text-align:right;
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
    padding-top: 20px;
  }
  .pt-10 {
    padding-top: 10px;
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
  .selected {
    background: lightblue;
  }
  .table-view {
    border: 1px solid #ddd;
    overflow-y: auto;
    min-height: calc(100vh - 20rem);
    width:100%;
  }

  .history-item {
    padding: 5px;
    p {margin:0;}
  }

  .delete-record{
    color: red;
  }

  .history-date{
    display: flex;
    justify-content:space-between;
  }

  .history-item:hover {
    background:rgb(242, 242, 242) !important;
  }

  .history-header {
    overflow: hidden;
    display: flex;
    margin-bottom: 20px;
    width:100%;
  }

  .header-item {
    width: 60%;    
    .label-title {
      width: 6rem;
      text-align: right;
      font-size: 1rem;
      margin: 0;
      margin-right: 0.5rem;
      line-height: 2rem;
    }   
    .pullbox-label {
      width: 20rem;
      select {
        width: 100%;
        height: 2rem;
        font-size: 1rem;
      }
    }
    .div-foot {
      overflow: hidden;
      width: 100%;
      .pullbox {
        width: calc(100% - 4rem);
      }
      .unit {
        text-align: center;
        width: 4rem;
        line-height: 2rem;
      }
    }
    label {
      text-align: right;
      font-size: 1rem;
      margin-bottom: 0;
    }
    input {
      width: 80%;
      float: left;
      height: 2rem;
      border-radius: 4px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      padding: 0px 8px;
    }
    button {
      margin-left: 10px;
      margin-top: 8px;
      background-color: #f3f3f3;
    }
  }

  .header-item-right {
    width: 40%;
    div {margin-top:0;}
    .react-datepicker-wrapper {
      width: calc(100% - 1rem);
      input {width: 100%;}
    }
    .direct_man input {width:calc(100% - 1rem);}
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

const ContextMenu = ({visible,x,y,parent,item}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                  {item.is_enabled != 2 && (
                    <li><div onClick={() =>parent.contextMenuAction("edit", item)}>変更</div></li>                  
                  )}
                  <li><div onClick={() =>parent.contextMenuAction("history", item)}>変更履歴</div></li>                            
              </ul>
          </ContextMenuUl>
      );
  } else { return null; }
};


const init_other_facilities_department_datas = [{ id: 0, value: "" }];

const init_other_facilities_doctors = [{ id: 0, value: "" }];

const init_other_facilities = [{ id: 0, value: "" }];

class IntroLetter extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );

    this.state = {
      patient_id: 0,
      past_history: "",
      disease_history: "",
      isShowDiseaseList: false,
      isDeleteConfirmModal: false,
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      isLoaded: false,
      tmpData: null,
      doctor_number: 0,
      disease_codes: [],
      write_date: new Date(),
      selected_history_number: 0,
      confirm_message: "",
      other_facilities_data: [],
      other_facilities_department_datas: init_other_facilities_department_datas,
      other_facilities_doctors: init_other_facilities_doctors,
      greeting: "",
      diagnostic: "",
      note: "",
      facilityName: "",
      department: "",
      ownDoctor: "",
      doctorName: "",
      patientInfo: "",
      other_facility_number: "",
      other_facility_name: "",
      other_facilities_department: "",
      other_facilities_department_name: "",
      other_facilities_doctor: "",
      other_facilities_doctor_name: "",
      isOpenPreviewModal: false,
      select_data: "",
      facility_data: [],
      isShowDoctorList: false,
      disease_history_data: [],
      greeting_list: [],
      soap_list: [],
      openEditRegularTextModal: false,
      instruction_doctor_number: 0,
      change_flag: 0,
      alert_message: "",
      historyIntroLetterModal: false,
      show_delete_record: 0,
    };
    this.regularTextData = [];
    this.diagnosis_list = [
      {
        number: 1,
        title: "病名取得",
      },
    ];
    this.original = "";
    this.greeting_min_row = 3;
    this.diagnostic_min_row = 3;
    this.note_min_row = 3;
  }

  async componentDidMount() {
    this.setChangeFlag(0);
    await this.getDoctors();
    await this.getDiseases();
    await this.getOtherFacilitiesOrder();
    await this.getOtherFacilitiesDepartmentDatas();
    await this.getOtherFacilitiesDoctors();
    await this.getRegularText();

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var instruction_doctor_number = "";
    if (
      authInfo != undefined &&
      authInfo != null &&
      authInfo.doctor_number > 0
    ) {
      instruction_doctor_number = authInfo.doctor_number;
    }
    if (this.context.selectedDoctor.code > 0) {
      instruction_doctor_number = parseInt(this.context.selectedDoctor.code);
    }
    this.setState({ 
      instruction_doctor_number,
      isLoaded: true
    });
    this.original = JSON.stringify(this.state);
    this.changeBackground();
    this.forceUpdate();
  }

  componentDidUpdate () {
    this.changeBackground();
  }
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');
  }

  setChangeFlag=(change_flag)=>{
    this.setState({change_flag});
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'complications_inspection_data', 1)
    } else {
      sessApi.remove('dial_change_flag');
    }
  };

  async getMedicalDocInfo() {
    let path = "/app/api/v2/dial/print/getData";
    const post_data = {
      system_patient_id: this.state.patientInfo.system_patient_id,
      document_name: "紹介状",
      write_date: formatDateLine(this.state.write_date),
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res.length > 0) {
          this.setState({
            disease_history_data: res[0],
            facility_data: res[1],
          });
        } else {
          this.setState({
            disease_history_data: [],
            facility_data: [],
          });
        }
      })
      .catch(() => {});
  }

  getOtherFacilityName = (e) => {
    this.setChangeFlag(1);
    this.setState({
      other_facility_number: parseInt(e.target.id),
    });
  };

  getOtherFacilitiesOrder = async () => {
    let { data } = await axios.post(
      "/app/api/v2/dial/master/getOtherFacilitiesOrder",{ params:{order:'sort_number'} }
    );

    let other_facilities = init_other_facilities;
    data.map((item, index) => {
      let department_info = { id: item.number, value: item.name };
      other_facilities[index + 1] = department_info;
    });
    this.setState({
      otherFacilitiesData: other_facilities,
    });
  }


  getOtherFacilitiesDepartmentDatas = async (other_facility_number) => {
    let path = "/app/api/v2/dial/master/other_facilities_department_search";
    let post_data = {
      other_facilities_number: other_facility_number,
      is_enabled: 1,
      order:'sort_number'
    };
    let { data } = await axios.post(path, { params: post_data });
    let department_datas = init_other_facilities_department_datas;
    data.map((item, index) => {
      let department_info = { id: item.number, value: item.name };
      department_datas[index + 1] = department_info;
    });
    this.setState({
      other_facilities_department_datas: department_datas,
    });
  };

  getOtherFacilitiesDepartment = (e) => {
    this.setChangeFlag(1);
    this.setState({
      other_facilities_department: parseInt(e.target.id),
    });
  };

  getOtherFacilitiesDoctors = async (
    other_facility_number,
    other_facilities_department
  ) => {
    let path = "/app/api/v2/dial/master/other_facilities_doctor_search";
    let post_data = {
      other_facilities_number: other_facility_number,
      other_facilities_department_number: other_facilities_department,
      is_enabled: 1,
      order:'sort_number'
    };
    let { data } = await axios.post(path, { params: post_data });
    let doctor_datas = [{ id: 0, value: "" }];

    data.map((item, index) => {
      let doctor_info = { id: item.number, value: item.name };
      doctor_datas[index + 1] = doctor_info;
    });
    this.setState({ other_facilities_doctors: doctor_datas });
  };

  getRegularText = async () => {
    let path = "/app/api/v2/dial/master/regular_text";
    let post_data = {
      page_name: "紹介状",
    };
    let { data } = await axios.post(path, { params: post_data });
    let greeting_list = [];
    let soap_list = [];
    if (data) {
      this.regularTextData = data;
      greeting_list = data.filter((item) => {
        if (item.label == "あいさつ文") {
          return item;
        }
      });
      soap_list = data.filter((item) => {
        if (item.label == "＜記＞") {
          return item;
        }
      });
      if(soap_list.length > 2){
        this.note_min_row = 7;
      }
      this.setState({
        greeting_list,
        soap_list,
      });
    }
  };

  getOtherFacilitiesDoctor = (e) => {
    this.setChangeFlag(1);
    this.setState({
      other_facilities_doctor: parseInt(e.target.id),
      other_facilities_doctor_name: e.target.value,
    });
  };

  deleteHistory = async () => {
    this.setChangeFlag(0);
    let path = "/app/api/v2/dial/print/deleteData";
    const post_data = {
      number: this.state.selected_number,
      system_patient_id: this.state.patientInfo.system_patient_id,
      delete_type:"intro_letter"
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.selectPatient(this.state.patientInfo);
      })
      .catch(() => {});

    this.setState({ isDeleteConfirmModal: false });
  };

  setGreeting = (e) => {
    this.setChangeFlag(1);
    this.setState({ greeting: e.target.value });
  };

  setDiagnostic = (e) => {
    this.setChangeFlag(1);
    this.setState({ diagnostic: e.target.value });
  };

  setNote = (e) => {
    this.setChangeFlag(1);
    this.setState({ note: e.target.value });
  };

  selectPatient = (patientInfo) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var instruction_doctor_number = "";
    if (
      authInfo != undefined &&
      authInfo != null &&
      authInfo.doctor_number > 0
    ) {
      instruction_doctor_number = authInfo.doctor_number;
    }
    if (this.context.selectedDoctor.code > 0) {
      instruction_doctor_number = parseInt(this.context.selectedDoctor.code);
    }
    this.setState(
      {
        patientInfo: patientInfo,
        number: "",
        other_facility_number: "",
        other_facilities_department: "",
        other_facilities_doctor: "",
        write_date: new Date(),
        disease_name: "",
        introduction_purpose: "",
        family_history: "",
        inspection_result: "",
        course_treatment: "",
        cur_prescription: "",
        remark: "",
        greeting: "",
        diagnostic: "",
        note: "",
        select_data: "",
        other_facilities_data: [],
        instruction_doctor_number,
        disease_history_data: [],
      },
      () => {
        this.getMedicalDocInfo();
      }
    );
    this.setChangeFlag(0);
  };

  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e.target.type == undefined || e.target.type != "text") return;

    this.setState({
      isShowDoctorList: true,
    });
  };

  selectDoctor = (doctor) => {
    this.setChangeFlag(1);
    this.setState({
      instruction_doctor_number: doctor.number,
    });
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (
      authInfo != undefined &&
      authInfo != null &&
      !(authInfo.doctor_number > 0)
    ) {
      this.context.$updateDoctor(doctor.number, doctor.name);
    }
    this.closeModal();
  };

  selectHistory = (data, _type=null) => {
    // **********  _type=null  ********** //
    //診療情報提供書・紹介状の保存動作の調整
    // ・右側の一覧からクリックで選んだ時は、編集ではなく新規保存にする。（Do処方のようなもの）
    // ・編集は、右側の一覧の右クリックに「編集」を作る。
    // ・編集中は「診療情報提供書」などの見出しの右に、履歴一覧見出しと同じフォントサイズで(編集中)と表示する。
    // **********  _type=null  ********** //

     if (_type == "add") {
      if (this.state.change_flag == 1) {
        this.setState({
          isAdd: true,
          isOpenConfirmModal: true,
          tmpData: data,        
          confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？",
        });
        return;
      }
      this.handleSelectHistory(data, "add");
    } else {      
    if (data.number == this.state.number) return;
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        tmpData: data,
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }
    this.handleSelectHistory(data);
    }    
  };

  handleSelectHistory = (data, _type=null) => {
    this.setChangeFlag(0);
    this.clearRedStyle();
    this.getOtherFacilitiesOrder();
    // this.getOtherFacilitiesDepartmentDatas(data.other_facilities_number);
    // this.getOtherFacilitiesDoctors(data.other_facilities_number, data.other_facilities_department_number);
    let greeting = "";
    let diagnostic = "";
    let note = "";

    data.item.map((item) => {
      if (item.form_name === "あいさつ文") {
        greeting = item.body;
      }
      if (item.form_name === "診断") {
        diagnostic = item.body;
      }
      if (item.form_name === "＜記＞") {
        note = item.body;
      }
    });
    let _state={
      select_data: data,
      number: data.number,
      selected_number: data.number,
      other_facility_number: data.other_facilities_number,
      other_facilities_department: data.other_facilities_department_number,
      other_facilities_doctor: data.other_facilities_doctor_number,
      write_date: new Date(data.write_date),
      greeting,
      diagnostic,
      note,
      tmpData: null,
      instruction_doctor_number: data.instruction_doctor_number,
      doctor_name: this.state.doctor_list_by_number[
        data.instruction_doctor_number
      ]
    };
    
    if (_type == "add") {
      _state.number = "";
      _state.instruction_doctor_number=''
      _state.directer_name = '';
      _state.write_date = new Date();
      if (this.context.selectedDoctor.code > 0) {
        _state.instruction_doctor_number= parseInt(this.context.selectedDoctor.code);
        _state.directer_name = this.context.selectedDoctor.name;
      }
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category === 1 ) {
        _state.instruction_doctor_number = authInfo.doctor_number;
        _state.doctor_name = authInfo.name;
      }
    }

    this.setState(_state, () => {
      this.original = JSON.stringify(this.state);
    });
  };

  closeModal = (act = null) => {
    this.setState({
      isOpenPreviewModal: false,
      isShowDoctorList: false,
      historyIntroLetterModal: false,
      openEditRegularTextModal: false,
    },() => {
      if (act === "edit_regular") {
        this.getRegularText();
      }
    });
  };

  getDate = (value) => {
    this.setChangeFlag(1);
    this.setState({
      write_date: value,
    });
  };

  openPreviewModal = () => {
    if (this.state.patientInfo === "") {
      return;
    }
    if (this.state.select_data === "") {
      return;
    }
    this.setState({
      isOpenPreviewModal: true,
    });
  };

  handlePrint = () => {
    this.setState({
      isOpenPreviewModal: true,
    });
  };

  handleUpdateConfirm = async () => {

    let path = "/app/api/v2/dial/print/registerIntroData";
    let input_data = {
      number: this.state.number,
      system_patient_id: this.state.patientInfo.system_patient_id,
      document_name: "紹介状",
      write_date: formatDateLine(this.state.write_date),
      other_facilities_number: this.state.other_facility_number,
      other_facility_name: this.state.other_facility_name,
      other_facilities_department_number: this.state
        .other_facilities_department,
      other_facilities_department_name: this.state
        .other_facilities_department_name,
      other_facilities_doctor_number: this.state.other_facilities_doctor,
      other_facilities_doctor_name: this.state.other_facilities_doctor_name,
      greeting: this.state.greeting,
      diagnostic: this.state.diagnostic,
      note: this.state.note,
      instruction_doctor_number: this.state.instruction_doctor_number,
    };
    await apiClient
      ._post(path, {
        params: input_data,
      })
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages", res.alert_message);
          this.selectPatient(this.state.patientInfo);
        }
      })
      .catch(() => {});

    this.setState({
      isUpdateConfirmModal: false,
      confirm_message: "",
    });
  };

  register = () => {
    if (this.state.patientInfo === "") {
      return;
    }
    if (this.state.instruction_doctor_number == 0) {
      return;
    }
    if (this.original == JSON.stringify(this.state)) {
      return;
    }

    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }

    if (this.state.number) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "登録しますか?",
      });
    }
  };

  delete = () => {
    if (this.state.selected_number > 0) {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: "履歴情報を削除しますか?",
      });
    }
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
    });
  }

  addText = (item) => {
    this.setChangeFlag(1);
    if (item.label == "あいさつ文") {
      this.setState({greeting:this.state.greeting == "" ? item.body : this.state.greeting + "\n" + item.body});
    } else if (item.label == "＜記＞") {
      this.setState({note:this.state.note == "" ? item.body : this.state.note + "\n" + item.body});
    }
  };

  openEditRegularTextModal = () => {
    if (this.regularTextData.length > 0) {
      this.setState({ openEditRegularTextModal: true });
    }
  };

  getFacilitiesName = () => {
    let result = "";
    if (
      this.state.select_data != null &&
      this.state.select_data != undefined &&
      this.state.otherFacilitiesData != undefined &&
      this.state.otherFacilitiesData != null &&
      this.state.select_data.other_facilities_number != null &&
      this.state.select_data.other_facilities_number != undefined
    ) {
      this.state.otherFacilitiesData.map((item) => {
        if (item.id == this.state.select_data.other_facilities_number) {
          result = item.value;
        }
      });
    }
    return result;
  };

  getItemTitle = (item) => {
    let html = [];
    let facility_name = this.getFacilitiesNameFromHistory(
      item.other_facilities_number
    );
    if(facility_name !== undefined && facility_name != null && facility_name != ""){
      html.push(<p>{facility_name}</p>);
    }
    let department_name = this.getFacilitiesDepartmentFromHistory(
      item.other_facilities_department_number
    );
    if(department_name !== undefined && department_name != null && department_name != ""){
      html.push(<p>{department_name}</p>);
    }
    let doctor_name = this.getFacilitiesDoctorFromHistory(
      item.other_facilities_doctor_number
    );
    if(doctor_name !== undefined && doctor_name != null && doctor_name != ""){
      html.push(<p>{doctor_name}</p>);
    }
    return html;
  };

  getFacilitiesNameFromHistory = (ele) => {
    if (
      this.state.otherFacilitiesData == undefined ||
      this.state.otherFacilitiesData == null
    )
      return "";
    if (ele == undefined || ele == null) return "";
    let result = "";

    this.state.otherFacilitiesData.map((item) => {
      if (item.id == ele) {
        result = item.value;
      }
    });
    return result;
  };

  getFacilitiesDepartmentFromHistory = (ele) => {
    if (
      this.state.other_facilities_department_datas == undefined ||
      this.state.other_facilities_department_datas == null
    )
      return "";
    if (ele == undefined || ele == null) return "";
    let result = "";

    this.state.other_facilities_department_datas.map((item) => {
      if (item.id == ele) {
        result = item.value;
      }
    });
    return result;
  };

  getFacilitiesDoctorFromHistory = (ele) => {
    if (
      this.state.other_facilities_doctors == undefined ||
      this.state.other_facilities_doctors == null
    )
      return "";
    if (ele == undefined || ele == null) return "";
    let result = "";

    this.state.other_facilities_doctors.map((item) => {
      if (item.id == ele) {
        result = item.value;
      }
    });
    return result + "　" + "御侍史";
  };

  confirmCloseOk = () => {
    let isAdd = JSON.parse(JSON.stringify(this.state.isAdd));
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: "",
      isAdd: false,
    },()=>{
      if (isAdd == true) { // add
        this.handleSelectHistory(this.state.tmpData, "add");
      } else {
      this.handleSelectHistory(this.state.tmpData);
      }      
    });
  }

  changeBackground = () => {
    if (this.state.other_facility_number == "" || this.state.other_facility_number == null || this.state.other_facility_number == undefined || this.state.other_facility_number == 0) {
      addRequiredBg("other_facility_number_id");
    } else {
      removeRequiredBg("other_facility_number_id");
    }
  }

  clearRedStyle = () => {
    removeRedBorder('other_facility_number_id');
    removeRedBorder('other_facilities_department_id');
    removeRedBorder('other_facilities_doctor_id');
    removeRedBorder('greeting_id');
    removeRedBorder('diagnostic_id');
    removeRedBorder('note_id');
  }

  checkValidation = () => {
    this.clearRedStyle();

    let error_str_arr = [];
    let validate_data = printValidate('dial_input_weight', this.state);
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

  handleClick = (e, item) => {
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
          .getElementById("medical-info-table")
          .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                  contextMenu: { visible: false }
              });
              document
                  .getElementById("medical-info-table")
                  .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
          contextMenu: {
              visible: true,
              x: e.clientX - 200,
              y: e.clientY - 70,
              item: item,              
          },
      });
    }
  };

  contextMenuAction = (act, item) => {
    if( act === "edit") {
        this.editData(item);
    } else if(act == "history") {
      this.showHistory(item);
    }
  };

  editData = (item) => {          
    this.selectHistory(item);  
  };

  showHistory = (_item) => {      
    this.getHistoryMedicalInfoDoc({
      number: _item.number,
      id: this.state.patientInfo.system_patient_id,
      arrNumbers: _item.history,
      item: _item
    });
  };

  getHistoryMedicalInfoDoc = async (params) => {
    const { data } = await axios.post("/app/api/v2/dial/find/history", {
      params: {
        patient_id: params.id,
        limit: 1000,
        offset: 0,
        type: "intro_letter",
        numbers: params.arrNumbers,
      }
    });
    // var resultData = Object.keys(data).map(i=>data[i]);
    var resultData = data;
    if(data.length < 1) {
      resultData = [];
      resultData.push(params.item);
    }

    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyIntroLetterModal: true,
      selectedOrderNumber: params.number,
      historyList: result
    });
  };

  getRadio = (name, value) => {
    if(name==="check"){
      this.setState({show_delete_record: value})
    }
  };

  getDiseaseName =async()=> {
    if (this.state.patientInfo == undefined || this.state.patientInfo == null || this.state.patientInfo == "") {
      window.sessionStorage.setItem("alert_messages","患者様を選択してください。");
      return;
    }
    let path = "/app/api/v2/dial/medicine_information/get_recently_disease_name";
    let post_data = {
      patient_id: this.state.patientInfo.system_patient_id,
      type:"disease_name"
    };
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        let diagnostic = this.state.diagnostic;
        if(res.length > 0){
          res.map((item, index)=>{
            diagnostic = diagnostic == "" ? ((index + 1 + ".") + item.name) : (diagnostic + "\n" + (index + 1 + ".") + item.name);
          })
        }
        this.setState({diagnostic});
      })
      .catch(() => {});
  };

  render() {
    let register_tooltip = "";
    if (this.state.patientInfo === "") {
      register_tooltip = "患者様を選択してください。";
    } else if (this.state.other_facility_number < 1) {
      register_tooltip = "医療機関名を選択してください。";
    } else if (this.state.instruction_doctor_number == 0) {
      register_tooltip = "医師名を選択してください。";
    } else if (this.original == JSON.stringify(this.state)) {
      register_tooltip = "変更した内容がありません。";
    }
    let preview_tooltip = "";
    if (this.state.patientInfo === "") {
      preview_tooltip = "患者様を選択してください。";
    } else if (this.state.select_data === "") {
      preview_tooltip = "履歴を選択してください。";
    } else if (this.state.change_flag){
      preview_tooltip = "データを保存してください。";
    }
    let {
      disease_history_data,
      otherFacilitiesData,
      other_facilities_department_datas,
      other_facilities_doctors,
    } = this.state;
    let facility_name = this.getFacilitiesName();
    let instruction_doctor_number_val = "";
    if (
      this.state.instruction_doctor_number > 0 &&
      this.state.doctor_list_by_number != null &&
      this.state.doctor_list_by_number != undefined
    ) {
      instruction_doctor_number_val = this.state.doctor_list_by_number[
        this.state.instruction_doctor_number
        ];
    }

    return (
      <>
        <DialSideBar
         onGoto={this.selectPatient}
         history = {this.props.history}
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo}
          history = {this.props.history}
        />
        <Card>
          <Wrapper>
            <div className="title">紹介状{this.state.number && "（編集中）" }</div>
            <div className="content">
              {this.state.isLoaded == false ? (
                  <div className='spinner-disease-loading center'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                </div>
              ):(
                <>                  
                  <div className="left-area">
                    <div className="history-header">
                      <div className="header-item">
                        <SelectorWithLabel
                          id="other_facility_number_id"
                          options={otherFacilitiesData}
                          title="医療機関名"
                          getSelect={this.getOtherFacilityName.bind(this)}
                          departmentEditCode={this.state.other_facility_number}
                        />
                        <div style={{marginTop:"0.5rem"}}>
                          <SelectorWithLabel
                            id="other_facilities_department_id"
                            title="診療科"
                            options={other_facilities_department_datas}
                            getSelect={this.getOtherFacilitiesDepartment}
                            departmentEditCode={this.state.other_facilities_department}
                          />
                        </div>
                        <div className="div-foot flex" style={{marginTop:"0.5rem"}}>
                          <SelectorWithLabel
                            id="other_facilities_doctor_id"
                            title="御担当医"
                            options={other_facilities_doctors}
                            getSelect={this.getOtherFacilitiesDoctor}
                            departmentEditCode={this.state.other_facilities_doctor}
                          />
                          <div className={"unit"}>御侍史</div>
                        </div>
                      </div>
                      <div className="header-item header-item-right">
                        <div className="direct_man remove-x-input cursor-input" onClick={(e)=>this.showDoctorList(e).bind(this)}>
                          <InputWithLabel
                            label="医師名"
                            type="text"
                            isDisabled={true}
                            placeholder="クリックして選択"
                            diseaseEditData={instruction_doctor_number_val}
                          />
                        </div>
                        <div style={{marginTop:"0.5rem"}}>
                          <InputWithLabel
                            label="作成日"
                            type="date"
                            getInputText={this.getDate.bind(this)}
                            diseaseEditData={this.state.write_date}
                          />
                        </div>
                      </div>
                    </div>                    
                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">あいさつ文</div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="greeting_id"
                          onChange={this.setGreeting.bind(this)}
                          value={this.state.greeting}
                          minRows={this.greeting_min_row}
                        />
                      </div>
                      <div className="div-style2">
                        {this.state.greeting_list.length > 0 &&
                        this.state.greeting_list.map((item) => {
                          return (
                            <>
                              <div><Button type="mono" onClick={this.addText.bind(this, item)}>{item.title}</Button></div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">診断</div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="diagnostic_id"
                          onChange={this.setDiagnostic.bind(this)}
                          value={this.state.diagnostic}
                          minRows={this.diagnostic_min_row}
                        />
                      </div>
                      <div className="div-style2">
                        <div><Button type="mono" onClick={this.getDiseaseName}>病名取得</Button></div>
                      </div>
                    </div>
                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">＜記＞</div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="note_id"
                          onChange={this.setNote.bind(this)}
                          value={this.state.note}
                          minRows={this.note_min_row}
                        />
                      </div>
                      <div className="div-style2">
                        {this.state.soap_list.length > 0 &&
                        this.state.soap_list.map((item) => {
                          return (
                            <>
                              <div><Button type="mono" onClick={this.addText.bind(this, item)}>{item.title}</Button></div>
                            </>
                          );
                        })}
                      </div>
                    </div>                     
                  </div>
                  <div className="right-area">
                    <div className={"flex justify-content"} style={{lineHeight:"2rem"}}>
                      <div className="area-name">履歴一覧</div>
                      <div className="delete-history clickable" onClick={this.delete}>
                        <Icon icon={faTrash} />選択した履歴を削除
                      </div>
                    </div>
                    <div className="table-view" id="medical-info-table">
                      {disease_history_data !== undefined &&
                      disease_history_data !== null &&
                      disease_history_data.map((item, index) => {
                        let record_history = "";
                        if (item.history != null && item.history != undefined && item.history != "") {
                          let explode_count = item.history.split(",");
                          if (explode_count.length < 10 && explode_count.length > 1) {
                            record_history = "(0"+explode_count.length+"版)";
                          } else if(explode_count.length > 9) {
                            record_history = "("+explode_count.length+"版)";
                          }                            
                        }
                        if (this.state.show_delete_record == 1) {
                          if (item.is_enabled == 2) {                              
                            return (
                              <>
                                <div
                                  className={
                                    this.state.selected_number === item.number
                                      ? "history-item clickable selected border-bottom delete-record"
                                      : "history-item clickable border-bottom delete-record"
                                  }
                                  onContextMenu={e => this.handleClick(e,item)}
                                  onClick={this.selectHistory.bind(
                                    this,
                                    disease_history_data[index],
                                    "add"
                                  )}
                                >
                                  <div className="history-date">
                                    <div>
                                    {formatJapanDateSlash(item.write_date)}
                                    </div>
                                    <div>
                                      {record_history}
                                    </div>
                                  </div>
                                  {this.getItemTitle(item)}
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <div
                                  className={
                                    this.state.selected_number === item.number
                                      ? "history-item clickable selected border-bottom"
                                      : "history-item clickable border-bottom"
                                  }
                                  onContextMenu={e => this.handleClick(e,item)}
                                  onClick={this.selectHistory.bind(
                                    this,
                                    disease_history_data[index],
                                    "add"
                                  )}
                                >
                                  <div className="history-date">
                                    <div>
                                    {formatJapanDateSlash(item.write_date)}
                                    </div>
                                    <div>
                                      {record_history}
                                    </div>
                                  </div>
                                  {this.getItemTitle(item)}
                                </div>
                              </>
                            );
                          }
                        } else {
                          if (item.is_enabled == 1) {                              
                            return (
                              <>
                                <div
                                  className={
                                    this.state.selected_number === item.number
                                      ? "history-item clickable selected border-bottom"
                                      : "history-item clickable border-bottom"
                                  }
                                  onContextMenu={e => this.handleClick(e,item)}
                                  onClick={this.selectHistory.bind(
                                    this,
                                    disease_history_data[index],
                                    "add"
                                  )}
                                >
                                  <div className="history-date">
                                    <div>
                                    {formatJapanDateSlash(item.write_date)}
                                    </div>
                                    <div>
                                      {record_history}
                                    </div>
                                  </div>
                                  {this.getItemTitle(item)}
                                </div>
                              </>
                            );
                          }
                        }                        
                      })}
                    </div>
                    {this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.SHOW_DELETE,0) == true && (
                      <div className={"flex justify-content-style"} style={{lineHeight:"2rem"}}>                      
                        <div className="delete-history clickable">
                          <Checkbox
                            label="削除済みも表示"
                            getRadio={this.getRadio.bind(this)}
                            value={this.state.show_delete_record}
                            name="check"
                            checked={this.state.show_delete_record == 1}
                          />                        
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="footer-buttons mt-3">
              <Button className="red-btn" onClick={this.openEditRegularTextModal}>定型文設定</Button>
              <Button onClick={this.openPreviewModal} className={preview_tooltip != "" ? "disable-btn" : "red-btn"} tooltip={preview_tooltip}>帳票プレビュー</Button>
              <Button onClick={this.register} className={this.state.change_flag == 0 ? "disable-btn" : "red-btn"} tooltip={register_tooltip}>
                {this.state.number ? "変更" : "登録"}
              </Button>
            </div>
          </Wrapper>
          {this.state.isOpenPreviewModal !== false && (
            <IntroLetterPreviewModal
              closeModal={this.closeModal}
              patientInfo={this.state.patientInfo}
              facility_name={facility_name}
              other_facility_name_={this.state.other_facility_name}
              other_facilities_doctor_name={
                this.state.other_facilities_doctor_name
              }
              greeting={this.state.greeting}
              diagnostic={this.state.diagnostic}
              note={this.state.note}
              facility_data={this.state.facility_data}
              select_data={this.state.select_data}
              doctor_name={this.state.doctor_name}
            />
          )}
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.handleUpdateConfirm.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isOpenConfirmModal !== false &&  (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmCloseOk}
              confirmTitle= {this.state.confirm_message}
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
          {this.state.historyIntroLetterModal && (
            <ChangeMedicalInfoDocLogModal
              closeModal={this.closeModal}
              historySoapList={this.state.historyList}
              orderNumber={this.state.selectedOrderNumber}
              // insuranceTypeList={this.props.patientInfo.insurance_type_list}
              // getDepartmentName={this.getDepartment}
              otherFacilitiesData={this.state.otherFacilitiesData}
              otherFacilitiesDepartmentDatas={this.state.other_facilities_department_datas}
              otherFacilitiesDoctors={this.state.other_facilities_doctors}
              size="lg"
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
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.openEditRegularTextModal && (
            <SetRegularTextModal
              closeModal={this.closeModal}
              modal_data={this.regularTextData}
              modal_type={'intro_letter'}
            />
          )}
          <ContextMenu
              {...this.state.contextMenu}
              parent={this}
          />
        </Card>
      </>
    );
  }
}

IntroLetter.contextType = Context;
IntroLetter.propTypes = {  
  history: PropTypes.object,
};
export default IntroLetter;
