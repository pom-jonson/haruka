import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {formatDateLine,formatDateSlash,formatTimeIE,getWeekName} from "~/helpers/date";
import axios from "axios/index";
import {
  formatJapan,
  getNextDayByJapanFormat,
  getNextMonthByJapanFormat,
  getPrevDayByJapanFormat,
  getPrevMonthByJapanFormat,
} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import DisplayConditionModal from "./DisplayConditionModal";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import InstructionBookModal from "~/components/templates/Patient/Modals/InstructionBook/InstructionBookModal";
import DatePicker from "react-datepicker";
import {formatDateFull} from "../../../../../helpers/date";
import ChangeInstructionBookLogModal from "../../../../organisms/ChangeInstructionBookLogModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  width:100%;
  height: 100%;
  overflow-y: auto;
  font-size:1rem;
  .flex {display: flex;}
  .modal-btn {
    height:2rem;
    margin-right:0.5rem;
  }
  .select-slip {
    margin-right:0.5rem;
    .pullbox-label {
      margin-bottom: 0;
      .pullbox-select {
        width: 15rem;
        height: 2rem;   
      }
    }
    .label-title {display:none;}
  }
  .calendar-area {
    margin-top:0.5rem;
    table {
      font-size: 1rem;
      margin-bottom: 0;
    }
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;        
      tr{width: calc(100% - 17px);}
    }
    tbody{
      height: calc(90vh - 24rem);
      overflow-y: scroll;
      display:block;
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
        border-bottom: 1px solid #dee2e6;
    }
    th {
        text-align: center;
        padding: 0.3rem;
        border-bottom: 1px solid #dee2e6;
        vertical-align: middle;
    }    
  }
  .select-date {
    .date-label {
      height:2rem;
      line-height:2rem;
      margin-right:0.5rem;
    }
    button {
      height:2rem;
      margin-right:0.5rem;
    }
    .view-date {
      padding:0 0.3rem;
      height:2rem;
      line-height:2rem;
      border:1px solid #aaa;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DoubleModal = styled.div`
  font-size: 1rem;
  max-width: 60vw;
  min-height: 40vh;
  .check-area {
    label {
      font-size: 1rem;
    }
  }
  .react-datepicker__input-container input {
    height: 2rem;
    width: 12rem;
  }
  .react-datepicker{
    width: 100% !important;
    font-size: 1rem;
    .react-datepicker__month-container{
      width:75% !important;
      height:17rem;
    }
    .react-datepicker__navigation--next--with-time{
      right: 6rem;
    }
    .react-datepicker__time-container{
      width:25% !important;
    }
    .react-datepicker__time-box{
      width:auto !important;
      .react-datepicker__time-list {
        height: 17rem;
      }
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
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,item,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction('create')}>新規作成</div></li>
          <li><div onClick={() => parent.contextMenuAction('edit', item)}>修正</div></li>
          <li><div onClick={() => parent.contextMenuAction('delete', item)}>削除</div></li>
          <li><div onClick={() => parent.contextMenuAction('copy', item)}>複写</div></li>
          <li><div onClick={() => parent.contextMenuAction('change_end_date', item)}>終了日変更</div></li>
          <li><div onClick={() => parent.contextMenuAction('change_content', item)}>指示変更</div></li>
          <li><div onClick={() => parent.contextMenuAction('view_history', item)}>指示変更履歴</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class InstructionbookCalendar extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    this.departmentOptions =departmentOptions;
    this.holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
    this.search_date_time = new Date();
    this.state = {
      load_data:false,
      alert_title:"",
      alert_messages:"",
      search_date:this.search_date_time,
      display_condition:[],
      display_condition_id:0,
      simple_display_flag:0,
      only_current_valid_indication_flag:0,
      condition_detail:{},
      calendar_data:[],
      isOpenDisplayConditionModal:false,
      isOpenInstructionBookModal:false,
      department_id:0,
      department_codes,
      ward_master:[],
      first_ward_id:1,
      table_list:[],
      openNutritionGuidance:false,
      isOpenGuidanceNutritionRequestDoneModal:false,
      confirm_message:"",
      changeEndDateModal: false,
      end_date: "",
      view_history: false,
    };
    this.help_data = "";
  }

  async componentDidMount() {
    await this.getMaster();
    await this.getHolidays();
    await this.getScheduleData();
  }

  async getMaster () {
    let path = "/app/api/v2/instruction_book/get/master/calendar";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.help_data = (res.help_data != undefined && res.help_data.text != undefined) ? res.help_data.text : "";
        let display_condition = [{id:0, value:""}];
        let display_condition_id =  this.state.display_condition_id;
        let simple_display_flag =  this.state.simple_display_flag;
        let only_current_valid_indication_flag =  this.state.only_current_valid_indication_flag;
        if(res.display_condition.length > 0){
          res.display_condition.map(condition=>{
            display_condition.push({
              id:condition.id,
              value:condition.name,
              default_condition_flag:condition.default_condition_flag,
              simple_display_flag:condition.simple_display_flag,
              only_current_valid_indication_flag:condition.only_current_valid_indication_flag
            });
            if(condition.default_condition_flag && (display_condition_id == 0 || display_condition_id == condition.id)){
              display_condition_id = condition.id;
              simple_display_flag = condition.simple_display_flag;
              only_current_valid_indication_flag = condition.only_current_valid_indication_flag;
            }
          });
        }
        let condition_detail = {};
        if(res.display_condition_detail.length > 0){
          res.display_condition_detail.map(detail=>{
            if(condition_detail[detail.display_condition_id] == undefined){
              condition_detail[detail.display_condition_id] = [];
            }
            condition_detail[detail.display_condition_id].push(detail.slip_id);
          })
        }
        this.setState({
          display_condition,
          display_condition_id,
          simple_display_flag,
          only_current_valid_indication_flag,
          condition_detail,
          content_master: res.content_master_data,
          middle_master: res.middle_master_data,
          target_time_master: res.target_time_master,
          time_interval_master: res.time_interval_master,
        });
      })
      .catch(() => {

      });
  }

  async getScheduleData () {
    let path = "/app/api/v2/instruction_book/get/calendar_data";
    let start_date = this.state.search_date;
    let end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + (this.state.simple_display_flag ? 14 : 7));
    let post_data = {
      patient_id: this.props.patientId,
      start_date:formatDateLine(start_date),
      end_date:formatDateLine(end_date),
      simple_display_flag:this.state.simple_display_flag,
      only_current_valid_indication_flag:this.state.only_current_valid_indication_flag,
      condition_detail:this.state.condition_detail[this.state.display_condition_id] != undefined ? this.state.condition_detail[this.state.display_condition_id] : [],
    };
    if (this.state.load_data) this.setState({load_data: false});
    this.search_date_time = new Date();
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({table_list:res});
      })
      .finally(() => {
        this.setState({load_data: true});
      });
  }

  moveDay = (type) => {
    let now_day = this.state.search_date;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      search_date: cur_day,
      is_loaded: false,
    },async()=>{
      await this.getHolidays();
      await this.getScheduleData();
    });
  };

  moveMonth = (type) => {
    let now_month = this.state.search_date;
    let cur_month = type === 'next' ? getNextMonthByJapanFormat(now_month) : getPrevMonthByJapanFormat(now_month);
    this.setState({
      search_date: cur_month,
      is_loaded: false,
    },async()=>{
      await this.getHolidays();
      await this.getScheduleData();
    });
  };

  selectToday=()=>{
    this.setState({search_date: new Date()},async()=>{
      await this.getHolidays();
      await this.getScheduleData();
    });
  }

  setDisplayCondition=(e)=>{
    let simple_display_flag = this.state.simple_display_flag;
    let only_current_valid_indication_flag = this.state.only_current_valid_indication_flag;
    if(e.target.id != 0){
      let display_condition = this.state.display_condition.find((x) => x.id == e.target.id);
      simple_display_flag = display_condition.simple_display_flag;
      only_current_valid_indication_flag = display_condition.only_current_valid_indication_flag;
    } else {
      simple_display_flag = 0;
      only_current_valid_indication_flag = 0;
    }
    this.setState({
      display_condition_id:parseInt(e.target.id),
      simple_display_flag,
      only_current_valid_indication_flag
    }, ()=> {
      this.getScheduleData();
    });
  };

  async getHolidays(){
    let now_date = this.state.search_date;
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

  createTable = (type, item=null, index=null) => {
    let start_date = this.state.search_date;
    let end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + (this.state.simple_display_flag ? 14 : 7));
    let now_year = start_date.getFullYear();
    let now_month = start_date.getMonth()+1;
    let date_number = start_date.getDate();
    let table_menu = [];
    if(type === 'thead' || type === 'tbody'){
      do {
        let month = now_month < 10 ? '0' + now_month : now_month;
        let date = date_number < 10 ? '0' + date_number : date_number;
        let cur_date = now_year + '-' + month + '-' + date;
        if(type === 'thead'){
          let week = new Date(cur_date).getDay();
          table_menu.push(
            <th style={{background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week), width:"5rem"}}>
              <div style={{textAlign:"center", height:"2rem", lineHeight:"2rem"}}>{month +'/'+date}</div>
              <div style={{textAlign:"center", height:"2rem", lineHeight:"2rem"}}>{'（'+getWeekName(now_year, now_month, date_number)+'）'}</div>
            </th>
          )
        }
        if(type === 'tbody') {
          let date_key = now_year+'-'+month+'-'+date;
          table_menu.push(
            <>
              {item[date_key] !== undefined ? (
                <>
                  <td
                    style={{width:"5rem"}}
                    className={date_key+'-'+index}
                    onContextMenu={e => this.handleClick(e, item, item[date_key]['order_data'], (date_key+'-'+index) )}
                  >
                    {item[date_key]['order_data']['order_data']['done_order'] == 1 ? "実施済" : "依頼"}
                  </td>
                </>
              ):(
                <>
                  <td style={{width:"5rem"}} className={date_key+'-'+index} onContextMenu={e => this.handleClick(e, item, null, (date_key+'-'+index))}></td>
                </>
              )}
            </>
          );
        }
        month = now_month < 10 ? '0' + now_month : now_month;
        date = (date_number + 1) < 10 ? '0' + (date_number + 1) : (date_number + 1);
        cur_date = now_year + '-' + month + '-' + date;
        let cur_date_time = new Date(cur_date);
        if(cur_date_time.toString() === "Invalid Date"){
          date_number = 1;
          if(now_month == 12){
            now_month = 1;
            now_year++;
          } else {
            now_month++;
          }
          month = now_month < 10 ? '0' + now_month : now_month;
          date = date_number < 10 ? '0' + date_number : date_number;
          cur_date = now_year + '-' + month + '-' + date;
        } else {
          date_number++;
        }
      } while (
        new Date(now_year + '/' + (now_month > 9 ? now_month : '0'+now_month) + '/' + (date_number > 9 ? date_number : '0'+date_number)).getTime() < end_date.getTime()
        );
    }
    return table_menu;
  };

  handleClick=(e, item)=>{
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
      var obj = document.getElementById("instruction_calendar");
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - obj.offsetLeft,
          y: e.clientY,
          item
        },
      })
    }
  };

  contextMenuAction = (act, item) => {
    if(act == "create"){
      this.setState({
        isOpenInstructionBookModal: true
      });
    } else if(act == "edit" || act == "change_content"){
      this.setState({
        isOpenInstructionBookModal: true,
        selected_item: item
      });
    } else if (act == "delete") {
      this.setState({
        confirm_message: "削除しますか？",
        confirm_action: "delete",
        del_number: item.number
      });
    } else if (act == "copy") {
      this.setState({
        isOpenInstructionBookModal: true,
        copied_item: item
      });
    } else if (act == "change_end_date") {
      this.setState({
        changeEndDateModal: true,
        selected_item: item
      });
    } else if (act == "view_history") {
      if (item.history === undefined || item.history == null) {
        this.setState({alert_messages: "変更履歴がありません。"});
        return;
      }
      this.setState({
        view_history: true,
        history_number: item.history
      });
    }
  }

  closeModal=()=>{
    this.setState({
      isOpenDisplayConditionModal:false,
      isOpenInstructionBookModal:false,
      changeEndDateModal:false,
      view_history:false,
      confirm_message:"",
      confirm_action:"",
      alert_messages: "",
      alert_title: "",
    });
  }

  confirmOk=()=>{
    this.closeModal();
    if(this.state.confirm_action == "delete"){
      let {table_list} = this.state;
      let find_index = table_list.findIndex(x=>x.number == this.state.del_number);
      if (find_index == -1) return;
      table_list[find_index].is_delete = 1;
      this.setState({table_list, is_changed: true});
    } else if (this.state.confirm_action == "register") {
      this.setState({
        close_main: true
      });
      this.saveData();
    }
  }

  openDisplayConditionModal = () => {
    this.setState({
      isOpenDisplayConditionModal: true
    });
  }
  
  openInstructionBookModal = () => {
    this.setState({
      isOpenInstructionBookModal: true
    });
  }
  
  helpView=()=>{
    this.setState({
      alert_messages: this.help_data,
      alert_title:"ヘルプ",
    });
  }
  
  searchCondition=()=>{
    this.setState({isOpenDisplayConditionModal: false}, ()=>{
      this.getMaster();
    });
  }
  
  setConditionFlag=(name)=>{
    this.setState({[name]:!this.state[name]});
  }
  
  getSubCategoryName = (subcategory_id, item) => {
    let middle_master = this.state.middle_master;
    let find_data = middle_master.find(x=>x.number == subcategory_id);
    if (find_data === undefined) {
      item.sub_category_name = '';
      return "";
    }
    item.sub_category_name = find_data.name;
    return find_data.name;
  }
  getContentName = (content_id, item) => {
    let content_master = this.state.content_master;
    let find_data = content_master.find(x=>x.number == content_id);
    if (find_data === undefined) {
      item.content_name = '';
      return "";
    }
    item.content_name = find_data.content;
    return find_data.content;
  };
  getUsage = (item) => {
    let {target_time_master, time_interval_master} = this.state;
    if (item.usage_class == 1 && item.target_time_ids != null && item.target_time_ids != "") {
      let target_time_array = [];
      let target_time_ids = item.target_time_ids;
      let target_time_ids_array = target_time_ids.split(",");
      target_time_master.map(target_item => {
        target_time_ids_array.map (id=>{
          if (id == target_item.number)
            target_time_array.push(target_item.name);
        })
      });
      item.usage_name = target_time_array.join(",");
      return target_time_array.join(",");
    } else if (item.usage_class == 2) {
      item.usage_name = item.number_of_times_per_day + "回";
      return item.number_of_times_per_day + "回";
    } else if (item.usage_class == 3) {
      let time_interval_val = time_interval_master.find(x=>x.number == item.time_interval_id);
      if (time_interval_val !== undefined) {
        item.usage_name = time_interval_val.name;
        return time_interval_val.name;
      }
    }
    item.usage_name = '';
    return "";
  }
  selectAllmiddle = () => {
    this.setState({
      all_middle_search: !this.state.all_middle_search
    });
  };
  
  onHide = () => {};
  getDate = (key,value) => {
    this.setState({[key]: value});
  }
  
  stopInstruction = async() => {
    if (this.state.end_date == '') {
      this.setState({alert_messages:"終了日を選択してください。"});
      return;
    }
    this.closeModal();
    let {table_list} = this.state;
    if (table_list == null || table_list.length === 0) return;
    if (this.state.all_change_end_date) {
      table_list.map(item=>{
        item.end_date = formatDateFull(this.state.end_date, "/");
        item.is_edit = 1;
      });
      this.setState({
        all_change_end_date: false,
        table_list,
        is_changed: true
      });
      return;
    }
    
    let find_index = table_list.findIndex(x=>this.state.selected_item !== undefined && this.state.selected_item != null && x.number == this.state.selected_item.number);
    if (find_index > -1) {
      table_list[find_index].is_edit = 1;
      table_list[find_index].end_date = formatDateFull(this.state.end_date, "/");
      this.setState({
        table_list,
        is_changed: true
      })
    }
  };
  
  changeAllEndDate = () => {
    this.setState({
      all_change_end_date: true,
      changeEndDateModal: true,
    })
  };
  
  saveData = async () => {
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let karte_status = 1;
    if (this.context.karte_status.name === "訪問診療") {
      karte_status = 2;
    } else if(this.context.karte_status.name === "入院") {
      karte_status = 3;
    }
    let {table_list} = this.state;
    let content_list = [];
    table_list.map(item => {
      if (item.is_new == 1 || item.is_edit == 1 || item.is_delete == 1) {
        content_list.push(item);
      }
    });
    var path = "/app/api/v2/instruction_book/register_instruction_book";
    await apiClient._post(path, {params: {
        patient_id: this.props.patientId,
        table_list: content_list,
        department_id: this.context.department.code == 0 ? 1 : this.context.department.code,
        doctor_code: authInfo.doctor_code == 0 ? this.context.selectedDoctor.code : authInfo.doctor_code,
        karte_status
      }})
      .then((res) => {
        if (res){
          this.props.closeModal();
        }
      })
      .catch(() => {
      });
  };
  saveInstruction = () => {
    if (!this.state.is_changed) return;
    this.setState({
      confirm_message: "確定しますか？",
      confirm_action: "register",
    })
  };
  printData = (print_type) => {
    if (this.state.table_list === undefined || this.state.table_list == null || this.state.table_list.length === 0) return;
    this.setState({
      confirm_message:"",
      complete_message:"印刷中",      
    });
    let path = "/app/api/v2/instruction_book/print_list";
    let print_data = {
      table_list:this.state.table_list,
      print_type:print_type,
      search_date:this.state.search_date,
      patient_id: this.props.patientId,
      patientInfo : this.props.patientInfo,
    };
    print_data.print_type = print_type;
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      let title = "指示簿カレンダー" + ".pdf"
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, title);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', title); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  };
  
  getDepartment = id => {
    let departmentStr = "";
    this.departmentOptions.map(item => {
      if (parseInt(item.id) === parseInt(id)) {
        departmentStr = item.value;
      }
    });
    
    return departmentStr;
  }

  render() {
    return (
      <>
        <Modal show={true} onHide={this.onHide} className="custom-modal-sm instruction-book-calendar first-view-modal" id="instruction_calendar">
          <Modal.Header><Modal.Title>指示簿カレンダー</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'select-date flex'} style={{marginBottom:"0.5rem"}}>
                  <div className={'date-label'}>日付</div>
                  <Button type="common" onClick={this.moveMonth.bind(this, 'prev')}>{'<<'}</Button>
                  <Button type="common" onClick={this.moveDay.bind(this, 'prev')}>{'<'}</Button>
                  <Button type="common" onClick={this.selectToday}>{'本日'}</Button>
                  <Button type="common" onClick={this.moveDay.bind(this, 'next')}>{'>'}</Button>
                  <Button type="common" onClick={this.moveMonth.bind(this, 'next')}>{'>>'}</Button>
                  <div className={'view-date'}>{formatJapan(this.state.search_date)}</div>
                  <div style={{marginLeft:"auto", marginRight:0}}>
                    <Button type="common" onClick={this.helpView}>ヘルプ</Button>
                  </div>
                </div>
                <div className={'flex'} style={{marginBottom:"0.5rem"}}>
                  <Button type="common" className={'modal-btn'} onClick={this.openInstructionBookModal}>新規指示</Button>
                  <Button type="common" className={'modal-btn'} onClick={this.changeAllEndDate}>一括止め</Button>
                  <Button type="common" className={'modal-btn'} onClick={this.openDisplayConditionModal}>表示条件</Button>
                  <div className={'select-slip'}>
                    <SelectorWithLabel
                      title=""
                      options={this.state.display_condition}
                      getSelect={this.setDisplayCondition}
                      departmentEditCode={this.state.display_condition_id}
                    />
                  </div>
                  <Button type="common" className={'modal-btn'} onClick={this.selectAllmiddle}>全伝票</Button>
                  <Button type="common" className={'modal-btn'} style={{backgroundColor:this.state.simple_display_flag ? "#FFA500" : ""}} onClick={this.setConditionFlag.bind(this, "simple_display_flag")}>簡易表示</Button>
                  <Button type="common" className={'modal-btn'} style={{backgroundColor:this.state.only_current_valid_indication_flag ? "#FFA500" : ""}} onClick={this.setConditionFlag.bind(this, "only_current_valid_indication_flag")}>現在有効指示のみ</Button>
                </div>
                <div className={'flex'} style={{marginTop:"0.5rem"}}>
                  <Button type="common" className={'modal-btn'} onClick={this.getScheduleData.bind(this)}>最新表示</Button>
                  <div style={{marginRight:"0.5rem", lineHeight:"2rem"}}>※最新表示ボタンをクリックすると編集中のデータが更新されます。</div>
                  <div style={{marginRight:"0.5rem", lineHeight:"2rem"}}>0件</div>
                  <div style={{marginRight:"0.5rem", lineHeight:"2rem"}}>（
                    {formatDateSlash(this.search_date_time) + " " + formatTimeIE(this.search_date_time)}
                    ）</div>
                </div>
                <div className={'calendar-area'}>
                  <table className="table-scroll table table-bordered" id="instruction-book-calendar">
                    <thead>
                    <tr>
                      <th style={{width:"10rem"}}>伝票種別</th>
                      <th>指示内容</th>
                      <th style={{width:"5rem"}}>用法</th>
                      {this.createTable('thead')}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.load_data ? (
                      <>
                        {this.state.table_list.length > 0 && (
                          this.state.table_list.map((item, index)=>{
                            if (item.is_delete != 1)
                            return (
                              <>
                                <tr onContextMenu={e=>this.handleClick(e, item)}>
                                  <td style={{width:"10rem"}}>{this.getSubCategoryName(item.subcatergory_detail_id, item)}</td>
                                  <td>{this.getContentName(item.drug_content_id, item)}</td>
                                  <td style={{width:"5rem"}}>{this.getUsage(item)}</td>
                                  {this.createTable('tbody', item, index)}
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    ):(
                      <tr>
                        <td colSpan={'13'} style={{height:"10rem"}}>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.saveInstruction}>確定</Button>
            <Button className={this.state.table_list !== undefined && this.state.table_list != null && this.state.table_list.length > 0 ? "red-btn" : "disable-btn"} onClick={this.printData.bind(this,"seven_days")}>一覧印刷</Button>
            <Button className={this.state.table_list !== undefined && this.state.table_list != null && this.state.table_list.length > 0 ? "red-btn" : "disable-btn"} onClick={this.printData.bind(this,"fourteen_days")}>カレンダ印刷</Button>
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
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title= {this.state.alert_title}
            />
          )}
          {this.state.isOpenDisplayConditionModal && (
            <DisplayConditionModal
              hideModal= {this.closeModal.bind(this)}
              closeModal= {this.closeModal.bind(this)}
              searchCondition= {this.searchCondition}
              display_condition_id={this.state.display_condition_id}
            />
          )}
          {this.state.isOpenInstructionBookModal && (
            <InstructionBookModal
              closeModal={this.closeModal}
              patientId={this.props.patientId}
              selected_item={this.state.selected_item}
              copied_item={this.state.copied_item}
              from_source="instruction_calendar"
            />
          )}
          {this.state.view_history && (
            <ChangeInstructionBookLogModal
              closeModal={this.closeModal}
              history_number={this.state.history_number}
              getDepartmentName={this.getDepartment}
              getSubCategoryName={this.getSubCategoryName}
              getContentName={this.getContentName}
              getUsage={this.getUsage}
            />
          )}
        </Modal>
        <Modal show={this.state.changeEndDateModal} onHide={this.onHide} className = "instruction-stop-modal">
          <Modal.Header>
            <Modal.Title>終了日変更</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DoubleModal>
              <label className="ml-3 mr-3">終了日</label>
              <DatePicker
                locale={ja}
                id='end_date_id'
                selected={this.state.end_date}
                onChange={this.getDate.bind(this,"end_date")}
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
            </DoubleModal>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.stopInstruction}>確定</Button>
          </Modal.Footer>
          {this.state.complete_message !== '' && (
              <CompleteStatusModal
                  message = {this.state.complete_message}
              />
          )}
        </Modal>
        
      </>
    );
  }
}

InstructionbookCalendar.contextType = Context;
InstructionbookCalendar.propTypes = {
  closeModal: PropTypes.func,
  patientInfo:PropTypes.object,
  patientId:PropTypes.number,
  detailedPatientInfo:PropTypes.object
};

export default InstructionbookCalendar;