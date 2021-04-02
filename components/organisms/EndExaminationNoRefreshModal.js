import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Button from "../atoms/Button";
import PropTypes from "prop-types";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import DiagnosisRpModal from "../organisms/DiagnosisRpModal";
import { CACHE_LOCALNAMES, CACHE_SESSIONNAMES, openPacs } from "~/helpers/constants";
import * as cacheApi from  "~/helpers/cacheLocal-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as patientApi from "~/helpers/cachePatient-utils";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import endKarteMode from "~/components/templates/Patient/PrescriptionMethods/endKarteMode";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import { formatJapanDateSlash, formatTimeIE } from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as localApi from "~/helpers/cacheLocal-utils";

const Wrapper = styled.div`
  .patient-info{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    padding-bottom: 5px;
    font-size: 20px;
    .float-left{
      float: left;
      width: 50%;
    }
    .float-right{
      float: right;
      text-align: right;
      width: 50%;
    }
    .accept-info{
      width: 100%;
      font-size: 18px;
      max-height: 8rem;
      overflow-y: auto;
      span{
        color: black;
      }
    }    
  }
  .first-div{
    overflow: hidden;
    button{
      float:left;
    }
  }
  .second-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{
      float:left;
    }
  }
  .third-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{
      float:left;
    }
  }
  .button-op{
    padding: 16px;
    .text-under{
      text-decoration: underline;
    }
    span{
      font-size: 14px !important;
    }
  }
  .flex {display:flex;}
  .first-medical {
    padding-bottom: 5px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    .block-area {
      width: 45%;
      border: 1px solid #aaa;
      margin-top: 1rem;
      padding: 1rem 0.5rem 0.5rem 0.5rem;
      position: relative;
      color: black;
      label {
        font-size: 14px;
        width:auto; 
      }
      .disable-radio label {background-color: #f2f2f2;}
    }
    .block-title {
      position: absolute;
      top: -12px;
      left: 10px;
      font-size: 18px;
      background-color: white;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
  .medical-comment {
    div {margin-top:0;}
    .label-title {
      font-size: 1rem;
      color: black;
      margin: 0;
      line-height: 2rem;
      width: 6.5rem;
    }
    input {
      font-size: 1rem;
      width: calc(100% - 6.5rem);
      height: 2rem;
    }
  }
 `;

