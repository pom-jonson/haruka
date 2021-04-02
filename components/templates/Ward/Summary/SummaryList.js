import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import ja from "date-fns/locale/ja";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatDateLine, formatDateSlash, formatDateString} from "~/helpers/date";
import Spinner from "react-bootstrap/Spinner";
import DatePicker, { registerLocale } from "react-datepicker";
import Papa from "papaparse";
import encoding from "encoding-japanese";
import {getServerTime} from "~/helpers/constants";
import SaveSearchCondition from "~/components/templates/Ward/Summary/SaveSearchCondition";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
registerLocale("ja", ja);
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Context from "~/helpers/configureStore";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as localApi from "~/helpers/cacheLocal-utils";
import HospitalDischargeSummary from "~/components/templates/Ward/Summary/HospitalDischargeSummary";
import HospitalDischargeSummaryChangeLog from "~/components/templates/Ward/Summary/HospitalDischargeSummaryChangeLog";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{display: flex;}
 .radio-area{
    label {
      font-size:1rem;
      line-height:2rem;
    }
 }
 .patient-id-area {
  div {margin-top:0;}
  .label-title {display:none;}
   input {
      font-size: 1rem;
      width:10rem;
      height:2rem;
   }
 }
 .selected {
   background: #F0E7D8 !important;
 }
 label {margin-bottom:0;} 
 .label-title {
    margin:0;
    width:5rem;
    line-height:2rem;
    font-size: 1rem;
 }
 .checkbox-area {
    label {
      font-size:1rem;
      line-height:2rem;
      min-width: 6rem;
    }
 }
 .btn-area {
  margin-top:0.5rem;
  button {height:2rem;}
  .count-list {
    margin-left:0.5rem;
    line-height:2rem;
    .count-box {
      border:1px solid #aaa;
      margin-right:0.5rem;
      padding: 0 0.3rem;
      height: 2rem;
    }
  }
  .right-btn {
    margin-left: auto;
    margin-right: 0;
  }
  .search-btn {
    padding:0 0.5rem;
    background-color: rgb(255, 255, 255);
    span {font-size:1rem;}
  }
 }
 .date-area{
    margin-top:2rem;
    div{margin-top:0;}
    input[type="text"]{
      width:8rem;
      padding-top:0;
      height:2rem;
      font-size:1rem;
    }
    .react-datepicker__month {
      margin: 0.4rem !important;
    }
 }
 .pullbox-label, .pullbox-select{
  width:8rem;
  height:2rem;
  font-size:1rem;
 }
 .pullbox-label{
   margin-bottom:0;
 }
 .select-ward{
   margin-left:0.5rem;
   .label-title{
     width:4rem;
   }
 }
 .select-department{
   margin-left:0.5rem;
   .label-title{
     width:3rem;
   }
 }
 .select-nurse {
   margin-left:0.5rem;
   .label-title{
     display:none;
   }
   .pullbox-label, .pullbox-select{
    width:15rem;
   }
   button {
    margin-left:0.5rem;
    height:2rem;
    min-width: 2rem;
   }
 }
 .input-date-area{
   .label-title{
     display:none;
   }
   input[type="text"]{
    width:8rem;
    padding-top:0;
    height:2rem;
    font-size:1rem;
  }
 }
 .fr{
   position:absolute;
   right:2rem;
 }
 button{
   margin-right:0.5rem;   
 }
 .list-area{    
    margin-top:0.5rem;
    table {
      margin-bottom:0px;
      font-size:1rem;
      thead{
        display:table;
        width:100%;
        border-bottom:1px solid #dee2e6;
        background-color: #a0ebff;
        tr {width: calc(100% - 17px);}
      }
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(100vh - 25rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{
          background-color:#e2e2e2 !important;
          cursor: pointer;
        }
      }
      tr{
        display: table;
        width: 100%;
      }
      td {
        word-break: break-all;
        padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
          border-bottom:none;
      }
      .no-td{
        width:3rem;
        text-align:right;
      }
      .id-td{
        width:8rem;
      }
      .name-td{
        width:20rem;        
      }
      .date-td{
        width:6rem;
      }
      .department-td{
        width:7rem;
      }
      .doctor-td{
        width:15rem;
      }
      .status-td{
        width:5rem;
      }
      .recept-status-td{
        width:7rem;
      }
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.div`
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
      font-size: 1rem;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    svg {
      width: 2.2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;


const ContextMenu = ({visible, x, y, summary_info, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {(summary_info.summary_data != null && summary_info.summary_data.history != null) && (
            <li><div onClick={() => parent.contextMenuAction("view_history", summary_info)}>更新歴表示</div></li>
          )}
          <li><div onClick={() => parent.contextMenuAction("go_karte", summary_info)}>カルテを開く</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class SummaryList extends Component {
  constructor(props) {
    super(props);
    let patient_number = "";
    let re = /patients[/]\d+/;
    let cur_url = window.location.href;
    let isPatientPage = re.test(cur_url);
    if (isPatientPage) {
      let path = cur_url.split("/");
      if (path[path.length - 1] == "nursing_document"){
        let nurse_patient_info = localApi.getObject("nurse_patient_info");
        if(nurse_patient_info !== undefined && nurse_patient_info != null && nurse_patient_info.patientInfo !== undefined){
          patient_number = nurse_patient_info.patientInfo.receId;
        }
      } else {
        let patient_id = localApi.getValue("current_system_patient_id");
        let patientInfo = karteApi.getPatient(patient_id);
        patient_number = patientInfo.receId;
      }
    }
    let last_week = new Date();
    last_week.setDate(last_week.getDate() - 7);
    this.init_search_condition = {
      search_patient:0,
      patient_number:"",
      department_id:0,
      first_ward_id:0,
      search_date_type:0,
      start_date:last_week,
      end_date:new Date(),
      search_doctor_type:0,
      doctor_id:0,
      create_flags:[0,1,2],
      approval_categorys:[0,1,2,3],
    };
    this.state = {
      search_patient:patient_number == "" ? 0 : 1,
      patient_number,
      department_id:0,
      first_ward_id:0,
      search_date_type:0,
      start_date:last_week,
      end_date:new Date(),
      search_doctor_type:0,
      doctor_id:0,
      create_flags:[0,1,2],
      approval_categorys:[0,1,2,3],
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      summary_list:[],
      load_flag:false,
      selected_summary_index:"",
      isOpenKarteModeModal:false,
      isOpenHospitalDischargeSummary:false,
      isOpenHospitalDischargeSummaryChangeLog:false,
      
      isOpenNursingSummary:false,
      alert_messages:"",
      complete_message:"",
      isOpenSummaryAgreeModal:false,
      isOpenSaveSearchCondition:false,
    };
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_master = [{id:0, value:"全病棟"}];
    if (cache_ward_master != undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value: ward.name});
      });
    }
    this.department_codes = [];
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    departmentOptions.map(department=>{
      this.department_codes.push(department);
    });
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.number;
        doctor.value = doctor.name;
        this.doctor_list.push(doctor);
      }
    });
    this.doctor_list.unshift({id:0,value:''});
  }

  async componentDidMount() {
    await this.getSummaryList();
  }

  selectDateType = (e) => {
    this.setState({date_type:parseInt(e.target.value)});
  };

  setDateValue = (key,value) => {
    this.setState({[key]:value});
  };

  selectNurseType = (e) => {
    this.setState({nurse_type:parseInt(e.target.value)});
  }

  getNurse = (e) => {
    this.setState({display_nurse_id:e.target.id});
  }
  
  setCheckStatus =(name, number)=>{
    let data = this.state[name];
    let index = data.indexOf(number);
    if(index === -1){
      data.push(number);
    } else {
      data.splice(index, 1);
    }
    this.setState({[name]:data});
  };
  
  filterExistSummary = (name, value) => {
    this.setState({[name]: value});
  }

  setCheckStatusAll=(value)=>{
    this.setState({
      create_flags:value == 1 ? [0,1,2] : [],
      approval_categorys:value == 1 ? [0,1,2,3] : [],
    });
  }

  openSummaryAgreeModal = (summary) => {
    if(summary.summary_data == null){
      return;
    }
    this.setState({
      isOpenSummaryAgreeModal:true,
      summary_info:summary
    })
  }
  
  deleteSummary=async()=>{
    this.setState({
      confirm_type : "",
      confirm_message : "",
    });
    let path = "/app/api/v2/nursing_service/delete/nurse_summary";
    let post_data = {
      number:this.state.summary_info.summary_data.number
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        this.setState({
          alert_messages:res.alert_message,
        }, ()=>{
          this.getSummaryList();
        });
      })
      .catch(()=> {
      })
  }
  
  get_title_csv=async()=>{
    let title = "看護サマリー一覧_";
    if(this.state.date_type != 0 && this.state.start_date != null && this.state.end_date != null && this.state.start_date != "" && this.state.end_date != ""){
      title = title + formatDateLine(this.state.start_date).split('-').join('') + "-" + formatDateLine(this.state.end_date).split('-').join('');
    } else {
      let server_time = await getServerTime();
      title = title + formatDateString(new Date(server_time));
    }
    return title + ".csv";
  }
  
  download_csv=async()=> {
    if(this.state.summary_list.length == 0 || this.state.load_flag == false){
      return;
    }
    let title = await this.get_title_csv();
    let data = [];
    let head_line = [];
    head_line.push(' ');
    head_line.push('患者ＩＤ');
    head_line.push('患者氏名');
    head_line.push('入院日');
    head_line.push('退院日（転院）');
    head_line.push('診療科');
    head_line.push('主治医');
    head_line.push('診断病名');
    head_line.push('作成状態');
    head_line.push('承認状態');
    data.push(head_line);
    this.state.summary_list.map((summary, index)=>{
      let data_item = [];
      data_item.push(index+1);
      data_item.push(summary.patient_number);
      data_item.push(summary.patient_name);
      data_item.push(formatDateSlash(summary.date_and_time_of_hospitalization.split('-').join('/')));
      data_item.push(summary.discharge_date != null ? formatDateSlash(summary.discharge_date.split('-').join('/')) : "");
      data_item.push(summary.department_name);
      data_item.push(summary.main_doctor_name);
      data_item.push('');
      data_item.push(summary.summary_data == null ? "未作成" : (summary.summary_data.is_created == 0) ? "作成中" : "作成済");
      data_item.push((summary.summary_data == null || summary.summary_data.is_created == 0) ? "" : "未承認");
      data_item.push('');
      data.push(data_item);
    });
    const config = {
      delimiter: ',', // 区切り文字
      header: true, // キーをヘッダーとして扱う
      newline: '\r\n', // 改行
    };
    const delimiterString = Papa.unparse(data, config);
    const strArray = encoding.stringToCode(delimiterString);
    const convertedArray = encoding.convert(strArray,'SJIS', 'UNICODE');
    const UintArray = new Uint8Array(convertedArray);
    const blobUrl = new Blob([UintArray], {type: 'text/csv'});
    const blob = blobUrl;
    const aTag = document.createElement('a');
    aTag.download = title;
    
    // 各ブラウザに合わせ、CSVをダウンロード
    if (window.navigator.msSaveBlob) {
      // for IE
      window.navigator.msSaveBlob(blob, aTag.download);
    } else if (window.URL && window.URL.createObjectURL) {
      // for Firefox
      aTag.href = window.URL.createObjectURL(blob);
      document.body.appendChild(aTag);
      aTag.click();
      document.body.removeChild(aTag);
    } else if (window.webkitURL && window.webkitURL.createObject) {
      // for Chrome
      aTag.href = (window.URL || window.webkitURL).createObjectURL(blob);
      
      aTag.click();
    } else {
      // for Safari
      window.open(
        `data:type/csv;base64,${window.Base64.encode(this.state.content)}`,
        '_blank'
      );
    }
  };
  
  openSaveSearchCondition=()=>{
   this.setState({isOpenSaveSearchCondition:true});
  }
  
  setCondition=(condition)=>{
    this.setState({
      search_patient:condition.search_patient,
      patient_number:condition.patient_number,
      department_id:condition.department_id,
      first_ward_id:condition.first_ward_id,
      search_date_type:condition.search_date_type,
      start_date:condition.start_date,
      end_date:condition.end_date,
      search_doctor_type:0,
      doctor_id:0,
      create_flags:condition.create_flags,
      approval_categorys:condition.approval_categorys,
      isOpenSaveSearchCondition:false,
    }, ()=>{
      this.getSummaryList();
    });
  }
  
  setRadioState = (e) => {
    this.change_flag = 1;
    let state_data = {};
    state_data[e.target.name] = parseInt(e.target.value);
    if(e.target.name == "tracheostomy_judgment" && e.target.value == 0){
      state_data['tracheostomy_type'] = "";
    }
    this.setState(state_data);
  }
  
  setPatientId=(e)=>{
    this.setState({patient_number: e.target.value});
  }
  
  getDepartment = e => {
    this.setState({department_id:e.target.id});
  };
  
  setWard=(e)=>{
    this.setState({first_ward_id:e.target.id});
  };
  
  setSelectValue = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };
  
  clearDoctorId=()=>{
    if(this.state.doctor_id == 0){
      return;
    }
    this.setState({
      confirm_type:"clear_doctor",
      confirm_title:"クリア確認",
      confirm_message:"医師検索の内容をクリアします。よろしいですか？"
    });
  }
  
  selectDoctorUser=()=>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(authInfo.staff_category === 1){
      this.setState({doctor_id:authInfo.doctor_number});
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "clear_doctor"){
      this.setState({
        doctor_id:0,
        confirm_message:"",
        confirm_type:"",
        confirm_ttitle:"",
      }, ()=>{
        this.getSummaryList();
      });
    }
    if(this.state.confirm_type == "clear_search_condition"){
      let last_week = new Date();
      last_week.setDate(last_week.getDate() - 7);
      this.setState({
        search_patient:0,
        patient_number:"",
        department_id:0,
        first_ward_id:0,
        search_date_type:0,
        start_date:last_week,
        end_date:new Date(),
        search_doctor_type:0,
        doctor_id:0,
        create_flags:[],
        approval_categorys:[],
        confirm_message:"",
        confirm_type:"",
        confirm_ttitle:"",
      }, ()=>{
        this.getSummaryList();
      });
    }
    if(this.state.confirm_type == "delete_summary"){
      this.deleteSummary();
    }
  }
  
  closeModal=(act, message=null)=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      confirm_ttitle:"",
      isOpenKarteModeModal:false,
      isOpenHospitalDischargeSummary:false,
      isOpenHospitalDischargeSummaryChangeLog:false,
  
  
      isOpenNursingSummary:false,
      isOpenSummaryAgreeModal:false,
      isOpenSaveSearchCondition:false,
      alert_messages:(act == 'register' && message != null) ? message : "",
    }, ()=>{
      if(act == 'register'){
        this.getSummaryList();
      }
    });
  };
  
  clearSearchCondition=()=>{
    let change_flag = false;
    if(this.state.load_flag){
      Object.keys(this.init_search_condition).map((k) => {
        if(!change_flag && (k == "create_flags" || k == "approval_categorys")){
          if(this.init_search_condition[k].length != this.state[k].length){
            change_flag = true;
          }
          if(!change_flag && this.init_search_condition[k].length >0){
            this.init_search_condition[k].map(value=>{
              if(!(this.state[k].includes(value))){
                change_flag = true;
              }
            });
          }
        } else {
          if (!change_flag && (this.init_search_condition[k] !== this.state[k])) {
            change_flag = true;
          }
        }
      });
    }
    if(!change_flag){return;}
    this.setState({
      confirm_type:"clear_search_condition",
      confirm_title:"クリア確認",
      confirm_message:"検索条件をクリアします。よろしいですか？"
    });
  }
  
  getSummaryList = async()=> {
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/ward/get/summary_list";
    let post_data = {
      patient_number:this.state.search_patient == 1 ? this.state.patient_number : "",
      department_id:this.state.department_id,
      first_ward_id:this.state.first_ward_id,
      search_date_type:this.state.search_date_type,
      start_date:(this.state.start_date != null && this.state.start_date != "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date != "") ? formatDateLine(this.state.end_date) : "",
      search_doctor_type:this.state.search_doctor_type,
      doctor_id:this.state.doctor_id,
      create_flags:this.state.create_flags,
      approval_categorys:this.state.approval_categorys,
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        this.setState({
          summary_list:res,
          load_flag:true,
        });
      })
  }
  
  selectSummary=(index)=>{
    this.setState({selected_summary_index:index});
  }
  
  handleClick=(e, summary)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("table_body")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: {visible: false}
          });
          document
            .getElementById("table_body")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let modal_left = document.getElementsByClassName("summary-list-modal")[0].getElementsByClassName("modal-dialog")[0].offsetLeft;
      let table_left = document.getElementsByClassName("list-area")[0].offsetLeft;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - modal_left - table_left,
          y: e.clientY + window.pageYOffset,
          summary_info:summary
        }
      });
    }
  };
  
  contextMenuAction=(act, summary_info)=>{
    if(act == "go_karte"){
      this.goKarte(summary_info);
    }
    if(act == "create_summary" || act == "edit_summary"){
      if(act == "create_summary"){
        summary_info.summary_data = null;
      }
      this.setState({
        isOpenNursingSummary : true,
        summary_info
      });
    }
    if(act == "delete_summary"){
      this.setState({
        confirm_type : act,
        confirm_message : "削除しますか？",
        summary_info
      });
    }
    if(act == "view_history"){
      this.setState({
        isOpenHospitalDischargeSummaryChangeLog:true,
        history_numbers:summary_info.summary_data.history,
      });
    }
  }
  
  goKarte = async(patient_info) => {
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if (item.system_patient_id == patient_info.patient_id) {
        isExist = 1;
      }
    });
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      this.openModalStatus = 1;
      this.setState({alert_messages: '4人以上の患者様を編集することはできません。'});
      return;
    }
    if (isExist == 0) { // new patient connect
      let modal_data = {
        systemPatientId:patient_info.patient_id,
        diagnosis_code:patient_info.department_id,
        diagnosis_name:patient_info.department_name,
        department:patient_info.department_name,
      };
      this.openModalStatus = 1;
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else {
      this.goKartePage(patient_info.patient_id);
    }
  }
  
  goKartePage=(patient_id)=>{
    this.props.closeModal();
    this.props.goKartePage(patient_id);
  }
  
  openHospitalDischargeSummary=(summary)=>{
    this.setState({
      isOpenHospitalDischargeSummary:true,
      summary_info:summary
    });
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm summary-list-modal first-view-modal">
          <Modal.Header><Modal.Title>サマリー一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className='flex'>
                  <div className='radio-area'>
                    <Radiobox
                      label={'指定なし'}
                      value={0}
                      getUsage={this.setRadioState.bind(this)}
                      checked={this.state.search_patient === 0}
                      name={`search_patient`}
                    />
                    <Radiobox
                      label={'患者ID'}
                      value={1}
                      getUsage={this.setRadioState.bind(this)}
                      checked={this.state.search_patient === 1}
                      name={`search_patient`}
                    />
                  </div>
                  <div className='patient-id-area flex'>
                    <InputWithLabel
                      type="text"
                      label={""}
                      getInputText={this.setPatientId.bind(this)}
                      diseaseEditData={this.state.patient_number}
                      isDisabled={this.state.search_patient === 0}
                    />
                    <button style={{marginLeft:'0.5rem'}} onClick={this.getSummaryList.bind(this)}>カナ検索</button>
                  </div>
                  <div className={'select-ward'} style={{marginRight:'3rem;'}}>
                    <SelectorWithLabel
                      options={this.department_codes}
                      title={'診療科'}
                      getSelect={this.getDepartment}
                      departmentEditCode={this.state.department_id}
                    />
                  </div>
                  <div className={'select-department'}>
                    <SelectorWithLabel
                      title="病棟"
                      options={this.ward_master}
                      getSelect={this.setWard}
                      departmentEditCode={this.state.first_ward_id}
                    />
                  </div>
                </div>
                <div className='flex'>
                  <div style={{height:"2rem"}}> </div>
                  <div className='date-area'>
                    <div className='radio-area'>
                      <Radiobox
                        label={'入院日'}
                        value={0}
                        getUsage={this.setRadioState.bind(this)}
                        checked={this.state.search_date_type === 0}
                        name={`search_date_type`}
                      />
                      <Radiobox
                        label={'退院日'}
                        value={1}
                        getUsage={this.setRadioState.bind(this)}
                        checked={this.state.search_date_type === 1}
                        name={`search_date_type`}
                      />
                    </div>
                    <div className='flex input-date-area'>
                      <InputWithLabelBorder
                        label=""
                        type="date"
                        getInputText={this.setDateValue.bind(this,"start_date")}
                        diseaseEditData={this.state.start_date}
                      />
                      <span style={{marginLeft:'0.5rem', marginRight:'0.5rem', lineHeight:'2rem'}}>～</span>
                      <DatePicker
                        locale="ja"
                        selected={this.state.end_date}
                        onChange={this.setDateValue.bind(this,"end_date")}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={this.state.start_date}                      
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                  </div>
                  <div style={{marginLeft:"1rem"}}>
                    <div className='radio-area' style={{marginLeft:"0.5rem"}}>
                      <div style={{lineHeight:"2rem", marginRight:"0.5rem"}}>医師</div>
                      <Radiobox
                        label={'主治医'}
                        value={0}
                        getUsage={this.setRadioState.bind(this)}
                        checked={this.state.search_doctor_type === 0}
                        name={`search_doctor_type`}
                      />
                      <Radiobox
                        label={'担当医'}
                        value={1}
                        getUsage={this.setRadioState.bind(this)}
                        checked={this.state.search_doctor_type === 1}
                        name={`search_doctor_type`}
                      />
                      <Radiobox
                        label={'記載医'}
                        value={2}
                        getUsage={this.setRadioState.bind(this)}
                        checked={this.state.search_doctor_type === 2}
                        name={`search_doctor_type`}
                      />
                    </div>
                    <div className='flex select-nurse'>
                      <button style={{marginLeft:0}} onClick={this.selectDoctorUser.bind(this)}>本人</button>
                      <SelectorWithLabel
                        options={this.doctor_list}
                        title={''}
                        getSelect={this.setSelectValue.bind(this, 'doctor_id')}
                        departmentEditCode={this.state.doctor_id}
                      />
                      <button className='clear-button' onClick={this.clearDoctorId.bind(this)}>C</button>
                    </div>
                  </div>
                  <div className='flex' style={{marginLeft:"1rem"}}>
                    <div className='button-area'>
                      <div style={{lineHeight:"2rem", textAlign:"center", marginRight:"0.5rem"}}>状態</div>
                      <button onClick={this.setCheckStatusAll.bind(this, 1)}>全選択</button><br/>
                      <button onClick={this.setCheckStatusAll.bind(this, 0)}>全解除</button>
                    </div>
                  </div>
                  <div className='checkbox-area'>
                    <Checkbox
                      label={'未作成'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="create_flags"
                      value={(this.state.create_flags.includes(0))}
                      number={0}
                    />
                    <Checkbox
                      label={'承認済'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="approval_categorys"
                      value={(this.state.approval_categorys.includes(1))}
                      number={0}
                    />
                    <Checkbox
                      label={'訂正依頼'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="approval_categorys"
                      value={(this.state.approval_categorys.includes(3))}
                      number={3}
                    />
                    <br/>
                    <Checkbox
                      label={'作成中'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="create_flags"
                      value={(this.state.create_flags.includes(1))}
                      number={1}
                    />
                    <Checkbox
                      label={'差し戻し'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="approval_categorys"
                      value={(this.state.approval_categorys.includes(2))}
                      number={1}
                    />
                    <br/>
                    <Checkbox
                      label={'作成済'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="create_flags"
                      value={(this.state.create_flags.includes(2))}
                      number={2}
                    />
                    <Checkbox
                      label={'受取済'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="approval_categorys"
                      value={(this.state.approval_categorys.includes(0))}
                      number={2}
                    />
                  </div>
                </div>
                <div className='flex btn-area'>
                  <Button type="mono" className={'search-btn'} onClick={this.getSummaryList}>最新表示</Button>
                  <div className={'count-list flex'}>
                    <div>件数： </div>
                    <div className={'count-box'}>&nbsp;{this.state.summary_list.length}</div>
                    <div>件</div>
                  </div>
                  <div className='right-btn flex'>
                    <button disabled={this.state.summary_list.length == 0 || this.state.load_flag == false} onClick={this.download_csv.bind(this)}>ファイル出力</button>
                    <button onClick={this.clearSearchCondition.bind(this)}>条件クリア</button>
                    <button onClick={this.openSaveSearchCondition}>条件変更</button>
                  </div>
                </div>
                <div className='list-area'>
                  <table className="table-scroll table table-bordered">
                    <thead>
                      <tr>
                        <th className='no-td'> </th>
                        <th className='id-td'>患者ＩＤ</th>
                        <th className='name-td'>患者氏名</th>
                        <th className='date-td'>入院日</th>
                        <th className='date-td'>退院日</th>
                        <th className='department-td'>診療科</th>
                        <th className='doctor-td'>主治医</th>
                        <th>サマリ記載医師</th>
                        <th className='status-td'>作成状態</th>
                        <th className='status-td'>承認状態</th>
                        <th className='recept-status-td'>受取管理状態</th>
                      </tr>
                    </thead>
                    <tbody id={'table_body'}>
                    {this.state.load_flag ? (
                      <>
                        {this.state.summary_list.length > 0 && (
                          this.state.summary_list.map((summary, index)=>{
                            return (
                              <>
                                <tr
                                  className={this.state.selected_summary_index === index ? 'selected' : ""}
                                  onClick={this.selectSummary.bind(this, index)}
                                  onDoubleClick={this.openHospitalDischargeSummary.bind(this, summary)}
                                  onContextMenu={e => this.handleClick(e, summary)}
                                >
                                  <td className='no-td'>{index+1}</td>
                                  <td className='id-td' style={{textAlign:"right"}}>{summary.patient_number}</td>
                                  <td className='name-td'>{summary.patient_name}</td>
                                  <td className='date-td'>{formatDateSlash(summary.date_and_time_of_hospitalization.split('-').join('/'))}</td>
                                  <td className='date-td'>{summary.discharge_date != null ? formatDateSlash(summary.discharge_date.split('-').join('/')) : ""}</td>
                                  <td className='department-td'>{summary.department_name}</td>
                                  <td className='doctor-td'>{summary.main_doctor_name}</td>
                                  <td> </td>
                                  <td className='status-td'>{summary.summary_data == null ? "未作成" : (summary.summary_data.is_created == 0 ? "作成中" : "作成済")}</td>
                                  <td className='status-td'>{(summary.summary_data == null || summary.summary_data.is_created == 0) ? "" : "未承認"}</td>
                                  <td className='recept-status-td'> </td>
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    ):(
                      <>
                        <tr>
                          <td colSpan={'11'}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </td>
                        </tr>
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          </Modal.Footer>
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_title}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.isOpenKarteModeModal && (
            <SelectModeModal
              modal_data={this.state.modal_data}
              goToUrl={this.goKartePage}
              closeModal={this.closeModal}
              modal_type={'summary_list'}
            />
          )}
          {this.state.isOpenHospitalDischargeSummary && (
            <HospitalDischargeSummary
              modal_data={this.state.summary_info}
              closeModal={this.closeModal}
              goKarte={this.goKarte}
            />
          )}
          {this.state.isOpenHospitalDischargeSummaryChangeLog && (
            <HospitalDischargeSummaryChangeLog
              closeModal={this.closeModal}
              history_numbers={this.state.history_numbers}
            />
          )}
          {this.state.isOpenSaveSearchCondition && (
            <SaveSearchCondition
              closeModal ={this.closeModal}
              setCondition ={this.setCondition}
            />
          )}
          
          
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal}
              handleOk= {this.closeModal}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

SummaryList.contextType = Context;
SummaryList.propTypes = {
  closeModal: PropTypes.func,
  goKartePage: PropTypes.func,
};

export default SummaryList;

