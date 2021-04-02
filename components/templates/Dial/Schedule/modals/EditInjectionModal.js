import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import {
  formatDateLine,
  formatJapanDate, 
  formatTime, 
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as methods from "../../DialMethods";
import * as apiClient from "~/api/apiClient";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import $ from "jquery";
import EditInjectionPattern from "../../Board/molecules/EditInjectionPattern";
import axios from "axios/index";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_code, sortTimingCodeMaster, makeList_codeName, sortByTiming, getWeekday, toHalfWidthOnlyNumber, displayInjectionName} from "~/helpers/dialConstants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {getServerTime} from "~/helpers/constants";
import renderHTML from "react-render-html";

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
  .entry_name{
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
  .entry_staff_number input{
    pointer-events: none;
  }
  
  .left{
    float:left;
    font-size:1rem;
  }

  .right{
    float:right;
    font-size:0.9rem;
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
      max-height: 7.5rem;
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
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
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
      }
      word-break: break-all;
      .pullbox-select{
        height: 2.5rem;
      }
    }
    .set-td{
      width:50px;
    }
    .kind-td{
      width:80px;
    }
    .name-td{
      // width:200px;
      width:240px;
    }
    .amount-td{
      width:40px;
    }    
    .timing-td{
      width:180px;
    }    
    .done-td{
      width:35px;
    }
  }
  
  .done_dialyser{
    background-color:rgb(105, 200, 225);
  }
  .not_done_dialyser{
    background-color:lightgrey;
  }
  .td-cursor {
    cursor: pointer;
  }
  .checkbox_area {
    padding-left: 15px;
  }  
  .register_info{
    padding-left: 50px;
  }
  .inline_input{
    display:flex;
    .label-title, label{
      width:70px;
      text-align:right;
      margin-right:10px;
      font-size:12px;
    }
    .label-date{
      padding-top:5px;
    }
    input{
      width:200px;
    } 
    .input-time {
        margin-top: 8px;
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
    padding: 0 20px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({
                         visible,
                         x,
                         y,
                         parent,
                         index,
                            type,
                     }) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li>
                        <div onClick={() =>parent.contextMenuAction(index, type, 'edit')}>編集</div>
                    </li>
                    <li>
                        <div onClick={() =>parent.contextMenuAction(index, type, 'stop')}>中止</div>
                    </li>
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class EditInjectionModal extends Component {
  constructor(props) {
    super(props);
      Object.entries(methods).forEach(([name, fn]) =>
          name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
      );
    
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var timingCodeData = sortTimingCodeMaster(code_master['実施タイミング']);
    let schedule_item =sortByTiming(this.props.schedule_item, timingCodeData);
    this.state = {
      schedule_item,
      directer_name:"",
      entry_name: "",
      entry_date: '',
      entry_time: '',
      isEditInjectionPatternModal: false,
      isUpdateConfirmModal: false,
      isShowDoctorList:false,
      is_temporary:0,
      edit_number:0,
      instruction_doctor_number: "",
      timingCodeData,
      timing_codes:makeList_code(timingCodeData),
      timing_options:makeList_codeName(timingCodeData, 1),
      moveConfirmModal:false,
      isShowTreatDoctorList:false,
      confirm_message:'',
      confirm_alert_title:''
    };
    this.change_flag = false;
    this.injection_master = sessApi.getObjectValue("dial_common_master","injection_master");
  }

    async componentDidMount(){
      await this.getStaffs();
      await this.setDoctors();
      let server_time = await getServerTime();
      let state_data = {};
      state_data['entry_date'] = new Date(server_time);
      state_data['entry_time'] = new Date(server_time);
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

  change_done = (index, complete_status, is_temporary) => {
    if (this.props.from_source =='bedside') return;
      if(is_temporary !== 2){
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          let data = this.state.schedule_item;
          data[index].is_completed = complete_status;
          if(complete_status === 0){
              data[index].completed_by = null;
          } else {
              data[index].completed_by = authInfo.user_number;
          }
          data[index].is_changed = true;
          this.setState({
              schedule_item:data,
          })
      }
      this.change_flag = true;
  }

  showTreatDoctorList = (index, is_temporary) => {
    if (this.props.from_source =='bedside') return;
    if (is_temporary == 2) return;
    if (this.state.schedule_item[index].is_completed != 1) return;
    this.setState({
      isShowTreatDoctorList:true,
      selected_row_index:index,
    })
  }
  selectTreatDoctor = (doctor) => {
    var temp = this.state.schedule_item;
    temp[this.state.selected_row_index].completed_by = doctor.number;
    temp[this.state.selected_row_index].is_changed = true;
    this.setState({schedule_item:temp});
    this.change_flag = true;
    this.closeModal();
  }
  
  async editInjectionSchedule()  {
    var schedule_item = this.state.schedule_item;
    if (schedule_item == undefined || schedule_item == null || schedule_item.length == 0) return;
    var temp = [];
    schedule_item.map(item => {
      if (item.is_changed) temp.push(item);
    })
    let path = "/app/api/v2/dial/schedule/editInjectionSchedule";    
    const post_data = {
        schedule_item: temp,
        entry_time: formatTime(this.state.entry_time),
        entry_date: formatDateLine(this.state.entry_date),
        instruction_doctor_number: this.state.instruction_doctor_number,
    };
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient.post(path, {param:post_data}).then(()=>{
      window.sessionStorage.setItem("alert_messages", "変更完了##" + 'スケジュールを変更しました。');
    }).finally(()=>{
        this.double_click = false;
    });
    this.change_flag = false;
  }

  save = () => {
    if (this.change_flag == false) return;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.EDIT) === false) {
          window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
          return;
      }
      if(this.state.entry_time === ''){
          window.sessionStorage.setItem("alert_messages", '入力時間を入力してください。');
          return;
      }
      if(this.state.entry_date === ''){
          window.sessionStorage.setItem("alert_messages", '入力日を入力してください。');
          return;
      }
      if(this.state.instruction_doctor_number === '' || this.state.instruction_doctor_number == null || this.state.instruction_doctor_number === 0){
          // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
          this.showDoctorList();
          return;
      }
      if(authInfo.doctor_number > 0 && this.state.instruction_doctor_number !== authInfo.doctor_number){
          window.sessionStorage.setItem("alert_messages", '指示者を正確に選択してください。');
          return;
      }
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "変更しますか？"
      });      
  }

  handleSaveEditSchedule = () => {
    this.editInjectionSchedule();
    this.props.handleOk(this.props.schedule_date,this.props.is_edit);
  }


    handleClick = (e, index, type) => {
      if (this.props.from_source =='bedside') return;
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
            if(type){
                document
                    .getElementById("injection-table-temp")
                    .addEventListener("scroll", function onScrollOutside() {
                        that.setState({
                            contextMenu: { visible: false }
                        });
                        document
                            .getElementById("injection-table-tmp")
                            .removeEventListener(`scroll`, onScrollOutside);
                    });

            } else {
                document
                    .getElementById("injection-table")
                    .addEventListener("scroll", function onScrollOutside() {
                        that.setState({
                            contextMenu: { visible: false }
                        });
                        document
                            .getElementById("injection-table")
                            .removeEventListener(`scroll`, onScrollOutside);
                    });

            }
            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX - $('.dialyser_table').offset().left,
                    y: e.clientY -$('.dialyser_table').offset().top + 120,
                },
                index: index,
                type: type,
            });
        }
    }

    contextMenuAction = (index, type, action) => {
      if(action === "edit"){
          // if(this.change_flag){
          //   this.setState({
          //       moveConfirmModal:true,
          //       action:'edit',
          //       edit_number:this.state.schedule_item[index].number,
          //       selected_type:type,
          //       confirm_message:"まだ登録していない内容があります。\n変更を破棄して移動しますか？",
          //       confirm_alert_title:'入力中',
          //   })
          // } else {
            this.setState({
                isEditInjectionPatternModal:true,
                is_temporary: type,
                edit_number: this.state.schedule_item[index].number,
            });
          // }

      } else {
          let data = this.state.schedule_item;
          data[index].is_canceled = 1;
          data[index].is_changed = true;
          this.setState({
              schedule_item:data,
          })
          this.change_flag = true;
      }
    };

    OpenEditInjectionPatternModal = ( type ) => {
        // if(this.change_flag){
        //     this.setState({
        //         moveConfirmModal:true,
        //         action:'add',
        //         edit_number:0,
        //         selected_type:type,
        //         confirm_message:"まだ登録していない内容があります。\n変更を破棄して移動しますか？",
        //         confirm_alert_title:'入力中',
        //     })
        // } else {
            this.setState({
                isEditInjectionPatternModal:true,
                is_temporary: type,
                edit_number: 0
            });
        // }
        
    }

    moveOk(action) {
        this.confirmCancel();
        if (action =='add' || action == 'edit'){
            this.setState({
                isEditInjectionPatternModal:true,
                is_temporary:this.state.selected_type,
                edit_number:this.state.edit_number,
            })
        }
        if (action == 'close'){
            this.props.closeModal();
            this.change_flag = false;
        }
        
    }

    confirmCancel(){
        this.setState({
            moveConfirmModal:false,
            isUpdateConfirmModal:false,
            confirm_message:'',
            confirm_alert_title:''
        })
    }


    selectDoctor = (doctor) => {
        this.setState({
            directer_name:doctor.name,
            instruction_doctor_number:doctor.number,
        });
        this.context.$updateDoctor(doctor.number, doctor.name);

        this.closeDoctorSelectModal();
    }

    closeDoctorSelectModal = () => {
        this.setState({
            isShowDoctorList:false,
        });
    }

    showDoctorList = (e) => {

      // ■DN601 入力者関連のラベルのカーソルの統一
      if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        if(authInfo.doctor_number > 0){
            this.setState({
                instruction_doctor_number: authInfo.doctor_number
            })
        } else {
            this.setState({
                isShowDoctorList:true
            });
        }
    }

    handleOk = async() => {
        this.closeModal();
        let path = "/app/api/v2/dial/schedule/injection_schedule_search";
        let post_data = {};
            post_data = {
                is_temporary: this.props.is_temporary,
                schedule_date: (this.props.schedule_item[0] != undefined && this.props.schedule_item[0] != null) ? this.props.schedule_item[0].schedule_date : this.props.schedule_date,
                patient_id: (this.props.schedule_item[0] != undefined && this.props.schedule_item[0] != null) ? this.props.schedule_item[0].system_patient_id : this.props.patientInfo.system_patient_id,
            };

        await axios.post(path, {params: post_data}).then((res)=>{
            let data = res.data;
            this.setState({
                schedule_item:data,
            })
        });
        if (this.context.selectedDoctor.code > 0) {
            this.setState({
                instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
                directer_name: this.context.selectedDoctor.name
            });
        }
        this.change_flag = true;
        this.forceUpdate();
    }

    closeModal = () => {
        this.setState({
            isEditInjectionPatternModal: false,
            isShowTreatDoctorList:false,
            isShowDoctorList:false,
        });
    };

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

    onHide=()=>{}

  confirmOk = () => {
    this.setState({
      confirm_message: "",
      isUpdateConfirmModal: false
    });
    this.handleSaveEditSchedule(); 
  }

  getInjectionUnit (code) {
    if (this.injection_master == undefined || this.injection_master == null || this.injection_master.length == 0) return '';
    if (code == undefined || code == null || code == '') return '';
    var inject = this.injection_master.find(x => x.code == code);
    if (inject == undefined) return ''
    var unit = inject.unit;
    if (unit == undefined || unit == null) return '';
    return unit;
  }

  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let schedule_data = [];    
    schedule_data = sortByTiming(this.state.schedule_item, this.state.timingCodeData);    
    var {timing_codes}  = this.state;    
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal dailysis-prescription-modal edit-inject-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>注射{this.props.from_source == 'bedside'?'':'編集'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="modal_header">
              {this.props.from_source != 'bedside' && (
                <>
                <div className="schedule_date">                
                  {formatJapanDate(
                    schedule_data[0] != undefined && schedule_data[0] != null
                      ? schedule_data[0].schedule_date
                      : this.props.schedule_date
                  )}
                </div>
                <span className="patient_id">
                  {schedule_data[0] != undefined && schedule_data[0] != null
                    ? schedule_data[0].patient_number
                    : this.props.patientInfo.patient_number}{" "}
                  :{" "}
                </span>
                <span className="patient_name">
                  {schedule_data[0] != undefined && schedule_data[0] != null
                    ? schedule_data[0].patient_name
                    : this.props.patientInfo.patient_name}
                </span>
                </>
              )}
            </div>
            <div className="dialyser_table">
              {(this.props.is_temporary === 0 ||
                this.props.is_temporary === 2) && (
                <>
                  <div className="left">定期注射</div>
                  {this.props.from_source != 'bedside' && (
                    <div className="right" onClick={() => this.OpenEditInjectionPatternModal(0)}>
                      <Icon icon={faPlus} />
                      定期注射を追加
                    </div>
                  )}
                  <div className="table-content">
                    <table
                      className="table-scroll table table-bordered"
                      id="injection-table"
                    >
                      <thead>
                        <tr>
                          <th className='set-td'>セット</th>
                          <th className='kind-td'>区分</th>
                          <th className='name-td'>注射名称</th>
                          {/* <th className='amount-td'>数量</th> */}
                          <th className='timing-td'>実施タイミング</th>
                          {this.props.from_source != 'bedside' && (
                            <>
                            <th className='done-td'>実施</th>
                            <th>実施者</th>
                            </>
                          )}
                          {this.props.from_source == 'bedside' && (
                            <><th>曜日</th></>
                          )}
                        </tr>
                      </thead>
                      <tbody style={{maxHeight:this.props.from_source == 'bedside' ? '15rem' : '7.5rem'}}>
                        {schedule_data !== undefined &&
                          schedule_data !== null &&
                          schedule_data.length > 0 &&                           
                          this.state.schedule_item.map((item, index) => {
                            var week_days =null;
                            var weekday_str = '';
                            if (item.weekday>0) week_days = getWeekday(item.weekday);
                            if (week_days != null){
                              week_days.map(val => {
                                weekday_str += val;
                              })
                            }                            
                            if (this.props.from_source =='bedside' || (item.is_temporary === 0 && item.is_canceled == 0)) {
                              return (
                                <>
                                  <tr onContextMenu={(e) => this.handleClick(e, index, 0)}>
                                    <td className="text-center set-td">
                                      {item.set_number}
                                    </td>
                                    <td className="kind-td text-left">
                                      {item.injection_category}
                                    </td>
                                    <td className='text-left name-td'>
                                      {item.data_json.map(injection => {
                                        if (injection.item_name != ''){
                                          var unit = this.getInjectionUnit(injection.item_code);
                                          return(
                                            <>
                                            <div>{renderHTML(displayInjectionName(injection.item_code, injection.item_name))} &nbsp;&nbsp;{injection.amount}{unit}</div>
                                            </>
                                          )
                                        }
                                      })}
                                    </td>
                                    {/* <td className='text-right amount-td'>{item.data_json[0].amount}</td> */}
                                    <td className='text-left timing-td'>{timing_codes[item.timing_code]}</td>
                                    {this.props.from_source != 'bedside' && (
                                      <>
                                      {item.is_completed === 1 ? (
                                        <td className={"text-center done_dialyser td-cursor done-td"} onClick={() =>this.change_done(index, 0, 0)}>済</td>
                                      ) : (
                                        <td className={"text-center not_done_dialyser td-cursor done-td"} onClick={() =>this.change_done(index, 1, 0)}>未</td>
                                      )}
                                      <td className='clickable' onClick={this.showTreatDoctorList.bind(this,index,0)}>
                                        {this.state.staff_list_by_number != undefined && item.completed_by != null && this.state.staff_list_by_number[item.completed_by] != undefined
                                          ? this.state.staff_list_by_number[
                                              item.completed_by
                                            ]
                                          : ""}
                                      </td>
                                      </>
                                    )}
                                    {this.props.from_source == 'bedside' && (
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
                </>
              )}

              {(this.props.from_source != 'bedside' && (this.props.is_temporary === 1 || this.props.is_temporary === 2)) && (
                <>
                  <div className="left">臨時注射</div>
                  {this.props.from_source != 'bedside' && (
                    <>
                    <div className="right" onClick={() => this.OpenEditInjectionPatternModal(1)}>
                      <Icon icon={faPlus} />
                      臨時注射を追加
                    </div>
                    </>
                  )}
                  <div className="table-content">
                    <table
                      className="table-scroll table table-bordered"
                      id="injection-table-temp"
                    >
                      <thead>
                        <tr>
                          <th className='set-td'>セット</th>
                          <th className='kind-td'>区分</th>
                          <th className='name-td'>注射名称</th>
                          {/* <th className='amount-td'>数量</th> */}
                          <th className='timing-td'>実施タイミング</th>                          
                          <th className='done-td'>実施</th>
                          <th>実施者</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule_data !== undefined &&
                          schedule_data !== null &&
                          schedule_data.length > 0 &&                          
                          this.state.schedule_item.map((item, index) => {
                            if (
                              item.is_temporary === 1 &&
                              item.is_canceled == 0
                            ) {
                              return (
                                <>
                                  <tr
                                    onContextMenu={(e) =>
                                      this.handleClick(e, index, 1)
                                    }
                                  >
                                    <td className="text-center set-td">
                                      {item.set_number}
                                    </td>
                                    <td className="text-left kind-td">
                                      {item.injection_category}
                                    </td>
                                    <td className='name-td text-left'>
                                      {item.data_json.map(injection => {
                                        if (injection.item_name != ''){
                                          var unit = this.getInjectionUnit(injection.item_code);
                                          return(
                                            <>
                                            <div>{renderHTML(displayInjectionName(injection.item_code, injection.item_name))} &nbsp;&nbsp;{injection.amount}{unit}</div>
                                            </>
                                          )
                                        }
                                        
                                      })}
                                    </td>
                                    {/* <td className='amount-td text-right'>{item.data_json[0].amount}</td> */}
                                    <td className='timing-td text-left'>{timing_codes[item.timing_code]}</td>                                    
                                    {item.is_completed === 1 ? (
                                      <td className={"text-center done_dialyser td-cursor done-td"}
                                        onClick={() =>this.change_done(index, 0, 1)}>済</td>
                                    ) : (
                                      <td className={"text-center not_done_dialyser td-cursor done-td"} onClick={() =>this.change_done(index, 1, 1)}>未</td>
                                    )}
                                    <td className='clickable' onClick={this.showTreatDoctorList.bind(this,index,1)}>
                                      {this.state.staff_list_by_number !=
                                        undefined &&
                                      item.completed_by != null &&
                                      this.state.staff_list_by_number[
                                        item.completed_by
                                      ] != undefined
                                        ? this.state.staff_list_by_number[
                                            item.completed_by
                                          ]
                                        : ""}
                                    </td>
                                  </tr>                                  
                                </>
                              );
                            }
                          })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {this.props.from_source !='bedside' && (
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
                  </div>
                  <div className="inline_input remove-x-input">
                    {this.state.staff_list_by_number != undefined && (
                      <div className="entry_name">
                        <InputBoxTag
                          label="入力者"
                          type="text"
                          placeholder=""
                          className="left"
                          isDisabled={true}
                          value={authInfo.name}
                          // value={this.state.schedule_item[0] != null && this.state.schedule_item[0].register_by > 0?this.state.staff_list_by_number[this.state.schedule_item[0].register_by]:''}
                        />
                      </div>
                    )}
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
              )}

            </div>
            {this.state.isEditInjectionPatternModal && (
              <EditInjectionPattern
                handleOk={this.handleOk}
                closeModal={this.closeModal}
                system_patient_id={schedule_data[0] != undefined && schedule_data[0] != null? schedule_data[0].system_patient_id: this.props.patientInfo.system_patient_id}
                schedule_date={schedule_data[0] != undefined && schedule_data[0] != null? schedule_data[0].schedule_date: this.props.schedule_date}
                is_temporary={this.state.is_temporary}
                modal_type={this.props.is_temporary}
                edit_number={this.state.edit_number}
                from_source = {this.props.from_source}
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

            {this.state.isShowDoctorList !== false && (
              <DialSelectMasterModal
                selectMaster={this.selectDoctor}
                closeModal={this.closeDoctorSelectModal}
                MasterCodeData={this.state.doctors}
                MasterName="医師"
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
            {this.state.isUpdateConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmOk.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
          </Wrapper>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            index={this.state.index}
            type={this.state.type}
          />
        </Modal.Body>
        <Modal.Footer>
          {/* <Button className="cancel-btn" onClick={this.closeThisModal}>キャンセル</Button> */}
          <div onClick={this.closeThisModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          {this.props.from_source != 'bedside' && (
            <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={this.save.bind(this)}>変更</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

EditInjectionModal.contextType = Context;

EditInjectionModal.propTypes = {
  closeModal: PropTypes.func,  
  schedule_item:PropTypes.array,
  handleOk:   PropTypes.func,
  is_temporary: PropTypes.number,
  patientInfo: PropTypes.array,
  schedule_date: PropTypes.string,
  history: PropTypes.object,
  is_edit: PropTypes.bool,
  from_source: PropTypes.string,
};

export default EditInjectionModal;
