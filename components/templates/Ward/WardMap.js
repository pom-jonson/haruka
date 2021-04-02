import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as colors from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar";
import Button from "~/components/atoms/Button";
import auth from "~/api/auth";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import {formatDateLine, formatDateSlash, formatTimeIE} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import $ from "jquery";
import MoveHospitalization from "~/components/templates/Ward/MoveHospitalization";
import DoHospitalization from "~/components/templates/Ward/DoHospitalization";
import {CACHE_LOCALNAMES, getAutoReloadInfo, getServerTime} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import InputInformationDoHospital from "~/components/templates/Ward/InputInformationDoHospital";
import NurseCourseSeatModal from "~/components/templates/Ward/worksheet/NurseCourseSeatModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import NurseRequireModal from "~/components/templates/Nurse/NurseRequireModal";
import StateBatchRegist from "./StateBatchRegist";
import Spinner from "react-bootstrap/Spinner";
import ProgressChart from "~/components/templates/Nurse/ProgressChart/ProgressChart";
import PatientsSchedule from "~/components/templates/Nurse/patients_schedule/PatientsSchedule";
import MovePlanPatientList from "~/components/templates/Ward/MovePlanPatientList";
import bed_img_left from "~/components/_demo/ward_map/bed_left.png";
import bed_img_right from "~/components/_demo/ward_map/bed_right.png";
import nurse_station_2 from "~/components/_demo/ward_map/nurse_station_2.png";
import nurse_station_3 from "~/components/_demo/ward_map/nurse_station_3.png";
import nurse_station_4 from "~/components/_demo/ward_map/nurse_station_4.png";
import SelectPatientSoapModal from "~/components/templates/Patient/components/SelectPatientSoapModal";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import BedControlModal from "~/components/templates/Ward/BedControlModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import HospitalPatientHistory from "~/components/templates/Ward/HospitalPatientHistory";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import SetBedBackgroundModal from "~/components/templates/Ward/SetBedBackgroundModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import WorkSheetModal from "~/components/templates/Ward/worksheet/WorkSheetModal";
import axios from "axios/index";
import {setDateColorClassName} from "~/helpers/dialConstants";

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  font-size:1rem;
  .flex {display: flex;}
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
    button {
      background-color: ${colors.surface};
      min-width: auto;
      margin-left: 0.5rem;
      padding: 0.5rem;
    }
    .button span {
      word-break: keep-all;
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
    }
  }
  .title {
    font-size: 1.875rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .search-btn {
    height: 2rem;
    background-color: white;
    padding: 0;
    span {font-size: 1rem;}
  }
  .ml-05rem {margin-left:0.5rem;}
  .map-area {
    font-size:0.8rem;
    font-weight:bold;
    margin-top: 0.5rem;;
    background-color: white;
    height: calc(100% - 19rem);
    overflow-y: auto;
    overflow-x: auto;
    display:flex;
    position: relative;
    .table-area {
      table {
        width:100%;
        margin:0;
        tbody{
          display:block;
          overflow-y: scroll;
          height: 8.5rem;
          width:100%;
          tr{cursor:pointer;}
        }
        tr{
          display: table;
          width: 100%;
        }
        thead{
          display:table;
          width:100%;    
          border-bottom: 1px solid #dee2e6;    
          tr{width: calc(100% - 17px);}
        }
        th {
          position: sticky;
          text-align: center;
          white-space:nowrap;
          border:1px solid #dee2e6;
          border-bottom:none;
          border-top:none;
          vertical-align: middle;
          padding: 0.2rem;
          font-size: 1rem;
        }
        td {
          word-break: break-all;
          padding: 0 0.2rem;
        }
      } 
    }
    .bed-box {
      border-left: 0.05rem solid black;
      border-right: 0.05rem solid black;
      border-bottom: 0.05rem solid black;
      background-image:url(${bed_img_left});
      background-repeat: round;
    }
    .multi-room {
      .bed-box:nth-child(even) {
        border-left:none !important;
        background-image:url(${bed_img_right});
      }
    }
  }
  .w120p {
    width: 120px;
  }
  .active-btn {
    background: rgb(252, 187, 56); 
  }
  .red-color span{color:rgb(237, 26, 61);}
  .check-box {
    padding-left: 10px;
    label {
      font-size: 1rem;
      line-height: 2rem;
    }
  }
  .view-mode {
    color:red;
    line-height: 2rem;
  }
  .color-box {
    min-width: 2rem;
    height:2rem;
    line-height: 2rem;
    margin-left:0.5rem;
    margin-right:0.5rem;
    padding:0 0.2rem;
    border: 1px solid transparent;
  }
  .border2px {
    // border:2px solid black;
    // border:0.1rem solid black;
    border:0.05rem solid black;
  }
  .border1px {
    // border:1px solid black;
    border:0.05rem solid black;
    // border-right: 0.05rem solid black;
    // border-top: 0.05rem solid black;
  }
  .bed-border {
    border-right: 0.05rem solid black;
    border-bottom: 0.05rem solid black;
  }
  .patient-sel:hover{
    cursor: pointer;
    background: #ddd !important;
  }
  .patient-selected{
    border: 3px solid #26a0da;
    height: 100%;
    width: 100%;
  }
  .bottom-border {
    border-bottom: 1px solid #aaa;
  }
  .div-title {
    line-height: 2rem;
    padding-right: 5px;
  }
  .position {
    position: absolute;
  }
  .pointer {
    cursor:pointer;
  }
  .row-patient {cursor:pointer;}
  .row-patient:hover {background-color:rgb(105, 200, 225);}
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding-bottom:0.5rem;
  border-bottom: 1px solid #aaa;
  .search-box {
      width: 100%;
      display: flex;
  }
  .pullbox-label {
    margin-bottom:0;
  }
  .pullbox-select {
    height:2rem;
    font-size: 1rem;
  }
  .select-group {
    margin-right:10px;
  }
  .react-datepicker-wrapper {
    input {
        width: 110px;
        height:2rem;
    }
  }
  .select-date {
    margin-left:0.5rem;
    .react-datepicker-wrapper {
      margin-left: -80px;
      margin-top: 15px;
      input {
        display: none;
      }
    }
    .react-datepicker {
      width:unset;
    }
    .react-datepicker-popper {
      left:-20px !important;
      transform: translate3d(8px, 29px, 0px);
      .react-datepicker__triangle {left: 50px !important;}
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
  }
  .search-date {
    border: 1px solid #aaa;
    width: 9rem;
    text-align: center;
    background: white;
    line-height: 2rem;
    height: 2rem;
    font-size: 1rem;
  }
  button {
    height:2rem;
  }
  .react-datepicker__navigation{
    height:1rem;
  }
  .select-ward {
    .label-title {
      width:3rem;
      margin:0;
      margin-left:0.5rem;
      line-height: 2rem;
      text-align:left;
      font-size: 1rem;
    }
    .pullbox-select {width:5rem;}
  }
  .select-emphasis-mode {
    margin-left:0.5rem;
    .label-title {
      width:6rem;
      margin:0;
      margin-left:0.5rem;
      line-height: 2rem;
      text-align:left;
      font-size: 1rem;
    }
    .pullbox-select {width:6rem;}
  }
  .map-title {
    line-height: 2rem;
    width: 80px;
    margin:0;
  }
  .date-label {
    line-height: 2rem;
    margin-bottom: 0;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
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
`;

const ContextMenuUl = styled.div`
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
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
      font-weight: bold;
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
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
  .patient-info-table {
    width: 100%;
    table {
      margin-bottom: 0;
    }
    th {
      font-size: 1rem;
      vertical-align: middle;
      padding: 0;
      text-align: right;
      width: 110px;
      padding-right: 5px;
    }
    td {
      font-size: 1rem;
      vertical-align: middle;
      padding: 0;
      text-align: left;
      padding-left: 5px;
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenu = ({visible, x, y, patient_info, last_hospital_view, set_back_color_flag, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("go_karte",patient_info)}>カルテを開く</div></li>
          <li><div onClick={() => parent.contextMenuAction("go_nurse_document",patient_info)}>看護記録を開く</div></li>
          {last_hospital_view == false && (
            <>
              {patient_info.discharge_date != null ? (
                <li><div onClick={() => parent.contextMenuAction("discharge_practice",patient_info)}>退院実施</div></li>
              ):(
                <>
                  {patient_info.go_out !== undefined && patient_info.go_out ? (
                    <li><div onClick={() => parent.contextMenuAction("going_in",patient_info)}>帰院実施</div></li>
                  ):(
                    <li><div onClick={() => parent.contextMenuAction("going_out",patient_info)}>外泊(外出)実施</div></li>
                  )}
                </>
              )}
              {set_back_color_flag && (
                <li><div onClick={() => parent.contextMenuAction("set_bed_color",patient_info)}>ベッド背景色</div></li>
              )}
            </>
          )}
          <li><div onClick={() => parent.contextMenuAction("view_history",patient_info)}>履歴表示</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const ContextCancelMenu = ({visible, x, y, patient_info, cancel_menu_flag, going_in_menu_flag, discharge_menu_flag, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {cancel_menu_flag && (
            <li><div onClick={() => parent.contextMenuAction("cancel_act",patient_info)}>取り消し</div></li>
          )}
          {going_in_menu_flag && (
            <li><div onClick={() => parent.contextMenuAction("going_in",patient_info)}>帰院実施</div></li>
          )}
          {discharge_menu_flag && (
            <li><div onClick={() => parent.contextMenuAction("discharge_practice",patient_info)}>退院実施</div></li>
          )}
          <li><div onClick={() => parent.contextMenuAction("go_karte",patient_info)}>カルテを開く</div></li>
          <li><div onClick={() => parent.contextMenuAction("view_history",patient_info)}>履歴表示</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const HoverMenu = ({visible, x, y, patient_info, diagnosis}) => {
  if(visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className={'patient-info-table'}>
              <table className="table-scroll table table-bordered" id="code-table">
                <tbody>
                <tr><th>患者ID</th><td>{patient_info.patient_number}</td></tr>
                <tr><th>カナ氏名</th><td>{patient_info.patient_name_kana}</td></tr>
                <tr><th>氏名</th><td>{patient_info.patient_name}</td></tr>
                <tr><th>年齢</th><td>{patient_info.age}歳</td></tr>
                <tr><th>性別</th><td>{patient_info.gender == 1 ? '男' : '女'}性</td></tr>
                <tr><th>生年月日</th><td>{patient_info.birthday.split('-').join('/')}</td></tr>
                <tr><th>入院日</th><td>{formatDateSlash(patient_info.date_and_time_of_hospitalization.split('-').join('/'))}</td></tr>
                <tr><th>入院日数</th><td>{patient_info.hospital_days}</td></tr>
                <tr><th>診療科</th><td>{diagnosis[patient_info.department_id]}</td></tr>
                {patient_info.path_name != null && patient_info.path_name !== "" && (
                  <tr><th>適用パス名</th><td>{patient_info.path_name}</td></tr>
                )}
                <tr><th>主担当医</th><td>{(patient_info.doctor_names != null && patient_info.doctor_names[0] !== undefined) ? patient_info.doctor_names[0] : ""}</td></tr>
                {patient_info.doctor_names != null && (
                  Object.keys(patient_info.doctor_names).map(doctor=>{
                    if(doctor != 0){
                      return (
                        <>
                          <tr>
                            <th>担当医{doctor}</th>
                            <td>{patient_info.doctor_names[doctor]}</td>
                          </tr>
                        </>
                      )
                    }
                  })
                )}
                {patient_info.nurse_name_1 !== undefined && (
                  <tr><th>担当看護師</th><td>{patient_info.nurse_name_1}</td></tr>
                )}
                {patient_info.nurse_name_2 !== undefined && (
                  <tr><th>副担当看護師</th><td>{patient_info.nurse_name_2}</td></tr>
                )}
                {/*<tr><th>チーム</th><td> </td></tr>*/}
                {patient_info.purpose_comment_array != null && (
                  <tr>
                    <th>入院目的</th>
                    <td>
                      {patient_info.purpose_comment_array.map(comment=>{
                        return (
                          <>
                            <span>{comment.name}</span><br/>
                          </>
                        )
                      })}
                    </td>
                  </tr>
                )}
                {/*<tr><th>包括情報</th><td> </td></tr>*/}
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class WardMap extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let diagnosis = {};
    departmentOptions.map(department=>{
      diagnosis[parseInt(department.id)] = department.value;
    });
    let schVal = localApi.getValue('patient_list_schVal');
    let auto_reload = 1;
    this.reload_time = 60 * 1000;
    let auto_reload_info = getAutoReloadInfo("ward_map");
    if(auto_reload_info != undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    this.current_date_time = this.getCurrentTime();
    let first_ward_id = 0;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.user_ward_id != undefined && authInfo.user_ward_id != null && authInfo.user_ward_id != 0){
      first_ward_id = authInfo.user_ward_id;
    }
    if (first_ward_id == 0 && authInfo.auth_ward_id != undefined && authInfo.auth_ward_id != null && authInfo.auth_ward_id != 0){
      first_ward_id = authInfo.auth_ward_id;
    }
    this.state = {
      view_mode:"patient_select",
      alert_messages:'',
      schVal:schVal != (undefined && schVal != null) ? schVal : "",
      first_ward_id,
      search_date:this.current_date_time,
      patient_list:[],
      map_data:{},
      cur_ward_name:'',
      cur_ward_background:null,
      diagnosis,
      simulation_numbers:[],
      openMoveHospitalization:false,
      openDoHospitalization:false,
      subdivision_area:[],
      waiting_area:[],
      complete_message:"",
      confirm_message:"",
      openInputInformationDoHospital:false,
      isOpenNurseCourseSeatModal:false,
      view_complete:0,
      isOpenNurseRequireModal:false,
      isOpenStateBatchRegist:false,
      selectedPatients:[],
      load_ward_map:true,
      isOpenProgressChart:false,
      isOpenPatientsSchedule:false,
      isOpenMovePlanPatientList:false,
      isOpenSelectPatientModal:false,
      isOpenKarteModeModal:false,
      isOpenBedControl:false,
      openHospitalPatientHistory:false,
      openSetBedBackgroundModal:false,
      auto_reload,
      emphasis_mode:0,
      searched_hos_numbers:[],
      work_sheet_master:[],
      bed_map_color:null,
    };
    this.focus = true;
    // this.block_size = 80;
    this.block_size_x = 6.3;
    this.block_size_y = 3;
    this.mousemove_flag = false;
    this.openModalStatus = 0;
    this.doctors = sessApi.getDoctorList();
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_names = {};
    this.ward_master = [{id:0, value:"", background:null}];
    if (cache_ward_master != undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value:ward.name, background:ward.background_color});
        this.ward_names[ward.number] = ward.name;
      });
    }
    this.emphasis_mode = [
      {id:0,value:''},
      {id:1,value:'主治医'},
      {id:2,value:'担当'},
    ];
  }
  
  getCurrentTime=()=>{
    let cur_date = new Date();
    let cur_year = cur_date.getFullYear();
    let cur_month = cur_date.getMonth() + 1;
    let cur_day = cur_date.getDate();
    let cur_hour = cur_date.getHours();
    let cur_minutes = cur_date.getMinutes();
    cur_minutes = (cur_minutes - (cur_minutes%10)) + 20;
    if(cur_minutes > 59){
      cur_minutes = cur_minutes - 60;
      cur_hour++;
      if(cur_hour > 23){
        cur_hour = 0;
        cur_day++;
      }
    }
    let new_date = new Date(cur_year + '/' + (cur_month > 9 ? cur_month : '0'+cur_month) + '/' + (cur_day > 9 ? cur_day : '0'+cur_day));
    if(new_date.toString() === "Invalid Date"){
      cur_day = 1;
      cur_month++;
      if(cur_month >12){
        cur_year++;
        cur_month = 1;
      }
    }
    return new Date(cur_year + '/' + (cur_month > 9 ? cur_month : '0'+cur_month) + '/' + (cur_day > 9 ? cur_day : '0'+cur_day)
      + ' ' + (cur_hour > 9 ? cur_hour : '0'+cur_hour) + ':' + (cur_minutes > 9 ? cur_minutes : '0'+cur_minutes) + ':00');
  }

  async componentDidMount() {
    localApi.setValue("system_next_page", "/hospital_ward_map");
    localApi.setValue("system_before_page", "/hospital_ward_map");
    localApi.remove(CACHE_LOCALNAMES.WARD_MAP);
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener('dragover', function(e){
      if (that.mousemove_flag){
        var step = 10;
        var parent_top = $('.map-area').offset().top;
        var body_height = $('.map-area').height();
        if ((e.clientY - parent_top) > body_height - 100){
          that.autoscroll(step);
        }
        if ((e.clientY-parent_top) < 100){
          that.autoscroll(-step);
        }
      }
    }, false);
    document.getElementById("search_bar").focus();
    let ward_map_ward_id = this.state.first_ward_id;
    let bed_control_open_flag = localApi.getValue('bed_control_open');
    if(bed_control_open_flag != undefined && bed_control_open_flag != null && bed_control_open_flag == 1){
      ward_map_ward_id = localApi.getValue('ward_map_ward_id');
      if(ward_map_ward_id != undefined && ward_map_ward_id != null && ward_map_ward_id != 0){
        ward_map_ward_id = parseInt(ward_map_ward_id);
      } else {
        this.setState({isOpenBedControl:true});
      }
      localApi.remove('bed_control_open');
      this.openModalStatus = 1;
    }
    if(ward_map_ward_id != 0){
      let ward_master = this.ward_master;
      this.setState({
        first_ward_id:ward_map_ward_id,
        cur_ward_name:this.ward_names[ward_map_ward_id],
        cur_ward_background:ward_master.find((x) => x.id == ward_map_ward_id) !== undefined ? ward_master.find((x) => x.id == ward_map_ward_id).background : null,
        load_ward_map:false,
        isOpenBedControl:(bed_control_open_flag != undefined && bed_control_open_flag != null && bed_control_open_flag == 1) ? true : false,
      }, ()=>{
        this.searchWardBedPatientInfo();
      });
    }
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time);
    auth.refreshAuth(location.pathname+location.hash);
  }

  autoscroll=(step)=>{
    let scrollTop = $('.map-area').scrollTop();
    $('.map-area').scrollTop(scrollTop + step);
  };

  autoReload=()=>{
    if(this.state.auto_reload == 1 && this.openModalStatus == 0 && this.state.view_mode == "patient_select"){
      this.searchWardBedPatientInfo();
    }
  }
  
  componentWillUnmount (){
    clearInterval(this.reloadInterval);
  }

  search = word => {
    word = word.toString().trim();
    this.setState({
      schVal: word
    });
  };

  enterPressed =async(e) => {
    let code = e.keyCode || e.which;
    if (code === 13) {
      await this.getWardPatientList("search_enter");
    }
  };

  openSelectPatientModal = () => {
    this.openModalStatus = 1;
    this.setState({
      isOpenSelectPatientModal: true
    });
  }

  selectToday=()=>{
    this.current_date_time = this.getCurrentTime();
    this.setState({search_date: this.current_date_time}, ()=>{
      this.searchWardBedPatientInfo();
    });
  };

  getSearchDate= value => {
    if(value == null || value == ""){
      value = new Date();
    }
    this.setState({
      search_date: value,
    }, ()=>{
      this.searchWardBedPatientInfo();
    });
  };

  goToPage = (url) => {
    this.props.history.replace(url);
  };

  getRadio = (name, value) => {
    if(name == "view_complete"){
      this.setState({view_complete:value},()=>{
        this.getWardPatientList();
      });
    }
  };

  toggle=()=> {
    if(this.state.view_mode === "patient_move"){return;}
    if(this.state.simulation_numbers.length === 0){
      this.component.setOpen(this.focus);
    }
  };

  getWardPatientList=async(condition=null)=>{
    if(this.state.search_date == null || this.state.search_date === ''){
      this.setState({alert_messages:"日付を設定してください。"});
      return;
    }
    let path = "/app/api/v2/ward/search/hospitalization";
    let post_data = {
      date_and_time_of_hospitalization:formatDateLine(this.state.search_date)+' '+formatTimeIE(this.state.search_date),
      first_ward_id:this.state.first_ward_id,
      view_complete:this.state.view_complete
    };
    if(condition === "urgency"){
      post_data.urgency = true;
    }
    localApi.setValue("patient_list_schVal", this.state.schVal);
    let patient_list = [];
    let bed_map_color = null;
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        patient_list = res.patient_list;
        bed_map_color = res.bed_map_color;
      })
      .catch(() => {

      });
    let searched_hos_numbers = [];
    if(this.state.schVal != ""){
      post_data.keyword = this.state.schVal;
      await apiClient
        .post(path, {
          params: post_data
        })
        .then((res) => {
          searched_hos_numbers = res.patient_list;
        })
        .catch(() => {
      
        });
    }
    this.setState({
      patient_list,
      bed_map_color,
      searched_hos_numbers
    });
    if(condition == "search_enter"){
      if(searched_hos_numbers.length == 1 && searched_hos_numbers[0]['search_by_patient_number'] == 1){
        let first_ward_id = parseInt(searched_hos_numbers[0]['first_ward_id']);
        if(this.state.first_ward_id != first_ward_id){
          let ward_master = this.ward_master;
          localApi.setValue("ward_map_ward_id", first_ward_id);
          this.setState({
            first_ward_id:first_ward_id,
            cur_ward_name:this.ward_names[first_ward_id],
            cur_ward_background:ward_master.find((x) => x.id == first_ward_id) !== undefined ? ward_master.find((x) => x.id == first_ward_id).background : null,
            load_ward_map:false,
          }, ()=>{
            this.searchWardBedPatientInfo();
          });
        }
      } else {
        this.openSelectPatientModal();
      }
    }
  };

  setWard=(e)=>{
    let ward_master = this.ward_master;
    localApi.setValue("ward_map_ward_id", parseInt(e.target.id));
    this.setState({
      first_ward_id:parseInt(e.target.id),
      cur_ward_name:e.target.value,
      cur_ward_background:ward_master.find((x) => x.id == parseInt(e.target.id)) !== undefined ? ward_master.find((x) => x.id == parseInt(e.target.id)).background : null,
      load_ward_map:false,
    }, ()=>{
      this.searchWardBedPatientInfo();
    });
  };

  getWardBedInfo=async()=>{
    let state_data = {};
    if(this.state.confirm_type === "move_do"){
      state_data.confirm_message = "";
      state_data.confirm_title = "";
    }
    if(this.state.load_ward_map){
      state_data.load_ward_map = false;
      this.setState(state_data);
    }
    if(Object.keys(state_data).length > 0){
      this.setState(state_data);
    }
    let path = "/app/api/v2/ward/search/bed_info";
    let first_ward_id = this.state.first_ward_id;
    let post_data = {
      first_ward_id,
    };
    if(this.state.search_date.getTime() < this.current_date_time.getTime()){
      post_data.search_type = "select_date";
      post_data.search_date = formatDateLine(this.state.search_date)+' '+formatTimeIE(this.state.search_date);
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(authInfo.staff_category == 1){
      post_data.login_doctor = authInfo.doctor_number;
    }
    if(authInfo.staff_category == 2){
      post_data.login_nurse = authInfo.user_number;
    }
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let map_data = res;
        let change_messages = [];
        let cache_data = localApi.getObject(CACHE_LOCALNAMES.WARD_MAP);
        let simulation_numbers = this.state.simulation_numbers;
        if(cache_data !== undefined && cache_data != null && Object.keys(cache_data).length > 0){
          Object.keys(cache_data).map(cache_ward_id=>{
            let cache_ward_data = cache_data[cache_ward_id];
            Object.keys(cache_ward_data).map(cache_room_id=>{
              let cache_room_data = cache_ward_data[cache_room_id];
              Object.keys(cache_room_data).map(cache_bed_number=>{
                if(map_data.room[cache_ward_id] !== undefined && map_data.room[cache_ward_id][cache_room_id] !== undefined
                  && map_data.room[cache_ward_id][cache_room_id]['bed'] !== undefined && map_data.room[cache_ward_id][cache_room_id]['bed'][cache_bed_number] !== undefined
                  && map_data.room[cache_ward_id][cache_room_id]['bed'][cache_bed_number]['patient'] != null){
                  let room_info = map_data.room[cache_ward_id][cache_room_id];
                  let patient_info = room_info['bed'][cache_bed_number]['patient'];
                  if(!simulation_numbers.includes(patient_info.hos_number)){
                    let message = patient_info['patient_number'] + ":" + patient_info['name_kana']+" "
                      +this.ward_names[cache_ward_id]+"/"+room_info['name']+"/"+room_info['bed'][cache_bed_number]['bed']['name']+"に患者が登録されました。";
                    change_messages.push(message);
                    let index = simulation_numbers.indexOf(cache_room_data[cache_bed_number]['hos_number']);
                    simulation_numbers.splice(index, 1);
                    delete cache_data[cache_ward_id][cache_room_id][cache_bed_number];
                    if(Object.keys(cache_data[cache_ward_id][cache_room_id]).length === 0){
                      delete cache_data[cache_ward_id][cache_room_id];
                      if(Object.keys(cache_data[cache_ward_id]).length === 0){
                        delete cache_data[cache_ward_id];
                        if(Object.keys(cache_data).length === 0){
                          localApi.remove(CACHE_LOCALNAMES.WARD_MAP);
                        }
                      }
                    }
                  }
                }
              });
            });
          });
          Object.keys(cache_data).map(cache_ward_id=>{
            let cache_ward_data = cache_data[cache_ward_id];
            Object.keys(cache_ward_data).map(cache_room_id=>{
              let cache_room_data = cache_ward_data[cache_room_id];
              Object.keys(cache_room_data).map(cache_bed_number=>{
                let cache_patient_info = cache_room_data[cache_bed_number];
                if(Object.keys(map_data.room).length > 0){
                  Object.keys(map_data.room).map(ward_id=>{
                    let ward_data = map_data.room[ward_id];
                    if(Object.keys(ward_data).length > 0){
                      Object.keys(ward_data).map(room_id=>{
                        let room_data = ward_data[room_id]['bed'];
                        if(Object.keys(room_data).length > 0){
                          Object.keys(room_data).map(bed_number=>{
                            let patient_info = room_data[bed_number]['patient'];
                            if(patient_info != null && patient_info.hos_number == cache_patient_info.hos_number){
                              if(ward_id == cache_patient_info.first_ward_id && room_id == cache_patient_info.hospital_room_id && bed_number == cache_patient_info.hospital_bed_id){
                                map_data.room[ward_id][room_id]['bed'][bed_number]['patient'] = null;
                              } else { //競合
                                let message = patient_info.patient_number+":"+patient_info.name_kana+" "+this.ward_names[ward_id]+"/"+ward_data[room_id]['name']+"/"+room_data[bed_number]['bed']['name']+"への移動が登録されました。";
                                change_messages.push(message);
                                delete cache_data[cache_ward_id][cache_room_id][cache_bed_number];
                                let index = simulation_numbers.indexOf(patient_info.hos_number);
                                simulation_numbers.splice(index, 1);
                                if(Object.keys(cache_data[cache_ward_id][cache_room_id]).length === 0){
                                  delete cache_data[cache_ward_id][cache_room_id];
                                  if(Object.keys(cache_data[cache_ward_id]).length === 0){
                                    delete cache_data[cache_ward_id];
                                    if(Object.keys(cache_data).length === 0){
                                      localApi.remove(CACHE_LOCALNAMES.WARD_MAP);
                                    }
                                  }
                                }
                              }
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            });
          });
          if(Object.keys(cache_data).length > 0){
            localApi.setObject(CACHE_LOCALNAMES.WARD_MAP, cache_data);
          } else {
            localApi.remove(CACHE_LOCALNAMES.WARD_MAP);
          }
        }
        if(map_data.room[first_ward_id] !== undefined && Object.keys(map_data.room[first_ward_id]).length > 0){
          let ward_data = map_data.room[first_ward_id];
          Object.keys(ward_data).map(frame_key=>{
            let room_data = ward_data[frame_key]['bed'];
            if(Object.keys(room_data).length > 0){
              Object.keys(room_data).map(bed_number=>{
                if(cache_data !== undefined && cache_data != null && cache_data[first_ward_id] !== undefined
                  && cache_data[first_ward_id][frame_key] !== undefined && cache_data[first_ward_id][frame_key][bed_number] !== undefined){
                  map_data.room[first_ward_id][frame_key]['bed'][bed_number]['patient'] = cache_data[first_ward_id][frame_key][bed_number];
                } else {
                  if(room_data[bed_number]['patient'] != null && simulation_numbers.includes(room_data[bed_number]['patient']['hos_number'])){
                    map_data.room[first_ward_id][frame_key]['bed'][bed_number]['patient'] = null;
                  }
                }
              });
            }
          });
        }
        let alert_messages = this.state.alert_messages;
        let alert_title = "";
        if(change_messages.length > 0){
          alert_title = "移動競合エラー";
          alert_messages = "別端末から移動が登録されたため、競合する移動を解除しました。";
          alert_messages = alert_messages+ "\n" + change_messages.join('\n');
        }
        if(this.state.confirm_type === "move_do" && alert_messages == ""){
          this.hospitalization();
        } else {
          this.setState({
            map_data,
            load_ward_map:true,
            simulation_numbers,
            alert_title,
            alert_messages,
            confirm_type:"",
          });
        }
      })
      .catch(() => {
      });
  };
  
  getDateStr=()=>{
    if(this.state.search_date == null || this.state.search_date === ""){
      return '';
    }
    let search_date = this.state.search_date;
    if(search_date instanceof Date) {
      let y = search_date.getFullYear();
      let m = ("00" + (search_date.getMonth() + 1)).slice(-2);
      let d = ("00" + search_date.getDate()).slice(-2);
      let h = ("00" + search_date.getHours()).slice(-2);
      let min = ("00" + search_date.getMinutes()).slice(-2);
      let result = y + "/" + m + "/" + d + " " + h + ":" + min;
      return result;
    }
  };

  setViewMode=(type)=>{
    if(type == null){return;}
    this.setState({view_mode:type});
  };

  getBackColor=(bed_data)=>{
    if(Object.keys(bed_data).length > 0){
      let man_count = 0;
      let woman_count = 0;
      Object.keys(bed_data).map(bed_number=>{
        if(bed_data[bed_number]['patient'] != null){
          if(bed_data[bed_number]['patient']['gender'] == 1){
            man_count++;
          } else {
            woman_count++;
          }
        }
      });

      if(man_count > woman_count){
        return "#c3e8fa";
      }
      if(man_count < woman_count){
        return "#ffd4f0";
      }
    }
    return "#F2F2F2";
  };

  viewPatientInfo = (e, patient_info, class_name, room_top, room_left) => {
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let clientY = e.clientY;
    let clientX = e.clientX;
    let datetime = formatDateLine(new Date());
    if(patient_info.is_carried_out_of_discharge == 1){
      datetime = patient_info.discharge_date.split(' ')[0];
    }
    let timeDiff = new Date(datetime).getTime() - new Date(patient_info.date_and_time_of_hospitalization.split(' ')[0]).getTime();
    if(timeDiff < 0){
      patient_info.hospital_days = "";
    } else {
      timeDiff = Math.abs(timeDiff);
      let diffDays = parseInt(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      patient_info.hospital_days = diffDays + '日';
    }
    let state_data = {};
    state_data['hoverMenu'] = {
      visible: true,
      x: clientX - 200,
      y: clientY + window.pageYOffset
    };
    state_data['patient_info'] = patient_info;
    state_data['contextMenu'] = {visible: false};
    state_data['contextCancelMenu'] = {visible: false};
    this.setState(state_data, ()=>{
      let map_area_top = document.getElementsByClassName('map-area')[0].offsetTop;
      let bed_top = document.getElementsByClassName(class_name)[0].offsetTop;
      let bed_width = document.getElementsByClassName(class_name)[0].offsetWidth;
      let bed_height = document.getElementsByClassName(class_name)[0].offsetHeight;
      let bed_left = document.getElementsByClassName(class_name)[0].offsetLeft;
      let html_obj = document.getElementsByTagName("html")[0];
      let width = html_obj.offsetWidth;
      let height_fontsize = 16;
      if(parseInt(width) < 1367){
        height_fontsize = 12.5;
      } else if(parseInt(width) < 1441){
        height_fontsize = 13;
      } else if(parseInt(width) < 1601){
        height_fontsize = 14;
      } else if(parseInt(width) < 1681){
        height_fontsize = 15;
      }
      let menu_height = document.getElementsByClassName("hover-menu")[0].offsetHeight;
      let menu_width = document.getElementsByClassName("hover-menu")[0].offsetWidth;
      let window_width = window.innerWidth;
      state_data['hoverMenu']['y'] = map_area_top + bed_top + (height_fontsize * room_top) + bed_height - menu_height;
      if (bed_left + (height_fontsize * room_left) + bed_width + menu_width + 200 > window_width) {
        state_data['hoverMenu']['x'] = bed_left + (height_fontsize * room_left) - menu_width;
      } else {
        state_data['hoverMenu']['x'] = bed_left + (height_fontsize * room_left) + bed_width;
      }
      this.setState(state_data);
    });
  };

  closeViewPatientInfo=()=>{
    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu !== undefined && hoverMenu.visible){
      this.setState({
        hoverMenu: {
          visible: false,
        }
      });
    }
  };

  getUseBedPercent=()=>{
    let ward_data = this.state.map_data.room;
    if(ward_data === undefined) return "";
    let room_info = ward_data[this.state.first_ward_id];
    if(room_info === undefined || Object.keys(room_info).length === 0) return "";
    let all_bed_count = 0;
    let all_bed_use_count = 0;
    let all_man_count = 0;
    let all_woman_count = 0;
    Object.keys(room_info).map(frame_key=>{
      let room_data = room_info[frame_key];
      if(Object.keys(room_data.bed).length > 0){
        all_bed_count += Object.keys(room_data.bed).length;
        Object.keys(room_data.bed).map(bed_number=>{
          if(room_data.bed[bed_number]['patient'] != null){
            all_bed_use_count++;
            if(room_data.bed[bed_number]['patient']['gender'] == 1){
              all_man_count++;
            } else {
              all_woman_count++;
            }
          }
        });
      }
    });
    return "稼働率 "+parseFloat((all_bed_use_count / all_bed_count)*100).toFixed(1)+"%（"+all_bed_use_count+" / "+all_bed_count+"床） 男性 "+all_man_count+"人 女性 "+all_woman_count+"人";
  };

  onDragStart = (e) => {
    if(this.state.search_date.getTime() < this.current_date_time.getTime()){
      return;
    }
    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu != undefined && hoverMenu.visible){
      this.setState({hoverMenu: {visible: false}});
    }
    if(this.state.view_mode === 'patient_select'){
      return;
    }
    let from_name= e.target.id.split(":")[0];
    let index= e.target.id.split(":")[1];
    if(from_name === "patient_list"){
      let patient_info = this.state.patient_list[index];
      if(patient_info.is_carried_out_of_hospitalization == 1){
        return;
      }
    }
    // get clipboard data
    let before_data = "";
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    }

    this.mousemove_flag = true;
    e.dataTransfer.setData("text", e.target.id );

    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    }
    e.stopPropagation();
  };

  onDropEvent = e => {
    if(this.state.search_date.getTime() < this.current_date_time.getTime()){
      return;
    }
    if(this.state.view_mode === 'patient_select'){
      return;
    }
    //移動予定患者一覧,転棟用エリア,待機エリア,ベッド枠-----ベッド枠
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let obj = e.target;
    let frame_key = "";
    let bed_number = "";
    do {
      if( obj.id != undefined && obj.id != null && obj.id != "" && obj.id.split(':')[0] === 'room'){
        let key = obj.id.split(':')[1];
        frame_key = key.split('_')[0];
        bed_number = key.split('_')[1] ;
      }
      obj = obj.parentElement;
    } while(obj.tagName.toLowerCase() !== "body");
    this.mousemove_flag = false;
    let date_and_time_of_hospitalization = "";
    let index = data.split(":")[1];
    let from_name= data.split(":")[0];
    if(from_name === ""){
      return;
    }
    let hos_number;
    let department_id;
    let start_time_classification;
    let patient_info;
    let start_date;
    if(from_name === "patient_list"){
      patient_info = this.state.patient_list[index];
      if(patient_info.is_carried_out_of_hospitalization == 1){
        return;
      }
      date_and_time_of_hospitalization = patient_info['date_and_time_of_hospitalization'];
      hos_number = patient_info['hos_number'];
      department_id = patient_info['department_id'];
      start_date = patient_info['start_date'];
      start_time_classification = patient_info['start_time_classification'];
    }
    if(from_name === "subdivision_area"){
      patient_info = this.state.subdivision_area[index];
      date_and_time_of_hospitalization = patient_info['date_and_time_of_hospitalization'];
      hos_number = patient_info['hos_number'];
      department_id = patient_info['department_id'];
      start_time_classification = patient_info['start_time_classification'];
    }
    if(from_name === "waiting_area"){
      patient_info = this.state.waiting_area[index];
      date_and_time_of_hospitalization = patient_info['date_and_time_of_hospitalization'];
      hos_number = patient_info['hos_number'];
      department_id = patient_info['department_id'];
      start_time_classification = patient_info['start_time_classification'];

    }
    if(from_name === "map_data"){
      let from_frame_key = index.split('_')[0];
      let from_bed_number = index.split('_')[1];
      patient_info = this.state.map_data.room[this.state.first_ward_id][from_frame_key]['bed'][from_bed_number]['patient'];
      if(patient_info.go_out !== undefined && patient_info.go_out){
        return;
      }
      date_and_time_of_hospitalization = patient_info.date_and_time_of_hospitalization;
      hos_number = patient_info.hos_number;
      department_id = patient_info['department_id'];
      start_time_classification = patient_info['start_time_classification'];
    }
    let simulation_numbers = this.state.simulation_numbers;
    let number_index = simulation_numbers.indexOf(hos_number);
    if(number_index === -1){
      if(simulation_numbers.length === 5){
        this.setState({alert_messages:"シミュレーションの移動は一度に5名までです。"});
        return;
      }
    }
    this.openModalStatus = 1;
    this.setState({
      openMoveHospitalization:from_name === "patient_list" ? false : true,
      openDoHospitalization:from_name === "patient_list" ? true : false,
      hos_number,
      from_data:data,
      date_and_time_of_hospitalization,
      frame_key,
      frame_name:this.state.map_data.room[this.state.first_ward_id][frame_key]['name'],
      bed_number,
      bed_name:this.state.map_data.room[this.state.first_ward_id][frame_key]['bed'][bed_number]['bed']['name'],
      department_id,
      start_date,
      start_time_classification,
      patient_info
    });
  };

  moveBed=(param)=>{
    let _state = {};
    let simulation_numbers = this.state.simulation_numbers;
    let from_name= this.state.from_data.split(":")[0];
    let index = this.state.from_data.split(":")[1];
    let from_data = null;
    let map_data = this.state.map_data;
    if(from_name === "patient_list"){
      let patient_list = [];
      this.state.patient_list.map((patient, key)=>{
        if(key != index){
          patient_list.push(patient)
        } else {
          from_data = patient;
          simulation_numbers.push(patient.hos_number);
        }
      });
      _state.patient_list = patient_list;
      from_data.start_time_classification = param.start_time_classification;
      from_data.hospitalization_route = param.hospitalization_route;
      from_data.hospitalization_identification = param.hospitalization_identification;
      from_data.start_time_name = param.start_time_name;
      from_data.route_name = param.route_name;
      from_data.identification_name = param.identification_name;
    }
    if(from_name === "subdivision_area"){// 転棟用エリア
      let subdivision_area = [];
      this.state.subdivision_area.map((patient, key)=>{
        if(key != index){
          subdivision_area.push(patient)
        } else {
          from_data = patient;
        }
      });
      _state.subdivision_area = subdivision_area;
    }
    if(from_name === "waiting_area"){//待機エリア
      let waiting_area = [];
      this.state.waiting_area.map((patient, key)=>{
        if(key != index){
          waiting_area.push(patient)
        } else {
          from_data = patient;
        }
      });
      _state.waiting_area = waiting_area;
    }
    if(from_name === "map_data"){
      let from_frame_key = index.split('_')[0];
      let from_bed_number = index.split('_')[1];
      from_data = map_data.room[this.state.first_ward_id][from_frame_key]['bed'][from_bed_number]['patient'];
      delete map_data.room[this.state.first_ward_id][from_frame_key]['bed'][from_bed_number]['patient'];
      let number_index = simulation_numbers.indexOf(from_data.hos_number);
      if(number_index === -1){
        simulation_numbers.push(from_data.hos_number);
      }
    }
    from_data.date_and_time_of_hospitalization = param.date_and_time_of_hospitalization;
    from_data.start_date = param.start_date;
    from_data.department_id = param.department_id;
    if(param.department_name !== undefined){
      from_data.department_name = param.department_name;
    }
    from_data.doctor_code = param.doctor_code;
    from_data.doctor_name = param.doctor_name;
    from_data.ward_name = param.ward_name;
    from_data.room_name = param.room_name;
    from_data.bed_name = param.bed_name;
    from_data.is_seal_print = param.is_seal_print;
    map_data.room[this.state.first_ward_id][this.state.frame_key]['bed'][this.state.bed_number]['patient'] = from_data;
    let cache_data = localApi.getObject(CACHE_LOCALNAMES.WARD_MAP);
    if(cache_data === undefined || cache_data == null){
      cache_data = {};
    }
    if(cache_data[this.state.first_ward_id] === undefined){
      cache_data[this.state.first_ward_id] = {};
    }
    if(cache_data[this.state.first_ward_id][this.state.frame_key] === undefined){
      cache_data[this.state.first_ward_id][this.state.frame_key] = {};
    }
    if(cache_data[this.state.first_ward_id][this.state.frame_key][this.state.bed_number] === undefined){
      cache_data[this.state.first_ward_id][this.state.frame_key][this.state.bed_number] = {};
    }
    cache_data[this.state.first_ward_id][this.state.frame_key][this.state.bed_number] = from_data;
    localApi.setObject(CACHE_LOCALNAMES.WARD_MAP, cache_data);
    _state.map_data = map_data;
    _state.simulation_numbers = simulation_numbers;
    _state.openMoveHospitalization = false;
    _state.openDoHospitalization = false;
    this.openModalStatus = 0;
    this.setState(_state);
  };

  onDropSubdivision = e => {
    if(this.state.search_date.getTime() < this.current_date_time.getTime()){
      return;
    }
    if(this.state.view_mode === 'patient_select'){
      return;
    }
    //ベッド枠-----転棟用エリア
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let from_name= data.split(":")[0];
    this.mousemove_flag = false;
    if(from_name !== "map_data"){
      return;
    }
    let key = data.split(":")[1];
    let frame_key = key.split('_')[0];
    let bed_number = key.split('_')[1];
    let subdivision_area = this.state.subdivision_area;
    let map_data = this.state.map_data;
    let patient = map_data.room[this.state.first_ward_id][frame_key]['bed'][bed_number]['patient'];
    if(patient.go_out !== undefined && patient.go_out){
      return;
    }
    let simulation_numbers = this.state.simulation_numbers;
    let number_index = simulation_numbers.indexOf(patient.hos_number);
    if(number_index === -1){
      if(simulation_numbers.length === 5){
        this.setState({alert_messages:"シミュレーションの移動は一度に5名までです。"});
        return;
      }
      simulation_numbers.push(patient.hos_number);
    }
    subdivision_area.push(patient);
    map_data.room[this.state.first_ward_id][frame_key]['bed'][bed_number]['patient'] = null;
    let cache_data = localApi.getObject(CACHE_LOCALNAMES.WARD_MAP);
    if(cache_data !== undefined && cache_data != null && cache_data[this.state.first_ward_id] !== undefined && cache_data[this.state.first_ward_id][frame_key] !== undefined && cache_data[this.state.first_ward_id][frame_key][bed_number] !== undefined){
      delete cache_data[this.state.first_ward_id][frame_key][bed_number];
      localApi.setObject(CACHE_LOCALNAMES.WARD_MAP, cache_data);
    }
    this.setState({
      subdivision_area,
      map_data,
      simulation_numbers,
    });
  };

  onDropWaiting = e => {
    if(this.state.search_date.getTime() < this.current_date_time.getTime()){
      return;
    }
    if(this.state.view_mode === 'patient_select'){
      return;
    }
    //ベッド枠-----待機エリア
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let from_name= data.split(":")[0];
    this.mousemove_flag = false;
    if(from_name !== "map_data"){
      return;
    }
    let key = data.split(":")[1];
    let frame_key = key.split('_')[0];
    let bed_number = key.split('_')[1];
    let waiting_area = this.state.waiting_area;
    let map_data = this.state.map_data;
    let patient = map_data.room[this.state.first_ward_id][frame_key]['bed'][bed_number]['patient'];
    if(patient.go_out !== undefined && patient.go_out){
      return;
    }
    let simulation_numbers = this.state.simulation_numbers;
    let number_index = simulation_numbers.indexOf(patient.hos_number);
    if(number_index === -1){
      if(simulation_numbers.length === 5){
        this.setState({alert_messages:"シミュレーションの移動は一度に5名までです。"});
        return;
      }
      simulation_numbers.push(patient.hos_number);
    }
    waiting_area.push(patient);
    map_data.room[this.state.first_ward_id][frame_key]['bed'][bed_number]['patient'] = null;
    let cache_data = localApi.getObject(CACHE_LOCALNAMES.WARD_MAP);
    if(cache_data !== undefined && cache_data != null && cache_data[this.state.first_ward_id] !== undefined && cache_data[this.state.first_ward_id][frame_key] !== undefined && cache_data[this.state.first_ward_id][frame_key][bed_number] !== undefined){
      delete cache_data[this.state.first_ward_id][frame_key][bed_number];
      if(Object.keys(cache_data[this.state.first_ward_id][frame_key]).length === 0){
        delete cache_data[this.state.first_ward_id][frame_key];
        if(Object.keys(cache_data[this.state.first_ward_id]).length === 0){
          delete cache_data[this.state.first_ward_id];
          if(Object.keys(cache_data).length === 0){
            cache_data = null;
          }
        }
      }
      localApi.setObject(CACHE_LOCALNAMES.WARD_MAP, cache_data);
    }
    this.setState({
      waiting_area,
      map_data,
      simulation_numbers,
    });
  };

  onDragOver = (e) => {
    if(this.state.search_date.getTime() < this.current_date_time.getTime()){
      return;
    }
    e.preventDefault();
  };

  closeModal=(act=null, message=null)=>{
    this.setState({
      openMoveHospitalization:false,
      openInputInformationDoHospital:false,
      isOpenNurseCourseSeatModal:false,
      isOpenStateBatchRegist:false,
      isOpenProgressChart:false,
      isOpenPatientsSchedule:false,
      isOpenMovePlanPatientList:false,
      isOpenSelectPatientModal:false,
      isOpenKarteModeModal:false,
      isOpenBedControl:false,
      openDoHospitalization:false,
      openHospitalPatientHistory:false,
      openSetBedBackgroundModal:false,
      isOpenSelectDoctor:false,
      alert_messages:(act == "register" && message != null) ? message : "",
      alert_title:"",
      confirm_message:"",
      confirm_title:"",
    }, ()=>{
      if(act === "register"){
        this.searchWardBedPatientInfo();
      }
    });
    this.openModalStatus = 0;
  };

  getFontColor=(patient_info)=>{
    if(this.state.simulation_numbers.includes(patient_info.hos_number)){
      return "#0067C0";
    }
    if(patient_info.go_out !== undefined && patient_info.go_out){
      return "#008000";
    }
    if(patient_info['bed_color'] != undefined){
      if(this.state.emphasis_mode == 2){
        if(patient_info['bed_color']['my_charge'] != undefined && patient_info['bed_color']['my_charge']['font_color'] != undefined){
          return patient_info['bed_color']['my_charge']['font_color'];
        } else if(patient_info['bed_color']['color'] != undefined && patient_info['bed_color']['color']['font_color'] != undefined){
          return patient_info['bed_color']['color']['font_color'];
        }
      } else {
        if(patient_info['bed_color']['color'] != undefined && patient_info['bed_color']['color']['font_color'] != undefined){
          return patient_info['bed_color']['color']['font_color'];
        }
      }
    }
    return "";
  };

  confirmSave=()=>{
    if(this.state.view_mode === "patient_select" || this.state.simulation_numbers.length === 0){return;}
    let cache_data = localApi.getObject(CACHE_LOCALNAMES.WARD_MAP);
    if(cache_data === undefined || cache_data == null || Object.keys(cache_data).length === 0){
      return;
    }
    if(this.state.subdivision_area.length > 0 || this.state.waiting_area.length > 0){
      this.openModalStatus = 1;
      this.setState({alert_messages:"転棟用エリアまたは待機エリアに患者が残っています。"});
      return;
    }
    this.setState({
      confirm_message:"移動を実施しますか？",
      confirm_type:"move_do",
      confirm_title:"移動実施確認"
    });
  };

  hospitalization=async()=>{
    this.setState({
      complete_message:"移動実施中",
      confirm_message:"",
      confirm_type:"",
    });
    let cache_data = localApi.getObject(CACHE_LOCALNAMES.WARD_MAP);
    let path = "/app/api/v2/ward/do/hospitalization";
    let post_data = {
      data:cache_data,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let alert_messages = "";
        let simulation_numbers = this.state.simulation_numbers;
        if(res.error_message !== undefined){
          alert_messages = res.error_message;
        } else {
          alert_messages = res.alert_message;
          localApi.remove(CACHE_LOCALNAMES.WARD_MAP);
          simulation_numbers = [];
        }
        this.openModalStatus = 1;
        this.setState({
          complete_message:"",
          alert_messages,
          simulation_numbers,
        }, ()=>{
          this.searchWardBedPatientInfo();
        });
      })
      .catch(() => {
        this.setState({complete_message:""});
      });
  };

  confirmMoveCancel=()=>{
    if(this.state.view_mode === "patient_select" || this.state.simulation_numbers.length === 0){return;}
    this.setState({
      confirm_message:"移動を解除しますか？",
      confirm_type:"cancel_simulation",
    });
  };

  confirmOk=async()=>{
    if(this.state.confirm_type === "move_do"){
      await this.searchWardBedPatientInfo();
    }
    if(this.state.confirm_type === "cancel_simulation"){
      this.simulationCancel();
    }
    if(this.state.confirm_type === "cancel_discharge" || this.state.confirm_type === "cancel_move" || this.state.confirm_type === "cancel_hospital"){
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.openModalStatus = 1;
        this.setState({isOpenSelectDoctor: true});
        return;
      } else {
        this.cancelAction(this.state.confirm_type);
      }
    }
  };

  simulationCancel=()=>{
    localApi.remove(CACHE_LOCALNAMES.WARD_MAP);
    this.setState({
      confirm_message:"",
      simulation_numbers:[],
      subdivision_area:[],
      waiting_area:[],
    }, ()=>{
      this.searchWardBedPatientInfo();
    });
  };

  handleClick=(e, patient_info, frame_name, bed_name)=>{
    if(this.state.simulation_numbers.includes(patient_info['hos_number'])){
      return;
    }
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
        .getElementById("map_area")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: {visible: false}
          });
          document
            .getElementById("map_area")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let last_hospital_view = false;
      if(this.state.search_date.getTime() < this.current_date_time.getTime()){
        last_hospital_view = true;
      }
      let set_back_color_flag = false;
      if (this.context.$canDoAction(this.context.FEATURES.WARD_MAP_BED_BACKGROUND,this.context.AUTHS.READ)) {
        set_back_color_flag = true;
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          patient_info,
          last_hospital_view,
          set_back_color_flag
        },
        frame_name,
        bed_name,
        contextCancelMenu: {visible: false},
        hoverMenu: {visible: false}
      })
    }
  };
  
  checkEnableHospitalRecord=async(patient_info)=>{
    let path = "/app/api/v2/ward/check/enable_record";
    let post_data = {
      patient_id:patient_info.patient_id,
      hos_detail_number:patient_info.id
    };
    let edit_flag = 0;
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        edit_flag = res.edit_flag;
      })
      .catch(() => {
      });
    if(edit_flag){
      let confirm_message = "";
      let confirm_type = "";
      let confirm_title = "";
      if(patient_info.movement_name == "入院済み"){
        confirm_message = "入院実施を取り消しますか？";
        confirm_type = "cancel_hospital";
        confirm_title = "入院取り消し確認";
      }
      if(patient_info.movement_name == "転入済み"){
        confirm_message = "移動を取り消しますか？";
        confirm_type = "cancel_move";
        confirm_title = "移動取り消し確認";
      }
      if(patient_info.movement_name == "退院済み"){
        confirm_message = "退院実施を取り消しますか？";
        confirm_type = "cancel_discharge";
        confirm_title = "退院取り消し確認";
      }
      this.setState({
        confirm_message,
        confirm_type,
        confirm_title,
        patient_info
      });
    } else {
      this.setState({
        alert_title: "移動エラー",
        alert_messages: "この患者の最後の移動内容ではないため、取り消しできません。",
      });
    }
  }

  contextMenuAction = (modal_type, patient_info) => {
    if(modal_type === "cancel_act"){
      this.checkEnableHospitalRecord(patient_info);
    } else if(modal_type == "go_karte") {
      this.goKarte(patient_info);
    } else if(modal_type == "go_nurse_document") {
      let nurse_patient_info = {
        patientInfo:patient_info.patientInfo,
        detailedPatientInfo:patient_info.detailedPatientInfo,
        hos_number:patient_info.hos_number,
      };
      localApi.setObject("nurse_patient_info", nurse_patient_info);
      localApi.remove("nurse_record");
      localApi.remove("nursing_history");
      this.props.history.replace("/patients/"+patient_info.patient_id+"/nursing_document");
    } else if(modal_type == "view_history") {
      this.openModalStatus = 1;
      this.setState({
        patient_info,
        openHospitalPatientHistory:true,
      });
    } else if(modal_type == "set_bed_color"){
      this.openModalStatus = 1;
      this.setState({
        patient_info,
        openSetBedBackgroundModal:true,
      });
    } else {
      this.openModalStatus = 1;
      this.setState({
        modal_type,
        patient_info,
        openInputInformationDoHospital:true,
      });
    }
  };

  goKarte = async(patient_info) => {
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if (item.system_patient_id == patient_info.patient_id) {
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
        systemPatientId:patient_info.patient_id,
        diagnosis_code:patient_info.department_id,
        diagnosis_name:patient_info.department_name,
        department:patient_info.department_name,
      };
      this.openModalStatus = 1;
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+patient_info.patient_id+"/"+page);
    }
  }

  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.closeModal();
  };

  goToUrlFuncByPatientId = (patient_id) => {
    this.goToUrlFunc("/patients/"+patient_id+"/soap");
  };

  handleCancelClick=(e, patient_info)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextCancelMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextCancelMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("patient-list")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextCancelMenu: {visible: false}
          });
          document
            .getElementById("patient-list")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let cancel_menu_flag = false;
      let going_in_menu_flag = false;
      let discharge_menu_flag = false;
      if(patient_info.detail_enable == 1){
        if(patient_info.movement_name == "帰院予定"){
          if(this.context.$canDoAction(this.context.FEATURES.OUT_RETURN,this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.OUT_RETURN,this.context.AUTHS.REGISTER_PROXY)) {
            going_in_menu_flag = true;
          }
        }
        if(patient_info.movement_name == "退院予定"){
          if (this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DONE,this.context.AUTHS.DONE_OREDER)) {
            discharge_menu_flag = true;
          }
        }
        if(patient_info.movement_name == "入院済み"){
          if (this.context.$canDoAction(this.context.FEATURES.HOSPITAL_DONE,this.context.AUTHS.DELETE) || this.context.$canDoAction(this.context.FEATURES.HOSPITAL_DONE,this.context.AUTHS.DELETE_PROXY)) {
            cancel_menu_flag = true;
          }
        }
        if(patient_info.movement_name == "転入済み"){
          if(this.context.$canDoAction(this.context.FEATURES.MOVE_WARD,this.context.AUTHS.DELETE) || this.context.$canDoAction(this.context.FEATURES.MOVE_WARD,this.context.AUTHS.DELETE_PROXY)) {
            cancel_menu_flag = true;
          }
        }
        if(patient_info.movement_name == "退院済み"){
          if (this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DONE,this.context.AUTHS.DELETE) || this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DONE,this.context.AUTHS.DELETE_PROXY)) {
            cancel_menu_flag = true;
          }
        }
      }
      this.setState({
        contextCancelMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          patient_info,
          cancel_menu_flag,
          going_in_menu_flag,
          discharge_menu_flag
        },
        contextMenu: {visible: false},
        hoverMenu: {visible: false}
      })
    }
  };

  cancelAction=async(type)=>{
    this.setState({
      complete_message:"取り消し中",
      confirm_message:"",
      confirm_type:"",
      confirm_title:"",
    });
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let path = "/app/api/v2/ward/cancel_do";
    let post_data = {
      type,
      hos_number:this.state.patient_info.hos_number,
      hos_detail_id:this.state.patient_info.id,
      doctor_code:authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      doctor_name:authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let alert_messages = "";
        if(res.error_message === undefined){
          alert_messages = res.alert_message;
          if(type == "cancel_discharge"){
            let patientInfo = karteApi.getPatient(this.state.patient_info.patient_id);
            if(patientInfo != undefined && patientInfo != null){
              patientInfo.is_hospital = 1;
              patientInfo.karte_status = {code: 1, name: '入院'};
              karteApi.setPatient(this.state.patient_info.patient_id, JSON.stringify(patientInfo));
            }
          }
        } else {
          alert_messages = res.error_message;
        }
        this.openModalStatus = 1;
        this.setState({
          complete_message:"",
          alert_messages,
        }, ()=>{
          if(res.error_message === undefined){
            this.searchWardBedPatientInfo();
          }
        });
      })
      .catch(() => {
        this.setState({complete_message:""});
      });
  }

  openNurseRequireModal = () => {
    this.setState({
      isOpenNurseRequireModal:true,
    })
  }

  closeNurseRequireModal = () => {
    this.setState({
      isOpenNurseRequireModal:false,
    })
  }

  openNursingCourse = async () => {
    if (this.state.selectedPatients.length < 1) {
      this.openModalStatus = 1;
      this.setState({alert_messages:"患者を選択してください。"});
      return;
    }

    // K142 ワークシート 種類選択無しモードの追加
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let nursing_worksheet_mode_selectable = "ON";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
     if(initState.conf_data.nursing_worksheet_mode_selectable !== undefined){
       nursing_worksheet_mode_selectable = initState.conf_data.nursing_worksheet_mode_selectable;
     }     
    }

    if (nursing_worksheet_mode_selectable == "on") {
      await this.getWorkSheetMaster();
    }

    this.openModalStatus = 1;
    this.setState({
      isOpenNurseCourseSeatModal: true,
      nursing_worksheet_mode_selectable: nursing_worksheet_mode_selectable
    });
  }

  getWorkSheetMaster = async() => {
    let path = "/app/api/v2/ward/get_work_sheet_master";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let work_sheet_master = this.state.work_sheet_master;
        if(res.work_sheet_master.length > 0){
          work_sheet_master = res.work_sheet_master;
        }
        this.setState({
          work_sheet_master,
        });
      })
      .catch(() => {
      
      });
  };

  openStateBatchRegist = () => {
    this.openModalStatus = 1;
    this.setState({
      isOpenStateBatchRegist: true,
    });
  }

  getSpaceBlock=(data)=>{
    let html_data = [];
    if(data.length < 3){
      for(let index = 0; index < (3 - data.length); index++){
        html_data.push(<div className={'bottom-border'} style={{height:this.block_size_y+'rem'}}>&nbsp;</div>);
      }
    }
    return html_data;
  }

  selectPatient = (patient_info) => {
    if (this.state.view_mode != 'patient_select') return;
    let selectedPatients = [];
    let exist_flag = false;
    if(this.state.selectedPatients.length > 0){
      this.state.selectedPatients.map((item)=>{
        if (item.patient_number == patient_info.patient_number) {
          exist_flag = true;
        } else {
          selectedPatients.push(item);
        }
      });
    }
    if (!exist_flag) {
      selectedPatients.push(patient_info);
    }
    this.setState({selectedPatients});
  }

  isSelectedPatient = (patient_info) => {
    let result = false;
    let selectedPatients = this.state.selectedPatients;
    if(selectedPatients.length < 1) return result;

    selectedPatients.map(item=>{
      if (item.patient_number == patient_info.patient_number) {
        result = true;
      }
    });

    return result;
  }

  openProgressChart=()=>{
    this.openModalStatus = 1;
    this.setState({
      isOpenProgressChart:true,
    });
  }

  openPatientsSchedule=()=>{
    this.openModalStatus = 1;
    this.setState({
      isOpenPatientsSchedule:true,
    });
  }

  openMovePlanPatientList=()=>{
    this.openModalStatus = 1;
    this.setState({
      isOpenMovePlanPatientList:true,
    });
  }
  
  gotoSoap = (patient_id) => {
    this.props.history.replace(`/patients/${patient_id}/soap`);
  }

  gotoLastPatientSoap = () => {
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

  getHospitalCategory=(hos_data, type)=>{
    let background = "";
    if(type == "backcolor"){
      if(this.state.searched_hos_numbers.length > 0){
        this.state.searched_hos_numbers.map(recorde=>{
          if(recorde.hos_number == hos_data.hos_number){
            background = "#ef810f";
          }
        });
      }
    }
    if(hos_data.movement_name == "入院予定"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name)+"　へ入院予定";
      }
    }
    if(hos_data.movement_name == "主治医変更済み"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name);
      }
      if(background == "" && type == "backcolor"){
        background = "#F2F2F2";
      }
    }
    if(hos_data.movement_name == "入院済み"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name)+"　へ入院済み";
      }
      if(background == "" && type == "backcolor"){
        background = "#F2F2F2";
      }
    }
    if(hos_data.movement_name == "転入済み"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name)+"　へ転入済み";
      }
      if(background == "" && type == "backcolor"){
        background = "#F2F2F2";
      }
    }
    if(hos_data.movement_name == "外泊実施"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name)+"　から外泊実施";
      }
      if(background == "" && type == "backcolor"){
        background = "#F2F2F2";
      }
    }
    if(hos_data.movement_name == "帰院予定"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name)+"　へ帰院予定";
      }
    }
    if(hos_data.movement_name == "帰院済み"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name)+"　へ帰院済み";
      }
      if(background == "" && type == "backcolor"){
        background = "#F2F2F2";
      }
    }
    if(hos_data.movement_name == "退院予定"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name)+"　から退院予定";
      }
    }
    if(hos_data.movement_name == "退院済み"){
      if(type == "bed"){
        return hos_data.ward_name+"/"+hos_data.room_name+"/"+(hos_data.bed_name == null ? "病床未定" : hos_data.bed_name)+"　から退院済み";
      }
      if(background == "" && type == "backcolor"){
        background = "#F2F2F2";
      }
    }
    if(type == "backcolor"){
      return background;
    }
  }

  setAutoReload = (name, value) => {
    if(name == "auto_reload"){
      this.setState({auto_reload:value});
    }
  };

  searchWardBedPatientInfo=async()=>{
    await this.getWardPatientList();
    await this.getWardBedInfo();
  }

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }

  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.setState({isOpenSelectDoctor:false}, ()=>{
      this.cancelAction(this.state.confirm_type);
    })
  }
  
  getBedBackColor=(bed_color, main_doctor_code)=>{
    let background = "";
    if(this.state.emphasis_mode == 1 && main_doctor_code != undefined){
      let code_index = 0;
      let main_doctor_codes = this.state.map_data.main_doctor_codes;
      let doctor_color = this.state.map_data.doctor_color;
      if(Object.keys(main_doctor_codes).length > 0){
        Object.keys(main_doctor_codes).map(doctor_code=>{
          if(main_doctor_code == doctor_code){
            background = (doctor_color != null && doctor_color[code_index] != undefined && doctor_color[code_index] != null) ? doctor_color[code_index] : "";
          }
          code_index++;
        })
      }
    } else if(bed_color != undefined){
      if(this.state.emphasis_mode == 2){
        if(bed_color['my_charge'] != undefined && bed_color['my_charge']['bg_color'] != undefined && bed_color['my_charge']['bg_color'] != null){
          background = bed_color['my_charge']['bg_color'];
        } else if(bed_color['color'] != undefined && bed_color['color']['bg_color'] != undefined && bed_color['color']['bg_color'] != null){
          background = bed_color['color']['bg_color'];
        }
      } else if(bed_color['color'] != undefined && bed_color['color']['bg_color'] != undefined && bed_color['color']['bg_color'] != null){
        background = bed_color['color']['bg_color'];
      }
    }
    return background;
  }
  
  setEmphasisMode = (key, e) => {
    this.setState({[key]:parseInt(e.target.id)});
  }
  
  get_title_pdf = async () => {
    let server_time = await getServerTime();
    let title = "病棟マップ_";
    title = title + formatDateLine(this.state.search_date).split('-').join('') + formatTimeIE(this.state.search_date).split(':').join('') + '_';
    title = title + (server_time.split(' ')[0]).split('/').join('');
    return title+".pdf";
  }
  
  printPdf=async()=>{
    if((this.state.load_ward_map === false) || (this.state.first_ward_id === 0) || (this.state.view_mode === 'patient_move') || (this.state.simulation_numbers.length > 0)){return;}
    this.setState({complete_message:"印刷中"});
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/ward/print/ward_map";
    let print_data = {
      view_complete:this.state.view_complete,
      ward_master:this.ward_master,
      first_ward_id:this.state.first_ward_id,
      search_date:formatDateLine(this.state.search_date) + " " + formatTimeIE(this.state.search_date),
      emphasis_mode:this.emphasis_mode,
      emphasis_mode_id:this.state.emphasis_mode,
      patient_list:this.state.patient_list,
      map_data:this.state.map_data,
    };
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
        this.setState({complete_message:""});
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', pdf_file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch(() => {
        this.setState({complete_message:""});
      })
  }

  render() {
    let list_names = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け ","病棟マップ", "訪問診療予定"];
    var list_urls = ["/patients", "/patients_search", "/hospital_ward_list", "/emergency_patients", "/reservation_list", "", "/hospital_ward_map", "/visit_schedule_list"];
    const menu_list_ids = ["1001","1002","1003","1006","1004","","1007", "1005"];
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth;
    let last_hospital_view = false;
    if(this.state.search_date.getTime() < this.current_date_time.getTime()){
      last_hospital_view = true;
    }
    let bed_map_color = this.state.bed_map_color;
    return (
      <PatientsWrapper>
        <div className="title-area flex">
          <div className={'title'}>病棟マップ</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10)){
                  return(
                    <>
                      {item == "病棟マップ" ? (
                        <Button className="tab-btn button active-btn">{item}</Button>
                      ):(
                        <Button className="tab-btn button" onClick={()=>this.goToPage(list_urls[index])}>{item}</Button>
                      )}
                    </>
                  )
                } else {
                  return(
                    <>
                      <Button className="disabled button">{item}</Button>
                    </>
                  )
                }
              }
            })}
            {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
              <Button className="tab-btn button close-back-btn" onClick={this.gotoLastPatientSoap}>閉じる</Button>
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
          <div>
            <div className={'flex'} style={{height:"2rem"}}>
              <div className={'select-ward'}>
                <SelectorWithLabel
                  title="病棟"
                  options={this.ward_master}
                  getSelect={this.setWard}
                  departmentEditCode={this.state.first_ward_id}
                />
              </div>
              <label className={'date-label'}>日付</label>
              <Button type="common" onClick={this.selectToday.bind(this)}>本日</Button>
              <Button type="common" className={'ml-05rem ' + (this.state.view_mode === "patient_move" ? 'disable-btn' : "")} onClick={()=>this.toggle()}>日付指定</Button>
              <div className={'select-date'}>
                <DatePicker
                  ref={(r) => {this.component = r;}}
                  locale="ja"
                  selected={this.state.search_date}
                  onChange={this.getSearchDate.bind(this)}
                  dateFormat="yyyy/MM/dd HH:mm"
                  timeCaption="時間"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={10}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                />
              </div>
              <div className={'search-date'}>{this.getDateStr()}</div>
              <div className="select-emphasis-mode">
                <SelectorWithLabel
                  options={this.emphasis_mode}
                  title="強調モード"
                  getSelect={this.setEmphasisMode.bind(this,"emphasis_mode")}
                  departmentEditCode={this.state.emphasis_mode}
                />
              </div>
            </div>
            <div className={'flex'} style={{marginTop:"0.5rem"}}>
              <label className={'map-title'} style={{marginLeft:"0.5rem"}}>{this.state.view_mode === 'patient_select' ? "患者選択" : "移動実施"}</label>
              {/*<button style={{marginLeft:"0.5rem"}}>機能別看護</button>*/}
              {/*<button style={{marginLeft:"0.5rem"}}>チーム</button>*/}
              {/*<button style={{marginLeft:"0.5rem"}}>プライマリ</button>*/}
              {/*<button style={{marginLeft:"0.5rem"}}>当日受持</button>*/}
              {/*<button onClick={this.getWardPatientList.bind(this, 'urgency')} style={{marginLeft:"0.5rem"}}>緊急指示</button>*/}
            </div>
            <div className={'flex'} style={{marginTop:"0.5rem", marginLeft:"0.5rem"}}>
              <Button
                type="common"
                className={(this.state.view_mode === 'patient_select' ? 'active-btn ' : "") + (this.state.simulation_numbers.length > 0 ? 'disable-btn' : '')}
                onClick={this.setViewMode.bind(this, 'patient_select')}
              >患者選択</Button>
              <Button
                type="common"
                tooltip={last_hospital_view ? '過去の内容を表示しているため移動実施できません。' : ''}
                tooltip_position={'bottom'}
                className={'ml-05rem ' + (this.state.view_mode === 'patient_move' ? 'active-btn' : "")}
                onClick={this.setViewMode.bind(this, last_hospital_view ? null : 'patient_move')}>移動実施</Button>
              <Button type="common" className={'ml-05rem ' + (this.state.simulation_numbers.length > 0 ? 'active-btn red-color' : "")}>シミュレーション中</Button>
              <Button type="common" className={'ml-05rem ' + ((this.state.view_mode === "patient_select" || this.state.simulation_numbers.length === 0) ? 'disable-btn' : "")} onClick={this.confirmMoveCancel}>解除</Button>
              <Button type="common" className={'ml-05rem ' + ((this.state.view_mode === "patient_select" || this.state.simulation_numbers.length === 0) ? 'disable-btn' : "")} onClick={this.confirmSave}>実施</Button>
              {bed_map_color != null && (
                <>
                  {(this.state.emphasis_mode === 0 || this.state.emphasis_mode === 2) && (
                    <>
                      {(bed_map_color.order_color !== undefined && bed_map_color.order_color != null) && (
                        <>
                          {(bed_map_color.order_color.bg_color !== undefined && bed_map_color.order_color.bg_color != null && bed_map_color.order_color.bg_color != "") && (
                            <>
                              <div
                                className={'color-box'}
                                style={{backgroundColor:bed_map_color.order_color.bg_color, borderColor:((bed_map_color.order_color.border_color !== undefined && bed_map_color.order_color.border_color != null) ? bed_map_color.order_color.border_color : "")}}
                              >
                                {(bed_map_color.order_color.sample_box_text !== undefined && bed_map_color.order_color.sample_box_text != null && bed_map_color.order_color.sample_box_text != "") ?
                                  bed_map_color.order_color.sample_box_text : ""}
                              </div>
                              {(bed_map_color.order_color.caption !== undefined && bed_map_color.order_color.caption != null && bed_map_color.order_color.caption != "") && (
                                <div className={'div-title'}>{bed_map_color.order_color.caption}</div>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {(bed_map_color.move_color !== undefined && bed_map_color.move_color != null) && (
                        <>
                          {(bed_map_color.move_color.bg_color !== undefined && bed_map_color.move_color.bg_color != null && bed_map_color.move_color.bg_color != "") && (
                            <>
                              <div
                                className={'color-box'}
                                style={{backgroundColor:bed_map_color.move_color.bg_color, borderColor:((bed_map_color.move_color.border_color !== undefined && bed_map_color.move_color.border_color != null) ? bed_map_color.move_color.border_color : "")}}
                              >
                                {(bed_map_color.move_color.sample_box_text !== undefined && bed_map_color.move_color.sample_box_text != null && bed_map_color.move_color.sample_box_text != "") ?
                                  bed_map_color.move_color.sample_box_text : ""}
                              </div>
                              {(bed_map_color.move_color.caption !== undefined && bed_map_color.move_color.caption != null && bed_map_color.move_color.caption != "") && (
                                <div className={'div-title'}>{bed_map_color.move_color.caption}</div>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {(this.state.emphasis_mode === 2) && (
                        <>
                          {(bed_map_color.my_charge.bg_color !== undefined && bed_map_color.my_charge.bg_color != null && bed_map_color.my_charge.bg_color != "") && (
                            <>
                              <div
                                className={'color-box'}
                                style={{backgroundColor:bed_map_color.my_charge.bg_color, borderColor:((bed_map_color.my_charge.border_color !== undefined && bed_map_color.my_charge.border_color != null) ? bed_map_color.my_charge.border_color : "")}}
                              >
                                {(bed_map_color.my_charge.sample_box_text !== undefined && bed_map_color.my_charge.sample_box_text != null && bed_map_color.my_charge.sample_box_text != "") ?
                                  bed_map_color.my_charge.sample_box_text : ""}
                              </div>
                              {(bed_map_color.my_charge.caption !== undefined && bed_map_color.my_charge.caption != null && bed_map_color.my_charge.caption != "") && (
                                <div className={'div-title'}>{bed_map_color.my_charge.caption}</div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            {/*<div className={'flex'}>
              <button className={'w120p'} style={{marginLeft:"0.5rem"}}>経過表印刷</button>
              <button className={'w120p'} style={{marginLeft:"0.5rem"}} onClick={this.openProgressChart}>経過表</button>
              <button className={'w120p'} style={{marginLeft:"0.5rem"}} onClick={this.openPatientsSchedule}>患者ｽｹｼﾞｭｰﾙ</button>
            </div>*/}
            {/*<div className={'flex'} style={{marginTop:"0.5rem"}}>*/}
            <div className={'flex'}>
              <Button type="common" className={'w120p'} onClick={this.openStateBatchRegist}>状態一括登録</Button>
              <Button type="common" className={'w120p ml-05rem'} onClick={this.openNursingCourse}>看護ﾜｰｸｼｰﾄ</Button>
              <Button type="common" className={'w120p ml-05rem'} onClick={this.openMovePlanPatientList}>移動予定一覧</Button>
              {/*<button className={'w120p'} style={{marginLeft:"0.5rem"}}>指示受け一覧</button>*/}
              {/*<button className={'w120p'} style={{marginLeft:"0.5rem"}}>ﾊﾞｲﾀﾙ一括</button>*/}
            </div>
            <div className={'flex'} style={{marginTop:"0.5rem"}}>
              {/*<button className={'w120p'} style={{marginLeft:"0.5rem"}}>患者所在</button>*/}
              {/*<button className={'w120p'} style={{marginLeft:"0.5rem"}}>空床検索</button>*/}
              {/*<button onClick={this.openNurseRequireModal.bind(this)} className={'w120p'} style={{marginLeft:"0.5rem"}}>看護必要度</button>*/}
              <Button type="common" className={'w120p'} onClick={this.openNurseRequireModal.bind(this)}>看護必要度</Button>
              <Button
                type="common"
                className={'w120p ml-05rem ' + ((this.state.load_ward_map === false) || (this.state.first_ward_id === 0) || (this.state.view_mode === 'patient_move') || (this.state.simulation_numbers.length > 0) ? 'disable-btn' : '')}
                onClick={this.printPdf.bind(this)}
              >印刷</Button>
            </div>
          </div>
        </Flex>
        <div className={'flex'} style={{paddingTop:"0.5rem", paddingLeft:"10px"}}>
          <Button type="mono" className={'search-btn'} onClick={this.searchWardBedPatientInfo}>最新表示</Button>
          <div className={'check-box'}>
            <Checkbox
              label="自動更新"
              getRadio={this.setAutoReload.bind(this)}
              value={this.state.auto_reload === 1}
              name="auto_reload"
            />
            <Checkbox
              label="実施済みも一覧に表示"
              getRadio={this.getRadio.bind(this)}
              value={this.state.view_complete === 1}
              name="view_complete"
            />
          </div>
          <div className={'div-title'}>状態</div>
          <div className={'color-box'} style={{backgroundColor:"rgb(0, 128, 0)"}}> </div>
          <div className={'div-title'}>外出</div>
          <div className={'color-box'} style={{backgroundColor:"#0067C0"}}> </div>
          <div className={'div-title'}>シミュレーション中（文字色）</div>
          <div className={'view-mode'} style={{paddingRight:"5px"}}>【{this.state.view_mode === 'patient_select' ? "患者選択" : "移動実施"}モード】</div>
          <div className={'div-title'}>{this.getUseBedPercent()}</div>
        </div>
        <div className={'map-area'} id={'map_area'} style={{backgroundColor:(this.state.cur_ward_background != null ? this.state.cur_ward_background : "#EEEEEE")}}>
          {this.state.load_ward_map ? (
            <>
              {this.state.map_data.office !== undefined && this.state.map_data.office[0] !== undefined && (
                <div className={'position border2px'}
                   style={{
                     left:((this.state.map_data.office[0]['x_position'] - 1) * this.block_size_x+1)+ 'rem',
                     top: ((this.state.map_data.office[0]['y_position'] - 1) * this.block_size_y+0.5)+ 'rem',
                     width:(this.block_size_x*4)+'rem',
                     lineHeight:"calc(" + (this.block_size_y * 4) + "rem + 3px)",
                     height:"calc(" + (this.block_size_y * 4) + "rem + 3px)",
                     fontSize:"3rem", textAlign:"center",
                     backgroundColor:"white"
                   }}
                >{this.state.cur_ward_name+"病棟"}</div>
              )}
              {this.state.map_data.office !== undefined && this.state.map_data.office[1] !== undefined && (
                <div className={'table-area position'}
                   style={{
                     left:((this.state.map_data.office[1]['x_position'] - 1) * this.block_size_x+1)+ 'rem',
                     top: ((this.state.map_data.office[1]['y_position'] - 1) * this.block_size_y+0.5)+ 'rem',
                     width:(this.block_size_x * 8)+'rem',
                     backgroundColor:"#FFFFFF",
                   }}
                >
                  <table className="table-scroll table table-bordered table-hover border2px" style={{marginLeft:"0.05rem"}}>
                    <thead>
                    <tr>
                      <th style={{width:"6.5rem"}}>区分</th>
                      <th style={{width:"7.5rem"}}>日時</th>
                      <th style={{width:"5rem"}}>患者ID</th>
                      <th>患者氏名</th>
                      <th style={{width:"2rem"}}>性</th>
                      <th style={{width:"16rem"}}>病棟/病室/病床</th>
                    </tr>
                    </thead>
                    <tbody id="patient-list" style={{height:(this.block_size_y * 4)+'rem'}}>
                    {this.state.patient_list.length > 0 && (
                      this.state.patient_list.map((item, index) => {
                        if(!this.state.simulation_numbers.includes(item.hos_number)){
                          return (
                            <>
                              <tr
                                className={'row-patient'}
                                style={{backgroundColor:this.getHospitalCategory(item, 'backcolor')}}
                                draggable={(this.state.view_mode !== 'patient_select' && item.is_carried_out_of_hospitalization == 0 && last_hospital_view == false) ? true : false}
                                onDragStart={e => this.onDragStart(e)}
                                id={"patient_list:"+index}
                                onContextMenu={e => this.handleCancelClick(e, item)}
                              >
                                <td style={{width:"6.5rem"}}>{item.movement_name}</td>
                                <td style={{width:"7.5rem"}}>{item.moving_date_time}</td>
                                <td style={{width:"5rem", textAlign:"right"}}>{item.patient_number}</td>
                                <td>{item.patient_name}</td>
                                <td style={{width:"2rem"}}>{item.gender == 1 ? '男' : '女'}</td>
                                <td style={{width:"16rem"}}>{this.getHospitalCategory(item, 'bed')}</td>
                              </tr>
                            </>
                          )
                        }
                      })
                    )}
                    </tbody>
                  </table>
                </div>
              )}
              {this.state.map_data.office !== undefined && this.state.map_data.office[2] !== undefined && (
                <div
                  className={'border2px position'}
                  style={{
                    left:((this.state.map_data.office[2]['x_position']) * this.block_size_x +1)+ 'rem',
                    top: ((this.state.map_data.office[2]['y_position'] - 1) * this.block_size_y+0.5)+ 'rem',
                    width:this.block_size_x+'rem',
                    overflowY:"auto",
                    backgroundColor:"#FFF"
                  }}
                  onDrop={e => this.onDropSubdivision(e)}
                  onDragOver={e => this.onDragOver(e)}
                  id={"subdivision_area"}
                >
                  <div
                    className={'bottom-border'}
                    style={{textAlign:"center", height:this.block_size_y+'rem', lineHeight:this.block_size_y+'rem'}}
                  >転棟用エリア</div>
                  {this.state.subdivision_area.length > 0 && (
                    this.state.subdivision_area.map((patient, index)=>{
                      return (
                        <>
                          <div
                            className={'bottom-border row-patient'}
                            style={{paddingLeft:"5px", color:"#0067C0", height:this.block_size_y+'rem'}}
                            draggable={(this.state.view_mode != 'patient_select' && last_hospital_view == false) ? true : false}
                            onDragStart={e => this.onDragStart(e)}
                            id={"subdivision_area:"+index}
                          >
                            {patient.patient_name}
                          </div>
                        </>
                      )
                    })
                  )}
                  {this.getSpaceBlock(this.state.subdivision_area)}
                </div>
              )}
              {this.state.map_data.office !== undefined && this.state.map_data.office[3] !== undefined && (
                <div
                  className={'border2px position'}
                  style={{
                    left:((this.state.map_data.office[3]['x_position']) * this.block_size_x+1)+ 'rem',
                    top: ((this.state.map_data.office[3]['y_position'] - 1) * this.block_size_y+0.5)+ 'rem',
                    width:this.block_size_x+'rem',
                    overflowY:"auto",
                    backgroundColor:"#FFF"
                  }}
                  onDrop={e => this.onDropWaiting(e)}
                  onDragOver={e => this.onDragOver(e)}
                  id={"waiting_area"}
                >
                  <div
                    className={'bottom-border'}
                    style={{textAlign:"center", height:this.block_size_y+'rem', lineHeight:this.block_size_y+'rem'}}
                  >待機エリア</div>
                  {this.state.waiting_area.length > 0 && (
                    this.state.waiting_area.map((patient, index)=>{
                      return (
                        <>
                          <div
                            className={'bottom-border row-patient'}
                            style={{paddingLeft:"5px", color:"#0067C0", height:this.block_size_y+'rem'}}
                            draggable={(this.state.view_mode != 'patient_select' && last_hospital_view == false) ? true : false}
                            onDragStart={e => this.onDragStart(e)}
                            id={"waiting_area:"+index}
                          >
                            {patient.patient_name}
                          </div>
                        </>
                      )
                    })
                  )}
                  {this.getSpaceBlock(this.state.waiting_area)}
                </div>
              )}
              {this.state.map_data.office !== undefined && this.state.map_data.office[4] !== undefined && (
                <div
                  className={'border2px position'}
                  style={{
                    left:((this.state.map_data.office[4]['x_position'] - 1) * this.block_size_x +1)+ 'rem',
                    top: ((this.state.map_data.office[4]['y_position'] - 1) * this.block_size_y + 0.5)+ 'rem',
                    width:(this.block_size_x*2)+'rem',
                    height:((this.block_size_y - 0.2)*3)+'rem', textAlign:"center",
                    fontSize:"1.25rem",
                    backgroundImage: `url(${this.state.first_ward_id == 1 ? nurse_station_2 : (this.state.first_ward_id == 2 ? nurse_station_3 : nurse_station_4)})`,
                    backgroundRepeat:"round"
                  }}
                > </div>
              )}
              {this.state.map_data.room !== undefined && this.state.map_data.room[this.state.first_ward_id] !== undefined && Object.keys(this.state.map_data.room[this.state.first_ward_id]).length > 0 && (
                Object.keys(this.state.map_data.room[this.state.first_ward_id]).map(frame_key=>{
                  let room_data = this.state.map_data.room[this.state.first_ward_id][frame_key];
                  let bed_index = 0;
                  return (
                    <>
                      <div className={'position' + (room_data.number_of_operating_beds > 2 ? " multi-room" : "")}
                       style={{
                         left:((room_data.x_position - 1) * this.block_size_x + 1)+ 'rem',
                         top: ((room_data.y_position - 1) * this.block_size_y + 0.5)+ 'rem',
                         width:(this.block_size_x*(room_data.number_of_operating_beds > 2 ? 2:1)) + (room_data.number_of_operating_beds > 2 ? 0 : 0.1)+'rem',
                         textAlign:"center"
                       }}
                      >
                        <div style={{width:"100%", float:"left"}}>
                          <div
                            className={'border2px'}
                            style={{
                              width:"100%",
                              float:"left", fontSize:"1rem",
                              borderBottom:"0.05rem solid black",
                              height:(this.block_size_y - 0.2)+'rem',
                              lineHeight:(this.block_size_y - 0.2)+'rem',
                              textAlign:"center",
                              backgroundColor:this.getBackColor(room_data.bed),
                            }}
                          >{room_data.name}</div>
                          <div style={{width:"100%", float:"left"}}>
                            {Object.keys(room_data.bed).length > 0 && (
                              Object.keys(room_data.bed).map(bed_number=>{
                                if(room_data.bed[bed_number]['patient'] != null){
                                  let patient_info = room_data.bed[bed_number]['patient'];
                                  bed_index++;
                                  return (
                                    <>
                                      <div
                                        className={(this.state.view_mode === 'patient_select' ? "patient-sel " : " ") + "bed-box " + ("map_data:"+frame_key+"_"+bed_number)}
                                        style={{
                                          width:(room_data.number_of_operating_beds > 2 ? "calc(100% / 2)" : "100%"),
                                          height:(this.block_size_y - 0.2)+'rem',
                                          float:"left",
                                          backgroundColor:"#FFFFFF",
                                        }}
                                        onClick={()=>this.selectPatient(patient_info)}
                                        draggable={((this.state.view_mode == 'patient_select') || (patient_info['go_out'] !== undefined && patient_info['go_out']) || last_hospital_view)
                                          ? false : true}
                                        onDragStart={e => this.onDragStart(e)}
                                        id={"map_data:"+frame_key+"_"+bed_number}
                                        onContextMenu={e => this.handleClick(e, patient_info, room_data.name, room_data.bed[bed_number]['bed']['name'])}
                                        onDoubleClick={this.goKarte.bind(this, patient_info)}
                                      >
                                        <div
                                          style={{
                                            float:"left",
                                            width:"calc(100% - 0.06rem)",
                                            height:"calc(100% - 0.01rem)",
                                            backgroundColor:this.getBedBackColor(patient_info.bed_color, patient_info.main_doctor_code),
                                            color:this.getFontColor(patient_info),
                                            cursor:"pointer",
                                            textAlign:"center",
                                            marginLeft:"0.03rem"
                                          }}
                                          onMouseOver={e => this.viewPatientInfo(e, patient_info,
                                            ("map_data:"+frame_key+"_"+bed_number),
                                            ((room_data.y_position - 1) * this.block_size_y),
                                            ((room_data.x_position - 1) * this.block_size_x + 1)
                                          )}
                                          onMouseOut={e => {this.closeViewPatientInfo(e)}}
                                        >
                                          <div className={this.isSelectedPatient(patient_info) ? "patient-selected" : " "}>{patient_info.name_kana}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                } else {
                                  bed_index++;
                                  return (
                                    <>
                                      <div
                                        className={"bed-box"}
                                        style={{
                                          backgroundColor:"#EEEEEE",
                                          backgroundImage:"none",
                                          width:(room_data.number_of_operating_beds > 2 ? "calc(100% / 2)" : "100%"),
                                          height:(this.block_size_y - 0.2)+'rem',
                                          lineHeight:(this.block_size_y - 0.2)+'rem',
                                          float:"left",
                                          color:"#aaa"
                                        }}
                                        onDrop={e => this.onDropEvent(e)}
                                        onDragOver={e => this.onDragOver(e)}
                                        id={"room:"+frame_key+"_"+bed_number}
                                      >{bed_index}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })
              )}
              {this.state.map_data.hallway !== undefined && this.state.map_data.hallway.length > 0 && (
                this.state.map_data.hallway.map(hallway=>{
                  return (
                    <>
                      <div
                        className={'position'}
                        style={{
                          left:((hallway['x_position'] - 1) * this.block_size_x)+ 'rem',
                          top: ((hallway['y_position'] - 1) * this.block_size_y + 0.5)+ 'rem',
                          width:(this.block_size_x * hallway['hallway_width'])+'rem',
                          height:(this.block_size_y * hallway['hallway_height'])+'rem', textAlign:"center",
                          backgroundColor:"white"
                        }}
                      > </div>
                    </>
                  );
                })
              )}
            </>
          ):(
            <>
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            </>
          )}
        </div>

        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title= {this.state.alert_title}
          />
        )}
        <HoverMenu
          {...this.state.hoverMenu}
          patient_info={this.state.patient_info}
          diagnosis={this.state.diagnosis}
        />
        {this.state.openMoveHospitalization && (
          <MoveHospitalization
            closeModal={this.closeModal}
            handleOk={this.moveBed}
            hos_number={this.state.hos_number}
            ward_name={this.state.cur_ward_name}
            frame_name={this.state.frame_name}
            bed_name={this.state.bed_name}
            date_and_time_of_hospitalization={this.state.date_and_time_of_hospitalization}
            department_id={this.state.department_id}
            patient_info={this.state.patient_info}
          />
        )}
        {this.state.openDoHospitalization && (
          <DoHospitalization
            closeModal={this.closeModal}
            handleOk={this.moveBed}
            hos_number={this.state.hos_number}
            ward_name={this.state.cur_ward_name}
            frame_name={this.state.frame_name}
            bed_name={this.state.bed_name}
            date_and_time_of_hospitalization={this.state.date_and_time_of_hospitalization}
            department_id={this.state.department_id}
            start_date={this.state.start_date}
            start_time_classification={this.state.start_time_classification}
          />
        )}
        {this.state.openInputInformationDoHospital && (
          <InputInformationDoHospital
            closeModal={this.closeModal}
            modal_type={this.state.modal_type}
            patient_info={this.state.patient_info}
            ward_name={this.state.cur_ward_name}
            frame_name={this.state.frame_name}
            bed_name={this.state.bed_name}
          />
        )}
        {this.state.isOpenNurseRequireModal && (
          <NurseRequireModal
            closeModal = {this.closeNurseRequireModal}
            selected_ward = {this.state.first_ward_id}
            search_date = {this.state.search_date}
            selectedPatients = {this.state.selectedPatients}
          />
        )}
        {this.state.isOpenNurseCourseSeatModal && this.state.nursing_worksheet_mode_selectable == "ON" && (
          <NurseCourseSeatModal
            closeModal = {this.closeModal}
            selectedPatients={this.state.selectedPatients}
          />
        )}        
        {this.state.isOpenNurseCourseSeatModal && this.state.nursing_worksheet_mode_selectable == "OFF" && (
          <WorkSheetModal
            closeModal = {this.closeModal}
            selectedPatients={this.state.selectedPatients}            
            type={''}            
            course_date = {new Date()}                        
            worksheetInfo={null}            
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        <ContextCancelMenu
          {...this.state.contextCancelMenu}
          parent={this}
        />
        {this.state.isOpenStateBatchRegist && (
          <StateBatchRegist
            closeModal = {this.closeModal}
          />
        )}
        {this.state.isOpenProgressChart && (
          <ProgressChart
            closeModal = {this.closeModal}
          />
        )}
        {this.state.isOpenPatientsSchedule && (
          <PatientsSchedule
            closeModal = {this.closeModal}
          />
        )}
        {this.state.isOpenMovePlanPatientList && (
          <MovePlanPatientList
            closeModal = {this.closeModal}
          />
        )}
        {this.state.isOpenSelectPatientModal && (
          <SelectPatientSoapModal
            handleOk={this.gotoSoap}
            closeModal={this.closeModal}
            modal_type={'ward_map'}
            search_id={this.state.schVal}
            first_ward_id={this.state.first_ward_id}
          />
        )}
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'ward_bed'}
          />
        )}
        {this.state.isOpenBedControl && (
          <BedControlModal
            closeModal={this.closeModal}
            goKartePage = {this.goToUrlFuncByPatientId}
          />
        )}
        {this.state.openHospitalPatientHistory && (
          <HospitalPatientHistory
            closeModal={this.closeModal}
            patient_info={this.state.patient_info}
          />
        )}
        {this.state.isOpenSelectDoctor && (
          <SelectDoctorModal
            closeDoctor={this.closeModal}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.doctors}
          />
        )}
        {this.state.openSetBedBackgroundModal && (
          <SetBedBackgroundModal
            closeModal={this.closeModal}
            patient_info={this.state.patient_info}
          />
        )}
      </PatientsWrapper>
    );
  }
}

WardMap.contextType = Context;
WardMap.propTypes = {
  history: PropTypes.object,
};
export default WardMap;
