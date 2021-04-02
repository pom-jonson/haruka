import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import SearchBar from "../molecules/SearchBar";
import SelectorWithLabel from "../molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Button from "../atoms/Button";
import NotConsentedModal from "../organisms/NotConsentedModal";
import Context from "~/helpers/configureStore";
import * as methods from "./PatientMethods";
import * as apiClient from "../../api/apiClient";
import auth from "~/api/auth";
import SystemConfirmModal from "../molecules/SystemConfirmModal";
import {CACHE_SESSIONNAMES, getAutoReloadInfo, KEY_CODES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { formatDate4API } from "../../helpers/date";
import { options } from "../../helpers/departments";
import $ from "jquery";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Checkbox from "~/components/molecules/Checkbox";
import {setDateColorClassName} from "~/helpers/dialConstants";
registerLocale("ja", ja);
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import LargeUserIcon from "~/components/atoms/LargeUserIcon";
import BasicInfoModal from "~/components/organisms/BasicInfoModal";

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;  
  .pullbox-select{
    height:2.4rem;
    line-height:2.4rem;
    font-size:1rem;
    min-width:6rem;
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
      margin-left: 0.5rem;
      padding: 0.5rem 0.5rem;
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
      margin-left: 0.5rem;
      padding: 0.5rem 0.5rem;
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
      .close-back-btn {margin-left: 0.5rem !important;}
    }
  }
  .title {
    font-size: 1.875rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .table-area {
    width: 100%;
    padding-left: 0.5rem;
    table {
      background-color: white;
      margin:0px;
      font-size: 1rem;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 15.5rem);
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
        padding: 0.3rem 0;
        border-bottom: none;
        border-top: none;
        font-weight: normal;
      }
    }
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
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .go-karte {
    cursor: pointer;
    position: relative;
    &.before {
      color: ${colors.error};
      font-weight: bold;
    }
    &.stop {
      color: ${colors.disable};
      & td:first-child:before {
        content: "";
        width: 100%;
        height: 1px;
        border-top: solid 1px ${colors.disable};
        position: absolute;
        left: 0;
        top: calc(50% - 3px);
        opacity: 0.5;
      }
      & td:last-child:after {
        content: "";
        width: 100%;
        height: 1px;
        border-bottom: solid 1px ${colors.disable};
        position: absolute;
        left: 0;
        bottom: calc(50% - 3px);
        opacity: 0.5;
      }
    }
  }
  .go-karte:hover{
    background:lightblue!important;
  }
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  .selected:hover {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  .bold {font-weight: bold;}
  .red {color: rgb(241, 86, 124);}
  .finished {
    span {
      color: ${colors.onSurface};
      opacity: 0.5;
    }
  }
  .finished {
    span {
      color: ${colors.onSurface};
      opacity: 0.5;
    }
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 0.5rem 10px;
  input[type="text"]{
    height:2.4rem;
    line-height:2.4rem;
    font-size:1rem;
  }
  width: 100%;
  z-index: 100;
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
  
  .disabled{
    background: rgb(208, 208, 208);
  }
  .pullbox-label{
    width:auto;
    padding-right:1rem;
    margin-right:1rem;
  }
  .pullbox-select{    
    width:calc(100% + 1rem);
    font-size:1rem;
    padding-top:0.1rem;    
  }
  .auto-reload {
    text-align: right;
    margin-left: auto;
    margin-right: 0;
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
        input {
          width: 100%;
          ime-mode: inactive;
        }
    }
  }
  button {
    background-color: ${colors.surface};
    min-width: auto;
    margin-left: 9px;
    padding: 8px 12px;
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
    }
  }
  .move-btn-area {
    margin-right:0;
    margin-left:auto;
  }
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 24px;
  label {
    color: ${colors.onSecondaryDark};
    // font-size: 0.75rem;
    font-size: 1rem;
    line-height: 38px;
    letter-spacing: 0.4px;
    margin-right: 8px;
  }
  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 1rem;
    padding: 0 8px;
    width: 120px;
    height: 38px;
  }
  input::-ms-clear {
    visibility: hidden;
  }
