import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// import axios from "axios/index";
import Context from "~/helpers/configureStore";
import { Modal } from "react-bootstrap";
import {
  // formatDateLine,
  // formatJapanMonth,
  // getNextMonthByJapanFormat,
  // getPrevMonthByJapanFormat,
  // getWeekName
} from "~/helpers/date";
// import DatePicker, { registerLocale } from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as colors from "~/components/_nano/colors";
// import Checkbox from "~/components/molecules/Checkbox";
// import * as apiClient from "~/api/apiClient";
// import Spinner from "react-bootstrap/Spinner";
// import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
// import axios from "axios/index";
// import SystemAlertModal from "~/components/molecules/SystemAlertModal";
// import {CACHE_SESSIONNAMES} from "~/helpers/constants";
// import Button from "~/components/atoms/Button";
// import * as localApi from "~/helpers/cacheLocal-utils";
// import * as sessApi from "~/helpers/cacheSession-utils";
// import auth from "~/api/auth";

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  overflow:hidden;
  .flex {
    display: flex;
  }
  .pink-color{
    background: rgb(255, 213, 236);
  }
  .green-color{
    background: lightgreen;
  }
  .gray-color{
    background: lightgray;
  }
  .complete-cancel-time-title{
    text-align: center;
    padding: 0.2rem 5px;
    font-size: 1rem;
    white-space: nowrap;
    border-top: none;
    border-left: none;
    border-image: initial;    
    font-weight: normal;
    border-bottom: 1px solid white;        
  }
  .title-element{
    padding: 0px;
    word-break: break-all;
    font-size: 1rem;
    vertical-align: middle;
    min-width: 3rem;
    text-align: center;
    cursor: pointer;
    border: 1px solid white;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    text-align: right;
    padding-right: 10px;    
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
  .arrow{
    cursor:pointer;
    font-size:1.5rem
  }
  .prev-month {
      padding-right: 5px;
  }
  .next-month {
    padding-left: 5px;
  }
  .schedule-area {
    width: 100%;
    display: flex;
    background-color: white;
    .complete-cancel-list{
      width: 20%;
      padding-left: 1rem;
      .complete-cancel-list-title{
        text-align: left;        
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
      }
      .complete-cancel-list-content{
        overflow-y: scroll;
        height: calc(100vh - 24rem);    
        .table-header{
          display: flex;
          width: calc(100% - 17px);
          height: 2rem;
          line-height: 1.6rem;
          .list-name{
            width: 100%;
          }
          .list-check{
            width: 20%;
          }
        }

        // width: calc(100% - 7px);
            // height: calc(100% - 60px);
            height: calc(100vh - 24rem);
            // margin-left: 7px;
            overflow-y: hidden;
            border:1px solid #dee2e6;
            // border-bottom: solid 1px #dee2e6;
            // border-top: solid 1px #dee2e6;
            .div-row {
              cursor: pointer;
              display: flex;
              border-bottom: solid 1px #dee2e6;
            }
            .selected-item {
              background: lightblue !important;
            }
            .no-select {
              font-size: 1rem;
              border: 1px solid #dee2e6;
              padding-left: 5px;
            }
            .table-header {
              display: flex;
              width: calc(100% - 17px);
              height: 2rem;
              line-height: 1.6rem;
            }
            .table-header span {
              text-align: center;
              background: #a0ebff;
              display: block;
              float: left;
              border-top: 1px solid #dee2e6;
              position: sticky;
              font-size: 1rem;
            }
            .table-body{
              overflow-y:scroll;
              height: calc(100% - 2rem);
            }
            .table-content {
              overflow-y: auto;
            }
            .exam-name {
              float: left;
              width: 60%;
              border-left:none;
              padding-left: 5px;
              font-size: 1rem;
            }
            .exam-material {
              width: 20%;
              border-right: 1px solid #dee2e6;
            }
            span {
              float: left;
              padding: 0.2rem;
              font-size: 0.9rem;
              border-left: 1px solid #dee2e6;
              // border-bottom: 1px solid #dee2e6;
              display: block;
            }
            .exam-urgent {
              label {
                width: 50px;
                text-align: center;
                margin-right: 0;
              }
              input {
                height: 15px !important;
                width: 15px !important;
              }
            }    
      }
    }
    .table-head-title{
      text-align: center;
      min-width: 4rem;
      padding-left: 5px;
      padding-right: 5px;
    }
    .table-head-date{
      min-width: 3rem;      
    }
    .table-body-title{
      text-align: right;
      min-width: 4rem;
      padding-right: 5px;
    }
    .table-body-date{
      min-width: 3rem;
      text-align: center;
      cursor: pointer;
      border: 1px solid #d4d4d4;
    }
    .cancel-completed-area{
      color: red;
    }
    .table-area{
      width: 70%;
      overflow: auto;
      border: 1px solid #ddd !important;
    }
    .complete-cancel-time{
      width: 10%;
    }
    table {
      width: 100%;
      margin:0px;
      tbody{
        display:block;
        // overflow-y: scroll;
        height: calc(100vh - 24rem);
        width:100%;
        tr{
          td{
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
        }
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;        
        tr{
          height: 27px;
        }
      }
      td {
        padding: 0; 
        word-break: break-all;
        font-size: 1rem;
        vertical-align: middle;
        div {text-align:center;}
      }
      th {
        // position: sticky;
        text-align: center;
        padding: 0.2rem 5px;
        font-size: 1rem;
        white-space:nowrap;
        border:none;
        border:1px solid #aaa;
        font-weight: normal;
        border-bottom: 1px solid #aaa;
        background:lightgoldenrodyellow;
      }
    }
  }
  .visit-patient-name{
    cursor: pointer;
  }
  .visit-fill{
    cursor: pointer;
  }
  .sunday-border {
    border-right: 1px solid #aaa;
  }
  .tr-border {
    td {
        border-bottom: 1px solid #aaa;
    }
  }
  .block-area {
    border: 1px solid #aaa;
    padding: 0.5rem;
    margin: 0.5rem;
    .block-title {line-height: 2.3rem;}
    .btn-area {
      width: 100%;
      align-items: flex-start;
      justify-content: space-between;
    
    }
    button {
      min-width: 5rem;
      margin: 0;
    }
  }
  .black-btn {
      background-color: #F2F2F2;
  }
  .white-btn {
      background-color: white;
  }
  .bottom-btn {
    text-align: right;
    padding-top: 0.5rem;
    width:100%;
  }
  .red-btn {
    background: #cc0000;
    span {
      color: #ffffff;
      font-size: 1rem;
    }
  }
  .red-btn:hover {
    background: #e81123;
    span {
      color: #ffffff;
      font-size: 1rem;
    }
  }
  .cancel-btn {
    background: #ffffff;
    border: solid 2px #7e7e7e;
    span {
      color: #7e7e7e;
      font-size: 1rem;
    }
  }
  .cancel-btn:hover {
    border: solid 2px #000000;
    background: #ffffff;
    span {
      color: #000000;
      font-size: 1rem;
    }
  }
  .disable-btn {
    background: #d3d3d3;
    span {
      color: #595959;
      font-size: 1rem;
    }
  }
  .disable-btn:hover {
    background: #d3d3d3;
    span {
      color: #595959;
      font-size: 1rem;
    }
  }
  .patient_numbers {
    line-height: 2.3rem;
    width:4rem;
    text-align: center;
  }
  .label-title {
    margin: 0;
    padding-right: 0.5rem;
    line-height: 2.3rem;
    font-size: 1rem;
    text-align: right;
  }
  .pullbox-select {
    width: 100%;
    font-size: 1rem;
    height: 2.3rem;
  }
  .pullbox-label {
    margin-bottom:0;
  }
  .top_right_area{
    width: calc(100% - 12rem);
    .select-place {
      width: calc(100% - 12.5rem);
      margin-right:0.5rem;
      .pullbox {
        width: 100%;
        .label-title {
          width: 5rem;
        }
        .pullbox-label {
          width: calc(100% - 5rem);
        }
      }
    }
  }  
  .select-group {
    width: calc(100% - 27rem);
    margin-left:12.5rem;
    .pullbox {
      width: 100%;
      .label-title {
        width: 5rem;
      }
      .pullbox-label {
        width: calc(100% - 5rem);
      }
    }
  }
  .select-display-order {
    width: 11rem;
    .pullbox {
      width: 100%;
      .label-title {
        width: 4rem;
      }
      .pullbox-label {
        width: calc(100% - 4rem);
      }
    }
  }
  .place-name-area {
    width:100%;
    .place-label {
      width:5rem;
      text-align:right;
    }
    .place-name {
      width: calc(100% - 5rem);
    }
  }
  .group-name-area {
    width: calc(100% - 17.5rem);
    .group-label {
      width:5rem;
      text-align:right;
    }
    .group-name {
      width: calc(100% - 5rem);
    }
  }
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
    font-size: 14px;
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
    img {
      width: 30px;
      height: 30px;
    }
    svg {
      width: 30px;
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

const ContextMenu = ({
  visible,
  x,
  y,
  parent,                       
  sel_date,
  sel_obj
}) => {
  if (visible) {
    let sel_list = parent.state.cancel_schedule_data;
    let new_obj = {
      date:sel_date,
      obj: sel_obj
    };
    
    let is_delete_menu = 1;    
    
    if (sel_list.length > 0) {      
      sel_list.map(item=>{
        if (item.date == new_obj.date && item.obj.time == new_obj.obj.time) {
          is_delete_menu = 0;
        }
      });
    }

    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {is_delete_menu == 1 ? (
            <li><div onClick={() =>parent.contextMenuAction("menu_delete", new_obj)}>{parent.props.period_type == "SomeDoingNotDoneStop" ? "中止":"削除"}</div></li>          
          ) : (
            <li><div onClick={() =>parent.contextMenuAction("menu_delete_cancel", new_obj)}>{parent.props.period_type == "SomeDoingNotDoneStop" ? "中止を取りやめ":"削除を取りやめ"}</div></li>          
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

// const Flex = styled.div`
//   background: ${colors.background};
//   display: flex;
//   align-items: center;
//   padding: 0.5rem 0px 0.5rem 0.5rem;
//   width: 100%;
//   .search-box {
//     width: 100%;
//     display: flex;
//     .year_month {
//       width:12rem;
//     }
//   }
// `;

// const SpinnerWrapper = styled.div`
//     padding-top: 70px;
//     padding-bottom: 70px;
//     height: 100px;
// `;


// const holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;

class InjectionPeriodCompletedManageModal extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      search_month: new Date(),      
      schedule_data:null,
      confirm_message: "",      
      alert_messages:'',        
      done_numbers: this.props.rp_data != null && this.props.rp_data.done_numbers ? this.props.rp_data.done_numbers : null,
      administrate_period: this.props.rp_data != null && this.props.rp_data.administrate_period ? this.props.rp_data.administrate_period : null,
      cancel_schedule_data: []
    };    
  }

  async componentDidMount() {
    // await this.getHolidays();
    // await this.getSearchResult();
  }

  // async getHolidays(){
  //   let now_date = this.state.search_month;
  //   let year = now_date.getFullYear();
  //   let month = now_date.getMonth();
  //   let from_date = formatDateLine(new Date(year, month, 1));
  //   let end_date = formatDateLine(new Date(year, month+1, 0));
  //   let path = "/app/api/v2/dial/schedule/get_holidays";
  //   let post_data = {
  //     start_date: from_date,
  //     end_date:end_date,
  //   };
  //   await axios.post(path, {params: post_data}).then((res)=>{
  //     this.setState({holidays:Object.keys(res.data)});
  //   })
  // }

  // getSearchResult =async()=>{    
    // let path = "/app/api/v2/visit/schedule/search";
    // let post_data = {      
    // };
    
    // await apiClient
    //   ._post(path, {
    //     params: post_data
    //   })
    //   .then((res) => {
    //     console.log("res", res);
    //   })
    //   .catch(() => {
    //   });
  // }

  // PrevMonth = () => {
  //   let now_month = this.state.search_month;
  //   let cur_month = getPrevMonthByJapanFormat(now_month);
  //   this.setState({ search_month: cur_month}, ()=>{
  //     this.getHolidays();
  //     this.getSearchResult();
  //   });
  // };

  // NextMonth = () => {
  //   let now_month = this.state.search_month;
  //   let cur_month = getNextMonthByJapanFormat(now_month);
  //   this.setState({ search_month: cur_month}, ()=>{
  //     this.getHolidays();
  //     this.getSearchResult();
  //   });
  // };  

  openCreateMenu = (e, key, ele) => {
    if(ele.time == "") return;
    
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: { visible: false }});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("table-area-div")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("table-area-div")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("table-area-div").offsetLeft - 25,          
          y: e.clientY + window.pageYOffset - document.getElementById("table-area-div").offsetTop - 20,
        },
        sel_date: key,
        sel_obj: ele
      });      
    }
  }

  contextMenuAction = (type, obj) => {
    switch(type){
      case "menu_delete":
        this.handleMenuDelete(obj);
        break;
      case "menu_delete_cancel":
        this.handleMenuDeleteCancel(obj);
        break;
    }
  };  

  // getSearchMonth = value => {
  //   this.setState({
  //     search_month: value,
  //   }, ()=>{
  //     this.getHolidays();
  //     this.getSearchResult();
  //   });
  // };  
 

  confirmCancel() {
    this.setState({
      confirm_message: "",
      alert_messages: "",
    });
  }

  confirmOk = () => {
    if (this.state.cancel_schedule_data.length < 1) return;

    this.props.confirmOk(this.props.period_type, this.state.cancel_schedule_data, this.props.order_number, this.props.rp_number);
    this.props.closeModal();    
  } 

  // setBackcolor = (date, day_of_week) => {
  //   let holidays = this.state.holidays;
  //   if (holidays == undefined || holidays == null || holidays.length == 0 || !holidays.includes(date)){
  //     if (holidays_color.days[day_of_week] == undefined || holidays_color.days[day_of_week] == null){
  //       return holidays_color.default.schedule_date_cell_back;
  //     } else {
  //       return holidays_color.days[day_of_week].schedule_date_cell_back;
  //     }
  //   } else {
  //     return holidays_color.holiday.schedule_date_cell_back;
  //   }
  // }

  // setFontcolor = (date, day_of_week) => {
  //   let holidays = this.state.holidays;
  //   if (holidays == undefined || holidays == null || holidays.length > 0 || !holidays.includes(date)){
  //     if (holidays_color.days[day_of_week] == undefined || holidays_color.days[day_of_week] == null){
  //       return holidays_color.default.schedule_date_cell_font;
  //     } else {
  //       return holidays_color.days[day_of_week].schedule_date_cell_font;
  //     }
  //   } else {
  //     return holidays_color.holiday.schedule_date_cell_font;
  //   }
  // }

  createTableDiv = () => {
    let result = <></>;
    if (this.state.administrate_period != null && this.state.administrate_period.done_times.length > 0) {
      result = this.state.administrate_period.done_times.map(item=>{
        return(
          <>
            <div className="title-element">              
              {item != "" ? (
                <>{item}</>
              ) : (
                <>未定</>
              )}
            </div>
          </>
        );
      })
    }  

    return result;  
  }

  isExistInCancelScheduleList = (date, ele) => {
    let result = 0;
    if (this.state.cancel_schedule_data.length == 0) return result;
    this.state.cancel_schedule_data.map(item=>{
      if (item.date == date && item.obj.time == ele.time) {
        result = 1;
      }
    });
    return result;
  }

  createTable = (type, param_1) => {
    let table_menu = [];
    let done_numbers = this.state.done_numbers;
    let administrate_period = this.state.administrate_period;

    if(type == "head" || type == "body") {
      if (administrate_period == null) return <></>;

      Object.keys(done_numbers).map(key=>{
        // let year = parseInt(key.substring(0, 4));
        // let month = parseInt(key.substring(5, 7));
        // let date = parseInt(key.substring(8, 10));        
        if (type == "head") {
          table_menu.push(
            <th className="table-head-date">{key}</th>
          );
        } else if(type== "body") {
          let show_ele = null;
          done_numbers[key].map(ele=>{
            if (ele.time == param_1 && ele != "") {
              show_ele = ele;              
            }
          });          
          if (show_ele != null) {
            if (this.props.period_type == "SomeDoingNotDoneStop") { // 一部未実施中止[Rp単位]
              table_menu.push(
                <>
                  {show_ele.completed_at == "" && show_ele.stop_at == "" ? (
                    <td onContextMenu={e => this.openCreateMenu(e, key, show_ele)} className={`table-body-date ${this.isExistInCancelScheduleList(key, show_ele) == 1 && "cancel-completed-area"} ${show_ele.stop_at != "" ? 'gray-color' : show_ele.completed_at != "" ? 'green-color' : 'pink-color'}`}>{show_ele.stop_at != "" ? '削' : show_ele.completed_at != "" ? '済' : '未'}</td>
                  ) : (                  
                    <td className={`table-body-date ${show_ele.stop_at != "" ? 'gray-color' : show_ele.completed_at != "" ? 'green-color' : 'pink-color'}`}>{show_ele.stop_at != "" ? '削' : show_ele.completed_at != "" ? '済' : '未'}</td>
                  )}
                </>
              );
            } else { // 一部実施済削除
              table_menu.push(
                <>
                  {show_ele.completed_at != "" ? (
                    <td onContextMenu={e => this.openCreateMenu(e, key, show_ele)} className={`table-body-date ${this.isExistInCancelScheduleList(key, show_ele) == 1 && "cancel-completed-area"} ${show_ele.stop_at != "" ? 'gray-color' : show_ele.completed_at != "" ? 'green-color' : 'pink-color'}`}>{show_ele.stop_at != "" ? '削' : show_ele.completed_at != "" ? '済' : '未'}</td>
                  ) : (                  
                    <td className={`table-body-date ${show_ele.stop_at != "" ? 'gray-color' : show_ele.completed_at != "" ? 'green-color' : 'pink-color'}`}>{show_ele.stop_at != "" ? '削' : show_ele.completed_at != "" ? '済' : '未'}</td>
                  )}
                </>
              );
            }
          } else {
            table_menu.push(
              <td className="table-body-date"></td>
            );
          }
        }
      });      
    } else if (type == "no_data") {
      table_menu.push(<td colSpan={this.state.administrate_period.done_times.length + 1} style={{textAlign:"center"}}>{'登録されたデータがありません。'}</td>);
    }

    return table_menu
  }

  handleMenuDelete = (_obj) => {
    let cancel_schedule_data = this.state.cancel_schedule_data;
    cancel_schedule_data.push(_obj);
    this.setState({
      cancel_schedule_data: cancel_schedule_data
    });
  }

  handleMenuDeleteCancel = (_obj) => {
    let cancel_schedule_data = this.state.cancel_schedule_data;
    let result = [];
    result = cancel_schedule_data.filter(item=>{
      if (item.date == _obj.date && item.obj.time == _obj.obj.time) {
        return false;
      } else {
        return true;
      }
    });
    this.setState({
      cancel_schedule_data: result
    });
  }

  render() {  

    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal injection_period_completed_manage_modal first-view-modal">
          <Modal.Header>
            <Modal.Title>{this.props.period_type == "SomeDoingNotDoneStop" ? "一部未実施中止[Rp単位]": "一部実施済削除[Rp単位]"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PatientsWrapper>      
              <div className={'schedule-area'}>
                <div className="complete-cancel-time">
                  <div className="complete-cancel-time-title">実施タイミング</div>
                  {this.createTableDiv('head')}
                </div>
                <div className="table-area" id="table-area-div">
                  <table className="table-scroll table" id="code-table">
                    <thead>
                    <tr>                      
                      {this.createTable('head')}
                    </tr>
                    </thead>
                    <tbody>
                      {this.state.administrate_period != null && this.state.administrate_period.done_times.length > 0 ? (
                        this.state.administrate_period.done_times.map(item=>{
                          return(
                            <>
                              <tr>                                
                                {this.createTable("body", item)}
                              </tr>
                            </>
                          );
                        })
                      ):(
                        <>
                          <tr>{this.createTable("no_data")}</tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="complete-cancel-list">
                  <div className="complete-cancel-list-title">{this.props.period_type == "SomeDoingNotDoneStop" ? "中止予定一覧":"削除予定一覧"}</div>
                  <div className="complete-cancel-list-content selected-items">                    
                    <div style={{width:'100%'}}>
                      <div className="table-header">
                        <span className="list-name">実施時間</span>                        
                      </div>
                    </div>
                    <div className='table-body'>
                      {this.state.cancel_schedule_data !== undefined && this.state.cancel_schedule_data !== null && this.state.cancel_schedule_data.length > 0 ? (
        
                        this.state.cancel_schedule_data.map(exam => {                         
                          return (
                            <>
                              <div>
                                <span className="exam-name" style={{display:"flex"}}>                                  
                                  {exam.date + " " + exam.obj.time}                                  
                                </span>                                                                
                              </div>
                            </>
                          )
                        })
                      ) : (
                        <div className="no-select">選択された項目がありません。</div>
                      )}
                    </div>                                      
                  </div>
                </div>
              </div>
            </PatientsWrapper>            
          </Modal.Body>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            sel_date={this.state.sel_date}
            sel_obj={this.state.sel_obj}            
          />
          <Modal.Footer>
            <div
              onClick={this.props.closeModal}
              className={"custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
              id='cancel_btn'
            >
              <span>キャンセル</span>
            </div>
            <div
              onClick={this.confirmOk}
              className={`custom-modal-btn ${this.state.cancel_schedule_data.length > 0 ? "red-btn" : "disable-btn"} `}
              style={{cursor:"pointer"}}
            >
              <span>確定</span>
            </div>
          </Modal.Footer>           
        </Modal>     
      </>
    );
  }
}

InjectionPeriodCompletedManageModal.contextType = Context;
InjectionPeriodCompletedManageModal.propTypes = {
  history: PropTypes.object,
  rp_data: PropTypes.object,
  order_number: PropTypes.number,
  rp_number: PropTypes.number,
  period_type: PropTypes.string,
  closeModal: PropTypes.func,
  confirmOk: PropTypes.func,
}
export default InjectionPeriodCompletedManageModal;