const ButtonBox = styled.div`
  text-align: left;

  span {
    font-size: 18px;
  }
  
  .red-btn {
    background: #cc0000 !important;
    span {
      color: #ffffff !important;
    }
  }
  .red-btn:hover {
    background: #e81123 !important;
    span {
      color: #ffffff !important;
    }
  }
  .cancel-btn {
    background: #ffffff !important;
    border: solid 2px #7e7e7e !important;
    span {
      color: #7e7e7e !important;
    }
  }
  .cancel-btn:hover {
    border: solid 2px #000000 !important;
    background: #ffffff !important;
    span {
      color: #000000 !important;
    }
  }
  .disable-btn {
    background: #d3d3d3;
    span {
      color: #595959;
    }
  }
  .disable-btn:hover {
    background: #d3d3d3;
    span {
      color: #595959;
    }
  }
  .delete-btn {
    background: #ffffff;
    border: solid 2px #4285f4;
    span {
      color: #4285f4;
    }
  }
  .delete-btn:hover {
    background: #4285f4;
    span {
      color: #ffffff;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const buttonStyle = {
  fontSize: "18px",
  width: "380px",
  padding: "10px",
  margin: "16px 16px 16px 0"
};


class EndExaminationNoRefreshModal extends Component {
  constructor(props) {
    super(props);
    this.getKarteMsg = this.getKarteMsg.bind(this);
    this.state = {
      sendKarteModal : false,
      alert_messages : "",
      ret_url : "",
      visible: this.props.visible == true ? true : false,
      isSending: false,
      sendDiagnosisModal : false,
      sendDiagnosisOrderData :  {},
      diagnosis_valid : 0,
      isOpenDoctorModal: false,
      confirm_type:'',
      confirm_title:'',
      confirm_message:'',
      reservation_info : karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.RESERVATION_INFO),
      visit_info : karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.VISIT_INFO),
      diagnosis_comment:"",
    }
    this.prescription_presdata = [];
    this.nextPage = "";
    this.doctor_modal_flag = 1;
    this.openModalTime = null;
  }

  initStatus = (_flag="show") => {
    this.setState({
      sendKarteModal : false,
      alert_messages : "",
      ret_url : "",
      visible: true,
      isSending: false,
      sendDiagnosisModal : false,
      sendDiagnosisOrderData :  {},
      diagnosis_valid : 0,
      isOpenDoctorModal: false,
      confirm_type:'',
      confirm_title:'',
      confirm_message:'',
      reservation_info : karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.RESERVATION_INFO),
      visit_info : karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.VISIT_INFO),
      diagnosis_comment:"",
    });
    this.prescription_presdata = [];
    this.nextPage = "";
    this.doctor_modal_flag = 1;
    this.openModalTime = null;
  }

  async componentDidMount(){
    await this.getDoctorsList();
  }

  saveAndGoList = (act = null) => {
    let reservation_info = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.RESERVATION_INFO);
    if(reservation_info !== undefined && reservation_info != null){
      if(act === 'reservation_stop'){//外来予約中断
        reservation_info.stop = true;
      } else {
        reservation_info.stop = false;
      }
      reservation_info.diagnosis_comment = this.state.diagnosis_comment;
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.RESERVATION_INFO, JSON.stringify(reservation_info));
    }
    let visit_info = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.VISIT_INFO);
    if(visit_info !== undefined && visit_info != null){
      visit_info.diagnosis_comment = this.state.diagnosis_comment;
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.VISIT_INFO, JSON.stringify(visit_info));
    }
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.doctor_modal_flag = 1;
      if (this.state.doctors === undefined){return;}
      this.setState({isOpenDoctorModal: true});
      return;
    }
    this.saveAndGoListAgain();
  }

  saveAndGoListAgain =async () => {
    if( this.state.diagnosis_valid == 0 ) {
      let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
      const cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
      let existCacheState = true;
      if(cacheState == null || undefined == cacheState[0]){
        existCacheState = false;
      }
      let diagnosisOrderData = {};
      if(existCacheState) {
        this.prescription_presdata = cacheState[0].presData;
        this.prescription_presdata.map((item, rpIdx)=>{
          item.medicines.map((med, medIdx)=>{
            if(med.diagnosis_permission == -1) {
              if(diagnosisOrderData[rpIdx] == undefined) {
                diagnosisOrderData[rpIdx] = [];
              }
              diagnosisOrderData[rpIdx].push(medIdx);
            }
          });
        });

        if(Object.keys(diagnosisOrderData).length > 0) {
          this.setState({
            sendDiagnosisModal : true,
            sendDiagnosisOrderData :  diagnosisOrderData,
            // visible: false,
          });
          return;
        }

      }
    }
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    if (
      window.sessionStorage.getItem("isCallingAPI") !== undefined &&
      window.sessionStorage.getItem("isCallingAPI") !== null &&
      parseInt(window.sessionStorage.getItem("isCallingAPI")) === 1
    ) {
      return;
    }
    this.setState({isSending: true});
    window.sessionStorage.setItem("isCallingAPI", 1);
    //check pac on
    let pac_status = patientApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PAC_STATUS);
    if (pac_status != undefined && pac_status != null && pac_status == "on") {
      openPacs(this.props.patientId, "close");
      patientApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PAC_STATUS);
    }
    // if (this.props.pacsOn) {
    //   window.open(
    //     "http://TFS-C054/01Link/minimizeDV.aspx",
    //     "ClosePACS",
    //     "height=600,width=600"
    //   );
    //   this.props.PACSOff;
    // }
    let system_next_page = localApi.getValue('system_next_page');
    if (system_next_page == "karte") {
      system_next_page = "";
      localApi.setValue("system_next_page", system_next_page);
    }
    await this.goSendKarte();
  }

  saveAndGoKarte = async () => {
    if(this.openModalTime != null && ((new Date().getTime() - this.openModalTime) < 500)) return;
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.doctor_modal_flag = 1;
      if(this.state.doctors === undefined) {return;}
      this.setState({isOpenDoctorModal: true});
      return;
    }
    if(this.state.diagnosis_valid == 0) {
      let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
      const cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
      let existCacheState = true;
      if(cacheState == null || undefined === cacheState[0]){
        existCacheState = false;
      }
      let diagnosisOrderData = {};
      if(existCacheState) {
        this.prescription_presdata = cacheState[0].presData;
        this.prescription_presdata.map((item, rpIdx)=>{
          item.medicines.map((med, medIdx)=>{
            if(med.diagnosis_permission == -1) {
              if(diagnosisOrderData[rpIdx] == undefined) {
                diagnosisOrderData[rpIdx] = [];
              }
              diagnosisOrderData[rpIdx].push(medIdx);
            }
          });
        });
        if(Object.keys(diagnosisOrderData).length > 0) {
          this.setState({
            sendDiagnosisModal : true,
            sendDiagnosisOrderData :  diagnosisOrderData,
          });
          return;
        }
      }
    }
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    if (
      window.sessionStorage.getItem("isCallingAPI") !== undefined &&
      window.sessionStorage.getItem("isCallingAPI") !== null &&
      parseInt(window.sessionStorage.getItem("isCallingAPI")) === 1
    ) {
      return;
    }
    this.setState({isSending: true});
    window.sessionStorage.setItem("isCallingAPI", 1);
    //check pac on
    let pac_status = patientApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PAC_STATUS);
    if (pac_status != undefined && pac_status != null && pac_status == "on") {
      openPacs(this.props.patientId, "close");
      patientApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PAC_STATUS);
    }
    localApi.setValue("system_next_page", "karte");
    await this.goSendKarte();
    this.openModalTime = new Date().getTime();
  }
  
  goSendKarte=async()=>{
    let context_department_code = this.context.department.code == 0 ? 1 : this.context.department.code;
    let order_sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    let order_sort_data_length = 0;
    if(order_sort_data !== undefined && order_sort_data != null) {
      order_sort_data_length = Object.keys(order_sort_data).length;
    }
    let cacheChangeResponsibilityState = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY);
    if((order_sort_data_length > 1) && cacheChangeResponsibilityState !== undefined && cacheChangeResponsibilityState != null && cacheChangeResponsibilityState.department_id != this.context.department.code){
      this.setState({
        confirm_type:"check_change_department", // 診療科を変えている担当変更オーダーと、別の科の新規登録を含んでいる場合
        confirm_title:"注意",
        confirm_message : '登録予定の内容に、新しい診療科以外の新規登録が含まれています。このまま登録しますか？'
      });
      return;
    }
    let cacheInHospital = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
    let cacheHospitalDone = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE);
    let other_department_name = "";
    if(cacheInHospital !== undefined && cacheInHospital != null && cacheInHospital.department_id !== context_department_code){
      other_department_name = cacheInHospital.department_name;
    }
    if(cacheHospitalDone !== undefined && cacheHospitalDone != null && cacheHospitalDone.department_id !== context_department_code){
      other_department_name = cacheHospitalDone.department_name;
    }
    if(other_department_name !== ""){
      if(order_sort_data_length > 1){
        this.setState({
          confirm_type:"check_change_department", // 診療科を変えている担当変更オーダーと、別の科の新規登録を含んでいる場合
          confirm_title:"注意",
          confirm_message : '登録予定の内容に、入院先以外の診療科の新規登録が含まれています。このまま登録しますか？'
        });
        return;
      }
      this.setState({
        confirm_type:"check_change_department", // 診療科を変えている担当変更オーダーと、別の科の新規登録を含んでいる場合
        confirm_title:"注意",
        confirm_message : (this.context.department.name !== "" ? this.context.department.name : "内科")
        + 'で入力中ですが、登録予定の入院情報は'+ other_department_name +'が指定されています。このまま登録しますか？'
      });
      return;
    }
    let system_next_page = localApi.getValue('system_next_page');
    await this.props.sendPrescription(this.props.patientId, system_next_page).then(this.getKarteMsg);
  }

  openConfirmModal=()=>{
    this.setState({
      confirm_type:"delete_karte",
      confirm_message : 'カルテ内容を破棄しますか？'
    });
  }

  closeModal=()=>{
    window.sessionStorage.removeItem("isCallingAPI");
    this.props.closeModal();
  }

  cancelAndGoList = () => {
    localApi.remove("current_system_patient_id");
    //check pac on
    let pac_status = patientApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PAC_STATUS);
    // if (this.props.pacsOn) {
    if (pac_status != undefined && pac_status != null && pac_status == "on") {
      openPacs(this.props.patientId, "blank");
      // this.props.PACSOff;
      patientApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PAC_STATUS);
    }
    karteApi.delPatient(this.props.patientId);
    patientApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PAC_STATUS);
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.sessionStorage.removeItem("isForPrescriptionUpdate");
    sessApi.setObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "terminal_info", {});
    // del karte mode api
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let params = {
      staff_number: authInfo.user_number,
      patient_id: this.props.patientId
    };
    endKarteMode(params);
    let system_before_page = localApi.getValue('system_before_page');
    let before_menu_item = localApi.getObject('select_menu_info');
    if (system_before_page != null && system_before_page != undefined && system_before_page != "") {
      this.props.cancelExamination(system_before_page);
    } else {
      this.props.cancelExamination("/patients");
    }
    if (before_menu_item != null && before_menu_item != undefined && before_menu_item.id != null && before_menu_item != undefined ) {
      if (before_menu_item != null && before_menu_item != undefined && before_menu_item.from != null && before_menu_item.from != undefined && before_menu_item.from == "sidebar") {
        // from sidebar menu: don't show navigation menu
        this.context.$selectMenuModal(false);
      }
    }
  }

  getKarteMsg = (value) => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.sessionStorage.removeItem("isCallingAPI");
    let message = this.props.getMessageSendKarte();
    if(value == false) {
      this.setState({
        sendKarteModal : true,
        // visible: false,
        alert_title:message.title,
        alert_messages : message.msg,
        ret_url : message.url,
        // isSending : false,
        sendDiagnosisModal : false,
        sendDiagnosisOrderData :  {},
        diagnosis_valid : 0,
      });
    } else {
      this.props.closeModal();
      this.props.goKartePage(message.url);
    }
  }

  sendDiagnosisCancel = () => {
    this.setState({
      sendDiagnosisModal : false,
      sendDiagnosisOrderData :  {}
    });
    this.props.closeModal();
    this.props.goKartePage("prescription");
  }

  sendDiagnosisOK = () => {
    cacheApi.setValue(CACHE_LOCALNAMES.DIAGNOSIS, 1);
    this.setState({
      sendDiagnosisModal : false,
      diagnosis_valid : 1,
      sendDiagnosisOrderData :  {},
      visible: true,
    }, function(){
      this.saveAndGoList();
    });

  }

  handleOK = () => {
    let url = this.state.ret_url;
    this.props.closeModal();
    this.props.goKartePage(url);
  }

  getDoctorsList = async () => {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    this.setState({ doctors: data });
  };

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  closeDoctor = () => {
    this.setState({
      isOpenDoctorModal: false
    });
  }

  selectDoctorFromModal = (id, name) => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.sessionStorage.removeItem("isCallingAPI");

    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.setState({
      isOpenDoctorModal: false
    });
    if (this.doctor_modal_flag == 0) return;
    this.doctor_modal_flag = 0;
    // this.saveAndGoListAgain();
  };

  setDiagnosisComment = e => {
    this.setState({diagnosis_comment: e.target.value})
  };

  callVisible = (p_visible) => {
    this.setState({
      visible: p_visible
    });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "delete_karte"){
      this.setState({
        confirm_type:'',
        confirm_title:'',
        confirm_message:'',
      }, ()=>{
        this.cancelAndGoList();
      });
    }
    if(this.state.confirm_type === "check_change_department"){
      let system_next_page = localApi.getValue('system_next_page');
      this.setState({
        confirm_type:'',
        confirm_title:'',
        confirm_message:'',
      }, async()=>{
        await this.props.sendPrescription(this.props.patientId, system_next_page).then(this.getKarteMsg);
      });
    }
  }

  render() {
    const { patientInfo } = this.props;
    let save_disable = false;
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let isCallingAPI = window.sessionStorage.getItem("isCallingAPI");
    if (isCallingAPI !== undefined && isCallingAPI !== null && parseInt(isCallingAPI) === 1) {
      save_disable = true;
    }
    return  (
      <Modal
        show={this.state.visible}
        className="endExamination_dlg first-view-modal"
        centered
        size="lg"
      >
        <Modal.Header><Modal.Title>カルテ保存</Modal.Title>          </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="patient-info">
              <div className="float-left">{patientInfo.receId} : {patientInfo.name}</div>
              <div className="float-right">{patientInfo.sex == 1 ? "男" : "女"} {patientInfo.age}歳 {patientInfo.age_month}ヶ月</div>
              {this.state.reservation_info != null && this.state.reservation_info !== undefined && this.state.reservation_info.treatment_started_at !== undefined && (
                <div className="accept-info">
                  <span>診察開始日時:</span> {this.state.reservation_info.diagnosis_name} {formatJapanDateSlash(this.state.reservation_info.treatment_started_at)} {formatTimeIE(this.state.reservation_info.treatment_started_at)}
                </div>
              )}
              {this.state.visit_info != null && this.state.visit_info !== undefined && this.state.visit_info.treatment_started_at !== undefined && (
                <>
                  <div className="accept-info">
                    <span>{this.state.visit_info.place_name + "（" + this.state.visit_info.group_name + "）"}</span>
                  </div>
                  <div className="accept-info">
                    <span>診察開始日時:{formatJapanDateSlash(this.state.visit_info.treatment_started_at)} {formatTimeIE(this.state.visit_info.treatment_started_at)}</span>
                  </div>
                </>
              )}
            </div>
            {((this.state.reservation_info != null && this.state.reservation_info !== undefined) ||(this.state.visit_info != null && this.state.visit_info !== undefined)) && (
              <div className="patient-info">
                <div className={'first-medical flex'}>
                  <div className={'block-area'}>
                    <div className={'block-title'}>初再診</div>
                    <div className={'flex'}>
                      <div className={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.visit_type === 0 ? '' : 'disable-radio') : (this.state.reservation_info.visit_type === 0 ? '' : 'disable-radio')}>
                        <Radiobox
                          label={'未設定'}
                          value={0}
                          checked={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.visit_type === 0) : (this.state.reservation_info.visit_type === 0)}
                          disabled={true}
                          name={`visit_type`}
                        />
                      </div>
                      <div className={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.visit_type === 1 ? '' : 'disable-radio') : (this.state.reservation_info.visit_type === 1 ? '' : 'disable-radio')}>
                        <Radiobox
                          label={'初診'}
                          value={1}
                          checked={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.visit_type === 1) : (this.state.reservation_info.visit_type === 1)}
                          disabled={true}
                          name={`visit_type`}
                        />
                      </div>
                      <div className={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.visit_type === 2 ? '' : 'disable-radio') : (this.state.reservation_info.visit_type === 2 ? '' : 'disable-radio')}>
                        <Radiobox
                          label={'再診'}
                          value={2}
                          checked={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.visit_type === 2) : (this.state.reservation_info.visit_type === 2)}
                          disabled={true}
                          name={`visit_type`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={'block-area'}>
                    <div className={'block-title'}>診察区分</div>
                    <div className={'flex'}>
                      <div className={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.diagnosis_type === 0 ? '' : 'disable-radio') : (this.state.reservation_info.diagnosis_type === 0 ? '' : 'disable-radio')}>
                        <Radiobox
                          label={'未設定'}
                          value={0}
                          checked={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.diagnosis_type === 0) : (this.state.reservation_info.diagnosis_type === 0)}
                          disabled={true}
                          name={`diagnosis_type`}
                        />
                      </div>
                      <div className={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.diagnosis_type === 1 ? '' : 'disable-radio') : (this.state.reservation_info.diagnosis_type === 1 ? '' : 'disable-radio')}>
                        <Radiobox
                          label={'対面'}
                          value={1}
                          checked={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.diagnosis_type === 1) : (this.state.reservation_info.diagnosis_type === 1)}
                          disabled={true}
                          name={`diagnosis_type`}
                        />
                      </div>
                      <div className={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.diagnosis_type === 2 ? '' : 'disable-radio') : (this.state.reservation_info.diagnosis_type === 2 ? '' : 'disable-radio')}>
                        <Radiobox
                          label={'電話'}
                          value={2}
                          checked={(this.state.visit_info != null && this.state.visit_info !== undefined) ? (this.state.visit_info.diagnosis_type === 2) : (this.state.reservation_info.diagnosis_type === 2)}
                          disabled={true}
                          name={`diagnosis_type`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={'medical-comment'}>
                  <InputWithLabel
                    label="診察コメント"
                    type="text"
                    getInputText={this.setDiagnosisComment.bind(this)}
                    diseaseEditData={this.state.diagnosis_comment}
                  />
                </div>
              </div>
            )}
            {this.state.isSending ? (
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            ) : (
              <ButtonBox>
                <div className="first-div">
                  <Button onClick={this.saveAndGoList.bind(this)} style={buttonStyle} className={save_disable ? "disable-btn":"red-btn"}>保存して閉じる</Button>
                  <div className="button-op">
                    <div><span className="text-under">入力内容を保存</span><span>してカルテを閉じます</span></div>
                    <div><span>診察を終了します</span></div>
                  </div>
                </div>
                {this.state.reservation_info !== undefined && this.state.reservation_info != null && this.state.reservation_info.treatment_started_at !== undefined && (
                  <div className="first-div">
                    <Button onClick = {this.saveAndGoList.bind(this,'reservation_stop')} style={buttonStyle} className={save_disable ? "disable-btn":"red-btn"}>
                      保存して閉じる（診察中断）
                    </Button>
                    <div className="button-op">
                      <div><span className="text-under">入力内容を保存</span><span>してカルテを閉じます</span></div>
                      <div><span>検査等のため、再度この患者の診察を行う場合に選択してください</span></div>
                    </div>
                  </div>
                )}
                <div className="second-div">
                  <Button onClick={this.saveAndGoKarte} style={buttonStyle} className={save_disable ? "disable-btn":"red-btn"}>保存する</Button>
                  <div className="button-op">
                    <div><span className="text-under">入力内容を保存</span><span>し、カルテに戻ります</span></div>
                    <div><span>診察は継続します</span></div>
                  </div>
                </div>
                <div className="third-div">
                  <Button className="delete-btn" onClick={this.openConfirmModal} style={buttonStyle}>カルテを破棄する</Button>
                  <div className="button-op"><div><span className="text-under">入力内容を破棄</span><span>してカルテを閉じます</span></div></div>
                </div>
              </ButtonBox>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
        </Modal.Footer>
        {this.state.sendKarteModal && (
          <AlertNoFocusModal
            hideModal= {this.handleOK.bind(this)}
            handleOk= {this.handleOK.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title={this.state.alert_title}
          />
        )}
        {this.state.sendDiagnosisModal === true && (
          <DiagnosisRpModal
            hideModal = {this.sendDiagnosisCancel}
            diagnosisData = {this.state.sendDiagnosisOrderData}
            presData={this.prescription_presdata}
            handleCancel = {this.sendDiagnosisCancel}
            handleOk = {this.sendDiagnosisOK}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title={this.state.confirm_title}
          />
        )}
        {this.state.isOpenDoctorModal && (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.state.doctors}
          />
        )}
      </Modal>
    );
  }
}
EndExaminationNoRefreshModal.contextType = Context;

EndExaminationNoRefreshModal.propTypes = {
  visible: PropTypes.bool,
  sendPrescription: PropTypes.func,
  closeModal: PropTypes.func,
  cancelExamination: PropTypes.func,
  pacsOn: PropTypes.bool,
  PACSOff: PropTypes.func,
  isSending: PropTypes.bool,
  getMessageSendKarte:PropTypes.func,
  goKartePage: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
};

export default EndExaminationNoRefreshModal;
