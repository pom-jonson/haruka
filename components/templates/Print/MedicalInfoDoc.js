import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import { formatDateLine, formatJapanDateSlash } from "~/helpers/date";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import DialSideBar from "../Dial/DialSideBar";
import DialPatientNav from "../Dial/DialPatientNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import MedicalInfoDocPreviewModal from "./MedicalInfoDocPreviewModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import InputInspectionPanel from "~/components/templates/Dial/Board/molecules/InputInspectionPanel";
import ChangeMedicalInfoDocLogModal from "~/components/templates/Dial/modals/ChangeMedicalInfoDocLogModal";
import SetRegularTextModal from "~/components/templates/Print/SetRegularTextModal";
import Context from "~/helpers/configureStore";
import * as sessApi from "~/helpers/cacheSession-utils";
import {
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  getWeekdayFormat,
  getMonthFormat,
  getWeekIntervalFormat,
} from '~/helpers/dialConstants';
import { printValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import TextareaAutosize from 'react-textarea-autosize';
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";
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
  width: 100%;
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
      font-size: 1.5rem;
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
  align-items: flex-start;
  justify-content: space-between;
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
    width: 70%;
    height: 100%;
    float: left;
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
    textarea {font-size:1rem;}
  }
  .right-area {
    width: 30%;
    padding-left: 1rem;
    padding-right: 0.5rem;
    height: 100%;
    float: right;
    .area-name {font-size: 1.25rem;}
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
  }

  .header-item {
    width: 60%;
    margin-right: 30px;
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
    .label-title {
      width: 6rem;
      text-align: right;
      font-size: 1rem;
      margin: 0;
      margin-right: 0.5rem;
      line-height: 2rem;
    }
    .hVAPNc {
      width: 70%;
      float: left;
    }
    .pullbox-label {
      width: calc(100% - 6.5rem);
      select {
        width: 100%;
        height: 2rem;
        font-size: 1rem;
      }
    }
    label {
      width: 100px;
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
      font-size: 1rem;
    }
    button {
      margin-left: 10px;
      margin-top: 8px;
      background-color: #f3f3f3;
    }
  }

  .header-item-right {
    width: 40%;
    margin-right: 30px;
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

class MedicalInfoDoc extends Component {
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
      doctor_number: 0,
      disease_codes: [],
      selected_history_number: 0,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isOpenConfirmModal: false,
      tmpData: null,
      confirm_message: "",
      confirm_type: "",
      isOpenPreviewModal: false,
      isLoaded: false,
      patientInfo: "",
      other_facilities_data: init_other_facilities,
      other_facilities_department_datas: init_other_facilities_department_datas,
      other_facilities_doctors: init_other_facilities_doctors,
      number: "",
      write_date: new Date(),
      other_facility_number: 0,
      other_facilities_department: 0,
      other_facilities_doctor: 0,
      disease_name: "",
      introduction_purpose: "",
      family_history: "",
      inspection_result: "",
      course_treatment: "",
      cur_prescription: "",
      remark: "",
      disease_history_data: [],
      select_data: "",
      facility_data: [],
      cur_prescription_data: [],
      isShowDoctorList: false,
      instruction_doctor_number: 0,
      isOpenInputPanel: false,
      openEditRegularTextModal: false,
      historyMedicalInfoDocModal: false,
      change_flag: 0,
      alert_message: "",
      disease_name_btn:null,
      introduction_purpose_btn:[],
      family_history_btn: null,
      inspection_result_btn: null,
      course_treatment_btn: null,
      cur_prescription_btn: null,
      remark_btn: null,
      show_delete_record: 0,
    };
    this.original = "";
    this.regularTextData = [];
    this.disease_name_min_row = 3;
    this.introduction_purpose_min_row = 3;
    this.family_history_min_row = 3;
    this.inspection_result_min_row = 5;
    this.course_treatment_min_row = 3;
    this.cur_prescription_min_row = 5;
    this.remark_min_row = 3;
    this.injection_master = sessApi.getObjectValue("dial_common_master","injection_master");
  }

  async componentDidMount() {
    this.setChangeFlag(0);    
    await this.getDoctors();
    await this.getDiseases();
    await this.setDoctors();
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

    //---javascript text-area autosize
    // var observe;
    // if (window.attachEvent) {
    //   observe = function (element, event, handler) {
    //     element.attachEvent('on'+event, handler);
    //   };
    // } else {
    //   observe = function (element, event, handler) {
    //     element.addEventListener(event, handler, false);
    //   };
    // }
    // let disease_name_text = document.getElementById('disease_name_id');
    // function resize () {
    //   disease_name_text.style.height = 'auto';
    //   disease_name_text.style.height = disease_name_text.scrollHeight+'px';
    // }
    // /* 0-timeout to get the already changed text */
    // function delayedResize () {
    //   window.setTimeout(resize, 0);
    // }
    // observe(disease_name_text, 'change',  resize);
    // observe(disease_name_text, 'cut',     delayedResize);
    // observe(disease_name_text, 'paste',   delayedResize);
    // observe(disease_name_text, 'drop',    delayedResize);
    // observe(disease_name_text, 'keydown', delayedResize);
    //
    // disease_name_text.focus();
    // disease_name_text.select();
    // resize();
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

  getRegularText = async () => {
    let path = "/app/api/v2/dial/master/regular_text";
    let post_data = {
      page_name: "診療情報提供書",
    };
    let { data } = await axios.post(path, { params: post_data });
    if (data) {
      this.regularTextData = data;
      if(data.length > 0){
        let disease_name_btn = this.state.disease_name_btn;
        let introduction_purpose_btn = this.state.introduction_purpose_btn;
        let family_history_btn = this.state.family_history_btn;
        let inspection_result_btn = this.state.inspection_result_btn;
        let course_treatment_btn = this.state.course_treatment_btn;
        let cur_prescription_btn = this.state.cur_prescription_btn;
        let remark_btn = this.state.remark_btn;
        data.map(item=>{
          if(item.label == "傷病名"){
            disease_name_btn = {title:"定型文", body:item.body};
          }
          if(item.label == "紹介目的"){
            introduction_purpose_btn.push({title:item.title, body:item.body});
          }
          if(item.label == "既往歴・家族歴"){
            family_history_btn = {title:"定型文", body:item.body};
          }
          if(item.label == "症状経過・検査結果"){
            inspection_result_btn = {title:"定型文", body:item.body};
          }
          if(item.label == "治療経過"){
            course_treatment_btn = {title:"定型文", body:item.body};
          }
          if(item.label == "現在の処方"){
            cur_prescription_btn = {title:"定型文", body:item.body};
          }
          if(item.label == "備考"){
            remark_btn = {title:"定型文", body:item.body};
          }
        });
        if(introduction_purpose_btn.length > 2){
          this.introduction_purpose_min_row = introduction_purpose_btn.length * 2;
        }

        this.setState({
          disease_name_btn,
          introduction_purpose_btn,
          family_history_btn,
          inspection_result_btn,
          course_treatment_btn,
          cur_prescription_btn,
          remark_btn,
        })
      }
    }
  };

  async getMedicalDocInfo() {
    let path = "/app/api/v2/dial/print/getData";
    const post_data = {
      system_patient_id: this.state.patientInfo.system_patient_id,
      document_name: "診療情報提供書",
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
            family_history: res[2],
            cur_prescription_data: res[3],
            insulin: res[4]
          });
        } else {
          this.setState({
            disease_history_data: [],
            facility_data: [],
            family_history: "",
            cur_prescription_data: [],
          });
        }
      })
      .catch(() => {});
  }

  getOtherFacilityName = (e) => {
    // let department_datas = [
    //     { id: 0, value: "" },
    // ];
    // let doctor_datas = [
    //     { id: 0, value: "" },
    // ];
    this.setChangeFlag(1);
    this.setState({
      other_facility_number: parseInt(e.target.id),
      // other_facilities_department_datas:department_datas,
      // other_facilities_doctors:doctor_datas,
      // other_facilities_department:'',
      // other_facilities_doctor:'',
      // },
      // ()=>{
      //     this.getOtherFacilitiesDepartmentDatas(this.state.other_facility_number);
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
    if (other_facility_number !== 0) {
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
    }
  };

  getOtherFacilitiesDepartment = (e) => {
    this.setChangeFlag(1);
    this.setState({
      other_facilities_department: parseInt(e.target.id),
      // }, ()=>{
      //     this.getOtherFacilitiesDoctors(this.state.other_facility_number, this.state.other_facilities_department);
    });
  };

  getOtherFacilitiesDoctors = async (
    other_facility_number,
    other_facilities_department
  ) => {
    let doctor_datas = [{ id: 0, value: "" }];
    if (other_facilities_department !== 0) {
      let path = "/app/api/v2/dial/master/other_facilities_doctor_search";
      let post_data = {
        other_facilities_number: other_facility_number,
        other_facilities_department_number: other_facilities_department,
        is_enabled: 1,
        order:'sort_number'
      };
      let { data } = await axios.post(path, { params: post_data });

      data.map((item, index) => {
        let doctor_info = { id: item.number, value: item.name };
        doctor_datas[index + 1] = doctor_info;
      });
    }
    this.setState({ other_facilities_doctors: doctor_datas });
  };

  getOtherFacilitiesDoctor = (e) => {
    this.setChangeFlag(1);
    this.setState({
      other_facilities_doctor: parseInt(e.target.id),
    });
  };

  setDiseaseName = (e) => {
    this.setChangeFlag(1);
    this.setState({ disease_name: e.target.value });
  };

  setIntroductionPurpose = (e) => {
    this.setChangeFlag(1);
    this.setState({ introduction_purpose: e.target.value });
  };

  setFamilyHistory = (e) => {
    this.setChangeFlag(1);
    this.setState({ family_history: e.target.value });
  };

  setInspectionResult = (e) => {
    this.setChangeFlag(1);
    this.setState({ inspection_result: e.target.value });
  };

  setCourseTreatment = (e) => {
    this.setChangeFlag(1);
    this.setState({ course_treatment: e.target.value });
  };

  setCurPrescription = (e) => {
    this.setChangeFlag(1);
    this.setState({ cur_prescription: e.target.value });
  };

  setRemark = (e) => {
    this.setChangeFlag(1);
    this.setState({ remark: e.target.value });
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
    this.setState({ instruction_doctor_number });
    this.clearRedStyle();
    this.setState(
      {
        patientInfo: patientInfo,
        number: "",
        other_facility_number: 0,
        other_facilities_department: 0,
        other_facilities_doctor: 0,
        write_date: new Date(),
        disease_name: "",
        introduction_purpose: "",
        family_history: "",
        inspection_result: "",
        course_treatment: "",
        cur_prescription: "",
        remark: "",
        select_data: "",
        cur_prescription_data: [],
        other_facilities_data: [],
        other_facilities_department_datas: init_other_facilities_department_datas,
        instruction_doctor_number,
        // other_facilities_doctors:init_other_facilities_doctors,
        // instruction_doctor_number: 0,
      },
      () => {
        this.getRegularInjection();
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
          isOpenConfirmModal: true,
          isAdd: true,
          tmpData: data,
          confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
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
    let disease_name = "";
    let introduction_purpose = "";
    let family_history = "";
    let inspection_result = "";
    let course_treatment = "";
    let cur_prescription = "";
    let remark = "";
    data.item.map((item) => {
      if (item.form_name === "傷病名") {
        disease_name = item.body;
      }
      if (item.form_name === "紹介目的") {
        introduction_purpose = item.body;
      }
      if (item.form_name === "既往歴,家族歴") {
        family_history = item.body;
      }
      if (item.form_name === "症状経過,検査結果") {
        inspection_result = item.body;
      }
      if (item.form_name === "治療経過") {
        course_treatment = item.body;
      }
      if (item.form_name === "現在の処方") {
        cur_prescription = item.body;
      }
      if (item.form_name === "備考") {
        remark = item.body;
      }
    });

    let _state = {
        select_data: data,
        number: data.number,
        selected_number: data.number,
        other_facility_number: data.other_facilities_number,
        other_facilities_department: data.other_facilities_department_number,
        other_facilities_doctor: data.other_facilities_doctor_number,
        write_date: new Date(data.write_date),
        disease_name,
        introduction_purpose,
        family_history,
        inspection_result,
        course_treatment,
        cur_prescription,
        remark,
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


    this.setState( _state,
      () => {
        this.original = JSON.stringify(this.state);
      }
    );
  };

  deleteHistory = async () => {
    this.setChangeFlag(0);
    let path = "/app/api/v2/dial/print/deleteData";
    const post_data = {
      number: this.state.selected_number,
      system_patient_id: this.state.patientInfo.system_patient_id
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

  getDate = (value) => {
    this.setChangeFlag(1);
    this.setState(
      {
        write_date: value,
      },
      () => this.getMedicalDocInfo()
    );
  };

  delete = () => {
    if (this.state.selected_number !== "") {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: "履歴情報を削除しますか?",
      });
    }
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
  closeModal = (act = null) => {
    this.setState(
      {
        isOpenPreviewModal: false,
        isShowDoctorList: false,
        isOpenInputPanel: false,
        historyMedicalInfoDocModal: false,
        openEditRegularTextModal: false,
      },() => {
        if (act === "edit_regular") {
          this.getRegularText();
        }
      }
    );
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      tmpData: null,
      confirm_message: "",
      confirm_type: "",
    });
  }

  handleUpdateConfirm = async () => {
    // if (this.state.confirm_type == "update") {

    // } else if(this.state.confirm_type == "register") {

    // }

    let path = "/app/api/v2/dial/print/registerData";
    let input_data = {
      number: this.state.number,
      system_patient_id: this.state.patientInfo.system_patient_id,
      document_name: "診療情報提供書",
      write_date: formatDateLine(this.state.write_date),
      other_facilities_number: this.state.other_facility_number,
      other_facility_name:
        this.state.otherFacilitiesData != undefined &&
        this.state.otherFacilitiesData.find(
          (x) => x.id === this.state.other_facility_number
        ) != undefined
          ? this.state.otherFacilitiesData.find(
              (x) => x.id === this.state.other_facility_number
            ).value
          : "",        
      other_facilities_department_number: this.state
        .other_facilities_department,
      other_facilities_department_name:
        this.state.other_facilities_department_datas != undefined &&
        this.state.other_facilities_department_datas.find(
          (x) => x.id === this.state.other_facilities_department
        ) != undefined
          ? this.state.other_facilities_department_datas.find(
              (x) => x.id === this.state.other_facilities_department
            ).value
          : "",
      other_facilities_doctor_number: this.state.other_facilities_doctor,
      other_facilities_doctor_name:
        this.state.other_facilities_doctors != undefined &&
        this.state.other_facilities_doctors.find(
          (x) => x.id === this.state.other_facilities_doctor
        ) != undefined
          ? this.state.other_facilities_doctors.find(
              (x) => x.id === this.state.other_facilities_doctor
            ).value
          : "",
      disease_name: this.state.disease_name,
      introduction_purpose: this.state.introduction_purpose,
      family_history: this.state.family_history,
      inspection_result: this.state.inspection_result,
      course_treatment: this.state.course_treatment,
      cur_prescription: this.state.cur_prescription,
      remark: this.state.remark,
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
    // if (this.state.other_facility_number < 1) {
    //   return;
    // }
    if (this.state.instruction_doctor_number == 0) {
      // window.sessionStorage.setItem("alert_messages", res.alert_message);
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

  addText = (item, key) => {
    this.setChangeFlag(1);
    this.setState({[key]:this.state[key] == "" ? item.body : this.state[key] + "\n" + item.body});
  };

  getInjectionUnit (code) {
    if (this.injection_master == undefined || this.injection_master == null || this.injection_master.length == 0) return '';
    if (code == undefined || code == null || code == '') return '';
    var inject = this.injection_master.find(x => x.code == code);
    if (inject == undefined) return ''
    var unit = inject.unit;
    if (unit == undefined || unit == null) return '';
    return unit;
  }

  addInjection = () => {
    if (this.state.injection_pattern != undefined && this.state.injection_pattern != null && this.state.injection_pattern.length > 0){
      this.setChangeFlag(1);
      var injection_text = '注射指示' + '\n';
      this.state.injection_pattern.map((item, index) => {
        if (item.time_limit_to == null){
          index = index + 1;        
          if (index < 10){
            injection_text += ' ' + index + ') ';
          } else{
            injection_text += index + ') ';
          }
          item.data_json.map((sub_item, sub_index) => {
            if(sub_item.item_code != ''){
              var unit = this.getInjectionUnit(sub_item.item_code);
              if (sub_index != 0) injection_text += '      ';
              injection_text += sub_item.item_name + '　' + sub_item.amount + unit + '\n';            
            }
          })
          var weekday_str = getWeekdayFormat(item.weekday);
          var month_str = getMonthFormat(item.monthly_enable_week_number);
          var week_interval_str = getWeekIntervalFormat(item.week_interval);
          injection_text += '      '+weekday_str + '　' + week_interval_str + '　' + month_str+ '\n';
        }
        
      })
      var remark = this.state.remark;
      remark += injection_text;
      this.setState({remark});
    }
  }

  getRegularInjection = async() => {
    let path = "/app/api/v2/dial/schedule/regular_injection_search";
    let post_data = {
        instruct_date: formatDateLine(new Date()),
        patient_id: this.state.patientInfo.system_patient_id,
    };
    await apiClient.post(path, {params: post_data}).then((res)=>{
      if (res != undefined && res != null && res.length > 0){
        res = res.filter(x => x.time_limit_to == null);
        this.setState({injection_pattern:res});
      }
    });  
  }

  openInputPanel = () => {
    if (
      this.state.patientInfo == undefined ||
      this.state.patientInfo == null ||
      this.state.patientInfo == ""
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      isOpenInputPanel: true,
    });
  };

  registerInspectionResult = (text) => {
    this.setChangeFlag(1);
    var inspection_result = this.state.inspection_result;
    if (inspection_result != "") inspection_result += "\n";
    inspection_result += text;
    this.setState({ inspection_result });
    this.closeModal();
  };
  openEditRegularTextModal = () => {
    this.setState({ openEditRegularTextModal: true });
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
    removeRedBorder('disease_name_id');
    removeRedBorder('introduction_purpose_id');
    removeRedBorder('family_history_id');
    removeRedBorder('inspection_result_id');
    removeRedBorder('course_treatment_id');
    removeRedBorder('cur_prescription_id');
    removeRedBorder('remark_id');    
  }

  checkValidation = () => { 
    this.clearRedStyle();   

    let error_str_arr = [];
    let validate_data = printValidate('dial_medical_info_doc', this.state);    
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
  insertPrescription = () => {
    if ( this.state.patientInfo == undefined || this.state.patientInfo == null || this.state.patientInfo == "") {
      window.sessionStorage.setItem( "alert_messages", "患者様を選択してください。" );
      return;
    }
    let {cur_prescription} = this.state;
    if (this.state.cur_prescription_data.length > 0) {
      if (cur_prescription != "" && !cur_prescription.endsWith("\n")) cur_prescription += "\n";
      this.state.cur_prescription_data.map((pres_data, pres_index)=>{
        if (pres_index > 0) cur_prescription += "\n";
        cur_prescription += "《定期処方" + (pres_index + 1) +"》" + "\n";
        pres_data.data_json.map((rp_item, index) => {
          // cur_prescription = cur_prescription + '【定期薬】' + "\n";
          cur_prescription = cur_prescription + (index + 1) + ")";
          if (rp_item.medicines.length > 0) {
            rp_item.medicines.map((medi_item, medi_index) => {
              if (medi_index != 0) cur_prescription = cur_prescription + "　";
              cur_prescription = cur_prescription + medi_item.item_name;
              cur_prescription = cur_prescription + medi_item.amount;
              if (medi_item.unit != undefined) {
                cur_prescription = cur_prescription + medi_item.unit;
              }
              cur_prescription = cur_prescription + (medi_item.is_not_generic == 1 ? "【後発変更不可】": "");
              if (medi_index != (rp_item.medicines.length-1)) {
                cur_prescription = cur_prescription + "\n";
              }
            });
            cur_prescription = cur_prescription + " ";
          }
          cur_prescription = cur_prescription + rp_item.usage_name;
          cur_prescription = cur_prescription + "\n";
        });
      })
      this.setState({cur_prescription});
      this.setChangeFlag(1);
    }
  }
  insertInsulin = () => {
    if ( this.state.patientInfo == undefined || this.state.patientInfo == null || this.state.patientInfo == "") {
      window.sessionStorage.setItem( "alert_messages", "患者様を選択してください。" );
      return;
    }
    let {cur_prescription, insulin} = this.state;
    if (insulin != null && insulin.length > 0) {
      if (insulin[0] != undefined && insulin[0].length > 0) {
        if (cur_prescription != "" && !cur_prescription.endsWith("\n")) cur_prescription += "\n";
        insulin[0].map(item=>{
          cur_prescription = cur_prescription + "毎日" + "\n";
          cur_prescription = cur_prescription + item['insulin'] + "\n";
          cur_prescription = cur_prescription + item['amount_1'] + '-' + item['amount_2'] + '-' + item['amount_3'] + '-' + item['amount_4'] + "\n";
        });
      }
      if (insulin[1] != undefined && insulin[1].length > 0) {
        insulin[1].map(item=>{
          cur_prescription = cur_prescription + "透析日" + "\n";
          cur_prescription = cur_prescription + item['insulin'] + "\n";
          cur_prescription = cur_prescription + item['amount_1'] + '-' + item['amount_2'] + '-' + item['amount_3'] + '-' + item['amount_4'] + "\n";
        });
      }
      if (insulin[2] != undefined && insulin[2].length > 0) {
        insulin[2].map(item=>{
          cur_prescription = cur_prescription + "非透析日" + "\n";
          cur_prescription = cur_prescription + item['insulin'] + "\n";
          cur_prescription = cur_prescription + item['amount_1'] + '-' + item['amount_2'] + '-' + item['amount_3'] + '-' + item['amount_4'] + "\n";
        });
      }
      this.setState({cur_prescription});
      this.setChangeFlag(1);
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
        type: "medical_info_doc",
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
      historyMedicalInfoDocModal: true,
      selectedOrderNumber: params.number,
      historyList: result
    });
  };

  getDiseaseName =async(type)=> {
    if (this.state.patientInfo == undefined || this.state.patientInfo == null || this.state.patientInfo == "") {
      window.sessionStorage.setItem("alert_messages","患者様を選択してください。");
      return;
    }
    let path = "/app/api/v2/dial/medicine_information/get_recently_disease_name";
    let post_data = {
      patient_id: this.state.patientInfo.system_patient_id,
      type,
    };
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        if(type == "disease_name"){
          let disease_name = this.state.disease_name;
          if(res.length > 0){
            res.map((item, index)=>{
              disease_name = disease_name == "" ? ((index + 1 + ".") + item.name) : (disease_name + "\n" + (index + 1 + ".") + item.name);
            })
          }
          this.setState({disease_name});
        }
        if(type == "past_history"){
          let family_history = this.state.family_history;
          family_history = family_history == "" ? res.past_history : family_history + "\n" + res.past_history;
          this.setState({family_history});
        }
        if(type == "disease_history"){
          let inspection_result = this.state.inspection_result;
          inspection_result = inspection_result == "" ? res.disease_history : inspection_result + "\n" + res.disease_history;
          this.setState({inspection_result});
        }
      })
      .catch(() => {});
  };

  getRadio = (name, value) => {
    if(name==="check"){
      this.setState({show_delete_record: value})
    }
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
      cur_prescription
    } = this.state;

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
            <div className="title">診療情報提供書{this.state.number && "（編集中）" }</div>
            <div className="hp-100 content">
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
                        <div>
                          <SelectorWithLabel
                            id="other_facility_number_id"
                            options={otherFacilitiesData}
                            title="医療機関名"
                            getSelect={this.getOtherFacilityName.bind(this)}
                            departmentEditCode={this.state.other_facility_number}
                          />
                        </div>
                        <div style={{marginTop:"0.5rem"}}>
                          <SelectorWithLabel
                            id="other_facilities_department_id"
                            title="診療科"
                            options={other_facilities_department_datas}
                            getSelect={this.getOtherFacilitiesDepartment}
                            departmentEditCode={
                              this.state.other_facilities_department
                            }
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
                        <div className="label-type1"> 傷病名</div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="disease_name_id"
                          onChange={this.setDiseaseName.bind(this)}
                          value={this.state.disease_name}
                          minRows={this.disease_name_min_row}
                        />
                      </div>
                      <div className="div-style2">
                        <div><Button type="mono" onClick={this.getDiseaseName.bind(this, "disease_name")}>病名取得</Button></div>
                        {this.state.disease_name_btn != null && (
                          <div><Button type="mono" onClick={this.addText.bind(this, this.state.disease_name_btn, "disease_name")}>{this.state.disease_name_btn.title}</Button></div>
                        )}
                      </div>
                    </div>

                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">紹介目的</div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="introduction_purpose_id"
                          onChange={this.setIntroductionPurpose.bind(this)}
                          value={this.state.introduction_purpose}
                          minRows={this.introduction_purpose_min_row}
                        />
                      </div>
                      <div className="div-style2">
                        {this.state.introduction_purpose_btn.length > 0 &&
                          this.state.introduction_purpose_btn.map((item) => {
                            return (
                              <>
                                <div><Button type="mono" onClick={this.addText.bind(this, item, "introduction_purpose")}>{item.title}</Button></div>
                              </>
                            );
                          })}
                      </div>
                    </div>

                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">
                          既往歴
                          <br />
                          家族歴
                        </div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="family_history_id"
                          onChange={this.setFamilyHistory.bind(this)}
                          value={this.state.family_history}
                          minRows={this.family_history_min_row}
                        />
                      </div>
                      <div className="div-style2">
                        <div><Button type="mono" onClick={this.getDiseaseName.bind(this, "past_history")}>既往歴</Button></div>
                        {this.state.family_history_btn != null && (
                          <Button type="mono" onClick={this.addText.bind(this, this.state.family_history_btn, "family_history")}>{this.state.family_history_btn.title}</Button>
                        )}
                      </div>
                    </div>

                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">
                          症状経過
                          <br />
                          検査結果
                        </div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="inspection_result_id"
                          onChange={this.setInspectionResult.bind(this)}
                          value={this.state.inspection_result}
                          minRows={this.inspection_result_min_row}
                        />
                      </div>
                      <div className="div-style2">
                        <div><Button type="mono" onClick={this.getDiseaseName.bind(this, "disease_history")}>現病歴</Button></div>
                        <div><Button type="mono" onClick={this.openInputPanel.bind(this)}>検査結果</Button></div>
                        {this.state.inspection_result_btn != null && (
                          <div><Button type="mono" onClick={this.addText.bind(this, this.state.inspection_result_btn, "inspection_result")}>{this.state.inspection_result_btn.title}</Button></div>
                        )}
                      </div>
                    </div>

                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">治療経過</div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="course_treatment_id"
                          onChange={this.setCourseTreatment.bind(this)}
                          value={this.state.course_treatment}
                          minRows={this.course_treatment_min_row}
                        />
                      </div>
                      {this.state.course_treatment_btn != null && (
                        <div className="div-style2">
                          <Button type="mono" onClick={this.addText.bind(this, this.state.course_treatment_btn, "course_treatment")}>{this.state.course_treatment_btn.title}</Button>
                        </div>
                      )}
                    </div>

                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">現在の処方</div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="cur_prescription_id"
                          onChange={this.setCurPrescription.bind(this)}
                          value={cur_prescription}
                          minRows={this.cur_prescription_min_row}
                        />
                      </div>
                      <div className="div-style2">
                        <div><Button type="mono" onClick={this.insertPrescription.bind(this)}>処方取得</Button></div>
                        <div><Button type="mono" onClick={this.insertInsulin.bind(this)}>インスリン</Button></div>
                        {this.state.cur_prescription_btn != null && (
                          <div><Button type="mono" onClick={this.addText.bind(this, this.state.cur_prescription_btn, "cur_prescription")}>{this.state.cur_prescription_btn.title}</Button></div>
                        )}
                      </div>
                    </div>

                    <div className="main-info">
                      <div className="div-style1">
                        <div className="label-type1">備考</div>
                      </div>
                      <div className="disease-history">
                        <TextareaAutosize
                          id="remark_id"
                          onChange={this.setRemark.bind(this)}
                          value={this.state.remark}
                          minRows={this.remark_min_row}
                        />
                      </div>
                      <div className="div-style2">
                      {this.state.remark_btn != null && (
                        <>
                        <div><Button type="mono" onClick={this.addText.bind(this, this.state.remark_btn, "remark")}>{this.state.remark_btn.title}</Button></div>
                        <div><Button type="mono" onClick={this.addInjection.bind(this)}>注射</Button></div>
                        </>
                      )}
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
              <Button className="red-btn" onClick={this.openEditRegularTextModal}>
                定型文設定
              </Button>
                <Button
                  onClick={this.openPreviewModal}
                  className={preview_tooltip != "" ? "disable-btn" : "red-btn"}
                  tooltip={preview_tooltip}
                >
                  帳票プレビュー
                </Button>
                <Button
                  onClick={this.register}
                  className={this.state.change_flag == 0 ? "disable-btn" : "red-btn"}
                  tooltip={register_tooltip}
                >
                  {this.state.number ? "変更" : "登録"}
                </Button>
            </div>
          </Wrapper>
          {this.state.isOpenPreviewModal !== false && (
            <MedicalInfoDocPreviewModal
              closeModal={this.closeModal}
              history_number={this.state.selected_number}
              print_data={this.state}
              cur_prescription={cur_prescription}
              patientInfo={this.state.patientInfo}
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
          {this.state.isShowDoctorList && (
            <DialSelectMasterModal
              selectMaster={this.selectDoctor}
              closeModal={this.closeModal}
              MasterCodeData={this.state.doctors}
              MasterName="医師"
            />
          )}
          {this.state.isOpenInputPanel && (
            <InputInspectionPanel
              closeModal={this.closeModal}
              handleOk={this.registerInspectionResult}
              patient_id={this.state.patientInfo.system_patient_id}
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
              modal_type={'medical_info_doc'}
            />
          )}
          {this.state.historyMedicalInfoDocModal && (
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
          <ContextMenu
              {...this.state.contextMenu}
              parent={this}
          />
        </Card>
      </>
    );
  }
}

MedicalInfoDoc.contextType = Context;
MedicalInfoDoc.propTypes = {  
  history: PropTypes.object,
};
export default MedicalInfoDoc;
