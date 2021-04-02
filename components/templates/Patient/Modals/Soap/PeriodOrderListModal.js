import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { formatDateLine, formatJapanSlashDateTime, formatJapanDateSlash, getCurrentDate } from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import * as sessApi from "~/helpers/cacheSession-utils";
import {PER_PAGE, CACHE_LOCALNAMES, CACHE_SESSIONNAMES, getInspectionName} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import Spinner from "react-bootstrap/Spinner";
import {setDateColorClassName} from "~/helpers/dialConstants";
import { Modal } from "react-bootstrap";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import FromApiPagination from "~/components/templates/Maintenance/FromApiPagination";
import PrescriptionIncreasePeriodModal from "~/components/organisms/PrescriptionIncreasePeriodModal";
import InjectionIncreasePeriodModal from "~/components/organisms/InjectionIncreasePeriodModal";
import TreatmentIncreasePeriodModal from "~/components/templates/OrderList/TreatmentIncreasePeriodModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import { persistedState } from "~/helpers/cache";
import { withRouter } from "react-router-dom";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import InspectionDoneModal from "~/components/templates/OrderList/InspectionDoneModal";
import EndoscopeReservationModal from "~/components/templates/Patient/Modals/Common/EndoscopeReservationModal";

const periodOrderOptions = [
  {id: 0,value: "全て"},
  {id: 1,value: "定期処方"},
  {id: 2,value: "定期注射"},
  {id: 3,value: "定期処置"},
  {id: 4,value: "生理検査"},
  {id: 5,value: "内視鏡検査"}
];

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {display: flex;}
  .pullbox-select{
    height:2.4rem;
    line-height:2.4rem;
    font-size:1rem;
  }
  .MyCheck{
    margin-left: 24px;
    margin-bottom: 5px;
    label{
      font-size: 16px;
      margin-right: 10px;
    }
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
    font-size: 1.875rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .hBWNut {
    padding-top: 90px!important;
  }
  .buttons-area{
    position: absolute;
    right: 220px;
    padding-top: 10px;
  }
  .schedule-area {
    width: 100%;    
    table {
      margin:0px;
      background-color: white;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 20rem);
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
        padding: 0.25rem;
        word-break: break-all;
        font-size: 1rem;
        vertical-align: top;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
      }
      th {
        font-size: 1.25rem;
        text-align: center;
        padding: 0.3rem;
        border-bottom: none;
        border-top: none;
        font-weight: normal;
      }
    }
    .go-karte {
      cursor: pointer;
    }
    .no-result {    
      height:calc(100% - 1px);
      width:100%;
      div{
        height:100%;
        width:100%;
        text-align: center;
        vertical-align:middle;
        display:flex;
        align-items:center;
        justify-content:center; 
      }
      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
    .selected {
      background: rgb(105, 200, 225) !important;
      color: white;
    }
  }
  .icon-character {
    width:100%;
    height:100%;
    text-align:enter;
    line-heigt:2rem;
  }
  .auto-reload {
    margin-left: auto;
    margin-right: 0;
    text-align: right;
    label {
      font-size: 1rem;
      margin-right: 0;
    }
  }
`;

const Flex = styled.div`  
  width: 100%;
  input[type="text"]{
    height:2.4rem;
    line-height:2.4rem;
    font-size:1rem;
  }  
  .search-box {
      width: 100%;
      display: flex;
  }
  .react-datepicker__navigation{
    background:none;
  }
  .label-title {
    margin:0;
    font-size:1rem;
    line-height:2.4rem;
  }
  label {
    margin: 0;
    font-size:1rem;
    line-height:2.4rem;
  }
  .select-date {
    line-height: 2.4rem;
    width: auto;
    text-align: left;
    margin-right: 1rem;
  }
  .display_number{
    .pullbox-title{
      width: auto;
      margin-left: 2rem;
      margin-right: 1rem;
    }
    .pullbox-select{
      margin-bottom: 0.5rem;
      width: 8rem;
    }
  }
  .select-group {
    margin-left:0.5rem;
    .label-title {width:3rem;}
    .pullbox-select {width:5rem;}
  }
  .select-department {
    margin-left:0.5rem;
    .label-title {width:4rem;}
    .pullbox-select {width:7rem;}
  }
  .select-doctor {
    margin-left:0.5rem;
    .label-title {width:5rem;}
    .pullbox-select {width:20rem;}
  }
  .select-other-doctor {
    margin:0 0.5rem;
    .label-title {width:4rem;}
    .pullbox-select {width:20rem;}
  }
  .select-emphasis-mode {
    .label-title {
      width:6rem;
      text-align:right;
      margin-right:0.5rem;
    }
    .pullbox-select {width:7rem;}
  }
  .block-area {
    border: 1px solid #aaa;
    margin-left: 2rem;
    padding: 5px;
    position: relative;
    label {
      font-size: 0.875rem;
      width: 6rem;
      
    }
    .check-state {
      button {
        margin-left: 0;
        margin-top: 5px;
        margin-right: 7px;
        padding: 8px 12px;
      }
    }
  }
  .search-btn {
    margin-left:0.5rem;
    height: 2.4rem;
    padding:0 0.5rem;
    background-color: rgb(255, 255, 255);
    span {font-size:1rem;}
  }
