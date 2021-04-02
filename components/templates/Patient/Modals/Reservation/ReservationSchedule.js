import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {
  formatDateLine,
  formatJapanMonth,
  getNextMonthByJapanFormat,
  getPrevMonthByJapanFormat,
  getWeekName
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import axios from "axios/index";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import ReservationCreateModal from "~/components/templates/Patient/Modals/Reservation/ReservationCreateModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, KARTEMODE} from "~/helpers/constants";
import {formatTimeSecondIE} from "../../../../../helpers/date";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import auth from "~/api/auth";
import {setDateColorClassName} from '~/helpers/dialConstants';

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {
    display: flex;
  }
  .MyCheck{
    margin-left: 24px;
    margin-bottom: 5px;
    label{
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .hBWNut {
    padding-top: 90px!important;
  }
  .schedule-area {
      background-color: white;
  }
  .arrow{
    cursor:pointer;
    font-size:20px
  }
  .prev-month {
      padding-right: 5px;
  }
  .next-month {
    padding-left: 5px;
  }
  .schedule-area {
    width: 100%;
    max-height: calc(100% - 110px);
    overflow-y: auto;
    table {
        margin-bottom: 0;
    }
    td {
        padding: 0.5rem; 
        text-align: center;
        font-size: 1rem;
        vertical-align: middle;
    }
    th {
        text-align: center;
        padding: 0.5rem; 
        font-size: 1.25rem;
        font-weight: normal;
    }
    .patient-name {
    }
  }
  .visit-patient-name{
    cursor: pointer;
  }
  .visit-fill{
    cursor: pointer;
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 10px 0px 10px 10px;
  width: 100%;
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 55px;
    text-align: right;
    margin-right: 10px;
    line-height:30px;
  }
  .pullbox-select {
      font-size: 12px;
      width: 105px;
      height:30px;
  }
  .select-group {
      .pullbox-select {
          width: 200px;
      }
  }
  .selectbox-area{
    margin-right:10px;
    .pullbox-label {
        margin-bottom:0;
    }
  }
  .top_right_area{
    .label-title {
      font-size: 16px;
      width: 70px;
    }
  }
  .space-area {
    width: calc(100% - 700px);
  }
  .patient_numbers {
    line-height: 30px;
  }
`;

const SpinnerWrapper = styled.div`
    padding-top: 70px;
    padding-bottom: 70px;
    height: 100px;
`;

const display_order = [
  { id: 0, value: "患者番号"},
  { id: 1, value: "氏名"},
];

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
  .hover-menu {
    z-index: 190;
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
      font-weight: bold;
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
                       parent,
                       scheduled_type,
                       scheduled_item,
                       scheduled_date,
                       scheduled_diagnosis_code,
                       menu_index,
                     }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {scheduled_type == "fill" && (
            <>
              <li><div onClick={() =>parent.contextMenuAction("scheduled_edit", scheduled_item, scheduled_date, scheduled_diagnosis_code, menu_index)}>編集</div></li>
              <li><div onClick={() =>parent.contextMenuAction("scheduled_delete", scheduled_item, scheduled_date, scheduled_diagnosis_code, menu_index)}>削除</div></li>
            </>
          )}
          <li><div onClick={() =>parent.contextMenuAction("scheduled_register", scheduled_item, scheduled_date)}>登録</div></li>
          <li><div onClick={() =>parent.contextMenuAction("view_karte", scheduled_item, scheduled_date, scheduled_diagnosis_code, menu_index)}>カルテを表示</div></li>
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
                     parent,
                     scheduled_item,
                     scheduled_date,
                     diagnosis
                   }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {scheduled_item[scheduled_date] !== undefined && scheduled_item[scheduled_date] != null && Object.keys(scheduled_item[scheduled_date]).length > 0 && (
            Object.keys(scheduled_item[scheduled_date]).map((diagnosis_code)=>{
                if(diagnosis.find(x => x.id == diagnosis_code) != undefined){
                  if(Object.keys(scheduled_item[scheduled_date][diagnosis_code]).length === 1){
                    return (
                      <li>
                        <div onContextMenu={(e) =>parent.handleVisitClick(e, 'fill', scheduled_item, scheduled_date, parseInt(diagnosis_code), 0)}>
                          {diagnosis.find(x => x.id == diagnosis_code).value}
                        </div>
                      </li>
                    )
                  } else {
                    let menu = Object.keys(scheduled_item[scheduled_date][diagnosis_code]).map((index)=>{
                      return (
                        <li key={index}>
                          <div onContextMenu={(e) =>parent.handleVisitClick(e, 'fill', scheduled_item, scheduled_date, parseInt(diagnosis_code), parseInt(index))}>
                            {diagnosis.find(x => x.id == diagnosis_code).value + (parseInt(index) + 1)}
                          </div>
                        </li>
                      )
                    })
                    return (<>{menu}</>);
                  }
                }
              }
            ))}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class ReservationSchedule extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let diagnosis = [{id:0, value:"全て"}];
    departmentOptions.map(department=>{
      diagnosis.push(department);
    });
    this.holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
    this.state = {
      search_month: new Date(),
      order_type:0,
      visit_type:"",
      schedule_data:null,
      confirm_message: "",
      isReservationCreateModal: false,
      alert_messages:'',
      isOpenKarteModeModal: false,
      diagnosis_code:0,
      diagnosis,
      complete_message:'',
    };
  }

  async componentDidMount() {
    localApi.setValue("system_next_page", "/reservation/schedule");
    localApi.setValue("system_before_page", "/reservation/schedule");
    await this.getHolidays();
    await this.getSearchResult();
    let reservation_create_modal_open_flag = localApi.getValue('reservation_create_modal_open');
    if(reservation_create_modal_open_flag != undefined && reservation_create_modal_open_flag != null && reservation_create_modal_open_flag == 1){
      localApi.remove('reservation_create_modal_open');
      this.setState({isReservationCreateModal: true});
    }
    auth.refreshAuth(location.pathname+location.hash);
  }

  getSearchResult =async()=>{
    this.setState({schedule_data: null});
    let path = "/app/api/v2/reservation/schedule/search";
    let post_data = {
      search_month:formatDateLine(this.state.search_month),
      diagnosis_code:this.state.diagnosis_code,
      order_type:this.state.order_type,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          this.setState({
            schedule_data: res,
          });
        } else {
          this.setState({
            schedule_data: [],
          });
        }

      })
      .catch(() => {
      });
  }

  getSearchMonth = value => {
    this.setState({
      search_month: value,
    }, ()=>{
      this.getHolidays();
      this.getSearchResult();
    });
  };

  PrevMonth = () => {
    let now_month = this.state.search_month;
    let cur_month = getPrevMonthByJapanFormat(now_month);
    this.setState({ search_month: cur_month}, ()=>{
      this.getHolidays();
      this.getSearchResult();
    });
  };

  NextMonth = () => {
    let now_month = this.state.search_month;
    let cur_month = getNextMonthByJapanFormat(now_month);
    this.setState({ search_month: cur_month}, ()=>{
      this.getHolidays();
      this.getSearchResult();
    });
  };

  getGroupSelect = e => {
    this.setState({ visit_group_id: parseInt(e.target.id)}, ()=>{
      this.getSearchResult();
    });
  };

  getOrderSelect = e => {                 //表示順
    this.setState({
      order_type: parseInt(e.target.id),
    }, ()=>{
      this.getSearchResult();
    });
  };

  contextMenuAction = (type, scheduled_item, scheduled_date=null, diagnosis_code=null, menu_index=null) => {
    switch(type){
      case "scheduled_register":
        this.editVisitPatientModal('_add', scheduled_item, scheduled_date);
        break;
      case "view_karte":
        if(scheduled_date == null) {
          this.goKartePage(scheduled_item.system_patient_id);
        } else {
          this.goKartePage(scheduled_item.system_patient_id, scheduled_item[scheduled_date][diagnosis_code][menu_index]['number'], scheduled_item[scheduled_date][diagnosis_code][menu_index]['state'], diagnosis_code, scheduled_date);
        }
        break;
      case "scheduled_delete":
        if(!this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.DELETE, 0)){
          this.setState({alert_messages: '削除権限がありません。'});
        } else {
          this.setState({
            confirm_message: "削除しますか？",
            scheduled_number: scheduled_item[scheduled_date][diagnosis_code][menu_index]['number'],
          });
        }
        break;
      case "scheduled_edit":
        this.editVisitPatientModal('_edit', scheduled_item, scheduled_date, diagnosis_code, menu_index);
        break;
    }
  };

  async getHolidays(){
    let now_date = this.state.search_month;
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
  }

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
  }

  createTable = (type, index = null) => {
    let now_date = this.state.search_month;
    let now_year = now_date.getFullYear();
    let now_month = now_date.getMonth();
    let end_date = new Date(now_year, now_month + 1, 0).getDate();
    let table_menu = [];
    let schedule_data = this.state.schedule_data;
    if(type === 'null'){
      table_menu.push(<td colSpan={end_date + 1}>
        <div className='spinner_area'>
          <SpinnerWrapper>
            <Spinner animation="border" variant="secondary" />
          </SpinnerWrapper>
        </div>
      </td>);
    } else if(type === 'no_data'){
      table_menu.push(<td colSpan={end_date + 1}>{'登録されたスケジュールがありません。'}</td>);
    } else if(type === 'thead' || type === 'tbody'){
      for (let i = 0; i < end_date; i++) {
        let month = (now_month + 1) < 10 ? '0' + (now_month + 1) : (now_month + 1);
        let date = (i + 1) < 10 ? '0' + (i + 1) : (i + 1);
        let cur_date = now_year + '-' + month + '-' + date;
        if(type === 'thead'){
          let week = new Date(cur_date).getDay();
          table_menu.push(<th style={{background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week)}}>
            <div className={'text-center'}>{getWeekName(now_year, (now_month + 1), (i + 1))}</div>
            <div className={'text-center'}>{i + 1}</div>
          </th>)
        } if(type === 'tbody') {
          if(schedule_data[index][cur_date] !== undefined && schedule_data[index][cur_date] != null && Object.keys(schedule_data[index][cur_date]).length > 0){
            table_menu.push(<td className="visit-fill" id={'cell-area'} onMouseOver={e => this.diagnosisHover(e, schedule_data[index], cur_date)}>{'予'}</td>)
          } else {
            table_menu.push(<td onContextMenu={e => this.handleVisitClick(e, "nofill", schedule_data[index], cur_date)}>{' '}</td>)
          }
        }
      }
    }
    return table_menu
  }

  closeModal = (act) => {
    this.setState({isReservationCreateModal: false}, ()=>{
      if(act == "save"){
        this.getSearchResult();
      }
    });
  }

  goKartePage = async(systemPatientId, number=null, state=null, diagnosis_code=null, scheduled_date= null) => {
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if (item.system_patient_id == systemPatientId) {
        isExist = 1;
      }
    });
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
      return;
    }
    if (isExist == 0) { // new patient connect
      let modal_data = {
        systemPatientId,
      };
      if(number != null){
        modal_data.reservation_number = number;
        modal_data.reservation_state = state;
        modal_data.scheduled_date = scheduled_date;
        modal_data.diagnosis_code = diagnosis_code;
        modal_data.diagnosis_name = this.state.diagnosis.find(x => x.id == diagnosis_code) != undefined ? this.state.diagnosis.find(x => x.id == diagnosis_code).value : '';
      }
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
        modal_type:number == null ? '':'reservation',
      });
    } else { // exist patient connect
      if(number != null){
        let patientInfo = karteApi.getPatient(systemPatientId);
        if (patientInfo.karte_mode != KARTEMODE.READ) {
          let reservation_info = karteApi.getVal(systemPatientId, CACHE_LOCALNAMES.RESERVATION_INFO);
          if(reservation_info !== undefined && reservation_info != null && reservation_info.schedule_number !== number){
            this.setState({alert_messages: '既に'+ reservation_info.diagnosis_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
            return;
          }
          let visit_info = karteApi.getVal(systemPatientId, CACHE_LOCALNAMES.VISIT_INFO);
          if(visit_info !== undefined && visit_info != null){
            this.setState({alert_messages:'既に'+ visit_info.place_name +'の'+ visit_info.group_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
            return;
          }
          let reservation_continue = true;
          if(reservation_info !== undefined && reservation_info != null && reservation_info.schedule_number === number){
            reservation_continue = false; //キャッシュにすでに同じレコードが存在
          }
          if(reservation_continue) {
            let treatment_started_at = formatDateLine(new Date())+ ' ' + formatTimeSecondIE(new Date());
            if(state == 0 || state == 1 || state == 10){
              let path = "/app/api/v2/reservation/register_schedule";
              let post_data = {
                state: 2,
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

            if(state == 0 || state == 1 || state == 2 || state == 10){
              //save cache
              let reservation_info = {};
              reservation_info.schedule_number = number;
              reservation_info.treatment_started_at = treatment_started_at;
              reservation_info.diagnosis_name = this.state.diagnosis.find(x => x.id == diagnosis_code) != undefined ? this.state.diagnosis.find(x => x.id == diagnosis_code).value : '';
              karteApi.setVal(systemPatientId, CACHE_LOCALNAMES.RESERVATION_INFO, JSON.stringify(reservation_info));
            }
          }
        }
      }
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+systemPatientId+"/"+page);
    }
  }

  editVisitPatientModal = async (type, scheduled_item, scheduled_date, diagnosis_code, menu_index) => {
    if(type === '_add' && !this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.REGISTER, 0)){
      this.setState({alert_messages: '登録権限がありません。'});
      return;
    }
    if(type === '_edit' && !this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.EDIT, 0)){
      this.setState({alert_messages: '編集権限がありません。'});
      return;
    }
    this.setState({
      isReservationCreateModal: true,
      number: type === '_edit' ? scheduled_item[scheduled_date][diagnosis_code][menu_index]['number'] : null,
      patient_name: scheduled_item.patient_name,
      system_patient_id: scheduled_item.system_patient_id,
      scheduled_date: scheduled_date,
      scheduled_time: type === '_edit' ? scheduled_item[scheduled_date][diagnosis_code][menu_index]['time'] : null,
      scheduled_status: type === '_edit' ? scheduled_item[scheduled_date][diagnosis_code][menu_index]['state'] : 0,
      scheduled_diagnosis_code: type === '_edit' ? diagnosis_code : 0,
    });
  }

  deleteSchedule =async(scheduled_number)=>{
    this.setState({complete_message:'削除中'});
    let path = "/app/api/v2/reservation/schedule/delete";
    let post_data = {
      number:scheduled_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch(() => {

      });
    this.setState({complete_message:''});
    this.getSearchResult();
  }

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  confirmCancel() {
    this.setState({
      confirm_message: "",
      alert_messages: "",
    });
  }

  confirmOk() {
    this.confirmCancel();
    this.deleteSchedule(this.state.scheduled_number);
  }

  closeModeModal = () => {
    this.setState({
      isOpenKarteModeModal: false
    });
  };

  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.setState({
      isOpenKarteModeModal: false
    });
  };

  setDiagnosisCode = (e) => {
    this.setState({
      diagnosis_code: e.target.id
    },()=>{
      this.getSearchResult();
    });
  }

  handleVisitClick = (e, type, scheduled_item, scheduled_date, diagnosis_code=null, index=null) => {
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        scheduled_type: type,
        scheduled_item,
        scheduled_date,
        scheduled_diagnosis_code:diagnosis_code,
        menu_index:index,
      });
    }
  }

  diagnosisHover = (e, scheduled_item, scheduled_date) => {
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
    this.setState({
      hoverMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY + window.pageYOffset - 10,
      },
      scheduled_item,
      scheduled_date,
    });
  }

  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date arrow morning example-custom-input" onClick={onClick}>
        {formatJapanMonth(value)}
      </div>
    );

    return (      
        <PatientsWrapper>
          <div className="title-area"><div className={'title'}>予約カレンダー</div></div>
          <Flex>
            <div className="search-box">
              <div className="year_month flex">
                <div className="prev-month arrow" onClick={this.PrevMonth}>{"< "}</div>
                <DatePicker
                  locale="ja"
                  selected={this.state.search_month}
                  onChange={this.getSearchMonth.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={<ExampleCustomInput />}
                  dayClassName = {date => setDateColorClassName(date)}
                />
                <div className="next-month arrow" onClick={this.NextMonth}>{" >"}</div>
              </div>
              <div className={'space-area'}></div>
              <div className='top_right_area flex'>
                <div className = "selectbox-area select-group">
                  <SelectorWithLabel
                    options={this.state.diagnosis}
                    title="診療科"
                    getSelect={this.setDiagnosisCode}
                    departmentEditCode={this.state.diagnosis_code}
                  />
                </div>
                <div className = "selectbox-area">
                  <SelectorWithLabel
                    options={display_order}
                    title="表示順"
                    getSelect={this.getOrderSelect}
                    departmentEditCode={this.state.order_type}
                  />
                </div>
                <div className="patient_numbers">{this.state.schedule_data != null ? this.state.schedule_data.length : 0}名</div>
              </div>
            </div>
          </Flex>
          <div className={'schedule-area'}>
            <table className="table-scroll table table-bordered" id="code-table">
              <thead>
              <tr>
                <th>
                  <div className={'text-left patient-name'}>患者番号</div>
                  <div className={'text-left'}>氏名</div>
                </th>
                {this.createTable('thead')}
              </tr>
              </thead>
              <tbody>
              {this.state.schedule_data == null ? (
                <tr>
                  {this.createTable('null')}
                </tr>
              ):(
                <>
                  {this.state.schedule_data.length === 0 ? (
                    <tr>
                      {this.createTable('no_data')}
                    </tr>
                  ) : (
                    this.state.schedule_data.map((item, index) => {
                      return (
                        <>
                          <tr>
                            <td onClick={()=>this.goKartePage(item.system_patient_id)} className="visit-patient-name">
                              <div className={'text-left'}>{item.patient_number}</div>
                              <div className={'text-left'}>{item.patient_name}</div>
                            </td>
                            {this.createTable('tbody', index)}
                          </tr>
                        </>
                      )
                    })
                  )}
                </>
              )}
              </tbody>
            </table>
            {this.state.isReservationCreateModal && (
              <ReservationCreateModal
                closeModal={this.closeModal}
                patient_name={this.state.patient_name}
                system_patient_id={this.state.system_patient_id}
                scheduled_date={this.state.scheduled_date}
                scheduled_time={this.state.scheduled_time}
                scheduled_status={this.state.scheduled_status}
                scheduled_diagnosis_code={this.state.scheduled_diagnosis_code}
                number={this.state.number}
              />
            )}
            {this.state.confirm_message !== "" && (
              <SystemConfirmModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk.bind(this)}
                confirmTitle= {this.state.confirm_message}
              />
            )}
            {this.state.alert_messages !== "" && (
              <SystemAlertModal
                hideModal= {this.confirmCancel.bind(this)}
                handleOk= {this.confirmCancel.bind(this)}
                showMedicineContent= {this.state.alert_messages}
              />
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              scheduled_type={this.state.scheduled_type}
              scheduled_item={this.state.scheduled_item}
              scheduled_date={this.state.scheduled_date}
              scheduled_diagnosis_code={this.state.scheduled_diagnosis_code}
              menu_index={this.state.menu_index}
            />
            <HoverMenu
              {...this.state.hoverMenu}
              parent={this}
              scheduled_item={this.state.scheduled_item}
              scheduled_date={this.state.scheduled_date}
              diagnosis={this.state.diagnosis}
            />
          </div>
          {this.state.isOpenKarteModeModal && (
            <SelectModeModal
              modal_data={this.state.modal_data}
              goToUrl={this.goToUrlFunc.bind(this)}
              closeModal={this.closeModeModal}
              modal_type={this.state.modal_type}
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

ReservationSchedule.contextType = Context;
ReservationSchedule.propTypes = {
  history: PropTypes.object,
}
export default ReservationSchedule;
