import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import InputCommentModal from "./InputCommentModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import {formatJapanDate, formatTime} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import InputWithLabel from "../../../../molecules/InputWithLabel";
import * as methods from "../../DialMethods";
import $ from "jquery";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as apiClient from "~/api/apiClient";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {addRedBorder, addRequiredBg, removeRequiredBg, removeRedBorder, getWeekday, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import Spinner from "react-bootstrap/Spinner";
import {getServerTime} from "~/helpers/constants";

const SpinnerWrapper = styled.div`
  height: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  float: left;
  .cursor-text-area{
    label{
      cursor: text !important;
    }
  }
  .title{
    display:block;
    padding-bottom:1.25rem;
    margin-bottom:10px;
  }
  .left{
    float:left;
    font-size:1.25rem;
  }
  .no-padding{
    padding:0;
  }
  .right{
    float:right;
    font-size:1.25rem;
    cursor:pointer;
  }
  .patient_id, .patient_name{
    font-size:1.56rem;
  }
  .schedule_date{
    margin-top:15px;
    margin-bottom:10px;
    font-size: 1.56rem;
    font-weight: bold;
  }
  input {
    width: 100%;
    font-size: 15px;
  }
  .done_dialyser{
    background-color:rgb(105, 200, 225);
    cursor: pointer;
  }
  .not_done_dialyser{
    background-color:lightgrey;
    cursor: pointer;
  }
  .done_comment{
    background-color:rgb(105, 200, 225);
    cursor: pointer;
  }
  .not_done_comment{
    background-color: #f46161;
    cursor: pointer;
  }
  table{
    margin-bottom:0px;
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      max-height: 10rem;
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    th{
      font-size: 18px;
      padding-left:2px;
      padding-right:2px;
      text-align:center;
    }
    td{
      vertical-align:middle;
      text-align:center;
      font-size:14px;
      padding: 0;
      .label-title {
        width: 0;
      }
      word-break: break-all;
    }
    .name-td{
      width: 30rem;
      .pullbox-label, .pullbox-select{
        width:30rem;
      }
    }
    .done-td{
      width:4rem;
    }
    .comment-td{
      width:12rem;
    }
  }
  .react-datepicker-wrapper {
      width: fit-content;
      .react-datepicker__input-container {
          width: fit-content;
          input {
              font-size: 14px;
              width: 110px;
              height: 38px;
              border-radius: 4px;
              border-width: 1px;
              border-style: solid;
              border-color: rgb(206, 212, 218);
              border-image: initial;
              padding: 0px 8px;
          }
      }
  }
  .checkbox_area {
    padding-left: 15px;
  }
  .register_info{
    clear:both;
    padding-top: 15px;
  }
  
  .inline_input{
    display:flex;
    .input-time {
        margin-top: 8px;
        input{
            width:90px;
        }
    }
    .label-title, label{
      width:70px;
      text-align:right;
      margin-right:10px;
      font-size: 14px;
    }
    .label-date{
      padding:10px;
    }
    input{
      width:16rem;
    }
  }
  .radio-btn label{
    font-size:1.25rem;
  }

  input:disabled {
    color: black !important;
    background: white;
  }
  select:disabled {
    color: black !important;
    background: white;
    opacity:1;
  }
 `;


const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #5ab0cc;
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
    color: white;
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
    color: black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible, x, y, parent,index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() =>parent.contextMenuAction(index)}>中止</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class EditManageMoneyModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    var schedule_item = this.props.schedule_item;
    this.state = {
      schedule_item:this.props.schedule_item,
      directer_name: "",
      entry_name: "",
      isShowDoctorList:false,
      isShowStaffList:false,
      inputCommentModal:false,
      addManageModal:false,
      instruction_doctor_number: "",
      system_patient_id:this.props.add_flag?this.props.system_patient_id : schedule_item.system_patient_id,
      schedule_date:this.props.add_flag?this.props.schedule_date: schedule_item.schedule_date,
      
      isShowTreatDoctorList:false,
      
      isUpdateConfirmModal:false,
      moveConfirmModal: false,
      confirm_message:'',
      alert_message:'',
      confirm_alert_title:'',
      is_loaded: false,      
    };
    this.double_click=false;
    this.change_flag = false;
  }
  
  async componentDidMount () {
    await this.getFeeMasterCode();
    await this.setDoctors();
    await this.getStaffs();
    let server_time = await getServerTime();
    if (this.props.add_flag){
      this.setState({
        fee_management:[],
        entry_date: new Date(server_time),
        entry_time: new Date(server_time),
      })
    } else {
      if (this.props.from_source == 'bedside'){
        this.setState({
          fee_management:this.props.schedule_item,
        })
      } else {
        if (this.props.schedule_item != undefined && this.props.schedule_item !==null){
          let path = "/app/api/v2/dial/schedule/fee_schedule_search";
          let post_data = {
            cur_day:this.props.schedule_item.schedule_date,
            patient_id:this.props.schedule_item.system_patient_id,
          }
          await apiClient.post(path, {params: post_data}).then((res)=>{
            let fee_management = res;
            this.setState({
              fee_management,
              entry_date: new Date(server_time),
              entry_time: new Date(server_time),
            })
          })
        }
      }
    }
    
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name
      });
    }
    this.setState({is_loaded: true});
  }
  
  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  timeKeyEvent = (e) => {    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;      
    this.key_code = key_code;
    this.start_pos = start_pos;
    var obj = document.getElementById('entry_time_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (key_code == 9) {
      this.setTime(e);
      return;
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({input_time_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            input_time_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            input_time_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        input_time_value:input_value,
      })
    }
  }

  getInputTime = (value, e) => {
    if (e == undefined){
      this.setState({
        entry_time:value,
        input_time_value:formatTime(value)
      })
      this.change_flag = true;
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (input_value.length == 5) this.setTime(e);
    
    this.setState({
      input_time_value:input_value
    }, () => {
      var obj = document.getElementById('entry_time_id');
      if (this.key_code == 46){        
        obj.setSelectionRange(this.start_pos, this.start_pos);
      }
      if (this.key_code == 8){        
        obj.setSelectionRange(this.start_pos - 1, this.start_pos - 1);
      }
    })
  };

  setTime = (e) => {        
    if (e.target.value.length != 5) {      
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })
      this.change_flag = true;
      return;
    }    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })      
      return;
    }    
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    this.setState({entry_time:now})
    this.change_flag = true;
  }
  getInputdate = value => {
    this.setState({entry_date: value});
    this.change_flag = true;
  };
  
  
  handleClick = (e, index) => {
    if (this.props.from_source == 'bedside') return;
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
        .getElementById("fee-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("fee-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -$('.modal-dialog').offset().left,
          y: e.clientY -$('.modal-dialog').offset().top - 40,
          index,
        },
      });
    }
  }
  
  contextMenuAction = (index) => {
    let cur_fee_management = this.state.fee_management;
    cur_fee_management[index].is_canceled = 1;
    this.setState({
      fee_management:cur_fee_management,
    });
  };
  
  getName = (e, index) => {
    let cur_fee_management = this.state.fee_management;
    cur_fee_management[index].fee_management_master_number = e.target.id;
    cur_fee_management[index].is_changed = true;
    this.setState({
      fee_management:cur_fee_management,
    });
    this.change_flag = true;
  };
  
  change_done = (type, index) => {
    if (this.props.from_source == 'bedside') return;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let cur_fee_management = this.state.fee_management;
    if(type){
      cur_fee_management[index].completed_by =  authInfo.user_number;
    } else {
      cur_fee_management[index].completed_by =  null;
    }
    cur_fee_management[index].is_changed = true;

    this.setState({
      fee_management:cur_fee_management,
    });
    this.change_flag = true;
  }
  
  async editFeeSchedule()  {
    let path = "/app/api/v2/dial/schedule/editFeeSchedule";
    var fee_management = this.state.fee_management;
    if (fee_management == undefined || fee_management == null || fee_management.length == 0) return;
    var temp = [];
    fee_management.map(item => {
      if(item.is_changed) temp.push(item);
    })
    const post_data = {
      fee_management: temp,
      entry_date: this.state.entry_date,
      entry_time: this.state.entry_time,
      instruction_doctor_number: this.state.instruction_doctor_number
    };
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient.post(path, {param:post_data}).then(res=>{
      var title = '';
      var message = res.alert_message;
      if (message.indexOf('変更') > -1) title = "変更完了##";
      if (message.indexOf('登録') > -1) title = "登録完了##";
      window.sessionStorage.setItem("alert_messages", title + res.alert_message);
    }).finally(()=>{
      this.double_click=false;
    });
  }
  
  confirmCancel = () => {
    this.setState({
      isUpdateConfirmModal:false,
      moveConfirmModal: false,
      confirm_message:'',
      confirm_alert_title:''
    })
  }
  
  checkValidation = () => {
    removeRedBorder("entry_time_id");
    let error_str_arr = [];
    let tag_ids = [];
    let first_tag_id = '';
    if (this.state.fee_management != undefined && this.state.fee_management != null && this.state.fee_management.length > 0){
      var list = this.state.fee_management;
      list.map((item, index) => {
        removeRedBorder('fee_management_master_number_id' + index);
        if (!(item.fee_management_master_number>0)){
          error_str_arr.push('管理料・指示料名称を選択してください');
          addRedBorder('fee_management_master_number_id' + index);
          tag_ids.push('fee_management_master_number_id' + index);
        }
      })
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){      
      error_str_arr.push("入力時間を選択してください。");      
      addRedBorder("entry_time_id");
      tag_ids.push('entry_time_id');
    }
    if (tag_ids.length > 0) first_tag_id = tag_ids[0];
    this.setState({first_tag_id});
    return error_str_arr;
  }
  
  save = () => {
    if (this.change_flag == false) return;
    if(this.state.instruction_doctor_number == ''){
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.EDIT) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    
    let error_str_array = this.checkValidation();
    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    
    if(authInfo.staff_category == 1 && this.state.directer_name != authInfo.name){
      error_str_array.unshift("指示者を正確に選択してください。");
    }
    
    
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'変更しますか？'
    })
  }
  
  closeThisModal = () => {
    if (this.change_flag) {
      this.setState({
        moveConfirmModal: true,
        action: "close",
        confirm_message:
          "まだ登録していない内容があります。\n変更を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  };
  
  moveOk(action) {
    this.confirmCancel();
    if (action == "close") {
      this.props.closeModal();
      this.change_flag = false;
    }
  }
  
  confirmSave = () => {
    this.confirmCancel();
    this.editFeeSchedule().then(() => {
      if (this.props.add_flag){
        this.props.handleOk(this.state.schedule_date);
      } else {
        this.props.handleOk(this.state.fee_management[0].schedule_date);
      }
    });
  }
  
  changeComent = (index) => {
    if (this.props.from_source == 'bedside') return;
    this.setState({
      comment:this.state.fee_management[index].fee_comment,
      selected_index:index,
      inputCommentModal:true,
    });
  }
  
  showTreatDoctorList = (item) => {
    if (this.props.from_source == 'bedside') return;
    if (!(item.completed_by > 0)) return;
    this.setState({
      isShowTreatDoctorList:true,
      selected_row_item:item,
    })
  }
  
  selectTreatDoctor = (doctor) => {
    var selected_item = this.state.selected_row_item;
    selected_item.completed_by = doctor.number;
    selected_item.is_changed = true;
    this.change_flag = true;
    this.closeModal();
  }
  
  saveComment = ( comment ) => {
    let cur_fee_management = this.state.fee_management;
    cur_fee_management[this.state.selected_index].fee_comment = comment !== "" ? comment : null;
    cur_fee_management[this.state.selected_index].is_changed = true;
    this.setState({
      fee_management: cur_fee_management,
      inputCommentModal:false,
    });
    this.change_flag = true;
  }
  
  selectDoctor = (doctor) => {
    this.setState({
      directer_name:doctor.name,
      instruction_doctor_number:doctor.number
    });
    this.context.$updateDoctor(doctor.number, doctor.name);
    this.change_flag = true;
    this.closeModal();
  }
  
  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    if (this.props.from_source == 'bedside') return;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(authInfo.doctor_number > 0){
      this.setState({
        directer_name:authInfo.name,
        instruction_doctor_number:authInfo.doctor_number
      })
    } else {
      this.setState({
        isShowDoctorList:true
      });
    }
  }
  
  showAddManage = () => {
    if (this.props.from_source == 'bedside') return;
    this.setState({
      addManageModal:true,
    })
  }
  
  addManage = (item) => {
    var temp = this.state.fee_management;
    var add_manage = {
      schedule_number:null,
      system_patient_id: this.state.system_patient_id,
      fee_management_master_number: item.number,
      schedule_date: this.state.schedule_date,
      comment: "",
      fee_chronical_management_comment: null,
      fee_specifical_management_comment: null,
      is_canceled: 0,
      canceled_by: 0,
      canceled_at: null,
      completed_by: null,
      completed_at: null,
      instruction_doctor_number: null,
      is_doctor_consented: 0,
      doctor_consented_at: null,
      history: null,
      fee_comment:null,
      is_enabled: 1,
      is_changed:true,
    }
    temp.push(add_manage);
    this.setState({
      fee_management:temp,
      showAddManage:false,
      addManageModal: false,
    })
    this.change_flag = true;
  }
  
  closeModal = () => {
    this.setState({
      isShowDoctorList:false,
      isShowStaffList:false,
      inputCommentModal:false,
      isShowTreatDoctorList:false,
      addManageModal:false,
    });
  }
  
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  changeBackground = () => {
    if (this.state.fee_management != undefined && this.state.fee_management != null && this.state.fee_management.length > 0){
      var list = this.state.fee_management;
      list.map((item, index) => {
        if (!(item.fee_management_master_number>0)){
          addRequiredBg('fee_management_master_number_id' + index);
        } else {
          removeRequiredBg('fee_management_master_number_id' + index);
        }
      })
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }
  
  onHide=()=>{}
  
  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let feeMasterCode = [];
    if(this.state.feeMasterCode_option_list != undefined){
      feeMasterCode = this.state.feeMasterCode_option_list;
    }
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal fee-management-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            管理料{this.props.from_source =='bedside'?'': this.props.add_flag ? "登録" : "編集"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="modal_header">
              {this.props.add_flag === false && (
                <>
                  <div className="schedule_date">
                    {formatJapanDate(
                      this.state.schedule_date
                    )}
                  </div>
                  <span className="patient_id">
                          {this.state.schedule_item.patient_number} :{" "}
                        </span>
                  <span className="patient_name">
                          {this.state.schedule_item.patient_name}
                        </span>
                </>
              )}
              {this.props.add_flag === true && (
                <>
                  <div className="schedule_date">
                    {formatJapanDate(this.state.schedule_date)}
                  </div>
                  <span className="patient_id">
                        {this.props.patientInfo.patient_number} :{" "}
                      </span>
                  <span className="patient_name">
                        {this.props.patientInfo.patient_name}
                      </span>
                </>
              )}
            </div>
            {this.state.is_loaded ? (
              <div className="fee_table">
                <div className="title">
                  <div className="left">管理料</div>                  
                  {this.props.from_source !='bedside' && (
                    <div className="right" onClick={this.showAddManage}>
                      <Icon icon={faPlus} />
                      管理料追加
                    </div>
                  )}
                </div>
                <div className="table-content">
                  <table
                    className="table-scroll table table-bordered"
                    id="fee-table"
                  >
                    <thead>
                    <tr>
                      <th className='name-td'>管理料・指示料名称</th>
                      {this.props.from_source != 'bedside' && (
                        <>
                          <th className='comment-td'>コメント</th>
                          <th className='done-td'>実施</th>
                          <th>医師名</th>
                        </>
                      )}
                      {this.props.from_source == 'bedside' && (
                        <>
                          <th>曜日</th>
                        </>
                      )}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.fee_management !== undefined &&
                    this.state.fee_management !== null &&
                    this.state.fee_management.length > 0 &&
                    this.state.fee_management.map((item, index) => {
                      var week_days =null;
                      var weekday_str = '';
                      if (item.weekday>0) week_days = getWeekday(item.weekday);
                      if (week_days != null){
                        week_days.map(val => {
                          weekday_str += val;
                        })
                      }
                      return (
                        <>
                          {(this.props.from_source == 'bedside' || item.is_canceled !== 1) && (item.fee_management_master_number > 0) && (
                            <>
                              <tr onContextMenu={(e) =>this.handleClick(e, index)}>
                                <td className={"name-td"}>
                                  <SelectorWithLabel
                                    options={feeMasterCode}
                                    getSelect={(e) =>this.getName(e, index)}
                                    departmentEditCode={item.fee_management_master_number}
                                    id = {'fee_management_master_number_id' + index}
                                    isDisabled ={this.props.from_source == 'bedside' ? true : false}
                                  />
                                </td>
                                {this.props.from_source != 'bedside' && (
                                  <>
                                    {item.fee_comment !== null ? (
                                      <>
                                        <td className="text-center done_comment comment-td" onClick={() =>this.changeComent(index)}>済</td>
                                      </>
                                    ) : (
                                      <>
                                        <td className="text-center not_done_comment comment-td" onClick={() => this.changeComent(index)}>未</td>
                                      </>
                                    )}
                                    {item.completed_by !== null ? (
                                      <>
                                        <td className="text-center done_dialyser done-td" onClick={() =>this.change_done(false, index)}>済</td>
                                      </>
                                    ) : (
                                      <>
                                        <td className="text-center not_done_dialyser done-td" onClick={() =>this.change_done(true, index)}>未</td>
                                      </>
                                    )}
                                    <td className="no-padding clickable" onClick={this.showTreatDoctorList.bind(this,item)}>
                                      {item.completed_by !== null &&
                                      this.state.doctor_list_by_number !=
                                      undefined &&
                                      this.state.doctor_list_by_number[
                                        item.completed_by
                                        ]}
                                    </td>
                                  </>
                                )}
                                {this.props.from_source == 'bedside' && (
                                  <td>{weekday_str}</td>
                                )}
                              </tr>
                            </>
                          )}
                        </>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
                {this.props.from_source != 'bedside' && (
                  <div className="register_info">
                    <div className="inline_input">
                      <InputWithLabel
                        label="入力日"
                        type="date"
                        getInputText={this.getInputdate}
                        diseaseEditData={this.state.entry_date}
                      />
                      <div
                        className="input-time">
                        <label style={{cursor:"text"}}>入力時間</label>
                        <DatePicker
                          selected={this.state.entry_time}
                          onChange={this.getInputTime}
                          onKeyDown = {this.timeKeyEvent}
                          onBlur = {this.setTime}
                          value = {this.state.input_time_value}
                          id='entry_time_id'
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={10}
                          dateFormat="HH:mm"
                          timeFormat="HH:mm"
                          timeCaption="時間"
                        />
                      </div>
                      <div className="remove-x-input d-flex cursor-text-area">
                        <InputBoxTag
                          label="入力者"
                          type="text"
                          placeholder=""
                          isDisabled={true}
                          value={authInfo.name}
                          // getInputText={this.getValue.bind(this,'predict_hours')}
                          // value={this.state.fee_management != null && this.state.fee_management[0].updated_by > 0 && this.state.staff_list_by_number != undefined ?this.state.staff_list_by_number[this.state.fee_management[0].updated_by]:''}
                        />
                        
                        {authInfo != undefined &&
                        authInfo != null &&
                        authInfo.doctor_number > 0 ? (
                          <InputWithLabel
                            label="指示者"
                            type="text"
                            isDisabled={true}
                            diseaseEditData={this.state.directer_name}
                          />
                        ) : (
                          <>
                            <div
                              className="direct_man cursor-input"
                              onClick={(e)=>this.showDoctorList(e).bind(this)}
                            >
                              <InputWithLabel
                                label="指示者"
                                type="text"
                                isDisabled={true}
                                diseaseEditData={this.state.directer_name}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              favouriteMenuType={this.state.favouriteMenuType}
            />
            {this.state.inputCommentModal && (
              <InputCommentModal
                saveComment={this.saveComment}
                closeModal={this.closeModal}
                comment={this.state.comment}
              />
            )}
            {this.state.isShowDoctorList !== false && (
              <DialSelectMasterModal
                selectMaster={this.selectDoctor}
                closeModal={this.closeModal}
                MasterCodeData={this.state.doctors}
                MasterName="医師"
              />
            )}
            {this.state.isShowTreatDoctorList !== false && (
              <DialSelectMasterModal
                selectMaster={this.selectTreatDoctor}
                closeModal={this.closeModal}
                MasterCodeData={this.state.doctors}
                MasterName="医師"
              />
            )}
            {this.state.isShowDoctorList !== false && (
              <DialSelectMasterModal
                selectMaster={this.selectDoctor}
                closeModal={this.closeModal}
                MasterCodeData={this.state.doctors}
                MasterName="医師"
              />
            )}
            {this.state.addManageModal && (
              <DialSelectMasterModal
                selectMaster={this.addManage}
                closeModal={this.closeModal}
                MasterCodeData={this.state.feeMasterData}
                MasterName="管理料"
              />
            )}
            {this.state.moveConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.moveOk.bind(this, this.state.action)}
                confirmTitle={this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}
            {this.state.isUpdateConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmSave.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.alert_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeAlertModal}
                alert_meassage={this.state.alert_message}
              />
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeThisModal}>キャンセル</Button>
          {this.props.from_source != 'bedside' && (
            <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={this.save}>変更</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}


EditManageMoneyModal.contextType = Context;


EditManageMoneyModal.propTypes = {
  closeModal: PropTypes.func,
  schedule_item:PropTypes.array,
  handleOk:   PropTypes.func,
  patientInfo: PropTypes.object,
  schedule_date:PropTypes.string,
  system_patient_id: PropTypes.number,
  add_flag : PropTypes.bool,
  from_source : PropTypes.string,
};

export default
EditManageMoneyModal;
