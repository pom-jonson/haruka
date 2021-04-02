import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {
  formatDateLine,
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SearchBar from "~/components/molecules/SearchBar";
import Button from "~/components/atoms/Button";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SelectVisitDiagnosisTypeModal from "~/components/templates/Patient/SelectVisitDiagnosisTypeModal";
import {formatJapanDate} from "../../helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, getAutoReloadInfo, KEY_CODES} from "~/helpers/constants";
import $ from "jquery";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import auth from "~/api/auth";
import {setDateColorClassName} from "~/helpers/dialConstants";

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {display: flex;}
  .pullbox-select{
    height:2.4rem;
    line-height:2.4rem;
    font-size:1rem;
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
    align-items: center;
    button {
      background-color: ${colors.surface};
      min-width: auto;
      margin-left: 0.5rem;
      padding: 0.5rem;
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
    .button{
      span{
        word-break: keep-all;
      }
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
  .buttons-area{
    position: absolute;
    right: 220px;
    padding-top: 10px;
  }
  .schedule-area {
    width: 100%;
    padding-left:0.5rem;
    table {
      margin:0px;
      background-color: white;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 18rem);
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
    .no-result {
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
  .icon-character {
    width:100%;
    height:100%;
    text-align:enter;
    line-heigt:2rem;
  }
  .auto-reload {
    margin-left: auto;
    margin-right: 0;
    text-align: right;
    label {
      font-size: 1rem;
      margin-right: 0;
    }
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  align-items: center;
  padding: 0.5rem 0;
  width: 100%;
  input[type="text"]{
    height:2.4rem;
    line-height:2.4rem;
    font-size:1rem;
  }  
  .search-box {
      width: 100%;
      display: flex;
  }
  .react-datepicker__navigation{
    background:none;
  }
  .label-title {
    margin:0;
    font-size:1rem;
    line-height:2.4rem;
  }
  label {
    margin: 0;
    font-size:1rem;
    line-height:2.4rem;
  }
  .select-date {
    line-height: 2.4rem;
    width: 6rem;
    text-align: right;
    margin-right: 0.5rem;
  }
  .select-group {
    margin-left:0.5rem;
    .label-title {width:3rem;}
    .pullbox-select {width:5rem;}
  }
  .select-department {
    margin-left:0.5rem;
    .label-title {width:4rem;}
    .pullbox-select {width:7rem;}
  }
  .select-doctor {
    margin-left:0.5rem;
    .label-title {width:5rem;}
    .pullbox-select {width:20rem;}
  }
  .select-other-doctor {
    margin:0 0.5rem;
    .label-title {width:4rem;}
    .pullbox-select {width:20rem;}
  }
  .select-emphasis-mode {
    .label-title {
      width:6rem;
      text-align:right;
      margin-right:0.5rem;
    }
    .pullbox-select {width:7rem;}
  }
  .block-area {
    border: 1px solid #aaa;
    margin-left: 2rem;
    padding: 5px;
    position: relative;
    label {
      font-size: 0.875rem;
      width: 6rem;
      
    }
    .check-state {
      button {
        margin-left: 0;
        margin-top: 5px;
        margin-right: 7px;
        padding: 8px 12px;
      }
    }
  }
  .search-btn {
    margin-left:0.5rem;
    height: 2.4rem;
    padding:0 0.5rem;
    background-color: rgb(255, 255, 255);
    span {font-size:1rem;}
  }
`;

const InputBox = styled.div`
  display: flex;
  label {
    color: ${colors.onSecondaryDark};
    letter-spacing: 0.4px;
    text-align: right;
    margin-right: 10px;
    line-height: 38px;
    font-size: 1rem;
    width: 5rem;
    margin-bottom: 0;
  }
  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 0.75rem;
    padding: 0 8px;
    width: 7rem;
    height: 38px;
  }
  input::-ms-clear {
    visibility: hidden;
  }
`;

const FlexTop = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 10px;
  padding-right: 0;
  width: 100%;
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
`;

const ContextMenu = ({visible, x, y, patient_info, hos_number, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("go_nurse_document",patient_info, hos_number)}>看護記録を開く</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class HospitalWardList extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      this.department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    let schVal = localApi.getValue('patient_list_schVal');
    let auto_reload = 1;
    this.reload_time = 60 * 1000;
    let auto_reload_info = getAutoReloadInfo("hospital_ward_list");
    if(auto_reload_info != undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    let ward_id = 0;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.user_ward_id != undefined && authInfo.user_ward_id != null && authInfo.user_ward_id != 0){
      ward_id = authInfo.user_ward_id;
    }
    if (ward_id == 0 && authInfo.auth_ward_id != undefined && authInfo.auth_ward_id != null && authInfo.auth_ward_id != 0){
      ward_id = authInfo.auth_ward_id;
    }
    this.state = {
      visit_group : [],
      doctor_id:0,
      main_doctor_id:0,
      isOpenKarteModeModal: false,
      search_date: '',
      schVal:schVal != (undefined && schVal != null) ? schVal : "",
      departmentCode:0,
      alert_messages:'',
      select_visit_diagnosis_type_modal:false,
      selected_index:-1,
      table_list:[],
      auto_reload,
      search_not_done_order:0,
      ward_id,
      emphasis_mode:0,
      list_color_info:{},
      load_flag:false,
    };
    this.doctors = null;
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.number;
        doctor.value = doctor.name;
        this.doctor_list.push(doctor);
      }
    });
    this.doctor_list.unshift({id:0,value:'全て'});
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.openModalStatus = 0;
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_master = [{id:0, value:"全て"}];
    if (cache_ward_master != undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value: ward.name});
      });
    }
    this.emphasis_mode = [
      {id:0,value:''},
      {id:1,value:'主治医'}
    ];
    this.doctor_color = null;
    this.main_doctor_codes = {};
  }

  async UNSAFE_componentWillMount () {
    let path = "/app/api/v2/master/hospitalization/searchMasterData";
    await apiClient
      ._post(path)
      .then((res) => {
        this.setState({
          hospital_room_master:res.hospital_room_master,
        });
      })
      .catch(() => {
      });

  }

  async componentDidMount() {
    await this.getDoctorsList();
    localApi.setValue("system_next_page", "/hospital_ward_list");
    localApi.setValue("system_before_page", "/hospital_ward_list");
    await this.getSearchResult(false);
    document.getElementById("search_bar").focus();
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time);
    auth.refreshAuth(location.pathname+location.hash);
  }

  getDoctorsList = async () => {
    this.doctors = await apiClient.get("/app/api/v2/secure/doctor/search?");
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
    if(this.state.load_flag){
      this.setState({load_flag:false})
    }
    let path = "/app/api/v2/hospitalization/search";
    let post_data = {
      keyword:this.state.schVal,
      search_date:formatDateLine(this.state.search_date),
      department:this.state.departmentCode,
      ward_id:this.state.ward_id,
      main_doctor_id:this.state.main_doctor_id,
      doctor_id:this.state.doctor_id,
      search_not_done_order:this.state.search_not_done_order,
      emphasis_mode:this.state.emphasis_mode,
    };
    localApi.setValue("patient_list_schVal", this.state.schVal);
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.doctor_color = res.doctor_color;
        this.main_doctor_codes = res.main_doctor_codes;
        if(res.ward_list.length > 0){
          this.setState({
            table_list: res.ward_list,
            is_searched,
            selected_index:0,
            load_flag:true,
          }, ()=>{
            document.getElementById("list_area").focus();
          });
        } else {
          this.setState({
            table_list: [],
            is_searched,
            load_flag:true,
          });
        }
      })
      .catch(() => {
      });
    if(this.state.table_list.length > 0){
      let patients_data = [];
      this.state.table_list.map(patient=>{
        patients_data.push({
          patient_id:patient.patient_id,
          hos_detail_id:patient.hos_detail_id,
          main_doctor_id:patient.main_doctor_id,
          nurse_id_in_charge:patient.nurse_id_in_charge,
          first_ward_id:patient.first_ward_id,
          hospital_room_id:patient.hospital_room_id,
          hospital_bed_id:patient.hospital_bed_id,
        })
      });
      this.getColorInfo(patients_data);
    }
  }
  
  getColorInfo=async(patients_data)=>{
    let path = "/app/api/v2/hospitalization/get_list_color_info";
    let post_data = {
      patients:patients_data,
      search_date:formatDateLine(this.state.search_date),
      search_not_done_order:this.state.search_not_done_order,
    };
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(authInfo.staff_category == 1){
      post_data.login_doctor = authInfo.doctor_number;
    }
    if(authInfo.staff_category == 2){
      post_data.login_nurse = authInfo.user_number;
    }
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({list_color_info:res});
      })
      .catch(() => {
      });
  }

  getGroupSelect = e => {
    this.setState({ visit_group_id: parseInt(e.target.id)});
  };

  setDoctorId = (key, e) => {
    this.setState({[key]:parseInt(e.target.id)});
  }

  goKartePage = async(systemPatientId, diagnosis_code, index=null) => {
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
        diagnosis_code,
        diagnosis_name : this.diagnosis[diagnosis_code],
        department : this.diagnosis[diagnosis_code],
      };
      this.openModalStatus = 1;
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+systemPatientId+"/"+page);
    }
  }

  closeModal = () => {
    this.setState({
      alert_messages: "",
      isOpenKarteModeModal: false
    },()=>{
      document.getElementById("list_area").focus();
    });
    this.openModalStatus = 0;
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
      search_date: value
    });
  };

  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.closeModal();
  };

  getKind = (e) => {
    this.setState({
      start_mode:e.target.value,
    })
  }

  getWardSelect = (e) => {
    this.setState({ward_id:e.target.id});
  };
  
  getDepartment = (e) => {
    this.setState({departmentCode:parseInt(e.target.id)});
  };
  
  getWardName (ward_id){
    if(ward_id==null) return '';
    if (this.ward_master == null || this.ward_master.length == 0) return '';
    if(this.ward_master.find(x=>x.id == ward_id) != undefined){
      return this.ward_master.find(x=>x.id == ward_id).value;
    } else {
      return '';
    }
  }
  getRoomName (room_id){
    if(room_id==null) return '';
    if (this.state.hospital_room_master == null || this.state.hospital_room_master.length == 0) return '';
    let ward_data = this.state.hospital_room_master.find(x=>x.number==room_id);
    if (ward_data == null) return '';
    return ward_data.name;
  }

  getDayDiff (datetime) {
    if (datetime == null) return '';
    let timeDiff = new Date(formatDateLine(new Date())).getTime() - new Date(datetime.split(' ')[0]).getTime();
    if(timeDiff < 0){
      return '';
    }
    timeDiff = Math.abs(timeDiff);
    let diffDays = parseInt(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return diffDays + '日';
  }

  onKeyPressed(e) {
    let data = this.state.table_list;
    if (e.keyCode === KEY_CODES.up) {
      this.setState({
          selected_index:this.state.selected_index >= 1 ? this.state.selected_index - 1 : data.length - 1
        },() => {
          this.scrollToelement();
      });
      $("#search_bar").blur();
      document.getElementById("list_area").focus();
    }
    if (e.keyCode === KEY_CODES.down) {
      this.setState({
        selected_index: this.state.selected_index + 1 == data.length ? 0 : this.state.selected_index + 1
      },() => {
        this.scrollToelement();
      });
      $("#search_bar").blur();
      document.getElementById("list_area").focus();
    }
    if (e.keyCode === KEY_CODES.enter) {
      let nFlag = $("#search_bar").is(':focus');
      if (nFlag == false) {
        let item = this.state.table_list[this.state.selected_index];
        if(item != undefined){
          this.goKartePage(item.patient_id, item.department_id)
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
      // const elTop = $(els[0]).position().top;
      const elTop = thHight + (elHight+1)*this.state.selected_index;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  setAutoReload = (name, value) => {
    if(name == "auto_reload"){
      this.setState({auto_reload:value});
    }
  };
  
  setSearchNotDoneOrder = (name, value) => {
    if(name == "search_not_done_order"){
      this.setState({search_not_done_order:value});
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

  getIconInfo=(icon_info, main_doctor_code)=>{
    let background = "";
    if(this.state.emphasis_mode == 1){
      let code_index = 0;
      if(Object.keys(this.main_doctor_codes).length > 0){
        Object.keys(this.main_doctor_codes).map(doctor_code=>{
          if(main_doctor_code == doctor_code){
            background = (this.doctor_color != null && this.doctor_color[code_index] != undefined && this.doctor_color[code_index] != null) ? this.doctor_color[code_index] : "";
          }
          code_index++;
        })
      }
    } else {
      if(icon_info != undefined && icon_info.length > 0){
        background = icon_info[0]['background-color'] != undefined ? icon_info[0]['background-color'] : "";
      }
    }
    return background;
  }
  
  handleClick=(e, patient_info, hos_number)=>{
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
          patient_info,
          hos_number,
        }
      })
    }
  }
  
  contextMenuAction = (modal_type, patient_info, hos_number) => {
    if(modal_type == "go_nurse_document") {
      let nurse_patient_info = {
        patientInfo:patient_info.patientInfo,
        detailedPatientInfo:patient_info.detailedPatientInfo,
        hos_number:hos_number,
      };
      localApi.setObject("nurse_patient_info", nurse_patient_info);
      localApi.remove("nurse_record");
      localApi.remove("nursing_history");
      this.props.history.replace("/patients/"+patient_info.system_patient_id+"/nursing_document");
    }
  }

  render() {
    let {table_list}=this.state;
    let list_names = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け ","病棟マップ", "訪問診療予定"];
    var list_urls = ["/patients", "/patients_search", "/hospital_ward_list", "/emergency_patients", "/reservation_list", "", "/hospital_ward_map", "/visit_schedule_list"];
    const menu_list_ids = ["1001","1002","1003","1006","1004","","1007", "1005"];
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth;
    return (
      <PatientsWrapper onKeyDown={this.onKeyPressed} id={'list_area'}>
        <div className="title-area flex">
          <div className={'title'}>病棟一覧</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10)){
                  return(
                    <>
                      {item == "病棟一覧" ? (
                        <Button className="button tab-btn active-btn">{item}</Button>
                      ):(
                        <Button className="button tab-btn" onClick={()=>this.goToUrlFunc(list_urls[index])}>{item}</Button>
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
          <div className={'auto-reload'}>
            <Checkbox
              label="未実施オーダーのある患者のみ"
              getRadio={this.setSearchNotDoneOrder.bind(this)}
              value={this.state.search_not_done_order === 1}
              name="search_not_done_order"
            />
          </div>
        </FlexTop>
        <Flex>
          <div style={{display:'flex'}}>
            <InputBox>
              <div className={'select-date'}>日付</div>
              <DatePicker
                locale="ja"
                selected={this.state.search_date}
                onChange={this.getDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                placeholderText="年/月/日"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dayClassName = {date => setDateColorClassName(date)}
              />
            </InputBox>
            <div className="select-group">
              <SelectorWithLabel
                options={this.ward_master}
                title="病棟"
                getSelect={this.getWardSelect}
                departmentEditCode={this.state.ward_id}
              />
            </div>
            <div className = "select-department">
              <SelectorWithLabel
                title="診療科"
                options={this.department_codes}
                getSelect={this.getDepartment}
                departmentEditCode={this.state.departmentCode}
              />
            </div>
            <div className = "select-doctor">
              <SelectorWithLabel
                options={this.doctor_list}
                title="主担当医"
                getSelect={this.setDoctorId.bind(this,"main_doctor_id")}
                departmentEditCode={this.state.main_doctor_id}
              />
            </div>
            <div className = "select-other-doctor">
              <SelectorWithLabel
                options={this.doctor_list}
                title="担当医"
                getSelect={this.setDoctorId.bind(this,"doctor_id")}
                departmentEditCode={this.state.doctor_id}
              />
            </div>
            <Button type="mono" className={'search-btn'} onClick={this.getSearchResult}>検索</Button>
          </div>
          <div className={'flex'} style={{marginTop:"0.5rem"}}>
            <div className = "select-emphasis-mode">
              <SelectorWithLabel
                options={this.emphasis_mode}
                title="強調モード"
                getSelect={this.setDoctorId.bind(this,"emphasis_mode")}
                departmentEditCode={this.state.emphasis_mode}
              />
            </div>
            <div className={'auto-reload'}>
              <Checkbox
                label="自動更新"
                getRadio={this.setAutoReload.bind(this)}
                value={this.state.auto_reload === 1}
                name="auto_reload"
              />
            </div>
          </div>
          {/*<div className='flex' style={{marginTop:'5px', paddingLeft:'30px'}}>*/}
            {/*<button onClick={this.getSearchResult}>最新表示</button>*/}
            {/*<div className={'block-area'}>*/}
            {/*<div className={'block-title'}>起動モード</div>*/}
            {/*<div className='flex'>*/}
            {/*<Radiobox*/}
            {/*id = {'karte'}*/}
            {/*label={'カルテ記述'}*/}
            {/*value={1}*/}
            {/*getUsage={this.getKind.bind(this)}*/}
            {/*checked={this.state.start_mode == 1 ? true : false}*/}
            {/*name={`start_mode`}*/}
            {/*/>*/}
            {/*<Radiobox*/}
            {/*id = {'nurse'}*/}
            {/*label={'看護記録'}*/}
            {/*value={0}*/}
            {/*getUsage={this.getKind.bind(this)}*/}
            {/*checked={this.state.start_mode == 0 ? true : false}*/}
            {/*name={`start_mode`}*/}
            {/*/>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div className='buttons-area'>*/}
            {/*<button style={{marginRight:"50px"}}>マルチビューア</button>*/}
            {/*<button>一覧印刷</button>*/}
            {/*<button>ファイル出力</button>*/}
            {/*<button>検索条件</button>*/}
            {/*</div>*/}
          {/*</div>*/}
        </Flex>
        <div className={'schedule-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th style={{width:"3rem"}}> </th>
              <th style={{width:"6rem"}}>病棟</th>
              <th style={{width:"5rem"}}>病室</th>
              <th style={{width:"7rem"}}>診療科</th>
              <th style={{width:"6rem"}}>患者ID</th>
              <th style={{width:"20rem"}}>患者名</th>
              <th style={{width:"11rem"}}>入院日</th>
              <th style={{width:"7rem"}}>入院日数</th>
              <th style={{width:'4rem'}}>性別</th>
              <th style={{width:'9rem'}}>生年月日</th>
              <th style={{width:"5rem"}}>年齢</th>
              <th>主治医</th>
              <th style={{width:"3rem"}}> </th>
            </tr>
            </thead>
            <tbody className={'scroll-area'}>
            {this.state.load_flag ? (
              <>
                {table_list.length > 0 ? table_list.map((item,index)=>{
                  let icon_info = this.state.list_color_info[item.patient_id];
                  return(
                    <tr
                      key={index}
                      className={'row-'+index + (this.state.selected_index == index ? ' selected' : '')}
                      onClick={this.goKartePage.bind(this, item.patient_id, item.department_id)}
                      style={{cursor:"pointer", textAlign:"left"}}
                      onContextMenu={e => this.handleClick(e, item.patient, item.number)}
                    >
                      <td style={{width:"3rem", textAlign:"right"}}>{index+1}</td>
                      <td style={{width:"6rem", textAlign:"left"}}>{this.getWardName(item.first_ward_id)}</td>
                      <td style={{width:"5rem", textAlign:"left"}}>{this.getRoomName(item.hospital_room_id)}</td>
                      <td style={{width:"7rem", textAlign:"left"}}>{this.diagnosis[item.department_id]}</td>
                      <td style={{width:"6rem", textAlign:"right"}}>{item.patient !== undefined ? item.patient.patient_number : ""}</td>
                      <td style={{width:"20rem", textAlign:"left"}} >{item.patient !== undefined ? item.patient.patient_name : ""}</td>
                      <td style={{width:"11rem", textAlign:"left"}}>{formatJapanDate(item.date_and_time_of_hospitalization.split("-").join("/"))}</td>
                      <td style={{width:"7rem", textAlign:"left"}}>{this.getDayDiff(item.date_and_time_of_hospitalization.split("-").join("/"))}</td>
                      <td style={{width:'4rem', textAlign:"left"}}>{item.patient !== undefined ?(item.patient.gender === 1 ? "男": item.patient.gender === 2 ? "女" : ""): ""}</td>
                      <td style={{width:'9rem', textAlign:"left"}}>{item.patient !== undefined ? item.patient.birthday: ""}</td>
                      <td style={{width:"5rem", textAlign:"left"}}>{item.patient !== undefined ? item.patient.age+"歳": ""}</td>
                      <td style={{textAlign:"left"}}>{item.doctor_name}</td>
                      <td className={'text-center'} style={{width:"3rem",padding:0, backgroundColor:this.getIconInfo(icon_info, item.main_doctor_code)}}>
                        {icon_info != undefined && icon_info.length > 0 && (
                          icon_info.map((icon_info)=>{
                            let icon_over_text = icon_info['icon_over_text'] != undefined ? icon_info['icon_over_text'] : "";
                            return (
                              <>
                                {icon_over_text  != "" ? (
                                  <OverlayTrigger
                                    placement={index == 0 ? "bottom" : "top"}
                                    overlay={renderTooltip(icon_over_text)}>
                                    <div className={'icon-character'} style={{color:(icon_info['icon_character_color'] != undefined ? icon_info['icon_character_color'] : "")}}>
                                      {icon_info['icon_character']}
                                    </div>
                                  </OverlayTrigger>
                                ):(
                                  <div className={'icon-character'} style={{color:(icon_info['icon_character_color'] != undefined ? icon_info['icon_character_color'] : "")}}>
                                    {icon_info['icon_character']}
                                  </div>
                                )}
                              </>
                            )
                          })
                        )}
                      </td>
                    </tr>
                  )
                }):(
                  <tr style={{height:"calc( 100vh - 18rem)"}}>
                    <td colSpan={'13'} style={{verticalAlign:"middle"}}>
                      <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                    </td>
                  </tr>
                )}
              </>
            ):(
              <tr style={{height:"calc( 100vh - 18rem)"}}>
                <td colSpan={'13'} style={{verticalAlign:"middle"}}>
                  <div className='spinner_area no-result'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'ward_list'}
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
      </PatientsWrapper>
    );
  }
}

HospitalWardList.contextType = Context;
HospitalWardList.propTypes = {
  history: PropTypes.object,
}
export default HospitalWardList;

