import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import disabled_status_no from "../../_demo/Patients_panel_icon/disabled_status_no.png";
import disabled_status_yes from "../../_demo/Patients_panel_icon/disabled_status_yes.png";
import drugalergy_status_no from "../../_demo/Patients_panel_icon/drugalergy_status_no.png";
import drugalergy_status_yes from "../../_demo/Patients_panel_icon/drugalergy_status_yes.png";
import foodalergy_status_no from "../../_demo/Patients_panel_icon/foodalergy_status_no.png";
import foodalergy_status_yes from "../../_demo/Patients_panel_icon/foodalergy_status_yes.png";
import staff_status_no from "../../_demo/Patients_panel_icon/staff_status_no.png";
import staff_status_yes from "../../_demo/Patients_panel_icon/staff_status_yes.png";
import ADL_status_no from "../../_demo/Patients_panel_icon/ADL_status_no.png";
import ADL_status_yes from "../../_demo/Patients_panel_icon/ADL_status_yes.png";
import vaccine_status_no from "../../_demo/Patients_panel_icon/vaccine_status_no.png";
import vaccine_status_yes from "../../_demo/Patients_panel_icon/vaccine_status_yes.png";
import infection_status_positive from "../../_demo/Patients_panel_icon/infection_status_positive.png";
import infection_status_no from "../../_demo/Patients_panel_icon/infection_status_no.png";
import infection_status_unknown from "../../_demo/Patients_panel_icon/infection_status_unknown.png";
import infection_status_negative from "../../_demo/Patients_panel_icon/infection_status_negative.png";
import alergy_status_positive from "../../_demo/Patients_panel_icon/alergy_status_positive.png";
import alergy_status_no from "../../_demo/Patients_panel_icon/alergy_status_no.png";
import alergy_status_unknown from "../../_demo/Patients_panel_icon/alergy_status_unknown.png";
import alergy_status_negative from "../../_demo/Patients_panel_icon/alergy_status_negative.png";
import navigation_status from "../../_demo/Patients_panel_icon/navigation_status.png";
import introduction_status from "../../_demo/Patients_panel_icon/introduction_status.png";
import AfflictionIcon from "../../atoms/AfflictionIcon";
import axios from "axios";
import ConcurrentuserModal from "../../molecules/ConcurrentuserModal";
import startKarteMode from "~/components/templates/Patient/PrescriptionMethods/startKarteMode";
import * as karteApi from "~/helpers/cacheKarte-utils";
import LargeUserIcon from "../../atoms/LargeUserIcon";
import {CACHE_SESSIONNAMES, hankaku2Zenkaku, KARTEMODE, zenkana2Hankana} from "~/helpers/constants"
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {getDifferentTime} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatTimeSecondIE} from "../../../helpers/date";
import {CACHE_LOCALNAMES, ALLERGY_STATUS_ARRAY, ALLERGY_TYPE_ARRAY} from "~/helpers/constants";
import {disable} from "../../_nano/colors";
import {displayLineBreak} from "~/helpers/dialConstants";
import $ from "jquery";
import {KEY_CODES} from "../../../helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import Radiobox from "~/components/molecules/Radiobox";
import Spinner from "react-bootstrap/Spinner";
import {formatJapan} from "~/helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";
// import RJSON from "~/helpers/rjson";

const Wrapper = styled.div`
  display: block;
  max-width: 100%;
  width: 100%;
  height: 100%;
  padding: 9px 9px 9px 2px;
  max-height: 700px;
  overflow: auto;
  position: relative;
  font-size: 1rem;
  font-family: NotoSansJP;
  img {
    width: 20px;
    margin-left: 8px;
  }
  .patientId{
    color: rgb(126, 126, 126);
    font-size: 25px;
    transform: scale(0.9, 1);
    font-family: NotoSansJP;
    font-weight: lighter;
  }
  .kana_name{
    color: rgb(0, 0, 0);
    font-size: 1rem;
    line-height: 1;
  }
  .patient-name{
    color: rgb(0, 0, 0);
    font-size: 1.25rem;
    font-weight: bold;
  }
    .invitor_number {
    margin-left: auto;
    color: rgb(255,127,39);
  }
    .first-medical {
        -webkit-box-pack: justify;
        justify-content: space-between;
        .block-area {
          width: 45%;
          border: 1px solid #aaa;
          margin-top: 20px;
          padding: 10px;
          position: relative;
          color: black;
          label {
            font-size: 14px;
            width:auto; 
          }
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
    .no-result {
        text-align: center;
        padding-top: 100px;
    }
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  span{
    color: white;
    font-size: 1.25rem !important;
  }
  button{
    float: right;
    padding: 5px;
    font-size: 16px;
    min-width:10rem;
  }
  .focus {
    border: 1px solid #10aae1 !important;
  }
  
  .btn-area {
    margin-left: 0;
    margin-right: auto;
    button{
      span {
        font-size: 20px;
      }
      margin-right: 0.3rem;
    }
    button:last-child{
        margin-right: 0px;
    }
    .custom-modal-btn {
      margin-right: 0.3rem;
    }
    .custom-modal-btn:last-child{
        margin-right: 0;
    }
    .disable {
       background-color: ${disable};
       span{color: grey !important;}
    }
    .write-btn{
        background-color: rgb(241, 86, 124);
    }
    .execute-btn{
        background-color: rgb(241, 136, 86);
    }
  }
  .cancel-btn:hover {
    border: solid 1px #000000 !important;
  }
  .cancel-btn {
    border: solid 1px #7e7e7e !important;
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

const SpinnerWrapper = styled.div`
    padding: 0;
