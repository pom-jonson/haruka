import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { WEEKDAYS, HOSPITALIZE_PRESCRIPTION_TYPE, getVisitPlaceNameForModal, getDoctorName, CACHE_LOCALNAMES } from "~/helpers/constants";
import {
  surface,
  secondary200,
  disable
} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {formatDate, formatJapanDateSlash, formatJapanSlashDateTime, getWeekNamesBySymbol, getAge} from "~/helpers/date";
import {setDateColorClassName} from "~/helpers/dialConstants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SameOptionsNew from "~/components/molecules/SameOptionsNew";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import { formatDateLine } from "../../helpers/date";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {
  persistedState
} from "~/helpers/cache";
registerLocale("ja", ja);

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
  .react-datepicker-wrapper{
    input{
      width: 5.1rem;
    }    
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
    border-bottom: none;
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
    // overflow: hidden;
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
  border: 1px solid rgb(213, 213, 213);  
  overflow-y:scroll;  
  .first-column{
    width: 3.5rem;
    border-right: 1px solid rgb(213, 213, 213);
    padding: 0.25rem;
    // display: table-cell;
  }
  .second-column{    
    text-align: right;
    padding: 0.25rem;
    width: calc(100% - 8.6rem);
    // display: table-cell;
  }
  .third-column{
    width: 5.5rem;
    border-left: 1px solid rgb(213, 213, 213);
    border-right: 1px solid rgb(213, 213, 213);
    padding: 0.25rem;
    text-align: right;
    // display: table-cell;
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
      text-align:left;
    }
  }

  .box {
    line-height: 1.3;
    // position: relative;
    // &:before {
    //   content: "";
    //   background-color: ${disable};
    //   width: 1px;
    //   height: 100%;
    //   position: absolute;
    //   top: 0;
    //   left: 50px;
    // }
    // &:after {
    //   content: "";
    //   background-color: ${disable};
    //   width: 1px;
    //   height: 100%;
    //   position: absolute;
    //   top: 0;
    //   right: 80px;
    // }

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
  }

  .text-right {
    // width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .content-border{    
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
  .flex-table{
    width: 100%;
    display: flex;
  }
  .react-datepicker-popper{
    // left: auto !important;
    // top: auto !important;
  }
`;

class PrescriptionIncreasePeriodModal extends Component {
  constructor(props) {
    super(props);    

    let modal_data = this.props.modal_data;

    // YJ1153 期間が終了していない定期処方を延長できるようにする
    if (this.props.modal_type == 'prescription_increase' || this.props.modal_type == 'prescription') {
      if (modal_data.data.order_data != undefined && modal_data.data.order_data.order_data != undefined) {        
        let modal_order_data = modal_data.data.order_data.order_data.map(ele=>{
          if (ele.administrate_period != undefined && ele.administrate_period != null && ele.administrate_period.period_end_date != undefined && ele.administrate_period.period_end_date != "") {
            if (ele.administrate_period.increase_period_end_date == undefined || ele.administrate_period.increase_period_end_date == null) {              
              ele.administrate_period.increase_period_end_date = ele.administrate_period.period_end_date;
            }
            if (ele.administrate_period.days == undefined || ele.administrate_period.days == null || ele.administrate_period.days == "") {
              ele.administrate_period.days = this.getIncreaseDate(ele.administrate_period).length;
            }
          }
          return ele;
        });
        modal_data.data.order_data.order_data = modal_order_data;
      }
    }
    this.state = {
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data: modal_data,
      confirm_message: "",
      confirm_type: "",
      complete_message: '',
      isConfirmComplete: false,
      isBackConfirmModal: false,
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
    this.m_cacheSerialNumber = modal_data.cacheSerialNumber != undefined ? modal_data.cacheSerialNumber : "";
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
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

  handleDoneOrder = () => {
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

  getUsageInfo = (s_usageData, usageId) => {
    let ret = {};
    if(usageId === "" || usageId === undefined) return ret;
    let usageData;
    usageId = parseInt(usageId);
    if(s_usageData !== undefined && s_usageData != null && Object.keys(s_usageData).length > 0){
      Object.keys(s_usageData).map((kind)=>{
        usageData = s_usageData[kind];
        Object.keys(usageData).map((idx)=>{
          usageData[idx].map((item)=>{
            if(item.code === usageId){
              ret = item;
            }
          })
        });
      })
    }
    return ret;
  }

  handleIncreasePrescription = async () => {
    // save to cache  

    // 1.editOrders's code
    let prescription = this.state.modal_data.data;
    let arrMedCodes = [];
    prescription.order_data.order_data.map(order => {
      order.med.map(medicine => {
        arrMedCodes.push(JSON.parse(JSON.stringify(medicine)).item_number);
      });
    });
    let params = {
      type: "haruka",
      codes: arrMedCodes.join(",")
    };
    let medDetail = await apiClient.get("/app/api/v2/reference/medicines", {
      params: params
    });

    //haruka_cache_usageData
    let patientInfoResponse = await axios.get("/app/api/v2/karte/patient_datailed", {
      params: { systemPatientId: parseInt(this.props.modal_data.patient_id)}
    });

    let detailedPatientInfo = null;
    if(patientInfoResponse.data != undefined && patientInfoResponse.data !=null) {
      detailedPatientInfo =patientInfoResponse.data;
    }

    // セット処方の処理
    let diagnosisPrescriptionData = {};
    let newPresData = prescription.order_data.order_data.map((order, rpIdx) => {
      let usageRemarksList = [];
      if (Array.isArray(order.usage_remarks_comment)) {
        usageRemarksList = order.usage_remarks_comment;
      } else {
        usageRemarksList.push(order.usage_remarks_comment);
      }
      
      let usageData = this.getUsageInfo(order.usage);
      let usageType = usageData.diagnosis_division != undefined ? usageData.diagnosis_division : "";
      
      let _state = {
        medicines: order.med.map((medicine, medIdx) => {
          let free_comment = [];
          if (Array.isArray(medicine.free_comment)) {
            free_comment = medicine.free_comment.slice(0);
          } else {
            free_comment.push(medicine.free_comment);
          }
          if (usageType == "21" || usageType == "22") {
            let age_type = '';
            if(detailedPatientInfo !== undefined) {
              let age = getAge(detailedPatientInfo['patient'][0]['real_birthday']);
              age_type = age >= 15 ? '成人' : '小児';
              
            }
            let med_detail = medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : [];
            medicine.usage_alert_content = "";
            if (med_detail.usages === undefined || med_detail.usages === null) {
              medicine.usage_permission = 0;
            } else {
              
              let amount = -1;
              let strUsage = "";
              let strItemUsage = "";
              let mainUnit = medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit;
              let multi = 1;
              let unit_list = [];
              if (medicine.units_list !== undefined) {
                unit_list = medicine.units_list;
              } else if (medicine.units !== undefined) {
                unit_list = medicine.units;
              }
              
              unit_list.map((val) => {
                if (val.main_unit_flag == 1) {
                  mainUnit = val.name;
                }
                if (val.name == medicine.unit) {
                  multi = val.multiplier;
                }
              });
              med_detail.usages
                .filter((item) => {
                  if (item.age_category == "") {
                    return true;
                  }
                  return item.age_category == age_type;
                })
                .map((item) => {
                  let items = [];
                  amount = -1;
                  strItemUsage = "";
                  if (usageType == "21") {
                    if (mainUnit === item.c029 && item.c028 !== "") {
                      items = item.c028.split("～");
                      
                      if (amount > parseFloat(items[0]) || amount === -1) {
                        amount = parseFloat(items[0]);
                        strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c029;
                      }
                    }
                    
                    if (mainUnit === item.c058 && item.c057 !== "") {
                      items = item.c057.split("～");
                      if (amount > parseFloat(items[0]) || amount === -1) {
                        amount = parseFloat(items[0]);
                        strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c058;
                      }
                    }
                    
                    if (mainUnit === item.c087 && item.c086 !== "") {
                      items = item.c086.split("～");
                      if (amount > parseFloat(items[0]) || amount === -1) {
                        amount = parseFloat(items[0]);
                        strItemUsage = "・" + item.age_category + ":" + item.target + "1 日最大量:" + amount + item.c087;
                      }
                      
                    }
                    if (amount !== -1 && (medicine.amount * multi) > amount) {
                      strUsage = strUsage + strItemUsage + "\n";
                    }
                  } else if (usageType == "22") {
                    if (mainUnit === item.c029 && item.c027 !== "") {
                      items = item.c027.split("～");
                      
                      if (amount > parseFloat(items[0]) || amount === -1) {
                        amount = parseFloat(items[0]);
                        strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c029;
                      }
                    }
                    
                    if (mainUnit === item.c058 && item.c056 !== "") {
                      items = item.c056.split("～");
                      if (amount > parseFloat(items[0]) || amount === -1) {
                        amount = parseFloat(items[0]);
                        strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c058;
                      }
                    }
                    
                    if (mainUnit === item.c087 && item.c085 !== "") {
                      items = item.c085.split("～");
                      if (amount > parseFloat(items[0]) || amount === -1) {
                        amount = parseFloat(items[0]);
                        strItemUsage = "・" + item.age_category + ":" + item.target + "1 回最大量:" + amount + item.c087;
                      }
                    }
                    if (amount !== -1 && (medicine.amount * multi) > amount) {
                      strUsage = strUsage + strItemUsage + "\n";
                    }
                  }
                });
              
              if (strUsage !== "") {
                medicine.usage_permission = -1;
                medicine.usage_alert_content = medicine.item_name + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage;
              } else {
                medicine.usage_permission = 0;
                medicine.usage_alert_content = "";
              }
            }
          }
          let diagnosis_permission = 0;
          let diagnosis_content = "";
          if (medicine.diagnosis_division && usageData.allowed_diagnosis_division != undefined) {
            if (!usageData.allowed_diagnosis_division.includes(medicine.diagnosis_division.toString())) {
              diagnosis_permission = -1;
              if (diagnosisPrescriptionData[rpIdx] == undefined) {
                diagnosisPrescriptionData[rpIdx] = [];
              }
              diagnosisPrescriptionData[rpIdx].push(medIdx);
            }
          }
          
          return {
            medicineId: medicine.item_number,
            medicineName: medicine.item_name,
            amount: medicine.amount,
            // unit: medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit,
            // real_unit: medicine.real_unit !== undefined && medicine.real_unit !== "" ? medicine.real_unit : "",
            unit: medicine.unit !== undefined && medicine.unit !== "" ? medicine.unit : "",
            main_unit_flag: medicine.main_unit_flag,
            diagnosis_division: medicine.diagnosis_division,
            is_not_generic: medicine.is_not_generic,
            can_generic_name: medicine.can_generic_name,
            contraindication_alert: medicine.contraindication_alert,
            contraindication_reject: medicine.contraindication_reject,
            milling: medicine.milling,
            separate_packaging: medicine.separate_packaging,
            free_comment: free_comment,
            usage_comment: medicine.usage_comment,
            usage_optional_num: medicine.usage_optional_num,
            poultice_times_one_day: medicine.poultice_times_one_day,
            poultice_one_day: medicine.poultice_one_day,
            poultice_days: medicine.poultice_days,
            uneven_values: medicine.uneven_values,
            units_list: medicine.units_list,
            medDetail: medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : [],
            exists_detail_information: medicine.exists_detail_information,
            usage_permission: medicine.usage_permission,
            usage_alert_content: medicine.usage_alert_content,
            period_permission: 0,
            start_month: medicine.start_month !== undefined ? medicine.start_month : "",
            end_month: medicine.end_month !== undefined ? medicine.end_month : "",
            start_date : medicine.start_date !== undefined ? medicine.start_date : "",
            end_date : medicine.end_date !== undefined ? medicine.end_date : "",
            gene_name: medicine.gene_name !== undefined ? medicine.gene_name : "",
            diagnosis_permission: diagnosis_permission,
            diagnosis_content: diagnosis_content,
            tagret_contraindication: medicine.tagret_contraindication,
            yj_code: medicine.yj_code
          };
        }),
        units: [],
        usage: order.usage,
        usageName: order.usage_name,
        allowed_diagnosis_division: (usageData.allowed_diagnosis_division != undefined) ? usageData.allowed_diagnosis_division : [],
        usage_category_name: (usageData.category_name != undefined) ? usageData.category_name : "",
        days: order.days,
        days_suffix: order.days_suffix,
        year: "",
        month: "",
        date: "",
        order_number: order.order_number,
        order_number_serial: order.order_number_serial,
        supply_med_info: order.supply_med_info,
        med_consult: order.med_consult,
        temporary_medication: order.temporary_medication,
        one_dose_package: order.one_dose_package,
        mixture: order.mixture === undefined ? 0 : order.mixture,
        medical_business_diagnosing_type: order.medical_business_diagnosing_type,
        insurance_type: order.insurance_type === undefined ? 0 : order.insurance_type,
        usage_remarks_comment: usageRemarksList,
        start_date: order.start_date,
        usage_replace_number: order.usage_replace_number,
        body_part: order.body_part === undefined ? "" : order.body_part,
        administrate_period: order.administrate_period == undefined || order.administrate_period == null ? null : order.administrate_period
      };
      
      // 中止処方
      if (order.stop_flag) {
        _state.stop_flag = order.stop_flag;
      }
      if (order.stop_date) {
        _state.stop_date = order.stop_date;
      }
      
      return _state;
    });

    newPresData.created_at = this.state.modal_data.created_at;

    // 備考、その他欄のstate生成
    let newBulk = {
      milling: 1,
      supply_med_info: 1,
      med_consult: 1,
      is_not_generic: 1,
      can_generic_name: 1,
      separate_packaging: 1,
      temporary_medication: 1,
      one_dose_package: 1
    };
    //全データのフラグが立っていたら画面用(bulk)のフラグON
    newPresData.forEach(pres => {
      if (pres.order_number) {
        pres.medicines.forEach(med => {
          if (med.milling == 0) newBulk.milling = 0;
          if (med.is_not_generic == 0) newBulk.is_not_generic = 0;
          if (med.can_generic_name == 0) newBulk.can_generic_name = 0;
          if (med.separate_packaging == 0) newBulk.separate_packaging = 0;
        });
        if (pres.temporary_medication == 0) newBulk.temporary_medication = 0;
        if (pres.one_dose_package == 0) newBulk.one_dose_package = 0;
      }
    });
    
    if (prescription['order_data']['med_consult'] == 1) {
      newBulk.med_consult = 1;
    } else {
      newBulk.med_consult = 0;
    }
    
    if (prescription['order_data']['supply_med_info'] == 1) {
      newBulk.supply_med_info = 1;
    } else {
      newBulk.supply_med_info = 0;
    }

    // 品名情報反映
    var item_details = [];
    if (prescription.order_data.item_details != undefined && prescription.order_data.item_details!= null && prescription.order_data.item_details.length > 0){
      let item_details_array = prescription.order_data.item_details;
      Object.keys(item_details_array).map(item=> {
        item_details.push(item_details_array[item]);
      })
    }

    // 2.storeDataInCache's code
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let hour = newDate.getHours();
    let minute = newDate.getMinutes();
    let second = newDate.getSeconds();
    let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${
      date < 10 ? `0${date}` : `${date}`
      } ${hour < 10 ? `0${hour}` : `${hour}`}:${
      minute < 10 ? `0${minute}` : `${minute}`
      }:${second < 10 ? `0${second}` : `${second}`}`;

      

    let {persistState} = persistedState(this.props.modal_data.patient_id);
    let cacheState = [];
    let free_comment = prescription.order_data.free_comment ? prescription.order_data.free_comment : "";
    let cache_karte_status = parseInt(this.state.modal_data.karte_status);    
    let cache_karte_status_code = cache_karte_status == 1 ? 0 : cache_karte_status == 3 ? 1 : 2;
    let cache_karte_status_name = cache_karte_status == 1 ? "外来" : cache_karte_status == 3 ? "入院" : "訪問診療";
    cacheState.push({
      user_number: persistState.user_number,
      system_patient_id: parseInt(this.props.modal_data.patient_id),
      time: now,
      created_at: newPresData.created_at,
      presData: newPresData,
      number: prescription.number,
      insurance_type: 0, //保険情報現状固定
      med_consult: prescription.order_data.med_consult ? prescription.order_data.med_consult : 0, //お薬相談希望あり
      supply_med_info: prescription.order_data.supply_med_info ? prescription.order_data.supply_med_info : 0, //薬剤情報提供あり
      psychotropic_drugs_much_reason: prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "", //向精神薬多剤投与理由
      poultice_many_reason: prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "", //湿布薬多剤投与理由
      free_comment: Array.isArray(free_comment) ?
        free_comment :
        [free_comment], //備考
      department_code: this.state.modal_data.medical_department_code, //this.state.departmentId,
      department: this.state.modal_data.medical_department_name, //this.state.department,
      karte_status_code: cache_karte_status_code,
      karte_status_name: cache_karte_status_name,
      is_internal_prescription: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
      patient_name: this.props.patientInfo.name,
      medical_department_name: this.context.medical_department_name,
      duties_department_name: this.context.duties_department_name,
      bulk: newBulk,   
      additions: prescription.order_data.additions,
      item_details:item_details,
      potion: prescription.order_data.potion ? prescription.order_data.potion : "",
      hospital_opportunity_disease: 0,
    });
    
    if(prescription.order_data.doctor_code != null){
      cacheState[0].last_doctor_code = prescription.order_data.doctor_code;
      if(prescription.order_data.doctor_name != null){
        cacheState[0].last_doctor_name = prescription.order_data.doctor_name;
      } else {
        cacheState[0].last_doctor_name = getDoctorName(prescription.order_data.doctor_code);
      }
    }

    if (this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      cacheState[0].doctor_name = this.context.selectedDoctor.name;
      cacheState[0].doctor_code = this.context.selectedDoctor.code;
      cacheState[0].substitute_name = this.authInfo.name;
    }

    cacheState[0]['isUpdate'] = 1;
    cacheState[0].canConfirm = 2;
    cacheState[0].temp_saved = 1;
    cacheState[0].increasePeriod = 1;
    let active_key = new Date().getTime();    
    if (this.m_cacheSerialNumber != null && this.m_cacheSerialNumber != "") {
      active_key = this.m_cacheSerialNumber;
    }
    let cache_modal_data = this.state.modal_data;
    cache_modal_data.cacheSerialNumber = active_key;
    cacheState[0].modal_data = cache_modal_data;
    
    let newStateStr = JSON.stringify(cacheState);
    karteApi.setSubVal(parseInt(this.props.modal_data.patient_id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key, newStateStr, 'insert');
    
    // initialize
    let cache_modal_order_data = cache_modal_data.data.order_data.order_data.map(ele=>{
      delete ele.administrate_period.increase_period_end_date;
      delete ele.administrate_period.increase_days;        
      return ele;
    });
    cache_modal_data.data.order_data.order_data = cache_modal_order_data;
    this.setState({
      modal_data: cache_modal_data
    }, ()=> {
      // close modal
      this.props.donePrescription();
    });
  }

  confirmOk = () => {
    if (this.state.confirm_type == "_doneOrder") {
      this.handleDoneOrder();
    } else if(this.state.confirm_type == "_increasePrescription") {
      this.handleIncreasePrescription();
    }
    this.confirmCancel();      
  }

  confirmCancel() {
      this.setState({
          confirm_message: "",
          isBackConfirmModal: false,
          confirm_title: "",
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

  getIncreaseDate = (period_param) => {
    let type = period_param["period_type"];
    let s_date = period_param["period_start_date"];
    let e_date = period_param["period_end_date"];

    let ret_dates = [];
    if(type == 0) { //間隔指定
      let category = period_param["period_category"];
      if(category == 0) {
        for(let i=new Date(s_date).getTime(); i<=new Date(e_date).getTime(); i+=2*24*60*60*1000) {
          ret_dates.push(formatDateLine(i));
        }
      } else if(category == 1) {
        for(let i=new Date(s_date).getTime(); i<=new Date(e_date).getTime(); i+=7*24*60*60*1000) {
          ret_dates.push(formatDateLine(i));
        }
      } else if(category == 2) {
        ret_dates.push(s_date);
        let i = 1;
        let i_date = s_date;
        while(new Date(i_date).getTime()<=new Date(e_date).getTime()) {
          let fromDate = new Date(i_date);
          i_date = formatDateLine(new Date(new Date(fromDate).setMonth(fromDate.getMonth() + i)));          
          if(new Date(i_date).getTime()>new Date(e_date).getTime()) break;
          ret_dates.push(i_date);
          i++;
        }
      }
    }
    else if(type == 1) {
      for(let i=new Date(s_date).getTime(); i<=new Date(e_date).getTime(); i+=24*60*60*1000) {
        let date_weekday = new Date(i).getDay();
        if (period_param['period_week_days'].includes(date_weekday)) {
          ret_dates.push(formatDateLine(new Date(i)));
        }
      }
    }

    return ret_dates;

  }

  handleIncreaseDateChange = async (value, key) => {
    // get count dates by api
    // let period_days = 0;
    // let path = "/app/api/v2/order/injection/getAdministratePeriod";        
    // await apiClient
    //   ._post(path, {
    //       params: modal_data.data.order_data.order_data[key].administrate_period
    //   })
    //   .then((res) => {
    //     if (res && res.length > 0) {
    //       period_days = res.length;
    //     }
    //   })
    //   .catch(() => {
    //       // if (err.response.data) {
    //           // error_msg = error_messages;
    //       // }          
    //   });

    let modal_data = this.state.modal_data;
    let modal_order_data = modal_data.data.order_data.order_data.map((ele, idx)=>{
      if (idx == key) {        
        if (ele.administrate_period != undefined && ele.administrate_period != null) {
          ele.administrate_period.increase_period_end_date = formatDateLine(value);
          let increase_date_period_obj = JSON.parse(JSON.stringify(ele.administrate_period));
          increase_date_period_obj.period_end_date = ele.administrate_period.increase_period_end_date;
          ele.administrate_period.increase_days = this.getIncreaseDate(increase_date_period_obj).length;
        }
      }
      return ele;
    });
    modal_data.data.order_data.order_data = modal_order_data;
    this.setState({
      modal_data: modal_data,
    })
  }

  validatePeriodChanged = () => {
    let result = false;
    this.state.modal_data.data.order_data.order_data.map(item=>{
      if (item.administrate_period != undefined && item.administrate_period != null && item.administrate_period.period_end_date != undefined) {
        if (item.administrate_period.period_end_date != item.administrate_period.increase_period_end_date) {
          result = true;
        }
      }
    });
    return result;
  }

  increasePeriod = () => {
    this.setState({
      confirm_message: "編集を確定しますか？",
      confirm_title: "編集確定確認",
      confirm_type: "_increasePrescription"      
    });
  }

  handleCloseModal = () => {
    if (this.props.show_type == "read") {
      this.props.closeModal();
      return;
    }
    if (this.validatePeriodChanged()) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }      
  }

  validateRealPeriod = () => {
    let result = false;
    this.state.modal_data.data.order_data.order_data.map(item=>{
      if (item.administrate_period != undefined && item.administrate_period != null && item.administrate_period.period_end_date != undefined) {
        if (item.administrate_period.increase_days != undefined && item.administrate_period.increase_days > item.administrate_period.days) {
          result = true;
        }
      }
    });
    return result;
  }

  render() {
    const { modal_data, modal_title, modal_type} = this.props;   
    var karte_status = modal_data.karte_status != undefined ? modal_data.karte_status:modal_data.data.karte_status;
    const keyName = {      
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture: "混合"
    };
    let modal_title_label = modal_title + "実施";    
    if (modal_type == "prescription_increase") {
      modal_title_label = "定期処方継続登録";
    } else if( modal_type == "prescription"){
      modal_title_label = "処方詳細";
    }
    
    return  (
        <Modal show={true} id="done-order-modal"  className="custom-modal-sm first-view-modal prescript-increase-period-modal">
          <Modal.Header>
            <Modal.Title>{modal_title_label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
            <Col id="soap_list_wrapper">
            <Bar>
              <div className="content">                
                {(modal_type == "prescription" || modal_type == "prescription_increase") && (
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
                                                    <div className="flex between flex-table">
                                                        <div className="first-column" style={underLine}>
                                                          {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                                        </div>
                                                        <div className="second-column" style={{textAlign:"left"}}>
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
                                                        <div className="third-column" style={textAlignRight}>
                                                          {" "}
                                                          {medicine_item.amount}
                                                          {medicine_item.unit}
                                                        </div>                                                        
                                                    </div>
                                                </div>
                                                {(medicine_item.can_generic_name === 1 || medicine_item.is_not_generic === 1 || (medicine_item.milling != undefined && medicine_item.milling === 1) || medicine_item.separate_packaging === 1) && (                                                  
                                                  <div className="flex between option table-row flex-table">
                                                    <div className="first-column">                                                      
                                                    </div>
                                                    <div className="text-right table-item second-column">
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
                                                    <div className="third-column">                                                      
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            )
                                        })}
                                        <div className="flex between drug-item table-row flex-table">
                                            <div className="first-column">                                                      
                                            </div>
                                            <div className="text-right second-column">
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
                                            <div className="table-item third-column">
                                                {item.days !== 0 && item.days !== undefined
                                                    ? item.days +
                                                    (item.days_suffix !== undefined && item.days_suffix !== ""
                                                        ? item.days_suffix
                                                        : "日分")
                                                    : ""}
                                            </div>
                                        </div>
                                        {sameOptionsView}                                        
                                        {item.start_date !== undefined && item.start_date !== "" && (item.administrate_period == undefined || item.administrate_period == null) && (
                                          <div className="flex between option table-row flex-table">
                                            <div className="first-column">                                                      
                                            </div>
                                            <div className="text-right table-item second-column">
                                              {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
                                            </div>
                                            <div className="third-column">                                                      
                                            </div>
                                          </div>
                                        )}
                                        {item.administrate_period != undefined && item.administrate_period != null && (
                                          <div className="flex between option table-row flex-table">
                                            <div className="first-column">                                                      
                                            </div>
                                            <div className="text-right table-item second-column">                                              
                                              <div>
                                                投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                              </div>
                                              {item.administrate_period.period_type == 0 && item.administrate_period.period_category != null && (
                                                <div>
                                                  間隔 : {item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月"}
                                                </div>
                                              )}
                                              {item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0 && (
                                                <div>
                                                  曜日 : {getWeekNamesBySymbol(item.administrate_period.period_week_days)}
                                                </div>
                                              )}   
                                              {item.administrate_period.start_count != undefined && item.administrate_period.done_days != undefined && ( item.administrate_period.start_count != 1 || item.administrate_period.end_count != item.administrate_period.done_count) && (
                                                <>
                                                  <div>
                                                    初回 {formatJapanDateSlash(item.administrate_period.done_days[0])}の{item.administrate_period.start_count}回目から
                                                  </div>
                                                  <div>
                                                    最終 {formatJapanDateSlash(item.administrate_period.done_days[item.administrate_period.done_days.length - 1])}の{item.administrate_period.end_count}回目まで
                                                  </div>
                                                </>
                                              )}                                             
                                            </div>
                                            <div className="table-item third-column" style={{padding:"0px",paddingTop:"0.2rem", paddingRight:"0.1rem"}}>
                                              {this.props.show_type == "read" ? (
                                                <>
                                                  {item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}
                                                </>
                                              ):(
                                                <>
                                                  {item.administrate_period.increase_period_end_date != undefined && item.administrate_period.increase_period_end_date != null && (
                                                    <>
                                                      <DatePicker
                                                        locale="ja"
                                                        selected={
                                                          new Date(item.administrate_period.increase_period_end_date)
                                                        }
                                                        // onKeyDown={this.handleConfirmStartDate}
                                                        onChange={(e)=>this.handleIncreaseDateChange(e, key)}
                                                        dateFormat="yyyy/MM/dd"
                                                        placeholderText="年/月/日"
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoFocus
                                                        dayClassName = {date => setDateColorClassName(date)}
                                                        minDate={new Date(item.administrate_period.period_end_date)}
                                                      />
                                                    </>
                                                  )}
                                                </>
                                              )}                                                                                            
                                            </div>
                                          </div>                                                    
                                        )}
                                        {item.insurance_type !== undefined && (
                                            <div className="flex between option table-row flex-table">
                                              <div className="first-column">                                                      
                                              </div>
                                              <div className="text-right table-item second-column">
                                                  {`保険: ${this.getInsurance(item.insurance_type)}`}
                                              </div>
                                              <div className="third-column">                                                      
                                              </div>
                                            </div>                                            
                                          )}                                  
                                        {item.body_part !== undefined && item.body_part !== "" && (
                                            <div className="flex between option table-row prescription-body-part flex-table">
                                              <div className="first-column">                                                      
                                              </div>
                                              <div className="text-right table-item second-column">
                                                  {`部位/補足: ${item.body_part}`}
                                              </div>
                                              <div className="third-column">                                                      
                                              </div>
                                            </div>
                                        )}
                                        {item.discontinuation_start_date !== undefined &&
                                        item.discontinuation_start_date !== "" && (
                                            <div className="flex between option table-row flex-table">
                                              <div className="first-column">                                                      
                                              </div>
                                              <div className="text-right table-item second-column">
                                                  {`中止期間の最初日: ${formatDate(
                                                      item.discontinuation_start_date
                                                  )}`}
                                              </div>
                                              <div className="third-column">                                                      
                                              </div>
                                            </div>
                                        )}
                                        {item.discontinuation_end_date !== undefined &&
                                        item.discontinuation_end_date !== "" && (
                                            <div className="flex between option table-row flex-table">
                                              <div className="first-column">                                                      
                                              </div>
                                              <div className="text-right table-item second-column">
                                                  {`中止期間の最後日: ${formatDate(
                                                      item.discontinuation_end_date
                                                  )}`}
                                              </div>
                                              <div className="third-column">                                                      
                                              </div>
                                            </div>
                                        )}
                                        {item.discontinuation_comment !== undefined &&
                                        item.discontinuation_comment !== "" && (
                                            <div className="flex between option table-row flex-table">
                                              <div className="first-column">                                                      
                                              </div>
                                              <div className="text-right table-item second-column">
                                                  {`中止コメント: ${item.discontinuation_comment}`}
                                              </div>
                                              <div className="third-column">                                                      
                                              </div>
                                            </div>
                                        )}                                        
                                        {item.med_consult !== undefined &&
                                        item.med_consult == 1 && (
                                            <div className="flex between option table-row flex-table">
                                              <div className="first-column">                                                      
                                              </div>
                                              <div className="text-right table-item second-column">
                                                  【お薬相談希望あり】
                                              </div>
                                              <div className="third-column">                                                      
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
                              <div className="flex between option table-row flex-table">
                                <div className="first-column">                                                      
                                </div>
                                <div className="text-right table-item second-column" style={{paddingLeft:"80px"}}>
                                  <label>【お薬相談希望あり】</label>
                                </div>
                                <div className="third-column">                                                      
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.supply_med_info != null && modal_data.data.order_data.supply_med_info !== undefined && modal_data.data.order_data.supply_med_info == 1 && (
                          <div className="history-item">
                            <div className="box">
                              <div className="flex between option table-row flex-table">
                                <div className="first-column">                                                      
                                </div>
                                <div className="text-right table-item second-column">
                                  <label>【薬剤情報提供あり】</label>
                                </div>
                                <div className="third-column">                                                      
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.potion != null && modal_data.data.order_data.potion !== undefined && (modal_data.data.order_data.potion == 0 || modal_data.data.order_data.potion == 1) && modal_data.data.order_data.is_internal_prescription == 5 && (
                          <div className="history-item">
                            <div className="box">
                              <div className="flex between option table-row flex-table">
                                <div className="first-column">                                                      
                                </div>
                                <div className="text-right table-item second-column">
                                  <label>{modal_data.data.order_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}</label>
                                </div>
                                <div className="third-column">                                                      
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.psychotropic_drugs_much_reason != null && modal_data.data.order_data.psychotropic_drugs_much_reason !== undefined && modal_data.data.order_data.psychotropic_drugs_much_reason !== "" && (
                        <div className="history-item">
                            <div className="box">
                            <div className="flex between option table-row flex-table">
                                <div className="first-column">                                                      
                                </div>
                                <div className="text-right table-item second-column">
                                {`向精神薬多剤投与理由: ${modal_data.data.order_data.psychotropic_drugs_much_reason}`}
                                </div>
                                <div className="third-column">                                                      
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.poultice_many_reason != null && modal_data.data.order_data.poultice_many_reason !== undefined && modal_data.data.order_data.poultice_many_reason !== "" && (
                        <div className="history-item">
                            <div className="box">
                            <div className="flex between option table-row flex-table">
                                <div className="first-column">                                                      
                                </div>
                                <div className="text-right table-item second-column">
                                {`湿布薬超過投与理由: ${modal_data.data.order_data.poultice_many_reason}`}
                                </div>
                                <div className="third-column">                                                      
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        {modal_data.data.order_data != null && modal_data.data.order_data.free_comment != null && modal_data.data.order_data.free_comment !== undefined && modal_data.data.order_data.free_comment.length > 0 &&  modal_data.data.order_data.free_comment[0] != null && modal_data.data.order_data.free_comment[0] != '' && (
                        <div className="history-item">
                            <div className="box">
                            <div className="flex between option table-row flex-table">
                                <div className="first-column">                                                      
                                </div>
                                <div className="text-right table-item second-column">
                                {`備考: ${modal_data.data.order_data.free_comment[0]}`}
                                </div>
                                <div className="third-column">                                                      
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        {modal_data.data.order_data.item_details != null && modal_data.data.order_data.item_details != undefined && modal_data.data.order_data.item_details.length > 0 && (
                          <>
                            <div className = 'function-region' style={{position:"relative",borderBottom: "1px solid rgb(213, 213, 213)", borderRight: "1px solid rgb(213, 213, 213)"}}>
                              {modal_data.data.order_data.item_details.map(ele=>{
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
                          </>
                        )}
                    </div>
                  </MedicineListWrapper>
                  </div>
                )}                
              </div>
              {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (this.state.confirm_type != "_increasePrescription") && (
                  <SystemConfirmModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.confirmOk.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
              )}
              {this.state.confirm_message !== "" && this.state.confirm_title !== "" && (
                <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                  title= {this.state.confirm_title}
                />
              )}
              {this.state.isBackConfirmModal !== false && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.confirmCancel.bind(this)}
                  confirmOk={this.props.closeModal}
                  confirmTitle={this.state.confirm_message}
                />
              )}
              {this.state.isConfirmComplete !== false && (
                <CompleteStatusModal message={this.state.complete_message} />
              )}
              </Bar>
              </Col>
            </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>            
            <div onClick={this.handleCloseModal} className={(this.state.curFocus === 1 ? "focus " : "") + "custom-modal-btn cancel-btn"} style={{cursor:"pointer"}}>
              <span>キャンセル</span>
            </div>    
            {this.props.show_type != "read" && (
              <>
                {modal_type == "prescription_increase" && (
                  <>
                    {this.validatePeriodChanged() ? (
                      <>
                        {this.validateRealPeriod() ? (                      
                          <div id="system_confirm_Ok" className={"custom-modal-btn red-btn"} onClick={this.increasePeriod} style={{cursor:"pointer"}}>
                            <span>確定</span>
                          </div>
                        ):(
                          <OverlayTrigger placement={"top"} overlay={renderTooltip("追加される日がありません。")}>
                            <div className={"custom-modal-btn disable-btn"}><span>確定</span></div>
                          </OverlayTrigger>
                        )}
                      </>
                    ):(
                      <>
                          <div id="system_confirm_Ok" className={"custom-modal-btn disable-btn"} style={{cursor:"pointer"}}>
                              <span>確定</span>
                            </div>
                      </>
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

PrescriptionIncreasePeriodModal.contextType = Context;

PrescriptionIncreasePeriodModal.propTypes = {
  closeModal: PropTypes.func,
  donePrescription: PropTypes.func,
  modal_type: PropTypes.string,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  history: PropTypes.object,
  gotoUrl:PropTypes.string,
  show_type:PropTypes.string
};

export default withRouter(PrescriptionIncreasePeriodModal);
