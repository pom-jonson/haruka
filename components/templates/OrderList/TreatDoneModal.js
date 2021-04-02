import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {WEEKDAYS, CACHE_LOCALNAMES, checkSMPByUnicode, getStaffName, getVisitPlaceNameForModal} from "~/helpers/constants";
import axios from "axios";
import {surface,secondary200,disable} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import { formatJapanDateSlash, formatTimeIE, formatDateSlash, formatDateTimeStr } from "~/helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import $ from "jquery";
import Checkbox from "~/components/molecules/Checkbox";
import BigCheckbox from "~/components/molecules/BigCheckbox";
import SelectorWithLabel from "~/components/molecules/RemComponents/SelectorWithLabel";
import InputWithLabel from "~/components/molecules/RemComponents/InputWithLabel";
import Button from "~/components/atoms/Button";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
import OxygenCalculateModal from "~/components/templates/Patient/Modals/OutPatient/OxygenCalculateModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import {displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import DatePicker from "react-datepicker";
import Spinner from "react-bootstrap/Spinner";
import CountSurfaceModal from "../Patient/Modals/OutPatient/CountSurfaceModal";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import {getWeekNamesBySymbol} from "../../../helpers/date";
const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;
const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  display: flex;
  text-align: center;
  .content{
    height: 60vh;
    overflow-y: hidden;
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
   height: 200px;
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
  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 70%;
      float: left;
      padding: 5px;
    }
    .function-region-value{
      width: 30%;
      float: left;
      padding: 5px;
      border-left: 1px solid #ddd;
    }
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
    overflow: hidden;
    margin-top: 0.5rem;
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
  height:calc( 61vh - 11.5rem);
  .history-item {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 1px;
  }
  .big-checkbox-area{
    width: 100%;    
    position: absolute;
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 8rem;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .phy-box{
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 8rem;
    }
    .text-left{
      .table-item{
        width: 6rem;
        float: left;
        text-align: right;
      }
    }
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
  .unit {
    margin-left: auto;
    text-align: right;
    width: 80px;
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
    padding: 4px;
    .open-close-button {
      width: 6rem;
    }
  }
  .number {
    margin-right: 8px;
    width: 80px;
  }
  .number .rp{
    text-decoration-line: underline;
  }
  .unit{
    text-align: right;
  }
  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .options {
    float: right;
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
  .set-area {
    button {
      margin-right:0.5rem;
    }
    .select-set {
      button{ width:7rem;}
      width: calc(100% - 28.7rem);
      .label-title {
        width:3rem;
        line-height:2rem;
        font-size:0.75rem;
        margin-right:0.5rem !important;
        text-align: right;
      }
      .pullbox-label {
        margin: 0;
        width: 100%;
      }
      .pullbox-select {
        width:100%;
        height:2rem;
        font-size:0.75rem;
      }
    }
  }
  .set-detail-area {
    width: 100%;
    table {
      tr{
        width: 100%;
      }
      .react-numeric-input {
        b {
          right: 0.25rem;
        }
        input {
          padding-right: 20px !important;
          text-align: right;
        }
      }
      th{padding:0.3rem;}
      .check-td {
        width: 5rem;
      }
      .type-td {
        width: 10rem;
      }
      .button-td {
        width: 3rem;
      }
      .amount-td {
        width: 4rem;
      }
      .unit-td {
        width: 4rem;
      }
      .lot-td {
        width: 5rem;
      }
      .comment-td {
        width: 7rem;
      }
      td{
        div{
          border:none;
        }
        .form-control{
          height: 2rem;
          margin-top:0px;
          padding:0;
          .react-numeric-input {
            width: 100%;
          }
        }
      }
    }
    .td-no {
      background-color: #a0ebff;
    }
    td {
      vertical-align: middle;
      padding:0;
    }
    .td-check {
      label {
        padding-left: 0;
        margin-right: 0;
      }
    }
    .pullbox-label {
      width: 100%;
      margin: 0;
    }
    .label-title {
      width: 0;
      margin: 0;
    }
    .label-unit {
      width: 0;
      margin: 0;
    }
    .select-class {
      select{width:100%;}
    }
    .select-unit {
      select{width:100%;}
    }
    .input-lot {
      input {
        ime-mode: inactive;
      }
    }
    button {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 2rem;
    }
    
    .input-with-label, .detail-comment, .detail-lot, input-num {
      margin-top:0;
      input{
        width: 100%;
      }
    }
    .detail-comment input{width: 7rem;}
    .detail-lot input{width: 5rem;}
    .input-num {
      margin-top: 0;
      width: 4rem;
      input {
        ime-mode: inactive;
      }
    }
    .div-button{
      border: 2px solid rgb(126, 126, 126) !important;
      margin: 0px;
      padding: 0px;
      width: 100%;
      height: 2.375rem;
      line-height: 2.375rem;
      background: rgb(239, 239, 239);
      cursor: pointer;
      text-align: center;
    }
  }
  .done-comment {
    textarea {
      width:100%;
      min-height:3rem;
    }
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0;
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
      padding: 0.25rem 12px;
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

const ContextItemMenu = ({visible, x, y, detail_idx, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {/*{parent.state.oxygen_menu_idx >= 0 && (*/}
          {/*  <li><div onClick={() => parent.contextMenuAction('oxygen_delete', detail_idx)}>酸素量計算削除</div></li>*/}
          {/*)}*/}
          <li><div onClick={() => parent.contextMenuAction('item_add', detail_idx)}>追加</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class TreatDoneModal extends Component {
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
    this.treat_freecoment_length = init_status.conf_data.treat_freecoment_length !== undefined ? init_status.conf_data.treat_freecoment_length : 25;
    this.treat_lot_length = init_status.conf_data.treat_lot_length !== undefined ? init_status.conf_data.treat_lot_length : 25;
    this.use_done_info = init_status.conf_data.treat_done_info_view !== undefined ? init_status.conf_data.treat_done_info_view : 0;
    this.treat_oxygen_list = sessApi.getObjectValue("init_status", "treat_oxygen_list");
    this.treat_order_part_position_mode = sessApi.getObjectValue("init_status", "conf_data").treat_order_part_position_mode;
    this.init_set_detail = [
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
    ];
    this.init_detail_unit = [
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },]
    ];
    let modal_data = JSON.parse(JSON.stringify(props.modal_data));
    let order_data = undefined;
    if(props.from_page !== undefined && props.from_page === "soap"){
      let tmp_modal_data = modal_data;
      modal_data = modal_data.data;
      modal_data['treatment_datetime'] = tmp_modal_data.treatment_datetime;
      modal_data['treatment_date'] = tmp_modal_data.treatment_date;
      modal_data['target_table'] = tmp_modal_data.target_table;
      modal_data['doctor_name'] = tmp_modal_data.doctor_name;
      modal_data['input_staff_name'] = tmp_modal_data.input_staff_name;
      let patient_info = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      modal_data['patient_number'] = patient_info.receId;
      modal_data['patient_name'] = patient_info.name;
    }
    if(modal_data.order_data !== undefined){
      order_data = modal_data.order_data.order_data!=undefined?modal_data.order_data.order_data:modal_data.order_data;
      if(order_data.header.state != 1){
        order_data.detail.map(item=>{
          item.done_comment = "";
          if(this.use_done_info === 1){
            item.done_info = JSON.parse(JSON.stringify(this.init_set_detail));
            item.done_info_detail_unit = JSON.parse(JSON.stringify(this.init_detail_unit));
          }
        });
      } else {
        this.use_done_info = 0;
      }
    }
    if (this.props.from_page === 'order-modal') {
      order_data = props.modal_data;
      let patient_info = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      modal_data['patient_number'] = patient_info.receId;
      modal_data['patient_name'] = patient_info.name;
    }
    let done_time_show = false;
    if (order_data.header.isPeriodTreatment == 1 && order_data.detail[0].done_numbers !== undefined && props.modal_data.detail_index != undefined ) {
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
      isItemSelectModal: false,
      isOpenOxygenModal: false,
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
      isCountSurfaceModalOpen: false,
      end_date: props.end_date !== undefined && props.end_date != null ? new Date(props.end_date) : undefined,
      done_date: props.done_date !== undefined && props.done_date != null ? new Date(props.done_date) : undefined,
      practice_master: [],
      selected_array: {}
    };
    let done_disable = false;
    if (this.props.modal_data !== undefined && this.props.modal_data.state !== undefined && this.props.modal_data.state === 1){
      done_disable = true;
    }
    this.done_disable = done_disable;
    this.change_flag = 0;
    this.treat_position = [];
    this.can_done = true;
  }
  
  async componentDidMount() {
    this.can_done = this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.DONE_OREDER);
    await this.getDoctorsList();
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
          if (order_data.detail[detail_idx]['done_info'] !== undefined && order_data.detail[detail_idx]['done_info'].findIndex(x=>x.item_name != "") > -1) is_exist = true;
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
      isItemSelectModal: false,
      isOpenOxygenModal: false,
      isCountSurfaceModalOpen: false,
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
      if(this.props.from_page === "soap" && this.props.doneInspection !== undefined){
        let convert_order_data = post_data.order_data.detail.map((item, detail_idx)=>{
          if (this.state.implement_check_list.includes(detail_idx)) {
            if (item.completed_at == undefined || item.completed_at == null || item.completed_at == "") {
              item.completed_at = formatDateTimeStr(new Date());
            }
          }
          return item;
        });
        post_data.order_data.detail = convert_order_data;
        this.props.doneInspection(this.props.modal_data.number, "treatment_done", post_data.order_data);
      }
      if (this.props.done_date !== undefined || this.props.end_date !== undefined || this.props.from_page === "progress_chart") {
        this.props.closeModal('treatment_change');
      }
      this.props.closeModal('change');
      if (this.props.handleNotDoneOk !== undefined && this.props.handleNotDoneOk != null){
        this.props.handleNotDoneOk();
      }
    }
  }
  
  confirmOk =async()=> {
    this.confirmCancel();
    if (this.state.confirm_action === "close") {
      this.props.closeModal();
      return;
    }
    if (this.state.confirm_action == "oxygen_delete") {
      let {order_data} = this.state;
      if (this.state.oxygen_menu_idx >= 0) {
        delete order_data.detail[this.state.oxygen_del_idx]['done_info'][this.state.oxygen_menu_idx].oxygen_data;
        this.setState({order_data, oxygen_menu_idx: -1});
        this.change_flag = 1;
      }
      return;
    }
    let path = "/app/api/v2/order/orderComplete";
    let number = this.state.order_data.header.number;
    let post_data = {
      type:'treatment',
      number,
      order_data:null,
    };
    let order_data = JSON.parse(JSON.stringify(this.state.order_data));
    Object.keys(order_data.detail).map((detail_idx)=>{
      let check = true;
      if (this.props.from_page == "soap" || this.props.from_page == "progress_chart") {
        // YJ1028
        check = this.state.implement_check_list.includes(detail_idx);
      }
      if (check) {        
        if(order_data.detail[detail_idx]['done_comment'] === ""){
          delete order_data.detail[detail_idx]['done_comment'];
        }
        if(this.use_done_info === 1){
          delete order_data.detail[detail_idx]['done_info'];
          delete order_data.detail[detail_idx]['done_info_detail_unit'];
          delete order_data.detail[detail_idx]['set_master'];
        }
        if (this.state.request_options[order_data.detail[detail_idx].practice_id] !== undefined &&
          (this.state.request_data[detail_idx]!== undefined && this.state.request_data[detail_idx] != "") ) {
          order_data.detail[detail_idx].request_id = this.state.request_data[detail_idx];
          order_data.detail[detail_idx].request_name = this.state.request_master.find(x=>x.request_id == this.state.request_data[detail_idx]).name;
        }
        if (this.state.position_options[order_data.detail[detail_idx].practice_id] !== undefined &&
          (this.state.position_data[detail_idx]!== undefined && this.state.position_data[detail_idx] != "") ) {
          order_data.detail[detail_idx].position_id = this.state.position_data[detail_idx];
          order_data.detail[detail_idx].position_name = this.state.position_master.find(x=>x.position_id == this.state.position_data[detail_idx]).name;
        }
        if (this.state.part_options[order_data.detail[detail_idx].practice_id] !== undefined &&
          (this.state.part_data[detail_idx]!== undefined && this.state.part_data[detail_idx] != "") ) {
          order_data.detail[detail_idx].part_id = this.state.part_data[detail_idx];
          order_data.detail[detail_idx].part_name = this.state.part_master.find(x=>x.part_id == this.state.part_data[detail_idx]).name;
        }
        if (this.state.side_options[order_data.detail[detail_idx].practice_id] !== undefined &&
          (this.state.side_data[detail_idx]!== undefined && this.state.side_data[detail_idx] != "") ) {
          order_data.detail[detail_idx].side_id = this.state.side_data[detail_idx];
          order_data.detail[detail_idx].side_name = this.state.side_master.find(x=>x.side_id == this.state.side_data[detail_idx]).name;
        }
      }
    });
    post_data.order_data = order_data;
    
    if (this.state.order_data.header.isPeriodTreatment == 1 && !this.state.order_data.header.timely_done ) {
      let cnt_index = this.props.modal_data.cnt_index;
      let detail_index = this.props.modal_data.detail_index;
      let date = this.props.modal_data.date;
      let execute_info = this.state.order_data.detail[0].done_numbers[date][cnt_index];
      post_data.cnt_index = cnt_index;
      post_data.detail_index = detail_index;
      post_data.date = date;
      if (execute_info !== undefined && execute_info.time != undefined && execute_info.time == "") {
        post_data.schedule_time = this.state.confirm_done_time;
      }
    }
    if (this.state.order_data.header.timely_done && this.props.done_date !== undefined) {
      post_data.done_date = this.state.done_date;
    }
    if (this.state.order_data.header.timely_done && this.props.end_date !== undefined) {
      post_data.end_date = this.state.end_date;
    }
    if (this.props.modal_data.detail_index !== undefined) post_data.detail_index = [this.props.modal_data.detail_index];
    // YJ1028
    if (this.state.implement_check_list.length > 0) post_data.detail_index = this.state.implement_check_list;
    if (this.props.from_page == "order-modal") {
      this.props.doneInspection(order_data);
      return;
    }
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          this.setState({
            alert_messages: res.alert_message,
            alert_action: "close",
            alert_data: post_data
          });
        }
      })
      .catch(() => {
      });
    
  };
  
  openConfirm =() => {
    if (this.done_disable) return;
    if (!this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.DONE_OREDER)){//処置実施権限
      return;
    }
    if (this.state.done_time_show && this.state.confirm_done_time == "") {
      this.setState({alert_messages: "実施時間を設定を選択してください。"});
      return;
    }
    let order_data = this.state.order_data;
    if(this.use_done_info === 1){
      let error_str = '';
      order_data.detail.map((detail, detail_idx)=>{
        let check = true;
        if (this.props.from_page === "soap" || this.props.from_page === "progress_chart") {
          // YJ1028
          check = this.state.implement_check_list.includes(detail_idx);
        }
        if (check) {          
          if(detail.done_info !== undefined){
            let done_info = [];
            detail.done_info.map(item=>{
              if(item.check === 1 && item.item_id !== 0){
                if(item.lot != null && item.lot !== ""){
                  if(!item.lot.match(/^[A-Za-z0-9]*$/)){
                    error_str = detail.practice_name+ ":" + '実施情報項目のロットを半角英数で入力してください。';
                    return;
                  }
                }
                if(item.count == null || item.count === ""){
                  error_str = detail.practice_name+ ":" + '実施情報項目の数量を0より大きい値で入力してください。';
                  return;
                }
                if(item.count < 0){
                  error_str = detail.practice_name+ ":" + '実施情報項目の数量を正確に入力してください。';
                  return;
                }
                if(checkSMPByUnicode(item.lot)){
                  error_str = detail.practice_name+ ":" + '実施情報項目のロットに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。';
                  return;
                }
                if(checkSMPByUnicode(item.comment)){
                  error_str = detail.practice_name+ ":" + '実施情報項目のコメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください';
                  return;
                }
                let done_info_item = JSON.parse(JSON.stringify(item));
                done_info_item.set_name = detail.set_name !== undefined ? detail.set_name : "";
                done_info.push(done_info_item);
              }
            });
            order_data.detail[detail_idx]['treat_done_info'] = done_info;
          }
        }
      });
      if(error_str !== ''){
        this.setState({alert_messages: error_str});
        return;
      }
    }
    this.setState({
      order_data,
      confirm_message: "実施しますか？",
    });
  };
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };
  
  closeDoctor = () => {
    this.context.$selectDoctor(false);
  }
  
  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.context.$selectDoctor(false);
    if (this.doctor_modal_flag == 0) return;
    this.setState({
      isVisitTreatmentPatientModal: true
    });
    this.doctor_modal_flag = 0;
  };
  
  getDoctorsList = async () => {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    this.setState({ doctors: data });
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
  
  handleClick = (e, detail_idx) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextItemMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextItemMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("done-info-"+detail_idx)
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextItemMenu: { visible: false }
          });
          document
            .getElementById("done-info-"+detail_idx)
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      let x_val = e.clientX - $('#done-order-modal').offset().left;
      let y_val = e.clientY + window.pageYOffset - 120;
      this.setState({
        contextItemMenu: {
          visible: true,
          x: x_val,
          y: y_val,
          detail_idx,
        },
      });
    }
  };
  
  handleOxygenClick = (e, del_index) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextItemMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextItemMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let x_val = e.clientX - $('#done-order-modal').offset().left;
      let y_val = e.clientY + window.pageYOffset - 120;
      this.setState({
        contextItemMenu: {
          visible: true,
          x: x_val,
          y: y_val
        },
        oxygen_menu_idx: del_index
      });
    }
  };
  
  contextMenuAction = (type, detail_idx) => {
    if (type === 'item_add') {
      let order_data = this.state.order_data;
      order_data.detail[detail_idx]['done_info'].push({number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: ''});
      // order_data.detail[detail_idx]['done_info_detail_unit'].push(JSON.parse(JSON.stringify(this.init_detail_unit)));
      this.setState({order_data});
    } else if (type === "oxygen_delete") {
      this.setState({
        confirm_message: "酸素量の時間・流量・濃度を破棄して通常の数量に変更しますか？",
        confirm_alert_title: "計算破棄確認",
        confirm_action: "oxygen_delete",
        oxygen_del_idx: detail_idx,
      })
    }
  }
  
  setCheckState = (name, value) => {
    let key = name.split(':');
    let order_data = this.state.order_data;
    if(order_data.detail[key[1]]['done_info'][key[2]]['item_id'] === 0){
      this.setState({alert_messages: "品名を選択してください。"});
      return;
    }
    order_data.detail[key[1]]['done_info'][key[2]][key[0]] = value;
    this.change_flag = 1;
    this.setState({order_data});
  }
  
  setSelectValue = (key, e) => {
    let name = key.split(':');
    let order_data = this.state.order_data;
    order_data.detail[name[1]]['done_info'][name[2]][name[0]] = parseInt(e.target.id);
    this.change_flag = 1;
    this.setState({order_data});
  };
  
  openItemSelectModal=(value)=> {
    let key = value.split(':');
    let cur_item_category_id = this.state.order_data.detail[key[0]]['done_info'][key[1]]['classfic'];
    this.setState({
      isItemSelectModal: true,
      cur_done_info: value,
      cur_item_category_id
    })
  };
  
  setItemName = (data) => {
    let order_data = this.state.order_data;
    let item_categories = this.state.item_categories;
    let key = this.state.cur_done_info.split(':');
    let oxygen_list_exist = false;
    order_data.detail[key[0]]['done_info'].map((item, index)=> {
      if (this.treat_oxygen_list !== undefined && this.treat_oxygen_list.indexOf(item.item_id) > -1 && index != key[1]) oxygen_list_exist = true;
    });
    if (this.treat_oxygen_list !== undefined && this.treat_oxygen_list.indexOf(data.item_id) > -1 && oxygen_list_exist) {
      this.setState({
        alert_messages: "酸素リストの項目が既に1件登録されているため追加できません。"
      });
      var base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
      if (base_modal !== undefined) base_modal.style['z-index'] = 1040;
      return;
    }
    order_data.detail[key[0]]['done_info'][key[1]]['check'] = 1;
    order_data.detail[key[0]]['done_info'][key[1]]['classfic'] = data.treat_item_category_id;
    order_data.detail[key[0]]['done_info'][key[1]]['classfic_name'] = (item_categories.find(x => x.id === data.treat_item_category_id) !== undefined)
      ? item_categories.find(x => x.id === data.treat_item_category_id).value : '';
    order_data.detail[key[0]]['done_info'][key[1]]['item_id'] = data.item_id;
    order_data.detail[key[0]]['done_info'][key[1]]['unit_id'] = 0;
    order_data.detail[key[0]]['done_info'][key[1]]['item_name'] = data.name;
    order_data.detail[key[0]]['done_info'][key[1]]['main_unit'] = data.main_unit;
    order_data.detail[key[0]]['done_info'][key[1]]['receipt_key'] = data.receipt_key;
    if(this.state.treat_item_unit.length >0){
      this.state.treat_item_unit.map(item=>{
        if(item.item_id === data.item_id){
          order_data.detail[key[0]]['done_info_detail_unit'][key[1]].push({id:item.unit_id, value: item.name});
        }
      });
    }
    this.change_flag = 1;
    this.setState({
      order_data,
      isItemSelectModal:false,
    });
  };
  
  getCount =(name, e)=>{
    let value = e.target.value;
    let key = name.split(':');
    let order_data = this.state.order_data;
    if(order_data.detail[key[0]]['done_info'][key[1]]['item_id'] === 0){
      this.setState({alert_messages: "品名を選択してください。"});
      return;
    }
    let RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (value != "" && !RegExp.test(value)) {
      return;
    }
    if (!this.numberValidate(value)) return;
    order_data.detail[key[0]]['done_info'][key[1]]['count'] = value;
    this.change_flag = 1;
    this.setState({order_data});
  }
  numberValidate = (value) => {
    if (value == "") return true;
    value = value.toString();
    if (value.length > 10) return false;
    let split_val = value.split(".");
    if (split_val[0].length > 8) return false;
    if (split_val.length > 1) {
      if (split_val[1].length > 4) return false;
    }
    return true;
  }
  
  getUnitId =(name, e)=>{
    let key = name.split(':');
    let order_data = this.state.order_data;
    order_data.detail[key[0]]['done_info'][key[1]]['unit_id'] = parseInt(e.target.id);
    order_data.detail[key[0]]['done_info'][key[1]]['unit_name'] = e.target.value;
    this.setState({order_data});
  }
  
  setRequest =(detail_idx, request_id)=>{
    let {request_data} = this.state;
    request_data[detail_idx] = request_id;
    this.change_flag = 1;
    let {selected_array} = this.state;
    if (selected_array[detail_idx] === undefined) selected_array[detail_idx] = {};
    selected_array[detail_idx].selected_request_id = request_id;
    this.setState({request_data, selected_request_id: request_id, selected_detail_index: detail_idx});
  }
  selectPosition =(detail_idx, position_id)=>{
    let {position_data} = this.state;
    position_data[detail_idx] = position_id;
    this.change_flag = 1;
    let {selected_array} = this.state;
    if (selected_array[detail_idx] === undefined) selected_array[detail_idx] = {};
    selected_array[detail_idx].selected_position_id = position_id;
    this.setState({position_data, selected_position_id: position_id, selected_detail_index: detail_idx});
  }
  selectPart =(detail_idx, part_id, practice_id)=>{
    let {part_data} = this.state;
    let treat_position = JSON.parse(JSON.stringify(this.treat_position));
    let filtered_position = [];
    let position_master = treat_position.filter(item => {
      if (item.part_id === part_id) return item;
    });
    position_master.map(sub_item=>{
      filtered_position.push({id: sub_item.position_id, value: sub_item.name, part_id: sub_item.part_id});
    });
    let position_options = {};
    if (filtered_position.length > 0) {
      position_options[practice_id] = filtered_position;
    }
    part_data[detail_idx] = part_id;
    this.change_flag = 1;
    let {selected_array} = this.state;
    if (selected_array[detail_idx] === undefined) selected_array[detail_idx] = {};
    selected_array[detail_idx].selected_part_id = part_id;
    this.setState({part_data, selected_part_id: part_id, selected_detail_index: detail_idx, position_options});
  }
  selectSide =(detail_idx, side_id)=>{
    let {side_data} = this.state;
    side_data[detail_idx] = side_id;
    this.change_flag = 1;
    let {selected_array} = this.state;
    if (selected_array[detail_idx] === undefined) selected_array[detail_idx] = {};
    selected_array[detail_idx].selected_side_id = side_id;
    this.setState({side_data, selected_side_id: side_id, selected_detail_index: detail_idx});
  }
  
  getLot =(name, e)=>{
    let key = name.split(':');
    let order_data = this.state.order_data;
    if(order_data.detail[key[0]]['done_info'][key[1]]['item_id'] === 0){
      this.setState({alert_messages: "品名を選択してください。"});
      return;
    }
    order_data.detail[key[0]]['done_info'][key[1]]['lot'] = e.target.value;
    this.change_flag = 1;
    this.setState({order_data});
  }
  
  getFreeComment =(name, e)=>{
    let key = name.split(':');
    let order_data = this.state.order_data;
    if(order_data.detail[key[0]]['done_info'][key[1]]['item_id'] === 0){
      this.setState({alert_messages: "品名を選択してください。"});
      return;
    }
    order_data.detail[key[0]]['done_info'][key[1]]['comment'] = e.target.value;
    this.change_flag = 1;
    this.setState({order_data});
  }
  
  getBlurFreeComment =(name, e)=>{
    if (e.target.value == null || e.target.value == '') return;
    let order_data = this.state.order_data;
    if(e.target.value.length > this.treat_freecoment_length){
      this.setState({
        focus_target: e.target,
        order_data,
        alert_messages: 'フリーコメントは'+this.treat_freecoment_length+'文字以内で入力してください。',
      });
    }
  }
  
  getBlurLot =(name, e)=>{
    if (e.target.value == null || e.target.value == '') return;
    let order_data = this.state.order_data;
    this.change_flag = 1;
    if(e.target.value.length > this.treat_lot_length){
      this.setState({
        focus_target: e.target,
        order_data,
        alert_messages: 'ロットは'+this.treat_freecoment_length+'文字以内で入力してください。',
      });
    }
  }

  openOxygenModal = (detail_idx) => {
    let order_data = this.state.order_data;
    let select_practice = this.state.practice_master.find(x=>x.practice_id == order_data.detail[detail_idx]['practice_id']);
    let practice_name = order_data.detail[detail_idx]['practice_name'];
    let set_detail = order_data.detail[detail_idx]['done_info'];
    let oxygen_data = [];
    set_detail.map(item=>{
      if (item.oxygen_data !== undefined) {
        let _oxygen_data = JSON.parse(item.oxygen_data);
        _oxygen_data.map(sub_item=>{
          oxygen_data.push(sub_item);
        })
      }
    });
    
    this.setState({
      isOpenOxygenModal: true,
      detail_index: detail_idx,
      oxygen_data,
      practice_name,
      select_practice
    });
  };
  
  oxygenOk = (key_data, total_amount) => {
    this.setState({isOpenOxygenModal:false,});
    let {detail_index, order_data} = this.state;
    
    let {item_categories} = this.state;
    let set_detail = order_data.detail[detail_index]['done_info'];
    if (key_data !== undefined && Object.keys(key_data).length > 0) {
      Object.keys(key_data).map(index => {
        let item = key_data[index];
        if (item[0].oxygen_amount > 0) {
          this.change_flag = 1;
          let oxygen_index = set_detail.findIndex(x => x.item_id == index);
          if (oxygen_index == -1)
            oxygen_index = set_detail.findIndex(x => x.item_id == "" && x.item_name == "" && x.count == "" && x.lot == "" && x.comment == "");
          let classfic_name = item_categories.find(x => x.id === item[0].category_id) !== undefined ? item_categories.find(x => x.id === item[0].category_id).value : '';
          if (oxygen_index !== undefined && oxygen_index > -1) {
            set_detail[oxygen_index]['check'] = 1;
            set_detail[oxygen_index]['item_id'] = parseInt(item[0].oxygen_source_code);
            set_detail[oxygen_index]['receipt_key'] = parseInt(item[0].oxygen_source_code);
            set_detail[oxygen_index]['item_name'] = item[0].oxygen_source_name;
            set_detail[oxygen_index]['main_unit'] = item[0].main_unit;
            set_detail[oxygen_index]['classfic'] = item[0].category_id;
            set_detail[oxygen_index]['oxygen_amount'] = item[0].oxygen_amount;
            set_detail[oxygen_index]['count'] = item[0].oxygen_amount;
            set_detail[oxygen_index]['classfic_name'] = classfic_name;
            set_detail[oxygen_index]['oxygen_data'] = JSON.stringify(item);
            if (set_detail[oxygen_index].is_setted == 0) delete set_detail[oxygen_index].is_setted;
          } else {
            let new_insert_item = {
              number: 0,
              check: 1,
              classfic: item[0].category_id,
              classfic_name,
              item_id: item[0].oxygen_source_code,
              item_name: item[0].oxygen_source_name,
              receipt_key: item[0].oxygen_source_code,
              count: item[0].oxygen_amount,
              unit_id: 0,
              unit_name: "",
              main_unit: item[0].main_unit,
              lot: "",
              comment: '',
              oxygen_amount: item[0].oxygen_amount,
              oxygen_data: JSON.stringify(item)
            }
            set_detail.push(new_insert_item);
          }
        }
      });
      order_data.detail[detail_index]['done_info'] = set_detail;
      order_data.detail[detail_index]['total_amount'] = total_amount;
      this.setState({order_data});
    }
  };
  
  selectAllSetDetail=(detail_idx)=>{
    let order_data = this.state.order_data;
    let select_count = 0;
    Object.keys(order_data.detail[detail_idx]['done_info']).map((index) => {
      if(order_data.detail[detail_idx]['done_info'][index]['item_id'] !== 0){
        order_data.detail[detail_idx]['done_info'][index]['check'] = 1;
        select_count ++;
      }
    });
    if(select_count){
      this.setState({order_data});
    } else {
      this.setState({alert_messages: "実施情報項目の品名を選択してください。"});
    }
  }
  
  unSelectAllSetDetail=(detail_idx)=>{
    let order_data = this.state.order_data;
    let select_count = 0;
    Object.keys(order_data.detail[detail_idx]['done_info']).map((index) => {
      order_data.detail[detail_idx]['done_info'][index]['check'] = 0;
      select_count++;
    });
    if(select_count > 0){
      this.setState({order_data});
    }
  }
  
  getSelectSet =(detail_idx, e)=>{
    let order_data = this.state.order_data;
    let treat_dtail = {};
    this.state.treat_set.map(item => {
      if (item.number === parseInt(e.target.id)){
        treat_dtail = item;
      }
    });
    order_data.detail[detail_idx]['set_data'] = treat_dtail['treat_dtail_item'];
    order_data.detail[detail_idx]['set_id'] = parseInt(e.target.id);
    order_data.detail[detail_idx]['set_name'] = e.target.value;
    this.setState({order_data});
  }
  
  putSetDetail=(detail_idx)=>{
    let order_data = this.state.order_data;
    let set_data = order_data.detail[detail_idx]['set_data'];
    if(set_data != null && Object.keys(set_data).length > 0){
      Object.keys(set_data).map((index)=>{
        order_data.detail[detail_idx]['done_info'][index]['number'] = set_data[index]['index'];
        order_data.detail[detail_idx]['done_info'][index]['check'] = 1;
        order_data.detail[detail_idx]['done_info'][index]['classfic'] = set_data[index]['item_category_id'];
        order_data.detail[detail_idx]['done_info'][index]['classfic_name'] = (this.state.item_categories.find(x => x.id === set_data[index]['item_category_id']) != undefined) ? this.state.item_categories.find(x => x.id === set_data[index]['item_category_id']).value : '';
        order_data.detail[detail_idx]['done_info'][index]['item_id'] = set_data[index]['item_id'];
        order_data.detail[detail_idx]['done_info'][index]['item_name'] = set_data[index]['name'];
        order_data.detail[detail_idx]['done_info'][index]['main_unit'] = set_data[index]['main_unit'];
        order_data.detail[detail_idx]['done_info'][index]['count'] = set_data[index]['count'];
        order_data.detail[detail_idx]['done_info'][index]['unit_id'] = set_data[index]['unit_id'];
        order_data.detail[detail_idx]['done_info'][index]['lot'] = set_data[index]['lot'];
        order_data.detail[detail_idx]['done_info'][index]['comment'] = set_data[index]['comment'];
        order_data.detail[detail_idx]['done_info'][index]['receipt_key'] = set_data[index]['receipt_key'];
      });
      order_data.detail[detail_idx].show_set_detail = 1;
    }
    let treat_item_unit = this.state.treat_item_unit;
    if(treat_item_unit !== undefined && treat_item_unit != null && treat_item_unit.length >0){
      Object.keys(order_data.detail[detail_idx]['done_info']).map((index) => {
        if (order_data.detail[detail_idx]['done_info'][index]['item_id'] !== 0) {
          treat_item_unit.map(item=>{
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
    this.setState({order_data});
  }
  
  setDoneComment = (detail_idx, e) => {
    let order_data = this.state.order_data;
    order_data.detail[detail_idx]['done_comment'] = e.target.value;
    this.change_flag = 1;
    this.setState({order_data});
  }
  getQuantity = (detail_idx, e) => {
    let value = e.target.value;
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(value)) {
      return;
    }
    if (!this.numberValidate(value)) return;
    let order_data = this.state.order_data;
    order_data.detail[detail_idx]['quantity'] = value;
    this.change_flag = 1;
    this.setState({order_data});
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
  
  countSurface = (index) => {
    let {order_data} = this.state;
    let surface_data = order_data.detail[index].surface_data;
    this.setState({
      surface_data,
      selected_detail_index: index,
      isCountSurfaceModalOpen: true
    });
  }
  surfaceOk = (total_surface, data) => {
    this.confirmCancel();
    this.change_flag = 1;
    let order_data = this.state.order_data;
    let practice_master = this.state.practice_master;
    let practice_id = order_data.detail[this.state.selected_detail_index].practice_id;
    let select_practice = practice_master.find(x=>x.practice_id == practice_id);
    if (select_practice.exception_name == "Area_To_Request_Id" && select_practice.exception_setting != null && select_practice.exception_setting != "") {
      let exception_setting = JSON.parse(select_practice.exception_setting);
      let request_master = this.state.request_master;
      let exception_request = [];
      if (request_master.length > 0) {
        request_master.map(item=> {
          let find_request = exception_setting.find(x=>x.treat_request_id == item.request_id);
          if (find_request !== undefined) {
            find_request.request_name = item.name;
            exception_request.push(find_request)
          }
        })
      }
      let selected_request_id = "";
      let selected_request_name = "";
      if (exception_request.length > 0) {
        let total_value = parseInt(total_surface);
        let temp_min = 0;
        exception_request.map(item=>{
          if (item.min <= total_value && item.min >= temp_min) {
            selected_request_id = item.treat_request_id;
            selected_request_name = item.request_name;
            temp_min = item.min;
          }
        });
      }
      if (selected_request_id != "") {
        if (this.state.selected_detail_index !== undefined && order_data.detail[this.state.selected_detail_index] !== undefined) {
          order_data.detail[this.state.selected_detail_index].request_id = selected_request_id;
          order_data.detail[this.state.selected_detail_index].request_name = selected_request_name;
          this.setState({selected_request_id})
        }
      }
    }
    if (this.state.selected_detail_index !== undefined && order_data.detail[this.state.selected_detail_index] !== undefined) {
      order_data.detail[this.state.selected_detail_index].surface_data = data;
      order_data.detail[this.state.selected_detail_index].total_surface = total_surface;
    }
    this.setState({order_data});
    this.change_flag = 1;
  };
  getOxygenState = (practice_id) => {
    let {practice_master} = this.state;
    if (practice_master === undefined) return;
    let find_item = practice_master.find(x=>x.practice_id == practice_id);
    if (find_item !== undefined && find_item.oxygen_treatment_flag == 1) return true;
    return false;
  }
  
  maincloseModal = () => {
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
  doneCheck = () => {
    // YJ1028・必須項目抜けの判定は、オンになっているものだけ対象にする。
    if ((this.props.from_page === "soap" || this.props.from_page === "progress_chart") && this.state.implement_check_list.length < 1) return "";

    let result = "";
    let {order_data} = this.state;
    
    if(this.use_done_info === 1){
      let {practice_master} = this.state;
      order_data.detail.map((detail, detail_idx)=>{
        let check = true;
        if (this.props.from_page === "soap" || this.props.from_page === "progress_chart") {
          // YJ1028
          check = this.state.implement_check_list.includes(detail_idx);
        }
        if (check) {          
          if (detail.enable_body_part == 1) {
            if (this.state.side_options[detail.practice_id] !== undefined && detail.side_id == 0 &&
              (this.state.side_data[detail_idx] === undefined || this.state.side_data[detail_idx] == "") ) {
              result = detail.practice_name + "の左右を選択してください。";
            }
            if (this.state.position_options[detail.practice_id] !== undefined && detail.position_id == 0 &&
              (this.state.position_data[detail_idx] === undefined || this.state.position_data[detail_idx] == "") ) {
              result = detail.practice_name + "の位置を選択してください。";
            }
            if (this.state.part_options[detail.practice_id] !== undefined && detail.part_id == 0 &&
              (this.state.part_data[detail_idx] === undefined || this.state.part_data[detail_idx] == "") ) {
              result = detail.practice_name + "の部位を選択してください。";
            }
          }
          if (this.state.request_options[detail.practice_id] !== undefined && detail.request_id == 0 &&
            (this.state.request_data[detail_idx] === undefined || this.state.request_data[detail_idx] == "") ) {
            result = detail.practice_name + "の請求情報を選択してください。";
          }
          let find_practice = practice_master.find(x=>x.practice_id == detail.practice_id);
          if (find_practice !== undefined && find_practice.quantity_is_enabled == 1 && !(detail.quantity > 0)) result = '数量未設定の行為があるため実施できません。';
        }
      });
    }
    if (order_data.detail.length > 0) {
      order_data.detail.map((item, detail_idx)=>{
        let check = true;
        if (this.props.from_page === "soap" || this.props.from_page === "progress_chart") {
          // YJ1028
          check = this.state.implement_check_list.includes(detail_idx);
        }
        if (check) {
          let total_amount = 0;
          if (item.done_info !== undefined && item.done_info.length > 0) {
            item.done_info.map(sub_item=> {
              if (sub_item.oxygen_amount !== undefined && sub_item.oxygen_amount > 0) {
                total_amount += sub_item.oxygen_amount;
              }
            })
          }
          if (total_amount !== 0 && total_amount != item.total_amount) result = "供給源が未選択の酸素量があります";
        }
      });
    }
    if (!this.can_done) result = "権限がありません。";
    return result;
  }

  openTable = (_idx) => {
    let order_data = this.state.order_data;
    let order_data_detail = this.state.order_data.detail;
    if (order_data_detail.length > 0) {      
      order_data_detail = order_data_detail.map((item, item_idx)=>{
        if (item_idx == _idx) {
          item.show_set_detail = 1;
        }
        return item;
      });
    }
    order_data.detail = order_data_detail;
    this.setState({order_data});
  }
  closeTable = (_idx) => {

    let order_data = this.state.order_data;
    let order_data_detail = this.state.order_data.detail;
    if (order_data_detail.length > 0) {      
      order_data_detail = order_data_detail.map((item, item_idx)=>{
        if (item_idx == _idx) {
          item.show_set_detail = 0;
        }
        return item;
      });
    }
    order_data.detail = order_data_detail;
    this.setState({order_data});
  }

  getImplementRadio = (idx) => {
    let implement_check_list = this.state.implement_check_list;
    let find_idx = implement_check_list.indexOf(idx);
    if (find_idx == -1) implement_check_list.push(idx);
    else implement_check_list.splice(find_idx, 1);    
    this.setState({implement_check_list:implement_check_list});
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
  
  render() {
    let { modal_data, order_data, part_options, position_options, side_options, selected_array} = this.state;
    let done_state = order_data.header.state == 1;
    let karte_status_name = "外来・";
    if (order_data !== undefined && order_data.karte_status !== undefined) {
      karte_status_name = order_data.karte_status === 1 ? "外来・" : (order_data.karte_status === 2 ? "訪問診療・" : (order_data.karte_status === 3 ? "入院・" : ""));
    }
    let schedule_date_time = "";
    let completed_at_time = "";
    let min_time = new Date(formatDateSlash(new Date())+" 00:00:00");
    let max_time = new Date(formatDateSlash(new Date())+" 23:55:00");
    if (order_data.header.isPeriodTreatment == 1 && modal_data.detail_index !== undefined && modal_data.cnt_index !== undefined) {
      let cnt_index = modal_data.cnt_index;
      let detail_data = order_data.detail[0];
      if (detail_data !== undefined && detail_data.done_numbers !== undefined) {
        completed_at_time = detail_data.done_numbers[modal_data.date][cnt_index].completed_at;
        if (completed_at_time != "") {
          completed_at_time = formatJapanDateSlash(completed_at_time) + " " + completed_at_time.substr(11, 2) + ":" + completed_at_time.substr(14, 2);
        }
        
        // count schedule_date_time
        if(modal_data.date !== null && modal_data.date !== undefined && modal_data.date != "") {
          schedule_date_time = formatJapanDateSlash(modal_data.date);
          schedule_date_time = schedule_date_time + " " + detail_data.done_numbers[modal_data.date][cnt_index].time;
        }
        if (detail_data.administrate_period != undefined && detail_data.administrate_period != null) {
          min_time = this.getMinTime(cnt_index, detail_data.administrate_period.done_times);
          max_time = this.getMaxTime(cnt_index, detail_data.administrate_period.done_count, detail_data.administrate_period.done_times);
        }
      }
    }
    let done_tooltip = this.doneCheck();
    
    return  (
      <Modal show={true} id="done-order-modal"  className={"custom-modal-sm first-view-modal "+ (this.use_done_info === 1 ? "treat-done-modal" : "haruka-done-modal")}>
        <Modal.Header>
          <Modal.Title>{this.props.from_page === "order-modal" ? '実施情報' : ((order_data.general_id === 2) ? "在宅処置" : (order_data.general_id === 3 ? "入院処置" : "外来処置"))}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.is_loaded ? (
            <Wrapper>
              <Col id="soap_list_wrapper">
                <Bar>
                  <div className="content">
                    <div className="w-100 d-flex">
                      <div className="w-50 mb-2 time-area d-flex">
                        {this.state.done_time_show == true && (
                          <>
                            <div className="mr-2" style={{lineHeight: "2rem", width:"5rem", textAlign:"left"}}>実施時間</div>
                            <DatePickerBox>
                              <DatePicker
                                selected={this.state.confirm_done_time}
                                onChange={this.getDoneTime.bind(this)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={5}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時間"
                                minTime={min_time}
                                maxTime={max_time}
                              />
                            </DatePickerBox>
                          </>
                        )}
                        {this.state.done_date !== undefined && (
                          <>
                            <div className="mr-2" style={{lineHeight: "2rem", width:"5rem", textAlign:"left"}}>実施時間</div>
                            <DatePicker
                              selected={this.state.done_date}
                              onChange={this.getDoneDateTime.bind(this)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={5}
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              timeCaption="時間"
                            />
                          </>
                        )}
                        {this.state.end_date !== undefined && (
                          <>
                            <div className="mr-2" style={{lineHeight: "2rem", width:"5rem", textAlign:"left"}}>終了日</div>
                            <DatePicker
                              selected={this.state.end_date}
                              onChange={this.getEndDate.bind(this)}
                              locale="ja"
                              dateFormat="yyyy/MM/dd"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                          </>
                        )}
                      </div>
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
                              {modal_data.treatment_date !== undefined && modal_data.treatment_date != null && modal_data.treatment_date !== "" && (
                                <>
                                {modal_data.treatment_date.substr(0, 4)}/
                                {modal_data.treatment_date.substr(5, 2)}/
                                {modal_data.treatment_date.substr(8, 2)}
                                ({this.getWeekDay(modal_data.treatment_date.substr(0,10))})
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
                              {order_data.detail.map((item, detail_idx)=>{
                                // let item_done_item_mode = 
                                return(
                                  <>
                                    {(this.props.from_page === "soap" || this.props.from_page === "progress_chart") && (
                                      <>
                                        <div className={`flex between drug-item table-row big-checkbox-area ${this.getOrderImplementClassName(item)}`} style={{position:"absolute", display:"block", padding:"0px"}}>
                                          <div className="data-item" style={{padding:"4px"}}>                                        
                                            <BigCheckbox
                                              label="実施"
                                              getRadio={this.getImplementRadio.bind(this, detail_idx)}
                                              value={this.state.implement_check_list.includes(detail_idx) || item.completed_at != undefined && item.completed_at != "" ? 1 : 0}
                                              name={"implement_check_" + detail_idx}
                                              isDisabled={item.completed_at != undefined && item.completed_at != "" ? true : false}
                                            />
                                          </div>
                                        </div>
                                        <div className={`flex between drug-item table-row`} style={{height:"39px"}}>                                    
                                        </div>
                                      </>
                                    )}
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
                                                （{!done_state && this.props.from_page !== "soup" ? (
                                                  <span className="quantity">
                                                    <InputWithLabel
                                                      label=""
                                                      type="text"
                                                      getInputText={this.getQuantity.bind(this, detail_idx)}
                                                      diseaseEditData={item.quantity}
                                                    />
                                                  </span>
                                                ):(
                                                  <span className="label-title">{item.quantity}</span>
                                                )}
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
                                    {!done_state && this.state.request_options[item.practice_id] !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">請求情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            <div className="border p-1">
                                              {this.state.request_options[item.practice_id].map(sub_item=> {
                                                return (
                                                  <div key={sub_item}
                                                       onClick={this.setRequest.bind(this, detail_idx, sub_item.id)}
                                                       style={{cursor:"pointer"}}
                                                       className={selected_array[detail_idx] !== undefined && selected_array[detail_idx].selected_request_id == sub_item.id ? "selected":""}>
                                                    {sub_item.value}
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
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
                                    {!done_state && item.enable_body_part != 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">部位</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment flex w-100">
                                            {this.treat_order_part_position_mode == 0 ? (
                                              <>
                                                <div className="border p-1" style={this.treat_order_part_position_mode == 0 ?{width:'50%'}:{width: "67%"}}>
                                                  {part_options[item.practice_id] !== undefined && (
                                                    part_options[item.practice_id].map(part_item => {
                                                      return (
                                                        <>
                                                          {position_options[item.practice_id] !== undefined && (
                                                            position_options[item.practice_id].map(position_item => {
                                                              if (position_item.part_id == part_item.part_id){
                                                                return (
                                                                  <div className={selected_array[detail_idx] !== undefined && position_item.id===selected_array[detail_idx].selected_position_id?"selected":""}
                                                                       style={{cursor:"pointer"}}
                                                                       onClick = {this.selectPosition.bind(this, detail_idx, position_item.id)} key = {position_item.id}
                                                                  >{position_item.value}</div>
                                                                )
                                                              }
                                                            })
                                                          )}
                                                        </>
                                                      )
                                                    })
                                                  )}
                                                </div>
                                              </>
                                            ):(
                                              <>
                                                <div className="d-flex" style={{width: "67%"}}>
                                                  <div className="border p-1" style={{width:"50%"}}>
                                                    {part_options[item.practice_id] !== undefined && (
                                                      part_options[item.practice_id].map(sub_item => {
                                                        return (
                                                          <div className={selected_array[detail_idx] !== undefined && sub_item.id===selected_array[detail_idx].selected_part_id?"selected":""}
                                                               style={{cursor:"pointer"}}
                                                               onClick = {this.selectPart.bind(this, detail_idx, sub_item.id, item.practice_id)} key = {sub_item.id}
                                                          >{sub_item.value}</div>
                                                        )
                                                      })
                                                    )}
                                                  </div>
                                                  <div className="ml-2 border p-1" style={{width:"50%"}}>
                                                    {position_options[item.practice_id] !== undefined && (
                                                      position_options[item.practice_id].map(sub_item => {
                                                        return (
                                                          <div className={selected_array[detail_idx] !== undefined && sub_item.id===selected_array[detail_idx].selected_position_id?"selected":""}
                                                               style={{cursor:"pointer"}}
                                                               onClick = {this.selectPosition.bind(this, detail_idx, sub_item.id)} key = {sub_item.id}
                                                          >{sub_item.value}</div>
                                                        )
                                                      })
                                                    )}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            <div className="border p-1 ml-2" style={this.treat_order_part_position_mode == 0 ? {width:"50%"}:{width:"33%"}}>
                                              {side_options !== undefined && side_options[item.practice_id] !== undefined && side_options[item.practice_id].map(sub_item=> {
                                                return (
                                                  <div key={sub_item}
                                                       onClick={this.selectSide.bind(this, detail_idx, sub_item.id)}
                                                       style={{cursor:"pointer"}}
                                                       className={selected_array[detail_idx] !== undefined && selected_array[detail_idx].selected_side_id == sub_item.id ? "selected":""}>
                                                    {sub_item.value}
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
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
                                    {item.surface_data !== undefined && item.surface_data.length > 0 ? (
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
                                            {!done_state && (
                                              <Button type="common" onClick={this.countSurface.bind(this, detail_idx)} className="ml-1">面積計算</Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ):(
                                      <>
                                        {!done_state && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">面積</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="remarks-comment">                                                
                                                <Button type="common" onClick={this.countSurface.bind(this, detail_idx)} className="ml-1">面積計算</Button>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </>
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
                                    
                                    {((this.use_done_info === 0 && item.treat_done_info !== undefined && item.treat_done_info.length > 0) || (item.completed_at !== undefined && item.completed_at != "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {item.completed_at !== undefined && item.completed_at != null && (
                                              <span>{item.completed_at.split("-").join("/")}　{getStaffName(item.completed_by)}</span>
                                            )}
                                            {item.treat_done_info !== undefined && item.treat_done_info.map(detail=>{
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
                                    {item.done_info !== undefined && order_data.header.state != 1 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            <div className={'set-area flex'} style={{marginBottom:"0.2rem"}}>
                                            <Button type="common" className="open-close-button" disabled={item.can_open == 0} onClick={this.openTable.bind(this, detail_idx)}>∨開く</Button>
                                            <Button type="common" className="ml-2 open-close-button" disabled={item.can_open == 0} onClick={this.closeTable.bind(this, detail_idx)}>∧たたむ</Button>
                                              <div className="select-set">
                                                <SelectorWithLabel
                                                  options={item.set_master}
                                                  title="セット"
                                                  getSelect={this.getSelectSet.bind(this, detail_idx)}
                                                  departmentEditCode={item.set_id}
                                                  id="set_id_id"
                                                />
                                              </div>
                                              <Button type="common" onClick={this.putSetDetail.bind(this, detail_idx)} style={{marginRight: 0, width:"9rem"}}>セット指示変更</Button>
                                              {this.getOxygenState(item.practice_id) && this.treat_oxygen_list !== undefined && this.treat_oxygen_list.length > 0 ? (
                                                <Button type="common" onClick={this.openOxygenModal.bind(this, detail_idx)} className="ml-1" style={{marginRight:0, width:"7rem"}}>酸素量計算</Button>
                                              ):(
                                                <Button type="common" disabled={true} className="ml-1" style={{marginRight:0, width:"7rem"}}>酸素量計算</Button>
                                              )}
                                            </div>
                                            {item.show_set_detail != undefined && item.show_set_detail == 1 && (
                                              <>
                                                <div className={'set-area flex'}>
                                                  <Button onClick={this.selectAllSetDetail.bind(this, detail_idx)}>全選択</Button>
                                                  <Button onClick={this.unSelectAllSetDetail.bind(this, detail_idx)}>全解除</Button>                                              
                                                </div>
                                                <div className={'set-detail-area'}>
                                                  <table className="table-scroll table table-bordered" id={'done-info-'+detail_idx}>
                                                    <tr className={'table-menu'}>
                                                      <th style={{width:"1.5rem"}}/>
                                                      <th className="text-center check-td">チェック</th>
                                                      <th className="text-center type-td">分類</th>
                                                      <th className="text-center button-td">検索</th>
                                                      <th className="text-center name-td">品名/名称</th>
                                                      <th className="text-center amount-td">数量</th>
                                                      <th className="text-center unit-tdr">単位</th>
                                                      <th className="text-center lot-td">ロット</th>
                                                      <th className="text-center comment-td">フリーコメント</th>
                                                    </tr>
                                                    {item.done_info.map((done_item,index)=>{
                                                      return (
                                                        <>
                                                          <tr onContextMenu={e => this.handleClick(e, detail_idx)}>
                                                            <td className="text-center td-no" style={{width:"1.5rem"}}>{index + 1}</td>
                                                            <td className="td-check text-center check-td">
                                                              <Checkbox
                                                                label=""
                                                                getRadio={this.setCheckState.bind(this)}
                                                                value={done_item.check}
                                                                name={"check:"+detail_idx+":"+index}
                                                                isDisabled={done_item.item_id === 0}
                                                              />
                                                            </td>
                                                            <td className="text-center select-class type-td">
                                                              {done_item.item_id !== 0 ? (
                                                                <div className="text-center">{done_item.classfic_name}</div>
                                                              ) : (
                                                                <SelectorWithLabel
                                                                  options={this.state.item_categories}
                                                                  title={''}
                                                                  getSelect={this.setSelectValue.bind(this, "classfic:"+detail_idx+":"+index)}
                                                                  departmentEditCode={done_item.classfic}
                                                                />
                                                              )}
                                                            </td>
                                                            <td className="text-center button-td">
                                                              <div className="w-100">
                                                                <div className="div-button" onClick={this.openItemSelectModal.bind(this,detail_idx+":"+index)}>検索</div>
                                                              </div>
                                                            </td>
                                                            <td className="text-center name-td">{done_item.item_name}</td>
                                                            <td className="text-center no-border-div input-num amount=td">
                                                              {this.getOxygenState(item.practice_id) && this.treat_oxygen_list !== undefined && this.treat_oxygen_list.indexOf(done_item.item_id) > -1 ? (
                                                                <OverlayTrigger overlay={renderTooltip("酸素量は計算ボタンから編集してください")}>
                                                                  <div className="disable-input" onContextMenu={e => this.handleOxygenClick(e, index)}>
                                                                    <InputWithLabel
                                                                      className="input-num"
                                                                      diseaseEditData={done_item.count}
                                                                      getInputText={this.getCount.bind(this, detail_idx+":"+index)}
                                                                      isDisabled={true}
                                                                    />
                                                                  </div>
                                                                </OverlayTrigger>
                                                              ):(
                                                                <InputWithLabel
                                                                  className="input-num"
                                                                  diseaseEditData={done_item.count}
                                                                  getInputText={this.getCount.bind(this, detail_idx+":"+index)}
                                                                  isDisabled={done_item.item_id === 0}
                                                                />
                                                              )}
                                                            </td>
                                                            <td className="text-center select-unit unit-td">
                                                              {item.done_info_detail_unit[index] !== undefined && Object.keys(item.done_info_detail_unit[index]).length > 1 ? (
                                                                <SelectorWithLabel
                                                                  options={item.done_info_detail_unit[index]}
                                                                  title=""
                                                                  getSelect={this.getUnitId.bind(this, detail_idx+":"+index)}
                                                                  departmentEditCode={done_item.unit_id}
                                                                />
                                                              ) : (
                                                                <div className="text-center">{done_item.main_unit}</div>
                                                              )}
                                                            </td>
                                                            <td className="lot-td">
                                                              <InputWithLabel
                                                                label=""
                                                                type="text"
                                                                getInputText={this.getLot.bind(this, detail_idx+":"+index)}
                                                                diseaseEditData={done_item.lot}
                                                                isDisabled={done_item.item_id === 0}
                                                                className="detail-lot"
                                                                onBlur={this.getBlurLot.bind(this,detail_idx+":"+index)}
                                                              />
                                                            </td>
                                                            <td className="comment-td">
                                                              <InputWithLabel
                                                                label=""
                                                                type="text"
                                                                getInputText={this.getFreeComment.bind(this, detail_idx+":"+index)}
                                                                diseaseEditData={done_item.comment}
                                                                className="detail-comment"
                                                                isDisabled={done_item.item_id === 0}
                                                                onBlur={this.getBlurFreeComment.bind(this,detail_idx+":"+index)}
                                                              />
                                                            </td>
                                                          </tr>
                                                        </>
                                                      )
                                                    })}
                                                  </table>
                                                </div>
                                              </>
                                            )}
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
                                    {order_data.header.state != 1 ? (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment done-comment">
                                            <textarea value={item.done_comment} onChange={this.setDoneComment.bind(this, detail_idx)}></textarea>
                                          </div>
                                        </div>
                                      </div>
                                    ):(
                                      <>
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
                                      </>
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
                              {order_data.header.isPeriodTreatment == 1 && schedule_date_time != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">実施予定日時</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {schedule_date_time}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {order_data.header.isPeriodTreatment == 1 && completed_at_time != "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">実施日時</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {completed_at_time}
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
            <span>{this.props.from_page == "outhospital_delete" ? "閉じる" : "キャンセル"}</span>
          </div>
          {(this.props.only_close_btn !== true && (order_data.header.state !== 1)) && (
            <>
              {done_tooltip !== "" ? (
                <OverlayTrigger placement={"top"} overlay={renderTooltip(done_tooltip)}>
                  <div id="system_confirm_Ok" className="custom-modal-btn disable-btn">
                    <span>{this.props.from_page === "order-modal" ? "確定" : "実施"}</span>
                  </div>
                </OverlayTrigger>
              ):(
                <>
                  {(this.props.from_page == "soap" || this.props.from_page == "progress_chart") && this.state.implement_check_list.length < 1 ? (
                    <div id="system_confirm_Ok" className="custom-modal-btn disable-btn" style={{cursor:"pointer"}}>
                      <span>実施</span>
                    </div>
                  ):(
                    <div id="system_confirm_Ok" className={(this.done_disable) ? "custom-modal-btn disable-btn" : "custom-modal-btn red-btn"} onClick={this.openConfirm} style={{cursor:"pointer"}}>
                      <span>{this.props.from_page === "order-modal" ? "確定" : "実施"}</span>
                    </div>
                  )}
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
        {this.state.doctors !== undefined && this.context.needSelectDoctor && (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.state.doctors}
          />
        )}
        <ContextItemMenu
          {...this.state.contextItemMenu}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
          index={this.state.index}
        />
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.isItemSelectModal && (
          <SelectPannelHarukaModal
            selectMaster = {this.setItemName}
            closeModal= {this.confirmCancel}
            MasterName= {'品名'}
            item_category_id={this.state.cur_item_category_id}
            is_pagenation={true}
          />
        )}
        {this.state.isOpenOxygenModal && (
          <OxygenCalculateModal
            closeModal={this.confirmCancel}
            handleOk={this.oxygenOk}
            modal_data={this.state.oxygen_data}
            practice_name={this.state.practice_name}
            select_practice={this.state.select_practice}
            selected_oxygen_date={new Date()}
          />
        )}
        {this.state.isCountSurfaceModalOpen && (
          <CountSurfaceModal
            closeModal={this.confirmCancel}
            handleOk={this.surfaceOk}
            modal_data={this.state.surface_data}
          />
        )}
      </Modal>
    );
  }
}

TreatDoneModal.contextType = Context;
TreatDoneModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  only_close_btn: PropTypes.bool,
  from_page: PropTypes.string,
  done_date: PropTypes.string,
  end_date: PropTypes.string,
  patientId: PropTypes.number,
  handleNotDoneOk:PropTypes.func,
  doneInspection:PropTypes.func,
};

export default TreatDoneModal;