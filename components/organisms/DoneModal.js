import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { WEEKDAYS, getVisitPlaceNameForModal } from "~/helpers/constants";
import {
  surface,
  secondary200,
  midEmphasis,
  disable
} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import RehabilyOrderData from "~/components/templates/Patient/Modals/Rehabilitation/RehabilyOrderData";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {formatDate, formatDateSlash, formatJapanDateSlash, formatJapanSlashDateTime} from "~/helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import axios from "axios";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import RadiationData from "~/components/templates/Patient/components/RadiationData";
import MedicineGuidanceOrderData from "~/components/templates/Patient/Modals/Guidance/MedicineGuidanceOrderData";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const underLine = {
  textDecorationLine: "underline"
};

const textAlignRight = {
  textAlign: "right"
};

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;

  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .content{
    height: 57vh;
    overflow-y: hidden;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  ._color_implemented{
    .history-region{
      background: #e5ffdb;
    }
    .doctor-name{
      background: #e5ffdb;
    }
    .data-item{
      background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
    }
  }
  ._color_not_implemented{
    .history-region{
      background: #ffe5ef;
    }
    .doctor-name{
      background: #ffe5ef;
    }
    .data-item{
      background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
    }
  }
`;

const Col = styled.div`
  background-color: ${surface};
  width: 100%;
  max-height: calc(100vh - 182px);
  overflow-y: hidden;
  -ms-overflow-style: auto;
  textarea {
    width: 100%;
    resize: none;
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    background: rgb(160, 235, 255);
  }
  .data-header{
    background: rgb(105, 200, 225);
    color: white;
    padding: 4px 8px;
  }
  .bottom-line{
    border-bottom: 1px solid rgb(213, 213, 213);
  }
  .data-title{
    border: 1px solid rgb(213,213,213);
    cursor: pointer;
    .data-item{
      padding:10px;
    }
    .note{
      text-align: left;
    }
    .date{
      text-align: left;
    }
  }
  .department{
    font-size: 1rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold
  }
  .doctor-name{
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .order{
    display: block !important;
  }
  .data-list{
    overflow: hidden;
  }

  .time-area{
    input{
      width: 6rem;
    }
  }

  .soap-history-title{
    font-size: 0.8rem;
  }

  .low-title,
  .middle-title{
    background: #ddf8ff;
  }
  .facility-border{
    border-top: 1px solid rgb(213, 213, 213);
  }
  .tb-soap{
    width: 100%;
  
    th{
      background: #f6fcfd;
    }

    textarea{
      background: white;
      color: black;
      height: 25px;
    }
  }

  .rehabily-content{
    .phy-box{
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }
  }
  .rehabily-container{
    height:calc(57vh - 10rem);
    overflow-y:auto;
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x, y, parent,}) => {
  if (visible) {        
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>          
          <li onClick={() => parent.contextMenuAction("cancelDone")}><div>実施の取り消し</div></li>            
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const MedicineListWrapper = styled.div`
  font-size: 12px;
  height:calc(57vh - 10rem);
  overflow-y:auto;
  .no-bottom{
    label{
      margin-bottom: 0px !important;
    }
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 100%;
      float: left;
      padding: 5px;
      word-break: break-all;
    }
  }

  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .phy-box{
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 200px;
    }

    .text-left{
      .table-item{
        width: 150px;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .line-through {
    color: #ff0000;
  }

  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }

  .patient-name {
    margin-left: 1rem;
  }

  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 60px;
  }
  .number .rp{
    text-decoration-line: underline;
  }

  .unit{
    text-align: right;
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }

  .content-border{
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }

  .hidden {
    display: none;
  }

  p {
    margin-bottom: 0;
  }

  .doing {
    background: #ccc !important;

    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
  .prescription-body-part {
    width: 100%;
    padding-left: 4.5rem;
  }
  .item-details{
    text-align:left;
  }
  .item-details:last-child{
    border-bottom: 1px solid #ddd;
  }
`;

class DoneModal extends Component {
  constructor(props) {
    super(props);
    let done_time_show = false;
    if (this.props.modal_data.data.order_data.is_completed == 4 && this.props.modal_data.data.order_data.order_data[0].done_numbers !== undefined && this.props.modal_data.data.rp_index != undefined ) {
      let cnt_index = this.props.modal_data.data.cnt_index;
      let schedule_date = this.props.modal_data.data.schedule_date;      
      let execute_info = this.props.modal_data.data.order_data.order_data[0].done_numbers[schedule_date][cnt_index];
      if (execute_info !== undefined && execute_info.time != undefined && execute_info.time == "") {
        done_time_show=true;
      }
    }
    this.state = {
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data: this.props.modal_data,
      isOpenInspectionImageModal: false,
      openTimeSetModal: false,
      confirm_message: "",
      detailedInsuranceInfo: [],
      confirm_type: "",
      confirm_done_time: "",
      alert_messages: "",
      done_time_show,
      confirm_in_modal: "",
    }
    this.can_done = true;
  }
  
  async componentDidMount(){
    await this.getInsuranceInfo();  
    // set permission
    if (this.props.modal_type == "prescription" || this.props.modal_type == "injection") {      
      this.can_done = this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.DONE_OREDER);  
    } else if(this.props.modal_type == "guidance") {
      this.can_done = this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.DONE_OREDER);      
    } else if(this.props.modal_type == "guidance_medication") {
      this.can_done = this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.DONE_OREDER);      
    } else if(this.props.modal_type == "rehabily") {
      this.can_done = this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.DONE_OREDER);      
    } else if(this.props.modal_type == "radiation") {
      this.can_done = this.context.$canDoAction(this.context.FEATURES.RADIATION, this.context.AUTHS.DONE_OREDER);  
    }
  }
  
  getInsurance = type => {
    let insurance = "既定";
    // if (this.props.patientInfo.insurance_type_list) {
    if (this.state.detailedInsuranceInfo && this.state.detailedInsuranceInfo.length > 0) {
      this.state.detailedInsuranceInfo.map(item => {
        if (item.insurance_type_number === parseInt(type)) {
          insurance = item.insurance_type;
        }
      });
    }
    return insurance;
  };
  
  getInsuranceInfo = async () => {
    if (this.props.patientId > 0) {
      let data = await axios.get("/app/api/v2/karte/patient_datailed", {
        // パラメータ
        params: {
          systemPatientId: this.props.patientId
        }
      });
      this.setState({
        detailedInsuranceInfo: data.data.insurance_pattern
      });
    }
  }
  
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    
    return _insuranceName
  }
  
  doneData = async() => {
    if (this.state.done_time_show && this.state.confirm_done_time == "") {
      this.setState({alert_messages: "実施時間を設定を選択してください。"});
      return;
    }
    this.setState({
      confirm_message: "実施しますか？",
      confirm_type: "_doneOrder"
    });
  }
  
  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }
  
  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1) => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }
    
    if (nDoctorConsented == 4) {
      return "";
    }
    if (nDoctorConsented == 2) {
      strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)}(${this.getWeekDay(strDateTime.substr(0,10))}) ${strDateTime.substr(11, 8)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)}(${this.getWeekDay(strDateTime.substr(0,10))}) ${strDateTime.substr(11, 8)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
  }
  
  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };
  
  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    if (nDoctorConsented == 4) {
      return `（過去データ取り込み）${strDoctorName}`;
    }
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else{
      if (nDoctorConsented == 1) {
        return `[承認済み] 依頼医: ${strDoctorName}`;
      } else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }
  
  confirmOk = async() => {
    this.confirmCancel();
    let path = "/app/api/v2/order/orderComplete";
    // get current_insurance_type
    let patientInfo = karteApi.getPatient(this.props.patientId);
    let current_insurance_type = patientInfo != undefined && patientInfo != null && patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0;
    if (this.props.modal_type == "prescription") {
      path = "/app/api/v2/order/prescription/execute";
    } else if (this.props.modal_type == "injection") {
      path = "/app/api/v2/order/injection/execute";
    }
    let number = '';
    if(this.props.modal_type === 'guidance' || this.props.modal_type === 'home' || this.props.modal_type === 'spirit' || this.props.modal_type === 'rehabily' || this.props.modal_type === 'radiation'){
      number = this.props.modal_data.data.order_data.order_data.number;
    }
    let post_data = {
      type:this.props.modal_type,
      number,
      reception_or_done: "done",
      insurance_type: current_insurance_type
    };
    
    if (this.props.modal_type == "prescription") {
      post_data = {
        number: this.props.modal_data.number,
        system_patient_id: this.props.modal_data.patient_id,
        insurance_type: current_insurance_type
      }
    }
    if (this.props.modal_type == "injection") {
      post_data = {
        number: this.props.modal_data.target_number,
        system_patient_id: this.props.modal_data.system_patient_id,
        insurance_type: current_insurance_type
      }
      if (this.props.modal_data.data.order_data.is_completed == 4 ) {
        let cnt_index = this.props.modal_data.data.cnt_index;
        let rp_index = this.props.modal_data.data.rp_index;
        let schedule_date = this.props.modal_data.data.schedule_date;
        let execute_info = this.props.modal_data.data.order_data.order_data[0].done_numbers[schedule_date][cnt_index];
        post_data.cnt_index = cnt_index;
        post_data.rp_index = rp_index;
        post_data.schedule_date = schedule_date;
        if (execute_info !== undefined && execute_info.time != undefined && execute_info.time == "") {
          post_data.schedule_time = this.state.confirm_done_time;
        }
      }
    }
    
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          if(this.props.modal_type == "guidance" && this.props.fromPage == "no-soap"){
            window.sessionStorage.setItem("alert_messages", "実施しました。");
          } else if (this.props.modal_type != "prescription" && this.props.modal_type != "injection" && this.props.fromPage != "notDoneList") {
            window.sessionStorage.setItem("alert_messages", res.alert_message);
            this.props.history.replace(`/patients/${this.props.patientId}/soap`);
          }else if (this.props.modal_type == "injection" && this.props.fromPage != "injectionList" && this.props.fromPage != "notDoneList"){
            window.sessionStorage.setItem("alert_messages", "実施しました。");
            if (this.props.gotoUrl !== undefined && this.props.gotoUrl !== "" && this.props.gotoUrl === "injection") {
              this.props.history.replace(`/patients/${this.props.patientId}/injection`);
            } else {
              this.props.history.replace(`/patients/${this.props.patientId}/soap`);
            }
          } else if(this.props.fromPage == "notDoneList") {
            this.props.closeInjection();
            return;
          } else {
            window.sessionStorage.setItem("alert_messages", "実施しました。");
          }
        }
      })
      .catch(() => {
      
      })
    if (this.props.modal_type == "prescription" || (this.props.modal_type == "injection" && this.props.fromPage == "injectionList" != this.props.fromPage != "notDoneList")) {
      this.props.closeModalAndRefresh();
    } else {
      this.props.closeModal("change");
    }
  }
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_type: "",
      confirm_in_modal: "",
      alert_messages: ""
    });
  }
  
  openInspectionImageModal = async (number, type=null) => {
    let path = "/app/api/v2/order/inspection/getImage";
    
    if (type == "radiation") {
      path = "/app/api/v2/order/radiation/getImage";
    }
    
    const { data } = await axios.post(path, {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }
  
  closeModal = () => {
    this.setState({
      isOpenInspectionImageModal: false,
      openTimeSetModal: false,
    });
  }
  
  getKarteStatusName = (_modalData) => {
    let result = "外来";
    if(_modalData == undefined || _modalData == null) return result;
    if (_modalData.karte_status == undefined || _modalData.karte_status == null){
      if (_modalData.data != undefined &&
        _modalData.data.karte_status > 0) {
        result = _modalData.data.karte_status == 1 ? "外来" : _modalData.data.karte_status == 3 ? "入院" : "在宅";
      }
    } else {
      result = _modalData.karte_status == 1 ? "外来" : _modalData.karte_status == 3 ? "入院" : "在宅";
    }
    
    return result;
  }
  
  getDepartmentName = (_modalData) => {
    let result = "";
    if(_modalData == undefined || _modalData == null) return result;
    if (_modalData.medical_department_name == undefined || _modalData.medical_department_name == null){
      if (_modalData.data != undefined &&
        _modalData.data.order_data != undefined &&
        _modalData.data.order_data.department != undefined &&
        _modalData.data.order_data.department != "") {
        result = _modalData.data.order_data.department;
      }
    } else {
      result = _modalData.medical_department_name;
    }
    
    return result;
  }
  
  getOrderTitleClassName = (param_obj) => {
    if (param_obj.target_table == "order") {
      if (param_obj.is_doctor_consented != 4 && (param_obj.done_order == 0 || param_obj.done_order == 3)) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";
      }
      if (param_obj.done_order == 2) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";
      }
    } else if(param_obj.target_table == "inspection_order") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if ( param_obj.state == 2) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";
      }
      if (param_obj.state == 1) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";
      }
    }
    return "";
  }
  
  getDoneStatus (modal_data, modal_type) {
    if (modal_type == 'injection' || modal_type == 'prescription'){
      if (modal_data.is_doctor_consented != 4 && (modal_data.data.done_order == 0 || modal_data.data.done_order == 3)) return '未実施';
      if (modal_data.is_doctor_consented != 4 && modal_data.data.done_order == 2) return '受付済み';
    }
    if (modal_data.is_doctor_consented != 4 && modal_data.data.done_order == 0) return modal_type == 'guidance'?'未実施':'未受付';
    if (modal_data.is_doctor_consented != 4 && modal_data.data.done_order == 2) return '受付済み';
    return '';
  }
  
  getDoneTime = (value) => {
    this.setState({confirm_done_time: value});
  }

  contextMenuAction = (act) => {
    if (act == "cancelDone") {
      this.setState({        
        confirm_title: "実施の取り消し確認",
        confirm_message: "実施を取り消しますか？",
        confirm_action:act,
        confirm_in_modal: "menu_in_modal"        
      });
    }
  };

  confirmCancelDoneOk = () => {
    // let path = "/app/api/v2/order/examination/change_state";
    // if (this.state.select_back_state === undefined) return ;
    // let post_data = {
    //   type:"examination",
    //   number:this.props.from_page == "soap" ? this.props.modal_data.data.order_data.order_data.number : this.props.modal_data.order_data.order_data.number,
    //   done_status: this.props.done_status,
    //   order_data:this.state.order_data,
    //   to_done_order:this.state.select_back_state.to_done_order
    // };
    // if (!(post_data.number > 0)) {
    //   post_data.number = this.props.modal_data.number;
    // }
    // await apiClient._post(
    //   path,
    //   {params: post_data})
    //   .then((res) => {
    //     if(res){
    //       if (this.props.from_page == "soap") {
    //         window.sessionStorage.setItem("alert_messages", this.state.select_back_state.alert_message);
    //         this.props.doneInspection(this.props.modal_data.number, "exam-order", {done_order: this.state.select_back_state.to_done_order});
    //       } else if (this.props.from_page == "not_done_list") {
    //         window.sessionStorage.setItem("alert_messages", this.state.select_back_state.alert_message);
    //         this.props.doneInspection();
    //       } else {
    //         let alert_message = this.state.select_back_state.alert_message;
    //         let alert_title = this.state.select_back_state.action == "complete_done" ? "登録完了" : "状態変更完了";
    //         this.setState({
    //           alert_message: alert_message,
    //           alert_title,
    //           alert_action: "close"
    //         });
    //       }
    //     }
    //   })
    //   .catch(() => {
    //   });
  }

  handleClick = e => {    
    if (this.props.modal_type != "injection") return;
    if (!(this.state.modal_data.data.done_order !== undefined && this.state.modal_data.data.done_order != null && this.state.modal_data.data.done_order === 1 && this.state.modal_data.data.order_data.is_completed == 4)) return;
    if (!this.context.$canDoAction(this.context.FEATURES.PERIOD_INJECTION, this.context.AUTHS.INJECTION_DONE_TO_NOT_DONE)) return;
    if (e.type === "contextmenu") {
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
        .getElementById("done-order-modal")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("done-order-modal")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("done-order-modal").offsetLeft,
          y: e.clientY - document.getElementById("done-order-modal").offsetTop - 100,
        }
      });
    }
  }

  getMinTime = (i, done_times) => {
    let result = new Date(formatDateSlash(new Date())+" 00:00:00");
    if (i == 0) return result;
    if (i - 1 == 0 && (done_times[i-1] == "" || done_times[i-1] == null)) return new Date(formatDateSlash(new Date())+" 00:05:00");

    let min_time = "";
    for (var loop = i-1; loop >= 0; loop--) {
      if (done_times[loop] && done_times[loop] != "" && done_times[loop] != null) {
        min_time = done_times[loop];
      }
      if (min_time != "") break;
    }

    result = min_time == "" ? result : new Date(formatDateSlash(new Date()) + " " + min_time + ":00"); 
    result.setMinutes(result.getMinutes() + 5);
    let convert_date = new Date(formatDateSlash(new Date()) + " " + result.getHours()+":"+result.getMinutes() + ":00"); 

    return convert_date;    
  }

  getMaxTime = (i, done_count, done_times) => {
    let result = new Date(formatDateSlash(new Date())+" 23:55:00");
    if (i == done_count - 1) return result;
    if (i + 1 == done_count - 1 && (done_times[i+1] == "" || done_times[i-1] == null)) return new Date(formatDateSlash(new Date())+" 23:50:00");

    let max_time = "";
    for (var loop = i+1; loop <= done_count - 1; loop++) {
      if (done_times[loop] && done_times[loop] != "" && done_times[loop] != null) {
        max_time = done_times[loop];
      }
      if (max_time != "") break;
    }

    result = max_time == "" ? result : new Date(formatDateSlash(new Date()) + " " + max_time + ":00");    
    result.setMinutes(result.getMinutes() - 5);
    let convert_date = new Date(formatDateSlash(new Date()) + " " + result.getHours()+":"+result.getMinutes() + ":00"); 

    return convert_date;
  }
  
  render() {
    let { modal_data, modal_title, modal_type} = this.props;
    var done_status = this.getDoneStatus(modal_data, modal_type);
    let karte_status_name = "外来・";
    if (modal_data.data.order_data != undefined && modal_data.data.order_data.order_data.karte_status != undefined) {
      karte_status_name = modal_data.data.order_data.order_data.karte_status == 1 ? "外来・" : modal_data.data.order_data.order_data.karte_status == 2 ? "訪問診療・" : modal_data.data.order_data.order_data.karte_status == 3 ? "入院・" : "";
    }
    var karte_status = 1;
    if (modal_data.karte_status != undefined) karte_status = modal_data.karte_status;
    if (modal_data.data != undefined && modal_data.data.karte_status != undefined) karte_status = modal_data.data.karte_status;
    
    // YJ634 定期注射の実施詳細モーダルで、どの日のどの時刻の物かがわからない. ②定期注射の実施詳細モーダルでは、1回のオーダー用の実施予定日の代わりに
    let schedule_date_time = "";
    // if(modal_data.data.order_data.schedule_date !== null && modal_data.data.order_data.schedule_date !== undefined && modal_data.data.order_data.schedule_date != "" && modal_data.data.order_data.is_completed == 4 && this.props.modal_data.data.rp_index != undefined) {
    //   schedule_date_time = formatJapanDateSlash(modal_data.data.order_data.schedule_date);
    //   let rp_index = modal_data.data.cnt_index;
    //   let rp_data = modal_data.data.order_data.order_data[0];
    //   let rp_done_time = "";
    //   if (rp_data.administrate_period != undefined && rp_data.administrate_period != null && rp_data.administrate_period.done_times != undefined && rp_data.administrate_period.done_times.length > 0) {
    //     rp_done_time = rp_data.administrate_period.done_times[rp_index];
    //   }
    //   if (rp_done_time == "") {
    //     rp_done_time = "未定";
    //   }
    //   schedule_date_time = schedule_date_time + " " + rp_done_time; 
    // }
    let completed_at_time = "";
    let min_time = new Date(formatDateSlash(new Date())+" 00:00:00");
    let max_time = new Date(formatDateSlash(new Date())+" 23:55:00");
    if (modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data.is_completed == 4 && this.props.modal_data.data.rp_index != undefined) {      
      let rp_index = modal_data.data.cnt_index;
      let rp_data = modal_data.data.order_data.order_data[0];
      if (rp_data.done_numbers != undefined && rp_data.done_numbers != null && (Object.keys(rp_data.done_numbers).length > 0 || rp_data.done_numbers.length > 0)) {
        // completed_at_time = rp_data.done_numbers[modal_data.data.order_data.schedule_date][rp_index].completed_at.substr(0, 16);        
        completed_at_time = rp_data.done_numbers[modal_data.data.order_data.schedule_date][rp_index].completed_at;        
        if (completed_at_time != "") {
          completed_at_time = formatJapanDateSlash(completed_at_time) + " " + completed_at_time.substr(11, 2) + ":" + completed_at_time.substr(14, 2);
        }

        // count schedule_date_time
        if(modal_data.data.order_data.schedule_date !== null && modal_data.data.order_data.schedule_date !== undefined && modal_data.data.order_data.schedule_date != "" && modal_data.data.order_data.is_completed == 4 && this.props.modal_data.data.rp_index != undefined) {
          schedule_date_time = formatJapanDateSlash(modal_data.data.order_data.schedule_date);
          schedule_date_time = schedule_date_time + " " + rp_data.done_numbers[modal_data.data.order_data.schedule_date][rp_index].time;        
        }
      }

      // count 実施時間
      if (rp_data.administrate_period != undefined && rp_data.administrate_period != null && (Object.keys(rp_data.administrate_period).length > 0 || rp_data.administrate_period.length > 0)) {
        min_time = this.getMinTime(rp_index, rp_data.administrate_period.done_times);
        max_time = this.getMaxTime(rp_index, rp_data.administrate_period.done_count, rp_data.administrate_period.done_times);
      }
    } 
    min_time = new Date(min_time.getFullYear(), min_time.getMonth() + 1, min_time.getDate(), min_time.getHours(), min_time.getMinutes());
    max_time = new Date(max_time.getFullYear(), max_time.getMonth() + 1, max_time.getDate(), max_time.getHours(), max_time.getMinutes());    
    return  (
      <>
      <Modal show={true} id="done-order-modal"  className="custom-modal-sm first-view-modal guidance-done-modal">
        <Modal.Header>
          <Modal.Title>{modal_title}実施</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">
                  {(modal_type == "guidance") && (
                    <div className="data-list">
                      <div className={'patient-info'}>
                        {this.props.patientInfo.receId} : {this.props.patientInfo.name}
                      </div>
                      <div className={`data-title
                    ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented,state:modal_data.data.state, done_order:modal_data.data.done_order, is_enabled:modal_data.data.is_enabled,karte_status:karte_status})}`}>
                        <div className="data-item">
                          <div className="flex justify-content">
                            <div className="note">
                              【{karte_status_name}{modal_title}】{done_status}
                            </div>
                            <div className="department text-right">{modal_data.medical_department_name}</div>
                          </div>
                          <div className="date">
                            {modal_data.treatment_datetime !== "" && modal_data.treatment_datetime !== undefined ? (
                              <>
                                {modal_data.treatment_datetime.substr(0, 4)}/
                                {modal_data.treatment_datetime.substr(5, 2)}/
                                {modal_data.treatment_datetime.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                {' '}{modal_data.treatment_datetime.substr(11, 8)}
                              </>
                            ) : (
                              <>
                                {modal_data.treatment_date.substr(0, 4)}/
                                {modal_data.treatment_date.substr(5, 2)}/
                                {modal_data.treatment_date.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_date.substr(0,10))})
                              </>
                            )}
                          </div>
                        </div>
                        {modal_data.data.history !== "" && modal_data.data.history != undefined && modal_data.data.history !== null ? (
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(modal_data.data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        ):(
                          <>
                            {modal_data.is_doctor_consented !=2 && (
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                              </div>
                            )}
                          </>
                        )}
                        <div className="doctor-name text-right low-title">{this.getDoctorName(modal_data.is_doctor_consented, modal_data.data.order_data.order_data.doctor_name)}</div>
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data != undefined && modal_data.data.order_data.order_data.visit_place_id != undefined && modal_data.data.order_data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      <MedicineListWrapper>
                        <div className={`history-item soap-data-item`}>
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">日付</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {modal_data.data.order_data.order_data.treat_date === "" ? "" : formatJapanDateSlash(modal_data.data.order_data.order_data.treat_date)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment cache-insurance-name">{this.getInsuranceName(modal_data.data.order_data.order_data.insurance_name)}</div>
                                </div>
                              </div>
                              {modal_data.data.order_data.order_data.karte_description_name !== undefined && modal_data.data.order_data.order_data.karte_description_name != null && modal_data.data.order_data.order_data.karte_description_name !="" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">カルテ記述名称</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.karte_description_name}</div>
                                  </div>
                                </div>
                              )}
                              {modal_data.data.order_data.order_data.additions !== undefined && modal_data.data.order_data.order_data.additions != null && Object.keys(modal_data.data.order_data.order_data.additions).length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">追加指示等</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {Object.keys(modal_data.data.order_data.order_data.additions).map(addition=>{
                                        return(
                                          <>
                                            <span>{modal_data.data.order_data.order_data.additions[addition].name}</span><br />
                                          </>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {modal_data.data.order_data.order_data.karte_text_data !== undefined && modal_data.data.order_data.order_data.karte_text_data != null && modal_data.data.order_data.order_data.karte_text_data.length > 0 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">カルテ記述内容</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {modal_data.data.order_data.order_data.karte_text_data.map(karte_text=>{
                                        return(
                                          <>
                                            <span>{karte_text.karte_text}</span><br />
                                          </>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {(modal_data.data.order_data.order_data.comment !== undefined && modal_data.data.order_data.order_data.comment != null && modal_data.data.order_data.order_data.comment != "") && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.comment}</div>
                                  </div>
                                </div>
                              )}
                              {modal_data.data.order_data.order_data.details !== undefined && modal_data.data.order_data.order_data.details != null && modal_data.data.order_data.order_data.details.length>0 &&
                              modal_data.data.order_data.order_data.details.findIndex(x=>x.is_enabled==1||x.is_enabled==undefined) > -1 && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"> </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {modal_data.data.order_data.order_data.details.map(detail=>{
                                        if(detail.is_enabled === undefined || (detail.is_enabled !== undefined && detail.is_enabled == 1)){
                                          return(
                                            <>
                                              <div><label>・{detail.item_name}
                                                {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                  <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br /></>
                                                )}
                                                {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                  <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br /></>
                                                )}
                                              </div>
                                            </>
                                          )
                                        }
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  )}
                  {(modal_type == "guidance_medication") && (
                    <div className="data-list">
                      <div className={'patient-info'}>
                        {this.props.patientInfo.receId} : {this.props.patientInfo.name}
                      </div>
                      <div className={`data-title
                    ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented,state:modal_data.data.state, done_order:modal_data.data.done_order, is_enabled:modal_data.data.is_enabled,karte_status:karte_status})}`}>
                        <div className="data-item">
                          <div className="flex justify-content">
                            <div className="note">
                              【{karte_status_name}{modal_title}】{done_status}
                            </div>
                            <div className="department text-right">{modal_data.medical_department_name}</div>
                          </div>
                          <div className="date">
                            {modal_data.treatment_datetime !== "" && modal_data.treatment_datetime !== undefined ? (
                              <>
                                {modal_data.treatment_datetime.substr(0, 4)}/
                                {modal_data.treatment_datetime.substr(5, 2)}/
                                {modal_data.treatment_datetime.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                {' '}{modal_data.treatment_datetime.substr(11, 8)}
                              </>
                            ) : (
                              <>
                                {modal_data.treatment_date.substr(0, 4)}/
                                {modal_data.treatment_date.substr(5, 2)}/
                                {modal_data.treatment_date.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_date.substr(0,10))})
                              </>
                            )}
                          </div>
                        </div>
                        {modal_data.data.history !== "" && modal_data.data.history != undefined && modal_data.data.history !== null ? (
                          <div className="history-region text-right">
                            {this.getHistoryInfo(modal_data.data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        ):(
                          <>
                            {modal_data.is_doctor_consented !=2 && (
                              <div className="history-region text-right">
                                {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                              </div>
                            )}
                          </>
                        )}
                        <div className="doctor-name text-right">{this.getDoctorName(modal_data.is_doctor_consented, modal_data.data.order_data.order_data.doctor_name)}</div>
                        <div className="doctor-name text-right low-title">{this.getDoctorName(modal_data.is_doctor_consented, modal_data.data.order_data.order_data.doctor_name)}</div>
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data != undefined && modal_data.data.order_data.order_data.visit_place_id != undefined && modal_data.data.order_data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      <MedicineListWrapper>
                        <div className={`history-item soap-data-item open order ${(modal_data.isDeleted || modal_data.is_enabled === 2) ? ' deleted ' : ''}`}>
                          <div>
                            <MedicineGuidanceOrderData cache_data={modal_data.data.order_data.order_data} />
                          </div>                          
                        </div>
                      </MedicineListWrapper>
                    </div>
                  )}
                  {(modal_type == "rehabily") && (
                    <div className="data-list rehabily-content">
                      <div className={'patient-info'}>
                        {this.props.patientInfo.receId} : {this.props.patientInfo.name}
                      </div>
                      <div className={`data-title
                    ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented,state:modal_data.data.state, done_order:modal_data.data.done_order, is_enabled:modal_data.data.is_enabled,karte_status:karte_status})}`}>
                        <div className={`data-item ${modal_data.openTag == 1 ? modal_data.class_name : ''}`}>
                          <div className="flex justify-content">
                            <div className="note">
                              【{karte_status_name}{modal_title}】{done_status}
                            </div>
                            <div className="department text-right">{modal_data.medical_department_name}</div>
                          </div>
                          <div className="date">
                            {modal_data.treatment_datetime !== "" && modal_data.treatment_datetime !== undefined ? (
                              <>
                                {modal_data.treatment_datetime.substr(0, 4)}/
                                {modal_data.treatment_datetime.substr(5, 2)}/
                                {modal_data.treatment_datetime.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                {' '}{modal_data.treatment_datetime.substr(11, 8)}
                              </>
                            ) : (
                              <>
                                {modal_data.treatment_date.substr(0, 4)}/
                                {modal_data.treatment_date.substr(5, 2)}/
                                {modal_data.treatment_date.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_date.substr(0,10))})
                              </>
                            )}
                          </div>
                        </div>
                        {modal_data.data.history !== "" && modal_data.data.history != undefined &&
                        modal_data.data.history !== null ? (
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(modal_data.data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        ):(
                          <>
                            {modal_data.is_doctor_consented !=2 && (
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                              </div>
                            )}
                          </>
                        )}
                        <div className="doctor-name text-right low-title">
                          {this.getDoctorName(modal_data.is_doctor_consented, modal_data.doctor_name)}
                        </div>
                        <div className="doctor-name text-right low-title">{this.getDoctorName(modal_data.is_doctor_consented, modal_data.data.order_data.order_data.doctor_name)}</div>
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data != undefined && modal_data.data.order_data.order_data.visit_place_id != undefined && modal_data.data.order_data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      <div className='rehabily-container'>
                        <RehabilyOrderData rehabily_data={modal_data.data.order_data.order_data} />
                      </div>
                    </div>
                  )}
                  {(modal_type == "radiation") && (
                    <div className="data-list">
                      <div className={'patient-info'}>
                        {this.props.patientInfo.receId} : {this.props.patientInfo.name}
                      </div>
                      <div className={`data-title
                    ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented,state:modal_data.data.state, done_order:modal_data.data.done_order, is_enabled:modal_data.data.is_enabled,karte_status:karte_status})}`}>
                        <div className="data-item">
                          <div className="flex justify-content">
                            <div className="note">【{karte_status_name}放射線&nbsp;&nbsp;{modal_data.sub_category}】{done_status}
                              {/* {modal_data.is_enabled === 2 && "（削除済み）"} */}
                            </div>
                            <div className="department text-right">{modal_data.medical_department_name}</div>
                          </div>
                          <div className="date">
                            {modal_data.treatment_datetime !== "" && modal_data.treatment_datetime !== undefined ? (
                              <>
                                {modal_data.treatment_datetime.substr(0, 4)}/
                                {modal_data.treatment_datetime.substr(5, 2)}/
                                {modal_data.treatment_datetime.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                {' '}{modal_data.treatment_datetime.substr(11, 8)}
                              </>
                            ) : (
                              <>
                                {modal_data.treatment_date.substr(0, 4)}/
                                {modal_data.treatment_date.substr(5, 2)}/
                                {modal_data.treatment_date.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_date.substr(0,10))})
                              </>
                            )}
                          </div>
                        </div>
                        {modal_data.data.history !== "" && modal_data.data.history != undefined &&
                        modal_data.data.history !== null ? (
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(modal_data.data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        ):(
                          <>
                            {modal_data.is_doctor_consented !=2 && (
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                              </div>
                            )}
                          </>
                        )}
                        <div className="doctor-name text-right low-title">
                          {this.getDoctorName(modal_data.is_doctor_consented, modal_data.doctor_name)}
                        </div>
                        <div className="doctor-name text-right low-title">{this.getDoctorName(modal_data.is_doctor_consented, modal_data.data.order_data.order_data.doctor_name)}</div>
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data != undefined && modal_data.data.order_data.order_data.visit_place_id != undefined && modal_data.data.order_data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      
                      <MedicineListWrapper>
                        <div className={`history-item soap-data-item`}>
                          <RadiationData
                            data = {modal_data.data.order_data.order_data}
                            patientId = {this.props.patientId}
                          />
                        </div>
                      </MedicineListWrapper>
                    </div>
                  )}
                  {(modal_type == "prescription") && (
                    <div className="data-list">
                      <div className="data-header">
                        {modal_data.updated_at !== "" && modal_data.updated_at !== undefined ? (
                          <>
                            {modal_data.updated_at.substr(0, 4)}/
                            {modal_data.updated_at.substr(5, 2)}/
                            {modal_data.updated_at.substr(8, 2)}
                            ({this.getWeekDay(modal_data.updated_at.substr(0,10))})
                          </>
                        ) : (
                          <>
                            {modal_data.updated_at.substr(0, 4)}/
                            {modal_data.updated_at.substr(5, 2)}/
                            {modal_data.updated_at.substr(8, 2)}
                            ({this.getWeekDay(modal_data.updated_at.substr(0,10))})
                          </>
                        )}
                      </div>
                      <div className={`data-title
                    ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented,state:modal_data.data.state, done_order:modal_data.data.done_order, is_enabled:modal_data.data.is_enabled,karte_status:karte_status})}`}>
                        <div className="data-item">
                          <div className="flex">
                            <div className="note">【{modal_data.order_data.is_internal_prescription == 0?"院外" : "院内"}処方】{done_status}
                            </div>
                            <div className="department text-right">{modal_data.medical_department_name}</div>
                          </div>
                          <div className="date">
                                {modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime !== null && modal_data.treatment_datetime !== ""  ? (
                                  <>
                                    {formatJapanSlashDateTime(modal_data.treatment_datetime)}
                                  </>
                                ) : (
                                  <>
                                    {modal_data.data != undefined && modal_data.data.created_at != undefined && modal_data.data.created_at != "" ? (
                                      <>
                                        {formatJapanSlashDateTime(modal_data.data.created_at)}
                                      </>
                                    ):(
                                      <>
                                        {modal_data.treatment_date !== "" && modal_data.treatment_date !== undefined ? (
                                          <>
                                            {modal_data.treatment_date.substr(0, 4)}/
                                            {modal_data.treatment_date.substr(5, 2)}/
                                            {modal_data.treatment_date.substr(8, 2)}
                                            ({this.getWeekDay(modal_data.treatment_date.substr(0,10))})
                                          </>
                                        ):(
                                          <>
                                            {formatJapanSlashDateTime(modal_data.created_at)}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )} 
                          </div>
                        </div>
                        {modal_data.history !== "" && modal_data.history != undefined &&
                        modal_data.history !== null ? (
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.proxy_input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        ):(
                          <>
                            {modal_data.is_doctor_consented !=2 && (
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, modal_data.proxy_input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                              </div>
                            )}
                          </>
                        )}
                        <div className="doctor-name text-right low-title">
                          {this.getDoctorName(modal_data.is_doctor_consented, modal_data.order_data.doctor_name)}
                        </div>
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data != undefined && modal_data.data.order_data.visit_place_id != undefined && modal_data.data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      <MedicineListWrapper>
                        <div className="history-item soap-data-item content-border">
                          {modal_data.order_data.order_data.length > 0 && modal_data.order_data.order_data.map((item, key)=>{
                            return (
                              <div className="history-item" key={key}>
                                <div className="box w70p" draggable="true">
                                  {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                    return (
                                      <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                        <div className="flex between">
                                          <div className="flex full-width table-item">
                                            <div className="number" style={underLine}>
                                              {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                            </div>
                                            
                                            <div className="ml-3 full-width mr-2" style={{textAlign:'left'}}>
                                              {medicine_item.item_name}
                                              {medicine_item.amount > 0 &&
                                              medicine_item.uneven_values !== undefined &&
                                              medicine_item.uneven_values.length > 0 && (
                                                <p style={textAlignRight}>
                                                  {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                </p>
                                              )}
                                              {medicine_item.free_comment
                                                ? medicine_item.free_comment.map(comment => {
                                                  return (
                                                    <p key={comment.id} style={textAlignRight}>
                                                      {comment}
                                                    </p>
                                                  );
                                                })
                                                : ""}
                                            </div>
                                          </div>
                                          <div className="w80 table-item" style={textAlignRight}>
                                            {" "}
                                            {medicine_item.amount}
                                            {medicine_item.unit}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                  <div className="flex between drug-item table-row">
                                    <div className="text-right">
                                      <div className="table-item">
                                        {!item.usage_name ? "" : `用法: ${item.usage_name}`}
                                      </div>
                                      {item.usage_remarks_comment ? (
                                        <div className="table-item remarks-comment">
                                          {item.usage_remarks_comment.map((comment, ci) => {
                                            return <p key={ci}>{comment}</p>;
                                          })}
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="w80 table-item">
                                      {item.days !== 0 && item.days !== undefined
                                        ? item.days +
                                        (item.days_suffix !== undefined && item.days_suffix !== ""
                                          ? item.days_suffix
                                          : "日分")
                                        : ""}
                                    </div>
                                  </div>
                                  {item.start_date !== undefined && item.start_date !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.body_part !== undefined && item.body_part !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`部位/補足: ${item.body_part}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_start_date !== undefined &&
                                  item.discontinuation_start_date !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止期間の最初日: ${formatDate(
                                          item.discontinuation_start_date
                                        )}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_end_date !== undefined &&
                                  item.discontinuation_end_date !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止期間の最後日: ${formatDate(
                                          item.discontinuation_end_date
                                        )}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_comment !== undefined &&
                                  item.discontinuation_comment !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止コメント: ${item.discontinuation_comment}`}
                                      </div>
                                    </div>
                                  )}
                                  {(item.temporary_medication !== undefined && item.temporary_medication === 1) ||
                                  (item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1) ||
                                  (item.med[0].milling !== undefined && item.med[0].milling === 1) ||
                                  (item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1) ||
                                  (item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1) ||
                                  (item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1) && (
                                    
                                    <div className="option flex table-item table-row dcVhIR">
                                      {item.temporary_medication !== undefined && item.temporary_medication === 1 && (
                                        <p className="gCXasu">【臨時処方】&nbsp;</p>
                                      )}
                                      {item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1 && (
                                        <p className="gCXasu">【一包化】&nbsp;</p>
                                      )}
                                      {item.med[0].milling !== undefined && item.med[0].milling === 1 && (
                                        <p className="gCXasu">【粉砕】&nbsp;</p>
                                      )}
                                      {item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1 && (
                                        <p className="gCXasu">【後発不可】&nbsp;</p>
                                      )}
                                      {item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1 && (
                                        <p className="gCXasu">【別包】&nbsp;</p>
                                      )}
                                      {item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1 && (
                                        <p className="gCXasu">【一般名処方】&nbsp;</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          <div style={{position:"relative"}}>
                            {modal_data.order_data.item_details != null && modal_data.order_data.item_details != undefined && modal_data.order_data.item_details.length > 0 && modal_data.order_data.item_details.map(ele=>{
                              return(
                                <>
                                  <div className="function-region-name">
                                    <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                                    {(ele.value1 !== undefined && ele.value1 != null && ele.value1 !== "") && (
                                      <>
                                        <label>{ele.value1}</label><br />
                                      </>
                                    )}
                                    {(ele.value2 !== undefined && ele.value2 != null && ele.value2 !== "") && (
                                      <>
                                        <label>{ele.value2}</label><br />
                                      </>
                                    )}
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  )}
                  {(modal_type == "injection") && (
                    <div className="data-list" onContextMenu={(e)=>this.handleClick(e)}>
  
                      <div className="w-100 d-flex">
                          <div className="w-50 mb-2 time-area d-flex">
                          {this.state.done_time_show == true && (
                            <>
                            <div className="mr-2" style={{lineHeight: "2rem", width:"5rem", textAlign:"left"}}>実施時間</div>
                            <DatePicker
                              selected={this.state.confirm_done_time}
                              onChange={this.getDoneTime.bind(this)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={5}
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              timeCaption="時間"
                              minTime={min_time}
                              maxTime={max_time}
                            />                            
                            </>
                          )}
                          </div>
                        <div className={'w-75 patient-info'}>
                          {this.props.patientInfo.receId} : {this.props.patientInfo.name}
                        </div>
                      </div>
                      
                      
                      <div className={`data-title
                    ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.data.done_order, is_enabled:modal_data.data.is_enabled,karte_status:karte_status})}`}>
                        <div className="data-item">
                          <div className="flex" style={{justifyContent: "space-between"}}>
                            <div className="note">【{this.getKarteStatusName(modal_data)}・注射】{done_status}
                            </div>
                            <div className="department text-right">{this.getDepartmentName(modal_data)}</div>
                          </div>
                          <div className="date">
                                {modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime !== null && modal_data.treatment_datetime !== ""  ? (
                                  <>
                                    {formatJapanSlashDateTime(modal_data.treatment_datetime)}
                                  </>
                                ) : (
                                  <>
                                    {modal_data.data != undefined && modal_data.data.created_at != undefined && modal_data.data.created_at != "" ? (
                                      <>
                                        {formatJapanSlashDateTime(modal_data.data.created_at)}
                                      </>
                                    ):(
                                      <>
                                        {modal_data.treatment_date !== "" && modal_data.treatment_date !== undefined ? (
                                          <>
                                            {modal_data.treatment_date.substr(0, 4)}/
                                            {modal_data.treatment_date.substr(5, 2)}/
                                            {modal_data.treatment_date.substr(8, 2)}
                                            ({this.getWeekDay(modal_data.treatment_date.substr(0,10))})
                                          </>
                                        ):(
                                          <>
                                            {formatJapanSlashDateTime(modal_data.created_at)}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )} 
                          </div>
                        </div>
                        {modal_data.data.history != undefined && modal_data.data.history !== null && modal_data.data.history != "" ? (
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(modal_data.data.history.split(",").length-1, modal_data.input_staff_name != undefined && modal_data.input_staff_name != "" ? modal_data.input_staff_name : modal_data.proxy_input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        ):(
                          <>
                            {modal_data.is_doctor_consented !=2 && (
                              <div className="history-region text-right middle-title">
                                {this.getHistoryInfo(0, modal_data.input_staff_name != undefined && modal_data.input_staff_name != "" ? modal_data.input_staff_name : modal_data.proxy_input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                              </div>
                            )}
                          </>
                        )}
                        <div className="doctor-name text-right low-title">
                          {this.getDoctorName(modal_data.is_doctor_consented, modal_data.doctor_name)}
                        </div>
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data != undefined && modal_data.data.order_data.visit_place_id != undefined && modal_data.data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.visit_place_id)}
                          </div>
                        )}                                               
                      </div>
                      <MedicineListWrapper>
                        <div className="history-item soap-data-item content-border">
                          {modal_data.data.order_data.order_data.length > 0 && modal_data.data.order_data.order_data.map((item, key)=>{
                            return (
                              <div className="history-item" key={key}>
                                <div className="box w70p" draggable="true">
                                  <div className="flex between drug-item table-row">
                                    <div className="number" style={underLine}>
                                      {" Rp" + parseInt(key + 1)}
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item" style={{marginRight:'8px'}}>
                                        {!item.usage_name ? "" : `手技: ${item.usage_name}`}
                                      </div>
                                    </div>
                                    <div className="w80 table-item">
                                      {item.days !== 0 && item.days !== undefined
                                        ? item.days +
                                        (item.days_suffix !== undefined && item.days_suffix !== ""
                                          ? item.days_suffix
                                          : "日分")
                                        : ""}
                                    </div>
                                  </div>
                                  {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                    return (
                                      <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                        <div className="flex between">
                                          <div className="flex full-width table-item">
                                            <div className="number">
                                            </div>
                                            
                                            <div className="ml-3 full-width mr-2" style={{textAlign:'left'}}>
                                              {medicine_item.item_name}
                                              {medicine_item.amount > 0 &&
                                              medicine_item.uneven_values !== undefined &&
                                              medicine_item.uneven_values.length > 0 && (
                                                <p style={textAlignRight}>
                                                  {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                </p>
                                              )}
                                              {medicine_item.free_comment
                                                ? medicine_item.free_comment.map(comment => {
                                                  return (
                                                    <p key={comment.id} style={textAlignRight}>
                                                      {comment}
                                                    </p>
                                                  );
                                                })
                                                : ""}
                                            </div>
                                          </div>
                                          <div className="w80 table-item" style={textAlignRight}>
                                            {" "}
                                            {medicine_item.amount}
                                            {medicine_item.unit}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                  {item.is_precision !== undefined && item.is_precision == 1 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        【精密持続点滴】
                                      </div>
                                    </div>
                                  )}
                                  {item.insurance_type !== undefined && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`保険: ${this.getInsurance(item.insurance_type)}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.body_part !== undefined && item.body_part !== "" && (
                                    <div className="flex between option table-row prescription-body-part">
                                      <div className="text-right table-item">
                                        {`部位/補足: ${item.body_part}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_start_date !== undefined &&
                                  item.discontinuation_start_date !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止期間の最初日: ${formatDate(
                                          item.discontinuation_start_date
                                        )}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_end_date !== undefined &&
                                  item.discontinuation_end_date !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止期間の最後日: ${formatDate(
                                          item.discontinuation_end_date
                                        )}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_comment !== undefined &&
                                  item.discontinuation_comment !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止コメント: ${item.discontinuation_comment}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-right">
                                        <div className="table-item">
                                          {!item.injectUsageName ? "" : `用法: ${item.injectUsageName}`}
                                        </div>
                                        {item.usage_remarks_comment ? (
                                          <div className="table-item remarks-comment">
                                            {item.usage_remarks_comment.map((comment, ci) => {
                                              return <p key={ci}>{comment}</p>;
                                            })}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                      <div className="w80 table-item">
                                      </div>
                                    </div>
                                  )}
                                  {item.med.length > 0 && (
                                    <>
                                      {(item.temporary_medication !== undefined && item.temporary_medication === 1) ||
                                      (item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1) ||
                                      (item.med[0].milling !== undefined && item.med[0].milling === 1) ||
                                      (item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1) ||
                                      (item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1) ||
                                      (item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1) && (
                                        
                                        <div className="option flex table-item table-row dcVhIR">
                                          {item.temporary_medication !== undefined && item.temporary_medication === 1 && (
                                            <p className="gCXasu">【臨時処方】&nbsp;</p>
                                          )}
                                          {item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1 && (
                                            <p className="gCXasu">【一包化】&nbsp;</p>
                                          )}
                                          {item.med[0].milling !== undefined && item.med[0].milling === 1 && (
                                            <p className="gCXasu">【粉砕】&nbsp;</p>
                                          )}
                                          {item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1 && (
                                            <p className="gCXasu">【後発不可】&nbsp;</p>
                                          )}
                                          {item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1 && (
                                            <p className="gCXasu">【別包】&nbsp;</p>
                                          )}
                                          {item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1 && (
                                            <p className="gCXasu">【一般名処方】&nbsp;</p>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          <div>                            
                            {/*--------- not 定期注射 --------- */}
                            {modal_data.data.order_data.schedule_date !== null && modal_data.data.order_data.schedule_date !== undefined && modal_data.data.order_data.schedule_date != "" && modal_data.data.order_data.is_completed != 4 && (
                              <div className="flex between option table-row no-bottom">
                                <div className="text-right table-item">
                                  <label>実施予定日: </label>
                                  <label>{formatJapanDateSlash(modal_data.data.order_data.schedule_date)}</label>
                                </div>
                              </div>
                            )}
                            {modal_data.data != undefined && modal_data.data != null && modal_data.data.done_order == 1 && modal_data.data.order_data.is_completed != 4 && (
                              <div className="flex between option table-row no-bottom">
                                <div className="text-right table-item">
                                  <label>実施日時: </label>
                                  <label>{formatJapanDateSlash(modal_data.data.order_data.executed_date_time) + " " + modal_data.data.order_data.executed_date_time.substr(11, 2) + ":" + modal_data.data.order_data.executed_date_time.substr(14, 2)}</label>
                                </div>
                              </div>
                            )}
                            {/* YJ634 定期注射の実施詳細モーダルで、どの日のどの時刻の物かがわからない. ②定期注射の実施詳細モーダルでは、1回のオーダー用の実施予定日の代わりに、*/}
                            {/* --------- 定期注射 --------- */}
                            {modal_data.data.order_data.schedule_date !== null && modal_data.data.order_data.schedule_date !== undefined && modal_data.data.order_data.schedule_date != "" && modal_data.data.order_data.is_completed == 4 && schedule_date_time != "" && (
                              <div className="flex between option table-row no-bottom">
                                <div className="text-right table-item">
                                  <label>実施予定日時: </label>
                                  <label>{schedule_date_time}</label>
                                </div>
                              </div>
                            )}
                            {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data.is_completed == 4 && completed_at_time != "" && (
                              <div className="flex between option table-row no-bottom">
                                <div className="text-right table-item">
                                  <label>実施日時: </label>
                                  <label>{completed_at_time}</label>                                  
                                </div>
                              </div>
                            )}
                            {modal_data.data.order_data.location_name !== null && modal_data.data.order_data.location_name !== undefined && modal_data.data.order_data.location_name != "" && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      <label>実施場所: </label>
                                      <label>{modal_data.data.order_data.location_name}</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.data.order_data.drip_rate !== null && modal_data.data.order_data.drip_rate !== undefined && modal_data.data.order_data.drip_rate !== "" &&
                            modal_data.data.order_data.drip_rate !== 0 && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      {`点滴速度: ${modal_data.data.order_data.drip_rate}ml/h`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.data.order_data.water_bubble !== null && modal_data.data.order_data.water_bubble !== undefined && modal_data.data.order_data.water_bubble !== "" &&
                            modal_data.data.order_data.water_bubble !== 0 && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      {`1分あたり: ${modal_data.data.order_data.water_bubble}滴`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.data.order_data.exchange_cycle !== null && modal_data.data.order_data.exchange_cycle !== undefined && modal_data.data.order_data.exchange_cycle !== "" &&
                            modal_data.data.order_data.exchange_cycle !== 0 && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      {`交換サイクル: ${modal_data.data.order_data.exchange_cycle}時間`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.data.order_data.require_time !== null && modal_data.data.order_data.require_time !== undefined && modal_data.data.order_data.require_time !== "" &&
                            modal_data.data.order_data.require_time !== 0 && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      {`所要時間: ${modal_data.data.order_data.require_time}時間`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.data.order_data != null && modal_data.data.order_data.free_comment != null && modal_data.data.order_data.free_comment !== undefined && modal_data.data.order_data.free_comment.length > 0 &&  modal_data.data.order_data.free_comment[0] != null && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                      <label>備考: </label>
                                      <label>{modal_data.data.order_data.free_comment[0]}</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.data.order_data.item_details != null && modal_data.data.order_data.item_details != undefined && modal_data.data.order_data.item_details.length > 0 && modal_data.data.order_data.item_details.map(detail=>{
                              return(
                                <>
                                  <div className="item-details"><label>{detail.item_name}
                                    {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                    {detail.format1 != null && detail.format1 != undefined && detail.format1.includes("年") && detail.format1.includes("月") ? (
                                      <>
                                        {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                          <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label></>
                                        )}
                                        {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                          <> ~ <label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label></>
                                        )}
                                      </>
                                    ):(
                                      <>
                                        {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                          <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br /></>
                                        )}
                                        {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                          <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br /></>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  )}
                </div>
              </Bar>
            </Col>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className={(this.state.curFocus === 1 ? "focus " : "") + "custom-modal-btn cancel-btn"} style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          {(this.props.modal_type == "injection" || this.props.modal_type == "guidance") && this.props.modal_type != "guidance_medication" ? (
            <>
              {(modal_data.data.done_order !== undefined && modal_data.data.done_order != null && modal_data.data.done_order === 1) ? (
                <></>
              ):(
                <>
                  {this.can_done ? (
                    <div id="system_confirm_Ok" className={"custom-modal-btn red-btn"} onClick={this.doneData} style={{cursor:"pointer"}}>
                      <span>実施</span>
                    </div>
                  ):(
                    <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>                    
                      <div id="system_confirm_Ok" className={"custom-modal-btn disable-btn"} style={{cursor:"pointer"}}>
                        <span>実施</span>
                      </div>
                    </OverlayTrigger>
                  )}
                </>                
              )}
            </>
          ):(
            <>
              {this.props.modal_type == "guidance_medication" ? (
                <>
                </>
              ) : (
                <>
                  <div
                    id="system_confirm_Ok"
                    className={"custom-modal-btn red-btn"}
                    onClick={this.doneData}
                    style={{cursor:"pointer"}}
                  >
                    <span>実施</span>
                  </div>
                </>
              )}
            </>
          )}
        </Modal.Footer>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
          <SystemConfirmModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.confirm_message !== "" && this.state.confirm_in_modal == "menu_in_modal" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmCancelDoneOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.isOpenInspectionImageModal == true && (
          <EndoscopeImageModal
            closeModal={this.closeModal}
            imgBase64={this.state.endoscope_image}
          />
        )}
      </Modal>
      </>
    );
  }
}

DoneModal.contextType = Context;

DoneModal.propTypes = {
  closeModal: PropTypes.func,
  closeInjection: PropTypes.func,
  closeModalAndRefresh: PropTypes.func,
  modal_type: PropTypes.string,
  patientId: PropTypes.number,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  history: PropTypes.object,
  patientInfo: PropTypes.object,
  gotoUrl:PropTypes.string,
  fromPage:PropTypes.string,
};

export default withRouter(DoneModal);
