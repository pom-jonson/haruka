import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import {
  formatJapanDate,
  formatTime,
  formatDateLine} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import $ from "jquery";
import * as methods from "~/components/templates/Dial/DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import {makeList_code, sortTimingCodeMaster, makeList_codeName, sortByTiming, addRedBorder, addRequiredBg, removeRequiredBg, removeRedBorder, getWeekday,toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CalcDial from "~/components/molecules/CalcDial";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";

registerLocale("ja", ja);
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
  .dailysis_condition{
    display:flex;
  }
  .cursor-text-area{
    label{
      cursor: text !important;
    }
  }
  .react-datepicker-wrapper {
    width: 200px;
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
  
  .left{
    float:left;
    font-size:17px;
  }

  .right{
    float:right;
    font-size:15px;
    cursor:pointer;
  }
  .patient_id, .patient_name{
    font-size:25px;
  }
  .schedule_date, .dialyser_table{
    margin-top:15px;
    margin-bottom:10px;
    font-size:15px;
  }
  
  input {
    width: 100%;
    font-size: 15px;
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
      max-height: 250px;
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    th{
      font-size:13px;
      padding-left:2px;
      padding-right:2px;
      text-align:center;
    }
    td{
      vertical-align:middle;
      text-align:center;
      font-size:14px;
      padding-left:2px;
      padding-right:2px;
      padding-top:1px;
      padding-bottom:1px;
      .label-title {
        width: 0;
        margin:0;
      }
      div{
        margin-top:0px;
      }
      .pullbox{
        height:38px;
      }
      word-break: break-all;
    }
    .kind-td{
      width:40px;
    }
    .name-td{
      width:300px;
    }
    .amount-td{
      width:65px;
    }
    .unit-td{
      width:80px;
    }
    .timing-td{
      width:200px;
    }
    .sending-td{
      width:70px;
    }
    .done-td{
      width:35px;
    }
  }
  
  // .medicine_name{
    .pullbox-select, .pullbox-label{
      width:auto;
      max-width:20rem;
      min-width: 180px;
      // padding-right: 2rem;
    }
  // }
  .medicine-amount{
    input{
      max-width:60px;
      font-size:0.9rem;
    }
  }
  .completed-by{
    input{
      max-width:250px;
    }
  }

  .change{
    cursor:pointer;
  }
  .done_dialyser{
    background-color:rgb(105, 200, 225);
  }
  .not_done_dialyser{
    background-color:lightgrey;
  }
  .checkbox_area {
    padding-left: 15px;
  }
  .register_info{
    display: flex;
    div {margin-top:0;}
    .label-title, label {
      text-align: right;
      font-size: 1rem;
      margin: 0;
      margin-right: 0.5rem;
      line-height: 2rem;
      width: 6rem;
    }
    input {
      width: 20rem;
      height: 2rem;
      font-size:1rem;
    }
    .react-datepicker-wrapper {
      input {
        width: 7rem;
        height: 2rem;
        font-size:1rem;
      }
    }
  }
  .table-content{
    clear:both;
    margin-bottom:10px;
  }
  
  .footer {
    margin-left: 30px;
    margin-top: 10px;
    text-align: center;
    padding-top:20px;
    clear:both;
    label{
      width:100px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
      padding-left: 90px;
      padding-right: 90px;
    }
    .add-button {
      text-align: center;
    }
    span {
      color: white;
      font-size: 15px;
      font-weight: 100;
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
    color:black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible, x, y,parent,  index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.stopSchedule(index)}>中止</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const type_list = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];
const sending_info = ['なし', 'あり'];

class EditDailysisPrescriptionSchedulModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var timingCodeData = sortTimingCodeMaster(code_master['実施タイミング']);
    let medicine_master = sessApi.getObjectValue("dial_common_master","medicine_master");
    this.state = {
      schedule_item:this.props.schedule_item,
      medicine_master,
      medicine_list:makeList_code(medicine_master),
      medicine_options_list:makeList_codeName(medicine_master,1),
      timingCodeData,
      timing_codes:makeList_code(timingCodeData),
      timing_options:makeList_codeName(timingCodeData, 1),
      entry_date: '',
      entry_time: '',
      showMedicineList:false,
      isShowDoctorList: false,
      directer_name: "",
      instruction_doctor_number: 0,
      schedule_date:this.props.add_flag?this.props.schedule_date : this.props.schedule_item.schedule_date,
      system_patient_id:this.props.add_flag?this.props.system_patient_id: this.props.schedule_item.system_patient_id,
      moveConfirmModal:false,
      isShowTreatDoctorList:false,
      isAddConfirmModal:false,
      confirm_message:'',
      alert_message:'',
      confirm_alert_title:'',
      is_loaded: false,
    };
    this.double_click = false;
    this.change_flag = false;
  }
  
  async componentDidMount(){
    if (this.props.add_flag){
      this.setState({
        dial_prescriptions:[],
      })
    } else {
      if (this.props.from_source == 'bedside'){
        this.setState({
          dial_prescriptions:this.props.schedule_item,
        })
        
      } else {
        let path = "/app/api/v2/dial/schedule/dial_prescription_search";
        let post_data = {
          params:{"schedule_date":formatDateLine(this.props.schedule_item.schedule_date), "patient_id":this.props.schedule_item.system_patient_id},
        }
        await apiClient.post(path, post_data)
          .then((res) => {
            this.setState({
              dial_prescriptions:res,
            })
          });
      }
    }
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
  
  change_not_done = (index) => {
    if (this.props.from_source == 'bedside') return;
    var temp = this.state.dial_prescriptions;
    temp[index].is_completed = 0;
    temp[index].completed_by = null;
    temp[index].is_changed = true;
    this.setState({
      dial_prescriptions:temp,
    })
    this.change_flag = true;
  }
  
  
  change_done = (index) => {
    if (this.props.from_source == 'bedside') return;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var temp = this.state.dial_prescriptions;
    temp[index].is_completed = 1;
    temp[index].completed_by = authInfo.user_number;
    temp[index].is_changed = true;
    this.setState({
      dial_prescriptions:temp,
    })
    this.change_flag = true;
  }
  
  showTreatDoctorList = (index) => {
    if (this.props.from_source == 'bedside') return;
    if (this.state.dial_prescriptions[index].is_completed != 1) return;
    this.setState({
      isShowTreatDoctorList:true,
      selected_row_index:index,
    })
  }
  
  selectTreatDoctor = (doctor) => {
    if (this.props.from_source == 'bedside') return;
    var temp = this.state.dial_prescriptions;
    temp[this.state.selected_row_index].completed_by = doctor.number;
    temp[this.state.selected_row_index].is_changed = true;
    this.setState({dial_prescriptions:temp});
    this.change_flag = true;
    this.closeModal();
  }
  
  showAddMedicine = () => {
    this.setState({showMedicineList:true});
  }
  
  stopSchedule=(index) =>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var temp = this.state.dial_prescriptions;
    temp[index].is_canceled = 1;
    temp[index].canceled_by = authInfo.user_number;
    temp[index].is_changed = true;
    this.setState({
      dial_prescriptions:temp
    })
    this.change_flag = true;
  };
  
  handleClick = (e, index) => {
    if (this.props.from_source == 'bedside') return;
    // if (e.type === "contextmenu") {
    // e.preventDefault();
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
        x: e.clientX-$('.modal-dialog').offset().left,
        y: e.clientY -$('.modal-dialog').offset().top - 40,
        index:index
      },
      
    });
    // }
  }
  
  checkValidation = () => {
    removeRedBorder("entry_time_id");
    let error_str_arr = [];
    let tag_ids = [];
    let first_tag_id = '';
    let {dial_prescriptions} = this.state;
    if (dial_prescriptions != null && dial_prescriptions.length > 0) {
      dial_prescriptions.map((item, index) => {
        removeRedBorder('medicine_code_id' + index);
        removeRedBorder('amount_id' + index);
        removeRedBorder('timing_code_id' + index);
        let med_no_amoount = '';
        if (!(item.medicine_code>0)){
          error_str_arr.push('薬剤名称を選択してください');
          addRedBorder('medicine_code_id' + index);
          tag_ids.push('medicine_code_id' + index);
        }
        
        if (!(item.amount>0)){
          if (item.medicine_code>0){
            med_no_amoount = this.getMedName(item.medicine_code);
            if (med_no_amoount != ''){
              error_str_arr.push(med_no_amoount + 'の数量を入力してください。');
            }
          }
          addRedBorder('amount_id' + index);
          tag_ids.push('amount_id' + index);
        }
        
        if (!(item.timing_code>0)){
          error_str_arr.push('実施タイミングを選択してください');
          addRedBorder('timing_code_id' + index);
          tag_ids.push('timing_code_id' + index);
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
  
  save = async() => {
    if (!this.change_flag) return;
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.EDIT) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    if(this.state.instruction_doctor_number == ''){
      this.showDoctorList();
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
      isAddConfirmModal:true,
      confirm_message:'変更しますか？'
    })
  };
  
  confirmSave = async() => {
    this.confirmCancel();
    let path = "/app/api/v2/dial/schedule/dial_prescription_schedule_update";
    var dial_prescriptions = this.state.dial_prescriptions;
    if (dial_prescriptions == undefined || dial_prescriptions == null || dial_prescriptions.length == 0) return;
    var temp = [];
    dial_prescriptions.map(item => {
      if (item.is_changed) temp.push(item);
    })
    let update_data = {
      dial_prescriptions:temp,
      entry_date: formatDateLine(this.state.entry_date),
      entry_time: formatTime(this.state.entry_time),
      instruction_doctor_number: this.state.instruction_doctor_number
    };
    
    const post_data = {
      params: update_data
    };
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient.post(path, post_data).then(res=>{
      var title = '';
      var message = res.alert_message;
      if (message.indexOf('変更') > -1) title = "変更完了##";
      if (message.indexOf('登録') > -1) title = "登録完了##";
      window.sessionStorage.setItem("alert_messages", title + res.alert_message);
    }).finally(()=>{
      this.double_click=false;
    });
    if (this.props.add_flag){
      this.props.handleOk(this.state.schedule_date);
    } else {
      this.props.handleOk(this.state.schedule_item.schedule_date);
    }
  }
  
  selectDoctor = (doctor) => {
    if (this.props.from_source == 'bedside') return;
    this.setState({
      directer_name:doctor.name,
      instruction_doctor_number:doctor.number
    });
    this.context.$updateDoctor(doctor.number, doctor.name);
    
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
  
  closeModal = () => {
    this.setState({
      isShowDoctorList:false,
      isShowStaffList:false,
      showMedicineList:false,
      isShowTreatDoctorList:false,
    });
  }
  
  getName = (e, index) => {
    let temp = this.state.dial_prescriptions;
    temp[index].medicine_code = e.target.id;
    temp[index].is_changed = true;
    this.setState({
      dial_prescriptions:temp,
    });
    this.change_flag = true;
  };
  
  getTiming = (e, index) => {
    let temp = this.state.dial_prescriptions;
    temp[index].timing_code = e.target.id;
    temp[index].is_changed = true;
    this.setState({
      dial_prescriptions:temp,
    });
    this.change_flag = true;
  };
  
  getAmount = (index, e) => {
    var regex = /^\d*\.?(?:\d{1,2})?$/;
    if(regex.test(e.target.value)){
      var temp = this.state.dial_prescriptions;
      temp[index].amount = e.target.value;
      temp[index].is_changed = true;
      this.setState({
        dial_prescriptions:temp,
      });
      this.change_flag = true;
    }
  }
  getUnit (medicine_code){
    var all_medicines = this.state.medicine_master;
    var medicine = all_medicines.filter(item => item.code == medicine_code);
    var unit = medicine !=undefined && medicine!=null && medicine.length>0?medicine[0].unit:'';
    return unit;
  }
  getMedName (medicine_code){
    var all_medicines = this.state.medicine_master;
    var medicine = all_medicines.filter(item => item.code == medicine_code);
    var name = medicine !=undefined && medicine!=null && medicine.length>0?medicine[0].name:'';
    return name;
  }
  
  addDialPres = (item) => {
    var temp = this.state.dial_prescriptions;
    var add_dial_presc = {
      number: null,
      system_patient_id:this.state.system_patient_id,
      type:1,
      medicine_code:item.code,
      amount:1,
      timing_code:1,
      schedule_date:this.state.schedule_date,
      enable_accounting:1,
      is_temporary: 0,
      is_canceled: 0,
      canceled_by: null,
      canceled_at: null,
      is_completed: 0,
      completed_by: null,
      completed_at: null,
      is_doctor_consented: 0,
      doctor_consented_at: null,
      is_enabled: 1,
      is_changed:true
    }
    temp.push(add_dial_presc);
    this.setState({
      dial_prescriptions:temp,
      showMedicineList:false,
    })
    this.change_flag = true;
  }
  
  closeThisModal = () => {
    if (this.change_flag){
      this.setState({
        moveConfirmModal:true,
        action:'close',
        confirm_message:"まだ登録していない内容があります。\n変更を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      })
    } else {
      this.props.closeModal();
    }
  }
  
  confirmCancel(){
    this.setState({
      moveConfirmModal:false,
      isAddConfirmModal:false,
      confirm_message:'',
      confirm_alert_title:''
    })
  }
  
  moveOk() {
    this.confirmCancel();
    this.props.closeModal();
    this.change_flag = false;
  }
  
  onHide=()=>{};
  openCalc = (type, val, index) => {
    let _state = {
      calcInit: val != undefined && val != null && val > 0 ? val : 0,
      calcValType: type,
      change_amount_index:index,
      isOpenCalcModal: true
    };
    
    let medicine_list = this.state.medicine_list;
    if (medicine_list != undefined && medicine_list != null && medicine_list[this.state.dial_prescriptions[index].medicine_code] != undefined && medicine_list[this.state.dial_prescriptions[index].medicine_code] != null) {
      _state.calcTitle = medicine_list[this.state.dial_prescriptions[index].medicine_code];
    }
    if (this.state.dial_prescriptions[index].medicine_unit != undefined && this.state.dial_prescriptions[index].medicine_unit != null && this.state.dial_prescriptions[index].medicine_unit != "") {
      _state.calcUnit = this.state.dial_prescriptions[index].medicine_unit;
    }
    
    this.setState(_state);
  }
  
  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcTitle: "",
      calcUnit: "",
      calcInit: 0
    });
  }
  
  calcConfirm = (val) => {
    let _state = {isOpenCalcModal: false};
    var regex = /^\d*\.?(?:\d{1,2})?$/;
    if(regex.test(val)){
      var temp = this.state.dial_prescriptions;
      temp[this.state.change_amount_index].amount = val;
      temp[this.state.change_amount_index].is_changed = true;
      this.change_flag = true;
      if (this.state.calcValType == "amount") {
        _state.dial_prescriptions = temp;
      }
    }
    _state.calcValType = "";
    _state.calcTitle = "";
    _state.calcUnit = "";
    _state.calcInit = 0;
    this.setState(_state);
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
    if (this.state.dial_prescriptions != undefined && this.state.dial_prescriptions != null && this.state.dial_prescriptions.length > 0){
      
      var list = this.state.dial_prescriptions;
      list.map((item, index) => {
        if (!(item.medicine_code>0)){
          addRequiredBg('medicine_code_id' + index);
        } else {
          removeRequiredBg('medicine_code_id' + index);
        }
        
        if (!(item.amount>0)){
          addRequiredBg('amount_id' + index);
        } else {
          removeRequiredBg('amount_id' + index);
        }
        
        if (!(item.timing_code>0)){
          addRequiredBg('timing_code_id' + index);
        } else {
          removeRequiredBg('timing_code_id' + index);
        }
      })      
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }
  
  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let {dial_prescriptions, staff_list_by_number, medicine_options_list} = this.state;
    dial_prescriptions = sortByTiming(dial_prescriptions, this.state.timingCodeData);
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal dailysis-prescription-modal width-70vw-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            透析中処方{this.props.from_source =='bedside'?'': this.props.add_flag ? "登録" : "編集"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="modal_header">
              {this.props.add_flag && (
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
              {this.props.add_flag === false && (
                <>
                  <div className="schedule_date">
                    {formatJapanDate(this.state.schedule_item.schedule_date)}
                  </div>
                  <span className="patient_id">
                    {this.state.schedule_item.patient_number} :{" "}
                  </span>
                  <span className="patient_name">
                    {this.state.schedule_item.patient_name}
                  </span>
                </>
              )}
            </div>
            {this.state.is_loaded ? (
              <div className="dialyser_table">
                <div className="left">透析中処方</div>
                {this.props.from_source !='bedside' && (
                  <>
                    <div className="right" onClick={this.showAddMedicine}>
                      <Icon icon={faPlus} />
                      透析中処方追加
                    </div>
                  </>
                )}
                <div className="table-content">
                  <table className="table-scroll table table-bordered" id="dialyer-table">
                    <thead>
                    <tr>
                      <th className='kind-td'>区分</th>
                      <th className='name-td'>薬剤名称</th>
                      <th className='amount-td'>数量</th>
                      <th className='unit-td'>単位</th>
                      <th className='timing-td'>実施タイミング</th>
                      {/* <th>時間</th> */}
                      <th className='sending-td'>医事送信</th>
                      {this.props.from_source != 'bedside' ? (
                        <>
                          <th className='done-td'>実施</th>
                          <th>実施者</th>
                        </>
                      ) : (
                        <>
                          <th>曜日</th>
                        </>
                      )}
                    
                    </tr>
                    </thead>
                    <tbody>
                    {dial_prescriptions !== undefined &&
                    dial_prescriptions !== null &&
                    dial_prescriptions.length > 0 &&
                    staff_list_by_number != undefined &&
                    dial_prescriptions.map((item, index) => {
                      if (item.is_canceled !== 1) {
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
                            <tr
                              onContextMenu={(e) =>
                                this.handleClick(e, index)
                              }
                            >
                              <td className='kind-td'>{type_list[item.type]}</td>
                              <td className="medicine_name name-td">
                                <SelectorWithLabel
                                  options={medicine_options_list}
                                  getSelect={(e) => this.getName(e, index)}
                                  departmentEditCode={item.medicine_code}
                                  id = {'medicine_code_id' + index}
                                  isDisabled ={this.props.from_source == 'bedside' ? true : false}
                                />
                              </td>
                              <td className="medicine-amount amount-td">
                                <InputBoxTag
                                  label=""
                                  type="number"
                                  // getInputText={this.getAmount.bind(this,index)}
                                  value={item.amount}
                                  onClick={() =>
                                    this.openCalc("amount",item.amount,index)
                                  }
                                  id = {'amount_id' + index}
                                  isDisabled ={this.props.from_source == 'bedside' ? true : false}
                                />
                              </td>
                              <td className='unit-td'>{this.getUnit(item.medicine_code)}</td>
                              <td className="timing-code timing-td">
                                <SelectorWithLabel
                                  options={this.state.timing_options}
                                  getSelect={(e) => this.getTiming(e, index)}
                                  departmentEditCode={item.timing_code}
                                  id = {'timing_code_id' + index}
                                  isDisabled ={this.props.from_source == 'bedside' ? true : false}
                                />
                              </td>
                              {/* <td></td> */}
                              <td
                                className={`sending-td send-${item.enable_accounting}`}
                              >
                                {sending_info[item.enable_accounting]}
                              </td>
                              {this.props.from_source !='bedside' && (
                                <>
                                  {item.is_completed == 1 && (
                                    <td
                                      className="done-td text-center done_dialyser change"
                                      onClick={() => this.change_not_done(index)}
                                    >
                                      済
                                    </td>
                                  )}
                                  {item.is_completed == 0 && (
                                    <td
                                      className="done-td text-center not_done_dialyser change"
                                      onClick={() => this.change_done(index)}
                                    >
                                      未
                                    </td>
                                  )}
                                  <td className="completed-by clickable" onClick={this.showTreatDoctorList.bind(this,index)}>
                                    {item.completed_by > 0 ? staff_list_by_number[item.completed_by]: ""}
                                  </td>
                                </>
                              )}
                              {this.props.from_source =='bedside' && (
                                <>
                                  <td>{weekday_str}</td>
                                </>
                              )}
                            </tr>
                          </>
                        );
                      }
                    })}
                    </tbody>
                  </table>
                </div>
                {this.props.from_source != 'bedside' && (
                  <div className="register_info">
                    <div className="remove-x-input">
                      <InputWithLabel
                        label="入力日"
                        type="date"
                        getInputText={this.getInputdate}
                        diseaseEditData={this.state.entry_date}
                      />
                      <div className="cursor-text-area" style={{marginTop:"0.5rem"}}>
                        <InputBoxTag
                          label="入力者"
                          type="text"
                          placeholder=""
                          className="left"
                          isDisabled={true}
                          value={authInfo.name}
                        />
                      </div>
                    </div>
                    <div className="remove-x-input">
                      <div>
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
                      <div style={{marginTop:"0.5rem"}}>
                        {authInfo != undefined && authInfo != null && authInfo.doctor_number > 0 ? (
                          <InputWithLabel
                            label="指示者"
                            type="text"
                            isDisabled={true}
                            diseaseEditData={this.state.directer_name}
                          />
                        ) : (
                          <div className="direct_man cursor-input" onClick={(e)=>this.showDoctorList(e).bind(this)}>
                            <InputWithLabel
                              label="指示者"
                              type="text"
                              isDisabled={true}
                              diseaseEditData={this.state.directer_name}
                            />
                          </div>
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
                MasterCodeData={this.state.staffs}
                MasterName="スタッフ"
              />
            )}
            {this.state.showMedicineList && (
              <DialSelectMasterModal
                selectMaster={this.addDialPres}
                closeModal={this.closeModal}
                MasterCodeData={this.state.medicine_master}
                MasterName="薬剤"
              />
            )}
            
            {this.state.moveConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.moveOk.bind(this)}
                confirmTitle={this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}
            {this.state.isAddConfirmModal && (
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
            {this.state.isOpenCalcModal ? (
              <CalcDial
                calcConfirm={this.calcConfirm}
                units={this.state.calcUnit}
                calcCancel={this.calcCancel}
                daysSelect={false}
                daysInitial={0}
                daysLabel=""
                daysSuffix=""
                maxAmount={100000}
                calcTitle={this.state.calcTitle}
                calcInitData={this.state.calcInit}
              />
            ) : (
              ""
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button className="cancel-btn" onClick={this.closeThisModal}>キャンセル</Button> */}
          <div onClick={this.closeThisModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          {this.props.from_source != 'bedside' && (
            <Button className = {this.change_flag?'red-btn':'disable-btn'} onClick={this.save}>登録</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

EditDailysisPrescriptionSchedulModal.contextType = Context;

EditDailysisPrescriptionSchedulModal.propTypes = {
  closeModal: PropTypes.func,
  schedule_item:PropTypes.array,
  handleOk: PropTypes.func,
  patientInfo: PropTypes.object,
  schedule_date:PropTypes.string,
  system_patient_id: PropTypes.number,
  add_flag : PropTypes.bool,
  from_source: PropTypes.string,
};

export default EditDailysisPrescriptionSchedulModal;
