import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import {
  formatDateLine,
  formatJapanDate,
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat,
  getTimeZone
} from "~/helpers/date"
import DialSideBar from "../DialSideBar";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import axios from "axios/index";
import * as sessApi from "~/helpers/cacheSession-utils";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import BedMonitorComponent from "./BedMonitorComponent";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import StatusPrintPreview from "./modals/StatusPrintPreview";
import $ from "jquery";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import {setDateColorClassName} from "~/helpers/dialConstants";

const CustomDiv = styled.div`
    width:100%;
    height:100%;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 390px);
  left: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding-top: 1rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  .title {
    border-left: solid 0.3rem #69c8e1;
    line-height: 2rem;
  }
`;

const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 0.625rem 0;
  line-height:2rem;
  .search-box {
    width: 100%;
    display: flex;
    position: relative;
    button {
      padding: 0;
      padding-left: 5px;
      padding-right: 5px;
      font-size: 1rem;
    }
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.5rem;
    font-size: 0.8rem;
    line-height: 2rem;
  }
  .pullbox-label {
    margin-bottom:0;
  }
  .pullbox-select {
      font-size: 0.75rem;
      width: 5.4rem;
      height: 2rem;
  }
  .cur_date {
    font-size: 1rem;
    display: flex;
    flex-wrap: wrap;
    line-height: 2rem;
  }
  .schedule-month {
    cursor: pointer;
    font-size: 1rem;
    padding-left: 0.3rem;
  }
  .gender {
    font-size: 0.75rem;
    margin-left: 0.3rem;
    .radio-btn label{
        width: 3rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.2rem;
        // font-size: 1rem;
        font-weight: bold;
        line-height: 2rem;
    }
  }
  .prev-day {
    cursor: pointer;
    // padding-right: 0.625rem;
  }
  .next-day {
    cursor: pointer;
    // padding-left: 0.625rem;
  }
  .pullbox-title {
    width:2rem;
  }
  .pullbox-label {
    &:before {
      right:0.5rem !important;
    }
  }
  .select-view-content {
    .pullbox-select {
      width: 7rem;
    }
    .pullbox-title {
      width:0;
    }
  }
  .link-area {
    display:flex;
    position: absolute;
    right: 0;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        min-width: 9rem;
    }
    span {
        font-size: 1rem;
    }
    .disable-button {
      background: rgb(101, 114, 117);
      cursor: auto;
    }
    .schedule-button {
        // margin-right: 0.5rem;
    }
    .patient-count {
      font-size: 1rem;
    }
  }
`;

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: calc( 100vh - 4.5rem);
  .bed-area {
    margin-top: 1px;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    height: calc(100% - 1px);
  }
  .area-2f {
    width: 47%;
    height: 100%;
    .monitor-area {
      width: 100%;
      height: calc(100% - 3.5rem);
      align-items: flex-start;
      justify-content: space-between;
    }
  }
  .area-3f {
    width: 47%;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
  }
  .black-box {
      width: 2%;
      // margin-bottom: 3px;
      margin-left: 2%;
      margin-right: 2%;
      border: 1px solid black;
      // height: 63rem;
  }
  .left-area {
      width: 32%;
  }
  .right-area {
    width: 32%;
  }
  .middle-area {
    width: 32%;
  }
  .reception {
    .reception-box {
        width: 75%;
        text-align:center;
        background-color: #e4e4e4;
    }
    .reception-label {
        width: 75%;
        text-align: center;
    }
  }
  .padding-bed {
    padding-bottom: 5px;
    width: 95%;
  }
  .room-name {
    width: 100%;
    // height: 10rem;
    text-align: center;
    // font-size: 6rem;
    font-weight: bold;
  }
  .no-set-area-name {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    height: 122px;
    line-height: 180px;
  }
  .room-area {
    width: 30%;
  }
  .no-room-area {
    width: 28%;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .border-1p {
    border:1px solid black;
  }
  .green-border {
    border-color: #008000 !important;
  }
  .green-border-top {
    border-top: 1px solid #008000 !important;
  }
  .green-border-bottom {
    border-bottom: 1px solid #008000 !important;
  }
  .green-border-right {
    border-right: 1px solid #008000 !important;
  }
  .green-border-left {
    border-left: 1px solid #008000 !important;
  }
  .staff-station {
      padding-top: 120px;
    .staff-station-box {
        width: 95%;
        height: 30px;
        background-color: #928b8b;
    }
    .staff-station-label {
        width: 95%;
        padding-left: 10px;
    }
  }
  .space-3f-1 {
    height: 5.3rem;
  }
  .space-3f-4 {
    // height: 15.7rem;
  }
  
  .box-bed {
    width: 100%;
    margin-top: -1px;
    display:flex;
  }
  .box-bed:hover {
    background-color: #d7f9ec;
  }
  .bed-id {
    width: 20%;
    text-align: center;
    border:1px solid black;
  }
  .bed-info {
    width: 80%;
    border:1px solid black;
    border-left:none;
    .patient-name {
      width: 100%;
      text-align: left;
      font-weight: bold;
      padding-left:0.2rem;
    }
  }
  .execution-status {
    .status-box {
      text-align: center;
      width: 20%;
      color: white;
    }
  }
  .blue {
    background-color: #7878ec;
    color:white;
  }
  .pink {
      background-color:#e489a9;
  }
  .grey {
      background-color: #928b8b;
  }
  .red {
      color: white;
      background-color: red;
  }
  .dial-finish {
    .finish-status {
      width: calc(100% - 4rem);
      padding-left: 0.2rem;
      text-align: left;
    }
    .finish-time {
      color: white;
      width: 4rem;
      text-align: center;
    }
  }
  .dial-status {
    align-items: flex-start;
    justify-content: space-between;
    .infectious-status {
        padding-left:0.1rem;
        padding-right:0.1rem;
        text-align: center;
    }
    .red-block {
        color: white;
        background-color: red;
        width: 1rem;
        font-size:0.6rem;
        line-height:1.325rem;
    }
    .dial-method {
        padding-left:0.1rem;
    }
    .instruction-mark{
        color:red;
        padding-right: 0.1rem;
    }
  }
  .preview-btn {
    button {
      border-radius: 0.25rem;
      min-width: 9rem;
      margin-left: 0.6rem;
      span {
        font-size: 1.25rem;
        font-weight: normal;
      }
    }
    .red-btn {
      background: #cc0000;
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
  }
 `;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
