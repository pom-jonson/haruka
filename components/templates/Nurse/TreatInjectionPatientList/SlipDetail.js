import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
// import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import {formatDateSlash, formatDateTimeStr} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SlipDetailKnowledgeModal from "./SlipDetailKnowledgeModal";
import InjectionInInputModal from "./InjectionInInputModal";
// import TreatInInputModal from "./TreatInInputModal";
import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import { getStaffName} from "~/helpers/constants";
import {setDateColorClassName} from '~/helpers/dialConstants'
import {DatePickerBox} from "~/components/styles/DatePickerBox";
const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .div-title {
   height:2.3rem;
   line-height:2.3rem;
 }
 .div-value {
   height:2.3rem;
   line-height:2.3rem;
   border:1px solid #aaa;
   padding:0 0.3rem;
 }
 .react-datepicker{
   width: 130% !important;
   font-size: 1.25rem;
   .react-datepicker__month-container{
     width:79% !important;
     height:24.375rem;
   }
   .react-datepicker__navigation--next--with-time{
     right: 6rem;
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
    height: 2.3rem;
    width: 13rem;
    font-size:1rem;
    text-align:left;
   }
 }
 .check-area {
   margin-left:1rem;
   label {
    font-size: 1rem;
    line-height: 2.3rem;
    height: 2.3rem;
    margin-bottom: 0;
   }
 }
 .karte-status{
  margin-right: 1rem;
  .pullbox-title{
    width: 3rem;
    font-size: 1rem;
  }
  .pullbox-select{
    width: 7rem;
    height: 2.3rem;
    font-size: 1rem;
  }
 }
 .select-radio {
   label {
     line-height: 2.3rem;
     font-size: 1rem;
     margin-right:5rem;
   }
 }
 .btn-area {
   button {
     height:2.3rem;
     margin-right:0.5rem;
     font-size:1rem;
   }
 }
 .list-area {
   margin-top:0.5rem;
   width:100%;   
   overflow-y:auto;
   padding-left:10px;
   padding-right:10px;
   padding-top:2px;
   padding-bottom:2px;
   height: calc(95vh - 18rem);
   .div-row {
    margin-top: -1px;
    border:1px solid #aaa;
   }
   .row-title {
     width: 50%;
     border-right:1px solid #aaa;
     .left-area {
       width:5rem;
       border-right:1px solid #aaa;
       display: block;
       align-items: center;
     }
     .right-area {
       width:calc(100% - 5rem);
       padding: 0.3rem;
     }
   }
   .row-value {
     width:50%;
     align-items: flex-start;
     justify-content: space-between;
     border-left:none;
     padding: 0.2rem;
     .left-value {
        width:50%;
     }
     .right-value {
      width:50%;
     }
   }
   .load-area {
     width:100%;
     border:1px solid #aaa;
   }
 }
 .panel-menu {
    width: 100%;
    margin-bottom: 1rem;
    font-weight: bold;
    .menu-btn {
        width:50%;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:50%;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 600px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .button-area{
    margin-top:10px;
    margin-bottom:10px;
    padding-left:10px;
    padding-right:10px;
    position:relative;
    button{
      margin-right:20px;
    }
    .count-info{
      position:absolute;
      right:10px;
    }
  }
  .pannel-area{
    padding-left:10px;
    padding-right:10px;
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent}) => {  
  if (visible) {
      return (
        <ContextMenuUl>
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>              
            <li><div onClick={() => parent.contextMenuAction()}>取消し</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>修正実施</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>薬品終了</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>薬品終了取消し</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>未実施確認</div></li>
            <li><div onClick={() => parent.contextMenuAction("in_input")}>IN量入力</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>予定変更</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>キャンセル</div></li>
          </ul>
        </ContextMenuUl>
      );
  } else {
      return null;
  }
};

const STATUS_OPTIONS_NORMAL = [
  {id: 0, value: "全て"},
  {id: 1, value: "未実施"},
  {id: 2, value: "実施"}
];

class SlipDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done_time_type:0,
      selected_date:"",
      order_type:"",
      tab_id:0,      
      table_list: this.props.modal_data,
      isOpenSlipDetailKnowledgeModal: false,
      status_data:STATUS_OPTIONS_NORMAL,
      load_flag:true,
      isInInputModalOpen:false,
      treat_location_master: [],
      alert_messages:"",
      confirm_message:"",
      complete_message:"",
      select_status: 1,
    };

    this.staff_list = [];
    let staff_list = sessApi.getStaffList();
    if(staff_list != undefined && staff_list != null && Object.keys(staff_list).length > 0){
      Object.keys(staff_list).map(staff_number=>{
        this.staff_list[staff_number] = staff_list[staff_number]['name'];
      })
    }

    this.fixTimePermission = 0; // マスター権限 no limit
    this.fixTimePermission = 1; // 責任者権限 before 96 hours
    this.fixTimePermission = 2; // 実施権限 before 24 hours
  }
  async componentDidMount() {
    let path = "/app/api/v2/master/treat";
    let post_data = {
      general_id: 1,
      patient_id: this.props.patientInfo.patient_id
    };

    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          let treat_location = [{id:0,value:""}];
          if (res.treat_location != null && res.treat_location.length > 0){
            res.treat_location.map(item=>{
              treat_location.push({id:item.location_id, value: item.name})
            })
          }
          let _state = {
            all_data: res,
            classification_master:res.treat_classification,
            part_master:res.treat_part,
            position_master:this.treat_order_part_position_mode == 0 ? res.treat_position : undefined,
            side_master:res.treat_side,
            treat_location_master:treat_location,
            treat_department_definition:res.treat_department_definition,
            treat_part_definition:res.treat_part_definition,
            treat_item_unit:res.treat_item_unit,
            treat_set:res.treat_set,
            treat_item:res.treat_item,
            additions:res.additions,
            additions_check:{},
            additions_send_flag_check:{},
            load_flag:true,
          };                    
          
          this.setState(_state);          
        }
      })
      .catch(() => {
      });
  }
    
  setDoneTimeType = (e) => {
    this.setState({done_time_type:parseInt(e.target.value)});
  };

  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };

  setViewMode = (name, value) => {
    this.setState({[name]: value});
  }    

  closeModal=()=>{
    this.setState({
      alert_messages:"",
      openDoneComment:false,
      isInInputModalOpen:false,
      isOpenSlipDetailKnowledgeModal: false
    });  
  }

  handleClick = (e, _item, _type) => {
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
          .getElementById("wrapper")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("wrapper")
              .removeEventListener(`scroll`, onScrollOutside);
          });      
      var obj_dialog = document.getElementsByClassName('slip-detail')[0].getElementsByClassName('modal-dialog')[0];      
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - obj_dialog.offsetLeft,
          y: e.clientY + window.pageYOffset - obj_dialog.offsetTop,
        },
        selected_order: _item,
        order_type: _type
      });
    }
  }

  handleOpenSlipDetailKnowledgeModal = (_item, _type) => {
    // temporary source
    let test = 1;
    if (test == 1) return;

    this.setState({
      isOpenSlipDetailKnowledgeModal: true,
      selected_order: _item,
      order_type: _type
    });
  }

  setTab = ( e, val ) => {
    this.setState({
        tab_id:parseInt(val),        
    });
  };

  contextMenuAction = (_type) => {    
    if (_type == "in_input") { // IN量入力
      this.setState({
        isInInputModalOpen: true
      });
    }
    this.forceUpdate();
  }; 

  getOrderTitle = (_type, _karteStatus, _category) => {
    let result = "";
    result = _karteStatus == 1 ? "外来" : _karteStatus == 3 ? "入院" : "訪問診療";
    if (_category == "処置" && _type == "treat") {
      result += "処置";
    } else {
      result += "注射";
    }

    return result;
  }

  getImplementLocation = (_locationId) => {
    let result = "";

    if (this.state.treat_location_master.length < 1) return result;
    
    this.state.treat_location_master.map(item=>{
      if (_locationId == item.id) result = item.value;
    });

    return result;
  }

  getOrderStatus = (_type, _item) => {
    if (_type == "treat") { // treat
      if (_item.state == undefined || _item.state == null) {
        return "";
      }
      return _item.state == 0 ? "○": "●";
    } else { // injection
      if (_item.done_order == undefined || _item.done_order == null) {
        return "";
      }
      return _item.done_order == 0 ? "○": "●";
    }
  }

  getConvertDateTime = (_date=null, _type=null) => {
    let result = "";
    if(_date == undefined || _date == null || _date == "") return result;

    if (_type == "type_2") {
      result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2);
      return result;
    }

    result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2) + " ";
    if (_date.length > 10) {
      result = result + _date.substr(11, 2) + ":" + _date.substr(14, 2);
    }

    return result
  }

  handleInInputConfirmFunc = (_modalData) => {
    this.setState({
      isInInputModalOpen: false,
      order_type: "",    
    });
  }

  getSelectStatus = (e) => {
    this.setState({ select_status: parseInt(e.target.id) });
  }

  handleDone = () => {
    if (this.state.done_time_type == 2 && this.state.selected_date == "") {
      this.setState({
        alert_messages:"指定時間を入力してください。"
      });
      return;
    }

    let msg = "";
    if (this.state.done_time_type == 0) {
      msg = "現在時間で実施しますか？";
    } else if(this.state.done_time_type == 1) {
      msg = "予定時間で実施しますか？";
    } else {
      msg = "指定時間で実施しますか？";
    }
    this.setState({
      confirm_message: msg
    });
  }  

  applyDone = async (array_injection, array_treatment) => {
    let not_done_list_injection = array_injection;
    let not_done_list_treat = array_treatment;
    let done_count = 0;
    let api_done_count = 0;
    // injection
    if (not_done_list_injection.length > 0) {
      // if(this.state.done_time_type == 1) 予定時間で実施
      let path = "/app/api/v2/order/injection/execute";
      let post_data = {};
      let _patientInfo = karteApi.getPatient(this.props.patientInfo.patient_id);
      let current_insurance_type = _patientInfo != undefined && _patientInfo != null && _patientInfo.insurance_type != undefined && _patientInfo.insurance_type != null ? _patientInfo.insurance_type : 0;
      for (let i = 0; i < not_done_list_injection.length; i ++) {        
        post_data = {
          number: not_done_list_injection[i].number,
          system_patient_id: this.props.patientInfo.patient_id,
          insurance_type: current_insurance_type
        }
        if (not_done_list_injection[i].order_data.is_completed == 4 ) {
          let cnt_index = not_done_list_injection[i].cnt_index;
          let rp_index = not_done_list_injection[i].rp_index;
          let schedule_date = not_done_list_injection[i].schedule_date;
          let execute_info = not_done_list_injection[i].order_data.order_data[0].done_numbers[schedule_date][cnt_index];
          post_data.cnt_index = cnt_index;
          post_data.rp_index = rp_index;
          post_data.schedule_date = schedule_date;
          if (execute_info !== undefined && execute_info.time != undefined && execute_info.time == "") {
            // post_data.schedule_time = this.state.confirm_done_time;
            // continue; // 未定
          }
        }
        done_count ++;

        post_data.done_now_time = this.state.done_time_type; // ??時間で実施
        if (this.state.done_time_type == 2) {
          post_data.done_fix_time = formatDateTimeStr(this.state.selected_date);
        }

        await apiClient._post(
          path,
          {params: post_data})
          .then((res) => {
            if(res){
              api_done_count ++;
            }
          })
          .catch(() => {
            this.setState({
              complete_message: ""
            });
          })
      }           
    }    


    // treatment
    if (not_done_list_treat.length > 0) {    
      let path = "/app/api/v2/order/orderComplete";
      for (let i = 0; i < not_done_list_treat.length; i ++) {        
        let number = not_done_list_treat[i].order_data.order_data.header.number;
        let post_data = {
          type:'treatment',
          number,
          order_data:null,
        };
        let order_data = JSON.parse(JSON.stringify(not_done_list_treat[i].order_data.order_data));
        Object.keys(order_data.detail).map((detail_idx)=>{
          if(order_data.detail[detail_idx]['done_comment'] === ""){
            delete order_data.detail[detail_idx]['done_comment'];
          }
          if(this.use_done_info === 1){
            delete order_data.detail[detail_idx]['done_info'];
            delete order_data.detail[detail_idx]['done_info_detail_unit'];
            delete order_data.detail[detail_idx]['set_master'];
          }
        });
        post_data.order_data = order_data;

        post_data.done_now_time = this.state.done_time_type; // ??時間で実施
        if (this.state.done_time_type == 2) {
          post_data.done_fix_time = formatDateTimeStr(this.state.selected_date);
        }

        done_count ++;
        await apiClient._post(
          path,
          {params: post_data})
          .then((res) => {
            if(res){
              api_done_count ++;
            }
          })
          .catch(() => {
            this.setState({
              complete_message: ""
            });
          });
      }
    }

    if (done_count == api_done_count) {
      window.sessionStorage.setItem("alert_messages", "実施しました。");
      this.props.closeModalAndRefresh();
    } else {
      this.setState({
        complete_message: ""
      });
    }
  }

  confirmOk = () => {

    this.confirmCancel();
    
    if (this.state.select_status != 1) return;
    if (this.state.table_list.length < 1) return;
    
    let not_done_list_treat = [];
    let not_done_list_injection = [];
    this.state.table_list.map(ele=>{
      if (ele.category == "処置") {
        if (ele.state == 0) not_done_list_treat.push(ele);
      } else {
        if (ele.done_order == 0) not_done_list_injection.push(ele);
      }      
    });
    if(not_done_list_treat.length == 0 && not_done_list_injection.length == 0) return;    

    this.setState({
      complete_message: "実施中"
    }, async ()=>{
      await this.applyDone(not_done_list_injection, not_done_list_treat);
    });
  }

  confirmCancel = () => {
    this.setState({
      confirm_message: ""
    });
  }

  getBeforeDates = (_date, _nDays) => {
    let result = new Date(_date);
    result.setDate(result.getDate() - _nDays);

    return result;
  }

  getMinTime = () => {
    // let convert_date = new Date();
    // if (this.fixTimePermission == 0) {
      let convert_date = new Date(formatDateSlash(this.state.selected_date) + " 00:00:00"); 
    // }

    let cur_date = new Date();
    let cur_time = cur_date.getHours() + ":" + cur_date.getMinutes();

    if(this.fixTimePermission == 1) {
      if (formatDateSlash(this.state.selected_date) == formatDateSlash(this.getBeforeDates(this.props.treat_date, 4))) {
        convert_date = new Date(formatDateSlash(this.state.selected_date) + " " + cur_time + ":00");
      }
    } else if(this.fixTimePermission == 2) {
      if (formatDateSlash(this.state.selected_date) == formatDateSlash(this.getBeforeDates(this.props.treat_date, 2))) {
        convert_date = new Date(formatDateSlash(this.state.selected_date) + " " + cur_time + ":00");
      }
    }

    return convert_date;
  }

  getMaxTime = () => {
    // let result = new Date(formatDateSlash(new Date())+" 23:50:00");
    let convert_date = new Date(formatDateSlash(this.state.selected_date) + " 23:50:00"); 
    // let convert_date = new Date(formatDateSlash(new Date()) + " " + result.getHours()+":"+result.getMinutes() + ":00"); 
    let cur_date = new Date();
    let cur_time = cur_date.getHours() + ":" + cur_date.getMinutes();

    if (formatDateSlash(this.props.treat_date) == formatDateSlash(this.state.selected_date)) {
      convert_date = new Date(formatDateSlash(this.state.selected_date) + " " + cur_time + ":00"); 
    }

    // if (this.fixTimePermission == 0) {
    //   if (formatDateSlash(this.props.treat_date) == formatDateSlash(this.state.selected_date)) {
    //     convert_date = new Date(formatDateSlash(this.state.selected_date) + " " + cur_time + ":00"); 
    //   }
    // } else if(this.fixTimePermission == 1) {
    //   if (formatDateSlash(this.props.treat_date) == formatDateSlash(this.state.selected_date)) {
    //     convert_date = new Date(formatDateSlash(this.state.selected_date) + " " + cur_time + ":00"); 
    //   }
    // } else if(this.fixTimePermission == 2) {

    // }

    return convert_date;
  }

  getInjectionHeaderInfo = (_type, _item) => {
    
    let result = "";

    if (_item.order_data.is_completed == 4) { // period injection

      if (_type == "created_at") { // 指示開始日時
        if (_item.created_at != "") {
          result = _item.created_at.substr(0, 16);
        }
      } else if(_type == "completed_at") { // 実施日時
        if (_item.cnt_index != undefined && _item.rp_index != undefined && _item.order_data.order_data[0] != undefined && _item.order_data.order_data[0].done_numbers != undefined) {
          if (_item.order_data.order_data[0].done_numbers[_item.schedule_date][_item.cnt_index] != undefined && 
            _item.order_data.order_data[0].done_numbers[_item.schedule_date][_item.cnt_index].completed_at != undefined && 
            _item.order_data.order_data[0].done_numbers[_item.schedule_date][_item.cnt_index].completed_at != "") {

            result = _item.order_data.order_data[0].done_numbers[_item.schedule_date][_item.cnt_index].completed_at;
          }
        }
      } else if(_type == "doctor_by") { // 依頼者
        if (_item.order_data.doctor_name != "") {
          result = _item.order_data.doctor_name;
        }        
      } else if(_type == "completed_by") { // 実施者
        if (_item.cnt_index != undefined && _item.rp_index != undefined && _item.order_data.order_data[0] != undefined && _item.order_data.order_data[0].done_numbers != undefined) {
          if (_item.order_data.order_data[0].done_numbers[_item.schedule_date][_item.cnt_index] != undefined && 
            _item.order_data.order_data[0].done_numbers[_item.schedule_date][_item.cnt_index].completed_by != undefined && 
            parseInt(_item.order_data.order_data[0].done_numbers[_item.schedule_date][_item.cnt_index].completed_by) > 0) {
            result = getStaffName(_item.order_data.order_data[0].done_numbers[_item.schedule_date][_item.cnt_index].completed_by);
          }
        }
      }
      
    } else { // normal injection
      if (_type == "created_at") { // 指示開始日時
        if (_item.created_at != "") {
          result = _item.created_at.substr(0, 16);
        }
      } else if(_type == "completed_at") { // 実施日時
        if (_item.order_data.executed_date_time != "") {
          result = _item.order_data.executed_date_time.substr(0, 16);          
        }
      } else if(_type == "doctor_by") { // 依頼者
        if (_item.order_data.doctor_name != "") {
          result = _item.order_data.doctor_name;
        }
        
      } else if(_type == "completed_by") { // 実施者
        // console.log("completed_by");
      }
      
    }
    

    return result;

  }

  render() {
    let table_list_content = this.state.table_list.filter(ele=>{
      let category = ele.category == "処置" ? "treat" : "injection";
      if (this.state.select_status == 0) {
        return true;
      } else if(this.state.select_status == 2) {
        if (this.getOrderStatus(category, ele) == "●") {
          return true;
        } else {
          return false;
        }
      } else if(this.state.select_status == 1) {
        if (this.getOrderStatus(category, ele) == "○") {
          return true;
        } else {
          return false;
        }
      }
    });

    let min_time = this.getMinTime();
    min_time = new Date(min_time.getFullYear(), min_time.getMonth() + 1, min_time.getDate(), min_time.getHours(), min_time.getMinutes());
    let max_time = this.getMaxTime();
    max_time = new Date(max_time.getFullYear(), max_time.getMonth() + 1, max_time.getDate(), max_time.getHours(), max_time.getMinutes());    
    if (this.state.selected_date == "") {
      min_time = new Date(formatDateSlash(this.state.selected_date) + " 00:00:00");
      max_time = new Date(formatDateSlash(this.state.selected_date) + " 23:50:00");
    }
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm slip-detail first-view-modal"
        >
          <Modal.Header><Modal.Title>伝票詳細</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper className='wrapper' id = 'wrapper'>
                <div className={'flex'}>
                  <div className={`karte-status`}>
                    <SelectorWithLabel
                      title="状態"
                      options={this.state.status_data}
                      getSelect={this.getSelectStatus}
                      departmentEditCode={this.state.select_status}                    
                    />
                  </div>
                  <div className={'select-radio flex'}>
                    <Radiobox
                      label={'現在時間で実施'}
                      value={0}
                      getUsage={this.setDoneTimeType.bind(this)}
                      checked={this.state.done_time_type === 0}
                      disabled={true}
                      name={`done_time_type`}
                    />
                    <Radiobox
                      label={'予定時間で実施'}
                      value={1}
                      getUsage={this.setDoneTimeType.bind(this)}
                      checked={this.state.done_time_type === 1}
                      disabled={true}
                      name={`done_time_type`}
                    />
                    <Radiobox
                      label={'指定時間で実施'}
                      value={2}
                      getUsage={this.setDoneTimeType.bind(this)}
                      checked={this.state.done_time_type === 2}
                      disabled={true}
                      name={`done_time_type`}
                    />
                    {this.fixTimePermission == 0 && (
                      <DatePicker
                        locale="ja"
                        selected={this.state.selected_date}
                        onChange={this.setPeriod.bind(this,"selected_date")}
                        dateFormat="yyyy/MM/dd h:mm aa"
                        timeCaption="時間"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        maxTime={max_time}
                        maxDate={new Date(this.props.treat_date)}
                        disabled={this.state.done_time_type !== 2}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    )}
                    {this.fixTimePermission == 1 && (
                      <DatePicker
                        locale="ja"
                        selected={this.state.selected_date}
                        onChange={this.setPeriod.bind(this,"selected_date")}
                        dateFormat="yyyy/MM/dd h:mm aa"
                        timeCaption="時間"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        maxDate={new Date(this.props.treat_date)}
                        minDate={this.getBeforeDates(this.props.treat_date, 4)}
                        maxTime={max_time}
                        minTime={min_time}
                        disabled={this.state.done_time_type !== 2}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    )}
                    {this.fixTimePermission == 2 && (
                      <DatePicker
                        locale="ja"
                        selected={this.state.selected_date}
                        onChange={this.setPeriod.bind(this,"selected_date")}
                        dateFormat="yyyy/MM/dd h:mm aa"
                        timeCaption="時間"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        maxDate={new Date(this.props.treat_date)}
                        minDate={this.getBeforeDates(this.props.treat_date, 2)}
                        maxTime={max_time}
                        minTime={min_time}
                        disabled={this.state.done_time_type !== 2}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    )}
                  </div>
                </div>
                <div className={'flex'} style={{marginTop:"0.5rem"}}>
                  <div className={'div-title'} style={{width:"4rem"}}>患者ID</div>
                  <div className={'div-value'}>{this.props.patientInfo.patientNumber}</div>
                  <div className={'div-title'} style={{width:"5rem", marginLeft:"1.5rem"}}>患者氏名</div>
                  <div className={'div-value'}>{this.props.patientInfo.patientName}</div>
                  <div className={'div-title'} style={{width:"3rem", marginLeft:"1.5rem"}}>年齢</div>
                  <div className={'div-value'}>{this.props.patientInfo.age}</div>
                  <div className={'div-value'} style={{border:"none"}}>才</div>
                  <div className={'div-title'} style={{width:"3rem", marginLeft:"1.5rem"}}>性別</div>
                  <div className={'div-value'}>{this.props.patientInfo.gender == 1 ? "男性" : "女性"}</div>
                </div>
                <div className={'list-area'} id='list-area'>
                  {this.state.load_flag ? (
                    <>
                      {table_list_content.map(item=>{
                        
                        return(
                          <>
                            {item.category != undefined && item.category != null && item.category == "処置" ? (
                                <>
                                    <div className={'div-row'}>
                                      <div className={'flex'} style={{borderBottom:"1px solid #aaa"}}>
                                        <div className={'row-title'}>
                                          <div className={'flex'} style={{borderBottom:"1px solid #aaa",height:"60%"}}>
                                            <div className={'left-area'}>
                                              <button onClick={()=> this.handleOpenSlipDetailKnowledgeModal(item, "treat")} onContextMenu={e => this.handleClick(e, item, "treat")} style={{width:"100%", height:"100%"}}>{this.getOrderStatus("treat", item)}</button>
                                            </div>
                                            <div className={'right-area'}>
                                              <div>{this.getOrderTitle("treat", item.karte_status, item.category)}</div>
                                              <div>YYYY/MM/DD（AAA)</div>
                                            </div>
                                          </div>
                                          <div className={'flex'} style={{height:"40%"}}>
                                            <div className={'left-area'} style={{textAlign:"center", lineHeight:"2.5"}}>
                                              ｺﾒﾝﾄ
                                            </div>
                                            <div className={'right-area'}>                                            
                                            </div>
                                          </div>
                                        </div>
                                        <div className={'row-value flex'}>
                                          <div className={'left-value'}>
                                            <div>指示開始日時: {item.created_at.substr(0, 16)}</div>
                                            <div>実施日時: {item.completed_at != undefined && item.completed_at != null && item.completed_at != "" ? item.completed_at.substr(0, 16) : ""}</div>
                                            <div>指示受け日時:{item.instruction_receive_date != "" ? this.getConvertDateTime(item.instruction_receive_date) : ""}</div>
                                            <div>指示確認日時:</div>
                                          </div>
                                          <div className={'right-value'}>
                                            <div>依頼者: {item.order_data.order_data.header.doctor_name}</div>
                                            <div>実施者: {item.completed_at != undefined && item.completed_at != null && item.completed_at != "" ? getStaffName(item.completed_by) : ""}</div>
                                            <div>指示受け者:{item.instruction_receiver > 0 ? this.staff_list[item.instruction_receiver] : ""}</div>
                                            <div>指示確認者</div>
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{padding:"0.3rem", paddingLeft:'2rem'}}>
                                        {item.location_id > 0 && (                                
                                          <div>実施場所：{this.getImplementLocation(item.location_id)}</div>
                                        )}
                                        {item.order_data.order_data.detail.map(ele=>{
                                          return (
                                            <>
                                              {ele.set_name != "" && (
                                                <div>セット：{ele.set_name}</div>
                                              )}
                                              {ele.practice_name != "" && (
                                                <div>処置：{ele.practice_name}</div>
                                              )}
                                              {ele.request_name != "" && (
                                                <div>請求：{ele.request_name}</div>
                                              )}                                                                        
                                              {ele.treat_detail_item.length > 0 && ele.treat_detail_item.map(child=>{
                                                return(
                                                  <>
                                                    {child.classfic_name == "薬剤" && (
                                                      <div>薬剤：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                                    )}
                                                    {child.classfic_name == "医事コメント" && (
                                                      <div>医事コメント：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                                    )}
                                                    {child.classfic_name == "材料" && (
                                                      <div>材料：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                                    )}
                                                    {child.classfic_name == "実施情報" && (
                                                      <div>実施情報：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                                    )}
                                                    {child.classfic_name == "膀胱留置カテーテル" && (
                                                      <div>膀胱留置カテーテル：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                                    )}                                          
                                                  </>
                                                );
                                              })}
                                            </>
                                          );
                                        })}
                                      </div>
                            </div>
                                </>
                            ):(
                                <>
                                    <div className={'div-row'}>
                                      <div className={'flex'} style={{borderBottom:"1px solid #aaa"}}>
                                        <div className={'row-title'}>
                                          <div className={'flex'} style={{borderBottom:"1px solid #aaa",height:"60%"}}>
                                            <div className={'left-area'}>
                                              <button onClick={()=> this.handleOpenSlipDetailKnowledgeModal(item, "injection")} onContextMenu={e => this.handleClick(e, item, "injection")} style={{width:"100%", height:"100%"}}>{this.getOrderStatus("injection", item)}</button>
                                            </div>
                                            <div className={'right-area'}>
                                              <div>{this.getOrderTitle("injection", item.karte_status)}</div>
                                              <div>YYYY/MM/DD（AAA)</div>
                                            </div>
                                          </div>
                                          <div className={'flex'} style={{height:"40%"}}>
                                            <div className={'left-area'} style={{textAlign:"center", lineHeight:"2.5"}}>
                                              ｺﾒﾝﾄ
                                            </div>
                                            <div className={'right-area'}>                                            
                                            </div>
                                          </div>
                                        </div>
                                        <div className={'row-value flex'}>
                                          <div className={'left-value'}>
                                            <div>指示開始日時: {this.getInjectionHeaderInfo("created_at", item)}</div>
                                            <div>実施日時: {this.getInjectionHeaderInfo("completed_at", item)}</div>
                                            <div>指示受け日時: {item.instruction_receive_date != "" ? this.getConvertDateTime(item.instruction_receive_date) : ""}</div>
                                            <div>指示確認日時:</div>
                                          </div>
                                          <div className={'right-value'}>
                                            <div>依頼者: {this.getInjectionHeaderInfo("doctor_by", item)}</div>
                                            <div>実施者: {this.getInjectionHeaderInfo("completed_by", item)}</div>
                                            <div>指示受け者:{item.instruction_receiver > 0 ? this.staff_list[item.instruction_receiver] : ""}</div>
                                            <div>指示確認者</div>
                                          </div>
                                        </div>                                      
                                      </div>
                                      <div style={{padding:"0.3rem", paddingLeft:'2rem'}}>
                                        {item.order_data.location_name != "" && (                                
                                          <div>実施場所：{item.order_data.location_name}</div>
                                        )}
                                        {item.order_data.drip_rate != "" && (                                
                                          <div>点滴速度：{item.order_data.drip_rate}ml/h</div>
                                        )}
                                        {item.order_data.water_bubble != "" && (                                
                                          <div>1分あたり：{item.order_data.water_bubble}滴</div>
                                        )}
                                        {item.order_data.exchange_cycle != "" && (                                
                                          <div>交換サイクル：{item.order_data.exchange_cycle}時間</div>
                                        )}
                                        {item.order_data.require_time != "" && (                                
                                          <div>所要時間：{item.order_data.require_time}時間</div>
                                        )}
                                        {item.order_data.free_comment != "" && item.order_data.free_comment.length > 0 && item.order_data.free_comment[0] != null && item.order_data.free_comment[0] != "" && (                                
                                          <div>備考：{item.order_data.free_comment[0]}</div>
                                        )}                                      
                                        {item.order_data.order_data.map(ele=>{
                                          return (
                                            <>
                                              {ele.usage_name != "" && (
                                                <div>手技：{ele.usage_name}</div>
                                              )}                                            
                                              {ele.body_part != "" && (
                                                <div>部位/補足：{ele.body_part}</div>
                                              )}                                                                        
                                              {ele.med.length > 0 && ele.med.map(child=>{
                                                return(
                                                  <>                                                  
                                                    <div>薬剤：{child.item_name} {child.amount + child.unit}</div>   
                                                    {child.in_input_amount != undefined && child.in_input_amount != null && (
                                                      <div>IN量: {child.in_input_amount + child.unit}</div>                                                                                                 
                                                    )}
                                                  </>
                                                );
                                              })}
                                            </>
                                          );
                                        })}
                                      </div>
                                    </div>
                                </>
                            )}
                            
                          </>
                        );
                      })}
                    </>
                  ):(
                    <div className={'load-area'}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  )}
                </div>                        
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button onClick={this.handleDone} className={this.state.select_status == 1 && table_list_content.length > 0 ? "red-btn" : "disable-btn"}>{"確定"}</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}            
          />
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}           
          {this.state.isOpenSlipDetailKnowledgeModal === true && (
            <SlipDetailKnowledgeModal
              closeModal={this.closeModal}   
              selected_order={this.state.selected_order}
              patientInfo={this.props.patientInfo}
              treat_date={this.props.treat_date}           
              order_type={this.state.order_type}
            />
          )}           
          {this.state.isInInputModalOpen === true && this.state.order_type == "injection" && (
            <InjectionInInputModal
              closeModal={this.closeModal}   
              selected_order={this.state.selected_order}
              patientInfo={this.props.patientInfo}              
              order_type={this.state.order_type}
              patientId={this.props.patientInfo.patient_id}
              handleInInputConfirm={this.handleInInputConfirmFunc}
            />
          )} 
          {this.state.confirm_message !== "" && (
            <SystemConfirmModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}          
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}

          {/*{this.state.isInInputModalOpen === true && this.state.order_type == "treat" && (
            <TreatInInputModal
              closeModal={this.closeModal}   
              selected_order={this.state.selected_order}
              patientInfo={this.props.patientInfo}              
              order_type={this.state.order_type}
            />
          )}*/}
        </Modal>
      </>
    );
  }
}

SlipDetail.propTypes = {
  closeModal: PropTypes.func,
  closeModalAndRefresh: PropTypes.func,
  patientInfo: PropTypes.object,
  modal_data: PropTypes.array,
  treat_date: PropTypes.string,  
};

export default SlipDetail;
