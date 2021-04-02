import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {formatDateLine, formatTimeSecondIE, getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import SearchBar from "~/components/molecules/SearchBar";
import Button from "~/components/atoms/Button";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Checkbox from "~/components/molecules/Checkbox";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, KARTEMODE, KEY_CODES, CACHE_SESSIONNAMES, getAutoReloadInfo} from "~/helpers/constants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import { background as backgroundColor } from "~/components/_nano/colors";
import auth from "~/api/auth";
import SelectVisitDiagnosisTypeModal from "~/components/templates/Patient/SelectVisitDiagnosisTypeModal";
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import { formatJapanDateSlash } from "../../../../../helpers/date";
import $ from "jquery";
import * as localApi from "~/helpers/cacheLocal-utils";
import {setDateColorClassName} from '~/helpers/dialConstants';

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {display: flex;}
  .pullbox-select{
    height:2.4rem;
    line-height:2.4rem;
    font-size:1rem;
    min-width:6rem;
  }
  .MyCheck{
    margin-bottom: 0.2rem;
    label{
      font-size: 1rem;
      margin-right: 10px;
      margin-top:0.1rem;
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
      padding: 0.5rem;
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
    }
  }
  .title {
    font-size: 1.875rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .schedule-area {
    padding-left: 0.5rem;
    width: 100%;
    table {
      margin:0px;
      background-color: white;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(100vh - 18rem);
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
        border-bottom: 1px solid #dee2e6;
        tr{width: calc(100% - 17px);}
      }
      td {
        word-break: break-all;
        font-size: 1rem;
        vertical-align: middle;
        padding: 0.25rem;
        font-size: 1rem;
      }
      th {
        position: sticky;
        text-align: center;
        font-size: 1.25rem;
        white-space:nowrap;
        font-weight: normal;
        padding: 0.3rem;
        border:1px solid #dee2e6;
        border-bottom:none;
        border-top:none;
        font-weight: normal;
      }
    }
    .go-karte {
        cursor: pointer;
    }
    .go-karte:hover{
        background:lightblue!important;      
    }
    .no-result {
      padding: 200px;
      text-align: center;
      span {
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
  display: flex;
  align-items: center;
  padding: 0.5rem 0px 0.5rem 10px;
  width: 100%;
  input[type="text"]{
    height:2.4rem;
    font-size:1rem;
  }  
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    text-align: right;
    width: auto;
    margin:0;
    margin-right:0.5rem;
    margin-left:0.5rem;
    margin-top:0.1rem;
    font-size:1rem;
    line-height:2.4rem;
  }
  label {
    margin: 0;
    font-size:1rem;
    line-height:2.4rem;
  }
  .pullbox-label {
    margin-bottom:0;
    width:auto;
    padding-right:1rem;
    margin-right:1rem;
  }
  .pullbox-select {
    width:calc(100% + 1rem);
    font-size:1rem;
    padding-top:0.1rem;
  }
  .select-group {
    margin-right:0.5rem;
  }
  button {
    background-color: ${colors.surface};
    min-width: auto;
    margin-left: 2%;
    height:2.4rem;    
    padding:0;
    padding-left:1rem;
    padding-right:1rem;
    span{
      font-size:1rem;
    }
    margin-top: 2.3rem;
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
  .block-area {
    margin-top: 1rem;
    border: 1px solid #aaa;
    margin-left: 0.5rem;
    padding: 0.5rem;
    position: relative;
    label {
      font-size: 1rem;
      width: auto;
    }
    .check-state {
        button {
          margin-left: 0;
          margin-top: 5px;
          margin-right: 0.5rem;
        }
        label {margin-right: 0.5rem;}
    }
  }
  .block-title {
    position: absolute;
    top: -15px;
    left: 0.5rem;
    font-size: 1.125rem;
    background-color: ${backgroundColor};
    padding-left: 5px;
    padding-right: 5px;
  }
  
  .from-to {
    padding-left: 5px;
    padding-right: 5px;
    line-height: 2.4rem;
  }
  .prev-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 2.4rem;
    padding-left: 5px;
    padding-right: 5px;
    height: 2.4rem;
  }
  .next-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 2.4rem;
    padding-left: 5px;
    padding-right: 5px;
    height: 2.4rem;
  }
  .select-today {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 2.4rem;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 5px;
    padding-right: 5px;
    height: 2.4rem;
  }
  .react-datepicker-wrapper {
    input {
        width: 7rem;
        height: 2.4rem;
    }
  }
  .date-area {
    .MyCheck {
        label {
            line-height: 2.4rem;
        }   
    }
  }
  .auto-reload {
    margin-left: auto;
    margin-right: 0;
    text-align: right;
    margin-top: 2.4rem;
  }
  .select-department {
    margin-top: 2.6rem;
  }
`;

const SpinnerWrapper = styled.div`
    padding: 0;
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

class ReservationScheduleList extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    let schVal = localApi.getValue('patient_list_schVal');
    let auto_reload = 1;
    this.reload_time = 60 * 1000;
    let auto_reload_info = getAutoReloadInfo("reservation_list");
    if(auto_reload_info != undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    this.state = {
      schedule_data:null,
      isOpenKarteModeModal: false,
      reservation_states:{0: 1, 1: 1, 2: 1, 3: 0, 4: 0, 9: 0, 10: 0},
      state_info :  {0: "未診療", 1: "受付済", 2: "診察開始", 3: "診察終了", 4: "会計済", 9: "中止", 10: "中断"},
      diagnosis,
      alert_messages:'',
      scheduled_date:new Date(),
      schVal:schVal != (undefined && schVal != null) ? schVal : "",
      select_visit_diagnosis_type_modal:false,
      select_date_type:0,
      start_date: '',
      diagnosis_code:0,
      department_codes,
      selected_index:-1,
      auto_reload,
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.openModalStatus = 0;
  }

  async componentDidMount() {
    localApi.setValue("system_next_page", "/reservation_list");
    localApi.setValue("system_before_page", "/reservation_list");
    await this.getSearchResult(false);
    document.getElementById("search_bar").focus();
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time);
    auth.refreshAuth(location.pathname+location.hash);
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
    let path = "/app/api/v2/reservation/schedule/list";
    let post_data = {
      keyword:this.state.schVal,
      scheduled_date:this.state.scheduled_date !== '' ? formatDateLine(this.state.scheduled_date) : '',
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '',
      states:this.state.reservation_states,
      diagnosis_code:this.state.diagnosis_code,
    };
    localApi.setValue("patient_list_schVal", this.state.schVal);
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          this.setState({
            schedule_data: res,
            selected_index:0,
          }, ()=>{
            document.getElementById("list_area").focus();
          });
        } else {
          this.setState({
            schedule_data: [],
          });
        }
      })
      .catch(() => {
      }).finally(()=>{
        this.setState({is_searched});
      });
  }

  goKartePage = async(systemPatientId, number, state, diagnosis_code, scheduled_date, index=null) => {
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
        reservation_number : number,
        reservation_state : state,
        scheduled_date : scheduled_date,
        diagnosis_code,
        diagnosis_name : this.state.diagnosis[diagnosis_code],
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
        if(reservation_info !== undefined && reservation_info != null && reservation_info.schedule_number !== number){
          this.openModalStatus = 1;
          this.setState({alert_messages: '既に'+ reservation_info.diagnosis_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
          return;
        }
        let visit_info = karteApi.getVal(systemPatientId, CACHE_LOCALNAMES.VISIT_INFO);
        if(visit_info !== undefined && visit_info != null){
          this.openModalStatus = 1;
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
            this.setState({
              treatment_started_at,
              select_visit_diagnosis_type_modal:true,
              schedule_number:number,
              diagnosis_name:this.state.diagnosis[diagnosis_code],
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
    let reservation_info = {};
    reservation_info.schedule_number = this.state.schedule_number;
    reservation_info.treatment_started_at = this.state.treatment_started_at;
    reservation_info.diagnosis_name = this.state.diagnosis_name;
    reservation_info.visit_type = visit_type;
    reservation_info.diagnosis_type = diagnosis_type;
    karteApi.setVal(this.state.systemPatientId, CACHE_LOCALNAMES.RESERVATION_INFO, JSON.stringify(reservation_info));
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

  closeModal = () => {
    this.setState({
      alert_messages: "",
      isOpenKarteModeModal: false
    },()=>{
      document.getElementById("list_area").focus();
    });
    this.openModalStatus = 0;
  };

  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.closeModal();
  };

  goToPage = (url) => {
    this.props.history.replace(url);
  }

  setReservationStates = (name, number) => {
    let reservation_states = this.state.reservation_states;
    reservation_states[number] = !reservation_states[number];
    this.setState({reservation_states});
  }

  selectAllState=()=>{
    let reservation_states = {0:1, 1: 1, 2: 1, 3: 1, 4: 1, 9: 1, 10: 1};
    this.setState({reservation_states});
  }

  setDate = (e) =>{
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

  getDepartment = e => {
    this.setState({
      diagnosis_code:e.target.id,
    })
  };

  onKeyPressed(e) {
    let data = [];
    if (this.state.schedule_data != null && this.state.schedule_data.length > 0) {
      data = this.state.schedule_data;
    }
    if (e.keyCode === KEY_CODES.up) {
      this.setState(
        {
          selected_index:this.state.selected_index >= 1 ? this.state.selected_index - 1 : data.length - 1
        },
        () => {
          this.scrollToelement();
        }
      );
      $("#search_bar").blur();
      document.getElementById("list_area").focus();
    }

    if (e.keyCode === KEY_CODES.down) {
      this.setState(
        {
          selected_index: this.state.selected_index + 1 == data.length ? 0 : this.state.selected_index + 1
        },
        () => {
          this.scrollToelement();
        }
      );
      $("#search_bar").blur();
      document.getElementById("list_area").focus();
    }

    if (e.keyCode === KEY_CODES.enter) {
      let nFlag = $("#search_bar").is(':focus');
      if (nFlag == false) {
        let item = this.state.schedule_data[this.state.selected_index];
        if(item != undefined){
          this.goKartePage(item.system_patient_id, item.number, item.state, item.diagnosis_code, item.scheduled_date);
        }
      }
    }
  }

  scrollToelement = () => {
    // let scrollTop = 0;
    // let scrollHeight = 0;
    // let scroll_area_obj = document.getElementsByClassName("scroll-area")[0];
    // if(scroll_area_obj != undefined && scroll_area_obj != null){
    //   scrollTop = scroll_area_obj.scrollTop;
    //   scrollHeight = scroll_area_obj.offsetHeight;
    //   let tr_obj = document.getElementsByClassName("row-"+this.state.selected_index)[0];
    //   let selected_obj_Top = 0;
    //   let selected_obj_Height = 0;
    //   if(tr_obj != undefined && tr_obj != null){
    //     selected_obj_Top = tr_obj.offsetTop;
    //     selected_obj_Height = tr_obj.offsetHeight;
    //   }
    //   if(((selected_obj_Top - selected_obj_Height - scrollTop) > 0) && ((selected_obj_Top - scrollTop) > scrollHeight)){
    //     scroll_area_obj.scrollTop = selected_obj_Top - (selected_obj_Height * 2);
    //   }
    //   if((selected_obj_Top - selected_obj_Height - scrollTop) < 0){
    //     scroll_area_obj.scrollTop = selected_obj_Top - (selected_obj_Height * 3);
    //   }
    // }

    const els = $(".schedule-area [class*=selected]");
    const pa = $(".schedule-area .scroll-area");
    const th = $(".schedule-area .thead-area");
    if (els.length > 0 && pa.length > 0 && th.length > 0) {
      const thHight = $(th[0]).height();
      const elHight = $(els[0]).height();
      // const elTop = $(els[0]).position().top;
      const elTop = thHight + (elHight+1)*this.state.selected_index;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

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

  setAutoReload = (name, value) => {
    if(name == "auto_reload"){
      this.setState({auto_reload:value});
    }
  };

  render() {
    let list_names = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け ","病棟マップ", "訪問診療予定"];
    var list_urls = ["/patients", "/patients_search", "/hospital_ward_list", "/emergency_patients", "/reservation_list", "", "/hospital_ward_map", "/visit_schedule_list"];
    const menu_list_ids = ["1001","1002","1003","1006","1004","","1007", "1005"];
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth;
    return (
      <PatientsWrapper onKeyDown={this.onKeyPressed} id={'list_area'}>
        <div className="title-area flex">
          <div className={'title'}>予約一覧</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10)){
                  return(
                    <>
                      {item == "予約一覧" ? (
                        <Button className="tab-btn active-btn button">{item}</Button>
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
              <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
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
          <div className="date-area">
            <div className="MyCheck flex">
              <Radiobox
                label="日付指定"
                value={0}
                getUsage={this.setDate.bind(this)}
                checked={this.state.select_date_type === 0 ? true : false}
                name={`date-set`}
              />
              <div className="prev-day" onClick={this.moveDay.bind(this, 'prev')}>{"＜ "}</div>
              <div className={'select-today'} onClick={this.selectToday.bind()}>本日</div>
              <div className="next-day" onClick={this.moveDay.bind(this, 'next')}>{" ＞"}</div>
            </div>
            <div className="MyCheck flex">
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
          </div>
          <div className={'select-department'}>
            <SelectorWithLabel
              title="診療科"
              options={this.state.department_codes}
              getSelect={this.getDepartment}
              departmentEditCode={this.state.diagnosis_code}
            />
          </div>
          <div className={'block-area'}>
            <div className={'block-title'}>診察状態</div>
            <>
              <div className={'check-state'}>
                <Button type="mono" onClick={this.selectAllState.bind(this)}>全選択</Button>
                {Object.keys(this.state.reservation_states).map((index)=>{
                  return (
                    <>
                      <Checkbox
                        label={this.state.state_info[index]}
                        getRadio={this.setReservationStates.bind(this)}
                        number={index}
                        value={this.state.reservation_states[index]}
                        name={`reservation_state`}
                      />
                    </>
                  );
                })}
              </div>
            </>
          </div>
          <Button type="mono" onClick={this.getSearchResult.bind(this)}>検索</Button>
          <div className={'auto-reload'}>
            <Checkbox
              label="自動更新"
              getRadio={this.setAutoReload.bind(this)}
              value={this.state.auto_reload === 1}
              name="auto_reload"
            />
          </div>
        </Flex>
        <div className={'schedule-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th style={{width:"15rem"}}>氏名</th>
              <th style={{width:"15rem"}}>カナ氏名</th>
              <th style={{width:"12rem"}}>診療科</th>
              <th style={{width:"9rem"}}>予約日</th>
              <th style={{width:"7rem"}}>予約時間</th>
              <th style={{width:"12rem"}}>患者ID</th>
              <th style={{width:"6rem"}}>性別</th>
              <th style={{width:"6rem"}}>年齢</th>
              <th>状態</th>
            </tr>
            </thead>
            <tbody className={'scroll-area'}>
            {this.state.schedule_data == null ? (
              <tr>
                <td colSpan={'8'}>
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
                    <tr><td colSpan={'8'}><div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div></td></tr>)
                ) : (
                  this.state.schedule_data.map((item, index) => {
                    return (
                      <>
                        <tr
                          className={'row-'+index + ' go-karte ' + (this.state.selected_index == index ? 'selected' : '')}
                          onClick={()=>this.goKartePage(item.system_patient_id, item.number, item.state, item.diagnosis_code, item.scheduled_date, index)}
                        >
                          <td style={{width:"15rem"}}>{item.patient_name}</td>
                          <td style={{width:"15rem"}}>{item.patient_name_kana}</td>
                          <td style={{width:"12rem"}}>{this.state.diagnosis[item.diagnosis_code]}</td>
                          <td style={{width:"9rem"}}>{formatJapanDateSlash(item.scheduled_date)}</td>
                          <td style={{width:"7rem"}}>{item.scheduled_date.substr(11, 5)}</td>
                          <td style={{width:"12rem"}} className={'text-right'}>{item.patient_number}</td>
                          <td style={{width:"6rem"}}>{item.gender == 1 ? '男' : '女'}</td>
                          <td style={{width:"6rem"}}>{parseInt(new Date().getFullYear()) - parseInt(item.birthday)}歳</td>
                          <td>{this.state.state_info[item.state]}</td>
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
            modal_type={'reservation'}
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
      </PatientsWrapper>
    );
  }
}

ReservationScheduleList.contextType = Context;
ReservationScheduleList.propTypes = {
  history: PropTypes.object,
}
export default ReservationScheduleList;
