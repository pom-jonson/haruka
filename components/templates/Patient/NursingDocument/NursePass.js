import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {formatDateLine, formatDateSlash, formatJapanDateSlash, formatTime, formatTimeIE} from "~/helpers/date";
import Button from "~/components/atoms/Button";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import $ from "jquery";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import NursePassHistoryPrint from "~/components/templates/Patient/NursingDocument/NursePassHistoryPrint";
import {NurseRecordChangeLog} from "~/components/templates/Patient/NursingDocument/NurseRecordChangeLog";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import reactCSS from 'reactcss';
import ContentEditable from 'react-contenteditable';
import renderHTML from "react-render-html";
import {setDateColorClassName, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import NurseRecordDetail from "~/components/templates/Patient/NursingDocument/NurseRecordDetail";
registerLocale("ja", ja);

const Wrapper = styled.div`
  width: 100%;
  height:100%;
  font-size:${props=>(props.font_props !== undefined ? 0.875 * props.font_props + 'rem':'0.875rem')};
  font-family: MS Gothic;
  .select-nurse-problem {
    width: 100%;
    height:2rem;
    border-bottom:1px solid #aaa;
    margin-top: 4px;
    align-items: flex-start;
    justify-content: space-between;
    .pass-title {
      margin-left:0.5rem;
      height:2rem;
      line-height:2rem;
    }
    .select-problem {
      padding-left: 0.5rem;
      .label-title {display:none;}
      .pullbox-label {
        width: 100%;
        margin:0;
        .pullbox-select {
          font-size:${props=>(props.font_props !== undefined ? 0.875 * props.font_props + 'rem':'0.875rem')};
          width:100%;
          height:2rem;
        }
      }
    }
  }
  .select-record-date {
    width:100%;
    height:2rem;
    border-bottom: 1px solid #aaa;
    .date-title {
      height:2rem;
      line-height:2rem;
      margin: 0 0.5rem;
      width: 4rem;
    }
    .react-datepicker-wrapper input {
      width: 5rem;
      height: 2rem;
      font-size:${props=>(props.font_props !== undefined ? 0.875 * props.font_props + 'rem':'0.875rem')};
    }
    .input-time .react-datepicker-wrapper input{
      width: 3rem;
    }
  }
  .select-set {
    width: 100%;
    height:2.4rem;
    border-bottom:1px solid #aaa;
    .active-set {
      background: #a0ebff;
    }
    button {
      margin:0.2rem 0 0.2rem 0.5rem;
      span{font-family: "Noto Sans JP", sans-serif;}
    }
  }
  .content_editable_icon {
    display:flex;
    width: 100%;
    height:2.4rem;
    padding-left: calc(100% - 10rem);
    position:relative;
    border-bottom:1px solid #aaa;
    button {
      width: 2rem;
      font-weight: bold;
      height:2rem;
      line-height: 1.8rem;
      margin: 0.2rem 0px 0.2rem 0.5rem;
      font-family: "Noto Sans JP", sans-serif;
    }
    .color-icon {
      text-align: center;
      padding: 0;
    }
    .set-font-color {
      margin-bottom: 0;
      width: 100%;
      border-bottom: 2px solid;
      cursor: pointer;
      height: 100%;
      line-height: 1.8rem;
    }
    .color_picker_area {
      .color-block-area {
        background-color: white;
        border: 1px solid #aaa;
      }
      .color-block {
        width: 15px;
        margin: 4px;
        height: 15px;
        cursor: pointer;
      }
    }
    .font_select_area {
      right: 0rem !important;
      left: auto;
      border: 1px solid #aaa;
      width: 2rem;
      border-top: none;
      .font-block-area {
        background-color: white;
      }
      .font-block {
        cursor: pointer;
        border-top: 1px solid #aaa;
        text-align: center;
      }
    }
  }
  .pass-input {
    width:100%;
    height: 20rem;
    .soap-data{
      width: 100%;
      height: 100%;
      tbody {
        height: 20rem;
        overflow-y: scroll;
        display: block;
      }
      tr {
        flex-wrap: nowrap;
        display: table;
        width: 100%;
      }
      th {
        width: 3rem;
        background: rgb(230, 230, 230);
        text-align: center;
        border: 1px solid rgb(213, 213, 213);
        padding: 0.2rem;
      }
      tr:nth-child(2n) {background: #f7f7f7;}
      td{
        padding: 0px !important;
        width: calc(100% - 3rem);
        flex: 1 1 0%;
        border: 1px solid rgb(213, 213, 213);
        padding: 0px 0.2rem !important;
      }
      .content_editable_area {
        min-height: 4rem;
        width:100%;
        word-break: break-all;
        font-family: MS Gothic,monospace;
        p {margin:0;}
      }
      em, i {font-family:"ＭＳ Ｐゴシック";}
    }
  }
  .record-input {
    width:100%;
    height: 20rem;
    border: solid 1px gray;
    overflow-y: auto;
    textarea {
      width:100%;
      height:100%;
      overflow:hidden;
    }
  }
  .passing-history {
    width:100%;
    height: calc(100% - 32rem);
    overflow-y: auto;
    .data-title{
      border: 1px solid rgb(213,213,213);
      background: linear-gradient(#d0cfcf, #e6e6e7);
      cursor: pointer;
      .data-item {
        padding: 0.25rem 2rem 0.25rem 0.5rem;
        position: relative;
        cursor: pointer;
        &.open {
          .angle {
            transform: rotate(180deg);
          }
        }
      }
      .department{
        margin-left: auto;
      }
    }
    table {
      margin:0px;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc((100vh - 120px) - 34.5rem);
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
        padding: 0.2rem;
        word-break: break-all;
        vertical-align: top;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
      }
      th {
        text-align: center;
        padding: 0.2rem 0;
        border-bottom: none;
        border-top: none;
        font-weight: normal;
      }
      .td-date-time {
        // width:8rem;
      }
      .td-problem {
        width:2.5rem;
      }
      .td-content {
        width:20rem;
      }
      .pass-item {
        width:calc(20rem - 1px);
        border-top:1px solid #eaeaea;
      }
      .pass-label {
        width:2rem;
        text-align:center;
        border-right:1px solid #dee2e6;
        padding:0.2rem;
      }
      .pass-content {
        width:calc(100% - 2rem);
        padding:0.2rem;
        font-family: "MS Gothic", monospace;
        p {margin:0;}
      }
      .pass-created {
        text-align:right;
        width:calc(100% - 2rem);
        padding:0.2rem;
      }
    }
  }
  .red-btn {
    background: #cc0000;
    border:2px solid #cc0000;
    span {
      color: #ffffff;
      font-size: 1rem;
    }
    min-width: 3rem;
    line-height: 2rem;
    padding: 0 0.5rem;
  }
  .red-btn:hover {
    background: #e81123;
    span {
      color: #ffffff;
      font-size: 1rem;
    }
  }
`;

const SpinnerWrapper = styled.div`
  width:100%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.div`
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
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.5rem;
      font-size: 1rem;
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
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

const ContextMenu = ({visible, x, y, menu_type, menu_value, can_edit_flag, can_delete_flag, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {menu_type === 'input' ? (
            <>
              <li><div onClick={()=>parent.contextMenuAction("clipboard_copy", menu_value)} onMouseOver = {()=>parent.contextMenuAction("close_hover_menu")}>貼り付け</div></li>
              <li className={'vital-hover-menu'}><div onMouseOver={e => parent.viewHover(e, menu_value)}>最新のバイタルを貼り付け</div></li>
            </>
          ):(
            <>
              {can_edit_flag && (
                <li><div onClick={() => parent.contextMenuAction("record_edit", menu_value)}>編集</div></li>
              )}
              {can_delete_flag && (
                <li><div onClick={() => parent.contextMenuAction("record_delete", menu_value)}>削除</div></li>
              )}
              {/*<li><div onClick={() => parent.contextMenuAction("view_record_detail", menu_value)}>詳細</div></li>*/}
              <li><div onClick={() => parent.contextMenuAction("view_history", menu_value)}>変更履歴</div></li>
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const HoverMenu = ({visible, x, y, passing_of_time_type_id, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={()=>parent.contextMenuAction("copy_vital", "temperature", passing_of_time_type_id)}>体温</div></li>
          <li><div onClick={()=>parent.contextMenuAction("copy_vital", "max_blood", passing_of_time_type_id)}>血圧高</div></li>
          <li><div onClick={()=>parent.contextMenuAction("copy_vital", "min_blood", passing_of_time_type_id)}>血圧低</div></li>
          <li><div onClick={()=>parent.contextMenuAction("copy_vital", "pluse", passing_of_time_type_id)}>脈拍</div></li>
          <li><div onClick={()=>parent.contextMenuAction("copy_vital", "height", passing_of_time_type_id)}>身長</div></li>
          <li><div onClick={()=>parent.contextMenuAction("copy_vital", "weight", passing_of_time_type_id)}>体重</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class NursePass extends Component {
  constructor(props) {
    super(props);
    let nurse_record = localApi.getObject("nurse_record");
    nurse_record = nurse_record !== undefined ? nurse_record : null;
    let cur_date = new Date();
    let record_date = nurse_record != null ? new Date(nurse_record.record_date) : cur_date;
    let record_date_time = nurse_record != null ? new Date(nurse_record.record_date_time) : cur_date;
    this.state ={
      number:nurse_record != null ? nurse_record.number : 0,
      passing_records:[],
      nursing_problems:[{id:0, value:"未選択"}],
      load_flag:false,
      confirm_message:"",
      confirm_type: "",
      confirm_title:'',
      confirm_value:null,
      view_count:20,
      isOpenNursePassHistoryPrint:false,
      isOpenNurseRecordChangeLog:false,
      nursing_problem_id:nurse_record != null ? nurse_record.passing_of_time : 0,
      contextMenu:{visible: false},
      hoverMenu:{visible: false},
      passing_of_time_type_set_master:[],
      passing_of_time_type_set_id:0,
      passing_of_time_type_master:[],
      passing_of_time:nurse_record != null ? nurse_record.passing_of_time : {},
      record_date,
      record_date_time,
      record_date_time_value:nurse_record != null ? nurse_record.record_date_time_value : formatTime(record_date),
      alert_messages:"",
      isOpenNurseRecordDetail:false,
    };
    this.passing_of_time = nurse_record != null ? nurse_record.init_passing_of_time : {};
    this.open_nurse_record = nurse_record != null ? nurse_record.open_nurse_record : {};
    this.change_flag = nurse_record != null ? nurse_record.change_flag : 0;
    this.soap_font_color = nurse_record != null ? nurse_record.soap_font_color : "#000000";
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.nurse_record_date_change_limit = 8;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.nurse_record_date_change_limit !== undefined){
      this.nurse_record_date_change_limit = initState.conf_data.nurse_record_date_change_limit;
    }
    let record_min_date = new Date(cur_date.getTime() - (1000*60*60*this.nurse_record_date_change_limit));
    this.record_min_date = nurse_record != null ? new Date(nurse_record.record_min_date) : record_min_date;
    this.record_max_date = nurse_record != null ? new Date(nurse_record.record_max_date) : cur_date;
    this.disable_input_record_date = false;
    if(nurse_record == null){
      this.record_max_time = new Date(cur_date);
      if(formatDateLine(this.record_min_date) == formatDateLine(this.record_max_date)){
        this.disable_input_record_date = true;
        let record_min_time = new Date();
        record_min_time.setHours(record_min_date.getHours());
        record_min_time.setMinutes(record_min_date.getMinutes());
        record_min_time.setSeconds(record_min_date.getSeconds());
        this.record_min_time = record_min_time;
      } else {
        let record_min_time = new Date();
        record_min_time.setHours(0);
        record_min_time.setMinutes(0);
        record_min_time.setSeconds(0);
        this.record_min_time = record_min_time;
      }
    } else {
      //
    }
    this.staff_list = [];
    let staff_list = sessApi.getStaffList();
    if(staff_list !== undefined && staff_list != null && Object.keys(staff_list).length > 0){
      Object.keys(staff_list).map(staff_number=>{
        this.staff_list[staff_number] = staff_list[staff_number]['name'];
      });
    }
    this.drag_value = "";
    this.color_styles = reactCSS({
      'default': {
        popover: {
          position: 'absolute',
          zIndex: '1050',
          top:'2.2rem',
          display: 'none',
          right: '2.5rem',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    this.passing_of_time_type_master = [];
    this.passing_of_time_type_set_item_master = [];
    this.passing_of_time_type_label = {};
    this.change_record_date_auth = false;
  }
  
  async componentDidMount() {
    if(this.state.number > 0){
      this.change_record_date_auth = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.EDIT_OLD);
    } else {
      this.change_record_date_auth = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.REGISTER_OLD);
    }
    if(this.change_record_date_auth){
      let record_min_time = new Date();
      record_min_time.setHours(0);
      record_min_time.setMinutes(0);
      record_min_time.setSeconds(0);
      this.record_min_time = record_min_time;
    }
    await this.getNurseRecordHistory();
    let elements = document.getElementsByClassName("content_editable_area");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', this.getSeleteTag, false);
    }
  }
  
  handleScroll = () => {
    let passing_records = this.state.passing_records;
    if (this.state.view_count >= passing_records.length) {return;}
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let history_list_height = $("#history_list").height();
    if ((($("#history_list").scrollTop() + history_list_height) >= (history_list_height - 100))){
      this.setState({view_count: this.state.view_count + 20});
    }
  }
  
  saveCacheData=()=>{
    let nurse_record = {
      init_passing_of_time:this.passing_of_time,
      passing_of_time:this.state.passing_of_time,
      number:this.state.number,
      open_nurse_record:this.open_nurse_record,
      change_flag:this.change_flag,
      nursing_problem_id:this.state.nursing_problem_id,
      passing_of_time_type_set_id:this.state.passing_of_time_type_set_id,
      soap_font_color:this.soap_font_color,
      record_date:formatDateSlash(this.state.record_date) + " " + formatTimeIE(this.state.record_date) + ":00",
      record_date_time:formatDateSlash(this.state.record_date_time) + " " + formatTimeIE(this.state.record_date_time) + ":00",
      record_date_time_value:this.state.record_date_time_value,
      record_min_date:formatDateSlash(this.record_min_date) + " " + formatTimeIE(this.record_min_date) + ":00",
      record_max_date:formatDateSlash(this.record_max_date) + " " + formatTimeIE(this.record_max_date) + ":00",
      record_min_time:formatDateSlash(this.record_min_time) + " " + formatTimeIE(this.record_min_time) + ":00",
      record_max_time:formatDateSlash(this.record_max_time) + " " + formatTimeIE(this.record_max_time) + ":00",
    };
    localApi.setObject("nurse_record", nurse_record);
  }
  
  getNurseRecordHistory=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nurse/record/get_history";
    let post_data = {
      hos_number:this.props.hos_number,
      patient_id:this.props.patientId,
      include_delete_data:this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.SHOW_DELETE)
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let nursing_problems = [{id:0, value:"未選択"}];
        if(res.nursing_problems.length > 0){
          res.nursing_problems.map((item, index)=>{
            nursing_problems.push({id:item.number, value:'#'+(index + 1) + ' ' + item.name});
          });
        }
        let passing_records = res.passing_of_time;
        if(passing_records.length > 0){
          passing_records.map(record=>{
            let nursing_problem_name = "";
            if(record.nursing_problem_id != null && record.nursing_problem_id != 0){
              if(nursing_problems.length > 0){
                nursing_problems.map((item, index)=>{
                  if(item.id == record.nursing_problem_id){
                    nursing_problem_name = '#' + index;
                  }
                });
              }
            }
            record.nursing_problem_name = nursing_problem_name;
          });
        }
        let passing_of_time_type_set_id = this.state.passing_of_time_type_set_id;
        if(passing_of_time_type_set_id == 0 && res.passing_of_time_type_set_master.length > 0){
          passing_of_time_type_set_id = res.passing_of_time_type_set_master[0].number;
        }
        this.passing_of_time_type_set_item_master = res.passing_of_time_type_set_item_master;
        this.passing_of_time_type_master = res.passing_of_time_type_master;
        let passing_of_time_type_ids = [];
        if(passing_of_time_type_set_id != 0 && res.passing_of_time_type_set_item_master.length > 0){
          res.passing_of_time_type_set_item_master.map(set_item=>{
            if(set_item.passing_of_time_type_set_id == passing_of_time_type_set_id){
              passing_of_time_type_ids.push(set_item.passing_of_time_type_id);
            }
          });
        }
        let passing_of_time_type_master = [];
        let passing_of_time = this.state.passing_of_time;
        if(res.passing_of_time_type_master.length > 0){
          res.passing_of_time_type_master.map(item=>{
            this.passing_of_time_type_label[item.number] = item.label;
            if(passing_of_time_type_ids.length > 0 && passing_of_time_type_ids.includes(item.number)){
              passing_of_time_type_master.push(item);
              if(this.change_flag == 0 && this.state.number == 0){
                passing_of_time[item.number] = "";
              }
            }
          });
        }
        if(this.change_flag == 0 && this.state.number == 0){
          this.passing_of_time = JSON.parse(JSON.stringify(passing_of_time));
        }
        this.setState({
          load_flag:true,
          passing_of_time,
          nursing_problems,
          passing_records,
          passing_of_time_type_set_master:res.passing_of_time_type_set_master,
          passing_of_time_type_set_id,
          passing_of_time_type_master,
        }, ()=>{
          if(this.change_flag == 0 && this.state.number == 0){
            this.saveCacheData();
          }
          if(passing_records.length > 0){
            /*@cc_on _d = document; eval ( 'var document = _d') @*/
            document
              .getElementById("history_list")
              .addEventListener("scroll", this.handleScroll);
          }
          if(passing_of_time_type_master.length > 0){
            let elements = document.getElementsByClassName("content_editable_area");
            for (let i = 0; i < elements.length; i++) {
              elements[i].style['min-height'] = "calc((20rem - " + (elements.length * 2) + "px) / " + elements.length + ")";
            }
          }
        });
      })
      .catch(() => {
      });
  }
  
  registerNurseRecord=async()=>{
    let path = "/app/api/v2/nurse/record/register";
    let post_data = {
      number:this.state.number,
      hospitalization_id:this.props.hos_number,
      passing_of_time:this.state.passing_of_time,
      nursing_problem_id:this.state.nursing_problem_id,
      record_date:formatDateSlash(this.state.record_date) + " " + formatTimeIE(this.state.record_date_time)
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then(() => {
        this.props.finishRegister();
        this.passing_of_time = {};
        this.change_flag = 0;
        this.props.setChangeStatus(this.change_flag);
        this.disable_input_record_date = false;
        let cur_date = new Date();
        let record_min_date = new Date(cur_date.getTime() - (1000*60*60*this.nurse_record_date_change_limit));
        this.record_min_date = record_min_date;
        this.record_max_date = cur_date;
        this.record_max_time = new Date(cur_date);
        this.change_record_date_auth = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.REGISTER_OLD);
        if(this.change_record_date_auth){
          let record_min_time = new Date();
          record_min_time.setHours(0);
          record_min_time.setMinutes(0);
          record_min_time.setSeconds(0);
          this.record_min_time = record_min_time;
        } else {
          if(formatDateLine(this.record_min_date) == formatDateLine(this.record_max_date)){
            this.disable_input_record_date = true;
            let record_min_time = new Date();
            record_min_time.setHours(record_min_date.getHours());
            record_min_time.setMinutes(record_min_date.getMinutes());
            record_min_time.setSeconds(record_min_date.getSeconds());
            this.record_min_time = record_min_time;
          } else {
            let record_min_time = new Date();
            record_min_time.setHours(0);
            record_min_time.setMinutes(0);
            record_min_time.setSeconds(0);
            this.record_min_time = record_min_time;
          }
        }
        this.setState({
          number:0,
          passing_of_time:{},
          nursing_problem_id:0,
          load_flag:false,
          record_date:cur_date,
          record_date_time:cur_date,
          record_date_time_value:formatTime(cur_date),
        }, ()=>{
          this.getNurseRecordHistory();
        });
      })
      .catch(() => {
      
      });
  }
  
  onAngleClicked = (e, record_data) => {
    let obj = $(e.target);
    while(!obj.hasClass("data-title") && obj.get(0).nodeName.toLowerCase() != "body"){
      obj=obj.parent();
    }
    let next_obj = obj.next();
    let obj_item = $("div.data-item", obj);
    if(obj_item.hasClass("open")){
      obj_item.removeClass("open");
      next_obj.hide();
    } else {
      next_obj.show();
      obj_item.addClass("open");
    }
    if(this.open_nurse_record[record_data.number] !== undefined){
      this.open_nurse_record[record_data.number] = this.open_nurse_record[record_data.number] == 1 ? 0 : 1;
    } else {
      this.open_nurse_record[record_data.number] = 0;
    }
  }
  
  handleClick=(e, menu_type, menu_value)=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    if(this.state.passing_of_time_type_master.length > 0){
      document
        .getElementById("soap_data")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({contextMenu: {visible: false}});
          document
            .getElementById("soap_data")
            .removeEventListener(`scroll`, onScrollOutside);
        });
    }
    if(this.state.passing_records.length > 0){
      document
        .getElementById("history_list")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({contextMenu: {visible: false}});
          document
            .getElementById("history_list")
            .removeEventListener(`scroll`, onScrollOutside);
        });
    }
    let clientX = e.clientX;
    let clientY = e.clientY;
    let nurse_passing_left = $('#nurse-passing').offset().left;
    let can_edit_flag = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.EDIT) || this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.EDIT_OLD);
    let can_delete_flag = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.DELETE);
    if(menu_type === "history" && menu_value.is_enabled == 2){
      can_edit_flag = false;
      can_delete_flag = false;
    }
    let state_data = {};
    state_data.contextMenu = {
      visible: true,
      x: clientX,
      y: clientY + window.pageYOffset,
      menu_type,
      menu_value,
      can_edit_flag,
      can_delete_flag,
    };
    state_data.hoverMenu = {visible:false};
    this.props.closeRightClickMenu('right');
    this.setState(state_data,()=>{
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      let nurse_passing_width = document.getElementsByClassName("nurse-passing")[0].offsetWidth;
      let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
      let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
      let window_height = window.innerHeight;
      if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > (nurse_passing_left + nurse_passing_width))) {
        state_data.contextMenu.x = clientX - menu_width;
        state_data.contextMenu.y = clientY - menu_height + window.pageYOffset;
        this.setState(state_data);
      } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < (nurse_passing_left + nurse_passing_width))) {
        state_data.contextMenu.y = clientY - menu_height + window.pageYOffset;
        this.setState(state_data);
      } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > (nurse_passing_left + nurse_passing_width))) {
        state_data.contextMenu.x = clientX - menu_width;
        this.setState(state_data);
      }
    });
  }
  
  contextMenuAction=(act, menu_value, menu_value2)=>{
    if(act === "record_edit"){
      if(Object.keys(this.state.passing_of_time).length > 0 && this.change_flag == 1){
        this.setState({
          confirm_type: "record_edit",
          confirm_title:'記入あり確認',
          confirm_message:"記入中の内容があります。破棄して展開しますか？",
          confirm_value:menu_value,
        });
      } else {
        this.editRecord(menu_value, "edit");
      }
    } else if(act === "record_delete"){
      this.setState({
        confirm_type: "record_delete",
        confirm_title:'削除確認',
        confirm_message:"削除しますか？",
        confirm_value:menu_value.number,
      });
    } else if(act === "view_record_detail"){
      this.setState({
        isOpenNurseRecordDetail:true,
        record_data:menu_value,
      });
    } else if(act === "view_history"){
      this.setState({
        isOpenNurseRecordChangeLog:true,
        history_numbers:menu_value.history == null ? menu_value.number : menu_value.history,
      });
    } else if(act === "clipboard_copy"){
      // get clipboard content
      let clipboard_data = "";
      if (window.clipboardData) {
        clipboard_data = window.clipboardData.getData("Text");
      }
      if(clipboard_data !== ""){
        this.copyPassingOfTime(clipboard_data, menu_value);
      }
    } else if(act === "copy_vital"){
      let vital_amount = this.props.patientInfo[menu_value];
      let value = "";
      if(parseInt(vital_amount) >= 0) {
        switch(menu_value){
          case 'height':
            value = ('身長 ' + vital_amount + 'cm');
            break;
          case 'max_blood':
            value = ('最高血圧 ' + vital_amount + 'mmgh');
            break;
          case 'min_blood':
            value = ('最低血圧 ' + vital_amount + 'mmgh');
            break;
          case 'pluse':
            value = ('脈拍 ' + vital_amount + 'bpm');
            break;
          case 'temperature':
            value = ('体温 ' + vital_amount + '℃');
            break;
          case 'weight':
            value = ('体重 ' + vital_amount + 'kg');
            break;
        }
      }
      if(value !== ""){
        this.copyPassingOfTime(value, menu_value2);
      }
    } else if(act === "close_hover_menu"){
      if(this.state.hoverMenu.visible){
        this.setState({hoverMenu:{visible:false}});
      }
    }
  }
  
  confirmCancel=()=>{
    this.setState({
      confirm_message:"",
      confirm_type: "",
      confirm_title:'',
      alert_messages:'',
      confirm_value:null,
      isOpenNursePassHistoryPrint:false,
      isOpenNurseRecordChangeLog:false,
      isOpenNurseRecordDetail:false,
    });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "record_edit"){
      this.editRecord(this.state.confirm_value, "edit");
    }
    if(this.state.confirm_type === "record_delete"){
      this.deleteRecord(this.state.confirm_value);
    }
    if(this.state.confirm_type === "record_copy"){
      this.editRecord(this.state.confirm_value, "copy");
    }
    if(this.state.confirm_type === "set_change"){
      this.selectSet(this.state.confirm_value);
    }
  }
  
  deleteRecord=async(number)=>{
    this.setState({
      confirm_type: "",
      confirm_title:'',
      confirm_message:"",
    });
    let path = "/app/api/v2/nurse/record/delete";
    let post_data = {
      number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then(() => {
        let state_data = {};
        if(number == this.state.number){
          this.passing_of_time = {};
          this.change_flag = 0;
          this.props.setChangeStatus(this.change_flag);
          this.disable_input_record_date = false;
          let cur_date = new Date();
          let record_min_date = new Date(cur_date.getTime() - (1000*60*60*this.nurse_record_date_change_limit));
          this.record_min_date = record_min_date;
          this.record_max_date = cur_date;
          this.record_max_time = new Date(cur_date);
          this.change_record_date_auth = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.REGISTER_OLD);
          if(this.change_record_date_auth){
            let record_min_time = new Date();
            record_min_time.setHours(0);
            record_min_time.setMinutes(0);
            record_min_time.setSeconds(0);
            this.record_min_time = record_min_time;
          } else {
            if(formatDateLine(this.record_min_date) == formatDateLine(this.record_max_date)){
              this.disable_input_record_date = true;
              let record_min_time = new Date();
              record_min_time.setHours(record_min_date.getHours());
              record_min_time.setMinutes(record_min_date.getMinutes());
              record_min_time.setSeconds(record_min_date.getSeconds());
              this.record_min_time = record_min_time;
            } else {
              let record_min_time = new Date();
              record_min_time.setHours(0);
              record_min_time.setMinutes(0);
              record_min_time.setSeconds(0);
              this.record_min_time = record_min_time;
            }
          }
          state_data.number = 0;
          state_data.passing_of_time = {};
          state_data.nursing_problem_id = 0;
          state_data.record_date = cur_date;
          state_data.record_date_time = cur_date;
          state_data.record_date_time_value = formatTime(cur_date);
        }
        state_data.load_flag = false;
        this.setState(state_data, ()=>{
          this.getNurseRecordHistory();
        });
      })
      .catch(() => {
      });
  }
  
  editRecord=(record_data, act)=>{
    let passing_of_time = {};
    let passing_of_time_type_set_id = 0;
    if(record_data.passing_of_time.length > 0){
      record_data.passing_of_time.map(item=>{
        if(passing_of_time_type_set_id == 0){
          passing_of_time_type_set_id = (this.passing_of_time_type_set_item_master.find((x) => x.passing_of_time_type_id == item.passing_of_time_type_id) !== undefined) ?
            this.passing_of_time_type_set_item_master.find((x) => x.passing_of_time_type_id == item.passing_of_time_type_id).passing_of_time_type_set_id : 0;
        }
        passing_of_time[item.passing_of_time_type_id] = item.passing_of_time;
      });
    }
    let passing_of_time_type_master = this.state.passing_of_time_type_master;
    if(passing_of_time_type_set_id != this.state.passing_of_time_type_set_id){
      passing_of_time_type_master = [];
      let passing_of_time_type_ids = [];
      if(this.passing_of_time_type_set_item_master.length > 0){
        this.passing_of_time_type_set_item_master.map(set_item=>{
          if(set_item.passing_of_time_type_set_id == passing_of_time_type_set_id){
            passing_of_time_type_ids.push(set_item.passing_of_time_type_id);
          }
        });
      }
      if(passing_of_time_type_ids.length > 0 && this.passing_of_time_type_master.length > 0){
        this.passing_of_time_type_master.map(item=>{
          if(passing_of_time_type_ids.includes(item.number)){
            passing_of_time_type_master.push(item);
          }
        });
      }
    }
    this.passing_of_time = act === "copy" ? {} : passing_of_time;
    this.disable_input_record_date = false;
    let cur_date = new Date();
    if(act === "copy"){
      let record_min_date = new Date(cur_date.getTime() - (1000*60*60*this.nurse_record_date_change_limit));
      this.record_min_date = record_min_date;
      this.record_max_date = cur_date;
      this.record_max_time = new Date(cur_date);
      this.change_record_date_auth = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.REGISTER_OLD);
      if(this.change_record_date_auth){
        let record_min_time = new Date();
        record_min_time.setHours(0);
        record_min_time.setMinutes(0);
        record_min_time.setSeconds(0);
        this.record_min_time = record_min_time;
      } else {
        if(formatDateLine(this.record_min_date) == formatDateLine(this.record_max_date)){
          this.disable_input_record_date = true;
          let record_min_time = new Date();
          record_min_time.setHours(record_min_date.getHours());
          record_min_time.setMinutes(record_min_date.getMinutes());
          record_min_time.setSeconds(record_min_date.getSeconds());
          this.record_min_time = record_min_time;
        } else {
          let record_min_time = new Date();
          record_min_time.setHours(0);
          record_min_time.setMinutes(0);
          record_min_time.setSeconds(0);
          this.record_min_time = record_min_time;
        }
      }
    } else {
      let record_min_date = new Date(new Date(record_data.created_at.split('-').join('/')).getTime() - (1000*60*60*this.nurse_record_date_change_limit));
      this.record_min_date = new Date(record_min_date);
      this.record_max_date = new Date(record_data.created_at.split('-').join('/'));
      this.change_record_date_auth = this.context.$canDoAction(this.context.FEATURES.NURSE_RECORD, this.context.AUTHS.EDIT_OLD);
      if(this.change_record_date_auth){
        let record_min_time = new Date();
        record_min_time.setHours(0);
        record_min_time.setMinutes(0);
        record_min_time.setSeconds(0);
        this.record_min_time = record_min_time;
        if(formatDateLine(new Date(record_data.record_date.split('-').join('/'))) == formatDateLine(this.record_max_date)){
          let record_max_time = new Date();
          record_max_time.setHours(this.record_max_date.getHours());
          record_max_time.setMinutes(this.record_max_date.getMinutes());
          record_max_time.setSeconds(this.record_max_date.getSeconds());
          this.record_max_time = record_max_time;
        } else {
          let record_max_time = new Date();
          record_max_time.setHours(23);
          record_max_time.setMinutes(59);
          record_max_time.setSeconds(59);
          this.record_max_time = record_max_time;
        }
      } else {
        if(formatDateLine(this.record_min_date) == formatDateLine(this.record_max_date)){
          this.disable_input_record_date = true;
          let record_min_time = new Date();
          record_min_time.setHours(record_min_date.getHours());
          record_min_time.setMinutes(record_min_date.getMinutes());
          record_min_time.setSeconds(record_min_date.getSeconds());
          this.record_min_time = record_min_time;
          let record_max_time = new Date();
          record_max_time.setHours(this.record_max_date.getHours());
          record_max_time.setMinutes(this.record_max_date.getMinutes());
          record_max_time.setSeconds(this.record_max_date.getSeconds());
          this.record_max_time = record_max_time;
        } else {
          if(formatDateLine(new Date(record_data.record_date.split('-').join('/'))) == formatDateLine(this.record_max_date)){
            let record_min_time = new Date();
            record_min_time.setHours(0);
            record_min_time.setMinutes(0);
            record_min_time.setSeconds(0);
            this.record_min_time = record_min_time;
            let record_max_time = new Date();
            record_max_time.setHours(this.record_max_date.getHours());
            record_max_time.setMinutes(this.record_max_date.getMinutes());
            record_max_time.setSeconds(this.record_max_date.getSeconds());
            this.record_max_time = record_max_time;
          } else if(formatDateLine(new Date(record_data.record_date.split('-').join('/'))) == formatDateLine(this.record_min_date)){
            let record_min_time = new Date();
            record_min_time.setHours(record_min_date.getHours());
            record_min_time.setMinutes(record_min_date.getMinutes());
            record_min_time.setSeconds(record_min_date.getSeconds());
            this.record_min_time = record_min_time;
            let record_max_time = new Date();
            record_max_time.setHours(23);
            record_max_time.setMinutes(59);
            record_max_time.setSeconds(59);
            this.record_max_time = record_max_time;
          } else {
            let record_min_time = new Date();
            record_min_time.setHours(0);
            record_min_time.setMinutes(0);
            record_min_time.setSeconds(0);
            this.record_min_time = record_min_time;
            let record_max_time = new Date();
            record_max_time.setHours(23);
            record_max_time.setMinutes(59);
            record_max_time.setSeconds(59);
            this.record_max_time = record_max_time;
          }
        }
      }
    }
    this.change_flag = act === "copy" ? 1 : 0;
    this.props.setChangeStatus(this.change_flag);
    let record_date = cur_date;
    let record_date_time = cur_date;
    if(act === "edit"){
      record_date = new Date(record_data.record_date.split('-').join('/'));
      record_date_time = new Date();
      record_date_time.setHours(record_date.getHours());
      record_date_time.setMinutes(record_date.getMinutes());
      record_date_time.setSeconds(record_date.getSeconds());
    }
    this.setState({
      number:act === "copy" ? 0 : record_data.number,
      record_date,
      record_date_time,
      record_date_time_value:act === "copy" ? formatTime(cur_date) : formatTime(record_date),
      passing_of_time:JSON.parse(JSON.stringify(passing_of_time)),
      nursing_problem_id:record_data.nursing_problem_id,
      passing_of_time_type_set_id,
      passing_of_time_type_master,
      confirm_message:"",
      confirm_type: "",
      confirm_title:'',
      confirm_value:null,
    }, ()=>{
      this.saveCacheData();
      if(passing_of_time_type_master.length > 0){
        let elements = document.getElementsByClassName("content_editable_area");
        for (let i = 0; i < elements.length; i++) {
          elements[i].style['min-height'] = "calc((20rem - " + (elements.length * 2) + "px) / " + elements.length + ")";
        }
      }
    });
  }
  
  onDragStart=async(e, record_index) => {
    let before_data = "";
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    if(window.clipboardData) {
      before_data = window.clipboardData.getData("Text");
    }
    this.drag_value = record_index;
    // e.dataTransfer.setData("text", record_index.toString());
    if(window.clipboardData) {
      window.clipboardData.setData("Text", before_data);
    }
    e.stopPropagation();
  }
  
  onDragOver=(e)=> {
    e.preventDefault();
  };
  
  onDropEvent=async() => {
    let record_data = this.state.passing_records[this.drag_value];
    if(record_data === undefined){return;}
    if(Object.keys(this.state.passing_of_time).length > 0 && this.change_flag == 1){
      this.setState({
        confirm_type: "record_copy",
        confirm_title:'記入あり確認',
        confirm_message:"記入中の内容があります。破棄して展開しますか？",
        confirm_value:record_data,
      });
    } else {
      this.editRecord(record_data, "copy");
    }
    this.drag_value = "";
  }
  
  openNursePassHistoryPrint=()=>{
    this.setState({isOpenNursePassHistoryPrint:true});
  }
  
  getHistoryInfo=(history)=>{
    let history_arr = history == null ? [] : history.split(',');
    let history_length = history_arr.length == 0 ? 1 : history_arr.length;
    return ((history_length > 9) ? history_length : "0"+history_length)+"版 ";
  }
  
  setSelectValue = (key, e) => {
    this.change_flag = 1;
    this.props.setChangeStatus(this.change_flag);
    this.setState({[key]:parseInt(e.target.id)}, ()=>{
      this.saveCacheData();
    });
  };
  
  copyPassingOfTime=(value, passing_of_time_type_id)=>{
    let passing_of_time = this.state.passing_of_time;
    let temp = passing_of_time[passing_of_time_type_id] === undefined ? "" : passing_of_time[passing_of_time_type_id];
    temp += this.convertBR(value);
    passing_of_time[passing_of_time_type_id] = temp;
    this.change_flag = 0;
    Object.keys(passing_of_time).map(type_id=>{
      if(this.passing_of_time[type_id] != passing_of_time[type_id]){
        this.change_flag = 1;
      }
    });
    this.props.setChangeStatus(this.change_flag);
    this.setState({passing_of_time}, ()=>{
      this.saveCacheData();
    });
  }
  
  closeRightClickMenu=()=>{
    if(this.state.contextMenu.visible || this.state.hoverMenu.visible){
      this.setState({
        contextMenu:{visible:false},
        hoverMenu:{visible:false},
      });
    }
  }
  
  viewHover=(e, passing_of_time_type_id) => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    if(this.state.passing_records.length > 0){
      document
        .getElementById("history_list")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({hoverMenu: {visible: false}});
          document
            .getElementById("history_list")
            .removeEventListener(`scroll`, onScrollOutside);
        });
    }
    let nurse_passing_width = document.getElementsByClassName("nurse-passing")[0].offsetWidth;
    let context_menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
    let context_menu_left = document.getElementsByClassName('context-menu')[0].offsetLeft;
    let context_menu_top = document.getElementsByClassName('context-menu')[0].offsetTop;
    let menu_top = document.getElementsByClassName('vital-hover-menu')[0].offsetTop;
    let nurse_passing_left = $('#nurse-passing').offset().left;
    let state_data = {};
    state_data.hoverMenu = {
      visible: true,
      x: context_menu_left + context_menu_width,
      y: context_menu_top + menu_top,
      passing_of_time_type_id,
    };
    this.props.closeRightClickMenu('right');
    this.setState(state_data,()=>{
      /*@cc_on _d = document; eval ( 'var document = _d') @*/
      let menu_width = document.getElementsByClassName("hover-menu")[0].offsetWidth;
      if ((context_menu_left + context_menu_width + menu_width) > (nurse_passing_left + nurse_passing_width)) {
        state_data['hoverMenu']['x'] = context_menu_left - menu_width;
        this.setState(state_data);
      }
    });
  }
  
  confirmSetChange=(passing_of_time_type_set_id)=>{
    if(passing_of_time_type_set_id == this.state.passing_of_time_type_set_id){return;}
    if(this.change_flag == 1){
      this.setState({
        confirm_type:"set_change",
        confirm_title:"入力中",
        confirm_message:"入力中の内容があります。破棄して記載セットを切り替えますか？",
        confirm_value:passing_of_time_type_set_id
      });
    } else {
      this.selectSet(passing_of_time_type_set_id);
    }
  }
  
  selectSet=(passing_of_time_type_set_id)=>{
    let passing_of_time_type_ids = [];
    if(this.passing_of_time_type_set_item_master.length > 0){
      this.passing_of_time_type_set_item_master.map(set_item=>{
        if(set_item.passing_of_time_type_set_id == passing_of_time_type_set_id){
          passing_of_time_type_ids.push(set_item.passing_of_time_type_id);
        }
      });
    }
    let passing_of_time_type_master = [];
    let passing_of_time = {};
    if(passing_of_time_type_ids.length > 0 && this.passing_of_time_type_master.length > 0){
      this.passing_of_time_type_master.map(item=>{
        if(passing_of_time_type_ids.includes(item.number)){
          passing_of_time_type_master.push(item);
          passing_of_time[item.number] = "";
        }
      });
    }
    this.change_flag = 0;
    this.props.setChangeStatus(this.change_flag);
    this.setState({
      passing_of_time_type_set_id,
      passing_of_time_type_master,
      passing_of_time,
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
    }, ()=>{
      this.saveCacheData();
      if(passing_of_time_type_master.length > 0){
        let elements = document.getElementsByClassName("content_editable_area");
        for (let i = 0; i < elements.length; i++) {
          elements[i].style['min-height'] = "calc((20rem - " + (elements.length * 2) + "px) / " + elements.length + ")";
        }
      }
    });
  }
  
  boldBtnClicked =()=>{
    let bold_btn = document.getElementsByClassName("bold-btn")[0];
    if(bold_btn.style['background-color'] === "rgb(170, 170, 170)"){
      bold_btn.style['background-color'] = "";
    } else {
      bold_btn.style['background-color'] = "#aaa";
    }
  }
  
  italicBtnClicked = ()=>{
    let italic_btn = document.getElementsByClassName("italic-btn")[0];
    if(italic_btn.style['background-color'] === "rgb(170, 170, 170)"){
      italic_btn.style['background-color'] = "";
    } else {
      italic_btn.style['background-color'] = "#aaa";
    }
  }
  
  colorPickerHover = (e) => {
    let color_picker_area = document.getElementsByClassName("color_picker_area")[0];
    let font_select_area = document.getElementsByClassName("font_select_area")[0];
    // eslint-disable-next-line consistent-this
    // const that = this;
    e.preventDefault();
    document.addEventListener(`click`, function onClickOutside(e) {
      let obj = e.target;
      do {
        if( obj.id !== undefined && obj.id != null && obj.id == "color_sel_icon") return;
        obj = obj.parentElement;
      } while(obj.tagName.toLowerCase() !== "body");
      color_picker_area.style['display'] = "none";
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      color_picker_area.style['display'] = "none";
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    color_picker_area.style['display'] = "block";
    font_select_area.style['display'] = "none";
  };
  
  changeBtnColor=(color)=>{
    let set_font_color_obj = document.getElementsByClassName("set-font-color")[0];
    if(set_font_color_obj !== undefined && set_font_color_obj != null){
      set_font_color_obj.style['border-color'] = color;
      this.soap_font_color = color;
    }
  }
  
  fontPickerHover = (e) => {
    let font_select_area = document.getElementsByClassName("font_select_area")[0];
    let color_picker_area = document.getElementsByClassName("color_picker_area")[0];
    // eslint-disable-next-line consistent-this
    // const that = this;
    e.preventDefault();
    document.addEventListener(`click`, function onClickOutside(e) {
      let obj = e.target;
      do {
        if( obj.id != null && obj.id === "font_sel_icon") return;
        obj = obj.parentElement;
      } while(obj.tagName.toLowerCase() !== "body");
      font_select_area.style['display'] = "none";
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      font_select_area.style['display'] = "none";
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    font_select_area.style['display'] = "block";
    color_picker_area.style['display'] = "none";
  };
  
  stripHtml=(html)=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  
  onChangeCKEditArea = (evt, passing_of_time_type_id) => {
    let strip_data = this.stripHtml(evt.target.value);
    let passing_of_time = this.state.passing_of_time;
    if (strip_data == ''){
      passing_of_time[passing_of_time_type_id] = "";
    } else {
      passing_of_time[passing_of_time_type_id] = evt.target.value;
    }
    this.change_flag = 0;
    Object.keys(passing_of_time).map(type_id=>{
      if(this.passing_of_time[type_id] != passing_of_time[type_id]){
        this.change_flag = 1;
      }
    });
    this.props.setChangeStatus(this.change_flag);
    this.setState({passing_of_time}, ()=>{
      this.saveCacheData();
    });
  }
  
  changeSpaceChar=(text)=>{
    if(text == null || text === ""){return '';}
    text = text.split('');
    let text_length = text.length;
    for(let index = 0; index < text_length; index++){
      if(text[index] === " "){
        if(index == 0){
          text[index] = "&nbsp;";
        } else {
          let change_flag = false;
          for(let prev_index = index - 1; prev_index >= 0; prev_index--){
            if(text[prev_index] === "<"){
              change_flag = true;
              break;
            }
            if(text[prev_index] === ">"){
              text[index] = "&nbsp;";
              change_flag = true;
              break;
            }
          }
          if(!change_flag){
            text[index] = "&nbsp;";
          }
        }
      }
    }
    return text.join('');
  }
  
  convertBR = (clipboard_data) => {
    clipboard_data = clipboard_data.split(" ").join("<span>&nbsp;</span>");
    let clipboard_data_arr = clipboard_data.split("\n");
    let result = "";
    if(clipboard_data_arr.length > 0) {
      clipboard_data_arr.map((ele, idx)=>{
        if (idx != clipboard_data_arr.length - 1) {
          result += ele + "<br>";
        } else {
          result += ele;
        }
      });
    }
    return result;
  }
  
  getSeleteTag=()=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let parentNode_name = window.getSelection().anchorNode.parentNode.tagName;
    let bold_btn = document.getElementsByClassName("bold-btn")[0];
    let italic_btn = document.getElementsByClassName("italic-btn")[0];
    let font_color_btn = document.getElementsByClassName("set-font-color")[0];
    if(bold_btn !== undefined && bold_btn != null){
      if(parentNode_name == "STRONG" || parentNode_name == "B"){
        bold_btn.style['background-color'] = "#aaa";
      } else {
        bold_btn.style['background-color'] = "";
      }
    }
    if(italic_btn !== undefined && italic_btn != null){
      if(parentNode_name == "EM" || parentNode_name == "I"){
        italic_btn.style['background-color'] = "#aaa";
      } else {
        italic_btn.style['background-color'] = "";
      }
    }
    if(font_color_btn !== undefined && font_color_btn != null){
      if(parentNode_name == "FONT"){
        let font_color =  window.getSelection().anchorNode.parentNode.color;
        if(font_color !== undefined && font_color != null && font_color != ""){
          this.changeBtnColor(font_color);
        }
      } else {
        this.changeBtnColor("#000000");
      }
    }
  }
  
  setContentEditData=()=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let passing_of_time = this.state.passing_of_time;
    let content_editable_obj = document.getElementsByClassName("content_editable_area");
    for(let index=0; index < content_editable_obj.length; index++){
      if(content_editable_obj[index] !== undefined && content_editable_obj[index] != null){
        passing_of_time[this.state.passing_of_time_type_master[index].number] = content_editable_obj[index].innerHTML;
      }
    }
    this.change_flag = 0;
    Object.keys(passing_of_time).map(type_id=>{
      if(this.passing_of_time[type_id] != passing_of_time[type_id]){
        this.change_flag = 1;
      }
    });
    this.props.setChangeStatus(this.change_flag);
    this.setState({passing_of_time}, ()=>{
      this.saveCacheData();
    });
  }
  
  setRecordDate = (value) => {
    if(this.state.number > 0){
      this.change_flag = 1;
      this.props.setChangeStatus(this.change_flag);
    }
    if(value == null || value === ""){
      value = new Date(this.record_max_date);
    }
    if(this.change_record_date_auth){
      if(formatDateLine(value) == formatDateLine(this.record_max_date)){
        let record_max_time = new Date();
        record_max_time.setHours(this.record_max_date.getHours());
        record_max_time.setMinutes(this.record_max_date.getMinutes());
        record_max_time.setSeconds(this.record_max_date.getSeconds());
        this.record_max_time = record_max_time;
      } else {
        let record_max_time = new Date();
        record_max_time.setHours(23);
        record_max_time.setMinutes(59);
        record_max_time.setSeconds(59);
        this.record_max_time = record_max_time;
      }
    } else {
      if(formatDateLine(value) == formatDateLine(this.record_max_date)){
        let record_max_time = new Date();
        record_max_time.setHours(this.record_max_date.getHours());
        record_max_time.setMinutes(this.record_max_date.getMinutes());
        record_max_time.setSeconds(this.record_max_date.getSeconds());
        this.record_max_time = record_max_time;
        if(formatDateLine(this.record_min_date) == formatDateLine(value)){
          let record_min_time = new Date();
          record_min_time.setHours(this.record_min_date.getHours());
          record_min_time.setMinutes(this.record_min_date.getMinutes());
          record_min_time.setSeconds(this.record_min_date.getSeconds());
          this.record_min_time = record_min_time;
        } else {
          let record_min_time = new Date();
          record_min_time.setHours(0);
          record_min_time.setMinutes(0);
          record_min_time.setSeconds(0);
          this.record_min_time = record_min_time;
        }
      } else {
        let record_max_time = new Date();
        record_max_time.setHours(23);
        record_max_time.setMinutes(59);
        record_max_time.setSeconds(59);
        this.record_max_time = record_max_time;
        if(formatDateLine(this.record_min_date) == formatDateLine(value)){
          let record_min_time = new Date();
          record_min_time.setHours(this.record_min_date.getHours());
          record_min_time.setMinutes(this.record_min_date.getMinutes());
          record_min_time.setSeconds(this.record_min_date.getSeconds());
          this.record_min_time = record_min_time;
        } else {
          let record_min_time = new Date();
          record_min_time.setHours(0);
          record_min_time.setMinutes(0);
          record_min_time.setSeconds(0);
          this.record_min_time = record_min_time;
        }
      }
    }
    this.setState({record_date:value}, ()=>{
      this.saveCacheData();
    });
  };
  
  getInputTime =(value, e) => {
    if(e === undefined){
      if(this.state.number > 0){
        this.change_flag = 1;
        this.props.setChangeStatus(this.change_flag);
      }
      this.setState({
        record_date_time:value,
        record_date_time_value:formatTime(value)
      }, ()=>{
        this.saveCacheData();
      });
      return;
    }
    let input_value = e.target.value;
    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4){return;}
    input_value = toHalfWidthOnlyNumber(input_value);
    if(input_value.length >= 2){
      input_value = this.insertStrTimeStyle(input_value);
    }
    if (input_value.length == 5){this.setTime(e);}
    this.setState({
      record_date_time_value:input_value
    }, () => {
      let obj = document.getElementById('record_date_time_id');
      if(this.key_code == 46){
        obj.setSelectionRange(this.start_pos, this.start_pos);
      }
      if(this.key_code == 8){
        obj.setSelectionRange(this.start_pos - 1, this.start_pos - 1);
      }
      this.saveCacheData();
    })
  };
  
  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }
  
  setTime = (e) => {
    if(e.target.value.length != 5) {
      this.setState({
        record_date_time:'',
        record_date_time_value:undefined
      }, ()=>{
        this.saveCacheData();
      });
      return;
    }
    let input_value = e.target.value;
    let hours = input_value.split(':')[0];
    let mins = input_value.split(':')[1];
    if(hours > 23 || mins > 60){
      this.setState({
        record_date_time:'',
        record_date_time_value:undefined
      }, ()=>{
        this.saveCacheData();
      });
      return;
    }
    let now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    if(this.state.number > 0){
      this.change_flag = 1;
      this.props.setChangeStatus(this.change_flag);
    }
    this.setState({record_date_time:now}, ()=>{
      this.saveCacheData();
    });
  }
  
  timeKeyEvent = (e) => {
    let start_pos = e.target.selectionStart;
    let end_pos = e.target.selectionEnd;
    let key_code = e.keyCode;
    this.key_code = key_code;
    this.start_pos = start_pos;
    let obj = document.getElementById('record_date_time_id');
    let input_value = e.target.value;
    if(start_pos == end_pos) {
      if(key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if(key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }
    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4){return;}
    input_value = toHalfWidthOnlyNumber(input_value);
    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    if(key_code == 9) {
      this.setTime(e);
      return;
    }
    if(key_code == 8){
      if(input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({record_date_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
          this.saveCacheData();
        });
        e.preventDefault();
      }
      if(input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({record_date_time_value:input_value}, () => {
          obj.setSelectionRange(0,0);
          this.saveCacheData();
        });
        e.preventDefault();
      }
      if(start_pos == end_pos && start_pos == 3){
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);
        this.setState({
          record_date_time_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
          this.saveCacheData();
        });
        e.preventDefault();
      }
      if(start_pos != end_pos){
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          record_date_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
          this.saveCacheData();
        });
        e.preventDefault();
      }
    }
    if(key_code == 46){
      if(start_pos != end_pos){
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          record_date_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
          this.saveCacheData();
        })
        e.preventDefault();
      }
      if(input_value.length == 1 && start_pos == 0 && start_pos == end_pos){
        this.setState({record_date_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
          this.saveCacheData();
        });
        e.preventDefault();
      }
      if(start_pos == end_pos && input_value.length == 3){
        if(start_pos == 0){
          this.setState({
            record_date_time_value:input_value.slice(1,2),
          }, () => {
            obj.setSelectionRange(0, 0);
            this.saveCacheData();
          });
          e.preventDefault();
        }
        if (start_pos == 1){
          this.setState({
            record_date_time_value:input_value.slice(0,1),
          }, () => {
            obj.setSelectionRange(1, 1);
            this.saveCacheData();
          });
          e.preventDefault();
        }
      }
    }
    if (key_code != 8 && key_code != 46){
      this.setState({record_date_time_value:input_value}, ()=>{
        this.saveCacheData();
      });
    }
  }

  render() {
    return (
      <>
        <Wrapper font_props = {this.props.font_props}>
          <div className={'select-nurse-problem flex'}>
            <div className={'pass-title'}>看護記録{this.state.number > 0 ? '（編集中）' : ''}</div>
            <div className={'select-problem'} style={{width: this.state.number == 0 ? "calc(100% - 4.5rem)" : "calc(100% - 9rem)"}}>
              <SelectorWithLabel
                options={this.state.nursing_problems}
                title={''}
                getSelect={this.setSelectValue.bind(this, 'nursing_problem_id')}
                departmentEditCode={this.state.nursing_problem_id}
              />
            </div>
          </div>
          <div className={'select-record-date flex'}>
            <div className={'date-title'}>記録時間</div>
            {this.change_record_date_auth ? (
              <DatePicker
                locale="ja"
                selected={this.state.record_date}
                onChange={this.setRecordDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={this.record_max_date}
                dayClassName = {date => setDateColorClassName(date)}
              />
            ):(
              <DatePicker
                locale="ja"
                selected={this.state.record_date}
                onChange={this.setRecordDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate = {this.record_min_date}
                maxDate={this.record_max_date}
                dayClassName = {date => setDateColorClassName(date)}
                disabled={this.disable_input_record_date}
              />
            )}
            <div className={'input-time'}>
              <DatePicker
                id={'record_date_time_id'}
                locale="ja"
                selected={this.state.record_date_time}
                onChange={this.getInputTime.bind(this)}
                onKeyDown = {this.timeKeyEvent}
                onBlur = {this.setTime}
                value = {this.state.record_date_time_value}
                dateFormat="HH:mm"
                timeCaption="時間"
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeIntervals={10}
                dropdownMode="select"
                minTime = {this.record_min_time}
                maxTime={this.record_max_time}
                dayClassName = {date => setDateColorClassName(date)}
              />
            </div>
          </div>
          <div className={'select-set'}>
            {this.state.passing_of_time_type_set_master.length > 0 && (
              this.state.passing_of_time_type_set_master.map(set=>{
                return (
                  <>
                    <Button
                      type="common"
                      className={this.state.passing_of_time_type_set_id == set.number ? 'active-set' : (this.state.number > 0 ? 'disable-btn' : '')}
                      isDisabled={this.state.number > 0 ? true : false}
                      onClick={this.confirmSetChange.bind(this, set.number)}
                    >{set.name}</Button>
                  </>
                )
              })
            )}
          </div>
          <div className={'content_editable_icon'}>
            <button
              className={'bold-btn'}
              onMouseDown={evt => {
                evt.preventDefault(); // Avoids loosing focus from the editable area
                document.execCommand("bold", false, ""); // Send the command to the browser
                this.boldBtnClicked(evt)
              }}
            >B</button>
            <button
              className={'italic-btn'}
              style={{fontStyle:"italic"}}
              onMouseDown={evt => {
                evt.preventDefault(); // Avoids loosing focus from the editable area
                document.execCommand("italic", false, ""); // Send the command to the browser
                this.italicBtnClicked(evt)
              }}
            >I</button>
            <button
              className="d-flex color-icon" id={'color_sel_icon'}
              onClick={(e) => {this.colorPickerHover(e)}}
            >
              <label className="set-font-color" style={{borderColor:this.soap_font_color}}>A<sup>▾</sup></label>
            </button>
            <div style={this.color_styles.popover} className={'color_picker_area'} id={'color_picker_area'}>
              <div className={'color-block-area'}>
                <div className={'flex'}>
                  <div className={'color-block'} style={{backgroundColor:"#d0021b"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#d0021b");
                    this.changeBtnColor("#d0021b");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#f5a623"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#f5a623");
                    this.changeBtnColor("#f5a623");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#f8e71c"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#f8e71c");
                    this.changeBtnColor("#f8e71c");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#8b572a"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#8b572a");
                    this.changeBtnColor("#8b572a");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#7ed321"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#7ed321");
                    this.changeBtnColor("#7ed321");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#417505"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#417505");
                    this.changeBtnColor("#417505");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#bd10e0"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#bd10e0");
                    this.changeBtnColor("#bd10e0");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#9013fe"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#9013fe");
                    this.changeBtnColor("#9013fe");
                    this.setContentEditData();
                  }}> </div>
                </div>
                <div className={'flex'}>
                  <div className={'color-block'} style={{backgroundColor:"#4a90e2"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#4a90e2");
                    this.changeBtnColor("#4a90e2");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#50e3c2"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#50e3c2");
                    this.changeBtnColor("#50e3c2");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#b8e986"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#b8e986");
                    this.changeBtnColor("#b8e986");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#000000"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#000000");
                    this.changeBtnColor("#000000");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#4a4a4a"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#4a4a4a");
                    this.changeBtnColor("#4a4a4a");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#9b9b9b"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#9b9b9b");
                    this.changeBtnColor("#9b9b9b");
                    this.setContentEditData();
                  }}> </div>
                  <div className={'color-block'} style={{backgroundColor:"#FFFFFF"}} onMouseDown={e=>{
                    /*@cc_on _d = document; eval ( 'var document = _d') @*/
                    e.preventDefault();
                    document.execCommand("ForeColor", false, "#FFFFFF");
                    this.changeBtnColor("#FFFFFF");
                    this.setContentEditData();
                  }}> </div>
                </div>
              </div>
            </div>
            <button
              id={'font_sel_icon'}
              style={{position:"relative", padding:"0"}}
              onClick={(e) => {this.fontPickerHover(e)}}
            >
              <span style={{position:"absolute", left:"0.3rem", top:0}}>A</span>
              <span style={{position:"absolute", left:"0.8rem", top:"0.4rem"}}>▾</span>
              <span style={{position:"absolute", left:"0.8rem", top:"-0.4rem"}}>▴</span>
            </button>
            <div style={this.color_styles.popover} className={'font_select_area'}>
              <div className={'font-block-area'}>
                <div className={'font-block'} onMouseDown={e=>{
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  e.preventDefault();
                  document.execCommand("fontSize", false, 1);
                  this.setContentEditData();
                }}>10</div>
                <div className={'font-block'} onMouseDown={e=>{
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  e.preventDefault();
                  document.execCommand("fontSize", false, 2);
                  this.setContentEditData();
                }}>14</div>
                <div className={'font-block'} onMouseDown={e=>{
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  e.preventDefault();
                  document.execCommand("fontSize", false, 3);
                  this.setContentEditData();
                }}>16</div>
                <div className={'font-block'} onMouseDown={e=>{
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  e.preventDefault();
                  document.execCommand("fontSize", false, 4);
                  this.setContentEditData();
                }}>18</div>
                <div className={'font-block'} onMouseDown={e=>{
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  e.preventDefault();
                  document.execCommand("fontSize", false, 5);
                  this.setContentEditData();
                }}>24</div>
                <div className={'font-block'} onMouseDown={e=>{
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  e.preventDefault();
                  document.execCommand("fontSize", false, 6);
                  this.setContentEditData();
                }}>32</div>
                <div className={'font-block'} onMouseDown={e=>{
                  /*@cc_on _d = document; eval ( 'var document = _d') @*/
                  e.preventDefault();
                  document.execCommand("fontSize", false, 7);
                  this.setContentEditData();
                }}>48</div>
              </div>
            </div>
          </div>
          <div className={'pass-input'}>
            {this.state.passing_of_time_type_master.length > 0 && (
              <table className={'soap-data'} id = "soap_data">
                <tbody>
                  {this.state.passing_of_time_type_master.map(item=>{
                    return (
                      <>
                        <tr onContextMenu={e => this.handleClick(e, 'input', item.number)}>
                          <th>{item.label}</th>
                          <td className={'text-left'} onDrop={e => this.onDropEvent(e)} onDragOver={e => this.onDragOver(e)}>
                            <ContentEditable
                              className="content_editable_area"
                              html={this.state.passing_of_time[item.number] === undefined ? "" : this.state.passing_of_time[item.number]}
                              onChange={e=>this.onChangeCKEditArea(e, item.number)}
                              tagName='article'
                            />
                          </td>
                        </tr>
                      </>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
  
          {/*<div className={'record-input'} onDrop={e => this.onDropEvent(e)} onDragOver={e => this.onDragOver(e)} onContextMenu={e => this.handleClick(e)}>*/}
            {/*<textarea*/}
              {/*value={this.state.passing_of_time}*/}
              {/*onChange={this.setTextValue.bind(this, 'passing_of_time')}*/}
            {/*/>*/}
          {/*</div>*/}
          <div className={'passing-history'} id={'passing_history'}>
            {this.state.load_flag ? (
              <>
                {this.state.passing_records.length > 0 && (
                  <>
                    <table className="table-scroll table table-bordered">
                      <thead>
                      <tr>
                        <th className="td-date-time">日時</th>
                        <th className="td-problem">問題</th>
                        <th className={'td-content'}>内容（記載者）</th>
                      </tr>
                      </thead>
                      <tbody id={'history_list'}>
                        {this.state.passing_records.map((record, index) => {
                          return (
                            <>
                              <tr
                                onContextMenu={e=>this.handleClick(e, 'history', record)}
                                draggable={true}
                                onDragStart={e=>this.onDragStart(e, index)}
                                style={{color:(record.is_enabled == 2 ? '#ff0000' : "")}}
                              >
                                <td className="td-date-time">
                                  <div>{formatJapanDateSlash(record.record_date)}</div>
                                  <div>{formatTimeIE(new Date(record.record_date.split('-').join('/')))}</div>
                                </td>
                                <td className="td-problem">{record.nursing_problem_name}</td>
                                <td className="td-content" style={{padding:0}}>
                                  {record.passing_of_time.length > 0 && (
                                    record.passing_of_time.map((record_item, item_index)=>{
                                      return (
                                        <>
                                          <div className={'pass-item flex'} style={{borderTop:(item_index == 0 ? "none" : "")}}>
                                            <div className={'pass-label'}>
                                              {this.passing_of_time_type_label[record_item.passing_of_time_type_id] !== undefined ? this.passing_of_time_type_label[record_item.passing_of_time_type_id] : ""}
                                            </div>
                                            <div className={'pass-content'}>
                                              {renderHTML(this.changeSpaceChar(record_item.passing_of_time))}
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  <div className={'flex'} style={{borderTop:"1px solid #eaeaea"}}>
                                    <div className={'pass-label'}> </div>
                                    <div className={'pass-created'}>
                                      <span style={{cursor:"pointer"}} onClick={this.contextMenuAction.bind(this, 'view_history', record)}>{this.getHistoryInfo(record.history)}</span>
                                      {record.updated_name != null ? record.updated_name : ""}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </>
                          )
                        })}
                      </tbody>
                    </table>
                  </>
                )}
              </>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </div>
          {this.state.passing_records.length > 0 && (
            <div style={{textAlign:"right"}}>
              <Button className={'red-btn'} onClick={this.openNursePassHistoryPrint}>印刷</Button>
            </div>
          )}
        </Wrapper>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        <HoverMenu
          {...this.state.hoverMenu}
          parent={this}
        />
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title= {this.state.confirm_title}
          />
        )}
        {this.state.isOpenNursePassHistoryPrint && (
          <NursePassHistoryPrint
            closeModal={this.confirmCancel}
            hos_number={this.props.hos_number}
            patientInfo={this.props.patientInfo}
            passing_records={this.state.passing_records}
            passing_of_time_type_label={this.passing_of_time_type_label}
          />
        )}
        {this.state.isOpenNurseRecordChangeLog && (
          <NurseRecordChangeLog
            closeModal={this.confirmCancel}
            history_numbers={this.state.history_numbers}
            nursing_problems={this.state.nursing_problems}
            passing_of_time_type_label={this.passing_of_time_type_label}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title = {this.state.confirm_title}
          />
        )}
        {this.state.isOpenNurseRecordDetail && (
          <NurseRecordDetail
            closeModal={this.confirmCancel}
            nursing_problems={this.state.nursing_problems}
            passing_of_time_type_label={this.passing_of_time_type_label}
            modal_data={this.state.record_data}
            patientInfo={this.props.patientInfo}
          />
        )}
      </>
    );
  }
}

NursePass.contextType = Context;
NursePass.propTypes = {
  font_props: PropTypes.number,
  setChangeStatus: PropTypes.func,
  finishRegister: PropTypes.func,
  hos_number: PropTypes.number,
  patientInfo: PropTypes.object,
  patientId: PropTypes.patientId,
  closeRightClickMenu: PropTypes.func,
};
export default NursePass;
