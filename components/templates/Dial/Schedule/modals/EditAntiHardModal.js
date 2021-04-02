import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {
    formatJapanDate,
    formatTimePicker,
    formatDateLine,
    formatTime,
    formatDateSlash
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import CalcDial from "~/components/molecules/CalcDial";
registerLocale("ja", ja);
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  getWeekday, 
  toHalfWidthOnlyNumber,
  setDateColorClassName
} from '~/helpers/dialConstants';
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import Spinner from "react-bootstrap/Spinner";
import {getServerTime} from "~/helpers/constants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

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
  font-size: 12px;
  width: 100%;
  height: 100%;
  float: left;
  .flex {
    display: flex;
  }
  .direct_man{
    label{
      cursor: text !important;
    }
  }
  input {
    width: 100%;
    font-size: 14px;
  }  
  .react-datepicker-wrapper {
    width: calc(100% - 90px);
    .react-datepicker__input-container {
        width: 100%;
        input {
            font-size: 14px;
            width: 100%;
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
  .method_name{
    .pullbox-title {
      margin-right: 0.5rem;
      width:6rem;
      margin-left: 5rem;
    }
  }
  .method_name input{
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }
  .medicines{
    margin-left: 11.5rem;
    .left{
      width:60%;      
    }
    .right{
      width:40%;
    }
    .right input{
      width:90%;
      clear:both;
      float:left;
      text-align:right;
    }
    .right span{
      padding-top: 10px;
      width:60px;
      font-size: 16px;
    }
    .inline_input{
      display:flex;
      div{
        margin-top:0px;
        margin-bottom: 8px;
      }
      .label-title{
        display:none;
      }
    }
  }
  .left{
    float:left;
    .pullbox-select{
      width:300px;
    }
  }

  .right{
    float:right;
  }
  .patient_id, .patient_name{
    font-size:25px;
  }
  .schedule_date, .dialyser_table{
    margin-top:10px;
    margin-bottom:10px;
    font-size:20px;
  }  
  .modal_container {
        margin-top: 20px;
  }
  .pullbox-title{
    font-size: 17px;
    text-align: right;
    margin-right: 31px;
  }  
  .dialyser_table{
    max-height:400px;
    overflow-y:scroll;
  }  
  .entry_name{
    label{
      cursor: text !important;
    }
  }
  .register_info{
    clear:both;  
    padding-top: 15px;
    .inline_input{
      display:flex;
      padding-left:30px;
      .label-title, label{
        width:80px;
        text-align:right;
        margin-right:10px;
        font-size: 18px;
        margin-top: 6px;
        margin-bottom: 0;
      }
      input{
        width:200px;        
      }
      .entry_name .left{
        pointer-events: none;
      }
    }
  }
  .final-info {
    font-size: 18px;
    padding-left: 45px;
  }
  .div_return_fail{
    color: #FF6633;
    margin-left: 2rem;
    font-size: 1rem;
  }
  .medicine-group {
      display: flex;
      word-break: break-all;
      .unit-area {
          padding-top: 0.3rem;
          padding-left: 0.3rem;
      }
      .pullbox {
        .label-title {    
            font-size: 1rem;
            width: 5rem;
            width:0;
        }
        label {
            width: 10rem;
            select {
                width: 10rem;
            }
        }
    }
    .medicine-unit {
        display:flex;
        div {
          margin:0;
        }
        input {
            font-size: 1rem;
        }
        .label-title{
          width: 0;
        }
        span{
          font-size: 1rem;
          margin-top: 0.8rem;
          margin-left: 0.4rem;
        }
    }
  }
  .medicine-name {
      .label-title {
          width: 0;
          margin:0;
      }
      .pullbox-select {
          font-size: 1rem;
      }
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

class EditAntiHardModal extends Component {
  constructor(props) {
    super(props);   
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var schedule_date = this.props.schedule_date;
    var system_patient_id = this.props.system_patient_id;
    this.getScheduleAntiItem(system_patient_id, schedule_date);
    this.state = {      
      schedule_date,
      system_patient_id,
      anticoagulation_master_pattern: [],   //マスタデータ
      all_anti_items: [],         //マスタデータ
      isShowStaffList:false,
      isShowDoctorList:false,
      entry_name: (authInfo !=undefined && authInfo != null) ? authInfo.name : '',
      instruction_doctor_number:(authInfo !=undefined && authInfo != null) ? authInfo.doctor_number : 0,
      entry_date: '',
      entry_time: '',
      error_msg: [],
      isUpdateConfirmModal: false,
      isCloseConfirmModal:false,
      confirm_message: "",
      confirm_alert_title:'',
      alert_message: '',
      before_start_confirm_title: '',
      before_start_flag:false,
      is_loaded: false,
      disabled_items:[],
    };
    this.double_click = false;
    this.change_flag = false;    
  }
  
  async UNSAFE_componentWillMount() {
    await this.getAllMasterAntiPattern();
    await this.getAllMasterAnti();
    await this.getStaffs();
    await this.setDoctors();
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

  async getScheduleAntiItem(system_patient_id, schedule_date){
      let path = "/app/api/v2/dial/schedule/dial_schedule_item";
      let post_data = {
        params:{"schedule_date":schedule_date, "system_patient_id":system_patient_id, 'request_source':"anti"},
      };
      await apiClient.post(path, post_data)
      .then((res) => {
        if (res.dial_anti != undefined && res.dial_anti != null){
          var disabled_items = [];
          if (res.dial_anti.anti_items != null && res.dial_anti.anti_items.length > 0){
            res.dial_anti.anti_items.map(item => {
              disabled_items.push(item.item_code);
            })
          }
          var dial_anti = res.dial_anti;
          this.setState({
            schedule_item:res,
            dial_anti,
            title : dial_anti.title,
            anticoagulation_code : dial_anti.anticoagulation_code,
            anticoagulation_pattern_number : dial_anti.anticoagulation_pattern_number,
            disabled_items
          });
          this.change_flag = false;
        } else {
          this.props.closeModal();
          window.sessionStorage.setItem("alert_messages", '抗凝固法パターンを登録してください。');
        }
      });
  }

  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    if (this.state.dial_anti != undefined && this.state.dial_anti != null){
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
  }

  closeModal = () => {
    this.setState({
      isShowStaffList:false,
      isShowDoctorList:false,
    })
  }

  selectDoctor = (doctor) => {
      this.setState({
          instruction_doctor_number:doctor.number
      }, ()=>{
          this.context.$updateDoctor(doctor.number, doctor.name);

          this.closeModal();
      });
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
  };
  
  getAnticoagulationMethod = (e) => {    
    let dial_anti = this.state.dial_anti;        
    let new_anti_items = [];
    var disabled_items = [];
    if (e.target.id>0){
      this.state.anticoagulation_items[e.target.id].map(item=>{
        let new_item = {};
        Object.keys(item).map(idx=>{
            new_item[idx] = item[idx];
        });
        new_anti_items.push(new_item);
        disabled_items.push(new_item.item_code);
      });        
      dial_anti.title = e.target.value;     
      dial_anti.anticoagulation_code = e.target.id;
      dial_anti.anti_items = new_anti_items;

      this.setState({     
        anticoagulation_code:e.target.id,
        title:e.target.value,
        dial_anti,
        disabled_items,
      });
    } else{
      dial_anti.anti_items=[];
      dial_anti.title = '';     
      dial_anti.anticoagulation_code = null;
      this.setState({     
        anticoagulation_code:null,
        title:'',
        dial_anti
      });
    }
    this.change_flag = true;
    
  };

  getAntiItem = (index, e) => {
    var temp = this.state.dial_anti;
    var disabled_items = [];
    if (e.target.id > 0){
      let anti_item = this.state.code_all_anti_items[e.target.id];
      temp.anti_items[index] = anti_item;
      temp.anti_items[index].amount = '';
    } else {
      temp.anti_items[index] = null;
    }

    if (temp.anti_items.length > 0){
      temp.anti_items.map(item => {
        if (item != null){
          disabled_items.push(item.code);
        }
      })
    }

    let error_msg = this.state.error_msg;
    error_msg[index] = '';
    this.setState({
      error_msg,
      dial_anti:temp, 
      disabled_items,
    })
    this.change_flag = true;
  };
  getAmount = (index, e) => {
    var temp = this.state.dial_anti;
    var anti_items = temp.anti_items;
    let error_msg = this.state.error_msg;
    if(anti_items[index].maxlength != 0 && e.target.value.toString().length >anti_items[index].maxlength){
        let msg = anti_items[index].name + "は " + anti_items[index].maxlength + "文字以内で入力してください";
        error_msg[index] = msg;
        this.setState({error_msg});
        return;
    }
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(e.target.value)) {
        return;
    }
    if (error_msg[index] != undefined && error_msg[index] != null && error_msg[index] != ""){
        error_msg[index]='';
    }
    temp.anti_items[index].amount = e.target.value;
    this.setState({
      dial_anti:temp,
      error_msg,
    })
    this.change_flag = true;
  }

  checkValidation = () => {    
    removeRedBorder('anticoagulation_code_id');
    removeRedBorder('anti_item_0');
    removeRedBorder('anti_item_1');
    removeRedBorder('anti_item_2');
    removeRedBorder("entry_time_id");
    let error_str_arr = [];
    let first_tag_id = '';
    if (!(this.state.anticoagulation_code>0)) {
      error_str_arr.push('抗凝固剤を選択してください');
      first_tag_id = 'anticoagulation_code_id';
      addRedBorder('anticoagulation_code_id')
    }
    var temp = this.state.dial_anti;

    temp.anti_items.map((item,index) => {
      if (item != null && !(parseInt(item.amount) >= 0)) {
        if (
          item.amount == undefined ||
          parseInt(item.amount) < 1 ||
          item.amount == ''
        ) {
          error_str_arr.push(item.name + 'を入力してください。');
          addRedBorder('anti_item_' + index);
          if (first_tag_id == '') first_tag_id = 'anti_item_' + index;
        }
      }
    });
    if(this.state.entry_time == "" || this.state.entry_time == null){      
      error_str_arr.push("入力時間を選択してください。");
      if (first_tag_id == '') {
        first_tag_id = 'entry_time_id';
      } 
      addRedBorder("entry_time_id");
    }
    this.setState({ first_tag_id });    
    return error_str_arr;
  }

  saveEditedSchedule = async() => {
    if (this.change_flag == false) return;
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.EDIT) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    if(this.state.instruction_doctor_number === 0){
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
      this.modalBlack();
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
      confirm_message: "抗凝固法を変更しますか？",
    });
    this.modalBlack();
  };
  modalBlack() {
    var base_modal = document.getElementsByClassName("edit-anti-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("edit-anti-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }

  register = async() => {
    this.confirmCancel();
    var temp = this.state.dial_anti;
    temp.instruction_doctor_number = this.state.instruction_doctor_number;

    let path = "/app/api/v2/dial/pattern/updatePatternFromSchedule";

    let update_data = {
      anti_data:temp,
      dial_schedule_item: this.props.dial_schedule_item,
      before_start_flag: this.state.before_start_flag,
      entry_date:formatDateLine(this.state.entry_date),
      entry_time:formatTime(this.state.entry_time),
    };      
    const post_data = {
      params: update_data
    };
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient.post(path, post_data).finally(()=>{
        this.double_click=false;
        window.sessionStorage.setItem("alert_messages", "変更完了##" + '変更しました');
    });
    this.props.handleOk(this.state.schedule_item);
  }

  onHide=()=>{};

  openCalc = (item, index) => {
      this.setState({
          calcInit: item.amount != null && item.amount != undefined ? item.amount : 0,
          change_unit_index:index,
          calcValType: item.number,
          calcUnit: item.unit,
          calcTitle: item.name,
          calcDigits: item.maxlength,
          isOpenCalcModal: true
      });
  }

    calcCancel = () => {
        this.setState({
            isOpenCalcModal: false,
            calcValType: "",
            calcUnit: "",
            calcTitle: "",
            calcInit: 0
        });
    }

    calcConfirm = (val) => {
        let index = this.state.change_unit_index;
        var temp = this.state.dial_anti;
        var anti_items = temp.anti_items;
        let error_msg = this.state.error_msg;
        if(anti_items[index].maxlength != 0 && val.toString().length >anti_items[index].maxlength){
            let msg = anti_items[index].name + "は " + anti_items[index].maxlength + "文字以内で入力してください";
            error_msg[index] = msg;
            this.setState({error_msg});
            return;
        }
        var RegExp = /^\d*\.?\d*$/;
        if (!RegExp.test(val)) {
            return;
        }
        if (error_msg[index] != undefined && error_msg[index] != null && error_msg[index] != ""){
            error_msg[index]='';
        }
        temp.anti_items[index].amount = val;
        this.setState({
          dial_anti:temp,
          error_msg,
          isOpenCalcModal: false,
          calcValType: "",
          calcInit: 0,
          calcTitle: "",
          calcUnit: "",
        });
        this.change_flag= true;
    }

    confirmCancel() {
      this.setState({
          isUpdateConfirmModal: false,
          isCloseConfirmModal:false,
          confirm_message: "",
          confirm_alert_title:'',
          before_start_confirm_title:'',
          before_start_flag:false,
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
    if (this.state.anticoagulation_code == null || this.state.anticoagulation_code == '' || this.state.anticoagulation_code == 0 ) {
      addRequiredBg("anticoagulation_code_id");
    } else {
      removeRequiredBg("anticoagulation_code_id");
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }
  confirmOkBefore = () => {
    this.register();
  }

  extractDisabled = (anti_item) => {
    var disabled_items = this.state.disabled_items;
    if (disabled_items == undefined || disabled_items.length==0) return '';    
    var result_str = '';
    disabled_items.map(item => {
      if (anti_item != null && item != anti_item.code) result_str += item + ':';
      if (anti_item == null) result_str += item + ':';
    })    
    if (result_str != '') result_str = result_str.substr(0, result_str.length-1);
    return result_str;
  }

  render() {    
    let {anticoagulation_master_pattern_list_select, all_anti_items_list_select, dial_anti, schedule_item} = this.state;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var week_days =null;
    var weekday_str = '';
    if (dial_anti != undefined && dial_anti != null){
      if (dial_anti.weekday>0) week_days = getWeekday(dial_anti.weekday);
      if (week_days != null){
        week_days.map(val => {
          weekday_str += val;
        })
      }
    }
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal dializer_edit_modal edit-anti-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>抗凝固法{this.props.from_source == 'bedside'?'':'編集'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
          {schedule_item != undefined &&  (
            <Wrapper>
              <div className="modal_header">
                <div className="schedule_date">
                  {this.props.from_source != 'bedside' ? formatJapanDate(schedule_item.schedule_date) : ''}
                </div>
                <span className="patient_id">
                  {schedule_item.patient_number} :{" "}
                </span>
                <span className="patient_name">
                  {schedule_item.patient_name}
                </span>
                <div className = "schedule_date" style={{paddingLeft:'50px'}}>
                  {this.props.from_source == 'bedside' ? weekday_str : ''}
                </div>
              </div>
              {this.state.is_loaded?(
                <div className="modal_container">
                <div className="method_name">                  
                    <SelectorWithLabel
                      options={anticoagulation_master_pattern_list_select}
                      title="抗凝固剤"
                      getSelect={this.getAnticoagulationMethod.bind(this)}
                      departmentEditCode={this.state.anticoagulation_code}
                      id="anticoagulation_code_id"
                      isDisabled = {this.props.from_source == 'bedside' ? true : false}
                    />
                </div>
                {dial_anti != undefined && dial_anti != null && (
                  <>
                    <div className="medicines flex">
                      <div>
                        {dial_anti.anti_items !== undefined &&
                          dial_anti.anti_items.length > 0 &&
                          dial_anti.anti_items.map((item, index) => {
                            var disabled_string = this.extractDisabled(item);                            
                            return (
                              <>
                                <div className="d-flex medicine-group" key={index}>
                                  <div className="medicine-name" key={index}>                                  
                                    <SelectorWithLabel
                                      options={all_anti_items_list_select}
                                      title=""
                                      key={index}
                                      // isDisabled = {true}
                                      getSelect={this.getAntiItem.bind(this,index)}
                                      departmentEditCode={item != null ? item.item_code : 0}
                                      disabledValue = {disabled_string}
                                      isDisabled = {this.props.from_source == 'bedside' ? true : false}
                                    />
                                  </div>
                                  <div className="medicine-unit">
                                    <InputBoxTag
                                      label=""
                                      type="number"
                                      isDisabled = {this.props.from_source == 'bedside' ? true : false}
                                      // getInputText={this.getAmount.bind(this, index)}
                                      value={
                                        item != null &&
                                        item.amount != undefined &&
                                        item.amount != ""
                                          ? item.amount
                                          : ""
                                      }
                                      onClick={() => this.openCalc(item, index)}
                                      id={'anti_item_'+index}
                                    />
                                    <span>
                                      {item != null && item.unit !== undefined
                                        ? item.unit
                                        : ""}
                                    </span>
                                  </div>
                                </div>
                                {this.state.error_msg[index] && (
                                  <div className="warning div_return_fail">
                                    <div className="div_notify" role="alert">
                                      {this.state.error_msg[index]}
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}
                {this.props.from_source != 'bedside' && dial_anti != undefined && dial_anti != null &&
                  this.state.staff_list_by_number != undefined &&
                  this.state.doctor_list_by_number != undefined && (
                    <>
                      <div className={"flex final-info"}>
                        {"最終入力日時：" +
                          formatDateSlash(dial_anti.updated_at.split(" ")[0]) +
                          " " +
                          formatTime(
                            formatTimePicker(dial_anti.updated_at.split(" ")[1])
                          )}
                      </div>
                      <div className={"flex final-info"}>
                        {"入力者：" +
                          (dial_anti.updated_by !== 0
                            ? this.state.staff_list_by_number[
                                dial_anti.updated_by
                              ]
                            : "") +
                          "　" +
                          "　指示者：" +
                          (dial_anti.instruction_doctor_number != null &&
                          dial_anti.instruction_doctor_number !== 0 &&
                          this.state.doctor_list_by_number[
                            dial_anti.instruction_doctor_number
                          ] != undefined
                            ? this.state.doctor_list_by_number[
                                dial_anti.instruction_doctor_number
                              ]
                            : "")}
                      </div>
                    </>
                  )}
                {this.props.from_source != 'bedside' && (
                  <>
                  <div className="register_info">
                    <div className="inline_input">
                      <div className={"flex"}>
                        <label className="label-date" style={{cursor:"text"}}>入力日</label>
                        <DatePicker
                          locale="ja"
                          selected={this.state.entry_date}
                          onChange={this.getInputdate.bind(this)}
                          dateFormat="yyyy/MM/dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                      <div
                        className={"flex"} >
                        <label className="label-date" style={{cursor:"text"}}>入力時間</label>
                        <DatePicker
                          locale="ja"
                          selected={this.state.entry_time}
                          onChange={this.getInputTime.bind(this)}
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
                    <div className="inline_input remove-x-input">
                      {this.state.staff_list_by_number != undefined && (
                        <div className="entry_name">
                          <InputBoxTag
                            label="入力者"
                            type="text"
                            placeholder=""
                            className="left"
                            value={this.state.entry_name}
                          />
                        </div>
                      )}
                      {this.state.doctor_list_by_number != undefined && (
                        <div
                          className={authInfo !== undefined && authInfo != null && authInfo.doctor_number > 0 ? 'direct_man':'direct_man cursor-input'}
                          onClick={(e)=>this.showDoctorList(e).bind(this)}
                        >
                          <InputBoxTag
                            label="指示者"
                            isDisabled={true}
                            type="text"
                            placeholder=""
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
              
            </Wrapper>
          )}
          </DatePickerBox>
          {this.state.isShowDoctorList && (
            <DialSelectMasterModal
              selectMaster={this.selectDoctor}
              closeModal={this.closeModal}
              MasterCodeData={this.state.doctors}
              MasterName="医師"
            />
          )}
          {this.state.isOpenCalcModal ? (
            <CalcDial
              calcConfirm={this.calcConfirm}
              units={this.state.calcUnit}
              calcCancel={this.calcCancel}
              daysSelect={false}
              numberDigits={this.state.calcDigits}
              daysInitial={0.0}
              daysLabel=""
              daysSuffix=""
              maxAmount={100000}
              calcTitle={this.state.calcTitle}
              calcInitData={this.state.calcInit}
            />
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.close} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          {/* <Button className="cancel-btn" onClick={this.close}>キャンセル</Button> */}
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

EditAntiHardModal.contextType = Context;

EditAntiHardModal.propTypes = {
  closeModal: PropTypes.func,
  saveDailysisSchedule: PropTypes.func,  
  dial_schedule_item:PropTypes.object,
  handleOk:PropTypes.func,
  schedule_date : PropTypes.string,
  system_patient_id : PropTypes.number,
  history: PropTypes.object,
  from_source: PropTypes.string,
};

export default EditAntiHardModal;
