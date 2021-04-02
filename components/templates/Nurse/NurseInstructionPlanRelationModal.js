import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
// import ja from "date-fns/locale/ja";
// import DatePicker, { registerLocale } from "react-datepicker";
// registerLocale("ja", ja);
import {formatDateLine, getWeekName, formatDateFull, formatDateTimeIE} from "~/helpers/date";
import axios from "axios/index";
import {
  formatJapan,
  getNextDayByJapanFormat,
  getNextMonthByJapanFormat,
  getPrevDayByJapanFormat,
  getPrevMonthByJapanFormat,
  // formatDateSlash
} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Button from "~/components/atoms/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import NurseInstructionList from "./NurseInstructionList";
import NurseInstructionAdd from "./NurseInstructionAdd";
import NurseProblemListModal from "./NurseProblemListModal";
import NurseInstructionStopResultModal from "./NurseInstructionStopResultModal";
import Spinner from "react-bootstrap/Spinner";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as colors from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import renderHTML from 'react-render-html';

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 15px;
  margin-right: 5px;
`;

const SpinnerWrapper = styled.div`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    width: 54%;
    float:right;
    font-size:1rem;
    .flex {
      display: flex;
    }
    .pullbox-label {
      margin-bottom: 0;
      .pullbox-select {
        width: 10rem;
        height: 2rem;   
      }
    }
    .border-style{
      border-bottom: 1px solid #aaa;
    }
    .label-title {
      width: 5rem;
      line-height: 2rem;
      margin: 0;
      font-size:1rem;
    }
    .btn-area{
      text-align:left;      
      button {
       height:2rem;
      }
    }
    .select-date {
      .date-label {
        height:2rem;
        line-height:2rem;
        margin-right:0.5rem;
        padding-top: 0.1rem;
      }
      button {
        height:2rem;
        margin-right:0.5rem;
        padding-bottom: 0.1rem;
      }
      .view-date {
        padding:0 0.3rem;
        height:2rem;
        line-height:2rem;
        border:1px solid #aaa;
      }
      .check-area {
        label {
          line-height: 2rem;
          font-size: 1rem;
        }
      }
    }
    .select-schedule-date .label-title {
        text-align: left;
        width: 40px;
    }
    
    .calendar-area {
      margin: auto;
      width: 100%;
      height: calc(100% - 6rem);
      .wrapper {
        position: relative;
        overflow: auto;
        border: 1px solid #aaa;
        white-space: nowrap;
        width: 100%;
      }
      table {
        margin-bottom:0;
        th {
          text-align: center;
          vertical-align: middle;
          padding:0;
        }
        td {
          padding:0 0.2rem;
          vertical-align: middle;
          word-break: break-all;
        }
      }
      .sticky-col {
        position: sticky;
        position: -webkit-sticky;
        background-color: white;
        padding: 0;
        div {
          padding:0 0.2rem;
        }
      }
      .td-number {
        width: 2rem;
        min-width: 2rem;
        max-width: 2rem;
        left: 0px;
        div{
          width: 2rem;
          min-width: 2rem;
          max-width: 2rem;
        }
      }
      .td-tree-content {
        width: 15rem;
        min-width: 15rem;
        max-width: 15rem;
        left: 2rem;
        div{
          width: 15rem;
          min-width: 15rem;
          max-width: 15rem;
        }
      }
      .no-border {
        border: none !important;
      }
      .tree-td {
        border-bottom-color: white;
        border-top-color: white;
        padding-left: 1.5rem;
      }
      .tree-td-top {
        border-bottom-color: white;
        border-top-color: white;
      }
      .td-div-border {
        border-right:1px solid #dee2e6;
        line-height:2.5rem;
        width:100%;
      }      
      .tree-area{
        height:100%;
        overflow-y:auto;
        ul, li{
          list-style:none;
          padding-inline-start:1rem;
        }
        .detail-show-icon {
          cursor: pointer;
        }
      }
      .clickable{
        cursor:pointer;
      }
    }
