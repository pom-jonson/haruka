import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import {
  formatDateSlash,
  formatJapanDate,
  formatTime,
  formatTimePicker
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import InputWithLabel from "../../../../molecules/InputWithLabel";
import * as methods from "../../DialMethods";
import $ from "jquery";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  getWeekday,
  toHalfWidthOnlyNumber
} from '~/helpers/dialConstants';
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import Spinner from "react-bootstrap/Spinner";
import {getServerTime} from "~/helpers/constants";

const SpinnerWrapper = styled.div`
  height: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  .direct_man{
    label{
      cursor: text !important;
    }
  }
  .title{
    display:block;
    padding-bottom:20px;
    margin-bottom:10px;
  }
  .left{
    float:left;
    font-size:1.125rem;
  }
  .no-padding{
    padding:0;
  }
  .right{
    float:right;
    font-size:1.125rem;
    cursor:pointer;
  }
  .patient_id, .patient_name{
    font-size:25px;
  }
  .schedule_date, .dialyser_table{
    margin-top: 10px;
    font-size:1.25rem;
  }
  .f{
    height: 25rem;
  }
  input {
    width: 100%;
    font-size: 15px;
  }
  th {
    text-align: center;
    font-size: 1.125rem;
  }
  td {
    padding: 0;
    line-height: 38px;
    text-align: center;
  }
  .dializer-code {
    .label-title {
        width: 0;
    }
    label {
        width: 100%;
        margin: 0;
        select {
            width: 100%;
        }
    }
  }
  .entry_name{
    label{
      cursor: text !important;
    }
  }
  .react-datepicker-wrapper {
      width: fit-content;
      .react-datepicker__input-container {
          width: fit-content;
          input {
              font-size: 1rem;
              width: 200px;
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
  .done_dialyser{
    background-color:rgb(105, 200, 225);
    cursor: pointer;
  }
  .not_done_dialyser{
    background-color:lightgrey;
    cursor: pointer;
  }
  .checkbox_area {
    padding-left: 15px;
  }
  .register_info{
    clear:both;
    padding-top: 15px;

    .entry_name{
      pointer-events: none;
    }
  }
  
  .inline_input{
    display:flex;
    .label-title, label{
      text-align:right;
      margin-right:10px;
      width: 120px;
      font-size: 1.125rem;
      margin-top: 6px;
      margin-bottom: 0;;
    }
    input{
      width:200px;
    }
    .input-time {
        margin-top: 8px;
    }
  }
  .table-content{
    overflow-y:auto;
    max-height:13rem;
    clear:both;
    margin-bottom:10px;
  }
  .radio-btn label{
    font-size:1.25rem;
  }
  .final-info {
    font-size: 1.125rem;
    padding-left: 70px;
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
margin-bottom: 0;
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
`;

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       parent,
                       index,
                     }) => {
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

class EditDialyserModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var schedule_date = this.props.schedule_date;
    var system_patient_id = this.props.system_patient_id;
    this.getScheduleDialyser(system_patient_id, schedule_date);
    this.state = {
      showDialyserListModal:false,
      isShowDoctorList: false,
      is_canceled: false,
      entry_name: (authInfo !=undefined && authInfo != null) ? authInfo.name : '',
      instruction_doctor_number:(authInfo !=undefined && authInfo != null) ? authInfo.doctor_number : 0,
      entry_date: '',
      entry_time: '',
      isUpdateConfirmModal: false,
      isCloseConfirmModal:false,
      isShowTreatDoctorList:false,
      confirm_message: "",
      confirm_alert_title:'',
      alert_message:'',
      before_start_flag:false,
      before_start_confirm_title:'',
      is_loaded: false
    };
    this.double_click = false;
    this.change_flag = false;
  }
  
  async componentDidMount(){
    await this.getDialyzerCode();
    await this.setDoctors();
    await this.getStaffs();
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    state_data['is_loaded'] = true;
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
  }
  
  getScheduleDialyser(system_patient_id, schedule_date){
    let path = "/app/api/v2/dial/schedule/dial_schedule_item";
    let post_data = {
      params:{"schedule_date":schedule_date, "system_patient_id":system_patient_id, 'request_source':"dialyzer"},
    };
    apiClient.post(path, post_data).then(res=>{
      var dialyser = res.dial_dialyzer;
      this.change_flag = false;
      if (dialyser != undefined && dialyser != null && dialyser.length> 0){
        this.setState({
          schedule_item:res,
          dialyser,
          is_added:0,
        })
      } else {
        // this.props.closeModal();
        // window.sessionStorage.setItem("alert_messages", 'ダイアライザを登録してください。');
        this.setState({
          is_added:1,
          schedule_item:res,
          dialyser:[{
            number:0,
            system_patient_id:res.system_patient_id,
            pattern_number:0,
            dialyzer_code: 0,
            schedule_date:res.schedule_date,
            is_doctor_consented:0,
            is_canceled:0,
            is_completed:0,
            completed_by:0,
          }]
        })
      }
      
    })
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
  
  add_dialyser_modal = () => {
    this.setState({showDialyserListModal:true});
  }
  
  addDialyser = (item) => {
    var temp = this.state.dialyser;
    var add_dialyer = {
      number:null,
      system_patient_id: this.state.schedule_item.system_patient_id,
      dialyzer_code: item.code,
      schedule_date: this.state.schedule_item.schedule_date,
      is_canceled: 0,
      canceled_by: null,
      canceled_at: null,
      is_completed: 0,
      completed_by: null,
      completed_at: null,
      instruction_doctor_number: null,
      is_doctor_consented: 0,
      doctor_consented_at: null,
      history: null,
      is_enabled: 1
    }
    temp.push(add_dialyer);
    this.setState({
      dialyser:temp,
      showDialyserListModal:false
    })
    this.change_flag = true;
  }
  
  closeModal = () => {
    this.setState({
      showDialyserListModal:false,
      isShowTreatDoctorList:false,
      isShowDoctorList:false,
    });
  }
  
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
        .getElementById("dialyer-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("dialyer-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -$('.modal-dialog').offset().left,
          y: e.clientY - 150,
          index: index,
        },
      });
    }
  }
  
  contextMenuAction = (index) => {
    let cur_dialyser = this.state.dialyser;
    cur_dialyser[index].is_canceled = 1;
    this.setState({
      dialyser:cur_dialyser,
    });
    this.change_flag = true;
  };
  
  getName = (e, index) => {
    let cur_dialyser = this.state.dialyser;
    cur_dialyser[index].dialyzer_code = e.target.id;
    this.setState({
      dialyser:cur_dialyser,
    });
    this.change_flag = true;
  };
  
  change_done = (index, type) => {
    if (this.props.from_source == 'bedside') return;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let cur_dialyser = this.state.dialyser;
    if(type){
      cur_dialyser[index].is_completed = 1;
      cur_dialyser[index].completed_by =  authInfo.user_number;
    } else {
      cur_dialyser[index].is_completed = 0;
      cur_dialyser[index].completed_by =  "";
    }
    this.setState({
      dialyser:cur_dialyser,
    });
    this.change_flag = true;
  }
  
  async editDialyserSchedule()  {
    if (this.double_click == true) return;
    this.double_click = true;
    let path = "/app/api/v2/dial/schedule/editDialyserSchedule";
    const post_data = {
      dialyser: this.state.dialyser,
      entry_date: this.state.entry_date,
      entry_time: this.state.entry_time,
      dial_schedule_item: this.props.dial_schedule_item,
      before_start_flag: this.state.before_start_flag,
    };
    await apiClient.post(path, {param:post_data}).finally(()=>{
      this.double_click=false;
      window.sessionStorage.setItem("alert_messages", "変更完了##" + '変更しました');
    });
  }
  
  checkValidation = () => {
    removeRedBorder("entry_time_id");
    let error_str_arr = [];
    let tag_ids = [];
    let first_tag_id = '';
    if (this.state.dialyser != undefined && this.state.dialyser != null && this.state.dialyser.length > 0){
      this.state.dialyser.map((item, index) => {
        removeRedBorder('dialyzer_code_id' + index);
        if (!(item.dialyzer_code>0)){
          error_str_arr.push('ダイアライザ'+ (index+1).toString() + 'を選択してください');
          addRedBorder('dialyzer_code_id' + index);
          tag_ids.push('dialyzer_code_id' + index);
        }
      })
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){      
      error_str_arr.push("入力時間を選択してください。");      
      addRedBorder("entry_time_id");
      tag_ids.push('entry_time_id');
    }
    if (tag_ids.length > 0) first_tag_id = tag_ids[0];
    this.setState({ first_tag_id });
    return error_str_arr;
    
  }
  
  saveEditedSchedule = () => {
    if (this.change_flag == false) return;
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.EDIT) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    if(this.state.instruction_doctor_number === 0){
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    if (this.props.dial_schedule_item != undefined && this.props.dial_schedule_item.pre_start_confirm_at != null && this.props.dial_schedule_item.pre_start_confirm_at != ''){
      if (this.props.dial_schedule_item.start_date != null || this.props.dial_schedule_item.console_start_date != null){
        window.sessionStorage.setItem("alert_messages", "開始済みエラー##" + '透析を開始したスケジュールは、ベッドサイド支援から変更してください');
        return;
      }
      this.setState({
        before_start_confirm_title: "変更確認",
        confirm_message: "このスケジュールは開始前確認が完了していますが、変更しますか？\n（開始前確認は未了に戻ります）",
        before_start_flag:true,
      });
      return;
    } else if(this.state.schedule_item != undefined && this.state.schedule_item.pre_start_confirm_at != null && this.state.schedule_item.pre_start_confirm_at != "") {
      if (this.state.schedule_item.start_date != null || this.state.schedule_item.console_start_date != null){
        window.sessionStorage.setItem("alert_messages", "開始済みエラー##" + '透析を開始したスケジュールは、ベッドサイド支援から変更してください');
        return;
      }
      this.setState({
        before_start_confirm_title: "変更確認",
        confirm_message: "このスケジュールは開始前確認が完了していますが、変更しますか？\n（開始前確認は未了に戻ります）",
        before_start_flag:true,
      });
      this.modalBlack();
      return;
    }
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message: this.state.is_added?'ダイアライザを登録しますか？' :'ダイアライザを変更しますか？'
    });
    this.modalBlack();
  }
  modalBlack() {
    var base_modal = document.getElementsByClassName("input-keyword-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("input-keyword-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }
  
  register = async() => {
    this.change_flag = false;
    this.confirmCancel();
    var dialyser = this.state.dialyser;
    dialyser.map((item, index) => {
      dialyser[index].instruction_doctor_number = this.state.instruction_doctor_number;
    });
    this.setState({
      dialyser,
    })
    this.editDialyserSchedule().then(() => {
      this.props.handleOk(this.state.schedule_item);
    });
  }
  
  selectDoctor = (doctor) => {
    this.setState({
      instruction_doctor_number:doctor.number
    }, ()=>{
      this.context.$updateDoctor(doctor.number, doctor.name);
      
      this.closeModal();
    });
  }
  
  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(authInfo.doctor_number > 0){
      this.setState({
        instruction_doctor_number:authInfo.doctor_number
      })
    } else {
      this.setState({
        isShowDoctorList:true
      });
    }
  }
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal:false,
      confirm_message: "",
      confirm_alert_title:'',
      before_start_confirm_title:'',
    });
    this.modalBlackBack();
  }
  
  close = () => {
    if (this.change_flag){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。\n変更内容を破棄して移動しますか？',
        confirm_alert_title:'入力中',
      });
      this.modalBlack();
    } else {
      this.closeThisModal();
    }
  }
  
  closeThisModal = () => {
    this.confirmCancel();
    this.props.closeModal();
    this.change_flag = false;
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
    if (this.state.dialyser != undefined && this.state.dialyser != null && this.state.dialyser.length > 0){
      this.state.dialyser.map((item, index) => {
        if (!(item.dialyzer_code>0)){
          addRequiredBg("dialyzer_code_id" + index);
        } else {
          removeRequiredBg("dialyzer_code_id" + index);
        }
      })
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }
  
  showTreatDoctorList = (index) => {
    if (this.props.from_source == 'bedside') return;
    if (this.state.dialyser[index].is_completed != 1) return;
    this.setState({
      isShowTreatDoctorList:true,
      selected_row_index:index,
    })
  }
  
  selectTreatDoctor = (doctor) => {
    var temp = this.state.dialyser;
    temp[this.state.selected_row_index].completed_by = doctor.number;
    this.setState({dialyser:temp});
    this.change_flag = true;
    this.closeModal();
  }
  
  onHide=()=>{}
  
  confirmOkBefore = () => {
    this.register();
  }
  
  render() {
    let dializers = [];
    if(this.state.dialyzer_options_list != undefined){
      dializers = this.state.dialyzer_options_list;
    }
    var week_days =null;
    var weekday_str = '';
    if (this.state.dialyser != undefined && this.state.dialyser.length > 0){
      if (this.state.dialyser[0].weekday>0) week_days = getWeekday(this.state.dialyser[0].weekday);
      if (week_days != null){
        week_days.map(val => {
          weekday_str += val;
        })
      }
    }
    var title_suffix = '';
    if (this.props.from_source != 'bedside'){
      if(this.state.is_added == 1) title_suffix = '登録'; else title_suffix = '編集';
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal dializer_edit_modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>ダイアライザ{title_suffix}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.schedule_item != undefined && (
            <Wrapper>
              <div className="modal_header">
                <div className="schedule_date">
                  {this.props.from_source != 'bedside'? formatJapanDate(this.state.schedule_item.schedule_date) : ''}
                </div>
                <span className="patient_id">
                  {this.state.schedule_item.patient_number} :{" "}
                </span>
                <span className="patient_name">
                  {this.state.schedule_item.patient_name}
                </span>
                <div className="schedule_date" style={{paddingLeft:'50px'}}>
                  {this.props.from_source == 'bedside'? weekday_str : ''}
                </div>
              </div>
              {this.state.is_loaded?(
                
                <div className="dialyser_table">
                  <div className="title">
                    <div className="left">ダイアライザ</div>
                    {/* <div className = "right" onClick ={this.add_dialyser_modal}><Icon icon={faPlus} />ダイアライザ追加</div> */}
                  </div>
                  <div className="table-content">
                    <table
                      className="table-scroll table table-bordered"
                      id="dialyer-table"
                    >
                      <thead>
                      <tr>
                        <th>ダイアライザ</th>
                        <th>実施</th>
                        <th>実施者</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.dialyser !== undefined &&
                      this.state.dialyser !== null &&
                      this.state.dialyser.length > 0 &&
                      this.state.staff_list_by_number != undefined &&
                      this.state.dialyser.map((dialyser, index) => {
                        return (
                          <>
                            {dialyser.is_canceled !== 1 && (
                              <>
                                <tr onContextMenu={(e) =>this.handleClick(e, index)}>
                                  <td className={"dializer-code"}>
                                    <SelectorWithLabel
                                      options={dializers}
                                      getSelect={(e) =>this.getName(e, index)}
                                      departmentEditCode={dialyser.dialyzer_code}
                                      id = {'dialyzer_code_id' + index}
                                      isDisabled = {this.props.from_source == 'bedside' ? true : false}
                                    />
                                  </td>
                                  {dialyser.is_completed == 1 ? (
                                    <>
                                      <td className="text-center done_dialyser" onClick={() =>this.change_done(index, false)}>済</td>
                                      <td className="no-padding clickable" style={{width:'200px'}} onClick={this.showTreatDoctorList.bind(this, index)}>
                                        {dialyser.completed_by > 0 ? this.state.staff_list_by_number[dialyser.completed_by]: ""}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="text-center not_done_dialyser clickable" onClick={() =>this.change_done(index, true)}>未</td>
                                      <td className="no-padding clickable" style={{width:'200px'}}>&nbsp;&nbsp;</td>
                                    </>
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
                  {this.props.from_source != 'bedside' && this.state.is_added == 0 && this.state.dialyser[0] != undefined &&
                  this.state.staff_list_by_number != undefined &&
                  this.state.doctor_list_by_number != undefined && (
                    <>
                      <div className={"flex final-info"}>
                        {"最終入力日時：" +
                        formatDateSlash(
                          this.state.dialyser[0].updated_at.split(" ")[0]
                        ) +
                        " " +
                        formatTime(
                          formatTimePicker(
                            this.state.dialyser[0].updated_at.split(" ")[1]
                          )
                        )}
                      </div>
                      <div className={"flex final-info"}>
                        {"入力者：" +
                        (this.state.dialyser[0].updated_by !== 0
                          ? this.state.staff_list_by_number[
                            this.state.dialyser[0].updated_by
                            ]
                          : "") +
                        "　" +
                        "　指示者：" +
                        (this.state.dialyser[0].instruction_doctor_number !=
                        null &&
                        this.state.dialyser[0].instruction_doctor_number !==
                        0 &&
                        this.state.doctor_list_by_number[
                          this.state.dialyser[0].instruction_doctor_number
                          ] != undefined
                          ? this.state.doctor_list_by_number[
                            this.state.dialyser[0].instruction_doctor_number
                            ]
                          : "")}
                      </div>
                    </>
                  )}
                  {this.props.from_source != 'bedside' && (
                    <>
                      <div className="register_info">
                        <div className="inline_input">
                          <div className="inline_input">
                            <InputWithLabel
                              label="入力日"
                              type="date"
                              className="entry_name"
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
                          </div>
                        </div>
                        <div className="inline_input remove-x-input">
                          <div className="entry_name">
                            <InputBoxTag
                              label="入力者"
                              type="text"
                              placeholder=""
                              className="left"
                              isDisabled={true}
                              value={this.state.entry_name}
                            />
                          </div>
                          {this.state.doctor_list_by_number != undefined && (
                            <div
                              className={authInfo !== undefined && authInfo != null && authInfo.doctor_number > 0 ? 'direct_man':'direct_man cursor-input'}
                              onClick={(e)=>this.showDoctorList(e).bind(this)}
                            >
                              <InputBoxTag
                                label="指示者"
                                type="text"
                                placeholder=""
                                isDisabled={true}
                                className="left"
                                value={
                                  this.state.instruction_doctor_number !== 0
                                    ? this.state.doctor_list_by_number[
                                      this.state.instruction_doctor_number
                                      ]
                                    : ""
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
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
              {this.state.isShowDoctorList !== false && (
                <DialSelectMasterModal
                  selectMaster={this.selectDoctor}
                  closeModal={this.closeModal}
                  MasterCodeData={this.state.doctors}
                  MasterName="医師"
                />
              )}
              {this.state.showDialyserListModal && (
                <DialSelectMasterModal
                  selectMaster={this.addDialyser}
                  closeModal={this.closeModal}
                  MasterCodeData={this.state.dialyzerList}
                  MasterName="ダイアライザ"
                />
              )}
            </Wrapper>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* <Button className="cancel-btn" onClick={this.close}>キャンセル</Button> */}
          <div onClick={this.close} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          {this.props.from_source != 'bedside' && (
            <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={this.saveEditedSchedule.bind(this)}>登録</Button>
          )}
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.register.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isCloseConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.closeThisModal.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.isShowTreatDoctorList !== false && (
          <DialSelectMasterModal
            selectMaster={this.selectTreatDoctor}
            closeModal={this.closeModal}
            MasterCodeData={this.state.staffs}
            MasterName="スタッフ"
          />
        )}
        {this.state.before_start_confirm_title !== "" && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOkBefore.bind(this)}
            confirmTitle={this.state.confirm_message}
            title = {this.state.before_start_confirm_title}
          />
        )}
      </Modal>
    );
  }
}

EditDialyserModal.contextType = Context;

EditDialyserModal.propTypes = {
  closeModal: PropTypes.func,
  saveDailysisSchedule: PropTypes.func,
  dial_schedule_item:PropTypes.object,
  schedule_date : PropTypes.string,
  system_patient_id : PropTypes.number,
  handleOk:   PropTypes.func,
  history: PropTypes.object,
  from_source: PropTypes.string,
};

export default EditDialyserModal;
