import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import {
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat,
  formatJapanDate,
  formatDateLine,
  formatTime,
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import RadioButton from "~/components/molecules/RadioInlineButton";
import axios from "axios/index";
import { Editors } from "react-data-grid-addons";
import ReactDataGrid from "react-data-grid";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";
import PatientGroupPreviewModal from "./PatientGroupPreviewModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import Spinner from "react-bootstrap/Spinner";
import * as sessApi from "~/helpers/cacheSession-utils";
import renderHTML from "react-render-html";
import $ from "jquery";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {toHalfWidthOnlyNumber, setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  float: left;
  width: calc(100% - 190px);
  height: 100vh;
  position: fixed;
  background-color: ${surface};
  padding: 20px;
  .footer {
    margin-top: 20px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const SearchPart = styled.div`
  display: block;
  font-size: 12px;
  width: 100%;
  height: 70px;
  padding: 10px;
  .search-box {
    width: 100%;
    display: flex;
    .react-datepicker-popper {
      z-index: 10 !important;
    }
  }
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
    font-size: 20px;
  }
  .pullbox-select {
    font-size: 12px;
    width: 110px;
  }
  .cur_date {
    font-size: 25px;
    display: flex;
    flex-wrap: wrap;
    .react-datepicker-wrapper {
      cursor:pointer;
    }
  }
  .gender {
    font-size: 12px;
    margin-left: 15px;
    .radio-btn label {
      width: 75px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .prev-day {
    cursor: pointer;
    padding-right: 10px;
  }
  .next-day {
    cursor: pointer;
    padding-left: 10px;
  }
  .patient-count {
    width: 10%;
    font-size: 25px;
    text-align: center;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  font-size: 14px;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .content {
    width: 100%;
    overflow: hidden;
    height: calc(100vh - 300px);
    .drag-handle {
      display: none;
    }
    .react-grid-Container {
      height: 100%;
    }
    .react-grid-Main {
      height: 100%;
    }
    .react-grid-Grid {
      height: calc(100% - 1rem);
    }
    .react-grid-Canvas {
      height: 100% !important;
    }
    .react-grid-Cell__value {
      white-space: normal !important;
    }
    .injection-td {
      padding:0;
      .react-grid-Cell__value {
        overflow-y: auto !important;
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }
  .label-title {
    width: 5rem;
    margin-right: 10px;
    text-align: right;
    font-size: 1rem;
  }
  .input-area {
    .input-date {
      .label-title {
        margin-top: 0;
        margin-bottom: 0;
        line-height: 47px;
      }
    }
    .datepicker {
      margin-top: 8px;
      label {        
        text-align: right;
        margin-right: 10px;
        font-size: 1rem;
        width: 5rem;
        margin-top: 0;
        margin-bottom: 0;
        line-height: 47px;
      }
    }
    .entry_name,
    .direct_man {
      .label-title {
        margin-top: 0;
        margin-bottom: 0;
        line-height: 38px;
        text-align: right;
        margin-right: 10px;
        width: 5rem;
        font-size: 1rem;
      }
      input {
        width: 15rem;
      }
    }
  }
  .pullbox-select {
    width: 100%;
  }
  .pullbox {
    .pullbox-label {
      width: 15rem;
    }
  }
  .react-datepicker-wrapper {
    width: 12rem;
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 1rem;
        width: 100%;
        height: 38px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        margin-top: 5px;
        padding: 0px 8px;
      }
    }
  }
  .entry_name {
    margin-top: 5px;
  }
  .direct_man {
    margin-top: 5px;
  }
  .react-grid-Container {
    font-size: 1rem;
  }
  .react-grid-HeaderCell {
    display: flex !important;
    align-items: center;
    .widget-HeaderCell__value {
      width:100%;
      text-align:center;
    }
  }
  .react-grid-Canvas div {
    min-height : 1px;
  }
  .disable-row{
    .react-grid-Cell{
      background:lightgray;
    }
  }
  .disable-row:hover{
    .react-grid-Cell{
      background:lightgray;
    }
  }
  .edit-status-td{
    width:90px;    
    height:50px;
    display:table-cell;
    vertical-align:middle;
  }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const { DropDownEditor } = Editors;
const dialGroups = [{ id: 0, value: "" }];
const GroupEditor = <DropDownEditor options={dialGroups} />;

const dialGroups2 = [{ id: 0, value: "" }];
const GroupEditor2 = <DropDownEditor options={dialGroups2} />;

let dial_start_tiems = [{ id: 0, value: "" }];
const DialStartTimeEditor = <DropDownEditor options={dial_start_tiems} />;

let dial_finish_tiems = [{ id: 0, value: "" }];
const DialFinishTimeEditor = <DropDownEditor options={dial_finish_tiems} />;

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;
class PatientGroup extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let time_zone_list = getTimeZoneList();
    this.columns = [
      {
        key: "edit_status",
        // frozen: true,
        name: "編集情報",
        editable: false,        
        width: 90,
        formatter:function(rowData){          
          var tooltip_str = '';
          if (rowData.value == '実施'){
            tooltip_str = '開始前確認が完了しているため、変更できません';
          }
          if (rowData.value == '臨時'){
            tooltip_str = '臨時透析のため、この日の予定だけを変更します。';
          }
          if (rowData.value == '個別'){
            tooltip_str = '元のパターンから個別に変更されているため、この日の予定だけを変更します。';
          }
          if (tooltip_str != ''){
            return <OverlayTrigger overlay={renderTooltip(tooltip_str)} placement={'center'}>
              <div className={'edit-status-td ' + rowData.row.schedule_number}><span>{rowData.value}</span></div>
            </OverlayTrigger>  
          } else {
            return <div className={'edit-status-td ' + rowData.row.schedule_number}><span>{rowData.value}</span></div>
          }
          
        },
      },
      {
        key: "group",
        // frozen: true,
        name: "グループ",
        editor: GroupEditor,
        width: 140,
        editable: function(rowData) {
          return rowData.edit_status != '実施';
        },        
      },
      {
        key: "group2",
        // frozen: true,
        name: "グループ2",
        editor: GroupEditor2,
        width: 90,
        editable: function(rowData) {
          return rowData.edit_status != '実施';
        },        
      },
      {
        key: "patient_name",
        // frozen: true,
        name: "患者氏名",
        editable: false,
        width: 200,        
      },
      {
        key: "reservation_time",
        // frozen: true,
        name: "透析時間",
        editable: false,
        width: 90,        
      },
      {
        key: "scheduled_start_time",
        // frozen: true,
        name: renderHTML("<div>開始予定時刻<br />" + "(HH:MM)" + "</div>"),
        editor: DialStartTimeEditor,
        width: 180,
        editable: function(rowData) {
          return rowData.edit_status != '実施';
        },        
      },
      {
        key: "scheduled_end_time",
        // frozen: true,
        name: renderHTML("<div>終了予定時刻<br />" + "(HH:MM)" + "</div>"),
        editor: DialFinishTimeEditor,
        width: 180,
        editable: function(rowData) {
          return rowData.edit_status != '実施';
        },        
      },
      {
        key: "list_note",
        // frozen: true,
        name: "備考",        
        width: 200,
        editable: function(rowData) {
          return rowData.edit_status != '実施';
        }
      },
      {
        key: "injection",
        // frozen: true,
        name: "透析中注射",
        editable: false,        
        width: 593,
        cellClass:'injection-td',        
      }
    ];
    this.state = {
      time_zone_list,
      isOpenPreviewModal: false,
      schedule_date: new Date(), //日付表示
      isopenEditPatientGroup: false,
      timezone: 1,
      table_data: [],
      selected_data: "",
      selector: [],
      rows: [],
      defaultRows: [],
      init_data: [],
      confirm_message: "",
      confirm_type: "",
      confirm_alert_title: "",
      isShowDoctorList: false,
      directer_name:(authInfo != undefined && authInfo != null && authInfo.doctor_number > 0) ? authInfo.doctor_number: 0,
      entry_date: new Date(),
      entry_time: new Date(),
      load_flag:false,
    };
  }

  async componentDidMount() {
    await this.getConstInfo();
    await this.getDoctors();
    await this.getStaffs();
    await this.getSearchResult();
  }

  componentDidUpdate () {    
    if (this.state.rows != undefined && this.state.rows != null && this.state.rows.length > 0){
      this.state.rows.map((item) => {
        var row_obj = $('.react-grid-Row');
        if (item.edit_status == '実施' ){
          var schedule_number = item.schedule_number;          
          row_obj.each(function() {            
            if ($(".edit-status-td", $(this)).hasClass(schedule_number)){
              $(this).addClass('disable-row');
            }            
          })          
        } else {  
          row_obj.each(function() {            
            if ($(".edit-status-td", $(this)).hasClass(schedule_number)){
              $(this).removeClass('disable-row');
            }
          })
        }
      })
    }
  }

  // 検索
  getConstInfo = async () => {
    let path = "/app/api/v2/dial/pattern/getDialConditionInfo";
    let post_data = {
      keyword: "",
      is_enabled: 1,
    };
    let { data } = await axios.post(path, { params: post_data });

    data[3].map((item, index) => {
      let group_info = { id: parseInt(item.code), value: item.value };
      dialGroups[index + 1] = group_info;
    });
    data[4].map((item, index) => {
      let group_info = { id: parseInt(item.code), value: item.value };
      dialGroups2[index + 1] = group_info;
    });
    
    let index = 1;
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 10) {
        let dial_tiem = "";
        if (minutes < 10) {
          if (hour < 10) {
            dial_tiem = { id: index, value: "0" + hour + ":" + "0" + minutes };
          } else {
            dial_tiem = { id: index, value: hour + ":" + "0" + minutes };
          }
        } else {
          if (hour < 10) {
            dial_tiem = { id: index, value: "0" + hour + ":" + minutes };
          } else {
            dial_tiem = { id: index, value: hour + ":" + minutes };
          }
        }
        dial_start_tiems[index + 1] = dial_tiem;
        dial_finish_tiems[index + 1] = dial_tiem;
        index++;
      }
    }
  };

  getSearchResult = async () => {
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/dial/patient/getDialWithInjectionByGroup";
    let post_data = {
      time_zone: this.state.timezone,
      schedule_date: formatDateLine(this.state.schedule_date),
    };
    const { data } = await axios.post(path, { params: post_data });
    if (data != undefined && data != null) {
      let rows = [];
      let selector = [];
      let defaultRows = [];
      data.map((item, index) => {
        let injection = "";
        if (item.injection !== undefined && item.injection !== null) {
          item.injection.map((ele) => {
            if (ele["item_name"] !== "") {
              if (injection !== "") {
                injection = injection + "、 " + ele["item_name"];
              } else {
                injection = injection + " " + ele["item_name"];
              }
            }
          });
        }
        var edit_status = '';
        if (item.is_temporary == 1) edit_status = '臨時';
        if (item.is_updated == 1) edit_status = '個別';
        if (item.pre_start_confirm_at != null) edit_status = '実施';        
        rows.push({
          id: index,
          edit_status : edit_status,
          group:(item.group === 0 || item.group == null) ? "" : (dialGroups.find((x) => x.id === item.group) != null ? dialGroups.find((x) => x.id === item.group).value : ""),
          group2:(item.group2 === 0 || item.group2 == null) ? "" : (dialGroups2.find((x) => x.id === item.group2) != null ? dialGroups2.find((x) => x.id === item.group2).value : ""),
          patient_name: item.patient_name,
          reservation_time: (Math.round(parseFloat(item.reservation_time) * 100) / 100) + "時間",
          scheduled_start_time: item.scheduled_start_time,
          scheduled_end_time: item.scheduled_end_time,
          list_note: item.list_note,
          injection: injection,
          schedule_number: item.schedule_number,
        });
        defaultRows.push({
          id: index,
          edit_status : edit_status,
          group:(item.group === 0 || item.group == null) ? "" : (dialGroups.find((x) => x.id === item.group) != null ? dialGroups.find((x) => x.id === item.group).value : ""),
          group2:(item.group2 === 0 || item.group2 == null) ? "" : (dialGroups2.find((x) => x.id === item.group2) != null ? dialGroups2.find((x) => x.id === item.group2).value : ""),
          patient_name: item.patient_name,
          reservation_time: (Math.round(parseFloat(item.reservation_time) * 100) / 100) + "時間",
          scheduled_start_time: item.scheduled_start_time,
          scheduled_end_time: item.scheduled_end_time,
          list_note: item.list_note,
          injection: injection,
          schedule_number: item.schedule_number,
        });
        if (selector[index] == undefined) selector[index] = {};
        selector[index]['group'] = item.group;
        selector[index]['group2'] = item.group2;
      });
      this.setState({
        defaultRows,
        rows,
        selector,
        entry_date: new Date(),
        entry_time: new Date(),
        confirm_message: "",
        confirm_type: "",
        confirm_alert_title: "",
        load_flag:true,
      });
    }
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows;
    {
      Object.keys(updated).map(key => {
        if (key == 'scheduled_start_time'){          
          var scheduled_start_time = updated[key];
          if (scheduled_start_time != ''){
            
            var hours = scheduled_start_time.split(':')[0];
            var mins = scheduled_start_time.split(':')[1];
            var reservation_time = rows[fromRow]["reservation_time"];
            if (reservation_time != ''){
              reservation_time =  reservation_time.replace('時間', '');
              hours = (parseInt(reservation_time) + parseInt(hours)) % 24;              
              var min_parts_reserve = parseInt((reservation_time - parseInt(reservation_time)) * 60);
              mins = (parseInt(mins) + min_parts_reserve) % 60;              
              hours = hours + parseInt((mins + min_parts_reserve)/60);              
            }
            if (hours < 10 ) hours = '0' + hours;
            if (mins < 10 ) mins = '0' + mins;
            updated['scheduled_end_time'] = hours + ':' + mins;
          }

          this.setState((state) => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
              rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
          });
        }
        if (key == 'scheduled_end_time'){
          this.setState((state) => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
              rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
          });   
        }
      })
    }
    this.setState((state) => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  getCellActions(column, row) {    
    if (column.key === "group" || column.key === "group2") {
      column.editor.props.options.map((item) => {
        if (row[column.key] == item.value) {
          let selector = this.state.selector;
          if (selector[row.id] == undefined) selector[row.id] = {};
          selector[row.id][column.key] = item.id;
          this.setState({ selector: selector });
        }
      });
    }
  }

  openPreviewModal = () => {
    if(!this.state.load_flag){
      return;
    }
    this.setState({
      isOpenPreviewModal: true,
    });
  };
  closeModal = () => {
    this.setState({
      isOpenPreviewModal: false,
      isopenEditPatientGroup: false,
      isShowDoctorList: false,
    });
  };

  selectTimezone = (change_flag, e) => {
    if(change_flag){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"select_time_zone",
        confirm_value:e.target.value,
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({ timezone: parseInt(e.target.value) }, () => {
        this.getSearchResult();
      });
    }
  };

  getDate = (change_flag, value) => {
    if(change_flag){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"move_date",
        confirm_value:value,
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({ schedule_date: value }, () => {
        this.getSearchResult();
      });
    }
  };

  moveDay =(type, change_flag)=> {
    let now_day = this.state.schedule_date;
    let cur_day = type == "prev" ? getPrevDayByJapanFormat(now_day) : getNextDayByJapanFormat(now_day);
    if(change_flag){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"move_date",
        confirm_value:cur_day,
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({ schedule_date: cur_day }, () => {
        this.getSearchResult();
      });
    }
  };

  openConfirmModal() {
    if (this.state.directer_name === 0) {
      this.showDoctorList();
      return;
    }
    this.setState({
      confirm_message: "保存しますか？",
      confirm_type: "save",
    });
  }

  confirmOk = () => {
    if (this.state.confirm_type === "save") {
      this.EditInfo();
    } else if (this.state.confirm_type === "reset") {
      this.setState({
        rows:this.state.defaultRows,
        confirm_message:"",
        confirm_type:"",
        confirm_alert_title:""
      });
    } else if (this.state.confirm_type === "move_date") {
      this.getDate(false, this.state.confirm_value);
    } else if (this.state.confirm_type === "select_time_zone") {
      this.setState({ timezone: parseInt(this.state.confirm_value) }, () => {
        this.getSearchResult();
      });
    }
  };

  confirmCancel = () => {
    let state_data = {};
    state_data['confirm_message'] = "";
    state_data['confirm_type'] = "";
    state_data['confirm_alert_title'] = "";
    if(this.state.confirm_type === "move_date"){
      state_data['schedule_date'] = this.state.schedule_date;
    }
    if(this.state.confirm_type === "select_time_zone"){
      state_data['timezone'] = this.state.timezone;
    }
    this.setState(state_data);
  };

  EditInfo = () => {
    let path = "/app/api/v2/dial/patient/editDialWithInjectionByGroup";
    let post_data = {
      data: this.state.rows,
      selector: this.state.selector,
      directer_name: this.state.directer_name,
      entry_date: formatDateLine(this.state.entry_date),
      entry_time: formatTime(this.state.entry_time),
      schedule_date: formatDateLine(this.state.schedule_date),
    };
    apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.getSearchResult();
      })
      .catch(() => {});
  };
  
  getValue = (key, e) => {
    switch (key) {
      case "entry_time":
        this.setState({
          entry_time: e,
        });
        break;
      case "entry_date":
        this.setState({
          entry_date: e,
        });
        break;
    }
  };

  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e.target.type == undefined || e.target.type != "text") return;
    
    this.setState({
      isShowDoctorList: true,
    });
  };

  selectDoctor = (doctor) => {
    this.setState({
      directer_name: doctor.number,
      isShowDoctorList: false,
    });
  };

  changeTimeHeader = () => {
    if (
      document.getElementsByClassName("react-datepicker-time__header") ===
        undefined ||
      document.getElementsByClassName("react-datepicker-time__header")
        .length === 0
    )
      return;
    document.getElementsByClassName(
      "react-datepicker-time__header"
    )[0].innerHTML = "時間";
  };
  
  confirmReset=()=>{
    this.setState({
      confirm_message:"入力中の内容をリセットしますか？",
      confirm_type:"reset",
      confirm_alert_title:'破棄確認',
    });
  }

  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  timeKeyEvent = (e) => {    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;    
    this.key_code = key_code;
    this.start_pos = start_pos;
    var obj = document.getElementById('entry_time_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({input_time_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            input_time_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            input_time_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        input_time_value:input_value,
      })
    }
  }

  getInputTime = (value, e) => {
    if (e == undefined){
      this.setState({
        entry_time:value,
        input_time_value:formatTime(value)
      })
      this.change_flag = true;
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    
    this.setState({
      input_time_value:input_value
    }, () => {
      var obj = document.getElementById('entry_time_id');
      if (this.key_code == 46){        
        obj.setSelectionRange(this.start_pos, this.start_pos);
      }
      if (this.key_code == 8){        
        obj.setSelectionRange(this.start_pos - 1, this.start_pos - 1);
      }
    })
  };

  setTime = (e) => {        
    if (e.target.value.length != 5) {      
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })
      this.change_flag = true;
      return;
    }    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })      
      return;
    }    
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    this.setState({entry_time:now})
    this.change_flag = true;
  }

  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let defaultRows = this.state.defaultRows;
    let rows = this.state.rows;
    let change_status = false;
    if (rows != undefined && rows != null && rows.length > 0) {
      rows.map((item, index) => {
        Object.keys(item).map((key) => {
          if (item[key] !== defaultRows[index][key]) {
            change_status = true;
          }
        });
      });
    }
    if(change_status){
      sessApi.setObjectValue("dial_change_flag", "patient_group", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
    var notice_message = '';
    var schedule_date = this.state.schedule_date;
    schedule_date.setHours(0);
    schedule_date.setMinutes(0);
    schedule_date.setSeconds(0);
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);    
    if (schedule_date.getTime() < now.getTime() - 2000){      
      notice_message = '※ 過去日付参照中';
    }
    return (
      <>
        <Card>
          <div className="title">患者グループ分け</div>
          <SearchPart>
            <div className="search-box">
              <div className="cur_date flex">
                <div className="prev-day" onClick={this.moveDay.bind(this, 'prev', change_status)}>{"< "}</div>
                <DatePicker
                  locale="ja"
                  selected={this.state.schedule_date}
                  onChange={this.getDate.bind(this, change_status)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={<ExampleCustomInput />}                  
                  dayClassName = {date => setDateColorClassName(date)}
                />
                <div className="next-day" onClick={this.moveDay.bind(this, 'next', change_status)}>{" >"}</div>
              </div>
              <div className="gender">
                <>
                  {this.state.time_zone_list != undefined && this.state.time_zone_list.length > 0 && this.state.time_zone_list.map((item) => {
                    return (
                      <>
                        <RadioButton
                          id={`male_${item.id}`}
                          value={item.id}
                          label={item.value}
                          name="usage"
                          getUsage={this.selectTimezone.bind(this, change_status)}
                          checked={this.state.timezone === item.id}
                        />
                      </>
                    );
                  })}
                  <span>{notice_message}</span>
                </>
              </div>
            </div>
          </SearchPart>
          <Wrapper>
            <div className="content">
              {this.state.load_flag ? (
                <ReactDataGrid
                  columns={this.columns}
                  rowGetter={(i) => this.state.rows[i]}
                  rowsCount={this.state.rows.length}
                  rowHeight={60}
                  dragable={false}
                  onGridRowsUpdated={this.onGridRowsUpdated}                  
                  enableCellSelect={notice_message != ''? false:true}
                  getCellActions={(column, row) =>
                    this.getCellActions(column, row)
                  }
                />
              ) : (
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </div>
            <div className={"input-area flex"}>
              <div className={"input-date"}>
                <InputWithLabel
                  label="入力日"
                  type="date"
                  getInputText={this.getValue.bind(this, "entry_date")}
                  diseaseEditData={this.state.entry_date}
                />
              </div>
              <div
                className="datepicker flex"
                onClick={this.changeTimeHeader.bind(this)}
              >
                <label style={{cursor:"text"}}>入力時間</label>
                <DatePicker
                  selected={this.state.entry_time}
                  onChange={this.getInputTime}
                  onKeyDown = {this.timeKeyEvent}
                  onBlur = {this.setTime}
                  value = {this.state.input_time_value}
                  id='entry_time_id'
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={10}
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                />
              </div>
              <div className="entry_name remove-x-input">
                <InputWithLabel
                  label="入力者"
                  type="text"
                  isDisabled={true}
                  diseaseEditData={authInfo != undefined && authInfo != null ? authInfo.name : ""}
                />
              </div>
              {authInfo != undefined && authInfo != null && authInfo.doctor_number > 0 ? (
                <div className="direct_man remove-x-input">
                  <InputWithLabel
                    label="指示者"
                    type="text"
                    isDisabled={true}
                    placeholder=""
                    diseaseEditData={this.state.doctor_list_by_number != undefined &&
                      this.state.doctor_list_by_number != null &&
                      this.state.directer_name > 0
                        ? this.state.doctor_list_by_number[
                            this.state.directer_name
                          ]
                        : ""
                    }
                  />
                </div>
              ) : (
                <div className="direct_man cursor-input remove-x-input" onClick={(e)=>this.showDoctorList(e).bind(this)}>
                  <InputWithLabel
                    label="指示者"
                    type="text"
                    placeholder=""
                    isDisabled={true}
                    diseaseEditData={
                      this.state.doctor_list_by_number != undefined &&
                      this.state.doctor_list_by_number != null &&
                      this.state.directer_name > 0
                        ? this.state.doctor_list_by_number[
                            this.state.directer_name
                          ]
                        : ""
                    }
                  />
                </div>
              )}
            </div>
            <div className="footer-buttons" style={{marginTop:"10px"}}>
              {change_status ? (
                <>
                  <Button className={'cancel-btn'} onClick={this.confirmReset.bind(this)}>リセット</Button>
                  <Button className={'disable-btn'} tooltip={'登録していない変更内容があります。'}>帳票プレビュー</Button>
                  <Button className={'red-btn'} onClick={this.openConfirmModal.bind(this)}>保存</Button>
                </>
              ):(
                <>
                  <Button className={'disable-btn'}>リセット</Button>
                  <Button className={this.state.load_flag ? 'red-btn' : 'disable-btn'} onClick={this.openPreviewModal.bind(this)}>帳票プレビュー</Button>
                  <Button className={'disable-btn'}>保存</Button>
                </>
              )}
            </div>
            {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk={this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                  title = {this.state.confirm_alert_title}
                />
              )}
            {this.state.isOpenPreviewModal !== false && (
              <PatientGroupPreviewModal
                closeModal={this.closeModal}
                print_data={this.state.rows}
                timezone = {this.state.timezone}
                schedule_date = {this.state.schedule_date}
              />
            )}
            {this.state.isShowDoctorList && (
              <DialSelectMasterModal
                selectMaster={this.selectDoctor}
                closeModal={this.closeModal}
                MasterCodeData={this.state.doctors}
                MasterName="医師"
              />
            )}
          </Wrapper>
        </Card>
      </>
    );
  }
}

export default PatientGroup;
