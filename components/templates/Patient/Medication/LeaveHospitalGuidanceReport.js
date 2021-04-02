import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import InputBoxTag from "~/components/molecules/InputBoxTag";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import DatePicker from "react-datepicker";
import * as sessApi from "~/helpers/cacheSession-utils";
import LeaveHospitalReportPrintModal from "./LeaveHospitalReportPrintModal";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatTimeIE} from "~/helpers/date";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size: 1rem;
    .flex {display: flex;}
    .div-title {
      height:1.8rem;
      line-height:1.8rem;
    }
    .div-value {
      height:1.8rem;
      line-height:1.8rem;
      border:1px solid #aaa;
    }
    label {
      height:1.8rem;
      line-height:1.8rem;
      font-size:1rem;
      margin:0;
    }
    input {
      height:1.8rem;
      font-size:1rem;
    }
    .select-date input {
      width:7rem;
      text-align: center;
    }
    .select-radio {
        label {
            margin-right: 0.5rem;
            height: 1.8rem;
            line-height: 1.8rem;
            font-size: 1rem;
            input {height: 15px !important;}
        }
        div {
          margin-top:0;
          .label-title {display:none;}
          input {wdith:20rem;}
          
        }
    }
    .select-check {
      label {
        input {
          height: 15px !important;
        }
      }
    }
    .select-doctor {
      .label-title {display:none;}
      .pullbox-select {
        width: 20rem;
        height: 1.8rem;
        font-size:1rem;   
      }
    }
    .common-area {
      width:100%;
      .select-check {width:15rem;}
      .input-text {
        div {margin-top:0;}
        input {width:20rem;}
      }
    }
    .text-area {
      width: 80%;
      height: 2.5rem;
      border: 1px solid #aaa;
      textarea {
        width: 100%;
        height: 100%;
        border:none;
      }
    }
    .panel-menu {
        border: 1px solid #aaa;
        border-bottom: none;
        width: 100%;
        font-weight: bold;
        background-color: rgba(208, 208, 208, 1);
        margin-top:0.5rem;
        height: 1.8rem;
        line-height: 1.8rem;
        .active-menu {
            width:calc(100% / 3);
            text-align: center;
        }
        .menu-btn {
            width:calc(100% / 3);
            text-align: center;
            border: 1px solid #aaa;
            border-top: none;
            cursor: pointer;
        }
    }
    .tab-area {
      border: 1px solid #aaa;
      border-top: none;
      padding: 0.3rem;
    }
    .no-label {
      .label-title {display:none;}
    }
    .inputboxtag {
      div {
        margin-top: 0;
      }
    }
    .third-tab{
      .label-title {
        width:10rem;
        margin:0;
      }
      .means-transportation {
        input {width:30rem;}
      }
      .care-taxi {
        .select-check {width:10rem;}
        .care-taxi input {
          width:30rem;
        }
      }
      .discharge-after-doctor input {
        width:20rem;
      }
      .home-doctor input {
        width:20rem;
      }
      .period-month input {
        width: 3rem;
      }
    }
    .input-box-tag {
        height: 1.8rem;
        line-height: 1.8rem;
    }
    .time-select {
      .react-datepicker-wrapper input{
        width: 4rem;
        text-align: center;
      }
    }
