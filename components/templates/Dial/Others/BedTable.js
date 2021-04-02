import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import RadioButton from "~/components/molecules/RadioInlineButton";
import {formatDateLine, formatJapanDate, getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date"
import BedComponent from "./BedComponent";
import DialSideBar from "../DialSideBar";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import axios from "axios/index";
import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import EditMoveDateModal from "~/components/templates/Dial/Schedule/modals/EditMoveDateModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import Button from "~/components/atoms/Button";
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
import {getServerTime} from "~/helpers/constants";
import {setDateColorClassName} from "~/helpers/dialConstants";

const CustomDiv = styled.div`
    width:100%;
    height:100%;
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
    padding-top: 1rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    -ms-user-select:none;
    .title {
        padding-right: 1rem;
        font-size: 1.2rem;
        padding-left: 0.5rem;
        border-left: solid 0.3rem #69c8e1;
        line-height: 2rem;
    }
`;

const SearchPart = styled.div`
  display: flex;
  width: 100%;
  line-height:2rem;
  padding: 0.625rem 0;
  .search-box {
      width: 100%;
      display: flex;
      position:relative;
      button {
        padding: 0;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 1rem;
      }
  }
  .label-title {
    width: 6.25rem;
    text-align: right;
    margin-right: 0.625rem;
    font-size: 1.25rem;
  }
  .pullbox-select {
      font-size: 0.75rem;
      width: 6.875rem;
  }
  .cur_date {
    width:12rem;
    font-size: 1rem;
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    line-height: 2rem;
  }
  .gender {
    margin-left: 0.3rem;
    .radio-btn label{
      width: 3rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin: 0 0.2rem;
      // padding: 0.25rem 0.3rem;
      // font-size: 1rem;
      font-weight: bold;
      line-height: 2rem;
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
  .link-area {
    display:flex;
    position: absolute;
    right: 0;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        min-width: 9rem;
    }
    span {
        font-size: 1rem;
    }
    .disable-button {
      background: rgb(101, 114, 117);
      cursor: auto;
    }
    .schedule-button {
        margin-right: 0.5rem;
    }
    .patient-count {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }
 `;

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: calc( 100vh - 4.5rem);
  overflow: hidden;
  .bed-area {
    margin-top: 1px;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }
  .area-2f {
    width: 47%;
    height: 100%;
    .bed-2f {
      align-items: flex-start;
      justify-content: space-between;
    }
  }
  .area-3f {
    width: 47%;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
  }
  .black-box {
      width: 2%;
      margin-left: 2%;
      margin-right: 2%;
      border: 1px solid black;
  }
  .left-area {
      width: 32%;
  }
  .right-area {
    width: 32%;
  }
  .middle-area {
    width: 32%;
  }
  .reception {
    .reception-box {
        width: 75%;
        text-align:center;
        background-color: #e4e4e4;
    }
    .reception-label {
        width: 75%;
        text-align: center;
    }
  }
  .padding-bed {
    width: 100%;
    margin-top:-1px;
  }
  .padding-bed:hover {
    background: #d7f9ec !important;
  }
  .green-border {
    border-color: #008000 !important;
  }
  .green-border-top {
    border-top: 1px solid #008000 !important;
  }
  .roo-name {
    width: 100%;
    text-align: center;
    font-weight: bold;
  }
  .no-set-area-name {
    width: 100%;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
  }
  .room-area {
    width: 30%;
  }
  .no-room-area {
    width: 28%;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .border-1p {
    border:1px solid black;
  }
  .bed-id {
    text-align: center;
    width: 20%;
  }
  .no-bed-id {
    width: 20%;
    background-color: red;
  }
  .bed-info {
    width: 80%;
    margin-left: -1px;
    .patient-id {
        width: 70%;
        text-align: left;
        padding-left:0.1rem;
    }
    .dial-time {
        width: 30%;
        padding-right: 0.1rem;
        text-align: right;
    }
    .patient-name {
        padding-left: 0.1rem;
        font-weight: bold;
    }
    .dial-method {
        align-items: flex-start;
        justify-content: space-between;
        padding-left: 0.1rem;
    }
    .instruction-mark{
        color:red;
        padding-right: 0.1rem;
    }
  }
  .hover-bed-style{
    background-color: rgb(153, 204, 255) !important;
    .bed-id{
      border-color: red;
    }
    .bed-info{
      border-color: red;
    }
  }
 `;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
.context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .hover-menu {
    z-index: 190;
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
      padding: 0.75rem;
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
  .patient-info-table {
        width: 100%;
        table {
            margin-bottom: 0;
        }
        th {
            font-size: 1rem;
            vertical-align: middle;
            padding: 0;
            text-align: left;
            padding: 0.2rem;
        }
        td {
            font-size: 1rem;
            vertical-align: middle;
            padding: 0.2rem;
        }
  }
`;

const ContextMenu = ({visible,x,y,edit_bed_data,parent
                     }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {(edit_bed_data.end_date === undefined || edit_bed_data.end_date == null) && (
            <li>
              <div onClick={() => parent.contextMenuAction('edit')}>編集</div>
            </li>
          )}
          <li>
            <div onClick={() => parent.contextMenuAction('go_bedside')}>ベッドサイド支援へ</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverMenu = ({
                     visible,
                     x,
                     y,
                     patient_name,
                     patient_number,
                   }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className={'patient-info-table'}>
              <table className="table-scroll table table-bordered" id="code-table">
                <tbody>
                <tr><th>患者番号</th><td style={{textAlign:"right"}}>{patient_number}</td></tr>
                <tr><th>氏名</th><td style={{textAlign:"left", fontWeight:"bold"}}>{patient_name}</td></tr>
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class BedTable extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    let width_fontsize = 16;
    let height_fontsize = 16;
    if(parseInt(width) < 1367){
      width_fontsize = 10;
      height_fontsize = 11.3;
    } else if(parseInt(width) < 1401){
      width_fontsize = 11;
      height_fontsize = 15.7;
    } else if(parseInt(width) < 1441){
      width_fontsize = 11;
      height_fontsize = 13.35;
    } else if(parseInt(width) < 1601){
      width_fontsize = 13;
      height_fontsize = 13.3;
    } else if(parseInt(width) < 1681){
      width_fontsize = 15;
      height_fontsize = 15.6;
    }
    this.state = {
      schVal: "",
      bed_data_2f: [],
      bed_data_3f: [],
      wait_bed_data: [],
      moveBedPostData: [],
      used_bed_count:0,
      schedule_date: '',  //日付表示
      isopenEditBedInfoModal: false,
      isMoveConfirmModal: false,
      timezone: 1,
      cur_patient_id:0,
      width_fontsize,
      height_fontsize,
      is_loaded:false,
    };
    this.detectCtrAEvent = this.detectCtrAEvent.bind(this);
  }
  
  async componentDidMount(){
    let schedule_date = sessApi.getObjectValue("dial_bed_table", "schedule_date");
    if(schedule_date == undefined || schedule_date == undefined){
      schedule_date = await getServerTime();
    }
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(new Date(schedule_date)));
    let path = "/app/api/v2/dial/pattern/getDialConditionInfo";
    let post_data = {
      keyword: "",
      is_enabled: 1,
    };
    let { data } = await axios.post(path, {params: post_data});
    let bed_nos = [];
    data[0].map((item) => {
      let bed_info = {name: item.value, console: parseInt(item.console)};
      bed_nos[item.id]= bed_info;
    });
    let consoles = [];
    data[1].map((item) => {
      consoles[parseInt(item.id)]= item.value;
    });
    this.setState({
      bed_nos,
      consoles,
      schedule_date:new Date(schedule_date),
      time_zone_list:getTimeZoneList(),
    }, async()=>{
      await this.getSearchResult();
    });
    sessApi.remove("dial_bed_table");
    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function(){
      $(window).resize(function(){
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        let width_fontsize = 16;
        let height_fontsize = 16;
        if(parseInt(width) < 1367){
          width_fontsize = 10;
          height_fontsize = 11.3;
        } else if(parseInt(width) < 1401){
          width_fontsize = 11;
          height_fontsize = 15.7;
        } else if(parseInt(width) < 1441){
          width_fontsize = 11;
          height_fontsize = 13.35;
        } else if(parseInt(width) < 1601){
          width_fontsize = 13;
          height_fontsize = 13.3;
        } else if(parseInt(width) < 1681){
          width_fontsize = 15;
          height_fontsize = 15.6;
        }
        that.setState({
          width_fontsize,
          height_fontsize
        });
      });
    });
    document.addEventListener("keydown", this.detectCtrAEvent, false);
  }
  
  detectCtrAEvent = (event) => {
    if (event.ctrlKey==true && event.which == '65') {
      event.preventDefault();
    }
  }
  
  componentWillUnmount (){
    document.removeEventListener("keydown", this.detectCtrAEvent, false);
    sessApi.remove('for_left_sidebar');
  }
  
  getSearchResult = async () => {
    if(this.state.is_loaded){
      this.setState({is_loaded:false});
    }
    let timezone = this.state.timezone;
    let cur_date = this.state.schedule_date ? formatDateLine(this.state.schedule_date) : "";
    let path = "/app/api/v2/dial/patient/getBedInfo";
    let post_data = {
      timezone: timezone,
      cur_date: cur_date
    };
    const { data } = await axios.post(path, {params: post_data});
    if(data != undefined && data != null) {
      this.setState({
        bed_data_2f: data[0],
        bed_data_3f: data[1],
        wait_bed_data: data[2],
        used_bed_count: (data[3] != undefined && data[3] != null) ? data[3] : 0,
        is_loaded:true,
      });
    }
  };
  
  getPrescriptionSelect = e => {
    this.setState({ display_order: parseInt(e.target.id) });
  };
  createCode = () => {
    this.setState({isOpenCodeModal: true});
  }
  
  selectTimezone = (e) => {
    this.setState({ timezone: parseInt(e.target.value)}, () => {
      this.getSearchResult();
    })
  };
  
  getDate = value => {
    this.setState({ schedule_date: value}, () => {
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    })
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    })
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    })
  };
  
  changeBed = (schedule_number, from_bedId, to_bedId, to_schedule_number, patient_name) => {
    if(from_bedId !== to_bedId){
      let post_data = {
        schedule_number,
        to_bedId,
        from_bedId,
        cur_date: formatDateLine(this.state.schedule_date),
        type: 'bed_table',
        to_schedule_number,
      };
      if(to_schedule_number == null){
        let bed_master = sessApi.getObjectValue("dial_common_master","bed_master");
        let str_from_bedname = "";
        let str_to_bedname = "";
        bed_master.map(item=>{
          if (item.number === parseInt(from_bedId)) {
            str_from_bedname = item.name;
          }
          if (item.number === parseInt(to_bedId)) {
            str_to_bedname = item.name;
          }
        });
        this.setState({
          isMoveConfirmModal : true,
          confirm_message: str_from_bedname + "から" + str_to_bedname + "に変更して良いですか？",
          moveBedPostData: post_data
        });
      } else {
        this.setState({
          isMoveConfirmModal : true,
          confirm_message: patient_name + " 様とベッドを替えますか？",
          moveBedPostData: post_data
        });
      }
    }
  };
  
  handleClick = (e, bed_data) => {
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
        .getElementById("bed_area")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("bed_area")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      let clientY = e.clientY;
      let clientX = e.clientX;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 200,
          y: e.clientY + window.pageYOffset
        },
        edit_bed_data: bed_data,
        hoverMenu:{visible: false}
      }, ()=>{
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight;
        let window_width = window.innerWidth;
        if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-200-menu_width,
              y: clientY - menu_height,
            },
          })
        } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-200,
              y: clientY - menu_height,
            },
          })
        } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-200-menu_width,
              y: clientY + window.pageYOffset,
            },
          })
        }
        
      });
    }
  };
  
  contextMenuAction = (act) => {
    if(act === 'edit'){
      this.setState({
        isopenEditBedInfoModal: true
      });
    } else {
      this.goBedside(this.state.edit_bed_data);
    }
  };
  
  goBedside=(bed_data)=>{
    var url = "/dial/board/system_setting";
    sessApi.setObjectValue("form_bed_table", "system_patient_id", bed_data.system_patient_id);
    sessApi.setObjectValue("form_bed_table", "schedule_date", bed_data.schedule_date);
    sessApi.setObjectValue("form_bed_table", "bed_no",bed_data.bed_no);
    sessApi.setObjectValue("form_bed_table", "timezone",bed_data.time_zone);
    setTimeout(()=>{
      this.props.history.replace(url);
    }, 500);
  }
  
  handleOk = (info) => {
    let patientList = this.state.list_item;
    patientList[this.state.select_index] = info;
    this.setState({
      list_item: patientList,
      isopenEditBedInfoModal: false
    });
  };
  
  closeBedModal = () => {
    this.setState({
      isopenEditBedInfoModal: false,
    }, ()=>{this.getSearchResult();});
    
  };
  
  goSchedule = () => {
    var url = "/dial/schedule/Schedule";
    sessApi.setObjectValue("dial_schedule_table", "schedule_date", formatDateLine(this.state.schedule_date));
    setTimeout(()=>{
      this.props.history.replace(url);
    }, 500);
  }
  
  confirmCancel() {
    this.setState({
      isMoveConfirmModal: false,
      confirm_message: "",
    });
  }
  
  handleMoveBed = async() => {
    let path = "/app/api/v2/dial/patient/changeBedInfo";
    await apiClient.post(path, {
      params: this.state.moveBedPostData
    }).then(() => {
      this.setState({
        moveBedPostData: [],
        isMoveConfirmModal: false
      }, ()=>{
        this.getSearchResult();
      });
    }).catch(() => {
      this.setState({
        moveBedPostData: [],
        isMoveConfirmModal: false
      }, ()=>{
        this.getSearchResult();
      });
    }).finally(()=>{
    });
  };
  
  goStatusMonitor = () => {
    sessApi.setObjectValue("dial_bed_table", "schedule_date", formatDateLine(this.state.schedule_date));
    setTimeout(()=>{
      this.props.history.replace("/dial/others/status_monitor");
    }, 500);
  };
  
  selectPatient=(patientInfo)=>{
    this.setState({
      cur_patient_id:patientInfo.system_patient_id,
    });
  };
  
  
  componentDidUpdate() {
    let all_bed = document.getElementsByClassName("padding-bed");
    for(let index = 0; index < all_bed.length; index++){
      let prev_patient_bed = all_bed[index];
      if(prev_patient_bed !== undefined && prev_patient_bed != null){
        prev_patient_bed.style['background-color'] = "";
        let cur_patient_bed_id = prev_patient_bed.getElementsByClassName('border-1p')[0];
        let cur_patient_bed_info = prev_patient_bed.getElementsByClassName('border-1p')[1];
        if(cur_patient_bed_id !== undefined && cur_patient_bed_id != null && cur_patient_bed_info !== undefined && cur_patient_bed_info != null ){
          cur_patient_bed_id.classList.remove("green-border");
          cur_patient_bed_info.classList.remove("green-border");
          let next_bed_no = prev_patient_bed.nextSibling;
          if(next_bed_no !== undefined && next_bed_no != null){
            let next_bed_id = next_bed_no.getElementsByClassName('border-1p')[0];
            let next_bed_info = next_bed_no.getElementsByClassName('border-1p')[1];
            if(next_bed_id !== undefined && next_bed_id != null && next_bed_info !== undefined && next_bed_info != null){
              next_bed_id.classList.remove("green-border-top");
              next_bed_info.classList.remove("green-border-top");
            }
          }
        }
      }
    }
    
    let cur_patient_bed = document.getElementsByClassName(this.state.cur_patient_id+"-bed")[0];
    if(cur_patient_bed !== undefined && cur_patient_bed != null){
      cur_patient_bed.style['background-color'] = "#DDEEFF";
      let cur_patient_bed_id = cur_patient_bed.getElementsByClassName('border-1p')[0];
      let cur_patient_bed_info = cur_patient_bed.getElementsByClassName('border-1p')[1];
      if(cur_patient_bed_id !== undefined && cur_patient_bed_id != null && cur_patient_bed_info !== undefined && cur_patient_bed_info != null ){
        cur_patient_bed_id.classList.add("green-border");
        cur_patient_bed_info.classList.add("green-border");
        let next_bed_no = cur_patient_bed.nextSibling;
        if(next_bed_no !== undefined && next_bed_no != null){
          let next_bed_id = next_bed_no.getElementsByClassName('border-1p')[0];
          let next_bed_info = next_bed_no.getElementsByClassName('border-1p')[1];
          if(next_bed_id !== undefined && next_bed_id != null && next_bed_info !== undefined && next_bed_info != null){
            next_bed_id.classList.add("green-border-top");
            next_bed_info.classList.add("green-border-top");
          }
        }
      }
    }
  }
  
  patientNameHover=(e, patient_name, patient_number)=>{
    if(patient_name === ""){
      return;
    }
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let clientY = e.clientY;
    let clientX = e.clientX;
    this.setState({
      hoverMenu: {
        visible: true,
        x: e.clientX - 200,
        y: e.clientY + window.pageYOffset
      },
      patient_name,
      patient_number,
      contextMenu:{visible: false}
    }, ()=>{
      let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
      let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
      let window_height = window.innerHeight;
      let window_width = window.innerWidth;
      if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          hoverMenu: {
            visible: true,
            x: clientX-200-menu_width,
            y: clientY - menu_height,
          },
        })
      } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
        this.setState({
          hoverMenu: {
            visible: true,
            x: clientX-200,
            y: clientY - menu_height,
          },
        })
      } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          hoverMenu: {
            visible: true,
            x: clientX-200-menu_width,
            y: clientY + window.pageYOffset,
          },
        })
      }
      
    });
  };
  
  closeNameHover=()=>{
    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu !== undefined && hoverMenu.visible){
      this.setState({hoverMenu: { visible: false }});
    }
  }
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    let bed_data_2f = (this.state.bed_data_2f != undefined && this.state.bed_data_2f !=null) ? this.state.bed_data_2f : [];
    let bed_data_3f = (this.state.bed_data_3f != undefined && this.state.bed_data_3f !=null) ? this.state.bed_data_3f : [];
    let wait_bed_data = (this.state.wait_bed_data != undefined && this.state.wait_bed_data !=null) ? this.state.wait_bed_data : [];
    let bed_area_2f_1 = [];
    for (let i = 1; i < 4; i++) {
      let console_name = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[i].console != null && this.state.bed_nos[i].console !== '' && this.state.bed_nos[i].console !== 0 ) ? this.state.consoles[this.state.bed_nos[i].console] : '';
      if(bed_data_2f[i] != undefined && bed_data_2f[i] != null){
        bed_area_2f_1.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i}
            bed_data={bed_data_2f[i]}
            changeBed = {this.changeBed}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        bed_area_2f_1.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i}
            changeBed = {this.changeBed}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    for (let i = 4; i < 6; i++) {
      let console_name = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[i].console != null && this.state.bed_nos[i].console !== '' && this.state.bed_nos[i].console !== 0 ) ? this.state.consoles[this.state.bed_nos[i].console] : '';
      if(bed_data_2f[i] != undefined && bed_data_2f[i] != null){
        bed_area_2f_1.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i}
            bed_data={bed_data_2f[i]}
            changeBed = {this.changeBed}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        bed_area_2f_1.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i}
            changeBed = {this.changeBed}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    let bed_area_2f_2 = [];
    for (let i = 6; i < 11; i++) {
      let console_name = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[i].console != null && this.state.bed_nos[i].console !== '' && this.state.bed_nos[i].console !== 0 ) ? this.state.consoles[this.state.bed_nos[i].console] : '';
      if(bed_data_2f[i] != undefined && bed_data_2f[i] != null){
        bed_area_2f_2.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i}
            bed_data={bed_data_2f[i]}
            changeBed = {this.changeBed}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        bed_area_2f_2.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i}
            changeBed = {this.changeBed}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    let console_name36 = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[36].console != null && this.state.bed_nos[36].console !== '' && this.state.bed_nos[36].console !== 0 ) ? this.state.consoles[this.state.bed_nos[36].console] : '';
    if(bed_data_2f[36] != undefined && bed_data_2f[36] != null){
      bed_area_2f_2.push(
        <BedComponent
          key={36}
          type={1}
          bedId={11}
          bed_no={36}
          bed_data={bed_data_2f[36]}
          changeBed = {this.changeBed}
          handleClick = {this.handleClick}
          goBedside = {this.goBedside}
          patientNameHover = {this.patientNameHover}
          closeNameHover = {this.closeNameHover}
          console_name={console_name36}
          width_fontsize={this.state.width_fontsize}
          height_fontsize={this.state.height_fontsize}
        />
      )
    } else {
      bed_area_2f_2.push(
        <BedComponent
          key={36}
          type={1}
          bedId={11}
          bed_no={36}
          changeBed = {this.changeBed}
          console_name={console_name36}
          width_fontsize={this.state.width_fontsize}
          height_fontsize={this.state.height_fontsize}
        />
      )
    }
    
    let wait_bed_data_1 = [];
    for (let i = 0; i < 3; i++) {
      if(wait_bed_data[i] != undefined && wait_bed_data[i] != null){
        wait_bed_data_1.push(
          <BedComponent
            key={i + 1}
            type={0}
            // bedId={i + 1}
            bedId={100}
            // bed_no={i + 1}
            bed_no={100}
            bed_data={wait_bed_data[i]}
            changeBed = {this.changeBed}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        wait_bed_data_1.push(
          <BedComponent
            key={i + 1}
            type={0}
            // bedId={i + 1}
            bedId={100}
            bed_no={100}
            changeBed = {this.changeBed}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    let wait_bed_data_2 = [];
    for (let i = 3; i < 6; i++) {
      if(wait_bed_data[i] != undefined && wait_bed_data[i] != null){
        wait_bed_data_2.push(
          <BedComponent
            key={i + 1}
            type={0}
            // bedId={i + 1}
            bedId={100}
            bed_no={100}
            bed_data={wait_bed_data[i]}
            changeBed = {this.changeBed}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        wait_bed_data_2.push(
          <BedComponent
            key={i + 1}
            type={0}
            // bedId={i + 1}
            bedId={100}
            bed_no={100}
            changeBed = {this.changeBed}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    let wait_bed_data_3 = [];
    for (let i = 6; i < 9; i++) {
      if(wait_bed_data[i] !== undefined && wait_bed_data[i] != null){
        wait_bed_data_3.push(
          <BedComponent
            key={i + 1}
            type={0}
            // bedId={i + 1}
            bedId={100}
            // bed_no={i + 1}
            bed_no={100}
            bed_data={wait_bed_data[i]}
            changeBed = {this.changeBed}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        wait_bed_data_3.push(
          <BedComponent
            key={i + 1}
            type={0}
            // bedId={i + 1}
            bedId={100}
            bed_no={100}
            changeBed = {this.changeBed}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    let bed_area_3f_1 = [];
    for (let i = 1; i < 3; i++) {
      let console_name = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[10+i].console != null && this.state.bed_nos[10+i].console !== '' && this.state.bed_nos[10+i].console !== 0 ) ? this.state.consoles[this.state.bed_nos[10+i].console] : '';
      if(bed_data_3f[i] !== undefined && bed_data_3f[i] != null){
        bed_area_3f_1.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            bed_data={bed_data_3f[i]}
            changeBed = {this.changeBed}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        bed_area_3f_1.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            changeBed = {this.changeBed}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    bed_area_3f_1.push(
      <>
        <div className={'space-3f-1'} style={{height:((this.state.height_fontsize*5.3)+"px")}}></div>
        <div className="reception" style={{paddingLeft:((this.state.width_fontsize*2.5)+"px"), height:((this.state.height_fontsize*5.3)+"px")}}>
          <div className="reception-label" style={{height:(this.state.height_fontsize*1.4)+"px"}}></div>
          <div className="reception-box" style={{height:(this.state.height_fontsize*1.875)+"px", lineHeight:(this.state.height_fontsize*1.875)+"px", fontSize:this.state.width_fontsize+"px"}}>スタッフ</div>
        </div>
        <div
          className={'roo-name'}
          style={{
            fontSize:(this.state.width_fontsize*3.75)+"px",
            height:((this.state.height_fontsize*5.3)+"px")
          }}
        >3F</div>
      </>
    );
    
    let bed_area_3f_2 = [];
    for (let i = 3; i < 8; i++) {
      let console_name = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[10+i].console != null && this.state.bed_nos[10+i].console !== '' && this.state.bed_nos[10+i].console !== 0 ) ? this.state.consoles[this.state.bed_nos[10+i].console] : '';
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_2.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            bed_data={bed_data_3f[i]}
            changeBed = {this.changeBed}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        bed_area_3f_2.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            changeBed = {this.changeBed}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    let bed_area_3f_3 = [];
    for (let i = 8; i < 20; i++) {
      let console_name = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[10+i].console != null && this.state.bed_nos[10+i].console !== '' && this.state.bed_nos[10+i].console !== 0 ) ? this.state.consoles[this.state.bed_nos[10+i].console] : '';
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_3.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            bed_data={bed_data_3f[i]}
            changeBed = {this.changeBed}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        bed_area_3f_3.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            changeBed = {this.changeBed}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    let bed_area_3f_4 = [];
    for (let i = 20; i < 24; i++) {
      let console_name = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[10+i].console != null && this.state.bed_nos[10+i].console !== '' && this.state.bed_nos[10+i].console !== 0 ) ? this.state.consoles[this.state.bed_nos[10+i].console] : '';
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_4.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            bed_data={bed_data_3f[i]}
            changeBed = {this.changeBed}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        bed_area_3f_4.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            changeBed = {this.changeBed}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    let bed_area_3f_5 = [];
    
    let console_name37 = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[37].console != null && this.state.bed_nos[37].console !== '' && this.state.bed_nos[37].console !== 0 ) ? this.state.consoles[this.state.bed_nos[37].console] : '';
    if(bed_data_2f[37] != undefined && bed_data_2f[37] != null){
      bed_area_3f_5.push(
        <BedComponent
          key={37}
          type={1}
          bedId={''}
          bed_no={37}
          bed_data={bed_data_2f[37]}
          changeBed = {this.changeBed}
          handleClick = {this.handleClick}
          goBedside = {this.goBedside}
          patientNameHover = {this.patientNameHover}
          closeNameHover = {this.closeNameHover}
          console_name={console_name37}
          width_fontsize={this.state.width_fontsize}
          height_fontsize={this.state.height_fontsize}
        />
      )
    } else {
      bed_area_3f_5.push(
        <BedComponent
          key={37}
          type={1}
          bedId={''}
          bed_no={37}
          changeBed = {this.changeBed}
          console_name={console_name37}
          width_fontsize={this.state.width_fontsize}
          height_fontsize={this.state.height_fontsize}
        />
      )
    }
    for (let i = 24; i < 26; i++) {
      let console_name = (this.state.bed_nos !== undefined && this.state.consoles !== undefined && this.state.bed_nos[10+i].console != null && this.state.bed_nos[10+i].console !== '' && this.state.bed_nos[10+i].console !== 0 ) ? this.state.consoles[this.state.bed_nos[10+i].console] : '';
      if(bed_data_3f[i] != undefined && bed_data_3f[i] != null){
        bed_area_3f_5.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            bed_data={bed_data_3f[i]}
            changeBed = {this.changeBed}
            handleClick = {this.handleClick}
            goBedside = {this.goBedside}
            patientNameHover = {this.patientNameHover}
            closeNameHover = {this.closeNameHover}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      } else {
        bed_area_3f_5.push(
          <BedComponent
            key={i}
            type={1}
            bedId={i}
            bed_no={i+10}
            changeBed = {this.changeBed}
            console_name={console_name}
            width_fontsize={this.state.width_fontsize}
            height_fontsize={this.state.height_fontsize}
          />
        )
      }
    }
    
    return (
      <>
        <CustomDiv>
          <DialSideBar
            onGoto={this.selectPatient}
            history = {this.props.history}
          />
          <Card>
            <SearchPart>
              <div className="search-box" style={{fontSize:(this.state.width_fontsize*0.8)+"px"}}>
                <div className="title" style={{paddingLeft:(this.state.width_fontsize*0.5)+"px", paddingRight:this.state.width_fontsize+"px", fontSize:(this.state.width_fontsize*1.2)+"px"}}>ベッド配置表</div>
                <div className="cur_date flex">
                  {this.state.schedule_date != "" && (
                    <>
                      <div className="prev-day" onClick={this.PrevDay} style={{paddingRight:(this.state.width_fontsize*0.5)+"px"}}>{"< "}</div>
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
                      <div className="next-day" onClick={this.NextDay} style={{paddingLeft:(this.state.width_fontsize*0.5)+"px"}}>{" >"}</div>
                    </>
                  )}
                </div>
                <div className="gender">
                  <>
                    {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                      this.state.time_zone_list.map((item)=>{
                        return (
                          <>
                            <RadioButton
                              id={`time_${item.id}`}
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
                  </>
                </div>
                <div className={'link-area'}>
                  <div className="patient-count">{this.state.used_bed_count}名</div>
                  <Button className="schedule-button" onClick={this.goSchedule}>スケジュール</Button>
                  <Button onClick={this.goStatusMonitor.bind(this)}>透析状況モニタ</Button>
                  <Button className="disable-button">ベッド配置表</Button>
                </div>
              </div>
            </SearchPart>
            <Wrapper className='bed-table-area'>
              {this.state.is_loaded ? (
                <div className={'bed-area flex'} id={'bed_area'} style={{fontSize:(this.state.width_fontsize*0.8)+"px"}}>
                  <div className={'area-2f'}>
                    <div className={'bed-2f flex'}>
                      <div className="left-area">
                        {bed_area_2f_1}
                      </div>
                      <div className={'middle-area'} style={{paddingTop:(this.state.height_fontsize*15.9)+"px"}}>
                        <div className="reception" style={{paddingLeft:((this.state.width_fontsize*2.5)+"px"), height:((this.state.height_fontsize*5.3)+"px")}}>
                          <div className="reception-label" style={{height:(this.state.height_fontsize*1.4)+"px"}}></div>
                          <div className="reception-box" style={{height:(this.state.height_fontsize*1.875)+"px", lineHeight:(this.state.height_fontsize*1.875)+"px", fontSize:this.state.width_fontsize+"px"}}>スタッフ</div>
                        </div>
                        <div
                          className={'roo-name'}
                          style={{
                            fontSize:(this.state.width_fontsize*3.75)+"px",
                            height:((this.state.height_fontsize*5.3)+"px")
                          }}
                        >2F</div>
                      </div>
                      <div className="right-area">
                        {bed_area_2f_2}
                      </div>
                    </div>
                    <div className={'no-set-area-name'} style={{height:(((this.state.height_fontsize*15.9) - 3)+"px"), lineHeight:(((this.state.height_fontsize*15.9) - 3)+"px")}}>ベッド未設定エリア</div>
                    <div className={'bed-2f flex'}>
                      <div className="left-area">
                        {wait_bed_data_1}
                      </div>
                      <div className={'middle-area'}>
                        {wait_bed_data_2}
                      </div>
                      <div className="right-area">
                        {wait_bed_data_3}
                      </div>
                    </div>
                  </div>
                  <div className="black-box" style={{height:((this.state.height_fontsize*63.6) - 11)+"px"}}></div>
                  <div className={'area-3f flex'}>
                    <div className="left-area">
                      {bed_area_3f_1}
                      <div className={'space-3f-5'} style={{height:((this.state.height_fontsize*21.2) - 7)+"px"}}></div>
                      {bed_area_3f_5}
                    </div>
                    <div className={'middle-area'}>
                      {bed_area_3f_2}
                      <div className={'space-3f-4'} style={{height:((this.state.height_fontsize*15.9) - 3)+"px"}}></div>
                      {bed_area_3f_4}
                    </div>
                    <div className="right-area">
                      {bed_area_3f_3}
                    </div>
                  </div>
                </div>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
            <ContextMenu
              {...this.state.contextMenu}
              edit_bed_data={this.state.edit_bed_data}
              parent={this}
            />
            <HoverMenu
              {...this.state.hoverMenu}
              patient_name={this.state.patient_name}
              patient_number={this.state.patient_number}
            />
            {this.state.isopenEditBedInfoModal && (
              <EditMoveDateModal
                handleOk={this.handleOk}
                closeModal={this.closeBedModal}
                schedule_date = {formatDateLine(this.state.schedule_date)}
                system_patient_id = {this.state.edit_bed_data.system_patient_id}
              />
            )}
            {this.state.isMoveConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.handleMoveBed.bind(this)}
                confirmTitle= {this.state.confirm_message}
              />
            )}
          </Card>
        </CustomDiv>
      </>
    )
  }
}

BedTable.contextType = Context;

BedTable.propTypes = {
  history: PropTypes.object
};

export default BedTable;