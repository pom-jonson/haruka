import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { WEEKDAYS, HOSPITALIZE_PRESCRIPTION_TYPE, getVisitPlaceNameForModal } from "~/helpers/constants";
import {
  surface,
  secondary200,
  disable
} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import {formatDate, formatJapanDateSlash, formatJapanSlashDateTime} from "~/helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SameOptionsNew from "~/components/molecules/SameOptionsNew";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios";
import {Bar} from "~/components/styles/harukaBackgroundCss";
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
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .content{
    height: 57vh;    
  }
  // ._color_implemented{
  //   .history-region{
  //     background: #e5ffdb;
  //   }
  //   .doctor-name{
  //     background: #e5ffdb; 
  //   }
  //   .data-item{
  //     background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
  //   }
  // }
  // ._color_not_implemented{
  //   .history-region{
  //     background: #ffe5ef;
  //   }
  //   .doctor-name{
  //     background: #ffe5ef; 
  //   }
  //   .data-item{
  //     background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
  //   }
  // }
 `;

const Col = styled.div`
  background-color: ${surface};
  width: 100%;
  max-height: calc(100vh - 182px);  
  -ms-overflow-style: auto;
  textarea {
    width: 100%;
    resize: none;
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    // background: rgb(160, 235, 255);
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
    font-size: 1rem;;
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

  .low-title,
  .middle-title{
    background: #ddf8ff;
  }
  .facility-border{
    border-top: 1px solid rgb(213, 213, 213);
  }
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;
  height : calc( 57vh - 11rem);
  overflow-y:auto;
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
      text-align:left;
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
    text-align: left;
    width: 3rem;    
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
  .prescription-body-part {
    width: 100%;
    padding-left: 4.5rem;
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

class PrescriptionDoneModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data: this.props.modal_data,
      confirm_message: "",
      confirm_type: "",
      complete_message: '',
      isConfirmComplete: false,
      detailedInsuranceInfo: [],
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
    this.can_done = true;
  }

  componentDidMount(){
    this.can_done = this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.DONE_OREDER);
    this.getInsuranceInfo();
    // set permission
  }

  doneData = async() => {
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

  confirmOk = () => {
    this.confirmCancel();
    let path = "/app/api/v2/order/prescription/execute";
    // get current_insurance_type
    let patientInfo = karteApi.getPatient(this.props.patientId);
    let current_insurance_type = patientInfo != undefined && patientInfo != null && patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0;    

    let number = '';
    let post_data = {
        type:this.props.modal_type,
        number,
        reception_or_done: "done",
        insurance_type: current_insurance_type
    };
    post_data = {
      number: this.props.modal_data.target_number,
      system_patient_id: this.props.modal_data.patient_id,
      insurance_type: current_insurance_type   
    }
    // this.setState({
    //   complete_message: '実施中',
    //   isConfirmComplete: true,      
    // })
    apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          // window.sessionStorage.setItem("alert_messages", "実施しました。");
          
          // if (this.props.modal_type == "prescription"){
          //   window.sessionStorage.setItem("alert_messages", "実施しました。");
          // } else {
          //   window.sessionStorage.setItem("alert_messages", "実施しました。");
          // }
        }
      })
      .catch(() => {
        this.props.closeModal("実施処理に失敗しました。");
      });
      // .finally(()=>{
      //   this.setState({
      //     complete_message: '',
      //     isConfirmComplete: false,
      //   })
      // });
      if (this.props.donePrescription != undefined && this.props.donePrescription != null) {
        this.props.donePrescription(this.props.modal_data.number, "prescription");
      }
      // this.props.closeModal("実施しました。");
      this.props.closeModal("prescription_done");
      
  }

  confirmCancel() {
      this.setState({
          confirm_message: "",
          confirm_type: ""
      });
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
    }

    if (karte_status == 3) {
      result = HOSPITALIZE_PRESCRIPTION_TYPE[internal_prescription].value;
    } else {
      result = internal_prescription == 0?"院外" : "院内";
    }     

    return result;    
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

  render() {
    const { modal_data, modal_title, modal_type} = this.props;   
    var karte_status = modal_data.karte_status != undefined ? modal_data.karte_status:modal_data.data.karte_status;
    const keyName = {      
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture: "混合"
    };
    let modal_label = modal_title + "実施";
    if (this.props.modal_label && this.props.modal_label != "") {
      modal_label = this.props.modal_label;
    }
    
    return  (
        <Modal show={true} id="done-order-modal"  className="custom-modal-sm first-view-modal prescript-done-modal">
          <Modal.Header>
            <Modal.Title>{modal_label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
            <Col id="soap_list_wrapper">
            <Bar>
              <div className="content">                
                {(modal_type == "prescription") && (
                  <div className="data-list">
                    <div className={'patient-info'}>
                      {this.props.patientInfo.receId} : {this.props.patientInfo.name}
                    </div>
                    <div className={`data-title ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.data.done_order, is_enabled:modal_data.data.is_enabled,karte_status:karte_status})}`}>
                        <div className="data-item">
                            <div className="flex justify-content">
                                <div className="note">【{this.getKarteStatusName(modal_data)}・{this.getPrescriptionType(modal_data)}処方】
                                    {modal_data.is_doctor_consented !== 4 && modal_data.data.done_order === 0 && (
                                        <span>未実施</span>
                                    )}
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
                        {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data != undefined && modal_data.data.order_data.visit_place_id != undefined && modal_data.data.order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(modal_data.data.order_data.visit_place_id)}
                          </div>
                        )}
                    </div>
                  <MedicineListWrapper>
                    <div className="history-item soap-data-item content-border">
                        {modal_data.data.order_data.order_data.length > 0 && modal_data.data.order_data.order_data.map((item, key)=>{                          
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
                                                {(medicine_item.can_generic_name === 1 || medicine_item.is_not_generic === 1 || (medicine_item.milling != undefined && medicine_item.milling === 1) || medicine_item.separate_packaging === 1) && (                                                  
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
                                        {sameOptionsView}
                                        {item.start_date !== undefined && item.start_date !== "" && (
                                            <div className="flex between option table-row">
                                                <div className="text-right table-item">
                                                    {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
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
                                        {item.med_consult !== undefined &&
                                        item.med_consult == 1 && (
                                            <div className="flex between option table-row">
                                                <div className="text-right table-item">
                                                    【お薬相談希望あり】
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        {modal_data.data.order_data != null && modal_data.data.order_data.med_consult != null && modal_data.data.order_data.med_consult !== undefined && modal_data.data.order_data.med_consult == 1 && (
                          <div className="history-item">
                            <div className="box">
                              <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                    <label>【お薬相談希望あり】</label>
                                  </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.supply_med_info != null && modal_data.data.order_data.supply_med_info !== undefined && modal_data.data.order_data.supply_med_info == 1 && (
                          <div className="history-item">
                            <div className="box">
                              <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                    <label>【薬剤情報提供あり】</label>
                                  </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.potion != null && modal_data.data.order_data.potion !== undefined && (modal_data.data.order_data.potion == 0 || modal_data.data.order_data.potion == 1) && modal_data.data.order_data.is_internal_prescription == 5 && (
                          <div className="history-item">
                            <div className="box">
                              <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                    <label>{modal_data.data.order_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}</label>
                                  </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.psychotropic_drugs_much_reason != null && modal_data.data.order_data.psychotropic_drugs_much_reason !== undefined && modal_data.data.order_data.psychotropic_drugs_much_reason !== "" && (
                        <div className="history-item">
                            <div className="box">
                            <div className="flex between option table-row">
                                <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                {`向精神薬多剤投与理由: ${modal_data.data.order_data.psychotropic_drugs_much_reason}`}
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.poultice_many_reason != null && modal_data.data.order_data.poultice_many_reason !== undefined && modal_data.data.order_data.poultice_many_reason !== "" && (
                        <div className="history-item">
                            <div className="box">
                            <div className="flex between option table-row">
                                <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                {`湿布薬超過投与理由: ${modal_data.data.order_data.poultice_many_reason}`}
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.free_comment != null && modal_data.data.order_data.free_comment !== undefined && modal_data.data.order_data.free_comment.length > 0 &&  modal_data.data.order_data.free_comment[0] != null && modal_data.data.order_data.free_comment[0] != '' && (
                        <div className="history-item">
                            <div className="box">
                            <div className="flex between option table-row">
                                <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                {`備考: ${modal_data.data.order_data.free_comment[0]}`}
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        <div className = 'function-region' style={{position:"relative",borderBottom: "1px solid rgb(213, 213, 213)"}}>
                      {modal_data.data.order_data.item_details != null && modal_data.data.order_data.item_details != undefined && modal_data.data.order_data.item_details.length > 0 && modal_data.data.order_data.item_details.map(ele=>{
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
              </div>
              {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                  <SystemConfirmModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.confirmOk.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
              )}
              {this.state.isConfirmComplete !== false && (
                <CompleteStatusModal message={this.state.complete_message} />
              )}
              </Bar>
              </Col>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>            
            <div onClick={this.props.closeModal} className={(this.state.curFocus === 1 ? "focus " : "") + "custom-modal-btn cancel-btn"} style={{cursor:"pointer"}}>
              <span>キャンセル</span>
            </div>
            {(modal_data.data.done_order !== undefined && modal_data.data.done_order != null && modal_data.data.done_order === 1) || this.props.no_done_btn ? (
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
          </Modal.Footer>
        </Modal>
    );
  }
}

PrescriptionDoneModal.contextType = Context;

PrescriptionDoneModal.propTypes = {
  closeModal: PropTypes.func,
  donePrescription: PropTypes.func,
  modal_type: PropTypes.string,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  modal_title: PropTypes.string,
  modal_label: PropTypes.string,
  modal_data: PropTypes.object,
  history: PropTypes.object,
  no_done_btn: PropTypes.bool,
  gotoUrl:PropTypes.string
};

export default withRouter(PrescriptionDoneModal);
