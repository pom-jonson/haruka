import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { WEEKDAYS, getInspectionName, HOSPITALIZE_PRESCRIPTION_TYPE, getVisitPlaceNameForModal } from "~/helpers/constants";
import {
  surface,
  secondary200,
  midEmphasis,
  disable
} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import RehabilyOrderData from "~/components/templates/Patient/Modals/Rehabilitation/RehabilyOrderData";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import {formatDate, formatJapanDateSlash, formatJapanSlashDateTime} from "~/helpers/date";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import RadiationData from "~/components/templates/Patient/components/RadiationData";
import SameOptionsNew from "~/components/molecules/SameOptionsNew";
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
  font-size: 16px;
  width: 100%;
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .content{
    height: 500px;
    // overflow-y: auto;
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
  // overflow-y: auto;
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
    margin-left: 0.5rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold
  }
  .doctor-name{
    font-size: 13px;
    padding-right: 8px;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 13px;
    padding-right: 8px;
  }
  .order{
    display: block !important;
  }
  .data-list{
    overflow: hidden;
  }

  .soap-history-title{
    font-size: 12px;
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

`;

const MedicineListWrapper = styled.div`
  font-size: 12px;
  height:400px;
  overflow-y:auto;
  border-bottom:1px solid #ddd;
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
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
      left: 75px;
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
    margin-left: 16px;
  }

  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 75px;
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
    padding-left:80px;
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

  .full-width {
    width: calc(100% - 5rem - 15px);
    text-align: left;
    p{
      text-align: right;
    }
  }
  .options {
    float: right;
  }
