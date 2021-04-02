import React, {Component} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "~/components/_nano/colors";
import Context from "~/helpers/configureStore";
import $ from "jquery";
import {formatDateSlash, formatJapan, formatTimeIE, getCurrentDate} from "~/helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import auth from "~/api/auth";
import * as apiClient from "~/api/apiClient";
import * as methods from "~/components/methods/StoreMethods";
import PatientCardWrapper from "~/components/atoms/PatientCardWrapper";
import LargeUserIcon from "~/components/atoms/LargeUserIcon";
import DetailedPatient from "~/components/molecules/DetailedPatient";
import ConcurrentuserModal from "~/components/molecules/ConcurrentuserModal";
import AfflictionIcon from "~/components/atoms/AfflictionIcon";
import disabled_status_no from "~/components/_demo/Patients_panel_icon/disabled_status_no.png";
import disabled_status_yes from "~/components/_demo/Patients_panel_icon/disabled_status_yes.png";
import drugalergy_status_no from "~/components/_demo/Patients_panel_icon/drugalergy_status_no.png";
import drugalergy_status_yes from "~/components/_demo/Patients_panel_icon/drugalergy_status_yes.png";
import foodalergy_status_no from "~/components/_demo/Patients_panel_icon/foodalergy_status_no.png";
import foodalergy_status_yes from "~/components/_demo/Patients_panel_icon/foodalergy_status_yes.png";
import staff_status_no from "~/components/_demo/Patients_panel_icon/staff_status_no.png";
import staff_status_yes from "~/components/_demo/Patients_panel_icon/staff_status_yes.png";
import ADL_status_no from "~/components/_demo/Patients_panel_icon/ADL_status_no.png";
import ADL_status_yes from "~/components/_demo/Patients_panel_icon/ADL_status_yes.png";
import vaccine_status_no from "~/components/_demo/Patients_panel_icon/vaccine_status_no.png";
import vaccine_status_yes from "~/components/_demo/Patients_panel_icon/vaccine_status_yes.png";
import infection_status_positive from "~/components/_demo/Patients_panel_icon/infection_status_positive.png";
import infection_status_no from "~/components/_demo/Patients_panel_icon/infection_status_no.png";
import infection_status_unknown from "~/components/_demo/Patients_panel_icon/infection_status_unknown.png";
import infection_status_negative from "~/components/_demo/Patients_panel_icon/infection_status_negative.png";
import alergy_status_positive from "~/components/_demo/Patients_panel_icon/alergy_status_positive.png";
import alergy_status_no from "~/components/_demo/Patients_panel_icon/alergy_status_no.png";
import alergy_status_unknown from "~/components/_demo/Patients_panel_icon/alergy_status_unknown.png";
import alergy_status_negative from "~/components/_demo/Patients_panel_icon/alergy_status_negative.png";
import navigation_status from "~/components/_demo/Patients_panel_icon/navigation_status.png";
import introduction_status from "~/components/_demo/Patients_panel_icon/introduction_status.png";
import { Wrapper, Flex, PatientName, Kana, PatientId, PatientIdOne } from "~/components/styles/PatientInfoCardCss";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import BasicInfoModal from "~/components/organisms/BasicInfoModal";
import HistoryInfoModal from "~/components/organisms/HistoryInfoModal";
import AllergyListModal from "~/components/templates/Patient/Modals/Allergy/AllergyListModal";
import PatientStaffListModal from "~/components/templates/Patient/Modals/PatientStaff/PatientStaffListModal";
import IntroductionListModal from "~/components/templates/Patient/Modals/Introduction/IntroductionListModal";
import PrescriptionConfirmModal from "~/components/molecules/PrescriptionConfirmModal";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES, KARTE_STATUS_TYPE, Karte_Types, ALLERGY_STATUS_ARRAY,ALLERGY_TYPE_ARRAY,KARTEMODE, hankaku2Zenkaku, zenkana2Hankana} from "~/helpers/constants";
import {displayLineBreak} from "~/helpers/dialConstants";
import SimpleOrder from "~/components/templates/Patient/Modals/SimpleOrder/SimpleOrder";
import PotionReportModal from "~/components/templates/Patient/Modals/PotionReport/PotionReportModal";
import HospitalPrescriptionModal from "~/components/templates/Patient/Modals/PotionReport/HospitalPrescriptionModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";
import NotConsentedModal from "~/components/organisms/NotConsentedModal";
import NurseRecordSave from "~/components/templates/Patient/NursingDocument/NurseRecordSave";
import * as localApi from "~/helpers/cacheLocal-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

var RightButtons = styled.div`
  span{
    font-size:${props=>(props.font_props != undefined?0.85*props.font_props + 'rem':'0.85rem')}!important;
  }
  .bottom-line-button{
    min-width:5rem!important;
    width:6.3rem!important;
    padding:0.4rem!important;
    padding-left:0.2rem!important;
    padding-right:0.2rem!important;
  }
  .read-btn{
    box-shadow: rgb(105, 200, 225) 0px 1px 4px;
  }
  .write-btn{
    background-color: rgb(241, 86, 124);
    box-shadow: rgb(241, 86, 124) 0px 1px 4px;
  }
  .execute-btn{
    background-color: rgb(241, 136, 86);
    box-shadow: rgb(241, 136, 86) 0px 1px 4px;
    
  }
  .disabled-button{
    opacity:0.6;
  }
  .no-cursor{
    cursor: auto;
  }
  .btn-karte {
    padding: 1.8rem 0.5rem 1.8rem;
  }
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #FFFFCC;
    border-radius: 4px;
    border: solid 2px #FFCC9A;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    max-width: 396px;
    max-height: 350px;
    overflow-y: auto;
  }
  
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;

    div {
      padding: 5px 12px;
    }
  }
  .tooltip-title {
    border-bottom: solid 1px #FFCC9A;
    margin: 0 9px;
    padding: 3px;
  }
`;

