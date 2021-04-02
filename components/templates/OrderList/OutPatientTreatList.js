import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import TreatTableList from "./TreatTableList";
import SearchBar from "~/components/molecules/SearchBar";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import {formatDateLine, getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import auth from "~/api/auth";
import Pagination from "~/components/molecules/Pagination";
import {PER_PAGE, getAutoReloadInfo, getStatusRowColor} from "~/helpers/constants";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import Radiobox from "~/components/molecules/Radiobox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "~/components/molecules/Checkbox";
registerLocale("ja", ja);
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
  .include-no-date {
      padding-left: 10px;
      display:-ms-grid;
      .after-date-check{
          margin-top: -2rem;
      }
      label {
          font-size: 1rem;
          input {
              font-size: 1rem;
          }
      }
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

class OutPatientTreatList extends Component {
  constructor(props) {
    super(props);
    let auto_reload_data = getAutoReloadInfo("treatment_done");
    this.state = {
      examining: false,
      tableLIst: null,
      keyword: "",
      state: 1,
      inspection_id: 0,
      treat_date: new Date(),
      pageStatus: 1,
      limitStatus: 20,
      display_number: 20,
      start_date: '',
      select_date_type: 0,
      auto_reload: auto_reload_data.status != undefined ? auto_reload_data.status : 1,
      auto_reload_time: auto_reload_data.reload_time != undefined ? auto_reload_data.reload_time : 60,
      is_loaded:false,
      after_date: 0,
      initialPage: 1
    };
    this.search_flag = false;
    this.STATUS_OPTIONS = [
      {id: 0, value: "全て"},
      {id: 1, value: "未実施"},
      {id: 2, value: "実施"}
    ];
    this.search_flag = false;
    this.auto_reload_timer = undefined;
    this.flash_timer = undefined;
    
    this.timer_interval = auto_reload_data.reload_time;
    this.on_time = 3;
    this.off_time = 3;
    this.background = 'lightcoral';
    this.on_off = 1;
    if (auto_reload_data.on_time > 0) this.on_time = auto_reload_data.on_time;
    if (auto_reload_data.off_time > 0) this.off_time = auto_reload_data.off_time;
    if (auto_reload_data.background != undefined && auto_reload_data.background != '') this.background = auto_reload_data.background;
    this.search_condition = {};
    this.init_tableLIst = [];
    
    this.table_ref = React.createRef();
    this.timer_interval = 1000;
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    let karte_status = [{ id: 0, value: ""},{ id: 1, value: "外来"}];
    if (cache_ward_master !== undefined && cache_ward_master.length > 0) {
      cache_ward_master.map((item, index)=>{
        let push_item = {id: index + 2, value: "入院" + item.name, ward_id: item.number}
        karte_status.push(push_item);
      })
      this.karte_status = karte_status;
    }
    this.title_color = (auto_reload_data.title_color != undefined && auto_reload_data.title_color != "") ? auto_reload_data.title_color : "#000000";
    this.title_border_left_color = (auto_reload_data.title_border_left_color != undefined && auto_reload_data.title_border_left_color != "") ? auto_reload_data.title_border_left_color : "#69c8e1";
    this.title_border_bottom_color = (auto_reload_data.title_border_bottom_color != undefined && auto_reload_data.title_border_bottom_color != "") ? auto_reload_data.title_border_bottom_color : "#69c8e1";
    let status_row_color = getStatusRowColor('treatment_done');
    this.row_color = status_row_color.default != undefined ? status_row_color.default : "#FFFFFF";
    this.row_done_color = status_row_color.done != undefined ? status_row_color.done : "#FFFFFF";
  }
  
  componentWillUnmount() {
    clearInterval(this.auto_reload_timer);
    clearInterval(this.flash_timer);

    var panelGroup = document.getElementsByClassName('container')[0];
    this.purge(panelGroup);

    this.search_condition = {};
    this.init_tableLIst = [];
    this.table_ref = null;

    this.setState({
      tableLIst: null,      
    })
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
    localApi.setValue("system_next_page", "/outpatient_treat/order_list");
    localApi.setValue("system_before_page", "/outpatient_treat/order_list");
    await this.searchList();
    this.auto_reload_timer = setInterval(() => {
      if (this.state.auto_reload && this.table_ref.current != null){
        if (this.table_ref.current.state.isOpenModal === false && this.table_ref.current.state.isOpenKarteModeModal === false && this.table_ref.current.state.isOpenInspectionImageModal === false){
          this.searchList();
        }
      }
    }, this.timer_interval * this.state.auto_reload_time);
    this.flash_interval = this.on_off ==1? this.on_time:this.off_time;
    this.flash_timer = setInterval(() => {
      if (this.table_ref.current != null) {
        let modal_obj = document.getElementsByClassName("modal-dialog")[0];
        if (!this.table_ref.current.state.isOpenModal && !this.table_ref.current.state.isOpenKarteModeModal &&
          !this.table_ref.current.state.isOpenInspectionImageModal && modal_obj === undefined){
          if (this.on_off){
            if (this.state.tableLIst !== undefined && this.state.tableLIst != null && this.state.tableLIst.length > 0){
              this.state.tableLIst.map(item => {
                if (item.new_added) item.background = this.background; else delete item.background
              })
            }
          } else {
            if (this.state.tableLIst !== undefined && this.state.tableLIst != null && this.state.tableLIst.length > 0){
              this.state.tableLIst.map(item => {
                delete item.background
              })
            }
          }
          this.on_off = !this.on_off;
          this.flash_interval = this.on_off ==1? this.on_time:this.off_time;
          this.forceUpdate();
        }
      }
    }, this.flash_interval * 1000);
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  search = word => {
    word = word.toString().trim();
    this.setState({ keyword: word });
  };
  
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.search_flag = true;
      this.searchList();
    }
  };
  
  getTreatSelect = e => {
    this.setState({ state: parseInt(e.target.id) });
  };
  
  searchList = async (page_change = true) => {
    this.setState({is_loaded:false})
    let path = "/app/api/v2/master/treat/treatListByPatient";
    let post_data = {
      keyword:this.state.keyword,
      state:this.state.state,
      date:this.state.treat_date !== '' ? formatDateLine(this.state.treat_date) : '' ,
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '' ,
      hospitalized_flag: this.state.karte_status_code,
      after_date: this.state.after_date
    };
    if (this.state.karte_status_code >= 2) {
      post_data.hospitalized_flag = 2;
      post_data.first_ward_id = this.state.first_ward_id;
    }
    
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          let currentPage = 1;
          if (!page_change) {
            if (this.state.currentPage !== undefined && this.state.currentPage != null) currentPage = this.state.currentPage;
            if (res.length > 0 && Math.ceil(res.length / this.state.display_number) < currentPage) currentPage = Math.ceil(res.length / this.state.display_number);
          }
          this.setState({ tableLIst:res, is_loaded:true, initialPage: currentPage});
          if (this.init_tableLIst.length < res.length && JSON.stringify(post_data) == JSON.stringify(this.search_condition)){
            this.assignFlashRecord();
          }
          this.init_tableLIst = res;
          this.search_condition = post_data;
        }
      })
      .catch(() => {
      
      })
  };
  assignFlashRecord = () => {
    this.state.tableLIst.map((item, index)=> {
      if (this.init_tableLIst[index] == undefined || item.number != this.init_tableLIst[index].number){
        item.new_added = 1;
      }
    })
    this.on_off = 1;
    this.flash_interval = this.on_time;
  }
  
  onChangePage(pageOfItems, pager) {
    this.setState({ pageOfItems: pageOfItems, currentPage:pager.currentPage });
  }
  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };
  
  goToPage = (url) => {
    this.props.history.replace(url);
  }
  
  btnClick=()=>{
    this.search_flag = true;
    this.searchList();
  };
  
  changeSearchFlag=()=>{
    this.search_flag = false;
  };
  
  setDate = (e) =>{
    let treat_date = this.state.treat_date;
    let start_date = this.state.start_date;
    let {after_date} = this.state;
    if(parseInt(e.target.value) === 0){
      treat_date = new Date();
      start_date = '';
    } else {
      if (after_date == 1) {
        after_date = 0;
      }
    }
    if(parseInt(e.target.value) === 1){
      treat_date = "";
      start_date = '';
    }
    if(parseInt(e.target.value) === 2){
      if(treat_date === ''){
        treat_date = new Date();
      }
      start_date = new Date(treat_date.getFullYear(), treat_date.getMonth(), (treat_date.getDate() - 7));
    }
    
    this.setState({
      after_date,
      select_date_type:parseInt(e.target.value),
      treat_date,
      start_date
    })
  };
  
  getStartDate = value => {
    this.setState({
      start_date: value,
    });
  };
  
  moveDay = (type) => {
    let now_day = this.state.treat_date;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      treat_date: cur_day,
      select_date_type:0,
      start_date:"",
    });
  };
  
  selectToday=()=>{
    this.setState({
      treat_date: new Date(),
      select_date_type:0,
      start_date:"",
    });
  }
  
  getDate = value => {
    this.setState({
      treat_date: value,
    });
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
  getCheckBox = (name, value) => {
    this.setState({[name]: value});
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
        start_date
      });
    }
  };
  
  render() {
    return (
      <PatientsWrapper>
        <div className="title-area flex" style={{borderBottomColor:this.title_border_bottom_color}}>
          <div className={'title'} style={{color:this.title_color, borderLeftColor:this.title_border_left_color}}>処置実施</div>
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
              options={this.STATUS_OPTIONS}
              title="実施状態"
              getSelect={this.getTreatSelect}
              departmentEditCode={this.state.state}
            />
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
                    selected={this.state.treat_date}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="年/月/日"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    disabled={this.state.treat_date === '' ?  true : false}
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>
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
            </div>
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
        <TreatTableList
          tableLIst={this.state.pageOfItems}
          refresh={this.searchList}
          goToPage={this.goToPage}
          keyword={this.state.keyword}
          search_flag={this.search_flag}
          changeSearchFlag={this.changeSearchFlag}
          ref = {this.table_ref}
          row_color={this.row_color}
          row_done_color={this.row_done_color}
          is_loaded = {this.state.is_loaded}
        />
        <Pagination
          items={this.state.tableLIst}
          onChangePage={this.onChangePage.bind(this)}
          pageSize = {this.state.display_number}
          initialPage={this.state.initialPage}
        />
      </PatientsWrapper>
    );
  }
}

OutPatientTreatList.contextType = Context;
OutPatientTreatList.propTypes = {
  history: PropTypes.object,
}

export default OutPatientTreatList;