`;

class LeaveHospitalGuidanceReport extends Component {
  constructor(props) {
    super(props);
    this.start_date = formatDateLine(new Date());
    this.start_date = new Date(this.start_date.split('-').join('/')+" 00:00:00");
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.doctor_list = [];
    let doctor_code_list = [];
    this.doctors = sessApi.getDoctorList();
    let doctor_names = [];
    this.doctors.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.number;
        doctor.value = doctor.name;
        doctor_names[doctor.number] = doctor.name;
        this.doctor_list.push(doctor);
      }
    });
    this.doctor_list.unshift({id:0,value:''});
    this.nurses_list = sessApi.getStaffList(2);
    this.nurses_list.unshift({id:0,value:''});
    let nurse_names = [];
    this.nurses_list.map(nurse=>{
      nurse_names[nurse.id] = nurse.value;
    });
    let cache_data = karteApi.getVal(props.patientId, CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT);
    if(props.report_order_data != undefined && props.report_order_data != null) {
      cache_data = props.report_order_data.order_data;
      if (cache_data !== undefined) {
        cache_data.last_doctor_code = cache_data.doctor_code;
        cache_data.last_doctor_name = cache_data.doctor_name;
      }
    }
    cache_data = cache_data == undefined ? null : cache_data;
    this.state = {
      isOpenStaffList:false,
      number:cache_data != null ? cache_data.number : 0,
      last_doctor_code:cache_data != null ? cache_data.last_doctor_code : undefined,
      last_doctor_name:cache_data != null ? cache_data.last_doctor_name : undefined,
      department_id:cache_data != null ? cache_data.department_id : props.department_id,
      start_date:cache_data != null ? new Date(cache_data.start_date.split("-").join("/")) : new Date(),
      start_time:cache_data != null ? new Date(cache_data.start_date.split("-").join("/")+" "+cache_data.start_time+":00") : new Date(),
      end_time:cache_data != null ? new Date(cache_data.start_date.split("-").join("/")+" "+cache_data.end_time+":00") : "",
      write_staff_name:cache_data != null ? cache_data.name : this.authInfo.name,
      write_staff_number:cache_data != null ? cache_data.user_number : this.authInfo.user_number,
      patient_family:0,
      patient_name:"",
      family_name:"",
      doctor_check:(cache_data != null && cache_data.doctor_id != undefined) ? 1 : 0,
      doctor_id:(cache_data != null && cache_data.doctor_id != undefined) ? cache_data.doctor_id : 0,
      nurse_check:(cache_data != null && cache_data.nurse_id != undefined) ? 1 : 0,
      nurse_id:(cache_data != null && cache_data.nurse_id != undefined) ? cache_data.nurse_id : 0,
      discharge_support_nurse_check:(cache_data != null && cache_data.discharge_support_nurse_id != undefined) ? 1 : 0,
      discharge_support_nurse_id:(cache_data != null && cache_data.discharge_support_nurse_id != undefined) ? cache_data.discharge_support_nurse_id : 0,
      msw_check:(cache_data != null && cache_data.msw_text != undefined) ? 1 : 0,
      msw_text:(cache_data != null && cache_data.msw_text != undefined) ? cache_data.msw_text : "",
      hospital_other_check:(cache_data != null && cache_data.hospital_other_text != undefined) ? 1 : 0,
      hospital_other_text:(cache_data != null && cache_data.hospital_other_text != undefined) ? cache_data.hospital_other_text : "",
      instructed_nurse_check:(cache_data != null && cache_data.instructed_nurse_id != undefined) ? 1 : 0,
      instructed_nurse_id:(cache_data != null && cache_data.instructed_nurse_id != undefined) ? cache_data.instructed_nurse_id : 0,
      visit_nurse_check:(cache_data != null && cache_data.visit_nurse_id != undefined) ? 1 : 0,
      visit_nurse_id:(cache_data != null && cache_data.visit_nurse_id != undefined) ? cache_data.visit_nurse_id : 0,
      care_manager_check:(cache_data != null && cache_data.care_manager_name != undefined) ? 1 : 0,
      care_manager_name:(cache_data != null && cache_data.care_manager_name != undefined) ? cache_data.care_manager_name : "",
      outside_hospital_other_check:(cache_data != null && cache_data.outside_hospital_other_text != undefined) ? 1 : 0,
      outside_hospital_other_text:(cache_data != null && cache_data.outside_hospital_other_text != undefined) ? cache_data.outside_hospital_other_text : "",
      check_inject:(cache_data != null && cache_data.check_inject != undefined) ? cache_data.check_inject : [],
      check_equipment:(cache_data != null && cache_data.check_equipment != undefined) ? cache_data.check_equipment : [],
      check_treat:(cache_data != null && cache_data.check_treat != undefined) ? cache_data.check_treat : [],
      need_medicine:(cache_data != null && cache_data.need_medicine != undefined) ? cache_data.need_medicine : "",
      medicine_detail:(cache_data != null && cache_data.medicine_detail != undefined) ? cache_data.medicine_detail : "",
      check_body_assistance:(cache_data != null && cache_data.check_body_assistance != undefined) ? cache_data.check_body_assistance : [],
      treat_check_other:(cache_data != null && cache_data.treat_check_other_text != undefined) ? 1 : 0,
      treat_check_other_text:(cache_data != null && cache_data.treat_check_other_text != undefined) ? cache_data.treat_check_other_text : "",
      body_assistance_check_other:(cache_data != null && cache_data.body_assistance_check_other_text != undefined) ? 1 : 0,
      body_assistance_check_other_text:(cache_data != null && cache_data.body_assistance_check_other_text != undefined) ? cache_data.body_assistance_check_other_text : "",
      future_treatment_issue:(cache_data != null && cache_data.future_treatment_issue != undefined) ? cache_data.future_treatment_issue : "",
      nurse_visit_guidance:cache_data != null ? cache_data.nurse_visit_guidance : 0,
      visit_nurse_need:cache_data != null ? cache_data.visit_nurse_need : 0,
      discharge_date:(cache_data != null && cache_data.discharge_date != undefined) ? new Date(cache_data.discharge_date.split("-").join("/")) : "",
      move_tool:(cache_data != null && cache_data.move_tool != undefined) ? cache_data.move_tool : "",
      nurse_taxi_check:(cache_data != null && cache_data.nurse_taxi_name != undefined) ? 1 : 0,
      nurse_taxi_name:(cache_data != null && cache_data.nurse_taxi_name != undefined) ? cache_data.nurse_taxi_name : "",
      discharge_after_doctor_id:(cache_data != null && cache_data.discharge_after_doctor_id != undefined) ? cache_data.discharge_after_doctor_id :0,
      home_doctor_id:(cache_data != null && cache_data.home_doctor_id != undefined) ? cache_data.home_doctor_id :0,
      visit_nurse_instruction_check:(cache_data != null && cache_data.visit_nurse_period_first != undefined) ? 1 :0,
      visit_nurse_period_first:(cache_data != null && cache_data.visit_nurse_period_first != undefined) ? cache_data.visit_nurse_period_first :"",
      visit_nurse_period_second:(cache_data != null && cache_data.visit_nurse_period_second != undefined) ? cache_data.visit_nurse_period_second :"",
      general_hospital_check:(cache_data != null && cache_data.general_hospital_check != undefined) ? 1 :0,
      emergency_other_check:(cache_data != null && cache_data.emergency_response_hospital != undefined) ? 1 : 0,
      emergency_response_hospital:(cache_data != null && cache_data.emergency_response_hospital != undefined) ? cache_data.emergency_response_hospital : "",
      send_information:(cache_data != null && cache_data.send_information != undefined) ? 1 : 0,
      recheck:(cache_data != null && cache_data.recheck != undefined) ? cache_data.recheck : "",
      confirm_type: '',
      confirm_message: '',
      doctor_names,
      nurse_names,
      alert_messages:"",
      print_preview: false,
      tab_id: 0,
      isOpenSelectDoctor:false,
    };
    this.injectcheck=["服薬管理","インスリン", "BS測定", "中心静脈栄養", "CVポート", "ペインコントロール", "末消点滴"];
    this.equipment_check=["人工呼吸器","在宅酸素療法", "ポンプ"];
    this.treat_check=["褥瘡","ストマ", "経管栄養", "吸引", "尿道留置カテーテル"];
    this.body_assistance_check=["清潔","食事", "排泄"];
    this.init_state = this.state;
    this.change_flag = 0;
  }

  async UNSAFE_componentWillMount() {
    await this.getStaffList();
  }

  getStaffList=async()=>{
    await apiClient.get("/app/api/v2/secure/staff/search?")
      .then((res) => {
        this.setState({
          staffs: res,
        });
      });
  }

  openStaffList = () => {
    this.setState({isOpenStaffList: true});
  };

  selectStaff=(staff)=>{
    this.change_flag = 1;
    this.setState({
      write_staff_number:staff.number,
      write_staff_name:staff.name,
      isOpenStaffList:false,
    });
  }

  setSelectValue = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };

  setCheckStatus = (name, value) => {
    this.change_flag = 1;
    this.setState({[name]: value});
  }

  setValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }

  setValueNumber = (key,e) => {
    this.change_flag = 1;
    if(parseInt(e.target.value) > 0){
      this.setState({[key]: e.target.value});
    } else {
      this.setState({[key]: this.state[key]});
    }
  }

  setPatientFamily = (e) => {
    this.change_flag = 1;
    this.setState({patient_family:parseInt(e.target.value)});
  };

  setNurseVisitGuidance = (e) => {
    this.change_flag = 1;
    this.setState({nurse_visit_guidance:parseInt(e.target.value)});
  };

  setVisitNurseNeed = (e) => {
    this.change_flag = 1;
    this.setState({visit_nurse_need:parseInt(e.target.value)});
  };

  setVisitNurseInstruction = (e) => {
    this.change_flag = 1;
    this.setState({visit_nurse_instruction_check:parseInt(e.target.value)});
  };

  setCheckArray =(name, number)=>{
    this.change_flag = 1;
    let check_array = this.state[name];
    let index = check_array.indexOf(number);
    if(index === -1){
      check_array.push(number);
    } else {
      check_array.splice(index, 1);
    }
    this.setState({[name]:check_array});
  };

  setWard=(e)=>{
    this.change_flag = 1;
    this.setState({first_ward_id:e.target.id});
  };

  setDate = (value, key) => {
    this.change_flag = 1;
    this.setState({[key]: value})
  }

  closeModal=()=>{
    this.setState({
      isOpenStaffList:false,
      alert_messages:"",
      confirm_message:"",
      print_preview: false,
      openGuidancePatientList:false,
      isOpenSelectDoctor:false,
    });
  };

  clear = () =>{
    if(this.change_flag == 0){
      return;
    }
    this.setState({
      confirm_type:"clear",
      confirm_message: "入力内容をクリアします。よろしいですか？"
    });
  }

  getRecheck = (e) => {
    this.change_flag = 1;
    this.setState({recheck: e.target.value});
  }

  checkState=(type)=>{
    if(this.state.start_date == null || this.state.start_date == ""){
      this.setState({alert_messages: "日時を選択してください。"});
      return;
    }
    if(this.state.start_time == null || this.state.start_time == ""){
      this.setState({alert_messages: "開始時間を選択してください。"});
      return;
    }
    if(this.state.end_time == null || this.state.end_time == ""){
      this.setState({alert_messages: "締め切り時間を選択してください。"});
      return;
    }
    if(this.state.start_time.getTime() > this.state.end_time.getTime()){
      this.setState({alert_messages: "開始時間が締め切りを過ぎています。"});
      return;
    }
    if(type == "print"){
      this.setState({print_preview: true});
    }
    if(type == "karte_deploy"){
      this.setState({
        confirm_type:"register",
        confirm_message: "登録しますか？"
      });
    }
  }

  handleOk=()=>{
    if(this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({isOpenSelectDoctor: true});
      return;
    }
    let discharge_guidance_report = {};
    discharge_guidance_report['number'] = this.state.number;
    discharge_guidance_report['patient_id'] = this.props.patientId;
    discharge_guidance_report['department_id'] = this.state.department_id;
    discharge_guidance_report['doctor_code'] = this.authInfo.staff_category === 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
    discharge_guidance_report['doctor_name'] = this.authInfo.staff_category === 1 ? this.authInfo.name : this.context.selectedDoctor.name;
    if(this.state.number > 0){
      discharge_guidance_report['isForUpdate'] = 1;
      discharge_guidance_report['last_doctor_code'] = this.state.last_doctor_code;
      discharge_guidance_report['last_doctor_name'] = this.state.last_doctor_name;
    }
    if(this.authInfo.staff_category !== 1){
      discharge_guidance_report['substitute_name'] = this.authInfo.name;
    }
    discharge_guidance_report['start_date'] = formatDateLine(this.state.start_date);
    discharge_guidance_report['start_time'] = formatTimeIE(this.state.start_time);
    discharge_guidance_report['end_time'] = formatTimeIE(this.state.end_time);
    discharge_guidance_report['write_staff_number'] = this.state.write_staff_number;
    discharge_guidance_report['write_staff_name'] = this.state.write_staff_name;
    if(this.state.doctor_check == 1 && this.state.doctor_id != 0){
      discharge_guidance_report['doctor_id'] = this.state.doctor_id;
      discharge_guidance_report['hospital_doctor_name'] = this.state.doctor_names[this.state.doctor_id];
    }
    if(this.state.nurse_check == 1 && this.state.nurse_id != 0){
      discharge_guidance_report['nurse_id'] = this.state.nurse_id;
      discharge_guidance_report['nurse_name'] = this.state.nurse_names[this.state.nurse_id];
    }
    if(this.state.discharge_support_nurse_check == 1 && this.state.discharge_support_nurse_id != 0){
      discharge_guidance_report['discharge_support_nurse_id'] = this.state.discharge_support_nurse_id;
      discharge_guidance_report['discharge_support_nurse_name'] = this.state.nurse_names[this.state.discharge_support_nurse_id];
    }
    if(this.state.msw_check == 1 && this.state.msw_text != ""){
      discharge_guidance_report['msw_text'] = this.state.msw_text;
    }
    if(this.state.hospital_other_check == 1 && this.state.hospital_other_text != ""){
      discharge_guidance_report['hospital_other_text'] = this.state.hospital_other_text;
    }
    if(this.state.instructed_nurse_check == 1 && this.state.instructed_nurse_id != 0){
      discharge_guidance_report['instructed_nurse_id'] = this.state.instructed_nurse_id;
      discharge_guidance_report['instructed_nurse_name'] = this.state.nurse_names[this.state.instructed_nurse_id];
    }
    if(this.state.visit_nurse_check == 1 && this.state.visit_nurse_id != 0){
      discharge_guidance_report['visit_nurse_id'] = this.state.visit_nurse_id;
      discharge_guidance_report['visit_nurse_name'] = this.state.nurse_names[this.state.visit_nurse_id];
    }
    if(this.state.care_manager_check == 1 && this.state.care_manager_name != ""){
      discharge_guidance_report['care_manager_name'] = this.state.care_manager_name;
    }
    if(this.state.outside_hospital_other_check == 1 && this.state.outside_hospital_other_text != ""){
      discharge_guidance_report['outside_hospital_other_text'] = this.state.outside_hospital_other_text;
    }
    if(this.state.recheck != ""){
      discharge_guidance_report['recheck'] = this.state.recheck;
    }
    if(this.state.check_inject.length > 0){
      discharge_guidance_report['check_inject'] = this.state.check_inject;
      discharge_guidance_report['check_inject_names'] = [];
      this.injectcheck.map((item, index)=>{
        if(this.state.check_inject.includes(index)){
          discharge_guidance_report['check_inject_names'].push(item);
        }
      });
    }
    if(this.state.check_equipment.length > 0){
      discharge_guidance_report['check_equipment'] = this.state.check_equipment;
      discharge_guidance_report['check_equipment_names'] = [];
      this.equipment_check.map((item, index)=>{
        if(this.state.check_equipment.includes(index)){
          discharge_guidance_report['check_equipment_names'].push(item);
        }
      });
    }
    if(this.state.check_treat.length > 0){
      discharge_guidance_report['check_treat'] = this.state.check_treat;
      discharge_guidance_report['check_treat_names'] = [];
      this.treat_check.map((item, index)=>{
        if(this.state.check_treat.includes(index)){
          discharge_guidance_report['check_treat_names'].push(item);
        }
      });
    }
    if(this.state.treat_check_other == 1 && this.state.treat_check_other_text != ""){
      discharge_guidance_report['treat_check_other_text'] = this.state.treat_check_other_text;
    }
    if(this.state.medicine_detail !== ""){
      discharge_guidance_report['medicine_detail'] = this.state.medicine_detail;
    }
    if(this.state.need_medicine !== ""){
      discharge_guidance_report['need_medicine'] = this.state.need_medicine;
    }
    if(this.state.check_body_assistance.length > 0){
      discharge_guidance_report['check_body_assistance'] = this.state.check_body_assistance;
      discharge_guidance_report['check_body_assistance_names'] = [];
      this.body_assistance_check.map((item, index)=>{
        if(this.state.check_body_assistance.includes(index)){
          discharge_guidance_report['check_body_assistance_names'].push(item);
        }
      });
    }
    if(this.state.body_assistance_check_other == 1 && this.state.body_assistance_check_other_text != ""){
      discharge_guidance_report['body_assistance_check_other_text'] = this.state.body_assistance_check_other_text;
    }
    if(this.state.future_treatment_issue !== ""){
      discharge_guidance_report['future_treatment_issue'] = this.state.future_treatment_issue;
    }
    discharge_guidance_report['nurse_visit_guidance'] = this.state.nurse_visit_guidance;
    discharge_guidance_report['visit_nurse_need'] = this.state.visit_nurse_need;
    if(this.state.discharge_date != null && this.state.discharge_date != ""){
      discharge_guidance_report['discharge_date'] = formatDateLine(this.state.discharge_date);
    }
    if(this.state.move_tool !== ""){
      discharge_guidance_report['move_tool'] = this.state.move_tool;
    }
    if(this.state.nurse_taxi_check == 1 && this.state.nurse_taxi_name != ""){
      discharge_guidance_report['nurse_taxi_name'] = this.state.nurse_taxi_name;
    }
    if(this.state.discharge_after_doctor_id != 0){
      discharge_guidance_report['discharge_after_doctor_id'] = this.state.discharge_after_doctor_id;
      discharge_guidance_report['discharge_after_doctor_name'] = this.state.doctor_names[this.state.discharge_after_doctor_id];
    }
    if(this.state.home_doctor_id != 0){
      discharge_guidance_report['home_doctor_id'] = this.state.home_doctor_id;
      discharge_guidance_report['home_doctor_name'] = this.state.doctor_names[this.state.home_doctor_id];
    }
    if(this.state.visit_nurse_instruction_check == 1 && parseInt(this.state.visit_nurse_period_first) > 0 && parseInt(this.state.visit_nurse_period_second) > 0){
      discharge_guidance_report['visit_nurse_period_first'] = this.state.visit_nurse_period_first;
      discharge_guidance_report['visit_nurse_period_second'] = this.state.visit_nurse_period_second;
    }
    discharge_guidance_report['general_hospital_check'] = this.state.general_hospital_check;
    if(this.state.emergency_other_check == 1 && this.state.body_assistance_check_other_text !== ""){
      discharge_guidance_report['body_assistance_check_other_text'] = this.state.body_assistance_check_other_text;
    }
    discharge_guidance_report['send_information'] = this.state.send_information;
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_GUIDANCE_REPORT, JSON.stringify(discharge_guidance_report), 'insert');
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  }

  confirmOk=()=>{
    if(this.state.confirm_type === "clear"){
      this.setState({
        department_id:this.props.department_id,
        start_date:new Date(),
        start_time:new Date(),
        end_time:"",
        write_staff_name:this.authInfo.name,
        write_staff_number:this.authInfo.user_number,
        patient_family:0,
        patient_name:"",
        family_name:"",
        doctor_check:0,
        doctor_id:0,
        nurse_check:0,
        nurse_id:0,
        discharge_support_nurse_check:0,
        discharge_support_nurse_id:0,
        msw_check:0,
        msw_text:"",
        hospital_other_check:0,
        hospital_other_text:"",
        instructed_nurse_check:0,
        instructed_nurse_id:0,
        visit_nurse_check:0,
        visit_nurse_id:0,
        care_manager_check:0,
        care_manager_name:"",
        outside_hospital_other_check:0,
        outside_hospital_other_text:"",
        check_inject:[],
        check_equipment:[],
        check_treat:[],
        treat_other_text:"",
        need_medicine:"",
        medicine_detail:"",
        check_body_assistance:[],
        treat_check_other:0,
        treat_check_other_text:"",
        body_assistance_check_other:0,
        body_assistance_check_other_text:"",
        future_treatment_issue:"",
        nurse_visit_guidance:0,
        visit_nurse_need:0,
        discharge_date:"",
        move_tool:"",
        nurse_taxi_check:0,
        nurse_taxi_name:"",
        discharge_after_doctor_id:0,
        home_doctor_id:0,
        visit_nurse_instruction_check:0,
        visit_nurse_period_first:"",
        visit_nurse_period_second:"",
        general_hospital_check:0,
        emergency_other_check:0,
        emergency_response_hospital:"",
        send_information:0,
        recheck:"",
        confirm_type: '',
        confirm_message: '',
      });
      this.change_flag = 0;
    }
    if(this.state.confirm_type == "register"){
      this.handleOk();
    }
  }

  setTab = ( e, val ) => {
    this.setState({
      tab_id:parseInt(val),
    });
  };

  onHide = () => {};
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }
  
  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.setState({isOpenSelectDoctor:false}, ()=>{
      this.handleOk();
    })
  }

  render() {
    return (
      <>
        <Modal show={true} onHide={this.onHide} className="custom-modal-sm patient-exam-modal medication-guidance-schedule first-view-modal">
          <Modal.Header><Modal.Title>退院時指導レポート</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox>
              <Wrapper>
                <div className={'flex'}>
                  <div className={'div-title'}>カンファレンス名</div>
                  <div className={'div-title'} style={{marginLeft:"0.5rem"}}>退院前合同カンファレンス(退院前共同指導)</div>
                </div>
                <div className={'flex'} style={{paddingTop:"0.3rem"}}>
                  <div className="select-date flex">
                    <div className={'div-title'} style={{width:"3rem"}}>日時</div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.start_date}
                      onChange={(e)=>this.setDate(e,"start_date")}
                      dateFormat="yyyy/MM/dd"
                      placeholderText=""
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      minDate={this.start_date}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    <div className="time-select flex" style={{marginLeft:"0.3rem"}}>
                      <DatePicker
                        selected={this.state.start_time}
                        onChange={(e) => this.setDate(e, 'start_time')}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        timeCaption="時間"
                      />
                      <div className={'div-title'} style={{marginLeft:"0.3rem", marginRight:"0.3rem"}}>~</div>
                      <DatePicker
                        selected={this.state.end_time}
                        onChange={(e) => this.setDate(e, 'end_time')}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        timeCaption="時間"
                      />
                    </div>
                  </div>
                  <div className={'flex'} style={{marginLeft:"0.5rem"}}>
                    <div className={'div-title'} style={{width:"4rem"}}>記載者</div>
                    <div className={'div-value'} style={{width:"20rem", cursor:"pointer", paddingLeft:"0.3rem"}} onClick={this.openStaffList.bind(this)}>
                      {this.state.write_staff_name == "" ? "クリックで選択" : this.state.write_staff_name}
                    </div>
                  </div>
                </div>
                <div className={'select-radio flex'} style={{paddingTop:"0.3rem"}}>
                  <Radiobox
                    label={'患者'}
                    value={0}
                    getUsage={this.setPatientFamily.bind(this)}
                    checked={this.state.patient_family === 0}
                    disabled={true}
                    name={`patient_family`}
                  />
                  <Radiobox
                    label={'家族・介護者'}
                    value={1}
                    getUsage={this.setPatientFamily.bind(this)}
                    checked={this.state.patient_family === 1}
                    disabled={true}
                    name={`patient_family`}
                  />
                  <InputBoxTag
                    label=""
                    type="text"
                    getInputText={this.setValue.bind(this, this.state.patient_family == 0 ? "patient_name" : "family_name")}
                    value = {this.state.patient_family == 0 ? this.state.patient_name : this.state.family_name}
                    className="patient-family-name"
                  />
                </div>
                <div className={'common-area'}>
                  <div className={'div-title'} style={{marginTop:"0.3rem"}}>【院内】</div>
                  <div className={'flex'}>
                    <div className={'select-check'}>
                      <Checkbox
                        label="医師"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.doctor_check}
                        name="doctor_check"
                      />
                    </div>
                    <div className="select-doctor" style={{marginRight:"1rem"}}>
                      <SelectorWithLabel
                        options={this.doctor_list}
                        title=""
                        getSelect={this.setSelectValue.bind(this, 'doctor_id')}
                        departmentEditCode={this.state.doctor_id}
                        isDisabled={this.state.doctor_check === 0}
                      />
                    </div>
                    <div className={'select-check'}>
                      <Checkbox
                        label="看護師"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.nurse_check}
                        name="nurse_check"
                      />
                    </div>
                    <div className="select-doctor">
                      <SelectorWithLabel
                        options={this.nurses_list}
                        title=""
                        getSelect={this.setSelectValue.bind(this, 'nurse_id')}
                        departmentEditCode={this.state.nurse_id}
                        isDisabled={this.state.nurse_check === 0}
                      />
                    </div>
                  </div>
                  <div className={'flex'}>
                    <div className={'select-check'}>
                      <Checkbox
                        label="退院支援看護師"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.discharge_support_nurse_check}
                        name="discharge_support_nurse_check"
                      />
                    </div>
                    <div className="select-doctor" style={{marginRight:"1rem"}}>
                      <SelectorWithLabel
                        options={this.nurses_list}
                        title=""
                        getSelect={this.setSelectValue.bind(this, 'discharge_support_nurse_id')}
                        departmentEditCode={this.state.discharge_support_nurse_id}
                        isDisabled={this.state.discharge_support_nurse_check === 0}
                      />
                    </div>
                    <div className={'select-check'}>
                      <Checkbox
                        label="ＭＳＷ"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.msw_check}
                        name="msw_check"
                      />
                    </div>
                    <div className="input-text no-label">
                      <InputBoxTag
                        label=""
                        type="text"
                        getInputText={this.setValue.bind(this, "msw_text")}
                        value = {this.state.msw_text}
                        className="input-box-tag"
                        isDisabled={this.state.msw_check === 0}
                      />
                    </div>
                  </div>
                  <div className={'flex'}>
                    <div className={'select-check'}>
                      <Checkbox
                        label="その他"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.hospital_other_check}
                        name="hospital_other_check"
                      />
                    </div>
                    <div className="input-text no-label">
                      <InputBoxTag
                        label=""
                        type="text"
                        getInputText={this.setValue.bind(this, "hospital_other_text")}
                        value = {this.state.hospital_other_text}
                        className="input-box-tag"
                        isDisabled={this.state.hospital_other_check === 0}
                      />
                    </div>
                  </div>
                  <div className={'div-title'} style={{marginTop:"0.3rem"}}>【院外】</div>
                  <div className={'flex'}>
                    <div className={'select-check'}>
                      <Checkbox
                        label="在宅医or指示を受けた看護師"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.instructed_nurse_check}
                        name="instructed_nurse_check"
                      />
                    </div>
                    <div className="select-doctor" style={{marginRight:"1rem"}}>
                      <SelectorWithLabel
                        options={this.nurses_list}
                        title=""
                        getSelect={this.setSelectValue.bind(this, 'instructed_nurse_id')}
                        departmentEditCode={this.state.instructed_nurse_id}
                        isDisabled={this.state.instructed_nurse_check === 0}
                      />
                    </div>
                    <div className={'select-check'}>
                      <Checkbox
                        label="訪問看護師"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.visit_nurse_check}
                        name="visit_nurse_check"
                      />
                    </div>
                    <div className="select-doctor" style={{marginRight:"1rem"}}>
                      <SelectorWithLabel
                        options={this.nurses_list}
                        title=""
                        getSelect={this.setSelectValue.bind(this, 'visit_nurse_id')}
                        departmentEditCode={this.state.visit_nurse_id}
                        isDisabled={this.state.visit_nurse_check === 0}
                      />
                    </div>
                  </div>
                  <div className={'flex'}>
                    <div className={'select-check'}>
                      <Checkbox
                        label="ケアマネージャー"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.care_manager_check}
                        name="care_manager_check"
                      />
                    </div>
                    <div className="input-text no-label" style={{marginRight:"1rem"}}>
                      <InputBoxTag
                        label=""
                        type="text"
                        getInputText={this.setValue.bind(this, "care_manager_name")}
                        value = {this.state.care_manager_name}
                        className="input-box-tag"
                        isDisabled={this.state.care_manager_check === 0}
                      />
                    </div>
                    <div className={'select-check'}>
                      <Checkbox
                        label="その他"
                        getRadio={this.setCheckStatus.bind(this)}
                        value={this.state.outside_hospital_other_check}
                        name="outside_hospital_other_check"
                      />
                    </div>
                    <div className="input-text no-label" style={{marginRight:"1rem"}}>
                      <InputBoxTag
                        label=""
                        type="text"
                        getInputText={this.setValue.bind(this, "outside_hospital_other_text")}
                        value = {this.state.outside_hospital_other_text}
                        className="input-box-tag"
                        isDisabled={this.state.outside_hospital_other_check === 0}
                      />
                    </div>
                  </div>
                  <div className={'div-title'} style={{marginTop:"0.3rem"}}>病状・病期の説明と患者・家族の理解の再確認</div>
                  <div className={'text-area'}>
                  <textarea
                    onChange={this.getRecheck.bind(this)}
                    value={this.state.recheck}
                  />
                  </div>
                </div>
                <div className="panel-menu flex">
                  { this.state.tab_id === 0 ? (
                    <><div className="active-menu">共同指導内容</div></>
                  ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>共同指導内容</div></>
                  )}
                  { this.state.tab_id === 1 ? (
                    <><div className="active-menu">今後の治療課題・生活課題</div></>
                  ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>今後の治療課題・生活課題</div></>
                  )}
                  { this.state.tab_id === 2 ? (
                    <><div className="active-menu">退院予定日・緊急時対応</div></>
                  ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 2);}}>退院予定日・緊急時対応</div></>
                  )}
                </div>
                {this.state.tab_id == 0 && (
                  <div className="tab-area first-tab">
                    <div className={'div-title'}>医療処置</div>
                    <div style={{width:"100%", paddingLeft:"0.3rem"}}>
                      <div className={'div-title'}>【薬・注射】</div>
                      <div className={'flex'}>
                        {this.injectcheck.map((item, index) => {
                          return (
                            <>
                              <div className={'select-check'} style={{marginRight:"0.5rem"}}>
                                <Checkbox
                                  label={item}
                                  getRadio={this.setCheckArray.bind(this)}
                                  value={(this.state.check_inject.includes(index))}
                                  number={index}
                                  name="check_inject"
                                />
                              </div>
                            </>
                          )
                        })}
                      </div>
                      <div>【医療機器】</div>
                      <div className={'flex'}>
                        {this.equipment_check.map((item, index) => {
                          return (
                            <>
                              <div className={'select-check'} style={{marginRight:"0.5rem"}}>
                                <Checkbox
                                  label={item}
                                  getRadio={this.setCheckArray.bind(this)}
                                  value={(this.state.check_equipment.includes(index))}
                                  number={index}
                                  name="check_equipment"
                                />
                              </div>
                            </>
                          )
                        })}
                      </div>
                      <div>【医療処置】</div>
                      <div className={'flex'}>
                        {this.treat_check.map((item, index) => {
                          return (
                            <>
                              <div className={'select-check'} style={{marginRight:"0.5rem"}}>
                                <Checkbox
                                  label={item}
                                  getRadio={this.setCheckArray.bind(this)}
                                  value={(this.state.check_treat.includes(index))}
                                  number={index}
                                  name="check_treat"
                                />
                              </div>
                            </>
                          )
                        })}
                        <div className={'select-check'} style={{marginRight:"0.5rem"}}>
                          <Checkbox
                            label={'その他'}
                            getRadio={this.setCheckStatus.bind(this)}
                            value={this.state.treat_check_other}
                            name="treat_check_other"
                          />
                        </div>
                        <div className="inputboxtag no-label">
                          <InputBoxTag
                            label=""
                            type="text"
                            getInputText={this.setValue.bind(this, "treat_check_other_text")}
                            value = {this.state.treat_check_other_text}
                            className="input-box-tag"
                            isDisabled={this.state.treat_check_other === 0}
                          />
                        </div>
                      </div>
                      <div>詳細</div>
                      <div className={'text-area'}>
                        <textarea
                          onChange={this.setValue.bind(this,"medicine_detail")}
                          value={this.state.medicine_detail}
                        />
                      </div>
                      <div>必要な医薬物品（製品名）・調達先</div>
                      <div className={'text-area'}>
                        <textarea
                          onChange={this.setValue.bind(this,"need_medicine")}
                          value={this.state.need_medicine}
                        />
                      </div>
                      <div>身体援助</div>
                      <div className={'flex'}>
                        {this.body_assistance_check.map((item, index) => {
                          return (
                            <>
                              <div className={'select-check'} style={{marginRight:"0.5rem"}}>
                                <Checkbox
                                  label={item}
                                  getRadio={this.setCheckArray.bind(this)}
                                  value={(this.state.check_body_assistance.includes(index))}
                                  number={index}
                                  name="check_body_assistance"
                                />
                              </div>
                            </>
                          )
                        })}
                        <div className={'select-check'} style={{marginRight:"0.5rem"}}>
                          <Checkbox
                            label={'その他'}
                            getRadio={this.setCheckStatus.bind(this)}
                            value={this.state.body_assistance_check_other}
                            name="body_assistance_check_other"
                          />
                        </div>
                        <div className="inputboxtag no-label">
                          <InputBoxTag
                            label=""
                            type="text"
                            getInputText={this.setValue.bind(this, "body_assistance_check_other_text")}
                            value = {this.state.body_assistance_check_other_text}
                            className="input-box-tag"
                            isDisabled={this.state.body_assistance_check_other === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {this.state.tab_id == 1 && (
                  <div className="tab-area">
                    <div className={'div-title'}>今後の治療課題・生活課題</div>
                    <div className={'text-area'} style={{height:"6rem"}}>
                      <textarea
                        onChange={this.setValue.bind(this, "future_treatment_issue")}
                        value={this.state.future_treatment_issue}
                      />
                    </div>
                    <div className={'flex'}>
                      <div style={{width:"50%"}}>
                        <div className={'div-title'}>【退院後(一ヶ月以内）病院看護師の訪問指導】</div>
                        <div className={'select-radio flex'}>
                          <Radiobox
                            label="無"
                            value={0}
                            getUsage={this.setNurseVisitGuidance.bind(this)}
                            checked={this.state.nurse_visit_guidance === 0}
                            name="nurse_visit_guidance"
                          />
                          <Radiobox
                            label="有"
                            value={1}
                            getUsage={this.setNurseVisitGuidance.bind(this)}
                            checked={this.state.nurse_visit_guidance === 1}
                            name="nurse_visit_guidance"
                          />
                        </div>
                      </div>
                      <div style={{width:"50%"}}>
                        <div className={'div-title'}>【退院直後・特別指示書での訪問看護の必要性】</div>
                        <div className={'select-radio flex'}>
                          <Radiobox
                            label="無"
                            value={0}
                            getUsage={this.setVisitNurseNeed.bind(this)}
                            checked={this.state.visit_nurse_need === 0}
                            name="visit_nurse_need"
                          />
                          <Radiobox
                            label="有"
                            value={1}
                            getUsage={this.setVisitNurseNeed.bind(this)}
                            checked={this.state.visit_nurse_need === 1}
                            name="visit_nurse_need"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {this.state.tab_id == 2 && (
                  <div className="tab-area third-tab">
                    <div className="div-title">【退院予定日】</div>
                    <div style={{marginLeft:"0.5rem"}}>
                      <div className="select-date flex">
                        <div className="div-title" style={{width:"10rem"}}>退院予定日</div>
                        <DatePicker
                          locale="ja"
                          selected={this.state.discharge_date}
                          onChange={(e)=>this.setDate(e,"discharge_date")}
                          dateFormat="yyyy/MM/dd"
                          placeholderText=""
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          minDate={this.start_date}
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                      <div className="inputboxtag means-transportation" style={{marginTop:"0.3rem"}}>
                        <InputBoxTag
                          label="移送手段"
                          type="text"
                          getInputText={this.setValue.bind(this, "move_tool")}
                          value = {this.state.move_tool}
                          className="input-box-tag"
                        />
                      </div>
                      <div className="flex care-taxi" style={{marginTop:"0.3rem"}}>
                        <div className="select-check">
                          <Checkbox
                            label="介護タクシー"
                            getRadio={this.setCheckStatus.bind(this)}
                            value={this.state.nurse_taxi_check}
                            name="nurse_taxi_check"
                          />
                        </div>
                        <div className={'inputboxtag no-label'}>
                          <InputBoxTag
                            label=""
                            type="text"
                            getInputText={this.setValue.bind(this, "nurse_taxi_name")}
                            value = {this.state.nurse_taxi_name}
                            className="input-box-tag"
                            isDisabled={this.state.nurse_taxi_check === 0}
                          />
                        </div>
                      </div>
                      <div className="flex" style={{marginTop:"0.3rem"}}>
                        <div className={'div-title'} style={{width:"10rem"}}>退院後の主治医</div>
                        <div className="select-doctor">
                          <SelectorWithLabel
                            options={this.doctor_list}
                            title=""
                            getSelect={this.setSelectValue.bind(this, 'discharge_after_doctor_id')}
                            departmentEditCode={this.state.discharge_after_doctor_id}
                          />
                        </div>
                      </div>
                      <div className="flex" style={{marginTop:"0.3rem"}}>
                        <div className={'div-title'} style={{width:"10rem"}}>在宅医</div>
                        <div className="select-doctor">
                          <SelectorWithLabel
                            options={this.doctor_list}
                            title=""
                            getSelect={this.setSelectValue.bind(this, 'home_doctor_id')}
                            departmentEditCode={this.state.home_doctor_id}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex" style={{marginTop:"0.3rem"}}>
                      <div className="div-title" style={{width:"10rem"}}>【訪問看護指示書】</div>
                      <div className="select-radio flex">
                        <Radiobox
                          label="不要"
                          value={0}
                          getUsage={this.setVisitNurseInstruction.bind(this)}
                          checked={this.state.visit_nurse_instruction_check === 0}
                          name="visit_nurse_instruction_check"
                        />
                        <Radiobox
                          label="要"
                          value={1}
                          getUsage={this.setVisitNurseInstruction.bind(this)}
                          checked={this.state.visit_nurse_instruction_check === 1}
                          name="visit_nurse_instruction_check"
                        />
                      </div>
                      <div className="no-label inputboxtag period-month">
                        <InputBoxTag
                          label=""
                          type="text"
                          getInputText={this.setValueNumber.bind(this, "visit_nurse_period_first")}
                          value = {this.state.visit_nurse_period_first}
                          className="input-box-tag"
                          isDisabled={this.state.visit_nurse_instruction_check === 0}
                        />
                      </div>
                      <div className="div-title" style={{marginLeft:"0.3rem", marginRight:"0.3rem"}}>～</div>
                      <div className="no-label inputboxtag period-month">
                        <InputBoxTag
                          label=""
                          type="text"
                          getInputText={this.setValueNumber.bind(this, "visit_nurse_period_second")}
                          value = {this.state.visit_nurse_period_second}
                          className="input-box-tag"
                          isDisabled={this.state.visit_nurse_instruction_check === 0}
                        />
                      </div>
                      <div className="div-title" style={{marginLeft:"0.3rem"}}>ヶ月</div>
                    </div>
                    <div className="div-title">【緊急時対応】</div>
                    <div style={{marginLeft:"0.5rem"}}>
                      <div className={'select-check'}>
                        <Checkbox
                          label={'県立総合病院'}
                          getRadio={this.setCheckStatus.bind(this)}
                          value={this.state.general_hospital_check}
                          name="general_hospital_check"
                        />
                      </div>
                      <div className={'flex'}>
                        <div className={'select-check'} style={{width:"10rem"}}>
                          <Checkbox
                            label={'その他'}
                            getRadio={this.setCheckStatus.bind(this)}
                            value={this.state.emergency_other_check}
                            name="emergency_other_check"
                          />
                        </div>
                        <div className="inputboxtag no-label">
                          <InputBoxTag
                            label=""
                            type="text"
                            getInputText={this.setValue.bind(this, "emergency_response_hospital")}
                            value = {this.state.emergency_response_hospital}
                            className="input-box-tag"
                            isDisabled={this.state.emergency_other_check === 0}
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="div-title" style={{width:"10rem"}}>病院⇔ステーション</div>
                        <div className={'select-check'}>
                          <Checkbox
                            label="１週間～１ヶ月の間に、別紙にて情報の送信をお願いいたします"
                            getRadio={this.setCheckStatus.bind(this)}
                            value={this.state.send_information}
                            name="send_information"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="cancel-btn" onClick={this.clear}>クリア</Button>
            <Button className="red-btn" onClick={this.checkState.bind(this, "print")}>印刷</Button>
            <Button className="red-btn" onClick={this.checkState.bind(this, "karte_deploy")}>カルテに展開</Button>
          </Modal.Footer>
          {this.state.print_preview && (
            <LeaveHospitalReportPrintModal
              print_data = {this.state}
              closeModal={this.closeModal}
            />
          )}
          {this.state.isOpenStaffList && (
            <DialSelectMasterModal
              selectMaster = {this.selectStaff}
              closeModal = {this.closeModal}
              MasterCodeData = {this.state.staffs}
              MasterName = 'スタッフ'
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isOpenSelectDoctor && (
            <SelectDoctorModal
              closeDoctor={this.closeModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
        </Modal>
      </>
    );
  }
}

LeaveHospitalGuidanceReport.contextType = Context;
LeaveHospitalGuidanceReport.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  department_id: PropTypes.number,
  report_order_data: PropTypes.object
};

export default LeaveHospitalGuidanceReport;
