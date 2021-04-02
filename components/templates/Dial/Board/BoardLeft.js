import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {
  faCapsules,
  faIdCardAlt,
  faMicroscope,
  faCheck,
  faTemperatureFrigid,
  faHistory
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MeasureModal from "./molecules/MeasureModal";
import BloodModal from "./molecules/BloodModal";
import TemperatureModal from "./molecules/TemperatureModal";
import DoneGeneralModal from "./molecules/DoneGeneralModal"
import DonePrescriptionModal from "./molecules/DonePrescriptionModal"
import TimeInputModal from "./molecules/TimeInputModal";
import BloodInputModal from "./molecules/BloodInputModal";
import DialSelectPunctureModal from "~/components/templates/Dial/Common/DialSelectPunctureModal";
import {formatTime, formatTimeIE, formatDateTimeIE} from "../../../../helpers/date";
import * as apiClient from "~/api/apiClient";
import * as methods from "../DialMethods";
import BedPopUpModal from "../modals/BedPopUpModal";
// import RecordSheetModal from "../modals/RecordSheetModal";
import { CACHE_SESSIONNAMES, 
  // getServerTime
} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import OperationLogModal from "./molecules/OperationLogModal";
import {Dial_tab_index, compareTwoObjects} from "~/helpers/dialConstants";
import PrintModal from "~/components/templates/Dial/Board/molecules/printSheets/PrintModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 150px;
  margin-right: 10px;
  height: calc( 100vh - 250px);
  text-align: center;
  margin-bottom: 10px;
  float: left;
  button {
    width: 150px;
    padding: 5px;
  }
  label {
      text-align: right;
  }  
  .div-group {
      div {
        width: 150px;
        font-size:14px;
        padding: 3px 0;
        border: solid 1px cadetblue;
        cursor: pointer;
        display: flex;
        flex-wrap: wrap;
        div {
            width: 50%;
            border: none;
        }
        .time-label {
            padding-left: 30px;
        }
        .time-area {
        }
      }
      .text-console{
        display: block;
        font-size: 18px;
        padding: 0;
        color: #0052aa;
        font-weight: bold;
        height: 30px;
        border-radius: 0.25rem;
        border-color: cadetblue !important;
      }
      .implementation_status {
        text-align: left;
        border: 1px solid white;
        svg {
            margin: 3px 5px 0px 10px;
        }
      }
  }
  .text-left {
    margin: 7px 0 0 0;
  }

 .status_0 {
    background: lightcoral;
    padding-left: 31px!important;
    color: white;
  }
  .status_1 {
    background: #2AB6C1;
    color: white;
  }
  .status_2 {
    background: lightgray;
    padding-left: 31px!important;
    color: #444;
    cursor:auto;
  }
  .border-bottom{
      border-bottom-color: cadetblue;
  }
  .time-selected {
    margin-top: -1px;
    padding: 0 !important;
    border-left-color: cadetblue !important;
    border-right-color: cadetblue !important;
    border-bottom-color: cadetblue !important;
  }
  .blue-text {
      color: #00e;
  }
  .cursor_pointer {
    cursor: pointer;
  }
  .preview {
        a {
           color: black;
           margin-left: 2px;
        }
   }
  #btn-group div{
    border-left: solid 1px cadetblue;
    border-right: solid 1px cadetblue;
    border-bottom: solid 1px cadetblue;
    cursor: pointer;
    width: 150px;
    font-size: 15px;
    text-align: left;
    padding: 5px 10px 5px 0px;
    color: black;
    a {
        margin-left: -5px;
    }
  }
   #btn-group .monitor {
    background: rgb(0, 119, 215);
    color: white !important;
    border-color: rgb(0, 119, 215);
  }
  #btn-group .preview {
    padding: 5px 5px 5px 5px;
  }
  .pullbox-select {
        width: 150px;
   }
   .yellow_color {
    background: #ffa500;
   }
   .disabled{
     opacity:0.5;
   }
 `;

const Icon = styled(FontAwesomeIcon)`
    font-size: 16px;
    margin: 0 10px 0 10px;
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
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
    }
    .border-bottom {
        border-bottom: 1px solid #cfcbcb;
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

const ContextMenu = ({visible,x,y,parent,}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className="border-bottom" onClick={() =>parent.contextMenuAction("from_console")}>コンソール取得</div>
          </li>
          <li>
            <div onClick={() => parent.contextMenuAction("input_data")}>データ入力</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
const ContextBloodMenu = ({visible,x,y,parent,}) => {
  if (visible) {
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    let console_display = conf_data.console_blood_pressure_manual_import;
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {console_display=="ON" && (
            <li><div className="border-bottom" onClick={() =>parent.contextMenuAction("from_console_blood")}>コンソール取得</div></li>
          )}
          {/* <li><div className="border-bottom" onClick={() => parent.contextMenuAction("add_blood")}>血圧追加</div></li> */}
          <li><div onClick={() => parent.contextMenuAction("edit_blood")}>血圧編集</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
const ContextTempMenu = ({visible,x,y,parent,}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div className="border-bottom" onClick={() => parent.contextMenuAction("add_temp")}>体温追加</div></li>
          <li><div onClick={() => parent.contextMenuAction("edit_temp")}>体温編集</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
const ContextPunctureMenu = ({visible,x,y,parent,}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div className="border-bottom" onClick={() => parent.contextMenuAction("add_puncture")}>穿刺スタッフ登録</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class BoardLeft extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");        
    this.state = {
      rows_temp: this.props.rows_temp,
      rows_blood: this.props.rows_blood,
      rows_measure: this.props.rows_measure,
      is_started : this.props.is_started != undefined ? this.props.is_started: 0,
      is_ended : this.props.is_ended != undefined ? this.props.is_ended: 0,
      start_time: this.props.ms_start_time !== undefined  && this.props.ms_start_time !== "" ? formatTime(this.props.ms_start_time) : '',
      end_time: this.props.ms_end_time !== undefined && this.props.ms_end_time !== "" ? formatTime(this.props.ms_end_time) : '',
      bed_name: this.props.bed_name,
      bed_number: this.props.bed_number,
      console_number: this.props.console_number,
      console_name: this.props.console_name,
      isMeasureModal:false,
      ended:false,
      patientInfo,
      schedule_date,
      isTimeModal: false,
      tabIndex:this.props.tabIndex,
      alert_messages:''
    };
    this.double_click = false;
    this.timer_flash = null;
    this.timer_pass = null;
    this.start_date_time = null;
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));

    this.showMeasureMenu = 1;
    this.showBloodMenu = 1;
    this.showTempMenu = 1;

    this.prev_props = JSON.parse(JSON.stringify(this.props));
  }
  componentDidMount () {
    var bed_data = sessApi.getObjectValue("dial_common_master","bed_master");
    bed_data = bed_data.filter(x=>x.is_enabled == 1);
    var console_list = sessApi.getObjectValue("dial_common_master","console_master");
    console_list = console_list.filter(x=>x.is_enabled == 1);
    
    this.setState({
      bed_data,
      console_list,
    });
    this.timer_pass = setInterval(() => {
      this.getPassTime();
    }, 1000*50);
    this.getStaffs();
  }

  shouldComponentUpdate(nextprops, nextstate) {    
    nextprops = JSON.parse(JSON.stringify(nextprops));    
    if (compareTwoObjects(nextprops, this.prev_props) && compareTwoObjects(nextstate, this.state)) return false;
    this.prev_props = JSON.parse(JSON.stringify(nextprops));        
    return true;
  }

  onMonitor = () => {
    this.props.tabChange(0);
  };
  
  onMeasure = (e) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      this.setState({alert_messages:'患者様を選択してください。'})      
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if(schedule_data == undefined || schedule_data == null || schedule_data.number == undefined){
      this.setState({alert_messages:'スケジュールを登録してください。'})      
      return;
    }
    if(schedule_data.console_start_date == null && schedule_data.start_date == null){
      this.setState({alert_messages:'スケジュールを開始してください。'})      
      return;
    }
    if(this.props.recvData == undefined) return;
    if (this.showMeasureMenu == 0) return;
    
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      if (that.showMeasureMenu == 1) return;
      that.showMeasureMenu = 1;
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
      .getElementById("btn-group")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        document
          .getElementById("btn-group")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    this.showMeasureMenu = 0;
    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY + window.pageYOffset
      },
    });
  };
  
  onBlood = (e) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      this.setState({alert_messages:'患者様を選択してください。'});      
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if(schedule_data == undefined || schedule_data == null || schedule_data.number == undefined){
      this.setState({alert_messages:'スケジュールを登録してください。'});
      return;
    }
    if(this.props.recvData === undefined ) return;       // for test
    if (this.showBloodMenu == 0) return;    
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      if (that.showBloodMenu == 1) return;
      that.showBloodMenu = 1;
      that.setState({ contextBloodMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextBloodMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("btn-group")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextBloodMenu: { visible: false }
        });
        document
          .getElementById("btn-group")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    this.showBloodMenu = 0;
    this.setState({
      contextBloodMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY + window.pageYOffset
      },
    });    
  };
  
  closeBloodModal = (isBloodModal) => {
    isBloodModal ? this.setState({isAddBloodModal: false}) : this.setState({isBloodModal: false});
    this.setState({isBloodModal: false},() =>{
      this.props.stopFlash("blood");
    });
  };
  
  closePunctureModal = () => {
    this.setState({
      isPunctureModal: false
    });
  };
  onTemperature = (e) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      this.setState({alert_messages:'患者様を選択してください。'})
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if(schedule_data == undefined || schedule_data == null || schedule_data.number == undefined){
      this.setState({alert_messages:'スケジュールを登録してください。'})      
      return;
    }
    if(this.props.recvData === undefined ) return;
    if (this.showTempMenu == 0) return;    
    
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      if (that.showTempMenu == 1) return;
      that.showTempMenu = 1;
      that.setState({ contextTempMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextTempMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("btn-group")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextTempMenu: { visible: false }
        });
        document
          .getElementById("btn-group")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    this.showTempMenu = 0;
    this.setState({
      contextTempMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY + window.pageYOffset
      },
    });
  };
  
  handlePunctureClick = (e) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      this.setState({alert_messages:'患者様を選択してください。'});      
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if(schedule_data == undefined || schedule_data == null || schedule_data.number == undefined){
      this.setState({alert_messages:'スケジュールを登録してください。'});      
      return;
    }
    if(this.props.recvData === undefined ) return;    
    
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextPunctureMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextPunctureMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("div-group")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextPunctureMenu: { visible: false }
        });
        document
          .getElementById("div-group")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    this.setState({
      contextPunctureMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY + window.pageYOffset
      },
    });
  };
  
  closeTemperatureModal = () => {
    this.setState({isTemperatureModal: false});
  };
  
  contextMenuAction = act => {
    if (act === "from_console") {
      !this.state.isTemperatureModal && !this.state.isBloodModal && this.setState({isMeasureModal: true,open_act:act});
    } else if (act === "input_data") {
      !this.state.isTemperatureModal && !this.state.isBloodModal && this.setState({isMeasureModal: true,open_act:act});
    } else if (act === "from_console_blood") {
      !this.state.isTemperatureModal && !this.state.isBloodModal && this.setState({isBloodModal: true, blood_act:act});
    } else if (act === "add_blood") {
      !this.state.isTemperatureModal && !this.state.isBloodModal && this.setState({isAddBloodModal: true, modal_title: "血圧入力"});
    } else if (act === "edit_blood") {
      !this.state.isTemperatureModal && !this.state.isBloodModal && this.setState({isBloodModal: true, blood_act:act});
    } else if (act === "add_temp") {
      !this.state.isMeasureModal && !this.state.isBloodModal && this.setState({isAddBloodModal: true, modal_title: "体温入力"});
    } else if (act === "edit_temp") {
      !this.state.isMeasureModal && !this.state.isBloodModal && this.setState({isTemperatureModal: true});
    } else if (act === "add_puncture") {
      this.setState({isPunctureModal: true});
    }
  };
  
  closeMeasureModal = () => {
    this.setState({isMeasureModal: false});
  };
  
  handleMeasureOk = (val) => {
    this.setState({
      rows_measure: val,
      isMeasureModal: false
    });
    this.registerMeasure(val);
  };
  
  async registerMeasure (send_data) {
    if (this.double_click == true) return;
    this.double_click = true;
    let path = "/app/api/v2/dial/board/register_handle_data";
    if (this.props.schedule_data == undefined) return ;
    if (this.props.schedule_data.number == undefined) return ;
    
    let schedule_id = this.props.schedule_data.number;
    
    const post_data = {
      params: {measure_data: send_data, schedule_id}
    };
    await apiClient.post(path, post_data).then(() => {
      this.props.setHandleMeasureData(send_data);      
    }).catch(() => {
    }).finally(()=>{
      this.double_click = false;
    });
  }
  
  saveBloodData = (val) => {
    this.setState({
      rows_blood: val,
      isBloodModal: false
    });
    this.registerBlood(val);
  };
  saveTemperatureData = (val) => {
    this.setState({
      rows_temp: val,
      isTemperatureModal: false
    });
    this.registerTemperature(val);
  };
  
  async registerBlood (send_data, is_add=0) {
    if (this.double_click == true) return;
    this.double_click = true;
    let cur_blood_data = this.state.rows_blood;
    let path = "/app/api/v2/dial/board/register_handle_data";
    let schedule_id = this.props.schedule_data !== undefined && this.props.schedule_data.number;
    const post_data = {
      params: {
        blood_data: send_data,
        schedule_id,
        is_add,
      }
    };
    await apiClient.post(path, post_data).then((res) => {
      if(res.number!=undefined) {
        if (res.number > 0) {  // one data add
          send_data.number = res.number;
          cur_blood_data.push(send_data);
          this.setState({rows_blood:cur_blood_data});
          this.props.setHandleBloodData(cur_blood_data);
        } else {                // whole data update
          this.setState({rows_blood:send_data});
          this.props.setHandleBloodData(send_data);
        }        
      }
      this.setState({
        alert_messages:res.alert_message,
        confirm_alert_title:'登録完了', 
        isAddBloodModal: false
      })
    }).catch((res) => {
      this.setState({alert_messages:res.error_messages})      
    }).finally(()=>{
      this.double_click=false;
    });
  }
  
  closeDoneInspectionModal = () => {
    this.setState({done_modal_inspection: false});
  };
  
  handleDoneInspectionModal = () => {
    this.setState({done_modal_inspection: false});
  };
  
  openDoneInspectionModal = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo.system_patient_id == undefined || patientInfo.system_patient_id == null || this.props.done_status.inspection == 2 ){
      return;
    }
    this.setState({done_modal_inspection: true});
  };
  openDoneInjectionModal = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo.system_patient_id == undefined || patientInfo.system_patient_id == null || this.props.done_status.injection ==2){
      return;
    }
    this.setState({done_modal_injection: true});
  };
  openDoneDialPresModal = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo.system_patient_id == undefined || patientInfo.system_patient_id == null || this.props.done_status.dial_pres ==2){
      return;
    }
    this.setState({done_modal_dial_pres: true});
  };
  openDonePresModal = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo.system_patient_id == undefined || patientInfo.system_patient_id == null || this.props.done_status.pres ==2){
      return;
    }
    this.setState({done_modal_pres: true});
    // this.getPrescriptionInfo(patientInfo.system_patient_id, schedule_date);
  };
  async getPrescriptionInfo(patient_id, schedule_date){
    if(patient_id == undefined || patient_id == null){
      this.setState({
        alert_messages:"患者様を選択してください。"
      })      
      return;
    }
    
    let path = "/app/api/v2/dial/schedule/prescription_search";
    const post_data = {
      patient_id:patient_id,
      schedule_date:schedule_date,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res.length > 0){
          this.setState({
            done_prescription:res,
            done_modal_pres: true
          })
        } else {
          this.setState({
            alert_messages:"行うデータがありません。"
          })          
        }
      })
      .catch(() => {
        this.setState({
          alert_messages:"スケジュールを登録してください。"
        })        
      });
  }
  
  showPatientPlan = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.props.tabChange(Dial_tab_index.PatientPlan);
  };
  
  closeTimeModal = () => {
    this.setState({isTimeModal: false});
  };
  
  handleTimeModal = (value, is_start,puncture_staff_number,start_staff_number) => {
    var in_today_flag = true;
    if (is_start == false){
      if (this.start_date_time != null){
        var start_time_object = new Date(formatDateTimeIE(this.start_date_time));
        var end_time_object = new Date(formatDateTimeIE(this.start_date_time));
        var base_time_object = new Date(formatDateTimeIE(this.start_date_time));
        var end_hour = value.split(':')[0];
        var end_mins = value.split(':')[1];
        
        let dial_timezone = JSON.parse(window.sessionStorage.getItem("init_status")).dial_timezone['timezone'];
        let base_value = dial_timezone != undefined && dial_timezone != null && dial_timezone[1]!= undefined && dial_timezone['1'] !=null &&
        dial_timezone[1]['start'] != null && dial_timezone[1]['start'] != "" ? dial_timezone[1]['start']:"09:40";
        
        var base_hour = base_value.split(':')[0];
        var base_mins = base_value.split(':')[1];
        end_time_object.setHours(parseInt(end_hour));
        end_time_object.setMinutes(parseInt(end_mins));
        
        base_time_object.setHours(parseInt(base_hour));
        base_time_object.setMinutes(parseInt(base_mins));        
        if (start_time_object.getTime() >= end_time_object.getTime()){          
          in_today_flag = false;
        }
      }
    }
    this.setState({isTimeModal: false});    
    let is_started = is_start ? 0: 1;
    this.props.updateScheduleTime(value, is_started,puncture_staff_number,start_staff_number, in_today_flag);
  };
  
  openTimeModal = (val) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null){
      this.setState({
        alert_messages:'患者様を選択してください。',
      })      
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if(schedule_data == undefined || schedule_data == null || schedule_data.number == undefined){
      this.setState({
        alert_messages:'スケジュールを登録してください。',
      })      
      return;
    }
    let time_title = "";
    if (val === 'start'){
      time_title = '透析開始時刻設定';
    } else {
      time_title = '透析終了時刻設定';
    }
    this.setState({
      isTimeModal: true,
      time_title,
    });
  };
  
  handleBloodModal = (val, is_blood) => {
    if (is_blood){
      this.registerBlood(val, 1);
    } else {
      this.registerTemperature(val, 1);
    }
    this.setState({
      alert_messages:'登録しました。',
      confirm_alert_title:'登録完了'
    })    
  };
  
  async registerTemperature(send_data, is_add=0) {
    if (this.double_click == true) return;
    this.double_click = true;
    let cur_temperature_data = this.state.rows_temp;
    let path = "/app/api/v2/dial/board/register_handle_data";
    let schedule_id = this.props.schedule_data !== undefined && this.props.schedule_data.number;
    const post_data = {
      params: {
        temperature_data: send_data,
        schedule_id,
        is_add
      }
    };
    
    await apiClient.post(path, post_data).then((res) => {
      if(res.number!=undefined) {
        if (res.number > 0) {  // one data add
          send_data.number = res.number;
          cur_temperature_data.push(send_data);
          this.setState({rows_temp:cur_temperature_data});
          this.props.setHandleTempData(cur_temperature_data);
        } else {                // whole data update
          this.setState({rows_temp:send_data});
          this.props.setHandleTempData(send_data);
        }
      } 
      this.setState({
        isAddBloodModal: false,
        alert_messages:res.alert_message,        
      });
    }).catch((res) => {
      this.setState({alert_messages:res.error_messages})      
    }).finally(()=>{
      this.double_click=false;
    });
  }
  
  closeModal = () => {
    this.setState({
      alert_messages:'',
      isBloodModal: false,
      isTemperatureModal: false,
      isMeasureModal: false,
      isTimeModal: false,
      done_modal_inspection: false,
      done_modal_injection: false,
      done_modal_dial_pres: false,
      done_modal_pres: false,
      done_modal_patient_plan: false,
      isOpenLogModal: false
    }, () => {
      this.props.stopFlash("measure");
      this.props.stopFlash("log")
    })
  };
  
  saveEditedSchedule = (updated_data, title) => {
    this.props.saveEditedSchedule(updated_data, title);
  };
  
  ShowFootCare = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.props.tabChange(Dial_tab_index.FootCare);
  };
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    this.setState({
      rows_blood: nextProps.rows_blood,
      rows_measure: nextProps.rows_measure,
      rows_temp: nextProps.rows_temp,
      start_time: nextProps.ms_start_time !== undefined ? nextProps.ms_start_time : '',
      end_time: nextProps.ms_end_time !== undefined ? nextProps.ms_end_time : '',
      is_started : nextProps.is_started != undefined ? nextProps.is_started: 0,
      is_ended : nextProps.is_ended != undefined ? nextProps.is_ended: 0,
      schedule_data : nextProps.schedule_data != undefined ? nextProps.schedule_data: 0,
      bed_name:nextProps.bed_name,
      bed_number:nextProps.bed_number,
      console_number:nextProps.console_number,
      console_name:nextProps.console_name,      
      patientInfo,
      schedule_date,
      tabIndex:nextProps.tabIndex,
    });
    if(nextProps.ms_start_time !== undefined && nextProps.ms_start_time !== "" && this.state.start_time === '' &&
      schedule_data !== undefined && schedule_data != null && schedule_data.start_date == null &&
      schedule_data.puncture_staff == null && this.authInfo !== undefined && this.authInfo != null) {
      this.setState({
        isTimeModal: true,
        time_title: '透析開始時刻設定'
      });
    }
    this.getPassTime();
    if (this.props.tabIndex === nextProps.tabIndex) return;
    if(schedule_data !== undefined && schedule_data != null && schedule_data.console_start_date != null && schedule_data.start_date == null && schedule_data.puncture_staff == null && nextProps.tabIndex == Dial_tab_index.DialMonitor) {
      this.setState({
        isTimeModal: true,
        time_title: '透析開始時刻設定'
      });
    }
  }
  
  bedPopUp = (kind) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.setState({
      is_bedPopUp: true,
      modal_kind:kind
    });
  };
  
  closeBedModal = () => {
    this.setState({
      is_bedPopUp: false,
    });
  };
  
  selectBed = (index) => {
    this.props.changeBed(this.state.bed_data[index].number);
    this.setState({
      // bed_number: index,
      // bed_name: this.state.bed_data[index].name,
      is_bedPopUp: false,
    });
  };
  
  selectConsole = (index) => {
    this.props.changeConsole(parseInt(this.state.console_list[index].code));
    this.setState({
      // console_number: index,
      // console_name: this.state.console_list[index].name,
      is_bedPopUp: false,
    });
  };
  
  getPassTime = async() => {
    let schedule_data = this.props.schedule_data;
    let props_start_time = this.state.start_time;
    if (schedule_data == undefined || schedule_data == null) {
      if (this.state.ended != false || this.state.pass_time != null){
        this.setState({
          ended: false,
          pass_time:null
        });
      }
      if (document.getElementById('pass-time') != null)
      document.getElementById('pass-time').innerHTML = "-- : --";
      return;
    }
    if (schedule_data.start_date !== undefined && schedule_data.start_date != null){
      props_start_time = schedule_data.start_date;
    } else {
      if (schedule_data.console_start_date !== undefined && schedule_data.console_start_date != null){
        props_start_time = schedule_data.console_start_date;
      }
    }
    
    if (props_start_time == null || props_start_time === "") {
      this.setState({
        ended: false,
        pass_time:null
      });
      if (document.getElementById('pass-time') != null)
      document.getElementById('pass-time').innerHTML = "-- : --";
      return;
    }
    // let server_time = await getServerTime();
    let server_time = new Date();
    this.getDiffMinutes(formatTimeIE(new Date(server_time)),formatTimeIE(props_start_time));
    if (schedule_data.end_date !== undefined && schedule_data.end_date != null){
      this.getDiffMinutes(formatTimeIE(schedule_data.end_date),formatTimeIE(props_start_time));
      this.setState({
        ended:true
      });
    }    
  };
  
  getDiffMinutes(first_dt, second_dt){
    let first_time = first_dt.split(":");
    let first_minute = parseInt(first_time[0]) *60 + parseInt(first_time[1]);
    let second_time = second_dt.split(":");
    let second_minute = parseInt(second_time[0]) *60 + parseInt(second_time[1]);
    let result = [];
    var diff_minutes = first_minute - second_minute;
    if (diff_minutes < 0 ) diff_minutes += 24*60;
    result[0] = parseInt((diff_minutes)/60);
    result[1] = parseInt(diff_minutes)%60;
    if( result[0] < 0 || result [1] < 0) return;
    var temp = "";
    if(isNaN(result[0]) || isNaN(result[1])) return;
    if(parseInt(result[0]) < 10) {
      temp = parseInt(result[0]);
      result[0] = "0" + temp.toString();
    }
    if(parseInt(result[1]) < 10) {
      temp = parseInt(result[1]);
      result[1] = "0" + temp.toString();
    }
    var pass_time = result.join(":");
    document.getElementById('pass-time').innerHTML = pass_time !== undefined && pass_time != null ? pass_time : "-- : --"
    // this.setState({
    //     pass_time: result.join(":"),
    // });
  }
  previewPrint = () =>{
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    if (this.state.tabIndex != Dial_tab_index.DialMonitor) return;
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      this.setState({
        alert_messages:'患者様を選択してください。'
      })      
      return;
    }    
    this.setState({
      isPreviewModal: true,
    })
  };
  closePreviewModal = () => {
    this.setState({
      isPreviewModal: false
    })
  };
  
  openLogModal = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      this.setState({
        alert_messages:'患者様を選択してください。'
      })      
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if(schedule_data == undefined || schedule_data == null || schedule_data.number == undefined){
      this.setState({
        alert_messages:'スケジュールを登録してください。'
      })      
      return;
    }
    this.setState({isOpenLogModal: true})
  }
  
  componentWillUnmount() {
    clearInterval(this.timer_pass);

    // initialize
    this.double_click = null;
    this.timer_flash = null;
    this.timer_pass = null;
    this.start_date_time = null;
    this.authInfo = null;
  }
  
  selectPuncture = () => {
  }
  
  registerPuncture = (puncture_id) => {
    this.setState({
      isPunctureModal: false
    });
    if (puncture_id > 0) {
      this.props.registerPuncture(puncture_id);
    }
  }
  
  setHandleTempData = () => {
    this.props.setHandleTempData();
  }
  
  refreshTreatMonitor = () => {
    this.props.refrsehDialMonitor();
  }
  
  render() {    
    const schedule_data = this.props.schedule_data;
    let props_start_time = "--:--";
    let props_end_time = "--:--";
    
    if (schedule_data !== undefined){
      if (schedule_data.start_date != undefined && schedule_data.start_date != null && schedule_data.start_date != ''){
        props_start_time = formatTimeIE(schedule_data.start_date);
        this.start_date_time = schedule_data.start_date;
      } else {
        if (schedule_data.console_start_date != undefined && schedule_data.console_start_date != null && schedule_data.console_start_date != ''){
          props_start_time = formatTimeIE(schedule_data.console_start_date);
          this.start_date_time = schedule_data.console_start_date;
        }
      }
      
      if (schedule_data.end_date != undefined && schedule_data.end_date != null && schedule_data.end_date != ''){
        props_end_time = formatTimeIE(schedule_data.end_date);
      }
      // else {
      //     if (schedule_data.console_end_date != undefined && schedule_data.console_end_date != null && schedule_data.console_end_date != ''){
      //         props_end_time = formatTimeIE(schedule_data.console_end_date);
      //     }
      // }
    }
    if (this.start_date_time == null){
      if (this.state.start_time !== undefined && this.state.start_time !== "") this.start_date_time = this.state.start_time;
    }
    
    return (
      <Wrapper>
        <div id="btn-group">
          <div onClick={this.onMonitor} className={this.state.tabIndex == Dial_tab_index.DialMonitor?'auto-cursor monitor':'monitor'}>
            <a>
              <Icon icon={faCapsules} />
              <span>透析モニタ</span>
            </a>
          </div>
          <div onClick={this.onMeasure} className={this.state.machine_yellow_color!=undefined&&this.state.machine_yellow_color===true?"yellow_color": ""}>
            <a>
              <Icon icon={faIdCardAlt} />
              <span>計測値</span>
            </a>
          </div>
          <div onClick={this.onBlood} className={this.state.blood_yellow_color!=undefined&&this.state.blood_yellow_color===true?"yellow_color": ""}>
            <a>
              <Icon icon={faMicroscope} />
              <span>血圧</span>
            </a>
          </div>
          <div onClick={this.onTemperature}>
            <a>
              <Icon icon={faTemperatureFrigid} />
              <span>体温</span>
            </a>
          </div>
          <div onClick={this.openLogModal.bind(this)} className={this.state.log_yellow_color!=undefined&&this.state.log_yellow_color===true?"yellow_color": ""}>
            <Icon icon={faHistory} />
            <span>操作警報履歴</span>
          </div>
          <div className={'preview'} onClick={this.previewPrint.bind(this)}>
            <span className={this.state.tabIndex != Dial_tab_index.DialMonitor?'disabled':''}>記録用紙プレビュー</span>
          </div>
        </div>
        <div className="div-group" id="div-group">
          <p className="text-left">ベッドNo</p>
          <div className="text-console" onClick={this.bedPopUp.bind(this, "ベッドNo")}>
            {this.state.bed_name}
          </div>
          <p className="text-left">コンソールNo</p>
          <div className="text-console"  onClick={this.bedPopUp.bind(this, "コンソールNo")}>
            {this.state.console_name}
          </div>
          <p className="text-left border-bottom">透析時間</p>
          <div className="time-selected blue-text">
            <div className="time-label auto-cursor">{this.state.ended != undefined && this.state.ended? "実績" : "経過"}</div>
            <div className="time-area auto-cursor" id ="pass-time">
              {/* {this.state.pass_time !== undefined && this.state.pass_time != null ? this.state.pass_time : "-- : --"} */}
            </div>
          </div>
          <div className="time-selected">
            <div className="time-label auto-cursor">予定</div>
            <div className="time-area auto-cursor">
              {schedule_data !== undefined && schedule_data.dial_pattern !== undefined ? schedule_data.dial_pattern.reservation_time.substring(0, 5) : "-- : --"}
            </div>
          </div>
          <div onClick={this.openTimeModal.bind(this,'start')} className="cursor_pointer time-selected" onContextMenu={e => this.handlePunctureClick(e)}>
            <div className="time-label">開始</div>
            <div className="time-area">
              {props_start_time !== undefined && props_start_time !== "--:--" ? props_start_time :
                this.state.start_time !== undefined && this.state.start_time !== ""  ? formatTimeIE(this.state.start_time) : "-- : --"}</div>
          </div>
          <div onClick={this.openTimeModal.bind(this,'end')} className="cursor_pointer time-selected">
            <div className="time-label">終了</div>
            <div className="time-area">{
              props_end_time !== undefined && props_end_time !== "--:--" ? props_end_time :
                this.state.end_time !== undefined && this.state.end_time !== "" ? formatTimeIE(this.state.end_time) : "-- : --"}</div>
          </div>
          <p className="text-left">実施状況</p>
          <div
            className={`cursor_pointer status_${this.props.done_status.inspection}` + " implementation_status"}
            style={{cursor:this.props.done_status.inspection == 2 ? 'auto' : ''}}
            onClick={this.openDoneInspectionModal}
          >
            {this.props.done_status.inspection === 1 && (<Icon icon={faCheck} />)}検査</div>
          <div
            className={`cursor_pointer status_${this.props.done_status.injection}` + " implementation_status"}
            onClick={this.openDoneInjectionModal}
            style={{cursor:this.props.done_status.injection == 2 ? 'auto' : ''}}
          >
            {this.props.done_status.injection === 1 && (<Icon icon={faCheck} />)}注射</div>
          <div
            className={`cursor_pointer status_${this.props.done_status.dial_pres}` + " implementation_status"}
            onClick={this.openDoneDialPresModal}
            style={{cursor:this.props.done_status.dial_pres == 2 ? 'auto' : ''}}
          >
            {this.props.done_status.dial_pres === 1 && (<Icon icon={faCheck} />)}透析中処方</div>
          <div
            className={`cursor_pointer status_${this.props.done_status.pres}` + " implementation_status"}
            onClick={this.openDonePresModal}
            style={{cursor:this.props.done_status.pres == 2 ? 'auto' : ''}}
          >
            {this.props.done_status.pres === 1 && (<Icon icon={faCheck} />)}処方</div>
          <div className={`cursor_pointer status_${this.props.done_status.patient_plan}` + " implementation_status"} style={{cursor:'pointer'}} onClick={this.showPatientPlan}>
            {this.props.done_status.patient_plan === 1 && (<Icon icon={faCheck} />)}他科受診</div>
          <div className={`cursor_pointer status_${this.props.done_status.foot_care}` + " implementation_status"} style={{cursor:'pointer'}} onClick={this.ShowFootCare}>
            {this.props.done_status.foot_care === 1 && (<Icon icon={faCheck} />)}フットケア</div>
        </div>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        <ContextBloodMenu
          {...this.state.contextBloodMenu}
          parent={this}
        />
        <ContextTempMenu
          {...this.state.contextTempMenu}
          parent={this}
        />
        <ContextPunctureMenu
          {...this.state.contextPunctureMenu}
          parent={this}
        />
        {this.state.isMeasureModal && schedule_data !== undefined && (
          <MeasureModal
            handleOk={this.handleMeasureOk}
            closeModal={this.closeMeasureModal}
            rows_measure={this.state.rows_measure}
            open_act={this.state.open_act}
            schedule_data={this.state.schedule_data}
            start_time = {this.start_date_time}
          />
        )}
        {this.state.isBloodModal && !this.state.isMeasureModal && !this.state.isTemperatureModal && schedule_data !== undefined && (
          <BloodModal
            handleOk={this.saveBloodData.bind(this)}
            closeModal={this.closeBloodModal}
            rows_blood={this.state.rows_blood}
            schedule_id={schedule_data.number}
            system_patient_id={schedule_data.system_patient_id}
            schedule_data={this.state.schedule_data}
            act = {this.state.blood_act}
            start_time = {this.start_date_time}
          />
        )}
        {this.state.isTemperatureModal && !this.state.isBloodModal && !this.state.isMeasureModal && schedule_data !== undefined && (
          <TemperatureModal
            handleOk={this.saveTemperatureData}
            closeModal={this.closeTemperatureModal}
            setHandleTempData={this.setHandleTempData}
            rows_temp={this.state.rows_temp}
            schedule_data={this.state.schedule_data}
            start_time = {this.start_date_time}
          />
        )}
        {this.state.done_modal_inspection && (
          <DoneGeneralModal
            done_list={this.props.done_inspection}
            modal_title ="検査"
            closeModal={this.closeModal}
            handleModal={this.handleDoneInspectionModal}
            saveEditedSchedule={this.saveEditedSchedule}
          />
        )}
        {this.state.done_modal_injection && (
          <DoneGeneralModal
            done_list={this.props.done_injection}
            modal_title ="注射"
            closeModal={this.closeModal}
            handleModal={this.handleDoneInspectionModal}
            saveEditedSchedule={this.saveEditedSchedule}
          />
        )}
        {this.state.done_modal_dial_pres && (
          <DoneGeneralModal
            done_list={this.props.done_dial_pres}
            modal_title ="透析中処方"
            closeModal={this.closeModal}
            handleModal={this.handleDoneInspectionModal}
            saveEditedSchedule={this.saveEditedSchedule}
          />
        )}
        {this.state.done_modal_pres && (
          <DonePrescriptionModal
            done_list={this.props.done_prescription}
            modal_title ="処方"
            closeModal={this.closeModal}
            handleModal={this.handleDoneInspectionModal}
            saveEditedSchedule={this.saveEditedSchedule}
          />
        )}
        {this.state.isTimeModal && (
          <TimeInputModal
            title={this.state.time_title}
            closeModal={this.closeTimeModal.bind(this)}
            handleModal={this.handleTimeModal.bind(this)}
          />
        )}
        {this.state.isAddBloodModal && (
          <BloodInputModal
            title={this.state.modal_title}
            closeModal={this.closeBloodModal}
            handleModal={this.handleBloodModal}
            start_time = {this.start_date_time}
          />
        )}
        {this.state.isPunctureModal && schedule_data != undefined && (
          <DialSelectPunctureModal
            selectPuncture = {schedule_data.puncture_staff}
            closeModal = {this.closePunctureModal}
            MasterCodeData = {this.state.staffs}
            registerPuncture={this.registerPuncture}
            MasterName = '穿刺スタッフ'
          />
        )}
        {this.state.is_bedPopUp && (
          <BedPopUpModal
            bed_list={this.state.bed_data}
            console_list={this.state.console_list}
            closeModal={this.closeBedModal}
            selectBed={this.selectBed}
            selectConsole={this.selectConsole}
            modal_kind={this.state.modal_kind}
          />
        )}
        {this.state.isPreviewModal && (
          <PrintModal
            closeModal={this.closePreviewModal}            
            patientInfo = {this.state.patientInfo}
            schedule_date = {this.state.schedule_date}            
            sheet_style = 'A'
          />
        )}
        {this.state.isOpenLogModal && (
          <OperationLogModal
            closeModal={this.closeModal}
            handleOk = {this.refreshTreatMonitor}
            is_alarm_data={this.state.is_alarm_data}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title={this.state.confirm_alert_title}
          />
        )}
      </Wrapper>
    )
  }
}