`;

const Popup = styled.div`
  width: 45%;
  float: left;
    .flex {
      display: flex;
    }
    height: 96%;
  
    h2 {
      color: ${colors.onSurface};
      font-size: 1.1rem;
      font-weight: 500;
      margin: 6px 0;
    }

    .spinner-disease-loading{
      height: 20rem;
      overflow-y: auto;      
    }
    .table-scroll {
      width: 100%;
      height: 100%;
      max-height: 190px;

      .no-result {
        padding: 75px;
        text-align: center;

        p {
          padding: 10px;
          border: 2px solid #aaa;
        }
      }
    }
    
    .disease-header{
      .department-status{
        .pullbox-title{
          font-size: 1rem;
        }
      }
      overflow: hidden;
      display:flex;   
      margin-bottom:1rem   
    }    
      
    .label-title {
      float: left;
      text-align: right;
      width: 6rem;
      font-size: 1.2rem;
      margin-top: 0;
      &.pullbox-title {
        margin-right: 0.5rem;
      }
    }
    .tree_close{
      display:none;
    }
    
    .tree-area{
      margin-top:10px;
      height:85%;
      overflow-y:auto;
      ul, li{
        list-style:none;
        padding-inline-start:1rem;
      }
      .clickable:hover{
        background: #eee;
      }
    }
    .sel-star{
      position: absolute;
      left: 1rem;
    }

    .sel-li{
      background: #ddd;
    }

    .selected{
      background: lightblue;
    }

    .clickable{
      cursor:pointer;
    }
    .select-area{
      margin-right:2rem;
    }

    .center {
      text-align: center;
      button {
        height: 25px;
        padding: 0;
        line-height: 25px;
        span {
          color: ${colors.surface};
        }
      }
  
      span {
        color: rgb(241, 86, 124);
      }
  
      .black {
        color: #000;
      }
    }
    .red {
      color: rgb(241, 86, 124);
    }

    .table-title {
    margin-top: 0.5rem;
    label {
        margin-bottom: 0;
    }
    .table-name {
        border: 1px solid #aaa;
        width: 180px;
        text-align: center;
    }
    .table-color {
        width: 100px;
        text-align: center;
    }
    .table-request {
        width: 50px;
        text-align: center;
    }
    .table-ok {
        width: 50px;
        text-align: center;
        border: 1px solid #aaa;
    }
}

