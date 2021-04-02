import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Button from "~/components/atoms/Button";
import {
  formatDateLine,
  formatJapanDate,
  formatJapanDateSlash, formatTimeIE,
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat
} from "~/helpers/date";
import {getInspectionNameList,STATUS_OPTIONS,PER_PAGE,getAutoReloadInfo,getStatusRowColor,getInspectionName} from "~/helpers/constants";
import Radiobox from "~/components/molecules/Radiobox";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
registerLocale("ja", ja);
import auth from "~/api/auth";
import Pagination from "~/components/molecules/Pagination";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import {setDateColorClassName} from '~/helpers/dialConstants'
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import Spinner from "react-bootstrap/Spinner";
import InspectionDoneModal from "~/components/templates/OrderList/InspectionDoneModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const imageButtonStyle = {
  textAlign: "center",
  color: "blue",
  cursor: "pointer",
};

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;
  font-size:1rem;
  input{height:2.4rem;}
  input[type="radio"]{
    height:1.2rem;
  }
  input[type="checkbox"]{    
    height:1.2rem;
    width:1.2rem!important;
  }
  svg{
    font-size:1rem;
  }
  .MyCheck{
    margin-bottom: 0.3rem;
    label{
      font-size: 1rem;
      margin-right: 10px;
      line-height: 1.8rem;
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
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
    border-bottom: solid 7px #69c8e1;
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
      cursor: default !important;
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
    font-size: 30px;
    padding: 2px 0 2px 7px;
    border-left: solid 5px #69c8e1;
  }  
  .display_number{
    .pullbox-label, select{
      width:5rem;
    }
    .label-title {
      width: 6rem;
    }
  }
  .done-state, .karte-status{
    .pullbox-label, select{
      width: 7rem;
    }
    .label-title {
      width: 5rem;
    }
  }
  .pagination {
    float:right;
  }
  .reload-check{
    margin-top: 4rem;
    margin-left: auto;
    margin-right: 0;
    button {height: 2rem;}
    label {
      line-height: 2rem;
      font-size: 1rem;
    }
  }
  .table-area {
    padding-left: 0.5rem;
    width: 100%;
    margin-bottom:0.5rem;
    table {
      margin:0px;
      background-color: white;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(100vh - 23rem);
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
  .no-result {
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .sort-symbol{
    margin-left:0.5rem;
    font-size:1rem;
    cursor:pointer;
  }
  .row-item {
    position: relative;
    /* 診療中止の場合 */
    &.stop {
      color: ${colors.disable};
      span {
        color: rgba(150, 150, 150, 1);
      }
      &:before {
        content: "";
        width: 100%;
        height: 1px;
        border-top: solid 1px ${colors.disable};
        position: absolute;
        left: 0;
        top: calc(50% - 3px);
        opacity: 0.5;
      }
      &:after {
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
`;

const Flex = styled.div`
    background: ${colors.background};
    align-items: center;
    padding: 10px 0px 10px 10px;
    width: 100%;
    z-index: 100;
    .label-title {
        text-align: right;
        width: 12.5rem;
        margin-right:0.5rem;        
        font-size: 1rem;
        line-height:2.4rem;
        height:2.4rem;
    }
    .pullbox-label, select {
        width: 100%;
        font-size:1rem;
        height:2.4rem;
        line-height:2.4rem;
    }
    label {
        margin: 0;
    }
    button {
        min-width: auto;
        margin-left: 24px;
        background-color: white;
        height:2.4rem;
        padding:0;
        padding-left:1rem;
        padding-right:1rem;
        span{
          font-size:1rem;
        }
    }
    .react-datepicker-wrapper{
        input {
            width: 7.5rem;
            font-size:1rem;
            height: 1.8rem;
        }        
    }
    .react-datepicker{
      button{
        height:0;
        margin-left:0;
        padding:0;
      }
    }
    .include-no-date {
        padding-left: 0.5rem;
        label {
          font-size: 1rem;
          line-height: 1.8rem;
          margin-bottom:0.3rem;
          input {font-size: 1rem;}
        }
    }
    .react-datepicker__navigation{
      background:none;
    }
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0px!important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
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

const ContextMenu = ({ visible, x, y, parent, row_index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(row_index,"complete")}>詳細</div></li>
          <li><div onClick={() => parent.contextMenuAction(row_index,"karte_view")}>カルテを開く</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class PhysiologicalList extends Component {
  constructor(props) {
    super(props);
    var url_path = window.location.href.split("/");
    this.page_url = "/" + url_path[url_path.length-2] + "/" + url_path[url_path.length-1];
    let auto_reload_data = getAutoReloadInfo('physiological_accept');
    auto_reload_data = (auto_reload_data != undefined) ? auto_reload_data : null;
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    let karte_status = [{ id: 0, value: ""},{ id: 1, value: "外来"}];
    if (cache_ward_master !== undefined && cache_ward_master.length > 0) {
      cache_ward_master.map((item, index)=>{
        let push_item = {id: index + 2, value: "入院" + item.name, ward_id: item.number};
        karte_status.push(push_item);
      });
      this.karte_status = karte_status;
    }
    this.state = {
      examining: false,
      inspection_table_list: null,
      keyword: "",
      state: 0,
      inspection_id: 0,
      inspection_DATETIME: new Date(),
      start_date: '',
      pageStatus: 1,
      limitStatus: 20,
      select_date_type: 0,
      no_date:0,
      after_schedule_date:0,
      display_number: 20,
      auto_reload:(auto_reload_data != null && auto_reload_data.status != undefined) ? auto_reload_data.status : 1,
      is_loaded:false,
      inspection_master:getInspectionNameList(),
      karte_status,
      page_name:'生理検査受付',
      current_page:1,
      pageOfItems:[],
      selected_index:'',
      isOpenKarteModeModal:false,
      isOpenInspectionImageModal:false,
      isOpenModal:false,
      alert_messages:"",
      complete_message:"",
    };
    this.search_flag = false;
    this.auto_reload_timer = undefined;
    this.timer_interval = (auto_reload_data != null && auto_reload_data.status != undefined && parseInt(auto_reload_data.reload_time) > 0) ? auto_reload_data.reload_time : 60;
    this.emergency_is_display_at_top = "OFF";
    if (this.sort_data != undefined && this.sort_data.emergency_is_display_at_top != undefined) {
      this.emergency_is_display_at_top = this.sort_data.emergency_is_display_at_top;
    }
    this.flash_timer = undefined;
    this.on_off = 1;
    this.on_time = 3;
    if (auto_reload_data != null && auto_reload_data.on_time != undefined && parseInt(auto_reload_data.on_time) > 0){
      this.on_time = auto_reload_data.on_time;
    }
    this.off_time = 3;
    if (auto_reload_data != null && auto_reload_data.off_time != undefined && parseInt(auto_reload_data.off_time) > 0){
      this.off_time = auto_reload_data.off_time;
    }
    this.background = 'lightcoral';
    if (auto_reload_data != null && auto_reload_data.background != undefined && auto_reload_data.background != ""){
      this.background = auto_reload_data.background;
    }
    this.search_condition = {};
    this.init_table_list = [];
    this.title_color = (auto_reload_data.title_color != undefined && auto_reload_data.title_color != "") ? auto_reload_data.title_color : "#000000";
    this.title_border_left_color = (auto_reload_data.title_border_left_color != undefined && auto_reload_data.title_border_left_color != "") ? auto_reload_data.title_border_left_color : "#69c8e1";
    this.title_border_bottom_color = (auto_reload_data.title_border_bottom_color != undefined && auto_reload_data.title_border_bottom_color != "") ? auto_reload_data.title_border_bottom_color : "#69c8e1";
    let status_row_color = getStatusRowColor('physiological_accept');
    this.row_color = status_row_color.default != undefined ? status_row_color.default : "#FFFFFF";
    this.row_reception_color = status_row_color.reception != undefined ? status_row_color.reception : "#FFFFFF";
    this.row_done_color = status_row_color.done != undefined ? status_row_color.done : "#FFFFFF";
    this.sort_data = sessApi.getObjectValue('haruka_sort', "list").inspection;
    this.sort_data = this.sort_data.accept; //reception_or_done == reception
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }
  
  componentWillUnmount() {
    clearInterval(this.auto_reload_timer);
    clearInterval(this.flash_timer);
    var panelGroup = document.getElementsByClassName('container')[0];
    this.purge(panelGroup);
    this.search_condition = {};
    this.init_table_list = [];
    this.setState({inspection_table_list: null})
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
  
  async componentDidMount() {
    localApi.setValue("system_next_page", "/physiological/order_list");
    localApi.setValue("system_before_page", "/physiological/order_list");
    this.searchList(this.state.order, this.state.asc_desc, 'init');
    this.auto_reload_timer = setInterval(() => {
      if (this.state.auto_reload && !this.state.isOpenModal && !this.state.isOpenKarteModeModal && !this.state.isOpenInspectionImageModal){
        this.searchList(this.state.order, this.state.asc_desc, 'init');
      }
    }, this.timer_interval * 1000);
    this.flash_interval = this.on_off == 1 ? this.on_time : this.off_time;
    this.flash_timer = setInterval(() => {
      if (this.on_off){
        if (this.state.inspection_table_list != null && this.state.inspection_table_list.length > 0){
          this.state.inspection_table_list.map(item => {
            if (item.new_added){
              item.background = this.background;
            } else {
              delete item.background;
            }
          });
        }
      } else {
        if (this.state.inspection_table_list != null && this.state.inspection_table_list.length > 0){
          this.state.inspection_table_list.map(item => {
            delete item.background
          })
        }
      }
      this.on_off = !this.on_off;
      this.flash_interval = this.on_off ==1 ? this.on_time : this.off_time;
      this.forceUpdate();
    }, this.flash_interval * 1000);
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  getCheckBox = (name, value) => {
    this.setState({[name]: value});
  }

  search = word => {
    word = word.toString().trim();
    this.setState({ keyword: word });
  };

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.search_flag = true;
      this.searchList(this.state.order, this.state.asc_desc, 'init');
    }
  };

  getTreatSelect = e => {
    this.setState({ state: parseInt(e.target.id) });
  };

  getDepartmentSelect = e => {
    this.setState({ inspection_id: parseInt(e.target.id) });
  };

  getDate = value => {
    this.setState({inspection_DATETIME: value});
  };

  getStartDate = value => {
    this.setState({
      start_date: value,
    });
  };

  searchList = async (order=undefined, asc_desc=undefined, type=null) => {
    this.setState({
      is_loaded:false,
      order,
      asc_desc
    });
    let path = "/app/api/v2/master/inspection/inspectionListByPatient";
    let post_data = {
      keyword:this.state.keyword,
      state:this.state.state,
      inspection_id:this.state.inspection_id,
      inspection_DATETIME:this.state.inspection_DATETIME !== '' ? formatDateLine(this.state.inspection_DATETIME) : '' ,
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '' ,
      type:"physiological",
      no_date:this.state.no_date,
      hospitalized_flag: this.state.karte_status_code,
      order:order,
      asc_desc,
      emergency: this.emergency_is_display_at_top,
      after_schedule_date:this.state.after_schedule_date,
    };
    if(this.state.karte_status_code >= 2) {
      post_data.hospitalized_flag = 2;
      post_data.first_ward_id = this.state.first_ward_id;
    }

    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          var current_page = this.state.current_page;
          if(type == 'init'){
            current_page = 1;
          } else {
            if (Math.ceil(res.length/this.state.display_number) < current_page) current_page = Math.ceil(res.length/this.state.display_number);
          }
          this.setState({
            inspection_table_list:res,
            is_loaded:true,
            current_page,
            pageOfItems :[]
          }, () => {
            if (this.init_table_list.length < res.length && JSON.stringify(post_data) == JSON.stringify(this.search_condition)){
              this.assignFlashRecord();
            }
            this.init_table_list = res;
            this.search_condition = post_data;
            if(this.state.keyword !== "" && this.state.inspection_table_list.length === 1 && this.search_flag){
              this.setState({
                isOpenModal: true,
                modal_data: this.state.inspection_table_list[0],
                endoscope_image:"",
                selected_index:0,
              })
            }
            this.search_flag = false;
          });
        }
      })
      .catch(() => {
      })
  };
  
  assignFlashRecord = () => {
    this.state.inspection_table_list.map((item, index)=> {
      if (this.init_table_list[index] == undefined || item.number != this.init_table_list[index].number){
        item.new_added = 1;
      }
    });
    this.on_off = 1;
    this.flash_interval = this.on_time;
  }

  setDate = (e) =>{
    let select_date_type = parseInt(e.target.value);
    if(select_date_type === this.state.select_date_type){return;}
    let inspection_DATETIME = this.state.inspection_DATETIME;
    let start_date = this.state.start_date;
    let after_schedule_date = this.state.after_schedule_date;
    if(select_date_type === 0){
      inspection_DATETIME = new Date();
      start_date = '';
    }
    if(select_date_type === 1){
      inspection_DATETIME = "";
      start_date = '';
      after_schedule_date = 0;
    }
    if(select_date_type === 2){
      if(inspection_DATETIME === ''){
        inspection_DATETIME = new Date();
      }
      start_date = new Date(inspection_DATETIME.getFullYear(), inspection_DATETIME.getMonth(), (inspection_DATETIME.getDate() - 7));
      after_schedule_date = 0;
    }
    this.setState({
      select_date_type,
      inspection_DATETIME,
      start_date,
      after_schedule_date,
    })
  };

  setCheckFlag = (name, value) => {
    let state_data = {};
    state_data[name] = value;
    if(name == "after_schedule_date" && value && this.state.select_date_type != 0){
      state_data.inspection_DATETIME = new Date();
      state_data.start_date = '';
      state_data.select_date_type = 0;
    }
    this.setState(state_data);
  };

  onChangePage(pageOfItems, pager) {
    this.setState({ pageOfItems: pageOfItems, current_page:pager.currentPage});
  }
  
  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };

  moveDay = (type) => {
    let now_day = this.state.inspection_DATETIME;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      inspection_DATETIME: cur_day,
      select_date_type:0,
      start_date:"",
    });
  };

  selectToday=()=>{
    this.setState({
      inspection_DATETIME: new Date(),
      select_date_type:0,
      start_date:"",
    });
  }

  goToPage = (url) => {
    this.props.history.replace(url);
  }

  btnClick=()=>{
    this.search_flag = true;
    this.searchList(this.state.order, this.state.asc_desc, 'init');
  }

  changeSearchFlag=()=>{
    this.search_flag = false;
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

  getUsableMenuItem = (menu_id) => {
    let menu_info = sessApi.getObjectValue("init_status", "navigation_menu");
    if (menu_info == undefined || menu_info == null) return false;
    let find_menu = menu_info.find(x=>x.id == menu_id);
    if (find_menu == undefined || find_menu == null) return true;
    return find_menu.is_enabled && find_menu.is_visible;
  }
  
  getKarteStatus = e => {
    this.setState({
      karte_status_code:e.target.id,
      karte_status_name: e.target.value
    });
    let find_karte = this.karte_status.find(x=>x.id == e.target.id);
    if (find_karte != undefined && e.target.id >=2) {
      this.setState({first_ward_id: find_karte.ward_id});
    } else {
      this.setState({first_ward_id: null});
    }
  };
  
  printData = () => {
    if (this.state.inspection_table_list == null || (this.state.inspection_table_list != null && this.state.inspection_table_list.length == 0) || !this.state.is_loaded){return;}
    this.setState({complete_message:"印刷中"});
    let path = "/app/api/v2/master/inspection/print_list";
    let print_data = {params:this.state};
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
        window.navigator.msSaveOrOpenBlob(blob, '生理検査受付.pdf');
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '生理検査受付.pdf'); //or any other extension
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
  
  selectedItem=(index)=>{
    this.setState({selected_index:index});
  };
  
  handleClick = (e, index) => {
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
        .getElementById("table-body")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("table-body")
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
        row_index: index,
        selected_index:index,
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
            row_index: index,
            selected_index:index,
          })
        } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX,
              y: clientY - menu_height,
            },
            row_index: index,
            selected_index:index,
          })
        } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-menu_width,
              y: clientY + window.pageYOffset,
            },
            row_index: index,
            selected_index:index,
          })
        }
      });
    }
  };
  
  contextMenuAction = (index, type) => {
    if (type === "complete"){
      this.completeData(index);
    }
    if (type === "karte_view"){
      this.goKartePage(index);
    }
  };
  
  completeData = (index) => {
    this.setState({
      isOpenModal: true,
      modal_data: this.state.pageOfItems[index],
      endoscope_image:"",
      selected_index:index,
    })
  };
  
  goKartePage=(index)=> {
    let data = this.state.pageOfItems[index];
    let patients_list = this.context.patientsList;
    let isExist = 0;
    if(patients_list !== undefined && patients_list != null && patients_list.length > 0){
      patients_list.map(item=>{
        if (item.system_patient_id == data.system_patient_id) {
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
        if(parseInt(department.id) == data['medical_department_code']){
          department_name = department.value;
          return;
        }
      });
      let modal_data = {
        systemPatientId:data['system_patient_id'],
        date:data['treatment_date'],
        medical_department_code:data['medical_department_code'],
        department_name,
      };
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToPage("/patients/"+data.system_patient_id+"/"+page);
    }
  }
  
  closeModal=(act)=>{
    this.setState({
      isOpenKarteModeModal:false,
      isOpenInspectionImageModal:false,
      isOpenModal:false,
      alert_messages:"",
    }, ()=>{
      if(act === "change"){
        this.searchList();
      }
    });
  }
  
  goToUrlFunc=(url) => {
    this.goToPage(url);
    this.setState({isOpenKarteModeModal: false});
  };
  
  getBackGround=(background, status)=>{
    if(background !== undefined){
      return background;
    } else {
      return status == 0 ? this.row_color : (status == 1 ? this.row_reception_color : this.row_done_color);
    }
  }
  
  openInspectionImageModal = async (number) => {
    const { data } = await axios.post("/app/api/v2/order/inspection/getImage", {
      params: {number: number}
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  render() {
    let list_names = ["生理検査受付", "生理検査実施"];
    var list_urls = ["/physiological/order_list", "/physiological/done_list"];
    const menu_list_ids = ["439", "440"];
    let curUserInfo = JSON.parse(sessApi.getValue('haruka'));
    let arr_menu_permission = curUserInfo.menu_auth;
    let button_disable = false;
    if(this.state.inspection_table_list == null || (this.state.inspection_table_list != null && this.state.inspection_table_list.length == 0) || !this.state.is_loaded){button_disable = true;}
    return (
      <PatientsWrapper>
        <div className="title-area flex" style={{borderBottomColor:this.title_border_bottom_color}}>
          <div className={'title'} style={{color:this.title_color, borderLeftColor:this.title_border_left_color}}>生理検査受付</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10) && this.getUsableMenuItem(menu_list_ids[index])){
                  return(
                    <>
                      {this.page_url == list_urls[index] ? (
                        <>
                          <Button className="tab-btn button active-btn">{item}</Button>
                        </>
                      ):(
                        <Button className="tab-btn button" onClick={()=>this.goToPage(list_urls[index])}>{item}</Button>
                      )}
                    </>
                  )
                } else {
                  return(
                    <Button className="disabled button">{item}</Button>
                  )
                }
              }
            })}
            {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
              <>
                <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
              </>
            )}
          </div>
        </div>
        <Flex>
          <div className={'d-flex'}>
            <SearchBar
              placeholder="患者ID / 患者名"
              search={this.search}
              enterPressed={this.enterPressed}
            />
            <div className={`done-state`}>
              <SelectorWithLabel
                options={STATUS_OPTIONS}
                title="実施状態"
                getSelect={this.getTreatSelect}
                departmentEditCode={this.state.state}
              />
            </div>
            <div className={'select-order'}>
              <SelectorWithLabel
                options={this.state.inspection_master}
                title="オーダーの種類"
                getSelect={this.getDepartmentSelect}
                departmentEditCode={this.state.inspection_id}
              />
            </div>
            <div className={`karte-status`}>
              <SelectorWithLabel
                title="入外区分"
                options={this.karte_status}
                getSelect={this.getKarteStatus}
                value={this.state.karte_status_name}
                departmentEditCode={this.state.karte_status_code}
              />
            </div>
            <div className="display_number">
              <SelectorWithLabel
                options={PER_PAGE}
                title="表示件数"
                getSelect={this.getDisplayNumber}
                departmentEditCode={this.state.display_number}
              />
            </div>
            <Button type="mono" onClick={this.btnClick.bind(this)}>検索</Button>
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
                    selected={this.state.inspection_DATETIME}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="年/月/日"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    disabled={this.state.inspection_DATETIME === '' ?  true : false}
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
              <div>
                <Checkbox
                  label={'指定日以降'}
                  getRadio={this.setCheckFlag.bind(this)}
                  value={this.state.after_schedule_date}
                  name={`after_schedule_date`}
                />
              </div>
              <div>
                <Checkbox
                  label={'日未定を含む'}
                  getRadio={this.setCheckFlag.bind(this)}
                  value={this.state.no_date}
                  name={`no_date`}
                />
              </div>
            </div>
            <div className = 'reload-check d-flex'>
              <Button type="common" className={'mr-3 ' + (button_disable ? 'disable-btn' : '')} onClick={this.printData}>一覧印刷</Button>
              <Checkbox
                label={'自動更新'}
                getRadio={this.getCheckBox.bind(this)}
                value={this.state.auto_reload}
                name={`auto_reload`}
              />
            </div>
          </div>
        </Flex>
        <div className={'table-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th style={{width:"15rem"}}>予定日付
                {this.sort_data.inspection_DATETIME === 'ON' && (
                  <>
                    {(this.state.order === 'inspection_DATETIME' && this.state.asc_desc === 'desc') ? (
                      <span className='sort-symbol' onClick={this.searchList.bind(this,'inspection_DATETIME', 'asc')}>▼</span>
                    ):(
                      <span className='sort-symbol' onClick={this.searchList.bind(this,'inspection_DATETIME', 'desc')}>▲</span>
                    )}
                  </>
                )}
              </th>
              <th style={{width:"6rem"}}>入外</th>
              <th style={{width:"7rem"}}>患者ID
                {this.sort_data.patient_id == 'ON' && (
                  <>
                    {(this.state.order === 'patient_id' && this.state.asc_desc === 'desc') ? (
                      <span className='sort-symbol' onClick={this.searchList.bind(this,'patient_id', 'asc')}>▼</span>
                    ):(
                      <span className='sort-symbol' onClick={this.searchList.bind(this,'patient_id', 'desc')}>▲</span>
                    )}
                  </>
                )}
              </th>
              <th style={{width:"15rem"}}>名前</th>
              <th style={{width:"12rem"}}>カナ</th>
              <th style={{width:"10rem"}}>オーダーの種類</th>
              <th>指示医師</th>
              <th style={{width:"6rem"}}>受付状態</th>
              <th style={{width:"10rem"}}>受付日時
                {this.sort_data.accepted_date === 'ON' && (
                  <>
                    {this.state.order === 'accepted_date' && this.state.asc_desc === 'desc' ? (
                      <span className='sort-symbol' onClick={this.searchList.bind(this,'accepted_date', 'asc')}>▼</span>
                    ):(
                      <span className='sort-symbol' onClick={this.searchList.bind(this,'accepted_date', 'desc')}>▲</span>
                    )}
                  </>
                )}
              </th>
            </tr>
            </thead>
            <tbody className={'scroll-area'} id={'table-body'}>
            {this.state.is_loaded ? (
              <>
                {this.state.pageOfItems.length === 0 ? (
                  <tr style={{height:"calc(100vh - 23rem)"}}>
                    <td colSpan={'9'} style={{verticalAlign:"middle"}}>
                      <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {this.state.pageOfItems.map((item, index) => {
                      return (
                        <>
                          <tr
                            className={(this.state.selected_index === index ? 'selected row-item ' : 'row-item ') + (item.is_enabled == 4 ? "stop" : "")}
                            style={{background:this.getBackGround(item.background, item.state)}}
                            onClick={()=>this.selectedItem.bind(this, index)}
                            onContextMenu={e => this.handleClick(e, index, item.state)}
                            onDoubleClick={this.goKartePage.bind(this, index)}
                          >
                            <td style={{width:"15rem"}}>
                              {item.order_data.order_data.inspection_DATETIME == "日未定" ? "[日未定]" :
                                (formatJapanDate(item.order_data.order_data.inspection_DATETIME) +
                                  ((item.order_data.order_data.reserve_time != undefined && item.order_data.order_data.reserve_time != "") ? " "+item.order_data.order_data.reserve_time : ""))}
                              {item.is_emergency == 1 && (<span style={{color:item.is_enabled == 4 ? "" : "red"}}>[当日緊急]</span>)}
                            </td>
                            <td style={{width:"6rem"}}>{item.karte_ward !== undefined ? item.karte_ward : ""}</td>
                            <td style={{width:"7rem", textAlign:"right"}}>{item.patient_number}</td>
                            <td style={{width:"15rem"}}>{item.patient_name}</td>
                            <td style={{width:"12rem"}}>{item.patient_name_kana}</td>
                            <td style={{width:"10rem"}}>{getInspectionName(item.inspection_id)}</td>
                            <td>{item.order_data !== undefined && item.order_data.order_data.doctor_name !== undefined && item.order_data.order_data.doctor_name}</td>
                            <td style={{width:"6rem"}}>{item.state == 0 ? "未受付" : (item.state == 1 ? "受付済み" : "実施")}</td>
                            <td style={{width:"10rem"}}>
                              <div>{item.accepted_date != null ? (formatJapanDateSlash(item.accepted_date) + formatTimeIE(item.accepted_date.split('-').join('/'))) : ""}</div>
                              <div>
                                {item.image_path != null && item.image_path !== "" && (
                                  <a
                                    className="soap-image-title"
                                    onClick={()=>this.openInspectionImageModal(item.order_data.order_data.number)}
                                    style={imageButtonStyle}
                                  >
                                    画像を見る
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        </>
                      )
                    })}
                  </>
                )}
              </>
            ):(
              <tr style={{height:"calc(100vh - 23rem)"}}>
                <td colSpan={'9'} style={{verticalAlign:"middle"}}>
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
        <Pagination
          items={this.state.inspection_table_list}
          onChangePage={this.onChangePage.bind(this)}
          pageSize = {this.state.display_number}
          initialPage = {this.state.current_page}
        />
        {this.state.complete_message !== "" && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          row_index={this.state.row_index}
          inspection_DATETIME={this.state.menu_inspection_DATETIME}
        />
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'inspection'}
          />
        )}
        {this.state.isOpenInspectionImageModal && (
          <EndoscopeImageModal
            closeModal={this.closeModal}
            imgBase64={this.state.endoscope_image}
          />
        )}
        {this.state.isOpenModal && (
          <InspectionDoneModal
            closeModal={this.closeModal}
            modal_title={"生理検査"}
            modal_data={this.state.modal_data}
            modal_type={"inspection"}
            reception_or_done={"reception"}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </PatientsWrapper>      
    );
  }
}

PhysiologicalList.contextType = Context;
PhysiologicalList.propTypes = {
  history: PropTypes.object,
}
export default PhysiologicalList;
