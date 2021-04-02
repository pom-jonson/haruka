import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { WEEKDAYS, getVisitPlaceNameForModal, getDoctorName, CACHE_LOCALNAMES } from "~/helpers/constants";
import {
  surface,
  secondary200,
  disable
} from "~/components/_nano/colors";
// import * as apiClient from "~/api/apiClient";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {formatDate, formatJapanDateSlash, formatJapanSlashDateTime, getWeekNamesBySymbol} from "~/helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import axios from "axios";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import ja from "date-fns/locale/ja";
import {formatDateLine} from "../../helpers/date";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import DatePicker, { registerLocale } from "react-datepicker";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
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

  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .react-datepicker-wrapper{
    input{
      width: 5.1rem;
    }    
  }
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
    border-bottom: none;
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
    // overflow: hidden;
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

  .no-result {
    padding: 10rem;
    text-align: center;

    p {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;
  height:calc(57vh - 10rem);
  border: 1px solid rgb(213, 213, 213);
  overflow-y:scroll;
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
  .flex-table{
    width: 100%;
    display: flex;
  }
  .react-datepicker-popper{
    // left: auto !important;
    // top: auto !important;
  }
`;

class InjectionIncreasePeriodModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;

    // YJ1154 期間が終了していない定期注射を延長できるようにする
    if (this.props.modal_type == 'injection_increase' || this.props.modal_type == 'injection') {
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
      modal_data,
      confirm_message: "",
      isBackConfirmModal: false,
      detailedInsuranceInfo: [],
      confirm_type: ""
    }
    this.is_period = false;
    this.is_exist = false;
    if (modal_data.data.order_data.order_data.length > 0) {
      modal_data.data.order_data.order_data.map(item=>{
        if (item.order_numbers !== undefined && item.order_numbers != null && Object.keys(item.order_numbers).length>0) {
          this.is_period = true;
          Object.keys(item.order_numbers).map(index=>{
            if (formatDateLine(new Date()) == index.substr(0, 10)) this.is_exist = true;
          })
        }
      });
    }
    this.can_done = false;
    this.m_cacheSerialNumber = modal_data.cacheSerialNumber != undefined ? modal_data.cacheSerialNumber : "";
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  }
  
  async componentDidMount(){
    await this.getInsuranceInfo();
    // set permission
    this.can_done = this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.DONE_OREDER);
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
    this.handleIncreaseInjection();
    this.confirmCancel();
  }
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      isBackConfirmModal: false,
      confirm_type: ""
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
  
  getDoneStatus (modal_data) {
    if (modal_data.is_doctor_consented != 4 && (modal_data.data.done_order == 0 || modal_data.data.done_order == 3)) return '未実施';
    if (modal_data.is_doctor_consented != 4 && modal_data.data.done_order == 2) return '受付済み';
    return '';
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

    let modal_data = this.state.modal_data;
    let modal_order_data = modal_data.data.order_data.order_data.map((ele, idx)=>{
      if (idx == key) {
        if (ele.administrate_period != undefined && ele.administrate_period != null) {
          ele.administrate_period.increase_period_end_date = formatDateLine(value);
          let increase_date_period_obj = JSON.parse(JSON.stringify(ele.administrate_period));
          increase_date_period_obj.period_end_date = ele.administrate_period.increase_period_end_date;
          let _doneDays = this.getIncreaseDate(increase_date_period_obj);
          ele.administrate_period.increase_days = _doneDays.length;
          ele.administrate_period.done_days = _doneDays;
        }
      }
      return ele;
    });
    modal_data.data.order_data.order_data = modal_order_data;
    this.setState({
      modal_data: modal_data,
    })
  } 

  increasePeriod = () => {
    this.setState({
      confirm_message: "編集を確定しますか？",
      confirm_title: "編集確定確認",
      confirm_type: "_increaseInjection"
    });
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

  handleIncreaseInjection = async () => {
    // save to cache  

    // 1.editOrders's code
    let prescription = this.state.modal_data.data;
    let newPresData = prescription.order_data.order_data.map(order => {
      let usageRemarksList = [];
      if (Array.isArray(order.usage_remarks_comment)) {
        usageRemarksList = order.usage_remarks_comment;
      } else {
        usageRemarksList.push(order.usage_remarks_comment);
      }
      return {
        medicines: order.med.map(medicine => {
          let free_comment = [];
          if (Array.isArray(medicine.free_comment)) {
            free_comment = medicine.free_comment.slice(0);
          } else {
            free_comment.push(medicine.free_comment);
          }
          return {
            medicineId: medicine.item_number,
            medicineName: medicine.item_name,
            amount: medicine.amount,
            unit: medicine.unit,
            free_comment: free_comment,
            usage_comment: medicine.usage_comment,
            uneven_values: medicine.uneven_values,
            units_list: medicine.units_list,
            contraindication_alert: medicine.contraindication_alert,
            contraindication_reject: medicine.contraindication_reject,
            tagret_contraindication: medicine.tagret_contraindication,
            yj_code: medicine.yj_code
          };
        }),
        units: [],
        usage: order.usage,
        usageName: order.usage_name,
        days: order.days,
        days_suffix: order.days_suffix,
        injectUsageName: order.injectUsageName,
        injectUsage: order.injectUsage,
        year: "",
        month: "",
        date: "",
        order_number: order.order_number,
        order_number_serial: order.order_number_serial,
        medical_business_diagnosing_type: 32,
        insurance_type:
          order.insurance_type === undefined ? 0 : order.insurance_type,
        usage_remarks_comment: usageRemarksList,
        start_date: order.start_date,
        usage_replace_number: order.usage_replace_number,
        body_part: order.body_part === undefined ? "" : order.body_part,
        receipt_key_if_precision: order.receipt_key_if_precision === undefined ? undefined : order.receipt_key_if_precision,
        is_precision: order.is_precision === undefined ? undefined : order.is_precision,
        administrate_period: order.administrate_period == undefined || order.administrate_period == null ? null : order.administrate_period
      };
    });

    newPresData.created_at = this.state.modal_data.created_at;

    // // 備考、その他欄のstate生成
    // let newBulk = {
    //   milling: 1,
    //   supply_med_info: 1,
    //   med_consult: 1,
    //   is_not_generic: 1,
    //   can_generic_name: 1,
    //   separate_packaging: 1,
    //   temporary_medication: 1,
    //   one_dose_package: 1
    // };
    // //全データのフラグが立っていたら画面用(bulk)のフラグON
    // newPresData.forEach(pres => {
    //   if (pres.order_number) {
    //     pres.medicines.forEach(med => {
    //       if (med.milling == 0) newBulk.milling = 0;
    //       if (med.is_not_generic == 0) newBulk.is_not_generic = 0;
    //       if (med.can_generic_name == 0) newBulk.can_generic_name = 0;
    //       if (med.separate_packaging == 0) newBulk.separate_packaging = 0;
    //     });
    //     if (pres.temporary_medication == 0) newBulk.temporary_medication = 0;
    //     if (pres.one_dose_package == 0) newBulk.one_dose_package = 0;
    //   }
    // });
    
    // if (prescription['order_data']['med_consult'] == 1) {
    //   newBulk.med_consult = 1;
    // } else {
    //   newBulk.med_consult = 0;
    // }
    
    // if (prescription['order_data']['supply_med_info'] == 1) {
    //   newBulk.supply_med_info = 1;
    // } else {
    //   newBulk.supply_med_info = 0;
    // }

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
      schedule_date: prescription['order_data'].schedule_date,
      injectData: newPresData,
      number: prescription.number,
      insurance_type: 0, //保険情報現状固定
      free_comment: Array.isArray(free_comment) ?
        free_comment :
        [free_comment], //備考
      department_code: this.state.modal_data.medical_department_code, //this.state.departmentId,
      department: this.state.modal_data.medical_department_name, //this.state.department,
      karte_status_code: cache_karte_status_code,
      karte_status_name: cache_karte_status_name,
      is_completed : prescription['order_data'].is_completed,
      patient_name: this.props.patientInfo.name,
      medical_department_name: this.context.medical_department_name,
      duties_department_name: this.context.duties_department_name,
      // unusedDrugSearch: this.state.unusedDrugSearch,
      // profesSearch: this.state.profesSearch,
      // normalNameSearch: this.state.normalNameSearch,
      isForInjectionUpdate: false,
      additions: prescription['order_data'].additions,
      item_details:item_details,
      location_id:prescription['order_data'].location_id,
      location_name:prescription['order_data'].location_name,
      drip_rate:prescription['order_data'].drip_rate,
      water_bubble:prescription['order_data'].water_bubble,
      exchange_cycle:prescription['order_data'].exchange_cycle,
      require_time:prescription['order_data'].require_time,
    });
    // cacheState.push({
    //   user_number: persistState.user_number,
    //   system_patient_id: parseInt(this.props.modal_data.patient_id),
    //   time: now,
    //   created_at: newPresData.created_at,
    //   presData: newPresData,
    //   number: prescription.number,
    //   insurance_type: 0, //保険情報現状固定
    //   med_consult: prescription.order_data.med_consult ? prescription.order_data.med_consult : 0, //お薬相談希望あり
    //   supply_med_info: prescription.order_data.supply_med_info ? prescription.order_data.supply_med_info : 0, //薬剤情報提供あり
    //   psychotropic_drugs_much_reason: prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "", //向精神薬多剤投与理由
    //   poultice_many_reason: prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "", //湿布薬多剤投与理由
    //   free_comment: Array.isArray(free_comment) ?
    //     free_comment :
    //     [free_comment], //備考
    //   department_code: this.state.modal_data.medical_department_code, //this.state.departmentId,
    //   department: this.state.modal_data.medical_department_name, //this.state.department,
    //   karte_status_code: cache_karte_status_code,
    //   karte_status_name: cache_karte_status_name,
    //   is_internal_prescription: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
    //   patient_name: this.props.patientInfo.name,
    //   medical_department_name: this.context.medical_department_name,
    //   duties_department_name: this.context.duties_department_name,
    //   bulk: newBulk,      
    //   item_details:item_details,
    //   potion: prescription.order_data.potion ? prescription.order_data.potion : "",
    //   hospital_opportunity_disease: 0,
    // });
    
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
    karteApi.setSubVal(parseInt(this.props.modal_data.patient_id), CACHE_LOCALNAMES.INJECTION_EDIT, active_key, newStateStr, 'insert');
    
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
      this.props.doneInjection();
    });
  }

  getDoneTimes = (_done_times=null) => {
    if (_done_times == null || _done_times.length < 1) return "";

    let result = _done_times.map((item, index)=>{
      return(
        <>
          <span> {index+1}回目 {item != "" ? item : "未定"}{index == (_done_times.length - 1) ? "":"、"}</span>
        </>
      );
    });
    return result;   
  }
  
  render() {
    let { modal_data, modal_title, modal_type} = this.props;
    var done_status = this.getDoneStatus(modal_data, modal_type);
    var karte_status = 1;
    if (modal_data.karte_status != undefined) karte_status = modal_data.karte_status;
    if (modal_data.data != undefined && modal_data.data.karte_status != undefined) karte_status = modal_data.data.karte_status;

    let modal_title_label = modal_title + "実施";    
    if (modal_type == "injection_increase") {
      modal_title_label = "定期注射継続登録";
    } else if( modal_type == "injection"){
      modal_title_label = "注射詳細";
    }
    return  (
      <Modal show={true} id="done-order-modal"  className="custom-modal-sm first-view-modal injection-increase-period-modal">
        <Modal.Header>
          <Modal.Title>{modal_title_label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <DatePickerBox style={{width:"100%", height:"100%"}}>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">
                  <div className="data-list">
                    <div className={'patient-info'}>
                      {this.props.patientInfo.receId} : {this.props.patientInfo.name}
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
                          {this.getHistoryInfo(modal_data.data.history.split(",").length-1, modal_data.substitute_name != undefined && modal_data.substitute_name != "" ? modal_data.substitute_name : modal_data.doctor_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                        </div>
                      ):(
                        <>
                          {modal_data.is_doctor_consented !=2 && (
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(0, modal_data.substitute_name != undefined && modal_data.substitute_name != "" ? modal_data.substitute_name : modal_data.doctor_name, modal_data.updated_at, modal_data.is_doctor_consented)}
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
                            <>                              
                              <div className="history-item" key={key}>
                                  <div className="box w70p" draggable="true">
                                    <div className="flex between drug-item table-row flex-table">
                                      <div className="first-column" style={underLine}>
                                        {" Rp" + parseInt(key + 1)}
                                      </div>
                                      <div className="text-right second-column">
                                        <div className="table-item" style={{marginRight:'8px'}}>
                                          {!item.usage_name ? "" : `手技: ${item.usage_name}`}
                                        </div>
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
                                    {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                      return (
                                        <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                          <div className="flex between flex-table">   
                                            <div className="first-column">                                                      
                                            </div>                                         
                                            <div className="flex full-width table-item second-column">                                                              
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
                                            <div className="table-item third-column" style={textAlignRight}>
                                              {" "}
                                              {medicine_item.amount}
                                              {medicine_item.unit}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                    {item.administrate_period != undefined && item.administrate_period != null && (
                                      <div className="flex between option table-row flex-table">
                                        <div className="first-column">                                                      
                                        </div>
                                        <div className="text-right table-item second-column">
                                          <div>
                                            1日{item.administrate_period.done_count}回 : {this.getDoneTimes(item.administrate_period.done_times)}
                                          </div>
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
                                    {item.is_precision !== undefined && item.is_precision == 1 && (
                                      <div className="flex between option table-row flex-table">
                                        <div className="first-column">                                                      
                                        </div>
                                        <div className="text-right table-item second-column">
                                          【精密持続点滴】
                                        </div>
                                        <div className="third-column">                                                      
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
                                    {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                      <div className="flex between drug-item table-row flex-table">
                                        <div className="first-column">                                                      
                                        </div>
                                        <div className="text-right second-column">
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
                                        <div className="table-item third-column">
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
                            </>
                          )
                        })}
                        <div>
                          {!this.is_period && modal_data.data.order_data.schedule_date !== null && modal_data.data.order_data.schedule_date !== undefined && modal_data.data.order_data.schedule_date != "" && (
                            <div className="flex between option table-row no-bottom flex-table">
                              <div className="first-column">                                                      
                              </div>
                              <div className="text-right table-item second-column">
                                <label>実施予定日: </label>
                                <label>{formatJapanDateSlash(modal_data.data.order_data.schedule_date)}</label>
                              </div>
                              <div className="third-column">                                                      
                              </div>
                            </div>
                          )}
                          {modal_data.data != undefined && modal_data.data != null && modal_data.data.done_order == 1 && (
                            <div className="flex between option table-row no-bottom flex-table">
                              <div className="first-column">                                                      
                              </div>
                              <div className="text-right table-item second-column">
                                <label>実施日時: </label>
                                <label>{formatJapanDateSlash(modal_data.data.order_data.executed_date_time) + " " + modal_data.data.order_data.executed_date_time.substr(11, 2) + "時" + modal_data.data.order_data.executed_date_time.substr(14, 2) + "分"}</label>
                              </div>
                              <div className="third-column">                                                      
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.location_name !== null && modal_data.data.order_data.location_name !== undefined && modal_data.data.order_data.location_name != "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row flex-table">
                                  <div className="first-column">                                                      
                                  </div>
                                  <div className="text-right table-item second-column">
                                    <label>実施場所: </label>
                                    <label>{modal_data.data.order_data.location_name}</label>
                                  </div>
                                  <div className="third-column">                                                      
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.drip_rate !== null && modal_data.data.order_data.drip_rate !== undefined && modal_data.data.order_data.drip_rate !== "" &&
                          modal_data.data.order_data.drip_rate !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row flex-table">
                                  <div className="first-column">                                                      
                                  </div>
                                  <div className="text-right table-item second-column">
                                    {`点滴速度: ${modal_data.data.order_data.drip_rate}ml/h`}
                                  </div>
                                  <div className="third-column">                                                      
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.water_bubble !== null && modal_data.data.order_data.water_bubble !== undefined && modal_data.data.order_data.water_bubble !== "" &&
                          modal_data.data.order_data.water_bubble !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row flex-table">
                                  <div className="first-column">                                                      
                                  </div>
                                  <div className="text-right table-item second-column">
                                    {`1分あたり: ${modal_data.data.order_data.water_bubble}滴`}
                                  </div>
                                  <div className="third-column">                                                      
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.exchange_cycle !== null && modal_data.data.order_data.exchange_cycle !== undefined && modal_data.data.order_data.exchange_cycle !== "" &&
                          modal_data.data.order_data.exchange_cycle !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row flex-table">
                                  <div className="first-column">                                                      
                                  </div>
                                  <div className="text-right table-item second-column">
                                    {`交換サイクル: ${modal_data.data.order_data.exchange_cycle}時間`}
                                  </div>
                                  <div className="third-column">                                                      
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.require_time !== null && modal_data.data.order_data.require_time !== undefined && modal_data.data.order_data.require_time !== "" &&
                          modal_data.data.order_data.require_time !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row flex-table">
                                  <div className="first-column">                                                      
                                  </div>
                                  <div className="text-right table-item second-column">
                                    {`所要時間: ${modal_data.data.order_data.require_time}時間`}
                                  </div>
                                  <div className="third-column">                                                      
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data != null && modal_data.data.order_data.free_comment != null && modal_data.data.order_data.free_comment !== undefined && modal_data.data.order_data.free_comment.length > 0 &&  modal_data.data.order_data.free_comment[0] != null && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row flex-table">
                                  <div className="first-column">                                                      
                                  </div>
                                  <div className="text-right table-item second-column">
                                    <label>備考: </label>
                                    <label>{modal_data.data.order_data.free_comment[0]}</label>
                                  </div>
                                  <div className="third-column">                                                      
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
                </div>
              </Bar>
              {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                <SystemConfirmModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
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
            </Col>
          </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <div
            onClick={this.handleCloseModal}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>キャンセル</span>
          </div>
          {this.props.show_type != "read" && (
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
        </Modal.Footer>
      </Modal>
    );
  }
}

InjectionIncreasePeriodModal.contextType = Context;

InjectionIncreasePeriodModal.propTypes = {
  closeModal: PropTypes.func,
  closeInjection: PropTypes.func,
  closeModalAndRefresh: PropTypes.func,
  doneInjection: PropTypes.func,
  modal_type: PropTypes.string,
  patientId: PropTypes.number,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  history: PropTypes.object,
  patientInfo: PropTypes.object,
  gotoUrl:PropTypes.string,
  fromPage:PropTypes.string,
  show_type:PropTypes.string
};

export default withRouter(InjectionIncreasePeriodModal);