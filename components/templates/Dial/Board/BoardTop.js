import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import SelectPatientModal from "./molecules/SelectPatientModal"
import TerminalSettingModal from "./molecules/TerminalSettingModal"
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatJapanDate, formatJapan, formatDateLine} from "~/helpers/date";
import Clock from './Clock';
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { getTimeZoneIndex } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import EditPrescript from "./molecules/EditPrescript";
import EditManageMoneyModal from "~/components/templates/Dial/Schedule/modals/EditManageMoneyModal";
import EditInjectionModal from "~/components/templates/Dial/Schedule/modals/EditInjectionModal";
import {makeList_code, setDateColorClassName} from "~/helpers/dialConstants";
registerLocale("ja", ja);

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 5rem;
  float: left;
  margin-bottom: 5px;
  padding: 0.5rem 1.25rem;
  border: 1px solid #ddd;
  margin-top: -5px;
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .patient-name {
    width: 21%;
    cursor: pointer;
    .no-patient {
        font-size: 1.25rem;
        margin-top: 6px;
    }
  }
  .prev-day{
    font-size: 1.5rem;
    cursor: pointer;
    line-height:2.5rem;
    // margin-right: 1rem;    
   }
   .next-day {
    font-size: 1.5rem;
    cursor: pointer;
    line-height:2.5rem;
    // margin-left: 1rem;
  }  
  .morning {    
    font-size: 1.25rem;
    padding-top: 8px;
    cursor: pointer;
  }
  .bed-reserve {    
    font-size: 1.1rem;
    // cursor: pointer;
  }
  .noOpacity {
    font-size: 1.25rem;
    // padding-top: 8px;
    opacity: 0 !important;
    cursor: default !important;
  }
  .react-datepicker-wrapper .cur-date {
    font-size: 1.5rem;
    cursor: pointer;
  }
  .clock-area {
    width:12rem;
    .cur-date-time {
      font-size: 1.2rem;
      text-align: right;
    }
    .clock {
      padding-top: 0.5rem;
      font-size: 1rem;
      text-align: right;
    }
  }
  label {
      text-align: right;
  }
  .button-group {
    padding-top: 1rem;
    display: flex;
    margin-right:2rem;
    p {
        border: solid 1px;        
        margin-right: 5px;
        opacity:0.5;
    }
  }
  
  .circle {
    border-radius: 2.2rem;
    // padding: 0px 5px;
    padding: 0.2525rem 0.3025rem 0.3125rem 0.2rem !important;
    background: none;
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.25rem;
    line-height: 1.575rem;
    text-align: center;    
  }
  .circle-1{
    border-radius: 2.2rem;
    // padding: 0px 5px;
    padding: 0.4525rem 0.3025rem 0.3125rem 0.2rem !important;
    background: none;
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.25rem;
    line-height: 1.575rem;
    text-align: center;    
  }
  .exist{
    cursor: pointer!important;
    opacity:1!important;
    border: solid 3px!important;
    padding: 0.1rem 0.3025rem 0.3125rem 0.2rem !important;
    line-height: 1.575rem;
    text-align: center;    
  }
  .exist-1{
    cursor: pointer!important;
    opacity:1!important;
    border: solid 3px!important;
    padding: 0.25rem 0.3025rem 0.3125rem 0.2rem !important;
    line-height: 1.575rem;
    text-align: center;  
  }
  .move-dial {
    border-right: 1px solid #aaa;
    padding-right: 2rem;
    margin-bottom: 0.5rem;
  }
  .prev-after-dial {
    font-size: 1rem;
    cursor: pointer;
    border:1px solid #aaa;
    // width: 8rem;
    opacity: 0.8;
  }
  .select-date {
    padding-left: 2rem;
  }
  .example-custom-input {
   font-size: 1rem;   
   margin: 0 10px;
  }
.no_today {
    background: #efe;
}
.normal{
    width: 100%;
    border: solid 1px red;
}

