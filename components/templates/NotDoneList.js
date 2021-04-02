import React, { Component } from "react";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import * as colors from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import DatePicker, { registerLocale } from "react-datepicker";
import {
  formatDateLine,
  formatDateSlash,
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat
} from "~/helpers/date";
import InspectionDoneModal from "~/components/templates/OrderList/InspectionDoneModal";
import TreatDoneModal from "~/components/templates/OrderList/TreatDoneModal";
import NotDoneListModal from "~/components/organisms/NotDoneListModal";
import PrescriptionDoneModal from "~/components/organisms/PrescriptionDoneModal";
import OrderDoneModal from "~/components/templates/OrderList/OrderDoneModal";
import RehabilyOrderDoneModal from "~/components/templates/OrderList/RehabilyOrderDoneModal";
import OrderDoneRaidationModal from "~/components/templates/OrderList/OrderDoneRaidationModal";
import auth from "~/api/auth";
import PropTypes from "prop-types";
import {getAutoReloadInfo, getServerTime, EXAM_STATUS_OPTIONS} from "~/helpers/constants";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import DoneModal from "~/components/organisms/DoneModal";
import ExaminationDoneModal from "~/components/templates/OrderList/ExaminationDoneModal";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import FromApiPagination from "~/components/templates/Maintenance/FromApiPagination";
import * as localApi from "~/helpers/cacheLocal-utils";
import {setDateColorClassName} from "~/helpers/dialConstants";

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {
    display: flex;
  }
  .MyCheck{
    margin-bottom: 5px;
    label{
      font-size: 1rem;
      margin-right: 1.25rem;
      line-height: 2rem;
    }
  }
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
    button {
      background-color: ${colors.surface};
      min-width: auto;
      margin-left: 9px;
      padding: 8px 12px;
    }
    .tab-btn{
      background: rgb(208, 208, 208);
      span{
        font-weight: normal;
        color: black;
      }
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
      padding-top:0.5rem;
    }
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .login-info-area {
    width: 100%;
    padding-left: 0.5rem;
    table {
      background-color: white;
      margin:0px;
      font-size: 1rem;
      tbody{
        display:block;
        overflow-y: scroll;
          height: calc(100vh - 22rem);
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
    .td-id{
        width:10rem;
    }
    .td-date{
        width:15rem;
        text-align:center;
    }
    .td-kind{
        width:15rem;
    }
    .karte-ward{
      width: 8rem;
    }
    .order-area {
      cursor: pointer;
    }
    .order-area:hover{
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
    .check-area {
      label {
        margin:0;
      }
    }
  }
  .reload-check{
    position:absolute;
    right:0;
    top:-2.5rem;
    label{
      font-size:1rem;
    }
    .print-btn {
      margin-right:0.5rem;
    }
  }
  .pagination {
    float:right;
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
`;

const Flex = styled.div`
    background: ${colors.background};
    align-items: center;
    padding: 10px 0px 10px 10px;
    width: 100%;
    input[type="text"]{
        height:2.4rem;
        line-height:2.4rem;
        font-size:1rem;
    }
    input[type="radio"]{
        font-size:1rem;
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
    .pullbox-label{
        width:auto;
        padding-right:1rem;
        margin-right:1rem;
    }
    .pullbox-select{
        width:calc(100% + 1rem);
        font-size:1rem;
        padding-top:0.1rem;
        height:2.4rem;
        line-height:2.4rem;
        min-width:10rem;
    }
    .include-no-date {
        padding-left: 10px;
        label {
            font-size: 1rem;
            line-height: 2rem;
        }
    }
    .react-datepicker-wrapper {
        input {
            width: 9rem;
            font-size:1rem;
            padding-top:1px;
            height:2rem;
            line-height:2rem;
        }
    }
    button {
        background-color: rgb(255, 255, 255);
        min-width: auto;
        margin-left: 1rem;
        height:2.4rem;
        padding:0;
        padding-left:1rem;
        padding-right:1rem;
        padding-top:2px;
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
      .doctor-name {
        margin-left: 3px;
        min-width: 12rem;
        height: 2.4rem;
        line-height: 2.4rem;
        background: white;
        border-radius: 4px;
        padding: 0 0.2rem;
        cursor: pointer;
      }
      .doctor-title{
        width: 4rem;
      }
      .karte-status{
        .pullbox-label, .pullbox-select{
          width: 7rem;
          min-width: 7rem;
        }
      }
      .from-to {
    padding-left: 5px;
    padding-right: 5px;
    line-height: 1.8rem;
  }
  .prev-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 1.8rem;
    padding-left: 5px;
    padding-right: 5px;
  }
  .next-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 1.8rem;
    padding-left: 5px;
    padding-right: 5px;
  }
  .select-today {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 1.8rem;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .include-no-date {
      padding-left: 10px;
      margin-top: 2.35rem;
  }
  .clear-btn-2{
    min-width: 2rem;
    height: 2.4rem;
    padding: 0px;
    display: inline-block;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgb(126, 126, 126);
    margin-left: 0.1rem;
  }
  .display-number {
    .pullbox {margin-top: 2.35rem;}
    .pullbox-label {
      margin-bottom:0;
      width:5rem;
      line-height: 2rem;
    }
    .pullbox-select {
      width:5rem;
      min-width: 5rem;
      font-size:1rem;
      height: 2rem;
      line-height: 2rem;
      padding-top: 0;
    }
    .label-title {
      width:5rem;
      font-size:1rem;
      line-height: 2rem;
      margin: 0 0.5rem 0px;
    }
  }
`;

const SpinnerWrapper = styled.div`
    padding-top: 70px;
    padding-bottom: 70px;
    height: 100px;
    text-align: center;
`;

const ContextMenuUl = styled.ul`
margin-bottom:0px!important;
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
  font-size: 16px;
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
}
.context-menu li > i {
  margin-right: 8px;
}
.blue-text {
  color: blue;
}
`;

const ContextMenu = ({ visible, x,  y,  parent,  selected_item, selected_order_title}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(selected_item, selected_order_title, "complete")}>詳細</div></li>
          <li><div onClick={() => parent.contextMenuAction(selected_item, selected_order_title, "karte_view")}>カルテを開く</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const STATUS_OPTIONS_NORMAL = [
  {id: 0, value: "全て"},
  {id: 1, value: "未実施"},
  {id: 2, value: "実施"}
];

const STATUS_OPTIONS_OTHER = [
  {id: 0,value: "全て"},
  {id: 1,value: EXAM_STATUS_OPTIONS.NOT_RECEPTION},
  {id: 3,value: EXAM_STATUS_OPTIONS.COLLECTION_WAIT},
  {id: 4,value: EXAM_STATUS_OPTIONS.COLLECTION_DONE},
  {id: 2,value: EXAM_STATUS_OPTIONS.RECEPTION_DONE}
];

class NotDoneList extends Component {
  constructor(props) {
    super(props);
    let auto_reload_data = getAutoReloadInfo('not_done');
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    let karte_status = [{ id: 0, value: "全て"},{ id: 1, value: "外来"}];
    if (cache_ward_master !== undefined && cache_ward_master.length > 0) {
      cache_ward_master.map((item, index)=>{
        let push_item = {id: index + 2, value: "入院" + item.name, ward_id: item.number};
        karte_status.push(push_item);
      });
    }
    this.state = {
      list_data:[],
      classific:[
        {id:0, value:"全て"},
        {id:1, value:'処方'},
        {id:2, value:'注射'},
        {id:3, value:'処置'},
        {id:4, value:'検査'},
        {id:5, value:'汎用オーダー'},
        {id:7, value:'放射線'},
        {id:8, value:'リハビリ'},
        {id:9, value:'全検査'},
      ],
      classific_id:0,
      alert_msg: "",
      order_category:[
        {id:0, value:""},
      ],
      order_category_id:0,
      search_date:new Date(),
      select_date_type:0,
      no_date:0,
      isOpenInspectionDoneModal:false,
      isOpenExamDoneModal:false,
      isOpenTreatmentDoneModal:false,
      isOpenOrderDoneModal:false,
      isOpenGuidanceDoneModal:false,
      isOpenInjectionDoneModal:false,
      isOpenRehabilyDoneModal:false,
      isOpenKarteModeModal:false,
      isOpenRadiationDoneModal:false,
      auto_reload:auto_reload_data.status,
      selectDoctorModal: false,
      start_date: '',
      status_data:STATUS_OPTIONS_NORMAL,
      select_status: 1,
      complete_message: '',
      karte_status,
      karte_status_code:0,
      current_page: 1,
      display_number: 20,
      pageOfItems:[],
      isLoaded:false,
    };
    this.auto_reload_timer = undefined;
    this.timer_interval = auto_reload_data.reload_time;
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names = {};
    departmentOptions.map(department=>{
      this.department_names[parseInt(department.id)] = department.value;
    });
    this.per_page = [{id:1, value:20},{id:2, value:50},{id:3, value:100},{id:4, value:200},{id:5, value:500}]
  }
  
  componentWillUnmount() {
    clearInterval(this.auto_reload_timer);
  }
  
  async componentDidMount() {
    await this.getSearchResult('init');
    this.auto_reload_timer = setInterval(() => {
      if (this.state.auto_reload){
        if (
          this.state.isOpenTreatmentDoneModal != true &&    //処置
          this.state.isOpenInspectionDoneModal != true &&   //生理検査, 内視鏡検査
          this.state.isOpenOrderDoneModal != true &&        //リハビリ, 検査
          this.state.isOpenGuidanceDoneModal != true &&     //汎用オーダー
          this.state.isOpenPrescriptionModal != true &&     //処方
          this.state.isOpenInjectionDoneModal != true &&    //注射
          this.state.isOpenKarteModeModal != true &&        //patient mode
          this.state.isOpenRadiationDoneModal != true &&     //放射線
          this.state.isOpenExamDoneModal != true &&             //検体検査
          this.state.isOpenRehabilyDoneModal != true &&
          this.state.complete_message == ""
        ){
          this.getSearchResult('init');
        }
      }
    }, this.timer_interval * 1000);
    localApi.setValue("system_next_page", "/not_done/list");
    localApi.setValue("system_before_page", "/not_done/list");
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  getCheckBox = (name, value) => {
    this.setState({[name]: value});
  }
  
  getSearchResult =async(get_type=null)=>{
    if(this.state.isLoaded){
      this.setState({isLoaded: false});
    }
    let path = "/app/api/v2/order/get/not_done_list";
    let post_data = {
      classific_id:this.state.classific_id,
      order_category_id:this.state.order_category_id,
      search_date:this.state.search_date !== '' ? formatDateLine(this.state.search_date) : '',
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '' ,
      no_date:this.state.no_date,
      select_date_type:this.state.select_date_type,
      hospitalized_flag: this.state.karte_status_code,
      current_page: this.state.current_page,
      display_number: this.state.display_number,
      get_type:get_type != 'data' ? 'page_data' : '',
    };
    // 全て:未実施
    if (this.state.classific_id == 0) {
      post_data.select_status = 1;
    } else {
      post_data.select_status = this.state.select_status;
    }
    if (this.state.karte_status_code >= 2) {
      post_data.hospitalized_flag = 2;
      post_data.first_ward_id = this.state.first_ward_id;
      post_data.main_doctor_id = this.state.main_doctor_id;
    }
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (get_type == "data") {
          this.setState({
            pageOfItems: res.data,
            isLoaded: true
          });
        } else {
          var current_page = 1;
          if (get_type != 'init'){
            current_page = this.state.current_page;
            if (Math.ceil(res.page.length / this.state.display_number) < this.state.current_page){
              current_page = Math.ceil(res.page.length / this.state.display_number);
            }
          }

          this.setState({
            current_page,
            list_data: res.page,
            pageOfItems: res.data,
            isLoaded: true
          });
        }
      })
      .catch(() => {
      });
  }
  
  setClassific = e =>{
    this.setState({
      classific_id: parseInt(e.target.id),
      order_category_id:0,
      order_category:[{id:0, value:""},],
      select_status:1,
    }, ()=>{
      this.getOrderCategory();
    });
  }
  
  getOrderCategory = async() => {
    if(this.state.classific_id == 9){
      let order_category = [
        {id:0, value:"全て"},
        {id:1, value:"検体検査"},
        {id:2, value:"生理検査"},
        {id:3, value:"内視鏡"},
        {id:4, value:"放射線"}
      ];
      this.setState({order_category});
    }
    if(this.state.classific_id == 4 || this.state.classific_id == 7 ){
      let order_category = [{id:0, value:"全て"},];
      let path = "/app/api/v2/master/addition/searchFunctionsByCategory";
      let post_data = {
        params:{is_enabled:1, function_category_id:this.state.classific_id}
      };
      await apiClient.post(path, post_data).then((res)=>{
        if(res.length > 0){
          res.map(item => {
            order_category.push({id:item.id, value:item.name == "検査オーダー" ? "検体検査" : item.name});
          })
        }
      });
      this.setState({order_category});
    }
  }
  
  setOrderCategory =e=>{
    let status_data = this.state.status_data;
    if((this.state.classific_id == 4 && parseInt(e.target.id) == 18) || (this.state.classific_id == 9 && parseInt(e.target.id) == 1)){
      status_data = STATUS_OPTIONS_OTHER;
    } else {
      status_data = STATUS_OPTIONS_NORMAL;
    }
    this.setState({
      status_data,
      order_category_id: parseInt(e.target.id),
    });
  }
  
  getIncludeNoDate = (name, value) => {
    if(name === 'include'){
      this.setState({no_date:value});
    }
  };
  
  openDetailModal =(item)=>{
    if(item.category === '処方'){
      this.setState({
        modal_title: "処方",
        modal_type: "prescription",
        modal_data: item,
        isOpenPrescriptionModal: true
      });
    }
    if(item.category === '注射'){
      this.setState({
        modal_title: "注射",
        modal_type: "injection",
        modal_data: item,
        isOpenInjectionDoneModal: true
      });
    }
    if(item.category === '処置'){
      this.setState({
        isOpenTreatmentDoneModal: true,
        modal_data:item,
      });
    }
    if(item.category === '生理検査' || item.category === '内視鏡検査'){
      this.setState({
        isOpenInspectionDoneModal: true,
        modal_title:item.category,
        modal_type:item.category === '生理検査' ? 'inspection' : 'endoscope',
        modal_data:item,
      });
    }
    if(item.category === '放射線'){
      this.setState({
        isOpenRadiationDoneModal: true,
        modal_title:item.category,
        modal_type:'radiation',
        modal_data:item,
      });
    }
    if(item.category === 'リハビリ'){
      this.setState({
        isOpenRehabilyDoneModal: true,
        modal_title:item.category,
        modal_type:'rehabily',
        modal_data:item,
      });
    }
    if(item.category === '汎用オーダー' || item.category === '管理・指導'){
      let patientInfo = {
        receId:item['patient_number'],
        name:item['patient_name'],
      };
      let modal_data = item;
      modal_data.data = [];
      modal_data.data.done_order = modal_data.done_order;
      modal_data.data.order_data = modal_data.order_data;
      modal_data.data.is_enabled = modal_data.is_enabled;
      modal_data.data.history = modal_data.history;
      modal_data.data.medical_department_name = this.department_names[modal_data.order_data.order_data.department_id];
      this.setState({
        isOpenGuidanceDoneModal: true,
        modal_data,
        patientInfo,
      });
    }
    if(item.category === '検査' && (item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' || item.sub_category === '病理検査' || item.sub_category === '細菌検査')){
      this.setState({
        isOpenExamDoneModal: true,
        modal_title:'検体検査',
        modal_type:'examination',
        modal_data:item,
      });
    }
  }
  
  handleOk = () => {
    this.closeModal();
    this.getSearchResult();
  }
  
  closeModal =()=>{
    this.setState({
      isOpenInspectionDoneModal: false,
      isOpenRehabilyDoneModal: false,
      isOpenTreatmentDoneModal:false,
      isOpenOrderDoneModal: false,
      isOpenGuidanceDoneModal: false,
      isOpenInjectionDoneModal: false,
      isOpenDoneModal: false,
      isOpenPrescriptionModal: false,
      isOpenKarteModeModal:false,
      isOpenRadiationDoneModal:false,
      alert_msg: "",
      isOpenExamDoneModal:false,
    });
    // this.getSearchResult();
  }
  
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
  
  goKartePage = async(data) => {
    let patients_list = this.context.patientsList;
    var system_patient_id = data.system_patient_id;
    var department_code = data.medical_department_code;
    let isExist = 0;
    if(patients_list !== undefined && patients_list != null && patients_list.length > 0){
      patients_list.map(item=>{
        if (item.system_patient_id == system_patient_id) {
          isExist = 1;
        }
      });
    }
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      this.setState({alert_messages: '4人以上の患者様を編集することはできません。'});
      return;
    }
    if (isExist == 0) { // new patient connect
      let department_name = "";
      this.departmentOptions.map(department=>{
        if(parseInt(department.id) == department_code){
          department_name = department.value;
          return;
        }
      });
      let modal_data = {
        systemPatientId:system_patient_id,
        date:data.treatment_date,
        medical_department_code:department_code,
        department_name,
      };
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+system_patient_id+"/"+page);
    }
  }
  
  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.setState({isOpenKarteModeModal: false});
  };
  
  handleClick = (e, item, order_title) => {
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
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      let clientY = e.clientY;
      let clientX = e.clientX;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        selected_item:item,
        selected_order_title:order_title
      }, ()=>{
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight;
        let window_width = window.innerWidth;
        if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-menu_width,
              y: clientY - menu_height,
            },
            selected_item:item,
            selected_order_title:order_title
          })
        } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX,
              y: clientY - menu_height,
            },
            selected_item:item,
            selected_order_title:order_title
          })
        } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-menu_width,
              y: clientY + window.pageYOffset,
            },
            selected_item:item,
            selected_order_title:order_title
          })
        }
      });
    }
  };
  
  contextMenuAction = (selected_item, selected_order_title,  type) => {
    if (type === "complete"){
      this.openDetailModal(selected_item, selected_order_title);
    }
    if (type === "karte_view"){
      this.goKartePage(selected_item);
    }
  };
  getConvertStartDate = (_date=null) => {
    let result = "";
    if(_date == undefined || _date == null || _date == "") return result;
    result = _date.substr(0, 4) + "/" + _date.substr(4, 2) + "/" + _date.substr(6, 2) + " ";
    return result
  }
  
  getModalData = (_modal_data) => {
    
    let ret = {};
    ret.target_number = _modal_data.record_number;
    ret.patient_id = _modal_data.system_patient_id;
    ret.updated_at = _modal_data.updated_at;
    ret.treatment_datetime = _modal_data.treat_date;
    ret.is_doctor_consented = _modal_data.is_doctor_consented;
    ret.input_staff_name = _modal_data.input_staff_name;
    ret.doctor_name = _modal_data.doctor_name;
    ret.data = _modal_data;
    return ret;
  }
  
  closeDoneModal = (_msg='') => {
    this.setState()
    let _state = {};
    _state.isOpenPrescriptionModal = false;
    _state.alert_msg = _msg == "prescription_done" ? "実施しました。" : "";
    _state.isOpenKarteModeModal = false;
    // YJ234 処方受付で、実施完了時に「実施しました」アラートがない
    // ・処方の実施も完了アラートを出すように。
    this.setState(_state,()=>{
      if (_msg == "prescription_done") {
        this.getSearchResult();
      }
    });
  }
  
  closeInjection = () => {
    this.setState({
      isOpenInjectionDoneModal: false,
      alert_msg: "実施しました。"
    },()=>{
      this.getSearchResult();
    });
  }
  getKarteStatus = e => {
    let karte_status_code = parseInt(e.target.id);
    this.setState({karte_status_code});
    if (karte_status_code >=2) {
      let find_karte = this.state.karte_status.find(x=>x.id == karte_status_code);
      this.setState({first_ward_id: find_karte != undefined ? find_karte.ward_id : null});
    } else {
      this.setState({
        first_ward_id: null,
        main_doctor_id: undefined,
        main_doctor_name: '',
      });
    }
  };
  
  selectMainDoctorModal = () => {
    this.setState({selectDoctorModal: true});
  };
  closeDoctor = () => {
    this.setState({
      selectDoctorModal: false,
    });
  };
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };
  
  selectDoctorFromModal = (id, name) => {
    let data = sessApi.getDoctorList();
    let main_doctor_id = data.find(x=>x.doctor_code == id).number;
    this.setState({
      selectDoctorModal: false,
      main_doctor_id,
      main_doctor_name: name,
    });
  };
  setDate = (e) =>{
    let search_date = this.state.search_date;
    let start_date = this.state.start_date;
    if(parseInt(e.target.value) === 0){
      search_date = new Date();
      start_date = '';
    }
    if(parseInt(e.target.value) === 1){
      search_date = "";
      start_date = '';
    }
    if(parseInt(e.target.value) === 2){
      if(search_date === ''){
        search_date = new Date();
      }
      start_date = new Date(search_date.getFullYear(), search_date.getMonth(), (search_date.getDate() - 7));
    }
    
    this.setState({
      select_date_type:parseInt(e.target.value),
      search_date,
      start_date,
    })
  };
  getDate = value => {
    this.setState({
      search_date: value,
    });
  };
  
  getStartDate = value => {
    this.setState({
      start_date: value,
    });
  };
  moveDay = (type) => {
    let now_day = this.state.search_date;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      search_date: cur_day,
      select_date_type:0,
      start_date:"",
    });
  };
  
  selectToday=()=>{
    this.setState({
      search_date: new Date(),
      select_date_type:0,
      start_date:"",
    });
  };
  
  confrimClear = () => {
    this.setState({
      main_doctor_id: undefined,
      main_doctor_name: ''
    });
  }
  
  getSelectStatus = (e) => {
    this.setState({ select_status: parseInt(e.target.id) });
  }
  
  get_title_pdf = async () => {
    let pdf_file_name = "未実施リスト_";
    if(this.state.select_date_type == 1){
      let server_time = await getServerTime(); // y/m/d H:i:s
      pdf_file_name = pdf_file_name + formatDateLine(server_time).split("-").join("") + server_time.split(" ")[1];
    } else if(this.state.select_date_type == 2){
      pdf_file_name = pdf_file_name + formatDateLine(this.state.start_date).split("-").join("") + "-" + formatDateLine(this.state.search_date).split("-").join("");
    } else {
      pdf_file_name = pdf_file_name + formatDateLine(this.state.search_date).split("-").join("");
    }
    return pdf_file_name+".pdf";
  }
  
  printData =async() => {
    if (this.state.pageOfItems.length === 0 || this.state.isLoaded == false){
      return;
    }
    this.setState({
      complete_message:"印刷中"
    });
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/order/print/not_done_list";
    let print_data = this.state;
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
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  };
  
  onChangePage(pageOfItems, _curPage) {
    this.setState({
      pageOfItems: pageOfItems,
      current_page: _curPage,
      isLoaded: false
    }, ()=>{
      this.getSearchResult('data');
    });
  }
  
  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };
  
  getSearchData=()=>{
    this.setState({
      isLoaded: false
    }, ()=>{
      this.getSearchResult('init');
    });
  }
  
  render() {
    // オーダー種類
    let disable_status = true;
    if(this.state.classific_id == 4 || this.state.classific_id == 7 || this.state.classific_id == 9){
      disable_status = false;
    }
    
    // 状態
    let disable_type_status = true;
    if(this.state.classific_id != 0){
      disable_type_status = false;
    }
    return (
      <PatientsWrapper>
        <div className="title-area flex">
          <div className={'title'}>未実施リスト</div>
          {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
            <>
              <div className={'move-btn-area'}>
                <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
              </div>
            </>
          )}
        </div>
        <Flex>
          <div className={`d-flex`}>
            <div className = "select-group">
              <SelectorWithLabel
                options={this.state.classific}
                title="機能分類"
                getSelect={this.setClassific}
                departmentEditCode={this.state.classific_id}
              />
            </div>
            <div className = "select-group select-order-category">
              <SelectorWithLabel
                options={this.state.order_category}
                title="オーダー種類"
                getSelect={this.setOrderCategory}
                departmentEditCode={this.state.order_category_id}
                isDisabled={disable_status}
              />
            </div>
            <div className={`karte-status`}>
              <SelectorWithLabel
                title="状態"
                options={this.state.status_data}
                getSelect={this.getSelectStatus}
                departmentEditCode={this.state.select_status}
                isDisabled={disable_type_status}
              />
            </div>
            <div className={`karte-status`}>
              <SelectorWithLabel
                title="入外区分"
                options={this.state.karte_status}
                getSelect={this.getKarteStatus}
                departmentEditCode={this.state.karte_status_code}
              />
            </div>
            {this.state.karte_status_code >= 2 && (
              <div className={`main_doctor d-flex`}>
                <label className={`doctor-title label-title`}>主治医</label>
                <div className={`doctor-name border`} onClick={this.selectMainDoctorModal.bind(this)}>{this.state.main_doctor_name != undefined ? this.state.main_doctor_name : " "}</div>
                <button className="clear-btn-2" onClick={this.confrimClear.bind(this)}>C</button>
              </div>
            )}
            <Button type="mono" onClick={this.getSearchData}>検索</Button>
          </div>
          <div className={'d-flex'} style={{marginTop:"5px"}}>
            <div className="date-area">
              <div className="MyCheck d-flex">
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
              <div className="MyCheck d-flex">
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
                    selected={this.state.search_date}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="年/月/日"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    disabled={this.state.search_date === '' ?  true : false}
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>
              </div>
              <div className="MyCheck">
                <Radiobox
                  label="日未定のみ"
                  value={1}
                  getUsage={this.setDate.bind(this)}
                  checked={this.state.select_date_type === 1 ? true : false}
                  name={`date-set`}
                />
              </div>
            </div>
            <div className={'include-no-date'}>
              <Checkbox
                label={'日未定を含む'}
                getRadio={this.getIncludeNoDate.bind(this)}
                value={this.state.no_date}
                name={`include`}
              />
            </div>
            <div className="display-number">
              <SelectorWithLabel
                options={this.per_page}
                title="表示件数"
                getSelect={this.getDisplayNumber}
                departmentEditCode={this.state.display_number}
              />
            </div>
          </div>
        </Flex>
        <div style={{position:'relative'}}>
          <div className = 'reload-check'>
            <Button
              type="common"
              className={'print-btn ' + ((this.state.pageOfItems.length === 0 || !this.state.isLoaded) ? 'disable-btn' : '')}
              isDisabled={this.state.pageOfItems.length === 0 || !this.state.isLoaded} onClick={this.printData}
            >
              一覧印刷</Button>
            <Checkbox
              label={'自動更新'}
              getRadio={this.getCheckBox.bind(this)}
              value={this.state.auto_reload}
              name={`auto_reload`}
            />
          </div>
        </div>
        <div className={'login-info-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead>
            <tr>
              <th className="karte-ward">入外</th>
              <th className='td-id'>患者ID</th>
              <th>患者氏名</th>
              <th className='td-kind'>種類</th>
              <th className='td-date'>登録日付</th>
              <th className='td-date'>予定日付</th>
            </tr>
            </thead>
            <tbody>
            {this.state.isLoaded == false ? (
              <tr>
                <td colSpan={'5'}>
                  <div className='spinner_area'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </td>
              </tr>
            ):(
              <>
                {this.state.pageOfItems.length === 0 ? (
                  <tr><td colSpan={'5'}><div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div></td></tr>
                ) : (
                  this.state.pageOfItems.map((item) => {
                    let karte_status_name = "外来・";
                    if (item.karte_status !== undefined && item.karte_status != null) {
                      karte_status_name = item.karte_status == 1 ? "外来・" : item.karte_status == 2 ? "訪問診療・" : item.karte_status == 3 ? "入院・" : "";
                    }
                    let order_title = item.category;
                    if(item.category === '処方' || item.category === '処置' || item.category === '注射'){
                      order_title = item.category;
                    }
                    if(item.category === '検査' && (item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' ||
                      item.sub_category === '病理検査' || item.sub_category === '細菌検査')){
                      order_title = '検体検査';
                      if (item.sub_category === "細胞診検査") order_title = "細胞診検査";
                      else if (item.sub_category === "病理検査") order_title = "病理組織検査";
                      else if (item.sub_category === "細菌検査") order_title = "細菌・抗酸菌検査";
                    }
                    if(item.category === '放射線' || item.category === '生理検査'){
                      order_title = item.sub_category;
                    }
                    let start_date = (item.treat_date == null || item.treat_date === '') ? '日未定' : formatDateSlash(new Date(item.treat_date.split("-").join("/")));
                    if (item.category === '処方') {
                      if (item.order_data.order_data[0].start_date !== undefined && item.order_data.order_data[0].start_date !== "") {
                        start_date = this.getConvertStartDate(item.order_data.order_data[0].start_date);
                      }
                    }
                    if (item.category === '注射') {
                      if (item.order_data.schedule_date !== undefined && item.order_data.schedule_date !== "") {
                        start_date = formatDateSlash(new Date(item.order_data.schedule_date.split("-").join("/")));
                      }
                    }
                    if (item.category === '検査' && (item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' ||
                      item.sub_category === '病理検査' || item.sub_category === '細菌検査')) {
                      if (item.order_data.order_data.collected_date !== undefined && item.order_data.order_data.collected_date !== "") {
                        start_date = formatDateSlash(new Date(item.order_data.order_data.collected_date.split("-").join("/")));
                      }
                    }
                    return (
                      <>
                        <tr className={'order-area'}
                            onContextMenu={e => this.handleClick(e, item, order_title)}
                            onDoubleClick = {this.goKartePage.bind(this, item)}>
                          <td className="karte-ward">{item.karte_ward !== undefined ? item.karte_ward : ""}</td>
                          <td className={'td-id text-right'}>{item.patient_number}</td>
                          <td>{item.patient_name}</td>
                          <td className='td-kind'>{karte_status_name+order_title}</td>
                          <td className='td-date text-left'>{formatDateSlash(new Date(item.created_at.split("-").join("/")))}</td>
                          <td className='td-date text-left'>{start_date}</td></tr>
                      </>
                    )
                  })
                )}
              </>
            )}
            </tbody>
          </table>
          <FromApiPagination
            items={this.state.list_data}
            onChangePage={this.onChangePage.bind(this)}
            pageSize = {this.state.display_number}
            showAlways={true}
            initialPage = {this.state.current_page}
          />
        </div>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          selected_item={this.state.selected_item}
          selected_order_title={this.state.selected_order_title}
        />
        {this.state.isOpenInspectionDoneModal && (
          <InspectionDoneModal
            handleNotDoneOk = {this.handleOk}
            closeModal={this.closeModal}
            modal_title={this.state.modal_title}
            modal_data={this.state.modal_data}
            modal_type={this.state.modal_type}
            reception_or_done={"done"}
          />
        )}
        {this.state.isOpenRehabilyDoneModal && (
          <RehabilyOrderDoneModal
            handleNotDoneOk = {this.handleOk}
            closeModal={this.closeModal}
            modal_title={this.state.modal_title}
            modal_data={this.state.modal_data}
            modal_type={this.state.modal_type}
            reception_or_done={"done"}
          />
        )}
        {this.state.isOpenTreatmentDoneModal && (
          <TreatDoneModal
            handleNotDoneOk = {this.handleOk}
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
          />
        )}
        {this.state.isOpenOrderDoneModal && (
          <OrderDoneModal
            handleNotDoneOk = {this.handleOk}
            closeModal={this.closeModal}
            modal_title={this.state.modal_title}
            modal_data={this.state.modal_data}
            modal_type={this.state.modal_type}
            reception_or_done={"done"}
          />
        )}
        {this.state.isOpenGuidanceDoneModal && (
          <DoneModal
            modal_title={"汎用オーダー"}
            modal_type={"guidance"}
            modal_data={this.state.modal_data}
            closeModal={this.closeModal}
            patientId={this.state.modal_data.patient_id}
            patientInfo={this.state.patientInfo}
            fromPage={'no-soap'}
          />
        )}
        {this.state.isOpenInjectionDoneModal && (
          <DoneModal
            modal_title={"注射"}
            modal_type={"injection"}
            closeModal={this.closeModal}
            patientId={this.state.modal_data.patient_id}
            fromPage={"notDoneList"}
            closeInjection={this.closeInjection}
            modal_data={this.getModalData(this.state.modal_data)}
            patientInfo = {{receId:this.state.modal_data.patient_number, name:this.state.modal_data.patient_name}}
          />
        )}
        {this.state.isOpenRadiationDoneModal && (
          <OrderDoneRaidationModal
            handleNotDoneOk = {this.handleOk}
            closeModal={this.closeModal}
            modal_title={this.state.modal_title}
            modal_data={this.state.modal_data}
            modal_type={this.state.modal_type}
            reception_or_done={"done"}
            from_source = {'done_list'}
          />
        )}
        {this.state.isOpenDoneModal && (
          <NotDoneListModal
            handleNotDoneOk = {this.handleOk}
            patientId={this.state.system_patient_id}
            closeModal={this.closeModal}
            closeModalAndRefresh={this.closeModal}
            modal_type={this.state.modal_type}
            modal_title={this.state.modal_title}
            modal_data={this.state.modal_data}
          />
        )}
        {this.state.isOpenPrescriptionModal && (
          <PrescriptionDoneModal
            patientId={this.state.modal_data.system_patient_id}
            closeModal={this.closeDoneModal}
            modal_type={"prescription"}
            modal_title={this.state.modal_title}
            modal_data={this.getModalData(this.state.modal_data)}
            patientInfo = {{receId:this.state.modal_data.patient_number, name:this.state.modal_data.patient_name}}
          />
        )}
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'order'}
          />
        )}
        {this.state.alert_msg !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_msg}
          />
        )}
        {this.state.isOpenExamDoneModal && (
          <ExaminationDoneModal
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
            from_page={'not_done_list'}
            done_status={'done'}
            patientId={this.state.system_patient_id}
            doneInspection={this.handleOk}
          />
        )}
        {this.state.selectDoctorModal && (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
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

NotDoneList.contextType = Context;
NotDoneList.propTypes = {
  history: PropTypes.object,
}
export default NotDoneList;