`;

const diOptions = [
  {
    id: 1,
    value: "全て"
  },
  {
    id: 2,
    value: "未診療あり"
  },
  {
    id: 3,
    value: "診療済み"
  }
];

class Patients extends Component {
  checkHasCacheData = methods.checkHasCacheData.bind(this);
  getTrackData = methods.getTrackData.bind(this);

  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let schVal = localApi.getValue('patient_list_schVal');
    let search_department = localApi.getValue('patient_list_search_department');
    let auto_reload = 1;
    this.reload_time = 60 * 1000;
    let auto_reload_info = getAutoReloadInfo("patient_recept_list");
    if(auto_reload_info != undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    this.state = {
      examining: false,
      patientsList: [],
      staff_category: authInfo.staff_category || 2,
      authInfo: authInfo,
      hasNotConsentedData: false,
      confirm_message: "",
      editPatientId : "",
      schVal:schVal != (undefined && schVal != null) ? schVal : "",
      departmentStatus:(search_department != undefined && search_department != null) ? search_department
        : ((authInfo != undefined && authInfo != null && authInfo.staff_category === 1 && authInfo.department > 0) ? authInfo.department : 0),
      selected_index:-1,
      isOpenKarteModeModal: false,
      modal_data: {},
      auto_reload,
      is_searched:false,
      isOpenBasicInfo:false,
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.openModalStatus = 0;
  }

  async componentDidMount() {
    document.getElementById("search_bar").focus();
    localApi.setValue("system_next_page", "/patients");
    localApi.setValue("system_before_page", "/patients");
    let hasCacheData = await this.checkHasCacheData();
    this.context.$updateAuths(
      this.state.authInfo.feature_auth === undefined
        ? ""
        : this.state.authInfo.feature_auth,
      this.state.authInfo.common_auth === undefined
        ? ""
        : this.state.authInfo.common_auth
    );
    if (hasCacheData === false) {
      if (this.context.medical_department_name === undefined) {
        this.context.$updateDepartmentName(
          this.state.authInfo.medical_department_name,
          this.state.authInfo.duties_department_name
        );
      }
      this.context.$updateDepartment(0, "");
      if (this.state.staff_category === 1) {
        let data = await this.getInsuranceTypeList();
        this.context.$updateInsuranceTypeList(data);
      }
      await this.searchPatientsList();
      window.sessionStorage.removeItem("prescribe-container-scroll");
      window.sessionStorage.removeItem("isCallingAPI");
      window.sessionStorage.setItem("prescribe-auto-focus", 1);
    } else {
      await this.searchPatientsList();
    }

    for (var key in window.localStorage) {
      if (key.includes("medicine_keyword") || key.includes("inject_keyword")) {
        window.localStorage.removeItem(key);
      }
    }
    window.localStorage.removeItem("haruka_delete_cache");
    window.localStorage.removeItem("haruka_delete_inject_cache");
    window.sessionStorage.removeItem("haruka_done_cache");
    window.sessionStorage.removeItem("haruka_inject_done_cache");
    document.getElementById("search_bar").focus();
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time);
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  componentWillUnmount() {
    clearInterval(this.reloadInterval);
    var panelGroup = document.getElementsByClassName('container')[0];
    this.purge(panelGroup);
  }
  
  purge(d) {
    var a = d.attributes, i, l, n;
    if (a) {
      l = a.length;
      for (i = 0; i < l; i += 1) {
        n = a[i].name;
        if (typeof d[n] === 'function') {
          d[n] = null;
        }
      }
    }
    a = d.childNodes;
    if (a) {
      l = a.length;
      for (i = 0; i < l; i += 1) {
        this.purge(d.childNodes[i]);
      }
    }
  }

  getInsuranceTypeList = async () => {
    return await apiClient.get("/app/api/v2/karte/insurance_type_list");
  };

  getNotConsentedHistoryData = async () => {
    let params = {
      get_consent_pending: 1
    };
    return await apiClient.get("/app/api/v2/order/prescription/patient", {
      params: params
    });
  };
  getNotConsentedInjectionHistoryData = async () => {
    let params = {
      get_consent_pending: 1
    };
    return await apiClient.get("/app/api/v2/order/injection/find", {
      params: params
    });
  };
  
  getNotConsentedAllOrderHistoryData = async () => {
    let params = {
      get_consent_pending: 1
    };
    return await apiClient.get("/app/api/v2/order/notConsented/findHistory", {
      params: params
    });
  };

  getPatientsListSearchResult = async () => {
    const {
      dateStatus,
      treatStatus,
      pageStatus,
      limitStatus
    } = this.context;
    let path = "/app/api/v2/patients/received";
    let post_data = {};
    if(this.state.schVal != ""){
      post_data['keyword'] = this.state.schVal;
    }
    let dateStr = dateStatus ? formatDate4API(dateStatus) : "";
    if(dateStr != ""){
      post_data['date'] = dateStr;
    }
    post_data['department'] = 0;
    if(this.state.departmentStatus){
      post_data['department'] = this.state.departmentStatus;
    }
    post_data['status'] = 0;
    if(treatStatus){
      post_data['status'] = treatStatus;
    }
    post_data['page'] = 1;
    if(pageStatus){
      post_data['page'] = pageStatus;
    }
    if(limitStatus != 20){
      post_data['limit'] = limitStatus;
    }
    if(treatStatus == 2){
      post_data['all_medical_treatment_end'] = 1;
    }
    let patient = null;
    localApi.setValue("patient_list_schVal", this.state.schVal);
    localApi.setValue("patient_list_search_department", this.state.departmentStatus);
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        patient = res;
      })
      .catch(() => {
      });
    return patient;
  };
  
  getPatientsNotDoneInfo = async (patient_numbers) => {
    let path = "/app/api/v2/patients/get_exit_not_done_order";
    let post_data = {patient_numbers};
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(Object.keys(res).length > 0){
          let patientsList = [];
          this.state.patientsList.map(patient=>{
            if(res[patient.systemPatientId] != undefined){
              patient['emphasis_icon_info'] = res[patient.systemPatientId];
            }
            patientsList.push(patient);
          });
          this.setState({patientsList});
        }
      })
      .catch(() => {
      });
  };

  getFirstPatientsListSearchResult = async () => {
    const {
      dateStatus,
      treatStatus,
      pageStatus,
      limitStatus
    } = this.context;
    let departmentStatus= this.state.departmentStatus;
    if (this.state.staff_category === 1) {
      if(this.state.authInfo.department != undefined && this.state.authInfo.department > 0) {
        departmentStatus = this.state.authInfo.department;
      }
    }
    let dateStr = dateStatus ? formatDate4API(dateStatus) : "";
    let apitxt = "/app/api/v2/patients/received?";

    apitxt = apitxt + (this.state.schVal != "" ? "keyword=" + this.state.schVal + "&" : "");
    apitxt = apitxt + (dateStr != "" ? "date=" + dateStr + "&" : "");
    apitxt =
      apitxt +
      (departmentStatus
        ? "department=" + departmentStatus + "&"
        : "department=0&");
    apitxt =
      apitxt + (treatStatus ? "status=" + treatStatus + "&" : "status=0&");
    apitxt = apitxt + (pageStatus ? "page=" + pageStatus : "page=1");
    apitxt = apitxt + (limitStatus != 20 ? "&limit=" + limitStatus : "");
    apitxt = apitxt + (treatStatus == 2 ? "&all_medical_treatment_end=1" : "");
    localApi.setValue("patient_list_schVal", this.state.schVal);
    return await apiClient.get(apitxt);
  };

  searchFirstPatientsList = async () => {
    const patientsList = await this.getFirstPatientsListSearchResult();
    this.setState({ patientsList }, ()=>{
      if(patientsList.length > 0){
        this.setState({selected_index:0}, ()=>{
          document.getElementById("list_area").focus();
        });
      }
    });
  };

  search = word => {
    word = word.toString().trim();
    this.setState({schVal:word});
  };

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchPatientsList();
    }
  };

  getTreatSelect = e => {
    this.context.$updateTreatStatus(parseInt(e.target.id));
  };

  getDepartmentSelect = e => {
    this.setState({departmentStatus:parseInt(e.target.id)});
  };

  getDate = value => {
    if (value == null) {
      value = new Date();
    }
    this.context.$updateDateStatus(value);
  };

  autoReload=()=>{
    if(this.state.auto_reload == 1 && this.openModalStatus == 0){
      this.searchPatientsList();
    }
  }

  searchPatientsList = async () => {
    if(this.state.is_searched) {
      this.setState({is_searched: false});
    }
    const patientsList = await this.getPatientsListSearchResult();
    this.setState({ patientsList, is_searched: true }, ()=>{
      if(patientsList.length > 0){
        this.setState({selected_index:0}, ()=>{
          document.getElementById("list_area").focus();
        });
        let patient_numbers = [];
        patientsList.map(patient=>{
          patient_numbers.push(patient.systemPatientId);
        });
        this.getPatientsNotDoneInfo(patient_numbers);
      }
    });
  };

  systemConfirmOk() {
    this.openModalStatus = 1;
    this.setState({
      confirm_message: "",
      hasNotConsentedData: true
    });
    this.context.$setUnconsentedConfirmed(true);
  }

  systemConfirmCancel=()=>{
    this.setState({
      confirm_message: "",
      isOpenKarteModeModal: false,
      hasNotConsentedData: false,
      isOpenBasicInfo: false,
      editPatientId : ""
    });
    this.openModalStatus = 0;
  }

  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.setState({isOpenKarteModeModal: false});
  }

  goToPage = (url) => {
    this.props.history.replace(url);
  }

  onKeyPressed(e) {
    let data = [];
    if (this.state.patientsList != null && this.state.patientsList.length > 0) {
      data = this.state.patientsList;
    }
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
        let item = this.state.patientsList[this.state.selected_index];
        this.checkKarteMode(item);
      }
    }
  }

  scrollToelement = () => {
    const els = $(".scroll-area [class*=selected]");
    const pa = $(".scroll-area");
    if (els.length > 0 && pa.length > 0) {
      const elHight = $(els[0]).height();
      const elTop = (elHight+1)*this.state.selected_index;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  checkKarteMode = (patient_info) => {
    if(patient_info === undefined){return;}
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if(item.system_patient_id == patient_info.systemPatientId) {isExist = 1;}
    });
    if (patients_list !== undefined && patients_list != null && patients_list.length > 3 && isExist === 0) {
      window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
      return;
    }
    if (isExist == 0) { // new patient connect
      this.openModalStatus = 1;
      this.setState({
        isOpenKarteModeModal: true,
        modal_data: patient_info
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+patient_info.systemPatientId+"/"+page);
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
  
  openBasicInfo = (patient_info) => {
    this.openModalStatus = 1;
    this.setState({
      isOpenBasicInfo: true,
      patientInfo:patient_info,
      patientId:patient_info.systemPatientId
    })
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
          <div className={'title'}>受付一覧</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10)){
                  return(
                    <>
                      {item == "受付一覧" ? (
                        <Button className="button tab-btn active-btn">{item}</Button>
                      ):(
                        <Button className="button tab-btn" onClick={()=>this.goToPage(list_urls[index])}>{item}</Button>
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
          <SelectorWithLabel
            options={diOptions}
            title="状態"
            getSelect={this.getTreatSelect}
            departmentEditCode={this.context.treatStatus}
          />
          <SelectorWithLabel
            options={options}
            title="担当科"
            getSelect={this.getDepartmentSelect}
            departmentEditCode={this.state.departmentStatus}
          />
          <InputBox>
            <label style={{paddingTop:'0.1rem', lineHeight:'2.4rem'}}>日付選択</label>
            <DatePicker
              locale="ja"
              selected={this.context.dateStatus}
              onChange={this.getDate.bind(this)}
              dateFormat="yyyy/MM/dd"
              placeholderText="年/月/日"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dayClassName = {date => setDateColorClassName(date)}
            />
          </InputBox>
          <Button type="mono" onClick={this.searchPatientsList.bind(this)}>検索</Button>
          <div className={'auto-reload'}>
            <Checkbox
              label="自動更新"
              getRadio={this.setAutoReload.bind(this)}
              value={this.state.auto_reload === 1}
              name="auto_reload"
            />
          </div>
        </Flex>
        <div className={'table-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th style={{width:"4rem"}}> </th>
              <th style={{width:"8rem"}}>診療科</th>
              <th style={{width:"6rem"}}>受付番号</th>
              <th style={{width:"6rem"}}>患者ID</th>
              <th style={{width:"17rem"}}>名前</th>
              <th style={{width:"6rem"}}>診療内容</th>
              <th style={{width:"6rem"}}>登録区分</th>
              <th>同時診療</th>
              <th style={{width:"7.5rem"}}>受付時間</th>
              <th style={{width:"7rem"}}>基礎データ</th>
              <th style={{width:"4rem"}}> </th>
            </tr>
            </thead>
            <tbody className={'scroll-area'}>
            {this.state.is_searched ? (
              <>
                {this.state.patientsList.length === 0 ? (
                  this.state.is_searched && (
                    <tr style={{height:"calc(100vh - 15.5rem)"}}>
                      <td colSpan={'10'} style={{verticalAlign:"middle"}}>
                        <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                      </td>
                    </tr>
                  )
                ) : (
                  this.state.patientsList.map((item, index) => {
                    return (
                      <>
                        <tr className={'row-'+index + ' go-karte ' + (item.is_deleted ? "stop " : "") + (this.state.selected_index == index ? 'selected' : '')}>
                          <td className={'text-center user-icon'} style={{width:"4rem"}} onClick={this.checkKarteMode.bind(this, item)}>
                            <div>
                              {item.sex === 1 ? (
                                <LargeUserIcon size="sm" color="#9eaeda" />
                              ) : (
                                <LargeUserIcon size="sm" color="#f0baed" />
                              )}
                            </div>
                          </td>
                          <td style={{width:"8rem"}} className={item.status==3 ? " finished" : ""} onClick={this.checkKarteMode.bind(this, item)}>
                            <div>{item.department}</div>
                          </td>
                          <td style={{width:"6rem", textAlign:"right"}} className={item.status==3 ? " finished" : ""} onClick={this.checkKarteMode.bind(this, item)}>
                            {item.receivedId}
                          </td>
                          <td style={{width:"6rem", textAlign:"right"}} onClick={this.checkKarteMode.bind(this, item)}>
                            {item.patientNumber}
                          </td>
                          <td style={{width:"17rem"}} onClick={this.checkKarteMode.bind(this, item)}>{item.name}</td>
                          <td style={{width:"6rem"}} onClick={this.checkKarteMode.bind(this, item)}>
                            {item.diagnosis_type_name === undefined || item.diagnosis_type_name == 0 || item.diagnosis_type_name === "" ? "" : ("[" + item.diagnosis_type_name + "]")}
                          </td>
                          <td style={{width:"6rem"}} className={item.status==3 ? " finished" : ""} onClick={this.checkKarteMode.bind(this, item)}>
                            <div>{item.registration_type_name}</div>
                          </td>
                          <td onClick={this.checkKarteMode.bind(this, item)}>
                            {item.other_departments.length > 0 && (
                              item.other_departments.map((item_d, idx) => {
                                return (
                                  <div
                                    key={idx}
                                    className={item_d.status === 3 ? "finished" : item_d.status === 2 ? "bold" : ""}
                                  >
                                    <span className="red">{item_d.department}</span>
                                    {item.status !== 0 && <span>[{item_d.number}]</span>}
                                    {idx < item.other_departments.length - 1 ? "、" : ""}
                                  </div>
                                );
                              })
                            )}
                          </td>
                          <td style={{width:"7.5rem"}} onClick={this.checkKarteMode.bind(this, item)}>
                            <span className="accepted-time">{item.accepted_datetime_str}</span>
                            <span className="comments-box">{item.numbersOfComments}</span>
                          </td>
                          <td style={{width:"7rem", color:item.is_exist_basic_data == 1 ? "blue" : "red"}} onClick={()=>{this.openBasicInfo(item)}}>
                            {item.is_exist_basic_data == 1 ? "入力有":"未入力"}
                          </td>
                          <td
                            style={{width:"4rem", textAlign:"center", color:item.is_exist_basic_data == 1 ? "blue" : "red", backgroundColor:(item.emphasis_icon_info !== undefined && item.emphasis_icon_info != null && item.emphasis_icon_info.length > 0
                              && item.emphasis_icon_info[0]['background-color'] !== undefined) ? item.emphasis_icon_info[0]['background-color'] : ""}}
                            onClick={this.checkKarteMode.bind(this, item)}
                          >
                            {item.emphasis_icon_info !== undefined && item.emphasis_icon_info != null && item.emphasis_icon_info.length > 0 && (
                              item.emphasis_icon_info.map((icon_info)=>{
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
                      </>
                    )
                  })
                )}
              </>
            ):(
              <tr style={{height:"calc(100vh - 15.5rem)"}}>
                <td colSpan={'10'} style={{verticalAlign:"middle"}}>
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
        {this.state.hasNotConsentedData && (
          <NotConsentedModal
            patiendId={0}
            fromPatient={true}
            closeNotConsentedModal={this.systemConfirmCancel}
          />
        )}
        {this.state.confirm_message !== "" && (
        <SystemConfirmModal
            hideConfirm= {this.systemConfirmCancel.bind(this)}
            confirmCancel= {this.systemConfirmCancel.bind(this)}
            confirmOk= {this.systemConfirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.systemConfirmCancel}
            modal_type={'patients_list'}
          />
        )}
        {this.state.isOpenBasicInfo && (
          <BasicInfoModal
            closeModal={this.systemConfirmCancel}
            patientInfo={this.state.patientInfo}
            patientId={this.state.patientId}
          />
        )}
      </PatientsWrapper>
    );
  }
}
Patients.contextType = Context;
Patients.propTypes = {
  history: PropTypes.object
};

export default Patients;
