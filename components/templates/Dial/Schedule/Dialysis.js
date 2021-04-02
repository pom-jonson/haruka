import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";
import EditDailysisSchedulModal from "./modals/EditDailysisSchedulModal";
import EditAntiHardModal from "./modals/EditAntiHardModal";
import EditDialyserModal from "./modals/EditDialyserModal";
import EditMoveDateModal from "./modals/EditMoveDateModal";
import EditMoveDateMultiModal from "./modals/EditMoveDateMultiModal";
import ScheduleHistoryModal from "./modals/ScheduleHistoryModal";
import { withRouter } from "react-router-dom";
import {makeList_number, Dial_tab_index} from "~/helpers/dialConstants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {formatDateLine} from "~/helpers/date";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";

const dial_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_color;
const holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
const Wrapper = styled.div`
  display: block;
  justify-content: space-between;
  width: 100%;
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  label {
      text-align: right;
  }
  table {
    margin:0;
    .week_day:hover{
      background:#F2F2F2!important;
    }
    thead{
      display: table;
      width: calc(100% - 17px);
      th{
        border: 1px solid #dee2e6;
        border-right:none;
        label{
          width:100%;
          border-bottom:1px solid #dee2e6;
          text-align:center;
          margin:0px;
        }
      }
    }
    tbody{
      height: calc(100vh - 11.25rem);
      overflow-y:scroll;
      display:block;
    }
    td {
      vertical-align:middle;
      text-align:center;
      font-size: 0.62rem;
      padding: 0;
      width:3%;
      word-break:break-all;
      word-wrap:break-word;
      letter-spacing: 0.3px;
      border: 1px solid #dee2e6;
      border-right:none;
    }
    th {
      text-align: center;
      font-size: 1rem;
      padding: 0;
      width:3%;
      word-break:break-all;
      word-wrap:break-word;
    }
    .number_name{
      width:7%;
      padding-left:2px;
      span{
        font-size:0.8rem;
      }
    }
    .selected_color{
      background: darkcyan!important;
      color: white;
      span{
        color:white;
      }
    }

    tr {
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
  }
  .morning{
    background-color:lightyellow;
  }
  .afternoon{
    background-color:lightgreen;
  }
  .evening{
    background-color:lightblue;
  }
  .night{
    background-color:lightgrey;
  }
  .updated{
    color:${dial_color['default']['cell_highlight_font']};
  }
  // .temporary span{
  //   border:1px solid ${dial_color['default']['cell_highlight_border']};
  // }
  .temporary{
    border:1px solid ${dial_color['default']['cell_highlight_border']};
  }
  .temporary + td{
    border-left:none;
  }
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
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 1.2rem;
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
`;

