import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {Modal, Row} from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import {formatJapanDate, getNextMonthByJapanFormat, getPrevMonthByJapanFormat, formatDateLine, formatTimeIE, getPrevDayByJapanFormat, getNextDayByJapanFormat} from "~/helpers/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import Button from "../../../atoms/Button";
import InputKartePanel from "./molecules/InputKartePanel";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import EditPrescript from "./molecules/EditPrescript";
import * as apiClient from "~/api/apiClient";
import * as methods from "../DialMethods";
// import EditInspectionModal from "../Schedule/modals/EditInspectionModal";
import EditInspectionSpecialModal from "~/components/templates/Dial/Board/molecules/karteInstruction/EditInspectionSpecialModal"
import MedicalHistoryModal from "./MedicalHistoryModal";
import InsulinManageModal from "./InsulinManageModal";
import {makeList_code, displayLineBreak,validateValue, setDateColorClassName} from "~/helpers/dialConstants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";
import DrKartePrintPreviewModal from "~/components/templates/Dial/Board/molecules/printSheets/DrKartePrintPreviewModal";
import EditRegularInjectionModal from "~/components/templates/Dial/Board/molecules/karteInstruction/EditRegularInjectionModal"
import EditTempInjectionModal from "~/components/templates/Dial/Board/molecules/karteInstruction/EditTempInjectionModal"
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import WeightBloodGraphModal from "./molecules/WeightBloodGraphModal";
import DialShowShemaModal from "~/components/templates/Patient/Modals/Common/DialShowShemaModal";
import DrChangeLogModal from "./DrChangeLogModal";
import DrConsentModal from "./DrConsentModal";
import renderHTML from 'react-render-html';
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import $ from 'jquery';
import * as localApi from "~/helpers/cacheLocal-utils";
import {DatePickerBox} from "../../../styles/DatePickerBox";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  margin-left:1rem;
`;

const SubWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .select_date_range {
    height: 100%;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const Wrapper = styled.div`
    height: calc(100vh - 15rem);
    font-size: 1rem;
    .border-bottom {
        border-bottom: solid 1px #eee;
        margin-left: 0.625rem;
        margin-top: 0.3rem;
    }
    .comment-required{
        color:red;
    }
    .title-td{
        text-align: center;
    }
    .not-complete{
        text-align: right;
        position: relative;
        span{color: white;}
        background: lightcoral;
        .done-span {
            position: absolute;
            left: 0.5rem;
        }
    }
    .complete {
        text-align: left;
        span{color: white;}
        background: #2AB6C1;
    }
    .non-dial {
        text-align: center;
        span{color:rgb(68,68,68);}
        background: lightgray;
    }
    
    .flex {
        display: flex;
        flex-wrap: wrap;
    }
    .console{
        color:blue;
        margin-right:0.3rem;
    }
    .medical-record {
        display: flex;
        height: calc(100% - 1.5rem);
        margin-bottom: 1.5rem;
    }
    .row {
        margin: 0;
    }
    .footer{
        button{
            padding: 0.5rem 0.625rem;
           margin-right:0.625rem!important;
           span{font-size: 1.25rem;}
        }
        .button-1{
            background: rgb(242, 161, 21);
        }
        .button-3{
            background: darkcyan;
        }
    }
    .w-70{
        width:70%;
    }
    .w-30{
        width:30%;
    }
    .history-button{
        width: fit-content;
        margin-right: 0.15rem;
        margin-left: 5px;
        color: blue;
        float: right;
        span {
          cursor:pointer;
          font-weight: normal;
        }
    }
    .next-line-btn{
        width: 100%;
        padding-right: 0.5rem;
        margin-left: 5px;
        color: #666666;
        text-align: right;
        clear:both;
        span{
          cursor:pointer;
          font-weight: normal;
          color: #666666;
        }
    }
    .new_history_btn {
      position: absolute;
      color: blue;
      right: 0.15rem;
      // z-index: 1;
      span{
        cursor: pointer;
        font-weight: normal;
        color: #666666;
      }
    }
    .sub-history-btn{
      position: absolute;
      right: 0.15rem;
      color:#666666;
      top:0;
      // z-index: 1;
      span{
        cursor: pointer;
        font-weight: normal;
        color: #666666;
      }
    }
    .dr-content{
      position:relative;
      float: left;
    }
    .left-end{
      float:left;
    }
    .right-end{
      float:right;
    }
    .td-first-div{
      position:relative;
      min-height:1.5rem;
      clear:both;
    }
 `;
const LeftContent = styled.div`
 width: 65%;
 height: 100%;
 .add-btn-area {
    padding-top: 0.5rem;
    div {
        padding-left: 1rem;
    }
 }
 td{
     word-break:break-all;
 }
 .course-td span {
    color: blue;
    font-weight: bolder;
  }
  .title-td span{
    font-weight: bolder;
  }
 .flex-td{
     display:flex;
     width:100%;
     position: relative;
 }
 .course-td{
     .date-area{
         width: 10rem;
     }
     .doctor-area {
         width: calc(100% - 10rem);
         text-align: right;
     }
 }
 .shema-button {
    padding: 0.2rem 0.3rem;
    span {
      color: white;
    }
 }
 .top-div {
  margin-top: -1.5rem;
 }
 .text-center{
     text-align:center;
 }
 .checkbox-area{
    width: 58%;
    position: absolute;
    right: 0.625rem;
    label{
        margin-right:0.3rem;
    }
 }
  .after {
    margin-left: 4%;
  }
}
.middle-content {
    margin-top: 0.625rem;
}

.use-history {
    margin-top: 0.625rem;
    .VAManager__List-sc-1pyghe7-3 {
        height: 10%;
    }
}
.day-area {
    width: 19rem;
    font-size: 1.25rem;
}
.no-tag {
    width: calc(100% - 30rem);
}
.course{
    padding-top: 0.3rem;
    width: 5.625rem;
    text-align: right;
    cursor: pointer;
    margin-right: 0.625rem;
    svg {
        margin-left: 0;
    }
}
.finding{
    padding-top: 0.3rem;
    width: 5.625rem;
    text-align: left;
    cursor: pointer;
    svg {
        margin-left: 0;
    }
}
  .prev-day {
    cursor: pointer;
    padding-right: 0.625rem;
  }
  .next-day {
    cursor: pointer;
    padding-left: 0.625rem;
  }

 `;
const RightContent = styled.div`
 width: 34%;
 margin-left:1%;
 height: calc(100% - 2rem);
 overflow-y:auto;
 margin-top: 2rem;
 .content-box {
    .flex {
        margin-bottom: -1px;
    }
    .flex div {
        border: 1px solid black;
        text-align: center;
        height: 1.875rem;
        line-height: 1.8rem;
    }
    .right-table{
      margin-bottom: 0;
        td {
            border:1px solid black;
            padding:0 0.4rem;
            line-height: 2.05rem;
        }
    }
    .data-label {
        background-color: #ddd;
        width:6rem;
        font-size:0.8rem
    }
    .right-data-label{
        width:4.3rem;
        background-color: #ddd;
        font-size:0.8rem
    }
 }
 .current_diseases{
    .disease-content{
        height: calc(100% - 2rem - 1px);
        overflow-y: auto;
      .border-line{
        border-bottom:1px solid cadetblue;
        padding-left:0.25rem;
        margin-left: -0.25rem;
      }
    }
    .disease-title {
      font-size: 1.2rem;
      line-height: 2rem;
      background:lightgray;
    }
    .loaded-area-disease{
      width: 100%;
      height: 100%;
    }
}
  .select_date_range{
      display:flex;
      .pullbox{
          margin-right:1.25rem;
      }
      span{
          padding-top:0.6rem;
      }
      label{
        margin-left: 1.5rem;
        font-size: 1rem;
      }
  }
  .pres-area{
    .left-pres-area{
      float: left;
    }
    .right-pres-area {
      float: right;
    }
    .usage-area {
      .left-pres-area{
        margin-left: 1.5rem;
      }
      .right-pres-area{
        margin-right: 3rem;
      }
    }
  }
 `;
const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
    margin-right: 2%;
    float: left;
    height: calc(100% - 2.2rem);
    border: solid 1px darkgray;
    label {
        margin: 0;
    }
  table {
    margin:0;
    height: 100%;
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    thead{
        display: table;
        width: calc(100% - 17px);
    }
    tbody{
      height:calc(100vh - 21.4rem);
      overflow-y:scroll;
      overflow-x:hidden;
      display:block;
    }
    tr {
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        input {
            margin: 0;
        }
        width: 50%;
        p{
            margin-bottom:0px;
        }
    }
    th {
        text-align: center;
        padding: 0.3rem;
    }
  }
  .small-loading{
    position:absolute;
    left:0;
    height:100%;
    .spinner-border{
      width:1.2rem;
      height:1.2rem;
    }
  }
 `;

