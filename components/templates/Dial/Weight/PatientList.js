import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import PatientInformation from "../modals/PatientInformation";
import PatientPopup from "../modals/PatientPopup";
import RadioButton from "~/components/molecules/RadioInlineButton";
import DatePicker, { registerLocale } from "react-datepicker";
import { formatJapanDate, getPrevDayByJapanFormat, getNextDayByJapanFormat, formatDateLine} from "~/helpers/date";
import DialSideBar1 from "../DialSideBar1";
import InputWeight from "./InputWeight";
import PropTypes from "prop-types";
// import {dial_status, pad} from "~/helpers/dialConstants";
import {dial_status} from "~/helpers/dialConstants";
import ja from "date-fns/locale/ja";
import Calculate from "~/components/templates/Dial/Weight/Calculate";
import SetBedNo from "./SetBedNo";
import renderHTML from 'react-render-html';
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import DoneGeneralModal from "~/components/templates/Dial/Board/molecules/DoneGeneralModal";
import {makeList_code, setDateColorClassName} from "~/helpers/dialConstants";
registerLocale("ja", ja);

import Spinner from "react-bootstrap/Spinner";
import * as localApi from "~/helpers/cacheLocal-utils";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 390px);
    left: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
    .bodywrap {
      height: calc(100vh - 8.125rem);
      overflow-y: auto;
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        margin-top: 0.625rem;
        text-align: center;
        button {
          text-align: center;
          background: rgb(105, 200, 225);
          border: none;
          margin-right: 1.875rem;
        }
        
        span {
          color: white;
          font-size: 1rem;
          font-weight: 100;
        }
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.25rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem;
  float: left;
  .flex {
    display: flex;
    flex-wrap: wrap;
    font-size: 1.5rem;
    .cur-date {
        text-align: center;
    }
  }
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-select {
      width: 8.75rem;
      font-size:1.25rem;
  }
  .pullbox-title {
    font-size:1.25rem;
  }

  .gender {
    margin-left: 0.3rem;
    .radio-btn label{
        width: 3.75rem;
        font-size: 1.25rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 2px;
        padding: 2px 3px;
    }
  }
  .prev-day {
    cursor: pointer;
    padding-right: 0.625rem;
  }
  .next-day {
    cursor: pointer;
    padding-left: 0.625rem;
  }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.5rem;
  width: 100%;
  height: calc( 100vh - 13.125rem);
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;
  overflow-y: auto;

  .alert-red{
    color: red;
  }
  label {
      text-align: right;
  }
  table {
    overflow-y: auto;
    width: 100%;
    tbody{
      text-align:center;
      width: 100%;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    th{
      font-size:1.2rem;
    }
    td {
      font-size:1.2rem;
      line-height: 1.875rem;
      padding: 0.3rem 0 0.3rem 0;
      text-align: center;
      vertical-align: middle;
      button {
        text-align: center;
        background: #ddd;
        border: solid 1px #aaa;
        margin-right: 0.625rem;
      }
    }
    .button-area {
      line-height: 1rem;
      button{
        width: 11.7rem;
        span{
            font-size:1.3rem;
        }
      }
    }
    .alert-danger {
      color: #721c24;
      background-color: #f8d7da !important;
      border-color: #f5c6cb !important;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .item-no {
      width: 3rem;
    }
    .btn-td {
      width: 11.7rem;
      font-size: 1rem;
    }
  }
  .va-m {
    vertical-align: middle;
    padding-left:2px;
    padding-right:2px;
  }
  .dw-area {
    cursor: pointer;
    color: #3f3ffb!important;
    text-decoration: underline!important;
  }

 `;
const display_order = [
  { id: 0, value: "ベッドNo", field_name:"sort_number" },
  { id: 1, value: "患者 ID", field_name:"sort_number" },
];

const ContextMenuUl = styled.ul`
.context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    border-bottom: 1px solid #cfcbcb;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;


const ContextMenu = ({visible,x,y,parent,favouriteMenuType
                     }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            {/*<div onClick={() => parent.contextMenuAction(favouriteMenuType,"cancel")}>取り消し</div>*/}
            <div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>変更</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};



class PatientList extends Component {
  static propTypes = {
    history: PropTypes.object,
    activeLink: PropTypes.string,
    gotoPage: PropTypes.func,
  };
  constructor(props) {
    super(props);
    let terminal_info = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let timing_codes = null;
    if (code_master != undefined && code_master != null){
      timing_codes = makeList_code(code_master['実施タイミング']);
    }
    
    let group_1 = "全て";
    if (terminal_info.terminal_info != null && terminal_info.terminal_info != undefined) {
      if (terminal_info.terminal_info.group_1 != null && terminal_info.terminal_info.group_1 != undefined && terminal_info.terminal_info.group_1 != "") {
        if (terminal_info.terminal_info.start_page != null && terminal_info.terminal_info.start_page != undefined && terminal_info.terminal_info.start_page == "予約一覧") {
          group_1 = terminal_info.terminal_info.group_1;
        }
      }
    }
    this.state = {
      schVal: "",
      list_item: [],
      isOpenCodeModal: false,
      medicine_type: 0,
      schedule_date: new Date(),  //日付表示
      timezone: 1,
      group_list: [],
      selected_group: group_1,
      select_index: 0,
      weightType:"",
      isopenSetBedNoModal: false,
      schedule_number:"",
      bed_no: "",
      search_order: 0,
      console: '',
      time_zone_list:getTimeZoneList(),
      timing_codes,
      isOpenInspectionDoneModal:false,
      is_loaded:false,
    }
    this._m_digits = 1;
    this.cnt_request = 0;
    this.cnt_response = 0;
  }
  
  // async UNSAFE_componentWillMount(){
  componentDidMount () {
    this.cnt_request = 0;
    this.cnt_response = 0;
    let cur_date = this.context.preserve_date;
    this.setState({
      schedule_date: cur_date == "" || cur_date == null && cur_date == undefined ? new Date() : new Date(cur_date),  //日付表示
    });
    this.getSearchResult(cur_date != "" && cur_date != undefined && cur_date != null ? cur_date : "");
    this.context.$updatePreserveDate("");
    this.getGroup1().then(result => {
      let group_list = [{ id: 0, value: "全て" }];
      let tmp = [];
      if (result != null && result != undefined && result.length > 0) {
        result.map((item, index)=>{
          tmp.push({id: index+1, value:item.value});
        });
      }
      group_list.concat(tmp);
      this.setState({group_list:group_list.concat(tmp)});
    })
  }
  
  getOrderSelect = e => {
    // this.setState({ display_order: parseInt(e.target.id) });
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getSearchResult();
    });
  };
  
  closeModal = () => {
    this.setState({
      isOpenCodeModal: false,
      isopenSetBedNoModal: false,
      isOpenInspectionDoneModal:false,
    });
  };
  
  closeBedModal = () => {
    this.setState({
      isopenSetBedNoModal: false,
    });
    this.getSearchResult();
  };
  
  saveEditedSchedule = async(updated_data, title) => {
    let post_data = {title:title, updated_data:updated_data, date:formatDateLine(this.state.schedule_date), system_patient_id:updated_data[0].system_patient_id};
    let path = "/app/api/v2/dial/schedule/update_done_status";
    await axios.post(path, {params:post_data})
      .then(() => {
        switch(title){
          case '検査':
            this.setState({
              done_inspection: updated_data,
              isOpenPopupModal: true,
            });
            break;
          // case '注射':
          //     this.setState({done_injection: updated_data});
          //     break;
          // case '透析中処方':
          //     this.setState({done_dial_pres: updated_data});
          //     break;
          // case '処方':
          //     this.setState({done_prescription: updated_data});
          //     break;
        }
        // this.check_done_status(title);
      });
  };
  
  onWeight = (selected_item) => {
    var patientInfo = selected_item;
    var status = patientInfo.status;
    var uncompleted_list = '';
    if (patientInfo.inspection_data != undefined && patientInfo.inspection_data.length>0){
      for(var i = 0; i< patientInfo.inspection_data.length;i++){
        var item = patientInfo.inspection_data[i];
        if(this.state.timing_codes != null){
          if (item.is_require_confirmation_before_weight_measurement && this.state.timing_codes[item.timing_code] == '透析前' && item.is_completed ==0 && status ==0){
            uncompleted_list +='「' + item.name +'」';
          }
          if (item.is_require_confirmation_before_weight_measurement && this.state.timing_codes[item.timing_code] == '透析終了後' && item.is_completed ==0 && status ==3){
            uncompleted_list +='「' + item.name +'」';
          }
        }
      }
      if (uncompleted_list != ''){
        this.setState({
          patientInfo: selected_item,
          isOpenInspectionDoneModal: true,
          done_inspection:patientInfo.inspection_data,
          uncompleted_list,
        })
      } else {
        this.setState({
          patientInfo: selected_item,
          isOpenPopupModal: true
        });
      }
    } else {
      this.setState({
        patientInfo: selected_item,
        isOpenPopupModal: true
      });
    }
    
  };
  
  selectTimezone = (e) => {
    this.setState({ timezone: parseInt(e.target.value)}, () => (
      this.getSearchResult()
    ));
  };
  
  getDate = value => {
    this.setState({
      schedule_date: value,
    }, () => {
      this.getSearchResult();
    });
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult();
    });
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult();
    });
  };
  
  handleOk = () => {
    // let patientList = this.state.list_item;
    // patientList[this.state.select_index] = info;
    this.setState({
      // list_item: patientList,
      isOpenCodeModal: false
    }, () => {
      this.getSearchResult();
    });
  };
  
  getSearchResult = async (sel_date) => {
    this.setState({
      is_loaded:false,
    })
    this.cnt_request++;
    let timezone = this.state.timezone;
    let context_patient = this.context.reserved_patient;
    if (sel_date != null && sel_date != undefined && sel_date != "") {
      this.setState({
        timezone: context_patient.timezone
      });
    }
    let cur_date = this.state.schedule_date ? formatDateLine(this.state.schedule_date) : "";
    let path = "/app/api/v2/dial/patient/reserved";
    let post_data = {
      timezone: sel_date != null && sel_date != undefined && sel_date != "" ? context_patient.timezone : timezone,
      cur_date: sel_date != null && sel_date != undefined && sel_date != "" ? sel_date : cur_date,
      sort_type: this.state.search_order == 1 ? "patient_id" : "bed_no",
      cnt_request: this.cnt_request,
    };
    // const { data } = await axios.post(path, {params: post_data});
    var data = [];
    axios.post(path, {params: post_data}).then(res => {
        this.cnt_response++;
        if(this.cnt_request == res.data.cnt_response) {
          this.cnt_request = 0;
          this.cnt_response = 0;
          data = res.data.data;
          this.setState({is_loaded:true, list_item:data});
        }
      })
      .catch((err) => {
        this.cnt_response++;
        if(this.cnt_request == err.data.cnt_response) {
          data = [];
          this.cnt_request = 0;
          this.cnt_response = 0;
          this.setState({is_loaded:true, list_item:data});
        }
      })
  };
  
  getGroup1 = async () => {
    
    let path = "/app/api/v2/dial/master/bed/getGroup1List";
    let post_data = {
    };
    const { data } = await axios.post(path, {params: post_data});
    return data;
  };
  
  closePopModal = () => {
    this.setState({isOpenPopupModal: false});
  };
  
  handlePopOk = (req) => {
    this.setState({
      isOpenPopupModal: false,
      // isInputWeight: true
    });
    let postData = this.state.patientInfo;
    postData.schedule_date = this.state.schedule_date;
    postData.wheelchair_today = req.wheelchair_today;
    this.context.$updateReservedPatient(postData);
    this.props.history.replace("/dial/weight/" + this.state.patientInfo.system_patient_id + "/inputweight");
  };
  
  calculate = (calcType) => {
    this.setState({
      isOpenPopupModal: false,
      // isCalculate: true,
      calcType: calcType,
    });
    let postData = this.state.patientInfo;
    postData.schedule_date = this.state.schedule_date;
    postData.calcType = calcType;
    this.context.$updateReservedPatient(postData);
    this.props.history.replace("/dial/weight/calculate");
  };
  
  InputWeightOk = (info) => {
    let status = 0;
    if( info.before_weight > 0) {
      status = 1;
    }
    if (info.after_weight > 0) {
      status = 4;
    }
    info.status= status;
    this.registerWeight(info);
    this.getSearchResult().then(() => {
      this.setState({
        isInputWeight: false
      });
    })
  };
  closeInputWeight = () => {
    this.setState({isInputWeight: false});
  };
  
  async registerWeight(info)  {
    let status = 0;
    if( parseFloat(info.before_weight) > 0) {
      status = 1;
    }
    if ( parseFloat(info.after_weight) > 0) {
      status = 4;
    }
    info.status= status;
    let path = "/app/api/v2/dial/patient/registerWeight";
    await axios
      .post(path, {
        params: info
      })
      .then(() => {
      
      })
      .catch(() => {
        // window.sessionStorage.setItem("alert_messages", "通信に失敗しました。");
      });
  }
  
  handleClick = (e, type) => {
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 200,
          y: e.clientY + window.pageYOffset
        },
        favouriteMenuType: type
      });
    }
  };
  
  contextMenuAction = (index, act) => {
    if (act === "cancel"){
      this.setState({
        patientInfo: this.state.list_item[index],
        isOpenCodeModal: true
      });
    } else if (act === "edit") {
      this.setState({
        patientInfo: this.state.list_item[index],
        isOpenCodeModal: true
      });
    }
  };
  
  changeWeightType = (type) => {
    let weightType = this.state.weightType;
    if (type == "calculateminusclothes"){
      if (weightType == "weight_clothes_1") {
        this.setState({weightType: "weight_clothes_2"});
      } else if(weightType == "weight_clothes_2"){
        this.setState({weightType: "weight_clothes_3"});
      } else {
        this.setState({weightType: "weight_clothes_1"});
      }
      // this.setState({weightType: "weight_clothes"});
    } else if (type == "recalculate"){
      if (weightType == "before_weight") {
        this.setState({weightType: "after_weight"});
      } else{
        this.setState({weightType: "before_weight"});
      }
    }
  }
  
  openSetBedNoModal = (schedule_number, bed_no, console) => {
    this.setState({
      schedule_number: schedule_number,
      bed_no: bed_no,
      console: console,
      isopenSetBedNoModal: true
    });
  }
  
  goPatternPage = (patient_id) => {
    // set current patient
    localApi.setValue("current_system_patient_id", patient_id);
    sessApi.delObjectValue("dial_setting","patient", "");
    sessApi.setObjectValue("dial_setting","patientById", patient_id);
    this.props.history.replace("/dial/pattern/dialPattern");
  };
  
  getStatus = (patientInfo) => {
    let status = patientInfo.status;
    // wheel_chair = 1
    if (patientInfo.wheel_chair == 1) {
      // ----------- 前体重
      // 車椅子のみ計測
      if ((patientInfo.weight_before_raw == null || patientInfo.weight_before_raw == "") && (patientInfo.before_weight == null || patientInfo.before_weight == "") && parseFloat(patientInfo.wheelchair_before) > 0 ) {
        let result = renderHTML("<span className='alert-red'>車済 / 体重計測未</span>");
        return result;
      }
      // 車椅子フラグがあって車椅子に乗った状態の体重だけ計測
      // if ((patientInfo.wheelchair_before == null || patientInfo.wheelchair_before == "") && parseFloat(patientInfo.weight_before_raw) > 0 && patientInfo.wheelchair_today ) {
      // if ((patientInfo.wheelchair_before == null || patientInfo.wheelchair_before == "") && (patientInfo.before_weight == null || patientInfo.before_weight == "") && parseFloat(patientInfo.weight_before_raw) > 0 ) {
      // wheelchair_before = 0 && (before_weight > 0 or weight_before_raw > 0)
      if ((patientInfo.wheelchair_before == null || patientInfo.wheelchair_before == "" || parseInt(patientInfo.wheelchair_before) == 0) && patientInfo.wheelchair_today == 0 && ((patientInfo.before_weight != null && patientInfo.before_weight != "" &&  parseFloat(patientInfo.before_weight) > 0) || parseFloat(patientInfo.weight_before_raw) > 0 )) {
        let result = renderHTML("<span className='alert-red'>体重計測済 / 車未</span>");
        return result;
      } else if((patientInfo.wheelchair_before == null || patientInfo.wheelchair_before == "") && patientInfo.wheelchair_today == 0 && parseFloat(patientInfo.weight_before_raw) > 0 ) {
        // 本日車椅子無し
        let result = renderHTML("<span className='alert-red'>体重計測済 / 車未</span>");
        return result;
      }
      
      // ----------- 後体重
      // 車椅子のみ計測
      if ((patientInfo.weight_after_raw == null || patientInfo.weight_after_raw == "") && (patientInfo.after_weight == null || patientInfo.after_weight == "") && parseFloat(patientInfo.wheelchair_after) > 0 ) {
        let result = renderHTML("<span>車済 / 体重計測未</span>");
        return result;
      }
      // 車椅子フラグがあって車椅子に乗った状態の体重だけ計測
      // if ((patientInfo.wheelchair_after == null || patientInfo.wheelchair_after == "") && (patientInfo.after_weight == null || patientInfo.after_weight == "") && parseFloat(patientInfo.weight_after_raw) > 0 ) {
      if ((patientInfo.wheelchair_after == null || patientInfo.wheelchair_after == "" || parseInt(patientInfo.wheelchair_after) == 0) && patientInfo.wheelchair_today == 0 && ((patientInfo.after_weight != null && patientInfo.after_weight != "" &&  parseFloat(patientInfo.after_weight) > 0) || parseFloat(patientInfo.weight_after_raw) > 0 )) {
        let result = renderHTML("<span>体重計測済 / 車未</span>");
        return result;
      } else if((patientInfo.wheelchair_after == null || patientInfo.wheelchair_after == "") && patientInfo.wheelchair_today == 0 && parseFloat(patientInfo.weight_after_raw) > 0 ) {
        // 本日車椅子無し
        let result = renderHTML("<span className='alert-red'>体重計測済 / 車未</span>");
        return result;
      }
      
    }
    return dial_status[status];
  }
  
  getGroupSelect = (e) => {
    this.setState({ selected_group: e.target.value});
  };
  
  goBedTable = () => {
    sessApi.setObjectValue("dial_bed_table", "schedule_date", formatDateLine(this.state.schedule_date));
    this.props.history.replace("/dial/others/bed_table");
  };
  
  convertDecimal = (_val, _digits) => {
    if (isNaN(parseFloat(_val))) return "";
    return parseFloat(_val).toFixed(_digits);
  }
  
  render() {
    let {list_item, group_list} = this.state;
    let list_item_by_group = list_item.filter(item=>{
      if (this.state.selected_group == "全て") {
        return item;
      } else if (item.group1 == this.state.selected_group) {
        return item;
      }
    });
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    
    return (
      <>
        <DialSideBar1
          selectWeight={this.changeWeightType}
          schedule_date={this.state.schedule_date ? formatDateLine(this.state.schedule_date) : ""}
        />
        <Card>
          <div className="title">予約患者一覧</div>
          <div className="bodywrap">
            <SearchPart>
              <div className="search-box">
                <div className="day-area flex">
                  <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.schedule_date}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                    customInput={<ExampleCustomInput />}
                  />
                  <div className="next-day" onClick={this.NextDay}>{" >"}</div>
                </div>
                <div className="gender">
                  {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                    this.state.time_zone_list.map((item)=>{
                      return (
                        <>
                          <RadioButton
                            id={`male_${item.id}`}
                            value={item.id}
                            label={item.value}
                            name="usage"
                            getUsage={this.selectTimezone}
                            checked={this.state.timezone === item.id ? true : false}
                          />
                        </>
                      );
                    })
                  )}
                  {/*<RadioButton*/}
                  {/*id="morning"*/}
                  {/*value={1}*/}
                  {/*label="午前"*/}
                  {/*name="timezone"*/}
                  {/*getUsage={this.selectTimezone}*/}
                  {/*checked={this.state.timezone === 1}*/}
                  {/*/>*/}
                  {/*<RadioButton*/}
                  {/*id="afternoon"*/}
                  {/*value={2}*/}
                  {/*label="午後"*/}
                  {/*name="timezone"*/}
                  {/*getUsage={this.selectTimezone}*/}
                  {/*checked={this.state.timezone === 2}*/}
                  {/*/><RadioButton*/}
                  {/*id="evening"*/}
                  {/*value={3}*/}
                  {/*label="夜間"*/}
                  {/*name="timezone"*/}
                  {/*getUsage={this.selectTimezone}*/}
                  {/*checked={this.state.timezone === 3}*/}
                  {/*/><RadioButton*/}
                  {/*id="night"*/}
                  {/*value={4}*/}
                  {/*label="深夜"*/}
                  {/*name="timezone"*/}
                  {/*getUsage={this.selectTimezone}*/}
                  {/*checked={this.state.timezone === 4}*/}
                  {/*/>*/}
                </div>
                <SelectorWithLabel
                  options={group_list}
                  title="グループ"
                  getSelect={this.getGroupSelect}
                  value={this.state.selected_group}
                />
                <SelectorWithLabel
                  options={display_order}
                  title="表示順"
                  getSelect={this.getOrderSelect}
                  departmentEditCode={display_order[this.state.search_order].id}
                />
              </div>
            </SearchPart>
            <Wrapper>
              {this.state.is_loaded == false && (
                <>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </>
              )}
              {this.state.is_loaded == true && (
                <>
                  <table className="table-scroll table table-bordered table-hover" id="code-table">
                    <thead>
                    <tr>
                      <th  className="item-no" style={{width:"2rem"}}/>
                      <th className="code-number" style={{width:"10.5rem"}}>ステータス</th>
                      <th className="code-number" style={{width:"9rem"}}>患者 ID</th>
                      <th className="name">患者名</th>
                      <th className="" style={{width:"6rem"}}>ベッドNo</th>
                      <th style={{width:"4.5rem"}}>DW</th>
                      <th style={{width:"11.7rem"}}>前体重(前体重 - DW)</th>
                      <th style={{width:"11.7rem"}}>後体重(後体重 - DW)</th>
                      <th className="btn-td"/>
                    </tr>
                    </thead>
                    <tbody>
                    {list_item_by_group !== undefined && list_item_by_group !== null && list_item_by_group.length > 0 && (
                      list_item_by_group.map((item, index) => {
                        if (item.dw == null ||item.dw == undefined) item.dw = 0;
                        return (
                          <>
                            {/*<tr onContextMenu={e => this.handleClick(e, index)}*/}
                            {/*className={item.before_weight === 0 && "alert-danger" }>*/}
                            <tr className={item.before_weight === 0 && "alert-danger" }>
                              <td className={'va-m text-right'}>{index+1}</td>
                              <td className="va-m text-left">{this.getStatus(item)}</td>
                              <td className={'va-m text-right'}>{item.id}</td>
                              <td className={'va-m text-left'}>{item.name}</td>
                              <td className={'va-m text-left'}>{item.bedNumber}</td>
                              { (item.dw !== 0 && item.dw !== '') ? (
                                <>
                                  <td className={'text-right'}>{this.convertDecimal(item.dw, this._m_digits)}</td>
                                </>
                              ) : (
                                <><td>
                                  <a className={'dw-area text-left'} onClick={()=>this.goPatternPage(item.system_patient_id)}>{'未設定'}</a>
                                </td>
                                </>
                              )}
                              <td className={'va-m text-right'}>
                                {item.before_weight !== null && item.before_weight !== undefined && item.before_weight !== 0 && (
                                  <>
                                    <span>{this.convertDecimal(item.before_weight, this._m_digits)}</span>
                                    {isNaN((parseFloat(item.before_weight)-item.dw).toFixed(1)) ? (
                                      <span></span>
                                    ):(
                                      <span>({(parseFloat(item.before_weight)-item.dw).toFixed(1)})</span>
                                    )}
                                  </>
                                )}
                              </td>
                              <td className={'va-m text-right'}>
                                {item.after_weight !== null && item.after_weight !== undefined && item.after_weight !== 0 && (
                                  <>
                                    <span>{this.convertDecimal(item.after_weight, this._m_digits)}</span>
                                    {isNaN((parseFloat(item.after_weight)-item.dw).toFixed(1)) ? (
                                      <span></span>
                                    ):(
                                      <span>({(parseFloat(item.after_weight)-item.dw).toFixed(1)})</span>
                                    )}
                                  </>
                                )}
                              
                              </td>
                              { (item.bed_no === 100 || item.console === 100) ? (
                                <>
                                  <td className="button-area va-m"><Button type="mono" onClick={()=>this.openSetBedNoModal(item.schedule_number, item.bed_no, item.console)} >ベッドNo設定</Button>
                                    {/*<Button onClick={()=>this.onDetail(index)}>入 力</Button>*/}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="button-area va-m"><Button type="mono" onClick={()=>this.onWeight(item)}>体重計測</Button>
                                    {/*<Button onClick={()=>this.onDetail(index)}>入 力</Button>*/}
                                  </td>
                                </>
                              )}
                            </tr>
                          </>)
                      })
                    )}
                    </tbody>
                  </table>
                </>
              )}
            </Wrapper>
          </div>
          {/*<div className="footer">*/}
          {/*    <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>患者検索</Button>*/}
          {/*    <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>帳票プレビュー</Button>*/}
          {/*    <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>登録</Button>*/}
          {/*</div>*/}
          {this.state.isOpenCodeModal && (
            <PatientInformation
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              patientInfo={this.state.patientInfo}
            />
          )}
          {this.state.isOpenPopupModal && (
            <PatientPopup
              calculateInfo ={this.calculate}
              handleOk={this.handlePopOk}
              closeModal={this.closePopModal}
              patientInfo={this.state.patientInfo}
              schedule_date={this.state.schedule_date}
            />
          )}
          {this.state.isInputWeight && (
            <InputWeight
              handleOk={this.InputWeightOk}
              closeModal={this.closeInputWeight}
              patientInfo={this.state.patientInfo}
              schedule_date={this.state.schedule_date}
            />
          )}
          {this.state.isCalculate && (
            <Calculate
              // handleOk={this.InputWeightOk}
              weightType={this.state.weightType}
              closeModal={this.closeInputWeight}
              patientInfo={this.state.patientInfo}
              schedule_date={this.state.schedule_date}
              calcType={this.state.calcType}
              selectWeight={this.changeWeightType}
            />
          )}
          {this.state.isopenSetBedNoModal && (
            <SetBedNo
              handleOk={this.handleOk}
              closeModal={this.closeBedModal}
              schedule_number={this.state.schedule_number}
              bed_no={this.state.bed_no}
              console={this.state.console}
              cur_date={this.state.schedule_date}
              goBedTable={this.goBedTable}
            />
          )}
          
          {this.state.isOpenInspectionDoneModal && (
            <DoneGeneralModal
              done_list={this.state.done_inspection}
              modal_title ="検査"
              closeModal={this.closeModal}
              saveEditedSchedule={this.saveEditedSchedule}
              uncompleted_list = {this.state.uncompleted_list}
            />
          )}
          
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
        </Card>
      </>
    )
  }
}

PatientList.contextType = Context;
export default PatientList