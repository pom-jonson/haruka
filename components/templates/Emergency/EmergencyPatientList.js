import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {
  formatDateLine, getNextDayByJapanFormat, getPrevDayByJapanFormat,
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import SearchBar from "~/components/molecules/SearchBar";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import auth from "~/api/auth";
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import EmergencyReceptionModal from "~/components/templates/Emergency/EmergencyReceptionModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, getAutoReloadInfo, KEY_CODES} from "~/helpers/constants";
import $ from "jquery";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import Checkbox from "~/components/molecules/Checkbox";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import {setDateColorClassName} from "~/helpers/dialConstants";

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {
    display: flex;
  }  
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
  .hBWNut {
    padding-top: 90px!important;
  }
  .schedule-area {
    padding-left:0.5rem;
    width: 100%;
    table {
      background-color: white;
      margin:0px;
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
    // .go-karte:hover{
    //     background:lightblue!important;      
    // }
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
    margin:0.1rem 0.5rem 0rem 1rem;
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
  .pullbox-select{    
    width:calc(100% + 1rem);
    font-size:1rem;
    padding-top:0.1rem;    
  }
  .react-datepicker__navigation{
    background:none;
  }  
  .select-group {
    margin-right:10px;
  }
  button {
    background-color: ${colors.surface};
    min-width: auto;
    margin-left: 0.5rem;
    height:2.4rem;    
    padding:0;
    padding-left:1rem;
    padding-right:1rem;
    span{
      font-size:1rem;
    }
    margin-top: 2.6rem;
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
        width: 6.5rem;
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
    margin-top: 2.6rem;
  }
  .select-department {
    margin-top:2.6rem;
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
    width:180px;
  }
  .context-menu li {
    clear: both;
    width: 180px;
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

const ContextMenu = ({visible,x,y,reception_index,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("reception_edit",reception_index)}>編集</div></li>
          <li><div onClick={() => parent.contextMenuAction("reception_delete",reception_index)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class EmergencyPatientList extends Component {
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
    let auto_reload_info = getAutoReloadInfo("emergency_patient_list");
    if(auto_reload_info != undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    this.state = {
      reception_data:null,
      diagnosis,
      alert_messages:'',
      scheduled_date:new Date(),
      schVal:schVal != (undefined && schVal != null) ? schVal : "",
      select_date_type:0,
      start_date: '',
      diagnosis_code:0,
      department_codes,
      patient_status_id:0,
      openEmergencyReceptionModal:false,
      confirm_message:"",
      isConfirmModal:false,
      selected_index:-1,
      auto_reload,
      isOpenKarteModeModal:false,
    };
    this.patient_status_master = [{id:0, value:""}];
    this.hospital_visit_classific_master = {};
    this.hospital_method_master = {};
    this.ward_master = {};
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.openModalStatus = 0;
  }

  async componentDidMount() {
    localApi.setValue("system_next_page", "/emergency_patients");
    localApi.setValue("system_before_page", "/emergency_patients");
    await this.getMasterData();
    await this.getSearchResult(false);
    document.getElementById("search_bar").focus();
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time);
    auth.refreshAuth(location.pathname+location.hash);
  }

  getMasterData=async()=>{
    let path = "/app/api/v2/emergency/get/maser_data";
    let post_data = {
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.hospital_visit_classific_master !== undefined && res.hospital_visit_classific_master.length > 0){
          res.hospital_visit_classific_master.map(item=>{
            this.hospital_visit_classific_master[item.hospital_visit_classific_id] = item.name;
          })
        }
        // if(res.accident_classific_master !== undefined && res.accident_classific_master.length > 0){
        //     res.accident_classific_master.map(item=>{
        //         let master = {id:item.accident_classific_id, value:item.name};
        //         this.accident_classific_master.push(master);
        //     })
        // }
        if(res.hospital_method_master !== undefined && res.hospital_method_master.length > 0){
          res.hospital_method_master.map(item=>{
            this.hospital_method_master[item.hospital_method_id] = item.name;
          })
        }
        if(res.patient_status_master !== undefined && res.patient_status_master.length > 0){
          res.patient_status_master.map(item=>{
            let master = {id:item.patient_status_id, value:item.name};
            this.patient_status_master.push(master);
          })
        }
        // if(res.ambulance_affiliation_master !== undefined && res.ambulance_affiliation_master.length > 0){
        //     res.ambulance_affiliation_master.map(item=>{
        //         let master = {id:item.ambulance_affiliation_id, value:item.name};
        //         this.ambulance_affiliation_master.push(master);
        //     })
        // }
        // if(res.autopsy_classific_master !== undefined && res.autopsy_classific_master.length > 0){
        //     res.autopsy_classific_master.map(item=>{
        //         let master = {id:item.autopsy_classific_id, value:item.name};
        //         this.autopsy_classific_master.push(master);
        //     })
        // }
        if(res.ward_master !== undefined && res.ward_master.length > 0){
          res.ward_master.map(item=>{
            this.ward_master[item.number] = item.name;
          })
        }
      })
      .catch(() => {
      });
  };

  autoReload=()=>{
    if(this.state.auto_reload == 1 && this.openModalStatus == 0){
      this.getSearchResult();
    }
  }
  
  componentWillUnmount (){
    clearInterval(this.reloadInterval);
  }

  getSearchResult =async(is_searched=true)=>{
    this.setState({reception_data: null});
    let path = "/app/api/v2/emergency/get/reception_list";
    let post_data = {
      keyword:this.state.schVal,
      scheduled_date:this.state.scheduled_date !== '' ? formatDateLine(this.state.scheduled_date) : '',
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '',
      diagnosis_code:this.state.diagnosis_code,
      patient_status_id:this.state.patient_status_id,
    };
    localApi.setValue("patient_list_schVal", this.state.schVal);
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          this.setState({
            reception_data: res,
            selected_index:0,
          }, ()=>{
            document.getElementById("list_area").focus();
          });
        } else {
          this.setState({
            reception_data: [],
          });
        }
      })
      .catch(() => {
      }).finally(()=>{
        this.setState({is_searched});
      });
  };

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

  confirmCancel=(act)=>{
    this.setState({
      alert_messages: "",
      openEmergencyReceptionModal: false,
      isConfirmModal: false,
      isOpenKarteModeModal: false
    }, ()=>{
      if(act === "register"){
        this.getSearchResult();
      }
    });
    this.openModalStatus = 0;
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
      diagnosis_code:parseInt(e.target.id),
    })
  };

  setPatientStatus = (e) => {
    this.setState({
      patient_status_id:parseInt(e.target.id),
    });
  };
  handleClick=(e, reception_index)=>{
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          reception_index,
        },
      })
    }
  };

  contextMenuAction = (act, reception_index) => {
    if( act === "reception_edit") {
      this.openModalStatus = 1;
      this.setState({
        openEmergencyReceptionModal: true,
        reception_index,
      });
    }
    if( act === "reception_delete") {
      this.openModalStatus = 1;
      this.setState({
        isConfirmModal: true,
        confirm_message: '削除しますか？',
        reception_index,
      });
    }
  };

  deleteReception=async()=>{
    let path = "/app/api/v2/emergency/delete/reception";
    let post_data = {
      number:this.state.reception_data[this.state.reception_index]['number'],
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.openModalStatus = 1;
        this.setState({
          isConfirmModal:false,
          alert_messages:res.alert_message,
        },()=>{
          this.getSearchResult();
        });
      })
      .catch(() => {
      });
  };

  goToPage = (url) => {
    this.props.history.replace(url);
  }

  onKeyPressed(e) {
    let data = [];
    if (this.state.reception_data != null && this.state.reception_data.length > 0) {
      data = this.state.reception_data;
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
        this.goKartePage(this.state.selected_index);
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

  goKartePage = async(index=null) => {
    if(this.state.selected_index != index){
      this.setState({selected_index:index});
    }
    let patient_info = this.state.reception_data[index];
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
        department_code:patient_info.department_id,
        diagnosis_name : this.state.diagnosis[patient_info.department_id],
        department : this.state.diagnosis[patient_info.department_id],
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

  render() {
    let list_names = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け ","病棟マップ", "訪問診療予定"];
    var list_urls = ["/patients", "/patients_search", "/hospital_ward_list", "/emergency_patients", "/reservation_list", "", "/hospital_ward_map", "/visit_schedule_list"];
    const menu_list_ids = ["1001","1002","1003","1006","1004","","1007", "1005"];
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth;
    return (
      <PatientsWrapper onKeyDown={this.onKeyPressed} id={'list_area'}>
        <div className="title-area flex">
          <div className={'title'}>救急一覧</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10)){
                  return(
                    <>
                      {item == "救急一覧" ? (
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
                  dayClassName = {date => setDateColorClassName(date)}
                  disabled={this.state.select_date_type === 2 ?  false : true}
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
                  dayClassName = {date => setDateColorClassName(date)}
                  disabled={this.state.scheduled_date === '' ?  true : false}
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
          <div className={'select-department'}>
            <SelectorWithLabel
              title="患者状態"
              options={this.patient_status_master}
              getSelect={this.setPatientStatus}
              departmentEditCode={this.state.patient_status_id}
            />
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
              <th style={{width:"calc(3rem - 1px)"}}> </th>
              <th style={{width:"10rem"}}>受付日付</th>
              <th style={{width:"10rem"}}>診療科</th>
              <th style={{width:"10rem"}}>患者番号</th>
              <th style={{width:"20rem"}}>患者名</th>
              <th style={{width:"10rem"}}>来院区分</th>
              <th style={{width:"10rem"}}>来院方法</th>
              <th>病棟</th>
            </tr>
            </thead>
            <tbody className={'scroll-area'}>
            {this.state.reception_data == null ? (
              <tr>
                <td colSpan={'10'}>
                  <div className='spinner_area no-result'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </td>
              </tr>
            ):(
              <>
                {this.state.reception_data.length === 0 ? (
                  this.state.is_searched && (
                    <tr><td colSpan={'10'}><div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div></td></tr>)
                ) : (
                  this.state.reception_data.map((item, index) => {
                    return (
                      <>
                        <tr
                          className={'row-'+index + ' go-karte ' + (this.state.selected_index == index ? 'selected' : '')}
                          onContextMenu={e => this.handleClick(e, index)}
                          onClick={this.goKartePage.bind(this, index)}
                        >
                          <td className={'text-right'} style={{width:"3rem"}}>{index+1}</td>
                          <td style={{width:"10rem"}}>{item.reception_date}</td>
                          <td style={{width:"10rem"}}>{this.state.diagnosis[item.department_id]}</td>
                          <td className={'text-right'} style={{width:"10rem"}}>{item.patient_number}</td>
                          <td style={{width:"20rem"}}>{item.patient_name}</td>
                          <td style={{width:"10rem"}}>{this.hospital_visit_classific_master[item.hospital_visit_classific_id] !== undefined ? this.hospital_visit_classific_master[item.hospital_visit_classific_id] : ""}</td>
                          <td style={{width:"10rem"}}>{this.hospital_method_master[item.hospital_method_id] !== undefined ? this.hospital_method_master[item.hospital_method_id] : ""}</td>
                          <td>{this.ward_master[item.hospital_id] !== undefined ? this.ward_master[item.hospital_id] : ""}</td>
                        </tr>
                      </>
                    )
                  })
                )
                }
              </>
            )}
            </tbody>
          </table>
        </div>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.openEmergencyReceptionModal && (
          <EmergencyReceptionModal
            closeModal= {this.confirmCancel.bind(this)}
            modal_data= {this.state.reception_data[this.state.reception_index]}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.isConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deleteReception.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.confirmCancel}
            modal_type={'emergency_list'}
          />
        )}
      </PatientsWrapper>
    );
  }
}

EmergencyPatientList.contextType = Context;
EmergencyPatientList.propTypes = {
  history: PropTypes.object,
}
export default EmergencyPatientList;
