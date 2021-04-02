import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatTimeIE, formatDateSlash} from "~/helpers/date";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
registerLocale("ja", ja);
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NurseProblemFocusSelect from "./NurseProblemFocusSelect";
import EndoscopeEditModal from "~/components/templates/Patient/Modals/Common/EndoscopeEditModal";
import FocusNursePlan from "./FocusNursePlan";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import {addRedBorder, removeRedBorder, setDateColorClassName} from '~/helpers/dialConstants'
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import SystemConfirmWithBtnModal from "~/components/molecules/SystemConfirmWithBtnModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import axios from "axios/index";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 .flex{
  display: flex;
 }
 .div-title {
   height:2rem;
   line-height:2rem;
   width:5rem;
 }
 .div-value {
   height:2rem;
   line-height:2rem;
   padding:0 0.3rem;
 }
 .div-border {
   border:1px solid #aaa;
 }
 .react-datepicker{
   width: 150% !important;
   font-size: 1.25rem;
   .react-datepicker__month-container{
     width:79% !important;
     height:24.375rem;
   }
   .react-datepicker__navigation--previous{
     right: 0.5rem !important;
   }
   .react-datepicker__navigation--next--with-time {
      right: 7rem !important;
   }
   .react-datepicker__time-container{
     width:21% !important;
   }
   .react-datepicker__time-box{
     width:auto !important;
   }
   .react-datepicker__current-month{
     font-size: 1.25rem;
   }
   .react-datepicker__day-names, .react-datepicker__week{
     display: flex;
     justify-content: space-between;
   }
   .react-datepicker__month{
     .react-datepicker__week{
       margin-bottom:0.25rem;
     }
   }
 }
 .react-datepicker-wrapper {
   input {
    height: 2rem;
    width: 9rem;
    font-size:1rem;
    cursor:pointer;
   }
 }
 .check-area {
   label {
    font-size: 1rem;
    line-height: 2rem;
    height: 2rem;
    margin-bottom: 0;
   }
 }
 .no-margin {
   div {margin-top:0;}
 }
 .input-area {
   .label-title {
     display:none;
   }
   input {
    height:2rem;
    margin-left: 0.3rem;
    width: 20rem;
   }
 }
 .table-area {
   width: 100%;
   margin-top:0.5rem;
   .table-title {
      width: 100%;
      text-align: left;
      font-size: 1rem;
   }
  .input-td {
    width:15rem;
    padding:0 !important;
    div {
      margin-top:0;
      width:calc(15rem - 1px);
    }
    .label-title {display:none;}
    input {
      width:100%;
      height: 2rem;
    }
  }
  .edit-row {
    color:#F00;
    background-color:#FF0;
    input, select {
      color:#F00;
      background-color:#FF0;
    }
  }
  .td-btn {
    width:3rem;
    .div-button{
      border: 2px solid rgb(126, 126, 126) !important;
      width: 100%;
      height: 2rem;
      line-height: 2rem;    
      background: rgb(239, 239, 239);
      cursor: pointer;
    }
   }
   .td-select-date {
    .react-datepicker-wrapper {
      width:100%;
      .react-datepicker__input-container {
        width:100%;
        input {
          width:100%;
          border:none;
        }
      }
    }
   } 
   .table-head {
      border:1px solid #dee2e6;
      width:100%;
      background-color: #a0ebff;
      .menu {
        border-right:1px solid #dee2e6;
        text-align:center;
        height:2rem;
        line-height:2rem;
      }
      .td-updated_by {
        width: calc(100% - 17px - 81rem);
      }
      .td-last {
        width: 17px;
        border-right: none;
      }
   }
   .table-body {
      width:100%;
      border:1px solid #dee2e6;
      border-top:none;
      overflow-y: scroll;
      height: 15.5vh;
      .div-tr {
        width:100%;
        border-bottom:1px solid #dee2e6;
      }
      .div-tr:nth-child(even) {background-color: #f2f2f2;}
      .div-tr:hover{background-color:#e2e2e2 !important;}
      .new-tr {
        text-align:center;
        height:2rem;
        line-height:2rem;
        cursor:"pointer";
      }
     .div-td {
       border-right:1px solid #dee2e6;
       padding: 0 0.25rem;
       word-break: break-all;
       vertical-align: middle;
       line-height: 2rem;
       .pullbox {
         .pullbox-title {display: none !important;}
         .pullbox-label {
           width:100%;
           margin-bottom: 0;
           .pullbox-select {
             width:100%;
             height:2rem;
           }
         }
       }
     }
    .td-updated_by {
      border-right: none;
      width: calc(100% - 81rem);
    }
   }
   .td-no {
      width:3rem;
    }
    .td-record_date{
      width:9rem;
    }
    .td-problem_number {
      width:5rem;
    }
    .td-nursing_problem_focus{
      width:15rem;
    }
    .td-nursing_record_class_id {
      width:7rem;
    }
    .td-article {
      width:15rem;
    }
    .td-schema_data{
      width:5rem;
    }
    .td-created_by{
      width:13rem;
    }
 }
  .input-user {
    .div-title{
      text-align:center;
    }
    .clear-btn {
      min-width: 2rem;
      height: 2rem;
      line-height: 2rem;
      padding: 0.05rem 0 0 0.2rem;
      margin-left: 0.5rem;
      span {font-size:1rem;}
    }
 }
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
      font-size: 16px;
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

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenu = ({visible, x, y, class_name, soap_p=false, parent}) => {
  if (visible) {
    let type = class_name.split(':')[0];
    let index = parseInt(class_name.split(':')[1]);
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {type == "last-row" ? (
            <>
              <li><div onClick={() => parent.contextMenuAction("copy", index, "soap_focus_records")}>コピー</div></li>
              <li><div onClick={() => parent.contextMenuAction("paste", index, "soap_focus_records")}>貼り付け</div></li>
              {soap_p && (
                <li><div onClick={() => parent.contextMenuAction("plan", index, "soap_focus_records")}>計画</div></li>
              )}
              <li><div onClick={() => parent.contextMenuAction("last_cancel", index)}>取消</div></li>
            </>
          ):(
            <>
              <li><div onClick={() => parent.contextMenuAction("add_row", index)}>行追加</div></li>
              <li><div onClick={() => parent.contextMenuAction("delete_row", index)}>行削除</div></li>
              <li><div onClick={() => parent.contextMenuAction("copy", index, "current_soap_focus")}>コピー</div></li>
              <li><div onClick={() => parent.contextMenuAction("paste", index, "current_soap_focus")}>貼り付け</div></li>
              <li><div onClick={() => parent.contextMenuAction("plan", index, "current_soap_focus")}>計画</div></li>
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class SoapFocus extends Component {
  constructor(props) {
    super(props);
    let cur_date = new Date();
    cur_date.setDate(cur_date.getDate() - 2 * 7);
    this.state = {
      start_date_time:cur_date,
      end_date_time:new Date(),
      classfic_soap:0,
      classfic_dactr:0,
      nursing_problem_focus:"",
      article:"",
      soap_focus_records:[],
      soap_check_data:[],
      soap_check_flags:[],
      dactr_check_data:[],
      dactr_check_flags:[],
      alert_type:"",
      alert_messages:"",
      hos_number:0,
      nursing_record_class_master:[],
      openNurseProblemFocusSelect:false,
      last_index:-1,
      created_name:"",
      created_by:0,
      openSchema:false,
      openFocusNursePlan:false,
      schema_data:null,
      current_soap_focus:[],
      confirm_message:"",
      confirm_type:"",
      complete_message:"",
      check_message:"",
      load_flag:false,
      load_data:true,
      isOpenStaffList:false,
      close_confirm_message:"",
      confirm_alert_title:"",
    };
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.user_name = authInfo.name;
    this.init_soap_focus_records = [];
    this.copy_article = "";
    this.first_tag_id = "";
  }
  
  async componentDidMount() {
    await this.getStaffList();
    await this.getSoapFocusData();
    await this.searchSoapFocusRecord();
    document.getElementById("main_area").focus();
  }

  getSoapFocusData=async()=>{
    let path = "/app/api/v2/nursing_service/get/soap_focus_data";
    let post_data = {
      patient_id:this.props.patientId
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.error_message != undefined){
          this.setState({
            alert_messages:res.error_message,
            alert_type:"modal_close",
          });
        } else {
          let nursing_record_class_master = [{id:0, value:"", record_class:0}];
          if(res['soap'].length > 0){
            res['soap'].map(item=>{
              nursing_record_class_master.push({id:item.number, value:item.name, record_class:item.record_class});
            })
          }
          if(res['dactr'].length > 0){
            res['dactr'].map(item=>{
              nursing_record_class_master.push({id:item.number, value:item.name, record_class:item.record_class});
            })
          }
          this.setState({
            hos_number:res.hos_number,
            soap_check_data:res['soap'],
            dactr_check_data:res['dactr'],
            nursing_record_class_master,
            load_flag:true,
          });
        }
      })
      .catch(() => {

      });

  }

  getStaffList=async()=>{
    await apiClient.get("/app/api/v2/secure/staff/search?")
      .then((res) => {
        this.setState({
          staffs: res,
        });
      });
  }

  setPeriod=(key,value)=>{
    if(value == "" || value == null){
      value = new Date();
    }
    this.setState({[key]:value});
  };

  getCheckedDm = (name, number) => {
    if (name == "soap"){
      let soap_check_flags = this.state.soap_check_flags;
      let index = soap_check_flags.indexOf(number);
      let classfic_soap = 0;
      if(index === -1){
        soap_check_flags.push(number);
      } else {
        soap_check_flags.splice(index, 1);
      }
      if(soap_check_flags.length == this.state.soap_check_data.length){
        classfic_soap = 1;
      }
      this.setState({
        soap_check_flags,
        classfic_soap,
      });
    } else {
      let dactr_check_flags = this.state.dactr_check_flags;
      let index = dactr_check_flags.indexOf(number);
      let classfic_dactr = 0;
      if(index === -1){
        dactr_check_flags.push(number);
      } else {
        dactr_check_flags.splice(index, 1);
      }
      if(dactr_check_flags.length == this.state.dactr_check_data.length){
        classfic_dactr = 1;
      }
      this.setState({
        dactr_check_flags,
        classfic_dactr,
      });
    }
  };

  setclassficChecked = (name, value) => {
    if (name == "classfic_soap"){
      let soap_check_flags = [];
      if(value == 1){
        if(this.state.soap_check_data.length > 0){
          this.state.soap_check_data.map(item=>{
            soap_check_flags.push(item.number);
          })
        }
      }
      this.setState({
        [name]: value,
        soap_check_flags,
      });
    } else {
      this.setState({
        [name]: value,
        dactr_d:value,
        dactr_act:value,
        dactr_r:value,
      });
      let dactr_check_flags = [];
      if(value == 1){
        if(this.state.dactr_check_data.length > 0){
          this.state.dactr_check_data.map(item=>{
            dactr_check_flags.push(item.number);
          })
        }
      }
      this.setState({
        [name]: value,
        dactr_check_flags,
      });
    }
  };

  setComment=(key, e)=>{
    this.setState({[key]: e.target.value});
  }

  searchSoapFocusRecord=async(type=null)=>{
    if(this.state.load_data){
      this.setState({
        load_data:false,
        close_confirm_message:"",
      });
    }
    let path = "/app/api/v2/nursing_service/search/soap_focus_record";
    let post_data = {
      hos_number:this.state.hos_number,
      start_date_time:(this.state.start_date_time != null && this.state.start_date_time !== "") ? (formatDateLine(this.state.start_date_time)+' '+formatTimeIE(this.state.start_date_time)) : "",
      end_date_time:(this.state.end_date_time != null && this.state.end_date_time !== "") ? (formatDateLine(this.state.end_date_time)+' '+formatTimeIE(this.state.end_date_time)) : "",
      soap:this.state.soap_check_flags,
      dactr:this.state.dactr_check_flags,
      nursing_problem_focus:this.state.nursing_problem_focus,
      article:this.state.article,
      created_by:this.state.created_by,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.init_soap_focus_records = JSON.parse(JSON.stringify(res));
        this.setState({
          soap_focus_records:res,
          load_data:true,
          close_confirm_message:type == "save_confirm" ? "保存しました。\n入力画面を閉じますか？" : "",
          current_soap_focus:[],
        });
      })
      .catch(() => {

      });
  };

  closeModal = (act) => {
    if(this.state.alert_type == "modal_close" || act == "modal_close"){
      this.props.closeModal();
    } else {
      let state_data = {
        alert_messages: "",
        confirm_message: "",
        confirm_type: "",
        check_message: "",
        complete_message: "",
        close_confirm_message: "",
        confirm_alert_title: "",
        openNurseProblemFocusSelect: false,
        openSchema: false,
        openFocusNursePlan: false,
        isOpenStaffList: false,
      };
      this.setState(state_data);
    }
    if(this.first_tag_id != ""){
      $("#" + this.first_tag_id).focus();
      this.first_tag_id = "";
    } else {
      document.getElementById("main_area").focus();
    }
  }

  handleClick=(e, class_name, record_data=null)=>{
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
      let tr_height = document.getElementsByClassName(class_name)[0].offsetHeight;
      let soap_p = false;
      if(class_name.split(':')[0] == "last-row"){
        let master_data = this.state.nursing_record_class_master;
        if(master_data.find((x) => x.id == record_data.nursing_record_class_id) != undefined && master_data.find((x) => x.id == record_data.nursing_record_class_id).value == "P"){
          soap_p = true;
        }
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 100,
          y: e.clientY + window.pageYOffset - tr_height*2,
          class_name,
          soap_p
        },
      })
    }
  };

  contextMenuAction = (act, value, name) => {
    let soap_focus_records = this.state.soap_focus_records;
    let current_soap_focus = this.state.current_soap_focus;
    if(act == "last_cancel"){
      soap_focus_records[value] = this.init_soap_focus_records[value];
      this.setState({soap_focus_records});
    } else if(act == "copy"){
      this.copy_article = this.state[name][value]['article'];
    } else if(act == "paste"){
      let records_data = this.state[name];
      records_data[value]['article'] = this.copy_article;
      records_data[value]['edit_flag'] = 1;
      this.setState({[name]:records_data});
    } else if(act == "plan"){
      let problem_focus_classification = "#";
      let master_data = this.state.nursing_record_class_master;
      let records_data = this.state[name];
      if(master_data.find((x) => x.id == records_data[value]['nursing_record_class_id']) != undefined){
        if(master_data.find((x) => x.id == records_data[value]['nursing_record_class_id']).record_class == 2){
          problem_focus_classification = "F";
        }
      }
      this.setState({
        seleted_row:name+":"+value,
        problem_focus_classification,
        openFocusNursePlan:true,
      });
    } else if(act == "add_row"){
      let tmp_current_soap_focus = [];
      current_soap_focus.map((item, index)=>{
        tmp_current_soap_focus.push(item);
        if(index == value){
          tmp_current_soap_focus.push({problem_number:null, nursing_problem_focus:"", nursing_record_class_id:0, article:"", schema_data:null});
        }
      })
      this.setState({current_soap_focus:tmp_current_soap_focus});
    } else if(act == "delete_row"){
      this.setState({
        confirm_message:"削除しますか？",
        confirm_type:"delete",
        current_index:value
      });
    }
  }

  addSoapFocus=()=>{
    let current_soap_focus = this.state.current_soap_focus;
    current_soap_focus.push({problem_number:null, nursing_problem_focus:"", nursing_record_class_id:0, article:"", schema_data:null});
    this.setState({current_soap_focus});
  }

  setNursingRecordClass =(value, e)=>{
    let name = value.split(':')[0];
    let index = value.split(':')[1];
    let records_data = this.state[name];
    records_data[index]['nursing_record_class_id'] = parseInt(e.target.id);
    records_data[index]['edit_flag'] = 1;
    this.setState({[name]:records_data});
  }

  setRecordDateToday=(index, name)=>{
    let records_data = this.state[name];
    let record_date = formatDateSlash(new Date())+' '+formatTimeIE(new Date())+":00";
    records_data[index]['record_date'] = record_date;
    records_data[index]['edit_flag'] = 1;
    this.setState({[name]:records_data}, ()=>{
      document.getElementById("main_area").focus();
    });
  }

  openNurseProblemFocusSelect=(index, name)=>{
    let record_data = this.state[name][index];
    if(record_data.nursing_record_class_id == 0 || record_data.nursing_record_class_id == null){
      return
    }
    let master_data = this.state.nursing_record_class_master;
    if(master_data.find((x) => x.id == record_data.nursing_record_class_id) != undefined){
      if(master_data.find((x) => x.id == record_data.nursing_record_class_id).record_class == 1){
        this.setState({
          seleted_row:name+":"+index,
          modal_type:"problem",
          openNurseProblemFocusSelect:true,
        });
      } else if(master_data.find((x) => x.id == record_data.nursing_record_class_id).record_class == 2){
        this.setState({
          seleted_row:name+":"+index,
          modal_type:"focus",
          openNurseProblemFocusSelect:true,
        });
      }
    }
  }

  setProblem=(data)=>{
    let name = this.state.seleted_row.split(":")[0];
    let index = this.state.seleted_row.split(":")[1];
    let records_data = this.state[name];
    if(this.state.modal_type == "problem"){
      records_data[index]['problem_number'] = data.problem_number;
    } else {
      records_data[index]['problem_number'] = null;
    }
    records_data[index]['nursing_problem_focus'] = data.name;
    records_data[index]['edit_flag'] = 1;
    this.setState({
      [name]:records_data,
      openNurseProblemFocusSelect:false,
    });
  }

  setNursingProblemFocus=(value, e)=>{
    let name = value.split(':')[0];
    let index = value.split(':')[1];
    let records_data = this.state[name];
    records_data[index]['nursing_problem_focus'] = e.target.value;
    records_data[index]['edit_flag'] = 1;
    this.setState({[name]:records_data});
  }

  setArticle=(value, e)=>{
    let name = value.split(':')[0];
    let index = value.split(':')[1];
    let records_data = this.state[name];
    records_data[index]['article'] = e.target.value;
    records_data[index]['edit_flag'] = 1;
    this.setState({[name]:records_data});
  }

  openSchema=(index, name)=>{
    this.setState({
      seleted_row:name+":"+index,
      schema_data:this.state[name][index]['schema_data'],
      openSchema:true
    });
  }

  setSchema = (img_base64) => {
    let name = this.state.seleted_row.split(":")[0];
    let index = this.state.seleted_row.split(":")[1];
    let records_data = this.state[name];
    records_data[index]['schema_data'] = img_base64;
    records_data[index]['edit_flag'] = 1;
    this.setState({
      [name]:records_data,
      openSchema: false
    });
  }

  checkChangeStatus=(index, key=null)=>{
    let soap_focus_records = this.state.soap_focus_records;
    if(key == null){
      let change_flag = false;
      Object.keys(soap_focus_records[index]).map(column=>{
        if(soap_focus_records[index][column] != this.init_soap_focus_records[index][column]){
          change_flag = true;
        }
      });
      return change_flag;
    }
    if(soap_focus_records[index][key] != this.init_soap_focus_records[index][key]){
      return true;
    } else {
      return false;
    }
  }

  setRecordData=(data)=>{
    let name = this.state.seleted_row.split(':')[0];
    let index = this.state.seleted_row.split(':')[1];
    let records_data = this.state[name];
    records_data[index]['problem_number'] = data.problem_number;
    records_data[index]['nursing_problem_focus'] = data.name;
    records_data[index]['article'] = data.article;
    records_data[index]['edit_flag'] = 1;
    this.setState({
      [name]:records_data,
      openFocusNursePlan:false,
    });
  }

  confirmSave=()=>{
    this.setState({
      confirm_message:"登録しますか？",
      confirm_type:"register",
    });
  }

  confirmOk=()=>{
    if(this.state.confirm_type == "delete"){
      let tmp_current_soap_focus = [];
      this.state.current_soap_focus.map((item, index)=>{
        if(index != this.state.current_index){
          tmp_current_soap_focus.push(item);
        }
      });
      this.setState({
        current_soap_focus:tmp_current_soap_focus,
        confirm_message:"",
        confirm_type:""
      });
    }
    if(this.state.confirm_type == "register"){
      let check_message = [];
      let first_tag_id = "";
      if(this.state.soap_focus_records.length > 0){
        this.state.soap_focus_records.map((item, index)=>{
          removeRedBorder("nursing_problem_focus-last-"+index);
          removeRedBorder("nursing_record_class_id-last-"+index);
          removeRedBorder("article-last-"+index);
          if(item['edit_flag'] == 1){
            if(item['nursing_problem_focus'] == ""){
              check_message.push("過去記述一覧の"+(index+1)+"番目の行の看護問題 / フォーカスを入力してください。");
              addRedBorder("nursing_problem_focus-last-"+index);
              if(first_tag_id == ""){
                first_tag_id = "nursing_problem_focus-last-"+index;
              }
            }
            if(item['nursing_record_class_id'] == 0){
              check_message.push("過去記述一覧の"+(index+1)+"番目の行の看護記録区分を選択してください。");
              addRedBorder("nursing_record_class_id-last-"+index);
              if(first_tag_id == ""){
                first_tag_id = "nursing_record_class_id-last-"+index;
              }
            }
            if(item['article'] == 0){
              check_message.push("過去記述一覧の"+(index+1)+"番目の行の記事を入力してください。");
              addRedBorder("article-last-"+index);
              if(first_tag_id == ""){
                first_tag_id = "article-last-"+index;
              }
            }
          }
        });
      }
      if(this.state.current_soap_focus.length > 0){
        this.state.current_soap_focus.map((item, index)=>{
          removeRedBorder("record_date-current-"+index);
          removeRedBorder("nursing_problem_focus-current-"+index);
          removeRedBorder("nursing_record_class_id-current-"+index);
          removeRedBorder("article-current-"+index);
          if(item['record_date'] == undefined || item['record_date'] == null){
            check_message.push("今回記述一覧の"+(index+1)+"番目の行の記録日時を入力してください。");
            addRedBorder("record_date-current-"+index);
            if(first_tag_id == ""){
              first_tag_id = "record_date-current-"+index;
            }
          }
          if(item['nursing_problem_focus'] == ""){
            check_message.push("今回記述一覧の"+(index+1)+"番目の行の看護問題 / フォーカスを入力してください。");
            addRedBorder("nursing_problem_focus-current-"+index);
            if(first_tag_id == ""){
              first_tag_id = "nursing_problem_focus-current-"+index;
            }
          }
          if(item['nursing_record_class_id'] == 0){
            check_message.push("今回記述一覧の"+(index+1)+"番目の行の看護記録区分を選択してください。");
            addRedBorder("nursing_record_class_id-current-"+index);
            if(first_tag_id == ""){
              first_tag_id = "nursing_record_class_id-current-"+index;
            }
          }
          if(item['article'] == 0){
            check_message.push("今回記述一覧の"+(index+1)+"番目の行の記事を入力してください。");
            addRedBorder("article-current-"+index);
            if(first_tag_id == ""){
              first_tag_id = "article-current-"+index;
            }
          }
        });
      }
      if(check_message.length > 0){
        this.first_tag_id = first_tag_id;
        this.setState({
          confirm_message:"",
          confirm_type:"",
          check_message:check_message.join('\n'),
        });
      } else {
        this.register();
      }
    }
    if(this.state.confirm_type == "clear_user"){
      this.setState({
        created_by:0,
        created_name:'',
        confirm_message:"",
        confirm_type:""
      });
    }
    if(this.state.confirm_type == "close_modal"){
      this.props.closeModal();
    }
  }

  register=async()=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      complete_message:"登録中"
    });
    let path = "/app/api/v2/nursing_service/register/soap_focus";
    let post_data = {
      hos_number:this.state.hos_number,
      patient_id:this.props.patientId,
      last_data:this.state.soap_focus_records,
      current_data:this.state.current_soap_focus,
      patient_number:this.props.patientInfo.receId
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.success_message != undefined){
          this.searchSoapFocusRecord("save_confirm");
        } else if(res.error_message != undefined){
          this.setState({
            complete_message:"",
            alert_messages:res.error_message
          });
        }
      })
      .catch(() => {

      });
  }

  openStaffList = () => {
    this.setState({isOpenStaffList: true});
  };

  selectStaff=(staff)=>{
    this.setState({
      created_by:staff.number,
      created_name:staff.name,
      isOpenStaffList:false,
    });
  }

  confirmClearUser=()=>{
    if(this.state.created_by == 0){
      return;
    }
    this.setState({
      confirm_message:"作成者をクリアしますか？",
      confirm_type:"clear_user",
      confirm_title:"クリア確認"
    });
  }

  setRecordDate=(key,value)=>{
    let name = key.split(':')[0];
    let index = key.split(':')[1];
    let records_data = this.state[name];
    let record_date = value != null ? (formatDateSlash(value)+' '+formatTimeIE(value)+":00") : null;
    records_data[index]['record_date'] = record_date;
    records_data[index]['edit_flag'] = 1;
    this.setState({[name]:records_data});
  };

  setDatePickerTop=(class_name, index)=>{
    let thead = $(".thead-area");
    let tr_obj = document.getElementsByClassName(class_name+":"+index)[0];
    if (thead.length > 0 && tr_obj != undefined && tr_obj != null) {
      let datepicker_obj = document.getElementsByClassName(class_name+":"+index)[0].getElementsByClassName("react-datepicker-popper")[0];
      if(datepicker_obj != undefined && datepicker_obj != null){
        let theadHight = $(thead[0]).height();
        let tr_top = tr_obj.offsetTop;
        datepicker_obj.style['top'] = theadHight+tr_top;
      }
    }
  }

  closeConfirmModal=()=>{
    let change_flag = 0;
    this.state.soap_focus_records.map(item=>{
      if(item.edit_flag != undefined && item.edit_flag == 1){
        change_flag = 1;
      }
    });
    if(change_flag == 0 && this.state.current_soap_focus.length > 0){
      change_flag = 1;
    }
    if(change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close_modal",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }
  
  get_title_pdf = async () => {
    let pdf_file_name = "状態一括登録_"+this.props.patientInfo.receId+"_";
    pdf_file_name = pdf_file_name + formatDateLine(this.state.start_date_time).split("-").join("")+formatTimeIE(this.state.start_date_time).split(":").join("")
      + "-" + formatDateLine(this.state.end_date_time).split("-").join("")+formatTimeIE(this.state.end_date_time).split(":").join("");
    return pdf_file_name+".pdf";
  }
  
  printList=async()=>{
    if (this.state.soap_focus_records.length === 0 || this.state.load_data == false){
      return;
    }
    this.setState({complete_message:"印刷中"});
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/nursing_service/print/soap_focus";
    let print_data = {
      soap_focus_records:this.state.soap_focus_records,
      receId:this.props.patientInfo.receId,
      name:this.props.patientInfo.name,
      date:formatDateSlash(this.state.start_date_time)+" "+formatTimeIE(this.state.start_date_time)
      + "～" + formatDateSlash(this.state.end_date_time)+" "+formatTimeIE(this.state.end_date_time),
      created_name:this.state.created_name,
      nursing_record_class_master:this.state.nursing_record_class_master,
      soap_check_data:this.state.soap_check_data,
      soap_check_flags:this.state.soap_check_flags,
      dactr_check_data:this.state.dactr_check_data,
      dactr_check_flags:this.state.dactr_check_flags,
      nursing_problem_focus:this.state.nursing_problem_focus,
      article:this.state.article,
    };
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
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  }

  render() {
    let change_flag = 0;
    this.state.soap_focus_records.map(item=>{
      if(item.edit_flag != undefined && item.edit_flag == 1){
        change_flag = 1;
      }
    });
    if(change_flag == 0 && this.state.current_soap_focus.length > 0){
      change_flag = 1;
    }
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal soap-focus-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>ＳＯＡＰ＆フォーカス</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper id={'main_area'}>
                {this.state.load_flag ? (
                  <>
                    <div className={'flex'}>
                      <div className={'div-title'}>患者ID :</div>
                      <div className={'div-value'} style={{minWidth:"6rem"}}>{this.props.patientInfo.receId}</div>
                      <div className={'div-title'}>患者氏名 :</div>
                      <div className={'div-value'}>{this.props.patientInfo.name}</div>
                    </div>
                    <div className={'flex'}>
                      <div className={'flex select-period'}>
                        <div className={'div-title'}>記録日時</div>
                        <DatePicker
                          locale="ja"
                          selected={this.state.start_date_time}
                          onChange={this.setPeriod.bind(this,"start_date_time")}
                          dateFormat="yyyy/MM/dd HH:mm"
                          timeCaption="時間"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={10}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                        <div className={'div-value'}>~</div>
                        <DatePicker
                          locale="ja"
                          selected={this.state.end_date_time}
                          onChange={this.setPeriod.bind(this,"end_date_time")}
                          dateFormat="yyyy/MM/dd HH:mm"
                          timeCaption="時間"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={10}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                      <div className={'no-margin input-user flex'}>
                        <div className={'div-title'}>作成者</div>
                        <div className='div-value div-border' style={{width:"20rem", cursor:"pointer"}} onClick={this.openStaffList.bind(this)}>
                          {this.state.created_name == "" ? "クリックで選択" : this.state.created_name}
                        </div>
                        <Button type={'mono'} className={'clear-btn'} onClick={this.confirmClearUser.bind(this)}>C</Button>
                      </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"0.5rem"}}>
                      <div className={'check-area'}>
                        <div>
                          <Checkbox
                            label="SOAP"
                            getRadio={this.setclassficChecked.bind(this)}
                            value={this.state.classfic_soap === 1}
                            name="classfic_soap"
                          />
                        </div>
                        <div className={'flex'} style={{paddingLeft:"1.5rem"}}>
                          {this.state.soap_check_data.length > 0 && (
                            this.state.soap_check_data.map(item=>{
                              return (
                                <>
                                  <Checkbox
                                    label={item.name}
                                    getRadio={this.getCheckedDm.bind(this)}
                                    value={(this.state.soap_check_flags.includes(item.number))}
                                    number={item.number}
                                    name={"soap"}
                                  />
                                </>
                              )
                            })
                          )}
                        </div>
                        <div style={{marginTop:"0.5rem"}}>
                          <Checkbox
                            label="DActR"
                            getRadio={this.setclassficChecked.bind(this)}
                            value={this.state.classfic_dactr === 1}
                            name="classfic_dactr"
                          />
                        </div>
                        <div className={'flex'} style={{paddingLeft:"1.5rem"}}>
                          {this.state.dactr_check_data.length > 0 && (
                            this.state.dactr_check_data.map(item=>{
                              return (
                                <>
                                  <Checkbox
                                    label={item.name}
                                    getRadio={this.getCheckedDm.bind(this)}
                                    value={(this.state.dactr_check_flags.includes(item.number))}
                                    number={item.number}
                                    name={"dactr"}
                                  />
                                </>
                              )
                            })
                          )}
                        </div>
                      </div>
                      <div className={'input-area'}>
                        <div className={'div-value'}>看護問題 / フォーカス</div>
                        <div className={'no-margin'}>
                          <InputWithLabel
                            type="text"
                            getInputText={this.setComment.bind(this, 'nursing_problem_focus')}
                            diseaseEditData={this.state.nursing_problem_focus}
                          />
                        </div>
                        <div className={'div-value'} style={{marginTop:"0.5rem"}}>記事</div>
                        <div className={'no-margin'}>
                          <InputWithLabel
                            type="text"
                            getInputText={this.setComment.bind(this, 'article')}
                            diseaseEditData={this.state.article}
                          />
                        </div>
                      </div>
                    </div>
                    <div><button style={{height:"2rem", marginTop:"0.5rem"}} onClick={this.searchSoapFocusRecord}>最新表示</button></div>
                    <div className={'table-area'}>
                      <div className={'table-title'}>過去記述</div>
                      <div className={'table-head flex'}>
                        <div className={'menu td-no'}> </div>
                        <div className={'menu td-record_date'}>記録日時</div>
                        <div className={'menu td-btn'}>現在</div>
                        <div className={'menu td-problem_number'}>問題番号</div>
                        <div className={'menu td-nursing_problem_focus'}>看護問題/フォーカス</div>
                        <div className={'menu td-btn'}>選択</div>
                        <div className={'menu td-nursing_record_class_id'}>SOAP/DActR</div>
                        <div className={'menu td-article'}>記事</div>
                        <div className={'menu td-schema_data'}>シェーマ</div>
                        <div className={'menu td-btn'}>情報</div>
                        <div className={'menu td-created_by'}>作成者</div>
                        <div className={'menu td-updated_by'}>更新者</div>
                        <div className={'menu td-last'}> </div>
                      </div>
                      <div className={'table-body'}>
                        {this.state.load_data ? (
                          <>
                            {this.state.soap_focus_records.length > 0 && (
                              this.state.soap_focus_records.map((item, index)=>{
                                return (
                                  <>
                                    <div key={index} className={'flex div-tr last-row:'+index} onContextMenu={e => this.handleClick(e, ('last-row:'+index), item)}>
                                      <div style={{width:"3rem"}} className={'text-right div-td td-no'}>{index + 1}</div>
                                      <div
                                        style={{width:"9rem", padding:0}}
                                        className={"div-td td-record_date td-select-date " + (this.checkChangeStatus(index, "record_date") ? "edit-row" : "")}
                                        // onClick={this.setDatePickerTop.bind(this, 'last-row', index)}
                                      >
                                        <DatePicker
                                          locale="ja"
                                          id={'record_date-last-'+index}
                                          selected={(item.record_date != undefined && item.record_date != null) ? new Date(item.record_date.split("-").join("/")) : ""}
                                          onChange={this.setRecordDate.bind(this,"soap_focus_records:"+index)}
                                          dateFormat="yyyy/MM/dd HH:mm"
                                          timeCaption="時間"
                                          showTimeSelect
                                          timeFormat="HH:mm"
                                          timeIntervals={10}
                                          showMonthDropdown
                                          showYearDropdown
                                          dropdownMode="select"
                                          dayClassName = {date => setDateColorClassName(date)}
                                        />
                                      </div>
                                      <div style={{padding:0}} className={'td-btn div-td'}>
                                        <div className={'div-button'} onClick={this.setRecordDateToday.bind(this, index, 'soap_focus_records')}>&nbsp;</div>
                                      </div>
                                      <div style={{width:"5rem"}} className={'div-td td-problem_number'}>{item.problem_number != null ? ("#"+item.problem_number) : "" }</div>
                                      <div className={'div-td td-nursing_problem_focus input-td ' + (this.checkChangeStatus(index, "nursing_problem_focus") ? "edit-row" : "")}>
                                        <InputWithLabelBorder
                                          id={'nursing_problem_focus-last-'+index}
                                          type="text"
                                          getInputText={this.setNursingProblemFocus.bind(this, "soap_focus_records:"+index)}
                                          diseaseEditData={item.nursing_problem_focus}
                                        />
                                      </div>
                                      <div style={{padding:0}} className={'td-btn div-td'}>
                                        <div className={'div-button'} onClick={this.openNurseProblemFocusSelect.bind(this, index, "soap_focus_records")}>&nbsp;</div>
                                      </div>
                                      <div style={{width:"7rem", padding:0}} className={"div-td td-nursing_record_class_id " + (this.checkChangeStatus(index, "nursing_record_class_id") ? "edit-row" : "")}>
                                        <SelectorWithLabel
                                          id={"nursing_record_class_id-last-"+index}
                                          options={this.state.nursing_record_class_master}
                                          title=""
                                          getSelect={this.setNursingRecordClass.bind(this, "soap_focus_records:"+index)}
                                          departmentEditCode={item.nursing_record_class_id}
                                        />
                                      </div>
                                      <div className={'div-td td-article input-td ' + (this.checkChangeStatus(index, "article") ? "edit-row" : "")}>
                                        <InputWithLabelBorder
                                          id={'article-last-'+index}
                                          type="text"
                                          getInputText={this.setArticle.bind(this, "soap_focus_records:"+index)}
                                          diseaseEditData={item.article}
                                        />
                                      </div>
                                      <div style={{width:"5rem"}} className={'div-td td-schema_data ' + (this.checkChangeStatus(index, "schema_data") ? "edit-row" : "")}>
                                        {item.schema_data != null ? "情報あり" : ""}
                                      </div>
                                      <div style={{padding:0}} className={'td-btn div-td'}>
                                        <div className={'div-button'} onClick={this.openSchema.bind(this, index, "soap_focus_records")}>&nbsp;</div>
                                      </div>
                                      <div style={{width:"13rem"}} className={'div-td td-created_by'}>{item.created_by_name}</div>
                                      <div className={'div-td td-updated_by'}>{this.checkChangeStatus(index) ? this.user_name : item.updated_by_name}</div>
                                    </div>
                                  </>
                                )
                              })
                            )}
                          </>
                        ):(
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        )}
                      </div>
                    </div>
                    <div className={'table-area'}>
                      <div className={'table-title'}>今回記述</div>
                      <div className={'table-head flex'}>
                        <div className={'menu td-no'}> </div>
                        <div className={'menu td-record_date'}>記録日時</div>
                        <div className={'menu td-btn'}>現在</div>
                        <div className={'menu td-problem_number'}>問題番号</div>
                        <div className={'menu td-nursing_problem_focus'}>看護問題/フォーカス</div>
                        <div className={'menu td-btn'}>選択</div>
                        <div className={'menu td-nursing_record_class_id'}>SOAP/DActR</div>
                        <div className={'menu td-article'}>記事</div>
                        <div className={'menu td-schema_data'}>シェーマ</div>
                        <div className={'menu td-btn'}>情報</div>
                        <div className={'menu td-created_by'}>作成者</div>
                        <div className={'menu td-updated_by'}>更新者</div>
                        <div className={'menu td-last'}> </div>
                      </div>
                      <div className={'table-body'}>
                        {this.state.current_soap_focus.length > 0 && (
                          this.state.current_soap_focus.map((item, index)=>{
                            return (
                              <>
                                <div key={index} className={'div-tr flex current-row:'+index} onContextMenu={e => this.handleClick(e, ('current-row:'+index), item)}>
                                  <div style={{width:"3rem"}} className={'div-td text-right td-no'}>{index + 1}</div>
                                  <div style={{width:"9rem", padding:0}} className={'div-td td-select-date td-record_date'}>
                                    <DatePicker
                                      locale="ja"
                                      id={'record_date-current-'+index}
                                      selected={(item.record_date != undefined && item.record_date != null) ? new Date(item.record_date.split("-").join("/")) : ""}
                                      onChange={this.setRecordDate.bind(this,"current_soap_focus:"+index)}
                                      dateFormat="yyyy/MM/dd HH:mm"
                                      timeCaption="時間"
                                      showTimeSelect
                                      timeFormat="HH:mm"
                                      timeIntervals={10}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      dayClassName = {date => setDateColorClassName(date)}
                                    />
                                  </div>
                                  <div style={{padding:0}} className={'div-td td-btn'}>
                                    <div className={'div-button'} onClick={this.setRecordDateToday.bind(this, index, "current_soap_focus")}>&nbsp;</div>
                                  </div>
                                  <div style={{width:"5rem"}} className={'div-td td-problem_number'}>{item.problem_number != null ? ("#"+item.problem_number) : "" }</div>
                                  <div className={'div-td input-td td-nursing_problem_focus'}>
                                    <InputWithLabelBorder
                                      id={'nursing_problem_focus-current-'+index}
                                      type="text"
                                      getInputText={this.setNursingProblemFocus.bind(this, "current_soap_focus:"+index)}
                                      diseaseEditData={item.nursing_problem_focus}
                                    />
                                  </div>
                                  <div style={{padding:0}} className={'div-td td-btn'}>
                                    <div className={'div-button'} onClick={this.openNurseProblemFocusSelect.bind(this, index, "current_soap_focus")}>&nbsp;</div>
                                  </div>
                                  <div style={{width:"7rem", padding:0}} className={'div-td td-nursing_record_class_id'}>
                                    <SelectorWithLabel
                                      id={"nursing_record_class_id-current-"+index}
                                      options={this.state.nursing_record_class_master}
                                      title=""
                                      getSelect={this.setNursingRecordClass.bind(this, "current_soap_focus:"+index)}
                                      departmentEditCode={item.nursing_record_class_id}
                                    />
                                  </div>
                                  <div className={'div-td input-td td-article'}>
                                    <InputWithLabelBorder
                                      id={'article-current-'+index}
                                      type="text"
                                      getInputText={this.setArticle.bind(this, "current_soap_focus:"+index)}
                                      diseaseEditData={item.article}
                                    />
                                  </div>
                                  <div style={{width:"5rem"}} className={'div-td td-schema_data'}>{item.schema_data != null ? "情報あり" : ""}</div>
                                  <div style={{padding:0}} className={'div-td td-btn'}>
                                    <div className={'div-button'} onClick={this.openSchema.bind(this, index, "current_soap_focus")}>&nbsp;</div>
                                  </div>
                                  <div style={{width:"13rem"}} className={'div-td td-created_by'}>{item.edit_flag == 1 ? this.user_name : ""}</div>
                                  <div className={'div-td td-updated_by'}>{item.edit_flag == 1 ? this.user_name : ""}</div>
                                </div>
                              </>
                            )
                          })
                        )}
                        <div onClick={this.addSoapFocus} className={'div-tr new-tr'}>記述行を追加</div>
                      </div>
                    </div>
                  </>
                ):(
                  <div style={{width:"100%", textAlign:"center", height:"100%"}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeConfirmModal}>キャンセル</Button>
            {(this.state.load_data && this.state.soap_focus_records.length > 0 && !change_flag) ? (
              <Button className={"red-btn"} onClick={this.printList}>{"印刷"}</Button>
            ):(
              <Button className={"disable-btn"}>{"印刷"}</Button>
            )}
            {change_flag ? (
              <Button className={"red-btn"} onClick={this.confirmSave}>{"確定"}</Button>
            ):(
              <Button className={"disable-btn"}>{"確定"}</Button>
            )}
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.openNurseProblemFocusSelect && (
            <NurseProblemFocusSelect
              closeModal={this.closeModal}
              modal_type={this.state.modal_type}
              setProblem={this.setProblem}
              hos_number={this.state.hos_number}
            />
          )}
          {this.state.openSchema && (
            <EndoscopeEditModal
              closeModal={this.closeModal}
              handlePropInsert={this.setSchema}
              imgBase64={this.state.schema_data}
              from_mode={'soap_focus'}
            />
          )}
          {this.state.openFocusNursePlan && (
            <FocusNursePlan
              closeModal={this.closeModal}
              setRecordData={this.setRecordData}
              problem_focus_classification={this.state.problem_focus_classification}
              hos_number={this.state.hos_number}
            />
          )}
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeModal}
              alert_meassage={this.state.check_message}
            />
          )}
          {this.state.isOpenStaffList && (
            <DialSelectMasterModal
              selectMaster = {this.selectStaff}
              closeModal = {this.closeModal}
              MasterCodeData = {this.state.staffs}
              MasterName = 'スタッフ'
            />
          )}
          {this.state.close_confirm_message != "" && (
            <SystemConfirmWithBtnModal
              firstMethod= {this.props.closeModal}
              secondMethod= {this.closeModal}
              confirmTitle= {this.state.close_confirm_message}
              first_btn_name={'入力画面を閉じる'}
              second_btn_name={'入力画面に戻る'}
              second_btn_class={'red-btn'}
            />
          )}
      </Modal>
      </>
    );
  }
}

SoapFocus.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
};

export default SoapFocus;
