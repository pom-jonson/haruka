import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {
  formatDateLine, formatJapanDateSlash, formatTimeSecondIE, getNextDayByJapanFormat, getPrevDayByJapanFormat,
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import SearchBar from "~/components/molecules/SearchBar";
import Button from "~/components/atoms/Button";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import LargeUserIcon from "~/components/atoms/LargeUserIcon";
import {CACHE_LOCALNAMES, KARTEMODE, KEY_CODES, CACHE_SESSIONNAMES, getAutoReloadInfo} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Checkbox from "~/components/molecules/Checkbox";
import SelectVisitDiagnosisTypeModal from "~/components/templates/Patient/SelectVisitDiagnosisTypeModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import Radiobox from "~/components/molecules/Radiobox";
import * as sessApi from "~/helpers/cacheSession-utils";
import $ from "jquery";
import VisitTreatmentGroupModal from "~/components/templates/Patient/Modals/Visit/VisitTreatmentGroupModal";
import VisitTreatmentPatientModal from "~/components/templates/Patient/Modals/Visit/VisitTreatmentPatientModal";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import auth from "~/api/auth";
import {setDateColorClassName} from '~/helpers/dialConstants';
import KarteSealPrint from "~/components/templates/Patient/SOAP/components/KarteSealPrint";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {
    display: flex;
  }  
  .MyCheck{
    margin-bottom: 0.5rem;
    label{
      font-size: 1rem;
      margin-right: 0.5rem;
      margin-bottom:0;
    }
  }
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
    button {
      background-color: ${colors.surface};
      min-width: auto;
      margin-left: 0.5rem;
      padding: 0.5rem 0.5rem;
    }
    .button{
      span{
        word-break: keep-all;
      }
    }
    .tab-btn{
      background: rgb(208, 208, 208);
      span{
        font-weight: normal;
        color: black;
        font-size: 0.9rem;
      }
    }
    .active-btn{
      background: lightblue;
    }
    .disabled{
      background: rgb(208, 208, 208);
      span{
        font-weight: normal;
        color: grey !important;
        font-size: 0.9rem;
      }
    }
    .move-btn-area {
      margin-right:0;
      margin-left:auto;
      padding-top:0.5rem;
      .close-back-btn {
        margin-left: 0.5rem !important;
      }
    }
  }
  .title {
    font-size: 1.875rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .schedule-area {
    width: 100%;
    padding-left: 0.5rem;
    table {
      background-color: white;
      margin:0px;
      font-size: 1rem;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 23.5rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        tr{width: calc(100% - 17px);}
        border-bottom: 1px solid #dee2e6;
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
        font-size: 1rem;
        vertical-align: top;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
      }
      th {
        font-size: 1.25rem;
        text-align: center;
        padding: 0.3rem;
        border-bottom: none;
        border-top: none;
        font-weight: normal;
      }
    }
    .go-karte {
        cursor: pointer;
    }
    .go-karte:hover{
        background:lightblue!important;      
    }
    .user-icon {
      padding: 0 !important;
      svg {
        width: 3rem;
        height: 1.5rem;
        margin-top: 0.25rem;
      }
    }
    .no-result {
      padding: 200px;
      text-align: center;
      .border {
        width: 360px;
        margin: auto;
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
    .selected {
      background: rgb(105, 200, 225) !important;
      color: white;
    }
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  align-items: center;
  padding: 10px 0px 10px 10px;
  width: 100%;
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    text-align: right;
    width: auto;
    margin: 0;
    font-size: 1rem;
    line-height: 2rem;
    margin-right: 0.5rem;
  }
  label {
    margin: 0;
    font-size:1rem;
  }
  button {
    background-color: ${colors.surface};
    min-width: auto;
    height:2.4rem;
    padding:0;
    padding-left:1rem;
    padding-right:1rem;
    span{
      font-size:1rem;
    }
  }
  .react-datepicker__navigation{
    background:none;
  }
  .react-datepicker{
    button{
      height:0;
      margin-left:0;
      padding:0;
    }
  }
  .select-group, .select-place {
    margin-right: 0.5rem;
    width: calc(100% - 26rem);
    .label-title {
      width: 5rem;
    }
    .pullbox-label {
        width: calc(100% - 5.5rem);
        margin: 0;
    }
    .pullbox-select{
      height:2rem;
      line-height:2rem;
      font-size:1rem;
      width:100%;
    }  
  }
  button {
    background-color: rgb(255, 255, 255);
    min-width: auto;
    padding: 0 1rem;
  }
  .block-area {
    border: 1px solid #aaa;
    margin-right: 0.5rem;
    padding: 0.5rem;
    position: relative;
    label {
      font-size: 1rem;
      width: auto;
      margin-left: 0.4rem;
      line-height: 2rem;
    }
    .check-state {
      margin-top: 0.5rem;
        button {
            margin: 0;
            padding: 0;
            height: 2rem;
            width: 4rem;
        }
    }
  }
  
  .from-to {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    line-height: 2rem;
  }
  .prev-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 2rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    height: 2rem;
  }
  .next-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 2rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    height: 2rem;
  }
  .select-today {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 2rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    height: 2rem;
  }
  .react-datepicker-wrapper {
    input {
        width: 110px;
        height: 2rem;
        font-size: 1rem;
    }
  }
  .date-area {
    width: 100%;
    .MyCheck {
      width: 100%;
        label {
            line-height: 2rem;
            font-size: 1rem;
        }
        .react-datepicker-wrapper input{
          width:6rem;
        }
        .search-date-area{
          width:20rem;
        }
    }
  }
  .red-btn {
    background: #cc0000;
    border:2px solid #cc0000;
    span {
      color: #ffffff;
    }
  }
  .red-btn:hover {
    background: #e81123;
    span {
      color: #ffffff;
    }
  }
  .disable-btn {
    background: #d3d3d3;
    span {
      color: #595959;
    }
  }
  .disable-btn:hover {
    background: #d3d3d3;
    span {
      color: #595959;
    }
  }
  .auto-reload {
    text-align: right;
    label {height:2rem;}
  }
