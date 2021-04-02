import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import BoardTop from "./BoardTop";
import BoardLeft from "./BoardLeft";
import DialMonitor from "./DialMonitor";
import DRMedicalRecord from "./DRMedicalRecord";
import VAManager from "./VAManager";
import BeforeConfirm from "./BeforeConfirm";
import FootCare from "./FootCare";
import Sending from "./Sending";
import PatientPlan from "./PatientPlan";
import PatientInformation from "./PatientInformation";
import DrainageSet from "./DrainageSet";
import BloodSet from "./BloodSet";
import DoctorProposal from "./DoctorProposal";
import Instruction from "./Instruction";
import axios from "axios";
import * as apiClient from "~/api/apiClient";
import {
  formatDateLine,
  getTimeZoneBaseLocal,
  // getTimeZone,
  formatDateTimeIE,
  formatDateIE,
} from "~/helpers/date";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import DialTitleTabs from "../../../organisms/DialTitleTabs";
import * as methods from "../DialMethods";
import SystemConfirmModal from "~/components/molecules/SystemConfirmJapanModal";
import FlashPopUpModal from "../modals/FlashPopUpModal";
import {
  Dial_status_color,
  Dial_tab_index,
  Dial_tabs,
} from "~/helpers/dialConstants";
import MyCalendarBody from "~/components/templates/Dial/Others/MyCalendar/MyCalendarBody";
// import PatientMain from "./PatientMain";
import ReadStatusModal from "~/components/templates/Dial/modals/ReadStatusModal";
import LoginModal from "../../../molecules/LoginModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import Context from "~/helpers/configureStore";
import ConfirmChangeTimezoneModal from "../../../molecules/ConfirmChangeTimezoneModal";

const Card = styled["div"]`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 15px 10px 10px 10px;
  padding-right: 10px;
  .footer {
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: calc(100vw - 370px);
  height: calc(100vh - 80px);
  float: left;
  margin-bottom: 10px;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .link-btn div {
    cursor: pointer;
    border: 1px solid #aaa;
    padding-left: 0px;
    padding-right: 0px;
    width: auto;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    background: rgb(239, 239, 239);
    font-size: 0.8rem;    
  }
`;