const ContextMenu = ({visible, x, y,parent,  item, day}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.showEditModal(item)}>透析スケジュールの編集</div></li>
          <li><div onClick={() =>parent.showEditAntiHardModal(item)}>抗凝固法スケジュールの編集</div></li>
          <li><div onClick={() => parent.showEditDialyserModal(item)}>ダイアライザスケジュール編集</div></li>
          <li><div onClick={() => parent.showEditMoveDateModal(item)}>時間帯・透析日移動</div></li>
          <li> <div onClick={() => parent.showMoveDateMultiModal(item)}>透析日一括移動</div></li>
          {/* <li> <div onClick={() => parent.showMoveHistoryModal(item)}>スケジュール移動履歴確認</div></li> */}
          <li> <div onClick={()=>parent.delete(item)}>透析日削除</div></li>
          {/*<li> <div>祝日設定</div></li>*/}
          <li><div onClick={() => parent.goOtherPattern("/dial/pattern/dialPattern", item.system_patient_id)}>透析パターンへ</div></li>
          <li><div onClick={() =>parent.goOtherPattern("/dial/pattern/anticoagulation", item.system_patient_id)}>抗凝固法パターンへ</div></li>
          <li><div onClick={() => parent.goOtherPattern("/dial/pattern/Dializer", item.system_patient_id)}>ダイアライザパターンへ</div></li>
          <li><div onClick={() => parent.move_to_doctor_karte(day, item.system_patient_id, item.time_zone)}>Drカルテへ</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_patient = ({visible, x, y,parent,  system_patient_id}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.goOtherPattern("/dial/pattern/dialPattern", system_patient_id)}>透析パターンへ</div></li>
          <li><div onClick={() =>parent.goOtherPattern("/dial/pattern/anticoagulation", system_patient_id)}>抗凝固法パターンへ</div></li>
          <li><div onClick={() => parent.goOtherPattern("/dial/pattern/Dializer", system_patient_id)}>ダイアライザパターンへ</div></li>
          <li><div onClick={() => parent.move_to_doctor_karte(formatDateLine(new Date()), system_patient_id)}>Drカルテへ</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_other = ({visible, x, y,parent, day, patient_id}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li> <div onClick={() => parent.showAddModal(day, patient_id)}>透析スケジュール追加</div></li>
          <li><div onClick={() => parent.goOtherPattern("/dial/pattern/dialPattern", patient_id)}>透析パターンへ</div></li>
          <li><div onClick={() => parent.move_to_doctor_karte(day, patient_id)}>Drカルテへ</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_move_to_bed = ({visible, x, y,parent, date}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li> <div onClick={() => parent.move_to_bed(date)}>ベッド配置表に移動</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

// const time_class =['', 'morning','afternoon','evening', 'night'];
const update_class =['no-updated', 'updated'];
const temporary_class =['no-temporary', 'temporary'];
const move_date_class =['no-move-date', 'move-date'];

class   Dialysis extends Component {
  constructor(props) {
    super(props);
    var holidays = this.props.holidays!= undefined? Object.keys(this.props.holidays):null;
    this.state = {
      list_date_week:this.props.list_date_week,
      list_dialysis_schedule:this.props.list_schedule,
      list_matrix: this.props.list_matrix,
      new_list_matrix: this.props.new_list_matrix,
      list_by_date: this.props.list_by_date,
      patient_list: this.props.patient_list,
      isOpenEditScheduleModal: false,
      isOpenEditAntiHardModal: false,
      isOpenEditDialyserModal: false,
      isOpenEditMoveDateModal: false,
      isOpenEditMoveDateMultiModal: false,
      isOpenMoveHistoryModal:false,
      schedule_item:[],
      patients_same_day:[],
      schGroup: 0,
      schOrder: 0,
      holidays,
      
      isDeleteConfirmModal: false,
      confirm_message:"",
      validate_alert_message:''
    };
    
    this.tr_index = null;
    this.td_index = null;
    this.setbackColorFlag = null;
  }
  componentDidMount() {
    let bed_master = sessApi.getObjectValue("dial_common_master","bed_master");
    let bed_master_number_list = makeList_number(bed_master);
    this.setState({
      bed_master,
      bed_master_number_list,
    });
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    var holidays = nextProps.holidays!= undefined? Object.keys(nextProps.holidays):null;
    // this.scrollToelement();
    this.setState({
      list_date_week: nextProps.list_date_week,
      list_dialysis_schedule:nextProps.list_schedule,
      holidays,
      patientInfo:nextProps.patientInfo
    });
  }
  
  closeModal = () => {
    this.setState({
      isOpenEditScheduleModal: false,
      isOpenEditAntiHardModal: false,
      isOpenEditDialyserModal: false,
      isOpenEditMoveDateModal: false,
      isOpenEditMoveDateMultiModal: false,
      isOpenMoveHistoryModal: false
    },()=>{
      this.setbackColorFlag = null;
      this.moveArea('remove-back-color');
    })
  };
  
  
  showEditModal=(item) =>{
    this.setState({
      isOpenEditScheduleModal: true,
      schedule_date:item.schedule_date,
      system_patient_id:item.system_patient_id,
      add_flag:false,
      // schedule_item:item
    });
  };
  
  showAddModal (schedule_date, patient_id) {
    this.setState({
      isOpenEditScheduleModal:true,
      schedule_date,
      system_patient_id:patient_id,
      add_flag:true,
    })
  }
  
  showEditAntiHardModal=(item) =>{
    if(item.dial_anticoagulation_pattern_number == null || item.dial_anticoagulation_detail_number == null){
      window.sessionStorage.setItem("alert_messages", '抗凝固法パターンを登録してください。');
      return;
    } else {
      this.setState({
        isOpenEditAntiHardModal: true,
        schedule_date:item.schedule_date,
        system_patient_id:item.system_patient_id,
        schedule_item:item
      });
    }
  };
  
  showEditDialyserModal=(item) =>{
    this.setState({
      isOpenEditDialyserModal: true,
      schedule_date:item.schedule_date,
      system_patient_id:item.system_patient_id,
      schedule_item:item
    });
  };
  
  showEditMoveDateModal=(item) =>{
    this.setState({
      isOpenEditMoveDateModal: true,
      schedule_date:item.schedule_date,
      system_patient_id:item.system_patient_id,
      // schedule_item:item
    });
  };
  showMoveDateMultiModal= (item) =>{
    this.setState({
      isOpenEditMoveDateMultiModal: true,
      schedule_item:item,
      patients_same_day:this.state.list_by_date[item.schedule_date],
    });
  };
  
  showMoveHistoryModal= (item) =>{
    this.setState({
      isOpenMoveHistoryModal: true,
      schedule_item:item
    });
  };
  
  addSchedule = async(day, patient_id) => {
    let path = "/app/api/v2/dial/schedule/addschedule";
    let add_data = {
      schedule_date:day,
      system_patient_id:patient_id,
    };
    
    const post_data = {
      params: add_data
    };
    await apiClient.post(path, post_data);
    this.props.getSearchResult(new Date(day), 0);
  }
  
  move_to_bed = (date) => {
    var url = "/dial/others/bed_table";
    sessApi.setObjectValue("dial_bed_table", "schedule_date", date);
    setTimeout(()=>{
      this.props.history.replace(url);
    }, 500);
    
  }
  
  move_to_doctor_karte = (date, system_patient_id, time_zone = null) => {
    var url = "/dial/board/system_setting";
    sessApi.setObjectValue("from_print", "schedule_date", date);
    sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
    sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
    if (time_zone != null) {
      sessApi.setObjectValue("from_print", "time_zone", time_zone);
    }
    setTimeout(()=>{
      this.props.history.replace(url);
    }, 500);
    
  }
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  delete = (item) => {
    let flag = true;
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.DELETE) === false) {
      flag = false;
      window.sessionStorage.setItem("alert_messages", '削除権限がありません。');
    }
    
    if(flag) {
      this.setState({
        isDeleteConfirmModal : true,
        confirm_message: "スケジュール情報を削除しますか?",
        delete_item:item,
      });
    }
  }
  
  deleteSchedule = async() => {
    let path = "/app/api/v2/dial/schedule/deleteSchedule";
    let delete_data = {
      number:this.state.delete_item.number,
      system_patient_id:this.state.delete_item.system_patient_id,
    }
    const post_data = {
      params: delete_data
    };
    await apiClient.post(path, post_data);
    window.sessionStorage.setItem("alert_messages",  "削除完了##" + "スケジュール情報を削除しました。");
    this.confirmCancel();
    this.props.getSearchResult(new Date(this.state.delete_item.schedule_date), 0);
  }
  
  handleClick_patient = (e, system_patient_id, tr_index, td_index) => {
    e.preventDefault();
    this.changeBackgroundColor(tr_index, td_index);
    // eslint-disable-next-line consistent-this
    var that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu_patient: { visible: false } }, ()=>{
        that.moveArea('remove-back-color');
      });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({contextMenu_patient: { visible: false }}, ()=>{
        that.moveArea('remove-back-color');
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("schedule-table")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_patient: { visible: false },
        }, ()=>{
          that.moveArea('remove-back-color');
        });
        document
          .getElementById("schedule-table")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    document
      .addEventListener("wheel", function onScrollOutside() {
        that.setState({
          contextMenu_patient: { visible: false },
        }, ()=>{
          that.moveArea('remove-back-color');
        });
        document
          .getElementById("schedule-table")
          .removeEventListener(`wheel`, onScrollOutside);
      });
    let clientY = e.clientY;
    let clientX = e.clientX;
    this.setState({
      contextMenu_patient: {
        visible: true,
        x: e.clientX-200,
        y: e.clientY + window.pageYOffset,
        system_patient_id:system_patient_id},
      contextMenu_other:{visible:false},
      contextMenu_move_to_bed:{visible:false},
      contextMenu:{visible:false},
    }, ()=>{
      let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
      let window_height = window.innerHeight;
      if (clientY + menu_height > window_height) {
        this.setState({
          contextMenu_patient: {
            visible: true,
            x: clientX-200,
            y: clientY - menu_height,
            system_patient_id:system_patient_id
          },
          contextMenu_other:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu:{visible:false},
        })
      }
    })
  }
  
  handleClick = (e, item, day, tr_index, td_index) => {
    this.setbackColorFlag = null;
    this.changeBackgroundColor(tr_index, td_index);
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    var that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu: { visible: false } }, ()=>{
        that.moveArea('remove-back-color');
      });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({contextMenu: { visible: false }}, ()=>{
        that.moveArea('remove-back-color');
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("schedule-table")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        }, ()=>{
          that.moveArea('remove-back-color');
        });
        document
          .getElementById("schedule-table")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    document
      .addEventListener("wheel", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        }, ()=>{
          that.moveArea('remove-back-color');
        });
        document
          .getElementById("schedule-table")
          .removeEventListener(`wheel`, onScrollOutside);
      });
    let clientY = e.clientY;
    let clientX = e.clientX;
    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX-200,
        y: e.clientY + window.pageYOffset,
        item:item,
        day:day,
      },
      contextMenu_other:{visible:false},
      contextMenu_move_to_bed:{visible:false},
      contextMenu_patient:{visible:false},
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
            item:item,
            day:day,
          },
          contextMenu_other:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu_patient:{visible:false},
        })
      } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
        this.setState({
          contextMenu: {
            visible: true,
            x: clientX-200,
            y: clientY - menu_height,
            item:item,
            day:day,
          },
          contextMenu_other:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu_patient:{visible:false},
        })
      } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          contextMenu: {
            visible: true,
            x: clientX-200-menu_width,
            y: clientY + window.pageYOffset,
            item:item,
            day:day,
          },
          contextMenu_other:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu_patient:{visible:false},
        })
      }
      
    });
  }
  
  handleClick_other = (e, day, patient_id, tr_index, td_index) => {
    this.setbackColorFlag = null;
    this.changeBackgroundColor(tr_index, td_index);
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    var that = this;
    
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu_other: { visible: false } }, ()=>{
        that.moveArea('remove-back-color');
      });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({contextMenu_other: { visible: false }}, ()=>{
        that.moveArea('remove-back-color');
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("schedule-table")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_other: { visible: false }
        }, ()=>{
          that.moveArea('remove-back-color');
        });
        document
          .getElementById("schedule-table")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    document
      .addEventListener("wheel", function onScrollOutside() {
        that.setState({
          contextMenu_other: { visible: false },
        }, ()=>{
          that.moveArea('remove-back-color');
        });
        document
          .getElementById("schedule-table")
          .removeEventListener(`wheel`, onScrollOutside);
      });
    // this.setState({
    //   contextMenu_other: {
    //     visible: true,
    //     x: e.clientX-200,
    //     y: e.clientY + window.pageYOffset,
    //     day:day,
    //     patient_id:patient_id
    //   },
    //   contextMenu:{visible:false},
    //   contextMenu_move_to_bed:{visible:false}
    // });
    let clientY = e.clientY;
    let clientX = e.clientX;
    this.setState({
      contextMenu_other: {
        visible: true,
        x: e.clientX-200,
        y: e.clientY + window.pageYOffset,
        day:day,
        patient_id:patient_id
      },
      contextMenu:{visible:false},
      contextMenu_move_to_bed:{visible:false},
      contextMenu_patient:{visible:false},
    }, ()=>{
      let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
      let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
      let window_height = window.innerHeight;
      let window_width = window.innerWidth;
      if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          contextMenu_other: {
            visible: true,
            x: clientX-200-menu_width,
            y: clientY - menu_height,
            day:day,
            patient_id:patient_id
          },
          contextMenu:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu_patient:{visible:false},
        })
      } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
        this.setState({
          contextMenu_other: {
            visible: true,
            x: clientX-200,
            y: clientY - menu_height,
            day:day,
            patient_id:patient_id
          },
          contextMenu:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu_patient:{visible:false},
        })
      } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          contextMenu_other: {
            visible: true,
            x: clientX-200-menu_width,
            y: clientY + window.pageYOffset,
            day:day,
            patient_id:patient_id
          },
          contextMenu:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu_patient:{visible:false},
        })
      }
      
    });
  }
  
  handleClick_move_to_bed = (e, date, tr_index, td_index) => {
    e.preventDefault();
    this.changeBackgroundColor(tr_index, td_index);
    // eslint-disable-next-line consistent-this
    var that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu_move_to_bed: { visible: false } }, ()=>{
        that.moveArea('remove-back-color');
      });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({contextMenu_move_to_bed: { visible: false }}, ()=>{
        that.moveArea('remove-back-color');
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("schedule-table")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_move_to_bed: { visible: false }
        }, ()=>{
          that.moveArea('remove-back-color');
        });
        document
          .getElementById("schedule-table")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    
    document
      .addEventListener("wheel", function onScrollOutside() {
        that.setState({
          contextMenu_move_to_bed: { visible: false },
        }, ()=>{
          that.moveArea('remove-back-color');
        });
        document
          .getElementById("schedule-table")
          .removeEventListener(`wheel`, onScrollOutside);
      });
    let clientY = e.clientY;
    let clientX = e.clientX;
    this.setState({
      contextMenu_move_to_bed: {
        visible: true,
        x: e.clientX-200,
        y: e.clientY + window.pageYOffset,
        date:date
      },
      contextMenu:{visible:false},
      contextMenu_other:{visible:false},
      contextMenu_patient:{visible:false},
    }, () =>{
      let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
      let window_width = window.innerWidth;
      if (clientX + menu_width + 200 > window_width) {
        this.setState({
          contextMenu_move_to_bed: {
            visible: true,
            x: clientX-200-menu_width,
            y: clientY,
            date:date
          },
          contextMenu:{visible:false},
          contextMenu_other:{visible:false},
          contextMenu_patient:{visible:false},
        })
      }
    });
  }
  
  handleOk = (schedule_item) => {
    this.props.getSearchResult(new Date(schedule_item.schedule_date), 0);
    this.closeModal();
  };
  
  
  handleMoveMulti =  (movePatientList, newDate, injection_move, inspection_move, prescription_move, manage_move) => {
    this.closeModal();
    let path = "/app/api/v2/dial/schedule/dial_schedule_move_multi_update";
    const post_data = {
      params: {
        'schedule_items':movePatientList,
        new_date:newDate,
        injection:injection_move,
        inspection:inspection_move,
        prescription : prescription_move,
        manage:manage_move
      }
    };
    apiClient.post(path, post_data)
      .then((res) => {
        if (res.alert_message != ''){
          this.setState({
            validate_alert_message:res.alert_message,
            newDate,
          })
        } else {
          this.props.getSearchResult(new Date(newDate), 0);
          window.sessionStorage.setItem("alert_messages", 'スケジュールを移動しました。');
        }
      });
  }
  setColor = (schedule_date, time_zone) => {
    let cur_date = new Date(schedule_date);
    let week_number = cur_date.getDay();
    let background_color = dial_color['default']['cell_back'];
    
    if(week_number !== 0){
      if(week_number === 1 || week_number === 3 || week_number === 5 ){
        if(time_zone !== 3){
          background_color = dial_color[week_number][time_zone]['cell_back'];
        }
      } else {
        if(time_zone === 1){
          background_color = dial_color[week_number][1]['cell_back'];
        }
      }
    }
    return background_color;
  }
  
  setBackcolor = (date, day_of_week) => {
    var holidays = this.state.holidays;
    if (holidays == undefined || holidays == null || holidays.length == 0 || !holidays.includes(date)){
      if (holidays_color.days[day_of_week] == undefined || holidays_color.days[day_of_week] == null){
        return holidays_color.default.schedule_date_cell_back;
      } else {
        return holidays_color.days[day_of_week].schedule_date_cell_back;
      }
    } else {
      return holidays_color.holiday.schedule_date_cell_back;
    }
  }
  
  setFontcolor = (date, day_of_week) => {
    var holidays = this.state.holidays;
    if (holidays == undefined || holidays == null || holidays.length > 0 || !holidays.includes(date)){
      if (holidays_color.days[day_of_week] == undefined || holidays_color.days[day_of_week] == null){
        return holidays_color.default.schedule_date_cell_font;
      } else {
        return holidays_color.days[day_of_week].schedule_date_cell_font;
      }
    } else {
      return holidays_color.holiday.schedule_date_cell_font;
    }
  }
  
  goOtherPattern = (url, systemPatientId) => {
    sessApi.delObjectValue("dial_setting","patient", "");
    sessApi.setObjectValue("dial_setting","patientById", systemPatientId);
    this.props.history.replace(url);
  };
  
  cellHover=(e, tr_index, td_index)=>{
    let contextMenu = this.state.contextMenu;
    let contextMenu_other = this.state.contextMenu_other;
    let contextMenu_move_to_bed = this.state.contextMenu_move_to_bed;
    var contextMenu_patient = this.state.contextMenu_patient;
    if((contextMenu !== undefined && contextMenu.visible) || (contextMenu_patient !== undefined && contextMenu_patient.visible) ||
      (contextMenu_other !== undefined && contextMenu_other.visible) || (contextMenu_move_to_bed !== undefined && contextMenu_move_to_bed.visible)){
      return;
    }
    if(e){
      this.changeBackgroundColor(tr_index, td_index);
    }
  };
  
  changeBackgroundColor=(tr_index, td_index)=>{
    //#F2F2F2
    let tr_obj = document.getElementsByClassName("tr-"+tr_index)[0];
    if(tr_obj !== undefined && tr_obj != null){
      tr_obj.style['background-color'] = "#F2F2F2";
    }
    if(this.tr_index != null && this.tr_index !== tr_index){
      let tr_obj = document.getElementsByClassName("tr-"+this.tr_index)[0];
      if(tr_obj !== undefined && tr_obj != null){
        tr_obj.style['background-color'] = "";
      }
    }
    this.tr_index = tr_index;
    let td_obj = document.getElementsByClassName("td-"+td_index);
    if(td_obj !== undefined && td_obj != null){
      for (let j = 0; j < td_obj.length; j++){
        if(td_obj[j] !== undefined && td_obj[j] != null){
          let schedule_flag = td_obj[j].getAttribute("schedule_flag");
          if(schedule_flag != 1){
            td_obj[j].style['background-color'] = "#F2F2F2";
          }
        }
      }
    }
    if(this.td_index != null && this.td_index !== td_index){
      let td_obj = document.getElementsByClassName("td-"+this.td_index);
      // if(tr_obj !== undefined && tr_obj != null){
      for (let j = 0; j < td_obj.length; j++){
        if(td_obj[j] !== undefined && td_obj[j] != null){
          let schedule_flag = td_obj[j].getAttribute("schedule_flag");
          if(schedule_flag != 1){
            td_obj[j].style['background-color'] = "";
          }
        }
      }
      // }
    }
    this.td_index = td_index;
  };
  
  moveArea=(e)=>{
    let contextMenu = this.state.contextMenu;
    let contextMenu_other = this.state.contextMenu_other;
    let contextMenu_move_to_bed = this.state.contextMenu_move_to_bed;
    let contextMenu_patient = this.state.contextMenu_patient;
    if((contextMenu !== undefined && contextMenu.visible) || (contextMenu_patient !== undefined && contextMenu_patient.visible) ||
      (contextMenu_other !== undefined && contextMenu_other.visible) || (contextMenu_move_to_bed !== undefined && contextMenu_move_to_bed.visible)){
      return;
    }
    if(this.setbackColorFlag === 'contextmenu'){
      return;
    }
    if(e){
      if(this.tr_index == null){
        return;
      }
      let tr_obj = document.getElementsByClassName("tr-"+this.tr_index)[0];
      if(tr_obj !== undefined && tr_obj != null){
        tr_obj.style['background-color'] = "";
      }
      this.tr_index = null;
      let td_obj = document.getElementsByClassName("td-"+this.td_index);
      if(tr_obj !== undefined && tr_obj != null){
        for (let j = 0; j < td_obj.length; j++){
          if(td_obj[j] !== undefined && td_obj[j] != null){
            let schedule_flag = td_obj[j].getAttribute("schedule_flag");
            if(schedule_flag != 1){
              td_obj[j].style['background-color'] = "";
            }
          }
        }
      }
      this.td_index = null;
    }
  };
  
  closeAlertModal = () => {
    this.setState({validate_alert_message:''}, () => {
      this.props.getSearchResult(new Date(this.state.newDate), 0);
    });
  }
  
  render() {
    let {list_date_week, list_dialysis_schedule,  patient_list, new_list_matrix} = this.state;
    let cur_patient = "";
    if (this.props.patientInfo != undefined && this.props.patientInfo != null && this.props.patientInfo.patient_number != undefined){
      cur_patient = this.props.patientInfo.patient_number;
    }
    var today = formatDateLine(new Date());
    return (
      <Wrapper>
        <table className="table-scroll table table-bordered" id="schedule-table" style={{tableLayout:'fixed'}}>
          <thead>
          <tr>
            <th className="number_name">患者番号<br/>氏名</th>
            {list_date_week !==undefined && list_date_week !== null && list_date_week.length >0 && (
              list_date_week.map((item, index) => {
                  return (
                    <>
                      <th className={today==item.date?'today-th week_day':'week_day'} onContextMenu={e => this.handleClick_move_to_bed(e, item.date,null, index)}
                          style={{background:this.setBackcolor(item.date,item.day_of_week), color:this.setFontcolor(item.date, item.day_of_week)}}
                          onMouseOver={e => this.cellHover(e, null, index)}
                      >
                        <label>{item.week}</label><br/><label>{item.day}</label>
                      </th>
                    </>
                  )
                }
              ))
            }
          </tr>
          </thead>
          <tbody className="table-body" onMouseOut={e=>this.moveArea(e)}>
          {list_dialysis_schedule !== undefined && list_dialysis_schedule !== null && list_dialysis_schedule.length > 0 && this.state.bed_master_number_list != undefined
          && patient_list != undefined && patient_list != null && Object.keys(patient_list).length > 0 && (
            // Object.keys(list_matrix).map((idx) => {
            new_list_matrix.map((item1, patient_index)  => {
              // let item1 = list_matrix[idx];
              var idx = item1.patient_id;
              return (
                <>
                  <tr className={'tr-'+idx + (cur_patient == patient_list[idx].patient_number ? " selected_tr":"")}>
                    <td
                      className={cur_patient == patient_list[idx].patient_number ? "text-left number_name selected_color":"text-left number_name"}
                      onContextMenu={e => this.handleClick_patient(e, patient_list[idx].system_patient_id, idx, null)}
                      onMouseOver={e => this.cellHover(e, idx, null)}
                    >
                      {patient_list[idx].patient_number}<br/><span>{patient_list[idx].patient_name}</span>
                    </td>
                    {list_date_week.map((day, index)=>{
                        var check_last_row_flag = ((new_list_matrix.length == patient_index + 1) && (today==day.date));
                        if (item1[day.date] !== undefined){
                          let item = item1[day.date];
                          if(item.move_date_flag ){
                            return (
                              <>
                                <td
                                  onDoubleClick={()=>this.showEditModal(item)}
                                  onContextMenu={e => this.handleClick(e, item, day.date, idx, index)}
                                  style={{backgroundColor: this.setColor(item.schedule_date, item.time_zone)}}
                                  className = {(today==day.date?"today-td td-"+ index :"td-"+ index) +' ' + (check_last_row_flag?'today-last-row-td':'') + ' '
                                  + (update_class[item.is_updated] + ' '+ temporary_class[item.is_temporary] + ' ' + move_date_class[item.move_date_flag])}
                                  onMouseOver={e => this.cellHover(e, idx, index)}
                                  schedule_flag="1"
                                >
                                  <span>移</span>
                                </td>
                              </>
                            )
                          } else{
                            return (
                              <>
                                <td
                                  onDoubleClick={()=>this.showEditModal(item)}
                                  onContextMenu={e => this.handleClick(e, item, day.date, idx, index)}
                                  style={{backgroundColor: this.setColor(item.schedule_date, item.time_zone), paddingLeft:'1px'}}
                                  className = {(today==day.date?"today-td td-"+ index :"td-"+ index) +' ' + (check_last_row_flag?'today-last-row-td':'') + ' '
                                  + (update_class[item.is_updated] + ' '+ temporary_class[item.is_temporary] + ' ' + move_date_class[item.move_date_flag])}
                                  onMouseOver={e => this.cellHover(e, idx, index)}
                                  schedule_flag="1"
                                >
                                  <span>{this.state.bed_master_number_list[item.bed_no]}</span>
                                </td>
                              </>
                            )
                          }
                        } else {
                          return(
                            <td
                              onContextMenu = {e => this.handleClick_other(e, day.date, idx, idx, index)}
                              onMouseOver={e => this.cellHover(e, idx, index)}
                              className={(today==day.date?"today-td td-"+ index:"td-"+ index) + ' ' + (check_last_row_flag?'today-last-row-td':'')}
                            />
                          )
                        }
                      }
                    )}
                  </tr>
                </>)
            })
          )}
          </tbody>
        </table>
        {this.state.isOpenEditScheduleModal && (
          <EditDailysisSchedulModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            saveDailysisSchedule = {this.saveDailysisSchedule}
            schedule_item = {this.state.schedule_item}
            schedule_date = {this.state.schedule_date}
            system_patient_id = {this.state.system_patient_id}
            add_flag = {this.state.add_flag}
            patient_info = {this.props.patient_list[this.state.system_patient_id]}
          />
        )}
        {this.state.isOpenEditAntiHardModal && (
          <EditAntiHardModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            saveDailysisSchedule = {this.saveDailysisSchedule}
            schedule_date = {this.state.schedule_date}
            system_patient_id = {this.state.system_patient_id}
            dial_schedule_item = {this.state.schedule_item}
          />
        )}
        {this.state.isOpenEditDialyserModal && (
          <EditDialyserModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            saveDailysisSchedule = {this.saveDailysisSchedule}
            dial_schedule_item = {this.state.schedule_item}
            schedule_date = {this.state.schedule_date}
            system_patient_id = {this.state.system_patient_id}
          />
        )}
        {this.state.isOpenEditMoveDateModal && (
          <EditMoveDateModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            saveDailysisSchedule = {this.saveDailysisSchedule}
            schedule_date = {this.state.schedule_date}
            system_patient_id = {this.state.system_patient_id}
          />
        )}
        {this.state.isOpenEditMoveDateMultiModal && (
          <EditMoveDateMultiModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            saveDailysisSchedule = {this.saveDailysisSchedule}
            schedule_item = {this.state.schedule_item}
            patients_same_day={this.state.patients_same_day}
            handleMoveMulti={this.handleMoveMulti.bind(this)}
          />
        )}
        {this.state.isOpenMoveHistoryModal && (
          <ScheduleHistoryModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            schedule_item = {this.state.schedule_item}
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deleteSchedule.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.validate_alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.validate_alert_message}
            title = '一括移動状況'
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
        />
        <ContextMenu_other
          {...this.state.contextMenu_other}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
        />
        
        <ContextMenu_move_to_bed
          {...this.state.contextMenu_move_to_bed}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
        />
        <ContextMenu_patient
          {...this.state.contextMenu_patient}
          parent={this}
        />
      </Wrapper>
    )
  }
}

Dialysis.contextType = Context;

Dialysis.propTypes = {
  list_date_week : PropTypes.array,
  list_schedule : PropTypes.array,
  list_matrix : PropTypes.array,
  list_by_date : PropTypes.array,
  patient_list : PropTypes.array,
  getSearchResult: PropTypes.func,
  history: PropTypes.object,
  holidays: PropTypes.object,
  patientInfo: PropTypes.object,
  new_list_matrix: PropTypes.array,
};

export default withRouter(Dialysis)