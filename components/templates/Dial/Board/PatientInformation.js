import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import styled from "styled-components";
import {formatJapan, formatDateSlash, getNextDayByJapanFormat, getPrevMonthByJapanFormat} from "~/helpers/date";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as methods from "~/components/templates/Dial/DialMethods";
import {  Col } from "react-bootstrap";
import {makeList_code, makeList_number, getWeekday} from "~/helpers/dialConstants";
import * as apiClient from "~/api/apiClient";
import EditAntiHardModal from "~/components/templates/Dial/Schedule/modals/EditAntiHardModal";
import EditDailysisPrescriptionSchedulModal from "~/components/templates/Dial/Schedule/modals/EditDailysisPrescriptionSchedulModal";
import DialScheduleDetailModal from "~/components/templates/Dial/Schedule/modals/DialScheduleDetailModal";
import EditDialyserModal from "~/components/templates/Dial/Schedule/modals/EditDialyserModal";
import EditInjectionModal from "~/components/templates/Dial/Schedule/modals/EditInjectionModal";
import EditInspectionModal from "~/components/templates/Dial/Schedule/modals/EditInspectionModal";
import EditManageMoneyModal from "~/components/templates/Dial/Schedule/modals/EditManageMoneyModal";
import PrescriptionDetailModal from "./molecules/PrescriptionDetailModal";
import PatientContrainModal from "./molecules/PatientContrainModal";
import PatientInfectionModal from "./molecules/PatientInfectionModal";
import PatientMainModal from "~/components/templates/Dial/Board/PatientMainModal";
import PatientHeartModal from "./molecules/PatientHeartModal";
import MedicalHistoryModal from "~/components/templates/Dial/Board/MedicalHistoryModal";
import InsulinManageModal from "~/components/templates/Dial/Board/InsulinManageModal";
import { formatDateLine } from "../../../../helpers/date";
import DwHistoryModal from "~/components/templates/Dial/Board/molecules/DwHistoryModal";
import InspectGraphModal from "./molecules/InspectGraphModal";
import WeightBloodGraphModal from "./molecules/WeightBloodGraphModal";
import WeightBloodChart from "~/components/organisms/WeightBloodChart";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 12.5rem;
  display:flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`    
    font-size: 0.9rem;
    width: 100%;
    height: 100%;
    display:flex;
    .col-md-1,.col-md-2,.col-md-3, .col-md-4, .col-md-5, .col-md-6,.col-md-7, .col-md-8, .col-md-9,
    .col-md-10,.col-md-11,.col-md-12{
        padding-left:2px!important;
        padding-right:2px!important;
    }
    .gray-title{
      background: lightgray;
    }
    .scroll{
        overflow-y:scroll;
        overflow-x:hidden;
    }
    label{
        margin-bottom:1px;
    }
    .flex{
        display:flex;
    }
    .sub-header{
        background: rgb(0, 119, 215);
        color: white;
        position: relative;
        .detail{
            position: absolute;
            right: 1.25rem;
            cursor:pointer;
        }
    }
    .red{
        background:lightcoral;
    }
    .sub-body{
        border-left:1px solid gray;
        border-bottom:1px solid gray;
        border-right:1px solid gray;
        .one-row{
            line-height: 1.5rem;
        }
        div{
            border-top:1px solid gray;
            border-right:1px solid gray;
        }
        .sub-field{6
            background:lightgray;
        }
    }
    .wp-15{width:15%;}
    .wp-16{width:16%;}
    .wp-17{width:17%;}
    .wp-18{width:18%;}
    .wp-19{width:19%;}
    .wp-20{width:20%;}
    .wp-21{width:21%;}
    .wp-22{width:22%;}
    .wp-23{width:23%;}
    .wp-24{width:24%;}
    .wp-25{width:25%;}
    .wp-26{width:26%;}
    .wp-27{width:27%;}
    .wp-28{width:28%;}
    .wp-29{width:29%;}
    .wp-30{width:30%;}
    .wp-35{width:35%;}
    .wp-40{width:40%;}
    .wp-45{width:45%;}
    .wp-50{width:50%;}
    .wp-55{width:55%;}
    .wp-60{width:60%;}
    .wp-65{width:65%;}
    .wp-70{width:70%;}
    .wp-75{width:75%;}
    .wp-80{width:80%;}
    .wp-84{width:84%;}
    .wp-85{width:85%;}
    .wp-90{width:90%;}
    
    .first-row{
        height:auto;
        margin-bottom:0rem;
        min-height: 8.5rem;
        max-height: 8.5rem;
    }
    .second-row{
      height:auto;
      margin-bottom:0rem;
      min-height: 13.5rem;
      .one-row{
        line-height: 1.5rem;
      }
      .dial_condition {
        table{
        tr{
          display: table-row;
        }
        td{
          line-height: 1.5rem;
        }
        .gray-title {
          background: lightgray;
        }
          .td-title {
            width: 6rem;
          }
          .td-content1 {
            width: 6rem;
          }
          .one-row {
            width: 6rem;
          }
        }
      }
    }
    .third-row{
        max-height:calc(100vh - 25rem);
    }

    .one-header{
        background:lightgray;
        border:none
    }
    .one-prescript-usage{
        background: lightcyan;
        border:none;
        margin-bottom:0.625rem;
        padding-left:0.625rem;
    }
    .complication-name{
        width: calc(100% - 6.5rem);
    }
    .complication-date{
        float: right;
        width: 5.5rem;
    }
    .chat-image {
    width: 95%;
    margin-left: 0.1rem;
 }
table {
    font-size:0.9rem;
    thead{
      display:table;
      width:calc(100% - 17px);
    }
    tbody{
        display:block;
        overflow-y: scroll;
        width:100%;
    }
    tr{
        display: table;
        width: 100%;
    }
    td {
      word-break: break-all;
      font-size: 0.9rem;
      padding:0;
      padding-left:2px;
      padding-right:2px;
    }
    th {
      position: sticky;
      text-align: center;
      padding:0;
      padding-left:2px;
      padding-right:2px;
    }
    .date{
      width:5.5rem;
    }
    .number{
      width:2.5rem;
    }
  }

.graph-table {
    table {
        font-size:1rem;
    thead{
      display:table;
      width:calc(100% - 17px);
    }
    tbody{
        display:block;
        overflow-y: scroll;
        height: 100px;
        width:100%;
    }
    tr{
        display: table;
        width: 100%;
    }
      td {
        word-break: break-all;
        font-size: 0.875rem;
        padding: 0.25rem;
      }
      th {
        font-size:0.9rem;
        position: sticky;
        text-align: center;
        padding: 0.3rem;
      }
      .code-number {
          width: 12%;
          letter-spacing: -1px;
      }
      .pressure{
          width:18%;
      }
      .name{
        width:18%;
      }
  }
}
.max-min-input{
    button{
        padding: 0.1rem;
        min-width:1.7rem;
        span {
            font-size: 0.8rem;
        }
    }
}
.border-none{
    border:none!important;
}
.border-right-none{
    border-right:none!important;
}
`;
const blood_type = ['A', 'B','O','AB'];
const periodics = ["【臨時処方】", "【定期処方1】", "【定期処方2】", "【定期処方3】"];
const time_zones = ["", "午前", "午後", "夜間", "深夜"];

const week_days = ['日', '月','火', '水', '木','金', '土'];