`;

const Kana = styled.div`
 font-family: NotoSansJP;
 font-size: 1.2rem;
 width: 25rem;
 // line-height: 1;
 // padding-bottom: 4px;
`;
const PatientName = styled.div`
  font-family: NotoSansJP;
  font-size: 1.5rem;
  font-weight: bold;  
`;

const TooltipMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 35rem;
    opacity: 0.8;
    border: 2px solid #807f7f;
    border-radius: 12px;
  }
  .tooltip-item{
    display: flex;
  }
  .item-title{
    width: 7rem;
    text-align: right;
    padding: 5px 6px !important;
  }
  .item-content{
    width: 13rem;
    word-break: break-all;
  }
  .tooltip-content-area{
    line-height: 1rem;
    background: #050404;
    color: white;
  }
  .context-menu li {
    font-size: 1rem;
    line-height: 1.875rem;
    clear: both;
    color: black;
    cursor: pointer;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    border-bottom: solid 1px #888;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #3c3c87;
    color: white;
  }
`;

const Tooltip = ({visible,x,y,tooltip_content}) => {
  if (visible) {
    return (
      <TooltipMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className="tooltip-content-area">
              {tooltip_content['patient_name']!= undefined && tooltip_content['patient_name'] != null && tooltip_content['patient_name'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title">患者氏名:</div>
                  <div className="item-content">{tooltip_content['patient_name']}</div>
                </div>
              )}
              {tooltip_content['kana_name']!= undefined && tooltip_content['kana_name'] != null && tooltip_content['kana_name'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title">カナ氏名:</div>
                  <div className="item-content">{tooltip_content['kana_name']}</div>
                </div>
              )}
              {tooltip_content['primary_disease'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title">原疾患:</div>
                  <div className="item-content">{tooltip_content['primary_disease']}</div>
                </div>
              )}
              {tooltip_content['dial_start_date'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title">透析導入日:</div>
                  <div className="item-content">{tooltip_content['dial_start_date']}</div>
                </div>
              )}
              {tooltip_content['dial_history'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title"></div>
                  <div className="item-content">(透析歴{tooltip_content['dial_history']})</div>
                </div>
              )}
              {tooltip_content['birthday'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title">生年月日:</div>
                  <div className="item-content">{tooltip_content['birthday']}</div>
                </div>
              )}
              {tooltip_content['blood_type'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title">血液型:</div>
                  <div className="item-content">{tooltip_content['blood_type']}</div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </TooltipMenuUl>
    );
  } else {
    return null;
  }
};
const dial_default_color = {
  
  "1":{
    "1":{"header_back":"#FFCCCC","header_font":"#000000", "cell_back":"#FFCCCC"},
    "2":{"header_back":"#99CCFF","header_font":"#000000", "cell_back":"#99CCFF"},
    "4":{"header_back":"#CCFFCC","header_font":"#000000", "cell_back":"#CCFFCC"}
  },
  "3":{
    "1":{"header_back":"#FFCCCC","header_font":"#000000", "cell_back":"#FFCCCC"},
    "2":{"header_back":"#99CCFF","header_font":"#000000", "cell_back":"#99CCFF"},
    "4":{"header_back":"#CCFFCC","header_font":"#000000", "cell_back":"#CCFFCC"}
  },
  "5":{
    "1":{"header_back":"#FFCCCC","header_font":"#000000", "cell_back":"#FFCCCC"},
    "2":{"header_back":"#99CCFF","header_font":"#000000", "cell_back":"#99CCFF"},
    "4":{"header_back":"#CCFFCC","header_font":"#000000", "cell_back":"#CCFFCC"}
  },
  "2":{
    "1":{"header_back":"#FFFFCC","header_font":"#000000", "cell_back":"#FFFFCC"}
  },
  "4":{
    "1":{"header_back":"#FFFFCC","header_font":"#000000", "cell_back":"#FFFFCC"}
  },
  "6":{
    "1":{"header_back":"#FFFFCC","header_font":"#000000", "cell_back":"#FFFFCC"}
  },
  "default":{
    "header_back":"#EEEEEE",
    "header_font":"#000000",
    "cell_back":"#EEEEEE",
    "cell_font":"#000000",
    "cell_highlight_font":"#FF0000",
    "cell_highlight_border":"#FF0000"
  },
  "disabled":{
    "header_back":"#000000",
    "header_font":"#FFFFFF"
  }
};

const dial_color = JSON.parse(window.sessionStorage.getItem("init_status")) != undefined ? JSON.parse(window.sessionStorage.getItem("init_status")).dial_color : dial_default_color;

class BoardTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientId:0,
      patientInfo: this.props.patientInfo,
      timezone: this.props.timezone,  //時間帯
      schedule_date:new Date(),  //日付表示
      openTerminalSettingModal:false,
      today: '',
      today_font: '',
      isShowInjectionModal:false,
      isShowInspectionModal:false,
      isShowPrescriptionModal:false,
      isShowManageModal:false,
      time_zone_list:getTimeZoneIndex(),      
    };
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  }
  
  async componentDidMount () {
    // let server_time = await getServerTime();
    this.setState({schedule_date:new Date()});
    this.setHeaderColor();
  }
  
  componentWillUnmount (){
    clearInterval(this.reloadInterval);

    // initialize
    this.authInfo = null;
  }
  
  setHeaderColor = () =>{
    let cur_date = this.state.schedule_date;
    let cur_timezone = this.state.timezone;
    let week_number = cur_date.getDay();
    let today_color = dial_color['default']['header_back'];
    let today_font_color = dial_color['default']['header_font'];
    
    if (dial_color[week_number] != undefined && dial_color[week_number][cur_timezone] != undefined && dial_color[week_number][cur_timezone]['header_back'] != undefined
      && dial_color[week_number][cur_timezone]['header_back'] != '') {
      today_color = dial_color[week_number][cur_timezone]['header_back'];
    }
    
    if (dial_color[week_number] != undefined && dial_color[week_number][cur_timezone] != undefined && dial_color[week_number][cur_timezone]['header_font'] != undefined
      && dial_color[week_number][cur_timezone]['header_font'] != '') {
      today_font_color = dial_color[week_number][cur_timezone]['header_font'];
    }
    // if(week_number === 1 || week_number === 3 || week_number === 5 ){
    //     if(cur_timezone === 0){
    //         today_color = dial_color[week_number][1]['header_back'];
    //     }
    //     if(cur_timezone === 1){
    //         today_color = dial_color[week_number][2]['header_back'];
    //     }
    //     if(cur_timezone === 3){
    //         today_color = dial_color[week_number][4]['header_back'];
    //     }
    // } else {
    //     if(cur_timezone === 0){
    //         today_color = dial_color[week_number][1]['header_back'];
    //         today_font_color = dial_color[week_number][1]['header_font'];
    //     }
    // }
    // }
    
    this.setState({
      today: today_color,
      today_font: today_font_color,
    });
  };
  
  async UNSAFE_componentWillReceiveProps(nextProps) {
    this.show_patient_name = 0;    
    if(nextProps.schedule_date != null && nextProps.schedule_date != this.state.schedule_date) {
      // var server_time = await getServerTime();
      this.setState({
        schedule_date: new Date(nextProps.schedule_date),
        // server_time,
      },()=>{
        this.setHeaderColor();
      })
    }
    if(nextProps.timezone != this.state.timezone) {
      this.setState({
        timezone: nextProps.timezone
      },()=>{
        this.setHeaderColor();
      })
    }
    if (nextProps.change_timezone != undefined && nextProps.change_timezone != null && this.state.change_timezone != nextProps.change_timezone && nextProps.change_timezone === 1){
      this.setState({change_timezone:nextProps.change_timezone});
      this.getTimezone(false);
      if (!(nextProps.change_patient !== undefined && nextProps.change_patient == true)){
        return;
      }
    }
    if (this.state.patientInfo != undefined && this.state.patientInfo != null) {
      if (this.state.patientInfo.system_patient_id === nextProps.patientInfo.system_patient_id) {
        if (!(nextProps.change_patient !== undefined && nextProps.change_patient == true)){
          return;
        }
      }
    }
    
    this.setState({
      patientInfo: nextProps.patientInfo,
    });
    
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data")
    if (schedule_data !== undefined && schedule_data!=null) {
      if (schedule_data.pre_start_confirm_at !== undefined && schedule_data.pre_start_confirm_at != null && schedule_data.pre_start_confirm_by_name !== undefined) {
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 1);
      } else {
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 0);
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "check_values", {});
      }
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "patient", nextProps.patientInfo);
    sessApi.setObjectValue("dial_setting", "patient", nextProps.patientInfo);
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_date", formatDateLine(nextProps.schedule_date));
  }
  
  nameClick =() => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    // if(this.props.patient_list != undefined && this.props.patient_list != null && this.props.patient_list.length > 0)
    this.setState({patientListModal: true});
  };
  
  closeModal = () => {
    this.setState({
      patientListModal: false,
      isShowInjectionModal:false,
      isShowInspectionModal:false,
      isShowPrescriptionModal:false,
      isShowManageModal:false,
    });
  };
  
  showPrescriptionModal = () => {
    if (this.props.schedule_exist_status.prescription == 0) return;
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.setState({isShowPrescriptionModal:true})
  }
  
  showInjectionModal = () => {
    if (this.props.schedule_exist_status.injection == 0 || this.props.temporary_injection_schedule == undefined || this.props.temporary_injection_schedule == null || this.props.temporary_injection_schedule.length == 0) return;
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.setState({isShowInjectionModal:true})
  }
  
  showInspectionModal = () => {
    if (this.props.schedule_exist_status.inspection == 0) return;
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.setState({isShowInspectionModal:true})
  }
  
  showManageModal = () => {
    if (this.props.schedule_exist_status.manage == 0) return;
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.setState({isShowManageModal:true})
  }
  
  closeStaffModal = () => {
    this.setState({
      openTerminalSettingModal:false,
    });
  };
  
  getPatient = (patientInfo) => {
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "patient", patientInfo);
    sessApi.setObjectValue("dial_setting", "patient", patientInfo);
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_date", formatDateLine(this.state.schedule_date));
    this.setState({
      patientListModal: false
    }, () => {
    });
    this.props.setPatient(patientInfo);
  };
  
  getTimezone = (auth_check=true) => {
    if(auth_check) {
      if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    }
    let cur_timezone = this.state.timezone;
    let {time_zone_list} = this.state;
    let index = time_zone_list.findIndex(x=>x.id===cur_timezone);
    let timezone_index = (index+1)%(time_zone_list.length);
    this.setState({
      timezone:time_zone_list[timezone_index].id
    },()=>{
      this.setHeaderColor();
      this.props.setTimezone(time_zone_list[timezone_index].id);
    });
  };
  getDate = value => {
    this.setState({
      schedule_date: value,
    }, () => {
      this.setHeaderColor();
      this.props.setSchDate(value);
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_date", formatDateLine(this.state.schedule_date));
    });
  };
  dateClick = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
  }
  
  PrevDay = () => {
    // let now_day = this.state.schedule_date;
    // let cur_day = getPrevDayByJapanFormat(now_day);
    // this.setState({
    //     schedule_date: cur_day,
    // }, () => {
    //     this.setHeaderColor();
    //     this.props.setSchDate(cur_day);
    //     sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_date", formatDateLine(this.state.schedule_date));
    // });
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let {patientInfo} = this.state;
    let {before_schedule_date} = this.props;
    if(patientInfo !== undefined && patientInfo != null && patientInfo.id > 0 && before_schedule_date != null) {
      this.props.beforeDial();
    }
  };
  
  NextDay = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let {patientInfo} = this.state;
    let {after_schedule_date} = this.props;
    if(patientInfo !== undefined && patientInfo != null && patientInfo.id > 0 && after_schedule_date != null) {
      this.props.afterDial();
    }
    // let now_day = this.state.schedule_date;
    // let cur_day = getNextDayByJapanFormat(now_day);
    // this.setState({
    //     schedule_date: cur_day,
    // }, () => {
    //     this.setHeaderColor();
    //     this.props.setSchDate(cur_day);
    //     sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_date", formatDateLine(this.state.schedule_date));
    // });
  };
  
  onTodayClick = async() => {
    // let server_time = await getServerTime();
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.setState({
      schedule_date: new Date(),
    }, () => {
      this.setHeaderColor();
      this.props.setSchDate(this.state.schedule_date);
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "schedule_date", formatDateLine(this.state.schedule_date));
      
    })
  };
  
  handleOk = () => {
    this.closeModal();
    this.props.handleOk(this.state.patientInfo.system_patient_id, this.state.schedule_date);
  };
  
  showTimeZoneName = () => {
    let {time_zone_list, timezone} = this.state;
    let item = time_zone_list.find(x=>x.id===timezone);
    if (item == undefined || item == null) return '';
    var timezone_name = item .value;
    if (timezone_name < 0 ) return "";
    return timezone_name;
  };
  
  editTooltip = async(e, tooltip_type) => {
    if (this.state.patientInfo == null ||
      this.state.patientInfo == undefined ||
      Object.keys(this.state.patientInfo).length <= 0) {
      return;
    }
    
    let content = this.makeTooltipContent(this.state.patientInfo, tooltip_type);
    this.setState({
      tooltip: {
        visible: true,
        x: e.clientX,
        y: e.clientY+window.pageYOffset + 20,
      },
      tooltip_content:content,
      tooltip_type,
    });
  };
  
  hideTooltip = () => {
    this.setState({ tooltip: { visible: false} });
  };
  
  makeTooltipContent = (data, tooltip_type) => {
    let result = [];
    if (tooltip_type == "patient") {
      if(this.show_patient_name == 1) {
        result['patient_name'] = data.patient_name;
        result['kana_name'] = data.kana_name;
      }
      
      result['primary_disease'] = "";
      if (data.primary_disease != "") {
        result['primary_disease'] = this.getDiseaseById(data.primary_disease);
      }
      
      result['dial_start_date'] = "";
      if (data.dial_start_date != null && data.dial_start_date != "") {
        result['dial_start_date'] = formatJapan(data.dial_start_date);
      }
      
      result['dial_history'] = "";
      if (data.dial_history != null && data.dial_history != "" && data.dial_history > 0) {
        result['dial_history'] = this.calcDialHistory(data.dial_history);
      }
      
      result['birthday'] = "";
      if (data.birthday != null && data.birthday != "") {
        result['birthday'] = formatJapan(data.birthday) +"(" + data.age + "歳)";
      }
      
      result['blood_type'] = "";
      let rh = data.RH == 0 ? "+" : data.RH == 1 ? "-" : "";
      let blood_type = this.getBloodType(data.blood_type);
      result['blood_type'] = blood_type;
      if (blood_type != "" && rh != "") {
        result['blood_type'] = this.getBloodType(data.blood_type) + "(" + rh + ")";
      }
    }
    return result;
  };
  
  getBloodType = (blood_type) => {
    let result = "";
    switch(blood_type){
      case 0:
        result = "A";
        break;
      case 1:
        result = "B";
        break;
      case 2:
        result = "O";
        break;
      case 3:
        result = "AB";
        break;
    }
    return result;
  }
  
  getDiseaseById = (primary_disease_id) => {
    let result = "";
    if (primary_disease_id != null && primary_disease_id != undefined && primary_disease_id != "") {
      let code_master = sessApi.getObjectValue("dial_common_master","code_master");
      let primary_disease_codes = makeList_code(code_master['原疾患']);
      if (primary_disease_codes != null && primary_disease_codes != undefined && Object.keys(primary_disease_codes).length > 0) {
        Object.keys(primary_disease_codes).map((id) =>{
          if (id == primary_disease_id) {
            result = primary_disease_codes[id];
          }
        });
      }
    }
    return result;
  }
  
  calcDialHistory = (nMonths) => {
    if (nMonths > 0) {
      let nYear = parseInt(nMonths/12);
      let nMonth = nMonths % 12;
      let res = "";
      if (nYear > 0) {
        res = nYear + "年";
      }
      if (nMonth > 0) {
        res = res + nMonth + "ヶ月";
      }
      return res;
    }
    return "";
  };
  getPatientName(patient_name){
    let patientName = patient_name;
    var d = patientName.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)});
    var nLength = d.length;
    let half_i = 0;
    // var kanaregexp = new RegExp('[\uff00-\uff9f]');
    var kanaregexp = /[Ａ-Ｚａ-ｚ０-９]/g;
    if(kanaregexp.test(patientName) != true){
      nLength = nLength * 2;
    } else {
      nLength = 0;
      for (let i = 0; i < patientName.length; ++i) {
        if(kanaregexp.test(patientName[i]) != true){
          nLength += 2;
        } else {
          nLength += 1;
        }
        if (half_i == 0 && nLength > 20){
          half_i = i;
        }
      }
    }
    if (nLength > 20) {
      if (half_i > 0){
        patientName = patientName.substring(0,half_i) + "…";
      } else {
        patientName = d.substring(0,9) + '…';
      }
      this.show_patient_name = 1;
    }
    return patientName;
  }
  
  
  render() {
    let {patientInfo} = this.state;
    let {schedule_exist_status} = this.props;
    // let {after_schedule_date, before_schedule_date} = this.props;    
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <>
        <Wrapper style={{background: `${this.state.today}`, color: `${this.state.today_font}`}}>
          <div
            className="patient-name"
            onClick={this.nameClick}
            // onMouseOver={e=>this.editTooltip(e,"patient")}
            // onMouseOut={this.hideTooltip}
          >
            {patientInfo != undefined && patientInfo != null && patientInfo.id > 0 ? (
              <>
                <Kana>{patientInfo.patient_number} &nbsp; {this.getPatientName(patientInfo.kana_name)}</Kana>
                <PatientName>{this.getPatientName(patientInfo.patient_name)}</PatientName>
              </>
            ) : (
              <><div className="no-patient">患者未選択</div></>
            )}
          </div>
          <div className="d-flex">
            <div className="button-group">
              <p className={schedule_exist_status.prescription?"exist circle":"circle"} onClick={this.showPrescriptionModal.bind(this)}>処</p>
              <p className={schedule_exist_status.injection?"exist circle":"circle"} onClick={this.showInjectionModal.bind(this)}>注</p>
              <p className={schedule_exist_status.inspection?"exist circle":"circle"} onClick={this.showInspectionModal.bind(this)}>検</p>
              <p className={schedule_exist_status.manage?"exist circle":"circle"} onClick={this.showManageModal.bind(this)}>管</p>
              <p className={schedule_exist_status.others?"exist circle":"circle"}>他</p>
            </div>
            {/* <div className={'move-dial'} style={{border:(!((patientInfo !== undefined && patientInfo != null && patientInfo.id > 0) &&(before_schedule_date != null || after_schedule_date != null)) ? "none" : "")}}>
                      {patientInfo !== undefined && patientInfo != null && patientInfo.id > 0 && before_schedule_date != null ? (
                          <div className="prev-after-dial" style={{textAlign:"left"}} onClick={this.props.beforeDial}>&nbsp; &nbsp; &nbsp;{'< 前回透析'}&nbsp; &nbsp; &nbsp; &nbsp;</div>
                      ):(
                          <div className="prev-after-dial noOpacity">前回透析</div>
                      )}
                      {patientInfo !== undefined && patientInfo != null && patientInfo.id > 0 && after_schedule_date != null ? (
                          <div className="prev-after-dial" style={{marginTop:"0.5rem", textAlign:"right"}} onClick={this.props.afterDial}>&nbsp; &nbsp; &nbsp; &nbsp;{'次回透析 >'} &nbsp; &nbsp; &nbsp;</div>
                      ):(
                          <div className="prev-after-dial noOpacity">次回透析</div>
                      )}
                    </div> */}
            <div className={'select-date'}>
              <div className={'flex justify-content'}>
                <div className={`bed-reserve`}>[ <span style={{color:"rgb(54, 111, 163)"}}>{(this.props.bed_name !== undefined && this.props.bed_name != null) ? this.props.bed_name : ""}</span> ] ベッド予定</div>
                {formatDateLine(this.state.schedule_date) !== formatDateLine(new Date()) && (
                  <div className={`bed-reserve`} style={{cursor:"pointer"}} onClick={this.onTodayClick.bind(this)}>本日へ戻る</div>
                )}
              </div>
              <div className={'flex'} style={{marginTop:"0.1rem"}}>
                <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
                <div onClick={this.dateClick}>
                <DatePicker
                  locale="ja"
                  selected={this.state.schedule_date}
                  onChange={this.getDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={<ExampleCustomInput />}
                  disabled={this.authInfo === undefined || this.authInfo == null}
                  dayClassName = {date => setDateColorClassName(date)}
                />
                </div>
                <div className="next-day" onClick={this.NextDay}>{" >"}</div>
              </div>
            </div>
          </div>
          <div className="morning" style={{paddingTop:"1rem"}} onClick={this.getTimezone}>{this.showTimeZoneName()}</div>
          <Clock />
          {this.state.patientListModal && (
            <SelectPatientModal
              patientList={this.props.patient_list}
              closeModal={this.closeModal}
              getPatient={this.getPatient}
            />
          )}
          {this.state.isShowPrescriptionModal && (
            <EditPrescript
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              schedule_item = {this.props.temporaray_prescription_schedule}
              editPrescriptType={1}
              patientInfo = {this.state.patientInfo}
              schedule_date={formatDateLine(this.state.schedule_date)}
            />
          )}
          {this.state.isShowInjectionModal && (
            <EditInjectionModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              schedule_item= {this.props.temporary_injection_schedule}
              is_temporary={1}
            />
          )}
          {this.state.isShowInspectionModal && (
            <SelectPatientModal
              patientList={this.props.patient_list}
              closeModal={this.closeModal}
            />
          )}
          {this.state.isShowManageModal && (
            <EditManageMoneyModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              schedule_item = {this.props.manage_schedule}
            />
          )}
          {this.state.openTerminalSettingModal && (
            <TerminalSettingModal
              closeModal={this.closeStaffModal}
            />
          )}
        </Wrapper>
        <Tooltip
          {...this.state.tooltip}
          parent={this}
          tooltip_content={this.state.tooltip_content}
          tooltip_type={this.state.tooltip_type}
        />
      </>
    )
  }
}

BoardTop.contextType = Context;

BoardTop.propTypes = {
  patient_list: PropTypes.array,
  patientInfo: PropTypes.object,
  setPatient: PropTypes.func,
  tabChange: PropTypes.func,
  setSchDate: PropTypes.func,
  setTimezone: PropTypes.func,
  schedule_exist_status : PropTypes.object,
  temporaray_prescription_schedule : PropTypes.object,
  manage_schedule : PropTypes.object,
  temporary_injection_schedule: PropTypes.object,
  handleOk : PropTypes.func,
  timezone : PropTypes.number,
  schedule_data : PropTypes.object,
  change_timezone : PropTypes.number,
  beforeDial : PropTypes.func,
  afterDial : PropTypes.func,
  openLoginModal : PropTypes.func,
  schedule_date : PropTypes.string,
  before_schedule_date : PropTypes.string,
  after_schedule_date : PropTypes.string,
  bed_name : PropTypes.string,
  change_patient: PropTypes.boolean
};

export default BoardTop