.table-area {
  .reflect-btn{
    margin-left:90%;
    margin-bottom:2px;
  }
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
    
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;        
      border: 1px solid #dee2e6;
      tr{
          width: calc(100% - 17px);
      }
    }
    tbody{
      height: 76.5vh;
      overflow-y: scroll;
      display:block;
      // tr:nth-child(even) {background-color: #f2f2f2;}
      // tr:hover{background-color:#e2e2e2;}
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: left;
        vertical-align: middle;
        word-break: break-all;
        label{
          margin-right:0;
        }
        input{
          margin-right:0;
        }
    }
    th {
        text-align: center;
        padding: 0.3rem;
        background-color: rgb(160, 235, 255);
    }      
    .tl {
        text-align: left;
    }      
    .tr {
        text-align: right;
    }
    .white-row:hover {background-color: #f2f2f2;}
    .purple-row {
      background-color: #A757A8;
      color:white;
    }
    .purple-row:hover {
      background-color: #f377f5;
      color:white;
    }
    .pink-row {
      background-color: #F8ABA6;
      color:white;
    }
    .pink-row:hover {
      background-color: #fb8078;
      color:white;
    }
}
.react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
}
    
  `;

const ContextMenuUl = styled.div`
  margin-bottom: 0;
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
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 16px;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    svg {
      width: 2.2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({visible,x,y,instruction_item, cur_date,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            <li><div onClick={() => parent.contextMenuAction('create', instruction_item)}>指示入力</div></li>
            {cur_date != undefined ? (
              <li><div onClick={() => parent.contextMenuAction('stop_one', instruction_item)}>止め</div></li>
            ): (<></>)}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class NurseInstructionPlanRelationModal extends Component {
    constructor(props) {
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        let department_codes = [{id:0, value:"全て"}];
        this.diagnosis = {};
        departmentOptions.map(department=>{
          department_codes.push(department);
          this.diagnosis[parseInt(department.id)] = department.value;
        });
        this.holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
        this.display_content=["伝票","項目", "全て"];
        this.stop_type=['指示中全ての止め処理を行う。', '指示中の選択項目のみ止め処理を行う。'];

        let problem_list = this.props.problem_list;
        let order_list = [];
        if (problem_list != undefined && problem_list.length > 0){
          problem_list.map(item => {
            item.plan_data.map(sub_item => {
              if(sub_item.instruction_name != null){
                order_list.push({
                  system_patient_id:this.props.patientId,
                  hospitalization_id:this.props.patientInfo.hospitalization_id,
                  name:item.name,
                  item_level_id:sub_item.item_level_id,
                  plan_master_name:sub_item.name,
                  instruction_slip_name:sub_item.instruction_slip_name,                
                  instruction_name:sub_item.instruction_name,
                  time_designation_name:sub_item.time_designation_name,
                  number_of_times_per_day_name:sub_item.number_of_times_per_day_name,
                  time_interval_name:sub_item.time_interval_name,
                  problem_number:item.number,
                  implementation_interval_class:sub_item.implementation_interval_class,
                  number_of_interval:sub_item.number_of_interval,
                  weekly_bit:sub_item.weekly_bit,
                  time_designation:sub_item.time_designation,
                  number_of_times_per_day:sub_item.number_of_times_per_day,
                  time_interval:sub_item.time_interval,
                  evaluation_name:item.evaluation_name,
                  evaluation_class_date:sub_item.evaluation_class_date,
                  next_evaluate_date:item.next_evaluate_date,
                  comment:item.comment,
                  is_checked:false,
                })
              }
            })
          })
        }
        
        this.usage_interval_class = {
          1:"単日",
          2:"毎日",
          3:"毎週"
        };


        this.state = {
          guidance_date:(props.guidance_date !== undefined && props.guidance_date != null) ? new Date(props.guidance_date) : new Date(),
          department_id:0,
          department_codes,
          ward_master:[],
          first_ward_id:1,
          table_data:[],
          confirm_message:"",
          alert_messages:"",
          display_content: 2,
          addInstructionModal: false,
          createInstructionModal: false,
          isOpenStopInstructionsModal: false,
          data_tree: [],
          stopInstrucitonModal: false,
          confirm_title: '',
          end_date: new Date(),
          stop_type: 0,
          is_loaded: false,
          order_list: order_list,
          isLoaded: true,
          discharge_info:null,
          isSaveConfirmModal:false,
        };
    }

    async componentDidMount() {      
      await this.getHolidays();
      await this.getPatientDischargeInfo();
      await this.getSearchResult();
    }

    getPatientDischargeInfo = async () => {
      let path = "/app/api/v2/in_out_hospital/in_hospital/get_discharge_info";
      let post_data = {
        patient_id: this.props.patientId,
      };
      await apiClient._post(path, {params: post_data}).then((res) => {
        if (res.result != "no_exist") {                    
          this.setState({
            discharge_info: res.result
          });
        } else {
          this.setState({
            discharge_info: null
          });
        }
      });
    }

    getSearchResult = async() => {
      let path = "/app/api/v2/nurse/search_nurse_instruction";
      let post_data = {patient_id: this.props.patientId,search_date: formatDateLine(this.state.guidance_date)};
      await apiClient.post(path, post_data)
      .then((res) => {
        if (res.alert_message) {
          this.setState({
            alert_messages: res.alert_message,
            is_loaded: true,
            close_main: true
          });
          return;
        }
        this.setState({
          data_tree:res,
          is_loaded: true,
        })
      });
    }
    moveDay = (type) => {
      let now_day = this.state.guidance_date;
      if(now_day === ''){
        now_day = new Date();
      }
      let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);

      this.setState({
        guidance_date: cur_day,
        is_loaded: false,
      }, ()=>{
        this.getSearchResult();
      });
    };
    moveMonth = (type) => {
      let now_month = this.state.guidance_date;
      let cur_month = type === 'next' ? getNextMonthByJapanFormat(now_month) : getPrevMonthByJapanFormat(now_month);
      this.setState({
        guidance_date: cur_month,
        is_loaded: false,
      },()=>{
        this.getSearchResult();
      });
    };
    async getHolidays(){
      let now_date = this.state.guidance_date;
      let year = now_date.getFullYear();
      let month = now_date.getMonth();
      let from_date = formatDateLine(new Date(year, month, 1));
      let end_date = formatDateLine(new Date(year, month+1, 0));
      let path = "/app/api/v2/dial/schedule/get_holidays";
      let post_data = {
        start_date: from_date,
        end_date:end_date,
      };
      await axios.post(path, {params: post_data}).then((res)=>{
        this.setState({holidays:Object.keys(res.data)});
      })
    }
    selectToday=()=>{
      this.setState({
        guidance_date: new Date(),
      });
    };
    setBackcolor = (date, day_of_week) => {
      let holidays = this.state.holidays;
      if (holidays == undefined || holidays == null || holidays.length == 0 || !holidays.includes(date)){
        if (this.holidays_color.days[day_of_week] == undefined || this.holidays_color.days[day_of_week] == null){
            return this.holidays_color.default.schedule_date_cell_back;
        } else {
            return this.holidays_color.days[day_of_week].schedule_date_cell_back;
        }
      } else {
        return this.holidays_color.holiday.schedule_date_cell_back;
      }
    };
    setFontcolor = (date, day_of_week) => {
      let holidays = this.state.holidays;
      if (holidays == undefined || holidays == null || holidays.length > 0 || !holidays.includes(date)){
          if (this.holidays_color.days[day_of_week] == undefined || this.holidays_color.days[day_of_week] == null){
              return this.holidays_color.default.schedule_date_cell_font;
          } else {
              return this.holidays_color.days[day_of_week].schedule_date_cell_font;
          }
      } else {
          return this.holidays_color.holiday.schedule_date_cell_font;
      }
    };
    checkDate(from, to) {
      from = new Date(from);
      to = new Date(to);
      if (from.getTime() > to.getTime()) return false;
      return true;
    }
    getTdState = (item,cur_date) => {      
      if (item.instruction_info != undefined) {        
        let instruction = item.instruction_info;         
        let start_date = '';
        let end_date = '';
        let stop_date = '';
        if (instruction.start_date != undefined && instruction.start_date != null){          
          start_date = formatDateLine(formatDateTimeIE(instruction.start_date));
        }
        if (instruction.end_date != undefined && instruction.end_date != null && instruction.end_date != '') {
          end_date = formatDateLine(formatDateTimeIE(instruction.end_date));
        }
        let schedule_dates = instruction.schedule_dates;        
        if (schedule_dates == undefined || schedule_dates.length == 0) return "";
        if (instruction.instruction_stop_date != null && instruction.instruction_stop_date != '') {
          stop_date = instruction.instruction_stop_date.substring(0,10);
        }        
        if (start_date == cur_date) return "〇";
        if (end_date == cur_date || stop_date == cur_date) return "▲";
        if (this.checkDate(start_date, cur_date)) {
          if (end_date == '' && schedule_dates.indexOf(cur_date)>-1) return "➝";
          if (this.checkDate(cur_date, end_date)) {
            if (stop_date != '' && !this.checkDate(cur_date, stop_date)) {
              return '';
            }
            if (schedule_dates.indexOf(cur_date)>-1){
              return "➝";
            }
            else return "";
          } else {
            return '';
          }
        }
      }
      return '';
    }
    getDate = (key,value) => {
      this.setState({[key]: value});
    }
    createTable = (type, item=null) => {
      let start_date = new Date(this.state.guidance_date);
      let now_year = start_date.getFullYear();
      let now_month = start_date.getMonth()+1;
      let date_number = start_date.getDate();
      let table_menu = [];
      
      let tmp_month = now_month < 10 ? '0' + now_month : now_month;
      let tmp_date = (date_number) < 10 ? '0' + (date_number) : (date_number);
      let tmp_cur_date = now_year + '-' + tmp_month + '-' + tmp_date;
      let tmp_new_date = new Date(tmp_cur_date);
      let yesterday = new Date(tmp_new_date.setDate(tmp_new_date.getDate()));
      if(type === 'thead' || type === 'tbody'){
          let while_condition = 0;
          do {
              now_year = yesterday.getFullYear();
              now_month = yesterday.getMonth()+1;
              date_number = yesterday.getDate();
              if(getWeekName(now_year, (now_month), (date_number)) === undefined){
                  date_number = 1;
                  if(now_month == 12){
                      now_month = 1;
                      now_year++;
                  } else {
                      now_month++;
                  }
              }
              let month = now_month < 10 ? '0' + now_month : now_month;
              let date = (date_number) < 10 ? '0' + (date_number) : (date_number);
              let cur_date = now_year + '-' + month + '-' + date;
              if(type === 'thead'){
                let week = new Date(cur_date).getDay();
                table_menu.push(
                  <th style={{background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week)}}>
                    <div style={{textAlign:"center"}}>{month +'/'+date}</div>
                    <div style={{textAlign:"center"}}>{'（'+getWeekName(now_year, now_month, (date_number))+'）'}</div>
                  </th>
                )
              }
              if(type === 'tbody') {                
                  table_menu.push(
                    <>
                      {item != null ? (
                        <>
                        <td onContextMenu={e => this.handleClick(e, item, cur_date)} className="text-center">
                          {this.getTdState(item, cur_date)}
                        </td>
                        </>
                      ):(
                        <>
                          <td></td>
                        </>
                      )}
                    </>
                  );
              }
              date_number++;
              yesterday = new Date(yesterday.setDate(yesterday.getDate()+1));
              while_condition ++;
          } while (while_condition < 7);
      }
      return table_menu;
    };
    handleClick=(e, instruction_item, cur_date)=>{
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
        if (this.getTdState(instruction_item, cur_date) == '') cur_date = undefined;
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - document.getElementById("nutrition_guidance_schedule").offsetLeft,
            y: e.clientY + window.pageYOffset,
            instruction_item,
            cur_date
          },
          cur_date
        })
      }
    };
    contextMenuAction = (act, instruction_item) => {
      if (act == 'create') {
        this.setState({
          createInstructionModal: true,
          selected_instruction_item: instruction_item
        });
      } else if (act == 'stop_one') {
        this.setState({
          confirm_message: '指示を止めてもよろしいですか？',
          confirm_action: 'stop_one',
          confirm_title: '指示止め確認メッセージ',
          selected_instruction_item: instruction_item,
          end_date: new Date(this.state.cur_date)
        });
      }
    };
    closeModal=(refresh = null)=>{
      this.setState({
        addInstructionModal:false,
        createInstructionModal:false,        
        selected_instruction_item: null,
        stopInstrucitonModal: false,
        openProblemlist: false,
        confirm_message:"",
        confirm_type:"",
        alert_messages:"",
        confirm_title:'',
        isSaveConfirmModal:false,
      });
      if (this.state.close_main) {
        this.props.closeModal();
      }
      if (refresh == 1){
        this.getSearchResult();
      }
    };
    confirmOk=()=>{
      this.setState({
        confirm_message: '',
        stopInstrucitonModal: true
      });
    };
    maincloseModal = () => {
      this.props.closeModal();
    };
    setValue = (key,e) => {
        this.setState({[key]: e.target.value});
    };
    addInstruction = () => {
      this.setState({addInstructionModal: true});
    };
    onHide= () => {};
    showDetail = (index) => {
      let data_tree = this.state.data_tree;
      data_tree[index].detail_show = data_tree[index].detail_show == 1 ? 0 : 1;
      this.setState({data_tree});
    }
    allStop = () => {
      this.setState({
        confirm_message: '指示を止めてもよろしいですか？',
        confirm_action: 'stop_all',
        confirm_title: '指示止め確認メッセージ'
      });
    };

    stopInstruction = async() => {
      if (this.state.confirm_action == "stop_one" && this.state.end_date == '') {
        window.sessionStorage.setItem("alert_messages", "終了日を選択してください。");
        return;
      }
      let post_data = {
        patient_id: this.props.patientId,
        stop_action: this.state.confirm_action,
        end_date: formatDateFull(this.state.end_date, "-"),
        stop_type: this.state.stop_type,
        item_level_id: this.state.selected_instruction_item != undefined ? this.state.selected_instruction_item.number : undefined
      }
      let path = "/app/api/v2/nurse/stop_nurse_instruction";
      await apiClient.post(path, {params: post_data})
        .then((res) => {
          if (res.alert_message != undefined) {
            window.sessionStorage.setItem("alert_messages", res.alert_message);
            this.closeModal(1);
          }
        })
        .catch(() => {
          this.closeModal();
        });
    }
    mainOk = () => {
      if (this.save_available != true) {
        this.setState({
          alert_messages:'反映する項目がありません。'
        })
        return;
      }
      this.setState({
        isSaveConfirmModal:true,
        confirm_message:"保存しますか？",
        confirm_title:'保存確認'
      });
    }

    // 前回入院分止め処理
    stopBeforeHospital = () => {
      
      let cur_date = new Date();
      let discharge_info = this.state.discharge_info;

      /*①その患者の、現在より前で一番新しい退院実施日時を取得する。
      ・現在より前の退院実施日時が存在しなければ「前回入院情報はありません」アラートで終了*/
      if (discharge_info == null) {
        // window.sessionStorage.setItem("alert_messages", "前回入院情報はありません。");
        this.setState({
          alert_messages: "前回入院情報はありません。"
        });
        return;
      }

      let discharge_date = discharge_info.discharge_date;
      if (discharge_date != undefined && discharge_date != null && discharge_date != "") {
        discharge_date = new Date(discharge_date.substring(0, 10));        
        if (discharge_date > cur_date) {          
          // window.sessionStorage.setItem("alert_messages", "前回入院情報はありません。");
          this.setState({
            alert_messages: "前回入院情報はありません。"
          });
          return;
        }        
      }

      /*②開始日が前回退院実施日時より前で、終了が退院日時より後or無期限の指示を取得
      ・存在しなければ「止め処理されていない指示はありません」アラートで終了。*/

      // check instructions with condition
      let instruction_condition = this.getInstructionConditionForDischarge(discharge_date);
      if (instruction_condition.status != true) {
        // window.sessionStorage.setItem("alert_messages", "止め処理されていない指示はありません。");
        this.setState({
          alert_messages: "止め処理されていない指示はありません。"
        });
        return;
      }

      // ③該当の指示の終了日時を、退院実施日時と同じ値にする＝前回の退院日時で終了させる。
      this.handleStopBeforeHospital(discharge_date, instruction_condition.result);

    }

    getInstructionConditionForDischarge = (_date) => {
      
      let result = {
        status: false,
        result:[]
      };

      let data_tree = this.state.data_tree;
      if(data_tree == undefined || data_tree == null || data_tree.length < 1) return result;

      data_tree.map(item=>{
        if (item.detail.length > 0 && item.detail_show == 1) {
          item.detail.map(sub_item=>{
            if (sub_item.instruction_info != undefined && sub_item.instruction_info != null) {
              let start_date = null;
              let end_date = null;
              if (sub_item.instruction_info.start_date != null && sub_item.instruction_info.start_date != undefined && sub_item.instruction_info.start_date != "") {
                start_date = new Date(sub_item.instruction_info.start_date);
              }
              if (start_date != null && _date > start_date) {                            
                if (sub_item.instruction_info.end_date != null && sub_item.instruction_info.end_date != undefined && sub_item.instruction_info.end_date != "") {
                  end_date = new Date(sub_item.instruction_info.end_date);                  
                }
                if (end_date == null || end_date > _date) {
                  result.status = true;
                  result.result.push(sub_item.instruction_info);
                }
              }
            }
          });
        }
      });

      return result;
    }

    handleStopBeforeHospital = async (discharge_date, instruction_array) => {
      if (instruction_array == undefined || instruction_array == null || instruction_array.length < 1) return;
      
      let params_array = [];
      instruction_array.map(item=>{
        let _state = {
          end_date: this.state.discharge_info.discharge_date,
          item_level_id: item.item_level_id,
          patient_id: this.props.patientId,
          stop_action: "stop_one",
          stop_type: 0
        };
        params_array.push(_state);
      });

      let post_data = {
        params: {patient_id:this.props.patientId},
        instructions_array: params_array,
        stop_type: "instructions_array"
      };

      post_data.params.type = "array";

      let path = "/app/api/v2/nurse/stop_nurse_instruction";
      await apiClient.post(path, post_data)
        .then((res) => {
          if (res.alert_message != undefined) {
            if (res.alert_message == "instructions_stop_success" && res.ret_data.length > 0) {  
              // ④「下記の指示の止め処理を行いました」メッセージと終了させた指示の一覧を完了アラートで表示。                        
              this.setState({
                isOpenStopInstructionsModal: true,
                instructions_array: res.ret_data
              });
            }
            // window.sessionStorage.setItem("alert_messages", res.alert_message);
            this.closeModal(1);
          }
        })
        .catch(() => {
          this.closeModal();
        });
      // handleStopBeforeHospital
      /*let post_data = {
        patient_id: this.props.patientId,
        stop_action: this.state.confirm_action,
        end_date: formatDateFull(this.state.end_date, "-"),
        stop_type: this.state.stop_type,
        item_level_id: this.state.selected_instruction_item != undefined ? this.state.selected_instruction_item.number : undefined
      }
      let path = "/app/api/v2/nurse/stop_nurse_instruction";
      await apiClient.post(path, {params: post_data})
        .then((res) => {
          if (res.alert_message != undefined) {
            window.sessionStorage.setItem("alert_messages", res.alert_message);
            this.closeModal(1);
          }
        })
        .catch(() => {
          this.closeModal();
        });*/
    }

    cancelInstructionsArray = () => {
      this.setState({
        isOpenStopInstructionsModal:false,
      });
    }

    getRadio(index, name, value) {
      var order_list = this.state.order_list;
      if (name == 'check'){
        order_list[index].is_checked = value;
      }
      this.setState({order_list});
    }

    applyPlan = () => {
      if (this.save_available != true) {
        this.setState({
          alert_messages:'反映する項目がありません。'
        })
        return;
      }
      var order_list = this.state.order_list;
      var checked_list = [];
      if (order_list.length > 0){
        order_list.map(item => {
          if (item.is_checked == true) {
            checked_list.push(item);
            this.applyToInstruction(item);
          }
        })
      }
      this.setState({
        checked_list,
        alert_messages:"看護指示に反映しました。"
      });
    }
    applyToInstruction (item) {
      if (this.state.data_tree == undefined || this.state.data_tree == null || this.state.data_tree.length == 0) return;
      this.state.data_tree.map(val => {
        if (val.detail != undefined && val.detail != null && val.detail.length > 0){
          val.detail.map(sub_item => {
            if (sub_item.number == item.item_level_id){
              if (sub_item.instruction_info == undefined) sub_item.instruction_info = {};
              if (sub_item.instruction_info.schedule_dates == undefined) sub_item.instruction_info.schedule_dates = [];
              sub_item.instruction_info.start_date = item.evaluation_class_date;
              sub_item.instruction_info.schedule_dates.push(formatDateLine(formatDateTimeIE(item.evaluation_class_date)));              
            }
          })
        }
      })      
    }

    saveOk = () => {
      this.closeModal();
      if (this.state.checked_list == undefined || this.state.checked_list == null){
        if (this.save_available != true) {
          this.setState({
            alert_messages:'反映する項目がありません。'
          })
          return;
        }
        var order_list = this.state.order_list;
        var checked_list = [];
        if (order_list.length > 0){
          order_list.map(item => {
            if (item.is_checked == true) {
              checked_list.push(item);
              this.applyToInstruction(item);
            }
          })
        }
        this.props.applyPlan(checked_list);
      } else {
        this.props.applyPlan(this.state.checked_list);
      }
      
    }

    render() {
      this.save_available = false;
      if (this.state.order_list.length > 0){
        this.state.order_list.map(item => {
          if (item.is_checked) this.save_available = true;
        })
      }
        return (
            <>
              <Modal show={true} className="custom-modal-sm patient-exam-modal nurse-instruction-schedule first-view-modal" id="nutrition_guidance_schedule" onHide={this.onHide}>
                <Modal.Header><Modal.Title>指示一覧</Modal.Title></Modal.Header>
                <Modal.Body>
                    <>
                      <Popup>                        
                <div className={'table-area'}>
                  <button className='reflect-btn' onClick={this.applyPlan.bind(this)}>反映</button>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      <th style={{width:"2rem",textAlign:"center"}}></th>
                      <th style={{width:"10rem"}}>看護計画</th>
                      <th style={{width:"7rem"}}>伝票</th>
                      <th>看護指示項目</th>
                      <th style={{width:"3rem"}}>No</th>
                      <th style={{width:"3rem"}}>区分</th>
                      <th style={{width:"7rem"}}>用法</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.isLoaded == false ? (
                        <div className='spinner-disease-loading center'>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                      </div>
                    ):(
                      <>
                        {this.state.order_list.length > 0 && (
                          this.state.order_list.map((order, index)=>{                            
                            return (
                              <>
                                <tr>                      
                                  <td style={{width:"2rem",textAlign:"center"}}>
                                    <Checkbox
                                      label=""
                                      getRadio={this.getRadio.bind(this, index)}                                      
                                      value={order.is_checked}
                                      name="check"
                                    />
                                  </td>
                                  <td style={{width:"10rem"}}>{order.plan_master_name}</td>
                                  <td style={{width:"7rem"}}>{order.instruction_slip_name}</td>
                                  <td>{order.instruction_name}</td>
                                  <td style={{width:"3rem"}}>#{order.problem_number}</td>
                                  <td style={{width:"3rem"}}>追加</td>
                                  <td style={{width:"7rem"}}>
                                    {this.usage_interval_class[order.implementation_interval_class]}
                                    {order.time_designation_name != undefined && order.time_designation_name != null && order.time_designation_name != ''?renderHTML('<br/>' + order.time_designation_name):''}
                                    {order.number_of_times_per_day_name != undefined && order.number_of_times_per_day_name != null && order.number_of_times_per_day_name != ''?renderHTML('<br/>' + order.number_of_times_per_day_name):''}
                                    {order.time_interval_name != undefined && order.time_interval_name != null && order.time_interval_name != ''?renderHTML('<br/>' + order.time_interval_name):''}
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
              </Popup>
                      <Wrapper>
                          <div className={'select-date flex'} style={{marginBottom:"0.5rem"}}>
                            <div className={'date-label'}>日付</div>
                            <button style={{paddingBottom:"1.5rem"}} onClick={this.moveMonth.bind(this, 'prev')}>{'<<'}</button>
                            <button style={{paddingBottom:"1.5rem"}} onClick={this.moveDay.bind(this, 'prev')}>{'<'}</button>
                            <button style={{paddingBottom:"0px", paddingTop:"0.2rem"}} onClick={this.selectToday}>{'本日'}</button>
                            <button style={{paddingBottom:"1.5rem"}} onClick={this.moveDay.bind(this, 'next')}>{'>'}</button>
                            <button style={{paddingBottom:"1.5rem"}} onClick={this.moveMonth.bind(this, 'next')}>{'>>'}</button>
                            <div className={'view-date'}>{formatJapan(this.state.guidance_date)}</div>
                            {/* <div className="d-flex ml-5">
                              <label className="label-title">表示内容</label>
                              {this.display_content.map((item,index) => {
                                  return (
                                      <div key={index} className="check-area">
                                      <Radiobox
                                          label={item}
                                          value={index}
                                          getUsage={this.setValue.bind(this, "display_content")}
                                          checked={this.state.display_content == index ? true : false}
                                          name="display_content"
                                      />
                                      </div>
                                  )
                              })}
                            </div> */}
                          </div>
                          {/* <div className={'flex'} style={{marginBottom:"0.5rem"}}>
                              <div className={'btn-area'}>
                                <button onClick={this.addInstruction.bind(this)}>指示追加</button>
                                <button style={{marginLeft:"0.5rem"}} onClick={this.allStop.bind(this)}>一括止め処理</button>
                                <button style={{marginLeft:"0.5rem"}} onClick={this.stopBeforeHospital}>前回入院分止め処理</button>
                              </div>
                          </div> */}
                          {this.state.is_loaded ? (
                            <div className={'calendar-area flex'}>
                              <div className="wrapper">
                                <table className="table-scroll table table-bordered" id="code-table">
                                  <thead>
                                    <tr>
                                      <th className="sticky-col td-number">
                                        <div className="td-div-border"></div>
                                      </th>
                                      <th className="sticky-col td-tree-content">
                                        <div className="td-div-border"></div>
                                      </th>
                                      {this.createTable('thead')}
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {this.state.data_tree != undefined && this.state.data_tree.length > 0 && this.state.data_tree.map((item,index)=>{                                    
                                    return (
                                      <>
                                        <tr key={index}>
                                          <td className="sticky-col td-number">
                                            <div className="td-div-border">{` `}</div>
                                          </td>
                                          <td className={`sticky-col td-tree-content  ${index != this.state.data_tree.length -1 ? 'tree-td-top' : ''}`}>
                                            <div className="td-div-border tree-area">
                                            {item.detail_show == 1 ? (
                                              <Icon icon={faMinus} onClick={this.showDetail.bind(this, index)} style={{cursor:"pointer"}}/>
                                            ):(
                                              <Icon icon={faPlus} onClick={this.showDetail.bind(this, index)} style={{cursor:"pointer"}}/>
                                            )}
                                              <label >【{item.name}】</label>
                                            </div>
                                          </td>
                                          {this.createTable('tbody')}
                                        </tr>
                                        {item.detail.length > 0 && item.detail_show == 1 ? (
                                          <>
                                            {item.detail.map((sub_item,sub_key)=>{
                                              return(
                                                <tr key={sub_key}>
                                                  <td className="sticky-col td-number">
                                                    <div className="td-div-border">{` `}</div>
                                                  </td>
                                                  <td className="sticky-col td-tree-content tree-td">
                                                    <div className="td-div-border tree-area no-border">{sub_item.name}</div>
                                                  </td>
                                                  {this.createTable('tbody', sub_item)}
                                                </tr>
                                              )
                                            })}
                                          </>
                                        ):(<></>)}
                                      </>
                                    )
                                  })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ):(
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          )}
                      </Wrapper>
                    </>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.maincloseModal}>閉じる</Button>
                  <Button className="red-btn" onClick={this.mainOk}>確定</Button>
                </Modal.Footer>
                <ContextMenu
                  {...this.state.contextMenu}
                  parent={this}
                />
                {this.state.confirm_message !== "" && (
                  <SystemConfirmJapanModal
                    hideConfirm= {this.closeModal.bind(this)}
                    confirmCancel= {this.closeModal.bind(this)}
                    confirmOk= {this.confirmOk.bind(this)}
                    confirmTitle= {this.state.confirm_message}
                    title={this.state.confirm_title}
                  />
                )}
                {this.state.isSaveConfirmModal && (
                  <SystemConfirmJapanModal
                    hideConfirm= {this.closeModal.bind(this)}
                    confirmCancel= {this.closeModal.bind(this)}
                    confirmOk= {this.saveOk.bind(this)}
                    confirmTitle= {this.state.confirm_message}
                    title={this.state.confirm_title}
                  />
                )}
                {this.state.addInstructionModal && (
                  <NurseInstructionList
                    cache_index={this.props.cache_index}
                    patientInfo={this.props.patientInfo}
                    closeModal={this.closeModal}
                    patientId={this.props.patientId}
                  />
                )}
                {this.state.createInstructionModal && this.state.selected_instruction_item != null && this.state.selected_instruction_item != undefined && (
                  <NurseInstructionAdd
                    cache_index={this.props.cache_index}
                    patientInfo={this.props.patientInfo}
                    closeModal={this.closeModal}
                    patientId={this.props.patientId}
                    instruction_item={this.state.selected_instruction_item}
                  />
                )}
                {this.state.openProblemlist && (
                    <NurseProblemListModal
                      cache_index={this.props.cache_index}
                      patientInfo={this.props.patientInfo}
                      closeModal={this.closeModal}
                      patientId={this.props.patientId}
                    />
                  )}
                {this.state.isOpenStopInstructionsModal && (
                    <NurseInstructionStopResultModal
                      closeModal={this.cancelInstructionsArray}
                      instructions_array={this.state.instructions_array}
                    />
                  )}
                  {this.state.alert_messages !== "" && (
                    <AlertNoFocusModal
                      hideModal= {this.closeModal.bind(this)}
                      handleOk= {this.closeModal.bind(this)}
                      showMedicineContent= {this.state.alert_messages}
                    />
                  )}
              </Modal>
            </>
        );
    }
}

NurseInstructionPlanRelationModal.contextType = Context;
NurseInstructionPlanRelationModal.propTypes = {
  closeModal: PropTypes.func,
  guidance_date: PropTypes.string,
  applyPlan :  PropTypes.func,
  cache_index: PropTypes.number,
  patientInfo: PropTypes.object,
  problem_list : PropTypes.array,
  patientId: PropTypes.number
};

export default NurseInstructionPlanRelationModal;