class PatientInfomation extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let unit_master_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"dial_common_config");
    this.drainge_unit_master = unit_master_data['単位名：除水設定'];
    let material_master = sessApi.getObjectValue("dial_common_master","material_master");
    var method_master = sessApi.getObjectValue("dial_common_master","dial_method_master");
    var facility_master = sessApi.getObjectValue("dial_common_master","facility_master");
    var method_master_codes = makeList_code(method_master);
    let needle_master = material_master['穿刺針'];
    let liquid_master = material_master['透析液'];
    let fixed_tape_master = material_master['固定テープ'];
    let disinfection_liquid_master = material_master['消毒薬'];
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.primary_disease_codes = makeList_code(code_master['原疾患']);
    this.facility_options = makeList_number(facility_master);
    this.state = {
      system_patient_id:patientInfo!=undefined && patientInfo.system_patient_id,
      patientInfo,
      schedule_date,
      isshowAnti:false,
      isshowContrain:false,
      isshowDial:false,
      isshowDialyser:false,
      isshowDisease:false,
      isshowHeart:false,
      isshowInject:false,
      isshowInspect:false,
      isshowInsulin:false,
      isshowManage:false,
      isshowPatient:false,
      isshowPrescript:false,
      isshowDialPres:false,
      isshowInfection:false,
      isDwHistoryModal:false,
      isShowWeightBloodGraph:true,
      isShowWeightBloodGraphModal:false,
      
      needle_master:makeList_code(needle_master, 1),
      liquid_master:makeList_code(liquid_master, 1),
      fixed_tape_master:makeList_code(fixed_tape_master, 1),
      disinfection_liquid_master:makeList_code(disinfection_liquid_master, 1),
      isShowInspectGraph:false,
      
      timingCodeData:code_master['実施タイミング'],
      graph_data:[],
      timing_codes:makeList_code(code_master['実施タイミング']),
      schedule_data:null,
      method_master_codes,
      alert_messages: "",
      disease_history: [],
      tbody_height : 'calc(100vh - 45.2rem)',
      is_loaded: false
    }
    this.grah_max_value = 250;
    this.graph_min_value = 0;
    this.double_click=false;
    this.max_value = 9999999999;
    this.step=1;
    this.injection_master = sessApi.getObjectValue("dial_common_master","injection_master");
  }

  componentWillUnmount() {
    this.grah_max_value = null;
    this.graph_min_value = null;
    this.double_click=null;
    this.max_value = null;
    this.step=null;
    this.injection_master = null;
    
    var html_obj = document.getElementsByClassName("patient_information_warpper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }
  }
  
  async componentDidMount() {
    if (this.state.system_patient_id > 0){
      // this.getPatientInfo(this.state.system_patient_id);
      await this.getDialPlan(this.state.system_patient_id, this.props.schedule_date);
      await this.getWeightBlood(this.state.system_patient_id, this.props.schedule_date);
      await this.getComplicationData(this.state.system_patient_id, this.props.schedule_date);
      await this.getLastDisease(this.state.system_patient_id, this.props.schedule_date); //現症
  
      // if (this.props.schedule_data != undefined && this.props.schedule_data != null && Object.keys(this.props.schedule_data).length>0){
      //     this.setState({schedule_data:this.props.schedule_data})
      // } else {
      await this.getNextScheduleData(this.state.system_patient_id, this.props.schedule_date);
      // }
    } else {
      this.setState({schedule_data:null});
    }
    this.setState({is_loaded: true});
    
    var tbody_height = 'calc(100vh - 45.2rem)';
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      tbody_height = 'calc(100vh - 45.2rem - 1px)';
    } else if(parseInt(width) > 1919){
      tbody_height = 'calc(100vh - 45.2rem)';
    }
    this.setState({tbody_height});
    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function() {
      $(window).resize(function() {
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        var tbody_height = 'calc(100vh - 45.2rem)';
        if(parseInt(width) < 1367){
          tbody_height = 'calc(100vh - 45.2rem - 1px)';
        } else if(parseInt(width) > 1919){
          tbody_height = 'calc(100vh - 45.2rem)';
        }
        that.setState({tbody_height})
      });
    });
    
  }
  
  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.patientInfo.system_patient_id == this.state.system_patient_id && nextProps.schedule_date == this.state.schedule_date){
      if (!nextProps.change_patient)
        return;
    }
    if (nextProps.patientInfo != null && nextProps.patientInfo.system_patient_id >0 ){
      this.setState({
        patientInfo: nextProps.patientInfo,
        system_patient_id:nextProps.patientInfo.system_patient_id,
        schedule_date:nextProps.schedule_date,
        
      }, async () => {
        // await this.getPatientInfo(this.state.system_patient_id);
        await this.getDialPlan(this.state.system_patient_id, this.state.schedule_date);
        await this.getWeightBlood(this.state.system_patient_id, this.state.schedule_date);
        await this.getComplicationData(this.state.system_patient_id, this.props.schedule_date);
        await this.getLastDisease(this.state.system_patient_id, this.props.schedule_date); //現症
        // if (nextProps.schedule_data != undefined && nextProps.schedule_data != null && Object.keys(nextProps.schedule_data).length>0){
        //     this.setState({schedule_data:nextProps.schedule_data})
        // } else {
        await this.getNextScheduleData(this.state.system_patient_id, nextProps.schedule_date);
        // }
        if (!(this.state.system_patient_id > 0)){
          this.setState({
            patientInfo:{},
            system_patient_id:0,
            dial_plan:[],
            weight_blood:undefined,
            table_data:null,
            graph_data:[],
            graph_max:"",
            disease_history: [],
            complication_list:undefined,
            schedule_data:null
          });
        }
      })
    } else {
      this.setState({
        schedule_data:null,
        schedule_date:nextProps.schedule_date,
        patientInfo:{},
        system_patient_id:0,
        dial_plan:[],
        disease_history:[],
        weight_blood:undefined,
        table_data:null,
        graph_data:[],
        graph_max:"",
        graph_min:"",
        complication_list:undefined,
      });
    }
  }
  
  getLastDisease = async (system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/medicine_information/getLastDiseaseHistory";
    const post_data = {
      patient_id: system_patient_id,
      end_date: formatDateLine(schedule_date),
      get_last: 1,
    };
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        this.setState({disease_history: res});
      });
  }
  
  getNextScheduleData = async(system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/schedule/dial_next_schedule";
    var post_data = {
      system_patient_id: system_patient_id,
      schedule_date:formatDateLine(schedule_date),
      // schedule_date:formatDateLine(new Date()),
    }
    await apiClient._post(path, {params: post_data})
      .then(res=> {
        if (res != null){
          this.setState({
            schedule_data:res
          })
        } else {
          this.setState({
            schedule_data:null,
          })
        }
      })
  }
  
  getComplicationData = async(system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/medicine_information/examination_data/getComplicationByDate";
    var post_data = {
      system_patient_id: system_patient_id,
      schedule_date:formatDateLine(schedule_date),
    }
    
    await apiClient._post(path, {params: post_data})
      .then(res=> {
        if (res.length > 0){
          this.setState({
            complication_list:res,
          })
        } else {
          this.setState({
            complication_list:undefined,
          })
        }
      })
  }
  
  getWeightBlood = async(system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/schedule/getWeightBlood";
    const post_data = {
      system_patient_id: system_patient_id,
      schedule_date:formatDateLine(schedule_date),
      all_data:1,
    };
    await apiClient._post(path, {params: post_data})
      .then(res=> {
        let graph_data = this.makeGraphData(res);
        this.setState({
          table_data:res,
          graph_data
        });
      })
  }
  
  getPatientInfo = async(system_patient_id) => {
    let path = "/app/api/v2/dial/patient/getPatientInfo";
    const post_data = {
      system_patient_id: system_patient_id,
    };
    await apiClient._post(path, {params: post_data})
      .then(res => {
        this.setState({patientInfo:res});
      })
  }
  
  getDialPlan = async(system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/schedule/getDialPlan";
    const post_data = {
      system_patient_id: system_patient_id,
      schedule_date:formatDateLine(schedule_date),
      // schedule_date:formatDateLine(new Date()),
    }
    await apiClient._post(path, {params: post_data})
      .then(res=> {
        this.setState({dial_plan:res})
      })
  }
  
  closeHeartModal = () => {
    this.setState({
      isshowHeart:false,
    })
    this.props.refresh(this.state.system_patient_id, this.state.schedule_date);
  }
  closeModal = (refresh="") => {
    this.setState({
      isshowAnti:false,
      isshowContrain:false,
      isshowDial:false,
      isshowDialyser:false,
      isshowDisease:false,
      isshowHeart:false,
      isshowInject:false,
      isshowInspect:false,
      isshowInsulin:false,
      isshowManage:false,
      isshowPatient:false,
      isshowPrescript:false,
      isshowDialPres:false,
      isshowInfection:false,
      isDwHistoryModal:false,
      isShowInspectGraph:false,
      // isShowWeightBloodGraph:false,
      isShowWeightBloodGraphModal:false,
    });
    if(refresh=="refresh"){
      // this.props.refresh(this.state.patientInfo.system_patient_id, this.props.schedule_date);
      this.props.changePatient();
    }
  }
  showAnti = () => {
    if (this.state.schedule_data == undefined || this.state.schedule_data.length ==0 || this.state.schedule_data.dial_anti == undefined || this.state.schedule_data.dial_anti.length ==0) {
      return
    }
    this.setState({isshowAnti:true});
  }
  showContrain = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({isshowContrain:true});
  }
  showDial = () => {
    if (this.state.dial_plan != undefined && this.state.dial_plan != null && this.state.dial_plan.length>0) {
      this.setState({isshowDial:true});
    }
  }
  openDwHistoryModal = () => {
    if (this.state.schedule_data == undefined || Object.keys(this.state.schedule_data).length === 0) {
      return
    }
    this.setState({isDwHistoryModal:true});
  }
  showDialPres = () => {
    // if (this.props.done_dial_pres == undefined || this.props.done_dial_pres.length ==0) {
    //     return
    // }
    if (this.props.dial_pres_pattern == undefined || this.props.dial_pres_pattern.length ==0) {
      return
    }
    this.setState({isshowDialPres:true});
  }
  showDialyser = () => {
    if (this.state.schedule_data == undefined || this.state.schedule_data.length ==0 || this.state.schedule_data.dial_dialyzer == undefined || this.state.schedule_data.dial_dialyzer.length ==0) {
      return
    }
    this.setState({isshowDialyser:true});
  }
  showDisease = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({isshowDisease:true});
  }
  showHeart = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({isshowHeart:true});
  }
  showInfection = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({isshowInfection:true});
  }
  showInject = () => {
    // if (this.props.done_injection == undefined || this.props.done_injection.length ==0) {
    //     return
    // }
    if (this.props.injection_pattern == undefined || this.props.injection_pattern.length ==0) {
      return
    }
    this.setState({isshowInject:true});
  }
  showInspect = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    sessApi.setObjectValue("dial_setting", "patient", this.state.patientInfo);
    sessApi.setObjectValue("dial_setting","patientById", this.state.system_patient_id);
    setTimeout(()=>{
      this.props.history.replace("/dial/others/inspection_result");
    }, 100);
    
  }
  
  showComplicationList = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    
    sessApi.setObjectValue("dial_setting", "patient", this.state.patientInfo);
    sessApi.setObjectValue("dial_setting","patientById", this.state.system_patient_id);
    setTimeout(()=>{
      this.props.history.replace("/dial/others/complications_inspection_result");
    }, 100);
  }
  showInsulin = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    if(this.props.insulin == undefined || this.props.insulin.length == 0) return;
    this.setState({isshowInsulin:true});
  }
  showManage = () => {
    if (this.props.manage_pattern == undefined || this.props.manage_pattern.length ==0) {
      return
    }
    this.setState({isshowManage:true});
  }
  showPatient = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({isshowPatient:true});
  }
  showPrescript = () => {
    if (this.props.prescription_pattern == undefined || this.props.prescription_pattern.length ==0) {
      return;
    }
    this.setState({isshowPrescript:true});
  }
  
  showInspectGraph = () => {
    this.setState({isShowInspectGraph:true})
  }
  
  handleOk = () => {
    this.closeModal();
    this.getPatientInfo(this.state.system_patient_id);
    this.getDialPlan(this.state.system_patient_id, this.state.schedule_date);
    this.props.refresh(this.state.patientInfo.system_patient_id, this.props.schedule_date);
    // this.props.refresh();
  };
  
  openWeightBlood = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({
      isShowWeightBloodGraph:this.state.isShowWeightBloodGraph == true ? false : true,
    })
  };
  openWeightBloodModal = () => {
    if(this.state.patientInfo == undefined || this.state.patientInfo == null || Object.keys(this.state.patientInfo).length === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({
      isShowWeightBloodGraphModal: true,
    })
  };
  countUp = (key) => {
    if (this.state[key]<this.grah_max_value && this.state[key]>=this.graph_min_value){
      this.setState({
        [key]: this.state[key]+this.step
      });
    }
  }
  countDown = (key) => {
    if (this.state[key]<this.grah_max_value && (this.state[key]-this.step)>this.graph_min_value){
      this.setState({
        [key]: Number.isInteger(this.state[key]) ? this.state[key]-this.step : parseFloat(this.state[key]).toFixed(2)-this.step
      });
    } else {
      this.setState({
        [key]: this.graph_min_value
      });
    }
  }
  
  makeGraphData (table_data) {
    if (table_data == null || Object.keys(table_data).length == 0 ) return;
    
    let graph_data = [
      { values: [], label: "体重"},
      // { values: [], label: "後体重"},
      { values: [], label: "最低血圧"},
      { values: [], label: "最高血圧"},
      { values: [], label: "DW"},
    ];
    let max_weight_before = 0;
    
    let min_weight_after = this.max_value;
    // let max_blood = 0;
    // let min_blood = this.max_value;
    let end_date = Object.keys(table_data)[0];
    let dw_array = [];
    
    // let start_date = Object.keys(table_data)[Object.keys(table_data).length-1];
    let start_date = getPrevMonthByJapanFormat(end_date);
    Object.keys(table_data).map(index=>{
      if ((new Date(end_date).getTime() - new Date(index).getTime()) < (60 * 60 * 1000 * 24 * 30)) {
        start_date = index;
      }
    })
    let now_date = start_date;
    
    let weight_before;
    let weight_after;
    let dw;
    let dw_1;
    let weight_array = [];
    // let blood_add_min_value;
    // let blood_add_min_value_1;
    // let blood_add_max_value;
    // let blood_add_max_value_1;
    
    if ((new Date(end_date).getTime() - new Date(start_date).getTime()) >= 0) {
      do {
        let item = table_data[now_date];
        let time = now_date;
        if (item != undefined && item != null) {
          weight_before = {x: time + "01:00", y: parseFloat(item.weight_before)};
          weight_after = {x: time + "02:00", y: parseFloat(item.weight_after)};
          dw = {x: time + "01:00", y: parseFloat(item.dw)};
          dw_1 = {x: time + "02:00", y: parseFloat(item.dw)};
          if (!isNaN(parseFloat(item.weight_after))) {
            weight_array.push(parseFloat(item.weight_after));
          }
          if (!isNaN(parseFloat(item.weight_before))) {
            weight_array.push(parseFloat(item.weight_before));
          }
          if (!isNaN(parseFloat(item.dw))) {
            weight_array.push(parseFloat(item.dw));
          }
          // blood_add_min_value = {x:time + "01:00", y: parseInt((parseInt(item.before_pressure_min) + parseInt(item.after_pressure_min))/2)};
          // blood_add_min_value_1 = {x:time + "01:00", y: parseInt((parseInt(item.before_pressure_min) + parseInt(item.after_pressure_min))/2)};
          // blood_add_max_value = {x:time + "01:00", y: parseInt((parseInt(item.before_pressure_max) + parseInt(item.after_pressure_max)))/2};
          // blood_add_max_value_1 = {x:time + "01:00", y: parseInt((parseInt(item.before_pressure_max) + parseInt(item.after_pressure_max)))/2};
          // let max_pressure = blood_add_min_value < blood_add_max_value ? blood_add_max_value :blood_add_min_value;
          // let min_pressure = blood_add_min_value > blood_add_max_value ? blood_add_max_value :blood_add_min_value;
          max_weight_before = max_weight_before < parseFloat(item.weight_before) ? parseFloat(item.weight_before): max_weight_before;
          min_weight_after = min_weight_after > parseFloat(item.weight_after) ? parseFloat(item.weight_after): min_weight_after;
          // max_blood = max_blood < parseInt(max_pressure) ? parseInt(max_pressure): max_blood;
          // min_blood = min_blood > parseInt(min_pressure) ? parseInt(min_pressure): min_blood;
          if (!isNaN(parseFloat(item.dw))) {
            dw_array.push(parseFloat(item.dw));
          }
        } else {
          weight_before = {x: time + "01:00", y:null};
          weight_after = {x: time + "02:00", y:null};
          dw = {x: time + "01:00", y:null};
          dw_1 = {x: time + "02:00", y:null};
          // blood_add_min_value = {x:time + "01:00", y:null};
          // blood_add_min_value_1 = {x:time + "01:00", y:null};
          // blood_add_max_value = {x:time + "01:00", y:null};
          // blood_add_max_value_1 = {x:time + "01:00", y:null};
        }
        graph_data[0].values.push(weight_before);
        graph_data[0].values.push(weight_after);
        // graph_data[1].values.push(blood_add_min_value);
        // graph_data[1].values.push(blood_add_min_value_1);
        // graph_data[2].values.push(blood_add_max_value);
        // graph_data[2].values.push(blood_add_max_value_1);
        graph_data[3].values.push(dw);
        graph_data[3].values.push(dw_1);
        // 最大値の初期値は、範囲内の血圧と前体重の中の最大、最小値の初期値は、範囲内の血圧と後体重の最小
        
        now_date = getNextDayByJapanFormat(now_date);
        now_date = formatDateLine(now_date);
      } while ((new Date(now_date).getTime() <= new Date(end_date).getTime()));
    }
    
    // Object.keys(table_data).map(index=>{
    
    // });
    let first_dw = dw_array.length > 0 ? dw_array[0] : null;
    // let graph_min = min_blood > min_weight_after ? min_weight_after : min_blood;
    // let graph_max = max_blood > max_weight_before ? max_blood : max_weight_before;
    // graph_min = graph_min == this.max_value ? 0 : graph_min;
    
    let max_value = weight_array.length > 0 ? Math.max(...weight_array) : null;
    let min_value = weight_array.length > 0 ? Math.min(...weight_array) : null;
    let weight_graph_max = max_value > 0 ? Math.round(max_value + 10) : this.grah_max_value;
    let weight_graph_min = min_value > 0 ? Math.round(min_value) - 2 : this.graph_min_value;
    if (first_dw != null) {
      this.setState({
        graph_max:first_dw % 1 == 0 ? parseInt(first_dw) + 7 : Math.round(first_dw) + 7,
        graph_min:first_dw % 1 == 0 ?  parseInt(first_dw) -2 : Math.round(first_dw) - 2,
      });
    } else {
      this.setState({
        // graph_max:graph_max + 2,
        // graph_min:graph_min - 2,
        graph_max: weight_graph_max,
        graph_min: weight_graph_min < 0 ? 0 : weight_graph_min,
      });
    }
    return graph_data;
  }
  
  convertDecimal = (_val, _digits) => {
    if (isNaN(parseFloat(_val))) return "";
    return parseFloat(_val).toFixed(_digits);
  }
  zenkakuToHankaku = (mae) => {
    let zen = new Array(
      'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ'
      ,'サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト'
      ,'ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ'
      ,'マ','ミ','ム','メ','モ','ヤ','ヰ','ユ','ヱ','ヨ'
      ,'ラ','リ','ル','レ','ロ','ワ','ヲ','ン'
      ,'ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ'
      ,'ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ'
      ,'パ','ピ','プ','ペ','ポ'
      ,'ァ','ィ','ゥ','ェ','ォ','ャ','ュ','ョ','ッ'
      ,'゛','°','、','。','「','」','ー','・',
    );
    let hirakana = new Array(
      'あ','い','う','え','お','か','き','く','け','こ'
      ,'さ','し','す','せ','そ','た','ち','つ','て','と'
      ,'な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ'
      ,'ま','み','む','め','も','や','い','ゆ','え','よ'
      ,'ら','り','る','れ','ろ','わ','を','ん'
      ,'が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ'
      ,'だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ'
      ,'ぱ','ぴ','ぷ','ぺ','ぽ'
      ,'ぁ','ぃ','ぅ','ぇ','ぉ','ゃ','ゅ','ょ','っ'
      ,'゛','°','、','。','「','」','ー','・',
    );
    
    let han = new Array(
      'ｱ','ｲ','ｳ','ｴ','ｵ','ｶ','ｷ','ｸ','ｹ','ｺ'
      ,'ｻ','ｼ','ｽ','ｾ','ｿ','ﾀ','ﾁ','ﾂ','ﾃ','ﾄ'
      ,'ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ'
      ,'ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ﾔ','ｲ','ﾕ','ｴ','ﾖ'
      ,'ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ｦ','ﾝ'
      ,'ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ','ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ'
      ,'ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ','ﾊﾞ','ﾋﾞ','ﾌﾞ','ﾍﾞ','ﾎﾞ'
      ,'ﾊﾟ','ﾋﾟ','ﾌﾟ','ﾍﾟ','ﾎﾟ'
      ,'ｧ','ｨ','ｩ','ｪ','ｫ','ｬ','ｭ','ｮ','ｯ'
      ,'ﾞ','ﾟ','､','｡','｢','｣','ｰ','･'
    );
    
    let ato = "";
    
    for (let i=0;i<mae.length;i++){
      let maechar = mae.charAt(i);
      let zenindex = zen.indexOf(maechar);
      let hindex = hirakana.indexOf(maechar);
      if(zenindex >= 0){
        maechar = han[zenindex];
      } else if(hindex >= 0) {
        maechar = han[hindex];
      }
      ato += maechar;
    }
    
    ato = ato.replace('　', ' ');
    
    return ato;
  }
  toHalfWidth = (strVal) => {
    // 半角変換
    var halfVal = strVal.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    
    return halfVal;
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

  closeAlertModal = () => {
    this.setState({alert_messages: ""});
  }
  
  render(){
    let {patientInfo, table_data, method_master_codes, dial_plan, disease_history} = this.state;
    var {inspection_pattern, dial_pres_pattern, manage_pattern, injection_pattern, prescription_pattern} = this.props;
    var schedule_data = this.state.schedule_data;
    let rh = "";
    if (patientInfo != undefined &&
      patientInfo != null &&
      patientInfo.RH != undefined &&
      patientInfo.RH != null) {
      rh = patientInfo.RH == 0 ? "+" : patientInfo.RH == 1 ? "-" : "";
      if (rh != "") rh = "(" + rh + ")";
    }
    let graph_date_array = null;
    if (table_data != undefined && table_data != null && Object.keys(table_data).length > 0) graph_date_array = Object.keys(table_data);
    return (
      <Wrapper className="patient_information_warpper">
        {this.state.is_loaded ? (
          <>
            <Col md="7">
              <div className="first-row flex">
                <Col md="8">
                  <div className="personal_info" style={{fontSize:'0.85rem'}}>
                    <div className="sub-header flex">
                      <div className="sub-title">基本情報/緊急連絡先</div>
                      <div className="detail" onClick={this.showPatient}>詳細</div>
                    </div>
                    <div className="sub-body" style={{overflowY:'auto', height:'6.45rem'}}>
                      <div className="flex one-row border-none" >
                        <div className="sub-field wp-16 gray-title">住所</div>
                        <div className="sub-value wp-84 border-right-none">
                          {patientInfo!=undefined && patientInfo.address != undefined ? patientInfo.address + ' ':' '}
                          {patientInfo!=undefined && patientInfo.building_name != undefined ? patientInfo.building_name:''}
                        </div>
                      </div>
                      <div className="flex one-row border-none">
                        <div className="sub-field wp-16 gray-title">透析導入日</div>
                        <div className="sub-value wp-40">{patientInfo!=null && patientInfo!=undefined && patientInfo.dial_start_date != undefined ? patientInfo.dial_start_date:''}</div>
                        <div className="sub-field wp-17 gray-title">身長/血液型</div>
                        <div className="sub-value wp-27 border-right-none">
                          {patientInfo!=undefined && patientInfo!=null && patientInfo.tall > 0?patientInfo.tall + 'cm/':''}
                          {patientInfo!=undefined && patientInfo!=null && patientInfo.blood_type != null && patientInfo.blood_type != 4 ? blood_type[patientInfo.blood_type] + rh:''}
                        </div>
                      </div>
                      <div className="flex one-row border-none">
                        <div className="sub-field wp-16 gray-title">導入病院</div>
                        <div className="sub-value wp-40">{patientInfo!=undefined && patientInfo!=null ? patientInfo.facility_name:''}</div>
                        <div className="sub-field wp-17 gray-title">自宅</div>
                        <div className="sub-value wp-27 border-right-none">{patientInfo!=undefined && patientInfo!=null && patientInfo.tel_number != null?patientInfo.tel_number:''}</div>
                      </div>
                      <div className="flex one-row border-none">
                        <div className="sub-field wp-16 gray-title">生年月日</div>
                        <div className="sub-value wp-40">{patientInfo!=undefined && patientInfo!=null && patientInfo.birthday != null?formatJapan(patientInfo.birthday) +'('+patientInfo.age+'歳)':''}</div>
                        <div className="sub-field wp-17 gray-title">携帯</div>
                        <div className="sub-value wp-27 border-right-none">{patientInfo!=undefined && patientInfo!=null && patientInfo.mobile_number != null?patientInfo.mobile_number:''}</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="4">
                  <div className="disease_history_info">
                    <div className="sub-header flex">
                      <div className="sub-title">病歴</div>
                      <div className="detail" onClick={this.showDisease}>詳細</div>
                    </div>
                    <div className="flex one-row" style={{borderRight:"1px solid grey", borderTop:"1px solid grey", height:'1.3rem'}}>
                      <div className="sub-field wp-30 gray-title" style={{paddingLeft:"0.2rem", borderRight:"1px solid grey", borderLeft:"1px solid grey"}}>原疾患</div>
                      <div className="sub-value" style={{paddingLeft:"0.2rem"}}>{(patientInfo !== undefined && patientInfo != null && patientInfo.primary_disease > 0) ? this.primary_disease_codes[patientInfo.primary_disease] : ""}</div>
                    </div>
                    <div className="sub-body scroll" style={{minHeight:"5.1rem", maxHeight:"5.1rem", border:"1px solid gray"}}>
                      {disease_history != undefined && disease_history != null && disease_history.length>0 && (
                        disease_history.map((item, index) => {
                          if (item.number == disease_history[0].number)
                            return(
                              <>
                                <div key={index} className="sub-value" style={{border:'none'}}>{item.name}</div>
                              </>
                            )
                        })
                      )}
          
                    </div>
                  </div>
                </Col>
              </div>
              <div className="second-row">
                <Col md="12">
                  <div className="dial_condition">
                    <div className="sub-header flex">
                      <div className="sub-title">透析条件</div>
                      <div className="detail flex">
                        <div style={{paddingRight:'0.3rem'}} onClick={this.openDwHistoryModal.bind(this)}>DW履歴</div>
                        <div onClick={this.showDial}>詳細</div>
                      </div>
                    </div>
                    <div className="sub-body flex" style={{height:'13.4rem'}}>
                      <table className="table-scroll condition-table table table-bordered">
                        <tr>
                          <td className="td-title gray-title" rowSpan={this.state.dial_plan !== undefined && this.state.dial_plan != null && this.state.dial_plan.length > 0 ? this.state.dial_plan.length : 1}>透析予定</td>
                          <td className='one-row' style={{borderBottom:'white'}}>
                            {dial_plan !== undefined && dial_plan[0] !== undefined ? (week_days[dial_plan[0].day] + "  " + time_zones[dial_plan[0].time_zone] +  "  " + dial_plan[0].reservation_time) : ""}
                          </td>
                          <td className="td-title gray-title">透析液/温度</td>
                          <td className="td-content">
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && this.state.liquid_master[schedule_data.dial_pattern.dial_liquid] != undefined && this.state.liquid_master[schedule_data.dial_pattern.dial_liquid] +'/'}
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && schedule_data.dial_pattern.degree}
                          </td>
                          <td className="td-title gray-title">DW</td>
                          <td className="td-content1">
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && this.drainge_unit_master['dw'] != undefined && schedule_data.dial_pattern.dw>0?parseFloat(schedule_data.dial_pattern.dw).toFixed(1) + this.drainge_unit_master['dw'].value: ""}
                          </td>
                        </tr>
                        <tr>
                          {dial_plan !== undefined && dial_plan[1] !== undefined ? (
                            <td className='one-row' style={{borderBottom:'white'}}>
                              {week_days[dial_plan[1].day] + "  " + time_zones[dial_plan[1].time_zone] +  "  " + dial_plan[1].reservation_time}
                            </td>
                          ):(
                            <>
                              {((dial_plan === undefined || dial_plan.length == 0) ||(dial_plan !== undefined && dial_plan.length == 1)) ? (
                                <>
                                  <td className="td-title gray-title">治療法</td>
                                  <td className="one-row">
                                    {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && schedule_data.dial_pattern.dial_method > 0
                                    && method_master_codes!= null && method_master_codes[schedule_data.dial_pattern.dial_method]}
                                  </td>
                                </>
                              ):(
                                <>
                                  <td className="td-title">&nbsp;</td>
                                  <td className="one-row">&nbsp;</td>
                                </>
                              )}
                            </>
                          )}
                          <td className="td-title gray-title">穿刺針A</td>
                          <td className="td-content">
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && this.state.needle_master[schedule_data.dial_pattern.puncture_needle_a] != undefined && this.state.needle_master[schedule_data.dial_pattern.puncture_needle_a]}
                          </td>
                          <td className="td-title gray-title">補液量</td>
                          <td className="td-content1">
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && this.drainge_unit_master['fluid_amount'] != undefined && schedule_data.dial_pattern.fluid_amount >0 ? schedule_data.dial_pattern.fluid_amount + this.drainge_unit_master['fluid_amount'].value:""}
                          </td>
                        </tr>
                        <tr>
                          {dial_plan !== undefined && dial_plan[2] !== undefined ? (
                            <td className='one-row' style={{borderBottom:'white'}}>
                              {week_days[dial_plan[2].day] + "  " + time_zones[dial_plan[2].time_zone] +  "  " + dial_plan[2].reservation_time}
                            </td>
                          ):(
                            <>
                              {dial_plan !== undefined && dial_plan.length == 2 ? (
                                <>
                                  <td className="td-title gray-title">治療法</td>
                                  <td className="one-row">
                                    {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && schedule_data.dial_pattern.dial_method > 0
                                    && method_master_codes!= null && method_master_codes[schedule_data.dial_pattern.dial_method]}
                                  </td>
                                </>
                              ):(
                                <>
                                  <td className="td-title gray-title">&nbsp;</td>
                                  <td className="one-row">&nbsp;</td>
                                </>
                              )}
                            </>
                          )}
                          <td className="td-title gray-title">穿刺針V</td>
                          <td className="td-content">
                            {schedule_data != undefined && schedule_data != null && schedule_data.dial_pattern != null && this.state.needle_master[schedule_data.dial_pattern.puncture_needle_v] != undefined && this.state.needle_master[schedule_data.dial_pattern.puncture_needle_v]}
                          </td>
                          <td className="td-title gray-title">補液速度</td>
                          <td className="td-content1">
                            {schedule_data != undefined && schedule_data != null && schedule_data.dial_pattern != null && this.drainge_unit_master['fluid_speed'] != undefined && schedule_data.dial_pattern.fluid_speed >0 ? schedule_data.dial_pattern.fluid_speed + this.drainge_unit_master['fluid_speed'].value :""}
                          </td>
                        </tr>
                        <tr>
                          {dial_plan !== undefined && dial_plan[3] !== undefined ? (
                            <td className='one-row' style={{borderBottom:'white'}}>
                              {week_days[dial_plan[3].day] + "  " + time_zones[dial_plan[3].time_zone] +  "  " + dial_plan[3].reservation_time}
                            </td>
                          ):(
                            <>
                              {dial_plan !== undefined && dial_plan.length == 3 ? (
                                <>
                                  <td className="td-title gray-title">治療法</td>
                                  <td className="one-row">
                                    {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && schedule_data.dial_pattern.dial_method > 0
                                    && method_master_codes!= null && method_master_codes[schedule_data.dial_pattern.dial_method]}
                                  </td>
                                </>
                              ):(
                                <>
                                  <td className="td-title">&nbsp;</td>
                                  <td className="one-row">&nbsp;</td>
                                </>
                              )}
                            </>
                          )}
                          <td className="td-title gray-title">消毒薬</td>
                          <td className="td-content">
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && this.state.disinfection_liquid_master[schedule_data.dial_pattern.disinfection_liquid]!= undefined && this.state.disinfection_liquid_master[schedule_data.dial_pattern.disinfection_liquid]}
                          </td>
                          <td className="td-title gray-title">液流量</td>
                          <td className="td-content1">
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && this.drainge_unit_master['dialysate_amount'] != undefined &&  schedule_data.dial_pattern.dialysate_amount != null &&  schedule_data.dial_pattern.dialysate_amount != '' ? schedule_data.dial_pattern.dialysate_amount + this.drainge_unit_master['dialysate_amount'].value : ""}
                          </td>
                        </tr>
                        <tr>
                          {dial_plan !== undefined && dial_plan[4] !== undefined ? (
                            <td className='one-row' style={{borderBottom:'white'}}>
                              {week_days[dial_plan[4].day] + "  " + time_zones[dial_plan[4].time_zone] +  "  " + dial_plan[4].reservation_time}
                            </td>
                          ):(
                            <>
                              {dial_plan !== undefined && dial_plan.length == 4 ? (
                                <>
                                  <td className="td-title gray-title">治療法</td>
                                  <td className="one-row">
                                    {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && schedule_data.dial_pattern.dial_method > 0
                                    && method_master_codes!= null && method_master_codes[schedule_data.dial_pattern.dial_method]}
                                  </td>
                                </>
                              ):(
                                <>
                                  <td className="td-title">&nbsp;</td>
                                  <td className="one-row">&nbsp;</td>
                                </>
                              )}
                            </>
                          )}
                          <td className="td-title gray-title">固定テープ</td>
                          <td className="td-content">
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && this.state.fixed_tape_master[schedule_data.dial_pattern.fixed_tape]!=undefined && this.state.fixed_tape_master[schedule_data.dial_pattern.fixed_tape]}
                          </td>
                          <td className="td-title gray-title">血流量</td>
                          <td className="td-content1">
                            {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && this.drainge_unit_master['blood_flow'] != undefined && schedule_data.dial_pattern.blood_flow > 0 ? schedule_data.dial_pattern.blood_flow + this.drainge_unit_master['blood_flow'].value : ''}
                          </td>
                        </tr>
                        {dial_plan !== undefined && dial_plan[5] !== undefined ? (
                          <tr>
                            <td className='one-row' style={{borderBottom:'white'}}>
                              {week_days[dial_plan[5].day] + "  " + time_zones[dial_plan[5].time_zone] +  "  " + dial_plan[5].reservation_time}
                            </td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content">&nbsp;</td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content1">&nbsp;</td>
                          </tr>
                        ):(
                          <tr>
                            {dial_plan !== undefined && dial_plan.length == 5 ? (
                              <>
                                <td className="td-title gray-title">治療法</td>
                                <td className="one-row">
                                  {schedule_data !== undefined && schedule_data != null && schedule_data.dial_pattern != null && schedule_data.dial_pattern.dial_method > 0
                                  && method_master_codes!= null && method_master_codes[schedule_data.dial_pattern.dial_method]}
                                </td>
                              </>
                            ):(
                              <>
                                <td className="td-title">&nbsp;</td>
                                <td className="one-row">&nbsp;</td>
                              </>
                            )}
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content">&nbsp;</td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content1">&nbsp;</td>
                          </tr>
                        )}
                        {dial_plan !== undefined && dial_plan[6] !== undefined ? (
                          <tr>
                            <td className='one-row' style={{borderBottom:'white'}}>
                              {week_days[dial_plan[6].day] + "  " + time_zones[dial_plan[6].time_zone] +  "  " + dial_plan[6].reservation_time}
                            </td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content">&nbsp;</td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content1">&nbsp;</td>
                          </tr>
                        ):(
                          <tr>
                            {dial_plan !== undefined && dial_plan.length == 6 ? (
                              <>
                                <td className="td-title gray-title">治療法</td>
                                <td className="one-row">
                                  {schedule_data != undefined && schedule_data != null && schedule_data.dial_pattern != null && schedule_data.dial_pattern.dial_method > 0
                                  && method_master_codes!= null && method_master_codes[schedule_data.dial_pattern.dial_method]}
                                </td>
                              </>
                            ):(
                              <>
                                <td className="td-title">&nbsp;</td>
                                <td className="one-row">&nbsp;</td>
                              </>
                            )}
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content">&nbsp;</td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content1">&nbsp;</td>
                          </tr>
                        )}
                        {dial_plan !== undefined && dial_plan[7] !== undefined ? (
                          <tr>
                            <td className='one-row' style={{borderBottom:'white'}}>
                              {week_days[dial_plan[7].day] + "  " + time_zones[dial_plan[7].time_zone] +  "  " + dial_plan[7].reservation_time}
                            </td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content">&nbsp;</td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content1">&nbsp;</td>
                          </tr>
                        ):(
                          <tr>
                            {dial_plan !== undefined && dial_plan.length == 7 ? (
                              <>
                                <td className="td-title gray-title">治療法</td>
                                <td className="one-row">
                                  {schedule_data != undefined && schedule_data != null && schedule_data.dial_pattern != null && schedule_data.dial_pattern.dial_method > 0
                                  && method_master_codes!= null && method_master_codes[schedule_data.dial_pattern.dial_method]}
                                </td>
                              </>
                            ):(
                              <>
                                <td className="td-title">&nbsp;</td>
                                <td className="one-row">&nbsp;</td>
                              </>
                            )}
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content">&nbsp;</td>
                            <td className="td-title">&nbsp;</td>
                            <td className="td-content1">&nbsp;</td>
                          </tr>
                        )}
                      </table>
                    </div>
                  </div>
                </Col>
              </div>
              <div className="third-row flex">
                <Col md = "5">
                  <div className="prescript">
                    <div className="sub-header flex">
                      <div className="sub-title">処方</div>
                      <div className="detail" onClick={this.showPrescript}>詳細</div>
                    </div>
                    <div className="" style={{minHeight:"calc(100vh - 34rem)", maxHeight:"calc(100vh - 34rem)", border:"1px solid gray", overflowX:'hidden', overflowY:'auto'}}>
                      {this.state.system_patient_id > 0 && prescription_pattern != undefined && prescription_pattern != null && prescription_pattern.length>0 && (
                        prescription_pattern.map((item) => {
                          var week_days =null;
                          var weekday_str = '';
                          if (item.weekday>0) week_days = getWeekday(item.weekday);
                          if (week_days != null){
                            week_days.map(val => {
                              weekday_str += val;
                            })
                          }
                          return(
                            <>
                              <div className="one-prescript-header one-header">{item.regular_prescription_number != null && periodics[item.regular_prescription_number]}({weekday_str})</div>
                              {item.data_json.length > 0 && item.data_json.map((rp_item, index)=>{
                                return(
                                  <>
                                    <span>{index+1})</span>
                                    {rp_item.medicines.length > 0 && rp_item.medicines.map((medi_item, sub_index)=>{
                                      return (
                                        <>
                                          <span style={{paddingLeft: sub_index != 0?'0.8rem':'0px'}}>{medi_item.item_name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                          <span>{medi_item.amount}{medi_item.unit != undefined && medi_item.unit != "" ? medi_item.unit+ "　" : "　"}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}</span>
                                          <br/>
                                        </>
                                      )
                                    })}
                                    <div className="one-prescript-usage">
                                      <span>{rp_item.usage_name}</span>
                                      <span>
                                    {rp_item.days !== undefined && rp_item.days !== null && rp_item.disable_days_dosing == 0? "("+rp_item.days+(rp_item.prescription_category == "頓服"? "回分)" : "日分)") : ""}
                                  </span>
                                    </div>
                                  </>
                                )
                              })
                              }
                            </>
                          )
                        })
                      )}
                    </div>
                  </div>
                </Col>
                <Col md = "7">
                  <div className="anti">
                    <div className="sub-header flex">
                      <div className="sub-title">抗凝固法</div>
                      <div className="detail" onClick={this.showAnti}>詳細</div>
                    </div>
                    <div className="scroll" style={{minHeight:"calc(100vh - 54rem)", maxHeight:"calc(100vh - 54rem)", border:"1px solid gray"}}>
            
                      {this.state.system_patient_id > 0 && schedule_data != undefined && schedule_data != null && schedule_data.dial_anti != undefined && schedule_data.dial_anti != null && (
                        <>
                          <div>
                            {schedule_data != undefined && schedule_data != null && schedule_data.dial_anti != undefined && schedule_data.dial_anti != null && schedule_data.dial_anti.title}
                          </div>
                          {schedule_data.dial_anti.anti_items != null && schedule_data.dial_anti.anti_items.length > 0 && schedule_data.dial_anti.anti_items.map((item) => {
                            return(
                              <>
                                <div style={{marginLeft:'0.625rem'}}>
                                  <span className="">{item.name}&nbsp;&nbsp;&nbsp;</span>
                                  <span>{item.amount}</span>
                                  <span>{item.unit}</span>
                                </div>
                              </>
                            )
                          })}
                        </>
                      )
                      }
                    </div>
                  </div>
        
                  <div className="flex">
                    <div className="dialyser wp-50">
                      <div className="sub-header flex">
                        <div className="sub-title">ダイアライザ</div>
                        <div className="detail" onClick={this.showDialyser}>詳細</div>
                      </div>
                      <div className="scroll" style={{minHeight:"5.125rem", maxHeight:"5.125rem", border:"1px solid gray"}}>
                        {this.state.system_patient_id > 0 && schedule_data != undefined && schedule_data != null && schedule_data.dial_dialyzer != undefined && schedule_data.dial_dialyzer != null && schedule_data.dial_dialyzer.length>0 &&
                        schedule_data.dial_dialyzer.map((item) => {
                          return(
                            <div key={item.dialyzer_code}>{item.name}</div>
                          )
                        })
                        }
                      </div>
                    </div>
                    <div className="dial_pres wp-50">
                      <div className="sub-header flex">
                        <div className="sub-title">透析中処方</div>
                        <div className="detail" onClick={this.showDialPres}>詳細</div>
                      </div>
                      <div className="scroll" style={{minHeight:"5.125rem", maxHeight:"5.125rem", border:"1px solid gray"}}>
                        {this.state.system_patient_id > 0 && dial_pres_pattern != undefined && dial_pres_pattern.length >0 && dial_pres_pattern.map((item, index) => {
                          var week_days =null;
                          var weekday_str = '';
                          if (item.weekday>0) week_days = getWeekday(item.weekday);
                          if (week_days != null){
                            week_days.map(val => {
                              weekday_str += val;
                            })
                          }
                          return(
                            <>
                              <div className="one">
                                <span>{index+1}&nbsp;</span>
                                <span>{item.medicine_name}({weekday_str})</span>
                              </div>
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="injection wp-50">
                      <div className="sub-header flex">
                        <div className="sub-title">注射</div>
                        <div className="detail" onClick={this.showInject}>詳細</div>
                      </div>
                      <div className="scroll" style={{minHeight:"12.2rem", maxHeight:"12.2rem", border:"1px solid gray"}}>
                        {this.state.system_patient_id > 0 && injection_pattern != undefined && injection_pattern.length>0 && injection_pattern.map((item, index) => {
                          var week_days =null;
                          var weekday_str = '';
                          if (item.weekday>0) week_days = getWeekday(item.weekday);
                          if (week_days != null){
                            week_days.map(val => {
                              weekday_str += val;
                            })
                          }
                          return(
                            <>
                              <div className="one-injection-header one-header" style={{fontSize:'0.9rem'}}>
                                {index + 1}&nbsp;&nbsp;{"【定期注射】(" + weekday_str + ")"}
                                {(this.state.timing_codes !== undefined && this.state.timing_codes != null && this.state.timing_codes[item.timing_code] !== undefined) ? this.state.timing_codes[item.timing_code] : '' }
                              </div>
                              {item.data_json.map(rp_item => {
                                if (rp_item.item_name !== ''){
                                  return(
                                    <>
                                      <span style={{paddingLeft:"0.3rem", fontSize:'0.9rem'}}>{rp_item.item_name}&nbsp;&nbsp;&nbsp;{item.amount}{this.getInjectionUnit(item.item_code)}</span><br/>
                                    </>
                                  )
                                }
                              })}
                            </>
                          )
                        })}
                      </div>
                    </div>
          
                    <div className="insulin wp-50">
                      <div className="sub-header flex">
                        <div className="sub-title">インスリン</div>
                        <div className="detail" onClick={this.showInsulin}>詳細</div>
                      </div>
                      <div className="scroll" style={{minHeight:"12.2rem", maxHeight:"12.2rem", border:"1px solid gray"}}>
                        {this.state.system_patient_id > 0 && this.props.insulin.insulin_data != undefined && this.props.insulin.insulin_data[0] !== undefined && this.props.insulin.insulin_data[0] !== null && this.props.insulin.insulin_data[0].length > 0 && (
                          this.props.insulin.insulin_data[0].map(item => {
                            return (
                              <>
                                <span>{'毎日'}</span><br />
                                <span>{item['insulin']}</span><br />
                                <span>{item['amount_1'] + '-' + item['amount_2'] + '-' + item['amount_3'] + '-' + item['amount_4']}</span><br />
                              </>
                            )
                          })
                        )}
                        <br />
                        {this.state.system_patient_id > 0 && this.props.insulin.insulin_data != undefined && this.props.insulin.insulin_data[1] !== undefined && this.props.insulin.insulin_data[1] !== null && this.props.insulin.insulin_data[1].length > 0 && (
                          this.props.insulin.insulin_data[1].map(item => {
                            return (
                              <>
                                <span>{'透析日'}</span><br />
                                <span>{item['insulin']}</span><br />
                                <span>{item['amount_1'] + '-' + item['amount_2'] + '-' + item['amount_3'] + '-' + item['amount_4']}</span><br />
                              </>
                            )
                          })
                        )}
                        <br />
                        {this.state.system_patient_id > 0 && this.props.insulin.insulin_data != undefined && this.props.insulin.insulin_data[2] !== undefined && this.props.insulin.insulin_data[2] !== null && this.props.insulin.insulin_data[2].length > 0 && (
                          this.props.insulin.insulin_data[2].map(item => {
                            return (
                              <>
                                <span className={'text-center'}>{'非透析日'}</span><br />
                                <span>{item['insulin']}</span><br />
                                <span>{item['amount_1'] + '-' + item['amount_2'] + '-' + item['amount_3'] + '-' + item['amount_4']}</span><br />
                              </>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </Col>
            <Col md="5">
              <div className="first-row flex">
                <div className="contraind wp-50">
                  <div className="sub-header flex">
                    <div className="sub-title">禁忌薬</div>
                    <div className="detail"  onClick={this.showContrain}>詳細</div>
                  </div>
                  <div className="sub-body scroll" style={{minHeight:"6.4rem", maxHeight:"6.4rem", border:"1px solid gray"}}>
                    {this.state.system_patient_id > 0 && this.props.contrain !== undefined && this.props.contrain !== null && this.props.contrain.length > 0 && (
                      this.props.contrain.map((item) => {
                        return (
                          <>
                            <span>{item.name + " " + item.note}</span><br />
                          </>)
                      })
                    )}
                  </div>
                </div>
                <div className="manage wp-50">
                  <div className="sub-header flex">
                    <div className="sub-title">管理料/指導料</div>
                    <div className="detail" onClick={this.showManage}>詳細</div>
                  </div>
                  <div className="scroll" style={{minHeight:"6.4rem", maxHeight:"6.4rem", border:"1px solid gray"}}>
                    {/* {manage_schedule != undefined && manage_schedule != null && manage_schedule.length>0 && manage_schedule.map(item => {
                                    return(
                                        <>
                                        <div>{item.name}</div>
                                        </>
                                    )
                                })} */}
                    {this.state.system_patient_id > 0 && manage_pattern != undefined && manage_pattern != null && manage_pattern.length>0 && manage_pattern.map(item => {
                      var week_days =null;
                      var weekday_str = '';
                      if (item.weekday>0) week_days = getWeekday(item.weekday);
                      if (week_days != null){
                        week_days.map(val => {
                          weekday_str += val;
                        })
                      }
            
                      return(
                        <>
                          <div>{item.name}({weekday_str})</div>
                        </>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="second-row flex">
                <div className="contraind wp-50">
                  <div className="sub-header flex red">
                    <div className="sub-title">心胸比</div>
                    <div className="detail" onClick={this.showHeart}>詳細</div>
                  </div>
                  <div className="sub-body" style={{minHeight:"11.5rem", maxHeight:"11.5rem", border:"1px solid gray"}}>
                    <table className="table-scroll table table-bordered" id="code-table">
                      <thead>
                      <th className="date gray-title">日付</th>
                      {/* <th className="number">心臓</th> */}
                      {/* <th className="number">胸郭</th> */}
                      <th className="gray-title" style={{width:'3.7rem'}}>心胸比</th>
                      <th className="number gray-title">透析</th>
                      <th className="gray-title">体重</th>
                      {/* <th></th> */}
                      </thead>
                      <tbody style={{height:'9.5rem'}}>
                      {this.state.system_patient_id > 0 && this.props.heart != undefined && this.props.heart.length> 0 && (
                        this.props.heart.map(item => {
                          var before_or_after = "";
                          if (item.dial_status != undefined && item.dial_status != null) {
                            if (item.dial_status == 1) before_or_after = "後";
                            else before_or_after = "前";
                          } else {
                            if (this.state.timing_codes[item.timing_code] =="透析終了後" || this.state.timing_codes[item.timing_code] =="透析終了時") before_or_after = "後";
                            else before_or_after = "前";
                          }
                          var sch_date = item.schedule_date;
                          var month_day = sch_date.split('-')[0] + '/' + sch_date.split('-')[1] + '/' + sch_date.split('-')[2];
                          return(
                            <>
                              <tr>
                                <td className="date">{month_day}</td>
                                {/* <td className="number text-right">{item.heart}</td> */}
                                {/* <td className="number text-right">{item.thorax}</td> */}
                                <td className='text-right' style={{width:'3.7rem'}}>{item.chest_ratio}</td>
                                <td className="number text-right">{before_or_after}</td>
                                <td className="text-right">{item.dial_status !== undefined && item.dial_status === 1 ? this.convertDecimal(item.weight_after, 1)
                                  : this.convertDecimal(item.weight_before, 1)}
                                </td>
                                {/* <td>{item.comment}</td> */}
                              </tr>
                            </>
                          )
                        })
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="manage wp-50">
                  <div className="sub-header flex red">
                    <div className="sub-title">感染症</div>
                    <div className="detail" onClick={this.showInfection}>詳細</div>
                  </div>
                  <div className="sub-body scroll" style={{minHeight:"11.5rem", maxHeight:"11.5rem", border:"1px solid gray"}}>
                    {this.state.system_patient_id > 0 && this.props.infection !== undefined && this.props.infection !== null && this.props.infection.length > 0 && (
                      this.props.infection.map((item) => {
                        return (
                          <>
                            <span>{item.name + " " + item.note}</span><br />
                          </>)
                      })
                    )}
                  </div>
                </div>
              </div>
              <div className="third-row">
                <div className="graph" style={{border:'1px solid gray'}}>
                  <div className="sub-header flex red">
                    <div className="sub-title">体重/血圧</div>
                    <div className="detail" style={{marginRight:"7rem"}} onClick={this.openWeightBlood}> {this.state.isShowWeightBloodGraph ? "一覧に切替":"グラフに切替"}</div>
                    <div className="detail ml-2" onClick={this.openWeightBloodModal}> 詳細グラフ</div>
                  </div>
                  {this.state.isShowWeightBloodGraph ? (
                    <div className={`d-flex w-100 ml-2 mt-2 weight-blood-graph`} style={{height:this.state.tbody_height}}>
                      {/* <div className={`max-min-input`}>
                                        <Button onClick={()=>this.countUp("graph_max")}>▲</Button>
                                        <div className={`border mt-1 mb-1 text-center`} style={{fontSize:"0.8rem",width:"2rem"}}>{this.state.graph_max}</div>
                                        <Button onClick={()=>this.countDown("graph_max")}>▼</Button>
                                        <Button onClick={()=>this.countUp("graph_min")}>▲</Button>

                                        <div className={`border mt-1 mb-1 text-center`} style={{fontSize:"0.8rem",width:"2rem"}}>{this.state.graph_min}</div>
                                        <Button onClick={()=>this.countDown("graph_min")}>▼</Button>
                                    </div> */}
                      <div className="chat-image ml-1">
                        <WeightBloodChart
                          showData={this.state.graph_data}
                          height={20}
                          min_y={this.state.graph_min}
                          max_y={this.state.graph_max}
                          year_show={0}
                          graph_date_array={graph_date_array}
                          remHeight = {false}
                          specHeight = {'calc(100vh - 48rem)'}
                          labelFontSize={9}
                        />
                      </div>
                    </div>
                  ):(
                    <div className="table-area p-1 graph-table">
                      <table className="table table-bordered table-hover" id="code-table">
                        <thead>
                        <tr>
                          <th className="gray-title" style={{width:'16%'}}>年月日</th>
                          <th className="gray-title code-number">前体重</th>
                          <th className="gray-title code-number">後体重</th>
                          <th className="gray-title code-number">増加</th>
                          <th className="gray-title code-number">除水量</th>
                          <th className="gray-title pressure">透析前血圧</th>
                          <th className="gray-title pressure" style={{borderRight:"none"}}>透析後血圧</th>
                        </tr>
                        </thead>
                        <tbody style={{height:'calc(100vh - 48.5rem)'}}>
                        {this.state.system_patient_id > 0 && table_data != undefined && table_data != null && Object.keys(table_data).length > 0 && Object.keys(table_data).map((key,index)=>{
                          let item = table_data[key];
                          let before_item = table_data[Object.keys(table_data)[index+1]];
                          return (
                            <tr key={index}>
                              <td className="text-left" style={{letterSpacing:"-1px", widht:'16%'}}>{key}</td>
                              <td className="code-number text-right">{item.weight_before != null && item.weight_before != "" ?parseFloat(item.weight_before).toFixed(1) + "kg": ""}</td>
                              <td className="code-number text-right">{item.weight_after != null && item.weight_after != "" ? parseFloat(item.weight_after).toFixed(1) + "kg": ""}</td>
                              <td className="code-number text-right">
                                {item.weight_before != null && item.weight_before != "" && before_item != undefined && before_item.weight_after != null && before_item.weight_after != "" ? parseFloat(item.weight_before-before_item.weight_after).toFixed(1) + "kg": ""}
                              </td>
                              <td className="code-number text-right">{item.weight_after != null && item.weight_after != "" && item.weight_before != null && item.weight_before != "" ? parseFloat(item.weight_before-item.weight_after).toFixed(1) + "kg": ""}</td>
                              {/* <td className="code-number text-right">{item.ms_cur_drainage != null && item.ms_cur_drainage != "" ? parseFloat(item.ms_cur_drainage).toFixed(1) : ""}</td> */}
                              <td className="pressure text-right">
                                {item.before_pressure_max != undefined ? item.before_pressure_max :"" }
                                {item.before_pressure_min != undefined || item.before_pressure_max != undefined ? "/" :"" }
                                {item.before_pressure_min != undefined ? item.before_pressure_min :"" }
                              </td>
                              <td className="pressure text-right">
                                {item.after_pressure_max != undefined ? item.after_pressure_max :"" }
                                {item.after_pressure_min != undefined || item.after_pressure_max != undefined ? "/" :"" }
                                {item.after_pressure_min != undefined ? item.after_pressure_min :"" }
                              </td>
                            </tr>)
                        })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="flex">
                  <div className="contraind wp-50">
                    <div className="sub-header flex red">
                      <div className="sub-title">合併症</div>
                      <div className="detail" onClick={this.showComplicationList.bind(this)}>検査一覧</div>
                    </div>
                    <div className="sub-body scroll" style={{minHeight:"10.5rem", maxHeight:"10.5rem", border:"1px solid gray"}}>
                      {this.state.system_patient_id > 0 && this.state.complication_list != undefined && this.state.complication_list != null && this.state.complication_list.length > 0 && (
                        this.state.complication_list.map(item => {
                          return(
                            <>
                              <div className ='flex' style={{border:'none'}}>
                                <span style={{color:'red'}}>●</span>
                                <div className='complication-name'>{item.name}</div>
                                <div className='complication-date'>{formatDateSlash(item.examination_date)}</div>
                              </div>
                            </>
                          )
                        })
                      )}
          
                    </div>
                  </div>
                  <div className="manage wp-50">
                    <div className="sub-header flex red">
                      <div className="sub-title">検査</div>
                      <div onClick={this.showInspectGraph} style={{marginLeft:'15px', marginRight:'15px'}}>グラフを表示</div>
                      <div className="detail" onClick={this.showInspect}>検査一覧</div>
                    </div>
                    <div className="scroll" style={{minHeight:"10.5rem", maxHeight:"10.5rem", border:"1px solid gray"}}>
                      {/* {done_inspection != undefined && done_inspection != null && done_inspection.length > 0 && done_inspection.map(item => {
                                        return(
                                            <>
                                            <div>{item.name}</div>
                                            </>
                                        )
                                    })} */}
                      {this.state.system_patient_id > 0 && inspection_pattern != undefined && inspection_pattern != null && inspection_pattern.length > 0 && inspection_pattern.map(item => {
                        var week_days =null;
                        var weekday_str = '';
                        if (item.weekday>0) week_days = getWeekday(item.weekday);
                        if (week_days != null){
                          week_days.map(val => {
                            weekday_str += val;
                          })
                        }
                        return(
                          <>
                            <div>{item.name}({weekday_str})</div>
                          </>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </>
        ):(
          <SpinnerWrapper>
            <Spinner animation="border" variant="secondary" />
          </SpinnerWrapper>
        )}
        
        {this.state.isshowAnti && (
          <EditAntiHardModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            dial_schedule_item = {this.state.schedule_data}
            schedule_date={formatDateLine(this.state.schedule_data.schedule_date)}
            system_patient_id={this.state.patientInfo.system_patient_id}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowDial && (
          <DialScheduleDetailModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            dial_schedule_item = {this.state.schedule_data}
            schedule_date={formatDateLine(this.state.schedule_date) !=''?formatDateLine(this.state.schedule_date):formatDateLine(new Date())}
            system_patient_id={this.state.patientInfo.system_patient_id}
            patientInfo = {this.state.patientInfo}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowDialyser && (
          <EditDialyserModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            dial_schedule_item = {this.state.schedule_data}
            schedule_date={formatDateLine(this.state.schedule_data.schedule_date)}
            system_patient_id={this.state.patientInfo.system_patient_id}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowInject && (
          <EditInjectionModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            // schedule_item = {this.props.done_injection}
            schedule_item = {this.props.injection_pattern}
            patientInfo = {this.state.patientInfo}
            is_temporary = {2}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowInspect && (
          <EditInspectionModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            schedule_date={formatDateLine(this.state.schedule_date)}
            system_patient_id={this.state.patientInfo.system_patient_id}
            patientInfo = {this.state.patientInfo}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowManage && (
          <EditManageMoneyModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            // schedule_item = {this.props.manage_schedule[0]}
            schedule_item = {this.props.manage_pattern}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowDialPres && (
          <EditDailysisPrescriptionSchedulModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            // schedule_item = {this.props.done_dial_pres[0]}
            schedule_item = {this.props.dial_pres_pattern}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowPrescript && (
          <PrescriptionDetailModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            schedule_item = {this.props.done_prescription!= undefined && this.props.done_prescription.length > 0?this.props.done_prescription[0]:undefined}
            patientInfo = {this.state.patientInfo}
            pattern_info = {prescription_pattern}
            schedule_date={formatDateLine(this.state.schedule_date)}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowContrain && (
          <PatientContrainModal
            patientInfo = {this.state.patientInfo}
            closeModal={this.closeModal}
            handleOk={this.handleOk}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowDisease && (
          <MedicalHistoryModal
            patientInfo = {this.state.patientInfo}
            closeModal={this.closeModal}
            handleOk={this.handleOk}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowInsulin && (
          <InsulinManageModal
            patientInfo = {this.state.patientInfo}
            closeModal={this.closeModal}
            handleOk={this.handleOk}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowInfection && (
          <PatientInfectionModal
            patientInfo = {this.state.patientInfo}
            closeModal={this.closeModal}
            handleOk={this.handleOk}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowHeart && (
          <PatientHeartModal
            patientInfo = {this.state.patientInfo}
            closeModal={this.closeHeartModal}
            handleOk={this.handleOk}
            from_source = 'bedside'
          />
        )}
        {this.state.isshowPatient && (
          <PatientMainModal
            patientInfo = {this.state.patientInfo}
            closeModal={this.closeModal}
            system_patient_id={this.state.patientInfo.system_patient_id}
            from_source = 'bedside'
          />
        )}
        {this.state.isDwHistoryModal && (
          <DwHistoryModal
            patientInfo = {this.state.patientInfo}
            schedule_date={formatDateLine(this.state.schedule_date)}
            closeModal={this.closeModal}
            from_source = 'bedside'
          />
        )}
        {this.state.isShowInspectGraph && (
          <InspectGraphModal
            patientInfo = {this.state.patientInfo}
            schedule_date={formatDateLine(this.state.schedule_date)}
            closeModal={this.closeModal}
            from_source = 'bedside'
          />
        )}
        {this.state.isShowWeightBloodGraphModal && (
          <WeightBloodGraphModal
            patientInfo = {this.state.patientInfo}
            schedule_date={formatDateLine(this.state.schedule_date)}
            closeModal={this.closeModal}
            from_source = 'bedside'
          />
        )}
        {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeAlertModal.bind(this)}
              handleOk= {this.closeAlertModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
      </Wrapper>
    )
  }
  
}

PatientInfomation.contextType = Context;

PatientInfomation.propTypes = {
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  schedule_date:PropTypes.string,
  done_prescription : PropTypes.array,
  done_inspection : PropTypes.array,
  done_injection : PropTypes.array,
  done_dial_pres : PropTypes.array,
  manage_schedule : PropTypes.array,
  schedule_data : PropTypes.object,
  refresh : PropTypes.func,
  changePatient : PropTypes.func,
  contrain : PropTypes.array,
  heart : PropTypes.array,
  disease : PropTypes.array,
  infection : PropTypes.array,
  history: PropTypes.object,
  insulin : PropTypes.array,
  change_patient: PropTypes.boolean,
  inspection_pattern: PropTypes.array,
  dial_pres_pattern:PropTypes.array,
  manage_pattern:PropTypes.array,
  injection_pattern:PropTypes.array,
  prescription_pattern:PropTypes.array,
};

export default PatientInfomation