`;

const InputBox = styled.div`
  display: flex;
  label {
    color: ${colors.onSecondaryDark};
    letter-spacing: 0.4px;
    text-align: right;
    margin-right: 10px;
    line-height: 38px;
    font-size: 1rem;
    width: 5rem;
    margin-bottom: 0;
  }
  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 0.75rem;
    padding: 0 8px;
    width: 7rem;
    height: 38px;
  }
  input::-ms-clear {
    visibility: hidden;
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
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
      padding: 0.25rem 0.75rem;
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

const ContextMenu = ({visible, x, y, parent}) => {
  if (visible) {
    let period_increase_label = "";
    if (parent.state.order_item.category === "処方") period_increase_label = "定期処方継続登録";
    if (parent.state.order_item.category === "注射") period_increase_label = "定期注射継続登録";
    if (parent.state.order_item.category === "処置") period_increase_label = "定期処置継続登録";
    if (parent.state.order_item.category === "生理検査" || parent.state.order_item.category === "内視鏡検査") period_increase_label = "追加予約";
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("act_view",parent.state.order_item)}>詳細</div></li>
          {parent.state.show_period_increase == true && (
            <li><div onClick={() => parent.contextMenuAction("act_period_increase",parent.state.order_item)}>{period_increase_label}</div></li>
          )}
          <li><div onClick={() => parent.contextMenuAction("act_do",parent.state.order_item)}>Do</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class PeriodOrderListModal extends Component {
  constructor(props) {
    super(props);    
    this.state = {      
      search_date: new Date(),
      selected_index:-1,
      table_list:[],
      pageOfItems:[],
      orderType: 0,
      display_number: 20,
      is_loading:true,
      isOpenDoctorSoapModal:false,
      current_page: 1,
      alert_messages: ""
    };
    this.act_msg = "";
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // ・表示するかどうかは設定ファイルでオンオフを変えられるように。
    this.enable_routinely_order_list_button = 0;
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    if(conf_data != undefined && conf_data != null && conf_data.enable_routinely_order_list_button != undefined && conf_data.enable_routinely_order_list_button != null && conf_data.enable_routinely_order_list_button != ""){
      this.enable_routinely_order_list_button = conf_data.enable_routinely_order_list_button;
    }
  }  

  async componentDidMount() {
    await this.getDoctorsList();
    await this.getSearchResult();
  }    

  getSearchResult =async(_flag=null)=>{    
    let path = "/app/api/v2/order/period/search";    
    let post_data = {     
      patient_id: this.props.patientId,
      search_date:formatDateLine(this.state.search_date),
      current_page: this.state.current_page,
      display_number:this.state.display_number,
      order_type: this.state.orderType,
      get_data_flag: _flag,            
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {   
        let current_page = this.state.current_page;
        if (_flag === 'init') {
          current_page = 1;
        } else {
          if(res.data !== undefined && res.data !=null && res.data.length > 0){
            if (Math.ceil(res.data.length/this.state.display_number) < current_page) current_page = Math.ceil(res.data.length/this.state.display_number);
          }
        }
        if(res.data !== undefined && res.data !=null && res.data.length > 0){
          this.setState({
            table_list: res.data,            
            origin_list: res.origin,
            is_loading: false
          });
        } else {
          this.setState({
            table_list:[],            
            origin_list:[],
            is_loading: false
          });
        }              
      })
      .catch(() => {
        this.setState({
          table_list:[],            
          origin_list:[],
          is_loading: false
        });
      });       
  }

  canShowMenu = (_item) => {    
    // check edit
    let menu_item = this.getListItemByNumber(_item.number); 
    let is_doctor_consented = menu_item.is_doctor_consented;
    let feature_type = "";
    if (_item.category === "処方" || _item.category === "注射") {
      feature_type = this.context.FEATURES.PRESCRIPTION;
    } else if(_item.category === "処置") {
      feature_type = this.context.FEATURES.TREATORDER;
    } else if(_item.category === "生理検査") {
      feature_type = this.context.FEATURES.EXAMORDER;
    } else if(_item.category === "内視鏡検査") {
      feature_type = this.context.FEATURES.ENDOSCOPEORDER;
    }
    let curDate = new Date(getCurrentDate('-'));
    let start_date = new Date(_item.created_at.substring(0,10));

    let canEdit = false;
    if (start_date >= curDate) {
      if ((this.context.$canDoAction(feature_type, this.context.AUTHS.EDIT) || this.context.$canDoAction(feature_type, this.context.AUTHS.EDIT_PROXY)) && is_doctor_consented !== 4) {
        canEdit = true;
      }
    } else {
      if ((this.context.$canDoAction(feature_type, this.context.AUTHS.EDIT_OLD) || this.context.$canDoAction(feature_type, this.context.AUTHS.EDIT_PROXY_OLD)) && is_doctor_consented !== 4) {
        canEdit = true;
      }
    }   
    if (!canEdit) return false;
    // check period
    let canIncreasePeriod = false;
    if ((_item.category === "処方" || _item.category === "注射") && menu_item !== undefined && menu_item.order_data !== undefined &&
      menu_item.order_data.order_data !== undefined && menu_item.order_data.order_data.length > 0) {
      menu_item.order_data.order_data.map(ele=>{
        if (ele.administrate_period !== undefined && ele.administrate_period != null && ele.administrate_period.period_end_date !== undefined &&
          ele.administrate_period.period_end_date != null && ele.administrate_period.period_end_date !== ""){
          let period_end_date = new Date(ele.administrate_period.period_end_date);
          if (period_end_date >= curDate) {
            canIncreasePeriod = true;
          }
        }
      });            
    } else if(_item.category === "処置") {
      if (menu_item !== undefined && menu_item.order_data !== undefined && menu_item.order_data.order_data !== undefined &&
      menu_item.order_data.order_data.detail !== undefined && menu_item.order_data.order_data.detail.length > 0) {
        menu_item.order_data.order_data.detail.map(ele=>{
          if (ele.administrate_period !== undefined && ele.administrate_period != null && ele.administrate_period.period_end_date !== undefined &&
            ele.administrate_period.period_end_date != null && ele.administrate_period.period_end_date !== "") {
            let period_end_date = new Date(ele.administrate_period.period_end_date);
            if (period_end_date >= curDate) {canIncreasePeriod = true;}
          }
        });
      }
    } else if(_item.category === "生理検査" || _item.category === "内視鏡検査") {
      let period_end_date = new Date(menu_item.end_date.split(' ')[0].split('-').join('/'));
      if (period_end_date >= curDate) {canIncreasePeriod = true;}
    }
    if (!canIncreasePeriod) return false;
    // check cache exist
    let canEditOrder = true;
    if (_item.category === "処方") {
      let {cacheState} =persistedState(parseInt(this.props.patientId));
      let order_number = menu_item.record_number;
      if(cacheState != null && cacheState != undefined && Object.keys(cacheState).length > 0){
        Object.keys(cacheState).map(sort_key=>{
          if(cacheState[sort_key][0]['number'] == order_number){
            canEditOrder = false;
          }
        })
      }
    }
    if (_item.category === "注射") {
      let {cacheInjectState} =persistedState(parseInt(this.props.patientId));
      let order_number = menu_item.record_number;
      if(cacheInjectState != null && cacheInjectState != undefined && Object.keys(cacheInjectState).length > 0){
        Object.keys(cacheInjectState).map(sort_key=>{
          if(cacheInjectState[sort_key][0]['number'] == order_number){
            canEditOrder = false;
          }
        })
      }
    }
    if (_item.category === "処置") { // CACHE_LOCALNAMES.TREATMENT_EDIT
      let {cacheTreatState} =persistedState(parseInt(this.props.patientId));
      let order_number = menu_item.record_number;
      if(cacheTreatState != null && cacheTreatState != undefined && Object.keys(cacheTreatState).length > 0){
        Object.keys(cacheTreatState).map(sort_key=>{
          if(cacheTreatState[sort_key]['header']['number'] == order_number){
            canEditOrder = false;
          }
        })
      }
    }
    if (_item.category === "生理検査" || _item.category === "内視鏡検査") {
      let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT);
      let order_number = menu_item.record_number;
      if(cache_data !== undefined && cache_data != null) {
        Object.keys(cache_data).map((index) => {
          if(cache_data[index].number == order_number){
            canEditOrder = false;
          }
        });
      }
    }
    return canEditOrder;
  }
  
  handleClick=(e, item)=>{    
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("list-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: {visible: false}
          });
          document
            .getElementById("list-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      // get modal's offsetLeft
      let modal_offsetLeft = document.getElementById("period_order_list").offsetLeft;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - modal_offsetLeft,
          y: e.clientY - 50,          
        },
        order_item: item,
        show_period_increase: this.canShowMenu(item)
      })
    }
  }
  
  contextMenuAction = (modal_type, order_item) => {
    let _state = {};
    let category = "";
    if (order_item.category === "処方"){category = "prescription";}
    if (order_item.category === "注射"){category = "injection";}
    if (order_item.category === "処置"){category = "treatment";}
    if (order_item.category === "生理検査" || order_item.category === "内視鏡検査"){category = "inspection";}
    if(modal_type === "act_view") {
      _state.isOpenViewModal = true;
      _state.view_modal_type = category;
    } else if(modal_type === "act_period_increase") {
      _state.isOpenPeriodIncreaseModal = true;
      _state.view_modal_type = category;
      if(category === "inspection"){
        let soap_data = this.getListItemByNumber(order_item.number);
        _state.reservation_info = soap_data.order_data.order_data;
        _state.reservation_info.created_at = soap_data.created_at;
        _state.reserve_type = 'inspection_middle';
      }
    } else if(modal_type === "act_do") {
      if(this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.setState({isOpenDoctorSoapModal: true});
        this.act_msg = "edit";
        return;
      }
      let menu_item = this.getListItemByNumber(order_item.number);     
      if (category === 'prescription' || category === 'injection') {        
        window.localStorage.setItem("soap_insert_drop_number", menu_item.record_number);
      }
      if (category === 'prescription') {
        this.props.history.replace(`/patients/${this.props.patientId}/prescription`);        
      }
      if (category === 'injection') {
        this.props.history.replace(`/patients/${this.props.patientId}/injection`);        
      }
      if(category === 'treatment') {
        this.saveTreatmentToCache(menu_item);
      }
      if(category === 'inspection') {
        this.saveInspectionToCache(menu_item);
      }
    }
    if (Object.keys(_state).length == 0){return;}
    this.setState(_state);
  }

  getKarteStatusCodeForCache = () => {
    let karte_status_code = 1;
    if(this.context.karte_status.code == 1){
      karte_status_code = 3;
    }
    if(this.context.karte_status.code == 2){
      karte_status_code = 2;
    }
    return  karte_status_code;
  }

  saveTreatmentToCache = (_item) => {
    let order_data = _item;
    let karte_status_code = this.getKarteStatusCodeForCache();
    let new_order_data = {...order_data['order_data']['order_data']};
    new_order_data['header']['state'] = 0;
    new_order_data['header']['isForUpdate'] = 0;
    new_order_data['header']['number'] = 0;
    new_order_data['header']['date'] = formatDateLine(new Date());
    new_order_data['header']['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
    new_order_data['header']['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
    new_order_data['header']['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
    // ●YJ110 SOAPの中央カラムからDoしたときに、新規発行する入外区分は現在の区分に合わせるように      
    new_order_data['karte_status'] = karte_status_code;
    new_order_data['general_id'] = karte_status_code;
    let cache_karte_status_code = null;
    cache_karte_status_code = order_data.karte_status;
    // ・在宅処置を他の区分で出した場合は、「在宅」部分の追加品名は無視
    if (cache_karte_status_code == 2 && karte_status_code != 2 && new_order_data['item_details'] != undefined && new_order_data['item_details'] != null) {
      delete new_order_data['item_details'];
    }
    // YJ1069 SOAP画面のDoで、外来患者に放射線など尾のオーダーを入院で発行できてしまう
    if (this.context.karte_status.code != 1 && new_order_data['header']['isPeriodTreatment'] != undefined) {
      delete new_order_data['header']['isPeriodTreatment'];
    }
    new_order_data.detail.map((detail, detail_index)=>{
      if (this.context.karte_status.code != 1 && detail.administrate_period != undefined ) {
        delete detail.administrate_period;
      }
      if(detail.treat_done_info !== undefined){
        delete new_order_data.detail[detail_index]['treat_done_info'];
      }
      if(detail.done_comment !== undefined){
        delete new_order_data.detail[detail_index]['done_comment'];
      }
    });
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
  }
  
  saveInspectionToCache=(_item)=>{
    let order_data = _item;
    let karte_status_code = this.getKarteStatusCodeForCache();
    let new_order_data = order_data['order_data']['order_data'];
    new_order_data['state'] = 0;
    new_order_data['isForUpdate'] = 0;
    new_order_data['number'] = 0;
    new_order_data['karte_status'] = karte_status_code;
    new_order_data['order_id'] = 0;
    new_order_data['inspection_DATETIME'] = formatDateLine(new Date());
    new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
    new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
    new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
    if(new_order_data['reserve_time'] !== undefined){delete new_order_data['reserve_time'];}
    if(new_order_data['reserve_data'] !== undefined){delete new_order_data['reserve_data'];}
    if(new_order_data['multi_reserve_flag'] !== undefined){delete new_order_data['multi_reserve_flag'];}
    if(new_order_data['done_numbers'] !== undefined){delete new_order_data['done_numbers'];}
    if(new_order_data.start_date !== undefined){delete new_order_data.start_date;}
    if(new_order_data.continue_date !== undefined){delete new_order_data.continue_date;}
    if(new_order_data.end_date !== undefined){delete new_order_data.end_date;}
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
  }

  getOrderSelect = e => {
    this.setState({ orderType: parseInt(e.target.id) });
  };

  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };

  getDate = value => {
    if(value == null) {value = new Date();}
    this.setState({search_date: value});
  };

  handleSearchResult = () => {
    this.setState({
      is_loading: true
    },()=> {
      this.getSearchResult("init");
    });
  }

  onChangePage(pageOfItems, _curPage) {
    this.setState({
      pageOfItems: pageOfItems,
      current_page: _curPage
    });
  }

  getCategoryName = (_category, inspection_id=undefined) => {
    if (_category === "処方") {
      return "定期処方";
    } else if(_category === "注射") {
      return "定期注射";
    } else if(_category === "処置") {
      return "定期処置";
    } else if(_category === "生理検査" || _category === "内視鏡検査") {
      return getInspectionName(inspection_id);
    }
    return "";
  }

  getListItemByNumber = (_number) => {
    let result = "";
    this.state.origin_list.map(ele=>{
      if (ele.number == _number) {
        result = ele;
      }
    });

    return result;
  }

  getModalData = (_orderItem) => {
    let _modal_data = this.getListItemByNumber(_orderItem.number);
    if(_modal_data.target_table === "inspection_order"){
      return _modal_data;
    }
    let ret = {};        
    ret.patient_id = this.props.patientId,
    ret.created_at = _modal_data.created_at;
    ret.updated_at = _modal_data.updated_at;
    ret.treatment_datetime = _modal_data.treat_date;
    ret.karte_status = _modal_data.karte_status;
    ret.is_doctor_consented = _modal_data.is_doctor_consented;
    ret.input_staff_name = _modal_data.input_staff_name !== undefined && _modal_data.input_staff_name != null && _modal_data.input_staff_name !== "" ? _modal_data.input_staff_name : _modal_data.proxy_input_staff_name;
    ret.doctor_name = _modal_data.order_data.doctor_name;
    ret.data = _modal_data;    
    return ret;
  }

  closeModal = () => {
    this.setState({
      isOpenViewModal: false,
      view_modal_type: "",
      alert_messages: "",
      isOpenPeriodIncreaseModal: false,      
    });
  }

  handleIncreasePrescription = () => {    
    let _state = {
      isOpenViewModal: false,
      view_modal_type: "",
      isOpenPeriodIncreaseModal: false
    }
    if (this.state.view_modal_type == "prescription") {
      _state.alert_messages = "定期処方継続登録しました。";      
    } else if (this.state.view_modal_type == "injection") {      
      _state.alert_messages = "定期注射継続登録しました。";
    } else if (this.state.view_modal_type == "treatment") {      
      _state.alert_messages = "定期処置継続登録しました。";
    }    
    this.setState(_state);  
  }

  handleCloseModal = () => {
    // refresh soap page
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  }

  getDoctorsList = async () => {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    this.setState({ doctors: data });
  }

  getDoctor = e => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(e.target.id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(e.target.id, e.target.getAttribute("label"), department_name);
    this.setState({
      isOpenDoctorSoapModal: false,
    },()=>{
      // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる
     if (this.act_msg === "edit") {
        this.contextMenuAction("act_do", this.state.order_item);
      }      
      this.act_msg = "";
    });
    
  }

  closeDoctorModal = () => {
    this.act_msg = "";
    this.setState({isOpenDoctorSoapModal: false});
  }

  render() {
    let {pageOfItems} = this.state;
    return (
      <Modal
        show={true}
        id="period_order_list"
        className="custom-modal-sm patient-exam-modal period-order-list-modal first-view-modal"
      >
          <Modal.Header><Modal.Title>定期オーダー一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <PatientsWrapper id={'list_area'}>                              
                <Flex>
                  <div style={{display:'flex'}}>
                    <InputBox>
                      <div className={'select-date'}>日付</div>
                      <DatePicker
                        locale="ja"
                        selected={this.state.search_date}
                        onChange={this.getDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="年/月/日"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </InputBox>                    
                    <div className="display_number">
                      <SelectorWithLabel
                        options={periodOrderOptions}
                        title="オーダー種類"
                        getSelect={this.getOrderSelect}
                        departmentEditCode={
                          periodOrderOptions[this.state.orderType].id
                        }
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
                    <Button type="mono" className={'search-btn'} onClick={this.handleSearchResult}>検索</Button>
                  </div>                                
                </Flex>
                <div className={'schedule-area'}>
                  <table className="table-scroll table table-bordered" id="code-table" style={{marginBottom:"0.5rem"}}>
                    <thead className={'thead-area'}>
                    <tr>                      
                      <th style={{width:"15rem"}}>登録日時</th>
                      <th style={{width:"20rem"}}>実施予定の最終日付</th>
                      <th>オーダー種類</th>     
                      {this.enable_routinely_order_list_button == 1 && (
                        <th style={{width:"3rem"}}></th>                      
                      )}                 
                    </tr>
                    </thead>
                    <tbody className={'scroll-area'} id="list-table">
                    {!this.state.is_loading ? (
                      <>
                        {pageOfItems.length > 0 ? pageOfItems.map((item,index)=>{
                          return(
                            <tr
                              key={index}                              
                              className={'row-'+index + (this.state.selected_index == index ? ' selected' : '')}                              
                              style={{cursor:"pointer"}}
                              onContextMenu={e => this.handleClick(e, item)}
                            >
                              <td style={{width:"15rem"}}>{formatJapanSlashDateTime(item.created_at)}</td>
                              <td style={{width:"20rem"}}>{formatJapanDateSlash(item.done_end_date)}</td>
                              <td>{this.getCategoryName(item.category, item.inspection_id)}</td>
                              {this.enable_routinely_order_list_button == 1 && (
                                <td style={{width:"3rem", textAlign:"center", color:item.icon_color}}>{item.icon_label}</td>
                              )}                         
                            </tr>
                          )
                        }):(
                          <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                        )}
                      </>
                    ):(
                      <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </div>
                    )}
                    </tbody>
                  </table>
                  <FromApiPagination
                    items={this.state.table_list}
                    onChangePage={this.onChangePage.bind(this)}
                    pageSize = {this.state.display_number}
                    showAlways={true}
                  />
                </div>                
                <ContextMenu
                  {...this.state.contextMenu}
                  parent={this}
                />
              </PatientsWrapper>
              {this.state.isOpenViewModal && this.state.view_modal_type === "injection" && (
                <InjectionIncreasePeriodModal
                  patientId={this.props.patientId}
                  patientInfo = {this.props.patientInfo}
                  closeModal={this.closeModal}
                  doneInjection={this.handleIncreasePrescription}
                  modal_type={"injection"}
                  modal_title={""}
                  modal_data={this.getModalData(this.state.order_item)}
                  show_type={"read"}
                />
              )}
              {this.state.isOpenViewModal && this.state.view_modal_type === "prescription" && (
                <PrescriptionIncreasePeriodModal
                  patientId={this.props.patientId}
                  patientInfo = {this.props.patientInfo}
                  closeModal={this.closeModal}
                  donePrescription={this.handleIncreasePrescription}
                  modal_type={"prescription"}
                  modal_title={""}
                  modal_data={this.getModalData(this.state.order_item)}
                  show_type={"read"}
                />
              )}
              {this.state.isOpenViewModal && this.state.view_modal_type === "inspection" && (
                <InspectionDoneModal
                  closeModal={this.closeModal}
                  modal_title={this.state.order_item.category}
                  modal_data={this.getModalData(this.state.order_item)}
                  from_page={'period_order_list'}
                  only_close_btn={true}
                />
              )}
              {this.state.isOpenViewModal && this.state.view_modal_type === "treatment" && (
                <TreatmentIncreasePeriodModal
                  patientId={this.props.patientId}
                  patientInfo = {this.props.patientInfo}
                  closeModal={this.closeModal}
                  handleOk={this.handleIncreasePrescription}
                  modal_type={"treatment"}
                  modal_data={this.getModalData(this.state.order_item)}
                  show_type={"read"}
                />
              )}
              {this.state.isOpenPeriodIncreaseModal && this.state.view_modal_type === "prescription" && (
                <PrescriptionIncreasePeriodModal
                  patientId={this.props.patientId}
                  patientInfo = {this.props.patientInfo}
                  closeModal={this.closeModal}
                  donePrescription={this.handleIncreasePrescription}
                  modal_type={"prescription_increase"}
                  modal_title={""}
                  modal_data={this.getModalData(this.state.order_item)}
                />
              )}
              {this.state.isOpenPeriodIncreaseModal && this.state.view_modal_type === "injection" && (
                <InjectionIncreasePeriodModal
                  patientId={this.props.patientId}
                  patientInfo = {this.props.patientInfo}
                  closeModal={this.closeModal}
                  doneInjection={this.handleIncreasePrescription}
                  modal_type={"injection_increase"}
                  modal_title={""}
                  modal_data={this.getModalData(this.state.order_item)}
                />
              )}
              {this.state.isOpenPeriodIncreaseModal && this.state.view_modal_type === "treatment" && (
                <TreatmentIncreasePeriodModal
                  patientId={this.props.patientId}
                  patientInfo = {this.props.patientInfo}
                  closeModal={this.closeModal}
                  handleOk={this.handleIncreasePrescription}
                  modal_type={"treatment_increase"}
                  modal_data={this.getModalData(this.state.order_item)}
                />                
              )}
              {this.state.alert_messages !== "" && (
                <AlertNoFocusModal
                  hideModal= {this.closeModal}
                  handleOk= {this.closeModal}
                  showMedicineContent= {this.state.alert_messages}
                />
              )}
              {this.state.doctors !== undefined && this.state.isOpenDoctorSoapModal === true && (
                <SelectDoctorModal
                  closeDoctor={this.closeDoctorModal}
                  getDoctor={this.getDoctor}
                  selectDoctorFromModal={this.selectDoctorFromModal}
                  doctors={this.state.doctors}
                />
              )}
              {this.state.isOpenPeriodIncreaseModal && this.state.view_modal_type === "inspection" && (
                <EndoscopeReservationModal
                  closeModal={this.closeModal}
                  system_patient_id={this.props.patientId}
                  patient_name={this.props.patientInfo.name}
                  reservation_info={this.state.reservation_info}
                  reserve_type={this.state.reserve_type}
                  enable_multi_reserve={true}
                />
              )}
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.handleCloseModal}>閉じる</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

PeriodOrderListModal.contextType = Context;
PeriodOrderListModal.propTypes = {
  history: PropTypes.object,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
}
export default withRouter(PeriodOrderListModal);