`;

const Tooltip = ({visible,x,y,tooltip_content}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
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
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

export class SelectModeModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names = {};
    departmentOptions.map(department=>{
      this.department_names[parseInt(department.id)] = department.value;
    });
    this.state = {
      isConcurrentPopupOpen: false,
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
      alert_messages:"",
      btnFocus: 0,
      visit_type:2,
      diagnosis_type:1,
      patientInfo:null,
    };
    this.read_disable='';
    this.register_disable='';
    this.edit_disable='';
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.karte_in_out_enable_hospitalization = 0;
    this.karte_in_out_enable_visiting = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.karte_in_out_enable_hospitalization !== undefined && initState.conf_data.karte_in_out_enable_hospitalization == "ON"){
        this.karte_in_out_enable_hospitalization = 1;
      }
      if(initState.conf_data.karte_in_out_enable_visiting !== undefined && initState.conf_data.karte_in_out_enable_visiting == "ON"){
        this.karte_in_out_enable_visiting = 1;
      }
    }
    this.hospital_patient_flag = 0;
    this.hospital_patient_department = 0;
    this.date_and_time_of_hospitalization = "";
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  }

  async componentDidMount() {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    //バックグラウンドで初回描画用のデータを取得する
    localApi.setValue("isCallFirstKarteData", 1);
    await this.getInitData();
    // カルテ権限に応じて「記載」、「事後」、「閲覧」のボタンを使えないボタンは灰色にする   2020-04-14
    if (!this.context.$canDoAction(this.context.FEATURES.KARTE, this.context.AUTHS.REGISTER)){
      this.register_disable = 'disable';
    }
    if(this.register_disable !== 'disable'){
      // if(this.props.modal_type === "reservation"){
      //   if(new Date(this.props.modal_data.scheduled_date).getTime() < new Date(formatDateLine(new Date())).getTime()){
      //     this.register_disable = 'disable';
      //   }
      // }
      if(this.props.modal_type === "visit"){
        if(this.props.modal_data.scheduled_date != null && new Date(this.props.modal_data.scheduled_date).getTime() < new Date(formatDateLine(new Date())).getTime()){
          this.register_disable = 'disable';
        }
      }
      // if(this.props.modal_type === "inspection" || this.props.modal_type === "treat_order" || this.props.modal_type === "order" || this.props.modal_type === "report_list" || this.props.modal_type === "out_treatment_injection_list"){
      //   if(new Date(this.props.modal_data.date).getTime() < new Date(formatDateLine(new Date())).getTime()){
      //     this.register_disable = 'disable';
      //   }
      // }
    }
    if (!this.context.$canDoAction(this.context.FEATURES.KARTE, this.context.AUTHS.EDIT)){
      this.edit_disable = 'disable';
    }
    if (!this.context.$canDoAction(this.context.FEATURES.KARTE, this.context.AUTHS.READ)){
      this.read_disable = 'disable';
    }
    document.getElementById("select_mode_modal").focus();
    if(this.register_disable === ''){
      document.getElementById("btnWrite").focus();
    } else if(this.edit_disable === ''){
      this.setState({btnFocus: 1}, ()=>{
        document.getElementById("btnExecute").focus();
      });
    } else if(this.read_disable === ''){
      this.setState({btnFocus: 2}, ()=>{
        document.getElementById("btnRead").focus();
      });
    } else {
      this.setState({btnFocus: 3}, ()=>{
        document.getElementById("btnCancel").focus();
      });
    }
    this.getFirstKarteData();
  }

  getInitData = async () => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let {data} = await axios.post(
      "/app/api/v2/soap/patient_init_data",
      {system_patient_id:parseInt(this.props.modal_data.systemPatientId)}
    );
    let concurrentInfo = data.con_current;
    let writeModeUser = concurrentInfo.filter(x=>x.mode != KARTEMODE.READ && x.staff_number != this.authInfo.user_number);
    if (data.patient_state != null){
      karteApi.setVal(this.props.modal_data.systemPatientId, "patient_state", JSON.stringify(data.patient_state));
    }
    if(data.is_hospital == 1){
      this.hospital_patient_flag = 1;
      this.hospital_patient_department = data.hospital_department;
      this.date_and_time_of_hospitalization = data.date_and_time_of_hospitalization;
    }

    let set_state = {
      patientInfo: data.init_patient,
      concurrentInfo: concurrentInfo,
      writeModeUser: writeModeUser
    }

    if (data != undefined && data != null) {
      Object.keys(data.patient_state).map((key)=>{
        let item = data.patient_state[key];
        if (key === "patient_data"){
          set_state.patient_data = item;
        } else {
          let state_data = this.getSelected(item);
          if(Object.keys(state_data).length > 0){
            Object.keys(state_data).map(key=>{
              set_state[key] = state_data[key];
            });
          }
        }
      });
    }
    this.setState(set_state);
  }

  onKeyPressed=(e)=> {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {
      let btnFocus = this.state.btnFocus;
      if(e.keyCode === KEY_CODES.left){
        if(btnFocus == 0){
          btnFocus = 3;
        } else {
          btnFocus--;
        }
      } else {
        if(btnFocus == 3){
          btnFocus = 0;
        } else {
          btnFocus++;
        }
      }
      this.setState({btnFocus}, ()=>{
        if(btnFocus == 0){
          document.getElementById("btnWrite").focus();
        }
        if(btnFocus == 1){
          document.getElementById("btnExecute").focus();
        }
        if(btnFocus == 2){
          document.getElementById("btnRead").focus();
        }
        if(btnFocus == 3){
          document.getElementById("btnCancel").focus();
        }
      });
    }
    if (e.keyCode === KEY_CODES.up || e.keyCode === KEY_CODES.down) {
      document.getElementById("select_mode_modal").focus();
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      switch (this.state.btnFocus){
        case 0:
          this.selectMode(KARTEMODE.WRITE);
          break;
        case 1:
          this.selectMode(KARTEMODE.EXECUTE);
          break;
        case 2:
          this.selectMode(KARTEMODE.READ);
          break;
        case 3:
          this.closeSelectModeModal();
          break;
      }
    }
  }

  getConcurrentInfo = async () => {
    let concurrentInfo = {
      data: await axios.get("/app/api/v2/connection/get_concurrent_access_users", {
        params: {
          patientId: this.props.modal_data.systemPatientId
        }
      })
    };
    concurrentInfo = concurrentInfo.data.data;
    let writeModeUser = concurrentInfo.filter(x=>x.mode != KARTEMODE.READ && x.staff_number != this.authInfo.user_number);
    this.setState({
      concurrentInfo,
      writeModeUser,
    })
  };

  getSelected = icon_various => {
    let ret_data = {};
    switch (icon_various) {
      case "disabled_status_no":
        ret_data['disabled'] = false;
        break;
      case "disabled_status_yes":
        ret_data['disabled'] = true;
        break;
      case "drugalergy_status_no":
        ret_data['drugalergy'] = false;
        break;
      case "drugalergy_status_yes":
        ret_data['drugalergy'] = true;
        break;
      case "foodalergy_status_no":
        ret_data['foodalergy'] = false;
        break;
      case "foodalergy_status_yes":
        ret_data['foodalergy'] = true;
        break;
      case "staff_status_no":
        ret_data['staff'] = false;
        break;
      case "staff_status_yes":
        ret_data['staff'] = true;
        break;
      case "ADL_status_no":
        ret_data['ADL'] = false;
        break;
      case "ADL_status_yes":
        ret_data['ADL'] = true;
        break;
      case "vaccine_status_no":
        ret_data['vaccine'] = false;
        break;
      case "vaccine_status_yes":
        ret_data['vaccine'] = true;
        break;
      case "infection_status_init":
        ret_data['infection_positive'] = false;
        ret_data['infection_no'] = false;
        ret_data['infection_unknown'] = false;
        ret_data['infection_negative'] = false;
        break;
      case "infection_status_positive":
        ret_data['infection_positive'] = true;
        ret_data['infection_no'] = false;
        ret_data['infection_unknown'] = false;
        ret_data['infection_negative'] = false;
        break;
      case "infection_status_no":
        ret_data['infection_positive'] = false;
        ret_data['infection_no'] = true;
        ret_data['infection_unknown'] = false;
        ret_data['infection_negative'] = false;
        break;
      case "infection_status_unknown":
        ret_data['infection_positive'] = false;
        ret_data['infection_no'] = false;
        ret_data['infection_unknown'] = true;
        ret_data['infection_negative'] = false;
        break;
      case "infection_status_negative":
        ret_data['infection_positive'] = false;
        ret_data['infection_no'] = false;
        ret_data['infection_unknown'] = false;
        ret_data['infection_negative'] = true;
        break;
      case "alergy_status_init":
        ret_data['alergy_positive'] = false;
        ret_data['alergy_no'] = false;
        ret_data['alergy_unknown'] = false;
        ret_data['alergy_negative'] = false;
        break;
      case "alergy_status_positive":
        ret_data['alergy_positive'] = true;
        ret_data['alergy_no'] = false;
        ret_data['alergy_unknown'] = false;
        ret_data['alergy_negative'] = false;
        break;
      case "alergy_status_no":
        ret_data['alergy_positive'] = false;
        ret_data['alergy_no'] = true;
        ret_data['alergy_unknown'] = false;
        ret_data['alergy_negative'] = false;
        break;
      case "alergy_status_unknown":
        ret_data['alergy_positive'] = false;
        ret_data['alergy_no'] = false;
        ret_data['alergy_unknown'] = true;
        ret_data['alergy_negative'] = false;
        break;
      case "alergy_status_negative":
        ret_data['alergy_positive'] = false;
        ret_data['alergy_no'] = false;
        ret_data['alergy_unknown'] = false;
        ret_data['alergy_negative'] = true;
        break
    }
    return ret_data;
  };

  openInvitorPopup = () => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    this.setState({ isConcurrentPopupOpen: true });
    var base_modal = document.getElementsByClassName("mode-select-modal")[0];
    if(base_modal !== undefined) base_modal.style['z-index'] = 1040;
  };

  closeConcurrentModal = () => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    this.setState({ isConcurrentPopupOpen: false });
    var base_modal = document.getElementsByClassName("mode-select-modal")[0];
    if(base_modal !== undefined) base_modal.style['z-index'] = 1050;
  };

  selectMode = async (mode) => {
    if(this.state.patientInfo == null){return;}
    // 「カルテ」権限の追加 2020-04-11
    if (mode == KARTEMODE.READ && this.read_disable === 'disable'){return;}
    if (mode == KARTEMODE.WRITE && this.register_disable === 'disable'){return;}
    if (mode == KARTEMODE.EXECUTE && this.edit_disable === 'disable'){return;}
    let patient_info =  this.state.patientInfo;
    let modal_type = this.props.modal_type;
    let props_info = this.props.modal_data;
    let params = {
      staff_number: this.authInfo.user_number,
      patient_id: props_info.systemPatientId,
      karte_mode: mode
    };
    let api_data = await startKarteMode(params);
    if(api_data && api_data.result !== undefined && api_data.result != null && api_data.result == 1) {
      if (api_data.staff_number != this.authInfo.user_number) {
        this.getConcurrentInfo();
        this.setState({alert_messages: api_data.alert_message});
        return;
      }
    }
    patient_info.karte_mode = mode;
    karteApi.setPatient(props_info.systemPatientId, JSON.stringify(patient_info));
    let department_code = (props_info.department_code != undefined && props_info.department_code != null) ? props_info.department_code : 1;
    let department_name = (props_info.department != undefined && props_info.department != null) ? props_info.department : "内科";
    if(modal_type == "reservation" || modal_type == "ward_list" || modal_type == "bed_control" || modal_type == "ward_bed" || modal_type == "summary_list"
      || modal_type == "meal_instruction_list" || modal_type == "meal_prescription_list"){
      department_code = props_info.diagnosis_code;
      department_name = props_info.diagnosis_name;
    } else if (modal_type == "inspection" || modal_type == "treat_order" || modal_type == "order" || modal_type == "report_list" || modal_type == "out_treatment_injection_list"){
      department_code = props_info.medical_department_code;
      department_name = props_info.department_name;
    }
    // save before page
    let karte_status = 0;
    let karte_status_name = "外来";
    if (modal_type == "patients_list") { // 受付一覧
      if (mode != KARTEMODE.READ) {
        let acceptedData = {
          accepted_number:props_info.receivedId,
          accepted_department_code:props_info.department_code,
          accepted_date:props_info.accepted_date,
          status:props_info.status
        };
        if (acceptedData.accepted_number > 0) {
          karteApi.setVal(props_info.systemPatientId, CACHE_LOCALNAMES.ACCEPT_DATA, JSON.stringify(acceptedData));
        }
      }
    } else if(modal_type == "reservation" && mode != KARTEMODE.READ) { // 外来予約
      let visit_info = karteApi.getVal(this.props.modal_data.systemPatientId, CACHE_LOCALNAMES.VISIT_INFO);
      if(visit_info !== undefined && visit_info != null){
        this.setState({alert_messages:'既に'+ visit_info.place_name +'の'+ visit_info.group_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
        return;
      }
      let treatment_started_at = formatDateLine(new Date())+ ' ' + formatTimeSecondIE(new Date());
      if(this.props.modal_data.reservation_state == 0 || this.props.modal_data.reservation_state == 1 || this.props.modal_data.reservation_state == 10){
        let path = "/app/api/v2/reservation/register_schedule";
        let post_data = {
          state: 2,
          number:this.props.modal_data.reservation_number,
          treatment_started_at,
        };
        await apiClient
          .post(path, {
            params: post_data
          })
          .then(() => {
          })
          .catch(() => {

          });
      }
      if(this.props.modal_data.reservation_state == 0 || this.props.modal_data.reservation_state == 1 || this.props.modal_data.reservation_state == 2 || this.props.modal_data.reservation_state == 10){
        let reservation_info = {};
        reservation_info.schedule_number = this.props.modal_data.reservation_number;
        reservation_info.treatment_started_at = treatment_started_at;
        reservation_info.diagnosis_name = this.props.modal_data.diagnosis_name;
        reservation_info.visit_type = this.state.visit_type;
        reservation_info.diagnosis_type = this.state.diagnosis_type;
        karteApi.setVal(this.props.modal_data.systemPatientId, CACHE_LOCALNAMES.RESERVATION_INFO, JSON.stringify(reservation_info));
      }
      localApi.setValue("karte_view_department_code", this.props.modal_data.diagnosis_code);
    } else if(modal_type == "visit" && mode != KARTEMODE.READ) { // 訪問診療予定
      let reservation_info = karteApi.getVal(this.props.modal_data.systemPatientId, CACHE_LOCALNAMES.RESERVATION_INFO);
      if(reservation_info !== undefined && reservation_info != null){
        this.setState({alert_messages: '既に'+ reservation_info.diagnosis_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
        return;
      }
      let treatment_started_at = formatDateLine(new Date())+ ' ' + formatTimeSecondIE(new Date());
      if(this.props.modal_data.visit_state == 0 && this.props.modal_data.visit_number != 0){
        let path = "/app/api/v2/visit/schedule/add_patient";
        let post_data = {
          state: 1,
          number:this.props.modal_data.visit_number,
          treatment_started_at,
        };
        await apiClient
          .post(path, {
            params: post_data
          })
          .then(() => {
          })
          .catch(() => {

          });
      }
      if(this.props.modal_data.visit_state == 0 || this.props.modal_data.visit_state == 1){
        let visit_info = {};
        visit_info.schedule_number = this.props.modal_data.visit_number;
        visit_info.treatment_started_at = treatment_started_at;
        visit_info.place_name = this.props.modal_data.place_name;
        visit_info.group_name = this.props.modal_data.group_name;
        visit_info.visit_type = this.state.visit_type;
        visit_info.diagnosis_type = this.state.diagnosis_type;
        karteApi.setVal(this.props.modal_data.systemPatientId, CACHE_LOCALNAMES.VISIT_INFO, JSON.stringify(visit_info));
      }
      if(this.karte_in_out_enable_visiting == 1){
        karte_status = 2;
        karte_status_name = "訪問診療";
      }
    } else if (modal_type == "ward_list" || modal_type == "bed_control" || modal_type == "ward_bed" || modal_type == "ward_map" || modal_type == "summary_list"){
      if(this.karte_in_out_enable_hospitalization == 1){
        karte_status = 1;
        karte_status_name = "入院";
      }
    }
    if(this.hospital_patient_flag == 1 && this.karte_in_out_enable_hospitalization == 1){//入院中の患者の、入外区分と診療科の初期選択の調整
      karte_status = 1;
      karte_status_name = "入院";
      department_code = this.hospital_patient_department;
      department_name = this.department_names[this.hospital_patient_department];
    }
    this.context.$updateKarteStatusDepartment(this.props.modal_data.systemPatientId, karte_status, karte_status_name, department_code, department_name);
    this.goKarte(mode);
  };

  goKarte=()=>{
    // karte mode
    let page = this.authInfo.karte_entrance_page == undefined || this.authInfo.karte_entrance_page == "" ? "soap" : this.authInfo.karte_entrance_page;
    let props_info = this.props.modal_data;
    let patient_id = props_info.systemPatientId;
    let isExist = false;
    if(this.context.patientsList != null && this.context.patientsList != undefined && this.context.patientsList.length > 0) {
      this.context.patientsList.map(item=>{
        if (item.system_patient_id == patient_id) {
          isExist = true;
        }
      });
    }
    let system_before_page = localApi.getValue('system_before_page');
    karteApi.setPatientBeforePage(patient_id, system_before_page);
    // karte mode context setting
    let goToUrl = (this.context.patientsList != null && this.context.patientsList != undefined && this.context.patientsList.length > 3 && isExist == false) ? "/patients": "/patients/"+props_info.systemPatientId+"/"+page;
    if (this.props.modal_type == "navigation_modal" || this.props.modal_type == "ward_map") { // navigation modal
      this.props.goToUrl();
    } else {
      if(this.props.modal_type === "bed_control" || this.props.modal_type === "out_treatment_injection_list" || this.props.modal_type === "summary_list"){
        this.props.goToUrl(patient_id);
      } else {
        this.props.goToUrl(goToUrl);
      }
    }
  }

  getFirstKarteData=()=>{
    let patient_id = this.props.modal_data.systemPatientId;
    let params = {};
    params.medical_department_code = 1;
    params.patient_id = patient_id;
    params.requestType = "onlyCurrentSoap";
    params.karte_status = 1;
    if(this.props.modal_type === "reservation"){
      if(new Date(this.props.modal_data.scheduled_date).getTime() < new Date(formatDateLine(new Date())).getTime()){
        params.medical_department_code = this.props.modal_data.diagnosis_code;
        params.date = this.props.modal_data.scheduled_date.split(" ")[0];
        params.karte_view_mode = "date";
      }
    }
    if(this.props.modal_type === "visit"){
      if(this.karte_in_out_enable_visiting == 1){
        params.karte_status = 2;
      }
      if(new Date(this.props.modal_data.scheduled_date).getTime() < new Date(formatDateLine(new Date())).getTime()){
        params.date = this.props.modal_data.scheduled_date;
        params.karte_view_mode = "date";
      }
    }
    if(this.props.modal_type === "inspection" || this.props.modal_type === "treat_order" || this.props.modal_type === "order" || this.props.modal_type === "report_list" || this.props.modal_type === "out_treatment_injection_list"){
      if(new Date(this.props.modal_data.date).getTime() < new Date(formatDateLine(new Date())).getTime()){
        params.date = this.props.modal_data.date;
        params.medical_department_code = this.props.modal_data.medical_department_code;
        params.karte_view_mode = "date";
      }
    }
    if(this.props.modal_type === "ward_list" || this.props.modal_type === "bed_control"){
      if(this.karte_in_out_enable_hospitalization == 1){
        params.karte_status = 3;
      }
      params.medical_department_code = this.props.modal_data.diagnosis_code;
    }
    if(this.hospital_patient_flag == 1 && this.karte_in_out_enable_hospitalization == 1){//入院中の患者の、入外区分と診療科の初期選択の調整
      params.karte_status = 3;
      params.medical_department_code = this.hospital_patient_department;
    }
    apiClient.get("/app/api/v2/karte/tree/search", {
      params,
    }).then((res) => {
      // let res = RJSON.unpack(_res);
      // console.log('res_first1', RJSON.unpack(_res));
      // console.log('res_first2', RJSON.pack(_res));
      // console.log('res_3', res);
      let first_karte_data = localApi.getObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA);
      if(first_karte_data == null || first_karte_data === undefined){
        first_karte_data = {};
      }
      first_karte_data[patient_id] = {};
      first_karte_data[patient_id]['karte_data'] = res;
      first_karte_data[patient_id]['karte_status'] = 1;
      first_karte_data[patient_id]['medical_department_code'] = 1;
      if(this.props.modal_type === "reservation"){
        first_karte_data[patient_id]['medical_department_code'] = this.props.modal_data.diagnosis_code;
      }
      if(this.props.modal_type === "inspection" || this.props.modal_type === "treat_order"|| this.props.modal_type === "order" || this.props.modal_type === "report_list" || this.props.modal_type === "out_treatment_injection_list"){
        first_karte_data[patient_id]['medical_department_code'] = this.props.modal_data.medical_department_code;
      }
      if(this.props.modal_type === "visit"){
        if(this.karte_in_out_enable_visiting == 1){
          first_karte_data[patient_id]['karte_status'] = 2;
        }
      }
      if(this.props.modal_type === "ward_list" || this.props.modal_type === "bed_control"){
        if(this.karte_in_out_enable_hospitalization == 1){
          first_karte_data[patient_id]['karte_status'] = 3; //入院
        }
        first_karte_data[patient_id]['medical_department_code'] = this.props.modal_data.diagnosis_code;
      }
      if(this.hospital_patient_flag == 1 && this.karte_in_out_enable_hospitalization == 1){//入院中の患者の、入外区分と診療科の初期選択の調整
        first_karte_data[patient_id]['karte_status'] = 3; //入院
        first_karte_data[patient_id]['medical_department_code'] = this.hospital_patient_department;
      }
      if (res.exist_not_done_order != undefined && res.exist_not_done_order != '') {
        first_karte_data[patient_id]['exist_not_done_order'] = res.exist_not_done_order;
      }
      localApi.setObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA, first_karte_data);
    })
  };

  closeModal =()=>{
    this.setState({
      alert_messages: "",
    });
  };

  diffTime(firtsttime) {
    var currentTime = new Date();
    firtsttime = firtsttime.split("-").join("/");
    var diff = getDifferentTime(currentTime, firtsttime);
    var diff_second = Math.floor(diff / 1000);
    var diff_min =  Math.floor(diff_second / 60);
    var diff_hour = 0;
    if(diff_min >= 60) {
      diff_hour = Math.floor(diff_min / 60);
    }
    diff_min = diff_min % 60;
    if (diff_hour > 0) {
      return diff_hour + "時間" + diff_min + "分前";
    } else {
      return diff_min + "分前";
    }
  }

  gethours(str) {
    return str.substring(11,13);
  }

  getminutes(str) {
    return str.substring(14,16);
  }

  editTooltip = async(e, tooltip_type) => {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let {patient_data} = this.state;
    if (patient_data == null || patient_data[tooltip_type] == undefined || patient_data[tooltip_type] == null) return;
    let content = this.makeTooltipContent(patient_data[tooltip_type],tooltip_type);
    this.setState({
      tooltip: {
        visible: true,
        x: e.clientX - $("#select_mode_modal").offset().left,
        y: e.clientY+window.pageYOffset -$("#select_mode_modal").offset().top + 20,
      },
      tooltip_content:content,
      tooltip_type,
    });
  };

  hideTooltip = () => {
    this.setState({ tooltip: { visible: false } });
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

  closeSelectModeModal=()=>{
    if(this.props.modal_data != null){
      let patient_id = this.props.modal_data.systemPatientId;
      let first_karte_data = localApi.getObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA);
      if(first_karte_data != null && first_karte_data !== undefined && first_karte_data[patient_id] !== undefined){
        delete first_karte_data[patient_id];
        localApi.setObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA, first_karte_data);
      }
      localApi.remove('isCallFirstKarteData');
    }
    this.props.closeModal();
  }

  setVisitType = (e) => {
    this.setState({visit_type:parseInt(e.target.value)});
  }

  setDiagnosisType = (e) => {
    this.setState({diagnosis_type:parseInt(e.target.value)});
  }

  viewCheck=()=>{
    let modal_data = this.props.modal_data;
    let view_flag = false;
    if(this.props.modal_type === "reservation"){
      if(modal_data.reservation_state == 0 || modal_data.reservation_state == 1 || modal_data.reservation_state == 2 || modal_data.reservation_state == 10){
        view_flag = true;
      }
    }
    if(this.props.modal_type === "visit"){
      if(modal_data.visit_state == 0 || modal_data.visit_state == 1){
        view_flag = true;
      }
    }
    return view_flag;
  }

  getDayDiff (datetime) {
    if (datetime == null) return '';
    let timeDiff = new Date(formatDateLine(new Date())).getTime() - new Date(datetime.split(' ')[0]).getTime();
    if(timeDiff < 0){
      return datetime.split(' ')[0]+"より入院予定";
    } else {
      timeDiff = Math.abs(timeDiff);
      let diffDays = parseInt(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      return "入院日数："+diffDays + '日（' + datetime.split(' ')[0] + 'より）';
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

  render() {
    let {patientInfo, concurrentInfo, writeModeUser} = this.state;
    let time = new Date();
    return (
      <Modal
        show={true}
        id="select_mode_modal"
        className="custom-modal-sm basic-data-modal mode-select-modal first-view-modal"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header>
          <Modal.Title>カルテモード</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {patientInfo == null ? (
              <div className='spinner_area no-result'>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            ) : (
              <>
                <div className={`info-area`}>
                  <div className={`d-flex w-100`}>
                    <div className={`w-50 d-flex`}>
                      <div className={'sex mr-2'}>
                        {patientInfo.sex === 1 ? (
                          <LargeUserIcon size="3x" color="#9eaeda" />
                        ) : (
                          <LargeUserIcon size="3x" color="#f0baed" />
                        )}
                      </div>
                      <div className={'patientId'}>{patientInfo.receId}</div>
                    </div>
                    <div className={`ml-5 w-50`}>
                      <div className={'patient-name mb-3'}>{this.getPatientName(patientInfo.name)}</div>
                      <div className={`kana_name`}>{patientInfo.kana}</div>
                    </div>
                  </div>
                  <div className={`d-flex w-100 mt-3`}>
                    <div className={`w-50`}>
                      <div className={`birthdate mr-2`}>{patientInfo.birthDate}</div>
                      <div className={`age mb-1`}>{patientInfo.age}歳 {patientInfo.age_month}ヶ月{patientInfo.is_death === 1 ? "*" : ""}</div>
                      {this.hospital_patient_flag == 1 && (
                        <div className={`age mb-1`}>{this.getDayDiff(this.date_and_time_of_hospitalization.split("-").join("/"))}</div>
                      )}
                    </div>
                    {patientInfo.height > 0 && patientInfo.weight >0 && (
                      <div className="height-weight ml-2 w-50">
                        <div className={`mb-1`}>身長：{patientInfo.height}cm</div>
                        <div>体重：{patientInfo.weight}kg</div>
                      </div>
                    )}
                  </div>
                  <div className="icon-area d-flex">
                    <div style={{cursor:"pointer"}}>
                      <AfflictionIcon image={navigation_status} />
                    </div>
                    <div style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"infection")} onMouseOut={this.hideTooltip}>
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
                    <div style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"disabled")} onMouseOut={this.hideTooltip}>
                      {this.state.disabled ? (
                        <AfflictionIcon image={disabled_status_yes} />
                      ) : (
                        <AfflictionIcon image={disabled_status_no} />
                      )}
                    </div>
                    <div style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"alergy")} onMouseOut={this.hideTooltip}>
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
                    <div style={{cursor:"pointer"}}  onMouseOver={e=>this.editTooltip(e,"drugalergy")} onMouseOut={this.hideTooltip}>
                      {this.state.drugalergy ? (
                        <AfflictionIcon image={drugalergy_status_yes} />
                      ) : (
                        <AfflictionIcon image={drugalergy_status_no} />
                      )}
                    </div>
                    <div style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"foodalergy")} onMouseOut={this.hideTooltip}>
                      {this.state.foodalergy ? (
                        <AfflictionIcon image={foodalergy_status_yes} />
                      ) : (
                        <AfflictionIcon image={foodalergy_status_no} />
                      )}
                    </div>
                    <div style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"staff")} onMouseOut={this.hideTooltip}>
                      {this.state.staff ? (
                        <AfflictionIcon image={staff_status_yes} />
                      ) : (
                        <AfflictionIcon image={staff_status_no} />
                      )}
                    </div>
                    <div style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"adl")} onMouseOut={this.hideTooltip}>
                      {this.state.ADL ? (
                        <AfflictionIcon image={ADL_status_yes} />
                      ) : (
                        <AfflictionIcon image={ADL_status_no} />
                      )}
                    </div>
                    <div style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"vaccine")} onMouseOut={this.hideTooltip}>
                      {this.state.vaccine ? (
                        <AfflictionIcon image={vaccine_status_yes} />
                      ) : (
                        <AfflictionIcon image={vaccine_status_no} />
                      )}
                    </div>
                    <div style={{cursor:"pointer"}} onMouseOver={e=>this.editTooltip(e,"introduction")} onMouseOut={this.hideTooltip}>
                      <AfflictionIcon image={introduction_status} />
                    </div>
                  </div>
                  {concurrentInfo !== undefined && concurrentInfo !== null && concurrentInfo.length > 0 ? (
                    <div className="invitor_number float-left mt-2" onClick={this.openInvitorPopup} style={{cursor:"pointer"}}>
                      同時閲覧ユーザー：{concurrentInfo.length}
                    </div>
                  ) : (
                    <div className="invitor_number float-left">
                      同時閲覧ユーザー：0
                    </div>
                  )}
                  <br />
                  <div className="write-mode-user mt-2">
                    {writeModeUser !== undefined && writeModeUser !== null && writeModeUser.length > 0 ? (
                      <>
                        <div>記載中のユーザー: 確認時刻 {(time.getHours() < 10 ? '0' : '') + time.getHours()} : {(time.getMinutes() < 10 ? '0' : '') + time.getMinutes()}</div>
                        {writeModeUser.map(info=>{
                          return (
                            <div className={`d-flex`} key={info} style={{marginLeft: 122}}>
                              <div>{info.name}</div>
                              <div className={`ml-1`}>{this.gethours(info.updated_at)}:{this.getminutes(info.updated_at)}({this.diffTime(info.updated_at)})</div>
                            </div>
                          )
                        })}
                      </>
                    ) : (
                      <div>記載中のユーザー: なし</div>
                    )}
                  </div>
                </div>
                {this.viewCheck() && (
                  <div className={'first-medical'} style={{display:"flex"}}>
                    <div className={'block-area'}>
                      <div className={'block-title'}>初再診</div>
                      <Radiobox
                        label={'未設定'}
                        value={0}
                        getUsage={this.setVisitType.bind(this)}
                        checked={this.state.visit_type == 0 ? true : false}
                        disabled={true}
                        name={`visit_type`}
                      />
                      <Radiobox
                        label={'初診'}
                        value={1}
                        getUsage={this.setVisitType.bind(this)}
                        checked={this.state.visit_type == 1 ? true : false}
                        disabled={true}
                        name={`visit_type`}
                      />
                      <Radiobox
                        label={'再診'}
                        value={2}
                        getUsage={this.setVisitType.bind(this)}
                        checked={this.state.visit_type == 2 ? true : false}
                        disabled={true}
                        name={`visit_type`}
                      />
                    </div>
                    <div className={'block-area'}>
                      <div className={'block-title'}>診察区分</div>
                      <Radiobox
                        label={'未設定'}
                        value={0}
                        getUsage={this.setDiagnosisType.bind(this)}
                        checked={this.state.diagnosis_type == 0 ? true : false}
                        disabled={true}
                        name={`diagnosis_type`}
                      />
                      <Radiobox
                        label={'対面'}
                        value={1}
                        getUsage={this.setDiagnosisType.bind(this)}
                        checked={this.state.diagnosis_type == 1 ? true : false}
                        disabled={true}
                        name={`diagnosis_type`}
                      />
                      <Radiobox
                        label={'電話'}
                        value={2}
                        getUsage={this.setDiagnosisType.bind(this)}
                        checked={this.state.diagnosis_type == 2 ? true : false}
                        disabled={true}
                        name={`diagnosis_type`}
                      />
                    </div>
                  </div>
                )
                }
              </>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          {/*<Footer>*/}
            {/*<div className={`d-flex btn-area`}>*/}
              {/*<Button id="btnWrite" onClick={this.selectMode.bind(this,KARTEMODE.WRITE)} className={`write-btn ${this.register_disable} ${this.state.btnFocus === 0 ? "focus": ""}`}>*/}
                {/*/!*外来予約中断*!/*/}
                {/*{(this.props.modal_type == "reservation"&&this.props.modal_data.reservation_state == 10) ? '再開' : '記載'}*/}
              {/*</Button>*/}
              {/*<Button id="btnExecute" onClick={this.selectMode.bind(this,KARTEMODE.EXECUTE)} className={`execute-btn ${this.edit_disable} ${this.state.btnFocus === 1 ? " focus": ""}`}>事後</Button>*/}
              {/*<Button id="btnRead" onClick={this.selectMode.bind(this,KARTEMODE.READ)} className={`${this.read_disable} ${this.state.btnFocus === 2 ? "focus": ""}`}>閲覧のみ</Button>*/}
            {/*</div>*/}
            {/*<Button id="btnCancel" onClick={this.closeSelectModeModal} className={this.state.btnFocus === 3 ? "focus cancel-btn": "cancel-btn"}>キャンセル</Button>*/}
          {/*</Footer>*/}
          <Footer>
            <div className={`d-flex btn-area`}>
              <div onClick={this.selectMode.bind(this,KARTEMODE.WRITE)} id="btnWrite" className={`custom-modal-btn write-btn ${this.register_disable} ${this.state.btnFocus === 0 ? "focus": ""}`} style={{cursor:"pointer"}}>
                <span>{(this.props.modal_type == "reservation"&&this.props.modal_data.reservation_state == 10) ? '再開' : '記載'}</span>{/*外来予約中断*/}
              </div>
              <div onClick={this.selectMode.bind(this,KARTEMODE.EXECUTE)} id="btnExecute" className={`custom-modal-btn execute-btn ${this.edit_disable} ${this.state.btnFocus === 1 ? " focus": ""}`} style={{cursor:"pointer"}}>
                <span>事後</span>
              </div>
              <div onClick={this.selectMode.bind(this,KARTEMODE.READ)} id="btnRead" className={`custom-modal-btn ${this.read_disable} ${this.state.btnFocus === 2 ? "focus": ""}`} style={{cursor:"pointer"}}>
                <span>閲覧のみ</span>
              </div>
            </div>
            <div onClick={this.closeSelectModeModal} id="btnCancel" className={"custom-modal-btn " + (this.state.btnFocus === 3 ? "focus cancel-btn": "cancel-btn")} style={{cursor:"pointer"}}>
              <span>キャンセル</span>
            </div>
          </Footer>
        </Modal.Footer>
        {this.context.autoLogoutModalShow === false && this.state.isConcurrentPopupOpen && (
          <ConcurrentuserModal
            id="modal-sample-1"
            closeConcurrentModal={this.closeConcurrentModal}
            concurrentInfo={concurrentInfo}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        <Tooltip
          {...this.state.tooltip}
          parent={this}
          tooltip_content={this.state.tooltip_content}
          tooltip_type={this.state.tooltip_type}
        />
      </Modal>
    );
  }
}
SelectModeModal.contextType = Context;
SelectModeModal.propTypes = {
  closeModal: PropTypes.func,
  goToUrl: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  modal_type: PropTypes.string,
  modal_data: PropTypes.object,
};

export default SelectModeModal;