const Tooltip = ({visible,x,y,tooltip_content, tooltip_patientInfo}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {tooltip_patientInfo != null ? ( // 身長・体重
            <li>
              <div className={'tooltip-content'}>身長 : {tooltip_patientInfo.height}cm</div>
              <div className={'tooltip-content'}>体重 : {tooltip_patientInfo.weight}kg</div>
              {tooltip_patientInfo.height > 0 && tooltip_patientInfo.weight > 0 && (
                <div className={'tooltip-content'}>BMI  : {parseFloat((tooltip_patientInfo.weight * 10000)/(tooltip_patientInfo.height * tooltip_patientInfo.height)).toFixed(2)}</div>
              )}
            </li>
          ):(// tooltip
            <li>
              <div className={'tooltip-title'}>{tooltip_content['title']}</div>
              <div className={'tooltip-content'}>{displayLineBreak(tooltip_content['body_1'])}</div>
              {tooltip_content['start_date'] != undefined && tooltip_content['start_date'] != null && (
                <div className={'tooltip-content'}>{tooltip_content['start_date']}</div>
              )}
              {tooltip_content['body_2'] != null && (
                <div className={'tooltip-content'}>{displayLineBreak(tooltip_content['body_2'])}</div>
              )}
            </li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const PatientInfoWrapper = styled.div`
  background-color: ${colors.background};
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  z-index: 100;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */ 
  -khtml-user-select: none; /* Konqueror HTML */ 
  -moz-user-select: none; /* Firefox */ 
  -ms-user-select: none; /* Internet Explorer/Edge */ 
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
  .flex {
    display: flex;
    margin: 0 !important;
  }
  .row {
    margin: 0;
  }
  dl {
    margin-top: 0;
  }
  .modal-dialog {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    max-width: 70%;
  }
  .selected_patient_0 #patient-head-info{
    border: 5px solid ${colors.firstPatientColor};
  }
  .selected_patient_1 #patient-head-info{
    border: 5px solid ${colors.secondPatientColor};
  }
  .selected_patient_2 #patient-head-info{
    border: 5px solid ${colors.thirdPatientColor};
  }
  .selected_patient_3 #patient-head-info{
    border: 5px solid ${colors.forthPatientColor};
  }
  .save-btn {height:4.8rem !important;}
`;

class NursePatientNav extends Component {
  sendLog = methods.sendLog.bind(this);
  constructor(props) {
    super(props);
    this.patient_check_timer = undefined;
    let patientInfo = props.patientInfo;
    this.state = {
      isOpenNurseRecordSave:false,
      re_draw:false,
      isPopupOpen: false,
      isConcurrentPopupOpen: false,
      tabIndex: "1",
      disabled: false,
      drugalergy: false,
      foodalergy: false,
      staff: false,
      ADL: false,
      vaccine: false,
      infection_positive: false,
      infection_no: false,
      infection_unknown: false,
      infection_negative: false,
      alergy_positive: false,
      alergy_no: false,
      alergy_unknown: false,
      alergy_negative: false,
      isOpenBasicInfo: false,
      openDoctorModal: false,
      isopenPatientStaffModal: false,
      isopenIntroductionModal: false,
      isOpenHistoryInfoModal:false,
      isPotionReportPopupOpen:false,
      isHospitalPrescriptionPopupOpen:false,
      alert_messages:"",
      confirm_title:"",
      confirm_message:"",
      patientInfo,
      current_insurance_type: (patientInfo != undefined && patientInfo != null && patientInfo.insurance_type !== undefined && patientInfo.insurance_type != null) ? patientInfo.insurance_type : 0
    };
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.font_props = 1;    
    let nurse_record = localApi.getObject("nurse_record");
    nurse_record = nurse_record !== undefined ? nurse_record : null;
    this.change_flag = nurse_record != null ? nurse_record.change_flag : 0;
    let nursing_history = localApi.getObject("nursing_history");
    if(nursing_history !== undefined && nursing_history != null && nursing_history.progress_chat !== undefined && (nursing_history.progress_chat.result_changed || nursing_history.progress_chat.oxygen_changed)) {
      this.change_flag = 1;
    }
  }
  
  getSelectedPatientClass = () => {
    // if (patient_list != null && patient_list != undefined && patient_list.length > 0) {
    //   let patient_index = "";
    //   patient_list.map((item, idx)=>{
    //     if (patient_id == parseInt(item.system_patient_id)) {
    //       patient_index = idx;
    //     }
    //   });
    //   return "selected_patient_" + patient_index;
    // }
    return "selected_patient_0";
  }
  
  async componentDidMount() {
    setTimeout(async() => {
      await auth.checkPatientReadingState(this.props.patientId);
      await this.getPatientState();
      await this.getDoctorsList();
    }, 3000);
    this.patient_check_timer = setInterval(() => {
      auth.checkPatientReadingState(this.props.patientId);
      setTimeout(() => {
        this.setState({re_draw:!this.state.re_draw});
      }, 500);
    }, 60 * 1000);
  }
  
  async getDoctorsList() {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    this.setState({ doctors: data });
  }
  
  getPatientState = async () => {
    let data = await apiClient._post(
      "/app/api/v2/order/hospital/getPatientState",
      {system_patient_id:parseInt(this.props.patientId)}
    );
    Object.keys(data).map((key)=>{
      let item = data[key];
      if (key === "patient_data") {
        this.setState({patient_data: item});
      } else {
        this.getSelected(item);
      }
    });
  };
  
  patientInfoRefresh = async () => {
    let data = await apiClient._post(
      "/app/api/v2/order/hospital/getPatientState",
      {system_patient_id:parseInt(this.props.patientId)}
    );
    Object.keys(data).map((key)=>{
      let item = data[key];
      if (key === "patient_data") this.setState({patient_data: item});
      else this.getSelected(item)
    });
  }
  
  componentWillUnmount() {
    clearInterval(this.edit_karte_flag);
    clearInterval(this.patient_check_timer);
  }
  
  openPopup = (tabIndex) => {
    this.setState({ isPopupOpen: true, tabIndex: tabIndex });
  };
  
  openDiseaseNameModal = () => {
    this.setState({ isDiseaseNameOpen: true });
  };
  
  openInvitorPopup = (login_status) => {
    if (!(login_status == 1)) return;
    this.sendLog();
    this.setState({ isConcurrentPopupOpen: true });
  };
  
  closeModal = () => {
    let state_data = {
      isOpenNurseRecordSave:false,
      confirm_title: "",
      alert_messages: "",
      
      isPopupOpen: false,
      isOpenBasicInfo: false,
      isopenPatientStaffModal: false,
      isopenIntroductionModal: false,
      isOpenHistoryInfoModal: false,
      isPotionReportPopupOpen: false,
      isHospitalPrescriptionPopupOpen: false,
      confirm_message: "",
      confirm_type: "",
    };
    this.setState(state_data);
  };
  
  closeConcurrentModal = () => {
    this.setState({ isConcurrentPopupOpen: false });
  };
  
  closeExamination = () => {
    this.setState({
      isSimpleOrderPopupOpen: false,
      openAllergyListModal: false,
    });
  };
  
  closeDiseaseNameModal = () => {
    this.setState({isDiseaseNameOpen: false});
  };
  
  getSelected = icon_various => {
    switch (icon_various) {
      case "disabled_status_no":
        return this.setState({ disabled: false });
      case "disabled_status_yes":
        return this.setState({ disabled: true });
      case "drugalergy_status_no":
        return this.setState({ drugalergy: false });
      case "drugalergy_status_yes":
        return this.setState({ drugalergy: true });
      case "foodalergy_status_no":
        return this.setState({ foodalergy: false });
      case "foodalergy_status_yes":
        return this.setState({ foodalergy: true });
      case "staff_status_no":
        return this.setState({ staff: false });
      case "staff_status_yes":
        return this.setState({ staff: true });
      case "ADL_status_no":
        return this.setState({ ADL: false });
      case "ADL_status_yes":
        return this.setState({ ADL: true });
      case "vaccine_status_no":
        return this.setState({ vaccine: false });
      case "vaccine_status_yes":
        return this.setState({ vaccine: true });
      case "infection_status_init":
        return this.setState({
          infection_positive: false,
          infection_no: false,
          infection_unknown: false,
          infection_negative: false
        });
      case "infection_status_positive":
        return this.setState({
          infection_positive: true,
          infection_no: false,
          infection_unknown: false,
          infection_negative: false
        });
      case "infection_status_no":
        return this.setState({
          infection_positive: false,
          infection_no: true,
          infection_unknown: false,
          infection_negative: false
        });
      case "infection_status_unknown":
        return this.setState({
          infection_positive: false,
          infection_no: false,
          infection_unknown: true,
          infection_negative: false
        });
      case "infection_status_negative":
        return this.setState({
          infection_positive: false,
          infection_no: false,
          infection_unknown: false,
          infection_negative: true
        });
      case "alergy_status_init":
        return this.setState({
          alergy_positive: false,
          alergy_no: false,
          alergy_unknown: false,
          alergy_negative: false
        });
      case "alergy_status_positive":
        return this.setState({
          alergy_positive: true,
          alergy_no: false,
          alergy_unknown: false,
          alergy_negative: false
        });
      case "alergy_status_no":
        return this.setState({
          alergy_positive: false,
          alergy_no: true,
          alergy_unknown: false,
          alergy_negative: false
        });
      case "alergy_status_unknown":
        return this.setState({
          alergy_positive: false,
          alergy_no: false,
          alergy_unknown: true,
          alergy_negative: false
        });
      case "alergy_status_negative":
        return this.setState({
          alergy_positive: false,
          alergy_no: false,
          alergy_unknown: false,
          alergy_negative: true
        });
    }
  };
  
  getDepartment = e => {
    this.context.$updateDepartment(e.target.id, e.target.value);
  };
  
  confirmOk=()=>{
    this.setState({confirm_message:""});
    localApi.remove("nursing_history");
    this.closeKarte();
  }
  
  getKarteStatus = e => {
    this.context.$updateKarteStatus(e.target.id, e.target.value);
  };
  
  closeKarte = () => {
    let nursing_history = localApi.getObject("nursing_history");
    if(nursing_history !== undefined && nursing_history != null && nursing_history.progress_chat !== undefined && (nursing_history.progress_chat.result_changed || nursing_history.progress_chat.meal_changed || nursing_history.progress_chat.oxygen_changed)) {
      this.props.saveResult();
      return;
    }
    if(this.change_flag == 1){
      let nurse_record = localApi.getObject("nurse_record");
      let record_date = formatDateSlash(nurse_record.record_date) + " " + formatTimeIE(new Date(nurse_record.record_date_time)) + ":00";
      if(nurse_record.number == 0){
        let can_register = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.REGISTER_OLD);
        if(!can_register){
          this.setState({
            confirm_title:"権限確認",
            alert_messages:"登録権限がありません。"
          });
          return;
        }
        let alert_messages = "";
        if(new Date(record_date).getTime() > new Date(nurse_record.record_max_date).getTime()){
          alert_messages = "記録時間は" + formatDateSlash(new Date(nurse_record.record_max_date)) + " " + formatTimeIE(new Date(nurse_record.record_max_date))
            +"以前で選択してください。";
        }
        let change_record_date_auth = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.REGISTER_OLD);
        if(!change_record_date_auth && (new Date(record_date).getTime() < new Date(nurse_record.record_min_date).getTime())){
          alert_messages = "記録時間は"+ formatDateSlash(new Date(nurse_record.record_min_date)) + " " + formatTimeIE(new Date(nurse_record.record_min_date)) + "から"
            + formatDateSlash(new Date(nurse_record.record_max_date))+ " " + formatTimeIE(new Date(nurse_record.record_max_date)) + "まで変更可能です。";
        }
        if(alert_messages !== ""){
          this.setState({
            confirm_title:"記録時間エラー",
            alert_messages
          });
          return;
        }
      } else {
        let alert_messages = "";
        if(new Date(record_date).getTime() > new Date(nurse_record.record_max_date).getTime()){
          alert_messages = "記録時間は" + formatDateSlash(new Date(nurse_record.record_max_date)) + " " + formatTimeIE(new Date(nurse_record.record_max_date))
            +"以前で選択してください。";
        }
        let change_record_date_auth = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.EDIT_OLD);
        if(!change_record_date_auth && (new Date(record_date).getTime() < new Date(nurse_record.record_min_date).getTime())){
          alert_messages = "記録時間は"+ formatDateSlash(new Date(nurse_record.record_min_date)) + " " + formatTimeIE(new Date(nurse_record.record_min_date)) + "から"
            + formatDateSlash(new Date(nurse_record.record_max_date))+ " " + formatTimeIE(new Date(nurse_record.record_max_date)) + "まで変更可能です。";
        }
        if(alert_messages !== ""){
          this.setState({
            confirm_title:"記録時間エラー",
            alert_messages
          });
          return;
        }
      }
      this.setState({isOpenNurseRecordSave:true});
    } else {
      let system_before_page = localApi.getValue('system_before_page');
      let path = system_before_page.split("/");
      if (system_before_page !== undefined && system_before_page != null && system_before_page != "" && path[path.length - 1] != "nursing_document") {
        this.props.goOtherPage(system_before_page);
      } else {
        this.props.goOtherPage("/hospital_ward_map");
      }
    }
  }
  
  confirmPrescriptionCancel = () => {
    let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    if (this.state.canConfirm == 1) {
      if (this.props.patientId > 0) {
        if (this.state.cur_url == "prescription") {
          karteApi.delSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
        } else {
          active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
          karteApi.delSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
        }
      }
    }
    this.setState({
      prescription_confirm_message: "",
      okTitle: "",
      cancelTitle: ""
    });
    
    // call karte close
    this.props.openModal(this.props.patientId);
  }
  
  confirmPrescriptionOk = () => {
    let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    if (this.state.cur_url == "injection") active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
    if (this.state.canConfirm == 1) {
      
      if (this.props.patientId > 0) {
        let cache_prescription = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
        if (this.state.cur_url == "injection") cache_prescription = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
        let type = cache_prescription[0].isUpdate == 1 ? Karte_Types.Update : Karte_Types.Register;
        if (cache_prescription != undefined && cache_prescription != null && cache_prescription.length > 0) {
          
          // check error of prescription or injection data
          if (this.state.cur_url == "prescription" && this.checkPresDataFromPrescription(cache_prescription[0].presData, type) != true) {
            this.setState({
              prescription_confirm_message: "",
              okTitle: "",
              cancelTitle: ""
            });
            return;
          } else if(this.state.cur_url == "injection" && this.checkInjectDataFromInjection(cache_prescription[0].injectData, type) != true) {
            this.setState({
              prescription_confirm_message: "",
              okTitle: "",
              cancelTitle: ""
            });
            return;
          }
          
          cache_prescription[0].temp_saved = 1;
          cache_prescription[0].canConfirm = 2;
          let newStateStr = JSON.stringify(cache_prescription);
          if (this.state.cur_url == "prescription") {
            karteApi.setSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key, newStateStr, 'insert');
          } else {
            karteApi.setSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key, newStateStr, 'insert');
          }
        }
      }
    } else {
      
      if (this.props.patientId > 0) {
        if (this.state.cur_url == "prescription") {
          karteApi.delSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
        } else {
          karteApi.delSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
        }
      }
    }
    
    this.setState({
      prescription_confirm_message: "",
      okTitle: "",
      cancelTitle: ""
    });
    
    // call karte close
    this.props.openModal(this.props.patientId);
  }
  
  openBasicInfo = () => {
    this.setState({isOpenBasicInfo: true});
  };
  
  openConsentedModal = () => {
    this.setState({
      hasNotConsentedData: true
    });
  };
  
  closeNotConsentedModal = () => {
    this.setState({ hasNotConsentedData: false });
  };
  
  openHospitalListModal = (value) => {
    if (value == "foodalergy" || value == "drugalergy") {
      let allergy_tab = 401;
      if (value == 'foodalergy') allergy_tab = 402;
      this.setState({
        isPopupOpen: true,
        tabIndex:allergy_tab,
      });
    } else {
      this.setState({
        openAllergyListModal: true,
        allergy_type: value
      });
    }
  };
  
  openPatientStaffModal = () => {
    this.setState({isopenPatientStaffModal: true});
  };
  
  openIntroductionModal = () => {
    this.setState({isopenIntroductionModal: true});
  };
  
  openHistoryModal = () => {
    this.setState({isOpenHistoryInfoModal : true});
  };
  
  editTooltip = async(e, tooltip_type, patientInfo=null) => {
    let {patient_data} = this.state;
    // tallAndWeight => 身長・体重
    if ((patient_data[tooltip_type] === undefined || patient_data[tooltip_type] == null) && tooltip_type != "tallAndWeight") return;
    let content = null;
    if (tooltip_type != "tallAndWeight") {
      content = this.makeTooltipContent(patient_data[tooltip_type],tooltip_type);
    }
    this.setState({
      tooltip: {
        visible: true,
        x: e.clientX,
        y: e.clientY+window.pageYOffset + 20,
      },
      tooltip_content:content,
      tooltip_type,
      toolPatientInfo: patientInfo
    });
  };
  
  hideTooltip = () => {
    this.setState({ tooltip: { visible: false} });
  };
  
  makeTooltipContent = (data, tooltip_type) => {
    let result = [];
    if (tooltip_type == "staff") {
      result['title'] = "担当職員";
    } else if (tooltip_type == "introduction") {
      result['title'] = "紹介情報";
    } else if (tooltip_type == "foodalergy") {
      result['title'] = "食物アレルギー";
    } else if (tooltip_type == "drugalergy") {
      result['title'] = "薬剤アレルギー";
    } else {
      result['title'] = ALLERGY_TYPE_ARRAY[data.type];
    }
    if (tooltip_type == 'foodalergy' || tooltip_type == 'drugalergy') {
      result['body_1'] = data.allergen_name;
      result['body_2'] = "症状: " + data.symptom;
      if (data.start_date != null && data.start_date != '')
        result['start_date'] = "開始日: " + formatJapan(data.start_date);
    } else {
      if (data.body_2 !== undefined) {
        result['body_1'] = data.body_1;
        if (data.type == "infection" || data.type == "alergy") {
          result['body_2'] = "状態:" + ALLERGY_STATUS_ARRAY[data.body_2];
        } else {
          result["body_2"] = data.body_2;
        }
      } else {
        result['body_1'] = data;
      }
      
    }
    return result;
  };
  
  // 処方以外のページをクリックした場合警告表示処理
  checkPresDataFromPrescription = (presData) => {
    let validationPassed = true;
    let strMessage = "";
    
    // 用法用量の確認
    let arrNotAllow = [];
    presData.map(item => {
      item.medicines.map(med=>{
        if(med.usage_permission !== undefined && med.usage_permission < 0) {
          validationPassed = false;
          arrNotAllow.push("・" + med.medicineName);
        }
      })
    });
    
    if (validationPassed == false) {
      strMessage = "用法用量の確認が必要な薬剤があります。処方箋からクリックして確認してください\n対象：\n" + arrNotAllow.join("\n");
      this.setState({alert_messages: strMessage});
      return false;
    }
    // 数量がない
    presData.map(item => {
      item.medicines.map(medicine => {
        if (
          medicine.medicineName !== "" &&
          medicine.amount === undefined
        ) {
          validationPassed = false;
        }
      });
    });
    
    if (validationPassed === false) {
      strMessage = "薬品の数量を入力して下さい。";
      this.setState({alert_messages: strMessage});
      return false;
    }
    
    // 数量がない
    let selMedicines = [];
    let medList = "";
    presData.map(item => {
      item.medicines.map(medicine => {
        if(medicine.period_permission !== undefined && medicine.period_permission < 0) {
          validationPassed = false;
          if(!selMedicines.includes(medicine.medicineId)) {
            selMedicines.push(medicine.medicineId);
            medList += "◆" + medicine.medicineName + "\n";
            if(medicine.gene_name) {
              medList += "(" + medicine.gene_name + ")\n";
            }
          }
        }
      });
    });
    
    if (validationPassed === false) {
      strMessage = "有効期間外の薬品があります。処方前に削除または別の製品に変更してください。\n" + medList;
      this.setState({alert_messages: strMessage});
      return false;
    }
    
    // 用法がない
    presData.map(item => {
      if (
        item.medicines.length >= 1 &&
        item.medicines[0].medicineName !== "" &&
        item.usageName === ""
      ) {
        validationPassed = false;
      }
    });
    
    if (validationPassed === false) {
      strMessage = "用法方法を入力して下さい。";
      this.setState({alert_messages: strMessage});
      return false;
    }
    
    // 日数がない
    presData.map(item => {
      if (item.usage_replace_number === undefined) {
        if (
          item.usageName !== "" &&
          item.days === 0
        ) {
          if (item.usageIndex !== 6 && item.enable_days === 1) {
            validationPassed = false;
          }
        }
      } else {
        if (
          item.usageName !== "" &&
          (item.days === 0 &&
            item.usage_replace_number.length === 0)
        ) {
          if (item.usageIndex !== 6 && item.enable_days === 1) {
            validationPassed = false;
          }
        }
      }
      
    });
    
    if (validationPassed === false) {
      strMessage = "用法の日数を入力して下さい。";
      this.setState({alert_messages: strMessage});
      return false;
    }
    
    // 用法 is_enabled
    presData.map(item => {
      if (this.hasPrescriptionUnenabledUsage(item.usage) == true) {
        validationPassed = false;
      }
      
    });
    
    if (validationPassed === false) {
      strMessage = "使用できない用法が選択されています。登録する場合は用法を変更してください";
      this.setState({alert_messages: strMessage});
      return false;
    }
    
    return validationPassed;
  }
  
  hasPrescriptionUnenabledUsage = (usage_number) => {
    // let usageData = JSON.parse(window.localStorage.getItem("haruka_cache_usageData"));
    let usageData = {};
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.prescription_usage != undefined && init_status.prescription_usage != null) {
      usageData = init_status.prescription_usage;
    }
    // let usageNumberArray = [];
    if (usage_number == null || usage_number == undefined) {
      return false;
    }
    
    let nHasUnenabledUsage = 0;
    if (usageData != null && usageData != undefined) {
      usageData.external.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.injection.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      if (usageData.internal != null && usageData.internal.internal_other != null){
        usageData.internal.internal_other.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_1.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_2.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_3.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.when_necessary.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
    }
    return false;
  }
  
  // 注射以外のページをクリックした場合警告表示処理
  checkInjectDataFromInjection = (presData) => {
    let validationPassed = true;
    let strMessage = "";
    
    // 数量がない
    presData.map(item => {
      item.medicines.map(medicine => {
        if (
          medicine.medicineName !== "" &&
          (medicine.amount === undefined)
        ) {
          validationPassed = false;
        }
      });
    });
    
    if (validationPassed === false) {
      strMessage = "注射の数量を入力して下さい。";
      this.setState({alert_messages: strMessage});
      return false;
    }
    
    // 数量がない
    let selMedicines = [];
    let medList = "";
    presData.map(item => {
      item.medicines.map(medicine => {
        if(medicine.period_permission !== undefined && medicine.period_permission < 0) {
          validationPassed = false;
          if(!selMedicines.includes(medicine.medicineId)) {
            selMedicines.push(medicine.medicineId);
            medList += "◆" + medicine.medicineName + "\n";
            if(medicine.gene_name) {
              medList += "(" + medicine.gene_name + ")\n";
            }
          }
        }
      });
    });
    if (validationPassed === false) {
      strMessage = "有効期間外の薬品があります。削除または別の製品に変更してください。\n" + medList;
      this.setState({alert_messages: strMessage});
      return false;
    }
    presData.map(item => {
      if (
        item.medicines.length >= 1 &&
        item.medicines[0].medicineName !== "" &&
        (item.usageName === "" || item.usageName === undefined)
      ) {
        validationPassed = false;
      }
    });
    
    if (validationPassed === false) {
      strMessage = "手技方法を入力して下さい。";
      this.setState({alert_messages: strMessage});
      return false;
    }
    
    // 用法 is_enabled
    presData.map(item => {
      if (this.hasInjectionUnenabledUsage(item.usage) == true) {
        validationPassed = false;
      }
    });
    
    if (validationPassed === false) {
      strMessage = "使用できない手技が選択されています。登録する場合は手技を変更してください";
      this.setState({alert_messages: strMessage});
      return false;
    }
    return validationPassed;
  }
  
  hasInjectionUnenabledUsage = (usage_number) =>{
    // let usageData = JSON.parse(window.localStorage.getItem("haruka_cache_usageInjectData"));
    let usageData = {};
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.injection_usage != undefined && init_status.injection_usage != null) {
      usageData = init_status.injection_usage;
    }
    // let usageNumberArray = [];
    if (usage_number == null || usage_number == undefined) {
      return false;
    }
    
    let nHasUnenabledUsage = 0;
    if (usageData != null && usageData != undefined && usageData.length > 0) {
      usageData.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) {
        return true;
      }
    }
    return false;
  }
  
  handleInsuranceTypeChange = e => {
    this.setState({
      current_insurance_type: e.target.value
    });
    let patientInfo = karteApi.getPatient(this.props.patientId);
    patientInfo.insurance_type = e.target.value;
    let insurance_type = parseInt(e.target.value)
    let insurance_name = patientInfo.insurance_type_list.find((x) => x.code == insurance_type) != undefined ?
      patientInfo.insurance_type_list.find((x) => x.code == insurance_type).name : "";
    
    var path = window.location.href.split("/");
    karteApi.setPatient(this.props.patientId, JSON.stringify(patientInfo));
    let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
    if(sort_data !== undefined && sort_data != null && Object.keys(sort_data).length > 0){
      Object.keys(sort_data).map(sort_index=>{
        if(sort_data[sort_index]['order_key'] !== undefined){
          let key = sort_data[sort_index]['order_key'].split(':')[0];
          let subkey = sort_data[sort_index]['order_key'].split(':')[1];
          if(subkey !== undefined){
            let cache_data = karteApi.getSubVal(this.props.patientId, key, subkey);
            if(key == CACHE_LOCALNAMES.TREATMENT_EDIT){
              cache_data.header.insurance_id = insurance_type;
              cache_data.header.insurance_name = insurance_name;
              karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, subkey, JSON.stringify(cache_data), 'insert');
            } else if(key == CACHE_LOCALNAMES.PRESCRIPTION_EDIT && path[path.length - 1] == "soap"){
              if (cache_data[0] != undefined && cache_data[0].presData != undefined && cache_data[0].presData.length > 0) {
                cache_data[0].presData.map(item=>{
                  item.insurance_type = insurance_type;
                  item.insurance_name = insurance_name;
                });
                karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, subkey, JSON.stringify(cache_data), 'insert');
              }
            } else if(key == CACHE_LOCALNAMES.INJECTION_EDIT && path[path.length - 1] == "soap"){
              if (cache_data[0] != undefined && cache_data[0].injectData != undefined && cache_data[0].injectData.length > 0) {
                cache_data[0].injectData.map(item=>{
                  item.insurance_type = insurance_type;
                  item.insurance_name = insurance_name;
                });
                karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, subkey, JSON.stringify(cache_data), 'insert');
              }
            }
          } else {
            let cache_data = karteApi.getVal(this.props.patientId, key);
            if(key == CACHE_LOCALNAMES.EXAM_EDIT || key == CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT || key == CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT || key == CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT){
              cache_data.insurance_type = insurance_type;
              cache_data.insurance_name = insurance_name;
              karteApi.setVal(this.props.patientId, key, JSON.stringify(cache_data), 'insert');
            }
          }
        }
      });
      $(".cache-insurance-name").html(insurance_name);
    }
    
    //cache-insurance-name
  };
  
  hasSameUser = (concurrentInfo) => {
    let result = 0;
    if (concurrentInfo !== null && concurrentInfo !== undefined && concurrentInfo.length > 1) {
      result = 1;
    }
    return result;
  }
  
  getToolTip = () => {
    var path = window.location.href.split("/");
    if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection"){
      this.setState({tooltip_msg : "確認かキャンセルを押してください。"});
    }
  }
  
  checkEditKarteData=()=>{
    // カルテを閉じるは、常にSOAPに戻った場合押せるように。
    let result = false;
    var path = window.location.href.split("/");
    if (path[path.length - 1] == "soap"){
      let order_sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
      if (order_sort_data != undefined && order_sort_data != null && Object.keys(order_sort_data).length > 0) {
        result = true;
      }
      
      // check exit deleted data
      let existDelCacheData = karteApi.hasDeletedDataFromCache(this.props.patientId);
      if (existDelCacheData == true) {
        result = true;
      }
    }
    if(result){
      $(".btn-karte").addClass("has-save-data");
    } else {
      $(".btn-karte").removeClass("has-save-data");
    }
  }
  
  checkEditKarteDepartment = () => {
    // get current url
    var path = window.location.href.split("/");
    let permission_karte_department = {
      karte: true,
      department:true
    };
    if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
      permission_karte_department = this.canChangeKarteAndDepartment(path[path.length - 1]);
    }
    let isPrescriptionInjectionPage = path[path.length - 1] == "prescription" || path[path.length - 1] == "injection" ? true: false;
    if (isPrescriptionInjectionPage) {
      if ( permission_karte_department.department != true) {
        $('.disable-department-status select').attr('disabled', true);
      } else {
        $('.disable-department-status select').attr('disabled', false);
      }
      if ( permission_karte_department.karte != true) {
        $('.disable-karte-status select').attr('disabled', true);
      } else {
        $('.disable-karte-status select').attr('disabled', false);
      }
    } else {
      $('.disable-department-status select').attr('disabled', false);
      $('.disable-karte-status select').attr('disabled', false);
    }
  }
  
  getModeClassName = () => {
    switch(this.context.$getKarteMode(this.props.patientId)){
      case KARTEMODE.READ:
        return 'read-btn';
      case KARTEMODE.WRITE:
        return 'write-btn';
      case KARTEMODE.EXECUTE:
        return 'execute-btn';
    }
  }
  
  getModeName = () => {
    switch(this.context.$getKarteMode(this.props.patientId)){
      case KARTEMODE.READ:
        return '閲覧のみ';
      case KARTEMODE.WRITE:
        return '記載';
      case KARTEMODE.EXECUTE:
        return '事後';
    }
  }
  
  getPatientName=(name)=>{
    if(name == undefined || name == null){
      return "";
    }
    let changed_name = hankaku2Zenkaku(name);
    changed_name = zenkana2Hankana(changed_name);
    return changed_name;
  }
  
  // ●YJ94 保存済みレコードの入外区変更と診療科変更は権限で制限する by p
  canChangeKarteAndDepartment = (_page) => {
    let result = {
      karte: false,
      department: true
    };
    if (!(_page == "prescription" || _page == "injection")) return result;
    
    let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, _page);
    
    let cacheState = null;
    let feature_type = this.context.FEATURES.PRESCRIPTION;
    if (_page == "prescription") {
      cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
    } else if(_page == "injection") {
      cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
    }
    
    if (cacheState == undefined || cacheState == null || cacheState[0] == undefined || cacheState[0] == null) return result;
    
    if (cacheState[0].isUpdate == undefined || cacheState[0].isUpdate != 1) return result;
    
    if (cacheState[0].created_at == undefined || cacheState[0].created_at == "") return result;
    
    let curDate = new Date(getCurrentDate('-'));
    let start_date = new Date(cacheState[0].created_at.substring(0,10));
    
    // 「診療科修正(当日)」、「診療科修正(過去)」
    let canChangeDepartment = false;
    
    if (curDate.getTime() == start_date.getTime()) { // 「診療科修正(当日)」
      if (this.context.$canDoAction(feature_type, this.context.AUTHS.RECEIPT_CURRENT)){
        canChangeDepartment = true;
      }
    } else if(start_date.getTime() < curDate.getTime()) { // 「診療科修正(過去)」
      if (this.context.$canDoAction(feature_type, this.context.AUTHS.RECEIPT)){
        canChangeDepartment = true;
      }
    }
    
    // 「入外区分修正(当日)」、「入外区分修正(過去)」
    let canChangeKarteStatus = false;
    if (curDate.getTime() == start_date.getTime()) { // 「入外区分修正(当日)」
      if (this.context.$canDoAction(feature_type, this.context.AUTHS.KARTE_STATUS_CURRENT)){
        canChangeKarteStatus = true;
      }
    } else if(start_date.getTime() < curDate.getTime()) { // 「入外区分修正(過去)」
      if (this.context.$canDoAction(feature_type, this.context.AUTHS.KARTE_STATUS_PAST)){
        canChangeKarteStatus = true;
      }
    }
    result.karte = canChangeKarteStatus;
    result.department = canChangeDepartment;
    // ・定期処方を別の区分に変更するのは無しです。定期処方の編集時は権限があってもグレーアウトさせてください。
    if (_page == "prescription") {
      // check ・定期処方
      if (cacheState[0].karte_status_code != undefined && parseInt(cacheState[0].karte_status_code) == 1 && cacheState[0].is_internal_prescription == 3) {
        result.karte = false;
      }
    }
    return result;
  }
  
  setChangeFlag=(flag)=>{
    this.change_flag = flag;
    if(flag){
      $(".btn-karte").addClass("has-save-data");
    } else {
      $(".btn-karte").removeClass("has-save-data");
    }
  }
  
  finishRegister=()=>{
    this.setState({isOpenNurseRecordSave:false});
  }
  
  render() {
    const {patientInfo, isPopupOpen, isConcurrentPopupOpen, isSimpleOrderPopupOpen, isDiseaseNameOpen, isPotionReportPopupOpen, isHospitalPrescriptionPopupOpen} = this.state;
    const { patientId} = this.props;
    const { department, karte_status } = this.context;
    if(window.sessionStorage.getItem("concurrent_access_users") !== undefined){
      var concurrentInfo = JSON.parse(window.sessionStorage.getItem("concurrent_access_users"));
    }
    let {tooltip_msg} = this.state;
    this.font_props = this.context.font_props;
    return (
      <>
        <PatientInfoWrapper>
          <header className={`patients-header ${this.getSelectedPatientClass()}`}>
            <div className="flex my-3">
              <PatientCardWrapper id="patient-head-info" >
                <Wrapper>
                  <Flex>
                    <div className="div-left-side" style={{fontSize:this.font_props+'rem'}}>
                      <div className={`disable-karte-status ${karte_status.name == '入院'?'patient-karte-status pink' : karte_status.name == '訪問診療'?'patient-karte-status green':'patient-karte-status'}`}>
                        <SelectorWithLabel
                          title=""
                          options={KARTE_STATUS_TYPE}
                          getSelect={this.getKarteStatus}
                          value={karte_status.name}
                          departmentEditCode={karte_status.code}
                        />
                      </div>
                      <div className={`disable-department-status`}>
                        <SelectorWithLabel
                          title=""
                          options={this.departmentOptions}
                          getSelect={this.getDepartment}
                          value={department.name}
                          departmentEditCode={department.code}
                        />
                      </div>
                    </div>
                    <div className="ml-2 div-patient-name">
                      <Flex>
                        <div className="div-patient-info mr-2" style={{width:"8rem", marginTop:"3px"}}>
                          <PatientId style={{fontSize:1.1*this.font_props+'rem'}}>患者番号</PatientId>
                          <div className="sex-icon" style={{width:'auto', overflow:"hidden",fontSize:2*this.font_props+'rem'}}>
                            {patientInfo.sex === 1 ? (
                              <LargeUserIcon size="5x" color="#9eaeda" />
                            ) : (
                              <LargeUserIcon size="5x" color="#f0baed" />
                            )}
                          </div>
                          {/*<div className="div-insurance" style={{fontSize:1*this.font_props+'rem'}}>*/}
                          {/*保険:*/}
                          {/*<select*/}
                          {/*value={this.state.current_insurance_type}*/}
                          {/*onChange={this.handleInsuranceTypeChange}*/}
                          {/*onKeyPress={this.handleInsuranceTypeChange}*/}
                          {/*>*/}
                          {/*{patientInfo.insurance_type_list !== undefined && patientInfo.insurance_type_list != null && patientInfo.insurance_type_list.map(*/}
                          {/*(item, index) => {*/}
                          {/*return (*/}
                          {/*<option value={item.code} key={index}>*/}
                          {/*{item.name}*/}
                          {/*</option>*/}
                          {/*);*/}
                          {/*}*/}
                          {/*)}*/}
                          {/*</select>*/}
                          {/*</div>*/}
                        </div>
                        <div
                          style={{width:'18.5rem'}}
                          className="name-area float-left"
                          onClick={this.openPopup.bind(this, 1)}
                          data-toggle="modal"
                          data-target="#modal-sample"
                        >
                          <PatientIdOne style={{fontSize:1.5*this.font_props+'rem'}}>{patientInfo.receId}</PatientIdOne>
                          <Kana style={{fontSize:1.1*this.font_props+'rem'}}>{patientInfo.kana}</Kana>
                          <PatientName style={{fontSize:1.4*this.font_props+'rem'}}>{this.getPatientName(patientInfo.name)}</PatientName>
                        </div>
                        <div className="patient-info float-left" style={{fontSize:0.875*this.font_props+'rem'}}>
                          <Flex>
                            <div>
                              <div className="title-style-1" style={{fontSize:1.1*this.font_props+'rem'}}>{patientInfo.birthDate}</div>
                              <div className="title-style-2" style={{fontSize:1.1*this.font_props+'rem'}}>
                                {patientInfo.age}歳 {patientInfo.age_month}ヶ月{patientInfo.is_death === 1 ? '*' : ''}
                              </div>
                              {patientInfo.ward_info !== undefined && (
                                <div className="title-style-3" style={{fontSize:1.1*this.font_props+'rem'}}>{patientInfo.ward_info}</div>
                              )}
                            </div>
                          </Flex>
                        </div>
                        <div className="float-left" id = "header-icon-groups">
                          <div className="icon-area d-flex">
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openConsentedModal} style={{cursor:"pointer"}}>
                              <AfflictionIcon image={navigation_status} />
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"infection")} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"infection")} onMouseOut={this.hideTooltip}>
                              {this.state.infection_positive ? (
                                <AfflictionIcon image={infection_status_positive} />
                              ) : (
                                ""
                              )}
                              {this.state.infection_no ? (
                                <AfflictionIcon image={infection_status_no} />
                              ) : (
                                ""
                              )}
                              {this.state.infection_unknown ? (
                                <AfflictionIcon image={infection_status_unknown} />
                              ) : (
                                ""
                              )}
                              {this.state.infection_negative ? (
                                <AfflictionIcon image={infection_status_negative} />
                              ) : (
                                ""
                              )}
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"disabled")} style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"disabled")} onMouseOut={this.hideTooltip}>
                              {this.state.disabled ? (
                                <AfflictionIcon image={disabled_status_yes} />
                              ) : (
                                <AfflictionIcon image={disabled_status_no} />
                              )}
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"alergy")} style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"alergy")} onMouseOut={this.hideTooltip}>
                              {this.state.alergy_positive ? (
                                <AfflictionIcon image={alergy_status_positive} />
                              ) : (
                                ""
                              )}
                              {this.state.alergy_no ? (
                                <AfflictionIcon image={alergy_status_no} />
                              ) : (
                                ""
                              )}
                              {this.state.alergy_unknown ? (
                                <AfflictionIcon image={alergy_status_unknown} />
                              ) : (
                                ""
                              )}
                              {this.state.alergy_negative ? (
                                <AfflictionIcon image={alergy_status_negative} />
                              ) : (
                                ""
                              )}
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"drugalergy")} style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"drugalergy")} onMouseOut={this.hideTooltip}>
                              {this.state.drugalergy ? (
                                <AfflictionIcon image={drugalergy_status_yes} />
                              ) : (
                                <AfflictionIcon image={drugalergy_status_no} />
                              )}
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"foodalergy")} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"foodalergy")} onMouseOut={this.hideTooltip}>
                              {this.state.foodalergy ? (
                                <AfflictionIcon image={foodalergy_status_yes} />
                              ) : (
                                <AfflictionIcon image={foodalergy_status_no} />
                              )}
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openPatientStaffModal.bind(this)} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"staff")} onMouseOut={this.hideTooltip}>
                              {this.state.staff ? (
                                <AfflictionIcon image={staff_status_yes} />
                              ) : (
                                <AfflictionIcon image={staff_status_no} />
                              )}
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"adl")} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"adl")} onMouseOut={this.hideTooltip}>
                              {this.state.ADL ? (
                                <AfflictionIcon image={ADL_status_yes} />
                              ) : (
                                <AfflictionIcon image={ADL_status_no} />
                              )}
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openHospitalListModal.bind(this,"vaccine")} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"vaccine")} onMouseOut={this.hideTooltip}>
                              {this.state.vaccine ? (
                                <AfflictionIcon image={vaccine_status_yes} />
                              ) : (
                                <AfflictionIcon image={vaccine_status_no} />
                              )}
                            </div>
                            <div className={this.hasSameUser(concurrentInfo) == 1 ? "icon-ele" : ""} onClick={this.openIntroductionModal.bind(this)} style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"introduction")} onMouseOut={this.hideTooltip}>
                              <AfflictionIcon image={introduction_status} />
                            </div>
                          </div>
                          <div className="btn-area" style={{clear:'both', marginTop:'4px'}}>
                            <RightButtons font_props = {this.font_props}>
                              {/*<Button className={this.getModeClassName() + ' bottom-line-button no-cursor'}>{this.getModeName()}</Button>*/}
                              {/*<Button onClick={this.openInvitorPopup.bind(this, this.hasSameUser(concurrentInfo))} className={this.hasSameUser(concurrentInfo)?'bottom-line-button grey-btn':'bottom-line-button grey-btn disabled-button'}>*/}
                              {/*閲覧中:{this.hasSameUser(concurrentInfo) == 1?concurrentInfo.length:1}*/}
                              {/*</Button>*/}
                              <Button className={this.hasSameUser(concurrentInfo) == 1 ? "bottom-line-button grey-btn grey-btn-new" : "grey-btn bottom-line-button"} onClick={this.openBasicInfo.bind(this)}>基礎データ</Button>
                              <Button className={this.hasSameUser(concurrentInfo) == 1 ? "bottom-line-button grey-btn grey-btn-new" : "grey-btn bottom-line-button"} onClick={this.openHistoryModal.bind(this)}>受診歴</Button>
                            </RightButtons>
                          </div>
                        </div>
                      </Flex>
                    </div>
                    <RightButtons font_props = {this.font_props}>
                      <div className="div-right-side float-right">
                        <div className="right-btn-style-01">
                          <Button className="btn-prof1" onClick={this.openPopup.bind(this, 1)}>Prof</Button>
                          <Button className="btn-prof2" onClick={this.openDiseaseNameModal}>病名</Button>
                        </div>
                        <div className="right-btn-style-02">
                          <Button
                            className={'btn-karte save-btn '+ (this.change_flag == 1 ? "has-save-data" : "")}
                            onClick={this.closeKarte.bind(this)} tooltip={tooltip_msg}
                            tooltip_position="bottom"
                            onMouseOver={this.getToolTip.bind(this)}
                          >
                            閉じる
                          </Button>
                        </div>
                      </div>
                    </RightButtons>
                  </Flex>
                </Wrapper>
              </PatientCardWrapper>
              {this.context.autoLogoutModalShow === false && isPopupOpen && (
                <DetailedPatient
                  id="modal-sample"
                  tabIndex={this.state.tabIndex}
                  closeModal={this.closeModal}
                  patientId={patientId}
                  getSelected={this.getSelected}
                  detailedPatientInfo={this.props.detailedPatientInfo}
                  patientInfoRefresh={this.patientInfoRefresh}
                />
              )}
              {this.context.autoLogoutModalShow === false && isDiseaseNameOpen && (
                <DiseaseNameModal
                  patientId={patientId}
                  closeModal={this.closeDiseaseNameModal}
                  detailedPatientInfo={this.props.detailedPatientInfo}
                  initTab={this.state.diseaseInitTab !== undefined && this.state.diseaseInitTab != null ? this.state.diseaseInitTab : null}
                />
              )}
              {this.state.openAllergyListModal && (
                <AllergyListModal
                  allergy_type={this.state.allergy_type}
                  closeModal={this.closeExamination}
                  patientId={patientId}
                />
              )}
              {this.context.autoLogoutModalShow === false && isSimpleOrderPopupOpen && (
                <SimpleOrder
                  patientInfo={patientInfo}
                  closeModal={this.closeExamination}
                  patientId={patientId}
                />
              )}
              {this.context.autoLogoutModalShow === false && isConcurrentPopupOpen && (
                <ConcurrentuserModal
                  id="modal-sample-1"
                  tabIndex={this.state.tabIndex}
                  closeConcurrentModal={this.closeConcurrentModal}
                  patientId={patientId}
                  getSelected={this.getSelected}
                  concurrentInfo={concurrentInfo}
                />
              )}
              {this.state.isOpenBasicInfo && (
                <BasicInfoModal
                  closeModal={this.closeModal}
                  patientInfo={patientInfo}
                  patientId={patientId}
                  from_mode={"nursing_document"}
                />
              )}
              {this.state.isopenPatientStaffModal && (
                <PatientStaffListModal
                  closeModal={this.closeModal}
                  patientInfo={patientInfo}
                  patientId={patientId}
                  patientInfoRefresh={this.patientInfoRefresh}
                />
              )}
              {this.state.isopenIntroductionModal && (
                <IntroductionListModal
                  closeModal={this.closeModal}
                  patientInfo={patientInfo}
                  patientId={patientId}
                  patientInfoRefresh={this.patientInfoRefresh}
                />
              )}
              {this.state.isOpenHistoryInfoModal && (
                <HistoryInfoModal
                  closeModal={this.closeModal}
                  patientInfo={patientInfo}
                  patientId={patientId}
                />
              )}
              {this.context.autoLogoutModalShow === false && isPotionReportPopupOpen && (
                <PotionReportModal
                  patientInfo={patientInfo}
                  closeModal={this.closeModal}
                  patientId={patientId}
                />
              )}
              {this.context.autoLogoutModalShow === false && isHospitalPrescriptionPopupOpen && (
                <HospitalPrescriptionModal
                  patientInfo={patientInfo}
                  closeModal={this.closeModal}
                  patientId={patientId}
                />
              )}
              {this.state.alert_messages !== "" && (
                <AlertNoFocusModal
                  hideModal= {this.closeModal.bind(this)}
                  handleOk= {this.closeModal.bind(this)}
                  showMedicineContent= {this.state.alert_messages}
                  title = {this.state.confirm_title}
                />
              )}
              {this.state.prescription_confirm_message != undefined && this.state.prescription_confirm_message != null && this.state.prescription_confirm_message !== "" && (
                <PrescriptionConfirmModal
                  hideConfirm= {this.confirmPrescriptionCancel.bind(this)}
                  confirmCancel= {this.confirmPrescriptionCancel.bind(this)}
                  confirmOk= {this.confirmPrescriptionOk.bind(this)}
                  confirmTitle= {this.state.prescription_confirm_message}
                  okTitle= {this.state.okTitle}
                  cancelTitle= {this.state.cancelTitle}
                />
              )}
              <Tooltip
                {...this.state.tooltip}
                parent={this}
                tooltip_content={this.state.tooltip_content}
                tooltip_type={this.state.tooltip_type}
                tooltip_patientInfo={this.state.toolPatientInfo}
              />
              {this.state.confirm_message !== "" && (
                <SystemConfirmJapanModal
                  hideConfirm= {this.closeModal.bind(this)}
                  confirmCancel= {this.closeModal.bind(this)}
                  confirmOk= {this.confirmOk}
                  confirmTitle= {this.state.confirm_message}
                  title = {this.state.confirm_title}
                />
              )}
              {this.state.hasNotConsentedData && (
                <NotConsentedModal
                  patientId={patientId}
                  fromPatient={true}
                  closeNotConsentedModal={this.closeNotConsentedModal}
                />
              )}
            </div>
          </header>
        </PatientInfoWrapper>
        {this.state.isOpenNurseRecordSave && (
          <NurseRecordSave
            closeModal={this.closeModal}
            patientInfo={this.state.patientInfo}
            goOtherPage={this.props.goOtherPage}
            registerNurseRecord={this.props.registerNurseRecord}
          />
        )}
      </>
    );
  }
}

NursePatientNav.contextType = Context;
NursePatientNav.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object.isRequired,
  detailedPatientInfo: PropTypes.object,
  openModal: PropTypes.func,
  patientsList: PropTypes.array,
  goOtherPage: PropTypes.func,
  registerNurseRecord: PropTypes.func,
  saveResult: PropTypes.func,
};
export default NursePatientNav;
