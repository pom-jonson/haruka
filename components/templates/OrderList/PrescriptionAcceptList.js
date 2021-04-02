import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import PrescriptionTableList from "./PrescriptionTableList";
import SearchBar from "~/components/molecules/SearchBar";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import {PER_PAGE, getAutoReloadInfo, getStatusRowColor} from "~/helpers/constants";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import Pagination from "~/components/molecules/Pagination";
import auth from "~/api/auth";
import {getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import PropTypes from "prop-types";
import axios from "axios";
import Context from "~/helpers/configureStore";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as localApi from "~/helpers/cacheLocal-utils";
import {setDateColorClassName} from '~/helpers/dialConstants'

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;
  font-size:1rem;
  input{
    height:2.4rem;
  }
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
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
    border-bottom: solid 7px #69c8e1;
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
    padding: 2px 0 2px 7px;
    border-left: solid 5px #69c8e1;
  }
  .display_number{
    .pullbox-label, select{
      width:100%;
    }
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
        margin-top: 2.35rem;
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

`;

const prescriptionOptions = [
  {
    id: 0,
    value: "全て"
  },
  {
    id: 1,
    value: "院内"
  },
  {
    id: 2,
    value: "院外"
  },
  {
    id: 3,
    value: "入院"
  }
];

const STATUS_OPTIONS_NORECEPTION = [
  {id: 0, value: "全て"},
  {id: 1, value: "未実施"},
  {id: 3, value: "実施"}
];
class PrescriptionAcceptList extends Component {
  constructor(props) {
    super(props);
    var url_path = window.location.href.split("/");
    var type = url_path[url_path.length-1];
    var reception_or_done = url_path[url_path.length-2];
    let title = "処方";
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    var auto_reload_data = getAutoReloadInfo('prescription_accept');
    this.state = {
      examining: false,
      table_list: null,
      keyword: "",
      state: 1,
      pageStatus: 1,
      limitStatus: 20,
      select_date_type: 0,
      type,
      reception_or_done,
      modal_title: title,
      // sub_title,
      no_date:0,
      search_date:new Date(),
      start_date: '',
      departmentStatus: 0,
      prescriptionType: 1,
      display_number: 20,
      auto_reload:auto_reload_data.status,
      department_codes,
      diagnosis,
      is_loaded:false,
      current_page:1,
    };
    this.search_flag = false;
    this.auto_reload_timer = undefined;
    this.timer_interval = auto_reload_data.reload_time;
    this.on_time = 3;
    this.off_time = 3;
    this.background = 'lightblue';
    this.on_off = 1;
    if (auto_reload_data.on_time > 0) this.on_time = auto_reload_data.on_time;
    if (auto_reload_data.off_time > 0) this.off_time = auto_reload_data.off_time;
    if (auto_reload_data.background != undefined && auto_reload_data.background != '') this.background = auto_reload_data.background;
    this.search_condition = {};
    this.init_table_list = [];
    this.table_ref = React.createRef();
    this.title_color = (auto_reload_data.title_color != undefined && auto_reload_data.title_color != "") ? auto_reload_data.title_color : "#000000";
    this.title_border_left_color = (auto_reload_data.title_border_left_color != undefined && auto_reload_data.title_border_left_color != "") ? auto_reload_data.title_border_left_color : "#69c8e1";
    this.title_border_bottom_color = (auto_reload_data.title_border_bottom_color != undefined && auto_reload_data.title_border_bottom_color != "") ? auto_reload_data.title_border_bottom_color : "#69c8e1";
    let status_row_color = getStatusRowColor('prescription_accept');
    this.row_color = status_row_color.default != undefined ? status_row_color.default : "#FFFFFF";
    this.row_reception_color = status_row_color.reception != undefined ? status_row_color.reception : "#FFFFFF";
    this.row_done_color = status_row_color.done != undefined ? status_row_color.done : "#FFFFFF";
  }
  
  componentWillUnmount() {
    clearInterval(this.auto_reload_timer);
    var panelGroup = document.getElementsByClassName('container')[0];
    this.purge(panelGroup);

    this.search_flag = false;
    this.auto_reload_timer = undefined;
    this.search_condition = {};
    this.init_table_list = [];
    this.table_ref = null;

    this.setState({      
      table_list: null,
      department_codes:null,
    })
  }
  
  async componentDidMount() {
    await this.searchList('init');
    this.auto_reload_timer = setInterval(() => {
      if (this.state.auto_reload){
        if (this.table_ref.current != null){
          if (this.table_ref.current.state.isOpenModal != true && this.table_ref.current.state.isOpenKarteModeModal != true){
            this.searchList('init');
          }
        }
      }
    }, this.timer_interval * 1000);
    
    this.flash_interval = this.on_off ==1? this.on_time:this.off_time;
    this.flash_timer = setInterval(() => {
      if (this.on_off){
        if (this.state.table_list != undefined && this.state.table_list != null && this.state.table_list.length > 0){
          this.state.table_list.map(item => {
            if (item.new_added) item.background = this.background; else delete item.background
          })
        }
      } else {
        if (this.state.table_list != undefined && this.state.table_list != null && this.state.table_list.length > 0){
          this.state.table_list.map(item => {
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
      this.searchList('init');
    }
  };
  
  getTreatSelect = e => {
    this.setState({ state: parseInt(e.target.id) });
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
  
  formatDate4API = dt => {
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + m + d;
    return result;
  };
  
  searchList = async (type = null) => {
    this.setState({is_loaded:false})
    let dateStr = this.state.search_date
      ? this.formatDate4API(this.state.search_date)
      : "";
    let apitxt = "/app/api/v2/order/prescription/prescriptions?";
    apitxt = apitxt + "page=accept_list&"
    apitxt =
      apitxt +
      (this.state.keyword != "" ? "keyword=" + this.state.keyword + "&" : "");
    apitxt = apitxt + (dateStr != "" ? "date=" + dateStr + "&" : "");
    apitxt =
      apitxt +
      (this.state.departmentStatus
        ? "department=" + this.state.departmentStatus + "&"
        : "department=0&");
    // apitxt =
    //   apitxt +
    //   (this.state.treatStatus
    //     ? "status=" + this.state.treatStatus + "&"
    //     : "status=0&");
    let state = this.state.state;
    if (state == 2) state = 3;
    else if (state == 3) state =2;
    apitxt = apitxt + "state=" + state + "&";
    let startDateStr = this.state.start_date
      ? this.formatDate4API(this.state.start_date)
      : "";
    apitxt = apitxt + "start_date=" + startDateStr + "&";
    apitxt =
      apitxt +
      (this.state.prescriptionType
        ? "type=" + this.state.prescriptionType
        : "type=0");
    apitxt =
      apitxt +
      (this.state.treatStatus == 2 ? "&all_medical_treatment_end=1" : "");
    const { data } = await axios.get(apitxt);
    // this.changeHistory(data);
    let result_data = [];
    if (data != null && data.length > 0) {
      result_data = data.filter(ele=>{
        if (ele.prescription.is_enabled == 1) {
          return ele;
        }
      });
    }
    var current_page = this.state.current_page;
    if (type == 'init') {
      current_page = 1;
    } else {
      if (Math.ceil(result_data.length/this.state.display_number) < current_page) current_page = Math.ceil(result_data.length/this.state.display_number);
    }
    this.setState({ table_list:result_data, is_loaded:true, current_page }, ()=>{
      if (this.init_table_list.length < result_data.length && JSON.stringify(apitxt) == JSON.stringify(this.search_condition)){
        this.assignFlashRecord();
      }
      this.init_table_list = result_data;
      this.search_condition = apitxt;
    });
    // return data;
  };
  
  assignFlashRecord = () => {
    this.state.table_list.map((item, index)=> {
      if (this.init_table_list[index] == undefined || item.number != this.init_table_list[index].number){
        item.new_added = 1;
      }
    })
    this.on_off = 1;
    this.flash_interval = this.on_time;
  }
  
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
  
  getIncludeNoDate = (name, value) => {
    if(name === 'include'){
      this.setState({no_date:value});
    }
  };
  
  onChangePage(pageOfItems, pager) {
    this.setState({ pageOfItems: pageOfItems, current_page:pager.currentPage});
  }

  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
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
  }
  
  goToPage = (url) => {
    this.props.history.replace(url);
  }
  
  btnClick=()=>{
    this.search_flag = true;
    this.searchList('init');
  };
  
  changeSearchFlag=()=>{
    this.search_flag = false;
  };
  
  getPrescriptionSelect = e => {
    this.setState({ prescriptionType: parseInt(e.target.id) });
  };
  
  getDepartmentSelect = e => {
    this.setState({ departmentStatus: parseInt(e.target.id) });
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
  
  render() {
    return (
      <PatientsWrapper>
        <div className="title-area flex" style={{borderBottomColor:this.title_border_bottom_color}}>
          <div className={'title'} style={{color:this.title_color, borderLeftColor:this.title_border_left_color}}>処方受付</div>
          {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
            <>
              <div className={'move-btn-area'}>
                <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
              </div>
            </>
          )}
        </div>
        <Flex>
          <div className={'d-flex'}>
            <SearchBar
              placeholder="患者ID / 患者名"
              search={this.search}
              enterPressed={this.enterPressed}
            />
            <SelectorWithLabel
              // options={(this.state.type == "guidance" || this.state.type == "home" || this.state.type == "spirit" ) ? STATUS_OPTIONS_NORECEPTION : STATUS_OPTIONS}
              options={STATUS_OPTIONS_NORECEPTION}
              title="実施状態"
              getSelect={this.getTreatSelect}
              departmentEditCode={this.state.state}
            />
            <div className="display_number">
              <SelectorWithLabel
                options={PER_PAGE}
                title="表示件数"
                getSelect={this.getDisplayNumber}
                departmentEditCode={this.state.display_number}
              />
            </div>
            <SelectorWithLabel
              options={prescriptionOptions}
              title="区分"
              getSelect={this.getPrescriptionSelect}
              departmentEditCode={
                prescriptionOptions[this.state.prescriptionType].id
              }
            />
            <SelectorWithLabel
              options={this.state.department_codes}
              title="診療科"
              getSelect={this.getDepartmentSelect}
              departmentEditCode={this.state.departmentStatus}
            />
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
              {(this.state.type === 'radiation') && (
                <div className="MyCheck">
                  <Radiobox
                    label="日未定のみ"
                    value={1}
                    getUsage={this.setDate.bind(this)}
                    checked={this.state.select_date_type === 1 ? true : false}
                    name={`date-set`}
                  />
                </div>
              )}
            </div>
            {(this.state.type === 'radiation') && (
              <div className={'include-no-date'}>
                <Checkbox
                  label={'日未定を含む'}
                  getRadio={this.getIncludeNoDate.bind(this)}
                  value={this.state.no_date}
                  name={`include`}
                />
              </div>
            )}
          </div>
        </Flex>
        <div style={{position:'relative'}}>
          <div className = 'reload-check'>
            <Checkbox
              label={'自動更新'}
              getRadio={this.getCheckBox.bind(this)}
              value={this.state.auto_reload}
              name={`auto_reload`}
            />
          </div>
        </div>       
        <PrescriptionTableList
          is_loaded={this.state.is_loaded}
          modal_title={this.state.modal_title}
          modal_type={this.state.type}
          prescription_type={this.state.prescriptionType}
          table_list={this.state.pageOfItems}
          refresh={this.searchList}
          reception_or_done={this.state.reception_or_done}
          goToPage={this.goToPage}
          keyword={this.state.keyword}
          search_flag={this.search_flag}
          changeSearchFlag={this.changeSearchFlag}
          ref = {this.table_ref}
          row_color={this.row_color}
          row_reception_color={this.row_reception_color}
          row_done_color={this.row_done_color}
        />
        <Pagination
          items={this.state.table_list}
          onChangePage={this.onChangePage.bind(this)}
          pageSize = {this.state.display_number}
          initialPage = {this.state.current_page}
        />                
      </PatientsWrapper>
    );
  }
}

PrescriptionAcceptList.contextType = Context;
PrescriptionAcceptList.propTypes = {
  history: PropTypes.object,
}
export default PrescriptionAcceptList;