.context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .hover-menu {
    z-index: 190;
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
    border-bottom: 1px solid #cfcbcb;
    div {
      padding: 0.75rem;
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

const TooltipMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    font-size: 1rem;
    line-height: 1.875rem;
    clear: both;
    color: black;
    cursor: pointer;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    border-bottom: solid 1px #888;
    -webkit-transition: all 0.3s;
  }
  .border-1p {
    border:1px solid black;
  }
  .bed-id {
    width: 20%;
    pdding-left: 0.3rem;
    text-align: center;
    border:1px solid black;
    height:8rem;
    line-height:8rem;
  }
  .bed-info {
    width: 80%;
    border:1px solid black;
    border-left:none;
    font-size: 16px;
    .patient-name {
      padding-left:10px;
      width: 100%;
      text-align: left;
    }
  }
  .execution-status {
    padding: 0 !important;
    height: 1.8rem;
    .status-box {
      text-align: center;
      padding-left: 0 !important;
      padding-right: 0 !important;
      width: 20%;
      color: white;
    }
  }
    .blue {
      background-color: #7878ec;
      color: white;
    }
    .pink {
      background-color:#e489a9;
    }
    .grey {
      background-color: #928b8b;
    }
    .red {
      color: white;
      background-color: red;
    }
  .dial-finish {
    padding-left: 0 !important;
    padding-right: 0 !important;
    .finish-status {
      width: calc(100% - 6rem);
      padding-left:0.3rem;
    }
    .finish-time {
      width: 6rem;
      color: white;
      padding-left: 0 !important;
      padding-right: 0 !important;
      text-align: center;
    }
  }
  .dial-status {
    align-items: flex-start;
    height: 1.8rem;
    justify-content: space-between;
    .infectious-status {
        padding-left:0.1rem;
        padding-right:0.1rem;
        text-align: center;
    }
    .red-block {
        color: white;
        background-color: red;
        width: 2rem;
        font-size:1rem;
        line-height:1.325rem;
    }
    .dial-method {
        padding-left:0.4rem;
    }
    .instruction-mark{
        color:red;
        padding-right: 0.4rem;
    }
  }
  .patient-info-table{
    width: 35rem;
    padding: 0.3rem;
  }
  .patient-number {
    padding-left: 5px;
    font-size: 16px;
  }
`;

const ContextMenu = ({visible,x,y,parent
                     }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.contextMenuAction('go_bedside')}>ベッドサイド支援へ</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverMenu = ({
                     visible,
                     x,
                     y,
                     bed_data,
                     parent
                   }) => {
  if (visible) {
    let bedId = bed_data['bed_no'];
    let patientName = bed_data['patient_name'];
    let exam_status = bed_data['exam_status'];
    let dialprescription_status = bed_data['dialprescription_status'];
    let injection_status = bed_data['injection_status'];
    let prescription_status = bed_data['prescription_status'];
    let sendingPrescription = bed_data['sendingPrescription'];
    let roundFinish_status = bed_data['roundFinish_status'];
    let showTimeStatus = parent.state.show_time;
    let dialTime = bed_data['reservation_time'];
    let finishTime = bed_data['finishTime'];
    let infection_status = bed_data['infection_status'];
    
    return (
      <TooltipMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className={'patient-info-table flex'}>
              <div className="bed-id">{bedId}</div>
              <div className={'bed-info'}>
                <div className="flex dial-finish">
                  <div className={roundFinish_status ? "finish-status blue" : "finish-status"}>{bed_data['patient_number']}</div>
                  { showTimeStatus == 0 ? (
                    <div className={dialTime ? "finish-time grey" : "finish-time"}>{dialTime}</div>
                  ) : (
                    <div className={finishTime ? "finish-time grey" : "finish-time"}>{"終 : "+ finishTime}</div>
                  )}
                </div>
                <div className="patient-name">{patientName}</div>
                <div className="flex execution-status">
                  <div className={exam_status === 2 ? "status-box blue" : exam_status === 1 ? "status-box pink" : "status-box"}>
                    {(exam_status === 2 || exam_status === 1) ? "検" : ""}
                  </div>
                  <div className={injection_status === 2 ? "status-box blue" : injection_status === 1 ? "status-box pink" : "status-box"}>
                    {(injection_status === 2 || injection_status === 1) ? "注":""}
                  </div>
                  <div className={dialprescription_status === 2 ? "status-box blue" : dialprescription_status === 1 ? "status-box pink" : "status-box"}>
                    {(dialprescription_status === 2 || dialprescription_status === 1) ? "薬":""}
                  </div>
                  <div className={prescription_status === 2 ? "status-box blue" : prescription_status === 1 ? "status-box pink" : "status-box"}>
                    {(prescription_status === 2 || prescription_status === 1) ? "処":""}
                  </div>
                  <div className={sendingPrescription === 2 ? "status-box blue" : sendingPrescription === 1 ? "status-box pink" : "status-box"}>
                    {(sendingPrescription === 2 || sendingPrescription === 1) ? "中" : ""}
                  </div>
                </div>
                <div className="flex dial-status">
                  {infection_status !== '' && (
                    <div className={"infectious-status red-block"}>{infection_status === 1 ? "-" : "☆"}</div>
                  )}
                  <div className="dial-method">
                    {(bed_data != null && bed_data['content'] != null && bed_data['content'][parent.state.view_content] !== undefined) ? bed_data['content'][parent.state.view_content] : ""}
                  </div>
                  {(bed_data != null && bed_data['instruct_flag'] !== undefined && bed_data['instruct_flag'] === 1) && (<div className="instruction-mark text-right" style={{width:"1rem", fontSize:"1rem", lineHeight:"1.2rem"}}>指</div>)}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </TooltipMenuUl>
    );
  } else {
    return null;
  }
};

const show_time = [
  { id: 0, value: "透析時間" },
  { id: 1, value: "終了時間" },
];

const view_content = [
  { id: 0, value: "ダイアライザ" },
  { id: 1, value: "抗凝固剤" },
  { id: 2, value: "治療法" },
  { id: 3 , value: "血圧" },
];

class StatusMonitor extends Component {
  constructor(props) {
    super(props);
    let time_zone_list = getTimeZoneList();
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    let width_fontsize = 16;
    let height_fontsize = 16;
    if(parseInt(width) < 1367){
      width_fontsize = 10;
      height_fontsize = 11.3;
    } else if(parseInt(width) < 1401){
      width_fontsize = 10.5;
      height_fontsize = 15.7;
    } else if(parseInt(width) < 1441){
      width_fontsize = 12;
      height_fontsize = 13.35;
    } else if(parseInt(width) < 1601){
      width_fontsize = 13;
      height_fontsize = 13.3;
    } else if(parseInt(width) < 1681){
      width_fontsize = 15;
      height_fontsize = 15.6;
    }
    this.state = {
      schVal: "",
      time_zone_list,
      bed_data_2f: [],
      bed_data_3f: [],
      used_bed_count:0,
      schedule_date: '',  //日付表示
      isopenEditBedInfoModal: false,
      timezone:1,
      show_time: 0,
      isOpenPrintPreviewModal:false,
      cur_patient_id:0,
      view_content:0,
      width_fontsize,
      height_fontsize,
      is_loaded:false,
    };
    this.openModalStatus = 0;
    this.status_monitor_mode = 0; //モード 0 リアルタイム、1選択日付・時間枠
    this.status_monitor_reload_time = 0; //0なら自動更新なし
    this.time_setting = null;
  }
  
  async componentDidMount(){
    let schedule_date = sessApi.getObjectValue("dial_bed_table", "schedule_date");
    if(schedule_date == undefined || schedule_date == undefined){
      schedule_date = await getServerTime();
    }
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(new Date(schedule_date)));
    let timezone = 1;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && initState != null){
      if(initState.conf_data !== undefined){
        if(initState.conf_data.status_monitor_mode !== undefined){
          this.status_monitor_mode = initState.conf_data.status_monitor_mode;
        }
        if(initState.conf_data.status_monitor_reload_time !== undefined){
          this.status_monitor_reload_time = initState.conf_data.status_monitor_reload_time;
        }
      }
      if(initState.dial_timezone != undefined && initState.dial_timezone.timezone != undefined){
        this.time_setting = initState.dial_timezone.timezone;
      }
    }
    // if(this.status_monitor_mode == 0){
      timezone = await getTimeZone(this.time_setting);
    // }
    this.setState({
      schedule_date:new Date(schedule_date),
      timezone
    });
    await this.getSearchResult();
    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function(){
      $(window).resize(function(){
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        let width_fontsize = 16;
        let height_fontsize = 16;
        if(parseInt(width) < 1367){
          width_fontsize = 10;
          height_fontsize = 11.3;
        } else if(parseInt(width) < 1401){
          width_fontsize = 10.5;
          height_fontsize = 15.7;
        } else if(parseInt(width) < 1441){
          width_fontsize = 12;
          height_fontsize = 13.35;
        } else if(parseInt(width) < 1601){
          width_fontsize = 13;
          height_fontsize = 13.3;
        } else if(parseInt(width) < 1681){
          width_fontsize = 15;
          height_fontsize = 15.6;
        }
        that.setState({
          width_fontsize,
          height_fontsize,
        });
      });
    });
    if(this.status_monitor_reload_time != 0 && parseInt(this.status_monitor_reload_time) > 0){
      this.status_monitor_reload_time = parseInt(this.status_monitor_reload_time) * 1000;
      this.reloadInterval = setInterval(async()=>{
        await this.autoReload();
      }, this.status_monitor_reload_time);
    }
  }
  
  autoReload=async()=>{
    if(this.openModalStatus == 0){
      if(this.status_monitor_mode == 0){
        let timezone = await getTimeZone(this.time_setting);
        let schedule_date = sessApi.getObjectValue("dial_bed_table", "schedule_date");
        if(schedule_date == undefined || schedule_date == undefined){
          schedule_date = await getServerTime();
        }
        this.setState({
          schedule_date:new Date(schedule_date),
          timezone
        });
      }
      await this.getSearchResult();
    }
  }
  
  componentWillUnmount (){
    sessApi.remove('for_left_sidebar');
    if(this.status_monitor_reload_time != 0){
      clearInterval(this.reloadInterval);
    }
  }
  
  componentDidUpdate(){
    let all_bed = document.getElementsByClassName("box-bed");
    for(let index = 0; index < all_bed.length; index++){
      let prev_patient_bed = all_bed[index];
      if(prev_patient_bed !== undefined && prev_patient_bed != null){
        prev_patient_bed.style['background-color'] = "";
        let cur_patient_bed_id = prev_patient_bed.getElementsByClassName('border-1p')[0];
        let cur_execution_status = prev_patient_bed.getElementsByClassName('execution-status')[0];
        let cur_dial_finish = prev_patient_bed.getElementsByClassName('dial-finish')[0];
        let cur_dial_status = prev_patient_bed.getElementsByClassName('dial-status')[0];
        if(cur_patient_bed_id !== undefined && cur_patient_bed_id != null &&
          cur_execution_status !== undefined && cur_execution_status != null &&
          cur_dial_finish !== undefined && cur_dial_finish != null &&
          cur_dial_status !== undefined && cur_dial_status != null
        ){
          cur_patient_bed_id.classList.remove("green-border");
          cur_execution_status.classList.remove("green-border-left");
          cur_execution_status.classList.remove("green-border-right");
          cur_dial_finish.classList.remove("green-border-left");
          cur_dial_finish.classList.remove("green-border-right");
          cur_dial_status.classList.remove("green-border-left");
          cur_dial_status.classList.remove("green-border-right");
          cur_dial_status.classList.remove("green-border-bottom");
          let next_bed_no = prev_patient_bed.nextSibling;
          if(next_bed_no !== undefined && next_bed_no != null){
            let next_bed_id = next_bed_no.getElementsByClassName('border-1p')[0];
            if(next_bed_id !== undefined && next_bed_id != null){
              next_bed_id.classList.remove("green-border-top");
            }
          }
        }
      }
    }
    let cur_patient_bed = document.getElementsByClassName(this.state.cur_patient_id+"-bed")[0];
    if(cur_patient_bed !== undefined && cur_patient_bed != null){
      cur_patient_bed.style['background-color'] = "#DDEEFF";
      let cur_patient_bed_id = cur_patient_bed.getElementsByClassName('border-1p')[0];
      let cur_execution_status = cur_patient_bed.getElementsByClassName('execution-status')[0];
      let cur_dial_finish = cur_patient_bed.getElementsByClassName('dial-finish')[0];
      let cur_dial_status = cur_patient_bed.getElementsByClassName('dial-status')[0];
      if(cur_patient_bed_id !== undefined && cur_patient_bed_id != null &&
        cur_execution_status !== undefined && cur_execution_status != null &&
        cur_dial_finish !== undefined && cur_dial_finish != null &&
        cur_dial_status !== undefined && cur_dial_status != null
      ){
        cur_patient_bed_id.classList.add("green-border");
        cur_execution_status.classList.add("green-border-left");
        cur_execution_status.classList.add("green-border-right");
        cur_dial_finish.classList.add("green-border-left");
        cur_dial_finish.classList.add("green-border-right");
        cur_dial_status.classList.add("green-border-left");
        cur_dial_status.classList.add("green-border-right");
        cur_dial_status.classList.add("green-border-bottom");
        let next_bed_no = cur_patient_bed.nextSibling;
        if(next_bed_no !== undefined && next_bed_no != null){
          let next_bed_id = next_bed_no.getElementsByClassName('border-1p')[0];
          if(next_bed_id !== undefined && next_bed_id != null){
            next_bed_id.classList.add("green-border-top");
          }
        }
      }
    }
  }
  
  getSearchResult = async () => {
    if(this.state.is_loaded){
      this.setState({is_loaded:false});
    }
    let timezone = this.state.timezone;
    let cur_date = this.state.schedule_date ? formatDateLine(this.state.schedule_date) : "";
    let path = "/app/api/v2/dial/patient/getBedStatusInfo";
    let post_data = {
      timezone: timezone,
      cur_date: cur_date
    };
    const { data } = await axios.post(path, {params: post_data});
    if(data != undefined && data != null) {
      this.setState({
        bed_data_2f: data[0],
        bed_data_3f: data[1],
        used_bed_count: (data[2] != undefined && data[2] != null) ? data[2] : 0,
        is_loaded:true,
      });
    }
  };
  
  getPrescriptionSelect = e => {
    this.setState({ display_order: parseInt(e.target.id) });
  };
  
  createCode = () => {
    this.setState({isOpenCodeModal: true});
  };
  
  selectTimezone = (e) => {
    this.setState({ timezone: parseInt(e.target.value)}, () => {
      this.getSearchResult();
    })
  };
  
  getDate = value => {
    this.setState({ schedule_date: value}, () => {
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    })
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    })
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    })
  };
  
  getShowTimeSelect = e => {
    this.setState({ show_time: parseInt(e.target.id) });
  };
  
  setViewContent = e => {
    this.setState({ view_content: parseInt(e.target.id) });
  };
  
  openPrintPreview=()=>{
    this.openModalStatus = 1;
    this.setState({
      isOpenPrintPreviewModal:true,
    })
  }
  
  closeModal = () => {
    this.openModalStatus = 0;
    this.setState({isOpenPrintPreviewModal:false})
  };
  
  handleClick = (e, bed_data) => {
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
      .getElementById("bed_area")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        document
          .getElementById("bed_area")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    
    let clientY = e.clientY;
    let clientX = e.clientX;
    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX - 200,
        y: e.clientY + window.pageYOffset
      },
      edit_bed_data: bed_data,
      hoverMenu:{visible: false}
    }, ()=>{
      let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
      let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
      let window_height = window.innerHeight;
      let window_width = window.innerWidth;
      if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          contextMenu: {
            visible: true,
            x: clientX-200-menu_width,
            y: clientY - menu_height,
          },
          contextMenu_other:{visible:false},
          contextMenu_move_to_bed:{visible:false},
        })
      } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
        this.setState({
          contextMenu: {
            visible: true,
            x: clientX-200,
            y: clientY - menu_height,
          },
        })
      } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          contextMenu: {
            visible: true,
            x: clientX-200-menu_width,
            y: clientY + window.pageYOffset,
          },
        })
      }
    });
  };
  
  contextMenuAction = () => {
    this.goBedside(this.state.edit_bed_data);
  };
  
  goBedside=(bed_data)=>{
    var url = "/dial/board/system_setting";
    sessApi.setObjectValue("form_bed_table", "system_patient_id", bed_data.system_patient_id);
    sessApi.setObjectValue("form_bed_table", "schedule_date", bed_data.schedule_date);
    sessApi.setObjectValue("form_bed_table", "bed_no",bed_data.bed_no);
    sessApi.setObjectValue("form_bed_table", "timezone",bed_data.time_zone);
    setTimeout(()=>{
      this.props.history.replace(url);
    }, 500);
  }
  
  goBedPage = () => {
    sessApi.setObjectValue("dial_bed_table", "schedule_date", formatDateLine(this.state.schedule_date));
    setTimeout(()=>{
      this.props.history.replace("/dial/others/bed_table");
    }, 500);
  };
  
  goSchedule = () => {
    var url = "/dial/schedule/Schedule";
    sessApi.setObjectValue("dial_schedule_table", "schedule_date", formatDateLine(this.state.schedule_date));
    setTimeout(()=>{
      this.props.history.replace(url);
    }, 500);
  }
  
  selectPatient=(patientInfo)=>{
    this.setState({
      cur_patient_id:patientInfo.system_patient_id,
    });
  };
  
  patientNameHover=(e, bed_data, class_name)=>{
    if(bed_data === undefined || bed_data == null){
      return;
    }
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
    let state_data={};
    state_data['hoverMenu']={
      visible: true,
      x: $('.'+class_name).offset().left - $('#bed_area').offset().left,
      y: $('.'+class_name).offset().top
    };
    state_data['bed_data'] = bed_data;
    state_data['contextMenu'] = {visible: false};
    this.setState(state_data, ()=>{
      let menu_width = document.getElementsByClassName("hover-menu")[0].offsetWidth;
      let menu_height = document.getElementsByClassName("hover-menu")[0].offsetHeight;
      let bed_width = document.getElementsByClassName(class_name)[0].offsetWidth;
      let window_height = window.innerHeight;
      let x_pos = $('.'+class_name).offset().left - menu_width - 200;
      let y_pos = $('.'+class_name).offset().top;
      if(menu_width+200 > $('.'+class_name).offset().left){
        x_pos = $('.'+class_name).offset().left+bed_width - 200;
      }
      if(y_pos+menu_height > window_height){
        y_pos = window_height - menu_height;
      }
      state_data['hoverMenu']['x']=x_pos;
      state_data['hoverMenu']['y']=y_pos;
      this.setState(state_data);
    });
  };
  
  closeNameHover=()=>{
    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu !== undefined && hoverMenu.visible){
      this.setState({hoverMenu: { visible: false }});
    }
  }
  
  getDateStr=()=>{
    if(this.state.schedule_date == null || this.state.schedule_date === ""){
      return '';
    }
    let schedule_date = this.state.schedule_date;
    if(schedule_date instanceof Date) {
      let y = schedule_date.getFullYear();
      let m = ("00" + (schedule_date.getMonth() + 1)).slice(-2);
      let d = ("00" + schedule_date.getDate()).slice(-2);
      let time_zone = this.state.timezone == 1 ? "午前" : (this.state.timezone == 2 ? "午後" : (this.state.timezone == 4 ? "深夜" : "夜間"));
      let weekday = new Array(7);
      weekday[0] = "日";
      weekday[1] = "月";
      weekday[2] = "火";
      weekday[3] = "水";
      weekday[4] = "木";
      weekday[5] = "金";
      weekday[6] = "土";
      return y + "年" + m + "月" + d + "日" + '(' + weekday[schedule_date.getDay()] + ') ' + time_zone;
    }
  };
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    let bed_data_2f = (this.state.bed_data_2f != undefined && this.state.bed_data_2f !=null) ? this.state.bed_data_2f : [];
    let bed_data_3f = (this.state.bed_data_3f != undefined && this.state.bed_data_3f !=null) ? this.state.bed_data_3f : [];
    let bed_area_2f_1 = [];
    for (let i = 1; i < 6; i++) {
      if(bed_data_2f[i] != undefined && bed_data_2f[i] != null){
        bed_area_2f_1.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            bed_data={bed_data_2f[i]}
            patientName={bed_data_2f[i]['patient_name']}
            dialTime={bed_data_2f[i]['reservation_time']}
            exam_status={bed_data_2f[i]['exam_status']}
            injection_status={bed_data_2f[i]['injection_status']}
            dialprescription_status={bed_data_2f[i]['dialprescription_status']}
            prescription_status={bed_data_2f[i]['prescription_status']}
            sendingPrescription={bed_data_2f[i]['sendingPrescription']}
            roundFinish_status={bed_data_2f[i]['roundFinish_status']}
            finishTime={bed_data_2f[i]['finishTime']}
            infection_status={bed_data_2f[i]['infection_status']}
            showTimeStatus={this.state.show_time}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            exam_list={bed_data_2f[i]['exam_list']}
            injection_list={bed_data_2f[i]['injection_list']}
            dialprescription_list={bed_data_2f[i]['dialprescription_list']}
            prescription_list={bed_data_2f[i]['prescription_list']}
            refresh = {this.getSearchResult}
          />
        )
      } else {
        bed_area_2f_1.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            patientName={''}
            exam_status={0}
            injection_status={0}
            dialprescription_status={0}
            prescription_status={0}
            sendingPrescription={0}
            roundFinish_status={0}
            infection_status={''}
            dialTime={''}
            finishTime={''}
            showTimeStatus={this.state.show_time}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            refresh = {this.getSearchResult}
          />
        )
      }
    }
    let bed_area_2f_2 = [];
    for (let i = 6; i < 11; i++) {
      if(bed_data_2f[i] != undefined && bed_data_2f[i] != null){
        bed_area_2f_2.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            bed_data={bed_data_2f[i]}
            patientName={bed_data_2f[i]['patient_name']}
            dialTime={bed_data_2f[i]['reservation_time']}
            exam_status={bed_data_2f[i]['exam_status']}
            injection_status={bed_data_2f[i]['injection_status']}
            dialprescription_status={bed_data_2f[i]['dialprescription_status']}
            prescription_status={bed_data_2f[i]['prescription_status']}
            sendingPrescription={bed_data_2f[i]['sendingPrescription']}
            roundFinish_status={bed_data_2f[i]['roundFinish_status']}
            finishTime={bed_data_2f[i]['finishTime']}
            infection_status={bed_data_2f[i]['infection_status']}
            showTimeStatus={this.state.show_time}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            exam_list={bed_data_2f[i]['exam_list']}
            injection_list={bed_data_2f[i]['injection_list']}
            dialprescription_list={bed_data_2f[i]['dialprescription_list']}
            prescription_list={bed_data_2f[i]['prescription_list']}
            refresh = {this.getSearchResult}
          />
        )
      } else {
        bed_area_2f_2.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            patientName={''}
            exam_status={0}
            injection_status={0}
            dialprescription_status={0}
            prescription_status={0}
            sendingPrescription={0}
            roundFinish_status={0}
            infection_status={''}
            dialTime={''}
            finishTime={''}
            showTimeStatus={this.state.show_time}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            refresh = {this.getSearchResult}
          />
        )
      }
    }
    if(bed_data_2f[36] != undefined && bed_data_2f[36] != null){
      bed_area_2f_2.push(
        <BedMonitorComponent
          key={11}
          bedId={11}
          bed_data={bed_data_2f[36]}
          patientName={bed_data_2f[36]['patient_name']}
          dialTime={bed_data_2f[36]['reservation_time']}
          exam_status={bed_data_2f[36]['exam_status']}
          injection_status={bed_data_2f[36]['injection_status']}
          dialprescription_status={bed_data_2f[36]['dialprescription_status']}
          prescription_status={bed_data_2f[36]['prescription_status']}
          sendingPrescription={bed_data_2f[36]['sendingPrescription']}
          roundFinish_status={bed_data_2f[36]['roundFinish_status']}
          finishTime={bed_data_2f[36]['finishTime']}
          infection_status={bed_data_2f[36]['infection_status']}
          showTimeStatus={this.state.show_time}
          handleClick = {this.handleClick}
          goBedside = {this.goBedside}
          patientNameHover = {this.patientNameHover}
          closeNameHover = {this.closeNameHover}
          view_content={this.state.view_content}
          width_fontsize={this.state.width_fontsize}
          height_fontsize={this.state.height_fontsize}
          exam_list={bed_data_2f[36]['exam_list']}
          injection_list={bed_data_2f[36]['injection_list']}
          dialprescription_list={bed_data_2f[36]['dialprescription_list']}
          prescription_list={bed_data_2f[36]['prescription_list']}
          refresh = {this.getSearchResult}
        />
      )
    }
    else {
      bed_area_2f_2.push(
        <BedMonitorComponent
          key={11}
          bedId={11}
          patientName={''}
          exam_status={0}
          injection_status={0}
          dialprescription_status={0}
          prescription_status={0}
          sendingPrescription={0}
          roundFinish_status={0}
          infection_status={''}
          dialTime={''}
          finishTime={''}
          showTimeStatus={this.state.show_time}
          patientNameHover = {this.patientNameHover}
          closeNameHover = {this.closeNameHover}
          view_content={this.state.view_content}
          width_fontsize={this.state.width_fontsize}
          height_fontsize={this.state.height_fontsize}
          refresh = {this.getSearchResult}
        />
      )
    }
    let bed_area_3f_1 = [];
    for (let i = 1; i < 3; i++) {
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_1.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            bed_data={bed_data_3f[i]}
            patientName={bed_data_3f[i]['patient_name']}
            dialTime={bed_data_3f[i]['reservation_time']}
            exam_status={bed_data_3f[i]['exam_status']}
            injection_status={bed_data_3f[i]['injection_status']}
            dialprescription_status={bed_data_3f[i]['dialprescription_status']}
            prescription_status={bed_data_3f[i]['prescription_status']}
            sendingPrescription={bed_data_3f[i]['sendingPrescription']}
            roundFinish_status={bed_data_3f[i]['roundFinish_status']}
            finishTime={bed_data_3f[i]['finishTime']}
            infection_status={bed_data_3f[i]['infection_status']}
            showTimeStatus={this.state.show_time}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            exam_list={bed_data_3f[i]['exam_list']}
            injection_list={bed_data_3f[i]['injection_list']}
            dialprescription_list={bed_data_3f[i]['dialprescription_list']}
            prescription_list={bed_data_3f[i]['prescription_list']}
            refresh = {this.getSearchResult}
          />
        )
      } else {
        bed_area_3f_1.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            patientName={''}
            exam_status={0}
            injection_status={0}
            dialprescription_status={0}
            prescription_status={0}
            sendingPrescription={0}
            roundFinish_status={0}
            infection_status={''}
            dialTime={''}
            finishTime={''}
            showTimeStatus={this.state.show_time}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            refresh = {this.getSearchResult}
          />
        )
      }
    }
    bed_area_3f_1.push(
      <>
        <div className={'space-3f-1'} style={{height:((this.state.height_fontsize*5.3)+"px")}}></div>
        <div className="reception" style={{paddingLeft:((this.state.width_fontsize*2.5)+"px")}}>
          <div className="reception-label" style={{height:(this.state.height_fontsize*1.4)+"px"}}></div>
          <div className="reception-box" style={{height:(this.state.height_fontsize*1.875)+"px", lineHeight:(this.state.height_fontsize*1.875)+"px", fontSize:this.state.width_fontsize+"px"}}>スタッフ</div>
        </div>
        <div
          className={'room-name'}
          style={{
            fontSize:(this.state.width_fontsize*3.75)+"px",
            paddingTop:(this.state.height_fontsize*1.875)+"px",
            height:(this.state.height_fontsize*12.1)+"px",
          }}
        >3F</div>
      </>
    );
    let bed_area_3f_2 = [];
    for (let i = 3; i < 8; i++) {
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_2.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            bed_data={bed_data_3f[i]}
            patientName={bed_data_3f[i]['patient_name']}
            dialTime={bed_data_3f[i]['reservation_time']}
            exam_status={bed_data_3f[i]['exam_status']}
            injection_status={bed_data_3f[i]['injection_status']}
            dialprescription_status={bed_data_3f[i]['dialprescription_status']}
            prescription_status={bed_data_3f[i]['prescription_status']}
            sendingPrescription={bed_data_3f[i]['sendingPrescription']}
            roundFinish_status={bed_data_3f[i]['roundFinish_status']}
            finishTime={bed_data_3f[i]['finishTime']}
            infection_status={bed_data_3f[i]['infection_status']}
            showTimeStatus={this.state.show_time}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            exam_list={bed_data_3f[i]['exam_list']}
            injection_list={bed_data_3f[i]['injection_list']}
            dialprescription_list={bed_data_3f[i]['dialprescription_list']}
            prescription_list={bed_data_3f[i]['prescription_list']}
            refresh = {this.getSearchResult}
          />
        )
      } else {
        bed_area_3f_2.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            patientName={''}
            exam_status={0}
            injection_status={0}
            dialprescription_status={0}
            prescription_status={0}
            sendingPrescription={0}
            roundFinish_status={0}
            infection_status={''}
            dialTime={''}
            finishTime={''}
            showTimeStatus={this.state.show_time}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            refresh = {this.getSearchResult}
          />
        )
      }
    }
    let bed_area_3f_3 = [];
    for (let i = 8; i < 20; i++) {
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_3.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            bed_data={bed_data_3f[i]}
            patientName={bed_data_3f[i]['patient_name']}
            dialTime={bed_data_3f[i]['reservation_time']}
            exam_status={bed_data_3f[i]['exam_status']}
            injection_status={bed_data_3f[i]['injection_status']}
            dialprescription_status={bed_data_3f[i]['dialprescription_status']}
            prescription_status={bed_data_3f[i]['prescription_status']}
            sendingPrescription={bed_data_3f[i]['sendingPrescription']}
            roundFinish_status={bed_data_3f[i]['roundFinish_status']}
            finishTime={bed_data_3f[i]['finishTime']}
            infection_status={bed_data_3f[i]['infection_status']}
            showTimeStatus={this.state.show_time}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            exam_list={bed_data_3f[i]['exam_list']}
            injection_list={bed_data_3f[i]['injection_list']}
            dialprescription_list={bed_data_3f[i]['dialprescription_list']}
            prescription_list={bed_data_3f[i]['prescription_list']}
            refresh = {this.getSearchResult}
          />
        )
      } else {
        bed_area_3f_3.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            patientName={''}
            exam_status={0}
            injection_status={0}
            dialprescription_status={0}
            prescription_status={0}
            sendingPrescription={0}
            roundFinish_status={0}
            infection_status={''}
            dialTime={''}
            finishTime={''}
            showTimeStatus={this.state.show_time}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            refresh = {this.getSearchResult}
          />
        )
      }
    }
    let bed_area_3f_4 = [];
    for (let i = 20; i < 24; i++) {
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_4.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            bed_data={bed_data_3f[i]}
            patientName={bed_data_3f[i]['patient_name']}
            dialTime={bed_data_3f[i]['reservation_time']}
            exam_status={bed_data_3f[i]['exam_status']}
            injection_status={bed_data_3f[i]['injection_status']}
            dialprescription_status={bed_data_3f[i]['dialprescription_status']}
            prescription_status={bed_data_3f[i]['prescription_status']}
            sendingPrescription={bed_data_3f[i]['sendingPrescription']}
            roundFinish_status={bed_data_3f[i]['roundFinish_status']}
            finishTime={bed_data_3f[i]['finishTime']}
            infection_status={bed_data_3f[i]['infection_status']}
            showTimeStatus={this.state.show_time}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            exam_list={bed_data_3f[i]['exam_list']}
            injection_list={bed_data_3f[i]['injection_list']}
            dialprescription_list={bed_data_3f[i]['dialprescription_list']}
            prescription_list={bed_data_3f[i]['prescription_list']}
            refresh = {this.getSearchResult}
          />
        )
      } else {
        bed_area_3f_4.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            patientName={''}
            exam_status={0}
            injection_status={0}
            dialprescription_status={0}
            prescription_status={0}
            sendingPrescription={0}
            roundFinish_status={0}
            infection_status={''}
            dialTime={''}
            finishTime={''}
            showTimeStatus={this.state.show_time}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            refresh = {this.getSearchResult}
          />
        )
      }
    }
    let bed_area_3f_5 = [];
    if(bed_data_2f[37] != undefined && bed_data_2f[37] != null){
      bed_area_3f_5.push(
        <BedMonitorComponent
          key={37}
          bedId={''}
          bed_data={bed_data_2f[37]}
          patientName={bed_data_2f[37]['patient_name']}
          dialTime={bed_data_2f[37]['reservation_time']}
          exam_status={bed_data_2f[37]['exam_status']}
          injection_status={bed_data_2f[37]['injection_status']}
          dialprescription_status={bed_data_2f[37]['dialprescription_status']}
          prescription_status={bed_data_2f[37]['prescription_status']}
          sendingPrescription={bed_data_2f[37]['sendingPrescription']}
          roundFinish_status={bed_data_2f[37]['roundFinish_status']}
          finishTime={bed_data_2f[37]['finishTime']}
          infection_status={bed_data_2f[37]['infection_status']}
          showTimeStatus={this.state.show_time}
          handleClick = {this.handleClick}
          goBedside = {this.goBedside}
          patientNameHover = {this.patientNameHover}
          closeNameHover = {this.closeNameHover}
          view_content={this.state.view_content}
          width_fontsize={this.state.width_fontsize}
          height_fontsize={this.state.height_fontsize}
          exam_list={bed_data_2f[37]['exam_list']}
          injection_list={bed_data_2f[37]['injection_list']}
          dialprescription_list={bed_data_2f[37]['dialprescription_list']}
          prescription_list={bed_data_2f[37]['prescription_list']}
          refresh = {this.getSearchResult}
        />
      )
    }
    else {
      bed_area_3f_5.push(
        <BedMonitorComponent
          key={37}
          bedId={''}
          patientName={''}
          exam_status={0}
          injection_status={0}
          dialprescription_status={0}
          prescription_status={0}
          sendingPrescription={0}
          roundFinish_status={0}
          infection_status={''}
          dialTime={''}
          finishTime={''}
          showTimeStatus={this.state.show_time}
          patientNameHover = {this.patientNameHover}
          closeNameHover = {this.closeNameHover}
          view_content={this.state.view_content}
          width_fontsize={this.state.width_fontsize}
          height_fontsize={this.state.height_fontsize}
          refresh = {this.getSearchResult}
        />
      )
    }
    for (let i = 24; i < 26; i++) {
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_5.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            bed_data={bed_data_3f[i]}
            patientName={bed_data_3f[i]['patient_name']}
            dialTime={bed_data_3f[i]['reservation_time']}
            exam_status={bed_data_3f[i]['exam_status']}
            injection_status={bed_data_3f[i]['injection_status']}
            dialprescription_status={bed_data_3f[i]['dialprescription_status']}
            prescription_status={bed_data_3f[i]['prescription_status']}
            sendingPrescription={bed_data_3f[i]['sendingPrescription']}
            roundFinish_status={bed_data_3f[i]['roundFinish_status']}
            finishTime={bed_data_3f[i]['finishTime']}
            infection_status={bed_data_3f[i]['infection_status']}
            showTimeStatus={this.state.show_time}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            exam_list={bed_data_3f[i]['exam_list']}
            injection_list={bed_data_3f[i]['injection_list']}
            dialprescription_list={bed_data_3f[i]['dialprescription_list']}
            prescription_list={bed_data_3f[i]['prescription_list']}
            refresh = {this.getSearchResult}
          />
        )
      } else {
        bed_area_3f_5.push(
          <BedMonitorComponent
            key={i}
            bedId={i}
            patientName={''}
            exam_status={0}
            injection_status={0}
            dialprescription_status={0}
            prescription_status={0}
            sendingPrescription={0}
            roundFinish_status={0}
            infection_status={''}
            dialTime={''}
            finishTime={''}
            showTimeStatus={this.state.show_time}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            view_content={this.state.view_content}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
            refresh = {this.getSearchResult}
          />
        )
      }
    }
    
    return (
      <>
        <CustomDiv>
          <DialSideBar
            onGoto={this.selectPatient}
            history = {this.props.history}
          />
          <Card>
            <SearchPart>
              <div className="search-box" style={{fontSize:(this.state.width_fontsize*0.8)+"px"}}>
                <div className="title" style={{paddingLeft:(this.state.width_fontsize*0.5)+"px", paddingRight:this.state.width_fontsize+"px", fontSize:(this.state.width_fontsize*1.2)+"px"}}>透析状況モニタ</div>
                {this.status_monitor_mode == 0 ? (
                  <div className="cur_date">{this.getDateStr()}</div>
                ):(
                  <>
                    <div className="cur_date flex" style={{cursor:"pointer", width:"12rem"}}>
                      {this.state.schedule_date != "" && (
                        <>
                          <div className="prev-day" onClick={this.PrevDay} style={{paddingRight:(this.state.width_fontsize*0.5)+"px"}}>{"< "}</div>
                          <DatePicker
                            locale="ja"
                            selected={this.state.schedule_date}
                            onChange={this.getDate.bind(this)}
                            dateFormat="yyyy/MM/dd"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dayClassName = {date => setDateColorClassName(date)}
                            customInput={<ExampleCustomInput />}
                          />
                          <div className="next-day" onClick={this.NextDay} style={{paddingLeft:(this.state.width_fontsize*0.5)+"px"}}>{" >"}</div>
                        </>
                      )}
                    </div>
                    <div className="gender">
                      {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                        this.state.time_zone_list.map((item)=>{
                          return (
                            <>
                              <RadioButton
                                id={`male_${item.id}`}
                                value={item.id}
                                label={item.value}
                                name="usage"
                                getUsage={this.selectTimezone}
                                checked={this.state.timezone === item.id ? true : false}
                              />
                            </>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
                <div className={'select-view-content'}>
                  <SelectorWithLabel
                    options={view_content}
                    getSelect={this.setViewContent}
                  />
                </div>
                <div className={'select-view-time'}>
                  <SelectorWithLabel
                    options={show_time}
                    title="時間"
                    getSelect={this.getShowTimeSelect}
                  />
                </div>
                <div className={'link-area'}>
                  <div className="patient-count" style={{fontSize:this.state.width_fontsize+"px"}}>{this.state.used_bed_count}名</div>
                  <Button className="schedule-button" style={{marginRight:(this.state.width_fontsize*0.5)+"px"}} onClick={this.goSchedule}>スケジュール</Button>
                  <Button className="disable-button">透析状況モニタ</Button>
                  <Button onClick={this.goBedPage}>ベッド配置表</Button>
                </div>
              </div>
            </SearchPart>
            <Wrapper>
              {this.state.is_loaded ? (
                <div className={'bed-area flex'} id={'bed_area'}  style={{fontSize:(this.state.width_fontsize*0.8)+"px", marginTop:"1px"}}>
                  <div className={'area-2f'}>
                    <div className={'flex monitor-area'}>
                      <div className="left-area">
                        {bed_area_2f_1}
                      </div>
                      <div className={'middle-area'} style={{paddingTop:(this.state.height_fontsize*15.9)+"px"}}>
                        <div className="reception" style={{paddingLeft:(this.state.width_fontsize*2.5)+"px"}}>
                          <div className="reception-label" style={{height:(this.state.height_fontsize*1.4)+"px"}}></div>
                          <div className="reception-box" style={{height:(this.state.height_fontsize*1.875)+"px", lineHeight:(this.state.height_fontsize*1.875)+"px", fontSize:this.state.width_fontsize+"px"}}>スタッフ</div>
                        </div>
                        <div
                          className={'room-name'}
                          style={{
                            fontSize:(this.state.width_fontsize*3.75)+"px",
                            paddingTop:(this.state.height_fontsize*1.875)+"px",
                            height:(this.state.height_fontsize*12.1)+"px",
                          }}
                        >2F</div>
                      </div>
                      <div className="right-area">
                        {bed_area_2f_2}
                      </div>
                    </div>
                    <div className={'preview-btn'}>
                      <Button className="red-btn" onClick={this.openPrintPreview.bind(this)}>帳票プレビュー</Button>
                    </div>
                  </div>
                  <div className="black-box" style={{height:(this.state.height_fontsize*62.8)+"px"}}> </div>
                  <div className={'area-3f flex'}>
                    <div className="left-area">
                      {bed_area_3f_1}
                      <div className={'space-3f-5'} style={{height:(this.state.height_fontsize*15.9)+"px"}}> </div>
                      {bed_area_3f_5}
                    </div>
                    <div className={'middle-area'}>
                      {bed_area_3f_2}
                      <div className={'space-3f-4'} style={{height:(this.state.height_fontsize*15.7)+'px'}}> </div>
                      {bed_area_3f_4}
                    </div>
                    <div className="right-area">
                      {bed_area_3f_3}
                    </div>
                  </div>
                </div>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
            <ContextMenu
              {...this.state.contextMenu}
              edit_bed_data={this.state.edit_bed_data}
              parent={this}
            />
            <HoverMenu
              {...this.state.hoverMenu}
              bed_data={this.state.bed_data}
              parent={this}
            />
          </Card>
          {this.state.isOpenPrintPreviewModal && (
            <StatusPrintPreview
              closeModal = {this.closeModal}
              bed_data_2f = {this.state.bed_data_2f}
              bed_data_3f = {this.state.bed_data_3f}
              used_bed_count = {this.state.used_bed_count}
              show_time = {this.state.show_time}
              view_content = {this.state.view_content}
              schedule_date = {formatDateLine(this.state.schedule_date)}
              timezone = {this.state.timezone}
              time_zone_list = {this.state.time_zone_list}
            />
          )}
        </CustomDiv>
      </>
    )
  }
}

StatusMonitor.contextType = Context;

StatusMonitor.propTypes = {
  history: PropTypes.object
};

export default StatusMonitor;