class DialMain extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    var path = window.location.href.split("/");
    var tabIndex = 1;
    let isConfirmComplete = false;
    if (path[path.length - 1] == "dr_karte"){
      tabIndex = Dial_tab_index.DRMedicalRecord;
    }
    let fromPrintCache = sessApi.getObject("from_print");
    if (fromPrintCache != undefined) {
      tabIndex = fromPrintCache.tab_id;
      isConfirmComplete = true;
    }
    if (props.from_source == "login") {
      isConfirmComplete = true;
      tabIndex = Dial_tab_index.DialMonitor;
    }
    // get patient info from cache open dr karte loading
    var patient = sessApi.getObjectValue("dial_setting", "patient");
    if (patient != undefined && patient != null && Object.keys(patient).length > 0) {
      isConfirmComplete = true;
    }
    var system_patient_id = sessApi.getObjectValue("form_bed_table", "system_patient_id");
    if (system_patient_id != undefined && system_patient_id != null && system_patient_id > 0) {
      isConfirmComplete = true;
    }
    let isTerminal = sessApi.getValue("from_terminal") == 1 ? 1 : 0;
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (this.props.from_source != "login") sessApi.remove("from_terminal");
    this.ex_patient_info = {};
    this.ex_schedule_date = null;

    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    this.time_setting = init_status.dial_timezone.timezone != undefined ? init_status.dial_timezone.timezone : null;
    let timezone = getTimeZoneBaseLocal(this.time_setting);
    this.bed_data = sessApi.getObjectValue("dial_common_master", "bed_master");
    this.console_list = sessApi.getObjectValue("dial_common_master", "console_master");
    this.patient_list = sessApi.getObjectValue('patient_list', 'patient_list');

    this.state = {
      tabs:Dial_tabs,
      patientId: 0,
      patientInfo: {},
      schedule_data: {},
      titleTab: 1,
      measure_list: [], // 計測値
      blood_pressure: [], //血圧
      prescription_status: {
        temp: [], //臨時処方実施状況
        regular: [], //定期処方実施状況
      }, //検査実施状況
      patient_plan: [], //処方実施状況
      done_status: {
        //実施状況 flags
        inspection: 2,
        injection: 2,
        dial_pres: 2,
        pres: 2,
        patient_plan: 2,
        foot_care: 2,
      },
      done_inspection: [], //検査実施状況
      done_injection: [],
      done_dial_pres: [],
      done_prescription: [],
      schedule_exist_status: {
        //スケジュール状況 flags
        prescription: 0, //処方スケジュール
        injection: 0, //注射スケジュール
        manage: 0, //管理料スケジュール
        inspection: 0, //検査スケジュール
        others: 0, //その他スケジュール
      },
      temporaray_prescription_schedule: [],
      manage_schedule: [],
      manage_schedule_item: {},
      temporary_injection_schedule: [],
      contrain: [],
      heart: [],
      infection: [],
      disease: [],
      insulin: [],
      tabIndex,
      schedule_date: new Date(),
      activeIndex: 1,
      rows_measure: [],
      rows_blood: [],
      rows_temp: [],
      is_started: 0,
      is_ended: 0,
      timer: undefined,
      timezone,
      system_patient_id: null,
      recv_data: [],
      isFlashPopUp: false,
      flash_start: {
        blood: false,
        measure: false,
        log: false,
      },
      change_timezone: 0,
      isTerminal: isTerminal,
      confirm_alert_title:'',
      isConfirmComplete,
      complete_message: '読み込み中',
      instruction_doctor: '',
      alert_messages: "",
      ms_start_time: "",
      ms_end_time: "",
      confirmChangeModal: false
    };
    this.timer = undefined;
    sessApi.remove(CACHE_SESSIONNAMES.DIAL_BOARD);
    window.sessionStorage.removeItem("temp_draingeSet");
    this.double_click = false;
    this.initTabColor();
    this.change_dial_delete = null;
    sessApi.remove("dial_change_flag");
    this.dialMonitorRef = React.createRef();
    this.patientInfoRef = React.createRef();
    this.karteRef = React.createRef();
    this.auto_change_timezone_time = 300 * 1000;
    this.auto_change_timezone_popup_time = 300 * 1000;
    this.patient_list = [];
    if (init_status.conf_data !== undefined && init_status.conf_data.auto_change_timezone_time) {
      this.auto_change_timezone_time = init_status.conf_data.auto_change_timezone_time;
    }
    if (init_status.conf_data !== undefined && init_status.conf_data.auto_change_timezone_popup_time) {
      this.auto_change_timezone_popup_time = init_status.conf_data.auto_change_timezone_popup_time;
    }
    this.can_change_timezone = 0;
  }
  
  componentDidUpdate() {
    if (window.sessionStorage.getItem("is_logout") != 1){
      window.addEventListener("click", () => {
        this.clickEvent();
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    // sessApi.remove("is_logout");
    window.sessionStorage.removeItem("temp_draingeSet");

    // if (window.sessionStorage.getItem("is_logout") != 1){
    //   window.removeEventListener("click", () => {
    //     this.clickEvent();
    //   });
    // }

    this.timer = null;
    this.double_click = null;
    this.change_dial_delete = null;
    this.dialMonitorRef = null;
    this.patientInfoRef = null;
    this.karteRef = null;
  }

  async componentDidMount() {
    await this.getAllPatients();
    const dial_device_request_interval = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS) != undefined ? sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS).dial_device_request_interval :30;
    if (dial_device_request_interval > 0){
      this.timer = setInterval(async() => {
        await this.getRequest();
      }, dial_device_request_interval * 1000);
    }
    
    if (this.state.isTerminal){
      this.autoPatientSelect();
    }
    if (this.props.from_source == "login") {
      this.enterFullscreenMode();
      return;
    }
    let fromBedCache = sessApi.getObject("form_bed_table");
    if (fromBedCache !== undefined && fromBedCache != null) {
      this.autoPatientSelectFromBed(fromBedCache);
    }
    let fromPrintCache = sessApi.getObject("from_print");    
    if (fromPrintCache !== undefined && fromPrintCache != null) {
      await this.autoPatientSelectFromPrint(fromPrintCache);
    }     
    let patient = sessApi.getObjectValue("dial_setting", "patient");
    if ((fromBedCache == undefined || fromBedCache == null) && (fromPrintCache == undefined || fromPrintCache == null)) {
      if (patient != undefined && patient != null) {
        this.setPatient(patient);
      }
    }
  }

  getAllPatients = async () => {
    let path = "/app/api/v2/dial/master/patient_list";
    let post_data = {
      order:'name_kana'
    };
    let { data } = await axios.post(path, {param: post_data});
    this.patient_list = data.data;
  }
  
  reset = (sch_data = undefined) => {
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_data", {});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "patient", {});
    sessApi.delObjectValue("dial_setting", "patient");
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 0);
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "check_values", {});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_started", 0);
    this.ex_patient_info = {};
    this.ex_schedule_date = null;
    this.setState({
      before_schedule_date: sch_data != undefined? sch_data["before_schedule_date"]:this.state.before_schedule_date,
      after_schedule_date: sch_data != undefined? sch_data["after_schedule_date"]:this.state.after_schedule_date,
      done_inspection: [], //検査実施状況
      done_injection: [],
      done_dial_pres: [],
      done_prescription: [],
      patientInfo: {},
      schedule_data: {},
      system_patient_id: null,
      measure_list: [], // 計測値
      blood_pressure: [], //血圧
      prescription_status: {
        temp: [], //臨時処方実施状況
        regular: [], //定期処方実施状況
      }, //検査実施状況
      patient_plan: [], //処方実施状況
      done_status: {
        inspection: 2,
        injection: 2,
        dial_pres: 2,
        pres: 2,
        patient_plan: 2,
        foot_care: 2,
      },
      schedule_exist_status: {
        //スケジュール状況 flags
        prescription: 0, //処方スケジュール
        injection: 0, //注射スケジュール
        manage: 0, //管理料スケジュール
        inspection: 0, //検査スケジュール
        others: 0, //その他スケジュール
      },
      temporaray_prescription_schedule: [],
      manage_schedule: [],
      manage_schedule_item: {},
      contrain: [],
      heart: [],
      infection: [],
      disease: [],
      insulin: [],
      recv_data: [],
      rows_measure: [],
      rows_blood: [],
      rows_temp: [],
      is_started: 0,
      is_ended: 0,
      timer: undefined,
      isTerminal: 0,
      weight_before: null,
      weight_after: null,
      ms_cur_drainage: null,
      instruction_doctor: ''
    });
  };

  reset_schedule = (sch_data = undefined) => {
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_data", {});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 0);
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "check_values", {});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "is_started", 0);
    this.ex_patient_info = {};
    this.ex_schedule_date = null;
    this.setState({
      before_schedule_date: sch_data != undefined? sch_data["before_schedule_date"]:this.state.before_schedule_date,
      after_schedule_date: sch_data != undefined? sch_data["after_schedule_date"]:this.state.after_schedule_date,
      done_inspection: [], //検査実施状況
      done_injection: [],
      done_dial_pres: [],
      done_prescription: [],
      schedule_data: {},
      // system_patient_id:null,
      measure_list: [], // 計測値
      blood_pressure: [], //血圧
      prescription_status: {
        temp: [], //臨時処方実施状況
        regular: [], //定期処方実施状況
      }, //検査実施状況
      patient_plan: [], //処方実施状況
      done_status: {
        inspection: 2,
        injection: 2,
        dial_pres: 2,
        pres: 2,
        patient_plan: 2,
        foot_care: 2,
      },
      schedule_exist_status: {
        //スケジュール状況 flags
        prescription: 0, //処方スケジュール
        injection: 0, //注射スケジュール
        manage: 0, //管理料スケジュール
        inspection: 0, //検査スケジュール
        others: 0, //その他スケジュール
      },
      temporaray_prescription_schedule: [],
      manage_schedule: [],
      manage_schedule_item: {},
      contrain: [],
      heart: [],
      infection: [],
      disease: [],
      insulin: [],
      recv_data: [],
      rows_measure: [],
      rows_blood: [],
      rows_temp: [],
      is_started: 0,
      is_ended: 0,
      timer: undefined,
      isTerminal: 0,
      weight_before: null,
      weight_after: null,
      bed_number : null,
      bed_no: null,
      bed_name: '',
      console_name: '',
      console_no: null,
      console_number: null,
      instruction_doctor: ''
    });
  };
  
  enterFullscreenMode=()=> {
    if(window.sessionStorage.getItem("is_logout") == 1) return;
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.click();
  }
  
  clickEvent = () => {
    if(window.sessionStorage.getItem("is_logout") == 1) return;
    var full_screen_element =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null;
    if (full_screen_element === null) {
      if (document.body.msRequestFullscreen)
        document.body.msRequestFullscreen();
      else if (document.body.mozRequestFullScreen)
        document.body.mozRequestFullScreen();
      else if (document.body.webkitRequestFullscreen)
        document.body.webkitRequestFullscreen();
      else if (document.body.requestFullscreen)
        document.body.requestFullscreen();
    }
  }

  // from terminal auto patient select
  autoPatientSelect = () => {
    var init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != undefined && init_status != null && init_status.terminal_info != undefined &&
      init_status.terminal_info != null && init_status.terminal_info.start_page === "ベッドサイド") {
      if (init_status.terminal_info.bed_number != undefined && init_status.terminal_info.bed_number != null &&
        init_status.terminal_info.bed_number > 0
      ) {
        this.changeBed(init_status.terminal_info.bed_number);
      }
    }
  };

  // auto patient select from bed table
  autoPatientSelectFromBed = (bed_info) => {
    sessApi.remove("form_bed_table");
    if (bed_info.system_patient_id != undefined && bed_info.bed_no != undefined &&
      bed_info.schedule_date != undefined && bed_info.timezone != undefined
    ) {
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date", formatDateLine(new Date(bed_info.schedule_date)));
      this.setState(
        {
          system_patient_id: bed_info.system_patient_id,
          schedule_date: formatDateIE(bed_info.schedule_date),
          bed_no: bed_info.bed_no,
          timezone: bed_info.timezone,
          end_dial_schedule:false
        },
        () => {
          this.getSchedulaData();
        }
      );
    }
  };

  // auto patient select from print page
  autoPatientSelectFromPrint = async (info) => {
    sessApi.remove("from_print");        
    if (info.system_patient_id != undefined && info.schedule_date != undefined && info.tab_id != undefined) {
      var patientInfo = this.patient_list !== undefined && this.patient_list != null && this.patient_list.find((x) => x.system_patient_id == info.system_patient_id);
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_date", formatDateLine(new Date(info.schedule_date)));      
      if (patientInfo == undefined || patientInfo == null || !(patientInfo.system_patient_id>0)) {
        this.setState({alert_messages: '削除された患者です。'});
        return;
      }
      var isConfirmComplete = info.tab_id == Dial_tab_index.DRMedicalRecord;
      var complete_message = info.tab_id == Dial_tab_index.DRMedicalRecord ? "読み込み中" : "";
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let dr_karte_cache = localApi.getObject("dr_karte_cache");
      if (dr_karte_cache !== undefined && dr_karte_cache != null && dr_karte_cache.props !== undefined) {
        if (authInfo.user_number == dr_karte_cache.user_number) {
          isConfirmComplete = false;
          complete_message = '';
        }
      }
      this.setState(
        {
          patientInfo,
          system_patient_id: info.system_patient_id,
          schedule_date: formatDateTimeIE(info.schedule_date),
          isConfirmComplete,
          complete_message,
          timezone:info.time_zone != undefined ? info.time_zone : this.state.timezone,
          end_dial_schedule:false
        },
        () => {
          this.tabChange(info.tab_id);
          this.getSchedulaData(1);
        }
      );
    }
  };

  // interval request
  getRequest =async() => {
    let schedule_data = this.state.schedule_data;
    if (schedule_data == undefined || schedule_data == null) {
      // no schedule
      return;
    }
    if (
      schedule_data.patientInfo == undefined ||
      schedule_data.patientInfo == null
    ) {
      //no patient
      return;
    }
    // let server_time = await getServerTime();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    let time_zone = schedule_data.dial_pattern.time_zone;
    if (time_zone != 4) {
      //  深夜
      if (schedule_data.schedule_date != today) {
        // is not today
        return;
      }
    } else {
      // let yestoday = new Date(new Date().setDate(new Date().getDate() - 1));
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday = formatDateLine(yesterday);
      if (!( schedule_data.schedule_date == today || schedule_data.schedule_date == yesterday)){
        return;
      }
    }
    if (this.state.is_get_request === 1) return; // weight_after_time is already setted
    await this.getRecvData();    
  };

  getStartState = (recv_data) => {    
    if (recv_data !== undefined) {
      if (recv_data.weight_before != null && this.state.weight_before == null) {
        this.setState({ weight_before: recv_data.weight_before }, () => {          
          let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
          schedule_data.weight_before = this.state.weight_before;
          sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data", schedule_data);
        });
      }
      if (recv_data.weight_after != null && this.state.weight_after == null) {
        this.setState({ weight_after: recv_data.weight_after }, () => {          
          let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
          schedule_data.weight_after = this.state.weight_after;
          sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data", schedule_data);
        });
      }
      if (recv_data.blood_data.length > 0 && this.state.rows_blood != null && recv_data.blood_data.length != this.state.rows_blood.length) {
        this.setState({
          rows_blood : recv_data.blood_data
        }, ()=>{          
          if (this.karteRef.current != undefined && this.karteRef.current != null){
            this.karteRef.current.getKarteInfo();
          }
          if (this.patientInfoRef.current != null){
            this.patientInfoRef.current.getWeightBlood(this.state.patientInfo.system_patient_id, this.state.schedule_date);
          }
        })
      }
      let ms_data = recv_data.ms_data;
      this.setState({
        rows_measure: ms_data,
        rows_blood: recv_data.blood_data,
      });
      // if (ms_data === null || ms_data.length === 0) return;
      let ms_start_time = recv_data.start_time != undefined ? recv_data.start_time : "";
      let ms_end_time = recv_data.end_time != undefined ? recv_data.end_time : "";
      
      if (ms_start_time !== undefined && ms_start_time != null && ms_start_time !== "" && this.state.ms_start_time.substr(0, 17) != ms_start_time.substr(0, 17)) {        
        this.setState({
          is_started: 1,
          ms_start_time: ms_start_time,
          end_dial_schedule:false
        }, () => {
          this.getSchedulaData();
        });
      }

      if (ms_data != undefined && ms_data != null && ms_data.length > 0) {
        this.setState({
          ms_cur_drainage: ms_data[ms_data.length - 1].ms_cur_drainage,          
        });
      }
      
      if (ms_end_time !== null && ms_end_time != undefined && ms_end_time != "" && ms_end_time != this.state.ms_end_time) {
        this.setState({
          is_ended: 1,
          ms_end_time: ms_end_time,
          end_dial_schedule:false
        }, () => {
          this.getSchedulaData();
        });
      }

      if (recv_data.after_weight_time != null && recv_data.after_weight_time != "") {
        this.setState({
            after_weight_time: recv_data.after_weight_time,
            change_timezone: this.props.from_source == "login" ? 1 : 0
          },async() => {
            if (this.props.from_source !== "login"){
              await this.passProcess(recv_data);
            }
          }
        );
        return;
      }
    }
  };

  passProcess =async(recv_data) => {
    // let server_time = await getServerTime();
    let cur_time = new Date();
    let after_weight_time = new Date(this.state.after_weight_time);
    if (cur_time.getTime() - after_weight_time.getTime() > 0) {
      if (cur_time.getTime() - after_weight_time.getTime() > 5 * 60 * 1000) {
        if (this.can_change_timezone == 0) this.context.$setLastEventTime();
        this.can_change_timezone = 1;
        if (document.getElementsByClassName("modal-dialog")[0] !== undefined && document.getElementsByClassName("timezone-change-modal")[0] == undefined) return;
        if (document.getElementsByClassName("timezone-change-modal")[0] !== undefined) {
          if (cur_time.getTime() - this.context.$getLastEventTime() > this.auto_change_timezone_popup_time * 1000) {
            this.setState({change_timezone: 1, confirmChangeModal: false});
            this.can_change_timezone = 0;
          } else {
            return;
          }
        } else {
          if (cur_time.getTime() - this.context.$getLastEventTime() > this.auto_change_timezone_time * 1000) {
            this.setState({change_timezone: 1});
            this.can_change_timezone = 0;
          } else {
            return;
          }
        }
      } else {
        if (
          recv_data.new_machine_data != null &&
          recv_data.new_machine_data.length > 0
        ) {
          this.setState({
            recv_data,
            isPassModal: true,
            confirm_message: "次の時間枠に移動しますか？",
          });
        } else if (
          recv_data.new_blood_data != null &&
          recv_data.new_blood_data.length > 0
        ) {
          this.setState({
            recv_data,
            isPassModal: true,
            confirm_message: "次の時間枠に移動しますか？",
          });
        } else if (
          recv_data.new_log_data != null &&
          recv_data.new_log_data.length > 0
        ) {
          this.setState({
            recv_data,
            isPassModal: true,
            is_alarm_data: false,
            confirm_message: "次の時間枠に移動しますか？",
          });
        } else if (
          recv_data.new_alarm_data != null &&
          recv_data.new_alarm_data.length > 0
        ) {
          this.setState({
            recv_data,
            isPassModal: true,
            is_alarm_data: true,
            confirm_message: "次の時間枠に移動しますか？",
          });
        } else {
          this.setState({
            recv_data,
            change_timezone: 0,
            flash_start: {
              measure: false,
              blood: false,
              log: false,
              alarm: false,
            },
            isFlashPopUp: false,
            // isOpenMachineModal:false,
            // isOpenBloodModal:false,
            // isOpenLogModal:false,
            // is_alarm_data:false,
          });
        }
      }
    }
  };

  // interval request
  async getRecvData() {
    let schedule_data = this.state.schedule_data;
    if (schedule_data === undefined) {
      return;
    }
    // let send_request = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"send_request");
    let send_request = 0;
    let path = "/app/api/v2/dial/board/get_request_data";
    if (this.authInfo === undefined || this.authInfo == null) path = "/app/api/v2/dial/no_auth/get_request_data";
    const post_data = {
      schedule_id: schedule_data.number,
      system_patient_id: schedule_data.system_patient_id,
      send_request:send_request != undefined && send_request != null && send_request === 1 ? 1 : 0,
    };
    apiClient._post(path, { params: post_data }).then(async(res) => {
      await this.getStartState(res);
    });
  }

  sendConsole = async (send_data) => {
    let path = "/app/api/v2/dial/board/sendConsole";
    const post_data = {
      params: { schedule_item: send_data },
    };
    this.setState({
      isConfirmComplete: true,
      complete_message: '送信中',
    });
    await apiClient
      .post(path, post_data)
      .then((res) => {
        this.setState({
          alert_messages: res.alert_message,
          isConfirmComplete: false,
          complete_message: '',
        })
        // if (send_data.dial_pattern.bed_no != this.state.bed_no || send_data.dial_pattern.console != this.state.console){
          this.setState({
            bed_no: send_data.dial_pattern.bed_no,
            console: send_data.dial_pattern.console,
            end_dial_schedule:false
          }, ()=>{
            this.getSchedulaData(1);
          });
        // }
      })
      .catch(() => {
        this.setState({
          isConfirmComplete: false,
          complete_message: '',
        });
      });
  };
  openLoginModal = () => {
    this.setState({isLoginModal: true});
  }

  selectTitleTab = (tab_id) => {
    if(this.authInfo === undefined || this.authInfo == null) {
      this.openLoginModal();
      return;
    }
    var dial_change_flag = sessApi.getObjectValue("dial_change_flag");
    let confirm_message = "";
    let confirm_type = "";
    if (
      this.change_dial_delete == null &&
      dial_change_flag !== undefined &&
      dial_change_flag != null
    ) {
      confirm_message ="登録していない内容があります。\n変更内容を破棄して移動しますか？";
      confirm_type = "change_dialmain_tab";
    }
    if (confirm_message !== "") {
      this.setState({
        confirm_message,
        confirm_type,
        confirm_event: parseInt(tab_id),
        confirm_alert_title:'入力中'
      });
      return;
    } else {
      this.change_dial_delete = null;
    }
    if (tab_id == Dial_tab_index.DrainageSet) {
      if (this.state.system_patient_id > 0) {
        this.getSchedulaData(1);
      }
    }
    this.setState({tabIndex: parseInt(tab_id)});
  };

  tabChange = (val) => {
    let tab_data = this.state.data;
    this.setState({
      activeIndex: val,
      tabIndex: val,
      data: tab_data,
    });
  };

  //functions for re-search schedule data----------------------------------------
  setPatient = (patientInfo) => {
    //患者選択
    this.setState({
      patientInfo,
      bed_number: null,
      bed_name: "",
      console_name: "",
      console_number: null,
      bed_no: null,
      console_no: null,
      system_patient_id: patientInfo.system_patient_id,
      end_dial_schedule:false
    },() => {
      this.getSchedulaData(1);
    });
  };

  setSchDate = (sch_date) => {//日付選択
    this.setState({schedule_date: sch_date, end_dial_schedule:false},() => {
      this.getSchedulaData(1);
    });
  };

  // if Bed No is set
  // if From Ternminal Info
  changeBed = (number) => {
    if (number == undefined || number == null) return;
    if (this.bed_data == undefined || this.bed_data == null || this.bed_data.find((x) => x.number === number) == null) return;
    let default_console_code = this.bed_data.find(
      (x) => x.number === number
    ).default_console_code;
    let console_name = "";
    if (
      default_console_code != null &&
      default_console_code !== "" &&
      default_console_code !== 0
    ) {
      console_name = this.console_list.find(
        (x) => x.code === default_console_code
      ).name;
    }
    this.setState(
      {
        bed_no: number,
        console_no: null,
        system_patient_id: null,
        bed_number: number,
        bed_name: this.bed_data.find((x) => x.number === number).name,
        console_name,
        end_dial_schedule:false
      },
      () => {
        this.getSchedulaData();
      }
    );
  };

  changeConsole = (code) => {
    //コンソール選択
    if (code == undefined || code == null) return;
    if (this.console_list == undefined || this.console_list == null || this.console_list.length == 0) return;
    if (this.console_list.find((x) => x.code == code) != undefined) {
      this.setState(
        {
          console_no: code,
          bed_no: null,
          system_patient_id: null,
          console_number: code,
          console_name: this.console_list.find((x) => x.code == code)
            .name,
          bed_name: "",
          end_dial_schedule:false
        },
        () => {
          this.getSchedulaData();
        }
      );
    }
  };

  setTimezone = (val) => {
    //時間帯選択
    this.setState({
        timezone: val,
        patientInfo: {},
        system_patient_id: null,
        end_dial_schedule:false
      }, () => {
        this.getSchedulaData();
      }
    );
  };
  //-------------------------------------------------------------------------------

  //Get whole data of patient for Refresh page-------------------------------------
  async getSchedulaData(from_set_patient = 0, search_before_dial=0, search_after_dial=0) {    
    let path = "/app/api/v2/dial/schedule/dial_get_schedule";
    if (this.props.from_source == "login")
      path = "/app/api/v2/dial/no_auth/dial_get_schedule";
    
    let post_data = {
      cur_day: formatDateLine(this.state.schedule_date),
      bed_no: this.state.bed_no,
      console: this.state.console_no,
      time_zone: from_set_patient? undefined :  this.state.timezone,
      system_patient_id: this.state.system_patient_id,
      auto_patient_select: this.state.isTerminal,
      search_before_dial,
      search_after_dial,
    };
    if (this.props.from_source == "login") post_data.auto_patient_select = 0;
    let schedule_data = [];    
    await axios.post(path, { params: post_data }).then((res) => {
      schedule_data = res.data[0];
      if (schedule_data != undefined && schedule_data != null) {
        if ((this.state.isTerminal == 1 || this.props.from_source == "login") && (schedule_data.weight_after != null) && (schedule_data.end_date != null)) {
          this.setState({
            is_get_request: 0,
            isTerminal: 0,
            change_timezone:1
          });
          return;
        }
        this.setState({
          bed_number: schedule_data.dial_pattern.bed_no,
          bed_no: schedule_data.dial_pattern.bed_no,
          bed_name: this.bed_data.find((x) => x.number === schedule_data.dial_pattern.bed_no).name,
          console_number: schedule_data.dial_pattern.console,
          console_name: this.console_list.find((x) => x.code == schedule_data.dial_pattern.console).name,
          patientInfo: schedule_data.patientInfo,
          timezone: schedule_data.dial_pattern.time_zone,
          schedule_date: schedule_data.schedule_date,
          system_patient_id: schedule_data.patientInfo.system_patient_id,
          schedule_data,
          // if weight_after_measuremented_at is already setted, don't send request
          is_get_request:
            schedule_data.weight_after_measuremented_at != undefined &&
            schedule_data.weight_after_measuremented_at != null
              ? 1
              : 0,
          weight_before: schedule_data.weight_before,
          weight_after: schedule_data.weight_after,

          before_schedule_date: res.data["before_schedule_date"],
          after_schedule_date: res.data["after_schedule_date"],
        },async() => {
          if (this.state.patientInfo != undefined && this.state.patientInfo != null) {
            if (this.state.patientInfo.system_patient_id != this.ex_patient_info.system_patient_id || this.state.schedule_date != this.ex_schedule_date){
              this.get_general_flag = true;
              await this.getGenralInfo(this.state.patientInfo.system_patient_id,this.state.schedule_date);
            }
            this.ex_patient_info = this.state.patientInfo;
            this.ex_schedule_date = this.state.schedule_date;
            if (this.patientInfoRef.current != null){
              this.patientInfoRef.current.getWeightBlood(this.state.patientInfo.system_patient_id, this.state.schedule_date);
            }
          }
        });
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data",schedule_data);
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date",schedule_data.schedule_date);
        //  開始前確認のチェックボックスに未チェックがある場合開始前確認のタブを赤に全てのチェックが付くと青に
        if (schedule_data.pre_start_confirm_at !== undefined && schedule_data.pre_start_confirm_at != null && schedule_data.pre_start_confirm_at !== "") {
          this.changeTabColor(Dial_tab_index.BeforeConfirm, Dial_status_color.Complete);
          sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 1);
        } else {
          this.changeTabColor(Dial_tab_index.BeforeConfirm,Dial_status_color.Uncomplete);
          sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 0);
          sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"check_values",{});
          sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"is_started",0);
        }

        //-----Get machine state data
        let ms_path = "/app/api/v2/dial/board/get_all_ms_data";
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        if (authInfo === undefined || authInfo == null) ms_path = "/app/api/v2/dial/no_auth/get_all_ms_data";
        post_data.schedule_id = schedule_data.number;
        axios.post(ms_path, { params: post_data }).then((res) => {
          this.setMachineState(res.data.ms_data, res.data.handle_data);
        });
      } else {
        if (from_set_patient == 1) {
          this.getGenralInfo(this.state.patientInfo.system_patient_id,this.state.schedule_date);
          if (this.patientInfoRef.current != null){
            this.patientInfoRef.current.getWeightBlood(this.state.system_patient_id, this.state.schedule_date);
          }
          this.reset_schedule(res.data);
        } else {
          this.reset(res.data);
          this.initTabColor();
        }        
        this.setMachineState([], []);
      }
      if (res.data["sending_data_info"] == 1) {
        this.changeTabColor(Dial_tab_index.Sending,Dial_status_color.Uncomplete);
      } else if (res.data["sending_data_info"] == 2) {
        this.changeTabColor(Dial_tab_index.Sending, Dial_status_color.Complete);
      } else {
        this.changeTabColor(Dial_tab_index.Sending, Dial_status_color.None);
      }      
    }).finally(()=>{      
      this.setState({        
        // is_get_request: 0,
        end_dial_schedule:this.state.isConfirmComplete?false:true,
      });
      setTimeout(() => {
        if (this.get_general_flag != true){          
          this.setState({
            isConfirmComplete:false,
            end_dial_schedule:true
          })
        }
      }, 500);
    });
  }
  
  initTabColor() {
    // if (this.state.patientInfo == undefined || this.state.patientInfo == null){
    Object.keys(Dial_tab_index).map((key) => {
      this.changeTabColor(Dial_tab_index[key], Dial_status_color.None);
    });
    // }
  }

  getGenralInfo =async(patient_id, schedule_date) => {
    if (patient_id == undefined || schedule_date == undefined || patient_id == null || schedule_date == null) return;
    var three_ago = new Date(schedule_date);
    three_ago.setDate(three_ago.getDate() - 3);
    var three_after = new Date(schedule_date);
    three_after.setDate(three_after.getDate() + 3);
    let path = "/app/api/v2/dial/schedule/get_general_info";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) path = "/app/api/v2/dial/no_auth/get_general_info";
    let post_data = {
      params: {
        schedule_date: formatDateLine(schedule_date),
        patient_id: patient_id,
        pattern_require:1,
        pattern_check: 1,
        dr_start_date: formatDateLine(new Date(schedule_date)),
        dr_end_date: formatDateLine(new Date(schedule_date)),
        patient_number: patient_id,
        patient_list_start_date: formatDateLine(three_ago),
        patient_list_end_date: formatDateLine(three_after),
      },
    };
    
    let general_data = await apiClient.post(path, post_data);
    let injection_data = general_data.injection_data;
    let inspection_data = general_data.inspection_data;
    let dial_pres_data = general_data.dial_pres_data;
    let pres_data = general_data.pres_data;
    let manage_data = general_data.manage_data;
    let other_data = general_data.other_data;
    let footcare_data = general_data.footcare_data;
    let dr_proposal_data = general_data.dr_proposal_data;
    let patient_plan_data = general_data.patient_plan_data;
    let instruction_data = general_data.instruction_data;
    let medical_data = general_data.medical_data;
    let instruction_doctor = general_data.instruction_doctor;
  
    if (instruction_data.length > 0) {
      var instruction_flag = true;
      for (var j = 0; j < instruction_data.length; j++) {
        if (instruction_data[j].status != 4) {
          instruction_flag = false;
          break;
        }
      }
      if (instruction_flag) {
        this.changeTabColor(Dial_tab_index.Instruction, Dial_status_color.Complete);
      } else {
        this.changeTabColor(Dial_tab_index.Instruction, Dial_status_color.Uncomplete);
      }
    } else {
      this.changeTabColor(Dial_tab_index.Instruction, Dial_status_color.None);
    }
    var temporary_injection_schedule = injection_data.data.filter((item) => {
      if (item.is_temporary === 1) {
        return item;
      }
    });
    var temporaray_prescription_schedule = pres_data.schedule_info.filter((item) => {
      if (item.is_temporary == 1) return item;
    });
    if (temporaray_prescription_schedule.length > 0) temporaray_prescription_schedule = temporaray_prescription_schedule[0];
  
    var temp = this.state.schedule_exist_status;
    if (other_data.check == false) {
      temp.others = 0;
    } else {
      temp.others = 1;
    }
    var foot_care_status = 2;
    if (footcare_data.length > 0) {
      var check_flag = false;
      var check_write_flag = false;
      var schedule_date_obj = new Date(this.state.schedule_date);
      footcare_data.map((first_item, first_index) => {
        var next_scheduled_date = new Date(first_item.next_scheduled_date);
        if (schedule_date_obj.getTime() - 7 * 24 * 3600 * 1000 <= next_scheduled_date.getTime() && schedule_date_obj.getTime() + 7 * 24 * 3600 * 1000 >= next_scheduled_date.getTime()){
          check_flag = true;
          footcare_data.map((second_item, second_index) => {
            if (first_index != second_index){
              var write_date = new Date(second_item.write_date);
              if (next_scheduled_date.getTime() - 7 * 24 * 3600 * 1000 <= write_date.getTime() && next_scheduled_date.getTime() + 7 * 24 * 3600 * 1000 >= write_date.getTime()){
                check_write_flag = true;
              }
            }
          })
        }
      })
      if (check_flag){
        if (check_write_flag) foot_care_status = 1; else foot_care_status = 0;
      } else {
        foot_care_status = 2;
      }
    } else {
      foot_care_status = 2;
    }
  
    var done_status_temp = this.state.done_status;
    done_status_temp.foot_care = foot_care_status;
    let dr_proposal_list = undefined;
    if (dr_proposal_data.length > 0) {
      var flag = true;
      dr_proposal_data.map((item) => {
        if (item.completed_by == null) flag = false;
      });
      if (flag) {
        this.changeTabColor(Dial_tab_index.DoctorProposal,Dial_status_color.Complete);
      } else {
        this.changeTabColor(Dial_tab_index.DoctorProposal,Dial_status_color.Uncomplete);
      }
      dr_proposal_list = dr_proposal_data;
    } else {
      this.changeTabColor(Dial_tab_index.DoctorProposal, Dial_status_color.None);
    }
    var patient_plan_status = 2;
    if (patient_plan_data.length > 0) {
      patient_plan_data = patient_plan_data.filter(x => x.schedule_date != null);
      for (var i = 0; i < patient_plan_data.length; i++) {
        if (patient_plan_status != 1) patient_plan_status = 1;
        if (patient_plan_data[i].checked_by_complete == 0) {
          patient_plan_status = 0;
          break;
        }
      }
    }
    if (patient_plan_status == 2) this.changeTabColor(Dial_tab_index.PatientPlan, Dial_status_color.None);
    if (patient_plan_status == 0) this.changeTabColor(Dial_tab_index.PatientPlan, Dial_status_color.Uncomplete);
    if (patient_plan_status == 1) this.changeTabColor(Dial_tab_index.PatientPlan, Dial_status_color.Complete);
    done_status_temp.patient_plan = patient_plan_status;    
    
    done_status_temp = this.check_done_status('injection', injection_data.data, done_status_temp);
    done_status_temp = this.check_done_status('inspection', inspection_data.schedule_info!=undefined?inspection_data.schedule_info:[], done_status_temp);
    done_status_temp = this.check_done_status('dial_pres', dial_pres_data.schedule_info!= undefined?dial_pres_data.schedule_info:[], done_status_temp);    
    done_status_temp = this.check_done_status('pres', pres_data.schedule_info, done_status_temp);

    temp = this.check_exist_schedule("注射", temporary_injection_schedule, temp, injection_data.pattern_check);      
    temp = this.check_exist_schedule("処方", temporaray_prescription_schedule, temp);
    temp = this.check_exist_schedule("管理料", manage_data.schedule_info!=undefined?manage_data.schedule_info:[], temp);
    this.setState({      
      done_injection: injection_data.data,
      injection_pattern:injection_data.pattern_info,
      temporary_injection_schedule,
      done_inspection: inspection_data.schedule_info!=undefined?inspection_data.schedule_info:[],
      inspection_pattern:inspection_data.pattern_info,
      done_dial_pres: dial_pres_data.schedule_info!= undefined?dial_pres_data.schedule_info:[],
      dial_pres_pattern:dial_pres_data.pattern_info,
      done_prescription: pres_data.schedule_info,
      prescription_pattern:pres_data.pattern_info,
      temporaray_prescription_schedule,
      manage_schedule: manage_data.schedule_info!=undefined?manage_data.schedule_info:[],
      manage_schedule_item:manage_data.schedule_info!=undefined && manage_data.schedule_info.length > 0?manage_data.schedule_info[0]:{},
      manage_pattern:manage_data.pattern_info,
      schedule_exist_status: temp,
      done_status: done_status_temp,
      dr_proposal_list,
      instruction_doctor,
      contrain: medical_data.contrain,
      disease: medical_data.disease,
      heart: medical_data.heart,
      infection: medical_data.infection,
      insulin: medical_data.insulin,

      isConfirmComplete:this.get_general_flag?false:this.state.isConfirmComplete,
      end_dial_schedule:this.get_general_flag && this.state.isConfirmComplete? false:this.state.end_dial_schedule,
    }, () => {
      if (this.get_general_flag == true){
        this.get_general_flag = false;
        if (this.state.end_dial_schedule != true){
          this.setState({end_dial_schedule:true});
        }
      }
    });
  };

  refresh = async (patient_id, schedule_date) => {
    if (
      patient_id == undefined ||
      schedule_date == undefined ||
      patient_id == null ||
      schedule_date == null
    )
      return;
    let path = "/app/api/v2/dial/schedule/dial_get_schedule";
    let post_data = {
      cur_day: formatDateLine(schedule_date),
      system_patient_id: patient_id,
    };
    await axios.post(path, { params: post_data }).then((res) => {
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_data",res.data[0]);
      if (res.data[0] != undefined && res.data[0].pre_start_confirm_at == null && res.data[0].pre_start_confirm_by == null){
        this.changeTabColor(
          Dial_tab_index.BeforeConfirm,
          Dial_status_color.Uncomplete
        );
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 0);
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"check_values",{});
        sessApi.delObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, 'confirm_data');
      }
      this.setState({ schedule_data: res.data[0] });
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data", res.data[0]);
      this.getGenralInfo(patient_id, schedule_date);
    });
  };

  changeBeforeStartStatus = () => {
    this.changeTabColor(
      Dial_tab_index.BeforeConfirm,
      Dial_status_color.Uncomplete
    );
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 0);
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"check_values",{});
    sessApi.delObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, 'confirm_data');
    var schedule_data = this.state.schedule_data;
    schedule_data.pre_start_confirm_at = null;
    schedule_data.pre_start_confirm_by = null;
    this.setState({schedule_data});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data", schedule_data);
  }

  getGeneralMedical = async (patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/common/search_general_info";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) path = "/app/api/v2/dial/no_auth/search_general_info";
    let post_data = {
      params: {
        schedule_date: formatDateLine(schedule_date),
        patient_id: patient_id,
        order:'sort_number'
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      this.setState({
        contrain: res.contrain,
        disease: res.disease,
        heart: res.heart,
        infection: res.infection,
        insulin: res.insulin,
      });
    });
  };

  checkInstructionStatus = async (system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/board/Soap/checkDoneInstruction";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) path = "/app/api/v2/dial/no_auth/checkDoneInstruction";
    let post_data = {
      patient_id: system_patient_id,
      schedule_date: formatDateLine(schedule_date),
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res.length > 0) {
          var flag = true;
          for (var i = 0; i < res.length; i++) {
            if (res[i].status != 4) {
              flag = false;
              break;
            }
          }
          if (flag) {
            this.changeTabColor(
              Dial_tab_index.Instruction,
              Dial_status_color.Complete
            );
          } else {
            this.changeTabColor(
              Dial_tab_index.Instruction,
              Dial_status_color.Uncomplete
            );
          }
        } else {
          this.changeTabColor(
            Dial_tab_index.Instruction,
            Dial_status_color.None
          );
        }
      })
      .catch(() => {});
  };

  getDrProposalStatus = async (system_patient_id, schedule_date) => {
    if (
      system_patient_id == undefined ||
      system_patient_id == null ||
      schedule_date == null ||
      schedule_date == ""
    ) {
      this.setState({ dr_proposal_list: [] });
      return;
    }
    let path = "/app/api/v2/dial/board/getDrProposalSendingData";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) return;
    let post_data = {
      patient_id: system_patient_id,
      start_date: formatDateLine(new Date(schedule_date)),
      end_date: formatDateLine(new Date(schedule_date)),
      category: "Dr上申",
    };
    await apiClient
      ._post(path, { params: post_data })
      .then((res) => {
        if (res.length > 0) {
          var flag = true;
          res.map((item) => {
            if (item.completed_by == null) flag = false;
          });
          if (flag) {
            this.changeTabColor(
              Dial_tab_index.DoctorProposal,
              Dial_status_color.Complete
            );
          } else {
            this.changeTabColor(
              Dial_tab_index.DoctorProposal,
              Dial_status_color.Uncomplete
            );
          }
          this.setState({ dr_proposal_list: res });
        } else {
          this.changeTabColor(
            Dial_tab_index.DoctorProposal,
            Dial_status_color.None
          );
          this.setState({ dr_proposal_list: undefined });
        }
      })
      .catch(() => {
        this.setState({ dr_proposal_list: undefined });
      });
  };

  getList = async (system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/schedule/patient_schedule/list";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) path = "/app/api/v2/dial/no_auth/patient_schedule/list";
    var three_ago = new Date(schedule_date);
    three_ago.setDate(three_ago.getDate() - 3);
    var three_after = new Date(schedule_date);
    three_after.setDate(three_after.getDate() + 3);
    let post_data = {
      type:'onlyenable',
      patient_number: system_patient_id,
      start_date: formatDateLine(three_ago),
      end_date: formatDateLine(three_after),
    };
    let { data } = await axios.post(path, { params: post_data });
    var patient_plan_status = 2;
    if (data.length > 0) {
      data = data.filter(x => x.schedule_date != null);
      for (var i = 0; i < data.length; i++) {
        if (patient_plan_status != 1) patient_plan_status = 1;
        // if (data[i].schedule_date == formatDateLine(schedule_date)) {          
          if (data[i].checked_by_complete == 0) {
            patient_plan_status = 0;
            break;
          }
        // }
      }
    }
    if (patient_plan_status == 2) this.changeTabColor(Dial_tab_index.PatientPlan, Dial_status_color.None);
    if (patient_plan_status == 0) this.changeTabColor(Dial_tab_index.PatientPlan, Dial_status_color.Uncomplete);
    if (patient_plan_status == 1) this.changeTabColor(Dial_tab_index.PatientPlan, Dial_status_color.Complete);
    var temp = this.state.done_status;
    temp.patient_plan = patient_plan_status;
    this.setState({ done_status: temp });
  };
  //-----------------------------------------------------------------------

  check_done_status = (title, done_data = [], done_status = {}) => {
    var i = 0;    
    if (done_data.length == 0){
      done_status[title] = 2;
      return done_status;
    }
    for (i = 0; i < done_data.length; i++) {
      if (done_data[i].is_completed === 0) {
        done_status[title] = 0;        
        return done_status;
      }
    }
    done_status[title] = 1;
    return done_status;
    
    // switch (title) {
    //   case "検査":
    //     if (this.state.done_inspection.length === 0) {
    //       temp.inspection = 2;
    //       this.setState({ done_status: temp });
    //       return;
    //     }
    //     for (i = 0; i < this.state.done_inspection.length; i++) {
    //       if (this.state.done_inspection[i].is_completed === 0) {
    //         temp.inspection = 0;
    //         this.setState({ done_status: temp });
    //         return;
    //       }
    //     }
    //     temp.inspection = 1;
    //     this.setState({ done_status: temp });
    //     break;
    //   case "注射":        
    //     if (this.state.done_injection.length === 0) {
    //       temp.injection = 2;
    //       this.setState({ done_status: temp });
    //       return;
    //     }
    //     for (i = 0; i < this.state.done_injection.length; i++) {
    //       if (this.state.done_injection[i].is_completed === 0) {
    //         temp.injection = 0;
    //         this.setState({ done_status: temp });
    //         return;
    //       }
    //     }
    //     temp.injection = 1;
    //     this.setState({ done_status: temp });
    //     break;
    //   case "透析中処方":
    //     if (this.state.done_dial_pres.length === 0) {
    //       temp.dial_pres = 2;
    //       this.setState({ done_status: temp });
    //       return;
    //     }
    //     for (i = 0; i < this.state.done_dial_pres.length; i++) {
    //       if (this.state.done_dial_pres[i].is_completed === 0) {
    //         temp.dial_pres = 0;
    //         this.setState({ done_status: temp });
    //         return;
    //       }
    //     }
    //     temp.dial_pres = 1;
    //     this.setState({ done_status: temp });
    //     break;
    //   case "処方":
    //     if (this.state.done_prescription.length === 0) {
    //       temp.pres = 2;
    //       this.setState({ done_status: temp });
    //       return;
    //     }
    //     for (i = 0; i < this.state.done_prescription.length; i++) {
    //       if (this.state.done_prescription[i].is_completed === 0) {
    //         temp.pres = 0;
    //         this.setState({ done_status: temp });
    //         return;
    //       }
    //     }
    //     temp.pres = 1;
    //     this.setState({ done_status: temp });        
    //     break;
    // }
  };

  check_exist_schedule = (title, schedule_data = [], schedule_exist_status = {},  pattern_check = false) => {
    var i = 0;
    switch (title) {
      case "検査":
        if (schedule_data.length === 0) {
          schedule_exist_status.inspection = 2;          
          return schedule_exist_status;
        }
        for (i = 0; i < schedule_data.length; i++) {
          if (schedule_data[i].is_completed === 0) {
            schedule_exist_status.inspection = 0;            
            return schedule_exist_status;
          }
        }
        schedule_exist_status.inspection = 1;        
        break;
      case "注射":
        if (schedule_data.length == 0) {
          if (pattern_check) {
            schedule_exist_status.injection = 1;
          } else {
            schedule_exist_status.injection = 0;
          }
        } else {
          schedule_exist_status.injection = 1;
        }
        break;
      case "管理料":
        if (schedule_data.length == 0) {
          schedule_exist_status.manage = 0;          
        } else {
          schedule_exist_status.manage = 1;          
        }
        break;
      case "処方":
        if (schedule_data.length == 0) {
          schedule_exist_status.prescription = 0;
        } else {
          schedule_exist_status.prescription = 1;
        }
        break;
    }
    return schedule_exist_status;
  };

  checkFootCare = (value) => {
    var temp = this.state.done_status;
    temp.foot_care = value;
    this.setState({ done_status: temp });
  };

  saveEditedSchedule = async (updated_data, title) => {
    let post_data = {
      title: title,
      updated_data: updated_data,
      date: formatDateLine(this.state.schedule_date),
      system_patient_id: this.state.system_patient_id,
    };
    let path = "/app/api/v2/dial/schedule/update_done_status";
    await apiClient.post(path, { params: post_data }).then(() => {      
      var done_data = [];
      var title_option = '';
      switch(title){
        case '検査':
          done_data = this.state.done_inspection;
          title_option = 'inspection';
          break;
        case '注射':
          done_data = this.state.done_injection;
          title_option = 'injection';
          break;
        case '透析中処方':
          done_data = this.state.done_dial_pres;
          title_option = 'dial_pres';
          break;
        case '処方':
          done_data = this.state.done_prescription;
          title_option = 'pres';
          break;
      }
      this.check_done_status(title_option, done_data, this.state.done_status);
      if (this.karteRef.current != undefined && this.karteRef.current != null){
        this.karteRef.current.getKarteInfo();
      }
    });
  };

  setMachineState = (recv_data, handle_data) => {
    let is_started = 0;
    let is_ended = 0;
    let ms_start_time = "";
    let ms_end_time = "";
    if (recv_data !== undefined && recv_data != null) {
      is_started = recv_data.is_started != undefined ? recv_data.is_started : 0;
      is_ended = recv_data.is_ended != undefined ? recv_data.is_ended : 0;
      ms_start_time =
        recv_data.start_time != undefined ? recv_data.start_time : "";
      ms_end_time = recv_data.end_time != undefined ? recv_data.end_time : "";
    }
    this.setState({
      recv_data,
      rows_measure:
        handle_data !== undefined && handle_data.measure_data !== undefined
          ? handle_data.measure_data
          : [],
      rows_blood:
        handle_data !== undefined && handle_data.blood_data !== undefined
          ? handle_data.blood_data
          : [],
      rows_temp:
        handle_data !== undefined && handle_data.temperature_data !== undefined
          ? handle_data.temperature_data
          : [],
      is_started,
      is_ended,
      ms_start_time,
      ms_end_time,
    });
  };

  setBloodData = (blodddata) => {
    this.setState({ rows_blood: blodddata, end_dial_schedule:false });    
    if (this.karteRef.current != undefined && this.karteRef.current != null){
      this.karteRef.current.getKarteInfo();
    }
    this.getSchedulaData(1);
  };
  setMeasureData = (data) => {
    this.setState({ rows_measure: data, end_dial_schedule:false });    
    if (this.karteRef.current != undefined && this.karteRef.current != null){
      this.karteRef.current.getKarteInfo();
    }
    this.getSchedulaData(1);
  };
  setTempData = (data) => {
    this.setState({ rows_temp: data , end_dial_schedule:false});    
    if (this.karteRef.current != undefined && this.karteRef.current != null){
      this.karteRef.current.getKarteInfo();
    }
    this.getSchedulaData(1);
  };

  updateScheduleTime = (dial_time, is_started, puncture_staff_number, start_staff_number, in_today_flag = true) => {
    if (this.double_click == true) return;
    this.double_click = true;
    let ms_path = "/app/api/v2/dial/board/update_start_end_time";
    let post_data = {
      update_time: dial_time,
      puncture_staff_number,
      start_staff_number,
      is_started: is_started,
      schedule_id: this.state.schedule_data.number,
      in_today_flag: in_today_flag,
      schedule_date: this.state.schedule_date,
    };
    axios
      .post(ms_path, { params: post_data })
      .then(() => {
        this.getSchedulaData();
        if (this.karteRef.current != undefined && this.karteRef.current != null){
          this.karteRef.current.getKarteInfo();
        }
        if (is_started == 0){
          this.setState({alert_messages: '透析開始時刻を設定しました。'});
        } else {
          this.setState({alert_messages: '透析終了時刻を設定しました。'});
        }
      })
      .finally(() => {
        this.double_click = false;
      });
  };
  confirmOk = () => {
    clearInterval(this.state.timer);
    this.setState({
      change_timezone: 1,
      confirm_message: "",
    });
  };
  confirmCancel = () => {
    let recv_data = this.state.recv_data;
    this.setState({
      confirm_message: "",
      confirm_alert_title:'',
      flash_start: {
        measure:
          recv_data != null &&
          recv_data.new_machine_data != undefined &&
          recv_data.new_machine_data != null &&
          recv_data.new_machine_data.length > 0
            ? true
            : false,
        blood:
          recv_data != null &&
          recv_data.new_blood_data != undefined &&
          recv_data.new_blood_data != null &&
          recv_data.new_blood_data.length > 0
            ? true
            : false,
        log:
          recv_data != null &&
          recv_data.new_log_data != undefined &&
          recv_data.new_log_data != null &&
          recv_data.new_log_data.length > 0
            ? true
            : false,
        alarm:
          recv_data != null &&
          recv_data.new_alarm_data != undefined &&
          recv_data.new_alarm_data != null &&
          recv_data.new_alarm_data.length > 0
            ? true
            : false,
      },
      // isFlashPopUp: true,
    });
  };
  flashCancel = () => {
    this.setState({
      isFlashPopUp: false,
    });
  };
  openMachineModal = () => {
    this.setState({
      isOpenMachineModal: true,
      flash_start: {
        measure: false,
        blood: this.state.flash_start.blood,
        log: this.state.flash_start.log,
        alarm: this.state.flash_start.alarm,
      },
    });
  };
  openBloodModal = () => {
    this.setState({
      isOpenBloodModal: true,
      flash_start: {
        measure: this.state.flash_start.measure,
        blood: false,
        log: this.state.flash_start.log,
        alarm: this.state.flash_start.alarm,
      },
    });
  };
  openLogModal = () => {
    this.setState({
      isOpenLogModal: true,
      flash_start: {
        measure: this.state.flash_start.measure,
        blood: this.state.flash_start.blood,
        log: false,
        alarm: false,
      },
    });
  };
  closeFlashPopUp = () => {
    this.setState({
      isFlashPopUp: false,
    });
  };
   stopFlash = (type) => {
    if (type === "blood") {
      this.setState({
        isOpenBloodModal: false,
      });
    } else if (type === "measure") {
      this.setState({
        isOpenMachineModal: false,
      });
    } else if (type === "log") {
      this.setState({
        isOpenLogModal: false,
      });
    }
  };
  
  beforeDial = () => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo.system_patient_id === undefined) return;
    if (this.state.before_schedule_date == null || this.state.before_schedule_date === "") {
      this.setState({alert_messages: 'スケジュールがありません。'});
      return;
    }
    this.setState({
      schedule_date: this.state.before_schedule_date,
      system_patient_id: patientInfo.system_patient_id,
      end_dial_schedule:false
    },() => {
      this.getSchedulaData(0, 1);
    });
  };
  
  afterDial = () => {
    let patientInfo = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "patient"
    );
    if (patientInfo.system_patient_id === undefined) return;
    if (this.state.after_schedule_date == null || this.state.after_schedule_date === "") {
      this.setState({alert_messages: 'スケジュールがありません。'});
      return;
    }
    this.setState({
      system_patient_id: patientInfo.system_patient_id,
      schedule_date: this.state.after_schedule_date,
      end_dial_schedule:false
    },() => {
      this.getSchedulaData(1, 0, 1);
    });
  };
  
  getSchedule = (val = 0, complete_message = '') => {
    if (complete_message != ''){
      this.setState({
        complete_message,
        isConfirmComplete:true,
        end_dial_schedule:false
      })
    } else {
      this.setState({
        end_dial_schedule:false
      })
    }
    this.getSchedulaData(val);
  };

  changeTabColor(tab_index, color_value) {    
    let tabs = this.state.tabs;
    if (tabs[tab_index] == undefined) return;
    tabs[tab_index].tab_color = color_value;
    this.setState({ tabs });
  }

  updatePuncture = async (puncture_id) => {
    if (this.double_click == true) return;
    this.double_click = true;
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    let path = "/app/api/v2/dial/board/register_puncture_id";
    let post_data = {
      schedule_id: schedule_data.number,
      puncture_id: puncture_id,
      patient_id: schedule_data.system_patient_id,
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res) {
          this.setState({alert_messages: res.alert_message, end_dial_schedule:false});
          this.getSchedulaData();
        }
      })
      .catch(() => {})
      .finally(() => {
        this.double_click = false;
      });
  };

  setChange = (post_data) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: '保存中',
    });
    let path = "/app/api/v2/dial/board/update_drainage_set";
    apiClient.post(path, { params: post_data }).then((res) => {
      if (res !== undefined && res.alert_message !== undefined) {
        this.setState({alert_messages: res.alert_message, end_dial_schedule:false});
      } else {
        this.setState({end_dial_schedule:false})
      }
      this.getSchedulaData();
    }).finally(()=>{
      this.setState({
        isConfirmComplete: true,
        complete_message: '',
      });
    });
  };

  goPage = (page) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.openLoginModal(); return;}
    var dial_change_flag = sessApi.getObjectValue("dial_change_flag");
    let confirm_message = "";
    let confirm_type = "";
    if (
      this.change_dial_delete == null &&
      dial_change_flag !== undefined &&
      dial_change_flag != null
    ) {
      confirm_message ="登録していない内容があります。\n変更内容を破棄して移動しますか？";
      confirm_type = "change_dialmain_page";
    }
    if (confirm_message !== "") {
      this.setState({
        confirm_message,
        confirm_type,
        confirm_event: page,
        confirm_alert_title:'入力中'
      });
      return;
    } else {
      this.change_dial_delete = null;
    }
    
    let url = "";
    if (page === "bed_table") {
      url = "/dial/others/bed_table";
      sessApi.setObjectValue(
        "dial_bed_table",
        "schedule_date",
        formatDateLine(this.state.schedule_date)
      );
    }
    if (page === "dial_schedule") {
      url = "/dial/schedule/Schedule";
      sessApi.setObjectValue("dial_schedule_table","schedule_date",formatDateLine(this.state.schedule_date));
    }
    setTimeout(() => {
      this.props.history.replace(url);
    }, 500);
  };

  changePatient = async () => {
    if (this.state.patientInfo.system_patient_id == undefined) return;
    let path = "/app/api/v2/dial/patient/list";
    let post_data = {
      keyword: this.state.patientInfo.patient_number,
    };
    await axios.post(path, { param: post_data }).then((res) => {
      if (res.data.data[0]) {
        let patientInfo = res.data.data[0];
        sessApi.setObjectValue(
          CACHE_SESSIONNAMES.DIAL_BOARD,
          "patient",
          patientInfo
        );
        sessApi.setObjectValue("dial_setting", "patient", patientInfo);
        this.setPatient(patientInfo);
        this.setState({ change_patient: true });
      }
    });
  };

  confirmMoveOk = () => {
    sessApi.remove("dial_change_flag");
    this.setState({confirm_message: ""});
    if (this.state.confirm_type === "change_dialmain_tab") {
      this.change_dial_patient_master_delete = 0;
      this.selectTitleTab(this.state.confirm_event);
    } else if (this.state.confirm_type === "change_dialmain_page") {
      this.goPage(this.state.confirm_event);
    }
  };

  refrsehDialMonitor = () => {
    this.dialMonitorRef.current.refreshTreatMonitor();
  };
  getInstructionDoctor = (system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/board/Karte/get_instruction_doctor";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) path = "/app/api/v2/dial/no_auth/get_instruction_doctor";
    apiClient._post(path, {
      params: {
        system_patient_id: system_patient_id,
        date:formatDateLine(schedule_date),
      }
    }).then(res=>{
      this.setState({instruction_doctor:res});
    })
  };
  closeModal = () => {
    this.setState({isLoginModal: false});
  }
  handleLogIn = (state_data) => {
    this.setState({isLoginModal: false});
    this.props.handleLogIn(state_data);
  }
  closeAlertModal = () => {
    this.setState({alert_messages: ""});
  }
  resetTimer = () => {
    if (this.can_change_timezone != 1) return;
    this.setState({confirmChangeModal: true});
    this.context.$setLastEventTime();
  }

  closeCompleteModal = () => {
    this.setState({
      isConfirmComplete:false,
      confirm_message:'',
    })
  }
  
  changeTimezoneOk = () =>{
    this.changeTimezoneCancel();
    this.can_change_timezone = 0;
    this.setState({change_timezone: 1});
  }
  
  changeTimezoneCancel = () => {
    this.can_change_timezone = 0;
    this.setState({confirmChangeModal: false});
  }


  render() {    
    return (
      <Card
        onMouseMove={this.resetTimer}
        onMouseDown={this.resetTimer}
        onKeyDown={this.resetTimer}>
        <BoardTop
          patient_list={this.patient_list}
          patientInfo={this.state.patientInfo}
          patientId={this.state.system_patient_id}
          setPatient={this.setPatient}
          tabChange={this.tabChange}
          setSchDate={this.setSchDate}
          setTimezone={this.setTimezone}
          schedule_exist_status={this.state.schedule_exist_status}
          temporaray_prescription_schedule={this.state.temporaray_prescription_schedule}
          manage_schedule={this.state.manage_schedule_item}
          temporary_injection_schedule={this.state.temporary_injection_schedule}
          handleOk={this.getGenralInfo}
          timezone={this.state.timezone}
          schedule_data={this.state.schedule_data}
          change_timezone={this.state.change_timezone}
          beforeDial={this.beforeDial}
          afterDial={this.afterDial}
          openLoginModal={this.openLoginModal}
          schedule_date={this.state.schedule_date}
          before_schedule_date={this.state.before_schedule_date != undefined ? this.state.before_schedule_date : null}
          after_schedule_date={this.state.after_schedule_date != undefined ? this.state.after_schedule_date : null}
          bed_name={this.state.bed_name}
          change_patient={this.state.change_patient}
        />
        <BoardLeft
          tab={this.state.titleTab}
          tabChange={this.tabChange}
          schedule_data={this.state.schedule_data}
          patientId={this.state.system_patient_id}
          done_inspection={this.state.done_inspection}
          done_injection={this.state.done_injection}
          done_dial_pres={this.state.done_dial_pres}
          done_prescription={this.state.done_prescription}
          done_status={this.state.done_status}
          recvData={this.state.recv_data}
          rows_blood={this.state.rows_blood}
          rows_temp={this.state.rows_temp}
          rows_measure={this.state.rows_measure}
          saveEditedSchedule={this.saveEditedSchedule}
          setHandleBloodData={this.setBloodData}
          setHandleMeasureData={this.setMeasureData}
          setHandleTempData={this.setTempData}
          ms_start_time={this.state.ms_start_time}
          ms_end_time={this.state.ms_end_time}
          is_started={this.state.is_started}
          is_ended={this.state.is_ended}          
          schedule_date={this.state.schedule_date}
          changeBed={this.changeBed}
          changeConsole={this.changeConsole}
          bed_number={this.state.bed_number}
          bed_name={this.state.bed_name}
          console_number={this.state.console_number}
          console_name={this.state.console_name}
          updateScheduleTime={this.updateScheduleTime}
          stopFlash={this.stopFlash}
          registerPuncture={this.updatePuncture}
          refrsehDialMonitor = {this.refrsehDialMonitor}
          tabIndex={this.state.tabIndex}
          openLoginModal={this.openLoginModal}          
        />
        <Wrapper>
          <div className="dial-title-tab flex">
            <DialTitleTabs
              tabs={this.state.tabs}
              selectTitleTab={this.selectTitleTab.bind(this)}
              id={this.state.tabIndex}
            />
            <div className={"link-btn flex"}>
              <div
                style={{ marginRight: "0.1rem", fontFamily:'NotoSansJP'}}
                onClick={this.goPage.bind(this, "bed_table")}
              >
                ベッド配置表
              </div>
              <div onClick={this.goPage.bind(this, "dial_schedule")} style={{fontFamily:'NotoSansJP'}}>
                スケジュール
              </div>
            </div>
          </div>
          {this.state.tabIndex === Dial_tab_index.DialMonitor && (
            <DialMonitor
              schedule_data={this.state.schedule_data}
              tabChange={this.tabChange}
              rows_blood={this.state.rows_blood}
              rows_measure={this.state.rows_measure}
              rows_temp={this.state.rows_temp}
              schedule_date={this.state.schedule_date}
              patientInfo={this.state.patientInfo}
              refreshScheduleInfo={this.getGenralInfo}
              done_inspection={this.state.done_inspection}
              done_injection={this.state.done_injection}
              done_dial_pres={this.state.done_dial_pres}
              done_status={this.state.done_status}
              saveEditedSchedule={this.saveEditedSchedule}
              setHandleTempData={this.setTempData}
              instruction_doctor={this.state.instruction_doctor}
              ref = {this.dialMonitorRef}
              openLoginModal={this.openLoginModal}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.BeforeConfirm && (
            <BeforeConfirm
              schedule_data={this.state.schedule_data}
              patientInfo={this.state.patientInfo}
              tabChange={this.tabChange}
              getSchedule={this.getSchedule}
              isConfirmComplete = {this.state.isConfirmComplete}
              get_generalInfo_flag = {this.get_general_flag}    
              end_dial_schedule = {this.state.end_dial_schedule}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.Sending && (
            <Sending
              patientInfo={this.state.patientInfo}
              tabChange={this.tabChange}
              schedule_date={this.state.schedule_date}
              getSchedule={this.getSchedule}
              timezone={this.state.timezone}
              history={this.props.history}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.DrainageSet && (
            <DrainageSet
              schedule_data={this.state.schedule_data}
              tabChange={this.tabChange}
              sendConsole={this.sendConsole}
              ms_start_time={this.state.ms_start_time}
              ms_end_time={this.state.ms_end_time}
              is_started={this.state.is_started}
              is_ended={this.state.is_ended}
              weight_before={this.state.weight_before}
              weight_after={this.state.weight_after}
              updateScheduleTime={this.updateScheduleTime}
              setChange={this.setChange}
              ms_cur_drainage={this.state.ms_cur_drainage}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.BloodSet && (
            <BloodSet
              schedule_data={this.state.schedule_data}
              getSchedule={this.getSchedule}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.DoctorProposal && (
            <DoctorProposal
              patientInfo={this.state.patientInfo}
              schedule_date={this.state.schedule_date}
              history={this.props.history}
              dr_proposal_list={this.state.dr_proposal_list}
              getDrProposalStatus={this.getDrProposalStatus}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.Instruction && (
            <Instruction
              patientInfo={this.state.patientInfo}
              schedule_date={this.state.schedule_date}
              checkInstructionStatus={this.checkInstructionStatus}
              history={this.props.history}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.DRMedicalRecord && (
            <DRMedicalRecord
              patientInfo={this.state.patientInfo}
              patientId={this.state.system_patient_id}
              schedule_date={this.state.schedule_date}
              schedule_data={this.state.schedule_data}
              refreshScheduleInfo={this.refresh}
              done_prescription={this.state.done_prescription}
              changeBeforeStartStatus = {this.changeBeforeStartStatus}
              history = {this.props.history}
              ref = {this.karteRef}
              closeCompleteModal = {this.closeCompleteModal}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.VAManager && (
            <VAManager
              patientInfo={this.state.patientInfo}
              schedule_date={this.state.schedule_date}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.FootCare && (
            <FootCare
              patientInfo={this.state.patientInfo}
              checkFootCare={this.checkFootCare}
              schedule_date={this.state.schedule_date}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.PatientPlan && (
            <PatientPlan
              checkPatientPlanStatus={this.getList}
              patientInfo={this.state.patientInfo}
              history={this.props.history}
            />
          )}
          {/* {this.state.tabIndex === Dial_tab_index.PatientMain && (
            <PatientMain
              patientInfo={this.state.patientInfo}
              schedule_date={this.state.schedule_date}
              system_patient_id={this.state.system_patient_id}
            />
          )} */}
          {this.state.tabIndex === Dial_tab_index.PatientInformation && (
            <PatientInformation
              patientInfo={this.state.patientInfo}
              patientId={this.state.system_patient_id}
              schedule_date={this.state.schedule_date}
              done_prescription={this.state.done_prescription}
              done_inspection={this.state.done_inspection}
              done_injection={this.state.done_injection}
              done_dial_pres={this.state.done_dial_pres}
              manage_schedule={this.state.manage_schedule}
              inspection_pattern = {this.state.inspection_pattern}
              dial_pres_pattern = {this.state.dial_pres_pattern}
              manage_pattern = {this.state.manage_pattern}
              injection_pattern = {this.state.injection_pattern}
              prescription_pattern = {this.state.prescription_pattern}
              schedule_data={this.state.schedule_data}
              contrain={this.state.contrain}
              heart={this.state.heart}
              disease={this.state.disease}
              infection={this.state.infection}
              insulin={this.state.insulin}
              refresh={this.getGeneralMedical}
              history={this.props.history}
              changePatient={this.changePatient}
              change_patient={this.state.change_patient}
              ref = {this.patientInfoRef}
            />
          )}
          {this.state.tabIndex === Dial_tab_index.MyCalendar && (
            <MyCalendarBody
              patientInfo={this.state.patientInfo}
              schedule_date={this.state.schedule_date}
            />
          )}
          {this.state.confirm_message !== undefined &&
            this.state.confirm_message !== "" &&
            this.state.isFlashPopUp !== true && (
              <SystemConfirmModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmOk.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
          {this.state.confirm_message !== undefined &&
            this.state.confirm_message !== "" &&
            this.state.confirm_event != undefined &&
            this.state.confirm_event != null && (
              <SystemConfirmModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmMoveOk.bind(this)}
                confirmTitle={this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}
          {this.state.isFlashPopUp ? (
            <FlashPopUpModal
              hideConfirm={this.flashCancel.bind(this)}
              confirmCancel={this.flashCancel.bind(this)}
              openBloodModal={this.openBloodModal.bind(this)}
              openMachineModal={this.openMachineModal.bind(this)}
              openLogModal={this.openLogModal.bind(this)}
              closeFlashPopUp={this.closeFlashPopUp.bind(this)}
              content={this.state.recv_data}
            />
          ) : (
            <></>
          )}
          {this.state.isConfirmComplete !== false && (
            <ReadStatusModal message={this.state.complete_message} />
          )}
          {this.state.isLoginModal && (
            <LoginModal
              closeModal={this.closeModal}
              closeLogin={this.closeModal}
              handleLogIn={this.handleLogIn}
              from_source="dialmain"
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeAlertModal.bind(this)}
              handleOk= {this.closeAlertModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title={this.state.confirm_alert_title}
            />
          )}
          {this.state.confirmChangeModal && (
            <ConfirmChangeTimezoneModal
              hideConfirm={this.changeTimezoneCancel.bind(this)}
              confirmCancel={this.changeTimezoneCancel.bind(this)}
              confirmOk={this.changeTimezoneOk.bind(this)}
              confirmTitle={"次の時間枠に移動しますか"}
            />
          )}
        </Wrapper>
      </Card>
    );
  }
}
DialMain.contextType = Context;
DialMain.propTypes = {
  history: PropTypes.object,
  from_source: PropTypes.string,
  bed_no: PropTypes.number,
  handleLogIn: PropTypes.func
};

export default DialMain;