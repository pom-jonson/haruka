import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import ja from "date-fns/locale/ja";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import DischargeTransferNursingSummary from "./DischargeTransferNursingSummary";
import VisitNurseSummaryModal from "~/components/templates/Nurse/VisitNurseSummaryModal";
import NurseSummaryAgreeModal from "./NurseSummaryAgreeModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatDateLine, formatDateSlash, formatDateString, formatTimeIE} from "~/helpers/date";
import Spinner from "react-bootstrap/Spinner";
import DatePicker, { registerLocale } from "react-datepicker";
import Papa from "papaparse";
import encoding from "encoding-japanese";
import {getServerTime} from "~/helpers/constants";
import SaveSearchCondition from "~/components/templates/Nurse/NurseSummaryList/SaveSearchCondition";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
registerLocale("ja", ja);
import Pagination from "~/components/molecules/Pagination";
import axios from "axios/index";
import Context from "~/helpers/configureStore";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .selected {
   background: rgb(105, 200, 225) !important;
 }
 label {margin-bottom:0;} 
 .label-title {
    margin:0;
    width:5rem;
    line-height:2rem;
    font-size: 1rem;
 }
 .patient-id-area {
  div {margin-top:0;}
   input {
      font-size: 1rem;
      width:10rem;
      height:2rem;
   }
 }
 .radio-area{
    label {
      font-size:1rem;
      line-height:2rem;
    }
 }
 .checkbox-area {
    label {
      font-size:1rem;
      line-height:2rem;
      min-width: 6rem;
    }
 }
 .btn-area {
  button {
    height:2rem;
    line-height:1.8rem;
  }
  .count-list {
    margin-left:0.5rem;
    line-height:2rem;
    .count-box {
      border:1px solid #aaa;
      margin-right:0.5rem;
      padding: 0 0.3rem;
      height: 2rem;
      line-height: calc(2rem - 1px);
      width: 2.5rem;
      text-align: right;
    }
  }
  .right-btn {
    margin-left: auto;
    margin-right: 0;
    button {
      line-height:2rem;
    }
  }
  .search-btn {
    padding:0 0.5rem;
    background-color: rgb(255, 255, 255);
    span {font-size:1rem;}
  }
  .disable-btn {
    background: lightgray;
    cursor: auto;
    span {
      color: #595959 !important;
    }
  }
 }
 .date-area{
    div{
     margin-top:0
    }
    .react-datepicker-popper {
      margin-top:10px;
    }
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
  width:7rem;
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
  .display-number {
   margin-left:0.5rem;
   .label-title{
     width:5rem;
   }
  }
 .select-nurse {
   margin-left:0.5rem;
   .label-title{
     width:3rem;
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
        height: calc( 100vh - 30rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{
          background-color:#e2e2e2 !important;
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
      .hos-date-td{
        width:6rem;
      }
      .created-td{
        width:9rem;
      }
      .date-td{
        width:8rem;
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
    }
  }
  .pagination {
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    margin-bottom: 0;
    li {
      height: 2rem;
      a {
        line-height: 2rem;
        height: 2rem;
        font-size: 1rem;
        padding: 0 12px;
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


const ContextMenu = ({visible, x, y, summary_info, can_register_flag, can_edit_flag, can_delete_flag, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {can_register_flag && (
            <li><div onClick={() => parent.contextMenuAction("create_summary", summary_info)}>新規作成</div></li>
          )}
          {summary_info.summary_data != null && (
            <>
              {/* {summary_info.summary_data.create_flag == 1 && (
                <li><div onClick={() => parent.contextMenuAction("confirm_summary", summary_info)}>承認</div></li>
              )} */}
              {can_edit_flag && (
                <li><div onClick={() => parent.contextMenuAction("edit_summary", summary_info)}>サマリ修正</div></li>
              )}
              {can_delete_flag && (
                <li><div onClick={() => parent.contextMenuAction("delete_summary", summary_info)}>サマリ削除</div></li>
              )}
            </>
          )}
          <li><div onClick={() => parent.contextMenuAction("")}>閉じる</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const HoverMenu = ({ visible, x, y, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("discharge_transfer_nursing_summary")}>退院・転院時看護要約</div></li>
          <li><div>転棟サマリ</div></li>
          <li><div>助産記録１</div></li>
          <li><div>助産記録２</div></li>
          <li><div>中間サマリ</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class VisitNurseSummaryList extends Component {
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
    this.state = {
      patient_number,
      department_id:0,
      first_ward_id:0,
      date_type:0,
      start_date:"",
      end_date:"",
      nurse_type:0,
      display_nurse_id:0,
      create_flags:[0,1,2],
      approval_categorys:[0,1,2],
      isOpenNursingSummary:false,
      summary_list:[],
      alert_messages:"",
      complete_message:"",
      confirm_message:"",
      confirm_type:"",
      isOpenSummaryAgreeModal:false,
      isOpenDischargeTransferNursingSummary:false,
      isOpenSaveSearchCondition:false,
      load_flag:false,
      display_number: 20,
      pageOfItems:null,
    };
    this.nurses_list = sessApi.getStaffList(2);
    this.nurses_list.unshift({id:0,value:''});
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_master = [{id:0, value:"全病棟"}];
    if (cache_ward_master !== undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value: ward.name});
      });
    }
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    departmentOptions.map(department=>{
      this.department_codes.push(department);
    });
    this.per_page = [{id:1, value:20},{id:2, value:50},{id:3, value:100}];
  }

  async componentDidMount() {
    await this.getSummaryList();
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

  clearNurse=()=>{
    this.setState({display_nurse_id:0});
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
      approval_categorys:value == 1 ? [0,1,2] : [],
    });
  }

  clearSearchCondition=()=>{
    this.setState({
      patient_number:"",
      department_id:0,
      first_ward_id:0,
      date_type:0,
      start_date:"",
      end_date:"",
      nurse_type:0,
      display_nurse_id:0,
      create_flags:[],
      approval_categorys:[],
    }, ()=>{
      this.getSummaryList();
    });
  }

  getSummaryList = async()=> {
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nursing_service/get/visit_summary_list";
    let post_data = {
      department_id:this.state.department_id,
      first_ward_id:this.state.first_ward_id,
      nurse_type:this.state.nurse_type,
      display_nurse_id:this.state.display_nurse_id,
      date_type:this.state.date_type,
      start_date:(this.state.start_date != null && this.state.start_date != "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date != "") ? formatDateLine(this.state.end_date) : "",
      patient_number:this.state.patient_number,
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

  closeModal=(act, message=null)=>{
    this.setState({
      isOpenNursingSummary:false,
      isOpenSummaryAgreeModal:false,
      isOpenDischargeTransferNursingSummary:false,
      isOpenSaveSearchCondition:false,
      alert_messages:(act == 'register' && message != null) ? message : "",
      confirm_message:"",
      confirm_type:"",
    }, ()=>{
      if(act == 'register'){
        this.getSummaryList();
      }
    });
  };

  openSummaryAgreeModal = (summary) => {
    if(summary.summary_data == null || summary.summary_data.create_flag == 0){
      return;
    }
    this.setState({
      isOpenSummaryAgreeModal:true,
      summary_info:summary
    });
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 100,
          y: e.clientY + window.pageYOffset,
          summary_info:JSON.parse(JSON.stringify(summary)),
          can_register_flag:this.context.$canDoAction(this.context.FEATURES.VISIT_NURSE_SUMMARY,this.context.AUTHS.REGISTER),
          can_edit_flag:this.context.$canDoAction(this.context.FEATURES.VISIT_NURSE_SUMMARY,this.context.AUTHS.EDIT),
          can_delete_flag:this.context.$canDoAction(this.context.FEATURES.VISIT_NURSE_SUMMARY,this.context.AUTHS.DELETE),
        }
      })
    }
  };

  contextMenuAction=(act, summary_info)=>{
    if(act == "create_summary" || act == "edit_summary"){
      if(act == "create_summary" && summary_info.summary_data != null){
        summary_info.summary_data['number'] = 0;
        summary_info.summary_data['height'] = null;
        summary_info.summary_data['height_measuring_date'] = null;
        summary_info.summary_data['weight'] = null;
        summary_info.summary_data['weight_measuring_date'] = null;
        summary_info.summary_data['created_at'] = null;
        summary_info.summary_data['updated_at'] = null;
        summary_info.summary_data['writer_name'] = null;
        summary_info.summary_data['create_flag'] = 0;
        summary_info.summary_data['history'] = null;
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
    if(act == "confirm_summary"){
      this.setState({
        isOpenSummaryAgreeModal:true,
        summary_info
      });
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "delete_summary"){
      this.deleteSummary();
    }
  }
  
  deleteSummary=async()=>{
    this.setState({
      confirm_type : "",
      confirm_message : "",
    });
    let path = "/app/api/v2/nursing_service/delete/visit_nurse_summary";
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
    if(this.state.pageOfItems == null || this.state.pageOfItems.length == 0 || this.state.load_flag == false){
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
    this.state.pageOfItems.map((summary, index)=>{
      let data_item = [];
      data_item.push(index + 1);
      data_item.push(summary.patient_number);
      data_item.push(summary.patient_name);
      data_item.push(formatDateSlash(summary.date_and_time_of_hospitalization.split('-').join('/')));
      data_item.push(summary.expected_discharge_date != null ? formatDateSlash(summary.expected_discharge_date.split('-').join('/')) : "");
      data_item.push(summary.department_name);
      data_item.push(summary.main_doctor_name);
      data_item.push(summary.disease_name);
      data_item.push(summary.summary_data == null ? "未作成" : (summary.summary_data.create_flag == 1) ? "作成済" : "作成中");
      data_item.push(summary.summary_data == null ? "未承認" : (summary.summary_data.approval_category == 0)
        ? "未承認" : ((summary.summary_data.approval_category == 1) ? "承認済み" : "差し戻し"));
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
      patient_number:condition.patient_number,
      department_id:condition.department_id,
      first_ward_id:condition.first_ward_id,
      date_type:condition.date_type,
      start_date:condition.start_date,
      end_date:condition.end_date,
      nurse_type:condition.nurse_type,
      display_nurse_id:condition.display_nurse_id,
      create_flags:condition.create_flags,
      approval_categorys:condition.approval_categorys,
      isOpenSaveSearchCondition:false,
    }, ()=>{
      this.getSummaryList();
    });
  }
  
  onChangePage(pageOfItems) {
    this.setState({ pageOfItems: pageOfItems });
  }
  
  getDisplayNumber = e => {
    this.setState({display_number: parseInt(e.target.value)});
  };
  
  get_title_pdf = async () => {
    let title = "訪問看護サマリー一覧_";
    if(this.state.date_type != 0 && this.state.start_date != null && this.state.end_date != null && this.state.start_date != "" && this.state.end_date != ""){
      title = title + formatDateLine(this.state.start_date).split('-').join('') + "-" + formatDateLine(this.state.end_date).split('-').join('');
    } else {
      let server_time = await getServerTime();
      title = title + formatDateString(new Date(server_time));
    }
    return title+".pdf";
  }
  
  download_pdf=async()=> {
    if(this.state.pageOfItems == null || this.state.pageOfItems.length == 0 || this.state.load_flag == false){
      return;
    }
    this.setState({complete_message:"印刷中"});
    let path = "/app/api/v2/nursing_service/visit_nurse_summary/list/print";
    let pdf_file_name = await this.get_title_pdf();
    let print_data = {};
    print_data.list_data = this.state.pageOfItems;
    print_data.patient_number = this.state.patient_number;
    print_data.department_id = this.state.department_id;
    print_data.first_ward_id = this.state.first_ward_id;
    print_data.date_type = this.state.date_type;
    print_data.start_date = formatDateLine(this.state.start_date);
    print_data.end_date = formatDateLine(this.state.end_date);
    print_data.nurse_type = this.state.nurse_type;
    print_data.display_nurse_id = this.state.display_nurse_id;
    print_data.create_flags = this.state.create_flags;
    print_data.department_codes = this.department_codes;
    print_data.ward_master = this.ward_master;
    print_data.nurses_list = this.nurses_list;
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
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', pdf_file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch(() => {
        this.setState({complete_message:""});
      })
  }

  render() {
    let summary_length = 0;
    if(this.state.pageOfItems != null && this.state.pageOfItems.length > 0){
      summary_length = this.state.pageOfItems.length;
    }
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>訪問看護サマリー一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className='flex'>
                  <div className='patient-id-area flex'>
                    <InputWithLabel
                      type="text"
                      label={"患者ID"}
                      getInputText={this.setPatientId.bind(this)}
                      diseaseEditData={this.state.patient_number}
                    />
                    {/* <button style={{marginLeft:'0.5rem'}} onClick={this.getSummaryList.bind(this)}>ID検索</button> */}
                    <Button style={{marginLeft:'0.5rem'}} type="common" onClick={this.getSummaryList.bind(this)}>ID検索</Button>
                  </div>
                  {/* <div className={'select-ward'} style={{marginRight:'3rem;'}}>
                    <SelectorWithLabel
                        options={this.department_codes}
                        title={'診療科'}
                        getSelect={this.getDepartment}
                        departmentEditCode={this.state.department_id}
                    />
                  </div> */}
                  {/* <div className={'select-department'}>
                    <SelectorWithLabel
                      title="病棟"
                      options={this.ward_master}
                      getSelect={this.setWard}
                      departmentEditCode={this.state.first_ward_id}
                    />
                  </div> */}
                  <div className="display-number">
                    <SelectorWithLabel
                      options={this.per_page}
                      title="表示件数"
                      getSelect={this.getDisplayNumber}
                      departmentEditCode={this.state.display_number}
                    />
                  </div>
                </div>
                <div className='flex'>
                  <div className='date-area'>
                    <div className='radio-area'>
                      {/* <Radiobox
                        label={'入院日'}
                        value={1}
                        getUsage={this.selectDateType.bind(this)}
                        checked={this.state.date_type === 1}
                        name="date_type"
                      />
                      <Radiobox
                        label={'診療日'}
                        value = {2}
                        getUsage={this.selectDateType.bind(this)}
                        checked={this.state.date_type === 2}
                        name={`date_type`}
                      />
                      <Radiobox
                        label={'日未定'}
                        value = {0}
                        getUsage={this.selectDateType.bind(this)}
                        checked={this.state.date_type === 0}
                        name={`date_type`}
                      /> */}
                      <Radiobox
                        label={'作成日'}
                        value = {1}
                        getUsage={this.selectDateType.bind(this)}
                        checked={this.state.date_type === 1}
                        name={`date_type`}
                      />
                      <Radiobox
                        label={'全期間'}
                        value = {0}
                        getUsage={this.selectDateType.bind(this)}
                        checked={this.state.date_type === 0}
                        name={`date_type`}
                      />
                    </div>
                    <div className='flex input-date-area' style={{marginRight:"0.5rem"}}>
                      <InputWithLabelBorder
                        label=""
                        type="date"
                        getInputText={this.setDateValue.bind(this,"start_date")}
                        diseaseEditData={this.state.start_date}
                        isDisabled={this.state.date_type === 0}
                      />
                      <span style={{marginLeft:'0.5rem', marginRight:'0.5rem', paddingTop:'0.2rem'}}>～</span>
                      <DatePicker
                        locale="ja"
                        selected={this.state.end_date}
                        onChange={this.setDateValue.bind(this,"end_date")}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={this.state.start_date}
                        disabled={this.state.date_type === 0}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                  </div>
                  {/*<div className='nurse-area'>*/}
                    {/*<div className='radio-area' style={{marginLeft:"0.5rem"}}>*/}
                      {/*<Radiobox*/}
                        {/*label={'担当看護師'}*/}
                        {/*value = {0}*/}
                        {/*getUsage={this.selectNurseType.bind(this)}*/}
                        {/*checked={this.state.nurse_type === 0}*/}
                        {/*name={`nurses`}*/}
                      {/*/>*/}
                      {/*<Radiobox*/}
                        {/*label={'副担当看護師'}*/}
                        {/*value = {1}*/}
                        {/*getUsage={this.selectNurseType.bind(this)}*/}
                        {/*checked={this.state.nurse_type === 1}*/}
                        {/*name={`nurses`}*/}
                      {/*/>*/}
                    {/*</div>*/}
                    {/*<div className='flex select-nurse'>*/}
                      {/*<SelectorWithLabel*/}
                        {/*options={this.nurses_list}*/}
                        {/*title={'表示'}*/}
                        {/*getSelect={this.getNurse.bind(this)}*/}
                        {/*departmentEditCode={this.state.display_nurse_id}*/}
                      {/*/>*/}
                      {/*<button className='clear-button' onClick={this.clearNurse.bind(this)}>C</button>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                  <div className='flex'>
                    <div className='button-area'>
                      <div style={{lineHeight:"2rem", textAlign:"center", marginRight:"0.5rem"}}>状態</div>
                      <Button type="common" onClick={this.setCheckStatusAll.bind(this, 1)}>全選択</Button><br/>
                      <Button type="common" style={{marginTop:'3px'}} onClick={this.setCheckStatusAll.bind(this, 0)}>全解除</Button>
                      {/* <button onClick={this.setCheckStatusAll.bind(this, 1)}>全選択</button><br/>
                      <button onClick={this.setCheckStatusAll.bind(this, 0)}>全解除</button> */}
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
                    {/* <Checkbox
                      label={'未承認'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="approval_categorys"
                      value={(this.state.approval_categorys.includes(0))}
                      number={0}
                    /> */}
                    <br/>
                    <Checkbox
                      label={'作成中'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="create_flags"
                      value={(this.state.create_flags.includes(1))}
                      number={1}
                    />
                    {/* <Checkbox
                      label={'承認済み'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="approval_categorys"
                      value={(this.state.approval_categorys.includes(1))}
                      number={1}
                    /> */}
                    <br/>
                    <Checkbox
                      label={'作成済み'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="create_flags"
                      value={(this.state.create_flags.includes(2))}
                      number={2}
                    />
                    {/* <Checkbox
                      label={'差し戻し'}
                      getRadio={this.setCheckStatus.bind(this)}
                      name="approval_categorys"
                      value={(this.state.approval_categorys.includes(2))}
                      number={2}
                    /> */}
                  </div>
                </div>
                <div className='flex btn-area'>
                  <Button type="common" className={'search-btn'} onClick={this.getSummaryList}>最新表示</Button>
                  <div className={'count-list flex'}>
                    <div>件数： </div>
                    <div className={'count-box'}>&nbsp;{summary_length}</div>
                    <div>件</div>
                  </div>
                  <div className='right-btn flex'>                    
                    {/* <button disabled={(this.state.pageOfItems == null) || (this.state.pageOfItems.length == 0) || (this.state.load_flag == false)} onClick={this.download_csv.bind(this)}>ファイル出力</button> */}
                    <Button type="common" className={'search-btn'} onClick={this.clearSearchCondition.bind(this)}>条件クリア</Button>
                    {/* <button className="" onClick={this.openSaveSearchCondition}>条件保存</button> */}
                  </div>
                </div>
                <div className='list-area'>
                  <table className="table-scroll table table-bordered" id="code-table">
                    <thead>
                      <tr>
                        <th className='no-td'> </th>
                        <th className='id-td'>患者ＩＤ</th>
                        <th className='name-td'>患者氏名</th>
                        {/* <th className='hos-date-td'>入院日</th>
                        <th className='date-td'>退院日（転院）</th>
                        <th className='department-td'>診療科</th>
                        <th className='doctor-td'>主治医</th> */}
                        <th>診断病名</th>
                        <th className='created-td'>作成日時</th>
                        <th className='status-td'>作成状態</th>
                        {/* <th className='status-td'>承認状態</th> */}
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.load_flag ? (
                      <>
                        {this.state.pageOfItems != null && this.state.pageOfItems.length > 0 && (
                          this.state.pageOfItems.map((summary, index)=>{
                            return (
                              <>
                                <tr onContextMenu={e => this.handleClick(e, summary)}>
                                  <td className='no-td'>{index + 1}</td>
                                  <td className='id-td' style={{textAlign:"right"}}>{summary.patient_number}</td>
                                  <td className='name-td'>{summary.patient_name}</td>
                                  {/* <td className='hos-date-td'>{formatDateSlash(summary.date_and_time_of_hospitalization.split('-').join('/'))}</td>
                                  <td className='date-td'>{summary.expected_discharge_date != null ? formatDateSlash(summary.expected_discharge_date.split('-').join('/')) : ""}</td>
                                  <td className='department-td'>{summary.department_name}</td>
                                  <td className='doctor-td'>{summary.main_doctor_name}</td> */}
                                  <td>{summary.disease_name}</td>
                                  <td className='created-td'>
                                    {summary.summary_data != null && summary.summary_data.created_at != null ?
                                      (formatDateSlash(summary.summary_data.created_at.split('-').join('/'))+ " " + formatTimeIE(new Date(summary.summary_data.created_at.split('-').join('/')))) : ""}
                                  </td>
                                  <td className='status-td'>
                                    {summary.summary_data == null ? "未作成" : (summary.summary_data.create_flag == 1) ?
                                      "作成済" : "作成中"}
                                  </td>
                                  {/* <td className='status-td'>
                                    {(summary.summary_data == null || summary.summary_data.create_flag == 0) ? "" : (summary.summary_data.approval_category == 0)
                                      ? "未承認" : ((summary.summary_data.approval_category == 1) ? "承認済み" : "差し戻し")}
                                  </td> */}
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
                <Pagination
                  items={this.state.summary_list}
                  onChangePage={this.onChangePage.bind(this)}
                  pageSize = {this.state.display_number}
                />
                </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
            <Button className={(((this.state.pageOfItems == null) || (this.state.pageOfItems.length == 0) || (this.state.load_flag == false)) ? 'disable-btn' : 'red-btn')} onClick={this.download_pdf.bind(this)}>一覧印刷</Button>
          </Modal.Footer>
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
          {this.state.isOpenSummaryAgreeModal && (
            <NurseSummaryAgreeModal
              closeModal ={this.closeModal}
              summary_info={this.state.summary_info}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          <HoverMenu
            {...this.state.HoverMenu}
            parent={this}
          />
          {this.state.isOpenDischargeTransferNursingSummary && (
            <DischargeTransferNursingSummary
              closeModal ={this.closeModal}
            />
          )}
          {this.state.isOpenNursingSummary && (
            <VisitNurseSummaryModal
              closeModal ={this.closeModal}
              modal_data={this.state.summary_info}
              handleOk = {this.getSummaryList}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isOpenSaveSearchCondition && (
            <SaveSearchCondition
              closeModal ={this.closeModal}
              setCondition ={this.setCondition}
            />
          )}
        </Modal>
      </>
    );
  }
}

VisitNurseSummaryList.contextType = Context;
VisitNurseSummaryList.propTypes = {
  closeModal: PropTypes.func,
};

export default VisitNurseSummaryList;

