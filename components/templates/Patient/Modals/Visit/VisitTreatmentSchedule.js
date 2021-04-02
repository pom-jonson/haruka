import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {
  formatDateLine, formatJapanDateSlash,
  formatJapanMonth, formatTimeSecondIE,
  getNextMonthByJapanFormat,
  getPrevMonthByJapanFormat,
  getWeekName
} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import VisitTreatmentPatientModal from "~/components/templates/Patient/Modals/Visit/VisitTreatmentPatientModal";
import VisitTreatmentGroupModal from "~/components/templates/Patient/Modals/Visit/VisitTreatmentGroupModal";
import GroupScheduleEditModal from "~/components/templates/Patient/Modals/Visit/GroupScheduleEditModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import axios from "axios/index";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, KARTEMODE, CACHE_SESSIONNAMES} from "~/helpers/constants";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Button from "~/components/atoms/Button";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import auth from "~/api/auth";
import {setDateColorClassName} from '~/helpers/dialConstants';

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {
    display: flex;
  }
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
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
    background-color: white;
    table {
      margin:0px;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(100vh - 23rem);
        width:100%;
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;        
        tr{
          width: calc(100% - 17px);
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
        position: sticky;
        text-align: center;
        padding: 0;
        font-size: 1rem;
        white-space:nowrap;
        border:none;
        border-right:1px solid #dee2e6;
        font-weight: normal;
        border-bottom: 1px solid #aaa;
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
  .view-place-group-mode {
    button {
      height:2.3rem;
      line-height:2.3rem;
      width:12rem;
    }
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 0.5rem 0px 0.5rem 0.5rem;
  width: 100%;
  .search-box {
    width: 100%;
    display: flex;
    .year_month {
      width:12rem;
    }
  }
`;

const SpinnerWrapper = styled.div`
    padding-top: 70px;
    padding-bottom: 70px;
    height: 100px;
`;

const display_order = [
  { id: 0, value: "患者番号"},
  { id: 1, value: "氏名"},
];

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
                       visit_type,
                       visit_item,
                       visit_date,
                       select_patient_visit_mode
                     }) => {
  //
  if (visible && visit_type == "fill") {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("visit_edit", visit_item, visit_date)}>編集</div></li>
          <li><div onClick={() =>parent.contextMenuAction("visit_delete", visit_item, visit_date)}>削除</div></li>
          {visit_item[visit_date]['state'] === 0 && (
            <li><div onClick={() =>parent.contextMenuAction("treat_stop", visit_item, visit_date)}>診察中止</div></li>
          )}
          {select_patient_visit_mode == false && (
            <li><div onClick={() =>parent.contextMenuAction("visit_karte", visit_item, visit_date)}>カルテを表示</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );

    //
  } else if(visible && visit_type == "nofill") {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("visit_register", visit_item, visit_date)}>登録</div></li>
          {select_patient_visit_mode == false && (
            <li><div onClick={() =>parent.contextMenuAction("visit_karte", visit_item, null)}>カルテを表示</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextPlaceMenu = ({
                            visible,
                            x,
                            y,
                            parent,
                            visit_date,
                            group_schedule_data
                          }) => {
  //
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextPlaceMenuAction("go_schedule_list", visit_date)}>予定一覧に移動</div></li>
          {group_schedule_data != null && group_schedule_data !== undefined && group_schedule_data[visit_date] !== undefined && (
            <>
              <li><div onClick={() =>parent.contextPlaceMenuAction("reservation_stop", visit_date, group_schedule_data)}>予定を中止</div></li>
              <li><div onClick={() =>parent.contextPlaceMenuAction("group_schedule_edit", visit_date, group_schedule_data)}>編集</div></li>
            </>
          )}
          {group_schedule_data != null && group_schedule_data !== undefined && group_schedule_data[visit_date] === undefined && (
            <>
              <li><div onClick={() =>parent.contextPlaceMenuAction("group_schedule_create", visit_date, group_schedule_data)}>登録</div></li>
            </>
          )}
        </ul>
      </ContextMenuUl>
    );

    //
  } else {
    return null;
  }
};

const ContextCreateMenu = ({
                             visible,
                             x,
                             y,
                             parent,
                             visit_place_id,
                             visit_group_id
                           }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextPlaceMenuAction("open_VisitTreatmentGroupModal", visit_place_id, visit_group_id)}>登録</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;

class VisitTreatmentSchedule extends Component {
  constructor(props) {
    super(props);
    this.select_patient_visit_mode_info = localApi.getObject("select_patient_visit_mode");
    this.select_patient_visit_mode = false;
    if(this.select_patient_visit_mode_info != undefined && this.select_patient_visit_mode_info != null){
      if(this.select_patient_visit_mode_info.is_visit == 1){
        this.select_patient_visit_mode = true;
      }
    }
    this.state = {
      search_month: new Date(),
      visit_group : [{ id: 0, value: "" },],
      visit_group_id:this.select_patient_visit_mode ? this.select_patient_visit_mode_info.visit_group_id : 0,
      order_type:0,
      visit_type:"",
      schedule_data:null,
      confirm_message: "",
      isVisitTreatmentPatientModal: false,
      alert_messages:'',
      isOpenKarteModeModal: false,
      complete_message:'',
      visit_place : [{ id: 0, value: "全て" },],
      visit_place_id:this.select_patient_visit_mode ? this.select_patient_visit_mode_info.visit_place_id : 0,
      isVisitTreatmentGroupModal:false,
      isGroupScheduleEditModal:false,
      all_edit_mode:false,
      all_edit_data:{},
      schedule_view_mode:1, //1:患者別表示,2:施設・グループ別表示
    };
    this.schedule_color_info = null;
    this.tr_index = null;
    this.td_index = null;
    this.setbackColorFlag = null;
    this.visit_patient_numbers = 0;
    this.group_master = [];
  }

  async componentDidMount() {
    let visit_treatment_patient_open_flag = localApi.getValue('visit_treatment_patient_open');
    if(visit_treatment_patient_open_flag != undefined && visit_treatment_patient_open_flag != null && visit_treatment_patient_open_flag == 1){
      localApi.remove('visit_treatment_patient_open');
      this.openVisitTreatmentPatientModal();
    } else {
      localApi.remove("select_patient_visit_mode");
    }
    let visit_treatment_group_open_flag = localApi.getValue('visit_treatment_group_open');
    if(visit_treatment_group_open_flag != undefined && visit_treatment_group_open_flag != null && visit_treatment_group_open_flag == 1){
      localApi.remove('visit_treatment_group_open');
      this.openVisitTreatmentGroupModal();
    }
    localApi.setValue("system_next_page", "/visit/schedule");
    localApi.setValue("system_before_page", "/visit/schedule");
    await this.getScheduleColorInfo();
    await this.getHolidays();
    await this.getPlaceGroup();
    await this.getVisitGroup();
    await this.getSearchResult();
    auth.refreshAuth(location.pathname+location.hash);
  }

  getPlaceGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_place";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          let visit_place = this.state.visit_place;
          res.map(item=>{
            let place = {};
            place.id = item.visit_place_id;
            place.value = item.name;
            visit_place.push(place);
          })
          this.setState({
            visit_place,
          });
        }
      })
      .catch(() => {
      });
  }

  getVisitGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_group";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          let visit_group = this.state.visit_group;
          let group = { id: 0, value: "全て" };
          visit_group.push(group);
          this.group_master = res;
          this.setState({
            visit_group,
          });
        }

      })
      .catch(() => {
      });
  }

  getSearchResult =async()=>{
    if(this.state.schedule_data != null){
      this.setState({schedule_data:null});
    }
    let path = "/app/api/v2/visit/schedule/search";
    let post_data = {
      order_type:this.state.order_type,
      search_month:formatDateLine(this.state.search_month),
      visit_group_id:this.state.visit_group_id,
      visit_place_id:this.state.visit_place_id,
    };
    if(this.select_patient_visit_mode){
      post_data.patient_id = this.select_patient_visit_mode_info.system_patient_id;
      post_data.schedule_view_mode = 1;
    } else {
      post_data.schedule_view_mode = this.state.schedule_view_mode;
    }
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(this.state.schedule_view_mode == 1){
          this.visit_patient_numbers = res.length;
        }
        if(res.length > 0){
          this.setState({
            schedule_data: res,
            complete_message: '',
          });
        } else {
          let schedule_data = [];
          if(this.select_patient_visit_mode){
            schedule_data.push({
              group_name:this.select_patient_visit_mode_info.group_name,
              patient_name:this.select_patient_visit_mode_info.patient_name,
              patient_number:this.select_patient_visit_mode_info.patient_number,
              place_name:this.select_patient_visit_mode_info.place_name,
              system_patient_id:this.select_patient_visit_mode_info.system_patient_id,
            });
          }
          this.setState({
            schedule_data,
            complete_message: '',
          });
        }
      })
      .catch(() => {
      });
  }

  getSearchMonth = value => {
    if(this.state.all_edit_mode){return;}
    this.setState({
      search_month: value,
    }, ()=>{
      this.getHolidays();
      this.getSearchResult();
    });
  };

  PrevMonth = () => {
    if(this.state.all_edit_mode){return;}
    let now_month = this.state.search_month;
    let cur_month = getPrevMonthByJapanFormat(now_month);
    this.setState({ search_month: cur_month}, ()=>{
      this.getHolidays();
      this.getSearchResult();
    });
  };

  NextMonth = () => {
    if(this.state.all_edit_mode){return;}
    let now_month = this.state.search_month;
    let cur_month = getNextMonthByJapanFormat(now_month);
    this.setState({ search_month: cur_month}, ()=>{
      this.getHolidays();
      this.getSearchResult();
    });
  };

  getGroupSelect = e => {
    if(this.state.all_edit_mode){return;}
    let select_obj = document.getElementsByClassName('select-group')[0].getElementsByTagName("select")[0];
    if(select_obj != undefined && select_obj != null){
      let w_len = e.target.value.length;
      let fontSize = "1rem";
      if(w_len > 50){
        fontSize = "0.85rem";
      }
      if(w_len > 60) {
        fontSize = "0.7rem";
      }
      if(w_len > 70) {
        fontSize = "0.6rem";
      }
      if(w_len > 80) {
        fontSize = "0.55rem";
      }
      if(w_len > 90) {
        fontSize = "0.52rem";
      }
      select_obj.style.fontSize = fontSize;
    }
    this.setState({
      visit_group_id: parseInt(e.target.id),
      schedule_data:null
    }, ()=>{
      this.getSearchResult();
    });
  };

  getOrderSelect = e => {                 //表示順
    if(this.state.all_edit_mode){return;}
    this.setState({
      order_type: parseInt(e.target.id),
      schedule_data:null
    }, ()=>{
      this.getSearchResult();
    });
  };

  handleVisitClick = (e, type, item, visit_date, tr_index, td_index) => {
    this.setbackColorFlag = null;
    this.changeBackgroundColor(tr_index, td_index);
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        visit_type: type,
        visit_item: item,
        visit_date: visit_date
      });
    }
  }

  goScheduleList = (e, visit_date, tr_index=null, td_index=null, group_schedule_data) => {
    if(tr_index != null){
      this.setbackColorFlag = null;
      this.changeBackgroundColor(tr_index, td_index);
    }
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextPlaceMenu: { visible: false } }, ()=>{
          that.moveArea('remove-back-color');
        });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextPlaceMenu: { visible: false }}, ()=>{
          that.moveArea('remove-back-color');
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextPlaceMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        visit_date,
        group_schedule_data
      });
    }
  }

  openCreateMenu = (e, visit_place_id, visit_group_id) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextCreateMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextCreateMenu: { visible: false }});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextCreateMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        open_visit_place_id:visit_place_id,
        open_visit_group_id:visit_group_id,
      });
    }
  }

  contextMenuAction = (type, item, visit_date) => {
    switch(type){
      case "visit_register":
        this.editVisitPatientModal(item, visit_date);
        break;
      case "visit_karte":
        if(visit_date == null){
          this.goKartePage(item.system_patient_id);
        } else {
          this.goKartePage(item.system_patient_id, item[visit_date]['number'], item[visit_date]['state'], item[visit_date]['place_name'], item[visit_date]['group_name'], visit_date);
        }
        break;
      case "visit_delete":
        if(!this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.DELETE, 0)){
          this.setState({alert_messages: '削除権限がありません。'});
        } else {
          this.setState({
            confirm_type: type,
            confirm_message: "削除しますか？",
            record_number: item[visit_date]['number'],
          });
        }
        break;
      case "visit_edit":
        this.editVisitPatientModal(item, visit_date, item[visit_date]['state'], item[visit_date]['number'] );
        break;
      case "treat_stop":
        this.setState({
          confirm_type: type,
          confirm_message: '診察を中止しますか？',
          record_number:item[visit_date]['number'],
        });
        break;
    }
  };

  contextPlaceMenuAction = (type, param1=null, param2=null) => {
    switch(type){
      case "go_schedule_list":
        localApi.setValue("search_schedule_date", param1);
        this.goToUrlFunc("/visit_schedule_list");
        break;
      case "open_VisitTreatmentGroupModal":
        this.setState({
          isVisitTreatmentGroupModal:true,
          open_visit_place_id:param1,
          open_visit_group_id:param2,
        });
        break;
      case "reservation_stop":
        this.setState({
          confirm_type: type,
          confirm_message: 'このグループの'+formatJapanDateSlash(param1)+'の予定を中止しますか？（※ 診察開始以降の物は中止されません）',
          group_schedule_number:param2[param1]['number'],
        });
        break;
      case "group_schedule_edit":
        this.setState({
          isGroupScheduleEditModal:true,
          visit_date:param1,
          visit_number:param2[param1]['number'],
          place_name:param2['place_name'],
          edit_visit_place_id:param2['visit_place_id'],
          group_name:param2['group_name'],
          edit_visit_group_id:param2['visit_group_id'],
          scheduled_time_zone:param2[param1]['scheduled_time_zone'],
          scheduled_doctor_number:param2[param1]['scheduled_doctor_number'],
          scheduled_departure_time:param2[param1]['scheduled_departure_time'],
        });
        break;
      case "group_schedule_create":
        this.setState({
          isGroupScheduleEditModal:true,
          visit_date:param1,
          visit_number:null,
          place_name:param2['place_name'],
          edit_visit_place_id:param2['visit_place_id'],
          group_name:param2['group_name'],
          edit_visit_group_id:param2['visit_group_id'],
          scheduled_time_zone:0,
          scheduled_doctor_number:null,
          scheduled_departure_time:null,
        });
        break;
    }
  };

  async getScheduleColorInfo(){
    let path = "/app/api/v2/visit/schedule/getColorInfo";
    let post_data = {
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      this.schedule_color_info = res.data;
    })
  }

  async getHolidays(){
    let now_date = this.state.search_month;
    let year = now_date.getFullYear();
    let month = now_date.getMonth();
    let from_date = formatDateLine(new Date(year, month, 1));
    let end_date = formatDateLine(new Date(year, month+1, 0));
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date: from_date,
      end_date:end_date,
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      this.setState({holidays:Object.keys(res.data)});
    })
  }

  setBackcolor = (date, day_of_week) => {
    let holidays = this.state.holidays;
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
    let holidays = this.state.holidays;
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

  createTable = (type, index = null) => {
    let now_date = this.state.search_month;
    let now_year = now_date.getFullYear();
    let now_month = now_date.getMonth();
    let end_date = new Date(now_year, now_month + 1, 0).getDate();
    let table_menu = [];
    let schedule_data = this.state.schedule_data;
    if(type === 'null'){
      table_menu.push(<td colSpan={end_date + 1} style={{textAlign:"center"}}>
        <div className='spinner_area'>
          <SpinnerWrapper>
            <Spinner animation="border" variant="secondary" />
          </SpinnerWrapper>
        </div>
      </td>);
    } else if(type === 'no_data'){
      table_menu.push(<td colSpan={end_date + 1} style={{textAlign:"center"}}>{'登録されたスケジュールがありません。'}</td>);
    } else if(type === 'thead' || type === 'tbody' || type === 'tbody-all-edit'){
      for (let i = 0; i < end_date; i++) {
        let month = (now_month + 1) < 10 ? '0' + (now_month + 1) : (now_month + 1);
        let date = (i + 1) < 10 ? '0' + (i + 1) : (i + 1);
        let cur_date = now_year + '-' + month + '-' + date;
        let week = new Date(cur_date).getDay();
        if(type === 'thead'){
          if(this.state.schedule_view_mode === 1){
            table_menu.push(
              <th
                className={week == 6 ? "sunday-border" : ""}
                style={{width:"2.5rem", background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week)}}
              >
                <div className={'text-center'}>{getWeekName(now_year, (now_month + 1), (i + 1))}</div>
                <div className={'text-center'}>{i + 1}</div>
              </th>)
          } else {
            table_menu.push(
              <th
                className={week == 6 ? "sunday-border" : ""}
                style={{width:"2.5rem", background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week)}}
                onContextMenu={e => this.goScheduleList(e, cur_date)}
              >
                <div className={'text-center'}>{getWeekName(now_year, (now_month + 1), (i + 1))}</div>
                <div className={'text-center'}>{i + 1}</div>
              </th>
            )
          }
        }
        if(type === 'tbody') {
          let status = null;
          let scheduled_time_zone = null;
          if(schedule_data[index][cur_date] !== undefined && schedule_data[index][cur_date] != null){
            status = schedule_data[index][cur_date]['state'];
            scheduled_time_zone = schedule_data[index][cur_date]['scheduled_time_zone'];
          }
          if(this.state.schedule_view_mode === 1){
            if(status != null){
              table_menu.push(
                <td
                  style={{width:"2.5rem"}}
                  className={week == 6 ? "sunday-border visit-fill td-"+i : "visit-fill td-"+i}
                  onClick={()=>this.editVisitPatientModal(schedule_data[index], cur_date, status, schedule_data[index][cur_date]['number'], index, i)}
                  onContextMenu={e => this.handleVisitClick(e, "fill", schedule_data[index], cur_date, index, i)}
                  onMouseOver={e => this.cellHover(e, index, i)}
                >
                  <div style={{backgroundColor:this.schedule_color_info[scheduled_time_zone]['cell_back'], color:this.schedule_color_info[scheduled_time_zone]['cell_font']}}>
                    <div style={{height:"30px", lineHeight:"30px", borderBottom:"1px solid #dee2e6"}}>{scheduled_time_zone == 0 ? '訪' : (scheduled_time_zone == 1 ? "AM" : "PM")}</div>
                    <div style={{height:"30px", lineHeight:"30px"}}>{status === 2 ? '済' : (status === 99 ? '中止' : ' ')}</div>
                  </div>
                </td>
              )
            } else {
              table_menu.push(
                <td
                  style={{width:"2.5rem"}}
                  className={week == 6 ? "sunday-border td-"+i : "td-"+i}
                  onContextMenu={e => this.handleVisitClick(e, "nofill", schedule_data[index], cur_date, index, i)}
                  onMouseOver={e => this.cellHover(e, index, i)}
                  onClick={()=>this.editVisitPatientModal(null, null, null, null, index, i)}
                >
                  <div style={{height:"30px", lineHeight:"30px", borderBottom:"1px solid #dee2e6"}}>{' '}</div>
                  <div style={{height:"30px", lineHeight:"30px"}}>{' '}</div>
                </td>
              )
            }
          }
          if(this.state.schedule_view_mode === 2){
            if(status != null){
              table_menu.push(
                <td
                  style={{width:"2.5rem"}}
                  className={week == 6 ? "sunday-border visit-fill td-"+i : "visit-fill td-"+i}
                  // onClick={()=>this.editVisitPatientModal(schedule_data[index], cur_date, status, schedule_data[index][cur_date]['number'], index, i)}
                  onContextMenu={e => this.goScheduleList(e, cur_date, index, i, schedule_data[index], schedule_data[index][cur_date]['number'])}
                  onClick={()=>this.editVisitPatientModal(null, null, null, null, index, i)}
                >
                  <div style={{backgroundColor:this.schedule_color_info[scheduled_time_zone]['cell_back'], color:this.schedule_color_info[scheduled_time_zone]['cell_font']}}>
                    <div style={{height:"48px", lineHeight:"48px"}}>{scheduled_time_zone == 0 ? '訪' : (scheduled_time_zone == 1 ? "AM" : "PM")}</div>
                  </div>
                </td>
              )
            } else {
              table_menu.push(
                <td
                  style={{width:"2.5rem"}}
                  className={week == 6 ? "sunday-border td-"+i : "td-"+i}
                  onContextMenu={e => this.goScheduleList(e, cur_date, index, i, schedule_data[index])}
                  onMouseOver={e => this.cellHover(e, index, i)}
                  onClick={()=>this.editVisitPatientModal(null, null, null, null, index, i)}
                >
                  <div style={{height:"48px", lineHeight:"48px"}}>{' '}</div>
                </td>
              )
            }
          }
        }
        if(type === 'tbody-all-edit') { //一括編集モード
          let status = null;
          let scheduled_time_zone = null;
          if(schedule_data[index][cur_date] !== undefined && schedule_data[index][cur_date] != null){
            status = schedule_data[index][cur_date]['state'];
            scheduled_time_zone = schedule_data[index][cur_date]['scheduled_time_zone'];
          }
          let system_patient_id = schedule_data[index]['system_patient_id'];
          if(this.state.all_edit_data[system_patient_id] !== undefined && this.state.all_edit_data[system_patient_id][cur_date] !== undefined){
            let cell_data = this.state.all_edit_data[system_patient_id][cur_date];
            table_menu.push(
              <td
                style={{width:"2.5rem"}}
                className={week == 6 ? "sunday-border visit-fill td-"+i : "visit-fill td-"+i}
                onClick={()=>this.changeScheduledDepartureTime(system_patient_id, cur_date, 0, cell_data['number'], cell_data['scheduled_time_zone'])}
                onMouseOver={e => this.cellHover(e, index, i)}
              >
                {cell_data['scheduled_time_zone'] == -1 ?(
                  <div>
                    <div style={{height:"30px", lineHeight:"30px", borderBottom:"1px solid #dee2e6"}}> </div>
                    <div style={{height:"30px", lineHeight:"30px"}}> </div>
                  </div>
                ):(
                  <div style={{backgroundColor:this.schedule_color_info[cell_data['scheduled_time_zone']]['cell_back'], color:this.schedule_color_info[cell_data['scheduled_time_zone']]['cell_font']}}>
                    <div style={{height:"30px", lineHeight:"30px", borderBottom:"1px solid #dee2e6"}}>
                      {cell_data['scheduled_time_zone'] == 0 ? '訪' : (cell_data['scheduled_time_zone'] == 1 ? "AM" : "PM")}
                    </div>
                    <div style={{height:"30px", lineHeight:"30px"}}> </div>
                  </div>
                )}
              </td>
            );
          } else {
            if(status != null){
              table_menu.push(
                <td
                  style={{width:"2.5rem"}}
                  className={week == 6 ? "sunday-border visit-fill td-"+i : "visit-fill td-"+i}
                  onClick={()=>this.changeScheduledDepartureTime(system_patient_id, cur_date, status, schedule_data[index][cur_date]['number'], scheduled_time_zone)}
                  onMouseOver={e => this.cellHover(e, index, i)}
                >
                  <div style={{backgroundColor:this.schedule_color_info[scheduled_time_zone]['cell_back'], color:this.schedule_color_info[scheduled_time_zone]['cell_font']}}>
                    <div style={{height:"30px", lineHeight:"30px", borderBottom:"1px solid #dee2e6"}}>{scheduled_time_zone == 0 ? '訪' : (scheduled_time_zone == 1 ? "AM" : "PM")}</div>
                    <div style={{height:"30px", lineHeight:"30px"}}>{status === 2 ? '済' : (status === 99 ? '中止' : ' ')}</div>
                  </div>
                </td>
              )
            } else {
              table_menu.push(
                <td
                  style={{width:"2.5rem"}}
                  className={week == 6 ? "sunday-border td-"+i : "td-"+i}
                  onMouseOver={e => this.cellHover(e, index, i)}
                  onClick={()=>this.changeScheduledDepartureTime(system_patient_id, cur_date, 0, 0, -1)}
                >
                  <div style={{height:"30px", lineHeight:"30px", borderBottom:"1px solid #dee2e6"}}>{' '}</div>
                  <div style={{height:"30px", lineHeight:"30px"}}>{' '}</div>
                </td>
              )
            }
          }
        }
      }
    }
    return table_menu
  }

  changeScheduledDepartureTime=(system_patient_id, cur_date, status, number, scheduled_time_zone)=>{
    if(status != 0){
      return;
    }
    let all_edit_data = this.state.all_edit_data;
    if(all_edit_data[system_patient_id] === undefined){
      all_edit_data[system_patient_id] = {};
    }
    if(all_edit_data[system_patient_id][cur_date] === undefined){
      all_edit_data[system_patient_id][cur_date] = {};
    }
    if(scheduled_time_zone == 2){
      all_edit_data[system_patient_id][cur_date]['scheduled_time_zone'] = -1;
    } else {
      all_edit_data[system_patient_id][cur_date]['scheduled_time_zone'] = scheduled_time_zone+1;
    }
    all_edit_data[system_patient_id][cur_date]['number'] = number;
    this.setState({all_edit_data});
  }

  cellHover=(e, tr_index, td_index)=>{
    let contextMenu = this.state.contextMenu;
    let contextPlaceMenu = this.state.contextPlaceMenu;
    if((contextMenu !== undefined && contextMenu.visible) || (contextPlaceMenu !== undefined && contextPlaceMenu.visible)){
      return;
    }
    if(e){
      this.changeBackgroundColor(tr_index, td_index);
    }
  }

  closeModal = (act=null) => {
    this.setState({
      isVisitTreatmentPatientModal: false,
      isVisitTreatmentGroupModal: false,
      isGroupScheduleEditModal: false,
    },()=>{
      this.setbackColorFlag = null;
      this.moveArea('remove-back-color');
    });
    if(act === 'save'){
      this.getSearchResult();
    }
  }

  goKartePage = async(systemPatientId, number=null, state=null, place_name=null, group_name=null, scheduled_date) => {
    if(this.state.all_edit_mode){return;}
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if (item.system_patient_id == systemPatientId) {
        isExist = 1;
      }
    });
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
      return;
    }
    if (isExist == 0) { // new patient connect
      let modal_data = {
        systemPatientId,
        visit_number : number,
        visit_state : state,
        place_name : place_name,
        group_name : group_name,
        scheduled_date,
      };
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
        modal_type:number == null ? '':'visit',
      });
    } else { // exist patient connect
      let patientInfo = karteApi.getPatient(systemPatientId);
      if (patientInfo.karte_mode  != KARTEMODE.READ) {
        let reservation_info = karteApi.getVal(systemPatientId, CACHE_LOCALNAMES.RESERVATION_INFO);
        if(reservation_info !== undefined && reservation_info != null){
          this.setState({alert_messages: '既に'+ reservation_info.diagnosis_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
          return;
        }
        let visit_info = karteApi.getVal(systemPatientId, CACHE_LOCALNAMES.VISIT_INFO);
        if(visit_info !== undefined && visit_info != null && visit_info.schedule_number !== number){
          this.setState({alert_messages:'既に'+ visit_info.place_name +'の'+ visit_info.group_name +'の診察中です。カルテに戻るには、右メニューから患者様を選んでください。'});
          return;
        }
        let visit_continue = true;
        if(visit_info !== undefined && visit_info != null && visit_info.schedule_number === number){
          visit_continue = false; //キャッシュにすでに同じレコードが存在
        }
        if(visit_continue) {
          let treatment_started_at = formatDateLine(new Date())+ ' ' + formatTimeSecondIE(new Date());
          if(state == 0){
            let path = "/app/api/v2/visit/schedule/add_patient";
            let post_data = {
              state: 1,
              number:number,
              treatment_started_at,
            };
            await apiClient
              .post(path, {
                params: post_data
              })
              .then(() => {
              })
              .catch(() => {

              });
          }

          if(state == 0 || state == 1){
            //save cache
            let visit_info = {};
            visit_info.schedule_number = number;
            visit_info.treatment_started_at = treatment_started_at;
            visit_info.place_name = place_name;
            visit_info.group_name = group_name;
            karteApi.setVal(systemPatientId, CACHE_LOCALNAMES.VISIT_INFO, JSON.stringify(visit_info));
          }
        }
      }
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+systemPatientId+"/"+page);
    }
  }

  editVisitPatientModal = async (item, visit_date, visit_status=null, number=null, tr_index=null,  td_index=null) => {
    if(tr_index != null){
      this.setbackColorFlag = "contextmenu";
      this.changeBackgroundColor(tr_index, td_index);
    }
    if(item == null){return;}
    if(number == null && !this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0)){
      this.setState({alert_messages: '登録権限がありません。'});
      return;
    }
    if(number != null && !this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.EDIT, 0)){
      this.setState({alert_messages: '編集権限がありません。'});
      return;
    }
    this.setState({
      visit_number: number,
      isVisitTreatmentPatientModal: true,
      patient_name: item.patient_name,
      patient_number: item.patient_number,
      system_patient_id: item.system_patient_id,
      visit_date,
      visit_status: visit_status,
      place_name: item.place_name,
      group_name: item.group_name,
      is_visit:1,
      scheduled_time_zone: item[visit_date] !== undefined ? item[visit_date]['scheduled_time_zone'] : 0,
      scheduled_doctor_number: item[visit_date] !== undefined ? item[visit_date]['scheduled_doctor_number'] : null,
      scheduled_departure_time: item[visit_date] !== undefined ? item[visit_date]['scheduled_departure_time'] : null,
    });
  }

  deleteSchedule =async()=>{
    this.setState({complete_message:'削除中'});
    let path = "/app/api/v2/visit/schedule/delete";
    let post_data = {
      number:this.state.record_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch(() => {

      });
    this.getSearchResult();
  }

  stopGroupReservation =async()=>{
    this.setState({complete_message:'中止中'});
    let path = "/app/api/v2/visit/schedule/stop_group_reservation";
    let post_data = {
      number:this.state.group_schedule_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch(() => {

      });
    this.getSearchResult();
  }

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  confirmCancel=()=>{
    this.setState({
      confirm_type: "",
      confirm_message: "",
      alert_messages: "",
    });
  }

  confirmOk=()=>{
    this.confirmCancel();
    switch (this.state.confirm_type){
      case 'treat_stop':
        this.treatStop();
        break;
      case 'all_edit_data_save':
        this.saveAllEditData();
        break;
      case 'all_edit_data_stop':
        this.setState({
          all_edit_mode:false,
          all_edit_data:{},
        });
        break;
      case 'visit_delete':
        this.deleteSchedule();
        break;
      case 'reservation_stop':
        this.stopGroupReservation();
        break;
    }
  }

  closeModeModal = () => {
    this.setState({
      isOpenKarteModeModal: false
    });
  };

  treatStop=async()=>{
    this.confirmCancel();
    let path = "/app/api/v2/visit/treat_stop";
    let post_data = {
      number:this.state.record_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.getSearchResult();
        window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch(() => {

      });
  }

  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.setState({
      isOpenKarteModeModal: false
    });
  };

  getPlaceSelect = e => {
    if(this.state.all_edit_mode){return;}
    let select_obj = document.getElementsByClassName('select-place')[0].getElementsByTagName("select")[0];
    if(select_obj != undefined && select_obj != null){
      let w_len = e.target.value.length;
      let fontSize = "1rem";
      if(w_len > 50){
        fontSize = "0.85rem";
      }
      if(w_len > 60) {
        fontSize = "0.7rem";
      }
      if(w_len > 70) {
        fontSize = "0.6rem";
      }
      if(w_len > 80) {
        fontSize = "0.55rem";
      }
      if(w_len > 90) {
        fontSize = "0.52rem";
      }
      select_obj.style.fontSize = fontSize;
    }
    let visit_place_id = parseInt(e.target.id);
    let visit_group = [{id:0, value:"全て"}];
    if(this.group_master.length > 0){
      this.group_master.map(group=>{
        if(visit_place_id == group.visit_place_id){
          visit_group.push({id:group.visit_group_id, value:group.name});
        }
      })
    }
    this.setState({
      visit_place_id,
      visit_group_id: 0,
      visit_group,
    }, ()=>{
      this.getSearchResult();
    });
  };

  openVisitTreatmentGroupModal=()=>{
    if(this.state.all_edit_mode){return;}
    this.setState({
      isVisitTreatmentGroupModal:true,
      open_visit_place_id:null,
      open_visit_group_id:null,
    });
  }

  moveArea=(e)=>{
    let contextMenu = this.state.contextMenu;
    let contextPlaceMenu = this.state.contextPlaceMenu;
    if((contextMenu !== undefined && contextMenu.visible) || contextPlaceMenu !== undefined && contextPlaceMenu.visible){return;}
    if(this.state.isVisitTreatmentPatientModal){return;}
    if(this.setbackColorFlag === 'contextmenu'){return;}
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
            td_obj[j].style['background-color'] = "";
          }
        }
      }
      this.td_index = null;
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
    if(tr_obj !== undefined && tr_obj != null){
      for (let j = 0; j < td_obj.length; j++){
        if(td_obj[j] !== undefined && td_obj[j] != null){
          td_obj[j].style['background-color'] = "#F2F2F2";
        }
      }
    }
    if(this.td_index != null && this.td_index !== td_index){
      let td_obj = document.getElementsByClassName("td-"+this.td_index);
      if(tr_obj !== undefined && tr_obj != null){
        for (let j = 0; j < td_obj.length; j++){
          if(td_obj[j] !== undefined && td_obj[j] != null){
            td_obj[j].style['background-color'] = "";
          }
        }
      }
    }
    this.td_index = td_index;
  }

  setAllEditMode=()=>{
    if(this.state.all_edit_mode){
      return;
    }
    this.setState({all_edit_mode:true})
  }

  confirmAllEditData=(type)=>{
    if(!this.state.all_edit_mode){
      return;
    }
    if(type == "save" && Object.keys(this.state.all_edit_data).length === 0){
      return;
    }
    if(type == "stop" && Object.keys(this.state.all_edit_data).length === 0){
      this.setState({all_edit_mode:false});
      return;
    }
    this.setState({
      confirm_type: 'all_edit_data_'+type,
      confirm_message: type === 'save' ? '一括編集の内容を保存しますか？' : "一括編集の内容を破棄しますか？",
    });
  };

  saveAllEditData=async()=>{
    this.confirmCancel();
    this.setState({complete_message:'保存中'});
    let path = "/app/api/v2/visit/schedule/all_edit_patient";
    let post_data = {
      schedule_data:this.state.all_edit_data
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          complete_message: "",
          all_edit_data:{},
          all_edit_mode:false,
        }, ()=>{
          this.getSearchResult();
        });
        window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch(() => {

      });
  };

  setViewPlaceGroupMode=(mode)=>{
    this.setState({
      schedule_view_mode:mode,
      visit_group_id:0,
    }, ()=>{
      this.getSearchResult();
    });
  }

  goSoapPage=()=>{
    this.props.history.replace("/patients/"+this.select_patient_visit_mode_info.system_patient_id+"/"+"soap");
  }

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
  goToPage = (url) => {
      this.props.history.replace(url);
  }
  openVisitTreatmentPatientModal=()=>{
    this.setState({
      isVisitTreatmentPatientModal:true,
      patient_name:null,
      patient_number:null,
      system_patient_id:null,
      place_name:null,
      group_name:null,
      is_visit:0,
      visit_date: null,
      visit_status: null,
      scheduled_time_zone: 0,
      scheduled_doctor_number: null,
      scheduled_departure_time: null,
    });
  }
  getUsableMenuItem = (menu_id) => {
    let menu_info = sessApi.getObjectValue("init_status", "navigation_menu");
    if (menu_info == undefined || menu_info == null) return false;
    let find_menu = menu_info.find(x=>x.id == menu_id);
    if (find_menu == undefined || find_menu == null) return true;
    return find_menu.is_enabled && find_menu.is_visible;
  }
  
  get_title_pdf = async () => {
    let title = "訪問診療スケジュール_";
    let cur_date = new Date(this.state.search_month);
    let firstDay = new Date(cur_date.getFullYear(), cur_date.getMonth(), 1);
    let lastDay = new Date(cur_date.getFullYear(), cur_date.getMonth() + 1, 0);
    title = title + formatDateLine(firstDay).split('-').join('') + "-" + formatDateLine(lastDay).split('-').join('');
    return title+".pdf";
  }
  
  openPrintPreview=async()=>{
    if(this.state.schedule_data == null || this.state.schedule_data.length === 0 || this.state.all_edit_mode){
      return;
    }
    this.setState({complete_message:"印刷中"});
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/visit/print/schedule";
    let print_data = {
      view_mode:this.state.schedule_view_mode,
      search_month:formatDateLine(this.state.search_month),
      visit_place:this.state.visit_place,
      visit_place_id:this.state.visit_place_id,
      visit_group:this.state.visit_group,
      visit_group_id:this.state.visit_group_id,
      holidays:this.state.holidays === undefined ? null : this.state.holidays,
      holidays_color,
      schedule_data:this.state.schedule_data,
      schedule_color_info:this.schedule_color_info,
    };
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
        this.setState({complete_message:""});
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', pdf_file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch(() => {
        this.setState({complete_message:""});
      })
  }

  render() {
    let list_names = ["訪問診療予定", "訪問診療施設管理", "訪問診療スケジュール"];
    var list_urls = ["/visit_schedule_list", "/visit/group_master", "/visit/schedule"];
    const menu_list_ids = ["1005", "4008", "4007"];
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date arrow morning example-custom-input" onClick={onClick}>
        {formatJapanMonth(value)}
      </div>
    );

    return (
      <PatientsWrapper>
        <div className="title-area flex">
          <div className={'title'}>訪問診療スケジュール</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10) && this.getUsableMenuItem(menu_list_ids[index])){
                  return(
                    <>
                      {item == "訪問診療スケジュール" ? (
                        <>
                          <Button className="tab-btn button active-btn">{item}</Button>
                        </>
                      ):(
                        <Button className="tab-btn button" onClick={()=>this.goToPage(list_urls[index])}>{item}</Button>
                      )}
                    </>
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
          <div className="search-box">
            <div className="year_month flex">
              <div className="prev-month arrow" onClick={this.PrevMonth}>{"< "}</div>
              <DatePicker
                locale="ja"
                selected={this.state.search_month}
                onChange={this.getSearchMonth.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                customInput={<ExampleCustomInput />}
                dayClassName = {date => setDateColorClassName(date)}
              />
              <div className="next-month arrow" onClick={this.NextMonth}>{" >"}</div>
            </div>
            <div className='top_right_area flex'>
              {this.select_patient_visit_mode ? (
                <div className={'flex place-name-area'}>
                  <div className={'place-label'}>施設 : </div>
                  <div className={'place-name'}>{this.select_patient_visit_mode_info.place_name}</div>
                </div>
              ):(
                <div className = "select-place">
                  <SelectorWithLabel
                    options={this.state.visit_place}
                    title="施設"
                    getSelect={this.getPlaceSelect}
                    departmentEditCode={this.state.visit_place_id}
                  />
                </div>
              )}
              {this.select_patient_visit_mode == false && (
                <div className={'view-place-group-mode'}>
                  {this.state.schedule_view_mode === 1 && (
                    <Button type="common" onClick={this.setViewPlaceGroupMode.bind(this, 2)}>施設・グループ別表示</Button>
                  )}
                  {this.state.schedule_view_mode === 2 && (
                    <Button type="common" onClick={this.setViewPlaceGroupMode.bind(this, 1)}>患者別表示</Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Flex>
        {this.state.schedule_view_mode === 1 && (
          <>
            <div className={'flex'}>
              {this.select_patient_visit_mode ? (
                <div className={'flex group-name-area'}>
                  <div className={'group-label'}>グループ : </div>
                  <div className={'group-name'}>{this.select_patient_visit_mode_info.group_name}</div>
                </div>
              ):(
                <div className = "select-group">
                  <SelectorWithLabel
                    options={this.state.visit_group}
                    title="グループ"
                    getSelect={this.getGroupSelect}
                    departmentEditCode={this.state.visit_group_id}
                    isDisabled={this.state.visit_place_id === 0}
                  />
                </div>
              )}
              {this.select_patient_visit_mode == false && (
                <>
                  <div className = "select-display-order">
                    <SelectorWithLabel
                      options={display_order}
                      title="表示順"
                      getSelect={this.getOrderSelect}
                      departmentEditCode={this.state.order_type}
                    />
                  </div>
                  <div className="patient_numbers">{this.visit_patient_numbers}名</div>
                </>
              )}
            </div>
          </>
        )}
        <div className={'flex'}>
          <div className={'block-area'}>
            <div className={'flex btn-area'}>
              {this.state.schedule_view_mode === 1 && (
                <Button type="mono" className={this.state.all_edit_mode ? 'disable-btn' : 'red-btn'} style={{marginRight:"0.5rem"}} onClick={this.setAllEditMode.bind(this)}>一括編集</Button>
              )}
              <Button className={this.state.all_edit_mode ? 'disable-btn' : 'red-btn'} onClick={this.openVisitTreatmentGroupModal}>グループスケジュール登録</Button>
            </div>
          </div>
          {arr_menu_permission['4006'] != undefined && arr_menu_permission['4006'].includes(11) && this.getUsableMenuItem('4006') && (
            <div style={{marginTop:"1rem", marginLeft:"auto", marginRight:0}}>
              <Button className={'red-btn'} onClick={this.openVisitTreatmentPatientModal.bind(this)}>スケジュール登録</Button>
            </div>
          )}
        </div>
        <div className={'schedule-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead>
            <tr>
              <th>
                <div className={'text-left patient-name'} style={{padding:"0 0.5rem", fontSize:"1.25rem"}}>{this.state.schedule_view_mode === 1 ? '患者番号' : '施設名'}</div>
                <div className={'text-left'}  style={{padding:"0 0.5rem", fontSize:"1.25rem"}}>{this.state.schedule_view_mode === 1 ? '氏名' : 'グループ名'}</div>
              </th>
              {this.createTable('thead')}
            </tr>
            </thead>
            <tbody onMouseOut={e=>this.moveArea(e)}>
            {this.state.schedule_data == null ? (
              <tr>{this.createTable('null')}</tr>
            ):(
              <>
                {this.state.schedule_data.length === 0 ? (
                  <tr>
                    {this.createTable('no_data')}
                  </tr>
                ) : (
                  this.state.schedule_data.map((item, index) => {
                    return (
                      <>
                        <tr key={index} className={'tr-border tr-'+index} style={{backgroundColor:"white"}}>
                          {this.state.schedule_view_mode === 1 && (
                            <td onClick={()=>this.goKartePage(item.system_patient_id)} className="visit-patient-name">
                              <div className={'text-left'} style={{padding:"0 0.5rem"}}>{item.patient_number}</div>
                              <div className={'text-left'} style={{padding:"0 0.5rem"}}>{item.patient_name}</div>
                            </td>
                          )}
                          {this.state.schedule_view_mode === 2 && (
                            <td className="visit-patient-name" onContextMenu={e => this.openCreateMenu(e, item.visit_place_id, item.visit_group_id)}>
                              <div className={'text-left'} style={{padding:"0 0.5rem"}}>{item.place_name}</div>
                              <div className={'text-left'} style={{padding:"0 0.5rem"}}>{item.group_name}</div>
                            </td>
                          )}
                          {this.createTable(this.state.all_edit_mode ? 'tbody-all-edit' : 'tbody', index)}
                        </tr>
                      </>
                    )
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </div>
        <div className={'bottom-btn'}>
          <Button
            className={(this.state.schedule_data != null && this.state.schedule_data.length !== 0 && !this.state.all_edit_mode) ? 'red-btn' : 'disable-btn'}
            style={{marginRight:"0.5rem"}}
            onClick={this.openPrintPreview.bind(this)}
          >印刷</Button>
          {this.select_patient_visit_mode == false && this.state.schedule_view_mode == 1 && (
            <>
              <Button className={this.state.all_edit_mode ? 'cancel-btn' : 'disable-btn'} style={{marginRight:"0.5rem"}} onClick={this.confirmAllEditData.bind(this, 'stop')}>一括編集キャンセル</Button>
              <Button className={(this.state.all_edit_mode && Object.keys(this.state.all_edit_data).length > 0) ? 'red-btn' : 'disable-btn'} onClick={this.confirmAllEditData.bind(this, 'save')}>一括編集確定</Button>
            </>
          )}
        </div>
        {this.state.isVisitTreatmentPatientModal && (
          <VisitTreatmentPatientModal
            closeModal={this.closeModal}
            patient_name={this.state.patient_name}
            patient_number={this.state.patient_number}
            system_patient_id={this.state.system_patient_id}
            visit_date={this.state.visit_date}
            visit_status={this.state.visit_status}
            visit_number={this.state.visit_number}
            place_name={this.state.place_name}
            group_name={this.state.group_name}
            scheduled_time_zone={this.state.scheduled_time_zone}
            scheduled_doctor_number={this.state.scheduled_doctor_number}
            scheduled_departure_time={this.state.scheduled_departure_time}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          visit_type={this.state.visit_type}
          visit_item={this.state.visit_item}
          visit_date={this.state.visit_date}
          select_patient_visit_mode={this.select_patient_visit_mode}
        />
        <ContextPlaceMenu
          {...this.state.contextPlaceMenu}
          parent={this}
          visit_date={this.state.visit_date}
          group_schedule_data={this.state.group_schedule_data}
        />
        <ContextCreateMenu
          {...this.state.contextCreateMenu}
          parent={this}
          visit_place_id={this.state.open_visit_place_id}
          visit_group_id={this.state.open_visit_group_id}
        />
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModeModal}
            modal_type={this.state.modal_type}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.isVisitTreatmentGroupModal && (
          <VisitTreatmentGroupModal
            closeModal={this.closeModal}
            visit_place_id={this.state.open_visit_place_id}
            visit_group_id={this.state.open_visit_group_id}
          />
        )}
        {this.state.isGroupScheduleEditModal && (
          <GroupScheduleEditModal
            closeModal={this.closeModal}
            visit_date={this.state.visit_date}
            visit_number={this.state.visit_number}
            place_name={this.state.place_name}
            group_name={this.state.group_name}
            scheduled_time_zone={this.state.scheduled_time_zone}
            scheduled_doctor_number={this.state.scheduled_doctor_number}
            scheduled_departure_time={this.state.scheduled_departure_time}
            visit_place_id={this.state.edit_visit_place_id}
            visit_group_id={this.state.edit_visit_group_id}
          />
        )}
      </PatientsWrapper>
    );
  }
}

VisitTreatmentSchedule.contextType = Context;
VisitTreatmentSchedule.propTypes = {
  history: PropTypes.object,
}
export default VisitTreatmentSchedule;