`;

class NotDoneListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data: this.props.modal_data,
      confirm_message: "",
      confirm_type: "",
      allOptions: [
        "milling",
        "can_generic_name",
        "is_not_generic",
        "one_dose_package",
        "temprary_dedicine",
        "insurance_type",
        "separate_packaging",
        "mixture"
      ],
    }
    this.can_done = false;  
  }
  
  async componentDidMount() {
    await this.getDoctorsList();
    // set permission
    if (this.props.modal_type == "prescription" || this.props.modal_type == "injection") {      
      this.can_done = this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.DONE_OREDER);  
    } else if(this.props.modal_type == "inspection") {
      if (this.props.modal_data.data != undefined && this.props.modal_data.data != null && this.props.modal_data.data.inspection_id != undefined) {
        if (this.props.modal_data.data.inspection_id == 17) {                    
          this.can_done = this.context.$canDoAction(this.context.FEATURES.ENDOSCOPEORDER, this.context.AUTHS.DONE_OREDER);      
        } else {          
          this.can_done = this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.DONE_OREDER);      
        }
      }
    } else if(this.props.modal_type == "guidance") {
      this.can_done = this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.DONE_OREDER);      
    } else if(this.props.modal_type == "rehabily") {
      this.can_done = this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.DONE_OREDER);      
    } else if(this.props.modal_type == "radiation") {
      this.can_done = this.context.$canDoAction(this.context.FEATURES.RADIATION, this.context.AUTHS.DONE_OREDER);  
    }
  }
  
  getDoctorsList = async () => {
    let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    this.setState({ doctors: data });
  };
  
  doneData = async() => {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
    //   this.context.$selectDoctor(true);
    //   return;
    // }
    this.setState({
      confirm_message: "実施しますか？",
      confirm_type: "_doneOrder"
    });
    
  }
  
  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
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
      
    }else{
      
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
        
      }else{
        
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)}(${this.getWeekDay(strDateTime.substr(0,10))}) ${strDateTime.substr(11, 8)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
        
      }
    }
  }
  
  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    
    if (nDoctorConsented == 4) {
      
      return `（過去データ取り込み）${strDoctorName}`;
      
    }
    if (nDoctorConsented == 2) {
      
      return strDoctorName;
      
    }else{
      
      if (nDoctorConsented == 1) {
        
        return `[承認済み] 依頼医: ${strDoctorName}`;
        
      }else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }
  
  confirmOk = async() => {
    let path = "/app/api/v2/order/orderComplete";
    
    if (this.props.modal_type == "prescription") {
      path = "/app/api/v2/order/prescription/execute";
    } else if (this.props.modal_type == "injection") {
      path = "/app/api/v2/order/injection/execute";
    }
    let number = '';
    if(this.props.modal_type === 'guidance' || this.props.modal_type === 'home' || this.props.modal_type === 'spirit' || this.props.modal_type === 'rehabily' || this.props.modal_type === 'radiation' || this.props.modal_type === 'inspection'){
      number = this.props.modal_data.data.order_data.order_data.number;
    }
    let post_data = {
      type:this.props.modal_type,
      number,
      reception_or_done: "done"
    };
    
    if (this.props.modal_type == "prescription" || this.props.modal_type == "injection") {
      post_data = {
        number: this.props.modal_data.record_number,
        system_patient_id: this.props.modal_data.patient_id
      }
    }
    
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          if (this.props.modal_type != "prescription" && this.props.modal_type != "injection") {
            window.sessionStorage.setItem("alert_messages", res.alert_message);
            this.props.history.replace(`/patients/${this.props.patientId}/soap`);
          } else {
            window.sessionStorage.setItem("alert_messages", "実施しました。");
          }
        }
      })
      .catch(() => {
      
      })
    if (this.props.modal_type == "prescription" || this.props.modal_type == "injection") {
      this.props.closeModalAndRefresh();
    } else {
      this.props.closeModal();
    }
    if (this.props.handleNotDoneOk != undefined && this.props.handleNotDoneOk != null) this.props.handleNotDoneOk();
  }
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_type: ""
    });
  }
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };
  
  closeDoctor = () => {
    this.context.$selectDoctor(false);
  }
  
  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.context.$selectDoctor(false);
    if (this.doctor_modal_flag == 0) return;
    this.doctor_modal_flag = 0;
  };
  
  getDepartmentName = (_modalData) => {
    let result = "";
    if(_modalData == undefined || _modalData == null) return result;
    
    if (_modalData.medical_department_name == undefined || _modalData.medical_department_name == null){
      if (
        _modalData.order_data != undefined &&
        _modalData.order_data.department != undefined &&
        _modalData.order_data.department != "") {
        result = _modalData.order_data.department;
      }
    } else {
      result = _modalData.medical_department_name;
    }
    
    return result;
  }
  
  getKarteStatusName = (_modalData) => {
    let result = "外来";
    // if(_modalData == undefined || _modalData == null) return result;
    // if (_modalData.karte_status == undefined || _modalData.karte_status == null){
    //   if (_modalData.data != undefined &&
    //     _modalData.data.karte_status > 0) {
    //     result = _modalData.data.karte_status == 1 ? "外来" : _modalData.data.karte_status == 3 ? "入院" : "在宅";
    //   }
    // } else {
    //   result = _modalData.karte_status == 1 ? "外来" : _modalData.karte_status == 3 ? "入院" : "在宅";
    // }
    result = _modalData.karte_status == 1 ? "外来" : _modalData.karte_status == 3 ? "入院" : "在宅";
    
    return result;
  }
  
  getPrescriptionType = (_modalData) => {
    let result = "";
    if(_modalData == undefined || _modalData == null) return result;
    
    let karte_status = 1;
    let internal_prescription = 0;
    if (_modalData.karte_status != undefined && _modalData.karte_status != null && _modalData.karte_status > 0) {
      karte_status = _modalData.karte_status;
    } else if(_modalData.data != undefined && _modalData.data.order_data != undefined && _modalData.data.order_data.karte_status != undefined && _modalData.data.order_data.karte_status > 0) {
      karte_status = _modalData.data.order_data.karte_status;
    }
    
    if(_modalData.data != undefined && _modalData.data.order_data != undefined && _modalData.data.order_data.is_internal_prescription != undefined) {
      internal_prescription = _modalData.data.order_data.is_internal_prescription;
    } else if(_modalData.order_data != undefined && _modalData.order_data.is_internal_prescription != undefined) {
      internal_prescription = _modalData.order_data.is_internal_prescription;
    }
    
    if (karte_status == 3) {
      result = HOSPITALIZE_PRESCRIPTION_TYPE[internal_prescription].value;
    } else {
      result = internal_prescription == 0?"院外" : "院内";
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
    } else if(param_obj.target_table == "treat_order_header") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";
      }
    }
    return "";
  }

  getCheckSameOptions = (ele_order) => {
    if (ele_order == null || 
      ele_order == undefined || 
      ele_order.med == undefined || 
      ele_order.med == null || 
      ele_order.med.length < 1) {
      return;
    }
    let med = ele_order.med[0];
    let keys = Object.keys(med);
    let equalKeys = [];
    const allEqual = arr => arr.every(v => v === arr[0]);
    keys.map(key => {
      let value = [];
      ele_order.med.map(medi => {
        value.push(medi[key]);
      });
      if (allEqual(value)) {
        equalKeys.push(key);
      }
    });
    return equalKeys;
  };

  getSameOptions = (ele_order, aa) => {
    let values = [];
    if (aa !== undefined) {
      aa.map(key => {
        let value = {};

        value[key] = ele_order.med[0][key];
        values.push(value);
      });
    }
    let value = {};
    value["one_dose_package"] = ele_order["one_dose_package"];
    values.push(value);
    value = {};
    value["temporary_medication"] = ele_order["temporary_medication"];
    values.push(value);
    value = {};
    value["mixture"] = ele_order["mixture"];
    values.push(value);
    return values;
  };  
  
  render() {
    const { modal_data, modal_title, modal_type} = this.props;
    var karte_status = 1;
    if (modal_data.karte_status != undefined) {
      karte_status = modal_data.karte_status;
    } else if(modal_data.data != undefined){
      if (modal_data.data.karte_status != undefined){
        karte_status = modal_data.data.karte_status;
      } else {
        karte_status = modal_data.data.order_data.karte_status;
      }
    }

    let schedule_date_time = "";
    let completed_at_time = "";
    if (modal_type == "injection" && modal_data != undefined && modal_data != null && modal_data.order_data.is_completed == 4 && this.props.modal_data.rp_index != undefined) {      
      let rp_index = modal_data.cnt_index;
      let rp_data = modal_data.order_data.order_data[0];
      if (rp_data.done_numbers != undefined && rp_data.done_numbers != null && (Object.keys(rp_data.done_numbers).length > 0 || rp_data.done_numbers.length > 0)) {
        // completed_at_time = rp_data.done_numbers[modal_data.order_data.schedule_date][rp_index].completed_at.substr(0, 16);        
        completed_at_time = rp_data.done_numbers[modal_data.order_data.schedule_date][rp_index].completed_at;        
        if (completed_at_time != "") {
          completed_at_time = formatJapanDateSlash(completed_at_time) + " " + completed_at_time.substr(11, 2) + ":" + completed_at_time.substr(14, 2);
        }

        // count schedule_date_time
        if(modal_data.order_data.schedule_date !== null && modal_data.order_data.schedule_date !== undefined && modal_data.order_data.schedule_date != "" && modal_data.order_data.is_completed == 4 && this.props.modal_data.rp_index != undefined) {
          schedule_date_time = formatJapanDateSlash(modal_data.order_data.schedule_date);
          schedule_date_time = schedule_date_time + " " + rp_data.done_numbers[modal_data.order_data.schedule_date][rp_index].time;        
        }
      }      
    }
    
    return  (
      <Modal show={true} id="done-order-modal"  className="custom-modal-sm not-done-list-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>{modal_title}実施</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">
                  {modal_type == "inspection" && (
                    <div className="data-list">
                      <div className={`data-title ${this.getOrderTitleClassName({target_table:'inspection_order',is_doctor_consented:modal_data.is_doctor_consented, state:modal_data.data.state,karte_status:karte_status})}`}>
                        <div className={`data-item ${modal_data.openTag == 1 ? modal_data.class_name : ''}`}>
                          <div className="flex" style={{justifyContent:'space-between'}}>
                            <div className="note">
                              【{modal_data.data != null && modal_data.data.inspection_id != null && modal_data.data.inspection_id != undefined
                              ? getInspectionName(modal_data.data.inspection_id) : "生理"}】
                              {modal_data.is_doctor_consented !== 4 && modal_data.data.state == 0 && (
                                <span>未実施</span>
                              )}
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
                                {' '}{modal_data.treatment_datetime.substr(11, 2)}時
                                {modal_data.treatment_datetime.substr(14, 2)}分
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
                        {modal_data.data.history !== "" &&
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
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data.order_data != undefined && modal_data.data.order_data.order_data.visit_place_id != undefined && modal_data.data.order_data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.order_data.visit_place_id)}
                          </div>
                        )}                     
                      </div>
                      {modal_data.sub_category != "" ? (
                        <MedicineListWrapper>
                          <div className={`history-item soap-data-item ${modal_data.openTag == 1 && modal_data.class_name.includes('open') ? `${modal_data.class_name} order` : ''}`}>
                            <div className="history-item">
                              <div className="phy-box w70p" draggable="true">
                                {modal_data.data.order_data.order_data.classification1_name != undefined && modal_data.data.order_data.order_data.classification1_name != null && modal_data.data.order_data.order_data.classification1_name != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">検査項目</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.classification1_name}</div>
                                    </div>
                                  </div>
                                )}
                                {modal_data.data.order_data.order_data.classification2_name != undefined && modal_data.data.order_data.order_data.classification2_name != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">検査項目</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.classification2_name}</div>
                                    </div>
                                  </div>
                                )}
                                {/* ---------- start 内視鏡------------- */}
                                {modal_data.data.order_data.order_data.inspection_type_name != undefined && modal_data.data.order_data.order_data.inspection_type_name != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">検査種別</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.inspection_type_name}</div>
                                    </div>
                                  </div>
                                )}
                                
                                {modal_data.data.order_data.order_data.inspection_item_name != undefined && modal_data.data.order_data.order_data.inspection_item_name != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">検査項目</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.inspection_item_name}</div>
                                    </div>
                                  </div>
                                )}
                                {modal_data.data.order_data.order_data.endoscope_purpose_name != undefined && modal_data.data.order_data.order_data.endoscope_purpose_name != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">検査目的</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.endoscope_purpose_name}</div>
                                    </div>
                                  </div>
                                )}
                                {/* ----------- end ------------ */}
                                {modal_data.data.order_data.order_data.inspection_purpose != undefined && modal_data.data.order_data.order_data.inspection_purpose != null && modal_data.data.order_data.order_data.inspection_purpose.length > 0 && (
                                  <>
                                    {modal_data.data.order_data.order_data.inspection_purpose.map(item=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">検査目的</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                  </>
                                )}
                                {modal_data.data.order_data.order_data.inspection_symptom != undefined && modal_data.data.order_data.order_data.inspection_symptom != null && modal_data.data.order_data.order_data.inspection_symptom.length > 0 && (
                                  <>
                                    {modal_data.data.order_data.order_data.inspection_symptom.map(item=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">現症</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                  </>
                                )}
                                {modal_data.data.order_data.order_data.inspection_risk != undefined && modal_data.data.order_data.order_data.inspection_risk != null && modal_data.data.order_data.order_data.inspection_risk.length > 0 && (
                                  <>
                                    {modal_data.data.order_data.order_data.inspection_risk.map(item=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">冠危険因子</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                  </>
                                )}
                                {/* --------------------- start --------------- */}
                                {modal_data.data.order_data.order_data.inspection_sick != undefined && modal_data.data.order_data.order_data.inspection_sick != null && modal_data.data.order_data.order_data.inspection_sick.length > 0 && (
                                  <>
                                    {modal_data.data.order_data.order_data.inspection_sick.map(item=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">{item.title}</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                  </>
                                )}
                                
                                {modal_data.data.order_data.order_data.inspection_request != undefined && modal_data.data.order_data.order_data.inspection_request != null && modal_data.data.order_data.order_data.inspection_request.length > 0 && (
                                  <>
                                    {modal_data.data.order_data.order_data.inspection_request.map(item=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">{item.title}</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                  </>
                                )}
                                
                                {modal_data.data.order_data.order_data.is_anesthesia != undefined && modal_data.data.order_data.order_data.is_anesthesia != null && modal_data.data.order_data.order_data.is_anesthesia.length > 0 && (
                                  <>
                                    {modal_data.data.order_data.order_data.is_anesthesia.map(item=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">{item.title}</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                  </>
                                )}
                                
                                {modal_data.data.order_data.order_data.is_sedation != undefined && modal_data.data.order_data.order_data.is_sedation != null && modal_data.data.order_data.order_data.is_sedation.length > 0 && (
                                  <>
                                    {modal_data.data.order_data.order_data.is_sedation.map(item=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">{item.title}</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                  </>
                                )}
                                {/* --------------------- end --------------- */}
                                {modal_data.data.order_data.order_data.inspection_movement != undefined && modal_data.data.order_data.order_data.inspection_movement != null && modal_data.data.order_data.order_data.inspection_movement.length > 0 && (
                                  <>
                                    {modal_data.data.order_data.order_data.inspection_movement.map(item=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">患者移動形態</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })}
                                  </>
                                )}
                                {/*---------- start ---------------*/}
                                {modal_data.data.order_data.order_data.height != undefined && modal_data.data.order_data.order_data.height != null && modal_data.data.order_data.order_data.height != "" && (
                                  
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">身長</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.height}cm</div>
                                    </div>
                                  </div>
                                )}
                                {modal_data.data.order_data.order_data.weight != undefined && modal_data.data.order_data.order_data.weight != null && modal_data.data.order_data.order_data.weight != "" && (
                                  
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">体重</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.weight}kg</div>
                                    </div>
                                  </div>
                                )}
                                {modal_data.data.order_data.order_data.surface_area != undefined && modal_data.data.order_data.order_data.surface_area != null && modal_data.data.order_data.order_data.surface_area != "" && (
                                  
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">体表面積</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.surface_area}㎡</div>
                                    </div>
                                  </div>
                                )}
                                {/*------ end -------------  */}
                                {modal_data.data.order_data.order_data.sick_name != undefined && modal_data.data.order_data.order_data.sick_name != null && modal_data.data.order_data.order_data.sick_name != "" && (
                                  
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">臨床診断、病名</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.sick_name}</div>
                                    </div>
                                  </div>
                                )}
                                {modal_data.data.order_data.order_data.etc_comment != undefined && modal_data.data.order_data.order_data.etc_comment != null && modal_data.data.order_data.order_data.etc_comment != "" && (
                                  
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">主訴、臨床経過、検査目的、コメント</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.etc_comment}</div>
                                    </div>
                                  </div>
                                )}
                                
                                {modal_data.data.order_data.order_data.special_presentation != undefined && modal_data.data.order_data.order_data.special_presentation != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">特殊提示</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.special_presentation}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </MedicineListWrapper>
                      ):(
                        <></>
                      )}
                    </div>
                  )}
                  {(modal_type == "guidance" || modal_type == "home" || modal_type == "spirit") && (
                    <div className="data-list">
                      <div className={karte_status != 3? "data-title _color_implemented":"data-title _color_implemented_hospital"}>
                        <div className={`data-item ${modal_data.openTag == 1 ? modal_data.class_name : ''}`}>
                          <div className="flex" style={{justifyContent:'space-between'}}>
                            <div className="note">【{modal_title}】
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
                                {' '}{modal_data.treatment_datetime.substr(11, 2)}時
                                {modal_data.treatment_datetime.substr(14, 2)}分
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
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data.order_data != undefined && modal_data.data.order_data.order_data.visit_place_id != undefined && modal_data.data.order_data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      <MedicineListWrapper>
                        <div className={`history-item soap-data-item ${modal_data.openTag == 1 && modal_data.class_name.includes('open') ? `${modal_data.class_name} order` : ''}`}>
                          <div className="history-item">
                            <div className="phy-box w70p" draggable="true">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">分類</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.classific_name}</div>
                                </div>
                              </div>
                              {modal_data.data.order_data.order_data.classific_detail_id !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">分類詳細</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.classific_detail_name}</div>
                                  </div>
                                </div>
                              )}
                              {modal_data.data.order_data.order_data.details !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"> </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {modal_data.data.order_data.order_data.details.map(detail=>{
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
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {modal_data.data.order_data.order_data.comment !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{modal_data.data.order_data.order_data.comment}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  )}
                  {(modal_type == "rehabily") && (
                    <div className="data-list">
                      <div className={karte_status != 3? "data-title _color_implemented":"data-title _color_implemented_hospital"}>
                        <div className={`data-item ${modal_data.openTag == 1 ? modal_data.class_name : ''}`}>
                          <div className="flex" style={{justifyContent:'space-between'}}>
                            <div className="note">【{modal_title}】
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
                                {' '}{modal_data.treatment_datetime.substr(11, 2)}時
                                {modal_data.treatment_datetime.substr(14, 2)}分
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
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data.order_data != undefined && modal_data.data.order_data.order_data.visit_place_id != undefined && modal_data.data.order_data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      <RehabilyOrderData rehabily_data={modal_data.data.order_data.order_data} />
                    </div>
                  )}
                  {(modal_type == "radiation") && (
                    <div className="data-list">
                      <div className={karte_status != 3? "data-title _color_implemented":"data-title _color_implemented_hospital"}>
                        <div className={`data-item ${modal_data.openTag == 1 ? modal_data.class_name : ''}`}>
                          <div className="flex" style={{justifyContent:'space-between'}}>
                            <div className="note">【{modal_title}】
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
                                {' '}{modal_data.treatment_datetime.substr(11, 2)}時
                                {modal_data.treatment_datetime.substr(14, 2)}分
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
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data.order_data != undefined && modal_data.data.order_data.order_data.visit_place_id != undefined && modal_data.data.order_data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      
                      <MedicineListWrapper>
                        <div className={`history-item soap-data-item ${modal_data.openTag == 1 && modal_data.class_name.includes('open') ? `${modal_data.class_name} order` : ''}`}>
                          <RadiationData
                            data = {modal_data.data.order_data.order_data}
                            patientId = {this.props.patientId}
                          />
                        </div>
                      </MedicineListWrapper>
                    </div>
                  )}
                  {(modal_type == "prescription" || modal_type == "injection") && (
                    <div className="data-list">
                      {/*<div className="data-header">
                        {modal_data.updated_at !== "" && modal_data.updated_at !== undefined ? (
                            <>
                                {modal_data.updated_at.substr(0, 4)}/
                                {modal_data.updated_at.substr(5, 2)}/
                                {modal_data.updated_at.substr(8, 2)}
                                ({this.getWeekDay(modal_data.updated_at.substr(0,10))})
                            </>
                        ) : (
                            <>
                                {modal_data.created_at.substr(0, 4)}/
                                {modal_data.created_at.substr(5, 2)}/
                                {modal_data.created_at.substr(8, 2)}
                                ({this.getWeekDay(modal_data.created_at.substr(0,10))})
                            </>
                        )}
                        </div>*/}
                      <div className={`data-title ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.done_order,karte_status:karte_status})}`}>
                        <div className="data-item">
                          <div className="flex" style={{justifyContent:'space-between'}}>
                            <div className="note">
                              【{modal_type == "injection" ? this.getKarteStatusName(modal_data)+"・注射" : this.getKarteStatusName(modal_data)+ "・"+this.getPrescriptionType(modal_data) + "処方"}】
                              {modal_data.is_doctor_consented !== 4 && (modal_data.done_order === 0 || modal_data.done_order ==3) && (
                                <span>未実施</span>
                              )}
                            </div>
                            <div className="department text-right">{modal_type == "injection" ? this.getDepartmentName(modal_data) : modal_data.order_data.department}</div>
                          </div>
                          <div className="date">
                            {modal_data.created_at !== "" && modal_data.created_at !== undefined ? (
                              <>
                                {formatJapanSlashDateTime(modal_data.created_at)}
                              </>
                            ) : (
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
                                    {modal_data.created_at.substr(0, 4)}/
                                    {modal_data.created_at.substr(5, 2)}/
                                    {modal_data.created_at.substr(8, 2)}
                                    ({this.getWeekDay(modal_data.created_at.substr(0,10))})
                                    {' '}{modal_data.created_at.substr(11, 2)}時
                                    {modal_data.created_at.substr(14, 2)}分
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        {modal_data.history !== "" && modal_data.history != undefined &&
                        modal_data.history !== null ? (
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
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
                            let keyName = {                              
                              one_dose_package: "一包化",
                              temporary_medication: "臨時処方",
                              mixture:"混合"
                            };
                            let sameKeys = this.getCheckSameOptions(item);
                            let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptions(item, sameKeys) : "";                                                                                                  
                            let sameOptionsView;                            
                            if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {                                    
                              sameOptionsView = (
                                <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
                              );  
                              let noExistRpOptions = 0;
                              sameOptions.map(option=>{        
                                let key = Object.keys(option)[0];        
                                if (key == "one_dose_package") {          
                                  if (option['one_dose_package'] == undefined || option['one_dose_package'] == null || option['one_dose_package'] == 0) {
                                    noExistRpOptions ++;
                                  }
                                }
                                if (key == "temporary_medication") {          
                                  if (option['temporary_medication'] == undefined || option['temporary_medication'] == null || option['temporary_medication'] == 0) {
                                    noExistRpOptions ++;
                                  }
                                }
                                if (key == "mixture") {          
                                  if (option['mixture'] == undefined || option['mixture'] == null || option['mixture'] == 0) {
                                    noExistRpOptions ++;
                                  }
                                }
                              })
                              if (noExistRpOptions == 3) sameOptionsView = (<></>);
                            }
                            return (
                              <div className="history-item" key={key}>
                                <div className="box w70p" draggable="true">
                                  {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                    return (
                                      <>
                                        <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                          <div className="flex between">
                                            <div className="flex full-width table-item">
                                              <div className="number" style={underLine}>
                                                {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                              </div>
                                              
                                              <div className="ml-3 full-width mr-2">
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
                                        {this.props.modal_type == "prescription" && (medicine_item.can_generic_name === 1 || medicine_item.is_not_generic === 1 || (medicine_item.milling != undefined && medicine_item.milling === 1) || medicine_item.separate_packaging === 1) && (                                                  
                                          <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                              {medicine_item.can_generic_name === 1 && (
                                                <>&nbsp;<span style={underLine}>【一般名処方】</span></>
                                              )}
                                              {medicine_item.is_not_generic === 1 && (
                                                <>&nbsp;<span style={underLine}>【後発不可】</span></>
                                              )}
                                              {(medicine_item.milling !== undefined && medicine_item.milling === 1) && (
                                                <>&nbsp;<span style={underLine}>【粉砕】</span></>
                                              )}
                                              {medicine_item.separate_packaging === 1 && (
                                                <>&nbsp;<span style={underLine}>【別包】</span></>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </>
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
                                  {this.props.modal_type == "prescription" && sameOptionsView}
                                  {item.is_precision !== undefined && item.is_precision == 1 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        【精密持続点滴】
                                      </div>
                                    </div>
                                  )}
                                  {item.start_date !== undefined && item.start_date !== "" && modal_type == "prescription" && (
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
                                  {item.med.length > 0 && (
                                    <>
                                      {(item.temporary_medication !== undefined && item.temporary_medication === 1) ||
                                      (item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1) ||
                                      (item.med[0].milling !== undefined && item.med[0].milling === 1) ||
                                      (item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1) ||
                                      (item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1) ||
                                      (item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1) && (
                                        
                                        <div className="option flex table-item table-row dcVhIR">
                                          <div className="text-right table-item">
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
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          {modal_type == "injection" && (
                            <>
                              {/*--------- not 定期注射 --------- */}
                              {modal_data.order_data.schedule_date !== null && modal_data.order_data.schedule_date !== undefined && modal_data.order_data.schedule_date != "" && modal_data.order_data.is_completed != 4 && (
                                <div className="flex between option table-row no-bottom">
                                  <div className="text-right table-item">
                                    <label>実施予定日: </label>
                                    <label>{formatJapanDateSlash(modal_data.order_data.schedule_date)}</label>
                                  </div>
                                </div>
                              )}
                              {modal_data != undefined && modal_data != null && modal_data.done_order == 1 && modal_data.order_data.is_completed != 4 && (
                                <div className="flex between option table-row no-bottom">
                                  <div className="text-right table-item">
                                    <label>実施日時: </label>
                                    <label>{formatJapanDateSlash(modal_data.order_data.executed_date_time) + " " + modal_data.order_data.executed_date_time.substr(11, 2) + ":" + modal_data.order_data.executed_date_time.substr(14, 2)}</label>
                                  </div>
                                </div>
                              )}
                              {/* YJ634 定期注射の実施詳細モーダルで、どの日のどの時刻の物かがわからない. ②定期注射の実施詳細モーダルでは、1回のオーダー用の実施予定日の代わりに、*/}
                              {/* --------- 定期注射 --------- */}
                              {modal_data.order_data.schedule_date !== null && modal_data.order_data.schedule_date !== undefined && modal_data.order_data.schedule_date != "" && modal_data.order_data.is_completed == 4 && schedule_date_time != "" && (
                                <div className="flex between option table-row no-bottom">
                                  <div className="text-right table-item">
                                    <label>実施予定日時: </label>
                                    <label>{schedule_date_time}</label>
                                  </div>
                                </div>
                              )}
                              {modal_data != undefined && modal_data != null && modal_data.order_data.is_completed == 4 && completed_at_time != "" && (
                                <div className="flex between option table-row no-bottom">
                                  <div className="text-right table-item">
                                    <label>実施日時: </label>
                                    <label>{completed_at_time}</label>                                  
                                  </div>
                                </div>
                              )}                              
                              {modal_data.order_data.location_name !== null && modal_data.order_data.location_name !== undefined && modal_data.order_data.location_name != "" && (
                                <div className="history-item">
                                  <div className="box">
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        <label>実施場所: </label>
                                        <label>{modal_data.order_data.location_name}</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {modal_data.order_data.drip_rate !== null && modal_data.order_data.drip_rate !== undefined && modal_data.order_data.drip_rate !== "" &&
                              modal_data.order_data.drip_rate !== 0 && (
                                <div className="history-item">
                                  <div className="box">
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`点滴速度: ${modal_data.order_data.drip_rate}ml/h`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {modal_data.order_data.water_bubble !== null && modal_data.order_data.water_bubble !== undefined && modal_data.order_data.water_bubble !== "" &&
                              modal_data.order_data.water_bubble !== 0 && (
                                <div className="history-item">
                                  <div className="box">
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`1分あたり: ${modal_data.order_data.water_bubble}滴`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {modal_data.order_data.exchange_cycle !== null && modal_data.order_data.exchange_cycle !== undefined && modal_data.order_data.exchange_cycle !== "" &&
                              modal_data.order_data.exchange_cycle !== 0 && (
                                <div className="history-item">
                                  <div className="box">
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`交換サイクル: ${modal_data.order_data.exchange_cycle}時間`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {modal_data.order_data.require_time !== null && modal_data.order_data.require_time !== undefined && modal_data.order_data.require_time !== "" &&
                              modal_data.order_data.require_time !== 0 && (
                                <div className="history-item">
                                  <div className="box">
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`所要時間: ${modal_data.order_data.require_time}時間`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {modal_data.order_data != null && modal_data.order_data.free_comment != null && modal_data.order_data.free_comment !== undefined && modal_data.order_data.free_comment.length > 0 &&  modal_data.order_data.free_comment[0] != null && (
                                <div className="history-item">
                                  <div className="box">
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                        <label>備考: </label>
                                        <label>{modal_data.order_data.free_comment[0]}</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {modal_data.order_data.item_details != null && modal_data.order_data.item_details != undefined && modal_data.order_data.item_details.length > 0 && modal_data.order_data.item_details.map(ele=>{
                                return(
                                  <>
                                    <div style={{position:"relative"}}>
                                      <div className="function-region">
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
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                          <div style={{position:"relative"}}>
                            {modal_data.order_data.item_details != null && modal_data.order_data.item_details != undefined && modal_data.order_data.item_details.length > 0 && modal_data.order_data.item_details.map(ele=>{
                              return(
                                <>
                                  <div className="function-region">
                                    <div className="function-region-name">
                                      <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                                      <label>
                                        {ele.value1 != null && ele.value1 != undefined && (
                                          <label>{ele.value1}</label>
                                        )}
                                        {ele.value2 != null && ele.value2 != undefined && (
                                          <label>{ele.value2}</label>
                                        )}
                                      </label>
                                    </div>
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
                {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                  <SystemConfirmModal
                    hideConfirm= {this.confirmCancel.bind(this)}
                    confirmCancel= {this.confirmCancel.bind(this)}
                    confirmOk= {this.confirmOk.bind(this)}
                    confirmTitle= {this.state.confirm_message}
                  />
                )}
                <div className="footer">
                </div>
              </Bar>
            </Col>
            {this.state.doctors != undefined && this.context.needSelectDoctor === true ? (
              <SelectDoctorModal
                closeDoctor={this.closeDoctor}
                getDoctor={this.getDoctor}
                selectDoctorFromModal={this.selectDoctorFromModal}
                doctors={this.state.doctors}
              />
            ) : (
              ""
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div
            onClick={this.props.closeModal}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>{this.props.from_page == "outhospital_delete" ? "閉じる" : "キャンセル"}</span>
          </div>
          {this.props.only_close_btn != true && (
            <>
              {(modal_data.done_order !== undefined && modal_data.done_order != null && modal_data.done_order === 1) ? (
                <></>
              ):(
                <>
                  {this.can_done ? (
                    <div id="system_confirm_Ok"
                      className={"custom-modal-btn red-btn"}
                      onClick={this.doneData.bind(this)}
                      style={{cursor:"pointer"}}>
                      <span>実施</span>
                    </div>
                  ):(
                    <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>                    
                      <div id="system_confirm_Ok"
                        className={"custom-modal-btn disable-btn"}                        
                        style={{cursor:"pointer"}}>
                        <span>実施</span>
                      </div>
                    </OverlayTrigger>
                  )}
                </>                
              )}
            </>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

NotDoneListModal.contextType = Context;

NotDoneListModal.propTypes = {
  closeModal: PropTypes.func,
  closeModalAndRefresh: PropTypes.func,
  modal_type: PropTypes.string,
  from_page: PropTypes.string,
  patientId: PropTypes.number,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  only_close_btn: PropTypes.bool,
  history: PropTypes.object,
  handleNotDoneOk:PropTypes.func,
};

export default withRouter(NotDoneListModal);
