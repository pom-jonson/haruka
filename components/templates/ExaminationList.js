import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import ExaminationTableList from "./ExaminationTableList";
import SearchBar from "../molecules/SearchBar";
import SelectorWithLabel from "../molecules/SelectorWithLabel";
import DatePicker from "react-datepicker";
import Button from "../atoms/Button";
import * as colors from "../_nano/colors";
import { KEY_CODES, getAutoReloadInfo, EXAM_STATUS_OPTIONS } from "../../helpers/constants";
import auth from "~/api/auth";
import {getStatusRowColor, PER_PAGE} from "~/helpers/constants";
import Radiobox from "~/components/molecules/Radiobox";
import {formatDateLine, getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import Pagination from "~/components/molecules/Pagination";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import {setDateColorClassName} from "~/helpers/dialConstants";

const PrescriptionWrapper = styled.div`
  width: 100%;
  height: 100%;
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
  .pagination {
    float:right;
  }
  .reload-check{
    position:absolute;
    right:0;
    top:-2.5rem;
    label{
      font-size:1rem;
    }
  }
`;

const Flex = styled.div`
    display: flex;
    background: ${colors.background};
    align-items: center;
    padding: 10px 0px 10px 10px;
    width: 100%;
    z-index: 100;
    .label-title {
        text-align: right;
        width: 8.5rem;
        margin-right:0.5rem;        
        font-size: 1rem;
        line-height:2.4rem;
        height:2.4rem;
    }
    .search-btn-style{
      min-width: 6rem !important;
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
        padding-left: 10px;
        display:-ms-grid;
        .after-date-check{
            margin-top: -2rem;
            margin-bottom: 0.5rem;
        }
        label {
            font-size: 1rem;
            input {                
                font-size: 1rem;
            }
        }
    }
    .react-datepicker__navigation{
      background:none;
    }
  .MyCheck{
    margin-left: 24px;
    margin-bottom: 5px;
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
`;

const prescriptionOptions = [
  {id: 0,value: "全て"},
  {id: 1,value: EXAM_STATUS_OPTIONS.NOT_RECEPTION},
  {id: 3,value: EXAM_STATUS_OPTIONS.COLLECTION_WAIT},
  {id: 4,value: EXAM_STATUS_OPTIONS.COLLECTION_DONE},
  {id: 2,value: EXAM_STATUS_OPTIONS.RECEPTION_DONE},
  {id: 5,value: EXAM_STATUS_OPTIONS.COMPLETE_DONE},
  {id: 6,value: EXAM_STATUS_OPTIONS.IN_RESULT_DONE},
  {id: 7,value: EXAM_STATUS_OPTIONS.OUT_RESULT_DONE},
  {id: 8,value: EXAM_STATUS_OPTIONS.INOUT_RESULT_DONE},
];

// @enhance
class ExaminationList extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var url_path = window.location.href.split("/");
    var last_url = url_path[url_path.length-1];
    let title = '検体検査受付';
    if (last_url == "collect_reception") {
      title = "外来検体採取受付";
    } else if (last_url == "collect_done") {
      title = "外来検体採取実施";
    } else if (last_url == "hospital_collect_reception") {
      title = "入院検体採取受付"
    } else if (last_url == "hospital_collect_done") {
      title = "入院検体採取実施"
    }
    let prescriptionType = (last_url == "collect_reception" || last_url == "hospital_collect_reception") ? 1 : (last_url == "collect_done" || last_url == "hospital_collect_done") ? 3 : 4;
    if (last_url == "done") prescriptionType = 0;
    let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;
    if (conf_data != undefined) {
      if (last_url == "collect_reception" && conf_data.examination_collect_reception != undefined) {
        if (prescriptionOptions.find(x=>x.value == conf_data.examination_collect_reception) != undefined) {
          prescriptionType = prescriptionOptions.find(x=>x.value == conf_data.examination_collect_reception).id;
        }
      }
      if (last_url == "collect_done" && conf_data.examination_collect_done != undefined) {
        if (prescriptionOptions.find(x=>x.value == conf_data.examination_collect_done) != undefined) {
          prescriptionType = prescriptionOptions.find(x=>x.value == conf_data.examination_collect_done).id;
        }
      }
      if (last_url == "done" && conf_data.examination_done != undefined) {
        if (prescriptionOptions.find(x=>x.value == conf_data.examination_done) != undefined) {
          prescriptionType = prescriptionOptions.find(x=>x.value == conf_data.examination_done).id;
        }
      }
      if (last_url == "hospital_collect_reception" && conf_data.examination_hospital_collect_reception != undefined) {
        if (prescriptionOptions.find(x=>x.value == conf_data.examination_hospital_collect_reception) != undefined) {
          prescriptionType = prescriptionOptions.find(x=>x.value == conf_data.examination_hospital_collect_reception).id;
        }
      }
      if (last_url == "hospital_collect_done" && conf_data.examination_hospital_collect_done != undefined) {
        if (prescriptionOptions.find(x=>x.value == conf_data.examination_hospital_collect_done) != undefined) {
          prescriptionType = prescriptionOptions.find(x=>x.value == conf_data.examination_hospital_collect_done).id;
        }
      }
    }
    this.page_url = "/" + url_path[url_path.length-2] + "/" + url_path[url_path.length-1];
    let auto_reload_page = "examination_" + last_url;
    let auto_reload_data = getAutoReloadInfo(auto_reload_page);
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.last_url = last_url;
    this.state = {
      doctors: [],
      staff_category: authInfo.staff_category || 2,
      examHistory: [],
      schVal: "",
      treatStatus: 0,
      departmentStatus: 0,
      prescriptionType,
      dateStatus: new Date(),
      start_date: '',
      display_number:20,
      select_date_type: 0,
      no_date:0,
      title,
      status: last_url == "hospital_collect_reception" ? "collect_reception" : last_url == "hospital_collect_done" ? "collect_done" : last_url,
      auto_reload: auto_reload_data.status != undefined ? auto_reload_data.status : 1,
      auto_reload_time: auto_reload_data.reload_time != undefined ? auto_reload_data.reload_time : 60,
      first_ward_id: null,
      karte_status_code: last_url == "collect_reception" || last_url == "collect_done" ? 1 : '',
      examination_type:'',
      examination_type_array: [
        {id:0, value:""},
        {id:1, value:"検体検査"},
        {id:2, value:"細胞診検査"},
        {id:3, value:"細菌・抗酸菌検査"},
        {id:4, value:"病理組織検査"},
      ],
      after_date:0,
      complete_message: "",
      currentPage: 1
    };
    let ward_master = [{id:0, value:"全病棟"}];
    let ward_names = {};
    if (cache_ward_master != undefined && ward_master.length > 0){
      cache_ward_master.map(ward=>{
        ward_master.push({id:ward.number, value: ward.name});
        ward_names[parseInt(ward.number)] = ward.name;
      });
    }
    this.ward_master = ward_master;
    this.ward_names = ward_names;
    this.search_flag = false;
    this.auto_reload_timer = undefined;
    this.flash_timer = undefined;
  
    this.timer_interval = auto_reload_data.reload_time;
    this.on_time = 3;
    this.off_time = 3;
    this.background = 'lightblue';
    this.on_off = 1;
    if (auto_reload_data.on_time > 0) this.on_time = auto_reload_data.on_time;
    if (auto_reload_data.off_time > 0) this.off_time = auto_reload_data.off_time;
    if (auto_reload_data.background != undefined && auto_reload_data.background != '') this.background = auto_reload_data.background;
    this.search_condition = {};
    this.init_examHistory = [];
  
    this.table_ref = React.createRef();
    this.timer_interval = 1000;
    this.karte_status=[{ id: 0, value: ""},{ id: 1, value: "外来"},{ id: 2, value: "入院"}];
    if (last_url == "done") {
      let karte_status = [{ id: 0, value: "全て"},{ id: 1, value: "外来"}];
      if (cache_ward_master !== undefined && cache_ward_master.length > 0) {
        cache_ward_master.map((item, index)=>{
          let push_item = {id: index + 2, value: "入院" + item.name, ward_id: item.number};
          karte_status.push(push_item);
        })
      }
      this.karte_status = karte_status;
    }
    if (last_url == "collect_reception" || last_url == "collect_done") {
      this.karte_status=[{ id: 0, value: "外来・訪問"},{ id: 1, value: "外来"},{ id: 2, value: "訪問診療"}];
    }
    this.title_color = (auto_reload_data.title_color != undefined && auto_reload_data.title_color != "") ? auto_reload_data.title_color : "#000000";
    this.title_border_left_color = (auto_reload_data.title_border_left_color != undefined && auto_reload_data.title_border_left_color != "") ? auto_reload_data.title_border_left_color : "#69c8e1";
    this.title_border_bottom_color = (auto_reload_data.title_border_bottom_color != undefined && auto_reload_data.title_border_bottom_color != "") ? auto_reload_data.title_border_bottom_color : "#69c8e1";
    let status_row_color = getStatusRowColor(auto_reload_page);
    this.row_color = status_row_color.default != undefined ? status_row_color.default : "#FFFFFF";
    this.row_wait_color = status_row_color.collection_wait != undefined ? status_row_color.collection_wait : "#FFFFFF";
    this.row_collection_color = status_row_color.collection_done != undefined ? status_row_color.collection_done : "#FFFFFF";
    this.row_reception_color = status_row_color.reception != undefined ? status_row_color.reception : "#FFFFFF";
    this.row_done_color = status_row_color.done != undefined ? status_row_color.done : "#FFFFFF";
    this.row_inout_result_color = status_row_color.inout_result != undefined ? status_row_color.inout_result : "#FFFFFF";
    this.row_in_result_color = status_row_color.in_result != undefined ? status_row_color.in_result : "#FFFFFF";
    this.row_out_result_color = status_row_color.out_result != undefined ? status_row_color.out_result : "#FFFFFF";
  }
  
  componentWillUnmount() {
    clearInterval(this.auto_reload_timer);
    clearInterval(this.flash_timer);
  }

  async componentDidMount() {
    localApi.setValue("system_next_page", "/examination/order_list");
    localApi.setValue("system_before_page", "/examination/order_list");
    await this.searchPrescriptionList(this.state.order, this.state.asc_desc);
    this.auto_reload_timer = setInterval(() => {
      if (this.state.auto_reload){
        if (this.table_ref.current != null){
          var modal_obj = document.getElementsByClassName("modal-dialog")[0];
          if (this.table_ref.current.state.isOpenModal != true && this.table_ref.current.state.isOpenKarteModeModal != true && modal_obj === undefined){
            this.searchPrescriptionList(this.state.order, this.state.asc_desc);
            }
        }
      }
    }, this.timer_interval * this.state.auto_reload_time);
  
    this.flash_interval = this.on_off ==1? this.on_time:this.off_time;
    this.flash_timer = setInterval(() => {
      if (this.on_off){
        if (this.state.examHistory != undefined && this.state.examHistory != null && this.state.examHistory.length > 0){
          this.state.examHistory.map(item => {
            if (item.new_added) item.background = this.background; else delete item.background
          })
        }
      } else {
        if (this.state.examHistory != undefined && this.state.examHistory != null && this.state.examHistory.length > 0){
          this.state.examHistory.map(item => {
            delete item.background
          })
        }
      }
      this.on_off = !this.on_off;
      this.flash_interval = this.on_off ==1? this.on_time:this.off_time;
      this.forceUpdate();
    }, this.flash_interval * 1000);
    auth.refreshAuth(location.pathname+location.hash);
  }

  changeHistory(examHistory) {
    this.setState({
      examHistory: examHistory
    });
  }
  
  assignFlashRecord = () => {
    this.state.examHistory.map((item, index)=> {
      if (this.init_examHistory[index] == undefined || item.number != this.init_examHistory[index].number){
        item.new_added = 1;
      }
    })
    this.on_off = 1;
    this.flash_interval = this.on_time;
  }

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === KEY_CODES.enter) {
      this.searchPrescriptionList(this.state.order, this.state.asc_desc);
    }
  };

  getTreatSelect = e => {
    this.setState({ treatStatus: parseInt(e.target.id) });
  };

  getDepartmentSelect = e => {
    this.setState({ departmentStatus: parseInt(e.target.id) });
  };

  getPrescriptionSelect = e => {
    this.setState({ prescriptionType: parseInt(e.target.id) });
  };

  getDate = value => {
    this.setState({ dateStatus: value });
  };

  search = word => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };

  formatDate4API = dt => {
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + m + d;
    return result;
  };

  searchPrescriptionList = async (order = undefined, asc_desc = undefined, page_change = true) => {
    this.setState({
      is_loaded:false,
      order,
      asc_desc,
    });
    let path = "/app/api/v2/order/examination/examinations";
    let post_data = {
      keyword:this.state.schVal,
      status:this.state.prescriptionType,
      date:this.state.dateStatus !== '' ? formatDateLine(this.state.dateStatus) : '' ,
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '' ,
      no_date:this.state.no_date,
      after_date:this.state.after_date,
      last_url: this.last_url,
      examination_type: this.state.examination_type,
      order,
      asc_desc,
    };
    if (this.last_url == "done") {
      if (this.state.karte_status_code >= 2) {
        post_data.hospitalized_flag = 2;
        post_data.first_ward_id = this.state.first_ward_id;
      } else {
        post_data.hospitalized_flag = this.state.karte_status_code;
      }
    } else if (this.last_url == "hospital_collect_reception" || this.last_url == "hospital_collect_done") {
      post_data.hospitalized_flag = 2;
      post_data.first_ward_id = this.state.first_ward_id;
    } else {
      post_data.hospitalized_flag = this.state.karte_status_code;
    }
    let data = [];
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          data = res;
          this.changeHistory(data);
          if (this.init_examHistory.length < res.length && JSON.stringify(post_data) == JSON.stringify(this.search_condition)){
            this.assignFlashRecord();
          }
          this.init_examHistory = res;
          this.search_condition = post_data;
        }
        let currentPage = this.state.currentPage;
        if (!page_change) {          
          if (res.length > 0 && Math.ceil(res.length / this.state.display_number) < currentPage) currentPage = Math.ceil(res.length / this.state.display_number);
        } else {
          currentPage = 1;
        }
        this.setState({is_loaded:true, currentPage: currentPage});
      })
      .catch(() => {
        this.setState({is_loaded:true});
      });
    return data;
  };
  setWard=(e)=>{
    this.setState({first_ward_id:e.target.id});
  };

  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };

  moveDay = (type) => {
    let now_day = this.state.dateStatus;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      dateStatus: cur_day,
      select_date_type:0,
      start_date:"",
    });
  };

  selectToday=()=>{
    this.setState({
      dateStatus: new Date(),
      select_date_type:0,
      start_date:"",
    });
  };

  setDate = (e) =>{
    let dateStatus = this.state.dateStatus;
    let start_date = this.state.start_date;
    let {after_date} = this.state;
    if(parseInt(e.target.value) === 0){
      dateStatus = new Date();
      start_date = '';
    } else {
      after_date = 0;
    }
    if(parseInt(e.target.value) === 1){
      dateStatus = "";
      start_date = '';
    }
    if(parseInt(e.target.value) === 2){
      if(dateStatus === ''){
        dateStatus = new Date();
      }
      start_date = new Date(dateStatus.getFullYear(), dateStatus.getMonth(), (dateStatus.getDate() - 7));
    }

    this.setState({
      select_date_type:parseInt(e.target.value),
      dateStatus,
      start_date,
      after_date
    })
  };

  getIncludeNoDate = (name, value) => {
    if(name === 'include'){
      this.setState({no_date:value});
    }
  };
  getAfterDate = (name, value) => {
    if(name === 'after_date'){
      let {select_date_type, start_date} = this.state;
      if (value == 1 && select_date_type != 0) {
        select_date_type = 0;
        start_date = "";
      }
      this.setState({
        after_date:value,
        select_date_type: select_date_type,
        start_date,
        dateStatus : this.state.dateStatus != ''? this.state.dateStatus : new Date(),
      });
    }
  };

  getStartDate = value => {
    this.setState({
      start_date: value,
    });
  };

  onChangePage(pageOfItems, pager) {
    this.setState({ pageOfItems: pageOfItems, currentPage:pager.currentPage });
  }

  changeSearchFlag=()=>{
    this.search_flag = false;
  };

  goToPage = (url) => {
    this.props.history.replace(url);
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
  
  getUsableMenuItem = (menu_id) => {
    let menu_info = sessApi.getObjectValue("init_status", "navigation_menu");
    if (menu_info == undefined || menu_info == null) return false;
    let find_menu = menu_info.find(x=>x.id == menu_id);
    if (find_menu == undefined || find_menu == null) return true;
    return find_menu.is_enabled && find_menu.is_visible;
  }
  getCheckBox = (name, value) => {
    this.setState({[name]: value});
  }
  getKarteStatus = e => {
    this.setState({
      karte_status_code:e.target.id,
      karte_status_name: e.target.value
    });
    if (this.state.status == "done") {
      let find_karte = this.karte_status.find(x=>x.id == e.target.id);
      if (find_karte != undefined && e.target.id >=2) {
        this.setState({first_ward_id: find_karte.ward_id});
      } else {
        this.setState({first_ward_id: null});
      }
    }
  };
  getExaminationType = e => {
    this.setState({
      examination_type: e.target.id,
      examination_type_name: e.target.value
    })
  }
  printData = () => {
    if (this.state.examHistory === undefined || this.state.examHistory == null || this.state.examHistory.length === 0 || !this.state.is_loaded)  return;
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/order/examination/print_list";
    let print_data = {params:this.state};
    print_data.params.karte_status = this.karte_status;
    print_data.params.ward_master = this.ward_master;
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      let title = this.state.title + ".pdf"
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
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  };
  
  refresh = (order=null,asc_desc = null) => {
    if(order == null && asc_desc == null)
      this.searchPrescriptionList(this.state.order, this.state.asc_desc, false);
    else this.searchPrescriptionList(order, asc_desc, false);
  }

  render() {
    const { examHistory, title } = this.state;
    let list_names = ["外来検体採取受付", "外来検体採取実施", "検体検査受付", "入院検体採取受付", "入院検体採取実施"];
    var list_urls = ["/examination/collect_reception", "/examination/collect_done", "/examination/done", "/examination/hospital_collect_reception", "/examination/hospital_collect_done"];
    const menu_list_ids = ["459", "460", "410", "462", "463"];
    let curUserInfo = JSON.parse(sessApi.getValue('haruka'));
    let arr_menu_permission = curUserInfo.menu_auth;
    var button_disabled = false;
    if (examHistory === undefined || examHistory == null || examHistory.length == 0) button_disabled = true;
    return (
      <>
        <PrescriptionWrapper>
          <div className="title-area flex" style={{borderBottomColor:this.title_border_bottom_color}}>
            <div className={'title'} style={{color:this.title_color, borderLeftColor:this.title_border_left_color}}>{title}</div>
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
                  <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
              )}
            </div>
          </div>
          <Flex>
            <SearchBar
              placeholder="患者ID"
              search={this.search}
              enterPressed={this.enterPressed}
            />
            <SelectorWithLabel
              options={prescriptionOptions}
              title="状態"
              getSelect={this.getPrescriptionSelect}
              departmentEditCode={this.state.prescriptionType}
            />
            {(this.last_url == "done" || this.last_url == "collect_reception" || this.last_url == "collect_done") && (
              <SelectorWithLabel
                title="入外区分"
                options={this.karte_status}
                getSelect={this.getKarteStatus}
                value={this.state.karte_status_name}
                departmentEditCode={this.state.karte_status_code}
              />
            )}
            {(this.last_url == "hospital_collect_reception" || this.last_url == "hospital_collect_done") && (
              <div className={'select-ward'}>
                <SelectorWithLabel
                  title="病棟"
                  options={this.ward_master}
                  getSelect={this.setWard}
                  departmentEditCode={this.state.first_ward_id}
                />
              </div>
            )}
            <SelectorWithLabel
              title="区分"
              options={this.state.examination_type_array}
              getSelect={this.getExaminationType}
              departmentEditCode={this.state.examination_type}
            />
            <div className="display_number">
              <SelectorWithLabel
                options={PER_PAGE}
                title="表示件数"
                getSelect={this.getDisplayNumber}
                departmentEditCode={this.state.display_number}
              />
            </div>
            <Button className="search-btn-style" type="mono" onClick={this.searchPrescriptionList.bind(this, this.state.order, this.state.asc_desc)}>検索</Button>
          </Flex>
          <Flex>
            <div className="date-area" style={{marginTop:"5px"}}>
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
                    selected={this.state.dateStatus}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="年/月/日"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    disabled={this.state.dateStatus === '' ?  true : false}
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
              <div className="after-date-check">
              <Checkbox
                label={'指定日以降'}
                getRadio={this.getAfterDate.bind(this)}
                value={this.state.after_date}
                name={`after_date`}
              />
              </div>
              <div className="no-date-check">
              <Checkbox
                label={'日未定を含む'}
                getRadio={this.getIncludeNoDate.bind(this)}
                value={this.state.no_date}
                name={`include`}
              />
              </div>
            </div>
          </Flex>
          <div style={{position:'relative'}}>
            <div className = 'reload-check d-flex'>
              <Button className={`print-btn mr-3 ${button_disabled ? "disable-btn":""}`} type="common" onClick={this.printData} isDisabled={button_disabled}>一覧印刷</Button>
              <Checkbox
                label={'自動更新'}
                getRadio={this.getCheckBox.bind(this)}
                value={this.state.auto_reload}
                name={`auto_reload`}
              />
            </div>
          </div>
          <ExaminationTableList
            examination_list={this.state.pageOfItems}
            refresh={this.refresh}
            goToPage={this.goToPage}
            keyword={this.state.keyword}
            search_flag={this.search_flag}
            changeSearchFlag={this.changeSearchFlag}
            status={this.state.status}
            page_title = {title}
            ref = {this.table_ref}
            last_url = {this.last_url}
            order = {this.state.order}
            asc_desc = {this.state.asc_desc}
            is_loaded = {this.state.is_loaded}
            row_color={this.row_color}
            row_wait_color={this.row_wait_color}
            row_collection_color={this.row_collection_color}
            row_reception_color={this.row_reception_color}
            row_done_color={this.row_done_color}
            row_in_result_color={this.row_in_result_color}
            row_out_result_color={this.row_out_result_color}
            row_inout_result_color={this.row_inout_result_color}
          />
          <Pagination
            items={examHistory}
            onChangePage={this.onChangePage.bind(this)}
            pageSize = {this.state.display_number}
            initialPage={this.state.currentPage}
          />
        </PrescriptionWrapper>
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
      </>
    );
  }
}
ExaminationList.contextType = Context;

ExaminationList.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};

export default ExaminationList;
