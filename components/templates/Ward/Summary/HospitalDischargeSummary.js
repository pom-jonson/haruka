import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import {formatDateSlash, formatDateString, formatTime, formatTimeIE} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import DiseaseNameList from "~/components/templates/Patient/DiseaseNameList";
import SelectHospitalDescription from "~/components/templates/Patient/Modals/Allergy/SelectHospitalDescription";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import RegisterComment from "~/components/templates/Ward/Summary/RegisterComment";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import {harukaValidate} from "~/helpers/haruka_validate";
import $ from "jquery";
import {getServerTime} from "~/helpers/constants";
import axios from "axios/index";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  .flex{display: flex;}
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .div-title{
    line-height:2rem;
  }
  .div-box-value{
    border:1px solid #aaa;
    line-height:2rem;
    padding:0 0.2rem;
    margin-right:0.5rem;
    word-break: break-all;
  }
  .panel-menu {
    margin-top:0.3rem;
    display:flex;
    width: 100%;
    font-size: 1rem;
    .menu-btn {
      width:100px;
      text-align: center;
      border: 1px solid #aaa;
      background-color: rgba(200, 194, 194, 0.22);
      height: 2rem;
      line-height: 2rem;
      cursor: pointer;
    }
    .active-menu {
      width:7rem;
      text-align: center;
      border-top: 1px solid #aaa;
      border-right: 1px solid #aaa;
      border-left: 1px solid #aaa;
      height: 2rem;
      line-height: 2rem;
    }
    .no-menu {
      width: calc(100% - 7rem);
      border-bottom: 1px solid #aaa;
    }
  }
  .panel-body {
    overflow-y:auto;
    height: calc(100% - 8rem);
    padding:0.3rem;
    border-bottom: 1px solid #aaa;
    border-right: 1px solid #aaa;
    border-left: 1px solid #aaa;
  }
  .summary-area {
    width:100%;
    height:100%;
    table {
      font-size: 1rem;
      margin-bottom: 0;
    }
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;
      tr{width: calc(100% - 17px);}
    }
    tbody{
      overflow-y: scroll;
      display:block;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
      padding: 0.2rem;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid #dee2e6;
    }
    th {
      text-align: center;
      padding: 0.2rem;
    }
    .div-box-list {
      border:1px solid #aaa;
      overflow-y:auto;
      height:6vh;
      width:calc(100% - 5rem);
      padding: 0.2rem;
    }
    .disease-name-table {
      width:calc(100% - 5rem);
      tbody{height:6vh;}
    }
    .left-area {
      width:50%;
      padding-right:0.5rem;
    }
    .right-area {
      width:50%;
      padding-left:0.5rem;
      .label-title {display:none;}
      .pullbox-label {
        width:100%;
        margin:0;
        .pullbox-select {
          height:2rem;
          font-size:1rem;
          width:100%;
        }
      }
    }
  }
  .div-disable-button{
    border: 2px solid rgb(126, 126, 126) !important;
    width: 100%;
    height: calc(2rem + 2px);
    line-height: calc(2rem + 2px);
    text-align: center;
    padding:0 0.2rem;
    background: rgb(239, 239, 239);
    cursor: pointer;
  }
  .item-title {
    font-size: 0.8rem;
    width:6rem;
  }
  .item-value {
    font-size: 0.8rem;
    width:calc(100% - 6rem);
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class HospitalDischargeSummary extends Component {
  constructor(props) {
    super(props);
    this.init_state = {
      progress_to_hospitalization:(props.modal_data.summary_data != null && props.modal_data.summary_data.progress_to_hospitalization != null) ? props.modal_data.summary_data.progress_to_hospitalization : "",
      current_symptoms_on_admission:(props.modal_data.summary_data != null && props.modal_data.summary_data.current_symptoms_on_admission != null) ? props.modal_data.summary_data.current_symptoms_on_admission : "",
      medical_history_allergies:(props.modal_data.summary_data != null && props.modal_data.summary_data.medical_history_allergies != null) ? props.modal_data.summary_data.medical_history_allergies : "",
      clinical_course:(props.modal_data.summary_data != null && props.modal_data.summary_data.clinical_course != null) ? props.modal_data.summary_data.clinical_course : "",
      discharge_prescription:(props.modal_data.summary_data != null && props.modal_data.summary_data.discharge_prescription != null) ? props.modal_data.summary_data.discharge_prescription : "",
      reservation_information_after_discharge:(props.modal_data.summary_data != null && props.modal_data.summary_data.reservation_information_after_discharge != null) ? props.modal_data.summary_data.reservation_information_after_discharge : "",
      referral_transfer:(props.modal_data.summary_data != null && props.modal_data.summary_data.referral_transfer != null) ? props.modal_data.summary_data.referral_transfer : 0,
      referral_doctor:(props.modal_data.summary_data != null && props.modal_data.summary_data.referral_doctor != null) ? props.modal_data.summary_data.referral_doctor : 0,
    };
    this.state = {
      load_flag:false,
      tab_id:0,
      created_at:new Date(),
      discharge_date:props.modal_data.discharge_date != null ? new Date(props.modal_data.discharge_date.split('-').join('/')) : null,
      isOpenDiseaseNameList:false,
      isOpenSelectHospitalDescription:false,
      progress_to_hospitalization:(props.modal_data.summary_data != null && props.modal_data.summary_data.progress_to_hospitalization != null) ? props.modal_data.summary_data.progress_to_hospitalization : "",
      current_symptoms_on_admission:(props.modal_data.summary_data != null && props.modal_data.summary_data.current_symptoms_on_admission != null) ? props.modal_data.summary_data.current_symptoms_on_admission : "",
      medical_history_allergies:(props.modal_data.summary_data != null && props.modal_data.summary_data.medical_history_allergies != null) ? props.modal_data.summary_data.medical_history_allergies : "",
      clinical_course:(props.modal_data.summary_data != null && props.modal_data.summary_data.clinical_course != null) ? props.modal_data.summary_data.clinical_course : "",
      discharge_prescription:(props.modal_data.summary_data != null && props.modal_data.summary_data.discharge_prescription != null) ? props.modal_data.summary_data.discharge_prescription : "",
      reservation_information_after_discharge:(props.modal_data.summary_data != null && props.modal_data.summary_data.reservation_information_after_discharge != null) ? props.modal_data.summary_data.reservation_information_after_discharge : "",
      referral_transfer:(props.modal_data.summary_data != null && props.modal_data.summary_data.referral_transfer != null) ? props.modal_data.summary_data.referral_transfer : 0,
      referral_doctor:(props.modal_data.summary_data != null && props.modal_data.summary_data.referral_doctor != null) ? props.modal_data.summary_data.referral_doctor : 0,
      remit_comment:(props.modal_data.summary_data != null && props.modal_data.summary_data.remit_comment != null) ? props.modal_data.summary_data.remit_comment : "",
      correction_request_comment:(props.modal_data.summary_data != null && props.modal_data.summary_data.correction_request_comment != null) ? props.modal_data.summary_data.correction_request_comment : "",
      confirm_type:"",
      confirm_title:'',
      confirm_message:"",
      isOpenRegisterComment:false,
      dial_other_facilities_master:[{id:0, value:""}],
      complete_message:"",
      alert_type:"",
      alert_title:"",
      alert_messages:"",
      check_message:"",
    };
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.doctor_code;
        doctor.value = doctor.name;
        this.doctor_list.push(doctor);
      }
    });
    this.doctor_list.unshift({id:0,value:''});
    this.change_flag = 0;
  }

  async componentDidMount() {
    await this.getHospitalDischargeSummaryInfo();
  }
  
  getHospitalDischargeSummaryInfo=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/ward/get/summary/hospital_discharge/master";
    let post_data = {
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        let dial_other_facilities_master = this.state.dial_other_facilities_master;
        if(res.dial_other_facilities_master.length > 0){
          res.dial_other_facilities_master.map(item=>{
            dial_other_facilities_master.push({id:item.number, value:item.name});
          })
        }
        this.setState({
          dial_other_facilities_master,
          load_flag:true,
        });
      })
  }
  
  setTab=(tab_id)=>{
    this.setState({tab_id,});
  }
  
  setSelectValue = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };
  
  setToday=()=>{
    this.setState({discharge_date:new Date()});
  }
  
  openDiseaseNameList=()=>{
    this.setState({isOpenDiseaseNameList:true});
  }
  
  closeModal=(act)=>{
    if(this.state.alert_type === "modal_close" || act === "modal_close"){
      this.props.closeModal("register");
    }
    this.setState({
      isOpenDiseaseNameList:false,
      isOpenSelectHospitalDescription:false,
      isOpenRegisterComment:false,
      confirm_type:"",
      confirm_title:'',
      confirm_message:"",
      alert_type:"",
      alert_title:"",
      alert_messages:"",
    });
  }
  
  openSelectHospitalDescription=(hospital_description_type)=>{
    this.setState({
      isOpenSelectHospitalDescription:true,
      hospital_description_type,
    });
  }
  
  setHospitalDescription=(data)=>{
    let state_data = {};
    state_data.isOpenSelectHospitalDescription = false;
    let description = this.state[this.state.hospital_description_type];
    if(description !== ""){
      description = description + "\n";
    }
    description = description + data;
    state_data[this.state.hospital_description_type] = description;
    this.change_flag = 1;
    this.setState(state_data);
  }
  
  getHistoryInfo=(history)=>{
    let history_arr = history == null ? [] : history.split(',');
    let history_length = history_arr.length == 0 ? 1 : history_arr.length;
    return ((history_length > 9) ? history_length+"" : "0"+history_length)+"版 ";
  }
  
  goKarte=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"go_karte",
        confirm_title:'入力中',
      });
    } else {
      this.props.goKarte(this.props.modal_data);
    }
  }
  
  confirmModalClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"modal_close",
        confirm_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type === "go_karte"){
      this.closeModal();
      this.props.goKarte(this.props.modal_data);
    }
    if(this.state.confirm_type === "register"){
      this.register();
    }
    if(this.state.confirm_type === "clear"){
      this.clear();
    }
    if(this.state.confirm_type === "print"){
      this.printPdf();
    }
  }
  
  openRegisterComment=(type)=>{
    if(this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.is_created == 1){
      this.setState({
        isOpenRegisterComment:true,
        comment_type:type,
      });
    }
  }
  
  setTextValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }
  
  confirmSave=(is_created)=>{
    let change_flag = false;
    if(this.state.load_flag){
      Object.keys(this.init_state).map((k) => {
        if (!change_flag && (this.init_state[k] !== this.state[k])) {
          change_flag = true;
        }
      });
    }
    if(is_created == 0){
      if(!change_flag){return;}
    } else {
      if(!(change_flag || (this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.is_created == 0))){return;}
    }
    let error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }
    this.setState({
      confirm_type:"register",
      confirm_title:'保存確認',
      confirm_message:(is_created == 1 ? "保存" : "仮保存")+"しますか？",
      confirm_value:is_created
    });
  }
  
  register=async()=>{
    this.setState({
      complete_message:"保存中",
      confirm_type : "",
      confirm_title : "",
      confirm_message : "",
    });
    let path = "/app/api/v2/ward/summary/hospital_discharge/register";
    let post_data = {
      number:this.props.modal_data.summary_data == null ? 0 : this.props.modal_data.summary_data.number,
      patient_id:this.props.modal_data.patient_id,
      hospitalization_id:this.props.modal_data.number,
      progress_to_hospitalization:this.state.progress_to_hospitalization,
      current_symptoms_on_admission:this.state.current_symptoms_on_admission,
      medical_history_allergies:this.state.medical_history_allergies,
      clinical_course:this.state.clinical_course,
      discharge_prescription:this.state.discharge_prescription,
      reservation_information_after_discharge:this.state.reservation_information_after_discharge,
      referral_transfer:this.state.referral_transfer,
      referral_doctor:this.state.referral_doctor,
      is_created:this.state.confirm_value,
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        this.setState({
          complete_message:"",
          alert_type:res.alert_message !== undefined ? "modal_close" : "",
          alert_title:"保存確認",
          alert_messages:res.alert_message !== undefined ? res.alert_message : res.error_message,
        });
      })
      .catch(()=> {
        this.setState({complete_message:""});
      })
  }
  
  confirmClear=()=>{
    let change_flag = false;
    if(this.state.load_flag){
      Object.keys(this.init_state).map((k) => {
        if (!change_flag && (this.init_state[k] !== this.state[k])) {
          change_flag = true;
        }
      });
    }
    if(!change_flag){return;}
    this.setState({
      confirm_type:"clear",
      confirm_title:'クリア確認',
      confirm_message:"クリアしますか？",
    });
  }
  
  clear=()=>{
    let state_data = JSON.parse(JSON.stringify(this.init_state));
    state_data.confirm_type = "";
    state_data.confirm_title = "";
    state_data.confirm_message = "";
    this.setState(state_data);
  }
  
  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('karte', 'summary', 'register_summary', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  
  closeValidateAlertModal = () => {
    this.setState({check_message: ""});
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  
  confirmPrint=()=>{
    let error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }
    this.setState({
      confirm_type:"print",
      confirm_title:"印刷確認",
      confirm_message:"印刷しますか？",
    });
  }
  
  get_title_pdf =async() => {
    let server_time = await getServerTime(); // y/m/d H:i:s
    let pdf_file_name = "退院サマリー_" + this.props.modal_data.patient_number + "_" + formatDateString(new Date(server_time)) + ".pdf";
    return pdf_file_name;
  }
  
  printPdf=async()=>{
    this.setState({
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      complete_message:"印刷中"
    });
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/ward/summary/hospital_discharge/print";
    let print_data = {};
    print_data.patient_info = this.props.modal_data;
    print_data.summary_info = this.state;
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
      } else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', pdf_file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    })
    .catch(() => {
      this.setState({
        complete_message:"",
        alert_title:"印刷確認",
        alert_messages:"印刷失敗",
      });
    });
  }
  
  render() {
    let modal_data = this.props.modal_data;
    let change_flag = false;
    if(this.state.load_flag){
      Object.keys(this.init_state).map((k) => {
        if (!change_flag && (this.init_state[k] !== this.state[k])) {
          change_flag = true;
        }
      });
    }
    return (
      <>
        <Modal show={true} className="custom-modal-sm summary-list-modal first-view-modal">
          <Modal.Header><Modal.Title>退院サマリー</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.load_flag ? (
                <>
                  <div className={'flex'}>
                    <div className={'div-title'} style={{width:"4rem"}}>患者ID</div>
                    <div className={'div-box-value'} style={{minWidth:"10rem"}}>{modal_data.patient_number}</div>
                    <div className={'div-title'} style={{width:"5rem"}}>患者氏名</div>
                    <div className={'div-box-value'} style={{minWidth:"15rem"}}>{modal_data.patient_name}</div>
                    <div className={'div-title'} style={{width:"5rem"}}>生年月日</div>
                    <div className={'div-box-value'} style={{minWidth:"6rem"}}>{modal_data.birth_day}</div>
                    <div className={'div-title'} style={{width:"3rem"}}>性別</div>
                    <div className={'div-box-value'} style={{minWidth:"3rem"}}>{modal_data.gender == 1 ? "男" : "女"}性</div>
                    <div className={'div-title'} style={{width:"3rem"}}>年齢</div>
                    <div className={'div-box-value'} style={{minWidth:"6rem"}}>{(modal_data.age)+'歳 '+(modal_data.age_month)+'ヶ月'}</div>
                    <div className={'div-title'} style={{width:"5rem"}}>郵便番号</div>
                    <div className={'div-box-value'} style={{minWidth:"10rem"}}>{modal_data.postal_code}</div>
                    <div className={'div-title'} style={{width:"4rem"}}>入力日</div>
                    <div className={'div-box-value'} style={{minWidth:"9rem"}}>{formatDateSlash(this.state.created_at) + " " + formatTimeIE(this.state.created_at)}</div>
                  </div>
                  <div className={'flex'} style={{marginTop:"0.3rem"}}>
                    <div className={'div-title'} style={{width:"4rem"}}>診療科</div>
                    <div className={'div-box-value'} style={{minWidth:"10rem"}}>{modal_data.department_name}</div>
                    <div className={'div-title'} style={{width:"5rem"}}>カナ氏名</div>
                    <div className={'div-box-value'} style={{minWidth:"15rem"}}>{modal_data.patient_name_kana}</div>
                    <div className={'div-title'} style={{width:"5rem"}}>保険区分</div>
                    <div className={'div-box-value'} style={{minWidth:"6rem"}}> </div>
                    <div className={'div-title'} style={{width:"3rem"}}>住所</div>
                    <div className={'div-box-value'} style={{minWidth:"12.5rem"}}>{modal_data.address}</div>
                    <div className={'div-title'} style={{width:"5rem"}}>電話番号</div>
                    <div className={'div-box-value'} style={{minWidth:"10rem"}}>{modal_data.phone_number}</div>
                    <div className={'div-title'} style={{width:"4rem"}}>
                      <div className={'div-disable-button'} onClick={this.setToday.bind(this)}>退院日</div>
                    </div>
                    <div className={'div-box-value'} style={{minWidth:"9rem"}}>
                      {this.state.discharge_date != null ? (formatDateSlash(this.state.discharge_date) + " " + formatTime(this.state.discharge_date)) : ""}
                    </div>
                  </div>
                  <div className="panel-menu">
                    {this.state.tab_id === 0 ? (
                      <div className="active-menu">退院サマリー</div>
                    ) : (
                      <div className="menu-btn" onClick={this.setTab.bind(this, 0)}>退院サマリー</div>
                    )}
                    <div className="no-menu"/>
                  </div>
                  <div className={'panel-body'}>
                    <div className={'summary-area flex justify-content'}>
                      <div className={'left-area'}>
                        <div>入院時診断名</div>
                        <div className={'flex justify-content'}>
                          <div className={'disease-name-table'}>
                            <table className="table-scroll table table-bordered">
                              <thead>
                              <tr>
                                <th style={{width:"3rem"}}/>
                                <th style={{width:"3rem"}}>分類</th>
                                <th>病名名称</th>
                                <th style={{width:"6rem"}}>発症日</th>
                                <th style={{width:"6rem"}}>診断日</th>
                              </tr>
                              </thead>
                              <tbody>
              
                              </tbody>
                            </table>
                          </div>
                          <div><button onClick={this.openDiseaseNameList.bind(this)}>選択</button></div>
                        </div>
                        <div>退院時診断名</div>
                        <div className={'flex justify-content'}>
                          <div className={'disease-name-table'}>
                            <table className="table-scroll table table-bordered">
                              <thead>
                              <tr>
                                <th style={{width:"3rem"}}/>
                                <th style={{width:"3rem"}}>分類</th>
                                <th>病名名称</th>
                                <th style={{width:"6rem"}}>発症日</th>
                                <th style={{width:"6rem"}}>診断日</th>
                              </tr>
                              </thead>
                              <tbody>
              
                              </tbody>
                            </table>
                          </div>
                          <div>
                            <div><button>選択</button></div>
                            <div style={{marginTop:"0.5rem"}}><button>同上</button></div>
                          </div>
                        </div>
                        <div>入院までの経過</div>
                        <div className={'flex justify-content'}>
                          <div className={'div-box-list'}>
                            <textarea
                              value={this.state.progress_to_hospitalization}
                              style={{width:"100%", height:"100%"}}
                              id={'progress_to_hospitalization_id'}
                              onChange={this.setTextValue.bind(this, 'progress_to_hospitalization')}
                            />
                          </div>
                          <div><button onClick={this.openSelectHospitalDescription.bind(this, "progress_to_hospitalization")}>追加</button></div>
                        </div>
                        <div>入院時現症</div>
                        <div className={'flex justify-content'}>
                          <div className={'div-box-list'}>
                            <textarea
                              value={this.state.current_symptoms_on_admission}
                              style={{width:"100%", height:"100%"}}
                              id={'current_symptoms_on_admission_id'}
                              onChange={this.setTextValue.bind(this, 'current_symptoms_on_admission')}
                            />
                          </div>
                          <div><button onClick={this.openSelectHospitalDescription.bind(this, "current_symptoms_on_admission")}>追加</button></div>
                        </div>
                        <div>既往歴・アレルギー</div>
                        <div className={'flex justify-content'}>
                          <div className={'div-box-list'}>
                        <textarea
                          value={this.state.medical_history_allergies}
                          style={{width:"100%", height:"100%"}}
                          id={'medical_history_allergies_id'}
                          onChange={this.setTextValue.bind(this, 'medical_history_allergies')}
                        />
                          </div>
                          <div><button onClick={this.openSelectHospitalDescription.bind(this, "medical_history_allergies")}>追加</button></div>
                        </div>
                        <div className={'flex'} style={{marginTop:"0.3rem"}}>
                          <div style={{width:"7rem"}}><button>自動収集</button></div>
                          <div className={'div-box-value'} style={{width:"5rem"}}> </div>
                          <div><button>科別サマリ</button></div>
                        </div>
                        <div className={'flex'} style={{marginTop:"0.3rem"}}>
                          <div className={'div-title'} style={{width:"7rem"}}>最終修正日時</div>
                          <div className={'div-box-value'} style={{width:"5rem"}}> </div>
                          <div><button>ファイル添付</button></div>
                        </div>
                      </div>
                      <div className={'right-area'}>
                        <div>入院後臨床経過</div>
                        <div className={'flex justify-content'}>
                          <div className={'div-box-list'}>
                            <textarea
                              value={this.state.clinical_course}
                              style={{width:"100%", height:"100%"}}
                              id={'clinical_course_id'}
                              onChange={this.setTextValue.bind(this, 'clinical_course')}
                            />
                          </div>
                          <div><button>追加</button></div>
                        </div>
                        <div>手術情報</div>
                        <div className={'flex justify-content'}>
                          <div className={'disease-name-table'}>
                            <table className="table-scroll table table-bordered">
                              <thead>
                              <tr>
                                <th style={{width:"6rem"}}>手術日</th>
                                <th>実施術式</th>
                                <th style={{width:"3rem"}}>術者</th>
                              </tr>
                              </thead>
                              <tbody>
              
                              </tbody>
                            </table>
                          </div>
                          <div><button>追加</button></div>
                        </div>
                        <div>退院処方</div>
                        <div className={'flex justify-content'}>
                          <div className={'div-box-list'}>
                        <textarea
                          value={this.state.discharge_prescription}
                          style={{width:"100%", height:"100%"}}
                          id={'discharge_prescription_id'}
                          onChange={this.setTextValue.bind(this, 'discharge_prescription')}
                        />
                          </div>
                          <div>
                            <div style={{textAlign:"right"}}><button>追加</button></div>
                            <div style={{marginTop:"0.5rem"}}><button>フリー</button></div>
                          </div>
                        </div>
                        <div>退院後予約情報</div>
                        <div className={'flex justify-content'}>
                          <div className={'div-box-list'}>
                        <textarea
                          value={this.state.reservation_information_after_discharge}
                          style={{width:"100%", height:"100%"}}
                          id={'reservation_information_after_discharge_id'}
                          onChange={this.setTextValue.bind(this, 'reservation_information_after_discharge')}
                        />
                          </div>
                          <div><button>追加</button></div>
                        </div>
                        <div className={'flex justify-content'}>
                          <div style={{width:"calc(100% - 20.5rem)"}}>
                            <div>紹介状/転院先</div>
                            <div className={'select-facility'}>
                              <SelectorWithLabel
                                options={this.state.dial_other_facilities_master}
                                title={''}
                                getSelect={this.setSelectValue.bind(this, 'referral_transfer')}
                                departmentEditCode={this.state.referral_transfer}
                              />
                            </div>
                          </div>
                          <div style={{width:"20rem"}}>
                            <div>紹介医師</div>
                            <div className={'select-intro-doctor'}>
                              <SelectorWithLabel
                                options={this.doctor_list}
                                title={''}
                                getSelect={this.setSelectValue.bind(this, 'referral_doctor')}
                                departmentEditCode={this.state.referral_doctor}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmModalClose}>キャンセル</Button>
            <Button className={(this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.is_created == 1) ? "red-btn" : "disable-btn"} onClick={this.openRegisterComment.bind(this, 'remit_comment')}>差し戻しコメント</Button>
            <Button className={(this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.is_created == 1) ? "red-btn" : "disable-btn"} onClick={this.openRegisterComment.bind(this, 'correction_request_comment')}>訂正依頼コメント</Button>
            <Button className={this.props.modal_data.summary_data == null ? "disable-btn" : "red-btn"} onClick={this.confirmPrint.bind(this)}>印刷</Button>
            <Button className={change_flag ? "delete-btn" : "disable-btn"} onClick={this.confirmClear.bind(this)}>クリア</Button>
            <Button className={change_flag ? "red-btn" : "disable-btn"} onClick={this.confirmSave.bind(this, 0)}>仮保存</Button>
            <Button className={((this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.is_created == 0) || change_flag) ? "red-btn" : "disable-btn"} onClick={this.confirmSave.bind(this, 1)}>確定保存</Button>
            <Button className="red-btn" onClick={this.goKarte}>カルテ参照</Button>
          </Modal.Footer>
          {this.state.isOpenDiseaseNameList && (
            <DiseaseNameList
              system_patient_id={modal_data.patient_id}
              closeModal={this.closeModal}
            />
          )}
          {this.state.isOpenSelectHospitalDescription && (
            <SelectHospitalDescription
              closeModal={this.closeModal}
              handleOk={this.setHospitalDescription}
              system_patient_id={modal_data.patient_id}
              type={this.state.hospital_description_type}
              department_name={modal_data.department_name}
              ward_name={modal_data.ward_name}
            />
          )}
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_title}
            />
          )}
          {this.state.isOpenRegisterComment && (
            <RegisterComment
              closeModal={this.closeModal}
              number={this.props.modal_data.summary_data.number}
              comment_type={this.state.comment_type}
              comment={this.state[this.state.comment_type]}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal}
              handleOk= {this.closeModal}
              showMedicineContent= {this.state.alert_messages}
              title= {this.state.alert_title}
            />
          )}
          {this.state.check_message !== "" && (
            <ValidateAlertModal
              handleOk={this.closeValidateAlertModal}
              alert_meassage={this.state.check_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

HospitalDischargeSummary.contextType = Context;
HospitalDischargeSummary.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  goKarte: PropTypes.func,
};
export default HospitalDischargeSummary;