BoardLeft.contextType = Context;

BoardLeft.propTypes = {
  patientId: PropTypes.number,
  tabChange: PropTypes.func,
  done_inspection: PropTypes.array,
  done_injection: PropTypes.array,
  done_dial_pres: PropTypes.array,
  done_prescription: PropTypes.array,
  done_status: PropTypes.object,
  schedule_data: PropTypes.object,
  recvData: PropTypes.object,
  rows_temp: PropTypes.array,
  rows_blood: PropTypes.array,
  rows_measure: PropTypes.array,
  saveEditedSchedule:PropTypes.func,
  setHandleBloodData:PropTypes.func,
  setHandleTempData:PropTypes.func,
  setHandleMeasureData:PropTypes.func,
  ms_start_time:PropTypes.string,
  ms_end_time:PropTypes.string,
  is_started : PropTypes.number,
  is_ended : PropTypes.number,  
  changeBed : PropTypes.func,
  changeConsole : PropTypes.func,
  bed_number : PropTypes.number,
  bed_name : PropTypes.string,
  console_number : PropTypes.number,
  console_name : PropTypes.string,
  updateScheduleTime : PropTypes.func,
  stopFlash:PropTypes.func,
  registerPuncture:PropTypes.func,
  refrsehDialMonitor: PropTypes.func,
  openLoginModal: PropTypes.func,
  tabIndex: PropTypes.number,
};

export default BoardLeft