`;

const FlexTop = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 10px;
  width: 100%;
  z-index: 100;  
  .bvbKeA{
    display:block;
    width: 20%;
    .search-box{
        width:  100%;
        input {width: 100%;}
    }
  }
  button {
    background-color: ${colors.surface};
    min-width: auto;
    margin-left: 9px;
    padding: 8px 12px;
  }
`;

const SpinnerWrapper = styled.div`
    padding: 0;
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
    border-radius: 4px;
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

const ContextMenu = ({visible,x,y,index,state,is_visit,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {state == 0 && is_visit == 1 && (
            <li><div onClick={() => parent.contextMenuAction("treat_stop",index)}>診察中止</div></li>
          )}
          <li><div onClick={() => parent.contextMenuAction("schedule_create",index)}>スケジュール登録</div></li>
          {state != null && (
            <>
              <li><div onClick={() => parent.contextMenuAction("schedule_print",index)}>予定表印刷</div></li>
              <li><div onClick={() => parent.contextMenuAction("karte_seal_print",index)}>シール印刷</div></li>
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};


class VisitTreatmentScheduleList extends Component {
  constructor(props) {
    super(props);
    let scheduled_date = new Date();
    let search_schedule_date = localApi.getValue('search_schedule_date');
    if(search_schedule_date !== undefined && search_schedule_date != null){
      scheduled_date = new Date(search_schedule_date);
      localApi.remove('search_schedule_date');
    }
    let schVal = localApi.getValue('patient_list_schVal');
    let visit_place_id = localApi.getValue('visit_schedule_list_place');
    let visit_group_id = localApi.getValue('visit_schedule_list_group');
    let auto_reload = 1;
    this.reload_time = 60 * 1000;
    let auto_reload_info = getAutoReloadInfo("visit_treatment_reservation_list");
    if(auto_reload_info != undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    this.state = {
      visit_group : [{id: 0, value: "全て", group_short_name:""}],
      visit_place : [{id: 0, value: "全て" }],
      visit_place_id:(visit_place_id != undefined && visit_place_id != null) ? visit_place_id : 0,
      visit_group_id:(visit_group_id != undefined && visit_group_id != null) ? visit_group_id : 0,
      schedule_data:null,
      isOpenKarteModeModal: false,
      scheduled_date: scheduled_date,
      state_info :  {0: "訪問予定", 1: "診察開始", 2: "診療済み", 9: "予定を中止", 99: "診察中止"},
      visit_states:{0: 1, 1: 1, 2: 0, 9: 0, 99:0},
      time_zone_info :  {0: "時間枠なし", 1: "午前", 2: "午後"},
      scheduled_time_zones:{0: 1, 1: 1, 2: 1},
      schVal:schVal != (undefined && schVal != null) ? schVal : "",
      alert_messages:'',
      select_visit_diagnosis_type_modal:false,
      isConfirmModal:false,
      select_date_type:0,
      start_date: '',
      selected_index:-1,
      isVisitTreatmentGroupModal: false,
      isVisitTreatmentPatientModal: false,
      isOpenKarteSealPrint: false,
      auto_reload,
      complete_message:"",
      seal_color_info:{},
      list_color_info:{},
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.group_master = [];
    this.doctors = sessApi.getDoctorList();
    this.openModalStatus = 0;
  }

  async componentDidMount() {
    localApi.setValue("system_next_page", "/visit_schedule_list");
    localApi.setValue("system_before_page", "/visit_schedule_list");
    await this.getVisitGroup();
    await this.getPlaceGroup();
    await this.getSearchResult(false);
    document.getElementById("search_bar").focus();
    localApi.remove('visit_schedule_list_place');
    localApi.remove('visit_schedule_list_group');
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time);
    auth.refreshAuth(location.pathname+location.hash);
  }

  getPlaceGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_place";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          let visit_place = this.state.visit_place;
          res.map(item=>{
            let place = {};
            place.id = item.visit_place_id;
            place.value = item.name;
            visit_place.push(place);
          })
          this.setState({
            visit_place,
          });
        }
      })
      .catch(() => {
      });
  }

  getVisitGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_group";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          this.group_master = res;
          let visit_group = [{id:0, value:"全て"}];
          if(this.state.visit_place_id != 0){
            this.group_master.map(group=>{
              if(this.state.visit_place_id == group.visit_place_id){
                visit_group.push({id:group.visit_group_id, value:group.name, group_short_name:group.short_name});
              }
            });
            this.setState({visit_group});
          }
        }
      })
      .catch(() => {
      });
  }

  autoReload=()=>{
    if(this.state.auto_reload == 1 && this.openModalStatus == 0){
      this.getSearchResult();
    }
  }
  
  componentWillUnmount (){
    clearInterval(this.reloadInterval);
  }

  getSearchResult =async(is_searched=true)=>{
    this.setState({schedule_data: null});
    let path = "/app/api/v2/visit/schedule/list";
    let post_data = {
      search_month:formatDateLine(this.state.search_month),
      visit_group_id:this.state.visit_group_id,
      visit_place_id:this.state.visit_place_id,
      states:this.state.visit_states,
      scheduled_time_zones:this.state.scheduled_time_zones,
      keyword:this.state.schVal,
      scheduled_date:this.state.scheduled_date !== '' ? formatDateLine(this.state.scheduled_date) : '',
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '',
    };
    localApi.setValue("patient_list_schVal", this.state.schVal);
    localApi.setValue("visit_schedule_list_place", this.state.visit_place_id);
    localApi.setValue("visit_schedule_list_group", this.state.visit_group_id);
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          let patient_ids = {};
          res.map(schedule=>{
            if(schedule.scheduled_date != null){
              if(patient_ids[schedule.system_patient_id] === undefined){
                patient_ids[schedule.system_patient_id] = [];
              }
              if(!patient_ids[schedule.system_patient_id].includes(schedule.scheduled_date)){
                patient_ids[schedule.system_patient_id].push(schedule.scheduled_date);
              }
            } else {
              if(res.number == 0 && this.state.select_date_type == 0){
                if(patient_ids[schedule.system_patient_id] === undefined){
                  patient_ids[schedule.system_patient_id] = [];
                }
                patient_ids[schedule.system_patient_id].push(formatDateLine(this.state.start_date));
              }
            }
          });
          this.setState({
            schedule_data: res,
            selected_index:0,
            list_color_info:{}
          }, ()=>{
            document.getElementById("list_area").focus();
            if(Object.keys(patient_ids).length > 0){
              this.getListColorInfo(patient_ids);
            }
          });
        } else {
          this.setState({
            schedule_data: [],
            selected_index:-1,
            list_color_info:{},
          });
        }
      })
      .catch(() => {
      }).finally(()=>{
        this.setState({is_searched});
      });
  }
  
  getListColorInfo=async(patient_ids)=>{
    let path = "/app/api/v2/visit/schedule/list_color";
    let post_data = {
      patient_ids,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          seal_color_info:res.not_print_order,
          list_color_info:res.list_color_info,
        });
      })
      .catch(() => {
      });
    
  }

  getGroupSelect = e => {
    let select_obj = document.getElementsByClassName('select-group')[0].getElementsByTagName("select")[0];
    if(select_obj != undefined && select_obj != null){
      let w_len = e.target.value.length;
      let fontSize = "1rem";
      if(w_len > 50){
        fontSize = "0.85rem";
      }
      if(w_len > 60) {
        fontSize = "0.7rem";
      }
      if(w_len > 70) {
        fontSize = "0.6rem";
      }
      if(w_len > 80) {
        fontSize = "0.55rem";
      }
      if(w_len > 90) {
        fontSize = "0.52rem";
      }
      select_obj.style.fontSize = fontSize;
    }
    this.setState({ visit_group_id: parseInt(e.target.id)});
  };

  getPlaceSelect = e => {
    let select_obj = document.getElementsByClassName('select-place')[0].getElementsByTagName("select")[0];
    if(select_obj !== undefined && select_obj != null){
      let w_len = e.target.value.length;
      let fontSize = "1rem";
      if(w_len > 50){
        fontSize = "0.85rem";
      }
      if(w_len > 60) {
        fontSize = "0.7rem";
      }
      if(w_len > 70) {
        fontSize = "0.6rem";
      }
      if(w_len > 80) {
        fontSize = "0.55rem";
      }
      if(w_len > 90) {
        fontSize = "0.52rem";
      }
      select_obj.style.fontSize = fontSize;
    }
    let visit_place_id = parseInt(e.target.id);
    let visit_group = [{id:0, value:"全て"}];
    if(this.group_master.length > 0){
      this.group_master.map(group=>{
        if(visit_place_id == group.visit_place_id){
          visit_group.push({id:group.visit_group_id, value:group.name});
        }
      })
    }
    this.setState({
      visit_place_id,
      visit_group_id: 0,
      visit_group,
    });
  };

  setVisitState = (name, number) => {
    let visit_states = this.state.visit_states;
    visit_states[number] = !visit_states[number];
    this.setState({visit_states});
  }

  setScheduledTimeZone = (name, number) => {
    let scheduled_time_zones = this.state.scheduled_time_zones;
    scheduled_time_zones[number] = !scheduled_time_zones[number];
    this.setState({scheduled_time_zones});
  }

  selectAllTimeZone=()=>{
    let scheduled_time_zones = {0:1, 1: 1, 2: 1};
    this.setState({scheduled_time_zones});
  }

  selectAllState=()=>{
    let visit_states = {0:1, 1: 1, 2: 1, 9: 1, 99:1};
    this.setState({visit_states});
  }

  goKartePage = async(systemPatientId, number, state, place_name, group_name, scheduled_date, index=null) => {
    if(index != null){
      this.setState({selected_index:index});
    }
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if (item.system_patient_id == systemPatientId) {
        isExist = 1;
      }
    });
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      this.openModalStatus = 1;
      this.setState({alert_messages: '4人以上の患者様を編集することはできません。'});
      return;
    }
    if (isExist == 0) { // new patient connect
      let modal_data = {
        systemPatientId,
        visit_number : number,
        visit_state : state,
        place_name : place_name,
        group_name : group_name,
        scheduled_date,
      };
      this.openModalStatus = 1;
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      let patientInfo = karteApi.getPatient(systemPatientId);
      if (patientInfo.karte_mode  != KARTEMODE.READ) {
        let reservation_info = karteApi.getVal(systemPatientId, CACHE_LOCALNAMES.RESERVATION_INFO);
        if(reservation_info !== undefined && reservation_info != null){
          this.openModalStatus = 1;
          this.setState({alert_messages: '既に'+ reservation_info.diagnosis_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
          return;
        }
        let visit_info = karteApi.getVal(systemPatientId, CACHE_LOCALNAMES.VISIT_INFO);
        if(visit_info !== undefined && visit_info != null && visit_info.schedule_number !== number){
          this.openModalStatus = 1;
          this.setState({alert_messages:'既に'+ visit_info.place_name +'の'+ visit_info.group_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
          return;
        }
        let visit_continue = true;
        if(visit_info !== undefined && visit_info != null && visit_info.schedule_number === number){
          visit_continue = false; //キャッシュにすでに同じレコードが存在
        }
        if(visit_continue) {
          let treatment_started_at = formatDateLine(new Date())+ ' ' + formatTimeSecondIE(new Date());
          if(state == 0 && number != 0){
            let path = "/app/api/v2/visit/schedule/add_patient";
            let post_data = {
              state: 1,
              number:number,
              treatment_started_at,
            };
            await apiClient
              .post(path, {
                params: post_data
              })
              .then(() => {
              })
              .catch(() => {

              });
          }
          if(state == 0 || state == 1){
            this.setState({
              treatment_started_at,
              select_visit_diagnosis_type_modal:true,
              schedule_number:number,
              place_name:place_name,
              group_name:group_name,
              systemPatientId:systemPatientId,
            });
            return;
          }
        }
      }
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+systemPatientId+"/"+page);
    }
  }

  startDepartment=(visit_type, diagnosis_type)=>{
    //save cache
    let visit_info = {};
    visit_info.schedule_number = this.state.schedule_number;
    visit_info.treatment_started_at = this.state.treatment_started_at;
    visit_info.place_name = this.state.place_name;
    visit_info.group_name = this.state.group_name;
    visit_info.visit_type = visit_type;
    visit_info.diagnosis_type = diagnosis_type;
    karteApi.setVal(this.state.systemPatientId, CACHE_LOCALNAMES.VISIT_INFO, JSON.stringify(visit_info));

    this.setState({
      select_visit_diagnosis_type_modal:false,
    });
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
    this.goToUrlFunc("/patients/"+this.state.systemPatientId+"/"+page);
  }

  search = word => {
    word = word.toString().trim();
    this.setState({
      schVal: word
    });
  };

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.getSearchResult();
    }
  };

  getDate = value => {
    if (value == null) {
      value = new Date();
    }
    this.setState({
      scheduled_date: value
    });
  };

  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.closeModal();
  };

  goToPage = (url) => {
    this.props.history.replace(url);
  }

  getTreatmentDoctorName=(scheduled_doctor_number, treatment_completed_doctor_number)=>{
    if(this.doctors == null){
      return '';
    }
    if(scheduled_doctor_number == null && treatment_completed_doctor_number == null){
      return '';
    }
    let scheduled_doctor_name = '';
    if(treatment_completed_doctor_number != null){
      this.doctors.map(doctor=>{
        if(doctor.doctor_code == treatment_completed_doctor_number){
          scheduled_doctor_name = doctor.name;
        }
      });
      return scheduled_doctor_name;
    }
    this.doctors.map(doctor=>{
      if(doctor.doctor_code == scheduled_doctor_number){
        scheduled_doctor_name = doctor.name;
      }
    });
    return scheduled_doctor_name;
  }

  handleClick=(e, index, state, is_visit)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: {visible: false}
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let clientY = e.clientY;
      let state_data = {};
      state_data.contextMenu = {
        visible: true,
        x: e.clientX,
        y: clientY,
        index,
        state,
        is_visit
      };
      this.setState(state_data, ()=>{
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let window_height = window.innerHeight;
        if ((clientY + menu_height) > window_height) {
          state_data.contextMenu.y = clientY - menu_height;
          this.setState(state_data);
        }
      });
    }
  }

  contextMenuAction = (act, index) => {
    let data = this.state.schedule_data[index];
    let seal_print_info = {};
    switch (act){
      case "treat_stop":
        this.openModalStatus = 1;
        this.setState({
          isConfirmModal: true,
          confirm_message: '診察を中止しますか？',
          record_number:data['number'],
        });
        break;
      case "schedule_create":
        this.openModalStatus = 1;
        this.setState({
          isVisitTreatmentPatientModal:true,
          patient_name:data.patient_name,
          patient_number:data.patient_number,
          system_patient_id:data.system_patient_id,
          place_name:data.is_visit == 0 ? null : data.place_name,
          group_name:data.is_visit == 0 ? null : data.group_name,
          set_visit:data.is_visit == 0 ? 1 : 0,
        });
        break;
      case "schedule_print":
        this.printReservationList('schedule', data);
        break;
      case "karte_seal_print":
        this.openModalStatus = 1;
        seal_print_info.date = data.scheduled_date;
        seal_print_info.patient_id = data.system_patient_id;
        seal_print_info.patient_name = data.patient_name;
        seal_print_info.patient_number = data.patient_number;
        this.setState({
          isOpenKarteSealPrint:true,
          seal_print_info
        });
        break;
    }
  };

  treatStop=async()=>{
    this.closeModal();
    let path = "/app/api/v2/visit/treat_stop";
    let post_data = {
      number:this.state.record_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.getSearchResult();
        this.openModalStatus = 1;
        this.setState({alert_messages : res.alert_message});
      })
      .catch(() => {

      });
  };

  setDate = (e) =>{
    if(this.state.select_date_type === parseInt(e.target.value)){return;}
    let scheduled_date = this.state.scheduled_date;
    let start_date = this.state.start_date;
    if(parseInt(e.target.value) === 0){
      scheduled_date = new Date();
      start_date = '';
    }
    if(parseInt(e.target.value) === 1){
      scheduled_date = "";
      start_date = '';
    }
    if(parseInt(e.target.value) === 2){
      if(scheduled_date === ''){
        scheduled_date = new Date();
      }
      start_date = new Date(scheduled_date.getFullYear(), scheduled_date.getMonth(), (scheduled_date.getDate() - 7));
    }

    this.setState({
      select_date_type:parseInt(e.target.value),
      scheduled_date,
      start_date,
    })
  };

  moveDay = (type) => {
    let now_day = this.state.scheduled_date;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      scheduled_date: cur_day,
      select_date_type:0,
      start_date:"",
    });
  };

  selectToday=()=>{
    this.setState({
      scheduled_date: new Date(),
      select_date_type:0,
      start_date:"",
    });
  }

  getStartDate = value => {
    this.setState({
      start_date: value,
    });
  };

  onKeyPressed(e) {
    let data = [];
    if (this.state.schedule_data != null && this.state.schedule_data.length > 0) {
      data = this.state.schedule_data;
    }
    if (e.keyCode === KEY_CODES.up) {
      this.setState({selected_index:this.state.selected_index >= 1 ? this.state.selected_index - 1 : data.length - 1},() => {
        this.scrollToelement();
      });
      $("#search_bar").blur();
      document.getElementById("list_area").focus();
    }
    if (e.keyCode === KEY_CODES.down) {
      this.setState({selected_index: this.state.selected_index + 1 == data.length ? 0 : this.state.selected_index + 1},() => {
        this.scrollToelement();
      });
      $("#search_bar").blur();
      document.getElementById("list_area").focus();
    }
    if (e.keyCode === KEY_CODES.enter) {
      let nFlag = $("#search_bar").is(':focus');
      if (nFlag == false) {
        let item = this.state.schedule_data[this.state.selected_index];
        if(item != undefined){
          this.goKartePage(item.system_patient_id, item.number, item.state, item.place_name, item.group_name, item.scheduled_date);
        }
      }
    }
  }

  scrollToelement = () => {
    const els = $(".schedule-area [class*=selected]");
    const pa = $(".schedule-area .scroll-area");
    const th = $(".schedule-area .thead-area");
    if (els.length > 0 && pa.length > 0 && th.length > 0) {
      const thHight = $(th[0]).height();
      const elHight = $(els[0]).height();
      const elTop = thHight + (elHight+1)*this.state.selected_index;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  closeModal = (act=null) => {
    this.setState({
      isVisitTreatmentGroupModal: false,
      isVisitTreatmentPatientModal: false,
      isConfirmModal: false,
      isOpenKarteModeModal: false,
      isOpenKarteSealPrint: false,
      alert_messages: "",
    }, ()=>{
      if(act == "save"){
        this.getSearchResult();
      }
      document.getElementById("list_area").focus();
    });
    this.openModalStatus = 0;
  }

  openVisitTreatmentGroupModal=()=>{
    this.openModalStatus = 1;
    this.setState({isVisitTreatmentGroupModal:true});
  }
  
  openVisitTreatmentPatientModal=()=>{
    this.openModalStatus = 1;
    this.setState({
      isVisitTreatmentPatientModal:true,
      patient_name:null,
      patient_number:null,
      system_patient_id:null,
      place_name:null,
      group_name:null,
      set_visit:0,
    });
  }
  
  getUsableMenuItem = (menu_id) => {
    let menu_info = sessApi.getObjectValue("init_status", "navigation_menu");
    if (menu_info == undefined || menu_info == null) return false;
    let find_menu = menu_info.find(x=>x.id == menu_id);
    if (find_menu == undefined || find_menu == null) return false;
    return find_menu.is_enabled && find_menu.is_visible;
  }

  gotoSoap = () => {
    let patient_info = karteApi.getLatestVisitPatientInfo();    
    if (patient_info == undefined || patient_info == null) {
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (current_system_patient_id > 0) {
        this.props.history.replace(`/patients/${current_system_patient_id}/soap`);
      }
    } else {
      this.props.history.replace(`/patients/${patient_info.patient_id}/soap`);
    }
  }
  getUsableMenuItem = (menu_id) => {
    let menu_info = sessApi.getObjectValue("init_status", "navigation_menu");
    if (menu_info == undefined || menu_info == null) return false;
    let find_menu = menu_info.find(x=>x.id == menu_id);
    if (find_menu == undefined || find_menu == null) return true;
    return find_menu.is_enabled && find_menu.is_visible;
  }

  setAutoReload = (name, value) => {
    if(name == "auto_reload"){
      this.setState({auto_reload:value});
    }
  };
  
  getStrName=(name, max_length)=>{ //全角15文字, 全角5文字
    let kanaregexp = new RegExp('[\uff00-\uff9f]');
    let zenkaku_number = ["０","１","２","３","４","５","６","７","８","９"];
    let nLength = 0;
    let str_name = "";
    max_length = max_length * 2 + 1;
    for (let i = 0; i < name.length; i++) {
      if(kanaregexp.test(name[i]) != true){
        nLength += 2;
        if(nLength < max_length){
          str_name = str_name + name[i];
        } else {
          str_name = str_name + "...";
          break;
        }
      } else if(zenkaku_number.includes(name[i])) {
        nLength += 2;
        if(nLength < max_length){
          str_name = str_name + name[i];
        } else {
          str_name = str_name + "...";
          break;
        }
      } else {
        nLength += 1;
        if(nLength < max_length){
          str_name = str_name + name[i];
        } else {
          str_name = str_name + "...";
          break;
        }
      }
    }
    return str_name;
  };
  
  printReservationList=async(type, schedule_data)=>{
    let path = "/app/api/v2/visit/print/reservation";
    this.openModalStatus = 1;
    this.setState({complete_message:"印刷中"});
    let print_data = {};
    print_data.scheduled_time_zone = '';
    print_data.schedule_doctor_name = '';
    print_data.schedule_list = [];
    let place_name = "";
    let group_short_name = "";
    let group_name = "";
    if(type == "list"){
      print_data.scheduled_date = formatDateLine(this.state.scheduled_date);
      place_name = (this.state.visit_place.find((x) => x.id == this.state.visit_place_id) != undefined)
        ? this.state.visit_place.find((x) => x.id == this.state.visit_place_id).value : "";
      group_short_name = (this.state.visit_group.find((x) => x.id == this.state.visit_group_id) != undefined)
        ? this.state.visit_group.find((x) => x.id == this.state.visit_group_id).group_short_name : "";
      group_name = (this.state.visit_group.find((x) => x.id == this.state.visit_group_id) != undefined)
        ? this.state.visit_group.find((x) => x.id == this.state.visit_group_id).value : "";
      if(this.state.scheduled_time_zones[0] == 0 && this.state.scheduled_time_zones[1] == 1 && this.state.scheduled_time_zones[2] == 0){
        print_data.scheduled_time_zone = 'AM';
      }
      if(this.state.scheduled_time_zones[0] == 0 && this.state.scheduled_time_zones[1] == 0 && this.state.scheduled_time_zones[2] == 1){
        print_data.scheduled_time_zone = 'PM';
      }
      print_data.schedule_doctor_name = this.getTreatmentDoctorName(this.state.schedule_data[0]['scheduled_doctor_number'], this.state.schedule_data[0]['treatment_completed_doctor_number']);
      print_data.schedule_list = JSON.parse(JSON.stringify(this.state.schedule_data));
    } else {
      print_data.scheduled_date = schedule_data.scheduled_date;
      place_name = schedule_data.place_name;
      group_short_name = schedule_data.group_short_name;
      group_name = schedule_data.group_name;
      print_data.scheduled_time_zone = schedule_data.scheduled_time_zone == 1 ? 'AM' : (schedule_data.scheduled_time_zone == 2 ? 'PM' : '');
      print_data.schedule_doctor_name = this.getTreatmentDoctorName(schedule_data['scheduled_doctor_number'], schedule_data['treatment_completed_doctor_number']);
      print_data.schedule_list.push(schedule_data);
    }
    print_data.place_name = (place_name != null && place_name != "") ? this.getStrName(place_name, 15) : "";
    print_data.group_short_name = (group_short_name != null && group_short_name != "") ? this.getStrName(group_short_name, 5) : "";
    if(print_data.schedule_list.length < 6){
      let schedule_lengh = print_data.schedule_list.length;
      for(let length=schedule_lengh; length < 6; length++){
        print_data.schedule_list.push([]);
      }
    }
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
        this.setState({complete_message:""});
        this.openModalStatus = 0;
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        let file_name = "訪問診療予定表_" + (print_data.scheduled_date.split('-').join(''))+'_'+(place_name != null ? place_name : "")
          +'_'+(group_short_name != null ? group_short_name : (group_name != null ? group_name : ""))+'.pdf';
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, file_name);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
        this.openModalStatus = 0;
      })
  }

  render() {
    let list_names = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け ","病棟マップ", "訪問診療予定", "訪問診療施設管理", "訪問診療スケジュール"];
    var list_urls = ["/patients", "/patients_search", "/hospital_ward_list", "/emergency_patients", "/reservation_list", "", "/hospital_ward_map", "/visit_schedule_list", "/visit/group_master", "/visit/schedule"];
    const menu_list_ids = ["1001","1002","1003","1006","1004","","1007", "1005", "4008", "4007"];
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth;
    let print_btn = false;
    if(this.state.visit_place_id != 0 && this.state.visit_group_id != 0 && this.state.select_date_type == 0
      && this.state.schedule_data != null && this.state.schedule_data.length != 0){
      print_btn = true;
    }
    return (
      <PatientsWrapper onKeyDown={this.onKeyPressed} id={'list_area'}>
        <div className="title-area flex">
          <div className={'title'}>訪問診療予定</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10)){
                  return(
                    <>
                      {item == "訪問診療予定" ? (
                        <Button className="button tab-btn active-btn">{item}</Button>
                      ):(
                        <>
                          {this.getUsableMenuItem(menu_list_ids[index]) ? (
                            <Button className="button tab-btn" onClick={()=>this.goToPage(list_urls[index])}>{item}</Button>
                          ):(<></>)}
                        </>
                      )}
                    </>
                  )
                } else {
                  if(item != "訪問診療施設管理" && item != "訪問診療予定" && item != "訪問診療スケジュール"){
                    return(
                      <>
                        <Button className="disabled button">{item}</Button>
                      </>
                    )
                  }
                }
              }
            })}
            {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
              <Button className="button tab-btn close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
            )}
          </div>
        </div>
        <FlexTop>
          <SearchBar
            placeholder="患者ID / 患者名"
            search={this.search}
            enterPressed={this.enterPressed}
            value={this.state.schVal}
            id={'search_bar'}
          />
        </FlexTop>
        <Flex>
          <div className={'flex'} style={{width:'100%'}}>
            <div className="date-area">
              <div className="MyCheck flex">
                <div className='search-date-area flex'>
                  <Radiobox
                    label="日付指定"
                    value={0}
                    getUsage={this.setDate.bind(this)}
                    checked={this.state.select_date_type === 0}
                    name={`date-set`}
                  />
                  <div className="prev-day" onClick={this.moveDay.bind(this, 'prev')}>{"＜ "}</div>
                  <div className={'select-today'} onClick={this.selectToday.bind()}>本日</div>
                  <div className="next-day" onClick={this.moveDay.bind(this, 'next')}>{" ＞"}</div>
                </div>
                <div className = "select-place">
                  <SelectorWithLabel
                    options={this.state.visit_place}
                    title="施設"
                    getSelect={this.getPlaceSelect}
                    departmentEditCode={this.state.visit_place_id}
                  />
                </div>
              </div>
              <div className="MyCheck flex">
                <div className='search-date-area flex'>
                  <Radiobox
                    label="期間指定"
                    value={2}
                    getUsage={this.setDate.bind(this)}
                    checked={this.state.select_date_type === 2 ? true : false}
                    name={`date-set`}
                  />
                  <div className={'d-flex'}>
                    <DatePicker
                      locale="ja"
                      selected={this.state.start_date}
                      onChange={this.getStartDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      disabled={this.state.select_date_type === 2 ?  false : true}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    <div className={'from-to'}>～</div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.scheduled_date}
                      onChange={this.getDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      disabled={this.state.scheduled_date === '' ?  true : false}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                </div>
                <div className = "select-group">
                  <SelectorWithLabel
                    options={this.state.visit_group}
                    title="グループ"
                    getSelect={this.getGroupSelect}
                    departmentEditCode={this.state.visit_group_id}
                    isDisabled={this.state.visit_place_id === 0}
                  />
                </div>
                <Button style={{height:"2rem"}} type="mono" onClick={this.getSearchResult.bind(this)}>検索</Button>
              </div>
            </div>
          </div>
          <div style={{display:'flex'}}>
            <div className={'block-area'}>
              <div className={'block-title'}>時間枠</div>
              <div className={'check-state'}>
                <Button type="mono" onClick={this.selectAllTimeZone.bind(this)}>全選択</Button>
                {Object.keys(this.state.scheduled_time_zones).map((index)=>{
                  return (
                    <>
                      <Checkbox
                        label={this.state.time_zone_info[index]}
                        getRadio={this.setScheduledTimeZone.bind(this)}
                        number={index}
                        value={this.state.scheduled_time_zones[index]}
                        name={`scheduled_time_zone`}
                      />
                    </>
                  );
                })}
              </div>
            </div>
            <div className={'block-area'}>
              <div className={'block-title'}>診察状態</div>
              <>
                <div className={'check-state'}>
                  <Button type="mono" onClick={this.selectAllState.bind(this)}>全選択</Button>
                  {Object.keys(this.state.visit_states).map((index)=>{
                    return (
                      <>
                        <Checkbox
                          label={this.state.state_info[index]}
                          getRadio={this.setVisitState.bind(this)}
                          number={index}
                          value={this.state.visit_states[index]}
                          name={`visit_state`}
                        />
                      </>
                    );
                  })}
                </div>
              </>
            </div>
            <div style={{marginLeft:"auto", marginRight:0}}>
              <div className={'auto-reload'}>
                <Checkbox
                  label="自動更新"
                  getRadio={this.setAutoReload.bind(this)}
                  value={this.state.auto_reload === 1}
                  name="auto_reload"
                />
              </div>
              <div>
                <div style={{marginLeft:"auto"}} className={'flex'}>
                  {print_btn ? (
                    <div style={{marginRight:"0.4rem"}}><Button className='red-btn' onClick={this.printReservationList.bind(this, 'list')}>予定表印刷</Button></div>
                  ):(
                    <div style={{marginRight:"0.4rem"}}><Button className='disable-btn'>予定表印刷</Button></div>
                  )}
                  {arr_menu_permission['4006'] != undefined && arr_menu_permission['4006'].includes(11) && this.getUsableMenuItem('4006') && (
                    <div style={{marginRight:"0.4rem"}}><Button className='red-btn' onClick={this.openVisitTreatmentPatientModal.bind(this)}>スケジュール登録</Button></div>
                  )}
                  {arr_menu_permission['4007'] != undefined && arr_menu_permission['4007'].includes(11) && this.getUsableMenuItem('4007') && (
                    <Button className='red-btn' onClick={this.openVisitTreatmentGroupModal.bind(this)}>グループスケジュール登録</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Flex>
        <div className={'schedule-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th style={{width:"4rem"}}> </th>
              <th style={{width:"8rem"}}>患者ID</th>
              <th style={{width:"20rem"}}>患者名</th>
              <th style={{width:"6rem"}}>状態</th>
              <th style={{width:"9rem"}}>予定日付</th>
              <th style={{width:"8rem"}}>時間枠</th>
              <th style={{width:"25rem"}}>訪問診療グループ名称</th>
              <th style={{padding:"0.3rem 0"}}>診察(予定)医師</th>
              <th style={{width:"2rem"}}> </th>
            </tr>
            </thead>
            <tbody className={'scroll-area'}>
            {this.state.schedule_data == null ? (
              <tr>
                <td colSpan={'9'}>
                  <div className='spinner_area no-result'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </td>
              </tr>
            ):(
              <>
                {this.state.schedule_data.length === 0 ? (
                  this.state.is_searched && (
                    <tr><td colSpan={'9'}><div className="no-result"><div className={'border'}>条件に一致する結果は見つかりませんでした。</div></div></td></tr>)
                ) : (
                  this.state.schedule_data.map((item, index) => {
                    let view_icon = (item.scheduled_date != null && this.state.list_color_info[item.system_patient_id] !== undefined && this.state.list_color_info[item.system_patient_id][item.scheduled_date] !== undefined) ? 1:0;
                    return (
                      <>
                        <tr
                          className={'row-'+index + ' go-karte ' + (this.state.selected_index == index ? 'selected' : '')}
                          onClick={this.goKartePage.bind(this, item.system_patient_id, item.number, item.state, item.place_name, item.group_name, item.scheduled_date, index)}
                          onContextMenu={e => this.handleClick(e, index, item.state, item.is_visit)}
                        >
                          <td className={'text-center user-icon'} style={{width:"4rem"}}>
                            {item.gender === 1 ? (
                              <LargeUserIcon size="sm" color="#9eaeda" />
                            ) : (
                              <LargeUserIcon size="sm" color="#f0baed" />
                            )}
                          </td>
                          <td className={'text-right'} style={{width:"8rem"}}>{item.patient_number}</td>
                          <td style={{width:"20rem"}}>{item.patient_name}</td>
                          <td style={{width:"6rem"}}>{item.number == 0 ? "未登録" : this.state.state_info[item.state]}</td>
                          <td style={{width:"9rem"}}>{item.number == 0 ? "未登録" : formatJapanDateSlash(item.scheduled_date)}</td>
                          <td style={{width:"8rem"}}>{item.number == 0 ? "未登録" : this.state.time_zone_info[item.scheduled_time_zone]}</td>
                          <td style={{width:"25rem"}}>{item.is_visit == 0 ? "未登録" : (item.group_name + '（'+item.place_name + '）')}</td>
                          <td>{item.number == 0? "未登録" : this.getTreatmentDoctorName(item.scheduled_doctor_number, item.treatment_completed_doctor_number)}</td>
                          <td className={'text-center'} style={{width:"2rem",padding:0, paddingTop:"8px"}}>
                            {view_icon === 1 && (
                              <OverlayTrigger
                                placement={index == 0 ? "bottom" : "top"}
                                overlay={this.state.seal_color_info.icon_over_text !== undefined ? renderTooltip(this.state.seal_color_info.icon_over_text) : ""}>
                                <div className={'icon-character'} style={{color:(this.state.seal_color_info.icon_character_color !== undefined ? this.state.seal_color_info.icon_character_color : "")}}>
                                  {this.state.seal_color_info.icon_character !== undefined ? this.state.seal_color_info.icon_character : ""}
                                </div>
                              </OverlayTrigger>
                            )}
                          </td>
                        </tr>
                      </>
                    )
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </div>
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'visit'}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.select_visit_diagnosis_type_modal && (
          <SelectVisitDiagnosisTypeModal
            handleOk= {this.startDepartment}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.isConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.treatStop.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isVisitTreatmentGroupModal && (
          <VisitTreatmentGroupModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isVisitTreatmentPatientModal && (
          <VisitTreatmentPatientModal
            closeModal={this.closeModal}
            patient_name={this.state.patient_name}
            patient_number={this.state.patient_number}
            system_patient_id={this.state.system_patient_id}
            place_name={this.state.place_name}
            group_name={this.state.group_name}
            set_visit={this.state.set_visit}
          />
        )}
        {this.state.isOpenKarteSealPrint && (
          <KarteSealPrint
            closeModal={this.closeModal}
            search_condition={this.state.seal_print_info}
            from_mode={'visit_treatment_schedule_list'}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
      </PatientsWrapper>
    );
  }
}

VisitTreatmentScheduleList.contextType = Context;
VisitTreatmentScheduleList.propTypes = {
  history: PropTypes.object,
}
export default VisitTreatmentScheduleList;

