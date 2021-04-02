import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Context from "~/helpers/configureStore";
import MyMonthCalendar from "./MyMonthCalendar";
import axios from "axios/index";
import {formatDateLine, getWeekName} from "~/helpers/date";
import RegisterSchedule from "./RegisterSchedule";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";
import {displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";
import PropTypes from "prop-types";
import Checkbox from "~/components/molecules/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import * as sessApi from "~/helpers/cacheSession-utils";
import PatientScheduleModal from "~/components/templates/Dial/Schedule/modals/PatientScheduleModal";
import Spinner from "react-bootstrap/Spinner";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  cursor: pointer;
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
    height:100%;
    margin: 0px;
    background-color: ${surface};
    padding: 1.25rem;
    padding-top:0;
    .flex {
        display: flex;
        flex-wrap: wrap;
    }
    .content-area {
        width: 100%;
        height: 100%;
        align-items: flex-start;
        justify-content: space-between;
    }
    .date-cell:hover {
      background-color: #34aeff !important;
      color: white;
    }
    .left-area {
        width:60%;
        height: 100%;
        .calendar-head {
            align-items: flex-start;
            justify-content: space-between;
            font-size: 1.5rem;
            .cur-month {
              cursor:pointer;
            }
            .move-date-btn {
                margin-right: 1rem;
                cursor:pointer;
            }
            .add-schedule {
              font-size: 1.1rem;
              margin-right: 4%;
              line-height: 2.3rem;
              cursor:pointer;
            }
        }
        .calendar-body {
          height: calc(100% - 50px);
        }
        .select-check {
          margin-left: 0.5rem;
          label {
              font-size: 1.1rem;
              margin: 0;
          }
        }
    }
    .right-area {
        width:40%;
        height: 100%;
        overflow-y: auto;
        .bt-1p {
            border-top:1px solid #aaa;
        }
        .btd-1p {
            border-top:1px dashed #aaa;
        }
        .select-date {
            width: 100%;
            color:white;
            background-color: black;
            height: 40px;
            line-height: 40px;
            padding-left: 0.3rem;
            padding-right: 0.3rem;
            align-items: flex-start;
            justify-content: space-between;
            display:flex;
        }
        .date {
            width: 100%;
            background-color: #F2F2F2;
            height: 40px;
            line-height: 40px;
            padding-left: 0.3rem;
            padding-right: 0.3rem;
            align-items: flex-start;
            justify-content: space-between;
            display:flex;
        }
    }
    .selected-number {
      background-color:#f7a081;
      color:white;
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
    }
    img {
      width: 30px;
      height: 30px;
    }
    svg {
      width: 30px;
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

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       is_register,
                       is_edit,
                       is_delete,
                       parent,
                       schedule_date,
                       cur_summary,
                     }) => {
  if (visible && (is_register || is_edit || is_delete)) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {is_register && (
            <>
              <li><div onClick={() =>parent.manageSchedule("add_schedule", schedule_date, null)}>この日にスケジュールを追加</div></li>
            </>
          )}
          {cur_summary != null && (
            <>
              {is_edit && (
                <li><div onClick={() =>parent.manageSchedule("edit_schedule", schedule_date, cur_summary)}>編集</div></li>
              )}
              {(is_delete && cur_summary.classfic == 0) && ( //他科受診でない場合
                <li><div onClick={() =>parent.manageSchedule("delete_schedule", schedule_date, cur_summary)}>削除</div></li>
              )}
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class MyCalendarBody extends Component {
  constructor(props) {
    super(props);
    let cur_date = (props.schedule_date !== undefined && props.schedule_date !== undefined) ? new Date(props.schedule_date) : new Date();
    this.state = {
      cur_year:cur_date.getFullYear(),
      cur_month:cur_date.getMonth() + 1,
      selected_date:cur_date.getDate(),
      selected_month:"current",
      openRegisterSchedule:false,
      schedule_data:{},
      patients_id:[],
      confirm_message:"",
      patientInfo:props.patientInfo,
      all_schedule:1,
      patient_schedule:(props.patientInfo !== undefined && props.patientInfo != null && props.patientInfo.system_patient_id > 0) ? 1 : 0,
      isOpenPatientSchedule:false,
      load_flag:false,
    };
    this.holidays = null;
    this.sub_top = 0;
    this.selected_date = 0;
  }

  async componentDidMount () {
    await this.getHolidays();
    await this.getScheduleData();
    let path = window.location.href.split("/");
    path.map(word=>{
      if(word === "system_setting"){
        this.sub_top = 150;
      }
    });
    this.registerSess();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      patientInfo:nextProps.patientInfo,
      patient_schedule:1,
    }, ()=>{
      this.getScheduleData();
    });
  }

  async getHolidays(){
    let from_date = formatDateLine(new Date(this.state.cur_year, this.state.cur_month - 1, 1));
    let end_date = formatDateLine(new Date(this.state.cur_year, this.state.cur_month, 0));
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date: from_date,
      end_date:end_date,
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      this.holidays = Object.keys(res.data);
    })
  }

  async getScheduleData(){
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let cur_week = 0;
    let cur_date = new Date(this.state.cur_year + '-' + (this.state.cur_month > 9 ? this.state.cur_month : '0'+this.state.cur_month) + '-01');
    cur_week = cur_date.getDay();
    let last_year = this.state.cur_year;
    let last_month = this.state.cur_month - 1;
    if(last_month == 0){
      last_month = 12;
      last_year--;
    }
    let last_month_last_day = new Date(last_year, last_month, 0).getDate();
    let start_day = last_month_last_day - cur_week + 1;
    let start_date = last_year+'-'+(last_month > 9 ? last_month : '0'+last_month)+'-'+(start_day > 0 ? start_day : '0'+start_day);
    let end_date =  formatDateLine(new Date(new Date(start_date).getTime() + 60 * 60 * 24 * 41 * 1000));
    let path = "/app/api/v2/dial/mycalendar/get_schedule_data";
    let post_data = {
      start_date,
      end_date,
      system_patient_id:(this.state.patientInfo != null && this.state.patientInfo !== undefined) ? this.state.patientInfo.system_patient_id : null,
      all_schedule:this.state.all_schedule,
      patient_schedule:this.state.patient_schedule,
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      // this.load_flag = true;
      this.selected_date = 0;
      this.setState({
        schedule_data:Object.keys(res.data.date_data).length > 0 ? res.data.date_data : {},
        patients_id:res.data.patients_id,
        load_flag:true,
      }, ()=>{
        this.paintLeftBar();
      });
    });
  }

  moveDay = (type) => {
    let cur_year = this.state.cur_year;
    let cur_month = this.state.cur_month;
    let selected_date = this.state.selected_date;
    if(type === 'next'){
      let month_last_day = new Date(cur_year, cur_month, 0);
      if(selected_date == month_last_day.getDate()){
        selected_date = 1;
        cur_month++;
        if(cur_month == 13){
          cur_month = 1;
          cur_year++;
        }
      } else {
        selected_date++;
      }
    } else {
      if(selected_date == 1){
        cur_month--;
        if(cur_month == 0){
          cur_month = 12;
          cur_year--;
        }
        let month_last_day = new Date(cur_year, cur_month, 0);
        selected_date = month_last_day.getDate();
      } else {
        selected_date--;
      }
    }
    this.setState({
      cur_year,
      cur_month,
      selected_date,
    },()=>{
      this.getHolidays();
      this.getScheduleData();
      this.registerSess();
    });
  };

  registerSess () {
    var day = this.state.selected_date <10 ? '0'+this.state.selected_date.toString():this.state.selected_date.toString();
    var month = this.state.cur_month <10 ? '0'+this.state.cur_month.toString():this.state.cur_month.toString();
    var date = this.state.cur_year.toString() + '-' + month + '-' + day;
    sessApi.setObjectValue('for_left_sidebar', 'date', date);
  }

  selectMonth = (type)=>{
    let cur_month = this.state.cur_month;
    let cur_year = this.state.cur_year;
    if(type === 'prev'){
      if(cur_month === 1){
        cur_month = 12;
        cur_year--;
      } else {
        cur_month--;
      }
    } else {
      if(cur_month === 12){
        cur_month = 1;
        cur_year++;
      } else {
        cur_month++;
      }

    }
    this.setState({cur_month, cur_year},()=>{
      this.getHolidays();
      this.getScheduleData();
      this.registerSess();
    });
  };

  getselectedtDate =(date, selected_month)=>{
    let cur_year = this.state.cur_year;
    let cur_month = this.state.cur_month;
    if(selected_month !== "current"){
      if(selected_month === "prev"){
        cur_month--;
        if(cur_month == 0){
          cur_month = 12;
          cur_year--;
        }
      }
      if(selected_month === "next"){
        cur_month++;
        if(cur_month == 13){
          cur_month = 1;
          cur_year++;
        }
      }
      this.setState({
        cur_year,
        cur_month,
        selected_date:date,
        selected_month:"current",
      },()=>{
        this.getHolidays();
        this.getScheduleData();
        this.registerSess();
      });
    } else {
      this.setState({
        selected_date:date,
        selected_month,
      }, () => {
        this.registerSess();
      });
    }
  };

  selectToday =()=>{
    let cur_date = new Date();
    this.setState({
      cur_year:cur_date.getFullYear(),
      cur_month:cur_date.getMonth() + 1,
      selected_date:cur_date.getDate(),
    },()=>{
      this.getHolidays();
      this.getScheduleData();
      this.registerSess();
    });
  };

  manageSchedule=(type, schedule_date, modal_data=null)=>{
    if(type === "add_schedule" || (type === "edit_schedule" && modal_data.classfic == 0)){
      this.setState({
        openRegisterSchedule:true,
        schedule_date,
        modal_data,
        db_number:0,
      });
    }
    if(type === "edit_schedule" && modal_data.classfic == 1){
      modal_data.schedule_number = modal_data.number;
      this.setState({
        isOpenPatientSchedule:true,
        schedule_date,
        modal_data,
        db_number:0,
        edit_patient_id:modal_data.system_patient_id,
      });
    }
    if(type === "delete_schedule"){
      this.setState({
        confirm_message:"スケジュールを削除しますか？",
        db_number:modal_data.number+":"+modal_data.classfic,
        schedule_date
      });
    }
  };

  scheduleDelete=async()=>{
    let path = "/app/api/v2/dial/mycalendar/delete_schedule";
    let post_data = {
      number:this.state.db_number.split(':')[0],
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", "削除完了##" + res.alert_message);
        this.closeModal('register', this.state.schedule_date);
      })
      .catch(() => {
        this.closeModal();
      });
  };

  closeModal=(act=null, schedule_date=null)=>{
    if(act === "register"){
      this.setState({
        openRegisterSchedule:false,
        confirm_message:"",
        isOpenPatientSchedule:"",
        db_number:0,
        cur_year:schedule_date.split('-')[0],
        cur_month:parseInt(schedule_date.split('-')[1]),
        selected_date:parseInt(schedule_date.split('-')[2]),
      }, ()=>{
        this.getScheduleData();
      });
    } else {
      this.setState({
        openRegisterSchedule:false,
        confirm_message:"",
        isOpenPatientSchedule:"",
        db_number:0,
      });
    }
  };

  handleClick=(e, schedule_date, cur_summary)=>{
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({contextMenu: { visible: false }});
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({contextMenu: { visible: false }});
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("right-area")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        document
          .getElementById("right-area")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    let is_register = this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.REGISTER, 0);
    let is_edit = this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.EDIT, 0);
    let is_delete = this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.DELETE, 0);
    let cur_page = "";
    let path = window.location.href.split("/");
    path.map(word=>{
      if(word === "system_setting"){
        cur_page = word;
      }
    });

    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX-(cur_page === "system_setting" ? 0 : 200),
        y: e.clientY + window.pageYOffset-(cur_page === "system_setting" ? 0 : 160),
        is_register,
        is_edit,
        is_delete,
      },
      schedule_date,
      cur_summary,
    });
  };

  setAllSchedule = (name, value) => {
    if (name === "all_schedule"){
      this.setState({
        all_schedule: value,
      }, ()=>{
        this.getScheduleData();
      });
    }
    if (name === "patient_only"){
      this.setState({
        patient_schedule: value,
      }, ()=>{
        this.getScheduleData();
      });
    }
  };
  
  componentWillUnmount (){
    this.paintLeftBar('init');
    sessApi.remove('for_left_sidebar');
    
    var html_obj = document.getElementsByClassName("card_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }
  }

  paintLeftBar=(type=null)=>{
    let cur_selected_patient = (this.state.patientInfo != null && this.state.patientInfo !== undefined) ? this.state.patientInfo.system_patient_id : null;
    let patient_list_obj = document.getElementsByClassName("patient-list")[0];
    if(patient_list_obj !== undefined && patient_list_obj != null){
      let patients_obj = patient_list_obj.getElementsByClassName("patient-item");
      if(patients_obj !== undefined && patients_obj != null){
        for(let index = 0; index < patients_obj.length; index++){
          let patient_id = patients_obj[index].getAttribute("patient-id");
          if(cur_selected_patient != null && patient_id !== cur_selected_patient){
            patients_obj[index].style['background-color']="";
          }
        }
      }
      if(type == null && this.state.patients_id.length > 0){
        this.state.patients_id.map(patient_id=>{
          if(cur_selected_patient == null ||(cur_selected_patient != null && patient_id !== cur_selected_patient)){
            let patient_obj = patient_list_obj.getElementsByClassName("patientId-"+patient_id)[0];
            if(patient_obj !== undefined && patient_obj != null){
              patient_obj.style['background-color']="#da5000";
            }
          }
        })
      }
    }
  }

  addScedhule=()=>{
    let cur_year = this.state.cur_year;
    let cur_month = this.state.cur_month;
    let selected_date = this.state.selected_date;
    let schedule_date = cur_year+'-'+(cur_month > 9 ? cur_month : '0'+cur_month)+'-'+(selected_date > 9 ? selected_date : '0'+selected_date );
    this.setState({
      openRegisterSchedule:true,
      schedule_date,
      modal_data:null,
      db_number:0,
    });
  }

  setDate = value => {
    this.setState({
      cur_year:value.getFullYear(),
      cur_month:value.getMonth() + 1,
      selected_date:value.getDate(),
    },()=>{
      this.getHolidays();
      this.getScheduleData();
    });
  };

  getSummaryCount=(type, data)=>{
    if(data == null){
      return 0;
    }
    let count = 0;
    data.map(summary=>{
      if(type === "common" && summary.system_patient_id == null){
        count++;
      }
      if(type === "patient" && summary.system_patient_id != null){
        count++;
      }
    });
    return count;
  }

  selectedDate=(schedule_date)=>{
    let selected_date = parseInt(schedule_date.split('-')[2]);
    let cur_month = parseInt(schedule_date.split('-')[1]);
    let cur_year = parseInt(schedule_date.split('-')[0]);
    this.setState({
      cur_year,
      cur_month,
      selected_date,
    }, ()=>{
      this.getHolidays();
      this.getScheduleData();
    });
  }

  savePatientSchedule=async(object)=>{
    // これはリムシコードです。DB起動後は必要ありません。
    object.patient_number = this.state.edit_patient_id;
    let path = "/app/api/v2/dial/schedule/patient_schedule/register";
    await apiClient
      .post(path, { params: object })
      .then((res) => {
        if (res) {
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          this.closeModal('register', object.sch_date);
        }
      })
      .catch(() => {
        this.closeModal();
      });
  }

  render() {
    const ExampleCustomInput = ({ onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {this.state.cur_year+'年'+this.state.cur_month+'月'}
      </div>
    );
    let base_modal = document.getElementsByClassName(this.state.selected_date+"-summary")[0];
    if(this.selected_date !== this.state.selected_date && base_modal !== undefined && base_modal != null){
      this.selected_date = this.state.selected_date;
      let rowToScrollTo = document.getElementsByClassName('right-area')[0];
      rowToScrollTo.scrollTop = base_modal.offsetTop -this.sub_top;
    }
    let cur_page = "";
    let path = window.location.href.split("/");
    path.map(word=>{
      if(word === "system_setting"){
        cur_page = word;
      }
    });
    if(cur_page === ""){
      this.paintLeftBar();
    }
    return (
      <>
        <Card className="card_wrapper">
          <div className={'content-area flex'} style={{height:cur_page === "system_setting" ? "calc(100% - 90px)" : "100%"}}>
            <div className={'left-area'}>
              <div className={'calendar-head flex'}>
                <div className={'flex'}>
                  <div className={'cur-month'}>
                    <DatePicker
                      locale="ja"
                      selected={new Date(this.state.cur_year+'/'+(this.state.cur_month > 9 ? this.state.cur_month : '0'+this.state.cur_month)+'/'+(this.state.selected_date > 9 ? this.state.selected_date : '0'+this.state.selected_date))}
                      onChange={this.setDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                      customInput={<ExampleCustomInput />}
                    />
                  </div>
                  {cur_page !== "system_setting" && (
                    <>
                      <div className={'select-check'}>
                        <Checkbox
                          label="全体"
                          getRadio={this.setAllSchedule.bind(this)}
                          value={this.state.all_schedule}
                          name="all_schedule"
                        />
                      </div>
                      {this.state.patientInfo !== undefined && this.state.patientInfo != null && this.state.patientInfo.system_patient_id > 0 && (
                        <div className={'select-check'}>
                          <Checkbox
                            label="個別"
                            getRadio={this.setAllSchedule.bind(this)}
                            value={this.state.patient_schedule}
                            name="patient_only"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className={'flex'}>
                  <div className={'move-date-btn'} onClick={this.selectMonth.bind(this, 'prev')}>{'<<'}</div>
                  <div className={'move-date-btn'} onClick={this.moveDay.bind(this, 'prev')}>{'<'}</div>
                  <div className={'move-date-btn'} onClick={this.selectToday}>本日</div>
                  <div className={'move-date-btn'} onClick={this.moveDay.bind(this, 'next')}>{'>'}</div>
                  <div className={'move-date-btn'} onClick={this.selectMonth.bind(this, 'next')}>{'>>'}</div>
                </div>
                <div className={'add-schedule'} onClick={this.addScedhule.bind(this)}><Icon icon={faPlus} className = "plus_icon"/>スケジュール追加</div>
              </div>
              <div className={'calendar-body'}>
                <MyMonthCalendar
                  selectDay={this.getselectedtDate.bind(this)}
                  manageSchedule={this.manageSchedule}
                  year={this.state.cur_year}
                  month={this.state.cur_month}
                  date={this.state.selected_date}
                  selected_month={this.state.selected_month}
                  holidays={this.holidays}
                  schedule_data={this.state.schedule_data}
                />
              </div>

            </div>
            <div className={'right-area'} id={'right-area'}>
              {this.state.load_flag ? (
                <>
                  {Object.keys(this.state.schedule_data).length > 0 && (
                    Object.keys(this.state.schedule_data).map(schedule_date=>{
                      let schedule_info = this.state.schedule_data[schedule_date];
                      return (
                        <>
                          <div
                            className={"date-cell "+(parseInt(schedule_date.split('-')[2])+"-summary "+ ((schedule_date.split('-')[2] == this.state.selected_date && schedule_date.split('-')[1] == this.state.cur_month) ? 'select-date' : "date"))}
                            onContextMenu={e => this.handleClick(e, schedule_date, null)}
                            onClick={this.selectedDate.bind(this, schedule_date)}
                          >
                            <div>{schedule_date.split('-')[1]+'/'+schedule_date.split('-')[2]+'（'+getWeekName(parseInt(schedule_date.split('-')[0]), parseInt(schedule_date.split('-')[1]), parseInt(schedule_date.split('-')[2]))+'）'}</div>
                            <div>全{this.getSummaryCount('common', schedule_info)}件 / 個{this.getSummaryCount('patient', schedule_info)}件</div>
                          </div>
                          <div className={"date-cell"}>
                            {schedule_info == null ? (
                              <div
                                onContextMenu={e => this.handleClick(e, schedule_date, null)}
                                onClick={this.selectedDate.bind(this, schedule_date)}
                              >登録なし</div>
                            ):(
                              <>
                                {schedule_info.map((summary, index)=>{
                                  return (
                                    <>
                                      <div
                                        className={((summary.number+":"+summary.classfic) == this.state.db_number ? "selected-number summary-row " : "summary-row ")+(index > 0 ? 'bt-1p' : "")}
                                        onContextMenu={e => this.handleClick(e, schedule_date, summary)}
                                        onDoubleClick={e => this.handleClick(e, schedule_date, summary)}
                                        onClick={this.selectedDate.bind(this, schedule_date)}
                                      >
                                        <div style={{color:summary.summary_color}}>
                                          {(summary.system_patient_id == null ? "[全] ":(summary.classfic == 0 ? "[患] " : "[他] "))+(summary.summary != null ? summary.summary : "")}
                                        </div>
                                        <div className={'btd-1p'} style={{color:summary.body_color}}>{displayLineBreak(summary.body)}</div>
                                      </div>
                                    </>
                                  )
                                })}
                              </>
                            )}
                          </div>
                        </>
                      )
                    })
                  )}
                </>
                ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </div>
          </div>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            schedule_date={this.state.schedule_date}
            cur_summary={this.state.cur_summary}
          />
          {this.state.openRegisterSchedule && (
            <RegisterSchedule
              closeModal={this.closeModal}
              schedule_date={this.state.schedule_date}
              modal_data={this.state.modal_data}
              patientInfo={this.state.patientInfo}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.scheduleDelete}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isOpenPatientSchedule && (
            <PatientScheduleModal
              patient_id={this.state.modal_data.system_patient_id}
              patient_number={this.state.modal_data.patient_number}
              patient_name={this.state.modal_data.patient_name}
              row_index={this.state.modal_data.number}
              modal_data={this.state.modal_data}
              closeModal={this.closeModal}
              saveData={this.savePatientSchedule}
            />
          )}
        </Card>
      </>
    )
  }
}

MyCalendarBody.contextType = Context;
MyCalendarBody.propTypes = {
  patientInfo: PropTypes.array,
  schedule_date: PropTypes.string,
};
export default MyCalendarBody