const ContextMenuUl = styled.ul`
    .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 5rem;
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
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const periodics = ["［臨時処方］", "［定期処方1］", "［定期処方2］", "［定期処方3］"];
const ContextMenu = ({
                       visible,
                       x,
                       y,
                       parent,
                       timeline_number,
                       selected_row_data,
                       selected_date,
                       type,
                     }) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;
  let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {/* {$canDoAction(FEATURES.DIAL_DRKARTE,AUTHS.REGISTER,0) != false && type != null && (
            <li onClick={() =>parent.contextMenuAction(timeline_number, selected_row_data,selected_date,type, "add")}><div>{type==0?'Drカルテ経過記事追加':'Drカルテ指示登録'}</div></li>
          )} */}
          {timeline_number != null && (
            <>
              {$canDoAction(FEATURES.DIAL_DRKARTE,AUTHS.EDIT,0) != false && (
                <li onClick={() =>parent.contextMenuAction(timeline_number, selected_row_data,selected_date, type, "edit")}><div>編集</div></li>
              )}
              {$canDoAction(FEATURES.DIAL_DRKARTE,AUTHS.DELETE,0) != false && (
                <li onClick={() =>parent.contextMenuAction(timeline_number, selected_row_data,selected_date, type,"delete")}><div>削除</div></li>
              )}
            </>
          )}
          {conf_data.instruction_doctor_consent_is_enabled == "ON" && authInfo.staff_category == 1 && (
            <li onClick={() =>parent.contextMenuAction(timeline_number, selected_row_data,selected_date, type,"consent")}><div>未承認確認</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class DRMedicalRecord extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    
    
    let isConfirmComplete = false;
    var complete_message = '';
    this.is_small_loading = true;
    this.state = {
      alert_messages:'',
      alert_title:'',
      kind:'',
      schedule_data:schedule_data!= undefined && schedule_data!=null? schedule_data: {},
      patientInfo,
      search_date: schedule_date != null ? new Date(schedule_date): new Date(),
      karte_list:{},
      isOpenMedicalHistoryModal: false,
      isOpenInsulinManageModal: false,
      isInputKartePanelModal:false,
      show_more: false,
      show_period: false,
      selected_row_data:null,
      
      dial_display:true,
      prescription_display:true,
      injection_display:true,
      inspection_display:true,
      manage_display:true,
      instruction_display:true,
      
      isOpenPrintModal:false,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message:"",
      disease_load: false,
      temporaray_prescription_schedule:null,
      regular_prescription_schedule:null,
      
      isConfirmComplete,
      complete_message,
      isShowWeightBloodGraphModal:false,
      karte_list_temp:{},
      
      isOpenShemaModal: false,
      imgBase64: null,
      image_comment: "",
      
      isOpenChangeLogModal:false,
      isConsentedModal:false,
      selected_history:null,
      system_patient_id: props.patientId
    }
    this.done_prescription = this.extractCompletedPrescStatus(this.props.done_prescription);
    this.monitor_current_disease_line = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").monitor_current_disease_line;
    this.monitor_dr_line = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").monitor_dr_line;
    if (this.monitor_current_disease_line == undefined) this.monitor_current_disease_line = 'OFF';
    if (this.monitor_dr_line == undefined) this.monitor_dr_line = 'OFF';
  }
  
  extractCompletedPrescStatus(value){
    var result = [];
    if (value == undefined || value == null || !(value.length > 0)) return result;
    value.map(item => {
      result.push(item.is_completed);
    })
    return result;
  }
  isEqualArray(prev, after){
    if (prev.length != after.length) return false;
    for(var i = 0; i<prev.length;i++){
      if (prev[i] != after[i]) return false;
    }
    return true;
  }

  componentWillUnmount() {
    this.done_prescription = null;

    var html_obj = document.getElementsByClassName("dr_medical_record_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }
  }
  
  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.isEqualArray(this.done_prescription, this.extractCompletedPrescStatus(nextProps.done_prescription)) === false){
      this.done_prescription = this.extractCompletedPrescStatus(nextProps.done_prescription);
      this.getKarteInfo();
    }
    if (JSON.stringify(this.state.patientInfo) == JSON.stringify(nextProps.patientInfo) && JSON.stringify(this.state.schedule_data) == JSON.stringify(nextProps.schedule_data)) return;
    if (nextProps.patientInfo === undefined || nextProps.patientInfo.system_patient_id === undefined){
      this.setState({
        temporaray_prescription_schedule:null,
        regular_prescription_schedule:null,
        karte_list: null,
        presc_list: null,
        patientInfo: nextProps.patientInfo,
        schedule_data: nextProps.schedule_data,
        start_date:null,
        end_date:null,
        system_patient_id: 0
      });
      this.start_date = null;
      this.end_date = null;
      return;
    }
    this.start_date = null;
    this.end_date = null;
    let search_date = this.state.schedule_date != nextProps.schedule_date ? nextProps.schedule_date:this.state.search_date;    
    this.setState({
      patientInfo: nextProps.patientInfo,
      schedule_data: nextProps.schedule_data,
      schedule_date:nextProps.schedule_date,
      search_date,
      start_date:null,
      end_date:null,
      system_patient_id: nextProps.patientId
    }, ()=>{      
      this.getDrKarteInfo(this.state.system_patient_id, this.state.search_date, this.state.schedule_date)
    });
  }
  
  getDrKarteInfo = async (system_patient_id, search_date, schedule_date) => {
    this.is_small_loading = true;
    let path = "/app/api/v2/dial/board/karte/search_dr_info";
    let post_data = {
      is_enabled:1,
      system_patient_id: system_patient_id,
      date:formatDateLine(search_date),
      patient_id: system_patient_id,
      from_date:this.state.start_date !== undefined && this.state.start_date != null && formatDateLine(this.state.start_date),
      end_date:this.state.end_date !== undefined && this.state.end_date != null && formatDateLine(this.state.end_date),
      schedule_date: formatDateLine(schedule_date),
      is_temporary:1,
    }
    let data = await apiClient._post(path, {params: post_data});
    let karte_list = data.karte_data != null && data.karte_data !== [] ? data.karte_data['karte_list'] : null;
    let regular_prescription_schedule = data.regular_data;
    let temporaray_prescription_schedule = data.temp_pres_data;
    let cur_disease_list = data.disease_data;
    this.is_small_loading = false;
    this.setState({
      karte_list,
      regular_prescription_schedule,
      temporaray_prescription_schedule,
      cur_disease_list,
      disease_load: true
    });    
  }
  

  disableEmptyTr () {
    $('#medical-record-table > tbody > tr').each(function(){      
      var check_unempty_flag = false;
      $('td', this).each(function(){        
        if ($(this).html() !='' ) check_unempty_flag = true;
      })
      if (check_unempty_flag == false) {
        $(this).hide();
      }
    })
  }
  
  getDrKarteStyle = async () => {
    let path = "/app/api/v2/management/config/get_drkarte_style";
    await apiClient.post(path).then(res=>{
      this.setState({drkarte_style: res});
    })
  }
  
  async componentDidMount () {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let dr_karte_cache = localApi.getObject("dr_karte_cache");
    if (dr_karte_cache !== undefined && dr_karte_cache != null && dr_karte_cache.props !== undefined) {
      if (authInfo !== undefined && authInfo != null && authInfo.user_number == dr_karte_cache.user_number) {
        this.props.closeCompleteModal();
        var isConfirmComplete = true;
        var complete_message = '読み込み中';
        this.setState({
          isConfirmComplete,
          complete_message,
          stop_button:true,
        })
      }
    }

    let material_master = sessApi.getObjectValue("dial_common_master","material_master");
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");    
    let doctor_list_by_number = undefined;
    var staff_list_by_number = {};
    var staffs = undefined;
    let facilityInfo = undefined;
    await this.getDoctorList().then(function(data){
      doctor_list_by_number = data;
    });
    await this.getStaffList().then(function(data){
      staffs = data;
      if (data != undefined){
        Object.keys(data).map((key) => {
          staff_list_by_number[data[key].number] = data[key].name;
        });
      }
    })
    await this.getDrKarteStyle();
    await this.getFacility(false).then(function(data){
      facilityInfo = data;
    });
    if (schedule_date == undefined || schedule_date == null || schedule_date == ''){
      if (this.state.schedule_date != undefined && this.state.schedule_date != null && this.state.schedule_date != ''){
        schedule_date = this.state.schedule_date;
        await this.getDrKarteInfo(this.props.patientId, schedule_date, schedule_date);
      }
    } else {
      await this.getDrKarteInfo(this.props.patientId, schedule_date, schedule_date);
    }
    
    this.setState({
      doctor_list_by_number,
      staffs,
      staff_list_by_number,
      facilityInfo,
      examinationCodeData,
      examination_codes:makeList_code(examinationCodeData),
      puncture_needle_a:makeList_code(material_master['穿刺針']),
      puncture_needle_v:makeList_code(material_master['穿刺針']),
      dialysates:makeList_code(material_master['透析液']),
      disinfection_liquid:makeList_code(material_master['消毒薬']),
      fixed_tape:makeList_code(material_master['固定テープ']),
      start_date:null,
      end_date:null,
      schedule_date:this.state.schedule_date != undefined ? this.state.schedule_date: schedule_date,
      search_date:this.state.search_date != undefined && this.state.search_date != null ? this.state.search_date: schedule_date
    });
    let isInputKartePanelModal = false;
    dr_karte_cache = localApi.getObject("dr_karte_cache");
    if (dr_karte_cache !== undefined && dr_karte_cache != null && dr_karte_cache.props !== undefined) {
      if (authInfo !== undefined && authInfo != null && authInfo.user_number == dr_karte_cache.user_number) {
        isInputKartePanelModal = true;
        let kind = dr_karte_cache.props.kind;
        let selected_date = dr_karte_cache.schedule_date !== undefined && dr_karte_cache.schedule_date != null ? dr_karte_cache.schedule_date : new Date();
        this.setState({
          isInputKartePanelModal,
          kind,
          selected_date
        })
      }
    }
    var detail_tbody = document.getElementsByClassName('right-content')[0];
    var temp_pres_area = document.getElementsByClassName('temp-pres-area')[0];
    if (detail_tbody !== undefined) {
      let html_obj = document.getElementsByTagName("html")[0];
      let width = html_obj.offsetWidth;
      if(parseInt(width) < 1367){
        detail_tbody.style['margin-top'] = '2rem';
        temp_pres_area.style['height'] = 'calc(45% - 6rem)';
      } else if(parseInt(width) > 1919){
        detail_tbody.style['margin-top'] = 'calc(2rem + 1px)';
        temp_pres_area.style['height'] = 'calc(45% - 6rem - 1px)';
      }
      $(document).ready(function(){
        $(window).resize(function(){
          let html_obj = document.getElementsByTagName("html")[0];
          let width = html_obj.offsetWidth;
          if(parseInt(width) < 1367){
            detail_tbody.style['margin-top'] = '2rem';
            temp_pres_area.style['height'] = 'calc(45% - 6rem)';
          } else if(parseInt(width) > 1919){
            detail_tbody.style['margin-top'] = 'calc(2rem + 1px)';
            temp_pres_area.style['height'] = 'calc(45% - 6rem - 1px)';
          }
        });
      });
    }
  }

  closeCompleteModal = () => {    
    this.setState({
      isConfirmComplete:false,
      complete_message:'',
      stop_button:false,
    })
  }

  stopLoading = () => {    
    this.closeCompleteModal();
    this.closeModal();
    localApi.remove('dr_karte_cache');
  }
  
  getDoctorList = async() => {
    let doctor_list_by_number = {};
    await apiClient.get("/app/api/v2/secure/dial_doctor/search?order=name_kana&all_doctor=true")
    .then((res) => {
      if (res != undefined){
        Object.keys(res).map((key) => {
          doctor_list_by_number[res[key].number] = res[key].name;
        });
      }      
    });
    return doctor_list_by_number;
  };

  getStaffList = async() => {
    var staffs = undefined;
    await apiClient.post("/app/api/v2/dial/staff/search", {params:{order:"name_kana"}})
      .then((res) => {
        staffs = res;
      });
    return staffs;
  }
  
  openConfirmCompleteModal =(message)=>{
    this.setState({
      isConfirmComplete:true,
      complete_message: message,
    });
  };
  getKarteInfo = async() => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (!validateValue(patientInfo)){
      this.setState({
        karte_list: null,
        presc_list: null,
      });
      return;
    }
    let path = "/app/api/v2/dial/board/Karte/search";
    await apiClient
      ._post(path, {
        params: {
          is_enabled:1,
          system_patient_id: patientInfo.system_patient_id,
          date:formatDateLine(this.state.search_date),
        }
      })
      .then((res) => {
        if(res != null && res !== []) {
          let karte_list = res['karte_list'];
          this.setState({
            karte_list,
          })
        } else {
          this.setState({
            karte_list: null,
          });
        }
      })
      .catch(() => {
        this.setState({
          karte_list: null,
        });
      });
    
  };
  
  checkSO = (category) => {
    if((category =='Drカルテ/経過') || category =="Drカルテ/所見" ) return true;
    else return false;
  }
  
  getDate = value => {
    this.setState({
      search_date: formatDateLine(value),
    }, () => {
      this.getKarteInfo();
    });
  };
  
  openKarteInputPanel = (kind) => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo === undefined || patientInfo == null || Object.keys(patientInfo).length === 0){
      this.setState({alert_messages:'患者様を選択してください。'});
      return;
    }
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_DRKARTE,this.context.AUTHS.REGISTER, 0) === false) {
      this.setState({alert_messages:'登録権限がありません。'});
      return;
    }
    this.setState({
      isInputKartePanelModal:true,
      patientInfo,
      selected_date:this.state.schedule_date,
      // selected_date:formatDateLine(this.state.search_date),
      kind:kind,
      selected_row_data:null,
      selected_timeline_number:0,
    })
  }
  
  closeModal = () => {
    this.setState({
      isEditPrescriptModal:false,
      isTempInspectionMOdal:false,
      isEditInjectionModal:false,
      isOpenMedicalHistoryModal:false,
      isOpenInsulinManageModal:false,
      isInputKartePanelModal:false,
      isOpenPrintModal:false,
      isShowWeightBloodGraphModal:false,
      alert_messages:'',
      alert_title:''
    });
    this.getKarteInfo();
  };
  
  handleTempInspectionOK = (karte_data, instruction_doctor_number) => {
    if (karte_data == undefined || karte_data == null) return;
    this.setState({karte_data});
    this.saveTempInspection(karte_data, instruction_doctor_number);    
  }

  saveTempInspection = async(karte_data, instruction_doctor_number = null) => {
    this.openConfirmCompleteModal('読み込み中');
    let path = "/app/api/v2/dial/board/karte/register";
    let post_data = {
      system_patient_id:this.state.patientInfo.system_patient_id,
      schedule_date: formatDateLine(this.state.schedule_date),
      instruction_doctor_number: instruction_doctor_number,
      karte_data,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then(() => {
        this.getKarteInfo();
        this.props.refreshScheduleInfo(this.state.patientInfo.system_patient_id, this.state.schedule_date);
        this.closeModal();
        this.setState({
          isConfirmComplete:false,
          stop_button:false,
          alert_messages:'変更内容を登録しました',
          alert_title:'登録完了'
        })
      })
  }
  
  handlePrescriptOK = () => {
    this.closeModal();
    this.getKarteInfo();
    this.getPrescriptionInfo();
    this.getTempPrescriptionInfo();
    this.props.refreshScheduleInfo(this.state.patientInfo.system_patient_id, this.state.schedule_date);
  }
  
  handleOk = () => {
    this.closeModal();
    this.getKarteInfo();
    this.props.refreshScheduleInfo(this.state.patientInfo.system_patient_id, this.state.schedule_date);
  }
  
  handleKarteOk = (karte_data=null) => {    
    if (karte_data != null) this.closeModal();
    if (karte_data == null){      
      this.getKarteInfo();
      this.getPrescriptionInfo();
      this.getTempPrescriptionInfo();
      this.props.refreshScheduleInfo(this.state.patientInfo.system_patient_id, this.state.schedule_date);
      this.is_small_loading = false;
      this.setState({karte_list_temp:{}});
    } else {
      this.is_small_loading = true;
      this.registerTempKarte(karte_data);
      if (karte_data['change_dial_flag'] == true){
        var schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
        if (schedule_data.start_date == null && schedule_data.console_start_date == null){
          this.props.changeBeforeStartStatus();
        }
      }
    }
  };
  
  handleTempInjectionOk = (karte_data, instruction_doctor_number) => {
    if (karte_data == undefined || karte_data == null) return;
    this.setState({karte_data});
    this.saveInjection(karte_data, instruction_doctor_number);
  }
  
  handleInjectionOk = (data, instruction_doctor_number = null) => {
    if (data == undefined || data == null) return;
    let karte_data = this.state.karte_data;
    karte_data.injection.after = data;
    this.setState({karte_data});
    this.saveInjection(karte_data, instruction_doctor_number);
  }
  
  saveInjection = async(karte_data, instruction_doctor_number = null) => {
    this.openConfirmCompleteModal('読み込み中');
    let path = "/app/api/v2/dial/board/karte/register";
    let post_data = {
      system_patient_id:this.state.patientInfo.system_patient_id,
      schedule_date: formatDateLine(this.state.schedule_date),
      instruction_doctor_number: instruction_doctor_number,
      karte_data,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then(() => {
        this.getKarteInfo();
        this.props.refreshScheduleInfo(this.state.patientInfo.system_patient_id, this.state.schedule_date);
        this.closeModal();
        this.setState({
          isConfirmComplete:false,
          stop_button:false,
          alert_messages:'変更内容を登録しました',
          alert_title:'登録完了'
        })
      })
  }
  
  printPreview_new = () => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || Object.keys(patientInfo).length === 0 || this.state.facilityInfo == undefined){
      this.setState({alert_messages:'患者様を選択してください。'});
  
      return;
    }
    this.setState({isOpenPrintModal:true});
  };
  
  onButton = async(name) => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || Object.keys(patientInfo).length === 0){
      this.setState({alert_messages:'患者様を選択してください。'});
  
      return;
    }
    if (name=="temp_prescription"){
      this.setState({
        isEditPrescriptModal:true,
        editPrescriptType: 1,
      })
    }
    if (name=="regular_prscription"){
      this.setState({
        isEditPrescriptModal:true,
        editPrescriptType: 0
      })
    }
    if (name=="temp_examination"){
      let path = "/app/api/v2/dial/schedule/inspection_search";
      let post_data = {
        params: {
          schedule_date: formatDateLine(this.state.schedule_date),
          patient_id: this.state.patientInfo.system_patient_id,
          is_temporary: 1,
        },
      };
      var karte_data = {
        temportary_inspection:{
          prev:'',
          after:''
        }
      }
      await apiClient.post(path, post_data).then((res) => {
        karte_data.temportary_inspection.prev = (res != undefined && res != null && res.length>0) ? res : '';
        this.setState({
          isTempInspectionMOdal:true,
          is_temporary:1,
          karte_data,
        })
      })
      
    }
    if (name === "temp_injection"){
      let path = "/app/api/v2/dial/schedule/injection_schedule_search";
      let post_data = {
        is_temporary: 1,
        schedule_date: formatDateLine(this.state.schedule_date),
        patient_id: this.state.patientInfo.system_patient_id,
      };
      karte_data = {
        limit_injection:{
          prev:'',
          after:'',
        },
        temporary_injection:{
          prev:'',
          after:'',
        },
      }
      await apiClient.post(path, {params: post_data}).then((res)=>{
        karte_data.temporary_injection.prev = (res != undefined && res != null && res.length>0) ? res : '';
        this.setState({
          // schedule_item:(res != undefined && res != null && res.length>0) ? res : [],
          karte_data,
          isEditInjectionModal: true,
          is_temporary: 1
        })
      });
    }
    if (name === "regular_injection"){
      this.getRegularInjection();
    }
    if (name=="history"){
      this.setState({
        isOpenMedicalHistoryModal:true,
      })
    }
    if (name=="insulin"){
      this.setState({
        isOpenInsulinManageModal:true,
      })
    }
  };
  
  getRegularInjection = async() => {
    let path = "/app/api/v2/dial/schedule/regular_injection_search";
    let post_data = {
      instruct_date: formatDateLine(this.state.schedule_date),
      patient_id: this.state.patientInfo.system_patient_id,
    };
    var karte_data = {
      injection:{prev:'', after:'', origin:''}
    }
    await apiClient.post(path, {params: post_data}).then((res)=>{
      karte_data.injection.prev = res.length > 0 ? res : '';
      // karte_data.injection.origin = res.origin;
      this.setState({
        karte_data,
        isEditInjectionModal: true,
        is_temporary:0
      });
    });
  }
  
  showMore = () => {
    if (this.state.show_more) this.setState({show_more: false});
    else this.setState({show_more:true});
  };
  
  selectPeriod = () => {
    if (this.state.patientInfo !== undefined && this.state.patientInfo.system_patient_id !== undefined && this.state.patientInfo.system_patient_id != null){
      if (this.start_date !== undefined && this.end_date !== undefined) {
        this.setState({
          show_period:true,
          start_date: this.start_date,
          end_date: this.end_date,
        });
        
      } else {
        this.setState({show_period:true});
      }
    }
  };
  
  closePeriodModal = () => {
    this.setState({
      show_period: false,
      start_date: null,
      end_date: null,
    });
  };
  
  getStartDate = value => {
    this.setState({ start_date: value });
  };
  getEndDate = value => {
    this.setState({ end_date: value });
  };
  
  setPeriod = () => {
    if (this.state.start_date === undefined || this.state.end_date === undefined || this.state.start_date == null || this.state.end_date == null){
      this.setState({alert_messages: "期間を選択してください。"});
      return;
    }
    this.start_date = this.state.start_date;
    this.end_date = this.state.end_date;
    this.setState({show_period: false});
    this.getTempPrescriptionInfo();
  };
  
  handleClick = (e, timeline_number, selected_row_data, selected_date, type) => {
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
        .getElementById("medical-record-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("medical-record-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
          timeline_number:timeline_number,
          selected_row_data,
          selected_date,
          type,
        },
      });
    }
  }
  
  contextMenuAction = (timeline_number,selected_row_data, selected_date,selected_kind, type) => {
    if (type ==="add"){
      this.setState({
        isInputKartePanelModal:true,
        kind:selected_kind===0?'Drカルテ/経過':'Drカルテ/指示',
        selected_row_data:null,
        selected_date,
        selected_timeline_number:0,
      })
    } else if (type === "edit"){
      this.setState({
        selected_timeline_number:timeline_number,
        selected_row_data,
        selected_date,
        isInputKartePanelModal:true,
        kind:selected_kind===0?'Drカルテ/経過':'Drカルテ/指示',
      })
    } else if (type === "delete"){
      this.setState({selected_timeline_number:timeline_number}, () => {
        this.delete();
      })
    } else if (type === "consent") {
      this.setState({isConsentedModal: true});
    }
  };
  
  delete = () => {
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "これを削除して良いですか？",
    });
  }
  
  deleteData = async () => {
    let path = "/app/api/v2/dial/board/karte/delete";
    let post_data = {
      params: {timeline_number:this.state.selected_timeline_number},
    };
    await apiClient.post(path, post_data)
    this.confirmCancel();
    this.getKarteInfo();
    this.props.refreshScheduleInfo(this.state.patientInfo.system_patient_id, this.state.schedule_date);
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  getPrescriptionInfo = async() => {
    if (this.state.patientInfo == undefined || this.state.patientInfo.system_patient_id == undefined) return;
    let path = "/app/api/v2/dial/schedule/regular_prescription_search";
    let post_data = {
      params:{
        patient_id:this.state.patientInfo.system_patient_id,
        from_date:this.state.start_date !== undefined && this.state.start_date != null && formatDateLine(this.state.start_date),
        end_date:this.state.end_date !== undefined && this.state.end_date != null && formatDateLine(this.state.end_date),
        schedule_date: formatDateLine(this.state.schedule_date),
      },
    };
    
    await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({regular_prescription_schedule:res});
      });
  };
  
  getTempPrescriptionInfo = async() => {
    if (this.state.patientInfo == undefined || this.state.patientInfo.system_patient_id == undefined) return;
    let path = "/app/api/v2/dial/schedule/prescription_search";
    let post_data = {
      params:{
        patient_id:this.state.patientInfo.system_patient_id,
        from_date:this.state.start_date !== undefined && this.state.start_date != null && formatDateLine(this.state.start_date),
        end_date:this.state.end_date !== undefined && this.state.end_date != null && formatDateLine(this.state.end_date),
        is_temporary:1
      },
    };
    await apiClient.post(path, post_data)
      .then((res) => {
        var temporaray_prescription_schedule = res.filter(item=>{
          if (item.is_temporary == 1 && item.regular_prescription_number == 0) {
            return item;
          }
        });
        this.setState({
          temporaray_prescription_schedule,
        });
      });
  };
  
  getRadio = (name, value) => {
    switch(name){
      case 'dial':
        this.setState({dial_display:value})
        break;
      case 'prescription':
        this.setState({prescription_display:value})
        break;
      case 'injection':
        this.setState({injection_display:value})
        break;
      case 'inspection':
        this.setState({inspection_display:value})
        break;
      case 'instruction':
        this.setState({instruction_display:value})
        break;
      case 'manage':
        this.setState({manage_display:value})
        break;
    }
  };
  
  registerTempKarte (karte_data) {
    let temp_karte_data = karte_data['kartes'];
    var schedule_date = karte_data['schedule_date'];
    if (temp_karte_data.length > 0){
      var karte_list = {...this.state.karte_list};
      if (karte_list[schedule_date] == undefined) {
        karte_list[schedule_date] ={
          dial: [],
          inject: [],
          inspect: [],
          manage: [],
          presc: [],
        };
      }
      if (karte_list[schedule_date].karte == undefined) karte_list[schedule_date].karte = {};
      karte_list[schedule_date].karte
      var temp_key = 0;
      if (Object.keys(karte_list[schedule_date].karte).length > 0 ){
        
        temp_key = karte_data['timeline_number'];
        
        if (karte_list[schedule_date].karte.hasOwnProperty(temp_key) && karte_list[schedule_date].karte[temp_key] != undefined) {
          karte_list[schedule_date].karte[temp_key] = this.removeCourseInstruct(karte_list[schedule_date].karte[temp_key]);
          karte_list[schedule_date].karte[temp_key] = temp_karte_data.concat(karte_list[schedule_date].karte[temp_key]);
        } else {
          var key_len = Object.keys(karte_list[schedule_date].karte).length;
          temp_key = parseInt(Object.keys(karte_list[schedule_date].karte)[key_len-1]) +1;
          karte_list[schedule_date].karte[temp_key] = temp_karte_data;
        }
      } else {
        karte_list[schedule_date].karte[temp_key] = temp_karte_data;
        
      }
      this.setState({karte_list_temp:karte_list});
    }
  }
  
  removeCourseInstruct(data){
    if (data == undefined || data == null || data.length == 0) return data;
    data = data.filter(x=>(x.category_2!="経過" && x.category_2!="指示"));
    return data;
  }
  
  PrevMonth = () => {
    let now_day = this.state.search_date;
    let cur_day = getPrevMonthByJapanFormat(now_day);
    this.setState({ search_date:formatDateLine(cur_day)}, () => {
      this.getKarteInfo();
    });
  }
  
  nextMonth = () => {
    let now_day = this.state.search_date;
    let cur_day = getNextMonthByJapanFormat(now_day);
    this.setState({ search_date:formatDateLine(cur_day)}, () => {
      this.getKarteInfo();
    });
  }
  
  PrevDay = () => {
    let now_day = this.state.search_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ search_date:formatDateLine(cur_day)}, () => {
      this.getKarteInfo();
    });
  };
  
  NextDay = () => {
    let now_day = this.state.search_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ search_date:formatDateLine(cur_day)}, () => {
      this.getKarteInfo();
    });
  };
  openGraphModal = () => {
    this.setState({isShowWeightBloodGraphModal:true})
  }
  
  openShema = async (item) => {
    if(item == null || item == undefined || item.number < 1) return;
    
    let path = "/app/api/v2/dial/board/Soap/get_image_by_number";
    
    await apiClient
      ._post(path, {
        params: {
          number: item.number,
        },
      })
      .then((res) => {
        if (res) {
          this.setState({
            isOpenShemaModal: true,
            imgBase64: res,
            image_comment: item.image_comment
          });
        }
      })
      .catch(() => {});
  }
  
  closeShemaModal = () => {
    this.setState({
      isOpenShemaModal: false,
      imgBase64: null,
      image_comment: ""
    });
  }
  
  closeLogModal = () => {
    this.setState({isOpenChangeLogModal:false,isConsentedModal:false})
  }
  
  showChangeLogModal = (history, order_karte_type=null) => {
    this.setState({
      isOpenChangeLogModal:true,
      selected_history:history,
      order_karte_type,
    })
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
    if (strVal == undefined || strVal==null || strVal == '') return '';
    // 半角変換
    strVal = this.zenkakuToHankaku(strVal);
    var halfVal = strVal.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    return halfVal;
  }
  
  getKarteDoctor = () => {
    let {karte_list, doctor_list_by_number} = this.state;
    if (karte_list == undefined || karte_list == null) return '';
    var instruction_doctor_number = '';
    if (Object.keys(karte_list).length >0) {
      let sch_date = formatDateLine(this.state.schedule_date);
      if (karte_list[sch_date] == undefined) return '';
      if (karte_list[sch_date]['dial'].length == 0) return '';
      let karte_item = karte_list[sch_date]['karte'];
      if (karte_item == undefined || karte_item == null || Object.keys(karte_item).length == 0) return '';
      // if (karte_item[Object.keys(karte_item)[0]][0] != undefined && karte_item[Object.keys(karte_item)[0]][0].instruction_doctor_number > 0) {
      //   return doctor_list_by_number[karte_item[Object.keys(karte_item)[0]][0].instruction_doctor_number];
      // }
      
      if (karte_item.length != 0){
        Object.keys(karte_item).map(timeline => {
          var detail_karte = karte_item[timeline];
          if (detail_karte.length > 0){
            detail_karte.map(sub => {
              if (sub.category_2 != 'フットケア' && sub.category_2 != '注射実施' && sub.category_2 != '検査実施'){
                if(sub.instruction_doctor_number > 0 && instruction_doctor_number == '') instruction_doctor_number = sub.instruction_doctor_number;
              }
            })
          }
        })
      }
    }
    if (doctor_list_by_number!=undefined && instruction_doctor_number > 0)
      return doctor_list_by_number[instruction_doctor_number];
    else
      return '';
    
  }
  
  prescriptionRender = (pres_array) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 80;
    return (pres_array.map(item=> {
      let lines = parseInt(item.left_str.length / max_length);
      let mods = (item.left_str.length % max_length + item.right_str.length) > max_length;
      let topstyle = lines > 0 && !mods;
      return (
        <div className="" key={item} style={{clear:"both"}}>
          <div className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left"}:{float: "left", marginLeft:"1.5rem"}}>{item.left_str}</div>
          <div className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem"}:{float:"right", marginRight:"2.2rem"}}>{item.right_str}</div>
        </div>
      )
    }))
  }
  
  tempPrescriptionRender = (pres_array, karte_item) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 80;
    return (pres_array.map((item, index)=> {
      let lines = parseInt(item.left_str.length / max_length);
      let mods = (item.left_str.length % max_length + item.right_str.length) > max_length;
      let topstyle = lines > 0 && !mods;
      return (
        <div className="" key={item} style={{clear:"both"}}>
          <div className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left"}:{float: "left", marginLeft:"1.5rem"}}>{item.left_str}</div>
          {index == 0 ? (
            <div style={{float:"right"}}>
              {karte_item.history != null ? (
                <span style={{color:"#666666", cursor:"pointer", marginRight:"0.15rem"}} onClick={this.showChangeLogModal.bind(this,karte_item.history, karte_item.category_2)}>
                  {karte_item.history.split(",").length>9?'':'0'}{karte_item.history.split(",").length}版
                </span>
              ):(
                <span style={{color:"#666666", cursor:"pointer", marginRight:"0.15rem"}} onClick={this.showChangeLogModal.bind(this,karte_item.number, karte_item.category_2)}>初版</span>
              )}
            </div>
          ):(
            <div className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem"}:{float:"right", marginRight:"2.2rem"}}>{item.right_str}</div>
          )}
        </div>
      )
    }))
  }
  IsJsonString = (str) => {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }
  
  checkLineWidth = (str) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 44;
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.dr_karte_1366 !== undefined ? this.state.drkarte_style.dr_karte_1366 : 34;
    } else if(parseInt(width) < 1441){
      max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.dr_karte_1440 !== undefined ? this.state.drkarte_style.dr_karte_1440 : 38;
    } else if(parseInt(width) < 1601){
      max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.dr_karte_1600 !== undefined ? this.state.drkarte_style.dr_karte_1600 : 42;
    } else if(parseInt(width) < 1681){
      max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.dr_karte_1680 !== undefined ? this.state.drkarte_style.dr_karte_1680 : 43;
    } else if(parseInt(width) > 1919){
      max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.dr_karte_1920 !== undefined ? this.state.drkarte_style.dr_karte_1920 : 44;
    }
    let str_spilt = str.split("<div")[0];
    let remove_str = this.strip_html_tags(str_spilt);
    let str_length = this.getStrLength(remove_str);
    if (str_length > max_length)
    return true;
  }
  
  strip_html_tags (str) {
    if ((str===null) || (str==='')){
      return false;
    } else {
      str = str.toString();
    }
    return str.replace(/<[^>]*>/g, '');
  }
  
  getStrLength (str) {
    if (str == "") return 0;
    // let kanaregexp = new RegExp('[\uff00-\uff9f]');
    // let zenkaku_number = ["０","１","２","３","４","５","６","７","８","９"];
    // let nLength = 0;
    // for (let i = 0; i < str.length; i++) {
    //   if(kanaregexp.test(str[i]) != true){
    //     nLength += 2;
    //   } else if(zenkaku_number.includes(str[i])) {
    //     nLength += 2;
    //   } else {
    //     nLength += 1;
    //   }
    // }
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      let code = str.charCodeAt(i);
      if ((code >= 0x0020 && code <= 0x1FFF) || (code >= 0xFF61 && code <= 0xFF9F)) {
        len += 1;
      } else if ((code >= 0x2000 && code <= 0xFF60) || (code >= 0xFFA0)) {
        len += 2;
      } else {
        len += 1;
      }
    }
    return len;
  }
  
  getFirstLineLength = (str) =>{
    if (str === undefined || str == null || typeof str !== "string" || str === "") return false;
    var val = str.replace(/[\n\r]+/g, '\\n').split("\\n");
    let first_str = val[0];
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 44;
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      max_length = 30;
    } else if(parseInt(width) < 1441){
      max_length = 34;
    } else if(parseInt(width) < 1601){
      max_length = 38;
    } else if(parseInt(width) < 1681){
      max_length = 39;
    } else if(parseInt(width) > 1919){
      max_length = 53;
    }
    let str_length = this.getStrLength(first_str);
    if (str_length > max_length)
      return true;
    return false;
  }
  
  render() {
    let {schedule_data, temporaray_prescription_schedule,regular_prescription_schedule, dialysates , karte_list, cur_disease_list, doctor_list_by_number,karte_list_temp} = this.state;
    if (Object.keys(karte_list_temp).length != 0) {
      karte_list = karte_list_temp;
    }
    let syringe_amount,syringe_speed,syringe_stop_time = "";
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo == undefined || Object.keys(patientInfo).length == 0){
      temporaray_prescription_schedule = [];
      regular_prescription_schedule = [];
      karte_list = null;
      // presc_list = null;
      cur_disease_list = [];
    }
    if (schedule_data != undefined && schedule_data.dial_anti != undefined && schedule_data.dial_anti.anti_items != undefined &&
      schedule_data.dial_anti.anti_items != null && schedule_data.dial_anti.anti_items.length > 0){
      schedule_data.dial_anti.anti_items.map(item=>{
        if (item.category === "初回量") {
          syringe_amount = item.amount + item.unit;
        } else if (item.category === "持続量") {
          syringe_speed = item.amount + item.unit;
        } else if (item.category === "事前停止") {
          syringe_stop_time = item.amount + item.unit;
        }
      })
    }
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <Wrapper className="dr_medical_record_wrapper">
        <div className="flex medical-record">
          <LeftContent>
            <Row style={{lineHeight:"2rem"}}>
              <div className="day-area flex">
                <div className="prev-day" onClick={this.PrevMonth.bind(this)}>{'<<'}</div>
                <div className={'prev-day'} onClick={this.PrevDay.bind(this)}>{"<"}</div>
                <DatePicker
                  locale="ja"
                  selected={new Date(this.state.search_date)}
                  onChange={this.getDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  todayButton="本日"
                  dayClassName = {date => setDateColorClassName(date)}
                  customInput={<ExampleCustomInput />}
                />
                <div className={'next-day'} onClick={this.NextDay.bind(this)}>{">"}</div>
                <div className='next-day' onClick={this.nextMonth.bind(this)}>{'>>'}</div>
              </div>
              <div className={'no-tag'}></div>
              <div className="checkbox-area">
                <Checkbox
                  label="経過/指示"
                  getRadio={this.getRadio.bind(this)}
                  value={this.state.instruction_display}
                  checked = {this.state.instruction_display === true}
                  name="instruction"
                />
                <Checkbox
                  label="透析条件"
                  getRadio={this.getRadio.bind(this)}
                  value={this.state.dial_display}
                  checked = {this.state.dial_display === true}
                  name="dial"
                />
                <Checkbox
                  label="処方"
                  getRadio={this.getRadio.bind(this)}
                  value={this.state.prescription_display}
                  checked = {this.state.prescription_display === true}
                  name="prescription"
                />
                <Checkbox
                  label="注射"
                  getRadio={this.getRadio.bind(this)}
                  value={this.state.injection_display}
                  checked = {this.state.injection_display ===true}
                  name="injection"
                />
                <Checkbox
                  label="検査"
                  getRadio={this.getRadio.bind(this)}
                  value={this.state.inspection_display}
                  checked = {this.state.inspection_display ===true}
                  name="inspection"
                />
                <Checkbox
                  label="管理料"
                  getRadio={this.getRadio.bind(this)}
                  value={this.state.manage_display}
                  checked = {this.state.manage_display ===true}
                  name="manage"
                />
              </div>
            </Row>
            <List>
              <table className="table-scroll table table-bordered table-hover" id="medical-record-table">
                <thead>
                <tr onContextMenu={e => this.handleClick(e, null, null, null, null)}>
                  <th className="text-center course-td w-50">
                    <div className="w-100 d-flex" style={{position:'relative'}}>
                      {this.is_small_loading && (
                        <>
                        <div className='small-loading'>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </div>
                        </>
                      )}
                      <div className="w-70 text-center">
                        経 過
                      </div>
                      <div className="w-30 text-right" style={{cursor:'pointer'}} onClick={this.openKarteInputPanel.bind(this, 'Drカルテ/経過')}><Icon icon={faPlus} />記事追加</div>
                    </div>
                  </th>
                  <th className="text-center w-50">
                    <div className="w-100 d-flex">
                      <div className="w-70 text-center"> 指示・処方・処置</div>
                      <div className="w-30 text-right" style={{cursor:'pointer'}} onClick={this.openKarteInputPanel.bind(this, 'Drカルテ/指示')}><Icon icon={faPlus} />記事追加</div>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                {karte_list !==undefined && karte_list !==null && (
                  Object.keys(karte_list).map((key) => {
                    let item =karte_list[key];
                    
                    var doctors = [];
                    if (item.karte.length != 0){
                      Object.keys(item.karte).map(timeline => {
                        var detail_karte = item.karte[timeline];
                        if (detail_karte.length > 0){
                          detail_karte.map(sub => {
                            if (sub.category_2 != 'フットケア' && sub.category_2 != '注射実施')
                            if(sub.instruction_doctor_number > 0 && !doctors.includes(sub.instruction_doctor_number)) doctors.push(sub.instruction_doctor_number);
                          })
                        }
                      })
                    }
                    
                    let non_dial = false;
                    if (item.dial.length==0) {
                      non_dial = true;
                    }
                    let not_complete = false;
                    if (item.dial[0] != null && (item.dial[0].start_date == null && item.dial[0].console_start_date ==null)) not_complete = true;
                    
                    var before_min_blood = 0;
                    var before_max_blood = 0;
                    var after_min_blood = 0;
                    var after_max_blood = 0;
                    if (item.dial.length > 0){
                      item.dial.map(sub_val => {
                        if (sub_val.bp_pressure_max != null){
                          if (sub_val.before_or_after_dialysis == 1) before_max_blood = sub_val.bp_pressure_max;
                          if (sub_val.before_or_after_dialysis == 2) after_max_blood = sub_val.bp_pressure_max;
                        }
                        if (sub_val.bp_pressure_min != null) {
                          if (sub_val.before_or_after_dialysis == 1) before_min_blood = sub_val.bp_pressure_min;
                          if (sub_val.before_or_after_dialysis == 2) after_min_blood = sub_val.bp_pressure_min;
                        }
                      })
                    }
                    
                    return (
                      <>
                        <tr>
                          <td className="flex-td course-td" style={{background:"lightblue"}} onContextMenu={e => this.handleClick(e, null, null, key, 0)}>
                            <div className="date-area">{formatJapanDate(key)}</div>
                            <div className='text-right doctor-area'>{doctor_list_by_number != undefined && doctors.length> 0 ? '('+ this.toHalfWidth(doctor_list_by_number[doctors[0]]) +')':''}</div>
                          </td>
                          <td className={`title-td ${non_dial? 'non-dial':''} ${not_complete ?'not-complete':'complete'} `} onContextMenu={e => this.handleClick(e, null, null, key, 1)}>
                            {item.dial.length==0 && (
                              <><span>非透析日</span></>
                            )}
                            {item.dial.length>0 && (
                              <><span className="done-span">透析実施</span></>
                            )}
                            {item.dial[0] != null && doctor_list_by_number != undefined && (item.dial[0].start_date == null && item.dial[0].console_start_date ==null) &&(
                              <><span>(未実施)</span></>
                            )}
                            
                            {doctor_list_by_number != undefined && item.dial.length > 0 && (item.dial[0].start_date != null || item.dial[0].console_start_date !=null) && (
                              <>
                                {doctors.length > 0 && (
                                  <>
                                    <span>&nbsp;回診&nbsp;&nbsp;</span>
                                  </>
                                )}
                                {item.dial[0] != null && (
                                  <>
                                    <span>
                                      {item.dial[0].start_date != null ? formatTimeIE(item.dial[0].start_date) :
                                        item.dial[0].console_start_date != null? formatTimeIE(item.dial[0].console_start_date) :''}
                                    </span>
                                    <span>&nbsp;{(item.dial[0].start_date != null || item.dial[0].console_start_date != null)? "~" : ""}&nbsp;</span>
                                    <span>&nbsp;
                                      {item.dial[0].end_date != null ? formatTimeIE(item.dial[0].end_date) :
                                        // item.dial[0].console_end_date != null ? formatTimeIE(item.dial[0].console_end_date):
                                        ""}
                                      &nbsp;</span>
                                    <span>&nbsp;透析時間</span>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="title-td course-td">
                            {item.dial.length != 0 && (
                              <div onClick={this.openGraphModal} style={{cursor:"pointer"}}>
                                <span>
                                    体重:{item.dial[0] != null && item.dial[0].weight_before != null && item.dial[0].weight_before > 0? parseFloat(item.dial[0].weight_before).toFixed(1)+ "kg⇒" : "0kg⇒"}
                                  {item.dial[0] != null && item.dial[0].weight_after != null &&item.dial[0].weight_after > 0 ? parseFloat(item.dial[0].weight_after).toFixed(1)+ "kg" : "0kg"}
                                </span>&nbsp;&nbsp;
                                <span>
                                  血圧:{before_max_blood}/{before_min_blood}
                                  {"⇒" + after_max_blood + "/" + after_min_blood}
                                </span>
                              </div>
                            )}
                          </td>
                          <td/>
                        </tr>
                        {item.karte != null && item.karte.length !=0 && item.karte['注射実施'] != undefined && item.karte['注射実施'].length > 0 && this.state.injection_display == 1 && (
                          <tr>
                            <td></td>
                            <td>
                              <div>
                              {item.karte['注射実施'].map(sub_item => {
                                return displayLineBreak(renderHTML(sub_item.body));
                              })}
                              </div>
                            </td>
                          </tr>
                        )}
                        {item.karte != null && item.karte.length !=0 && item.karte['検査実施'] != undefined && item.karte['検査実施'].length > 0 && this.state.inspection_display == 1 && (
                          <tr>
                            <td></td>
                            <td>
                              <div>
                              {item.karte['検査実施'].map(sub_item => {
                                return displayLineBreak(sub_item.body);
                              })}
                              </div>
                            </td>
                          </tr>
                        )}
                        {item.karte != null && item.karte.length !=0 && doctor_list_by_number != undefined && (
                          Object.keys(item.karte).map((sub_key) => {
                          if (sub_key > 0){
                            let show_array = [];                            
                            var empty_whole_body_flag = true;
                            item.karte[sub_key].map(instruciton_item => {
                              if ((instruciton_item.category_2 == '指示'  || instruciton_item.category_2 == '経過') && this.state.instruction_display){
                                if (instruciton_item.body != null && instruciton_item.body != '') empty_whole_body_flag = false;
                                show_array.push(instruciton_item);
                              }
                            });
                            if (empty_whole_body_flag) show_array = [];
                            
                            item.karte[sub_key].map(instruciton_item => {
                              if (instruciton_item.category_2 != '指示' && instruciton_item.category_2 != '経過' ){                                
                                if (instruciton_item.category_2 == '透析条件'){
                                  if (this.state.dial_display) show_array.push(instruciton_item);
                                } else if (instruciton_item.category_2.includes('処方')){
                                  if (this.state.prescription_display) show_array.push(instruciton_item);
                                } else if (instruciton_item.category_2.includes('注射')){
                                  if (this.state.injection_display) show_array.push(instruciton_item);
                                } else if (instruciton_item.category_2.includes('検査')){
                                  if (this.state.inspection_display) show_array.push(instruciton_item);
                                } else {
                                  show_array.push(instruciton_item);
                                }
                              }   
                            });
                            if (show_array.length > 0){
                              this.schema_flag = false;
                              var exist_course_flag = false;
                              return(
                                <>
                                  <tr>
                                    <td className='course-td' onContextMenu={e => this.handleClick(e, sub_key, show_array, key, 0)}>
                                      {show_array.map((sub_karte_item) => {
                                        var check_doctor = doctors.includes(sub_karte_item.instruction_doctor_number);
                                        if (check_doctor == false) doctors.push(sub_karte_item.instruction_doctor_number);
                                        if(this.state.instruction_display && sub_karte_item.category_2 == '経過'){
                                          exist_course_flag = true;
                                          return(
                                            <>
                                              <div className="">
                                              <div className="dr-content">
                                                {sub_karte_item.body != '' && (
                                                  <>
                                                  ［経過{check_doctor?'':':' + doctor_list_by_number[sub_karte_item.instruction_doctor_number]}］
                                                  {renderHTML(sub_karte_item.body)}
                                                  </>
                                                )}
                                              </div>
                                                {this.schema_flag == false && sub_karte_item.image_path != null && sub_karte_item.image_path != "" && (
                                                <>
                                                  {this.schema_flag = true}
                                                  <Button className="shema-button" style={{float:"right"}} onClick={() => this.openShema(sub_karte_item)}>シェーマを見る</Button>
                                                </>
                                                )}
                                              </div>
                                            </>
                                          )
                                        }
                                      })}
                                    </td>
                                    <td onContextMenu={e => this.handleClick(e, sub_key, show_array, key, 1)}>
                                      <div>
                                      {show_array.map((sub_karte_item) => {
                                        var check_doctor = doctors.includes(sub_karte_item.instruction_doctor_number);
                                        if (check_doctor == false) doctors.push(sub_karte_item.instruction_doctor_number);
                                        let history_className = "sub-history-btn";
                                        if (sub_karte_item.category_2 == '透析条件' || (sub_karte_item.category_2.includes('注射') && sub_karte_item.category_2 != '注射実施') || sub_karte_item.category_2 == 'インスリン' ||
                                        (sub_karte_item.category_2.includes('検査') && sub_karte_item.category_2 != '検査実施') ) {
                                          if (this.getFirstLineLength(sub_karte_item.body)) history_className = "next-line-btn";
                                        }
                                        if (sub_karte_item.category_2 == "指示" && this.checkLineWidth(sub_karte_item.body)) history_className = "next-line-btn";
                                        if(sub_karte_item.category_2 != '経過'){
                                          return (
                                            <>
                                              {this.state.instruction_display && sub_karte_item.category_2 == '指示' && (sub_karte_item.body != "" || exist_course_flag == true) ? (
                                                <>
                                                  <div className="td-first-div">
                                                  <div>
                                                    {(sub_karte_item.body != " " && sub_karte_item.body != '') ? "［指示":""}{check_doctor?'':':' + doctor_list_by_number[sub_karte_item.instruction_doctor_number]}
                                                      {sub_karte_item.body != " " && sub_karte_item.body!= '' ? "］":"　"}
                                                    {renderHTML(sub_karte_item.body)}
                                                  </div>
                                                  {this.schema_flag ==false && sub_karte_item.image_path != null && sub_karte_item.image_path != "" && (
                                                    <>
                                                    {this.schema_flag = true}
                                                    <Button className="shema-button" style={{float:"right"}} onClick={() => this.openShema(sub_karte_item)}>シェーマを見る</Button>
                                                    </>
                                                  )}
                                                  {sub_karte_item.history == null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.number, null)}>初版</span></div>
                                                  )}
                                                  {sub_karte_item.history != null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.history, null)}>
                                                    {sub_karte_item.history.split(",").length>9?'':'0'}{sub_karte_item.history.split(",").length}版</span></div>
                                                  )}
                                                  
                                                  </div>
                                                </>
                                              ):(<></>)
                                              }
                                              
                                              {/* {sub_karte_item.category_2 == '装置操作履歴' && (
                                                <div>
                                                  {displayLineBreak(sub_karte_item.body)}
                                                </div>
                                              )} */}
                                              {sub_karte_item.category_2 == 'フットケア' && (
                                                <div>
                                                  {displayLineBreak(sub_karte_item.body)}
                                                </div>
                                              )}
                                              {this.state.dial_display && sub_karte_item.category_2 == '透析条件' && sub_karte_item.body != '' ? (
                                                <>
                                                <div className='td-first-div'>
                                                  {sub_karte_item.category_2 !== '指示' && check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                    <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                  )}
                                                  <div>{displayLineBreak(sub_karte_item.body)}</div>
                                                  {sub_karte_item.history == null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.number, sub_karte_item.category_2)}>初版</span></div>
                                                  )}
                                                  {sub_karte_item.history != null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.history, sub_karte_item.category_2)}>
                                                    {sub_karte_item.history.split(",").length>9?'':'0'}{sub_karte_item.history.split(",").length}版</span></div>
                                                  )}
                                                  </div>
                                                </>
                                              ):(<></>)
                                              }
                                              {this.state.prescription_display && sub_karte_item.category_2.includes('処方') && sub_karte_item.body != '' ? (
                                                <>
                                                  {check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                    <div style={{clear:'both'}}>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                  )}
                                                  {this.IsJsonString(sub_karte_item.body) ? (
                                                    <div className='td-first-div'>
                                                      <div>{this.tempPrescriptionRender(JSON.parse(sub_karte_item.body), sub_karte_item)}</div>
                                                      <div style={{clear:"both"}}></div>
                                                    </div>
                                                  ):(
                                                    <div style={{clear:'both'}}>{displayLineBreak(sub_karte_item.body)}</div>
                                                  )}
                                                </>
                                              ):(<></>)
                                              }
                                              {this.state.injection_display && sub_karte_item.category_2.includes('注射') && sub_karte_item.category_2 != '注射実施' && sub_karte_item.body != '' ? (
                                                <>
                                                <div className='td-first-div'>
                                                  {check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                    <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                  )}
                                                  <div>{displayLineBreak(renderHTML(sub_karte_item.body))}</div>
                                                  {sub_karte_item.history == null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.number, sub_karte_item.category_2)}>初版</span></div>
                                                  )}
                                                  {sub_karte_item.history != null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.history, sub_karte_item.category_2)}>
                                                    {sub_karte_item.history.split(",").length>9?'':'0'}{sub_karte_item.history.split(",").length}版</span></div>
                                                  )}
                                                </div>
                                                </>
                                              ):(<></>)
                                              }
                                              {this.state.inspection_display && sub_karte_item.category_2.includes('検査') && sub_karte_item.category_2 != '検査実施' && sub_karte_item.body != '' ? (
                                                <>
                                                <div className='td-first-div'>
                                                  {check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                    <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                  )}
                                                  <div>{displayLineBreak(sub_karte_item.body)}</div>                                                  
                                                  {sub_karte_item.history == null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.number, '臨時検査')}>初版</span></div>
                                                  )}
                                                  {sub_karte_item.history != null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.history, '臨時検査')}>
                                                    {sub_karte_item.history.split(",").length>9?'':'0'}{sub_karte_item.history.split(",").length}版</span></div>
                                                  )}
                                                </div>
                                                </>
                                              ):(<></>)
                                              }
                                              {sub_karte_item.category_2 == 'インスリン' && sub_karte_item.body != '' && (
                                                <>
                                                <div className='td-first-div'>
                                                  {check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                    <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                  )}
                                                  <div>{displayLineBreak(sub_karte_item.body)}</div>
                                                  {sub_karte_item.history == null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.number, 'インスリン')}>初版</span></div>
                                                  )}
                                                  {sub_karte_item.history != null && (
                                                    <div className={history_className}><span onClick={this.showChangeLogModal.bind(this,sub_karte_item.history, 'インスリン')}>
                                                    {sub_karte_item.history.split(",").length>9?'':'0'}{sub_karte_item.history.split(",").length}版</span></div>
                                                  )}
                                                </div>
                                                </>
                                              )}
                                            </>
                                          )
                                        }
                                      })}
                                      </div>                                      
                                    </td>
                                  </tr>
                                </>
                              )
                            }

                          }
                          })
                        )}
                        
                        {this.state.manage_display && item.manage != null && item.manage.length > 0 ? (
                          item.manage.map(manage_item => {
                            return(
                              <>
                                <tr>
                                  <td className='course-td'/>
                                  <td style = {{background:'antiquewhite', textAlign:'left'}} className = {manage_item.is_comment_requiered ==1 && manage_item.comment == null?"comment-required":""}>
                                    <div>［管理料 指導料など］</div>
                                    <div>{manage_item.name}</div>
                                  </td>
                                </tr>
                              </>
                            )
                          })
                        ):(<></>)}
                        {item.inspection_display && item.inspect != null && item.inspect.length >0 && this.state.examination_codes !== undefined && (
                          item.inspect.map((pres_item)=>{
                            return (
                              <>
                                <tr>
                                  <td className='course-td'/>
                                  <td >
                                    {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "［定期検査］" :"［臨時検査］"}
                                  </td>
                                </tr>
                                <tr>
                                  {pres_item.examination_code != null && (
                                    <>
                                      <td className='course-td'/>
                                      <td>
                                        {pres_item.is_completed==1?"済) ":"未) "}{pres_item.examination_code != null && this.state.examination_codes[pres_item.examination_code]}
                                      </td>
                                    </>
                                  )}
                                
                                </tr>
                              </>
                            )
                          })
                        )}
                        {item.injection_display && item.inject != null && item.inject.length >0 && (
                          item.inject.map((pres_item)=>{
                            return (
                              <>
                                <tr>
                                  <td className='course-td'/>
                                  <td >
                                    {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "［定期注射］" :"［臨時注射］"}
                                  </td>
                                </tr>
                                {/*is_completed*/}
                                {pres_item.data_json!== null && pres_item.data_json.length>0 && (
                                  pres_item.data_json.map(medicine=>{
                                    if (medicine.item_name != undefined && medicine.item_name != ''){
                                      return(
                                        <>
                                          <tr >
                                            <td className='course-td'/>
                                            <td>{pres_item.is_completed==1?"済) ":"未) "}{medicine.item_name}</td>
                                          </tr>
                                        </>
                                      )
                                    }
                                  })
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    )
                  })
                )}
                </tbody>
              </table>
            </List>
          </LeftContent>
          <RightContent className="right-content">
            <div className="content-box" onClick={this.showMore.bind(this)} style={{cursor:"pointer"}}>
              <table className='right-table table-scroll table table-bordered table-hover'>
                <tr>
                  <td className="data-label">回診医師</td>
                  <td colSpan={3}>
                    {this.getKarteDoctor()}
                  </td>
                </tr>
                <tr>
                  <td className="data-label">DW</td>
                  <td>{schedule_data !== undefined && schedule_data.dial_pattern !==undefined && schedule_data.dial_pattern.dw != "" ?parseFloat(schedule_data.dial_pattern.dw).toFixed(1)+"㎏":""}</td>
                  <td className="right-data-label">治療法</td>
                  <td>
                    {schedule_data !== undefined && schedule_data.method_data !== undefined &&
                    schedule_data.dial_pattern !== undefined ?
                      schedule_data.method_data[schedule_data.dial_pattern.dial_method] : ""}
                  </td>
                </tr>
                {this.state.show_more && (
                  <>
                    <tr>
                      <td className="data-label">血流量</td>
                      <td>{schedule_data !== undefined && schedule_data.dial_pattern !==undefined && schedule_data.dial_pattern.blood_flow != null && schedule_data.dial_pattern.blood_flow !== "" ?
                        schedule_data.dial_pattern.blood_flow+"mL/min":""}</td>
                      <td className="right-data-label">透析液</td>
                      <td>{schedule_data !== undefined && schedule_data.dial_pattern !== undefined && dialysates !== undefined && dialysates != null && schedule_data.dial_pattern.dial_liquid !== undefined &&
                      schedule_data.dial_pattern.dial_liquid != null && dialysates[schedule_data.dial_pattern.dial_liquid] != null ? dialysates[schedule_data.dial_pattern.dial_liquid] : ""}</td>
                    </tr>
                    <tr>
                      <td className="data-label">ダイアライザ</td>
                      <td colSpan={3}>{schedule_data !== undefined && schedule_data.dial_dialyzer !== undefined && schedule_data.dial_dialyzer !== null &&
                      schedule_data.dial_dialyzer[0] !== undefined && schedule_data.dial_dialyzer[0] !== null ?
                        schedule_data.dial_dialyzer[0].name: " "}
                      </td>
                    </tr>
                    <tr>
                      <td className="data-label">抗凝固剤</td>
                      <td colSpan={3}>{schedule_data !== undefined && schedule_data.dial_anti !== undefined && schedule_data.dial_anti !== null?schedule_data.dial_anti.title : ""}</td>
                    </tr>
                    <tr>
                      <td className="data-label">初回投与量</td>
                      <td>{syringe_amount !== undefined && syringe_amount !== "" ? syringe_amount : ""}</td>
                      <td className="right-data-label">持続量</td>
                      <td>{syringe_speed !== undefined && syringe_speed !== "" ? syringe_speed : ""}</td>
                    </tr>
                    <tr>
                      <td className="data-label">事前停止</td>
                      <td>{syringe_stop_time !== undefined && syringe_stop_time !== "" ? syringe_stop_time : ""}</td>
                      <td className="right-data-label"></td>
                      <td></td>
                    </tr>
                  </>
                )}
              </table>
            </div>
            <div className="current_diseases mt-2" style={{height: "20%"}}>
              <div className="text-center w-25 border-left border-right border-top border-dark disease-title">現  症</div>
              <div className="disease-content pl-1 pt-1 border border-dark">
                {cur_disease_list !== undefined && cur_disease_list.length >0 ? cur_disease_list.map (item=>{
                  return (
                    <div key={item} className={this.monitor_current_disease_line == 'ON'?'border-line':''}>{displayLineBreak(item.body)}</div>
                  )}
                ):(
                  <>
                    {cur_disease_list !== undefined && cur_disease_list.length == 0 ? (<></>) : (
                      <>
                        <div className={'loaded-area-disease'}>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="current_diseases mt-2" style={{height:"35%"}}>
              <div className="text-center w-25 border-left border-right border-top border-dark disease-title">定期処方</div>
              <div className="disease-content pl-1 pt-1 border border-dark pres-area">
                {regular_prescription_schedule !== undefined && regular_prescription_schedule != null && Object.keys(regular_prescription_schedule).length >0 ? (
                  Object.keys(regular_prescription_schedule).map((idx)=>{
                    var pres_item = regular_prescription_schedule[idx];
                    return (
                      <>
                        {pres_item != null && pres_item.is_temporary !== 1 && pres_item.data_json.length > 0 && pres_item.regular_prescription_number != 0 && (
                          <>
                            <div style={{clear:"both"}}>
                              {pres_item.regular_prescription_number != null && periodics[pres_item.regular_prescription_number]}
                              {pres_item.time_limit_from !== undefined && pres_item.time_limit_from != null ? (pres_item.time_limit_from + " ~") : ""}
                            </div>
                            {pres_item.data_json.map((rp_item, rp_key)=>{
                              return (
                                <div key={rp_item} className="pres-area pr-1">
                                  {rp_item.medicines.length > 0 && rp_item.medicines.map((medi_item, medi_key)=>{
                                    return (
                                      <div style={{clear:"both"}} key={medi_key}>
                                        <div className="left-pres-area" style={medi_key != 0 ? {marginLeft: "1.5rem"}:{marginLeft: 0}}>{medi_key == 0 ? (parseInt(rp_key + 1) + "）"):""}{medi_item.item_name} {medi_item.is_not_generic == 1 ? "［後発変更不可］": ""}</div>
                                        <div className="right-pres-area">{medi_item.amount} {medi_item.unit}</div>
                                      </div>
                                    )
                                  })}
                                  <div style={{clear:"both"}} className="usage-area">
                                    <div className="left-pres-area">{rp_item.usage_name !== undefined ? " " +rp_item.usage_name : " "}</div>
                                    <div className="right-pres-area">{rp_item.days !== undefined && rp_item.days !== null && rp_item.disable_days_dosing == 0? "("+rp_item.days+(rp_item.prescription_category == "頓服"? "回分)" : "日分)") : ""}</div>
                                  </div>
                                </div>
                              )
                            })}
                            <div style={{clear:"both"}} className={this.monitor_dr_line == 'ON'?'border-line':''}></div>
                          </>
                        )}
                      </>
                    )
                  })
                ): (
                  <>
                    {regular_prescription_schedule != null && regular_prescription_schedule.length == 0 ? (<></>):(
                      <div className={'loaded-area-disease'}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="current_diseases mt-2 temp-pres-area" style={{height:"calc(45% - 6rem)"}}>
              <div className={'d-flex  disease-title'} style={{background:'none'}}>
                <div className="text-center w-25 border-left border-right border-top border-dark" style={{background:'lightgray'}}>臨時処方</div>
                <div className="text-center w-25 border-right border-top border-dark" style={{cursor:"pointer", background:'lightgray'}} onClick={this.selectPeriod.bind(this)}>期間選択</div>
              </div>
              <div className="disease-content pl-1 pt-1 pr-1 border border-dark pres-area">
                {temporaray_prescription_schedule !== undefined && temporaray_prescription_schedule != null ? (
                  <>
                    {temporaray_prescription_schedule.map(pres_item=>{
                      return (
                        <>
                          {pres_item.is_temporary === 1 && pres_item.data_json.length > 0 && (
                            <>
                              <div style={{clear:"both"}}>［臨時処方］{pres_item.schedule_date !== undefined && pres_item.schedule_date != null ? pres_item.schedule_date : ""}</div>
                              {pres_item.data_json.map((rp_item, rp_key)=>{
                                return (
                                  <div key={rp_item} className="pres-area">
                                    {rp_item.medicines.length > 0 && rp_item.medicines.map((medi_item, medi_key)=>{
                                      return (
                                        <div style={{clear:"both"}} key={medi_key}>
                                          <div className="left-pres-area" style={medi_key != 0 ? {marginLeft: "1.5rem"}:{marginLeft: 0}}>{medi_key == 0 ? (parseInt(rp_key + 1) + "）"):""}{medi_item.item_name} {medi_item.is_not_generic == 1 ? "［後発変更不可］": ""}</div>
                                          <div className="right-pres-area">{medi_item.amount} {medi_item.unit}</div>
                                        </div>
                                      )
                                    })}
                                    <div style={{clear:"both"}} className="usage-area">
                                      <div className="left-pres-area">{rp_item.usage_name !== undefined ? " " +rp_item.usage_name : " "}</div>
                                      <div className="right-pres-area">{rp_item.days !== undefined && rp_item.days !== null && rp_item.disable_days_dosing == 0? "("+rp_item.days+(rp_item.prescription_category == "頓服"? "回分)" : "日分)") : ""}</div>
                                    </div>
                                  </div>
                                )
                              })}
                              <div style={{clear:"both"}} className={this.monitor_dr_line == 'ON'?'border-line':''}></div>
                            </>
                          )}
                        </>
                      )
                    })}
                  </>
                ):(
                  <>
                  {temporaray_prescription_schedule == null && temporaray_prescription_schedule == [] ? (<></>):(
                    <div className={'loaded-area-disease'}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  )}
                  </>
                )}
              </div>
            </div>
          </RightContent>
        </div>
        <div className="footer">
          <Button type="mono" className ="button-1" onClick={this.onButton.bind(this,"temp_prescription")}>臨時処方</Button>
          <Button type="mono" className ="button-1" onClick={this.onButton.bind(this,"temp_injection")}>臨時注射</Button>
          <Button type="mono" className ="button-1" onClick={this.onButton.bind(this,"temp_examination")}>臨時検査</Button>
          <Button type="mono" onClick={this.onButton.bind(this,"regular_prscription")}>定期処方</Button>
          <Button type="mono" onClick={this.onButton.bind(this,"regular_injection")}>定期注射</Button>
          <Button type="mono" onClick={this.openKarteInputPanel.bind(this,"Drカルテ/指示")}>指示</Button>
          <Button type="mono" className ="button-3" onClick={this.onButton.bind(this,"history")}>病歴</Button>
          <Button type="mono" className ="button-3" onClick={this.onButton.bind(this,"insulin")}>インスリン</Button>
          <Button type="mono" className ="button-3" onClick={this.printPreview_new.bind(this)}>帳票プレビュー</Button>
        </div>
        {this.state.isInputKartePanelModal && (
          <InputKartePanel
            handleOk={this.handleKarteOk}
            closeModal={this.closeModal}
            kind={this.state.kind}
            patient_id = {this.state.patientInfo.system_patient_id}
            patientInfo = {this.state.patientInfo}
            schedule_date = {this.state.selected_date}
            modal_data = {this.state.selected_row_data}
            timeline_number = {this.state.selected_timeline_number}
            history = {this.props.history}
            closeCompleteModal = {this.closeCompleteModal}
          />
        )}
        {this.state.isOpenPrintModal && (
          <DrKartePrintPreviewModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            patient_id = {this.state.patientInfo.system_patient_id}
            schedule_date = {this.state.schedule_date}
            search_date = {this.state.search_date}
            karte_list={this.state.karte_list}
          />
        )}
        {this.state.isEditPrescriptModal && (
          <EditPrescript
            handleOk={this.handlePrescriptOK}
            closeModal={this.closeModal}
            schedule_date={formatDateLine(this.state.schedule_date)}
            patientInfo={this.state.patientInfo}
            editPrescriptType={this.state.editPrescriptType}
            from_source={"dr_karte"}
          />
        )}
        {this.state.isTempInspectionMOdal && (
          <EditInspectionSpecialModal
            handleOk={this.handleTempInspectionOK}
            closeModal={this.closeModal}
            schedule_date={formatDateLine(this.state.schedule_date)}
            patientInfo={this.state.patientInfo}
            system_patient_id = {this.state.patientInfo.system_patient_id}
            temporary = {1}
            karte_data = {this.state.karte_data}
            staff_list_by_number = {this.state.staff_list_by_number}
            staffs = {this.state.staffs}
          />
        )}
        {this.state.isEditInjectionModal && this.state.is_temporary == 1 && (
          <EditTempInjectionModal
            karte_data = {this.state.karte_data}
            handleTempInjectionOk={this.handleTempInjectionOk}
            closeModal={this.closeModal}
            is_temporary = {this.state.is_temporary}
            schedule_date = {this.state.schedule_date}
            patientInfo = {this.state.patientInfo}
          />
        )}
        {this.state.isEditInjectionModal && this.state.is_temporary == 0 && (
          <EditRegularInjectionModal
            injection = {this.state.karte_data.injection}
            handleInjectionOk={this.handleInjectionOk}
            closeModal={this.closeModal}
            is_temporary = {this.state.is_temporary}
            schedule_date = {this.state.schedule_date}
            patientInfo = {this.state.patientInfo}
          />
        )}
        {this.state.isOpenMedicalHistoryModal && (
          <MedicalHistoryModal
            patientInfo = {this.state.patientInfo}
            closeModal={this.handleOk}
          />
        )}
        {this.state.isOpenInsulinManageModal && (
          <InsulinManageModal
            patientInfo = {this.state.patientInfo}
            handleOk = {this.handleOk}
            closeModal={this.closeModal}
            from_source={'dr_karte'}
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deleteData.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isShowWeightBloodGraphModal && (
          <WeightBloodGraphModal
            patientInfo = {this.state.patientInfo}
            schedule_date={formatDateLine(this.state.schedule_date)}
            closeModal={this.closeModal}
          />
        )}
        {this.state.isOpenShemaModal === true && (
          <DialShowShemaModal
            closeModal={this.closeShemaModal}
            imgBase64={this.state.imgBase64}
            image_comment={this.state.image_comment}
          />
        )}
        {this.state.isOpenChangeLogModal && (
          <DrChangeLogModal
            closeModal = {this.closeLogModal}
            history_numbers = {this.state.selected_history}
            order_karte_type = {this.state.order_karte_type}
          />
        )}
        {this.state.isConsentedModal && (
          <DrConsentModal
            closeModal = {this.closeLogModal}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title = {this.state.alert_title}
          />
        )}
        {this.state.isConfirmComplete !== false && (
          <CompleteStatusModal
            message = {this.state.complete_message}
            stop_button = {this.state.stop_button}
            stopLoading = {this.stopLoading.bind(this)}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
        />
        {this.state.show_period && (
          <Modal show={true} onHide={this.closePeriodModal} id="add_contact_dlg"  className="master-modal confirm-complete-modal period-modal">
            <Modal.Header>
              <Modal.Title>臨時処方期間選択</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SubWrapper>
              <DatePickerBox style={{width:"100%", height:"100%"}}>
              <div className = "select_date_range text-center" style={{fontSize:20}}>
                <DatePicker
                  locale="ja"
                  selected={this.state.start_date}
                  onChange={this.getStartDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                />
                <span>～</span>
                <DatePicker
                  locale="ja"
                  selected={this.state.end_date}
                  onChange={this.getEndDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                />
              </div>
              </DatePickerBox>
              </SubWrapper>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closePeriodModal} className="ml-2 cancel-btn">キャンセル</Button>
              <Button className="red-btn" onClick={this.setPeriod}>確 定</Button>
            </Modal.Footer>
          </Modal>
        )}
      </Wrapper>
    )
  }
}

DRMedicalRecord.contextType = Context;

DRMedicalRecord.propTypes = {
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  schedule_date: PropTypes.string,
  schedule_data: PropTypes.object,
  refreshScheduleInfo: PropTypes.func,
  done_prescription  : PropTypes.array,
  changeBeforeStartStatus: PropTypes.func,
  history:PropTypes.object,
  closeCompleteModal:PropTypes.func  
};

export default DRMedicalRecord