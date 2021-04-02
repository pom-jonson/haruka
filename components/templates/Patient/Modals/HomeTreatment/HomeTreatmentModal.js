import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/RemComponents/SelectorWithLabel";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import InputWithLabel from "~/components/molecules/RemComponents/InputWithLabel";
import * as methods from "./HomeTreatmentMethods";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import ItemTableBody from "~/components/templates/Patient/Modals/Guidance/ItemTableBody";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, checkSMPByUnicode} from "~/helpers/constants";
registerLocale("ja", ja);
import SelectPannelHarukaModal from "../Common/SelectPannelHarukaModal";
import SetDetailViewModal from "~/components/templates/Patient/Modals/Common/SetDetailViewModal";
import axios from "axios/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import CountSurfaceModal from "~/components/templates/Patient/Modals/OutPatient/CountSurfaceModal";
import {onSurface,} from "../../../../_nano/colors";
import {KARTEMODE} from "~/helpers/constants";
import OxygenCalculateModal from "~/components/templates/Patient/Modals/OutPatient/OxygenCalculateModal";
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import {displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { formatDateTimeIE } from "~/helpers/date";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import TreatDoneModal from "../../../OrderList/TreatDoneModal";

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;
const Angle = styled(FontAwesomeIcon)`
  color: ${onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
  top: 0px;
  right: 8px;
  bottom: 0px;
  margin: auto;
`;
const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y: auto;
 .flex{
  display: flex;
 }
.selected, .selected:hover{
  background:lightblue!important;      
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

.work-list{
    width: 100%;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    margin-top:0;
    .area-1 {
      height: 100%;
      margin-right: 3px;
      .title{
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
        background-color: #a0ebff;
        border: 1px solid #aaa;
        border-bottom: none;
      }
      .content{
        height: 10vh;
        border:1px solid #aaa;
        p {
          margin: 0;
          cursor: pointer;
          padding-left: 0.25rem; 
        }
        p:hover {
          background-color: rgb(246, 252, 253);
        }
        overflow-y:auto;
      }
    }
}
  .menu-select{
    width: 2.185rem;
    height: 1.875rem;
    button{
      width: 100%;
      min-width: 1.875rem;
      height: 1.875rem;
      background-color: #ddd;
      border: 1px solid #aaa;
      line-height: 0px;
      span{
        color:black;
        margin-left: -4px;
      }
    }
  }
  .date-select {
    border: solid 1px #999;
    width: 9.375rem;
    text-align: center;
    height: 1.875rem;
    margin: 0 0.5rem;
    .react-datepicker-wrapper{
      input{
        height: 2rem;
      }
    }
  }
  .select-box{
    select{
      width: 300px;
      height: 1.875rem;
    }
    label{
        margin: 0;
        height: 25px;
    }
    .pullbox-title{
      font-size: 1rem;
      width: auto;
      line-height: 1.875rem;
      margin-right: 0.25rem;
    }
    .pullbox-label{
        height:1.875rem;
    }
  }
  .set-done{
    margin-top: 0.5rem;
    .state-name {
      div {margin:0;}
        .label-title {
            margin-bottom: 0;
            width:0;
        }
        input {
          height: 1.875rem;
          width: 15rem;
        }
    }
    button{
        width: 1.875rem;
    }
    .set-change-btn {
      padding: 0;
      height: 1.875rem;
      line-height: 1.875rem;
      width: 9rem;
    }
    .quantity-unit{
      .quantity {
        margin-top: -8px;
        input {
          height: 1.875rem;
          font-size: 1rem;
          width: 8rem;
        }
      }
      .label-title{
        font-size: 1rem;
        line-height: 1.875rem;
        text-align: right;
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }
  .mt5{
    button{
        padding:0.25rem;
        margin-left:0.25rem;
        min-width:2.125rem;
        span {
            font-size: 0.875rem;
            font-weight: normal;
        }
    }
  }
  .mt5{margin-top:0.25rem;}
   .btn-area {
    button {
      height: 2rem;
      padding: 0 0.3rem;
    }
  }
  .barcode-area {
    .label-title {
      margin-top:0;
      margin-bottom: 0;
      line-height:1.875rem;
      text-align:right;
    }
    input {
      height: 1.875rem;
    }
    div{margin:0;}
  }
  .header-second{
    display: flex;
    margin-bottom:0.25rem;
    label{
      margin-top:-0.25rem;
      margin-left: 0.25rem;
      margin-right:15px;
      margin-bottom:0.25rem;
    }
  }
  
  .header-first{
    display: flex;
    .menu-select{
      width: 2.185rem;
      height: 1.875rem;
      button{
        width: 100%;
        min-width: 1.875rem;
        height: 1.875rem;
        background-color: #ddd;
        border: 1px solid #aaa;
        line-height: 0px;
        span{
          color:black;
          margin-left: -4px;
        }
      }
    }
    .react-datepicker-wrapper{
        input{
            font-size:1rem;
        }
    }
    .select-exit-time {
        label{
            font-size:1rem;
            line-height: 2rem;
        }
    }
    .datepicker {
        margin-left:0.5rem!important;
        label {
            margin-bottom: 0;
            line-height: 2rem;
        }
        .react-datepicker-wrapper {
            input{
                width:55px;
                height: 2rem;
            }
        }
    }
    .radio-area{
      display: flex;
      margin-bottom:0.25rem;
      label{
        margin-top: -0.25rem;
        margin-right:15px;
      }
    }
    .treat-date {
        margin-right:0.5rem;
        line-height: 2rem;
    }
    .date-select {
      width: auto;
      border: solid 1px #999;
      margin: 0;
      input{
          width:100px;
          height: 2rem;
      }
    }
    .select-box{
      margin-right: 0.5rem;
      .label-title {
        margin-bottom: 0px;
      }
      select{
        width: 100px;
        height: 2rem;
      }
      label{
        height: 2rem;
      }
      .pullbox-title{
        font-size: 1rem;
        width: auto;
        line-height: 2rem;
        margin-right: 0.25rem;
      }
    }
  }
  .clear-button {    
      min-width: 1.875rem !important;
      height: 1.875rem !important;
      width: 1.875rem !important;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      padding: 0 !important;
      span{
        color:black;     
        font-size: 1rem !important;   
      }
  }
  .open-close-button{
    height: 1.875rem !important;
    background-color: buttonface;
    border: 1px solid #7e7e7e;
    padding: 0 !important;
    min-width: 5rem !important;
  }
  .table {
    .pullbox-title{width:0;}
    tr{height: 1.875rem;}
    td{padding:0;}
    td{
        padding:0;
        input{
            margin-top:0px;
        }
        .input-with-label{
            margin-top:0px;
            width:105px;
        }
        .detail-comment{
            margin-top:0px;
            width:150px;
        }
    }
    th{padding:3px;}
  }
  .comment-area{
    button{
      height: 2rem;
      width: 2.5rem;
    }
    label{
        margin: 0;
        height: 25px;
    }
    textarea {
        width: 40rem;
    }
  }
  .ml100{margin-left: 100px;}
  .ml10{margin-left: 100px;}
  .no-border{
    border: none !important;
  }
  .last-part{
    button{
      margin-right: 0.25rem;
      margin-left: 0.25rem;
      span{
        font-size: 1rem;
        font-weight: 100;
      }
    }
  }
  .inline-radio{
    label {
      font-size: 1rem;
      margin-right: 0.25rem;
      border-radius: 4px;
      border: solid 1px #ddd;
      margin-bottom:0;
      height: 1.875rem;
      line-height: 1.875rem;
    }
    div{
      margin-right: 0.25rem;
    }
  }
  .search-type{
    label {
      font-size: 1rem;
    }
  }
   .set-detail-area {
    width: 100%;
    table {
        thead{
            display:table;
            width:100%;
            background-color: #a0ebff;
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: 18vh;
            width:100%;
        }
        tr{
            display: table;
            width: 100%;
        }
        .react-numeric-input {
            b {
              right: 0.25rem;
            }
            input {
                width: 100%;
                padding-right: 20px !important;
                text-align: right;
            }
        }
        td{
          div{
            border:none;
          }
          .form-control{
            height: 2.375rem;
            margin-top:0px;
            padding:0;
            .react-numeric-input {
              width: 100%;
            }
          }

        }
        
    }
    .table-menu {
      width : calc(100% - 17px);
      background-color: #a0ebff;
    }
    .td-no {
      background-color: #a0ebff;
    }
    td {
      vertical-align: middle;
    }
    .td-check {
      label {
          padding-left: 32px;
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
      height: 2.375rem;
    }
    
    .input-with-label input{
        width: 100%;
    }
    .detail-comment input{
        width: 100%;
    }
    .input-num {
      div {
        width:100%;
      }
      input {
        ime-mode: inactive;
      }
    }
  }

  .set-table{
    width: 100%;
    margin-top: 0.5rem;
    table {
      margin-bottom: 0;
        thead{
          background-color: #a0ebff;
          display:table;
          width:100%;        
          tr{
              width: calc(100% - 17px);
          }
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: 6vh;
            width:100%;
        }
        tr{
            display: table;
            width: 100%;
        }
    }
    .table-menu {
      background-color: #a0ebff;
      td {
        text-align: center;
      }
    }
    .set-data-row:hover {
      background-color: rgb(246, 252, 253);
      cursor:pointer;
    }
    td {
      vertical-align: middle;
      padding-left: 0.25rem;
      padding-right: 0.25rem;
      word-break: break-all;
    }
    .detail-view-btn {
        padding: 0;
    }
    button {
      margin: 0;
      padding: 0;
      width: 100%;
    }
  }
  .practice-search-btn {
      padding: 0;
      height: 1.875rem;
      line-height: 1.875rem;
      span {
          font-size: 1rem;
          font-weight: normal;
      }
  }

  .block-area {
    border: 1px solid #aaa;
    margin-top: 0.5rem;
    padding: 1.25rem 0.5rem 0.5rem 0.5rem;
    position: relative;
    label {
      font-size: 0.875rem;
      width:auto;
    }
    .label-unit{
      font-size: 1.25rem;
      margin-top: 8px;
      width: 50px;
    }
    .div-tall-weight {
      margin:0;
    }
  }
  .block-title {
    position: absolute;
    top: -12px;
    left: 0.5rem;
    font-size: 1.125rem;
    background-color: white;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  .set-item-detail-area {
    margin-bottom: 1rem;
    table {
      margin-bottom: 0;
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        background-color: #a0ebff;
        .table-check {
            width: 371px;
        }
        tr{width: calc(100% - 17px);}
      }
      tbody{
          display:block;
          overflow-y: scroll;
          height: 5rem;
          width:100%;
          .input-value {
            margin-top: -8px;
            .label-title{
              width: 0;
              margin-right: 0;
            }
          }
      }
      th {
        padding:0;
        font-weight: normal;
      }
      td {vertical-align: middle;}
      .item-no {
        width: 40px;
      }
      .name{
        width: 33rem;
      }
    }
      .pullbox-select{
          height: 2.375rem;
      }
      .pullbox-label {
        margin-bottom: 0;
      }
      .table-check {
          width: 370px;
      }
      .code-number {
          width: 70px;
          button {
              width: 70px;
              height: 2.375rem;
          }
      }
      th {
          text-align: center;
      }
  }
  .home-label {
    display: flex;
    margin-top: 0.5rem;
    div {
      line-height:2rem;
    }
    svg {
      margin-left: 0.5rem;
    }
    .close-icon {
      transform: rotate(180deg);
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
margin-bottom:0;
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

const ContextMenu = ({visible,x,y,parent, index
                     }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.contextMenuAction('edit', index)}>変更</div>
          </li>
          <li>
            <div onClick={() => parent.contextMenuAction('delete', index)}>削除</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};
const ContextItemMenu = ({visible,x,y,parent, index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {/*{parent.state.oxygen_menu_idx >= 0 && (*/}
          {/*  <li><div onClick={() => parent.contextMenuAction('oxygen_delete', index)}>酸素量計算削除</div></li>*/}
          {/*)}*/}
          <li><div onClick={() => parent.contextMenuAction('item_add', index)}>追加</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class HomeTreatmentModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>{
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))}
    );
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.treat_order_is_enable_request = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").treat_order_is_enable_request;
    this.treat_order_part_position_mode = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").treat_order_part_position_mode;
    this.treat_freecoment_length = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").treat_freecoment_length;
    this.treat_lot_length = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").treat_lot_length;
    this.treat_freecoment_length = this.treat_freecoment_length != undefined ? this.treat_freecoment_length : 25;
    this.treat_lot_length = this.treat_lot_length != undefined ? this.treat_lot_length : 25;
    let patientInfo = karteApi.getPatient(this.props.patientId);
    let treatment_barcode = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").treatment_barcode;
    this.treatment_barcode = treatment_barcode != undefined ? treatment_barcode : "ON";
    this.treat_oxygen_list = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "treat_oxygen_list");
    this.state = {
      patient_id: props.patientId,
      is_loaded: false,
      all_data:null,
      classification_id:'',
      collected_date: new Date(),
      is_exist_time: 2,
      start_time: "",
      detail_json:{},
      detail_json_array:[],
      department_state: 0,
      exist_time:{1:"時間あり", 2:"時間なし"},
      search_type_array:{1:"全て", 2:"処置のみ", 3:"検査のみ"},
      search_type: 1,
      set_master:[],
      item_count:[0,1,2,3,4,5],
      isShowStaffList: false,
      treat_user_id:0,
      treat_user_name:'',
      isPracticeSelectModal:false,
      isCountSurfaceModalOpen:false,
      isItemSelectModal:false,
      isSetDetailModal:false,
      set_detail:[
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
      ],
      detail_unit: [
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },]
      ],
      cur_index:0,
      set_id:0,
      set_data:null,
      treat_item:null,
      set_name:"",
      insurance_id: patientInfo != null && patientInfo != undefined && patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0,
      insurance_name: "既定",
      enable_body_part: 1,
      item_categories:[{ id: 0, value: ""},],
      item_details:[
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ],
      result_edit:false,
      view_item_table:false,
      number: 0,
      isForUpdate: 0,
      state: 0,
      created_at: '',
      isOpenOxygenModal: false,
      display_department_id: 1,
      confirm_message: "",
      alert_message: "",
      alert_messages: "",
      save_tooltip: "",
      can_open: 1,
      show_set_detail: 0,
      isOpenDoneModal: false
    };
    this.change_flag = 0;
    this.amount_max_length = 10;
    this.integer_length = 8;
    this.decimal_length = 4;
    let haruka_validate = JSON.parse(window.sessionStorage.getItem("haruka_validate"));
    if (haruka_validate !== undefined && haruka_validate != null) {
      let validate_data = haruka_validate['karte']['rehability'];
      if (validate_data !== undefined && validate_data != null) {
        let amount_validate = validate_data.therapy_item2_amount;
        if (amount_validate !== undefined) {
          this.amount_max_length = amount_validate.max_length !== undefined ? amount_validate.max_length : 10;
          this.integer_length = amount_validate.integer_length !== undefined ? amount_validate.integer_length : 8;
          this.decimal_length = amount_validate.decimal_length !== undefined ? amount_validate.decimal_length : 4;
        }
      }
    }
  }

  async componentDidMount() {
    var wrapper = document.getElementsByClassName('treatment-modal-wrapper')[0];
    await apiClient.get("/app/api/v2/secure/staff/search?")
      .then((res) => {
        let staff_list_by_number = {};
        if (res != undefined){
          Object.keys(res).map((key) => {
            staff_list_by_number[res[key].number] = res[key].name;
          });
        }
        this.setState({
          staffs: res,
          staff_list_by_number
        });
      });
    let patientInfo = this.props.patientInfo;
    let insurance_list = [];
    if (patientInfo.insurance_type_list != null && patientInfo.insurance_type_list.length > 0){
      patientInfo.insurance_type_list.map((item) => {
        insurance_list.push({id:item.code, value: item.name})
      })
    }
    this.setState({
      insurance_list,
    });

    let path = "/app/api/v2/master/treat";
    let post_data = {
      general_id: 2
    };

    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          let treat_location = [{id:0,value:""}];
          if (res.treat_location != null && res.treat_location.length > 0){
            res.treat_location.map(item=>{
              treat_location.push({id:item.location_id, value: item.name})
            })
          }
          this.setState({
            all_data: res,
            classification_master:res.treat_classification,
            part_master:res.treat_part,
            position_master:this.treat_order_part_position_mode == 0 ? res.treat_position : undefined,
            side_master:res.treat_side,
            treat_location_master:treat_location,
            treat_department_definition:res.treat_department_definition,
            treat_part_definition:res.treat_part_definition,
            treat_item_unit:res.treat_item_unit,
            treat_set:res.treat_set,
            treat_item:res.treat_item,
            additions:res.additions,
            additions_check:{},
            additions_send_flag_check:{},
            treat_oxygen_list: res.treat_oxygen_list,
            is_loaded:true,
          });
          wrapper = document.getElementsByClassName('treatment-modal-wrapper')[0];
          if(wrapper != undefined) {
              wrapper.style['opacity'] = '0';
          }
        }
      })
      .catch(() => {
      });
    path = "/app/api/v2/order/treat/getItemCategories";
    post_data = {};
    let { data } = await axios.post(path, {params: post_data});
    if(data.length){
      let item_categories = this.state.item_categories;
      data.map((item, index)=>{
        item_categories[index + 1] = {id: item.item_category_id, value: item.name};
      });
      this.setState({
        item_categories,
      });
    }
    if (this.props.cache_index != null){
      this.loadFromCache(this.props.cache_index);
    }
    var detail_tbody = document.getElementsByClassName('set-detail-tbody')[0];
    if(wrapper != undefined) wrapper.style['opacity'] = 1;
    if (detail_tbody !== undefined) {
      let html_obj = document.getElementsByTagName("html")[0];
      let width = html_obj.offsetWidth;
      if(parseInt(width) < 1367){
        detail_tbody.style['height'] = '11vh';
      } else if(parseInt(width) < 1441){
        detail_tbody.style['height'] = '17vh';
      } else if(parseInt(width) < 1601){
        detail_tbody.style['height'] = '13vh';
      } else if(parseInt(width) < 1681){
        detail_tbody.style['height'] = '20vh';
      } else if(parseInt(width) > 1919){
        detail_tbody.style['height'] = '19vh';
      }

      $(document).ready(function(){
        $(window).resize(function(){
          let html_obj = document.getElementsByTagName("html")[0];
          let width = html_obj.offsetWidth;
          if(parseInt(width) < 1367){
            detail_tbody.style['height'] = '11vh';
          } else if(parseInt(width) < 1441){
            detail_tbody.style['height'] = '17vh';
          } else if(parseInt(width) < 1601){
            detail_tbody.style['height'] = '13vh';
          } else if(parseInt(width) < 1681){
            detail_tbody.style['height'] = '20vh';
          } else if(parseInt(width) > 1919){
            detail_tbody.style['height'] = '19vh';
          }
        });
      });

    }
  }
  //分類選択
  selectClassification = (id,name) => {
    let master_data = this.state.all_data;
    let practice_master = master_data.treat_practice;
    if (this.state.department_state == 1) {
      practice_master = this.state.treat_practice_master;
    }
    let filteredArray = practice_master.filter(item => {
      if (item.classification_id === id) return item;
    });
    this.change_flag = 1;
    this.setState({
      classification_id: id,
      classification_name: name,
      practice_master:filteredArray,
      practice_id: 0,
      practice_name: '',
      request_id: 0,
      request_name: '',
      request_master:[],
      part_id:0,
      part_name:'',
      position_id:0,
      position_name:'',
      // position_master:[],
      side_id:0,
      side_name:'',
    });
    // if (this.treat_order_part_position_mode != 0) {
    //   this.setState({position_master:[],});
    // }
  };
  
  // 行為名選択
  selectPractice = (id, name, enable_body_part, edit_flag=0, detail_length = 0) => {
    let master_data = this.state.all_data;
    let request_master = master_data.treat_request;
    let practice_master = master_data.treat_practice;
    let select_practice = practice_master.find(x=>x.practice_id == id);
    request_master = request_master.filter(item => {
      if (item.practice_id === id) return item;
    });
    let set_master = [
      { id: 0, value: "" },
    ];
    let deploy_set = null;
    let treat_set = this.state.treat_set;
    if(treat_set.length > 0){
      treat_set.map(item => {
        if (item.practice_id === id && item.classification_id === this.state.classification_id){
          if(deploy_set == null && edit_flag !== 1 && item.is_auto_deployment === 1){deploy_set = item;}
          let set_master_info = {id: item.number, value: item.treat_set_name};
          set_master.push(set_master_info);
        }
      });
    }
    let state_data = {};
    if(deploy_set != null){
      if (deploy_set.treat_dtail_item !== undefined && deploy_set.treat_dtail_item.length > 0) {
        deploy_set.treat_dtail_item.map(item=> {
          item.is_setted = 0;
        });
      }
      state_data['set_id'] = deploy_set.number;
      state_data['set_name'] = deploy_set.treat_set_name;
      state_data['set_data'] = deploy_set.treat_dtail_item;
      state_data['set_comment'] = deploy_set.free_comment;
    }
    this.change_flag = 1;
    let {set_detail} = this.state;
    set_detail.map((item, index)=> {
      if (item.is_setted == 0) {
        set_detail[index] = { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" };
      }
    })
    if (select_practice != undefined) {
      state_data['show_set_detail'] = select_practice.order_item_mode == 2 ? 1 :0;
      state_data['can_open'] = select_practice.order_item_mode == 0 ? 0 : 1;
      if (state_data['show_set_detail'] != 1) {
        if (deploy_set != null || select_practice.oxygen_treatment_flag == 1 || detail_length > 0) {
          state_data['show_set_detail'] = 1;
          state_data['can_open'] = 1;
        }
      }
    }
    state_data['select_practice'] = select_practice;
    state_data['set_master'] = set_master;
    state_data['set_detail'] = set_detail;
    state_data['practice_id'] = id;
    state_data['practice_name'] = name;
    state_data['request_master'] = request_master;
    state_data['request_id'] = 0;
    state_data['request_name'] = "";
    state_data['enable_body_part'] = enable_body_part;
    state_data['quantity_is_enabled'] = select_practice.quantity_is_enabled;
    state_data['unit'] = select_practice.unit;
    this.setState(state_data, ()=>{
      if(deploy_set != null){
        this.putSetDetail();
      }
    });
  };
  
  // 請求情報選択
  selectRequest = (id,name) => {
    this.change_flag = 1;
    this.setState({
      request_id: id,
      request_name: name,
    })
  };
  // 部位選択
  selectPart = (id,name) => {
    let master_data = this.state.all_data;
    let position_master = master_data.treat_position;
    position_master = position_master.filter(item => {
      if (item.part_id === id) return item;
    });
    this.change_flag = 1;
    this.setState({
      part_id: id,
      part_name: name,
      position_master,
      position_id: 0,
      position_name: '',
    })
  };
  // 位置選択
  selectPosition = (id,name) => {
    this.change_flag = 1;
    this.setState({
      position_id: id,
      position_name: name,
    })
  };
  // 左右選択
  selectSide = (id,name) => {
    this.change_flag = 1;
    this.setState({
      side_id: id,
      side_name: name,
    })
  };
  getDepartment = e => {
    if (this.state.department_state == 1){
      let classification_master = this.state.all_data.treat_classification;
      let treat_practice_master = this.state.all_data.treat_practice;
      let filtered_department_master = [];
      this.state.treat_department_definition.map(item => {
        if (item.department_id == e.target.id){
          filtered_department_master.push(item);
        }
      });
      let classfic_id_array = [];
      let practice_id_array = [];
      if(filtered_department_master.length > 0){
        filtered_department_master.map(item=>{
          if(!practice_id_array.includes(item.practice_id)){
            practice_id_array.push(item.practice_id);
          }
        });
      }
      treat_practice_master = [];
      this.state.all_data.treat_practice.map(item => {
        if (practice_id_array.includes(item.practice_id)){
          if (!classfic_id_array.includes(item.classification_id)){
            classfic_id_array.push(item.classification_id);
          }
          treat_practice_master.push(item);
        }
      });
      classification_master = [];
      this.state.all_data.treat_classification.map(item => {
        if (classfic_id_array.includes(item.classification_id)){
          classification_master.push(item);
        }
      });
      this.setState({
        display_department_id:e.target.id,
        department_name: e.target.value,
        classification_master,
        treat_practice_master,
        classification_id: 0,
        classification_name: '',
        practice_master:[],
        practice_id: 0,
        practice_name: '',
        request_id: 0,
        request_name: '',
        request_master:[],
        part_id:0,
        part_name:'',
        position_id:0,
        position_name:'',
        // position_master:[],
        side_id:0,
        side_name:'',
      })
    } else {
      this.setState({
        display_department_id:e.target.id,
        department_name: e.target.value,
      })
    }
  };
  handleInsuranceTypeChange = e =>{
    this.change_flag = 1;
    this.setState({
      insurance_id: parseInt(e.target.id),
      insurance_name: e.target.value
    })
  };
  getDate = value => {
    this.change_flag = 1;
    this.setState({
      collected_date: value,
    });
  };

  save = (done_flag=0) =>{
    if (!(this.state.number > 0) && !this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.REGISTER_PROXY)) return;
    if (this.state.number > 0 && !this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.EDIT_PROXY)) return;
    if (this.state.state !== undefined && this.state.state === 1 && done_flag === 0) return;
    
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
  
    if (done_flag === 1) {
      let modal_data = this.saveCache(0, false);
      this.setState({
        isOpenDoneModal: true,
        done_modal_data: modal_data
      });
      return;
    }
    this.setState({
      confirm_message:'登録しますか？',
      done_flag,
      confirm_action: "save_data"
    })
  }

  saveData = (done_flag=0) =>{
    this.confirmCancel();
    let result = this.saveCache(done_flag);
    if(result !== "success" && typeof result === "string"){
      this.setState({alert_messages: result});
      return;
    }
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  };
  getLocationSelect = (e) => {
    this.change_flag = 1;
    this.setState({
      location_id:parseInt(e.target.id),
      location_name:e.target.value,
    })
  };
  getComment = e => {
    if (e.target.value.length > 100) {
      this.setState({alert_messages: '処置フリーコメントは全角100文字以上入力できません。'});
      return;
    }
    this.change_flag = 1;
    this.setState({comment: e.target.value})
  };
  clearComment = () => {
    if (this.state.comment == undefined || this.state.comment == null || this.state.comment == "") return;
    this.setState({
      confirm_message:'処置フリーコメントを削除しますか？',
      deleteTarget:'comment',
      confirm_action: "comment_delete"
    })
  };
  setTimeExist = (e) =>{
    let start_time = this.state.start_time;
    if(parseInt(e.target.value) === 2){
      start_time = "";
    }
    this.change_flag = 1;
    this.setState({
      is_exist_time:e.target.value,
      start_time,
    })
  };
  setSearchType = (e) =>{
    this.setState({search_type:e.target.value})
  };
  getStartTime = value => {
    this.change_flag = 1;
    this.setState({start_time: value});
  };
  setDepartmentState = (e) => {
    let classification_master = this.state.all_data.treat_classification;
    let treat_practice_master = this.state.all_data.treat_practice;
    if (e.target.value == 1){
      let filtered_department_master = [];
      this.state.treat_department_definition.map(item => {
        if (item.department_id == this.state.display_department_id){
          filtered_department_master.push(item);
        }
      });
      let classfic_id_array = [];
      let practice_id_array = [];
      if(filtered_department_master.length > 0){
        filtered_department_master.map(item=>{
          if(!practice_id_array.includes(item.practice_id)){
            practice_id_array.push(item.practice_id);
          }
        });
      }
      treat_practice_master = [];
      this.state.all_data.treat_practice.map(item => {
        if (practice_id_array.includes(item.practice_id)){
          if (!classfic_id_array.includes(item.classification_id)){
            classfic_id_array.push(item.classification_id);
          }
          treat_practice_master.push(item);
        }
      });
      classification_master = [];
      this.state.all_data.treat_classification.map(item => {
        if (classfic_id_array.includes(item.classification_id)){
          classification_master.push(item);
        }
      });
    }
    this.setState({
      department_state:parseInt(e.target.value),
      classification_master,
      treat_practice_master,
      classification_id: 0,
      classification_name: '',
      practice_master:[],
      practice_id: 0,
      practice_name: '',
      request_id: 0,
      request_name: '',
      request_master:[],
      part_id:0,
      part_name:'',
      position_id:0,
      position_name:'',
      // position_master:[],
      side_id:0,
      side_name:'',
    })
  };
  getBarcode = e => {
    this.change_flag = 1;
    this.setState({barcode: e.target.value})
  };
  getRadio = (name, index) => {
    if (name === "check") {
      let set_detail = this.state.set_detail;
      if(set_detail[index]['item_id'] === 0){
        this.setState({alert_messages: "品名を選択してください。"});
        return;
      }
      if(set_detail[index]['check']){
        set_detail[index]['check'] = 0;
      } else {
        set_detail[index]['check'] = 1;
      }
      this.change_flag = 1;
      this.setState({set_detail});
    }
  };
  getCount =(index, e)=>{
    let value = e.target.value;
    let set_detail = this.state.set_detail;
    if(set_detail[index]['item_id'] === 0){
      this.setState({alert_messages: "品名を選択してください。"});
      return;
    }
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (value != "" && !RegExp.test(value)) {
      return;
    }
    if (!this.numberValidate(value)) return;
    set_detail[index]['count'] = value;
    this.change_flag = 1;
    this.setState({set_detail});
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
  getLot =(index, e)=>{
    let set_detail = this.state.set_detail;
    if(set_detail[index]['item_id'] === 0){
      this.setState({alert_messages: "品名を選択してください。"});
      return;
    }
    set_detail[index]['lot'] = e.target.value;
    this.change_flag = 1;
    this.setState({set_detail});
  }
  getBlurLot =(index, e)=>{
    let set_detail = this.state.set_detail;
    if (e.target.value == null || e.target.value == '') return;
    if(e.target.value.length <= this.treat_lot_length){
      set_detail[index]['lot'] = e.target.value;
      this.change_flag = 1;
      this.setState({set_detail});
    } else {
      this.setState({
        focus_target: e.target,
        alert_messages: `ロットは${this.treat_lot_length}文字以内で入力してください。`
      });
    }
  }
  closeSystemAlertModal () {
    this.setState({
      alert_messages: '',
    }, ()=>{
      if (this.state.focus_target != undefined) {
        this.state.focus_target.focus();
      }
    });
  }
  getBlurFreeComment =(index, e)=>{
    let set_detail = this.state.set_detail;
    if (e.target.value == null || e.target.value == '') return;
    if(e.target.value.length <= this.treat_freecoment_length){
      set_detail[index]['comment'] = e.target.value;
      this.change_flag = 1;
      this.setState({set_detail});
    } else {
      this.setState({
        focus_target: e.target,
        alert_messages: `フリーコメントは${this.treat_freecoment_length}文字以内で入力してください。`
      });
    }
  }
  getFreeComment =(index, e)=>{
    let set_detail = this.state.set_detail;
    if(set_detail[index]['item_id'] === 0){
      this.setState({alert_messages: "品名を選択してください。"});
      return;
    }
    if (set_detail[index].is_setted == 0) delete set_detail[index].is_setted;
    set_detail[index]['comment'] = e.target.value;
    this.change_flag = 1;
    this.setState({set_detail});
  }
  setItemName = (data) => {
    let set_detail = this.state.set_detail;
    set_detail[this.state.cur_index]['check'] = 1;
    set_detail[this.state.cur_index]['classfic'] = data.treat_item_category_id;
    set_detail[this.state.cur_index]['classfic_name'] = (this.state.item_categories.find(x => x.id === data.treat_item_category_id) != undefined) ? this.state.item_categories.find(x => x.id === data.treat_item_category_id).value : '';
    set_detail[this.state.cur_index]['item_id'] = data.item_id;
    set_detail[this.state.cur_index]['unit_id'] = 0;
    set_detail[this.state.cur_index]['item_name'] = data.name;
    set_detail[this.state.cur_index]['main_unit'] = data.main_unit;
    set_detail[this.state.cur_index]['receipt_key'] = data.receipt_key;
    if (set_detail[this.state.cur_index].is_setted == 0) delete set_detail[this.state.cur_index].is_setted;
    let detail_unit = this.state.detail_unit;
    if(this.state.treat_item_unit.length >0){
      this.state.treat_item_unit.map(item=>{
        if(item.item_id === data.item_id){
          detail_unit[this.state.cur_index].push({id:item.unit_id, value: item.name})
        }
      })
    }
    this.change_flag = 1;
    this.setState({set_detail, detail_unit});
    this.closeModal();
  };
  getUnitId =(index, e)=>{
    let set_detail = this.state.set_detail;
    set_detail[index]['unit_id'] = e.target.id;
    set_detail[index]['unit_name'] = e.target.value;
    this.change_flag = 1;
    if (set_detail[index].is_setted == 0) delete set_detail[index].is_setted;
    this.setState({set_detail});
  }
  getSelectSet =(e)=>{
    let treat_set = this.state.treat_set;
    let treat_dtail = treat_set.filter(item => {
      if (item.number === parseInt(e.target.id)){
        return item;
      }
    });
    let set_data = treat_dtail[0]['treat_dtail_item'];
    let set_comment = treat_dtail[0]['free_comment'];
    this.change_flag = 1;
    this.setState({
      set_id: e.target.id,
      set_name: e.target.value,
      set_data,
      set_comment,
    });
  }

  countSurface = () => {
    this.setState({
      isCountSurfaceModalOpen: true
    });
  }

  putSetDetail =()=>{
    let set_data = this.state.set_data;
    let set_detail = this.state.set_detail;
    if(set_data != null && Object.keys(set_data).length > 0){
      Object.keys(set_data).map((index)=>{
        let is_equal = set_detail[index]['item_id'] == set_data[index]['item_id'];
        set_detail[index]['number'] = set_data[index]['index'];
        set_detail[index]['check'] = 1;
        set_detail[index]['classfic'] = set_data[index]['item_category_id'];
        set_detail[index]['classfic_name'] = (this.state.item_categories.find(x => x.id === set_data[index]['item_category_id']) != undefined) ? this.state.item_categories.find(x => x.id === set_data[index]['item_category_id']).value : '';
        set_detail[index]['item_id'] = set_data[index]['item_id'];
        set_detail[index]['item_name'] = set_data[index]['name'];
        set_detail[index]['main_unit'] = set_data[index]['main_unit'];
        set_detail[index]['unit_id'] = set_data[index]['unit_id'];
        if (is_equal) {
          if (set_data[index]['count'] != null && set_data[index]['count'] != "") set_detail[index]['count'] = set_data[index]['count'];
          if (set_data[index]['lot'] != null && set_data[index]['lot'] != "") set_detail[index]['lot'] = set_data[index]['lot'];
          if (set_data[index]['comment'] != null && set_data[index]['comment'] != "") set_detail[index]['comment'] = set_data[index]['comment'];
        } else {
          set_detail[index]['count'] = set_data[index]['count'];
          set_detail[index]['lot'] = set_data[index]['lot'];
          set_detail[index]['comment'] = set_data[index]['comment'];
        }
        set_detail[index]['receipt_key'] = set_data[index]['receipt_key'];
        if (set_data[index].is_setted == 0) set_detail[index]['is_setted'] = 0;
      })
    }

    let treat_item_unit = this.state.treat_item_unit;
    let detail_unit = this.state.detail_unit;
    if(treat_item_unit !== undefined && treat_item_unit != null && treat_item_unit.length >0){
      Object.keys(set_detail).map((index) => {
        if (set_detail[index]['item_id'] !== 0) {
          treat_item_unit.map(item=>{
            if(item.item_id === set_detail[index]['item_id']){
              if(set_detail[index]['unit_id'] === item.unit_id){
                set_detail[index]['unit_name'] = item.name;
              }
              detail_unit[index].push({id:item.unit_id, value: item.name})
            }
          })
        }
      });
    }
    this.change_flag = 1;
    this.setState({
      set_detail,
      detail_unit,
      comment:this.state.set_comment,
      show_set_detail: set_data != null && Object.keys(set_data).length > 0 ? 1 : this.state.show_set_detail
    });
  }
  selectAllSetDetail =()=>{
    let set_detail = this.state.set_detail;
    let select_count = 0;
    Object.keys(this.state.set_detail).map((index) => {
      if(set_detail[index]['item_id'] !== 0){
        set_detail[index]['check'] = 1;
        select_count ++;
      }
    });
    if(select_count){
      this.change_flag = 1;
      this.setState({set_detail});
    } else {
      this.setState({alert_messages: "個別指示項目の品名を選択してください。"});
      return;
    }
  }
  unSelectAllSetDetail =()=>{
    let set_detail = this.state.set_detail;
    Object.keys(this.state.set_detail).map((index) => {
      set_detail[index]['check'] = 0;
    });
    this.change_flag = 1;
    this.setState({set_detail});
  }
  openItemSelectModal = value => {
    this.setState({
      isItemSelectModal: true,
      cur_index: value,
    })
  };
  openSetDetailModal = (value, practice_name) => {
    this.setState({
      isSetDetailModal: true,
      setDetailData: value,
      detail_view_practice: practice_name
    })
  };
  selectDoctor = () => {
    this.setState({isShowStaffList: true});
  };
  selectStaff = (staff) => {
    this.change_flag = 1;
    this.setState({
      treat_user_id:staff.number,
      treat_user_name:staff.name,
    });
    this.closeDoctorSelectModal();
  };

  closeDoctorSelectModal = () => {
    this.setState({
      isShowStaffList:false
    });
  };
  clearUser = () => {
    if (this.state.treat_user_name == "") return;
    this.setState({
      deleteTarget:'user',
      confirm_message:'実施（予定）者を削除しますか？',
      confirm_action:"user_delete"
    })
  };
  confirmDelete = (target) => {
    this.confirmCancel();
    switch(target){
      case 'user':
        this.change_flag = 1;
        this.setState({
          treat_user_id:0,
          treat_user_name:'',
        });
        break;
      case 'comment':
        this.change_flag = 1;
        this.setState({comment: ""})
        break;
    }
  }

  openPracticeSelectModal = () => {
    this.setState({
      isPracticeSelectModal:true,
    })
  };

  closeModal = () => {
    this.setState({
      isPracticeSelectModal:false,
      isItemSelectModal: false,
      isSetDetailModal: false,
      isOpenOxygenModal: false,
      isCountSurfaceModalOpen: false,
      isOpenDoneModal: false,
    });
  };

  setPractice=(data)=>{
    this.closeModal();
    let classific_name = this.getClassificationName(data['classification_id']);
    this.selectClassification(data['classification_id'], classific_name);
    this.selectPractice(data['practice_id'], data['name'], data['enable_body_part']);
  };
  
  getClassificationName = (classification_id) => {
    if (classification_id == undefined || classification_id == null || classification_id == '') return '';
    let all_data = this.state.all_data;
    let classific_name = '';
    let classfic_data = all_data.treat_classification.find(x=>x.classification_id == classification_id);
    if (classfic_data == undefined) return '';
    classific_name = classfic_data.name;
    if (classific_name == undefined || classific_name == null) return '';
    return classific_name;
  }

  getItemCategory =(index, e)=>{
    let set_detail = this.state.set_detail;
    set_detail[index]['classfic'] = e.target.id;
    this.change_flag = 1;
    this.setState({set_detail});
  }

  getAdditions = (name, number) => {
    let check_status = {};
    if (name == 'additions') {
      this.change_flag = 1;
      check_status = this.state.additions_check;
      check_status[number] = !check_status[number];
      this.setState({additions_check:check_status});
    }
  }

  getAdditionsSendFlag = (name, number) => {
    let check_status = {};
    if (name == 'additions_sending_flag') {
      this.change_flag = 1;
      check_status = this.state.additions_send_flag_check;
      check_status[number] = !check_status[number];
      this.setState({additions_send_flag_check:check_status});
    }
  }

  setItemDetails =(data)=>{
    this.change_flag = 1;
    this.setState({item_details:data});
  }

  handleEdit = (e, index) => {
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
        .getElementById("result-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("result-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });

      let x_val = e.clientX - $('#first-view-modal').offset().left;
      let y_val = e.clientY + window.pageYOffset - 80;
      this.setState({
        contextMenu: {
          visible: true,
          x: x_val,
          y: y_val,
        },
        index,
      });
    }
  };
  handleClick = (e, index) => {
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
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextItemMenu: { visible: false }
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });

      let x_val = e.clientX - $('#first-view-modal').offset().left;
      let y_val = e.clientY + window.pageYOffset - 50;
      this.setState({
        contextItemMenu: {
          visible: true,
          x: x_val,
          y: y_val,
        },
        index,
      });
    }
  };

  contextMenuAction = (type, index) => {
    let detail_json_array = this.state.detail_json_array;
    if(type === 'edit'){
      let cur_edit_data = detail_json_array[index];
      if (this.treat_order_is_enable_request == 0 && cur_edit_data.request_name != undefined && cur_edit_data.request_name != null && cur_edit_data.request_name != "") {
        this.setState({alert_messages: "請求情報を使用しない設定のため、変更できません"});
        return;
      }
      this.setState({
        department_state:0,
        display_department_id:cur_edit_data.department_id,
        classification_master: this.state.all_data.treat_classification,
      });
      this.selectClassification(cur_edit_data.classification_id, cur_edit_data.classification_name);
      this.selectPractice(cur_edit_data.practice_id, cur_edit_data.practice_name, cur_edit_data.enable_body_part, cur_edit_data.treat_detail_item.length);
      this.selectRequest(cur_edit_data.request_id, cur_edit_data.request_name);
      this.selectPart(cur_edit_data.part_id, cur_edit_data.part_name);
      this.selectPosition(cur_edit_data.position_id, cur_edit_data.position_name);
      this.selectSide(cur_edit_data.side_id, cur_edit_data.side_name);
      let set_detail = this.state.set_detail;
      if(cur_edit_data.treat_detail_item.length > 0){
        cur_edit_data.treat_detail_item.map((item, index)=>{
          let set_detail_info = {};
          Object.keys(item).map(idx=>{
            set_detail_info[idx] = item[idx];
          });
          set_detail[index] = set_detail_info;
        });
      }
      this.setState({
        result_edit:true,
        comment:cur_edit_data.comment,
        barcode:cur_edit_data.barcode,
        treat_user_id:cur_edit_data.treat_user_id,
        treat_user_name:cur_edit_data.treat_user_name,
        set_detail,
        set_detail_index:index,
        set_detail_order_number:cur_edit_data.order_number !== undefined ? cur_edit_data.order_number : 0,
        total_surface: cur_edit_data.total_surface !== undefined && cur_edit_data.total_surface != null ? cur_edit_data.total_surface : undefined,
        total_amount: cur_edit_data.total_amount !== undefined && cur_edit_data.total_amount != null ? cur_edit_data.total_amount : undefined,
        surface_data: cur_edit_data.surface_data !== undefined && cur_edit_data.surface_data != null ? cur_edit_data.surface_data : undefined,
        quantity: cur_edit_data.quantity,
      });
    } else if (type == 'delete') {
      delete detail_json_array[index];
      this.setState({
        detail_json_array,
      });
    } else if (type == 'item_add') {
      let {set_detail} = this.state;
      set_detail.push({ number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" });
      this.setState({set_detail});
    } else if (type == 'item_delete') {
      let {set_detail} = this.state;
      set_detail.splice(index, 1);
      this.setState({set_detail});
    } else if (type === "oxygen_delete") {
      this.setState({
        confirm_message: "酸素量の時間・流量・濃度を破棄して通常の数量に変更しますか？",
        confirm_alert_title: "計算破棄確認",
        confirm_action: "oxygen_delete",
        oxygen_del_idx: index,
      })
    }
    this.change_flag = 1;
  };

  changeResultEdit =(act)=>{
    let detail_array = this.state.detail_json_array;
    if(act === "save"){
      if (this.state.classification_name == undefined || this.state.classification_name == "") {
          this.setState({alert_messages: '分類を選択してください。'});
          return;
      }
      if (this.state.practice_name == undefined || this.state.practice_name == "") {
          this.setState({alert_messages: '行為名を選択してください。'});
          return;
      }
      
      if (this.state.comment !== undefined && this.state.comment !== "") {
        if (checkSMPByUnicode(this.state.comment)) {
          this.setState({alert_messages: '処置フリーコメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください'})
          return;
        }
      }
      let treat_detail_item = [];
      let error_str = '';
      Object.keys(this.state.set_detail).map((index) => {
          if (this.state.set_detail[index]['check'] === 1) {
              if(this.state.set_detail[index]['count'] != null && this.state.set_detail[index]['count'] !== "" && (this.state.set_detail[index]['count'] < 0)){
                  error_str = '個別指示項目の数量を正確に入力してください。';
                  return;
              }
              if(this.state.set_detail[index]['lot'] != null && this.state.set_detail[index]['lot'] !== ""){
                  if(!this.state.set_detail[index]['lot'].match(/^[A-Za-z0-9]*$/)){
                      error_str = '個別指示項目のロットを半角英数で入力してください。';
                      return;
                  }
              }
              if(this.state.set_detail[index]['item_name'] != null && this.state.set_detail[index]['item_name'] !== ""){
                  if(this.state.set_detail[index]['count'] == null || this.state.set_detail[index]['count'] === ""){
                      error_str = '数量を入力してください。';
                      return;
                  }
              }
              if(this.state.set_detail[index]['item_name'] != null && this.state.set_detail[index]['item_name'] !== ""){
                if(checkSMPByUnicode(this.state.set_detail[index]['lot'])){
                    error_str = 'ロットに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください';
                    return;
                }
              }
              if(this.state.set_detail[index]['item_name'] != null && this.state.set_detail[index]['item_name'] !== ""){
                  if(checkSMPByUnicode(this.state.set_detail[index]['comment'])){
                      error_str = 'コメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください';
                      return;
                  }
              }
              let set_detail_info = {};
              Object.keys(this.state.set_detail[index]).map(idx=>{
                  set_detail_info[idx] = this.state.set_detail[index][idx];
              });
              set_detail_info['set_name'] = this.state.set_name;
              treat_detail_item.push(set_detail_info);
          }
      });
      if(error_str != ''){
          this.setState({alert_messages: error_str});
          return;
      }
      let detail_json = {
        number: 0,
        order_number: detail_array[this.state.set_detail_index].order_number,
        treat_detail_id: detail_array.length + 1,
        department_id:this.state.display_department_id,
        department_name:this.state.department_name != undefined && this.state.department_name != null ? this.state.department_name : '',
        classification_id:this.state.classification_id,
        classification_name:this.state.classification_name,
        practice_id:this.state.practice_id,
        practice_name:this.state.practice_name,
        enable_body_part: this.state.enable_body_part,
        request_id:this.state.request_id,
        request_name:this.state.request_name,
        part_id:this.state.part_id,
        part_name:this.state.part_name,
        position_id:this.state.position_id,
        position_name:this.state.position_name,
        side_id:this.state.side_id,
        side_name:this.state.side_name,
        comment:this.state.comment,
        barcode:this.state.barcode,
        treat_user_id:this.state.treat_user_id,
        treat_user_name:this.state.treat_user_name,
        set_id:this.state.set_id,
        set_name:this.state.set_name,
        treat_detail_item,
        quantity: this.state.quantity,
        quantity_is_enabled: this.state.quantity_is_enabled,
        unit: this.state.unit,
      };
  
      if (this.state.total_surface !== undefined) {
        detail_json.total_surface = this.state.total_surface;
        detail_json.surface_data = this.state.surface_data;
      }
      if (this.state.total_amount !== undefined) {
        detail_json.total_amount = this.state.total_amount;
      }
      detail_array[this.state.set_detail_index] = detail_json;
      this.change_flag = 1;
      this.setState({
        detail_array,
        result_edit:false,
      });
    } else {
      this.setState({
        result_edit:false,
      });
    }
    this.initEditSetData();
  }

  initEditSetData =()=>{
    this.setState({
      comment:'',
      barcode:'',
      treat_user_id:0,
      treat_user_name:'',
      set_id:0,
      set_name:'',
      set_detail:[
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
        { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "" },
      ],
      detail_unit: [
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },],
        [{ id: 0, value: "" },]
      ],
      total_surface: undefined,
      total_amount: undefined,
      surface_data: undefined,
      quantity: undefined,
      unit: undefined,
      quantity_is_enabled: undefined,
    });
    this.selectClassification(0, '');
  }

  viewItemTable =()=>{
    $('#set_item_detail_area').toggle();
  }
  
  openOxygenModal = () => {
    if (this.state.practice_name == null || this.state.practice_name === ""){
      this.setState({alert_messages: "行為名を選択してください。"});
      return;
    }
    let {set_detail} = this.state;
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
      oxygen_data,
    });
  };
  
  oxygenOk = (key_data, total_amount) => {
    this.closeModal();
    this.change_flag = 1;
    let {set_detail, item_categories} = this.state;
    if (key_data !== undefined && Object.keys(key_data).length > 0) {
      Object.keys(key_data).map(index=> {
        let item = key_data[index];
        if (item[0].oxygen_amount > 0) {
          let oxygen_index = set_detail.findIndex(x=>x.item_id == index);
          if (oxygen_index == -1)
            oxygen_index = set_detail.findIndex(x=>x.item_id == "" && x.item_name == "" && x.count == "" && x.lot == "" && x.comment == "");
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
            let new_insert_item = { number: 0, check: 1, classfic: item[0].category_id, classfic_name, item_id: item[0].oxygen_source_code, item_name: item[0].oxygen_source_name, receipt_key:item[0].oxygen_source_code,
              count: item[0].oxygen_amount, unit_id: 0, unit_name: "", main_unit: item[0].main_unit, lot: "", comment: '', oxygen_amount: item[0].oxygen_amount, oxygen_data: JSON.stringify(item) }
            set_detail.push(new_insert_item);
          }
        }
      })
      this.setState({set_detail, total_amount});
    }
  };
  
  surfaceOk = (total_surface, data) => {
    this.closeModal();
    this.change_flag = 1;
    let practice_master = this.state.practice_master;
    let select_practice = practice_master.find(x=>x.practice_id == this.state.practice_id);
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
        this.selectRequest(selected_request_id, selected_request_name);
      }
    }
    this.setState({total_surface, surface_data: data});
  };
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_action: "",
      confirm_alert_title: "",
      oxygen_menu_idx: -1
    });
  }
  componentDidUpdate() {
    harukaValidate('karte', 'treatment', 'output', this.state, 'background');
  }
  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('karte', 'treatment', 'output', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  closeValidateAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  
  confirmDeleteCache=()=>{
      this.props.closeModal();
  };
  
  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_action == "oxygen_delete") {
      this.confirmCancel();
      let {set_detail} = this.state;
      if (this.state.oxygen_menu_idx >= 0) {
        delete set_detail[this.state.oxygen_menu_idx].oxygen_data;
        this.setState({set_detail, oxygen_menu_idx: -1});
      }
    } else if (this.state.confirm_action == "close") {
      this.props.closeModal();
    } else if (this.state.confirm_action == "save_data") {
      this.saveData(this.state.done_flag);
    } else if (this.state.confirm_action == "user_delete" || this.state.confirm_action == "comment_delete") {
      this.confirmDelete(this.state.deleteTarget);
    } else if (this.state.confirm_action == "surface_delete") {
      this.setState({
        total_surface: undefined,
        surface_data: undefined
      })
    }
  }

  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_action:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.confirmDeleteCache();
    }
  }
  
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
      let x_val = e.clientX - $('#first-view-modal').offset().left;
      let y_val = e.clientY + window.pageYOffset - 50;
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
  
  clearSurface = () => {
    if (this.state.total_surface == undefined || this.state.total_surface == null || this.state.total_surface == "") return;
    this.change_flag = 1;
    this.setState({
      confirm_message:'面積を削除しますか？',
      confirm_alert_title:'削除確認',
      confirm_action: "surface_delete"
    })
  };
  openViewSurfaceModal = (total_surface, surface_data) => {
    this.setState({
      isOpeViewSurfaceModal: true,
      view_surface_data: surface_data,
      view_total_surface: total_surface
    });
  }
  doneCheck = () => {
    let result = "";
    let master_data = this.state.all_data;
    if (master_data === undefined || master_data == null) return "";
    if (this.state.detail_json_array !== undefined && this.state.detail_json_array != null && this.state.detail_json_array.length > 0) {
      this.state.detail_json_array.map(item=>{
        let total_amount = 0;
        if (item.treat_detail_item !== undefined && item.treat_detail_item.length > 0) {
          item.treat_detail_item.map(sub_item=> {
            if (sub_item.oxygen_amount !== undefined && sub_item.oxygen_amount > 0) {
              total_amount += sub_item.oxygen_amount;
            }
          })
        }
        if (total_amount > 0 && total_amount != item.total_amount) result = "供給源が未選択の酸素量があります";
      });
    }
    if (!this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.DONE_OREDER)) result = "実施権限がありません。";
    return result;
  }
  openTable = () => {
    this.setState({show_set_detail: 1});
  }
  closeTable = () => {
    this.setState({show_set_detail: 0});
  }
  
  saveCheck = () => {
    let result = "";
    if (!(this.state.number > 0) && !this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.REGISTER_PROXY)) result = "登録権限がありません。";
    if (this.state.number > 0 && !this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.TREATORDER, this.context.AUTHS.EDIT_PROXY)) result = "編集権限がありません。";
    return result;
  }
  
  getQuantity = (e) => {
    let value = e.target.value;
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(value)) {
      return;
    }
    if (!this.numberValidate(value)) return;
    this.setState({quantity: value});
  }
  numberValidate = (value) => {
    if (value == "") return true;
    value = value.toString();
    if (value.length > this.amount_max_length) return false;
    let split_val = value.split(".");
    if (split_val[0].length > this.integer_length) return false;
    if (split_val.length > 1) {
      if (split_val[1].length > this.decimal_length) return false;
    }
    return true;
  }
  
  doneOk = (done_data) => {
    this.closeModal();
    if (done_data === undefined || done_data == null) return;
    let detail_data = done_data.detail;
    if (detail_data === undefined || detail_data == null) return;
    this.setState({
      detail_json_array: detail_data,
      confirm_message:'登録しますか？',
      done_flag: 1,
      confirm_action: "save_data"
    });
  }

  render() {
    let {classification_master, practice_master, request_master, part_master, position_master, side_master, detail_json_array} = this.state;
    let cost_width = "40rem";
    if (this.treat_order_is_enable_request == 1) {
      this.state.detail_json_array.map(item=>{
        if (item.request_name != undefined && item.request_name != null && item.request_name != "")
          cost_width = "30rem";
      });
    }
    let practice_width = "25%";
    if (this.treat_order_part_position_mode == 0 && this.treat_order_is_enable_request == 0) {
      practice_width = "60%";
    } else if(this.treat_order_part_position_mode != 0 && this.treat_order_is_enable_request == 0) {
      practice_width = "45%";
    } else if(this.treat_order_part_position_mode == 0 && this.treat_order_is_enable_request != 0) {
      practice_width = "40%";
    }
    let done_tooltip = this.doneCheck();
    let save_tooltip = this.saveCheck();
  
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal outpatient-modal first-view-modal home-treatment-modal">
          <Modal.Header><Modal.Title>在宅処置</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
            {this.state.is_loaded ? (
              <Wrapper className="treatment-modal-wrapper">
                <div className="header-first">
                  <div className="treat-date">処置日</div>
                  <div className="date-select no-border">
                    <DatePicker
                      locale="ja"
                      selected={this.state.collected_date}
                      onChange={this.getDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className={this.state.datefocus ? "readline" : ""}
                      id="collected_date_id"
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                  <div className="ml-1 select-exit-time">
                    {Object.keys(this.state.exist_time).map((index)=>{
                      return (
                        <>
                          <Radiobox
                            label={this.state.exist_time[index]}
                            value={index}
                            getUsage={this.setTimeExist.bind(this)}
                            checked={this.state.is_exist_time == index ? true : false}
                            name={`time_request`}
                          />
                        </>
                      );
                    })}
                  </div>
                  <div className="select-box">
                    <SelectorWithLabel
                      options={this.state.insurance_list}
                      title="保険選択"
                      getSelect={this.handleInsuranceTypeChange}
                      departmentEditCode={this.state.insurance_id}
                      id="insurance_id_id"
                    />
                  </div>
                  <div className="select-box">
                    <SelectorWithLabel
                      options={this.state.treat_location_master}
                      title="実施場所"
                      getSelect={this.getLocationSelect}
                      departmentEditCode={this.state.location_id}
                      id="location_id_id"
                    />
                  </div>
                  {this.state.is_exist_time == 1 && (
                    <div className="datepicker flex ml-1">
                      <label className="mr-2">処置時刻</label>
                      <DatePicker
                        locale="ja"
                        selected={this.state.start_time}
                        onChange={this.getStartTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        timeCaption="時間"
                        timeFormat="HH:mm"
                        id="start_time_id"
                      />
                    </div>
                  )}
                </div>
                <div className="search-type mb-1">
                  {Object.keys(this.state.search_type_array).map((index)=>{
                    return (
                      <>
                        <Radiobox
                          label={this.state.search_type_array[index]}
                          value={index}
                          getUsage={this.setSearchType.bind(this)}
                          checked={this.state.search_type == index ? true : false}
                          name={`search_type`}
                        />
                      </>
                    );
                  })}
                </div>
                <div className="flex">
                  <div className="flex inline-radio">
                    <RadioButton
                      id="male"
                      value={0}
                      label="全体共通処置"
                      name="gender"
                      getUsage={this.setDepartmentState}
                      checked={this.state.department_state === 0}
                    />
                    <RadioButton
                      id="femaie"
                      value={1}
                      label="科別処置"
                      name="gender"
                      getUsage={this.setDepartmentState}
                      checked={this.state.department_state === 1}
                    />
                  </div>
                  <div className="select-box">
                    <SelectorWithLabel
                      title="表示対象科"
                      options={this.departmentOptions}
                      getSelect={this.getDepartment}
                      id="display_department_id_id"
                      departmentEditCode={this.state.display_department_id}
                    />
                  </div>
                  <Button className="ml-2 practice-search-btn" onClick={this.openPracticeSelectModal.bind(this)}>行為名検索</Button>
                </div>
                <div className="flex work-list mt5">
                  <div className="area-1" style={{width:"15%"}}>
                    <div className="title">分類</div>
                    <div className="content">
                      {classification_master !== undefined && classification_master.length>0 && (
                        classification_master.map(item => {
                          return (
                            <p className={item.classification_id===this.state.classification_id?"selected":""}
                               onClick = {this.selectClassification.bind(this, item.classification_id,item.name)}
                               key = {item.id}>{item.name}</p>
                          )
                        })
                      )}
                    </div>
                  </div>
                  <div className="area-1" style={{width:practice_width}}>
                    <div className="title">行為名</div>
                    <div className="content">
                      {practice_master !== undefined && practice_master.length>0 && (
                        practice_master.map(item => {
                          return (
                            <p className={item.practice_id===this.state.practice_id?"selected":""}
                               onClick = {this.selectPractice.bind(this, item.practice_id, item.name, item.enable_body_part)} key = {item.id}
                            >{item.name}</p>
                          )
                        })
                      )}
                    </div>
                  </div>
                  {this.treat_order_is_enable_request != 0 && (
                    <div className="area-1" style={{width:"20%"}}>
                      <div className="title">請求情報</div>
                      <div className="content">
                        {request_master !== undefined && request_master.length>0 && (
                          request_master.map(item => {
                            return (
                              <p className={item.request_id===this.state.request_id?"selected":""}
                                 onClick = {this.selectRequest.bind(this, item.request_id, item.name)} key = {item.id}
                              >{item.name}</p>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}
                  {this.treat_order_part_position_mode != 0 && (
                    <div className="area-1 w5" style={{width:"15%"}}>
                      <div className="title">部位</div>
                      <div className="content">
                        {this.state.enable_body_part != 0 && part_master !== undefined && part_master.length>0 && (
                          part_master.map(item => {
                            return (
                              <p className={item.part_id===this.state.part_id?"selected":""}
                                 onClick = {this.selectPart.bind(this, item.part_id, item.name)} key = {item.id}
                              >{item.name}</p>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}
                  <div className="area-1 w15" style={{width:"15%"}}>
                    <div className="title">{this.treat_order_part_position_mode == 0 ? "部位" : "位置"}</div>
                    <div className="content">
                      {this.treat_order_part_position_mode == 0 ? (
                        <>
                          {this.state.enable_body_part != 0 && part_master !== undefined && part_master.length>0 && (
                            part_master.map(item => {
                              return (
                                <>
                                  {this.state.enable_body_part != 0 && position_master !== undefined && position_master.length>0 && (
                                    position_master.map(position_item => {
                                      if (position_item.part_id == item.part_id) {
                                        return (
                                          <p className={position_item.position_id===this.state.position_id?"selected":""}
                                             onClick = {this.selectPosition.bind(this, position_item.position_id, position_item.name)} key = {position_item.id}
                                          >{position_item.name}</p>
                                        )
                                      }
                                    })
                                  )}
                                </>
                              )
                            })
                          )}
                        </>
                      ):(
                        <>
                          {this.state.enable_body_part != 0 && position_master !== undefined && position_master.length>0 && (
                            position_master.map(item => {
                              return (
                                <p className={item.position_id===this.state.position_id?"selected":""}
                                   onClick = {this.selectPosition.bind(this, item.position_id, item.name)} key = {item.id}
                                >{item.name}</p>
                              )
                            })
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="area-1 w10" style={{width:"10%", marginRight:0}}>
                    <div className="title">左右</div>
                    <div className="content">
                      {this.state.enable_body_part != 0 && side_master !== undefined && side_master.length>0 && (
                        side_master.map(item => {
                          return (
                            <p className={item.side_id===this.state.side_id?"selected":""}
                               onClick = {this.selectSide.bind(this, item.side_id, item.name)} key = {item.id}
                            >{item.name}</p>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex set-done mt5">
                  <div className="d-flex" style={{width:"calc(100% - 21.5rem"}}>
                    <div className="select-box">
                      <SelectorWithLabel
                        options={this.state.set_master}
                        title="セット"
                        getSelect={this.getSelectSet.bind(this)}
                        departmentEditCode={this.state.set_id}
                        id="set_id_id"
                      />
                    </div>
                    <Button type="common" onClick={this.putSetDetail.bind(this)} className="ml-5 set-change-btn">セット指示変更</Button>
                    <div className="flex">
                      <div className={`label text-right`} style={{width:"13rem", lineHeight:"1.875rem"}}>実施（予定）者</div>
                      <div className='state-name remove-x-input' onClick={this.selectDoctor.bind(this)}>
                        <InputWithLabel
                          label=""
                          type="text"
                          placeholder={'クリックで選択'}
                          id="treat_user_name_id"
                          diseaseEditData={this.state.treat_user_name}
                          isDisabled={true}
                        />
                      </div>
                      <Button className='clear-button' onClick={this.clearUser.bind(this)}>C</Button>
                    </div>
                  </div>
                  {this.state.select_practice !== undefined && this.state.select_practice.quantity_is_enabled == 1 && (
                    <div className="quantity-unit d-flex text-right">
                      <div className="quantity">
                        <InputWithLabel
                          label="数量"
                          type="text"
                          getInputText={this.getQuantity.bind(this)}
                          diseaseEditData={this.state.quantity}
                        />
                      </div>
                      {this.state.select_practice.unit != null && this.state.select_practice.unit !== "" && (
                        <label className="label-title ml-2">{this.state.select_practice.unit}</label>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt5 flex">
                  <div style={{fontSize:"1.125rem", lineHeight: "1.875rem"}}>個別指示項目</div>
                  <Button type="common" className={`ml-2 open-close-button ${this.state.can_open == 0 ? "disable-btn":""}`} isDisabled={this.state.can_open == 0} onClick={this.openTable.bind(this)}>∨開く</Button>
                  <Button type="common" className={`ml-2 open-close-button ${this.state.can_open == 0 ? "disable-btn":""}`} isDisabled={this.state.can_open == 0} onClick={this.closeTable.bind(this)}>∧たたむ</Button>
                  <div style={{lineHeight: "1.875rem"}}>【実施時間の入力方法】整数部に時間を小数部に分を入力してください。例⇒30分＝0.3、１時間50分＝1.5</div>
                </div>

                <div className="flex mt5 btn-area">
                  <Button onClick={this.selectAllSetDetail.bind(this)}>全選択</Button>
                  <Button onClick={this.unSelectAllSetDetail.bind(this)}>全解除</Button>
                  {this.state.select_practice !== undefined && this.state.select_practice.oxygen_treatment_flag == 1 && this.treat_oxygen_list !== undefined && this.treat_oxygen_list.length > 0 ? (
                    <Button type="common" onClick={this.openOxygenModal.bind(this)} className="ml-1">酸素量計算</Button>
                  ):(
                    <Button type="common" isDisabled={true} className="disable-btn ml-1">酸素量計算</Button>
                  )}
                  <Button type="common" onClick={this.countSurface.bind(this)} className="ml-1">面積計算</Button>
                  <div className="ml-3 border p-1 text-right" style={{width: "5rem", height: "1.875rem"}}>{this.state.total_surface !== undefined ? this.state.total_surface: "　"}</div>
                  <div className="ml-1" style={{lineHeight: "1.875rem"}}>㎠</div>
                  <Button className="ml-2 clear-button" onClick={this.clearSurface.bind(this)}>C</Button>
                  {this.treatment_barcode == "ON" && (
                    <div className="flex ml100 barcode-area">
                      <InputWithLabel
                        label="バーコード"
                        type="text"
                        getInputText={this.getBarcode.bind(this)}
                        diseaseEditData={this.state.barcode}
                        id="barcode_id"
                      />
                    </div>
                  )}
                </div>
                {this.state.show_set_detail != 0 && (
                <div className={'set-detail-area'}>
                  <table className="table-scroll table table-bordered mt5" id="code-table">
                    <thead>
                    <tr className={'table-menu'}>
                      <td style={{width:"1.875rem"}}/>
                      <td className="text-center" style={{width:"80px"}}>チェック</td>
                      <td className="text-center" style={{width:"9.375rem"}}>分類</td>
                      <td className="text-center" style={{width:"60px"}}>検索</td>
                      <td className="text-center">品名/名称</td>
                      <td className="text-center" style={{width:155}}>数量</td>
                      <td className="text-center" style={{width:"105px"}}>単位</td>
                      <td className="text-center" style={{width:"106px"}}>ロット</td>
                      <td className="text-center" style={{width:"150px"}}>フリーコメント</td>
                    </tr>
                    </thead>
                    <tbody className='set-detail-tbody'>
                    {this.state.set_detail.map((item,index)=>{
                      return (
                        <tr key={item} onContextMenu={e => this.handleClick(e, index)}>
                          <td className="text-center td-no" style={{width:"1.875rem"}}>{index + 1}</td>
                          <td className="td-check" style={{width:"80px"}}>
                            <Checkbox
                              label=""
                              number={index}
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.set_detail[index]['check']}
                              name="check"
                              isDisabled={this.state.set_detail[index]['item_id'] == 0}
                            />
                          </td>
                          <td className="text-center select-class" style={{width:"9.375rem"}}>
                            {this.state.set_detail[index]['item_id'] !== 0 ? (
                              <div className="text-center">{this.state.set_detail[index]['classfic_name']}</div>
                            ) : (
                              <SelectorWithLabel
                                title=""
                                options={this.state.item_categories}
                                getSelect={this.getItemCategory.bind(this, index)}
                                departmentEditCode={this.state.set_detail[index]['classfic']}
                              />
                            )}
                          </td>
                          <td className="text-center" style={{width:"60px"}}>
                            <div className="w-100">
                              <div className="div-button" onClick={this.openItemSelectModal.bind(this,index)}>検索</div>
                            </div>
                          </td>
                          <td className="text-center">{this.state.set_detail[index]['item_name']}</td>
                          <td className="text-center no-border-div input-num" style={{width:155}}>
                            {this.state.select_practice != undefined && this.state.select_practice.oxygen_treatment_flag == 1 && this.treat_oxygen_list !== undefined && this.treat_oxygen_list.indexOf(parseInt(this.state.set_detail[index]['item_id'])) > -1 ? (
                              <OverlayTrigger overlay={renderTooltip("酸素量は計算ボタンから編集してください")}>
                                <div className="disable-input" onContextMenu={e => this.handleOxygenClick(e, index)}>
                                  <InputWithLabel
                                    diseaseEditData={this.state.set_detail[index]['count']}
                                    getInputText={this.getCount.bind(this, index)}
                                    isDisabled={true}
                                  />
                                </div>
                              </OverlayTrigger>
                            ):(
                              <InputWithLabel
                                diseaseEditData={this.state.set_detail[index]['count']}
                                getInputText={this.getCount.bind(this, index)}
                                isDisabled={this.state.set_detail[index]['item_id'] == 0}
                              />
                            )}
                          </td>
                          <td className="text-center select-unit" style={{width:"105px"}}>
                            {this.state.detail_unit[index] !== undefined && Object.keys(this.state.detail_unit[index]).length > 1 ? (
                              <SelectorWithLabel
                                options={this.state.detail_unit[index]}
                                title=""
                                getSelect={this.getUnitId.bind(this, index)}
                                departmentEditCode={this.state.set_detail[index]['unit_id']}
                              />
                            ) : (
                              <div className="text-center">{this.state.set_detail[index]['main_unit']}</div>
                            )}
                          </td>
                          <td style={{width:"105px"}}>
                            <InputWithLabel
                              label=""
                              type="text"
                              getInputText={this.getLot.bind(this, index)}
                              diseaseEditData={this.state.set_detail[index]['lot']}
                              isDisabled={this.state.set_detail[index]['item_id'] == 0}
                              onBlur={this.getBlurLot.bind(this,index)}
                            />
                          </td>
                          <td style={{width:"150px"}}>
                            <InputWithLabel
                              label=""
                              type="text"
                              getInputText={this.getFreeComment.bind(this, index)}
                              diseaseEditData={this.state.set_detail[index]['comment']}
                              className="detail-comment"
                              isDisabled={this.state.set_detail[index]['item_id'] == 0}
                              onBlur={this.getBlurFreeComment.bind(this,index)}
                            />
                          </td>
                        </tr>
                      )
                    })}
                    </tbody>
                  </table>
                </div>
                )}
                <div className="flex comment-area mt5">
                  <label className="input-title">処置フリーコメント（全角100文字まで）</label>
                  <textarea
                    onChange={this.getComment.bind(this)}
                    value={this.state.comment}
                    id="comment_id"
                  />
                  <Button className="clear-button" onClick={this.clearComment.bind(this)}>C</Button>
                </div>

                <div className="flex mt5 last-part" style={{textAlign:"center"}}>
                  <div style={{width:"100%"}}>
                    {this.state.result_edit === false ? (
                      <Button onClick={this.addDetail} className="ml-2 w-25">↓ 追加</Button>
                    ):(
                      <>
                        <Button onClick={this.changeResultEdit.bind(this, 'save')}  className="ml-2 w-25">変更確定</Button>
                        <Button onClick={this.changeResultEdit.bind(this, 'stop')} className="ml-2 w-25">変更中止</Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="set-table">
                  <table className="table-scroll table table-bordered" id = "result-table">
                    <thead>
                    <tr className={'table-menu'}>
                      <td>セット名</td>
                      <td style={{width:"6rem"}}>個別指示</td>
                      <td style={{width:cost_width}}>行為名</td>
                      {this.treat_order_is_enable_request == 1 && (
                        <td style={{width:"10rem"}}>コスト情報</td>
                      )}
                      <td style={{width:"10rem"}}>部位</td>
                      <td style={{width:"5rem"}}>方向</td>
                      <td style={{width:"15rem"}}>コメント</td>
                    </tr>
                    </thead>
                    <tbody id="detail_json_array_id">
                    {detail_json_array != null && detail_json_array.length >0 &&
                    detail_json_array.map((item, index)=>{
                      return (
                        <>
                          <tr onContextMenu={e => this.handleEdit(e, index)} className={this.state.set_detail_index === index ? 'selected set-data-row' : 'set-data-row'}>
                            <td>{item.set_name}</td>
                            <td className={'detail-view-btn'} style={{width:"6rem"}}>
                              {(item.treat_detail_item !== undefined && Object.keys(item.treat_detail_item).length > 0) && (
                                <div className="w-100">
                                  <div className="div-button" onClick={this.openSetDetailModal.bind(this, item.treat_detail_item, item.practice_name)}>詳細</div>
                                </div>
                              )}
                            </td>
                            {item.surface_data !== undefined ? (
                              <td style={{width:cost_width}}>
                                <div className="d-flex w-100">
                                  <div style={{width: "calc(100% - 4rem)"}}>{item.practice_name}</div>
                                  <div style={{width: "4rem"}}><Button type="common" onClick={this.openViewSurfaceModal.bind(this, item.total_surface, item.surface_data)}>面積</Button></div>
                                </div>
                              </td>
                            ):(
                              <td style={{width:cost_width}}>{item.practice_name}</td>
                            )}
                            {this.treat_order_is_enable_request == 1 && (
                              <td style={{width:"10rem"}}>{item.request_name}</td>
                            )}
                            {this.treat_order_part_position_mode != 0 ? (
                              <td style={{width:"10rem"}}>{item.position_name != undefined ? item.part_name + " " + item.position_name : item.part_name}</td>
                            ) : (
                              <td style={{width:"10rem"}}>{item.position_name != undefined ? item.position_name: ""}</td>
                            )}
                            <td style={{width:"5rem"}}>{item.side_name}</td>
                            <td style={{width:"15rem"}}>{displayLineBreak(item.comment)}</td>
                          </tr>
                        </>
                      )
                    })}
                    </tbody>
                  </table>
                </div>
                {(this.state.item_details.length > 0 && this.state.item_details[0]['item_id'] !== 0 || (this.state.all_data.enable_function_item !== undefined && this.state.all_data.enable_function_item === 1)) && (
                  <>
                    <div className={'home-label'} >
                      <span>在宅</span>
                      <Angle className={this.state.view_item_table === false ? 'angle':"angle close-icon"} icon={faAngleDown} onClick={this.viewItemTable.bind(this)} />
                    </div>
                    <div className={'set-item-detail-area'} id="set_item_detail_area" style={{display:"none"}}>
                      <ItemTableBody
                        function_id={6}
                        item_details={this.state.item_details}
                        setItemDetails={this.setItemDetails.bind(this)}
                        from_source="treatment"
                      />
                    </div>
                  </>
                )}

                {this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 && (
                  <>
                    <div className={'block-area'} style={{width:"100%"}}>
                      <div className={'block-title'}>追加指示・指導・処置等選択</div>
                      {this.state.additions.map(addition => {
                        return (
                          <>
                            <div className={'flex'}>
                              <Checkbox
                                label={addition.name}
                                getRadio={this.getAdditions.bind(this)}
                                number={addition.addition_id}
                                value={this.state.additions_check[addition.addition_id]}
                                name={`additions`}
                              />
                              {addition.sending_category === 3 && (
                                <>
                                  <Checkbox
                                    label={'送信する'}
                                    getRadio={this.getAdditionsSendFlag.bind(this)}
                                    number={addition.addition_id}
                                    value={this.state.additions_send_flag_check[addition.addition_id]}
                                    name={`additions_sending_flag`}
                                  />
                                  <div style={{fontSize:"0.875rem"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                </>
                              )}
                            </div>
                          </>
                        )
                      })}
                    </div>
                  </>
                )}
                <ContextMenu
                  {...this.state.contextMenu}
                  parent={this}
                  favouriteMenuType={this.state.favouriteMenuType}
                  index={this.state.index}
                />
                <ContextItemMenu
                  {...this.state.contextItemMenu}
                  parent={this}
                  favouriteMenuType={this.state.favouriteMenuType}
                  index={this.state.index}
                />

              </Wrapper>
            ) : (
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
            {this.context.$getKarteMode(this.props.patientId) == KARTEMODE.EXECUTE ? (
              <>
                {(this.state.number > 0 && this.state.state !== 1)  ? (
                  <Button className={save_tooltip !== "" ? "disable-btn": "red-btn"} onClick={this.save.bind(this)}>確定(指示)</Button>
                ):(
                  <Button className="disable-btn" isDisabled={true}>確定(指示)</Button>
                )}
                {(done_tooltip !== "") ? (
                  <Button className="disable-btn" tooltip={done_tooltip}>確定(指示& 実施)</Button>
                ):(
                  <Button className="red-btn" onClick = {this.save.bind(this, 1)}>確定(指示& 実施)</Button>
                )}
              </>
            ):(
              <>
                {(this.state.number > 0 && this.state.state === 1) ? (
                  <Button className="disable-btn" isDisabled={true}>確定(指示)</Button>
                ):(
                  <Button className={save_tooltip !=="" ? "disable_btn":"red-btn"} onClick = {this.save.bind(this)}>確定(指示)</Button>
                )}
                {(done_tooltip !== "") ? (
                  <Button className="disable-btn" tooltip={done_tooltip}>確定(指示& 実施)</Button>
                ):(
                  <Button className="red-btn" onClick = {this.save.bind(this, 1)}>確定(指示& 実施)</Button>
                )}
              </>
            )}
          </Modal.Footer>
          {this.state.isShowStaffList && (
            <DialSelectMasterModal
              selectMaster = {this.selectStaff}
              closeModal = {this.closeDoctorSelectModal}
              MasterCodeData = {this.state.staffs}
              MasterName = 'スタッフ'
            />
          )}
        </Modal>
        {this.state.isPracticeSelectModal && (
          <SelectPannelHarukaModal
            selectMaster = {this.setPractice}
            closeModal= {this.closeModal}
            MasterName= {'行為'}
            department_id= {this.state.display_department_id}
          />
        )}
        {this.state.isItemSelectModal && (
          <SelectPannelHarukaModal
            selectMaster = {this.setItemName}
            closeModal= {this.closeModal}
            MasterName= {'品名'}
            item_category_id={this.state.set_detail[this.state.cur_index]['classfic']}
            is_pagenation={true}
          />
        )}
        {this.state.isSetDetailModal && (
          <SetDetailViewModal
            closeModal= {this.closeModal}
            setDetailData= {this.state.setDetailData}
            detail_view_practice= {this.state.detail_view_practice}
          />
        )}
        {this.state.isOpenOxygenModal && (
          <OxygenCalculateModal
            closeModal={this.closeModal}
            handleOk={this.oxygenOk}
            modal_data={this.state.oxygen_data}
            practice_name={this.state.practice_name}
            treat_id={this.state.number}
            treat_detail_id={this.state.set_detail_order_number}
            select_practice={this.state.select_practice}
            selected_oxygen_date={formatDateTimeIE(this.state.collected_date)}
          />
        )}
        {this.state.isCountSurfaceModalOpen && (
          <CountSurfaceModal
            closeModal={this.closeModal}
            handleOk={this.surfaceOk}
            modal_data={this.state.surface_data}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeValidateAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeSystemAlertModal.bind(this)}
            handleOk= {this.closeSystemAlertModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isOpenDoneModal && (
          <TreatDoneModal
            patientId={this.props.patientId}
            closeModal={this.closeModal}
            from_page={'order-modal'}
            modal_data={this.state.done_modal_data}
            doneInspection={this.doneOk}
          />
        )}
      </>
    );
  }
}

HomeTreatmentModal.contextType = Context;
HomeTreatmentModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,
  cache_data:PropTypes.object,
};

export default HomeTreatmentModal;