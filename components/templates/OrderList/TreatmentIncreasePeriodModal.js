import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {WEEKDAYS, CACHE_LOCALNAMES, getStaffName, getVisitPlaceNameForModal} from "~/helpers/constants";
import axios from "axios";
import {surface,secondary200,disable} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import { formatJapanDateSlash, formatTimeIE, formatDateSlash, getWeekNamesBySymbol, formatDateLine } from "~/helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import {displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";
import DatePicker from "react-datepicker";
import Spinner from "react-bootstrap/Spinner";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  display: flex;
  text-align: center;
  height: 100%;
  .content{
    overflow-y: hidden;
    height: 100%;
  }
  .patient-info {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
 `;
const SpinnerWrapper = styled.div`
   height: 100%;
   width: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
 `;
const Col = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  textarea {
    width: 100%;
    resize: none;
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    background: linear-gradient(#d0cfcf, #e6e6e7);
  }
  .data-header{
    background: rgb(105, 200, 225);
    color: white;
    padding: 4px 8px;
  }
  .bottom-line{
    border-bottom: 1px solid rgb(213, 213, 213);
  }
  .data-title{
    border: 1px solid rgb(213,213,213);
    cursor: pointer;
  }
  ._color_alerted{
    .history-region{
      background: #ffe5c7;
    }
    .doctor-name{
      background: #ffe5c7;
    }
    .data-item{
      background: linear-gradient(#e8d2ac, #ffe6b8, #ffe6b8);
    }
  }
  ._color_received{
    .history-region{
      background: #dbffff;
    }
    .doctor-name{
      background: #dbffff;
    }

    .data-item{
      background: linear-gradient(#bfefef, #c7f8f8, #c7f8f8);
    }
  }
  ._color_implemented{
    .history-region{
      background: #e5ffdb;
    }
    .doctor-name{
      background: #e5ffdb;
    }
    .data-item{
      background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
    }
  }
  ._color_not_implemented{
    .history-region{
      background: #ffe5ef;
    }
    .doctor-name{
      background: #ffe5ef;
    }
    .data-item{
      background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
    }
  }
  .department{
    font-size: 1rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold;
    text-align: left;
    padding-left: 0.5rem;
  }
  .doctor-name{
    font-size: 12px;
    padding-right: 8px;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 12px;
    padding-right: 8px;
  }
  .order{
    display: block !important;
  }
  .data-list{
    background-color: ${surface};
    margin-top: 0.5rem;
    height: calc(100% - 2rem);
    .data-item{
      padding: 0.5rem 0.5rem 0 0.5rem;
    }
  }
  .low-title,
  .middle-title{
    background: rgb(230, 230, 231);
  }
  .facility-border{
    border-top: 1px solid rgb(213, 213, 213);
  }
  .flex {
    display:flex;
  }
`;

const MedicineListWrapper = styled.div`
  font-size:${props=>(props.font_props != undefined?0.75 * props.font_props + 'rem':'0.75rem')};
  height: calc(100% - 7rem);
  .history-item {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 1px;
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .box {
    line-height: 1.3rem;
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .phy-box{
    line-height: 1.3rem;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    .text-left{
      .table-item{
        width: 6rem;
        float: left;
        text-align: right;
      }
      padding: 0.25rem;
      border-right: lightgray solid 1px;
    }
    line-height: 1rem;
    .text-right{
      .table-item{
        text-align: left;
      }
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .line-through {
    color: #ff0000;
  }
  .flex {
    display: flex;
    margin-bottom: 0;
    &.between {
      justify-content: space-between;
      div {
        margin-right: 0;
      }
    }
    div {
      margin-right: 8px;
    }
    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }
  .full-text {
    width: 100%;
    text-align: right;
    margin-right: 11px;
  }
  .patient-name {
    margin-left: 16px;
  }
  .drug-item {
    border-bottom: 1px solid ${disable};
    .open-close-button {
      width: 6rem;
    }
  }
  .text-right {
    width: calc(100% - 9rem);
  }
  .remarks-comment {
    width: 100%;
    word-wrap: break-word;
    .pullbox-title {
      width: 0;
    }
    .pullbox-label {
      margin-bottom: 0;
    }
    .selected {
      background: lightblue;
    }
    .treat-done-info, .treat-surface {
      label{
        margin-bottom: 0;
      }
    }
    .quantity-unit{
      justify-content: flex-end;
      .quantity {
        margin-top: -8px;
        input {
          height: 1.875rem;
          font-size: 0.75rem;
          width: 8rem;
        }
        .label-title {display:none;}
      }
      .label-title{
        font-size: 0.75rem;
        line-height: 1.875rem;
        text-align: right;
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }
  .hidden {
    display: none;
  }
  p {
    margin-bottom: 0;
  }
`;

class TreatmentIncreasePeriodModal extends Component {
  constructor(props) {
    super(props);
    let init_status = JSON.parse(window.sessionStorage.getItem("init_status"));
    let department_data = init_status.diagnosis_treatment_department;
    this.departmentOptions = [];
    if(department_data.length > 0){
      department_data.map(department=>{
        this.departmentOptions[department['id']] = department['value'];
      })
    }
    this.treat_order_part_position_mode = sessApi.getObjectValue("init_status", "conf_data").treat_order_part_position_mode;
    let modal_data = JSON.parse(JSON.stringify(props.modal_data));
    let order_data = undefined;
    modal_data = modal_data.data;
    let tmp_modal_data = modal_data;
    modal_data['treatment_datetime'] = tmp_modal_data.treatment_datetime;
    modal_data['treatment_date'] = tmp_modal_data.treatment_date;
    modal_data['target_table'] = tmp_modal_data.target_table;
    modal_data['doctor_name'] = tmp_modal_data.doctor_name;
    modal_data['input_staff_name'] = tmp_modal_data.input_staff_name;
    let patient_info = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    modal_data['patient_number'] = patient_info.receId;
    modal_data['patient_name'] = patient_info.name;
    if(modal_data.order_data !== undefined){
      order_data = modal_data.order_data.order_data!=undefined?modal_data.order_data.order_data:modal_data.order_data;
        order_data.detail.map(ele=>{
          if (ele.administrate_period != undefined && ele.administrate_period != null && ele.administrate_period.period_end_date != undefined && ele.administrate_period.period_end_date != "") {
            if (ele.administrate_period.increase_period_end_date == undefined || ele.administrate_period.increase_period_end_date == null) {
              ele.administrate_period.increase_period_end_date = ele.administrate_period.period_end_date;
            }
            if (ele.administrate_period.days == undefined || ele.administrate_period.days == null || ele.administrate_period.days == "") {
              ele.administrate_period.days = this.getIncreaseDate(ele.administrate_period).length;
            }
          }
        });
    }
    let done_time_show = false;
    if (order_data !== undefined && order_data.header.isPeriodTreatment == 1 && order_data.detail[0].done_numbers !== undefined && props.modal_data.detail_index != undefined ) {
      let cnt_index = modal_data.cnt_index;
      let schedule_date = modal_data.date;
      let execute_info = order_data.detail[0].done_numbers[schedule_date][cnt_index];
      if (execute_info !== undefined && execute_info.time != undefined && execute_info.time == "") {
        done_time_show=true;
      }
    }
    this.state = {
      modal_data,
      order_data,
      confirm_message: "",
      alert_messages: "",
      item_categories:[{ id: 0, value: ""}],
      treat_item_unit:[],
      treat_set:[],
      implement_check_list:[],
      confirm_alert_title: "",
      done_time_show,
      confirm_done_time: "",
      request_data: {},
      position_data: {},
      part_data: {},
      side_data: {},
      request_options: {},
      part_options: {},
      position_options: {},
      side_options: {},
      is_loaded: false,
      end_date: props.end_date !== undefined && props.end_date != null ? new Date(props.end_date) : undefined,
      done_date: props.done_date !== undefined && props.done_date != null ? new Date(props.done_date) : undefined,
      practice_master: []
    };
    this.save_disable = false;
    this.change_flag = 0;
    this.treat_position = [];
    this.can_done = true;
  }
  
  async componentDidMount() {
    this.can_done = this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.DONE_OREDER);
    let path = "/app/api/v2/master/treat";
    let post_data = {get_type: "treat_done"};
    let practice_master = [];
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          let request_options = {};
          if (res.treat_request != null && res.treat_request.length > 0) {
            this.state.order_data.detail.map(item=> {
                let filtered_request = [];
                res.treat_request.map(sub_item=>{
                  if (item.practice_id == sub_item.practice_id) {
                    filtered_request.push({id: sub_item.request_id, value: sub_item.name});
                  }
                });
                if (filtered_request.length > 1) {
                  request_options[item.practice_id] = filtered_request;
                }
            })
          }
          let part_options = {};
          if (res.treat_part != null && res.treat_part.length > 0) {
            this.state.order_data.detail.map(item=> {
                let filtered_part = [];
                res.treat_part.map(sub_item=>{
                  filtered_part.push({id: sub_item.part_id, value: sub_item.name, part_id: sub_item.part_id});
                });
                if (filtered_part.length > 1) {
                  part_options[item.practice_id] = filtered_part;
                }
            })
          }
          let position_options = {};
          if (res.treat_position != null && res.treat_position.length > 0) {
              this.treat_position = JSON.parse(JSON.stringify(res.treat_position));
          }
          let side_options = {};
          if (res.treat_side != null && res.treat_side.length > 0) {
            this.state.order_data.detail.map(item=> {
                let filtered_side = [];
                res.treat_side.map(sub_item=>{
                  filtered_side.push({id: sub_item.side_id, value: sub_item.name});
                });
                if (filtered_side.length > 1) {
                  side_options[item.practice_id] = filtered_side;
                }
            })
          }
          let practice_options = {};
          if (res.treat_practice != null && res.treat_practice.length > 0) {
            res.treat_practice.map(sub_item=>{
              practice_options[sub_item.practice_id] = sub_item;
            });
          }
          practice_master = res.treat_practice;
          
          this.setState({
            practice_master: res.treat_practice,
            request_options,
            practice_options,
            part_options,
            position_options,
            side_options,
            request_master: res.treat_request,
            position_master: res.treat_position,
            part_master: res.treat_part,
            side_master: res.treat_side,
            is_loaded: this.use_done_info != 1
          });
        }
      })
      .catch(() => {
      });
      
    if(this.use_done_info === 1){
      await this.getDoneInfo(practice_master);
    }
  }
  
  validatePeriodChanged = () => {
    let result = false;
    this.state.modal_data.order_data.order_data.detail.map(item=>{
      if (item.administrate_period != undefined && item.administrate_period != null && item.administrate_period.period_end_date != undefined) {
        if (item.administrate_period.period_end_date != item.administrate_period.increase_period_end_date) {
          result = true;
        }
      }
    });
    return result;
  }
  
  getIncreaseDate = (period_param) => {
    let type = period_param["period_type"];
    let s_date = period_param["period_start_date"];
    let e_date = period_param["period_end_date"];
    
    let ret_dates = [];
    if(type == 0) { //間隔指定
      let category = period_param["period_category"];
      if(category == 0) {
        for(let i=new Date(s_date).getTime(); i<=new Date(e_date).getTime(); i+=2*24*60*60*1000) {
          ret_dates.push(formatDateLine(i));
        }
      } else if(category == 1) {
        for(let i=new Date(s_date).getTime(); i<=new Date(e_date).getTime(); i+=7*24*60*60*1000) {
          ret_dates.push(formatDateLine(i));
        }
      } else if(category == 2) {
        ret_dates.push(s_date);
        let i = 1;
        let i_date = s_date;
        while(new Date(i_date).getTime()<=new Date(e_date).getTime()) {
          let fromDate = new Date(i_date);
          i_date = formatDateLine(new Date(new Date(fromDate).setMonth(fromDate.getMonth() + i)));
          if(new Date(i_date).getTime()>new Date(e_date).getTime()) break;
          ret_dates.push(i_date);
          i++;
        }
      }
    }
    else if(type == 1) {
      for(let i=new Date(s_date).getTime(); i<=new Date(e_date).getTime(); i+=24*60*60*1000) {
        let date_weekday = new Date(i).getDay();
        if (period_param['period_week_days'].includes(date_weekday)) {
          ret_dates.push(formatDateLine(new Date(i)));
        }
      }
    }
    
    return ret_dates;
    
  }
  
  getDoneInfo=async(practice_master)=>{
    let path = "/app/api/v2/order/treat/get_done_info";
    let post_data = {};
    let { data } = await axios.post(path, {params: post_data});
    let item_categories = this.state.item_categories;
    if(data.item_categories.length > 0){
      data.item_categories.map((item)=>{
        item_categories.push({id: item.item_category_id, value: item.name});
      });
    }
    let order_data = this.state.order_data;
    order_data.detail.map((detail, detail_idx)=>{
      let set_master = [{ id: 0, value: "" }];
      let deploy_set = null;
      if(data.treat_set.length > 0){
        data.treat_set.map(set=>{
          if(set.practice_id === detail.practice_id && set.classification_id === detail.classification_id){
            if(deploy_set == null && set.is_auto_deployment === 1){deploy_set = set;}
            set_master.push({id: set.number, value: set.treat_set_name});
          }
        })
      }
      order_data.detail[detail_idx]['set_master'] = set_master;
      order_data.detail[detail_idx]['set_id'] = 0;
      if(deploy_set != null){
        order_data.detail[detail_idx]['set_data'] = deploy_set['treat_dtail_item'];
        order_data.detail[detail_idx]['set_id'] = deploy_set.number;
        order_data.detail[detail_idx]['set_name'] = deploy_set.treat_set_name;
        if(deploy_set.treat_dtail_item != null && Object.keys(deploy_set.treat_dtail_item).length > 0){
          Object.keys(deploy_set.treat_dtail_item).map((index)=>{
            order_data.detail[detail_idx]['done_info'][index]['number'] = deploy_set.treat_dtail_item[index]['index'];
            order_data.detail[detail_idx]['done_info'][index]['check'] = 1;
            order_data.detail[detail_idx]['done_info'][index]['classfic'] = deploy_set.treat_dtail_item[index]['item_category_id'];
            order_data.detail[detail_idx]['done_info'][index]['classfic_name'] = (item_categories.find(x => x.id === deploy_set.treat_dtail_item[index]['item_category_id']) != undefined)
              ? item_categories.find(x => x.id === deploy_set.treat_dtail_item[index]['item_category_id']).value : '';
            order_data.detail[detail_idx]['done_info'][index]['item_id'] = deploy_set.treat_dtail_item[index]['item_id'];
            order_data.detail[detail_idx]['done_info'][index]['item_name'] = deploy_set.treat_dtail_item[index]['name'];
            order_data.detail[detail_idx]['done_info'][index]['main_unit'] = deploy_set.treat_dtail_item[index]['main_unit'];
            order_data.detail[detail_idx]['done_info'][index]['count'] = deploy_set.treat_dtail_item[index]['count'];
            order_data.detail[detail_idx]['done_info'][index]['unit_id'] = deploy_set.treat_dtail_item[index]['unit_id'];
            order_data.detail[detail_idx]['done_info'][index]['lot'] = deploy_set.treat_dtail_item[index]['lot'];
            order_data.detail[detail_idx]['done_info'][index]['comment'] = deploy_set.treat_dtail_item[index]['comment'];
            order_data.detail[detail_idx]['done_info'][index]['receipt_key'] = deploy_set.treat_dtail_item[index]['receipt_key'];
          })
        }
        if(data.treat_item_unit !== undefined && data.treat_item_unit != null && data.treat_item_unit.length >0){
          Object.keys(order_data.detail[detail_idx]['done_info']).map((index) => {
            if (order_data.detail[detail_idx]['done_info'][index]['item_id'] !== 0) {
              data.treat_item_unit.map(item=>{
                if(item.item_id === order_data.detail[detail_idx]['done_info'][index]['item_id']){
                  if(order_data.detail[detail_idx]['done_info'][index]['unit_id'] === item.unit_id){
                    order_data.detail[detail_idx]['done_info'][index]['unit_name'] = item.name;
                  }
                  order_data.detail[detail_idx]['done_info_detail_unit'][index].push({id:item.unit_id, value: item.name});
                }
              })
            }
          });
        }
      }
      let select_practice = practice_master.find(x=>x.practice_id == order_data.detail[detail_idx]['practice_id']);
      if (select_practice != undefined) {
        order_data.detail[detail_idx]['show_set_detail'] = select_practice.done_item_mode == 2 ? 1 :0;
        order_data.detail[detail_idx]['can_open'] = select_practice.done_item_mode == 0 ? 0 : 1;
        if (order_data.detail[detail_idx]['show_set_detail'] != 1) {
          let is_exist = false;
          if (order_data.detail[detail_idx]['done_info'].findIndex(x=>x.item_name != "") > -1) is_exist = true;
          if (deploy_set != null || select_practice.oxygen_treatment_flag == 1 || is_exist) {
            order_data.detail[detail_idx]['show_set_detail'] = 1;
            order_data.detail[detail_idx]['can_open'] = 1;
          }
        }
      }
      if (detail.part_id>0 && detail.practice_id > 0) this.selectPart(detail_idx, detail.part_id, detail.practice_id);
      if (detail.position_id>0 && detail.practice_id > 0) this.selectPosition(detail_idx, detail.position_id);
      if (detail.side_id>0 && detail.practice_id > 0) this.selectSide(detail_idx, detail.side_id);
    });
    this.setState({
      item_categories,
      treat_item_unit:data.treat_item_unit,
      order_data,
      treat_set:data.treat_set,
      is_loaded: true
    });
  }
  
  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }
  
  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1) => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }
    if (nDoctorConsented == 4) {
      return "";
    }
    if (nDoctorConsented == 2) {
      strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 8)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1 && strStuffName != undefined && strStuffName != null && strStuffName != '') {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 8)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1 && strStuffName != undefined && strStuffName != null && strStuffName != '') {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
  }
  
  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    if (nDoctorConsented == 4) {
      return `（過去データ取り込み）${strDoctorName}`;
    }
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else{
      if (nDoctorConsented == 1) {
        return `[承認済み] 依頼医: ${strDoctorName}`;
      } else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }
  
  confirmCancel=()=>{
    let focus_target = this.state.focus_target;
    let {alert_action} = this.state;
    this.setState({
      alert_messages: '',
      focus_target:undefined,
      confirm_message: "",
      confirm_alert_title: "",
      confirm_action: "",
      alert_action: "",
      oxygen_menu_idx: -1
    }, ()=>{
      if (focus_target != undefined) {
        focus_target.focus();
      }
    });
    if (alert_action == "close") {
      let post_data = this.state.alert_data;
      if (post_data === undefined) return;
      
    }
  }
  
  confirmOk =async()=> {
    this.confirmCancel();
    if (this.state.confirm_action === "close") {
      this.props.closeModal();
      return;
    }
    let {modal_data} = this.state;
    let treatment = this.state.order_data;
    treatment.created_at = modal_data.created_at;
    treatment.state = modal_data.state;
    treatment.header.isForUpdate = 1;
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT);
    let stampKey = new Date().getTime();
    if (cache_data != null && cache_data != undefined) {
      Object.keys(cache_data).map((index) => {
        if (cache_data[index]['header'].number == modal_data.number) {
          stampKey = index;
        }
      });
    }
    treatment.detail.map(item=>{
      if (item.administrate_period != undefined && item.administrate_period != null && item.administrate_period.period_end_date != undefined) {
        if (item.administrate_period.increase_days != undefined && item.administrate_period.increase_days > item.administrate_period.days) {
          item.administrate_period.period_end_date = item.administrate_period.increase_period_end_date;
          item.administrate_period.days = item.administrate_period.increase_days;
        }
      }
    })
  
    treatment.last_doctor_code = treatment.header.doctor_code;
    treatment.last_doctor_name = treatment.header.doctor_name;
    treatment.increasePeriod = 1;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, stampKey, JSON.stringify(treatment), 'insert');
  
    this.props.handleOk();
  };
  
  openConfirm =() => {
    if (this.save_disable) return;
    if (this.state.done_time_show && this.state.confirm_done_time == "") {
      this.setState({alert_messages: "実施時間を設定を選択してください。"});
      return;
    }
    this.setState({
      confirm_message: "編集を確定しますか？",
      confirm_alert_title: "編集確定確認"
    });
  };

  getOrderImplementClassName = (item) => {

    let class_name = "";
    
    if (item.completed_at != undefined && item.completed_at != "") {
      if (this.state.order_data.karte_status == 3) {
        class_name = "_color_implemented_hospital";
      } else {
        class_name = "_color_implemented";
      }
    } else {
      if (this.state.order_data.karte_status == 3) {
        class_name = "_color_not_implemented_hospital";
      } else {
        class_name = "_color_not_implemented";
      }
    }
    
    return class_name;        
  }
  
  getOrderTitleClassName = (param_obj) => {
    if (param_obj.target_table == "order") {
      if (param_obj.is_doctor_consented != 4 && (param_obj.done_order == 0 || param_obj.done_order == 3)) {
        return param_obj.karte_status_name != "入院・"? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status_name != "入院・"? "_color_implemented" : "_color_implemented_hospital";
      }
    } else if(param_obj.target_table == "inspection_order") {
      if (param_obj.state == 0) {
        return param_obj.karte_status_name != "入院・"? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.state == 1) {
        return param_obj.karte_status_name != "入院・"? "_color_received" : "_color_received_hospital";
      }
      if ( param_obj.state == 2) {
        return param_obj.karte_status_name != "入院・"? "_color_implemented" : "_color_implemented_hospital";
      }
    } else if(param_obj.target_table == "treat_order_header") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status_name != "入院・"? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.state == 1) {
        return param_obj.karte_status_name != "入院・"? "_color_implemented" : "_color_implemented_hospital";
      }
    }
    return "";
  }
  
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    return _insuranceName
  }
  getMinTime = (i, done_times) => {
    let result = new Date(formatDateSlash(new Date())+" 00:00:00");
    if (i == 0) return result;
    if (i - 1 == 0 && (done_times[i-1] == "" || done_times[i-1] == null)) return new Date(formatDateSlash(new Date())+" 00:05:00");
    
    let min_time = "";
    for (var loop = i-1; loop >= 0; loop--) {
      if (done_times[loop] && done_times[loop] != "" && done_times[loop] != null) {
        min_time = done_times[loop];
      }
      if (min_time != "") break;
    }
    
    result = min_time == "" ? result : new Date(formatDateSlash(new Date()) + " " + min_time + ":00");
    result.setMinutes(result.getMinutes() + 5);
    let convert_date = new Date(formatDateSlash(new Date()) + " " + result.getHours()+":"+result.getMinutes() + ":00");
    
    return convert_date;
  }
  
  getMaxTime = (i, done_count, done_times) => {
    let result = new Date(formatDateSlash(new Date())+" 23:55:00");
    if (i == done_count - 1) return result;
    if (i + 1 == done_count - 1 && (done_times[i+1] == "" || done_times[i-1] == null)) return new Date(formatDateSlash(new Date())+" 23:50:00");
    
    let max_time = "";
    for (var loop = i+1; loop <= done_count - 1; loop++) {
      if (done_times[loop] && done_times[loop] != "" && done_times[loop] != null) {
        max_time = done_times[loop];
      }
      if (max_time != "") break;
    }
    
    result = max_time == "" ? result : new Date(formatDateSlash(new Date()) + " " + max_time + ":00");
    result.setMinutes(result.getMinutes() - 5);
    let convert_date = new Date(formatDateSlash(new Date()) + " " + result.getHours()+":"+result.getMinutes() + ":00");
    
    return convert_date;
  }
  getDoneTime = (value) => {
    this.setState({confirm_done_time: value});
  }
  getDoneDateTime = (value) => {
    this.setState({done_date: value});
  }
  getEndDate = (value) => {
    this.setState({end_date: value});
  }
  
  maincloseModal = () => {
    if (this.props.show_type == "read") {
      this.props.closeModal();
      return;
    }

    if (this.change_flag == 1) {
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_action:"close",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.props.closeModal();
  }
  
  increasePeriod = () => {
    this.setState({
      confirm_message: "編集を確定しますか？",
      confirm_title: "編集確定確認",
      confirm_type: "_increaseInjection"
    });
  }
  
  validateRealPeriod = () => {
    let result = false;
    this.state.modal_data.order_data.order_data.detail.map(item=>{
      if (item.administrate_period != undefined && item.administrate_period != null && item.administrate_period.period_end_date != undefined) {
        if (item.administrate_period.increase_days != undefined && item.administrate_period.increase_days > item.administrate_period.days) {
          result = true;
        }
      }
    });
    return result;
  }
  
  getDoneTimes = (_done_times=null) => {
    if (_done_times == null || _done_times.length < 1) return "";
    
    let result = _done_times.map((item, index)=>{
      return(
        <>
          <span> {index+1}回目 {item != "" ? item : "未定"}{index == (_done_times.length - 1) ? "":"、"}</span>
        </>
      );
    });
    return result;
  }
  
  handleIncreaseDateChange = async (value, key) => {
    let modal_data = this.state.modal_data;
    modal_data.order_data.order_data.detail.map((ele, idx)=>{
      if (idx == key) {
        if (ele.administrate_period != undefined && ele.administrate_period != null) {
          ele.administrate_period.increase_period_end_date = formatDateLine(value);
          let increase_date_period_obj = JSON.parse(JSON.stringify(ele.administrate_period));
          increase_date_period_obj.period_end_date = ele.administrate_period.increase_period_end_date;
          let _doneDays = this.getIncreaseDate(increase_date_period_obj);
          ele.administrate_period.increase_days = _doneDays.length;
          ele.administrate_period.done_days = _doneDays;
        }
      }
    });
    this.setState({
      modal_data: modal_data,
    })
  }
  
  render() {
    let { modal_data, order_data} = this.state;
    let karte_status_name = "外来・";
    if (order_data !== undefined && order_data.karte_status !== undefined) {
      karte_status_name = order_data.karte_status === 1 ? "外来・" : (order_data.karte_status === 2 ? "訪問診療・" : (order_data.karte_status === 3 ? "入院・" : ""));
    }
    let modal_title_label = "定期処置継続登録";
    if (this.props.modal_type == "treatment") {
      modal_title_label = "処置詳細";
    }

    return  (
      <Modal show={true} id="done-order-modal"  className={"custom-modal-sm first-view-modal treatment-increase-period-modal"}>
        <Modal.Header>
          <Modal.Title>{modal_title_label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.is_loaded ? (
            <Wrapper>
              <Col id="soap_list_wrapper">
                <Bar>
                  <div className="content">
                    <div className="w-100 d-flex">
                      <div className={'w-75 patient-info'}>
                        {modal_data.patient_number} : {modal_data.patient_name}
                      </div>
                    </div>
                    <div className="data-list">
                      <div className={`data-title
                         ${this.getOrderTitleClassName({target_table:modal_data.target_table,is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.done_order, state:order_data.header.state, is_enabled:modal_data.is_enabled, karte_status_name:karte_status_name})}`}
                      >
                        <div className={'data-item'}>
                          <div className="flex justify-content">
                            <div className="note">
                              【{(order_data.general_id === 2) ? "在宅処置" : (order_data.general_id === 3 ? "入院処置" : "外来処置")}】
                              {modal_data.is_doctor_consented !== 4 && order_data.header.state === 0 && (<span>未実施</span>)}
                            </div>
                            <div className="department text-right">{this.departmentOptions[order_data.header.department_id]}</div>
                          </div>
                          <div className="date">
                            {modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime != null && modal_data.treatment_datetime !== "" ? (
                              <>
                                {modal_data.treatment_datetime.substr(0, 4)}/
                                {modal_data.treatment_datetime.substr(5, 2)}/
                                {modal_data.treatment_datetime.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                {' '}{modal_data.treatment_datetime.substr(11, 8)}
                              </>
                            ) : (
                              <>
                              {modal_data.updated_at !== undefined && modal_data.updated_at != null && modal_data.updated_at !== "" && (
                                <>
                                {modal_data.updated_at.substr(0, 4)}/
                                {modal_data.updated_at.substr(5, 2)}/
                                {modal_data.updated_at.substr(8, 2)}
                                ({this.getWeekDay(modal_data.updated_at.substr(0,10))})
                                  {' '}{modal_data.updated_at.substr(11, 8)}
                                </>
                              )}
                              </>
                            )}
                          </div>
                        </div>
                        {modal_data.history !== undefined && modal_data.history !== null && modal_data.history !== "" ? (
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(modal_data.history.split(",").length-1, order_data.header.substitute_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        ):(
                          <>
                          {modal_data.updated_at != undefined && modal_data.updated_at != null && modal_data.updated_at != '' && (
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(0, order_data.header.substitute_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                            </div>
                          )}
                          </>
                        )}
                        <div className="doctor-name text-right low-title">
                          {this.getDoctorName(modal_data.is_doctor_consented, order_data.header.doctor_name)}
                        </div>
                        {order_data != undefined && order_data.visit_place_id != undefined && order_data.visit_place_id > 0 && (
                          <div className="doctor-name text-right low-title facility-border">
                            {getVisitPlaceNameForModal(order_data.visit_place_id)}
                          </div>
                        )}
                      </div>
                      <MedicineListWrapper>
                        <div className={'history-item soap-data-item'}>
                          <div className="">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">処置日</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {order_data.header.date == undefined || order_data.header.date == null || order_data.header.date === "" ? ""
                                      : ((order_data.header.start_time === "" || order_data.header.start_time === null) ? formatJapanDateSlash(order_data.header.date)
                                        : formatJapanDateSlash(order_data.header.date)+"  "+order_data.header.start_time)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {this.getInsuranceName(order_data.header.insurance_name)}
                                  </div>
                                </div>
                              </div>
                              {order_data.detail.map((item, detail_index)=>{
                                // let item_done_item_mode = 
                                return(
                                  <>
                                    {item.classification_name !== undefined && item.classification_name !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">分類</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.classification_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {item.practice_name !== undefined && item.practice_name !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">行為名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment d-flex" style={{justifyContent:"space-between"}}>
                                            <span style={{lineHeight:"1.875rem"}}>{item.practice_name}</span>
                                            {item.quantity_is_enabled == 1 && (
                                              <span className="quantity-unit d-flex" style={{lineHeight:"1.875rem"}}>
                                                <span className="label-title">{item.quantity}</span>
                                                {item.unit != null && item.unit !== "" && (
                                                  <span className="label-title ml-2">{item.unit}</span>
                                                )}）
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {item.request_name !== undefined && item.request_name !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">請求情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.request_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {this.treat_order_part_position_mode != 0 && item.part_name !== undefined && item.part_name !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">部位</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.part_name}　{item.position_name !== undefined && item.position_name !== "" ? item.position_name : "" }</div>
                                        </div>
                                      </div>
                                    )}
                                    {item.side_name != undefined && item.side_name != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">左右</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.side_name}</div>
                                        </div>
                                      </div>
                                    )}
                                    {item.barcode != undefined && item.barcode != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">バーコード</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.barcode}</div>
                                        </div>
                                      </div>
                                    )}
                                    {item.surface_data !== undefined && item.surface_data.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">面積</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="remarks-comment">
                                            {item.surface_data.length > 0 && item.surface_data.map(sub_item=> {
                                              return (
                                                <div key={sub_item}>
                                                  <label>{sub_item.body_part != "" ? sub_item.body_part + "：" : ""}</label>
                                                  <label style={{width: "2.7rem"}}>{sub_item.x_value}cm</label>
                                                  <label className="ml-1 mr-1">×</label>
                                                  <label style={{width: "2.7rem"}}>{sub_item.y_value}cm</label>
                                                  <label className="ml-1 mr-1">=</label>
                                                  <label style={{width: "3rem"}}>{sub_item.total_x_y}㎠</label>
                                                </div>
                                              )
                                            })}
                                            {item.surface_data.length > 1 && (
                                              <div>合計：{item.total_surface}㎠</div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {(item.treat_detail_item !== undefined && item.treat_detail_item.length > 0) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">個別指示</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {item.treat_detail_item.map(detail=>{
                                              let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                JSON.parse(detail['oxygen_data']) : null;
                                              return(
                                                <>
                                                  <div>
                                                    <label>・{detail.item_name}：</label>
                                                    <label>{detail.count}</label>
                                                    {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                      <>
                                                        <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                      </>
                                                    )}
                                                    <br />
                                                    {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                      let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                      if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                      return (
                                                        <div key={oxygen_item}>
                                                          <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                          {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                            <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                          )}
                                                          {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                            <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                          )}
                                                        </div>
                                                      )
                                                    })}
                                                    {detail.lot !== undefined && detail.lot != null && detail.lot !== '' && (
                                                      <>
                                                        <label>ロット:{detail.lot}</label><br />
                                                      </>
                                                    )}
                                                    {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                      <>
                                                        <label>フリーコメント:{detail.comment}</label><br />
                                                      </>
                                                    )}
                                                  </div>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {item.done_numbers !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施情報(記録)</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {item.done_numbers !== undefined && Object.keys(item.done_numbers).length > 0 && Object.keys(item.done_numbers).map(done_index=>{
                                              let done_item = item.done_numbers[done_index];
                                              return (
                                                <>
                                                  <div>{formatJapanDateSlash(done_index)}</div>
                                                  {done_item.map(sub_item=>{
                                                    if (sub_item.completed_at !== undefined && sub_item.completed_at != "")
                                                      return (
                                                        <div key={sub_item}>
                                                          ・{sub_item.completed_at !== undefined && sub_item.completed_at !== "" ? sub_item.completed_at.substr(11, 5) : ""}&nbsp;
                                                          {sub_item.done_info !== undefined && sub_item.done_info.request_name !== undefined ? sub_item.done_info.request_name: ""}&nbsp;
                                                          {sub_item.done_info !== undefined && sub_item.done_info.part_name !== undefined ? sub_item.done_info.part_name: ""}&nbsp;
                                                          {sub_item.done_info !== undefined && sub_item.done_info.position_name !== undefined ? sub_item.done_info.position_name: ""}&nbsp;
                                                          {sub_item.done_info !== undefined && sub_item.done_info.side_name !== undefined ? sub_item.done_info.side_name: ""}&nbsp;
                                                          {sub_item.done_info !== undefined && sub_item.done_info.surface_data != undefined && sub_item.done_info.surface_data.length > 0 && (
                                                            <div className="treat-surface ml-3">
                                                              {sub_item.done_info.surface_data.length > 0 && sub_item.done_info.surface_data.map(surface_item=> {
                                                                return (
                                                                  <div key={surface_item}>
                                                                    <label>{surface_item.body_part != "" ? surface_item.body_part + "：" : ""}</label>
                                                                    <label style={{width: "2.5rem", fontFamily:"MS Gothic,monospace"}}>{surface_item.x_value}cm</label>
                                                                    <label className="ml-1 mr-1">×</label>
                                                                    <label style={{width: "2.5rem", fontFamily:"MS Gothic,monospace"}}>{surface_item.y_value}cm</label>
                                                                    <label className="ml-1 mr-1">=</label>
                                                                    <label style={{width: "3rem", fontFamily:"MS Gothic,monospace"}}>{surface_item.total_x_y}㎠</label>
                                                                  </div>
                                                                )
                                                              })}
                                                              {sub_item.done_info.surface_data.length > 1 && (
                                                                <div>合計：{sub_item.done_info.total_surface}㎠</div>
                                                              )}
                                                            </div>
                                                          )}
                                                          {sub_item.done_info !== undefined && sub_item.done_info.treat_done_info !== undefined && sub_item.done_info.treat_done_info.length > 0 && (
                                                            <div className={"treat-done-info ml-3"}>
                                                              {sub_item.done_info.treat_done_info.map(detail=>{
                                                                let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                                  JSON.parse(detail['oxygen_data']) : null;
                                                                return(
                                                                  <>
                                                                    <div>
                                                                      <label>・{detail.item_name}：</label>
                                                                      <label>{detail.count}</label>
                                                                      {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                                        <>
                                                                          <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                                        </>
                                                                      )}
                                                                      <br />
                                                                      {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                                        let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                                        if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                                        return (
                                                                          <div key={oxygen_item}>
                                                                            <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                                            {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                                              <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                                            )}
                                                                            {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                                              <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                                            )}
                                                                          </div>
                                                                        )
                                                                      })}
                                                                      {detail.lot !== undefined && detail.lot != null && detail.lot !== '' && (
                                                                        <>
                                                                          <label>ロット:{detail.lot}</label><br />
                                                                        </>
                                                                      )}
                                                                      {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                                        <>
                                                                          <label>フリーコメント:{detail.comment}</label><br />
                                                                        </>
                                                                      )}
                                                                    </div>
                                                                  </>
                                                                )
                                                              })}
                                                            </div>
                                                          )}
                                                          {sub_item.done_info !== undefined && sub_item.done_info.done_comment !== undefined && sub_item.done_info.done_comment !== "" && (
                                                            <span className="ml-3">{sub_item.done_info.done_comment}</span>
                                                          )}
                                                          <span className="ml-3">{sub_item.completed_by !== undefined && sub_item.completed_by != "" && getStaffName(sub_item.completed_by) !== "" ? getStaffName(sub_item.completed_by):""}</span>
                                                        </div>
                                                      )
                                                  })}
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {(this.use_done_info === 0 && item.treat_done_info !== undefined && item.treat_done_info.length > 0) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {item.treat_done_info.map(detail=>{
                                              let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                JSON.parse(detail['oxygen_data']) : null;
                                              return(
                                                <>
                                                  <div>
                                                    <label>・{detail.item_name}：</label>
                                                    <label>{detail.count}</label>
                                                    {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                      <>
                                                        <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                      </>
                                                    )}
                                                    <br />
                                                    {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                      let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                      if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                      return (
                                                        <div key={oxygen_item}>
                                                          <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                          {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                            <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                          )}
                                                          {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                            <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                          )}
                                                        </div>
                                                      )
                                                    })}
                                                    {detail.lot !== undefined && detail.lot != null && detail.lot !== '' && (
                                                      <>
                                                        <label>ロット:{detail.lot}</label><br />
                                                      </>
                                                    )}
                                                    {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                      <>
                                                        <label>フリーコメント:{detail.comment}</label><br />
                                                      </>
                                                    )}
                                                  </div>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {item.comment !== undefined && item.comment !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{displayLineBreak(item.comment)}</div>
                                        </div>
                                      </div>
                                    )}
                                    {item.done_comment !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{displayLineBreak(item.done_comment)}</div>
                                        </div>
                                      </div>
                                    )}
                                    {item.administrate_period != undefined && item.administrate_period != null && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">処置期間</div>
                                        </div>
                                        <div className="text-right treatment-period">
                                          <div>
                                            {item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}
                                          </div>
                                          <div>
                                            1日{item.administrate_period.done_count}回 : {this.getDoneTimes(item.administrate_period.done_times)}
                                          </div>
                                          <div>
                                            投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                          </div>
                                          {item.administrate_period.period_type == 0 && item.administrate_period.period_category != null && (
                                            <div>
                                              間隔 : {item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月"}
                                            </div>
                                          )}
                                          {item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0 && (
                                            <div>
                                              曜日 : {getWeekNamesBySymbol(item.administrate_period.period_week_days)}
                                            </div>
                                          )}
                                          {item.administrate_period.start_count != undefined && item.administrate_period.done_days != undefined && ( item.administrate_period.start_count != 1 || item.administrate_period.end_count != item.administrate_period.done_count) && (
                                            <>
                                              <div>
                                                初回 {formatJapanDateSlash(item.administrate_period.done_days[0])}の{item.administrate_period.start_count}回目から
                                              </div>
                                              <div>
                                                最終 {formatJapanDateSlash(item.administrate_period.done_days[item.administrate_period.done_days.length - 1])}の{item.administrate_period.end_count}回目まで
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
  
                                    {this.props.show_type != "read" && (
                                      <>                                      
                                        {item.administrate_period.increase_period_end_date != undefined && item.administrate_period.increase_period_end_date != null && (
                                          <>
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">終了日</div>
                                              </div>
                                              <div className="text-right">
                                                  <DatePickerBox>
                                                    <DatePicker
                                                      locale="ja"
                                                      selected={new Date(item.administrate_period.increase_period_end_date)}
                                                      onChange={(e)=>this.handleIncreaseDateChange(e, detail_index)}
                                                      dateFormat="yyyy/MM/dd"
                                                      placeholderText="年/月/日"
                                                      showMonthDropdown
                                                      showYearDropdown
                                                      dropdownMode="select"
                                                      dayClassName = {date => setDateColorClassName(date)}
                                                      minDate={new Date(item.administrate_period.period_end_date)}
                                                    />
                                                  </DatePickerBox>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )
                              })}
                              {order_data.item_details !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item"> </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {order_data.item_details.map(detail=>{
                                        return(
                                          <>
                                            <div><label>{detail.item_name}
                                              {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                              {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}{detail.unit_name1 != undefined ? detail.unit_name1 : ""}</label><br /></>
                                              )}
                                              {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}{detail.unit_name2 != undefined ? detail.unit_name2 : ""}</label><br /></>
                                              )}
                                            </div>
                                          </>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                </Bar>
              </Col>
            </Wrapper>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div
            onClick={this.maincloseModal}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>キャンセル</span>
          </div>
          {this.props.show_type != "read" && (
            <>
              {this.validatePeriodChanged() ? (
                <>
                  {this.validateRealPeriod() ? (
                    <div id="system_confirm_Ok" className={"custom-modal-btn red-btn"} onClick={this.increasePeriod} style={{cursor:"pointer"}}>
                      <span>確定</span>
                    </div>
                  ):(
                    <OverlayTrigger placement={"top"} overlay={renderTooltip("追加される日がありません。")}>
                      <div className={"custom-modal-btn disable-btn"}><span>確定</span></div>
                    </OverlayTrigger>
                  )}
                </>
              ):(
                <>
                  <div id="system_confirm_Ok" className={"custom-modal-btn disable-btn"}>
                    <span>確定</span>
                  </div>
                </>
              )}
            </>
          )}
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title={this.state.confirm_alert_title}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}g
          />
        )}
      </Modal>
    );
  }
}

TreatmentIncreasePeriodModal.contextType = Context;
TreatmentIncreasePeriodModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  done_date: PropTypes.string,
  end_date: PropTypes.string,
  patientId: PropTypes.number,
  patientInfo: PropTypes.Object,
  handleOk:PropTypes.func,
  modal_type:PropTypes.string,
  show_type:PropTypes.string
};

export default TreatmentIncreasePeriodModal;